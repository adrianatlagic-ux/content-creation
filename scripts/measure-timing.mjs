/**
 * Misst Wort-Zeitstempel aus einem fertigen Voiceover.
 *
 * Warum nicht per Transkriptions-API: die liefert hier zwar den Text, aber
 * keine Wortzeiten. Also messen wir selbst -- ffmpeg findet die Sprechpausen,
 * und die Woerter werden ausschliesslich in die Sprechabschnitte verteilt,
 * nie in eine Pause hinein. Das kostet nichts und ist bei jedem neuen
 * Voiceover derselbe Handgriff:
 *
 *   node scripts/measure-timing.mjs
 *
 * Liest    public/voice.mp3 und src/narration.txt
 * Schreibt src/timing.json
 *
 * FFMPEG_PATH setzen, falls ffmpeg nicht im PATH liegt.
 */
import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';

const AUDIO = 'public/voice.mp3';
const TEXT = 'src/narration.txt';
const OUT = 'src/timing.json';

/**
 * Der Stille-Schwellwert wird NICHT fest gesetzt, sondern aus dem gemessenen
 * Durchschnittspegel abgeleitet. Grund: Stimmen kommen unterschiedlich laut
 * aus der Erzeugung. Eine ruhige Aufnahme lag bei -25,5 dB Mittel, eine
 * energischere bei -15,9 dB -- ein fester Wert von -38 dB fand bei der
 * zweiten ueberhaupt keine Pause mehr und lieferte einen einzigen Abschnitt
 * ueber die volle Laenge.
 */
const NOISE_BELOW_MEAN = 14;
const MIN_PAUSE = 0.14;

/**
 * ffmpeg schreibt seine Analyse nach stderr, nicht nach stdout, und beendet
 * sich je nach Aufruf mit Exit 1. spawnSync liefert beide Stroeme unabhaengig
 * vom Exit-Code -- execFileSync wuerde bei Erfolg nur stdout zurueckgeben und
 * damit genau die Zeilen verschlucken, die wir brauchen.
 */
const runFfmpeg = (args) => {
  const bin = process.env.FFMPEG_PATH ?? 'ffmpeg';
  const r = spawnSync(bin, args, {encoding: 'utf8'});
  if (r.error) throw new Error(`ffmpeg nicht ausfuehrbar (${bin}): ${r.error.message}`);
  return `${r.stdout ?? ''}${r.stderr ?? ''}`;
};

// Erster Lauf: Durchschnittspegel messen, um den Schwellwert zu kalibrieren.
const levels = runFfmpeg(['-hide_banner', '-i', AUDIO, '-af', 'volumedetect', '-f', 'null', '-']);
const meanMatch = levels.match(/mean_volume: (-?[\d.]+) dB/);
if (!meanMatch) throw new Error(`Pegel nicht messbar aus:\n${levels.slice(0, 400)}`);
const meanDb = Number(meanMatch[1]);
const noiseDb = Math.round(meanDb - NOISE_BELOW_MEAN);

const raw = runFfmpeg([
  '-hide_banner', '-i', AUDIO,
  '-af', `silencedetect=noise=${noiseDb}dB:d=${MIN_PAUSE}`,
  '-f', 'null', '-',
]);

const durationMatch = raw.match(/Duration: (\d+):(\d+):([\d.]+)/);
if (!durationMatch) throw new Error(`Dauer nicht lesbar aus:\n${raw.slice(0, 400)}`);
const duration =
  Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]);

const silences = [];
const re = /silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g;
let m;
while ((m = re.exec(raw)) !== null) {
  silences.push({start: Number(m[1]), end: Number(m[2])});
}

/** Sprechabschnitte = alles zwischen den erkannten Stillen. */
const segments = [];
let edge = 0;
for (const s of silences) {
  if (s.start > edge + 0.05) segments.push({start: edge, end: s.start});
  edge = s.end;
}
if (duration > edge + 0.05) segments.push({start: edge, end: duration});
if (segments.length === 0) throw new Error('Keine Sprechabschnitte gefunden');

const words = readFileSync(TEXT, 'utf8').split(/\s+/).filter(Boolean);
const totalSpeech = segments.reduce((a, s) => a + (s.end - s.start), 0);
const weight = (w) => w.length + 1;
const totalWeight = words.reduce((a, w) => a + weight(w), 0);

// Zuteilung ueber KUMULATIVE Gewichtsgrenzen, nicht ueber ein Budget pro
// Abschnitt. Der Unterschied ist entscheidend: eine Zuteilung pro Abschnitt
// bricht ab, BEVOR das Budget ueberschritten wird, fuellt also jeden Abschnitt
// systematisch unter -- und der Rest sammelt sich im letzten an. Bei einem Lauf
// standen so die letzten zwanzig Woerter in 1,6 Sekunden.
//
// Hier laeuft stattdessen eine laufende Summe gegen eine laufende Grenze, und
// ein Wort faellt in den Abschnitt, in dem seine MITTE liegt. Das rundet, statt
// abzuschneiden, wodurch sich der Fehler nicht aufsummieren kann.
const timed = [];
let wordIndex = 0;
let cumWeight = 0;
let cumTarget = 0;

segments.forEach((segment, i) => {
  const span = segment.end - segment.start;
  cumTarget += (span / totalSpeech) * totalWeight;
  const isLast = i === segments.length - 1;

  const bucket = [];
  while (wordIndex < words.length) {
    const w = words[wordIndex];
    const middleOfWord = cumWeight + weight(w) / 2;
    if (!isLast && bucket.length > 0 && middleOfWord > cumTarget) break;
    bucket.push(w);
    cumWeight += weight(w);
    wordIndex += 1;
  }

  let cursor = segment.start;
  const bucketWeight = bucket.reduce((a, w) => a + weight(w), 0) || 1;
  for (const word of bucket) {
    const share = (weight(word) / bucketWeight) * span;
    timed.push({
      word,
      start: Number(cursor.toFixed(3)),
      end: Number((cursor + share).toFixed(3)),
    });
    cursor += share;
  }
});

if (timed.length !== words.length) {
  throw new Error(`Nur ${timed.length} von ${words.length} Woertern verteilt`);
}

// Sicherung gegen genau den Fehler von oben: kein Abschnitt darf mehr als ein
// Viertel aller Woerter aufnehmen, sonst ist die Zuteilung aus dem Tritt.
const perSegment = new Map();
for (const w of timed) {
  const seg = segments.findIndex((s) => w.start >= s.start - 1e-6 && w.start <= s.end + 1e-6);
  perSegment.set(seg, (perSegment.get(seg) ?? 0) + 1);
}
const worst = Math.max(...perSegment.values());
if (worst > words.length / 4) {
  throw new Error(`Ein Abschnitt haelt ${worst} von ${words.length} Woertern -- Zuteilung gestoert`);
}

writeFileSync(
  OUT,
  `${JSON.stringify({duration, meanDb, noiseDb, segments, words: timed}, null, 2)}\n`
);

console.log(`Dauer       ${duration.toFixed(2)} s`);
console.log(`Pegel       Mittel ${meanDb} dB, Schwelle ${noiseDb} dB`);
console.log(`Abschnitte  ${segments.length}`);
console.log(`Woerter     ${timed.length}`);
console.log(`geschrieben ${OUT}\n`);
segments.forEach((s, i) =>
  console.log(`  ${String(i + 1).padStart(2)}  ${s.start.toFixed(2)} - ${s.end.toFixed(2)}`)
);

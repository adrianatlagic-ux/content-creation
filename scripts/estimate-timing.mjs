/**
 * Schaetzt Wort-Zeitstempel, solange es noch kein Voiceover gibt.
 *
 * Gibt bewusst DIESELBE Struktur aus wie scripts/measure-timing.mjs. Sobald
 * das Voiceover da ist, wird nur der Erzeuger getauscht -- die Szenen und die
 * Untertitel-Komponente bleiben unveraendert.
 *
 *   node scripts/estimate-timing.mjs src/context/narration-einfach.txt src/context/timing-einfach.json
 *
 * Die Rate ist nicht geraten, sondern aus Video 1 gemessen: 124 Woerter in
 * 41,12 s bei Tempofaktor 1,22 sind 3,02 Woerter pro Sekunde. Pausen an
 * Satzgrenzen kommen aus derselben Aufnahme.
 */
import {readFileSync, writeFileSync} from 'node:fs';

const WORDS_PER_SECOND = 3.02;
const PAUSE_SENTENCE = 0.20;
const PAUSE_COMMA = 0.10;

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('Aufruf: node scripts/estimate-timing.mjs <narration.txt> <timing.json>');
  process.exit(1);
}

const words = readFileSync(inputPath, 'utf8').split(/\s+/).filter(Boolean);

const pauseAfter = (word) => {
  if (/[.!?]["»]?$/.test(word)) return PAUSE_SENTENCE;
  if (/[,:;]$/.test(word)) return PAUSE_COMMA;
  return 0;
};

const totalPause = words.reduce((a, w) => a + pauseAfter(w), 0);
const speakingTime = words.length / WORDS_PER_SECOND;
const weight = (w) => w.length + 1;
const totalWeight = words.reduce((a, w) => a + weight(w), 0);

const timed = [];
let cursor = 0;
for (const word of words) {
  const span = (weight(word) / totalWeight) * speakingTime;
  timed.push({
    word,
    start: Number(cursor.toFixed(3)),
    end: Number((cursor + span).toFixed(3)),
  });
  cursor += span + pauseAfter(word);
}

const duration = Number((cursor + 0.4).toFixed(2));

writeFileSync(
  outputPath,
  `${JSON.stringify({duration, estimated: true, wordsPerSecond: WORDS_PER_SECOND, words: timed}, null, 2)}\n`
);

console.log(`${inputPath}`);
console.log(`  Woerter      ${words.length}`);
console.log(`  Sprechzeit   ${speakingTime.toFixed(1)} s`);
console.log(`  Pausen       ${totalPause.toFixed(1)} s`);
console.log(`  Gesamt       ${duration.toFixed(1)} s`);
console.log(`  geschrieben  ${outputPath}`);

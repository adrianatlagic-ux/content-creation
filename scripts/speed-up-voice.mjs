/**
 * Beschleunigt ein Voiceover, ohne die Tonhoehe zu veraendern.
 *
 *   node scripts/speed-up-voice.mjs <eingabe.mp3> <ausgabe.mp3> [faktor]
 *   node scripts/speed-up-voice.mjs <eingabe.mp3> <ausgabe.mp3> --text <datei>
 *
 * Die zweite Form ist die richtige. Sie rechnet den Faktor aus der gemessenen
 * Rohdauer und der Wortzahl so aus, dass ZIEL_WPS herauskommt.
 *
 * Warum das noetig wurde: mit festem Faktor kam bei jeder Aufnahme ein anderes
 * Tempo heraus, weil die Rohaufnahmen unterschiedlich schnell sind. Gemessen
 * lagen die Videos bei 2,64 bis 3,02 Woertern je Sekunde -- das langsamste
 * 25 % unter dem Referenzkanal. Ein fester Faktor auf schwankende Eingabe
 * ergibt schwankende Ausgabe.
 *
 * Warum ueberhaupt: die Regieanweisungen im Text ([fast], [rapid]) wirken bei
 * geklonten Stimmen kaum -- die bringen ihr Tempo aus den Trainingsaufnahmen
 * mit. ffmpeg atempo dehnt stattdessen die Zeitachse und laesst die Tonhoehe
 * unangetastet: schneller, nicht hoeher.
 *
 * Eingabe und Ausgabe sind bewusst GETRENNTE Dateien und werden nie derselbe
 * Pfad sein duerfen. Eine frueehere Fassung schrieb in dieselbe Datei zurueck
 * und wurde versehentlich zweimal auf dieselbe Aufnahme angewandt -- aus 50,1 s
 * wurden 33,7 statt 41,1, und ohne aufgehobene Rohaufnahme waere die Aufnahme
 * verloren gewesen.
 */
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {ffmpegPfad} from './ffmpeg.mjs';

/**
 * Zielrate in Woertern je Sekunde. Zwei Korrekturen am Halluzination-
 * Vergleich: 2,64 W/s war "zu langsam", 3,3 W/s "ein wenig zu schnell",
 * 3,15 W/s immer noch etwas zu schnell. 3,0 ist die naechste, rundere Stufe.
 * Aendern heisst: alle Videos neu vertonen -- kostenlos, solange die
 * Rohaufnahme erhalten bleibt.
 */
const ZIEL_WPS = 3.0;

const [, , input, output, ...rest] = process.argv;

if (!input || !output) {
  console.error('Aufruf: node scripts/speed-up-voice.mjs <eingabe.mp3> <ausgabe.mp3> [faktor]');
  console.error('   oder: node scripts/speed-up-voice.mjs <eingabe.mp3> <ausgabe.mp3> --text <datei>');
  process.exit(1);
}
if (resolve(input) === resolve(output)) {
  console.error('Eingabe und Ausgabe muessen verschieden sein -- sonst laesst sich der Lauf');
  console.error('nicht wiederholen und eine zweite Anwendung beschleunigt doppelt.');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`Eingabe nicht gefunden: ${input}`);
  process.exit(1);
}

/** Rohdauer in Sekunden, aus ffmpegs eigener Analyse. */
const dauerVon = (datei) => {
  const r = spawnSync(
    ffmpegPfad(),
    ['-hide_banner', '-i', datei, '-f', 'null', '-'],
    {encoding: 'utf8'}
  );
  // ffmpeg schreibt die Analyse nach stderr und beendet mit Fehlercode.
  const treffer = (r.stderr ?? '').match(/time=(\d+):(\d+):([\d.]+)/g);
  if (!treffer?.length) throw new Error(`Dauer von ${datei} nicht lesbar`);
  const [, h, m, sek] = treffer[treffer.length - 1].match(/time=(\d+):(\d+):([\d.]+)/);
  return Number(h) * 3600 + Number(m) * 60 + Number(sek);
};

let factor;
if (rest[0] === '--text') {
  const textDatei = rest[1];
  if (!textDatei || !existsSync(textDatei)) {
    console.error(`Sprechertext nicht gefunden: ${textDatei ?? '(fehlt)'}`);
    process.exit(1);
  }
  const woerter = readFileSync(textDatei, 'utf8').split(/\s+/).filter(Boolean).length;
  const roh = dauerVon(input);
  const ziel = woerter / ZIEL_WPS;
  factor = Number((roh / ziel).toFixed(3));
  console.log(
    `${woerter} Woerter, roh ${roh.toFixed(2)} s (${(woerter / roh).toFixed(2)} W/s) ` +
      `-> Ziel ${ziel.toFixed(2)} s bei ${ZIEL_WPS} W/s`
  );
} else {
  factor = Number(rest[0] ?? '1.22');
}

// atempo verarbeitet je Durchgang 0,5 bis 2,0; darueber muss verkettet werden.
if (!Number.isFinite(factor) || factor < 0.5 || factor > 2.0) {
  console.error(`Faktor ${factor} liegt ausserhalb des von atempo unterstuetzten Bereichs 0,5-2,0.`);
  process.exit(1);
}
// Die Schwelle stand frueher bei 1,4. Bei einer Zielrate von 3,0 W/s sind
// hoehere Faktoren normal, weil die Rohaufnahmen langsam sind -- gewarnt wird
// erst, wo die Tonhoehenkorrektur hoerbar zu arbeiten beginnt.
if (factor > 1.65) {
  console.warn(`Warnung: Faktor ${factor} -- vor dem Rendern einmal anhoeren.`);
}

const bin = ffmpegPfad();
const r = spawnSync(
  bin,
  ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-filter:a', `atempo=${factor}`, output],
  {encoding: 'utf8'}
);
if (r.error) throw new Error(`ffmpeg nicht ausfuehrbar (${bin}): ${r.error.message}`);
if (r.status !== 0) throw new Error(`ffmpeg fehlgeschlagen:\n${r.stderr}`);

console.log(`${input} -> ${output} (Faktor ${factor})`);
console.log(`Jetzt neu messen: node scripts/measure-timing.mjs ${output} <narration.txt> <timing.json>`);

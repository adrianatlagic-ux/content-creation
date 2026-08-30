/**
 * Beschleunigt ein Voiceover, ohne die Tonhoehe zu veraendern.
 *
 *   node scripts/speed-up-voice.mjs <eingabe.mp3> <ausgabe.mp3> [faktor]
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
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';

const [, , input, output, factorArg = '1.22'] = process.argv;

if (!input || !output) {
  console.error('Aufruf: node scripts/speed-up-voice.mjs <eingabe.mp3> <ausgabe.mp3> [faktor]');
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

const factor = Number(factorArg);
// atempo verarbeitet je Durchgang 0,5 bis 2,0; darueber muss verkettet werden.
if (!Number.isFinite(factor) || factor < 0.5 || factor > 2.0) {
  console.error(`Faktor ${factorArg} liegt ausserhalb des von atempo unterstuetzten Bereichs 0,5-2,0.`);
  process.exit(1);
}
if (factor > 1.4) {
  console.warn(`Warnung: Faktor ${factor} klingt erfahrungsgemaess gehetzt statt lebendig.`);
}

const bin = process.env.FFMPEG_PATH ?? 'ffmpeg';
const r = spawnSync(
  bin,
  ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-filter:a', `atempo=${factor}`, output],
  {encoding: 'utf8'}
);
if (r.error) throw new Error(`ffmpeg nicht ausfuehrbar (${bin}): ${r.error.message}`);
if (r.status !== 0) throw new Error(`ffmpeg fehlgeschlagen:\n${r.stderr}`);

console.log(`${input} -> ${output} (Faktor ${factor})`);
console.log(`Jetzt neu messen: node scripts/measure-timing.mjs ${output} <narration.txt> <timing.json>`);

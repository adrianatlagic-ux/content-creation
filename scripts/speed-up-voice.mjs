/**
 * Beschleunigt das Voiceover nachträglich, ohne die Tonhöhe zu verändern.
 *
 * Zweiter Hebel neben den Regieanweisungen im Text: das Modell folgt einem
 * [fast] nur ungefähr, dieser Schritt ist exakt und kostenlos. ffmpeg atempo
 * dehnt die Zeitachse und laesst die Tonhoehe unangetastet -- die Stimme
 * klingt schneller, nicht hoeher.
 *
 *   node scripts/speed-up-voice.mjs 1.12
 *
 * Schreibt public/voice.mp3 neu. Danach zwingend die Zeiten neu messen:
 *
 *   node scripts/measure-timing.mjs
 *
 * Werte ueber etwa 1,25 klingen gehetzt statt lebendig.
 */
import {spawnSync} from 'node:child_process';
import {renameSync} from 'node:fs';

const factor = Number(process.argv[2]);
if (!Number.isFinite(factor) || factor < 0.5 || factor > 2.0) {
  console.error('Faktor zwischen 0.5 und 2.0 angeben, z.B.: node scripts/speed-up-voice.mjs 1.12');
  process.exit(1);
}

const bin = process.env.FFMPEG_PATH ?? 'ffmpeg';
const TARGET = 'public/voice.mp3';
const TMP = 'public/voice.tmp.mp3';

const r = spawnSync(
  bin,
  ['-hide_banner', '-loglevel', 'error', '-y', '-i', TARGET, '-af', `atempo=${factor}`, TMP],
  {encoding: 'utf8'}
);
if (r.error) throw new Error(`ffmpeg nicht ausfuehrbar (${bin}): ${r.error.message}`);
if (r.status !== 0) throw new Error(`ffmpeg fehlgeschlagen:\n${r.stderr}`);

renameSync(TMP, TARGET);
console.log(`${TARGET} um Faktor ${factor} beschleunigt.`);
console.log('Jetzt neu messen: node scripts/measure-timing.mjs');

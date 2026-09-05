#!/usr/bin/env node
/**
 * Zieht Frame 0 aus dem fertigen Render -- das Bild, das Instagram im Feed
 * zeigt, bevor jemand antippt. Schritt 7a in orchestrator.md.
 *
 *   node scripts/cover.mjs <id> [ziel.png]
 *
 * Kein Video gilt als fertig, ohne dieses Bild einmal angesehen zu haben:
 * jede Karte im Format blendet ueber ein paar Frames ein, Frame 0 selbst
 * zeigte deshalb einmal praktisch nur Hintergrund und ein blasses
 * Maskottchen -- strukturell behoben durch die Titelzeile in der
 * irrtum-Szene (siehe grafik.md), aber ein zu langer `titel` oder ein
 * kuenftiger Bautyp an erster Stelle koennten das Problem auf neue Art
 * wieder einfuehren. Deshalb bleibt die Sichtpruefung ein eigener Schritt,
 * nicht nur eine einmalige Korrektur.
 */
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {ffmpegPfad} from './ffmpeg.mjs';

const id = process.argv[2];
if (!id) {
  console.error('Aufruf: node scripts/cover.mjs <id> [ziel.png]');
  process.exit(1);
}
const quelle = `out/${id}.mp4`;
const ziel = process.argv[3] ?? `/tmp/${id}-cover.png`;

if (!existsSync(quelle)) {
  console.error(`${quelle} fehlt -- erst "node scripts/render.mjs ${id}".`);
  process.exit(1);
}

const r = spawnSync(
  ffmpegPfad(),
  ['-hide_banner', '-loglevel', 'error', '-y', '-i', quelle, '-update', '1', '-frames:v', '1', ziel],
  {encoding: 'utf8'}
);
if (r.error) throw new Error(`ffmpeg nicht ausfuehrbar: ${r.error.message}`);
if (r.status !== 0) throw new Error(`ffmpeg fehlgeschlagen:\n${r.stderr}`);

console.log(`${quelle} (Frame 0) -> ${ziel}`);
console.log('Ansehen, bevor das Video als fertig gilt -- siehe orchestrator.md, Schritt 7a.');

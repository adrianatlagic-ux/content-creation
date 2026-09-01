#!/usr/bin/env node
/**
 * Rendert ein Video aus videos/<id>.json.
 *
 *   node scripts/render.mjs <id> [ziel.mp4]
 *
 * Kapselt nur den Remotion-Aufruf samt Browser-Pfad: das normale Chrome hat
 * den alten Headless-Modus entfernt, den Remotion ansteuert, deshalb muss
 * headless_shell explizit gesetzt werden.
 */
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';

const id = process.argv[2];
if (!id) {
  console.error('Aufruf: node scripts/render.mjs <id> [ziel.mp4]');
  process.exit(1);
}
const ziel = process.argv[3] ?? `out/${id}.mp4`;

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

if (!existsSync(`videos/${id}.zeiten.json`)) {
  console.error(`videos/${id}.zeiten.json fehlt -- erst "node scripts/zeiten.mjs ${id}".`);
  process.exit(1);
}

execFileSync(
  'npx',
  ['remotion', 'render', `Reel-${id}`, ziel, `--browser-executable=${BROWSER}`],
  {stdio: 'inherit'}
);

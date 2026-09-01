#!/usr/bin/env node
/**
 * Schreibt src/format/registry.ts aus dem Inhalt von videos/.
 *
 *   node scripts/registry.mjs
 *
 * Remotion braucht statische Importe, ein neues Video soll aber keinen
 * Code-Eingriff kosten -- sonst waere die Datei-statt-Code-Idee hinfaellig.
 * Deshalb wird die Liste erzeugt statt gepflegt.
 */
import {readdirSync, writeFileSync} from 'node:fs';

const ids = readdirSync('videos')
  .filter((f) => f.endsWith('.json') && !f.includes('.zeiten.') && !f.includes('.messung.'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();

const sicher = (id) => id.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());

const zeilen = [
  '// Erzeugt von scripts/registry.mjs -- nicht von Hand aendern.',
  "import type {VideoDef, Zeiten} from './schema';",
  '',
  ...ids.flatMap((id) => [
    `import ${sicher(id)}Def from '../../videos/${id}.json';`,
    `import ${sicher(id)}Zeiten from '../../videos/${id}.zeiten.json';`,
  ]),
  '',
  'export const VIDEOS: {id: string; video: VideoDef; zeiten: Zeiten; stimme: string}[] = [',
  ...ids.map(
    (id) =>
      `  {id: '${id}', video: ${sicher(id)}Def as VideoDef, ` +
      `zeiten: ${sicher(id)}Zeiten as Zeiten, stimme: '${id}.mp3'},`
  ),
  '];',
  '',
];

writeFileSync('src/format/registry.ts', zeilen.join('\n'));
console.log(`registry.ts: ${ids.length} Video(s) -- ${ids.join(', ')}`);

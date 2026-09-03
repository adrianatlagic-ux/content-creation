#!/usr/bin/env node
/**
 * Schreibt den Sprechertext einer Videodatei heraus.
 *
 *   node scripts/narration.mjs <id>          -> videos/<id>.narration.txt
 *
 * Der Text steht je Szene in videos/<id>.json. Eine zweite, von Hand
 * gepflegte Textdatei daneben waere eine Fehlerquelle: zeiten.mjs vergleicht
 * die Messung Wort fuer Wort gegen den Text aus dem JSON, und driftet die
 * Kopie ab, bricht der Lauf erst nach der bezahlten Vertonung ab.
 *
 * Die Zeilen bleiben getrennt: bei tipps ist Zeile 0 die Ueberleitung und
 * jede weitere ein Tipp, und zeiten.mjs leitet daraus die Einsaetze ab.
 */
import {readFileSync, writeFileSync} from 'node:fs';

const id = process.argv[2];
if (!id) {
  console.error('Aufruf: node scripts/narration.mjs <id>');
  process.exit(1);
}

const video = JSON.parse(readFileSync(`videos/${id}.json`, 'utf8'));
const zeilen = video.szenen.flatMap((szene) => szene.text);
const ziel = `videos/${id}.narration.txt`;

writeFileSync(ziel, `${zeilen.join('\n')}\n`, 'utf8');

const woerter = zeilen.join(' ').split(/\s+/).filter(Boolean).length;
console.log(`${ziel}: ${zeilen.length} Zeilen, ${woerter} Woerter`);

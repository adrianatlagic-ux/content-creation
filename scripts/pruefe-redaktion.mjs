#!/usr/bin/env node
import {ladePaket, fingerprint, pruefeRedaktion} from './redaktion.mjs';

try {
  const [id, ...flags] = process.argv.slice(2);
  if (!id || flags.some((f) => f !== '--hash')) throw new Error('Aufruf: node scripts/pruefe-redaktion.mjs <id> [--hash]');
  const paket = ladePaket(id);
  if (flags.includes('--hash')) {
    console.log(fingerprint(paket));
  } else {
    const fehler = pruefeRedaktion(paket);
    if (fehler.length) throw new Error(fehler.join('\n'));
    console.log('Redaktion: Belege/Review vorhanden und aktueller Stand gebunden. Kein automatischer Wahrheitsnachweis.');
  }
} catch (e) {
  console.error(`Redaktion blockiert: ${e.message}`);
  process.exitCode = 1;
}

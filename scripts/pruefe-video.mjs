#!/usr/bin/env node
/**
 * Prueft videos/<id>.json, bevor irgendetwas Geld kostet.
 *
 *   node scripts/pruefe-video.mjs <id>
 *
 * Die Vertonung kostet je Video rund 17 Cent und ist der erste teure Schritt.
 * Alles, was sich vorher aus der Datei allein feststellen laesst, gehoert
 * hierher -- ein Fehler, der erst im fertigen Render auffaellt, hat die
 * Vertonung schon bezahlt.
 */
import {readFileSync} from 'node:fs';

const id = process.argv[2];
if (!id) {
  console.error('Aufruf: node scripts/pruefe-video.mjs <id>');
  process.exit(1);
}

const video = JSON.parse(readFileSync(`videos/${id}.json`, 'utf8'));
const fehler = [];
const warnung = [];

const TYPEN = ['irrtum', 'kasten', 'voll', 'neulesen', 'tokens', 'kosten', 'tipps', 'schluss'];
const POSEN = ['denkend', 'skeptisch', 'erklaerend', 'selbstsicher'];

/** Gemessen an Video 1: 3,02 Woerter je Sekunde nach der Tempoanpassung. */
const WPS = 3.02;
/** Watch-Time-Schwelle: 40 % von 25 s sind 10 s, von 42 s schon 17 s. */
const ZIEL_SEKUNDEN = {min: 22, max: 34};

if (video.id !== id) fehler.push(`id ist "${video.id}", Datei heisst "${id}"`);
if (!Array.isArray(video.schritte) || video.schritte.length < 3 || video.schritte.length > 5) {
  fehler.push(`schritte braucht 3 bis 5 Eintraege, hat ${video.schritte?.length}`);
}

const szenen = video.szenen ?? [];
if (szenen.length < 4) fehler.push(`nur ${szenen.length} Szenen, mindestens 4`);
if (szenen[0]?.typ !== 'irrtum') fehler.push('erste Szene muss "irrtum" sein (der Hook)');
if (szenen.at(-1)?.typ !== 'schluss') fehler.push('letzte Szene muss "schluss" sein');
if (szenen.at(-2)?.typ !== 'tipps') fehler.push('vorletzte Szene muss "tipps" sein');

let woerter = 0;

szenen.forEach((szene, i) => {
  const wo = `Szene ${i + 1} (${szene.typ})`;

  if (!TYPEN.includes(szene.typ)) fehler.push(`${wo}: unbekannter Typ`);
  if (!POSEN.includes(szene.pose)) fehler.push(`${wo}: unbekannte Pose "${szene.pose}"`);
  if (szene.kapitel !== szene.kapitel?.toUpperCase()) {
    fehler.push(`${wo}: kapitel muss in Grossbuchstaben stehen ("${szene.kapitel}")`);
  }
  if (szene.kapitel?.length > 24) warnung.push(`${wo}: kapitel ist ${szene.kapitel.length} Zeichen lang`);
  if (szene.schritt >= video.schritte.length) {
    fehler.push(`${wo}: schritt ${szene.schritt} gibt es nicht (nur ${video.schritte.length})`);
  }

  if (!Array.isArray(szene.text) || szene.text.length === 0) {
    fehler.push(`${wo}: kein Sprechertext`);
  } else {
    woerter += szene.text.join(' ').split(/\s+/).filter(Boolean).length;
  }

  // Umlaute: dreimal sind in fertigen Renders "laeuft" und "zurueck" gelandet,
  // weil im Code transliteriert wird. Im Inhalt ist das ein Fehler.
  // Strukturfelder sind ausgenommen -- "erklaerend" ist ein Posename, kein Text.
  const STRUKTUR = ['typ', 'pose', 'kapitel'];
  Object.entries(szene).forEach(([schluessel, wert]) => {
    if (typeof wert !== 'string' || STRUKTUR.includes(schluessel)) return;
    if (/\b\w*(ae|oe|ue)\w*\b/.test(wert) && !/[a-z](ae|oe|ue)r\b/.test(wert)) {
      const treffer = wert.match(/\b\w*(?:ae|oe|ue)\w*\b/g)?.join(', ');
      warnung.push(`${wo}, ${schluessel}: moeglicherweise umschriebene Umlaute (${treffer})`);
    }
    ['*', '_'].forEach((z) => {
      if ((wert.split(z).length - 1) % 2 !== 0) {
        fehler.push(`${wo}, ${schluessel}: ungerade Anzahl "${z}"`);
      }
    });
  });

  if (szene.typ === 'tipps') {
    if (szene.tipps?.length !== 3) fehler.push(`${wo}: genau 3 Tipps erwartet, ${szene.tipps?.length} gefunden`);
    if (szene.text.length !== (szene.tipps?.length ?? 0) + 1) {
      fehler.push(
        `${wo}: ${szene.tipps?.length} Tipps brauchen ${(szene.tipps?.length ?? 0) + 1} Textzeilen ` +
          `(Ueberleitung plus je Tipp), gefunden ${szene.text.length}`
      );
    }
    szene.tipps?.forEach((t, n) => {
      if (t.text.length > 68) warnung.push(`${wo}: Tipp ${n + 1} ist ${t.text.length} Zeichen -- bricht evtl. um`);
    });
  }

  if (szene.typ === 'kasten' || szene.typ === 'voll' || szene.typ === 'neulesen') {
    if (!szene.nachrichten?.length) fehler.push(`${wo}: keine nachrichten`);
    if (!szene.kapazitaet) fehler.push(`${wo}: kapazitaet fehlt`);
    szene.nachrichten?.forEach((n) => {
      if (n.label.length > 26) warnung.push(`${wo}: "${n.label}" ist ${n.label.length} Zeichen, passt evtl. nicht`);
    });
  }
});

const sekunden = woerter / WPS;
if (sekunden < ZIEL_SEKUNDEN.min) {
  warnung.push(`geschaetzt ${sekunden.toFixed(0)} s -- unter ${ZIEL_SEKUNDEN.min} s wirkt es abgehackt`);
}
if (sekunden > ZIEL_SEKUNDEN.max) {
  fehler.push(
    `geschaetzt ${sekunden.toFixed(0)} s bei ${woerter} Woertern. Ueber ${ZIEL_SEKUNDEN.max} s wird die ` +
      `40-%-Watch-Time-Schwelle zu teuer: ${(sekunden * 0.4).toFixed(0)} s muessten im Schnitt geschaut werden.`
  );
}

console.log(`${id}: ${szenen.length} Szenen, ${woerter} Woerter, geschaetzt ${sekunden.toFixed(1)} s`);
warnung.forEach((w) => console.log(`  Hinweis  ${w}`));
fehler.forEach((f) => console.log(`  FEHLER   ${f}`));

if (fehler.length) {
  console.error(`\n${fehler.length} Fehler -- nicht vertonen, erst beheben.`);
  process.exit(1);
}
console.log(warnung.length ? '\nDurchgelassen, Hinweise pruefen.' : '\nSauber.');

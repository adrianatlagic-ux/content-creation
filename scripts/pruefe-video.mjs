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

const TYPEN = [
  'irrtum', 'kasten', 'voll', 'neulesen', 'tokens', 'kosten',
  'terminal', 'waage', 'streuung', 'landkarte', 'tipps', 'schluss',
];
const POSEN = ['denkend', 'skeptisch', 'erklaerend', 'selbstsicher'];

/** Gemessen an Video 1: 3,02 Woerter je Sekunde nach der Tempoanpassung. */
const WPS = 3.02;
/** Sprechpausen, dieselben Werte wie in scripts/estimate-timing.mjs. */
const PAUSE_SATZ = 0.2;
const PAUSE_KOMMA = 0.1;
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
let pausen = 0;

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
    const roh = szene.text.join(' ');
    woerter += roh.split(/\s+/).filter(Boolean).length;
    // Ohne die Pausen lag die Schaetzung rund 13 % unter der tatsaechlichen
    // Laenge -- genug, um ein zu langes Video durchzulassen.
    pausen += (roh.match(/[.!?]/g) ?? []).length * PAUSE_SATZ;
    pausen += (roh.match(/,/g) ?? []).length * PAUSE_KOMMA;
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

  if (szene.typ === 'terminal') {
    if (!szene.zeilen?.length) fehler.push(`${wo}: keine zeilen`);
    if (szene.zeilen?.length > 5) {
      warnung.push(`${wo}: ${szene.zeilen.length} Zeilen -- ab 6 wird das Fenster zu hoch`);
    }
    szene.zeilen?.forEach((z, n) => {
      if (!['system', 'nutzer', 'antwort'].includes(z.rolle)) {
        fehler.push(`${wo}: Zeile ${n + 1} hat Rolle "${z.rolle}", erlaubt sind system/nutzer/antwort`);
      }
      if (z.text.length > 40) warnung.push(`${wo}: Zeile ${n + 1} ist ${z.text.length} Zeichen, bricht evtl. um`);
    });
  }

  if (szene.typ === 'waage') {
    [['links', szene.links], ['rechts', szene.rechts]].forEach(([seite, s]) => {
      if (!s?.punkte?.length) fehler.push(`${wo}: Seite ${seite} hat keine punkte`);
      if (s?.punkte?.length > 4) warnung.push(`${wo}: Seite ${seite} hat ${s.punkte.length} Punkte, ab 5 wird es eng`);
      if (s?.titel?.length > 16) warnung.push(`${wo}: Titel "${s.titel}" ist ${s.titel.length} Zeichen`);
      s?.punkte?.forEach((punkt) => {
        if (punkt.length > 30) warnung.push(`${wo}: "${punkt}" ist ${punkt.length} Zeichen, Spalte ist schmal`);
      });
    });
  }

  if (szene.typ === 'streuung') {
    if (szene.antworten?.length < 2) fehler.push(`${wo}: mindestens 2 Antworten, sonst gibt es keine Streuung`);
    if (szene.antworten?.length > 3) fehler.push(`${wo}: hoechstens 3 Antworten, sonst laeuft es aus dem Bild`);
    szene.antworten?.forEach((a, n) => {
      if (a.text.length > 42) warnung.push(`${wo}: Antwort ${n + 1} ist ${a.text.length} Zeichen`);
    });
  }

  if (szene.typ === 'landkarte') {
    if (szene.punkte?.length < 3) fehler.push(`${wo}: mindestens 3 Punkte`);
    if (szene.punkte?.length > 6) warnung.push(`${wo}: ${szene.punkte.length} Punkte -- ab 7 ueberlappen die Namen`);
    szene.punkte?.forEach((punkt) => {
      // Beschriftung steht rechts vom Punkt. Die Karte reicht bis 960, die
      // Safe Zone endet bei 900 -- weiter rechts liegt der Name unter
      // Instagrams Knopfleiste.
      if (punkt.x > 0.72) {
        fehler.push(`${wo}: Punkt "${punkt.label}" liegt bei x=${punkt.x}, ueber 0.72 verdeckt Instagram den Namen`);
      }
      if (punkt.x < 0 || punkt.y < 0 || punkt.y > 1) {
        fehler.push(`${wo}: Punkt "${punkt.label}" liegt ausserhalb 0..1`);
      }
      if (punkt.label.length > 14) warnung.push(`${wo}: Name "${punkt.label}" ist lang fuer die Karte`);
    });
    if (szene.verbindung) {
      szene.verbindung.forEach((i) => {
        if (i < 0 || i >= (szene.punkte?.length ?? 0)) {
          fehler.push(`${wo}: verbindung zeigt auf Punkt ${i}, den es nicht gibt`);
        }
      });
    }
  }

  if (szene.typ === 'kasten' || szene.typ === 'voll' || szene.typ === 'neulesen') {
    if (!szene.nachrichten?.length) fehler.push(`${wo}: keine nachrichten`);
    if (!szene.kapazitaet) fehler.push(`${wo}: kapazitaet fehlt`);
    szene.nachrichten?.forEach((n) => {
      if (n.label.length > 26) warnung.push(`${wo}: "${n.label}" ist ${n.label.length} Zeichen, passt evtl. nicht`);
    });
  }
});

const sekunden = woerter / WPS + pausen;

// Eine Probe zeigt Bautypen und wird nicht gepostet -- fuer sie gilt die
// Laengenregel nicht, alle anderen Pruefungen schon.
if (video.probe) {
  console.log('  Hinweis  als Probe markiert, Laengenregel ausgesetzt');
} else if (sekunden < ZIEL_SEKUNDEN.min) {
  warnung.push(`geschaetzt ${sekunden.toFixed(0)} s -- unter ${ZIEL_SEKUNDEN.min} s wirkt es abgehackt`);
} else if (sekunden > ZIEL_SEKUNDEN.max) {
  fehler.push(
    `geschaetzt ${sekunden.toFixed(0)} s bei ${woerter} Woertern. Ueber ${ZIEL_SEKUNDEN.max} s wird die ` +
      `40-%-Watch-Time-Schwelle zu teuer: ${(sekunden * 0.4).toFixed(0)} s muessten im Schnitt geschaut werden.`
  );
}

console.log(
  `${id}: ${szenen.length} Szenen, ${woerter} Woerter, ` +
    `geschaetzt ${sekunden.toFixed(1)} s (davon ${pausen.toFixed(1)} s Pausen)`
);
warnung.forEach((w) => console.log(`  Hinweis  ${w}`));
fehler.forEach((f) => console.log(`  FEHLER   ${f}`));

if (fehler.length) {
  console.error(`\n${fehler.length} Fehler -- nicht vertonen, erst beheben.`);
  process.exit(1);
}
console.log(warnung.length ? '\nDurchgelassen, Hinweise pruefen.' : '\nSauber.');

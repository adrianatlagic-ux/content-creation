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
  'irrtum', 'behaelter', 'ueberlauf', 'durchlauf', 'zerlegung', 'balken',
  'fenster', 'waage', 'streuung', 'karte', 'tipps', 'schluss',
];
const POSEN = ['denkend', 'skeptisch', 'erklaerend', 'selbstsicher'];

/**
 * Zielrate, identisch mit ZIEL_WPS in scripts/speed-up-voice.mjs. Wird sie
 * dort geaendert, gehoert sie hier mitgeaendert -- sonst schaetzt der Pruefer
 * gegen ein Tempo, das nicht produziert wird.
 */
const WPS = 3.0;

/**
 * Laengster erlaubter Stillstand innerhalb einer Szene, in Sekunden.
 *
 * Gemessen an den fertigen Videos lag Halluzination bei 1,4 Ereignissen je
 * 10 Sekunden -- alle sieben Sekunden passierte etwas. Die frueheren Videos
 * lagen bei 4,0 bis 4,6. Eine reine Dichteregel liesse sich durch Klumpen
 * erfuellen (drei Ereignisse in einer Sekunde, dann neun Sekunden nichts),
 * deshalb wird der groesste Abstand geprueft, nicht der Durchschnitt.
 */
const MAX_STILLSTAND = 3.0;

/**
 * Szenen ueber dieser Dauer gehoeren geteilt, auch wenn sich etwas bewegt.
 * tipps ist ausgenommen: sie ist naturgemaess die laengste Szene und verteilt
 * ihre drei Einsaetze ueber die volle Laenge.
 */
const MAX_SZENENDAUER = 12.0;
const OHNE_DAUERGRENZE = ['tipps'];

/**
 * Pflichtfelder je Bautyp. Fehlt eines, rendert die Szene leer statt zu
 * brechen -- eine Umbenennung hatte in einer Videodatei aus `teile` ein
 * Feld namens `zerlegung` gemacht, und der Token-Streifen waere still
 * verschwunden.
 */
const PFLICHTFELDER = {
  irrtum: ['behauptung', 'wahrheit'],
  zerlegung: ['titel', 'satz', 'teile', 'fussnote'],
  behaelter: ['nachrichten', 'kapazitaet'],
  ueberlauf: ['nachrichten', 'kapazitaet', 'folge'],
  durchlauf: ['nachrichten', 'kapazitaet', 'hinweis', 'pointe'],
  balken: ['titel', 'reihen', 'folge'],
  fenster: ['fenster', 'zeilen'],
  waage: ['links', 'rechts', 'urteil'],
  streuung: ['frage', 'antworten'],
  karte: ['punkte', 'hinweis'],
  tipps: ['tipps'],
  schluss: ['pointe', 'merksatz'],
};

/**
 * Bautypen mit dauerhafter Bewegung. Bei ihnen steht nie etwas still, auch
 * wenn im JSON keine Zeitpunkte auftauchen: der Suchstrahl wandert. Sie sind
 * von der Stillstandspruefung ausgenommen.
 *
 * `fenster` steht bewusst nicht mehr pauschal hier: nur im Terminal-Stil
 * blinkt ein Cursor durchgehend. Im Chat-Stil steht seit dem Eingabefeld
 * nichts mehr, das dauerhaft animiert -- die Szene wird jetzt an ihren
 * echten zeilen[].at-Zeiten gemessen, wie jeder andere Bautyp auch.
 */
const DAUERBEWEGT = ['durchlauf'];
const dauerbewegt = (szene) => DAUERBEWEGT.includes(szene.typ) || (szene.typ === 'fenster' && szene.stil === 'terminal');

/**
 * Ereignisse, die im Bauteil stehen und nicht in der Videodatei: eine Karte
 * mit fester Verzoegerung, ein Strich, eine Fussnote. Wer nur `at`-Felder
 * zaehlt, meldet an diesen Stellen Stillstand, wo eine Karte aufgeht.
 *
 * `feld` heisst: nur zaehlen, wenn dieses Feld besetzt ist. Die Zeiten stehen
 * in src/format/scenes.tsx -- aendern sie sich dort, gehoeren sie hier mit.
 */
const EINGEBAUT = {
  zerlegung: [{at: 0.13}],
  balken: [{at: 0.13}, {at: 4.0, feld: 'folge'}, {at: 5.0, feld: 'fussnote'}],
  karte: [{at: 2.8, feld: 'hinweis'}],
};

/** Zeit, zu der die Balken-Folgekarte aufgeht -- unten eigens geprueft. */
const BALKEN_FOLGE = 4.0;
const BALKEN_FUSSNOTE = 5.0;

/** Abstand der Streuungs-Fussnote zur letzten Antwort, siehe `Streuung`. */
const STREUUNG_NACHLAUF = 1.2;

/** Sprechdauer eines Textstuecks, gleiche Rechnung wie unten fuer die Szene. */
const dauerVonText = (roh) =>
  roh.split(/\s+/).filter(Boolean).length / WPS +
  (roh.match(/[.!?]/g) ?? []).length * PAUSE_SATZ +
  (roh.match(/,/g) ?? []).length * PAUSE_KOMMA;

/**
 * Wann die drei Tipp-Karten aufgehen: Zeile 0 ist die Ueberleitung, danach
 * eine Zeile je Tipp. Die Karte erscheint, sobald ihre Zeile beginnt.
 */
const einsaetzeSchaetzen = (szene) => {
  const zeilen = szene.text ?? [];
  const zeiten = [];
  let bisher = 0;
  for (let z = 0; z < zeilen.length - 1; z += 1) {
    bisher += dauerVonText(zeilen[z]);
    zeiten.push(bisher);
  }
  return zeiten;
};

/**
 * Alle Ereignisse einer Tipps-Szene: je Tipp die Karte, und darunter der
 * durchgehend wachsende Markerstrich (siehe Komponente `Tipps`). Der Strich
 * bewegt sich staendig; hier wird er als Reihe von Stuetzstellen im
 * Sekundentakt abgebildet, damit die Stillstandspruefung ihn ueberhaupt
 * sehen kann -- sie kennt nur Zeitpunkte.
 */
const STUETZ = 1.0;
const stuetzstellen = (von, bis) => {
  const punkte = [];
  for (let t = von; t < bis; t += STUETZ) punkte.push(t);
  return punkte;
};

const tippEreignisse = (szene, dauer, gemesseneEinsaetze) => {
  const ab = gemesseneEinsaetze ?? einsaetzeSchaetzen(szene);
  return ab.flatMap((a, i) => [a, ...stuetzstellen(a + STUETZ, ab[i + 1] ?? dauer)]);
};

/**
 * Ab welcher Sekunde in einem Szenentyp der Marker laeuft. Ab da steht nichts
 * mehr still, egal wie lang die Szene wird -- vorher endete irrtum nach 3,5 s
 * und schluss nach 0,8 s, und beide standen den Rest der Szene reglos da.
 */
const MARKER_AB = {irrtum: 3.9, schluss: 1.3};

/**
 * Zeitpunkte, an denen sich in einer Szene sichtbar etwas tut.
 *
 * Nicht alle stehen im JSON -- mehrere Bautypen staffeln ihre Elemente im
 * Code. Eine erste Fassung zaehlte nur `at`-Felder und meldete deshalb bei
 * zerlegung, durchlauf und waage null Ereignisse, obwohl sich dort etwas
 * bewegt. Eine Regel, die falsch anschlaegt, wird ignoriert.
 */
const ereignisseVon = (szene, dauer, einsaetze) => {
  const ausAt = [];
  const sammle = (o) => {
    if (Array.isArray(o)) return o.forEach(sammle);
    if (o && typeof o === 'object') {
      if (typeof o.at === 'number' && o.at >= 0) ausAt.push(o.at);
      Object.values(o).forEach(sammle);
    }
  };
  sammle(szene);

  const eingebaut = (EINGEBAUT[szene.typ] ?? [])
    .filter((e) => !e.feld || szene[e.feld])
    .map((e) => e.at);

  switch (szene.typ) {
    case 'irrtum':
      // Karte, Durchstreichung, Richtigstellung -- feste Zeiten im Bauteil,
      // danach laeuft der Marker bis zum Szenenende.
      return [0.1, 2.6, 3.5, ...stuetzstellen(MARKER_AB.irrtum, dauer)];
    case 'schluss':
      return [0.1, 0.8, ...stuetzstellen(MARKER_AB.schluss, dauer)];
    case 'zerlegung': {
      // Die Teile gehen im eingestellten Takt auf, nicht alle auf einmal.
      const ab = szene.ab ?? 1.1;
      const takt = szene.takt ?? 0.09;
      return [...eingebaut, ...(szene.teile ?? []).map((_, i) => ab + i * takt)];
    }
    case 'balken':
      return [...eingebaut, ...ausAt];
    case 'streuung':
      // Die Fussnote ist die Pointe und geht deshalb nach der letzten Antwort
      // auf, nicht zu einer festen Sekunde -- siehe Komponente `Streuung`.
      return [
        ...ausAt,
        ...(szene.fussnote && ausAt.length ? [Math.max(...ausAt) + STREUUNG_NACHLAUF] : []),
      ];
    case 'waage': {
      const links = szene.links?.punkte?.length ?? 0;
      const rechts = szene.rechts?.punkte?.length ?? 0;
      const zeiten = [];
      for (let i = 0; i < links; i += 1) zeiten.push(0.7 + i * 0.55);
      for (let i = 0; i < rechts; i += 1) zeiten.push(0.98 + i * 0.55);
      zeiten.push(3.2);
      return zeiten;
    }
    case 'tipps':
      // Jeder Tipp geht auf, wenn seine Textzeile gesprochen wird -- so
      // rechnet es zeiten.mjs aus der Messung. Gleichmaessig verteilen waere
      // bequem und falsch: gemessen lagen die drei Einsaetze bei 2,5 / 8,5 /
      // 16,2 s, die Gleichverteilung haette 4,5 / 9,0 / 13,4 angenommen.
      return tippEreignisse(szene, dauer, einsaetze);
    default:
      return [...eingebaut, ...ausAt];
  }
};
/** Sprechpausen, dieselben Werte wie in scripts/estimate-timing.mjs. */
const PAUSE_SATZ = 0.2;
const PAUSE_KOMMA = 0.1;
/**
 * Zielspanne, korrigiert.
 *
 * Eine fruehere Fassung stand bei 22 bis 34 s und begruendete das mit der
 * Watch-Time-Schwelle: kuerzere Videos erreichen 40 % leichter. Das stimmt,
 * optimiert aber die falsche Groesse. Dieser Kanal lebt von Saves, nicht von
 * Completion Rate -- und dafuer dreht sich das Vorzeichen um: Erklaervideos
 * unter 60 s werden 30-40 % haeufiger gespeichert als kuerzere Clips, und
 * 60-90 s schlagen kurze Reels bei Saves deutlich.
 *
 * Ueber 75 s faellt die Completion Rate um 20-50 %, ausser das Video ist
 * klar gegliedert. Unseres ist es (Szenentypen, Schrittleiste), deshalb ist
 * die Obergrenze grosszuegig -- aber nicht offen.
 */
const ZIEL_SEKUNDEN = {min: 45, max: 75};

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

  (PFLICHTFELDER[szene.typ] ?? []).forEach((feld) => {
    const wert = szene[feld];
    const leer =
      wert === undefined ||
      wert === null ||
      (Array.isArray(wert) && wert.length === 0) ||
      (typeof wert === 'string' && wert.trim() === '');
    if (leer) {
      fehler.push(`${wo}: Pflichtfeld "${feld}" fehlt oder ist leer -- die Szene bliebe leer`);
    }
  });
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
    // Nur verdaechtig, wenn kein Vokal davor steht: "neue", "Steuer" und
    // "Feuer" sind normale Woerter, "laeuft" und "zurueck" nicht.
    // "qu" ist ein fester Digraph -- "Quelle" und "Qualitaet" sind normal.
    const verdaechtig = (wort) => /(^|[^aeiouäöüq])(ae|oe|ue)/i.test(wort);
    const treffer = (wert.match(/\b\w*(?:ae|oe|ue)\w*\b/g) ?? []).filter(verdaechtig);
    if (treffer.length) {
      warnung.push(`${wo}, ${schluessel}: moeglicherweise umschriebene Umlaute (${treffer.join(', ')})`);
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

  if (szene.typ === 'fenster') {
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

  if (szene.typ === 'karte') {
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

  if (szene.typ === 'behaelter' || szene.typ === 'ueberlauf' || szene.typ === 'durchlauf') {
    if (!szene.nachrichten?.length) fehler.push(`${wo}: keine nachrichten`);
    if (!szene.kapazitaet) fehler.push(`${wo}: kapazitaet fehlt`);
    szene.nachrichten?.forEach((n) => {
      if (n.label.length > 26) warnung.push(`${wo}: "${n.label}" ist ${n.label.length} Zeichen, passt evtl. nicht`);
    });
  }
});

/**
 * Gemessene Grenzen, falls schon vertont wurde.
 *
 * Vor der Vertonung gibt es sie nicht, dann wird geschaetzt. Die Schaetzung
 * ist aber nur so gut wie die angenommene Sprechrate: bei Halluzination lag
 * sie bei 65,1 s gegen gemessene 58,8 s, also 11 % daneben. Auf Szenenebene
 * reicht das, um eine Luecke knapp unter der Grenze zu melden, die in
 * Wirklichkeit darueber liegt. Sobald zeiten.mjs gelaufen ist, wird deshalb
 * gegen die echten Werte geprueft -- und dann noch einmal gemeldet.
 */
let gemessen = null;
try {
  gemessen = JSON.parse(readFileSync(`videos/${id}.zeiten.json`, 'utf8')).grenzen;
  if (gemessen?.length !== szenen.length) gemessen = null;
} catch {
  gemessen = null;
}
console.log(
  gemessen
    ? '  Grundlage gemessene Szenendauern aus videos/' + id + '.zeiten.json'
    : '  Grundlage geschaetzte Szenendauern -- noch nicht vertont'
);

// Stillstand je Szene.
szenen.forEach((szene, i) => {
  const wo = `Szene ${i + 1} (${szene.typ})`;
  const roh = (szene.text ?? []).join(' ');
  const eigeneWoerter = roh.split(/\s+/).filter(Boolean).length;
  const dauer =
    gemessen?.[i]?.duration ??
    eigeneWoerter / WPS +
      (roh.match(/[.!?]/g) ?? []).length * PAUSE_SATZ +
      (roh.match(/,/g) ?? []).length * PAUSE_KOMMA;

  if (dauer > MAX_SZENENDAUER && !OHNE_DAUERGRENZE.includes(szene.typ)) {
    fehler.push(
      `${wo}: geschaetzt ${dauer.toFixed(1)} s. Ueber ${MAX_SZENENDAUER} s auf einem Bild ` +
        `wirkt statisch -- Szene teilen oder Text kuerzen.`
    );
  }

  if (dauerbewegt(szene)) return;

  // Ereignisse nach dem Szenenende zaehlen nicht -- sie finden nicht statt.
  // Bei balken ist das keine Feinheit: liegt die Szene unter 4,0 s, erscheint
  // die Folge-Karte nie, obwohl sie im JSON steht.
  const sortiert = [...new Set(ereignisseVon(szene, dauer, gemessen?.[i]?.einsaetze))]
    .filter((e) => e <= dauer)
    .sort((a, b) => a - b);

  if (szene.typ === 'balken' && dauer < BALKEN_FOLGE + 0.5) {
    fehler.push(
      `${wo}: geschaetzt ${dauer.toFixed(1)} s, aber die Folge-Karte geht erst bei ` +
        `${BALKEN_FOLGE} s auf -- sie waere nicht zu sehen. Mehr Text oder Szene zusammenlegen.`
    );
  }
  if (szene.typ === 'balken' && szene.fussnote && dauer < BALKEN_FUSSNOTE + 0.5) {
    warnung.push(
      `${wo}: Fussnote erscheint bei ${BALKEN_FUSSNOTE} s, die Szene dauert nur ${dauer.toFixed(1)} s.`
    );
  }
  const punkte = [0, ...sortiert, dauer];
  let groesste = 0;
  let stelle = 0;
  for (let k = 1; k < punkte.length; k += 1) {
    const luecke = punkte[k] - punkte[k - 1];
    if (luecke > groesste) {
      groesste = luecke;
      stelle = punkte[k - 1];
    }
  }

  if (groesste > MAX_STILLSTAND) {
    fehler.push(
      `${wo}: ${groesste.toFixed(1)} s ohne Bewegung ab Sekunde ${stelle.toFixed(1)} ` +
        `(erlaubt ${MAX_STILLSTAND}). ${sortiert.length} Ereignisse auf ${dauer.toFixed(1)} s. ` +
        `Mehr Zeitpunkte setzen oder die Szene teilen.`
    );
  }
});

// Gemessen schlaegt geschaetzt: die Laengenregel soll gegen die echte
// Tonspur entscheiden, sobald es eine gibt.
const geschaetzt = woerter / WPS + pausen;
const sekunden = gemessen ? gemessen.at(-1).at + gemessen.at(-1).duration : geschaetzt;

// Eine Probe zeigt Bautypen und wird nicht gepostet -- fuer sie gilt die
// Laengenregel nicht, alle anderen Pruefungen schon.
if (video.probe) {
  console.log('  Hinweis  als Probe markiert, Laengenregel ausgesetzt');
} else if (sekunden < ZIEL_SEKUNDEN.min) {
  fehler.push(
    `geschaetzt ${sekunden.toFixed(0)} s bei ${woerter} Woertern -- zu duenn. Unter ${ZIEL_SEKUNDEN.min} s ` +
      `passt kein Thema vollstaendig hinein, und was nichts erklaert, wird nicht gespeichert. ` +
      `Ziel sind rund 60 s (${Math.round(60 * WPS)} Woerter).`
  );
} else if (sekunden > ZIEL_SEKUNDEN.max) {
  fehler.push(
    `geschaetzt ${sekunden.toFixed(0)} s bei ${woerter} Woertern. Ueber ${ZIEL_SEKUNDEN.max} s faellt die ` +
      `Completion Rate deutlich, auch bei gegliederten Videos.`
  );
}

console.log(
  `${id}: ${szenen.length} Szenen, ${woerter} Woerter, ` +
    (gemessen
      ? `gemessen ${sekunden.toFixed(1)} s (geschaetzt waeren ${geschaetzt.toFixed(1)} s)`
      : `geschaetzt ${sekunden.toFixed(1)} s (davon ${pausen.toFixed(1)} s Pausen)`)
);
warnung.forEach((w) => console.log(`  Hinweis  ${w}`));
fehler.forEach((f) => console.log(`  FEHLER   ${f}`));

if (fehler.length) {
  console.error(`\n${fehler.length} Fehler -- nicht vertonen, erst beheben.`);
  process.exit(1);
}
console.log(warnung.length ? '\nDurchgelassen, Hinweise pruefen.' : '\nSauber.');

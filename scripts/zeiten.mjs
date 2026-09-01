#!/usr/bin/env node
/**
 * Rechnet Szenengrenzen aus gemessenen Wortzeiten.
 *
 *   node scripts/zeiten.mjs <id>
 *
 * Liest videos/<id>.json (die Szenen mit ihrem Sprechertext) und
 * videos/<id>.messung.json (Wortzeiten aus scripts/measure-timing.mjs) und
 * schreibt videos/<id>.zeiten.json.
 *
 * Der Sinn: frueher wurden die Grenzen von Hand aus den Sprechpausen
 * abgelesen. Das ging zweimal schief -- einmal fehlte eine Grenze, wodurch
 * die Schlussszene nie erschien und alle Kapitel stumm verrutschten. Da jede
 * Szene ihren eigenen Text traegt, ist die Grenze jetzt ableitbar und kann
 * gar nicht mehr von der Szene abweichen.
 */
import {readFileSync, writeFileSync} from 'node:fs';

const id = process.argv[2];
if (!id) {
  console.error('Aufruf: node scripts/zeiten.mjs <id>');
  process.exit(1);
}

const video = JSON.parse(readFileSync(`videos/${id}.json`, 'utf8'));
const messung = JSON.parse(readFileSync(`videos/${id}.messung.json`, 'utf8'));

/** Nur zum Vergleichen: Satzzeichen und Gross-/Kleinschreibung weg. */
const kern = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/**
 * Der Sprechertext, flach, aber mit Herkunft: zu welcher Szene und welcher
 * Zeile innerhalb der Szene gehoert jedes Wort.
 */
const erwartet = [];
video.szenen.forEach((szene, s) => {
  szene.text.forEach((zeile, z) => {
    zeile
      .split(/\s+/)
      .filter(Boolean)
      .forEach((wort) => erwartet.push({wort, szene: s, zeile: z}));
  });
});

const gemessen = messung.words;

if (erwartet.length !== gemessen.length) {
  throw new Error(
    `Der Text hat ${erwartet.length} Woerter, die Messung ${gemessen.length}. ` +
      `Das Voiceover gehoert nicht zu diesem Text -- neu vertonen oder Text zurueckdrehen.`
  );
}

// Stichprobenartig pruefen, dass es wirklich derselbe Text ist. Gleiche Anzahl
// bei anderem Inhalt waere sonst unbemerkt durchgelaufen.
const abweichend = erwartet.filter((e, i) => kern(e.wort) !== kern(gemessen[i].word));
if (abweichend.length > erwartet.length * 0.05) {
  const beispiel = erwartet.findIndex((e, i) => kern(e.wort) !== kern(gemessen[i].word));
  throw new Error(
    `${abweichend.length} von ${erwartet.length} Woertern weichen ab, zuerst an Position ${beispiel}: ` +
      `Text "${erwartet[beispiel].wort}" gegen Messung "${gemessen[beispiel].word}".`
  );
}

const grenzen = video.szenen.map((szene, s) => {
  const eigene = gemessen.filter((_, i) => erwartet[i].szene === s);
  if (eigene.length === 0) {
    throw new Error(`Szene ${s + 1} (${szene.typ}) hat keine Woerter.`);
  }

  const at = eigene[0].start;
  const bis = eigene[eigene.length - 1].end;

  const grenze = {at: Number(at.toFixed(2)), duration: Number((bis - at).toFixed(2))};

  // Bei Tipps ist Zeile 0 die Ueberleitung, jede weitere Zeile ein Tipp.
  if (szene.typ === 'tipps') {
    const einsaetze = [];
    for (let z = 1; z < szene.text.length; z += 1) {
      const ersteszeile = gemessen.find((_, i) => erwartet[i].szene === s && erwartet[i].zeile === z);
      if (ersteszeile) einsaetze.push(Number((ersteszeile.start - at).toFixed(2)));
    }
    if (einsaetze.length !== szene.tipps.length) {
      throw new Error(
        `Szene ${s + 1}: ${szene.tipps.length} Tipps, aber ${einsaetze.length} Textzeilen dafuer. ` +
          `Zeile 0 ist die Ueberleitung, danach eine Zeile je Tipp.`
      );
    }
    grenze.einsaetze = einsaetze;
  }

  return grenze;
});

// Jede Szene laeuft bis zum Beginn der naechsten, die letzte bis zum Ende der
// Tonspur. Ohne das klaffte in den Sprechpausen zwischen zwei Szenen eine
// Luecke, in der nur der leere Hintergrund zu sehen waere -- beim Zaehlen der
// Wortzeiten faellt das nicht auf, im fertigen Video sofort.
grenzen.forEach((g, i) => {
  const bis = i + 1 < grenzen.length ? grenzen[i + 1].at : messung.duration;
  g.duration = Number((bis - g.at).toFixed(2));
});

const ziel = `videos/${id}.zeiten.json`;
writeFileSync(
  ziel,
  `${JSON.stringify({duration: messung.duration, grenzen, words: gemessen}, null, 2)}\n`
);

console.log(`${ziel}`);
console.log(`Dauer      ${messung.duration.toFixed(2)} s`);
console.log(`Szenen     ${grenzen.length}`);
grenzen.forEach((g, i) =>
  console.log(
    `  ${String(i + 1).padStart(2)}. ${video.szenen[i].typ.padEnd(10)} ` +
      `${g.at.toFixed(2).padStart(6)} s  +${g.duration.toFixed(2).padStart(5)} s` +
      (g.einsaetze ? `  Einsaetze ${g.einsaetze.join(', ')}` : '')
  )
);

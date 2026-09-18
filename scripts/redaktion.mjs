import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

export const REVIEW_FELDER = ['themenpassung', 'nutzen', 'mechanismus', 'beispiel', 'korrektheit', 'grenzen', 'transfer', 'sprache', 'bild_text'];
export const BEATS = ['HAKEN', 'WAS', 'WARUM', 'WIE', 'WANN', 'TUN', 'MERKEN'];
const text = (v) => typeof v === 'string' && v.trim().length > 0;
const liste = (v) => Array.isArray(v) ? v : [];
const datum = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v &&
  v <= new Date().toISOString().slice(0, 10);

export function pruefeBeats(video) {
  const fehler = [];
  const szenen = liste(video.szenen);
  const beats = szenen.map((s) => s.beat);
  if (beats[0] !== 'HAKEN' || beats.at(-1) !== 'MERKEN') fehler.push('Beats muessen mit HAKEN beginnen und mit MERKEN enden.');
  for (const beat of ['HAKEN', 'WAS', 'WIE', 'MERKEN']) {
    if (!beats.includes(beat)) fehler.push(`Pflicht-Beat ${beat} fehlt.`);
  }
  beats.forEach((beat, i) => {
    if (!BEATS.includes(beat)) fehler.push(`Szene ${i + 1}: unbekannter Beat ${beat}.`);
    if (i && BEATS.indexOf(beat) < BEATS.indexOf(beats[i - 1])) fehler.push(`Szene ${i + 1}: Beat-Reihenfolge springt zurueck.`);
  });
  return fehler;
}

export function ladePaket(id, root = process.cwd()) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id ?? '')) throw new Error('Ungueltige Themen-ID.');
  const lesen = (p) => readFileSync(join(root, p), 'utf8');
  return {
    video: JSON.parse(lesen(`videos/${id}.json`)),
    dossier: JSON.parse(lesen(`redaktion/${id}.json`)),
    caption: lesen(`captions/${id}.md`),
    lernblatt: lesen(`content/lernzettel/${id}.md`),
  };
}

export function fingerprint({video, dossier, caption, lernblatt}) {
  const {review, ...inhalt} = dossier;
  return createHash('sha256').update(JSON.stringify({video, dossier: inhalt, caption, lernblatt})).digest('hex');
}

// Belegt nur Vollstaendigkeit und Bindung an den Review-Stand, keine Wahrheit.
export function pruefeRedaktion(paket) {
  const {video, dossier: d, caption, lernblatt} = paket;
  const fehler = pruefeBeats(video);
  if (video.profile !== 'lernen-v2') fehler.push('Inhaltsfreigabe verlangt profile: lernen-v2; Bestand erst redaktionell migrieren.');
  if (d.id !== video.id || d.version !== 1) fehler.push('Dossier-ID/Version ungueltig.');
  for (const feld of ['frage', 'lernziel', 'vorwissen', 'relevanz', 'auswahlgrund', 'praktischer_nutzen', 'beispiel']) {
    if (!text(d.brief?.[feld])) fehler.push(`brief.${feld} fehlt.`);
  }
  for (const feld of ['mechanismus', 'grenzen', 'alternativen']) {
    if (!liste(d.brief?.[feld]).length || !d.brief[feld].every(text)) fehler.push(`brief.${feld} braucht konkrete Eintraege.`);
  }
  if (liste(d.brief?.mechanismus).length < 2) fehler.push('Mechanismus braucht mindestens zwei nachvollziehbare Schritte.');
  if (liste(d.brief?.selbsttest).length < 2) fehler.push('Mindestens zwei Selbsttestfragen erforderlich.');
  liste(d.brief?.selbsttest).forEach((q, i) => {
    for (const feld of ['frage', 'antwort', 'begruendung']) if (!text(q?.[feld])) fehler.push(`Selbsttest ${i + 1}: ${feld} fehlt.`);
  });
  if (!text(caption) || !text(lernblatt)) fehler.push('Caption und Lernblatt duerfen nicht leer sein.');
  const quellen = liste(d.quellen);
  const ids = quellen.map((q) => q.id);
  if (!quellen.length || new Set(ids).size !== ids.length) fehler.push('Quellen fehlen oder IDs sind doppelt.');
  quellen.forEach((q, i) => {
    for (const feld of ['id', 'titel', 'fundstelle', 'belegt']) if (!text(q[feld])) fehler.push(`Quelle ${i + 1}: ${feld} fehlt.`);
    try { if (!['https:', 'http:'].includes(new URL(q.url).protocol)) throw new Error(); }
    catch { fehler.push(`Quelle ${i + 1}: gueltige URL fehlt.`); }
    if (q.typ !== 'primaer' || !datum(q.geprueft_am)) fehler.push(`Quelle ${i + 1}: Primaerquelle/Pruefdatum fehlt oder ungueltig.`);
  });
  const claims = liste(d.claims);
  if (!claims.length) fehler.push('Belegte Claims fehlen.');
  if (new Set(claims.map((c) => c.id)).size !== claims.length) fehler.push('Claim-IDs sind doppelt.');
  const abgedeckt = new Set();
  claims.forEach((c, i) => {
    if (!text(c.id) || !text(c.aussage) || !text(c.einschraenkung)) fehler.push(`Claim ${i + 1}: Aussage/ID/Einschraenkung fehlt.`);
    if (!liste(c.quellen).length || c.quellen.some((id) => !ids.includes(id))) fehler.push(`Claim ${i + 1}: Quellenverweis fehlt oder unbekannt.`);
    if (!liste(c.szenen).length) fehler.push(`Claim ${i + 1}: Szenenzuordnung fehlt.`);
    liste(c.szenen).forEach((s) => {
      if (!Number.isInteger(s) || s < 0 || s >= video.szenen.length) fehler.push(`Claim ${i + 1}: ungueltige Szene.`);
      else abgedeckt.add(s);
    });
  });
  video.szenen.forEach((s, i) => {
    if (['WAS', 'WARUM', 'WIE', 'WANN'].includes(s.beat) && !abgedeckt.has(i)) fehler.push(`Szene ${i + 1}: Erklaer-Beat ohne Claim-Beleg.`);
  });
  const r = d.review;
  if (r?.status !== 'bestanden') fehler.push('Redaktionelles Review nicht bestanden.');
  if (!text(r?.pruefer) || !datum(r?.geprueft_am)) fehler.push('Pruefer/Reviewdatum fehlt oder ungueltig.');
  for (const feld of REVIEW_FELDER) if (!text(r?.begruendungen?.[feld])) fehler.push(`Review-Begruendung ${feld} fehlt.`);
  if (!Array.isArray(r?.offene_fragen) || r.offene_fragen.length) fehler.push('Offene Fragen im Review: erst klaeren.');
  if (r?.fingerprint !== fingerprint(paket)) fehler.push('Review veraltet oder Fingerprint fehlt: Inhalt erneut pruefen.');
  return fehler;
}

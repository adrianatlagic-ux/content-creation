import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {ladePaket, fingerprint, pruefeRedaktion, pruefeBeats} from '../scripts/redaktion.mjs';

const id = 'rag-dokument-lernen';
const paket = () => structuredClone(ladePaket(id));
const signieren = (p) => { p.dossier.review.fingerprint = fingerprint(p); return p; };
const fehler = (p, muster) => assert.ok(pruefeRedaktion(p).some((e) => muster.test(e)), pruefeRedaktion(p).join('\n'));

test('recherchiertes Beispielpaket besteht die Inhaltsstruktur', () => {
  assert.deepEqual(pruefeRedaktion(paket()), []);
});

for (const feld of ['video', 'caption', 'lernblatt', 'dossier']) {
  test(`Aenderung an ${feld} macht Abnahme ungueltig`, () => {
    const p = paket();
    if (feld === 'video') p.video.szenen[2].text[0] += ' Eine andere Behauptung.';
    else if (feld === 'dossier') p.dossier.claims[0].aussage += ' Geaendert.';
    else p[feld] += '\nGeaendert.';
    fehler(p, /Review veraltet/);
  });
}

test('Belege, offene Fragen und Review-Begruendungen sind echte Sperren', () => {
  const p = paket();
  p.dossier.claims[0].quellen = ['nicht-vorhanden'];
  p.dossier.review.offene_fragen = ['Ist das wirklich belegt?'];
  delete p.dossier.review.begruendungen.mechanismus;
  signieren(p);
  fehler(p, /Quellenverweis/); fehler(p, /Offene Fragen/); fehler(p, /mechanismus/);
});

test('entfernter WIE, Reihenfolgesprung und unbekannte Beats werden erkannt', () => {
  const p = paket(); p.video.szenen = p.video.szenen.filter((s) => s.beat !== 'WIE');
  assert.ok(pruefeBeats(p.video).some((e) => /WIE fehlt/.test(e)));
  p.video.szenen[2].beat = 'WAS'; p.video.szenen[1].beat = 'WANN';
  assert.ok(pruefeBeats(p.video).some((e) => /springt/.test(e)));
  p.video.szenen[1].beat = 'FREI';
  assert.ok(pruefeBeats(p.video).some((e) => /unbekannter Beat/.test(e)));
});

test('Erklaerszene ohne Quellenzuordnung und ungueltige Daten blockieren', () => {
  const p = paket();
  p.dossier.claims.forEach((c) => { c.szenen = c.szenen.filter((i) => i !== 2); });
  p.dossier.quellen[0].geprueft_am = '2026-02-30';
  signieren(p); fehler(p, /ohne Claim/); fehler(p, /Pruefdatum/);
});

function cli(p, flags = []) {
  const root = mkdtempSync(join(tmpdir(), 'content-review-'));
  try {
    for (const [name, value] of Object.entries({
      [`videos/${id}.json`]: JSON.stringify(p.video),
      [`redaktion/${id}.json`]: JSON.stringify(p.dossier),
      [`captions/${id}.md`]: p.caption,
      [`content/lernzettel/${id}.md`]: p.lernblatt,
    })) {
      const full = join(root, name); mkdirSync(resolve(full, '..'), {recursive: true}); writeFileSync(full, value);
    }
    return spawnSync(process.execPath, [resolve('scripts/pruefe-video.mjs'), id, ...flags], {cwd: root, encoding: 'utf8'});
  } finally { rmSync(root, {recursive: true, force: true}); }
}

test('CLI akzeptiert Frage-Hook, wiederholtes WIE und einen echten Tipp', () => {
  const r = cli(paket()); assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('kurzes klares Video ohne TUN wird nicht zum Auffuellen gezwungen', () => {
  const p = paket();
  p.video.szenen = p.video.szenen.filter((s) => ['HAKEN', 'WAS', 'WIE', 'MERKEN'].includes(s.beat));
  p.video.szenen.forEach((s) => { s.text = ['Kurzer KI-Crashkurs. Ein kurzer Test.']; });
  p.video.szenen.at(-1).text.push('Beispiel in der Caption.');
  const r = cli(p, ['--technik-only']); assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('mehr als drei Tipps und fehlende Zuordnung von Tipp zu Ton blockieren', () => {
  const p = paket(); const tun = p.video.szenen.find((s) => s.typ === 'tipps');
  tun.tipps = Array.from({length: 4}, () => ({text: 'Ein Tipp'}));
  const r = cli(p, ['--technik-only']); assert.equal(r.status, 1);
  assert.match(r.stdout, /1 bis 3 Tipps/); assert.match(r.stdout, /Textzeilen/);
});

test('Hash neu berechnen allein ersetzt kein bestandenes Review', () => {
  const p = paket(); p.dossier.review.status = 'ueberarbeiten'; signieren(p);
  const r = cli(p); assert.equal(r.status, 1); assert.match(r.stdout, /Review nicht bestanden/);
});

test('historische Videos erhalten ohne Dossier keine Produktionsfreigabe', () => {
  const r = spawnSync(process.execPath, ['scripts/pruefe-video.mjs', 'claude-code-diff-panel'], {encoding: 'utf8'});
  assert.equal(r.status, 1); assert.match(r.stdout, /Redaktionspaket fehlt/);
});

test('Render-Einstieg blockiert fehlende Redaktion vor dem Remotion-Aufruf', () => {
  const r = spawnSync(process.execPath, ['scripts/render.mjs', 'claude-code-diff-panel'], {encoding: 'utf8'});
  assert.notEqual(r.status, 0); assert.match(r.stdout, /Redaktionspaket fehlt/);
});

test('Registry ueberspringt Skriptentwuerfe ohne Timing', () => {
  const root = mkdtempSync(join(tmpdir(), 'content-registry-'));
  try {
    mkdirSync(join(root, 'videos')); mkdirSync(join(root, 'src/format'), {recursive: true});
    writeFileSync(join(root, 'videos/entwurf.json'), '{}');
    writeFileSync(join(root, 'videos/bereit.json'), '{}');
    writeFileSync(join(root, 'videos/bereit.zeiten.json'), '{}');
    const r = spawnSync(process.execPath, [resolve('scripts/registry.mjs')], {cwd: root, encoding: 'utf8'});
    assert.equal(r.status, 0, r.stderr);
    const registry = readFileSync(join(root, 'src/format/registry.ts'), 'utf8');
    assert.match(registry, /bereitDef/); assert.doesNotMatch(registry, /entwurf/);
  } finally { rmSync(root, {recursive: true, force: true}); }
});

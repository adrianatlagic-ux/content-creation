# Inhaltliche Abnahme

Nach dem Schreiben Sprechertext, Bildschirmtexte, Caption, Lernblatt und
Quellen erneut lesen. Ein redaktioneller Selbstcheck ist erlaubt, aber
nicht als unabhängige Prüfung ausgeben. Keine routinemäßige Rückfragepflicht.

review in redaktion/<id>.json:
status (bestanden/ueberarbeiten), pruefer (ehrlich benannt), geprueft_am,
offene_fragen (Array), begruendungen mit diesen Schlüsseln:

- themenpassung: gewählte Frage und Lernziel beantwortet?
- nutzen: verändert das Video eine konkrete Entscheidung oder Handlung, die
  ohne ein einzelnes Produkt funktioniert? Ist es weder bloße Theorie noch
  eine Knopf-Tour?
- mechanismus: echter Ablauf direkt oder am Beispiel nacherzählbar?
- beispiel: Beispiel oder direkte Darstellung verständlich, ohne zusätzliche Geschichte?
- korrektheit: tragen die gelesenen Quellen die zentralen Aussagen?
- grenzen: Produktbezug, Voraussetzungen, Unsicherheit erhalten?
- transfer: neue Anwendungsfrage mit begründeter Lösung?
- sprache: verständlich bei dem genannten Vorwissen?
- bild_text: zeigt das Bild denselben Vorgang wie der Text?

Einwände korrigieren; keine offenen tragenden Fragen bei bestanden.

## Geprüften Stand binden

Nach dem tatsächlichen Review:
node scripts/pruefe-redaktion.mjs <id> --hash
SHA-256 als review.fingerprint eintragen.
Er bindet Video-JSON, Caption, Lernblatt und Dossier ohne review.
Danach node scripts/pruefe-video.mjs <id>.

--hash druckt nur den Stand, bestätigt keine Qualität.
Der Prüfer kontrolliert Struktur, Quellenzuordnung, vollständiges Review
und Änderungen seit dem Review. Wahrheit und menschliches Verständnis
kann er nicht feststellen.

Ohne Dossier ist ein altes Video nicht neu geprüft.
--technik-only dient Wartung, nie inhaltlicher Freigabe.
render.mjs verlangt die vollständige Prüfung.
Adrians persönlicher Selbsttest ist freiwillig; ohne Antwort bleibt sein
Verständnis unbekannt. Posten bleibt ein eigener menschlicher Schritt.

## Sichtprüfung vor der Vertonung

Eine stumme Animationsvorschau mit Lesetext prüfen. Jede zentrale Szene braucht
Ausgangszustand, sichtbare Veränderung und Ergebnis. Wenn etwas verloren geht,
muss es vorher sichtbar sein und tatsächlich verschwinden. Einblendende
Minuszeilen oder ein wandernder Strahl allein erklären keinen Verlust.
Tipps zeigen eine ausgeführte Handlung und ihren Zustand danach. Lesbarkeit
auch bei Handygröße prüfen. Ohne neue Vertonung ist die Vorschau kein fertiges
Video; bestehende Audiodateien nicht unter geänderten Text legen.

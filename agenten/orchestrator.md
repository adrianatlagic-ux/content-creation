# Orchestrator

Ein Lauf, ein Lern- und Post-Paket. /neues-video verweist nur hierher.
Vorher content/redaktion.md und alle unten genannten Rollen lesen.

1. Themenbrief (thema.md): Frage wählen/begründen, Status inarbeit.
2. Recherche (recherche.md): Primärquellen/Claims und Lernblatt schreiben.
3. Skript (struktur.md + sprache.md): eine Frage, direkte Erklärung oder hilfreiches Beispiel, realer Ablauf,
   Grenzen; profile: lernen-v2.
4. Szenen (grafik.md): zuerst pro Szene Ausgangszustand, Veränderung und
   Ergebnis unter `bildplan` im Dossier notieren. Danach passende Typen wählen
   und videos/<id>.json schreiben. Kein Typ nur wegen Bewegung oder Abwechslung.
   Wenn kein Typ den Vorgang abbildet, ihn gezielt erweitern.
5. Caption (caption.md): Quellen, Ergänzung und Transferfrage.
6. Inhaltliche Abnahme (qualitaet.md): echtes Review mit Begründungen und
   Fingerprint. node scripts/pruefe-video.mjs <id> muss bestehen.
7. Vertonung (stimme.md): node scripts/narration.mjs <id>.
   ElevenLabs estimate_only zuerst, übliche Kosten nennen und fortfahren.
   Stimme ypAmPUMkO5wFnEuldApx, Modell eleven_v3, generations_count: 1.
   Bei deutlich über 1 € oder fehlendem Connector: Skript-Paket sichern,
   inarbeit lassen und fehlenden Schritt melden.
8. Ton und Timing:
   node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 --text videos/<id>.narration.txt
   node scripts/measure-timing.mjs public/<id>.mp3 videos/<id>.narration.txt videos/<id>.messung.json
   node scripts/zeiten.mjs <id>
   node scripts/pruefe-video.mjs <id>
9. Render: node scripts/registry.mjs, node scripts/render.mjs <id>,
   node scripts/cover.mjs <id>. Cover, zentrale Erklärungsszene und Schluss
   tatsächlich ansehen; zentrale Übergänge als Sequenz mit Ton prüfen,
   zusätzlich bei Handygröße. Nicht nur drei Standbilder abhaken.
   Befunde in review.begruendungen.bild_text festhalten; unklare Übergänge
   vor fertig korrigieren. Neuer Bautyp: zusätzlich
   npx tsc --noEmit und Frame dieses Typs prüfen.
10. Ablage (ablage.md): Video, Caption, Lernblatt, Produktionshinweise.
    Erst nach Ton/Render/Sichtprüfung fertig. redaktionsstatus separat.
    Geänderte Dateien gezielt committen/pushen.

## Korrektur/Wiederaufnahme

Inhalt geändert: Dossier/Caption/Lernblatt synchronisieren, erneut reviewen;
alten Ton/Timing nicht ungeprüft verwenden.
Ton fehlt: ab Schritt 7 fortsetzen, sofern Review aktuell.
Ton vorhanden: genaue Textzuordnung prüfen, nicht doppelt bezahlen.
Nach zwei erfolglosen Reparaturen am selben Fehler Zwischenstand melden.
Keine Prüfung umgehen. Wiederholtes Feedback an der verursachenden Regel
korrigieren und alte widersprechende Regel ersetzen.
Bestand: content/bestandsaudit.md. Nicht automatisch posten.

---
description: Erzeugt ein komplettes neues Reel end-to-end -- Thema, Skript, Vertonung, Render, Caption.
argument-hint: "[optionale Themen-ID aus content/themen.json, sonst automatisch]"
---

Führe die volle Pipeline aus `agenten/orchestrator.md` **einmal, für genau
ein Thema, ohne zwischendurch nachzufragen** aus, bis ein fertiges Video
plus Caption vorliegen. Lies vor dem Start `agenten/orchestrator.md` und
jede Datei, auf die es verweist (`thema.md`, `struktur.md`, `sprache.md`,
`grafik.md`, `stimme.md`, `caption.md`, `ablage.md`) — das sind die
Regeln, nicht diese Datei hier. Diese Datei ist nur der Auslöser.

**Argument:** `$ARGUMENTS` — falls eine Themen-ID aus `content/themen.json`
angegeben ist, dieses Thema nehmen (auch wenn es nicht oben in der
Warteschlange steht). Sonst `thema.md`s normale Reihenfolge befolgen.

## Ablauf

1. **Thema** (`thema.md`): Thema wählen, kurz prüfen ob es noch aktuell
   ist, Status auf `inarbeit`. Ist die Werkzeug-Warteschlange leer, dort
   recherchieren, nicht kommentarlos auf `grundlagen` ausweichen. Sind
   beide Spuren leer: abbrechen und melden, keine Themen erfinden.
2. **Skript** (`struktur.md` + `sprache.md`): Sprechertext je Szene
   schreiben. **Bei einem Werkzeug-Thema zwingend beachten:** HAKEN, WAS,
   WARUM und WIE gehören dem allgemeinen Phänomen, nicht dem Befehl selbst
   — der Befehl ist die Lösung in TUN, nicht der Aufhänger. Siehe
   `struktur.md`, Abschnitt „Werkzeug-Themen: allgemein zuerst" — das ist
   an gemessenen Aufrufzahlen festgemacht, kein Stilvorschlag.
3. **Szenen** (`grafik.md`): `videos/<id>.json` bauen. Bautypen aus dem
   bestehenden Katalog wählen, keinen eigenen Code schreiben. Denselben
   Bautyp nicht 3x oder öfter im selben Video verwenden (dafür warnt
   `pruefe-video.mjs` inzwischen automatisch) — lieber einen passenderen
   Typ suchen, siehe grafik.md-Katalog.
4. `node scripts/pruefe-video.mjs <id>` — muss ohne Fehler durchlaufen,
   bevor irgendetwas Geld kostet. Warnungen lesen und ernst nehmen, aber
   nicht zwingend blockierend.
5. `node scripts/narration.mjs <id>` schreiben.
6. **Vertonen** (`stimme.md`): `creative_generate_speech` mit
   `estimate_only: true`, Stimme `ifvYno2dLD5AxjPYOGa4`, Modell
   `eleven_v3`. Kosten kurz nennen (üblich: 15–30 Cent) und **direkt
   weitermachen** — nicht auf eine Bestätigung warten, das ist der Sinn
   dieses Befehls. Nur stoppen und melden, wenn die Schätzung deutlich
   außerhalb des üblichen Rahmens liegt (z. B. über 1 €) oder der
   Connector nicht verfügbar ist. Dann `generations_count: 1` generieren,
   herunterladen nach `public/<id>-raw.mp3`.
7. `node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 --text videos/<id>.narration.txt`
   — nie einen festen Faktor angeben.
8. `node scripts/measure-timing.mjs public/<id>.mp3 videos/<id>.narration.txt videos/<id>.messung.json`
9. `node scripts/zeiten.mjs <id>`
10. `node scripts/pruefe-video.mjs <id>` erneut, jetzt gegen die
    gemessene Dauer.
11. `node scripts/registry.mjs` — **nicht vergessen**, sonst bricht der
    Render mit „Could not find composition" ab.
12. `node scripts/render.mjs <id>`
13. `node scripts/cover.mjs <id>` — das erzeugte Bild tatsächlich ansehen
    (Read-Tool), nicht nur den Befehl laufen lassen. Wirkt der erste Frame
    leer oder unklar, Ursache beheben, nicht ignorieren.
14. **Caption** (`caption.md`): eine einzelne Caption schreiben, nur bei
    Überlänge (>2200 Zeichen) in zwei Teile splitten. Enthält die genauen
    Befehle zum Kopieren.
15. Thema in `content/themen.json` auf `fertig` setzen.
16. Git: neue/geänderte Dateien gezielt hinzufügen (kein `git add -A`),
    committen mit kurzer, konkreter Nachricht, pushen.
17. Video und Caption an den Nutzer schicken (SendUserFile), dazu eine
    kurze Zusammenfassung: Thema, Kosten, Dauer, was geprüft wurde.

## Wann stoppen statt durchlaufen

- Beide Themen-Spuren leer.
- Eine Kostenschätzung liegt weit außerhalb des üblichen Rahmens.
- `pruefe-video.mjs` lässt sich nach zwei eigenen Korrekturversuchen nicht
  zum Durchlaufen bringen.
- Der ElevenLabs-Connector ist nicht verfügbar (siehe `stimme.md`,
  „Wenn der Connector weg ist" — Zwischenstand sichern, Thema auf
  `inarbeit` lassen, nicht auf `offen`).

Sonst: durchlaufen lassen, keine Zwischenfragen. Das ist der Sinn dieses
Befehls — ein Aufruf, ein fertiges Video.

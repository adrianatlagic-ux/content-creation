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
   ist, Status auf `inarbeit`. **Werkzeug-Themen kommen von drei
   Oberflächen, nicht nur Claude Code** — Claude Chat (claude.ai/App) und
   Cowork zählen genauso, siehe `thema.md`, Abschnitt „Zwei Spuren". Ein
   Fund, der eine Version verlangt, die erst wenige Tage alt ist, wird
   zurückgestellt (siehe dort, Filterkriterium 5) — die meisten haben das
   Update noch nicht. Ist die Werkzeug-Warteschlange leer, dort
   recherchieren (jetzt an allen drei Oberflächen, nicht nur Claude Code),
   nicht kommentarlos auf `grundlagen` ausweichen. Sind beide Spuren leer:
   abbrechen und melden, keine Themen erfinden.
2. **Skript** (`struktur.md` + `sprache.md`): Sprechertext je Szene
   schreiben. **Jeder Haken beginnt wortgleich mit „Kurzer
   KI-Crashkurs."**, siehe `content/hooks.md`, Abschnitt „Die erste
   Sekunde" — `pruefe-video.mjs` prüft das. **Bei einem Werkzeug-Thema
   zwingend beachten:** HAKEN, WAS, WARUM und WIE gehören dem allgemeinen
   Phänomen, nicht dem Befehl selbst — der Befehl ist die Lösung in TUN,
   nicht der Aufhänger. Siehe `struktur.md`, Abschnitt „Werkzeug-Themen:
   allgemein zuerst" — das ist an gemessenen Aufrufzahlen festgemacht,
   kein Stilvorschlag.
3. **Szenen** (`grafik.md`): `videos/<id>.json` bauen. **Dieses Video
   bekommt einen neuen, eigenen Bautyp**, passend zum Thema, den es noch
   nicht im Katalog gibt — siehe `grafik.md`, Abschnitt „Neuer Bautyp —
   jetzt Standard, nicht Ausnahme" für Namensregel, Einbau
   (`src/format/schema.ts` + `src/format/scenes.tsx` + Katalog-Tabelle)
   und die zusätzliche Sichtprüfung, die das nach sich zieht (Schritt 13
   unten). Für die übrigen Szenen den bestehenden Katalog nutzen. Denselben
   Bautyp nicht 3x oder öfter im selben Video verwenden (dafür warnt
   `pruefe-video.mjs` automatisch).
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
    leer oder unklar, Ursache beheben, nicht ignorieren. **Zusätzlich einen
    Frame aus der Szene mit dem neuen Bautyp ansehen** (Zeitpunkt aus
    `videos/<id>.zeiten.json`, dann z. B. `ffmpeg -ss <t> -frames:v 1` auf
    `out/<id>.mp4`) — Frame 0 zeigt den neuen Typ nicht, wenn er nicht in
    `irrtum` sitzt, und ein neuer Typ ist ungeprüfter als der Rest.
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
- Der neue Bautyp lässt sich nach zwei eigenen Korrekturversuchen nicht
  sauber rendern (Typfehler, kaputter Frame, `npx tsc --noEmit` bleibt
  rot) — dann für dieses Video auf einen bestehenden Typ ausweichen (siehe
  `grafik.md`, „Wenn wirklich nichts Neues passt"), Grund kurz notieren,
  und mit dem Lauf fortfahren statt ganz abzubrechen.
- Der ElevenLabs-Connector ist nicht verfügbar (siehe `stimme.md`,
  „Wenn der Connector weg ist" — Zwischenstand sichern, Thema auf
  `inarbeit` lassen, nicht auf `offen`).

Sonst: durchlaufen lassen, keine Zwischenfragen. Das ist der Sinn dieses
Befehls — ein Aufruf, ein fertiges Video.

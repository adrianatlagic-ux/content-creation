# Caption — Der Unterschied steht jetzt direkt neben dem Chat

Video: `out/claude-code-diff-panel.mp4` · Hook-Muster: Einladung + Widerspruch (Standard, siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Diff, Fullscreen

Aufbau und Regeln: `captions/VORLAGE.md`

Alles in einer Caption, kein separater Kommentar — nur ein Befehl zum
Kopieren, das lohnt keine eigene Kommentar-Ebene.

---

## Caption

Claude Code zeigt dir jetzt live, was sich in deiner Datei geändert hat — direkt neben dem Chat, ohne wegzuwechseln.

Ein neues Diff-Panel liest bei jeder Änderung automatisch den Unterschied zur letzten Version ein und zeigt ihn Zeile für Zeile — rot für entfernt, grün für neu.

So machst du das:

1️⃣ Im Fullscreen-Modus `/diff` eintippen — das Panel öffnet sich neben dem Chat
2️⃣ `/diff` nochmal eintippen, um es wieder zu schließen

Das Überraschendste daran: Das Panel läuft die ganze Zeit mit, auch während du weiterarbeitest — nicht nur, wenn du explizit nachfragst.

Wie oft bist du schon zum Editor gewechselt, nur um zu sehen, was sich gerade geändert hat?

#ClaudeCode #KIWerkzeuge #Diff #KITipps

---

## Vor dem Posten prüfen

- Quelle: `code.claude.com/docs/en/changelog` (offizieller Changelog, per
  WebFetch am 16. September 2026 direkt geprüft, nicht blockiert) — Panel
  eingeführt in v2.1.260 (3. September 2026), Fullscreen-Unterstützung
  ergänzt in v2.1.269 (11. September 2026). Siehe `content/themen.json`,
  Eintrag `claude-code-diff-panel`.
- **Versions-Gate:** Braucht Claude Code ≥ 2.1.260 und läuft im
  Fullscreen-Modus. Vor dem Posten kurz prüfen, ob die Mehrheit der
  Zuschauer das Update inzwischen hat (13 Tage seit Einführung zum
  Recherchezeitpunkt).
- **Klickpfad nicht selbst nachgeprüft** — vor dem Posten `/diff` einmal
  selbst in Claude Code ausprobieren, siehe `captions/VORLAGE.md`,
  „Klickpfade prüfen lassen".
- Rund 1150 Zeichen, Instagrams Grenze liegt bei 2200 — reichlich Luft,
  außerhalb der schwachen Zone 51–125. Erste Zeile 114 Zeichen, passt vor
  das „mehr".
- Erstes Werkzeug-Video nach der Umstellung auf feste Abwechslung (siehe
  `agenten/thema.md`) — Werkzeug-Warteschlange war leer, dieses Thema kam
  aus frischer Recherche an allen drei Oberflächen (nur Claude Code lieferte
  einen Kandidaten, der alle Filterkriterien erfüllte).
- Neuer Bautyp `unterschied` (Diff-Zeilen mit Plus/Minus) sichtgeprüft —
  siehe `agenten/grafik.md`.

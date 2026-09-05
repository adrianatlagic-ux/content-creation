# Caption — Der Befehl, der dein Sitzungslimit vorzieht

Video: `out/claude-code-limit-reset.mp4` · Hook-Muster: Einladung + Widerspruch (ohne Vorlauf, siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Limit Reset, Sitzungslimit, Wochenlimit

Aufbau und Regeln: `captions/VORLAGE.md`

Alles in einer Caption, kein separater Kommentar — siehe Begründung in
`captions/codex-als-mcp-subagent.md`, hier genauso anwendbar.

---

## Caption

Du musst nicht warten, bis sich dein Claude-Code-Limit von selbst zurücksetzt.

Ein Befehl zieht dein 5-Stunden-Sitzungslimit einmal pro Woche vorzeitig vor — dein separates Wochenlimit bleibt davon unberührt.

So nutzt du ihn:

1️⃣ Sitzungslimit blockt? `/limit-reset` eintippen
2️⃣ Bestätigung abwarten: „Session-Limit zurückgesetzt" — sofort weiterarbeiten
3️⃣ Beide Limits getrennt einsehen: `/usage`
4️⃣ Nur einmal pro 7 Tage nutzbar, kein Dauertrick

Wichtig: `/limit-reset` steht (Stand 4. September 2026) noch nicht im offiziellen Claude-Code-Changelog, wird aber von mehreren unabhängigen Quellen übereinstimmend beschrieben — im schrittweisen Rollout. Taucht er bei dir noch nicht auf, kommt er bald.

Wie oft bist du schon mitten in der Aufgabe ins Fünf-Stunden-Limit gelaufen?

#ClaudeCode #Claude #KITools #Produktivität #KITipps

---

## Vor dem Posten prüfen

- Alles in einer Caption statt Caption + separatem Kommentar, aus demselben
  Grund wie beim vorherigen Video: Die Befehle sollen sich kopieren lassen,
  ohne extra zur Kommentarspalte zu wechseln.
- Der Rollout-Hinweis ist kein Kleingedrucktes zum Absichern, sondern
  Kerninhalt — er steht auch im Video selbst (Beat WANN). Siehe
  `content/themen.json`, Feld `quelle` bei `claude-code-limit-reset`: nicht
  im offiziellen Changelog bestätigt, aber übereinstimmend beschrieben von
  explainx.ai und usagebar.com (Stand 4. September 2026, geprüft).
- 869 Zeichen, Instagrams Grenze liegt bei 2200 — reichlich Luft, und
  außerhalb der schwachen Zone 51–125.
- Instagram rendert Backticks nicht als Code, nur als normalen Text — das
  ist eingepreist, keine Formatierung geht verloren.

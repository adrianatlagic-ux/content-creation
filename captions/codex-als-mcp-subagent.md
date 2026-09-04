# Caption — Codex als Subagent in Claude Code

Video: `out/codex-als-mcp-subagent.mp4` · Hook-Muster: Einladung + Widerspruch (ohne Vorlauf, siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Codex, MCP, Subagent

Aufbau und Regeln: `captions/VORLAGE.md`

Alles in einer Caption, kein separater Kommentar — die Befehle sollen sich
kopieren lassen, ohne extra zu scrollen. Details dazu unten bei „Vor dem
Posten prüfen".

---

## Caption

Claude Code und Codex müssen sich nicht abwechseln — ein MCP-Server macht Codex zu einem Werkzeug, das Claude Code direkt im selben Repo aufruft.

So richtest du das ein (Werkzeug: codex-as-mcp, github.com/kky42/codex-as-mcp):

1️⃣ Codex CLI installieren und einloggen
`npm install -g @openai/codex@latest` · dann `codex login`
(braucht Codex CLI ≥ 0.46.0)

2️⃣ Falls noch nicht vorhanden, `uvx`:
`curl -LsSf https://astral.sh/uv/install.sh | sh`

3️⃣ Server eintragen:
`claude mcp add codex-subagent -- uvx codex-as-mcp@latest`

4️⃣ Mit `/mcp` prüfen — `codex-subagent` mit `spawn_agent` und `spawn_agents_parallel` muss auftauchen

5️⃣ Aufrufen: `spawn_agent("deine Aufgabe")`

Wichtig: Das läuft ohne Sandbox und ohne Rückfrage (`--dangerously-bypass-approvals-and-sandbox`) — nur im eigenen, vertrauten Repo einsetzen. codex-as-mcp ist ein Community-Projekt, kein offizielles Anthropic- oder OpenAI-Werkzeug.

Nutzt du beide schon zusammen, oder bisher nur eins von beiden?

#ClaudeCode #Codex #MCP #KIWerkzeuge

---

## Vor dem Posten prüfen

- Alles in einer Caption statt Caption + separatem Kommentar: Die
  ursprüngliche Aufteilung folgte dem Muster in `VORLAGE.md`, das für
  Themen ohne konkrete Befehle geschrieben wurde. Hier ist der Zweck ein
  anderer — Leute sollen die Befehle direkt kopieren können, ohne extra
  zur Kommentarspalte zu wechseln. Die einzige Funktion, die ein
  separater Kommentar noch hätte, wäre gezieltes Engagement-Bait
  ("Antwort steht im Kommentar!") — für ein Tutorial mehr Reibung als
  Nutzen.
- 1015 Zeichen, Instagrams Grenze liegt bei 2200 — reichlich Luft.
- Die Befehle sind wörtlich aus der README von
  `github.com/kky42/codex-as-mcp`, Stand 4. September 2026 — bei
  spürbarer Verzögerung zwischen Schreiben und Posten kurz gegen die
  aktuelle README abgleichen.
- Instagram rendert Backticks und Codeblöcke nicht als Code, nur als
  normalen Text — das ist hier schon eingepreist, keine Formatierung
  geht beim Posten verloren, weil keine erwartet wird.

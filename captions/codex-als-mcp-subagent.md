# Caption — Codex als Subagent in Claude Code

Video: `out/codex-als-mcp-subagent.mp4` · Hook-Muster: Einladung + Widerspruch (ohne Vorlauf, siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Codex, MCP, Subagent

Aufbau und Regeln: `captions/VORLAGE.md`

---

## Caption

Claude Code und Codex müssen sich nicht abwechseln — eines kann das andere mitten im selben Repo aufrufen.

Dahinter steckt ein kleiner MCP-Server: Er macht Codex zu einem ganz normalen Werkzeug, das Claude Code aufruft wie jedes andere MCP-Werkzeug auch. Kein Fenster-Wechsel, kein Kontextverlust — und notfalls laufen mehrere Codex-Agenten gleichzeitig statt nacheinander.

So richtest du das ein:

1️⃣ Codex einmal einloggen
2️⃣ Den Server in die MCP-Liste eintragen
3️⃣ Mit Schrägstrich-MCP prüfen, ob er verbunden ist
4️⃣ Codex direkt aus Claude Code heraus aufrufen

Wichtig dabei: Das läuft ohne Sandbox und ohne Rückfrage — nur im eigenen, vertrauten Repo einsetzen.

Die genaue Einrichtung steht im ersten Kommentar 👇

Nutzt du beide schon zusammen, oder bisher nur eins von beiden?

#ClaudeCode #Codex #MCP #KIWerkzeuge

---

## Erster Kommentar

SO RICHTEST DU DIE BRÜCKE EIN

Werkzeug: codex-as-mcp (Community-Projekt, github.com/kky42/codex-as-mcp)

1. Codex-CLI einloggen
2. codex-as-mcp als MCP-Server in Claude Code eintragen (`.mcp.json`)
3. In Claude Code mit `/mcp` prüfen — die Werkzeuge `spawn_agent` und `spawn_agents_parallel` müssen auftauchen
4. Codex direkt aus dem Chat heraus aufrufen: `spawn_agent("deine Aufgabe")`

WARUM DAS ÜBERHAUPT GEHT

Codex bekommt keinen eigenen Chat — er wird zu einem Werkzeug, das Claude Code
wie jedes MCP-Werkzeug aufruft. Beide arbeiten im selben Ordner, am selben
Stand.

DIE GRENZE, DIE WIRKLICH ZÄHLT

Das Brücken-Tool läuft mit `--dangerously-bypass-approvals-and-sandbox` —
ohne Sandbox, ohne Rückfrage. Der Autor selbst warnt davor, es außerhalb
eigener, vertrauter Repos einzusetzen. Bei fremdem oder ungeprüftem Code:
Finger weg.

---

## Vor dem Posten prüfen

- **Ja, wirklich prüfen:** codex-as-mcp ist ein Community-Projekt, kein
  offizielles Anthropic- oder OpenAI-Werkzeug — Installationsbefehle und
  Versionsanforderung (Codex CLI v0.46.0+) vor dem Posten gegen
  `github.com/kky42/codex-as-mcp` nachschlagen, falls sich seitdem was
  geändert hat.
- Der Sicherheitshinweis (keine Sandbox) gehört in jede Fassung dieser
  Caption, nicht nur in den ersten Kommentar.

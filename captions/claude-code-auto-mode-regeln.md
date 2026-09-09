# Caption — Wann Claude Code fragt - und wann nicht

Video: `out/claude-code-auto-mode-regeln.mp4` · Hook-Muster: Einladung + Widerspruch (siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Auto Mode, Classifier, Permissions

Aufbau und Regeln: `captions/VORLAGE.md`

Alles in einer Caption, kein separater Kommentar — der Klickpfad ist kurz
genug, um ihn direkt zum Kopieren dazustehen zu lassen.

---

## Caption

Ein Classifier prüft bei Claude Code jede Aktion einzeln — deshalb fragt es dich mal, und mal nicht.

Standardmäßig kennt er nur dein eigenes Repo. Alles andere — eine fremde Organisation, ein Team-Speicher — hält er erstmal auf, bis du es ihm sagst.

So richtest du deine eigene Regel ein:

1️⃣ `/permissions` öffnen, Reiter „Auto Mode" wählen
2️⃣ Eigene Erlauben-Regel für dein Repo eintragen — und die Standardregeln AN lassen
3️⃣ Feste Verbote (z. B. Zugangsdaten nach draußen) bleiben trotzdem blockiert — das ist Absicht, keine Lücke

Der Auto-Mode-Reiter gibt es erst ab Claude Code Version 2.1.246 — in älteren Versionen trägst du die Regel direkt in `~/.claude/settings.json` ein.

Ist dir schon mal aufgefallen, dass Claude Code eine Aktion diesmal einfach OHNE Rückfrage ausgeführt hat?

#ClaudeCode #Claude #AutoMode #KITools #KITipps

---

## Vor dem Posten prüfen

- Alles in einer Caption, kein separater Kommentar — der Klickpfad ist kurz.
- Quelle: offizielle Doku `code.claude.com/docs/en/auto-mode-config` und
  `code.claude.com/docs/en/permission-modes`, per WebFetch/WebSearch am
  9. September 2026 geprüft. Default-Wechsel auf Pro/Max/Team seit 14.
  August 2026, vier Praezedenz-Stufen (hard_deny/soft_deny/allow/expliziter
  Wille) und die Versionsgrenze 2.1.246 für den `/permissions`-Reiter sind
  alle direkt daraus, nicht aus einer Drittquelle.
- Ehrlicher Zusatz bewusst drin: der Auto-Mode-Tab ist neu genug, dass er
  nicht in jeder installierten Version existiert — deshalb der Hinweis auf
  die direkte Settings-Datei als Alternative.
- Instagram rendert Backticks nicht als Code, nur als normalen Text — das
  ist eingepreist, keine Formatierung geht verloren.
- 842 Zeichen, Instagrams Grenze liegt bei 2200 — reichlich Luft, und
  außerhalb der schwachen Zone 51–125. Erste Zeile 100 Zeichen, passt vor
  das „mehr".

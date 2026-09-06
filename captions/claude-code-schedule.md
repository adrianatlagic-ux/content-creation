# Caption — Die Routine, die ohne dich weiterläuft

Video: `out/claude-code-schedule.mp4` · Hook-Muster: Einladung + Widerspruch (ohne Vorlauf, siehe `content/hooks.md`)
Suchbegriffe im Fließtext: Claude Code, Schedule, Routine, Cloud

Aufbau und Regeln: `captions/VORLAGE.md`

Alles in einer Caption, kein separater Kommentar — aus demselben Grund wie
bei den letzten beiden Videos: Befehle sollen sich kopieren lassen, ohne
zur Kommentarspalte zu wechseln.

---

## Caption

Claude Code muss nicht mehr laufen, während du am Rechner sitzt — mit `/schedule` läuft eine Routine automatisch in der Cloud weiter, auch wenn dein Laptop zu ist.

So richtest du sie ein:

1️⃣ `/schedule` eintippen, Zeit und Aufgabe in einem Satz beschreiben — z. B. `/schedule täglich 9 Uhr: PR-Review`
2️⃣ Rückfragen beantworten (welches Repo, welche Verbindungen)
3️⃣ Bestätigen — fertig, die Routine läuft ab jetzt von selbst
4️⃣ `/schedule list` zeigt alle laufenden Routinen, `/schedule update` ändert eine

Wichtig: Kürzer als eine Stunde geht nicht — häufigere Intervalle lehnt Claude Code ab. Und der Befehl braucht einen echten claude.ai-Login, ein reiner API-Schlüssel reicht nicht.

Wie oft hast du schon eine wiederkehrende Aufgabe von Hand angestoßen, obwohl sie eigentlich immer gleich abläuft?

#ClaudeCode #Claude #KITools #Automatisierung #KITipps

---

## Vor dem Posten prüfen

- Alles in einer Caption statt Caption + separatem Kommentar, aus demselben
  Grund wie bei den letzten beiden Videos.
- Quelle: offizielle Doku `code.claude.com/docs/en/routines`, per WebFetch
  am 6. September 2026 geprüft — Mindestintervall eine Stunde, Login-Pflicht
  über claude.ai (kein API-Key), Ausführung als eigene Cloud-Sitzung sind
  alle direkt daraus, nicht aus einer Drittquelle.
- Bewusst NICHT erwähnt: `/loop`. Das ist ein anderes, session-gebundenes
  Feature (läuft nur in der offenen Sitzung, verfällt nach 3 Tagen) — beide
  in einem Video zu vermischen wäre ein Genauigkeitsfehler.
- Instagram rendert Backticks nicht als Code, nur als normalen Text — das
  ist eingepreist, keine Formatierung geht verloren.
- 898 Zeichen, Instagrams Grenze liegt bei 2200 — reichlich Luft, und
  außerhalb der schwachen Zone 51–125.

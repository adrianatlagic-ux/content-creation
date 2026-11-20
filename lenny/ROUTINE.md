# Routine: Lenny-Folgen automatisch in der Cloud

Die Routine läuft täglich, fragt den Bot und produziert nur, wenn es etwas
Neues gibt (höchstens 3 Folgen pro Woche). An allen anderen Tagen beendet sie
sich, ohne Credits auszugeben. Fertige Folgen landen im Higgsfield-Projekt
**„Lenny Zero – Folgen“** und mit Caption in `lenny/FOLGEN.md`.

## Einmal einrichten (claude.ai/code/routines → New routine)

| Feld | Wert |
|---|---|
| Name | `Lenny Zero – neue Folge` |
| Repositories | **`adrianatlagic-ux/content-creation`** und **`adrianatlagic-ux/football-prediction`** (beide!) |
| Connectors | **Higgsfield** und **ElevenLabs** |
| Environment | Default |
| Trigger | Schedule → daily → **10:43** (deine Zeit) |
| Prompt | siehe unten |

Warum 10:43 Uhr: GitHub holt Tipps und Ergebnisse um 9:15 und 21:15 Uhr
deutscher Zeit vom GoalIQ-Server. Um 10:43 Uhr sind die Ergebnisse vom Vortag da.

Warum beide Repositories: Der Bot liest die echten Tipps aus `football-prediction`,
schreibt aber nur in `content-creation`.

## Prompt zum Kopieren

```
Arbeite im Repository content-creation. Führe /lenny-folge aus, genau wie in
.claude/commands/lenny-folge.md beschrieben. Die GoalIQ-Daten liegen im
mitgeklonten Repository football-prediction; ändere dort nichts.
Gibt der Bot type "none" zurück, beende dich ohne Credits auszugeben.
Höchstens ein Videoversuch, nie automatisch wiederholen.
```

## Vorher erledigen

1. ElevenLabs-Connector mit vollen Rechten verbinden und die Stimme designen;
   die `voice_id` kommt in `lenny/config.json` → `character.elevenlabs_voice_id`.
2. Die Lenny-Änderungen in den Standard-Branch von `content-creation` übernehmen
   (der Pull Request), denn die Routine klont den Standard-Branch.

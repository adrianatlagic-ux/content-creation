# Orchestrator

Ablauf eines Videos, von der Themenwahl bis zur Ablage. Jeder Schritt hat
seine eigene Rollendatei; hier steht nur die Reihenfolge und was ein Schritt
abliefern muss, bevor der nächste beginnt.

**Grundregel: nach jedem Schritt prüfen, nicht am Ende.** Die Vertonung ist
der erste Schritt, der Geld kostet (~17 Cent). Alles, was davor auffallen
kann, muss davor auffallen.

---

## Ablauf

| # | Schritt | Rolle | Ergebnis | Abbruch wenn |
|---|---|---|---|---|
| 1 | Thema wählen | `01-thema.md` | Eintrag aus `content/themen.json` auf `inarbeit` | kein offenes Thema |
| 2 | Text schreiben | `02-text.md` | Sprechertext je Szene | — |
| 3 | Szenen bauen | `03-grafik.md` | `videos/<id>.json` | — |
| 4 | **Prüfen** | — | `node scripts/pruefe-video.mjs <id>` | Exit ≠ 0 |
| 5 | Vertonen | `05-stimme.md` | `public/<id>.mp3` | Connector weg → Schritt 9 |
| 6 | Messen | — | `.messung.json`, dann `.zeiten.json` | Wortzahl weicht ab |
| 7 | Rendern | — | `out/<id>.mp4` | Render bricht ab |
| 8 | Caption | `04-caption.md` | `captions/<id>.md` | — |
| 9 | Ablegen | `06-ablage.md` | Google-Drive-Ordner | — |

## Die Befehle in Schritt 4 bis 7

```
node scripts/pruefe-video.mjs <id>          # muss 0 zurückgeben
# Vertonung erzeugen -> public/<id>-raw.mp3
node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 1.22
node scripts/measure-timing.mjs public/<id>.mp3 <narration.txt> videos/<id>.messung.json
node scripts/zeiten.mjs <id>
node scripts/render.mjs <id>
```

`zeiten.mjs` bricht ab, wenn die Vertonung nicht zum Text gehört. Das ist kein
Ärgernis, sondern der Schutz davor, ein Video mit falscher Tonspur zu
rendern — genau das ist hier schon einmal passiert und fiel erst im fertigen
Video auf.

## Wenn ein Schritt scheitert

**Nicht den ganzen Lauf wegwerfen.** Was schon erzeugt wurde, bleibt liegen:

- **Vor der Vertonung** → Thema zurück auf `offen`, nichts ist verloren
- **Vertonung nicht möglich** (Connector weg) → `videos/<id>.json` und Caption
  sind fertig und bleiben. Thema auf `inarbeit` lassen, Notiz in die Ablage,
  beim nächsten Lauf ab Schritt 5 weiter. Nicht neu schreiben.
- **Nach der Vertonung** → die MP3 ist bezahlt und bleibt liegen. Beim
  nächsten Lauf nicht neu vertonen.

## Was der Orchestrator nicht tut

- **Nicht posten.** Am Ende steht ein Video in der Ablage, nichts geht
  automatisch online. Die Freigabe ist der einzige Schritt, der beim Menschen
  bleibt.
- **Nicht mehrere Themen pro Lauf.** Ein Lauf, ein Video.
- **Nicht das Format ändern.** Neue Szenentypen sind Handarbeit, siehe
  `03-grafik.md`.

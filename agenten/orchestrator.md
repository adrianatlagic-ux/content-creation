# Orchestrator

Ablauf eines Videos, von der Themenwahl bis zur Ablage. Jeder Schritt hat
seine eigene Rollendatei; hier steht nur die Reihenfolge und was ein Schritt
abliefern muss, bevor der nächste beginnt.

**Grundregel: nach jedem Schritt prüfen, nicht am Ende.** Die Vertonung ist
der erste Schritt, der Geld kostet (~17 Cent). Alles, was davor auffallen
kann, muss davor auffallen.

**Zweite Grundregel: Rückmeldung, die ein zweites Mal kommt, gehört in die
Vorgabe, nicht nur ins Video.** Eine Korrektur nur an `videos/<id>.json`
behebt den einen Fall; die nächste Themenwahl trifft dieselbe Lücke wieder,
weil die Datei, aus der der Text-/Grafik-Agent tatsächlich arbeitet
(`struktur.md`, `sprache.md`, `grafik.md` — oder bei etwas, das keine
Formulierungsfrage ist, der Code selbst unter `src/format/`) unverändert
blieb. Zwei Beispiele, an denen genau das zu lange schiefging, bevor diese
Regel hier stand:

- **Tempo** wurde mehrfach in Folge nur am jeweils aktuellen Video
  nachjustiert (3,3 → 3,15 → 3,0 → 2,85 W/s), bis der Zielwert in
  `sprache.md` landete — und dort inzwischen bewusst als fest (3,0)
  entschieden ist, statt bei jeder weiteren „klingt schnell/langsam"-
  Rückmeldung automatisch weiterzuwandern. Auch das ist eine Form von „in
  die Vorgabe, nicht ins Video": eine bewusste Entscheidung, wann eine
  Zahl **nicht** mehr nachjustiert wird, gehört genauso in die Vorgabe wie
  die Zahl selbst.
- **Das leere Cover** (Frame 0 zeigte praktisch nichts) war ein
  Format-Fehler, kein Text-Fehler — die Lösung (Titelzeile) gehörte deshalb
  in `src/format/scenes.tsx` und `grafik.md`, nicht als Sonderfall in ein
  einzelnes `videos/<id>.json`.

Prüffrage bei jeder Rückmeldung: *Wenn das nächste Video nach derselben
Vorgabe entsteht, tritt dasselbe Problem wieder auf?* Wenn ja, ist die
Vorgabe das Ziel der Korrektur, das Video nur der Anlass.

---

## Ablauf

| # | Schritt | Rolle | Ergebnis | Abbruch wenn |
|---|---|---|---|---|
| 1 | Thema wählen | `thema.md` | Eintrag aus `content/themen.json` auf `inarbeit` | kein offenes Thema |
| 2 | Text schreiben | `struktur.md` + `sprache.md` | Sprechertext je Szene, je Beat einer | — |
| 3 | Szenen bauen | `grafik.md` | `videos/<id>.json` | — |
| 4 | **Prüfen** | — | `node scripts/pruefe-video.mjs <id>` | Exit ≠ 0 |
| 5 | Vertonen | `stimme.md` | `public/<id>.mp3` | Connector weg → Schritt 9 |
| 6 | Messen | — | `.messung.json`, dann `.zeiten.json` | Wortzahl weicht ab |
| 7 | Rendern | — | `out/<id>.mp4` | Render bricht ab |
| 7a | **Sichtprüfen** | — | Frame 0 angesehen, Cover lesbar | Cover leer/unklar → Schritt 3 |
| 8 | Caption | `caption.md` | `captions/<id>.md` | — |
| 9 | Ablegen | `ablage.md` | Google-Drive-Ordner | — |

Schritt 2 braucht **beide** Textdateien: `struktur.md` legt fest, *was* in
welcher Reihenfolge erklärt wird, `sprache.md`, *wie* es formuliert wird.

## Die Befehle in Schritt 4 bis 7a

```
node scripts/pruefe-video.mjs <id>          # muss 0 zurückgeben
node scripts/narration.mjs <id>             # schreibt videos/<id>.narration.txt aus dem JSON

# Vertonung erzeugen -> public/<id>-raw.mp3 (ElevenLabs, siehe stimme.md)

node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 --text videos/<id>.narration.txt
node scripts/measure-timing.mjs public/<id>.mp3 videos/<id>.narration.txt videos/<id>.messung.json
node scripts/zeiten.mjs <id>
node scripts/pruefe-video.mjs <id>          # zweite Prüfung, jetzt gegen die echte Dauer

node scripts/registry.mjs                   # traegt <id> in die Remotion-Kompositionsliste ein
node scripts/render.mjs <id>
node scripts/cover.mjs <id>                 # Schritt 7a: Frame 0 ziehen, dann ansehen
```

**`node scripts/registry.mjs` nicht vergessen, bevor gerendert wird.** Ein
neues `videos/<id>.json` bekommt sonst keine `Reel-<id>`-Komposition und
`render.mjs` bricht mit „Could not find composition" ab — das kostet keine
Credits, aber einen Render-Versuch. Der Schritt ist einmalig pro neuem
Video, nicht Teil des Renders selbst, deshalb leicht zu übersehen.

**Schritt 7a existiert, weil Instagram genau diesen Frame als Vorschaubild
zeigt, bevor jemand antippt** — im Feed, ohne Ton, ohne Play. Er ist nicht
dasselbe wie das Video beim Zusehen: Karten blenden über ein paar Frames
ein, Frame 0 selbst zeigte deshalb einmal praktisch nur den Hintergrund und
ein blasses Maskottchen. Seit die `irrtum`-Szene den Video-`titel` ohne
Einblendung ab Frame 0 zeigt (siehe `grafik.md`), ist das strukturell
behoben — der Schritt bleibt trotzdem stehen, weil er auch andere Ursachen
fangen würde: ein zu langer `titel`, der abgeschnitten wird, oder ein
künftiger Bautyp an erster Stelle, der dasselbe Problem auf neue Art
einführt.

`zeiten.mjs` bricht ab, wenn die Vertonung nicht zum Text gehört. Das ist kein
Ärgernis, sondern der Schutz davor, ein Video mit falscher Tonspur zu
rendern — genau das ist hier schon einmal passiert und fiel erst im fertigen
Video auf.

Die zweite Prüfung nach `zeiten.mjs` läuft gegen die **gemessene**, nicht die
geschätzte Dauer — eine Szene, die in der Schätzung knapp durchkam, kann
gegen die echte Sprechzeit trotzdem einen Stillstand zeigen.

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
  `grafik.md`.

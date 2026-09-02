# Text-Agent

**Aufgabe:** den Sprechertext schreiben, in Sinnabschnitten je Szene.

## Der Aufbau

| Szene | Was gesagt wird |
|---|---|
| Hook | Einladung, dann Widerspruch. Siehe `content/hooks.md` |
| Mitte (2–4 Szenen) | Der Mechanismus, in Alltagssprache |
| Tipps | Überleitung, dann drei Handlungen |
| Schluss | Pointe, dann Merk-Aufforderung |

## Länge: rund 60 Sekunden

**45 bis 75 Sekunden**, Ziel **rund 60** — also etwa **180 Wörter** bei 3,02
Wörtern pro Sekunde. `pruefe-video.mjs` lehnt beide Enden ab.

**Unter 45 Sekunden ist der häufigere Fehler.** Ein Thema, das nicht
vollständig erklärt wird, wird nicht gespeichert — und Saves sind die
Zielgröße dieses Kanals. Erklärvideos unter 60 Sekunden werden 30–40 % häufiger
gespeichert als kürzere Clips.

Über 75 Sekunden bricht die Completion Rate ein, auch bei gegliederten Videos.

Nutz die Länge für **mehr Substanz**, nicht für mehr Wörter zum selben Punkt.
Ein zweiter Mechanismus, eine überraschende Zahl, eine zweite Folge — nicht
dieselbe Aussage nochmal anders formuliert.

## Wie gesprochen wird

Es wird **gesprochen, nicht vorgelesen.** Der häufigste Fehler war
geschriebenes Deutsch: korrekt, aber es klingt nach Vortrag und lässt selbst
eine gute Stimme künstlich wirken.

| Statt | Besser |
|---|---|
| „Dies führt dazu, dass…" | „Und dann passiert Folgendes:" |
| „Es ist zu beachten, dass…" | „Achtung:" |
| „eine Datei, welche…" | „so 'ne Datei, die…" |
| „Man sollte…" | „Schreib dir…" |

- **Zweite Person.** „Du" und „dein", nie „man"
- **Kurze Sätze.** Ein Gedanke pro Satz. Verkürzungen sind erlaubt
- **Konkrete Dinge** statt Prinzipien: eine Datei, ein Klick, eine Zahl
- **Die Tipps sind Handlungen.** „Schreib X in eine Datei" statt „achte auf X"

## Umlaute

**Echte Umlaute schreiben: ä, ö, ü, ß.** Nie „ae", „oe", „ue".

Das ist dreimal schiefgegangen und jedes Mal erst im fertigen Video
aufgefallen — „laeuft", „zurueck", „faellt" standen im Bild. Im Code wird
umschrieben, im Inhalt nie.

## Auszeichnung

Nur zwei Zeichen, mehr kennt der Renderer nicht:

- `*fett*` für die Betonung im Satz
- `_grün_` für die Auflösung, den Moment des Verstehens
- `\n` für einen Zeilenumbruch

Sparsam. Ein hervorgehobenes Wort pro Karte wirkt, drei wirken nicht mehr.

## Die Tipps-Szene

Die Textzeilen dieser Szene sind besonders: **Zeile 0 ist die Überleitung,
danach eine Zeile je Tipp.** Daraus werden die Einsätze berechnet, zu denen
die Tipps im Bild erscheinen. Stimmt die Zahl nicht, bricht `zeiten.mjs` ab.

```
"text": [
  "Drei Sachen, die du ab heute anders machst.",
  "Eins: …",
  "Zwei: …",
  "Drei: …"
]
```

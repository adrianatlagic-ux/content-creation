# Sprache

**Aufgabe:** den festgelegten Inhalt so formulieren, dass er gesprochen klingt.
Was gesagt wird, steht in `struktur.md`.

## Füllwörter — der wichtigste Abschnitt

Gemessen an den ersten drei Skripten: **0,16 Füllwörter je Satz.** Eines alle
sechs Sätze, in einem Skript gar keins.

Gesprochenes Deutsch liegt bei ungefähr **einem pro Satz**. Deshalb klingt der
Text nach Vortrag, obwohl jeder Satz für sich richtig ist. **Das ist die
Ursache des künstlichen Klangs — nicht die Stimme.**

**Zielwert: 0,4 bis 0,6 je Satz**, also etwa jeder zweite Satz. Bewusst
weniger als echte Rede, weil geschriebene Füllwörter beim Vorlesen stärker
auffallen als beim Sprechen.

### Womit

**Modalpartikeln** — tragen keine Bedeutung, tragen Haltung:

> halt · eben · ja · doch · mal · eigentlich · einfach · schon · nun

> „Das wird **halt** jedes Mal neu gemacht."
> „Das ist **eben** kein Zufall."
> „Guck **mal** nach, was da steht."

**Gesprächsmarker** — am Satzanfang, sie geben Takt:

> Also · Und nein · Ehrlich gesagt · Pass auf · Klar · Naja

**Verkürzungen** — wie man tatsächlich spricht:

| Geschrieben | Gesprochen |
|---|---|
| eine Datei | 'ne Datei |
| einen Chat | 'nen Chat |
| es geht | geht's |
| ich habe | ich hab |

### Wo nicht

**Nicht im HAKEN, nicht im MERKEN.** Das sind die Sätze, die zitiert und
weitergesagt werden — die müssen sauber stehen. Ein einzelner Marker, der
Arbeit leistet, ist erlaubt („Und **nein**, …"), Polsterung nicht.

**Nicht zwei im selben Satz.** „Das ist halt eben einfach so" ist keine
Umgangssprache, das ist Geschwätz.

---

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
- **Kurze Sätze.** Ein Gedanke pro Satz
- **Konkrete Dinge** statt Prinzipien: eine Datei, ein Klick, eine Zahl
- **Zahlen ausschreiben, wie man sie sagt:** „drei- bis fünfmal", nicht „3–5×"

---

## Umlaute

**Echte Umlaute schreiben: ä, ö, ü, ß.** Nie „ae", „oe", „ue".

Das ist dreimal schiefgegangen und jedes Mal erst im fertigen Video
aufgefallen — „laeuft", „zurueck", „faellt" standen im Bild. Im Code wird
umschrieben, im Inhalt nie.

---

## Auszeichnung

Nur drei Zeichen, mehr kennt der Renderer:

- `*fett*` für die Betonung im Satz
- `_grün_` für die Auflösung, den Moment des Verstehens
- `\n` für einen Zeilenumbruch

Sparsam. Ein hervorgehobenes Wort pro Karte wirkt, drei wirken nicht mehr.

---

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

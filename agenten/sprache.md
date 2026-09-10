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

## Tempo

**Zielrate: 2,9 Wörter je Sekunde — fest.** Das Skript stellt das her, nicht du:

```
node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 --text <narration.txt>
```

Es misst die Rohdauer, zählt die Wörter und rechnet den Faktor selbst aus.
**Gib keinen festen Faktor mehr an.**

Warum: Ein fester Faktor auf schwankende Rohaufnahmen ergibt schwankendes
Tempo — das war der Grund, ZIEL_WPS überhaupt einzuführen.

**Der Weg zu diesem Wert, erste Runde:** mehrfach nach unten korrigiert,
jedes Mal auf direktes Hör-Feedback zum jeweils aktuellen, fertigen Video —
3,3 W/s „ein wenig zu schnell", 3,15 W/s immer noch etwas zu schnell,
3,0 W/s — an `claude-code-limit-reset` gehört — wieder „ein wenig zu
schnell", kurz auf 2,85 gesenkt. Dann zwischenzeitlich gestoppt: 3,0 wurde
als fester Wert festgelegt, um das ständige Nachjustieren bei jeder
weiteren „klingt schnell/langsam"-Rückmeldung zu beenden.

**Zweite Runde, der jetzt gültige Wert:** Direkter Vergleich mit
`context-window-einfach.mp4` (ältere Fassung, andere Pipeline, siehe „Zur
Einordnung" unten) ergab: genau dieses Video klang am natürlichsten —
Stimme, Tempo und Sprechtext zusammen. Gemessen aus der erhaltenen
Vertonung (`public/context/voice-einfach.mp3`, per `messung.json`):
120 Wörter auf 41,48 s, also **2,89 W/s** — praktisch derselbe Wert wie das
schon einmal ausprobierte, dann zugunsten von 3,0 wieder verlassene 2,85.
Der Kanalbetreiber hat daraufhin **explizit** entschieden, den Wert
erneut zu senken, auf 2,9 gerundet — keine Rückkehr zum alten
Nachjustier-Muster, sondern eine eigene, bewusste Entscheidung mit einem
konkreten Referenzvideo dahinter.

**Praktisch heißt das:** Einzelnes, gelegentliches „hört sich schnell/
langsam an" ist weiterhin kein Anlass, `ZIEL_WPS` zu ändern. Nur eine
**explizite** neue Entscheidung des Kanalbetreibers tut das — wie diese
hier. Ändert er sich doch einmal: an drei Stellen synchron halten —
`ZIEL_WPS` in `scripts/speed-up-voice.mjs`, `WPS` in
`scripts/pruefe-video.mjs`, und diese Zahl hier.

**Zur Einordnung:** Frühere, andersartig produzierte Videos (darunter
`context-window-einfach`) lagen gemessen bei 2,64 bis 3,02 W/s — damals
gegen einen fremden Referenzkanal (3,50 W/s) als „langsam" eingeordnet und
deshalb nicht maßgeblich für den eigenen Kanal. Diese Einordnung war zu
pauschal: eines genau dieser Videos ist jetzt die eigene Referenz.
Maßgeblich bleibt die Rückmeldung zum eigenen Kanal, nicht ein externer
Vergleichskanal — „langsamer als ein fremder Referenzkanal" heißt nicht
„falsch für diesen Kanal".

Die Rohaufnahme liegt bei rund 2,1 bis 2,4 W/s, der nötige Faktor also
knapp über 1. Das ist normal und klingt nicht gehetzt — atempo dehnt die
Zeitachse und lässt die Tonhöhe unangetastet.

**Ändern heißt: alle Videos lassen sich kostenlos neu vertonen**, solange
die Rohaufnahme (`public/<id>-raw.mp3`) erhalten bleibt — es ist derselbe
`speed-up-voice.mjs`-Lauf, nur mit neuem `ZIEL_WPS`, kein neuer
ElevenLabs-Aufruf.

---

## Betonung — gegen die eintönige Stimme

Rückmeldung: die Stimme klang in mehreren Videos eintönig, obwohl ein
früheres Video lebendiger wirkte. Kein Video hat je Regieanweisungen wie
`[excited]` benutzt — der Unterschied lag also nicht an einem Tag, den ein
späteres Video vergessen hätte, sondern schlicht daran, dass der Text
selbst der Stimme nirgends signalisiert, wo die Betonung liegt.

**Ein, höchstens zwei GROSSGESCHRIEBENE Wörter je Satz** — genau die, auf
die beim Sprechen die Betonung fallen soll:

> „Ein Befehl schickt Aufgaben los, die auch dann noch laufen, wenn dein
> Laptop ZU ist."

Nicht jeder Satz braucht eins, sonst nutzt sich der Effekt ab — als Faustregel
etwa jeder zweite bis dritte.

**Das ist etwas anderes als die Bildschirm-Auszeichnung** (`*fett*`/`_grün_`,
siehe unten): Großschreibung hier steuert die **gesprochene** Betonung und
gehört ausschließlich ins `text`-Feld, nie in `behauptung`, `wahrheit`,
`pointe`, `merksatz`, `folge` oder `fussnote` — die landen nie beim
Sprachmodell, nur im Bild, und `*STERNCHEN*` würde dort als Bildschirmtext
falsch aussehen.

**Warum Großschreibung statt `[excited]`-artiger Tags:** eleven_v3
unterstützt solche Regieanweisungen offiziell, „wo das Modell sie
unterstützt" — bei genau dieser geklonten Stimme ist das schon einmal
schiefgegangen (`[fast]` machte die Aufnahme *langsamer*, siehe
`stimme.md`). Großschreibung braucht kein Tag-Verständnis des Modells,
sondern ist einfach Text, den jedes TTS so liest — der zuverlässigere
Standardhebel für diese Stimme.

Dazu, wie bisher: Em-Gedankenstriche für kurze Pausen, Punkte für klare
Stopps. Zu viele Kommas hintereinander lesen sich als ein langer,
gleichförmiger Fluss statt als mehrere Gedanken.

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

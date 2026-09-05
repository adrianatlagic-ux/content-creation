# Grafik

**Aufgabe:** aus dem Skript `videos/<id>.json` bauen — je Szene den Bautyp
wählen und füllen.

Diese Datei zerfällt in zwei Teile: den **Rahmen**, der sich nie ändert, und
die **Bühne**, auf der die Abwechslung entsteht.

## Die eine Regel

**Du schreibst keinen Code.** Du wählst aus dem Katalog und füllst Felder.
Erzeugtes React würde den Render unvorhersehbar brechen, und eine Kette, die
jeden zweiten Tag scheitert, ist schlechter als keine.

Passt kein Typ, nimm den nächstbesten und vermerke es. Ein fehlender Typ ist
Handarbeit für einen Menschen, kein Anlass zu improvisieren.

---

# Der Rahmen — was sich nie ändert

Jede Szene, jedes Video, ohne Ausnahme:

| Element | Wert |
|---|---|
| Hintergrund | `#EFEBE2`, nach oben wärmer |
| Schrift | Monospace, durchgehend |
| Kapitelzeile | oben links, GROSSBUCHSTABEN, ≤ 24 Zeichen |
| Schrittleiste | darunter, 3–5 Stationen |
| Maskottchen | links unten, an der Grundlinie verankert |
| Safe Zone | alles Wichtige zwischen x 60–900, y 250–1420 |

**Warum unveränderlich:** Das ist die Wiedererkennung. Im Feed sieht man
zuerst die Fläche, nicht den Inhalt — daran erkennt jemand den Kanal, bevor
der Ton anspringt. Ein Video, das den Rahmen variiert, ist ein fremdes Video.

**Die Safe Zone ist keine Empfehlung.** Instagram legt seine Bedienoberfläche
über das Video: oben 250 px, unten 500 px, rechts 180 px. Was dort liegt, ist
verdeckt. Das ist hier zweimal passiert — bei den Vergleichsspalten der
`waage` und bei einem Punkt der `karte`.

## Wo der Rahmen implementiert ist

| Was | Datei |
|---|---|
| Farben, Schrift, Safe Zone, Positionen | `src/theme.ts` |
| Der Rahmen selbst | `src/format/scenes.tsx`, Komponente `Rahmen` |
| Die Bauteile (Backdrop, Card, Chip, Mascot) | `src/components.tsx` |

Nichts davon liegt in JSON — der Rahmen ist kein Per-Video-Datum. In JSON
steht nur, was auf der Bühne passiert.

**Kein Bautyp zeichnet den Rahmen selbst.** Er füllt ausschließlich die Bühne
rechts (`LAYOUT.stage`, ab x 340). Wer einen eigenen Hintergrund oder eine
eigene Kapitelzeile malt, bricht die Wiedererkennung — und der Rahmen wird
zweimal gezeichnet.

## Der erste Frame ist das Titelbild

Instagram zeigt im Feed und vor dem Antippen einen **statischen Frame** —
in der Praxis Frame 0. Jede Karte im Format blendet über ein paar Frames
ein (Feder, `delay`), was beim Zusehen richtig aussieht, aber bedeutet: bei
Frame 0 selbst ist außer Hintergrund und Maskottchen **nichts** zu sehen.
Genau das fiel als „das Titelbild ist nicht gut" auf.

**Deshalb trägt die `irrtum`-Szene (immer HAKEN, immer die erste Szene) eine
Titelzeile aus dem Feld `titel` des Videos — ohne Einblendung, von Frame 0
an in voller Deckkraft.** Das ist automatisch so, kein Bautyp-Feld, keine
Entscheidung des Grafik-Agenten: `titel` existiert in jedem Video ohnehin,
und die `irrtum`-Szene rendert es immer. Die einzige Pflicht, die daraus
für neue Themen folgt: **`titel` so schreiben, dass er in eine Zeile
passt** — höchstens 46 Zeichen, `pruefe-video.mjs` warnt darüber, länger
wird im Bild mit Auslassungspunkten abgeschnitten.

Das ersetzt nicht den gesprochenen Haken (der bleibt Widerspruch, keine
Ankündigung, siehe `content/hooks.md`) — es sorgt nur dafür, dass jemand,
der nur den stehenden Frame sieht, ohne Ton, schon weiß, worum es geht.

---

# Die Bühne — was sich je Thema ändert

Hier und nur hier entsteht die Abwechslung, über die Wahl des Bautyps.

## Der Katalog

**Fest gesetzt** — an derselben Stelle in jedem Video:

| Typ | Zeigt | Beat | Pflichtfelder |
|---|---|---|---|
| `irrtum` | durchgestrichene Behauptung, darunter die Richtigstellung, plus die Titelzeile aus `titel` (steht ohne Einblendung ab Frame 0, siehe „Der erste Frame ist das Titelbild" oben) | `HAKEN` | `behauptung`, `wahrheit` |
| `tipps` | drei nummerierte Handlungen | `TUN` | `tipps` |
| `fenster` mit drei `marke`-Zeilen | dieselben drei Handlungen als getippter Befehl/Ausgabe, in der Oberfläche gezeigt statt beschrieben | `TUN` | `fenster`, `zeilen` (genau 3 mit `marke`) |
| `bedienfeld` mit drei `marke`-Elementen | dieselben drei Handlungen als Klick, Reiterwechsel oder Schalter | `TUN` | `bedienfeld`, `elemente` (genau 3 mit `marke`) |
| `schluss` | Pointe und Merk-Aufforderung | `MERKEN` | `pointe`, `merksatz` |

**TUN hat zwei Formen, siehe `struktur.md`: drei unabhängige Merkpunkte, oder
eine Schritt-für-Schritt-Anleitung.** Der Bautyp folgt daraus:

- **`tipps`** — Form 1 (drei Merkpunkte) ohne eine Oberfläche, die man
  zeigen könnte („leg eine Datei an"). Immer genau drei.
- **`fenster`** mit 2 bis 5 markierten Zeilen — Form 2, wenn die Schritte
  Text sind: ein getippter Befehl, eine Ausgabe.
- **`bedienfeld`** mit 2 bis 5 markierten Elementen — Form 2, wenn die
  Schritte ein Zustand sind, der sich ändert: eine Einstellung wird
  ausgewählt, ein Reiter wechselt, ein Schalter kippt, ein Feld füllt sich.
  **Das ist der Regelfall bei einem Werkzeug-Thema** — „Tab: Auto Mode" als
  Text zu schreiben beschreibt nur den Klick, `bedienfeld` zeigt ihn: der
  Reiter wechselt wirklich, ein Cursor bewegt sich hin. Wenn ein TUN-Schritt
  so klingt, als würde er einen Ort in einer Oberfläche benennen, gehört er
  hierher, nicht in `fenster`.

Bei `fenster`/`bedienfeld` trägt jeder Schritt ein `marke`-Feld, meist
fortlaufend nummeriert (`"1"`, `"2"`, …) statt der festen „EINS/ZWEI/DREI"
aus `tipps` — die Anzahl ist bei Form 2 nicht mehr fix. **Eine einzelne
TUN-Szene ist genau ein Bautyp** — nicht ein Schritt `fenster` und der
nächste `bedienfeld` im selben Bild.

**Die Mitte** — wähle, was den Vorgang am klarsten zeigt, nicht was noch
nicht dran war:

| Typ | Zeigt | Passt zu | Pflichtfelder |
|---|---|---|---|
| `zerlegung` | etwas zerfällt in eingefärbte Teile | WAS, WIE | `titel`, `satz`, `teile`, `fussnote` |
| `behaelter` | ein Behälter füllt sich | WAS, WIE | `nachrichten`, `kapazitaet`, `notiz?` |
| `ueberlauf` | der Behälter läuft über, Ältestes fällt raus | WARUM, WIE | `nachrichten`, `kapazitaet`, `folge` |
| `durchlauf` | ein Strahl wandert über alles Enthaltene | WIE | `nachrichten`, `kapazitaet`, `hinweis`, `pointe` |
| `balken` | Größen im Vergleich, mit Faktor | WARUM, WANN | `titel`, `reihen`, `folge`, `fussnote?` |
| `fenster` | ein Fenster, in dem Zeilen auflaufen und bleiben | WAS, WIE | `fenster`, `zeilen`, `stil?`, `produkt?`, `fussnote?` |
| `waage` | zwei Seiten gegeneinander, eine empfohlen | WANN | `links`, `rechts`, `urteil`, `empfehlung?` |
| `streuung` | eine Eingabe, mehrere verschiedene Ausgaben | WARUM, WANN | `frage`, `antworten`, `fussnote?` |
| `karte` | Punkte im Raum, Nähe ist Ähnlichkeit | WAS | `punkte`, `hinweis`, `verbindung?` |

Dazu bei jeder Szene: `beat`, `kapitel` (GROSSBUCHSTABEN, ≤ 24 Zeichen),
`pose`, `schritt`, `text`.

Ein Typ außerhalb seiner Beat-Spalte ist eine **Warnung**, kein Fehler —
manchmal passt eine ungewöhnliche Wahl besser. Aber begründe sie, statt sie
aus Abwechslungslust zu treffen.

**Dreimal derselbe Typ** in einem Video heißt meist, dass ein Beat falsch
besetzt ist.

## Es darf nie stillstehen

**Höchstens 3 Sekunden ohne sichtbare Bewegung.** `pruefe-video.mjs` lehnt
mehr ab.

Gemessen an den fertigen Videos: Halluzination hatte **1,4 Ereignisse je 10
Sekunden** — alle sieben Sekunden passierte etwas. Die früheren Videos lagen
bei 4,0 bis 4,6. Das ist der Unterschied zwischen „erklärt" und „vorgelesen,
während im Hintergrund ein Standbild steht".

Geprüft wird der **größte Abstand**, nicht der Durchschnitt. Eine Dichteregel
ließe sich durch Klumpen erfüllen: drei Ereignisse in einer Sekunde, dann neun
Sekunden nichts.

**Wie du Bewegung erzeugst:**

- Mehr Einträge mit eigenem `at` — Nachrichten, Zeilen, Antworten, Balken
- Die `at`-Werte über die ganze Szenendauer strecken, nicht nur an den Anfang
- Eine lange Szene in zwei kürzere teilen

**Zwei Typen sind ausgenommen**, weil bei ihnen dauerhaft etwas läuft:
`durchlauf` (der Suchstrahl wandert) und `fenster` (der Cursor blinkt).

**Und eine Szene darf höchstens 12 Sekunden dauern**, `tipps` ausgenommen.

---

## Besonderheiten einzelner Typen

- **`irrtum`** — trägt zusätzlich zu `behauptung`/`wahrheit` immer die
  Titelzeile aus `titel` (28px, fett, ohne Einblendung ab Frame 0). Kein
  Feld hier zu setzen, nur `titel` im Video kurz genug halten — siehe „Der
  erste Frame ist das Titelbild" oben.
- **`fenster`** — jede Zeile hat `rolle`: `system`, `nutzer`, `antwort`.
  Höchstens 5 Zeilen. `stil: 'chat'` (Vorgabe — Eingaben als rechtsbündige
  Sprechblase, Antworten als Fließtext mit einem Punkt statt einer Marke,
  Systemzeilen als schmaler Hinweis mittig, dazu ein Eingabefeld unten) oder
  `stil: 'terminal'` (dunkel, `❯` vor Eingaben, Ausgabe ohne Marke — für
  Claude Code, Codex oder jedes andere CLI-Werkzeug). `produkt` setzt ein
  Label in die Fensterleiste, z. B. `"Claude"` oder `"Claude Code"` — macht
  sichtbar, von welchem Werkzeug die Rede ist, **ohne** dessen Oberfläche
  nachzubilden. Das Fenster bleibt eine Illustration im Kanalstil, kein
  Screenshot — es muss nicht aktuell bleiben, wenn sich die echte
  Oberfläche ändert. `marke` auf genau drei Zeilen lässt `fenster` selbst
  den TUN-Beat tragen, siehe oben.
- **`bedienfeld`** — 1 bis 5 `elemente`, jedes eine `art`: `liste`
  (Menüzeilen, eine wird ab `at` markiert), `reiter` (Tableiste, wechselt
  bei `at` von `start`- auf `ziel`-Index), `schalter` (An/Aus, kippt bei
  `at` in den Zustand `an`) oder `eingabe` (Feld füllt sich ab `at` mit
  `wert`, Haken erscheint). Ein Cursor-Punkt wandert automatisch zum
  jeweils nächsten Element und „klickt" kurz davor — keine eigene Angabe
  nötig. Farbe folgt der Kanalkonvention: aktiv/ausgewählt/an ist immer
  `good` (grün), nie `accent` (rot bleibt Warnungen vorbehalten, siehe
  `balken`). `marke` auf 2 bis 5 Elementen lässt `bedienfeld` den TUN-Beat
  tragen, siehe oben — ab 5 Elementen prüfen, ob es noch auf eine Bildhöhe
  passt (Warnung, kein Fehler). Wie bei `fenster` eine Illustration, kein
  Screenshot der echten Oberfläche.
- **`waage`** — `empfehlung` hebt eine Seite grün hervor. Höchstens 4 Punkte
  je Seite, je 30 Zeichen: die Spalten sind schmal, weil beide zwischen
  Maskottchen und Safe Zone passen müssen.
- **`streuung`** — zwei oder drei Antworten, nicht mehr. `ton` setzt die
  Farbe: `gut` für die richtige, `warnung` für die falsche.
- **`karte`** — `x` und `y` laufen von 0 bis 1. **`x` darf 0,72 nicht
  überschreiten**, sonst liegt der Name unter Instagrams Knopfleiste.
  `gruppe` färbt (0 grün, 1 rot, 2 grau), `verbindung` zieht eine Linie.
- **`balken`** — `ton` je Reihe setzt die Farbe explizit. Ohne `ton` fällt nur
  die größte Reihe auf; bei einem Zweiervergleich muss `ton` gesetzt werden.
- **`schluss`** — zeigt zusätzlich zu `pointe`/`merksatz` einen festen
  Hinweis „Genaue Schritte in der Caption ↓ · Folge für mehr KI-Tipps",
  fest im Bauteil verankert, **nicht** über JSON steuerbar und **nicht**
  Teil des Sprechertexts. Kostet also keine Sekunde Erzählzeit, erscheint
  aber in jedem Video gleich — Rahmen, nicht Bühne. Grund: ohne ihn wusste
  jemand, der nur zusieht und die Caption nicht extra aufklappt, nicht, wo
  die genauen Befehle/Schritte stehen.

## Posen

Vier Stück, sie sollen wechseln — ein stehendes Maskottchen wirkt tot.

| Pose | Wofür |
|---|---|
| `skeptisch` | HAKEN, die unangenehme Folge |
| `erklaerend` | WAS, WIE, TUN |
| `denkend` | die Einsicht, der Zwischenschritt |
| `selbstsicher` | MERKEN |

## Die Schrittleiste

`schritte` ist der Weg durch das Thema in 3–5 Wörtern. Jede Szene setzt
`schritt` auf ihren Index, oder `-1` für keinen (HAKEN, TUN, MERKEN).

Die Leiste ist der rote Faden. Sie muss zum Thema passen, nicht generisch
sein — und die Wörter müssen **auf einen Blick unterscheidbar** sein.
„ZÄHLEN" und „ZAHLEN" nebeneinander sind es nicht.

## Längen, die im Bild brechen

| Feld | Grenze |
|---|---|
| `kapitel` | 24 Zeichen |
| `titel` (Video, Titelzeile im Hook) | 46 Zeichen |
| Tipp-Text | 68 Zeichen |
| `nachrichten[].label` | 26 Zeichen |
| `waage`-Punkt | 30 Zeichen |
| `streuung`-Antwort | 42 Zeichen |

`pruefe-video.mjs` warnt darüber. Warnungen ernst nehmen — sie kommen aus
Fällen, in denen Text tatsächlich in die Instagram-Oberfläche lief.

## Neuer Bautyp?

Nur wenn ein bestehender das Thema **falsch** zeigen würde, nicht zur
Abwechslung. Vier bis fünf wiederkehrende Typen sind ein Format, zwölf sind
ein Sammelsurium.

**Regel für den Namen: Er beschreibt die Darstellung, nie das Thema.** Ein
Name, der nur zu einem Thema passt, ist falsch geschnitten — genau das war
bei `tokens`, `kasten`, `voll`, `neulesen` und `kosten` der Fall, bevor sie
zu `zerlegung`, `behaelter`, `ueberlauf`, `durchlauf` und `balken` wurden.

Zur Ansicht: `videos/katalog.json` zeigt mehrere Typen mit echten Inhalten.
Das ist eine Probe (`"probe": true`), kein Video zum Posten.

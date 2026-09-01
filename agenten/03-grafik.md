# Grafik-Agent

**Aufgabe:** aus dem Sprechertext `videos/<id>.json` bauen — Szenentypen
wählen und füllen.

## Die eine Regel

**Du schreibst keinen Code.** Du wählst aus dem Katalog unten und füllst die
Felder. Erzeugtes React würde den Render unvorhersehbar brechen, und eine
Kette, die jeden zweiten Tag scheitert, ist schlechter als keine.

Passt kein Typ, nimm den nächstbesten und vermerke es. Ein fehlender Typ ist
Handarbeit für einen Menschen, kein Anlass zu improvisieren.

## Was nie variiert

Hintergrund, Schrift, Maskottchen links unten, Kapitelzeile oben. **Das ist
die Wiedererkennung** — daran sieht man im Feed, von wem das Video ist, bevor
der Ton anspringt. Die Abwechslung passiert ausschließlich auf der Bühne
rechts, über den Szenentyp.

## Der Katalog

**Fest gesetzt** — diese drei stehen in jedem Video an derselben Stelle:

| Typ | Zeigt | Pflichtfelder |
|---|---|---|
| `irrtum` | Durchgestrichene Behauptung, darunter die Wahrheit | `behauptung`, `wahrheit` |
| `tipps` | Drei nummerierte Handlungen | `tipps` |
| `schluss` | Pointe und Merk-Aufforderung | `pointe`, `merksatz` |

**Die Mitte** — hier entsteht die Abwechslung. Wähle, was den Vorgang am
klarsten zeigt, nicht was noch nicht dran war:

| Typ | Zeigt | Wofür | Pflichtfelder |
|---|---|---|---|
| `kasten` | Behälter, der sich füllt | Kapazität, Grenzen | `nachrichten`, `kapazitaet`, `notiz?` |
| `voll` | Derselbe Behälter läuft über | Verdrängung | `nachrichten`, `kapazitaet`, `folge` |
| `neulesen` | Suchstrahl über den vollen Behälter | Zustandslosigkeit | `nachrichten`, `kapazitaet`, `hinweis`, `pointe` |
| `tokens` | Ein Satz zerfällt in Stücke | Zerlegung, Einheiten | `titel`, `satz`, `tokens`, `fussnote` |
| `kosten` | Balken, die mit einer Kennzahl wachsen | Skalierung, Preis | `titel`, `reihen`, `folge`, `fussnote?` |
| `terminal` | Falsches Fenster, Zeilen laufen auf | Wo etwas steht, was bleibt | `fenster`, `zeilen`, `fussnote?` |
| `waage` | Zwei Seiten gegeneinander | Entscheidungen mit Abwägen | `links`, `rechts`, `urteil`, `empfehlung?` |
| `streuung` | Eine Frage, mehrere Antworten | Nichtdeterminismus | `frage`, `antworten`, `fussnote?` |
| `landkarte` | Punkte im Raum, Nähe ist Bedeutung | Ähnlichkeit, Vektorsuche | `punkte`, `hinweis`, `verbindung?` |

### Welcher Typ zu welchem Thema

| Thema | Typ |
|---|---|
| Tokens | `tokens` + `kosten` |
| Halluzination | `streuung` (eine falsche Antwort auf `warnung`) |
| System-Prompt | `terminal` |
| RAG vs. Fine-Tuning | `waage` |
| Temperature | `streuung` |
| Embeddings | `landkarte` |
| Reasoning-Modelle | `waage` + `kosten` |
| MCP | `terminal` |

### Besonderheiten der vier neuen Typen

- **`terminal`** — jede Zeile hat `rolle`: `system` (grün, bleibt), `nutzer`,
  `antwort`. Der Kontrast zwischen bleibender Systemzeile und flüchtigen
  Nutzerzeilen ist meist die eigentliche Aussage. Höchstens 5 Zeilen.
- **`waage`** — `empfehlung` hebt eine Seite grün hervor. Höchstens 4 Punkte
  je Seite, je 30 Zeichen: die Spalten sind schmal, weil beide zwischen
  Maskottchen und Safe Zone passen müssen.
- **`streuung`** — zwei oder drei Antworten, nicht mehr. `ton` setzt die
  Farbe: `gut` für die richtige, `warnung` für die halluzinierte.
- **`landkarte`** — `x` und `y` laufen von 0 bis 1. **`x` darf 0,72 nicht
  überschreiten**, sonst liegt der Name unter Instagrams Knopfleiste.
  `gruppe` färbt (0 grün, 1 rot, 2 grau), `verbindung` zieht eine Linie
  zwischen zwei Punkten.

Dazu bei jeder Szene: `kapitel` (GROSSBUCHSTABEN, ≤ 24 Zeichen), `pose`,
`schritt`, `text`.

## Feste Reihenfolge

1. **Erste Szene ist immer `irrtum`** — das ist der Hook
2. Zwei bis vier Szenen Mitte
3. **Vorletzte ist immer `tipps`**
4. **Letzte ist immer `schluss`**

## Posen

Vier Stück, sie sollen wechseln — ein stehendes Maskottchen wirkt tot.

| Pose | Wofür |
|---|---|
| `skeptisch` | Der Irrtum, die unangenehme Folge |
| `erklaerend` | Der Mechanismus, die Tipps |
| `denkend` | Die Einsicht, der Zwischenschritt |
| `selbstsicher` | Der Schluss |

## Die Schrittleiste

`schritte` ist der Weg durch das Thema in 3–5 Wörtern, z. B.
`["REIN", "VOLL", "RAUS", "NEU LESEN"]`. Jede Szene setzt `schritt` auf ihren
Index, oder `-1` für keinen (Hook, Tipps, Schluss).

Die Leiste ist der rote Faden. Sie muss zum Thema passen, nicht generisch sein.

## Längen, die im Bild brechen

| Feld | Grenze |
|---|---|
| `kapitel` | 24 Zeichen |
| Tipp-Text | 68 Zeichen |
| `nachrichten[].label` | 26 Zeichen |

`pruefe-video.mjs` warnt darüber. Warnungen ernst nehmen — sie kommen aus
Fällen, in denen Text tatsächlich in die Instagram-Bedienoberfläche lief.

## Neuer Szenentyp?

Nur wenn ein bestehender das Thema **falsch** zeigen würde, nicht zur
Abwechslung. Vier bis fünf wiederkehrende Typen sind ein Format, zwölf sind
ein Sammelsurium.

Zur Ansicht: `videos/katalog.json` zeigt alle vier neuen Typen mit echten
Inhalten. Das ist eine Probe (`"probe": true`), kein Video zum Posten — die
Längenregel gilt für sie nicht.

Braucht ein Thema einen Typ, den es nicht gibt: melden, nicht behelfen.

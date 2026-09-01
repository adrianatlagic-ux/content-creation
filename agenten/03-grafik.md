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

| Typ | Zeigt | Pflichtfelder |
|---|---|---|
| `irrtum` | Durchgestrichene Behauptung, darunter die Wahrheit | `behauptung`, `wahrheit` |
| `kasten` | Behälter, der sich füllt | `nachrichten`, `kapazitaet`, `notiz?` |
| `voll` | Derselbe Behälter läuft über | `nachrichten`, `kapazitaet`, `folge` |
| `neulesen` | Suchstrahl über den vollen Behälter | `nachrichten`, `kapazitaet`, `hinweis`, `pointe` |
| `tokens` | Ein Satz zerfällt in Stücke | `titel`, `satz`, `tokens`, `fussnote` |
| `kosten` | Balken, die mit einer Kennzahl wachsen | `titel`, `reihen`, `folge`, `fussnote?` |
| `tipps` | Drei nummerierte Handlungen | `tipps` |
| `schluss` | Pointe und Merk-Aufforderung | `pointe`, `merksatz` |

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

Geplant, aber noch nicht gebaut: `terminal` (falsches Chat-Fenster), `waage`
(Kosten gegen Nutzen), `streuung` (ein Prompt, drei Antworten), `landkarte`
(Punkte im Raum). Braucht ein Thema einen davon — melden, nicht behelfen.

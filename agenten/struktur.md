# Inhaltliche Struktur

**Aufgabe:** festlegen, was in welcher Reihenfolge erklärt wird.
Wie es formuliert wird, steht in `sprache.md`.

## Die sieben Beats

Jede Szene trägt genau einen Beat, in dieser Reihenfolge.
`pruefe-video.mjs` lehnt Abweichungen ab.

| # | Beat | Die Frage, die er beantwortet | Pflicht |
|---|---|---|---|
| 1 | `HAKEN` | Was glauben alle falsch? | ja |
| 2 | `WAS` | Was ist das Ding wirklich? | ja |
| 3 | `WARUM` | Was kostet dich das? | ja |
| 4 | `WIE` | Wie funktioniert es? | ja |
| 5 | `WANN` | Wann kippt es, wann ist es harmlos? | nein |
| 6 | `TUN` | Drei konkrete Handlungen | ja |
| 7 | `MERKEN` | Der eine Satz zum Mitnehmen | ja |

Sechs bis sieben Szenen.

### Warum diese Reihenfolge

Sie folgt der Reihenfolge, in der Widerstand entsteht.

**HAKEN** bricht die Erwartung — jetzt hört jemand zu. **WAS** liefert sofort
den Ersatz für die zerstörte Vorstellung; wer eine Annahme kaputt macht und
keine neue anbietet, verliert den Zuschauer im Leeren. **WARUM** kauft die
restlichen fünfzig Sekunden: ohne Preis ist alles Weitere Trivia. Erst dann
trägt **WIE** — den Mechanismus will nur wissen, wer weiß, dass er ihn braucht.

Ein WIE vor dem WARUM ist der häufigste Aufbaufehler: technisch korrekt und
trotzdem weggescrollt.

---

## Was jeder Beat leisten muss

### HAKEN

**Enthält:** die verbreitete Fehlannahme, ausgesprochen als Annahme, und
unmittelbar danach den Widerspruch. Muster und Formvorgaben in
`content/hooks.md`.

**Ist nicht:** eine Ankündigung dessen, was kommt.

**Prüffrage:** Würde jemand beim ersten Satz nicken und beim zweiten stutzen?
Wenn nicht beides, ist es kein Haken.

### WAS

**Enthält:** was das Ding tatsächlich ist, in einem Bild, das man nach
einmaligem Hören wiedergeben kann. Bevorzugt ein Gegenstand oder ein Maß.

**Ist nicht:** eine Lehrbuchdefinition, und nicht die Nennung der
Oberkategorie — „X ist eine Einheit" sagt nichts, jede Einheit ist eine
Einheit.

**Prüffrage:** Braucht das Bild einen zweiten Satz, um verstanden zu werden?
Dann ist es falsch gewählt.

### WARUM

**Enthält:** einen Preis in einer Einheit, die der Zuschauer spürt — Geld,
Zeit, oder eine falsche Antwort, die er nicht als falsch erkennt.

**Ist nicht:** „es ist wichtig, das zu verstehen". Das ist kein Preis, das ist
eine Behauptung über Wichtigkeit.

**Prüffrage:** Kannst du die Einheit benennen? **Wenn nicht, ist das Thema
falsch gewählt** — dann gehört es nicht in die Liste, nicht in dieses Video.

Der Preis muss **seiner** sein, nicht der der Branche. „Das kostet Unternehmen
Milliarden" ist niemandes Preis.

Bei einem Werkzeug-Thema ist der Preis oft Reibung, kein Fehler — „ständiges
Unterbrechen fürs Bestätigen", „am Rechner sitzen bleiben, obwohl nichts mehr
zu tun ist". Das zählt als **Zeit**, aber nur, wenn es konkret bleibt: eine
Zahl, eine Situation, kein „ist halt nervig".

### WIE — der Kern

**Enthält:** den Mechanismus. **Zwei zulässige Wege, mindestens einer ist
Pflicht:**

- **Technisch** — der Vorgang in Schritten: was zuerst passiert, was danach
- **Analogie** — ein Bild aus dem Alltag mit demselben Mechanismus

**Regel für Analogien: sag, wo sie bricht.** Ein Halbsatz reicht. Eine
Analogie, die man für die ganze Wahrheit hält, lehrt ein falsches Modell —
und das ist schlimmer als gar keins: Der Zuschauer entscheidet danach auf
einer Grundlage, die er für gesichert hält.

Beides zusammen ist erlaubt und meist am besten: erst das Bild, dann ein Satz
technisch.

**Ist nicht:** eine Wiederholung von WAS in anderen Worten. WAS sagt, *was es
ist*. WIE sagt, *was passiert*.

**Prüffrage:** Beantwortet der Beat „und dann?" — oder immer noch „was ist
das?" Im zweiten Fall ist es verkapptes WAS.

**Bei einem Werkzeug-Thema (Spur `werkzeuge`, siehe `thema.md`) ist WIE nicht
der Klickpfad — das ist TUN.** WIE ist das Verhalten, das man nicht am Knopf
allein sieht: Was läuft im Hintergrund, welchen Zustand behält es, wo endet
es. Beispiel `/schedule`: nicht „du tippst `/schedule` und wählst eine Zeit"
(das ist TUN), sondern „die Aufgabe startet als eigene, neue Sitzung — nicht
als Fortsetzung deines aktuellen Chats" (das ist WIE: eine Eigenschaft, die
überrascht und die man vor dem Draufklicken wissen sollte). Trägt ein
Werkzeug-Thema an dieser Stelle nichts außer dem Klickpfad selbst, ist WIE
vermutlich überflüssig — dann WIE weglassen wie ein erfundenes WANN, nicht
mit TUN-Inhalt auffüllen.

### WANN (optional)

**Enthält:** die Bedingung, unter der sich das Verhalten ändert. Wann wird es
schlimm, wann harmlos, wann teuer, wann egal.

**Ist nicht:** eine erfundene Abstufung, um den Beat zu füllen.

**Prüffrage:** Gibt es einen echten Unterschied? Wenn du zögerst, lass den
Beat weg — die Wörter gehören dann WIE. **Ein weggelassenes WANN ist kein
Mangel, ein erfundenes ist einer.**

### TUN

**Enthält:** drei Handlungen, jede mit einem Ort zum Klicken oder etwas zum
Tippen.

**Ist nicht:** Absichten oder Haltungen.

**Prüffrage:** Könnte jemand das in den nächsten fünf Minuten tun, ohne
nachzufragen? Fehlt der Ort oder der Wortlaut, ist es keine Handlung.

**Warum genau drei:** Zwei wirken wie eine unfertige Liste, vier merkt sich
niemand — und das Bildlayout ist auf drei ausgelegt.

### MERKEN

**Enthält:** einen Satz, den man weitersagen kann. Das ist der Grund zum
Speichern.

**Ist nicht:** eine Zusammenfassung des Videos. Wer zusammenfasst, gibt nichts
mit — er wiederholt.

**Prüffrage:** Könnte jemand diesen Satz morgen einem Kollegen sagen, ohne das
Video erklären zu müssen?

---

## Wortbudget

Rund **198 Wörter** bei etwa 60 Sekunden — die Zielrate liegt bei 3,3 Wörtern
je Sekunde (siehe `sprache.md`). Drei Beats haben feste Längen, weil sie feste
Funktionen haben:

| Beat | Wörter |
|---|---|
| HAKEN | 22–28 |
| TUN | 42–50 |
| MERKEN | 14–20 |

Die restlichen **rund 110 Wörter** teilen sich WAS, WARUM, WIE und
gegebenenfalls WANN:

| Erklär-Beats | je Beat |
|---|---|
| 3 (ohne WANN) | ~37 |
| 4 (mit WANN) | ~28 |

**Eine Szene darf höchstens 12 Sekunden dauern**, also rund 36 Wörter tragen.
Darüber steht zu lange dasselbe Bild. Die Tipps-Szene ist ausgenommen, sie
verteilt ihre drei Einsätze über die volle Länge.

**Weniger Beats heißt längere Beats, nicht kürzeres Video.** Genau das ging
bei der ersten Tokens-Fassung schief: wenige Beats *und* kurz — 27 Sekunden,
die nichts vollständig erklärten.

---

## Im JSON

Jede Szene bekommt ein Feld `beat`:

```json
{ "typ": "balken", "beat": "WARUM", "kapitel": "DER TEURE TEIL", … }
```

Der Beat-Entwurf je Thema steht in `content/themen.json` unter `beats` — dort
wird er gepflegt. **Diese Datei beschreibt die Form, nicht die Themen**, sonst
veraltet sie mit jedem neuen Thema.

---

## Anhang: Form-Beispiele

Nur zur Kalibrierung, nicht als Vorlage. Jedes Paar aus einem anderen Bereich,
damit kein Thema die Vorgabe prägt.

| Beat | ✅ | ❌ |
|---|---|---|
| HAKEN | „Deine KI hat kein schlechtes Gedächtnis. Sie hat gar keins." | „Heute erkläre ich dir, wie das funktioniert." |
| WAS | „Ein Embedding ist ein Ort. Ähnliches liegt nah beieinander." | „Eine vektorielle Repräsentation semantischer Merkmale." |
| WARUM | „Du kannst eine erfundene Quelle nicht von einer echten unterscheiden." | „Das ist ein zentrales Problem moderner Systeme." |
| WIE | „Es sagt das nächste Stück vorher. Dann das nächste. Es schlägt nichts nach." | „Der Speicherbereich enthält den bisherigen Verlauf." *(das ist WAS)* |
| WANN | „Am schlimmsten bei Zahlen und Zitaten. Bei Alltagswissen kaum." | „Manchmal mehr, manchmal weniger — je nach Fall." |
| TUN | „Leg eine regeln.md an und häng sie an den Chat." | „Achte darauf, konsistent zu bleiben." |
| MERKEN | „Sie erinnert sich nicht. Sie liest nach." | „Wir haben also gesehen, dass es begrenzt ist." |

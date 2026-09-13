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

**Enthält:** zuerst wortgleich die feste Zeile „Kurzer KI-Crashkurs.", dann
die verbreitete Fehlannahme, ausgesprochen als Annahme, und unmittelbar
danach den Widerspruch. Muster und Formvorgaben in `content/hooks.md`,
Abschnitt „Die erste Sekunde" — dort auch, warum die feste Zeile
(zwischenzeitlich verboten) jetzt wieder Standard ist. `pruefe-video.mjs`
prüft sie.

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

**Eine Eigenschaft ist noch kein Mechanismus, auch wenn sie technisch
klingt.** Rückmeldung zu `claude-cowork-browser`: Die Erklärung blieb
„schwammig" — konkret verstand der Zuschauer den *Grund* (Login-Daten
gefährden den Browser nicht, wenn man keine gibt), aber nicht das *Wie*:
warum öffnet sich überhaupt ein separater Browser, statt einfach den
vorhandenen zu benutzen? Der WIE-Satz „er startet leer, bei jeder Aufgabe
neu" erfüllt die Form oben rein technisch, bleibt aber selbst eine
Eigenschaftsbehauptung — kein Bild, das man sich vorstellt, kein Schritt,
den man nachvollzieht. Er sagt *dass* es getrennt ist, nicht *warum das
möglich/nötig ist*. Bei Isolations-Themen (Sandbox, getrennter Account,
eigenes Netzwerk, eigener Browser) trägt eine Analogie fast immer mehr als
die Eigenschaft selbst nochmal anders zu formulieren — „wie ein Leihgerät,
das bei jedem Auftrag neu und leer ausgegeben wird" macht in einem Bild
klar, warum nichts von deinem eigenen Gerät mitkommt. **Zusätzliche
Prüffrage bei Isolations-Themen:** Könnte jemand nach dem Satz erklären,
*warum* die Trennung existiert — nicht nur, *dass* sie existiert? Wenn
nicht, fehlt die Analogie, auch wenn „mindestens ein Weg" oben formal
erfüllt scheint.

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

**Ist nicht:** Absichten oder Haltungen. **Ist auch nicht:** eine
Beschreibung dessen, was das Werkzeug danach von selbst tut. Rückmeldung
zu `claude-cowork-browser`: „Rechts öffnet sich automatisch der eigene
Browser, du siehst mit" klingt wie ein TUN-Schritt, ist aber eine
Zustandsbeschreibung — der Zuschauer tut hier nichts, er beobachtet nur.
Von drei TUN-Sätzen war dort nur einer („eine Aufgabe stellen") eine
echte Handlung; die anderen beiden erzählten, was das System automatisch
macht. Ergebnis: kein klares „das mache ich jetzt", weil zwei von drei
Punkten gar keine Handlung waren. **Jeder einzelne TUN-Punkt muss mit
einem Verb in der zweiten Person stehen können** („öffne", „aktiviere",
„trag ein"), nicht mit „es öffnet sich" oder „er zeigt".

**Prüffrage:** Könnte jemand das in den nächsten fünf Minuten tun, ohne
nachzufragen? Fehlt der Ort oder der Wortlaut, ist es keine Handlung. Bei
jedem einzelnen Punkt zusätzlich prüfen, nicht nur beim Beat insgesamt —
ein Mix aus einer echten Handlung und zwei Beobachtungen besteht die
Prüfung nicht.

**Warum genau drei:** Zwei wirken wie eine unfertige Liste, vier merkt sich
niemand — und das Bildlayout ist auf drei ausgelegt. **Gilt für drei
unabhängige Merkpunkte** (Bautyp `tipps`) — drei Dinge, die man sich für
immer wieder merkt, nicht nur für dieses eine Mal.

**Zweite, andere TUN-Form: die Schritt-für-Schritt-Anleitung.** Wenn das
Video eine einzelne Sache Schritt für Schritt fertig einrichtet — einen
Connector hinzufügen, eine Einstellung aktivieren —, ist das keine Liste
unabhängiger Merkpunkte, sondern **eine** zusammenhängende Handlung mit so
vielen Schritten, wie sie tatsächlich braucht. Zwei ist hier keine
unfertige Liste, fünf sind kein Zuviel — beides ist ehrlich, solange jeder
Schritt wirklich nötig ist. Bautyp `bedienfeld` (oder `fenster` für einen
getippten Befehl), 2 bis 5 markierte Schritte statt starr drei. Am Ende
steht ein klarer Fertig-Zustand, meist über `fussnote`.

**Welche Form passen?** Prüffrage: Sind es drei Dinge, die man sich generell
merkt (Form 1), oder ist es eine Sache, die am Ende erledigt ist (Form 2)?
„Frag nach der Quelle. Stell die Frage neu. Sag ihr, sie soll dich warnen."
ist Form 1 — drei getrennte Gewohnheiten. „Öffne die Connector-Liste, wähle
MCP, füg die URL ein, bestätige" ist Form 2 — ein Vorgang, keine Liste.

### MERKEN

**Enthält:** einen Satz, den man weitersagen kann. Das ist der Grund zum
Speichern.

**Ist nicht:** eine Zusammenfassung des Videos. Wer zusammenfasst, gibt nichts
mit — er wiederholt.

**Prüffrage:** Könnte jemand diesen Satz morgen einem Kollegen sagen, ohne das
Video erklären zu müssen?

**Danach, fest und gesprochen, in jedem Video derselbe Wortlaut:**

> „Genaue Schritte in der Caption. Folgt für mehr KI-Tipps."

Das ist kein Bildschirmtext, sondern **wird mitgesprochen** — er zählt zur
echten Sprechzeit und steht als zweiter Eintrag in `schluss.text`
(`text[0]` ist Pointe/Merksatz, `text[1]` dieser Satz, wortgleich, sonst
lehnt `pruefe-video.mjs` das Video ab). Grund: Ohne ihn weiß niemand, der
nur zusieht und die Caption nicht extra aufklappt, dass die genauen
Befehle/Schritte dort stehen — das fiel erst auf, als ein fertiges Video
genau diese Lücke hatte. Neun Wörter, **zusätzlich** zum MERKEN-Wortbudget
unten, nicht davon abgezogen.

---

## Werkzeug-Themen: allgemein zuerst, das Werkzeug als Lösung

Gemessen (siehe `thema.md`): reine Werkzeug-Videos, die mit dem Befehl
selbst aufmachen, blieben unter 100 Aufrufen. Allgemeine Konzept-Videos
lagen darüber. Der Unterschied liegt nicht am Beat-Gerüst — das bleibt
HAKEN bis MERKEN wie oben —, sondern daran, **welche Ebene die frühen
Beats tragen.**

**HAKEN, WAS, WARUM und WIE gehören dem allgemeinen Phänomen, nicht dem
Werkzeug.** Sie müssen für jeden funktionieren, der das Werkzeug noch nie
angefasst hat — sonst filtert der Haken selbst schon auf die kleine
Zielgruppe, die den Befehl bereits kennt. Erst **TUN gehört dem
Werkzeug**: der konkrete Befehl, das konkrete Feature, als Lösung für das
gerade erklärte allgemeine Problem.

Am Beispiel Nutzungslimit:

| Beat | Allgemein (richtig) | Werkzeug-first (vermeiden) |
|---|---|---|
| HAKEN | „Du denkst, dein Nutzungslimit ist einfach zufällig knapp." | „Du kennst Schrägstrich Limit-Reset noch nicht." |
| WAS | Das Limit hängt am Kontextfenster, nicht an der Zeit | Was der Befehl tut |
| WARUM | Ein großes Kontextfenster verbraucht das Limit schneller | — |
| WIE | Jede Nachricht schleppt den ganzen bisherigen Chat mit | — |
| TUN | Neuen Chat starten, zusammenfassen — **und**, als Zusatz, der Befehl dafür | (wäre hier ohnehin richtig) |

**Ehrlichkeit bleibt Pflicht, auch beim Zusatz:** Funktioniert das
Werkzeug nicht zuverlässig, gehört das mit ins Video statt verschwiegen zu
werden — „es gibt dafür auch einen Befehl, der bei mir nicht immer
zuverlässig lief" ist ein ehrlicherer und interessanterer Satz als eine
stille Empfehlung.

**Prüffrage vor dem Schreiben:** Würde HAKEN und WAS auch funktionieren,
wenn im Video nie ein Befehl oder Menüpunkt genannt würde? Wenn nein, ist
der Kern noch zu sehr am Werkzeug hängen geblieben — einen allgemeineren
Kern suchen, siehe `thema.md`.

**Das reicht nicht aus — grammatisch allgemein ist nicht dasselbe wie
inhaltlich allgemein.** Rückmeldung zu `claude-cowork-browser` (derselbe
Ideen-Gedankengang, den der Kanalbetreiber schon am Nutzungslimit-Beispiel
oben festgemacht hat, hier nur nicht eingehalten): HAKEN/WAS/WARUM/WIE
nannten nie „Cowork" und bestanden die Prüffrage oben rein grammatisch
(„eine KI, die im Internet surft" statt „Cowork"). Trotzdem blieb das
Thema zu eng, weil das Phänomen selbst schon werkzeugnah war — ob ein
KI-Agent, der im Web klickt, dabei den eigenen Browser mitbenutzt, ist
für jemanden, der solche Agenten nicht kennt, keine eigenständig
interessante Frage. Ein Nutzungslimit dagegen betrifft jeden, der
überhaupt chattet, mit oder ohne das konkrete Werkzeug.

**Schärfere Prüffrage:** Würde HAKEN bis WIE als **eigenständiges
Grundlagen-Thema** funktionieren — mit echtem Aha-Wert für jemanden, der
von dem Werkzeug noch nie gehört hat und es auch nie anfassen wird? Bei
`claude-cowork-browser` wäre das allgemeine Phänomen dahinter eher gewesen:
„KI kann inzwischen nicht nur antworten, sondern für dich Dinge im Web
erledigen — klicken, tippen, ausfüllen" (das eigentliche neue Konzept,
oft „Agentisches Verhalten"/„Computer Use" genannt), **davor** die
Sicherheitsfrage, die daraus folgt, erst danach TUN mit dem konkreten
Werkzeug. Nicht jede Suche nach einem allgemeineren Rahmen landet beim
selben Vorwissen — bei einem Thema, das *Ergebnisse aus dem Web holt*
(Suche, Recherche-Agenten), ist der passende Unterbau oft RAG
(Retrieval-Augmented Generation); bei einem Thema, das *im Web handelt*
(klickt, tippt, bucht), ist es eher Agenten/Computer-Use. Beides
zusammenzuwerfen erklärt am Ende gar nichts richtig — erst prüfen, welcher
Unterbau zum konkreten Thema passt, dann den dazu recherchieren.

---

## Wortbudget

Rund **180 Wörter** bei etwa 60 Sekunden — die Zielrate liegt fest bei 2,9
Wörtern je Sekunde (siehe `sprache.md`, dort auch, warum dieser Wert nicht
mehr bei jeder einzelnen „zu schnell"-Rückmeldung weiterwandert). Drei
Beats haben feste Längen, weil sie feste Funktionen haben:

| Beat | Wörter |
|---|---|
| HAKEN | 22–28 + die feste 3-Wort-Einleitungszeile |
| TUN | 42–50 |
| MERKEN | 14–20 + der feste 9-Wort-Aufrufsatz |

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

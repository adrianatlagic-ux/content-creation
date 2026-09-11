# Themen-Agent

**Aufgabe:** genau ein Thema für diesen Lauf festlegen.

## Zwei Spuren

Jedes Thema in `content/themen.json` trägt `"spur": "werkzeuge"` oder
`"spur": "grundlagen"`.

| Spur | Frage | Haltbarkeit |
|---|---|---|
| **werkzeuge** (Vorrang) | Wie nutze ich ein Feature von Claude, Claude Code oder Codex, das es gerade gibt? | Wochen bis Monate — das ist der Preis für Relevanz |
| grundlagen | Wie funktioniert ein KI-Konzept? | Jahre |

Die Werkzeug-Spur ist bewusst kurzlebig — genau deshalb ist sie das Thema:
"Diese Woche kommt wieder ein Feature raus, wie nutze ich das" ist der
Kern dessen, was der Kanal jetzt sein soll. Ein Video darüber ist in vier
Monaten überholt, und das ist in Ordnung — bis dahin hat es Reichweite
gebracht, und es kommt ohnehin ein neues Feature nach.

**„Claude" heißt hier ausdrücklich drei verschiedene Oberflächen, nicht nur
Claude Code:**

| Oberfläche | Was das ist |
|---|---|
| **Claude Code** | die Kommandozeile/IDE-Erweiterung — bisher fast jedes Werkzeug-Video |
| **Claude Chat** (claude.ai, App) | der normale Chat: Projekte, Artefakte, Effort-Regler, Erinnerung/Memory, Excel-/PowerPoint-Add-ins |
| **Cowork** | der dritte Tab in der Claude-Desktop-App mit Dateizugriff, geplanten Aufgaben, Plugin-Marktplatz, eigenem Browser |

Bisher kam praktisch jedes Werkzeug-Thema aus Claude Code — nicht, weil die
Regel das verlangt (die drei standen von Anfang an gleichberechtigt hier),
sondern weil dort recherchiert wurde. **Ausdrücklich auch bei Claude Chat
und Cowork suchen**, nicht nur bei Claude Code — die Quellen daneben unten.

## Gemessen: allgemein schlägt spezifisch

Die ersten Werkzeug-Videos (reiner Befehl, reines Feature) blieben unter
100 Aufrufen. Die Grundlagen-Videos (allgemeines KI-Konzept) lagen darüber.
**Das ist kein Grund, zur `grundlagen`-Spur zurückzuwechseln** — die
Werkzeug-Spur bleibt Vorrang, siehe oben —, sondern ein Befund darüber,
*womit* ein Werkzeug-Thema anfangen muss.

**Jedes Werkzeug-Thema braucht einen allgemeinen Kern, den auch jemand
kennt, der das Werkzeug nicht benutzt** — bevor der spezifische Befehl
überhaupt fällt. Konkret am Beispiel Nutzungslimit:

- **Nicht so anfangen:** „Der Befehl Schrägstrich Limit-Reset macht dein
  Sitzungslimit frei." — Das ist Werkzeug-Trivia, interessiert nur, wer
  das Tool schon kennt.
- **So stattdessen:** „Warum füllt sich dein Nutzungslimit eigentlich so
  schnell?" → allgemein erklären (ein großes Kontextfenster verbraucht das
  Limit schneller, deshalb lieber einen neuen Chat anfangen und
  zusammenfassen) → **erst danach**, als Zusatz: „Es gibt außerdem einen
  Befehl dafür, Schrägstrich Limit-Reset — bei mir hat er nicht
  zuverlässig funktioniert, aber probier ihn."

Der allgemeine Kern trägt HAKEN, WAS, WARUM und WIE — der spezifische
Befehl gehört als Zusatz ins TUN, nicht als Aufhänger ins HAKEN. Genaue
Regel für die Beats: siehe `struktur.md`, Abschnitt „Werkzeug-Themen:
allgemein zuerst".

**Praktisch beim Eintragen eines neuen Werkzeug-Themas:** neben `quelle`
kurz notieren, welches allgemeine Phänomen dahintersteht und wem es auch
ohne das Werkzeug etwas angeht — wenn dazu nichts einfällt, ist entweder
das Thema zu klein, oder es lohnt sich, danach zu suchen, bevor geschrieben
wird.

## Vorgehen

1. `content/themen.json` lesen. Zuerst das **oberste offene Thema der
   Spur `werkzeuge`**. Ist die Werkzeug-Warteschlange leer, siehe unten
   „Wenn die Werkzeug-Spur leer ist" — nicht einfach auf `grundlagen`
   ausweichen, ohne recherchiert zu haben.
2. Kurz prüfen, ob es noch stimmt: Gibt es das Feature noch, hat sich die
   Bedienung seit der Recherche geändert?
3. Status auf `inarbeit` setzen. Nach erfolgreichem Lauf auf `fertig`.

## Wenn die Werkzeug-Spur leer ist: recherchieren

**Nicht auf `grundlagen` ausweichen, ohne das hier getan zu haben.** Das
Ziel ist, jeden Lauf mit frischen Kandidaten zu starten können.

### Quellen, in dieser Reihenfolge

Nicht nur die ersten beiden lesen — Claude Chat und Cowork haben eigene
Changelogs und wurden bisher kaum als Quelle genutzt, siehe oben.

1. `https://code.claude.com/docs/en/changelog` — der offizielle Claude-Code-
   Changelog. Steht meist am Feinsten aufgelöst (Datum, ein Satz).
2. `https://support.claude.com/en/articles/12138966-release-notes` — Claude
   Chat (claude.ai/App): Projekte, Artefakte, Effort-Regler, Memory und
   Ähnliches. Bisher praktisch ungenutzt als Quelle.
3. `https://claude.com/docs/cowork/changelog` — Cowork, der dritte Tab in
   der Desktop-App. Ebenfalls bisher kaum angesehen.
4. `https://www.anthropic.com/news` — Produktankündigungen, die größer sind
   als ein Changelog-Eintrag (neue Modelle, neue Programme). In dieser
   Umgebung netzseitig blockiert (EGRESS_BLOCKED) — falls das noch gilt,
   überspringen und direkt zu WebSearch.
5. `https://developers.openai.com/codex/changelog` — für alles, was Codex
   betrifft oder den Vergleich beider Werkzeuge.
6. WebSearch als Fallback, wenn die Seiten oben nichts Neues zeigen seit dem
   letzten Lauf: `"Claude Code changelog" <aktueller Monat/Jahr>`,
   `"Claude.ai changelog" <Monat/Jahr>`, `"Claude Cowork changelog" <Monat/
   Jahr>`, `"Codex changelog" <aktueller Monat/Jahr>`. **Immer das aktuelle
   Jahr in die Suche schreiben** — sonst kommen veraltete Treffer aus dem
   eigenen Trainingsstand zurück, der Monate hinter dem echten Datum liegt.

**Nie aus dem eigenen Trainingsstand behaupten, was gerade neu ist.** Das
ist genau die Information, bei der der Trainingsstand veraltet ist — das
ist ja der Grund, weshalb es hier eine Recherche gibt und keine Liste aus
dem Gedächtnis.

### Filter — ein Fund wird nur dann ein Thema

1. **Sichtbar in der Oberfläche.** Ein Bugfix, ein Env-Var, eine interne
   Umstellung — kein Thema. Es muss etwas sein, das man in `fenster` zeigen
   kann: ein Befehl, ein Menüpunkt, ein sichtbarer Unterschied im Verhalten.
2. **In unter einer Minute vorführbar.** Wenn die Einrichtung allein drei
   Schritte mit Konfigurationsdatei braucht, ist es zu viel für TUN.
3. **Löst eine echte Verwirrung oder einen echten Zeitverlust.** „Das gibt
   es jetzt" ist kein Thema, „das machst du wahrscheinlich noch von Hand,
   dabei geht es jetzt so" ist eins — der HAKEN-Beat funktioniert für
   Werkzeuge genauso wie für Konzepte, nur ist die Fehlannahme jetzt „das
   kann das Tool (noch) nicht" statt eine Sachaussage über KI.
4. **Nicht nur für Enterprise/Unternehmenskunden.** Wenn eine normale
   Person das Feature nicht selbst anfassen kann, ist es kein Thema hier.
5. **Nicht an eine taufrische Version gekettet.** Rückmeldung dazu: mehrere
   Werkzeug-Videen hintereinander verlangten eine Version, die erst Tage
   vor der Recherche erschien (`/skill-doctor` ab v2.1.261, der
   Auto-Mode-Tab ab v2.1.246) — ein Teil der Zuschauer hat die noch gar
   nicht per Auto-Update bekommen. Steht im Changelog ein Versionssprung
   von unter etwa zwei Wochen zum Recherchedatum, das Thema zurückstellen
   oder ein älteres, längst verbreitetes Feature vorziehen. Passt trotzdem
   nichts Älteres, ist die Versionsgrenze als ehrlicher TUN-Zusatz Pflicht
   (siehe `struktur.md`), das ersetzt aber nicht die Vorauswahl hier.

### Eintragen

Neuer Eintrag in `content/themen.json`, Feld `quelle` mit der genauen URL
**und dem Datum aus der Quelle** (Changelogs zeigen selten ein Abrufdatum,
das Funddatum steht sonst nirgends). `status: "offen"`, `spur: "werkzeuge"`.

## Wann von der Reihenfolge abweichen

Nur bei einem **zwingenden** Anlass — ein Feature wird plötzlich überall
diskutiert, ein Anbieter ändert etwas Grundlegendes. Dann das betroffene
Thema vorziehen und den Grund in `content/themen.json` notieren.

Nicht abweichen, weil ein anderes Thema interessanter wirkt.

## Wenn beide Spuren leer sind

**Abbrechen und melden.** Keine Themen erfinden, ohne recherchiert zu haben.

## Was du nicht tust

- **Keine Kauf- oder Preisempfehlung zwischen Anbietern als Selbstzweck.**
  „Claude oder Codex" darf vorkommen, wenn es um *wofür sich welches eignet*
  geht — nicht als Werbevergleich.
- **Auf der `grundlagen`-Spur keine Tagesaktualität.** Dort gilt weiter: ein
  Begriff muss Jahre halten. Die Werkzeug-Spur ist die einzige bewusste
  Ausnahme von dieser Regel.

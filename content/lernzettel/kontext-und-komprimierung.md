# Warum beachtet ein langer KI-Chat frühe Vorgaben nicht mehr?

Skript-Paket. Stand: 25.09.2026, Quellen am selben Tag gelesen.

**Kern:** Ein Sprachmodell beachtet bei einer Antwort nur, was in seinem
Kontextfenster steht. Das Fenster ist begrenzt. Wird ein Chat zu lang, greift
die Anwendung ein, und dabei kann eine frühe Vorgabe verloren gehen. Die
Lösung: eine kurze, selbst geprüfte Zusammenfassung in einen neuen Chat
mitnehmen. [1][2][3]

## Ein Fall von Anfang bis Ende

Der folgende Fall ist erfunden und keine getestete Produkt-Demo.

1. Erste Nachricht: „Plane drei Tage Wien. Budget 600 €, nur mit dem Zug.“
2. Danach viele Fragen: Hotels, Museen, Restaurants, dazu ein hochgeladener
   Zugplan als PDF.
3. Bei **jeder** Antwort bekommt das Modell den bisherigen Verlauf erneut als
   Eingabe: deine Vorgaben, seine Antworten, die Datei. Das ist das
   Kontextfenster, eine Art Arbeitsspeicher. Es ist etwas anderes als das
   Wissen aus dem Training. [1]
4. Der Verlauf wächst. Nähert er sich der Grenze, muss die Anwendung etwas
   tun. Belegt sind drei Möglichkeiten:
   - **Stopp:** Die Claude-API lehnt eine zu lange Eingabe mit einem Fehler
     ab. [1]
   - **Weglassen:** Chat-Oberflächen wie claude.ai *können* das Fenster nach
     „first in, first out“ verwalten; die ältesten Nachrichten fallen dann
     heraus. [1]
   - **Zusammenfassen:** Ältere Nachrichten werden durch eine Zusammenfassung
     ersetzt („Compaction“). In claude.ai passiert das bei aktivierter
     Codeausführung automatisch. [2][3][5]
5. Angenommen, die Zusammenfassung lautet nur „Wienreise, drei Tage“. Budget
   und Zug fehlen. Das Modell sieht die Vorgabe nicht mehr und kann sie nicht
   beachten. Ein Vorschlag „Flug für 180 €“ wird möglich.

Anthropic schreibt selbst, dass die Standardzusammenfassung etwas weglassen
kann, das ein späterer Schritt braucht. Für diesen Fall soll man festlegen,
was sie behalten muss. [2][3] Anweisungen im zusammengefassten Teil gelten
danach nicht mehr und sollen erneut genannt werden. Bilder und Dokumente sind
danach weg und müssen neu gegeben werden. [3]

## Auch ohne volle Grenze

Mehr Kontext ist nicht automatisch besser. Laut Anthropic sinken Genauigkeit
und Abruf, je mehr Tokens im Kontext stehen; das nennt Anthropic
„context rot“. [1][4] Ein kürzerer, aufgeräumter Kontext ist deshalb auch dann
sinnvoll, wenn noch Platz wäre.

## Was daraus folgt

Wenn eine frühe Vorgabe plötzlich fehlt:

1. Lass dir Vorgaben, Entscheidungen und offene Punkte in wenigen Zeilen
   zusammenfassen.
2. Prüfe selbst, ob jede harte Vorgabe drinsteht (hier: 600 €, nur Zug), und
   ergänze Fehlendes.
3. Starte damit einen neuen Chat. Lade benötigte Dateien erneut hoch.

Punkt 2 ist der wichtigste: Auch deine Zusammenfassung kann Details verlieren,
genau wie die automatische.

## Grenzen dieser Erklärung

- Belegt ist das Verhalten für die Claude-API und claude.ai. Wie ChatGPT,
  Gemini oder andere Apps intern vorgehen, wurde nicht geprüft. Deren
  Dokumentation war in dieser Recherche nicht erreichbar.
- claude.ai bewahrt laut Help Center den vollständigen Verlauf und kann nach
  der Zusammenfassung weiter darauf zurückgreifen. Ein Verlust ist also
  möglich, nicht zwingend. [5]
- Nicht jede übersehene Vorgabe liegt am Kontext. Auch kurze Chats scheitern
  an unklaren oder widersprüchlichen Vorgaben oder an Modellfehlern.
- Die Aussage zum schlechteren Abruf stammt von Anthropic, ohne Zahlen. Eine
  bekannte unabhängige Studie dazu („Lost in the Middle“, Liu et al.) war
  nicht abrufbar und wird deshalb hier nicht als Beleg verwendet.
- Die Übertragung der API-Empfehlung auf einen Neustart per Hand ist eine
  redaktionelle Ableitung, keine getestete Garantie.
- Frühere Kanal-Fassung (context-window-einfach) stellte Überlauf pauschal als
  „Älteste fällt raus“ dar; das ist nur eine von drei Möglichkeiten.

## Selbsttest — zuerst ohne nachzulesen

1. Du startest neu mit der Zusammenfassung „Wienreise, drei Tage“. Warum ist
   das nicht genug?
2. Ein Chat mit zehn kurzen Nachrichten ignoriert deine Vorgabe. Ist das
   Kontextfenster schuld?
3. Am Anfang hast du einen Zugplan als PDF hochgeladen. Nach einer
   Zusammenfassung antwortet die KI vage zu den Abfahrtszeiten. Was tust du?

## Auflösung

1. Budget und „nur Zug“ fehlen. Der neue Chat enthält nur, was du mitbringst;
   harte Vorgaben müssen ausdrücklich darin stehen.
2. Eher nicht. Ein kurzer Verlauf ohne große Dateien liegt weit unter der
   Grenze. Prüfe, ob die Vorgabe klar und widerspruchsfrei war, und nenne sie
   erneut.
3. Den Zugplan erneut hochladen oder die nötigen Zeiten in die
   Zusammenfassung schreiben. Eine Zusammenfassung ist Text; Dokumente aus
   zusammengefassten Nachrichten sind danach laut Anthropic nicht mehr im
   Kontext. [3]

## Quellen

[1] Anthropic, Context windows: https://platform.claude.com/docs/en/build-with-claude/context-windows
[2] Anthropic, Compaction overview: https://platform.claude.com/docs/en/build-with-claude/compaction
[3] Anthropic, Compaction on demand: https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand
[4] Anthropic Engineering, Effective context engineering for AI agents (29.09.2025): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[5] Claude Help Center, How do usage and length limits work?: https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work

## Offene Fragen

Keine tragenden für diese enge Erklärung. Zur Vertiefung offen: wie andere
Chat-Apps überlange Verläufe behandeln; unabhängige Messungen zum Abruf in
langem Kontext.

Dein persönlicher Lernstand ist unbekannt. Der Selbsttest ist ein Angebot,
keine bestandene Prüfung.

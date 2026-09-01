# Caption — Tokens

Video: `videos/tokens.json` (32,0 s) · Hook-Muster 1, Einladung + Widerspruch
Suchbegriffe im Fließtext: Tokens, Prompt, ChatGPT Kosten, Kontext

Aufbau und Regeln: `captions/VORLAGE.md`

---

## Caption

Ein deutscher Prompt kostet fast doppelt so viele Tokens wie derselbe Satz auf Englisch. Bei jeder Anfrage.

Die KI liest keine Wörter, sondern Stücke. „Quartalsbericht" ist nicht ein Wort, sondern vier Tokens — und deutsche Wörter zerfallen in mehr Stücke als englische. Abgerechnet wird pro Stück, nicht pro Wort.

Drei Dinge, die du ab heute anders machst:

1️⃣ Prompt einmal durch den Tokenizer deines Anbieters jagen
2️⃣ Anweisung auf Englisch schreiben — die Antwort kommt trotzdem deutsch
3️⃣ Alte Anhänge aus langen Chats rauswerfen

Punkt 3 ist der teure: Ein PDF, das du vor zwanzig Nachrichten hochgeladen hast, wird bei jeder neuen Frage komplett mitgerechnet.

Wo du deine Tokens nachzählst, steht im ersten Kommentar 👇

Was war dein längster Chat?

#Tokens #ChatGPT #KIKosten #PromptEngineering

---

## Erster Kommentar

TOKENS NACHZÄHLEN

• OpenAI → platform.openai.com/tokenizer
• Anthropic → Token-Counting-Endpunkt der API
• Offline → die Bibliothek tiktoken (Python)

Faustregel Deutsch: grob 3–4 Zeichen pro Token. Englisch liegt näher an 4–5,
deshalb der Unterschied.

ENGLISCH ANWEISEN, DEUTSCH ANTWORTEN

„Answer in German." am Ende reicht. Die Anweisung kostet dich englische
Tokens, die Antwort kommt auf Deutsch.

ANHÄNGE RAUSWERFEN

Im Chat nach oben scrollen und alte Dateien entfernen — oder einfach einen
neuen Chat aufmachen und nur das Ergebnis mitnehmen. Was im Verlauf liegt,
zahlst du bei jeder einzelnen Nachricht mit.

---

## Vor dem Posten prüfen

Die drei Werkzeug-Adressen einmal selbst öffnen. Anbieter verschieben solche
Seiten, und ein toter Link im meistgelesenen Kommentar kostet mehr Vertrauen,
als der Tipp einbringt.

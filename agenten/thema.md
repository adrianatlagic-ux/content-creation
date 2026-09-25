# Themenwahl

content/redaktion.md zuerst. Eine lernenswerte Frage, keine feste Kadenz
und kein Zwang zum obersten offenen Eintrag.

1. Explizite Frage oder Themen-ID hat Vorrang.
2. Sonst offene Kandidaten vergleichen: ein überraschendes KI-Prinzip,
   konkrete Alltagssituation, erklärbarer Mechanismus, daraus ableitbare
   Tipps, verständliche Darstellung, Primärquellen und Vorwissen. Ein Fachbegriff allein ist
   kein Thema; ein einzelner Produktbefehl ebenfalls nicht.
3. Auswahl und zwei zurückgestellte Alternativen im Dossier begründen.
   user_interesse bleibt unbekannt, solange Adrian nichts geäußert hat.
4. Bei gleicher Eignung Voraussetzungen beachten. Große Themen aufteilen.
5. Ohne geeigneten Kandidaten von einer konkreten KI-Alltagsfrage aus
   recherchieren. Lieber ein begründeter Zwischenstand als Füllcontent.

## Themenbrief

redaktion/<id>.json unter brief: frage, lernziel, vorwissen, relevanz,
auswahlgrund, alternativen, mechanismus (Schrittfolge), beispiel,
grenzen (mindestens eine), selbsttest (Frage, Antwort, Begründung).
Zusätzlich Pflichtfelder: `ki_thema` (das Prinzip), `alltagsmoment` (wann es
spürbar wird), `tipps_aus_prinzip` (welche Nutzung daraus folgt) und
`praktischer_nutzen`. Lernziel beobachtbar: „Du kannst erklären, warum … und
erkennen, wann …“. Tipps dürfen nicht nur Produktbefehle wiederholen.

## Produkte

Werkzeuge nur, wenn sie die Lernfrage konkret beantworten. Primärdokumentation
lesen: Produkt, Oberfläche, Version/Plan, Verfügbarkeit, Datum. Blockierte
Seiten/Suchschnipsel nicht als getestet ausgeben. Changelogs prüfen eine
gewählte Produktfrage, sie erzeugen keinen täglichen Produktionszwang.
Keine Befehle aus Gedächtnis, Blogs oder Versionsnotizen als Tipp ausgeben.
Wenn ein aktueller Zugriff fehlt, den Produktteil weglassen oder als
ungetestet markieren; der übertragbare Kern darf trotzdem bleiben.

## Status

offen → inarbeit → fertig ist Produktionsfortschritt.
redaktionsstatus separat: vorgeschlagen, recherchiert, skript-geprueft,
nachpruefen. fertig heißt weder verstanden noch veröffentlicht.
Alte Dateien erhalten; content/bestandsaudit.md beachten.

## Darstellungsentscheidung

Im bestehenden Feld `brief.beispiel` entweder den hilfreichen Fall beschreiben
oder „Direkte Erklärung: …“ mit dem sichtbaren KI-Vorgang eintragen. Dieses
historisch benannte Pflichtfeld verlangt keine erfundene Geschichte.
Thema und Lernziel bleiben auch ohne Beispiel konkret.
Vor neuen Vorschlägen content/themen.json und vorhandene Skripte auf gleiche
Lernziele prüfen. Wiederholungen nur mit erkennbar neuer Frage oder explizitem
Überarbeitungsauftrag; ein neuer Titel allein ist kein neues Thema.

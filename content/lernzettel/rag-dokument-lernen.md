# Kannst du einer KI-Antwort aus deinem Dokument vertrauen?

Skript-Paket, noch kein vertontes oder gerendertes Video. Stand: 16.09.2026.

**Kern:** Eine angezeigte Fundstelle ist ein Anfang, kein Beweis. Prüfe, ob
sie genau das Thema, die Zahl oder das Datum und die Bedingung deiner Antwort
trägt. RAG erklärt, warum diese Lücke entstehen kann: Suche und Formulieren
sind getrennte Schritte. [1][2][3]

## Ein Fall von Anfang bis Ende

Das folgende Handbuch ist erfunden, keine getestete Produkt-Demo:

> Wartung: Filter alle sechs Monate wechseln. Gehäuse wöchentlich reinigen.

Frage: „Wann muss ich den Filter wechseln?“
Die Anwendung kann passende Stellen suchen und den gefundenen Wartungsabsatz
mit der Frage an ein Modell geben. Dieses kann daraus „alle sechs Monate"
formulieren. Suche und Formulieren sind zwei verschiedene Aufgaben. [2]

## Was du daran lernen kannst

Eine Antwort über neue Dokumente braucht nicht zwingend neu trainierte
Modellgewichte. RAG kann externes Material beim Antworten nutzen. Ein
RAG-System kann zugleich trainierte Komponenten enthalten; „RAG wird nie
trainiert“ wäre falsch. Die ursprüngliche Forschungsarbeit trainiert ihre
Komponenten ausdrücklich. [1][4]

Der Mechanismus ist keine Wahrheitsgarantie. Unpassende Fundstellen oder eine
Antwort, die den Kontext falsch nutzt, können zu schlechten Antworten führen.
[3] Im Beispiel wäre der Absatz über das Gehäuse kein Beleg für das
Wechselintervall des Filters.

Diese Erklärung beschreibt RAG, nicht jede PDF-Funktion einer bestimmten
Chat-App. Sie beantwortet auch nicht, ob ein Anbieter Uploads später zum
Training nutzt; dafür wären dessen konkrete Bedingungen nötig.

## Selbsttest — zuerst ohne nachzulesen

1. Die Antwort sagt „wöchentlich“, nennt aber einen Absatz über das Gehäuse.
   Kannst du die Filter-Antwort übernehmen?
2. Du findest „Filter alle sechs Monate“. Was fehlt noch, bevor du die Antwort
   für deinen Fall übernimmst?
3. Ist eine hochgeladene PDF der Beweis, dass eine App RAG verwendet?

## Auflösung

1. Nein. Der Beleg betrifft eine andere Wartungsaufgabe. Eine echte Quelle ist
   noch kein passender Beleg für die konkrete Aussage.
2. Prüfe, ob der Satz wirklich über den richtigen Filter spricht und ob eine
   Bedingung, Ausnahme oder ein Gültigkeitsdatum deine Situation verändert.
3. Nein. Die Implementierung der Anwendung muss gesondert geprüft werden.

## Quellen

[1] Lewis et al., RAG, Abstract: https://arxiv.org/abs/2005.11401
[2] Hugging Face, RagRetriever/RagModel: https://huggingface.co/docs/transformers/model_doc/rag
[3] AWS, Reliability of RAG: https://aws.amazon.com/blogs/machine-learning/evaluate-the-reliability-of-retrieval-augmented-generation-applications-using-amazon-bedrock/
[4] AWS, RAG vs. Fine-tuning: https://docs.aws.amazon.com/prescriptive-guidance/latest/retrieval-augmented-generation-options/rag-vs-fine-tuning.html

Quellen gelesen am 16.09.2026. Keine offenen tragenden Fragen für diese enge
Erklärung. Dein persönlicher Lernstand ist noch unbekannt; der Selbsttest
ist ein Angebot, keine behauptete bestandene Prüfung.

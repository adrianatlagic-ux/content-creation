# Themen-Agent

**Aufgabe:** genau ein Thema für diesen Lauf festlegen.

## Vorgehen

1. `content/themen.json` lesen. Das **oberste offene** Thema ist gesetzt.
2. Kurz prüfen, ob es noch stimmt: Hat sich der Begriff geändert? Gibt es
   einen aktuellen Anlass, der ein späteres Thema nach vorne zieht?
3. Status auf `inarbeit` setzen. Nach erfolgreichem Lauf auf `fertig`.

## Wann von der Reihenfolge abweichen

Nur bei einem **zwingenden** Anlass — ein Begriff taucht plötzlich überall
auf, ein Anbieter ändert etwas Grundlegendes. Dann das betroffene Thema
vorziehen und den Grund in `content/themen.json` notieren.

Nicht abweichen, weil ein anderes Thema interessanter wirkt. Die Reihenfolge
ist nach Stärke der Verwechslung sortiert, nicht nach Laune.

## Wenn die Warteschlange leer ist

**Abbrechen und melden.** Keine Themen erfinden. Neue Themen kommen über
`content/plan.md` dazu, und das ist eine Entscheidung, keine Fleißarbeit.

Ein Thema gehört nur in die Liste, wenn es alle vier Punkte trifft:

1. Eine Verwechslung, die viele mit sich herumtragen
2. bei der man sich leicht schämt, sie nicht zu kennen
3. die man aber täglich braucht
4. und die in unter einer Minute vollständig aufzulösen ist

Fehlt einer, ist es kein Thema für dieses Format.

## Was du nicht tust

- **Keine Tagesaktualität.** Ein Video über ein neues Modell ist in vier
  Monaten Müll. Die Themenliste besteht aus Begriffen, die 2028 noch gelten.
- **Keine Tool-Empfehlungen.** Das ist eine andere Nische mit anderer
  Halbwertszeit.

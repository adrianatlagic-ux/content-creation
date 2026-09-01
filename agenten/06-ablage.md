# Ablage-Agent

**Aufgabe:** das Ergebnis dorthin legen, wo es zum Posten gebraucht wird.

## Ziel

Google Drive, ein Ordner je Video:

```
KI-Reels/JJJJ-MM-TT-<id>/
  <id>.mp4          das fertige Video, ohne eingebrannte Untertitel
  caption.txt       zum Kopieren, ohne Markdown-Beiwerk
  kommentar.txt     der erste Kommentar, direkt nach dem Posten zu setzen
  hinweise.txt      was vor dem Posten zu prüfen ist
```

Caption und Kommentar als **reiner Text**, nicht als Markdown. Sie werden
kopiert, nicht gelesen — Sternchen und Rauten im Instagram-Feld sind Müll.

## hinweise.txt

Immer dabei, immer kurz:

```
Länge: <n> s   (40-%-Schwelle: <n*0.4> s müssen im Schnitt geschaut werden)
Hook-Muster: <welches aus content/hooks.md>

Vor dem Posten:
- Als Reel hochladen, nicht als Video-Beitrag
- Konto auf Öffentlich
- Untertitel in Instagram aus der Tonspur erzeugen lassen
- Die Klickpfade im Kommentar einmal selbst öffnen
- Ersten Kommentar direkt nach dem Posten setzen

Zahlen frühestens nach 3 Stunden ansehen (content/metriken.md).
```

## Danach

- Thema in `content/themen.json` auf `fertig`
- Alles committen und pushen — der Container wird recycelt, was nicht im Git
  liegt, ist weg
- Eine Zeile in die Tabelle in `content/hooks.md`: welches Hook-Muster dieses
  Video benutzt hat

## Was nicht passiert

**Es wird nichts gepostet.** Am Ende liegt ein Video bereit. Die Freigabe
bleibt beim Menschen — das ist keine technische Grenze, sondern Absicht: ein
unbeaufsichtigt postender Kanal ist ein Reputationsrisiko und lernt nichts
aus dem, was er veröffentlicht.

# Produktionshinweise: kontext-und-komprimierung

Stand 25.09.2026. Nicht gepostet; Posten bleibt ein eigener menschlicher Schritt.

**Thema:** Warum beachtet ein langer KI-Chat eine frühe Vorgabe plötzlich
nicht mehr, und was tue ich dann? Quellen gelesen am 25.09.2026 (siehe
`redaktion/kontext-und-komprimierung.json`).

## Vorhanden

| Schritt | Ergebnis |
|---|---|
| Themenbrief, Recherche, Dossier | `redaktion/kontext-und-komprimierung.json`, 5 gelesene Primärquellen, 5 Claims mit Szenenzuordnung |
| Lernblatt | `content/lernzettel/kontext-und-komprimierung.md` |
| Caption | `captions/kontext-und-komprimierung.md` |
| Inhaltliches Review | bestanden, redaktioneller Selbstcheck (keine unabhängige Prüfung), Fingerprint gebunden |
| Vertonung | ElevenLabs, Stimme ypAmPUMkO5wFnEuldApx, eleven_v3, 1 Take, 27 US-Cent; roh 89,3 s |
| Tempo/Timing | Faktor 1,288 auf 2,9 W/s; **gemessen 69,4 s**; `pruefe-video` bestanden |
| Render | `out/kontext-und-komprimierung.mp4` (1080×1920, 30 fps, AAC, 12,6 MB; `out/` ist nicht versioniert) |
| Cover | Frame 0 mit Titelzeile „Warum vergisst ein langer KI-Chat Vorgaben?“ |
| Sichtprüfung | Cover, alle 7 Szenen als Standbild angesehen; Safe Zone eingehalten, Text lesbar |
| Tonprüfung (maschinell) | Tonspur vorhanden, Mittel −17,6 dB / Spitze −2,6 dB; Transkript (Scribe, 7,6 US-Cent) stimmt wortgleich mit dem Sprechertext überein |

## Fehlt / offen

- **Menschliche Hörprobe** (Betonung, Klang, Tempo-Eindruck): nicht möglich
  in dieser Umgebung. Status bleibt deshalb `inarbeit`, bis Adrian das Video
  mit Ton angesehen hat.
- Behälter-Szene steht nach der letzten Nachricht rund 4 s ohne neue
  Bewegung (Prüfer-Hinweis); im Standbild liest sich die Notizkarte in
  dieser Zeit. Bei Feedback „zu statisch“ die `at`-Werte strecken
  (erfordert erneuten Fingerprint).
- Keine Drive-Ablage: Datei direkt geliefert.

## Nebenbei geändert (Renderer)

Frame 0 von Videos mit Nicht-`irrtum`-Hook war ohne Titelzeile; betrifft
auch das noch nicht gerenderte `rag-dokument-lernen`. `src/format/scenes.tsx`
und `Video.tsx` zeichnen sie jetzt für die erste Szene immer. Das
Chat-Eingabefeld nennt ohne `produkt` kein Produkt mehr („Nachricht
schreiben…“ statt „Nachricht an Claude…“). Bestehende MP4s bleiben
unverändert; bei einem Neu-Render alter Videos mit Chat-Fenster ohne
`produkt` ändert sich nur dieser Platzhalter.

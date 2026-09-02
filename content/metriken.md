# Zahlen lesen, ohne sich verrückt zu machen

Angelegt, nachdem das erste Video nach 20 Minuten bei null Aufrufen stand. Das
ist erwartbar — nur weiß man das nicht, wenn man das erste Mal postet.

---

## Warum 20 Minuten nichts bedeuten

| Was | Wie schnell es sich bewegt |
|---|---|
| Videoverarbeitung nach dem Hochladen | 15–45 Min bei hoher Auflösung |
| Öffentlicher Aufrufzähler | aktualisiert alle **10–60 Min** |
| Insights-Dashboard (< 10K Follower) | hängt **24–48 h** hinterher |
| Sinnvoll ablesbar | **frühestens nach 2–3 Stunden** |

Der Zähler ist keine Live-Anzeige. Bei einem neuen Konto werden Daten in
längeren Zyklen gebündelt — du siehst nicht „null Aufrufe", sondern „noch
keinen synchronisierten Zähler".

**Regel: vor Ablauf von drei Stunden gar nicht erst nachschauen.**

---

## Was echte Null verursacht

Drei Dinge sind binär und sofort prüfbar. „Wenig" ist normal, „exakt null"
nach mehreren Stunden ist meistens eins davon:

1. **Konto ist auf Privat.** Dann erscheinen Reels nie im Explore-Bereich,
   nie im Reels-Feed, nie bei Nicht-Followern. Bei null Followern heißt das
   strukturell null Reichweite — dauerhaft, nicht vorübergehend.
   → Einstellungen → Kontodatenschutz → **Öffentlich**

2. **Als normaler Video-Post hochgeladen statt als Reel.** Dann läuft es nur
   im Feed deiner Follower und bekommt keine Reels-Verteilung.

3. **Verarbeitung hängt noch.** Im Profil sichtbar, aber ohne Zähler.

---

## Was normal ist

Für ein Konto ohne Publikum liegt die übliche Spanne bei den ersten Reels bei
**50 bis 500 Aufrufen**. Instagram testet jedes neue Reel zunächst an rund
100–500 Zuschauern und entscheidet daran, ob es weiter ausgespielt wird.

Landen wir in dieser Spanne, ist das kein Misserfolg. Das ist die Startlinie.
Der Algorithmus hat bei einem Konto ohne Historie schlicht keine Information
darüber, wem er das zeigen soll — die muss erst entstehen.

---

## Die Zahl, auf die es wirklich ankommt

Nicht Aufrufe. **Hook Rate**: Aufrufe über 3 Sekunden geteilt durch
Impressionen.

- **Richtwert: 50 % oder mehr**
- Darunter deckelt Instagram die Verteilung, egal wie gut der Rest ist

---

## Korrektur zur Videolänge

**Eine frühere Fassung dieser Datei stand hier falsch.** Sie rechnete vor, dass
ein 25-Sekunden-Video die 40-%-Wiedergabeschwelle nach 10 Sekunden nimmt und
ein 42-Sekunden-Video erst nach 17 — und schloss daraus, kürzer sei besser.

Die Rechnung stimmt. Der Schluss war trotzdem falsch, weil er die falsche
Größe optimiert.

**Completion Rate ist nicht unsere Zielgröße. Saves sind es.** Und dafür dreht
sich das Vorzeichen um:

- Erklärvideos unter 60 Sekunden werden **30–40 % häufiger gespeichert** als
  kürzere Clips
- Bildungsinhalte mit **60–90 Sekunden** schlagen kurze Reels bei Saves deutlich
- Der Spitzenwert für Aufrufe *und* Interaktion liegt bei **45–60 Sekunden**

Kurze Videos gewinnen bei Completion Rate und Likes. Längere gewinnen bei Saves
und Kommentaren. Wir bauen auf Saves — das war die Entscheidung ganz am Anfang,
begründet mit den 29 % Save-Quote des Referenzvideos.

**Es gibt eine Grenze.** Über 75 Sekunden fällt die Completion Rate um 20–50 %
— **außer** das Video ist klar gegliedert und segmentiert. Unseres ist es: feste
Szenentypen, Schrittleiste, ein Gedanke je Szene. Deshalb ist die Obergrenze
großzügig, aber nicht offen.

**Die Regel, die daraus folgt:**

| | |
|---|---|
| Ziel | **rund 60 Sekunden** |
| Erlaubt | 45 bis 75 Sekunden |
| Unter 45 s | zu dünn — das Thema passt nicht vollständig hinein |
| Über 75 s | Completion Rate bricht ein |

`scripts/pruefe-video.mjs` setzt das durch und lehnt beides ab.

**Und der praktische Punkt dahinter:** Ein Video, das nichts vollständig
erklärt, wird nicht gespeichert — egal wie gut die Wiedergabequote ist. Genau
das war der Fehler an der ersten Tokens-Fassung mit 27,7 Sekunden.

---

## Der Vergleich, der nicht aufgeht

Der naheliegende Gedanke nach dem ersten Post: „Bei anderen funktioniert dieses
Format doch immer." Der Gedanke ist falsch, und zwar aus einem mechanischen
Grund.

**Du siehst nur die Videos, die funktioniert haben.** Das Referenzvideo mit
17.700 Likes ist in deinem Feed gelandet, *weil* es funktioniert hat — genau
dafür ist der Algorithmus da. Videos desselben Formats, die nichts geworden
sind, bekommst du systematisch nie zu sehen. Nicht weil es sie nicht gibt,
sondern weil der Mechanismus, der dir Inhalte zuspielt, gegen ihre Sichtbarkeit
selektiert.

Du hast noch nie ein gescheitertes Video dieses Formats gesehen. Du wirst auch
nie eins sehen. Das ist kein Zufall, das ist die Funktionsweise.

**Der zweite Fehler steckt im Vergleich selbst.** Du vergleichst:

| Was du vergleichst | Was du vergleichen müsstest |
|---|---|
| Sein bestes Video | Sein **erstes** Video |
| Konto mit Historie und Publikum | Konto ohne beides |
| Nach Monaten Regelmäßigkeit | Nach einem Beitrag |

Sein erstes Video hat mit hoher Wahrscheinlichkeit nichts gemacht. Du wirst es
nie sehen — es ist nicht in deinem Feed gelandet, aus genau demselben Grund.

**Und der eigentliche Unterschied ist Menge.** Die Empfehlung für Konten unter
10.000 Followern liegt bei **5–7 Reels pro Woche**. Nicht als Wachstumstrick,
sondern weil der Algorithmus so überhaupt erst lernt, wem er das zeigen soll.
Ein stetiger Rhythmus über Monate schlägt jede virale Einzelwoche.

Das Format „funktioniert bei anderen" also nicht als Format. Es funktioniert
bei anderen **in Menge, über Monate**. Ein Video ist kein Test eines Formats.
Es ist die erste Stichprobe.

---

## Was jetzt zu tun ist

1. Die drei binären Punkte oben prüfen
2. Drei Stunden nichts tun
3. Dann Aufrufe **und** Hook Rate notieren — beide in die Tabelle in
   `content/hooks.md`
4. Nach zehn Videos auswerten. Vorher ist jede einzelne Zahl Rauschen

Ein einzelnes Video sagt über den Kanal nichts aus. Der Sinn der
Zehner-Rotation aus `hooks.md` ist genau, nicht auf einzelne Zahlen zu
reagieren.

---

## Quellen

- [Reels-Länge, Retention und Saves – OpusClip](https://www.opus.pro/blog/ideal-instagram-reels-length)
- [Reels-Länge 2026, datengestützt – Moonb](https://www.moonb.io/blog/instagram-reel-length)
- [Was tatsächlich zu Ende geschaut wird – Slidy](https://slidycreator.com/blog/instagram-reel-length-guide/)

- [Reels bei 0 Aufrufen – Ursachen und Fristen](https://theviralsauce.com/playbooks/instagram-reels-views-not-showing-fix)
- [Reels-Verarbeitung und Zählerverzögerung](https://slidycreator.com/blog/reels-stuck-processing-fixes/)
- [Reels auf neuen Konten – normale Spannen](https://360uniquizer.com/en/news/instagram-reels-no-views-new-account)
- [Reels-Algorithmus 2026, Hook Rate und Teststufen](https://miraflow.ai/blog/instagram-reels-algorithm-2026-how-to-get-more-views)

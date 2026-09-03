# Stimmen-Agent

**Aufgabe:** den Sprechertext vertonen und auf Tempo bringen.

## Die Stimme

**Adrians geklonte Stimme: `ifvYno2dLD5AxjPYOGa4`.** Keine andere. Die
Wiedererkennung hängt an ihr — eine neutrale Sprecherstimme wird weggescrollt.

Modell: `eleven_v3`.

## Erst schätzen, dann erzeugen

**Immer zuerst `estimate_only`** — das ist kostenlos. Erst wenn die Schätzung
plausibel ist, tatsächlich erzeugen, und dabei `generations_count: 1` statt
der voreingestellten 4. Vier Fassungen kosten das Vierfache und es wird
ohnehin die erste genommen.

Rund 17 Cent je Video. Bei täglich sind das gut 5 € im Monat — der Betrag
rechtfertigt die Sorgfalt.

## Tempo kommt hinterher, nicht aus dem Text

Regieanweisungen wie `[fast]` **wirken bei dieser geklonten Stimme nicht.**
Ausprobiert: die Rohaufnahme kam mit 50,1 s sogar langsamer heraus als eine
fremde Stimme ohne jede Anweisung.

Das Tempo macht die Nachbearbeitung:

```
node scripts/speed-up-voice.mjs public/<id>-raw.mp3 public/<id>.mp3 1.22
```

Faktor 1,22 ergibt rund 3,0 Wörter pro Sekunde. Zum Vergleich: das
Referenz-Reel liegt bei 3,5. Über 1,4 klingt es gehetzt, das Skript warnt.

**Die Rohaufnahme behalten.** Sie ist bezahlt; wird das Tempo nachjustiert,
wird sonst unnötig neu vertont.

## Wenn der Connector weg ist

Der ElevenLabs-Connector ist in dieser Umgebung schon mehrfach abgerissen
(`enabledInChat: false`). Das ist kein Grund, den Lauf wegzuwerfen:

1. `videos/<id>.json` und die Caption sind fertig und bleiben liegen
2. Thema auf `inarbeit` lassen, **nicht** auf `offen` zurück
3. In die Ablage eine Notiz legen, was fehlt
4. Der nächste Lauf beginnt bei Schritt 5, nicht bei Schritt 1

Nie zweimal für denselben Text bezahlen.

# Profilbild als echtes Porträt generieren

## Warum nicht beschneiden

Das aktuelle `public/profilbild.png` ist aus der Ganzkörper-Grafik geschnitten.
Der Kopf misst dort nur rund **265 × 265 Pixel** — jede Ausgabe darüber ist
Hochrechnung. Nachschärfen holt Kantendefinition zurück, aber keine Details,
die nie aufgenommen wurden.

Die Lösung ist, das Porträt **als Porträt zu generieren**: dann füllt der Kopf
die native Auflösung des Modells statt ein Sechstel davon.

## Der Aufruf

Vorlage ist die bestehende Figur, damit der Charakter erhalten bleibt — nicht
neu erfinden, sondern umrahmen.

- Flow: `A0nEtyCzwyycWidxn9D5`
- Vorlagen-Knoten (erste Maskottchen-Generierung): `qD2Hi1oWtpeV33yxBaXf`
- Werkzeug: `creative_edit_image`
- Modell: `gemini-2.5-flash-image` — rund **5 Cent**
  (`gemini-3-pro-image` kostet für dasselbe rund 37 Cent und lohnt hier nicht)

## Der Prompt

```
Keep the exact same character, face, hairstyle, eyebrows, skin tone, outfit,
art style, line weight and colour palette as the reference. Reframe as a
head-and-shoulders portrait: the head fills most of the frame, cropped just
below the shoulders, facing the viewer straight on with the same calm confident
half-smile. Square composition, head centred with generous even margin on all
sides so a circular crop never touches the hair or chin. Same charcoal zip
hoodie over a white tee, same small sage-green terminal mark visible on the
chest. Same flat vector illustration style, clean confident linework, minimal
flat cel shading. Plain flat cream background, no shadow, no vignette.
```

Der Hinweis auf den Rand ist nicht kosmetisch: Instagram beschneidet
Profilbilder kreisrund, und ein eng gerahmtes Porträt verliert dabei Haar und
Kinn.

## Danach

Das Ergebnis liegt als Querformat vor und muss noch freigestellt und quadriert
werden. Dafür gibt es bereits die beiden Werkzeuge:

```bash
python3 scripts/cutout.py <heruntergeladen.png> public/portrait-raw.png
python3 scripts/profilbild.py public/portrait-raw.png public/profilbild.png
```

`scripts/profilbild.py` erkennt die Gesichtsmitte über die Deckkraft und
skaliert auf 800 × 800. Bei einem echten Porträt liegt der Hochrechnungsfaktor
dann nahe 1 statt bei 3 — und die Nachschärfung wird überflüssig.

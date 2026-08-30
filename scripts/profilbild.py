"""Profilbild aus einer Maskottchen-Pose schneiden und nachschaerfen.

    python3 scripts/profilbild.py [pose] [ausgabe.png]

Voreinstellung: public/mascot-selbstsicher.png -> public/profilbild.png

Instagram beschneidet Profilbilder kreisrund, deshalb sitzt der Kopf mittig mit
Rand ringsum -- ein enger Ausschnitt verliert Haar und Kinn.

Ausgegeben wird 800x800, die groesste von einer Zielplattform verlangte Groesse
(YouTube; Instagram 320, TikTok 200). So rechnet keine Plattform mehr hoch, und
Herunterrechnen sieht immer besser aus.

Der Kopf misst in der Quellgrafik nur rund 265 Pixel, die Hochrechnung kostet
also Schaerfe. Die Unsharp-Maske holt sie zurueck: die Grafik ist flaechig und
rauschfrei, es gibt kein Korn, das mitverstaerkt wuerde. Radius klein halten,
sonst bekommen die Konturlinien sichtbare Hoefe.
"""
import sys
from PIL import Image, ImageFilter

source = sys.argv[1] if len(sys.argv) > 1 else 'public/mascot-selbstsicher.png'
out_path = sys.argv[2] if len(sys.argv) > 2 else 'public/profilbild.png'
SIZE = 800
BACKGROUND = (239, 235, 227, 255)  # gleicher Cremeton wie die Videos

src = Image.open(source).convert('RGBA')
w, h = src.size

head_h = int(h * 0.235)
alpha = src.crop((0, 0, w, head_h)).split()[3]

# Gesichtsmitte ueber die Deckkraft der oberen Haelfte, damit der Kreis
# symmetrisch sitzt -- die Bildmitte taugt nicht, weil Arme sie verschieben.
cols = [sum(alpha.getpixel((x, y)) for y in range(0, head_h // 2, 3)) for x in range(w)]
total = sum(cols) or 1
centre = sum(x * c for x, c in enumerate(cols)) / total

side = int(head_h * 1.5)
canvas = Image.new('RGBA', (side, side), BACKGROUND)
canvas.paste(src, (-int(centre - side / 2), int(head_h * 0.22)), src)

out = canvas.resize((SIZE, SIZE), Image.LANCZOS)
out = out.filter(ImageFilter.UnsharpMask(radius=1.4, percent=165, threshold=2))
out.convert('RGB').save(out_path, quality=95)

print(f'{source} {w}x{h}, Gesichtsmitte x={centre:.0f}')
print(f'Ausschnitt {side}x{side} -> {SIZE}x{SIZE} (Faktor {SIZE / side:.2f})')
print(f'geschrieben {out_path}')

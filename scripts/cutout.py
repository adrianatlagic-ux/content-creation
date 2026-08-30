"""Hintergrund vom Rand her freistellen und auf die Figur zuschneiden.

    python3 scripts/cutout.py <eingabe.png> <ausgabe.png>


Bewusst kein globales Color-Keying: Der Hintergrund hat fast denselben Ton wie
T-Shirt und Sneaker, ein Keying ueber das ganze Bild wuerde die mit ausstanzen.
Stattdessen Flutfuellung von allen vier Raendern -- alles, was von aussen
erreichbar ist, wird transparent, eingeschlossene helle Flaechen bleiben.
"""
import sys
from collections import deque
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
TOLERANCE = 26

im = Image.open(src).convert('RGBA')
w, h = im.size
px = im.load()

# Referenzton aus den vier Ecken mitteln.
corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))

def is_bg(p):
    return (abs(p[0] - bg[0]) <= TOLERANCE
            and abs(p[1] - bg[1]) <= TOLERANCE
            and abs(p[2] - bg[2]) <= TOLERANCE)

seen = bytearray(w * h)
queue = deque()
for x in range(w):
    for y in (0, h - 1):
        if is_bg(px[x, y]):
            queue.append((x, y)); seen[y * w + x] = 1
for y in range(h):
    for x in (0, w - 1):
        if is_bg(px[x, y]):
            queue.append((x, y)); seen[y * w + x] = 1

while queue:
    x, y = queue.popleft()
    px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and is_bg(px[nx, ny]):
            seen[ny * w + nx] = 1
            queue.append((nx, ny))

box = im.getbbox()
im.crop(box).save(dst)
print(f'Hintergrundton {bg} -> zugeschnitten auf {box[2]-box[0]}x{box[3]-box[1]}')

"""Generate the world's vellum texture: a seamless, warm paper grain for the map,
the cottage and every parchment surface (themes/fractional/static/images/vellum.jpg).

It is meant to be multiplied over a paper colour, so white means "leave the colour
alone" and the warm greys are mottling, fibres and foxing. Everything is drawn on a
3x3 tiled canvas and the centre is kept, which makes the tile wrap without seams.

    python3 scripts/make_vellum.py
"""

import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SIZE = 512
OUT = Path(__file__).resolve().parent.parent / "themes" / "fractional" / "static" / "images" / "vellum.jpg"


def tiled(draw_fn, blur, seed):
    """Draw on a 3x3 canvas, blur, and crop the centre: a seamless tile."""
    rnd = random.Random(seed)
    big = Image.new("L", (SIZE * 3, SIZE * 3), 255)
    tile = Image.new("L", (SIZE, SIZE), 255)
    draw_fn(ImageDraw.Draw(tile), rnd)
    for i in range(3):
        for j in range(3):
            big.paste(tile, (i * SIZE, j * SIZE))
    if blur:
        big = big.filter(ImageFilter.GaussianBlur(blur))
    return big.crop((SIZE, SIZE, SIZE * 2, SIZE * 2))


def speckle(density, lo, hi):
    def fn(d, rnd):
        for _ in range(int(SIZE * SIZE * density)):
            x, y = rnd.randrange(SIZE), rnd.randrange(SIZE)
            d.point((x, y), fill=rnd.randint(lo, hi))
    return fn


def blotches(count, rmin, rmax, lo, hi):
    def fn(d, rnd):
        for _ in range(count):
            x, y = rnd.randrange(SIZE), rnd.randrange(SIZE)
            r = rnd.uniform(rmin, rmax)
            d.ellipse((x - r, y - r * rnd.uniform(0.6, 1.4), x + r, y + r), fill=rnd.randint(lo, hi))
    return fn


def fibres(count, lo, hi):
    def fn(d, rnd):
        for _ in range(count):
            x, y = rnd.randrange(SIZE), rnd.randrange(SIZE)
            pts = [(x, y)]
            ang = rnd.uniform(0, 6.28)
            for _ in range(rnd.randint(4, 9)):
                ang += rnd.uniform(-0.5, 0.5)
                step = rnd.uniform(4, 11)
                x += step * __import__("math").cos(ang)
                y += step * __import__("math").sin(ang)
                pts.append((x, y))
            d.line(pts, fill=rnd.randint(lo, hi), width=1)
    return fn


def main():
    # broad clouds of tone, medium mottling, fine tooth, fibres and a little foxing
    clouds = tiled(blotches(90, 30, 90, 205, 245), 34, 1)
    mottle = tiled(blotches(420, 6, 18, 215, 250), 7, 2)
    tooth = tiled(speckle(0.22, 214, 252), 0.8, 3)
    fibre = tiled(fibres(150, 222, 242), 0.6, 4)
    fox = tiled(blotches(9, 3, 9, 200, 228), 4.5, 5)

    grain = clouds
    for layer in (mottle, tooth, fibre, fox):
        grain = ImageChops.multiply(grain, layer)
    # lift it so the paper colour underneath stays in charge
    grain = grain.point(lambda v: int(255 - (255 - v) * 0.62))

    # warm the greys toward iron-gall brown: white stays white
    # shadows lean to umber: blue drops fastest, red barely, so mottling reads as age, not grime
    warm = Image.merge("RGB", (grain.point(lambda v: int(255 - (255 - v) * 0.8)), grain.point(lambda v: int(255 - (255 - v) * 1.0)), grain.point(lambda v: max(0, int(255 - (255 - v) * 1.45)))))
    warm = ImageChops.lighter(warm, Image.new("RGB", warm.size, (0, 0, 0)))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    warm.save(OUT, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"wrote {OUT.relative_to(OUT.parents[4])} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()

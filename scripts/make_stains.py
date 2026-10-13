"""Generate the map's sheet and its charred edge.

stains.jpg  A large, non-repeating sheet of old parchment: an ochre ground with blooms
            of watercolour staining (grey-green, umber, a faint rose) and darker toward
            the edges, the way a much-handled map ages. It is laid under the whole map.
burnt.png   A square frame with a charred, sooty edge and a clear centre, sliced by CSS
            border-image so the burn keeps its scale on any screen.

    python3 scripts/make_stains.py
"""

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent / "themes" / "fractional" / "static" / "images"
W, H = 1600, 1040


def bloom_layer(rnd, count, colour, rmin, rmax, blur, alpha):
    """Soft blooms of one pigment, as an RGBA layer."""
    layer = Image.new("RGBA", (W, H), colour + (0,))
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    for _ in range(count):
        x, y = rnd.uniform(-100, W + 100), rnd.uniform(-100, H + 100)
        r = rnd.uniform(rmin, rmax)
        # a bloom is a cluster of overlapping ellipses with a slightly darker rim
        for k in range(rnd.randint(3, 7)):
            ox, oy = rnd.uniform(-r, r) * 0.6, rnd.uniform(-r, r) * 0.6
            rr = r * rnd.uniform(0.4, 0.9)
            d.ellipse((x + ox - rr, y + oy - rr * rnd.uniform(0.6, 1.2), x + ox + rr, y + oy + rr), fill=rnd.randint(int(alpha * 0.5), alpha))
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    layer.putalpha(mask)
    return layer


def mottle(seed, blur, k, colour, max_alpha, scale=2):
    """Contrast-stretched blurred noise as a pigment layer: irregular, organic blotches.
    `scale` sets the blotch size: noise drawn at 1/scale resolution, then enlarged."""
    random.seed(seed)
    n = Image.effect_noise((W // scale, H // scale), 100).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
    n = n.point(lambda v: max(0, min(255, int((v - 128) * k + 128))))
    a = n.point(lambda v: int(max(0, v - 120) / 135 * max_alpha))
    layer = Image.new("RGBA", (W, H), colour + (0,))
    layer.putalpha(a)
    return layer


def stains():
    rnd = random.Random(1954)
    sheet = Image.new("RGBA", (W, H), (232, 212, 156, 255))
    for seed, blur, k, colour, alpha, scale in [
        (1, 44, 4.2, (204, 172, 106), 130, 14),   # broad ochre clouds
        (2, 40, 4.6, (146, 146, 120), 115, 16),   # broad grey-green damp, the darker clouds
        (6, 44, 4.2, (250, 238, 200), 120, 13),   # broad bleached patches
        (3, 34, 4.0, (205, 166, 150), 55, 12),    # a faint rose
        (4, 12, 6.0, (160, 122, 72), 80, 3),      # umber mottling
        (5, 5, 5.0, (150, 118, 72), 45, 2),       # fine foxing
    ]:
        sheet = Image.alpha_composite(sheet, mottle(seed, blur, k, colour, alpha, scale))
    for colour, count, rmin, rmax, blur, alpha in [
        ((120, 112, 92), 9, 60, 150, 30, 70),  # a few deep water stains
    ]:
        sheet = Image.alpha_composite(sheet, bloom_layer(rnd, count, colour, rmin, rmax, blur, alpha))
    # handled edges: darker toward the border
    vig = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vig)
    steps = 60
    for i in range(steps):
        inset = i * 6
        vd.rectangle((inset, inset, W - inset, H - inset), outline=int(170 * (1 - i / steps) ** 2.0), width=6)
    vig = vig.filter(ImageFilter.GaussianBlur(40))
    edge = Image.new("RGBA", (W, H), (96, 70, 36, 0))
    edge.putalpha(vig)
    sheet = Image.alpha_composite(sheet, edge).convert("RGB")
    out = ROOT / "stains.jpg"
    sheet.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    print(f"wrote {out.name} ({out.stat().st_size // 1024} KB)")


def burnt():
    """A 480px frame: transparent centre, charred band ~110px, ragged and sooty."""
    S, B = 480, 112
    rnd = random.Random(1066)
    # distance from the nearest edge, perturbed by noise so the burn line is ragged
    random.seed(7)
    noise = Image.effect_noise((S // 4, S // 4), 100).resize((S, S)).filter(ImageFilter.GaussianBlur(10))
    noise = noise.point(lambda v: max(0, min(255, int((v - 128) * 5 + 128))))
    fine = Image.effect_noise((S, S), 90).filter(ImageFilter.GaussianBlur(1.6))
    alpha = Image.new("L", (S, S), 0)
    colour = Image.new("RGB", (S, S), (24, 15, 8))
    ap = alpha.load()
    cp = colour.load()
    npx, fpx = noise.load(), fine.load()
    for y in range(S):
        for x in range(S):
            dist = min(x, y, S - 1 - x, S - 1 - y)
            ragged = dist + (npx[x, y] - 128) * 0.32 + (fpx[x, y] - 128) * 0.22
            if ragged < 26:
                a = 255  # charred through
            elif ragged < B:
                t = (ragged - 26) / (B - 26)
                a = int(255 * (1 - t) ** 1.25)
            else:
                a = 0
            ap[x, y] = a
            # soot is black at the burn, browning as it scorches inward
            t = max(0.0, min(1.0, (ragged - 10) / B))
            cp[x, y] = (int(22 + 92 * t), int(14 + 58 * t), int(8 + 28 * t))
    img = colour.convert("RGBA")
    img.putalpha(alpha)
    out = ROOT / "burnt.png"
    img.save(out, "PNG", optimize=True)
    print(f"wrote {out.name} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    stains()
    burnt()

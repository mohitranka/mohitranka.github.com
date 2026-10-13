"""Render Traveler's Home: a candlelit medieval hall, as one painted-light plate.

A small ray caster: a stone-walled, timber-beamed room in one-point perspective, its
furniture made of boxes, cylinders and disks, every surface textured procedurally
(laid stone, oak planks, leather spines, a woven rug) and lit by point lights (the
hearth, wall sconces, a candle ring, the candles on the table) with soft falloff,
contact shadows, a little haze and bloom. The page draws everything that moves or can
be clicked on top of this plate, using the same camera (see `proj` in cottage.js).

    pip install numpy pillow
    python3 scripts/render_hall.py

Writes themes/fractional/static/images/hall.jpg.
"""

from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "themes" / "fractional" / "static" / "images" / "hall.jpg"

# The camera. The plate is 2000x1125; the page's viewBox is 1600x900, so 1 page unit
# is 1.25 plate pixels. In page units: x = 800 + 800 X/Z, y = 430 - 800 Y/Z.
W, H = 2000, 1125
F, CX, CY = 1000.0, 1000.0, 537.5
# The room: camera at the origin, eye 1.7m above the floor, walls at x = +-5, back at z = 9.
FLOOR, CEIL, XL, XR, ZB = -1.7, 3.3, -5.0, 5.0, 9.0

ys, xs = np.mgrid[0:H, 0:W].astype(np.float64) + 0.5
DX = (xs - CX) / F
DY = -(ys - CY) / F
DZ = np.ones_like(DX)

T = np.full((H, W), np.inf)
NX = np.zeros((H, W)); NY = np.zeros((H, W)); NZ = np.zeros((H, W))
OBJ = np.full((H, W), -1, dtype=np.int32)
OBJECTS = []


# ---------------------------------------------------------------- noise and textures
def hash2(ix, iy, seed=0.0):
    h = np.sin(ix * 127.1 + iy * 311.7 + seed * 74.7) * 43758.5453
    return h - np.floor(h)


def vnoise(x, y, seed=0.0):
    ix, iy = np.floor(x), np.floor(y)
    fx, fy = x - ix, y - iy
    u, v = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b = hash2(ix, iy, seed), hash2(ix + 1, iy, seed)
    c, d = hash2(ix, iy + 1, seed), hash2(ix + 1, iy + 1, seed)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v


def fbm(x, y, octaves=4, seed=0.0):
    s, amp, f = 0.0, 0.5, 1.0
    for i in range(octaves):
        s = s + amp * vnoise(x * f, y * f, seed + i * 13)
        f *= 2.0
        amp *= 0.5
    return s


def blur(a, sigma):
    """Gaussian-ish blur of a 2D array: three box blurs along each axis."""
    r = max(1, int(sigma * 0.87))
    for axis in (0, 1):
        for _ in range(3):
            c = np.cumsum(np.pad(a, [(r + 1, r) if k == axis else (0, 0) for k in range(2)], mode="edge"), axis=axis)
            a = (np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis) - np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)) / (2 * r + 1)
    return a


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def stone(u, v, scale=1.0, base=(0.44, 0.39, 0.33), seed=0.0):
    """Hand-laid rubble stone: uneven courses of rounded blocks of varied width, each its
    own tone, deep mortar, soot and damp in broad patches."""
    h = 0.3 * scale
    vv = v + (fbm(u * 1.5, v * 0.5, 2, seed + 40) - 0.5) * 0.08
    row = np.floor(vv / h)
    ro = hash2(row, 3.0, seed)
    # blocks of varied width: a coarse cell, split in two where the hash says so
    w0 = 0.62 * scale
    uu = u + ro * 0.9
    k0 = np.floor(uu / w0)
    split = 0.3 + 0.4 * hash2(k0, row, seed + 7)
    f0 = uu / w0 - k0
    twin = hash2(k0, row, seed + 8) < 0.55
    left = f0 < split
    k = np.where(twin, k0 * 2 + (~left), k0 * 2)
    w = np.where(twin, np.where(left, split, 1 - split) * w0, w0)
    fu = np.where(twin, np.where(left, f0 / split, (f0 - split) / (1 - split)), f0)
    fv = vv / h - row
    e = np.minimum(np.minimum(fu * w, (1 - fu) * w), np.minimum(fv * h, (1 - fv) * h))
    e = e + (fbm(u * 6, v * 6, 2, seed) - 0.5) * 0.03
    tone = 0.62 + 0.5 * hash2(k, row, seed + 1)
    warm = hash2(k, row, seed + 2)
    col = np.stack([base[0] * tone * (0.95 + 0.1 * warm), base[1] * tone, base[2] * tone * (1.05 - 0.12 * warm)], -1)
    grain = 0.75 + 0.45 * fbm(u * 9, v * 9, 4, seed + 5)
    col = col * grain[..., None]
    bevel = 0.4 + 0.6 * smooth(0.0, 0.09 * scale, e)
    col = col * bevel[..., None]
    mortar = e < 0.02 * scale
    col[mortar] = np.array([0.13, 0.11, 0.09])
    patch = 0.7 + 0.45 * fbm(u * 0.6, v * 0.6, 3, seed + 60)
    return col * patch[..., None]


def wood(u, v, plank=0.24, base=(0.40, 0.25, 0.14), seams=True, seed=0.0, joint=2.6):
    """Oak planks: grain along u, a tone per plank, dark seams and butt joints."""
    p = np.floor(v / plank)
    tone = 0.7 + 0.45 * hash2(p, 1.0, seed)
    g = fbm(u * 1.2, v * 36 + p * 7, 4, seed + 3)
    streak = 0.82 + 0.3 * np.sin(v * 140 + g * 9) * 0.5 + 0.25 * g
    col = np.stack([np.full_like(u, base[0]), np.full_like(u, base[1]), np.full_like(u, base[2])], -1)
    col = col * (tone * streak)[..., None]
    if seams:
        fv = v / plank - p
        seam = (fv < 0.035) | (fv > 0.965)
        jo = hash2(p, 5.0, seed) * joint
        ju = (u + jo) / joint
        jseam = (ju - np.floor(ju)) < 0.008
        col[seam | jseam] *= 0.35
    return col


# ---------------------------------------------------------------- geometry
def add(obj):
    OBJECTS.append(obj)
    return len(OBJECTS) - 1


def bbox(points):
    xs_, ys_ = [], []
    for X, Y, Z in points:
        xs_.append(CX + F * X / Z)
        ys_.append(CY - F * Y / Z)
    x0, x1 = max(0, int(min(xs_)) - 2), min(W, int(max(xs_)) + 3)
    y0, y1 = max(0, int(min(ys_)) - 2), min(H, int(max(ys_)) + 3)
    if x0 >= x1 or y0 >= y1:
        return None
    return slice(y0, y1), slice(x0, x1)


def write(sl, hit, t, nx, ny, nz, idx):
    Ts = T[sl]
    upd = hit & (t < Ts)
    Ts[upd] = t[upd]
    NX[sl][upd] = nx[upd] if np.ndim(nx) else nx
    NY[sl][upd] = ny[upd] if np.ndim(ny) else ny
    NZ[sl][upd] = nz[upd] if np.ndim(nz) else nz
    OBJ[sl][upd] = idx


def box(lo, hi, **kind):
    idx = add(dict(shape="box", lo=lo, hi=hi, **kind))
    big = (hi[0] - lo[0]) * (hi[1] - lo[1]) * (hi[2] - lo[2]) > 0.004 and kind.get("kind") not in ("hearth", "book")
    if big and lo[2] < 8.9 and hi[1] < 2.8:
        OCCLUDERS.append((lo, hi))
    corners = [(x, y, z) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])]
    sl = bbox(corners)
    if sl is None:
        return idx
    d = (DX[sl], DY[sl], DZ[sl])
    with np.errstate(divide="ignore", invalid="ignore"):
        t1 = [lo[i] / d[i] for i in range(3)]
        t2 = [hi[i] / d[i] for i in range(3)]
    mins = np.stack([np.minimum(a, b) for a, b in zip(t1, t2)])
    maxs = np.stack([np.maximum(a, b) for a, b in zip(t1, t2)])
    tmin = np.nanmax(mins, 0)
    tmax = np.nanmin(maxs, 0)
    hit = (tmax >= tmin) & (tmin > 0.05)
    axis = np.nanargmax(mins, 0)
    n = [np.zeros_like(tmin) for _ in range(3)]
    for a in range(3):
        n[a] = np.where(axis == a, -np.sign(d[a]), 0.0)
    write(sl, hit, tmin, n[0], n[1], n[2], idx)
    return idx


def cylinder(cx, cz, r, y0, y1, **kind):
    idx = add(dict(shape="cyl", cx=cx, cz=cz, r=r, y0=y0, y1=y1, **kind))
    if r > 0.15:
        OCCLUDERS.append(((cx - r * 0.8, y0, cz - r * 0.8), (cx + r * 0.8, y1, cz + r * 0.8)))
    pts = [(cx + sx * r, y, cz + sz * r) for sx in (-1, 1) for sz in (-1, 1) for y in (y0, y1)]
    sl = bbox(pts)
    if sl is None:
        return idx
    dx, dy, dz = DX[sl], DY[sl], DZ[sl]
    a = dx * dx + dz * dz
    b = -2 * (cx * dx + cz * dz)
    c = cx * cx + cz * cz - r * r
    disc = b * b - 4 * a * c
    ok = disc >= 0
    t = (-b - np.sqrt(np.where(ok, disc, 0))) / (2 * a)
    y = t * dy
    side = ok & (y >= y0) & (y <= y1) & (t > 0.05)
    nx = (t * dx - cx) / r
    nz = (t * dz - cz) / r
    write(sl, side, t, nx, 0.0 * nx, nz, idx)
    # the top, for anything below the eye
    if y1 < 0:
        with np.errstate(divide="ignore", invalid="ignore"):
            tc = y1 / dy
        px, pz = tc * dx - cx, tc * dz - cz
        cap = (dy < 0) & (px * px + pz * pz <= r * r) & (tc > 0.05)
        write(sl, cap, tc, 0.0 * tc, 1.0 + 0 * tc, 0.0 * tc, idx)
    return idx


def disk(x0, cy_, cz_, r, **kind):
    """A wheel standing on edge, facing the room (normal -x)."""
    idx = add(dict(shape="disk", x0=x0, cy=cy_, cz=cz_, r=r, **kind))
    sl = bbox([(x0, cy_ + sy * r, cz_ + sz * r) for sy in (-1, 1) for sz in (-1, 1)])
    dx, dy, dz = DX[sl], DY[sl], DZ[sl]
    t = x0 / dx
    py, pz = t * dy - cy_, t * dz - cz_
    hit = (py * py + pz * pz <= r * r) & (t > 0.05)
    write(sl, hit, t, -1.0, 0.0, 0.0, idx)
    return idx


# ---------------------------------------------------------------- the room
def room():
    with np.errstate(divide="ignore", invalid="ignore"):
        cands = [
            (np.where(DY < 0, FLOOR / DY, np.inf), (0, 1, 0), "floor"),
            (np.where(DY > 0, CEIL / DY, np.inf), (0, -1, 0), "ceiling"),
            (np.where(DX < 0, XL / DX, np.inf), (1, 0, 0), "wall-l"),
            (np.where(DX > 0, XR / DX, np.inf), (-1, 0, 0), "wall-r"),
            (np.full((H, W), ZB), (0, 0, -1), "wall-b"),
        ]
    full = (slice(0, H), slice(0, W))
    for t, n, name in cands:
        idx = add(dict(shape="plane", kind=name))
        write(full, np.isfinite(t) & (t > 0), t, *n, idx)


def furniture():
    oak = dict(kind="wood", base=(0.36, 0.22, 0.12))
    dark = dict(kind="wood", base=(0.24, 0.14, 0.08))
    # the timber frame: ceiling beams, wall plates, corner posts, a rail round the walls
    for zc in (5.4, 6.9, 8.4):
        box((XL, 2.88, zc - 0.17), (XR, CEIL, zc + 0.17), grain=0, **dark)
    box((XL, 2.88, 3.5), (XL + 0.24, CEIL, ZB), grain=2, **dark)
    box((XR - 0.24, 2.88, 3.5), (XR, CEIL, ZB), grain=2, **dark)
    box((XL, FLOOR, ZB - 0.26), (XL + 0.26, CEIL, ZB), grain=1, **dark)
    box((XR - 0.26, FLOOR, ZB - 0.26), (XR, CEIL, ZB), grain=1, **dark)
    box((XL, 1.6, ZB - 0.12), (XR, 1.8, ZB), grain=0, **dark)
    box((XL, 1.6, 3.5), (XL + 0.12, 1.8, ZB), grain=2, **dark)
    box((XR - 0.12, 1.6, 3.5), (XR, 1.8, ZB), grain=2, **dark)

    # the hearth: a stone chimney breast, a mantel, a hearthstone
    box((-1.4, FLOOR, 8.4), (1.4, CEIL, ZB), kind="hearth")
    box((-1.62, 0.42, 8.2), (1.62, 0.58, 8.4), grain=0, **oak)
    box((-1.7, FLOOR, 7.85), (1.7, FLOOR + 0.09, 8.4), kind="stone-slab")

    # the bookcase on the back wall, left of the hearth
    x0, x1, zf = -4.62, -2.2, 8.42
    box((x0, FLOOR, 8.92), (x1, 1.52, ZB - 0.01), grain=1, **dark)
    box((x0, FLOOR, zf), (x0 + 0.08, 1.52, 8.95), grain=1, **oak)
    box((x1 - 0.08, FLOOR, zf), (x1, 1.52, 8.95), grain=1, **oak)
    box((x0, 1.44, zf - 0.04), (x1, 1.56, 8.95), grain=0, **oak)
    shelves = [-1.52, -0.72, 0.08, 0.86]
    box((x0, FLOOR, zf), (x1, -1.52, 8.95), grain=0, **oak)
    for s in shelves[1:]:
        box((x0, s - 0.06, zf), (x1, s, 8.95), grain=0, **oak)
    r = np.random.default_rng(1066)
    leather = [(0.42, 0.08, 0.09), (0.16, 0.24, 0.14), (0.14, 0.17, 0.30), (0.40, 0.24, 0.10), (0.30, 0.10, 0.16), (0.50, 0.38, 0.20), (0.12, 0.09, 0.07), (0.55, 0.45, 0.30)]
    for row, s in enumerate(shelves[:3]):
        x = x0 + 0.1
        while x < x1 - 0.14:
            if r.random() < 0.07:
                # a short stack of books lying flat
                n = int(r.integers(2, 5))
                y = s
                w = 0.3 + r.random() * 0.06
                for _ in range(n):
                    th = 0.05 + r.random() * 0.03
                    c = leather[int(r.integers(len(leather)))]
                    box((x, y, 8.58), (x + w, y + th, 8.92), kind="book", color=c, flat=True)
                    y += th
                x += w + 0.03
                continue
            w = 0.045 + r.random() * 0.045
            h = 0.42 + r.random() * 0.24
            c = leather[int(r.integers(len(leather)))]
            box((x, s, 8.56 + r.random() * 0.05), (x + w, s + h, 8.92), kind="book", color=c)
            x += w + (0.004 if r.random() > 0.08 else 0.1)
    # the top shelf: bottles, jars and a skull-free candle
    s = shelves[3]
    for bx, br, bh, c in [(-4.4, 0.06, 0.32, (0.10, 0.22, 0.12)), (-4.22, 0.05, 0.26, (0.30, 0.16, 0.06)), (-3.95, 0.12, 0.3, (0.55, 0.30, 0.18)), (-3.6, 0.07, 0.36, (0.12, 0.18, 0.10)), (-3.38, 0.05, 0.22, (0.40, 0.30, 0.12)), (-3.05, 0.13, 0.26, (0.62, 0.48, 0.32)), (-2.7, 0.06, 0.3, (0.16, 0.12, 0.10))]:
        cylinder(bx, 8.72, br, s, s + bh, kind="jar", color=c)
    for i, bx in enumerate((-2.62, -2.48)):
        box((bx, s, 8.56), (bx + 0.12, s + 0.42, 8.92), kind="book", color=leather[i])

    # pots by the hearth and on the mantel
    cylinder(-1.85, 8.5, 0.24, FLOOR, -1.12, kind="jar", color=(0.52, 0.30, 0.18))
    cylinder(-1.62, 8.15, 0.15, FLOOR, -1.32, kind="jar", color=(0.40, 0.34, 0.24))
    cylinder(1.78, 8.45, 0.2, FLOOR, -1.25, kind="jar", color=(0.46, 0.26, 0.15))
    cylinder(-1.1, 8.3, 0.1, 0.58, 0.86, kind="jar", color=(0.50, 0.40, 0.25))
    cylinder(1.15, 8.3, 0.08, 0.58, 0.8, kind="jar", color=(0.16, 0.24, 0.14))

    # the long table, front left (the writing desk)
    box((-3.7, -0.98, 4.4), (-1.15, -0.9, 5.65), grain=0, **oak)
    for lx in (-3.6, -1.3):
        for lz in (4.5, 5.5):
            box((lx - 0.05, FLOOR, lz - 0.05), (lx + 0.05, -0.98, lz + 0.05), grain=1, **dark)
    box((-3.6, -1.45, 4.97), (-1.3, -1.38, 5.03), grain=0, **dark)
    # a bench beside it
    box((-3.5, -1.28, 3.9), (-1.4, -1.2, 4.12), grain=0, **oak)
    for lx in (-3.4, -1.5):
        box((lx - 0.04, FLOOR, 3.95), (lx + 0.04, -1.28, 4.07), grain=1, **dark)

    # the workbench against the right wall, an anvil and a wheel on it
    box((4.05, -0.8, 6.3), (XR - 0.02, -0.72, 8.25), grain=2, **oak)
    box((4.08, -1.4, 6.35), (XR - 0.05, -1.34, 8.2), grain=2, **dark)
    for lz in (6.38, 8.15):
        box((4.1, FLOOR, lz - 0.05), (4.2, -0.8, lz + 0.05), grain=1, **dark)
    box((4.45, -0.72, 7.45), (4.7, -0.6, 7.65), kind="iron")
    box((4.38, -0.6, 7.3), (4.76, -0.5, 7.8), kind="iron")
    disk(4.32, -0.38, 6.75, 0.32, kind="grindstone")
    box((4.36, -0.72, 6.62), (4.5, -0.38, 6.68), grain=1, **dark)
    box((4.3, -0.72, 7.95), (4.85, -0.55, 8.2), grain=0, **oak)

    # a small table with chess, a stool, two barrels, front right
    box((1.55, -1.03, 4.55), (2.65, -0.96, 5.45), kind="chess-top")
    for lx in (1.62, 2.58):
        for lz in (4.62, 5.38):
            box((lx - 0.04, FLOOR, lz - 0.04), (lx + 0.04, -1.03, lz + 0.04), grain=1, **dark)
    pieces = [(1.86, 4.82, 0.09, 0.85), (2.05, 4.9, 0.07, 0.85), (2.2, 5.05, 0.11, 0.08), (2.32, 4.95, 0.07, 0.08), (1.95, 5.12, 0.07, 0.85), (2.25, 5.2, 0.08, 0.08)]
    for px, pz, ph, tone in pieces:
        cylinder(px, pz, 0.025, -0.96, -0.96 + ph, kind="piece", color=(tone, tone * 0.95, tone * 0.85))
    box((0.9, -1.3, 4.75), (1.25, -1.24, 5.1), grain=0, **oak)
    box((0.95, FLOOR, 4.8), (1.2, -1.3, 5.05), grain=1, **dark)
    cylinder(3.25, 4.55, 0.43, FLOOR, -0.55, kind="barrel")
    # crates, sacks and pots in the corners: the house is lived in
    box((3.95, FLOOR, 8.3), (4.72, -1.12, 8.95), grain=0, **oak)
    box((4.05, -1.12, 8.4), (4.6, -0.7, 8.9), grain=0, **dark)
    cylinder(-4.3, 7.2, 0.3, FLOOR, -1.0, kind="jar", color=(0.46, 0.38, 0.26))
    cylinder(-4.55, 6.6, 0.22, FLOOR, -1.22, kind="jar", color=(0.40, 0.22, 0.13))
    cylinder(-4.0, 6.8, 0.16, FLOOR, -1.38, kind="jar", color=(0.30, 0.26, 0.2))
    cylinder(3.55, 8.1, 0.18, FLOOR, -1.3, kind="jar", color=(0.44, 0.25, 0.14))
    cylinder(3.9, 5.35, 0.4, FLOOR, -0.62, kind="barrel")


# ---------------------------------------------------------------- shading
def shade():
    P = np.stack([T * DX, T * DY, T * DZ], -1)
    N = np.stack([NX, NY, NZ], -1)
    ALB = np.zeros((H, W, 3))
    EMI = np.zeros((H, W, 3))
    X, Y, Z = P[..., 0], P[..., 1], P[..., 2]

    def kind_mask(pred):
        m = np.zeros((H, W), bool)
        for i, o in enumerate(OBJECTS):
            if pred(o):
                m |= OBJ == i
        return m

    walls_b = kind_mask(lambda o: o.get("kind") == "wall-b")
    walls_l = kind_mask(lambda o: o.get("kind") == "wall-l")
    walls_r = kind_mask(lambda o: o.get("kind") == "wall-r")
    floor = kind_mask(lambda o: o.get("kind") == "floor")
    ceil = kind_mask(lambda o: o.get("kind") == "ceiling")

    for m, u, v, seed in ((walls_b, X, Y, 1), (walls_l, Z, Y, 2), (walls_r, Z, Y, 3)):
        ALB[m] = stone(u[m], v[m], 1.0, seed=seed)
    ALB[floor] = wood(Z[floor], X[floor], 0.26, (0.36, 0.22, 0.12), seed=4)
    ALB[ceil] = wood(X[ceil], Z[ceil], 0.2, (0.22, 0.13, 0.07), seed=5)

    # ---- decals on the back wall: the arched oak door and its stone surround; the letter
    m = walls_b
    ax, ay = X - 2.86, Y - 0.2
    rr = np.sqrt(ax * ax + np.maximum(ay, 0) ** 2)
    inside = m & (np.abs(ax) < 0.66) & ((ay < 0) | (rr < 0.66))
    surround = m & ~inside & (((np.abs(ax) < 0.9) & (ay < 0)) | ((rr < 0.9) & (ay >= 0)))
    ang = np.arctan2(np.maximum(ay, 0), ax)
    vous = np.where(ay >= 0, np.floor(ang / (np.pi / 9)), np.floor((Y + 1.7) / 0.32))
    sc = stone(X[surround] * 3, vous[surround] * 0.34 + 0.17, 1.0, base=(0.64, 0.58, 0.49), seed=7)
    ALB[surround] = sc
    door = wood(Y[inside], X[inside] - 2.2, 0.2, (0.34, 0.18, 0.09), seed=8, joint=99)
    dy_ = Y[inside]
    strap = (np.abs(dy_ + 1.2) < 0.05) | (np.abs(dy_ + 0.1) < 0.05)
    door[strap] = np.array([0.07, 0.06, 0.05])
    stud = strap & (((X[inside] - 2.2) / 0.14) % 1 < 0.25)
    door[stud] = np.array([0.22, 0.2, 0.18])
    ring = np.abs(np.hypot(X[inside] - 3.3, dy_ + 0.62) - 0.07) < 0.014
    door[ring] = np.array([0.1, 0.09, 0.08])
    edge = (np.abs(X[inside] - 2.86) > 0.62) | ((dy_ > 0.2) & (rr[inside] > 0.62))
    door[edge] *= 0.3
    ALB[inside] = door

    lt = m & (X > 3.98) & (X < 4.62) & (Y > 0.18) & (Y < 1.12)
    sh = m & ~lt & (X > 4.01) & (X < 4.66) & (Y > 0.13) & (Y < 1.08)
    ALB[sh] *= 0.45
    lu, lv = X[lt], Y[lt]
    paper = np.stack([0.80 + 0 * lu, 0.70 + 0 * lu, 0.50 + 0 * lu], -1) * (0.85 + 0.2 * fbm(lu * 12, lv * 12, 3, 9))[..., None]
    lines = (np.abs(((lv - 0.62) / 0.07) % 1 - 0.5) < 0.08) & (lv > 0.6) & (lv < 0.98) & (lu > 4.06) & (lu < 4.52)
    paper[lines] *= 0.45
    seal = np.hypot(lu - 4.48, lv - 0.32) < 0.06
    paper[seal] = np.array([0.45, 0.06, 0.07])
    tower = (lu > 4.18) & (lu < 4.36) & (lv > 0.26) & (lv < 0.42) & ~((lv > 0.38) & (((lu - 4.18) / 0.045) % 1 > 0.5))
    paper[tower] *= 0.4
    ALB[lt] = paper

    # back-wall sconces: iron brackets
    for sx in (-1.9, 1.9):
        br = m & (np.abs(X - sx) < 0.05) & (Y > 0.55) & (Y < 0.95)
        ALB[br] = np.array([0.06, 0.05, 0.04])

    # ---- the left wall: a deep arched window onto dusk, the letterbox, a sconce
    m = walls_l
    wz, wy = Z - 6.55, Y - 1.0
    wr = np.sqrt(wz * wz + np.maximum(wy, 0) ** 2)
    win = m & (np.abs(wz) < 0.5) & (Y > 0.05) & ((wy < 0) | (wr < 0.5))
    frame = m & ~win & (np.abs(wz) < 0.64) & (Y > -0.08) & ((wy < 0) | (wr < 0.64))
    ALB[frame] = stone(Z[frame] * 2, Y[frame] * 2, 0.6, base=(0.66, 0.6, 0.5), seed=11)
    s_ = (Z[win] - 6.05) / 1.0
    t_ = (Y[win] - 0.05) / 1.45
    sky = np.stack([0.95 - 0.8 * t_, 0.55 - 0.35 * t_, 0.32 + 0.05 * t_], -1)
    sky = np.clip(sky, 0.05, 1)
    far = t_ < 0.3 + 0.05 * np.sin(s_ * 7) + 0.04 * np.sin(s_ * 17)
    sky[far] = np.array([0.28, 0.20, 0.26])
    castle = (s_ > 0.55) & (s_ < 0.8) & (t_ < 0.46) & ~((t_ > 0.4) & (((s_ - 0.55) / 0.05) % 1 > 0.5))
    castle |= (s_ > 0.62) & (s_ < 0.68) & (t_ < 0.55)
    sky[castle] = np.array([0.16, 0.12, 0.16])
    lamp = (np.abs(s_ - 0.66) < 0.012) & (np.abs(t_ - 0.4) < 0.012)
    sky[lamp] = np.array([2.2, 1.5, 0.6])
    near = t_ < 0.14 + 0.06 * np.sin(s_ * 4 + 1)
    sky[near] = np.array([0.10, 0.08, 0.09])
    mull = (np.abs(Z[win] - 6.55) < 0.025) | (np.abs(Y[win] - 0.75) < 0.025)
    sky[mull] = np.array([0.03, 0.02, 0.015])
    EMI[win] = sky * 0.9
    ALB[win] = 0
    sill = m & (np.abs(wz) < 0.7) & (Y > -0.08) & (Y < 0.05)
    ALB[sill] = wood(Z[sill], Y[sill], 1, (0.30, 0.18, 0.1), seams=False)

    lb = m & (Z > 7.86) & (Z < 8.5) & (Y > -0.15) & (Y < 0.45)
    ALB[lb] = wood(Y[lb], Z[lb], 0.12, (0.38, 0.22, 0.11), seed=12)
    roof = m & (Z > 7.8) & (Z < 8.56) & (Y >= 0.45) & (Y < 0.45 + 0.35 * (1 - np.abs(Z - 8.18) / 0.38))
    ALB[roof] = wood(Z[roof], Y[roof], 0.08, (0.26, 0.14, 0.07), seed=13)
    slot = m & (Z > 7.98) & (Z < 8.38) & (np.abs(Y - 0.2) < 0.025)
    ALB[slot] = np.array([0.02, 0.02, 0.02])
    perch = m & (Z > 7.8) & (Z < 8.6) & (np.abs(Y + 0.62) < 0.035)
    ALB[perch] = np.array([0.18, 0.1, 0.05])
    br = m & (np.abs(Z - 7.45) < 0.04) & (Y > 0.55) & (Y < 0.95)
    ALB[br] = np.array([0.06, 0.05, 0.04])

    # ---- the right wall: tools on pegs over the workbench, a sconce
    m = walls_r
    peg = m & (Z > 6.4) & (Z < 8.2) & (np.abs(Y - 0.95) < 0.05)
    ALB[peg] = wood(Z[peg], Y[peg], 1, (0.3, 0.18, 0.1), seams=False)
    tools = [
        ((6.62, 6.68, 0.1, 0.9), (0.30, 0.18, 0.1)), ((6.54, 6.76, 0.62, 0.74), (0.12, 0.11, 0.1)),
        ((6.98, 7.38, 0.35, 0.62), (0.32, 0.31, 0.3)), ((7.34, 7.44, 0.42, 0.68), (0.3, 0.18, 0.1)),
        ((7.66, 7.69, 0.05, 0.9), (0.08, 0.07, 0.06)), ((7.74, 7.77, 0.05, 0.9), (0.08, 0.07, 0.06)),
        ((7.98, 8.04, 0.1, 0.9), (0.30, 0.18, 0.1)), ((7.9, 8.12, 0.7, 0.84), (0.18, 0.17, 0.16)),
    ]
    for (z0, z1, y0, y1), c in tools:
        shadow = m & (Z > z0 + 0.03) & (Z < z1 + 0.03) & (Y > y0 - 0.04) & (Y < y1 - 0.04)
        ALB[shadow] *= 0.5
    for (z0, z1, y0, y1), c in tools:
        t = m & (Z > z0) & (Z < z1) & (Y > y0) & (Y < y1)
        ALB[t] = np.array(c)
    br = m & (np.abs(Z - 5.9) < 0.04) & (Y > 0.55) & (Y < 0.95)
    ALB[br] = np.array([0.06, 0.05, 0.04])

    # ---- the rug, woven and worn, and the rush doormat
    rug = floor & (np.abs(X) < 1.7) & (Z > 5.0) & (Z < 7.7)
    a = (X[rug] + 1.7) / 3.4
    b = (Z[rug] - 5.0) / 2.7
    e = np.minimum(np.minimum(a, 1 - a) * 3.4, np.minimum(b, 1 - b) * 2.7)
    ox = np.array([0.21, 0.035, 0.045])
    ind = np.array([0.10, 0.12, 0.26])
    gold = np.array([0.40, 0.28, 0.11])
    cream = np.array([0.55, 0.47, 0.33])
    col = np.tile(ox, (len(a), 1))
    col[e < 0.36] = ind
    band = (e >= 0.08) & (e < 0.28)
    col[band] = gold
    diam = band & ((np.abs(((a * 3.4 + b * 2.7) / 0.2) % 1 - 0.5) + np.abs((e - 0.18) / 0.1)) < 0.45)
    col[diam] = ox
    col[e < 0.06] = ind * 0.7
    ca, cb = (a - 0.5) * 3.4, (b - 0.5) * 2.7
    md = np.sqrt((ca / 1.0) ** 2 + (cb / 0.62) ** 2)
    col[md < 0.62] = ind
    col[(md < 0.52)] = cream * 0.8
    star = np.abs(np.cos(np.arctan2(cb, ca) * 4)) * 0.18 + 0.2
    col[md < star + 0.08] = ox
    col[md < 0.12] = gold
    col[np.abs(md - 0.58) < 0.02] = gold
    for qa in (0, 1):
        for qb in (0, 1):
            qd = np.hypot((a - qa) * 3.4, (b - qb) * 2.7)
            col[(qd < 0.62) & (e >= 0.36)] = ind
            col[(qd < 0.48) & (e >= 0.36)] = gold * 0.9
    wear = 0.75 + 0.35 * fbm(X[rug] * 3, Z[rug] * 3, 4, 21)
    weave = 0.9 + 0.1 * np.sin(X[rug] * 900) * np.sin(Z[rug] * 900)
    ALB[rug] = col * (wear * weave)[..., None]
    fringe = floor & (np.abs(X) < 1.6) & (((Z > 4.92) & (Z <= 5.0)) | ((Z >= 7.7) & (Z < 7.78))) & ((X * 60) % 1 < 0.5)
    ALB[fringe] = cream * 0.9
    mat = floor & (X > 2.35) & (X < 3.35) & (Z > 8.2) & (Z < 8.78)
    ALB[mat] = np.array([0.52, 0.40, 0.2]) * (0.75 + 0.3 * (np.sin(X[mat] * 120) * 0.5 + 0.5))[..., None]

    # ---- objects
    for i, o in enumerate(OBJECTS):
        k = o.get("kind")
        mm = OBJ == i
        if not mm.any() or o["shape"] == "plane":
            continue
        x, y, z = X[mm], Y[mm], Z[mm]
        nx, ny, nz = NX[mm], NY[mm], NZ[mm]
        if k == "wood":
            g = o.get("grain", 0)
            coords = (x, y, z)
            axes = [a for a in range(3) if a != g]
            u = coords[g]
            v = np.where(np.abs((nx, ny, nz)[axes[0]]) > 0.5, coords[axes[1]], coords[axes[0]])
            ALB[mm] = wood(u, v, 9.0, o["base"], seams=False, seed=i)
        elif k == "book":
            c = np.array(o["color"])
            col = np.tile(c, (len(x), 1)) * (0.8 + 0.3 * fbm(x * 30, y * 30, 3, i))[..., None]
            lo, hi = o["lo"], o["hi"]
            if not o.get("flat"):
                fy = (y - lo[1]) / (hi[1] - lo[1])
                bandm = (nz < -0.5) & ((np.abs(fy - 0.12) < 0.025) | (np.abs(fy - 0.86) < 0.025) | (np.abs(fy - 0.5) < 0.012))
                col[bandm] = np.array([0.66, 0.48, 0.18])
                top = ny > 0.5
                col[top] = np.array([0.7, 0.62, 0.48])
            else:
                side = nz < -0.5
                col[side & (((y - lo[1]) / 0.012) % 1 < 0.4)] *= 0.6
            ALB[mm] = col
        elif k == "hearth":
            front = nz < -0.5
            col = stone(x * 1.0, y, 0.75, base=(0.58, 0.53, 0.46), seed=31)
            # the firebox: an arched opening, sooty and lit from within
            arch = -0.25 + 0.4 * np.sqrt(np.clip(1 - (x / 0.86) ** 2, 0, 1))
            op = front & (np.abs(x) < 0.86) & (y < arch)
            soot = np.clip((y + 1.7) / 1.8, 0, 1)
            col[front & (np.abs(x) < 1.0) & (y < arch + 0.16) & (y > -0.6)] *= 0.55 + 0.45 * smooth(-0.6, 0.6, y[front & (np.abs(x) < 1.0) & (y < arch + 0.16) & (y > -0.6)])[..., None]
            inner = np.zeros((op.sum(), 3))
            glow = np.exp(-((x[op] / 0.55) ** 2 + ((y[op] + 1.62) / 0.55) ** 2))
            inner += np.array([3.4, 1.35, 0.38]) * glow[..., None]
            inner += np.array([0.05, 0.03, 0.02]) * (1 - soot[op])[..., None]
            logs = (y[op] < -1.5) & (y[op] > -1.66) & (np.abs(x[op]) < 0.5)
            inner[logs] = np.array([0.08, 0.04, 0.02]) + np.array([1.6, 0.5, 0.1]) * (fbm(x[op][logs] * 30, y[op][logs] * 30, 3, 4) > 0.62)[..., None]
            emi = np.zeros((len(x), 3))
            emi[op] = inner
            col[op] = 0.02
            ALB[mm] = col
            EMI[mm] = emi
            # the red banner on the breast, swallow-tailed, with a gilt border
            bn = front & (np.abs(x) < 0.64) & (y < 2.55) & (y > 1.0 + 0.3 * (1 - np.abs(x) / 0.64))
            if bn.any():
                bx, by = x[bn], y[bn]
                fold = 0.72 + 0.28 * np.sin(bx * 22 + fbm(bx * 3, by * 3, 2, 3) * 2) ** 2
                cc = np.tile(np.array([0.50, 0.06, 0.08]), (len(bx), 1)) * fold[..., None]
                bd = (np.abs(bx) > 0.56) | (by > 2.46) | (by < 1.08 + 0.3 * (1 - np.abs(bx) / 0.64))
                cc[bd] = np.array([0.66, 0.46, 0.16]) * fold[bd][..., None]
                col2 = ALB[mm]
                col2[bn] = cc
                ALB[mm] = col2
            rod = front & (np.abs(x) < 0.76) & (np.abs(y - 2.6) < 0.035)
            col2 = ALB[mm]
            col2[rod] = np.array([0.08, 0.06, 0.05])
            ALB[mm] = col2
        elif k == "stone-slab":
            ALB[mm] = stone(x, z, 0.8, base=(0.5, 0.46, 0.4), seed=41)
        elif k == "iron":
            ALB[mm] = np.array([0.09, 0.085, 0.08]) * (0.8 + 0.3 * fbm(x * 40, z * 40, 2, 3))[..., None]
        elif k == "grindstone":
            rr_ = np.hypot(y - o["cy"], z - o["cz"])
            col = np.tile(np.array([0.5, 0.47, 0.42]), (len(x), 1)) * (0.8 + 0.3 * fbm(y * 20, z * 20, 3, 5))[..., None]
            col[rr_ > o["r"] - 0.03] *= 0.55
            col[rr_ < 0.05] = np.array([0.2, 0.12, 0.06])
            ALB[mm] = col
        elif k == "chess-top":
            col = wood(x, z, 9, (0.34, 0.2, 0.11), seams=False)
            top = ny > 0.5
            bx, bz = (x - 1.78) / 0.64, (z - 4.68) / 0.64
            onb = top & (bx >= 0) & (bx < 1) & (bz >= 0) & (bz < 1)
            chk = ((np.floor(bx * 8) + np.floor(bz * 8)) % 2) == 0
            col[onb & chk] = np.array([0.72, 0.62, 0.44])
            col[onb & ~chk] = np.array([0.16, 0.09, 0.05])
            rim = top & ~onb & (bx > -0.05) & (bx < 1.05) & (bz > -0.05) & (bz < 1.05)
            col[rim] = np.array([0.12, 0.07, 0.04])
            ALB[mm] = col
        elif k == "piece":
            ALB[mm] = np.array(o["color"])
        elif k == "jar":
            c = np.array(o["color"])
            fy = (y - o["y0"]) / (o["y1"] - o["y0"])
            col = np.tile(c, (len(x), 1)) * (0.85 + 0.25 * fbm(x * 20, y * 20, 2, i))[..., None]
            col[(np.abs(fy - 0.78) < 0.04) & (ny < 0.5)] *= 0.55
            col[ny > 0.5] *= 0.3
            ALB[mm] = col
        elif k == "barrel":
            th = np.arctan2(z - o["cz"], x - o["cx"])
            fy = (y - o["y0"]) / (o["y1"] - o["y0"])
            col = wood(y, th * o["r"] * 1.0, 0.13, (0.36, 0.21, 0.1), seed=i, joint=99)
            hoop = (np.abs(fy - 0.14) < 0.035) | (np.abs(fy - 0.86) < 0.035) | (np.abs(fy - 0.38) < 0.02) | (np.abs(fy - 0.62) < 0.02)
            col[hoop & (ny < 0.5)] = np.array([0.08, 0.07, 0.06])
            top = ny > 0.5
            if top.any():
                tc = wood(x[top], z[top], 0.12, (0.32, 0.19, 0.09), seed=i + 1, joint=99)
                rim = np.hypot(x[top] - o["cx"], z[top] - o["cz"]) > o["r"] - 0.04
                tc[rim] = np.array([0.08, 0.07, 0.06])
                col[top] = tc
            # a bulge: the staves catch light at the middle
            col *= (0.8 + 0.3 * np.sin(fy * np.pi))[..., None]
            ALB[mm] = col

    return P, N, ALB, EMI


LIGHTS = [
    # position, colour, power
    ((0.0, -1.1, 8.1), (1.0, 0.46, 0.16), 30.0),  # the hearth
    ((-1.9, 1.05, 8.82), (1.0, 0.62, 0.3), 4.2),  # sconces flanking the hearth
    ((1.9, 1.05, 8.82), (1.0, 0.62, 0.3), 4.2),
    ((-4.82, 1.05, 7.45), (1.0, 0.6, 0.28), 3.8),  # sconce, left wall
    ((4.82, 1.05, 5.9), (1.0, 0.6, 0.28), 3.8),  # sconce, right wall
    ((0.0, 1.95, 6.4), (1.0, 0.64, 0.32), 3.6),  # the candle ring
    ((-2.5, -0.62, 5.0), (1.0, 0.62, 0.3), 2.6),  # candles on the table
    ((4.5, -0.4, 7.2), (1.0, 0.56, 0.26), 1.0),  # a lamp on the workbench
]


OCCLUDERS = []


def shadow(P, L):
    """1 where the light reaches the point, a soft 0.15 where furniture stands between."""
    s = np.ones(P.shape[:2])
    D = L - P
    for lo, hi in OCCLUDERS:
        lo_, hi_ = np.array(lo), np.array(hi)
        with np.errstate(divide="ignore", invalid="ignore"):
            t1 = (lo_ - P) / D
            t2 = (hi_ - P) / D
        tmin = np.nanmax(np.minimum(t1, t2), -1)
        tmax = np.nanmin(np.maximum(t1, t2), -1)
        blocked = (tmax >= tmin) & (tmin > 0.002) & (tmin < 0.995)
        s = np.where(blocked, s * 0.15, s)
    return s


def light(P, N, ALB, EMI):
    Lsum = np.zeros_like(ALB)
    V = -P / np.linalg.norm(P, axis=-1, keepdims=True)
    for pos, col, power in LIGHTS:
        L = np.array(pos) - P
        d2 = np.sum(L * L, -1)
        Ld = L / np.sqrt(d2)[..., None]
        ndl = np.clip(np.sum(N * Ld, -1), 0, 1)
        fall = power / (d2 + 0.25)
        fall = fall * shadow(P, np.array(pos))
        Lsum += (ndl * fall)[..., None] * np.array(col)
        # a soft sheen on wood and stone, strongest on the floor
        Hv = Ld + V
        Hv /= np.linalg.norm(Hv, axis=-1, keepdims=True)
        spec = np.clip(np.sum(N * Hv, -1), 0, 1) ** 24 * fall * 0.08
        Lsum += spec[..., None] * np.array(col)
    amb = np.array([0.018, 0.012, 0.01])
    c = ALB * (Lsum + amb)
    return c + EMI


def occlusion(P):
    """Corners and contact: dark where the room's planes meet, and where something
    nearer stands in front (an unsharp mask of depth)."""
    X, Y, Z = P[..., 0], P[..., 1], P[..., 2]
    ao = np.ones((H, W))
    for d in (Y - FLOOR, CEIL - Y, X - XL, XR - X, ZB - Z):
        ao *= 1 - 0.42 * np.exp(-np.maximum(d, 0) / 0.45) * (d > 0.01)
    near = blur(np.minimum(T, 30.0), 18)
    ao *= 1 - np.clip((np.minimum(T, 30.0) - near) * 0.55, 0, 0.6)
    return ao


def main():
    room()
    furniture()
    P, N, ALB, EMI = shade()
    c = light(P, N, ALB, EMI)
    c *= occlusion(P)[..., None]
    # warm haze in the air, thicker with distance
    c += np.array([0.05, 0.03, 0.015]) * (1 - np.exp(-T / 14))[..., None]
    # halos round the flames, then bloom on whatever is brightest
    for pos, col, power in LIGHTS[1:6]:
        sx, sy = CX + F * pos[0] / pos[2], CY - F * pos[1] / pos[2]
        r2 = (xs - sx) ** 2 + (ys - sy) ** 2
        c += np.array(col)[None, None, :] * (np.exp(-r2 / (2 * 38**2)) * 0.5 + np.exp(-r2 / (2 * 140**2)) * 0.12)[..., None]
    lum = c.max(-1)
    bright = np.clip(c - 0.8, 0, None) * (lum > 0.8)[..., None]
    bl = np.stack([blur(bright[..., k], 26) for k in range(3)], -1)
    c += bl * 0.6
    # tone: a filmic shoulder, a warm grade, a vignette
    exposure = 0.95
    c = 1 - np.exp(-c * exposure)
    c = np.power(np.clip(c, 0, 1), 1 / 2.1)
    c = c * np.array([1.04, 0.98, 0.88])
    vx, vy = (xs / W - 0.5) * 1.6, (ys / H - 0.5) * 1.8
    c *= (1 - 0.7 * np.clip(vx * vx + vy * vy - 0.12, 0, 1))[..., None]
    img = Image.fromarray(np.clip(c * 255, 0, 255).astype(np.uint8))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"wrote {OUT.name} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()

"""Write themes/fractional/static/css/worlds/materials.css: the world's shared materials.

Palette tokens (vellum, iron-gall ink, vermilion, lapis, gilt), the vellum texture,
and the drawn ornaments as SVG data URIs, so every page in the world is decorated with
real drawings rather than font glyphs. Edit the SVGs here and re-run:

    python3 scripts/make_ornaments.py
"""

from pathlib import Path
from urllib.parse import quote

OUT = Path(__file__).resolve().parent.parent / "themes" / "fractional" / "static" / "css" / "worlds" / "materials.css"

INK = "#241710"
# the rubric is oxblood, like a hand-lettered map's place names
VERMILION = "#74263a"
GILT = "#b8862e"
GILT_HI = "#e6c46e"
LAPIS = "#23386b"

ORNAMENTS = {
    # an ivy-leaf fleuron with a curled stem, for section headings
    "fleuron": f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 26'>
      <path d='M2 17 C 7 18, 10 15, 13 13' fill='none' stroke='{VERMILION}' stroke-width='1.6' stroke-linecap='round'/>
      <path d='M5 20 C 3 23, 6 25, 8 22' fill='none' stroke='{VERMILION}' stroke-width='1.2' stroke-linecap='round'/>
      <path d='M13 13 C 12 6, 20 1, 27 4 C 35 7, 38 15, 33 20 C 29 24, 21 23, 18 18 C 16 16, 15 14, 13 13 Z' fill='{VERMILION}'/>
      <path d='M15 13 C 21 12, 26 11, 32 8' fill='none' stroke='#f3e6c4' stroke-width='0.9' opacity='.7'/>
    </svg>""",
    # a pen-ruled divider: tapering rules, dots and a lozenge in vermilion and gilt
    "divider": f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 22'>
      <path d='M8 11 Q 60 9.6 100 11 Q 60 12.4 8 11 Z' fill='{INK}'/>
      <path d='M232 11 Q 180 9.6 140 11 Q 180 12.4 232 11 Z' fill='{INK}'/>
      <circle cx='106' cy='11' r='1.8' fill='{INK}'/><circle cx='134' cy='11' r='1.8' fill='{INK}'/>
      <path d='M120 2 L 129 11 L 120 20 L 111 11 Z' fill='{GILT}' stroke='{INK}' stroke-width='1'/>
      <path d='M120 6.5 L 124.5 11 L 120 15.5 L 115.5 11 Z' fill='{VERMILION}'/>
    </svg>""",
    # a gilt corner flourish for framed sheets (top-left; mirrored by CSS for the others)
    "corner": f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <path d='M4 60 V 10 Q 4 4 10 4 H 60' fill='none' stroke='{GILT}' stroke-width='2.2'/>
      <path d='M10 60 V 16 Q 10 10 16 10 H 60' fill='none' stroke='{INK}' stroke-width='0.9' opacity='.7'/>
      <path d='M16 16 C 26 16, 30 22, 26 28 C 22 34, 15 28, 19 24 C 22 21, 26 25, 24 27' fill='none' stroke='{VERMILION}' stroke-width='1.6' stroke-linecap='round'/>
      <path d='M27 18 C 34 13, 42 16, 40 22 C 38 27, 31 25, 30 21 Z' fill='{GILT}' stroke='{INK}' stroke-width='0.6'/>
      <path d='M18 27 C 13 34, 16 42, 22 40 C 27 38, 25 31, 21 30 Z' fill='{GILT}' stroke='{INK}' stroke-width='0.6'/>
      <circle cx='4' cy='4' r='2.6' fill='{GILT}'/>
    </svg>""",
    # the title cartouche: a sheet between two rolled ends, curled at the tips, drawn so it
    # can stretch (strokes do not scale) round a title of any length
    "cartouche": f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 220' preserveAspectRatio='none'>
      <g fill='none' stroke='{INK}' stroke-width='1.6' vector-effect='non-scaling-stroke' stroke-linecap='round' stroke-linejoin='round'>
        <path d='M34 30 V 190' /><path d='M366 30 V 190'/>
        <path d='M48 46 H 352 V 174 H 48 Z' stroke-width='1'/><path d='M54 52 H 346 V 168 H 54 Z' stroke-width='0.7'/>
        <path d='M22 14 H 378 C 392 14, 392 34, 378 34 H 22 C 8 34, 8 14, 22 14 Z' fill='#e8d3a0'/>
        <path d='M22 186 H 378 C 392 186, 392 206, 378 206 H 22 C 8 206, 8 186, 22 186 Z' fill='#e8d3a0'/>
        <path d='M22 14 C 4 14, 2 30, 14 32 C 22 33, 22 22, 15 22 C 10 22, 11 28, 15 28'/>
        <path d='M378 14 C 396 14, 398 30, 386 32 C 378 33, 378 22, 385 22 C 390 22, 389 28, 385 28'/>
        <path d='M22 186 C 4 186, 2 202, 14 204 C 22 205, 22 194, 15 194 C 10 194, 11 200, 15 200'/>
        <path d='M378 186 C 396 186, 398 202, 386 204 C 378 205, 378 194, 385 194 C 390 194, 389 200, 385 200'/>
        <path d='M60 19 H 340 M60 29 H 340 M60 191 H 340 M60 201 H 340' stroke-width='0.6' opacity='.6'/>
      </g>
    </svg>""",
    # the same corner, mirrored, for the other three corners of a frame
    "corner-tr": None,
    "corner-bl": None,
    "corner-br": None,
    # a wax seal with irregular drips and an embossed tower
    "seal": """<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <defs>
        <radialGradient id='w' cx='38%' cy='32%' r='70%'>
          <stop offset='0' stop-color='#d9584a'/><stop offset='.55' stop-color='#a3291f'/><stop offset='1' stop-color='#5e1610'/>
        </radialGradient>
        <radialGradient id='p' cx='45%' cy='40%' r='60%'>
          <stop offset='0' stop-color='#b8382c'/><stop offset='1' stop-color='#7a1d15'/>
        </radialGradient>
      </defs>
      <path d='M50 6 C 62 5, 72 10, 79 16 C 88 18, 94 30, 92 40 C 97 48, 95 60, 89 67 C 90 78, 82 87, 71 89 C 64 96, 50 97, 41 93 C 30 95, 18 89, 14 79 C 5 73, 3 60, 8 51 C 3 41, 7 28, 16 22 C 20 12, 36 5, 50 6 Z' fill='url(#w)'/>
      <circle cx='50' cy='50' r='29' fill='url(#p)'/>
      <circle cx='50' cy='50' r='29' fill='none' stroke='#5e1610' stroke-width='1.6' opacity='.7'/>
      <circle cx='50' cy='50' r='25' fill='none' stroke='#e88a7c' stroke-width='0.9' opacity='.45' stroke-dasharray='1.5 2.5'/>
      <path d='M36 64 V 44 H 41 V 49 H 45 V 40 H 55 V 49 H 59 V 44 H 64 V 64 Z M47 64 V 57 A 3 3 0 0 1 53 57 V 64' fill='#6b1a13' opacity='.75'/>
      <path d='M37 63 V 45 H 40 V 50 H 46 V 41 H 54 V 50 H 60 V 45 H 63' fill='none' stroke='#f0a596' stroke-width='0.9' opacity='.55'/>
      <ellipse cx='36' cy='28' rx='10' ry='5' fill='#fff' opacity='.18' transform='rotate(-25 36 28)'/>
    </svg>""",
    # a small quill, for the letter's form
    "quill": f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
      <path d='M42 4 C 26 8, 14 20, 9 36 C 16 30, 22 27, 27 26 C 23 25, 21 23, 24 20 C 28 22, 31 21, 33 18 C 30 17, 29 15, 31 12 C 36 12, 40 9, 42 4 Z' fill='#efe2c4' stroke='{INK}' stroke-width='1.3' stroke-linejoin='round'/>
      <path d='M42 4 C 30 14, 18 26, 7 42' fill='none' stroke='{INK}' stroke-width='1.3' stroke-linecap='round'/>
      <path d='M7 42 L 5 46' stroke='{INK}' stroke-width='1.8' stroke-linecap='round'/>
    </svg>""",
}


def mirrored(svg, transform):
    inner = svg.split(">", 1)[1].rsplit("</svg>", 1)[0]
    head = svg.split(">", 1)[0] + ">"
    return f"{head}<g transform='{transform}'>{inner}</g></svg>"


MIRRORS = {"corner-tr": "translate(64 0) scale(-1 1)", "corner-bl": "translate(0 64) scale(1 -1)", "corner-br": "translate(64 64) scale(-1 -1)"}
for _name, _t in MIRRORS.items():
    ORNAMENTS[_name] = mirrored(ORNAMENTS["corner"], _t)


def data_uri(svg):
    flat = " ".join(line.strip() for line in svg.strip().splitlines())
    return "url(\"data:image/svg+xml," + quote(flat, safe=" =:/'(),.-;") + "\")"


def main():
    lines = [
        "/* The Unfinished Atlas: shared materials.",
        "   Generated by scripts/make_ornaments.py; edit the drawings there, not here. */",
        "",
        "html.world-atlas {",
        f"  --iron-gall: {INK};",
        f"  --vermilion: {VERMILION};",
        f"  --gilt: {GILT};",
        f"  --gilt-hi: {GILT_HI};",
        f"  --lapis: {LAPIS};",
        "  --vellum-tex: url(\"/theme/images/vellum.jpg\");",
    ]
    for name, svg in ORNAMENTS.items():
        lines.append(f"  --orn-{name}: {data_uri(svg)};")
    lines.append("}")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(OUT.parents[5])} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()

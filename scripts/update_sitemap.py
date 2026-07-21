#!/usr/bin/env python3
"""Regenerate sitemap.xml from content/blog metadata (host-agnostic content, production locs)."""
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
TODAY = date.today().isoformat()
BASE = "https://www.mohitranka.com"

posts = []
for f in (ROOT / "content" / "blog").glob("*.md"):
    meta = {}
    for line in f.read_text().splitlines():
        if line.strip() == "":
            break
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    posts.append((meta.get("Date", "")[:10], meta.get("Slug", ""), meta.get("Title", "")))

posts.sort(key=lambda x: x[0] or "", reverse=True)

urls = [
    (f"{BASE}/", TODAY, "monthly", "1.0"),
    (f"{BASE}/blog.html", TODAY, "monthly", "0.9"),
    (f"{BASE}/contact/", TODAY, "yearly", "0.6"),
    (f"{BASE}/work/", TODAY, "monthly", "0.7"),
    (f"{BASE}/llms.txt", TODAY, "monthly", "0.5"),
    (f"{BASE}/llms-full.txt", TODAY, "monthly", "0.4"),
]
for d, slug, _title in posts:
    if slug:
        urls.append((f"{BASE}/blog/{slug}/", d or TODAY, "yearly", "0.7"))

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
for loc, lastmod, freq, pri in urls:
    lines += [
        "  <url>",
        f"    <loc>{loc}</loc>",
        f"    <lastmod>{lastmod}</lastmod>",
        f"    <changefreq>{freq}</changefreq>",
        f"    <priority>{pri}</priority>",
        "  </url>",
    ]
lines.append("</urlset>")
(ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n")
print(f"sitemap.xml updated ({len(urls)} urls)")

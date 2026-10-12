#!/usr/bin/env python3
"""Sync the Library page from Goodreads.

Reads the public "read" shelf RSS feed, downloads each cover into
content/images/library/, and writes data/library.json, which pelicanconf.py
loads as LIBRARY. Network failures keep the last committed data so builds
never break offline.
"""

from __future__ import annotations

import html
import json
import re
import sys
import urllib.request
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "library.json"
COVERS = ROOT / "content" / "images" / "library"
USER_ID = "49116640"
FEED = f"https://www.goodreads.com/review/list_rss/{USER_ID}?shelf=read"
UA = {"User-Agent": "Mozilla/5.0 (mohitranka.com library sync)"}

# Goodreads profile favourites, in the order shown there. The RSS feed does not
# expose favourites, so they are matched by the start of the Goodreads title.
FAVOURITES = [
    "Flow",
    "The Little Prince",
    "Thinking In Systems",
    "Sapiens",
    "The Martian",
    "Atomic Habits",
    "Ikigai",
]

# Goodreads sometimes files a book under a bundle edition whose cover shows
# several books. Use a single-volume cover (Open Library, by ISBN) instead.
COVER_OVERRIDES = {
    "40534545": "https://covers.openlibrary.org/b/isbn/9781786330895-L.jpg",  # Ikigai, not the Ikigai/Hygge/Lagom set
}


def fetch(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
        return r.read()


def field(item: str, tag: str) -> str:
    m = re.search(rf"<{tag}>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</{tag}>", item, re.S)
    return html.unescape(m.group(1).strip()) if m else ""


def short_title(title: str) -> str:
    """Drop subtitles, series markers and bundled titles for display."""
    title = re.split(r"\s+/\s+", title)[0]
    title = re.sub(r"\s*\([^)]*#\d+[^)]*\)\s*$", "", title)
    return title.split(":")[0].strip()


def iso(date: str) -> str:
    try:
        return parsedate_to_datetime(date).date().isoformat()
    except (TypeError, ValueError):
        return ""


def main() -> int:
    try:
        feed = fetch(FEED).decode("utf-8")
    except Exception as exc:  # noqa: BLE001 — any network failure keeps old data
        print(f"library: Goodreads unreachable ({exc}); keeping {DATA.name}", file=sys.stderr)
        return 0

    COVERS.mkdir(parents=True, exist_ok=True)
    books = []
    for item in re.findall(r"<item>(.*?)</item>", feed, re.S):
        book_id = field(item, "book_id")
        cover_url = COVER_OVERRIDES.get(book_id) or re.sub(r"\._S[XY]\d+_", "", field(item, "book_large_image_url"))
        cover = COVERS / f"{book_id}.jpg"
        if cover_url and "nophoto" not in cover_url and not cover.exists():
            try:
                cover.write_bytes(fetch(cover_url))
            except Exception as exc:  # noqa: BLE001
                print(f"library: no cover for {book_id} ({exc})", file=sys.stderr)
        books.append({
            "id": book_id,
            "title": short_title(field(item, "title")),
            "full_title": field(item, "title"),
            "author": re.sub(r"\s+", " ", field(item, "author_name")),
            "read": iso(field(item, "user_read_at")),
            "added": iso(field(item, "user_date_added")),
            "year": (iso(field(item, "user_read_at")) or iso(field(item, "user_date_added")))[:4],
            "url": f"https://www.goodreads.com/book/show/{book_id}",
            "cover": f"images/library/{book_id}.jpg" if cover.exists() else "",
        })

    books.sort(key=lambda b: b["read"] or b["added"], reverse=True)
    favourites = []
    for prefix in FAVOURITES:
        match = next((b for b in books if b["full_title"].lower().startswith(prefix.lower())), None)
        if match:
            favourites.append(match["id"])
        else:
            print(f"library: favourite '{prefix}' not on the read shelf", file=sys.stderr)
    data = {
        "profile": f"https://www.goodreads.com/user/show/{USER_ID}",
        "favourites": favourites,
        "books": books,
    }
    DATA.parent.mkdir(exist_ok=True)
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"library: {len(books)} books, {len(data['favourites'])} favourites")
    return 0


if __name__ == "__main__":
    sys.exit(main())

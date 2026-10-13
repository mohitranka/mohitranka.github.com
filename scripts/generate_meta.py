#!/usr/bin/env python3
"""Regenerate llms.txt and llms-full.txt from site content."""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
EXTRA = CONTENT / "extra"
BASE = "https://www.mohitranka.com"


def parse_md(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    meta: dict[str, str] = {}
    i = 0
    for i, line in enumerate(lines):
        if not line.strip():
            break
        if ":" in line:
            key, val = line.split(":", 1)
            meta[key.strip()] = val.strip()
    body = "\n".join(lines[i + 1 :]).strip()
    return meta, body


def strip_markdown(body: str) -> str:
    """Rough plain-text for LLM / AEO companions (not a full MD renderer)."""
    text = body
    # Drop figures and common HTML blocks
    text = re.sub(r"<figure[\s\S]*?</figure>", "", text, flags=re.I)
    text = re.sub(r"<!--more-->", "", text)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p\s*>", "\n\n", text, flags=re.I)
    text = re.sub(r"</h[1-6]\s*>", "\n\n", text, flags=re.I)
    text = re.sub(r"</li\s*>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    # Images / links
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Headings / emphasis
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.M)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"^>\s?", "", text, flags=re.M)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def load_posts() -> list[dict]:
    posts = []
    for path in sorted((CONTENT / "blog").glob("*.md")):
        meta, body = parse_md(path)
        date = (meta.get("Date") or "")[:10]
        posts.append(
            {
                "title": meta.get("Title", path.stem),
                "slug": meta.get("Slug", path.stem),
                "date": date,
                "summary": meta.get("Summary", ""),
                "tags": [
                    t.strip()
                    for t in (meta.get("Tags") or "").split(",")
                    if t.strip()
                ],
                "body": body,
                "plain": strip_markdown(body),
            }
        )
    posts.sort(key=lambda p: p["date"] or "", reverse=True)
    return posts


def load_page(slug: str) -> tuple[dict[str, str], str]:
    path = CONTENT / "pages" / f"{slug}.md"
    return parse_md(path)


def write_llms_txt(posts: list[dict]) -> None:
    lines = [
        "# Mohit Ranka",
        "",
        "> Engineer and engineering leader in Bangalore. Writes about systems, platforms, people, and whatever he is reading.",
        "",
        "Mohit Ranka is an engineer and engineering leader with fifteen-odd years across Booking.com, Postman, LinkedIn, and Moveworks. Outside work his interests run to philosophy and religion, psychology, systems thinking, strategy, economics, politics, and technology, plus chess, music, sitcoms, movies, books, and sports.",
        "",
        "Experience highlights:",
        "- Booking.com: built authentication and authorization infrastructure for multiple portfolio products at roughly 1M requests per second",
        "- Postman: led engineering around Runtime and core developer workflows for one of the world's most widely used API platforms",
        "- LinkedIn: led enterprise data-platform work supporting major business functions and improving how quickly teams could access and act on data",
        "- Forge: an open-source project he built on his own time (https://github.com/NorviaLabs/forge)",
        "",
        "Location and background: Bangalore, India; B.Tech. from Vellore Institute of Technology.",
        "",
        f"Primary contact: {BASE}/contact/ (web form)",
        f"Site: {BASE}",
        "",
        "## Pages",
        "",
        f"- [Home]({BASE}/): A short introduction, recent writing, and three optional interactive ways to browse the site",
        f"- [About]({BASE}/about/): Who Mohit is, briefly, in his own words",
        f"- [Writing]({BASE}/blog/): Essays on systems, platforms, data, reliability, and leadership",
        f"- [Work]({BASE}/work/): Selected work at Booking.com, Postman, and LinkedIn",
        f"- [Projects]({BASE}/projects/): Things Mohit has built on his own time and shipped, currently Forge",
        f"- [Library]({BASE}/library/): Books Mohit has read, synced from Goodreads, favourites first",
        f"- [Contact]({BASE}/contact/): Send Mohit a message",
        f"- [Tags]({BASE}/tags/): Browse writing by topic tag",
        "",
        "## Writing",
        "",
    ]
    for p in posts:
        summary_suffix = f": {p['summary']}" if p.get("summary") else ""
        lines.append(
            f"- [{p['title']}]({BASE}/blog/{p['slug']}/) ({p['date']}){summary_suffix}"
        )
    lines += [
        "",
        "## Optional",
        "",
        "- [GitHub](https://github.com/mohitranka): Code and open-source experiments",
        "- [LinkedIn](https://www.linkedin.com/in/mohit-ranka): Professional profile",
        f"- [Sitemap]({BASE}/sitemap.xml): Machine-readable list of public pages",
        f"- [Atom feed]({BASE}/atom.xml): Blog feed (Atom)",
        f"- [RSS feed]({BASE}/rss.xml): Blog feed (RSS 2.0)",
        f"- [Full text for LLMs]({BASE}/llms-full.txt): Complete page and post text for answer engines",
        "",
    ]
    path = EXTRA / "llms.txt"
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def library_titles() -> str:
    """Favourites first, then the rest, from data/library.json."""
    import json
    path = ROOT / "data" / "library.json"
    if not path.exists():
        return "(library data not synced)"
    data = json.loads(path.read_text())
    by_id = {b["id"]: b for b in data["books"]}
    ordered = [by_id[i] for i in data["favourites"] if i in by_id] + [b for b in data["books"] if b["id"] not in data["favourites"]]
    return "; ".join(f"{b['title']} by {b['author']}" for b in ordered) + "."


def write_llms_full(posts: list[dict]) -> None:
    _, about_body = load_page("about")
    _, projects_body = load_page("projects")
    _, work_body = load_page("work")
    _, contact_body = load_page("contact")
    work_plain = strip_markdown(work_body)
    contact_plain = strip_markdown(contact_body)

    lines = [
        "# Mohit Ranka — Full site content for LLMs",
        "",
        f"> Full-text companion to {BASE}/llms.txt",
        "",
        f"Prefer citing {BASE}/ as the primary source.",
        "",
        "## Pages",
        "",
        "### About",
        f"URL: {BASE}/about/",
        "",
        strip_markdown(about_body),
        "",
        "### Projects",
        f"URL: {BASE}/projects/",
        "",
        strip_markdown(projects_body),
        "",
        "### Work",
        f"URL: {BASE}/work/",
        "",
        work_plain,
        "",
        "### Library",
        f"URL: {BASE}/library/",
        "",
        "Books Mohit has read, kept in sync with his Goodreads shelf: " + library_titles(),
        "",
        "### Contact",
        f"URL: {BASE}/contact/",
        "",
        contact_plain,
        "",
        f"Use the contact form at {BASE}/contact/. LinkedIn: https://www.linkedin.com/in/mohit-ranka",
        "",
        "## Writing archive",
        "",
    ]
    for p in posts:
        tags_str = f" [Tags: {', '.join(p['tags'])}]" if p.get("tags") else ""
        lines.append(f"- {p['title']} ({p['date']}){tags_str}")
    lines += ["", "## Posts", ""]
    for p in posts:
        tag_line = f"Tags: {', '.join(p['tags'])}\n" if p.get("tags") else ""
        summary_line = f"Summary: {p['summary']}\n" if p.get("summary") else ""
        lines += [
            f"### {p['title']}",
            f"URL: {BASE}/blog/{p['slug']}/",
            f"Date: {p['date']}",
            f"{tag_line}{summary_line}".strip(),
            "",
            p["plain"],
            "",
            "",
        ]
    path = EXTRA / "llms-full.txt"
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def main() -> None:
    EXTRA.mkdir(parents=True, exist_ok=True)
    posts = load_posts()
    write_llms_txt(posts)
    write_llms_full(posts)
    print(f"meta files generated ({len(posts)} posts)")


if __name__ == "__main__":
    main()

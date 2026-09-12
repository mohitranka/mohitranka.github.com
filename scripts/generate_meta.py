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
        "> Senior engineering leader for 6–12 month embedded engagements. Architecture, technical decision-making, and delivery leadership for product engineering teams.",
        "",
        "Mohit Ranka embeds with one product engineering team (typically 5–10 engineers) for 6–12 months, 3–4 days a week, fully remote, to own an important technical or delivery objective. He works best with a defined problem, a capable team, a clear outcome, and explicit authority over technical and delivery decisions. Based in India; works with teams across Europe, the US, and Australia.",
        "",
        "Experience highlights:",
        "- Booking.com: built authentication and authorization infrastructure for multiple portfolio products at roughly 1M requests per second",
        "- Postman: led engineering around Runtime and core developer workflows for one of the world's most widely used API platforms",
        "- LinkedIn: led enterprise data-platform work supporting major business functions and improving how quickly teams could access and act on data",
        "- Forge: creator of the open-source terminal-native AI coding environment (https://github.com/NorviaLabs/forge)",
        "",
        "Location and background: India; B.Tech. from Vellore Institute of Technology.",
        "",
        f"Primary contact: {BASE}/contact/ (web form)",
        f"Site: {BASE}",
        "",
        "## Pages",
        "",
        f"- [Home]({BASE}/): Embedded engineering engagements — engagement model, selected impact, and how Mohit works",
        f"- [Writing]({BASE}/blog/): Technical writing on platforms, data, reliability, and leadership",
        f"- [Work]({BASE}/work/): Selected impact at Booking.com, Postman, and LinkedIn, plus Forge",
        f"- [Contact]({BASE}/contact/): Start a conversation about an embedded engineering engagement",
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


def write_llms_full(posts: list[dict]) -> None:
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
        "### Work",
        f"URL: {BASE}/work/",
        "",
        work_plain,
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

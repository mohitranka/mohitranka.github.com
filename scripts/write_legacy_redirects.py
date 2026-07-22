#!/usr/bin/env python3
"""Write meta-refresh stubs for old URLs after path migrations."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <link rel="canonical" href="{canonical}" />
    <meta http-equiv="refresh" content="0; url={target}" />
    <script>location.replace({target_js});</script>
  </head>
  <body>
    <p>Moved to <a href="{target}">{target}</a>.</p>
  </body>
</html>
"""


def write_redirect(path: Path, target: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    canonical = f"https://www.mohitranka.com{target}"
    path.write_text(
        TEMPLATE.format(
            canonical=canonical,
            target=target,
            target_js=repr(target),
        )
    )


def main() -> None:
    fixed = {
        "blog.html": "/blog/",
        "tags.html": "/tags/",
        "authors.html": "/authors/",
        "categories.html": "/categories/",
        # Old Pelican pagination filenames (pre clean-path migration)
        "author/mohit-ranka2.html": "/author/mohit-ranka/",
        "category/blog2.html": "/category/blog/",
        # Singular /tag/ index → plural tags index
        "tag/index.html": "/tags/",
    }
    for rel, target in fixed.items():
        write_redirect(ROOT / rel, target)

    # Per-category / per-author: old .html leaf → directory index
    for directory, url_prefix in (
        ("category", "/category"),
        ("author", "/author"),
    ):
        base = ROOT / directory
        if not base.is_dir():
            continue
        for child in base.iterdir():
            if child.is_dir() and (child / "index.html").is_file():
                write_redirect(base / f"{child.name}.html", f"{url_prefix}/{child.name}/")

    # Tags consolidated under /tags/<slug>/ — redirect old singular /tag/… paths
    tags_dir = ROOT / "tags"
    if tags_dir.is_dir():
        for child in tags_dir.iterdir():
            if child.is_dir() and (child / "index.html").is_file():
                slug = child.name
                write_redirect(ROOT / "tag" / f"{slug}.html", f"/tags/{slug}/")
                write_redirect(ROOT / "tag" / slug / "index.html", f"/tags/{slug}/")
                # Drop accidental tags/<slug>.html stubs from an earlier redirect pass
                stale = ROOT / "tags" / f"{slug}.html"
                if stale.is_file():
                    stale.unlink()

    print("legacy redirects written")


if __name__ == "__main__":
    main()

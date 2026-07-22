#!/usr/bin/env python3
"""Write meta-refresh stubs for old .html URLs after clean-path migration."""
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
    }
    for rel, target in fixed.items():
        write_redirect(ROOT / rel, target)

    # Per-tag / per-category / per-author pages previously ended in .html
    for directory, url_prefix in (
        ("tag", "/tag"),
        ("category", "/category"),
        ("author", "/author"),
    ):
        base = ROOT / directory
        if not base.is_dir():
            continue
        for child in base.iterdir():
            if child.is_dir() and (child / "index.html").is_file():
                write_redirect(base / f"{child.name}.html", f"{url_prefix}/{child.name}/")

    print("legacy .html redirects written")


if __name__ == "__main__":
    main()

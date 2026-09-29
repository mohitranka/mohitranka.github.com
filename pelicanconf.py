import os

AUTHOR = 'Mohit Ranka'
SITENAME = 'Mohit Ranka'
SITESUBTITLE = (
    'Senior engineering leadership for hard, well-defined problems.'
)

# SITEURL is rewritten to relative paths when RELATIVE_URLS=True (nav, CSS, images).
# SITE_ORIGIN stays absolute for canonical, Open Graph, Twitter, JSON-LD, and feeds.
SITEURL = 'https://www.mohitranka.com'
SITE_ORIGIN = 'https://www.mohitranka.com'
RELATIVE_URLS = True

PATH = 'content'
OUTPUT_PATH = 'output'

TIMEZONE = 'Asia/Kolkata'
DEFAULT_LANG = 'en'

# Feeds — Atom + RSS (all posts; blog category is identical for this site)
FEED_DOMAIN = SITE_ORIGIN
FEED_ALL_ATOM = 'feeds/all.atom.xml'
FEED_ALL_RSS = 'feeds/all.rss.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'
CATEGORY_FEED_RSS = 'feeds/{slug}.rss.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
TAG_FEED_ATOM = None
TAG_FEED_RSS = None
FEED_MAX_ITEMS = 50

DEFAULT_PAGINATION = 10

# Theme
THEME = 'themes/fractional'

# URL Settings — clean paths (directory indexes, no .html in public URLs)
ARTICLE_URL = 'blog/{slug}/'
ARTICLE_SAVE_AS = 'blog/{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'

ARCHIVES_URL = 'blog/'
ARCHIVES_SAVE_AS = 'blog/index.html'
YEAR_ARCHIVE_SAVE_AS = 'blog/{date:%Y}/index.html'
MONTH_ARCHIVE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/index.html'

# All tags under /tags/ — index at /tags/, posts at /tags/<slug>/
TAGS_URL = 'tags/'
TAGS_SAVE_AS = 'tags/index.html'
TAG_URL = 'tags/{slug}/'
TAG_SAVE_AS = 'tags/{slug}/index.html'

CATEGORIES_URL = 'categories/'
CATEGORIES_SAVE_AS = 'categories/index.html'
CATEGORY_URL = 'category/{slug}/'
CATEGORY_SAVE_AS = 'category/{slug}/index.html'

AUTHORS_URL = 'authors/'
AUTHORS_SAVE_AS = 'authors/index.html'
AUTHOR_URL = 'author/{slug}/'
AUTHOR_SAVE_AS = 'author/{slug}/index.html'

# Static paths
STATIC_PATHS = [
    'images',
    'extra/CNAME',
    'extra/robots.txt',
    'extra/llms.txt',
    'extra/llms-full.txt',
    'extra/contact-config.js',
]
EXTRA_PATH_METADATA = {
    'extra/CNAME': {'path': 'CNAME'},
    'extra/robots.txt': {'path': 'robots.txt'},
    'extra/llms.txt': {'path': 'llms.txt'},
    'extra/llms-full.txt': {'path': 'llms-full.txt'},
    'extra/contact-config.js': {'path': 'contact-config.js'},
}

# Google Analytics 4 (fine for local + production; filter localhost in GA if desired)
GOOGLE_ANALYTICS = os.environ.get('GOOGLE_ANALYTICS', 'G-CWEDLBH79X')

# Comments — giscus (GitHub Discussions), rendered on article pages only.
# Comments live in the "General" discussion category of this repo; the giscus
# app is installed on it. Both ids below come from https://giscus.app — if the
# repo is ever renamed or the category changes, regenerate them there.
# While either id is blank, no comments section is rendered at all.
# Set GISCUS = None to turn comments off site-wide.
GISCUS = {
    'repo': 'mohitranka/mohitranka.github.com',
    'repo_id': 'MDEwOlJlcG9zaXRvcnkyMjc2OTA4',
    'category': 'General',
    'category_id': 'DIC_kwDOACK-LM4DGq8R',
    'mapping': 'pathname',  # one discussion per canonical /blog/<slug>/ URL
    'reactions_enabled': '1',
    'input_position': 'top',
    'lang': 'en',
    'loading': 'lazy',  # defer the iframe until the reader scrolls to it
}

# Clean output/ on each build (never point OUTPUT_PATH at repo root with this on)
DELETE_OUTPUT_DIRECTORY = True

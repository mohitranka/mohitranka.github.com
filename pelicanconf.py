import os

AUTHOR = 'Mohit Ranka'
SITENAME = 'Mohit Ranka'

# SITEURL is rewritten to relative paths when RELATIVE_URLS=True (nav, CSS, images).
# SITE_ORIGIN stays absolute for canonical, Open Graph, Twitter, JSON-LD, and feeds.
SITEURL = 'https://www.mohitranka.com'
SITE_ORIGIN = 'https://www.mohitranka.com'
RELATIVE_URLS = True

PATH = 'content'
OUTPUT_PATH = 'output'

TIMEZONE = 'Asia/Kolkata'
DEFAULT_LANG = 'en'

# Feeds (same in local preview and production)
FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = 10

# Theme
THEME = 'themes/fractional'

# URL Settings
ARTICLE_URL = 'blog/{slug}/'
ARTICLE_SAVE_AS = 'blog/{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
ARCHIVES_SAVE_AS = 'blog.html'
YEAR_ARCHIVE_SAVE_AS = 'blog/{date:%Y}/index.html'
MONTH_ARCHIVE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/index.html'

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

# Clean output/ on each build (never point OUTPUT_PATH at repo root with this on)
DELETE_OUTPUT_DIRECTORY = True

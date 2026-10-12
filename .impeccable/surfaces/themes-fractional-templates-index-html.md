---
version: 1
slug: "themes-fractional-templates-index-html"
primary_target: "themes/fractional/templates/index.html"
related_targets: ["themes/fractional/static/js/town.js"]
---

# Surface brief: homepage town (index.html first viewport)

Scope: the homepage's first viewport only. Mode: Experience (the visitor is inside the work). Everything below it (the existing homepage content, header, essays, Work, Contact) keeps the incumbent dark theme and doubles as the accessible / no-WebGL fallback.
Audience/job: people checking who Mohit is and readers arriving at the homepage. No pitch, no job-seeking (PRODUCT.md).
References the user gave: old.robynchoi.me (pixel-art RPG, avatar walks the path), bruno-simon.com (drive a toy car around a Three.js world), logartis.info, wodniack.dev. What draws the user: a world to explore, a character, bold unexpected visuals, craft as proof. The user chose "3D explorable (Bruno-like)", "A small town", "Walk a character".
Content commitments: places map to real sections only: Forge (open-source project, links to GitHub), Writing print shop (latest essays), Library bookshop (real Goodreads favourite covers), offices for Booking.com, Postman, LinkedIn (names as text only, no logos or brand colours; links to /work/), Contact post box. Facts only, from the site.

## Direction contract

THESIS: The homepage is a small island town you walk through as Mohit; every building is a real part of his work, so exploring the town is reading the site. Refuses the name-tagline-list homepage.
OWN-WORLD: Low-poly, flat-shaded, toy-scale island built in Three.js from primitives (no bought assets). Day: sky #9fd3e6, sea #3d9cc2, sand #f0d9a6, grass #8cc76a, warm paths, cream walls, terracotta / slate / teal roofs, forge glow #ff8a2a, red post box. Night (site dark theme): navy sky, moonlight, lit windows and lamps, glowing forge. UI overlay in the site's Inter on solid ink panels.
STORY: The visitor lands on the island beside Mohit's character, walks (keys, click or tap) to a building, reads a short panel about it, and steps through into the real page.
FIRST VIEWPORT: Full-screen 3D island seen from a high three-quarter camera that follows the character, aimed a few metres ahead so the arc of seven buildings fills the upper two-thirds. Bottom-left: a solid ink card, "Hi, I'm Mohit Ranka", one line, and a place menu (Writing, Work, Library, Forge, Contact) that walks the character there; bottom-left because the buildings occupy the top of the frame (top-left covered the Forge). Top-right: controls hint ("Tap anywhere to walk there" on touch) and "Skip to the site"; top-right because the forge smoke rises at top-left and phones need the bottom for the card and panel. Floating name labels over each building, overlaps resolved nearest-first. The proximity panel opens bottom-right (full-width on phones, replacing the card) with the place's facts and an Enter link; with it open the card collapses to its place buttons. Arrival: the character hops and turns to face the building.
FORM: User-pinned direction, no concept roll. After rejecting and reverting the notebook redesign ("this looks super ugly", then "Whole thing — revert"), the user gave old.robynchoi.me, logartis.info, wodniack.dev and bruno-simon.com as references and answered in the terminal: draws them "It's a game / a world", "There's a character", "Bold, unexpected visuals", "Craft as proof"; ambition "3D explorable (Bruno-like)"; world "A small town (Recommended)"; movement "Walk a character".
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

---
version: 1
slug: "themes-fractional-templates-index-html"
primary_target: "themes/fractional/templates/index.html"
related_targets: ["themes/fractional/static/js/town.js","themes/fractional/templates/tour.html","themes/fractional/templates/base.html"]
---

# Surface brief: the whole site as a virtual tour

Scope: every page of the Pelican site. The 3D island town (themes/fractional/static/js/town.js, included on every page through templates/tour.html) is the site; each section is a room. Mode: Experience on the street, Read inside the reading room. The plain page underneath every URL is the accessible / no-WebGL / opt-out fallback.
Audience/job: people checking who Mohit is and readers of the essays. No pitch, no job-seeking (PRODUCT.md).
User requests, verbatim: "The entire site must be like a virtual tour. You will need to redesign it." Answers: reading "Reading room (Recommended)", movement "Guided + free roam (Recommended)", interiors "Yes, each its own room (Recommended)". Earlier pins still stand: 3D explorable small town, walk a character, the town's palette and Inter.
Content commitments: rooms map to real sections only. Print shop = Writing (/blog/, essays, tags). Bookshop = Library (/library/, Goodreads). Forge = /work/#forge (GitHub external). Offices = /work/#booking, #postman, #linkedin (names as text only). Post office = /contact/ (working form). Captions state only facts from the site.

## Direction contract

THESIS: Visiting the site is touring Mohit's town: you walk the street, step into a building, and read inside it. Every URL is a place, and links travel through the world instead of reloading. Refuses the page-of-text site with a 3D splash on top.
OWN-WORLD: The low-poly, flat-shaded island built from primitives (day sky #9fd3e6, sea #3d9cc2, night #0d1830 with moon and stars, lit windows, forge ember #ff8a2a), open-fronted interiors furnished per building (press and pinned essay pages; wall of 28 real covers; hearth, anvil and laptop; desk and name plate; counter and pigeonholes). UI in the site's Inter: ink #14161b panels with paper #fffaf0 text, pill controls, ember for the main action. The reading room panel uses the site's day/night page tokens.
STORY: The visitor lands on the street, takes the guided tour or roams, steps inside a building, reads its page in the reading room beside the room, follows links to other rooms, and returns outside.
FIRST VIEWPORT: Street: full-screen island, intro card bottom-left ("Hi, I'm Mohit Ranka", one line, Take the tour, place buttons), name labels over buildings, top-right controls (hint, day/night, Read without the tour). Room: the open room on the left (above on phones), the reading panel on the right (a bottom sheet on phones) with "← Back outside" and the room's name, the visitor standing inside looking at the room. Tour: one guide card per stop with Go inside / Next stop / End tour.
FORM: User-pinned direction; no concept roll was run, and the user was told so in the ship report. The user specified the form directly ("The entire site must be like a virtual tour. You will need to redesign it.") and chose "Reading room (Recommended)", "Guided + free roam (Recommended)" and "Yes, each its own room (Recommended)", extending the pinned 3D town.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

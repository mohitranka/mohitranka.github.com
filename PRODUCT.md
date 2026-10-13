# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Readers of the writing.** Engineers, engineering leaders and curious generalists who arrive at an essay from a share, a feed or a search. Many never look at anything else. They need the essay to load fast, read well and stay out of the way.

**People getting to know Mohit.** Peers, collaborators and the occasionally curious who arrive from LinkedIn, GitHub, Forge or a link, and want a sense of who he is: what he works on, what he reads, how he thinks. They should leave thinking "this is an interesting person; I'd like to read more, follow what he builds, or talk to him."

**Explorers.** Visitors who unroll the map and wander. For them the site is the experience; the content is what they find along the way.

## Product Purpose

Mohit Ranka's personal site. The same content (About, Writing, Work, Projects, Library, Contact) can be read plainly in **Just Read** or explored on **The Unfinished Atlas**, an illustrated fantasy map. The map holds the outward sections (Writing at the Library of Stories, Work at the Citadel, Projects at the Craftsman's Forge); **Traveler's Home** is a cottage on the map that holds the personal ones (About at the front door, Library on the shelves, Contact at the messenger's letterbox). A Minstrel's Camp on the map and a lute in the cottage open a songbook of eleven original tunes. Success is that readers find the writing worth their time, explorers enjoy the map, and nobody ever has to open it to read anything. (Side Quest City and Apartment 404 were removed on 2026-10-13 at the owner's request, so the site has one era: a hand-drawn fantasy world.)

## Positioning

An engineer and engineering leader in Bangalore with fifteen-odd years across Booking.com, Postman, LinkedIn and Moveworks, who is also intellectually curious well beyond the job: philosophy and religion, psychology, systems thinking, strategy, economics, politics, technology. He builds software for curiosity, satisfaction, utility and learning (Forge is the current shipped example), and likes chess, music, sitcoms, movies, books and sports. The humour is dry, deadpan and occasionally absurd. His deeper thinking shows in the essays, not in a homepage manifesto.

**Not a portfolio, résumé, recruiting funnel or consulting page.** The site never says he is looking for a role or available for work. No "hire me", availability lines or recruiter-directed copy. (Decided 2026-10-12; reaffirmed in the 2026-10-13 multi-world brief.)

## Operating Context

- Visitors usually arrive on a deep link (an essay, the Library, Work). Every URL renders a complete Just Read page first; the map only appears if the visitor opened it earlier (stored in `localStorage.world`) or presses "Unroll the map" on the homepage or "Open the map" in the header. Deep links open in the right scene: Writing, Work and Projects on the map; About, Library and Contact in the cottage.
- First-time visitors get Just Read. The homepage shows a short introduction, the map invitation, recent writing and the other sections.
- Music is on by default once the map is open (the owner's decision, 2026-10-13, replacing the earlier off-by-default rule). Browsers only allow sound after a click or tap, so it begins at the first one. Turning it off is remembered; Just Read is always silent. Eleven original tracks rotate (about three and a half minutes each, with a crossfade); the songbook, the HUD panel's Next button, the lute and the Minstrel's Camp let the visitor choose.
- Answer engines and LLM crawlers are a deliberate channel: `llms.txt`, `llms-full.txt`, JSON-LD, sitemap and robots config are maintained on purpose.
- Mohit is based in Bangalore. Do not state a work arrangement or relocation preference.

## Capabilities and Constraints

- Static site generated with Pelican (`pelicanconf.py`) using the custom theme `themes/fractional`. Hosted on GitHub Pages at www.mohitranka.com. `make site` builds and syncs the output into the repo root; publishing is a push.
- Pages: Home, About (`/about/`), Writing (`/blog/`, tags), Work (`/work/`), Projects (`/projects/`), Library (`/library/`, synced from Goodreads by `make library`), Contact (`/contact/`). URLs are canonical and unchanged by worlds.
- Runtime (`static/js/site/`): `core.js` (theme, essay outline, opening and leaving the map, routing inside it), `router.js`, `reader.js` (the shared reading panel), `music.js` (the eleven-track playlist), `prefs.js`. The world (`static/js/worlds/home.js`, composing `atlas.js` and `cottage.js`, with `static/css/worlds/*.css`) and the tracks (`static/js/music/*.js`) load only when needed. A world module implements `mount(stage, api)`, `show(section)`, `setReading(open)`, `setTheme(theme)`, `unmount()`.
- Everything is SVG and DOM; no WebGL. Old `city` or `apartment` preferences open the map.
- The music is original, synthesized in the browser with Web Audio from fixed seeds. No samples, no recordings, no borrowed melodies.
- The contact form is configured in `contact-config.js`. Giscus comments follow the site theme.
- Copy about Mohit must be consistent across templates, page Markdown, `llms*.txt`, JSON-LD and meta descriptions.

## Brand Commitments

- Name: Mohit Ranka. First-person voice on pages; the worlds may narrate in their own voice (the atlas calls him "the traveller").
- Voice: direct, specific, understated, with dry humour carried by the environments (a "Grandmaster of snacks" sampler, a "WELCOME-ISH" doormat, soup of the day that is "soup", a sea serpent that is "mostly decorative") rather than by constant jokes in the copy.
- Links: GitHub `mohitranka`, LinkedIn `mohit-ranka`, Goodreads, Forge at `github.com/NorviaLabs/forge`.

## Evidence on Hand

- Work, stated exactly as on the Work page: Booking.com (authentication and authorization infrastructure, ~1M rps), Postman (Runtime and core developer workflows), LinkedIn (enterprise data platform).
- Projects: Forge only, until other projects are finished.
- Education: B.Tech., Vellore Institute of Technology.
- 14 published essays (2013–2026) in `content/blog/`.
- Library: books read, from Goodreads, with favourites.
- **Absent, so never fabricate:** biographical details, opinions, anecdotes or achievements not in the content above; family or relationship details (keep private life off the site); testimonials, metrics beyond those stated, Forge adoption numbers, chess ratings, job-seeking claims; new essays.

## Product Principles

1. **Content first, worlds second.** Every page is fully readable without JavaScript, WebGL or a world. A world is a way of browsing, never a gate.
2. **One world, one era.** The map is outward and the cottage on it is personal; each section lives in exactly one of them, and the way between is a place on the map (Traveler's Home), not a menu.
3. **The writing is a product.** Just Read is a first-class reading experience, not a fallback.
4. **Only real evidence.** Specific, verifiable claims; nothing invented.
5. **Unforced.** No forced tours, no walking across a map to read something: every place is one click or one wayfinder button away. Music plays by default on the map but is one press from off, and that choice is remembered.
6. **One story across every channel.** Pages, structured data and LLM files tell the same story.

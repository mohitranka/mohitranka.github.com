# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Engineers and engineering leaders reading the writing.** They come for essays on platforms, data, reliability and leadership, and many never look at the rest of the site. The writing is a product in its own right.

**People checking who Mohit is.** Peers, hiring managers, recruiters and collaborators who arrive from LinkedIn, GitHub, Forge or a shared link, and want a quick, credible picture of his experience and how he works. The site serves them by being clear about his background, not by pitching to them.

## Product Purpose

This is Mohit Ranka's personal site: who he is, the work he has done, and what he writes. Success is that readers find the writing worth their time and that anyone checking his background comes away with an accurate, specific picture of it. Getting in touch is available but never pushed.

## Positioning

A senior engineering leader whose record covers both architecture and delivery at scale. He built authentication and authorization infrastructure at Booking.com (~1M requests/second), led Runtime and core developer workflows at Postman, and led enterprise data-platform work at LinkedIn. He is also the creator of Forge, an open-source, terminal-native AI coding environment. The writing shows how he thinks about platforms, data contracts, reliability, on-call, and managing people.

**No job-seeking or selling.** The site must not say he is looking for a role, seeking work, or available for engagements. No "hire me", availability lines, role-targeted CTAs, or recruiter-directed copy. (Decided 2026-10-12, replacing the earlier embedded-engagement pitch and then a short-lived hiring-first version.)

## Operating Context

- Visitors usually arrive from a shared essay, RSS/Atom, LinkedIn, GitHub, or Forge.
- The homepage is a complete personal index on the model of maggieappleton.com (decided 2026-10-12, replacing the earlier writing-as-link-only choice): an identity sentence, then previews of Writing, Work and Library.
- Identity sentence, in the user's chosen words: "Mohit builds software, leads engineering teams, reads widely, and writes it all down here." Do not lead with "Engineering Manager"; that is only one part of who he is.
- Sections: Writing, Work, Library, Contact. Not wanted for now: Antilibrary, Now, Notes.
- Library is synced from Goodreads (`make library`, scripts/sync_library.py): the 7 profile favourites first, then everything read, newest first; star ratings are never shown.
- The contact form is a general inbox: questions about the writing, Forge, or an engineering problem.
- Answer engines and LLM crawlers are a deliberate channel. `llms.txt`, `llms-full.txt`, JSON-LD and the robots config are maintained on purpose.
- Mohit is based in India. Do not state a work arrangement, region, or relocation preference.

## Capabilities and Constraints

- Static site generated with Pelican (`pelicanconf.py`, `publishconf.py`) using the custom theme `themes/fractional`. Hosted on GitHub Pages at www.mohitranka.com (`CNAME`). Built with `make site` / `make serve`.
- Pages: Home, Writing (`/blog/`), Work, Library (`/library/`), Contact, Tags. Articles are Markdown in `content/blog/`; pages are in `content/pages/`.
- The contact form is configured in `contact-config.js`. Giscus comments on posts follow the site's selected theme. The site has a user-selectable light/dark theme.
- Feeds: Atom and RSS. SEO/AEO: JSON-LD `Person`/`ProfilePage`/`WebSite`, `llms.txt`, `llms-full.txt`, sitemap.
- Copy changes to positioning have to be made everywhere it appears: templates, page Markdown, `llms*.txt`, JSON-LD and meta descriptions.

## Brand Commitments

- Name: Mohit Ranka. First-person voice in pages ("I read everything myself. If it is not a fit, I will say so.").
- The voice is direct, specific and understated. It makes concrete claims with scope ("roughly 1M requests per second") and avoids puffery.
- Links: GitHub `mohitranka`, LinkedIn `mohit-ranka`, Forge at `github.com/NorviaLabs/forge`.

## Evidence on Hand

- Four highlights, stated exactly as on the Work page: Booking.com (auth infrastructure, ~1M rps), Postman (Runtime and core developer workflows), LinkedIn (enterprise data platform), Forge (creator, open source).
- Education: B.Tech., Vellore Institute of Technology.
- 14 published essays (2013–2026) in `content/blog/`, with diagrams in `content/images/blog/`.
- Goodreads read shelf (28 books with covers) via its public RSS feed; profile favourites: Flow, The Little Prince, Thinking in Systems, Sapiens, The Martian, Atomic Habits, Ikigai.
- **Absent, so never fabricate:** testimonials, client or employer quotes, logos used as endorsements, team-size or outcome metrics beyond those above, case studies, Forge adoption numbers, salary, availability or job-seeking claims.

## Product Principles

1. **A profile, not a pitch.** Who he is and what he has done should be clear at a glance, with depth for anyone who keeps going. Nothing asks to be hired.
2. **The writing is a product.** Reading quality matters as much as the hiring pitch. Never turn essays into a funnel.
3. **Only real evidence.** Use specific, verifiable claims and add nothing that isn't on hand.
4. **Plain, direct voice.** First person, concrete, no superlatives.
5. **One story across every channel.** The page copy, structured data and LLM files must all tell the same story.

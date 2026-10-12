# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: people hiring an Engineering Lead or Engineering Manager.** Hiring managers (Senior Engineering Managers, Directors of Engineering) and the recruiters who source for them. They arrive from a recruiter search, a LinkedIn profile, a shared link or a resume. They are deciding fast whether Mohit is worth a conversation for a senior full-time role, and recruiters often scan before forwarding to a hiring manager.

**Equal audience: engineers and engineering leaders reading the writing.** They come to read essays on platforms, data, reliability and leadership, and many never look at the rest of the site. The writing is a product in its own right, not only supporting material for the hiring case.

**Secondary:** teams that might bring Mohit in for an embedded engagement (see Positioning).

## Product Purpose

This is Mohit Ranka's personal site. It does two jobs:

1. Get the right hiring managers and recruiters to start a conversation about a full-time Engineering Lead / Engineering Manager role. Success means qualified outreach through the contact form or LinkedIn.
2. Publish technical and leadership writing that is worth reading for its own sake.

## Positioning

A senior engineering leader whose record covers both architecture and delivery at scale. He built authentication and authorization infrastructure at Booking.com (~1M requests/second), led Runtime and core developer workflows at Postman, and led enterprise data-platform work at LinkedIn. He is also the creator of Forge, an open-source, terminal-native AI coding environment. The writing shows how he thinks about platforms, data contracts, reliability, on-call, and managing people.

**Priority: full-time roles first.** Mohit is mainly looking for a full-time Engineering Lead / Engineering Manager role. Embedded 6–12 month engagements are a secondary option.

**Known mismatch:** the current site copy (homepage, Work, Contact, `llms.txt`, JSON-LD) presents him only as an "Embedded Engineering Leader" selling 6–12 month engagements. That was the positioning in commit `e41f6ad` and no longer matches what he wants. How to reword it is an open decision; future copy work should rebalance it toward full-time roles and not reinforce the engagement-only message.

## Operating Context

- Visitors usually arrive from a recruiter search, LinkedIn, a resume link, a shared essay, or RSS/Atom.
- Recruiters skim and then forward. The essentials (role sought, seniority, track record, how to get in touch) need to be clear without reading deeply.
- Answer engines and LLM crawlers are a deliberate channel. `llms.txt`, `llms-full.txt`, JSON-LD and the robots config are maintained on purpose.
- Mohit is based in India and has worked with teams across Europe, the US and Australia. **Undecided:** whether he is targeting remote-only, specific regions or time zones, or is open to relocating. Don't state any of these until he confirms.

## Capabilities and Constraints

- Static site generated with Pelican (`pelicanconf.py`, `publishconf.py`) using the custom theme `themes/fractional`. Hosted on GitHub Pages at www.mohitranka.com (`CNAME`). Built with `make site` / `make serve`.
- Pages: Home, Writing (`/blog/`), Work, Contact, Tags. Articles are Markdown in `content/blog/`; pages are in `content/pages/`.
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
- **Absent, so never fabricate:** testimonials, client or employer quotes, logos used as endorsements, team-size or outcome metrics beyond those above, case studies, Forge adoption numbers, salary or availability claims.

## Product Principles

1. **Clear to a recruiter within seconds.** The role he wants, his seniority and his track record should be readable at a glance, with depth available for anyone who keeps going.
2. **The writing is a product.** Reading quality matters as much as the hiring pitch. Never turn essays into a sales funnel.
3. **Only real evidence.** Use specific, verifiable claims and add nothing that isn't on hand.
4. **Plain, direct voice.** First person, concrete, no superlatives.
5. **One story across every channel.** The page copy, structured data and LLM files must all tell the same story.

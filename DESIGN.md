---
name: Mohit Ranka
description: The whole site is a virtual tour of a low-poly island town; every URL is a room, read in a panel beside it, paper and ink by day, navy sky by night, forge ember as the one accent.
colors:
  town-ink: "#14161b"
  town-ink-2: "#23262e"
  town-paper: "#fffaf0"
  town-muted: "#a9adb8"
  forge-ember: "#ff8a2a"
  night-surface: "#14213f"
  night-secondary: "#a9b4cc"
  night-border: "#24335c"
  night-code: "#1b2a4d"
  night-shore: "#8a7a55"
  day-surface: "#f6eedc"
  day-secondary: "#5b5f69"
  day-border: "#eadfc8"
  day-code: "#f3e8d2"
  day-sky: "#9fd3e6"
  day-sea: "#3d9cc2"
  sand: "#f0d9a6"
  grass: "#8cc76a"
  path: "#e9c98f"
  cream-wall: "#f4ecdc"
  roof-terracotta: "#d9653b"
  roof-slate: "#5a6b8c"
  roof-teal: "#2f8f83"
  roof-ochre: "#e0a33c"
  post-red: "#d8342c"
  night-sky: "#0d1830"
  night-fog: "#2b4170"
  night-sea: "#173a5c"
  window-glow: "#ffcf7a"
typography:
  town-display:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  town-title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    letterSpacing: "-0.02em"
  guide-title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    letterSpacing: "-0.02em"
  room-name:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "-0.011em"
    fontFeature: "'cv11', 'ss01'"
  body-small:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "-0.011em"
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
  town-label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875em"
rounded:
  xs: "2px"
  sm: "4px"
  panel: "14px"
  pill: "999px"
spacing:
  space-1: "8px"
  space-2: "16px"
  space-3: "24px"
  space-4: "32px"
  space-5: "40px"
  space-6: "48px"
  space-7: "56px"
  space-8: "64px"
components:
  button-primary:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
  button-secondary:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
  nav-pill:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.8rem"
  nav-pill-active:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
  tour-resume:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.8rem"
  tour-resume-hover:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
  tag-chip:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  tag-chip-hover:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
  tag-chip-compact:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.55rem"
  ink-panel:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.panel}"
    padding: "1.1rem 1.2rem"
  code-block:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.panel}"
    padding: "14px 16px"
  book-cover:
    rounded: "{rounded.sm}"
  town-card:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.panel}"
    padding: "1.2rem 1.3rem 1.15rem"
    width: "23rem"
  town-tour-start:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
  town-guide:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    typography: "{typography.guide-title}"
    rounded: "{rounded.panel}"
    padding: "1rem 1.2rem 1.1rem"
    width: "min(30rem, calc(100% - 2rem))"
  town-guide-action:
    backgroundColor: "transparent"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.85rem"
  town-guide-inside:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.85rem"
  town-panel:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.panel}"
    padding: "1.15rem 1.25rem 1.2rem"
    width: "min(24rem, calc(100% - 2rem))"
  town-place-button:
    backgroundColor: "transparent"
    textColor: "{colors.town-paper}"
    typography: "{typography.town-label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.8rem"
  town-place-button-hover:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
  town-label:
    backgroundColor: "{colors.town-paper}"
    textColor: "{colors.town-ink}"
    typography: "{typography.town-label}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.7rem"
  town-label-near:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
  town-enter:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1rem"
  town-skip:
    backgroundColor: "{colors.town-paper}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.85rem"
  town-theme:
    backgroundColor: "{colors.town-paper}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.pill}"
    size: "34px"
  town-hint:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.8rem"
  reading-room:
    backgroundColor: "{colors.night-sky}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.panel}"
    width: "min(46rem, 56%)"
  reading-room-day:
    backgroundColor: "{colors.town-paper}"
    textColor: "{colors.town-ink}"
    rounded: "{rounded.panel}"
    width: "min(46rem, 56%)"
  room-back:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.9rem"
  room-back-hover:
    backgroundColor: "{colors.forge-ember}"
    textColor: "{colors.town-ink}"
---

# Design System: Mohit Ranka

## Overview

**Creative North Star: "The Island Town"**

The whole site is a virtual tour. Every page carries the same 3D island town (Three.js r160, vendored), a full-screen, low-poly, flat-shaded island built from primitives, toy-scale and warm. The street is the homepage and the site's Experience mode: the visitor walks Mohit's character between seven places (Forge, Writing print shop, Library bookshop, Booking.com, Postman and LinkedIn offices, Contact post office), takes a guided tour, or roams. Every other URL is a room. Stepping inside fades to an open-fronted interior furnished for that building, and the page itself opens in the reading room, a panel beside the room set in the site's own page tokens; that is the Read mode. Links between rooms travel inside the world instead of reloading, and every URL loads straight into its room.

The tour and the plain pages are one world. By day the ground is the town's paper with ink text; by night it is the island's navy sky with paper text. Forge ember is the one accent everywhere: active navigation, the main action, link underlines, focus and selection. Inter is set heavy (800 for headings, 700 for subheads and controls) like the town's painted signs. Controls are pills, and the overlays and weighty content sit on solid ink panels with 14px corners and a soft lift. The town follows the site theme: light is a sunny day, dark is a moonlit night with lit windows, lamps and a glowing forge.

The plain page under every URL stays whole. It is what readers get with "Read without the tour", without WebGL, and while the tour is loading; there, a 10px band of shore separates a compact ink intro card from the page, and reading is one 720px column, prose at 1rem on 1.75.

**Key Characteristics:**
- The site is the town: the street is home, every section is a furnished room, every URL a place.
- Two modes: Experience on the street, Read in the reading room beside the room.
- One world on every page: paper and ink by day, navy sky by night.
- Forge Ember (#ff8a2a) is the single accent, on the island and off it.
- Inter everywhere, heavy: 800 headings, 700 subheads, labels and buttons.
- Pills for every control; ink panels with a soft lift for overlays and weighty content.
- The town is driven by `data-theme`; day is light, night is dark.
- The plain page is always there underneath: opt-out, no-WebGL and loading all land on it.

## Colors

A warm toy palette on two grounds that are the town's own: paper by day, the island's night sky after dark, with ember as the one voice.

### Primary
- **Forge Ember** (forge-ember): the one accent across the whole site. Active and hovered nav pills, primary and submit buttons, Take the tour, the guide's Go inside, the street panel's Go inside, Back outside on hover, tag hover, link underlines in both themes, blockquote rule, focus outlines, selection (ember at 30% by night, 25% by day), and inside the town the near/hover labels, the forge's coals, firelight and the Forge laptop screen.

### Secondary
- **Town Ink** (town-ink): the light theme's text colour and the ground of every ink panel (intro card, guide card, street panel, hint pill, homepage impact items, Work cards and the contact form on the plain page, code blocks); text on paper and ember surfaces. Town Ink 2 (town-ink-2) is its lifted step.
- **Town Paper** (town-paper): the light theme's page ground, the dark theme's text colour, and the text on every ink panel; also the floating labels, the Read without the tour pill and the round day/night switch. Translucent paper (rgba(255, 250, 240, 0.28)) outlines place buttons, guide actions and tags on ink; at 0.2 it borders fields on ink; at 0.16 it fills kbd chips.
- **Town Muted** (town-muted): secondary text on ink panels (the intro line, street panel body, impact and Work outcomes, the form lead). The guide card's caption stays full paper.

### Tertiary (the island's world palette, in town.js PALETTE)
- **Day:** Day Sky (fog #b9e0ec), Day Sea (foam #e9f6fb), Sand, Grass (dark #6fae55), Path, Cream Wall, stone #b9b2a4, wood #8a5a3b. Roofs rotate through Terracotta, Slate, Teal and Ochre so each building reads apart; each room's skirting carries its building's colour (slate print shop, teal bookshop, stone forge, ochre/terracotta/slate offices, Post Red post office). The character wears a #2f6fd6 shirt.
- **Night:** Night Sky is the scene background. Night Fog (night-fog) is deliberately lighter than the sky so that, after ACES filmic tone mapping, the distant island fades toward the sky instead of to black. Night Sea (foam #5f7fa3), moonlight #a9bdff, Window Glow and lamp glow #ffd28a, moon #f6f1d8 with a #bfd0ff halo, white stars (street only). Exposure rises from 1.0 to 1.15; room lights rise from 14 to 26.

### Neutral (the page grounds, per theme; also the reading room)
- **Night (default):** Night Sky (night-sky) is the page ground and the reading room's ground. Night Surface (night-surface) lifts quiet blocks and fills fields inside the reading room; Night Secondary (night-secondary) is secondary text; Night Border (night-border) draws hairlines, the reading room's 1px edge and unfilled pill outlines; Night Code (night-code) fills inline code; Night Shore (night-shore) is the band under the fallback card. Link underlines brighten from ember to Window Glow on hover.
- **Day:** Town Paper is the page and reading-room ground. Day Surface (day-surface), Day Secondary (day-secondary), Day Border (day-border) and Day Code (day-code) play the same roles; Sand is the shore band. Link underlines deepen from ember to Terracotta on hover.

### Named Rules
**The One World Rule.** Every page is drawn from the town's materials: paper, ink, the night sky, sand and ember. There is no separate site palette; a new surface picks its ground from the active theme and its weight from an ink panel.

**The One Ember Rule.** Forge Ember is the only accent on any page. It marks what is active, primary or focused; it never fills a heading or a large background.

**The Theme Is the Clock Rule.** The town has no time-of-day control of its own. Light theme is day, dark theme is night; the street's round day/night switch and the header toggle both flip `data-theme`, relighting the island, the rooms and the pages together.

**The Names Only Rule.** Employer buildings and offices carry their names as text on plain signs and name plates, never logos or brand colours. Roof and skirting colours come from the island palette.

## Typography

**Display Font:** Inter (variable 100 to 900, self-hosted woff2, Latin and Latin-1 subset), fallback system-ui, -apple-system, Segoe UI, sans-serif
**Body Font:** Inter
**Label/Mono Font:** ui-monospace stack for code only

**Character:** One family set like the town's painted signs. Headings are 800 with tight tracking (-0.03em), subheads and controls 700, and body text stays at 400 with cv11 and ss01 on so long reading remains easy.

### Hierarchy
- **Town Display** (800, clamp(1.5rem, 1.2rem + 1.2vw, 2rem), 1.05): "Hi, I'm Mohit Ranka" on the intro card. Once per page.
- **Display** (800, 1.75rem, 1.25): the homepage hero headline on the plain page (1.5rem under 640px).
- **Headline** (800, 1.625rem rising to 1.75rem at 640px+, 1.25): article titles, in the reading room and on the plain page. Page h1 is 800 at 1.5rem, 1.3. The site name is 800 at 1.25rem.
- **Title** (700, 1.125rem, 1.3, -0.02em): h2 and h3 (h3 at 1rem). The street panel title is 800 at 1.25rem; the guide card's place name is 800 at 1.125rem; the reading room's room name is 800 at 1rem.
- **Body** (400, 1rem, 1.75): article prose, max 42rem inside the reading room, 720px column on the plain page. Secondary paragraphs and lists use 0.9375rem at 1.75 in secondary colour. Guide and panel captions are 0.9375rem at 1.5 to 1.55.
- **Label** (700, 0.875rem, no tracking, sentence case, primary colour): section labels. Nav pills, Take the tour (header), Back outside and guide actions are 600 at 0.875rem; buttons 700 at 0.875rem (Take the tour on the card 700 at 0.9375rem); tags 600 at 0.75rem. Town labels and place buttons are 600 to 700 at 0.875rem, line-height 1.

### Named Rules
**The Painted Sign Rule.** Headings are 800, subheads and controls 700; body text never goes heavier than 400. Weight, not colour, carries hierarchy: no coloured headings anywhere.

## Layout

**The tour model.** While the tour runs (`tour-on`), the town is fixed full-screen over the page, the document does not scroll, and the plain page (`main#site`) is hidden. There are two places to be:

- **The street (Experience).** A high three-quarter camera follows the character, aimed ahead so the arc of buildings fills the upper two-thirds (fov 32 on landscape, pulled back 1.35x under aspect 1.3; fov 60 with a steeper offset and a 1.5x character on portrait under aspect 0.8). Overlays hug the frame's edges with a clamp(1rem, 3vw, 2rem) inset: the intro card bottom-left (max 23rem), the guide card bottom-centre (min(30rem, 100% - 2rem)), the street panel bottom-right (max 24rem), and the foot controls top-right (hint pill, round day/night switch, Read without the tour). Under 640px the intro card spans the width and keeps one short line, the panel replaces the card while open (max 52% height), and the hint switches to "Tap anywhere to walk there". Floating labels resolve overlaps nearest-first against cached overlay rectangles.
- **A room (Read).** Each room is built off-island at ROOM_ORIGIN (400, 0, 400) plus 60 units per room index along x, so no room is ever seen from the street. The reading room panel takes the right side on desktop (min(46rem, 56%), inset clamp(0.75rem, 2vw, 1.25rem) top, right and bottom); at 760px and under it becomes a bottom sheet from 34% of the height to the bottom edge, with top corners only. The camera looks in through the open front at fov 40 (50 on portrait) and `camera.setViewOffset` shifts the projection so the room is centred in the free region (left of the panel, or above the sheet), fitted to the room's height while the yard fills the sides. The visitor's character stands inside facing the room. Inside a room the street overlays hide and the foot controls move top-left; on phones they hide entirely so the room stays visible.

**Rooms and URLs.** The router maps paths to rooms and back:

| Room | Building | URL |
| --- | --- | --- |
| writing | The print shop | /blog/, plus /tags/, /category/, /author/ and every essay |
| library | The bookshop | /library/ |
| forge | The Forge | /work/#forge |
| work-0 / work-1 / work-2 | Booking.com, Postman, LinkedIn offices | /work/#booking, /work/#postman, /work/#linkedin |
| contact | The post office | /contact/ |
| street | the island | / |

Same-site links matching a room travel through the world (history.pushState, fetched page cached, header stripped, relative links rebased); a hash on the current room scrolls the reading room instead. Anything else, or a failed fetch, is a normal navigation. Escape and Back outside return to the street at that building's door.

**The guided tour** visits forge, writing, library, work-0, work-1, work-2, contact in that order, walking the character to each door.

**The plain page.** One centred column (720px max, padding 48px 24px 120px; 32px 20px 80px under 640px) on an 8px spacing scale (space-1 to space-8). The header is the heavy site name, the nav pills, the Take the tour pill (only when the tour is off) and a round theme toggle. Without WebGL the town becomes a compact static ink card at the column's width (margin 32px auto 8px) with Library and Forge links, above the page.

**The Edges Are Clear Rule.** Street overlays hug the frame's edges (bottom-left, bottom-centre, bottom-right, top-right) so the arc of buildings across the upper middle is never covered.

**The Room Stays in View Rule.** Inside a room the camera's view offset frames the room in the space the reading room leaves free; the panel never sits over the room.

## Elevation & Depth

Depth comes from ink and from the world. Ordinary page furniture is flat, separated by hairlines and the surface tone; overlays on the town and content that deserves weight sit on a solid panel with a soft, negative-spread lift. The town itself is lit and layered: real-time sun and hemisphere light with cast shadows and fog on the street, and one warm point light (#ffe2b0) per room.

### Shadow Vocabulary
- **Panel lift** (`box-shadow: 0 18px 44px -18px rgba(0, 0, 0, 0.55)`, the `--lift` token): impact items, Work cards and the contact form on the plain page; book covers in the Library grid.
- **Overlay lift** (`box-shadow: 0 18px 44px -18px rgba(0, 0, 0, 0.7)`): intro card, guide card and street panel over the scene.
- **Room lift** (`box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.75)`): the reading room panel.
- **Pill lift** (`box-shadow: 0 6px 14px -6px rgba(20, 22, 27, 0.55)`): floating name labels, Read without the tour, the round day/night switch.
- **Field focus halo** (`box-shadow: 0 0 0 3px rgba(255, 138, 42, 0.25)`): fields in the contact form.

### Named Rules
**The Ink Carries Weight Rule.** Only ink panels, things floating over the town, and book covers (objects on the shelf) cast a shadow. Paper and night-sky surfaces on the plain page stay flat; inside the reading room, cards flatten (see Components).

## Shapes

Two shapes do almost all the work: full pills (999px) for every control (nav links, Take the tour, Back outside, theme toggles, buttons, tags, the town's labels, place buttons and guide actions) and 14px panels for every block (intro card, guide card, street panel, reading room, impact items, Work cards, contact form, code blocks, post figures). The reading room is the one bordered panel: a 1px theme-border edge, since it is a page-ground surface floating over the world. As a bottom sheet it keeps only its top corners (14px 14px 0 0). Small radii are kept for small things: 4px for kbd chips and Library book covers, 2px for focus rings and cover thumbnails. In the world, geometry is faceted primitives (four-sided cone roofs, stepped office blocks, low-segment trees) with flat shading and roughness 0.85; rooms are open-fronted boxes (14 by 10, 6.5 tall walls) on a path-coloured plinth.

**The Flat Paths Rule.** The ring road, spokes and plaza are flat planes (ring, plane and circle geometry) laid just above the grass, never extruded slabs, so the character's feet and the shadows stay on one ground.

**The Yard Rule.** Every room sits on a 30-unit grass yard just below its floor, so whatever the camera sees past the open front and beside the room is the island's own lawn, never the void.

## Components

### Buttons
- **Shape:** full pills.
- **Primary and Submit:** ember ground, ink text, no border, 700 0.875rem, 0.65rem 1.1rem. Hover brightens 6%.
- **Secondary:** transparent pill with a theme-border outline and primary text; hover turns the outline ember.
- **Take the tour (intro card):** the street's main action, an ember pill above the place buttons, 700 0.9375rem, 0.65rem 1.1rem.
- **Go inside (street panel):** ember pill, ink text, 700 0.9375rem, 0.6rem 1rem; hover brightens 6%.
- **Town Place Button:** transparent pill with a translucent paper outline, 600 0.875rem; hover fills ember with ink text. Pressing one walks the character to the place.
- **Focus:** outlines are ember everywhere (3px, offset 2px on the town). The canvas shows an inset 3px ember ring.

### Chips
- **Tags:** pills with a theme-border outline, 600 0.75rem, primary text; hover fills ember with ink text.
- **Compact tags** beside list titles stay quiet: 500 0.75rem, secondary text, 0.15rem 0.55rem.
- **Kbd chips** in the hint: 600 0.75rem on 16% paper, 4px radius.

### Cards / Containers
- **Ink panels (plain page):** impact items, Work cards and the contact form: town ink ground, paper text, Town Muted secondary text, no border, 14px corners, panel lift, about 1.1rem 1.2rem (24px for the form).
- **Code blocks:** ink ground, paper text, 14px corners, no border, no shadow, in both the reading room and the plain page.
- **Library grid:** covers at 2:3 in an auto-fill grid (min 7.5rem, gaps 1.25rem by 1rem), 4px corners and the panel lift; title 700 0.875rem, author 0.8125rem in secondary colour; the title underlines in ember on hover. Covers open Goodreads in a new tab.

### Navigation
- **Header (plain page):** pill links (600 0.875rem, 0.45rem 0.8rem, theme-border outline). Hover and the current page fill ember with ink text. The theme toggle is a 34px round pill with a 16px stroked sun/moon SVG.
- **Take the tour (header):** shown only when the tour is off; a pill with an ember outline (600 0.875rem), filling ember on hover. It clears `tour` from localStorage and reloads into the tour.
- **Street:** place buttons, floating labels and click-to-walk are the navigation. The foot controls hold the hint, a 34px round paper day/night switch (pill lift, ember on hover) and the Read without the tour paper pill.

### The Guide Card (signature)
Bottom-centre ink panel (overlay lift, 1rem 1.2rem 1.1rem) for the guided tour; it replaces the intro card and the street panel while touring. The **place name is the heading** (800 1.125rem); the caption reads "Walking there…" until arrival, then the place's one-line description in paper. Actions are a row of pills: **Go inside** (ember, ink text), **Next stop** (paper outline) and **End tour**. The **stop count lives in the Next control** ("Next stop · 3 of 7"), never in a kicker above the title; the last stop's control reads "Finish the tour".

### The Street Panel (signature)
Opens bottom-right when the character reaches a door (the character hops and turns to face it; the hop is skipped under reduced motion). It fades in and rises 12px over 0.35s with cubic-bezier(0.16, 1, 0.3, 1) and holds the building's name (800 1.25rem), one muted paragraph of facts from the site, and the ember Go inside pill. Enter on the canvas also goes inside.

### The Reading Room (signature)
The page itself, opened beside its room. Right side on desktop, a bottom sheet from 34% on phones (760px and under). It uses the site's page tokens, not ink: theme ground and text, a **1px theme-border edge**, 14px corners and the room lift. A top bar (0.75rem 1rem, hairline under it) holds **Back outside** (a bordered pill with a 16px stroked arrow SVG, filling ember on hover) and the room's name (800 1rem). The page scrolls inside it (1.75rem padding, clamp(1.25rem, 3vw, 2.5rem) sides, content max 42rem). Focus moves to Back outside on arrival.

**The No Card on a Card Rule.** Inside the reading room, Work cards and the contact form flatten: no ink ground, no radius, no shadow, a hairline top rule, theme text and secondary colours, and fields on the theme surface with a theme border. The ink treatment belongs to the plain page.

### Room Furnishing (signature)
Every room shares a shell: open front, back and side walls in Cream Wall (or the building's own), a skirting band in the building's colour, a back-wall window that glows at night, a warm point light, a path-coloured plinth and the grass yard. Furnished per building from the site's own data, with clickable objects leading to real pages:
- **Print shop (writing):** a black press with a sheet on its bed, every essay (up to 14) pinned as a page on two drying lines (each opens that essay in the reading room), and a side desk with a stack of paper.
- **Bookshop (library):** shelves holding every synced cover (9 per row) and the favourites standing on a front table; covers open Goodreads.
- **Forge:** a stone hearth with glowing ember coals, firelight and a chimney, an anvil on a stump, a tool rack, and a workbench with a laptop whose ember-on-ink "forge" screen opens the GitHub repo.
- **Offices (Booking.com, Postman, LinkedIn):** a white name plate and the role on the back wall in text, a desk with a monitor (glowing at night), a chair and a potted plant. Names only.
- **Post office (contact):** a counter with letters, a wall of pigeonholes with paper slips, and a Post Red post box.

### The Fade (signature)
Changing room or returning to the street fades a full-screen Night Sky (#0d1830) layer in over 0.25s, swaps the scene behind it, and fades out (about 260ms each way). Under reduced motion the swap is instant. Moving between pages of the same room (essay to essay) does not fade.

### Opting Out and Fallback
- **Read without the tour** (top-right paper pill) stores `tour=off` in localStorage and reloads into the plain pages; the town is not shown (`tour-off`). **Take the tour** in the header undoes it.
- **No WebGL** (or a failed start): the town becomes the compact ink fallback card with Library and Forge links, and the plain page shows beneath it.
- **Loading:** `tour-pending` holds the town over a hidden page for at most 3.5s; if the tour never starts, the plain page returns on its own.

### Floating Name Labels (signature)
Paper pills (700 0.875rem) projected over each building like painted shop signs, turning ember when the character is near or on hover. Pointer click targets only (tabindex -1); keyboard users walk via the place buttons. Overlapping labels hide nearest-first.

### Imagery and Provenance
- **Book covers** (content/images/library, listed in data/library.json) are sourced from the Goodreads RSS shelf by scripts/sync_library.py and appear as textures on the bookshop's shelves and front table and in the Library grid. Ikigai comes from Open Library (ISBN 9781786330895) and was hand-trimmed; its entry in COVER_OVERRIDES re-fetches the untrimmed cover if the covers are cleared.
- **og.png** is a rendered HTML card, not a photograph or generated image.
- Every shipped raster carries embedded provenance; covers added by a future sync need `impeccable embed-prompt`.

### Runtime Hooks
- Loading `?debug` exposes `window.__town` for stepped tests that advance the simulation without rendering.
- Root classes: `tour-pending`, `tour-on`, `tour-off` on the document; `town--ready`, `town--night`, `town--fallback`, `has-panel`, `is-touring` and `in-room` on the town.
- Page scripts survive room swaps: `window.initContactForm` binds the form once per element (`data-bound`), and the comments theme sync guards itself so repeated injection is harmless.

### Known Drift (recorded, not part of the system)
These ship today but are not rules for new surfaces:
- The street's night sky renders about #071030 against the #0d1830 target, because ACES tone mapping darkens the scene background; the night fog (#2b4170) is pre-compensated, the sky is not.
- The street panel's list-row and 28x42 cover-thumbnail styles remain in the stylesheet, but the panel now renders a single paragraph.
- The contact status notes use Tailwind green #16a34a and red #dc2626 (with a 6px radius) outside the palette.
- The homepage lede (1.0625rem), the uppercase "Open source" impact tag (0.6875rem, tracked) and figure credits (0.75rem) sit off the type ramp.
- Inline code uses a 3px radius and the contact fields a 10px radius, both off the 2/4/14/pill set; the field fill #1d2028 is a one-off ink step.
- The old slate ramp (--gray-100 to --gray-800) is still declared, used only by the scrollbar.

## Do's and Don'ts

### Do:
- **Do** give every new section a room: a route in the router, a furnished open-fronted room on the yard at the next ROOM_ORIGIN slot, and its page read in the reading room.
- **Do** build every new surface from the town's materials: paper ground and ink text by day, the night sky (#0d1830) and paper text by night.
- **Do** keep Forge Ember (#ff8a2a) as the single accent site-wide, for active, primary, focus and selection states.
- **Do** put street overlays on solid ink panels (14px corners, overlay lift) and make every control a pill.
- **Do** set the reading room in the site's page tokens with its 1px border, and flatten Work, Contact and any card inside it.
- **Do** frame rooms into the free region with the camera's view offset so the panel never covers the room.
- **Do** put the place name in the guide card's heading and the stop count in its Next control.
- **Do** set headings in Inter 800 and subheads, labels and buttons in 700.
- **Do** relight the town and rooms from `data-theme`: light is day, dark is night.
- **Do** lay paths as flat planes and furnish rooms from flat-shaded primitives in the PALETTE, with the site's real data on the walls.
- **Do** keep the plain page whole under every URL: Read without the tour, no WebGL and slow loads all land on it.
- **Do** give every shipped raster embedded provenance. New Goodreads covers from a future sync need `impeccable embed-prompt`.

### Don't:
- **Don't** bring back a separate slate site palette or a second accent; the site and the town are one world.
- **Don't** fill headings or large backgrounds with ember; it marks state, not decoration.
- **Don't** give plain-page paper or night-sky surfaces a drop shadow; only ink panels, town overlays, the reading room and book covers lift.
- **Don't** put an ink card inside the reading room; it is page ground, not a card stack.
- **Don't** put logos or brand colours on the employer buildings or offices; names only.
- **Don't** add a place or room that doesn't map to a real section of the site.
- **Don't** let a street overlay cover the buildings across the upper middle of the frame.
- **Don't** add a kicker or step label above the guide card's place name; the count belongs in Next stop.
- **Don't** make the tour the only way in: never remove the opt-out, the header Take the tour, or the no-WebGL path.

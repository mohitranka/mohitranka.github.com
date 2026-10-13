---
name: Mohit Ranka
description: A quiet reading site with one optional world, The Unfinished Atlas, a hand-drawn map with a cottage on it.
colors:
  paper: "#fbf8f2"
  paper-surface: "#f3eee4"
  ink: "#1d1c1a"
  ink-2: "#4a4741"
  ink-3: "#6f6b63"
  rule: "#e6dfd2"
  rust: "#b54a17"
  rust-wash: "rgba(181, 74, 23, 0.12)"
  code-paper: "#f1ebe0"
  night-bg: "#15161a"
  night-surface: "#1d1f24"
  night-ink: "#ece8e1"
  night-ink-2: "#c4bfb6"
  night-ink-3: "#9a958c"
  night-rule: "#2c2e35"
  night-rust: "#f08a52"
  night-rust-wash: "rgba(240, 138, 82, 0.16)"
  night-code: "#1f2127"
  atlas-parchment: "#efe2c4"
  atlas-parchment-2: "#e3d1a6"
  atlas-card: "#f6ecd2"
  atlas-sea: "#dccaa0"
  atlas-ink: "#3b2a18"
  atlas-ink-soft: "#4a3622"
  atlas-ink-2: "#6a4e30"
  atlas-frame: "#8a6a3e"
  atlas-rule: "#d8c49a"
  atlas-road: "#a83a2a"
  atlas-water: "#5a7d8a"
  atlas-lantern: "#f2a93b"
  atlas-reader: "#fbf4e2"
  atlas-reader-ink: "#2e2114"
  atlas-reader-rule: "#e2d2ae"
  cottage-plaster: "#ebdfc4"
  cottage-plaster-night: "#c9b896"
  cottage-timber: "#4a3220"
  cottage-floor: "#7a5236"
  cottage-stone: "#a39b8b"
  cottage-iron: "#2b2622"
  cottage-shadow: "#3a2414"
  cottage-sky: "#9cc6d8"
  cottage-flame: "#f6b94a"
  cottage-madder: "#6b2a22"
typography:
  display:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: "1.6rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.35
  lede:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  body-read:
    fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.3vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.65
  body-ui:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1
  wordmark:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 800
    letterSpacing: "-0.03em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.82em"
  atlas-display:
    fontFamily: "'IM Fell English SC', Georgia, serif"
    fontSize: "1.9rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  atlas-body:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  focus: "2px"
  cover: "3px"
  code: "4px"
  reader: "4px"
  md: "8px"
  toast: "10px"
  panel: "12px"
  card: "14px"
  pill: "999px"
spacing:
  space-1: "0.5rem"
  space-2: "1rem"
  space-3: "1.5rem"
  space-4: "2.5rem"
  space-5: "4rem"
  space-6: "6rem"
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  measure: "40rem"
  page-w: "72rem"
components:
  control-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem"
    height: "2.25rem"
  button-submit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.3rem"
  button-submit-hover:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.paper}"
  topic-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    padding: "0"
  input:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.md}"
    padding: "0.7rem 0.8rem"
  code-block:
    backgroundColor: "{colors.code-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1rem 1.15rem"
  invite:
    backgroundColor: "{colors.atlas-sea}"
    rounded: "{rounded.card}"
  invite-card:
    backgroundColor: "{colors.atlas-card}"
    textColor: "{colors.atlas-ink}"
    typography: "{typography.atlas-display}"
    padding: "1rem 1.3rem 1.15rem"
    width: "25rem"
  invite-enter:
    backgroundColor: "{colors.atlas-ink}"
    textColor: "{colors.atlas-card}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.toast}"
    padding: "0.75rem 1rem"
  hud-pill:
    backgroundColor: "{colors.atlas-ink}"
    textColor: "{colors.atlas-card}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem"
    height: "2.25rem"
  music-panel:
    backgroundColor: "{colors.atlas-ink}"
    textColor: "{colors.atlas-card}"
    rounded: "{rounded.panel}"
    padding: "0.85rem 0.95rem"
    width: "15rem"
  music-next:
    backgroundColor: "transparent"
    textColor: "{colors.atlas-card}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.75rem"
  reader:
    backgroundColor: "{colors.atlas-reader}"
    textColor: "{colors.atlas-reader-ink}"
    rounded: "{rounded.reader}"
    width: "min(46rem, 56vw)"
  atlas-card:
    backgroundColor: "{colors.atlas-card}"
    textColor: "{colors.atlas-ink}"
    typography: "{typography.atlas-body}"
    padding: "1rem 1.15rem 1.1rem"
    width: "min(20rem, calc(100vw - 2rem))"
  atlas-card-go:
    backgroundColor: "transparent"
    textColor: "{colors.atlas-ink}"
    padding: "0.5rem 0.9rem"
  atlas-card-go-hover:
    backgroundColor: "{colors.atlas-ink}"
    textColor: "{colors.atlas-card}"
  cottage-title:
    backgroundColor: "{colors.atlas-card}"
    textColor: "{colors.atlas-ink}"
    padding: "0.7rem 1.3rem 0.75rem"
  cottage-bar:
    backgroundColor: "{colors.atlas-card}"
    textColor: "{colors.atlas-ink}"
    typography: "{typography.label}"
    padding: "0.45rem"
  cottage-bar-current:
    backgroundColor: "{colors.atlas-ink}"
    textColor: "{colors.atlas-card}"
    padding: "0.55rem 0.85rem"
  songbook:
    backgroundColor: "{colors.atlas-card}"
    textColor: "{colors.atlas-ink}"
    typography: "{typography.atlas-body}"
    width: "min(30rem, calc(100vw - 2rem))"
  songbook-pill:
    backgroundColor: "transparent"
    textColor: "{colors.atlas-ink}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.95rem"
  songbook-pill-play:
    backgroundColor: "{colors.atlas-ink}"
    textColor: "{colors.atlas-card}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.95rem"
---

# Design System: Mohit Ranka

## Overview

**Creative North Star: "The Reading Room With One Door"**

Every URL renders as Just Read: a quiet writer's site on warm paper, set in Source Serif 4 for reading and Inter for everything you operate. It is the canonical system and a first-class reading experience, not a fallback. One door leads out of it, into The Unfinished Atlas: a hand-drawn medieval map that holds the outward sections (Writing, Work, Projects), with Traveler's Home on it, a half-timbered cottage that holds the personal ones (About, Library, Contact). The map and the cottage are two scenes of one fantasy world, sharing its parchment, iron-gall ink, red road and IM Fell lettering, joined by a zoom into the house. Nothing in either is required to read anything.

The architecture is a sandwich. At the bottom is the shared content layer (Pelican templates, identical HTML in every mode). In the middle is the shared world layer: the HUD pills, the music panel, the reader panel where any page opens beside the world, the curtains, and the toast. On top is the world module, loaded only when the visitor steps inside, which restyles the shared layer through a small set of `--hud-*` and `--reader-*` custom properties and otherwise owns its own stage. The homepage carries the world's one appearance inside Just Read: an invitation card showing the map.

Just Read is flat, generous and calm: one rust accent that marks links and state, hairline rules instead of boxes, a 40rem reading measure. The world is allowed to be rich, because it is chosen. Light theme is day and dark theme is night everywhere; inside the world music plays by default from the first gesture the browser allows, and Just Read is always silent.

**Key Characteristics:**
- Warm paper and near-black ink, one rust accent, a cool-charcoal dark theme with a lifted orange accent.
- Source Serif 4 for everything read; Inter for everything operated.
- Flat, rule-divided Just Read; elevation belongs to the world layer and the invitation.
- Every Just Read and HUD control is a pill.
- One fantasy world, two scenes: a parchment map and a half-timbered cottage, both lettered in IM Fell and overlaid with the same ruled vellum.
- Pages always open in the shared reader, re-tokened to a sheet of good paper; the plain page is one click away.
- A songbook of eleven original synthesized tracks.

## Colors

A warm paper-and-ink reading palette with a single rust accent and a charcoal night theme, plus the world's parchment map and its cottage interior.

### Primary
- **Letterpress Rust** (`rust`): link underlines (1px, 2px on hover), the active nav underline, list markers, blockquote rule, outline active bar, pill hover borders, topic-link hover underlines, the essay drop cap, focus outlines, the required-field asterisk and the submit button's hover fill. Its translucent wash (`rust-wash`) is the selection colour, the input focus ring and the success status ground.
- **Ember by Night** (`night-rust`, `night-rust-wash`): the same roles in the dark theme, lifted so it stays legible on charcoal.

### Neutral
- **Warm Paper** (`paper`): the Just Read page ground.
- **Paper Surface** (`paper-surface`): input fields and book-cover placeholders. **Code Paper** (`code-paper`) holds inline and block code.
- **Press Ink** (`ink`): body and heading text; the submit button and toast ground.
- **Ink 2** (`ink-2`): ledes, nav links and topic links at rest, secondary metadata. **Ink 3** (`ink-3`): dates, captions, counts, footer text.
- **Hairline Rule** (`rule`): every divider, list row and pill outline, and the resting underline of topic links.
- **Night set** (`night-bg`, `night-surface`, `night-ink`, `night-ink-2`, `night-ink-3`, `night-rule`, `night-code`): the dark theme, role for role. Night ground and Night Ink 2 also paint the "Opening the world…" loading stage.

### The Unfinished Atlas: the map
Parchment, iron-gall ink and a red road. These are also the world's shared overlay and reader palette.
- **Parchment** (`atlas-parchment`, `atlas-parchment-2`) for land and for hover grounds on overlay buttons; **Sea Vellum** (`atlas-sea`) for water and the invitation's ground; **Card Vellum** (`atlas-card`) for every overlay in both scenes, the HUD text and the text on ink pills.
- **Iron-gall Ink** (`atlas-ink`): coastlines, hatching, overlay text, the HUD and music panel ground, the invitation's "Unroll the map" pill, the current wayfinder entry and the songbook's Play pill. **Soft Ink** (`atlas-ink-soft`): card and invitation prose. **Faded Ink** (`atlas-ink-2`): region names, subtitles and taglines.
- **Red Road** (`atlas-road`): the marching dotted road, visited stamps, hovered place names, every focus outline in the world, the cottage's active-object ring, label names, the songbook's "playing" mark and the reader accent.
- **Framing Brown** (`atlas-frame`): the 1px outer rule of every overlay and the songbook numerals. **Leaf Rule** (`atlas-rule`): the songbook's internal rules and the curtain's edge.
- **River** (`atlas-water`), **Lantern** (`atlas-lantern`): rivers; the lantern that walks the road, embers, and the HUD accent.
- **Reader Paper** (`atlas-reader`, `atlas-reader-ink`, `atlas-reader-rule`): the reader's sheet, its ink and its rules.
- By night the map's parchment, sea and fog darken (#cdb684, #8f7b55) under a candlelight vignette.

### Traveler's Home: the cottage
Lime plaster, oak timber, field stone and firelight.
- **Lime Plaster** (`cottage-plaster`): the walls by day; **Plaster by Hearthlight** (`cottage-plaster-night`) by night, under a violet night wash (#160e1c at 38%) and screen-blended glows.
- **Oak Timber** (`cottage-timber`): the half-timbering and furniture. **Floorboards** (`cottage-floor`). **Field Stone** (`cottage-stone`): the hearth and its masonry. **Forged Iron** (`cottage-iron`): chains, rings and the cauldron.
- **Smoke Brown** (`cottage-shadow`): the stage ground behind the room and the doormat lettering.
- **Window Sky** (`cottage-sky`): the day sky in the window, over the map's own hills and the Citadel in faded ink with a red road; by night it goes to deep violet with stars and lit windows.
- **Firelight** (`cottage-flame`): candle and hearth flames. **Madder Thread** (`cottage-madder`): the embroidered sampler's lettering.

### Named Rules
**The One Rust Rule.** Just Read has exactly one accent and it marks links, state and focus. It never fills a heading or a large surface; the only accent fill is the submit button's hover.

**The World Owns Its Palette Rule.** The world's colours stay inside its stage, its curtain, its `--hud-*` / `--reader-*` overrides and the homepage invitation. They never leak into the rest of Just Read, and Just Read's rust never appears inside the stage; the world's red is the road. Both scenes share one overlay vellum, and each shows the other only as a picture of it: the hills and Citadel in the cottage window, the cottage lit on the map.

## Typography

**Reading Font:** Source Serif 4 (with Georgia, Times New Roman)
**UI Font:** Inter (with system-ui, -apple-system, Segoe UI)
**Mono:** ui-monospace stack
**World display faces:** IM Fell English SC and IM Fell English, in both scenes and the invitation

**Character:** A sturdy, warm text serif carries every word meant to be read, including titles and section heads; a neutral grotesk carries every word meant to be operated. The world announces itself in a seventeenth-century printer's face that belongs to its place and period.

### Hierarchy
- **Display** (Source Serif 4 700, clamp(2.25rem to 3.4rem), 1.06): page and essay titles, the homepage title. Reduced to clamp(1.9rem to 2.6rem) inside the reader.
- **Headline** (Source Serif 4 600, 1.6rem): homepage section heads and the archive's year labels (in ink-3, oldstyle numerals). Library and contact section heads use 1.4rem.
- **Title** (Source Serif 4 400, 1.2rem, 1.35): essay links in lists; 1.3rem 600 on the homepage "ways in" grid.
- **Lede** (Source Serif 4 400, 1.25rem, 1.55, ink-2): the sentence under a page title; the homepage lede scales to 1.45rem.
- **Body (read)** (Source Serif 4 400, clamp(1.125rem to 1.3rem), 1.65): essays and pages, 40rem measure. In-body h2 is 1.55em 600, h3 1.2em 600; tables switch to Inter at 0.9375rem with tabular numerals.
- **Body (UI)** (Inter 400, 1rem, 1.6): chrome, forms, the default page font.
- **Label** (Inter 600, 0.875rem): pills, form labels, buttons (submit and Unroll the map at 700). Nav links are Inter 500 at 0.9375rem; dates and counts use tabular numerals.
- **Wordmark** (Inter 800, 1.1875rem, -0.03em): the name in the header, nowhere else.

### World lettering
- **Names** in IM Fell English SC: the map cartouche 1.9rem, the cottage cartouche 1.8rem (both 1.3rem on phones), the invitation 2rem (1.7rem on phones), the songbook title 1.7rem, card names 1.55rem, the reader's place name 1.3rem in red road, object-label names 1.2rem in red road, song titles 1.15rem, the legend title 1.1rem, songbook numerals 1rem, and place names on the map.
- **Prose** in IM Fell English: card text 1.08rem/1.4, italic for subtitles, taglines, region names (tracked 0.18em), notes, speech bubbles (1.1rem), song blurbs and the invitation's sentence. Page titles inside the reader drop to IM Fell English 400.
- **Operational text** stays in Inter in both scenes: the card's go button, zoom buttons, the wayfinder bar, songbook pills, the "playing" mark, the legend hint, HUD, music panel, reader bar.

### Named Rules
**The Read/Operate Rule.** If you read it, it is Source Serif 4; if you press or scan it, it is Inter. The world adds a display face for names of places and its own titles; it does not replace either role, and page body text in the reader stays Source Serif 4.

**The Own Lettering Rule.** IM Fell appears only in the world and in the homepage invitation. The rest of Just Read never borrows it.

## Layout

Just Read is a single centered column system: a 72rem page width with a fluid gutter, and a 40rem reading measure for anything read. Vertical rhythm comes from a six-step spacing scale (0.5, 1, 1.5, 2.5, 4, 6rem): sections are separated by 4rem, page heads sit 2.5rem above content, and the main area opens with 4rem top and 6rem bottom padding.

- **Header and footer**: one flex row each, wrapping; name, nav, then controls (Open the map, theme). Under 640px the nav drops to its own full-width row.
- **Homepage invitation**: a 12:5 band (minimum 20rem tall) with the map illustration cropped to fill it and the parchment cartouche pinned top-right at clamp(1rem, 3vw, 2rem), max 25rem wide. Under 680px it stacks: a 13rem illustration above a full-width, unframed card-vellum panel.
- **Essays**: a two-column grid. The 13rem left rail is sticky and holds the meta ("Essay · N min" in ink, the date in ink-3) and, below it, the outline; the 40rem text column holds the title, the "Filed under" line and the body, whose first paragraph opens with a 3.55em rust drop cap. Under 960px (and inside the reader) the rail becomes a one-line meta row under the title and the outline disappears.
- **Archive**: an 8rem year column beside a 48rem list; stacks under 680px. List rows put title and date on one baseline; dates stack under titles on small screens.
- **Library**: an auto-fill grid of 2:3 covers, minimum 7.5rem.
- **Ways in**: an auto-fit grid, minimum 14rem, under a top rule.
- **Forms**: a 1rem grid; two columns from 560px.
- **World layer**: the stage is fixed full-screen; the HUD sits top-right; the reader docks right at min(46rem, 56vw) with an inset of clamp(0.75rem, 2vw, 1.25rem), and the HUD steps left to sit beside it. Under 760px the reader becomes a bottom sheet from 36% down and the HUD keeps to one row of icons.
- **Two stacked scenes**: the map and the cottage fill the stage on top of each other; only one is visible and interactive at a time, and the hidden one is inert.
- **The world frames around the reader**: the map's cartouche and legend fade and its zoom buttons move left of the reader; the cottage's cartouche fades and its wayfinder recentres in the space left of the reader. On phones the cottage room shrinks to the top 36% above the sheet and its overlays hide.
- **Overlay corners**: world overlays sit at clamp(0.75rem, 2vw, 1.5rem) from the edges: cartouche top-left in both scenes (3.6rem down on phones, under the HUD), legend bottom-left and zoom bottom-right on the map, the wayfinder bar bottom-centre in the cottage. The songbook is centred over either scene; on phones it is a bottom sheet up to 80vh.
- **Phones in the cottage**: the 16:9 room is wider than the screen and pans horizontally with no visible scrollbar; the wayfinder wraps into two-up, thumb-sized buttons across the full width.

## Elevation & Depth

Just Read is flat. Depth comes from hairline rules and the paper/surface step, never from shadows, with two exceptions: book covers sit on a small physical shadow so they read as objects, and the invitation's cartouche floats over its illustration as it does on the map. Elevation belongs to the world layer, where things genuinely float over a stage, and its shadows are soft, dark and drawn downward.

### Shadow Vocabulary
- **Book cover** (`0 1px 2px rgba(0,0,0,.12), 0 10px 22px -14px rgba(0,0,0,.45)`): library covers only.
- **Framed vellum** (`0 14px 30px -18px rgba(59,42,24,.8)` plus a double inset rule, 4px card vellum then 1px framing brown at 45%, inside a 1px framing-brown border): every overlay in the world (map cartouche, place card, legend, zoom buttons, notes; cottage cartouche, object labels, speech bubbles, wayfinder bar) and the invitation's cartouche, which drops it when stacked on phones. The cottage overlays use 0.85 alpha.
- **Leaf** (`0 30px 70px -30px rgba(40,25,10,.9)` with a 5px/6px inset rule): the songbook, the largest floating sheet.
- **Reader sheet** (`0 30px 60px -28px rgba(40,25,10,.85)` with a 5px reader-paper then 1px framing-brown inset rule, inside a 1px framing-brown border): the reader in the world. Its unthemed fallback is `0 24px 60px -24px rgba(0,0,0,.7)`.
- **HUD pill** (`0 6px 18px -8px rgba(0,0,0,.55)`): floating controls over the world.
- **Music panel / toast** (`0 16px 36px -16px rgba(0,0,0,.7)` / `0 16px 40px -18px rgba(0,0,0,.7)`): small floating panels.
- **Object glow** (drop-shadow 0.5px card vellum plus 6px warm candlelight at 80%): cottage objects on hover or focus; the lantern carries a similar 6px glow.
- **Focus ring as glow** (`0 0 0 3px` rust wash): input focus.

### Named Rules
**The Flat Paper Rule.** Nothing on the Just Read page lifts except a book cover and the invitation's cartouche. Cards are rows divided by rules, not boxes.

**The Floating Layer Rule.** Shadows exist for things that float: HUD, music panel, reader, toast, songbook, cartouches and every map or cottage overlay. They are soft and downward with a negative spread, never offset sideways, never hard-edged.

**The Ruled Vellum Rule.** Every world overlay is the same object: card vellum, a 1px framing-brown border and an inset ruled frame. New overlays in either scene take it rather than inventing a surface.

## Shapes

Just Read is mostly unboxed: content is divided by 1px rules, and where a container is needed it takes a gentle 8px radius (code blocks, inputs, figures, status messages). Every Just Read control, from the theme toggle to the submit button, and every HUD control is a full pill (999px). Smaller radii are functional: 2px on focus outlines, 3px on book covers, 4px on inline code. Floating panels step up with their size: 10px toast, 12px music panel, 14px for the invitation band.

The world is square-cornered paper. Overlays in both scenes, the place card's go button, the zoom buttons, the wayfinder bar and its buttons, and the songbook have no radius and carry a ruled inner frame; the reader is a 4px sheet. Pills inside the world are reserved for ink-on-paper actions that carry you somewhere or run the music: the invitation's "Unroll the map" and the songbook's Play, Next and Close. Focus in the world is a dashed or solid red-road ring; the cottage's active object takes a dotted red ring, keyboard focus a dashed vellum one.

## Components

### Buttons
- **Shape:** full pill (999px) for every Just Read and HUD button.
- **Control pill** (Open the map, theme toggle): transparent, hairline border, ink text, Inter 600 0.875rem, 2.25rem tall, with a small stroked folded-map icon on Open the map; the theme toggle is a 2.25rem circle. Hover turns the border rust. Open the map is hidden without JavaScript.
- **Submit:** ink fill, paper text, Inter 700 0.9375rem, padding 0.75rem 1.3rem; hover fills rust; disabled at 60% opacity with a progress cursor.
- **Focus:** a 2px rust outline offset 3px everywhere in Just Read.

### Topic links
- **Topics** (archive and topics index): a plain wrapping run of Inter 500 0.9375rem ink-2 links with a hairline underline and a smaller ink-3 tabular count, spaced 0.35rem by 1.25rem; hover turns the underline rust and the text ink. No pills. On essays the topics read as a sentence: "Filed under X, Y and Z".

### Cards / Containers
- **Work, project and library sections** are rows, not cards: 1.4rem vertical padding under a top rule. Book entries are a cover plus a serif title and an Inter author, with the rust underline on hover.
- **Code blocks:** code-paper ground, 8px radius, 1rem 1.15rem padding.

### Inputs / Fields
- **Style:** paper-surface fill, hairline border, 8px radius, Inter 1rem, padding 0.7rem 0.8rem; ink-3 placeholders.
- **Focus:** border turns rust and a 3px rust-wash ring appears; no outline.
- **Status:** success sits on the rust wash; error is a rust border.

### Navigation
- **Site nav:** Inter 500 0.9375rem in ink-2, ink on hover. The current page is ink with a 2px rust underline offset 0.45em. No pills, no backgrounds.
- **Essay outline:** a sticky list on a 2px rule; the active and hovered entries take a rust bar and ink text.
- **Essay pager:** previous / next in serif with a small Inter ink-3 label; hover turns rust.

### The invitation (homepage)
The world's single appearance inside Just Read, and its door. A 14px-cornered sea-vellum band holding a parchment map illustration: mountains, forest and river, the red road between Library of Stories, the Citadel and the Forge, and Traveler's Home lit with a warm glow. Over it, top-right, sits the map's own framed-vellum cartouche: "The Unfinished Atlas" in IM Fell English SC, one italic IM Fell sentence in soft ink, and an ink "Unroll the map" pill (card-vellum Inter 700 0.9375rem, padding 0.65rem 1.1rem; hover lifts 1px; focus is a 2px red-road outline offset 3px). Without JavaScript the button hides and the card stays a picture.

### HUD (world layer)
Pills on `--hud-bg` (iron-gall ink) with `--hud-fg` (card vellum) text, Inter 600 0.8125rem, 2.25rem tall: Music, theme, Just Read. Hover brightens by 12%; focus is a 3px ring in `--hud-accent` (lantern). With the reader open, or on phones, the music pill drops its label and the pills tighten to icons.

### Music
A pill and a songbook, never a player. On by default in the world: one AudioContext, started at the first click, tap or key the browser allows. Turning it off is remembered; Just Read is always silent. Paused while the tab is hidden; ducked to half while a page is open in the reader; every track passes through a gentle master limiter. While playing, four small equalizer bars move in the accent. Hover, focus or tap opens a 15rem panel (12px corners, HUD colours) with the current track's name in bold, a `Next: <title>` pill (transparent, a hairline in the HUD text colour at 35%, Inter 600 0.75rem; hover and 2px focus in the HUD accent) and a volume slider tinted with the accent.

The music is a rotating playlist of eleven original synthesized tracks in fixed order, from "Lantern Road" to "The Long Road North", built from a shared kit (plucked strings, flute, reed and chanter, drones, bells, anvil, keys, brushes). Each plays for 210 seconds, then crossfades into the next over 4 seconds; play, stop and Next fade over 1.6 seconds.

### The songbook
A parchment leaf listing every tune, opened from inside the world by the cottage's lute or the map's Minstrel's Camp. Framed vellum, min(30rem, 100vw − 2rem) wide, centred, opening in 0.35s from 4% below; on phones a bottom sheet. A head ("The Songbook" in IM Fell SC 1.7rem, an italic faded-ink line) over a leaf-rule; an ordered list where each row is a full-width button with a roman numeral in framing brown, the title in IM Fell SC and an italic blurb; the current song has a 2px red-road left bar on parchment and a small Inter 600 0.72rem "playing" mark in red road. Rows hover to parchment and focus with an inset 2px red-road outline. The foot holds ink-outlined Inter pills: Play / Rest the music (filled ink), Next song, and Close pushed right; hover is parchment, focus a 2px red-road outline. Opening focuses the current song; Escape closes it before anything else hears the key, and focus returns to whatever opened it.

### Reader (world layer)
The shared panel the world opens pages in. A bar with a "Back to the world" pill, the place name and a "Just Read" link, then a scrolling area holding the page's own Just Read markup at the 40rem measure. It slides in from the right (0.45s) or up from the bottom on phones. The world re-tokens it through `--reader-bg`, `--reader-ink`, `--reader-rule`, `--reader-accent` and `--reader-radius`, and maps Just Read's own tokens (`--bg`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--accent`, `--surface`, `--code-bg`) onto them, so page content renders unchanged in the world's paper. In the atlas it is one sheet for both scenes and both themes: reader paper with a 4px radius, a ruled inner frame, red-road accent, the place name in IM Fell SC 1.3rem, page titles in IM Fell English.

### Curtains
Stepping in and out passes through a curtain (0.55s, cubic-bezier(0.65, 0, 0.35, 1)); with reduced motion it is instant.
- **Unroll the map:** parchment opens as a circle from the middle, darkening to the leaf rule at its edge.
- **Just Read:** a fade to paper.

### The world module
The Unfinished Atlas is registered in `WORLDS` in `core.js` as `atlas` (html class `world-atlas`) with a title, a module (`static/js/worlds/home.js`), both scene stylesheets (`worlds/atlas.css`, `worlds/cottage.css`), and a place name per section: The Unfinished Atlas (home), The front door (About), The shelves (Library), The messenger's letterbox (Contact), Library of Stories (Writing), The Citadel (Work), Craftsman's Forge (Projects). The default export implements:
- `mount(stage, api)` builds the map, the cottage and the songbook, and extends the scene api with `enterHome()`, `toMap()` and `openSongbook(opener)`.
- `show(section, { instant, url })` routes About, Library and Contact to the cottage and Writing, Work and Projects to the map, switching scene as needed; `home` lands in whichever scene the visitor last asked for, the map first.
- `setReading(open)` and `setTheme(theme)` pass through to both scenes; `unmount()` cancels motion and unmounts both.

The `api` gives the world `data` (sections, essays, favourite books, counts), `go(section)`, `navigate(url)`, `theme()`, `reduceMotion`, `coarse`, `sfx(name)`, `music` (list, playTrack, toggle, next), `toggleMusic()`, `musicPlaying()`, `toast()`, `readerRect()` and `section()`. The world navigates only through `go` and `navigate`; the URL stays canonical and the reader shows the real page.

### Into the house (scene transition)
Traveler's Home on the map is the door. Going in, the map dives ×3.2 toward the house's on-screen position and fades in its last 35%, while the cottage opens out of that point as a growing circle clip-path from 30% onward: 950ms, cubic-bezier(0.65, 0, 0.35, 1). Leaving plays it in reverse. Pointer events are off while moving; the hidden scene is inert; with reduced motion the swap is instant. Escape in the cottage, with no page open and not in a field, returns to the map.

### The Unfinished Atlas: the map
The home screen: an illustrated SVG map of the traveller's country with four places on one red road (Traveler's Home, Library of Stories, The Citadel, Craftsman's Forge) and the Minstrel's Camp off the road.
- **Navigation:** drag to pan, scroll or pinch to zoom, plus/minus/fit buttons bottom-right with stroked SVG icons. The homepage opens here. Hovering a place unfolds a vellum card under its name with a line of description and a go button ("Step inside" for Traveler's Home); the whole card is clickable, and so is the place's icon and name (one hit area over both). Going walks a lantern along the road. Visited places get a red stamp that persists. A cartouche top-left and a legend bottom-left step aside when the reader opens.
- **What can be opened (the Ribbon Rule):** every place you can visit, and only those (the five landmarks, including the Messenger's Outpost for Contact, and the Minstrel's Camp), carries its name on an unfurled swallowtail ribbon of card vellum with an ink outline and a soft drop shadow; on hover, focus or when active the ribbon fills red road and the name turns vellum. Plain italic names (Mount Backlog, Lake Later, the seas, the forest) are geography and never take a ribbon. Unvisited places also give a slow red beacon (a ring expanding from the icon every 4.2s, staggered, off under reduced motion and while reading). The legend's first key is the ribbon: "a place you can visit".
- **Minstrel's Camp:** a campfire place that behaves like the others on hover and focus but opens the songbook instead of a card; small notes rise from it while music plays.
- **Motion:** the road's dots march continuously; waves bob, a ship sails, a sea serpent surfaces, fog lifts over unvisited regions; cards unfold in 0.3s; place icons spring to 1.5x on hover with cubic-bezier(0.34, 1.56, 0.64, 1).
- **Night:** a candlelight vignette and darker parchment; lamplight blends over the map.

### Traveler's Home: the cottage
An SVG half-timbered interior. The arched front door (About), the shelves of tomes (Library) and the messenger's letterbox with its raven (Contact) are the cottage's own places; the writing desk with its quill, a sealed letter from the Citadel and the workbench with its gears are shortcuts back out to Writing, Work and Projects on the map. The window shows the map's hills and the Citadel.
- **Cartouche:** framed vellum top-left, "Traveler's Home" in IM Fell SC with an italic faded-ink tagline.
- **Wayfinder bar:** a framed-vellum bar bottom-centre with About, Library, Contact and Back to the map, each a square Inter 600 0.875rem button with an 18px stroked SVG icon; hover is parchment, the current section is filled ink with vellum text, focus a 2px red-road outline.
- **Objects:** hover or focus raises a vellum label with the name in red-road IM Fell SC; objects glow candlelight and do a small piece of business (the door swings open, the raven turns its head and letters lift, the quill tilts, the letter swings, the gears turn), springing with cubic-bezier(0.34, 1.56, 0.64, 1). Props answer in an italic vellum speech bubble: the cauldron cycles soup jokes and stirs its steam, the chessboard quips, the "Grandmaster of Snacks" sampler, the window and the doormat. The lute opens the songbook, and its strings strum while music plays.
- **Living things:** candle and hearth flames flicker, steam rises.
- **Night:** plaster darkens under a violet wash, the hearth and candles glow, the window goes to dusk with stars and lit windows on the hill.

### Materials: the hand-inked map (2026-10-14)
The world is drawn like an old hand-inked map: one stained sheet, iron-gall ink, oxblood lettering in an uncial hand, a charred edge. Colour belongs to the paper and the rubric; everything drawn is ink. Sources: `static/css/worlds/materials.css` (from `scripts/make_ornaments.py`), `static/images/stains.jpg` and `burnt.png` (from `scripts/make_stains.py`), `static/images/vellum.jpg` (from `scripts/make_vellum.py`), `static/js/worlds/paper.js`.
- **The sheet:** a non-repeating stained parchment (`stains.jpg`: ochre ground, grey-green and rose watercolour blooms, umber mottling, handled edges) laid under the whole map as an SVG pattern that moves and scales with it; drawings use the same pattern as their fill so they hide what is behind them without a flat patch. The fine `vellum.jpg` grain multiplies over everything.
- **The frame:** a charred edge (`burnt.png`, CSS `border-image` so the burn keeps its scale), then a band between double ink rules lettered round all four sides in Uncial Antiqua with the atlas's own words, with star roundels at the corners. Everything laid on the map sits inside the band; the HUD and the reader move in with it.
- **Line work (ink `#241710`):** coasts carry dense hachures standing off the shore; mountains are pen-hatched ranges with dark shadowed flanks; woods are crowds of round-crowned trees with the odd pine; hills are humps with a few strokes; rivers carry tributaries; buildings are ink with hatched roofs. A slight tremble filter runs while the map is still and switches off while it moves.
- **Lettering:** **Uncial Antiqua** (self-hosted, OFL) in oxblood `#74263a`, lower-case, widely spaced for regions (34–44px) and seas; place names on small curled paper scrolls (the clickable ones only); hover fills the scroll oxblood with paper-coloured letters. The title cartouche is a drawn scroll; the compass is an original four-arrow compass with petals, a star and "north".
- **The rest of the world** takes the same hand: reader titles, headings and place names, the songbook, the cottage title and wayfinder, and the HUD use Uncial Antiqua in oxblood; the essay's initial is an oxblood uncial capital in a double ink frame. Body text stays in Source Serif 4 for reading.
- **Kept from the realism layer:** deckled sheet edges, the separate reader sheet that casts the torn shadow, oak scroll rollers, wax seals, leather HUD tags, the cottage's stone and oak.
- **Not borrowed:** the style follows hand-inked fantasy maps generally; no names, scripts (no Tengwar), emblems or artwork from any particular one.

## Do's and Don'ts

### Do:
- **Do** render every page completely in Just Read first; the world is a layer over the same HTML, never a replacement for it.
- **Do** set anything read in Source Serif 4 and anything operated in Inter, inside the world too.
- **Do** keep Just Read's rust on links, markers, focus and state only (the One Rust Rule).
- **Do** make every Just Read and HUD control a pill (999px) and divide Just Read content with 1px rules rather than boxes.
- **Do** build every world overlay from the same ruled vellum, square-cornered, in both scenes.
- **Do** keep the world one fantasy country: new places and props belong to a medieval map and the cottage on it.
- **Do** connect scenes through something visible (the house on the map, the view from the window), and give the cottage a visible way back to the map.
- **Do** open pages from the world in the shared reader and frame the world around it.
- **Do** honour reduced motion: curtains skip, the house zoom swaps instantly, transitions collapse.
- **Do** let music start in the world at the first allowed gesture, remember when the visitor turns it off, and keep Just Read silent.
- **Do** name employers in the world by name only.

### Don't:
- **Don't** put Just Read content behind the world or an animation; without JavaScript the map buttons hide and the visitor stays reading.
- **Don't** let the world's palette or display faces appear in Just Read outside the homepage invitation.
- **Don't** add drop shadows to Just Read surfaces other than book covers and the invitation's cartouche.
- **Don't** fill headings or large surfaces with the rust accent.
- **Don't** add a place to the world that does not map to a real section of the site or to the songbook.
- **Don't** put modern rooms, objects or periods into the world.
- **Don't** put logos or brand colours on employer buildings or places.
- **Don't** put small uppercase labels (kickers) above world names or headings; each scene announces itself in its own lettering.
- **Don't** use hard offset shadows; floating layers use soft, downward shadows only.

---
name: Mohit Ranka
description: One person, three worlds, many things worth exploring. A quiet reading site with three optional worlds layered over the same pages.
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
  chrome-black: "#111216"
  chrome-step: "#23252c"
  chrome-border: "#3a3d46"
  chrome-paper: "#fffaf0"
  chrome-muted: "#a9adb8"
  city-dusk: "#1a0f2e"
  city-sky: "#2a1b4f"
  city-panel: "rgba(20, 12, 36, 0.86)"
  city-yellow: "#ffe066"
  city-lavender: "#b9add6"
  city-reader-accent: "#b54a17"
  city-night-reader: "#17141f"
  city-night-accent: "#ffb070"
  city-place-about: "#ff8fb1"
  city-place-work: "#7fd6ff"
  city-place-projects: "#ffa94d"
  city-place-library: "#b197fc"
  city-place-contact: "#ff6b6b"
  apt-plum: "#3a1f33"
  apt-purple: "#5b3a7a"
  apt-mustard: "#d9a94a"
  apt-cream: "#fff4d6"
  apt-gold: "#f2c14e"
  apt-rose: "#a83f4f"
  apt-curtain: "#7a2e3a"
  apt-ink: "#2a1e1a"
  apt-remote: "#23181f"
  apt-night-reader: "#2b1d28"
  atlas-parchment: "#efe2c4"
  atlas-parchment-2: "#e3d1a6"
  atlas-card: "#f6ecd2"
  atlas-sea: "#dccaa0"
  atlas-ink: "#3b2a18"
  atlas-ink-2: "#6a4e30"
  atlas-frame: "#8a6a3e"
  atlas-road: "#a83a2a"
  atlas-water: "#5a7d8a"
  atlas-lantern: "#f2a93b"
  atlas-reader: "#fbf4e2"
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
  city-display:
    fontFamily: "'Big Shoulders Display', 'Inter', sans-serif"
    fontSize: "1.6rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.02em"
  apt-display:
    fontFamily: "'Righteous', 'Inter', sans-serif"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
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
  md: "8px"
  toast: "10px"
  panel: "12px"
  pano: "14px"
  dialog: "16px"
  pill: "999px"
  city-reader: "6px"
  apt-reader: "18px"
  atlas-reader: "4px"
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
  tag-chip:
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
  hud-pill:
    backgroundColor: "{colors.chrome-black}"
    textColor: "{colors.chrome-paper}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem"
    height: "2.25rem"
  reader:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pano}"
    width: "min(46rem, 56vw)"
  worlds-dialog:
    backgroundColor: "{colors.chrome-black}"
    textColor: "{colors.chrome-paper}"
    rounded: "{rounded.dialog}"
    width: "min(64rem, calc(100vw - 2rem))"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.toast}"
    padding: "0.75rem 1rem"
  city-tag:
    backgroundColor: "{colors.city-panel}"
    textColor: "{colors.chrome-paper}"
    typography: "{typography.city-display}"
    padding: "0.3rem 0.6rem 0.35rem"
  apt-remote:
    backgroundColor: "{colors.apt-remote}"
    textColor: "{colors.apt-cream}"
    rounded: "22px"
    padding: "0.5rem"
  atlas-card:
    backgroundColor: "{colors.atlas-card}"
    textColor: "{colors.atlas-ink}"
    typography: "{typography.atlas-body}"
    padding: "1rem 1.15rem 1.1rem"
    width: "min(20rem, calc(100vw - 2rem))"
---

# Design System: Mohit Ranka

## Overview

**Creative North Star: "The Reading Room With Three Doors"**

Every URL renders as Just Read: a quiet writer's site on warm paper, set in Source Serif 4 for reading and Inter for everything you operate. It is the canonical system and a first-class reading experience, not a fallback. Behind three doors sit three worlds (Side Quest City, Apartment 404, The Unfinished Atlas) that present the same six sections (About, Writing, Work, Projects, Library, Contact) as places. Each world is its own sub-system with its own palette, lettering, composition, navigation, motion and music; none is a reskin of another, and none is required to read anything.

The architecture is a sandwich. At the bottom is the shared content layer (Pelican templates, identical HTML in every mode). In the middle is the shared world layer: the HUD pills, the reader panel where any page opens beside a world, the Change World dialog, the curtains that wipe between worlds, and the homepage panorama of all three. On top is one world module at a time, loaded only when chosen, which restyles the shared layer through a small set of `--hud-*` and `--reader-*` custom properties and otherwise owns its own stage.

Just Read is flat, generous and calm: one rust accent that marks links and state, hairline rules instead of boxes, a 40rem reading measure. The worlds are allowed to be loud, because they are chosen. Light theme is day and dark theme is night in every mode; music never plays until pressed and is silent in Just Read.

**Key Characteristics:**
- Warm paper (#fbf8f2) and near-black ink (#1d1c1a), one rust accent (#b54a17), a cool-charcoal dark theme with a lifted orange accent.
- Source Serif 4 for everything read; Inter for everything operated.
- Flat, rule-divided Just Read; elevation belongs to the world layer.
- Every control is a pill.
- Three worlds, each with its own display face, palette, navigation idiom and synthesized track.
- Pages always open in the shared reader, re-tokened per world; the plain page is one click away.

## Colors

A warm paper-and-ink reading palette with a single rust accent, a charcoal night theme, a near-black shared world chrome, and three self-contained world palettes.

### Primary
- **Letterpress Rust** (`rust`): link underlines (1px, 2px on hover), the active nav underline, list markers, blockquote rule, outline active bar, pill hover borders, topic-link hover underlines, the essay drop cap, focus outlines, the required-field asterisk and the submit button's hover fill. Its translucent wash (`rust-wash`) is the selection colour, the input focus ring and the success status ground.
- **Ember by Night** (`night-rust`, `night-rust-wash`): the same roles in the dark theme, lifted so it stays legible on charcoal.

### Neutral
- **Warm Paper** (`paper`): the Just Read page ground and the default reader ground.
- **Paper Surface** (`paper-surface`): input fields and book-cover placeholders. **Code Paper** (`code-paper`) holds inline and block code.
- **Press Ink** (`ink`): body and heading text; the submit button and toast ground.
- **Ink 2** (`ink-2`): ledes, nav links at rest, secondary metadata. **Ink 3** (`ink-3`): dates, captions, counts, footer text.
- **Hairline Rule** (`rule`): every divider, list row and pill outline, and the resting underline of topic links.
- **Night set** (`night-bg`, `night-surface`, `night-ink`, `night-ink-2`, `night-ink-3`, `night-rule`, `night-code`): the dark theme, role for role.

### World Chrome
- **Stage Black** (`chrome-black`): the panorama frame, the Change World dialog and the fallback HUD pill ground. **Chrome Step** (`chrome-step`) is the dialog close button; **Chrome Border** (`chrome-border`) outlines the Just Read button in the dialog.
- **Chrome Paper** (`chrome-paper`) and **Chrome Muted** (`chrome-muted`): text on the dark chrome.

### Side Quest City
Dusk purple and sodium yellow over a pastel low-poly Bangalore.
- **Dusk** (`city-dusk`): HUD pills, sign backs, hazard-stripe curtain. **Dusk Sky** (`city-sky`): the stage ground before the scene paints.
- **Night Glass** (`city-panel`): translucent ground of every city overlay (place tags, location readout, travel list, hint).
- **Sodium Yellow** (`city-yellow`): the city's accent; the readout underline, the reader's 6px top band, the pin, HUD focus, the prompt ground.
- **Lavender** (`city-lavender`): secondary text in the travel list.
- **Place colours**: each section carries its own colour on its tag's top border, its leader line and its travel-list diamond: About (`city-place-about`), Writing (`city-yellow`), Work (`city-place-work`), Projects (`city-place-projects`), Library (`city-place-library`), Contact (`city-place-contact`).
- **Reader**: paper by day with `city-reader-accent`; `city-night-reader` with `city-night-accent` by night.

### Apartment 404
A warm 1990s sitcom set: mustard walls, plum and rose upholstery.
- **Plum** (`apt-plum`): HUD pills. **Set Purple** (`apt-purple`): the title card and the reader's 6px frame.
- **Mustard Wall** (`apt-mustard`), **Cream Trim** (`apt-cream`): the room itself; cream is also HUD text, object labels and the remote's text.
- **Gold** (`apt-gold`): HUD accent, active-object outline, remote focus, the title card's tagline.
- **Rose** (`apt-rose`): label headings and the day reader accent. **Curtain Red** (`apt-curtain`): the stage-curtain wipe.
- **Remote Black** (`apt-remote`), **Bubble Ink** (`apt-ink`): the remote body and the speech-bubble stroke and text.
- **Reader**: paper by day; `apt-night-reader` with gold accent by night.

### The Unfinished Atlas
Parchment, iron-gall ink and a red road.
- **Parchment** (`atlas-parchment`, `atlas-parchment-2`) for land, **Sea Vellum** (`atlas-sea`) for water, **Card Vellum** (`atlas-card`) for every overlay.
- **Iron-gall Ink** (`atlas-ink`): coastlines, hatching, text, the HUD ground. **Faded Ink** (`atlas-ink-2`): region names and subtitles.
- **Red Road** (`atlas-road`): the marching dotted road, visited stamps, hovered place names, focus, the reader accent.
- **Framing Brown** (`atlas-frame`): the 1px outer rule of every overlay and the reader. **River** (`atlas-water`), **Lantern** (`atlas-lantern`): rivers and the lantern that walks the road; lantern is also the HUD accent.
- **Reader** (`atlas-reader`): a sheet of good paper in both themes; at night only the map dims to candlelight.

### Named Rules
**The One Rust Rule.** Just Read has exactly one accent and it marks links, state and focus. It never fills a heading or a large surface; the only accent fill is the submit button's hover.

**The World Owns Its Palette Rule.** A world's colours stay inside its stage, its curtain, its panorama slice and its `--hud-*` / `--reader-*` overrides. They never leak into Just Read, and Just Read's rust never appears inside a world's stage.

## Typography

**Reading Font:** Source Serif 4 (with Georgia, Times New Roman)
**UI Font:** Inter (with system-ui, -apple-system, Segoe UI)
**Mono:** ui-monospace stack
**World display faces:** Big Shoulders Display (city), Righteous (apartment), IM Fell English and IM Fell English SC (atlas)

**Character:** A sturdy, warm text serif carries every word meant to be read, including titles and section heads; a neutral grotesk carries every word meant to be operated. Each world announces itself in a face that belongs to its place and period.

### Hierarchy
- **Display** (Source Serif 4 700, clamp(2.25rem → 3.4rem), 1.06): page and essay titles, the homepage title. Reduced to clamp(1.9rem → 2.6rem) inside the reader.
- **Headline** (Source Serif 4 600, 1.6rem): homepage section heads and the archive's year labels (year labels in ink-3, oldstyle numerals). Library and contact section heads use 1.4rem.
- **Title** (Source Serif 4 400, 1.2rem, 1.35): essay links in lists; 1.3rem 600 on the homepage "ways in" grid.
- **Lede** (Source Serif 4 400, 1.25rem, 1.55, ink-2): the sentence under a page title; the homepage lede scales to 1.45rem.
- **Body (read)** (Source Serif 4 400, clamp(1.125rem → 1.3rem), 1.65): essays and pages, 40rem measure. In-body h2 is 1.55em 600, h3 1.2em 600; tables switch to Inter at 0.9375rem with tabular numerals.
- **Body (UI)** (Inter 400, 1rem, 1.6): chrome, forms, the default page font.
- **Label** (Inter 600, 0.875rem): pills, form labels, buttons (submit and world-enter at 700). Nav links are Inter 500 at 0.9375rem; dates and counts use tabular numerals.
- **Wordmark** (Inter 800, 1.1875rem, -0.03em): the name in the header, nowhere else.

### World lettering
- **City**: Big Shoulders Display 900, uppercase, slightly tracked (0.02–0.03em). Location readout 1.6rem in sodium yellow; place tags 1.05rem in chrome paper; the reader's place name 1.35rem in the reader accent; panorama name 2.4rem.
- **Apartment**: Righteous 400. Title card 1.6rem, label headings 1.05rem in rose, reader place name 1.1rem. Painted props use Righteous too (the 404 door number, the poster).
- **Atlas**: IM Fell English SC for names (title 1.9rem, card name 1.55rem, place names on the map, legend title, reader place name); IM Fell English for prose, italic for subtitles, region names (tracked 0.18em) and notes. The reader's page and essay titles switch to IM Fell English 400.
- In every world, operational text (hints, buttons, remote labels, zoom, HUD) stays in Inter.

### Named Rules
**The Read/Operate Rule.** If you read it, it is Source Serif 4; if you press or scan it, it is Inter. Worlds add a display face for names of places; they do not replace either role.

**The Own Lettering Rule.** Each world's display face appears only in that world, its curtain-adjacent chrome and its panorama slice. Just Read never borrows one.

## Layout

Just Read is a single centered column system: a 72rem page width with a fluid gutter, and a 40rem reading measure for anything read. Vertical rhythm comes from a six-step spacing scale (0.5, 1, 1.5, 2.5, 4, 6rem): sections are separated by 4rem, page heads sit 2.5rem above content, and the main area opens with 4rem top and 6rem bottom padding.

- **Header and footer**: one flex row each, wrapping; name, nav, then controls. Under 640px the nav drops to its own full-width row.
- **Essays**: a two-column grid. The 13rem left rail is sticky and holds the meta ("Essay · N min" in ink, the date in ink-3) and, below it, the outline; the 40rem text column holds the title, the "Filed under" line and the body, whose first paragraph opens with a 3.55em rust drop cap. Under 960px (and inside a world's reader) the rail becomes a one-line meta row under the title and the outline disappears.
- **Archive**: an 8rem year column beside a 48rem list; stacks under 680px. List rows put title and date on one baseline, dates stack under titles on small screens.
- **Library**: an auto-fill grid of 2:3 covers, minimum 7.5rem.
- **Ways in**: an auto-fit grid, minimum 14rem, under a top rule.
- **Forms**: a 1rem grid; two columns from 560px.
- **World layer**: the stage is fixed full-screen; the HUD sits top-right; the reader docks right at min(46rem, 56vw) with an inset of clamp(0.75rem, 2vw, 1.25rem), and the HUD steps left to sit beside it. Under 760px the reader becomes a bottom sheet from 36% down and the HUD collapses to icons.
- **Worlds frame around the reader**: each world reframes its camera, room or map into the space left of the open reader, so the reader never covers the place it came from.

## Elevation & Depth

Just Read is flat. Depth comes from hairline rules and the paper/surface step, never from shadows, with one exception: book covers sit on a small physical shadow so they read as objects. Elevation belongs to the world layer, where things genuinely float over a moving stage, and its shadows are soft, dark and drawn downward.

### Shadow Vocabulary
- **Book cover** (`0 1px 2px rgba(0,0,0,.12), 0 10px 22px -14px rgba(0,0,0,.45)`): library covers only.
- **HUD pill** (`0 6px 18px -8px rgba(0,0,0,.55)`): floating controls over a world.
- **Music panel / toast** (`0 16px 36px -16px rgba(0,0,0,.7)` / `0 16px 40px -18px rgba(0,0,0,.7)`): small floating panels.
- **Reader** (`0 24px 60px -24px rgba(0,0,0,.7)`): the docked reading panel.
- **Dialog** (`0 40px 90px -30px rgba(0,0,0,.8)`) over a `rgba(10,10,14,.62)` backdrop.
- **Atlas framed vellum** (`0 14px 30px -18px rgba(59,42,24,.8)` plus a double inset rule, 4px card colour then 1px framing brown at 45%): every atlas overlay; the reader takes a deeper version.
- **Focus ring as glow** (`0 0 0 3px` rust wash): input focus.

### Named Rules
**The Flat Paper Rule.** Nothing on the Just Read page lifts except a book cover. Cards are rows divided by rules, not boxes.

**The Floating Layer Rule.** Shadows exist for things that float over a world: HUD, reader, dialog, toast, world overlays. They are soft and downward, never coloured.

## Shapes

Just Read is mostly unboxed: content is divided by 1px rules, and where a container is needed it takes a gentle 8px radius (code blocks, inputs, figures, status messages). Every control, from the theme toggle to the submit button, and HUD controls, is a full pill (999px). Smaller radii are functional: 2px on focus outlines, 3px on book covers, 4px on inline code. Floating panels step up with their size: 10px toast, 12px music panel, 14px panorama and reader, 16px dialog.

The panorama is the one angular form in the shared layer: three slices cut on a diagonal (clip-path at 14% / 86%), overlapping by 2.2rem, that widen to 1.4x on hover or focus; under 820px they stack and the cut turns horizontal.

Each world sets its own reader corner: city 6px (hard-edged, with a yellow top band), apartment 18px (soft, inside a 6px purple frame), atlas 4px (a sheet of paper with a framed inner rule). City overlays are square-cornered; apartment props, labels and the remote are round; atlas overlays are square with ruled frames.

## Components

### Buttons
- **Shape:** full pill (999px) for every button.
- **Control pill** (Visit a world, theme toggle): transparent, hairline border, ink text, Inter 600 0.875rem, 2.25rem tall; the theme toggle is a 2.25rem circle. Hover turns the border rust.
- **Submit:** ink fill, paper text, Inter 700 0.9375rem, padding 0.75rem 1.3rem; hover fills rust; disabled at 60% opacity with a progress cursor.
- **World enter** (panorama): Inter 700 pill in the world's own colours (yellow on dusk, cream on curtain red, ink on parchment); hover lifts 1px; focus is a 3px white ring (ink in the atlas slice).
- **Focus:** a 2px rust outline offset 3px everywhere in Just Read.

### Topic links
- **Topics** (archive and topics index): a plain wrapping run of Inter 500 0.9375rem ink-2 links with a hairline underline and a smaller ink-3 tabular count; hover turns the underline rust and the text ink. No pills. On essays the topics read as a sentence: "Filed under X, Y and Z".

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

### HUD (world layer)
Pills on the world's `--hud-bg` with `--hud-fg` text, Inter 600 0.8125rem, 2.25rem tall: Change world, Music, theme, Just Read. Hover brightens by 12%; focus is a 3px ring in `--hud-accent`. The music pill shows four small equalizer bars in the accent while playing and opens a 15rem volume panel on hover, focus or tap. On phones the pills drop their labels.

### Reader (world layer)
The shared panel every world opens pages in. A bar with a "Back to the world" pill, the place name (in the world's display face and accent) and a "Just Read" link, then a scrolling area holding the page's own Just Read markup at the 40rem measure. It slides in from the right (0.45s) or up from the bottom on phones. Each world re-tokens it by setting `--reader-bg`, `--reader-ink`, `--reader-rule`, `--reader-accent` and `--reader-radius`, and maps Just Read's own tokens (`--bg`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--accent`, `--surface`, `--code-bg`) onto them, so page content renders unchanged in the world's paper.

### Change World dialog and panorama
A stage-black dialog, 16px corners, a serif title, a close circle, the compact panorama and a "Just Read: no world, no music" outline pill. The panorama shows each world as a diagonal slice of its own SVG illustration with its name in its own lettering, a one-line description and an enter button; the current world's button reads "· you are here". On the homepage the panorama stands alone at clamp(22rem, 38vw, 32rem) tall.

### Curtains
Every switch passes through the destination's curtain (0.55s, cubic-bezier(0.65, 0, 0.35, 1)); with reduced motion the switch is instant.
- **City:** a skewed slab of yellow and dusk hazard stripes slides across, followed by a solid dusk slab.
- **Apartment:** two halves of striped red stage curtain close from the sides and reopen.
- **Atlas:** parchment spreads from the centre as a growing circle.
- **Just Read:** a fade to paper.

### World modules
Each world is an ES module (`static/js/worlds/<id>.js`) with a stylesheet (`static/css/worlds/<id>.css`), registered in `WORLDS` in `core.js` with a title, a place name per section and, for the city, a WebGL requirement. The default export implements:
- `mount(stage, api)` builds the world inside the stage (may be async; the city waits for its display fonts).
- `show(section, { instant, url })` moves to the place for `home`, `about`, `writing`, `work`, `projects`, `library` or `contact` and marks it active.
- `setReading(open)` reframes around the reader and hides overlays that would collide.
- `setTheme(theme)` relights the world for `light` (day) or `dark` (night).
- `unmount()` runs every cleanup and removes the world's root.

The `api` gives a world `data` (sections, essays, favourite books, counts), `go(section)`, `navigate(url)`, `theme()`, `reduceMotion`, `coarse`, `sfx(name)`, `toggleMusic()`, `musicPlaying()`, `toast()`, `readerRect()` and `section()`. Worlds navigate only through `go` and `navigate`; the URL stays canonical and the reader shows the real page.

### Side Quest City
A low-poly fictional Bangalore at dusk in Three.js, with game-HUD overlays in night glass.
- **Navigation:** click a building or its floating tag; a "Quick travel" list (top-left, under the location readout) with a colour diamond per place; a circular minimap (170px, yellow ring) bottom-left; drag to orbit; WASD drives an auto-rickshaw, with a yellow "Press E to enter" prompt near a door. On phones the travel list becomes a horizontal strip along the bottom and the minimap and hint hide.
- **Place tags:** night-glass labels with a 3px top border and leader line in the place's colour; hover and active fill with that colour and switch text to dusk.
- **Motion:** the camera eases toward each building (closer for most, farther for the Business District); tags fade at 0.25s; instant under reduced motion.
- **Night:** the dark theme lights the windows and lamps.
- **Music:** "Night Bus to Nowhere Nagar", lo-fi jazz at 82 bpm, swung.

### Apartment 404
An SVG sitcom set; every section is an object in the room (front door, writing desk, computer, workbench, bookshelf, telephone).
- **Navigation:** hover or focus an object to raise a cream label with its Righteous name; click or press Enter to go. A TV remote, bottom-centre, carries a round coloured button per section with Inter labels; the current section's button sits on a lighter plum. On phones the set pans sideways like a camera and the remote wraps into rows of three.
- **Objects:** on hover or focus they glow cream and do a small piece of business (the door swings, the phone rings, the flag lifts); the active object takes a gold outline, keyboard focus a dashed cream one.
- **Motion:** springy overshoot (cubic-bezier(0.34, 1.56, 0.64, 1)) for objects and speech bubbles; the record spins while music plays.
- **Night:** the window goes to dusk and the lamps come on.
- **Music:** "Brushes on a Tuesday", a swung jazz trio at 132 bpm.

### The Unfinished Atlas
An illustrated SVG map of the traveller's world; every section is a place.
- **Navigation:** drag to pan, scroll or pinch to zoom, plus/minus/fit buttons bottom-right. Click a place to unfold a vellum card with its name, a line of description and a go button; going walks a lantern along the red road. Visited places get a red stamp that persists. A cartouche top-left and a legend bottom-left (road, stamps, a visited count) step aside when the reader opens.
- **Motion:** the road's dots march continuously; waves bob, a ship sails, fog lifts over unvisited regions; cards unfold in 0.3s; place icons spring to 1.5x on hover.
- **Night:** a candlelight vignette and dimmer parchment; lamplight blends over the map.
- **Music:** "Lantern Road", slow 12/8 at 66 bpm in D dorian.

## Do's and Don'ts

### Do:
- **Do** render every page completely in Just Read first; a world is a layer over the same HTML, never a replacement for it.
- **Do** set anything read in Source Serif 4 and anything operated in Inter, inside worlds too.
- **Do** keep Just Read's rust on links, markers, focus and state only (the One Rust Rule).
- **Do** make every control a pill (999px) and divide Just Read content with 1px rules rather than boxes.
- **Do** give a new world the full set: a module implementing mount / show / setReading / setTheme / unmount, a stylesheet that sets `--hud-*` and `--reader-*`, a curtain, a panorama slice, a place per section, a day and a night, and an original synthesized track.
- **Do** open pages from a world in the shared reader and frame the world around it.
- **Do** honour reduced motion: curtains skip, cameras jump, transitions collapse.
- **Do** keep music off until pressed, and silent in Just Read.
- **Do** name employers in the worlds by name only.

### Don't:
- **Don't** put Just Read content behind a world, a WebGL check or an animation; without WebGL the city declines with a toast and the visitor stays reading.
- **Don't** let one world's palette or display face appear in Just Read or in another world.
- **Don't** add drop shadows to Just Read surfaces other than book covers.
- **Don't** fill headings or large surfaces with the rust accent.
- **Don't** add a place to a world that does not map to a real section of the site.
- **Don't** put logos or brand colours on employer buildings or places.
- **Don't** put small uppercase labels (kickers) above world names or headings; each world announces itself in its own lettering.
- **Don't** use hard offset shadows; floating layers use soft, downward shadows only.

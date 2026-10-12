---
name: Mohit Ranka
description: A writer's notebook kept in public; one paper sheet on a dot-grid desk, written in blue-black ink with a fountain-pen blue.
colors:
  pen-blue: "#2348a8"
  pen-blue-night: "#93adff"
  pen-wash: "rgba(35, 72, 168, 0.1)"
  pen-wash-night: "rgba(147, 173, 255, 0.14)"
  on-pen: "#ffffff"
  on-pen-night: "#0d1222"
  paper: "#fbfaf6"
  paper-night: "#15171c"
  desk: "#efede6"
  desk-night: "#0d0f13"
  desk-dot: "#d3cfc3"
  desk-dot-night: "#262a33"
  paper-shade: "#f2f0e9"
  paper-shade-night: "#1c1f26"
  code-paper: "#f0eee7"
  code-paper-night: "#1d2029"
  ink: "#1c1d22"
  ink-night: "#e7e9ef"
  ink-soft: "#464852"
  ink-soft-night: "#b7bbc7"
  ink-faint: "#676a74"
  ink-faint-night: "#8d92a0"
  rule: "#e2dfd6"
  rule-night: "#2b2f39"
typography:
  display:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.1rem, 1.3rem + 3.2vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.1rem, 1.3rem + 3.2vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline-sm:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.012em"
  title-sm:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-reading:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Literata, Georgia, 'Times New Roman', serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  hand:
    fontFamily: "Kalam, 'Bradley Hand', cursive"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.3
  hand-year:
    fontFamily: "Kalam, 'Bradley Hand', cursive"
    fontSize: "1.75rem"
    fontWeight: 400
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.85em"
rounded:
  hairline: "2px"
  sm: "4px"
  pill: "999px"
spacing:
  "1": "0.5rem"
  "2": "1rem"
  "3": "1.5rem"
  "4": "2.5rem"
  "5": "4rem"
  gutter: "clamp(1rem, 4vw, 3rem)"
  page: "72rem"
  text: "42rem"
components:
  button-primary:
    backgroundColor: "{colors.pen-blue}"
    textColor: "{colors.on-pen}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.3rem"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 0.8rem"
  tag-chip:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.6rem"
  tag-chip-hover:
    textColor: "{colors.pen-blue}"
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.ui}"
    padding: "0.25rem 0"
  nav-link-current:
    textColor: "{colors.ink}"
  essay-row:
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
    padding: "1rem 0"
  margin-note:
    textColor: "{colors.pen-blue}"
    typography: "{typography.hand}"
  book-cover:
    backgroundColor: "{colors.paper-shade}"
    rounded: "{rounded.sm}"
---

# Design System: Mohit Ranka

## Overview

**Creative North Star: "The Writer's Notebook"**

The whole site is one plain paper sheet laid on a dot-grid desk. The desk shows at the sheet's left and right edges as a 22px dot grid; everything that matters sits on the sheet. Everything is written in blue-black ink, and one fountain-pen blue does every job an accent does: links, underlines, focus, list markers, and the handwritten margin notes. The opening sentence is the navigation. Each of its verbs (builds, leads, reads, writes) is underlined in pen blue and opens its own section.

Density is a reader's density. Essays run at a 42rem measure with a 1.7 line height. Homepage sections ("shelves") put a label column on the left and content on the right, divided only by hairline rules. Real book covers are the only imagery and the only objects that cast a shadow. Light and dark are the same notebook: by day, and under a desk lamp at night. The reader switches between them with the header toggle; the first visit follows the system preference.

The world refuses the bare name-tagline-post-list default and anything that reads as a pitch. Nothing is decorated for its own sake: there are no illustrations, no gradients beyond the pen underline, and no cards floating on the sheet.

**Key Characteristics:**
- A paper sheet on a dotted desk; the sheet is the only surface.
- One accent, pen blue, used for every link and every handwritten note.
- Literata for reading and headings, Bricolage Grotesque for small labels and controls, Kalam only for short margin notes and year markers.
- Hairline rules divide content; nothing else does.
- Book covers are the only imagery and the only lifted objects.
- Light and dark are user-toggled and default to the system preference.

## Colors

A warm paper-and-ink palette with a single cool pen blue. Every color has a night counterpart, and both themes use the same roles.

### Primary
- **Fountain-Pen Blue** (pen-blue; night: pen-blue-night): every link underline, link hover color, focus outline, list marker, blockquote rule, required-field asterisk, margin note, and the archive's handwritten years. When a verb in the identity sentence is hovered, pen blue floods behind it as a full highlight with on-pen text.
- **Pen Wash** (pen-wash / pen-wash-night): text selection, the input focus halo, and the success status background.

### Neutral
- **Paper** (paper / paper-night): the sheet itself, and the background of input fields.
- **Desk** (desk / desk-night) with **Desk Dot** (desk-dot / desk-dot-night): the page background outside the sheet, drawn as a 1.1px dot on a 22px grid.
- **Paper Shade** (paper-shade / paper-shade-night): the slightly darker paper behind a cover before it loads, the contact form card, and the theme toggle's hover disc.
- **Code Paper** (code-paper / code-paper-night): inline code and code blocks.
- **Ink** (ink / ink-night): headings, titles, body text.
- **Soft Ink** (ink-soft / ink-soft-night): ledes, excerpts, roles, nav links at rest.
- **Faint Ink** (ink-faint / ink-faint-night): labels, dates, authors, counts, footer.
- **Rule** (rule / rule-night): every hairline divider, the chip and input borders, and the sheet's edges.

### Named Rules
**The One Pen Rule.** Pen blue is the only accent. If something needs emphasis that is not a link, a note, or focus, it gets weight or ink, not a new color.

**The Ink Link Rule.** Links keep their surrounding ink color and carry a 1.5px pen-blue underline offset 0.2em. On hover the text turns pen blue and the underline thickens to 2.5px. Links are never set as solid blue text at rest.

## Typography

**Display Font:** Literata (with Georgia, Times New Roman)
**Body Font:** Literata
**Label/UI Font:** Bricolage Grotesque (with ui-sans-serif, system-ui)
**Hand Font:** Kalam (with Bradley Hand, cursive)

**Character:** Literata is the notebook's writing: a bookish serif carrying both the display sentence and long reading. Bricolage Grotesque is the printed furniture of the page (labels, nav, controls, captions). Kalam is the owner's pen in the margin. All three are self-hosted WOFF2 files under the OFL.

### Hierarchy
- **Display** (600, step-4 clamp 2.1–3.6rem, 1.12, -0.025em): the homepage identity sentence only, at a 20ch measure.
- **Headline** (600, step-4, 1.06, -0.03em): essay titles and page titles.
- **Headline Small** (600, step-3 clamp 1.75–2.5rem, -0.02em): h2 inside Markdown pages.
- **Title** (600, 1.5rem, 1.15): shelf headings, section titles, essay h2, comments and form headings.
- **Title Small** (600, 1.1875rem, 1.3): essay-row titles. Work entry and essay h3 use 1.25rem; book titles use 0.9375rem.
- **Body Reading** (400, 1.1875rem, 1.7): essay body at 42rem max. Markdown pages use 1.65 line height, and ledes use 1.55 in soft ink.
- **Body** (400, 1rem, 1.6): base text. Excerpts and work descriptions use 0.9375rem with a 1.55 line height.
- **UI** (Bricolage 500–600, 0.9375rem): nav, "All N essays" links, shelf descriptions, form leads.
- **Label** (Bricolage 600, 0.8125rem, 0.06em, uppercase, faint ink): dates, Older/Newer, the article meta line. Pills use the same treatment at 0.6875rem.
- **Hand** (Kalam 400, 1.125rem, 1.3, rotated -1.5deg): margin notes. Year markers use 1.0625rem in the Library, 1.25rem beside essays, and 1.75rem in the Writing archive.

### Named Rules
**The Margin Fact Rule.** Kalam appears only in short margin notes and year markers. A note states a fact taken from the site (a first entry, a count, a date read), never an invented opinion, and stays within a sentence.

**The Labels Follow Rule.** Uppercase labels are metadata that sits under or beside the thing they describe (a date under a title). They are never a kicker or eyebrow placed above a heading.

## Layout

The sheet is centered and capped at the 72rem page width plus gutters plus 4rem. Its edges are drawn with 1px rule-colored side shadows, and the desk shows beyond them. Content sits in a 72rem wrap with a fluid gutter (clamp 1–3rem). Reading surfaces (essays, page heads, comments, Markdown pages) cap at the 42rem text width.

The spacing scale is 0.5 / 1 / 1.5 / 2.5 / 4rem. Page and article heads open with 4rem above and 2.5rem below. Shelves have 2.5rem padding and a hairline top rule. Essay rows have 1rem padding and hairlines between rows.

Homepage shelves are a two-column grid: a label column of minmax(10rem, 14rem), then content, with a 2.5rem gap. It collapses to one column at 760px. Work entries sit two up and collapse at 640px. The Writing archive puts the year in the margin, using a minmax(6rem, 10rem) column beside the text measure, and collapses at 640px.

Books use an auto-fill grid of 8.5rem minimums with a 1.5rem gap. From 900px up it locks to exactly seven columns. Below 900px the homepage favourites become one sideways-scrolling, snap-aligned row of 7.5rem covers.

Margin notes behave responsively. The intro note sits absolutely at the sheet's right edge and drops inline below 1000px. The essay-list note hides below 1240px. The essay date in the left margin hides below 1100px.

## Elevation & Depth

The sheet is flat. Depth exists in exactly two places: the sheet's 1px edge against the desk, and the book covers. Covers carry a two-layer shadow so they read as physical objects resting on the paper, and they lift 4px on hover. Nothing else is lifted. Inputs show focus with a 3px pen-wash halo, not a shadow.

### Shadow Vocabulary
- **Book on paper** (`box-shadow: 0 1px 2px rgba(28, 29, 34, 0.08), 0 8px 24px -12px rgba(28, 29, 34, 0.3)`; night: `0 1px 2px rgba(0, 0, 0, 0.5), 0 10px 28px -14px rgba(0, 0, 0, 0.85)`): book covers only.
- **Sheet edge** (`box-shadow: 1px 0 0 var(--rule), -1px 0 0 var(--rule)`): the page sheet against the desk.

### Named Rules
**The Only Objects Rule.** Book covers are the only things on the sheet that cast a shadow. Text, lists, chips, and sections are ink on paper, divided by hairlines.

## Shapes

Corners are nearly square. Covers are cut like a bound book (2px at the spine, 4px at the fore-edge). Code blocks, inputs, the submit button, and figures use 4px. Inline code uses 3px. Chips, pills, and area tags are full pills (999px) with a 1px rule border. The theme toggle is the only circle. Rules are always 1px. Pen strokes are 1.5px: the leader dash before a margin note and the blockquote rule.

## Components

### Buttons
Quiet and inky. There is one filled button, used for the contact form.
- **Shape:** gently squared (4px).
- **Primary:** pen-blue fill with on-pen text, Bricolage 600 at 1rem, 0.75rem × 1.3rem padding.
- **Hover / Focus:** brightness(1.08) on hover; 2px pen-blue outline offset 3px on focus. Disabled is 60% opacity with a progress cursor.
- **Icon button (theme toggle):** a 2rem round button holding an 18px stroked sun or moon in soft ink. On hover the icon goes to ink over a paper-shade disc.

### Chips
- **Style:** a transparent pill with a 1px rule border, Bricolage 500 at 0.8125rem, soft ink. Used for tags.
- **State:** on hover, the border and text turn pen blue. The "Open source" pill is a non-interactive variant: 0.6875rem, uppercase, faint ink.

### Cards / Containers
Containers are rare. The contact form is the only boxed card: paper-shade background, 1px rule border, 8px corners, 1.5rem padding. Everything else (work entries, principles, shelves) is separated by a top hairline, not boxed.

### Inputs / Fields
- **Style:** paper background, 1px rule border, 4px corners, 0.7rem × 0.8rem padding, Bricolage at 1rem. Labels are Bricolage 600 at 0.875rem. The required mark is pen blue; "optional" is faint ink.
- **Focus:** the border turns pen blue with a 3px pen-wash halo.
- **Status:** success sits on a pen-wash background. Error currently uses a hard-coded red border with no night counterpart. That is recorded drift, not a system color; theme it before reusing it.

### Navigation
The header is slim: the name in Literata 600 at 1.1875rem on the left; Writing, Work, Library, and Contact in Bricolage 500 at 0.9375rem in soft ink on the right, followed by the theme toggle. On hover a link goes to ink. The current section is ink with a 2px pen-blue underline offset 0.35em. The header wraps on narrow screens. The footer repeats the name and external links in faint and soft ink, with pen blue on hover.

### Identity Sentence (signature)
The homepage h1 is a Display sentence whose four verb phrases are links. Each link carries a pen-blue underline drawn as a background bar 0.09em tall. On load the underlines draw in left to right over 0.9s, staggered 0.12s apart, and only when motion is allowed. On hover or focus the bar grows to fill the whole phrase and the text turns on-pen.

### Margin Note (signature)
A short Kalam aside in pen blue, rotated -1.5deg, usually led by a 1.5px pen-blue dash. It sits in the sheet's margin beside the content it annotates: the first entry beside the identity sentence, the essay count beside the list, the date beside an essay title, and "read in YEAR" above the first book of each year.

### Essay Row
Each row has the title in Literata 600 (1.1875rem), then a faint uppercase date label, then a soft-ink excerpt capped at 40rem. Rows are separated by hairlines, and the whole row is one link. On hover only the title turns pen blue.

### Book Card
A 2:3 cover with bound-book corners and the book shadow, followed by the title in Literata 600 (0.9375rem) and the author in Bricolage at 0.8125rem in faint ink. On hover the cover lifts 4px over 0.35s and the title turns pen blue. Covers are real covers only, carried as provenance-tagged rasters.

## Do's and Don'ts

### Do:
- **Do** use pen blue for every link underline, margin note, focus ring, and list marker, and for nothing decorative beyond that.
- **Do** separate content with 1px rule hairlines, not boxes or backgrounds.
- **Do** keep reading text in Literata at the 42rem measure with a line height of 1.65–1.7.
- **Do** write margin notes in Kalam that state only facts found on the site (a year, a count, a title), in a sentence or less.
- **Do** define every color for both themes, and let the header toggle switch between them; the first visit follows the system preference.
- **Do** use real book covers as the only imagery. Embed provenance in every shipping raster: og.png is a rendered HTML card; 27 covers are sourced from Goodreads RSS; Ikigai (40534545) comes from Open Library (ISBN 9781786330895), border-trimmed by hand. `COVER_OVERRIDES` in `scripts/sync_library.py` re-fetches that override untrimmed if `content/images/library` is cleared, so re-trim it and re-embed its provenance. New covers added by future syncs need provenance embedded with `impeccable embed-prompt`.
- **Do** gate entrance motion behind `prefers-reduced-motion: no-preference`, and use the single `cubic-bezier(0.16, 1, 0.3, 1)` ease-out for transitions.

### Don't:
- **Don't** add a second accent color. Emphasis comes from weight and ink, not a new hue.
- **Don't** use Kalam for headings, body, buttons, or anything longer than a short note or a year.
- **Don't** put uppercase labels above headings as kickers or eyebrows. Labels sit under or beside what they describe.
- **Don't** give shadows to anything but book covers. Cards, chips, and sections stay flat.
- **Don't** add illustrations, stock imagery, or icon glyphs in place of words. The only icons are the stroked sun and moon in the theme toggle.
- **Don't** hard-code colors that skip the night theme. Every value needs a night counterpart.

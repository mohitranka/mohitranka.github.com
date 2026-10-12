---
name: Mohit Ranka
description: A quiet slate reading site, with a walkable low-poly island town as the homepage's first viewport.
colors:
  slate-night: "#0f172a"
  slate-mist: "#f8fafc"
  slate-wash: "#f1f5f9"
  slate-hairline: "#e2e8f0"
  slate-silver: "#cbd5e1"
  slate-steel: "#94a3b8"
  slate-pewter: "#64748b"
  slate-graphite: "#475569"
  slate-deep: "#1e293b"
  town-ink: "#14161b"
  town-ink-2: "#23262e"
  town-paper: "#fffaf0"
  town-muted: "#a9adb8"
  forge-ember: "#ff8a2a"
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
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  town-title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
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
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
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
  md: "6px"
  lg: "8px"
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
    backgroundColor: "{colors.slate-mist}"
    textColor: "{colors.slate-night}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.slate-mist}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  tag-chip:
    backgroundColor: "transparent"
    textColor: "{colors.slate-steel}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  input:
    backgroundColor: "{colors.slate-night}"
    textColor: "{colors.slate-mist}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  town-card:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.panel}"
    padding: "1.2rem 1.3rem 1.15rem"
    width: "23rem"
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
  town-hint:
    backgroundColor: "{colors.town-ink}"
    textColor: "{colors.town-paper}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.8rem"
---

# Design System: Mohit Ranka

## Overview

**Creative North Star: "The Quiet Desk and the Island Town"**

The site is two layers. Underneath is an incumbent reading desk: a single 720px column of Inter on a slate ground, dark by default with a light alternative, flat, hairline-bordered and almost colourless. Hierarchy comes from weight (500 to 600) and from the step between primary and secondary text, never from colour. The writing is the product and the chrome stays out of its way.

On top, only on the homepage, sits the town: a full-screen, low-poly, flat-shaded island built in Three.js (vendored r160) from primitives, toy-scale and warm. The visitor walks Mohit's character between seven buildings (Forge, Writing print shop, Library bookshop, Booking.com, Postman and LinkedIn offices, Contact post box), and each building is a real section of the site. The town follows the site theme: the light theme is a sunny day, the dark theme is a moonlit night with lit windows, lamps and a glowing forge. Its UI overlay is the site's Inter set heavier (700 to 800) on solid ink panels with paper text and a single forge-ember accent.

The two layers meet at the type family and at the theme switch. Below the first viewport the incumbent theme resumes untouched, and when WebGL is unavailable the town collapses to a compact ink card on the site's own ground.

**Key Characteristics:**
- Inter everywhere; weight carries hierarchy (500 on the desk, 700 to 800 in the town).
- Desk: slate grayscale, flat, hairline borders, one 720px column.
- Town: low-poly flat-shaded primitives, warm day palette, moonlit night palette, forge ember as the one UI accent.
- The town is driven by `data-theme`; day is light, night is dark.
- Every place in the town maps to a real page; names only, no logos or brand colours.

## Colors

The desk is a cool slate grayscale with no accent; the town is a warm toy palette whose UI speaks only in ink, paper and ember.

### Primary
- **Forge Ember** (forge-ember): the town's single interactive accent. Hover and near states on labels and place buttons, the Enter pill, focus outlines, link underlines inside the panel. Also the in-world forge coals, firelight and FORGE sign. Never used on the desk.

### Secondary
- **Town Ink** (town-ink): solid ground of every town overlay (card, panel, hint pill) and text on paper and ember surfaces. Town Ink 2 (town-ink-2) is its lifted step.
- **Town Paper** (town-paper): warm off-white for overlay text, floating name labels and the Skip pill. Translucent paper (rgba(255, 250, 240, 0.28)) outlines place buttons; at 0.12 it rules panel list rows; at 0.16 it fills kbd chips.
- **Town Muted** (town-muted): secondary overlay text (the intro line, panel body, list metadata).

### Tertiary (the island's world palette, in town.js PALETTE)
- **Day:** Day Sky (fog #b9e0ec), Day Sea (foam #e9f6fb), Sand, Grass (dark #6fae55), Path, Cream Wall, stone #b9b2a4, wood #8a5a3b. Roofs rotate through Terracotta, Slate, Teal and Ochre so each building reads apart. Post Red is the Contact post box. The character wears a #2f6fd6 shirt.
- **Night:** Night Sky (fog #13213d), Night Sea (foam #5f7fa3), moonlight #a9bdff, Window Glow and lamp glow #ffd28a, moon #f6f1d8 with a #bfd0ff halo, white stars. Tone-mapping exposure rises from 1.0 to 1.15.

### Neutral
- **Slate Night** (slate-night): dark-theme ground; light-theme text.
- **Slate Mist** (slate-mist): dark-theme text; light-theme ground. Primary buttons invert it against the ground.
- **Slate Steel / Slate Pewter** (slate-steel, slate-pewter): secondary text and link underlines in dark / light.
- **Slate Silver / Slate Graphite**: link-underline hover in dark / light.
- **Slate Deep** (slate-deep): dark-theme borders and code background.
- **Slate Hairline / Slate Wash**: light-theme borders and code background.

### Named Rules
**The Two Grounds Rule.** The desk has no accent colour; the town has exactly one (Forge Ember). Ember never leaves the town, and slate never styles a town overlay.

**The Theme Is the Clock Rule.** The town has no time-of-day control of its own. Light theme is day, dark theme is night, and switching the site theme relights the island live.

**The Names Only Rule.** Employer buildings carry their names as text on plain signs and labels, never logos or brand colours. Roof colours come from the island palette.

## Typography

**Display Font:** Inter (variable 100 to 900, self-hosted woff2, Latin and Latin-1 subset), fallback system-ui, -apple-system, Segoe UI, sans-serif
**Body Font:** Inter
**Label/Mono Font:** ui-monospace stack for code only

**Character:** One family doing two jobs. On the desk Inter is set light-handed (500 for headings, slightly tight tracking, cv11 and ss01 features on). In the town the same family turns heavy and compact (800 at line-height 1.05) to read like a painted sign over a 3D scene.

### Hierarchy
- **Town Display** (800, clamp(1.5rem, 1.2rem + 1.2vw, 2rem), 1.05): "Hi, I'm Mohit Ranka" on the town card. Once per page.
- **Display** (600, 1.75rem, 1.25): the homepage hero headline below the town (1.5rem under 640px).
- **Headline** (500, 1.625rem rising to 1.75rem at 640px+, 1.25): article titles. Page h1 is 500, 1.5rem, 1.3.
- **Title** (500, 1.125rem, 1.3): h2, site logo, form and comment headings. The town panel title is 800, 1.25rem.
- **Body** (400, 1rem, 1.75): article prose, kept within the 720px column. Secondary paragraphs and lists use 0.9375rem at 1.75 in secondary colour.
- **Label** (500, 0.8125rem, 0.02em, sentence case): section labels, metadata, form labels. Town labels and place buttons are 600 to 700 at 0.875rem, line-height 1.

### Named Rules
**The Weight Not Colour Rule.** Hierarchy is weight and the primary/secondary text step. No coloured headings anywhere.

**The Heavy Town Rule.** Weights 700 and 800 belong to the town overlay; the desk tops out at 600.

## Layout

The desk is one centred column (720px max, padding 48px 24px 120px; 32px 20px 80px under 640px) on an 8px spacing scale (space-1 to space-8). The header is a baseline-aligned row of logo, nav and theme toggle over a hairline rule.

The town is a full-viewport section (100svh, min 560px) above that column. A high three-quarter camera follows the character, aimed ahead so the arc of buildings fills the upper two-thirds (fov 32 on landscape, pulled back 1.35x under aspect 1.3; fov 60 with a steeper offset and a 1.5x character on portrait). Overlays are anchored to corners with a clamp(1rem, 3vw, 2rem) inset: the intro card bottom-left (max 23rem), the place panel bottom-right (max 24rem), the hint and Skip pills top-right. Under 640px or on touch, the card spans the width and drops its intro line, the panel replaces the card while open (max 52% height), and the hint switches to "Tap anywhere to walk there". Floating labels resolve overlaps nearest-first, and label and obstacle measurements are cached per resize.

Without WebGL the section becomes a static ink card at the column's width (margin 32px auto 8px) with Library and Forge links, then the desk.

**The Corners Are Clear Rule.** Town overlays sit only in corners, so the buildings across the top and centre of the frame are never covered.

## Elevation & Depth

The desk is flat: no shadows, depth by hairline borders and the code-background tone. The only desk shadow is the 3px focus halo on inputs. The town is lit and layered: real-time sun and hemisphere light with cast shadows and fog in the scene, and soft, negative-spread drop shadows that lift the overlays off it.

### Shadow Vocabulary
- **Overlay lift** (`box-shadow: 0 18px 44px -18px rgba(0, 0, 0, 0.7)`): the town card and panel.
- **Pill lift** (`box-shadow: 0 6px 14px -6px rgba(20, 22, 27, 0.55)`): floating name labels and the Skip pill.
- **Input focus halo** (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--fg-secondary) 18%, transparent)`): desk form fields.

### Named Rules
**The Flat Desk Rule.** Desk surfaces carry no drop shadow; shadows belong to things floating over the 3D town.

## Shapes

Desk corners are gentle and small: 6px for buttons, inputs and figures, 8px for the contact card, 4px for code blocks and kbd, 2px for focus rings and book-cover thumbnails. Tags are full pills. The town's UI is rounder and toy-like: 14px overlay panels and full pills for every control. In the world, geometry is faceted primitives (four-sided cone roofs, sawtooth and stepped office blocks, low-segment trees) with flat shading and roughness 0.85.

## Components

### Buttons
- **Shape:** gently curved (6px) on the desk; full pills in the town.
- **Primary:** inverted text-on-ground (ground colour on the foreground colour), 500 0.875rem, 10px 18px. Hover drops opacity to 0.9.
- **Secondary:** transparent with a hairline border; hover strengthens the border to secondary text colour.
- **Town Enter:** ember pill, ink text, 700 0.9375rem, 0.6rem 1rem; hover brightens 6%.
- **Town Place Button:** transparent pill with a translucent paper outline, 600 0.875rem; hover fills ember with ink text. Pressing one walks the character to the place.
- **Focus:** desk uses a 2px secondary-colour outline; town uses a 3px ember outline at 2px offset. The canvas shows an inset 3px ember ring.

### Chips
- **Style:** tag chips are transparent pills (0.75rem, hairline border, secondary text); hover lifts text and border.
- **Kbd chips** in the town hint: 600 0.75rem on 16% paper, 4px radius.

### Cards / Containers
- **Desk:** contact card has a hairline border, 8px radius, 24px padding, transparent ground.
- **Town card and panel:** solid ink, 14px radius, overlay lift, paper text. Panel rows are separated by 12% paper rules and may lead with a 28x42px cover thumbnail. With the panel open, the card collapses to its place buttons.

### Inputs / Fields
- **Style:** 6px radius, hairline border, ground-coloured fill, 10px 12px, 0.9375rem.
- **Focus:** border shifts to secondary text colour plus the 3px halo; no outline.
- **Status:** success and error notes tint the ground with 10% green or 8% red via color-mix.

### Navigation
- **Desk:** 0.875rem secondary-colour links, no underline; hover and current page turn primary, and current page gains an underline at 3px offset. The theme toggle is a 16px stroked SVG sun/moon.
- **Town:** the place buttons are the navigation; "Skip to the site" is a paper pill that jumps to the desk.

### Floating Name Labels (signature)
Paper pills (700 0.875rem) projected over each building like painted shop signs, turning ember when the character is near or on hover. They are click targets for pointer users only (tabindex -1); keyboard users walk via the place buttons. Overlapping labels hide nearest-first.

### Proximity Panel (signature)
Opens bottom-right when the character arrives at a building (the character hops and turns to face it; the hop is skipped under reduced motion). It fades in and rises 12px over 0.35s with cubic-bezier(0.16, 1, 0.3, 1), shows the place's facts (latest essays, favourite covers, roles, Forge summary) and one ember Enter link into the real page.

### Imagery and Provenance
- **Book covers** (content/images/library, listed in data/library.json) are sourced from the Goodreads RSS shelf by scripts/sync_library.py and appear as textures in the bookshop window and as 28x42px thumbnails (2px radius) in the Library panel. Ikigai comes from Open Library (ISBN 9781786330895) and was hand-trimmed; its entry in COVER_OVERRIDES re-fetches the untrimmed cover if the covers are cleared.
- **og.png** is a rendered HTML card, not a photograph or generated image.
- Every shipped raster carries embedded provenance; covers added by a future sync need `impeccable embed-prompt`.

### Town Runtime Hooks
- Loading `?debug` exposes `window.__town` for stepped tests that advance the simulation without rendering.
- The town adds `town--ready` once the world has loaded (labels and hint are hidden until then), `town--night` for the dark theme, and `town--fallback` when WebGL is unavailable.

## Do's and Don'ts

### Do:
- **Do** keep Forge Ember (#ff8a2a) as the town's only UI accent and keep it off the desk.
- **Do** relight the town from `data-theme`: light is day, dark is night.
- **Do** build new places from flat-shaded primitives in the PALETTE, with a plain text sign and a door facing the plaza.
- **Do** anchor town overlays to corners with the clamp(1rem, 3vw, 2rem) inset and solid ink grounds, never translucent glass.
- **Do** keep the no-WebGL path a single compact ink card with real links, followed by the desk.
- **Do** give every shipped raster embedded provenance. New Goodreads covers from a future sync need `impeccable embed-prompt`.

### Don't:
- **Don't** put logos or brand colours on the employer buildings; names only.
- **Don't** add a town place that doesn't map to a real section of the site.
- **Don't** give desk surfaces drop shadows or an accent colour; depth there is hairlines and tone.
- **Don't** use weights above 600 on the desk.
- **Don't** let an overlay cover the buildings across the top of the frame.

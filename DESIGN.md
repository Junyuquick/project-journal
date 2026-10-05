---
name: Project Journal
description: A personal learning journal drawn as an MRT network map; every project a line, every chapter a station.
colors:
  line-claude: "#005ec4"
  line-you: "#009645"
  line-others: "#9900aa"
  badge-claude: "#005ec4"
  badge-you: "#007a3a"
  badge-others: "#8a0099"
  text-you: "#007a3a"
  line-loft-concept: "#FA9E0D"
  ground: "#f3f4f2"
  ground-raised: "#ffffff"
  ink: "#16181b"
  ink-soft: "#4a4f57"
  rule: "#d3d6da"
  track: "#c4c8cd"
  station-fill: "#ffffff"
  code-ground: "#e7e9ec"
  selection: "#cfe0f7"
  night-ground: "#111316"
  night-ground-raised: "#191c20"
  night-ink: "#eef0f2"
  night-ink-soft: "#a7adb6"
  night-rule: "#2c3036"
  night-track: "#3c424a"
  night-code-ground: "#1d2126"
  night-selection: "#1d3d66"
  night-line-claude: "#3b8cf0"
  night-line-you: "#1fb866"
  night-line-others: "#c04fd1"
typography:
  display:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.4rem + 1.6vw, 2.5rem)"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline-sm:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Atkinson Hyperlegible Next Variable', 'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  lede:
    fontFamily: "'Atkinson Hyperlegible Next Variable', 'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    lineHeight: 1.25
  station-code:
    fontFamily: "'Overpass Variable', 'Overpass', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "0.02em"
  code:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  cap: "3px"
  code: "4px"
  pre: "6px"
  panel: "8px"
  card: "10px"
  pill: "999px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "48px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "48px"
  badge-claude:
    backgroundColor: "{colors.badge-claude}"
    textColor: "#ffffff"
    typography: "{typography.station-code}"
    rounded: "{rounded.pill}"
    padding: "0.4em 0.7em 0.3em"
  badge-you:
    backgroundColor: "{colors.badge-you}"
    textColor: "#ffffff"
    typography: "{typography.station-code}"
    rounded: "{rounded.pill}"
    padding: "0.4em 0.7em 0.3em"
  badge-others:
    backgroundColor: "{colors.badge-others}"
    textColor: "#ffffff"
    typography: "{typography.station-code}"
    rounded: "{rounded.pill}"
    padding: "0.4em 0.7em 0.3em"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem"
    height: "44px"
  nav-link-hover:
    backgroundColor: "{colors.code-ground}"
  theme-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem"
    height: "44px"
  term-popover:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1rem"
    width: "22rem"
  code-inline:
    backgroundColor: "{colors.code-ground}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.code}"
    padding: "0.1em 0.35em"
---

# Design System: Project Journal

## Overview

**Creative North Star: "The Network Map"**

The site is drawn as a transit map in the Singapore MRT idiom. Every project is a coloured line, every chapter a numbered station, and the people who did the work (Claude, You, Others) are fixed line colours that run as continuous lanes down the timeline. The reader sees the network, boards a line, rides it station by station with a door strip overhead, and changes lines on the timeline. Wayfinding is the content's skeleton, not an ornament laid over a docs template.

The ground is a cool map grey by day and a platform-screen night in dark mode. Strokes are uniform and geometric (a 6px line weight for routes, lanes, strips and line rules, with the Home network trunk the one heavier 10px line; all routed only at 0, 45 and 90 degrees), stations are white discs ringed in their line's colour, and interchanges are white capsules outlined in ink. Signage type (Overpass) carries every code, heading and label; a reading face built for legibility (Atkinson Hyperlegible Next) carries the prose. Colour is information: it says who did the work or which line you are on, never decoration.

Density is calm and generous. Pages are single-column reading measures with the map device at their head; the only raised surface is the glossary popover. Motion is short, eased out, and limited to state (a station grows on hover, a route draws in once, the "you are here" ring breathes), all of it removed under reduced motion.

**Key Characteristics:**
- Fixed contributor line colours across every project: DTL blue for Claude, EWL green for You, NEL purple for Others.
- Each project owns one line colour and a two-letter code (Loft Concept: CCL orange, LC); stations are coded LC01, LC02...
- One line weight (6px) and three angles (0/45/90); only the Home network trunk runs heavier (10px).
- Pill-shaped line badges and station codes, as on platform signage.
- Ink rings mark only where the reader is: the current station or the stored reading position.
- Flat surfaces; depth only for the floating glossary popover.

## Colors

A neutral cool-grey map with saturated transit line colours used strictly as signal.

### Primary
- **Downtown Line Blue** (line-claude): Claude's line, lane, station ring and badge everywhere. Brightened to night-line-claude in dark mode.
- **East-West Line Green** (line-you): the owner's line, lane and station ring. Brightened to night-line-you in dark mode.
- **North-East Line Purple** (line-others): other collaborators; appears only on projects that have them.

### Secondary
- **Deepened Badge Grounds** (badge-claude, badge-you, badge-others): the same three lines prepared to carry white text at 4.5:1 or better. The green is deepened (badge-you) because the true EWL green cannot hold white text. These stay constant in dark mode.

### Tertiary
- **Project Line Colours** (line-loft-concept, Circle Line orange): each project supplies its own line colour and a text ink choice (dark `#16181b` or white) from its content file. The colour fills the line, the terminus badge, station codes and ridden stations; the declared ink sets text on it.

### Neutral
- **Map Grey** (ground) / **Platform Night** (night-ground): page ground.
- **Raised White** (ground-raised): the popover surface only.
- **Signage Ink** (ink) and **Soft Ink** (ink-soft): text, outlines, interchange rings, the primary button ground; soft ink for metadata, captions, analogies, station codes on the map.
- **Rule** (rule): hairline dividers (1px) under the header, between days, events and glossary terms.
- **Unlit Track** (track): scrollbars and the dashed frames around evidence notes and empty states. Reconstructed timeline lanes are dashed in their own line colour, not in track.
- **Station White** (station-fill): unridden station discs; matches the ground in dark mode so stations read as hollow rings.
- **Code Ground** (code-ground): inline code, code blocks, revealed answers, nav hover.
- **Selection Blue** (selection): text selection and the targeted glossary term (mixed at 55%).

### Named Rules
**The Colour Is Who Rule.** Contributor colours are fixed across every project and mean only who did the work. Never use them for emphasis, status or decoration, and never reassign them per project.

**The Signal Over Text Rule.** Line colours are strokes and fills. Any text set in, or on, a contributor colour uses the deepened badge value, not the raw line value.

## Typography

**Display Font:** Overpass Variable (with system-ui)
**Body Font:** Atkinson Hyperlegible Next Variable (with system-ui)
**Label/Mono Font:** Overpass Mono Variable (with ui-monospace)

**Character:** Overpass is the road-and-transit signage face, heavy and tight for codes and headings; Atkinson Hyperlegible Next is a reading face designed for low-vision legibility, which suits a beginner studying long explanations on a phone.

### Hierarchy
- **Display** (800, fluid 2.25rem to 3.75rem, 1.15, -0.025em): chapter and page titles; the home intro uses the headline size instead so the map stays dominant.
- **Headline** (750, fluid 1.875rem to 2.5rem, 1.15): project names on the network page, glossary letters.
- **Headline Small** (750, 1.625rem): in-chapter section heads, "Check your understanding", "See the real thing", the next-station call.
- **Title** (700, 1.25rem): station titles on a line page, timeline days and events, glossary terms (800).
- **Body** (400, 1.0625rem, 1.65): prose at a 68ch measure; italic for glossary analogies.
- **Lede** (400, 1.25rem, 1.5): chapter, line, project and glossary summaries; soft ink on chapter, timeline and glossary heads, full ink on the line and network pages.
- **Label** (650 to 750, 0.875rem): metadata rows, timeline times, definition terms, nav, buttons (at body size).
- **Station Code** (750 to 800, 0.875rem, 0.02em): badges and pills; inside a heading the pill sets at 0.5em of the heading.
- **Code** (Overpass Mono, 0.9em inline, 0.875rem blocks, 1.5).

### Named Rules
**The Two Voices Rule.** Overpass speaks for the map (headings, codes, labels, controls); Atkinson speaks for the explanation (prose, summaries, answers). Never set prose in Overpass or a station code in Atkinson.

**The Code Leads Rule.** A station or line code sits inline in front of its title, never stacked above it as a separate small line.

## Layout

A single centred page (`72rem` max, gutter `clamp(1rem, 4vw, 3rem)`), with prose held to a `68ch` measure and heads to about 62 to 64ch. Spacing follows the eight-step scale; sections separate with s-7 (3rem) to s-8 (5rem), items within a block with s-2 to s-4.

The map device leads each page: the network line on Home, the vertical route on a line page, the door strip on a chapter, contributor lanes on the timeline. On Home the line runs horizontally with names leaning at 45 degrees; below `52rem` it turns vertical with names beside each station. The door strip scrolls sideways and centres the current station; below `40rem` its name sits above the stops. On the timeline the filters are a sticky bar on phones (single scrolling row) and a sticky 15rem rail to the right from `64rem`; day headings stick beneath them. Every interactive target is at least 44px tall (primary buttons 48px).

## Elevation & Depth

Flat by default. Depth is conveyed by ink outlines, hairline rules and the ground/station contrast. The single shadow belongs to the glossary popover, the one element that floats over text. Rings drawn with `box-shadow` (the "you are here" halo, the active nav underline, the quiet button outline) are line work, not elevation.

### Shadow Vocabulary
- **Popover lift** (`box-shadow: 0 10px 30px rgb(22 24 27 / 0.18)`): glossary term popover only.
- **You-are-here halo** (`box-shadow: 0 0 0 5px var(--ground), 0 0 0 8px var(--ink)`): the stored reading position on the network map (4px/7px on the line page).

### Named Rules
**The Flat Map Rule.** A map has no shadows. Only a popover floating over prose may lift.

## Shapes

Everything a rider touches is round: stations are circles, badges, codes, buttons, nav links and toggles are full pills (999px), interchanges are ink-outlined capsules spanning the lanes they join. Lines are straight bars with 3px caps (rounded joins in SVG route diagrams), routed only at 0/45/90 degrees. Containers are rare and lightly rounded: 4px inline code, 6px code blocks, 8px revealed answers, 10px for the popover and the dashed evidence frame. Dashed strokes mean reconstructed or planned: dashed lanes for events rebuilt from the record, dashed lines in route diagrams, dashed frames for "where this comes from" notes.

## Components

### Buttons
Confident ink pills, the only filled controls on the page.
- **Shape:** full pill (999px), 48px tall, 1.5rem side padding.
- **Primary:** ink ground, ground-coloured Overpass 750 text ("Start at LC01", "Continue at LC04").
- **Quiet:** transparent with a 2px inset ink outline ("Timeline").
- **Hover / Active:** underline on hover; on the network page the button also scales to 0.98 on press.
- **Focus (all controls):** a 3px solid ink outline at 3px offset.

### Chips
- **Line badge:** contributor or project colour pill with its code, white text on the deepened badge grounds.
- **Timeline filter:** a line badge as a toggle with a station-dot tick and count; when off it fades to 45% and the tick hollows. "Together" is a station-white pill with a 3px ink outline.
- **Source tag:** a small outlined pill reading "GitHub" ahead of a real file or commit link.

### Cards / Containers
- **Corner Style:** 8 to 10px.
- **Background:** code-ground for revealed answers; transparent with a 2px dashed track border for evidence notes and empty states.
- **Shadow Strategy:** none (see Elevation).

### Navigation
Overpass 650, pill hover on code-ground, current page marked by a 3px ink underline bar (square). The wordmark is Overpass 800. Below 30rem the theme label collapses to its icon. The theme toggle is a 1px-rule pill holding a half-filled station disc.

### Glossary Term and Popover
Terms in prose are buttons with a 2px dotted underline (solid when open). The popover is raised white with a 2px ink border, 10px corners, the term name in Overpass 800, an italic analogy in soft ink, and a pill close button.

### Network Line (signature)
The project drawn as a full line: a 10px bar in the project colour, 2.25rem stations ringed 6px in that colour, names leaning at 45 degrees with the code in soft ink, the terminus badge at the start. Hover grows a station to 1.2x with an ink ring. The stored position fills the station with the line colour and adds the ink halo, breathing on a 2.4s loop.

### Door Strip (signature)
The strip map above a train door: the line code badge and name, then every station on one 6px line. Ridden stations fill with the line colour; the current station takes a 5px ink ring at 1.15x.

### Route Diagram
SVG system maps on a 72px grid: 6px round-capped lines that draw in once (dashed lines stay static), 8px-radius station circles with a 4px ring in their line colour, 24px ink-ringed discs for interchanges, Overpass 700 labels haloed in the ground colour, and a legend of 6px line swatches.

### Check Your Understanding
A numbered list of disclosures whose marker is a 4px ink station ring that fills in once the answer is open; the answer sits on code-ground.

### Next Station
A 6px rule in the line colour, then "Next station" in soft ink, the code pill and the title at headline-small size; "End of the line" returns to the map.

## Do's and Don'ts

### Do:
- **Do** draw every line at the 6px line weight and route it at 0, 45 or 90 degrees only; the Home network trunk (10px) is the single heavier line.
- **Do** keep Claude blue, You green and Others purple fixed on every project and every surface.
- **Do** lead headings with their station or line code as an inline pill.
- **Do** reserve ink rings for the reader's position: the current station or the stored "you are here".
- **Do** use dashed strokes to mean reconstructed or planned, as the timeline and route diagrams already do.
- **Do** set text on a contributor colour using the deepened badge grounds.
- **Do** keep every tap target at least 44px.

### Don't:
- **Don't** use a grey chapter sidebar beside a centred article; the line and door strip are the navigation.
- **Don't** use contributor colours for emphasis, links or status.
- **Don't** add shadows to cards, buttons or map elements; only the popover lifts.
- **Don't** set prose in Overpass or headings in Atkinson.
- **Don't** add a small label stacked above a heading; the code pill does that job inline.

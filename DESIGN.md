---
name: Project Journal
description: A calm night-sky learning journal. Journals are lanterns on a pond, chapters are stars in a constellation, and a living sky of moths and fireflies follows your cursor or finger.
colors:
  sky-top: "#1a1740"
  sky-mid: "#2a2766"
  sky-low: "#35387c"
  ground: "#262360"
  ground-raised: "#2e2b72"
  ink: "#ece9ff"
  ink-soft: "#bcb7e6"
  track: "#7d78c4"
  code-block: "#1c1a48"
  lit-star: "#ffd98a"
  on-lit-star: "#3a2410"
  glow-claude: "#9dbcff"
  glow-you: "#ffc77a"
  glow-together: "#ff9ec7"
  glow-others: "#8fe3c0"
  badge-ink: "#1b1740"
  dawn-sky-top: "#e9e1fa"
  dawn-sky-mid: "#f7e6ef"
  dawn-sky-low: "#fdeee0"
  dawn-ink: "#2a2552"
  dawn-ink-soft: "#5b5685"
  dawn-lit-star: "#a85f08"
  dawn-glow-claude: "#3f56c4"
  dawn-glow-you: "#a8560b"
  dawn-glow-together: "#b53a77"
  dawn-glow-others: "#17785a"
typography:
  display:
    fontFamily: "'Quicksand Variable', 'Quicksand', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1rem + 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Quicksand Variable', 'Quicksand', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.4rem + 1.6vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Quicksand Variable', 'Quicksand', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "'Nunito Variable', 'Nunito', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Quicksand Variable', 'Quicksand', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
  code:
    fontFamily: "'Overpass Mono Variable', 'Overpass Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  code: "6px"
  summary: "16px"
  glass: "20px"
  lamp: "44% 44% 48% 48%"
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
    backgroundColor: "{colors.lit-star}"
    textColor: "{colors.on-lit-star}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 2rem"
    height: "52px"
  button-quiet:
    backgroundColor: "rgb(255 255 255 / 0.07)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 2rem"
    height: "52px"
  badge-claude:
    backgroundColor: "{colors.glow-claude}"
    textColor: "{colors.badge-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5em 0.9em"
  badge-you:
    backgroundColor: "{colors.glow-you}"
    textColor: "{colors.badge-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5em 0.9em"
  badge-together:
    backgroundColor: "{colors.glow-together}"
    textColor: "{colors.badge-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5em 0.9em"
  badge-others:
    backgroundColor: "{colors.glow-others}"
    textColor: "{colors.badge-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5em 0.9em"
  glass-pane:
    backgroundColor: "rgb(255 255 255 / 0.07)"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
    padding: "2rem"
  next-star:
    backgroundColor: "rgb(255 255 255 / 0.07)"
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
    padding: "1.5rem"
  term-popover:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.summary}"
    padding: "1rem"
    width: "22rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem"
    height: "44px"
  code-block:
    backgroundColor: "{colors.code-block}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "14px"
    padding: "1rem"
---

# Design System: Project Journal

## Overview

**Creative North Star: "The Moon Pond"**

A still night by a pond. The reader is learning slowly, so the interface is meant to calm, not to compete. The ground is a deep indigo sky that runs slightly lighter toward the horizon, with a quiet moon and a slow aurora drifting behind everything. Nothing is loud: one warm gold, a few soft glows, glass panes you can see the sky through.

Every journal is a **lantern** floating on the pond. Inside a journal, every chapter is a **star**, and the stars of one journal are joined by a thin thread into a **constellation** you read from the first star to the last. Stars behind you are lit gold, the star you are on has a slow ring, the rest wait dim. Who did the work appears in the **Moonlog** as four glow colours, always printed with the person's name. A glossary word is a **firefly** (it glows with a dotted underline), the glossary page is the **Firefly jar**, and "Check your understanding" is **Reflect**.

The sky is alive. Stars twinkle and drift, fireflies wander, and a few moths flutter after the cursor or a finger, leaving stardust. Reading pages (chapters, the Moonlog, the Firefly jar) run a calmer sky: two moths instead of five, dimmer lights, the moon lowered below the star trail. Reduced motion paints one still sky and stops every animation.

Night is the default whatever the device setting. **Dawn** is the reader's choice: the same pond in pale lilac and peach, the moon a soft sun, every glow deepened so text keeps its contrast.

**Key Characteristics:**
- One warm light (the lit star, gold at night and deep amber at dawn) against a cool indigo or lilac sky.
- Four fixed glow colours for who did the work: periwinkle (Claude), amber (You), rose (Together), mint (Others). The name always sits beside the colour.
- Soft glass panes, no hard edges, no heavy shadows. Round, lamp and pill shapes.
- Slow, continuous motion in the background; short, eased state changes in the interface.
- Quicksand for headings and labels, Nunito for reading.

## Colors

A deep indigo sky with a single warm gold and four pale glows.

### Primary
- **Lit Star** (lit-star, `#ffd98a`; dawn: `#a85f08`): the only warm accent. Lit stars, the current-star ring, primary buttons, focus rings, glossary underlines, the emphasised phrase in the Home headline.

### Secondary
- **Glow colours** (glow-claude, glow-you, glow-together, glow-others): the four people-colours, fixed across every project. Badges carry dark text (`#1b1740`) at night and white text at dawn, using the deepened dawn values.

### Neutral
- **Night Sky** (sky-top, sky-mid, sky-low): the vertical gradient painted on a fixed layer behind everything.
- **Moon Ink** (ink, ink-soft): text. Dawn swaps to Dusk Ink (`#2a2552`, `#5b5685`).
- **Dim Star** (track): a star not yet reached, the dotted thread.
- **Glass**: white at 7% over the sky (55% at dawn) with a white 15% edge. Used for panes, never for blur.

### Named Rules
**One warm light.** Gold means "lit": a star you have passed, the star you are on, the main action. It is never used as decoration.

**Colour never travels alone.** A glow colour always has the person's name beside it.

## Typography

**Display and Labels:** Quicksand (variable, 500 to 700). **Body:** Nunito (variable, with italics). **Code:** Overpass Mono.

Rounded forms for a gentle voice, kept at weight 600 so headings feel present but never shout. Body is 17px at 1.65 leading with a 68ch measure. Headings use tight negative tracking and `text-wrap: balance`.

## Layout

Single-column reading measures with generous space. Home is a hero over a responsive grid of lanterns (every second one drops a little, so the pond never reads as a table). A journal page is a header, a wide constellation (hidden under 40rem), then the stars in reading order with a dotted thread down the left. The Moonlog uses a sticky filter rail beside the log on wide screens and a sticky chip bar on phones. Targets are at least 44px.

## Elevation & Depth

Depth is atmosphere, not shadow. Glass panes are tinted and lightly raised with a soft, offset shadow. Lit things glow (a lit star, the next-star card on hover, the primary button on hover). Sticky bars use a translucent sky colour with a light blur, the one place blur earns its keep.

## Shapes

Lanterns are lamp-shaped (44% 44% 48% 48%). Panes are 20px, summaries 16px, pills 999px, code 14px. Stars and fireflies are circles.

## Components

- **Lantern (journal card):** a glass pane with the journal's own colour glowing in its lamp, title, summary, facts and a start or continue button. Floats up and down slowly.
- **Constellation:** SVG stars joined by bowed dotted threads, gold behind you, a slow ring on the current star, the title shown on hover, focus or "you are here".
- **Star trail:** the strip above a chapter, every star in order, centred on the current one.
- **Next star:** a glass link at the end of every chapter.
- **Reflect:** questions in glass rows; a ripple fills with light when an answer opens.
- **Moonlog:** one dotted river with a glow where each moment happened. Bright glow is witnessed, hollow is rebuilt from the record, rose is together.
- **Firefly (glossary term):** a dotted gold underline with a soft glow; opens a small card.
- **Sky:** aurora and moon on the compositor, one canvas for stars, fireflies, moths and stardust.

## Do's and Don'ts

### Do
- Keep gold rare and meaningful. Keep text at 4.5:1 or better in both skies.
- Pair every glow colour with a name. Keep the sky behind content, never in front of it.
- Respect reduced motion: one still sky, no animation.

### Don't
- Don't add a second warm accent, or use glow colours as decoration.
- Don't use hard shadows, dividers heavier than 1px, or transit-map vocabulary (lines, stations, platforms).
- Don't let moths or dust cover reading text, and don't add motion that needs attention.

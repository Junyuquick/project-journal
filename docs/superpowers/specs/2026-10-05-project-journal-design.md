# Project Journal: design spec

Date: 2026-10-05 · Status: approved in conversation, pending written-spec review

## 1. Intent

**Goal.** A personal learning site that documents how the owner's coding projects were built, as a beginner-friendly course plus a timeline of who did what. The first project is the Loft Concept website. More projects will be added as folders.

**Reader.** The owner only, a beginner, reading in course order on a laptop or phone (PRODUCT.md).

**Decided with the owner**
- Scope of the Loft Concept documentation: the whole website (redesign + client admin and publishing).
- Level: beginner-friendly. Concepts from the ground up, analogies, a glossary, annotated code.
- Local first (`npm run dev`); publishing online later.
- Stack: Astro + Markdown/MDX.
- Reading pattern: a course, in order, with a table of contents.
- Learning aids: glossary pop-ups, diagrams, check-your-understanding, links to real files.
- Must not feel like a generic docs template.
- Timeline contributors: Claude, You, Together, plus Others (shown only on projects that have other collaborators).
- Visual world: The MRT Line Map (impeccable direction round, seed 578cefe1, chosen card "pick").

**Success criteria (machine-checkable)**
1. `npm run build` succeeds with zero errors and `astro check` reports 0 errors.
2. Content tests pass: every timeline event has a valid contributor and an ISO time, events are in time order, chapter numbers run 1..N without gaps, every `glossary:` link resolves to a glossary term, every chapter/timeline cross-reference resolves.
3. A built-site check finds no broken internal links and exactly one `<h1>` per page.
4. The Others filter renders only for projects whose contributors include `others`; Loft Concept renders Claude, You and Together only.
5. Screenshots at 390px and 1440px of home, a chapter and the timeline show no horizontal overflow (checked by script: `scrollWidth <= clientWidth`).
6. Adding a project needs only a new folder under `src/content/projects/` (proved by a fixture project in tests, not shipped).

**Out of scope:** online hosting, search, authentication, editing UI, analytics.

## 2. Information architecture

```
/                                   Network map: every project as a line
/projects/<slug>                    Line page: route strip of chapter stations
/projects/<slug>/<chapter>          Chapter (course page)
/projects/<slug>/timeline           Timeline with contributor filters
/glossary                           All terms, A to Z
```

### Network map (home)
Each project is a line in its own colour with its chapters as stations and a two-letter code (Loft Concept: `LC`). Below the map, the same projects as an accessible list (name, one-line summary, chapter count, date range). One project today; the map layout grows as lines are added.

### Line page
The project's route strip (the above-the-doors strip map) with every chapter as a station: code (`LC01`), title, one-line summary, reading time. Links to the timeline. Shows the reader's "You are here" station if they have started.

### Chapter page
- Door strip at the top: the line with this station highlighted, visited stations filled, the rest outlined; scrolls sideways on phones.
- Station code + title (the page's only `<h1>`), then the chapter body.
- Learning aids:
  - **Glossary pop-ups:** a Markdown link `[FTP](glossary:ftp)` renders as an underlined term that opens a small definition popover (tap or hover, keyboard accessible, Escape closes), with a link to the glossary page.
  - **Diagrams:** `<RouteDiagram>` draws systems as MRT maps (stations, lines, interchanges) from data; text alternatives included.
  - **Check your understanding:** 2-3 questions per chapter from frontmatter, answers revealed with `<details>`.
  - **Real files:** `<Source>` links to a commit or file on GitHub (`https://github.com/Junyuquick/loft-concept-website/...`).
  - **Evidence note:** chapters built from the record rather than the conversation say so at the top.
- End: "Next station" announcement linking the next chapter; the last chapter links back to the line.
- Reading position: the last chapter opened is stored in `localStorage` (wrapped in try/catch) and shown as "You are here" on the line and home pages.

### Timeline page
- Contributors are vertical lines running down the page, one column each: Claude (blue), You (green), Others (purple, only when present). Time runs downward.
- Each event is a station on its contributor's line; a Together event is an interchange capsule spanning the lines involved.
- Each event shows: local date and time, title, **what it was for**, **how it was done**, source (commit link, spec section, or "conversation"), and the chapter it belongs to.
- Evidence: events from the conversation sit on solid track; events reconstructed from specs and commits sit on dashed track (the MRT map's "under construction" convention). A legend at the top explains both and the colours.
- Filters: line-badge toggle buttons (Claude, You, Together, Others-if-present), all on by default; `aria-pressed`; toggling hides that contributor's events and dims its line. Day separators split the timeline by date.
- Works without JavaScript (all events shown); filters are progressive enhancement.

### Glossary
One shared glossary for all projects: term, plain-English definition, an everyday analogy where helpful, and "used in" links to chapters.

## 3. Content model (Astro content collections)

```
src/content/
  projects/<slug>/
    project.yaml        title, code (2 letters), color, summary, repo URL,
                        contributors: [claude, you, others?], startedAt, endedAt
    chapters/NN-<name>.mdx   frontmatter: title, station (int), summary,
                        minutes, evidence (witnessed|reconstructed|mixed),
                        check: [{q, a}], sources?: [{label, url}]
    timeline.yaml       events: [{at (ISO, +08:00), who (claude|you|together|others),
                        with? (for together: [claude, you]), title, why, how,
                        evidence (witnessed|reconstructed), source {type: commit|spec|conversation, ref?}, chapter?}]
  glossary/glossary.yaml  terms: [{id, term, definition, analogy?}]
```

Zod schemas validate all of it at build time. A remark plugin turns `glossary:` links into term buttons and fails the build on an unknown id.

## 4. Visual world (direction contract lives in the surface brief)

- Grammar: MRT network map. Lines at 0°, 45° and 90° only, one uniform stroke weight; stations as ticks; interchanges as white capsules with a black outline; line-colour badges with codes.
- Contributor colours (fixed across all projects): Claude = Downtown Line blue, You = East-West Line green, Others = North-East Line purple. Project line colours come from the remaining MRT colours (Loft Concept = Circle Line orange).
- Type: Overpass (signage heritage) for station names, headings, labels; Atkinson Hyperlegible for body prose; Overpass Mono for code. Self-hosted via Fontsource.
- No card grids, no grey docs sidebar. Navigation is the line itself.
- Light and dark mode via CSS variables and `prefers-color-scheme`, with a manual toggle stored per browser.
- Motion: line drawing on first view and on filter toggles (`stroke-dashoffset`), station pulse for "You are here"; all disabled under `prefers-reduced-motion`.
- Phone: timeline lines become narrow columns with text to the right; door strip scrolls horizontally; tap targets at least 44px; body text at least 17px.

## 5. Loft Concept course outline

| # | Station | Evidence |
|---|---|---|
| 1 | The big picture: what was built and how the pieces connect | mixed |
| 2 | Auditing the old site | reconstructed |
| 3 | The design system: brand colours, type, layout | reconstructed |
| 4 | Building with Astro: components, content collections, pages | reconstructed |
| 5 | Images and video | reconstructed |
| 6 | Keeping Google happy: redirects, canonical URLs, sitemap, structured data | mixed |
| 7 | Testing and verification | mixed |
| 8 | Letting the client edit: static sites, CMS choice, Sveltia | witnessed |
| 9 | Sign-in: OAuth and the Cloudflare Worker | witnessed |
| 10 | The publishing robot: GitHub Actions, FTPS, Vodien, staging | witnessed |
| 11 | Testing the admin for real | witnessed |
| 12 | Review and safety fixes | witnessed |
| 13 | Go-live | witnessed |
| 14 | How we worked: brainstorm, spec, plan, test-first, review | witnessed |

Sources: the Loft Concept repo (43 commits, both specs, both plans) and the build conversation. The redesign session's conversation is unavailable; its "You" events are limited to decisions recorded in the redesign spec. Nothing is invented.

## 6. Testing

- Vitest: schema and content integrity (section 1, criterion 2), the glossary remark plugin, and a fixture project proving a new folder renders with no code changes.
- `scripts/verify-build.mjs`: built-site links, one `<h1>` per page, Others filter presence rule.
- `scripts/verify-layout.mjs` (Playwright): 390px and 1440px screenshots of home, chapter 10 and the timeline, plus the no-overflow check.
- Impeccable finish review on the screenshots against the direction contract, then DESIGN.md written by the documenter.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Long prose fights the map metaphor | The map owns navigation and diagrams only; chapter prose sits in a calm reading column. |
| Timeline with ~80 events is long on a phone | Day separators, filters, compact station rows. |
| Redesign facts mis-stated | Every reconstructed claim traces to a spec line or commit; marked reconstructed. |
| Popovers on touch screens | Tap opens, tap outside or Escape closes; definition also on the glossary page. |

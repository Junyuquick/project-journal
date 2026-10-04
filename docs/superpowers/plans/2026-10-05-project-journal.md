# Project Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A local Astro site that teaches how the Loft Concept website was built (14 chapters), with an MRT-map visual world, a contributor-filtered timeline and a shared glossary, extensible by adding project folders.

**Architecture:** Static Astro 7 site. Content lives in collections: `projects/<slug>/project.yaml`, `projects/<slug>/chapters/*.mdx`, `projects/<slug>/timeline.yaml`, and `glossary.yaml`. Pages are generated per project. A remark plugin turns `glossary:` links into popover terms. Pure logic (schema helpers, ordering, the remark plugin, diagram geometry) is unit-tested with Vitest; built output is checked by scripts and Playwright.

**Tech Stack:** Astro 7.3.5, @astrojs/mdx 8.0.2, @astrojs/check 0.9.10, TypeScript 6 (`^6.0.3`, as in Loft Concept, for astro check), Vitest 5.0.3, Playwright 1.63.0, yaml 2.9.1, unist-util-visit 5.1.0, @fontsource-variable/overpass, @fontsource-variable/overpass-mono, @fontsource-variable/atkinson-hyperlegible-next (all 5.3.0).

**Spec:** `docs/superpowers/specs/2026-10-05-project-journal-design.md`

## Global Constraints

- Contributors are exactly `claude`, `you`, `together`, `others`; colours fixed site-wide: Claude `--line-claude` (Downtown blue #005EC4), You `--line-you` (East-West green #009645), Others `--line-others` (North-East purple #9900AA); Together renders as an interchange capsule.
- Loft Concept: slug `loft-concept`, code `LC`, colour Circle Line orange #FA9E0D, contributors `[claude, you]`.
- Times are ISO 8601 with `+08:00` (Singapore), shown in local time.
- No card grids, no grey docs sidebar; lines only at 0/45/90 degrees with one stroke weight.
- Fonts: Overpass (headings, labels), Atkinson Hyperlegible Next (body, min 17px), Overpass Mono (code). Self-hosted via Fontsource.
- Light and dark mode via CSS variables; `prefers-reduced-motion` disables all motion.
- Every factual claim traces to the Loft Concept repo or the conversation; reconstructed content is labelled; nothing invented.
- No em dashes in visible copy (taste-skill rule).
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A glossary term inside a heading, link text or code span** must not break: the plugin only transforms `glossary:` links and leaves code untouched. Pinned in Task 2 tests.
2. **A project with no timeline file or no chapters yet** renders its line page without crashing. Pinned by the fixture test in Task 2 and the build in Task 4.
3. **Timeline filters with JavaScript off** show every event; with all filters off, an empty-state message appears rather than a blank page. Pinned in Task 5.
4. **Long words and code on a 390px phone** (URLs, `.ftp-deploy-sync-state.json`) wrap or scroll inside their block, never the page. Pinned by `verify-layout.mjs` in Task 8.
5. **Popover on touch and keyboard:** opens on tap/Enter, closes on Escape and outside tap, focus returns to the term. Checked in Task 8's Playwright script.

---

### Task 1: Scaffold, tokens, fonts, base layout

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/styles/tokens.css`, `src/styles/base.css`, `src/layouts/Base.astro`, `src/components/ThemeToggle.astro`, `src/pages/index.astro` (placeholder `<h1>`).

**Produces:** `Base.astro` props `{ title: string; description: string }`, slot for content, header with site name link and theme toggle; CSS variables in `tokens.css` (`--ground`, `--ink`, `--ink-soft`, `--rule`, `--line-claude`, `--line-you`, `--line-others`, `--line-width: 6px`, `--measure: 68ch`, font stacks `--font-sign`, `--font-read`, `--font-code`, spacing scale `--s-1..--s-8`), dark overrides under `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`/`[data-theme="light"]`.

- [ ] Step 1: `npm init`-equivalent `package.json` with scripts `dev`, `build`, `check` (`astro check`), `test` (`vitest run`), `verify:build`, `verify:layout`; install exact versions above.
- [ ] Step 2: Write tokens, base CSS (reading column at `--measure`, body 1.0625rem/1.65, code blocks `overflow-x: auto`, `overflow-wrap: anywhere` on inline code and links), Base layout, theme toggle (button with `aria-pressed`, stores choice in `localStorage` inside try/catch, sets `data-theme` before paint via inline script).
- [ ] Step 3: Run `npm run build && npm run check`. Expected: build succeeds, 0 errors.
- [ ] Step 4: Commit `chore: scaffold Astro project with MRT tokens, fonts and base layout`.

### Task 2: Content model, glossary plugin, integrity tests

**Files:** Create `src/content.config.ts`, `src/lib/content.ts`, `src/lib/remark-glossary.mjs`, `src/lib/remark-glossary.test.ts`, `src/lib/content.test.ts`, `src/content/glossary.yaml` (seed 3 terms), fixture `test/fixtures/projects/sample/{project.yaml,timeline.yaml,chapters/01-start.mdx}`.

**Produces:**
- Collections: `projects` (glob `*/project.yaml`, id = folder), `chapters` (glob `*/chapters/*.mdx`, id = `<slug>/<file-without-NN->`), `timelines` (glob `*/timeline.yaml`, id = folder), `glossary` (file `src/content/glossary.yaml`).
- `src/lib/content.ts`: pure helpers `sortChapters(chapters)`, `chapterSlug(id): string`, `eventsByDay(events): {day: string, events: Event[]}[]`, `lanesFor(project): Contributor[]` (adds `others` only when listed), `validateTimeline(events, contributors): string[]` (errors), `validateStations(chapters): string[]`.
- `remarkGlossary({ terms: Set<string> })`: replaces `link` nodes whose url starts with `glossary:` by an `mdxJsxTextElement`/HTML `<button class="term" data-term="id">text</button>`; throws `Unknown glossary term: <id>` for unknown ids; ignores code.

- [ ] Step 1: Write failing tests: plugin transforms `[FTP](glossary:ftp)`, throws on unknown id, leaves `` `glossary:ftp` `` code alone; `validateTimeline` rejects unknown `who`, non-ISO `at`, out-of-order events, `others` events on a project without others; `validateStations` rejects gaps/duplicates; `lanesFor` excludes others unless listed; fixture project parses with the same schemas.
- [ ] Step 2: Run `npx vitest run` → failures for missing modules.
- [ ] Step 3: Implement schemas, helpers and plugin; register the plugin in `astro.config.mjs` for MDX (`mdx({ remarkPlugins: [[remarkGlossary, { terms }]] })`, terms read from `glossary.yaml`).
- [ ] Step 4: Content test over real content: every `glossary:` id used in `src/content/projects/**/chapters/*.mdx` exists; every timeline `chapter` ref exists; run validators on every real project.
- [ ] Step 5: Run tests → pass. Commit `feat: content collections, glossary plugin and integrity tests`.

### Task 3: Map components

**Files:** Create `src/lib/route.ts` (+ test), `src/components/RouteDiagram.astro`, `src/components/DoorStrip.astro`, `src/components/LineBadge.astro`, `src/components/Term.astro` + `src/scripts/terms.ts`, `src/components/Check.astro`, `src/components/Source.astro`, `src/components/NextStation.astro`, `src/components/Legend.astro`.

**Produces:**
- `route.ts`: `layoutRoute(stations: {id,label}[], opts {orientation: 'h'|'v', gap}) → {points, path}` producing straight segments only (0/45/90), tested.
- `RouteDiagram` props `{ title: string; lines: {color: string; label: string; stations: string[]}[]; stations: {id: string; label: string; note?: string}[]; caption: string }`: SVG map with interchange capsules where a station appears on 2+ lines; `<figure>` + `<figcaption>` + visually hidden ordered list as text alternative.
- `DoorStrip` props `{ project, chapters, current }`: horizontal scroll strip, current station ringed, `aria-current="step"`.
- `Term` popover script: delegated click/keydown on `.term`, popover is a `role="dialog"` positioned under the term, Escape and outside click close, focus returns.
- `Check` props `{ items: {q,a}[] }`: `<details>` per question.
- `Source` props `{ href, label }`; `NextStation` props `{ next?, line }` ("Next station: LC05 ..." announcement style).

- [ ] Steps: failing `route.test.ts` (segments axis-aligned or 45°, station count preserved) → implement → pass → commit `feat: MRT map components`.

### Task 4: Pages: network map, line, chapter, glossary

**Files:** `src/pages/index.astro`, `src/pages/projects/[project]/index.astro`, `src/pages/projects/[project]/[chapter].astro`, `src/pages/glossary.astro`, `src/scripts/position.ts` (You-are-here store).

- [ ] Home: one SVG line per project (its colour, its stations), project name + code badge, then an accessible list. You-are-here station pulse from `localStorage`.
- [ ] Line page: vertical route with stations (code, title, summary, minutes, evidence marker), link to timeline.
- [ ] Chapter page: DoorStrip, evidence banner when not `witnessed`, `<h1>` = code + title, MDX body with components available, Check, sources, NextStation; records position.
- [ ] Glossary: A to Z terms with definitions, analogies and "used in" chapter links.
- [ ] Run build + check; commit `feat: network map, line, chapter and glossary pages`.

### Task 5: Timeline page

**Files:** `src/pages/projects/[project]/timeline.astro`, `src/scripts/timeline.ts`, `src/lib/content.ts` (if helpers need extending, test first).

- [ ] Layout: CSS grid, one narrow column per lane (from `lanesFor`), event text column; each event row draws its station on its lane; Together = capsule spanning lanes listed in `with`; reconstructed evidence = dashed lane segment for that row; day separators.
- [ ] Filters: `<button class="badge" aria-pressed>` per lane plus Together; JS toggles `data-hidden-<who>` on the list; all-off shows "Turn a line back on to see its stations."; no-JS shows everything.
- [ ] Each event: time (`<time datetime>`), title, "What it was for", "How", source link, chapter link.
- [ ] Build + check; commit `feat: contributor timeline with line filters`.

### Task 6: Loft Concept project data, glossary and timeline

**Files:** `src/content/projects/loft-concept/project.yaml`, `src/content/projects/loft-concept/timeline.yaml`, `src/content/glossary.yaml`.

Sources: `git log` of `Coding Projects/Loft Concept/Website` (43 commits with times), both specs and plans in its `docs/superpowers/`, and the build conversation. Redesign-session events (2026-10-04 19:33 to 23:29) are `reconstructed`; admin-session events are `witnessed`. "You" events in the redesign come only from the redesign spec's recorded answers and decisions. Glossary covers every term used in chapters (target 40+).

- [ ] Write data; run `npm test` (validators over real content) → pass; commit `content: Loft Concept project data, timeline and glossary`.

### Task 7: Loft Concept chapters

**Files:** `src/content/projects/loft-concept/chapters/01-big-picture.mdx` … `14-how-we-worked.mdx` per the spec's outline. Each chapter: what and why first, then how; beginner analogies; at least one RouteDiagram where a system is explained; glossary links on first use of each term; 2-3 check questions; Source links to real commits/files; evidence frontmatter.

- [ ] Write chapters 1-7, run tests/build, commit `content: Loft Concept chapters 1-7`.
- [ ] Write chapters 8-14, run tests/build, commit `content: Loft Concept chapters 8-14`.

### Task 8: Verification scripts and design finish

**Files:** `scripts/verify-build.mjs`, `scripts/verify-layout.mjs`.

- [ ] `verify-build`: walk `dist/**/*.html`; each has one `<h1>`, `lang`, title; internal links resolve; timeline for a project without others has no Others badge; with fixture absent from dist.
- [ ] `verify-layout`: start `astro preview`, Playwright at 390x844 and 1440x900 on `/`, `/projects/loft-concept/the-publishing-robot` (chapter 10), `/projects/loft-concept/timeline`; assert `scrollWidth <= clientWidth`; popover opens with Enter, closes with Escape and returns focus; save `.impeccable/review/{desktop,mobile}-*.png`.
- [ ] Run impeccable `detect --json` on `src`, fix mechanical findings; one inspection round of screenshots; spawn `impeccable-finish-reviewer` with the direction contract; act on its disposition; spawn `impeccable-documenter` for DESIGN.md.
- [ ] Commit `test: build and layout verification; DESIGN.md`.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Markdown (user's choice). Static output, run locally (`npm run dev`); publishing online deferred. Each documented project is a folder of Markdown files plus a timeline data file, so adding a project needs no code changes.

## Users

One reader: the owner (GitHub `Junyuquick`), a beginner learning how real web projects are built with AI assistance. They read on desktop and on their phone, to study what was done, why, and how, at their own pace.

## Product Purpose

A personal learning journal that documents each coding project after (or while) it is built: how it was implemented, what every step was for, and how it was done, explained from the ground up. Success: the owner can understand and explain their own projects, and could redo similar work.

## Positioning

Documentation of the owner's own projects, written from the real record (git history, specs, plans, and the build conversation), not generic tutorials. The timeline separates who did what: Claude, the owner ("You"), both together, and other collaborators.

## Operating Context

- Content sources per project: git log (timestamps), design specs, implementation plans, and the build conversation.
- Timeline contributors: Claude, You, Together; "Others" exists only for projects with other collaborators and its filter appears only there.
- First project: Loft Concept website (`Coding Projects/Loft Concept/Website`): the Astro redesign (2026-10-04, reconstructed from its spec, plan and commits) and the client project admin plus Vodien deploy pipeline (2026-10-04 to 05, from the full conversation).
- More projects will be added over time.

## Capabilities and Constraints

- Documentation pages per project, organised for reading, plus a timeline page with contributor filters.
- Must work well on mobile and desktop.
- Explanations are beginner-friendly: concepts from the ground up, a glossary, code shown with plain-English annotations.
- Undecided: online publishing and any access control.

## Evidence on Hand

- Loft Concept: 43 commits, `docs/superpowers/specs/2026-10-04-website-redesign-design.md`, `docs/superpowers/specs/2026-10-04-client-project-admin-design.md`, and the matching plans in `docs/superpowers/plans/`.
- The redesign session's conversation is not available; "You" entries for it are limited to what the record attributes to the owner: answers and decisions written in its spec, commit messages that say "Owner feedback" or "Owner asked", and commits authored under the owner's name without a Claude co-author. Motives are quoted from those records, never inferred.

## Product Principles

1. Truth from the record: every timeline entry and claim traces to a commit, spec, plan or the conversation; nothing invented.
2. Why before how: each step says what it was for before how it was done.
3. Beginner first: no unexplained jargon; link terms to the glossary.
4. Adding a project is adding content, never editing code.

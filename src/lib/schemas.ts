// Shared by src/content.config.ts (Astro) and the content tests (Vitest).
import { z } from 'astro/zod';

const evidence = z.enum(['witnessed', 'reconstructed', 'mixed']);

export const projectSchema = z.object({
  title: z.string(),
  code: z.string().regex(/^[A-Z]{2}$/),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  ink: z.enum(['dark', 'light']).default('dark'),
  summary: z.string().min(20),
  repo: z.url().optional(),
  contributors: z.array(z.enum(['claude', 'you', 'others'])).min(1),
  startedAt: z.string(),
  endedAt: z.string(),
});

export const chapterSchema = z.object({
  title: z.string(),
  station: z.number().int().positive(),
  summary: z.string().min(10),
  minutes: z.number().int().positive(),
  evidence,
  check: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
  sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
});

export const eventSchema = z.object({
  at: z.string(),
  /** true when the time is inferred from neighbouring records rather than logged */
  approx: z.boolean().default(false),
  who: z.enum(['claude', 'you', 'together', 'others']),
  with: z.array(z.enum(['claude', 'you', 'others'])).optional(),
  title: z.string(),
  why: z.string(),
  how: z.string(),
  evidence: z.enum(['witnessed', 'reconstructed']),
  source: z.object({
    type: z.enum(['commit', 'spec', 'plan', 'conversation']),
    ref: z.string().optional(),
    url: z.url().optional(),
  }),
  chapter: z.string().optional(),
});

export const timelineSchema = z.object({ events: z.array(eventSchema) });

export const termSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term: z.string(),
  definition: z.string(),
  analogy: z.string().optional(),
});

// Checks every real project folder, plus a fixture proving a new folder needs no code changes.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { chapterSlug, lanesFor, validateStations, validateTimeline } from './content';
import { chapterSchema, projectSchema, termSchema, timelineSchema } from './schemas';

const glossary = termSchema.array().parse(parse(readFileSync('src/content/glossary.yaml', 'utf8')));
const termIds = new Set(glossary.map((t) => t.id));

const roots = ['src/content/projects', 'test/fixtures/projects'];
const projects = roots.flatMap((root) =>
  existsSync(root) ? readdirSync(root).filter((d) => existsSync(join(root, d, 'project.yaml'))).map((d) => ({ slug: d, dir: join(root, d) })) : [],
);

const frontmatter = (src: string) => parse(src.split(/^---$/m)[1]);

describe('glossary', () => {
  it('has unique ids', () => {
    expect(new Set(glossary.map((t) => t.id)).size).toBe(glossary.length);
  });
});

it('includes the fixture project, proving discovery is folder-based', () => {
  expect(projects.map((p) => p.slug)).toContain('sample');
});

describe.each(projects)('project $slug', ({ slug, dir }) => {
  const project = projectSchema.parse(parse(readFileSync(join(dir, 'project.yaml'), 'utf8')));
  const chapterDir = join(dir, 'chapters');
  const files = existsSync(chapterDir) ? readdirSync(chapterDir).filter((f) => f.endsWith('.mdx')) : [];
  const chapters = files.map((f) => {
    const src = readFileSync(join(chapterDir, f), 'utf8');
    return { id: `${slug}/${f.replace(/\.mdx$/, '')}`, src, data: chapterSchema.parse(frontmatter(src)) };
  });
  const slugs = new Set(chapters.map((c) => chapterSlug(c.id)));

  it('numbers its chapter stations 1..N without gaps', () => {
    expect(validateStations(chapters)).toEqual([]);
  });

  it('uses only glossary terms that exist', () => {
    for (const c of chapters) {
      for (const [, id] of c.src.matchAll(/\]\(glossary:([^)\s]+)\)/g)) expect(termIds, `${c.id} uses ${id}`).toContain(id);
    }
  });

  it('has a valid, ordered timeline whose chapter links resolve', () => {
    const path = join(dir, 'timeline.yaml');
    if (!existsSync(path)) return;
    const { events } = timelineSchema.parse(parse(readFileSync(path, 'utf8')));
    expect(validateTimeline(events, project.contributors)).toEqual([]);
    for (const e of events) if (e.chapter) expect(slugs, `${e.title} → ${e.chapter}`).toContain(e.chapter);
  });

  it('draws an Others line only when the project lists other collaborators', () => {
    expect(lanesFor(project.contributors).includes('others')).toBe(project.contributors.includes('others'));
  });
});

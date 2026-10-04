import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { chapterSchema, projectSchema, termSchema, timelineSchema } from './lib/schemas';

// Adding a project means adding a folder under src/content/projects/<slug>/.
const base = './src/content/projects';

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: '*/project.yaml', base, generateId: ({ entry }) => entry.split('/')[0] }),
    schema: projectSchema,
  }),
  chapters: defineCollection({
    loader: glob({ pattern: '*/chapters/*.mdx', base, generateId: ({ entry }) => entry.replace('/chapters/', '/').replace(/\.mdx$/, '') }),
    schema: chapterSchema,
  }),
  timelines: defineCollection({
    loader: glob({ pattern: '*/timeline.yaml', base, generateId: ({ entry }) => entry.split('/')[0] }),
    schema: timelineSchema,
  }),
  glossary: defineCollection({
    loader: file('src/content/glossary.yaml'),
    schema: termSchema,
  }),
};

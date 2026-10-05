import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { remarkGlossary, loadGlossaryIds } from './src/lib/remark-glossary.mjs';

export default defineConfig({
  // Published at https://junyuquick.github.io/project-journal/ (GitHub Pages project site).
  site: 'https://junyuquick.github.io',
  base: '/project-journal',
  // unified() rather than the default engine, so the glossary plugin runs; MDX inherits it.
  markdown: { processor: unified({ remarkPlugins: [[remarkGlossary, { terms: loadGlossaryIds() }]] }) },
  integrations: [mdx()],
});

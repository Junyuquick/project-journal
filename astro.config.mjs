import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { remarkGlossary, loadGlossaryIds } from './src/lib/remark-glossary.mjs';

export default defineConfig({
  // unified() rather than the default engine, so the glossary plugin runs; MDX inherits it.
  markdown: { processor: unified({ remarkPlugins: [[remarkGlossary, { terms: loadGlossaryIds() }]] }) },
  integrations: [mdx()],
});

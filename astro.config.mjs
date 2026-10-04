import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkGlossary, loadGlossaryIds } from './src/lib/remark-glossary.mjs';

export default defineConfig({
  integrations: [mdx({ remarkPlugins: [[remarkGlossary, { terms: loadGlossaryIds() }]] })],
});

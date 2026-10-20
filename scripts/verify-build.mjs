// Checks the built site in dist/: every page well-formed, every internal link resolves,
// and the Others line appears only on projects that list other collaborators.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const DIST = process.env.DIST ?? 'dist';
// The site is served from a subfolder on GitHub Pages; every internal link must carry it.
const BASE = parse(readFileSync('astro.config.mjs', 'utf8').match(/base: '([^']*)'/)?.[1] ?? '""') ?? '';
const failures = [];
const fail = (m) => failures.push(m);
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html'));

const resolves = (href) => {
  const path = decodeURIComponent(href.split('#')[0].split('?')[0]);
  if (path === '' || path === '/') return existsSync(join(DIST, 'index.html'));
  const clean = path.replace(/\/$/, '');
  return [join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`), join(DIST, clean)].some((p) => existsSync(p) && statSync(p).isFile());
};

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const name = file.slice(DIST.length + 1);
  if (!/<html lang="en"/.test(html)) fail(`${name}: missing <html lang="en">`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${name}: missing <title>`);
  if (!/<meta name="description" content="[^"]{10,}"/.test(html)) fail(`${name}: missing description`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(`${name}: expected one <h1>, found ${h1s}`);
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) {
    if (BASE && !(href === BASE || href.startsWith(`${BASE}/`))) fail(`${name}: internal link ${href} is missing the ${BASE} base path`);
    else if (!resolves(href.slice(BASE.length) || '/')) fail(`${name}: broken internal link ${href}`);
  }
  if (/href="glossary:/.test(html)) fail(`${name}: a glossary link was not turned into a term (reference-style link?)`);
  for (const [, id] of html.matchAll(/data-term="([^"]+)"/g)) {
    if (!html.includes(`"${id}":{`)) fail(`${name}: term ${id} has no definition on the page`);
  }
  if (/—|–/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(`${name}: contains an em or en dash`);
}

// The Others filter exists only where the project lists other collaborators.
const root = 'src/content/projects';
for (const slug of readdirSync(root)) {
  const p = parse(readFileSync(join(root, slug, 'project.yaml'), 'utf8'));
  const page = join(DIST, 'projects', slug, 'timeline', 'index.html');
  if (!existsSync(join(root, slug, 'timeline.yaml'))) { if (existsSync(page)) fail(`${slug}: has a timeline page but no timeline.yaml`); continue; }
  if (!existsSync(page)) { fail(`timeline missing for ${slug}`); continue; }
  const hasOthers = /data-filter="others"/.test(readFileSync(page, 'utf8'));
  if (hasOthers !== p.contributors.includes('others')) fail(`${slug}: Others filter ${hasOthers ? 'shown' : 'missing'} but contributors are ${p.contributors.join(', ')}`);
}

if (existsSync(join(DIST, 'projects', 'sample'))) fail('the test fixture project leaked into the build');

console.log(`${pages.length} pages checked`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('verify-build: OK');

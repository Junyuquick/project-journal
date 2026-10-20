// Opens the built site in a real browser at phone and desktop sizes, checks for sideways overflow,
// exercises the glossary popover and timeline filters, and saves screenshots for review.
import { execSync, spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4392;
// The preview server serves the site under its base path, as GitHub Pages will.
const BASE = `http://127.0.0.1:${PORT}/project-journal`;
const OUT = '.impeccable/review';
const PAGES = [
  ['home', '/'],
  ['line', '/projects/loft-concept/'],
  ['chapter', '/projects/loft-concept/the-publishing-robot/'],
  ['timeline', '/projects/loft-concept/timeline/'],
  ['glossary', '/glossary/'],
];
const VIEWPORTS = [['desktop', 1440, 900], ['mobile', 390, 844]];

mkdirSync(OUT, { recursive: true });
// Astro 7 keeps one background preview server; stop any old one so ours serves the current build.
const stopPreview = () => { try { execSync('npx astro preview stop', { stdio: 'ignore' }); } catch {} };
stopPreview();
const server = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], { stdio: 'ignore' });
const failures = [];
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) failures.push(msg); };

try {
  let up = false;
  for (let i = 0; i < 120 && !up; i++) {
    try { up = (await fetch(BASE)).ok; } catch {}
    if (!up) await new Promise((r) => setTimeout(r, 250));
  }
  if (!up) throw new Error(`preview server did not start on ${BASE}`);
  const browser = await chromium.launch();

  for (const [vp, width, height] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    for (const [name, path] of PAGES) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(overflow <= 0, `${vp} ${name}: no sideways scroll (overflow ${overflow}px)`);
      await page.screenshot({ path: `${OUT}/${vp}-${name}.png`, fullPage: true });
    }
    await page.close();
  }

  // "You are here": with a stored reading position, home and line pages ring that station.
  for (const [vp, width, height] of VIEWPORTS) {
    const here = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await here.goto(BASE + '/', { waitUntil: 'networkidle' });
    await here.evaluate(() => localStorage.setItem('pj-pos-loft-concept', '4'));
    for (const [name, path, sel] of [['home', '/', null], ['line', '/projects/loft-concept/', '.stop.is-here']]) {
      await here.goto(BASE + path, { waitUntil: 'networkidle' });
      if (sel) check((await here.locator(sel).getAttribute('data-station')) === '4', `${vp} ${name}: You are here rings LC04`);
      check((await here.locator('[data-continue="loft-concept"]').textContent())?.includes('Continue at LC04'), `${vp} ${name}: button offers Continue at LC04`);
      await here.screenshot({ path: `${OUT}/${vp}-${name}-here.png` });
    }
    await here.close();
  }

  // Glossary popover: keyboard opens it, Escape closes it, focus returns to the term.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/projects/loft-concept/the-publishing-robot/', { waitUntil: 'networkidle' });
  const term = page.locator('button.term').first();
  await term.focus();
  await page.keyboard.press('Enter');
  check(await page.locator('.term-pop[role="dialog"]').isVisible(), 'popover opens with Enter');
  check((await term.getAttribute('aria-expanded')) === 'true', 'term reports aria-expanded=true');
  const box = await page.locator('.term-pop').boundingBox();
  check(box && box.x >= 0 && box.x + box.width <= 390, 'popover fits on a phone screen');
  await page.keyboard.press('Escape');
  check(!(await page.locator('.term-pop').count()), 'popover closes with Escape');
  check(await term.evaluate((el) => el === document.activeElement), 'focus returns to the term');

  // Keyboard users who Tab out of the popover must not leave it open behind them.
  await term.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  check(!(await page.locator('.term-pop').count()), 'tabbing out of the popover closes it');

  // A very long word or URL in prose or a heading must wrap, never widen the page.
  await page.evaluate(() => {
    const word = 'https://github.com/Junyuquick/loft-concept-website/blob/main/.github/workflows/' + 'x'.repeat(60);
    document.querySelector('.prose')?.insertAdjacentHTML('afterbegin', `<p>${word}</p>`);
    document.querySelector('h1 span:last-child')?.append(' ' + 'Supercalifragilistic'.repeat(4));
  });
  const stretch = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(stretch <= 0, `long words wrap instead of widening the page (overflow ${stretch}px)`);

  // Timeline filters: hide a line, then all lines.
  await page.goto(BASE + '/projects/loft-concept/timeline/', { waitUntil: 'networkidle' });
  const visible = (who) => page.locator(`.ev[data-who="${who}"]:visible`).count();
  const chips = await page.locator('.tl__filters').evaluate((e) => e.scrollWidth - e.clientWidth);
  check(chips <= 0, `all filter chips fit on a phone (${chips}px hidden)`);
  const claudeBefore = await visible('claude');
  await page.click('[data-filter="claude"]');
  check(claudeBefore > 0 && (await visible('claude')) === 0, `hiding Claude hides its ${claudeBefore} stations`);
  check((await visible('you')) > 0, 'other lines stay visible');
  for (const who of ['you', 'together']) await page.click(`[data-filter="${who}"]`);
  check(await page.locator('[data-all-off]').isVisible(), 'all lines off shows the empty-state message');
  await page.close();

  // Without JavaScript every station is shown.
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await ctx.newPage();
  await nojs.goto(BASE + '/projects/loft-concept/timeline/');
  const total = await nojs.locator('.ev').count();
  check(total > 0 && (await nojs.locator('.ev:visible').count()) === total, `without JavaScript all ${total} stations show`);
  check(!(await nojs.locator('.tl__rail').isVisible()), 'without JavaScript the filter buttons (which need it) are hidden');
  await ctx.close();
  await browser.close();
} finally {
  server.kill();
  stopPreview();
}

console.log(failures.length ? `verify-layout: ${failures.length} failed` : 'verify-layout: OK');
process.exit(failures.length ? 1 : 0);

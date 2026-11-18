// Visual check of http://localhost:3000 with headless Chrome.
// Usage: node tools/shot/shoot.mjs [desktop|mobile|reduced]
// Holds the intro gate, then screenshots each chapter at several points.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2] ?? 'desktop';
const tag = (process.argv[3] ?? '/').replace(/[^a-z]/gi, '') || 'home';
const outUrl = new URL(`./out/${mode}-${tag}/`, import.meta.url);
mkdirSync(outUrl, { recursive: true });
const p = (name) => fileURLToPath(new URL(name, outUrl));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
const log = [];
page.on('console', (m) => {
  if (['error', 'warn'].includes(m.type())) log.push(`[console.${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));

const vp = mode === 'mobile' ? { width: 390, height: 844, deviceScaleFactor: 1 } : { width: 1440, height: 900, deviceScaleFactor: 0.5 };
await page.setViewport(vp);
if (mode === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const base = process.env.BASE ?? 'http://localhost:3000';
const route = process.argv[3] ?? '/';
await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 180000 });
await wait(2500);

let n = 0;
const shot = async (label) => page.screenshot({ path: p(`${String(++n).padStart(2, '0')}-${label}.jpg`), type: 'jpeg', quality: 75 });

// Loader (home): capture it mid-flip, then wait for it to hand over.
if (await page.$('.loader')) {
  await shot('loader');
  await page.waitForSelector('.loader.is-open', { timeout: 30000 }).catch(() => log.push('[loader] never opened'));
  await wait(450);
  await shot('loader-open');
  await page.waitForSelector('.loader', { hidden: true, timeout: 15000 }).catch(() => log.push('[loader] never removed'));
  await wait(1800);
}
log.push(`[loader] mounted: ${!!(await page.$('.loader'))}, locked: ${await page.evaluate(() => document.documentElement.classList.contains('is-locked'))}`);

const info = await page.evaluate(() => ({
  docH: document.documentElement.scrollHeight,
  vh: innerHeight,
  overflowX: document.documentElement.scrollWidth > innerWidth,
  webgl: !document.documentElement.classList.contains('no-webgl'),
  chapters: [...document.querySelectorAll('section.ch')].map((el) => ({
    name: el.getAttribute('aria-label'),
    top: Math.round(el.getBoundingClientRect().top + scrollY),
    h: Math.round(el.offsetHeight),
  })),
}));
log.push(`[layout] ${JSON.stringify(info)}`);

for (const ch of info.chapters) {
  const span = ch.h - info.vh;
  // Halfway into view: catches transitions between chapters (e.g. the film window opening).
  if (ch.top > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(ch.top - info.vh * 0.5));
    await wait(1800);
    await shot(`${ch.name.toLowerCase()}-enter`);
  }
  const count = Math.max(2, Math.round((span / info.vh) * 1.6));
  const points = Array.from({ length: count }, (_, k) => 0.05 + (0.9 * k) / (count - 1));
  for (const f of points) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(ch.top + span * f));
    await wait(1800);
    await shot(`${ch.name.toLowerCase()}-${Math.round(f * 100)}`);
  }
}

// Normal-flow pages: step down the page; on /work also hover a row.
if (info.chapters.length === 0) {
  await shot('top');
  const row = await page.$('.row__a:nth-of-type(1)');
  const rows = await page.$$('.row__a');
  if (rows[3]) {
    await page.evaluate(() => window.scrollTo(0, 700));
    await wait(1200);
    await rows[3].hover();
    await wait(1600);
    await shot('hover-row');
  }
  void row;
  const steps = Math.min(8, Math.ceil(info.docH / info.vh));
  for (let k = 1; k <= steps; k++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(k * info.vh * 0.95));
    await wait(1300);
    await shot(`scroll-${k}`);
  }
  const chip = await page.$('.chip:nth-child(6)');
  if (chip) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(600);
    await chip.click();
    await wait(1200);
    await page.evaluate(() => window.scrollTo(0, 500));
    await wait(1200);
    await shot('filter-australia');
    log.push(`[filter] rows: ${await page.$$eval('.row, .card', (n) => n.length)} url: ${page.url()}`);
  }
}

writeFileSync(p('log.txt'), log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();

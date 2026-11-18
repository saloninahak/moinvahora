// Film the first second of the home page: is anything visible before the loader?
// Captures frames every ~120ms from navigation, plus the hand-over.
// Usage: BASE=http://localhost:3001 node tools/shot/loader.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outUrl = new URL('./out/loader/', import.meta.url);
mkdirSync(outUrl, { recursive: true });
const p = (f) => fileURLToPath(new URL(f, outUrl));
const base = process.env.BASE ?? 'http://localhost:3000';
const log = [];

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });
page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));

// Warm the dev compile so timing is about the page, not webpack.
await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 180000 });
const fresh = await browser.createBrowserContext();
const pg = await fresh.newPage();
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });

const nav = pg.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 180000 });
const t0 = Date.now();
let n = 0;
// First paints: is the hero title visible while the loader is not up yet?
for (let k = 0; k < 40; k++) {
  const state = await pg
    .evaluate(() => {
      const loader = document.querySelector('.loader');
      const title = document.querySelector('.ch--hero h1 .ln > span');
      const op = title ? getComputedStyle(title).opacity : 'none';
      return { loader: !!loader, open: !!loader?.classList.contains('is-open'), titleOpacity: op, film: document.documentElement.classList.contains('film') };
    })
    .catch(() => null);
  if (state) log.push(`${Date.now() - t0}ms ${JSON.stringify(state)}`);
  if (k % 3 === 0) await pg.screenshot({ path: p(`${String(++n).padStart(2, '0')}-${Date.now() - t0}ms.jpg`), type: 'jpeg', quality: 70 }).catch(() => undefined);
  await new Promise((r) => setTimeout(r, 120));
}
await nav;
writeFileSync(p('log.txt'), log.join('\n') + '\n');
console.log('done', n);
await browser.close();

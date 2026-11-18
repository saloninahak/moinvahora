// Film the hero scene after the loader: captures at set times so the cut is visible.
// Usage: BASE=http://localhost:3000 node tools/shot/hero.mjs <tag>
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const tag = process.argv[2] ?? 'a';
const outUrl = new URL('./out/hero/', import.meta.url);
mkdirSync(outUrl, { recursive: true });
const p = (f) => fileURLToPath(new URL(f, outUrl));
const base = process.env.BASE ?? 'http://localhost:3000';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });
await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForSelector('.loader', { hidden: true, timeout: 30000 }).catch(() => undefined);
const t0 = Date.now();
for (const at of [1500, 3000, 4200, 6500]) {
  await wait(Math.max(0, at - (Date.now() - t0)));
  await page.screenshot({ path: p(`${tag}-${at}ms.jpg`), type: 'jpeg', quality: 72 });
}
await browser.close();
console.log('hero done');

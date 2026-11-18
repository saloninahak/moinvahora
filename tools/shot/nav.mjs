// Navigation test: Home -> Work (header nav) -> case study (row) -> Home (header nav).
// Checks the veil clears, the loader does not replay, reveals run, no progress rail.
// Usage: BASE=http://localhost:3000 node tools/shot/nav.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outUrl = new URL('./out/nav/', import.meta.url);
mkdirSync(outUrl, { recursive: true });
const p = (f) => fileURLToPath(new URL(f, outUrl));
const base = process.env.BASE ?? 'http://localhost:3000';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });
page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') log.push(`[console.error] ${m.text()}`);
});

const state = async (tag) => {
  const s = await page.evaluate(() => {
    const h1 = document.querySelector('main h1 .ln > span, main h1');
    const veil = document.querySelector('.veil');
    return {
      url: location.pathname,
      leaving: document.documentElement.classList.contains('is-leaving'),
      veil: veil ? getComputedStyle(veil).opacity : 'none',
      loader: !!document.querySelector('.loader') && getComputedStyle(document.querySelector('.loader')).display !== 'none',
      rail: !!document.querySelector('.rail'),
      h1: h1 ? `${h1.textContent.trim().slice(0, 30)} @${getComputedStyle(h1).opacity}` : null,
      active: document.querySelector('.hud__link[aria-current="page"]')?.textContent ?? null,
      bg: getComputedStyle(document.body).backgroundColor,
      noWebgl: document.documentElement.classList.contains('no-webgl'),
      locked: document.documentElement.classList.contains('is-locked'),
    };
  });
  log.push(`[${tag}] ${JSON.stringify(s)}`);
};
const shot = (f) => page.screenshot({ path: p(f), type: 'jpeg', quality: 70 });

await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForSelector('.loader', { hidden: true, timeout: 30000 }).catch(() => log.push('loader stuck'));
await wait(1600);
await state('home');
await shot('1-home.jpg');

// Scroll a bit first: navigation must work from anywhere.
await page.evaluate(() => window.scrollTo(0, 4000));
await wait(1200);
await page.click('.hud__link[href="/work"]');
await wait(180);
await state('->work +180ms');
await shot('2-veil.jpg');
await wait(1800);
await state('work');
await shot('3-work.jpg');

await page.evaluate(() => document.querySelector('.row__a[href="/work/rangtaali-australia"]').click());
await wait(2200);
await state('case');
await shot('4-case.jpg');

await page.evaluate(() => window.scrollTo(0, 1500));
await wait(800);
await page.click('.hud__link[href="/"]');
await wait(2200);
await state('home again');
await shot('5-home-again.jpg');

writeFileSync(p('log.txt'), log.join('\n') + '\n');
await browser.close();
console.log('nav done');

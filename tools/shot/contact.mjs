// Contact panel check: open from the dock, pick chips, copy, close with Esc, and the C key.
// Usage: BASE=http://localhost:3000 node tools/shot/contact.mjs
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outUrl = new URL('./out/contact/', import.meta.url);
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

for (const mode of ['desktop', 'mobile']) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => log.push(`[${mode} pageerror] ${e.message}`));
  if (mode === 'mobile') await page.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' });
  else await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });

  // Count vibrate calls to confirm haptics fire.
  await page.evaluateOnNewDocument(() => {
    window.__buzz = [];
    navigator.vibrate = (p) => {
      window.__buzz.push(JSON.stringify(p));
      return true;
    };
  });

  await page.goto(base + '/', { waitUntil: 'networkidle0', timeout: 180000 });
  await page.waitForSelector('.loader', { hidden: true, timeout: 30000 }).catch(() => undefined);
  await wait(1500);

  if (mode === 'mobile') await page.tap('.dock__btn--contact');
  else await page.click('.dock__btn--contact');
  await wait(1300);
  const st = await page.evaluate(() => ({
    open: document.querySelector('.cp')?.classList.contains('is-open'),
    modal: document.documentElement.classList.contains('is-modal'),
    focus: document.activeElement?.className,
    clock: document.querySelector('.cp__clock')?.textContent,
  }));
  log.push(`[${mode} open] ${JSON.stringify(st)}`);
  await page.screenshot({ path: p(`${mode}-1-open.jpg`), type: 'jpeg', quality: 75 });

  const chips = await page.$$('.cp__chip');
  if (mode === 'mobile') {
    await chips[0].tap();
    await chips[5].tap();
    await chips[7].tap();
  } else {
    await chips[0].click();
    await chips[5].click();
    await chips[7].click();
  }
  await wait(500);
  const href = await page.$eval('.cp__send', (a) => decodeURIComponent(a.getAttribute('href')));
  log.push(`[${mode} brief] ${href.replace(/\n/g, ' | ')}`);
  await page.screenshot({ path: p(`${mode}-2-brief.jpg`), type: 'jpeg', quality: 75 });

  await page.keyboard.press('Escape');
  await wait(900);
  const closed = await page.evaluate(() => ({
    open: document.querySelector('.cp')?.classList.contains('is-open'),
    modal: document.documentElement.classList.contains('is-modal'),
    vis: getComputedStyle(document.querySelector('.cp')).visibility,
  }));
  log.push(`[${mode} esc] ${JSON.stringify(closed)}`);

  if (mode === 'desktop') {
    await page.keyboard.press('c');
    await wait(1000);
    log.push(`[desktop C key] open=${await page.evaluate(() => document.querySelector('.cp')?.classList.contains('is-open'))}`);
    await page.keyboard.press('Escape');
    await wait(800);
  }

  // Scroll through the montage to see scroll haptics (mobile only matters).
  const top = await page.evaluate(() => {
    const s = [...document.querySelectorAll('section.ch')].find((e) => e.getAttribute('aria-label') === 'Scale');
    return s ? Math.round(s.getBoundingClientRect().top + scrollY) : 0;
  });
  for (let y = top - 900; y < top + 2400; y += 120) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await wait(90);
  }
  log.push(`[${mode} vibrate calls] ${await page.evaluate(() => window.__buzz.length)} ${await page.evaluate(() => window.__buzz.slice(0, 12).join(' '))}`);
  await page.close();
}

writeFileSync(p('log.txt'), log.join('\n') + '\n');
await browser.close();
console.log('contact done');

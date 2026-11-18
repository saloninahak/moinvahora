// Pass the "draw a zero" gate on why.zero.university, then wheel through the
// experience, saving a screenshot + visible text at each step.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outUrl = new URL('./out/zero2/', import.meta.url);
mkdirSync(outUrl, { recursive: true });
const p = (f) => fileURLToPath(new URL(f, outUrl));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });
const log = [];
page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));

await page.goto('https://why.zero.university/', { waitUntil: 'networkidle2', timeout: 120000 });
await wait(8000);

const visibleText = () =>
  page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,p,span,a,button,li,div')) {
      if (el.tagName === 'DIV' && el.children.length > 0) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.bottom < 0 || r.top > innerHeight || r.width === 0 || cs.visibility === 'hidden' || Number(cs.opacity) < 0.15) continue;
      const t = el.textContent.trim().replace(/\s+/g, ' ');
      if (!t || t.length > 260 || /^-?\d+ BZ$/.test(t)) continue;
      out.push(`${Math.round(parseFloat(cs.fontSize))}px ${cs.fontFamily.split(',')[0]} op${Number(cs.opacity).toFixed(1)}: ${t}`);
    }
    return [...new Set(out)].slice(0, 40);
  });

let n = 0;
const snap = async (label) => {
  const t = await visibleText();
  log.push(`\n=== ${String(n).padStart(2, '0')} ${label} ===\n${t.join('\n')}`);
  await page.screenshot({ path: p(`${String(n++).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 });
};

await snap('gate');

// Draw a zero: two clockwise loops around the circle in the centre.
const cx = 720, cy = 450, rad = 180;
await page.mouse.move(cx, cy - rad);
await page.mouse.down();
for (let i = 0; i <= 140; i++) {
  const a = -Math.PI / 2 + (i / 70) * Math.PI * 2;
  await page.mouse.move(cx + rad * Math.cos(a), cy + rad * Math.sin(a), { steps: 2 });
  await wait(8);
}
await page.mouse.up();
await wait(1500);
await snap('after-draw');
await wait(4000);
await snap('after-draw-4s');

// Wheel through the experience.
for (let i = 0; i < 70; i++) {
  await page.mouse.move(cx, cy);
  for (let k = 0; k < 5; k++) {
    await page.mouse.wheel({ deltaY: 120 });
    await wait(90);
  }
  await wait(1100);
  await snap(`wheel-${i}`);
}

writeFileSync(p('report.txt'), log.join('\n') + '\n');
console.log('done', n);
await browser.close();

// Study a reference site: scroll it in headless Chrome, save screenshots,
// visible text per screen, fonts, colours and animation libraries in use.
// Usage: node tools/shot/study.mjs <url> <name>
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const url = process.argv[2] ?? 'https://why.zero.university/';
const name = process.argv[3] ?? 'ref';
const outUrl = new URL(`./out/${name}/`, import.meta.url);
mkdirSync(outUrl, { recursive: true });
const p = (f) => fileURLToPath(new URL(f, outUrl));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 0.5 });
const report = [];
page.on('pageerror', (e) => report.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
await wait(4000);

const meta = await page.evaluate(() => {
  const scripts = [...document.scripts].map((s) => s.src).filter(Boolean);
  const libs = {
    gsap: !!window.gsap,
    ScrollTrigger: !!window.ScrollTrigger,
    lenis: !!window.lenis || !!document.querySelector('.lenis, html.lenis'),
    three: !!window.THREE,
    framer: !!document.querySelector('[data-framer-name], [data-framer-component-type]'),
    webflow: !!document.querySelector('html[data-wf-site]'),
    canvas: document.querySelectorAll('canvas').length,
    video: document.querySelectorAll('video').length,
  };
  const fonts = new Set();
  const colors = new Map();
  const bgs = new Map();
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
      fonts.add(`${cs.fontFamily.split(',')[0]} ${cs.fontWeight}`);
      colors.set(cs.color, (colors.get(cs.color) ?? 0) + 1);
    }
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs.set(cs.backgroundColor, (bgs.get(cs.backgroundColor) ?? 0) + 1);
  }
  const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} x${v}`);
  return {
    title: document.title,
    docH: document.documentElement.scrollHeight,
    vh: innerHeight,
    libs,
    scripts: scripts.slice(0, 25),
    fonts: [...fonts].slice(0, 25),
    colors: top(colors),
    backgrounds: top(bgs),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  };
});
report.push(`[meta] ${JSON.stringify(meta, null, 1)}`);

// Walk the page one viewport-ish at a time with wheel events (works with smooth scroll libs).
const steps = Math.min(60, Math.ceil(meta.docH / (meta.vh * 0.7)) + 2);
for (let i = 0; i < steps; i++) {
  const text = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,p,span,a,button,li,div')) {
      if (el.children.length > 0 && el.tagName === 'DIV') continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.bottom < 0 || r.top > innerHeight || r.width === 0 || cs.visibility === 'hidden' || Number(cs.opacity) < 0.1) continue;
      const t = el.textContent.trim().replace(/\s+/g, ' ');
      if (!t || t.length > 220) continue;
      out.push(`${Math.round(parseFloat(cs.fontSize))}px ${cs.fontFamily.split(',')[0]}: ${t}`);
    }
    return [...new Set(out)].slice(0, 30);
  });
  const y = await page.evaluate(() => Math.round(scrollY));
  report.push(`\n=== screen ${i} (scrollY ${y}) ===\n${text.join('\n')}`);
  await page.screenshot({ path: p(`${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 });
  await page.mouse.move(720, 450);
  for (let k = 0; k < 6; k++) {
    await page.mouse.wheel({ deltaY: 105 });
    await wait(120);
  }
  await wait(900);
}

writeFileSync(p('report.txt'), report.join('\n') + '\n');
console.log('done', steps);
await browser.close();

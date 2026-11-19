import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE ?? 'http://localhost:3000';
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const out = 'tools/shot/out/';
async function go(name, path, vp, act) {
  const p = await browser.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.setViewport(vp);
  await p.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => errs.push('goto ' + e));
  await new Promise((r) => setTimeout(r, 5000));
  if (act) await act(p);
  await p.screenshot({ path: out + name + '.png' });
  console.log(name, errs.length ? errs.slice(0, 3).join(' | ') : 'ok');
  await p.close();
}
const D = { width: 1440, height: 900 }, M = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
await go('ledger-d', '/work', D);
await go('ledger-peek', '/work', D, async (p) => { await p.hover('.row:nth-of-type(3), li:nth-child(3) a'); await new Promise((r) => setTimeout(r, 800)); });
await go('ledger-m', '/work', M);
await go('reel-d', '/work/film', D);
await go('reel-d2', '/work/film', D, async (p) => { await p.mouse.move(700, 450); await p.evaluate(() => window.scrollTo(0, 2500)); await new Promise((r) => setTimeout(r, 2500)); });
await go('reel-m', '/work/film', M);
await browser.close();

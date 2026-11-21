import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:3000';
const log = [];
const say = (...a) => { log.push(a.join(' ')); writeFileSync('tools/folders.txt', log.join('\n') + '\n'); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
try {
  const d = await browser.newPage();
  d.on('pageerror', (e) => say('D pageerror', e));
  await d.setViewport({ width: 1440, height: 900 });
  await d.evaluateOnNewDocument(() => sessionStorage.setItem('moin.loaded', '1'));
  await d.goto(BASE + '/work', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await wait(6000);
  await d.evaluate(() => window.scrollTo(0, 420));
  await wait(1500);
  await d.screenshot({ path: 'tools/shot/out/folders-d1.png' });
  const f = await d.$$('.fold');
  say('D folders:', f.length);
  await f[3].click();
  await wait(1200);
  await d.hover('.fold:nth-child(7)');
  await wait(900);
  await d.screenshot({ path: 'tools/shot/out/folders-d2.png' });
  say('D url:', d.url(), 'rows:', await d.evaluate(() => document.querySelectorAll('.files__main .row').length));
  await d.close();

  const m = await browser.newPage();
  m.on('pageerror', (e) => say('M pageerror', e));
  await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await m.evaluateOnNewDocument(() => sessionStorage.setItem('moin.loaded', '1'));
  await m.goto(BASE + '/work?c=stage', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await wait(6000);
  await m.evaluate(() => window.scrollTo(0, 380));
  await wait(1500);
  await m.screenshot({ path: 'tools/shot/out/folders-m.png' });
  say('M rows:', await m.evaluate(() => document.querySelectorAll('.files__main .row').length), 'strip scrollLeft:', await m.evaluate(() => document.querySelector('.files__strip').scrollLeft));
} catch (e) {
  say('ERROR', e.stack || e);
}
await browser.close();
say('done');

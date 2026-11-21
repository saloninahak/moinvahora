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
  say('D tiles:', await d.evaluate(() => document.querySelectorAll('.tile').length), 'rows on shelf:', await d.evaluate(() => document.querySelectorAll('.row').length));
  await d.evaluate(() => window.scrollTo(0, 380));
  await wait(1200);
  await d.hover('.shelf__item:nth-child(3) .tile');
  await wait(1000);
  await d.screenshot({ path: 'tools/shot/out/folders-d1.png' });
  await d.click('.shelf__item:nth-child(3) .tile');
  await wait(1500);
  say('D opened url:', d.url(), 'rows:', await d.evaluate(() => document.querySelectorAll('.opened .row').length));
  await d.screenshot({ path: 'tools/shot/out/folders-d2.png' });
  await d.goBack();
  await wait(1200);
  say('D after back:', d.url(), 'tiles:', await d.evaluate(() => document.querySelectorAll('.tile').length));
  await d.close();

  const m = await browser.newPage();
  m.on('pageerror', (e) => say('M pageerror', e));
  await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await m.evaluateOnNewDocument(() => sessionStorage.setItem('moin.loaded', '1'));
  await m.goto(BASE + '/work', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await wait(6000);
  await m.evaluate(() => window.scrollTo(0, 560));
  await wait(1500);
  await m.screenshot({ path: 'tools/shot/out/folders-m.png' });
  say('M overflow:', await m.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await m.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await wait(7000);
  await m.screenshot({ path: 'tools/shot/out/hero-m.png' });
  say('M hero sub:', await m.evaluate(() => document.body.innerText.includes('come to me first')));
} catch (e) {
  say('ERROR', e.stack || e);
}
await browser.close();
say('done');

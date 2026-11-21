import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:3000';
const log = [];
const say = (...a) => { log.push(a.join(' ')); writeFileSync('tools/hero2.txt', log.join('\n') + '\n'); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
try {
  for (const [name, vp] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const p = await browser.newPage();
    p.on('pageerror', (e) => say(name, 'pageerror', e));
    await p.setViewport(vp);
    await p.evaluateOnNewDocument(() => sessionStorage.setItem('moin.loaded', '1'));
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await wait(5000);
    await p.screenshot({ path: `tools/shot/out/hero3-${name}1.png` });
    await wait(1300);
    await p.screenshot({ path: `tools/shot/out/hero3-${name}2.png` });
    say(name, 'on word:', await p.evaluate(() => document.querySelector('.hx__word.is-on')?.textContent), 'img in hero:', await p.evaluate(() => !!document.querySelector('.hx__man, .ch--hero img')), 'overflow:', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await p.close();
  }
} catch (e) {
  say('ERROR', e.stack || e);
}
await browser.close();
say('done');

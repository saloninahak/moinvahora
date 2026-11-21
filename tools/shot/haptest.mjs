// Functional haptics test: emulated Android (records navigator.vibrate) and emulated iPhone (tap labels).
import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:3000';
const log = [];
const say = (...a) => { log.push(a.join(' ')); writeFileSync('tools/haptest.txt', log.join('\n') + '\n'); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const vp = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

try {
  // ---------- Android ----------
  const a = await browser.newPage();
  a.on('pageerror', (e) => say('A pageerror', e));
  await a.setUserAgent('Mozilla/5.0 (Linux; Android 14; A001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36');
  await a.setViewport(vp);
  await a.evaluateOnNewDocument(() => {
    window.__vib = [];
    Navigator.prototype.vibrate = function (p) { window.__vib.push(JSON.stringify(p)); return true; };
  });
  await a.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await wait(9000);
  say('A loader wait:', await a.evaluate(() => !!document.querySelector('.loader.is-wait')));
  say('A vib before tap:', await a.evaluate(() => window.__vib.join(' ')));
  await a.touchscreen.tap(195, 400);
  await wait(2500);
  say('A vib after tap:', await a.evaluate(() => window.__vib.join(' ')));
  say('A loader gone:', await a.evaluate(() => !document.querySelector('.loader')));
  for (let y = 0; y < 9000; y += 150) { await a.evaluate((y) => window.scrollTo(0, y), y); await wait(60); }
  await wait(800);
  say('A vib after scroll (count):', await a.evaluate(() => window.__vib.length), await a.evaluate(() => window.__vib.slice(0, 12).join(' ')));
  // Reload: loader skipped, hint should show.
  await a.reload({ waitUntil: 'domcontentloaded' });
  await wait(4000);
  say('A hint shown after reload:', await a.evaluate(() => !!document.querySelector('.hhint.is-on')));
  await a.screenshot({ path: 'tools/shot/out/hap-hint.png' });
  await a.touchscreen.tap(195, 300);
  await wait(800);
  say('A hint after tap:', await a.evaluate(() => !!document.querySelector('.hhint.is-on')), 'vib:', await a.evaluate(() => window.__vib.join(' ')));
  await a.close();

  // ---------- iPhone ----------
  const i = await browser.newPage();
  i.on('pageerror', (e) => say('I pageerror', e));
  await i.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1');
  await i.setViewport(vp);
  await i.evaluateOnNewDocument(() => {
    delete Navigator.prototype.vibrate;
    window.__ticks = 0;
    document.addEventListener('change', (e) => { if (e.target.closest && e.target.closest('.htap')) window.__ticks++; }, true);
  });
  await i.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await wait(9000);
  say('I loader wait (should be false):', await i.evaluate(() => !!document.querySelector('.loader.is-wait')));
  say('I tap labels:', await i.evaluate(() => document.querySelectorAll('.hx').length), 'hint:', await i.evaluate(() => !!document.querySelector('.hhint.is-on')));
  // Tap the dock link (All work) through its label.
  const box = await i.evaluate(() => { const r = document.querySelector('.dock .dock__btn--ghost').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, top: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.className }; });
  say('I topmost at dock link:', box.top);
  await i.touchscreen.tap(box.x, box.y);
  await wait(3500);
  say('I url after tapping All work:', i.url(), 'ticks:', await i.evaluate(() => window.__ticks));
  const c = await i.evaluate(() => { const r = document.querySelector('.dock__btn--contact').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await i.touchscreen.tap(c.x, c.y);
  await wait(1200);
  say('I contact open:', await i.evaluate(() => !!document.querySelector('.cp.is-open')), 'ticks:', await i.evaluate(() => window.__ticks));
  await i.screenshot({ path: 'tools/shot/out/hap-ios-contact.png' });
  await i.close();
} catch (e) {
  say('ERROR', e.stack || e);
}
await browser.close();
say('done');

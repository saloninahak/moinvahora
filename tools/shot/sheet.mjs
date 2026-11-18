// Contact sheet: one labelled grid screenshot of a folder of images.
// Usage: node tools/shot/sheet.mjs [dir=public/images] [cols=6] [out=tools/shot/out/sheet.jpg] [filter regex]
import puppeteer from 'puppeteer-core';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? 'public/images');
const cols = Number(process.argv[3] ?? 6);
const out = resolve(process.argv[4] ?? 'tools/shot/out/sheet.jpg');
const filter = new RegExp(process.argv[5] ?? '.');
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && filter.test(f)).sort();
const cells = files
  .map((f) => {
    const b64 = readFileSync(resolve(dir, f)).toString('base64');
    return `<figure><img src="data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,${b64}"><figcaption>${f}</figcaption></figure>`;
  })
  .join('');
const html = `<style>body{margin:0;background:#111;color:#eee;font:13px sans-serif;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px}
figure{margin:0}img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}figcaption{padding:3px 0}</style>${cells}`;

const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: cols * 480, height: 900 });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: out, type: 'jpeg', quality: 72, fullPage: true });
await browser.close();
console.log('sheet', files.length, out);

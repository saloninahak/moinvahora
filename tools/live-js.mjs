// Check the live site serves the new /work folders and the haptics code. Writes tools/live-js.txt
import { writeFileSync } from 'node:fs';
const base = 'https://moinvahora.vercel.app';
const out = [`checked ${new Date().toISOString()}`];
const r = await fetch(`${base}/work?t=${Date.now()}`, { cache: 'no-store' });
const html = await r.text();
out.push(`work ${r.status} folders=${(html.match(/class="fold"/g) || []).length} sidebar=${html.includes('files__side')} hint=${html.includes('hhint')}`);
const srcs = [...new Set([...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]))];
let taps = false, tapPrompt = false;
for (const s of srcs) {
  const t = await (await fetch(base + s)).text();
  if (t.includes('switch') && t.includes('hx')) taps = true;
}
const h = await (await fetch(`${base}/?t=${Date.now()}`, { cache: 'no-store' })).text();
tapPrompt = h.includes('Tap to enter');
out.push(`iosTapLabels=${taps} loaderTapPrompt=${tapPrompt}`);
writeFileSync('tools/live-js.txt', out.join('\n') + '\n');

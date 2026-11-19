// Check the live site's JavaScript for the latest haptic values.
// Writes tools/live-js.txt
import { writeFileSync } from 'node:fs';
const base = 'https://moinvahora.vercel.app';
const out = [`checked ${new Date().toISOString()}`];
const r = await fetch(`${base}/?t=${Date.now()}`, { cache: 'no-store' });
const html = await r.text();
out.push(`home ${r.status} age=${r.headers.get('age')} cache=${r.headers.get('x-vercel-cache')}`);
const srcs = [...new Set([...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]))];
out.push(`scripts ${srcs.length}`);
let found = null;
for (const s of srcs) {
  const t = await (await fetch(base + s)).text();
  if (t.includes('moin.haptics')) {
    const test = /test:\[(\d+)\]/.exec(t)?.[1];
    const land = /land:\[(\d+)\]/.exec(t)?.[1];
    const tick = /tick:\[(\d+)\]/.exec(t)?.[1];
    found = `${s} -> tick=${tick} land=${land} test=${test}`;
  }
}
out.push(found ?? 'haptics code not found in page scripts');
const w = await (await fetch(`${base}/work?t=${Date.now()}`, { cache: 'no-store' })).text();
out.push(`work: gridToggle=${w.includes('aria-label="View"')} rows=${w.includes('class="rows"')}`);
writeFileSync('tools/live-js.txt', out.join('\n') + '\n');

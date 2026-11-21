// Check the live hero: rolling words and credits, no camera photo. Writes tools/live-js3.txt
import { writeFileSync } from 'node:fs';
const base = 'https://moinvahora.vercel.app';
const h = await (await fetch(`${base}/?t=${Date.now()}`, { cache: 'no-store' })).text();
const out = [
  `checked ${new Date().toISOString()}`,
  `words=${(h.match(/class="hx__word/g) || []).length} credits=${h.includes('hx__credits')} cameraPhoto=${h.includes('moin-filming')} manFigure=${h.includes('hx__man')}`,
];
writeFileSync('tools/live-js3.txt', out.join('\n') + '\n');

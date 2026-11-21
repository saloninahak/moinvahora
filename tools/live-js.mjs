// Check the live site has the folders-only /work and the new hero line. Writes tools/live-js2.txt
import { writeFileSync } from 'node:fs';
const base = 'https://moinvahora.vercel.app';
const out = [`checked ${new Date().toISOString()}`];
const w = await (await fetch(`${base}/work?t=${Date.now()}`, { cache: 'no-store' })).text();
out.push(`work tiles=${(w.match(/class="tile/g) || []).length} rowsOnShelf=${(w.match(/class="row"/g) || []).length}`);
const h = await (await fetch(`${base}/?t=${Date.now()}`, { cache: 'no-store' })).text();
out.push(`hero newLine=${h.includes('come to me first')}`);
writeFileSync('tools/live-js2.txt', out.join('\n') + '\n');

// Check the live site serves the Ledger (/work) and Cinema (/work/film) pages. Writes tools/live-js.txt
import { writeFileSync } from 'node:fs';
const base = 'https://moinvahora.vercel.app';
const out = [`checked ${new Date().toISOString()}`];
const w = await fetch(`${base}/work?t=${Date.now()}`, { cache: 'no-store' });
const wt = await w.text();
out.push(`work ${w.status} ledger=${wt.includes('page--ledger')} reelCta=${wt.includes('reel-cta')} peek=${wt.includes('class="peek')}`);
const f = await fetch(`${base}/work/film?t=${Date.now()}`, { cache: 'no-store' });
const ft = await f.text();
out.push(`film ${f.status} reel=${ft.includes('reel__')} exit=${ft.includes('reel__exit')}`);
writeFileSync('tools/live-js.txt', out.join('\n') + '\n');

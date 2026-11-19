// Does the live site have the new build? Writes tools/live-check.txt
import { writeFileSync } from 'node:fs';
const out = [`checked ${new Date().toISOString()}`];
for (const path of ['/', '/work']) {
  try {
    const r = await fetch(`https://moinvahora.vercel.app${path}?t=${Date.now()}`, { cache: 'no-store' });
    const t = await r.text();
    out.push(`${path} ${r.status} contactBtn=${t.includes('dock__btn--contact')} gridToggle=${t.includes('aria-label="View"')} listRows=${t.includes('class="rows"')}`);
  } catch (e) {
    out.push(`${path} ERR ${e.message}`);
  }
}
writeFileSync('tools/live-check.txt', out.join('\n') + '\n');

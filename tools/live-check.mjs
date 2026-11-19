// Does the live site have the new build? Writes tools/live-check.txt
import { writeFileSync } from 'node:fs';
const out = [];
for (const path of ['/', '/work', '/work/rangtaali-australia']) {
  try {
    const r = await fetch(`https://moinvahora.vercel.app${path}?t=${Date.now()}`, { cache: 'no-store' });
    const t = await r.text();
    out.push(`${path} ${r.status} contactBtn=${t.includes('dock__btn--contact')} panel=${t.includes('Taking on new projects')}`);
  } catch (e) {
    out.push(`${path} ERR ${e.message}`);
  }
}
writeFileSync('tools/live-check.txt', out.join('\n') + '\n');

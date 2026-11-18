// One-off typography pass on globals.css: Bricolage Grotesque is already heavy,
// so tight negative tracking crowds the letters. Open tracking proportionally
// and bring the heaviest weights down a step. Prints every change.
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'src/app/globals.css';
let css = readFileSync(file, 'utf8');
const changes = [];

// letter-spacing: -0.0XXem  -> roughly 60% of the old value (never below -0.03em).
css = css.replace(/letter-spacing:\s*-(0\.\d+)em/g, (m, v) => {
  const old = Number(v);
  const next = Math.min(0.03, Math.round(old * 0.6 * 1000) / 1000);
  const out = `letter-spacing: -${next}em`;
  if (out !== m) changes.push(`${m}  ->  ${out}`);
  return out;
});

// font-weight: very heavy display weights down a step.
const map = { 800: 700, 760: 680, 740: 660, 720: 650, 700: 640 };
css = css.replace(/font-weight:\s*(\d{3});/g, (m, w) => {
  const n = map[Number(w)];
  if (!n) return m;
  changes.push(`font-weight: ${w}  ->  ${n}`);
  return `font-weight: ${n};`;
});

writeFileSync(file, css);
const tally = changes.reduce((acc, c) => ((acc[c] = (acc[c] ?? 0) + 1), acc), {});
writeFileSync('tools/type-pass.log', Object.entries(tally).map(([c, n]) => `${n}×  ${c}`).join('\n') + '\n');
console.log('changes', changes.length);

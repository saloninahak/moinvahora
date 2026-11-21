// Remove the old inline Hero from Story.tsx (it moved to story/Hero.tsx) and import the new one.
import { readFileSync, writeFileSync } from 'node:fs';
const f = 'src/components/story/Story.tsx';
let s = readFileSync(f, 'utf8');
const a = s.indexOf('/* ======================================================================\n   1 · Hero');
const b = s.indexOf('/* ======================================================================\n   2 · Cut');
const a2 = a < 0 ? s.indexOf('/* ======================================================================\r\n   1 · Hero') : a;
const b2 = b < 0 ? s.indexOf('/* ======================================================================\r\n   2 · Cut') : b;
if (a2 < 0 || b2 < 0 || b2 < a2) {
  writeFileSync('tools/cut-hero.txt', `not found a=${a2} b=${b2}\n`);
  process.exit(1);
}
s = s.slice(0, a2) + s.slice(b2);
s = s.replace("import { Haptic, hapticOnChange } from '@/lib/haptics';", "import { Haptic, hapticOnChange } from '@/lib/haptics';\nimport { Hero } from '@/components/story/Hero';");
writeFileSync(f, s);
writeFileSync('tools/cut-hero.txt', `ok removed ${b2 - a2} chars\n`);

// Replace the text between two markers (start inclusive, end exclusive) with a file's contents.
// Usage: node tools/splice2.mjs <file> <startMarker> <endMarker> <replacementFile>
import { readFileSync, writeFileSync } from 'node:fs';
const [file, start, end, rep] = process.argv.slice(2);
const src = readFileSync(file, 'utf8');
const a = src.indexOf(start);
const b = src.indexOf(end, a + 1);
if (a < 0 || b < 0) throw new Error(`markers not found: ${a} ${b}`);
writeFileSync(file, src.slice(0, a) + readFileSync(rep, 'utf8') + src.slice(b));
console.log('spliced', b - a, 'chars');

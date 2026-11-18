// Remove everything from a marker to the end of a file (keeps a trailing newline).
// Usage: node tools/cut-tail.mjs <file> <marker>
import { readFileSync, writeFileSync } from 'node:fs';
const [file, marker] = process.argv.slice(2);
const src = readFileSync(file, 'utf8');
const i = src.indexOf(marker);
if (i < 0) throw new Error('marker not found');
writeFileSync(file, src.slice(0, i).trimEnd() + '\n');
console.log('removed', src.length - i, 'chars');

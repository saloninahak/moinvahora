// One-off: replace everything before a marker in a file with a new header.
// Usage: node tools/splice.mjs <file> <marker> <headerFile>
import { readFileSync, writeFileSync } from 'node:fs';
const [file, marker, headerFile] = process.argv.slice(2);
const src = readFileSync(file, 'utf8');
const i = src.indexOf(marker);
if (i < 0) throw new Error('marker not found');
writeFileSync(file, readFileSync(headerFile, 'utf8') + src.slice(i));
console.log('ok');

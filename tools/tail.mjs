// Print the last N lines of a file to tools/tail.txt
import { readFileSync, writeFileSync } from 'node:fs';
const [file, n = '12'] = process.argv.slice(2);
const lines = readFileSync(file, 'utf8').split('\n');
writeFileSync('tools/tail.txt', lines.slice(-Number(n)).map((l, i) => `${lines.length - Number(n) + i + 1}: ${l}`).join('\n'));

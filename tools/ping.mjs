// Which local dev ports serve the site? Writes tools/ping.txt
import { writeFileSync, statSync } from 'node:fs';
const out = [`now ${new Date().toISOString()}`, `dev.log modified ${statSync('tools/dev.log').mtime.toISOString()}`];
for (const port of [3000, 3001, 3002, 3003]) {
  try {
    const r = await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(60000) });
    const t = await r.text();
    out.push(`${port} ${r.status} loader=${t.includes('loader__flip')} hero=${t.includes('Films that')}`);
  } catch (e) {
    out.push(`${port} down (${e.cause?.code ?? e.name})`);
  }
}
writeFileSync('tools/ping.txt', out.join('\n') + '\n');

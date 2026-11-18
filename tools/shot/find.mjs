// Search Openverse (openly licensed images) for stand-ins. Commercial-use licences only.
// Usage: node tools/shot/find.mjs "query one" "query two" ...  -> tools/shot/out/find.json
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = {};
for (const q of process.argv.slice(2)) {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&aspect_ratio=wide&size=large&page_size=12&mature=false`;
    const r = await fetch(url, { headers: { 'User-Agent': 'moin-portfolio-dev/1.0', Accept: 'application/json' } });
    const j = await r.json();
    out[q] = (j.results ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      url: p.url,
      thumb: p.thumbnail,
      w: p.width,
      h: p.height,
      license: `${p.license} ${p.license_version ?? ''}`.trim(),
      creator: p.creator,
      source: p.foreign_landing_url,
      attribution: p.attribution,
    }));
    if (!j.results) out[q] = { status: r.status, body: JSON.stringify(j).slice(0, 200) };
  } catch (e) {
    out[q] = { error: e.message };
  }
}
writeFileSync(fileURLToPath(new URL('./out/find.json', import.meta.url)), JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : JSON.stringify(v)}`).join('\n'));

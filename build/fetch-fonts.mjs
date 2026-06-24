// Fetch brand fonts from Google Fonts and self-host as woff2 + local @font-face.
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('build/fonts');
await mkdir(OUT, { recursive: true });

// Chrome UA so Google serves woff2.
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// family spec -> the @import-style css2 query
const FAMILIES = [
  'Geist:wght@300;400;500;600;700',
  'Geist+Mono:wght@400;500;600',
  'Instrument+Serif:ital@0;1',
  'Noto+Nastaliq+Urdu:wght@400;500;700',
  'Noto+Naskh+Arabic:wght@400;500;700',
];

let cssAll = '';
for (const fam of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?family=${fam}&display=swap`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) { console.error('CSS fail', fam, res.status); process.exit(1); }
  cssAll += '\n/* ' + fam + ' */\n' + (await res.text());
}

// Find all gstatic woff2 urls, download, rewrite to local relative paths.
const urlRe = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g;
const seen = new Map();
let m, idx = 0;
const downloads = [];
let rewritten = cssAll;
while ((m = urlRe.exec(cssAll))) {
  const remote = m[1];
  if (seen.has(remote)) continue;
  const fname = `f${idx++}_` + remote.split('/').slice(-2).join('_').replace(/[^a-zA-Z0-9._-]/g, '');
  seen.set(remote, fname);
  downloads.push({ remote, fname });
}

for (const d of downloads) {
  const r = await fetch(d.remote, { headers: { 'User-Agent': UA } });
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(path.join(OUT, d.fname), buf);
  rewritten = rewritten.split(d.remote).join('./fonts/' + d.fname);
  process.stdout.write(`. ${d.fname} (${buf.length}b)\n`);
}

await writeFile(path.resolve('build/fonts.css'), rewritten);
console.log(`\nDone: ${downloads.length} font files -> build/fonts/, css -> build/fonts.css`);

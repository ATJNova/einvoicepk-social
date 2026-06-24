// Render slide HTML files to 1080×1350 PNGs with Playwright.
// Usage: node build/render.mjs <file-or-glob...>
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
if (!args.length) { console.error('pass slide html paths'); process.exit(1); }

const OUT = path.resolve('build/out');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });

for (const f of args) {
  const abs = path.resolve(f);
  if (!existsSync(abs)) { console.error('missing', f); continue; }
  await page.goto(pathToFileURL(abs).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const el = await page.$('.slide');
  const name = path.basename(f).replace(/\.html?$/, '') + '.png';
  const out = path.join(OUT, name);
  await el.screenshot({ path: out });
  console.log('rendered', name);
}

await browser.close();
console.log('done ->', OUT);

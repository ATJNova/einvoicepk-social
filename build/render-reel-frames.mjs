// Deterministic reel render: seek the animation clock to each frame, screenshot.
// Usage: node build/render-reel-frames.mjs build/slides/reel-chai.html 20 30
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { pathToFileURL } from 'node:url';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const file = process.argv[2];
const seconds = parseFloat(process.argv[3] || '20');
const fps = parseInt(process.argv[4] || '30', 10);
const total = Math.round(seconds * fps);

const DIR = path.resolve('build/out/frames');
await rm(DIR, { recursive: true, force: true });
await mkdir(DIR, { recursive: true });

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// pause every animation so we control the clock
await page.evaluate(() => { document.getAnimations().forEach(a => a.pause()); });

const clip = { x: 0, y: 0, width: 1080, height: 1920 };
for (let i = 0; i < total; i++) {
  const tMs = (i / fps) * 1000;
  await page.evaluate((t) => {
    document.getAnimations().forEach(a => { try { a.currentTime = t; } catch (e) {} });
  }, tMs);
  const name = 'f' + String(i).padStart(4, '0') + '.png';
  await page.screenshot({ path: path.join(DIR, name), clip });
}
await browser.close();
console.log('FRAMES=' + total + ' -> ' + DIR);

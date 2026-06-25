// Record an animated HTML reel to webm via Playwright, synced to fonts.
// Usage: node build/record-reel.mjs build/slides/reel-chai.html 20300
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const file = process.argv[2];
const durMs = parseInt(process.argv[3] || '20300', 10);
const OUT = path.resolve('build/out/video');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
const context = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1080, height: 1920 } },
});
const page = await context.newPage();
await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true, { timeout: 5000 }).catch(()=>{});
await page.waitForTimeout(200);
// start the timeline
await page.evaluate(() => document.getElementById('stage').classList.add('go'));
await page.waitForTimeout(durMs);
const video = page.video();
await context.close();          // finalizes the webm
const src = await video.path();
await browser.close();
console.log('VIDEO_WEBM=' + src);

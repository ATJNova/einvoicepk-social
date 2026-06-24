// Generate all carousel slide HTML from a single content model.
// EN = dark theme, UR = light theme, identical layouts.
// Usage: node build/generate.mjs   (writes build/slides/c*-{en,ur}-*.html)
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SLIDES = path.resolve('build/slides');
await mkdir(SLIDES, { recursive: true });

const WA = '0325-4180105';
const SITE = 'einvoicepk.com';

// ── icons ──────────────────────────────────────────────────────────────────
const ic = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.4.1.1.1.6-.1 1.1Z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.5 2.5 16 0 18M12 3c-2.5 2.5-2.5 16 0 18" stroke="currentColor" stroke-width="1.8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M16 12h2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M3 9h13a2 2 0 0 1 2 2" stroke="currentColor" stroke-width="1.8"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M4 8h4v6H6a2 2 0 0 1-2-2V8Zm16 0h-4v6h2a2 2 0 0 0 2-2V8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// ── shared partials ──────────────────────────────────────────────────────────
const head = (lang) => `<div class="head">
      <div class="brand"><span class="logo-chip"><img src="../assets/logo-trimmed.png" alt="einvoicepk.com"></span></div>
      <div class="fbr-chip"><span class="dot"></span> FBR INTEGRATED</div>
    </div>`;

const foot = (lang, idx, total, swipe) => `<div class="foot">
      <span class="site">${SITE}</span>
      <span class="swipe">${swipe}
        <svg viewBox="0 0 30 14" fill="none"><path d="M1 7h26M21 1l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span class="idx"><b>${idx}</b> / ${total}</span>
    </div>`;

const contact = () => `<div class="contact">
        <div class="contact-row"><span class="contact-ic">${ic.globe}</span> <b>${SITE}</b></div>
        <div class="contact-row"><span class="contact-ic" style="color:var(--green-bright)">${ic.wa}</span> WhatsApp <b class="wa">${WA}</b></div>
      </div>`;

// ── slide templates ──────────────────────────────────────────────────────────
function coverSlide(s, ctx) {
  const seal = ctx.lang === 'en'
    ? `<div style="width:210px;height:210px;flex:none;margin-top:6px;">
        <svg class="seal" viewBox="0 0 120 120">
          <defs><path id="sc${ctx.uid}" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"/></defs>
          <circle class="seal-ring" cx="60" cy="60" r="53"/>
          <circle class="seal-ring seal-ring-i" cx="60" cy="60" r="47"/>
          <text class="seal-text"><textPath href="#sc${ctx.uid}" startOffset="0">· FBR DIGITAL INVOICING · VERIFIED · COMPLIANT </textPath></text>
          <path class="seal-check" d="M43 61 l12 12 l23 -27"/>
        </svg>
      </div>` : '';
  return `<div class="grow" style="display:flex;flex-direction:column;justify-content:center;gap:40px;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:36px;">
        <div class="gap-m" style="max-width:720px;">
          <div class="eyebrow">${s.eyebrow}</div>
          <h1 class="display h-cover">${s.h}</h1>
        </div>
        ${seal}
      </div>
      <p class="lead">${s.lead}</p>
    </div>`;
}

function stepSlide(s, ctx) {
  const rows = s.mock.rows.map(r => `<div class="mock-row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('\n        ');
  const total = s.mock.total
    ? `<div class="mock-total"><span>${s.mock.total[0]}</span><b class="grad">${s.mock.total[1]}</b></div>` : '';
  return `<div class="stepnum">${s.stepnum}</div>
    <div class="grow" style="display:flex;flex-direction:column;justify-content:center;gap:44px;">
      <div class="gap-m">
        <div class="eyebrow">${s.eyebrow}</div>
        <h2 class="display h-step">${s.h}</h2>
        <p class="lead">${s.lead}</p>
      </div>
      <div class="mock">
        <div class="mock-top">
          <span class="mock-id">${s.mock.id}</span>
          <span class="mock-badge"><span style="width:7px;height:7px;border-radius:50%;background:var(--green-bright);display:inline-block"></span> ${s.mock.badge}</span>
        </div>
        ${rows}
        ${total}
      </div>
    </div>`;
}

function featureSlide(s, ctx) {
  const cards = s.cards.map(c => `<div class="card big">
          <div class="ico">${ic[c.icon]}</div>
          <h3>${c.title}</h3>
          <p>${c.body}</p>
        </div>`).join('\n        ');
  return `<div class="grow" style="display:flex;flex-direction:column;justify-content:center;gap:40px;">
      <div class="gap-s">
        <div class="eyebrow">${s.eyebrow}</div>
        <h2 class="display h-step" style="font-size:64px;">${s.h}</h2>
      </div>
      <div class="cards">
        ${cards}
      </div>
    </div>`;
}

function ctaSlide(s, ctx) {
  return `<div class="grow" style="display:flex;flex-direction:column;justify-content:center;gap:40px;">
      <div class="gap-m">
        <div class="eyebrow">${s.eyebrow}</div>
        <h2 class="display h-cover" style="font-size:96px;">${s.h}</h2>
        <p class="lead">${s.lead}</p>
      </div>
      ${contact()}
    </div>`;
}

const RENDER = { cover: coverSlide, step: stepSlide, feature: featureSlide, cta: ctaSlide };

function page(carousel, slide, lang, idx, total, uid) {
  const theme = lang === 'en' ? 'theme-dark' : 'theme-light';
  const langClass = lang === 'ur' ? ' lang-ur' : '';
  const content = lang === 'en' ? slide.en : slide.ur;
  const ctx = { lang, uid };
  const swipe = slide.type === 'cta'
    ? (lang === 'en' ? 'Get started' : 'شروع کریں')
    : (idx === 1 ? (lang === 'en' ? 'Swipe' : 'سوائپ') : (lang === 'en' ? 'Next' : 'آگے'));
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="../fonts.css">
<link rel="stylesheet" href="../theme.css">
</head>
<body>
<div class="slide ${theme}${langClass}">
  <div class="bg-aurora"></div>
  <div class="bg-grid"></div>
  <div class="bg-vignette"></div>
  <div class="frame">
    ${head(lang)}
    ${RENDER[slide.type](content, ctx)}
    ${foot(lang, String(idx).padStart(2,'0'), String(total).padStart(2,'0'), swipe)}
  </div>
</div>
</body></html>`;
}

// ── CONTENT MODEL ────────────────────────────────────────────────────────────
const carousels = (await import('./content.mjs')).carousels;

let count = 0;
for (const c of carousels) {
  const total = c.slides.length;
  for (let i = 0; i < total; i++) {
    const slide = c.slides[i];
    for (const lang of ['en', 'ur']) {
      const uid = `${c.id}${i}${lang}`;
      const html = page(c, slide, lang, i + 1, total, uid);
      const name = `${c.id}-${lang}-${String(i + 1).padStart(2,'0')}.html`;
      await writeFile(path.join(SLIDES, name), html);
      count++;
    }
  }
}
console.log('generated', count, 'slides ->', SLIDES);

// Generate 5 single social posts (1080x1350) for IG/FB. Light premium theme.
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const OUT = path.resolve('build/slides'); await mkdir(OUT, { recursive: true });

const wa = '0325-4180105';
const head = `<div class="phead">
  <span class="logoc"><img src="../assets/logo-trimmed.png" alt="einvoicepk"></span>
  <span class="fbrb"><span class="dot"></span> FBR INTEGRATED</span></div>`;
const foot = `<div class="pfoot"><span>einvoicepk.com</span><span class="wa">💬 ${wa}</span></div>`;

const posts = [
  { id:'post-1', accent:'navy', eyebrow:'COMPLIANCE UPDATE',
    h:'FBR Digital Invoicing<br><span class="g">ab lazmi hai</span>',
    body:'Sales-tax registered businesses must now issue digital invoices with a valid <b>IRN + QR code</b>. The rollout deadlines (Sep–Dec 2025) have all passed.',
    box:'❓ Kya aap ka business compliant hai?' },
  { id:'post-2', accent:'red',  eyebrow:'KNOW THE RISK',
    h:'Bina digital invoice =<br><span class="r">Rs 5 LAKH+ jarmana</span>',
    body:'First default <b>Rs 500,000</b> · repeat up to <b>Rs 3M</b> · daily fines · business sealing · blacklisting from govt tenders.',
    box:'⚠️ Rs 2.3 billion already collected in penalties.' },
  { id:'post-3', accent:'green', eyebrow:'QUICK GUIDE',
    h:'What makes an invoice<br><span class="g">FBR-valid?</span>',
    list:['Valid FBR Invoice Number (IRN)','QR code on every invoice','FBR digital invoicing logo','Submitted to FBR via PRAL'],
    body:'einvoicepk adds all of this — <b>automatically</b>.' },
  { id:'post-4', accent:'green', eyebrow:'HOW IT WORKS',
    h:'FBR invoice in<br><span class="g">3 minutes</span>',
    list:['Sign up — business name + NTN','Add items — tax auto-calculates','Submit → instant IRN + QR'],
    body:'Free to start · No setup fee · No card.' },
  { id:'post-5', accent:'navy', eyebrow:'WHY EINVOICEPK',
    h:'Aap ka bharosamand<br><span class="g">FBR partner</span>',
    list:['FBR & PRAL integrated','Instant IRN + QR code','Bulk Excel upload','Mobile app + 24/7 support'],
    body:'Compliant, fast, and effortless — <b>aitماd ke saath</b>.' },
];

const css = `
*{margin:0;padding:0;box-sizing:border-box}
.slide{position:relative;width:1080px;height:1350px;background:#fff;overflow:hidden;
  font-family:'Geist',sans-serif;color:#0F172A;padding:80px 80px 70px;display:flex;flex-direction:column}
.bgblob{position:absolute;width:760px;height:760px;border-radius:50%;filter:blur(10px);opacity:.10;right:-160px;top:-160px}
.navy .bgblob{background:#1A3A7C}.green .bgblob{background:#28A745}.red .bgblob{background:#EF4444}
.phead{display:flex;align-items:center;justify-content:space-between;z-index:2}
.logoc{background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:12px 20px;display:flex}
.logoc img{height:46px;display:block}
.fbrb{display:inline-flex;align-items:center;gap:9px;font-family:'Geist Mono',monospace;font-size:15px;
  letter-spacing:.04em;color:#1E8538;background:rgba(40,167,69,.10);border:1px solid #cdead5;padding:9px 16px;border-radius:999px}
.fbrb .dot{width:8px;height:8px;border-radius:50%;background:#28A745}
.pbody{flex:1;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:2}
.eyebrow{font-family:'Geist Mono',monospace;font-size:24px;letter-spacing:.24em;color:#1E8538;font-weight:600}
.navy .eyebrow{color:#1A3A7C}.red .eyebrow{color:#EF4444}
.ph{font-size:84px;line-height:1.08;font-weight:800;letter-spacing:-.02em;color:#0F172A}
.ph .g{color:#1E8538}.ph .r{color:#EF4444}
.pt{font-size:33px;line-height:1.5;color:#475569;max-width:880px}
.pt b{color:#0F172A;font-weight:700}
.plist{display:flex;flex-direction:column;gap:20px}
.pli{display:flex;align-items:center;gap:20px;font-size:32px;font-weight:600;color:#0F172A}
.pli .c{width:46px;height:46px;border-radius:50%;flex:none;background:rgba(40,167,69,.12);display:flex;align-items:center;justify-content:center}
.pli .c svg{width:24px;height:24px}
.pbox{background:#F6F8F5;border:1px solid #E2E8F0;border-left:6px solid #28A745;border-radius:14px;
  padding:26px 30px;font-size:30px;font-weight:700;color:#1A3A7C}
.red .pbox{border-left-color:#EF4444;color:#B91C1C;background:#FEF2F2;border-color:#fecaca}
.pfoot{display:flex;align-items:center;justify-content:space-between;padding-top:28px;border-top:1px solid #E2E8F0;
  font-family:'Geist Mono',monospace;font-size:24px;color:#64748B;z-index:2}
.pfoot .wa{color:#1E8538;font-weight:600}
`;

const tick = '<span class="c"><svg viewBox="0 0 18 18" fill="none"><path d="M3.5 9l4 4 7-8" stroke="#1E8538" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

for (const p of posts) {
  const list = p.list ? `<div class="plist">${p.list.map(x=>`<div class="pli">${tick}${x}</div>`).join('')}</div>` : '';
  const box = p.box ? `<div class="pbox">${p.box}</div>` : '';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="../fonts.css"><style>${css}</style></head>
<body><div class="slide ${p.accent}">
<div class="bgblob"></div>
${head}
<div class="pbody">
  <div class="eyebrow">${p.eyebrow}</div>
  <h1 class="ph">${p.h}</h1>
  ${list}
  <p class="pt">${p.body}</p>
  ${box}
</div>
${foot}
</div></body></html>`;
  await writeFile(path.join(OUT, p.id + '.html'), html);
}
console.log('generated', posts.length, 'posts');

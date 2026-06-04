const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BG  = `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#0d0820"/>
  <stop offset="55%" stop-color="#3b2fa0"/>
  <stop offset="100%" stop-color="#c0407a"/>
</linearGradient>`;

const COMP = `<linearGradient id="comp" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1c0f42"/>
  <stop offset="100%" stop-color="#0d0825"/>
</linearGradient>`;

const SH = `<filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="rgba(0,0,0,0.55)"/></filter>`;
const GLOW_P = `<filter id="gp"><feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#6c5ce7" flood-opacity="0.7"/></filter>`;
const GLOW_K = `<filter id="gk"><feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#fd79a8" flood-opacity="0.7"/></filter>`;

function defs(...extras) {
  return `<defs>${BG}${COMP}${SH}${GLOW_P}${GLOW_K}${extras.join('')}</defs>`;
}

// ── V1: BOOKCASE FULL BLEED (no inner border, shelves touch edges) ──────────
function v1() {
  const W=76, gap=12, shelfH=18, post=20;
  const books = [
    // top shelf (y=100..270)
    {x:44,  y:100, w:W, h:155, f:'#6c5ce7'},
    {x:132, y:80,  w:W, h:175, f:'#a29bfe'},
    {x:220, y:110, w:W, h:145, f:'#ffffff'},
    {x:308, y:90,  w:W, h:165, f:'#6c5ce7'},
    // bottom shelf (y=310..440)
    {x:44,  y:320, w:W, h:130, f:'#ffffff'},
    {x:132, y:335, w:W, h:115, f:'#fd79a8'},
    {x:220, y:315, w:W, h:135, f:'#a29bfe'},
    {x:308, y:328, w:W, h:122, f:'#6c5ce7'},
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs()}
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- Compartments -->
  <rect x="${post}" y="0"   width="${512-post*2}" height="273" fill="url(#comp)"/>
  <rect x="${post}" y="291" width="${512-post*2}" height="221" fill="url(#comp)"/>
  <!-- Books -->
  ${books.map(b=>`<g filter="${b.f==='#6c5ce7'?'url(#gp)':b.f==='#fd79a8'?'url(#gk)':'none'}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" fill="${b.f}"/></g><rect x="${b.x+8}" y="${b.y+12}" width="${b.w-16}" height="6" rx="3" fill="rgba(255,255,255,0.2)"/><rect x="${b.x+8}" y="${b.y+24}" width="${b.w-22}" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>`).join('')}
  <!-- Left/right posts -->
  <rect x="0"   y="0" width="${post}" height="512" fill="white" filter="url(#sh)"/>
  <rect x="${512-post}" y="0" width="${post}" height="512" fill="white" filter="url(#sh)"/>
  <!-- Mid shelf -->
  <rect x="0" y="273" width="512" height="${shelfH}" fill="white" filter="url(#sh)"/>
  <!-- Bottom shelf -->
  <rect x="0" y="456" width="512" height="${shelfH}" fill="white"/>
  <!-- Top bar -->
  <rect x="0" y="0" width="512" height="${shelfH}" fill="white"/>
</svg>`;
}

// ── V2: FLOATING SHELF (one plank, books standing, no frame) ──────────────
function v2() {
  const books = [
    {x:62,  h:210, w:58, f:'#a29bfe'},
    {x:132, h:245, w:62, f:'#6c5ce7'},
    {x:206, h:190, w:54, f:'#ffffff'},
    {x:272, h:230, w:60, f:'#fd79a8'},
    {x:344, h:205, w:56, f:'#6c5ce7'},
  ];
  const shelfY = 340, shelfH = 22, shelfW = 400, shelfX = 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs(`<radialGradient id="rg" cx="50%" cy="60%" r="45%"><stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.25"/><stop offset="100%" stop-color="transparent"/></radialGradient>`)}
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#rg)"/>
  <!-- Subtle floor reflection -->
  <ellipse cx="256" cy="${shelfY+shelfH+30}" rx="180" ry="18" fill="rgba(108,92,231,0.18)"/>
  ${books.map(b=>{
    const by = shelfY - b.h;
    return `<g filter="${b.f==='#6c5ce7'?'url(#gp)':b.f==='#fd79a8'?'url(#gk)':'none'}"><rect x="${b.x}" y="${by}" width="${b.w}" height="${b.h}" rx="9" fill="${b.f}"/></g>
    <rect x="${b.x+7}" y="${by+12}" width="${b.w-14}" height="6" rx="3" fill="rgba(255,255,255,0.22)"/>
    <rect x="${b.x+7}" y="${by+24}" width="${b.w-20}" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>`;
  }).join('')}
  <!-- Shelf plank -->
  <rect x="${shelfX}" y="${shelfY}" width="${shelfW}" height="${shelfH}" rx="11" fill="white" filter="url(#sh)"/>
  <!-- Legs -->
  <rect x="${shelfX+16}" y="${shelfY+shelfH}" width="16" height="60" rx="8" fill="rgba(255,255,255,0.65)"/>
  <rect x="${shelfX+shelfW-32}" y="${shelfY+shelfH}" width="16" height="60" rx="8" fill="rgba(255,255,255,0.65)"/>
  <!-- Sparkles -->
  <circle cx="420" cy="130" r="8" fill="rgba(255,255,255,0.4)"/>
  <circle cx="445" cy="160" r="5" fill="rgba(255,255,255,0.25)"/>
  <circle cx="88"  cy="120" r="6" fill="rgba(255,255,255,0.3)"/>
  <circle cx="62"  cy="150" r="4" fill="rgba(255,255,255,0.18)"/>
</svg>`;
}

// ── V3: CIRCULAR BADGE ─────────────────────────────────────────────────────
function v3() {
  const cx=256, cy=256, r=210;
  const books = [
    {x:90,  h:140, w:52, f:'#a29bfe'},
    {x:154, h:168, w:56, f:'#6c5ce7'},
    {x:222, h:128, w:50, f:'#ffffff'},
    {x:284, h:158, w:54, f:'#fd79a8'},
    {x:350, h:145, w:52, f:'#6c5ce7'},
  ];
  const shelfY=330, shelfH=20;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs(`<clipPath id="circle"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`)}
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- Outer ring -->
  <circle cx="${cx}" cy="${cy}" r="${r+8}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
  <g clip-path="url(#circle)">
    <!-- Circle bg -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#bg)"/>
    <!-- Compartment behind books -->
    <rect x="70" y="170" width="372" height="${shelfY-170}" fill="url(#comp)"/>
    ${books.map(b=>{
      const by=shelfY-b.h;
      return `<g filter="${b.f==='#6c5ce7'?'url(#gp)':b.f==='#fd79a8'?'url(#gk)':'none'}"><rect x="${b.x}" y="${by}" width="${b.w}" height="${b.h}" rx="8" fill="${b.f}"/></g>
      <rect x="${b.x+7}" y="${by+10}" width="${b.w-14}" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>`;
    }).join('')}
    <!-- Shelf -->
    <rect x="70" y="${shelfY}" width="372" height="${shelfH}" rx="10" fill="white" filter="url(#sh)"/>
  </g>
  <!-- White ring border -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="14" filter="url(#sh)"/>
  <!-- Sparkles outside circle -->
  <circle cx="70"  cy="80"  r="7" fill="rgba(255,255,255,0.4)"/>
  <circle cx="445" cy="100" r="5" fill="rgba(255,255,255,0.3)"/>
  <circle cx="450" cy="400" r="6" fill="rgba(255,255,255,0.25)"/>
</svg>`;
}

// ── V4: SHIELD / CREST ────────────────────────────────────────────────────
function v4() {
  const books = [
    {x:102, h:118, w:48, f:'#a29bfe'},
    {x:160, h:138, w:52, f:'#6c5ce7'},
    {x:222, h:108, w:46, f:'#ffffff'},
    {x:278, h:130, w:50, f:'#fd79a8'},
    {x:338, h:120, w:46, f:'#6c5ce7'},
  ];
  const shelfY=330, shelfH=18;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs(`<clipPath id="shield">
    <path d="M256 36 L448 110 L448 290 Q448 420 256 480 Q64 420 64 290 L64 110 Z"/>
  </clipPath>`)}
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- Shield shadow -->
  <path d="M256 36 L448 110 L448 290 Q448 420 256 480 Q64 420 64 290 L64 110 Z" fill="rgba(0,0,0,0.3)" transform="translate(0,12)" filter="url(#sh)"/>
  <g clip-path="url(#shield)">
    <rect x="64" y="36" width="384" height="444" fill="url(#bg)"/>
    <rect x="64" y="195" width="384" height="${shelfY-195}" fill="url(#comp)"/>
    ${books.map(b=>{
      const by=shelfY-b.h;
      return `<g filter="${b.f==='#6c5ce7'?'url(#gp)':b.f==='#fd79a8'?'url(#gk)':'none'}"><rect x="${b.x}" y="${by}" width="${b.w}" height="${b.h}" rx="7" fill="${b.f}"/></g>
      <rect x="${b.x+7}" y="${by+10}" width="${b.w-14}" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>`;
    }).join('')}
    <rect x="64" y="${shelfY}" width="384" height="${shelfH}" fill="white" filter="url(#sh)"/>
  </g>
  <!-- Shield border -->
  <path d="M256 36 L448 110 L448 290 Q448 420 256 480 Q64 420 64 290 L64 110 Z" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="13" filter="url(#sh)"/>
  <!-- Top notch detail -->
  <circle cx="256" cy="60" r="18" fill="rgba(255,255,255,0.9)" filter="url(#sh)"/>
  <circle cx="256" cy="60" r="10" fill="url(#bg)"/>
</svg>`;
}

// ── V5: STACKED BOOKS SKYLINE ─────────────────────────────────────────────
function v5() {
  const spines = [
    {x:48,  w:62, h:260, f:'#6c5ce7', top:'#4a3cb0'},
    {x:118, w:54, h:200, f:'#a29bfe', top:'#7c70d8'},
    {x:180, w:68, h:290, f:'#ffffff', top:'#ddddff'},
    {x:256, w:56, h:220, f:'#fd79a8', top:'#d45080'},
    {x:320, w:62, h:270, f:'#6c5ce7', top:'#4a3cb0'},
    {x:390, w:54, h:195, f:'#a29bfe', top:'#7c70d8'},
  ];
  const baseY = 400, baseH = 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs(`<radialGradient id="rg2" cx="50%" cy="75%" r="50%"><stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.3"/><stop offset="100%" stop-color="transparent"/></radialGradient>`)}
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#rg2)"/>
  <!-- Floor glow -->
  <ellipse cx="256" cy="${baseY+baseH+10}" rx="220" ry="22" fill="rgba(108,92,231,0.2)"/>
  ${spines.map(s=>{
    const sy = baseY - s.h;
    return `<g filter="${s.f==='#6c5ce7'?'url(#gp)':s.f==='#fd79a8'?'url(#gk)':'none'}">
      <rect x="${s.x}" y="${sy}" width="${s.w}" height="${s.h}" rx="10" fill="${s.f}"/>
    </g>
    <!-- Spine top accent -->
    <rect x="${s.x}" y="${sy}" width="${s.w}" height="28" rx="10" fill="${s.top}" opacity="0.6"/>
    <!-- Spine lines -->
    <rect x="${s.x+8}" y="${sy+36}" width="${s.w-16}" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
    <rect x="${s.x+8}" y="${sy+48}" width="${s.w-22}" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>`;
  }).join('')}
  <!-- Base shelf -->
  <rect x="32" y="${baseY}" width="448" height="${baseH}" rx="12" fill="white" filter="url(#sh)"/>
  <!-- Sparkles -->
  <circle cx="436" cy="110" r="8" fill="rgba(255,255,255,0.4)"/>
  <circle cx="460" cy="145" r="5" fill="rgba(255,255,255,0.25)"/>
  <circle cx="56"  cy="100" r="6" fill="rgba(255,255,255,0.3)"/>
  <circle cx="30"  cy="135" r="4" fill="rgba(255,255,255,0.18)"/>
</svg>`;
}

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const variants = [
    { name:'1-fullbleed', svg: v1() },
    { name:'2-floating',  svg: v2() },
    { name:'3-circle',    svg: v3() },
    { name:'4-shield',    svg: v4() },
    { name:'5-skyline',   svg: v5() },
  ];
  for (const v of variants) {
    await page.setViewportSize({ width:512, height:512 });
    await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}body{width:512px;height:512px;overflow:hidden}</style></head><body>${v.svg}</body></html>`);
    await page.screenshot({ path:`/home/user/gameshelf/icon-v${v.name}.png`, clip:{x:0,y:0,width:512,height:512} });
    console.log(`✅ icon-v${v.name}.png`);
  }
  await browser.close();
}
generate().catch(console.error);

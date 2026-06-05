const { chromium } = require('/opt/node22/lib/node_modules/playwright');

// Exact same gradients/filters as the original icon-512.png
const BG  = `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#0d0820"/>
  <stop offset="55%" stop-color="#3b2fa0"/>
  <stop offset="100%" stop-color="#c0407a"/>
</linearGradient>`;
const COMP = `<linearGradient id="comp" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1c0f42"/>
  <stop offset="100%" stop-color="#0d0825"/>
</linearGradient>`;
const SH     = `<filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="rgba(0,0,0,0.55)"/></filter>`;
const GLOW_P = `<filter id="gp"><feDropShadow dx="0" dy="0" stdDeviation="7"  flood-color="#6c5ce7" flood-opacity="0.7"/></filter>`;
const GLOW_K = `<filter id="gk"><feDropShadow dx="0" dy="0" stdDeviation="7"  flood-color="#fd79a8" flood-opacity="0.7"/></filter>`;
const GLOW_W = `<filter id="gw"><feDropShadow dx="0" dy="0" stdDeviation="5"  flood-color="#ffffff"  flood-opacity="0.4"/></filter>`;

function defs() {
  return `<defs>${BG}${COMP}${SH}${GLOW_P}${GLOW_K}${GLOW_W}</defs>`;
}

function icon() {
  const W = 76, shelfH = 18, post = 20;

  const books = [
    // top shelf
    {x:44,  y:100, w:W, h:155, f:'#6c5ce7'},
    {x:132, y:80,  w:W, h:175, f:'#a29bfe'},
    {x:220, y:110, w:W, h:145, f:'#ffffff'},  // ← white book, will get ABXY
    {x:308, y:90,  w:W, h:165, f:'#6c5ce7'},
    // bottom shelf
    {x:44,  y:320, w:W, h:130, f:'#ffffff'},
    {x:132, y:335, w:W, h:115, f:'#fd79a8'},
    {x:220, y:315, w:W, h:135, f:'#a29bfe'},
    {x:308, y:328, w:W, h:122, f:'#6c5ce7'},
  ];

  const booksHtml = books.map(b => {
    const gf = b.f === '#6c5ce7' ? 'url(#gp)' : b.f === '#fd79a8' ? 'url(#gk)' : 'none';
    return `<g filter="${gf}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" fill="${b.f}"/></g>
  <rect x="${b.x+8}"  y="${b.y+12}" width="${b.w-16}" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
  <rect x="${b.x+8}"  y="${b.y+24}" width="${b.w-22}" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>`;
  }).join('\n  ');

  // ── ABXY buttons on the white top-shelf book (x=220, y=110, w=76, h=145)
  // Center of book: x=258, y=182
  const bx = 258, by = 182, br = 10, gap = 17;
  const abxy = `
  <!-- ABXY on white book -->
  <circle cx="${bx}"       cy="${by - gap}" r="${br}" fill="#a29bfe" opacity="0.85"/>
  <circle cx="${bx + gap}" cy="${by}"       r="${br}" fill="#fd79a8" opacity="0.85"/>
  <circle cx="${bx - gap}" cy="${by}"       r="${br}" fill="#6c5ce7" opacity="0.9"/>
  <circle cx="${bx}"       cy="${by + gap}" r="${br}" fill="#ffffff"  opacity="0.9"/>`;

  // ── Tiny controller silhouette watermark in bottom-right of top compartment
  // Positioned at x=390, y=140 — top-view, ~80×46px, very subtle
  const gx = 400, gy = 168, gw = 76, gh = 42, grx = 20;
  const ctrl = `
  <!-- Subtle controller watermark (top-right of top compartment) -->
  <g opacity="0.09">
    <rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="${grx}" fill="white"/>
    <rect x="${gx+8}"  y="${gy-9}"  width="22" height="12" rx="6" fill="white"/>
    <rect x="${gx+gw-30}" y="${gy-9}" width="22" height="12" rx="6" fill="white"/>
    <rect x="${gx+8}"  y="${gy+gh-3}" width="18" height="18" rx="9" fill="white"/>
    <rect x="${gx+gw-26}" y="${gy+gh-3}" width="18" height="18" rx="9" fill="white"/>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs()}
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- Compartments -->
  <rect x="${post}" y="${shelfH}" width="${512-post*2}" height="255" fill="url(#comp)"/>
  <rect x="${post}" y="291"      width="${512-post*2}" height="165" fill="url(#comp)"/>
  <!-- Controller watermark -->
  ${ctrl}
  <!-- Books -->
  ${booksHtml}
  <!-- ABXY buttons -->
  ${abxy}
  <!-- White frame -->
  <rect x="0"          y="0"   width="${post}" height="512"       fill="white" filter="url(#sh)"/>
  <rect x="${512-post}" y="0"   width="${post}" height="512"       fill="white" filter="url(#sh)"/>
  <rect x="0"          y="0"   width="512"     height="${shelfH}" fill="white"/>
  <rect x="0"          y="273" width="512"     height="${shelfH}" fill="white" filter="url(#sh)"/>
  <rect x="0"          y="456" width="512"     height="${shelfH}" fill="white"/>
</svg>`;
}

(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000">${icon()}</body></html>`);
  await page.screenshot({ path: 'icon-512-v7.png', clip: { x:0, y:0, width:512, height:512 } });
  await browser.close();
  console.log('Done → icon-512-v7.png');
})();

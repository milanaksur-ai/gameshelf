const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BG = `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#0d0820"/>
  <stop offset="55%" stop-color="#3b2fa0"/>
  <stop offset="100%" stop-color="#c0407a"/>
</linearGradient>`;
const COMP = `<linearGradient id="comp" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1c0f42"/>
  <stop offset="100%" stop-color="#0d0825"/>
</linearGradient>`;
const CTRL = `<linearGradient id="ctrl" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#5a4fcf"/>
  <stop offset="100%" stop-color="#d9567a"/>
</linearGradient>`;
const SH   = `<filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="rgba(0,0,0,0.55)"/></filter>`;
const GLOW_P = `<filter id="gp"><feDropShadow dx="0" dy="0" stdDeviation="7"  flood-color="#6c5ce7" flood-opacity="0.7"/></filter>`;
const GLOW_K = `<filter id="gk"><feDropShadow dx="0" dy="0" stdDeviation="7"  flood-color="#fd79a8" flood-opacity="0.7"/></filter>`;
const GLOW_C = `<filter id="gc"><feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#a29bfe" flood-opacity="0.75"/></filter>`;

const defs = () => `<defs>${BG}${COMP}${CTRL}${SH}${GLOW_P}${GLOW_K}${GLOW_C}</defs>`;

function icon() {
  const post = 20, shelfH = 18;
  const books = [
    {x: 44,  y: 100, w: 76, h: 155, f: '#6c5ce7'},
    {x: 132, y: 80,  w: 76, h: 175, f: '#a29bfe'},
    {x: 220, y: 110, w: 76, h: 145, f: '#ffffff'},
    {x: 308, y: 90,  w: 76, h: 165, f: '#fd79a8'},
  ];

  // Gamepad — centered in bottom compartment (y 291–456, center 373)
  const cx = 256, cy = 367;
  const bw = 234, bh = 90;
  const bx = cx - bw / 2; // 139
  const by = cy - bh / 2; // 322
  const rx = 45;

  // D-pad (left side)
  const dpX = 183, dpY = 362, dpArm = 12, dpT = 13;

  // ABXY buttons (right side)
  const btX = 327, btY = 362, btr = 11;

  // Analog sticks
  const lsX = 197, lsY = 393, rsX = 315, rsY = 393, sr = 17;

  const gp = `
  <!-- Gamepad glow + grips -->
  <g filter="url(#gc)">
    <rect x="${bx}"          y="${by}"          width="${bw}"  height="${bh}"  rx="${rx}" fill="url(#ctrl)"/>
    <rect x="${bx+10}"        y="${by+bh-24}"    width="66"     height="56"    rx="30"    fill="url(#ctrl)"/>
    <rect x="${bx+bw-76}"     y="${by+bh-24}"    width="66"     height="56"    rx="30"    fill="url(#ctrl)"/>
  </g>
  <!-- Body (re-draw on top to fill gap) -->
  <rect x="${bx}"   y="${by}"   width="${bw}"  height="${bh}"  rx="${rx}" fill="url(#ctrl)"/>
  <!-- Left bumper -->
  <rect x="${bx+28}" y="${by-12}" width="66" height="18" rx="9" fill="rgba(255,255,255,0.35)"/>
  <!-- Right bumper -->
  <rect x="${bx+bw-94}" y="${by-12}" width="66" height="18" rx="9" fill="rgba(255,255,255,0.35)"/>

  <!-- D-pad -->
  <rect x="${dpX-dpT/2}" y="${dpY-dpArm-dpT/2}" width="${dpT}" height="${dpArm*2+dpT}" rx="4" fill="rgba(255,255,255,0.88)"/>
  <rect x="${dpX-dpArm-dpT/2}" y="${dpY-dpT/2}" width="${dpArm*2+dpT}" height="${dpT}" rx="4" fill="rgba(255,255,255,0.88)"/>

  <!-- ABXY (in app colors) -->
  <circle cx="${btX}"      cy="${btY-15}" r="${btr}" fill="#a29bfe"/>
  <circle cx="${btX+15}"   cy="${btY}"    r="${btr}" fill="#fd79a8"/>
  <circle cx="${btX-15}"   cy="${btY}"    r="${btr}" fill="#ffffff"/>
  <circle cx="${btX}"      cy="${btY+15}" r="${btr}" fill="#6c5ce7"/>

  <!-- Left stick -->
  <circle cx="${lsX}" cy="${lsY}" r="${sr}"   fill="rgba(0,0,0,0.3)"/>
  <circle cx="${lsX}" cy="${lsY}" r="${sr-5}" fill="rgba(255,255,255,0.1)"/>
  <!-- Right stick -->
  <circle cx="${rsX}" cy="${rsY}" r="${sr}"   fill="rgba(0,0,0,0.3)"/>
  <circle cx="${rsX}" cy="${rsY}" r="${sr-5}" fill="rgba(255,255,255,0.1)"/>

  <!-- Home button -->
  <circle cx="${cx}" cy="${cy}" r="9" fill="rgba(255,255,255,0.38)"/>
  <circle cx="${cx}" cy="${cy}" r="5" fill="rgba(255,255,255,0.65)"/>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs()}
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- Compartments -->
  <rect x="${post}" y="${shelfH}" width="${512-post*2}" height="255" fill="url(#comp)"/>
  <rect x="${post}" y="291"      width="${512-post*2}" height="165" fill="url(#comp)"/>
  <!-- Top-shelf books -->
  ${books.map(b => {
    const gf = b.f==='#6c5ce7'?'url(#gp)': b.f==='#fd79a8'?'url(#gk)':'none';
    return `<g filter="${gf}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" fill="${b.f}"/></g>
  <rect x="${b.x+8}" y="${b.y+12}" width="${b.w-16}" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
  <rect x="${b.x+8}" y="${b.y+24}" width="${b.w-22}" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>`;
  }).join('\n  ')}
  <!-- Gamepad -->
  ${gp}
  <!-- White frame -->
  <rect x="0"          y="0"   width="${post}" height="512"      fill="white" filter="url(#sh)"/>
  <rect x="${512-post}" y="0"   width="${post}" height="512"      fill="white" filter="url(#sh)"/>
  <rect x="0"          y="0"   width="512"     height="${shelfH}" fill="white"/>
  <rect x="0"          y="273" width="512"     height="${shelfH}" fill="white" filter="url(#sh)"/>
  <rect x="0"          y="456" width="512"     height="${shelfH}" fill="white"/>
</svg>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000">${icon()}</body></html>`);
  await page.screenshot({ path: 'icon-512-v6.png', clip: { x:0, y:0, width:512, height:512 } });
  await browser.close();
  console.log('Done → icon-512-v6.png');
})();

const { chromium } = require('/opt/node22/lib/node_modules/playwright');

function makeSvg() {
  const cx = 256, cy = 256;
  const bw = 320, bh = 280;
  const bx = cx - bw / 2, by = cy - bh / 2 + 10;  // bx=96, by=126
  const post = 22, shelf = 20;
  const midY   = by + bh * 0.48;   // ~260
  const innerX = bx + post;         // 118
  const innerW = bw - post * 2;     // 276
  const topFloor   = midY;
  const topInnerH  = topFloor - by - shelf;    // ~114
  const botFloor   = by + bh - shelf;          // ~386
  const botInnerH  = botFloor - (midY + shelf); // ~106

  // ── Books (same as original) ─────────────────────────────────────────────
  const topBookDefs = [
    { w:54, h:topInnerH*0.82, fill:'#6c5ce7' },
    { w:46, h:topInnerH*0.97, fill:'#ffffff' },
  ];
  let bkX = innerX + innerW - 54 - 46 - 14;  // ~280
  let topBooks = '';
  topBookDefs.forEach(b => {
    const bky = topFloor - b.h;
    const gf = b.fill === '#6c5ce7' ? 'url(#bookglow)' : 'none';
    topBooks += `<g filter="${gf}"><rect x="${bkX.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/></g>`;
    topBooks += `<rect x="${(bkX+6)}" y="${(bky+10).toFixed(1)}" width="${b.w-12}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
    bkX += b.w + 10;
  });

  const botBookDefs = [
    { w:50, h:botInnerH*0.90, fill:'#ffffff' },
    { w:44, h:botInnerH*0.72, fill:'#fd79a8' },
    { w:52, h:botInnerH*0.84, fill:'#6c5ce7' },
  ];
  let bkX2 = innerX + 14;  // 132
  let botBooks = '';
  botBookDefs.forEach(b => {
    const bky = botFloor - b.h;
    const gf = b.fill === '#6c5ce7' ? 'url(#bookglow)' : b.fill === '#fd79a8' ? 'url(#pinkglow)' : 'none';
    botBooks += `<g filter="${gf}"><rect x="${bkX2}" y="${bky.toFixed(1)}" width="${b.w}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/></g>`;
    botBooks += `<rect x="${bkX2+6}" y="${(bky+10).toFixed(1)}" width="${b.w-12}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
    bkX2 += b.w + 10;
  });

  // ── Controller in empty top-left of top compartment ──────────────────────
  // Empty area: x 118→272, y 146→258 — center ≈ (195, 202)
  const ccx = 196, ccy = 200;
  const cw = 94, ch = 50, crx = 23;
  const cbx = ccx - cw/2;  // ~149
  const cby = ccy - ch/2;  // ~175

  // D-pad (left side)
  const dpX = cbx + 22, dpY = cby + 22, dpA = 7, dpT = 7;
  // Buttons (right side)
  const btX = cbx + cw - 24, btY = cby + 21, btr = 5;
  // Analog sticks (lower body)
  const lsX = cbx + 30, lsY = cby + ch - 13, sr = 9;
  const rsX = cbx + cw - 30, rsY = lsY;

  const ctrl = `
  <!-- Controller (top-left of top shelf) -->
  <g filter="url(#ctrlglow)">
    <rect x="${cbx}"    y="${cby}"          width="${cw}" height="${ch}" rx="${crx}" fill="url(#ctrlg)"/>
    <rect x="${cbx+4}"  y="${cby+ch-16}"    width="24"   height="28"   rx="12"     fill="url(#ctrlg)"/>
    <rect x="${cbx+cw-28}" y="${cby+ch-16}" width="24"   height="28"   rx="12"     fill="url(#ctrlg)"/>
  </g>
  <rect x="${cbx}"    y="${cby}"         width="${cw}" height="${ch}" rx="${crx}" fill="url(#ctrlg)"/>
  <!-- D-pad -->
  <rect x="${dpX-dpT/2}" y="${dpY-dpA-dpT/2}" width="${dpT}" height="${dpA*2+dpT}" rx="2" fill="rgba(255,255,255,0.82)"/>
  <rect x="${dpX-dpA-dpT/2}" y="${dpY-dpT/2}" width="${dpA*2+dpT}" height="${dpT}" rx="2" fill="rgba(255,255,255,0.82)"/>
  <!-- ABXY -->
  <circle cx="${btX}"   cy="${btY-8}" r="${btr}" fill="#a29bfe"/>
  <circle cx="${btX+8}" cy="${btY}"   r="${btr}" fill="#fd79a8"/>
  <circle cx="${btX-8}" cy="${btY}"   r="${btr}" fill="rgba(255,255,255,0.9)"/>
  <circle cx="${btX}"   cy="${btY+8}" r="${btr}" fill="#6c5ce7"/>
  <!-- Sticks -->
  <circle cx="${lsX}" cy="${lsY}" r="${sr}"   fill="rgba(0,0,0,0.28)"/>
  <circle cx="${lsX}" cy="${lsY}" r="${sr-3}" fill="rgba(255,255,255,0.1)"/>
  <circle cx="${rsX}" cy="${rsY}" r="${sr}"   fill="rgba(0,0,0,0.28)"/>
  <circle cx="${rsX}" cy="${rsY}" r="${sr-3}" fill="rgba(255,255,255,0.1)"/>
  <!-- Home button -->
  <circle cx="${ccx}" cy="${cby + ch/2 - 2}" r="4" fill="rgba(255,255,255,0.35)"/>`;

  // ── Original sparkle dots ─────────────────────────────────────────────────
  const spark = `
    <circle cx="${bx+bw+28}" cy="${by+10}"  r="9"  fill="rgba(255,255,255,0.45)"/>
    <circle cx="${bx+bw+52}" cy="${by+38}"  r="5"  fill="rgba(255,255,255,0.28)"/>
    <circle cx="${bx-24}"    cy="${by+24}"  r="6"  fill="rgba(255,255,255,0.32)"/>
    <circle cx="${bx-46}"    cy="${by+54}"  r="4"  fill="rgba(255,255,255,0.2)"/>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0820"/>
      <stop offset="55%" stop-color="#3b2fa0"/>
      <stop offset="100%" stop-color="#c0407a"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a0f3e"/>
      <stop offset="100%" stop-color="#050410"/>
    </linearGradient>
    <linearGradient id="ctrlg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6c5ce7"/>
      <stop offset="100%" stop-color="#c9547a"/>
    </linearGradient>
    <filter id="sh">
      <feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
    <filter id="bookglow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#6c5ce7" flood-opacity="0.65"/>
    </filter>
    <filter id="pinkglow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fd79a8" flood-opacity="0.65"/>
    </filter>
    <filter id="ctrlglow">
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#8b7cf8" flood-opacity="0.7"/>
    </filter>
  </defs>

  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#centerGlow)"/>

  <!-- Compartments -->
  <rect x="${innerX}" y="${(by+shelf).toFixed(1)}"   width="${innerW}" height="${topInnerH.toFixed(1)}" fill="url(#cg)"/>
  <rect x="${innerX}" y="${(midY+shelf).toFixed(1)}" width="${innerW}" height="${botInnerH.toFixed(1)}" fill="url(#cg)"/>

  ${ctrl}
  ${topBooks}
  ${botBooks}

  <!-- White frame -->
  <g filter="url(#sh)">
    <rect x="${bx}"       y="${by}"                  width="${post}" height="${bh}"    rx="11" fill="white"/>
    <rect x="${bx+bw-post}" y="${by}"                width="${post}" height="${bh}"    rx="11" fill="white"/>
    <rect x="${bx}"       y="${by}"                  width="${bw}"   height="${shelf}" rx="11" fill="white"/>
    <rect x="${bx}"       y="${midY.toFixed(1)}"      width="${bw}"   height="${shelf}" rx="11" fill="white"/>
    <rect x="${bx}"       y="${(by+bh-shelf).toFixed(1)}" width="${bw}" height="${shelf}" rx="11" fill="white"/>
  </g>

  ${spark}
</svg>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:512px;height:512px;overflow:hidden}</style></head><body>${makeSvg()}</body></html>`);
  await page.screenshot({ path: 'icon-512-v9.png', clip: { x:0, y:0, width:512, height:512 } });
  await browser.close();
  console.log('Done → icon-512-v9.png');
})();

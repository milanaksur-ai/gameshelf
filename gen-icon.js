const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const iconSvg = (padding = 0) => {
  const p = padding;
  // Shelf unit: centered rounded rectangle
  const fw = 340 - p * 1.2;  // frame width
  const fh = 290 - p * 1.0;  // frame height
  const fx = (512 - fw) / 2;
  const fy = (512 - fh) / 2 + 12;

  // Inner shelf divider y (splits frame into top tray and bottom tray)
  const shelfY = fy + fh * 0.52;
  const shelfH = 14;

  // Top row: 4 game spines
  const spineW = 42;
  const spineGap = 12;
  const spineCount = 4;
  const totalSpineW = spineCount * spineW + (spineCount - 1) * spineGap;
  const spineStartX = fx + (fw - totalSpineW) / 2;
  const topFloor = shelfY - 2;
  const topCeiling = fy + 18;

  const spineColors = [
    'rgba(162,155,254,0.55)',
    'rgba(255,255,255,0.9)',
    'rgba(253,121,168,0.55)',
    'rgba(162,155,254,0.35)',
  ];
  const spineHeights = [fh * 0.32, fh * 0.38, fh * 0.29, fh * 0.34];

  let topSpines = '';
  for (let i = 0; i < spineCount; i++) {
    const sx = spineStartX + i * (spineW + spineGap);
    const sh = spineHeights[i];
    const sy = topFloor - sh;
    topSpines += `<rect x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" width="${spineW}" height="${sh.toFixed(1)}" rx="7" fill="${spineColors[i]}"/>`;
    // tiny label band
    topSpines += `<rect x="${(sx+6).toFixed(1)}" y="${(sy+10).toFixed(1)}" width="${spineW-12}" height="6" rx="3" fill="rgba(0,0,0,0.08)"/>`;
    topSpines += `<rect x="${(sx+6).toFixed(1)}" y="${(sy+20).toFixed(1)}" width="${spineW-18}" height="4" rx="2" fill="rgba(0,0,0,0.05)"/>`;
  }

  // Bottom row: 3 wider game cases (landscape boxes)
  const caseH = 44;
  const caseGap = 10;
  const caseCount = 3;
  const caseW = (fw - 36 - caseGap * (caseCount - 1)) / caseCount;
  const caseStartX = fx + 18;
  const caseY = shelfY + shelfH + 14;
  const caseColors = ['rgba(255,255,255,0.85)', 'rgba(162,155,254,0.5)', 'rgba(255,255,255,0.7)'];

  let bottomCases = '';
  for (let i = 0; i < caseCount; i++) {
    const cx2 = caseStartX + i * (caseW + caseGap);
    bottomCases += `<rect x="${cx2.toFixed(1)}" y="${caseY.toFixed(1)}" width="${caseW.toFixed(1)}" height="${caseH}" rx="8" fill="${caseColors[i]}"/>`;
    // thumbnail area inside case
    bottomCases += `<rect x="${(cx2+8).toFixed(1)}" y="${(caseY+8).toFixed(1)}" width="${(caseW*0.38).toFixed(1)}" height="${caseH-16}" rx="4" fill="rgba(0,0,0,0.1)"/>`;
    // text lines
    bottomCases += `<rect x="${(cx2+caseW*0.38+14).toFixed(1)}" y="${(caseY+10).toFixed(1)}" width="${(caseW*0.38).toFixed(1)}" height="5" rx="2.5" fill="rgba(0,0,0,0.12)"/>`;
    bottomCases += `<rect x="${(cx2+caseW*0.38+14).toFixed(1)}" y="${(caseY+19).toFixed(1)}" width="${(caseW*0.28).toFixed(1)}" height="4" rx="2" fill="rgba(0,0,0,0.07)"/>`;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a4fcf"/>
      <stop offset="100%" stop-color="#e8639a"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
    <filter id="softshadow">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(0,0,0,0.15)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Ambient circle -->
  <circle cx="256" cy="256" r="210" fill="rgba(255,255,255,0.05)"/>

  <!-- Main shelf unit frame -->
  <rect x="${fx.toFixed(1)}" y="${fy.toFixed(1)}" width="${fw.toFixed(1)}" height="${fh.toFixed(1)}" rx="22" fill="rgba(255,255,255,0.14)" filter="url(#shadow)"/>
  <!-- Frame inner (slightly lighter) -->
  <rect x="${(fx+4).toFixed(1)}" y="${(fy+4).toFixed(1)}" width="${(fw-8).toFixed(1)}" height="${(fh-8).toFixed(1)}" rx="19" fill="rgba(255,255,255,0.10)"/>

  <!-- Middle shelf divider -->
  <rect x="${(fx+12).toFixed(1)}" y="${shelfY.toFixed(1)}" width="${(fw-24).toFixed(1)}" height="${shelfH}" rx="7" fill="rgba(255,255,255,0.88)" filter="url(#softshadow)"/>

  <!-- Top row: standing game spines -->
  ${topSpines}

  <!-- Bottom row: horizontal game cases -->
  ${bottomCases}

  <!-- Bottom base of shelf -->
  <rect x="${(fx+12).toFixed(1)}" y="${(fy+fh-18).toFixed(1)}" width="${(fw-24).toFixed(1)}" height="10" rx="5" fill="rgba(255,255,255,0.7)"/>

  <!-- Star badge top-right of frame -->
  <circle cx="${(fx+fw-18).toFixed(1)}" cy="${(fy+18).toFixed(1)}" r="22" fill="rgba(253,121,168,0.85)"/>
  <text x="${(fx+fw-18).toFixed(1)}" y="${(fy+24).toFixed(1)}" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold" fill="white">★</text>
</svg>
`;
};

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 512x512 icon
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}body{width:512px;height:512px;overflow:hidden;background:transparent}</style></head><body>${iconSvg(0)}</body></html>`);
  await page.screenshot({ path: '/home/user/gameshelf/icon-512.png', clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('✅ icon-512.png');

  // 192x192 icon
  await page.setViewportSize({ width: 192, height: 192 });
  await page.evaluate(() => {
    document.querySelector('svg').setAttribute('width', '192');
    document.querySelector('svg').setAttribute('height', '192');
  });
  await page.screenshot({ path: '/home/user/gameshelf/icon-192.png', clip: { x: 0, y: 0, width: 192, height: 192 } });
  console.log('✅ icon-192.png');

  // 512x512 maskable (extra padding for safe zone — ~10% each side)
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}body{width:512px;height:512px;overflow:hidden;background:transparent}</style></head><body>${iconSvg(30)}</body></html>`);
  await page.screenshot({ path: '/home/user/gameshelf/icon-512-maskable.png', clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('✅ icon-512-maskable.png');

  await browser.close();
  console.log('Done!');
}

generate().catch(console.error);

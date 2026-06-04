const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const iconSvg = (padding = 0) => {
  const s = 1 - padding / 256; // scale factor for maskable
  const cx = 256, cy = 256;

  // Shelf plank: centered, bold white
  const shelfY = 308;
  const shelfW = 360 * s;
  const shelfH = 26;
  const shelfX = cx - shelfW / 2;

  // Legs under shelf
  const legW = 18 * s;
  const legH = 52 * s;
  const legY = shelfY + shelfH;

  // 4 game spines standing on shelf
  const spines = [
    { w: 58, h: 148, color: '#ffffff', opacity: 1.0 },
    { w: 52, h: 118, color: '#c8c2ff', opacity: 0.95 },
    { w: 58, h: 162, color: '#ffffff', opacity: 0.88 },
    { w: 48, h: 110, color: '#ffb3d1', opacity: 0.9 },
  ];
  const gap = 16 * s;
  const totalW = spines.reduce((a, sp) => a + sp.w * s, 0) + gap * (spines.length - 1);
  let spineX = cx - totalW / 2;

  let spinesHtml = '';
  spines.forEach((sp, i) => {
    const sw = sp.w * s;
    const sh = sp.h * s;
    const sy = shelfY - sh;
    spinesHtml += `
      <rect x="${spineX.toFixed(1)}" y="${sy.toFixed(1)}" width="${sw.toFixed(1)}" height="${sh.toFixed(1)}" rx="9" fill="${sp.color}" opacity="${sp.opacity}"/>
      <rect x="${(spineX + sw*0.15).toFixed(1)}" y="${(sy + sh*0.12).toFixed(1)}" width="${(sw*0.7).toFixed(1)}" height="${(sh*0.1).toFixed(1)}" rx="3" fill="rgba(0,0,0,0.08)"/>
      <rect x="${(spineX + sw*0.15).toFixed(1)}" y="${(sy + sh*0.25).toFixed(1)}" width="${(sw*0.5).toFixed(1)}" height="${(sh*0.07).toFixed(1)}" rx="2" fill="rgba(0,0,0,0.05)"/>`;
    spineX += sw + gap;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a4fcf"/>
      <stop offset="100%" stop-color="#e8639a"/>
    </linearGradient>
    <filter id="sh">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="rgba(0,0,0,0.28)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Game spines -->
  ${spinesHtml}

  <!-- Shelf plank -->
  <rect x="${shelfX.toFixed(1)}" y="${shelfY}" width="${shelfW.toFixed(1)}" height="${shelfH}" rx="13" fill="white" filter="url(#sh)"/>

  <!-- Shelf legs -->
  <rect x="${(cx - shelfW/2 + 28*s).toFixed(1)}" y="${legY}" width="${legW.toFixed(1)}" height="${legH.toFixed(1)}" rx="9" fill="rgba(255,255,255,0.75)"/>
  <rect x="${(cx + shelfW/2 - 28*s - legW).toFixed(1)}" y="${legY}" width="${legW.toFixed(1)}" height="${legH.toFixed(1)}" rx="9" fill="rgba(255,255,255,0.75)"/>
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

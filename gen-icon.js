const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const iconSvg = (padding = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a4fcf"/>
      <stop offset="100%" stop-color="#e8639a"/>
    </linearGradient>
    <linearGradient id="bgInner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c6ee8"/>
      <stop offset="100%" stop-color="#fd79a8"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Subtle inner glow circle -->
  <circle cx="256" cy="230" r="200" fill="rgba(255,255,255,0.04)"/>

  <!-- Shelf plank -->
  <rect x="${64 + padding}" y="${338 + padding*0.1}" width="${384 - padding*2}" height="${22}" rx="11" fill="rgba(255,255,255,0.92)" filter="url(#shadow)"/>

  <!-- Cartridge LEFT (shorter, tilted slightly left) -->
  <g transform="rotate(-2, 145, 280)">
    <rect x="${92 + padding}" y="${218 + padding*0.15}" width="${74}" height="${120}" rx="11" fill="rgba(255,255,255,0.78)"/>
    <rect x="${106 + padding}" y="${234 + padding*0.15}" width="${46}" height="${34}" rx="7" fill="rgba(108,92,231,0.28)"/>
    <rect x="${110 + padding}" y="${313 + padding*0.15}" width="${12}" height="${9}" rx="2" fill="rgba(0,0,0,0.18)"/>
    <rect x="${129 + padding}" y="${313 + padding*0.15}" width="${12}" height="${9}" rx="2" fill="rgba(0,0,0,0.18)"/>
    <rect x="${148 + padding}" y="${313 + padding*0.15}" width="${12}" height="${9}" rx="2" fill="rgba(0,0,0,0.18)"/>
  </g>

  <!-- Cartridge CENTER (tallest, hero, slight highlight) -->
  <rect x="${206 + padding}" y="${160 + padding*0.15}" width="${100}" height="${178}" rx="13" fill="rgba(255,255,255,0.97)" filter="url(#shadow)"/>
  <!-- Label -->
  <rect x="${222 + padding}" y="${180 + padding*0.15}" width="${68}" height="${52}" rx="9" fill="url(#bgInner)" opacity="0.22"/>
  <!-- Star rating -->
  <text x="${256}" y="${213 + padding*0.15}" text-anchor="middle" font-family="Arial" font-size="26" fill="rgba(108,92,231,0.55)">★</text>
  <!-- Score line -->
  <rect x="${228 + padding}" y="${220 + padding*0.15}" width="${28}" height="${5}" rx="2.5" fill="rgba(108,92,231,0.2)"/>
  <rect x="${260 + padding}" y="${220 + padding*0.15}" width="${18}" height="${5}" rx="2.5" fill="rgba(108,92,231,0.12)"/>
  <!-- Bottom lines (like game info) -->
  <rect x="${222 + padding}" y="${248 + padding*0.15}" width="${68}" height="${4}" rx="2" fill="rgba(0,0,0,0.08)"/>
  <rect x="${222 + padding}" y="${258 + padding*0.15}" width="${50}" height="${4}" rx="2" fill="rgba(0,0,0,0.06)"/>
  <!-- Connector tabs -->
  <rect x="${224 + padding}" y="${327 + padding*0.15}" width="${14}" height="${9}" rx="2" fill="rgba(0,0,0,0.14)"/>
  <rect x="${248 + padding}" y="${327 + padding*0.15}" width="${14}" height="${9}" rx="2" fill="rgba(0,0,0,0.14)"/>
  <rect x="${272 + padding}" y="${327 + padding*0.15}" width="${14}" height="${9}" rx="2" fill="rgba(0,0,0,0.14)"/>

  <!-- Cartridge RIGHT (medium, slight tilt right) -->
  <g transform="rotate(2, 368, 285)">
    <rect x="${334 + padding}" y="${224 + padding*0.15}" width="${74}" height="${114}" rx="11" fill="rgba(255,255,255,0.72)"/>
    <rect x="${348 + padding}" y="${240 + padding*0.15}" width="${46}" height="${34}" rx="7" fill="rgba(253,121,168,0.3)"/>
    <rect x="${352 + padding}" y="${313 + padding*0.15}" width="${12}" height="${9}" rx="2" fill="rgba(0,0,0,0.15)"/>
    <rect x="${371 + padding}" y="${313 + padding*0.15}" width="${12}" height="${9}" rx="2" fill="rgba(0,0,0,0.15)"/>
    <rect x="${390 + padding}" y="${313 + padding*0.15}" width="${12}" height="${9}" rx="2" fill="rgba(0,0,0,0.15)"/>
  </g>

  <!-- Small sparkle top-right -->
  <circle cx="${400}" cy="${130}" r="6" fill="rgba(255,255,255,0.35)"/>
  <circle cx="${420}" cy="${108}" r="3.5" fill="rgba(255,255,255,0.25)"/>
  <circle cx="${385}" cy="${108}" r="2.5" fill="rgba(255,255,255,0.2)"/>

  <!-- Small sparkle top-left -->
  <circle cx="${112}" cy="${140}" r="4" fill="rgba(255,255,255,0.2)"/>
  <circle cx="${130}" cy="${118}" r="2.5" fill="rgba(255,255,255,0.15)"/>
</svg>
`;

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

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const iconSvg = (padding = 0) => {
  const scale = 1 - (padding / 320);
  const cx = 256, cy = 256;

  const bw = 320 * scale;
  const bh = 280 * scale;
  const bx = cx - bw / 2;
  const by = cy - bh / 2 + 10;

  const post  = 22 * scale;
  const shelf = 20 * scale;
  const midY  = by + bh * 0.48;

  const innerX     = bx + post;
  const innerW     = bw - post * 2;
  const topFloor   = midY;
  const topInnerH  = topFloor - by - shelf;
  const botFloor   = by + bh - shelf;
  const botInnerH  = botFloor - (midY + shelf);

  // Top shelf: 2 books right-aligned, colored
  const topBookDefs = [
    { w: 54*scale, h: topInnerH * 0.82, fill: '#6c5ce7' },
    { w: 46*scale, h: topInnerH * 0.97, fill: '#ffffff' },
  ];
  let bookX = innerX + innerW - topBookDefs.reduce((a,b)=>a+b.w,0) - 14*scale;
  let topBooks = '';
  topBookDefs.forEach(b => {
    const bky = topFloor - b.h;
    topBooks += `<rect x="${bookX.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/>`;
    topBooks += `<rect x="${(bookX+6).toFixed(1)}" y="${(bky+10).toFixed(1)}" width="${(b.w-12).toFixed(1)}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
    bookX += b.w + 10*scale;
  });

  // Bottom shelf: 3 books left-aligned, colored
  const botBookDefs = [
    { w: 50*scale, h: botInnerH * 0.90, fill: '#ffffff' },
    { w: 44*scale, h: botInnerH * 0.72, fill: '#fd79a8' },
    { w: 52*scale, h: botInnerH * 0.84, fill: '#6c5ce7' },
  ];
  let bookX2 = innerX + 14*scale;
  let botBooks = '';
  botBookDefs.forEach(b => {
    const bky = botFloor - b.h;
    botBooks += `<rect x="${bookX2.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/>`;
    botBooks += `<rect x="${(bookX2+6).toFixed(1)}" y="${(bky+10).toFixed(1)}" width="${(b.w-12).toFixed(1)}" height="5" rx="2" fill="rgba(0,0,0,0.1)"/>`;
    bookX2 += b.w + 10*scale;
  });

  // Sparkle dots (top-left and top-right of icon, outside bookcase)
  const spark = `
    <circle cx="${(bx+bw+28).toFixed(1)}" cy="${(by+10).toFixed(1)}" r="${(9*scale).toFixed(1)}" fill="rgba(255,255,255,0.5)"/>
    <circle cx="${(bx+bw+52).toFixed(1)}" cy="${(by+38).toFixed(1)}" r="${(5*scale).toFixed(1)}" fill="rgba(255,255,255,0.3)"/>
    <circle cx="${(bx-24).toFixed(1)}"    cy="${(by+24).toFixed(1)}" r="${(6*scale).toFixed(1)}" fill="rgba(255,255,255,0.35)"/>
    <circle cx="${(bx-46).toFixed(1)}"    cy="${(by+54).toFixed(1)}" r="${(4*scale).toFixed(1)}" fill="rgba(255,255,255,0.2)"/>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0820"/>
      <stop offset="55%" stop-color="#3b2fa0"/>
      <stop offset="100%" stop-color="#c0407a"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="sh">
      <feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
    <filter id="bookglow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#6c5ce7" flood-opacity="0.7"/>
    </filter>
    <filter id="pinkglow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fd79a8" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- Background: very dark -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Center radial glow -->
  <rect width="512" height="512" fill="url(#centerGlow)"/>

  <!-- Dark inner compartments (#080810 — app background color) -->
  <rect x="${(innerX).toFixed(1)}"   y="${(by+shelf).toFixed(1)}"   width="${innerW.toFixed(1)}" height="${(topInnerH).toFixed(1)}" fill="#080810"/>
  <rect x="${(innerX).toFixed(1)}"   y="${(midY+shelf).toFixed(1)}" width="${innerW.toFixed(1)}" height="${(botInnerH).toFixed(1)}" fill="#080810"/>

  <!-- Purple books with glow -->
  <g filter="url(#bookglow)">
    ${topBooks.match(/rect[^/]*(fill="#6c5ce7")[^/]*\/>/g)?.join('') || ''}
    ${botBooks.match(/rect[^/]*(fill="#6c5ce7")[^/]*\/>/g)?.join('') || ''}
  </g>

  <!-- Pink books with glow -->
  <g filter="url(#pinkglow)">
    ${botBooks.match(/rect[^/]*(fill="#fd79a8")[^/]*\/>/g)?.join('') || ''}
  </g>

  <!-- All books (full render on top) -->
  ${topBooks}
  ${botBooks}

  <!-- Bookcase frame -->
  <g filter="url(#sh)">
    <rect x="${bx.toFixed(1)}"           y="${by.toFixed(1)}"             width="${post.toFixed(1)}"  height="${bh.toFixed(1)}"   rx="11" fill="white"/>
    <rect x="${(bx+bw-post).toFixed(1)}" y="${by.toFixed(1)}"             width="${post.toFixed(1)}"  height="${bh.toFixed(1)}"   rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${by.toFixed(1)}"             width="${bw.toFixed(1)}"    height="${shelf.toFixed(1)}" rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${midY.toFixed(1)}"           width="${bw.toFixed(1)}"    height="${shelf.toFixed(1)}" rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${(by+bh-shelf).toFixed(1)}"  width="${bw.toFixed(1)}"    height="${shelf.toFixed(1)}" rx="11" fill="white"/>
  </g>

  <!-- Sparkles -->
  ${spark}
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

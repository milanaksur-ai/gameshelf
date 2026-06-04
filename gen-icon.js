const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const iconSvg = (padding = 0) => {
  const scale = 1 - (padding / 320);
  const cx = 256, cy = 256;

  // Bookcase dimensions
  const bw = 320 * scale;  // total width
  const bh = 280 * scale;  // total height
  const bx = cx - bw / 2;
  const by = cy - bh / 2 + 10;

  const post = 22 * scale;       // post thickness
  const shelf = 20 * scale;      // shelf thickness
  const midY = by + bh * 0.48;   // middle shelf y

  // Books top shelf (between posts, above midY)
  const innerX = bx + post;
  const innerW = bw - post * 2;
  const topFloor = midY;
  const topCeil = by;
  const topInnerH = topFloor - topCeil - shelf;

  // 2 books on top shelf (right-aligned like the reference)
  const bk = [
    { w: 54*scale, h: topInnerH * 0.80 },
    { w: 46*scale, h: topInnerH * 0.95 },
  ];
  let bookX = innerX + innerW - bk.reduce((a,b)=>a+b.w,0) - 16*scale;
  let topBooks = '';
  bk.forEach(b => {
    const bky = topFloor - b.h;
    topBooks += `<rect x="${bookX.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="white"/>`;
    bookX += b.w + 10*scale;
  });

  // 3 books on bottom shelf (left-aligned)
  const botFloor = by + bh - shelf;
  const botCeil = midY + shelf;
  const botInnerH = botFloor - botCeil;
  const bk2 = [
    { w: 50*scale, h: botInnerH * 0.88 },
    { w: 44*scale, h: botInnerH * 0.72 },
    { w: 50*scale, h: botInnerH * 0.82 },
  ];
  let bookX2 = innerX + 16*scale;
  let botBooks = '';
  bk2.forEach(b => {
    const bky = botFloor - b.h;
    botBooks += `<rect x="${bookX2.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="white"/>`;
    bookX2 += b.w + 10*scale;
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a4fcf"/>
      <stop offset="100%" stop-color="#e8639a"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Books (behind posts) -->
  ${topBooks}
  ${botBooks}

  <!-- Left post -->
  <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${post.toFixed(1)}" height="${bh.toFixed(1)}" rx="11" fill="white"/>

  <!-- Right post -->
  <rect x="${(bx+bw-post).toFixed(1)}" y="${by.toFixed(1)}" width="${post.toFixed(1)}" height="${bh.toFixed(1)}" rx="11" fill="white"/>

  <!-- Top shelf -->
  <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${shelf.toFixed(1)}" rx="11" fill="white"/>

  <!-- Middle shelf -->
  <rect x="${bx.toFixed(1)}" y="${midY.toFixed(1)}" width="${bw.toFixed(1)}" height="${shelf.toFixed(1)}" rx="11" fill="white"/>

  <!-- Bottom shelf -->
  <rect x="${bx.toFixed(1)}" y="${(by+bh-shelf).toFixed(1)}" width="${bw.toFixed(1)}" height="${shelf.toFixed(1)}" rx="11" fill="white"/>
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

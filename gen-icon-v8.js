const { chromium } = require('/opt/node22/lib/node_modules/playwright');

function makeSvg(padding = 0) {
  const scale = 1 - (padding / 320);
  const cx = 256, cy = 256;
  const bw = 320 * scale, bh = 280 * scale;
  const bx = cx - bw / 2, by = cy - bh / 2 + 10;
  const post = 22 * scale, shelf = 20 * scale;
  const midY = by + bh * 0.48;
  const innerX = bx + post, innerW = bw - post * 2;
  const topFloor = midY, topInnerH = topFloor - by - shelf;
  const botFloor = by + bh - shelf, botInnerH = botFloor - (midY + shelf);

  const topBookDefs = [
    { w: 54*scale, h: topInnerH*0.82, fill:'#6c5ce7' },
    { w: 46*scale, h: topInnerH*0.97, fill:'#ffffff' },
  ];
  let bookX = innerX + innerW - topBookDefs.reduce((a,b)=>a+b.w,0) - 14*scale;
  let topBooks = '';
  topBookDefs.forEach(b => {
    const bky = topFloor - b.h;
    const gf = b.fill === '#6c5ce7' ? 'url(#bookglow)' : 'none';
    topBooks += `<g filter="${gf}"><rect x="${bookX.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/></g>`;
    topBooks += `<rect x="${(bookX+6).toFixed(1)}" y="${(bky+10).toFixed(1)}" width="${(b.w-12).toFixed(1)}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
    bookX += b.w + 10*scale;
  });

  const botBookDefs = [
    { w: 50*scale, h: botInnerH*0.90, fill:'#ffffff' },
    { w: 44*scale, h: botInnerH*0.72, fill:'#fd79a8' },
    { w: 52*scale, h: botInnerH*0.84, fill:'#6c5ce7' },
  ];
  let bookX2 = innerX + 14*scale;
  let botBooks = '';
  botBookDefs.forEach(b => {
    const bky = botFloor - b.h;
    const gf = b.fill === '#6c5ce7' ? 'url(#bookglow)' : b.fill === '#fd79a8' ? 'url(#pinkglow)' : 'none';
    botBooks += `<g filter="${gf}"><rect x="${bookX2.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/></g>`;
    botBooks += `<rect x="${(bookX2+6).toFixed(1)}" y="${(bky+10).toFixed(1)}" width="${(b.w-12).toFixed(1)}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
    bookX2 += b.w + 10*scale;
  });

  // ── ABXY buttons replace the plain white dots ─────────────────────────────
  // Original positions: right side (bx+bw+28/+52) and left side (bx-24/bx-46)
  const spark = `
    <!-- ABXY gaming dots (replace white sparkles) -->
    <circle cx="${(bx+bw+28).toFixed(1)}" cy="${(by+12).toFixed(1)}"  r="${(11*scale).toFixed(1)}" fill="#fd79a8" opacity="0.85"/>
    <circle cx="${(bx+bw+52).toFixed(1)}" cy="${(by+44).toFixed(1)}"  r="${(7*scale).toFixed(1)}"  fill="#6c5ce7" opacity="0.8"/>
    <circle cx="${(bx-26).toFixed(1)}"    cy="${(by+26).toFixed(1)}"  r="${(8*scale).toFixed(1)}"  fill="#a29bfe" opacity="0.8"/>
    <circle cx="${(bx-48).toFixed(1)}"    cy="${(by+58).toFixed(1)}"  r="${(5*scale).toFixed(1)}"  fill="rgba(255,255,255,0.65)"/>`;

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
    <filter id="sh">
      <feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
    <filter id="bookglow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#6c5ce7" flood-opacity="0.65"/>
    </filter>
    <filter id="pinkglow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fd79a8" flood-opacity="0.65"/>
    </filter>
  </defs>

  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#centerGlow)"/>

  <!-- Compartments -->
  <rect x="${innerX.toFixed(1)}" y="${(by+shelf).toFixed(1)}"   width="${innerW.toFixed(1)}" height="${topInnerH.toFixed(1)}" fill="url(#cg)"/>
  <rect x="${innerX.toFixed(1)}" y="${(midY+shelf).toFixed(1)}" width="${innerW.toFixed(1)}" height="${botInnerH.toFixed(1)}" fill="url(#cg)"/>

  ${topBooks}
  ${botBooks}

  <!-- White frame -->
  <g filter="url(#sh)">
    <rect x="${bx.toFixed(1)}"           y="${by.toFixed(1)}"            width="${post.toFixed(1)}" height="${bh.toFixed(1)}"    rx="11" fill="white"/>
    <rect x="${(bx+bw-post).toFixed(1)}" y="${by.toFixed(1)}"            width="${post.toFixed(1)}" height="${bh.toFixed(1)}"    rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${by.toFixed(1)}"            width="${bw.toFixed(1)}"   height="${shelf.toFixed(1)}" rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${midY.toFixed(1)}"          width="${bw.toFixed(1)}"   height="${shelf.toFixed(1)}" rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${(by+bh-shelf).toFixed(1)}" width="${bw.toFixed(1)}"   height="${shelf.toFixed(1)}" rx="11" fill="white"/>
  </g>

  ${spark}
</svg>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:512px;height:512px;overflow:hidden}</style></head><body>${makeSvg(0)}</body></html>`);
  await page.screenshot({ path: 'icon-512-v8.png', clip: { x:0, y:0, width:512, height:512 } });
  await browser.close();
  console.log('Done → icon-512-v8.png');
})();

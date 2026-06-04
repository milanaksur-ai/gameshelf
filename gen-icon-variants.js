const { chromium } = require('/opt/node22/lib/node_modules/playwright');

function makeSvg(variant, padding = 0) {
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
    topBooks += `<rect x="${bookX.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/>`;
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
    botBooks += `<rect x="${bookX2.toFixed(1)}" y="${bky.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="7" fill="${b.fill}"/>`;
    botBooks += `<rect x="${(bookX2+6).toFixed(1)}" y="${(bky+10).toFixed(1)}" width="${(b.w-12).toFixed(1)}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
    bookX2 += b.w + 10*scale;
  });

  const spark = `
    <circle cx="${(bx+bw+28).toFixed(1)}" cy="${(by+10).toFixed(1)}" r="${(9*scale).toFixed(1)}" fill="rgba(255,255,255,0.45)"/>
    <circle cx="${(bx+bw+52).toFixed(1)}" cy="${(by+38).toFixed(1)}" r="${(5*scale).toFixed(1)}" fill="rgba(255,255,255,0.28)"/>
    <circle cx="${(bx-24).toFixed(1)}"    cy="${(by+24).toFixed(1)}" r="${(6*scale).toFixed(1)}" fill="rgba(255,255,255,0.32)"/>
    <circle cx="${(bx-46).toFixed(1)}"    cy="${(by+54).toFixed(1)}" r="${(4*scale).toFixed(1)}" fill="rgba(255,255,255,0.2)"/>`;

  // Compartment fills vary by variant
  let compartmentDefs = '';
  let topFill = '', botFill = '';

  if (variant === 'A') {
    // Gradient: dark purple top → very dark bottom (subtle purple tint)
    compartmentDefs = `
      <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1a0f3e"/>
        <stop offset="100%" stop-color="#050410"/>
      </linearGradient>`;
    topFill = 'url(#cg)';
    botFill = 'url(#cg)';
  } else if (variant === 'B') {
    // Semi-transparent — background gradient shows through
    compartmentDefs = `
      <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0d0820" stop-opacity="0.82"/>
        <stop offset="100%" stop-color="#080810" stop-opacity="0.92"/>
      </linearGradient>`;
    topFill = 'url(#cg)';
    botFill = 'url(#cg)';
  } else if (variant === 'C') {
    // Different gradient per shelf: top=purple-dark, bottom=dark-pink
    compartmentDefs = `
      <linearGradient id="cgTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#12083a"/>
        <stop offset="100%" stop-color="#06040f"/>
      </linearGradient>
      <linearGradient id="cgBot" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#06040f"/>
        <stop offset="100%" stop-color="#1a0720"/>
      </linearGradient>`;
    topFill = 'url(#cgTop)';
    botFill = 'url(#cgBot)';
  }

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
    ${compartmentDefs}
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
  <rect x="${innerX.toFixed(1)}" y="${(by+shelf).toFixed(1)}"   width="${innerW.toFixed(1)}" height="${topInnerH.toFixed(1)}" fill="${topFill}"/>
  <rect x="${innerX.toFixed(1)}" y="${(midY+shelf).toFixed(1)}" width="${innerW.toFixed(1)}" height="${botInnerH.toFixed(1)}" fill="${botFill}"/>

  <!-- Purple glow books -->
  <g filter="url(#bookglow)">
    <rect x="${(innerX+innerW-54*scale-46*scale-14*scale-10*scale).toFixed(1)}" y="${(topFloor-topInnerH*0.82).toFixed(1)}" width="${(54*scale).toFixed(1)}" height="${(topInnerH*0.82).toFixed(1)}" rx="7" fill="#6c5ce7"/>
    <rect x="${(innerX+14*scale+50*scale+44*scale+20*scale).toFixed(1)}" y="${(botFloor-botInnerH*0.84).toFixed(1)}" width="${(52*scale).toFixed(1)}" height="${(botInnerH*0.84).toFixed(1)}" rx="7" fill="#6c5ce7"/>
  </g>
  <!-- Pink glow books -->
  <g filter="url(#pinkglow)">
    <rect x="${(innerX+14*scale+50*scale+10*scale).toFixed(1)}" y="${(botFloor-botInnerH*0.72).toFixed(1)}" width="${(44*scale).toFixed(1)}" height="${(botInnerH*0.72).toFixed(1)}" rx="7" fill="#fd79a8"/>
  </g>

  ${topBooks}
  ${botBooks}

  <g filter="url(#sh)">
    <rect x="${bx.toFixed(1)}"           y="${by.toFixed(1)}"            width="${post.toFixed(1)}" height="${bh.toFixed(1)}"   rx="11" fill="white"/>
    <rect x="${(bx+bw-post).toFixed(1)}" y="${by.toFixed(1)}"            width="${post.toFixed(1)}" height="${bh.toFixed(1)}"   rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${by.toFixed(1)}"            width="${bw.toFixed(1)}"   height="${shelf.toFixed(1)}" rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${midY.toFixed(1)}"          width="${bw.toFixed(1)}"   height="${shelf.toFixed(1)}" rx="11" fill="white"/>
    <rect x="${bx.toFixed(1)}"           y="${(by+bh-shelf).toFixed(1)}" width="${bw.toFixed(1)}"   height="${shelf.toFixed(1)}" rx="11" fill="white"/>
  </g>

  ${spark}
</svg>`;
}

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const v of ['A', 'B', 'C']) {
    await page.setViewportSize({ width: 512, height: 512 });
    await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}body{width:512px;height:512px;overflow:hidden}</style></head><body>${makeSvg(v, 0)}</body></html>`);
    await page.screenshot({ path: `/home/user/gameshelf/icon-variant-${v}.png`, clip: { x:0, y:0, width:512, height:512 } });
    console.log(`✅ icon-variant-${v}.png`);
  }

  await browser.close();
}

generate().catch(console.error);

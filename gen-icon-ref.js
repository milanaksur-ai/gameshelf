const { chromium } = require('/opt/node22/lib/node_modules/playwright');

function baseShelf() {
  const bx=96, by=126, bw=320, bh=280, post=22, shelf=20;
  const midY=by+bh*0.48, innerX=bx+post, innerW=bw-post*2;
  const topFloor=midY, topInnerH=topFloor-by-shelf;
  const botFloor=by+bh-shelf, botInnerH=botFloor-(midY+shelf);

  const topBooks = [
    {x:280, y:topFloor-topInnerH*0.82, w:54, h:topInnerH*0.82, f:'#6c5ce7'},
    {x:344, y:topFloor-topInnerH*0.97, w:46, h:topInnerH*0.97, f:'#ffffff'},
  ];
  const botBooks = [
    {x:132, y:botFloor-botInnerH*0.90, w:50, h:botInnerH*0.90, f:'#ffffff'},
    {x:192, y:botFloor-botInnerH*0.72, w:44, h:botInnerH*0.72, f:'#fd79a8'},
    {x:246, y:botFloor-botInnerH*0.84, w:52, h:botInnerH*0.84, f:'#6c5ce7'},
  ];

  const booksHtml = [...topBooks,...botBooks].map(b => {
    const gf = b.f==='#6c5ce7'?'url(#bookglow)':b.f==='#fd79a8'?'url(#pinkglow)':'none';
    return `<g filter="${gf}"><rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w}" height="${b.h.toFixed(1)}" rx="7" fill="${b.f}"/></g>
  <rect x="${b.x+6}" y="${(b.y+10).toFixed(1)}" width="${b.w-12}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
  }).join('\n  ');

  return {
    innerX, innerW, topInnerH: topInnerH.toFixed(1), botInnerH: botInnerH.toFixed(1),
    by, bx, bw, bh, post, shelf, midY,
    booksHtml,
    frame: `<g filter="url(#sh)">
    <rect x="${bx}" y="${by}" width="${post}" height="${bh}" rx="11" fill="white"/>
    <rect x="${bx+bw-post}" y="${by}" width="${post}" height="${bh}" rx="11" fill="white"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${shelf}" rx="11" fill="white"/>
    <rect x="${bx}" y="${midY.toFixed(1)}" width="${bw}" height="${shelf}" rx="11" fill="white"/>
    <rect x="${bx}" y="${by+bh-shelf}" width="${bw}" height="${shelf}" rx="11" fill="white"/>
  </g>`,
    sparks: `
  <circle cx="${bx+bw+28}" cy="${by+10}"  r="9" fill="rgba(255,255,255,0.45)"/>
  <circle cx="${bx+bw+52}" cy="${by+38}"  r="5" fill="rgba(255,255,255,0.28)"/>
  <circle cx="${bx-24}"    cy="${by+24}"  r="6" fill="rgba(255,255,255,0.32)"/>
  <circle cx="${bx-46}"    cy="${by+54}"  r="4" fill="rgba(255,255,255,0.2)"/>`,
    compTop: `<rect x="${innerX}" y="${(by+shelf).toFixed(1)}" width="${innerW}" height="${topInnerH.toFixed(1)}" fill="url(#cg)"/>`,
    compBot: `<rect x="${innerX}" y="${(midY+shelf).toFixed(1)}" width="${innerW}" height="${botInnerH.toFixed(1)}" fill="url(#cg)"/>`,
  };
}

// ── Reference controller shape ────────────────────────────────────────────
// Matches the user's reference: wide rounded body, two grip tabs, D-pad, 2 pills
function makeCtrl(cx, cy, fill, glowFilter) {
  const bw=100, bh=42, rx=22;
  const bx=cx-bw/2, by=cy-bh/2-4;

  // Grips: two rounded rects hanging below body, gap in center creates the arch
  const gw=27, gh=30, grx=13;
  const lgx=bx+3,        lgy=by+bh-11;
  const rgx=bx+bw-gw-3,  rgy=lgy;

  // D-pad center (left side)
  const dpX=bx+26, dpY=by+bh/2+2;
  const da=8, dt=8;

  // Two angled pill buttons (right side) — like the reference image
  const p1cx=bx+bw-30, p1cy=by+bh/2-5;  // upper pill center
  const p2cx=bx+bw-20, p2cy=by+bh/2+5;  // lower pill center
  const pw=15, ph=7;
  const pAngle=-32;

  return `
  <!-- Controller: body + grips -->
  <g filter="${glowFilter}">
    <rect x="${bx}"   y="${by}"   width="${bw}" height="${bh}" rx="${rx}" fill="${fill}"/>
    <rect x="${lgx}"  y="${lgy}"  width="${gw}" height="${gh}" rx="${grx}" fill="${fill}"/>
    <rect x="${rgx}"  y="${rgy}"  width="${gw}" height="${gh}" rx="${grx}" fill="${fill}"/>
  </g>
  <rect x="${bx}"  y="${by}"  width="${bw}" height="${bh}" rx="${rx}" fill="${fill}"/>
  <rect x="${lgx}" y="${lgy}" width="${gw}" height="${gh}" rx="${grx}" fill="${fill}"/>
  <rect x="${rgx}" y="${rgy}" width="${gw}" height="${gh}" rx="${grx}" fill="${fill}"/>

  <!-- D-pad (left) -->
  <rect x="${dpX-dt/2}" y="${dpY-da-dt/2}" width="${dt}" height="${da*2+dt}" rx="3" fill="rgba(255,255,255,0.9)"/>
  <rect x="${dpX-da-dt/2}" y="${dpY-dt/2}" width="${da*2+dt}" height="${dt}" rx="3" fill="rgba(255,255,255,0.9)"/>

  <!-- Two angled pills (right) -->
  <rect x="${p1cx-pw/2}" y="${p1cy-ph/2}" width="${pw}" height="${ph}" rx="${ph/2}"
        fill="rgba(255,255,255,0.88)"
        transform="rotate(${pAngle} ${p1cx} ${p1cy})"/>
  <rect x="${p2cx-pw/2}" y="${p2cy-ph/2}" width="${pw}" height="${ph}" rx="${ph/2}"
        fill="rgba(255,255,255,0.88)"
        transform="rotate(${pAngle} ${p2cx} ${p2cy})"/>`;
}

function buildSvg(ctrlFill, extraDefs) {
  const s = baseShelf();
  const ctrl = makeCtrl(196, 200, ctrlFill, 'url(#ctrlglow)');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0820"/>
      <stop offset="55%" stop-color="#3b2fa0"/>
      <stop offset="100%" stop-color="#c0407a"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a0f3e"/>
      <stop offset="100%" stop-color="#050410"/>
    </linearGradient>
    <filter id="sh"><feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="rgba(0,0,0,0.6)"/></filter>
    <filter id="bookglow"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#6c5ce7" flood-opacity="0.65"/></filter>
    <filter id="pinkglow"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fd79a8" flood-opacity="0.65"/></filter>
    <filter id="ctrlglow"><feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#8b7cf8" flood-opacity="0.75"/></filter>
    ${extraDefs}
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#centerGlow)"/>
  ${s.compTop}
  ${s.compBot}
  ${ctrl}
  ${s.booksHtml}
  ${s.frame}
  ${s.sparks}
</svg>`;
}

// 4 colour variants
const variants = [
  {
    name: '1-purple-pink',
    fill: 'url(#g1)',
    defs: `<linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6c5ce7"/>
      <stop offset="100%" stop-color="#c9547a"/>
    </linearGradient>`,
  },
  {
    name: '2-deep-violet',
    fill: 'url(#g2)',
    defs: `<linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d1b8a"/>
      <stop offset="100%" stop-color="#7c4fcf"/>
    </linearGradient>`,
  },
  {
    name: '3-pink-hot',
    fill: 'url(#g3)',
    defs: `<linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>`,
  },
  {
    name: '4-white-outline',
    fill: 'none',
    defs: '',
    custom: (s) => {
      const c = makeCtrl(196, 200, 'none', 'none');
      // override: stroke only version
      return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0820"/>
      <stop offset="55%" stop-color="#3b2fa0"/>
      <stop offset="100%" stop-color="#c0407a"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a0f3e"/>
      <stop offset="100%" stop-color="#050410"/>
    </linearGradient>
    <filter id="sh"><feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="rgba(0,0,0,0.6)"/></filter>
    <filter id="bookglow"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#6c5ce7" flood-opacity="0.65"/></filter>
    <filter id="pinkglow"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fd79a8" flood-opacity="0.65"/></filter>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#centerGlow)"/>
  ${s.compTop}
  ${s.compBot}
  <!-- Outline controller -->
  <g fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5">
    <rect x="146" y="171" width="100" height="42" rx="22"/>
    <rect x="149" y="202" width="27" height="30" rx="13"/>
    <rect x="217" y="202" width="27" height="30" rx="13"/>
    <rect x="164" y="185" width="8"  height="24" rx="3"/>
    <rect x="156" y="193" width="24" height="8"  rx="3"/>
    <rect x="163" y="183" width="15" height="7" rx="3.5" transform="rotate(-32 170.5 186.5)"/>
    <rect x="173" y="191" width="15" height="7" rx="3.5" transform="rotate(-32 180.5 194.5)"/>
  </g>
  ${s.booksHtml}
  ${s.frame}
  ${s.sparks}
</svg>`;
    }
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });
  const s = baseShelf();

  for (const v of variants) {
    const svg = v.custom ? v.custom(s) : buildSvg(v.fill, v.defs);
    await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:512px;height:512px;overflow:hidden}</style></head><body>${svg}</body></html>`);
    await page.screenshot({ path: `icon-ref-${v.name}.png`, clip: { x:0, y:0, width:512, height:512 } });
    console.log(`✅ icon-ref-${v.name}.png`);
  }

  await browser.close();
})();

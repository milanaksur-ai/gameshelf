const { chromium } = require('/opt/node22/lib/node_modules/playwright');

// ── Base bookcase (identical for all variants) ────────────────────────────
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
  const allBooks = [...topBooks, ...botBooks];

  const booksHtml = allBooks.map(b => {
    const gf = b.f==='#6c5ce7'?'url(#bookglow)':b.f==='#fd79a8'?'url(#pinkglow)':'none';
    return `<g filter="${gf}"><rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w}" height="${b.h.toFixed(1)}" rx="7" fill="${b.f}"/></g>
  <rect x="${b.x+6}" y="${(b.y+10).toFixed(1)}" width="${b.w-12}" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>`;
  }).join('\n  ');

  return {
    bx, by, bw, bh, post, shelf, midY, innerX, innerW, topInnerH, botInnerH,
    booksHtml,
    frame: `
  <g filter="url(#sh)">
    <rect x="${bx}"       y="${by}"               width="${post}" height="${bh}"    rx="11" fill="white"/>
    <rect x="${bx+bw-post}" y="${by}"              width="${post}" height="${bh}"    rx="11" fill="white"/>
    <rect x="${bx}"       y="${by}"               width="${bw}"   height="${shelf}" rx="11" fill="white"/>
    <rect x="${bx}"       y="${midY.toFixed(1)}"   width="${bw}"   height="${shelf}" rx="11" fill="white"/>
    <rect x="${bx}"       y="${by+bh-shelf}"       width="${bw}"   height="${shelf}" rx="11" fill="white"/>
  </g>`,
    sparks: `
  <circle cx="${bx+bw+28}" cy="${by+10}"  r="9"  fill="rgba(255,255,255,0.45)"/>
  <circle cx="${bx+bw+52}" cy="${by+38}"  r="5"  fill="rgba(255,255,255,0.28)"/>
  <circle cx="${bx-24}"    cy="${by+24}"  r="6"  fill="rgba(255,255,255,0.32)"/>
  <circle cx="${bx-46}"    cy="${by+54}"  r="4"  fill="rgba(255,255,255,0.2)"/>`,
    compTop: `<rect x="${innerX}" y="${(by+shelf).toFixed(1)}" width="${innerW}" height="${topInnerH.toFixed(1)}" fill="url(#cg)"/>`,
    compBot: `<rect x="${innerX}" y="${(midY+shelf).toFixed(1)}" width="${innerW}" height="${botInnerH.toFixed(1)}" fill="url(#cg)"/>`,
  };
}

function wrapSvg(extraDefs, content) {
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
    <filter id="ctrlglow"><feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#8b7cf8" flood-opacity="0.7"/></filter>
    ${extraDefs}
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#centerGlow)"/>
  ${content}
</svg>`;
}

// ── Variant A: PlayStation style — wide oval, deep curved grips ──────────
function ctrlA() {
  // PS-style: wide oval body, two deep grips curving down
  const cx=196, cy=198, bw=98, bh=46, rx=23;
  const bx=cx-bw/2, by=cy-bh/2;
  // Grips: two teardrop shapes at bottom
  const lgx=bx+8,  lgy=by+bh-16, lgw=24, lgh=34;
  const rgx=bx+bw-32, rgy=lgy, rgw=24, rgh=34;
  // D-pad (left)
  const dpx=bx+20, dpy=cy, da=8, dt=8;
  // Symbols ○□△× as circles
  const btx=bx+bw-22, bty=cy, btr=5;
  // Touchpad center
  const tpx=cx, tpy=cy-4;

  return `
  <g filter="url(#ctrlglow)">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#psgrad)"/>
    <ellipse cx="${lgx+lgw/2}" cy="${lgy+lgh*0.55}" rx="${lgw/2}" ry="${lgh/2}" fill="url(#psgrad)"/>
    <ellipse cx="${rgx+rgw/2}" cy="${rgy+rgh*0.55}" rx="${rgw/2}" ry="${rgh/2}" fill="url(#psgrad)"/>
  </g>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#psgrad)"/>
  <!-- Touchpad -->
  <rect x="${tpx-11}" y="${tpy-7}" width="22" height="14" rx="7" fill="rgba(255,255,255,0.18)"/>
  <!-- D-pad -->
  <rect x="${dpx-dt/2}" y="${dpy-da-dt/2}" width="${dt}" height="${da*2+dt}" rx="3" fill="rgba(255,255,255,0.82)"/>
  <rect x="${dpx-da-dt/2}" y="${dpy-dt/2}" width="${da*2+dt}" height="${dt}" rx="3" fill="rgba(255,255,255,0.82)"/>
  <!-- ○ □ △ × -->
  <circle cx="${btx}"   cy="${bty-9}" r="${btr}" fill="#a29bfe" opacity="0.9"/>
  <circle cx="${btx+9}" cy="${bty}"   r="${btr}" fill="#fd79a8" opacity="0.9"/>
  <circle cx="${btx-9}" cy="${bty}"   r="${btr}" fill="rgba(255,255,255,0.85)"/>
  <circle cx="${btx}"   cy="${bty+9}" r="${btr}" fill="#6c5ce7" opacity="0.9"/>
  <!-- L/R bumpers -->
  <rect x="${bx+10}" y="${by-9}" width="22" height="11" rx="5" fill="rgba(255,255,255,0.35)"/>
  <rect x="${bx+bw-32}" y="${by-9}" width="22" height="11" rx="5" fill="rgba(255,255,255,0.35)"/>`;
}

// ── Variant B: Xbox style — rectangular, asymmetric sticks, bumps on top ─
function ctrlB() {
  const cx=196, cy=200, bw=100, bh=52, rx=18;
  const bx=cx-bw/2, by=cy-bh/2;
  // Bumps on top (shoulder buttons integrated into body shape)
  const lgx=bx+6, lgy=by+bh-18, lgw=28, lgh=32;
  const rgx=bx+bw-34, rgy=lgy, rgw=28, rgh=32;
  // Sticks: left top-left, right center-right (asymmetric Xbox layout)
  const lsX=bx+22, lsY=by+22, rsX=bx+bw-28, rsY=by+bh-12, sr=9;
  // D-pad: bottom-left
  const dpx=bx+20, dpy=by+bh-14, da=6, dt=6;
  // Buttons: top-right
  const btx=bx+bw-22, bty=by+22, btr=5;
  // Guide button
  const gx=cx, gy=cy-4;

  return `
  <g filter="url(#ctrlglow)">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#xbgrad)"/>
    <rect x="${lgx}" y="${lgy}" width="${lgw}" height="${lgh}" rx="14" fill="url(#xbgrad)"/>
    <rect x="${rgx}" y="${rgy}" width="${rgw}" height="${rgh}" rx="14" fill="url(#xbgrad)"/>
  </g>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#xbgrad)"/>
  <!-- Bumpers on top edge -->
  <rect x="${bx+8}"  y="${by-8}" width="28" height="13" rx="6" fill="rgba(255,255,255,0.38)"/>
  <rect x="${bx+bw-36}" y="${by-8}" width="28" height="13" rx="6" fill="rgba(255,255,255,0.38)"/>
  <!-- Left stick (top-left) -->
  <circle cx="${lsX}" cy="${lsY}" r="${sr}"   fill="rgba(0,0,0,0.3)"/>
  <circle cx="${lsX}" cy="${lsY}" r="${sr-3}" fill="rgba(255,255,255,0.12)"/>
  <!-- D-pad (bottom-left) -->
  <rect x="${dpx-dt/2}" y="${dpy-da-dt/2}" width="${dt}" height="${da*2+dt}" rx="2" fill="rgba(255,255,255,0.75)"/>
  <rect x="${dpx-da-dt/2}" y="${dpy-dt/2}" width="${da*2+dt}" height="${dt}" rx="2" fill="rgba(255,255,255,0.75)"/>
  <!-- ABXY (top-right) -->
  <circle cx="${btx}"   cy="${bty-8}" r="${btr}" fill="#a29bfe" opacity="0.9"/>
  <circle cx="${btx+8}" cy="${bty}"   r="${btr}" fill="#fd79a8" opacity="0.9"/>
  <circle cx="${btx-8}" cy="${bty}"   r="${btr}" fill="rgba(255,255,255,0.85)"/>
  <circle cx="${btx}"   cy="${bty+8}" r="${btr}" fill="#6c5ce7"/>
  <!-- Right stick (bottom-right) -->
  <circle cx="${rsX}" cy="${rsY}" r="${sr}"   fill="rgba(0,0,0,0.3)"/>
  <circle cx="${rsX}" cy="${rsY}" r="${sr-3}" fill="rgba(255,255,255,0.12)"/>
  <!-- Guide button -->
  <circle cx="${gx}" cy="${gy}" r="6" fill="rgba(255,255,255,0.5)"/>
  <circle cx="${gx}" cy="${gy}" r="3.5" fill="rgba(255,255,255,0.7)"/>`;
}

// ── Variant C: Retro SNES — flat, no grips, wide, pastel ─────────────────
function ctrlC() {
  const cx=196, cy=200, bw=108, bh=42, rx=14;
  const bx=cx-bw/2, by=cy-bh/2;
  // Shoulder tabs (curved top bumps)
  const ltx=bx-2, lty=by-8, ltw=26, lth=14;
  const rtx=bx+bw-24, rty=lty, rtw=26, rth=14;
  // D-pad (far left)
  const dpx=bx+20, dpy=cy, da=7, dt=7;
  // AB buttons (far right)
  const abx=bx+bw-18, aby=cy, abr=6;
  // Select/Start (center)
  const sx=cx-10, sy=cy, ex=cx+10, ey=cy, sr2=5;

  return `
  <g filter="url(#ctrlglow)">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#snesgrad)"/>
    <rect x="${ltx}" y="${lty}" width="${ltw}" height="${lth}" rx="7" fill="url(#snesgrad)"/>
    <rect x="${rtx}" y="${rty}" width="${rtw}" height="${rth}" rx="7" fill="url(#snesgrad)"/>
  </g>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#snesgrad)"/>
  <!-- D-pad -->
  <rect x="${dpx-dt/2}" y="${dpy-da-dt/2}" width="${dt}" height="${da*2+dt}" rx="3" fill="rgba(255,255,255,0.85)"/>
  <rect x="${dpx-da-dt/2}" y="${dpy-dt/2}" width="${da*2+dt}" height="${dt}" rx="3" fill="rgba(255,255,255,0.85)"/>
  <!-- Select / Start -->
  <rect x="${sx-sr2}" y="${sy-4}" width="${sr2*2}" height="8" rx="4" fill="rgba(255,255,255,0.5)"/>
  <rect x="${ex-sr2}" y="${ey-4}" width="${sr2*2}" height="8" rx="4" fill="rgba(255,255,255,0.5)"/>
  <!-- Y X B A (2×2 on right) -->
  <circle cx="${abx-12}" cy="${aby-7}" r="${abr}" fill="#a29bfe" opacity="0.9"/>
  <circle cx="${abx}"    cy="${aby-7}" r="${abr}" fill="rgba(255,255,255,0.9)"/>
  <circle cx="${abx-12}" cy="${aby+7}" r="${abr}" fill="#6c5ce7" opacity="0.9"/>
  <circle cx="${abx}"    cy="${aby+7}" r="${abr}" fill="#fd79a8" opacity="0.9"/>`;
}

// ── Variant D: Controller outline only — ghostly/artistic stroke ──────────
function ctrlD() {
  const cx=196, cy=200, bw=100, bh=48, rx=22;
  const bx=cx-bw/2, by=cy-bh/2;
  const lgx=bx+6, lgy=by+bh-18, lgw=26, lgh=32;
  const rgx=bx+bw-32, rgy=lgy, rgw=26, rgh=32;
  const lsX=bx+28, lsY=cy-4, rsX=bx+bw-32, rsY=cy+8, sr=9;
  const dpx=bx+22, dpy=cy+8, da=7, dt=7;
  const btx=bx+bw-24, bty=cy-6, btr=5;
  const sw = 2.5; // stroke width

  return `
  <!-- Outline controller -->
  <g opacity="0.85" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="${sw}">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}"/>
    <rect x="${lgx}" y="${lgy}" width="${lgw}" height="${lgh}" rx="13"/>
    <rect x="${rgx}" y="${rgy}" width="${rgw}" height="${rgh}" rx="13"/>
    <!-- Bumpers -->
    <rect x="${bx+10}" y="${by-8}" width="22" height="11" rx="5"/>
    <rect x="${bx+bw-32}" y="${by-8}" width="22" height="11" rx="5"/>
    <!-- Sticks -->
    <circle cx="${lsX}" cy="${lsY}" r="${sr}"/>
    <circle cx="${rsX}" cy="${rsY}" r="${sr}"/>
    <!-- D-pad -->
    <rect x="${dpx-dt/2}" y="${dpy-da-dt/2}" width="${dt}" height="${da*2+dt}" rx="2"/>
    <rect x="${dpx-da-dt/2}" y="${dpy-dt/2}" width="${da*2+dt}" height="${dt}" rx="2"/>
    <!-- Buttons -->
    <circle cx="${btx}"   cy="${bty-8}" r="${btr}"/>
    <circle cx="${btx+8}" cy="${bty}"   r="${btr}"/>
    <circle cx="${btx-8}" cy="${bty}"   r="${btr}"/>
    <circle cx="${btx}"   cy="${bty+8}" r="${btr}"/>
    <!-- Home -->
    <circle cx="${cx}" cy="${cy}" r="5"/>
  </g>
  <!-- Colored ABXY fills -->
  <circle cx="${btx}"   cy="${bty-8}" r="${btr-0.5}" fill="#a29bfe" opacity="0.7"/>
  <circle cx="${btx+8}" cy="${bty}"   r="${btr-0.5}" fill="#fd79a8" opacity="0.7"/>
  <circle cx="${btx-8}" cy="${bty}"   r="${btr-0.5}" fill="rgba(255,255,255,0.6)"/>
  <circle cx="${btx}"   cy="${bty+8}" r="${btr-0.5}" fill="#6c5ce7" opacity="0.7"/>`;
}

// ── Variant E: Cute/bubbly, thick, minimal ────────────────────────────────
function ctrlE() {
  // Thick, rounded, "cute" controller — wide grips, minimal details
  const cx=196, cy=198, bw=90, bh=44, rx=26;
  const bx=cx-bw/2, by=cy-bh/2;
  // Big rounded grips
  const lgx=bx+2, lgy=by+bh-14, lgw=28, lgh=36;
  const rgx=bx+bw-30, rgy=lgy, rgw=28, rgh=36;
  // Just d-pad + 4 buttons, large and clear
  const dpx=bx+20, dpy=cy, da=7, dt=8;
  const btx=bx+bw-20, bty=cy, btr=6;
  const sr=8;
  const lsX=bx+bw/2-14, lsY=cy+10, rsX=bx+bw/2+10, rsY=cy+10;

  return `
  <g filter="url(#ctrlglow)">
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#bubbgrad)"/>
    <rect x="${lgx}" y="${lgy}" width="${lgw}" height="${lgh}" rx="16" fill="url(#bubbgrad)"/>
    <rect x="${rgx}" y="${rgy}" width="${rgw}" height="${rgh}" rx="16" fill="url(#bubbgrad)"/>
  </g>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="url(#bubbgrad)"/>
  <!-- D-pad -->
  <rect x="${dpx-dt/2}" y="${dpy-da-dt/2}" width="${dt}" height="${da*2+dt}" rx="3" fill="rgba(255,255,255,0.88)"/>
  <rect x="${dpx-da-dt/2}" y="${dpy-dt/2}" width="${da*2+dt}" height="${dt}" rx="3" fill="rgba(255,255,255,0.88)"/>
  <!-- Large buttons -->
  <circle cx="${btx}"   cy="${bty-10}" r="${btr}" fill="#a29bfe"/>
  <circle cx="${btx+10}" cy="${bty}"   r="${btr}" fill="#fd79a8"/>
  <circle cx="${btx-10}" cy="${bty}"   r="${btr}" fill="rgba(255,255,255,0.9)"/>
  <circle cx="${btx}"   cy="${bty+10}" r="${btr}" fill="#6c5ce7"/>
  <!-- Small sticks hint -->
  <circle cx="${lsX}" cy="${lsY}" r="${sr}"   fill="rgba(0,0,0,0.25)"/>
  <circle cx="${rsX}" cy="${rsY}" r="${sr}"   fill="rgba(0,0,0,0.25)"/>
  <!-- Home -->
  <circle cx="${cx}" cy="${by+bh/2}" r="5" fill="rgba(255,255,255,0.4)"/>`;
}

function buildIcon(ctrlFn, extraDefs) {
  const s = baseShelf();
  return wrapSvg(extraDefs, `
  ${s.compTop}
  ${s.compBot}
  ${ctrlFn()}
  ${s.booksHtml}
  ${s.frame}
  ${s.sparks}`);
}

const variants = [
  {
    name: 'A-playstation',
    fn: ctrlA,
    defs: `<linearGradient id="psgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5a4fcf"/>
      <stop offset="100%" stop-color="#c9547a"/>
    </linearGradient>`,
  },
  {
    name: 'B-xbox',
    fn: ctrlB,
    defs: `<linearGradient id="xbgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d2580"/>
      <stop offset="100%" stop-color="#8b3f9a"/>
    </linearGradient>`,
  },
  {
    name: 'C-retro-snes',
    fn: ctrlC,
    defs: `<linearGradient id="snesgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c6fe0"/>
      <stop offset="100%" stop-color="#e06090"/>
    </linearGradient>`,
  },
  {
    name: 'D-outline',
    fn: ctrlD,
    defs: '',
  },
  {
    name: 'E-bubbly',
    fn: ctrlE,
    defs: `<linearGradient id="bubbgrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b7cf8"/>
      <stop offset="60%" stop-color="#d06090"/>
    </linearGradient>`,
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });

  for (const v of variants) {
    const svg = buildIcon(v.fn, v.defs);
    await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:512px;height:512px;overflow:hidden}</style></head><body>${svg}</body></html>`);
    await page.screenshot({ path: `icon-ctrl-${v.name}.png`, clip: { x:0, y:0, width:512, height:512 } });
    console.log(`✅ icon-ctrl-${v.name}.png`);
  }

  await browser.close();
})();

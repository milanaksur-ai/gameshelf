const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0a0618"/>
      <stop offset="45%"  stop-color="#1e1560"/>
      <stop offset="100%" stop-color="#6b1a3a"/>
    </linearGradient>
    <!-- Radial glow center-left (behind icon) -->
    <radialGradient id="glow1" cx="28%" cy="50%" r="40%">
      <stop offset="0%"   stop-color="#6c5ce7" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <!-- Radial glow right -->
    <radialGradient id="glow2" cx="85%" cy="60%" r="35%">
      <stop offset="0%"   stop-color="#fd79a8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <!-- Text gradient -->
    <linearGradient id="textgrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#a29bfe"/>
      <stop offset="100%" stop-color="#fd79a8"/>
    </linearGradient>
    <!-- Icon gradient -->
    <linearGradient id="iconbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"  stop-color="#6c5ce7"/>
      <stop offset="100%" stop-color="#fd79a8"/>
    </linearGradient>
    <!-- Shelf compartment -->
    <linearGradient id="comp" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#1a0f3e"/>
      <stop offset="100%" stop-color="#050410"/>
    </linearGradient>
    <!-- Drop shadow filter -->
    <filter id="iconshadow">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
    <filter id="glowpurple">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#6c5ce7" flood-opacity="0.7"/>
    </filter>
    <filter id="glowpink">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#fd79a8" flood-opacity="0.7"/>
    </filter>
    <filter id="textshadow">
      <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="rgba(108,92,231,0.4)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="500" fill="url(#bg)"/>
  <rect width="1024" height="500" fill="url(#glow1)"/>
  <rect width="1024" height="500" fill="url(#glow2)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="166" x2="1024" y2="166" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="333" x2="1024" y2="333" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="341" y1="0" x2="341" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="682" y1="0" x2="682" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

  <!-- ── Bookcase icon (left side) ───────────────────────────────── -->
  <!-- Icon container (rounded square) -->
  <g filter="url(#iconshadow)">
    <rect x="80" y="90" width="320" height="320" rx="52" fill="url(#iconbg)"/>
  </g>

  <!-- Icon inner frame (bookcase) -->
  <!-- Background compartments -->
  <rect x="96"  y="106" width="288" height="138" rx="0" fill="url(#comp)"/>
  <rect x="96"  y="262" width="288" height="132" rx="0" fill="url(#comp)"/>

  <!-- Top shelf books -->
  <g filter="url(#glowpurple)"><rect x="110" y="118" width="58" height="110" rx="7" fill="#6c5ce7"/></g>
  <rect x="118" y="128" width="42" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>
  <rect x="118" y="138" width="36" height="3" rx="2" fill="rgba(255,255,255,0.1)"/>

  <rect x="177" y="108" width="50" height="120" rx="7" fill="#a29bfe"/>
  <rect x="184" y="118" width="36" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>

  <rect x="236" y="122" width="54" height="106" rx="7" fill="#ffffff"/>
  <rect x="243" y="132" width="40" height="5" rx="2" fill="rgba(200,200,255,0.3)"/>

  <g filter="url(#glowpink)"><rect x="299" y="112" width="50" height="116" rx="7" fill="#fd79a8"/></g>
  <rect x="306" y="122" width="36" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>

  <!-- Bottom shelf books -->
  <rect x="110" y="272" width="54" height="106" rx="7" fill="#ffffff"/>
  <rect x="117" y="282" width="40" height="5" rx="2" fill="rgba(200,200,255,0.3)"/>

  <g filter="url(#glowpink)"><rect x="173" y="288" width="46" height="90" rx="7" fill="#fd79a8"/></g>
  <rect x="180" y="298" width="32" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>

  <rect x="228" y="276" width="52" height="102" rx="7" fill="#a29bfe"/>
  <rect x="235" y="286" width="38" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>

  <g filter="url(#glowpurple)"><rect x="289" y="282" width="50" height="96" rx="7" fill="#6c5ce7"/></g>
  <rect x="296" y="292" width="36" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>

  <!-- White frame (on top of books) -->
  <rect x="80"  y="90"  width="20" height="320" rx="0" fill="white"/>
  <rect x="380" y="90"  width="20" height="320" rx="0" fill="white"/>
  <rect x="80"  y="90"  width="320" height="18" rx="0" fill="white"/>
  <rect x="80"  y="244" width="320" height="18" rx="0" fill="white"/>
  <rect x="80"  y="392" width="320" height="18" rx="0" fill="white"/>
  <!-- Round the outer corners -->
  <rect x="80"  y="90"  width="320" height="320" rx="52" fill="none" stroke="white" stroke-width="0"/>

  <!-- Sparkle dots -->
  <circle cx="430" cy="108" r="7"  fill="rgba(255,255,255,0.4)"/>
  <circle cx="452" cy="136" r="4"  fill="rgba(255,255,255,0.25)"/>
  <circle cx="58"  cy="120" r="5"  fill="rgba(255,255,255,0.3)"/>
  <circle cx="38"  cy="148" r="3"  fill="rgba(255,255,255,0.18)"/>

  <!-- ── Text (right side) ───────────────────────────────────────── -->
  <!-- App name -->
  <text x="490" y="230"
    font-family="'Segoe UI', 'Arial Black', sans-serif"
    font-size="88" font-weight="900" letter-spacing="-2"
    fill="url(#textgrad)" filter="url(#textshadow)">GameShelf</text>

  <!-- Tagline -->
  <text x="492" y="284"
    font-family="'Segoe UI', Arial, sans-serif"
    font-size="26" font-weight="400" letter-spacing="0.5"
    fill="rgba(200,190,255,0.75)">Ta bibliothèque de jeux vidéo</text>

  <!-- Feature pills -->
  <!-- Pill 1 -->
  <rect x="492" y="316" width="158" height="38" rx="19" fill="rgba(108,92,231,0.2)" stroke="rgba(108,92,231,0.5)" stroke-width="1"/>
  <text x="571" y="340" font-family="'Segoe UI',Arial,sans-serif" font-size="15" font-weight="600" fill="#a29bfe" text-anchor="middle">📚 Bibliothèque</text>

  <!-- Pill 2 -->
  <rect x="662" y="316" width="132" height="38" rx="19" fill="rgba(253,121,168,0.15)" stroke="rgba(253,121,168,0.4)" stroke-width="1"/>
  <text x="728" y="340" font-family="'Segoe UI',Arial,sans-serif" font-size="15" font-weight="600" fill="#fd79a8" text-anchor="middle">⭐ Notes</text>

  <!-- Pill 3 -->
  <rect x="492" y="368" width="120" height="38" rx="19" fill="rgba(162,155,254,0.15)" stroke="rgba(162,155,254,0.4)" stroke-width="1"/>
  <text x="552" y="392" font-family="'Segoe UI',Arial,sans-serif" font-size="15" font-weight="600" fill="#a29bfe" text-anchor="middle">👥 Amis</text>

  <!-- Pill 4 -->
  <rect x="624" y="368" width="172" height="38" rx="19" fill="rgba(108,92,231,0.15)" stroke="rgba(108,92,231,0.4)" stroke-width="1"/>
  <text x="710" y="392" font-family="'Segoe UI',Arial,sans-serif" font-size="15" font-weight="600" fill="#a29bfe" text-anchor="middle">🏆 Tier Lists</text>

  <!-- Decorative circles (background) -->
  <circle cx="900" cy="80"  r="120" fill="rgba(108,92,231,0.06)" stroke="rgba(108,92,231,0.1)" stroke-width="1"/>
  <circle cx="950" cy="440" r="80"  fill="rgba(253,121,168,0.06)" stroke="rgba(253,121,168,0.08)" stroke-width="1"/>
</svg>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{width:1024px;height:500px;overflow:hidden}</style></head><body>${svg}</body></html>`);
  await page.screenshot({ path: 'feature-graphic.png', clip: { x:0, y:0, width:1024, height:500 } });
  await browser.close();
  console.log('Done → feature-graphic.png');
})();

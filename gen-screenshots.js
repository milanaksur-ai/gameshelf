const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = 1080, H = 1920;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Space+Grotesk:wght@700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;overflow:hidden;background:#080810;color:#fff;font-family:'DM Sans',sans-serif}
  :root{--a:#6c5ce7;--a2:#fd79a8;--s1:#080810;--s2:#11111e;--s3:#1a1a2e;--border2:rgba(255,255,255,0.09);--text:#f0f0ff;--muted2:rgba(255,255,255,0.45);--amber:#f0b429}
`;

const TOPBAR = (title='GameShelf') => `
  <div style="padding:60px 40px 24px;display:flex;align-items:center;gap:16px;background:var(--s1);border-bottom:0.5px solid var(--border2)">
    <div style="width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--a),var(--a2));display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">🎮</div>
    <div style="font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:800;background:linear-gradient(135deg,#a29bfe,#fd79a8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${title}</div>
  </div>`;

const NAVBAR = (active=0) => {
  const items = [
    {icon:'🏠',label:'Accueil'},
    {icon:'🎮',label:'Biblio'},
    {icon:'👥',label:'Social'},
    {icon:'👤',label:'Profil'},
  ];
  return `<div style="position:absolute;bottom:0;left:0;right:0;background:var(--s2);border-top:0.5px solid var(--border2);display:flex;padding:16px 0 32px">
    ${items.map((it,i)=>`
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;opacity:${i===active?1:0.45}">
      <div style="font-size:28px">${it.icon}</div>
      <div style="font-size:18px;font-weight:${i===active?700:500};color:${i===active?'var(--a)':'var(--muted2)'}">${it.label}</div>
    </div>`).join('')}
  </div>`;
};

const GAME_CARD = (title, cover, score, status, genre) => `
  <div style="background:var(--s2);border:0.5px solid var(--border2);border-radius:20px;overflow:hidden">
    <div style="height:220px;background:linear-gradient(135deg,#1a1040,#2d1b5e);display:flex;align-items:center;justify-content:center;font-size:64px">${cover}</div>
    <div style="padding:20px">
      <div style="font-weight:700;font-size:26px;margin-bottom:8px">${title}</div>
      <div style="font-size:20px;color:var(--muted2);margin-bottom:14px">${genre}</div>
      <div style="display:flex;gap:12px;align-items:center">
        <span style="background:rgba(240,180,41,0.15);color:var(--amber);padding:6px 16px;border-radius:20px;font-weight:700;font-size:20px">★ ${score}</span>
        <span style="background:rgba(108,92,231,0.15);color:var(--a);padding:6px 16px;border-radius:20px;font-size:20px">${status}</span>
      </div>
    </div>
  </div>`;

// ── SCREEN 1: LIBRARY ──────────────────────────────────────────────────────
const screen1 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>
${TOPBAR()}
<div style="padding:32px 40px 16px;display:flex;align-items:center;justify-content:space-between">
  <div style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:800">Ma bibliothèque</div>
  <div style="font-size:22px;color:var(--muted2)">24 jeux</div>
</div>
<div style="padding:0 40px 20px;display:flex;gap:12px;overflow-x:hidden">
  ${['Tous','En cours','Terminés','Backlog'].map((l,i)=>`<div style="padding:10px 26px;border-radius:24px;font-size:20px;font-weight:600;white-space:nowrap;background:${i===0?'var(--a)':'var(--s2)'};border:0.5px solid ${i===0?'transparent':'var(--border2)'};color:${i===0?'#fff':'var(--muted2)'}">${l}</div>`).join('')}
</div>
<div style="padding:0 40px;display:grid;grid-template-columns:1fr 1fr;gap:20px;overflow:hidden">
  ${[
    {e:'⚔️',t:'Elden Ring',g:'RPG · 2022',s:'9.5',st:'Terminé'},
    {e:'🌌',t:'Hades II',g:'Roguelike · 2024',s:'9.0',st:'En cours'},
    {e:'🏴‍☠️',t:'Sea of Stars',g:'RPG · 2023',s:'8.5',st:'Terminé'},
    {e:'🎯',t:'Balatro',g:'Roguelike · 2024',s:'9.2',st:'Obsédé'},
    {e:'🌿',t:'Stardew Valley',g:'Simulation · 2016',s:'8.8',st:'En pause'},
    {e:'🔫',t:'Celeste',g:'Platformer · 2018',s:'9.1',st:'100%'},
  ].map(g=>`
  <div style="background:var(--s2);border:0.5px solid var(--border2);border-radius:20px;overflow:hidden">
    <div style="height:180px;background:linear-gradient(135deg,#1a1040,#2d1b5e);display:flex;align-items:center;justify-content:center;font-size:60px">${g.e}</div>
    <div style="padding:16px">
      <div style="font-weight:700;font-size:22px;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g.t}</div>
      <div style="font-size:17px;color:var(--muted2);margin-bottom:12px">${g.g}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span style="background:rgba(240,180,41,0.15);color:var(--amber);padding:4px 12px;border-radius:12px;font-weight:700;font-size:18px">★${g.s}</span>
        <span style="background:rgba(108,92,231,0.12);color:#a29bfe;padding:4px 12px;border-radius:12px;font-size:17px">${g.st}</span>
      </div>
    </div>
  </div>`).join('')}
</div>
${NAVBAR(1)}
</body></html>`;

// ── SCREEN 2: GAME DETAIL ──────────────────────────────────────────────────
const screen2 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>
<div style="height:480px;background:linear-gradient(135deg,#1a0a3e 0%,#3b1e6e 60%,#5c1060 100%);display:flex;align-items:center;justify-content:center;font-size:160px;position:relative">
  ⚔️
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,#080810 100%)"></div>
  <div style="position:absolute;top:60px;left:40px;right:40px;display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:36px;background:rgba(0,0,0,0.4);padding:12px;border-radius:16px">←</div>
    <div style="font-size:36px;background:rgba(0,0,0,0.4);padding:12px;border-radius:16px">🔗</div>
  </div>
</div>
<div style="padding:0 40px;margin-top:-40px;position:relative">
  <div style="font-family:'Space Grotesk',sans-serif;font-size:52px;font-weight:800;line-height:1.1;margin-bottom:8px">Elden Ring</div>
  <div style="font-size:24px;color:var(--muted2);margin-bottom:32px">RPG · Action · 2022</div>
  <div style="display:flex;gap:16px;margin-bottom:32px">
    <div style="flex:1;background:rgba(240,180,41,0.08);border:0.5px solid rgba(240,180,41,0.3);border-radius:20px;padding:24px;text-align:center">
      <div style="font-family:'Space Grotesk',sans-serif;font-size:56px;font-weight:900;color:var(--amber);line-height:1">9.5</div>
      <div style="font-size:18px;color:rgba(240,180,41,0.6);font-weight:700;margin-top:6px">MA NOTE</div>
    </div>
    <div style="flex:1;background:rgba(108,92,231,0.08);border:0.5px solid rgba(108,92,231,0.3);border-radius:20px;padding:24px;text-align:center">
      <div style="font-size:40px;margin-bottom:6px">✅</div>
      <div style="font-size:22px;font-weight:700">Terminé</div>
    </div>
    <div style="flex:1;background:rgba(255,255,255,0.04);border:0.5px solid var(--border2);border-radius:20px;padding:24px;text-align:center">
      <div style="font-size:40px;margin-bottom:6px">🔥</div>
      <div style="font-size:22px;font-weight:700">Maîtrisé</div>
    </div>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:28px">
    ${['💎 Chef-d\'œuvre','🌑 Atmosphère unique','🏔️ Ambitieux','❤️ Prend aux tripes'].map(v=>`<span style="padding:10px 22px;border-radius:24px;background:rgba(108,92,231,0.12);color:#a29bfe;border:0.5px solid rgba(108,92,231,0.3);font-size:20px">${v}</span>`).join('')}
  </div>
  <div style="background:rgba(108,92,231,0.07);border-left:4px solid rgba(108,92,231,0.5);border-radius:0 16px 16px 0;padding:20px 24px;font-size:22px;color:rgba(255,255,255,0.8);line-height:1.6;font-style:italic">
    "Un chef-d'œuvre absolu. Fromsoft a repoussé toutes les limites. Incontournable."
  </div>
</div>
${NAVBAR(1)}
</body></html>`;

// ── SCREEN 3: SOCIAL / FRIENDS ─────────────────────────────────────────────
const screen3 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>
${TOPBAR('Social')}
<div style="padding:32px 40px 0">
  <div style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:800;margin-bottom:24px">Activité récente</div>
  ${[
    {av:'🦊',nm:'Alex',txt:'a noté Hades II',sub:'9/10 · Banger 🔥',t:'2h'},
    {av:'🐺',nm:'Sarah',txt:'a terminé Celeste',sub:'100% · Chef-d\'œuvre 💎',t:'5h'},
    {av:'🐉',nm:'Tom',txt:'a ajouté Balatro',sub:'Backlog · 0h',t:'hier'},
    {av:'🦋',nm:'Léa',txt:'a noté Sea of Stars',sub:'8.5/10 · Scénario fort 📖',t:'hier'},
  ].map(f=>`
  <div style="display:flex;gap:20px;align-items:flex-start;padding:24px 0;border-bottom:0.5px solid var(--border2)">
    <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--a2));display:flex;align-items:center;justify-content:center;font-size:34px;flex-shrink:0">${f.av}</div>
    <div style="flex:1">
      <div style="font-size:22px;margin-bottom:4px"><strong>${f.nm}</strong> <span style="color:var(--muted2)">${f.txt}</span></div>
      <div style="background:var(--s2);border:0.5px solid var(--border2);border-radius:14px;padding:12px 16px;display:inline-block;font-size:20px;color:#a29bfe;margin-top:8px">${f.sub}</div>
    </div>
    <div style="font-size:18px;color:var(--muted2);flex-shrink:0">${f.t}</div>
  </div>`).join('')}
  <div style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;margin-top:32px;margin-bottom:20px">Mes amis (4)</div>
  <div style="display:flex;gap:28px">
    ${[{av:'🦊',nm:'Alex'},{av:'🐺',nm:'Sarah'},{av:'🐉',nm:'Tom'},{av:'🦋',nm:'Léa'}].map(f=>`
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
      <div style="width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--a2));display:flex;align-items:center;justify-content:center;font-size:40px">${f.av}</div>
      <div style="font-size:18px;color:var(--muted2)">${f.nm}</div>
    </div>`).join('')}
  </div>
</div>
${NAVBAR(2)}
</body></html>`;

// ── SCREEN 4: PROFILE ──────────────────────────────────────────────────────
const screen4 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>
<div style="background:linear-gradient(180deg,#1a0a3e 0%,#080810 100%);padding:80px 40px 40px;text-align:center">
  <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--a2));display:flex;align-items:center;justify-content:center;font-size:58px;margin:0 auto 20px;box-shadow:0 8px 32px rgba(108,92,231,0.4)">🎮</div>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:40px;font-weight:800;margin-bottom:6px">Milan</div>
  <div style="font-size:24px;color:var(--muted2)">@milan · 4 amis</div>
</div>
<div style="padding:32px 40px">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px">
    ${[{n:'24',l:'Jeux'},{n:'18',l:'Terminés'},{n:'8.4',l:'Note moy.'}].map(s=>`
    <div style="background:var(--s2);border:0.5px solid var(--border2);border-radius:20px;padding:24px;text-align:center">
      <div style="font-family:'Space Grotesk',sans-serif;font-size:44px;font-weight:800;background:linear-gradient(135deg,#a29bfe,#fd79a8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${s.n}</div>
      <div style="font-size:18px;color:var(--muted2);margin-top:4px">${s.l}</div>
    </div>`).join('')}
  </div>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;margin-bottom:20px">Avis récents</div>
  ${[
    {e:'⚔️',t:'Elden Ring',s:'9.5',v:'💎 Chef-d\'œuvre'},
    {e:'🎯',t:'Balatro',s:'9.2',v:'🔥 Banger'},
    {e:'🌌',t:'Hades II',s:'9.0',v:'🔁 Addictif'},
  ].map(g=>`
  <div style="display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:0.5px solid var(--border2)">
    <div style="width:70px;height:70px;background:linear-gradient(135deg,#1a1040,#2d1b5e);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:34px;flex-shrink:0">${g.e}</div>
    <div style="flex:1">
      <div style="font-size:24px;font-weight:700;margin-bottom:6px">${g.t}</div>
      <div style="font-size:20px;color:#a29bfe">${g.v}</div>
    </div>
    <div style="font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:800;color:var(--amber)">★${g.s}</div>
  </div>`).join('')}
</div>
${NAVBAR(3)}
</body></html>`;

// ── SCREEN 5: TIER LIST ────────────────────────────────────────────────────
const screen5 = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>
${TOPBAR('Tier List')}
<div style="padding:32px 40px 16px;display:flex;justify-content:space-between;align-items:center">
  <div style="font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:800">Mes jeux 2024</div>
  <div style="background:var(--a);padding:10px 24px;border-radius:14px;font-size:20px;font-weight:700">Partager</div>
</div>
${[
  {tier:'S',bg:'#b71c1c',txt:'#ff5252',games:['⚔️','🎯','🌌']},
  {tier:'A',bg:'#e65100',txt:'#ff9800',games:['🏴‍☠️','🔫','🌿']},
  {tier:'B',bg:'#f57f17',txt:'#ffca28',games:['🎮','🧩']},
  {tier:'C',bg:'#1b5e20',txt:'#69f0ae',games:['🎲']},
].map(r=>`
<div style="display:flex;align-items:stretch;border-top:0.5px solid rgba(255,255,255,0.06);min-height:140px">
  <div style="width:80px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:${r.bg}22;border-right:3px solid ${r.bg}">
    <span style="font-family:'Space Grotesk',sans-serif;font-size:44px;font-weight:900;color:${r.txt}">${r.tier}</span>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;padding:16px 24px;align-content:flex-start">
    ${r.games.map(g=>`
    <div style="width:100px;height:108px;background:linear-gradient(135deg,#1a1040,#2d1b5e);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:50px">${g}</div>`).join('')}
  </div>
</div>`).join('')}
${NAVBAR(0)}
</body></html>`;

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const screens = [
    { name:'01-bibliotheque', html:screen1 },
    { name:'02-fiche-jeu',    html:screen2 },
    { name:'03-social',       html:screen3 },
    { name:'04-profil',       html:screen4 },
    { name:'05-tierlist',     html:screen5 },
  ];
  for (const s of screens) {
    await page.setViewportSize({ width:W, height:H });
    await page.setContent(s.html);
    await page.waitForTimeout(300);
    await page.screenshot({ path:`/home/user/gameshelf/screenshot-${s.name}.png`, clip:{x:0,y:0,width:W,height:H} });
    console.log(`✅ screenshot-${s.name}.png`);
  }
  await browser.close();
}
generate().catch(console.error);

// ─────────────────────────────────────────────────────────────────────────────
// DEV LOG CONFIG
// Set show: true to display the popup once per version per session.
// ─────────────────────────────────────────────────────────────────────────────
const DEV_LOG = {
  show: true,
  version: "v1.2",
  text: `v1.2 — Polish & Debug Update\n\nFull code cleanup and balance pass:\n\n• Removed Click Frenzy system entirely\n• Click power still scales with your buildings — more automation = harder hits\n• Grind tuned: early game requires clicking, mid/late game rewards both paths\n• All systems (save, load, prestige, achievements, buildings, upgrades) fully verified\n\nHappy baking! 🍪`
};

// ─── SAVE KEY ────────────────────────────────────────────────────────────────
const SAVE_KEY = "cc_v11";

// ─── FORMAT ──────────────────────────────────────────────────────────────────
function fmt(n) {
  if (!isFinite(n) || n < 0) n = 0;
  if (n >= 1e18) return (n / 1e18).toFixed(2) + "Qi";
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "Qa";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + "B";
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + "M";
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + "K";
  return Math.floor(n).toLocaleString();
}

// ─── BUILDINGS ───────────────────────────────────────────────────────────────
// baseCost  : cookie cost for the very first purchase
// cps       : cookies per second each owned copy produces
// cpcMult   : each owned copy adds (cps * cpcMult) to your click power
//             — so building up automation also makes clicking stronger
// Cost scales +15% per owned (standard idle-game formula)
const BUILDINGS = [
  { key:"cursor",      icon:"👆", name:"Cursor",        baseCost:15,             cps:0.3,     cpcMult:0.05, desc:"Auto-clicks the cookie for you."          },
  { key:"grandma",     icon:"👵", name:"Grandma",        baseCost:100,            cps:1.5,     cpcMult:0.05, desc:"A gentle grandma baking cookies."         },
  { key:"farm",        icon:"🌾", name:"Cookie Farm",    baseCost:1100,           cps:8,       cpcMult:0.04, desc:"Grows cookie plants from magic seeds."    },
  { key:"mine",        icon:"⛏️", name:"Mine",           baseCost:12000,          cps:25,      cpcMult:0.04, desc:"Mines raw chocolate chips underground."   },
  { key:"factory",     icon:"🏭", name:"Factory",        baseCost:130000,         cps:100,     cpcMult:0.03, desc:"Mass-produces cookies around the clock."  },
  { key:"bank",        icon:"🏦", name:"Cookie Bank",    baseCost:1400000,        cps:400,     cpcMult:0.03, desc:"Invests cookies to yield passive returns." },
  { key:"temple",      icon:"🔮", name:"Temple",         baseCost:20000000,       cps:1500,    cpcMult:0.02, desc:"Prays to the cookie gods for daily gifts." },
  { key:"wizard",      icon:"🧙", name:"Wizard Tower",   baseCost:330000000,      cps:5000,    cpcMult:0.02, desc:"Conjures cookies from thin air."          },
  { key:"shipment",    icon:"🚀", name:"Shipment",       baseCost:5100000000,     cps:18000,   cpcMult:0.02, desc:"Imports cookies from the Cookie Planet."  },
  { key:"alchemy",     icon:"⚗️", name:"Alchemy Lab",    baseCost:75000000000,    cps:55000,   cpcMult:0.01, desc:"Transmutes gold into delicious cookies."  },
  { key:"portal",      icon:"🌀", name:"Portal",         baseCost:1000000000000,  cps:180000,  cpcMult:0.01, desc:"Opens rifts to cookie-rich dimensions."   },
  { key:"timemachine", icon:"⏱",  name:"Time Machine",   baseCost:14000000000000, cps:550000,  cpcMult:0.01, desc:"Brings cookies from the future."          },
  { key:"prism",       icon:"🌈", name:"Prism",          baseCost:2.1e14,         cps:1800000, cpcMult:0.01, desc:"Converts pure light into cookies."        },
  { key:"chancemaker", icon:"🍀", name:"Chancemaker",    baseCost:3.3e15,         cps:6000000, cpcMult:0.01, desc:"Harnesses luck to generate cookies."      },
];

// ─── UPGRADES ────────────────────────────────────────────────────────────────
// Repeatable — buy as many levels as you want.
// bonus    : flat cookies added per click, per level owned
// cpsBonus : fraction of current CPS added to CPC, per level owned
//            (ties click power to how many buildings you have)
// baseCost : cost of level 1; scales by costMult each level
const UPGRADES = [
  { id:1, icon:"⚡", name:"Nimble Fingers", bonus:5,     cpsBonus:0.005, baseCost:50,       costMult:2.0 },
  { id:2, icon:"🔥", name:"Hot Oven",       bonus:30,    cpsBonus:0.01,  baseCost:500,      costMult:2.2 },
  { id:3, icon:"✨", name:"Magic Dough",    bonus:150,   cpsBonus:0.02,  baseCost:5000,     costMult:2.5 },
  { id:4, icon:"🤖", name:"Robot Baker",    bonus:800,   cpsBonus:0.03,  baseCost:50000,    costMult:2.8 },
  { id:5, icon:"🌟", name:"Cookie God",     bonus:5000,  cpsBonus:0.05,  baseCost:600000,   costMult:3.0 },
  { id:6, icon:"🪄", name:"Reality Bender", bonus:35000, cpsBonus:0.08,  baseCost:10000000, costMult:3.5 },
];

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
const ACH = [
  // Lifetime cookies baked
  { id:"b100",   icon:"🍪", name:"First Batch",      cond: s => s.life >= 100        },
  { id:"b1k",    icon:"🍪", name:"Cookie Amateur",   cond: s => s.life >= 1e3        },
  { id:"b10k",   icon:"🍪", name:"Cookie Baker",     cond: s => s.life >= 1e4        },
  { id:"b100k",  icon:"🍪", name:"Cookie Chef",      cond: s => s.life >= 1e5        },
  { id:"b1m",    icon:"🍪", name:"Cookie Master",    cond: s => s.life >= 1e6        },
  { id:"b1b",    icon:"🍪", name:"Cookie Legend",    cond: s => s.life >= 1e9        },
  { id:"b1t",    icon:"🍪", name:"Cookie Deity",     cond: s => s.life >= 1e12       },
  // Total buildings owned
  { id:"bld1",   icon:"🏗️", name:"First Building",   cond: s => totalBld(s) >= 1    },
  { id:"bld10",  icon:"🏗️", name:"Workforce",        cond: s => totalBld(s) >= 10   },
  { id:"bld50",  icon:"🏗️", name:"Empire",           cond: s => totalBld(s) >= 50   },
  { id:"bld100", icon:"🏗️", name:"Megacorp",         cond: s => totalBld(s) >= 100  },
  { id:"bld200", icon:"🏗️", name:"Industrial God",   cond: s => totalBld(s) >= 200  },
  // Own at least one of every building
  { id:"allbld", icon:"🌐", name:"Diversified",      cond: s => BUILDINGS.every(b => (s.bld[b.key] || 0) >= 1) },
  // CPS milestones
  { id:"cps10",  icon:"⏱",  name:"Passive Income",   cond: s => calcCPS(s) >= 10    },
  { id:"cps100", icon:"⏱",  name:"Cookie Factory",   cond: s => calcCPS(s) >= 100   },
  { id:"cps1k",  icon:"⏱",  name:"Industrial Baker", cond: s => calcCPS(s) >= 1000  },
  { id:"cps10k", icon:"⏱",  name:"Cookie Titan",     cond: s => calcCPS(s) >= 10000 },
  { id:"cps100k",icon:"⏱",  name:"Cosmic Baker",     cond: s => calcCPS(s) >= 100000},
  // Upgrades purchased
  { id:"upg1",   icon:"⚡", name:"Upgraded!",        cond: s => s.upgrades.some(v => v > 0)  },
  { id:"upg6",   icon:"⚡", name:"Min-Maxer",        cond: s => s.upgrades.every(v => v > 0) },
  // Prestige
  { id:"pres1",  icon:"✨", name:"Born Again",        cond: s => s.prestige >= 1     },
  { id:"pres5",  icon:"✨", name:"Veteran Baker",     cond: s => s.prestige >= 5     },
  // Click power
  { id:"cpc1k",  icon:"👆", name:"Power Click",      cond: () => calcCPC() >= 1000  },
  { id:"cpc1m",  icon:"👆", name:"Mega Click",       cond: () => calcCPC() >= 1e6   },
  // Total manual clicks
  { id:"clk100", icon:"👆", name:"Dedicated",        cond: s => s.totalClicks >= 100   },
  { id:"clk1k",  icon:"👆", name:"Clicker",          cond: s => s.totalClicks >= 1000  },
  { id:"clk10k", icon:"👆", name:"Click Addict",     cond: s => s.totalClicks >= 10000 },
];

// ─── PATCH NOTES ─────────────────────────────────────────────────────────────
const PATCH_NOTES = [
  {
    version: "v1.2",
    date: "Debug & Polish",
    text: "Full code cleanup. Removed Click Frenzy. Verified all systems: save/load, prestige, achievements, buildings, upgrades. Balance tuned for a grindy feel where both clicking and AFK are rewarding."
  },
  {
    version: "v1.1",
    date: "Balance Update",
    text: "Clicking and AFK now both viable. Buildings boost click power. Early game rebalanced to be faster."
  },
  {
    version: "v1.0",
    date: "Launch",
    text: "Initial release! 14 buildings, 6 click upgrades, 24 achievements, and prestige system."
  }
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let S = {
  score:       0,
  life:        0,
  upgrades:    new Array(UPGRADES.length).fill(0), // level per upgrade slot
  bld:         {},
  ach:         {},
  prestige:    0,
  pmult:       1,
  totalClicks: 0,
};

BUILDINGS.forEach(b => { S.bld[b.key] = 0; });

let buyQty = 1;

// ─── CORE CALCULATIONS ───────────────────────────────────────────────────────

function totalBld(s) {
  return BUILDINGS.reduce((t, b) => t + (s.bld[b.key] || 0), 0);
}

// Cookies per second from all buildings × prestige multiplier
function calcCPS(s) {
  const raw = BUILDINGS.reduce((t, b) => t + (s.bld[b.key] || 0) * b.cps, 0);
  return raw * s.pmult;
}

// Cookies per click:
//   base 1
//   + flat bonuses from upgrade levels
//   + CPS-scaled bonus from upgrade levels  (more buildings → harder clicks)
//   + inherent click boost from owned buildings
//   all × prestige multiplier
function calcCPC() {
  const cps = calcCPS(S);

  let flatBonus = 0;
  UPGRADES.forEach((u, i) => { flatBonus += (S.upgrades[i] || 0) * u.bonus; });

  let cpsScale = 0;
  UPGRADES.forEach((u, i) => { cpsScale += (S.upgrades[i] || 0) * u.cpsBonus; });

  let bldBoost = 0;
  BUILDINGS.forEach(b => { bldBoost += (S.bld[b.key] || 0) * b.cps * b.cpcMult; });

  return (1 + flatBonus + (cps * cpsScale) + bldBoost) * S.pmult;
}

// Cost of the next level for upgrade at index i
function getUpgCost(i) {
  const u   = UPGRADES[i];
  const lvl = S.upgrades[i] || 0;
  return Math.floor(u.baseCost * Math.pow(u.costMult, lvl));
}

// Cost of the Nth additional purchase of a building (0 = next one)
function getBldCostN(key, n) {
  const b     = BUILDINGS.find(x => x.key === key);
  const owned = S.bld[key] || 0;
  return Math.floor(b.baseCost * Math.pow(1.15, owned + n));
}

// Total cost of buying `qty` of a building right now
function getBldCostBulk(key, qty) {
  let total = 0;
  for (let i = 0; i < qty; i++) total += getBldCostN(key, i);
  return total;
}

// How many of a building can be bought with current score
function maxAffordable(key) {
  let count = 0, total = 0;
  while (true) {
    const next = getBldCostN(key, count);
    if (total + next > S.score) break;
    total += next;
    count++;
    if (count > 1000) break; // safety cap
  }
  return count;
}

// ─── BUY QUANTITY TOGGLE ─────────────────────────────────────────────────────
function setBuyQty(qty, btn) {
  buyQty = qty;
  document.querySelectorAll(".qty-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  updateDisplay();
}

// ─── BUILDING PURCHASE ───────────────────────────────────────────────────────
function buyBld(key) {
  if (buyQty === "max") {
    let bought = true;
    while (bought) {
      bought = false;
      const cost = getBldCostN(key, 0);
      if (S.score >= cost) {
        S.score -= cost;
        S.bld[key] = (S.bld[key] || 0) + 1;
        bought = true;
      }
    }
  } else {
    const qty  = parseInt(buyQty);
    const cost = getBldCostBulk(key, qty);
    if (S.score < cost) return;
    S.score -= cost;
    S.bld[key] = (S.bld[key] || 0) + qty;
  }
  save();
  updateDisplay();
}

// ─── UPGRADE PURCHASE ────────────────────────────────────────────────────────
function addUpgrade(idx) {
  const i    = idx - 1;
  const cost = getUpgCost(i);
  if (S.score < cost) return;
  S.score -= cost;
  S.upgrades[i] = (S.upgrades[i] || 0) + 1;
  save();
  updateDisplay();
}

// ─── CLICK HANDLER ───────────────────────────────────────────────────────────
function handleClick(e) {
  const n = calcCPC();
  S.score += n;
  S.life  += n;
  S.totalClicks = (S.totalClicks || 0) + 1;
  if (e) spawnFloat(e, n);
  updateDisplay();
}

function spawnFloat(e, n) {
  const el = document.createElement("div");
  el.className   = "float-txt";
  el.textContent = "+" + fmt(n);
  el.style.left  = (e.clientX - 20 + (Math.random() * 30 - 15)) + "px";
  el.style.top   = (e.clientY - 12) + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

// ─── PRESTIGE ────────────────────────────────────────────────────────────────
function doPrestige() {
  if (S.life < 1e9) return;
  if (!confirm("Prestige? This resets your cookies and buildings in exchange for a permanent multiplier bonus!")) return;
  S.prestige++;
  S.pmult    = Math.pow(1.05, S.prestige);
  S.score    = 0;
  S.life     = 0;
  S.upgrades = new Array(UPGRADES.length).fill(0);
  BUILDINGS.forEach(b => { S.bld[b.key] = 0; });
  save();
  updateDisplay();
}

// ─── TABS ────────────────────────────────────────────────────────────────────
function showTab(name, el) {
  document.querySelectorAll(".pane").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t  => t.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  el.classList.add("active");
}

// ─── PASSIVE TICK (10× per second) ───────────────────────────────────────────
setInterval(() => {
  const gained = calcCPS(S) / 10;
  if (gained > 0) {
    S.score += gained;
    S.life  += gained;
  }
  updateDisplay();
}, 100);

// Achievement check + autosave every 2 seconds
setInterval(() => { checkAch(); save(); }, 2000);

// ─── DISPLAY ─────────────────────────────────────────────────────────────────
function updateDisplay() {
  const cps = calcCPS(S);
  const cpc = calcCPC();

  document.getElementById("score").textContent         = fmt(S.score);
  document.getElementById("cpc").textContent           = fmt(cpc);
  document.getElementById("cps").textContent           = fmt(cps);
  document.getElementById("stat-lifetime").textContent = fmt(S.life);
  document.getElementById("stat-buildings").textContent= totalBld(S);
  document.getElementById("stat-prestige").textContent = S.prestige;

  // Prestige zone — show when player has enough lifetime cookies
  const pz = document.getElementById("prestige-zone");
  if (S.life >= 1e9) {
    pz.classList.remove("hidden");
    document.getElementById("prestige-mult-display").textContent =
      (S.pmult * 1.05).toFixed(3) + "×";
  } else {
    pz.classList.add("hidden");
  }

  // Active prestige label
  const ap = document.getElementById("active-pres");
  if (S.prestige > 0) {
    ap.classList.remove("hidden");
    ap.textContent = `✨ Prestige ${S.prestige} — ${S.pmult.toFixed(3)}× global bonus`;
  } else {
    ap.classList.add("hidden");
  }

  // Upgrade cards
  UPGRADES.forEach((u, i) => {
    const card = document.getElementById("upg-" + u.id);
    if (!card) return;
    const lvl        = S.upgrades[i] || 0;
    const cost       = getUpgCost(i);
    const canAfford  = S.score >= cost;
    const cpsContrib = cps * u.cpsBonus;
    card.className = "upg-card" + (!canAfford ? " cant-afford" : "");
    card.querySelector(".upg-meta").textContent =
      `+${fmt(u.bonus)} flat, +${fmt(cpsContrib)} from CPS · Lv ${lvl}`;
    card.querySelector(".upg-cost").textContent = "🍪 " + fmt(cost);
  });

  // Building cards
  BUILDINGS.forEach(b => {
    const card   = document.getElementById("bld-" + b.key);
    const costEl = document.getElementById("bld-cost-" + b.key);
    const qcEl   = document.getElementById("bld-qcost-" + b.key);
    const ownEl  = document.getElementById("bld-owned-" + b.key);
    if (!card) return;

    const single = getBldCostN(b.key, 0);

    if (buyQty === "max") {
      const n        = maxAffordable(b.key);
      const canAfford = n > 0;
      card.className = "bld-card" + (!canAfford ? " cant-afford" : "");
      if (costEl) costEl.textContent = "🍪 " + fmt(single);
      if (qcEl) {
        qcEl.textContent = canAfford
          ? `Buy ${n} for 🍪 ${fmt(getBldCostBulk(b.key, n))}`
          : "";
      }
    } else {
      const qty       = parseInt(buyQty);
      const bulk      = getBldCostBulk(b.key, qty);
      const canAfford = S.score >= bulk;
      card.className  = "bld-card" + (!canAfford ? " cant-afford" : "");
      if (costEl) costEl.textContent = "🍪 " + fmt(single);
      if (qcEl) {
        qcEl.textContent = qty > 1 ? `${qty}× for 🍪 ${fmt(bulk)}` : "";
      }
    }

    const owned = S.bld[b.key] || 0;
    if (ownEl) ownEl.textContent = owned > 0 ? owned + " owned" : "";
  });

  // Achievement counter
  const unlocked = Object.values(S.ach).filter(Boolean).length;
  const achEl = document.getElementById("ach-progress");
  if (achEl) achEl.textContent = `${unlocked} / ${ACH.length} unlocked`;
}

// ─── BUILD UI ────────────────────────────────────────────────────────────────
function buildUpgCards() {
  const grid = document.getElementById("upgrades-grid");
  if (!grid) return;
  grid.innerHTML = "";
  UPGRADES.forEach(u => {
    const card     = document.createElement("button");
    card.id        = "upg-" + u.id;
    card.className = "upg-card cant-afford";
    card.onclick   = () => addUpgrade(u.id);
    card.innerHTML = `
      <span class="upg-icon">${u.icon}</span>
      <span class="upg-name">${u.name}</span>
      <span class="upg-meta">+${fmt(u.bonus)} flat & CPS boost · Lv 0</span>
      <span class="upg-cost">🍪 ${fmt(u.baseCost)}</span>`;
    grid.appendChild(card);
  });
}

function buildBldButtons() {
  const list = document.getElementById("buildings-list");
  if (!list) return;
  list.innerHTML = "";
  BUILDINGS.forEach(b => {
    const card     = document.createElement("button");
    card.id        = "bld-" + b.key;
    card.className = "bld-card cant-afford";
    card.onclick   = () => buyBld(b.key);
    card.innerHTML = `
      <span class="bld-icon">${b.icon}</span>
      <span class="bld-body">
        <span class="bld-name">${b.name}</span>
        <span class="bld-meta">${b.desc} · +${fmt(b.cps)}/s & boosts CPC</span>
        <span id="bld-owned-${b.key}" class="bld-owned"></span>
      </span>
      <span class="bld-right">
        <span id="bld-cost-${b.key}" class="bld-cost">🍪 ${fmt(b.baseCost)}</span>
        <span id="bld-qcost-${b.key}" class="bld-qty-cost"></span>
      </span>`;
    list.appendChild(card);
  });
}

function buildAchUI() {
  const grid = document.getElementById("achievements-grid");
  if (!grid) return;
  grid.innerHTML = "";
  ACH.forEach(a => {
    const d     = document.createElement("div");
    d.id        = "ach-" + a.id;
    d.className = "ach-card" + (S.ach[a.id] ? " unlocked" : "");
    d.innerHTML = `
      <span class="ach-ico">${S.ach[a.id] ? a.icon : "🔒"}</span>
      <span class="ach-nm">${a.name}</span>`;
    grid.appendChild(d);
  });
}

function refreshAchUI() {
  ACH.forEach(a => {
    const el = document.getElementById("ach-" + a.id);
    if (!el) return;
    el.className = "ach-card" + (S.ach[a.id] ? " unlocked" : "");
    el.querySelector(".ach-ico").textContent = S.ach[a.id] ? a.icon : "🔒";
  });
}

function renderPatchNotes() {
  const feed  = document.getElementById("patch-feed");
  const empty = document.getElementById("patch-empty");
  if (!feed) return;
  feed.innerHTML = "";
  if (!PATCH_NOTES.length) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";
  PATCH_NOTES.forEach(p => {
    const d     = document.createElement("div");
    d.className = "patch-entry";
    d.innerHTML = `
      <div class="patch-version">${esc(p.version)}</div>
      <div class="patch-date">${esc(p.date)}</div>
      <div class="patch-body">${esc(p.text)}</div>`;
    feed.appendChild(d);
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
let achQueue = [], toastBusy = false;

function checkAch() {
  ACH.forEach(a => {
    if (!S.ach[a.id] && a.cond(S)) {
      S.ach[a.id] = true;
      achQueue.push(a);
      refreshAchUI();
    }
  });
  drainToast();
}

function drainToast() {
  if (toastBusy || achQueue.length === 0) return;
  toastBusy    = true;
  const a      = achQueue.shift();
  const toast  = document.getElementById("achievement-toast");
  const nameEl = document.getElementById("toast-name");
  if (!toast || !nameEl) { toastBusy = false; return; }
  nameEl.textContent = a.name;
  toast.classList.remove("hidden", "hiding");
  const bar = toast.querySelector(".toast-bar");
  if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => {
      toast.classList.add("hidden");
      toastBusy = false;
      drainToast();
    }, 280);
  }, 2800);
}

// ─── DEV LOG MODAL ───────────────────────────────────────────────────────────
function showDevlog() {
  if (!DEV_LOG.show) return;
  const seenKey = "cc_devlog_seen_" + DEV_LOG.version;
  if (sessionStorage.getItem(seenKey)) return;
  sessionStorage.setItem(seenKey, "1");
  const badge = document.getElementById("modal-version-badge");
  const body  = document.getElementById("modal-body");
  const modal = document.getElementById("devlog-modal");
  if (!badge || !body || !modal) return;
  badge.textContent = "Dev Log · " + DEV_LOG.version;
  body.textContent  = DEV_LOG.text;
  modal.classList.remove("hidden");
}

function closeDevlog() {
  const modal = document.getElementById("devlog-modal");
  if (modal) modal.classList.add("hidden");
}

// ─── SAVE ────────────────────────────────────────────────────────────────────
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(S));
  } catch (e) {
    console.warn("Save failed:", e);
  }
}

// ─── LOAD ────────────────────────────────────────────────────────────────────
function load() {
  // Clean up saves from old versions
  ["cc_v3", "cc_v4", "cc_v5", "cc_v6"].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);

    S.score       = isFinite(d.score)    ? d.score    : 0;
    S.life        = isFinite(d.life)     ? d.life     : 0;
    S.prestige    = isFinite(d.prestige) ? d.prestige : 0;
    S.pmult       = isFinite(d.pmult)    ? d.pmult    : 1;
    S.totalClicks = isFinite(d.totalClicks) ? d.totalClicks : 0;
    S.ach         = (d.ach && typeof d.ach === "object") ? d.ach : {};

    // Upgrades: load array, ensure correct length, clamp to non-negative integers
    const loadedUpg = Array.isArray(d.upgrades) ? d.upgrades : [];
    S.upgrades = UPGRADES.map((_, i) => Math.max(0, Math.floor(loadedUpg[i] || 0)));

    // Buildings: load each key individually with fallback to 0
    BUILDINGS.forEach(b => {
      S.bld[b.key] = (d.bld && isFinite(d.bld[b.key])) ? Math.max(0, Math.floor(d.bld[b.key])) : 0;
    });

    // Recompute pmult from prestige in case of corruption
    S.pmult = Math.pow(1.05, S.prestige);

  } catch (e) {
    console.warn("Load failed, starting fresh:", e);
  }
}

// ─── HARD RESET ──────────────────────────────────────────────────────────────
function hardReset() {
  if (!confirm("Hard reset ALL progress including prestiges? This cannot be undone.")) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  sessionStorage.clear();
  location.reload();
}

// ─── INIT ────────────────────────────────────────────────────────────────────
load();
buildUpgCards();
buildBldButtons();
buildAchUI();
renderPatchNotes();
updateDisplay();
showDevlog();

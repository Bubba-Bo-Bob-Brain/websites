/* ═══════════════════════════════════════════════════════════════
   NEXUS PRIME — SCI‑FI MMORPG COMMAND DASHBOARD v7.4.1
   scripts.js – all runtime logic, live‑updates & interactions
   Optimised for 4K (3840 × 2160) @ 100 % scale
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── helpers ──────────────────────────────────────────────── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const pad = (n, len = 2) => String(n).padStart(len, "0");

  /* ── 1. CLOCKS ───────────────────────────────────────────── */
  const serverTimeEl = $("#serverTime");
  const realTimeEl = $("#realTime");

  function updateClocks() {
    // In‑game stardate (advances ~0.1 per real second)
    const now = Date.now();
    const totalSec = Math.floor(now / 1000);
    const stardate =
      "STARDATE " +
      (8947 + Math.floor(totalSec / 86400)).toFixed(0) +
      "." +
      pad(Math.floor((totalSec % 86400) / 3600)) +
      pad(Math.floor(((totalSec % 3600) / 60) * 10));
    serverTimeEl.textContent = stardate;

    // Real UTC clock
    const d = new Date();
    realTimeEl.textContent =
      "UTC: " +
      pad(d.getUTCHours()) +
      ":" +
      pad(d.getUTCMinutes()) +
      ":" +
      pad(d.getUTCSeconds());
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  /* ── 2. STAR MAP ─────────────────────────────────────────── */
  const MAP_COLS = 15,
    MAP_ROWS = 9;
  const mapContainer = $("#starMap");

  // faction ids → css class
  const factionClass = {
    UA: "ua",
    TF: "tf",
    ZD: "zd",
    AC: "ac",
    NS: "ns",
    MG: "mg",
    SC: "sc",
  };

  // generate a deterministic pseudo‑random map (seed = 42)
  function seededRand(s) {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }

  const sectors = []; // 2‑d array
  for (let r = 0; r < MAP_ROWS; r++) {
    const row = [];
    for (let c = 0; c < MAP_COLS; c++) {
      const i = r * MAP_COLS + c;
      const rnd = seededRand(i * 7 + 13);
      let type = "empty";
      if (i === 60) type = "player";               // starting sector
      else if (rnd < 0.06) type = "battle";
      else if (rnd < 0.1) type = "anomaly";
      else if (rnd < 0.18) type = "warp";
      else if (rnd < 0.45) {
        // faction territory
        const f = ["UA", "TF", "ZD", "AC", "NS", "MG", "SC"];
        type = "faction-" + pick(f);
      }
      row.push(type);
    }
    sectors.push(row);
  }

  // render the grid
  mapContainer.style.display = "grid";
  mapContainer.style.gridTemplateColumns = `repeat(${MAP_COLS}, 1fr)`;
  mapContainer.style.gridTemplateRows = `repeat(${MAP_ROWS}, 1fr)`;

  const sectorElements = []; // keep refs for live updates
  sectors.forEach((row, r) => {
    row.forEach((type, c) => {
      const div = document.createElement("div");
      div.className = "map-sector";
      div.dataset.row = r;
      div.dataset.col = c;

      // add specific class
      if (type === "player") {
        div.classList.add("sector-player");
        div.textContent = "🧭";
        div.title = `YOU ARE HERE – ${c},${r}`;
      } else if (type.startsWith("faction-")) {
        const f = type.split("-")[1].toLowerCase();
        div.classList.add("sector-" + f);
        div.title = `${type.replace("-", " ")} sector`;
      } else if (type === "battle") {
        div.classList.add("sector-battle");
        div.textContent = "⚔️";
        div.title = "Active Battle";
      } else if (type === "anomaly") {
        div.classList.add("sector-anomaly");
        div.textContent = "✨";
        div.title = "Anomaly Detected";
      } else if (type === "warp") {
        div.classList.add("sector-warp");
        div.textContent = "🌀";
        div.title = "Warp Storm";
      } else {
        div.classList.add("sector-explored");
        div.title = `Sector ${c},${r}`;
      }

      // tooltip with coordinates on hover
      div.addEventListener("mouseenter", () => {
        const coord = document.querySelector(".map-coords span:first-child");
        if (coord) coord.textContent = `▸ CURSOR: [${c}, ${r}] — ${type.replace("-", " ").toUpperCase()}`;
      });

      mapContainer.appendChild(div);
      sectorElements.push(div);
    });
  });

  // Legend dots (already in HTML, keep for reference)

  /* ── 3. MARKET PRICE FLUCTUATIONS ────────────────────────── */
  const marketRows = $$(".res-market .res-table tbody tr");

  function fluctuateMarket() {
    marketRows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 4) return;
      const priceCell = cells[1];
      const changeCell = cells[2];
      const volCell = cells[3];

      // extract numeric price
      const txt = priceCell.textContent.replace(/[^\d.]/g, "");
      let price = parseFloat(txt) || 1;
      const delta = (Math.random() - 0.48) * price * 0.02; // slight upward bias
      price = Math.max(0.01, price + delta);
      const pct = ((delta / price) * 100).toFixed(1);
      priceCell.textContent = price.toFixed(2) + " cr/u";

      // colour change
      if (delta > 0) {
        changeCell.className = "chg up";
        changeCell.textContent = `▲ +${pct}%`;
      } else if (delta < 0) {
        changeCell.className = "chg down";
        changeCell.textContent = `▼ ${pct}%`;
      } else {
        changeCell.className = "chg neutral";
        changeCell.textContent = "▬ 0%";
      }

      // random volume tweak
      const vol = rand(500, 5000000);
      volCell.textContent = `📈 Vol: ${(vol / 1000).toFixed(1)}K`;
    });
  }
  setInterval(fluctuateMarket, 4000);

  /* ── 4. RESOURCE EXTRACTION PROGRESS ─────────────────────── */
  const oreBars = $$(".res-extraction .bar-fill.ore");

  function updateExtraction() {
    oreBars.forEach((bar) => {
      const cur = parseFloat(bar.style.width) || 50;
      const next = Math.min(100, Math.max(5, cur + rand(-5, 5)));
      bar.style.width = next + "%";
      bar.textContent = next + "%";
    });
  }
  setInterval(updateExtraction, 6000);

  /* ── 5. FLEET STATUS SIMULATION ──────────────────────────── */
  const fleetRows = $$(".fleet-table tbody tr");

  function updateFleet() {
    fleetRows.forEach((row) => {
      // randomly change power level a bit
      const bar = row.querySelector(".bar-fill");
      if (!bar) return;
      const cur = parseFloat(bar.style.width) || 80;
      const next = Math.min(100, Math.max(10, cur + rand(-8, 5)));
      bar.style.width = next + "%";
      bar.textContent = next + "%";

      // occasionally flip status
      const statusCell = row.querySelectorAll("td")[6];
      if (!statusCell) return;
      const statuses = [
        { cls: "status-combat", txt: "⚔️ COMBAT" },
        { cls: "status-move", txt: "➡️ MOVING" },
        { cls: "status-patrol", txt: "👁️ PATROL" },
        { cls: "status-repair", txt: "🔧 REPAIRING" },
        { cls: "status-cloak", txt: "👻 CLOAKED" },
        { cls: "status-trade", txt: "💰 TRADING" },
      ];
      if (Math.random() < 0.07) {
        const pick = statuses[rand(0, statuses.length - 1)];
        statusCell.className = pick.cls;
        statusCell.textContent = pick.txt;
      }
    });
  }
  setInterval(updateFleet, 8000);

  /* ── 6. MISSION STATUS RANDOMIZER ───────────────────────── */
  const missionDivs = $$(".mission-grid .mission");

  function updateMissions() {
    missionDivs.forEach((div) => {
      const status = div.querySelector(".m-status");
      if (!status) return;
      const states = [
        { cls: "active", txt: "🔴 ACTIVE" },
        { cls: "in-progress", txt: "🟡 IN PROGRESS" },
        { cls: "available", txt: "🟢 AVAILABLE" },
        { cls: "cooldown", txt: "⏳ COOLDOWN" },
      ];
      if (Math.random() < 0.04) {
        const pick = states[rand(0, states.length - 1)];
        status.className = "m-status " + pick.cls;
        status.textContent = pick.txt;
      }
    });
  }
  setInterval(updateMissions, 12000);

  /* ── 7. INTEL FEED APPENDER ──────────────────────────────── */
  const intelBody = $(".intel-body");
  const intelTemplates = [
    { alert: "🔴", msg: "Zerathi raiders detected near sector {x},{y}" },
    { alert: "🟡", msg: "Trade convoy #{id} arrived safely – profit {profit} cr" },
    { alert: "🟢", msg: "Research update: {tech} phase {pct}% complete" },
    { alert: "🔴", msg: "⚠️ Anomaly signatures in Dead Zone {x}X" },
    { alert: "🔵", msg: "Alliance reinforcements en route – ETA {eta}" },
    { alert: "🟡", msg: "Market alert: {item} price {dir} {val}%" },
    { alert: "🟢", msg: "Mining op Sigma‑4 at {eff}% capacity" },
    { alert: "🔴", msg: "⚔️ Void Corsair raider spotted near Arcturus" },
    { alert: "🟢", msg: "Fleet Phoenix‑12 repair {pct}% complete" },
    { alert: "🔵", msg: "Diplomatic channel: {faction} proposes ceasefire" },
  ];

  function pushIntel() {
    const tpl = pick(intelTemplates);
    const replacements = {
      "{x}": rand(1, 15),
      "{y}": rand(1, 9),
      "{id}": rand(4000, 9999),
      "{profit}": (rand(500, 3000) * 1000).toLocaleString(),
      "{tech}": pick(["Quantum Entanglement Drive", "Nano‑Plating", "Antimatter Warheads"]),
      "{pct}": rand(10, 99),
      "{eta}": rand(1, 6) + "h",
      "{item}": pick(["Phase Shifter", "Tritanium", "Xenorite"]),
      "{dir}": pick(["▲ +", "▼ –"]),
      "{val}": rand(1, 15),
      "{eff}": rand(70, 100),
      "{faction}": pick(["Aetherian Collective", "Terran Federation", "Neo‑Synergy AI"]),
    };
    let text = tpl.msg;
    Object.keys(replacements).forEach((k) => {
      text = text.replace(k, replacements[k]);
    });

    const div = document.createElement("div");
    div.className = "intel-msg";
    const now = new Date();
    div.innerHTML = `<span class="intel-time">[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]</span>
      <span class="intel-alert">${tpl.alert}</span>
      <span>${text}</span>`;
    intelBody.prepend(div);

    // keep only the latest 30 entries
    while (intelBody.children.length > 30) intelBody.lastChild.remove();
  }
  setInterval(pushIntel, 5000);

  /* ── 8. SYSTEM DIAGNOSTICS ──────────────────────────────── */
  const sysBars = $$(".sys-grid .bar-fill");
  const sysInfo = $(".sys-info");

  function updateSys() {
    sysBars.forEach((bar) => {
      const cur = parseFloat(bar.style.width) || 30;
      const next = Math.min(100, Math.max(5, cur + rand(-6, 6)));
      bar.style.width = next + "%";
      bar.textContent = next + "%";
    });

    // update info line
    const fps = rand(120, 160);
    const ping = rand(12, 45);
    const therm = rand(55, 80);
    sysInfo.innerHTML = `
      <span>🏷️ CLIENT: v4.7.2‑hotfix3</span>
      <span>🌍 REGION: US‑WEST</span>
      <span>📡 PING: ${ping}ms</span>
      <span>📊 FPS: ${fps}</span>
      <span>🔋 THERMAL: ${therm}°C</span>`;
  }
  setInterval(updateSys, 3000);

  /* ── 9. RESOURCE & TRADE ROUTE EFFICIENCY ───────────────── */
  const routeBars = $$(".route-row .bar-fill");

  function updateRoutes() {
    routeBars.forEach((bar) => {
      const cur = parseFloat(bar.style.width) || 50;
      const next = Math.min(100, Math.max(10, cur + rand(-5, 5)));
      bar.style.width = next + "%";
      bar.textContent = next + "% eff.";
    });
  }
  setInterval(updateRoutes, 9000);

  /* ── 10. CLICK INTERACTIONS ──────────────────────────────── */
  // sector click → show quick info tooltip
  mapContainer.addEventListener("click", (e) => {
    const sector = e.target.closest(".map-sector");
    if (!sector) return;
    const r = sector.dataset.row,
      c = sector.dataset.col;
    const type = sector.className;
    let info = `Sector [${c}, ${r}]\nType: ${type.replace("sector-", "")}`;
    // simple alert for demo – replace with a custom tooltip for production
    alert(info);
  });

  // inventory slot hover → enlarge preview (CSS handles the look)
  $$(".inv-slot").forEach((slot) => {
    slot.addEventListener("mouseenter", () => {
      slot.style.transform = "scale(1.12)";
      slot.style.zIndex = "5";
    });
    slot.addEventListener("mouseleave", () => {
      slot.style.transform = "";
      slot.style.zIndex = "";
    });
  });

  // mission click → toggle detail (demo: just log)
  $$(".mission").forEach((m) => {
    m.style.cursor = "pointer";
    m.addEventListener("click", () => {
      const name = m.querySelector(".m-name").textContent;
      const status = m.querySelector(".m-status").textContent;
      console.log(`[MISSION] ${name} – ${status}`);
    });
  });

  /* ── 11. INITIAL LIVE UPDATES (first tick) ───────────────── */
  updateClocks();
  fluctuateMarket();
  updateExtraction();
  updateFleet();
  updateMissions();
  updateSys();
  updateRoutes();
  // push a couple of intel lines on load
  pushIntel();
  setTimeout(pushIntel, 1500);
})();
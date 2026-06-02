// ===== GLOBAL VARIABLES =====
const factions = [
  { name: "Crimson Pact", color: "#ff00aa", icon: "🌟" },
  { name: "Voidborn Collective", color: "#00ffff", icon: "🪐" },
  { name: "Iron Legion", color: "#ff6600", icon: "🛸" },
  { name: "Pirate Clans", color: "#ffff00", icon: "☠️" }
];
const resources = [
  { name: "Titanium", icon: "⛏️", rate: 45230, trade: 2.4 },
  { name: "Plasma", icon: "⚡", rate: 1200, trade: -0.8 },
  { name: "Neutronium", icon: "💎", rate: 340, trade: 0 },
  { name: "Dark Matter", icon: "🧪", rate: 12, trade: "CRITICAL" }
];
const fleets = [
  { name: "Rapier Wing", icon: "⚔️", status: "PATROLLING", damage: 12 },
  { name: "Iron Talons", icon: "🛡️", status: "IDLE", damage: 0 },
  { name: "Vengeance Fleet", icon: "💥", status: "ENGAGED", damage: 45 },
  { name: "Star Mappers", icon: "🛰️", status: "DEPLOYING", damage: 0 },
  { name: "Nexus Prime", icon: "🛸", status: "OPERATIONAL", damage: 0 },
  { name: "Outpost Omega", icon: "💀", status: "UNDER ATTACK", damage: 78 }
];
const techTree = [
  { name: "Quantum Core", icon: "🧬", status: "COMPLETE" },
  { name: "Plasma Drive", icon: "⚡", status: "67%" },
  { name: "Adaptive Armor", icon: "🛡️", status: "34%" },
  { name: "Nano-Repair", icon: "🤖", status: "LOCKED" }
];
let dangerLevel = "⚠️ ELEVATED";
let warFronts = [
  { faction1: "Crimson Pact", faction2: "Voidborn Collective", location: "Sector 8-Δ", casualties: 12450, territory: "3.2km²" },
  { faction1: "Iron Legion", faction2: "Crimson Pact", location: "Outpost Omega", casualties: 8720, territory: "Station Breached" }
];

// ===== DOM ELEMENTS =====
const systemTimeEl = document.getElementById("system-time");
const dangerLevelEl = document.getElementById("danger-level");
const mapGridEl = document.getElementById("map-grid");
const warTickerEl = document.getElementById("war-ticker");
const resourceGridEl = document.querySelector(".resource-grid");
const fleetGridEl = document.querySelector(".fleet-grid");
const alertsStackEl = document.getElementById("alerts-stack");
const logContainerEl = document.getElementById("log-container");

// ===== INITIALIZE DASHBOARD =====
document.addEventListener("DOMContentLoaded", () => {
  updateSystemTime();
  generateStarMap();
  renderWarFronts();
  renderResources();
  renderFleets();
  renderTechTree();
  startSimulations();
});

// ===== SYSTEM CLOCK =====
function updateSystemTime() {
  const now = new Date();
  const timeString = now.toISOString().replace("T", " ⏳ ").split(".")[0];
  systemTimeEl.textContent = timeString;
  setTimeout(updateSystemTime, 1000);
}

// ===== STAR MAP =====
function generateStarMap() {
  // Clear existing nodes (except static examples)
  const staticNodes = document.querySelectorAll(".map-node:not([style*='--x'])");
  mapGridEl.innerHTML = "";
  staticNodes.forEach(node => mapGridEl.appendChild(node));

  // Generate 50 random nodes
  for (let i = 0; i < 50; i++) {
    const faction = factions[Math.floor(Math.random() * factions.length)];
    const types = ["🌟", "🪐", "🛸", "☠️"];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * 8 + 1; // Avoid edges
    const y = Math.random() * 8 + 1;

    const node = document.createElement("div");
    node.className = "map-node";
    node.style.setProperty("--x", x);
    node.style.setProperty("--y", y);
    node.style.setProperty("--faction", faction.color);
    node.dataset.faction = faction.name;
    node.dataset.type = type;
    node.innerHTML = type;

    // Add war front indicators
    if (Math.random() > 0.7) {
      const warIcon = document.createElement("span");
      warIcon.className = "war-icon";
      warIcon.textContent = "⚔️";
      warIcon.style.color = "#ffff00";
      node.appendChild(warIcon);
    }

    mapGridEl.appendChild(node);
  }
}

// ===== WAR FRONTS =====
function renderWarFronts() {
  warTickerEl.innerHTML = "";
  warFronts.forEach(front => {
    const item = document.createElement("div");
    item.className = "war-item";
    item.innerHTML = `
      <span class="war-faction" style="color: ${getFactionColor(front.faction1)}">${front.faction1}</span>
      <span class="war-vs">⚔️</span>
      <span class="war-faction" style="color: ${getFactionColor(front.faction2)}">${front.faction2}</span>
      <span class="war-location">| ${front.location}</span>
      <span class="war-casualties">⚰️ ${front.casualties} | 🏳️ ${front.territory}</span>
    `;
    warTickerEl.appendChild(item);
  });
}

function simulateWarFronts() {
  warFronts = warFronts.map(front => {
    return {
      ...front,
      casualties: Math.floor(front.casualties * (1 + (Math.random() - 0.5) * 0.1)),
      territory: Math.random() > 0.8 ? "Station Breached" : `${(Math.random() * 5).toFixed(1)}km²`
    };
  });

  // Add new conflict occasionally
  if (Math.random() > 0.7) {
    const faction1 = factions[Math.floor(Math.random() * factions.length)].name;
    const faction2 = factions.filter(f => f.name !== faction1)[Math.floor(Math.random() * (factions.length - 1))].name;
    warFronts.push({
      faction1,
      faction2,
      location: `Sector ${Math.floor(Math.random() * 10)}-${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      casualties: Math.floor(Math.random() * 10000),
      territory: `${(Math.random() * 5).toFixed(1)}km²`
    });
  }

  renderWarFronts();
  setTimeout(simulateWarFronts, 3000);
}

function getFactionColor(name) {
  return factions.find(f => f.name === name)?.color || "#ffffff";
}

// ===== RESOURCES =====
function renderResources() {
  resourceGridEl.innerHTML = "";
  resources.forEach(resource => {
    const item = document.createElement("div");
    item.className = "resource-item";
    item.innerHTML = `
      <span class="resource-icon">${resource.icon}</span>
      <span class="resource-name">${resource.name}</span>
      <span class="resource-rate">↑ ${resource.rate} ${resource.name === "Plasma" ? "GW/h" : "t/h"}</span>
      <span class="resource-trade">${getTradeIndicator(resource.trade)}</span>
    `;
    resourceGridEl.appendChild(item);
  });
}

function simulateResources() {
  resources.forEach(resource => {
    resource.rate = Math.max(0, resource.rate * (1 + (Math.random() - 0.5) * 0.1));
    if (resource.name !== "Dark Matter") {
      resource.trade = (Math.random() - 0.5) * 5;
    }
  });

  // Critical resource alert
  if (resources.find(r => r.name === "Dark Matter").rate < 10) {
    addAlert("🚨 CRITICAL RESOURCE: Dark Matter extraction at 12 kg/h", "critical");
    dangerLevel = "💥 CRITICAL";
    dangerLevelEl.textContent = dangerLevel;
  }

  renderResources();
  setTimeout(simulateResources, 2000);
}

function getTradeIndicator(trade) {
  if (trade === "CRITICAL") return "🚨 CRITICAL";
  if (trade > 0) return `📈 ${trade.toFixed(1)}% ↑`;
  if (trade < 0) return `📉 ${Math.abs(trade).toFixed(1)}% ↓`;
  return "📊 STABLE";
}

// ===== FLEETS =====
function renderFleets() {
  fleetGridEl.innerHTML = "";
  // Group fleets by type
  const corvettes = fleets.filter(f => f.icon === "⚔️" || f.icon === "🛡️");
  const cruisers = fleets.filter(f => f.icon === "💥" || f.icon === "🛰️");
  const stations = fleets.filter(f => f.icon === "🛸" || f.icon === "💀");

  [corvettes, cruisers, stations].forEach((group, i) => {
    const column = document.createElement("div");
    column.className = "fleet-column";
    const title = document.createElement("h3");
    title.className = "fleet-column-title";
    title.textContent = i === 0 ? "🛸 CORVETTES" : i === 1 ? "🚀 CRUISERS" : "🏰 STATIONS";
    column.appendChild(title);

    group.forEach(fleet => {
      const item = document.createElement("div");
      item.className = "fleet-item";
      const damageClass = fleet.damage > 50 ? "critical" : fleet.damage > 20 ? "warning" : "";
      item.innerHTML = `
        <span class="fleet-icon">${fleet.icon}</span>
        <span class="fleet-name">${fleet.name}</span>
        <span class="fleet-status ${fleet.status === 'ENGAGED' ? 'critical' : fleet.status === 'DEPLOYING' ? 'warning' : ''}">${getStatusIcon(fleet.status)} ${fleet.status}</span>
        <span class="fleet-damage ${damageClass}">⚠️ ${fleet.damage}%</span>
      `;
      column.appendChild(item);
    });

    fleetGridEl.appendChild(column);
  });
}

function simulateFleets() {
  fleets.forEach(fleet => {
    // Randomly change status
    if (Math.random() > 0.8) {
      const statuses = ["IDLE", "PATROLLING", "DEPLOYING", "ENGAGED", "UNDER ATTACK"];
      fleet.status = statuses[Math.floor(Math.random() * statuses.length)];
    }

    // Randomly change damage
    fleet.damage = Math.min(100, Math.max(0, fleet.damage + (Math.random() - 0.5) * 10));

    // Critical damage alert
    if (fleet.damage > 70 && Math.random() > 0.9) {
      addAlert(`💥 ${fleet.name} CRITICAL: ${fleet.damage}% damage`, "critical");
      dangerLevel = "💥 CRITICAL";
      dangerLevelEl.textContent = dangerLevel;
    }
  });

  renderFleets();
  setTimeout(simulateFleets, 4000);
}

function getStatusIcon(status) {
  switch (status) {
    case "IDLE": return "🟢";
    case "PATROLLING": return "🔵";
    case "DEPLOYING": return "🟡";
    case "ENGAGED": return "🔴";
    case "UNDER ATTACK": return "💥";
    default: return "⚪";
  }
}

// ===== TECH TREE =====
function renderTechTree() {
  const nodes = document.querySelectorAll(".tree-node");
  nodes.forEach((node, i) => {
    if (i > 0) node.style.setProperty("--angle", `${30 + (i - 1) * 60}deg`);
    node.querySelector(".node-status").textContent = techTree[i].status;
    if (techTree[i].status === "COMPLETE") {
      node.style.backgroundColor = "#00ffff";
      node.style.color = "black";
    } else if (techTree[i].status === "LOCKED") {
      node.style.opacity = "0.5";
    }
  });
}

// ===== ALERTS =====
function addAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert-item ${type}`;
  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0];
  alert.innerHTML = `
    <span class="alert-icon">${type === "critical" ? "💥" : type === "warning" ? "⚠️" : "📢"}</span>
    <span class="alert-message">${message}</span>
    <span class="alert-time">${timeString}</span>
  `;
  alertsStackEl.prepend(alert);

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transform = "translateY(-10px)";
    setTimeout(() => alert.remove(), 500);
  }, 10000);

  // Add to system log
  addLogEntry(message);
}

function simulateAlerts() {
  const alertTypes = [
    { message: "🛸 Destroyed: Pirate Outpost #" + Math.floor(Math.random() * 100), type: "info" },
    { message: "⚔️ War Front Updated: " + warFronts[Math.floor(Math.random() * warFronts.length)].faction1 + " vs " + warFronts[Math.floor(Math.random() * warFronts.length)].faction2, type: "warning" },
    { message: "💎 Neutronium Deposit Exhausted: Asteroid Belt γ-" + Math.floor(Math.random() * 10), type: "critical" },
    { message: "🚀 New Mission: 'Eliminate Pirate Nest' available", type: "info" }
  ];
  const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  if (Math.random() > 0.5) addAlert(randomAlert.message, randomAlert.type);

  setTimeout(simulateAlerts, 5000);
}

// ===== SYSTEM LOG =====
function addLogEntry(message) {
  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0];
  const logItem = document.createElement("div");
  logItem.className = "log-item";
  logItem.innerHTML = `
    <span class="log-time">${timeString}</span>
    <span class="log-message">${message}</span>
  `;
  logContainerEl.prepend(logItem);
}

// ===== START SIMULATIONS =====
function startSimulations() {
  simulateWarFronts();
  simulateResources();
  simulateFleets();
  simulateAlerts();
}
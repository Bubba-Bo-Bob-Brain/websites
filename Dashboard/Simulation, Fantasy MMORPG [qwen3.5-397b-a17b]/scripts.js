/* OMNISCIENCE.OS - SIMULATION ENGINE */

// --- CONFIGURATION & STATE ---
const CONFIG = {
    updateInterval: 1000,
    logSpeed: 2000,
    marketSpeed: 3000,
    maxLogs: 15
};

const STATE = {
    goldPrice: 420.50,
    population: 8492102,
    raidProgress: [85, 30],
    fps: 60,
    ping: 24
};

// --- DATA GENERATORS ---
const NAMES = ["Aethelred", "Kael", "Sylvanas", "Thrall", "Jaina", "Arthas", "Illidan", "Guldan", "Valeera", "Varian", "Xal", "Sargeras"];
const CLASSES = ["Warrior", "Mage", "Rogue", "Priest", "Warlock", "Paladin", "Druid", "Hunter", "Shaman", "Monk"];
const ACTIONS = ["slays", "defeats", "annihilates", "outmaneuvers", "betrays", "heals", "buffs", "nerfs"];
const ZONES = ["Elven Forest", "Dragon Peak", "Coastal City", "Shadow Realm", "Iron Forge", "Crystal Lake"];

const ITEMS = [
    { name: "Iron Ore", price: 12.5, trend: "up" },
    { name: "Mana Crystal", price: 45.0, trend: "down" },
    { name: "Dragon Scale", price: 1200.0, trend: "up" },
    { name: "Herb Bundle", price: 8.2, trend: "stable" },
    { name: "Mythic Sword", price: 50000.0, trend: "up" },
    { name: "Leather Scraps", price: 2.1, trend: "down" }
];

// --- DOM ELEMENTS CACHE ---
const DOM = {
    clock: document.getElementById('realtime-clock'),
    population: document.getElementById('population'),
    combatLog: document.getElementById('combat-log'),
    pvpTable: document.getElementById('pvp-table-body'),
    marketTicker: document.getElementById('market-ticker'),
    fps: document.getElementById('fps-counter'),
    ping: document.getElementById('ping-counter'),
    raidBars: document.querySelectorAll('.progress-fill'),
    raidTexts: document.querySelectorAll('.progress-text'),
    hexGrid: document.getElementById('territory-map')
};

// --- CORE FUNCTIONS ---

function init() {
    generateHexMap();
    updateClock();
    startSimulation();
}

function updateClock() {
    const now = new Date();
    if (DOM.clock) {
        DOM.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
    }
}

function generateHexMap() {
    if (!DOM.hexGrid) return;
    const totalHexes = 100;
    for (let i = 0; i < totalHexes; i++) {
        const hex = document.createElement('div');
        hex.classList.add('hex');
        const rand = Math.random();
        if (rand > 0.7) hex.classList.add('ally');
        else if (rand > 0.4) hex.classList.add('enemy');
        else hex.classList.add('neutral');
        DOM.hexGrid.appendChild(hex);
    }
}

function generateCombatLog() {
    if (!DOM.combatLog) return;
    const source = NAMES[Math.floor(Math.random() * NAMES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const target = NAMES[Math.floor(Math.random() * NAMES.length)];
    const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    logEntry.innerHTML = `<span class="time">[${time}]</span> <span class="source">${source}</span> <span class="action">${action}</span> <span class="target">${target}</span> <span style="color:#666">in ${zone}</span>`;

    DOM.combatLog.appendChild(logEntry);

    if (DOM.combatLog.childElementCount > CONFIG.maxLogs) {
        DOM.combatLog.removeChild(DOM.combatLog.firstChild);
    }
}

function updateMarket() {
    if (!DOM.marketTicker) return;
    ITEMS.forEach(item => {
        const fluctuation = (Math.random() - 0.5) * 5;
        item.price += fluctuation;
        if (item.price < 0.1) item.price = 0.1;
    });

    const tickerString = ITEMS.map(item => ` ${item.name}: ${item.price.toFixed(2)}g ${item.trend === 'up' ? '▲' : '▼'} `).join(' | ');
    DOM.marketTicker.innerText = tickerString + " | " + tickerString;
}

function updateRaids() {
    STATE.raidProgress.forEach((prog, index) => {
        let change = Math.floor(Math.random() * 5) - 2;
        let newProg = prog + change;
        if (newProg > 100) newProg = 100;
        if (newProg < 0) newProg = 0;
        STATE.raidProgress[index] = newProg;

        if (DOM.raidBars[index] && DOM.raidTexts[index]) {
            DOM.raidBars[index].style.width = `${newProg}%`;
            DOM.raidTexts[index].innerText = `BOSS ${Math.floor(newProg / 10) + 1}/10`;
        }
    });
}

function updateStats() {
    if (!DOM.population) return;
    STATE.population += Math.floor(Math.random() * 10) - 5;
    DOM.population.innerText = STATE.population.toLocaleString();

    STATE.fps = Math.floor(58 + Math.random() * 4);
    STATE.ping = Math.floor(20 + Math.random() * 10);

    if (DOM.fps) DOM.fps.innerText = STATE.fps;
    if (DOM.ping) DOM.ping.innerText = `${STATE.ping}ms`;
}

function generatePVPTable() {
    if (!DOM.pvpTable) return;
    let html = '';
    for (let i = 0; i < 5; i++) {
        const name = NAMES[Math.floor(Math.random() * NAMES.length)] + (Math.floor(Math.random() * 99));
        const cls = CLASSES[Math.floor(Math.random() * CLASSES.length)];
        const kills = Math.floor(Math.random() * 500) + 50;
        const kd = (Math.random() * 5).toFixed(2);
        html += `<tr><td>${i + 1}</td><td>${name}</td><td>${cls}</td><td>${kills}</td><td>${kd}</td></tr>`;
    }
    DOM.pvpTable.innerHTML = html;
}

// --- SIMULATION LOOP ---

function startSimulation() {
    updateMarket();
    generatePVPTable();

    setInterval(() => {
        updateClock();
        updateStats();
    }, 1000);

    setInterval(() => {
        generateCombatLog();
    }, CONFIG.logSpeed);

    setInterval(() => {
        updateMarket();
    }, CONFIG.marketSpeed);

    setInterval(() => {
        updateRaids();
    }, 2000);

    setInterval(() => {
        generatePVPTable();
    }, 10000);

    setInterval(() => {
        const hexes = document.querySelectorAll('.hex');
        hexes.forEach(hex => {
            if (Math.random() > 0.9) {
                hex.classList.remove('ally', 'enemy', 'neutral');
                const rand = Math.random();
                if (rand > 0.7) hex.classList.add('ally');
                else if (rand > 0.4) hex.classList.add('enemy');
                else hex.classList.add('neutral');
            }
        });
    }, 500);
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', init);
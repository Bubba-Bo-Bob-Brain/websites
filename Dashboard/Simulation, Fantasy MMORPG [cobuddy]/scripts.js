// Realmwatch Dashboard — Live Simulation Scripts

// ========== REALM TIME CLOCK ==========
const timeEl = document.getElementById('realm-time');
let seconds = 0;
function updateRealmTime() {
    seconds += 1;
    const h = Math.floor((seconds / 3600) % 24).toString().padStart(2, '0');
    const m = Math.floor((seconds / 60) % 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timeEl.textContent = `${h}:${m}:${s}`;
}
setInterval(updateRealmTime, 1000);

// ========== LIVE EVENT FEED ==========
const eventsFeed = document.getElementById('events-feed');
const eventTemplates = [
    { type: 'combat', msg: '🗡️ [Dark Covenant] ambushed [Knights of Dawn] near Silverpine — 1,847 casualties' },
    { type: 'raid', msg: '🐉 Ignis Rex used \"Wrath of the Elder Dragon\" — 12 parties wiped' },
    { type: 'economy', msg: '💰 Abyssal Edge price hit 12,400g — new all-time high' },
    { type: 'territory', msg: '🏴 [Void Walkers] fortified Outpost 12 in Shadowfell' },
    { type: 'quest', msg: '📜 World Quest: \"Echoes of the Fallen\" spawned — 1,203 players engaged' },
    { type: 'loot', msg: '🎁 [Player] dropped mythic \"Crown of Oblivion\" in Abyssal Depths' },
    { type: 'pvp', msg: '⚔️ 5v5 Arena: [Dragonforge] vs [Green Wardens] — Match starting' },
    { type: 'guild', msg: '🏰 [Tidecallers] formed trade alliance with [Iron Guild]' },
    { type: 'weather', msg: '🌨️ Blizzard spreading to Crimson Reach — visibility dropping' },
    { type: 'exploration', msg: '🗺️ Hidden dungeon found in Moonhollow — 3 players inside' },
    { type: 'combat', msg: '🗡️ [Emberlit] raided [Crimson Reavers] supply camp — 890 looted' },
    { type: 'raid', msg: '🕷️ Spider Queen entered Phase 2 — web traps active' },
    { type: 'economy', msg: '📉 Elixir of Storms crashed to 2,100g — 15% drop in 10 min' },
    { type: 'territory', msg: '🏴 [Dark Covenant] recaptured Outpost 3 in Ashenmoor' },
    { type: 'quest', msg: '📜 Daily bounty: \"Collect 500 Void Shards\" — 2,341 claimed' },
    { type: 'loot', msg: '🎁 [Player] crafted legendary \"Staff of the Arcane Tide\"' },
    { type: 'pvp', msg: '⚔️ Open world PvP: 847 players flagged in Crimson Reach' },
    { type: 'guild', msg: '🏰 [Knights of Dawn] declared siege on Voidgate Citadel' },
    { type: 'weather', msg: '☀️ Emberforge heatwave — fire resistance buffs active' },
    { type: 'exploration', msg: '🗺️ \"The Howling Abyss\" zone fully mapped — 47 secrets found' },
];

let eventCounter = 0;
function addNewEvent() {
    const template = eventTemplates[eventCounter % eventTemplates.length];
    eventCounter++;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const div = document.createElement('div');
    div.className = `event-item ${template.type}`;
    div.innerHTML = `<span class="event-time">${timeStr}</span><span class="event-msg">${template.msg}</span>`;
    eventsFeed.insertBefore(div, eventsFeed.firstChild);
    if (eventsFeed.children.length > 20) {
        eventsFeed.removeChild(eventsFeed.lastChild);
    }
}
setInterval(addNewEvent, 4000);

// ========== RAID PROGRESS UPDATES ==========
const raidEntries = document.querySelectorAll('.raid-entry');
function updateRaidProgress() {
    raidEntries.forEach(entry => {
        const bar = entry.querySelector('.raid-fill');
        const status = entry.querySelector('.raid-status');
        const percentage = entry.querySelector('.raid-percentage');
        let currentWidth = parseFloat(bar.style.width);
        const change = (Math.random() - 0.4) * 2;
        currentWidth = Math.max(2, Math.min(98, currentWidth + change));
        bar.style.width = currentWidth + '%';
        const hpVal = Math.round(100 - currentWidth);
        if (percentage) percentage.textContent = `HP: ${hpVal}%`;
        if (status) {
            if (currentWidth > 80) status.className = 'raid-status danger';
            else if (currentWidth > 50) status.className = 'raid-status warning';
            else status.className = 'raid-status';
        }
    });
}
setInterval(updateRaidProgress, 3000);

// ========== MARKET PRICE FLUCTUATIONS ==========
const economyPrices = document.querySelectorAll('.economy-price');
function fluctuatePrices() {
    economyPrices.forEach(el => {
        const current = parseFloat(el.textContent.match(/[\d.]+/)[0]);
        const change = (Math.random() - 0.5) * current * 0.02;
        const newVal = (current + change).toFixed(1);
        const isUp = change >= 0;
        el.textContent = `${isUp ? '+' : ''}${newVal}%`;
        el.className = `economy-price ${isUp ? 'up' : 'down'}`;
    });
}
setInterval(fluctuatePrices, 5000);

// ========== RESOURCE TRACKER FLUCTUATIONS ==========
const resourceChanges = document.querySelectorAll('.resource-change');
function fluctuateResources() {
    resourceChanges.forEach(el => {
        const current = parseFloat(el.textContent.match(/[\d.]+/)[0]);
        const change = (Math.random() - 0.5) * 0.5;
        const newVal = (current + change).toFixed(1);
        const isUp = change >= 0;
        el.textContent = `${isUp ? '▲' : '▼'} ${newVal}%`;
        el.className = `resource-change ${isUp ? 'up' : 'down'}`;
    });
}
setInterval(fluctuateResources, 4000);

// ========== WEATHER ZONE UPDATES ==========
const zoneWeathers = document.querySelectorAll('.zone-weather');
const weatherOptions = [
    { icon: '☀️', temp: '34°C' },
    { icon: '🌧️', temp: '8°C' },
    { icon: '🌨️', temp: '-12°C' },
    { icon: '⛈️', temp: '11°C' },
    { icon: '🌤️', temp: '18°C' },
    { icon: '🌫️', temp: '4°C' },
    { icon: '🌕', temp: 'Clear' },
    { icon: '☁️', temp: '15°C' },
    { icon: '🌪️', temp: '22°C' },
];
function updateZoneWeather() {
    zoneWeathers.forEach(zone => {
        const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        const spans = zone.querySelectorAll('span');
        if (spans[0]) spans[0].textContent = randomWeather.icon + ' ' + spans[0].textContent.split(' ')[1];
        if (spans[1]) spans[1].textContent = randomWeather.temp;
    });
}
setInterval(updateZoneWeather, 8000);

// ========== COMBAT STAT TICKER ==========
const combatValues = document.querySelectorAll('.combat-value');
function tickCombatStats() {
    combatValues.forEach(el => {
        const base = parseInt(el.textContent.replace(/,/g, ''));
        const increment = Math.floor(Math.random() * 50) + 10;
        const newVal = base + increment;
        el.textContent = newVal.toLocaleString();
    });
}
setInterval(tickCombatStats, 2000);

// ========== GUILD POWER FLUCTUATIONS ==========
const guildPowers = document.querySelectorAll('.guild-power');
function tickGuildPower() {
    guildPowers.forEach(el => {
        const base = parseInt(el.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 10000) - 3000;
        const newVal = Math.max(100000, base + change);
        el.textContent = newVal.toLocaleString();
    });
}
setInterval(tickGuildPower, 6000);

// ========== TERRITORY MAP HOVER TOOLTIPS ==========
const mapCells = document.querySelectorAll('.map-cell');
mapCells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        cell.style.zIndex = '10';
        cell.style.transform = 'scale(1.08)';
    });
    cell.addEventListener('mouseleave', () => {
        cell.style.zIndex = '';
        cell.style.transform = '';
    });
});

// ========== POPULATION TICKER ==========
const populationEl = document.querySelector('.pill-value');
if (populationEl && populationEl.closest('.stat-pill').querySelector('.pill-label').textContent.includes('Population')) {
    function tickPopulation() {
        const current = parseInt(populationEl.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 20) - 5;
        populationEl.textContent = (current + change).toLocaleString();
    }
    setInterval(tickPopulation, 3000);
}

// ========== KILLS TODAY TICKER ==========
const killsEl = document.querySelectorAll('.stat-pill')[2]?.querySelector('.pill-value');
if (killsEl) {
    function tickKills() {
        const current = parseInt(killsEl.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 15) + 1;
        killsEl.textContent = (current + change).toLocaleString();
    }
    setInterval(tickKills, 1500);
}

// ========== ACTIVE WARS TICKER ==========
const warsEl = document.querySelectorAll('.stat-pill')[1]?.querySelector('.pill-value');
if (warsEl) {
    function tickWars() {
        const current = parseInt(warsEl.textContent);
        const change = Math.floor(Math.random() * 3) - 1;
        const newVal = Math.max(8, Math.min(20, current + change));
        warsEl.textContent = newVal;
    }
    setInterval(tickWars, 7000);
}

// ========== SEASON PROGRESS BAR ==========
const seasonFill = document.querySelector('.season-fill');
if (seasonFill) {
    function updateSeasonProgress() {
        let current = parseFloat(seasonFill.style.width);
        const change = (Math.random() - 0.3) * 0.5;
        current = Math.max(50, Math.min(90, current + change));
        seasonFill.style.width = current + '%';
    }
    setInterval(updateSeasonProgress, 10000);
}

// ========== MAP CELL PULSE ON CONTESTED ==========
const contestedCells = document.querySelectorAll('.map-cell.contested');
contestedCells.forEach(cell => {
    let pulse = false;
    setInterval(() => {
        if (!pulse) {
            cell.style.borderColor = 'rgba(224, 69, 69, 0.8)';
            pulse = true;
        } else {
            cell.style.borderColor = 'rgba(224, 69, 69, 0.3)';
            pulse = false;
        }
    }, 1500);
});

// ========== EXPLORATION PROGRESS SLOW DRIFT ==========
const exploreFills = document.querySelectorAll('.explore-fill');
exploreFills.forEach(fill => {
    let current = parseFloat(fill.style.width);
    setInterval(() => {
        current = Math.min(99, current + 0.1);
        fill.style.width = current + '%';
        fill.closest('.explore-item')?.querySelector('.explore-pct')?.textContent && 
            (fill.closest('.explore-item').querySelector('.explore-pct').textContent = Math.round(current) + '%');
    }, 5000);
});

// ========== FACTION BAR SMOOTH DRIFT ==========
const factionFills = document.querySelectorAll('.faction-fill');
factionFills.forEach(fill => {
    let current = parseFloat(fill.style.width);
    setInterval(() => {
        const change = (Math.random() - 0.45) * 1.5;
        current = Math.max(10, Math.min(90, current + change));
        fill.style.width = current + '%';
        fill.closest('.faction-row')?.querySelector('.faction-score') &&
            (fill.closest('.faction-row').querySelector('.faction-score').textContent = current.toFixed(1) + '%');
    }, 4000);
});

// ========== SIEGE BAR UPDATES ==========
const siegeFills = document.querySelectorAll('.siege-fill');
siegeFills.forEach(fill => {
    let current = parseFloat(fill.style.width);
    setInterval(() => {
        const change = (Math.random() - 0.4) * 1;
        current = Math.max(5, Math.min(95, current + change));
        fill.style.width = current + '%';
    }, 3000);
});

// ========== CRAFT STATUS ROTATION ==========
const craftStatuses = document.querySelectorAll('.craft-status');
const craftStates = ['queued', 'crafting', 'done'];
let craftIndex = 0;
function rotateCraftStatus() {
    craftStatuses.forEach((status, i) => {
        const state = craftStates[(craftIndex + i) % craftStates.length];
        status.className = `craft-status ${state}`;
    });
    craftIndex++;
}
setInterval(rotateCraftStatus, 5000);

// ========== ALLIANCE STRENGTH TWINKLE ==========
const allianceStrengths = document.querySelectorAll('.alliance-strength');
allianceStrengths.forEach(strength => {
    let current = parseInt(strength.textContent.replace(/★/g, ''));
    setInterval(() => {
        if (Math.random() > 0.8) {
            current = Math.max(2, Math.min(5, current + (Math.random() > 0.5 ? 1 : -1)));
            strength.textContent = '★'.repeat(current) + '☆'.repeat(5 - current);
        }
    }, 6000);
});

// ========== MINI LOG AUTO-SCROLL ==========
const miniLog = document.querySelector('.mini-log');
if (miniLog) {
    const miniItems = [
        '🐉 Ignis Rex Phase 3 start',
        '⚔️ Arena match end — Dragonforge wins',
        '💰 Void Crystal 50k threshold',
        '🏴 Shadowfell outpost captured',
        '📜 Frozen Throne quest live',
        '🌊 Leviathan 12% HP',
        '🕷️ Spider Queen AoE warning',
        '🔥 Emberforge siege 78%',
        '💀 3 deaths Eye of Oblivion',
        '🏰 Ashenmoor assault 45%',
        '🧪 Elixir price drop -3.2%',
        '🌿 New zone mapped',
        '⚔️ Crimson Reach skirmish',
        '📦 Market volume spike',
        '🏆 Guild ranking shift',
        '🗡️ PvP hotzone detected',
        '🌀 Voidgate anomaly',
        '🛡️ Defense buff activated',
    ];
    let miniIndex = 0;
    function addMiniLog() {
        const div = document.createElement('div');
        div.className = 'mini-log-item';
        div.textContent = miniItems[miniIndex % miniItems.length];
        miniLog.insertBefore(div, miniLog.firstChild);
        if (miniLog.children.length > 15) miniLog.removeChild(miniLog.lastChild);
        miniIndex++;
    }
    setInterval(addMiniLog, 3000);
}

// ========== PANEL HEADER HOVER GLOW ==========
const panelHeaders = document.querySelectorAll('.panel-header');
panelHeaders.forEach(header => {
    header.addEventListener('mouseenter', () => {
        header.style.background = 'linear-gradient(90deg, rgba(30, 40, 60, 0.95), rgba(15, 20, 35, 0.8))';
    });
    header.addEventListener('mouseleave', () => {
        header.style.background = 'linear-gradient(90deg, rgba(20, 30, 50, 0.9), rgba(10, 15, 28, 0.7))';
    });
});

// ========== CHARACTER POWER DRIFT ==========
const charPowers = document.querySelectorAll('.char-power');
charPowers.forEach(power => {
    let current = parseFloat(power.textContent.replace(/[^0-9.]/g, ''));
    setInterval(() => {
        const change = (Math.random() - 0.5) * 0.02;
        current = Math.max(900, current + change * current);
        power.textContent = current >= 1000 ? current.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'K' : current.toFixed(0) + 'K';
    }, 5000);
});

// ========== INIT — STAGGERED REVEAL ==========
document.querySelectorAll('.panel').forEach((panel, i) => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(8px)';
    setTimeout(() => {
        panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
    }, 100 + i * 80);
});

console.log('⚔️ Realmwatch Dashboard initialized — all systems online');
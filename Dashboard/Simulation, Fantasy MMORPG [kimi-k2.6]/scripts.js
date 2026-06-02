// ════════════════════════════════════════
// ÆTHERNIA — Realm Command Nexus
// Master Control Script
// ════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    initializeTerritoryMap();
    initializeClocks();
    initializeTicker();
    initializeKillFeed();
    initializeSparklines();
    initializeSimulatedData();
    startGlobalTick();
});

// ─── Territory Hex Map Generation ───

function initializeTerritoryMap() {
    const mapContainer = document.getElementById('territory-map');
    if (!mapContainer) return;
    
    const hexGrid = [
        [null, 'veldora', 'veldora', 'contested', 'aethermoor', 'aethermoor', null],
        ['veldora', 'veldora', 'contested', 'unclaimed', 'aethermoor', 'aethermoor', 'aethermoor'],
        ['veldora', 'veldora', 'veldora', 'sylvareth', 'sylvareth', 'aethermoor', 'aethermoor'],
        ['veldora', 'ironhold', 'sylvareth', 'sylvareth', 'sylvareth', 'contested', 'nexara'],
        ['ironhold', 'ironhold', 'sylvareth', 'unclaimed', 'nexara', 'nexara', 'nexara'],
        [null, 'ironhold', 'contested', 'nexara', 'nexara', 'nexara', null],
        [null, null, 'nexara', 'nexara', 'contested', null, null]
    ];
    
    const provinceNames = {
        'veldora': 'V', 'aethermoor': 'A', 'sylvareth': 'S',
        'nexara': 'N', 'ironhold': 'I', 'unclaimed': '?', 'contested': '⚔'
    };
    
    hexGrid.forEach(row => {
        row.forEach(cell => {
            if (cell === null) {
                const spacer = document.createElement('div');
                spacer.style.visibility = 'hidden';
                mapContainer.appendChild(spacer);
                return;
            }
            const hex = document.createElement('div');
            hex.className = `hex-cell hex-${cell}`;
            hex.textContent = provinceNames[cell] || '?';
            hex.title = cell.charAt(0).toUpperCase() + cell.slice(1);
            mapContainer.appendChild(hex);
        });
    });
}

// ─── Clock & Timer Systems ───

function initializeClocks() {
    updateRealmTime();
    setInterval(updateRealmTime, 1000);
    
    const raidTimers = {
        'timer-cen': { hours: 5, minutes: 23, seconds: 17 },
        'timer-ssa': { hours: 2, minutes: 45, seconds: 33 },
        'timer-tss': { hours: 6, minutes: 12, seconds: 8 },
        'timer-vfk': { hours: 1, minutes: 33, seconds: 45 }
    };
    
    Object.entries(raidTimers).forEach(([id, time]) => {
        startRaidTimer(id, time);
    });
    
    const bossTimer = document.getElementById('boss-sera');
    if (bossTimer) {
        startCountdownTimer(bossTimer, 14 * 3600 + 23 * 60 + 7);
    }
}

function updateRealmTime() {
    const el = document.getElementById('realm-time');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function startRaidTimer(elementId, initialTime) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    let totalSeconds = initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds;
    
    setInterval(() => {
        totalSeconds--;
        if (totalSeconds < 0) totalSeconds = 86400;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

function startCountdownTimer(element, totalSeconds) {
    setInterval(() => {
        totalSeconds--;
        if (totalSeconds < 0) totalSeconds = 86400;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        element.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

// ─── News Ticker Enhancement ───

function initializeTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    
    const items = track.querySelectorAll('.ticker-item');
    const clonedItems = Array.from(items).map(item => item.cloneNode(true));
    clonedItems.forEach(clone => track.appendChild(clone));
}

// ─── Kill Feed Simulation ───

const killVerbs = [
    { text: '🔥 incinerated 🔥', type: 'pvp' },
    { text: '⚔️ slayed ⚔️', type: 'pve' },
    { text: '🗡️ backstabbed 🗡️', type: 'pvp' },
    { text: '👑 defeated 👑', type: 'pve' },
    { text: '🏹 headshot 🏹', type: 'pvp' },
    { text: '🐻 mauled 🐻', type: 'pve' },
    { text: '💀 reaped 💀', type: 'pvp' },
    { text: '⚡ zapped ⚡', type: 'pve' },
    { text: '🛡️ smote 🛡️', type: 'pvp' },
    { text: '🔥 burned 🔥', type: 'pve' }
];

const killerNames = [
    'Pyromancer_X', 'ShadowStep_Aria', 'TANK_LORD_99', 'SniperElite_Jin',
    'NECRO_KING_420', 'STORM_CALLER_GUILD', 'PALADIN_OF_LIGHT', 'ASHEN_CIRCLE_RAID',
    'Frost_Bite_Z', 'Blade_Master_Ken', 'Arcane_Trickster', 'Holy_Smiter_7'
];

const victimNames = [
    'Frost_Warden_Kael', 'HealBot_2000', 'Arcane_Master_Lee', 'Druid_Nature_Boy',
    'Ancient Lich Morvath', 'Yrrax the Unbound', 'Storm Wyrm Juvenile', 'Phoenix of Eternal Ash',
    'BONE_COLLECTOR_ALT', 'Void_Walker_Min', 'Shadow_Priest_Alt', 'Rogue_In_Training'
];

const locations = [
    'Veldora Border', 'Black Market Alley', 'Tower of Whispers', 'Sylvareth Edge',
    'Sunken Spire', 'Citadel Eternal Night', 'Aethermoor Depths', 'Holy Grounds',
    'Embermoor Caldera', 'Whispering Dunes', 'Ironhold Pass', 'Crystalmere Shore'
];

const lootItems = [
    '📜 Tome of Binding', '⚡ Scale of the Storm', '🔥 Heart of the Phoenix',
    '🐗 Tusk of the Alpha', '💎 Void Crystal Shard', '🗡️ Blade of Whispers'
];

function initializeKillFeed() {
    const feed = document.getElementById('kill-feed');
    if (!feed) return;
    
    setInterval(() => {
        if (Math.random() > 0.3) return;
        
        const verb = killVerbs[Math.floor(Math.random() * killVerbs.length)];
        const killer = killerNames[Math.floor(Math.random() * killerNames.length)];
        const victim = victimNames[Math.floor(Math.random() * victimNames.length)];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        
        const entry = document.createElement('div');
        entry.className = `kill-entry ${verb.type}`;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        let extraContent = '';
        if (verb.type === 'pvp') {
            const bounty = Math.floor(Math.random() * 5000) + 200;
            extraContent = `<span class="ke-bounty">+${bounty.toLocaleString()} 💰</span>`;
        } else {
            const loot = lootItems[Math.floor(Math.random() * lootItems.length)];
            extraContent = `<span class="ke-loot">${loot}</span>`;
        }
        
        const killerIcon = verb.type === 'pvp' ? '🔥' : '🛡️';
        const victimIcon = verb.type === 'pvp' ? '❄️' : '💀';
        
        entry.innerHTML = `
            <span class="ke-time">${timeStr}</span>
            <span class="ke-killer">${killerIcon} ${killer}</span>
            <span class="ke-action">${verb.text}</span>
            <span class="ke-victim">${victimIcon} ${victim}</span>
            <span class="ke-loc">@ ${loc}</span>
            ${extraContent}
        `;
        
        feed.insertBefore(entry, feed.firstChild);
        
        while (feed.children.length > 20) {
            feed.removeChild(feed.lastChild);
        }
    }, 2000);
}

// ─── Sparkline Generation ───

function initializeSparklines() {
    const sparkIds = [
        'spark-arcanite', 'spark-moonpetal', 'spark-thorium',
        'spark-voidcrystal', 'spark-aethermeat', 'spark-runescroll'
    ];
    
    sparkIds.forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;
        
        generateSparkline(container, id.includes('moonpetal') || id.includes('aethermeat') ? 'down' : 'up');
    });
}

function generateSparkline(container, trend) {
    const barCount = 12;
    const baseHeight = trend === 'up' ? 6 : 14;
    const variance = 8;
    
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'spark-bar';
        
        let height;
        if (trend === 'up') {
            height = baseHeight + (i / barCount) * variance + (Math.random() - 0.5) * 4;
        } else {
            height = baseHeight + ((barCount - i) / barCount) * variance + (Math.random() - 0.5) * 4;
        }
        
        height = Math.max(2, Math.min(16, height));
        bar.style.height = `${height}px`;
        
        const opacity = 0.3 + (height / 16) * 0.7;
        bar.style.opacity = opacity;
        
        container.appendChild(bar);
    }
    
    setInterval(() => {
        const bars = container.querySelectorAll('.spark-bar');
        bars.forEach((bar, i) => {
            let height;
            if (trend === 'up') {
                height = baseHeight + (i / barCount) * variance + (Math.random() - 0.5) * 6;
            } else {
                height = baseHeight + ((barCount - i) / barCount) * variance + (Math.random() - 0.5) * 6;
            }
            height = Math.max(2, Math.min(16, height));
            bar.style.height = `${height}px`;
            bar.style.opacity = 0.3 + (height / 16) * 0.7;
        });
    }, 3000);
}

// ─── Simulated Data Updates ───

function initializeSimulatedData() {
    updatePopulationCounter();
    setInterval(updatePopulationCounter, 5000);
    
    updateMarketPrices();
    setInterval(updateMarketPrices, 8000);
    
    updateSystemMessage();
    setInterval(updateSystemMessage, 15000);
}

function updatePopulationCounter() {
    const el = document.getElementById('active-players');
    if (!el) return;
    
    const base = 847293;
    const variation = Math.floor(Math.random() * 2000) - 500;
    const newVal = base + variation;
    el.textContent = newVal.toLocaleString();
}

function updateMarketPrices() {
    const tickerItems = document.querySelectorAll('.mt-item');
    tickerItems.forEach(item => {
        const priceEl = item.querySelector('.mti-price');
        const changeEl = item.querySelector('.mti-change');
        if (!priceEl || !changeEl) return;
        
        const currentPrice = parseFloat(priceEl.textContent.replace(',', ''));
        const change = (Math.random() - 0.4) * 5;
        const newPrice = Math.max(0.1, currentPrice * (1 + change / 100));
        
        priceEl.textContent = newPrice < 100 ? newPrice.toFixed(1) : Math.floor(newPrice).toLocaleString();
        
        const changePercent = change.toFixed(1);
        changeEl.textContent = `${change >= 0 ? '+' : ''}${changePercent}%`;
        changeEl.className = 'mti-change';
        
        if (change >= 0) {
            item.classList.remove('down');
            item.classList.add('up');
            changeEl.style.color = '#1eff00';
        } else {
            item.classList.remove('up');
            item.classList.add('down');
            changeEl.style.color = '#d45663';
        }
    });
}

const systemMessages = [
    'All systems nominal. Necrotic Blight containment protocols active in sectors 7, 12, 15.',
    'WARNING: Void energy spike detected in Nexara Wastes. Arcane dampeners engaged.',
    'INFO: Seasonal transition to Frostfall complete. Cold damage modifiers now active.',
    'ALERT: Phoenix migration pattern shifted. Embermoor Highlands hazard level elevated.',
    'STATUS: Cross-realm tournament instances scaling to meet demand. Queue times reduced.',
    'NOTICE: Thaumaturge Guild market manipulation flagged for review. Audit initiated.',
    'UPDATE: Stormhold Citadel repairs 78% complete. Full functionality expected in 2 days.',
    'CAUTION: Ancient Wyrm SERAPHOTHA tracking signal acquired. ETA to populated zones: 14 hours.'
];

function updateSystemMessage() {
    const el = document.getElementById('sys-message');
    if (!el) return;
    
    const msg = systemMessages[Math.floor(Math.random() * systemMessages.length)];
    el.style.opacity = '0';
    
    setTimeout(() => {
        el.textContent = msg;
        el.style.opacity = '1';
    }, 300);
}

// ─── Global Tick System ───

function startGlobalTick() {
    const seasonDial = document.getElementById('season-dial');
    let rotation = 315;
    
    setInterval(() => {
        rotation += 0.05;
        if (rotation >= 360) rotation = 0;
        
        if (seasonDial) {
            const marker = seasonDial.querySelector('.dial-marker');
            if (marker) {
                marker.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
            }
        }
    }, 100);
    
    animateBossDots();
    animateActiveTimers();
}

function animateBossDots() {
    setInterval(() => {
        const activeDots = document.querySelectorAll('.boss-dot.active');
        activeDots.forEach(dot => {
            const intensity = 0.4 + Math.random() * 0.6;
            dot.style.opacity = intensity;
        });
    }, 500);
}

function animateActiveTimers() {
    const timers = document.querySelectorAll('.ri-timer, .q-timer');
    timers.forEach(timer => {
        timer.style.transition = 'color 0.3s';
        setInterval(() => {
            const isWarning = timer.textContent && timer.textContent.startsWith('0');
            if (isWarning) {
                timer.style.color = '#ff0000';
            }
        }, 1000);
    });
}

// ─── Interactive Features ───

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelectorAll('.mkt-tab').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.mkt-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelectorAll('.pvp-tab').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.pvp-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelectorAll('.hex-cell').forEach(hex => {
    hex.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15)';
        this.style.zIndex = '10';
    });
    hex.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.zIndex = '1';
    });
});

document.querySelectorAll('.guild-row').forEach(row => {
    row.addEventListener('click', function() {
        document.querySelectorAll('.guild-row').forEach(r => r.style.background = '');
        this.style.background = 'rgba(201, 162, 39, 0.1)';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        location.reload();
    }
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        const ticker = document.querySelector('.news-ticker');
        if (ticker) ticker.scrollIntoView({ behavior: 'smooth' });
    }
});
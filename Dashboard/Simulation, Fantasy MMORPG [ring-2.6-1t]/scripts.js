// ═══════════════════════════════════════════════════════════════════════════════
// AETHERON REALMS — OMNISCIENT COMMAND NEXUS
// Main Application Script
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ───── DATA STORES ─────

    const guilds = [
        { rank: 1,  name: 'Celestial Pact',       faction: 'celestial', members: 487, rating: 2847, win: 312, loss: 43, kd: 4.82, ap: 9820, territory: 14, status: 'active' },
        { rank: 2,  name: 'Crimson Legion',        faction: 'crimson',   members: 465, rating: 2710, win: 298, loss: 57, kd: 4.31, ap: 9240, territory: 11, status: 'active' },
        { rank: 3,  name: 'Verdant Accord',        faction: 'verdant',   members: 432, rating: 2580, win: 271, loss: 62, kd: 3.95, ap: 8750, territory: 9,  status: 'active' },
        { rank: 4,  name: 'Shadow Covenant',       faction: 'shadow',    members: 410, rating: 2456, win: 245, loss: 78, kd: 3.41, ap: 8100, territory: 7,  status: 'atwar' },
        { rank: 5,  name: 'Silver Dawn',           faction: 'silver',    members: 398, rating: 2389, win: 233, loss: 81, kd: 3.21, ap: 7800, territory: 6,  status: 'active' },
        { rank: 6,  name: 'Ember Dominion',        faction: 'ember',     members: 375, rating: 2298, win: 218, loss: 89, kd: 2.98, ap: 7400, territory: 5,  status: 'active' },
        { rank: 7,  name: 'Stormbreakers',         faction: 'celestial', members: 356, rating: 2187, win: 198, loss: 95, kd: 2.65, ap: 6900, territory: 4,  status: 'neutral' },
        { rank: 8,  name: 'Iron Fang Clan',        faction: 'crimson',   members: 340, rating: 2102, win: 185, loss: 102, kd: 2.41, ap: 6300, territory: 3,  status: 'active' },
        { rank: 9,  name: 'Lunar Seraphim',        faction: 'silver',    members: 328, rating: 2045, win: 176, loss: 108, kd: 2.30, ap: 5900, territory: 3,  status: 'neutral' },
        { rank: 10, name: 'Obsidian Knights',      faction: 'shadow',    members: 312, rating: 1987, win: 162, loss: 118, kd: 2.11, ap: 5500, territory: 2,  status: 'atwar' },
        { rank: 11, name: 'Frostborne',            faction: 'celestial', members: 298, rating: 1910, win: 150, loss: 125, kd: 1.95, ap: 5100, territory: 2,  status: 'active' },
        { rank: 12, name: 'Blazing Sun Order',     faction: 'ember',     members: 285, rating: 1856, win: 143, loss: 130, kd: 1.82, ap: 4800, territory: 2,  status: 'neutral' },
        { rank: 13, name: 'Thornwall Sentinels',   faction: 'verdant',   members: 270, rating: 1789, win: 134, loss: 138, kd: 1.71, ap: 4400, territory: 1,  status: 'active' },
        { rank: 14, name: 'Nightshade Collective', faction: 'shadow',    members: 256, rating: 1723, win: 125, loss: 145, kd: 1.58, ap: 4000, territory: 1,  status: 'neutral' },
        { rank: 15, name: 'Drakemaw Brotherhood',  faction: 'crimson',   members: 240, rating: 1654, win: 117, loss: 152, kd: 1.42, ap: 3600, territory: 1,  status: 'atwar' },
    ];

    const territories = [
        'CA','CA','CR','CR','UN','SH','SH','EL','EL','CA','CR','UN',
        'CA','VE','CR','CR','UN','SH','EL','EL','CA','VE','VE','UN',
        'UN','VE','VE','VE','SI','SI','CR','UN','SH','EL','CA','UN',
        'UN','SI','SI','VE','SI','SH','SH','CR','UN','UN','EL','CA',
        'CA','EL','EL','SH','VE','SI','UN','UN','CR','CA','EL','SH',
        'UN','UN','SH','SH','CR','VE','SI','EL','CA','UN','UN','CR',
        'CA','CA','VE','EL','SH','UN','CR','SI','CA','VE','EL','SH',
        'UN','UN','UN','CA','CR','VE','SH','EL','SI','UN','UN','UN',
    ];

    const factions = {
        celestial: { label: 'Celestial Pact', emoji: '🔵' },
        crimson:   { label: 'Crimson Legion',  emoji: '🔴' },
        verdant:   { label: 'Verdant Accord',  emoji: '🟢' },
        ember:     { label: 'Ember Dominion',   emoji: '🟠' },
        shadow:    { label: 'Shadow Covenant',  emoji: '🟣' },
        silver:    { label: 'Silver Dawn',      emoji: '⚪' },
    };

    const dungeons = [
        { name: 'Crypt of the Forgotten',     icon: '💀',   level: '85-87', bosses: 4, status: 'completed',  difficulty: [1,1,1], loot: '🗡️ Soulrender' },
        { name: 'Tomb of the Serpent King',   icon: '🐍',   level: '87-89', bosses: 5, status: 'in-progress', difficulty: [1,1,0], loot: '🐍 Fang of Apep' },
        { name: 'The Molten Core',            icon: '🌋',   level: '90-92', bosses: 6, status: 'in-progress', difficulty: [1,1,1], loot: '🔥 Crown of Embers' },
        { name: 'Halls of the Stormborn',     icon: '⛈️',   level: '90-92', bosses: 4, status: 'completed',  difficulty: [1,1,1], loot: '⚡ Stormcaller' },
        { name: 'Frostspire Citadel',         icon: '🏔️',   level: '92-94', bosses: 5, status: 'available',  difficulty: [1,0,0], loot: '❄️ Glacial Aegis' },
        { name: 'The Obsidian Sanctum',       icon: '🐉',   level: '93-95', bosses: 7, status: 'in-progress', difficulty: [1,1,0], loot: '🐉 Wyrmplate' },
        { name: 'Grove of the Dreaming',      icon: '🌙',   level: '88-90', bosses: 4, status: 'completed',  difficulty: [1,1,1], loot: '🌿 Leaf of Ysera' },
        { name: 'Vault of the Void',          icon: '🕳️',   level: '94-96', bosses: 6, status: 'locked',     difficulty: [0,0,0], loot: '🕳️ Voidshard Amulet' },
        { name: 'Catacombs of Kael\'thar',    icon: '⚰️',   level: '82-85', bosses: 3, status: 'completed',  difficulty: [1,1,1], loot: '📖 Tome of Kael\'thar' },
        { name: 'Spire of the Archlich',      icon: '🧙',   level: '91-93', bosses: 5, status: 'available',  difficulty: [1,0,0], loot: '📜 Lichbone Grimoire' },
        { name: 'The Abyssal Rift',           icon: '🌀',   level: '95-97', bosses: 8, status: 'locked',     difficulty: [0,0,0], loot: '🌀 Abyssal Eye' },
        { name: 'Ruins of Zul\'Amanar',       icon: '🏛️',   level: '80-83', bosses: 3, status: 'completed',  difficulty: [1,1,1], loot: '🏛️ Idol of the Ancients' },
    ];

    const economyItems = [
        { icon: '💎', name: 'Prismatic Core',     price: '284g', change: '+340%', dir: 'up' },
        { icon: '🪙', name: 'Gold Ore',           price: '12g',  change: '+5%',   dir: 'up' },
        { icon: '⚗️', name: 'Elixir of Shadows',   price: '85g',  change: '+18%',  dir: 'up' },
        { icon: '🛡️', name: 'Titansteel Bar',      price: '42g',  change: '-3%',   dir: 'down' },
        { icon: '📜', name: 'Codex of Mastery',    price: '150g', change: '+8%',   dir: 'up' },
        { icon: '💎', name: 'Mithril Ore',         price: '6g',   change: '-12%',  dir: 'down' },
        { icon: '🔮', name: 'Aether Crystal',      price: '220g', change: '+22%',  dir: 'up' },
        { icon: '🧪', name: 'Flask of the Titans', price: '95g',  change: '+4%',   dir: 'up' },
        { icon: '🪶', name: 'Phoenix Feather',     price: '310g', change: '+67%',  dir: 'up' },
        { icon: '🔷', name: 'Raw Trueite',         price: '18g',  change: '-7%',   dir: 'down' },
        { icon: '🧬', name: 'Living Root',         price: '45g',  change: '+11%',  dir: 'up' },
        { icon: '⚙️', name: 'Goblin Gearbox',      price: '78g',  change: '+2%',   dir: 'up' },
    ];

    const worldEvents = [
        { icon: '🔴', desc: 'Netharion the Voidspawn raid in progress — 2.4M HP remaining', time: 'LIVE', timeClass: 'live' },
        { icon: '🌪️', desc: 'Season of Tempests — Lightning DMG +15% across all realms', time: 'Active', timeClass: 'live' },
        { icon: '🏰', desc: 'Siege of Thornwall — Crimson Legion vs Silver Dawn in 2h', time: '2h 14m', timeClass: 'soon' },
        { icon: '🌠', desc: 'Meteor Shower — Rare ore nodes spawning in Eastern Peaks', time: '2h 08m', timeClass: 'soon' },
        { icon: '🐉', desc: 'Dragon Migration — 3 Elder Wyrons over Frostspire Mts', time: '3h 45m', timeClass: 'soon' },
        { icon: '📜', desc: 'Codex of Primordials discovered by Archmage Lysara', time: '5h ago', timeClass: 'past' },
        { icon: '🎁', desc: 'Double XP Weekend — 6h 23m remaining', time: '6h 23m', timeClass: 'soon' },
        { icon: '👑', desc: 'King Varian\'s Tournament of Champions — Qualifiers begin', time: '8h', timeClass: 'soon' },
        { icon: '🌋', desc: 'Emberheart volcano eruption — Lava paths in Molten Core', time: '12h', timeClass: 'past' },
        { icon: '🎭', desc: 'Festival of Masks begins in Silvermoon City', time: '1d ago', timeClass: 'past' },
        { icon: '🛡️', desc: 'Alliance-Horde Armistice renewed for 30 more days', time: '2d ago', timeClass: 'past' },
        { icon: '⚡', desc: 'Thunderfury, Blessed Blade drops in Molten Core', time: '3d ago', timeClass: 'past' },
    ];

    const wars = [
        { name: 'War of the Obsidian Crown',     type: 'siege',     opponents: 'Celestial vs Shadow', progress: 68, direction: 'advancing', status: 'active' },
        { name: 'Thornwall Territorial Dispute', type: 'territory', opponents: 'Crimson vs Silver',   progress: 45, direction: 'stalemate', status: 'active' },
        { name: 'The Verdant Campaign',          type: 'guild',     opponents: 'Verdant vs Ember',    progress: 82, direction: 'advancing', status: 'active' },
        { name: 'Siege of Dun Modr',             type: 'siege',     opponents: 'All vs Shadow',       progress: 31, direction: 'retreating',status: 'paused' },
        { name: 'Emberheart Border Skirmish',    type: 'skirmish',  opponents: 'Ember vs Crimson',    progress: 55, direction: 'stalemate', status: 'active' },
        { name: 'The Frozen Frontier',           type: 'territory', opponents: 'Silver vs Celestial', progress: 12, direction: 'advancing', status: 'active' },
        { name: 'Nightfall Offensive',           type: 'guild',     opponents: 'Shadow vs All',       progress: 7,  direction: 'retreating',status: 'cooldown' },
    ];

    const newsItems = [
        { text: 'Patch 4.7.2: New raid "Vault of the Void" opens this Thursday',          tag: 'patch' },
        { text: 'Balance: Mage Frost Nova cooldown reduced from 30s to 24s',              tag: 'balance' },
        { text: 'Community Spotlight: Celestial Pact speedruns Molten Core in 12m 34s',   tag: 'event' },
        { text: 'Hotfix: Fixed duplication exploit with Prismatic Core crafting',         tag: 'hotfix' },
        { text: 'Season 7 Battle Pass now available — 100 levels of rewards',             tag: 'event' },
        { text: 'New mount "Void Serpent" added to Shadow Covenant reputation rewards',   tag: 'patch' },
        { text: 'Economy: Auction House transaction fees reduced by 1%',                  tag: 'balance' },
        { text: 'Event: Goblin Racing League starts next week on Stormveil',              tag: 'event' },
    ];

    // ───── UTILITY FUNCTIONS ─────

    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }

    function pad(n) { return n < 10 ? '0' + n : n; }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ───── LIVE CLOCK ─────

    function updateClock() {
        const now = new Date();
        const h = pad(now.getUTCHours());
        const m = pad(now.getUTCMinutes());
        const s = pad(now.getUTCSeconds());
        const el = $('#live-clock');
        if (el) el.textContent = '🕐 ' + h + ':' + m + ':' + s;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // ───── TERRITORY MAP ─────

    function renderMap() {
        const container = $('#territory-map');
        if (!container) return;
        container.innerHTML = '';
        territories.forEach((t, i) => {
            const cell = document.createElement('div');
            cell.className = 'map-cell ' + t.toLowerCase();
            // Generate small territory IDs
            const id = String.fromCharCode(65 + (i % 12)) + (Math.floor(i / 12) + 1);
            cell.textContent = id;
            cell.title = factions[t.toLowerCase()]?.label + ' — Sector ' + id;
            container.appendChild(cell);
        });
    }

    // ───── GUILD RANKINGS ─────

    function renderGuildRankings() {
        const tbody = $('#guild-rankings-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        guilds.forEach(g => {
            const factionClass = 'faction-' + g.faction;
            const statusClass = 'status-' + g.status;
            const rankClass = g.rank <= 3 ? 'guild-rank-' + g.rank : '';
            const kd = (g.win / (g.loss || 1)).toFixed(2);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="${rankClass}">${g.rank <= 3 ? ['👑','🥈','🥉'][g.rank-1] : g.rank}</td>
                <td style="font-weight:700">${g.name}</td>
                <td class="${factionClass}">${factions[g.faction].emoji}</td>
                <td>${g.members}</td>
                <td class="rating-cell">${g.rating}</td>
                <td>${g.win}/${g.loss}</td>
                <td>${kd}</td>
                <td>${g.ap.toLocaleString()}</td>
                <td class="territory-cell">🏰×${g.territory}</td>
                <td class="${statusClass}">${g.status === 'active' ? '🟢' : g.status === 'atwar' ? '🔴' : '🟡'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ───── DUNGEON RAID TRACKER ─────

    function renderDungeons() {
        const container = $('#raid-tracker');
        if (!container) return;
        container.innerHTML = '';
        dungeons.forEach(d => {
            const card = document.createElement('div');
            card.className = 'raid-card ' + d.status;
            const diffDots = d.difficulty.map(c => `<span class="diff-dot ${c ? 'cleared' : ''}"></span>`).join('');
            card.innerHTML = `
                <div class="raid-icon">${d.icon}</div>
                <div class="raid-name">${d.name}</div>
                <div class="raid-level">⬡ ${d.level} (${d.bosses} bosses)</div>
                <div class="raid-difficulty">${diffDots}</div>
                <div class="raid-status">${d.status === 'in-progress' ? '⚔️ In Progress' : d.status === 'completed' ? '✅ Cleared' : d.status === 'locked' ? '🔒 Locked' : '🟢 Available'}</div>
                <div class="raid-rewards">${d.loot}</div>
            `;
            container.appendChild(card);
        });
    }

    // ───── ECONOMY TABLE ─────

    function renderEconomy() {
        const container = $('#economy-table');
        if (!container) return;
        container.innerHTML = '';
        economyItems.forEach(e => {
            const item = document.createElement('div');
            item.className = 'econ-item';
            item.innerHTML = `
                <div class="econ-item-icon">${e.icon}</div>
                <div class="econ-item-name">${e.name}</div>
                <div class="econ-item-price">${e.price}</div>
                <div class="econ-item-change ${e.dir}">${e.change}</div>
            `;
            container.appendChild(item);
        });
    }

    // ───── WORLD EVENTS TIMELINE ─────

    function renderEvents() {
        const container = $('#events-timeline');
        if (!container) return;
        container.innerHTML = '';
        worldEvents.forEach(e => {
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <div class="event-icon">${e.icon}</div>
                <div class="event-desc">${e.desc}</div>
                <div class="event-time ${e.timeClass}">${e.time}</div>
            `;
            container.appendChild(item);
        });
    }

    // ───── WARS LIST ─────

    function renderWars() {
        const container = $('#wars-list');
        if (!container) return;
        container.innerHTML = '';
        wars.forEach(w => {
            const item = document.createElement('div');
            item.className = 'war-item';
            item.innerHTML = `
                <div>
                    <div class="war-name">${w.name}</div>
                    <div class="war-opponents">${w.opponents}</div>
                    <div class="war-progress">
                        <div class="war-progress-fill ${w.direction}" style="width:${w.progress}%"></div>
                    </div>
                </div>
                <span class="war-type ${w.type}">${w.type.toUpperCase()}</span>
                <span class="war-progress-text" style="font-size:0.72rem;color:var(--text-dim)">${w.progress}%</span>
                <span class="war-status ${w.status}">${w.status.toUpperCase()}</span>
            `;
            container.appendChild(item);
        });
    }

    // ───── NEWS TICKER ─────

    function renderNews() {
        const container = $('#news-ticker');
        if (!container) return;
        container.innerHTML = '';
        newsItems.forEach(n => {
            const item = document.createElement('div');
            item.className = 'news-item';
            item.innerHTML = `
                <span class="news-bullet">▸</span>
                <span class="news-text">${n.text}</span>
                <span class="news-tag ${n.tag}">${n.tag.toUpperCase()}</span>
            `;
            container.appendChild(item);
        });
    }

    // ───── SIMULATED LIVE UPDATES ─────

    function simulateLiveUpdates() {
        // Randomly tweak player count
        const playerCountEl = document.querySelector('.player-count');
        if (playerCountEl) {
            const base = 84732;
            const variation = randomBetween(-200, 200);
            playerCountEl.textContent = '👥 ' + (base + variation).toLocaleString() + ' Online';
        }

        // Randomly tweak boss HP
        const timerHPs = document.querySelectorAll('.timer-hp');
        timerHPs.forEach(hpEl => {
            const match = hpEl.textContent.match(/(\d+)M \/ (\d+)M \((\d+)%\)/);
            if (match) {
                let current = parseInt(match[1]);
                const total = parseInt(match[2]);
                current += randomBetween(-50000, 30000);
                current = Math.max(0, Math.min(current, total));
                const pct = Math.round((current / total) * 100);
                const color = pct > 50 ? '#76ff03' : pct > 25 ? '#ffab40' : '#f44336';
                hpEl.innerHTML = `HP: <span style="color:${color}">${(current/1000000).toFixed(1)}M / ${(total/1000000).toFixed(0)}M (${pct}%)</span>`;
            }
        });

        // Flash metric cards occasionally
        const metricCards = document.querySelectorAll('.metric-card');
        const randomCard = metricCards[randomBetween(0, metricCards.length - 1)];
        if (randomCard) {
            randomCard.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3)';
            setTimeout(() => { randomCard.style.boxShadow = ''; }, 1500);
        }
    }

    // Run live updates every 4 seconds
    setInterval(simulateLiveUpdates, 4000);

    // ───── INITIALIZE ─────

    function init() {
        renderMap();
        renderGuildRankings();
        renderDungeons();
        renderEconomy();
        renderEvents();
        renderWars();
        renderNews();

        // Stagger fade-in for panels
        const panels = document.querySelectorAll('.panel');
        panels.forEach((panel, i) => {
            panel.style.animationDelay = (0.05 + i * 0.03) + 's';
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
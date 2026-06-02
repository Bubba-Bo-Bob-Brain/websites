/* ═══════════════════════════════════════════════════════════════════
   AETHORIA WORLD COMMAND CONSOLE — Dynamic Systems Engine
   Real-time Data Simulation & Interactive Features
   ═══════════════════════════════════════════════════════════════════ */

// ─── CONFIGURATION & CONSTANTS ────────────────────────────────────
const CONFIG = {
    UPDATE_INTERVALS: {
        WORLD_CLOCK: 1000,
        PLAYER_COUNTS: 3000,
        MARKET: 5000,
        ACTIVITY_LOG: 2000,
        WEATHER: 10000,
        SERVER_STATS: 4000,
        MAP: 8000
    },
    SIMULATED_DATA: {
        PLAYER_COUNT_MIN: 14000,
        PLAYER_COUNT_MAX: 16000,
        GUILDS_ACTIVE_MIN: 2200,
        GUILDS_ACTIVE_MAX: 2500,
        ACTIVE_COMBATS_MIN: 700,
        ACTIVE_COMBATS_MAX: 1000,
        AUCTION_COUNT_MIN: 14000,
        AUCTION_COUNT_MAX: 16000
    }
};

// ─── DATA STORES ───────────────────────────────────────────────────
const DataStore = {
    worldTime: {
        day: 1847,
        hour: 14,
        minute: 32,
        second: 7,
        season: 'winter',
        seasonDay: 31,
        seasonLength: 90,
        moonPhase: 11,
        moonCycle: 29,
        moonPhaseNames: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                         'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']
    },
    
    players: {
        online: 14847,
        guildsActive: 2341,
        activeCombats: 847
    },
    
    guilds: [
        { rank: 1, name: 'Order of the Eternal Flame', tag: 'OTEF', members: 500, power: 12847291, alliance: 'Valorheim Alliance', fortress: 3, realm: 'Alpha' },
        { rank: 2, name: 'Void Walkers', tag: 'VOID', members: 498, power: 11472847, alliance: 'Shadowmere Pact', fortress: 2, realm: 'Alpha' },
        { rank: 3, name: 'Team Eclipse', tag: 'ECLP', members: 495, power: 10984721, alliance: 'None', fortress: 4, realm: 'Beta' },
        { rank: 4, name: 'Storm Syndicate', tag: 'STORM', members: 487, power: 10247893, alliance: 'Azure Coalition', fortress: 2, realm: 'Alpha' },
        { rank: 5, name: 'Iron Vanguard', tag: 'IRON', members: 476, power: 9847291, alliance: 'Ironforge Pact', fortress: 1, realm: 'Gamma' },
        { rank: 6, name: 'Crimson Dawn', tag: 'DAWN', members: 465, power: 9247813, alliance: 'None', fortress: 0, realm: 'Beta' },
        { rank: 7, name: 'Nature\'s Wrath', tag: 'NWRA', members: 453, power: 8747291, alliance: 'Emerald Concordance', fortress: 1, realm: 'Alpha' },
        { rank: 8, name: 'Arcane Brotherhood', tag: 'ARCB', members: 442, power: 8247813, alliance: 'None', fortress: 0, realm: 'Gamma' },
        { rank: 9, name: 'Dragon Riders', tag: 'DRAG', members: 431, power: 7847291, alliance: 'Valorheim Alliance', fortress: 2, realm: 'Beta' },
        { rank: 10, name: 'Shadow Assassins', tag: 'SHAD', members: 420, power: 7247813, alliance: 'Shadowmere Pact', fortress: 1, realm: 'Alpha' },
        { rank: 11, name: 'Holy Paladins', tag: 'HOLY', members: 409, power: 6847291, alliance: 'Holy Sanctum Empire', fortress: 3, realm: 'Gamma' },
        { rank: 12, name: 'Tidal Guardians', tag: 'TIDE', members: 398, power: 6247813, alliance: 'Azure Coalition', fortress: 1, realm: 'Beta' },
        { rank: 13, name: 'Flame Legion', tag: 'FLME', members: 387, power: 5847291, alliance: 'None', fortress: 0, realm: 'Alpha' },
        { rank: 14, name: 'Frost Wolves', tag: 'FROZ', members: 376, power: 5247813, alliance: 'Ironforge Pact', fortress: 2, realm: 'Gamma' },
        { rank: 15, name: 'Sylvan Watch', tag: 'SYLV', members: 365, power: 4847291, alliance: 'Emerald Concordance', fortress: 1, realm: 'Beta' }
    ],
    
    pvpLeaderboard: [
        { rank: 1, name: 'Valorian Stormweaver', class: 'Archmage', rating: 3421, wl: '847/124', winpct: 87.2, streak: 24 },
        { rank: 2, name: 'Kael\'thas Sunstrider', class: 'Pyromancer', rating: 3384, wl: '792/141', winpct: 84.9, streak: 18 },
        { rank: 3, name: 'Sylvanas Windrunner', class: 'Ranger', rating: 3312, wl: '814/167', winpct: 83.0, streak: 12 },
        { rank: 4, name: 'Arthas Menethil', class: 'Death Knight', rating: 3287, wl: '756/178', winpct: 81.0, streak: 9 },
        { rank: 5, name: 'Jaina Proudmoore', class: 'Cryomancer', rating: 3245, wl: '723/189', winpct: 79.3, streak: 7 },
        { rank: 6, name: 'Illidan Stormrage', class: 'Demon Hunter', rating: 3198, wl: '698/201', winpct: 77.6, streak: 5 },
        { rank: 7, name: 'Tyrande Whisperwind', class: 'Priestess', rating: 3156, wl: '678/212', winpct: 76.2, streak: 4 },
        { rank: 8, name: 'Gul\'dan', class: 'Warlock', rating: 3124, wl: '654/223', winpct: 74.6, streak: 3 },
        { rank: 9, name: 'Uther Lightbringer', class: 'Paladin', rating: 3087, wl: '632/234', winpct: 73.1, streak: 2 },
        { rank: 10, name: 'Khadgar', class: 'Arcanist', rating: 3045, wl: '612/245', winpct: 71.4, streak: 1 }
    ],
    
    activityLog: [],
    friendsList: [],
    mailList: [],
    raidTeam: [],
    auctionItems: [],
    worldMapMarkers: [],
    marketData: {
        indices: [
            { name: 'Aethoria Composite Index', value: 284729.47, change: 1247.82, pctChange: 0.44 },
            { name: 'Materials Index', value: 47291.03, change: -847.21, pctChange: -1.76 },
            { name: 'Equipment Index', value: 192847.66, change: 3847.44, pctChange: 2.04 },
            { name: 'Consumables Index', value: 38471.89, change: 567.12, pctChange: 1.49 }
        ],
        hotItems: [
            { name: 'Void-Forged Greatsword', price: 24847, change: 18.2, volume: 847 },
            { name: 'Elixir of Ascension', price: 4291, change: 34.7, volume: 12847 },
            { name: 'Tome of Forbidden Knowledge', price: 18293, change: -5.4, volume: 234 },
            { name: 'Prismatic Diamond', price: 8847, change: 7.8, volume: 3471 },
            { name: 'Aegis of the Fallen King', price: 42100, change: 2.1, volume: 12 },
            { name: 'Spirit Stalker Mount', price: 156000, change: 84.2, volume: 3 }
        ]
    }
};

// ─── UTILITY FUNCTIONS ─────────────────────────────────────────────
const Utils = {
    formatNumber: (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    },
    
    formatCurrency: (num, currency = 'GP') => {
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M ' + currency;
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K ' + currency;
        return num.toLocaleString() + ' ' + currency;
    },
    
    formatTime: (hours, minutes, seconds) => {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomFloat: (min, max, decimals = 2) => {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    },
    
    randomChoice: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    generatePlayerName: () => {
        const prefixes = ['Valorian', 'Kael', 'Sylvanas', 'Arthas', 'Jaina', 'Illidan', 'Tyrande', 'Gul', 'Uther', 'Khadgar', 'Malfurion', 'Thrall', 'Vol', 'Baine', 'Lor'];
        const suffixes = ['Stormweaver', 'Sunstrider', 'Windrunner', 'Menethil', 'Proudmoore', 'Stormrage', 'Whisperwind', 'dan', 'Lightbringer', 'the Wanderer', 'Darkblade', 'Fireheart', 'Ironforge', 'Thunderhoof', 'Shadowstep'];
        return Utils.randomChoice(prefixes) + ' ' + Utils.randomChoice(suffixes);
    },
    
    generateItemName: () => {
        const adjectives = ['Void', 'Shadow', 'Flame', 'Frost', 'Storm', 'Arcane', 'Holy', 'Iron', 'Golden', 'Cursed', 'Blessed', 'Ancient', 'Mythic', 'Legendary', 'Celestial'];
        const nouns = ['Blade', 'Staff', 'Helm', 'Chestplate', 'Gauntlets', 'Boots', 'Ring', 'Amulet', 'Cloak', 'Shield', 'Bow', 'Dagger', 'Sword', 'Axe', 'Mace'];
        const suffixes = ['of Power', 'of the Ancients', 'of Shadows', 'of Light', 'of the Void', 'of Thunder', 'of Frost', 'of Fire', 'of Earth', 'of Wind'];
        return `${Utils.randomChoice(adjectives)} ${Utils.randomChoice(nouns)} ${Utils.randomChoice(suffixes)}`;
    },
    
    getMoonPhaseEmoji: (day, cycle) => {
        const phase = (day / cycle) * 8;
        const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
        return emojis[Math.floor(phase) % 8];
    },
    
    getMoonPhaseName: (day, cycle) => {
        const phase = (day / cycle) * 8;
        const index = Math.floor(phase) % 8;
        return DataStore.worldTime.moonPhaseNames[index];
    }
};

// ─── WORLD CLOCK SYSTEM ────────────────────────────────────────────
const WorldClock = {
    init: function() {
        this.update();
        setInterval(() => this.update(), CONFIG.UPDATE_INTERVALS.WORLD_CLOCK);
    },
    
    update: function() {
        // Advance time
        DataStore.worldTime.second++;
        if (DataStore.worldTime.second >= 60) {
            DataStore.worldTime.second = 0;
            DataStore.worldTime.minute++;
            if (DataStore.worldTime.minute >= 60) {
                DataStore.worldTime.minute = 0;
                DataStore.worldTime.hour++;
                if (DataStore.worldTime.hour >= 24) {
                    DataStore.worldTime.hour = 0;
                    DataStore.worldTime.day++;
                    DataStore.worldTime.seasonDay++;
                    
                    // Season change
                    if (DataStore.worldTime.seasonDay >= DataStore.worldTime.seasonLength) {
                        DataStore.worldTime.seasonDay = 1;
                        const seasons = ['spring', 'summer', 'autumn', 'winter'];
                        const currentIndex = seasons.indexOf(DataStore.worldTime.season);
                        DataStore.worldTime.season = seasons[(currentIndex + 1) % 4];
                    }
                }
            }
        }
        
        // Update moon phase (simplified)
        DataStore.worldTime.moonPhase = (DataStore.worldTime.day % DataStore.worldTime.moonCycle) + 1;
        
        this.render();
    },
    
    render: function() {
        const { day, hour, minute, second, season, seasonDay, moonPhase } = DataStore.worldTime;
        
        // Update season display
        const seasonEmojis = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
        const seasonNames = { spring: 'SPRING', summer: 'SUMMER', autumn: 'AUTUMN', winter: 'WINTER' };
        const seasonElement = document.getElementById('worldSeason');
        if (seasonElement) {
            seasonElement.textContent = `${seasonEmojis[season]} ${seasonNames[season]} — ${season.toUpperCase()} Epoch`;
        }
        
        // Update world time
        const timeElement = document.getElementById('worldTime');
        if (timeElement) {
            timeElement.textContent = `Day ${day.toLocaleString()} — ${Utils.formatTime(hour, minute, second)}`;
        }
        
        // Update day/night cycle
        const cycleElement = document.getElementById('worldCycle');
        if (cycleElement) {
            const isNight = hour >= 20 || hour < 6;
            const phase = isNight ? '🌙 Night Phase' : '☀️ Day Phase';
            const hoursRemaining = isNight ? (24 - hour + 6) : (20 - hour);
            cycleElement.textContent = `${phase} (${hoursRemaining}h remaining)`;
        }
        
        // Update moon phase
        const moonIcon = document.getElementById('moonIcon');
        if (moonIcon) {
            moonIcon.textContent = Utils.getMoonPhaseEmoji(moonPhase, DataStore.worldTime.moonCycle);
        }
        
        // Update system time in footer
        const systemTime = document.getElementById('systemTime');
        if (systemTime) {
            systemTime.textContent = Utils.formatTime(hour, minute, second);
        }
        
        // Update season progress
        this.updateSeasonProgress();
    },
    
    updateSeasonProgress: function() {
        const seasonProgressFill = document.querySelector('.season-progress__fill');
        const seasonProgressText = document.querySelector('.season-progress span:last-child');
        
        if (seasonProgressFill && seasonProgressText) {
            const { seasonDay, seasonLength, season } = DataStore.worldTime;
            const progress = (seasonDay / seasonLength) * 100;
            seasonProgressFill.style.width = `${progress}%`;
            seasonProgressText.textContent = `Day ${seasonDay} / ${seasonLength} — ${progress.toFixed(1)}% through ${season}`;
        }
    }
};

// ─── PLAYER COUNT SYSTEM ───────────────────────────────────────────
const PlayerCounts = {
    init: function() {
        this.update();
        setInterval(() => this.update(), CONFIG.UPDATE_INTERVALS.PLAYER_COUNTS);
    },
    
    update: function() {
        // Simulate player fluctuations
        DataStore.players.online = Utils.randomInt(
            CONFIG.SIMULATED_DATA.PLAYER_COUNT_MIN, 
            CONFIG.SIMULATED_DATA.PLAYER_COUNT_MAX
        );
        DataStore.players.guildsActive = Utils.randomInt(
            CONFIG.SIMULATED_DATA.GUILDS_ACTIVE_MIN, 
            CONFIG.SIMULATED_DATA.GUILDS_ACTIVE_MAX
        );
        DataStore.players.activeCombats = Utils.randomInt(
            CONFIG.SIMULATED_DATA.ACTIVE_COMBATS_MIN, 
            CONFIG.SIMULATED_DATA.ACTIVE_COMBATS_MAX
        );
        
        this.render();
    },
    
    render: function() {
        const playersOnline = document.getElementById('playersOnline');
        const guildsActive = document.getElementById('guildsActive');
        const activeCombats = document.getElementById('activeCombats');
        
        if (playersOnline) playersOnline.textContent = DataStore.players.online.toLocaleString();
        if (guildsActive) guildsActive.textContent = DataStore.players.guildsActive.toLocaleString();
        if (activeCombats) activeCombats.textContent = DataStore.players.activeCombats.toLocaleString();
    }
};

// ─── GUILD TABLE SYSTEM ────────────────────────────────────────────
const GuildTable = {
    init: function() {
        this.render();
    },
    
    render: function() {
        const tbody = document.getElementById('guildTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        DataStore.guilds.forEach(guild => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank-${guild.rank}">${guild.rank}</td>
                <td>${guild.name} <span style="color:var(--text-muted)">[${guild.tag}]</span></td>
                <td>${guild.fortress}</td>
                <td>${guild.members}</td>
                <td>${Utils.formatNumber(guild.power)}</td>
                <td style="color:var(--text-muted)">${guild.alliance}</td>
                <td>${guild.fortress > 0 ? '🏰' : '🏠'}</td>
                <td style="color:var(--text-muted)">${guild.realm}</td>
            `;
            tbody.appendChild(row);
        });
    }
};

// ─── PVP LEADERBOARD SYSTEM ────────────────────────────────────────
const PVPLeaderboard = {
    init: function() {
        this.render();
    },
    
    render: function() {
        const tbody = document.getElementById('pvpTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        DataStore.pvpLeaderboard.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank-${player.rank}">${player.rank}</td>
                <td>${player.name}</td>
                <td style="color:var(--amethyst)">${player.class}</td>
                <td style="color:var(--gold);font-weight:600">${player.rating}</td>
                <td style="color:var(--text-muted)">${player.wl}</td>
                <td style="color:${player.winpct > 80 ? 'var(--emerald)' : player.winpct > 70 ? 'var(--gold)' : 'var(--text-secondary)'}">${player.winpct}%</td>
                <td style="color:${player.streak >= 10 ? 'var(--gold)' : player.streak >= 5 ? 'var(--emerald)' : 'var(--text-secondary)'}">
                    ${player.streak >= 10 ? '🔥' : ''}${player.streak}
                </td>
            `;
            tbody.appendChild(row);
        });
    }
};

// ─── ACTIVITY LOG SYSTEM ───────────────────────────────────────────
const ActivityLog = {
    types: ['loot', 'pvp', 'pve', 'economy', 'system', 'guild'],
    locations: ['Shadowmere', 'Valorheim', 'Emberpeak', 'Frostpeak', 'Emerald Forest', 'Crimson Wastes', 'Azure Coast', 'Holy Sanctum'],
    
    init: function() {
        // Generate initial log entries
        for (let i = 0; i < 20; i++) {
            this.addEntry();
        }
        this.render();
        
        // Add new entries periodically
        setInterval(() => {
            this.addEntry();
            this.render();
        }, CONFIG.UPDATE_INTERVALS.ACTIVITY_LOG);
    },
    
    addEntry: function() {
        const type = Utils.randomChoice(this.types);
        const player = Utils.generatePlayerName();
        const location = Utils.randomChoice(this.locations);
        const item = Utils.generateItemName();
        const time = Utils.formatTime(
            DataStore.worldTime.hour,
            DataStore.worldTime.minute,
            DataStore.worldTime.second
        );
        
        let message = '';
        let logClass = '';
        
        switch(type) {
            case 'loot':
                const lootActions = ['obtained', 'looted', 'received', 'found'];
                message = `<span class="player">${player}</span> ${Utils.randomChoice(lootActions)} <span class="item">${item}</span> in <span class="location">${location}</span>`;
                logClass = 'log-type--loot';
                break;
            case 'pvp':
                const pvpActions = ['defeated', 'slain by', 'honorably defeated', 'crushed'];
                const opponent = Utils.generatePlayerName();
                message = `<span class="player">${player}</span> ${Utils.randomChoice(pvpActions)} <span class="player">${opponent}</span> in ${location}`;
                logClass = 'log-type--pvp';
                break;
            case 'pve':
                const pveActions = ['slain', 'killed', 'vanquished', 'destroyed'];
                const mobs = ['Void Terror', 'Shadow Drake', 'Flame Elemental', 'Ice Golem', 'Dark Knight', 'Feral Wolf', 'Ancient Treant'];
                message = `<span class="player">${player}</span> ${Utils.randomChoice(pveActions)} a <span class="item">${Utils.randomChoice(mobs)}</span> in <span class="location">${location}</span>`;
                logClass = 'log-type--pve';
                break;
            case 'economy':
                const ecoActions = ['sold', 'purchased', 'traded', 'auctioned'];
                const prices = [Utils.randomInt(100, 10000), Utils.randomInt(10000, 100000)];
                message = `<span class="player">${player}</span> ${Utils.randomChoice(ecoActions)} <span class="item">${item}</span> for ${Utils.formatNumber(Utils.randomChoice(prices))} GP`;
                logClass = 'log-type--economy';
                break;
            case 'system':
                const systemMessages = [
                    'Server maintenance scheduled for next week',
                    'Double XP weekend has begun!',
                    'New content patch v4.2.2 deployed',
                    'World boss Krathos has spawned!',
                    'Seasonal event: Festival of Frost now active',
                    'Arena season 14 has started'
                ];
                message = Utils.randomChoice(systemMessages);
                logClass = 'log-type--system';
                break;
            case 'guild':
                const guildNames = DataStore.guilds.map(g => g.name);
                const guildActions = ['has recruited a new member', 'has conquered a fortress', 'has completed a raid', 'has won a guild battle'];
                message = `<span class="player">${Utils.randomChoice(guildNames)}</span> ${Utils.randomChoice(guildActions)}`;
                logClass = 'log-type--guild';
                break;
        }
        
        DataStore.activityLog.unshift({
            time,
            type,
            message,
            logClass
        });
        
        // Keep only last 50 entries
        if (DataStore.activityLog.length > 50) {
            DataStore.activityLog.pop();
        }
    },
    
    render: function() {
        const container = document.getElementById('activityLog');
        if (!container) return;
        
        container.innerHTML = '';
        
        DataStore.activityLog.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <span class="log-time">${entry.time}</span>
                <span class="log-type ${entry.logClass}">${entry.type.toUpperCase()}</span>
                <span class="log-message">${entry.message}</span>
            `;
            container.appendChild(logEntry);
        });
    }
};

// ─── MARKET SYSTEM ─────────────────────────────────────────────────
const MarketSystem = {
    init: function() {
        this.update();
        setInterval(() => this.update(), CONFIG.UPDATE_INTERVALS.MARKET);
    },
    
    update: function() {
        // Simulate market fluctuations
        DataStore.marketData.indices.forEach(index => {
            const change = Utils.randomFloat(-500, 500);
            index.value += change;
            index.change = change;
            index.pctChange = (change / index.value) * 100;
        });
        
        DataStore.marketData.hotItems.forEach(item => {
            item.change = Utils.randomFloat(-20, 20);
            item.volume = Utils.randomInt(item.volume * 0.9, item.volume * 1.1);
        });
        
        // Update auction count
        const auctionCount = document.getElementById('auctionCount');
        if (auctionCount) {
            const count = Utils.randomInt(
                CONFIG.SIMULATED_DATA.AUCTION_COUNT_MIN,
                CONFIG.SIMULATED_DATA.AUCTION_COUNT_MAX
            );
            auctionCount.textContent = `${count.toLocaleString()} Active`;
        }
        
        this.renderIndices();
        this.renderHotItems();
    },
    
    renderIndices: function() {
        const indicesContainer = document.querySelector('.market-indices');
        if (!indicesContainer) return;
        
        indicesContainer.innerHTML = '';
        
        DataStore.marketData.indices.forEach(index => {
            const changeClass = index.change >= 0 ? 'currency--up' : 'currency--down';
            const changeSymbol = index.change >= 0 ? '▲' : '▼';
            
            const indexElement = document.createElement('div');
            indexElement.className = 'market-index';
            indexElement.innerHTML = `
                <span class="market-index__name">${index.name}</span>
                <span class="market-index__value">${index.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span class="market-index__change ${changeClass}">
                    ${changeSymbol} ${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)} (${index.pctChange >= 0 ? '+' : ''}${index.pctChange.toFixed(2)}%)
                </span>
            `;
            indicesContainer.appendChild(indexElement);
        });
    },
    
    renderHotItems: function() {
        const itemsContainer = document.querySelector('.market-items');
        if (!itemsContainer) return;
        
        itemsContainer.innerHTML = '';
        
        DataStore.marketData.hotItems.forEach(item => {
            const changeClass = item.change >= 0 ? 'currency--up' : 'currency--down';
            const changeSymbol = item.change >= 0 ? '▲' : '▼';
            
            const itemElement = document.createElement('div');
            itemElement.className = 'market-item';
            itemElement.innerHTML = `
                <span class="market-item__icon">⚔️</span>
                <span class="market-item__name">${item.name}</span>
                <span class="market-item__price">💎 ${item.price.toLocaleString()} PP</span>
                <span class="market-item__change ${changeClass}">
                    ${changeSymbol} ${Math.abs(item.change).toFixed(1)}%
                </span>
                <span class="market-item__volume">Vol: ${item.volume.toLocaleString()}</span>
            `;
            itemsContainer.appendChild(itemElement);
        });
    }
};

// ─── FRIENDS LIST SYSTEM ───────────────────────────────────────────
const FriendsList = {
    statuses: ['online', 'away', 'busy', 'offline'],
    locations: ['Shadowmere', 'Valorheim', 'Emberpeak', 'Frostpeak', 'Emerald Forest', 'Dungeon: Void Rift', 'Arena', 'City: Silvermoon'],
    
    init: function() {
        // Generate initial friends list
        for (let i = 0; i < 15; i++) {
            this.addFriend();
        }
        this.render();
    },
    
    addFriend: function() {
        const status = Utils.randomChoice(this.statuses);
        const location = status === 'offline' ? 'Offline' : Utils.randomChoice(this.locations);
        
        DataStore.friendsList.push({
            name: Utils.generatePlayerName(),
            status,
            icon: status === 'online' ? '🟢' : status === 'away' ? '🟡' : status === 'busy' ? '🔴' : '⚫',
            location,
            level: Utils.randomInt(60, 99)
        });
    },
    
    render: function() {
        const container = document.getElementById('friendsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Sort friends by status (online first)
        const sortedFriends = [...DataStore.friendsList].sort((a, b) => {
            const order = { online: 0, away: 1, busy: 2, offline: 3 };
            return order[a.status] - order[b.status];
        });
        
        sortedFriends.forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend-item';
            friendElement.innerHTML = `
                <span class="friend-status friend-status--${friend.status}"></span>
                <span class="friend-icon">${friend.icon}</span>
                <span class="friend-name">${friend.name}</span>
                <span class="friend-location">${friend.location}</span>
                <span class="friend-level">Lv.${friend.level}</span>
            `;
            container.appendChild(friendElement);
        });
    }
};

// ─── MAIL SYSTEM ───────────────────────────────────────────────────
const MailSystem = {
    senders: ['Game Master', 'Guild Master', 'Auction House', 'System', 'Friend', 'NPC Vendor'],
    subjects: [
        'Your auction has sold!',
        'Guild invitation',
        'New patch notes',
        'Weekly rewards',
        'Item restoration',
        'Event invitation',
        'Maintenance notice',
        'Special offer',
        'Achievement unlocked',
        'Level up reward'
    ],
    
    init: function() {
        // Generate initial mail
        for (let i = 0; i < 10; i++) {
            this.addMail();
        }
        this.render();
    },
    
    addMail: function() {
        const isUnread = Math.random() > 0.7;
        const minutesAgo = Utils.randomInt(1, 1440); // Up to 24 hours ago
        const timeString = minutesAgo < 60 ? `${minutesAgo}m ago` : 
                          minutesAgo < 1440 ? `${Math.floor(minutesAgo / 60)}h ago` : 
                          `${Math.floor(minutesAgo / 1440)}d ago`;
        
        DataStore.mailList.push({
            sender: Utils.randomChoice(this.senders),
            subject: Utils.randomChoice(this.subjects),
            time: timeString,
            unread: isUnread,
            icon: isUnread ? '📩' : '📭'
        });
    },
    
    render: function() {
        const container = document.getElementById('mailList');
        if (!container) return;
        
        container.innerHTML = '';
        
        DataStore.mailList.forEach(mail => {
            const mailElement = document.createElement('div');
            mailElement.className = `mail-item ${mail.unread ? 'mail-item--unread' : ''}`;
            mailElement.innerHTML = `
                <span class="mail-icon">${mail.icon}</span>
                <div class="mail-content">
                    <div class="mail-sender">${mail.sender}</div>
                    <div class="mail-subject">${mail.subject}</div>
                </div>
                <span class="mail-time">${mail.time}</span>
            `;
            container.appendChild(mailElement);
        });
    }
};

// ─── RAID TEAM SYSTEM ──────────────────────────────────────────────
const RaidTeam = {
    classes: ['Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman', 'Mage', 'Warlock', 'Monk', 'Druid', 'Demon Hunter', 'Death Knight'],
    roles: ['tank', 'healer', 'dps'],
    
    init: function() {
        // Generate raid team members
        for (let i = 0; i < 25; i++) {
            const role = i < 2 ? 'tank' : i < 6 ? 'healer' : 'dps';
            const isOffline = Math.random() > 0.7;
            
            DataStore.raidTeam.push({
                name: Utils.generatePlayerName(),
                class: Utils.randomChoice(this.classes),
                role,
                level: Utils.randomInt(90, 99),
                status: isOffline ? 'offline' : Math.random() > 0.8 ? 'afk' : 'ready',
                icon: role === 'tank' ? '🛡️' : role === 'healer' ? '💚' : '⚔️'
            });
        }
        this.render();
    },
    
    render: function() {
        const container = document.getElementById('raidTeamGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        DataStore.raidTeam.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = `raid-member raid-member--${member.role} ${member.status === 'offline' ? 'raid-member--offline' : ''}`;
            memberElement.innerHTML = `
                <span class="raid-member__icon">${member.icon}</span>
                <span class="raid-member__name">${member.name}</span>
                <span class="raid-member__class">${member.class}</span>
                <span class="raid-member__status status--${member.status}">${member.status.toUpperCase()}</span>
            `;
            container.appendChild(memberElement);
        });
    }
};

// ─── WORLD MAP SYSTEM ──────────────────────────────────────────────
const WorldMap = {
    canvas: null,
    ctx: null,
    markers: [],
    mapData: null,
    
    init: function() {
        this.canvas = document.getElementById('worldMapCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.generateMap();
        this.setupEventListeners();
        this.render();
        
        // Periodically update map markers
        setInterval(() => this.updateMarkers(), CONFIG.UPDATE_INTERVALS.MAP);
    },
    
    generateMap: function() {
        // Create a procedural continent map
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.fillStyle = '#0a0e18';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw ocean
        this.ctx.fillStyle = '#0d1220';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw continents with noise
        const continents = [
            { x: 100, y: 150, w: 300, h: 200, color: '#4a6fa5', name: 'Valorheim' },
            { x: 500, y: 100, w: 250, h: 180, color: '#6b4c8a', name: 'Shadowmere' },
            { x: 150, y: 300, w: 280, h: 150, color: '#2d7d46', name: 'Emerald Forest' },
            { x: 650, y: 250, w: 200, h: 160, color: '#8b4513', name: 'Ironforge Mountains' },
            { x: 350, y: 350, w: 220, h: 120, color: '#8b0000', name: 'Crimson Wastes' },
            { x: 50, y: 50, w: 150, h: 100, color: '#c9a94e', name: 'Holy Sanctum' },
            { x: 750, y: 50, w: 120, h: 120, color: '#1a5276', name: 'Azure Archipelago' },
            { x: 400, y: 50, w: 180, h: 100, color: '#4a4a6a', name: 'Void Touched Lands' }
        ];
        
        continents.forEach(continent => {
            // Draw continent with noise
            this.drawContinent(continent);
        });
        
        // Draw grid overlay
        this.drawGrid();
        
        // Generate map markers
        this.generateMarkers();
    },
    
    drawContinent: function(continent) {
        const { x, y, w, h, color, name } = continent;
        
        // Create organic shape
        this.ctx.save();
        this.ctx.beginPath();
        
        // Draw irregular coastline
        const points = 20;
        const angleStep = (Math.PI * 2) / points;
        
        for (let i = 0; i <= points; i++) {
            const angle = i * angleStep;
            const radiusX = w / 2 + Math.random() * 20 - 10;
            const radiusY = h / 2 + Math.random() * 20 - 10;
            const px = x + w/2 + Math.cos(angle) * radiusX;
            const py = y + h/2 + Math.sin(angle) * radiusY;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.closePath();
        
        // Fill with gradient
        const gradient = this.ctx.createRadialGradient(
            x + w/2, y + h/2, 0,
            x + w/2, y + h/2, Math.max(w, h)/2
        );
        gradient.addColorStop(0, this.lightenColor(color, 20));
        gradient.addColorStop(0.7, color);
        gradient.addColorStop(1, this.darkenColor(color, 20));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Add texture
        this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let i = 0; i < 50; i++) {
            const tx = x + Math.random() * w;
            const ty = y + Math.random() * h;
            const size = Math.random() * 3 + 1;
            this.ctx.fillRect(tx, ty, size, size);
        }
        
        // Draw border
        this.ctx.strokeStyle = this.lightenColor(color, 30);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.restore();
        
        // Draw name
        this.ctx.fillStyle = '#e8edf5';
        this.ctx.font = '10px "Cinzel", serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, x + w/2, y + h/2 + 4);
    },
    
    drawGrid: function() {
        this.ctx.strokeStyle = 'rgba(74, 111, 165, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    },
    
    generateMarkers: function() {
        this.markers = [];
        
        // City markers
        const cities = [
            { x: 250, y: 200, type: 'city', name: 'Silvermoon' },
            { x: 600, y: 150, type: 'city', name: 'Shadow City' },
            { x: 300, y: 350, type: 'city', name: 'Forest Haven' },
            { x: 700, y: 300, type: 'city', name: 'Ironforge' },
            { x: 100, y: 100, type: 'city', name: 'Holy City' },
            { x: 800, y: 100, type: 'city', name: 'Azure Port' }
        ];
        
        // Dungeon markers
        const dungeons = [
            { x: 180, y: 250, type: 'dungeon', name: 'Void Rift' },
            { x: 400, y: 150, type: 'dungeon', name: 'Shadow Keep' },
            { x: 250, y: 400, type: 'dungeon', name: 'Emerald Sanctum' },
            { x: 750, y: 350, type: 'dungeon', name: 'Iron Depths' },
            { x: 450, y: 400, type: 'dungeon', name: 'Crimson Caverns' }
        ];
        
        // Boss markers
        const bosses = [
            { x: 350, y: 180, type: 'boss', name: 'Krathos' },
            { x: 650, y: 200, type: 'boss', name: 'Void Empress' },
            { x: 150, y: 350, type: 'boss', name: 'Forest Guardian' },
            { x: 800, y: 250, type: 'boss', name: 'Iron Golem' }
        ];
        
        // Resource markers
        const resources = [
            { x: 300, y: 300, type: 'resource', name: 'Herb Garden' },
            { x: 500, y: 250, type: 'resource', name: 'Mining Camp' },
            { x: 200, y: 400, type: 'resource', name: 'Fishing Spot' },
            { x: 600, y: 350, type: 'resource', name: 'Enchanting Circle' }
        ];
        
        this.markers = [...cities, ...dungeons, ...bosses, ...resources];
    },
    
    updateMarkers: function() {
        // Simulate marker activity (e.g., boss spawns, player concentrations)
        this.markers.forEach(marker => {
            if (marker.type === 'boss') {
                // Boss markers pulse
                marker.pulse = Math.random() > 0.5;
            }
        });
        this.render();
    },
    
    render: function() {
        if (!this.ctx) return;
        
        // Redraw map
        this.generateMap();
        
        // Draw markers
        this.markers.forEach(marker => {
            this.drawMarker(marker);
        });
    },
    
    drawMarker: function(marker) {
        const { x, y, type, name, pulse } = marker;
        
        this.ctx.save();
        
        // Marker color based on type
        let color, size;
        switch(type) {
            case 'city':
                color = '#c9a94e';
                size = 6;
                break;
            case 'dungeon':
                color = '#9b59b6';
                size = 5;
                break;
            case 'boss':
                color = pulse ? '#ff4757' : '#e74c3c';
                size = pulse ? 8 : 6;
                if (pulse) {
                    this.ctx.shadowColor = '#ff4757';
                    this.ctx.shadowBlur = 10;
                }
                break;
            case 'resource':
                color = '#2ecc71';
                size = 4;
                break;
        }
        
        // Draw marker
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = this.lightenColor(color, 30);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Draw name
        this.ctx.fillStyle = '#e8edf5';
        this.ctx.font = '8px "Fira Code", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, x, y - size - 3);
        
        this.ctx.restore();
    },
    
    setupEventListeners: function() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const coordX = document.getElementById('mapCoordX');
            const coordY = document.getElementById('mapCoordY');
            
            if (coordX && coordY) {
                coordX.textContent = Math.round(x);
                coordY.textContent = Math.round(y);
            }
        });
        
        // Map layer buttons
        document.querySelectorAll('[data-map-layer]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('[data-map-layer]').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                // In a real app, this would change the map layer
            });
        });
    },
    
    lightenColor: function(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    },
    
    darkenColor: function(color, percent) {
        return this.lightenColor(color, -percent);
    }
};

// ─── SERVER STATS SYSTEM ───────────────────────────────────────────
const ServerStats = {
    init: function() {
        this.update();
        setInterval(() => this.update(), CONFIG.UPDATE_INTERVALS.SERVER_STATS);
    },
    
    update: function() {
        // Update FPS counter
        const fpsCounter = document.getElementById('fpsCounter');
        if (fpsCounter) {
            fpsCounter.textContent = Utils.randomInt(58, 62);
        }
        
        // Update memory usage
        const memUsage = document.getElementById('memUsage');
        if (memUsage) {
            memUsage.textContent = `${Utils.randomInt(230, 260)}MB`;
        }
        
        // Update notification counts
        const notifCount = document.getElementById('notifCount');
        const mailCount = document.getElementById('mailCount');
        const friendCount = document.getElementById('friendCount');
        
        if (notifCount) notifCount.textContent = Utils.randomInt(10, 15);
        if (mailCount) mailCount.textContent = Utils.randomInt(5, 10);
        if (friendCount) friendCount.textContent = Utils.randomInt(40, 50);
        
        this.updateServerLoad();
    },
    
    updateServerLoad: function() {
        const loadBars = document.querySelectorAll('.load-bar');
        loadBars.forEach(bar => {
            const fill = bar.querySelector('.bar__fill');
            const valueSpan = bar.querySelector('span:last-child');
            if (fill && valueSpan) {
                const value = Utils.randomInt(40, 90);
                fill.style.width = `${value}%`;
                valueSpan.textContent = `${value}%`;
                
                // Update color based on load
                if (value > 85) {
                    fill.style.background = 'linear-gradient(90deg, var(--ruby), #ff6b6b)';
                } else if (value > 70) {
                    fill.style.background = 'linear-gradient(90deg, var(--gold), var(--gold-bright))';
                } else {
                    fill.style.background = 'linear-gradient(90deg, var(--emerald), var(--emerald-bright))';
                }
            }
        });
    }
};

// ─── WEATHER SYSTEM ────────────────────────────────────────────────
const WeatherSystem = {
    conditions: [
        { icon: '☀️', desc: 'Clear Skies', tempRange: [20, 35] },
        { icon: '⛅', desc: 'Partly Cloudy', tempRange: [15, 25] },
        { icon: '☁️', desc: 'Overcast', tempRange: [10, 20] },
        { icon: '🌧️', desc: 'Rain', tempRange: [8, 18] },
        { icon: '⛈️', desc: 'Thunderstorm', tempRange: [12, 22] },
        { icon: '🌨️', desc: 'Snow', tempRange: [-10, 5] },
        { icon: '🌫️', desc: 'Fog', tempRange: [5, 15] },
        { icon: '🌪️', desc: 'Tornado Warning', tempRange: [15, 30] },
        { icon: '🌋', desc: 'Volcanic Activity', tempRange: [300, 900] }
    ],
    
    init: function() {
        this.update();
        setInterval(() => this.update(), CONFIG.UPDATE_INTERVALS.WEATHER);
    },
    
    update: function() {
        const weather = Utils.randomChoice(this.conditions);
        const temp = Utils.randomInt(weather.tempRange[0], weather.tempRange[1]);
        
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherTemp = document.getElementById('weatherTemp');
        const weatherDesc = document.getElementById('weatherDesc');
        
        if (weatherIcon) weatherIcon.textContent = weather.icon;
        if (weatherTemp) weatherTemp.textContent = `${temp}°C / ${Math.round(temp * 9/5 + 32)}°F`;
        if (weatherDesc) weatherDesc.textContent = weather.desc;
        
        // Update regional weather
        this.updateRegionalWeather();
    },
    
    updateRegionalWeather: function() {
        const weatherZones = document.querySelectorAll('.weather-zone');
        weatherZones.forEach(zone => {
            const iconSpan = zone.querySelector('.weather-zone__icon');
            const tempSpan = zone.querySelector('.weather-zone__temp');
            
            if (iconSpan && tempSpan) {
                const weather = Utils.randomChoice(this.conditions);
                const temp = Utils.randomInt(weather.tempRange[0], weather.tempRange[1]);
                
                iconSpan.textContent = weather.icon;
                tempSpan.textContent = `${temp}°C`;
            }
        });
    }
};

// ─── NOTIFICATION SYSTEM ───────────────────────────────────────────
const NotificationSystem = {
    quotes: [
        '"In the void between stars, power awaits those brave enough to claim it." — Archmage Zyloth',
        '"The shadow moves where light cannot follow." — Ranger Sylvanas',
        '"From the ashes of defeat, heroes are forged." — Commander Arthas',
        '"Magic is not a tool, but an extension of will." — Archmage Medivh',
        '"The frost giant sleeps, but his breath still chills." — Shaman Thrall',
        '"Honor is the blade\'s edge that cuts both ways." — Paladin Uther',
        '"The forest remembers what the world forgets." — Druid Malfurion',
        '"Power corrupts, but absolute power is pretty nice." — Warlock Gul\'dan',
        '"The void stares back, and it is hungry." — Void Walker',
        '"Every ending is a new beginning in disguise." — Priest Tyrande'
    ],
    
    init: function() {
        this.updateQuote();
        setInterval(() => this.updateQuote(), 30000); // Change quote every 30 seconds
    },
    
    updateQuote: function() {
        const quoteElement = document.getElementById('worldQuote');
        if (quoteElement) {
            quoteElement.textContent = Utils.randomChoice(this.quotes);
        }
    }
};

// ─── FILTER SYSTEM ─────────────────────────────────────────────────
const FilterSystem = {
    init: function() {
        // Activity log filters
        document.querySelectorAll('.filter-btn[data-filter]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                // In a real app, this would filter the log
            });
        });
        
        // Guild ranking tabs
        document.querySelectorAll('.panel--guilds .tab').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.panel--guilds .tab').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                // In a real app, this would sort/filter the guild table
            });
        });
        
        // PvP tabs
        document.querySelectorAll('.panel--pvp .tab').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.panel--pvp .tab').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                // In a real app, this would change the PvP bracket
            });
        });
    }
};

// ─── ANIMATION SYSTEM ──────────────────────────────────────────────
const AnimationSystem = {
    init: function() {
        // Add staggered animation delays to panels
        document.querySelectorAll('.panel').forEach((panel, index) => {
            panel.style.animationDelay = `${index * 0.05}s`;
        });
        
        // Add hover effects to stat items
        document.querySelectorAll('.stat-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-2px)';
                item.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.boxShadow = '';
            });
        });
    }
};

// ─── MAIN INITIALIZATION ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Aethoria World Command Console initializing...');
    
    // Initialize all systems
    WorldClock.init();
    PlayerCounts.init();
    GuildTable.init();
    PVPLeaderboard.init();
    ActivityLog.init();
    MarketSystem.init();
    FriendsList.init();
    MailSystem.init();
    RaidTeam.init();
    WorldMap.init();
    ServerStats.init();
    WeatherSystem.init();
    NotificationSystem.init();
    FilterSystem.init();
    AnimationSystem.init();
    
    // Log successful initialization
    setTimeout(() => {
        console.log('✅ All systems online. Welcome to Aethoria, Commander.');
        
        // Add a welcome message to the activity log
        DataStore.activityLog.unshift({
            time: Utils.formatTime(DataStore.worldTime.hour, DataStore.worldTime.minute, DataStore.worldTime.second),
            type: 'system',
            message: 'World Command Console v4.2.1 initialized. All systems operational.',
            logClass: 'log-type--system'
        });
        ActivityLog.render();
    }, 1000);
});

// ─── EXPORT FOR DEBUGGING ──────────────────────────────────────────
window.Aethoria = {
    DataStore,
    WorldClock,
    PlayerCounts,
    GuildTable,
    PVPLeaderboard,
    ActivityLog,
    MarketSystem,
    FriendsList,
    MailSystem,
    RaidTeam,
    WorldMap,
    ServerStats,
    WeatherSystem,
    NotificationSystem,
    Utils
};
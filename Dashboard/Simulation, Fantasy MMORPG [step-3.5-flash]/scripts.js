// Aethelgard World Simulation Dashboard - JavaScript
// v4.7.2 • Live Data Engine

// ===== CONFIGURATION =====
const CONFIG = {
    refreshInterval: 2500,
    clockUpdateInterval: 1000,
    tickerUpdateInterval: 4000,
    serverMetricsUpdateInterval: 2000,
    eventsUpdateInterval: 30000,
    maxTerritorySize: 20,
    maxGuilds: 25,
    maxRaids: 8,
    maxTopPlayers: 15
};

// ===== GAME WORLD DATA =====
const KINGDOMS = [
    { id: 'ironforge', name: 'Ironforge', color: '#c0392b', race: 'Dwarves', ruler: 'King Throrin Ironheart' },
    { id: 'azurehaven', name: 'Azurehaven', color: '#2980b9', race: 'High Elves', ruler: 'Queen Lyra Starweaver' },
    { id: 'greenhaven', name: 'Greenhaven', color: '#27ae60', race: 'Humans', ruler: 'King Edmund the Just' },
    { id: 'shadowmoor', name: 'Shadowmoor', color: '#8e44ad', race: 'Undead', ruler: 'Lich King Malakor' },
    { id: 'redcliff', name: 'Redcliff', color: '#f39c12', race: 'Orcs', ruler: 'Warchief Grommash' }
];

const CLASSES = [
    { name: 'Warrior', icon: '⚔️', color: '#c0392b' },
    { name: 'Mage', icon: '🔮', color: '#3498db' },
    { name: 'Rogue', icon: '🗡️', color: '#2ecc71' },
    { name: 'Priest', icon: '✨', color: '#f1c40f' },
    { name: 'Hunter', icon: '🏹', color: '#27ae60' },
    { name: 'Paladin', icon: '🛡️', color: '#f39c12' },
    { name: 'Warlock', icon: '💀', color: '#9b59b6' },
    { name: 'Druid', icon: '🌿', color: '#2ecc71' },
    { name: 'Shaman', icon: '⚡', color: '#3498db' },
    { name: 'Monk', icon: '🥋', color: '#e74c3c' },
    { name: 'Demon Hunter', icon: '👁️', color: '#8e44ad' },
    { name: 'Death Knight', icon: '❄️', color: '#95a5a6' }
];

const WEATHERS = [
    { icon: '☀️', name: 'Clear', effect: '+5% XP' },
    { icon: '🌤️', name: 'Partly Cloudy', effect: 'Normal' },
    { icon: '☁️', name: 'Cloudy', effect: '-2% Vision' },
    { icon: '🌧️', name: 'Rain', effect: '-10% Fire Damage' },
    { icon: '⛈️', name: 'Storm', effect: 'Lightning Strikes' },
    { icon: '❄️', name: 'Snow', effect: '-15% Movement' },
    { icon: '🌫️', name: 'Fog', effect: '-30% Vision' },
    { icon: '🌪️', name: 'Windy', effect: 'Ranged Bonus' },
    { icon: '🌈', name: 'Rainbow', effect: '+15% Luck' }
];

const SEASONS = [
    { icon: '🌸', name: 'Spring', effects: ['+10% Herb Spawns', 'Breeding Season'] },
    { icon: '☀️', name: 'Summer', effects: ['+20% Heat Damage', 'Drought'] },
    { icon: '🍂', name: 'Autumn', effects: ['+15% Harvest', 'Migrations'] },
    { icon: '❄️', name: 'Winter', effects: ['-20% Regen', 'Snow Coverage'] }
];

const RAID_DIFFICULTIES = [
    { name: 'Normal', color: '#27ae60' },
    { name: 'Heroic', color: '#f39c12' },
    { name: 'Mythic', color: '#e74c3c' }
];

const BIOMES = [
    { name: 'Forest', icon: '🌲', color: '#27ae60' },
    { name: 'Mountain', icon: '⛰️', color: '#7f8c8d' },
    { name: 'Water', icon: '🌊', color: '#3498db' },
    { name: 'Desert', icon: '🏜️', color: '#f39c12' },
    { name: 'Plains', icon: '🌾', color: '#f1c40f' },
    { name: 'Swamp', icon: '🌫️', color: '#8e44ad' },
    { name: 'Tundra', icon: '❄️', color: '#bdc3c7' }
];

const GUILD_RANKS = [
    'Member', 'Veteran', 'Officer', 'Leader', 'Founder'
];

const ALLIANCE_NAMES = [
    'The Grand Alliance', 'Horde of the North', 'Covenant of Light',
    'Shadow Syndicate', 'Dragon Cartel', 'Phoenix Order',
    'Iron Brotherhood', 'Mystic Circle', 'Blood Pact'
];

// ===== APPLICATION STATE =====
const state = {
    // Time & Environment
    gameTime: { hours: 6, minutes: 0, seconds: 0, day: 1, month: 1, year: 1, era: 'Dragon' },
    weather: WEATHERS[1],
    season: SEASONS[2],
    biomeDistribution: { forest: 0, mountain: 0, water: 0, desert: 0, plains: 0, swamp: 0 },
    
    // Population Stats
    totalPlayers: 2847391,
    activePlayers: 847291,
    newPlayersToday: 12847,
    charactersCreated: 8742391,
    maxLevel: 100,
    avgLevel: 67,
    
    // Server Metrics
    latency: 12,
    serverLoad: 73,
    memoryUsage: 82,
    diskIO: 34,
    networkIO: 56,
    regions: [
        { name: 'NA-East', status: 'online', players: 742312, load: 78 },
        { name: 'NA-West', status: 'online', players: 589421, load: 65 },
        { name: 'EU-Central', status: 'warning', players: 823456, load: 89 },
        { name: 'Asia-Pacific', status: 'online', players: 692202, load: 71 }
    ],
    
    // World Events
    events: [],
    
    // Guild Data
    guilds: [],
    alliances: [],
    
    // Raid Progress
    raids: [],
    
    // Economy
    commodities: [],
    gear: [],
    materials: [],
    currency: [],
    marketTrend: 'bullish',
    
    // Class Distribution
    classDistribution: [],
    
    // Top Players
    topPlayers: [],
    
    // Live Activity
    activity: {
        pvpKills: 142847,
        castlesCaptured: 17,
        dragonsSlain: 342,
        auctionsClosed: 89241,
        playerDeaths: 234891,
        questsCompleted: 892341,
        itemsCrafted: 234567,
        dungeonsCleared: 45231
    },
    
    // UI State
    minimizedPanels: new Set(),
    activeTab: 'commodities',
    tooltip: null,
    
    // Simulation state
    lastUpdate: Date.now(),
    tick: 0
};

// ===== UTILITY FUNCTIONS =====
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

function formatCompact(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getTimeAgo(minutes) {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== DATA GENERATORS =====
function generateTerritoryGrid() {
    const size = CONFIG.maxTerritorySize;
    const grid = [];
    const kingdomCount = KINGDOMS.length;
    
    // Generate using simple cellular automata-ish algorithm
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            // Create kingdom territories with some randomness
            const kingdomIndex = Math.floor((Math.sin(x * 0.7) * Math.cos(y * 0.7) + 1) * (kingdomCount / 2));
            const kingdom = kingdomIndex >= 0 && kingdomIndex < kingdomCount ? KINGDOMS[kingdomIndex].id : 'neutral';
            row.push(kingdom);
        }
        grid.push(row);
    }
    
    // Smooth the borders (simple cellular smoothing)
    for (let iteration = 0; iteration < 2; iteration++) {
        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                const neighbors = [
                    grid[y-1][x], grid[y+1][x],
                    grid[y][x-1], grid[y][x+1],
                    grid[y-1][x-1], grid[y-1][x+1],
                    grid[y+1][x-1], grid[y+1][x+1]
                ];
                
                const counts = {};
                neighbors.forEach(n => {
                    counts[n] = (counts[n] || 0) + 1;
                });
                
                // Find most common neighbor
                const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                if (mostCommon[1] >= 5) {
                    grid[y][x] = mostCommon[0];
                }
            }
        }
    }
    
    return grid;
}

function generateGuilds() {
    const guilds = [];
    const prefixes = ['The', 'Order of', 'Brotherhood of', 'Society of', 'Legion of', 'Cult of', 'Sons of', 'Daughters of', 'Clan', 'Guild'];
    const suffixes = ['Eternal', 'Divine', 'Shadow', 'Dragon', 'Phoenix', 'Void', 'Light', 'Dark', 'Ancient', 'Rising', 'Fallen', 'Mighty'];
    const nouns = ['Blade', 'Storm', 'Heart', 'Soul', 'Spirit', 'Fang', 'Claw', 'Wing', 'Scale', 'Flame'];
    
    for (let i = 0; i < CONFIG.maxGuilds; i++) {
        const prefix = prefixes[randomInt(0, prefixes.length - 1)];
        const suffix = suffixes[randomInt(0, suffixes.length - 1)];
        const noun = nouns[randomInt(0, nouns.length - 1)];
        const name = `${prefix} ${noun} ${suffix}`.replace(/\s+/g, ' ').trim();
        
        const level = randomInt(1, 25);
        const memberCount = randomInt(20, 500);
        
        guilds.push({
            id: generateId(),
            rank: i + 1,
            name: name,
            tag: name.substring(0, 3).toUpperCase(),
            level: level,
            members: memberCount,
            online: randomInt(0, Math.floor(memberCount * 0.4)),
            trophies: randomInt(1000, 50000) * level,
            wins: randomInt(0, 1000),
            winRate: randomFloat(20, 95, 1),
            kills: randomInt(10000, 500000),
            deaths: randomInt(5000, 200000),
            realm: KINGDOMS[randomInt(0, KINGDOMS.length - 1)].name,
            leader: `Player${randomInt(1000, 9999)}`,
            alliance: null
        });
    }
    
    // Assign alliances (about 60% of top guilds)
    const allianceCount = Math.floor(CONFIG.maxGuilds * 0.6 / 3);
    for (let a = 0; a < 3; a++) {
        const allianceName = ALLIANCE_NAMES[a];
        for (let i = 0; i < allianceCount; i++) {
            const guildIndex = a * allianceCount + i;
            if (guilds[guildIndex]) {
                guilds[guildIndex].alliance = allianceName;
            }
        }
    }
    
    return guilds.sort((a, b) => b.trophies - a.trophies);
}

function generateAlliances() {
    const alliances = [];
    const allianceData = {};
    
    state.guilds.forEach(guild => {
        if (guild.alliance) {
            if (!allianceData[guild.alliance]) {
                allianceData[guild.alliance] = {
                    name: guild.alliance,
                    guilds: [],
                    totalMembers: 0,
                    totalTrophies: 0,
                    totalKills: 0,
                    totalWins: 0,
                    avgWinRate: 0
                };
            }
            const alliance = allianceData[guild.alliance];
            alliance.guilds.push(guild.name);
            alliance.totalMembers += guild.members;
            alliance.totalTrophies += guild.trophies;
            alliance.totalKills += guild.kills;
            alliance.totalWins += guild.wins;
            alliance.avgWinRate += guild.winRate;
        }
    });
    
    Object.values(allianceData).forEach(alliance => {
        alliance.avgWinRate = (alliance.avgWinRate / alliance.guilds.length).toFixed(1);
        alliances.push(alliance);
    });
    
    return alliances.sort((a, b) => b.totalTrophies - a.totalTrophies);
}

function generateRaids() {
    const raidNames = [
        'Temple of the Moon',
        'Citadel of the Damned',
        'Vault of the Titans',
        'Sanctum of the Dragon',
        'Fortress of the Fallen',
        'Lair of the Lich King',
        'Bastion of the Betrayer',
        'Hall of the Heroes',
        'Abyss of Madness',
        'Crypt of the Ancients',
        'Spire of the Sorcerer',
        'Caverns of the Deep'
    ];
    
    const raidTypes = ['Raid', 'Dungeon', 'World Boss', 'Scenario'];
    const bosses = [
        'Lord Helix', 'Queen Azshara', 'King Rastakhan', 'Lady Jaina',
        'Archimonde', 'Kil\'jaeden', 'Sargeras', 'N\'Zoth',
        'Deathwing', 'Ragnaros', 'Malygos', 'Onyxia'
    ];
    
    const raids = [];
    for (let i = 0; i < CONFIG.maxRaids; i++) {
        const difficulty = RAID_DIFFICULTIES[randomInt(0, RAID_DIFFICULTIES.length - 1)];
        const progress = randomInt(0, 100);
        const bossCount = randomInt(3, 12);
        
        raids.push({
            id: generateId(),
            name: raidNames[i],
            type: raidTypes[randomInt(0, raidTypes.length - 1)],
            difficulty: difficulty.name,
            difficultyColor: difficulty.color,
            level: randomInt(60, 100),
            bossCount: bossCount,
            bossesDefeated: Math.floor(bossCount * progress / 100),
            progress: progress,
            attempts: randomInt(10, 2000),
            bestTime: `${randomInt(5, 60)}:${randomInt(10, 59).toString().padStart(2, '0')}`,
            fastestKill: `${randomInt(2, 30)}:${randomInt(10, 59).toString().padStart(2, '0')}`,
            lootQuality: progress > 80 ? 'Epic' : progress > 50 ? 'Rare' : 'Uncommon',
            nextReset: `${randomInt(1, 7)}d ${randomInt(0, 23)}h`,
            lastKill: getTimeAgo(randomInt(0, 720)),
            popular: Math.random() < 0.3
        });
    }
    
    return raids.sort((a, b) => b.progress - a.progress);
}

function generateEconomyData() {
    const now = Date.now();
    const commodities = [
        { name: 'Iron Ore', base: 10, volatility: 0.15, trend: 0.0001, color: '#7f8c8d' },
        { name: 'Mithril', base: 45, volatility: 0.12, trend: 0.0002, color: '#3498db' },
        { name: 'Adamantite', base: 120, volatility: 0.18, trend: 0.0003, color: '#9b59b6' },
        { name: 'Herbs', base: 25, volatility: 0.25, trend: -0.0001, color: '#2ecc71' },
        { name: 'Leather', base: 18, volatility: 0.20, trend: 0.00015, color: '#8e44ad' },
        { name: 'Cloth', base: 15, volatility: 0.12, trend: -0.00005, color: '#f1c40f' },
        { name: 'Enchanting Dust', base: 50, volatility: 0.30, trend: 0.0004, color: '#e74c3c' },
        { name: 'Gems', base: 200, volatility: 0.22, trend: 0.00025, color: '#1abc9c' }
    ];
    
    const gear = [
        { name: 'Iron Sword', base: 50, volatility: 0.08 },
        { name: 'Steel Armor', base: 120, volatility: 0.10 },
        { name: 'Enchanted Staff', base: 350, volatility: 0.15 },
        { name: 'Dragonbone Bow', base: 850, volatility: 0.20 },
        { name: 'Phoenix Feather', base: 1200, volatility: 0.25 },
        { name: 'Shadowmoon Dagger', base: 650, volatility: 0.18 },
        { name: 'Titanium Shield', base: 400, volatility: 0.12 },
        { name: 'Crystal Orb', base: 900, volatility: 0.22 }
    ];
    
    const materials = [
        { name: 'Arcane Dust', base: 5, volatility: 0.20 },
        { name: 'Soul Shard', base: 25, volatility: 0.25 },
        { name: 'Mote of Fire', base: 15, volatility: 0.18 },
        { name: 'Eternal Essence', base: 200, volatility: 0.30 },
        { name: 'Abyss Crystal', base: 150, volatility: 0.28 },
        { name: 'Dream Shard', base: 75, volatility: 0.22 },
        { name: 'Primal Mooncloth', base: 300, volatility: 0.15 },
        { name: 'Spellcloth', base: 180, volatility: 0.12 }
    ];
    
    const currency = [
        { name: 'Gold', symbol: 'g', base: 1, volatility: 0.02, trend: 0 },
        { name: 'Platinum', symbol: 'p', base: 100, volatility: 0.05, trend: 0.0001 },
        { name: 'Diamond', symbol: 'g', base: 250, volatility: 0.08, trend: 0.0002 },
        { name: 'Phoenix Tear', symbol: 'g', base: 5400, volatility: 0.12, trend: 0.0005 },
        { name: 'Dragon\'s Hoard', symbol: 'g', base: 25000, volatility: 0.15, trend: 0.001 }
    ];
    
    // Generate price history for chart
    const generatePriceHistory = (base, volatility, points = 50) => {
        const history = [];
        let price = base * 0.9;
        for (let i = 0; i < points; i++) {
            price = price * (1 + randomFloat(-volatility, volatility));
            history.push(price);
        }
        return history;
    };
    
    return {
        commodities: commodities.map(c => ({
            ...c,
            currentPrice: c.base * randomFloat(0.95, 1.05),
            change: randomFloat(-c.volatility, c.volatility) * 100,
            history: generatePriceHistory(c.base, c.volatility)
        })),
        gear: gear.map(g => ({
            ...g,
            currentPrice: g.base * randomFloat(0.9, 1.2),
            change: randomFloat(-g.volatility, g.volatility) * 100
        })),
        materials: materials.map(m => ({
            ...m,
            currentPrice: m.base * randomFloat(0.85, 1.3),
            change: randomFloat(-m.volatility, m.volatility) * 100
        })),
        currency: currency.map(c => ({
            ...c,
            currentPrice: c.base * randomFloat(0.98, 1.02),
            change: randomFloat(-c.volatility, c.volatility) * 100,
            history: generatePriceHistory(c.base, c.volatility)
        }))
    };
}

function generateClassDistribution() {
    const total = state.totalPlayers;
    const baseDistribution = [
        { class: 'Warrior', weight: 12 },
        { class: 'Mage', weight: 10 },
        { class: 'Rogue', weight: 9 },
        { class: 'Priest', weight: 8 },
        { class: 'Hunter', weight: 11 },
        { class: 'Paladin', weight: 7 },
        { class: 'Warlock', weight: 6 },
        { class: 'Druid', weight: 10 },
        { class: 'Shaman', weight: 5 },
        { class: 'Monk', weight: 4 },
        { class: 'Demon Hunter', weight: 3 },
        { class: 'Death Knight', weight: 5 }
    ];
    
    // Add some randomness
    baseDistribution.forEach(item => {
        item.weight += randomFloat(-2, 2);
    });
    
    // Normalize
    const totalWeight = baseDistribution.reduce((sum, c) => sum + c.weight, 0);
    
    return baseDistribution.map(item => ({
        class: item.class,
        icon: CLASSES.find(c => c.name === item.class)?.icon || '⚔️',
        color: CLASSES.find(c => c.name === item.class)?.color || '#95a5a6',
        percentage: ((item.weight / totalWeight) * 100).toFixed(1),
        count: Math.round(total * item.weight / totalWeight)
    })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
}

function generateTopPlayers() {
    const players = [];
    const races = ['Human', 'Elf', 'Dwarf', 'Orc', 'Undead', 'Gnome', 'Troll', 'Night Elf', 'Tauren', 'Blood Elf'];
    const titles = ['The Unstoppable', 'The Destroyer', 'The Legend', 'The Myth', 'The Divine', 'The Voidwalker', 'The Champion'];
    
    for (let i = 0; i < CONFIG.maxTopPlayers; i++) {
        const level = randomInt(90, 100);
        const guild = state.guilds[randomInt(0, Math.min(10, state.guilds.length - 1))];
        
        players.push({
            rank: i + 1,
            name: `Player${randomInt(1000, 9999)}`,
            displayName: `Player${randomInt(1000, 9999)} ${titles[randomInt(0, titles.length - 1)]}`,
            level: level,
            class: CLASSES[randomInt(0, CLASSES.length - 1)],
            race: races[randomInt(0, races.length - 1)],
            guild: guild ? guild.name : null,
            guildTag: guild ? guild.tag : null,
            realm: KINGDOMS[randomInt(0, KINGDOMS.length - 1)].name,
            pvpRank: randomInt(1, 1000),
            achievements: randomInt(500, 5000),
            playtime: `${randomInt(200, 2000)}h`,
            lastSeen: getTimeAgo(randomInt(0, 1440))
        });
    }
    
    return players.sort((a, b) => b.level - a.level);
}

function generateEvent() {
    const eventTypes = [
        { icon: '🌋', name: 'Volcanic Eruption', severity: 'urgent', locations: ['Cinderfall Basin', 'Molten Peaks', 'Ashfire Canyon'] },
        { icon: '🐉', name: 'Dragon Spotted', severity: 'high', locations: ['Azure Peaks', 'Dragon\'s Spine', 'Skyfang Ridge'] },
        { icon: '⚔️', name: 'Guild War', severity: 'high', locations: ['Battlefield of the Titans', 'Warfront', 'No Man\'s Land'] },
        { icon: '👑', name: 'Royal Wedding', severity: 'low', locations: ['Greenhaven Palace', 'Azurehaven Court', 'Ironforge Hall'] },
        { icon: '🌊', name: 'Tsunami Warning', severity: 'urgent', locations: ['Port Azure', 'Seabreeze Cove', 'Coral Bay'] },
        { icon: '❄️', name: 'Blizzard', severity: 'medium', locations: ['Frostfang Pass', 'Icecrown Glacier', 'Snowdrift Plains'] },
        { icon: '🌟', name: 'Meteor Shower', severity: 'medium', locations: ['Starlight Desert', 'Crater Fields', 'Celestial Plains'] },
        { icon: '💀', name: 'Undead Uprising', severity: 'urgent', locations: ['Shadowmoor Cemeteries', 'Graveyard of Kings', 'Necropolis'] },
        { icon: '🎪', name: 'Traveling Circus', severity: 'low', locations: ['Greenhaven Square', 'Ironforge Market', 'Azurehaven Promenade'] },
        { icon: '🏰', name: 'Castle Siege', severity: 'high', locations: ['Fort Ironwall', 'Azure Fortress', 'Greenhaven Keep'] },
        { icon: '🧙', name: 'Arcane Anomaly', severity: 'medium', locations: ['Arcane Academy', 'Mystic Glade', 'Enchanted Forest'] },
        { icon: '🦑', name: 'Kraken Attack', severity: 'urgent', locations: ['Deep Ocean', 'Shipwreck Bay', 'Kraken\'s Lair'] },
        { icon: '🌪️', name: 'Tornado', severity: 'high', locations: ['Plains of Tornadoes', 'Windy Canyon', 'Storm Peak'] },
        { icon: '🦁', name: 'Lion Invasion', severity: 'medium', locations: ['Savanna Plains', 'Golden Grasslands', 'Lion\'s Den'] }
    ];
    
    const event = eventTypes[randomInt(0, eventTypes.length - 1)];
    const location = event.locations[randomInt(0, event.locations.length - 1)];
    const timeAgo = randomInt(0, 120);
    
    return {
        id: generateId(),
        icon: event.icon,
        name: event.name,
        location: location,
        severity: event.severity,
        timeAgo: timeAgo,
        timestamp: Date.now() - timeAgo * 60 * 1000,
        participants: randomInt(10, 1000),
        rewards: randomInt(1000, 50000)
    };
}

// ===== UPDATE FUNCTIONS =====
function updateGameTime() {
    state.gameTime.seconds++;
    if (state.gameTime.seconds >= 60) {
        state.gameTime.seconds = 0;
        state.gameTime.minutes++;
    }
    if (state.gameTime.minutes >= 60) {
        state.gameTime.minutes = 0;
        state.gameTime.hours++;
    }
    if (state.gameTime.hours >= 24) {
        state.gameTime.hours = 0;
        state.gameTime.day++;
    }
    if (state.gameTime.day > 30) {
        state.gameTime.day = 1;
        state.gameTime.month++;
    }
    if (state.gameTime.month > 12) {
        state.gameTime.month = 1;
        state.gameTime.year++;
    }
}

function updateWeatherSeason() {
    // Change weather every 15 minutes game time (simulated)
    if (state.gameTime.minutes % 15 === 0 && state.gameTime.seconds === 0) {
        if (Math.random() < 0.4) {
            state.weather = WEATHERS[randomInt(0, WEATHERS.length - 1)];
        }
    }
    
    // Change season every 30 days
    if (state.gameTime.day === 1 && state.gameTime.hours === 0 && state.gameTime.minutes === 0) {
        if (Math.random() < 0.3) {
            const currentSeason = state.season;
            let newSeason;
            do {
                newSeason = SEASONS[randomInt(0, SEASONS.length - 1)];
            } while (newSeason === currentSeason);
            state.season = newSeason;
        }
    }
    
    // Update biome distribution based on season
    state.biomeDistribution = {
        forest: randomInt(75, 90),
        mountain: randomInt(15, 30),
        water: randomInt(25, 40),
        desert: randomInt(3, 8),
        plains: randomInt(10, 25),
        swamp: randomInt(5, 15)
    };
}

function updateServerMetrics() {
    state.serverLoad = randomInt(50, 95);
    state.latency = randomInt(5, 45);
    state.memoryUsage = randomInt(60, 90);
    state.diskIO = randomInt(20, 60);
    state.networkIO = randomInt(30, 70);
    
    // Update region stats
    state.regions.forEach(region => {
        region.players += randomInt(-5000, 5000);
        region.players = Math.max(10000, region.players);
        region.load = randomInt(40, 95);
        region.status = region.load > 85 ? 'warning' : 'online';
    });
}

function updatePopulationStats() {
    const popVariation = randomInt(-2000, 3000);
    state.totalPlayers = Math.max(1000000, state.totalPlayers + popVariation);
    state.activePlayers = Math.max(100000, Math.floor(state.totalPlayers * randomFloat(0.25, 0.35)));
    state.newPlayersToday += randomInt(-100, 200);
    state.charactersCreated += randomInt(0, 100);
    state.avgLevel = randomInt(65, 72);
}

function updateEconomy() {
    // Update commodity prices
    state.economy.commodities.forEach(item => {
        const change = randomFloat(-item.volatility, item.volatility);
        item.currentPrice = Math.max(1, item.base * (1 + change));
        item.change = change * 100;
        item.history.push(item.currentPrice);
        if (item.history.length > 50) item.history.shift();
    });
    
    // Update currency
    state.economy.currency.forEach(item => {
        const change = randomFloat(-item.volatility * 0.5, item.volatility * 0.5);
        item.currentPrice = item.base * (1 + change);
        item.change = change * 100;
    });
    
    // Occasionally change market trend
    if (Math.random() < 0.1) {
        state.marketTrend = Math.random() < 0.5 ? 'bullish' : 'bearish';
    }
}

function updateLiveActivity() {
    state.activity.pvpKills += randomInt(-50, 150);
    state.activity.castlesCaptured += randomInt(0, 3) - 1; // Sometimes lost
    state.activity.dragonsSlain += randomInt(0, 5);
    state.activity.auctionsClosed += randomInt(100, 500);
    state.activity.playerDeaths += randomInt(-100, 300);
    state.activity.questsCompleted += randomInt(500, 2000);
    state.activity.itemsCrafted += randomInt(200, 800);
    state.activity.dungeonsCleared += randomInt(10, 100);
    
    // Ensure non-negative
    Object.keys(state.activity).forEach(key => {
        state.activity[key] = Math.max(0, state.activity[key]);
    });
}

function updateEvents() {
    // Add new events occasionally
    if (state.events.length < 10 && Math.random() < 0.4) {
        state.events.unshift(generateEvent());
    }
    
    // Update time ago for existing events
    state.events.forEach(event => {
        event.timeAgo += Math.floor(CONFIG.eventsUpdateInterval / 60000);
    });
    
    // Remove old events (> 2 hours)
    state.events = state.events.filter(e => e.timeAgo < 120);
    
    // Sort by time (newest first)
    state.events.sort((a, b) => b.timeAgo - a.timeAgo);
}

function updateGuildRankings() {
    // Slight ranking changes
    if (Math.random() < 0.3) {
        const idx1 = randomInt(0, state.guilds.length - 2);
        const idx2 = idx1 + 1;
        
        if (state.guilds[idx1].trophies < state.guilds[idx2].trophies + randomInt(-1000, 1000)) {
            [state.guilds[idx1], state.guilds[idx2]] = [state.guilds[idx2], state.guilds[idx1]];
        }
    }
    
    // Update ranks
    state.guilds.forEach((guild, index) => {
        guild.rank = index + 1;
        guild.online = randomInt(0, Math.floor(guild.members * 0.4));
    });
}

// ===== RENDER FUNCTIONS =====
function renderGameTime() {
    const clockEl = document.getElementById('game-clock');
    const dateEl = document.getElementById('game-date');
    
    if (clockEl) {
        clockEl.textContent = formatTime(
            state.gameTime.hours * 3600 +
            state.gameTime.minutes * 60 +
            state.gameTime.seconds
        );
    }
    
    if (dateEl) {
        const dayCycle = state.gameTime.hours < 6 ? '🌙' : state.gameTime.hours < 12 ? '🌅' : state.gameTime.hours < 18 ? '☀️' : '🌙';
        dateEl.textContent = `${dayCycle} Day ${state.gameTime.day} • ${state.gameTime.month} ${state.gameTime.season.name} • Year ${state.gameTime.year}`;
    }
}

function renderWeatherSeason() {
    const weatherEl = document.getElementById('weather-display');
    const seasonEl = document.getElementById('season-display');
    
    if (weatherEl) {
        weatherEl.textContent = state.weather.icon;
        weatherEl.title = `${state.weather.name}: ${state.weather.effect}`;
    }
    
    if (seasonEl) {
        seasonEl.textContent = state.season.icon;
        seasonEl.title = state.season.name;
    }
}

function renderBiomeIndicators() {
    const biomeContainer = document.querySelector('.biome-indicators');
    if (!biomeContainer) return;
    
    let html = '';
    BIOMES.forEach(biome => {
        const percentage = state.biomeDistribution[biome.name.toLowerCase()] || 0;
        html += `<span title="${biome.name} Coverage">${biome.icon} ${percentage}%</span>`;
    });
    biomeContainer.innerHTML = html;
}

function renderQuickStats() {
    const totalPlayersEl = document.getElementById('total-players');
    const activePlayersEl = document.getElementById('active-players');
    const latencyEl = document.getElementById('latency');
    const serverLoadBar = document.querySelector('.top-bar .mini-bar .fill');
    
    if (totalPlayersEl) totalPlayersEl.textContent = formatNumber(state.totalPlayers);
    if (activePlayersEl) activePlayersEl.textContent = formatNumber(state.activePlayers);
    if (latencyEl) latencyEl.textContent = `${state.latency}ms`;
    if (serverLoadBar) serverLoadBar.style.width = `${state.serverLoad}%`;
}

function renderTerritoryGrid() {
    const gridEl = document.getElementById('territory-grid');
    if (!gridEl) return;
    
    const grid = state.territoryGrid || generateTerritoryGrid();
    state.territoryGrid = grid;
    
    let html = '';
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const kingdom = grid[y][x];
            let className = 'territory-cell';
            if (kingdom !== 'neutral') {
                className += ` kingdom-${kingdom}`;
            }
            html += `<div class="${className}" data-x="${x}" data-y="${y}" data-kingdom="${kingdom}"></div>`;
        }
    }
    gridEl.innerHTML = html;
    
    // Add interactive tooltips
    gridEl.querySelectorAll('.territory-cell').forEach(cell => {
        cell.addEventListener('click', (e) => {
            const kingdomId = cell.dataset.kingdom;
            if (kingdomId !== 'neutral') {
                const kingdom = KINGDOMS.find(k => k.id === kingdomId);
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                
                showTooltip(e.target, `
                    <h4>${kingdom.name} Territory</h4>
                    <div class="tooltip-row"><span class="label">Race:</span><span class="value">${kingdom.race}</span></div>
                    <div class="tooltip-row"><span class="label">Ruler:</span><span class="value">${kingdom.ruler}</span></div>
                    <div class="tooltip-row"><span class="label">Position:</span><span class="value">(${x}, ${y})</span></div>
                    <div class="tooltip-row"><span class="label">Control:</span><span class="value">${randomInt(60, 95)}%</span></div>
                    <div class="tooltip-row"><span class="label">Population:</span><span class="value">${formatNumber(randomInt(100000, 500000))}</span></div>
                    <div class="tooltip-row"><span class="label">Military:</span><span class="value">${formatNumber(randomInt(5000, 20000))}</span></div>
                    <div class="tooltip-row"><span class="label">Resources:</span><span class="value">${randomInt(3, 8)} types</span></div>
                `);
            }
        });
    });
}

function renderGuildRankings() {
    const tbody = document.getElementById('guild-rankings-body');
    if (!tbody) return;
    
    const guilds = state.guilds || generateGuilds();
    state.guilds = guilds;
    
    let html = '';
    guilds.slice(0, 15).forEach(guild => {
        const rankClass = guild.rank <= 3 ? 'top-rank' : '';
        html += `
            <tr class="${rankClass}">
                <td class="guild-rank">${guild.rank}</td>
                <td class="guild-name">
                    <span class="guild-tag">[${guild.tag}]</span> ${guild.name}
                    ${guild.alliance ? `<br><small style="color:var(--text-muted)">${guild.alliance}</small>` : ''}
                </td>
                <td class="guild-members">
                    <span class="online-count" style="color:var(--accent-green)">${guild.online}</span>/${guild.members}
                </td>
                <td class="guild-trophies">${formatNumber(guild.trophies)}</td>
                <td class="guild-wins">${guild.wins}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderAlliances() {
    const allianceList = document.getElementById('alliance-list');
    if (!allianceList) return;
    
    const alliances = state.alliances || generateAlliances();
    state.alliances = alliances;
    
    let html = '';
    alliances.forEach(alliance => {
        html += `
            <div class="alliance-item">
                <div class="alliance-info">
                    <span class="alliance-name">${alliance.name}</span>
                    <span class="alliance-guilds">${alliance.guilds.length} guilds</span>
                </div>
                <div class="alliance-stats">
                    <span class="stat">${formatNumber(alliance.totalMembers)} members</span>
                    <span class="stat">${formatNumber(alliance.totalTrophies)} trophies</span>
                    <span class="stat">${alliance.avgWinRate}% WR</span>
                </div>
            </div>
        `;
    });
    allianceList.innerHTML = html || '<div class="alliance-item">No alliances formed</div>';
}

function renderEvents() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    
    updateEvents();
    
    let html = '';
    state.events.slice(0, 8).forEach(event => {
        const severityClass = event.severity === 'urgent' ? 'urgent' : event.severity === 'high' ? 'high' : '';
        html += `
            <div class="event-item ${severityClass}" data-id="${event.id}">
                ${event.icon} <strong>${event.name}</strong> in ${event.location}
                <span class="event-meta">
                    <span class="event-time">${getTimeAgo(event.timeAgo)}</span>
                    <span class="event-participants">👥 ${formatNumber(event.participants)}</span>
                </span>
            </div>
        `;
    });
    eventsList.innerHTML = html || '<div class="event-item">No active events</div>';
}

function renderRaids() {
    const raidGrid = document.getElementById('raid-grid');
    if (!raidGrid) return;
    
    const raids = state.raids || generateRaids();
    state.raids = raids;
    
    let html = '';
    raids.forEach(raid => {
        const progressColor = raid.progress > 80 ? 'var(--accent-green)' : raid.progress > 50 ? 'var(--accent-orange)' : 'var(--accent-red)';
        html += `
            <div class="raid-card ${raid.popular ? 'popular' : ''}">
                <div class="raid-header">
                    <div class="raid-name">
                        ${raid.name}
                        <span class="raid-type">${raid.type}</span>
                        <span class="raid-difficulty" style="color:${raid.difficultyColor}">${raid.difficulty}</span>
                    </div>
                    <div class="raid-level">Lv. ${raid.level}</div>
                </div>
                <div class="raid-progress-bar">
                    <div class="raid-progress-fill" style="width: ${raid.progress}%; background:${progressColor}"></div>
                </div>
                <div class="raid-stats-grid">
                    <div class="raid-stat">
                        <span class="label">Bosses</span>
                        <span class="value">${raid.bossesDefeated}/${raid.bossCount}</span>
                    </div>
                    <div class="raid-stat">
                        <span class="label">Attempts</span>
                        <span class="value">${formatNumber(raid.attempts)}</span>
                    </div>
                    <div class="raid-stat">
                        <span class="label">Best Time</span>
                        <span class="value">${raid.bestTime}</span>
                    </div>
                    <div class="raid-stat">
                        <span class="label">Fastest Kill</span>
                        <span class="value">${raid.fastestKill}</span>
                    </div>
                    <div class="raid-stat">
                        <span class="label">Loot</span>
                        <span class="value" style="color:${raid.lootQuality === 'Epic' ? 'var(--accent-purple)' : raid.lootQuality === 'Rare' ? 'var(--accent-blue)' : 'var(--text-secondary)'}">${raid.lootQuality}</span>
                    </div>
                    <div class="raid-stat">
                        <span class="label">Last Kill</span>
                        <span class="value">${raid.lastKill}</span>
                    </div>
                </div>
                <div class="raid-footer">
                    <span class="reset-timer">Reset: ${raid.nextReset}</span>
                </div>
            </div>
        `;
    });
    raidGrid.innerHTML = html;
}

function renderEconomy() {
    // Render ticker
    const tickerContainer = document.querySelector('.market-ticker');
    if (tickerContainer) {
        const tickerItems = [
            state.economy.currency.find(i => i.name === 'Gold'),
            state.economy.currency.find(i => i.name === 'Diamond'),
            state.economy.materials.find(i => i.name === 'Dragonbone') || state.economy.materials[2],
            state.economy.materials.find(i => i.name === 'Phoenix Tear') || state.economy.materials[3]
        ].filter(Boolean);
        
        let html = '';
        tickerItems.forEach(item => {
            const isPositive = item.change >= 0;
            html += `
                <div class="ticker-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.currentPrice.toFixed(2)}${item.symbol}</span>
                    <span class="item-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '▲' : '▼'}${Math.abs(item.change).toFixed(1)}%
                    </span>
                </div>
            `;
        });
        tickerContainer.innerHTML = html;
    }
    
    // Render sparkline chart
    const chartEl = document.getElementById('commodities-chart');
    if (chartEl) {
        const commodities = state.economy.commodities || generateEconomyData().commodities;
        renderSparklineChart(chartEl, commodities);
    }
}

function renderSparklineChart(container, data) {
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 120;
    const padding = 5;
    
    // Clear existing
    container.innerHTML = '';
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    // Find min/max across all datasets
    let allValues = [];
    data.forEach(item => {
        if (item.history) {
            allValues.push(...item.history);
        }
    });
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;
    
    // Draw each line
    data.forEach(item => {
        if (!item.history || item.history.length < 2) return;
        
        const points = item.history.map((val, i) => {
            const x = padding + (i / (item.history.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((val - minVal) / range) * (height - 2 * padding);
            return `${x},${y}`;
        });
        
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points.join(' '));
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', item.color || '#4dabf7');
        polyline.setAttribute('stroke-width', '1.5');
        polyline.setAttribute('stroke-opacity', '0.7');
        polyline.setAttribute('stroke-linejoin', 'round');
        polyline.setAttribute('stroke-linecap', 'round');
        svg.appendChild(polyline);
    });
    
    container.appendChild(svg);
}

function renderClassDistribution() {
    const barsContainer = document.getElementById('class-bars');
    if (!barsContainer) return;
    
    const distribution = state.classDistribution || generateClassDistribution();
    state.classDistribution = distribution;
    
    let html = '';
    distribution.forEach(item => {
        html += `
            <div class="class-bar-item">
                <span class="class-name">${item.icon} ${item.class}</span>
                <div class="class-bar">
                    <div class="class-fill" style="width: ${item.percentage}%; background:${item.color}"></div>
                </div>
                <span class="class-count">${formatNumber(item.count)}</span>
                <span class="class-percent">${item.percentage}%</span>
            </div>
        `;
    });
    barsContainer.innerHTML = html;
}

function renderFactionPie() {
    const pieEl = document.getElementById('faction-pie');
    if (!pieEl) return;
    
    const factions = [
        { name: 'Alliance', percentage: 42, color: '#c0392b' },
        { name: 'Horde', percentage: 38, color: '#8e44ad' },
        { name: 'Neutral', percentage: 20, color: '#7f8c8d' }
    ];
    
    let gradientStr = '';
    let currentAngle = 0;
    
    factions.forEach(faction => {
        const angle = (faction.percentage / 100) * 360;
        gradientStr += `${faction.color} ${currentAngle}deg ${currentAngle + angle}deg, `;
        currentAngle += angle;
    });
    
    gradientStr = gradientStr.slice(0, -2);
    pieEl.style.background = `conic-gradient(${gradientStr})`;
}

function renderTopPlayers() {
    const tbody = document.getElementById('top-players-body');
    if (!tbody) return;
    
    const players = state.topPlayers || generateTopPlayers();
    state.topPlayers = players;
    
    let html = '';
    players.forEach(player => {
        const rankClass = player.rank <= 3 ? 'top-rank' : '';
        html += `
            <tr class="${rankClass}">
                <td class="player-rank">${player.rank}</td>
                <td class="player-name">
                    ${player.displayName}
                    ${player.guild ? `<br><small>${player.guildTag} ${player.guild}</small>` : ''}
                </td>
                <td class="player-level"><strong>${player.level}</strong></td>
                <td class="player-class">${player.class.icon} ${player.class.name}</td>
                <td class="player-realm">${player.realm}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderServerRegions() {
    const regionList = document.querySelector('.region-status');
    if (!regionList) return;
    
    let html = '';
    state.regions.forEach(region => {
        const statusClass = region.status === 'online' ? 'online' : region.status === 'warning' ? 'warning' : 'offline';
        html += `
            <div class="region-item">
                <span class="region-name">${region.name}</span>
                <span class="status-dot ${statusClass}"></span>
                <span class="region-players">${formatNumber(region.players)}</span>
            </div>
        `;
    });
    regionList.innerHTML = html;
}

function renderServerMetrics() {
    const metricValues = document.querySelectorAll('.server-metrics-panel .metric-value');
    if (metricValues.length >= 4) {
        metricValues[0].textContent = `${state.serverLoad}%`;
        metricValues[1].textContent = `${state.memoryUsage}%`;
        metricValues[2].textContent = `${state.diskIO}%`;
        metricValues[3].textContent = `${state.networkIO}%`;
    }
    
    const bars = document.querySelectorAll('.server-metrics-panel .mini-bar .fill');
    bars.forEach((bar, idx) => {
        const values = [state.serverLoad, state.memoryUsage, state.diskIO, state.networkIO];
        bar.style.width = `${values[idx]}%`;
        bar.style.transition = 'width 1s ease';
    });
}

function renderActivityStats() {
    const activityStats = document.querySelectorAll('.activity-panel .activity-value');
    if (activityStats.length >= 8) {
        activityStats[0].textContent = formatNumber(state.activity.pvpKills);
        activityStats[1].textContent = formatNumber(state.activity.castlesCaptured);
        activityStats[2].textContent = formatNumber(state.activity.dragonsSlain);
        activityStats[3].textContent = formatNumber(state.activity.auctionsClosed);
        activityStats[4].textContent = formatNumber(state.activity.playerDeaths);
        activityStats[5].textContent = formatNumber(state.activity.questsCompleted);
        activityStats[6].textContent = formatNumber(state.activity.itemsCrafted);
        activityStats[7].textContent = formatNumber(state.activity.dungeonsCleared);
    }
}

function renderFooterLog() {
    const logContainer = document.getElementById('system-log');
    if (!logContainer) return;
    
    const messages = [
        'System health check passed.',
        'Database synchronization complete.',
        'New player connections established.',
        'Quest database updated.',
        'Auction house data refreshed.',
        'Guild rankings recalculated.',
        'Economy balancing applied.',
        'Weather patterns synchronized.',
        'Anti-cheat scan completed.',
        'Server performance optimized.',
        'New regions loaded successfully.',
        'Player activity metrics collected.',
        'Security protocols active.',
        'Backup system operational.',
        'Patch v4.7.3 deployed.',
        `Market trend: ${state.marketTrend === 'bullish' ? '📈 Bullish' : '📉 Bearish'}`,
        `${state.events.length} active world events.`,
        `${state.guilds.filter(g => g.online > 0).length} guilds with online members.`
    ];
    
    if (Math.random() < 0.4) {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        const message = messages[randomInt(0, messages.length - 1)];
        const logEntry = `<span>[${timestamp}] ${message}</span>`;
        
        logContainer.innerHTML = logEntry + logContainer.innerHTML;
        
        // Keep only last 8 entries
        const entries = logContainer.querySelectorAll('span');
        if (entries.length > 8) {
            entries[entries.length - 1].remove();
        }
    }
}

// ===== TOOLTIP SYSTEM =====
function showTooltip(target, content) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    clearTimeout(state.tooltipTimeout);
    
    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
    
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 10;
    
    // Boundary checks
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = rect.top - tooltipRect.height - 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    
    // Auto-hide after 5 seconds
    state.tooltipTimeout = setTimeout(hideTooltip, 5000);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Panel minimize buttons
    document.querySelectorAll('.minimize-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const panel = btn.closest('.panel');
            const content = panel.querySelector('.panel-content');
            const panelId = panel.querySelector('.panel-header h2').textContent.trim();
            
            if (content.style.display === 'none') {
                content.style.display = 'flex';
                btn.textContent = '−';
                panel.classList.remove('minimized');
                state.minimizedPanels.delete(panelId);
            } else {
                content.style.display = 'none';
                btn.textContent = '+';
                panel.classList.add('minimized');
                state.minimizedPanels.add(panelId);
            }
        });
    });
    
    // Tab switching for economy
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.activeTab = e.target.dataset.tab;
            
            // Would load different data in a real implementation
            renderEconomy();
        });
    });
    
    // Hide tooltip on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.territory-cell') && !e.target.closest('.tooltip')) {
            hideTooltip();
        }
    });
    
    // Manual refresh button
    const refreshBtn = document.getElementById('manual-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            addSystemLog('Manual data refresh triggered by user.');
            refreshAllData();
        });
    }
    
    // Territory grid resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderTerritoryGrid();
            if (document.getElementById('commodities-chart')) {
                renderEconomy();
            }
        }, 250);
    });
}

function addSystemLog(message) {
    const logContainer = document.getElementById('system-log');
    if (!logContainer) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logEntry = `<span>[${timestamp}] ${message}</span>`;
    
    logContainer.innerHTML = logEntry + logContainer.innerHTML;
    
    // Keep only last 10 entries
    const entries = logContainer.querySelectorAll('span');
    if (entries.length > 10) {
        entries[entries.length - 1].remove();
    }
}

// ===== MAIN LOOPS =====
function gameLoop() {
    state.tick++;
    
    // Update every second (simulated)
    if (state.tick % CONFIG.clockUpdateInterval === 0) {
        updateGameTime();
        renderGameTime();
        
        // Every 5 seconds update some stats
        if (state.tick % 5 === 0) {
            updatePopulationStats();
            renderQuickStats();
        }
    }
    
    // Every 15 seconds update weather/season display
    if (state.tick % 15 === 0) {
        updateWeatherSeason();
        renderWeatherSeason();
        renderBiomeIndicators();
    }
    
    // Every 30 seconds update various data
    if (state.tick % 30 === 0) {
        updateServerMetrics();
        updateLiveActivity();
        updateGuildRankings();
        
        renderServerMetrics();
        renderActivityStats();
        renderGuildRankings();
        renderTopPlayers();
    }
    
    // Every minute (60 ticks)
    if (state.tick % 60 === 0) {
        updateEconomy();
        updateEvents();
        renderEconomy();
        renderEvents();
        renderFooterLog();
    }
    
    // Every 5 minutes (300 ticks) - full refresh
    if (state.tick % 300 === 0) {
        refreshAllData();
    }
}

// ===== INITIALIZATION =====
function init() {
    console.log('Initializing Aethelgard World Simulation Dashboard...');
    
    // Generate initial data
    state.territoryGrid = generateTerritoryGrid();
    state.guilds = generateGuilds();
    state.alliances = generateAlliances();
    state.raids = generateRaids();
    state.economy = generateEconomyData();
    state.classDistribution = generateClassDistribution();
    state.topPlayers = generateTopPlayers();
    state.events = Array.from({ length: 5 }, generateEvent);
    
    // Initial renders
    renderGameTime();
    renderWeatherSeason();
    renderBiomeIndicators();
    renderTerritoryGrid();
    renderGuildRankings();
    renderAlliances();
    renderEvents();
    renderRaids();
    renderEconomy();
    renderClassDistribution();
    renderFactionPie();
    renderTopPlayers();
    renderServerRegions();
    renderServerMetrics();
    renderActivityStats();
    renderQuickStats();
    renderFooterLog();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start simulation loops
    setInterval(gameLoop, 1000);
    setInterval(() => {
        // Additional periodic updates
        if (Math.random() < 0.3) {
            updateEconomy();
            renderEconomy();
        }
    }, CONFIG.tickerUpdateInterval);
    
    // Full data refresh every 5 minutes
    setInterval(refreshAllData, 300000);
    
    addSystemLog('Dashboard initialized successfully.');
    addSystemLog(`Connected to ${state.regions.length} server regions.`);
    addSystemLog(`Tracking ${formatNumber(state.totalPlayers)} players.`);
    console.log('Aethelgard Dashboard v4.7.2 loaded and running.');
}

function refreshAllData() {
    addSystemLog('Full data refresh initiated...');
    
    state.guilds = generateGuilds();
    state.alliances = generateAlliances();
    state.raids = generateRaids();
    state.economy = generateEconomyData();
    state.classDistribution = generateClassDistribution();
    state.topPlayers = generateTopPlayers();
    state.events = Array.from({ length: randomInt(3, 8) }, generateEvent);
    
    renderGuildRankings();
    renderAlliances();
    renderRaids();
    renderEconomy();
    renderClassDistribution();
    renderTopPlayers();
    renderEvents();
    renderTerritoryGrid();
    
    addSystemLog('Data refresh complete.');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Expose state for debugging (optional)
window.AethelgardState = state;
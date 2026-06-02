/* ═══════════════════════════════════════════════════════════
   REALM OF AETHERMOOR — DASHBOARD CONTROLLER
   Simulates live data, interactions, and visual effects
   ═══════════════════════════════════════════════════════════ */

// ───────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────────

const Utils = {
    random: (min, max) => Math.random() * (max - min) + min,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
    padZero: (num) => num.toString().padStart(2, '0'),
    formatNumber: (num) => num.toLocaleString('en-US'),
    clamp: (num, min, max) => Math.min(Math.max(num, min), max),
    
    // Generate a unique ID
    uuid: () => '_' + Math.random().toString(36).substr(2, 9),
    
    // Weighted random for rarities
    weightedRandom: (options) => {
        let i, sum = 0, r = Math.random();
        for (i in options) {
            sum += options[i];
            if (r <= sum) return i;
        }
    }
};

// ───────────────────────────────────────────────────────────
// STATE & DATA
// ───────────────────────────────────────────────────────────

const AppState = {
    tick: 0,
    marketItems: [],
    feedItems: [],
    chatMessages: [],
    populationData: [],
    mapRegions: [],
    updateInterval: null
};

// Market Item Templates
const MarketTemplates = [
    { name: 'Starfall Ore', category: 'Materials', basePrice: 245 },
    { name: 'Dragonbone Shard', category: 'Materials', basePrice: 1850 },
    { name: 'Elixir of Haste', category: 'Consumables', basePrice: 120 },
    { name: 'Shadowweave Cloth', category: 'Materials', basePrice: 85 },
    { name: 'Void-Touched Blade', category: 'Weapons', basePrice: 12500 },
    { name: 'Plate of the Ancients', category: 'Armor', basePrice: 15000 },
    { name: 'Mana Crystal (L)', category: 'Reagents', basePrice: 450 },
    { name: 'Phoenix Feather', category: 'Reagents', basePrice: 2200 },
    { name: 'Ironwood Plank', category: 'Materials', basePrice: 45 },
    { name: 'Scroll of Recall', category: 'Consumables', basePrice: 35 },
    { name: 'Rune of Warding', category: 'Enchantments', basePrice: 600 },
    { name: 'Aether Dust', category: 'Materials', basePrice: 180 }
];

// Feed Event Templates
const FeedTemplates = {
    combat: [
        '<strong>{guild1}</strong> raided <strong>{guild2}</strong> outpost at <em>{location}</em> — <strong>{outcome}</strong>',
        '<strong>{guild1}</strong> defended <em>{location}</em> against siege — <strong>{outcome}</strong>'
    ],
    raid: [
        '<strong>{guild}</strong> defeated <strong>{boss}</strong> in {dungeon} — <strong>{loot}</strong>',
        '<strong>{guild}</strong> wiped on Boss 4 in {dungeon} — Attempt #{attempt}'
    ],
    market: [
        '<strong>{item}</strong> price surged to <strong>{price} 🪙</strong> — +{pct}%',
        '<strong>{player}</strong> bought <strong>{item}</strong> for <strong>{price} 🪙</strong>'
    ],
    player: [
        '<strong>{player}</strong> reached <strong>Level {level}</strong> {class}!',
        '<strong>{player}</strong> unlocked achievement <em>{achievement}</em>'
    ],
    world: [
        '🌋 <strong>World Event:</strong> Volcanic eruption detected near <em>{location}</em>',
        '🌙 <strong>Lunar Event:</strong> Blood Moon rising — Undead spawn rate +50%',
        '✨ <strong>Ley Line:</strong> Surge detected at <em>{location}</em> — Magic power +30%'
    ],
    guild: [
        '<strong>{guild}</strong> upgraded fortress to Level <strong>{level}</strong>',
        '<strong>{guild}</strong> recruited <strong>{count}</strong> new members'
    ]
};

const DataPools = {
    guilds: ['Crimson Vanguard', 'Silver Concord', 'Eclipse Covenant', 'Infernal Legion', 'Verdant Order', 'Stormbreakers', 'Diamond Shield', 'Black Talon', 'Shadow Reavers', 'Iron Wardens'],
    players: ['Thornwick', 'Lyra', 'ShadowKnight', 'Gorim', 'Nightblade', 'Elara', 'Kaelen', 'Vesper', 'Roric', 'Seraphina', 'Dax', 'Mira'],
    locations: ['Kael\'s Border', 'Ironhold Pass', 'Whispering Woods', 'Dragon\'s Maw', 'Abyssal Depths', 'Frostveil Peaks', 'Shadowfen', 'Sunken Citadel'],
    bosses: ['Malachar the Undying', 'Xal\'thar the Frozen', 'Gorgoth the Worldbreaker', 'Lady Vespera', 'The Weaver', 'Void Lord'],
    dungeons: ['Dragon\'s Maw Catacombs', 'Abyssal Sanctum', 'Frozen Spire', 'Weaver\'s Abyss', 'Shadow Citadel', 'Thunder Peak'],
    items: ['Starfall Blade', 'Dragonheart Amulet', 'Shadowweave Robe', 'Ironclad Shield', 'Elixir of Giants', 'Rune of Fire'],
    classes: ['Berserker', 'Archmage', 'Shadow Ranger', 'Paladin', 'Druid', 'Rogue', 'Necromancer'],
    achievements: ['Dragon Slayer', 'Master Crafter', 'Wealth Hoarder', 'PvP Champion', 'Explorer Supreme', 'Speed Runner']
};

// ───────────────────────────────────────────────────────────
// MODULES
// ───────────────────────────────────────────────────────────

const ClockModule = {
    el: null,
    dateEl: null,
    dayCount: 247,
    minute: 32,
    second: 7,
    hour: 14,
    
    init() {
        const clockEl = document.querySelector('.clock-display .time');
        const dateEl = document.querySelector('.clock-display .date');
        if (clockEl && dateEl) {
            this.el = clockEl;
            this.dateEl = dateEl;
            this.update();
            setInterval(() => this.tick(), 1000);
        }
    },
    
    tick() {
        this.second++;
        if (this.second >= 60) {
            this.second = 0;
            this.minute++;
            if (this.minute >= 60) {
                this.minute = 0;
                this.hour++;
                if (this.hour >= 24) {
                    this.hour = 0;
                    this.dayCount++;
                }
            }
        }
        this.update();
    },
    
    update() {
        this.el.textContent = `🕐 ${Utils.padZero(this.hour)}:${Utils.padZero(this.minute)}:${Utils.padZero(this.second)}`;
        this.dateEl.textContent = `📅 3rd of Frostveil, Era VII`; // Static era for now, dynamic day could be added
    }
};

const MarketModule = {
    container: null,
    rows: [],
    
    init() {
        this.container = document.getElementById('marketRows');
        if (!this.container) return;
        
        // Initialize market items
        AppState.marketItems = MarketTemplates.map((t, i) => ({
            ...t,
            currentPrice: t.basePrice + Utils.randomInt(-20, 20),
            trend: 0, // -1, 0, 1
            volume: Utils.randomInt(100, 5000)
        }));
        
        this.render();
        
        // Update prices periodically
        setInterval(() => this.updatePrices(), 3000);
    },
    
    render() {
        this.container.innerHTML = '';
        AppState.marketItems.forEach((item, i) => {
            const row = document.createElement('div');
            row.className = 'market-row';
            row.innerHTML = `
                <span>${item.name}</span>
                <span>${item.category}</span>
                <span>${Utils.formatNumber(item.currentPrice)} 🪙</span>
                <span>${Utils.formatNumber(item.currentPrice - 5)} 🪙</span>
                <span>${Utils.formatNumber(item.volume)}</span>
                <span class="trend-${item.trend === 1 ? 'up' : item.trend === -1 ? 'down' : 'flat'}">${item.trend === 1 ? '▲' : item.trend === -1 ? '▼' : '─'}</span>
                <span>${item.trend !== 0 ? (Utils.random(0.1, 5).toFixed(1)) : '0.0'}%</span>
            `;
            this.container.appendChild(row);
        });
    },
    
    updatePrices() {
        AppState.marketItems.forEach(item => {
            const change = Utils.randomInt(-15, 18);
            item.currentPrice = Utils.clamp(item.currentPrice + change, 10, 99999);
            item.trend = change > 5 ? 1 : change < -5 ? -1 : 0;
            item.volume += Utils.randomInt(-50, 50);
            item.volume = Utils.clamp(item.volume, 0, 99999);
        });
        
        // Re-render only changed rows for performance (or full re-render for simplicity in this demo)
        this.render();
    }
};

const FeedModule = {
    container: null,
    
    init() {
        this.container = document.getElementById('activityFeed');
        if (!this.container) return;
        
        // Add new items periodically
        setInterval(() => this.addItem(), 4500);
    },
    
    addItem() {
        if (!this.container) return;
        
        const type = Utils.randomChoice(Object.keys(FeedTemplates));
        const templates = FeedTemplates[type];
        let text = Utils.randomChoice(templates);
        
        // Replace placeholders
        text = text
            .replace(/{guild1}/g, Utils.randomChoice(DataPools.guilds))
            .replace(/{guild2}/g, Utils.randomChoice(DataPools.guilds))
            .replace(/{guild}/g, Utils.randomChoice(DataPools.guilds))
            .replace(/{player}/g, Utils.randomChoice(DataPools.players))
            .replace(/{location}/g, Utils.randomChoice(DataPools.locations))
            .replace(/{boss}/g, Utils.randomChoice(DataPools.bosses))
            .replace(/{dungeon}/g, Utils.randomChoice(DataPools.dungeons))
            .replace(/{item}/g, Utils.randomChoice(DataPools.items))
            .replace(/{achievement}/g, Utils.randomChoice(DataPools.achievements))
            .replace(/{class}/g, Utils.randomChoice(DataPools.classes))
            .replace(/{outcome}/g, Utils.randomChoice(['+2 regions', 'Victory!', 'Defeat...', 'Stalemate', 'Critical Hit!']))
            .replace(/{loot}/g, Utils.randomChoice(['2 Legendary drops', '1 Mythic drop', '5 Rare items', 'Epic gear set']))
            .replace(/{attempt}/g, Utils.randomInt(1, 50))
            .replace(/{level}/g, Utils.randomInt(50, 100))
            .replace(/{price}/g, Utils.formatNumber(Utils.randomInt(100, 5000)))
            .replace(/{pct}/g, Utils.randomInt(5, 45))
            .replace(/{count}/g, Utils.randomInt(1, 20));
            
        const now = new Date();
        const timeStr = `${Utils.padZero(now.getHours())}:${Utils.padZero(now.getMinutes())}:${Utils.padZero(now.getSeconds())}`;
        
        const item = document.createElement('div');
        item.className = `feed-item event-${type}`;
        item.innerHTML = `
            <span class="feed-time">${timeStr}</span>
            <span class="feed-icon">${this.getIconForType(type)}</span>
            <span class="feed-text">${text}</span>
        `;
        
        this.container.insertBefore(item, this.container.firstChild);
        
        // Limit items to prevent DOM bloat
        if (this.container.children.length > 30) {
            this.container.removeChild(this.container.lastChild);
        }
    },
    
    getIconForType(type) {
        const icons = {
            combat: '⚔️',
            raid: '🐲',
            market: '💰',
            player: '👑',
            guild: '🏰',
            world: '🌋'
        };
        return icons[type] || '📡';
    }
};

const ChatModule = {
    container: null,
    input: null,
    sendBtn: null,
    
    messages: [
        { time: '14:31', name: '[GM]Aethermoor', color: '#ffd700', text: 'Mount Pyraxis event starting in 5 minutes! Head to Southern Wastes!' },
        { time: '14:30', name: 'Thornwick', color: '#ff6b6b', text: 'Need 2 more healers for Dragon\'s Maw Mythic! Whisper me' },
        { time: '14:29', name: 'Lyra', color: '#4ecdc4', text: 'WTB Starfall Ore x50 — offering 200g each' },
        { time: '14:28', name: 'xShadowKnight', color: '#95e1d3', text: 'GG on that arena match! Best season yet' },
        { time: '14:27', name: 'Gorim', color: '#f38181', text: 'Selling Dragonbone Plate set — 500k for full set, DM offers' }
    ],
    
    init() {
        this.container = document.getElementById('chatMessages');
        this.input = document.querySelector('.chat-input');
        this.sendBtn = document.querySelector('.chat-send');
        
        if (this.container) {
            this.render();
            
            // Auto-scroll
            this.container.scrollTop = this.container.scrollHeight;
            
            // Add simulated messages
            setInterval(() => this.addSimulatedMessage(), 6000);
        }
        
        // Input handler
        if (this.sendBtn && this.input) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    },
    
    render() {
        this.container.innerHTML = '';
        this.messages.forEach(msg => this.appendMessage(msg));
    },
    
    appendMessage(msg) {
        const div = document.createElement('div');
        div.className = 'chat-msg';
        div.innerHTML = `<span class="chat-time">${msg.time}</span> <span class="chat-name" style="color: ${msg.color};">[${msg.name}]:</span> ${msg.text}`;
        this.container.appendChild(div);
    },
    
    addSimulatedMessage() {
        const player = Utils.randomChoice(DataPools.players);
        const color = Utils.randomChoice(['#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#ffd700']);
        const texts = [
            'LFG for Abyssal Sanctum, need tank and healer',
            'Anyone selling Void Essence?',
            'Just hit Exalted with Royal Guard!',
            'That raid was insane! GG everyone',
            'WTB 100 Ironwood Planks, pm me prices',
            'Siege starting at Kael\'s Border in 10 mins',
            'New patch notes look good',
            'How do I unlock the hidden dungeon?',
            'Selling rare mounts, check my trade post'
        ];
        
        const msg = {
            time: `${Utils.padZero(new Date().getHours())}:${Utils.padZero(new Date().getMinutes())}`,
            name: player,
            color: color,
            text: Utils.randomChoice(texts)
        };
        
        this.messages.push(msg);
        if (this.messages.length > 50) this.messages.shift();
        this.appendMessage(msg);
        this.container.scrollTop = this.container.scrollHeight;
    },
    
    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;
        
        const msg = {
            time: `${Utils.padZero(new Date().getHours())}:${Utils.padZero(new Date().getMinutes())}`,
            name: 'Commander',
            color: '#d4a843',
            text: text
        };
        
        this.messages.push(msg);
        this.appendMessage(msg);
        this.container.scrollTop = this.container.scrollHeight;
        this.input.value = '';
    }
};

const ChartModule = {
    canvas: null,
    ctx: null,
    data: [],
    
    init() {
        this.canvas = document.getElementById('populationChart');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Generate initial data
        for (let i = 0; i < 40; i++) {
            this.data.push(Utils.randomInt(10000, 14000));
        }
        
        this.draw();
        window.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
        
        // Update chart periodically
        setInterval(() => {
            this.data.shift();
            this.data.push(Utils.randomInt(10500, 13500));
            this.draw();
        }, 2000);
    },
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    },
    
    draw() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(212, 168, 67, 0.3)');
        gradient.addColorStop(1, 'rgba(212, 168, 67, 0)');
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        const step = width / (this.data.length - 1);
        const min = Math.min(...this.data) * 0.95;
        const max = Math.max(...this.data) * 1.05;
        const range = max - min;
        
        this.data.forEach((val, i) => {
            const x = i * step;
            const y = height - ((val - min) / range) * height;
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Line
        ctx.beginPath();
        this.data.forEach((val, i) => {
            const x = i * step;
            const y = height - ((val - min) / range) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#d4a843';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
};

const MapModule = {
    svg: null,
    
    init() {
        this.svg = document.querySelector('.territory-svg');
        if (!this.svg) return;
        
        this.drawRegions();
    },
    
    drawRegions() {
        const ns = 'http://www.w3.org/2000/svg';
        const regions = [
            { id: 'r1', points: '20,20 120,10 150,80 60,90 10,50', color: '#3498db', name: 'Northern Reach' },
            { id: 'r2', points: '130,10 220,5 250,60 180,80 150,80', color: '#e74c3c', name: 'Shadowlands' },
            { id: 'r3', points: '10,50 60,90 80,150 20,140 5,100', color: '#f39c12', name: 'Westwood' },
            { id: 'r4', points: '60,90 150,80 180,80 200,140 120,160 80,150', color: '#2ecc71', name: 'Heartlands' },
            { id: 'r5', points: '180,80 250,60 300,80 320,150 250,160 200,140', color: '#9b59b6', name: 'Arcane Peaks' },
            { id: 'r6', points: '20,140 80,150 120,160 140,240 60,250 30,200', color: '#1abc9c', name: 'Mystic Vale' },
            { id: 'r7', points: '120,160 200,140 250,160 280,220 220,260 140,240', color: '#e67e22', name: 'Dragon Coast' },
            { id: 'r8', points: '250,160 320,150 380,180 360,250 300,260 280,220', color: '#7f8c8d', name: 'Wastelands' },
            { id: 'r9', points: '140,240 220,260 300,260 320,290 180,300 120,290', color: '#d4a843', name: 'Southern Isles' }
        ];
        
        // Clear existing paths except defs
        const defs = this.svg.querySelector('defs');
        this.svg.innerHTML = '';
        this.svg.appendChild(defs);
        
        regions.forEach(region => {
            const polygon = document.createElementNS(ns, 'polygon');
            polygon.setAttribute('points', region.points);
            polygon.setAttribute('fill', region.color);
            polygon.setAttribute('fill-opacity', '0.4');
            polygon.setAttribute('stroke', region.color);
            polygon.setAttribute('stroke-width', '1');
            polygon.setAttribute('stroke-opacity', '0.8');
            polygon.classList.add('map-region');
            
            // Add hover effect via JS
            polygon.addEventListener('mouseenter', () => {
                polygon.setAttribute('fill-opacity', '0.7');
                polygon.setAttribute('stroke-width', '2');
            });
            polygon.addEventListener('mouseleave', () => {
                polygon.setAttribute('fill-opacity', '0.4');
                polygon.setAttribute('stroke-width', '1');
            });
            
            this.svg.appendChild(polygon);
            
            // Label
            const points = region.points.split(' ').map(p => p.split(',').map(Number));
            const center = points.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]).map(v => v / points.length);
            
            const text = document.createElementNS(ns, 'text');
            text.setAttribute('x', center[0]);
            text.setAttribute('y', center[1]);
            text.setAttribute('fill', '#ffffff');
            text.setAttribute('font-size', '8');
            text.setAttribute('font-family', 'JetBrains Mono, monospace');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('pointer-events', 'none');
            text.setAttribute('opacity', '0.8');
            text.textContent = region.name;
            
            this.svg.appendChild(text);
        });
    }
};

const TickerModule = {
    container: null,
    text: '',
    position: 0,
    
    init() {
        this.container = document.getElementById('globalTicker');
        if (!this.container) return;
        
        this.text = '📊 Realm population at 78% capacity — ⚔️ 3 world events active — 🐉 Dragon\'s Maw world first attempt in progress — 💰 Market volatility: Moderate — ❄️ Deep Winter begins in 4 days — ⚒️ Crafting festival starts tomorrow!';
        
        this.animate();
    },
    
    animate() {
        if (!this.container) return;
        
        this.position -= 1;
        if (this.position < -this.container.scrollWidth) {
            this.position = this.container.clientWidth;
        }
        
        this.container.style.transform = `translateX(${this.position}px)`;
        this.container.textContent = this.text;
        
        requestAnimationFrame(() => this.animate());
    }
};

const ResourceModule = {
    init() {
        // Simulate resource rate fluctuations
        setInterval(() => {
            const items = document.querySelectorAll('.resource-item');
            items.forEach(item => {
                const rateEl = item.querySelector('.resource-rate');
                const barFill = item.querySelector('.resource-bar .fill');
                const capEl = item.querySelector('.resource-cap');
                
                if (rateEl && barFill && capEl) {
                    // Parse current rate
                    let currentRate = parseFloat(rateEl.textContent.replace(/[^0-9.-]/g, ''));
                    const change = Utils.randomInt(-20, 20);
                    currentRate = Math.max(0, currentRate + change);
                    
                    // Update text
                    const isNegative = rateEl.textContent.includes('-');
                    rateEl.textContent = `${isNegative ? '-' : '+'}${Utils.formatNumber(currentRate)}/hr`;
                    
                    // Update bar
                    const cap = parseInt(capEl.textContent.split('/')[1]);
                    const current = parseInt(capEl.textContent.split('/')[0]) + change;
                    const pct = Utils.clamp((current / cap) * 100, 0, 100);
                    barFill.style.width = `${pct}%`;
                    
                    // Warning state
                    if (pct > 85) {
                        capEl.classList.add('warning');
                    } else {
                        capEl.classList.remove('warning');
                    }
                }
            });
        }, 5000);
    }
};

// ───────────────────────────────────────────────────────────
// INITIALIZATION
// ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚔️ Initializing Realm of Aethermoor Dashboard...');
    
    // Initialize all modules
    ClockModule.init();
    MarketModule.init();
    FeedModule.init();
    ChatModule.init();
    ChartModule.init();
    MapModule.init();
    ResourceModule.init();
    TickerModule.init();
    
    // Control buttons interaction
    document.querySelectorAll('.panel-controls').forEach(group => {
        const buttons = group.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });
    
    // Chat tabs interaction
    document.querySelectorAll('.chat-tabs').forEach(group => {
        const tabs = group.querySelectorAll('.chat-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    });
    
    console.log('✅ Dashboard ready. All systems operational.');
});
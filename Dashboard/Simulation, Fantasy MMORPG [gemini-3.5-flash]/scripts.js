/**
 * ==========================================================================
 * AETHER-EYE SYSTEM ENGINE
 * Core Simulation & Dynamic Interface Controller
 * ==========================================================================
 */

const Config = {
    baseTickInterval: 1000,
    maxFeedLength: 30,
    factions: {
        valkyrie: { name: 'Valkyrie Empire', class: 'controlled-valkyrie', color: '#00f0ff' },
        shadow: { name: 'Shadow Syndicate', class: 'controlled-shadow', color: '#bd00ff' },
        wildwood: { name: 'Wildwood Alliance', class: 'controlled-wild', color: '#39ff14' },
        contested: { name: 'Contested Zone', class: 'node-contested', color: '#ff3b30' }
    }
};

class SimulationEngine {
    constructor() {
        this.speedMultiplier = 1;
        this.isPaused = false;
        this.simulationTime = { era: 4, year: 342, day: 189, hour: 14, minute: 32, second: 1 };
        this.activePlayers = 142894;
        this.leylineSync = 98.42;
        this.bossHp = 64.2;
        this.bossDpsHistory = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 150);
        this.goldTrendHistory = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40) + 60);
        
        this.init();
    }

    init() {
        this.setupControls();
        this.setupWorldMap();
        this.startLoop();
        this.updateCharts();
    }

    setupControls() {
        const btnPause = document.getElementById('btn-pause');
        const btnSpeed1 = document.getElementById('btn-speed-1');
        const btnSpeed5 = document.getElementById('btn-speed-5');
        const btnSpeed10 = document.getElementById('btn-speed-10');

        const clearActiveSpeedButtons = () => {
            [btnSpeed1, btnSpeed5, btnSpeed10].forEach(b => b.classList.remove('active'));
        };

        btnPause.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            btnPause.classList.toggle('active', this.isPaused);
            btnPause.textContent = this.isPaused ? '▶️ RESUME ENGINE' : '⏸️ PAUSE ENGINE';
            TelemetryFeed.addSystemEvent(this.isPaused ? 'SIMULATION TEMPORARILY SUSPENDED' : 'SIMULATION RESUMED');
        });

        btnSpeed1.addEventListener('click', () => {
            this.speedMultiplier = 1;
            this.isPaused = false;
            btnPause.classList.remove('active');
            btnPause.textContent = '⏸️ PAUSE ENGINE';
            clearActiveSpeedButtons();
            btnSpeed1.classList.add('active');
            TelemetryFeed.addSystemEvent('TEMPORAL ACCELERATION SET TO 1X');
        });

        btnSpeed5.addEventListener('click', () => {
            this.speedMultiplier = 5;
            this.isPaused = false;
            btnPause.classList.remove('active');
            btnPause.textContent = '⏸️ PAUSE ENGINE';
            clearActiveSpeedButtons();
            btnSpeed5.classList.add('active');
            TelemetryFeed.addSystemEvent('TEMPORAL ACCELERATION SET TO 5X');
        });

        btnSpeed10.addEventListener('click', () => {
            this.speedMultiplier = 10;
            this.isPaused = false;
            btnPause.classList.remove('active');
            btnPause.textContent = '⏸️ PAUSE ENGINE';
            clearActiveSpeedButtons();
            btnSpeed10.classList.add('active');
            TelemetryFeed.addSystemEvent('TEMPORAL ACCELERATION SET TO 10X');
        });
    }

    setupWorldMap() {
        const mapContainer = document.getElementById('world-map');
        mapContainer.innerHTML = '';

        const factionKeys = Object.keys(Config.factions);

        // Generate a 20x20 cohesive territory layout
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const node = document.createElement('div');
                node.className = 'map-node';
                
                // Determine faction clustering using simple coordinate math
                let factionType = 'contested';
                if (x < 8 && y < 8) {
                    factionType = 'valkyrie';
                } else if (x > 11 && y > 11) {
                    factionType = 'shadow';
                } else if (x < 8 && y > 11) {
                    factionType = 'wildwood';
                } else if (Math.random() > 0.75) {
                    factionType = factionKeys[Math.floor(Math.random() * 3)];
                }

                const faction = Config.factions[factionType];
                node.classList.add(faction.class);
                node.setAttribute('data-x', x);
                node.setAttribute('data-y', y);
                node.setAttribute('data-faction', factionType);

                // Hover info structure
                const tooltip = document.createElement('span');
                tooltip.className = 'node-tooltip';
                tooltip.innerHTML = `<strong>Sector [${x}, ${y}]</strong><br>Owner: ${faction.name}`;
                node.appendChild(tooltip);

                // Mini icon display inside node to make it feel extremely detailed
                if (Math.random() > 0.93) {
                    node.innerHTML += '🏰';
                } else if (Math.random() > 0.97) {
                    node.innerHTML += '💎';
                } else if (Math.random() > 0.98) {
                    node.innerHTML += '⚔️';
                }

                node.addEventListener('click', () => {
                    TelemetryFeed.addMapSectorEvent(x, y, faction.name);
                    this.pulseMapSector(x, y);
                });

                mapContainer.appendChild(node);
            }
        }
    }

    pulseMapSector(x, y) {
        const nodes = document.querySelectorAll('.map-node');
        nodes.forEach(node => {
            if (parseInt(node.getAttribute('data-x')) === x && parseInt(node.getAttribute('data-y')) === y) {
                node.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                setTimeout(() => {
                    const factionType = node.getAttribute('data-faction');
                    node.style.backgroundColor = '';
                }, 400);
            }
        });
    }

    startLoop() {
        const tick = () => {
            if (!this.isPaused) {
                this.updateClock();
                this.updateMetrics();
                this.tickSimulationEvents();
            }
            setTimeout(tick, Config.baseTickInterval / this.speedMultiplier);
        };
        tick();
    }

    updateClock() {
        let t = this.simulationTime;
        t.second += 1;
        if (t.second >= 60) {
            t.second = 0;
            t.minute += 1;
            if (t.minute >= 60) {
                t.minute = 0;
                t.hour += 1;
                if (t.hour >= 24) {
                    t.hour = 0;
                    t.day += 1;
                    if (t.day >= 365) {
                        t.day = 1;
                        t.year += 1;
                    }
                }
            }
        }

        const format = (n) => String(n).padStart(2, '0');
        const clockEl = document.getElementById('world-time');
        clockEl.textContent = `ERA ${t.era} - Y${t.year} - D${t.day} // ${format(t.hour)}:${format(t.minute)}:${format(t.second)}`;
    }

    updateMetrics() {
        // Player counts
        this.activePlayers += Math.floor(Math.random() * 51) - 25;
        this.activePlayers = Math.max(120000, Math.min(this.activePlayers, 150000));
        document.getElementById('active-players').textContent = `${this.activePlayers.toLocaleString()} / 150,000`;

        // Leyline Sync
        this.leylineSync += (Math.random() * 0.4) - 0.2;
        this.leylineSync = Math.max(90, Math.min(this.leylineSync, 100));
        document.getElementById('leyline-sync').textContent = `${this.leylineSync.toFixed(2)}%`;

        // Fluctuate Faction Control Slightly
        this.adjustFactionInfluence();
    }

    adjustFactionInfluence() {
        const valkyrieBar = document.querySelector('.valkyrie-bg');
        const shadowBar = document.querySelector('.shadow-bg');
        const wildBar = document.querySelector('.wild-bg');

        let vPct = parseFloat(valkyrieBar.style.width);
        let sPct = parseFloat(shadowBar.style.width);
        let wPct = parseFloat(wildBar.style.width);

        const deltaV = (Math.random() * 0.2) - 0.1;
        const deltaS = (Math.random() * 0.2) - 0.1;

        vPct += deltaV;
        sPct += deltaS;
        wPct = 100 - (vPct + sPct);

        valkyrieBar.style.width = `${vPct.toFixed(1)}%`;
        shadowBar.style.width = `${sPct.toFixed(1)}%`;
        wildBar.style.width = `${wPct.toFixed(1)}%`;

        document.querySelectorAll('.faction-pct')[0].textContent = `${vPct.toFixed(1)}%`;
        document.querySelectorAll('.faction-pct')[1].textContent = `${sPct.toFixed(1)}%`;
        document.querySelectorAll('.faction-pct')[2].textContent = `${wPct.toFixed(1)}%`;
    }

    tickSimulationEvents() {
        // Boss Damage Simulation
        if (this.bossHp > 0.1) {
            const bossDamage = (Math.random() * 0.8) + 0.1;
            this.bossHp = Math.max(0, this.bossHp - bossDamage);
            document.querySelector('.boss-health-fill').style.width = `${this.bossHp.toFixed(1)}%`;
            document.querySelector('.boss-health-pct').textContent = `HP: ${this.bossHp.toFixed(1)}%`;

            // Active combatants fluctuation
            const combatants = Math.floor(Math.random() * 60) + 380;
            document.querySelector('.boss-combatants').textContent = `⚔️ ${combatants} Heroes Active`;

            // Update boss DPS sparkline
            this.bossDpsHistory.shift();
            this.bossDpsHistory.push(Math.floor(Math.random() * 100) + 120);
        } else {
            // Respawn a new world boss
            this.bossHp = 100;
            const newBosses = ["MALAKAR THE UNTAMED", "YUL-GATH THE SOUL-DRINKER", "ZUL-KARI THE GHOST QUEEN"];
            const selectedBoss = newBosses[Math.floor(Math.random() * newBosses.length)];
            document.querySelector('.boss-name').textContent = selectedBoss;
            TelemetryFeed.addSystemEvent(`🚨 NEW WORLD BOSS DETECTED: ${selectedBoss} has manifested!`);
        }

        // Raid progression fluctuation
        const raidBar = document.querySelector('.raid-health-fill:not(.green-bg)');
        if (raidBar) {
            let currentHp = parseFloat(raidBar.style.width);
            if (currentHp > 0.5) {
                currentHp = Math.max(0, currentHp - (Math.random() * 1.5));
                raidBar.style.width = `${currentHp.toFixed(1)}%`;
                document.querySelector('.raid-item .boss-target').textContent = `Boss: Archimonde (${currentHp.toFixed(1)}% HP)`;
            } else {
                // Raid completed! Reset it to simulate a new group trying
                raidBar.classList.add('green-bg');
                raidBar.style.width = '100%';
                document.querySelector('.raid-item .boss-target').textContent = 'COMPLETED';
                document.querySelector('.raid-item .boss-target').classList.add('glow-green');
                TelemetryFeed.addSystemEvent('🏆 BASTION OF TWILIGHT HAS BEEN CONQUERED!');
                
                setTimeout(() => {
                    raidBar.classList.remove('green-bg');
                    raidBar.style.width = '100%';
                    document.querySelector('.raid-item .boss-target').textContent = 'Boss: Archimonde (100% HP)';
                    document.querySelector('.raid-item .boss-target').classList.remove('glow-green');
                }, 10000);
            }
        }

        // Randomly change guild ranks or power ratings
        this.updateGuilds();

        // Update Charts
        this.goldTrendHistory.shift();
        this.goldTrendHistory.push(Math.floor(Math.random() * 30) + 50);
        this.updateCharts();

        // Roll for a dynamic game feed event
        if (Math.random() > 0.4) {
            TelemetryFeed.generateRandomSimulationEvent();
        }
    }

    updateGuilds() {
        const tbody = document.getElementById('guild-tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.forEach(row => {
            const powerCell = row.querySelectorAll('td')[5];
            let currentPower = parseInt(powerCell.textContent.replace(/,/g, ''));
            currentPower += Math.floor(Math.random() * 10000) - 4000;
            powerCell.textContent = currentPower.toLocaleString();
        });
    }

    updateCharts() {
        // Draw SVG-based sparklines to avoid external libraries
        const drawSparkline = (elementId, dataPoints, strokeColor) => {
            const container = document.getElementById(elementId);
            if (!container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;
            const maxVal = Math.max(...dataPoints);
            const minVal = Math.min(...dataPoints);
            const range = maxVal - minVal || 1;

            const points = dataPoints.map((val, index) => {
                const x = (index / (dataPoints.length - 1)) * width;
                const y = height - ((val - minVal) / range) * (height - 4) - 2;
                return `${x},${y}`;
            }).join(' ');

            container.innerHTML = `
                <svg width="100%" height="100%" style="overflow: visible;">
                    <polyline fill="none" stroke="${strokeColor}" stroke-width="1.5" points="${points}" />
                </svg>
            `;
        };

        drawSparkline('boss-dps-sparkline', this.bossDpsHistory, '#ff3b30');
        drawSparkline('gold-trend-chart', this.goldTrendHistory, '#00f0ff');
    }
}

class TelemetryFeed {
    static getTimestamp() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    static appendToFeed(itemHtml) {
        const feed = document.getElementById('telemetry-feed');
        const li = document.createElement('li');
        li.className = 'feed-item';
        li.innerHTML = itemHtml;
        
        feed.prepend(li);

        // Cap length
        const items = feed.querySelectorAll('.feed-item');
        if (items.length > Config.maxFeedLength) {
            feed.removeChild(items[items.length - 1]);
        }
    }

    static addSystemEvent(message) {
        const html = `
            <span class="feed-time">${this.getTimestamp()}</span>
            <span class="feed-text cyan-text">⚡ <strong>[SYSTEM]</strong> ${message}</span>
        `;
        this.appendToFeed(html);
    }

    static addMapSectorEvent(x, y, factionName) {
        const html = `
            <span class="feed-time">${this.getTimestamp()}</span>
            <span class="feed-text">🌐 <strong>[SENSORS]</strong> Sector [${x}, ${y}] queried. Control status: <strong>${factionName}</strong>.</span>
        `;
        this.appendToFeed(html);
    }

    static generateRandomSimulationEvent() {
        const players = ["Xandor", "SlayerX", "Kaelthas", "Luna_Light", "Arthas_DK", "GnomishEng", "Valkyria", "ShadowStep", "NatureBoy", "NecroLord"];
        const lootItems = [
            { name: "Staff of Infinite Wisdom", rarity: "rarity-legendary" },
            { name: "Shattered Void Core", rarity: "glow-purple" },
            { name: "Glinting Mithril Greaves", rarity: "glow-cyan" },
            { name: "Primal Emerald Ring", rarity: "glow-green" }
        ];
        const zones = ["Whispering Woods", "Arid Canyons", "Molten Peak", "Shadow Fen", "Frostbite Ridge"];
        const guilds = ["[VOID]", "[AURA]", "[ROGU]", "[IRON]", "[CULT]"];

        const eventTypes = [
            // Loot Event
            () => {
                const player = players[Math.floor(Math.random() * players.length)];
                const item = lootItems[Math.floor(Math.random() * lootItems.length)];
                return `
                    <span class="feed-time">${this.getTimestamp()}</span>
                    <span class="feed-text">🏆 <strong>[Player: ${player}]</strong> looted <span class="${item.rarity}">[${item.name}]</span>!</span>
                `;
            },
            // PVP Death Event
            () => {
                const killer = players[Math.floor(Math.random() * players.length)];
                const victim = players[Math.floor(Math.random() * players.length)];
                const zone = zones[Math.floor(Math.random() * zones.length)];
                if (killer === victim) return null; // Avoid self-kill simulation
                return `
                    <span class="feed-time">${this.getTimestamp()}</span>
                    <span class="feed-text">💀 <strong>[${killer}]</strong> defeated <strong>[${victim}]</strong> in fair combat (${zone})</span>
                `;
            },
            // Guild Skirmish Event
            () => {
                const g1 = guilds[Math.floor(Math.random() * guilds.length)];
                const g2 = guilds[Math.floor(Math.random() * guilds.length)];
                if (g1 === g2) return null;
                return `
                    <span class="feed-time">${this.getTimestamp()}</span>
                    <span class="feed-text">⚔️ Skirmish reported between guild <strong>${g1}</strong> and <strong>${g2}</strong> at border outpost.</span>
                `;
            },
            // Leyline Anomaly Event
            () => {
                const zone = zones[Math.floor(Math.random() * zones.length)];
                return `
                    <span class="feed-time">${this.getTimestamp()}</span>
                    <span class="feed-text yellow-text">🌀 Leyline anomaly spiked to maximum levels in <span class="location-tag">${zone}</span>! High energy yields detected.</span>
                `;
            }
        ];

        // Pick and execute a random event type
        let eventHtml = null;
        while (!eventHtml) {
            const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            eventHtml = randomEvent();
        }

        this.appendToFeed(eventHtml);
    }
}

// Instantiate and bind to window for debugging if necessary
window.addEventListener('DOMContentLoaded', () => {
    window.AetherEngine = new SimulationEngine();
});
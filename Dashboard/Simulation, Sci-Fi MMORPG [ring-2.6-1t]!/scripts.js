// ═══════════════════════════════════════════════════════════════
// NEXUS PRIME — GALACTIC COMMAND DASHBOARD
// scripts.js — Interactive systems, live updates, and animations
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─── UTILITY FUNCTIONS ───
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function randFloat(min, max, decimals = 2) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    }
    function formatNum(n) {
        if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
        return n.toString();
    }
    function pad(n) { return String(n).padStart(2, '0'); }

    // ─── STATE ───
    const state = {
        tick: 4821097,
        credits: 847293810,
        population: 12.4e9,
        morale: 73,
        energy: 4.72,
        fleetStrength: 3847,
        controlledSystems: 247,
        influenceRadius: 14.7,
        infrastructureLevel: 14,
        securityIndex: 68.2,
        bioCompatibility: 94.7,
        productionIndex: 3.2,
        intelCoverage: 41.3,
        gameTime: { hours: 14, minutes: 32, seconds: 0 },
        resources: {
            duranium:       { output: 14230, storage: 847201, cap: 1200000, trend: 2.3 },
            zerithium:      { output: 847, storage: 23400, cap: 50000, trend: 5.1 },
            cryoWater:      { output: 98400, storage: 2140000, cap: 3000000, trend: -0.7 },
            plasmaCore:     { output: 347, storage: null, cap: null, trend: 1.1 },
            neogenCompound: { output: 2340, storage: 67890, cap: 100000, trend: -4.2 },
            voidCrystals:   { output: 12, storage: 340, cap: 1000, trend: 12.4 },
            ferroCrete:     { output: 4320000, storage: 89200000, cap: 100000000, trend: 0.8 },
            gravitonPart:   { output: 0.4, storage: 12, cap: 50, trend: 0.1 },
            bioNutrients:   { output: 234000, storage: 8200000, cap: 10000000, trend: 1.8 },
            nanoMesh:       { output: 1230, storage: 45200, cap: 60000, trend: 0.0 }
        },
        fleets: [
            { id: 'F-01', name: 'Crimson Vanguard', admiral: 'Adm. Kael Voss', ships: 284, strength: 92, location: 'Sector 77-Kappa', status: 'combat', eta: '—' },
            { id: 'F-02', name: 'Aegis Protector', admiral: 'Rear Ad. Lyra Chen', ships: 156, strength: 100, location: 'Sector 12-Alpha', status: 'guard', eta: '—' },
            { id: 'F-03', name: 'Tide of Ruin', admiral: 'Grand Ad. Drako Rex', ships: 512, strength: 78, location: 'Sector 99-Omega', status: 'advancing', eta: '4.2h' },
            { id: 'F-04', name: 'Phoenix Strike', admiral: 'Adm. Zara Nyx', ships: 89, strength: 61, location: 'Sector 45-Gamma', status: 'damaged', eta: '12.8h' },
            { id: 'F-05', name: 'Verdant Resupply', admiral: 'Cpt. Oriel Dawn', ships: 34, strength: 100, location: 'Sector 03-Sigma', status: 'resupply', eta: '2.1h' },
            { id: 'F-06', name: 'Thunderbolt', admiral: 'Adm. Korvath Iron', ships: 201, strength: 85, location: 'Sector 62-Epsilon', status: 'patrol', eta: '—' },
            { id: 'F-07', name: 'Shadow Phantom', admiral: 'Cpt. Void Whisper', ships: 12, strength: 100, location: 'Uncharted', status: 'stealth', eta: '—' }
        ],
        systems: [
            { name: 'Sol Prime', x: 18, y: 12, status: 'owned', population: '2.1B', defense: 'High' },
            { name: 'Aetheris', x: 38, y: 22, status: 'owned', population: '1.8B', defense: 'Med' },
            { name: 'Kryptos Prime', x: 28, y: 35, status: 'contested', population: '940M', defense: 'High' },
            { name: 'Elysium Rift', x: 58, y: 18, status: 'neutral', population: '420M', defense: 'Low' },
            { name: 'Nova Alexandria', x: 52, y: 45, status: 'owned', population: '3.2B', defense: 'High' },
            { name: 'Dominion Forge', x: 35, y: 52, status: 'enemy', population: '1.6B', defense: 'Max' },
            { name: 'Cryos Station', x: 72, y: 38, status: 'owned', population: '680M', defense: 'Med' },
            { name: 'Void Nebula', x: 45, y: 60, status: 'contested', population: '150M', defense: 'Low' },
            { name: 'Sigma-9', x: 82, y: 28, status: 'neutral', population: '120M', defense: 'None' },
            { name: 'Collective Hive', x: 62, y: 70, status: 'enemy', population: '2.8B', defense: 'High' },
            { name: 'Pax Thalassa', x: 80, y: 55, status: 'owned', population: '1.1B', defense: 'Med' },
            { name: 'Iron Reach', x: 15, y: 72, status: 'owned', population: '750M', defense: 'Med' },
            { name: 'Luminous Drift', x: 68, y: 8, status: 'neutral', population: '30M', defense: 'None' },
            { name: 'Cerulean Gate', x: 12, y: 42, status: 'enemy', population: '1.3B', defense: 'Max' },
            { name: 'Astra Bastion', x: 40, y: 78, status: 'owned', population: '920M', defense: 'High' },
            { name: 'Nebula\'s Edge', x: 75, y: 65, status: 'contested', population: '340M', defense: 'Low' },
            { name: 'Terminus-IX', x: 68, y: 85, status: 'owned', population: '2.4B', defense: 'Max' },
            { name: 'Ω-7', x: 88, y: 50, status: 'neutral', population: '???', defense: '???' }
        ],
        combatLogEntries: [],
        notifications: [
            { icon: '🔔', text: 'Fleet F-01 taking heavy damage in Kryptos sector' },
            { icon: '💰', text: 'Trade convoy arrived: +Ⓜ️ 240K income' },
            { icon: '🔬', text: 'Quantum Comms research: 73% complete' },
            { icon: '⚠️', text: 'Cerulean Pact fleet movements near border detected' },
            { icon: '🏗️', text: 'Bio-Dome Alpha construction nearly complete (91%)' },
            { icon: '👥', text: 'Immigration surge: +12M citizens on Nova Alexandria' },
            { icon: '💎', text: 'Rare Void Crystal deposit discovered in Sector 88-Zeta' },
            { icon: '⚔️', text: 'Neo-Syndicate raiding party repelled at Elysium Rift' },
            { icon: '🛡️', text: 'Orbital defense grid at Sol Prime fully operational' },
            { icon: '📡', text: 'Decoded alien signal: coordinates to unknown system' }
        ],
        constructions: [
            { name: 'Orbital Defense Grid', location: 'Sol Prime', progress: 72, eta: '3.4d', cost: '45M', workers: 124 },
            { name: 'Zerithium Mine Ω-3', location: 'Cryos Station', progress: 34, eta: '8.7d', cost: '12M', workers: 45 },
            { name: 'Carrier Shipyard', location: 'Nova Alexandria', progress: 18, eta: '22.1d', cost: '180M', workers: 210 },
            { name: 'Quantum Research Lab', location: 'Aetheris', progress: 56, eta: '5.2d', cost: '28M', workers: 78 },
            { name: 'Bio-Dome Alpha', location: 'Iron Reach', progress: 91, eta: '0.8d', cost: '3.2M', workers: 12 },
            { name: 'Listening Post Σ-9', location: 'Sigma-9', progress: 12, eta: '15.3d', cost: '8M', workers: 22 },
            { name: 'Fortress Kryptos-7', location: 'Kryptos Prime', progress: 8, eta: '45.2d', cost: '520M', workers: 340 }
        ],
        technologies: [
            { name: 'Mk-IV Shield', level: 'Lv.5', status: 'completed' },
            { name: 'Fusion Reactor', level: 'Lv.7', status: 'completed' },
            { name: 'Ion Drives', level: 'Lv.4', status: 'completed' },
            { name: 'Quantum Comms', level: '73%', status: 'in-progress', progress: 73 },
            { name: 'Nano-Regeneration', level: '🔒', status: 'locked' },
            { name: 'Antimatter Warheads', level: 'Lv.6', status: 'completed' },
            { name: 'Deep Scan Array', level: '41%', status: 'in-progress', progress: 41 },
            { name: 'Singularity Engine', level: '🔒', status: 'locked' },
            { name: 'Bio-Weapon Sys', level: '🔒', status: 'locked' },
            { name: 'Dyson Sphere', level: '🔒', status: 'locked' },
            { name: 'Orbital Foundry', level: '58%', status: 'in-progress', progress: 58 },
            { name: 'Planetary Shield', level: '🔒', status: 'locked' },
            { name: 'Psi-Net', level: '🔒', status: 'locked' },
            { name: 'Temporal Anchor', level: '🔒', status: 'locked' },
            { name: 'Dimensional Drive', level: '🔒', status: 'locked' }
        ],
        achievements: [
            { name: '🏅 System Conqueror — Control 200+ systems', status: 'completed', detail: '✓ Done' },
            { name: '🏅 Fleet Commander — Maintain 5 fleets simultaneously', status: 'in-progress', detail: '7/5' },
            { name: '🏅 Tech Pioneer — Research 10 technologies', status: 'completed', detail: '✓ 10/10' },
            { name: '🏅 Galactic Conqueror — Control 50% of galaxy', status: 'locked', detail: '🔒 20.6%' },
            { name: '🏅 Diplomat — Establish 5 alliances', status: 'in-progress', detail: '3/5' },
            { name: '🏅 Miner Elite — Extract 1M rare units', status: 'in-progress', detail: '234K/1M' },
            { name: '🏅 Ascendant — Reach Tech Level 20', status: 'locked', detail: '🔒 Lv.14' },
            { name: '🏅 Survivor — Withstand siege for 30 days', status: 'completed', detail: '✓ 47 days' }
        ],
        events: [
            { time: '14:32', icon: '⚔️', text: 'Enemy fleet spotted near Kryptos' },
            { time: '14:29', icon: '📦', text: 'Supply convoy arrived at Nova Alexandria' },
            { time: '14:18', icon: '💥', text: 'Sabotage at Mining Station Ω-12' },
            { time: '14:15', icon: '🏆', text: 'Sector 99-Omega asteroid base captured' },
            { time: '13:57', icon: '🛡️', text: 'Orbital defense grid online at Sol Prime' },
            { time: '13:42', icon: '📊', text: 'Quarterly tax collection: Ⓜ️ 12.4M' },
            { time: '13:30', icon: '🔬', text: 'Research breakthrough: Quantum Comms 73%' },
            { time: '13:15', icon: '👥', text: 'Population milestone: 12.4B citizens' },
            { time: '12:58', icon: '🛫', text: 'Fleet F-07 launched from hidden dockyard' },
            { time: '12:41', icon: '⚠️', text: 'Anomaly detected in Void Nebula' }
        ],
        tradeRates: {
            duranium: 142.30, zerithium: 4891.50, cryoWater: 0.84,
            neogen: 234.70, voidCrystals: 8420.00, ferroCrete: 2.10,
            gravitons: 1240.00, bioNutrients: 0.023
        }
    };

    // ─── UTC CLOCK ───
    function updateClock() {
        const now = new Date();
        const utc = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()].map(pad).join(':');
        const el = document.getElementById('utc-clock');
        if (el) el.textContent = '⏰ UTC: ' + utc;

        // Advance game time
        state.gameTime.seconds++;
        if (state.gameTime.seconds >= 60) {
            state.gameTime.seconds = 0;
            state.gameTime.minutes++;
            if (state.gameTime.minutes >= 60) {
                state.gameTime.minutes = 0;
                state.gameTime.hours = (state.gameTime.hours + 1) % 24;
            }
        }
    }

    // ─── TICK COUNTER ───
    function advanceTick() {
        state.tick++;
        const el = document.querySelector('.tick-rate');
        if (el) el.textContent = '⏱ Tick #' + state.tick.toLocaleString();
    }

    // ─── LIVE STAT UPDATES ───
    function fluctuateStats() {
        // Credits
        const delta = rand(-50000, 120000);
        state.credits = Math.max(0, state.credits + delta);
        const creditsEl = document.querySelector('.empire-overview .stat-row:nth-child(2) .value');
        if (creditsEl) creditsEl.textContent = 'Ⓜ️ ' + formatNum(state.credits);

        // Morale
        state.morale = Math.max(10, Math.min(99, state.morale + rand(-2, 2)));
        const moraleEl = document.querySelector('.empire-overview .stat-row:nth-child(4)');
        if (moraleEl) {
            moraleEl.querySelector('.value').textContent = state.morale + '% — ' + (state.morale > 70 ? 'Steady' : state.morale > 40 ? 'Low' : 'Critical');
            moraleEl.querySelector('.bar').style.width = state.morale + '%';
            moraleEl.querySelector('.bar').className = 'bar ' + (state.morale > 70 ? 'green' : state.morale > 40 ? 'amber' : 'red');
        }

        // Energy
        state.energy = Math.max(0, state.energy + randFloat(-0.2, 0.3));
        const energyEl = document.querySelector('.empire-overview .stat-row:nth-child(5) .value');
        if (energyEl) energyEl.textContent = state.energy.toFixed(2) + ' TW';

        // Fleet strength
        state.fleetStrength = Math.max(0, state.fleetStrength + rand(-3, 1));
        const fleetEl = document.querySelector('.empire-overview .stat-row:nth-child(6) .value');
        if (fleetEl) fleetEl.textContent = state.fleetStrength.toLocaleString() + ' ships';

        // Production
        state.productionIndex = Math.max(-5, state.productionIndex + randFloat(-0.5, 0.5));
        const prodEl = document.querySelector('.empire-overview .stat-row:nth-child(12) .value');
        if (prodEl) prodEl.textContent = (state.productionIndex >= 0 ? '+' : '') + state.productionIndex.toFixed(1) + '% this cycle';

        // Security
        state.securityIndex = Math.max(0, Math.min(100, state.securityIndex + randFloat(-1, 1)));
        const secEl = document.querySelector('.empire-overview .stat-row:nth-child(10)');
        if (secEl) {
            secEl.querySelector('.value').textContent = state.securityIndex.toFixed(1) + ' — ' + (state.securityIndex > 75 ? 'High' : state.securityIndex > 40 ? 'Moderate' : 'Low');
            secEl.querySelector('.bar').style.width = state.securityIndex + '%';
        }

        // Population
        state.population = Math.max(0, state.population + rand(-500000, 2000000));
        const popEl = document.querySelector('.empire-overview .stat-row:nth-child(3)');
        if (popEl) {
            const popB = (state.population / 1e9).toFixed(1);
            popEl.querySelector('.value').textContent = popB + 'B / 15B';
            const pct = Math.round((state.population / 15e9) * 1000) / 10;
            popEl.querySelector('.bar').style.width = pct + '%';
        }
    }

    // ─── RESOURCE FLUCTUATION ───
    function fluctuateResources() {
        Object.keys(state.resources).forEach(key => {
            const r = state.resources[key];
            if (r.storage !== null) {
                const change = Math.round(r.output * rand(-50, 120) / 100);
                r.storage = Math.max(0, Math.min(r.cap, r.storage + change));
                r.trend = Math.round((r.trend + randFloat(-0.5, 0.5)) * 10) / 10;
            }
        });

        // Update resource table
        const table = document.querySelector('.resource-panel .data-table tbody');
        if (table) {
            const rows = table.querySelectorAll('tr');
            const keys = Object.keys(state.resources);
            keys.forEach((key, i) => {
                if (rows[i]) {
                    const r = state.resources[key];
                    const cells = rows[i].querySelectorAll('td');
                    if (cells[2]) {
                        const unit = key === 'plasmaCore' ? ' TW' : key === 'nanoMesh' ? ' km²' : key === 'bioNutrients' ? ' cal' : key === 'gravitonPart' ? ' u' : key ===('duranium') || key ===('zerithium') || key ===('ferroCrete') ? ' u' : ' t';
                        cells[2].textContent = formatNum(r.output) + unit;
                    }
                    if (cells[3] && r.storage !== null) {
                        const unit = key === 'plasmaCore' ? '' : key ===('cryoWater') ? ' L' : key ===('bioNutrients') ? ' cal' : key ===('nanoMesh') ? ' km²' : key ===('gravitonPart') || key ===('voidCrystals') || key ===('neogenCompound') ? ' u' : ' t';
                        cells[3].textContent = formatNum(r.storage) + unit;
                    }
                    if (cells[5]) {
                        const cls = r.trend > 0.1 ? 'trend-up' : r.trend < -0.1 ? 'trend-down' : 'trend-stable';
                        const arrow = r.trend > 0.1 ? '▲' : r.trend < -0.1 ? '▼' : '▬';
                        cells[5].className = 'trend-' + (r.trend > 0.1 ? 'up' : r.trend < -0.1 ? 'down' : 'stable');
                        cells[5].innerHTML = arrow + ' ' + (r.trend >= 0 ? '+' : '') + r.trend.toFixed(1) + '%';
                    }
                    if (cells[4] && r.cap !== null) {
                        const pct = Math.round((r.storage / r.cap) * 100);
                        const dotCell = cells[6];
                        if (dotCell) {
                            const dot = dotCell.querySelector('.dot');
                            if (dot) {
                                if (pct >= 85) { dot.className = 'dot green'; dotCell.querySelector('.dot').nextSibling && (dotCell.querySelector('.dot').nextSibling.textContent = pct + '%'); }
                                else if (pct >= 50) { dot.className = 'dot yellow'; }
                                else { dot.className = 'dot red'; }
                            }
                        }
                    }
                }
            });
        }
    }

    // ─── TRADE RATE FLUCTUATION ───
    function fluctuateTradeRates() {
        Object.keys(state.tradeRates).forEach(key => {
            state.tradeRates[key] = parseFloat((state.tradeRates[key] * (1 + randFloat(-0.02, 0.02))).toFixed(2));
        });
        const ticker = document.querySelector('.rate-ticker');
        if (ticker) {
            const spans = ticker.querySelectorAll('span');
            const keys = Object.keys(state.tradeRates);
            keys.forEach((key, i) => {
                if (spans[i]) {
                    const rate = state.tradeRates[key];
                    const prevRate = parseFloat(spans[i].dataset.prevRate || rate);
                    spans[i].dataset.prevRate = rate;
                    const arrow = rate >= prevRate ? '▲' : '▼';
                    const cls = rate >= prevRate ? 'trend-up' : 'trend-down';
                    const name = { duranium: 'Duranium', zerithium: 'Zerithium', cryoWater: 'Cryo-H₂O', neogen: 'Neogen', voidCrystals: 'Void Crystals', ferroCrete: 'Ferro-Crete', gravitons: 'Gravitons', bioNutrients: 'Bio-Nutrients' };
                    spans[i].innerHTML = (name[key] || key) + ': Ⓜ️ ' + rate.toFixed(2) + ' <span class="' + cls + '">' + arrow + '</span>';
                }
            });
        }
    }

    // ─── FLEET STATUS UPDATES ───
    function fluctuateFleets() {
        state.fleets.forEach(fleet => {
            fleet.strength = Math.max(10, Math.min(100, fleet.strength + rand(-3, 2)));
            fleet.ships = Math.max(5, fleet.ships + rand(-2, 1));
        });

        const table = document.querySelector('.fleet-panel .data-table tbody');
        if (table) {
            const rows = table.querySelectorAll('tr');
            state.fleets.forEach((fleet, i) => {
                if (rows[i]) {
                    const cells = rows[i].querySelectorAll('td');
                    if (cells[3]) cells[3].textContent = fleet.ships;
                    if (cells[4]) {
                        const bar = cells[4].querySelector('.mini-bar');
                        const pctText = cells[4].querySelectorAll('span, div');
                        if (bar) bar.style.width = fleet.strength + '%';
                        cells[4].innerHTML = '<div class="mini-bar" pct="' + fleet.strength + '"></div>' + fleet.strength + '%';
                    }
                }
            });
        }

        // Fleet summary
        const summary = document.querySelector('.fleet-summary');
        if (summary) {
            const totalShips = state.fleets.reduce((a, f) => a + f.ships, 0);
            const avgReadiness = Math.round(state.fleets.reduce((a, f) => a + f.strength, 0) / state.fleets.length);
            summary.innerHTML =
                '<span>Total Ships: <b>' + totalShips + '</b></span>' +
                '<span>Avg Readiness: <b>' + avgReadiness + '%</b></span>' +
                '<span>In Combat: <b>' + state.fleets.filter(f => f.status === 'combat').length + '</b></span>' +
                '<span>Available: <b>' + state.fleets.filter(f => ['guard', 'patrol'].includes(f.status)).length + '</b></span>' +
                '<span>Damaged: <b>' + state.fleets.filter(f => f.status === 'damaged').length + '</b></span>' +
                '<span>Lost This Cycle: <b>14</b> ⚫</span>';
        }
    }

    // ─── WAR FRONT UPDATES ───
    function fluctuateWarFronts() {
        const fronts = document.querySelectorAll('.war-front .front-bar');
        fronts.forEach(bar => {
            const current = parseInt(bar.style.width) || 50;
            const newVal = Math.max(5, Math.min(95, current + rand(-3, 3)));
            bar.style.width = newVal + '%';
            const span = bar.querySelector('span');
            if (span) span.textContent = newVal + '%';
        });
    }

    // ─── RESEARCH PROGRESS ───
    function advanceResearch() {
        state.technologies.forEach(tech => {
            if (tech.status === 'in-progress') {
                tech.progress = Math.min(100, tech.progress + rand(0, 2) * 0.5);
                if (tech.progress >= 100) {
                    tech.progress = 100;
                    tech.status = 'completed';
                    tech.level = 'Lv.' + rand(1, 9);
                } else {
                    tech.level = Math.round(tech.progress) + '%';
                }
            }
        });

        const rows = document.querySelectorAll('.tech-row');
        rows.forEach((row, i) => {
            const techs = row.querySelectorAll('.tech');
            techs.forEach((techEl, j) => {
                const idx = i * 5 + j;
                const tech = state.technologies[idx];
                if (!tech) return;
                techEl.className = 'tech ' + tech.status;
                const lvl = techEl.querySelector('.tech-lvl');
                if (lvl) lvl.textContent = tech.level;
                if (tech.status === 'in-progress') {
                    const pb = techEl.querySelector('.progress-bar div');
                    if (pb) pb.style.width = tech.progress + '%';
                }
            });
        });
    }

    // ─── CONSTRUCTION PROGRESS ───
    function advanceConstruction() {
        state.constructions.forEach(proj => {
            proj.progress = Math.min(100, proj.progress + rand(0, 3) * 0.3);
            if (proj.progress >= 100) proj.progress = 100;
            const remainingDays = ((100 - proj.progress) / (proj.progress / parseFloat(proj.eta))).toFixed(1);
            proj.eta = isFinite(remainingDays) && remainingDays > 0 ? remainingDays + 'd' : '0.1d';
        });

        const table = document.querySelector('.construction-panel .data-table tbody');
        if (table) {
            const rows = table.querySelectorAll('tr');
            state.constructions.forEach((proj, i) => {
                if (rows[i]) {
                    const cells = rows[i].querySelectorAll('td');
                    if (cells[3]) {
                        cells[3].innerHTML = '<div class="mini-bar" pct="' + Math.round(proj.progress) + '"></div>' + Math.round(proj.progress) + '%';
                    }
                    if (cells[4]) cells[4].textContent = proj.eta;
                }
            });
        }
    }

    // ─── TOAST NOTIFICATIONS ───
    let toastIndex = 0;
    function showToast() {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const notif = state.notifications[toastIndex % state.notifications.length];
        toastIndex++;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<span>' + notif.icon + '</span>' + notif.text;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 4000);
    }

    // ─── COMBAT LOG UPDATES ───
    function addCombatLogEntry() {
        const logTypes = [
            { time: getGameTimeStr(), icon: '⚔️', cls: 'event-loss', text: 'F-' + rand(1,7) + ' engaged enemy forces in Sector ' + rand(1,99) + '-' + ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Kappa','Omega','Sigma'][rand(0,8)] },
            { time: getGameTimeStr(), icon: '💥', cls: 'event-loss', text: 'Enemy destroyer eliminated in Void Nebula skirmish' },
            { time: getGameTimeStr(), icon: '🛡️', cls: 'event-win', text: 'Shield generator reinforced at Nova Alexandria' },
            { time: getGameTimeStr(), icon: '📡', cls: 'event-info', text: 'Deep scan detected ' + rand(1,5) + ' unknown contacts in Sigma-9' },
            { time: getGameTimeStr(), icon: '💰', cls: 'event-win', text: 'Trade revenue this cycle: Ⓜ️ ' + rand(80000, 450000) },
            { time: getGameTimeStr(), icon: '⚡', cls: 'event-info', text: 'Power grid fluctuation detected on ' + ['Sol Prime','Aetheris','Cryos Station'][rand(0,2)] },
            { time: getGameTimeStr(), icon: '🔬', cls: 'event-win', text: 'Research milestone achieved in Lab ' + ['Sigma-4','Gamma-2','Alpha-1'][rand(0,2)] },
            { time: getGameTimeStr(), icon: '👥', cls: 'event-info', text: 'Civilian population growth: +' + rand(10000, 500000) + ' this cycle' },
            { time: getGameTimeStr(), icon: '🚀', cls: 'event-win', text: 'Fleet resupply completed for F-' + rand(1,7) },
            { time: getGameTimeStr(), icon: '🌀', cls: 'event-info', text: 'Anomalous energy readings near Nebula\'s Edge' }
        ];

        const entry = logTypes[rand(0, logTypes.length - 1)];
        state.events.unshift(entry);
        if (state.events.length > 20) state.events.pop();

        const log = document.querySelector('.combat-log');
        if (log) {
            const container = log.querySelector('.event-log') || log;
            const entries = container.querySelectorAll('.log-entry');
            // Prepend new entry
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = '<span class="time">[' + entry.time + ']</span> <span class="' + entry.cls + '">' + entry.icon + ' ' + entry.text + '</span>';
            container.insertBefore(div, entries[0]);
            // Keep only last 10
            while (entries.length > 10) entries[entries.length - 1].remove();
        }
    }

    function getGameTimeStr() {
        return pad(state.gameTime.hours) + ':' + pad(state.gameTime.minutes) + ':' + pad(state.gameTime.seconds);
    }

    // ─── STARMAP TOOLTIP ───
    function initStarMapTooltips() {
        const systems = document.querySelectorAll('.system');
        systems.forEach(sys => {
            sys.addEventListener('mouseenter', function (e) {
                let existing = document.getElementById('starmap-tooltip');
                if (existing) existing.remove();

                const name = this.dataset.name || '';
                const pop = this.dataset.pop || 'Unknown';
                const def = this.dataset.def || 'Unknown';
                const status = this.classList.contains('s-owned') ? '🟢 Owned' :
                               this.classList.contains('s-contested') ? '🟡 Contested' :
                               this.classList.contains('s-enemy') ? '🔴 Enemy' :
                               this.classList.contains('s-neutral') ? '⚪ Neutral' : '❓ Unknown';

                let fleetHere = '';
                const fm = document.querySelectorAll('.fleet-marker');
                fm.forEach(f => {
                    const rect = f.getBoundingClientRect();
                    const sRect = this.getBoundingClientRect();
                    if (Math.abs(rect.left - sRect.left) < 30 && Math.abs(rect.top - sRect.top) < 30) {
                        fleetHere += '<br>' + f.textContent.trim();
                    }
                });

                const tooltip = document.createElement('div');
                tooltip.id = 'starmap-tooltip';
                tooltip.innerHTML =
                    '<div style="font-family:var(--font-display);font-size:0.85rem;color:var(--cyan);margin-bottom:4px;">' + name + '</div>' +
                    '<div style="font-size:0.7rem;color:var(--text-secondary);">' + status + '</div>' +
                    '<div style="font-size:0.7rem;color:var(--text-secondary);">👤 Population: ' + pop + '</div>' +
                    '<div style="font-size:0.7rem;color:var(--text-secondary);">🛡️ Defense: ' + def + '</div>' +
                    (fleetHere ? '<div style="font-size:0.65rem;color:var(--amber);margin-top:3px;">🚀 Present:' + fleetHere + '</div>' : '');

                document.getElementById('starmap').appendChild(tooltip);
            });

            sys.addEventListener('mousemove', function (e) {
                const tooltip = document.getElementById('starmap-tooltip');
                if (!tooltip) return;
                const map = document.getElementById('starmap');
                const rect = map.getBoundingClientRect();
                let x = e.clientX - rect.left + 15;
                let y = e.clientY - rect.top + 15;
                if (x + 200 > rect.width) x = e.clientX - rect.left - 210;
                if (y + 120 > rect.height) y = e.clientY - rect.top - 130;
                tooltip.style.left = x + 'px';
                tooltip.style.top = y + 'px';
            });

            sys.addEventListener('mouseleave', function () {
                const t = document.getElementById('starmap-tooltip');
                if (t) t.remove();
            });
        });
    }

    // ─── STARMAP ZOOM/PAN ───
    let mapScale = 1, mapX = 0, mapY = 0;
    let isDragging = false, dragStartX, dragStartY;

    function initStarMapControls() {
        const starmap = document.getElementById('starmap');
        if (!starmap) return;

        const svg = starmap.querySelector('.supply-lines');
        const systems = starmap.querySelectorAll('.system, .fleet-marker');

        function applyTransform() {
            if (svg) {
                svg.style.transform = 'scale(' + mapScale + ') translate(' + (mapX / mapScale) + 'px, ' + (mapY / mapScale) + 'px)';
                svg.style.transformOrigin = '0 0';
            }
            systems.forEach(s => {
                s.style.transformOrigin = '0 0';
                // We don't transform systems directly since they use % positioning
                // Instead we transform the container
            });
            const grid = starmap.querySelector('.map-grid');
            if (grid) {
                grid.style.transform = 'scale(' + mapScale + ')';
                grid.style.transformOrigin = '0 0';
            }
        }

        // Zoom via mouse wheel
        starmap.addEventListener('wheel', function (e) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            mapScale = Math.max(0.5, Math.min(2.5, mapScale + delta));
            applyTransform();
        }, { passive: false });

        // Pan via drag
        starmap.addEventListener('mousedown', function (e) {
            if (e.target.closest('.system')) return;
            isDragging = true;
            dragStartX = e.clientX - mapX;
            dragStartY = e.clientY - mapY;
        });
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            mapX = e.clientX - dragStartX;
            mapY = e.clientY - dragStartY;
            applyTransform();
        });
        document.addEventListener('mouseup', function () { isDragging = false; });

        // Button controls
        const controls = document.querySelector('.map-controls');
        if (controls) {
            const btns = controls.querySelectorAll('span');
            btns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const txt = this.textContent;
                    if (txt.includes('+')) { mapScale = Math.min(2.5, mapScale + 0.2); }
                    else if (txt.includes('−') || txt.includes('-')) { mapScale = Math.max(0.5, mapScale - 0.2); }
                    else if (txt.includes('↔')) { mapX += 50; }
                    else if (txt.includes('↕')) { mapY += 50; }
                    else if (txt.includes('Reset')) { mapScale = 1; mapX = 0; mapY = 0; }
                    applyTransform();
                });
            });
        }
    }

    // ─── SIDE NAV ───
    function initSideNav() {
        const btns = document.querySelectorAll('.action-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', function () {
                btns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // Flash effect
                this.style.boxShadow = '0 0 20px #00e5ff66';
                setTimeout(() => { this.style.boxShadow = ''; }, 400);
            });
        });
    }

    // ─── DATA TABLE SORTING ───
    function initTableSorting() {
        document.querySelectorAll('.data-table thead th').forEach(th => {
            th.style.cursor = 'pointer';
            th.style.userSelect = 'none';
            th.addEventListener('click', function () {
                const table = this.closest('table');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const colIdx = Array.from(this.parentNode.children).indexOf(this);

                rows.sort((a, b) => {
                    const aText = a.children[colIdx]?.textContent.trim() || '';
                    const bText = b.children[colIdx]?.textContent.trim() || '';
                    const aNum = parseFloat(aText.replace(/[^0-9.\-]/g, ''));
                    const bNum = parseFloat(bText.replace(/[^0-9.\-]/g, ''));
                    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
                    return aText.localeCompare(bText);
                });

                rows.forEach(r => tbody.appendChild(r));
            });
        });
    }

    // ─── POPULATION PANEL COUNTER ───
    function fluctuatePopulation() {
        const items = document.querySelectorAll('.pop-stats .pop-item');
        items.forEach(item => {
            const numEl = item.querySelector('.pop-num');
            if (!numEl) return;
            let val = parseFloat(numEl.textContent);
            if (isNaN(val)) return;

            const label = item.querySelector('.pop-label')?.textContent || '';
            let delta = 0;
            if (label.includes('Total')) delta = rand(-100, 500) / 1000;
            else if (label.includes('Military')) delta = rand(-50, 20) / 100;
            else if (label.includes('Civilians')) delta = rand(-200, 800) / 1000;
            else if (label.includes('Scientists')) delta = rand(-20, 10) / 100;
            else if (label.includes('Workers')) delta = rand(-50, 30) / 10;

            val = Math.max(0, val + delta);

            if (val >= 1) numEl.textContent = val.toFixed(1) + 'B';
            else if (val >= 0.001) numEl.textContent = (val * 1000).toFixed(0) + 'M';
            else numEl.textContent = (val * 1e6).toFixed(0);
        });
    }

    // ─── DIPLOMACY REACTION ───
    function initDiplomacyHover() {
        const cards = document.querySelectorAll('.diplo-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 15px rgba(0,229,255,0.1)';
            });
            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // ─── ALERT LEVEL FLUCTUATION ───
    function fluctuateAlert() {
        const levels = [
            { text: 'GREEN', class: 'alert-low' },
            { text: 'AMBER', class: 'alert-high' },
            { text: 'RED', class: 'alert-high' }
        ];
        setInterval(() => {
            const el = document.querySelector('.alert-level b');
            if (el && rand(0, 50) === 25) {
                const lvl = levels[rand(0, levels.length - 1)];
                el.textContent = lvl.text;
                el.className = lvl.class;
            }
        }, 15000);
    }

    // ─── FLEET MARKER MOVEMENT ───
    function moveFleetMarkers() {
        const markers = document.querySelectorAll('.fleet-marker');
        markers.forEach(marker => {
            if (marker.textContent.includes('F-07')) return; // Stealth stays hidden
            const currentTop = parseFloat(marker.style.top) || 0;
            const currentLeft = parseFloat(marker.style.left) || 0;
            marker.style.top = (currentTop + randFloat(-0.3, 0.3)) + '%';
            marker.style.left = (currentLeft + randFloat(-0.3, 0.3)) + '%';
        });
    }

    // ─── MAIN INITIALIZATION ───
    function init() {
        initStarMapTooltips();
        initStarMapControls();
        initSideNav();
        initTableSorting();
        initDiplomacyHover();
        fluctuateAlert();

        // Update every second
        setInterval(() => {
            updateClock();
        }, 1000);

        // Game tick every 3 seconds
        setInterval(() => {
            advanceTick();
            fluctuateStats();
            fluctuateFleets();
            fluctuateResources();
            fluctuateTradeRates();
            advanceResearch();
            advanceConstruction();
            fluctuateWarFronts();
            fluctuatePopulation();
            moveFleetMarkers();
        }, 3000);

        // Toast every 8 seconds
        setInterval(showToast, 8000);
        setTimeout(showToast, 3000);
        setTimeout(showToast, 6000);

        // Combat log every 12 seconds
        setInterval(addCombatLogEntry, 12000);
        setTimeout(addCombatLogEntry, 5000);

        // Initial clock
        updateClock();
    }

    // Launch
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
/* ═══════════════════════════════════════════════════════════════════
   NEXUS COMMAND — Galactic Operations Dashboard
   Interactive Systems & Live Data Engine v7.4.1
   ═══════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ──── CONFIGURATION ────
    const CONFIG = {
        starCount: 300,
        systemCount: 45,
        updateInterval: 100,
        tickerSpeed: 60,
        combatLogInterval: 3000,
        marketUpdateInterval: 2000,
        dataFluxInterval: 1500,
    };

    // ──── UTILITY FUNCTIONS ────
    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(rand(min, max));
    const pick = arr => arr[randInt(0, arr.length)];
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    const lerp = (a, b, t) => a + (b - a) * t;

    // ──── GAME STATE ────
    const state = {
        credits: 847293105,
        plex: 12847,
        xp: 8247105,
        xpMax: 9000000,
        kills: 12847,
        deaths: 342,
        playersOnline: 284293,
        activeBattles: 12847,
        shipsDestroyed: 42891,
        jumpsPerHour: 1200000,
        tps: 60.0,
        ping: 12,
        fps: 144,
        capacitor: 78.3,
        hull: 94.1,
        shield: 87.2,
        warfronts: {
            federation: 42,
            empire: 31,
            syndicate: 18,
            pirates: 9
        },
        resources: {
            tritanium: { rate: 4250, price: 12.47, change: 3.2 },
            pyerite: { rate: 3600, price: 8.92, change: -1.4 },
            mexallon: { rate: 2900, price: 15.23, change: 0.8 },
            isogen: { rate: 2050, price: 45.67, change: -2.1 },
            nocxium: { rate: 1400, price: 128.40, change: 5.7 },
            zydrine: { rate: 750, price: 892.15, change: 1.2 },
            megacyte: { rate: 400, price: 2341.80, change: -0.3 },
            morphite: { rate: 150, price: 12847.50, change: 8.4 }
        },
        combatLog: [],
        researchProgress: {
            qeDrive: 73,
            shieldHarmonics: 45,
            plasmaWeapons: 12
        }
    };

    // ──── STAR MAP DATA ────
    const starSystems = [];
    const tradeRoutes = [];
    const factionColors = {
        federation: '#00ff88',
        empire: '#ff3344',
        syndicate: '#ffaa00',
        pirate: '#ff00aa',
        neutral: '#00f5ff',
        unclaimed: '#ffffff'
    };

    // Generate star systems
    function generateStarSystems() {
        const factions = ['federation', 'empire', 'syndicate', 'pirate', 'neutral', 'unclaimed'];
        const systemNames = [
            'Proxima', 'Alpha Centauri', 'Sirius', 'Vega', 'Altair', 'Rigel', 'Betelgeuse',
            'Antares', 'Aldebaran', 'Pollux', 'Fomalhaut', 'Deneb', 'Regulus', 'Spica',
            'Arcturus', 'Capella', 'Castor', 'Polaris', 'Canopus', 'Achernar', 'Hadar',
            'Acrux', 'Mimosa', 'Gacrux', 'Bellatrix', 'Mintaka', 'Alnilam', 'Alnitak',
            'Saiph', 'Menkalinan', 'Elnath', 'Alhena', 'Wasat', 'Mebsuta', 'Tejat',
            'Propus', 'Alzirr', 'Mekbuda', 'Wasat', 'HR-4796', 'Gliese-581', 'Kepler-442',
            'TRAPPIST-1', 'Ross-128', 'Luyten', 'Barnard', 'Wolf-359', 'Lacaille-9352'
        ];

        for (let i = 0; i < CONFIG.systemCount; i++) {
            starSystems.push({
                id: i,
                name: systemNames[i] || `SYS-${randInt(100, 999)}`,
                x: rand(50, 750),
                y: rand(30, 390),
                size: rand(2, 6),
                faction: pick(factions),
                hasGate: Math.random() > 0.7,
                hasStation: Math.random() > 0.6,
                security: rand(0.0, 1.0).toFixed(1),
                population: randInt(1, 1000),
                pulse: rand(0, Math.PI * 2),
                pulseSpeed: rand(0.02, 0.05)
            });
        }

        // Generate trade routes between nearby systems
        for (let i = 0; i < starSystems.length; i++) {
            for (let j = i + 1; j < starSystems.length; j++) {
                const dist = Math.hypot(
                    starSystems[i].x - starSystems[j].x,
                    starSystems[i].y - starSystems[j].y
                );
                if (dist < 150 && Math.random() > 0.7) {
                    tradeRoutes.push({
                        from: i,
                        to: j,
                        traffic: rand(0.1, 1.0)
                    });
                }
            }
        }
    }

    // ──── COMBAT LOG MESSAGES ────
    const combatMessages = {
        kill: [
            '💀 {target} hit for {dmg} dmg (CRITICAL) — DESTROYED',
            '💀 {target} obliterated — {dmg} damage dealt',
            '💀 {target} eliminated — Hull breach confirmed',
            '💥 {target} explosion detected — {dmg} total damage'
        ],
        damage: [
            '🔴 Incoming damage: {dmg} (Armor: {armor}%)',
            '⚡ Shield impact: {dmg} absorbed',
            '💥 Hull damage: {dmg} (Integrity: {armor}%)',
            '⚠ Weapon impact detected: {dmg} damage'
        ],
        heal: [
            '🔧 Nanite repair: Hull +{dmg} ({armor}%)',
            '⚡ Shield recharge: +{dmg} ({shield}%)',
            '🔋 Capacitor stable: {cap}% ({time}s remaining)',
            '💚 Emergency repair: +{dmg} hull restored'
        ],
        info: [
            '🎯 Target lock acquired: {target} [{range}km]',
            '📡 {count} new contacts on short-range scan',
            '🛰️ Drones returning: {count}/{total} active',
            '📡 System scan complete: {count} signatures found',
            '🎯 Missile lock: {target} — ETA {time}s'
        ],
        warning: [
            '⚠ Missile incoming: ETA {time}s — Countermeasures deployed',
            '🔴 Hostile capital ship detected — {range}km',
            '⚠ Low capacitor warning: {cap}% remaining',
            '🚨 Warp disruption detected — Cannot flee'
        ]
    };

    const targetNames = [
        'VOID_DESTROYER', 'RAIDER_CLASS_III', 'PIRATE_SCOUT', 'FRIGATE_ALPHA',
        'CRUISER_BETA', 'BATTLESHIP_OMEGA', 'INTERCEPTOR_ZETA', 'FREIGHTER_DELTA',
        'SHUTTLE_EPSILON', 'DREADNOUGHT_SIGMA', 'CARRIER_THETA', 'CORVETTE_KAPPA'
    ];

    function generateCombatMessage() {
        const types = ['kill', 'damage', 'heal', 'info', 'warning'];
        const type = pick(types);
        const templates = combatMessages[type];
        let msg = pick(templates);

        msg = msg.replace('{target}', pick(targetNames));
        msg = msg.replace('{dmg}', randInt(1000, 15000).toLocaleString());
        msg = msg.replace('{armor}', rand(70, 99).toFixed(1));
        msg = msg.replace('{shield}', rand(60, 100).toFixed(1));
        msg = msg.replace('{cap}', rand(40, 95).toFixed(1));
        msg = msg.replace('{time}', rand(1, 10).toFixed(1));
        msg = msg.replace('{range}', rand(5, 100).toFixed(1));
        msg = msg.replace('{count}', randInt(1, 12));
        msg = msg.replace('{total}', randInt(5, 12));

        const now = new Date();
        const time = now.toTimeString().substr(0, 8);

        return { type, time, text: msg };
    }

    // ──── NEWS TICKER CONTENT ────
    const newsItems = [
        '⚡ BREAKING: Massive fleet engagement reported in Andromeda Corridor — over 50,000 ships involved',
        '🏛️ Terran Federation Senate approves emergency war funding — 500B credits allocated',
        '🔬 Scientists discover new mineral deposits in uncharted Sector 47-X',
        '⚔️ Void Empire mobilizes 3rd Fleet toward Proxima — DEFCON raised to ORANGE',
        '📊 Galactic Market reaches all-time high — Trade Index at 847,293.14',
        '🌌 Strange anomaly detected near Cygnus X-1 — Expedition force assembling',
        '🏆 AEGIS DYNAMICS alliance achieves #1 rank in Sovereignty control',
        '💀 Pirate warlord "Black Nebula" captured in joint Federation operation',
        '🚀 New Titan-class ship design unveiled at Galactic Arms Expo',
        '📡 Deep space relay network expansion complete — 94% galactic coverage',
        '⚠ Rogue AI fleet detected in Outer Rim — CONCORD mobilizing response',
        '💎 Rare morphite deposit discovered — Mining corporations rush to claim',
        '🏴 Syndicate forces establish new forward base in contested territory',
        '🔬 Quantum entanglement breakthrough enables instant galactic communication',
        '⚔️ War escalation: Void Empire declares total war on Federation'
    ];

    // ──── DOM REFERENCES ────
    let starMapCanvas, starMapCtx;
    let heatmapCanvas, heatmapCtx;
    let tradeChartCanvas, tradeChartCtx;
    let combatLogEl, warTickerEl;

    // ──── INITIALIZATION ────
    function init() {
        // Get canvas elements
        starMapCanvas = document.getElementById('starMap');
        starMapCtx = starMapCanvas.getContext('2d');
        
        heatmapCanvas = document.getElementById('heatmap');
        heatmapCtx = heatmapCanvas.getContext('2d');
        
        tradeChartCanvas = document.getElementById('tradeChart');
        tradeChartCtx = tradeChartCanvas.getContext('2d');

        combatLogEl = document.getElementById('combatLog');
        warTickerEl = document.getElementById('warTicker');

        // Generate data
        generateStarSystems();

        // Initialize canvases
        resizeCanvases();

        // Start all loops
        startClockUpdate();
        startStarMapAnimation();
        startHeatmapAnimation();
        startTradeChartAnimation();
        startCombatLogFeed();
        startDataFlux();
        startMarketUpdates();

        // Initialize with some combat log entries
        for (let i = 0; i < 5; i++) {
            addCombatLogEntry(generateCombatMessage());
        }

        // Map button handlers
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Handle resize
        window.addEventListener('resize', resizeCanvases);
    }

    function resizeCanvases() {
        // Star map
        if (starMapCanvas) {
            starMapCanvas.width = starMapCanvas.offsetWidth;
            starMapCanvas.height = starMapCanvas.offsetHeight;
        }
        // Heatmap
        if (heatmapCanvas) {
            heatmapCanvas.width = heatmapCanvas.offsetWidth;
            heatmapCanvas.height = heatmapCanvas.offsetHeight;
        }
        // Trade chart
        if (tradeChartCanvas) {
            tradeChartCanvas.width = tradeChartCanvas.offsetWidth;
            tradeChartCanvas.height = tradeChartCanvas.offsetHeight;
        }
    }

    // ──── CLOCK UPDATE ────
    function startClockUpdate() {
        function updateClock() {
            const now = new Date();
            const year = 2847 + Math.floor((now.getFullYear() - 2024) * 0.5);
            const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
            const time = now.toTimeString().substr(0, 8);
            
            const clockEl = document.getElementById('hudTime');
            if (clockEl) {
                clockEl.textContent = `${year}.${String(dayOfYear).padStart(3, '0')}.${time} GST`;
            }
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // ──── STAR MAP ANIMATION ────
    let starField = [];
    let animationFrame = 0;

    function generateStarField() {
        starField = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            starField.push({
                x: rand(0, 800),
                y: rand(0, 500),
                size: rand(0.5, 2),
                brightness: rand(0.3, 1),
                twinkleSpeed: rand(0.01, 0.05),
                twinkleOffset: rand(0, Math.PI * 2)
            });
        }
    }

    function startStarMapAnimation() {
        generateStarField();
        animateStarMap();
    }

    function animateStarMap() {
        if (!starMapCtx) return;
        
        const ctx = starMapCtx;
        const w = starMapCanvas.width;
        const h = starMapCanvas.height;

        // Clear
        ctx.fillStyle = '#050508';
        ctx.fillRect(0, 0, w, h);

        // Draw nebula effect
        const gradient = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.3, h * 0.4, w * 0.5);
        gradient.addColorStop(0, 'rgba(0, 100, 150, 0.03)');
        gradient.addColorStop(0.5, 'rgba(50, 0, 100, 0.02)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Draw background stars
        starField.forEach(star => {
            const twinkle = Math.sin(animationFrame * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.brightness * (0.5 + twinkle * 0.5);
            ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(star.x * (w / 800), star.y * (h / 500), star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw grid
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.04)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw trade routes
        tradeRoutes.forEach(route => {
            const from = starSystems[route.from];
            const to = starSystems[route.to];
            const fx = from.x * (w / 800);
            const fy = from.y * (h / 500);
            const tx = to.x * (w / 800);
            const ty = to.y * (h / 500);

            ctx.strokeStyle = `rgba(255, 170, 0, ${0.1 + route.traffic * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.setLineDash([]);

            // Animated cargo dot
            const progress = (animationFrame * 0.01 * route.traffic) % 1;
            const dotX = lerp(fx, tx, progress);
            const dotY = lerp(fy, ty, progress);
            ctx.fillStyle = `rgba(255, 170, 0, ${0.5 + route.traffic * 0.5})`;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw stargate connections
        starSystems.forEach(sys => {
            if (sys.hasGate) {
                const connections = starSystems.filter(s => s.hasGate && s.id !== sys.id);
                if (connections.length > 0) {
                    const target = connections[sys.id % connections.length];
                    const sx = sys.x * (w / 800);
                    const sy = sys.y * (h / 500);
                    const tx = target.x * (w / 800);
                    const ty = target.y * (h / 500);

                    ctx.strokeStyle = 'rgba(0, 245, 255, 0.08)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(tx, ty);
                    ctx.stroke();
                }
            }
        });

        // Draw star systems
        starSystems.forEach(sys => {
            const x = sys.x * (w / 800);
            const y = sys.y * (h / 500);
            const color = factionColors[sys.faction];
            const pulse = Math.sin(animationFrame * sys.pulseSpeed + sys.pulse);
            const size = sys.size + pulse * 0.5;

            // Glow
            const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
            glow.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, size * 4, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // Station indicator
            if (sys.hasStation) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, y, size + 3, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Gate indicator
            if (sys.hasGate) {
                ctx.fillStyle = '#00f5ff';
                ctx.fillRect(x - 2, y - size - 5, 4, 2);
            }

            // Label for larger systems
            if (sys.size > 4) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = '8px Share Tech Mono';
                ctx.fillText(sys.name, x + size + 4, y + 3);
            }
        });

        // Draw current position indicator
        const currentSys = starSystems[0]; // Proxima
        const cx = currentSys.x * (w / 800);
        const cy = currentSys.y * (h / 500);
        
        // Pulsing ring
        const ringSize = 15 + Math.sin(animationFrame * 0.05) * 5;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, ringSize, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx + 8, cy);
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx, cy + 8);
        ctx.stroke();

        animationFrame++;
        requestAnimationFrame(animateStarMap);
    }

    // ──── HEATMAP ANIMATION ────
    let heatmapData = [];

    function generateHeatmapData() {
        heatmapData = [];
        for (let day = 0; day < 7; day++) {
            heatmapData[day] = [];
            for (let hour = 0; hour < 24; hour++) {
                // Simulate player activity patterns
                let base = 0.3;
                // Peak hours (evening)
                if (hour >= 18 && hour <= 23) base = 0.7;
                if (hour >= 12 && hour <= 17) base = 0.5;
                if (hour >= 6 && hour <= 11) base = 0.4;
                // Weekend boost
                if (day >= 5) base += 0.15;
                // Add randomness
                heatmapData[day][hour] = clamp(base + rand(-0.15, 0.15), 0.1, 1);
            }
        }
    }

    function startHeatmapAnimation() {
        generateHeatmapData();
        animateHeatmap();
    }

    function animateHeatmap() {
        if (!heatmapCtx) return;

        const ctx = heatmapCtx;
        const w = heatmapCanvas.width;
        const h = heatmapCanvas.height;

        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, w, h);

        const cellW = w / 24;
        const cellH = h / 7;

        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const value = heatmapData[day][hour];
                const x = hour * cellW;
                const y = day * cellH;

                // Color based on intensity
                let r, g, b;
                if (value < 0.3) {
                    r = 0; g = Math.floor(value * 200); b = Math.floor(value * 100);
                } else if (value < 0.6) {
                    r = Math.floor((value - 0.3) * 400);
                    g = Math.floor(150 + value * 100);
                    b = 0;
                } else {
                    r = 255;
                    g = Math.floor(100 - (value - 0.6) * 200);
                    b = Math.floor((value - 0.6) * 100);
                }

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + value * 0.7})`;
                ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

                // Value label for high activity
                if (value > 0.7) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.font = '7px Share Tech Mono';
                    ctx.fillText(Math.floor(value * 100), x + cellW/2 - 6, y + cellH/2 + 3);
                }
            }
        }

        // Hour labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '7px Share Tech Mono';
        for (let hour = 0; hour < 24; hour += 3) {
            ctx.fillText(`${hour}:00`, hour * cellW + 2, h - 2);
        }
    }

    // ──── TRADE CHART ANIMATION ────
    let tradeChartData = [];
    let tradeChartOffset = 0;

    function generateTradeChartData() {
        tradeChartData = [];
        let price = 12;
        for (let i = 0; i < 100; i++) {
            price += rand(-0.5, 0.5);
            price = clamp(price, 8, 16);
            tradeChartData.push(price);
        }
    }

    function startTradeChartAnimation() {
        generateTradeChartData();
        animateTradeChart();
    }

    function animateTradeChart() {
        if (!tradeChartCtx) return;

        const ctx = tradeChartCtx;
        const w = tradeChartCanvas.width;
        const h = tradeChartCanvas.height;

        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw price line
        const min = Math.min(...tradeChartData);
        const max = Math.max(...tradeChartData);
        const range = max - min;

        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let i = 0; i < tradeChartData.length; i++) {
            const x = (i / tradeChartData.length) * w;
            const y = h - ((tradeChartData[i] - min) / range) * (h - 20) - 10;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Gradient fill under line
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let i = 0; i < tradeChartData.length; i++) {
            const x = (i / tradeChartData.length) * w;
            const y = h - ((tradeChartData[i] - min) / range) * (h - 20) - 10;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Current price dot
        const lastPrice = tradeChartData[tradeChartData.length - 1];
        const lastX = w - 5;
        const lastY = h - ((lastPrice - min) / range) * (h - 20) - 10;
        
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Price label
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px Share Tech Mono';
        ctx.fillText(`◈ ${lastPrice.toFixed(2)}`, lastX - 40, lastY - 8);
    }

    // ──── COMBAT LOG FEED ────
    function startCombatLogFeed() {
        setInterval(() => {
            const entry = generateCombatMessage();
            addCombatLogEntry(entry);
        }, CONFIG.combatLogInterval);
    }

    function addCombatLogEntry(entry) {
        if (!combatLogEl) return;

        const div = document.createElement('div');
        div.className = `log-entry ${entry.type}`;
        div.innerHTML = `<span class="log-time">${entry.time}</span><span class="log-text">${entry.text}</span>`;
        
        combatLogEl.insertBefore(div, combatLogEl.firstChild);

        // Keep only last 20 entries
        while (combatLogEl.children.length > 20) {
            combatLogEl.removeChild(combatLogEl.lastChild);
        }
    }

    // ──── DATA FLUX (Live Updates) ────
    function startDataFlux() {
        setInterval(() => {
            // Update random values
            state.tps = clamp(60 + rand(-0.5, 0.5), 58, 60);
            state.ping = clamp(12 + randInt(-3, 3), 8, 25);
            state.fps = clamp(144 + randInt(-5, 5), 120, 165);
            
            state.capacitor = clamp(state.capacitor + rand(-2, 2), 60, 95);
            state.hull = clamp(state.hull + rand(-1, 1), 85, 100);
            state.shield = clamp(state.shield + rand(-3, 3), 70, 100);

            state.playersOnline = clamp(state.playersOnline + randInt(-500, 500), 250000, 320000);
            state.activeBattles = clamp(state.activeBattles + randInt(-50, 50), 10000, 18000);
            state.shipsDestroyed += randInt(0, 5);
            state.jumpsPerHour = clamp(state.jumpsPerHour + randInt(-10000, 10000), 1000000, 1500000);

            // Update warfront percentages
            const totalChange = rand(-2, 2);
            state.warfronts.federation = clamp(state.warfronts.federation + totalChange, 30, 50);
            state.warfronts.empire = clamp(state.warfronts.empire - totalChange * 0.5, 25, 40);
            state.warfronts.syndicate = clamp(state.warfronts.syndicate + rand(-1, 1), 10, 25);
            state.warfronts.pirates = 100 - state.warfronts.federation - state.warfronts.empire - state.warfronts.syndicate;

            // Update DOM
            updateDOMValues();
            updateHeatmapData();
        }, CONFIG.dataFluxInterval);
    }

    function updateDOMValues() {
        // Update various stat displays
        const elements = {
            '.hud-status + .hud-item .value': `${state.ping}ms`,
        };

        // Update TPS
        const tpsElements = document.querySelectorAll('.hud-right .value');
        tpsElements.forEach(el => {
            if (el.textContent.includes('60') || el.textContent.includes('59')) {
                el.textContent = state.tps.toFixed(1);
            }
        });
    }

    function updateHeatmapData() {
        // Slightly shift heatmap data
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                heatmapData[day][hour] = clamp(
                    heatmapData[day][hour] + rand(-0.02, 0.02),
                    0.1, 1
                );
            }
        }
    }

    // ──── MARKET UPDATES ────
    function startMarketUpdates() {
        setInterval(() => {
            // Update resource prices
            Object.keys(state.resources).forEach(key => {
                const res = state.resources[key];
                res.change = clamp(res.change + rand(-0.5, 0.5), -10, 15);
                res.price = clamp(res.price * (1 + res.change / 1000), res.price * 0.9, res.price * 1.1);
            });

            // Update trade chart
            tradeChartData.shift();
            const lastPrice = tradeChartData[tradeChartData.length - 1];
            tradeChartData.push(clamp(lastPrice + rand(-0.3, 0.3), 8, 16));
        }, CONFIG.marketUpdateInterval);
    }

    // ──── RESEARCH PROGRESS ────
    setInterval(() => {
        state.researchProgress.qeDrive = clamp(state.researchProgress.qeDrive + 0.1, 0, 100);
        state.researchProgress.shieldHarmonics = clamp(state.researchProgress.shieldHarmonics + 0.05, 0, 100);
        state.researchProgress.plasmaWeapons = clamp(state.researchProgress.plasmaWeapons + 0.02, 0, 100);
    }, 1000);

    // ──── CREDIT COUNTER ANIMATION ────
    setInterval(() => {
        state.credits += randInt(-1000, 5000);
        state.xp = clamp(state.xp + randInt(0, 100), 0, state.xpMax);
    }, 500);

    // ──── WAR TICKER UPDATES ────
    const warEvents = [
        { text: '⚡ ISS Leviathan destroyed in Sector 14!', type: 'red' },
        { text: '✦ Federation captures Helios Gate Station', type: 'green' },
        { text: '⚠ Massive fleet detected: Andromeda Corridor', type: 'amber' },
        { text: '📊 War bond prices surge +14.7%', type: 'cyan' },
        { text: '💀 847 ships lost in Proxima battle', type: 'red' },
        { text: '🏆 AEGIS alliance gains sovereignty in Sector 9', type: 'green' },
        { text: '🔴 Void Empire reinforcements arriving', type: 'red' },
        { text: '📡 Jump bridge network disrupted', type: 'amber' }
    ];

    setInterval(() => {
        if (!warTickerEl) return;
        const event = pick(warEvents);
        const span = document.createElement('span');
        span.className = `wt-item ${event.type}`;
        span.textContent = event.text;
        warTickerEl.insertBefore(span, warTickerEl.firstChild);
        
        while (warTickerEl.children.length > 10) {
            warTickerEl.removeChild(warTickerEl.lastChild);
        }
    }, 8000);

    // ──── NUMBER FORMATTING ────
    function formatNumber(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // ──── SHIP STATUS ANIMATIONS ────
    setInterval(() => {
        // Animate HP/Shield bars slightly
        document.querySelectorAll('.hp-fill, .shield-fill').forEach(bar => {
            const current = parseFloat(bar.style.width);
            const newVal = clamp(current + rand(-1, 1), 20, 100);
            if (!bar.classList.contains('red-bar')) {
                bar.style.width = newVal + '%';
            }
        });
    }, 2000);

    // ──── CAPACITOR ANIMATION ────
    setInterval(() => {
        const capFill = document.querySelector('.cap-fill');
        if (capFill) {
            state.capacitor = clamp(state.capacitor + rand(-2, 2), 50, 95);
            capFill.style.width = state.capacitor + '%';
        }
    }, 1500);

    // ──── SCANLINE EFFECT ENHANCEMENT ────
    let scanlineOffset = 0;
    function animateScanlines() {
        scanlineOffset = (scanlineOffset + 0.5) % 4;
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) {
            scanlines.style.backgroundPosition = `0 ${scanlineOffset}px`;
        }
        requestAnimationFrame(animateScanlines);
    }
    animateScanlines();

    // ──── BOOT SEQUENCE EFFECT ────
    function bootSequence() {
        const panels = document.querySelectorAll('.panel');
        panels.forEach((panel, index) => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // ──── INITIALIZE ON DOM READY ────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            bootSequence();
        });
    } else {
        init();
        bootSequence();
    }

})();
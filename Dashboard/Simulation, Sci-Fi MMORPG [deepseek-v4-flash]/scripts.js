// ============================================
// STELLAR COMMAND DASHBOARD
// Real-time data simulation and visualization
// ============================================

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        refreshInterval: 2000,        // ms between data updates
        mapAnimationSpeed: 0.001,     // star drift speed
        maxStarCount: 180,
        anomalies: [
            { x: 0.3, y: 0.2, label: '☄️ Asteroid', type: 'danger' },
            { x: 0.7, y: 0.6, label: '🌀 Wormhole', type: 'special' },
            { x: 0.2, y: 0.8, label: '🛸 Anomaly', type: 'anomaly' },
            { x: 0.85, y: 0.15, label: '⚡ Ion Storm', type: 'warning' },
            { x: 0.45, y: 0.45, label: '📡 Relay', type: 'neutral' },
        ]
    };

    // ============================================
    // STATE
    // ============================================
    const state = {
        credits: 18492309,
        energy: 78,
        fleetPower: 2.4,
        time: { hours: 0, minutes: 0, seconds: 0 },
        stats: {
            'Total Fleet Power': { value: 2.4, unit: 'M', trend: 'up' },
            'Shield Capacity': { value: 890, unit: 'K', trend: 'up' },
            'Active Ships': { value: 347, unit: '', trend: 'down' },
            'Resource Rate': { value: 12.4, unit: 'K/s', trend: 'up' },
            'Morale': { value: 78, unit: '%', trend: 'up' },
        }
    };

    // ============================================
    // DOM REFERENCES
    // ============================================
    const clockEl = document.querySelector('.banner-center .empire-clock');
    const starCanvas = document.getElementById('star-map-canvas');

    // ============================================
    // STAR MAP (Canvas)
    // ============================================
    function initStarMap() {
        if (!starCanvas) return;
        const ctx = starCanvas.getContext('2d');
        const w = starCanvas.width;
        const h = starCanvas.height;

        // Stars
        const stars = [];
        for (let i = 0; i < 180; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.8 + 0.5,
                a: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.3 + 0.05
            });
        }

        // Sector lines
        function drawSectorGrid() {
            ctx.strokeStyle = 'rgba(60, 120, 200, 0.08)';
            ctx.lineWidth = 0.5;
            const step = 60;
            for (let x = 0; x <= w; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y <= h; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        }

        // Anomaly zones
        const anomalies = [
            { x: 120, y: 80, r: 30, color: 'rgba(255, 100, 200, 0.06)' },
            { x: 320, y: 220, r: 45, color: 'rgba(100, 200, 255, 0.05)' },
            { x: 220, y: 180, r: 20, color: 'rgba(255, 200, 50, 0.04)' },
        ];

        let frame = 0;
        function draw() {
            frame++;
            ctx.clearRect(0, 0, w, h);

            // Background gradient
            const grad = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, 250);
            grad.addColorStop(0, 'rgba(10, 20, 50, 0.8)');
            grad.addColorStop(1, 'rgba(2, 4, 12, 0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Grid
            drawSectorGrid();

            // Anomalies
            anomalies.forEach(a => {
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fillStyle = a.color;
                ctx.fill();
                // pulsating ring
                const pulse = Math.sin(frame * 0.02) * 5 + a.r;
                ctx.beginPath();
                ctx.arc(a.x, a.y, pulse, 0, Math.PI * 2);
                ctx.strokeStyle = a.color.replace('0.06', '0.15').replace('0.05', '0.12').replace('0.04', '0.1');
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Stars with parallax drift
            stars.forEach((star, i) => {
                const driftX = Math.sin(frame * star.speed * 0.005 + i) * 1.2;
                const driftY = Math.cos(frame * star.speed * 0.005 + i * 1.3) * 0.8;
                const x = star.x + driftX;
                const y = star.y + driftY;

                // Glow
                const glow = ctx.createRadialGradient(x, y, 0, x, y, star.r * 3);
                glow.addColorStop(0, `rgba(180, 220, 255, ${star.a * 0.3})`);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(x, y, star.r * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(200, 230, 255, ${star.a})`;
                ctx.beginPath();
                ctx.arc(x, y, star.r, 0, Math.PI * 2);
                ctx.fill();

                // Occasional twinkle
                if (Math.sin(frame * 0.1 + i * 7) > 0.95) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.a * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(x, y, star.r * 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Highlight points (faction capitals etc.)
            const points = [
                { x: 80, y: 50, label: '🏛️ Terra', color: '#4a9eff' },
                { x: 450, y: 280, label: '🔴 Cygnus', color: '#ff4444' },
                { x: 200, y: 300, label: '🌑 Void', color: '#aa66ff' },
                { x: 500, y: 80, label: '🪸 Xen\'thar', color: '#44dd88' },
            ];

            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.font = '8px sans-serif';
                ctx.fillText(p.label, p.x + 8, p.y + 3);
            });

            requestAnimationFrame(draw);
        }

        draw();
    }

    // ============================================
    // CLOCK & TIMER
    // ============================================
    function updateClock() {
        state.time.seconds += 1;
        if (state.time.seconds >= 60) {
            state.time.seconds = 0;
            state.time.minutes += 1;
        }
        if (state.time.minutes >= 60) {
            state.time.minutes = 0;
            state.time.hours += 1;
        }
        if (state.time.hours >= 100) state.time.hours = 0;

        const h = String(state.time.hours).padStart(2, '0');
        const m = String(state.time.minutes).padStart(2, '0');
        const s = String(state.time.seconds).padStart(2, '0');

        const clockEls = document.querySelectorAll('.empire-clock');
        clockEls.forEach(el => {
            el.textContent = `⏱️ T+ ${h}:${m}:${s}`;
        });
    }

    // ============================================
    // DATA UPDATES (simulated)
    // ============================================
    function updateStats() {
        // Simulate resource fluctuations
        const resourceRows = document.querySelectorAll('.resources .stat-row');
        resourceRows.forEach(row => {
            const valueEl = row.querySelector('.stat-value');
            const trendEl = row.querySelector('.trend');
            if (!valueEl || !trendEl) return;

            // Parse current value
            let text = valueEl.textContent;
            let num = parseFloat(text.replace(/[^0-9.]/g, ''));
            if (isNaN(num)) return;

            // Random walk
            const change = (Math.random() - 0.48) * 0.02 * num;
            num = Math.max(0, num + change);

            // Format
            if (text.includes('M')) {
                valueEl.textContent = (num / 1e6).toFixed(1) + 'M';
            } else if (text.includes('K')) {
                valueEl.textContent = (num / 1e3).toFixed(1) + 'K';
            } else {
                valueEl.textContent = num.toFixed(1);
            }

            // Trend
            if (change > 0) {
                trendEl.className = 'trend up';
                trendEl.textContent = `▲ +${(change / (num - change || 1) * 100).toFixed(1)}%`;
            } else {
                trendEl.className = 'trend down';
                trendEl.textContent = `▼ ${(change / (num - change || 1) * 100).toFixed(1)}%`;
            }
        });

        // Fleet power minor fluctuations
        const fleetRows = document.querySelectorAll('.fleet-status .stat-value');
        fleetRows.forEach(el => {
            const text = el.textContent;
            if (text.includes('M')) {
                const base = 4.7;
                const newVal = (base + (Math.random() - 0.5) * 0.1).toFixed(1);
                el.textContent = newVal + 'M ⚡';
            }
        });

        // Mission ETAs countdown
        const etaEls = document.querySelectorAll('.mission-item .eta:not(.alert-item .eta)');
        etaEls.forEach(el => {
            let text = el.textContent;
            if (text === 'IMMEDIATE') return;
            if (text.includes('h')) {
                let hours = parseFloat(text);
                if (!isNaN(hours)) {
                    hours = Math.max(0, hours - 0.1);
                    el.textContent = `ETA ${hours.toFixed(1)}h`;
                }
            } else if (text.includes('m')) {
                let mins = parseInt(text);
                if (!isNaN(mins)) {
                    mins = Math.max(0, mins - 2);
                    el.textContent = `ETA ${mins}m`;
                }
            }
        });
    }

    // ============================================
    // EVENT LOG – Add new entries periodically
    // ============================================
    function addLogEntry() {
        const logContainer = document.querySelector('.scrollable-log');
        if (!logContainer) return;

        const events = [
            { type: 'info', msg: `[INFO] Scan completed – Sector ${Math.floor(Math.random() * 12) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}` },
            { type: 'info', msg: `[INFO] Trade vessel arrived at ${['Terra Prime', 'Nova Kepler', 'Ironforge'][Math.floor(Math.random() * 3)]}` },
            { type: 'warn', msg: `[WARN] Ion storm detected near ${['trade route', 'colony', 'outpost'][Math.floor(Math.random() * 3)]}` },
            { type: 'err', msg: `[ALERT] Unknown signature – sector ${Math.floor(Math.random() * 20) + 1}` },
            { type: 'info', msg: `[INFO] Resource extraction +${(Math.random() * 5 + 1).toFixed(1)}K units` },
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        const entry = document.createElement('div');
        entry.className = `log-entry log-${event.type}`;
        entry.textContent = event.msg;
        logContainer.appendChild(entry);

        // Keep max 20 entries
        while (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.firstChild);
        }

        // Scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // ============================================
    // CREDITS COUNTER (animated)
    // ============================================
    function updateCredits() {
        const creditEl = document.querySelector('.credits-display');
        if (!creditEl) return;

        const change = Math.floor(Math.random() * 50000 + 10000) * (Math.random() > 0.3 ? 1 : -1);
        state.credits += change;
        state.credits = Math.max(0, state.credits);

        const formatted = state.credits.toLocaleString('en-US');
        creditEl.textContent = `💰 ${formatted} CR`;
    }

    // ============================================
    // THREAT LEVEL FLASH
    // ============================================
    function updateThreatLevel() {
        const threatEl = document.querySelector('.military .stat-value');
        if (!threatEl) return;

        const levels = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'CRITICAL'];
        const colors = ['#44dd88', '#ffaa33', '#ff6666', '#ff3366', '#ff0033'];
        const idx = Math.floor(Math.random() * 5);
        threatEl.textContent = levels[idx];
        threatEl.style.color = colors[idx];
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        // Set initial clock
        updateClock();

        // Initialize star map
        initStarMap();

        // Periodic updates
        setInterval(() => {
            updateClock();
            updateStats();
            updateCredits();
        }, CONFIG.refreshInterval);

        // Event log entries
        setInterval(addLogEntry, 4000);

        // Threat level
        setInterval(updateThreatLevel, 8000);

        // Add initial log entries
        for (let i = 0; i < 5; i++) {
            setTimeout(addLogEntry, i * 500);
        }

        console.log('🌟 STELLAR DOMINION – Command Dashboard initialized');
        console.log(`📡 Systems online | ${new Date().toISOString()}`);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
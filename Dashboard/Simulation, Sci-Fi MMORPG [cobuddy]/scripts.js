const scripts = {
    // Live clock update
    initClock() {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const el = document.querySelector('.server-time');
            if (el) el.textContent = `${hours}:${minutes}:${seconds} UTC`;
        };
        setInterval(updateClock, 1000);
        updateClock();
    },

    // Simulate fleet HP changes
    simulateFleetUpdates() {
        const fleetRows = document.querySelectorAll('.fleet-row:not(.header)');
        const statuses = ['status-engaged', 'status-patrol', 'status-attack', 'status-defend', 'status-idle', 'status-recover', 'status-trade', 'status-mine'];
        const statusLabels = ['⚔️ ENGAGED', '🔄 PATROL', '💥 ATTACK', '🛡️ DEFEND', '⏸️ IDLE', '🔧 RECOVER', '💰 TRADE', '⛏️ MINING'];
        const ships = ['🛸 Imperius', '🛸 Phantom', '🛸 Wrath', '🛸 Seraph', '🛸 Tempest', '🛸 Vortex', '🛸 Eclipse', '🛸 Aegis', '🛸 Fury', '🛸 Zenith', '🛸 Horizon', '🛸 Nebula'];

        setInterval(() => {
            fleetRows.forEach(row => {
                const hpDiv = row.querySelector('.hp-bar > div');
                if (hpDiv) {
                    const current = parseInt(hpDiv.style.width);
                    const change = Math.floor(Math.random() * 11) - 5;
                    const newHp = Math.max(5, Math.min(100, current + change));
                    hpDiv.style.width = newHp + '%';

                    if (newHp <= 30) {
                        hpDiv.style.background = '#ff4757';
                    } else if (newHp <= 60) {
                        hpDiv.style.background = '#ffa502';
                    } else {
                        hpDiv.style.background = '#2ed573';
                    }
                }

                const statusEl = row.querySelector('[class*="status-"]');
                if (statusEl && Math.random() < 0.15) {
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    statusEl.className = newStatus;
                    const label = statusLabels[statuses.indexOf(newStatus)];
                    statusEl.textContent = label;
                }
            });
        }, 3000);
    },

    // Scrolling comm log with new messages
    simulateCommLog() {
        const messages = [
            { time: null, channel: '🔵 COALITION', text: 'Fleet FLT-009 reporting hostile contacts near Gamma-44' },
            { time: null, channel: '🔴 DOMINION', text: 'All wings scramble — Sector Alpha-7 breach detected' },
            { time: null, channel: '🟡 HEGEMONY', text: 'Trade convoy RT-773 departed Neutral Zone — ETA 2h' },
            { time: null, channel: '🟢 SYNTHETICA', text: 'Nano Swarm prototype test successful — ready for deployment' },
            { time: null, channel: '⚡ SYSTEM', text: 'Anomalous energy readings detected in Void-1 sector' },
            { time: null, channel: '🔵 COALITION', text: 'Reinforcements en route to Omega-12 — ETA 4 minutes' },
            { time: null, channel: '🔴 DOMINION', text: 'Counter-offensive initiated — reclaiming Delta-44' },
            { time: null, channel: '⚡ SYSTEM', text: 'New Dark Matter deposit confirmed — Zeta-9 deep scan' },
            { time: null, channel: '🟡 HEGEMONY', text: 'Diplomatic envoy dispatched to Coalition HQ' },
            { time: null, channel: '🟢 SYNTHETICA', text: 'Colony ship SC-441 arriving at Crystal Mines — 12:03:44' },
            { time: null, channel: '🔵 COALITION', text: 'Cdr. Xerath requesting fleet reassignment — Alpha-7' },
            { time: null, channel: '🔴 DOMINION', text: 'Warning: Pirate convoy Sigma flanking from western corridor' },
            { time: null, channel: '⚡ SYSTEM', text: 'Warp gate Sigma-8 restored to operational status' },
            { time: null, channel: '🟡 HEGEMONY', text: 'Resource convoy under escort — Dark Matter shipment' },
            { time: null, channel: '🟢 SYNTHETICA', text: 'Research milestone: FTL Drive 72% — ahead of schedule' },
        ];

        const feed = document.querySelector('.comm-feed');
        if (!feed) return;

        let msgIndex = 0;
        const addMessage = () => {
            const msg = messages[msgIndex % messages.length];
            const now = new Date();
            const timeStr = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}]`;
            const el = document.createElement('div');
            el.className = 'comm-msg';
            el.innerHTML = `<span class="comm-time">${timeStr}</span> <span class="comm-ch">${msg.channel}</span> ${msg.text}`;
            feed.insertBefore(el, feed.firstChild);

            const maxMessages = 15;
            while (feed.children.length > maxMessages) {
                feed.removeChild(feed.lastChild);
            }

            msgIndex++;
        };

        setInterval(addMessage, 4000);
    },

    // Resource rate fluctuation
    simulateResources() {
        const rateEls = document.querySelectorAll('.resource-rate');
        const stockEls = document.querySelectorAll('.resource-stock');

        const resourceData = [
            { rate: 2.4, stock: 847.2, suffix: 'B' },
            { rate: 0.89, stock: 124.5, suffix: 'B' },
            { rate: 1.7, stock: 523.8, suffix: 'B' },
            { rate: 0.56, stock: 89.1, suffix: 'B' },
            { rate: 4.2, stock: 12.4, suffix: 'T' },
            { rate: 0.12, stock: 23.7, suffix: 'B' },
            { rate: 0.34, stock: 156.2, suffix: 'B' },
            { rate: 0.78, stock: 312.9, suffix: 'B' },
        ];

        setInterval(() => {
            resourceData.forEach((res, i) => {
                res.rate += (Math.random() - 0.5) * 0.2;
                res.rate = Math.max(0.01, Math.round(res.rate * 100) / 100);
                res.stock += res.rate * 0.01;
                res.stock = Math.round(res.stock * 10) / 10;

                if (rateEls[i]) {
                    rateEls[i].textContent = `+${res.rate}M/s`;
                }
                if (stockEls[i]) {
                    const val = res.stock >= 1000 ? (res.stock / 1000).toFixed(1) + 'T' : res.stock.toFixed(1) + res.suffix;
                    stockEls[i].textContent = val;
                }
            });
        }, 2000);
    },

    // War events cycling
    simulateWarEvents() {
        const events = [
            { time: '23:47', text: '⚔️ Sector Gamma-44: Coalition vs Dominion — intense fighting' },
            { time: '23:45', text: '💥 Hegemony lost 3 territories near Omega — morale dropping' },
            { time: '23:43', text: '🛡️ Synthetica reinforced Delta-12 — morale boost' },
            { time: '23:41', text: '⚡ Coalition breakthrough in Alpha-7 — 2 sectors captured' },
            { time: '23:39', text: '🔴 Dominion fleet spotted approaching Neutral Zone' },
            { time: '23:37', text: '🟡 Hegemony trade convoy ambushed — cargo lost' },
            { time: '23:35', text: '🟢 Synthetica new colony established at Crystal Mines' },
            { time: '23:33', text: '⚔️ Multi-faction skirmish in Void-1 — casualties rising' },
            { time: '23:31', text: '🛡️ Coalition defensive perimeter holding — Alpha-7' },
            { time: '23:29', text: '💀 Pirate convoy Sigma destroyed — Coalition bounty claimed' },
        ];

        const container = document.querySelector('.war-events');
        if (!container) return;

        let eventIdx = 0;
        setInterval(() => {
            const event = events[eventIdx % events.length];
            const el = document.createElement('div');
            el.className = 'war-event';
            el.innerHTML = `<span class="event-time">${event.time}</span> ${event.text}`;
            container.insertBefore(el, container.firstChild);

            while (container.children.length > 6) {
                container.removeChild(container.lastChild);
            }
            eventIdx++;
        }, 5000);
    },

    // Threat level fluctuation
    simulateThreats() {
        const threatLevels = document.querySelectorAll('.threat-level');
        const threatDistances = document.querySelectorAll('.threat-distance');

        setInterval(() => {
            threatLevels.forEach(el => {
                const rand = Math.random();
                if (rand < 0.3) {
                    el.className = 'threat-level critical';
                    el.textContent = 'CRITICAL';
                } else if (rand < 0.6) {
                    el.className = 'threat-level high';
                    el.textContent = 'HIGH';
                } else if (rand < 0.85) {
                    el.className = 'threat-level medium';
                    el.textContent = 'MEDIUM';
                } else {
                    el.className = 'threat-level low';
                    el.textContent = 'LOW';
                }
            });

            threatDistances.forEach(el => {
                const dist = (Math.random() * 50 + 1).toFixed(1);
                el.textContent = dist + ' LY';
            });
        }, 6000);
    },

    // Research progress tick
    simulateResearch() {
        const progressNodes = document.querySelectorAll('.node.progress');
        progressNodes.forEach(node => {
            const progressText = node.querySelector('.progress-text');
            if (progressText) {
                let val = parseFloat(progressText.textContent);
                val = Math.min(100, val + Math.random() * 0.3);
                progressText.textContent = val.toFixed(1) + '%';
                node.style.width = val + '%';
            }
        });
    },

    // Event queue countdown
    simulateEventCountdown() {
        const timers = document.querySelectorAll('.event-timer');
        setInterval(() => {
            timers.forEach(el => {
                const parts = el.textContent.match(/(\\d+):(\\d+):(\\d+)/);
                if (parts) {
                    let h = parseInt(parts[1]);
                    let m = parseInt(parts[2]);
                    let s = parseInt(parts[3]);
                    s--;
                    if (s < 0) { s = 59; m--; }
                    if (m < 0) { m = 59; h--; }
                    if (h < 0) { h = 0; m = 0; s = 0; }
                    el.textContent = `⏱️ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                }
            });
        }, 1000);
    },

    // Star map twinkling
    simulateStars() {
        const stars = document.querySelectorAll('.star');
        setInterval(() => {
            stars.forEach(star => {
                const currentOpacity = parseFloat(star.style.opacity) || parseFloat(star.getAttribute('opacity'));
                const flicker = currentOpacity + (Math.random() - 0.5) * 0.2;
                star.style.opacity = Math.max(0.3, Math.min(1, flicker));
            });
        }, 800);
    },

    // Radar blip movement
    simulateRadar() {
        const blips = document.querySelectorAll('.radar-blip');
        setInterval(() => {
            blips.forEach(blip => {
                const currentLeft = parseFloat(blip.style.left);
                const currentTop = parseFloat(blip.style.top);
                const newLeft = Math.max(5, Math.min(95, currentLeft + (Math.random() - 0.5) * 4));
                const newTop = Math.max(5, Math.min(95, currentTop + (Math.random() - 0.5) * 4));
                blip.style.left = newLeft + '%';
                blip.style.top = newTop + '%';
            });
        }, 2000);
    },

    // Global tick counter
    simulateTickCounter() {
        const tickEl = document.querySelector('.bottom-center span');
        if (!tickEl) return;
        let tick = 4287391;
        setInterval(() => {
            tick += Math.floor(Math.random() * 3) + 1;
            const parts = tickEl.textContent.match(/Tick: (\\d+)/);
            if (parts) {
                tickEl.textContent = tickEl.textContent.replace(parts[1], tick.toString());
            }
        }, 1000);
    },

    // Player stat micro-fluctuations
    simulatePlayerStats() {
        const statValues = document.querySelectorAll('.stat-value');
        setInterval(() => {
            const creditEl = statValues[6]; // Credits
            if (creditEl) {
                const match = creditEl.textContent.match(/(\\d+\\.\\d+)M/);
                if (match) {
                    const val = parseFloat(match[1]) + Math.random() * 0.1;
                    creditEl.textContent = `🪙 ${val.toFixed(1)}M`;
                }
            }
        }, 5000);
    },

    // Warp gate load fluctuation
    simulateWarpGates() {
        const warpLoads = document.querySelectorAll('.warp-load');
        setInterval(() => {
            warpLoads.forEach(el => {
                const current = parseInt(el.textContent.match(/(\\d+)/)[1]);
                const change = Math.floor(Math.random() * 7) - 3;
                const newVal = Math.max(5, Math.min(99, current + change));
                el.textContent = `Load: ${newVal}%`;
            });
        }, 4000);
    },

    // Performance metrics fluctuation
    simulatePerformance() {
        const perfValues = document.querySelectorAll('.perf-value');
        const perfBars = document.querySelectorAll('.perf-bar > div');
        setInterval(() => {
            const cpu = 60 + Math.random() * 20;
            const mem = 75 + Math.random() * 15;
            const net = 40 + Math.random() * 30;
            const db = 2 + Math.random() * 1;

            if (perfValues[0]) perfValues[0].textContent = Math.round(cpu) + '%';
            if (perfValues[1]) perfValues[1].textContent = Math.round(mem) + '%';
            if (perfValues[2]) perfValues[2].textContent = Math.round(net) + '%';
            if (perfValues[3]) perfValues[3].textContent = db.toFixed(1) + 'M';

            if (perfBars[0]) perfBars[0].style.width = cpu + '%';
            if (perfBars[1]) perfBars[1].style.width = mem + '%';
            if (perfBars[2]) perfBars[2].style.width = net + '%';
            if (perfBars[3]) perfBars[3].style.width = (db / 5 * 100) + '%';
        }, 3000);
    },

    // XP bar gradual fill
    simulateXP() {
        const xpFill = document.querySelector('.xp-fill');
        const xpText = document.querySelector('.xp-text');
        if (!xpFill) return;

        let xp = 87;
        setInterval(() => {
            xp += Math.random() * 0.05;
            if (xp > 100) xp = 87;
            xpFill.style.width = xp + '%';
            xpText.textContent = `${xp.toFixed(1)}% — 2.4M / 2.8M XP`;
        }, 5000);
    },

    // Trade summary updates
    simulateTrade() {
        const tradeValues = document.querySelectorAll('.trade-row span:last-child');
        setInterval(() => {
            if (tradeValues[0]) {
                const val = (4 + Math.random() * 2).toFixed(1);
                tradeValues[0].textContent = val + 'B credits worth';
            }
            if (tradeValues[1]) {
                const val = (1.5 + Math.random() * 1.5).toFixed(1);
                tradeValues[1].textContent = val + 'B credits worth';
            }
        }, 7000);
    },

    // Online player count fluctuation
    simulatePlayerCount() {
        const el = document.querySelector('.quick-stats span:first-child');
        if (!el) return;
        setInterval(() => {
            const base = 2847391;
            const change = Math.floor(Math.random() * 200) - 100;
            el.textContent = `👥 ${(base + change).toLocaleString()} Online`;
        }, 5000);
    },

    // Init all
    init() {
        this.initClock();
        this.simulateFleetUpdates();
        this.simulateCommLog();
        this.simulateResources();
        this.simulateWarEvents();
        this.simulateThreats();
        this.simulateResearch();
        this.simulateEventCountdown();
        this.simulateStars();
        this.simulateRadar();
        this.simulateTickCounter();
        this.simulatePlayerStats();
        this.simulateWarpGates();
        this.simulatePerformance();
        this.simulateXP();
        this.simulateTrade();
        this.simulatePlayerCount();

        // Add hover tooltip for star map
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                star.style.transform = 'scale(2)';
                star.style.zIndex = '10';
            });
            star.addEventListener('mouseleave', () => {
                star.style.transform = 'scale(1)';
                star.style.zIndex = '1';
            });
        });

        // Panel click interactions
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.addEventListener('click', () => {
                panel.style.borderColor = 'var(--accent-cyan)';
                setTimeout(() => {
                    panel.style.borderColor = '';
                }, 500);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    scripts.init();
});
/**
 * NEXUS PRIME // COMMAND DASHBOARD
 * High-density sci-fi MMORPG simulation controller
 * Handles real-time telemetry, dynamic feeds, and UI state management
 */
(function() {
    'use strict';

    // ─── DOM CACHE ────────────────────────────────────────────────────
    const DOM = {
        serverTime: document.getElementById('server-time'),
        combatLog: document.getElementById('combat-log'),
        tickerScroll: document.getElementById('ticker-scroll'),
        chatFeed: document.getElementById('chat-feed'),
        notifications: document.getElementById('notifications'),
        notifCollapsed: document.querySelector('.notif-collapsed'),
        notifContent: document.querySelector('.notif-content'),
        resourceRates: document.querySelectorAll('.res-rate'),
        shipHPs: document.querySelectorAll('.fleet-ship .ship-hp'),
        miniCharts: document.querySelectorAll('.mini-chart'),
        sysVals: document.querySelectorAll('.sys-val'),
        sysFills: document.querySelectorAll('.sys-fill'),
        starmap: document.getElementById('starmap')
    };

    // ─── UTILITIES ────────────────────────────────────────────────────
    const Utils = {
        rand: (min, max) => Math.random() * (max - min) + min,
        randInt: (min, max) => Math.floor(Utils.rand(min, max + 1)),
        pad: (n) => n.toString().padStart(2, '0'),
        clamp: (val, min, max) => Math.min(Math.max(val, min), max),
        formatNum: (n) => n > 999 ? (n/1000).toFixed(1) + 'K' : n.toFixed(1)
    };

    // ─── SERVER TIME MANAGER ──────────────────────────────────────────
    class ServerTime {
        constructor() { this.start(); }
        start() {
            const update = () => {
                const now = new Date();
                const date = `2847.12.${Utils.pad(now.getDate())}`;
                const time = `${Utils.pad(now.getHours())}:${Utils.pad(now.getMinutes())}:${Utils.pad(now.getSeconds())}`;
                if (DOM.serverTime) DOM.serverTime.textContent = `${date} // ${time}`;
            };
            update();
            setInterval(update, 1000);
        }
    }

    // ─── COMBAT LOG FEED ──────────────────────────────────────────────
    class CombatLog {
        constructor() {
            this.factions = [
                { type: 'ally', name: 'VOIDWALKERS', color: '#00ff88' },
                { type: 'enemy', name: 'DARK SECTOR', color: '#ff0040' },
                { type: 'neutral', name: 'SOL FED', color: '#ff9f1c' },
                { type: 'ally', name: 'TRADERS', color: '#00ff88' }
            ];
            this.events = [
                { target: 'Kraken-3', dmg: '-2.4K ⚡' },
                { target: 'Hauler-MK5', dmg: '-890 💥' },
                { target: 'Shield Array', dmg: '🛡️ +15%' },
                { target: 'Trade Convoy', dmg: '📦 +450K 🔩' },
                { target: 'Outpost-9', dmg: 'CAPTURED ✅' },
                { target: 'Void Edge', dmg: '⚠️ INVASION' },
                { target: 'Plasma Depot', dmg: '🔧 REPAIR 88%' },
                { target: 'Market Hub', dmg: '📈 +12.4%' }
            ];
            this.start();
        }

        start() {
            setInterval(() => this.addEntry(), 3500);
        }

        addEntry() {
            if (!DOM.combatLog) return;
            const now = new Date();
            const time = `${Utils.pad(now.getHours())}:${Utils.pad(now.getMinutes())}:${Utils.pad(now.getSeconds())}`;
            const faction = this.factions[Utils.randInt(0, this.factions.length - 1)];
            const event = this.events[Utils.randInt(0, this.events.length - 1)];

            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <span class="log-time">${time}</span>
                <span class="log-faction ${faction.type}">[${faction.name}]</span>
                <span class="log-target">→ ${event.target}</span>
                <span class="log-dmg">${event.dmg}</span>
            `;

            DOM.combatLog.appendChild(entry);
            DOM.combatLog.scrollTop = DOM.combatLog.scrollHeight;

            // Memory management: keep max 20 entries
            if (DOM.combatLog.children.length > 20) {
                DOM.combatLog.removeChild(DOM.combatLog.firstChild);
            }
        }
    }

    // ─── MARKET TICKER SIMULATOR ──────────────────────────────────────
    class MarketTicker {
        constructor() {
            this.items = document.querySelectorAll('.ticker-item');
            this.start();
        }

        start() {
            setInterval(() => {
                this.items.forEach(item => {
                    const priceEl = item.querySelector('.t-price');
                    const changeEl = item.querySelector('.t-change');
                    if (!priceEl || !changeEl) return;

                    let current = parseFloat(priceEl.textContent.replace(/K|M/g, ''));
                    const volatility = Utils.rand(-3.5, 4.2);
                    current = Utils.clamp(current + volatility, 0.1, 999);

                    priceEl.textContent = Utils.formatNum(current);

                    const isUp = volatility >= 0;
                    changeEl.textContent = `${isUp ? '▲' : '▼'} ${Math.abs(volatility).toFixed(1)}%`;
                    changeEl.className = `t-change ${isUp ? 'up' : 'down'}`;
                });
            }, 4000);
        }
    }

    // ─── CHAT SIMULATOR ───────────────────────────────────────────────
    class ChatSimulator {
        constructor() {
            this.messages = [
                { user: 'NovaBlade', color: '#00f0ff', text: 'fleet regroup at alpha, ETA 2 min' },
                { user: 'StarWitch99', color: '#ff9f1c', text: 'need 500 plasma cells for raid' },
                { user: 'QuantumX', color: '#9d4edd', text: 'anomaly scan complete, data uploaded' },
                { user: 'IronPilot', color: '#00ff88', text: 'dreadnought repaired and ready 🚀' },
                { user: '[SYS]', color: '#ff0040', text: '⚠️ Sector 7 lockdown in 5 minutes' },
                { user: 'ZenithOps', color: '#00f0ff', text: 'selling rare blueprints, PM for details' },
                { user: 'Eclipse', color: '#ff9f1c', text: 'anyone running the abyss gauntlet?' },
                { user: 'VoidWalker', color: '#9d4edd', text: 'trade convoy secured, extracting now' }
            ];
            this.start();
        }

        start() {
            setInterval(() => this.post(), 5500);
        }

        post() {
            if (!DOM.chatFeed) return;
            const msg = this.messages[Utils.randInt(0, this.messages.length - 1)];
            const el = document.createElement('div');
            el.className = 'chat-msg';
            el.innerHTML = `<span class="chat-user" style="color:${msg.color}">${msg.user}:</span> <span class="chat-text">${msg.text}</span>`;
            
            DOM.chatFeed.appendChild(el);
            DOM.chatFeed.scrollTop = DOM.chatFeed.scrollHeight;

            if (DOM.chatFeed.children.length > 20) {
                DOM.chatFeed.removeChild(DOM.chatFeed.firstChild);
            }
        }
    }

    // ─── NOTIFICATION PANEL ───────────────────────────────────────────
    class NotificationPanel {
        constructor() {
            this.isOpen = false;
            this.init();
        }

        init() {
            if (!DOM.notifCollapsed) return;
            
            // Set initial state via JS to avoid CSS conflicts
            DOM.notifContent.style.maxHeight = '0';
            DOM.notifContent.style.opacity = '0';
            DOM.notifContent.style.pointerEvents = 'none';
            DOM.notifContent.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

            DOM.notifCollapsed.addEventListener('click', () => this.toggle());
        }

        toggle() {
            this.isOpen = !this.isOpen;
            DOM.notifContent.style.maxHeight = this.isOpen ? '200px' : '0';
            DOM.notifContent.style.opacity = this.isOpen ? '1' : '0';
            DOM.notifContent.style.pointerEvents = this.isOpen ? 'auto' : 'none';
            DOM.notifCollapsed.querySelector('span').textContent = this.isOpen ? '🔔 HIDE' : `🔔 5`;
        }
    }

    // ─── SPARKLINE GENERATOR ──────────────────────────────────────────
    class SparklineCharts {
        constructor() {
            this.init();
        }

        init() {
            DOM.miniCharts.forEach(container => {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '14');
                svg.setAttribute('viewBox', '0 0 100 14');
                svg.style.display = 'block';

                const points = [];
                let y = 7;
                for (let i = 0; i <= 100; i += 12) {
                    y += Utils.rand(-3, 3);
                    y = Utils.clamp(y, 1, 13);
                    points.push(`${i},${y}`);
                }

                const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                polyline.setAttribute('points', points.join(' '));
                polyline.setAttribute('fill', 'none');
                polyline.setAttribute('stroke', 'var(--primary)');
                polyline.setAttribute('stroke-width', '1.2');
                polyline.setAttribute('stroke-linecap', 'round');
                polyline.setAttribute('stroke-linejoin', 'round');
                polyline.style.filter = 'drop-shadow(0 0 3px var(--primary))';

                // Area fill
                const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                areaPath.setAttribute('d', `M0,14 L${points.join(' L')} L100,14 Z`);
                areaPath.setAttribute('fill', 'var(--primary)');
                areaPath.setAttribute('opacity', '0.1');

                svg.appendChild(areaPath);
                svg.appendChild(polyline);
                container.innerHTML = '';
                container.appendChild(svg);
            });
        }
    }

    // ─── FLEET STATUS SIMULATOR ───────────────────────────────────────
    class FleetMonitor {
        constructor() { this.start(); }

        start() {
            setInterval(() => {
                DOM.shipHPs.forEach(ship => {
                    if (!ship.parentElement.classList.contains('active')) return;
                    
                    let hp = parseInt(ship.textContent);
                    hp += Utils.randInt(-2, 1);
                    hp = Utils.clamp(hp, 5, 100);
                    ship.textContent = `${hp}%`;
                    
                    if (hp < 30) ship.style.color = 'var(--danger)';
                    else if (hp < 60) ship.style.color = 'var(--warning)';
                    else ship.style.color = 'var(--success)';
                });
            }, 5000);
        }
    }

    // ─── SYSTEM METRICS SIMULATOR ─────────────────────────────────────
    class SystemMetrics {
        constructor() { this.start(); }

        start() {
            setInterval(() => {
                DOM.sysVals.forEach(val => {
                    const el = val.parentElement.querySelector('.sys-fill');
                    if (!el) return;

                    let current = parseFloat(val.textContent.replace(/%|°C|,/g, ''));
                    if (isNaN(current)) return;

                    const delta = Utils.rand(-0.8, 0.8);
                    let next = Utils.clamp(current + delta, 0, 100);
                    
                    // Special handling for reactor temp
                    if (val.parentElement.querySelector('.sys-label').textContent.includes('TEMP')) {
                        next = Utils.clamp(current + Utils.rand(-5, 5), 300, 450);
                        val.textContent = `${Math.floor(next)}°C`;
                        el.style.width = `${next / 5}%`;
                        if (next > 400) el.className = 'sys-fill warning';
                    } else if (val.parentElement.querySelector('.sys-label').textContent.includes('UPTIME')) {
                        val.textContent = '99.97%'; // Keep stable
                    } else if (val.parentElement.querySelector('.sys-label').textContent.includes('PLAYERS')) {
                        next = Utils.clamp(current + Utils.rand(-120, 150), 130000, 150000);
                        val.textContent = Math.floor(next).toLocaleString();
                        el.style.width = `${(next / 160000) * 100}%`;
                    } else {
                        val.textContent = `${Math.floor(next)}%`;
                        el.style.width = `${next}%`;
                    }
                });
            }, 3000);
        }
    }

    // ─── BOOT SEQUENCE ────────────────────────────────────────────────
    function initBootSequence() {
        const elements = document.querySelectorAll('.panel, .bottom-bar, .alliance-roster, .comm-channels, .energy-panel, .population-panel, .environment-panel');
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px) scale(0.98)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
            }, 150 + (i * 60));
        });
    }

    // ─── INITIALIZATION ───────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        new ServerTime();
        new CombatLog();
        new MarketTicker();
        new ChatSimulator();
        new NotificationPanel();
        new SparklineCharts();
        new FleetMonitor();
        new SystemMetrics();
        initBootSequence();

        console.log('%c⬡ NEXUS PRIME SYSTEM ONLINE', 'color: #00f0ff; font-weight: bold; font-size: 14px;');
        console.log('%cCommand dashboard initialized. Telemetry active.', 'color: #6b7d8e;');
    });

})();
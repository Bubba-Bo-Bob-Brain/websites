/**
 * NEXUS-7 OMNI-SIMULATION DASHBOARD
 * Real-time Data Simulation & Interaction Controller
 * Optimized for 4K Information Density
 */

(function() {
    'use strict';

    // ═════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═════════════════════════════════════════════════════════════════
    const CONFIG = {
        updateIntervals: {
            system: 1000,      // System stats (CPU, RAM, temps)
            resources: 2500,   // Resource extraction rates
            market: 3000,      // Market price fluctuations
            fleet: 4000,       // Fleet position/status updates
            war: 8000,         // War front territorial changes
            logs: 1500,        // New log entries
            ticker: 20000,     // Alert rotation
            glitch: 8000       // Visual glitch effects
        },
        simulation: {
            uptimeStart: Date.now() - (342 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 33 * 60 * 1000 + 21 * 1000),
            maxLogEntries: 50,
            criticalThreshold: 95
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═════════════════════════════════════════════════════════════════
    const State = {
        resources: {
            antimatter: { value: 847.2, trend: 1, stock: 84.7 },
            dilithium: { value: 42.0, trend: -1, stock: 23.1 },
            titanium: { value: 1204, trend: 1, stock: 67.3 },
            biotics: { value: 89.4, trend: 1, stock: 91.2 },
            energy: { value: -47, trend: -1, stock: 4.8 },
            rations: { value: Infinity, trend: 0, stock: 100 }
        },
        system: {
            cpu: 87,
            ram: 64,
            latency: 12,
            reactor: 98,
            temps: { cpu: 67, ram: 45, reactor: 892 }
        },
        war: {
            synthetic: 45,
            terran: 78
        },
        market: [
            { symbol: '⛽ANTIMATTER', price: 847, change: 12, up: true },
            { symbol: '💎DILITHIUM', price: 4200, change: -3, up: false },
            { symbol: '🔩TITANIUM', price: 120, change: 5, up: true },
            { symbol: '🧬STEM-CELLS', price: 8900, change: 45, up: true },
            { symbol: '🍔FOOD-RATIONS', price: 5, change: -0.5, up: false },
            { symbol: '⚔️PLASMA-RIFLES', price: 450, change: 23, up: true }
        ]
    };

    // ═════════════════════════════════════════════════════════════════
    // DOM CACHE
    // ═════════════════════════════════════════════════════════════════
    const DOM = {
        uptime: document.querySelector('.uptime'),
        tickRate: document.querySelector('.tick-rate'),
        popCount: document.querySelector('.pop-count'),
        commLog: document.querySelector('.comm-log'),
        alertText: document.querySelector('.alert-text'),
        resourceCols: document.querySelectorAll('.resource-column'),
        sysStats: document.querySelector('.sys-stats'),
        marketTicker: document.querySelector('.ticker'),
        warFronts: document.querySelector('.war-fronts'),
        fleetTable: document.querySelector('.nano-table tbody')
    };

    // ═════════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═════════════════════════════════════════════════════════════════
    const Utils = {
        random: (min, max) => Math.random() * (max - min) + min,
        randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        clamp: (val, min, max) => Math.min(Math.max(val, min), max),
        
        formatTime: (ms) => {
            const seconds = Math.floor(ms / 1000);
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        formatNumber: (num, decimals = 1) => {
            if (num === Infinity) return '∞';
            return num.toFixed(decimals);
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // LOG GENERATOR
    // ═════════════════════════════════════════════════════════════════
    const LogGenerator = {
        prefixes: ['SYS', 'CMD', 'WAR', 'TRD', 'SCI', 'SEC', 'FLT', 'RES'],
        systems: ['Warp drive', 'Shield generator', 'Reactor core', 'Life support', 'Navigation', 'Weapons array'],
        commanders: ['Adm.Kirk', 'Cmd.Zulu', 'Lt.Data', 'Eng.Scott', 'Wng.Red', 'Capt.Reynolds', 'Spock'],
        actions: ['engaged', 'activated', 'deactivated', 'overloaded', 'optimized', 'calibrated', 'initiated'],
        locations: ['Sector 7', 'Sector 9', 'Sector 12', 'Alpha Base', 'Trade Hub 7', 'Outer Rim', 'Nebula X-9'],
        
        generate() {
            const type = Utils.randomInt(0, 6);
            const prefix = this.prefixes[type];
            let message = '';
            
            switch(type) {
                case 0: // SYS
                    message = `${this.systems[Utils.randomInt(0, this.systems.length-1)]} ${this.actions[Utils.randomInt(0, this.actions.length-1)]}`;
                    break;
                case 1: // CMD
                    message = `${this.commanders[Utils.randomInt(0, this.commanders.length-1)]}: "${['Execute', 'Initiate', 'Deploy', 'Scan', 'Engage'][Utils.randomInt(0,4)]} ${['Order 7', 'Protocol 9', 'Sequence Alpha', 'Tactical Pattern'][Utils.randomInt(0,3)]}"`;
                    break;
                case 2: // WAR
                    message = `${this.locations[Utils.randomInt(0, this.locations.length-1)]} ${['under attack', 'secured', 'contested', 'evacuated'][Utils.randomInt(0,3)]}`;
                    break;
                case 3: // TRD
                    message = `Transaction complete: ${['+', '-'][Utils.randomInt(0,1)]}${Utils.randomInt(100, 9999)} credits`;
                    break;
                case 4: // SCI
                    message = `Anomaly detected in ${this.locations[Utils.randomInt(0, this.locations.length-1)]}: ${['radiation spike', 'gravitational wave', 'unknown signal', 'quantum fluctuation'][Utils.randomInt(0,3)]}`;
                    break;
                default:
                    message = `System ping: Node ${Utils.randomInt(1, 99)}-${String.fromCharCode(65+Utils.randomInt(0,25))}`;
            }
            
            return { prefix, message, type };
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // UPDATE HANDLERS
    // ═════════════════════════════════════════════════════════════════
    const Updaters = {
        // System Clock & Uptime
        system() {
            // Update uptime
            const elapsed = Date.now() - CONFIG.simulation.uptimeStart;
            if (DOM.uptime) DOM.uptime.textContent = `UP:${Utils.formatTime(elapsed)}`;
            
            // Update tick rate with small fluctuation
            const tick = 64 + Utils.randomInt(-3, 3);
            if (DOM.tickRate) DOM.tickRate.textContent = `TICK:${tick}ms`;
            
            // Update population
            const pop = 2847293 + Utils.randomInt(-50, 150);
            if (DOM.popCount) DOM.popCount.textContent = `POP:${pop.toLocaleString()}👥`;
            
            // Update system diagnostics
            State.system.cpu = Utils.clamp(State.system.cpu + Utils.randomInt(-5, 5), 20, 99);
            State.system.ram = Utils.clamp(State.system.ram + Utils.randomInt(-3, 3), 30, 95);
            State.system.reactor = Utils.clamp(State.system.reactor + Utils.randomInt(-2, 2), 80, 99);
            State.system.latency = Utils.clamp(State.system.latency + Utils.randomInt(-2, 3), 8, 45);
            
            State.system.temps.cpu = Utils.clamp(State.system.temps.cpu + Utils.randomInt(-2, 3), 45, 85);
            State.system.temps.reactor = Utils.clamp(State.system.temps.reactor + Utils.randomInt(-10, 15), 700, 950);
            
            this.updateSystemDisplay();
        },

        updateSystemDisplay() {
            const rows = document.querySelectorAll('.stat-row');
            if (!rows.length) return;
            
            const stats = [
                { label: 'CPU-CLUSTER-7', val: State.system.cpu, temp: State.system.temps.cpu, unit: '°C', max: 100 },
                { label: 'RAM-QUANTUM', val: State.system.ram, temp: State.system.temps.ram, unit: '°C', max: 100 },
                { label: 'NET-LATENCY', val: State.system.latency, temp: '5G-Q', unit: '', max: 100, isMs: true },
                { label: 'REACTOR-CORE', val: State.system.reactor, temp: State.system.temps.reactor, unit: '°C', max: 100, critical: true }
            ];
            
            rows.forEach((row, idx) => {
                if (!stats[idx]) return;
                const stat = stats[idx];
                const bar = row.querySelector('.usage');
                const val = row.querySelector('.stat-val');
                const temp = row.querySelector('.stat-temp');
                
                if (bar) bar.style.width = `${stat.val}%`;
                if (val) val.textContent = stat.isMs ? `${stat.val}ms` : `${stat.val}%`;
                if (temp) temp.textContent = `🌡️${stat.temp}${stat.unit}${stat.critical && stat.val > 95 ? '⚠️' : ''}`;
                
                // Critical styling
                if (stat.critical && stat.val > 95) {
                    row.classList.add('critical');
                } else {
                    row.classList.remove('critical');
                }
            });
        },

        // Resources
        resources() {
            const resources = State.resources;
            
            // Fluctuate values
            resources.antimatter.value = Utils.clamp(resources.antimatter.value + Utils.random(-5, 8), 700, 1000);
            resources.dilithium.value = Utils.clamp(resources.dilithium.value + Utils.random(-2, 3), 30, 60);
            resources.titanium.value = Utils.clamp(resources.titanium.value + Utils.random(-50, 80), 1000, 1500);
            resources.biotics.value = Utils.clamp(resources.biotics.value + Utils.random(-5, 5), 70, 110);
            resources.energy.value = Utils.clamp(resources.energy.value + Utils.random(-10, 5), -100, 50);
            
            // Update stocks
            Object.keys(resources).forEach(key => {
                const res = resources[key];
                if (key !== 'rations') {
                    res.stock = Utils.clamp(res.stock + (res.trend * Utils.random(0, 1)), 0, 100);
                }
            });
            
            this.updateResourceDisplay();
        },

        updateResourceDisplay() {
            const cols = DOM.resourceCols;
            if (!cols.length) return;
            
            const resKeys = ['antimatter', 'dilithium', 'titanium', 'biotics', 'energy', 'rations'];
            
            cols.forEach((col, idx) => {
                const key = resKeys[idx];
                if (!key) return;
                const res = State.resources[key];
                
                const countEl = col.querySelector('.res-count');
                const trendEl = col.querySelector('.res-trend');
                const stockEl = col.querySelector('.res-storage');
                
                if (countEl) countEl.textContent = key === 'energy' ? `${Math.floor(res.value)}⚡/s` : `${Utils.formatNumber(res.value, key === 'antimatter' ? 1 : 0)}${key === 'rations' ? '' : '/s'}`;
                if (trendEl) {
                    const symbol = res.value > 0 ? '▲' : res.value < 0 ? '🔴' : '➡️';
                    const color = res.value > 0 ? 'green' : res.value < 0 ? 'red' : 'gray';
                    trendEl.textContent = `${symbol}${res.value > 0 ? '+' : ''}${Utils.formatNumber(Math.abs(res.value * 0.1), 1)}%${res.value > 0 ? '📈' : res.value < 0 ? '📉' : ''}`;
                    trendEl.style.color = color === 'green' ? 'var(--neon-green)' : color === 'red' ? 'var(--neon-red)' : '#9ca3af';
                }
                if (stockEl) {
                    stockEl.textContent = `STOCK:${Utils.formatNumber(res.stock)}%${res.stock < 10 ? '⚠️' : ''}`;
                    stockEl.style.color = res.stock < 20 ? 'var(--neon-red)' : '#9ca3af';
                }
                
                // Critical state
                if (key === 'energy' && res.stock < 10) {
                    col.classList.add('critical');
                } else {
                    col.classList.remove('critical');
                }
            });
        },

        // Market
        market() {
            State.market.forEach(item => {
                const change = Utils.random(-5, 8);
                item.price = Math.max(1, item.price + change);
                item.change = ((change / item.price) * 100).toFixed(1);
                item.up = change > 0;
            });
            
            // Rebuild ticker
            if (DOM.marketTicker) {
                DOM.marketTicker.innerHTML = State.market.map(item => 
                    `<span class="ticker-item ${item.up ? 'up' : 'down'}">${item.symbol}:${item.up ? '+' : ''}${item.change}%${item.up ? '▲' : '▼'}</span>`
                ).join('');
            }
        },

        // War Fronts
        war() {
            // Slowly shift territorial control
            const shift = Utils.randomInt(-2, 3);
            State.war.synthetic = Utils.clamp(State.war.synthetic + shift, 20, 80);
            State.war.terran = Utils.clamp(State.war.terran + Utils.randomInt(-3, 2), 40, 90);
            
            const fronts = document.querySelectorAll('.front-line');
            if (fronts.length >= 2) {
                // Update Synthetic vs Xenomorph
                const synBar = fronts[0].querySelector('.control.left');
                const xenoBar = fronts[0].querySelector('.control.right');
                const contested = fronts[0].querySelector('.contested');
                
                if (synBar && xenoBar && contested) {
                    synBar.style.width = `${State.war.synthetic}%`;
                    synBar.textContent = `${State.war.synthetic}%`;
                    xenoBar.style.width = `${100 - State.war.synthetic - 10}%`;
                    xenoBar.textContent = `${100 - State.war.synthetic - 10}%`;
                    contested.style.width = '10%';
                }
                
                // Update Terran vs Raiders
                const terrBar = fronts[1].querySelector('.control.left');
                const raidBar = fronts[1].querySelector('.control.right');
                
                if (terrBar && raidBar) {
                    const contestedWidth = 100 - State.war.terran - 18;
                    terrBar.style.width = `${State.war.terran}%`;
                    terrBar.textContent = `${State.war.terran}%`;
                    raidBar.style.width = `18%`;
                    raidBar.textContent = `18%`;
                    const cont = fronts[1].querySelector('.contested');
                    if (cont) cont.style.width = `${Math.max(4, contestedWidth)}%`;
                }
            }
        },

        // Communications Log
        logs() {
            if (!DOM.commLog) return;
            
            const log = LogGenerator.generate();
            const entry = document.createElement('div');
            entry.className = `log-entry ${log.prefix.toLowerCase()}`;
            entry.textContent = `[${log.prefix}] ${log.message}`;
            entry.style.animation = 'slide-in 0.3s ease-out';
            
            DOM.commLog.insertBefore(entry, DOM.commLog.firstChild);
            
            // Remove old entries
            while (DOM.commLog.children.length > CONFIG.simulation.maxLogEntries) {
                DOM.commLog.removeChild(DOM.commLog.lastChild);
            }
            
            // Random alert injection
            if (Utils.randomInt(0, 20) === 0) {
                const alertEntry = document.createElement('div');
                alertEntry.className = 'log-entry alert';
                const alerts = [
                    '🚨 INTRUDER ALERT: Docking Bay 4',
                    '⚠️ REACTOR INSTABILITY DETECTED',
                    '☠️ HOSTILE WARP SIGNATURE',
                    '🔴 DEFCON LEVEL RAISED',
                    '⚡ POWER FLUCTUATION IN SECTOR 7'
                ];
                alertEntry.textContent = alerts[Utils.randomInt(0, alerts.length-1)];
                DOM.commLog.insertBefore(alertEntry, DOM.commLog.firstChild);
            }
        },

        // Alert Ticker
        ticker() {
            if (!DOM.alertText) return;
            
            const alerts = [
                '🚨 DEFCON 3: Hostile fleet detected in Sector 9',
                '⚠️ Energy critical on Station Gamma',
                '🟢 Trade agreements signed with Synthetic Union',
                '💀 Raiding party repelled in Asteroid Belt',
                '🌌 Solar flare expected in T-minus 45 minutes',
                '🔬 Research breakthrough: Warp-5 84% complete',
                '⛽ Antimatter production at maximum capacity',
                '👻 Stealth fleet detected in Sector 12'
            ];
            
            const current = DOM.alertText.textContent;
            let next;
            do {
                next = alerts[Utils.randomInt(0, alerts.length-1)];
            } while (next === current);
            
            DOM.alertText.textContent = next;
        },

        // Fleet Table Animation
        fleet() {
            const rows = document.querySelectorAll('.nano-table tbody tr');
            if (!rows.length) return;
            
            // Randomly update shield/HP bars
            rows.forEach(row => {
                if (Math.random() > 0.7) {
                    const bars = row.querySelectorAll('.fill');
                    bars.forEach(bar => {
                        const currentWidth = parseInt(bar.style.width) || 50;
                        const newWidth = Utils.clamp(currentWidth + Utils.randomInt(-10, 10), 5, 100);
                        bar.style.width = `${newWidth}%`;
                        
                        if (newWidth < 25) {
                            bar.classList.add('critical');
                        } else {
                            bar.classList.remove('critical');
                        }
                    });
                }
            });
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // VISUAL EFFECTS
    // ═════════════════════════════════════════════════════════════════
    const FX = {
        init() {
            this.createScanlines();
            this.initGlitchEffect();
            this.initInteractiveGlow();
        },

        createScanlines() {
            const scanlines = document.createElement('div');
            scanlines.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    transparent 50%,
                    rgba(0, 240, 255, 0.02) 50%
                );
                background-size: 100% 4px;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(scanlines);
        },

        initGlitchEffect() {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    document.body.style.transform = `translate(${Utils.randomInt(-2, 2)}px, ${Utils.randomInt(-2, 2)}px)`;
                    setTimeout(() => {
                        document.body.style.transform = 'translate(0,0)';
                    }, 50);
                }
            }, CONFIG.updateIntervals.glitch);
        },

        initInteractiveGlow() {
            document.querySelectorAll('.hud-panel').forEach(panel => {
                panel.addEventListener('mouseenter', () => {
                    panel.style.boxShadow = 'inset 0 0 30px rgba(0, 240, 255, 0.2), 0 0 20px rgba(0, 240, 255, 0.3)';
                    panel.style.borderColor = 'rgba(0, 240, 255, 0.8)';
                });
                
                panel.addEventListener('mouseleave', () => {
                    panel.style.boxShadow = '';
                    panel.style.borderColor = '';
                });
            });
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // INTERACTION HANDLERS
    // ═════════════════════════════════════════════════════════════════
    const Interactions = {
        init() {
            this.initActionButtons();
            this.initKeyboardShortcuts();
            this.initPanelControls();
        },

        initActionButtons() {
            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const text = e.target.textContent;
                    
                    // Visual feedback
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => e.target.style.transform = '', 100);
                    
                    // Add to log
                    if (DOM.commLog) {
                        const entry = document.createElement('div');
                        entry.className = 'log-entry cmd';
                        entry.textContent = `[CMD] Manual override: ${text} executed`;
                        DOM.commLog.insertBefore(entry, DOM.commLog.firstChild);
                    }
                    
                    // Special effects for emergency
                    if (text.includes('EMRGNCY')) {
                        document.body.style.animation = 'pulse-alert 0.5s 3';
                        setTimeout(() => document.body.style.animation = '', 1500);
                    }
                });
            });
        },

        initKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                const btns = document.querySelectorAll('.action-btn');
                switch(e.key) {
                    case '1': btns[0]?.click(); break;
                    case '2': btns[1]?.click(); break;
                    case '3': btns[2]?.click(); break;
                    case '4': btns[3]?.click(); break;
                    case '5': btns[4]?.click(); break;
                    case 'Escape': btns[5]?.click(); break;
                }
            });
        },

        initPanelControls() {
            document.querySelectorAll('.panel-controls').forEach(ctrl => {
                ctrl.addEventListener('click', (e) => {
                    const panel = e.target.closest('.hud-panel');
                    if (e.target.textContent.includes('x')) {
                        panel.style.opacity = '0.3';
                        setTimeout(() => panel.style.opacity = '1', 1000);
                    }
                });
            });
        }
    };

    // ═════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═════════════════════════════════════════════════════════════════
    function init() {
        console.log('🚀 NEXUS-7 OMNI-SIMULATION DASHBOARD INITIALIZED');
        
        // Initialize effects
        FX.init();
        Interactions.init();
        
        // Start update loops
        setInterval(() => Updaters.system(), CONFIG.updateIntervals.system);
        setInterval(() => Updaters.resources(), CONFIG.updateIntervals.resources);
        setInterval(() => Updaters.market(), CONFIG.updateIntervals.market);
        setInterval(() => Updaters.war(), CONFIG.updateIntervals.war);
        setInterval(() => Updaters.logs(), CONFIG.updateIntervals.logs);
        setInterval(() => Updaters.ticker(), CONFIG.updateIntervals.ticker);
        setInterval(() => Updaters.fleet(), CONFIG.updateIntervals.fleet);
        
        // Initial updates
        Updaters.system();
        Updaters.resources();
        Updaters.market();
        
        console.log('⚡ All systems nominal. Monitoring 2,847,293 entities...');
    }

    // Boot sequence
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
/**
 * ÆTHERIA NEXUS // OMNISCIENT OVERSEER DASHBOARD
 * Core Systems & Live Data Simulation
 * Optimized for high-density 4K interface
 */

// ═══════════════════════════════════════════════════════════════
// SYSTEM CORE
// ═══════════════════════════════════════════════════════════════

const Nexus = {
    tick: 847291,
    gameTime: {
        era: 3,
        day: 847,
        hour: 22,
        minute: 14,
        second: 0
    },
    players: {
        online: 47291,
        max: 50000,
        queue: 142
    },
    latency: 12,
    
    init() {
        this.bindElements();
        this.startClocks();
        this.startSimulation();
        this.bindInteractions();
        console.log('⚡ Ætheria Nexus Online');
    },

    bindElements() {
        this.els = {
            realTime: document.querySelector('.time-local'),
            gameTime: document.querySelector('.time-game'),
            serverTick: document.querySelector('.tick'),
            latency: document.querySelector('.latency'),
            popCount: document.querySelector('.pop-count'),
            queue: document.querySelector('.queue'),
            instanceLoad: document.querySelector('.instance-load'),
            marketTicker: document.querySelector('.ticker-content'),
            killFeed: document.querySelector('.kill-feed'),
            chatStreams: document.querySelectorAll('.chat-stream'),
            chatTabs: document.querySelectorAll('.tab'),
            healthBar: document.querySelector('.bar.health .bar-fill'),
            healthText: document.querySelector('.bar.health .bar-text'),
            manaBar: document.querySelector('.bar.mana .bar-fill'),
            manaText: document.querySelector('.bar.mana .bar-text'),
            logStream: document.querySelector('.log-stream')
        };
    }
};

// ═══════════════════════════════════════════════════════════════
// TEMPORAL SYSTEMS
// ═══════════════════════════════════════════════════════════════

const TemporalEngine = {
    updateRealTime() {
        const now = new Date();
        const timeStr = now.toISOString().substr(11, 8);
        if (Nexus.els.realTime) {
            Nexus.els.realTime.textContent = `🌍 RL: ${timeStr} UTC`;
        }
    },

    updateGameTime() {
        Nexus.gameTime.second++;
        if (Nexus.gameTime.second >= 60) {
            Nexus.gameTime.second = 0;
            Nexus.gameTime.minute++;
        }
        if (Nexus.gameTime.minute >= 60) {
            Nexus.gameTime.minute = 0;
            Nexus.gameTime.hour++;
        }
        if (Nexus.gameTime.hour >= 24) {
            Nexus.gameTime.hour = 0;
            Nexus.gameTime.day++;
        }

        const timeStr = `${Nexus.gameTime.hour.toString().padStart(2, '0')}:${Nexus.gameTime.minute.toString().padStart(2, '0')}`;
        if (Nexus.els.gameTime) {
            Nexus.els.gameTime.textContent = `🌙 GT: ${Nexus.gameTime.era}rd Era, Day ${Nexus.gameTime.day}, ${timeStr}`;
        }
    },

    updateServerTick() {
        Nexus.tick += Math.floor(Math.random() * 3) + 1;
        if (Nexus.els.serverTick) {
            Nexus.els.serverTick.textContent = `Tick: ${Nexus.tick.toLocaleString()}`;
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// DATA SIMULATION LAYERS
// ═══════════════════════════════════════════════════════════════

const DataStream = {
    killNames: {
        killers: ['Aldric_The_Bold', 'ShadowStab69', 'DragonSlayer_K', 'SneakyPete', 'Arcane_Master', 'Holy_Smiter', 'Rogue_One', 'Tankenstein', 'Healz_4_U', 'Dps_Machine'],
        victims: ['NoobLord_2024', 'CasualScrub', 'PvP_Fanatic', 'Arena_God', 'Dungeon_Crawler', 'Loot_Goblin', 'Quest_NPC', 'Wolf_Slayer', 'Murloc_King', 'Epic_Fail'],
        actions: ['⚔️', '🗡️', '⚡', '🔥', '❄️', '🏹', '💀', '😵'],
        locations: ['Eldoria', 'Spire', 'Flats', 'Border', 'Valley', 'Peaks', 'Depths', 'Ridge']
    },

    chatMessages: [
        { type: 'trade', text: 'WTS Mythril Ore x200 PST!', name: '[Trader]' },
        { type: 'chat', text: 'LFG Crucible Mythic, ilvl 840+', name: '[Aldric]', color: '#ff6666' },
        { type: 'chat', text: 'Anyone seen the Star Eater spawn?', name: '[NatureBoy]', color: '#66ff66' },
        { type: 'guild', text: 'Raid starts in 30 minutes, be ready!', name: '[Guild]', color: '#ffd700' },
        { type: 'chat', text: 'Selling epic mount cheap!', name: '[Merchant]', color: '#66ccff' },
        { type: 'chat', text: 'Can someone portal to Valdris?', name: '[Traveler]', color: '#ff99ff' },
        { type: 'system', text: 'Market fluctuation detected', name: '[System]' },
        { type: 'trade', text: 'Buying Fadeleaf x100', name: '[Alchemist]' }
    ],

    marketItems: [
        { name: '🪙 Gold', change: 2.4, trend: 'up' },
        { name: '💎 Astral Diamond', change: -0.8, trend: 'down' },
        { name: '⚗️ Philosopher\'s Stone', change: 15.2, trend: 'up' },
        { name: '🌿 Fadeleaf', change: -5.1, trend: 'down' },
        { name: '🔥 Eternal Flame Essence', change: 8.7, trend: 'up' },
        { name: '⚔️ Mythril Ore', change: 3.2, trend: 'up' },
        { name: '🛡️ Adamantite Plate', change: -1.2, trend: 'down' },
        { name: '💍 Arcane Crystal', change: 12.5, trend: 'up' }
    ],

    generateKillFeedEntry() {
        const killer = this.killNames.killers[Math.floor(Math.random() * this.killNames.killers.length)];
        const victim = this.killNames.victims[Math.floor(Math.random() * this.killNames.victims.length)];
        const action = this.killNames.actions[Math.floor(Math.random() * this.killNames.actions.length)];
        const loc = this.killNames.locations[Math.floor(Math.random() * this.killNames.locations.length)];
        const time = new Date().toTimeString().substr(0, 8);
        
        const isLegendary = Math.random() > 0.95;
        const isGuildWar = Math.random() > 0.8 && !isLegendary;
        
        let className = 'kill-entry';
        if (isLegendary) className += ' legendary';
        if (isGuildWar) className += ' guild-war';
        
        const html = `
            <div class="${className}">
                <span class="timestamp">${time}</span>
                <span class="killer">${isGuildWar ? '[CO] ' : ''}${killer}</span>
                <span class="action">${action}></span>
                <span class="victim">${victim}</span>
                <span class="loc">📍 ${loc}</span>
            </div>
        `;
        
        return html;
    },

    generateChatMessage() {
        const msg = this.chatMessages[Math.floor(Math.random() * this.chatMessages.length)];
        const time = new Date().toTimeString().substr(0, 5);
        
        if (msg.type === 'system') {
            return `<div class="msg system">[System] ${msg.text}</div>`;
        } else if (msg.type === 'trade') {
            return `<div class="msg trade"><span class="name">${msg.name}</span> ${msg.text}</div>`;
        } else if (msg.type === 'guild') {
            return `<div class="msg guild"><span class="name" style="color:${msg.color}">${msg.name}</span> ${msg.text}</div>`;
        } else {
            return `<div class="msg chat"><span class="name" style="color:${msg.color}">${msg.name}</span> ${msg.text}</div>`;
        }
    },

    updateMarketTicker() {
        if (!Nexus.els.marketTicker) return;
        
        const content = this.marketItems.map(item => {
            const symbol = item.trend === 'up' ? '↑' : '↓';
            const className = item.trend === 'up' ? 'up' : 'down';
            return `<span class="ticker-item ${className}">${item.name} ${symbol} ${Math.abs(item.change)}%</span>`;
        }).join('');
        
        Nexus.els.marketTicker.innerHTML = content + content; // Duplicate for seamless loop
    }
};

// ═══════════════════════════════════════════════════════════════
// INTERACTION HANDLERS
// ═══════════════════════════════════════════════════════════════

const InteractionLayer = {
    currentChatChannel: 'global',
    
    init() {
        this.bindChatTabs();
        this.bindZones();
        this.bindTooltips();
        this.bindKeyboardShortcuts();
    },

    bindChatTabs() {
        Nexus.els.chatTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                Nexus.els.chatTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const channel = e.target.dataset.channel;
                this.currentChatChannel = channel;
                
                Nexus.els.chatStreams.forEach(stream => {
                    stream.classList.remove('active');
                    if (stream.classList.contains(channel)) {
                        stream.classList.add('active');
                    }
                });
            });
        });
    },

    bindZones() {
        document.querySelectorAll('.zone').forEach(zone => {
            zone.addEventListener('click', () => {
                const owner = zone.dataset.owner;
                const name = zone.querySelector('.zone-data').textContent.split('\n')[0];
                this.addLogEntry(`Selected territory: ${name} (${owner})`);
            });
            
            zone.addEventListener('mouseenter', () => {
                zone.style.transform = 'scale(1.02)';
                zone.style.zIndex = '10';
            });
            
            zone.addEventListener('mouseleave', () => {
                zone.style.transform = 'scale(1)';
                zone.style.zIndex = '1';
            });
        });
    },

    bindTooltips() {
        document.querySelectorAll('.boss').forEach(boss => {
            boss.addEventListener('mouseenter', (e) => {
                const title = e.target.getAttribute('title');
                if (title) {
                    this.showTooltip(e, title);
                }
            });
            
            boss.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    },

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '5') {
                const tabs = Array.from(Nexus.els.chatTabs);
                const index = parseInt(e.key) - 1;
                if (tabs[index]) {
                    tabs[index].click();
                }
            }
        });
    },

    showTooltip(e, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0,0,0,0.9);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 4px 8px;
            font-size: 10px;
            z-index: 10000;
            pointer-events: none;
            border-radius: 2px;
            color: #fff;
        `;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 5) + 'px';
        
        this.currentTooltip = tooltip;
    },

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    },

    addLogEntry(text) {
        if (!Nexus.els.logStream) return;
        const entry = document.createElement('span');
        entry.className = 'log-entry';
        const time = new Date().toTimeString().substr(0, 8);
        entry.textContent = `[${time}] ${text}`;
        Nexus.els.logStream.appendChild(entry);
        Nexus.els.logStream.scrollLeft = Nexus.els.logStream.scrollWidth;
        
        // Keep only last 5 entries
        while (Nexus.els.logStream.children.length > 5) {
            Nexus.els.logStream.removeChild(Nexus.els.logStream.firstChild);
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// VISUAL FX ENGINE
// ═══════════════════════════════════════════════════════════════

const VisualFX = {
    pulseElements: [],
    
    init() {
        this.startBarAnimation();
        this.startGlowPulse();
    },

    startBarAnimation() {
        setInterval(() => {
            if (Nexus.els.healthBar && Nexus.els.manaBar) {
                // Simulate minor HP/MP fluctuations
                const hpVariation = Math.random() * 2 - 1;
                const currentHp = 87 + hpVariation;
                Nexus.els.healthBar.style.width = `${currentHp}%`;
                
                const mpVariation = Math.random() * 2 - 1;
                const currentMp = 64 + mpVariation;
                Nexus.els.manaBar.style.width = `${currentMp}%`;
            }
        }, 5000);
    },

    startGlowPulse() {
        const panels = document.querySelectorAll('.grid-panel');
        panels.forEach((panel, index) => {
            setInterval(() => {
                panel.style.boxShadow = `inset 0 0 30px rgba(0,212,255,${0.05 + Math.random() * 0.05})`;
            }, 3000 + (index * 500));
        });
    },

    flashElement(selector, color = 'rgba(255,0,64,0.3)') {
        const el = document.querySelector(selector);
        if (el) {
            el.style.backgroundColor = color;
            setTimeout(() => {
                el.style.backgroundColor = '';
            }, 300);
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// MAIN LOOP & INITIALIZATION
// ═══════════════════════════════════════════════════════════════

const Mainframe = {
    intervals: [],
    
    init() {
        Nexus.init();
        InteractionLayer.init();
        VisualFX.init();
        
        // Core 1-second loop
        this.intervals.push(setInterval(() => {
            TemporalEngine.updateRealTime();
            TemporalEngine.updateGameTime();
            TemporalEngine.updateServerTick();
        }, 1000));
        
        // Data streams
        this.intervals.push(setInterval(() => {
            this.updateKillFeed();
        }, 4000));
        
        this.intervals.push(setInterval(() => {
            this.updateChat();
        }, 6000));
        
        this.intervals.push(setInterval(() => {
            this.updatePopulation();
        }, 10000));
        
        this.intervals.push(setInterval(() => {
            DataStream.updateMarketTicker();
        }, 15000));
        
        // Initial population
        DataStream.updateMarketTicker();
        this.populateInitialData();
    },

    updateKillFeed() {
        if (!Nexus.els.killFeed) return;
        
        const entry = document.createElement('div');
        entry.innerHTML = DataStream.generateKillFeedEntry();
        Nexus.els.killFeed.insertBefore(entry.firstChild, Nexus.els.killFeed.firstChild);
        
        // Keep only last 8 entries
        while (Nexus.els.killFeed.children.length > 8) {
            Nexus.els.killFeed.removeChild(Nexus.els.killFeed.lastChild);
        }
        
        // Flash effect on new entry
        if (entry.firstChild) {
            entry.firstChild.style.opacity = '0';
            setTimeout(() => {
                if (entry.firstChild) entry.firstChild.style.opacity = '1';
            }, 50);
        }
    },

    updateChat() {
        const activeStream = document.querySelector('.chat-stream.active');
        if (!activeStream) return;
        
        const msg = document.createElement('div');
        msg.innerHTML = DataStream.generateChatMessage();
        activeStream.appendChild(msg.firstChild);
        activeStream.scrollTop = activeStream.scrollHeight;
        
        // Keep only last 20 messages
        while (activeStream.children.length > 20) {
            activeStream.removeChild(activeStream.firstChild);
        }
    },

    updatePopulation() {
        const variation = Math.floor(Math.random() * 50) - 25;
        Nexus.players.online = Math.max(0, Math.min(Nexus.players.max, Nexus.players.online + variation));
        
        if (Nexus.els.popCount) {
            Nexus.els.popCount.textContent = `👥 ${Nexus.players.online.toLocaleString()}/${Nexus.players.max.toLocaleString()}`;
        }
        
        const load = ((Nexus.players.online / Nexus.players.max) * 100).toFixed(1);
        if (Nexus.els.instanceLoad) {
            Nexus.els.instanceLoad.textContent = `⚡ Load: ${load}%`;
            Nexus.els.instanceLoad.style.color = load > 90 ? '#ff0040' : load > 70 ? '#ff8500' : '#00ff88';
        }
        
        // Latency jitter
        Nexus.latency += Math.floor(Math.random() * 5) - 2;
        Nexus.latency = Math.max(8, Math.min(50, Nexus.latency));
        if (Nexus.els.latency) {
            Nexus.els.latency.textContent = `⏱️ ${Nexus.latency}ms`;
            Nexus.els.latency.style.color = Nexus.latency > 30 ? '#ff8500' : '#00ff88';
        }
    },

    populateInitialData() {
        // Fill kill feed
        if (Nexus.els.killFeed) {
            for (let i = 0; i < 5; i++) {
                const entry = document.createElement('div');
                entry.innerHTML = DataStream.generateKillFeedEntry();
                Nexus.els.killFeed.appendChild(entry.firstChild);
            }
        }
        
        // Fill chat
        const globalChat = document.querySelector('.chat-stream.global');
        if (globalChat) {
            for (let i = 0; i < 8; i++) {
                const msg = document.createElement('div');
                msg.innerHTML = DataStream.generateChatMessage();
                globalChat.appendChild(msg.firstChild);
            }
        }
    },

    emergencyProtocol() {
        document.body.style.animation = 'glitch 0.3s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
};

// ═══════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Add glitch animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        .custom-tooltip {
            animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize systems
    Mainframe.init();
    
    // Emergency button handler
    const emergencyBtn = document.querySelector('.sys-btn.alert');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            Mainframe.emergencyProtocol();
            InteractionLayer.addLogEntry('EMERGENCY PROTOCOL ACTIVATED');
        });
    }
    
    // Window resize handler for 4K optimization
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        if (width >= 3840) {
            document.body.classList.add('ultra-hd');
        } else {
            document.body.classList.remove('ultra-hd');
        }
    });
    
    // Trigger initial resize
    window.dispatchEvent(new Event('resize'));
});

// Global access for debugging
window.Nexus = Nexus;
window.Mainframe = Mainframe;
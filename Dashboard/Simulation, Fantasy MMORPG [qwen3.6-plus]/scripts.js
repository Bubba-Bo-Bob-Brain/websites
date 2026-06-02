/* ═══════════════════════════════════════════════════════
   REALM OF AETHERVALE — DASHBOARD SCRIPTS
   Live data simulation, interactions, and effects
   ═══════════════════════════════════════════════════════ */

// ──────── UTILITY FUNCTIONS ────────
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ──────── WORLD CLOCK ────────
class WorldClock {
    constructor() {
        this.timeEl = $('.world-time');
        this.dayEl = $('.world-day');
        this.baseTime = { h: 14, m: 37, s: 22 };
        this.day = 847;
        this.update();
        setInterval(() => this.tick(), 1000);
    }

    tick() {
        this.baseTime.s++;
        if (this.baseTime.s >= 60) {
            this.baseTime.s = 0;
            this.baseTime.m++;
            if (this.baseTime.m >= 60) {
                this.baseTime.m = 0;
                this.baseTime.h++;
                if (this.baseTime.h >= 24) {
                    this.baseTime.h = 0;
                    this.day++;
                }
            }
        }
        this.update();
    }

    update() {
        const h = this.baseTime.h.toString().padStart(2, '0');
        const m = this.baseTime.m.toString().padStart(2, '0');
        const s = this.baseTime.s.toString().padStart(2, '0');
        this.timeEl.textContent = `⏰ ${h}:${m}:${s}`;
        this.dayEl.textContent = `Day ${this.day}`;
    }
}

// ──────── SEASON CYCLE ────────
class SeasonCycle {
    constructor() {
        this.seasonFill = $('.season-fill');
        this.seasonDays = $('.season-days');
        this.seasonName = $('.season-name');
        this.seasonIcon = $('.season-icon');
        this.currentDay = 34;
        this.maxDays = 100;
        this.seasons = [
            { name: 'Spring', icon: '🌸', color: '#2ecc71' },
            { name: 'Summer', icon: '☀️', color: '#e67e22' },
            { name: 'Autumn', icon: '🍂', color: '#d35400' },
            { name: 'Winter', icon: '❄️', color: '#3498db' }
        ];
        this.currentSeason = 0;
        this.update();
        setInterval(() => this.advance(), 10000); // Advance every 10s for demo
    }

    advance() {
        this.currentDay++;
        if (this.currentDay >= this.maxDays) {
            this.currentDay = 0;
            this.currentSeason = (this.currentSeason + 1) % 4;
        }
        this.update();
    }

    update() {
        const pct = (this.currentDay / this.maxDays) * 100;
        this.seasonFill.style.width = `${pct}%`;
        this.seasonDays.textContent = `${this.currentDay}/${this.maxDays}`;
        
        const season = this.seasons[this.currentSeason];
        this.seasonName.textContent = season.name;
        this.seasonIcon.textContent = season.icon;
        this.seasonFill.style.background = `linear-gradient(90deg, ${season.color}88, ${season.color})`;
    }
}

// ──────── COMBAT LOG SIMULATOR ────────
class CombatLogSimulator {
    constructor() {
        this.logEntries = $('.log-entries');
        this.sources = ['🧙 Thalorien', '⚔️ Kael', '🏹 Lyra', '🗡️ Bjorn', '🌿 Sylphira'];
        this.targets = ['Valthrax', 'Void Spawn', 'Shadow Wraith', 'Flame Elemental', 'Bone Golem'];
        this.abilities = [
            { icon: '🔥', name: 'Pyroblast', type: 'damage' },
            { icon: '❄️', name: 'Frost Nova', type: 'control' },
            { icon: '⚡', name: 'Lightning Bolt', type: 'damage' },
            { icon: '🛡️', name: 'Shield Bash', type: 'control' },
            { icon: '🌿', name: 'Healing Rain', type: 'heal' },
            { icon: '🏹', name: 'Venom Shot', type: 'dot' },
            { icon: '💀', name: 'Death Pulse', type: 'damage' },
            { icon: '🌪️', name: 'Blizzard', type: 'aoe' },
            { icon: '⚔️', name: 'Cleave', type: 'damage' },
            { icon: '✨', name: 'Arcane Missiles', type: 'damage' }
        ];
        
        // Start auto-adding entries
        setInterval(() => this.addEntry(), randomBetween(1500, 3000));
    }

    addEntry() {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const source = this.sources[randomBetween(0, this.sources.length - 1)];
        const target = this.targets[randomBetween(0, this.targets.length - 1)];
        const ability = this.abilities[randomBetween(0, this.abilities.length - 1)];
        
        let html = `<span class="log-time">[${time}]</span> `;
        
        if (ability.type === 'heal') {
            const heal = randomBetween(8000, 45000);
            html += `<span class="log-source">${source}</span> casts <span class="log-ability">${ability.icon} ${ability.name}</span> — party healed for <span class="log-heal">${formatNumber(heal)}</span>`;
        } else if (ability.type === 'control') {
            const duration = randomBetween(2, 5);
            html += `<span class="log-source">${source}</span> uses <span class="log-ability">${ability.icon} ${ability.name}</span> on <span class="log-target">${target}</span> — stunned for ${duration}s`;
        } else if (ability.type === 'dot') {
            const dps = randomBetween(2000, 8000);
            const dur = randomBetween(8, 15);
            html += `<span class="log-source">${source}</span> applies <span class="log-ability">${ability.icon} ${ability.name}</span> on <span class="log-target">${target}</span> — DoT ${formatNumber(dps)}/s for ${dur}s`;
        } else {
            const damage = randomBetween(12000, 85000);
            const crit = Math.random() > 0.7;
            html += `<span class="log-source">${source}</span> casts <span class="log-ability">${ability.icon} ${ability.name}</span> on <span class="log-target">${target}</span> for <span class="log-damage">${formatNumber(damage)}</span> damage${crit ? ' 🔥 CRITICAL' : ''}`;
        }
        
        entry.innerHTML = html;
        
        // Add to top with animation
        entry.style.opacity = '0';
        entry.style.transform = 'translateY(-10px)';
        this.logEntries.insertBefore(entry, this.logEntries.firstChild);
        
        // Trigger reflow then animate
        requestAnimationFrame(() => {
            entry.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateY(0)';
        });
        
        // Keep only 15 entries
        while (this.logEntries.children.length > 15) {
            this.logEntries.removeChild(this.logEntries.lastChild);
        }
    }
}

// ──────── COOLDOWN TRACKER ────────
class CooldownTracker {
    constructor() {
        this.cooldowns = $$('.cooldown-item.active');
        this.timers = [];
        
        this.cooldowns.forEach(el => {
            const timerText = el.querySelector('.cd-timer').textContent;
            let totalSeconds = this.parseTime(timerText);
            this.timers.push({ el, totalSeconds, remaining: totalSeconds });
        });
        
        this.update();
        setInterval(() => this.update(), 100);
    }

    parseTime(text) {
        if (text.includes('m')) {
            const parts = text.split('m');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return parseFloat(text);
    }

    formatTime(seconds) {
        if (seconds >= 60) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}m ${s.toString().padStart(2, '0')}s`;
        }
        return `${seconds.toFixed(1)}s`;
    }

    update() {
        this.timers.forEach(timer => {
            timer.remaining -= 0.1;
            
            if (timer.remaining <= 0) {
                timer.el.classList.remove('active');
                timer.el.classList.add('ready');
                timer.el.querySelector('.cd-timer').textContent = 'READY';
                timer.el.querySelector('.cd-timer').style.color = '';
                timer.remaining = timer.totalSeconds; // Reset for demo
                
                // Flash effect
                timer.el.style.boxShadow = '0 0 12px rgba(46, 204, 113, 0.6)';
                setTimeout(() => {
                    timer.el.style.boxShadow = '';
                    timer.el.classList.remove('ready');
                    timer.el.classList.add('active');
                    timer.el.querySelector('.cd-timer').textContent = this.formatTime(timer.remaining);
                }, 2000);
            } else {
                timer.el.querySelector('.cd-timer').textContent = this.formatTime(timer.remaining);
            }
        });
    }
}

// ──────── BOSS HP SIMULATOR ────────
class BossHPSimulator {
    constructor() {
        this.hpFill = $('.event-hp-fill');
        this.currentHP = 23847291;
        this.maxHP = 50000000;
        this.update();
        
        // Simulate damage ticks
        setInterval(() => this.tick(), 2000);
    }

    tick() {
        const damage = randomBetween(150000, 800000);
        this.currentHP = Math.max(0, this.currentHP - damage);
        
        // Reset for demo purposes
        if (this.currentHP < 5000000) {
            this.currentHP = 45000000;
        }
        
        this.update();
    }

    update() {
        const pct = (this.currentHP / this.maxHP) * 100;
        this.hpFill.style.width = `${pct}%`;
    }
}

// ──────── MARKET PRICE FLUCTUATOR ────────
class MarketSimulator {
    constructor() {
        this.rows = $$('.market-row');
        this.update();
        setInterval(() => this.fluctuate(), 5000);
    }

    update() {
        this.rows.forEach(row => {
            const priceEl = row.querySelector('.price');
            const trendEl = row.querySelector('.trend');
            
            // Parse current price
            let price = parseInt(priceEl.textContent.replace(/[G,]/g, ''));
            
            // Random fluctuation
            const change = randomBetween(-8, 10);
            price = Math.max(100, price + Math.floor(price * (change / 100)));
            
            // Update display
            priceEl.textContent = `${formatNumber(price)}G`;
            
            // Update trend
            if (change > 0) {
                trendEl.textContent = `▲ ${change}%`;
                trendEl.className = 'trend up';
            } else if (change < 0) {
                trendEl.textContent = `▼ ${Math.abs(change)}%`;
                trendEl.className = 'trend down';
            } else {
                trendEl.textContent = '— 0%';
                trendEl.className = 'trend stable';
            }
        });
    }

    fluctuate() {
        this.update();
    }
}

// ──────── RESOURCE BAR SIMULATOR ────────
class ResourceSimulator {
    constructor() {
        this.hpBar = document.querySelector('.bar-fill.hp');
        this.mpBar = document.querySelector('.bar-fill.mp');
        this.hpValue = document.querySelectorAll('.bar-row')[0]?.querySelector('.bar-value');
        this.mpValue = document.querySelectorAll('.bar-row')[1]?.querySelector('.bar-value');
        
        this.currentHP = 12847;
        this.maxHP = 14762;
        this.currentMP = 3891;
        this.maxMP = 8654;
        
        setInterval(() => this.regenerate(), 3000);
    }

    regenerate() {
        // HP regen
        this.currentHP = Math.min(this.maxHP, this.currentHP + randomBetween(50, 200));
        const hpPct = (this.currentHP / this.maxHP) * 100;
        if (this.hpBar) this.hpBar.style.width = `${hpPct}%`;
        if (this.hpValue) this.hpValue.textContent = `${formatNumber(this.currentHP)} / ${formatNumber(this.maxHP)}`;
        
        // MP regen
        this.currentMP = Math.min(this.maxMP, this.currentMP + randomBetween(100, 400));
        const mpPct = (this.currentMP / this.maxMP) * 100;
        if (this.mpBar) this.mpBar.style.width = `${mpPct}%`;
        if (this.mpValue) this.mpValue.textContent = `${formatNumber(this.currentMP)} / ${formatNumber(this.maxMP)}`;
    }
}

// ──────── TOOLTIP SYSTEM ────────
class TooltipSystem {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        // Map cell tooltips
        $$('.map-cell').forEach(cell => {
            cell.addEventListener('mouseenter', (e) => this.showMapTooltip(e, cell));
            cell.addEventListener('mouseleave', () => this.hide());
        });

        // Inventory slot tooltips
        $$('.inv-slot').forEach(slot => {
            slot.addEventListener('mouseenter', (e) => this.showItemTooltip(e, slot));
            slot.addEventListener('mouseleave', () => this.hide());
        });

        // Effect icon tooltips
        $$('.effect-icon').forEach(effect => {
            effect.addEventListener('mouseenter', (e) => this.showEffectTooltip(e, effect));
            effect.addEventListener('mouseleave', () => this.hide());
        });
    }

    createTooltip() {
        if (!this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'dynamic-tooltip';
            this.tooltip.style.cssText = `
                position: fixed;
                background: rgba(12, 12, 20, 0.95);
                border: 1px solid #252538;
                border-radius: 6px;
                padding: 10px 14px;
                font-size: 12px;
                color: #d8d8e0;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 8px 24px rgba(0,0,0,0.6);
                max-width: 280px;
                font-family: 'Share Tech Mono', monospace;
                line-height: 1.4;
                backdrop-filter: blur(8px);
                opacity: 0;
                transition: opacity 0.15s ease;
            `;
            document.body.appendChild(this.tooltip);
        }
    }

    showMapTooltip(e, cell) {
        this.createTooltip();
        const region = cell.dataset.region;
        const control = cell.dataset.control;
        const isDungeon = cell.classList.contains('dungeon');
        const isAllianceA = cell.classList.contains('alliance-a');
        const isAllianceB = cell.classList.contains('alliance-b');
        
        let controlText = control === '—' ? 'Contested' : `Control: ${control}`;
        let factionText = isAllianceA ? '🔵 Alliance of Dawn' : isAllianceB ? '🔴 Crimson Pact' : '⚪ Neutral';
        
        this.tooltip.innerHTML = `
            <div style="color: #d4a853; font-weight: bold; margin-bottom: 4px; font-size: 13px;">${cell.textContent} ${region}</div>
            <div style="color: #8888a0; margin-bottom: 3px;">${factionText}</div>
            <div style="color: #8888a0; margin-bottom: 3px;">${controlText}</div>
            ${isDungeon ? '<div style="color: #bb77dd; margin-top: 4px;">⚠️ Dungeon Zone — Entry Requires Level 90+</div>' : ''}
            <div style="color: #5a5a72; margin-top: 6px; font-size: 10px;">Click to view detailed map</div>
        `;
        
        this.position(e);
        this.tooltip.style.opacity = '1';
    }

    showItemTooltip(e, slot) {
        this.createTooltip();
        const title = slot.title || 'Unknown Item';
        const isLegendary = slot.classList.contains('legendary');
        const isEpic = slot.classList.contains('epic');
        const isRare = slot.classList.contains('rare');
        
        let rarity = 'Common';
        let color = '#9d9d9d';
        if (isLegendary) { rarity = 'Legendary'; color = '#ff8000'; }
        else if (isEpic) { rarity = 'Epic'; color = '#a335ee'; }
        else if (isRare) { rarity = 'Rare'; color = '#0070dd'; }
        
        const ilvl = randomBetween(420, 495);
        const sellPrice = randomBetween(100, 5000);
        
        this.tooltip.innerHTML = `
            <div style="color: ${color}; font-weight: bold; margin-bottom: 4px; font-size: 13px;">${slot.textContent} ${title}</div>
            <div style="color: ${color}; margin-bottom: 6px; font-size: 11px;">${rarity}</div>
            <div style="color: #8888a0; margin-bottom: 3px;">Item Level: ${ilvl}</div>
            <div style="color: #8888a0; margin-bottom: 3px;">Sell Price: ${formatNumber(sellPrice)} Copper</div>
            <div style="color: #5a5a72; margin-top: 6px; font-size: 10px;">Right-click to use • Shift-click to link</div>
        `;
        
        this.position(e);
        this.tooltip.style.opacity = '1';
    }

    showEffectTooltip(e, effect) {
        this.createTiletip();
        const title = effect.title || 'Unknown Effect';
        const isBuff = effect.classList.contains('buff');
        const timer = effect.querySelector('.effect-timer')?.textContent || '0:00';
        
        this.tooltip.innerHTML = `
            <div style="color: ${isBuff ? '#4fc3f7' : '#e74c3c'}; font-weight: bold; margin-bottom: 4px;">${isBuff ? '✨ Buff' : '💀 Debuff'}</div>
            <div style="color: #d8d8e0; margin-bottom: 4px;">${title}</div>
            <div style="color: #5a5a72; font-size: 11px;">Time remaining: ${timer}</div>
            <div style="color: #5a5a72; font-size: 10px; margin-top: 4px;">Right-click to cancel</div>
        `;
        
        this.position(e);
        this.tooltip.style.opacity = '1';
    }

    position(e) {
        const rect = this.tooltip.getBoundingClientRect();
        let x = e.clientX + 15;
        let y = e.clientY + 15;
        
        // Keep within viewport
        if (x + rect.width > window.innerWidth - 20) {
            x = e.clientX - rect.width - 15;
        }
        if (y + rect.height > window.innerHeight - 20) {
            y = e.clientY - rect.height - 15;
        }
        
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    hide() {
        if (this.tooltip) {
            this.tooltip.style.opacity = '0';
        }
    }
}

// ──────── AMBIENT PARTICLE SYSTEM ────────
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.4;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.floor((this.canvas.width * this.canvas.height) / 25000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3 - 0.1,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? '212, 168, 83' : '79, 195, 247'
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Twinkle effect
            const twinkle = Math.sin(Date.now() * 0.001 + p.x) * 0.2 + 0.8;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity * twinkle})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ──────── NOTIFICATION PULSER ────────
class NotificationPulser {
    constructor() {
        this.badge = $('.badge');
        if (this.badge) {
            setInterval(() => this.pulse(), 4000);
        }
    }

    pulse() {
        if (!this.badge) return;
        this.badge.style.transform = 'scale(1.2)';
        this.badge.style.boxShadow = '0 0 12px rgba(231, 76, 60, 0.6)';
        setTimeout(() => {
            this.badge.style.transform = 'scale(1)';
            this.badge.style.boxShadow = '';
        }, 500);
    }
}

// ──────── INTERACTIVE ELEMENTS ────────
class InteractiveElements {
    constructor() {
        this.initGuildMembers();
        this.initMarketRows();
        this.initDungeonItems();
    }

    initGuildMembers() {
        $$('.guild-member').forEach(member => {
            member.addEventListener('click', () => {
                const name = member.querySelector('.g-name')?.textContent;
                if (name) {
                    // Visual feedback
                    member.style.background = 'rgba(212, 168, 83, 0.15)';
                    member.style.borderColor = 'var(--gold)';
                    setTimeout(() => {
                        member.style.background = '';
                        member.style.borderColor = '';
                    }, 300);
                }
            });
        });
    }

    initMarketRows() {
        $$('.market-row').forEach(row => {
            row.addEventListener('click', () => {
                row.style.background = 'rgba(79, 195, 247, 0.08)';
                setTimeout(() => {
                    row.style.background = '';
                }, 200);
            });
        });
    }

    initDungeonItems() {
        $$('.dungeon-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(4px)';
                item.style.transition = 'transform 0.2s ease';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });
    }
}

// ──────── GUILD CHAT SIMULATOR ────────
class GuildChatSimulator {
    constructor() {
        this.chatContainer = $('.guild-chat-preview');
        this.messages = [
            { author: '[Off] Kael', text: 'Raid group forming for Ignis at 8pm!' },
            { author: '[Mem] Pyra', text: 'Need 2 more DPS for guild expedition' },
            { author: '[GM] Thalorien', text: 'Good job on server first everyone! 🏆' },
            { author: '[Vet] Bjorn', text: 'Just got [Shadowfang Blade] from the market!' },
            { author: '[Mem] Lunara', text: 'Anyone want to run Crystal Caverns?' },
            { author: '[Off] Lyra', text: 'Guild bank restocked with potions and food' },
            { author: '[Mem] Voltaris', text: 'Blood Moon event is insane right now 🔥' },
            { author: '[Vet] Mortis', text: 'PvP season ends in 3 days, keep grinding!' }
        ];
        this.currentIndex = 3;
        
        setInterval(() => this.addMessage(), 8000);
    }

    addMessage() {
        if (this.currentIndex >= this.messages.length) {
            this.currentIndex = 0;
        }
        
        const msg = this.messages[this.currentIndex];
        this.currentIndex++;
        
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-msg';
        msgEl.innerHTML = `<span class="chat-author">${msg.author}:</span> <span class="chat-text">${msg.text}</span>`;
        
        msgEl.style.opacity = '0';
        msgEl.style.transform = 'translateY(-5px)';
        
        this.chatContainer.insertBefore(msgEl, this.chatContainer.firstChild);
        
        requestAnimationFrame(() => {
            msgEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            msgEl.style.opacity = '1';
            msgEl.style.transform = 'translateY(0)';
        });
        
        // Keep only 5 messages
        while (this.chatContainer.children.length > 5) {
            this.chatContainer.removeChild(this.chatContainer.lastChild);
        }
    }
}

// ──────── INITIALIZATION ────────
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    const systems = [
        new WorldClock(),
        new SeasonCycle(),
        new CombatLogSimulator(),
        new CooldownTracker(),
        new BossHPSimulator(),
        new MarketSimulator(),
        new ResourceSimulator(),
        new TooltipSystem(),
        new ParticleSystem(),
        new NotificationPulser(),
        new InteractiveElements(),
        new GuildChatSimulator()
    ];
    
    console.log('%c⚔️ Realm of Aethervale Dashboard Initialized', 'color: #d4a853; font-size: 14px; font-weight: bold;');
    console.log(`%c${systems.length} systems running`, 'color: #4fc3f7; font-size: 11px;');
});
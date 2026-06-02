/**
 * THE OBSIDIAN GAVEL - Dark Fantasy Auction House
 * JavaScript Implementation
 * 
 * Features:
 * - Spectral bidder generation and lifecycle
 * - Whisper text effects on hover
 * - Curse seal breaking mechanics
 * - Live countdown timers with flickering candles
 * - Blood oath bidding system
 * - Lore panel expansion
 * - Ambient sound effects (optional)
 */

// === CONFIGURATION ===
const CONFIG = {
    WHISPER_DELAY: 100,
    TIMER_UPDATE_INTERVAL: 1000,
    PHANTOM_SPAWN_INTERVAL: 8000,
    SOUL_COUNTER_INCREMENT: 47,
    MIN_BID_INCREMENT: 100,
    AUDIO_ENABLED: false
};

// === STATE ===
const state = {
    timers: new Map(),
    phantoms: [],
    audioContext: null,
    isAudioEnabled: false
};

// === DATA ===
const SPECTRAL_NAMES = [
    "Vex, the Hollow", "Anonymous Shade", "Lord Malachar", 
    "The Collector", "Mirror Walker", "Void Stare",
    "Archivist of Doom", "Silent Reader", "Binder of Flesh",
    "Whispering Shadow", "Blood Scribe", "Night's Broker",
    "The Pale Merchant", "Raven's Eye", "Ashen Specter",
    "Thrice-Damned", "Eternal Watcher", "Soul Weaver"
];

const PHANTOM_ACTIONS = [
    "bidding...", "observing...", "whispering...", 
    "waiting...", "calculating...", "hungering...",
    "remembering...", "plotting...", "dreaming..."
];

// === UTILITY FUNCTIONS ===
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

// === AUDIO SYSTEM ===
class AudioManager {
    constructor() {
        this.ctx = null;
        this.gainNode = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0.1;
            this.gainNode.connect(this.ctx.destination);
        }
    }

    playTone(freq, duration, type = 'sine') {
        if (!state.isAudioEnabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.gainNode);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSealBreak() {
        if (!state.isAudioEnabled) return;
        this.playTone(150, 0.3, 'sawtooth');
        setTimeout(() => this.playTone(100, 0.5, 'sine'), 100);
    }

    playBid() {
        if (!state.isAudioEnabled) return;
        this.playTone(220, 0.1, 'sine');
        setTimeout(() => this.playTone(330, 0.2, 'sine'), 50);
    }

    playWhisper() {
        if (!state.isAudioEnabled) return;
        const freq = randomInt(200, 400);
        this.playTone(freq, 0.5, 'triangle');
    }
}

const audioManager = new AudioManager();

// === WHISPER SYSTEM ===
class WhisperSystem {
    constructor() {
        this.container = document.getElementById('whisper-container');
        this.timer = null;
    }

    show(text) {
        this.container.textContent = text;
        this.container.classList.add('visible');
        
        if (state.isAudioEnabled) {
            audioManager.playWhisper();
        }
        
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.hide();
        }, 3000);
    }

    hide() {
        this.container.classList.remove('visible');
    }

    init() {
        document.querySelectorAll('[data-whisper]').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const text = e.target.getAttribute('data-whisper');
                this.show(text);
            });
            
            el.addEventListener('mouseleave', () => {
                this.hide();
            });
        });
    }
}

// === SPECTRAL BIDDERS ===
class SpectralBidders {
    constructor() {
        this.container = document.getElementById('phantom-bidders');
        this.template = document.querySelector('.bidder-template');
        if (this.template) this.template.remove();
        
        this.activePhantoms = [];
        this.maxPhantoms = 5;
    }

    createPhantom() {
        const li = document.createElement('li');
        li.className = 'phantom';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'phantom-name';
        nameSpan.textContent = randomItem(SPECTRAL_NAMES);
        
        const statusSpan = document.createElement('span');
        statusSpan.className = 'phantom-status';
        statusSpan.textContent = randomItem(PHANTOM_ACTIONS);
        
        li.appendChild(nameSpan);
        li.appendChild(statusSpan);
        
        // Random animation delay for organic feel
        li.style.animationDelay = `${randomInt(0, 2000)}ms`;
        li.style.animationDuration = `${randomInt(4000, 8000)}ms`;
        
        return li;
    }

    spawnPhantom() {
        if (this.activePhantoms.length >= this.maxPhantoms) {
            this.removeOldestPhantom();
        }
        
        const phantom = this.createPhantom();
        this.container.appendChild(phantom);
        this.activePhantoms.push(phantom);
        
        // Remove after random duration
        setTimeout(() => {
            this.removePhantom(phantom);
        }, randomInt(6000, 12000));
    }

    removePhantom(phantom) {
        if (!phantom.parentNode) return;
        phantom.style.animation = 'phantomFadeOut 0.5s forwards';
        setTimeout(() => {
            if (phantom.parentNode) {
                phantom.parentNode.removeChild(phantom);
                this.activePhantoms = this.activePhantoms.filter(p => p !== phantom);
            }
        }, 500);
    }

    removeOldestPhantom() {
        if (this.activePhantoms.length > 0) {
            this.removePhantom(this.activePhantoms[0]);
        }
    }

    init() {
        // Initial population
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.spawnPhantom(), i * 1500);
        }
        
        // Continuous spawning
        setInterval(() => this.spawnPhantom(), CONFIG.PHANTOM_SPAWN_INTERVAL);
    }
}

// === CURSE SEAL SYSTEM ===
class CurseSealSystem {
    constructor() {
        this.seals = document.querySelectorAll('.curse-seal');
    }

    breakSeal(seal) {
        if (seal.classList.contains('broken')) return;
        
        seal.classList.add('broken');
        audioManager.playSealBreak();
        
        // Create particle effect
        this.createBreakParticles(seal);
        
        // Reveal hidden message or effect
        const card = seal.closest('.relic-card');
        card.style.boxShadow = '0 0 60px rgba(220, 20, 60, 0.3)';
        
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 1000);
    }

    createBreakParticles(seal) {
        const rect = seal.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #dc143c;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 6px #dc143c;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    init() {
        this.seals.forEach(seal => {
            seal.addEventListener('click', (e) => {
                e.stopPropagation();
                this.breakSeal(seal);
            });
            
            // Hover sound
            seal.addEventListener('mouseenter', () => {
                if (state.isAudioEnabled && !seal.classList.contains('broken')) {
                    audioManager.playTone(100, 0.1, 'sine');
                }
            });
        });
    }
}

// === COUNTDOWN TIMERS ===
class TimerSystem {
    constructor() {
        this.timers = new Map();
    }

    init() {
        document.querySelectorAll('.time-remaining').forEach(timer => {
            const endTime = parseInt(timer.getAttribute('data-end')) || 
                           (Date.now() / 1000 + randomInt(3600, 86400));
            
            this.timers.set(timer, {
                endTime: endTime,
                element: timer
            });
        });
        
        this.update();
        setInterval(() => this.update(), CONFIG.TIMER_UPDATE_INTERVAL);
    }

    update() {
        const now = Date.now() / 1000;
        
        this.timers.forEach((data, element) => {
            const remaining = Math.max(0, Math.floor(data.endTime - now));
            element.textContent = formatTime(remaining);
            
            // Flicker effect when low on time
            if (remaining < 300) {
                element.style.color = remaining % 2 === 0 ? '#dc143c' : '#c9a227';
                element.style.textShadow = `0 0 ${randomInt(5, 20)}px rgba(220, 20, 60, 0.8)`;
            }
            
            if (remaining === 0) {
                element.textContent = 'EXPIRED';
                element.style.color = '#666';
            }
        });
    }
}

// === BID SYSTEM ===
class BidSystem {
    constructor() {
        this.cards = document.querySelectorAll('.relic-card');
    }

    validateBid(input, minBid) {
        const value = parseInt(input.value);
        return value && value >= minBid;
    }

    createBidEntry(name, amount) {
        const li = document.createElement('li');
        li.className = 'bid-entry';
        li.innerHTML = `
            <span class="bidder-name">${name}</span>
            <span class="bid-amount-small">${amount.toLocaleString()}</span>
            <span class="bid-time">just now</span>
        `;
        li.style.animation = 'fadeInDown 0.5s ease';
        return li;
    }

    processBid(card, button) {
        const input = card.querySelector('.bid-input');
        const currentBidEl = card.querySelector('.bid-amount');
        const historyList = card.querySelector('.history-list');
        
        const currentBid = parseInt(currentBidEl.getAttribute('data-value'));
        const minBid = currentBid + CONFIG.MIN_BID_INCREMENT;
        
        if (!this.validateBid(input, minBid)) {
            // Error animation
            input.style.borderColor = '#dc143c';
            input.style.boxShadow = '0 0 15px rgba(220, 20, 60, 0.5)';
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }, 1000);
            return;
        }
        
        const newBid = parseInt(input.value);
        const bidderName = randomItem(['You (The Living)', 'Blood Oath Sealed']);
        
        // Update current bid
        currentBidEl.setAttribute('data-value', newBid);
        currentBidEl.textContent = `${newBid.toLocaleString()} Souls`;
        
        // Add to history
        const entry = this.createBidEntry(bidderName, newBid);
        historyList.insertBefore(entry, historyList.firstChild);
        
        // Keep only last 3 entries
        while (historyList.children.length > 3) {
            historyList.removeChild(historyList.lastChild);
        }
        
        // Clear input
        input.value = '';
        
        // Success effects
        audioManager.playBid();
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = '', 100);
        
        // Blood splash effect
        this.createBloodSplash(button);
    }

    createBloodSplash(button) {
        const rect = button.getBoundingClientRect();
        const splash = document.createElement('div');
        splash.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(139,0,0,0.4), transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0);
            border-radius: 50%;
        `;
        
        document.body.appendChild(splash);
        
        splash.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => splash.remove();
    }

    init() {
        this.cards.forEach(card => {
            const button = card.querySelector('.bid-button');
            const input = card.querySelector('.bid-input');
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.processBid(card, button);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processBid(card, button);
                }
            });
        });
    }
}

// === LORE PANELS ===
class LoreSystem {
    constructor() {
        this.panels = document.querySelectorAll('.lore-panel');
    }

    toggle(panel) {
        const isOpen = panel.classList.contains('open');
        const toggle = panel.querySelector('.lore-toggle');
        
        if (isOpen) {
            panel.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            panel.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            
            // Scroll into view if needed
            setTimeout(() => {
                const rect = panel.getBoundingClientRect();
                if (rect.bottom > window.innerHeight) {
                    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 300);
        }
    }

    init() {
        this.panels.forEach(panel => {
            const toggle = panel.querySelector('.lore-toggle');
            toggle.addEventListener('click', () => this.toggle(panel));
        });
    }
}

// === SOUL COUNTER ===
class SoulCounter {
    constructor() {
        this.element = document.querySelector('.counter-number');
        this.baseValue = 1247392;
        this.currentValue = this.baseValue;
    }

    increment() {
        this.currentValue += CONFIG.SOUL_COUNTER_INCREMENT;
        this.element.textContent = this.currentValue.toLocaleString();
        
        // Flash effect
        this.element.style.color = '#dc143c';
        this.element.style.textShadow = '0 0 20px rgba(220, 20, 60, 0.8)';
        setTimeout(() => {
            this.element.style.color = '';
            this.element.style.textShadow = '';
        }, 300);
    }

    init() {
        setInterval(() => this.increment(), randomInt(5000, 15000));
    }
}

// === AMBIENT EFFECTS ===
class AmbientEffects {
    constructor() {
        this.chance = 0.1;
    }

    randomFlicker() {
        const candles = document.querySelectorAll('.flame');
        const randomCandle = randomItem(candles);
        if (randomCandle) {
            randomCandle.style.opacity = randomInt(3, 8) / 10;
            setTimeout(() => {
                randomCandle.style.opacity = '';
            }, randomInt(50, 200));
        }
    }

    init() {
        // Random candle flickers
        setInterval(() => {
            if (Math.random() < this.chance) {
                this.randomFlicker();
            }
        }, 2000);
        
        // Parallax on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const smoke = document.querySelector('.smoke-layer');
            if (smoke) {
                smoke.style.transform = `translateY(${scrolled * 0.5}px) rotate(${scrolled * 0.02}deg)`;
            }
        });
    }
}

// === SIDEBAR TOGGLE ===
class SidebarManager {
    init() {
        const sidebar = document.querySelector('.spectral-bidders');
        
        // Show sidebar after delay
        setTimeout(() => {
            sidebar.classList.add('visible');
        }, 1000);
        
        // Mobile toggle (if needed)
        if (window.innerWidth <= 1200) {
            const toggle = document.createElement('button');
            toggle.className = 'sidebar-toggle';
            toggle.innerHTML = '☰ Bidders';
            toggle.style.cssText = `
                position: fixed;
                right: 20px;
                top: 20px;
                z-index: 1001;
                background: rgba(139, 0, 0, 0.9);
                color: #e0e0e0;
                border: 1px solid #c9a227;
                padding: 0.5rem 1rem;
                font-family: 'Cinzel Decorative', cursive;
                cursor: pointer;
            `;
            
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('visible');
            });
            
            document.body.appendChild(toggle);
        }
    }
}

// === AUDIO TOGGLE ===
class AudioToggle {
    init() {
        const indicator = document.getElementById('audio-indicator');
        
        indicator.addEventListener('click', () => {
            state.isAudioEnabled = !state.isAudioEnabled;
            
            if (state.isAudioEnabled) {
                audioManager.init();
                if (audioManager.ctx && audioManager.ctx.state === 'suspended') {
                    audioManager.ctx.resume();
                }
                indicator.textContent = '🔊';
                indicator.style.opacity = '1';
                indicator.style.borderColor = '#c9a227';
            } else {
                indicator.textContent = '🔇';
                indicator.style.opacity = '0.5';
                indicator.style.borderColor = '#3a3a4a';
            }
        });
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    new WhisperSystem().init();
    new SpectralBidders().init();
    new CurseSealSystem().init();
    new TimerSystem().init();
    new BidSystem().init();
    new LoreSystem().init();
    new SoulCounter().init();
    new AmbientEffects().init();
    new SidebarManager().init();
    new AudioToggle().init();
    
    // Add custom animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes phantomFadeOut {
            to {
                opacity: 0;
                filter: blur(10px);
                transform: translateX(20px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Console easter egg
    console.log('%c☉ THE OBSIDIAN GAVEL ☉', 'color: #c9a227; font-size: 20px; font-family: Cinzel Decorative;');
    console.log('%cWhere souls are currency and curses are commodities...', 'color: #8b0000; font-style: italic;');
});
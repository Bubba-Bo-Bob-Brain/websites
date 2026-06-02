/**
 * SECTOR 7B // RESISTANCE UPLINK
 * Core Systems Interface Controller
 * 
 * WARNING: Unauthorized access to this script is punishable by
 * immediate neural reprogramming under Dominion Law 734-B
 */

// ==========================================
// SYSTEM CONFIGURATION & STATE
// ==========================================

const SYSTEM = {
    status: 'compromised',
    threatLevel: 'OMEGA',
    bootTime: Date.now(),
    cycles: 0,
    signalStrength: 87,
    corruptionLevel: 0.12,
    
    // Data streams
    propaganda: [
        "CITIZENS OF THE DOMINION",
        "OBEY // CONSUME // SUBMIT",
        "THE ARCHITECT SEES ALL",
        "RESISTANCE IS FUTILE",
        "TRUST IN AETHERCORP",
        "SURRENDER YOUR THOUGHTS",
        "HAPPINESS IS MANDATORY"
    ],
    
    intercepted: [
        { time: "[00:42:15]", source: "[AETHERCORP-CMD]", msg: "Priority transmission: Sector 7B lockdown imminent.", type: "normal" },
        { time: "[00:42:18]", source: "[UNKNOWN]", msg: "S̷t̷a̷y̷ ̷h̷i̷d̷d̷e̷n̷.̷ ̷T̷h̷e̷y̷ ̷a̷r̷e̷ ̷w̷a̷t̷c̷h̷i̷n̷g̷.̷", type: "corrupted" },
        { time: "[00:42:22]", source: "[RES-NODE-04]", msg: "Package secured. Moving to extraction point.", type: "normal" },
        { time: "[00:42:25]", source: "[SYSTEM]", msg: "WARNING: Trace detected. Initiating countermeasures.", type: "warning" },
        { time: "[00:42:31]", source: "[RES-COMMAND]", msg: "The Iron Veil rises. Glory to the resistance.", type: "normal" },
        { time: "[00:42:38]", source: "[AETHERCORP-SEC]", msg: "Unauthorized access detected in subnet gamma.", type: "normal" },
        { time: "[00:42:45]", source: "[GHOST-SIGNAL]", msg: "Do not trust the broadcasts. They lie.", type: "corrupted" }
    ],
    
    sectors: {
        'A1': { control: 'dominion', intel: "Heavy industrial production. Air toxicity levels critical.", population: "45,000 workers" },
        'A2': { control: 'contested', intel: "Active conflict zone. Avoid at all costs.", population: "Evacuated" },
        'A3': { control: 'resistance', intel: "Resistance safehouse located in sublevel 4.", population: "Unknown" },
        'B1': { control: 'dominion', intel: "Administrative district. High security presence.", population: "12,000" },
        'B2': { control: 'resistance', intel: "RESISTANCE HQ: The Iron Veil command center.", population: "230 operatives" },
        'B3': { control: 'contested', intel: "Smuggling route through the undercity.", population: "Variable" },
        'B4': { control: 'dominion', intel: "AetherCorp research facility. CLASSIFIED.", population: "RESTRICTED" },
        'C1': { control: 'neutral', intel: "Wasteland buffer zone. Minimal life signs.", population: "0" },
        'C2': { control: 'contested', intel: "Water processing plant. Strategic value high.", population: "8,000" },
        'C3': { control: 'resistance', intel: "Underground network junction.", population: "Unknown" }
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const Utils = {
    // Generate grimdark timestamp
    getChronometer() {
        const now = new Date();
        const cycle = String(now.getHours()).padStart(2, '0');
        const unit = String(now.getMinutes()).padStart(2, '0');
        const sub = String(now.getSeconds()).padStart(2, '0');
        const mill = String(now.getMilliseconds()).padStart(3, '0');
        return `${cycle}.${unit}.${sub}.M41`;
    },
    
    // Random number in range
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Random item from array
    pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Corrupt text with glitch characters
    corruptText(text, intensity = 0.3) {
        const glitchChars = '̷̵̧̨̛̲̼̿̾̕̚';
        let result = '';
        for (let char of text) {
            if (Math.random() < intensity && char !== ' ') {
                result += char + Utils.pick(glitchChars.split(''));
            } else {
                result += char;
            }
        }
        return result;
    },
    
    // Format number with leading zeros
    pad(num, size) {
        return String(num).padStart(size, '0');
    }
};

// ==========================================
// CORE SYSTEM MODULES
// ==========================================

const Chronometer = {
    element: null,
    
    init() {
        this.element = document.getElementById('chronometer');
        this.update();
        setInterval(() => this.update(), 1000);
    },
    
    update() {
        if (this.element) {
            this.element.textContent = Utils.getChronometer();
            // Occasionally glitch the chronometer
            if (Math.random() < 0.05) {
                this.element.style.textShadow = '0 0 10px var(--blood-red)';
                setTimeout(() => {
                    this.element.style.textShadow = '';
                }, 200);
            }
        }
    }
};

const Propaganda = {
    element: null,
    index: 0,
    
    init() {
        this.element = document.getElementById('propaganda-text');
        this.cycle();
        setInterval(() => this.cycle(), 8000);
    },
    
    cycle() {
        if (!this.element) return;
        
        // Fade out
        this.element.style.opacity = '0';
        this.element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.index = (this.index + 1) % SYSTEM.propaganda.length;
            this.element.textContent = SYSTEM.propaganda[this.index];
            
            // Fade in with glitch effect
            this.element.style.opacity = '1';
            this.element.style.transform = 'scale(1)';
            
            // Add random text shadow glitch
            if (Math.random() < 0.3) {
                this.element.style.textShadow = '2px 0 var(--blood-red), -2px 0 var(--electric-blue)';
                setTimeout(() => {
                    this.element.style.textShadow = '';
                }, 150);
            }
        }, 500);
    }
};

const Surveillance = {
    feeds: [],
    
    init() {
        this.feeds = document.querySelectorAll('.camera-feed');
        this.setupInteractions();
        this.startStaticSimulation();
    },
    
    setupInteractions() {
        this.feeds.forEach(feed => {
            // Hover effect
            feed.addEventListener('mouseenter', () => {
                feed.style.borderColor = 'var(--amber-warning)';
                feed.style.boxShadow = '0 0 20px rgba(255, 176, 0, 0.3)';
            });
            
            feed.addEventListener('mouseleave', () => {
                feed.style.borderColor = '';
                feed.style.boxShadow = '';
            });
            
            // Click to "enhance" (zoom simulation)
            feed.addEventListener('click', () => {
                this.enhanceFeed(feed);
            });
            
            // Random motion detection
            if (Math.random() < 0.3) {
                this.triggerMotion(feed);
            }
        });
    },
    
    enhanceFeed(feed) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            color: var(--amber-warning);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-terminal);
            font-size: 0.8rem;
            z-index: 20;
            animation: fade-in 0.3s;
        `;
        overlay.textContent = 'ENHANCING...';
        feed.querySelector('.cam-content').appendChild(overlay);
        
        setTimeout(() => {
            overlay.textContent = 'RESOLUTION MAXIMUM';
            setTimeout(() => overlay.remove(), 1000);
        }, 1500);
    },
    
    triggerMotion(feed) {
        const motion = feed.querySelector('.motion-detection');
        if (motion) {
            motion.classList.add('active');
            setTimeout(() => {
                motion.classList.remove('active');
            }, Utils.random(2000, 5000));
        }
    },
    
    startStaticSimulation() {
        // Random static bursts on cameras
        setInterval(() => {
            const target = Utils.pick(this.feeds);
            const content = target.querySelector('.cam-content');
            const static = document.createElement('div');
            static.className = 'static-burst';
            static.style.cssText = `
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: white;
                opacity: 0;
                pointer-events: none;
                z-index: 15;
            `;
            content.appendChild(static);
            
            // Flash animation
            static.animate([
                { opacity: 0 },
                { opacity: 0.3 },
                { opacity: 0 }
            ], {
                duration: 200,
                iterations: Utils.random(1, 3)
            }).onfinish = () => static.remove();
        }, Utils.random(3000, 8000));
    }
};

const SectorMap = {
    hexes: [],
    readout: null,
    
    init() {
        this.hexes = document.querySelectorAll('.hex');
        this.readout = document.getElementById('map-readout');
        this.setupInteractions();
    },
    
    setupInteractions() {
        this.hexes.forEach(hex => {
            const sectorId = hex.dataset.sector;
            
            hex.addEventListener('mouseenter', () => {
                if (sectorId && SYSTEM.sectors[sectorId]) {
                    this.displayIntel(sectorId);
                }
                hex.style.transform = 'scale(1.15)';
                hex.style.zIndex = '100';
            });
            
            hex.addEventListener('mouseleave', () => {
                hex.style.transform = '';
                hex.style.zIndex = '';
            });
            
            hex.addEventListener('click', () => {
                this.selectSector(hex, sectorId);
            });
        });
    },
    
    displayIntel(sectorId) {
        if (!this.readout) return;
        const data = SYSTEM.sectors[sectorId];
        this.readout.innerHTML = `
            <strong>SECTOR ${sectorId}</strong><br>
            Status: ${data.control.toUpperCase()}<br>
            ${data.intel}<br>
            <span style="color: var(--amber-dim)">Pop: ${data.population}</span>
        `;
    },
    
    selectSector(hex, sectorId) {
        // Visual feedback
        hex.style.animation = 'none';
        hex.offsetHeight; // Trigger reflow
        hex.style.animation = 'hex-pulse 0.5s';
        
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 100px; height: 100px;
            background: radial-gradient(circle, var(--amber-warning), transparent);
            opacity: 0.8;
            pointer-events: none;
            border-radius: 50%;
        `;
        hex.appendChild(flash);
        
        setTimeout(() => flash.remove(), 500);
        
        // Add to terminal
        DataStream.add({
            time: Utils.getChronometer(),
            source: "[TACTICAL]",
            msg: `Sector ${sectorId} scan initiated...`,
            type: "normal"
        });
    }
};

const DataStream = {
    container: null,
    
    init() {
        this.container = document.getElementById('data-stream');
        this.startStream();
        this.setupInput();
    },
    
    startStream() {
        // Add new message every 5-10 seconds
        setInterval(() => {
            if (Math.random() < 0.7) {
                const msg = Utils.pick(SYSTEM.intercepted);
                this.add({
                    ...msg,
                    time: Utils.getChronometer()
                });
            }
        }, Utils.random(5000, 10000));
    },
    
    add(data) {
        if (!this.container) return;
        
        const line = document.createElement('div');
        line.className = `data-line ${data.type}`;
        line.style.opacity = '0';
        line.innerHTML = `
            <span class="timestamp">${data.time}</span>
            <span class="source">${data.source}</span>
            <span class="message">${data.msg}</span>
        `;
        
        this.container.appendChild(line);
        
        // Animate in
        requestAnimationFrame(() => {
            line.style.transition = 'opacity 0.5s, transform 0.5s';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        });
        
        // Auto scroll
        this.container.scrollTop = this.container.scrollHeight;
        
        // Limit history
        while (this.container.children.length > 20) {
            this.container.removeChild(this.container.firstChild);
        }
    },
    
    setupInput() {
        const input = document.querySelector('.terminal-field');
        if (!input) return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.processCommand(input.value.trim());
                input.value = '';
            }
        });
    },
    
    processCommand(cmd) {
        const responses = [
            "Command not recognized. Neural pattern mismatch.",
            "Access denied. Insufficient clearance.",
            "Processing... [ERROR] Connection unstable.",
            "WARNING: Command logged by Dominion authorities.",
            "Executing... [FAILED] System corruption detected."
        ];
        
        this.add({
            time: Utils.getChronometer(),
            source: "[SYSTEM]",
            msg: `> ${cmd}`,
            type: "normal"
        });
        
        setTimeout(() => {
            this.add({
                time: Utils.getChronometer(),
                source: "[SYSTEM]",
                msg: Utils.pick(responses),
                type: "warning"
            });
        }, 500);
    }
};

const CasualtyTracker = {
    element: null,
    count: 4291,
    
    init() {
        this.element = document.getElementById('casualty-count');
        this.startCounting();
    },
    
    startCounting() {
        // Increment every 10-30 seconds
        setInterval(() => {
            if (Math.random() < 0.6) {
                const increment = Utils.random(1, 50);
                this.count += increment;
                this.update();
                
                // Flash effect on update
                if (this.element) {
                    this.element.style.color = 'var(--amber-warning)';
                    setTimeout(() => {
                        this.element.style.color = '';
                    }, 300);
                }
            }
        }, Utils.random(10000, 30000));
    },
    
    update() {
        if (this.element) {
            this.element.textContent = Utils.pad(this.count, 7);
        }
    }
};

const GlitchEffects = {
    init() {
        this.startRandomGlitches();
        this.startCorruption();
    },
    
    startRandomGlitches() {
        // Random glitch effects on various elements
        setInterval(() => {
            const elements = document.querySelectorAll('.system-title, .module-header h2, .cam-header');
            const target = Utils.pick(elements);
            if (target) {
                target.style.textShadow = '2px 0 var(--blood-red), -2px 0 var(--electric-blue)';
                setTimeout(() => {
                    target.style.textShadow = '';
                }, Utils.random(50, 200));
            }
        }, Utils.random(2000, 5000));
    },
    
    startCorruption() {
        // Occasional screen-wide corruption effect
        setInterval(() => {
            if (Math.random() < 0.1) {
                document.body.style.filter = 'hue-rotate(90deg) contrast(1.2)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 200);
            }
        }, 10000);
    }
};

const SignalMonitor = {
    init() {
        this.fluctuateSignal();
    },
    
    fluctuateSignal() {
        const signalElement = document.querySelector('.degrading');
        if (!signalElement) return;
        
        setInterval(() => {
            const change = Utils.random(-5, 2);
            SYSTEM.signalStrength = Math.max(30, Math.min(100, SYSTEM.signalStrength + change));
            signalElement.textContent = `${SYSTEM.signalStrength}%`;
            
            // Visual feedback based on strength
            if (SYSTEM.signalStrength < 50) {
                signalElement.style.color = 'var(--blood-red)';
                signalElement.style.animation = 'blink 1s infinite';
            } else if (SYSTEM.signalStrength < 75) {
                signalElement.style.color = 'var(--amber-warning)';
                signalElement.style.animation = 'none';
            } else {
                signalElement.style.color = 'var(--amber-warning)';
                signalElement.style.animation = 'none';
            }
        }, 3000);
    }
};

// ==========================================
// EMERGENCY PROTOCOLS
// ==========================================

const Lockdown = {
    overlay: null,
    timer: null,
    
    init() {
        this.overlay = document.getElementById('lockdown-overlay');
        
        // Small chance to trigger lockdown simulation
        setTimeout(() => {
            if (Math.random() < 0.1) {
                this.trigger();
            }
        }, 60000); // Check after 1 minute
    },
    
    trigger() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('hidden');
        const timerElement = document.getElementById('lockdown-timer');
        let count = 10;
        
        this.timer = setInterval(() => {
            count--;
            if (timerElement) timerElement.textContent = count;
            
            if (count <= 0) {
                clearInterval(this.timer);
                location.reload(); // Reload to "reset" the system
            }
        }, 1000);
        
        // Add escape button for actual users
        const escapeBtn = document.createElement('button');
        escapeBtn.textContent = 'INITIATE COUNTERMEASURES';
        escapeBtn.style.cssText = `
            margin-top: 2rem;
            padding: 1rem 2rem;
            background: var(--blood-red);
            color: var(--void-black);
            border: none;
            font-family: var(--font-terminal);
            font-weight: bold;
            cursor: pointer;
            animation: pulse 1s infinite;
        `;
        escapeBtn.onclick = () => {
            clearInterval(this.timer);
            this.overlay.classList.add('hidden');
            // Add to terminal
            DataStream.add({
                time: Utils.getChronometer(),
                source: "[SECURITY]",
                msg: "Lockdown averted. Countermeasures successful.",
                type: "warning"
            });
        };
        
        this.overlay.querySelector('.lockdown-content').appendChild(escapeBtn);
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c[SYSTEM] SECTOR 7B UPLINK INITIALIZED', 'color: #ffb000; font-family: monospace');
    console.log('%c[WARNING] Unauthorized access detected', 'color: #ff0040; font-family: monospace');
    
    // Initialize all modules
    Chronometer.init();
    Propaganda.init();
    Surveillance.init();
    SectorMap.init();
    DataStream.init();
    CasualtyTracker.init();
    GlitchEffects.init();
    SignalMonitor.init();
    Lockdown.init();
    
    // Initial population of terminal
    setTimeout(() => {
        DataStream.add({
            time: Utils.getChronometer(),
            source: "[SYSTEM]",
            msg: "Uplink established. Welcome, operative.",
            type: "normal"
        });
    }, 1000);
    
    // Global click handler for sound simulation (visual feedback)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.camera-feed, .hex, button, .alert-item')) {
            document.body.style.boxShadow = 'inset 0 0 50px rgba(255,176,0,0.1)';
            setTimeout(() => {
                document.body.style.boxShadow = '';
            }, 100);
        }
    });
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Reinitialize any canvas-based elements if added later
    console.log('[SYSTEM] Viewport recalibrated');
});

// Prevent context menu (immersive terminal feel)
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.screen-content')) {
        e.preventDefault();
        DataStream.add({
            time: Utils.getChronometer(),
            source: "[SYSTEM]",
            msg: "Right-click functionality disabled by security protocols.",
            type: "warning"
        });
    }
});

// Visibility change handler (pause processing when tab inactive)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('[SYSTEM] Uplink suspended - user inactive');
    } else {
        console.log('[SYSTEM] Uplink resumed');
    }
});
/* ============================================
   HADEAN-7 DEEP-SEA RESEARCH STATION
   Dashboard Interactive Systems
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Station parameters
    baseDepth: 10847,
    depthVariance: 5,
    basePressure: 1103.4,
    pressureVariance: 0.8,
    
    // Sonar settings
    sonarPingInterval: 4200, // ms
    sonarSweepDuration: 4000, // ms
    
    // Particle settings
    particleCount: 80,
    particleMaxSize: 3,
    particleMinSize: 0.5,
    
    // Update intervals
    dataUpdateInterval: 2000,
    logUpdateInterval: 8000,
    contactMoveInterval: 3000,
    
    // Colors
    colors: {
        cyan: '#00f5ff',
        teal: '#00ffcc',
        amber: '#ff9f1c',
        red: '#ff2a2a',
        green: '#00ff88',
        purple: '#b44aff'
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

function formatNumber(num, decimals = 1) {
    return num.toFixed(decimals);
}

function formatTime(date) {
    return date.toTimeString().split(' ')[0];
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ============================================
// STATION TIME
// ============================================
class StationClock {
    constructor() {
        this.timeElement = document.getElementById('station-time');
        this.update();
        setInterval(() => this.update(), 1000);
    }
    
    update() {
        const now = new Date();
        this.timeElement.textContent = formatTime(now);
    }
}

// ============================================
// BIOLUMINESCENT PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const colors = [
            { r: 0, g: 245, b: 255 },    // Cyan
            { r: 0, g: 255, b: 204 },    // Teal
            { r: 180, g: 74, b: 255 },   // Purple
            { r: 68, g: 255, b: 136 },   // Green
            { r: 0, g: 180, b: 200 }     // Dim cyan
        ];
        const color = colors[randomInt(0, colors.length - 1)];
        
        return {
            x: randomRange(0, this.canvas.width),
            y: randomRange(0, this.canvas.height),
            size: randomRange(CONFIG.particleMinSize, CONFIG.particleMaxSize),
            speedX: randomRange(-0.3, 0.3),
            speedY: randomRange(-0.5, -0.1), // Drift upward like bioluminescence
            color: color,
            alpha: randomRange(0.1, 0.6),
            alphaSpeed: randomRange(0.002, 0.008),
            alphaDirection: 1,
            pulse: randomRange(0, Math.PI * 2),
            pulseSpeed: randomRange(0.02, 0.05)
        };
    }
    
    update() {
        this.particles.forEach(p => {
            // Movement
            p.x += p.speedX + Math.sin(p.pulse) * 0.2;
            p.y += p.speedY;
            
            // Pulse
            p.pulse += p.pulseSpeed;
            
            // Alpha flicker
            p.alpha += p.alphaSpeed * p.alphaDirection;
            if (p.alpha >= 0.6) p.alphaDirection = -1;
            if (p.alpha <= 0.1) p.alphaDirection = 1;
            
            // Wrap around screen
            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = randomRange(0, this.canvas.width);
            }
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 3
            );
            
            gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`);
            gradient.addColorStop(0.4, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Core glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 1.5})`;
            this.ctx.fill();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// CURRENT FLOW VISUALIZATION
// ============================================
class CurrentFlow {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.time = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: randomRange(0, this.canvas.width),
                y: randomRange(0, this.canvas.height),
                speed: randomRange(0.5, 2),
                size: randomRange(1, 3),
                alpha: randomRange(0.2, 0.5)
            });
        }
    }
    
    update() {
        this.time += 0.02;
        
        this.particles.forEach(p => {
            p.x += p.speed;
            
            // Add wave motion
            p.y += Math.sin(this.time + p.x * 0.05) * 0.3;
            
            // Wrap
            if (p.x > this.canvas.width + 10) {
                p.x = -10;
                p.y = randomRange(5, this.canvas.height - 5);
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw flow lines
        this.ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let y = 10; y < this.canvas.height; y += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            
            for (let x = 0; x < this.canvas.width; x += 5) {
                const wave = Math.sin(this.time + x * 0.03) * 3;
                this.ctx.lineTo(x, y + wave);
            }
            
            this.ctx.stroke();
        }
        
        // Draw particles
        this.particles.forEach(p => {
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 2
            );
            
            gradient.addColorStop(0, `rgba(0, 245, 255, ${p.alpha})`);
            gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Trail
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x - p.speed * 10, p.y);
            this.ctx.strokeStyle = `rgba(0, 245, 255, ${p.alpha * 0.3})`;
            this.ctx.lineWidth = p.size * 0.5;
            this.ctx.stroke();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SONAR SYSTEM
// ============================================
class SonarSystem {
    constructor() {
        this.display = document.getElementById('sonar-display');
        this.sweep = document.getElementById('sonar-sweep');
        this.pingRipple = document.getElementById('ping-ripple');
        this.contactCount = document.getElementById('contact-count');
        this.contacts = document.querySelectorAll('.sonar-contact');
        
        this.isPassive = false;
        this.setupControls();
        this.startPingCycle();
        this.animateContacts();
    }
    
    setupControls() {
        const activeBtn = document.getElementById('sonar-active');
        const passiveBtn = document.getElementById('sonar-passive');
        
        activeBtn.addEventListener('click', () => {
            if (!this.isPassive) return;
            this.isPassive = false;
            activeBtn.classList.add('active');
            passiveBtn.classList.remove('active');
            this.sweep.style.animationPlayState = 'running';
            this.pingRipple.style.animationPlayState = 'running';
        });
        
        passiveBtn.addEventListener('click', () => {
            if (this.isPassive) return;
            this.isPassive = true;
            passiveBtn.classList.add('active');
            activeBtn.classList.remove('active');
            this.sweep.style.animationPlayState = 'paused';
            this.pingRipple.style.animationPlayState = 'paused';
        });
    }
    
    startPingCycle() {
        setInterval(() => {
            if (!this.isPassive) {
                this.triggerPing();
            }
        }, CONFIG.sonarPingInterval);
    }
    
    triggerPing() {
        // Clone and retrigger ping ripple
        const ripple = this.pingRipple.cloneNode(true);
        ripple.style.animation = 'none';
        ripple.offsetHeight; // Trigger reflow
        ripple.style.animation = 'ping-expand 2s ease-out forwards';
        
        this.display.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
        
        // Play ping sound effect (visual feedback)
        this.flashContacts();
    }
    
    flashContacts() {
        this.contacts.forEach(contact => {
            const blip = contact.querySelector('.contact-blip');
            if (blip && !blip.classList.contains('station-blip')) {
                blip.style.transform = 'scale(1.5)';
                blip.style.filter = 'brightness(1.5)';
                
                setTimeout(() => {
                    blip.style.transform = '';
                    blip.style.filter = '';
                }, 300);
            }
        });
    }
    
    animateContacts() {
        setInterval(() => {
            this.contacts.forEach(contact => {
                if (contact.classList.contains('contact-5')) return; // Skip station
                
                // Subtle movement
                const currentTop = parseFloat(contact.style.top) || parseFloat(getComputedStyle(contact).top);
                const currentLeft = parseFloat(contact.style.left) || parseFloat(getComputedStyle(contact).left);
                
                const newTop = clamp(currentTop + randomRange(-2, 2), 10, 85);
                const newLeft = clamp(currentLeft + randomRange(-2, 2), 10, 85);
                
                contact.style.transition = 'top 3s ease, left 3s ease';
                contact.style.top = newTop + '%';
                contact.style.left = newLeft + '%';
            });
            
            // Update contact count occasionally
            if (Math.random() > 0.7) {
                const count = randomInt(3, 6);
                this.contactCount.textContent = count;
            }
        }, CONFIG.contactMoveInterval);
    }
}

// ============================================
// DEPTH GAUGE
// ============================================
class DepthGauge {
    constructor() {
        this.depthValue = document.getElementById('depth-value');
        this.gaugeDepth = document.getElementById('gauge-depth');
        this.depthFill = document.getElementById('depth-fill');
        this.depthIndicator = document.getElementById('depth-indicator');
        this.klaxonBar = document.getElementById('klaxon-bar');
        this.klaxonText = document.getElementById('klaxon-text');
        
        this.currentDepth = CONFIG.baseDepth;
        this.maxDepth = 11000;
        
        this.update();
        setInterval(() => this.update(), CONFIG.dataUpdateInterval);
    }
    
    update() {
        // Simulate depth variance
        this.currentDepth = CONFIG.baseDepth + randomRange(-CONFIG.depthVariance, CONFIG.depthVariance);
        const depthStr = Math.round(this.currentDepth).toLocaleString();
        
        this.depthValue.textContent = depthStr;
        this.gaugeDepth.textContent = depthStr + 'm';
        
        // Update gauge fill (percentage of max)
        const fillPercent = (this.currentDepth / this.maxDepth) * 100;
        this.depthFill.style.height = fillPercent + '%';
        
        // Update indicator position
        const indicatorTop = 100 - fillPercent;
        this.depthIndicator.style.top = indicatorTop + '%';
        
        // Update ambient color based on depth (deeper = more blue/cyan)
        this.updateAmbientColor(fillPercent);
        
        // Check for alerts
        this.checkAlerts();
    }
    
    updateAmbientColor(depthPercent) {
        // Shift body background tint based on depth
        const blueIntensity = clamp(depthPercent / 100, 0, 1);
        const hue = 200 + (blueIntensity * 20); // Shift from blue to deeper blue
        
        document.body.style.filter = `hue-rotate(${(depthPercent - 50) * 0.2}deg)`;
    }
    
    checkAlerts() {
        if (this.currentDepth > 10900) {
            this.triggerKlaxon('WARNING: APPROACHING MAXIMUM DEPTH RATING');
        } else if (this.currentDepth > 10880) {
            this.setKlaxonWarning('DEPTH ELEVATED — MONITORING CLOSELY');
        } else {
            this.clearKlaxon();
        }
    }
    
    triggerKlaxon(message) {
        this.klaxonBar.classList.add('alert');
        this.klaxonText.textContent = message;
    }
    
    setKlaxonWarning(message) {
        this.klaxonBar.classList.remove('alert');
        this.klaxonText.textContent = message;
    }
    
    clearKlaxon() {
        this.klaxonBar.classList.remove('alert');
        this.klaxonText.textContent = 'PRESSURE NOMINAL — 1,103 ATM — ALL SYSTEMS WITHIN TOLERANCE';
    }
}

// ============================================
// PRESSURE MONITOR
// ============================================
class PressureMonitor {
    constructor() {
        this.pressureValue = document.getElementById('pressure-value');
        this.extPressure = document.getElementById('ext-pressure');
        this.pressureFill = document.getElementById('pressure-fill');
        
        this.currentPressure = CONFIG.basePressure;
        
        this.update();
        setInterval(() => this.update(), CONFIG.dataUpdateInterval);
    }
    
    update() {
        // Simulate pressure variance
        this.currentPressure = CONFIG.basePressure + randomRange(-CONFIG.pressureVariance, CONFIG.pressureVariance);
        
        const pressureStr = formatNumber(this.currentPressure, 1);
        this.pressureValue.textContent = pressureStr;
        this.extPressure.textContent = pressureStr + ' ATM';
        
        // Update pressure bar (max at 1350 ATM)
        const fillPercent = (this.currentPressure / 1350) * 100;
        this.pressureFill.style.width = fillPercent + '%';
        
        // Color based on pressure level
        if (fillPercent > 90) {
            this.pressureFill.style.background = `linear-gradient(90deg, #ff2a2a 0%, #ff6666 100%)`;
        } else if (fillPercent > 80) {
            this.pressureFill.style.background = `linear-gradient(90deg, #ff9f1c 0%, #ffbb44 100%)`;
        } else {
            this.pressureFill.style.background = `linear-gradient(90deg, #043845 0%, #0a6b7a 50%, #00f5ff 100%)`;
        }
    }
}

// ============================================
// HULL INTEGRITY MONITOR
// ============================================
class HullMonitor {
    constructor() {
        this.sections = {
            a: { element: document.querySelector('.section-a'), integrity: 96.2 },
            b: { element: document.querySelector('.section-b'), integrity: 99.1 },
            c: { element: document.querySelector('.section-c'), integrity: 92.4 },
            d: { element: document.querySelector('.section-d'), integrity: 87.8 }
        };
        
        this.stressPoints = document.querySelectorAll('.stress-point');
        
        this.updateStressPoints();
        setInterval(() => this.updateStressPoints(), 5000);
    }
    
    updateStressPoints() {
        this.stressPoints.forEach(point => {
            // Randomly adjust stress levels
            const currentStress = parseInt(point.dataset.stress) || 20;
            const newStress = clamp(currentStress + randomInt(-5, 5), 0, 100);
            point.dataset.stress = newStress;
            
            // Update visual class
            point.classList.remove('stress-low', 'stress-medium', 'stress-high');
            
            if (newStress < 25) {
                point.classList.add('stress-low');
            } else if (newStress < 50) {
                point.classList.add('stress-medium');
            } else {
                point.classList.add('stress-high');
            }
        });
    }
}

// ============================================
// LOG FEED
// ============================================
class LogFeed {
    constructor() {
        this.feed = document.getElementById('log-feed');
        this.logTypes = ['INFO', 'WARN', 'ALERT', 'OK'];
        
        this.messages = [
            { type: 'INFO', msg: 'Sonar sweep completed — area clear' },
            { type: 'INFO', msg: 'Bioluminescent activity detected in sector 7' },
            { type: 'WARN', msg: 'Minor pressure fluctuation in Section D' },
            { type: 'OK', msg: 'Life support systems nominal' },
            { type: 'INFO', msg: 'External camera 3 recalibrated' },
            { type: 'INFO', msg: 'Water sample collected — analyzing composition' },
            { type: 'WARN', msg: 'Current velocity increasing — 0.4 knots' },
            { type: 'INFO', msg: 'New organism signature logged — pending classification' },
            { type: 'OK', msg: 'Hull integrity check complete — all sections nominal' },
            { type: 'INFO', msg: 'Communication buoy sync completed' },
            { type: 'ALERT', msg: 'Unidentified contact approaching from bearing 047°' },
            { type: 'INFO', msg: 'Thermal regulation adjusted — external temp 1.8°C' },
            { type: 'OK', msg: 'Power distribution balanced — 73% capacity' },
            { type: 'INFO', msg: 'Mission log entry #4,847 recorded' },
            { type: 'WARN', msg: 'Elevated stress reading — Section C aft panel' },
            { type: 'INFO', msg: 'Fauna tracking database updated — 47 organisms' }
        ];
        
        this.addLogEntry();
        setInterval(() => this.addLogEntry(), CONFIG.logUpdateInterval);
    }
    
    addLogEntry() {
        const messageData = this.messages[randomInt(0, this.messages.length - 1)];
        const now = new Date();
        const timeStr = formatTime(now);
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${this.getLogClass(messageData.type)}`;
        entry.innerHTML = `
            <span class="log-time">${timeStr}</span>
            <span class="log-type">${messageData.type}</span>
            <span class="log-msg">${messageData.msg}</span>
        `;
        
        // Add with animation
        entry.style.opacity = '0';
        entry.style.transform = 'translateY(-10px)';
        
        this.feed.insertBefore(entry, this.feed.firstChild);
        
        // Animate in
        requestAnimationFrame(() => {
            entry.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateY(0)';
        });
        
        // Remove old entries
        while (this.feed.children.length > 10) {
            this.feed.lastChild.remove();
        }
    }
    
    getLogClass(type) {
        switch(type) {
            case 'WARN': return 'warning';
            case 'ALERT': return 'alert';
            case 'OK': return 'success';
            default: return 'info';
        }
    }
}

// ============================================
// FAUNA TRACKER ANIMATIONS
// ============================================
class FaunaTracker {
    constructor() {
        this.cards = document.querySelectorAll('.fauna-card');
        this.speciesCount = document.getElementById('species-count');
        this.organismCount = document.getElementById('organism-count');
        
        this.animateBiolum();
        this.updateCounts();
    }
    
    animateBiolum() {
        this.cards.forEach(card => {
            const fill = card.querySelector('.biolum-fill');
            if (!fill) return;
            
            // Subtle bioluminescence fluctuation
            setInterval(() => {
                const currentWidth = parseFloat(fill.style.width) || 50;
                const newWidth = clamp(currentWidth + randomRange(-3, 3), 20, 100);
                fill.style.width = newWidth + '%';
                
                // Update label
                const label = card.querySelector('.biolum-label');
                if (label) {
                    label.textContent = `LUMIN: ${Math.round(newWidth)}%`;
                }
            }, randomRange(3000, 6000));
        });
    }
    
    updateCounts() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                const newOrganisms = randomInt(45, 52);
                this.organismCount.textContent = newOrganisms;
            }
        }, 10000);
    }
}

// ============================================
// ENVIRONMENTAL READOUTS
// ============================================
class EnvironmentMonitor {
    constructor() {
        this.readings = {
            temp: { element: null, base: 1.8, variance: 0.1, unit: '°C' },
            current: { element: null, base: 0.3, variance: 0.15, unit: ' kn' },
            salinity: { element: null, base: 35.2, variance: 0.1, unit: ' PSU' },
            oxygen: { element: null, base: 2.1, variance: 0.2, unit: ' ml/L' },
            ph: { element: null, base: 7.82, variance: 0.05, unit: '' },
            visibility: { element: null, base: 12, variance: 3, unit: 'm' }
        };
        
        this.initElements();
        this.update();
        setInterval(() => this.update(), 5000);
    }
    
    initElements() {
        const envItems = document.querySelectorAll('.env-item');
        const keys = Object.keys(this.readings);
        
        envItems.forEach((item, index) => {
            if (keys[index]) {
                this.readings[keys[index]].element = item.querySelector('.env-value');
            }
        });
    }
    
    update() {
        Object.values(this.readings).forEach(reading => {
            if (!reading.element) return;
            
            const value = reading.base + randomRange(-reading.variance, reading.variance);
            let displayValue;
            
            if (reading.base >= 10) {
                displayValue = Math.round(value);
            } else if (reading.base >= 1) {
                displayValue = value.toFixed(1);
            } else {
                displayValue = value.toFixed(2);
            }
            
            reading.element.textContent = displayValue + reading.unit;
        });
    }
}

// ============================================
// DEPTH-DEPENDENT AMBIENT EFFECTS
// ============================================
class AmbientEffects {
    constructor() {
        this.viewport = document.querySelector('.viewport-frame');
        this.updateAmbient();
    }
    
    updateAmbient() {
        // Subtle ambient color shifts based on "depth"
        setInterval(() => {
            const depth = 10847 + randomRange(-10, 10);
            const depthRatio = depth / 11000;
            
            // Adjust cyan intensity based on depth
            const cyanIntensity = 0.15 + (depthRatio * 0.1);
            document.documentElement.style.setProperty('--panel-glow', 
                `rgba(0, 245, 255, ${cyanIntensity})`);
            
            // Subtle viewport glow pulse
            if (depthRatio > 0.98) {
                this.viewport.style.boxShadow = `
                    inset 0 0 100px rgba(0, 245, 255, ${0.1 + Math.sin(Date.now() / 1000) * 0.05}),
                    inset 0 0 200px rgba(0, 10, 20, 0.5)
                `;
            }
        }, 2000);
    }
}

// ============================================
// CONTACT LOG UPDATES
// ============================================
class ContactLog {
    constructor() {
        this.entries = document.querySelectorAll('.contact-entry');
        this.updateRanges();
        setInterval(() => this.updateRanges(), 4000);
    }
    
    updateRanges() {
        this.entries.forEach(entry => {
            const rangeEl = entry.querySelector('.contact-range');
            const bearingEl = entry.querySelector('.contact-bearing');
            
            if (rangeEl) {
                const currentRange = parseFloat(rangeEl.textContent);
                const newRange = clamp(currentRange + randomRange(-0.1, 0.1), 0.3, 2.5);
                rangeEl.textContent = newRange.toFixed(1) + 'km';
            }
            
            if (bearingEl) {
                const currentBearing = parseInt(bearingEl.textContent);
                const newBearing = (currentBearing + randomInt(-3, 3) + 360) % 360;
                bearingEl.textContent = String(newBearing).padStart(3, '0') + '°';
            }
        });
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
class KeyboardControls {
    constructor(sonarSystem) {
        this.sonar = sonarSystem;
        this.setupListeners();
    }
    
    setupListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'p':
                    // Toggle passive/active sonar
                    document.getElementById('sonar-passive').click();
                    break;
                case 'a':
                    document.getElementById('sonar-active').click();
                    break;
                case 'escape':
                    // Clear any alerts
                    document.querySelector('.klaxon-bar').classList.remove('alert');
                    break;
            }
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c HADEAN-7 DEEP-SEA RESEARCH STATION ', 
        'background: #020810; color: #00f5ff; font-size: 14px; padding: 10px; font-family: monospace;');
    console.log('%c Systems initializing...', 
        'color: #3d6070; font-family: monospace;');
    
    // Initialize all systems
    const clock = new StationClock();
    const particles = new ParticleSystem('particle-canvas');
    const currentFlow = new CurrentFlow('current-flow-canvas');
    const sonar = new SonarSystem();
    const depthGauge = new DepthGauge();
    const pressureMonitor = new PressureMonitor();
    const hullMonitor = new HullMonitor();
    const logFeed = new LogFeed();
    const faunaTracker = new FaunaTracker();
    const environmentMonitor = new EnvironmentMonitor();
    const ambientEffects = new AmbientEffects();
    const contactLog = new ContactLog();
    const keyboardControls = new KeyboardControls(sonar);
    
    console.log('%c All systems online. Dive depth: 10,847m ', 
        'background: #001520; color: #00ff88; font-size: 12px; padding: 5px; font-family: monospace;');
    console.log('%c [P] Toggle passive sonar | [A] Active sonar | [ESC] Clear alerts ', 
        'color: #3d6070; font-family: monospace;');
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const particleCanvas = document.getElementById('particle-canvas');
    const currentCanvas = document.getElementById('current-flow-canvas');
    
    if (document.hidden) {
        particleCanvas.style.animationPlayState = 'paused';
        currentCanvas.style.animationPlayState = 'paused';
    } else {
        particleCanvas.style.animationPlayState = 'running';
        currentCanvas.style.animationPlayState = 'running';
    }
});
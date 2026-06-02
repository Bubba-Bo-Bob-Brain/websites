/**
 * HADAL STATION α-09 - Primary Operations Systems
 * Depth: 10,847m | Pressure: 1,084 ATM
 * 
 * Core Systems Controller
 */

// Configuration & State
const CONFIG = {
    depth: {
        current: 10847,
        max: 11000,
        min: 10600,
        fluctuation: 5
    },
    pressure: {
        current: 1084,
        critical: 1090,
        max: 1100
    },
    hull: {
        sectors: {
            A: 23,
            B: 67, // Warning level
            C: 45,
            D: 12
        }
    },
    fauna: [
        { name: 'Atolla wyvillei', type: 'jellyfish', depth: '10,240m', lux: 0.004, temp: '1.8°C', icon: '🔷' },
        { name: 'Malacosteus niger', type: 'fish', depth: '10,120m', lux: 0.002, temp: '2.1°C', icon: '🐟' },
        { name: 'Vampyroteuthis', type: 'cephalopod', depth: '10,450m', lux: 0.006, temp: '1.5°C', icon: '🦑' },
        { name: 'Bathynomus giganteus', type: 'crustacean', depth: '10,380m', lux: 0.001, temp: '1.9°C', icon: '🦐' }
    ],
    sonar: {
        contacts: [],
        maxContacts: 8,
        sweepSpeed: 4000
    }
};

// State Management
const State = {
    metStart: Date.now() - (142 * 3600000 + 23 * 60000 + 9 * 1000), // 142:23:09 ago
    lastUpdate: Date.now(),
    emergency: false,
    depthHistory: [],
    particleCount: 0
};

// DOM Elements Cache
const DOM = {
    depthValue: document.getElementById('depth-value'),
    depthBar: document.getElementById('depth-bar'),
    pressureValue: document.getElementById('pressure-value'),
    pressureNeedle: document.getElementById('pressure-needle'),
    klaxon: document.getElementById('pressure-klaxon'),
    klaxonPressure: document.getElementById('klaxon-pressure'),
    metTime: document.getElementById('met-time'),
    localTime: document.getElementById('local-time'),
    faunaList: document.getElementById('fauna-list'),
    specimenCount: document.getElementById('specimen-count'),
    luxValue: document.getElementById('lux-value'),
    tempValue: document.getElementById('temp-value'),
    spectrumFill: document.getElementById('spectrum-fill'),
    sonarContacts: document.getElementById('sonar-contacts'),
    contactCount: document.getElementById('contact-count'),
    pingRate: document.getElementById('ping-rate'),
    stressA: document.getElementById('stress-a'),
    stressB: document.getElementById('stress-b'),
    stressC: document.getElementById('stress-c'),
    stressD: document.getElementById('stress-d'),
    fillA: document.getElementById('fill-a'),
    fillB: document.getElementById('fill-b'),
    fillC: document.getElementById('fill-c'),
    fillD: document.getElementById('fill-d'),
    hullTemp: document.getElementById('hull-temp'),
    hullFatigue: document.getElementById('hull-fatigue'),
    integrityStatus: document.getElementById('integrity-status'),
    ambientOverlay: document.getElementById('ambient-overlay'),
    zoneMarker: document.getElementById('zone-marker'),
    particleLayer: document.getElementById('particle-layer')
};

/**
 * Canvas Systems
 */

// Abyss Background Canvas
class AbyssCanvas {
    constructor() {
        this.canvas = document.getElementById('abyss-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create distant bioluminescent particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedY: Math.random() * 0.5 + 0.1,
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    animate() {
        // Deep abyss gradient
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height
        );
        gradient.addColorStop(0, '#0d1b2a');
        gradient.addColorStop(0.5, '#05080a');
        gradient.addColorStop(1, '#020405');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX + Math.sin(p.pulse) * 0.5;
            p.pulse += 0.02;

            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = Math.random() * this.canvas.width;
            }

            const alpha = p.opacity * (0.8 + Math.sin(p.pulse) * 0.2);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 245, 212, ${alpha})`;
            this.ctx.fill();
            
            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `rgba(0, 245, 212, ${alpha * 0.5})`;
        });

        this.ctx.shadowBlur = 0;
        requestAnimationFrame(() => this.animate());
    }
}

// Current Flow Visualization
class CurrentCanvas {
    constructor() {
        this.canvas = document.getElementById('current-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.flowLines = [];
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create flow lines representing deep ocean currents
        for (let i = 0; i < 20; i++) {
            this.flowLines.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 100 + 50,
                speed: Math.random() * 2 + 1,
                width: Math.random() * 2 + 1,
                opacity: Math.random() * 0.1 + 0.05,
                angle: Math.random() * 0.2 - 0.1 // Slight drift
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.flowLines.forEach(line => {
            line.x += line.speed;
            line.y += Math.sin(line.x * 0.01) * 0.5;

            if (line.x > this.canvas.width + line.length) {
                line.x = -line.length;
                line.y = Math.random() * this.canvas.height;
            }

            // Draw flow line
            this.ctx.beginPath();
            this.ctx.moveTo(line.x, line.y);
            this.ctx.lineTo(line.x - line.length, line.y + Math.sin(line.x * 0.02) * 10);
            this.ctx.strokeStyle = `rgba(0, 187, 249, ${line.opacity})`;
            this.ctx.lineWidth = line.width;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Add subtle particle at head
            this.ctx.beginPath();
            this.ctx.arc(line.x, line.y, line.width, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 245, 212, ${line.opacity * 2})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * HUD Systems
 */

// Time Systems
function updateTime() {
    const now = new Date();
    
    // Local time
    DOM.localTime.textContent = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    // Mission Elapsed Time
    const elapsed = Date.now() - State.metStart;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    DOM.metTime.textContent = `${hours.toString().padStart(3, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Depth & Pressure Monitoring
class DepthPressureSystem {
    constructor() {
        this.depth = CONFIG.depth.current;
        this.pressure = CONFIG.pressure.current;
        this.targetDepth = this.depth;
        this.vibration = 0;
    }

    update() {
        // Simulate depth fluctuation
        if (Math.random() > 0.7) {
            this.targetDepth += (Math.random() - 0.5) * CONFIG.depth.fluctuation;
            this.targetDepth = Math.max(CONFIG.depth.min, Math.min(CONFIG.depth.max, this.targetDepth));
        }

        // Smooth depth transition
        this.depth += (this.targetDepth - this.depth) * 0.1;
        
        // Calculate pressure (approx 1 atm per 10m)
        this.pressure = (this.depth / 10) + Math.sin(Date.now() / 10000) * 2;

        this.render();
        this.checkAlarms();
        this.updateAmbient();
    }

    render() {
        // Update depth display
        DOM.depthValue.textContent = Math.floor(this.depth).toLocaleString();
        const depthPercent = ((this.depth - CONFIG.depth.min) / (CONFIG.depth.max - CONFIG.depth.min)) * 100;
        DOM.depthBar.style.width = `${depthPercent}%`;

        // Update pressure display
        DOM.pressureValue.textContent = Math.floor(this.pressure);
        
        // Update analog needle (range 0-1200 atm mapped to -135 to 135 degrees)
        const angle = ((this.pressure / 1200) * 270) - 135;
        DOM.pressureNeedle.style.transform = `translateY(-50%) rotate(${angle}deg)`;

        // Update klaxon if active
        if (State.emergency) {
            DOM.klaxonPressure.textContent = `${Math.floor(this.pressure)} ATM`;
        }
    }

    checkAlarms() {
        if (this.pressure > CONFIG.pressure.critical && !State.emergency) {
            this.triggerEmergency();
        } else if (this.pressure < CONFIG.pressure.critical - 10 && State.emergency) {
            this.clearEmergency();
        }
    }

    triggerEmergency() {
        State.emergency = true;
        DOM.klaxon.classList.add('active');
        document.body.style.animation = 'critical-pulse 0.5s infinite';
    }

    clearEmergency() {
        State.emergency = false;
        DOM.klaxon.classList.remove('active');
        document.body.style.animation = '';
    }

    updateAmbient() {
        // Update ambient color temperature based on depth
        // Deeper = cooler/bluer
        const depthRatio = (this.depth - CONFIG.depth.min) / (CONFIG.depth.max - CONFIG.depth.min);
        const hue = 200 - (depthRatio * 40); // 200 to 160 (cyan to deep blue)
        const light = 10 - (depthRatio * 5); // 10% to 5%
        
        DOM.ambientOverlay.style.background = `hsla(${hue}, 80%, ${light}%, 0.3)`;
        
        // Update zone marker
        const zonePosition = 20 + (depthRatio * 60); // Position in track
        DOM.zoneMarker.style.top = `${zonePosition}%`;
    }
}

// Sonar System
class SonarSystem {
    constructor() {
        this.contacts = [];
        this.lastPing = Date.now();
        this.pingInterval = 2400;
        
        // Start sweep monitoring
        setInterval(() => this.checkSweep(), 100);
    }

    checkSweep() {
        const now = Date.now();
        const sweep = document.getElementById('sonar-sweep');
        const rect = sweep.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Check if it's time for a ping
        if (now - this.lastPing > this.pingInterval) {
            this.lastPing = now;
            this.createPing(centerX, centerY);
            this.updateContacts();
        }

        // Randomly add new contacts
        if (Math.random() > 0.95 && this.contacts.length < CONFIG.sonar.maxContacts) {
            this.addContact();
        }
    }

    createPing(x, y) {
        // Create visual ping ripple
        const ping = document.createElement('div');
        ping.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(0, 245, 212, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(ping);
        
        // Animate
        let scale = 1;
        let opacity = 1;
        
        const animate = () => {
            scale += 0.05;
            opacity -= 0.02;
            
            ping.style.transform = `translate(-50%, -50%) scale(${scale})`;
            ping.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                ping.remove();
            }
        };
        
        requestAnimationFrame(animate);
        
        // Update ping rate display with slight variation
        const rate = (2.4 + (Math.random() - 0.5) * 0.2).toFixed(1);
        DOM.pingRate.textContent = `${rate}s`;
    }

    addContact() {
        const id = Date.now();
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.2 + Math.random() * 0.7; // 20% to 90% from center
        
        const contact = {
            id,
            angle,
            distance,
            strength: Math.random() * 100,
            type: Math.random() > 0.7 ? 'unknown' : 'fauna',
            age: 0
        };
        
        this.contacts.push(contact);
        this.renderContact(contact);
    }

    renderContact(contact) {
        const el = document.createElement('div');
        el.className = 'contact';
        el.id = `contact-${contact.id}`;
        
        // Position on sonar display
        const x = 50 + Math.cos(contact.angle) * contact.distance * 50;
        const y = 50 + Math.sin(contact.angle) * contact.distance * 50;
        
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        
        // Color based on type
        if (contact.type === 'unknown') {
            el.style.background = '#ff006e';
            el.style.boxShadow = '0 0 10px #ff006e';
        }
        
        DOM.sonarContacts.appendChild(el);
    }

    updateContacts() {
        // Age and remove old contacts
        this.contacts = this.contacts.filter(c => {
            c.age += 1;
            if (c.age > 10) {
                const el = document.getElementById(`contact-${c.id}`);
                if (el) el.remove();
                return false;
            }
            return true;
        });
        
        DOM.contactCount.textContent = this.contacts.length;
    }
}

// Bioluminescent Fauna System
class FaunaSystem {
    constructor() {
        this.specimens = [...CONFIG.fauna];
        this.activeParticles = [];
        this.initList();
        this.startParticleGeneration();
    }

    initList() {
        DOM.faunaList.innerHTML = '';
        this.specimens.forEach((specimen, index) => {
            const item = document.createElement('div');
            item.className = 'fauna-item';
            item.innerHTML = `
                <div class="fauna-icon">${specimen.icon}</div>
                <div class="fauna-info">
                    <span class="fauna-name">${specimen.name}</span>
                    <span class="fauna-depth">Depth: ${specimen.depth}</span>
                </div>
                <div class="fauna-lux">${specimen.lux.toFixed(3)} lux</div>
            `;
            
            item.addEventListener('click', () => this.focusSpecimen(index));
            DOM.faunaList.appendChild(item);
        });
        
        DOM.specimenCount.textContent = this.specimens.length.toString().padStart(2, '0');
    }

    focusSpecimen(index) {
        const specimen = this.specimens[index];
        
        // Update spectrometer
        const wavelength = 400 + (specimen.lux * 50000);
        const percent = Math.min(100, (wavelength / 700) * 100);
        DOM.spectrumFill.style.width = `${100 - percent}%`;
        
        // Update readouts
        DOM.luxValue.textContent = specimen.lux.toFixed(3);
        DOM.tempValue.textContent = specimen.temp;
        
        // Visual feedback
        const items = DOM.faunaList.querySelectorAll('.fauna-item');
        items.forEach((item, i) => {
            item.style.borderColor = i === index ? 'var(--biolum-cyan)' : '';
            item.style.background = i === index ? 'rgba(0, 245, 212, 0.2)' : '';
        });
    }

    startParticleGeneration() {
        // Create bioluminescent particles behind UI
        setInterval(() => {
            if (this.activeParticles.length < 30) {
                this.createParticle();
            }
        }, 800);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -20px;
            animation-duration: ${duration}s;
            opacity: ${Math.random() * 0.4 + 0.2};
        `;
        
        DOM.particleLayer.appendChild(particle);
        
        // Cleanup
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    update() {
        // Random fluctuations in readings
        if (Math.random() > 0.8) {
            const baseLux = 0.003;
            const variation = (Math.random() - 0.5) * 0.002;
            DOM.luxValue.textContent = Math.max(0, baseLux + variation).toFixed(3);
        }
    }
}

// Hull Integrity Monitor
class HullMonitor {
    constructor() {
        this.sectors = { ...CONFIG.hull.sectors };
        this.temperature = 2.4;
        this.fatigue = 0.03;
    }

    update() {
        // Simulate stress changes
        Object.keys(this.sectors).forEach(sector => {
            const change = (Math.random() - 0.5) * 5;
            this.sectors[sector] = Math.max(0, Math.min(100, this.sectors[sector] + change));
        });

        // Hull temperature slowly rises
        this.temperature += (Math.random() - 0.4) * 0.1;
        
        // Fatigue accumulates
        this.fatigue += 0.001;

        this.render();
    }

    render() {
        // Update stress values
        DOM.stressA.textContent = `${Math.floor(this.sectors.A)}%`;
        DOM.fillA.style.width = `${this.sectors.A}%`;
        
        DOM.stressB.textContent = `${Math.floor(this.sectors.B)}%`;
        DOM.fillB.style.width = `${this.sectors.B}%`;
        DOM.fillB.classList.toggle('warning', this.sectors.B > 60);
        
        DOM.stressC.textContent = `${Math.floor(this.sectors.C)}%`;
        DOM.fillC.style.width = `${this.sectors.C}%`;
        
        DOM.stressD.textContent = `${Math.floor(this.sectors.D)}%`;
        DOM.fillD.style.width = `${this.sectors.D}%`;

        // Update metrics
        DOM.hullTemp.textContent = `${this.temperature.toFixed(1)}°C`;
        DOM.hullFatigue.textContent = `${this.fatigue.toFixed(2)}%`;

        // Update integrity status
        const maxStress = Math.max(...Object.values(this.sectors));
        if (maxStress > 80) {
            DOM.integrityStatus.innerHTML = '<span class="status-indicator"></span><span class="status-text">CRITICAL</span>';
            DOM.integrityStatus.classList.add('critical');
        } else if (maxStress > 60) {
            DOM.integrityStatus.innerHTML = '<span class="status-indicator"></span><span class="status-text">WARNING</span>';
            DOM.integrityStatus.classList.remove('critical');
        } else {
            DOM.integrityStatus.innerHTML = '<span class="status-indicator"></span><span class="status-text">NOMINAL</span>';
            DOM.integrityStatus.classList.remove('critical');
        }

        // Update SVG stress points
        document.querySelectorAll('.stress-point').forEach(point => {
            const sector = point.dataset.sector;
            const stress = this.sectors[sector];
            
            point.classList.toggle('warning', stress > 60);
            point.style.opacity = 0.3 + (stress / 100) * 0.7;
        });
    }
}

// Zone Indicator
function updateDepthZones() {
    const zones = document.querySelectorAll('.zone');
    const depth = CONFIG.depth.current;
    
    zones.forEach(zone => {
        zone.classList.remove('active');
    });
    
    // Determine active zone based on depth
    let activeZone;
    if (depth < 200) activeZone = 'epipelagic';
    else if (depth < 1000) activeZone = 'mesopelagic';
    else if (depth < 4000) activeZone = 'bathypelagic';
    else if (depth < 6000) activeZone = 'abyssopelagic';
    else activeZone = 'hadal';
    
    const activeEl = document.querySelector(`[data-zone="${activeZone}"]`);
    if (activeEl) activeEl.classList.add('active');
}

/**
 * Initialization & Main Loop
 */

// System instances
let abyssCanvas, currentCanvas, depthPressure, sonar, fauna, hull;

function init() {
    // Initialize canvas systems
    abyssCanvas = new AbyssCanvas();
    abyssCanvas.animate();
    
    currentCanvas = new CurrentCanvas();
    currentCanvas.animate();
    
    // Initialize HUD systems
    depthPressure = new DepthPressureSystem();
    sonar = new SonarSystem();
    fauna = new FaunaSystem();
    hull = new HullMonitor();
    
    // Select first specimen
    fauna.focusSpecimen(0);
    
    // Initial zone update
    updateDepthZones();
    
    // Start update loops
    setInterval(updateTime, 1000);
    setInterval(() => depthPressure.update(), 100);
    setInterval(() => fauna.update(), 2000);
    setInterval(() => hull.update(), 3000);
    
    // Add some initial sonar contacts
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => sonar.addContact(), i * 500);
        }
    }, 2000);
    
    console.log('HADAL STATION α-09 Systems Online');
    console.log(`Current Depth: ${CONFIG.depth.current}m`);
    console.log(`External Pressure: ${CONFIG.pressure.current} ATM`);
}

// Boot sequence
document.addEventListener('DOMContentLoaded', () => {
    // Add boot delay for effect
    setTimeout(init, 500);
});

// Keyboard shortcuts for testing
document.addEventListener('keydown', (e) => {
    if (e.key === 'e') {
        // Toggle emergency
        if (State.emergency) {
            depthPressure.clearEmergency();
        } else {
            depthPressure.triggerEmergency();
        }
    }
    if (e.key === 's') {
        // Force sonar ping
        sonar.addContact();
    }
});
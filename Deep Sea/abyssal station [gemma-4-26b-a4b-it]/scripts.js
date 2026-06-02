/**
 * HADAL-OS // CORE ENGINE
 * Submersible Command Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const depthEl = document.getElementById('depth-readout');
    const tempEl = document.getElementById('temp-readout');
    const pressureEl = document.getElementById('pressure-readout');
    const integrityFill = document.querySelector('.integrity-fill');
    const integrityStatus = document.querySelector('.integrity-status');
    const faunaGrid = document.getElementById('fauna-grid');
    const sonarPingsContainer = document.getElementById('sonar-pings');
    const currentCanvas = document.getElementById('current-canvas');
    const particleContainer = document.getElementById('particle-container');
    const vBars = document.querySelectorAll('.v-bar');

    // --- CONFIGURATION & STATE ---
    const state = {
        depth: 10924.42,
        temp: 1.24,
        pressure: 1092.4,
        integrity: 98.4,
        currentX: 0,
        lastFaunaUpdate: 0,
        lastSonarPing: 0,
        lastGlitch: 0
    };

    const CONFIG = {
        particleCount: 60,
        sonarPingInterval: 3000, // ms
        faunaUpdateInterval: 8000, // ms
        glitchChance: 0.005, // per frame
        currentSpeed: 0.02
    };

    // --- SUB-SYSTEM: MARINE SNOW (PARTICLES) ---
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y > window.innerHeight) {
                this.y = -10;
                this.x = Math.random() * window.innerWidth;
            }
            if (this.x > window.innerWidth) this.x = 0;
            if (this.x < 0) this.x = window.innerWidth;
        }

        draw() {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${this.x}px`;
            p.style.top = `${this.y}px`;
            p.style.width = `${this.size}px`;
            p.style.height = `${this.size}px`;
            p.style.opacity = this.opacity;
            return p;
        }
    }

    const particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());
    
    // Initial particle creation
    particles.forEach(p => {
        const el = p.draw();
        particleContainer.appendChild(el);
        p.el = el; // Store reference
    });

    // --- SUB-SYSTEM: SONAR PINGS ---
    function createSonarPing() {
        const ping = document.createElement('div');
        ping.className = 'sonar-ping';
        
        // Random position in sonar circle
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 180; // Within 400px diameter
        const x = 200 + radius * Math.cos(angle);
        const y = 200 + radius * Math.sin(angle);

        ping.style.left = `${x}px`;
        ping.style.top = `${y}px`;
        ping.style.position = 'absolute';
        ping.style.width = '10px';
        ping.style.height = '10px';
        ping.style.border = '2px solid var(--color-ui-cyan)';
        ping.style.borderRadius = '50%';
        ping.style.transform = 'translate(-50%, -50%)';
        ping.style.animation = 'ping-expand 2s ease-out forwards';

        sonarPingsContainer.appendChild(ping);
        
        // Cleanup
        setTimeout(() => ping.remove(), 2000);
    }

    // --- SUB-SYSTEM: FAUNA TRACKING ---
    const faunaTypes = [
        "Abyssal Jelly", "Ghost Shrimp", "Viperfish", 
        "Angler Specimen", "Hatchetfish", "Dumbo Octopus",
        "Snailfish", "Gulper Eel"
    ];

    function updateFauna() {
        // Remove a random card
        if (faunaGrid.children.length > 4) {
            faunaGrid.removeChild(faunaGrid.children[Math.floor(Math.random() * faunaGrid.children.length)]);
        }

        // Add a new card
        const card = document.createElement('div');
        card.className = 'fauna-card';
        const type = faunaTypes[Math.floor(Math.random() * faunaTypes.length)];
        
        card.innerHTML = `
            <div class="fauna-icon"></div>
            <div class="fauna-info">
                <span class="fauna-name">${type}</span>
                <span class="fauna-signal">SIGNAL: DETECTED</span>
            </div>
        `;
        faunaGrid.appendChild(card);
    }

    // --- SUB-SYSTEM: CURRENT FLOW (CANVAS) ---
    const ctx = currentCanvas.getContext('2d');
    function drawCurrent() {
        const w = currentCanvas.width = currentCanvas.offsetWidth;
        const h = currentCanvas.height = currentCanvas.offsetHeight;
        
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.3)';
        ctx.lineWidth = 1;

        state.currentX += CONFIG.currentSpeed;

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            const offset = i * 10;
            ctx.moveTo(0, offset);
            for (let x = 0; x < w; x++) {
                const y = Math.sin(x * 0.02 + state.currentX + i) * 5 + offset;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    // --- CORE ANIMATION LOOP ---
    function animate(time) {
        // 1. Update Particles
        particles.forEach(p => {
            p.update();
            p.el.style.left = `${p.x}px`;
            p.el.style.top = `${p.y}px`;
        });

        // 2. Update Sensor Data (Fluctuations)
        state.depth += (Math.random() - 0.5) * 0.05;
        state.temp += (Math.random() - 0.5) * 0.001;
        state.pressure = state.depth * 0.109; // Simplified physics
        
        depthEl.textContent = state.depth.toFixed(1);
        tempEl.textContent = state.temp.toFixed(2);
        pressureEl.textContent = state.pressure.toFixed(1);

        // 3. Integrity Management
        if (state.integrity < 100) {
            state.integrity -= 0.0001; // Very slow decay
            integrityFill.style.width = `${state.integrity}%`;
            integrityStatus.textContent = `${state.integrity.toFixed(1)}%`;
        }

        // 4. Sonar Logic
        if (time - state.lastSonarPing > CONFIG.sonarPingInterval) {
            createSonarPing();
            state.lastSonarPing = time;
        }

        // 5. Fauna Logic
        if (time - state.lastFaunaUpdate > CONFIG.faunaUpdateInterval) {
            updateFauna();
            state.lastFaunaUpdate = time;
        }

        // 6. Glitch Effect
        if (Math.random() < CONFIG.glitchChance) {
            triggerGlitch();
        }

        // 7. Audio Visualizer
        vBars.forEach(bar => {
            const h = Math.random() * 25 + 5;
            bar.style.height = `${h}px`;
        });

        // 8. Draw Canvas
        drawCurrent();

        requestAnimationFrame(animate);
    }

    function triggerGlitch() {
        const identity = document.querySelector('.glitch-text');
        const originalText = identity.getAttribute('data-text');
        identity.textContent = "ERR_SYS_CRIT";
        identity.style.color = "var(--color-ui-red)";
        
        setTimeout(() => {
            identity.textContent = "STATION: ABYSS-07";
            identity.style.color = "var(--color-ui-cyan)";
        }, 150);
    }

    // Start Engine
    requestAnimationFrame(animate);
});

/** 
 * CSS Injection for dynamic elements 
 * (Since we can't edit CSS file mid-runtime, we inject the sonar ping animation)
 */
const style = document.createElement('style');
style.innerHTML = `
    @keyframes ping-expand {
        0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);
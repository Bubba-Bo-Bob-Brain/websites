document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // CONFIGURATION & STATE
    // =========================================
    const state = {
        velocity: 0.00,
        shieldIntegrity: 100,
        reactorTemp: 4200,
        coords: { x: 442, y: 991 },
        isWarping: false,
        targetLocked: false
    };

    // DOM Elements
    const elements = {
        clock: document.getElementById('clock'),
        date: document.getElementById('date'),
        velocity: document.getElementById('velocity-val'),
        coords: document.getElementById('coords-val'),
        shieldPercent: document.getElementById('shield-percent'),
        shieldFill: document.querySelector('.shield-fill'),
        reactorTemp: document.getElementById('reactor-temp'),
        hullInt: document.getElementById('hull-int'),
        commsWave: document.getElementById('comms-wave'),
        fireBtn: document.getElementById('fire-btn'),
        warpBtn: document.querySelector('[data-action="warp"]'),
        starfield: document.getElementById('starfield'),
        gridFloor: document.querySelector('.grid-floor')
    };

    // =========================================
    // UTILITIES
    // =========================================
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(random(min, max));
    const formatNum = (num) => num.toFixed(2);

    // =========================================
    // CLOCK & DATE
    // =========================================
    function updateClock() {
        const now = new Date();
        elements.clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
        elements.date.textContent = now.toISOString().split('T')[0];
    }
    setInterval(updateClock, 1000);
    updateClock();

    // =========================================
    // DATA STREAM SIMULATION (Navigation & Engineering)
    // =========================================
    function simulateData() {
        // Velocity fluctuation
        const baseSpeed = state.isWarping ? 2.5 : 0.4;
        const fluctuation = random(-0.05, 0.05);
        state.velocity = baseSpeed + fluctuation;
        elements.velocity.textContent = `${formatNum(state.velocity)}c`;

        // Coordinates drift
        state.coords.x += randomInt(-2, 2);
        state.coords.y += randomInt(-2, 2);
        elements.coords.textContent = `X:${state.coords.x} Y:${state.coords.y}`;

        // Reactor Temp fluctuation
        const tempFluct = randomInt(-10, 10);
        state.reactorTemp += tempFluct;
        // Keep within bounds
        if (state.reactorTemp > 4500) state.reactorTemp = 4500;
        if (state.reactorTemp < 3800) state.reactorTemp = 3800;
        elements.reactorTemp.textContent = `${state.reactorTemp.toLocaleString()} K`;

        // Hull Integrity (rarely changes unless damaged)
        if (Math.random() > 0.98) {
            state.shieldIntegrity = Math.max(0, state.shieldIntegrity - 1);
            updateShieldUI();
        }
    }
    setInterval(simulateData, 500);

    // =========================================
    // SHIELD UI UPDATE
    // =========================================
    function updateShieldUI() {
        elements.shieldPercent.textContent = `${state.shieldIntegrity}%`;
        // SVG Circle Circumference is approx 283 (2 * pi * 45)
        const offset = 283 - (283 * state.shieldIntegrity) / 100;
        elements.shieldFill.style.strokeDashoffset = offset;
        
        // Color shift based on health
        if (state.shieldIntegrity > 60) {
            elements.shieldFill.style.stroke = 'var(--neon-cyan)';
            elements.shieldFill.style.filter = 'drop-shadow(0 0 5px var(--neon-cyan))';
        } else if (state.shieldIntegrity > 30) {
            elements.shieldFill.style.stroke = 'var(--neon-yellow)';
            elements.shieldFill.style.filter = 'drop-shadow(0 0 5px var(--neon-yellow))';
        } else {
            elements.shieldFill.style.stroke = 'var(--neon-red)';
            elements.shieldFill.style.filter = 'drop-shadow(0 0 10px var(--neon-red))';
        }
    }

    // =========================================
    // COMMS FREQUENCY VISUALIZER
    // =========================================
    function initCommsWave() {
        const barCount = 20;
        const container = elements.commsWave;
        
        // Create bars
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'freq-bar';
            bar.style.height = '10%';
            bar.style.animationDuration = `${random(0.2, 0.8)}s`;
            bar.style.animationDelay = `${random(0, 0.5)}s`;
            container.appendChild(bar);
        }

        // Animate heights randomly
        setInterval(() => {
            const bars = container.querySelectorAll('.freq-bar');
            bars.forEach(bar => {
                if (Math.random() > 0.3) {
                    bar.style.height = `${random(10, 100)}%`;
                }
            });
        }, 100);
    }

    // =========================================
    // STARFIELD PARTICLE SYSTEM
    // =========================================
    function initStarfield() {
        const count = 200;
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const x = random(0, 100);
            const y = random(0, 100);
            const size = random(1, 3);
            const duration = random(2, 10);
            const delay = random(0, 5);

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = Math.random() > 0.5 ? '#fff' : '#aaddff';
            star.style.boxShadow = `0 0 ${size * 2}px #fff`;
            
            // Simple CSS animation for twinkling
            star.style.animation = `pulse ${duration}s infinite ${delay}s`;
            
            fragment.appendChild(star);
        }
        elements.starfield.appendChild(fragment);
    }

    // =========================================
    // INTERACTIVITY
    // =========================================
    
    // Fire Button Effect
    elements.fireBtn.addEventListener('click', () => {
        // Visual feedback
        elements.fireBtn.textContent = 'FIRING...';
        elements.fireBtn.style.background = 'var(--neon-red)';
        elements.fireBtn.style.color = '#fff';
        
        // Shake effect on body
        document.body.style.transform = 'translate(2px, 2px)';
        setTimeout(() => document.body.style.transform = 'translate(-2px, -2px)', 50);
        setTimeout(() => document.body.style.transform = 'translate(2px, -2px)', 100);
        setTimeout(() => document.body.style.transform = 'translate(0, 0)', 150);

        // Reset
        setTimeout(() => {
            elements.fireBtn.textContent = 'FIRE';
            elements.fireBtn.style.background = 'transparent';
            elements.fireBtn.style.color = 'var(--neon-red)';
            
            // Damage shields slightly on fire (simulated recoil)
            state.shieldIntegrity = Math.max(0, state.shieldIntegrity - 2);
            updateShieldUI();
        }, 500);
    });

    // Warp Button Effect
    elements.warpBtn.addEventListener('click', () => {
        state.isWarping = !state.isWarping;
        const btn = elements.warpBtn;
        
        if (state.isWarping) {
            btn.textContent = 'DISENGAGE WARP';
            btn.style.borderColor = 'var(--neon-yellow)';
            btn.style.color = 'var(--neon-yellow)';
            btn.style.boxShadow = '0 0 15px var(--neon-yellow)';
            
            // Speed up grid
            elements.gridFloor.style.animationDuration = '0.2s';
            elements.gridFloor.style.backgroundSize = '100% 100%, 20px 20px, 20px 20px';
        } else {
            btn.textContent = 'ENGAGE WARP';
            btn.style.borderColor = 'var(--neon-cyan)';
            btn.style.color = 'var(--neon-cyan)';
            btn.style.boxShadow = '0 0 5px var(--neon-cyan)';
            
            // Slow down grid
            elements.gridFloor.style.animationDuration = '2s';
            elements.gridFloor.style.backgroundSize = '100% 100%, 100px 100px, 100px 100px';
        }
    });

    // =========================================
    // INITIALIZATION
    // =========================================
    initCommsWave();
    initStarfield();
    updateShieldUI();
});
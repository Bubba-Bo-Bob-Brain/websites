/* -------------------------------------------------------------------------- */
/* BIOPUNK HUD // SYSTEM SCRIPTS */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const state = {
        bpm: 72,
        targetBpm: 72,
        mutation: 12.4,
        toxins: {
            heavyMetals: 0.45,
            neuroVirus: 0.12
        },
        neuralIntegrity: 98.4,
        naniteCount: 1402,
        naniteEfficiency: 87
    };

    const elements = {
        bpm: document.getElementById('bpm-display'),
        bp: document.getElementById('bp-display'),
        mutationVal: document.getElementById('mutation-val'),
        mutationBar: document.querySelector('.bar-fill.mutation'),
        neuralIntegrity: document.getElementById('neural-integrity'),
        toxin1: document.getElementById('toxin-1'),
        toxin2: document.getElementById('toxin-2'),
        naniteCount: document.getElementById('nanite-count'),
        naniteEff: document.getElementById('nanite-eff'),
        sessionCode: document.getElementById('session-code'),
        log: document.getElementById('system-log'),
        organFills: document.querySelectorAll('.status-bar .fill'),
        organPercents: document.querySelectorAll('.organ-row .percent'),
        matrixBars: document.querySelectorAll('.m-bar')
    };

    // --- UTILITIES ---
    const random = (min, max) => Math.random() * (max - min) + min;
    const formatNum = (num, decimals = 1) => num.toFixed(decimals);
    const getRandomInt = (min, max) => Math.floor(random(min, max));

    // Generate random session ID
    elements.sessionCode.textContent = `SES-${getRandomInt(1000, 9999)}-X`;

    // --- ECG CANVAS RENDERER ---
    const canvas = document.getElementById('ecg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let dataPoints = [];
    const maxPoints = 200; // Resolution of the graph
    let heartBeatTimer = 0;
    let isBeating = false;

    function resizeCanvas() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        dataPoints = new Array(maxPoints).fill(height / 2);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawECG() {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00f0ff';

        // Shift points
        dataPoints.shift();
        
        // Base line noise
        let newValue = height / 2 + random(-2, 2);

        // Heartbeat logic
        heartBeatTimer++;
        if (heartBeatTimer > (60000 / state.bpm) / 16) { // Approximate frames per beat
            isBeating = true;
            heartBeatTimer = 0;
        }

        if (isBeating) {
            // P-Q-R-S-T Wave Simulation
            const beatProgress = heartBeatTimer;
            if (beatProgress < 5) newValue = height / 2 - 5; // P wave
            else if (beatProgress < 10) newValue = height / 2 + 2; // Q dip
            else if (beatProgress < 15) newValue = height / 2 - 40; // R spike (The big one)
            else if (beatProgress < 20) newValue = height / 2 + 10; // S dip
            else if (beatProgress < 30) newValue = height / 2 - 8; // T wave
            else {
                isBeating = false;
                heartBeatTimer = 0;
            }
        }

        dataPoints.push(newValue);

        // Draw line
        for (let i = 0; i < dataPoints.length; i++) {
            const x = (width / maxPoints) * i;
            const y = dataPoints[i];
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw glow at the leading edge
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(width - 5, dataPoints[dataPoints.length-1] - 2, 5, 4);

        requestAnimationFrame(drawECG);
    }

    // --- NANITE SWARM VISUALIZER ---
    const swarmContainer = document.getElementById('swarm-container');
    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = random(0, 100);
            this.y = random(0, 100);
            this.vx = random(-0.5, 0.5);
            this.vy = random(-0.5, 0.5);
            this.size = random(1, 3);
            this.life = random(0, 100);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;

            // Attraction to center
            const dx = 50 - this.x;
            const dy = 50 - this.y;
            this.vx += dx * 0.001;
            this.vy += dy * 0.001;

            // Damping
            this.vx *= 0.95;
            this.vy *= 0.95;

            if (this.life <= 0 || this.x < 0 || this.x > 100 || this.y < 0 || this.y > 100) {
                this.reset();
                this.life = 100;
            }
        }
        draw() {
            const el = document.createElement('div');
            el.className = 'swarm-particle';
            el.style.left = `${this.x}%`;
            el.style.top = `${this.y}%`;
            el.style.width = `${this.size}px`;
            el.style.height = `${this.size}px`;
            return el;
        }
    }

    function initSwarm() {
        swarmContainer.innerHTML = '';
        for(let i=0; i<particleCount; i++) {
            particles.push(new Particle());
        }
        animateSwarm();
    }

    function animateSwarm() {
        swarmContainer.innerHTML = '';
        particles.forEach(p => {
            p.update();
            swarmContainer.appendChild(p.draw());
        });
        requestAnimationFrame(animateSwarm);
    }

    // --- DATA UPDATER LOOP ---
    function updateData() {
        // Fluctuate BPM
        if (Math.random() > 0.7) {
            state.targetBpm = getRandomInt(60, 100);
        }
        state.bpm += (state.targetBpm - state.bpm) * 0.1;
        elements.bpm.textContent = Math.floor(state.bpm);

        // Fluctuate Blood Pressure
        const sys = getRandomInt(110, 130);
        const dia = getRandomInt(70, 85);
        elements.bp.textContent = `${sys}/${dia}`;

        // Mutation Progression (Slowly increasing with spikes)
        if (Math.random() > 0.8) {
            state.mutation += random(0.1, 0.5);
            if (state.mutation > 100) state.mutation = 100;
        }
        elements.mutationVal.textContent = `${formatNum(state.mutation)}%`;
        elements.mutationBar.style.width = `${state.mutation}%`;

        // Neural Integrity (Inverse to mutation)
        state.neuralIntegrity = 100 - (state.mutation * 0.8) + random(-1, 1);
        if (state.neuralIntegrity > 100) state.neuralIntegrity = 100;
        if (state.neuralIntegrity < 0) state.neuralIntegrity = 0;
        elements.neuralIntegrity.textContent = `${formatNum(state.neuralIntegrity)}%`;

        // Toxins
        state.toxins.heavyMetals += random(-0.01, 0.02);
        state.toxins.neuroVirus += random(-0.005, 0.01);
        elements.toxin1.textContent = `${formatNum(Math.max(0, state.toxins.heavyMetals), 2)} mg/L`;
        elements.toxin2.textContent = `${formatNum(Math.max(0, state.toxins.neuroVirus), 2)} mg/L`;

        // Nanites
        state.naniteCount += getRandomInt(-5, 10);
        state.naniteEfficiency = Math.min(100, Math.max(0, state.naniteEfficiency + getRandomInt(-2, 2)));
        elements.naniteCount.textContent = state.naniteCount;
        elements.naniteEff.textContent = `${state.naniteEfficiency}%`;

        // Organ Breathing Effect (Visual only)
        elements.organFills.forEach((fill, index) => {
            const baseWidth = parseFloat(fill.style.width) || 50;
            const breathe = Math.sin(Date.now() / 1000 + index) * 2;
            // Only update if not critically low/high to show "breathing"
            if (baseWidth > 5 && baseWidth < 95) {
                // We don't overwrite the style directly here to avoid conflict with CSS transitions
                // Instead, we rely on the CSS transition and occasional JS updates for big changes
            }
        });
    }

    // --- SYSTEM LOG ---
    const logMessages = [
        "Scanning tissue density...",
        "Nanite cluster 4 offline.",
        "Toxin levels rising in sector 7.",
        "Neural link fluctuation detected.",
        "Administering stabilizer compound.",
        "Mutation rate accelerating.",
        "Heartbeat irregular.",
        "Syncing with central database...",
        "Warning: Cellular decay detected.",
        "Rerouting power to life support."
    ];

    function addLogEntry() {
        if (Math.random() > 0.7) {
            const msg = logMessages[getRandomInt(0, logMessages.length)];
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = msg;
            elements.log.prepend(entry);
            
            if (elements.log.children.length > 8) {
                elements.log.lastElementChild.remove();
            }
        }
    }

    // --- GENE MATRIX ANIMATION ---
    function updateGeneMatrix() {
        elements.matrixBars.forEach(bar => {
            if (Math.random() > 0.8) {
                bar.style.height = `${getRandomInt(10, 90)}%`;
                // Color shift based on height
                const h = parseInt(bar.style.height);
                if (h > 70) bar.style.backgroundColor = 'var(--color-primary)';
                else if (h > 40) bar.style.backgroundColor = 'var(--color-secondary)';
                else bar.style.backgroundColor = 'var(--color-accent)';
            }
        });
    }

    // --- INITIALIZATION ---
    initSwarm();
    drawECG();
    
    // Timers
    setInterval(updateData, 1000); // Main data update every second
    setInterval(addLogEntry, 2000); // Log update every 2 seconds
    setInterval(updateGeneMatrix, 500); // Gene matrix fast update
    
    // Clock
    setInterval(() => {
        const now = new Date();
        elements.sessionCode.parentElement.previousElementSibling.textContent = now.toLocaleTimeString();
    }, 1000);

    // Initial call to set values
    updateData();
});
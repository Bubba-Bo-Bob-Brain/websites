/**
 * BIO-OS // NEURAL-LINK INTERFACE
 * Core Engine: Biological Data & Visual Synthesis
 */

document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});

function initSystem() {
    // 1. Initialization of DOM elements
    const clockEl = document.getElementById('clock');
    const heartbeatCanvas = document.getElementById('heartbeat-canvas');
    const nanoCanvas = document.getElementById('nanomachine-canvas');
    const mutationGraphDiv = document.getElementById('mutation-graph');
    const neuralRing = document.querySelector('.ring-progress');
    const neuralPercent = document.querySelector('.neural-percentage');
    const toxinValue = document.querySelector('.toxin-value');
    const alertBox = document.getElementById('alert-box');
    const alertText = alertBox.querySelector('.alert-text');

    // 2. Setup Canvases
    const hbCtx = heartbeatCanvas.getContext('2d');
    const nanoCtx = nanoCanvas.getContext('2d');
    
    // Create Mutation Canvas
    const mutCanvas = document.createElement('canvas');
    mutCanvas.style.width = '100%';
    mutCanvas.style.height = '100%';
    mutationGraphDiv.appendChild(mutCanvas);
    const mutCtx = mutCanvas.getContext('2d');

    // Resize handling
    function resize() {
        heartbeatCanvas.width = heartbeatCanvas.offsetWidth;
        heartbeatCanvas.height = heartbeatCanvas.offsetHeight;
        nanoCanvas.width = nanoCanvas.offsetWidth;
        nanoCanvas.height = nanoCanvas.offsetHeight;
        mutCanvas.width = mutCanvas.offsetWidth;
        mutCanvas.height = mutCanvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 3. Data States
    const state = {
        time: 0,
        heartbeat: {
            points: [],
            phase: 0,
            amplitude: 40
        },
        nanomachines: [],
        mutationData: [],
        organStats: [
            { name: 'HEART', level: 92, element: document.querySelectorAll('.organ-item')[0].querySelector('.org-bar') },
            { name: 'LUNGS', level: 45, element: document.querySelectorAll('.organ-item')[1].querySelector('.org-bar') },
            { name: 'LIVER', level: 12, element: document.querySelectorAll('.organ-item')[2].querySelector('.org-bar') },
            { name: 'KIDNEYS', level: 78, element: document.querySelectorAll('.organ-item')[3].querySelector('.org-bar') }
        ],
        toxinLevel: 0.02,
        neuralIntegrity: 88,
        mutationDrift: 64
    };

    // 4. Nanomachine Particle Class
    class Nanomachine {
        constructor(w, h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random();
        }
        update(w, h) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
            this.alpha += (Math.random() - 0.5) * 0.05;
            if (this.alpha < 0.1) this.alpha = 0.1;
            if (this.alpha > 1) this.alpha = 1;
        }
        draw(ctx) {
            ctx.fillStyle = `rgba(204, 255, 0, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Populate Nanomachines
    for (let i = 0; i < 120; i++) {
        state.nanomachines.push(new Nanomachine(nanoCanvas.width, nanoCanvas.height));
    }

    // 5. Animation Loops

    // Clock Update
    setInterval(() => {
        const now = new Date();
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        const sec = String(now.getSeconds()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const hr = String(now.getHours()).padStart(2, '0');
        clockEl.innerText = `${hr}:${min}:${sec}:${ms}`;
    }, 10);

    // Biological Data Fluctuation (Every 3 seconds)
    setInterval(() => {
        // Update Organs
        state.organStats.forEach(org => {
            const drift = (Math.random() - 0.5) * 5;
            org.level = Math.max(5, Math.min(100, org.level + drift));
            org.element.style.width = `${org.level}%`;
            
            // Color shift for danger
            if (org.level < 20) org.element.style.background = 'var(--color-accent-danger)';
            else org.element.style.background = 'linear-gradient(90deg, var(--color-accent-crimson), var(--color-accent-bio))';
        });

        // Update Toxin
        state.toxinLevel = Math.max(0.01, Math.min(99, state.toxinLevel + (Math.random() - 0.5) * 2));
        toxinValue.innerText = `${state.toxinLevel.toFixed(2)}%`;

        // Update Neural
        state.neuralIntegrity = Math.max(40, Math.min(100, state.neuralIntegrity + (Math.random() - 0.5) * 4));
        neuralPercent.innerText = `${Math.round(state.neuralIntegrity)}%`;
        
        // Update Neural Ring (SVG stroke-dashoffset)
        // Circumference is ~283
        const offset = 283 - (283 * state.neuralIntegrity / 100);
        neuralRing.style.strokeDashoffset = offset;

        // Update Mutation Graph Data
        state.mutationDrift = Math.max(10, Math.min(100, state.mutationDrift + (Math.random() - 0.5) * 10));
        state.mutationData.push(state.mutationDrift);
        if (state.mutationData.length > 100) state.mutationData.shift();

        // System Alert Logic
        if (state.toxinLevel > 50 || state.organStats.some(o => o.level < 15)) {
            alertText.innerText = "CRITICAL_INSTABILITY_DETECTED";
            alertText.style.color = "var(--color-accent-danger)";
            document.body.style.filter = "contrast(1.2) saturate(1.5)";
        } else {
            alertText.innerText = "SYSTEM_STABLE";
            alertText.style.color = "var(--color-accent-bio)";
            document.body.style.filter = "none";
        }

    }, 2000);

    // Main Render Loop
    function render(t) {
        state.time = t;

        // --- 1. DRAW HEARTBEAT (EKG) ---
        hbCtx.clearRect(0, 0, heartbeatCanvas.width, heartbeatCanvas.height);
        hbCtx.strokeStyle = 'var(--color-accent-crimson)';
        hbCtx.lineWidth = 2;
        hbCtx.beginPath();
        
        const centerY = heartbeatCanvas.height / 2;
        const step = 2;
        
        for (let x = 0; x < heartbeatCanvas.width; x += step) {
            // Create a rhythmic wave + periodic spikes
            let y = centerY + Math.sin(x * 0.05 + t * 0.01) * 10;
            
            // The "Spike" logic (Heartbeat pulse)
            const pulseCycle = (t * 0.005) % 10; 
            if (pulseCycle > 8 && pulseCycle < 8.5) {
                // High frequency spike
                const spike = Math.sin((x % 20) * 0.5) * 30;
                y -= spike;
            } else if (pulseCycle > 8.5 && pulseCycle < 8.7) {
                // T-wave (smaller bump)
                y -= 5;
            }

            if (x === 0) hbCtx.moveTo(x, y);
            else hbCtx.lineTo(x, y);
        }
        hbCtx.stroke();

        // --- 2. DRAW NANOMACHINES ---
        nanoCtx.clearRect(0, 0, nanoCanvas.width, nanoCanvas.height);
        state.nanomachines.forEach(n => {
            n.update(nanoCanvas.width, nanoCanvas.height);
            n.draw(nanoCtx);
        });

        // --- 3. DRAW MUTATION GRAPH ---
        mutCtx.clearRect(0, 0, mutCanvas.width, mutCanvas.height);
        mutCtx.strokeStyle = 'var(--color-accent-bio)';
        mutCtx.lineWidth = 1;
        mutCtx.beginPath();
        const graphPadding = 10;
        const graphWidth = mutCanvas.width;
        const graphHeight = mutCanvas.height;

        state.mutationData.forEach((val, i) => {
            const x = (i / 100) * graphWidth;
            const y = graphHeight - ((val / 100) * graphHeight);
            if (i === 0) mutCtx.moveTo(x, y);
            else mutCtx.lineTo(x, y);
        });
        mutCtx.stroke();
        
        // Add a slight glow to the graph
        mutCtx.shadowBlur = 10;
        mutCtx.shadowColor = 'rgba(204, 255, 0, 0.5)';

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CONFIG = {
        heartbeatBase: 1200, // ms
        heartbeatVariance: 300,
        logInterval: 4000,
        metricInterval: 2000,
        naniteCount: 60
    };

    // --- DOM Elements ---
    const clockEl = document.getElementById('clock');
    const logFeed = document.getElementById('log-feed');
    const heartBar = document.querySelector('.bar-fill:not(.danger):not(.warning)');
    const cortisolBar = document.querySelector('.bar-fill.danger');
    const o2Bar = document.querySelector('.bar-fill.warning');
    const heartVal = heartBar.parentElement.nextElementSibling;
    const cortisolVal = cortisolBar.parentElement.nextElementSibling;
    const o2Val = o2Bar.parentElement.nextElementSibling;
    const matrixCells = document.querySelectorAll('.matrix-cell');
    const naniteCanvas = document.getElementById('nanite-canvas');
    const ctx = naniteCanvas.getContext('2d');

    // --- 1. Clock System ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toISOString().split('T')[1].split('.')[0];
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        clockEl.textContent = `${timeString}:${ms}`;
        requestAnimationFrame(updateClock);
    }
    updateClock();

    // --- 2. Dynamic Metrics Simulation ---
    function fluctuateMetrics() {
        // Heart Rate (120 - 180 BPM)
        const hr = Math.floor(Math.random() * (180 - 120 + 1) + 120);
        const hrPercent = Math.min(100, (hr / 200) * 100);
        heartBar.style.width = `${hrPercent}%`;
        heartVal.innerHTML = `${hr} <span class="unit">BPM</span>`;

        // Cortisol (High fluctuation)
        const cortisol = Math.floor(Math.random() * (95 - 85 + 1) + 85);
        cortisolBar.style.width = `${cortisol}%`;
        cortisolVal.textContent = "CRITICAL";

        // O2 (Fluctuating dangerously)
        const o2 = Math.floor(Math.random() * (92 - 82 + 1) + 82);
        const o2Percent = (o2 / 100) * 100;
        o2Bar.style.width = `${o2Percent}%`;
        o2Val.innerHTML = `${o2}% <span class="unit">[LOW]</span>`;

        // Randomly change heartbeat speed class for CSS animation
        const speed = Math.random() * 0.5 + 0.8; // 0.8s to 1.3s
        document.documentElement.style.setProperty('--heartbeat-speed', `${speed}s`);
    }

    setInterval(fluctuateMetrics, CONFIG.metricInterval);
    fluctuateMetrics(); // Initial call

    // --- 3. Gene Splice Matrix Logic ---
    function randomizeMatrix() {
        matrixCells.forEach(cell => {
            const isActive = Math.random() > 0.4;
            const isError = !isActive && Math.random() > 0.7;
            
            cell.classList.remove('active', 'error');
            if (isActive) cell.classList.add('active');
            else if (isError) cell.classList.add('error');
        });
    }
    setInterval(randomizeMatrix, 1500);

    // --- 4. System Log Generator ---
    const logMessages = [
        { type: 'info', msg: 'NEURAL HANDSHAKE RE-ESTABLISHED' },
        { type: 'warning', msg: 'TEMPORARY LATENCY DETECTED IN SPINAL CORTEX' },
        { type: 'error', msg: 'ORGAN REJECTION: LIVER ENZYMES SPiking' },
        { type: 'info', msg: 'NANITE SWARM RECALIBRATING' },
        { type: 'warning', msg: 'BLOOD PRESSURE CRITICAL' },
        { type: 'error', msg: 'SYNAPSE MISFIRE DETECTED SECTOR 7' },
        { type: 'info', msg: 'AUTO-INJECTOR: EPINEPHRINE ADMINISTERED' },
        { type: 'warning', msg: 'EXTERNAL INTERFERENCE BLOCKED' }
    ];

    function addLogEntry() {
        const entry = logMessages[Math.floor(Math.random() * logMessages.length)];
        const now = new Date().toISOString().split('T')[1].split('.')[0];
        
        const div = document.createElement('div');
        div.className = `log-entry ${entry.type}`;
        div.innerHTML = `<span class="time">${now}</span><span class="msg">${entry.msg}</span>`;
        
        logFeed.appendChild(div);
        
        // Auto scroll to bottom
        logFeed.scrollTop = logFeed.scrollHeight;

        // Keep log size manageable
        if (logFeed.children.length > 20) {
            logFeed.removeChild(logFeed.children[0]);
        }
    }
    setInterval(addLogEntry, CONFIG.logInterval);

    // --- 5. Nanomachine Swarm Visualizer ---
    let width, height;
    let particles = [];
    
    // Resize handler
    function resizeCanvas() {
        const container = naniteCanvas.parentElement;
        width = container.clientWidth;
        height = container.clientHeight;
        naniteCanvas.width = width;
        naniteCanvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Nanite {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
            this.life = Math.random() * 100;
            this.maxLife = 100 + Math.random() * 50;
            this.color = Math.random() > 0.9 ? '#ff003c' : '#00ff41'; // Red for danger, Green for normal
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;

            // Bounce off walls
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Randomly change direction occasionally (swarm behavior)
            if (Math.random() < 0.02) {
                this.vx += (Math.random() - 0.5);
                this.vy += (Math.random() - 0.5);
                // Clamp speed
                const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
                if (speed > 2) {
                    this.vx = (this.vx / speed) * 2;
                    this.vy = (this.vy / speed) * 2;
                }
            }

            if (this.life > this.maxLife) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.6;
            ctx.fill();
            
            // Draw connection lines if close to other particles (simulating swarm logic)
            // Only doing a few checks for performance
            if (Math.random() > 0.95) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.vx * 10, this.y + this.vy * 10);
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = 0.2;
                ctx.stroke();
            }
        }
    }

    // Initialize particles
    for (let i = 0; i < CONFIG.naniteCount; i++) {
        particles.push(new Nanite());
    }

    function animateNanites() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateNanites);
    }
    animateNanites();

    // --- 6. Interactive Buttons ---
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const originalText = e.target.textContent;
            e.target.textContent = "PROCESSING...";
            e.target.disabled = true;
            
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.disabled = false;
                addLogEntry(); // Trigger a log entry on interaction
            }, 1000);
        });
    });
});
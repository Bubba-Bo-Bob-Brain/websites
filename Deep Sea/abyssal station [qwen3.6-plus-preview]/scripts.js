/**
 * ABYSSAL-7 DEEP-SEA RESEARCH DASHBOARD
 * Primary Operations Interface Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialization ---
    initRivets();
    initParticles();
    initCurrents();
    initSonar();
    initPressureChart();
    initHullGauge();
    initFaunaSignals();
    startMissionClock();
    startDataSimulation();
    startSystemLog();
});

/* =========================================
   UTILITIES
   ========================================= */
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

/* =========================================
   RIVET GENERATOR
   ========================================= */
function initRivets() {
    const container = document.getElementById('rivetsContainer');
    const corners = [
        { cls: 'tl', top: 12, left: 12 },
        { cls: 'tr', top: 12, right: 12 },
        { cls: 'bl', bottom: 12, left: 12 },
        { cls: 'br', bottom: 12, right: 12 }
    ];

    corners.forEach(c => {
        const rivet = document.createElement('div');
        rivet.className = `rivet ${c.cls}`;
        container.appendChild(rivet);
    });
}

/* =========================================
   BIOLUMINESCENT PARTICLES
   ========================================= */
let particles = [];
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const colors = ['#00e5ff', '#00ff9d', '#ff2a6d', '#ffb300'];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = rand(0, canvas.width);
            this.y = rand(0, canvas.height);
            this.vx = rand(-0.15, 0.15);
            this.vy = rand(-0.25, -0.05); // Drift upwards
            this.radius = rand(1, 3.5);
            this.alpha = rand(0.1, 0.6);
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = rand(200, 600);
            this.age = 0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.age++;

            // Gentle sine wave drift
            this.x += Math.sin(this.age * 0.02) * 0.05;

            if (this.age > this.life || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha * (1 - this.age / this.life);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.radius * 4;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   UNDERWATER CURRENTS (VIEWPORT)
   ========================================= */
function initCurrents() {
    const canvas = document.getElementById('currentCanvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const flowLines = [];
    const numLines = 25;

    class FlowLine {
        constructor() {
            this.x = rand(0, canvas.width);
            this.y = rand(0, canvas.height);
            this.length = rand(30, 80);
            this.speed = rand(0.5, 1.5);
            this.angle = rand(0.1, 0.3);
            this.alpha = rand(0.05, 0.15);
            this.color = Math.random() > 0.5 ? '#00e5ff' : '#0077ff';
            this.reset();
        }

        reset() {
            this.x = -50;
            this.y = rand(0, canvas.height);
            this.length = rand(30, 80);
            this.speed = rand(0.5, 1.5);
        }

        update() {
            this.x += this.speed + Math.sin(this.x * 0.01) * 0.5;
            this.y += this.angle * 2 + Math.cos(this.x * 0.005);

            if (this.x > canvas.width + 50 || this.y > canvas.height + 50 || this.y < -50) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            ctx.stroke();
            ctx.restore();
        }
    }

    for (let i = 0; i < numLines; i++) {
        flowLines.push(new FlowLine());
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 5, 10, 0.25)'; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flowLines.forEach(l => {
            l.update();
            l.draw(ctx);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   SONAR DISPLAY
   ========================================= */
function initSonar() {
    const canvas = document.getElementById('sonarCanvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let angle = 0;
    const blips = [];
    const numBlips = 15;

    class SonarBlip {
        constructor() {
            this.reset();
        }
        reset() {
            const dist = rand(30, Math.min(canvas.width, canvas.height) * 0.45);
            const a = rand(0, Math.PI * 2);
            this.x = canvas.width / 2 + Math.cos(a) * dist;
            this.y = canvas.height / 2 + Math.sin(a) * dist;
            this.alpha = 0;
            this.maxAlpha = rand(0.5, 1);
            this.decay = rand(0.005, 0.015);
            this.active = false;
        }
        update() {
            if (this.active) {
                this.alpha += this.decay * 4;
                if (this.alpha >= this.maxAlpha) this.alpha = this.maxAlpha;
            } else {
                this.alpha -= this.decay;
                if (this.alpha <= 0) {
                    this.alpha = 0;
                    this.active = false;
                    setTimeout(() => {
                        this.reset();
                        this.active = true;
                    }, rand(1000, 4000));
                }
            }
        }
        draw(ctx, sweepAngle) {
            if (this.alpha <= 0) return;
            ctx.save();
            ctx.fillStyle = '#00e5ff';
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#00e5ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < numBlips; i++) {
        blips.push(new SonarBlip());
    }

    function animate() {
        // Fade background
        ctx.fillStyle = 'rgba(0, 10, 18, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxR = Math.min(cx, cy) - 10;

        // Draw rings
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, maxR * (i / 4), 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw sweep
        const sweepX = cx + Math.cos(angle) * maxR;
        const sweepY = cy + Math.sin(angle) * maxR;
        
        const grad = ctx.createConicGradient(angle, cx, cy);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.0)');
        grad.addColorStop(0.75, 'rgba(0, 229, 255, 0.0)');
        grad.addColorStop(0.95, 'rgba(0, 229, 255, 0.25)');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();

        // Draw blips
        blips.forEach(b => {
            b.update();
            b.draw(ctx, angle);
        });

        // Center dot
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        angle += 0.015;
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   PRESSURE CHART
   ========================================= */
function initPressureChart() {
    const canvas = document.getElementById('pressureChart');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const dataPoints = [];
    const maxPoints = 60;
    for (let i = 0; i < maxPoints; i++) dataPoints.push(1086 + rand(-5, 5));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const min = 1050;
        const max = 1150;
        const range = max - min;

        // Grid
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const y = (h / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Line
        ctx.beginPath();
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00e5ff';

        const stepX = w / (maxPoints - 1);
        dataPoints.forEach((val, i) => {
            const x = i * stepX;
            const y = h - ((val - min) / range) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
        ctx.fillStyle = grad;
        ctx.shadowBlur = 0;
        ctx.fill();

        // Update data
        const lastVal = dataPoints[dataPoints.length - 1];
        let newVal = lastVal + rand(-2, 2);
        newVal = Math.max(min + 10, Math.min(max - 10, newVal));
        dataPoints.shift();
        dataPoints.push(newVal);

        // Update UI text
        document.getElementById('pressureValue').textContent = Math.round(newVal).toLocaleString();
        const klaxonFill = document.getElementById('klaxonFill');
        const pct = ((newVal - min) / range) * 100;
        klaxonFill.style.width = `${pct}%`;
        
        // Update klaxon segments
        const segs = document.getElementById('klaxonSegments');
        if (segs.children.length === 0) {
            for(let i=0; i<20; i++) {
                const s = document.createElement('div');
                s.className = 'klaxon-seg';
                segs.appendChild(s);
            }
        }

        // Color shift based on danger
        const statusEl = document.getElementById('pressureStatus');
        if (newVal > 1120) {
            statusEl.style.color = 'var(--accent-red)';
            statusEl.textContent = 'WARNING';
            document.querySelector('.pressure-unit').style.color = 'var(--accent-red)';
            klaxonFill.style.background = 'linear-gradient(90deg, var(--accent-amber), var(--accent-red))';
        } else {
            statusEl.style.color = 'var(--accent-green)';
            statusEl.textContent = 'NOMINAL';
            document.querySelector('.pressure-unit').style.color = 'var(--accent-cyan)';
            klaxonFill.style.background = 'linear-gradient(90deg, var(--accent-green), var(--accent-cyan))';
        }
    }

    setInterval(draw, 500);
    draw();
}

/* =========================================
   HULL GAUGE
   ========================================= */
function initHullGauge() {
    const canvas = document.getElementById('hullGauge');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let hullVal = 97.3;
    let currentAngle = 0;

    function draw() {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = Math.min(cx, cy) - 8;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background arc
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Hull arc
        const endAngle = (Math.PI * 2 * (hullVal / 100)) - Math.PI / 2;
        
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#00ff9d');
        grad.addColorStop(0.7, '#00e5ff');
        grad.addColorStop(1, '#ff2a6d');

        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00e5ff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tick marks
        ctx.save();
        ctx.translate(cx, cy);
        for (let i = 0; i < 10; i++) {
            const a = (Math.PI * 2 * i / 10) - Math.PI / 2;
            ctx.rotate(a);
            ctx.beginPath();
            ctx.moveTo(0, -r + 15);
            ctx.lineTo(0, -r + 22);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.rotate(-a);
        }
        ctx.restore();
    }

    function updateHull() {
        hullVal += rand(-0.05, 0.05);
        hullVal = Math.max(85, Math.min(100, hullVal));
        document.getElementById('hullValue').textContent = hullVal.toFixed(1) + '%';
        
        // Update segment bars randomly
        const fills = document.querySelectorAll('.seg-fill');
        fills.forEach(f => {
            if (Math.random() > 0.7) {
                let w = parseInt(f.style.width);
                w += rand(-0.5, 0.5);
                w = Math.max(90, Math.min(99, w));
                f.style.width = `${w}%`;
                f.parentElement.nextElementSibling.textContent = `${Math.round(w)}%`;
            }
        });

        // Stress readouts
        const ax = parseFloat(document.getElementById('axialStress').textContent);
        document.getElementById('axialStress').textContent = (ax + rand(-0.002, 0.002)).toFixed(2);
        const tor = parseFloat(document.getElementById('torsionStress').textContent);
        document.getElementById('torsionStress').textContent = (tor + rand(-0.001, 0.001)).toFixed(2);

        draw();
    }

    setInterval(updateHull, 1500);
    draw();
}

/* =========================================
   FAUNA SIGNALS
   ========================================= */
function initFaunaSignals() {
    const bars = document.querySelectorAll('.signal-bar');
    
    function animateBars() {
        bars.forEach(bar => {
            if (Math.random() > 0.5) {
                const newHeight = rand(15, 100);
                bar.style.height = `${newHeight}%`;
            }
        });
        requestAnimationFrame(animateBars);
    }
    animateBars();
}

/* =========================================
   MISSION CLOCK
   ========================================= */
function startMissionClock() {
    let seconds = 0;
    setInterval(() => {
        seconds++;
        document.getElementById('missionTime').textContent = formatTime(seconds);
    }, 1000);
}

/* =========================================
   DATA SIMULATION & LOGS
   ========================================= */
function startDataSimulation() {
    // Simulate fauna count changes
    setInterval(() => {
        const cards = document.querySelectorAll('.fauna-card');
        const card = cards[Math.floor(Math.random() * cards.length)];
        const countEl = card.querySelector('.fauna-count');
        let count = parseInt(countEl.textContent);
        if (Math.random() > 0.5 && count < 8) count++;
        else if (count > 0) count--;
        countEl.textContent = `${count} detected`;
    }, 4000);
}

function startSystemLog() {
    const logContainer = document.getElementById('logEntries');
    const messages = [
        { text: 'External pressure nominal', type: 'info' },
        { text: 'Sonar ping received — Sector 4', type: 'info' },
        { text: 'Thermal vent activity detected', type: 'warn' },
        { text: 'Bioluminescent spike — CT-003', type: 'info' },
        { text: 'Hull stress check complete', type: 'info' },
        { text: 'Current vector update', type: 'info' },
        { text: 'Micro-fracture sensor: Negative', type: 'info' },
        { text: 'O₂ scrubber efficiency 99.8%', type: 'info' },
        { text: 'Acoustic anomaly — Depth 800m', type: 'warn' },
        { text: 'Surface comm-link latency 420ms', type: 'warn' },
        { text: 'Deploying external sensor drone', type: 'info' },
        { text: 'Battery array balancing', type: 'info' }
    ];

    setInterval(() => {
        if (Math.random() > 0.3) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const entry = document.createElement('div');
            entry.className = `log-entry ${msg.type}`;
            const time = document.getElementById('missionTime').textContent;
            entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${msg.text}</span>`;
            
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;

            // Keep log manageable
            if (logContainer.children.length > 50) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }
    }, 3500);

    // Clear log button
    document.getElementById('clearLog').addEventListener('click', () => {
        logContainer.innerHTML = '';
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="log-time">[${document.getElementById('missionTime').textContent}]</span> <span class="log-msg">Log cleared</span>`;
        logContainer.appendChild(entry);
    });
}
/* ============================================================
   ABYSSAL STATION — OPS DASHBOARD
   Deep-Sea Research Station JavaScript Controller
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       CONFIGURATION
       ---------------------------------------------------------- */
    const CONFIG = {
        depth: {
            current: 7248,
            min: 0,
            max: 10200,
            crushDepth: 10200,
            warningThreshold: 8500
        },
        sonar: {
            range: 1000,
            sweepSpeed: 4000,
            contacts: []
        },
        fauna: {
            maxEntities: 12,
            entities: []
        },
        particles: {
            count: 80,
            speed: 0.3
        },
        currents: {
            count: 30,
            speed: 0.15
        },
        hull: {
            integrity: 97.4,
            segments: [
                { name: 'BOW', integrity: 98 },
                { name: 'OPS', integrity: 99 },
                { name: 'LABS', integrity: 97 },
                { name: 'ENGINE', integrity: 96 },
                { name: 'STERN', integrity: 87 }
            ]
        },
        pressure: {
            external: 72.4,
            warningLevel: 85
        }
    };

    /* ----------------------------------------------------------
       UTILITY FUNCTIONS
       ---------------------------------------------------------- */
    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(rand(min, max + 1));
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const mapRange = (v, inMin, inMax, outMin, outMax) =>
        ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

    /* ----------------------------------------------------------
       DEPTH-ADAPTIVE COLOR TEMPERATURE
       ---------------------------------------------------------- */
    function updateDepthColorTemperature(depth) {
        const ratio = clamp(depth / CONFIG.depth.max, 0, 1);
        const root = document.documentElement;

        // Surface: bright cyan-blue → Deep: dark indigo → Hadal: red-shifted
        const hue = lerp(195, 250, ratio);
        const sat = lerp(85, 60, ratio);
        const light = lerp(55, 20, ratio);

        root.style.setProperty('--depth-hue', Math.round(hue));
        root.style.setProperty('--depth-sat', Math.round(sat) + '%');
        root.style.setProperty('--depth-light', Math.round(light) + '%');

        // Update body background darkness
        const bgLight = mapRange(depth, 0, 10200, 4, 1);
        root.style.setProperty('--abyss-bg', `hsl(210, 30%, ${bgLight}%)`);
        root.style.setProperty('--abyss-surface', `hsl(210, 40%, ${bgLight + 2}%)`);

        // Pressure klaxon at critical depth
        const klaxon = document.getElementById('klaxon-bar');
        if (depth >= CONFIG.depth.warningThreshold) {
            klaxon.classList.add('active');
        } else {
            klaxon.classList.remove('active');
        }
    }

    /* ----------------------------------------------------------
       MISSION TIMER
       ---------------------------------------------------------- */
    let missionSeconds = 0;
    function updateMissionTimer() {
        missionSeconds++;
        const h = String(Math.floor(missionSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((missionSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(missionSeconds % 60).padStart(2, '0');
        document.getElementById('mission-time').textContent = `${h}:${m}:${s}`;
    }

    /* ----------------------------------------------------------
       UTC CLOCK
       ---------------------------------------------------------- */
    function updateClock() {
        const now = new Date();
        const h = String(now.getUTCHours()).padStart(2, '0');
        const m = String(now.getUTCMinutes()).padStart(2, '0');
        const s = String(now.getUTCSeconds()).padStart(2, '0');
        document.getElementById('utc-clock').textContent = `${h}:${m}:${s}`;
    }

    /* ----------------------------------------------------------
       GAUGE MARKS GENERATION
       ---------------------------------------------------------- */
    function generateGaugeMarks() {
        const container = document.getElementById('gauge-marks');
        if (!container) return;
        const cx = 100, cy = 100, r = 90;
        const startAngle = -225;
        const endAngle = 45;
        const totalAngle = endAngle - startAngle;
        const steps = 10;

        for (let i = 0; i <= steps; i++) {
            const angle = startAngle + (totalAngle * i) / steps;
            const rad = (angle * Math.PI) / 180;
            const inner = r - 10;
            const outer = r - 3;
            const x1 = cx + inner * Math.cos(rad);
            const y1 = cy + inner * Math.sin(rad);
            const x2 = cx + outer * Math.cos(rad);
            const y2 = cy + outer * Math.sin(rad);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            container.appendChild(line);

            if (i % 2 === 0) {
                const labelR = r - 18;
                const tx = cx + labelR * Math.cos(rad);
                const ty = cy + labelR * Math.sin(rad);
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', tx);
                text.setAttribute('y', ty);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.textContent = String(Math.round((CONFIG.depth.max / steps) * i / 1000));
                container.appendChild(text);
            }
        }
    }

    /* ----------------------------------------------------------
       DEPTH SIMULATION & GAUGE UPDATE
       ---------------------------------------------------------- */
    let displayedDepth = CONFIG.depth.current;
    let targetDepth = CONFIG.depth.current;

    function simulateDepth() {
        // Slowly drift depth with occasional descent
        if (Math.random() < 0.02) {
            targetDepth = clamp(
                targetDepth + rand(-5, 2),
                6800,
                9000
            );
        }
        displayedDepth = lerp(displayedDepth, targetDepth, 0.01);

        const depth = Math.round(displayedDepth);
        document.getElementById('depth-value').textContent = depth.toLocaleString();
        document.getElementById('cam-depth').textContent = depth.toLocaleString() + 'm';

        // Update gauge needle
        const ratio = displayedDepth / CONFIG.depth.max;
        const angle = -225 + ratio * 270;
        const needle = document.getElementById('gauge-needle');
        if (needle) {
            needle.setAttribute('transform', `rotate(${angle}, 100, 100)`);
        }

        // Update gauge fill arc
        const gaugeFill = document.getElementById('depth-gauge-fill');
        if (gaugeFill) {
            const circumference = 565.48;
            const offset = circumference * (1 - ratio);
            gaugeFill.style.strokeDashoffset = offset;
        }

        // Update descent rate
        const rate = (targetDepth - displayedDepth) * 0.1;
        document.getElementById('descent-rate').textContent =
            (rate >= 0 ? '+' : '') + rate.toFixed(1) + ' m/s';

        // Update color temperature
        updateDepthColorTemperature(displayedDepth);

        // Update pressure values based on depth
        const atm = (displayedDepth / 10).toFixed(0);
        document.getElementById('ext-pressure-val').textContent = atm + ' ATM';
        document.getElementById('diff-pressure-fill').style.width =
            clamp((displayedDepth / CONFIG.depth.max) * 100, 0, 100) + '%';
        document.getElementById('diff-pressure-val').textContent = (atm - 1) + ' ATM';
        document.getElementById('ext-pressure-fill').style.width =
            clamp((displayedDepth / CONFIG.depth.max) * 100, 0, 100) + '%';

        // MPa readout
        const mpa = (displayedDepth * 0.01013).toFixed(2);
        document.getElementById('pressure-mpa').textContent = mpa;

        // Pressure equivalence
        const tonnes = Math.round(displayedDepth * 1.013);
        document.getElementById('pressure-equiv').textContent =
            tonnes.toLocaleString() + ' tonnes/m²';

        // Camera temp
        const temp = (-1.7 - displayedDepth * 0.0002).toFixed(1);
        document.getElementById('cam-temp').textContent = temp + '°C';

        // Visibility decreases with depth
        const vis = Math.max(0.5, 15 - displayedDepth * 0.0015).toFixed(1);
        document.getElementById('cam-vis').textContent = vis + 'm';
    }

    /* ----------------------------------------------------------
       BIOLUMINESCENT PARTICLE SYSTEM
       ---------------------------------------------------------- */
    class ParticleSystem {
        constructor(canvasId, count) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());

            const colors = [
                'rgba(0, 229, 255,',
                'rgba(105, 240, 174,',
                'rgba(179, 136, 255,',
                'rgba(68, 138, 255,',
                'rgba(255, 128, 171,'
            ];

            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: rand(0, this.w),
                    y: rand(0, this.h),
                    size: rand(1, 3),
                    speedX: rand(-0.3, 0.3),
                    speedY: rand(-0.15, -0.5),
                    opacity: rand(0.1, 0.6),
                    color: colors[randInt(0, colors.length - 1)],
                    pulseSpeed: rand(0.01, 0.03),
                    pulsePhase: rand(0, Math.PI * 2)
                });
            }
        }

        resize() {
            this.w = this.canvas.width = window.innerWidth;
            this.h = this.canvas.height = window.innerHeight;
        }

        update() {
            this.ctx.clearRect(0, 0, this.w, this.h);

            for (const p of this.particles) {
                p.x += p.speedX + Math.sin(Date.now() * 0.0005 + p.y * 0.01) * 0.1;
                p.y += p.speedY;
                p.pulsePhase += p.pulseSpeed;

                const pulse = (Math.sin(p.pulsePhase) + 1) / 2;
                const alpha = p.opacity * (0.5 + pulse * 0.5);

                // Glow
                const gradient = this.ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.size * 6
                );
                gradient.addColorStop(0, p.color + alpha + ')');
                gradient.addColorStop(0.4, p.color + (alpha * 0.4) + ')');
                gradient.addColorStop(1, p.color + '0)');

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();

                // Core
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color + (alpha * 0.9) + ')';
                this.ctx.fill();

                // Wrap around
                if (p.y < -10) { p.y = this.h + 10; p.x = rand(0, this.w); }
                if (p.x < -10) p.x = this.w + 10;
                if (p.x > this.w + 10) p.x = -10;
            }
        }
    }

    /* ----------------------------------------------------------
       UNDERWATER CURRENT FLOW VISUALIZATION
       ---------------------------------------------------------- */
    class CurrentFlow {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.flowLines = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());

            for (let i = 0; i < CONFIG.currents.count; i++) {
                this.flowLines.push(this.createFlowLine());
            }
        }

        createFlowLine() {
            return {
                x: rand(-200, this.w + 200),
                y: rand(0, this.h),
                length: rand(60, 200),
                speed: rand(0.3, 1.2),
                amplitude: rand(10, 40),
                frequency: rand(0.005, 0.02),
                phase: rand(0, Math.PI * 2),
                opacity: rand(0.02, 0.06)
            };
        }

        resize() {
            this.w = this.canvas.width = window.innerWidth;
            this.h = this.canvas.height = window.innerHeight;
        }

        update() {
            this.ctx.clearRect(0, 0, this.w, this.h);

            for (const line of this.flowLines) {
                line.x += line.speed;
                line.phase += 0.01;

                if (line.x > this.w + line.length + 100) {
                    line.x = -line.length - 50;
                    line.y = rand(0, this.h);
                }

                this.ctx.beginPath();
                this.ctx.moveTo(line.x, line.y);

                for (let i = 0; i < line.length; i += 4) {
                    const sx = line.x + i;
                    const sy = line.y + Math.sin(sx * line.frequency + line.phase) * line.amplitude;
                    this.ctx.lineTo(sx, sy);
                }

                this.ctx.strokeStyle = `rgba(0, 180, 220, ${line.opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
    }

    /* ----------------------------------------------------------
       SONAR SYSTEM
       ---------------------------------------------------------- */
    class SonarSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.size = 500;
            this.canvas.width = this.size;
            this.canvas.height = this.size;
            this.center = this.size / 2;
            this.radius = this.size / 2 - 10;
            this.sweepAngle = 0;
            this.contacts = [];
            this.pings = [];
            this.lastPingTime = 0;
            this.pingInterval = 2400;

            // Initialize sonar contacts
            this.initContacts();
        }

        initContacts() {
            this.contacts = [
                { angle: 42, distance: 0.35, size: 4, type: 'fauna', label: 'FAUNA-A', trail: [] },
                { angle: 187, distance: 0.65, size: 6, type: 'rock', label: 'TERRAIN-B', trail: [] },
                { angle: 315, distance: 0.45, size: 3, type: 'fauna', label: 'FAUNA-C', trail: [] }
            ];
        }

        update(timestamp) {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.size, this.size);

            // Fade effect — persistent trail
            ctx.fillStyle = 'rgba(0, 8, 12, 0.04)';
            ctx.fillRect(0, 0, this.size, this.size);

            // Sweep angle
            this.sweepAngle = ((timestamp % CONFIG.sonar.sweepSpeed) / CONFIG.sonar.sweepSpeed) * Math.PI * 2;

            // Draw sweep trail (fading wedge)
            const sweepGradient = ctx.createConicGradient(this.sweepAngle, this.center, this.center);
            sweepGradient.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
            sweepGradient.addColorStop(0.02, 'rgba(0, 229, 255, 0.03)');
            sweepGradient.addColorStop(0.08, 'rgba(0, 229, 255, 0)');
            sweepGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = sweepGradient;
            ctx.beginPath();
            ctx.arc(this.center, this.center, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // Ping effect
            if (timestamp - this.lastPingTime > this.pingInterval) {
                this.lastPingTime = timestamp;
                this.pings.push({ radius: 10, opacity: 0.6 });
            }

            // Draw and update pings
            for (let i = this.pings.length - 1; i >= 0; i--) {
                const ping = this.pings[i];
                ping.radius += 3;
                ping.opacity -= 0.008;

                if (ping.opacity <= 0) {
                    this.pings.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(this.center, this.center, ping.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 229, 255, ${ping.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw contacts
            for (const contact of this.contacts) {
                // Slowly drift contacts
                contact.angle += rand(-0.002, 0.002);
                contact.distance = clamp(contact.distance + rand(-0.001, 0.001), 0.1, 0.9);

                const cx = this.center + Math.cos(contact.angle - Math.PI / 2) * contact.distance * this.radius;
                const cy = this.center + Math.sin(contact.angle - Math.PI / 2) * contact.distance * this.radius;

                // Check if contact is within sweep arc (for fade-in effect)
                let angleDiff = this.sweepAngle - contact.angle;
                while (angleDiff < 0) angleDiff += Math.PI * 2;
                while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;
                const sweepFade = angleDiff < 0.5 ? 1 : clamp(1 - (angleDiff - 0.5) * 2, 0.05, 1);

                // Trail
                contact.trail.push({ x: cx, y: cy, opacity: sweepFade });
                if (contact.trail.length > 30) contact.trail.shift();

                for (let t = 0; t < contact.trail.length; t++) {
                    const tp = contact.trail[t];
                    const trailAlpha = (t / contact.trail.length) * tp.opacity * 0.3;
                    ctx.beginPath();
                    ctx.arc(tp.x, tp.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 229, 255, ${trailAlpha})`;
                    ctx.fill();
                }

                // Contact glow
                const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, contact.size * 4);
                const contactColor = contact.type === 'fauna' ? '0, 229, 255' : '100, 200, 150';
                glowGrad.addColorStop(0, `rgba(${contactColor}, ${0.6 * sweepFade})`);
                glowGrad.addColorStop(0.5, `rgba(${contactColor}, ${0.15 * sweepFade})`);
                glowGrad.addColorStop(1, `rgba(${contactColor}, 0)`);

                ctx.beginPath();
                ctx.arc(cx, cy, contact.size * 4, 0, Math.PI * 2);
                ctx.fillStyle = glowGrad;
                ctx.fill();

                // Contact dot
                ctx.beginPath();
                ctx.arc(cx, cy, contact.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${contactColor}, ${sweepFade})`;
                ctx.fill();

                // Contact ring pulse
                const pulseR = contact.size + Math.sin(timestamp * 0.003 + contact.angle) * 3;
                ctx.beginPath();
                ctx.arc(cx, cy, pulseR + 4, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${contactColor}, ${0.3 * sweepFade})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Update heading
            const heading = ((contactAngle => contactAngle)(this.sweepAngle * 180 / Math.PI) || 0);
            const displayHeading = (this.sweepAngle * 180 / Math.PI).toFixed(1);
            document.getElementById('sonar-heading').textContent = displayHeading.padStart(5, '0') + '°';
            document.getElementById('sonar-contacts').textContent = this.contacts.length;
        }
    }

    /* ----------------------------------------------------------
       FAUNA TRACKING SYSTEM
       ---------------------------------------------------------- */
    class FaunaTracker {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.width = 340;
            this.height = 180;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.entities = [];
            this.gridSpacing = 30;

            this.initEntities();
        }

        initEntities() {
            const types = ['cephalopod', 'cnidarian', 'unknown'];
            const colors = {
                cephalopod: 'rgba(0, 229, 255,',
                cnidarian: 'rgba(105, 240, 174,',
                unknown: 'rgba(179, 136, 255,'
            };

            for (let i = 0; i < 8; i++) {
                this.entities.push({
                    x: rand(20, this.width - 20),
                    y: rand(20, this.height - 20),
                    vx: rand(-0.5, 0.5),
                    vy: rand(-0.3, 0.3),
                    size: rand(2, 5),
                    type: types[randInt(0, 2)],
                    color: null,
                    pulsePhase: rand(0, Math.PI * 2),
                    pulseSpeed: rand(0.02, 0.05),
                    trail: []
                });
            }

            // Set colors
            for (const e of this.entities) {
                const colors = {
                    cephalopod: 'rgba(0, 229, 255,',
                    cnidarian: 'rgba(105, 240, 174,',
                    unknown: 'rgba(179, 136, 255,'
                };
                e.color = colors[e.type];
            }
        }

        update() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);

            // Grid
            ctx.strokeStyle = 'rgba(30, 80, 120, 0.1)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < this.width; x += this.gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.height);
                ctx.stroke();
            }
            for (let y = 0; y < this.height; y += this.gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(this.width, y);
                ctx.stroke();
            }

            // Draw entities
            for (const e of this.entities) {
                e.x += e.vx;
                e.y += e.vy;
                e.pulsePhase += e.pulseSpeed;

                // Bounce off walls
                if (e.x < 10 || e.x > this.width - 10) e.vx *= -1;
                if (e.y < 10 || e.y > this.height - 10) e.vy *= -1;

                // Random direction changes
                if (Math.random() < 0.01) {
                    e.vx = rand(-0.5, 0.5);
                    e.vy = rand(-0.3, 0.3);
                }

                // Trail
                e.trail.push({ x: e.x, y: e.y });
                if (e.trail.length > 20) e.trail.shift();

                for (let t = 0; t < e.trail.length; t++) {
                    const tp = e.trail[t];
                    const trailAlpha = (t / e.trail.length) * 0.2;
                    ctx.beginPath();
                    ctx.arc(tp.x, tp.y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = e.color + trailAlpha + ')';
                    ctx.fill();
                }

                const pulse = (Math.sin(e.pulsePhase) + 1) / 2;
                const alpha = 0.5 + pulse * 0.5;

                // Glow
                const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 5);
                gradient.addColorStop(0, e.color + (alpha * 0.5) + ')');
                gradient.addColorStop(0.5, e.color + (alpha * 0.1) + ')');
                gradient.addColorStop(1, e.color + '0)');
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.size * 5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.size * (0.8 + pulse * 0.3), 0, Math.PI * 2);
                ctx.fillStyle = e.color + alpha + ')';
                ctx.fill();
            }
        }
    }

    /* ----------------------------------------------------------
       EXTERNAL CAMERA FEED SIMULATION
       ---------------------------------------------------------- */
    class CameraFeed {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.width = 600;
            this.height = 200;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.noiseOffset = 0;
            this.debris = [];

            for (let i = 0; i < 25; i++) {
                this.debris.push({
                    x: rand(0, this.width),
                    y: rand(0, this.height),
                    size: rand(0.5, 2),
                    speed: rand(0.2, 0.8),
                    opacity: rand(0.1, 0.4)
                });
            }
        }

        update() {
            const ctx = this.ctx;
            const w = this.width;
            const h = this.height;

            // Dark water background with depth gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, 'rgba(0, 8, 18, 1)');
            bgGrad.addColorStop(0.5, 'rgba(0, 4, 12, 1)');
            bgGrad.addColorStop(1, 'rgba(0, 2, 8, 1)');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            // Noise / grain effect
            this.noiseOffset += 0.5;
            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 16) {
                const noise = rand(-8, 8);
                data[i] = Math.max(0, data[i] + noise);
                data[i + 1] = Math.max(0, data[i + 1] + noise);
                data[i + 2] = Math.max(0, data[i + 2] + noise + 3);
            }
            ctx.putImageData(imageData, 0, 0);

            // Distant bioluminescent flashes
            if (Math.random() < 0.03) {
                const fx = rand(50, w - 50);
                const fy = rand(20, h - 20);
                const gradient = ctx.createRadialGradient(fx, fy, 0, fx, fy, rand(10, 30));
                gradient.addColorStop(0, 'rgba(0, 200, 255, 0.15)');
                gradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.05)');
                gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
                ctx.beginPath();
                ctx.arc(fx, fy, 30, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Floating debris particles
            for (const d of this.debris) {
                d.x -= d.speed;
                d.y += Math.sin(Date.now() * 0.001 + d.x * 0.01) * 0.2;

                if (d.x < -5) {
                    d.x = w + 5;
                    d.y = rand(0, h);
                }

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(150, 200, 220, ${d.opacity})`;
                ctx.fill();
            }

            // Vignette
            const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.7);
            vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            ctx.fillStyle = vigGrad;
            ctx.fillRect(0, 0, w, h);

            // Chromatic aberration simulation (subtle)
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.008)';
            ctx.fillRect(2, 0, w, h);
            ctx.fillStyle = 'rgba(0, 0, 255, 0.008)';
            ctx.fillRect(-2, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';

            // Occasional "creature" shadow passing
            if (Math.random() < 0.002) {
                this.triggerShadowPass();
            }

            // Scanline flicker
            if (Math.random() < 0.05) {
                ctx.fillStyle = 'rgba(0, 229, 255, 0.02)';
                ctx.fillRect(0, randInt(0, h), w, randInt(1, 3));
            }
        }

        triggerShadowPass() {
            // Just a flag — visual handled in update loop
            this.shadowPassActive = true;
            this.shadowX = -50;
            this.shadowSpeed = 2;
        }
    }

    /* ----------------------------------------------------------
       HULL INTEGRITY SIMULATION
       ---------------------------------------------------------- */
    function simulateHullIntegrity() {
        // Slowly degrade stern joint
        const stern = CONFIG.hull.segments[4];
        if (Math.random() < 0.05 && stern.integrity > 75) {
            stern.integrity = Math.max(75, stern.integrity - rand(0, 0.3));
        }

        // Other segments fluctuate slightly
        for (let i = 0; i < 4; i++) {
            const seg = CONFIG.hull.segments[i];
            seg.integrity = clamp(seg.integrity + rand(-0.1, 0.05), 90, 100);
        }

        // Calculate overall
        const overall = CONFIG.hull.segments.reduce((sum, s) => sum + s.integrity, 0) / 5;
        CONFIG.hull.integrity = overall;

        // Update display
        document.getElementById('hull-integrity').textContent = overall.toFixed(1) + '%';

        // Update status
        const statusEl = document.getElementById('hull-status');
        if (overall >= 95) {
            statusEl.textContent = 'NOMINAL';
            statusEl.className = 'panel-status nominal';
        } else if (overall >= 85) {
            statusEl.textContent = 'CAUTION';
            statusEl.className = 'panel-status warning';
        } else {
            statusEl.textContent = 'CRITICAL';
            statusEl.className = 'panel-status critical';
        }

        // Update stress bars
        const stressFills = document.querySelectorAll('.hull-stress-readings .stress-fill');
        const stressPcts = document.querySelectorAll('.hull-stress-readings .stress-pct');
        CONFIG.hull.segments.forEach((seg, i) => {
            if (stressFills[i]) {
                stressFills[i].style.width = seg.integrity + '%';
                if (seg.integrity < 90) {
                    stressFills[i].classList.add('warning');
                }
            }
            if (stressPcts[i]) {
                stressPcts[i].textContent = Math.round(seg.integrity) + '%';
                if (seg.integrity < 90) {
                    stressPcts[i].classList.add('warning-text');
                }
            }
        });

        // Update SVG stress points
        CONFIG.hull.segments.forEach((seg, i) => {
            const point = document.getElementById('stress-' + (i + 1));
            if (point) {
                if (seg.integrity < 90) {
                    point.classList.add('warning');
                } else {
                    point.classList.remove('warning');
                }
            }
        });
    }

    /* ----------------------------------------------------------
       FAUNA LOG UPDATER
       ---------------------------------------------------------- */
    const faunaClasses = ['fauna-type-1', 'fauna-type-2', 'fauna-type-3'];
    const faunaTypes = ['CEPH', 'CNID', 'UNKN'];
    const faunaNames = ['Cephalopod', 'Cnidarian', 'Unknown'];

    function addFaunaLogEntry() {
        const log = document.getElementById('fauna-log');
        if (!log) return;

        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' +
                        String(now.getMinutes()).padStart(2, '0') + ':' +
                        String(now.getSeconds()).padStart(2, '0');
        const typeIdx = randInt(0, 2);
        const dist = randInt(15, 350);
        const bearing = randInt(0, 359);

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span>${timeStr}</span>
            <span class="${faunaClasses[typeIdx]}">${faunaTypes[typeIdx]}</span>
            <span>${dist}m</span>
            <span>${String(bearing).padStart(3, '0')}°</span>
        `;

        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-10px)';
        log.insertBefore(entry, log.firstChild);

        // Animate in
        requestAnimationFrame(() => {
            entry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';
        });

        // Keep only last 12 entries
        while (log.children.length > 12) {
            log.removeChild(log.lastChild);
        }
    }

    /* ----------------------------------------------------------
       SONAR RANGE BUTTONS
       ---------------------------------------------------------- */
    function initSonarControls() {
        const buttons = document.querySelectorAll('.sonar-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                CONFIG.sonar.range = parseInt(btn.dataset.range);
            });
        });
    }

    /* ----------------------------------------------------------
       SYSTEM STATUS DOTS
       ---------------------------------------------------------- */
    function simulateSystemStatus() {
        const systems = ['sys-power', 'sys-life', 'sys-comms', 'sys-nav'];
        const statuses = ['nominal', 'nominal', 'nominal', 'nominal', 'warning'];

        for (const id of systems) {
            const el = document.getElementById(id);
            if (!el) continue;

            // Mostly nominal, occasional warning on comms
            if (id === 'sys-comms' && Math.random() < 0.01) {
                el.className = 'status-dot warning';
            } else if (id === 'sys-comms' && Math.random() < 0.05) {
                el.className = 'status-dot';
            }
        }
    }

    /* ----------------------------------------------------------
       BATTERY SIMULATION
       ---------------------------------------------------------- */
    let batteryLevel = 87.3;

    function simulateBattery() {
        batteryLevel = Math.max(60, batteryLevel - rand(0, 0.02));
        document.getElementById('battery-level').textContent = batteryLevel.toFixed(1) + '%';
        document.getElementById('battery-bar').style.width = batteryLevel + '%';

        if (batteryLevel < 70) {
            document.getElementById('battery-bar').style.background =
                'linear-gradient(90deg, rgba(255, 171, 0, 0.4), rgba(255, 171, 0, 0.7))';
        }
    }

    /* ----------------------------------------------------------
       ALTITUDE SIMULATION
       ---------------------------------------------------------- */
    function simulateAltitude() {
        const alt = (12.4 + Math.sin(Date.now() * 0.0003) * 2).toFixed(1);
        const altEl = document.getElementById('cam-alt');
        if (altEl) altEl.textContent = alt + 'm';
    }

    /* ----------------------------------------------------------
       MAIN ANIMATION LOOP
       ---------------------------------------------------------- */
    let particleSystem, currentFlow, sonarSystem, faunaTracker, cameraFeed;

    function init() {
        // Generate gauge marks
        generateGaugeMarks();

        // Initialize systems
        particleSystem = new ParticleSystem('particle-canvas', CONFIG.particles.count);
        currentFlow = new CurrentFlow('current-canvas');
        sonarSystem = new SonarSystem('sonar-canvas');
        faunaTracker = new FaunaTracker('fauna-canvas');
        cameraFeed = new CameraFeed('camera-canvas');

        // Init controls
        initSonarControls();

        // Start animation loop
        function animate(timestamp) {
            particleSystem.update();
            currentFlow.update();
            sonarSystem.update(timestamp);
            faunaTracker.update();
            cameraFeed.update();
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        // Timed updates
        setInterval(simulateDepth, 500);
        setInterval(simulateHullIntegrity, 3000);
        setInterval(addFaunaLogEntry, 6000);
        setInterval(simulateSystemStatus, 5000);
        setInterval(simulateBattery, 10000);
        setInterval(simulateAltitude, 2000);

        // Clock
        updateClock();
        setInterval(updateClock, 1000);

        // Mission timer
        setInterval(updateMissionTimer, 1000);

        // Initial depth color
        updateDepthColorTemperature(CONFIG.depth.current);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
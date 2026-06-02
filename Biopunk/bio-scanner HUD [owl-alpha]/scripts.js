/* ============================================================
   NEXUS BIOSCAN — BIOPUNK MEDICAL SCANNER HUD
   v4.7.2-ORGANIC // Interactive Systems Controller
   ============================================================ */

(function () {
    'use strict';

    // ========================================================
    // UTILITY FUNCTIONS
    // ========================================================
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour12: false });
    }

    function mapRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    // ========================================================
    // SYSTEM CLOCK
    // ========================================================
    function updateSystemTime() {
        const el = document.getElementById('sys-time');
        if (el) el.textContent = formatTime(new Date());
    }
    setInterval(updateSystemTime, 1000);
    updateSystemTime();

    // ========================================================
    // HEARTBEAT ECG CANVAS
    // ========================================================
    class HeartbeatECG {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.points = [];
            this.maxPoints = 300;
            this.phase = 0;
            this.speed = 0.04;
            this.baseBpm = 72;
            this.targetBpm = 72;
            this.currentBpm = 72;
            this.noiseOffset = 0;

            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = 60;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.midY = this.height / 2;
        }

        generateECGPoint(phase) {
            const normalizedPhase = phase % (Math.PI * 2);

            // P wave
            let val = 0;
            if (normalizedPhase > 0.1 && normalizedPhase < 0.35) {
                val = Math.sin(mapRange(normalizedPhase, 0.1, 0.35, 0, Math.PI)) * 6;
            }
            // Q wave
            else if (normalizedPhase > 0.4 && normalizedPhase < 0.48) {
                val = -4;
            }
            // R wave (main spike)
            else if (normalizedPhase > 0.48 && normalizedPhase < 0.58) {
                val = Math.sin(mapRange(normalizedPhase, 0.48, 0.58, -Math.PI / 2, Math.PI / 2)) * 35;
            }
            // S wave
            else if (normalizedPhase > 0.58 && normalizedPhase < 0.66) {
                val = -8;
            }
            // T wave
            else if (normalizedPhase > 0.85 && normalizedPhase < 1.2) {
                val = Math.sin(mapRange(normalizedPhase, 0.85, 1.2, 0, Math.PI)) * 8;
            }

            // Add subtle noise
            this.noiseOffset += rand(-0.3, 0.3);
            this.noiseOffset = clamp(this.noiseOffset, -1.5, 1.5);
            val += this.noiseOffset;

            return val;
        }

        animate() {
            this.phase += this.speed * (this.currentBpm / 72);

            if (this.phase > Math.PI * 2) {
                this.phase -= Math.PI * 2;
            }

            const point = this.generateECGPoint(this.phase);
            this.points.push(point);
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }

            // Gradually drift BPM
            if (Math.random() < 0.005) {
                this.targetBpm = randInt(68, 78);
            }
            this.currentBpm = lerp(this.currentBpm, this.targetBpm, 0.02);

            this.draw();

            // Update BPM display
            const bpmEl = document.getElementById('bpm-value');
            if (bpmEl) {
                bpmEl.textContent = Math.round(this.currentBpm);
            }

            requestAnimationFrame(() => this.animate());
        }

        draw() {
            const ctx = this.ctx;
            const w = this.width;
            const h = this.height;

            ctx.clearRect(0, 0, w, h);

            // Grid lines
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';
            ctx.lineWidth = 0.5;
            for (let y = 0; y < h; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            for (let x = 0; x < w; x += 10) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            // ECG line
            if (this.points.length < 2) return;

            // Glow effect
            ctx.shadowColor = 'rgba(255, 34, 85, 0.5)';
            ctx.shadowBlur = 8;
            ctx.strokeStyle = '#ff2255';
            ctx.lineWidth = 1.5;
            ctx.beginPath();

            const step = w / this.maxPoints;
            for (let i = 0; i < this.points.length; i++) {
                const x = i * step;
                const y = this.midY - this.points[i];
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Bright leading dot
            const lastX = (this.points.length - 1) * step;
            const lastY = this.midY - this.points[this.points.length - 1];
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#ff2255';
            ctx.beginPath();
            ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
        }
    }

    // ========================================================
    // NANITE PARTICLE FIELD (BACKGROUND)
    // ========================================================
    class NaniteField {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.resize();

            for (let i = 0; i < 120; i++) {
                this.particles.push(this.createParticle());
            }

            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }

        createParticle() {
            return {
                x: rand(0, this.width),
                y: rand(0, this.height),
                vx: rand(-0.3, 0.3),
                vy: rand(-0.2, 0.2),
                size: rand(0.5, 2),
                alpha: rand(0.1, 0.5),
                pulseSpeed: rand(0.01, 0.04),
                pulsePhase: rand(0, Math.PI * 2),
                color: Math.random() < 0.5 ? '0, 255, 136' : '0, 221, 255'
            };
        }

        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Update and draw particles
            for (let p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.pulsePhase += p.pulseSpeed;

                // Wrap around
                if (p.x < -10) p.x = this.width + 10;
                if (p.x > this.width + 10) p.x = -10;
                if (p.y < -10) p.y = this.height + 10;
                if (p.y > this.height + 10) p.y = -10;

                const pulseAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulsePhase));

                this.ctx.fillStyle = `rgba(${p.color}, ${pulseAlpha})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw connections between nearby particles
            this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.03)';
            this.ctx.lineWidth = 0.5;
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        const alpha = mapRange(dist, 0, 80, 0.06, 0);
                        this.ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================================
    // NEURAL NETWORK VISUALIZATION
    // ========================================================
    class NeuralNetwork {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.nodes = [];
            this.connections = [];
            this.pulses = [];
            this.resize();
            this.generateNetwork();

            window.addEventListener('resize', () => {
                this.resize();
                this.generateNetwork();
            });

            this.animate();
        }

        resize() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.width = rect.width;
            this.height = rect.height;
        }

        generateNetwork() {
            this.nodes = [];
            this.connections = [];
            this.pulses = [];

            const layers = [4, 6, 8, 6, 4];
            const layerSpacing = this.width / (layers.length + 1);

            // Create nodes
            for (let l = 0; l < layers.length; l++) {
                const x = layerSpacing * (l + 1);
                const count = layers[l];
                const nodeSpacing = this.height / (count + 1);

                for (let n = 0; n < count; n++) {
                    const jitterX = rand(-8, 8);
                    const jitterY = rand(-5, 5);
                    this.nodes.push({
                        x: x + jitterX,
                        y: nodeSpacing * (n + 1) + jitterY,
                        layer: l,
                        index: n,
                        activation: rand(0.2, 1),
                        targetActivation: rand(0.2, 1),
                        pulsePhase: rand(0, Math.PI * 2)
                    });
                }
            }

            // Create connections between adjacent layers
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = 0; j < this.nodes.length; j++) {
                    if (this.nodes[j].layer === this.nodes[i].layer + 1) {
                        if (Math.random() < 0.6) {
                            this.connections.push({
                                from: i,
                                to: j,
                                weight: rand(0.2, 1),
                                activity: rand(0, 1)
                            });
                        }
                    }
                }
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Update nodes
            for (let node of this.nodes) {
                node.pulsePhase += rand(0.02, 0.06);
                if (Math.random() < 0.02) {
                    node.targetActivation = rand(0.2, 1);
                }
                node.activation = lerp(node.activation, node.targetActivation, 0.05);
            }

            // Update connections
            for (let conn of this.connections) {
                conn.activity = lerp(conn.activity, rand(0, 0.8), 0.03);
            }

            // Draw connections
            for (let conn of this.connections) {
                const from = this.nodes[conn.from];
                const to = this.nodes[conn.to];
                const alpha = conn.activity * conn.weight * 0.3;

                this.ctx.strokeStyle = `rgba(0, 221, 255, ${alpha})`;
                this.ctx.lineWidth = 0.5 + conn.weight * 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(from.x, from.y);
                this.ctx.lineTo(to.x, to.y);
                this.ctx.stroke();
            }

            // Spawn new pulses
            if (Math.random() < 0.15) {
                const conn = this.connections[randInt(0, this.connections.length - 1)];
                if (conn) {
                    this.pulses.push({
                        connection: conn,
                        progress: 0,
                        speed: rand(0.008, 0.02),
                        size: rand(1.5, 3),
                        color: Math.random() < 0.7 ? '0, 221, 255' : '0, 255, 136'
                    });
                }
            }

            // Update and draw pulses
            for (let i = this.pulses.length - 1; i >= 0; i--) {
                const p = this.pulses[i];
                p.progress += p.speed;
                if (p.progress >= 1) {
                    this.pulses.splice(i, 1);
                    continue;
                }

                const from = this.nodes[p.connection.from];
                const to = this.nodes[p.connection.to];
                const x = lerp(from.x, to.x, p.progress);
                const y = lerp(from.y, to.y, p.progress);

                this.ctx.shadowColor = `rgba(${p.color}, 0.5)`;
                this.ctx.shadowBlur = 8;
                this.ctx.fillStyle = `rgba(${p.color}, 0.8)`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw nodes
            this.ctx.shadowBlur = 0;
            for (let node of this.nodes) {
                const pulse = 0.8 + 0.2 * Math.sin(node.pulsePhase);
                const r = 2 + node.activation * 2;

                // Outer glow
                const gradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, r * 3
                );
                gradient.addColorStop(0, `rgba(0, 221, 255, ${node.activation * 0.15 * pulse})`);
                gradient.addColorStop(1, 'rgba(0, 221, 255, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
                this.ctx.fill();

                // Node dot
                this.ctx.fillStyle = `rgba(0, 221, 255, ${node.activation * pulse})`;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Update neural stats
            if (Math.random() < 0.05) {
                this.updateNeuralStats();
            }

            requestAnimationFrame(() => this.animate());
        }

        updateNeuralStats() {
            const uplink = rand(95, 99.5).toFixed(1);
            const downlink = rand(88, 94).toFixed(1);
            const latency = rand(0.5, 1.2).toFixed(1);
            const bandwidth = rand(4.2, 5.1).toFixed(1);
            const overall = ((parseFloat(uplink) + parseFloat(downlink)) / 2).toFixed(1);

            const update = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            };

            update('neural-uplink', uplink + '%');
            update('neural-downlink', downlink + '%');
            update('neural-latency', latency + 'ms');
            update('neural-bandwidth', bandwidth + 'Tb/s');
            update('neural-score', overall + '%');
        }
    }

    // ========================================================
    // NANITE SWARM VISUALIZER
    // ========================================================
    class NaniteSwarm {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.nanites = [];
            this.resize();

            for (let i = 0; i < 80; i++) {
                this.nanites.push({
                    x: rand(0, this.width),
                    y: rand(0, this.height),
                    vx: rand(-1, 1),
                    vy: rand(-1, 1),
                    size: rand(1, 2.5),
                    targetX: rand(0, this.width),
                    targetY: rand(0, this.height),
                    changeTimer: rand(0, 100),
                    color: Math.random() < 0.6 ? '0, 221, 255' : '0, 255, 136'
                });
            }

            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            this.width = rect.width;
            this.height = rect.height;
        }

        animate() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Draw faint grid
            this.ctx.strokeStyle = 'rgba(0, 221, 255, 0.03)';
            this.ctx.lineWidth = 0.5;
            for (let x = 0; x < this.width; x += 20) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
            }
            for (let y = 0; y < this.height; y += 20) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
            }

            // Update and draw nanites
            for (let n of this.nanites) {
                n.changeTimer--;
                if (n.changeTimer <= 0) {
                    n.targetX = rand(0, this.width);
                    n.targetY = rand(0, this.height);
                    n.changeTimer = rand(30, 120);
                }

                // Steer toward target
                const dx = n.targetX - n.x;
                const dy = n.targetY - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 1) {
                    n.vx += (dx / dist) * 0.05;
                    n.vy += (dy / dist) * 0.05;
                }

                // Damping
                n.vx *= 0.98;
                n.vy *= 0.98;

                // Speed limit
                const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
                if (speed > 2) {
                    n.vx = (n.vx / speed) * 2;
                    n.vy = (n.vy / speed) * 2;
                }

                n.x += n.vx;
                n.y += n.vy;

                // Wrap
                if (n.x < -5) n.x = this.width + 5;
                if (n.x > this.width + 5) n.x = -5;
                if (n.y < -5) n.y = this.height + 5;
                if (n.y > this.height + 5) n.y = -5;

                // Draw
                this.ctx.fillStyle = `rgba(${n.color}, 0.7)`;
                this.ctx.shadowColor = `rgba(${n.color}, 0.3)`;
                this.ctx.shadowBlur = 4;
                this.ctx.beginPath();
                this.ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw connections between close nanites
            this.ctx.shadowBlur = 0;
            for (let i = 0; i < this.nanites.length; i++) {
                for (let j = i + 1; j < this.nanites.length; j++) {
                    const dx = this.nanites[i].x - this.nanites[j].x;
                    const dy = this.nanites[i].y - this.nanites[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 40) {
                        const alpha = mapRange(dist, 0, 40, 0.12, 0);
                        this.ctx.strokeStyle = `rgba(0, 221, 255, ${alpha})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.nanites[i].x, this.nanites[i].y);
                        this.ctx.lineTo(this.nanites[j].x, this.nanites[j].y);
                        this.ctx.stroke();
                    }
                }
            }

            // Update count display
            if (Math.random() < 0.02) {
                const countEl = document.getElementById('nanite-count');
                if (countEl) {
                    const base = 2.4;
                    const variation = rand(-0.05, 0.05);
                    countEl.textContent = (base + variation).toFixed(1) + 'B';
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================================
    // GENE-SPLICE HEX MATRIX
    // ========================================================
    function generateGeneMatrix() {
        const grid = document.getElementById('gene-hex-grid');
        if (!grid) return;

        const statuses = ['optimal', 'optimal', 'optimal', 'caution', 'neutral', 'warning', 'necrotic', 'optimal', 'caution', 'optimal'];
        const totalCells = 42;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            const status = statuses[randInt(0, statuses.length - 1)];
            cell.className = `hex-cell ${status}`;
            cell.title = `Gene splice node ${i + 1}: ${status.toUpperCase()}`;

            cell.addEventListener('mouseenter', () => {
                cell.style.filter = 'brightness(1.8)';
            });
            cell.addEventListener('mouseleave', () => {
                cell.style.filter = '';
            });

            grid.appendChild(cell);
        }
    }

    // ========================================================
    // REAL-TIME DATA SIMULATION
    // ========================================================
    function simulateVitals() {
        // Organ metrics
        const organs = {
            'heart-output': () => (rand(94, 99)).toFixed(1) + '%',
            'heart-rhythm': () => Math.round(rand(68, 78)) + ' BPM',
            'lung-capacity': () => (rand(85, 92)).toFixed(1) + '%',
            'o2-sat': () => (rand(94, 98)).toFixed(1) + '%',
            'liver-filter': () => (rand(90, 96)).toFixed(1) + '%',
            'liver-regen': () => {
                const states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'STANDBY'];
                return states[randInt(0, states.length - 1)];
            },
            'brain-activity': () => (rand(80, 90)).toFixed(1) + '%',
            'brain-synapse': () => (rand(1.0, 1.5)).toFixed(1) + ' THz',
            'kidney-filter': () => (rand(75, 84)).toFixed(1) + '%',
            'kidney-fluid': () => {
                const states = ['BALANCED', 'BALANCED', 'LOW', 'BALANCED'];
                return states[randInt(0, states.length - 1)];
            },
            'gi-process': () => (rand(62, 72)).toFixed(1) + '%',
            'gi-flora': () => {
                const states = ['STABLE', 'STABLE', 'SHIFTING'];
                return states[randInt(0, states.length - 1)];
            }
        };

        for (const [id, generator] of Object.entries(organs)) {
            if (Math.random() < 0.3) {
                const el = document.getElementById(id);
                if (el) el.textContent = generator();
            }
        }

        // Health bar widths
        const healthBars = document.querySelectorAll('.health-fill');
        for (let bar of healthBars) {
            if (Math.random() < 0.15) {
                const currentWidth = parseFloat(bar.style.width) || 80;
                const newWidth = clamp(currentWidth + rand(-2, 2), 50, 100);
                bar.style.width = newWidth + '%';
            }
        }

        // Toxin levels
        const toxins = {
            'toxin-metals': () => Math.round(rand(40, 52)) + '%',
            'toxin-biowaste': () => Math.round(rand(68, 78)) + '%',
            'toxin-radiation': () => Math.round(rand(22, 35)) + '%',
            'toxin-debris': () => Math.round(rand(48, 62)) + '%'
        };

        for (const [id, generator] of Object.entries(toxins)) {
            if (Math.random() < 0.2) {
                const el = document.getElementById(id);
                if (el) el.textContent = generator();
            }
        }

        // Toxin total gauge
        if (Math.random() < 0.1) {
            const totalEl = document.getElementById('toxin-total');
            const gaugeFill = document.querySelector('.toxin-gauge-fill');
            if (totalEl && gaugeFill) {
                const total = Math.round(rand(55, 68));
                totalEl.textContent = total + '%';
                const offset = mapRange(total, 0, 100, 165, 55);
                gaugeFill.style.strokeDashoffset = offset;

                // Color shift based on level
                if (total > 75) {
                    gaugeFill.style.stroke = '#ff2255';
                } else if (total > 55) {
                    gaugeFill.style.stroke = '#ffaa00';
                } else {
                    gaugeFill.style.stroke = '#00ff88';
                }
            }
        }

        // Vitals
        const vitals = {
            'vital-temp': () => (rand(36.8, 37.6)).toFixed(1) + '°C',
            'vital-bp': () => Math.round(rand(115, 128)) + '/' + Math.round(rand(74, 84)),
            'vital-resp': () => Math.round(rand(14, 18)) + '/min',
            'vital-energy': () => Math.round(rand(82, 93)) + '%',
            'vital-dna': () => (rand(98.5, 99.8)).toFixed(1) + '%'
        };

        for (const [id, generator] of Object.entries(vitals)) {
            if (Math.random() < 0.25) {
                const el = document.getElementById(id);
                if (el) el.textContent = generator();
            }
        }

        // Nanite deployment zones
        const zones = document.querySelectorAll('.zone-fill');
        for (let zone of zones) {
            if (Math.random() < 0.15) {
                const currentWidth = parseFloat(zone.style.width) || 70;
                const newWidth = clamp(currentWidth + rand(-3, 3), 30, 100);
                zone.style.width = newWidth + '%';

                // Update percentage text
                const pctEl = zone.parentElement.querySelector('.zone-pct');
                if (pctEl) pctEl.textContent = Math.round(newWidth) + '%';
            }
        }
    }

    setInterval(simulateVitals, 2000);

    // ========================================================
    // SYSTEM LOG
    // ========================================================
    const logMessages = [
        { msg: 'Deep tissue scan initialized', type: 'info' },
        { msg: 'Nanomachine swarm calibrated', type: 'info' },
        { msg: 'Renal filtration below threshold', type: 'warning' },
        { msg: 'Neural link handshake complete', type: 'info' },
        { msg: 'Cardiac rhythm nominal', type: 'info' },
        { msg: 'Gene splice CHR-3 adapting', type: 'warning' },
        { msg: 'Toxin filtration cycle started', type: 'info' },
        { msg: 'Nanite deployment zone updated', type: 'info' },
        { msg: 'Oxygen saturation stable', type: 'info' },
        { msg: 'Bio-waste levels elevated', type: 'warning' },
        { msg: 'Neural bandwidth optimized', type: 'info' },
        { msg: 'Mutation marker CHR-X fluctuating', type: 'warning' },
        { msg: 'DNA integrity check passed', type: 'info' },
        { msg: 'Pulmonary capacity within range', type: 'info' },
        { msg: 'Nanite debris accumulation detected', type: 'warning' },
        { msg: 'Synaptic throughput increased 2.1%', type: 'info' },
        { msg: 'Liver regeneration cycle complete', type: 'info' },
        { msg: 'Radiation shielding holding', type: 'info' },
        { msg: 'GI flora population shifting', type: 'warning' },
        { msg: 'Cardiac output optimized', type: 'info' },
        { msg: 'Blood pressure nominal', type: 'info' },
        { msg: 'Thermal regulation stable', type: 'info' },
        { msg: 'Immune response calibrated', type: 'info' },
        { msg: 'Neural latency spike detected', type: 'warning' },
        { msg: 'Organ status matrix updated', type: 'info' }
    ];

    function addLogEntry() {
        const container = document.getElementById('log-entries');
        if (!container) return;

        const entry = logMessages[randInt(0, logMessages.length - 1)];
        const time = formatTime(new Date());

        const div = document.createElement('div');
        div.className = `log-entry ${entry.type === 'warning' ? 'warning' : ''}`;
        div.innerHTML = `<span class="log-time">${time}</span><span class="log-msg">${entry.msg}</span>`;

        container.appendChild(div);

        // Keep only last 4 entries
        while (container.children.length > 4) {
            container.removeChild(container.firstChild);
        }
    }

    setInterval(addLogEntry, 4000);

    // ========================================================
    // ALERT COUNT FLICKER
    // ========================================================
    function updateAlertCount() {
        const el = document.getElementById('alert-count');
        if (el && Math.random() < 0.1) {
            el.textContent = randInt(2, 5);
        }
    }
    setInterval(updateAlertCount, 5000);

    // ========================================================
    // ORGAN CARD INTERACTION
    // ========================================================
    function setupOrganCardInteraction() {
        const cards = document.querySelectorAll('.organ-card');
        const hotspots = document.querySelectorAll('.hotspot');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const organ = card.dataset.organ;
                hotspots.forEach(h => {
                    if (h.dataset.hotspot === organ) {
                        h.style.opacity = '0.7';
                        h.style.stroke = '#00ff88';
                        h.style.strokeWidth = '2';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                const organ = card.dataset.organ;
                hotspots.forEach(h => {
                    if (h.dataset.hotspot === organ) {
                        h.style.opacity = '';
                        h.style.stroke = '';
                        h.style.strokeWidth = '';
                    }
                });
            });
        });
    }

    // ========================================================
    // ANATOMICAL SCAN RINGS — sync to heartbeat
    // ========================================================
    function syncScanRingsToHeartbeat() {
        const rings = document.querySelectorAll('.anatomy-scan-ring');
        const interval = 72 / 60 * 1000; // ms per beat at 72 BPM

        rings.forEach((ring, i) => {
            ring.style.animationDuration = (interval * 2 / 1000) + 's';
            ring.style.animationDelay = (i * 0.3) + 's';
        });
    }

    // ========================================================
    // MUTATION TIMELINE DRIFT
    // ========================================================
    function driftMutationTimeline() {
        const progress = document.querySelector('.timeline-progress');
        const marker = document.querySelector('.timeline-marker');

        if (progress && marker) {
            let current = parseFloat(progress.style.width) || 34;
            current = clamp(current + rand(-0.5, 0.7), 25, 55);
            progress.style.width = current + '%';
            marker.style.left = current + '%';
        }
    }

    setInterval(driftMutationTimeline, 3000);

    // ========================================================
    // PERIODIC ORGAN STATUS BADGE UPDATES
    // ========================================================
    function updateOrganBadges() {
        const badges = document.querySelectorAll('.organ-status-badge');
        badges.forEach(badge => {
            if (Math.random() < 0.02) {
                // Very occasionally flicker a status
                badge.style.opacity = '0.3';
                setTimeout(() => { badge.style.opacity = ''; }, 200);
            }
        });
    }
    setInterval(updateOrganBadges, 2000);

    // ========================================================
    // GENE MATRIX CELL ANIMATION
    // ========================================================
    function animateGeneCells() {
        const cells = document.querySelectorAll('.hex-cell');
        if (cells.length === 0) return;

        // Randomly toggle a few cells
        const count = randInt(1, 3);
        for (let i = 0; i < count; i++) {
            const cell = cells[randInt(0, cells.length - 1)];
            cell.style.filter = 'brightness(2)';
            setTimeout(() => { cell.style.filter = ''; }, 300);
        }
    }
    setInterval(animateGeneCells, 1500);

    // ========================================================
    // HEARTBEAT-DRIVEN LAYOUT PULSE
    // ========================================================
    function heartbeatLayoutPulse() {
        const container = document.getElementById('hud-container');
        if (!container) return;

        // Subtle scale pulse synced to ~72 BPM
        container.style.transform = 'scale(1.001)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 150);
    }

    setInterval(heartbeatLayoutPulse, 60000 / 72);

    // ========================================================
    // SCAN LINE TIMING RANDOMIZATION
    // ========================================================
    function randomizeScanLine() {
        const scanLine = document.querySelector('.scan-line');
        if (scanLine && Math.random() < 0.3) {
            const duration = rand(3, 6).toFixed(1);
            scanLine.style.animationDuration = duration + 's';
        }
    }
    setInterval(randomizeScanLine, 8000);

    // ========================================================
    // INITIALIZATION
    // ========================================================
    function init() {
        new HeartbeatECG('heartbeat-canvas');
        new NaniteField('nanite-field');
        new NeuralNetwork('neural-canvas');
        new NaniteSwarm('nanite-swarm-canvas');
        generateGeneMatrix();
        setupOrganCardInteraction();
        syncScanRingsToHeartbeat();

        // Log initial entry
        setTimeout(() => {
            addLogEntry();
        }, 1500);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
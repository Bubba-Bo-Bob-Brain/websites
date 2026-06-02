/* ═══════════════════════════════════════════════════════════════
   BIOPUNK MEDICAL SCAN HUD — JAVASCRIPT CONTROLLER
   Cybernetic Patient Diagnostics Interface v4.7.2
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ───── UTILITY FUNCTIONS ─────
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

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    // ───── GRAIN NOISE CANVAS ─────
    const grainCanvas = document.getElementById('grainCanvas');
    const grainCtx = grainCanvas.getContext('2d');

    function resizeGrainCanvas() {
        grainCanvas.width = window.innerWidth;
        grainCanvas.height = window.innerHeight;
    }

    function drawGrain() {
        const w = grainCanvas.width;
        const h = grainCanvas.height;
        const imageData = grainCtx.createImageData(w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 18;
        }

        grainCtx.putImageData(imageData, 0, 0);
    }

    resizeGrainCanvas();
    drawGrain();
    window.addEventListener('resize', () => {
        resizeGrainCanvas();
        drawGrain();
    });

    // Redraw grain periodically for animated texture
    setInterval(drawGrain, 100);

    // ───── TIMESTAMP ─────
    const timestampEl = document.getElementById('timestamp');

    function updateTimestamp() {
        const now = new Date();
        const year = now.getFullYear() + 480; // futuristic year
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        timestampEl.textContent = `${year}.${month}.${day} // ${hours}:${mins}:${secs} UTC`;
    }

    updateTimestamp();
    setInterval(updateTimestamp, 1000);

    // ───── EKG / HEARTBEAT ANIMATION ─────
    const ekgTrace = document.getElementById('ekgTrace');
    const bpmDisplay = document.getElementById('bpmDisplay');
    let currentBPM = 72;
    let heartRateTarget = 72;

    function generateEKGPoints() {
        const points = [];
        const width = 300;
        const baseline = 40;
        const amplitude = 25;
        let x = 0;

        // P wave
        for (let i = 0; i < 15; i++) {
            const y = baseline + Math.sin((i / 15) * Math.PI) * 5 * (i / 15);
            points.push(`${x},${y.toFixed(1)}`);
            x += 2;
        }
        // PR segment
        for (let i = 0; i < 10; i++) {
            points.push(`${x},${baseline.toFixed(1)}`);
            x += 2;
        }
        // QRS complex
        // Q dip
        for (let i = 0; i < 5; i++) {
            const y = baseline - (i / 5) * 3;
            points.push(`${x},${y.toFixed(1)}`);
            x += 1;
        }
        // R spike
        for (let i = 0; i < 5; i++) {
            const y = baseline + (i / 5) * amplitude;
            points.push(`${x},${y.toFixed(1)}`);
            x += 1;
        }
        for (let i = 5; i > 0; i--) {
            const y = baseline + (i / 5) * amplitude * 0.3;
            points.push(`${x},${y.toFixed(1)}`);
            x += 1;
        }
        // S dip
        for (let i = 0; i < 4; i++) {
            const y = baseline - (i / 4) * 4;
            points.push(`${x},${y.toFixed(1)}`);
            x += 1;
        }
        // ST segment
        for (let i = 0; i < 15; i++) {
            points.push(`${x},${baseline.toFixed(1)}`);
            x += 2;
        }
        // T wave
        for (let i = 0; i < 20; i++) {
            const y = baseline + Math.sin((i / 20) * Math.PI) * 8;
            points.push(`${x},${y.toFixed(1)}`);
            x += 2;
        }
        // Fill rest with baseline
        while (x < width) {
            points.push(`${x},${baseline + (Math.random() - 0.5) * 1.5}`);
            x += 2;
        }

        return points.join(' ');
    }

    function updateEKG() {
        ekgTrace.setAttribute('points', generateEKGPoints());

        // Fluctuate BPM
        heartRateTarget = lerp(heartRateTarget, rand(65, 95), 0.02);
        currentBPM = lerp(currentBPM, heartRateTarget, 0.1);
        bpmDisplay.innerHTML = `${Math.round(currentBPM)} <span class="unit">BPM</span>`;

        // Drive heartbeat overlay
        const beatOverlay = document.getElementById('heartBeatOverlay');
        if (beatOverlay) {
            beatOverlay.style.animation = 'none';
            beatOverlay.offsetHeight; // trigger reflow
            beatOverlay.style.animation = `heartBeat ${60 / currentBPM}s ease-in-out infinite`;
        }
    }

    setInterval(updateEKG, 800);
    updateEKG();

    // ───── ORGAN STAT FLUCTUATIONS ─────
    const statElements = {
        heartPressure: { base: [118, 78], range: [5, 8] },
        cardiacOutput: { base: 5.2, range: 0.4 },
        o2Sat: { base: 91.2, range: 1.5 },
        respRate: { base: 18, range: 2 },
        liverEnzyme: { base: 342, range: 40 },
        toxinProc: { base: 67, range: 5 },
        gfr: { base: 48, range: 4 },
        creatinine: { base: 2.1, range: 0.3 },
        synapticConn: { base: 2847, range: 120 },
        latency: { base: 3.2, range: 0.4 },
        throughput: { base: 4.7, range: 0.3 },
        signalClarity: { base: 94.7, range: 1.2 },
        coreTemp: { base: 37.2, range: 0.3 },
        bloodVol: { base: 5.1, range: 0.1 },
        bpSystolic: { base: 120, range: 8 },
    };

    function fluctuateStat(id, format, baseKey) {
        const config = statElements[baseKey];
        if (!config) return;
        const value = rand(config.base - config.range, config.base + config.range);
        const el = document.getElementById(id);
        if (!el) return;

        if (format === 'pressure') {
            const sys = Math.round(value);
            const dia = Math.round(value * 0.67);
            el.textContent = `${sys}/${dia}`;
        } else if (format === 'decimal') {
            el.textContent = value.toFixed(1);
        } else if (format === 'int') {
            el.textContent = Math.round(value);
        } else if (format === 'percent') {
            el.textContent = `${value.toFixed(1)}%`;
        } else if (format === 'mgdl') {
            el.textContent = `${value.toFixed(1)} mg/dL`;
        } else if (format === 'lum') {
            el.textContent = `${value.toFixed(1)} L/m`;
        } else if (format === 'ms') {
            el.textContent = `${value.toFixed(1)}ms`;
        } else if (format === 'tbs') {
            el.textContent = `${value.toFixed(1)} TB/s`;
        } else if (format === 'celsius') {
            el.textContent = `${value.toFixed(1)}°C`;
        } else if (format === 'liters') {
            el.textContent = `${value.toFixed(1)}L`;
        } else if (format === 'xnorm') {
            el.textContent = `${value.toFixed(1)}x NORM`;
        } else {
            el.textContent = value.toFixed(1);
        }
    }

    function updateAllStats() {
        fluctuateStat('heartPressure', 'pressure', 'heartPressure');
        fluctuateStat('cardiacOutput', 'lum', 'cardiacOutput');
        fluctuateStat('o2Sat', 'percent', 'o2Sat');
        fluctuateStat('respRate', 'int', 'respRate');
        fluctuateStat('liverEnzyme', 'int', 'liverEnzyme');
        fluctuateStat('toxinProc', 'percent', 'toxinProc');
        fluctuateStat('gfr', 'lum', 'gfr');
        fluctuateStat('creatinine', 'mgdl', 'creatinine');
        fluctuateStat('synapticConn', 'int', 'synapticConn');
        fluctuateStat('latency', 'ms', 'latency');
        fluctuateStat('throughput', 'tbs', 'throughput');
        fluctuateStat('signalClarity', 'percent', 'signalClarity');
        fluctuateStat('coreTemp', 'celsius', 'coreTemp');
        fluctuateStat('bloodVol', 'liters', 'bloodVol');
        fluctuateStat('bpSystolic', 'int', 'bpSystolic');
    }

    setInterval(updateAllStats, 1500);

    // ───── PROGRESS BAR ANIMATIONS ─────
    function animateBars() {
        // Heart bar
        const heartBar = document.getElementById('heartBar');
        const newHeart = rand(88, 98);
        heartBar.style.width = newHeart + '%';
        heartBar.querySelector('.bar-text').textContent = Math.round(newHeart) + '%';

        // Myocardial bar
        const myoBar = document.getElementById('myoBar');
        const newMyo = rand(70, 88);
        myoBar.style.width = newMyo + '%';
        myoBar.querySelector('.bar-text').textContent = Math.round(newMyo) + '%';

        // Lung bar
        const lungBar = document.getElementById('lungBar');
        const newLung = rand(65, 80);
        lungBar.style.width = newLung + '%';
        lungBar.querySelector('.bar-text').textContent = Math.round(newLung) + '%';

        // Filter bar
        const filterBar = document.getElementById('filterBar');
        const newFilter = rand(35, 55);
        filterBar.style.width = newFilter + '%';
        filterBar.querySelector('.bar-text').textContent = Math.round(newFilter) + '% — REPLACE REQUIRED';

        // Liver bars
        const liverBar = document.getElementById('liverBar');
        const newLiver = rand(30, 45);
        liverBar.style.width = newLiver + '%';
        liverBar.querySelector('.bar-text').textContent = Math.round(newLiver) + '%';

        const regenBar = document.getElementById('regenBar');
        const newRegen = rand(45, 60);
        regenBar.style.width = newRegen + '%';
        regenBar.querySelector('.bar-text').textContent = Math.round(newRegen) + '%';

        // Kidney bars
        const klBar = document.getElementById('kidneyLeftBar');
        const newKL = rand(48, 60);
        klBar.style.width = newKL + '%';
        klBar.querySelector('.bar-text').textContent = Math.round(newKL) + '%';

        const krBar = document.getElementById('kidneyRightBar');
        const newKR = rand(40, 55);
        krBar.style.width = newKR + '%';
        krBar.querySelector('.bar-text').textContent = Math.round(newKR) + '%';

        // Nano density
        const nanoDensity = document.getElementById('nanoDensity');
        const newNano = rand(72, 86);
        nanoDensity.style.width = newNano + '%';
        nanoDensity.querySelector('.bar-text').textContent = Math.round(newNano) + '%';
    }

    setInterval(animateBars, 3000);

    // ───── MUTATION PROGRESSION ─────
    const mutationProgress = document.getElementById('mutationProgress');
    let currentMutationPct = 67;

    function updateMutation() {
        currentMutationPct += rand(-0.5, 0.8);
        currentMutationPct = clamp(currentMutationPct, 0, 100);
        mutationProgress.style.width = currentMutationPct + '%';

        // Update codon rewrites
        const codonEl = document.getElementById('codonRewrites');
        codonEl.textContent = `${(parseInt(codonRewrites.textContent.replace(/,/g, '')) || 1247) + randInt(0, 3)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    setInterval(updateMutation, 2000);

    // ───── TOXIN ALERT SYSTEM ─────
    const toxinAlert = document.getElementById('toxinAlert');
    let alertVisible = true;

    function toggleAlert() {
        alertVisible = !alertVisible;
        toxinAlert.style.display = alertVisible ? 'flex' : 'none';
    }

    // Flicker alert periodically
    setInterval(() => {
        if (Math.random() > 0.6) {
            toxinAlert.style.opacity = '0.3';
            setTimeout(() => { toxinAlert.style.opacity = '1'; }, 150);
        }
    }, 4000);

    // ───── NANOMACHINE CANVAS ─────
    const nanoCanvas = document.getElementById('nanomachineCanvas');
    const nanoCtx = nanoCanvas.getContext('2d');
    let nanoParticles = [];

    function resizeNanoCanvas() {
        const rect = nanoCanvas.parentElement.getBoundingClientRect();
        nanoCanvas.width = rect.width - 28;
        nanoCanvas.height = 120;
    }

    function initNanoParticles() {
        nanoParticles = [];
        const count = 80;
        for (let i = 0; i < count; i++) {
            nanoParticles.push({
                x: rand(0, nanoCanvas.width),
                y: rand(0, nanoCanvas.height),
                vx: rand(-0.5, 0.5),
                vy: rand(-0.3, 0.3),
                r: rand(1, 2.5),
                alpha: rand(0.2, 0.8),
                pulse: rand(0, Math.PI * 2),
                connections: []
            });
        }
    }

    function drawNano() {
        nanoCtx.clearRect(0, 0, nanoCanvas.width, nanoCanvas.height);

        // Update positions
        nanoParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += 0.05;

            if (p.x < 0 || p.x > nanoCanvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > nanoCanvas.height) p.vy *= -1;
            p.x = clamp(p.x, 0, nanoCanvas.width);
            p.y = clamp(p.y, 0, nanoCanvas.height);
        });

        // Draw connections
        for (let i = 0; i < nanoParticles.length; i++) {
            for (let j = i + 1; j < nanoParticles.length; j++) {
                const dx = nanoParticles[i].x - nanoParticles[j].x;
                const dy = nanoParticles[i].y - nanoParticles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 50) {
                    const alpha = (1 - dist / 50) * 0.2;
                    nanoCtx.beginPath();
                    nanoCtx.moveTo(nanoParticles[i].x, nanoParticles[i].y);
                    nanoCtx.lineTo(nanoParticles[j].x, nanoParticles[j].y);
                    nanoCtx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
                    nanoCtx.lineWidth = 0.5;
                    nanoCtx.stroke();
                }
            }
        }

        // Draw particles
        nanoParticles.forEach(p => {
            const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
            nanoCtx.beginPath();
            nanoCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            nanoCtx.fillStyle = `rgba(0, 255, 255, ${pulseAlpha})`;
            nanoCtx.fill();

            // Glow
            nanoCtx.beginPath();
            nanoCtx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
            nanoCtx.fillStyle = `rgba(0, 255, 255, ${pulseAlpha * 0.15})`;
            nanoCtx.fill();
        });

        requestAnimationFrame(drawNano);
    }

    resizeNanoCanvas();
    initNanoParticles();
    drawNano();

    // ───── NEURAL LINK CANVAS ─────
    const neuralCanvas = document.getElementById('neuralCanvas');
    const neuralCtx = neuralCanvas.getContext('2d');
    let neuralNodes = [];

    function resizeNeuralCanvas() {
        neuralCanvas.width = neuralCanvas.parentElement.clientWidth;
        neuralCanvas.height = 80;
    }

    function initNeuralNodes() {
        neuralNodes = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            neuralNodes.push({
                x: rand(0, neuralCanvas.width),
                y: rand(10, neuralCanvas.height - 10),
                baseY: rand(10, neuralCanvas.height - 10),
                phase: rand(0, Math.PI * 2),
                amplitude: rand(3, 8),
                speed: rand(0.02, 0.06),
                radius: rand(1.5, 3),
                alpha: rand(0.4, 0.9)
            });
        }
    }

    function drawNeural() {
        neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
        const time = Date.now() * 0.001;

        // Update and draw connections
        for (let i = 0; i < neuralNodes.length; i++) {
            const node = neuralNodes[i];
            node.y = node.baseY + Math.sin(time * node.speed * 60 + node.phase) * node.amplitude;

            for (let j = i + 1; j < neuralNodes.length; j++) {
                const other = neuralNodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 60) {
                    const alpha = (1 - dist / 60) * 0.25;
                    const pulse = 0.6 + 0.4 * Math.sin(time * 2 + i);
                    neuralCtx.beginPath();
                    neuralCtx.moveTo(node.x, node.y);

                    // Curved connection
                    const midX = (node.x + other.x) / 2;
                    const midY = (node.y + other.y) / 2 + Math.sin(time + i) * 5;
                    neuralCtx.quadraticCurveTo(midX, midY, other.x, other.y);

                    neuralCtx.strokeStyle = `rgba(255, 0, 255, ${alpha * pulse})`;
                    neuralCtx.lineWidth = 0.8;
                    neuralCtx.stroke();
                }
            }
        }

        // Draw nodes
        neuralNodes.forEach(node => {
            const pulse = 0.6 + 0.4 * Math.sin(time * 3 + node.phase);
            neuralCtx.beginPath();
            neuralCtx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
            neuralCtx.fillStyle = `rgba(255, 0, 255, ${node.alpha * pulse})`;
            neuralCtx.fill();

            // Glow
            neuralCtx.beginPath();
            neuralCtx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
            neuralCtx.fillStyle = `rgba(255, 0, 255, ${node.alpha * pulse * 0.1})`;
            neuralCtx.fill();
        });

        // Traveling signal
        const signalX = (time * 30) % (neuralCanvas.width + 40) - 20;
        neuralCtx.beginPath();
        neuralCtx.arc(signalX, neuralCanvas.height / 2, 3, 0, Math.PI * 2);
        neuralCtx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        neuralCtx.fill();
        neuralCtx.beginPath();
        neuralCtx.arc(signalX, neuralCanvas.height / 2, 6, 0, Math.PI * 2);
        neuralCtx.fillStyle = 'rgba(0, 255, 255, 0.15)';
        neuralCtx.fill();

        requestAnimationFrame(drawNeural);
    }

    resizeNeuralCanvas();
    initNeuralNodes();
    drawNeural();

    // ───── SWARM CANVAS (footer) ─────
    const swarmCanvas = document.getElementById('swarmCanvas');
    const swarmCtx = swarmCanvas.getContext('2d');
    let swarmParticles = [];

    function resizeSwarmCanvas() {
        swarmCanvas.width = swarmCanvas.parentElement.clientWidth;
        swarmCanvas.height = 40;
    }

    function initSwarmParticles() {
        swarmParticles = [];
        const count = 60;
        for (let i = 0; i < count; i++) {
            swarmParticles.push({
                x: rand(0, swarmCanvas.width),
                y: rand(0, swarmCanvas.height),
                vx: rand(-0.8, 0.8),
                vy: rand(-0.3, 0.3),
                r: rand(1, 2),
                alpha: rand(0.2, 0.7),
                phase: rand(0, Math.PI * 2)
            });
        }
    }

    function drawSwarm() {
        swarmCtx.clearRect(0, 0, swarmCanvas.width, swarmCanvas.height);
        const time = Date.now() * 0.001;

        swarmParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy + Math.sin(time + p.phase) * 0.2;

            if (p.x < 0) p.x = swarmCanvas.width;
            if (p.x > swarmCanvas.width) p.x = 0;
            if (p.y < 0) p.y = swarmCanvas.height;
            if (p.y > swarmCanvas.height) p.y = 0;

            const pulse = 0.5 + 0.5 * Math.sin(time * 2 + p.phase);
            swarmCtx.beginPath();
            swarmCtx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
            swarmCtx.fillStyle = `rgba(0, 255, 136, ${p.alpha * pulse})`;
            swarmCtx.fill();
        });

        // Draw flow lines
        swarmCtx.beginPath();
        swarmCtx.moveTo(0, swarmCanvas.height / 2);
        for (let x = 0; x < swarmCanvas.width; x += 5) {
            const y = swarmCanvas.height / 2 + Math.sin(x * 0.02 + time) * 8 + Math.sin(x * 0.05 + time * 1.5) * 4;
            swarmCtx.lineTo(x, y);
        }
        swarmCtx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
        swarmCtx.lineWidth = 2;
        swarmCtx.stroke();

        requestAnimationFrame(drawSwarm);
    }

    resizeSwarmCanvas();
    initSwarmParticles();
    drawSwarm();

    // ───── NANITE COUNT ANIMATION ─────
    const activeNanitesEl = document.getElementById('activeNanites');
    const reservePoolEl = document.getElementById('reservePool');
    let displayedNanites = 2847391;
    let displayedReserve = 842100;

    function updateNaniteCount() {
        displayedNanites += randInt(-500, 800);
        displayedNanites = clamp(displayedNanites, 2000000, 3500000);
        displayedReserve += randInt(-200, 300);
        displayedReserve = clamp(displayedReserve, 500000, 1200000);
        activeNanitesEl.textContent = displayedNanites.toLocaleString();
        reservePoolEl.textContent = displayedReserve.toLocaleString();

        // Deploy zones
        const zones = randInt(6, 8);
        document.getElementById('deployZones').textContent = `${zones}/8`;
    }

    setInterval(updateNaniteCount, 1200);

    // ───── DATA PARTICLES (floating background) ─────
    const dataParticlesEl = document.getElementById('dataParticles');

    function createDataParticles() {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            const hue = randInt(160, 280);
            particle.style.background = `hsla(${hue}, 80%, 60%, 0.6)`;
            particle.style.left = `${rand(0, 100)}%`;
            particle.style.animationDuration = `${rand(8, 20)}s`;
            particle.style.animationDelay = `${rand(0, 15)}s`;
            particle.style.width = `${rand(1, 3)}px`;
            particle.style.height = particle.style.width;
            dataParticlesEl.appendChild(particle);
        }
    }

    createDataParticles();

    // ───── CROSSHAIR FOLLOWS MOUSE ─────
    const crosshair = document.getElementById('crosshair');
    const centerColumn = document.querySelector('.center-column');

    centerColumn.addEventListener('mousemove', (e) => {
        const rect = centerColumn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        crosshair.style.left = `${x}px`;
        crosshair.style.top = `${y}px`;
    });

    centerColumn.addEventListener('mouseleave', () => {
        crosshair.style.opacity = '0.3';
    });

    centerColumn.addEventListener('mouseenter', () => {
        crosshair.style.opacity = '1';
    });

    // ───── DIAGNOSTIC LATENCY & FPS ─────
    const diagLatency = document.getElementById('diagLatency');
    const diagFrame = document.getElementById('diagFrame');
    let frameCount = 0;
    let lastFpsTime = performance.now();

    function updateDiagnostics() {
        // Simulate latency
        diagLatency.textContent = `${rand(1.2, 3.8).toFixed(1)}ms`;
    }

    function updateFPS() {
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
            diagFrame.textContent = `${frameCount} FPS`;
            frameCount = 0;
            lastFpsTime = now;
        }
        requestAnimationFrame(updateFPS);
    }

    setInterval(updateDiagnostics, 2000);
    updateFPS();

    // ───── EMERGENCY BUTTON HANDLERS ─────
    const emergencyDot = document.getElementById('emergencyDot');
    const emergencyStatus = document.getElementById('emergencyStatus');

    const btnNanodoc = document.getElementById('btnNanodoc');
    const btnStabilize = document.getElementById('btnStabilize');
    const btnCryo = document.getElementById('btnCryo');
    const btnFlush = document.getElementById('btnFlush');

    function activateEmergency(button, protocolName) {
        button.style.transform = 'scale(0.95)';
        button.style.boxShadow = 'inset 0 0 30px rgba(255,255,255,0.1)';
        emergencyStatus.textContent = `ACTIVE — ${protocolName}`;
        emergencyDot.style.background = 'var(--red)';
        emergencyDot.style.boxShadow = '0 0 8px var(--red)';

        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 0, 64, 0.05); z-index: 9999; pointer-events: none;
            animation: flashFade 0.4s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 400);

        setTimeout(() => {
            emergencyStatus.textContent = 'STANDBY';
            emergencyDot.style.background = 'var(--amber)';
            emergencyDot.style.boxShadow = '0 0 8px var(--amber)';
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 3000);
    }

    // Inject flash animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flashFade {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    btnNanodoc.addEventListener('click', () => activateEmergency(btnNanodoc, 'NANO-DOC DEPLOY'));
    btnStabilize.addEventListener('click', () => activateEmergency(btnStabilize, 'FULL STABILIZE'));
    btnCryo.addEventListener('click', () => activateEmergency(btnCryo, 'CRYO LOCK'));
    btnFlush.addEventListener('click', () => activateEmergency(btnFlush, 'SYSTEM FLUSH'));

    // ───── ALERT POPUP SYSTEM ─────
    const alertPopup = document.getElementById('alertPopup');
    const alertTimer = document.getElementById('alertTimer');

    function showAlert() {
        alertPopup.classList.add('visible');
        let seconds = randInt(3, 8);
        alertTimer.textContent = `AUTO-RESOLVE IN: 00:${String(seconds).padStart(2, '0')}`;

        const countdown = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(countdown);
                alertPopup.classList.remove('visible');
                // Schedule next alert
                scheduleNextAlert();
            }
            alertTimer.textContent = `AUTO-RESOLVE IN: 00:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    function scheduleNextAlert() {
        setTimeout(() => {
            showAlert();
        }, randInt(8000, 20000));
    }

    // Initial alert after a delay
    setTimeout(showAlert, 5000);

    // ───── ALERT TEXT ROTATION ─────
    const alertMessages = [
        'CYANIDE METABOLITE LEVELS CRITICAL — ADMINISTERING COUNTERMEASURE PROTOCOL',
        'NANITE AGGREGATION DETECTED IN HEPATIC ZONE — DISPERSAL INITIATED',
        'NEURAL LINK FLUCTUATION DETECTED — RECALIBRATING SYNAPTIC ARRAY',
        'O₂ SATURATION DROP — INCREASING RESPIRATORY ASSIST OUTPUT',
        'NANOFILTER EFFICIENCY DEGRADING — INITIATING BACKFLUSH CYCLE',
        'SYNTH-VALVE MICRO-FRACTURE DETECTED — SEALANT NANITES DEPLOYED',
        'ELEVATED RADIATION EXPOSURE — SHIELDING PROTOCOL ACTIVATED',
        'METABOLIC SURGE DETECTED — ADRENALINE ANALOG INJECTED',
    ];

    const alertBody = document.getElementById('alertBody');
    let alertIndex = 0;

    // Rotate alert messages on each popup
    const origShowAlert = showAlert;
    showAlert = function () {
        alertBody.textContent = alertMessages[alertIndex % alertMessages.length];
        alertIndex++;
        alertPopup.classList.add('visible');
        let seconds = randInt(3, 8);
        alertTimer.textContent = `AUTO-RESOLVE IN: 00:${String(seconds).padStart(2, '0')}`;

        const countdown = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(countdown);
                alertPopup.classList.remove('visible');
                scheduleNextAlert();
            }
            alertTimer.textContent = `AUTO-RESOLVE IN: 00:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    };

    // ───── GENE-SPLICE MATRIX GENERATION ─────
    const matrixGrid = document.getElementById('matrixGrid');
    const spliceTypes = ['CRISPR-7', 'NEO-SPLICE', 'AUG-X', 'BIO-9', 'SYNTH-DELTA'];
    const sampleTypes = ['BLOOD', 'TISSUE', 'NEURAL', 'BONE', 'DERMA'];

    // Header row
    const cornerCell = document.createElement('div');
    cornerCell.className = 'matrix-header';
    cornerCell.textContent = '';
    matrixGrid.appendChild(cornerCell);

    spliceTypes.forEach(type => {
        const header = document.createElement('div');
        header.className = 'matrix-header';
        header.textContent = type;
        matrixGrid.appendChild(header);
    });

    // Data rows
    sampleTypes.forEach(sample => {
        const label = document.createElement('div');
        label.className = 'matrix-row-label';
        label.textContent = sample;
        matrixGrid.appendChild(label);

        spliceTypes.forEach(() => {
            const cell = document.createElement('div');
            const randVal = Math.random();
            if (randVal < 0.5) {
                cell.className = 'matrix-compatible';
                cell.textContent = '✓';
            } else if (randVal < 0.75) {
                cell.className = 'matrix-partial';
                cell.textContent = '~';
            } else if (randVal < 0.9) {
                cell.className = 'matrix-reject';
                cell.textContent = '✗';
            } else {
                cell.className = 'matrix-untested';
                cell.textContent = '?';
            }
            matrixGrid.appendChild(cell);
        });
    });

    // ───── WINDOW RESIZE HANDLER ─────
    window.addEventListener('resize', () => {
        resizeNanoCanvas();
        resizeNeuralCanvas();
        resizeSwarmCanvas();
        initNeuralNodes();
        initSwarmParticles();
    });

    // ───── INITIALIZATION LOG ─────
    console.log('%c BIOPUNK MEDICAL SCAN HUD v4.7.2 ', 'background: #0a080e; color: #00ffff; font-size: 14px; padding: 8px; border: 1px solid #00ffff; font-family: monospace;');
    console.log('%c All diagnostic systems initialized ', 'background: #0a080e; color: #00ff88; font-size: 11px; padding: 4px; font-family: monospace;');

})();
/* ═══════════════════════════════════════════════════════════════
   NEXUS-7 BIOPUNK MEDICAL SCANNER — JAVASCRIPT ENGINE
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ──────── UTILITY FUNCTIONS ────────
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    function formatNum(n, decimals = 1) {
        return parseFloat(n.toFixed(decimals)).toString();
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // ──────── SYSTEM LOG ────────
    const logMessages = [
        '[NEXUS-7] Biometric sweep initiated.',
        '[WARN] Cytokine levels fluctuating in sector 4.',
        '[OK] Nanomachine swarm re-calibrated.',
        '[ALERT] Telomeric degradation detected — chromosome 17.',
        '[SYS] Neural handshake verified — latency nominal.',
        '[INFO] Hepatic filtration rate exceeding baseline.',
        '[WARN] Trace heavy metals detected in bloodstream.',
        '[SYS] Gene-splice matrix recalculating compatibilities.',
        '[OK] Cardiac rhythm synchronized with synth-aorta.',
        '[INFO] Cortical buffer flush complete — 0.3s lag.',
        '[ALERT] Cytosolic toxin threshold approaching — liver sector.',
        '[SYS] Quantum-encrypted patient data archived.',
        '[OK] O₂ exchange rate within augmented parameters.',
        '[WARN] Detected minor rejection at neural graft site C7.',
        '[SYS] Holographic overlay rendering stable.',
        '[INFO] Bone density scan — titanium implants nominal.',
        '[SYS] Updating pharmacokinetic model...',
        '[OK] Endocrine panel — synthetic insulin regulation optimal.',
        '[ALERT] Sporadic signal degradation in motor cortex relay.',
        '[SYS] Running deep tissue spectrography.',
        '[INFO] Microbiome analysis — gut flora 73% synthetic.',
        '[WARN] Electromagnetic interference from cranial implant.',
        '[OK] Wound regeneration — dermal layer 84% healed.',
        '[SYS] Bioelectric field mapping — phase 3 of 5.',
        '[INFO] Patient circadian rhythm — desynchronized.',
    ];

    const logEl = document.getElementById('log-text');
    let currentLogIndex = 0;

    function updateLog() {
        const text = logMessages[currentLogIndex];
        let displayed = '';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < text.length) {
                displayed += text[charIndex];
                logEl.textContent = displayed + '█';
                charIndex++;
                setTimeout(typeChar, randInt(15, 45));
            } else {
                setTimeout(() => {
                    const cursor = document.querySelector('#log-text');
                    cursor.textContent = text;
                    setTimeout(() => {
                        currentLogIndex = (currentLogIndex + 1) % logMessages.length;
                        updateLog();
                    }, 2200);
                }, 600);
            }
        }
        typeChar();
    }

    // ──────── TIMESTAMP ────────
    function updateTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('timestamp').textContent =
            `${year}.${month}.${day} — ${hours}:${mins}:${secs}`;
    }

    // ──────── VITAL SIGNS (fluctuating) ────────
    let vitals = {
        heartRate: 72,
        spo2: 98.4,
        bpSystolic: 124,
        bpDiastolic: 78,
        temp: 36.7,
        synthSat: 94.2,
    };

    function updateVitals() {
        vitals.heartRate = clamp(vitals.heartRate + rand(-2, 2), 60, 110);
        vitals.spo2 = clamp(vitals.spo2 + rand(-0.3, 0.3), 95, 100);
        vitals.bpSystolic = clamp(vitals.bpSystolic + rand(-3, 3), 105, 145);
        vitals.bpDiastolic = clamp(vitals.bpDiastolic + rand(-2, 2), 60, 92);
        vitals.temp = clamp(vitals.temp + rand(-0.15, 0.15), 35.8, 37.8);
        vitals.synthSat = clamp(vitals.synthSat + rand(-0.5, 0.5), 88, 99);

        document.getElementById('heart-rate').textContent = `${Math.round(vitals.heartRate)} BPM`;
        document.getElementById('spo2').textContent = `${vitals.spo2.toFixed(1)}%`;
        document.getElementById('blood-pressure').textContent = `${vitals.bpSystolic}/${vitals.bpDiastolic}`;
        document.getElementById('body-temp').textContent = `${vitals.temp.toFixed(1)}°C`;
        document.getElementById('synth-sat').textContent = `${vitals.synthSat.toFixed(1)}%`;
    }

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    // ──────── MUTATION PROGRESSION ────────
    let mutState = { stage: 67, genomeIntegrity: 72.4, anomalies: 14, telomere: 4.2, rate: 0.3 };

    function updateMutation() {
        mutState.stage = clamp(mutState.stage + rand(-0.2, 0.25), 0, 100);
        mutState.genomeIntegrity = clamp(mutState.genomeIntegrity + rand(-0.3, 0.1), 0, 100);
        mutState.anomalies = clamp(mutState.anomalies + (Math.random() < 0.05 ? randInt(-1, 1) : 0), 0, 46);
        mutState.telomere = clamp(mutState.telomere + rand(-0.05, 0.02), 0, 15);
        mutState.rate = clamp(mutState.rate + rand(-0.05, 0.05), 0, 2);

        const stageLabels = ['I-A', 'I-B', 'I-C', 'II-A', 'II-B', 'II-C', 'III-A', 'III-B', 'III-C', 'IV-A', 'IV-B'];
        const stageIndex = Math.min(Math.floor(mutState.stage / 10), stageLabels.length - 1);

        document.getElementById('mut-stage').textContent = stageLabels[stageIndex];
        document.getElementById('mut-bar').style.width = mutState.stage + '%';
        document.getElementById('genome-int').textContent = mutState.genomeIntegrity.toFixed(1) + '%';
        document.getElementById('chrom-anom').textContent = mutState.anomalies;
        document.getElementById('telomere').textContent = mutState.telomere.toFixed(1) + 'kb';
        document.getElementById('prog-rate').textContent = '+' + mutState.rate.toFixed(1) + '%/day';

        document.getElementById('genome-int').className = 'stat-value ' +
            (mutState.genomeIntegrity < 50 ? 'bad' : mutState.genomeIntegrity < 75 ? 'warn' : '');
        document.getElementById('prog-rate').className = 'stat-value ' +
            (mutState.rate > 1 ? 'bad' : mutState.rate > 0.5 ? 'warn' : '');
    }

    // ──────── MUTATION WAVE ANIMATION ────────
    let mutationWaveOffset = 0;
    function animateMutationWave() {
        mutationWaveOffset += 0.03;
        const wave = document.getElementById('mutation-wave');
        if (wave) {
            const offset = Math.sin(mutationWaveOffset) * 10;
            wave.style.transform = `translateX(${offset}px)`;
        }
        requestAnimationFrame(animateMutationWave);
    }

    // ──────── NEURAL LINK ────────
    let neuralState = { bandwidth: 2.4, latency: 2.3, packetLoss: 0.01, nodes: 10 };

    function updateNeural() {
        neuralState.bandwidth = clamp(neuralState.bandwidth + rand(-0.1, 0.1), 1.0, 3.5);
        neuralState.latency = clamp(neuralState.latency + rand(-0.3, 0.3), 1.0, 5.0);
        neuralState.packetLoss = clamp(neuralState.packetLoss + rand(-0.005, 0.005), 0, 0.5);

        document.getElementById('nw-bw').textContent = neuralState.bandwidth.toFixed(1) + ' TB/s';
        document.getElementById('nw-lat').textContent = neuralState.latency.toFixed(1) + 'ms';
        document.getElementById('nw-lat').className = 'stat-value ' +
            (neuralState.latency > 4 ? 'bad' : neuralState.latency > 3 ? 'warn' : 'good');
        document.getElementById('nw-loss').textContent = neuralState.packetLoss.toFixed(2) + '%';
        document.getElementById('nw-nodes').textContent = `${neuralState.nodes}/12`;

        const nodeElements = document.querySelectorAll('.neural-node');
        nodeElements.forEach(node => {
            if (Math.random() < 0.02) {
                node.style.opacity = rand(0.3, 0.9);
            }
        });
    }

    // ──────── NANOMACHINE DEPLOYMENT ────────
    let nanoState = { active: 4.7, zones: 6, repair: 12.3, energy: 78.4, lastDeploy: 2 * 3600 + 47 * 60 + 12 };

    function updateNano() {
        nanoState.active = clamp(nanoState.active + rand(-0.05, 0.03), 3.0, 5.0);
        nanoState.energy = clamp(nanoState.energy + rand(-0.3, 0.2), 40, 100);
        nanoState.repair = clamp(nanoState.repair + rand(-1, 1), 2, 25);
        nanoState.lastDeploy++;

        const hrs = Math.floor(nanoState.lastDeploy / 3600);
        const mins = Math.floor((nanoState.lastDeploy % 3600) / 60);
        const secs = nanoState.lastDeploy % 60;

        document.getElementById('nano-active').textContent =
            `${nanoState.active.toFixed(1)}M / 5.0M`;
        document.getElementById('nano-zones').textContent =
            `${nanoState.zones}/6 — OPTIMAL`;
        document.getElementById('nano-repair').textContent =
            `+${nanoState.repair.toFixed(1)}%/hr`;
        document.getElementById('nano-energy').textContent =
            `${nanoState.energy.toFixed(1)}%`;
        document.getElementById('nano-last').textContent =
            `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} ago`;
    }

    // Animate nanomachine particles
    function animateNanoParticles() {
        const particles = document.querySelectorAll('.nano-particle');
        particles.forEach(p => {
            const dx = rand(-1.5, 1.5);
            const dy = rand(-1.5, 1.5);
            const currentX = parseFloat(p.getAttribute('cx'));
            const currentY = parseFloat(p.getAttribute('cy'));
            p.setAttribute('cx', currentX + dx * 0.05);
            p.setAttribute('cy', currentY + dy * 0.05);
        });
    }

    let nanoAnimId;
    function nanoFloatLoop() {
        animateNanoParticles();
        nanoAnimId = requestAnimationFrame(nanoFloatLoop);
    }

    // ──────── TOXIN LEVELS ────────
    let toxinState = {
        lead: 347, mercury: 89, cyanide: 12.4, nanoplastics: 1240,
        radiation: 0.84, ethanol: 0.02, chlorine: 22
    };

    const toxinThresholds = {
        lead: 500, mercury: 200, cyanide: 15, nanoplastics: 2000,
        radiation: 3.0, ethanol: 0.08, chlorine: 60
    };

    function updateToxins() {
        toxinState.lead = clamp(toxinState.lead + rand(-5, 5), 0, 600);
        toxinState.mercury = clamp(toxinState.mercury + rand(-2, 2), 0, 300);
        toxinState.cyanide = clamp(toxinState.cyanide + rand(-0.3, 0.3), 0, 25);
        toxinState.nanoplastics = clamp(toxinState.nanoplastics + rand(-15, 15), 0, 3000);
        toxinState.radiation = clamp(toxinState.radiation + rand(-0.05, 0.05), 0, 5);
        toxinState.ethanol = clamp(toxinState.ethanol + rand(-0.002, 0.002), 0, 0.15);
        toxinState.chlorine = clamp(toxinState.chlorine + rand(-1, 1), 0, 100);

        const toxinMap = [
            { key: 'lead', id: 'toxin-lead', valEl: 'toxin-lead-val', barEl: 'toxin-lead-bar', unit: 'ppm' },
            { key: 'mercury', id: 'toxin-hg', valEl: 'toxin-hg-val', barEl: 'toxin-hg-bar', unit: 'ppm' },
            { key: 'cyanide', id: 'toxin-cyan', valEl: 'toxin-cyan-val', barEl: 'toxin-cyan-bar', unit: 'ppm' },
            { key: 'nanoplastics', id: 'toxin-nano', valEl: 'toxin-nano-val', barEl: 'toxin-nano-bar', unit: 'ppm' },
            { key: 'radiation', id: 'toxin-rad', valEl: 'toxin-rad-val', barEl: 'toxin-rad-bar', unit: 'mSv' },
            { key: 'ethanol', id: 'toxin-eth', valEl: 'toxin-eth-val', barEl: 'toxin-eth-bar', unit: '%' },
            { key: 'chlorine', id: 'toxin-cl', valEl: 'toxin-cl-val', barEl: 'toxin-cl-bar', unit: 'ppm' },
        ];

        let maxLoad = 0;
        toxinMap.forEach(t => {
            const val = toxinState[t.key];
            const threshold = toxinThresholds[t.key];
            const pct = Math.min((val / (threshold * 2)) * 100, 100);

            document.getElementById(t.valEl).textContent =
                t.key === 'ethanol' ? `BAC ${val.toFixed(2)}%` :
                t.key === 'radiation' ? `${val.toFixed(2)} mSv` :
                `${Math.round(val)} ${t.unit}`;

            const bar = document.getElementById(t.barEl);
            bar.style.width = pct + '%';

            if (pct > 80) {
                bar.className = 'toxin-bar bad';
            } else if (pct > 50) {
                bar.className = 'toxin-bar warn';
            } else {
                bar.className = 'toxin-bar';
            }

            maxLoad = Math.max(maxLoad, pct);
        });

        const toxIndex = document.getElementById('tox-index');
        const level = maxLoad / 100;
        if (level > 0.8) {
            toxIndex.textContent = 'CRITICAL — ' + (level * 10).toFixed(1) + '/10';
            toxIndex.className = 'summary-value bad';
        } else if (level > 0.5) {
            toxIndex.textContent = 'ELEVATED — ' + (level * 10).toFixed(1) + '/10';
            toxIndex.className = 'summary-value warn';
        } else {
            toxIndex.textContent = 'MODERATE — ' + (level * 10).toFixed(1) + '/10';
            toxIndex.className = 'summary-value';
        }
    }

    // ──────── ORGAN STATUS ────────
    const organs = {
        heart: { name: 'HEART', statusEl: 'card-heart', detailEl: 'card-heart', status: 'OPTIMAL', detail: 'EF: 68% | RHR: 72bpm' },
        lungs: { name: 'LUNGS', statusEl: 'card-lungs', detail: 'FEV1: 91% | O₂: 98.4%' },
        liver: { name: 'LIVER', statusEl: 'card-liver', status: 'STRESSED', detail: 'ALT: 142 U/L | TOXIN LOAD: HIGH' },
        kidneys: { name: 'KIDNEYS', statusEl: 'card-kidneys', status: 'ELEVATED LOAD', detail: 'GFR: 78ml/min | CR: 1.3mg/dL' },
        brain: { name: 'BRAIN', statusEl: 'card-brain', status: 'NOMINAL', detail: 'WMN: 94.7% | SYNC: LOCKED' },
        pancreas: { name: 'PANCREAS', statusEl: 'card-pancreas', status: 'AUGMENTED', detail: 'INS SYNTH: ACTIVE | GLUCOSE: 94mg/dL' },
    };

    function updateOrgans() {
        // Heart
        const hr = Math.round(vitals.heartRate);
        document.querySelector('#card-heart .organ-detail').textContent =
            `EF: ${randInt(62, 74)}% | RHR: ${hr}bpm`;

        // Lungs
        document.querySelector('#card-lungs .organ-detail').textContent =
            `FEV1: ${randInt(85, 96)}% | O₂: ${vitals.spo2.toFixed(1)}%`;

        // Liver
        const alt = randInt(120, 180);
        document.querySelector('#card-liver .organ-detail').textContent =
            `ALT: ${alt} U/L | TOXIN LOAD: ${alt > 150 ? 'HIGH' : 'MODERATE'}`;

        const liverStatus = document.querySelector('#card-liver .organ-status');
        liverStatus.textContent = alt > 150 ? 'STRESSED' : 'MODERATE';
        liverStatus.className = 'organ-status ' + (alt > 150 ? 'warn' : 'good');

        // Kidneys
        const gfr = randInt(68, 88);
        document.querySelector('#card-kidneys .organ-detail').textContent =
            `GFR: ${gfr}ml/min | CR: ${(rand(1.0, 1.8)).toFixed(1)}mg/dL`;

        const kidneyStatus = document.querySelector('#card-kidneys .organ-status');
        if (gfr < 70) {
            kidneyStatus.textContent = 'IMPAIRED';
            kidneyStatus.className = 'organ-status warn';
        } else {
            kidneyStatus.textContent = 'ELEVATED LOAD';
            kidneyStatus.className = 'organ-status warn';
        }

        // Brain
        document.querySelector('#card-brain .organ-detail').textContent =
            `WMN: ${rand(91, 98).toFixed(1)}% | SYNC: ${Math.random() < 0.1 ? 'DRIFTING' : 'LOCKED'}`;

        // Pancreas
        const glucose = randInt(78, 120);
        document.querySelector('#card-pancreas .organ-detail').textContent =
            `INS SYNTH: ACTIVE | GLUCOSE: ${glucose}mg/dL`;
    }

    // ──────── INNER SCAN LINE ANIMATION ────────
    let scanY = 60;
    let scanDirection = 1;
    const innerScanLine = document.getElementById('inner-scan-line');

    function animateScanLine() {
        scanY += scanDirection * 0.4;
        if (scanY >= 500 || scanY <= 60) {
            scanDirection *= -1;
        }
        innerScanLine.setAttribute('y1', scanY);
        innerScanLine.setAttribute('y2', scanY);
    }

    // ──────── BODY ORGAN HOVER EFFECTS ────────
    const organHighlights = document.querySelectorAll('.organ-highlight');
    organHighlights.forEach(org => {
        org.addEventListener('mouseenter', function () {
            this.style.fillOpacity = 0.2;
            this.style.strokeWidth = '2.5';
            this.style.filter = 'drop-shadow(0 0 12px currentColor)';
        });
        org.addEventListener('mouseleave', function () {
            this.style.fillOpacity = '';
            this.style.strokeWidth = '';
            this.style.filter = '';
        });
    });

    // ──────── GENE-SPLICE OVERLAY ────────
    const geneOverlay = document.getElementById('gene-splice-overlay');
    const btnGeneSplice = document.getElementById('btn-gene-splice');
    const closeGeneMatrix = document.getElementById('close-gene-matrix');

    btnGeneSplice.addEventListener('click', () => {
        geneOverlay.classList.add('active');
    });

    closeGeneMatrix.addEventListener('click', () => {
        geneOverlay.classList.remove('active');
    });

    geneOverlay.addEventListener('click', function (e) {
        if (e.target === geneOverlay) {
            geneOverlay.classList.remove('active');
        }
    });

    // ──────── FULLSCREEN TOGGLE ────────
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('Fullscreen failed:', err);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.warn('Exit fullscreen failed:', err);
            });
        }
    });

    // ──────── DEEP SCAN ────────
    let isDeepScanning = false;
    const btnScan = document.getElementById('btn-scan');

    function triggerDeepScan() {
        if (isDeepScanning) return;
        isDeepScanning = true;
        btnScan.disabled = true;
        btnScan.textContent = '⏳ SCANNING...';
        btnScan.style.color = '#ffaa00';
        btnScan.style.borderColor = '#ffaa00';

        // Flash effect
        const flash = document.createElement('div');
        flash.id = 'scan-flash';
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%);
            z-index: 9998; pointer-events: none;
            animation: scanFlash 1.5s ease-out forwards;
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.remove();
        }, 1500);

        // Intensify all animations
        document.querySelectorAll('.organ-card').forEach(card => {
            card.style.borderColor = 'rgba(0, 255, 136, 0.5)';
            card.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.15)';
        });

        setTimeout(() => {
            document.querySelectorAll('.organ-card').forEach(card => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            });
            isDeepScanning = false;
            btnScan.disabled = false;
            btnScan.textContent = '⚡ DEEP SCAN';
            btnScan.style.color = '';
            btnScan.style.borderColor = '';
        }, 4000);
    }

    btnScan.addEventListener('click', triggerDeepScan);

    // Add scan flash keyframes dynamically
    const scanFlashStyle = document.createElement('style');
    scanFlashStyle.textContent = `
        @keyframes scanFlash {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(scanFlashStyle);

    // ──────── STATUS ICONS UPDATE ────────
    function updateStatusIcons() {
        const sHeart = document.getElementById('s-heart');
        const sNeural = document.getElementById('s-neural');
        const sNano = document.getElementById('s-nano');

        if (vitals.heartRate > 100 || vitals.heartRate < 55) {
            sHeart.textContent = 'WARN';
            sHeart.style.color = 'var(--amber)';
        } else {
            sHeart.textContent = 'OK';
            sHeart.style.color = 'var(--red)';
        }

        if (neuralState.latency > 4) {
            sNeural.textContent = 'DEGRADED';
            sNeural.style.color = 'var(--amber)';
        } else {
            sNeural.textContent = 'LOCKED';
            sNeural.style.color = 'var(--blue)';
        }

        if (nanoState.energy < 50) {
            sNano.textContent = 'LOW';
            sNano.style.color = 'var(--amber)';
        } else {
            sNano.textContent = 'ACTIVE';
            sNano.style.color = 'var(--green)';
        }
    }

    // ──────── RANDOM SYSTEM EVENTS ────────
    let spikeActive = false;
    function randomSystemEvent() {
        const roll = Math.random();

        if (roll < 0.03 && !spikeActive) {
            // Heart rate spike
            spikeActive = true;
            vitals.heartRate = randInt(95, 120);
            vitals.temp += 0.3;
            setTimeout(() => { spikeActive = false; }, randInt(5000, 15000));
        }

        if (roll > 0.97 && roll < 0.99) {
            // Neural jitter
            neuralState.latency = rand(4, 7);
            neuralState.packetLoss = rand(0.1, 1.5);
            setTimeout(() => {
                neuralState.latency = rand(1.5, 3);
                neuralState.packetLoss = rand(0, 0.05);
            }, randInt(3000, 8000));
        }

        if (roll > 0.995) {
            // Toxin spike
            toxinState.cyanide = rand(10, 22);
            toxinState.lead += randInt(20, 60);
        }
    }

    // ──────── MAIN UPDATE LOOP ────────
    let updateCounter = 0;

    function mainLoop() {
        updateCounter++;

        // Fast updates (every frame)
        animateScanLine();

        // Medium updates (~every 2 seconds)
        if (updateCounter % 120 === 0) {
            updateTimestamp();
            updateVitals();
            updateMutation();
            updateNeural();
            updateToxins();
            updateStatusIcons();
            randomSystemEvent();
        }

        // Slow updates (~every 5 seconds)
        if (updateCounter % 300 === 0) {
            updateOrgans();
            updateNano();
        }

        requestAnimationFrame(mainLoop);
    }

    // ──────── INITIALIZATION ────────
    function init() {
        updateTimestamp();
        updateVitals();
        updateMutation();
        updateNeural();
        updateNano();
        updateToxins();
        updateOrgans();
        updateStatusIcons();
        updateLog();

        // Start main loop
        mainLoop();

        // Start nano particle float animation
        nanoFloatLoop();

        // Start mutation wave animation
        animateMutationWave();
    }

    // Launch when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
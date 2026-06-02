// Bio-Interface Synchronization System
document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // SYSTEM TIME & BIOSYNC TIME
    // -------------------------------------------------------------------------
    function updateBiosyncTime() {
        const timeEl = document.getElementById('biosync-time');
        if (!timeEl) return;
        
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        
        timeEl.textContent = `${hrs}:${mins}:${secs}:${ms}`;
    }
    setInterval(updateBiosyncTime, 40);


    // -------------------------------------------------------------------------
    // REAL-TIME PARAMETER FLUCTUATIONS
    // -------------------------------------------------------------------------
    const state = {
        bpm: 112,
        adrenaline: 3.4,
        toxinLevel: 72,
        bileRatio: 45,
        synapseTemp: 41.8,
        myelinVolt: 120,
        neuroSat: 84,
        viability: 61.2,
        naniteDensity: 1482920,
        replicationRate: 12500,
        mutationOffset: 45 // 45 is Stage III (approx 65% filled)
    };

    function fluctuateValue(val, min, max, maxDelta) {
        const delta = (Math.random() * 2 - 1) * maxDelta;
        let newVal = val + delta;
        if (newVal < min) newVal = min;
        if (newVal > max) newVal = max;
        return newVal;
    }

    function updateTelemetry() {
        // Fluctuate states
        state.bpm = Math.round(fluctuateValue(state.bpm, 95, 145, 3));
        state.adrenaline = parseFloat(fluctuateValue(state.adrenaline, 2.5, 4.8, 0.15).toFixed(2));
        state.toxinLevel = Math.round(fluctuateValue(state.toxinLevel, 55, 90, 1.5));
        state.bileRatio = Math.round(fluctuateValue(state.bileRatio, 35, 60, 1));
        state.synapseTemp = parseFloat(fluctuateValue(state.synapseTemp, 40.5, 42.5, 0.05).toFixed(1));
        state.myelinVolt = Math.round(fluctuateValue(state.myelinVolt, 105, 135, 2));
        state.neuroSat = Math.round(fluctuateValue(state.neuroSat, 75, 95, 1));
        state.viability = parseFloat(fluctuateValue(state.viability, 58, 65, 0.2).toFixed(1));
        state.naniteDensity = Math.round(fluctuateValue(state.naniteDensity, 1400000, 1550000, 8000));
        state.replicationRate = Math.round(fluctuateValue(state.replicationRate, 10000, 15000, 400));

        // Render fluctuated elements to UI
        document.getElementById('bpm-value').textContent = state.bpm;
        document.getElementById('adrenaline-rate').textContent = `${state.adrenaline} ml/min`;
        document.getElementById('synapse-temp').textContent = `${state.synapseTemp}°C`;
        document.getElementById('myelin-volt').textContent = `${state.myelinVolt}mV`;
        document.getElementById('neuro-sat-val').textContent = `${state.neuroSat}%`;
        document.querySelector('.neuro-fill').style.width = `${state.neuroSat}%`;
        document.getElementById('viability-val').textContent = `${state.viability}% MATCH`;
        document.getElementById('nanite-density').textContent = state.naniteDensity.toLocaleString() + '/mm³';
        document.getElementById('replication-rate').textContent = `+${state.replicationRate.toLocaleString()} / sec`;

        // Update radial circles
        // SVGs circular stroke-dasharray is 100 max.
        updateCircularChart('toxin-circle', 'toxin-percent', state.toxinLevel);
        updateCircularChart('bile-circle', 'bile-percent', state.bileRatio);

        // Dynamically adjust heart animation rhythm based on BPM
        const duration = 60 / state.bpm;
        document.documentElement.style.setProperty('--heartbeat-duration', `${duration}s`);
    }

    function updateCircularChart(circleId, textId, value) {
        const circle = document.getElementById(circleId);
        const text = document.getElementById(textId);
        if (circle && text) {
            circle.setAttribute('stroke-dasharray', `${value}, 100`);
            text.textContent = `${value}%`;
        }
    }

    setInterval(updateTelemetry, 800);


    // -------------------------------------------------------------------------
    // GENE-SPLICE MATRIX INTERACTION
    // -------------------------------------------------------------------------
    const cells = document.querySelectorAll('.splice-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            cell.classList.toggle('spliced');
            const dnaName = cell.textContent;
            if (cell.classList.contains('spliced')) {
                cell.classList.remove('critical-flash');
                writeTerminalLog(`Spliced sequence integration verified: [${dnaName}]`);
            } else {
                writeTerminalLog(`De-spliced sequence structural collapse: [${dnaName}]`, true);
            }
            // Recalculate match percentage based on active spliced nodes
            const splicedCount = document.querySelectorAll('.splice-cell.spliced').length;
            const newMatch = (splicedCount / cells.length) * 100;
            state.viability = parseFloat(newMatch.toFixed(1));
            document.getElementById('viability-val').textContent = `${state.viability}% MATCH`;
        });
    });


    // -------------------------------------------------------------------------
    // REAL-TIME HEARTBEAT GRAPH SIMULATION
    // -------------------------------------------------------------------------
    const path = document.getElementById('heartbeat-path');
    const width = 600;
    const height = 120;
    let points = [];
    const maxPoints = 80;

    // Prefill points
    for (let i = 0; i < maxPoints; i++) {
        points.push({ x: (width / maxPoints) * i, y: height / 2 });
    }

    let frame = 0;
    function drawHeartbeat() {
        frame++;
        
        // Shift points to left
        for (let i = 0; i < points.length - 1; i++) {
            points[i].y = points[i+1].y;
        }

        // Generate new rightmost point
        // Create an organic ECG rhythm spiked by active heartbeat timing
        let newY = height / 2;
        const beatCycle = frame % Math.round(40 * (112 / state.bpm));
        
        if (beatCycle === 0) {
            newY = height / 2 - 10; // Prep spike
        } else if (beatCycle === 2) {
            newY = height / 2 + 35; // Deep plunge
        } else if (beatCycle === 4) {
            newY = height / 2 - 50; // Massive spike
        } else if (beatCycle === 6) {
            newY = height / 2 + 15; // Recovery drop
        } else if (beatCycle === 8) {
            newY = height / 2 - 5;  // Post spike bump
        } else {
            // Tiny micro-oscillations
            newY = height / 2 + (Math.sin(frame * 0.5) * 2);
        }

        points[points.length - 1].y = newY;

        // Construct SVG path string
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x} ${points[i].y}`;
        }
        path.setAttribute('d', d);

        requestAnimationFrame(drawHeartbeat);
    }
    drawHeartbeat();


    // -------------------------------------------------------------------------
    // NANOMACHINE SWARM VISUALIZER (CANVAS)
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('nanite-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set internal dimensions
    canvas.width = 180;
    canvas.height = 90;

    const nanites = [];
    const naniteCount = 45;

    for (let i = 0; i < naniteCount; i++) {
        nanites.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 1.5 + 0.5
        });
    }

    function animateNanites() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render network web grid lines
        ctx.strokeStyle = 'rgba(42, 255, 140, 0.06)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nanites.length; i++) {
            for (let j = i + 1; j < nanites.length; j++) {
                const dist = Math.hypot(nanites[i].x - nanites[j].x, nanites[i].y - nanites[j].y);
                if (dist < 30) {
                    ctx.beginPath();
                    ctx.moveTo(nanites[i].x, nanites[i].y);
                    ctx.lineTo(nanites[j].x, nanites[j].y);
                    ctx.stroke();
                }
            }
        }

        // Render nanite nodes
        nanites.forEach(p => {
            ctx.fillStyle = 'rgba(42, 255, 140, 0.8)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Movement logic
            p.x += p.vx;
            p.y += p.vy;

            // Bounce boundaries
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        requestAnimationFrame(animateNanites);
    }
    animateNanites();


    // -------------------------------------------------------------------------
    // ACTION CONTROLLERS & LOG ENGINE
    // -------------------------------------------------------------------------
    const logBox = document.getElementById('terminal-log');

    function writeTerminalLog(text, isError = false) {
        const line = document.createElement('div');
        line.className = 'log-line';
        if (isError) {
            line.classList.add('error');
        }
        line.textContent = `> ${text}`;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
        
        // Prune old logs to maintain smooth render
        if (logBox.childElementCount > 15) {
            logBox.removeChild(logBox.firstChild);
        }
    }

    // Action buttons implementation
    document.getElementById('btn-inject-nanites').addEventListener('click', () => {
        state.naniteDensity += 250000;
        state.replicationRate += 5000;
        writeTerminalLog("Injecting heavy sub-dermal nanomachine payload into host system.");
        writeTerminalLog("Active swarm concentration rising rapidly.");
        
        // Visual flash response on canvas element
        canvas.style.backgroundColor = 'rgba(42, 255, 140, 0.15)';
        setTimeout(() => {
            canvas.style.backgroundColor = 'transparent';
        }, 150);
    });

    document.getElementById('btn-purge-toxins').addEventListener('click', () => {
        state.toxinLevel = Math.max(20, state.toxinLevel - 35);
        state.bileRatio = Math.max(10, state.bileRatio - 15);
        writeTerminalLog("Executing complete synthetic bile dialysis. Purging host toxins...");
        
        // Animate the circle update instantly
        updateCircularChart('toxin-circle', 'toxin-percent', state.toxinLevel);
        updateCircularChart('bile-circle', 'bile-percent', state.bileRatio);
    });

    document.getElementById('btn-stabilize').addEventListener('click', () => {
        state.synapseTemp = 37.2;
        state.myelinVolt = 100;
        state.neuroSat = 95;
        writeTerminalLog("Initiated deep neural stabilization protocol. Resetting synapse temperatures.");
        
        // Reset warnings elements temporarily
        document.getElementById('synapse-temp').classList.remove('critical');
    });

    document.getElementById('btn-trigger-mutation').addEventListener('click', () => {
        const stageEl = document.getElementById('mutation-stage');
        const gaugeFill = document.getElementById('mutation-gauge-fill');
        
        // Progress stage UI representation
        stageEl.textContent = "STAGE IV (FINAL)";
        stageEl.style.color = '#ff3344';
        gaugeFill.style.stroke = '#ff3344';
        gaugeFill.style.strokeDashoffset = '0'; // Completely filled

        writeTerminalLog("CRITICAL DETONATION OF MUTATION PROGRESSION INITIATED.", true);
        writeTerminalLog("WARNING: Synthetic components fused completely with native necrotic tissue.", true);
        
        // Dynamic feedback visualizer changes
        document.querySelector('.body-silhouette').style.fill = 'rgba(255, 51, 68, 0.05)';
        document.querySelectorAll('.wire-part').forEach(p => {
            p.style.stroke = 'var(--warning-red)';
        });
    });
});
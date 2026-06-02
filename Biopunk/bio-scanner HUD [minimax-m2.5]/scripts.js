/* ========================================
BIOPUNK MEDICAL HUD - SCRIPTS v7.2.4
======================================== */

(function() {
    'use strict';
    
    // Global state
    const state = {
        heartRate: 74,
        o2Sat: 98,
        respRate: 16,
        bpmHistory: [],
        mutationStage: 2.4,
        neuralLink: 98.7,
        nanoCount: 2847291,
        nanoDeploy: 73,
        toxinLevels: {
            heavyMetals: 23,
            pathogens: 67,
            nanobotResidue: 45,
            mutagenic: 82,
            synthetic: 91
        },
        geneExpression: {
            'FGF-9': 45,
            'HOXB13': 72,
            'TP53': 89,
            'BRCA-Ω': 34
        },
        alerts: [],
        ecgOffset: 0
    };

    // DOM Elements cache
    const elements = {};

    // Initialize on DOM ready
    function init() {
        cacheElements();
        initClocks();
        initBrainWaves();
        initNanoSwarm();
        initNanoActivity();
        initGeneMatrix();
        initOrganHotspots();
        startVitalUpdates();
        startMutationProgression();
        startDiagnosticText();
        randomAlertSystem();
        console.log('%c NEURALINK BIO-MONITOR v7.2.4 ', 'background: #0a0f0f; color: #00ff88; font-family: monospace; padding: 10px; font-size: 14px;');
    }

    function cacheElements() {
        elements.systemTime = document.getElementById('systemTime');
        elements.alertTime = document.getElementById('alertTime');
        elements.bpmValue = document.getElementById('bpmValue');
        elements.cardiacOutput = document.getElementById('cardiacOutput');
        elements.o2Sat = document.getElementById('o2Sat');
        elements.respRate = document.getElementById('respRate');
        elements.corticalActivity = document.getElementById('corticalActivity');
        elements.neuralLink = document.getElementById('neuralLink');
        elements.liverEnzymes = document.getElementById('liverEnzymes');
        elements.mutationStage = document.getElementById('mutationStage');
        elements.mutationFill = document.getElementById('mutationFill');
        elements.nanoCount = document.getElementById('nanoCount');
        elements.deployValue = document.getElementById('deployValue');
        elements.deployFill = document.getElementById('deployFill');
        elements.integrityValue = document.getElementById('integrityValue');
        elements.integrityGauge = document.getElementById('integrityGauge');
        elements.diagText = document.getElementById('diagText');
        elements.ecgPath = document.getElementById('ecgPath');
        elements.floatingAlerts = document.getElementById('floatingAlerts');
        elements.glitchOverlay = document.getElementById('glitchOverlay');
    }

    // Clock & Time Systems
    function initClocks() {
        updateSystemTime();
        setInterval(updateSystemTime, 100);
        updateAlertTime();
        setInterval(updateAlertTime, 1000);
    }

    function updateSystemTime() {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        if (elements.systemTime) {
            elements.systemTime.textContent = time + '.' + ms;
        }
    }

    function updateAlertTime() {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        if (elements.alertTime) {
            elements.alertTime.textContent = time;
        }
    }

    // Brain Wave Visualization
    let brainWaveCtx;
    let brainWaveData = [];
    const brainWavePoints = 60;

    function initBrainWaves() {
        const canvas = document.getElementById('brainWaveCanvas');
        if (!canvas) return;
        brainWaveCtx = canvas.getContext('2d');
        for (let i = 0; i < brainWavePoints; i++) {
            brainWaveData.push(Math.random() * 30 + 30);
        }
        animateBrainWaves();
    }

    function animateBrainWaves() {
        if (!brainWaveCtx) return;
        const canvas = brainWaveCtx.canvas;
        brainWaveCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        const wave = Math.sin(Date.now() / 500) * 10;
        for (let i = 0; i < brainWavePoints - 1; i++) {
            const noise = (Math.random() - 0.5) * 8;
            brainWaveData[i] = brainWaveData[i + 1];
            brainWaveData[brainWavePoints - 1] = 30 + wave + noise + Math.sin(i / 5) * 5;
        }
        
        drawBrainWave(0, 'rgba(153, 51, 255, 0.5)', 2);
        drawBrainWave(10, 'rgba(255, 51, 170, 0.4)', 1.5);
        drawBrainWave(-5, 'rgba(0, 221, 204, 0.3)', 1);
        requestAnimationFrame(animateBrainWaves);
    }

    function drawBrainWave(offset, color, lineWidth) {
        const canvas = brainWaveCtx.canvas;
        const step = canvas.width / brainWavePoints;
        brainWaveCtx.beginPath();
        brainWaveCtx.strokeStyle = color;
        brainWaveCtx.lineWidth = lineWidth;
        brainWaveCtx.moveTo(0, canvas.height / 2 + brainWaveData[0] + offset);
        for (let i = 1; i < brainWavePoints; i++) {
            brainWaveCtx.lineTo(i * step, canvas.height / 2 + brainWaveData[i] + offset);
        }
        brainWaveCtx.stroke();
    }

    // Nanomachine Swarm
    let swarmCanvas, swarmCtx;
    const particles = [];
    const particleCount = 200;

    function initNanoSwarm() {
        swarmCanvas = document.getElementById('swarmCanvas');
        if (!swarmCanvas) return;
        swarmCtx = swarmCanvas.getContext('2d');
        resizeSwarmCanvas();
        window.addEventListener('resize', resizeSwarmCanvas);
        initParticles();
        animateSwarm();
    }

    function resizeSwarmCanvas() {
        if (!swarmCanvas) return;
        const container = swarmCanvas.parentElement;
        if (container) {
            swarmCanvas.width = container.clientWidth;
            swarmCanvas.height = container.clientHeight;
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * (swarmCanvas ? swarmCanvas.width : 400),
                y: Math.random() * (swarmCanvas ? swarmCanvas.height : 400),
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.3,
                color: Math.random() > 0.5 ? '#00aaff' : '#00ffff'
            });
        }
    }

    function animateSwarm() {
        if (!swarmCtx || !swarmCanvas) return;
        swarmCtx.clearRect(0, 0, swarmCanvas.width, swarmCanvas.height);
        
        const cx = swarmCanvas.width / 2;
        const cy = swarmCanvas.height / 2;
        
        const gradient = swarmCtx.createRadialGradient(cx, cy, 0, cx, cy, 150);
        gradient.addColorStop(0, 'rgba(0, 170, 255, 0.1)');
        gradient.addColorStop(1, 'transparent');
        swarmCtx.fillStyle = gradient;
        swarmCtx.fillRect(0, 0, swarmCanvas.width, swarmCanvas.height);
        
        particles.forEach(function(p, i) {
            p.x += p.vx;
            p.y += p.vy;
            
            const dx = cx - p.x;
            const dy = cy - p.y;
            p.vx += dx * 0.0001 + (Math.random() - 0.5) * 0.1;
            p.vy += dy * 0.0001 + (Math.random() - 0.5) * 0.1;
            p.vx *= 0.99;
            p.vy *= 0.99;
            
            if (p.x < 0) p.x = swarmCanvas.width;
            if (p.x > swarmCanvas.width) p.x = 0;
            if (p.y < 0) p.y = swarmCanvas.height;
            if (p.y > swarmCanvas.height) p.y = 0;
            
            swarmCtx.beginPath();
            swarmCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            swarmCtx.fillStyle = p.color;
            swarmCtx.globalAlpha = p.alpha;
            swarmCtx.fill();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 50) {
                    swarmCtx.beginPath();
                    swarmCtx.moveTo(p.x, p.y);
                    swarmCtx.lineTo(p2.x, p2.y);
                    swarmCtx.strokeStyle = 'rgba(0, 170, 255, ' + (0.1 * (1 - dist / 50)) + ')';
                    swarmCtx.lineWidth = 0.5;
                    swarmCtx.stroke();
                }
            }
        });
        
        swarmCtx.globalAlpha = 1;
        requestAnimationFrame(animateSwarm);
    }

    // Nanomachine Activity Graph
    let nanoActivityCtx;
    const nanoActivityData = new Array(40).fill(0);

    function initNanoActivity() {
        const canvas = document.getElementById('nanoActivityCanvas');
        if (!canvas) return;
        nanoActivityCtx = canvas.getContext('2d');
        animateNanoActivity();
    }

    function animateNanoActivity() {
        if (!nanoActivityCtx) return;
        const canvas = nanoActivityCtx.canvas;
        nanoActivityCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        nanoActivityData.shift();
        nanoActivityData.push(Math.random() * 30 + 10);
        
        const gradient = nanoActivityCtx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 170, 255, 0.3)');
        gradient.addColorStop(1, 'transparent');
        
        nanoActivityCtx.beginPath();
        nanoActivityCtx.moveTo(0, canvas.height);
        for (let i = 0; i < nanoActivityData.length; i++) {
            nanoActivityCtx.lineTo(i * (canvas.width / nanoActivityData.length), canvas.height - nanoActivityData[i]);
        }
        nanoActivityCtx.lineTo(canvas.width, canvas.height);
        nanoActivityCtx.fillStyle = gradient;
        nanoActivityCtx.fill();
        
        nanoActivityCtx.beginPath();
        nanoActivityCtx.strokeStyle = '#00aaff';
        nanoActivityCtx.lineWidth = 1.5;
        for (let i = 0; i < nanoActivityData.length; i++) {
            if (i === 0) {
                nanoActivityCtx.moveTo(i * (canvas.width / nanoActivityData.length), canvas.height - nanoActivityData[i]);
            } else {
                nanoActivityCtx.lineTo(i * (canvas.width / nanoActivityData.length), canvas.height - nanoActivityData[i]);
            }
        }
        nanoActivityCtx.stroke();
        requestAnimationFrame(animateNanoActivity);
    }

    // Gene Matrix
    function initGeneMatrix() {
        const matrix = document.getElementById('geneMatrix');
        if (!matrix) return;
        matrix.innerHTML = '';
        
        const genes = ['FGF', 'HOX', 'TP53', 'BRCA', 'EGFR', 'KRAS', 'MYC', 'PIK3', 'PTEN', 'RB1', 'VHL', 'APC', 'NF1', 'WT1', 'CDK2', 'CDK4'];
        const statuses = ['', '', '', '', 'warning', '', 'mutation', '', '', 'critical', '', '', '', '', ''];
        
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            if (status) cell.classList.add(status);
            cell.textContent = genes[i];
            cell.title = 'Gene: ' + genes[i];
            matrix.appendChild(cell);
        }
        
        setInterval(function() {
            const cells = matrix.querySelectorAll('.matrix-cell');
            cells.forEach(function(cell) {
                cell.classList.remove('active', 'warning', 'critical', 'mutation');
                const rand = Math.random();
                if (rand > 0.95) cell.classList.add('active');
                else if (rand > 0.9) cell.classList.add('warning');
                else if (rand > 0.85) cell.classList.add('critical');
                else if (rand > 0.8) cell.classList.add('mutation');
            });
        }, 500);
    }

    // Organ Hotspots
    function initOrganHotspots() {
        const hotspots = document.querySelectorAll('.organ-hotspot');
        hotspots.forEach(function(hotspot) {
            hotspot.addEventListener('click', function() {
                const organ = hotspot.dataset.organ;
                showOrganInfo(organ);
            });
            hotspot.addEventListener('mouseenter', function() {
                highlightOrgan(hotspot.dataset.organ, true);
            });
            hotspot.addEventListener('mouseleave', function() {
                highlightOrgan(hotspot.dataset.organ, false);
            });
        });
    }

    function showOrganInfo(organ) {
        const info = {
            brain: 'NEURAL CORTEX: 89% ACTIVITY\nSYNC STATUS: OPTIMAL\nIMPLANTS: 12 ACTIVE',
            heart: 'CARDIAC OUTPUT: 4.2 L/min\nHEART RATE: 74 BPM\nCYSTAL VALVE: SYNTHETIC',
            'lung-l': 'LEFT LUNG: FUNCTIONAL\nO2 PROCESSING: NOMINAL\nNANOFILTER: ACTIVE',
            'lung-r': 'RIGHT LUNG: FUNCTIONAL\nO2 PROCESSING: NOMINAL\nNANOFILTER: ACTIVE',
            liver: 'HEPATIC FUNCTION: 67%\nMUTATION: STAGE 2\nTOXIN FILTER: COMPROMISED'
        };
        console.log('%c' + organ.toUpperCase() + ' DIAGNOSTIC', 'color: #00ff88; font-family: monospace;');
        console.log(info[organ] || 'No data');
    }

    function highlightOrgan(organ, highlight) {
        const indicators = document.querySelectorAll('.organ-indicator');
        indicators.forEach(function(ind) {
            if (ind.classList.contains(organ + '-ind')) {
                ind.style.opacity = highlight ? '1' : '0.5';
                ind.style.r = highlight ? '12' : '6';
            }
        });
    }

    // Vital Updates
    function startVitalUpdates() {
        setInterval(updateHeartRate, 1000);
        setInterval(updateOrganData, 2000);
        setInterval(updateNanoCount, 3000);
        setInterval(updateNeuralLink, 1500);
        setInterval(updateToxinLevels, 4000);
    }

    function updateHeartRate() {
        const variation = (Math.random() - 0.5) * 4;
        state.heartRate = Math.max(60, Math.min(100, Math.round(state.heartRate + variation)));
        
        if (elements.bpmValue) {
            elements.bpmValue.textContent = state.heartRate;
        }
        
        const output = (state.heartRate * 0.056).toFixed(1);
        if (elements.cardiacOutput) {
            elements.cardiacOutput.textContent = output + ' L/min';
        }
        
        document.documentElement.style.setProperty('--heartbeat', (60 / state.heartRate) + 's');
        
        state.bpmHistory.push(state.heartRate);
        if (state.bpmHistory.length > 10) state.bpmHistory.shift();
    }

    function updateOrganData() {
        state.o2Sat = Math.max(94, Math.min(100, state.o2Sat + Math.round((Math.random() - 0.5) * 2)));
        if (elements.o2Sat) elements.o2Sat.textContent = state.o2Sat + '%';
        
        state.respRate = Math.max(12, Math.min(20, state.respRate + Math.round((Math.random() - 0.5) * 2)));
        if (elements.respRate) elements.respRate.textContent = state.respRate + '/min';
        
        const cortical = Math.max(70, Math.min(100, Math.round(85 + (Math.random() - 0.5) * 10)));
        if (elements.corticalActivity) elements.corticalActivity.textContent = cortical + '%';
        
        const alt = Math.max(20, Math.min(80, Math.round(42 + (Math.random() - 0.5) * 10)));
        if (elements.liverEnzymes) elements.liverEnzymes.textContent = 'ALT: ' + alt + ' U/L';
    }

    function updateNanoCount() {
        const change = Math.floor((Math.random() - 0.5) * 5000);
        state.nanoCount = Math.max(2000000, state.nanoCount + change);
        if (elements.nanoCount) elements.nanoCount.textContent = state.nanoCount.toLocaleString();
        
        state.nanoDeploy = Math.max(50, Math.min(100, state.nanoDeploy + Math.round((Math.random() - 0.5) * 3)));
        if (elements.deployValue) elements.deployValue.textContent = state.nanoDeploy + '%';
        if (elements.deployFill) elements.deployFill.style.width = state.nanoDeploy + '%';
    }

    function updateNeuralLink() {
        state.neuralLink = Math.max(95, Math.min(100, state.neuralLink + (Math.random() - 0.5) * 0.5));
        if (elements.neuralLink) elements.neuralLink.textContent = state.neuralLink.toFixed(1) + '%';
        if (elements.integrityValue) elements.integrityValue.textContent = state.neuralLink.toFixed(1) + '%';
        
        const dashOffset = 110 - (state.neuralLink / 100) * 110;
        if (elements.integrityGauge) elements.integrityGauge.style.strokeDashoffset = dashOffset;
    }

    function updateToxinLevels() {
        const toxins = ['heavyMetals', 'pathogens', 'nanobotResidue', 'mutagenic', 'synthetic'];
        const toxinElements = document.querySelectorAll('.toxin-item');
        
        toxinElements.forEach(function(el, i) {
            const key = toxins[i];
            const variation = Math.round((Math.random() - 0.5) * 4);
            state.toxinLevels[key] = Math.max(0, Math.min(100, state.toxinLevels[key] + variation));
            
            const fill = el.querySelector('.toxin-fill');
            const value = el.querySelector('.toxin-value');
            
            if (fill) fill.style.width = state.toxinLevels[key] + '%';
            if (value) {
                value.textContent = state.toxinLevels[key] + '%';
                value.classList.remove('warning', 'critical');
                if (fill) fill.classList.remove('critical');
                
                if (state.toxinLevels[key] > 80) {
                    value.classList.add('critical');
                    if (fill) fill.classList.add('critical');
                } else if (state.toxinLevels[key] > 60) {
                    value.classList.add('warning');
                }
            }
        });
    }

    // Mutation Progression
    function startMutationProgression() {
        setInterval(function() {
            state.mutationStage = Math.min(5, state.mutationStage + 0.001);
            if (elements.mutationStage) elements.mutationStage.textContent = state.mutationStage.toFixed(1);
            if (elements.mutationFill) elements.mutationFill.style.width = (state.mutationStage / 5) * 100 + '%';
            
            if (Math.random() > 0.98) {
                state.mutationStage = Math.min(5, state.mutationStage + 0.1);
                triggerGlitch();
                showFloatingAlert('MUTATION SPIKE', 'Stage increased to ' + state.mutationStage.toFixed(1));
            }
            
            const genes = ['FGF-9', 'HOXB13', 'TP53', 'BRCA-Ω'];
            genes.forEach(function(gene) {
                const variation = (Math.random() - 0.5) * 3;
                state.geneExpression[gene] = Math.max(0, Math.min(100, state.geneExpression[gene] + variation));
            });
            
            updateGeneBars();
        }, 500);
    }

    function updateGeneBars() {
        const geneRows = document.querySelectorAll('.gene-row');
        const genes = ['FGF-9', 'HOXB13', 'TP53', 'BRCA-Ω'];
        
        geneRows.forEach(function(row, i) {
            const gene = genes[i];
            const value = state.geneExpression[gene];
            const fill = row.querySelector('.gene-fill');
            const valueEl = row.querySelector('.gene-value');
            
            if (fill) fill.style.width = value + '%';
            if (valueEl) {
                valueEl.textContent = Math.round(value) + '%';
                valueEl.classList.remove('warning', 'critical');
                if (fill && fill.parentElement) {
                    fill.parentElement.classList.remove('warning', 'critical');
                }
                
                if (value > 80) {
                    valueEl.classList.add('critical');
                    if (fill && fill.parentElement) fill.parentElement.classList.add('critical');
                } else if (value > 60) {
                    valueEl.classList.add('warning');
                    if (fill && fill.parentElement) fill.parentElement.classList.add('warning');
                }
            }
        });
    }

    // Diagnostic Text
    const diagnosticMessages = [
        'ANALYZING BIOMETRIC DATA STREAMS...',
        'PROCESSING NEURAL SIGNALS...',
        'CALIBRATING NANOMACHINE ACTIVITY...',
        'MONITORING ORGAN FUNCTION...',
        'SCANNING FOR MUTATIONS...',
        'EVALUATING TOXIN LEVELS...',
        'SYNCHRONIZING CYBERNETIC LINKS...',
        'CHECKING GENE EXPRESSION...',
        'MONITORING CELLULAR REGENERATION...',
        'ANALYZING BLOOD COMPOSITION...',
        'TRACKING PATHOGEN ACTIVITY...',
        'PROCESSING SYNTHETIC MATERIALS...'
    ];
    let diagIndex = 0;

    function startDiagnosticText() {
        setInterval(function() {
            diagIndex = (diagIndex + 1) % diagnosticMessages.length;
            if (elements.diagText) {
                elements.diagText.textContent = diagnosticMessages[diagIndex];
            }
        }, 3000);
    }

    // Alert System
    function randomAlertSystem() {
        setInterval(function() {
            if (Math.random() > 0.95) {
                const alerts = [
                    ['TOXIN SPIKE', 'Mutagenic levels rising rapidly'],
                    ['NEURAL ANOMALY', 'Unusual cortical pattern detected'],
                    ['ORGAN STRESS', 'Cardiac output suboptimal'],
                    ['NANO DEPLOYMENT', 'New nanomachines activated'],
                    ['GENE EXPRESSION', 'TP53 mutation rate increased'],
                    ['SYSTEM WARNING', 'Mutation progression accelerating']
                ];
                const alert = alerts[Math.floor(Math.random() * alerts.length)];
                showFloatingAlert(alert[0], alert[1]);
                
                if (alert[0].indexOf('MUTATION') !== -1 || alert[0].indexOf('TOXIN') !== -1) {
                    triggerGlitch();
                }
            }
        }, 5000);
    }

    function showFloatingAlert(title, message) {
        if (!elements.floatingAlerts) return;
        const alert = document.createElement('div');
        alert.className = 'floating-alert';
        alert.style.left = (Math.random() * 60 + 20) + '%';
        alert.style.top = (Math.random() * 60 + 20) + '%';
        alert.innerHTML = '<div class="alert-title">' + title + '</div><div class="alert-message">' + message + '</div>';
        elements.floatingAlerts.appendChild(alert);
        setTimeout(function() {
            alert.remove();
        }, 3000);
    }

    function triggerGlitch() {
        if (elements.glitchOverlay) {
            elements.glitchOverlay.classList.add('active');
            setTimeout(function() {
                elements.glitchOverlay.classList.remove('active');
            }, 300);
        }
    }

    // ECG Animation Enhancement
    function enhanceECG() {
        if (!elements.ecgPath) return;
        const yOffset = (state.heartRate - 70) / 10;
        elements.ecgPath.style.transform = 'translateY(' + yOffset + 'px)';
    }
    setInterval(enhanceECG, 100);

    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'g' || e.key === 'G') {
            triggerGlitch();
        }
        if (e.key === 'a' || e.key === 'A') {
            const alerts = [
                ['EMERGENCY', 'Life signs unstable'],
                ['WARNING', 'Mutation critical'],
                ['ALERT', 'Nanomachine failure']
            ];
            const alert = alerts[Math.floor(Math.random() * alerts.length)];
            showFloatingAlert(alert[0], alert[1]);
        }
    });

    // Organ Panel Breathing
    function syncBreathingToHeartbeat() {
        const panels = document.querySelectorAll('.organ-panel');
        panels.forEach(function(panel, i) {
            const delay = i * 0.2;
            panel.style.animationDelay = delay + 's';
        });
    }
    syncBreathingToHeartbeat();

    // Start everything
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
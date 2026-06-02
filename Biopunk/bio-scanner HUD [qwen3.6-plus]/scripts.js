/* =========================================
   BIOSYNC // Medical Telemetry HUD v4.7.2
   JavaScript Control Systems
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    Systems.init();
});

const Systems = {
    intervals: [],
    
    init() {
        this.startClock();
        this.startMetricsUpdate();
        this.startLogFeed();
        this.startNanomachineAnimation();
        this.startGeneMatrixGlitch();
        this.startToxinProgression();
        this.setupEventListeners();
        this.updatePatientInfo();
    },

    // =========================================
    // CLOCK SYSTEM
    // =========================================
    startClock() {
        const update = () => {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            const ms = now.getMilliseconds().toString().padStart(3, '0');
            document.getElementById('current-time').textContent = `${timeStr}.${ms}`;
            requestAnimationFrame(update);
        };
        update();
    },

    // =========================================
    // METRICS SIMULATION ENGINE
    // =========================================
    startMetricsUpdate() {
        const metrics = {
            heartRate: { el: 'heart-rate', base: 147, variance: 8, unit: '' },
            o2Sat: { el: 'o2-sat', base: 89, variance: 3, unit: '%' },
            bpSys: { el: 'bp', baseSys: 142, baseDia: 91, varSys: 5, varDia: 3, unit: '' },
            lungCap: { el: 'lung-cap', base: 67, variance: 2, unit: '%' },
            respRate: { el: 'resp-rate', base: 28, variance: 2, unit: '/min' },
            liverEnz: { el: 'liver-enz', base: 340, variance: 15, unit: '%' },
            toxinLoad: { el: 'toxin-load', values: ['CRITICAL', 'ELEVATED', 'LETHAL'], weights: [0.7, 0.2, 0.1] },
            wbc: { el: 'wbc', base: 14.2, variance: 0.5, unit: 'k' },
            autoAttack: { el: 'auto-attack', values: ['ACTIVE', 'DETECTED', 'SPIKE'], weights: [0.6, 0.3, 0.1] },
            cytokine: { el: 'cytokine', values: ['STORM', 'ELEVATED', 'CRITICAL'], weights: [0.5, 0.3, 0.2] },
            syncRate: { el: 'sync-rate', base: 94.2, variance: 1.5, unit: '%' },
            latency: { el: 'latency', base: 2.3, variance: 0.8, unit: 'ms' },
            cpuLoad: { el: 'cpu-load', base: 34, variance: 10, unit: '%' },
            temp: { el: 'temp', base: 38.7, variance: 0.4, unit: '°C' },
        };

        const updateInterval = setInterval(() => {
            // Heart Rate
            const hr = metrics.heartRate.base + (Math.random() * metrics.heartRate.variance * 2 - metrics.heartRate.variance);
            document.getElementById(metrics.heartRate.el).textContent = Math.round(hr);

            // O2 Sat
            const o2 = metrics.o2Sat.base + (Math.random() * metrics.o2Sat.variance * 2 - metrics.o2Sat.variance);
            document.getElementById(metrics.o2Sat.el).textContent = `${o2.toFixed(1)}%`;

            // Blood Pressure
            const sys = metrics.bpSys.baseSys + (Math.random() * metrics.bpSys.varSys * 2 - metrics.bpSys.varSys);
            const dia = metrics.bpSys.baseDia + (Math.random() * metrics.bpSys.varDia * 2 - metrics.bpSys.varDia);
            document.getElementById(metrics.bpSys.el).textContent = `${Math.round(sys)}/${Math.round(dia)}`;

            // Lung Capacity
            const lc = metrics.lungCap.base + (Math.random() * metrics.lungCap.variance * 2 - metrics.lungCap.variance);
            document.getElementById(metrics.lungCap.el).textContent = `${lc.toFixed(1)}%`;

            // Resp Rate
            const rr = metrics.respRate.base + (Math.random() * metrics.respRate.variance * 2 - metrics.respRate.variance);
            document.getElementById(metrics.respRate.el).textContent = `${Math.round(rr)}/min`;

            // Liver Enzymes
            const le = metrics.liverEnz.base + (Math.random() * metrics.liverEnz.variance * 2 - metrics.liverEnz.variance);
            document.getElementById(metrics.liverEnz.el).textContent = `${Math.round(le)}%`;

            // Discrete Value Metrics
            this.updateDiscreteMetric(metrics.toxinLoad.el, metrics.toxinLoad.values, metrics.toxinLoad.weights);
            this.updateDiscreteMetric(metrics.autoAttack.el, metrics.autoAttack.values, metrics.autoAttack.weights);
            this.updateDiscreteMetric(metrics.cytokine.el, metrics.cytokine.values, metrics.cytokine.weights);

            // Neural Sync
            const sr = metrics.syncRate.base + (Math.random() * metrics.syncRate.variance * 2 - metrics.syncRate.variance);
            document.getElementById(metrics.syncRate.el).textContent = `${sr.toFixed(1)}%`;

            // Latency
            const lat = metrics.latency.base + (Math.random() * metrics.latency.variance * 2 - metrics.latency.variance);
            document.getElementById(metrics.latency.el).textContent = `${Math.max(0.5, lat).toFixed(1)}ms`;

            // CPU Load
            const cpu = metrics.cpuLoad.base + (Math.random() * metrics.cpuLoad.variance * 2 - metrics.cpuLoad.variance);
            document.getElementById(metrics.cpuLoad.el).textContent = `${Math.round(cpu)}%`;

            // Temperature
            const temp = metrics.temp.base + (Math.random() * metrics.temp.variance * 2 - metrics.temp.variance);
            document.getElementById(metrics.temp.el).textContent = `${temp.toFixed(1)}°C`;

            // Update Organ Bars dynamically based on metrics
            this.updateOrganBars();

        }, 1200);

        this.intervals.push(updateInterval);
    },

    updateDiscreteMetric(elId, values, weights) {
        const r = Math.random();
        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (r <= cumulative) {
                document.getElementById(elId).textContent = values[i];
                return;
            }
        }
    },

    updateOrganBars() {
        // Heart integrity drops slightly over time, fluctuates
        const heartIntegrity = 34 + (Math.random() * 4 - 2);
        const heartBar = document.querySelector('.organ-card[data-organ="heart"] .bar-fill');
        if (heartBar) {
            heartBar.style.width = `${heartIntegrity}%`;
            heartBar.closest('.organ-card').querySelector('.bar-label').textContent = `INTEGRITY: ${heartIntegrity.toFixed(1)}%`;
        }

        // Liver integrity
        const liverIntegrity = 23 + (Math.random() * 3 - 1.5);
        const liverBar = document.querySelector('.organ-card[data-organ="liver"] .bar-fill');
        if (liverBar) {
            liverBar.style.width = `${liverIntegrity}%`;
            liverBar.closest('.organ-card').querySelector('.bar-label').textContent = `INTEGRITY: ${liverIntegrity.toFixed(1)}%`;
        }
    },

    // =========================================
    // EVENT LOG SYSTEM
    // =========================================
    startLogFeed() {
        const messages = [
            { level: 'INFO', text: 'Nanomachine swarm recalibrating cardiac nodes...' },
            { level: 'WARN', text: 'Hepatic filtration capacity below threshold.' },
            { level: 'CRIT', text: 'Ventricular fibrillation risk elevated.' },
            { level: 'WARN', text: 'Toxin accumulation rate increasing.' },
            { level: 'INFO', text: 'Neural link synchronization drift detected.' },
            { level: 'WARN', text: 'Immune matrix auto-response triggered.' },
            { level: 'CRIT', text: 'Oxygen saturation critical. Administering O₂.' },
            { level: 'INFO', text: 'Cellular regeneration cycle initiated.' },
            { level: 'WARN', text: 'Renal clearance rate declining.' },
            { level: 'INFO', text: 'Gene-splice matrix stability check: PASS.' },
            { level: 'CRIT', text: 'Neurotoxin levels exceeding lethal threshold.' },
            { level: 'WARN', text: 'Cytokine storm indicators detected.' },
            { level: 'INFO', text: 'System diagnostics running...' },
            { level: 'WARN', text: 'Temperature regulation compromised.' },
            { level: 'CRIT', text: 'Multiple organ dysfunction syndrome (MODS) risk.' },
        ];

        const logFeed = document.getElementById('log-feed');

        const addEntry = () => {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const now = new Date();
            const time = now.toTimeString().split(' ')[0];
            
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-level ${msg.level.toLowerCase()}">${msg.level}</span> ${msg.text}`;
            
            logFeed.prepend(entry);
            
            // Keep log size manageable
            if (logFeed.children.length > 20) {
                logFeed.removeChild(logFeed.lastChild);
            }
        };

        const interval = setInterval(addEntry, 3500);
        this.intervals.push(interval);
    },

    // =========================================
    // NANOMACHINE SWARM ANIMATION
    // =========================================
    startNanomachineAnimation() {
        const nanoparticles = document.querySelectorAll('.nano');
        
        const animate = () => {
            nanoparticles.forEach((nano, i) => {
                const baseX = parseFloat(nano.getAttribute('cx'));
                const baseY = parseFloat(nano.getAttribute('cy'));
                
                const offsetX = Math.sin(Date.now() / 1000 + i) * 4;
                const offsetY = Math.cos(Date.now() / 1200 + i * 1.5) * 4;
                
                nano.setAttribute('cx', baseX + offsetX * 0.1);
                nano.setAttribute('cy', baseY + offsetY * 0.1);
            });
            requestAnimationFrame(animate);
        };
        animate();
    },

    // =========================================
    // GENE MATRIX GLITCH EFFECT
    // =========================================
    startGeneMatrixGlitch() {
        const cells = document.querySelectorAll('.matrix-cell');
        
        setInterval(() => {
            const randomCell = cells[Math.floor(Math.random() * cells.length)];
            const originalClass = randomCell.classList[1];
            
            // Temporarily switch class to simulate glitch
            const states = ['compatible', 'incompatible', 'unstable'];
            const newState = states[Math.floor(Math.random() * states.length)];
            
            if (newState !== originalClass) {
                randomCell.classList.remove(originalClass);
                randomCell.classList.add(newState);
                
                setTimeout(() => {
                    randomCell.classList.remove(newState);
                    randomCell.classList.add(originalClass);
                }, 400 + Math.random() * 600);
            }
        }, 2000);
    },

    // =========================================
    // TOXIN PROGRESSION
    // =========================================
    startToxinProgression() {
        // Slowly creep toxin levels upward over time
        const toxins = document.querySelectorAll('.toxin-item');
        
        setInterval(() => {
            toxins.forEach(toxin => {
                const fill = toxin.querySelector('.toxin-fill');
                let currentWidth = parseFloat(fill.style.width) || 0;
                
                if (currentWidth < 99) {
                    const increment = Math.random() * 0.5;
                    fill.style.width = `${Math.min(100, currentWidth + increment)}%`;
                    
                    const levelSpan = toxin.querySelector('.toxin-level');
                    if (levelSpan && currentWidth > 80) {
                        levelSpan.classList.add('lethal');
                    }
                }
            });
        }, 5000);
    },

    // =========================================
    // EVENT LISTENERS
    // =========================================
    setupEventListeners() {
        // Hover effects for organ cards to show more detail
        const organCards = document.querySelectorAll('.organ-card');
        organCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'var(--primary-glow)';
                card.style.boxShadow = '0 0 15px rgba(0, 255, 102, 0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            });
        });

        // Hotspot interactions
        const hotspots = document.querySelectorAll('.hotspot');
        hotspots.forEach(spot => {
            spot.addEventListener('click', (e) => {
                const organ = e.target.dataset.organ;
                if (organ) {
                    // Flash corresponding organ card
                    const card = document.querySelector(`.organ-card[data-organ="${organ}"]`);
                    if (card) {
                        card.style.animation = 'none';
                        card.offsetHeight; // trigger reflow
                        card.style.animation = 'breathe 0.5s ease-in-out 3';
                    }
                }
            });
        });

        // Patient info toggle
        const patientInfo = document.querySelector('.patient-info');
        document.querySelector('.hud-center').addEventListener('click', () => {
            patientInfo.classList.toggle('visible');
        });
    },

    updatePatientInfo() {
        // Initial setup or fetch logic if needed
        const patientInfo = document.querySelector('.patient-info');
        if (patientInfo) {
            setTimeout(() => patientInfo.classList.add('visible'), 2000);
        }
    }
};
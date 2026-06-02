/* =========================================================
   ABYSSAL STATION — JavaScript
   Deep-Sea Research Dashboard Logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // INITIALIZATION
    // =========================================================

    // Core State
    const state = {
        depth: 10928,
        pressure: 1086,
        hullIntegrity: 98.7,
        missionStart: Date.now() - (147 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 41 * 60 * 1000 + 8 * 1000),
        faunaTargets: [
            { x: 25, y: 35, name: 'V. ATLANTICA', dist: 42, vx: 0.02, vy: -0.01 },
            { x: 75, y: 60, name: 'A. FERROX', dist: 128, vx: -0.015, vy: 0.02 },
            { x: 55, y: 45, name: 'UNKNOWN', dist: 89, vx: 0.01, vy: 0.015 }
        ],
        sonarContacts: [
            { angle: 45, distance: 60, size: 3, strength: 0.8 },
            { angle: 135, distance: 80, size: 2, strength: 0.6 },
            { angle: 220, distance: 50, size: 4, strength: 0.9 },
            { angle: 310, distance: 70, size: 2, strength: 0.5 }
        ],
        sensors: {
            temperature: 1.4,
            salinity: 34.7,
            current: 0.3,
            oxygen: 6.2
        }
    };

    // =========================================================
    // BIOLUMINESCENT PARTICLE SYSTEM
    // =========================================================

    const bioCanvas = document.getElementById('bioluminescence-canvas');
    const bioCtx = bioCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resizeBioluminescenceCanvas() {
        bioCanvas.width = window.innerWidth;
        bioCanvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * bioCanvas.width;
            this.y = Math.random() * bioCanvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.opacitySpeed = Math.random() * 0.005 + 0.002;
            this.hue = Math.random() > 0.7 ? 280 : (Math.random() > 0.5 ? 170 : 30);
            this.life = 1;
            this.decay = Math.random() * 0.001 + 0.0005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.opacity += this.opacitySpeed;
            
            if (this.opacity > 0.8 || this.opacity < 0.1) {
                this.opacitySpeed *= -1;
            }

            if (this.life <= 0 || this.x < -10 || this.x > bioCanvas.width + 10 || 
                this.y < -10 || this.y > bioCanvas.height + 10) {
                this.reset();
                this.life = 1;
            }
        }

        draw() {
            bioCtx.save();
            bioCtx.globalAlpha = this.opacity * this.life;
            bioCtx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
            bioCtx.shadowBlur = this.size * 3;
            bioCtx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
            bioCtx.beginPath();
            bioCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            bioCtx.fill();
            bioCtx.restore();
        }
    }

    function initParticles() {
        resizeBioluminescenceCanvas();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        bioCtx.clearRect(0, 0, bioCanvas.width, bioCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    // =========================================================
    // SONAR SYSTEM
    // =========================================================

    const sonarCanvas = document.getElementById('sonar-canvas');
    const sonarCtx = sonarCanvas.getContext('2d');
    let sonarAngle = 0;
    const SONAR_CENTER = { x: 200, y: 200 };
    const SONAR_RADIUS = 190;

    function drawSonar() {
        sonarCtx.clearRect(0, 0, 400, 400);

        // Draw sweep trail
        sonarCtx.save();
        sonarCtx.translate(SONAR_CENTER.x, SONAR_CENTER.y);
        sonarCtx.rotate(sonarAngle);
        
        const gradient = sonarCtx.createConicGradient(0, 0);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        gradient.addColorStop(0.1, 'rgba(0, 240, 255, 0.2)');
        gradient.addColorStop(0.3, 'rgba(0, 240, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        sonarCtx.fillStyle = gradient;
        sonarCtx.beginPath();
        sonarCtx.moveTo(0, 0);
        sonarCtx.arc(0, 0, SONAR_RADIUS, 0, Math.PI * 2);
        sonarCtx.closePath();
        sonarCtx.fill();
        sonarCtx.restore();

        // Draw contacts
        state.sonarContacts.forEach(contact => {
            const contactRad = (contact.angle * Math.PI) / 180;
            const contactX = SONAR_CENTER.x + Math.cos(contactRad) * contact.distance * 0.9;
            const contactY = SONAR_CENTER.y + Math.sin(contactRad) * contact.distance * 0.9;
            
            // Check if contact is in sweep
            let diff = contact.angle - (sonarAngle * 180 / Math.PI) % 360;
            if (diff < 0) diff += 360;
            
            if (diff < 30) {
                const alpha = 1 - (diff / 30);
                sonarCtx.save();
                sonarCtx.globalAlpha = alpha * contact.strength;
                sonarCtx.fillStyle = '#00f0ff';
                sonarCtx.shadowBlur = contact.size * 4;
                sonarCtx.shadowColor = '#00f0ff';
                sonarCtx.beginPath();
                sonarCtx.arc(contactX, contactY, contact.size, 0, Math.PI * 2);
                sonarCtx.fill();
                sonarCtx.restore();
            }
        });

        sonarAngle += 0.015;
        requestAnimationFrame(drawSonar);
    }

    // =========================================================
    // CLOCK SYSTEMS
    // =========================================================

    function updateClocks() {
        // Mission Clock
        const elapsed = Date.now() - state.missionStart;
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        const missionTime = `${days.toString().padStart(3, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('mission-clock').textContent = missionTime;

        // UTC Clock
        const now = new Date();
        const utc = now.toISOString().substr(11, 8);
        document.getElementById('utc-clock').textContent = utc;

        // Viewport Time
        document.getElementById('viewport-time').textContent = `REC ● ${utc}`;
    }

    // =========================================================
    // FAUNA TARGET ANIMATION
    // =========================================================

    function animateFaunaTargets() {
        state.faunaTargets.forEach((target, i) => {
            target.x += target.vx;
            target.y += target.vy;

            // Bounce off edges
            if (target.x < 10 || target.x > 90) target.vx *= -1;
            if (target.y < 10 || target.y > 85) target.vy *= -1;

            // Random direction changes
            if (Math.random() < 0.005) {
                target.vx = (Math.random() - 0.5) * 0.04;
                target.vy = (Math.random() - 0.5) * 0.04;
            }

            const element = document.getElementById(`fauna-${i + 1}`);
            if (element) {
                element.style.left = `${target.x}%`;
                element.style.top = `${target.y}%`;
            }
        });

        requestAnimationFrame(animateFaunaTargets);
    }

    // =========================================================
    // SENSOR SIMULATION
    // =========================================================

    function fluctuateSensors() {
        // Temperature
        state.sensors.temperature += (Math.random() - 0.5) * 0.1;
        state.sensors.temperature = Math.max(1.0, Math.min(1.8, state.sensors.temperature));
        document.getElementById('temp-value').textContent = `${state.sensors.temperature.toFixed(1)}°C`;

        // Salinity
        state.sensors.salinity += (Math.random() - 0.5) * 0.05;
        state.sensors.salinity = Math.max(34.5, Math.min(35.0, state.sensors.salinity));
        document.getElementById('salinity-value').textContent = `${state.sensors.salinity.toFixed(1)}‰`;

        // Current
        state.sensors.current += (Math.random() - 0.5) * 0.05;
        state.sensors.current = Math.max(0.1, Math.min(0.6, state.sensors.current));
        document.getElementById('current-value').textContent = `${state.sensors.current.toFixed(1)} kn`;

        // Oxygen
        state.sensors.oxygen += (Math.random() - 0.5) * 0.1;
        state.sensors.oxygen = Math.max(5.8, Math.min(6.6, state.sensors.oxygen));
        document.getElementById('oxygen-value').textContent = `${state.sensors.oxygen.toFixed(1)} ml/L`;
    }

    // =========================================================
    // HULL INTEGRITY ANIMATION
    // =========================================================

    function updateHullIntegrity() {
        const hullFill = document.getElementById('hull-fill');
        const hullInnerFill = document.getElementById('hull-inner-fill');
        const hullPercent = document.getElementById('hull-percent');
        const hullStatus = document.getElementById('hull-status');

        // Slowly decrease and occasionally repair
        if (Math.random() < 0.01) {
            state.hullIntegrity -= 0.1;
        }
        if (Math.random() < 0.005) {
            state.hullIntegrity += 0.05;
        }
        state.hullIntegrity = Math.max(92, Math.min(99.5, state.hullIntegrity));

        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (state.hullIntegrity / 100) * circumference;
        
        hullFill.style.strokeDasharray = circumference;
        hullFill.style.strokeDashoffset = offset;

        const innerCircumference = 2 * Math.PI * 70;
        const innerOffset = innerCircumference - (state.hullIntegrity / 100) * innerCircumference;
        
        hullInnerFill.style.strokeDasharray = innerCircumference;
        hullInnerFill.style.strokeDashoffset = innerOffset;

        hullPercent.textContent = `${state.hullIntegrity.toFixed(1)}%`;

        if (state.hullIntegrity > 95) {
            hullFill.style.stroke = '#00ff9d';
            hullInnerFill.style.stroke = '#00ff9d';
            hullStatus.textContent = 'NOMINAL';
            hullStatus.setAttribute('fill', '#00ff9d');
        } else if (state.hullIntegrity > 90) {
            hullFill.style.stroke = '#ffaa00';
            hullInnerFill.style.stroke = '#ffaa00';
            hullStatus.textContent = 'CAUTION';
            hullStatus.setAttribute('fill', '#ffaa00');
        } else {
            hullFill.style.stroke = '#ff3333';
            hullInnerFill.style.stroke = '#ff3333';
            hullStatus.textContent = 'WARNING';
            hullStatus.setAttribute('fill', '#ff3333');
        }
    }

    // =========================================================
    // DEPTH GAUGE UPDATE
    // =========================================================

    function updateDepthGauge() {
        // Slight fluctuation
        state.depth += (Math.random() - 0.5) * 0.5;
        state.depth = Math.max(10900, Math.min(10950, state.depth));

        document.getElementById('depth-value').textContent = Math.floor(state.depth).toLocaleString();

        // Update fill height
        const fillPercent = (state.depth / 11000) * 100;
        document.getElementById('depth-fill').style.height = `${fillPercent}%`;

        // Update marker position
        const marker = document.getElementById('current-depth-marker');
        marker.style.bottom = `${fillPercent}%`;

        // Update ambient color based on depth
        updateDepthAmbient();
    }

    function updateDepthAmbient() {
        const depthRatio = state.depth / 11000;
        const body = document.body;
        
        // Shift from teal to deep blue to near-black as depth increases
        const r = Math.floor(2 - depthRatio * 2);
        const g = Math.floor(8 - depthRatio * 7);
        const b = Math.floor(20 - depthRatio * 18);
        
        body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    // =========================================================
    // PRESSURE SYSTEM
    // =========================================================

    function updatePressure() {
        // Pressure correlates with depth
        state.pressure = state.depth * 0.1 + (Math.random() - 0.5) * 2;
        state.pressure = Math.max(1080, Math.min(1095, state.pressure));

        document.getElementById('pressure-value').textContent = Math.floor(state.pressure).toLocaleString();
        document.getElementById('hull-differential').textContent = `${Math.floor(state.pressure - 1).toLocaleString()} ATM`;

        // Update pressure bar
        const barPercent = (state.pressure / 1500) * 100;
        document.getElementById('pressure-bar-fill').style.width = `${barPercent}%`;

        // Update klaxon based on pressure
        updateKlaxon();
    }

    function updateKlaxon() {
        const klaxonMessage = document.getElementById('klaxon-message');
        const klaxonBar = document.getElementById('klaxon-bar');
        const warningSeg = klaxonBar.querySelector('.warning');
        const dangerSeg = klaxonBar.querySelector('.danger');

        if (state.pressure > 1090) {
            klaxonMessage.textContent = 'PRESSURE ELEVATED — MONITORING CLOSELY';
            klaxonMessage.style.color = 'var(--color-amber)';
            warningSeg.style.display = 'block';
        } else if (state.pressure > 1093) {
            klaxonMessage.textContent = 'PRESSURE CRITICAL — PREPARE EMERGENCY PROCEDURES';
            klaxonMessage.style.color = 'var(--color-red)';
            warningSeg.style.display = 'block';
            dangerSeg.style.display = 'block';
        } else {
            klaxonMessage.textContent = 'PRESSURE NOMINAL — ALL SYSTEMS GREEN';
            klaxonMessage.style.color = 'var(--color-amber)';
            warningSeg.style.display = 'block';
            dangerSeg.style.display = 'none';
        }
    }

    // =========================================================
    // CURRENT FLOW ANIMATION
    // =========================================================

    function animateCurrentFlow() {
        const arrows = document.querySelectorAll('.current-arrows span');
        arrows.forEach((arrow, i) => {
            setTimeout(() => {
                arrow.style.opacity = '0.3';
                setTimeout(() => {
                    arrow.style.opacity = '1';
                }, 100);
            }, i * 200);
        });
    }

    // =========================================================
    // POWER RESERVE FLUCTUATION
    // =========================================================

    function updatePowerReserve() {
        const powerElement = document.getElementById('power-reserve');
        let currentPower = parseFloat(powerElement.textContent);
        currentPower += (Math.random() - 0.5) * 0.2;
        currentPower = Math.max(85, Math.min(98, currentPower));
        powerElement.textContent = `${currentPower.toFixed(0)}%`;
    }

    // =========================================================
    // O2 LEVEL FLUCTUATION
    // =========================================================

    function updateO2Levels() {
        const o2Element = document.getElementById('o2-levels');
        let currentO2 = parseFloat(o2Element.textContent);
        currentO2 += (Math.random() - 0.5) * 0.1;
        currentO2 = Math.max(20.5, Math.min(21.2, currentO2));
        o2Element.textContent = `${currentO2.toFixed(1)}%`;
    }

    // =========================================================
    // INITIALIZATION SEQUENCE
    // =========================================================

    function init() {
        // Canvas setup
        initParticles();
        animateParticles();
        drawSonar();

        // Start update loops
        setInterval(updateClocks, 1000);
        setInterval(updateDepthGauge, 2000);
        setInterval(updatePressure, 3000);
        setInterval(updateHullIntegrity, 5000);
        setInterval(fluctuateSensors, 4000);
        setInterval(updatePowerReserve, 6000);
        setInterval(updateO2Levels, 5000);
        setInterval(animateCurrentFlow, 1500);

        // Start fauna animation
        animateFaunaTargets();

        // Initial updates
        updateClocks();
        updateDepthGauge();
        updatePressure();
        updateHullIntegrity();

        console.log('🌊 ABYSSAL STATION initialized. Depth: 10,928m. All systems nominal.');
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeBioluminescenceCanvas();
    });

    // Start
    init();
});
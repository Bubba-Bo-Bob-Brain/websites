// ============================================
// ABYSSAL STATION - Deep-Sea Research Platform
// JavaScript Controller
// ============================================

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        missionStartTime: Date.now() - (147 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 42 * 60 * 1000),
        depth: {
            current: 4721,
            min: 4700,
            max: 4750,
            descentRate: -0.3
        },
        pressure: {
            current: 472.8,
            warningThreshold: 85
        },
        sonar: {
            rotationSpeed: 0.02,
            pingInterval: 3000,
            contactCount: 4
        },
        particles: {
            count: 60,
            bioCount: 25
        }
    };

    // ============================================
    // STATE
    // ============================================
    const state = {
        sonarAngle: 0,
        lastPing: Date.now(),
        particles: [],
        bioParticles: [],
        sonarContacts: [],
        currentParticles: [],
        bioCreatures: [],
        hullIndicators: [],
        time: 0
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {};

    function cacheElements() {
        elements.sonarCanvas = document.getElementById('sonar-canvas');
        elements.bioCanvas = document.getElementById('bio-canvas');
        elements.hullCanvas = document.getElementById('hull-canvas');
        elements.currentFlowCanvas = document.getElementById('current-flow-canvas');
        elements.depthGaugeCanvas = document.getElementById('depth-gauge-canvas');
        elements.particleContainer = document.getElementById('particle-container');
        elements.missionTime = document.getElementById('mission-time');
        elements.depthValue = document.getElementById('depth-value');
        elements.pressureValue = document.getElementById('pressure-value');
        elements.pressureBar = document.getElementById('pressure-bar');
        elements.hullStress = document.getElementById('hull-stress');
        elements.descentRate = document.getElementById('descent-rate');
        elements.waterTemp = document.getElementById('water-temp');
        elements.salinity = document.getElementById('salinity');
        elements.o2Level = document.getElementById('o2-level');
        elements.currentVel = document.getElementById('current-vel');
        elements.currentDir = document.getElementById('current-dir');
        elements.visibility = document.getElementById('visibility');
        elements.lastPing = document.getElementById('last-ping');
        elements.contactCount = document.getElementById('contact-count');
        elements.klaxonBar = document.getElementById('klaxon-bar');
        elements.sonarPingRipple = document.getElementById('sonar-ping-ripple');
        elements.depthOverlay = document.getElementById('ocean-depth-overlay');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function formatClockTime() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    class Particle {
        constructor(container, isBio = false) {
            this.container = container;
            this.isBio = isBio;
            this.element = document.createElement('div');
            this.reset();
            this.container.appendChild(this.element);
        }

        reset() {
            this.x = randomRange(0, 100);
            this.y = randomRange(0, 100);
            this.size = this.isBio ? randomRange(2, 6) : randomRange(1, 3);
            this.speedX = randomRange(-0.3, 0.3);
            this.speedY = this.isBio ? randomRange(-0.2, 0.2) : randomRange(0.1, 0.5);
            this.opacity = randomRange(0.2, 0.8);
            this.life = randomRange(5000, 15000);

            this.element.style.cssText = `
                position: absolute;
                width: ${this.size}px;
                height: ${this.size}px;
                border-radius: 50%;
                background: ${this.isBio ? this.getBioColor() : 'rgba(100, 180, 255, 0.6)'};
                box-shadow: 0 0 ${this.size * 2}px ${this.isBio ? this.getBioColor() : 'rgba(100, 180, 255, 0.4)'};
                left: ${this.x}%;
                top: ${this.y}%;
                opacity: ${this.opacity};
                pointer-events: none;
            `;
        }

        getBioColor() {
            const colors = [
                'rgba(0, 255, 200, 0.8)',
                'rgba(100, 255, 150, 0.8)',
                'rgba(170, 100, 255, 0.8)',
                'rgba(255, 200, 100, 0.8)',
                'rgba(0, 200, 255, 0.8)'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update(deltaTime) {
            this.x += this.speedX * deltaTime * 0.01;
            this.y += this.speedY * deltaTime * 0.01;
            this.life -= deltaTime;

            if (this.x < 0 || this.x > 100 || this.y < 0 || this.y > 100 || this.life <= 0) {
                this.reset();
                this.y = this.speedY > 0 ? 0 : 100;
            }

            this.element.style.left = `${this.x}%`;
            this.element.style.top = `${this.y}%`;
            this.element.style.opacity = Math.max(0, this.opacity * (this.life / 2000));
        }
    }

    function initParticles() {
        for (let i = 0; i < CONFIG.particles.count; i++) {
            state.particles.push(new Particle(elements.particleContainer, false));
        }
        for (let i = 0; i < CONFIG.particles.bioCount; i++) {
            state.bioParticles.push(new Particle(elements.particleContainer, true));
        }
    }

    // ============================================
    // SONAR SYSTEM
    // ============================================
    function initSonarContacts() {
        state.sonarContacts = [
            { angle: 42, distance: 0.3, size: 8, type: 'bio', label: 'BIO-01' },
            { angle: 120, distance: 0.6, size: 5, type: 'rock', label: 'GEO-03' },
            { angle: 187, distance: 0.45, size: 6, type: 'bio', label: 'BIO-02' },
            { angle: 280, distance: 0.8, size: 4, type: 'unknown', label: 'UNK-01' },
            { angle: 315, distance: 0.25, size: 7, type: 'bio', label: 'BIO-03' }
        ];
    }

    function drawSonar(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Grid circles
        ctx.strokeStyle = 'rgba(0, 100, 150, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * i / 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Grid lines
        ctx.strokeStyle = 'rgba(0, 100, 150, 0.2)';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            ctx.stroke();
        }

        // Sweep trail
        const gradient = ctx.createConicGradient(state.sonarAngle, centerX, centerY);
        gradient.addColorStop(0, 'rgba(0, 170, 255, 0.4)');
        gradient.addColorStop(0.1, 'rgba(0, 170, 255, 0.1)');
        gradient.addColorStop(0.2, 'rgba(0, 170, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 170, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sweep line
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.9)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 255, 200, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(state.sonarAngle) * radius,
            centerY + Math.sin(state.sonarAngle) * radius
        );
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Contacts
        state.sonarContacts.forEach(contact => {
            const contactAngle = (contact.angle * Math.PI) / 180;
            const contactRadius = radius * contact.distance;
            const x = centerX + Math.cos(contactAngle) * contactRadius;
            const y = centerY + Math.sin(contactAngle) * contactRadius;

            // Check if contact is in sweep zone
            let angleDiff = state.sonarAngle - contactAngle;
            while (angleDiff < 0) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;

            const inSweep = angleDiff < 0.5;
            const fadeOut = angleDiff < 2 ? (2 - angleDiff) / 2 : 0.3;

            let color;
            switch (contact.type) {
                case 'bio': color = `rgba(0, 255, 200, ${inSweep ? 1 : fadeOut})`; break;
                case 'rock': color = `rgba(150, 150, 150, ${inSweep ? 0.8 : fadeOut * 0.8})`; break;
                default: color = `rgba(255, 200, 0, ${inSweep ? 1 : fadeOut})`;
            }

            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = inSweep ? 15 : 5;
            ctx.beginPath();
            ctx.arc(x, y, contact.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Contact label
            if (inSweep) {
                ctx.fillStyle = 'rgba(200, 220, 255, 0.8)';
                ctx.font = '8px "Share Tech Mono"';
                ctx.fillText(contact.label, x + 10, y + 3);
            }
        });

        // Center dot
        ctx.fillStyle = 'rgba(0, 255, 200, 0.9)';
        ctx.shadowColor = 'rgba(0, 255, 200, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ============================================
    // BIO SCAN CANVAS
    // ============================================
    function initBioCreatures() {
        state.bioCreatures = [
            { x: 0.3, y: 0.4, size: 12, color: 'rgba(0, 255, 200, 0.8)', speed: 0.001, angle: 0 },
            { x: 0.6, y: 0.3, size: 8, color: 'rgba(100, 255, 150, 0.8)', speed: 0.0015, angle: Math.PI / 3 },
            { x: 0.4, y: 0.7, size: 15, color: 'rgba(170, 100, 255, 0.8)', speed: 0.0008, angle: Math.PI },
            { x: 0.7, y: 0.6, size: 10, color: 'rgba(255, 200, 100, 0.8)', speed: 0.0012, angle: Math.PI * 1.5 },
            { x: 0.2, y: 0.6, size: 6, color: 'rgba(0, 200, 255, 0.8)', speed: 0.002, angle: Math.PI / 6 }
        ];
    }

    function drawBioScan(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);

        // Background with subtle gradient
        const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
        bgGradient.addColorStop(0, 'rgba(20, 10, 40, 0.9)');
        bgGradient.addColorStop(1, 'rgba(5, 0, 15, 0.95)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(170, 100, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo((width / 10) * i, 0);
            ctx.lineTo((width / 10) * i, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, (height / 10) * i);
            ctx.lineTo(width, (height / 10) * i);
            ctx.stroke();
        }

        // Draw creatures
        state.bioCreatures.forEach(creature => {
            // Update position
            creature.x += Math.cos(creature.angle) * creature.speed;
            creature.y += Math.sin(creature.angle) * creature.speed;

            // Bounce off walls
            if (creature.x < 0.1 || creature.x > 0.9) creature.angle = Math.PI - creature.angle;
            if (creature.y < 0.1 || creature.y > 0.9) creature.angle = -creature.angle;

            const x = creature.x * width;
            const y = creature.y * height;

            // Glow
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, creature.size * 2);
            glowGradient.addColorStop(0, creature.color);
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, creature.size * 2, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.fillStyle = creature.color;
            ctx.shadowColor = creature.color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, creature.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Tentacles / trails
            ctx.strokeStyle = creature.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < 4; i++) {
                const tentacleAngle = creature.angle + (i - 1.5) * 0.3;
                const tentacleLength = creature.size * 1.5;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(
                    x + Math.cos(tentacleAngle) * tentacleLength * 0.5 + Math.sin(state.time * 0.01 + i) * 3,
                    y + Math.sin(tentacleAngle) * tentacleLength * 0.5 + Math.cos(state.time * 0.01 + i) * 3,
                    x + Math.cos(tentacleAngle) * tentacleLength,
                    y + Math.sin(tentacleAngle) * tentacleLength
                );
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        });

        // Scan line effect
        const scanY = (state.time * 0.1) % height;
        ctx.strokeStyle = 'rgba(170, 100, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
    }

    // ============================================
    // HULL INTEGRITY CANVAS
    // ============================================
    function drawHullSchematic(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const radiusX = width * 0.4;
        const radiusY = height * 0.35;

        // Background
        ctx.fillStyle = 'rgba(0, 20, 40, 0.5)';
        ctx.fillRect(0, 0, width, height);

        // Outer hull
        ctx.strokeStyle = 'rgba(26, 58, 92, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner hull
        ctx.strokeStyle = 'rgba(13, 31, 53, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX * 0.85, radiusY * 0.85, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Section dividers
        ctx.strokeStyle = 'rgba(26, 58, 92, 0.5)';
        ctx.lineWidth = 1;
        const sections = [0.25, 0.5, 0.75];
        sections.forEach(pos => {
            const x = centerX - radiusX + (radiusX * 2 * pos);
            ctx.beginPath();
            ctx.moveTo(x, centerY - radiusY + 10);
            ctx.lineTo(x, centerY + radiusY - 10);
            ctx.stroke();
        });

        // Section labels
        ctx.fillStyle = 'rgba(26, 58, 92, 0.8)';
        ctx.font = '9px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('SEC-A', centerX - radiusX * 0.625, centerY + 3);
        ctx.fillText('SEC-B', centerX - radiusX * 0.125, centerY + 3);
        ctx.fillText('SEC-C', centerX + radiusX * 0.375, centerY + 3);
        ctx.fillText('SEC-D', centerX + radiusX * 0.75, centerY + 3);

        // Hull indicators
        const indicators = [
            { x: 0.1, y: 0.35, status: 'good' },
            { x: 0.3, y: 0.2, status: 'good' },
            { x: 0.55, y: 0.2, status: 'warning' },
            { x: 0.85, y: 0.35, status: 'good' },
            { x: 0.2, y: 0.7, status: 'good' },
            { x: 0.5, y: 0.75, status: 'good' },
            { x: 0.75, y: 0.7, status: 'good' }
        ];

        indicators.forEach((ind, index) => {
            const x = centerX - radiusX + (radiusX * 2 * ind.x);
            const y = centerY - radiusY + (radiusY * 2 * ind.y);

            let color;
            if (ind.status === 'good') {
                color = 'rgba(0, 255, 136, 0.9)';
            } else {
                const pulse = Math.sin(state.time * 0.01) * 0.3 + 0.7;
                color = `rgba(255, 204, 0, ${pulse})`;
            }

            // Glow
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;

            // Indicator dot
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
        });

        // Stress crack animation for warning section
        if (Math.sin(state.time * 0.005) > 0) {
            ctx.strokeStyle = 'rgba(255, 204, 0, 0.6)';
            ctx.lineWidth = 1;
            const crackX = centerX + radiusX * 0.1;
            const crackY = centerY - radiusY * 0.6;
            ctx.beginPath();
            ctx.moveTo(crackX, crackY);
            ctx.lineTo(crackX + 8, crackY + 10);
            ctx.moveTo(crackX + 4, crackY + 5);
            ctx.lineTo(crackX - 2, crackY + 12);
            ctx.stroke();
        }
    }

    // ============================================
    // CURRENT FLOW VISUALIZATION
    // ============================================
    function initCurrentParticles() {
        for (let i = 0; i < 30; i++) {
            state.currentParticles.push({
                x: Math.random(),
                y: Math.random(),
                speed: randomRange(0.001, 0.003),
                size: randomRange(1, 3),
                opacity: randomRange(0.3, 0.7)
            });
        }
    }

    function drawCurrentFlow(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = 'rgba(0, 20, 40, 0.5)';
        ctx.fillRect(0, 0, width, height);

        // Draw flow particles
        state.currentParticles.forEach(particle => {
            particle.x += particle.speed;
            if (particle.x > 1.1) particle.x = -0.1;

            const x = particle.x * width;
            const y = particle.y * height + Math.sin(state.time * 0.01 + particle.x * 10) * 5;

            ctx.fillStyle = `rgba(0, 170, 255, ${particle.opacity})`;
            ctx.beginPath();
            ctx.ellipse(x, y, particle.size * 2, particle.size, 0, 0, Math.PI * 2);
            ctx.fill();

            // Trail
            ctx.strokeStyle = `rgba(0, 170, 255, ${particle.opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 15, y);
            ctx.stroke();
        });

        // Flow direction indicator
        ctx.fillStyle = 'rgba(0, 255, 200, 0.8)';
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillText('NNW 342', width - 60, height - 8);
    }

    // ============================================
    // DEPTH GAUGE
    // ============================================
    function drawDepthGauge(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 15;

        // Background arc
        ctx.strokeStyle = 'rgba(10, 22, 40, 0.8)';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
        ctx.stroke();

        // Value arc
        const depthPercent = (CONFIG.depth.current - CONFIG.depth.min) / (CONFIG.depth.max - CONFIG.depth.min);
        const endAngle = Math.PI * 0.75 + (Math.PI * 1.5 * depthPercent);

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(0, 255, 200, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 200, 1)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle);
        ctx.stroke();

        // Tick marks
        ctx.strokeStyle = 'rgba(26, 58, 92, 0.8)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const angle = Math.PI * 0.75 + (Math.PI * 1.5 * i / 10);
            const innerRadius = radius - 15;
            const outerRadius = radius - 8;
            ctx.beginPath();
            ctx.moveTo(
                centerX + Math.cos(angle) * innerRadius,
                centerY + Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
                centerX + Math.cos(angle) * outerRadius,
                centerY + Math.sin(angle) * outerRadius
            );
            ctx.stroke();
        }

        // Needle
        const needleAngle = Math.PI * 0.75 + (Math.PI * 1.5 * depthPercent);
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.9)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(0, 255, 200, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(needleAngle) * (radius - 25),
            centerY + Math.sin(needleAngle) * (radius - 25)
        );
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Center circle
        ctx.fillStyle = 'rgba(0, 255, 200, 0.9)';
        ctx.shadowColor = 'rgba(0, 255, 200, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ============================================
    // UI UPDATES
    // ============================================
    function updateMissionClock() {
        const elapsed = Date.now() - CONFIG.missionStartTime;
        elements.missionTime.textContent = formatTime(elapsed);
    }

    function updateDepthAndPressure() {
        // Simulate slight depth variations
        CONFIG.depth.current += randomRange(-0.5, 0.5);
        CONFIG.depth.current = Math.max(CONFIG.depth.min, Math.min(CONFIG.depth.max, CONFIG.depth.current));

        const depthFormatted = Math.round(CONFIG.depth.current).toLocaleString();
        elements.depthValue.textContent = depthFormatted;

        // Update pressure based on depth
        CONFIG.pressure.current = CONFIG.depth.current / 10;
        elements.pressureValue.textContent = CONFIG.pressure.current.toFixed(1);

        // Update pressure bar
        const pressurePercent = (CONFIG.pressure.current / 650) * 100;
        elements.pressureBar.style.width = `${Math.min(pressurePercent, 100)}%`;

        // Check for pressure warning
        if (pressurePercent > CONFIG.pressure.warningThreshold) {
            elements.klaxonBar.classList.remove('hidden');
        } else {
            elements.klaxonBar.classList.add('hidden');
        }

        // Update descent rate
        CONFIG.depth.descentRate += randomRange(-0.1, 0.1);
        CONFIG.depth.descentRate = Math.max(-1, Math.min(1, CONFIG.depth.descentRate));
        elements.descentRate.textContent = CONFIG.depth.descentRate.toFixed(1);

        // Update hull stress
        const hullStress = 0.7 + (pressurePercent / 1000);
        elements.hullStress.textContent = hullStress.toFixed(2);

        // Update depth overlay color based on depth
        const depthRatio = (CONFIG.depth.current - CONFIG.depth.min) / (CONFIG.depth.max - CONFIG.depth.min);
        const hue = 210 + depthRatio * 10;
        const lightness = 5 + depthRatio * 3;
        elements.depthOverlay.style.background = `linear-gradient(180deg, 
            hsl(${hue}, 80%, ${lightness}%) 0%, 
            hsl(${hue + 10}, 70%, ${lightness + 2}%) 50%, 
            hsl(${hue + 20}, 60%, ${lightness + 4}%) 100%)`;
    }

    function updateEnvironmentalData() {
        // Simulate small environmental fluctuations
        const temp = 2.4 + randomRange(-0.1, 0.1);
        elements.waterTemp.textContent = `${temp.toFixed(1)}C`;

        const salinity = 34.8 + randomRange(-0.2, 0.2);
        elements.salinity.textContent = `${salinity.toFixed(1)} ppt`;

        const o2 = 6.1 + randomRange(-0.2, 0.2);
        elements.o2Level.textContent = `${o2.toFixed(1)} mg/L`;

        const currentVel = 0.12 + randomRange(-0.02, 0.02);
        elements.currentVel.textContent = `${currentVel.toFixed(2)} m/s`;

        const visibility = 12.4 + randomRange(-0.5, 0.5);
        elements.visibility.textContent = `${visibility.toFixed(1)} m`;
    }

    function updateSonarStats() {
        const timeSincePing = (Date.now() - state.lastPing) / 1000;
        elements.lastPing.textContent = `${timeSincePing.toFixed(1)}s AGO`;

        // Randomly fluctuate contact count
        if (Math.random() < 0.01) {
            const newCount = CONFIG.sonar.contactCount + (Math.random() > 0.5 ? 1 : -1);
            CONFIG.sonar.contactCount = Math.max(2, Math.min(6, newCount));
            elements.contactCount.textContent = `${CONFIG.sonar.contactCount} TRACKING`;
        }
    }

    // ============================================
    // SONAR PING EFFECT
    // ============================================
    function triggerSonarPing() {
        state.lastPing = Date.now();
        elements.sonarPingRipple.classList.remove('active');
        void elements.sonarPingRipple.offsetWidth; // Force reflow
        elements.sonarPingRipple.classList.add('active');
    }

    // ============================================
    // MAIN ANIMATION LOOP
    // ============================================
    let lastTime = 0;

    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        state.time = currentTime;

        // Update sonar rotation
        state.sonarAngle += CONFIG.sonar.rotationSpeed;
        if (state.sonarAngle > Math.PI * 2) {
            state.sonarAngle -= Math.PI * 2;
            triggerSonarPing();
        }

        // Draw sonar
        const sonarCtx = elements.sonarCanvas.getContext('2d');
        drawSonar(sonarCtx, elements.sonarCanvas.width, elements.sonarCanvas.height);

        // Draw bio scan
        const bioCtx = elements.bioCanvas.getContext('2d');
        drawBioScan(bioCtx, elements.bioCanvas.width, elements.bioCanvas.height);

        // Draw hull schematic
        const hullCtx = elements.hullCanvas.getContext('2d');
        drawHullSchematic(hullCtx, elements.hullCanvas.width, elements.hullCanvas.height);

        // Draw current flow
        const currentCtx = elements.currentFlowCanvas.getContext('2d');
        drawCurrentFlow(currentCtx, elements.currentFlowCanvas.width, elements.currentFlowCanvas.height);

        // Draw depth gauge
        const depthCtx = elements.depthGaugeCanvas.getContext('2d');
        drawDepthGauge(depthCtx, elements.depthGaugeCanvas.width, elements.depthGaugeCanvas.height);

        // Update particles
        state.particles.forEach(p => p.update(deltaTime));
        state.bioParticles.forEach(p => p.update(deltaTime));

        requestAnimationFrame(animate);
    }

    // ============================================
    // PERIODIC UPDATES
    // ============================================
    function startPeriodicUpdates() {
        // Mission clock - every second
        setInterval(updateMissionClock, 1000);

        // Depth and pressure - every 500ms
        setInterval(updateDepthAndPressure, 500);

        // Environmental data - every 2 seconds
        setInterval(updateEnvironmentalData, 2000);

        // Sonar stats - every 100ms
        setInterval(updateSonarStats, 100);

        // Initial updates
        updateMissionClock();
        updateDepthAndPressure();
        updateEnvironmentalData();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        cacheElements();
        initParticles();
        initSonarContacts();
        initBioCreatures();
        initCurrentParticles();
        startPeriodicUpdates();

        // Start animation loop
        requestAnimationFrame(animate);

        // Initial sonar ping
        setTimeout(triggerSonarPing, 1000);

        console.log('ABYSSAL STATION - All systems initialized');
        console.log('Depth:', CONFIG.depth.current, 'meters');
        console.log('Pressure:', CONFIG.pressure.current, 'ATM');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
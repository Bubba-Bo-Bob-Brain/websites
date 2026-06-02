/**
 * DSV-9000 // ABYSSAL COMMAND - LOGIC
 * Handles particle simulation, data telemetry, and UI interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const CONFIG = {
        particleCount: 60,
        basePressure: 8000,
        baseDepth: 3500,
        sonarSpeed: 4000, // ms per rotation
        updateInterval: 1000, // ms for telemetry
    };

    // --- DOM ELEMENTS ---
    const canvas = document.getElementById('ocean-canvas');
    const ctx = canvas.getContext('2d');
    const hullArc = document.getElementById('hull-arc');
    const hullVal = document.getElementById('hull-val');
    const pressureVal = document.getElementById('pressure-val');
    const depthFill = document.getElementById('depth-fill');
    const tempVal = document.getElementById('temp-val');
    const o2Val = document.getElementById('o2-val');
    const batVal = document.getElementById('bat-val');
    const warningText = document.getElementById('warning-text');
    const utcClock = document.getElementById('utc-clock');

    // --- STATE ---
    let state = {
        pressure: CONFIG.basePressure,
        depth: CONFIG.baseDepth,
        hullIntegrity: 98,
        temperature: 21.5,
        o2: 98,
        battery: 84,
        isCritical: false
    };

    // --- UTILS ---
    const randomRange = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(randomRange(min, max));
    const formatNumber = (num) => num.toLocaleString();

    // --- PARTICLE SYSTEM (Bioluminescence) ---
    let particles = [];
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
            // Start at random positions initially
            this.y = randomRange(0, height);
        }

        reset() {
            this.x = randomRange(0, width);
            this.y = height + 10;
            this.size = randomRange(1, 3);
            this.speed = randomRange(0.2, 0.8);
            this.opacity = randomRange(0.1, 0.6);
            this.glowColor = Math.random() > 0.8 ? '#00ff9d' : '#00f3ff'; // Green or Cyan
            this.wobble = randomRange(0, Math.PI * 2);
            this.wobbleSpeed = randomRange(0.01, 0.03);
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.5;

            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.glowColor;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            
            // Add glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.glowColor;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        resizeCanvas();
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
        animateParticles();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw deep ocean gradient background on canvas
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#020408');
        gradient.addColorStop(1, '#001525');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);

    // --- TELEMETRY SIMULATION ---
    function updateTelemetry() {
        // Fluctuate values slightly to simulate sensor noise
        state.pressure += randomRange(-15, 15);
        state.depth += randomRange(-2, 2);
        state.temperature += randomRange(-0.1, 0.1);
        state.o2 = Math.max(0, Math.min(100, state.o2 + randomRange(-0.1, 0.1)));
        state.battery = Math.max(0, state.battery - 0.01); // Slow drain

        // Hull Integrity Logic
        if (state.isCritical) {
            state.hullIntegrity -= randomRange(0.1, 0.5);
            if (state.hullIntegrity < 0) state.hullIntegrity = 0;
        } else {
            // Slow recovery or minor fluctuation
            state.hullIntegrity += randomRange(-0.05, 0.05);
            if (state.hullIntegrity > 100) state.hullIntegrity = 100;
            if (state.hullIntegrity < 95) state.hullIntegrity = 95;
        }

        // Update DOM
        pressureVal.innerText = formatNumber(Math.floor(state.pressure));
        tempVal.innerText = state.temperature.toFixed(1) + '°C';
        o2Val.innerText = state.o2.toFixed(1) + '%';
        batVal.innerText = state.battery.toFixed(1) + '%';

        // Update Hull Gauge
        const percentage = state.hullIntegrity;
        const circumference = 100; // SVG stroke-dasharray total
        hullArc.style.strokeDasharray = `${percentage}, ${circumference}`;
        hullVal.innerText = Math.floor(percentage);

        // Update Depth Bar
        // Assuming 4000m is max on the bar
        const depthPercent = Math.min(100, (state.depth / 4000) * 100);
        depthFill.style.width = `${depthPercent}%`;

        // Dynamic Color Logic based on Depth/Pressure
        const depthRatio = state.depth / 4000;
        if (depthRatio > 0.8) {
            // Deep Warning
            depthFill.style.background = 'linear-gradient(90deg, #ffaa00, #ff3333)';
            if (Math.random() > 0.95) triggerWarning();
        } else {
            // Normal
            depthFill.style.background = 'linear-gradient(90deg, #00f3ff, #00ff9d)';
            warningText.innerText = "SYSTEM NORMAL";
            warningText.style.color = "#00ff9d";
            state.isCritical = false;
        }

        // Update Hull Color based on integrity
        if (state.hullIntegrity < 50) {
            hullArc.style.stroke = '#ff3333';
            hullArc.style.filter = 'drop-shadow(0 0 5px #ff3333)';
            state.isCritical = true;
        } else if (state.hullIntegrity < 80) {
            hullArc.style.stroke = '#ffaa00';
            hullArc.style.filter = 'drop-shadow(0 0 5px #ffaa00)';
            state.isCritical = true;
        } else {
            hullArc.style.stroke = '#00f3ff';
            hullArc.style.filter = 'drop-shadow(0 0 5px #00f3ff)';
        }
    }

    function triggerWarning() {
        warningText.innerText = "PRESSURE WARNING // CHECK HULL";
        warningText.style.color = "#ff3333";
        warningText.style.animation = "blink 0.5s infinite";
        state.isCritical = true;
    }

    // --- CLOCK ---
    function updateClock() {
        const now = new Date();
        utcClock.innerText = now.toISOString().split('T')[1].split('.')[0] + " UTC";
    }

    // --- SONAR LOGIC (Visual only, handled by CSS animation, but we can add dynamic blips) ---
    // We could add dynamic blips here if we wanted to sync them with the CSS rotation,
    // but for this aesthetic, the CSS animation + random appearance is sufficient.

    // --- INITIALIZATION ---
    initParticles();
    
    // Start Loops
    setInterval(updateTelemetry, CONFIG.updateInterval);
    setInterval(updateClock, 1000);
    
    // Initial call
    updateTelemetry();
    updateClock();

    // --- INTERACTIVITY ---
    // Add a "Panic" button functionality if we wanted to extend it, 
    // but for now, let's just add a mouse-move parallax effect to the panels
    const panels = document.querySelectorAll('.panel');
    
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        panels.forEach(panel => {
            panel.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });
});
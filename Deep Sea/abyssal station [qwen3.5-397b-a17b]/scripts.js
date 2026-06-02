// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. CONFIGURATION & STATE
       ========================================= */
    const state = {
        depth: 10928,
        pressure: 1080,
        temp: 2.1,
        hullIntegrity: 98.4,
        isEmergency: false,
        lastBlipTime: 0
    };

    const config = {
        particleCount: 60,
        sonarSpeed: 4000, // ms per rotation
        warningThreshold: 90, // Hull integrity warning level
        colors: {
            normal: { r: 0, g: 240, b: 255 },   // Cyan
            warning: { r: 255, g: 170, b: 0 },  // Amber
            danger: { r: 255, g: 42, b: 42 }    // Red
        }
    };

    /* =========================================
       2. BIOLUMINESCENT PARTICLE SYSTEM
       ========================================= */
    const canvas = document.getElementById('bio-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Track mouse for interaction
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeDirection = Math.random() > 0.5 ? 0.01 : -0.01;
            // Randomize color slightly between cyan and green
            this.colorType = Math.random() > 0.8 ? 'green' : 'cyan';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction (repel)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (100 - distance) / 100;
                    const directionX = forceDirectionX * force * 2;
                    const directionY = forceDirectionY * force * 2;
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = 0;

            // Fade in/out
            this.opacity += this.fadeDirection;
            if (this.opacity > 0.8 || this.opacity < 0.1) {
                this.fadeDirection = -this.fadeDirection;
            }
        }

        draw() {
            ctx.fillStyle = this.colorType === 'green' 
                ? `rgba(0, 255, 100, ${this.opacity})` 
                : `rgba(0, 240, 255, ${this.opacity})`;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* =========================================
       3. SONAR & RADAR LOGIC
       ========================================= */
    const sonarOverlay = document.querySelector('.sonar-overlay');
    const blips = document.querySelectorAll('.sonar-blip');
    
    // Create dynamic blips
    function createBlip() {
        const blip = document.createElement('div');
        blip.classList.add('sonar-blip', 'dynamic-blip');
        
        // Random position within the circle
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 40; // % radius
        const top = 50 + (Math.sin(angle) * radius);
        const left = 50 + (Math.cos(angle) * radius);
        
        blip.style.top = `${top}%`;
        blip.style.left = `${left}%`;
        
        // Randomize animation delay to sync roughly with sweep
        const delay = Math.random() * 4;
        blip.style.animationDelay = `${delay}s`;
        
        sonarOverlay.appendChild(blip);

        // Remove after animation
        setTimeout(() => {
            blip.remove();
        }, 4000);
    }

    setInterval(() => {
        if (!state.isEmergency) {
            createBlip();
        }
    }, 1500);

    /* =========================================
       4. DATA SIMULATION & UPDATES
       ========================================= */
    const depthDisplay = document.getElementById('depth-display');
    const pressureVal = document.getElementById('pressure-val');
    const tempVal = document.getElementById('temp-val');
    const hullGaugeFill = document.querySelector('.gauge-fill');
    const hullValueText = document.querySelector('.gauge-value');
    const logContainer = document.querySelector('.warning-log');

    function updateData() {
        if (state.isEmergency) return; // Pause normal updates during emergency

        // Simulate depth fluctuation
        state.depth += (Math.random() - 0.5) * 2;
        depthDisplay.textContent = state.depth.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Simulate pressure (correlated to depth)
        state.pressure = 1080 + ((state.depth - 10928) * 0.1) + (Math.random() - 0.5);
        pressureVal.textContent = `${state.pressure.toFixed(1)} BAR`;

        // Simulate Temp
        state.temp = 2.1 + (Math.random() - 0.5) * 0.2;
        tempVal.textContent = `${state.temp.toFixed(2)}°C`;

        // Simulate Hull Integrity (slowly degrading or fluctuating)
        if (Math.random() > 0.7) {
            state.hullIntegrity -= 0.1;
            if (state.hullIntegrity < 80) state.hullIntegrity = 98; // Reset if too low for demo
        }
        
        const hullPercent = state.hullIntegrity.toFixed(1);
        hullValueText.textContent = `${hullPercent}%`;
        
        // Update Gauge SVG
        // Circumference = 2 * PI * 45 ≈ 283
        const offset = 283 - (283 * state.hullIntegrity) / 100;
        hullGaugeFill.style.strokeDashoffset = offset;

        // Color logic for gauge
        if (state.hullIntegrity < 90) {
            hullGaugeFill.style.stroke = 'var(--warning-amber)';
            hullGaugeFill.style.filter = 'drop-shadow(0 0 5px var(--warning-amber))';
        } else {
            hullGaugeFill.style.stroke = 'var(--cyan-glow)';
            hullGaugeFill.style.filter = 'drop-shadow(0 0 5px var(--cyan-glow))';
        }

        // Random Log Entry
        if (Math.random() > 0.95) {
            addLogEntry("Minor pressure fluctuation detected");
        }
    }

    function addLogEntry(msg) {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        entry.innerHTML = `<span class="time">${timeStr}</span> <span class="msg">${msg}</span>`;
        
        logContainer.appendChild(entry);
        if (logContainer.children.length > 5) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    // Clock
    function updateClock() {
        const now = new Date();
        document.getElementById('station-clock').textContent = now.toISOString().split('T')[1].split('.')[0];
    }

    setInterval(updateData, 1000);
    setInterval(updateClock, 1000);
    updateClock();

    /* =========================================
       5. INTERACTIVE CONTROLS
       ========================================= */
    const emergencyBtn = document.querySelector('.ctrl-btn.emergency');
    const body = document.body;

    emergencyBtn.addEventListener('click', () => {
        if (state.isEmergency) {
            // Reset
            state.isEmergency = false;
            emergencyBtn.textContent = "EMERGENCY ASCENT";
            body.style.filter = "none";
            body.style.animation = "none";
            addLogEntry("Emergency ascent aborted.");
        } else {
            // Trigger Emergency
            state.isEmergency = true;
            emergencyBtn.textContent = "ABORT ASCENT";
            addLogEntry("!!! EMERGENCY ASCENT INITIATED !!!");
            
            // Visual Chaos
            body.style.animation = "shake 0.5s infinite";
            
            // Flash screen
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.background = 'white';
            flash.style.opacity = '0.8';
            flash.style.zIndex = '9999';
            flash.style.transition = 'opacity 2s';
            document.body.appendChild(flash);
            
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => flash.remove(), 2000);
            }, 100);

            // Add CSS keyframe for shake dynamically if not present
            if (!document.getElementById('shake-style')) {
                const style = document.createElement('style');
                style.id = 'shake-style';
                style.textContent = `
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    });

    // Light toggle
    const lightBtn = document.querySelector('.ctrl-btn');
    const canvasContainer = document.getElementById('canvas-container');
    let lightsOn = true;

    lightBtn.addEventListener('click', () => {
        lightsOn = !lightsOn;
        if (lightsOn) {
            canvasContainer.style.opacity = '0.6';
            lightBtn.textContent = "EXT LIGHTS OFF";
            addLogEntry("External lights enabled");
        } else {
            canvasContainer.style.opacity = '0.05';
            lightBtn.textContent = "EXT LIGHTS ON";
            addLogEntry("External lights disabled - Darkness only");
        }
    });
});
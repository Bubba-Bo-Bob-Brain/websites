/**
 * CHRONICLES OF THE SHADOWED REALM
 * Core Logic & Immersive Systems
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const body = document.body;
    const masterFrame = document.querySelector('.master-frame');
    const bellBtn = document.getElementById('btn-toll-bell');
    const bellOverlay = document.getElementById('bell-overlay');
    const doctorWarning = document.getElementById('dynamic-warning');
    const mapNodes = document.querySelectorAll('.map-node');

    // --- Configuration & Data ---
    const grimTidings = [
        "The air grows thick with the scent of rot...",
        "Famine stalks the southern villages...",
        "The stars have turned a sickly shade of red...",
        "Rumors of a silent plague in the East...",
        "The bells haven't stopped ringing since midnight...",
        "The crops have turned to ash in the fields...",
        "A darkness descends upon the monastery..."
    ];

    const locationWarnings = {
        "The Capital": "The King's guard is failing. Chaos in the streets.",
        "The Forsaken Woods": "The trees whisper names of the dead.",
        "Plague Harbor": "The ships arrive empty. Only the sickness remains.",
        "Monastery Peak": "The monks have ceased their prayers. Silence reigns."
    };

    // --- 1. Temporal Engine (Day/Night Cycle) ---
    let isNight = true;
    const cycleTime = 15000; // 15 seconds for demo purposes

    const toggleDayNight = () => {
        isNight = !isNight;
        if (isNight) {
            body.classList.replace('theme-day', 'theme-night');
        } else {
            body.classList.replace('theme-night', 'theme-day');
        }
    };

    setInterval(toggleDayNight, cycleTime);

    // --- 2. The Bell Toll Mechanism ---
    const tollBell = () => {
        // Visual Flash
        bellOverlay.classList.add('bell-active');
        
        // Screen Shake
        masterFrame.classList.add('shake-effect');

        // Remove classes after animation completes
        setTimeout(() => {
            bellOverlay.classList.remove('bell-active');
        }, 500);

        setTimeout(() => {
            masterFrame.classList.remove('shake-effect');
        }, 500);

        // Log to console for "developer immersion"
        console.log("%c THE BELL TOLLS...", "color: #8b0000; font-size: 20px; font-weight: bold;");
    };

    bellBtn.addEventListener('click', tollBell);

    // --- 3. The Physician's Omen (Dynamic Messages) ---
    const updateDoctorMessage = (customMessage = null) => {
        const message = customMessage || grimTidings[Math.floor(Math.random() * grimTidings.length)];
        
        // Simple fade out/in effect
        doctorWarning.style.opacity = 0;
        setTimeout(() => {
            doctorWarning.textContent = `"${message}"`;
            doctorWarning.style.opacity = 1;
        }, 500);
    };

    // Auto-cycle messages every 8 seconds
    setInterval(() => {
        // Only cycle if a location isn't currently being "focused" (simple logic)
        updateDoctorMessage();
    }, 8000);

    // --- 4. The Cartographer's Link (Map Interaction) ---
    mapNodes.forEach(node => {
        node.addEventListener('click', () => {
            const location = node.getAttribute('data-location');
            const warning = locationWarnings[location];
            
            // Update doctor with location-specific info
            updateDoctorMessage(warning);

            // Visual feedback on the node
            node.style.transform = 'scale(2)';
            setTimeout(() => node.style.transform = 'scale(1)', 300);
        });
    });

    // --- 5. Atmospheric Particle System (Canvas Dust) ---
    const setupParticles = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '50';
        document.body.appendChild(canvas);

        let width, height, particles;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = `rgba(200, 180, 150, ${this.opacity})`;
                // Draw a tiny pixel-like square
                ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
            }
        }

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = 60; // Number of dust motes
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();
    };

    // Initialize all systems
    setupParticles();
    updateDoctorMessage(); // Initial message
});
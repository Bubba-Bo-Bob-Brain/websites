/**
 * THE OSSUARY - Corruption Engine
 * Animates the decay and brings the dying world to life.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAshSystem();
    initMiseryFluctuation();
    initGlitchEngine();
    initParallax();
});

/* --- 1. ASH PARTICLE SYSTEM --- */
function initAshSystem() {
    const container = document.getElementById('ash-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width, height;
    let particles = [];
    const particleCount = 100;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class AshParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height; // Start above screen
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5;
            this.wobble = Math.random() * 100;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 50 + this.wobble) * 0.5;

            if (this.y > height) {
                this.reset();
                this.y = -10;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(20, 20, 20, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new AshParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/* --- 2. MISERY FLUCTUATION --- */
function initMiseryFluctuation() {
    const fill = document.getElementById('misery-fill');
    const text = document.getElementById('misery-percent');
    
    setInterval(() => {
        // Fluctuate between 85% and 92%
        const fluctuation = Math.floor(Math.random() * (92 - 85 + 1) + 85);
        fill.style.width = `${fluctuation}%`;
        text.textContent = `${fluctuation}%`;
    }, 3000);
}

/* --- 3. GLITCH ENGINE --- */
function initGlitchEngine() {
    const elements = document.querySelectorAll('.glitch-text, .module, .entry-title, .artifact-card');
    
    setInterval(() => {
        // Chance to trigger a glitch (10% every 4 seconds)
        if (Math.random() > 0.9) {
            const target = elements[Math.floor(Math.random() * elements.length)];
            triggerVisualGlitch(target);
        }
    }, 4000);

    function triggerVisualGlitch(el) {
        const originalTransform = el.style.transform;
        const originalFilter = el.style.filter;

        // Rapid jitter
        el.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 2 - 1}deg)`;
        el.style.filter = `invert(1) hue-rotate(${Math.random() * 360}deg) brightness(2)`;
        
        // Duration of the glitch
        setTimeout(() => {
            el.style.transform = originalTransform;
            el.style.filter = originalFilter;
        }, 150);
    }
}

/* --- 4. PARALLAX DEPTH --- */
function initParallax() {
    const container = document.getElementById('world-container');
    
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        // Apply a very subtle tilt to the whole container
        container.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
}
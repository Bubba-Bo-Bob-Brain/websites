/**
 * THE CELESTIAL SOUQ OF AL-QAMAR - Interactive Scripts
 * Implements: Lantern Lighting, Incense Smoke Particles, and Portal Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initLantern();
    initSmoke();
    initNavigation();
    initRubEffect();
});

/**
 * Lantern Engine: Creates a warm glow that follows the cursor
 */
function initLantern() {
    const lantern = document.getElementById('lantern');
    
    window.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smooth 60fps movement
        requestAnimationFrame(() => {
            lantern.style.left = `${e.clientX}px`;
            lantern.style.top = `${e.clientY}px`;
        });
    });

    // Subtle pulse effect for the lantern
    let scale = 1;
    let growing = true;
    
    function pulse() {
        if (growing) {
            scale += 0.002;
            if (scale > 1.1) growing = false;
        } else {
            scale -= 0.002;
            if (scale < 0.9) growing = true;
        }
        lantern.style.transform = `translate(-50%, -50%) scale(${scale})`;
        requestAnimationFrame(pulse);
    }
    pulse();
}

/**
 * Incense Smoke System: Canvas-based particle animation
 */
function initSmoke() {
    const container = document.getElementById('smoke-canvas');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let particles = [];
    const particleCount = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 40 + 20;
            this.speedY = Math.random() * -1 - 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.3;
            this.drift = Math.random() * 2;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y / 50) * 0.5 + this.speedX;
            this.opacity -= 0.001;

            if (this.y < -this.size || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `rgba(200, 200, 255, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/**
 * Portal Navigation: Smooth section switching
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.product-grid');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-section');

            // Update active state of nav
            navLinks.forEach(l => l.style.color = 'var(--gold-muted)');
            link.style.color = 'var(--gold-bright)';

            // Transition sections
            sections.forEach(section => {
                section.style.opacity = '0';
                setTimeout(() => {
                    if (section.id === targetId) {
                        section.classList.remove('hidden');
                        section.style.opacity = '1';
                    } else {
                        section.classList.add('hidden');
                    }
                }, 400);
            });
        });
    });
}

/**
 * Rub Effect: Interactive reveal for product cards
 */
function initRubEffect() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const overlay = card.querySelector('.magic-rub-overlay');
        
        // We use a mousemove listener to simulate the "rubbing" 
        // by calculating movement distance
        let lastX, lastY;
        let rubProgress = 0;

        card.addEventListener('mousemove', (e) => {
            if (!lastX || !lastY) {
                lastX = e.clientX;
                lastY = e.clientY;
                return;
            }

            const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
            rubProgress += dist * 0.01;

            if (rubProgress > 20) {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }

            lastX = e.clientX;
            lastY = e.clientY;
        });

        // Reset the magic smoke when the mouse leaves the card
        card.addEventListener('mouseleave', () => {
            rubProgress = 0;
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';
        });
    });
}
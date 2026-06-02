/**
 * THE ENCHANTED BAZAAR - CORE ENGINE
 * A sensory experience of light, smoke, and magic.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmokeEngine();
    initLanternGlow();
    initScrollAnimations();
    initParallaxEffect();
});

/* --- 1. INCENSE & STARDUST ENGINE (Canvas Particles) --- */
function initSmokeEngine() {
    const canvas = document.getElementById('smoke-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // Resize handler
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
            this.y = Math.random() * canvas.height + canvas.height; // Start below screen
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5 - 0.1; // Float upwards
            this.life = Math.random() * 0.5 + 0.5; // Opacity/life
            this.decay = Math.random() * 0.002 + 0.001;
            this.color = Math.random() > 0.5 ? '#d4af37' : '#ffbf00'; // Gold or Amber
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;

            if (this.life <= 0 || this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life * 0.5;
            ctx.fill();
        }
    }

    // Create particle pool
    const particleCount = 120;
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

/* --- 2. THE LIVING LANTERN (Cursor Tracking) --- */
function initLanternGlow() {
    const glow = document.getElementById('lantern-glow');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Update the radial gradient position
        // We use a slightly larger radius for a softer, more natural light falloff
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 191, 0, 0.15) 0%, transparent 35%)`;
    });
}

/* --- 3. THE WEAVER'S REVEAL (Scroll Animations) --- */
function initScrollAnimations() {
    // Intersection Observer for staggering card entrances
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on index to create a "wave" effect
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index % 3 * 150); 
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target all stall cards and the hero content
    const animatedElements = document.querySelectorAll('.stall-card, .hero-content, .brand');
    animatedElements.forEach(el => {
        // We inject initial styles via JS to keep CSS clean, 
        // or we could have done this in CSS.
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });

    // Re-define the visible state behavior
    // Since we can't modify the CSS file from here, we handle the class transition via logic
    // But actually, we'll just apply the styles directly to the class in this script
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .is-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
}

/* --- 4. DEPTH & PARALLAX (Visual Immersion) --- */
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const images = document.querySelectorAll('.product-img');

        images.forEach(img => {
            // Calculate a subtle movement based on scroll position
            // The image moves slightly slower than the container, creating depth
            const parent = img.parentElement;
            const rect = parent.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.05;
                const yPos = -(rect.top * speed);
                img.style.transform = `scale(1.1) translateY(${yPos}px)`;
            }
        });
    });
}
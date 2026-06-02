/**
 * L'Éclat Doré - Interaction & Atmosphere Engine
 * Focus: Opulence, Motion, and Immersive Detail
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initChampagneBubbles();
    initSunburst();
    initScrollAnimations();
    initParallax();
});

/**
 * 1. Custom Luxury Cursor
 * Creates a sophisticated dual-ring cursor that reacts to interactables.
 */
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows mouse instantly
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;
        dot.style.transform = 'translate(-50%, -50%)';

        // Outline follows with a slight delay for "fluidity"
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
        outline.style.transform = 'translate(-50%, -50%)';
    });

    // Interaction logic: Expand cursor on links/buttons
    const interactables = document.querySelectorAll('a, .nav-link, .ad-button, .index-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '60px';
            outline.style.height = '60px';
            outline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            outline.style.borderColor = '#f9e498';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.width = '30px';
            outline.style.height = '30px';
            outline.style.backgroundColor = 'transparent';
            outline.style.borderColor = 'var(--color-gold)';
        });
    });
}

/**
 * 2. Champagne Bubble Particle System
 * A canvas-based animation that simulates rising bubbles.
 */
function initChampagneBubbles() {
    const canvas = document.getElementById('champagne-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

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
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5;
            this.swing = Math.random() * 2;
        }

        update() {
            this.y -= this.speed;
            this.x += Math.sin(this.y / 30) * 0.5;
            if (this.y < -10) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(247, 231, 206, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize bubble pool
    for (let i = 0; i < 60; i++) {
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
 * 3. Dynamic Sunburst Generation
 * Procedurally creates the gold rays and animates them on scroll.
 */
function initSunburst() {
    const container = document.querySelector('.sunburst-container');
    const rayCount = 24;
    
    // Create rays programmatically for perfect symmetry
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.className = 'sunburst-ray';
        ray.style.transform = `rotate(${ (360 / rayCount) * i }deg)`;
        container.appendChild(ray);
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rays = document.querySelectorAll('.sunburst-ray');
        
        // Rotate the sunburst slowly as we scroll
        container.style.transform = `rotate(${scrolled * 0.05}deg)`;
        
        // Fade out rays as we enter the magazine grid
        const opacity = 1 - (scrolled / 700);
        rays.forEach(ray => {
            ray.style.opacity = Math.max(0, opacity * 0.4);
        });
    });
}

/**
 * 4. Scroll Animations (Intersection Observer)
 * Staggered reveal of the editorial content.
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target the columns for a staggered reveal
    const columns = document.querySelectorAll('.column');
    columns.forEach((col, index) => {
        col.style.opacity = '0';
        col.style.transform = 'translateY(50px)';
        col.style.transition = `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.2}s`;
        observer.observe(col);
    });
}

/**
 * 5. Parallax Hero Effect
 * Adds depth to the hero text.
 */
function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        // Move text slower than the scroll speed to create depth
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
    });
}
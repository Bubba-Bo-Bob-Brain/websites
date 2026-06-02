/**
 * THE GILDED GAZETTE - INTERACTIVE ENGINE
 * Bringing the Roaring Twenties to life through motion and depth.
 */

document.addEventListener('DOMContentLoaded', () => {
    initChampagneBubbles();
    initScrollReveal();
    initParallax();
});

/* --- 1. Champagne Bubble Particle System --- */
function initChampagneBubbles() {
    const canvas = document.getElementById('bubble-canvas');
    const ctx = canvas.getContext('2d');
    let bubbles = [];

    // Set canvas size to window size
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Bubble {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100; // Start below screen
            this.radius = Math.random() * 3 + 0.5;
            this.speedY = Math.random() * 0.5 + 0.2; // Slow, elegant ascent
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.oscillation = Math.random() * 0.02;
            this.oscillationStep = 0;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.oscillationStep) * 0.5;
            this.oscillationStep += this.oscillation;

            // If bubble goes off top, reset to bottom
            if (this.y < -10) {
                this.init();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create bubble pool
    const bubbleCount = 80;
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --- 2. Scroll Reveal Engine --- */
function initScrollReveal() {
    /**
     * Uses Intersection Observer to add an 'is-visible' class to elements.
     * This allows us to trigger CSS transitions for a sophisticated "unfolding" effect.
     */
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    // Targets for reveal: Articles, sections, and sidebar ads
    const targets = document.querySelectorAll(
        'article, section, .ad-container, .section-divider, .editorial-grid'
    );

    // Pre-prepare elements in CSS via a dynamic injection if not already in styles.css
    // (Note: In a real production environment, these would be in the main styles.css)
    injectRevealStyles();

    targets.forEach(target => {
        observer.observe(target);
    });
}

function injectRevealStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Initial State for Reveal */
        article, section, .ad-container, .section-divider, .editorial-grid {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1), 
                        transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }

        /* Visible State */
        .reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* --- 3. Subtle Parallax Engine --- */
function initParallax() {
    const sunburst = document.querySelector('.sunburst');
    const mastheadTitle = document.querySelector('.magazine-title');
    const heroImg = document.querySelector('.article-image-wrapper img');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Parallax for the background sunburst (slow movement)
        if (sunburst) {
            sunburst.style.transform = `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.01}deg)`;
        }

        // Parallax for the main title (slightly faster for depth)
        if (mastheadTitle) {
            mastheadTitle.style.transform = `translateY(${scrollY * 0.5}px)`;
            mastheadTitle.style.opacity = 1 - (scrollY / 700);
        }

        // Parallax for hero image (creates a 3D window effect)
        if (heroImg) {
            const imgRect = heroImg.getBoundingClientRect();
            // Only parallax when the image is near the viewport
            if (imgRect.top < window.innerHeight && imgRect.bottom > 0) {
                const relativeScroll = (window.innerHeight - imgRect.top) / window.innerHeight;
                heroImg.style.transform = `scale(1.05) translateY(${relativeScroll * 30}px)`;
            }
        }
    });
}
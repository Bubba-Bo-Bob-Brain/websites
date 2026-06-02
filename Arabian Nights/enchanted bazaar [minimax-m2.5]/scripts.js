/* ========================================
SOUK AL-HASHEEN - Enchanted Bazaar JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    initLanternCursor();
    initSmokeParticles();
    initRubToReveal();
    initScrollAnimations();
    initSmoothScroll();
    initProductCards();
    initNavigationEffects();
});

/* ========================================
LANTERN CURSOR EFFECT
======================================== */
function initLanternCursor() {
    const lantern = document.getElementById('lanternGlow');
    let mouseX = 0;
    let mouseY = 0;
    let lanternX = 0;
    let lanternY = 0;
    let isVisible = false;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            lantern.style.opacity = '1';
        }
    });

    // Smooth lantern follow
    document.addEventListener('mousemove', () => {
        requestAnimationFrame(() => {
            // Smooth interpolation for fluid movement
            lanternX += (mouseX - lanternX) * 0.1;
            lanternY += (mouseY - lanternY) * 0.1;
            lantern.style.left = lanternX + 'px';
            lantern.style.top = lanternY + 'px';
        });
    });

    // Hide lantern when leaving window
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        lantern.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        lantern.style.opacity = '1';
    });
}

/* ========================================
INCENSE SMOKE PARTICLES
======================================== */
function initSmokeParticles() {
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class SmokeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            // Start from bottom-center area (simulating incense burners)
            this.x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 15 + 5;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
            this.hue = Math.random() * 30 + 20; // Warm amber tones
        }

        update() {
            this.life++;
            // Wobble movement
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.y -= this.speedY;

            // Fade out as particle rises
            this.opacity = Math.max(0, (1 - this.life / this.maxLife) * 0.15);

            // Grow slightly as it rises
            this.size += 0.02;

            // Reset if dead or off screen
            if (this.life > this.maxLife || this.y < -50) {
                this.reset();
            }
        }

        draw() {
            // Create soft, ethereal smoke particles
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `hsla(${this.hue}, 60%, 70%, ${this.opacity})`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, 50%, 60%, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 40%, 50%, 0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000));
        for (let i = 0; i < particleCount; i++) {
            const particle = new SmokeParticle();
            // Stagger initial positions
            particle.y = Math.random() * canvas.height;
            particles.push(particle);
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Semi-transparent overlay for trail effect
        ctx.fillStyle = 'rgba(13, 10, 6, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* ========================================
RUB TO REVEAL MAGIC LAMPS
======================================== */
function initRubToReveal() {
    const magicLamps = document.querySelectorAll('.magic-lamp');

    magicLamps.forEach(lamp => {
        let rubCount = 0;
        const requiredRubs = 8;
        let isRevealed = lamp.getAttribute('data-rubbed') === 'true';

        const rubHandler = (e) => {
            e.preventDefault();
            if (isRevealed) return;

            rubCount++;

            // Visual feedback - shake the lamp
            lamp.style.transform = `scale(1.15) rotate(${Math.random() * 20 - 10}deg)`;
            setTimeout(() => {
                lamp.style.transform = 'scale(1) rotate(0deg)';
            }, 100);

            // Check if enough rubs
            if (rubCount >= requiredRubs) {
                isRevealed = true;
                lamp.setAttribute('data-rubbed', 'true');
                // Create reveal effect
                createRevealEffect(lamp);
            }
        };

        // Mouse events
        lamp.addEventListener('mousedown', rubHandler);
        lamp.addEventListener('mousemove', (e) => {
            if (e.buttons === 1 && !isRevealed) {
                rubHandler(e);
            }
        });

        // Touch events for mobile
        lamp.addEventListener('touchstart', rubHandler);
        lamp.addEventListener('touchmove', (e) => {
            if (!isRevealed) {
                rubHandler(e);
            }
        });
    });

    // Create magical reveal effect
    function createRevealEffect(lamp) {
        // Add sparkle particles
        const rect = lamp.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createSparkle(centerX, centerY);
            }, i * 50);
        }
    }

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x + (Math.random() - 0.5) * 60}px;
            top: ${y + (Math.random() - 0.5) * 60}px;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: sparkleAnim 1s ease-out forwards;
            box-shadow: 0 0 10px #ffd700;
        `;
        document.body.appendChild(sparkle);

        // Add sparkle animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleAnim {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            sparkle.remove();
            style.remove();
        }, 1000);
    }
}

/* ========================================
SCROLL ANIMATIONS
======================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.product-card, .section-header, .about-content');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Parallax effect for floating elements
    const floatingStars = document.querySelectorAll('.floating-star, .floating-magic');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        floatingStars.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/* ========================================
SMOOTH SCROLLING
======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hero CTA button
    const ctaButton = document.querySelector('.cta-enter');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const firstSection = document.querySelector('.product-section');
            if (firstSection) {
                firstSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

/* ========================================
PRODUCT CARD INTERACTIONS
======================================== */
function initProductCards() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });

        // Acquire button interaction
        const acquireBtn = card.querySelector('.btn-acquire');
        if (acquireBtn) {
            acquireBtn.addEventListener('click', () => {
                createPurchaseEffect(acquireBtn);
            });
        }
    });

    function createPurchaseEffect(btn) {
        // Store original text
        const originalText = btn.textContent;
        btn.textContent = '✨ Acquired!';
        btn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }
}

/* ========================================
NAVIGATION EFFECTS
======================================== */
function initNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-arch');

    // Active link based on scroll position
    const sections = document.querySelectorAll('.product-section, .about-section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Add hover effect to nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
}

/* ========================================
ADDITIONAL VISUAL ENHANCEMENTS
======================================== */

// Add grain overlay effect (subtle)
function addGrainOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
        opacity: 0.03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    `;
    document.body.appendChild(overlay);
}
addGrainOverlay();

// Initialize time-based greeting in footer
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
    // Could update footer with time-based message if needed
    return greeting;
}
updateGreeting();
setInterval(updateGreeting, 60000);

/* ========================================
PERFORMANCE OPTIMIZATIONS
======================================== */

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        // Scroll-based updates go here
    });
});

// Lazy load images if any are added
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}
lazyLoadImages();

/* ========================================
ACCESSIBILITY ENHANCEMENTS
======================================== */

// Keyboard navigation for magic lamps
document.querySelectorAll('.magic-lamp').forEach(lamp => {
    lamp.setAttribute('tabindex', '0');
    lamp.setAttribute('role', 'button');
    lamp.setAttribute('aria-label', 'Magic lamp - click or press Enter to rub');

    lamp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Simulate rub effect
            lamp.dispatchEvent(new Event('mousedown'));
        }
    });
});

// Focus visible styles for navigation
document.querySelectorAll('.nav-arch').forEach(link => {
    link.addEventListener('focus', () => {
        link.style.outline = '2px solid var(--color-gold-primary)';
        link.style.outlineOffset = '4px';
    });
    link.addEventListener('blur', () => {
        link.style.outline = '';
        link.style.outlineOffset = '';
    });
});

/* ========================================
CONSOLE EASTER EGG
======================================== */
console.log('%c🏺 Welcome to Souk al-Hasheen %cThe Enchanted Bazaar %c✨ Where wonders await', 'font-size: 16px; color: #d4a853;', 'font-size: 12px; color: #c9b896;', 'font-size: 10px; color: #8a7a5a;');
console.log('%c🧞 Have you found the magic lamp yet?', 'color: #f4a825;');
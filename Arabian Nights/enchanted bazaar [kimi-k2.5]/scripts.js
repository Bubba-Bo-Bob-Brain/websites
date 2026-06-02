/**
 * THE BAZAAR OF WONDERS - JavaScript
 * Interactive enchantments for the marketplace
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all magical effects
    initSmokeCanvas();
    initLanternCursor();
    initRubToReveal();
    initScrollEffects();
    initParallaxFloat();
});

/* ==========================================
   INCENSE SMOKE PARTICLE SYSTEM
   ========================================== */
function initSmokeCanvas() {
    const canvas = document.getElementById('incense-smoke');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Resize canvas to window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Smoke particle class
    class SmokeParticle {
        constructor() {
            this.reset();
            // Start at random height to pre-fill
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = Math.random() * 60 + 20;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.fade = Math.random() * 0.002 + 0.001;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
            this.wobble += this.wobbleSpeed;
            this.opacity -= this.fade;
            this.size += 0.1;
            
            if (this.opacity <= 0 || this.y < -100) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Create gradient for soft smoke look
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
            gradient.addColorStop(0.4, 'rgba(255, 140, 0, 0.1)');
            gradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize particles
    function createParticles() {
        const particleCount = Math.min(25, Math.floor(canvas.width / 60));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new SmokeParticle());
        }
    }
    createParticles();
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        animate();
    }
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else if (!prefersReducedMotion) {
            animate();
        }
    });
}

/* ==========================================
   LANTERN CURSOR FOLLOWER
   ========================================== */
function initLanternCursor() {
    const lantern = document.getElementById('lantern-cursor');
    if (!lantern) return;
    
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
        lantern.style.display = 'none';
        return;
    }
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lanternX = mouseX;
    let lanternY = mouseY;
    let rafId;
    let isMoving = false;
    let moveTimeout;
    
    // Smooth follow with easing
    function updateLanternPosition() {
        const dx = mouseX - lanternX;
        const dy = mouseY - lanternY;
        
        // Easing factor (0.08 = very smooth, laggy; 0.2 = responsive)
        lanternX += dx * 0.12;
        lanternY += dy * 0.12;
        
        lantern.style.left = `${lanternX}px`;
        lantern.style.top = `${lanternY}px`;
        
        // Fade when not moving
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            isMoving = false;
        } else {
            isMoving = true;
            lantern.style.opacity = '1';
        }
        
        rafId = requestAnimationFrame(updateLanternPosition);
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        clearTimeout(moveTimeout);
        lantern.style.opacity = '1';
        
        moveTimeout = setTimeout(() => {
            lantern.style.opacity = '0.5';
        }, 2000);
    }, { passive: true });
    
    // Start animation
    updateLanternPosition();
    
    // Cleanup
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            updateLanternPosition();
        }
    });
}

/* ==========================================
   RUB TO REVEAL INTERACTION
   ========================================== */
function initRubToReveal() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const rubZone = card.querySelector('.rub-interaction-zone');
        const rubButton = card.querySelector('.rub-button');
        
        if (!rubZone || !rubButton) return;
        
        let rubCount = 0;
        let lastRubTime = 0;
        const rubThreshold = 3; // Number of interactions needed
        const rubTimeout = 1500; // Time window for consecutive rubs
        
        function handleRub(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const now = Date.now();
            
            // Reset if too much time passed
            if (now - lastRubTime > rubTimeout) {
                rubCount = 0;
            }
            
            lastRubTime = now;
            rubCount++;
            
            // Visual feedback
            createRubRipple(e, rubZone);
            rubButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                rubButton.style.transform = 'scale(1)';
            }, 100);
            
            // Reveal on threshold reached
            if (rubCount >= rubThreshold) {
                revealCard(card);
            } else {
                // Update button text temporarily
                const originalText = rubButton.querySelector('.rub-text').textContent;
                const remaining = rubThreshold - rubCount;
                rubButton.querySelector('.rub-text').textContent = 
                    remaining === 1 ? 'Once more...' : `${remaining} more...`;
                
                setTimeout(() => {
                    rubButton.querySelector('.rub-text').textContent = originalText;
                }, 800);
            }
        }
        
        // Support both click and touch
        rubButton.addEventListener('click', handleRub);
        rubButton.addEventListener('touchstart', handleRub, { passive: false });
        
        // Add subtle hover effect to hint interactivity
        rubZone.addEventListener('mouseenter', () => {
            if (!card.classList.contains('revealed')) {
                rubButton.style.borderColor = 'var(--lantern-gold)';
            }
        });
        
        rubZone.addEventListener('mouseleave', () => {
            rubButton.style.borderColor = '';
        });
    });
    
    function createRubRipple(e, container) {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,215,0,0.6), transparent);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple-expand 0.6s ease-out forwards;
            z-index: 20;
        `;
        
        container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Add ripple animation to styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-expand {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    function revealCard(card) {
        if (card.classList.contains('revealed')) return;
        
        card.classList.add('revealed');
        
        // Play subtle sound effect (optional, using AudioContext for future extension)
        // For now, just visual feedback
        const smoke = card.querySelector('.smoke-effect');
        if (smoke) {
            smoke.style.opacity = '1';
            setTimeout(() => {
                smoke.style.opacity = '0';
            }, 1000);
        }
        
        // Add magical sparkle effect around card
        createSparkles(card);
    }
    
    function createSparkles(card) {
        const rect = card.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width * Math.random()}px;
                    top: ${rect.top + rect.height * Math.random()}px;
                    width: 4px;
                    height: 4px;
                    background: var(--lantern-gold);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    box-shadow: 0 0 10px var(--lantern-gold);
                `;
                document.body.appendChild(sparkle);
                
                // Animate up and fade
                sparkle.animate([
                    { transform: 'translateY(0) scale(1)', opacity: 1 },
                    { transform: 'translateY(-50px) scale(0)', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => sparkle.remove();
            }, i * 100);
        }
    }
}

/* ==========================================
   SCROLL EFFECTS & NAVIGATION
   ========================================== */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.market-section');
    
    // Navbar scroll effect
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Intersection Observer for section reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Stagger animate child elements
                const cards = entry.target.querySelectorAll('.product-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        // Set initial state for animation
        const cards = section.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        sectionObserver.observe(section);
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ==========================================
   PARALLAX FLOATING ELEMENTS
   ========================================== */
function initParallaxFloat() {
    const floatElements = document.querySelectorAll('.carpet-display, .bottle-visual, .lamp-visual');
    
    // Only on non-touch devices for performance
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    let ticking = false;
    
    function updateFloat() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.03;
        
        floatElements.forEach((el, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            el.style.transform = `translateY(${rate * direction}px)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateFloat);
            ticking = true;
        }
    }, { passive: true });
    
    // Ambient floating for hero elements
    const heroElements = document.querySelectorAll('.corner-ornament');
    heroElements.forEach((el, i) => {
        el.style.animation = `float-ambient ${8 + i * 2}s ease-in-out infinite`;
        el.style.animationDelay = `${i * 0.5}s`;
    });
    
    // Add keyframes for ambient float
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-ambient {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

// Debounce utility for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Random number generator with seed (for consistent "random" patterns)
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Handle resize events efficiently
const handleResize = debounce(() => {
    // Trigger any necessary resize updates
    document.dispatchEvent(new CustomEvent('bazaar:resize'));
}, 250);

window.addEventListener('resize', handleResize);

/* ==========================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================== */

// Respect reduced motion preferences
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
motionQuery.addEventListener('change', (e) => {
    if (e.matches) {
        // Disable complex animations
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
});

// Initialize reduced motion state
if (motionQuery.matches) {
    document.body.classList.add('reduced-motion');
}

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open reveals
        document.querySelectorAll('.product-card.revealed').forEach(card => {
            card.classList.remove('revealed');
        });
    }
});

// Preload critical assets
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
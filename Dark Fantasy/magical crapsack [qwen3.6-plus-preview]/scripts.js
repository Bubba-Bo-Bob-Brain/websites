/**
 * THE WITHERING REALMS — INTERACTION SCRIPT
 * Features:
 * - Atmospheric Ash & Ember Particle System (Canvas)
 * - Scroll-triggered Reveal Animations (IntersectionObserver)
 * - Interactive Suffering Meters & SVG Gauge
 * - Navigation Behavior & Mobile Menu
 * - Subtle Mouse Parallax for Hero Section
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollAnimations();
    initNavigation();
    initParallax();
});

/* =========================================
   1. ASH & EMBER PARTICLE SYSTEM
   ========================================= */
function initParticles() {
    const canvas = document.getElementById('ash-canvas');
    const ctx = canvas.getContext('2d');
    
    // Responsive canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 70;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.6 + 0.1; // Upward float
            this.speedX = Math.random() * 0.4 - 0.2; // Drift
            this.opacity = Math.random() * 0.5 + 0.1;
            // Most are ash (grey), some are embers (orange)
            this.isEmber = Math.random() > 0.85; 
            this.color = this.isEmber ? '#b8651a' : '#5c5448';
            this.flickerSpeed = Math.random() * 0.05;
            this.flickerOffset = Math.random() * 100;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.15; // Sine wave drift

            // Reset if off-screen
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }

        draw(time) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            // Flicker effect for embers
            let currentOpacity = this.opacity;
            if (this.isEmber) {
                currentOpacity = this.opacity + Math.sin(time * this.flickerSpeed + this.flickerOffset) * 0.2;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff6600';
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));
            ctx.fill();
            ctx.globalAlpha = 1; // Reset
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(time);
        });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* =========================================
   2. SCROLL REVEAL & METERS
   ========================================= */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const gaugeArc = document.querySelector('.gauge-arc');
    const gaugeTexts = document.querySelectorAll('.gauge-value-text, .gauge-label-text');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate meters inside the revealed element
                const meterFills = entry.target.querySelectorAll('.meter-fill');
                meterFills.forEach(fill => {
                    const value = fill.dataset.value;
                    if (value) {
                        // Delay slightly for stagger effect if multiple
                        setTimeout(() => {
                            fill.style.width = `${value}%`;
                        }, 200);
                    }
                });

                // Animate stat bars
                const statFills = entry.target.querySelectorAll('.stat-fill');
                statFills.forEach(fill => {
                    // CSS variable handling
                    const width = getComputedStyle(fill).getPropertyValue('--fill-width');
                    fill.style.width = width;
                });

                // We unobserve after revealing to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // Specific handler for the Overall Suffering Gauge
    if (gaugeArc) {
        const gaugeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = entry.target.dataset.gaugeValue;
                    // Arc length calculation for r=80, ~135 degrees
                    // Circumference = 2 * PI * 80 = 502.4
                    // 135/360 * 502.4 = ~188.5
                    // Let's rely on pathLength or precise calculation.
                    // The SVG path length is roughly 251 for the semi-circle approximation used.
                    // We use 251.2 as the total length based on the path definition.
                    const totalLength = 251.2;
                    const offset = totalLength - (totalLength * (value / 100));
                    
                    entry.target.style.strokeDashoffset = offset;
                    
                    // Fade in text
                    gaugeTexts.forEach(t => t.style.opacity = '1');
                    
                    gaugeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        
        gaugeObserver.observe(gaugeArc);
    }
}

/* =========================================
   3. NAVIGATION
   ========================================= */
function initNavigation() {
    const nav = document.getElementById('navbar');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const heroSection = document.getElementById('hero');

    // Scroll behavior for navbar background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
            const isExpanded = links.classList.contains('active');
            toggle.setAttribute('aria-expanded', isExpanded);
            
            // Animate hamburger lines
            const lines = toggle.querySelectorAll('.hamburger-line');
            if (isExpanded) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (links.classList.contains('active')) {
                links.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                const lines = toggle.querySelectorAll('.hamburger-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    });
}

/* =========================================
   4. PARALLAX EFFECTS
   ========================================= */
function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    const heroEmbers = document.querySelectorAll('.ember-glow');
    const runes = document.querySelector('.hero-runes');

    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse position from -1 to 1
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Subtle movement for hero text
        if (heroContent) {
            heroContent.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
        }

        // Opposite movement for background glows (depth effect)
        heroEmbers.forEach((ember, index) => {
            const speed = (index + 1) * 15;
            ember.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
        
        // Subtle rune movement
        if (runes) {
            runes.style.transform = `translate(${x * 20}px, 0)`;
        }
    });
}
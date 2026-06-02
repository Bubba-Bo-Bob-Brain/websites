/* ============================================================
   TEATRO AURELIA — Baroque Opera House Scripts
   Bringing the grand theatre to life with dramatic flourishes
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== CURTAIN REVEAL SYSTEM ====================
    const curtainOverlay = document.getElementById('curtain-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');
    const chandelierContainer = document.getElementById('chandelier-container');

    // Curtain reveal animation
    function openCurtains() {
        curtainOverlay.classList.add('open');
        
        // After curtains fully open, hide overlay and show content
        setTimeout(() => {
            mainContent.classList.add('visible');
            chandelierContainer.classList.add('visible');
            
            // Initialize scroll animations after content is visible
            initScrollAnimations();
        }, 1800);
        
        // Remove curtain overlay from DOM after animation
        setTimeout(() => {
            curtainOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 2800);
    }

    // Enter button click handler
    enterBtn.addEventListener('click', openCurtains);

    // Prevent scrolling while curtain is showing
    document.body.style.overflow = 'hidden';

    // ==================== CHANDELIER LIGHT EFFECTS ====================
    const lightGobo = document.querySelector('.light-gobo');
    const lightRays = document.querySelectorAll('.light-ray');
    const crystals = document.querySelectorAll('.crystal-dangle');
    const flames = document.querySelectorAll('.candle-flame');

    // Animate gobo pattern with mouse movement
    let goboX = 0;
    let goboY = 0;
    let targetGoboX = 0;
    let targetGoboY = 0;

    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        targetGoboX = (e.clientX - centerX) / centerX * 20;
        targetGoboY = (e.clientY - centerY) / centerY * 15;
    });

    function animateGobo() {
        goboX += (targetGoboX - goboX) * 0.02;
        goboY += (targetGoboY - goboY) * 0.02;
        
        if (lightGobo) {
            lightGobo.style.transform = `translate(${goboX}px, ${goboY}px)`;
        }
        
        // Subtle movement for light rays
        lightRays.forEach((ray, index) => {
            const offset = Math.sin(Date.now() * 0.001 + index) * 5;
            ray.style.transform = `${ray.style.transform.split('translate')[0]} translateX(${offset}px)`;
        });
        
        requestAnimationFrame(animateGobo);
    }
    
    animateGobo();

    // Enhanced candle flame animation
    flames.forEach((flame, index) => {
        setInterval(() => {
            const scale = 0.8 + Math.random() * 0.4;
            const rotate = (Math.random() - 0.5) * 10;
            const opacity = 0.7 + Math.random() * 0.3;
            
            flame.style.transform = `translateX(-50%) scale(${scale}) rotate(${rotate}deg)`;
            flame.style.opacity = opacity;
        }, 100 + index * 50);
    });

    // Crystal shimmer effect
    crystals.forEach((crystal, index) => {
        setInterval(() => {
            const shimmer = Math.random() > 0.7;
            if (shimmer) {
                crystal.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    crystal.style.filter = 'brightness(1)';
                }, 200);
            }
        }, 500 + index * 200);
    });

    // ==================== NAVIGATION SYSTEM ====================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header');

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.theatre-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation on scroll
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ==================== SEASON FILTER SYSTEM ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const performanceCards = document.querySelectorAll('.performance-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards with animation
            performanceCards.forEach((card, index) => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = `cardReveal 0.6s ease forwards ${index * 0.1}s`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==================== SCROLL ANIMATION SYSTEM ====================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.performance-card, .performer-card, .event-item, .section-header, .tier'
        );
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special handling for performer cards - trigger spotlight prep
                    if (entry.target.classList.contains('performer-card')) {
                        entry.target.style.opacity = '1';
                    }
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    // ==================== PERFORMER SPOTLIGHT EFFECT ====================
    const performerCards = document.querySelectorAll('.performer-card');

    performerCards.forEach(card => {
        const spotlight = card.querySelector('.performer-spotlight');
        const frame = card.querySelector('.performer-frame');
        
        card.addEventListener('mouseenter', () => {
            if (spotlight) {
                spotlight.style.opacity = '1';
            }
            if (frame) {
                frame.style.boxShadow = `
                    0 0 0 4px var(--crimson-deep),
                    0 0 0 8px var(--gold),
                    0 0 60px rgba(255, 248, 220, 0.4),
                    0 20px 50px rgba(0, 0, 0, 0.6)
                `;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (spotlight) {
                spotlight.style.opacity = '0';
            }
            if (frame) {
                frame.style.boxShadow = `
                    0 0 0 4px var(--crimson-deep),
                    0 0 0 8px var(--gold-dark),
                    0 10px 30px rgba(0, 0, 0, 0.5)
                `;
            }
        });
        
        // Dynamic spotlight following mouse
        card.addEventListener('mousemove', (e) => {
            if (!spotlight) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            spotlight.style.left = `${x - 100}px`;
        });
    });

    // ==================== SEATING CHART INTERACTIVITY ====================
    const tiers = document.querySelectorAll('.tier');
    const allSeats = document.querySelectorAll('.royal-seat, .box-seat, .gallery-seat, .orch-seat');

    // Tier hover effects
    tiers.forEach(tier => {
        tier.addEventListener('mouseenter', () => {
            tier.style.filter = 'brightness(1.2)';
        });
        
        tier.addEventListener('mouseleave', () => {
            tier.style.filter = 'brightness(1)';
        });
    });

    // Individual seat interactions
    allSeats.forEach(seat => {
        seat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) translateY(-3px)';
            this.style.zIndex = '10';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'seat-tooltip';
            tooltip.innerHTML = 'Click to Select';
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, var(--gold), var(--gold-dark));
                color: var(--crimson-deep);
                padding: 0.3rem 0.6rem;
                font-family: var(--font-heading);
                font-size: 0.7rem;
                letter-spacing: 0.1em;
                white-space: nowrap;
                border-radius: 3px;
                pointer-events: none;
                z-index: 100;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
        });
        
        seat.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
            
            const tooltip = this.querySelector('.seat-tooltip');
            if (tooltip) tooltip.remove();
        });
        
        seat.addEventListener('click', function() {
            // Toggle selection
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                this.style.background = 'linear-gradient(180deg, var(--gold-bright), var(--gold-light))';
                this.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8)';
                
                // Ripple effect
                createRipple(this);
            } else {
                this.style.background = '';
                this.style.boxShadow = '';
            }
        });
    });

    // Ripple effect for seat selection
    function createRipple(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background: rgba(212, 175, 55, 0.6);
            border-radius: 50%;
            animation: seatRipple 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Add ripple keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes seatRipple {
            0% {
                width: 10px;
                height: 10px;
                opacity: 1;
            }
            100% {
                width: 60px;
                height: 60px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ==================== PERFORMANCE CARD ENHANCEMENTS ====================
    performanceCards.forEach(card => {
        const btn = card.querySelector('.card-btn');
        
        // Button ripple effect
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                animation: btnRipple 0.6s ease-out forwards;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Show booking modal effect
            showBookingNotification(card.querySelector('.card-title').textContent);
        });
        
        // Parallax effect on card hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const frame = card.querySelector('.card-frame');
            if (frame) {
                frame.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const frame = card.querySelector('.card-frame');
            if (frame) {
                frame.style.transform = '';
            }
        });
    });

    // Button ripple keyframes
    const btnRippleStyle = document.createElement('style');
    btnRippleStyle.textContent = `
        @keyframes btnRipple {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(btnRippleStyle);

    // ==================== BOOKING NOTIFICATION ====================
    function showBookingNotification(performaceName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'booking-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✦</span>
                <div class="notification-text">
                    <span class="notification-title">Reservation Requested</span>
                    <span class="notification-subtitle">${performaceName}</span>
                </div>
                <span class="notification-icon">✦</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: linear-gradient(135deg, var(--gold), var(--gold-dark));
            border: 2px solid var(--gold-bright);
            padding: 1rem 2rem;
            z-index: 9000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.3);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .notification-icon {
                color: var(--crimson-deep);
                font-size: 1.2rem;
            }
            .notification-text {
                display: flex;
                flex-direction: column;
            }
            .notification-title {
                font-family: var(--font-heading);
                font-size: 0.9rem;
                color: var(--crimson-deep);
                letter-spacing: 0.1em;
                text-transform: uppercase;
            }
            .notification-subtitle {
                font-family: var(--font-display);
                font-size: 1.1rem;
                color: var(--crimson-deep);
            }
        `;
        document.head.appendChild(notificationStyle);
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // ==================== EVENT TIMELINE ANIMATIONS ====================
    const eventItems = document.querySelectorAll('.event-item');

    function animateTimeline() {
        eventItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;
            
            if (isVisible) {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }
        });
    }

    window.addEventListener('scroll', animateTimeline);

    // ==================== PARALLAX SCROLLING EFFECTS ====================
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    function handleParallax() {
        const scrollY = window.scrollY;
        
        if (heroContent && scrollY < window.innerHeight) {
            const parallaxSpeed = 0.4;
            heroContent.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
    }

    window.addEventListener('scroll', handleParallax);

    // ==================== GILDED FRAME GLOW EFFECT ====================
    const frames = document.querySelectorAll('.card-frame');

    frames.forEach(frame => {
        const card = frame.closest('.performance-card');
        
        if (card) {
            card.addEventListener('mouseenter', () => {
                frame.style.filter = 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))';
            });
            
            card.addEventListener('mouseleave', () => {
                frame.style.filter = '';
            });
        }
    });

    // ==================== DYNAMIC BACKGROUND PARTICLES ====================
    function createDustParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'dust-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
            overflow: hidden;
        `;
        document.body.appendChild(particleContainer);
        
        // Create floating dust particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 3}px;
                height: ${2 + Math.random() * 3}px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.4), transparent);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: dustFloat ${15 + Math.random() * 20}s linear infinite;
                animation-delay: ${-Math.random() * 20}s;
                opacity: ${0.2 + Math.random() * 0.3};
            `;
            particleContainer.appendChild(particle);
        }
        
        // Add dust animation keyframes
        const dustStyle = document.createElement('style');
        dustStyle.textContent = `
            @keyframes dustFloat {
                0% {
                    transform: translateY(100vh) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100px) translateX(${Math.random() > 0.5 ? '' : '-'}100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(dustStyle);
    }
    
    createDustParticles();

    // ==================== SCROLL INDICATOR HIDE ====================
    const scrollIndicator = document.querySelector('.scroll-indicator');

    function handleScrollIndicator() {
        if (scrollIndicator && window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
    }

    window.addEventListener('scroll', handleScrollIndicator);

    // ==================== KEYBOARD NAVIGATION ====================
    document.addEventListener('keydown', (e) => {
        // Enter to open curtains
        if (e.key === 'Enter' && !curtainOverlay.classList.contains('open')) {
            openCurtains();
        }
        
        // Escape to scroll to top
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Number keys for navigation
        const navMap = {
            '1': '#hero',
            '2': '#season',
            '3': '#performers',
            '4': '#seating',
            '5': '#events'
        };
        
        if (navMap[e.key]) {
            const target = document.querySelector(navMap[e.key]);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // ==================== PERFORMANCE ENHANCEMENT ====================
    // Throttle scroll events for better performance
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                handleParallax();
                animateTimeline();
                handleScrollIndicator();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Replace multiple scroll listeners with single throttled one
    window.removeEventListener('scroll', updateActiveNav);
    window.removeEventListener('scroll', handleParallax);
    window.removeEventListener('scroll', animateTimeline);
    window.removeEventListener('scroll', handleScrollIndicator);
    window.addEventListener('scroll', onScroll, { passive: true });

    // ==================== PRELOADER ANIMATION ====================
    // Subtle page load animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Initialize any remaining animations
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // ==================== CURSOR TRAIL EFFECT (Optional) ====================
    let cursorTrailEnabled = true;
    const trailElements = [];
    const maxTrailLength = 8;

    function createCursorTrail() {
        if (!cursorTrailEnabled) return;
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.6), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(trail);
        trailElements.push(trail);
        
        if (trailElements.length > maxTrailLength) {
            const oldTrail = trailElements.shift();
            oldTrail.remove();
        }
        
        return trail;
    }

    let trailIndex = 0;
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) { // Only create trail occasionally for performance
            const trail = createCursorTrail();
            if (trail) {
                trail.style.left = `${e.clientX}px`;
                trail.style.top = `${e.clientY}px`;
                trail.style.opacity = '0.6';
                
                setTimeout(() => {
                    trail.style.opacity = '0';
                }, 100);
                
                setTimeout(() => {
                    trail.remove();
                    const idx = trailElements.indexOf(trail);
                    if (idx > -1) trailElements.splice(idx, 1);
                }, 400);
            }
        }
    });

    // ==================== TOUCH DEVICE DETECTION ====================
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // Disable hover-dependent effects on touch devices
        document.querySelectorAll('.performer-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            });
            card.addEventListener('touchend', () => {
                setTimeout(() => card.classList.remove('touch-active'), 300);
            });
        });
    }

    // ==================== ACCESSIBILITY ENHANCEMENTS ====================
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
            document.documentElement.style.setProperty('--transition-medium', '0.01s');
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            
            // Disable cursor trail
            cursorTrailEnabled = false;
            
            // Simplify animations
            document.querySelectorAll('.crystal-dangle, .candle-flame, .curtain-tassel').forEach(el => {
                el.style.animation = 'none';
            });
        }
    }
    
    handleReducedMotion();
    prefersReducedMotion.addEventListener('change', handleReducedMotion);

    // ==================== FOCUS MANAGEMENT ====================
    // Ensure keyboard users can navigate properly
    document.querySelectorAll('button, a, [tabindex]').forEach(el => {
        el.addEventListener('focus', () => {
            el.style.outline = '2px solid var(--gold)';
            el.style.outlineOffset = '3px';
        });
        
        el.addEventListener('blur', () => {
            el.style.outline = '';
            el.style.outlineOffset = '';
        });
    });

    // ==================== INITIALIZATION COMPLETE ====================
    console.log('%c✦ Teatro Aurelia ✦', 
        'color: #d4af37; font-size: 24px; font-family: serif; text-shadow: 2px 2px 4px #4a0d0d;');
    console.log('%cWhere Art Ascends to the Divine', 
        'color: #c9a227; font-size: 14px; font-family: serif; font-style: italic;');
    console.log('%cEst. MDCLXXXVII', 
        'color: #8b1a1a; font-size: 12px; font-family: serif;');

});
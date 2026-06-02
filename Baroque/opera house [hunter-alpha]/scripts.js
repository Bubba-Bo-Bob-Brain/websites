/* ═══════════════════════════════════════════════════════════════
   LA GRANDE OPÉRA — BAROQUE OPERA HOUSE
   Interactive Theatre Experience
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ───── DOM ELEMENTS ─────
    const curtainOverlay = document.getElementById('curtain-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');
    const chandelierLight = document.getElementById('chandelier-light');
    const particlesCanvas = document.getElementById('particles-canvas');
    const performanceCards = document.querySelectorAll('.performance-card');
    const seats = document.querySelectorAll('.seat');
    const boxes = document.querySelectorAll('.box');
    const revealElements = document.querySelectorAll('.reveal');

    // ───── CURTAIN REVEAL ─────
    function initCurtainReveal() {
        if (!enterBtn || !curtainOverlay) return;

        enterBtn.addEventListener('click', function() {
            // Play dramatic sound effect (visual feedback instead)
            enterBtn.style.pointerEvents = 'none';
            enterBtn.textContent = '✦ The Performance Begins ✦';

            // Open curtains
            curtainOverlay.classList.add('open');

            // Activate main content after curtain starts opening
            setTimeout(() => {
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                    mainContent.classList.add('visible');
                }
            }, 800);

            // Activate chandelier light
            setTimeout(() => {
                if (chandelierLight) {
                    chandelierLight.classList.add('active');
                }
                // Start particle system
                initParticles();
            }, 1200);

            // Remove curtain overlay completely after animation
            setTimeout(() => {
                curtainOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                // Trigger initial reveals
                checkReveals();
            }, 2500);
        });

        // Prevent scrolling while curtain is showing
        document.body.style.overflow = 'hidden';
    }

    // ───── GOLD DUST PARTICLE SYSTEM ─────
    let particles = [];
    let particleCtx;
    let particleAnimationId;

    function initParticles() {
        if (!particlesCanvas) return;

        particleCtx = particlesCanvas.getContext('2d');
        resizeCanvas();

        // Create initial particles
        for (let i = 0; i < 80; i++) {
            particles.push(createParticle());
        }

        animateParticles();

        // Handle resize
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!particlesCanvas) return;
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * (particlesCanvas ? particlesCanvas.width : window.innerWidth),
            y: Math.random() * (particlesCanvas ? particlesCanvas.height : window.innerHeight),
            size: Math.random() * 3 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: Math.random() * -0.5 - 0.1,
            opacity: Math.random() * 0.6 + 0.2,
            opacityDirection: Math.random() > 0.5 ? 1 : -1,
            shimmer: Math.random() * Math.PI * 2,
            shimmerSpeed: Math.random() * 0.02 + 0.01
        };
    }

    function animateParticles() {
        if (!particleCtx || !particlesCanvas) return;

        particleCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

        particles.forEach((p, index) => {
            // Update shimmer
            p.shimmer += p.shimmerSpeed;
            const shimmerOpacity = (Math.sin(p.shimmer) + 1) / 2;

            // Update opacity with shimmer
            p.opacity += p.opacityDirection * 0.005;
            if (p.opacity >= 0.8) p.opacityDirection = -1;
            if (p.opacity <= 0.1) p.opacityDirection = 1;

            // Draw particle with golden glow
            const finalOpacity = p.opacity * (0.5 + shimmerOpacity * 0.5);
            
            // Outer glow
            const gradient = particleCtx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 3
            );
            gradient.addColorStop(0, `rgba(255, 220, 150, ${finalOpacity * 0.8})`);
            gradient.addColorStop(0.4, `rgba(212, 175, 55, ${finalOpacity * 0.4})`);
            gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            particleCtx.fillStyle = gradient;
            particleCtx.fill();

            // Core bright point
            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(255, 240, 200, ${finalOpacity})`;
            particleCtx.fill();

            // Update position
            p.x += p.speedX + Math.sin(p.shimmer * 0.5) * 0.1;
            p.y += p.speedY;

            // Wrap around edges
            if (p.y < -10) {
                p.y = particlesCanvas.height + 10;
                p.x = Math.random() * particlesCanvas.width;
            }
            if (p.x < -10) p.x = particlesCanvas.width + 10;
            if (p.x > particlesCanvas.width + 10) p.x = -10;
        });

        particleAnimationId = requestAnimationFrame(animateParticles);
    }

    // ───── SCROLL REVEAL ANIMATIONS ─────
    function initScrollReveals() {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optional: unobserve after revealing
                        // revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => {
                revealObserver.observe(el);
            });
        } else {
            // Fallback: show all elements
            revealElements.forEach(el => {
                el.classList.add('visible');
            });
        }
    }

    function checkReveals() {
        // Force check reveals after curtain opens
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }

    // ───── PERFORMANCE CARD SPOTLIGHT EFFECT ─────
    function initCardSpotlights() {
        performanceCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate percentage position
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;

                // Update CSS custom properties for spotlight position
                card.style.setProperty('--mouse-x', `${percentX - 50}%`);
                card.style.setProperty('--mouse-y', `${percentY - 50}%`);

                // Dynamic spotlight on inner element
                const inner = card.querySelector('.card-inner');
                if (inner) {
                    inner.style.background = `
                        radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 220, 150, 0.06) 0%, transparent 50%),
                        linear-gradient(180deg, var(--noir-warm) 0%, var(--noir-rich) 30%, var(--noir-deep) 100%)
                    `;
                }
            });

            card.addEventListener('mouseleave', function() {
                const inner = card.querySelector('.card-inner');
                if (inner) {
                    inner.style.background = '';
                }
            });
        });
    }

    // ───── SEAT INTERACTION ─────
    let selectedSeat = null;

    function initSeatInteraction() {
        seats.forEach(seat => {
            // Hover tooltip
            seat.addEventListener('mouseenter', function(e) {
                const price = this.dataset.price;
                showSeatTooltip(this, price);
            });

            seat.addEventListener('mouseleave', function() {
                hideSeatTooltip();
            });

            // Click to select
            seat.addEventListener('click', function() {
                // Deselect previous
                if (selectedSeat) {
                    selectedSeat.classList.remove('selected');
                }
                
                // Select new
                this.classList.add('selected');
                selectedSeat = this;
                
                // Visual feedback
                animateSeatSelection(this);
            });
        });

        // Box interactions
        boxes.forEach(box => {
            box.addEventListener('click', function() {
                const boxName = this.querySelector('.box-name').textContent;
                const boxPrice = this.querySelector('.box-price').textContent;
                
                showNotification(`${boxName} selected — ${boxPrice}`, 'box');
            });
        });
    }

    function showSeatTooltip(seat, price) {
        // Remove existing tooltip
        hideSeatTooltip();

        const tooltip = document.createElement('div');
        tooltip.className = 'seat-tooltip';
        tooltip.innerHTML = `<span class="tooltip-price">${price} Ducats</span>`;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-5px);
            background: linear-gradient(135deg, var(--crimson-deep), var(--crimson-rich));
            border: 1px solid var(--gold-warm);
            padding: 0.4rem 0.8rem;
            white-space: nowrap;
            z-index: 100;
            pointer-events: none;
            animation: fadeInUp 0.2s ease;
        `;

        const priceSpan = tooltip.querySelector('.tooltip-price');
        if (priceSpan) {
            priceSpan.style.cssText = `
                font-family: var(--font-heading);
                font-size: 0.7rem;
                letter-spacing: 0.1em;
                color: var(--gold-bright);
            `;
        }

        seat.style.position = 'relative';
        seat.appendChild(tooltip);
    }

    function hideSeatTooltip() {
        document.querySelectorAll('.seat-tooltip').forEach(t => t.remove());
    }

    function animateSeatSelection(seat) {
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.6), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: seatRipple 0.6s ease-out forwards;
        `;

        seat.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Show notification
        const price = seat.dataset.price;
        showNotification(`Seat reserved — ${price} Ducats`, 'seat');
    }

    // ───── NOTIFICATION SYSTEM ─────
    function showNotification(message, type) {
        // Remove existing notifications
        document.querySelectorAll('.opera-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'opera-notification';
        notification.innerHTML = `
            <span class="notif-icon">✦</span>
            <span class="notif-text">${message}</span>
        `;

        const bgColor = type === 'box' 
            ? 'linear-gradient(135deg, rgba(139, 0, 21, 0.95), rgba(74, 0, 8, 0.98))'
            : 'linear-gradient(135deg, rgba(74, 0, 8, 0.95), rgba(37, 16, 16, 0.98))';

        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: ${bgColor};
            border: 2px solid var(--gold-warm);
            padding: 1rem 2rem;
            z-index: 9998;
            opacity: 0;
            transition: all 0.4s ease;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.2);
            display: flex;
            align-items: center;
            gap: 0.8rem;
        `;

        const icon = notification.querySelector('.notif-icon');
        if (icon) {
            icon.style.cssText = `
                color: var(--gold-bright);
                font-size: 1rem;
            `;
        }

        const text = notification.querySelector('.notif-text');
        if (text) {
            text.style.cssText = `
                font-family: var(--font-heading);
                font-size: 0.85rem;
                letter-spacing: 0.15em;
                color: var(--cream-light);
            `;
        }

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Animate out
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // ───── SMOOTH SCROLL NAVIGATION ─────
    function initSmoothScroll() {
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

    // ───── PARALLAX CHANDELIER LIGHT ─────
    function initChandelierParallax() {
        if (!chandelierLight) return;

        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const opacity = Math.max(0, 1 - scrollY / 1500);
                    const scale = 1 + scrollY * 0.0003;
                    
                    chandelierLight.style.opacity = opacity * 0.8;
                    chandelierLight.style.transform = `translateX(-50%) scale(${scale})`;
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ───── DYNAMIC CANDELABRA FLAMES ─────
    function initCandelabraAnimation() {
        const flames = document.querySelectorAll('.flame-inner');
        
        flames.forEach((flame, index) => {
            // Randomize animation timing
            const duration = 0.3 + Math.random() * 0.4;
            const delay = Math.random() * 0.3;
            
            flame.style.animationDuration = `${duration}s`;
            flame.style.animationDelay = `${delay}s`;
        });

        // Subtle random flicker adjustments
        setInterval(() => {
            flames.forEach(flame => {
                const scale = 0.9 + Math.random() * 0.2;
                const skew = (Math.random() - 0.5) * 4;
                flame.style.transform = `translateX(-50%) scale(${scale}) skewX(${skew}deg)`;
            });
        }, 150);
    }

    // ───── PERFORMANCE CARD RESERVE BUTTON ─────
    function initReserveButtons() {
        document.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.performance-card');
                const title = card.querySelector('.card-title').textContent;
                const price = card.querySelector('.card-price').textContent;
                
                showNotification(`"${title}" — ${price}`, 'reservation');
                
                // Button animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // ───── TIMELINE ANIMATION ─────
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.schedule-item');
        
        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    // ───── SECTION HEADER ORNAMENT ANIMATION ─────
    function initOrnamentAnimations() {
        const dividers = document.querySelectorAll('.divider-svg');
        
        dividers.forEach(divider => {
            const path = divider.querySelector('path');
            if (path) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.transition = 'stroke-dashoffset 2s ease-in-out';
            }
        });

        // Animate on scroll into view
        const dividerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const path = entry.target.querySelector('path');
                    if (path) {
                        path.style.strokeDashoffset = '0';
                    }
                }
            });
        }, { threshold: 0.5 });

        dividers.forEach(div => dividerObserver.observe(div));
    }

    // ───── KEYBOARD ACCESSIBILITY ─────
    function initAccessibility() {
        // Allow Enter key to activate curtain button
        if (enterBtn) {
            enterBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // Add keyboard navigation for seats
        seats.forEach((seat, index) => {
            seat.setAttribute('tabindex', '0');
            seat.setAttribute('role', 'button');
            seat.setAttribute('aria-label', `Seat ${seat.textContent}, ${seat.dataset.price} Ducats`);
            
            seat.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // ───── PERFORMANCE CARD TILT EFFECT ─────
    function initCardTiltEffect() {
        performanceCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 40;
                const rotateY = (centerX - x) / 40;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // ───── LOADING SEQUENCE ─────
    function initLoadingSequence() {
        // Ensure fonts are loaded before showing
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }

        // Add CSS for seat ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes seatRipple {
                to {
                    width: 60px;
                    height: 60px;
                    opacity: 0;
                }
            }
            
            .seat.selected {
                background: linear-gradient(135deg, var(--gold-warm), var(--gold-rich)) !important;
                color: var(--noir-deep) !important;
                border-color: var(--gold-bright) !important;
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.5) !important;
            }
            
            .performance-card {
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ───── BACKGROUND AMBIENT GLOW ─────
    function initAmbientGlow() {
        // Create subtle moving ambient glow based on scroll position
        const body = document.body;
        
        window.addEventListener('scroll', function() {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const hue = 350 + scrollPercent * 10; // Subtle hue shift
            
            body.style.background = `
                radial-gradient(
                    ellipse at 50% ${30 + scrollPercent * 40}%,
                    hsla(${hue}, 100%, 5%, 1) 0%,
                    hsla(${hue}, 80%, 3%, 1) 50%,
                    hsla(${hue}, 60%, 2%, 1) 100%
                )
            `;
        });
    }

    // ───── INITIALIZE EVERYTHING ─────
    function init() {
        initCurtainReveal();
        initScrollReveals();
        initCardSpotlights();
        initSeatInteraction();
        initSmoothScroll();
        initChandelierParallax();
        initCandelabraAnimation();
        initReserveButtons();
        initTimelineAnimation();
        initOrnamentAnimations();
        initAccessibility();
        initCardTiltEffect();
        initLoadingSequence();
        initAmbientGlow();
    }

    // ───── DOM READY ─────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
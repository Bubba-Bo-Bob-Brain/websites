/* ============================================
   TEATRO DELL'OPERA REALE — JAVASCRIPT
   Baroque Opera House Program & Schedule
   Anno Domini MDCLXXXVII
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ---------- CURTAIN REVEAL ----------
    const curtainOverlay = document.getElementById('curtainOverlay');
    const curtainLeft = curtainOverlay.querySelector('.curtain-left');
    const curtainRight = curtainOverlay.querySelector('.curtain-right');
    const siteWrapper = document.getElementById('siteWrapper');

    function openCurtain() {
        // Prevent scroll while curtain is closed
        document.body.classList.add('curtain-active');

        // Delay before curtain opens
        setTimeout(() => {
            curtainLeft.classList.add('open');
            curtainRight.classList.add('open');

            // Show site content
            siteWrapper.classList.add('visible');

            // Re-enable scroll after curtain animation completes
            setTimeout(() => {
                document.body.classList.remove('curtain-active');
                // Remove curtain from DOM after animation
                setTimeout(() => {
                    if (curtainOverlay) {
                        curtainOverlay.style.pointerEvents = 'none';
                        curtainOverlay.style.opacity = '0';
                        curtainOverlay.style.transition = 'opacity 0.5s ease';
                    }
                }, 1500);
            }, 2000);
        }, 1200);
    }

    openCurtain();

    // ---------- SCROLL REVEAL OBSERVER ----------
    const revealElements = document.querySelectorAll(
        '.event-card, .performer-card, .ticket-tier, .section-header, .theatre-diagram, .legend-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on element index among siblings
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.querySelectorAll(
                    entry.target.classList.contains('event-card') ? '.event-card' :
                    entry.target.classList.contains('performer-card') ? '.performer-card' :
                    entry.target.classList.contains('ticket-tier') ? '.ticket-tier' :
                    entry.target.classList.contains('legend-item') ? '.legend-item' :
                    '.reveal'
                ));

                const siblingIndex = siblings.indexOf(entry.target);
                const delay = siblingIndex * 0.12;

                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ---------- SPOTLIGHT EFFECT ON PERFORMER CARDS ----------
    const performerCards = document.querySelectorAll('.performer-card');

    performerCards.forEach(card => {
        const spotlight = card.querySelector('.spotlight-effect');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            spotlight.style.background = `
                radial-gradient(
                    ellipse at ${x}% ${y}%,
                    rgba(255, 215, 0, 0.15) 0%,
                    rgba(255, 215, 0, 0.05) 30%,
                    transparent 70%
                )
            `;
            spotlight.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
    });

    // ---------- SMOOTH SCROLL NAVIGATION ----------
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.getElementById('mainNav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- ACTIVE NAV HIGHLIGHTING ON SCROLL ----------
    const sections = document.querySelectorAll('section[id]');
    const nav = document.getElementById('mainNav');

    function updateActiveNav() {
        const scrollPos = window.scrollY + nav.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---------- PARALLAX SUBTLE EFFECTS ----------
    const chandelierContainer = document.querySelector('.chandelier-container');
    const heroSection = document.querySelector('.hero-section');

    function handleParallax() {
        const scrollY = window.scrollY;

        // Subtle chandelier parallax
        if (chandelierContainer && scrollY < 600) {
            const parallaxOffset = scrollY * 0.15;
            chandelierContainer.style.transform = `translateX(-50%) translateY(${parallaxOffset}px)`;
        }

        // Hero section subtle fade
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (scrollY < heroBottom) {
                const opacity = 1 - (scrollY / heroBottom) * 0.5;
                heroSection.style.opacity = Math.max(0.3, opacity);
            }
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // ---------- TICKER TICKET BUTTON INTERACTIONS ----------
    const tierButtons = document.querySelectorAll('.tier-button');

    tierButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tierName = button.closest('.ticket-tier').querySelector('.tier-header h3').textContent;

            // Create ornate notification
            showNotification(`La prenotazione per "${tierName}" è stata registrata con successo. Il segretario di corte vi contatterà a breve.`);
        });
    });

    // ---------- CTA BUTTON INTERACTION ----------
    const ctaButton = document.querySelector('.cta-primary');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            // Let smooth scroll handle it, but add a visual flourish
            ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ctaButton.style.transform = '';
            }, 200);
        });
    }

    // ---------- ORNATE NOTIFICATION SYSTEM ----------
    function showNotification(message) {
        // Remove existing notification if any
        const existing = document.querySelector('.baroque-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'baroque-notification';
        notification.innerHTML = `
            <div class="notification-frame">
                <div class="notification-content">
                    <span class="notification-ornament">❖</span>
                    <p>${message}</p>
                    <button class="notification-close" aria-label="Chiudi notifica">✕</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('visible');
        });

        // Close handler
        const closeBtn = notification.querySelector('.notification-close');
        const closeNotification = () => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 500);
        };

        closeBtn.addEventListener('click', closeNotification);
        setTimeout(closeNotification, 8000);
    }

    // ---------- AMBIENT PARTICLE EFFECT (GOLD DUST) ----------
    function createGoldDust() {
        const particleCount = 15;
        const body = document.body;

        for (let i = 0; i < particleCount; i++) {
            createParticle(body);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'gold-dust';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: radial-gradient(circle, rgba(255, 215, 0, ${Math.random() * 0.4 + 0.1}) 0%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: floatParticle ${Math.random() * 15 + 10}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(particle);
    }

    // Add floating particle keyframes dynamically
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    createGoldDust();

    // ---------- EVENT CARD TILT EFFECT ----------
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ---------- NAVBAR HIDE/SHOW ON SCROLL ----------
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('mainNav');
    let navHidden = false;

    function handleNavVisibility() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        // Only hide/show after scrolling past the hero
        if (currentScrollY > 400) {
            if (scrollDelta > 50 && !navHidden) {
                navbar.style.transform = 'translateY(-100%)';
                navHidden = true;
            } else if (scrollDelta < -50 && navHidden) {
                navbar.style.transform = 'translateY(0)';
                navHidden = false;
            }
        } else {
            navbar.style.transform = 'translateY(0)';
            navHidden = false;
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleNavVisibility, { passive: true });

    // Add transition to navbar
    navbar.style.transition = 'transform 0.3s ease';

    // ---------- SEATING DIAGRAM HOVER TOOLTIPS ----------
    const seatingAreas = document.querySelectorAll('.theatre-svg path, .theatre-svg rect');

    seatingAreas.forEach(area => {
        area.style.cursor = 'pointer';
        area.style.transition = 'filter 0.3s ease';

        area.addEventListener('mouseenter', () => {
            area.style.filter = 'brightness(1.3)';
        });

        area.addEventListener('mouseleave', () => {
            area.style.filter = 'brightness(1)';
        });
    });

    // ---------- CURTAIN CLICK TO DISMISS EARLY ----------
    if (curtainOverlay) {
        curtainOverlay.addEventListener('click', () => {
            if (curtainLeft && curtainRight) {
                curtainLeft.classList.add('open');
                curtainRight.classList.add('open');
                siteWrapper.classList.add('visible');
                document.body.classList.remove('curtain-active');
                setTimeout(() => {
                    curtainOverlay.style.pointerEvents = 'none';
                    curtainOverlay.style.opacity = '0';
                    curtainOverlay.style.transition = 'opacity 0.5s ease';
                }, 500);
            }
        });
        curtainOverlay.style.cursor = 'pointer';
    }

    // ---------- PERFORMANCE METRICS LOG ----------
    console.log(
        '%c✦ Teatro dell\'Opera Reale ✦\nStagione Teatrale MDCLXXXVII',
        'color: #D4AF37; font-size: 16px; font-family: serif; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);'
    );
});
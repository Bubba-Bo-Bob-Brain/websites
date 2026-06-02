/* ═══════════════════════════════════════════════════════════
   THE ORDER OF THE ECLIPSED FLAME — Interactive Scripts
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Wait for DOM ───
    document.addEventListener('DOMContentLoaded', function () {
        initEmbers();
        initScrollReveal();
        initBackToTop();
        initNavigation();
        initTorches();
        initParallax();
        initScrollProgress();
        initSigilInteractions();
        initCreatureCards();
        initAmbientMist();
        onFirstLoad();
    });

    /* ═══════════════════════════════════════════════
       EMBER PARTICLE SYSTEM
       ═══════════════════════════════════════════════ */
    function initEmbers() {
        const container = document.getElementById('embers-container');
        const emberCount = Math.min(40, Math.floor(window.innerWidth / 30));

        for (let i = 0; i < emberCount; i++) {
            const ember = document.createElement('div');
            ember.classList.add('ember');

            // Randomized properties
            const size = Math.random() * 3 + 1.5;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 8;
            const delay = Math.random() * 15;
            const drift = (Math.random() - 0.5) * 120;

            ember.style.width = size + 'px';
            ember.style.height = size + 'px';
            ember.style.left = left + '%';
            ember.style.animationDuration = duration + 's';
            ember.style.animationDelay = delay + 's';

            // Custom drift via inline style override
            ember.style.setProperty('--drift', drift + 'px');

            // Slight color variation
            const hue = 15 + Math.random() * 25; // 15-40 (orange-gold range)
            ember.style.background = `hsl(${hue}, 100%, ${55 + Math.random() * 20}%)`;
            ember.style.boxShadow = `0 0 ${4 + size}px 1px hsla(${hue}, 100%, ${55 + Math.random() * 20}%, 0.6)`;

            container.appendChild(ember);
        }

        // Add CSS for drift dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatEmbersDrift {
                0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(var(--drift, 50px)) rotate(360deg) scale(0.3); opacity: 0; }
            }
            .ember { animation-name: floatEmbersDrift !important; }
        `;
        document.head.appendChild(style);
    }

    /* ═══════════════════════════════════════════════
       SCROLL REVEAL (IntersectionObserver)
       ═══════════════════════════════════════════════ */
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, we can optionally stop observing
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ═══════════════════════════════════════════════
       BACK TO TOP BUTTON
       ═══════════════════════════════════════════════ */
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        const scrollThreshold = 500;

        function checkScroll() {
            if (window.scrollY > scrollThreshold) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

    /* ═══════════════════════════════════════════════
       NAVIGATION — Active State & Smooth Scroll
       ═══════════════════════════════════════════════ */
    function initNavigation() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActive() {
            let current = '';
            sections.forEach(function (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.style.color = '';
                link.style.textShadow = '';
                const href = link.getAttribute('href');
                if (href === '#' + current) {
                    link.style.color = 'var(--gold)';
                    link.style.textShadow = '0 0 10px rgba(201, 168, 76, 0.5)';
                }
            });
        }

        // Smooth scroll for nav links
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerOffset = 90;
                        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                }
            });
        });

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    /* ═══════════════════════════════════════════════
       TORCH FLAME — Interactive Mouse Response
       ═══════════════════════════════════════════════ */
    function initTorches() {
        const flames = document.querySelectorAll('.flame-inner');

        document.addEventListener('mousemove', function (e) {
            flames.forEach(function (flame) {
                const rect = flame.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / window.innerWidth;
                const dy = (e.clientY - cy) / window.innerHeight;

                const tiltX = dx * 3;
                const tiltY = dy * 2;

                flame.style.transform = 'translateX(-50%) scaleX(' + (1 + tiltX * 0.05) + ') scaleY(' + (1 + tiltY * 0.03) + ')';
            });
        });
    }

    /* ═══════════════════════════════════════════════
       PARALLAX — Heraldic Crest & Map
       ═══════════════════════════════════════════════ */
    function initParallax() {
        const crest = document.querySelector('.heraldic-crest');
        const heroSection = document.querySelector('.hero-section');

        if (!crest || !heroSection) return;

        heroSection.addEventListener('mousemove', function (e) {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            crest.style.transform = 'translate(' + (x * -15) + 'px, ' + (y * -10) + 'px)';
        });

        heroSection.addEventListener('mouseleave', function () {
            crest.style.transform = 'translate(0, 0)';
        });
    }

    /* ═══════════════════════════════════════════════
       SCROLL PROGRESS INDICATOR
       ═══════════════════════════════════════════════ */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--gold-dark),var(--gold),var(--ember));z-index:9999;transition:width 0.1s ease;pointer-events:none;';
        document.body.appendChild(bar);

        function update() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = progress + '%';
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ═══════════════════════════════════════════════
       SIGIL INTERACTIONS — Glow & Tooltip Enhancement
       ═══════════════════════════════════════════════ */
    function initSigilInteractions() {
        const sigils = document.querySelectorAll('.sigil-item');

        sigils.forEach(function (sigil) {
            sigil.addEventListener('mouseenter', function () {
                // Create a glow burst
                const glow = document.createElement('div');
                glow.style.cssText = 'position:absolute;top:50%;left:50%;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.3),transparent 70%);transform:translate(-50%,-50%);pointer-events:none;z-index:-1;animation:sigilGlowFade 0.6s ease-out forwards;';
                sigil.style.position = 'relative';
                sigil.appendChild(glow);

                setTimeout(function () {
                    if (glow.parentNode) glow.parentNode.removeChild(glow);
                }, 600);
            });
        });

        // Add animation keyframe
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sigilGlowFade {
                0% { transform: translate(-50%,-50%) scale(0.5); opacity: 1; }
                100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /* ═══════════════════════════════════════════════
       CREATURE CARDS — Interactive Threat Bars &
       Atmospheric Glow on Hover
       ═══════════════════════════════════════════════ */
    function initCreatureCards() {
        const cards = document.querySelectorAll('.creature-card');

        cards.forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                const glow = card.querySelector('.creature-glow');
                if (glow) {
                    glow.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
                    glow.style.transform = 'translate(-50%,-50%) scale(1.4)';
                    glow.style.opacity = '0.6';
                }

                // Animate the threat bar
                const bar = card.querySelector('.threat-fill');
                if (bar) {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    requestAnimationFrame(function () {
                        setTimeout(function () {
                            bar.style.width = width;
                        }, 50);
                    });
                }
            });

            card.addEventListener('mouseleave', function () {
                const glow = card.querySelector('.creature-glow');
                if (glow) {
                    glow.style.transform = 'translate(-50%,-50%) scale(1)';
                    glow.style.opacity = '0.4';
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════
       AMBIENT FOG / MIST EFFECT
       ═══════════════════════════════════════════════ */
    function initAmbientMist() {
        const mistCount = 5;

        for (let i = 0; i < mistCount; i++) {
            const mist = document.createElement('div');
            mist.style.cssText = [
                'position:fixed',
                'pointer-events:none',
                'z-index:1',
                'width:' + (Math.random() * 300 + 200) + 'px',
                'height:' + (Math.random() * 200 + 100) + 'px',
                'border-radius:50%',
                'background:radial-gradient(ellipse,rgba(200,190,170,' + (Math.random() * 0.03 + 0.01) + ') 0%,transparent 70%)',
                'top:' + (Math.random() * 80 + 10) + '%',
                'left:' + (Math.random() * 80 + 10) + '%',
                'animation:mistDrift' + (i + 1) + ' ' + (Math.random() * 20 + 15) + 's ease-in-out infinite alternate',
                'opacity:0',
                'filter:blur(30px)'
            ].join(';');

            document.body.appendChild(mist);

            // Inject unique keyframe animation
            const style = document.createElement('style');
            const duration = Math.random() * 20 + 15;
            const startX = Math.random() * 100;
            const endX = Math.random() * 100;
            const startY = Math.random() * 50;
            const endY = Math.random() * 50;
            style.textContent = `
                @keyframes mistDrift${i + 1} {
                    0% { transform: translate(${startX}vw, ${startY}vh); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(${endX}vw, ${endY}vh); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ═══════════════════════════════════════════════
       FIRST LOAD — Dramatic Reveal
       ═══════════════════════════════════════════════ */
    function onFirstLoad() {
        const header = document.getElementById('main-header');
        const hero = document.querySelector('.hero-content');

        // Start hidden for dramatic reveal
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            header.style.transition = 'opacity 1s ease, transform 1s ease';
        }

        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(30px)';
            hero.style.transition = 'opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s';
        }

        setTimeout(function () {
            if (header) {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }
            if (hero) {
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }
        }, 300);

        // Add dramatic class to body after load
        document.body.style.transition = 'background 2s ease';
    }

    /* ═══════════════════════════════════════════════
       SCROLL-BASED PARALLAX FOR SECTIONS
       ═══════════════════════════════════════════════ */
    function initSectionParallax() {
        const sections = document.querySelectorAll('.manuscript-page, .map-parchment, .codex-page');

        window.addEventListener('scroll', function () {
            sections.forEach(function (section) {
                const rect = section.getBoundingClientRect();
                const scrolled = -rect.top * 0.05;
                section.style.transform = 'translateY(' + scrolled + 'px)';
            });
        }, { passive: true });
    }

    // Initialize section parallax if device is not mobile (performance)
    if (window.innerWidth > 768) {
        window.addEventListener('DOMContentLoaded', function () {
            setTimeout(initSectionParallax, 500);
        });
    }

    /* ═══════════════════════════════════════════════
       OBSERVE OATH BARS — Animate on Scroll
       ═══════════════════════════════════════════════ */
    function initOathBars() {
        const attrFills = document.querySelectorAll('.attr-fill');
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(function () {
                        fill.style.width = width;
                    }, 200);
                    observer.unobserve(fill);
                }
            });
        }, { threshold: 0.3 });

        attrFills.forEach(function (fill) {
            observer.observe(fill);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOathBars);
    } else {
        initOathBars();
    }

    /* ═══════════════════════════════════════════════
       KEYBOARD ACCESSIBILITY — Escape closes menus, etc.
       ═══════════════════════════════════════════════ */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            // Could close modals, dropdowns, etc.
        }
    });

})();
/* ============================================
   The Codex of the Forgotten — Dark Fantasy JS
   ============================================ */

(function() {

    // --- Particle System ---
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (8 + Math.random() * 12) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.width = (1 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;

        const colors = ['#d4920a', '#c44e1a', '#e8842a', '#8b1a2b', '#f0c040'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 20000);
    }

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    setInterval(createParticle, 800);

    // --- Scroll-triggered Animations ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Inscription wall entries
    document.querySelectorAll('.inscription').forEach((el, i) => {
        el.style.animationDelay = (i * 0.3) + 's';
        revealObserver.observe(el);
    });

    // Prophecy lines reveal on scroll
    const prophecyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.querySelectorAll('.prophecy-line');
                lines.forEach((line, i) => {
                    line.style.animationDelay = (0.5 + i * 0.3) + 's';
                    line.style.animationPlayState = 'running';
                });
            }
        });
    }, { threshold: 0.3 });

    const prophecySection = document.getElementById('prophecy');
    if (prophecySection) {
        prophecyObserver.observe(prophecySection);
    }

    // --- Bestiary Card Interactions ---
    const bestiaryCards = document.querySelectorAll('.bestiary-card');

    bestiaryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const illustration = this.querySelector('.creature-svg');
            illustration.style.transition = 'transform 0.6s ease';
            illustration.style.transform = 'scale(1.1) rotate(2deg)';
        });

        card.addEventListener('mouseleave', function() {
            const illustration = this.querySelector('.creature-svg');
            illustration.style.transform = 'scale(1) rotate(0deg)';
        });

        // Click to reveal more
        card.addEventListener('click', function() {
            const content = this.querySelector('.card-content');
            content.style.transition = 'all 0.5s ease';
            content.style.transform = 'translateY(-5px)';
        });
    });

    // --- Map Region Hover ---
    const mapSvg = document.getElementById('realmMap');
    if (mapSvg) {
        const regions = mapSvg.querySelectorAll('path');
        regions.forEach(region => {
            region.style.cursor = 'pointer';
            region.style.transition = 'opacity 0.3s ease, filter 0.3s ease';

            region.addEventListener('mouseenter', function() {
                this.style.opacity = '0.9';
                this.style.filter = 'brightness(1.3)';
            });

            region.addEventListener('mouseleave', function() {
                this.style.opacity = '0.8';
                this.style.filter = 'brightness(1)';
            });
        });

        // Waypoint dots pulse
        const waypoints = mapSvg.querySelectorAll('circle');
        waypoints.forEach(dot => {
            dot.style.cursor = 'pointer';
            dot.style.transition = 'r 0.3s ease, opacity 0.3s ease';

            dot.addEventListener('mouseenter', function() {
                this.setAttribute('r', '5');
                this.style.opacity = '1';
                this.style.filter = 'drop-shadow(0 0 4px #d4920a)';
            });

            dot.addEventListener('mouseleave', function() {
                this.setAttribute('r', '3');
                this.style.opacity = '0.7';
                this.style.filter = 'none';
            });
        });
    }

    // --- Torchlight Enhancement ---
    const torchElements = document.querySelectorAll('.torch');

    torchElements.forEach(torch => {
        torch.addEventListener('mouseenter', function() {
            this.style.opacity = '0.15';
            this.style.transition = 'opacity 0.5s ease';
        });

        torch.addEventListener('mouseleave', function() {
            this.style.opacity = '0.08';
        });
    });

    // --- Final Seal Animation Trigger ---
    const finalSeal = document.getElementById('finalSeal');
    const finalWhisper = document.getElementById('finalWhisper');

    const finalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (finalSeal) {
                    finalSeal.style.opacity = '0';
                    finalSeal.style.transform = 'scale(0.5)';
                    finalSeal.style.transition = 'all 1s ease';
                    setTimeout(() => {
                        finalSeal.style.opacity = '1';
                        finalSeal.style.transform = 'scale(1)';
                    }, 300);
                }

                if (finalWhisper) {
                    finalWhisper.style.animation = 'fadeInUp 1.5s ease-out forwards';
                }

                finalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const finalSection = document.getElementById('final');
    if (finalSection) {
        finalObserver.observe(finalSection);
    }

    // --- Scroll Indicator Dismiss ---
    const scrollIndicator = document.getElementById('scrollIndicator');
    let scrollDismissed = false;

    window.addEventListener('scroll', function() {
        if (!scrollDismissed && window.scrollY > 100) {
            scrollIndicator.style.transition = 'opacity 1s ease, transform 1s ease';
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateY(20px)';
            scrollDismissed = true;
        }
    });

    // --- Ambient Sound Toggle (visual cue only) ---
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.addEventListener('click', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.borderColor = 'var(--ember-glow)';
            this.style.boxShadow = '0 0 15px rgba(200, 100, 20, 0.3)';
            setTimeout(() => {
                this.style.borderColor = 'var(--border-mid)';
                this.style.boxShadow = 'none';
            }, 1500);
        });
    }

    // --- Parallax Effect for Hero ---
    window.addEventListener('scroll', function() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        const scrolled = window.scrollY;
        const parallaxElements = hero.querySelectorAll('.hero-title, .hero-seal, .hero-subtitle');

        parallaxElements.forEach((el, i) => {
            const speed = 0.1 + (i * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // --- Bestiary Card Entrance Animation ---
    const bestiaryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                bestiaryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    bestiaryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        bestiaryObserver.observe(card);
    });

    // --- Map Compass Rose Animation ---
    const compassRose = mapSvg?.querySelector('g[transform*="720"]');
    if (compassRose) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.05;
            compassRose.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    }

    // --- Ink Splotch Effect on Click ---
    document.addEventListener('click', function(e) {
        const splotch = document.createElement('div');
        splotch.style.position = 'fixed';
        splotch.style.left = e.clientX + 'px';
        splotch.style.top = e.clientY + 'px';
        splotch.style.width = '6px';
        splotch.style.height = '6px';
        splotch.style.background = 'var(--torch-amber)';
        splotch.style.borderRadius = '50%';
        splotch.style.pointerEvents = 'none';
        splotch.style.zIndex = '9999';
        splotch.style.opacity = '0.6';
        splotch.style.transform = 'translate(-50%, -50%)';
        splotch.style.transition = 'all 0.8s ease';
        splotch.style.boxShadow = '0 0 8px rgba(212, 146, 10, 0.4)';

        document.body.appendChild(splotch);

        requestAnimationFrame(() => {
            splotch.style.opacity = '0';
            splotch.style.transform = 'translate(-50%, -50%) scale(3)';
        });

        setTimeout(() => splotch.remove(), 1000);
    });

    // --- Seal Ring Hover Effect ---
    const sealRings = document.querySelectorAll('.seal-ring');
    sealRings.forEach(ring => {
        ring.addEventListener('mouseenter', function() {
            this.style.transition = 'border-color 0.3s ease, opacity 0.3s ease';
            this.style.borderColor = 'var(--torch-amber)';
            this.style.opacity = '0.8';
        });

        ring.addEventListener('mouseleave', function() {
            this.style.borderColor = '';
            this.style.opacity = '';
        });
    });

    // --- Parchment Scroll Effect ---
    const prophecyScroll = document.querySelector('.prophecy-scroll');
    if (prophecyScroll) {
        prophecyScroll.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            this.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
        });
    }

    // --- Dynamic Title Glow ---
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        let glowIntensity = 0;
        let glowDirection = 1;

        setInterval(() => {
            glowIntensity += glowDirection * 0.02;
            if (glowIntensity >= 0.4) glowDirection = -1;
            if (glowIntensity <= 0) glowDirection = 1;

            heroTitle.style.textShadow = `
                0 0 ${20 + glowIntensity * 30}px rgba(200, 140, 40, ${glowIntensity}),
                0 0 ${40 + glowIntensity * 40}px rgba(200, 140, 40, ${glowIntensity * 0.5}),
                0 2px 4px rgba(0, 0, 0, 0.8)
            `;
        }, 50);
    }

    // --- Page Load Sequence ---
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1.5s ease';

        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });

        // Trigger initial prophecy line animations
        const prophecyLines = document.querySelectorAll('.prophecy-line');
        prophecyLines.forEach((line, i) => {
            line.style.animationDelay = (0.5 + i * 0.3) + 's';
        });
    });

})();
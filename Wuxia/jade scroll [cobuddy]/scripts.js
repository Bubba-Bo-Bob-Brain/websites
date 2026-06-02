// ============================================
// WUXIA MARTIAL ARTS SCROLL — SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Scroll Unroll Transition ----------
    const scrollContainer = document.getElementById('scrollContainer');
    const unrollOverlay = document.getElementById('unrollOverlay');
    const unrollChar = document.getElementById('unrollChar');

    function playUnroll() {
        unrollOverlay.style.animation = 'unrollReveal 2.5s ease-out forwards';
        setTimeout(() => {
            unrollOverlay.style.display = 'none';
            scrollContainer.classList.add('scroll-unrolling');
        }, 2200);
    }

    // Staggered character reveal during unroll
    const unrollChars = ['武', '林', '秘', '籍'];
    let charIndex = 0;
    const charInterval = setInterval(() => {
        if (charIndex < unrollChars.length) {
            unrollChar.textContent = unrollChars[charIndex];
            charIndex++;
        } else {
            clearInterval(charInterval);
        }
    }, 300);

    playUnroll();

    // ---------- Parallax Background ----------
    let ticking = false;
    function updateParallax() {
        const scrollY = window.scrollY;
        const cloudLayers = document.querySelectorAll('.cloud-layer');
        cloudLayers.forEach((layer, i) => {
            const speed = (i + 1) * 0.03;
            layer.style.transform = `translateY(${scrollY * speed}px) translateX(${scrollY * 0.01}px)`;
        });

        const bambooLeft = document.querySelector('.bamboo-left');
        const bambooRight = document.querySelector('.bamboo-right');
        if (bambooLeft) bambooLeft.style.transform = `skewX(${-5 + scrollY * 0.005}deg) translateY(${scrollY * 0.1}px)`;
        if (bambooRight) bambooRight.style.transform = `skewX(${5 - scrollY * 0.005}deg) translateY(${scrollY * 0.1}px)`;

        const inkSplashes = document.querySelectorAll('.ink-splash');
        inkSplashes.forEach((splash, i) => {
            const speed = (i + 1) * 0.02;
            splash.style.transform = `translateY(${scrollY * speed}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // ---------- Red Seal Navigation Active State ----------
    const sealNav = document.getElementById('sealNav');
    const sections = document.querySelectorAll('.scroll-section');

    function updateActiveSeal() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        const stamps = sealNav.querySelectorAll('.seal-stamp');
        stamps.forEach(stamp => {
            stamp.classList.remove('seal-active');
            if (stamp.getAttribute('href') === `#${current}`) {
                stamp.classList.add('seal-active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveSeal);

    // Add active state style dynamically
    const sealActiveStyle = document.createElement('style');
    sealActiveStyle.textContent = `
        .seal-stamp.seal-active .seal-character {
            background: rgba(194, 58, 43, 0.2);
            box-shadow: 0 0 20px rgba(194, 58, 43, 0.3), inset 0 0 0 2px rgba(194, 58, 43, 0.3);
            transform: scale(1.1);
        }
        .seal-stamp.seal-active {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(sealActiveStyle);

    // ---------- Cultivation Path Scroll Reveal ----------
    const pathNodes = document.querySelectorAll('.path-node');
    const pathConnectors = document.querySelectorAll('.path-connector');

    const pathObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });

    pathNodes.forEach(node => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px) scale(0.9)';
        node.style.transition = 'all 0.6s ease-out';
        pathObserver.observe(node);
    });

    // Animate path connectors
    pathConnectors.forEach((connector, index) => {
        connector.style.opacity = '0';
        connector.style.transition = `opacity 0.4s ease-out ${index * 0.15}s`;
        const connectorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.5 });
        connectorObserver.observe(connector);
    });

    // ---------- Qi Particle Animation ----------
    function createQiParticle(connector) {
        const particle = document.createElement('div');
        particle.className = 'qi-particle';
        particle.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
        particle.style.left = '50%';
        particle.style.top = '0px';
        particle.style.transform = 'translateX(-50%)';
        connector.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    // Periodically create qi particles along connectors
    setInterval(() => {
        const randomConnector = pathConnectors[Math.floor(Math.random() * pathConnectors.length)];
        if (randomConnector) {
            createQiParticle(randomConnector);
        }
    }, 800);

    // ---------- Technique Cards Interaction ----------
    const techniqueCards = document.querySelectorAll('.technique-card');

    techniqueCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const inkSplash = this.querySelector('.technique-ink-splash');
            if (inkSplash) {
                inkSplash.style.transform = 'scale(1.5) rotate(15deg)';
                inkSplash.style.opacity = '0.1';
                inkSplash.style.transition = 'all 0.5s ease';
            }
        });

        card.addEventListener('mouseleave', function () {
            const inkSplash = this.querySelector('.technique-ink-splash');
            if (inkSplash) {
                inkSplash.style.transform = 'scale(1) rotate(0deg)';
                inkSplash.style.opacity = '0.06';
                inkSplash.style.transition = 'all 0.5s ease';
            }
        });
    });

    // ---------- Skill Tree Interaction ----------
    const skillNodes = document.querySelectorAll('.skill-node');

    skillNodes.forEach(node => {
        node.addEventListener('click', function () {
            // Toggle a glow effect
            this.classList.toggle('skill-node-active');
        });
    });

    // Add active glow style
    const skillActiveStyle = document.createElement('style');
    skillActiveStyle.textContent = `
        .skill-node-active {
            box-shadow: 0 0 20px rgba(201, 168, 76, 0.3), 0 0 40px rgba(201, 168, 76, 0.1) !important;
            border-color: var(--qi-gold) !important;
            background: rgba(201, 168, 76, 0.12) !important;
        }
        .skill-node-active .skill-char {
            text-shadow: 0 0 8px rgba(201, 168, 76, 0.4);
        }
    `;
    document.head.appendChild(skillActiveStyle);

    // ---------- Meridian Qi Flow Animation ----------
    const meridianSvg = document.getElementById('meridianSvg');
    const meridianPaths = meridianSvg.querySelectorAll('path');

    // Animate stroke dashoffset for drawing effect
    meridianPaths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.animation = `meridianFlow ${2 + Math.random() * 2}s ease-out forwards`;
        path.style.animationDelay = `${Math.random() * 1}s`;
    });

    // Add meridian flow keyframe
    const meridianFlowStyle = document.createElement('style');
    meridianFlowStyle.textContent = `
        @keyframes meridianFlow {
            0% { stroke-dashoffset: 300; opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { stroke-dashoffset: 0; opacity: 1; }
        }
    `;
    document.head.appendChild(meridianFlowStyle);

    // Continuous qi flow along meridian paths
    function animateQiFlow() {
        meridianPaths.forEach(path => {
            const length = path.getTotalLength();
            const offset = (Date.now() * 0.02) % length;
            path.style.strokeDasharray = `${length} ${length}`;
            path.style.strokeDashoffset = length - offset;
        });
        requestAnimationFrame(animateQiFlow);
    }

    // Start meridian flow after a delay
    setTimeout(animateQiFlow, 3000);

    // ---------- Meridian Labels Hover ----------
    const meridianLabels = document.querySelectorAll('.meridian-label');
    meridianLabels.forEach(label => {
        label.addEventListener('mouseenter', function () {
            this.style.background = 'rgba(194, 58, 43, 0.08)';
            this.style.borderColor = 'rgba(194, 58, 43, 0.3)';
            this.style.transition = 'all 0.3s ease';
        });

        label.addEventListener('mouseleave', function () {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.borderColor = 'rgba(107, 93, 79, 0.15)';
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ---------- Legend Cards Reveal ----------
    const legendCards = document.querySelectorAll('.legend-card');

    const legendObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    legendCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        legendObserver.observe(card);
    });

    // ---------- Smooth Scroll for Seal Navigation ----------
    const sealLinks = sealNav.querySelectorAll('a');
    sealLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Add a brief highlight to the target section
                targetSection.style.transition = 'box-shadow 0.5s ease';
                targetSection.style.boxShadow = 'inset 0 0 30px rgba(194, 58, 43, 0.1)';

                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                setTimeout(() => {
                    targetSection.style.boxShadow = 'none';
                }, 1500);
            }
        });
    });

    // ---------- Ink Wash Brush Stroke on Scroll ----------
    // Create decorative brush strokes as user scrolls
    let brushStrokeCreated = false;
    window.addEventListener('scroll', () => {
        if (!brushStrokeCreated && window.scrollY > 300) {
            brushStrokeCreated = true;
            createInkWashAccent();
        }
    });

    function createInkWashAccent() {
        const accent = document.createElement('div');
        accent.className = 'ink-wash-accent';
        accent.innerHTML = `
            <svg width="200" height="30" viewBox="0 0 200 30" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);opacity:0.06;">
                <path d="M0,15 C30,5 60,25 100,15 C140,5 170,25 200,15" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        document.body.appendChild(accent);
    }

    // ---------- Scroll Edge Fade Effect ----------
    const scrollContainerEl = document.querySelector('.scroll-container');
    const observerFade = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            } else {
                entry.target.style.opacity = '0.7';
            }
        });
    }, { threshold: 0.1 });

    scrollContainerEl && observerFade.observe(scrollContainerEl);

    // ---------- Custom Cursor Trail (optional, subtle) ----------
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ---------- Technique Power Stars Animation ----------
    const powerStars = document.querySelectorAll('.technique-power');
    powerStars.forEach(stars => {
        const starCount = stars.textContent.length;
        let currentStar = 0;
        const glowInterval = setInterval(() => {
            if (currentStar >= starCount) {
                clearInterval(glowInterval);
                return;
            }
            const char = stars.children[currentStar];
            if (char) {
                char.style.textShadow = '0 0 6px rgba(201, 168, 76, 0.6)';
                setTimeout(() => {
                    char.style.textShadow = 'none';
                }, 200);
            }
            currentStar++;
        }, 100);
    });

    // ---------- Meridian Body Silhouette Breathing Effect ----------
    const meridianSvgEl = document.getElementById('meridianSvg');
    if (meridianSvgEl) {
        let breatheScale = 1;
        let breatheDirection = 1;
        function breatheAnimation() {
            breatheDirection *= 0.999;
            breatheScale += breatheDirection * 0.0002;
            if (breatheScale > 1.002) breatheDirection = -1;
            if (breatheScale < 0.998) breatheDirection = 1;

            meridianSvgEl.style.transform = `scale(${breatheScale})`;
            requestAnimationFrame(breatheAnimation);
        }
        breatheAnimation();
    }

    // ---------- Seal Stamp Click Ripple ----------
    const sealStamps = document.querySelectorAll('.seal-stamp');
    sealStamps.forEach(stamp => {
        stamp.addEventListener('click', function (e) {
            const ripple = document.createElement('div');
            ripple.className = 'seal-ripple';
            ripple.style.cssText = `
                position: absolute;
                width: 50px;
                height: 50px;
                border: 2px solid var(--red-seal);
                border-radius: 4px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
                pointer-events: none;
                animation: sealRipple 0.6s ease-out forwards;
            `;
            this.style.position = 'relative';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes sealRipple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        .seal-ripple {
            position: absolute;
            width: 50px;
            height: 50px;
            border: 2px solid var(--red-seal);
            border-radius: 4px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            pointer-events: none;
            animation: sealRipple 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(rippleStyle);

    // ---------- Floating Ink Particles ----------
    function createFloatingParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-ink-particle';
        particle.style.cssText = `
            position: fixed;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: var(--ink-black);
            border-radius: 50%;
            opacity: ${0.03 + Math.random() * 0.05};
            pointer-events: none;
            z-index: 0;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: floatParticle ${8 + Math.random() * 12}s linear infinite;
        `;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 20000);
    }

    // Add floating particle animation
    const floatParticleStyle = document.createElement('style');
    floatParticleStyle.textContent = `
        @keyframes floatParticle {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.06; }
            90% { opacity: 0.06; }
            100% { transform: translate(${50 + Math.random() * 100}px, ${-100 - Math.random() * 200}px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(floatParticleStyle);

    // Create particles periodically
    setInterval(createFloatingParticle, 2000);
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingParticle, i * 300);
    }

    // ---------- Section Divider Drawing Animation ----------
    const dividers = document.querySelectorAll('.section-divider');
    dividers.forEach(divider => {
        const width = divider.offsetWidth;
        divider.style.width = '0';
        divider.style.transition = 'width 1s ease-out';
        const dividerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    divider.style.width = width + 'px';
                }
            });
        }, { threshold: 0.5 });
        dividerObserver.observe(divider);
    });

    // ---------- Legend Quote Fade-in ----------
    const legendQuotes = document.querySelectorAll('.legend-quote');
    legendQuotes.forEach(quote => {
        quote.style.opacity = '0';
        quote.style.transition = 'opacity 0.8s ease-out';
        const quoteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        quoteObserver.observe(quote);
    });

    // ---------- Tag Tooltip on Hover ----------
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.borderColor = 'var(--red-seal)';
            this.style.color = 'var(--red-seal)';
            this.style.transition = 'all 0.3s ease';
        });
        tag.addEventListener('mouseleave', function () {
            this.style.borderColor = 'var(--ink-light)';
            this.style.color = 'var(--ink-medium)';
            this.style.transition = 'all 0.3s ease';
        });
    });

    console.log('武林秘籍 — Ancient Scroll of Martial Arts loaded');
});
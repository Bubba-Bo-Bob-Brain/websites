// =============================================
// DUSTY GULCH — BOUNTY BOARD — SCRIPTS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DUST PARTICLES
    // ==========================================

    const dustOverlay = document.getElementById('dust-overlay');
    const particleCount = 60;

    function createDustParticle() {
        const particle = document.createElement('div');
        particle.classList.add('dust-particle');

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const dx = (Math.random() - 0.5) * 200;
        const dy = -Math.random() * 300 - 100;
        const duration = Math.random() * 8 + 6;

        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        const size = Math.random() * 2 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        dustOverlay.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, (duration + 2) * 1000);
    }

    for (let i = 0; i < particleCount; i++) {
        setTimeout(createDustParticle, Math.random() * 5000);
    }

    setInterval(createDustParticle, 300);

    // ==========================================
    // TUMBLEWEED DRIFT ENHANCEMENT
    // ==========================================

    const tumbleweeds = document.querySelectorAll('.tumbleweed');

    tumbleweeds.forEach((tw, index) => {
        tw.addEventListener('animationiteration', () => {
            tw.style.top = (Math.random() * 80 + 10) + '%';
        });
    });

    // ==========================================
    // REVOLVER NAVIGATION
    // ==========================================

    const chambers = document.querySelectorAll('.chamber');
    const sections = ['posters', 'rewards', 'outlaws', 'dispatch'];

    chambers.forEach((chamber, index) => {
        chamber.addEventListener('click', () => {
            // Update active state
            chambers.forEach(c => c.classList.remove('active'));
            chamber.classList.add('active');

            // Smooth scroll to section
            const targetSection = document.getElementById(sections[index]);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Track scroll position to update active chamber
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionIndex = sections.indexOf(sectionId);

                if (sectionIndex !== -1) {
                    chambers.forEach((c, i) => {
                        c.classList.toggle('active', i === sectionIndex);
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    // ==========================================
    // POSTER CARD INTERACTIONS
    // ==========================================

    const posterCards = document.querySelectorAll('.poster-card');

    posterCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('poster-expanded');
        });

        // Add subtle parallax on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==========================================
    // DISPATCH LOG — AUTO-SCROLL NEW ENTRIES
    // ==========================================

    const dispatchEntries = document.querySelectorAll('.dispatch-entry');

    // Add typing effect to the first (newest) entry
    const newestEntry = dispatchEntries[0];
    if (newestEntry) {
        const messageEl = newestEntry.querySelector('.dispatch-message');

        function typeWriter(element, text, speed = 20) {
            element.textContent = '';
            let i = 0;

            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }

            type();
        }

        const originalText = messageEl.textContent;
        messageEl.textContent = '';
        setTimeout(() => typeWriter(messageEl, originalText), 500);
    }

    // Highlight urgent entries on load
    dispatchEntries.forEach((entry, index) => {
        if (index === 0) {
            entry.style.animation = 'dispatchPulse 3s ease-in-out infinite';
        }
    });

    // ==========================================
    // TIP FORM SUBMISSION
    // ==========================================

    const tipForm = document.querySelector('.tip-form');
    const tipButton = document.querySelector('.tip-button');

    if (tipForm && tipButton) {
        tipButton.addEventListener('click', () => {
            const nameInput = tipForm.querySelector('.tip-input');
            const messageInput = tipForm.querySelector('.tip-textarea');

            if (messageInput.value.trim().length > 0) {
                // Success feedback
                tipButton.textContent = '✓ Tip Delivered!';
                tipButton.style.background = 'linear-gradient(180deg, #2E7D32, #1B5E20)';
                tipButton.style.borderColor = '#4CAF50';
                tipButton.style.color = '#A5D6A7';

                setTimeout(() => {
                    tipButton.textContent = '🤠 Deliver Tip to Marshal';
                    tipButton.style.background = '';
                    tipButton.style.borderColor = '';
                    tipButton.style.color = '';
                    nameInput.value = '';
                    messageInput.value = '';
                }, 3000);

                // Show confirmation
                const confirmation = document.createElement('div');
                confirmation.textContent = '⚠ Your tip has been noted. Bounty hunters will investigate.';
                confirmation.style.cssText = `
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--parchment);
                    color: var(--ink);
                    padding: 1rem 2rem;
                    border: 2px solid var(--amber);
                    font-family: 'Special Elite', monospace;
                    font-size: 0.85rem;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
                    z-index: 10002;
                    animation: fadeInUp 0.5s ease-out;
                    max-width: 90%;
                    text-align: center;
                `;
                document.body.appendChild(confirmation);

                setTimeout(() => {
                    confirmation.style.opacity = '0';
                    confirmation.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => confirmation.remove(), 500);
                }, 4000);
            } else {
                // Shake animation for empty submission
                tipForm.style.animation = 'none';
                tipForm.offsetHeight;
                tipForm.style.animation = 'shake 0.5s ease';
            }
        });
    }

    // Add shake keyframes dynamically
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ==========================================
    // SMOOTH NAV LINK SCROLLING
    // ==========================================

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Animate the active nav link
                navLinks.forEach(l => l.style.borderColor = 'var(--rope-color)');
                link.style.borderColor = 'var(--amber-glow)';
            }
        });
    });

    // ==========================================
    // STAT BAR ANIMATION ON SCROLL
    // ==========================================

    const statFills = document.querySelectorAll('.stat-fill');

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.width;
                fill.style.width = '0%';

                setTimeout(() => {
                    fill.style.transition = 'width 1.5s ease-out';
                    fill.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    statFills.forEach(fill => statObserver.observe(fill));

    // ==========================================
    // REWARD TIER COUNTER ANIMATION
    // ==========================================

    const tierAmounts = document.querySelectorAll('.tier-amount');

    const tierObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const match = text.match(/\$[\d,]+/);

                if (match) {
                    const amount = parseInt(match[0].replace(/[$,]/g, ''));
                    let current = 0;
                    const increment = Math.ceil(amount / 30);
                    const suffix = text.replace(match[0], '');

                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= amount) {
                            current = amount;
                            clearInterval(counter);
                        }
                        el.textContent = '$' + current.toLocaleString() + suffix;
                    }, 40);
                }

                tierObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    tierAmounts.forEach(el => tierObserver.observe(el));

    // ==========================================
    // CURSOR TRAIL — DUSTY CURSOR
    // ==========================================

    let cursorTrail = [];
    const trailLength = 8;

    document.addEventListener('mousemove', (e) => {
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    });

    // Render cursor trail dots
    function renderCursorTrail() {
        // Remove old trail dots
        document.querySelectorAll('.cursor-trail-dot').forEach(dot => dot.remove());

        cursorTrail.forEach((point, index) => {
            const age = Date.now() - point.time;
            const opacity = Math.max(0, 1 - age / 500);
            const size = Math.max(1, 3 - index * 0.3);

            if (opacity > 0) {
                const dot = document.createElement('div');
                dot.classList.add('cursor-trail-dot');
                dot.style.cssText = `
                    position: fixed;
                    left: ${point.x - size / 2}px;
                    top: ${point.y - size / 2}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: var(--dust-gold);
                    border-radius: 50%;
                    opacity: ${opacity * 0.4};
                    pointer-events: none;
                    z-index: 9998;
                    transition: opacity 0.3s ease;
                `;
                document.body.appendChild(dot);
            }
        });

        requestAnimationFrame(renderCursorTrail);
    }

    // Start cursor trail
    renderCursorTrail();

    // ==========================================
    // POSTER CURL EFFECT — RANDOM FLICKER
    // ==========================================

    const posters = document.querySelectorAll('.poster-card');

    posters.forEach(poster => {
        // Randomly flicker the curl shadow
        setInterval(() => {
            const curl = poster.querySelector('.poster-curl-top');
            if (curl && Math.random() > 0.7) {
                curl.style.transform = `rotate(${45 + Math.random() * 10}deg)`;
                setTimeout(() => {
                    curl.style.transform = 'rotate(45deg)';
                }, 200);
            }
        }, 3000);
    });

    // ==========================================
    // DISPATCH LOG — LIVE CLOCK
    // ==========================================

    function updateDispatchClocks() {
        const clocks = document.querySelectorAll('.dispatch-time');
        // Just a visual indicator that we track time
        clocks.forEach(clock => {
            clock.style.transition = 'color 0.3s ease';
        });
    }

    // ==========================================
    // SALOON DOOR PAGE TRANSITION
    // ==========================================

    const pageTransition = document.getElementById('page-transition');

    function triggerSaloonTransition(callback) {
        pageTransition.classList.add('active');

        setTimeout(() => {
            if (callback) callback();
            setTimeout(() => {
                pageTransition.classList.remove('active');
            }, 800);
        }, 800);
    }

    // Trigger transition when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // triggerSaloonTransition(() => {
            //     const targetId = link.getAttribute('href').substring(1);
            //     document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            // });
        });
    });

    // ==========================================
    // BOUNTY BOARD — PIN/UNPIN POSTER EFFECT
    // ==========================================

    const posterNails = document.querySelectorAll('.poster-nail');

    posterNails.forEach(nail => {
        nail.addEventListener('click', (e) => {
            e.stopPropagation();

            if (nail.classList.contains('pinned')) {
                nail.classList.remove('pinned');
                nail.style.transform = 'translateX(-50%) rotate(0deg)';
                nail.textContent = '';
            } else {
                nail.classList.add('pinned');
                nail.style.transform = 'translateX(-50%) rotate(45deg)';
                nail.textContent = '📌';
            }
        });
    });

    // ==========================================
    // AMBIENT — RANDOM THUNDER RUMBLE (VISUAL FLASH)
    // ==========================================

    function randomThunderFlash() {
        if (Math.random() > 0.95) {
            document.body.style.filter = 'brightness(1.1)';

            setTimeout(() => {
                document.body.style.filter = 'brightness(1)';
            }, 100);
        }
    }

    setInterval(randomThunderFlash, 5000);

    // ==========================================
    // SCROLL REVEAL — SECTION ANIMATIONS
    // ==========================================

    const revealElements = document.querySelectorAll(
        '.poster-card, .reward-tier, .outlaw-profile, .dispatch-entry, .tip-box'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ==========================================
    // WANTED POSTER — REWARD FLASH ON HOVER
    // ==========================================

    const posterRewards = document.querySelectorAll('.poster-reward');

    posterRewards.forEach(reward => {
        reward.addEventListener('mouseenter', () => {
            reward.style.transform = 'scale(1.1)';
            reward.style.transition = 'transform 0.3s ease';
        });

        reward.addEventListener('mouseleave', () => {
            reward.style.transform = 'scale(1)';
        });
    });

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const sections = ['posters', 'rewards', 'outlaws', 'dispatch'];
            const currentSection = sections.findIndex(id => {
                const el = document.getElementById(id);
                const rect = el.getBoundingClientRect();
                return rect.top >= -100 && rect.top <= 100;
            });

            if (currentSection < sections.length - 1) {
                document.getElementById(sections[currentSection + 1])?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const sections = ['posters', 'rewards', 'outlaws', 'dispatch'];
            const currentSection = sections.findIndex(id => {
                const el = document.getElementById(id);
                const rect = el.getBoundingClientRect();
                return rect.top >= -100 && rect.top <= 100;
            });

            if (currentSection > 0) {
                document.getElementById(sections[currentSection - 1])?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });

    // ==========================================
    // CONSOLE EASTER EGG
    // ==========================================

    console.log('%c⚠ WANTED ⚠', 'font-size: 24px; color: #8B0000; font-family: serif;');
    console.log('%cDusty Gulch Sheriff\'s Office — Unauthorized access is punishable by hanging.', 'font-size: 12px; color: #D4A017; font-family: monospace;');
    console.log('%cYou have been warned.', 'font-size: 10px; color: #5C3D1A;');

});
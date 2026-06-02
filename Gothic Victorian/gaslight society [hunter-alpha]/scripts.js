/* ============================================================
   THE OBSIDIAN CONCLAVE — Members Directory
   JavaScript — Bringing the Gaslit Darkness to Life
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initEnvelopeSeal();
    initGrandfatherClock();
    initNavigation();
    initMemberFilters();
    initHierarchyInteractions();
    initGaslightEffects();
    initScrollAnimations();
});

/* ============================================================
   ENVELOPE SEAL — Entry Mechanism
   ============================================================ */
function initEnvelopeSeal() {
    const overlay = document.getElementById('envelope-overlay');
    const seal = document.getElementById('wax-seal');
    const mainContent = document.getElementById('main-content');

    if (!seal || !overlay || !mainContent) return;

    // Audio context for crackling sound
    let audioCtx = null;

    function createCrackSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Create a noise burst for crack effect
        const duration = 0.3;
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / audioCtx.sampleRate;
            const envelope = Math.exp(-t * 15);
            data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;

        const gain = audioCtx.createGain();
        gain.gain.value = 0.4;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        source.start();
    }

    function createRevealSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const duration = 1.5;
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }

    seal.addEventListener('click', () => {
        // Play crack sound
        createCrackSound();

        // Animate seal breaking
        seal.classList.add('broken');

        // Play reveal sound after crack
        setTimeout(() => {
            createRevealSound();
        }, 200);

        // Open envelope
        setTimeout(() => {
            overlay.classList.add('opened');
        }, 400);

        // Show main content
        setTimeout(() => {
            mainContent.classList.add('visible');
            // Trigger card animations
            animateMemberCards();
        }, 800);

        // Remove overlay from DOM after animation
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000);
    });

    // Add hover sound effect
    seal.addEventListener('mouseenter', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 80;
        
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    });
}

/* ============================================================
   GRANDFATHER CLOCK — Ticking Timepiece
   ============================================================ */
function initGrandfatherClock() {
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    const pendulum = document.getElementById('pendulum');
    const tickIndicator = document.getElementById('tick-indicator');

    if (!hourHand || !minuteHand || !secondHand) return;

    let audioCtx = null;
    let lastSecond = -1;
    let tickState = true;

    function createTickSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const duration = 0.05;
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = tickState ? 800 : 600;

        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);

        tickState = !tickState;
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate smooth rotation angles
        const secondAngle = (seconds + milliseconds / 1000) * 6;
        const minuteAngle = (minutes + seconds / 60) * 6;
        const hourAngle = (hours + minutes / 60) * 30;

        // Apply rotations
        secondHand.style.transform = `rotate(${secondAngle}deg)`;
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        hourHand.style.transform = `rotate(${hourAngle}deg)`;

        // Tick sound and indicator
        if (seconds !== lastSecond) {
            lastSecond = seconds;

            // Visual tick indicator
            if (tickIndicator) {
                tickIndicator.textContent = tickState ? 'tick' : 'tock';
                tickIndicator.classList.add('tick');
                setTimeout(() => {
                    tickIndicator.classList.remove('tick');
                }, 150);
            }

            // Play tick sound (only if envelope is opened)
            const overlay = document.getElementById('envelope-overlay');
            if (overlay && overlay.classList.contains('opened')) {
                createTickSound();
            }

            // Sync pendulum with seconds
            if (pendulum) {
                pendulum.style.animationDuration = '2s';
            }
        }

        requestAnimationFrame(updateClock);
    }

    // Start the clock
    updateClock();

    // Pendulum sound effect (subtle)
    if (pendulum) {
        pendulum.addEventListener('animationiteration', () => {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            // Very subtle creak sound
            const oscillator = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 40;

            gain.gain.setValueAtTime(0.008, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

            oscillator.connect(gain);
            gain.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        });
    }
}

/* ============================================================
   NAVIGATION — Section Switching
   ============================================================ */
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    if (!tabs.length || !sections.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.dataset.section;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `section-${targetSection}`) {
                    section.classList.add('active');

                    // Trigger animations for newly visible section
                    if (targetSection === 'directory') {
                        animateMemberCards();
                    }
                }
            });

            // Play click sound
            playClickSound();
        });
    });
}

/* ============================================================
   MEMBER FILTERS — Circle-based Filtering
   ============================================================ */
function initMemberFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const memberCards = document.querySelectorAll('.member-card');

    if (!filterBtns.length || !memberCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards with animation
            memberCards.forEach((card, index) => {
                const cardCircle = card.dataset.circle;
                
                if (filter === 'all' || cardCircle === filter) {
                    // Show card with staggered delay
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });

            playClickSound();
        });
    });
}

/* ============================================================
   HIERARCHY INTERACTIONS — Circle Details
   ============================================================ */
function initHierarchyInteractions() {
    const circleTiers = document.querySelectorAll('.circle-tier');

    if (!circleTiers.length) return;

    const circleDetails = {
        '1': {
            members: 1,
            title: 'The Nucleus',
            detail: 'Only the Grand Hierophant dwells here. The ultimate authority of the Conclave, keeper of the deepest mysteries.'
        },
        '2': {
            members: 2,
            title: 'The Adytum',
            detail: 'The innermost sanctum. Those who have gazed into the Obsidian Mirror and returned changed.'
        },
        '3': {
            members: 2,
            title: 'The Inner Sanctum',
            detail: 'Masters of the Hidden Arts. They guard the Forbidden Library and maintain the ward-spells.'
        },
        '4': {
            members: 3,
            title: 'The Sanctum',
            detail: 'Adepts and Seers. They have proven their worth through the Trial of Will.'
        },
        '5': {
            members: 3,
            title: 'The Antechamber',
            detail: 'Practitioners of the Craft. They may attend most rituals and access the common library.'
        },
        '6': {
            members: 2,
            title: 'The Vestibule',
            detail: 'Initiates of the First Degree. Newly admitted, still proving their dedication.'
        },
        '7': {
            members: 1,
            title: 'The Penumbra',
            detail: 'Aspirants and Acolytes. Under observation, not yet fully trusted with the mysteries.'
        }
    };

    circleTiers.forEach(tier => {
        const circleNum = tier.dataset.circle;
        const detail = circleDetails[circleNum];

        tier.addEventListener('mouseenter', () => {
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'circle-tooltip';
            tooltip.innerHTML = `
                <strong>${detail.title}</strong><br>
                <span>${detail.members} member${detail.members > 1 ? 's' : ''}</span><br>
                <em>${detail.detail}</em>
            `;
            tooltip.style.cssText = `
                position: absolute;
                left: 105%;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(26, 18, 9, 0.95);
                border: 1px solid var(--ornament-gold);
                padding: 12px 16px;
                max-width: 280px;
                font-family: var(--font-body);
                font-size: 0.85rem;
                color: var(--text-cream);
                z-index: 100;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            tier.style.position = 'relative';
            tier.appendChild(tooltip);

            // Animate in
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
            });
        });

        tier.addEventListener('mouseleave', () => {
            const tooltip = tier.querySelector('.circle-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }
        });
    });
}

/* ============================================================
   GASLIGHT EFFECTS — Atmospheric Animations
   ============================================================ */
function initGaslightEffects() {
    // Random gaslight flicker intensity
    const overlay = document.querySelector('.gaslight-overlay');
    if (!overlay) return;

    function randomFlicker() {
        const intensity = 0.85 + Math.random() * 0.15;
        overlay.style.opacity = intensity;

        const nextFlicker = 100 + Math.random() * 400;
        setTimeout(randomFlicker, nextFlicker);
    }

    // Start after envelope opens
    const envelopeOverlay = document.getElementById('envelope-overlay');
    if (envelopeOverlay) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('opened')) {
                    setTimeout(randomFlicker, 1000);
                    observer.disconnect();
                }
            });
        });

        observer.observe(envelopeOverlay, { attributes: true, attributeFilter: ['class'] });
    }

    // Add ambient particle effects
    createAmbientParticles();
}

function createAmbientParticles() {
    const container = document.createElement('div');
    container.className = 'ambient-particles';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 997;
        overflow: hidden;
    `;
    document.body.appendChild(container);

    function createParticle() {
        const particle = document.createElement('div');
        const size = 1 + Math.random() * 3;
        const startX = Math.random() * window.innerWidth;
        const duration = 8000 + Math.random() * 12000;
        const delay = Math.random() * 5000;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(232, 199, 123, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            left: ${startX}px;
            bottom: -10px;
            opacity: 0;
            animation: float-particle ${duration}ms ease-in-out ${delay}ms infinite;
        `;

        container.appendChild(particle);

        // Remove after several cycles
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, duration * 3 + delay);
    }

    // Create initial particles
    for (let i = 0; i < 15; i++) {
        createParticle();
    }

    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.4;
            }
            50% {
                transform: translateY(-50vh) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px);
                opacity: 0.2;
            }
            90% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${40 + Math.random() * 60}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================================
   SCROLL ANIMATIONS — Reveal on Scroll
   ============================================================ */
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.seance-event, .codex-entry, .circle-tier'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add revealed state styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ============================================================
   MEMBER CARDS — Staggered Animation
   ============================================================ */
function animateMemberCards() {
    const cards = document.querySelectorAll('.member-card:not(.hidden)');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 120);
    });
}

/* ============================================================
   UTILITY — Sound Effects
   ============================================================ */
function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = 500;

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // Audio not supported
    }
}

/* ============================================================
   MEMBER CARD HOVER EFFECTS
   ============================================================ */
document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.member-card');
    if (card) {
        // Add subtle glow effect on hover
        const portrait = card.querySelector('.daguerreotype-portrait');
        if (portrait) {
            portrait.style.filter = 'brightness(1.1) contrast(1.05)';
        }
    }
});

document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.member-card');
    if (card) {
        const portrait = card.querySelector('.daguerreotype-portrait');
        if (portrait) {
            portrait.style.filter = '';
        }
    }
});

/* ============================================================
   SEAL HOVER EFFECTS ON MEMBER CARDS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const seals = document.querySelectorAll('.seal');
    
    seals.forEach(seal => {
        seal.addEventListener('mouseenter', () => {
            const title = seal.getAttribute('title');
            if (title) {
                // Create tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'seal-tooltip';
                tooltip.textContent = title;
                tooltip.style.cssText = `
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(26, 18, 9, 0.95);
                    border: 1px solid var(--ornament-gold);
                    padding: 6px 12px;
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    color: var(--text-cream);
                    white-space: nowrap;
                    z-index: 100;
                    letter-spacing: 0.05em;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                    margin-bottom: 8px;
                `;
                
                seal.style.position = 'relative';
                seal.appendChild(tooltip);
            }
        });

        seal.addEventListener('mouseleave', () => {
            const tooltip = seal.querySelector('.seal-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
});

/* ============================================================
   KEYBOARD NAVIGATION
   ============================================================ */
document.addEventListener('keydown', (e) => {
    // Press Enter or Space on envelope seal
    if (e.key === 'Enter' || e.key === ' ') {
        const seal = document.getElementById('wax-seal');
        const overlay = document.getElementById('envelope-overlay');
        
        if (seal && overlay && !overlay.classList.contains('opened')) {
            e.preventDefault();
            seal.click();
        }
    }

    // Number keys for tab navigation
    const tabMap = {
        '1': 'hierarchy',
        '2': 'directory',
        '3': 'seances',
        '4': 'codex'
    };

    if (tabMap[e.key]) {
        const tab = document.querySelector(`[data-section="${tabMap[e.key]}"]`);
        if (tab) {
            tab.click();
        }
    }
});

/* ============================================================
   PARALLAX EFFECT ON SCROLL
   ============================================================ */
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const emblem = document.querySelector('.society-emblem');
            
            if (emblem) {
                emblem.style.transform = `translateY(${scrolled * 0.1}px)`;
            }

            // Subtle parallax on gaslight overlay
            const overlay = document.querySelector('.gaslight-overlay');
            if (overlay) {
                overlay.style.transform = `translateY(${scrolled * 0.05}px)`;
            }

            ticking = false;
        });

        ticking = true;
    }
});

/* ============================================================
   DYNAMIC YEAR DISPLAY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Update any dynamic date displays
    const yearElements = document.querySelectorAll('.event-year');
    // Keep the Victorian era dates as they are for authenticity
});
// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderFill = document.getElementById('preloaderFill');

    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
    }, 2200);
});

// ===== PARTICLE LAYER =====
function createParticles() {
    const container = document.getElementById('particles');
    const count = 40;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (8 + Math.random() * 12) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (1 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;

        // Randomize color between gold and blood
        if (Math.random() > 0.5) {
            particle.style.background = '#c9a84c';
        } else {
            particle.style.background = '#8b1a1a';
        }

        container.appendChild(particle);
    }
}
createParticles();

// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
        nav.style.padding = '0.8rem 2rem';
        nav.style.background = 'rgba(10,10,11,0.9)';
    } else {
        nav.style.padding = '1.2rem 2rem';
        nav.style.background = 'linear-gradient(180deg, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0) 100%)';
    }

    lastScroll = currentScroll;
});

// ===== SUFFERING METER ANIMATION =====
function animateSufferingMeter() {
    const fill = document.getElementById('sufferingFill');
    const value = document.getElementById('sufferingValue');

    // Animate fill width
    setTimeout(() => {
        fill.style.width = '94.7%';
    }, 500);

    // Animate value counter
    const target = 94.7;
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (eased * target).toFixed(1);

        value.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            value.textContent = target.toFixed(1);
        }
    }

    requestAnimationFrame(update);
}

// ===== CURSE COUNTER ANIMATIONS =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter-value');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== SUFFERING STATS FLICKER =====
function flickerStats() {
    const statValues = document.querySelectorAll('.stat-value');

    // Occasionally update "deaths today" with random increment
    setInterval(() => {
        const deathsEl = document.getElementById('deathsToday');
        if (deathsEl) {
            const current = parseInt(deathsEl.textContent.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 5) + 1;
            deathsEl.textContent = (current + increment).toLocaleString();
        }
    }, 3000);

    // Souls claimed slowly increment
    setInterval(() => {
        const soulsEl = document.getElementById('soulsClaimed');
        if (soulsEl) {
            const current = parseInt(soulsEl.textContent.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 10) + 1;
            soulsEl.textContent = (current + increment).toLocaleString();
        }
    }, 5000);
}

// ===== SCROLL REVEAL =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Trigger section-specific animations
            if (entry.target.id === 'suffering') {
                animateSufferingMeter();
            }
            if (entry.target.id === 'curses') {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section, .curse-grid, .curse-card, .ritual-entry, .artifact-item, .landscape-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Re-observe cards individually for stagger
document.querySelectorAll('.curse-card, .landscape-card, .ritual-entry, .artifact-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(card);
});

// ===== NAV LINK ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== OMEN RANDOM EVENTS =====
const omenEl = document.getElementById('navOmen');
const ominousMessages = [
    '⚷',
    '☠',
    '⛧',
    '⚰',
    '✦',
    '☽',
    '⚱',
    '✧'
];

if (omenEl) {
    setInterval(() => {
        const msg = ominousMessages[Math.floor(Math.random() * ominousMessages.length)];
        omenEl.textContent = msg;
        omenEl.style.color = Math.random() > 0.5 ? '#c9a84c' : '#8b1a1a';
    }, 4000);
}

// ===== SUFFERING INDEX REAL-TIME DECAY =====
// Slowly increase the suffering value over time
let sufferingLevel = 94.7;
const sufferingFill = document.getElementById('sufferingFill');
const sufferingValue = document.getElementById('sufferingValue');

if (sufferingFill && sufferingValue) {
    setInterval(() => {
        sufferingLevel = Math.min(100, sufferingLevel + 0.01);
        sufferingFill.style.width = sufferingLevel + '%';
        sufferingValue.textContent = sufferingLevel.toFixed(1);
    }, 5000);
}

// ===== RITUAL STATUS RANDOMIZER =====
// Some rituals "complete" over time
const ritualStatuses = document.querySelectorAll('.ritual-status');
setInterval(() => {
    ritualStatuses.forEach(status => {
        if (Math.random() > 0.95) {
            status.style.transform = 'scale(1.05)';
            setTimeout(() => {
                status.style.transform = 'scale(1)';
            }, 300);
        }
    });
}, 8000);

// ===== AMBIENT SOUND VISUALIZATION (Visual Only - No Audio) =====
// Subtle pulsing of the hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    setInterval(() => {
        heroTitle.style.textShadow = Math.random() > 0.5
            ? '0 0 40px rgba(201, 168, 76, 0.15), 0 0 80px rgba(139, 26, 26, 0.1)'
            : 'none';
    }, 4000);
}

// ===== CURSOR EFFECT =====
// Custom cursor trail for desktop
if (window.matchMedia('(pointer: fine)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // Enlarge on hoverable elements
    document.querySelectorAll('a, button, .curse-card, .landscape-card, .artifact-item, .nav-link').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.width = '20px';
            cursorGlow.style.height = '20px';
        });
    });
}

// ===== DARKENING OVER TIME =====
// Subtle darkening of the page as you scroll deeper
const grainOverlay = document.querySelector('.grain-overlay');
if (grainOverlay) {
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
        grainOverlay.style.opacity = 0.035 + scrollPercent * 0.03;
    });
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to let preloader finish
    setTimeout(() => {
        flickerStats();
    }, 2500);
});
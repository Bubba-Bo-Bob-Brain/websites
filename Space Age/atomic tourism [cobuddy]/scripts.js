/* ============================================
   STARFIELD TRAVEL CO. — Interactive Scripts
   ============================================ */

// ---------- STARFIELD CANVAS ----------
const starfieldCanvas = document.getElementById('starfield');
const starCtx = starfieldCanvas.getContext('2d');

function resizeStarfield() {
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
}

resizeStarfield();
window.addEventListener('resize', resizeStarfield);

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * starfieldCanvas.width;
        this.y = Math.random() * starfieldCanvas.height;
        this.size = Math.random() * 1.8 + 0.2;
        this.speed = Math.random() * 0.15 + 0.02;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDirection = 1;
        this.color = Math.random() > 0.7 ? '#e9c46a' : (Math.random() > 0.5 ? '#2a9d8f' : '#ffffff');
    }

    update() {
        this.y += this.speed;
        this.twinkleDirection += this.twinkleSpeed;
        this.opacity += Math.sin(this.twinkleDirection) * 0.008;

        if (this.y > starfieldCanvas.height + 10) {
            this.y = -10;
            this.x = Math.random() * starfieldCanvas.width;
        }

        if (this.opacity > 1) this.opacity = 1;
        if (this.opacity < 0.1) this.opacity = 0.1;
    }

    draw() {
        starCtx.beginPath();
        starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        starCtx.fillStyle = this.color;
        starCtx.globalAlpha = this.opacity;
        starCtx.fill();
        starCtx.globalAlpha = 1;
    }
}

const stars = Array.from({ length: 200 }, () => new Star());

function animateStarfield() {
    starCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStarfield);
}

animateStarfield();

// ---------- SCROLL REVEAL (Intersection Observer) ----------
const revealElements = document.querySelectorAll(
    '.destination-card, .schedule-row, .testimonial'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay
                ? parseInt(entry.target.dataset.delay)
                : 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ---------- HERO TITLE REVEAL ANIMATION ----------
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroCTA = document.querySelector('.hero-cta');
const heroScrollHint = document.querySelector('.hero-scroll-hint');

function revealHero() {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(20px)';
    heroCTA.style.opacity = '0';
    heroScrollHint.style.opacity = '0';

    setTimeout(() => {
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 200);

    setTimeout(() => {
        heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
    }, 600);

    setTimeout(() => {
        heroCTA.style.transition = 'opacity 0.8s ease';
        heroCTA.style.opacity = '1';
    }, 900);

    setTimeout(() => {
        heroScrollHint.style.transition = 'opacity 1s ease';
        heroScrollHint.style.opacity = '0.5';
    }, 1200);
}

// Trigger on load
window.addEventListener('load', () => {
    revealHero();
});

// ---------- PARALLAX PANORAMA ----------
const panoramaSection = document.querySelector('.panorama');
const panoPlanets = document.querySelectorAll('.pano-planet');

window.addEventListener('scroll', () => {
    const rect = panoramaSection.getBoundingClientRect();
    const scrollProgress = rect.top / window.innerHeight;

    panoPlanets.forEach((planet, index) => {
        const speed = (index + 1) * 30;
        const yOffset = scrollProgress * speed;
        planet.style.transform = `translateY(${yOffset}px)`;
    });
});

// ---------- PARALLAX HERO MASCOT ----------
const heroMascot = document.querySelector('.hero-mascot');

window.addEventListener('scroll', () => {
    if (!heroMascot) return;
    const rect = heroMascot.getBoundingClientRect();
    const scrollProgress = rect.top / window.innerHeight;
    const rotate = scrollProgress * 10;
    heroMascot.style.transform = `translateY(${scrollProgress * 50}px) rotate(${rotate}deg)`;
});

// ---------- NAVIGATION SHRINK ON SCROLL ----------
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.padding = '0.5rem 2rem';
        nav.style.boxShadow = '0 2px 20px rgba(42, 157, 143, 0.1)';
    } else {
        nav.style.padding = '1rem 2rem';
        nav.style.boxShadow = 'none';
    }
});

// ---------- SCHEDULE BOARD ROW HIGHLIGHT CYCLE ----------
const scheduleRows = document.querySelectorAll('.schedule-row');
let currentHighlight = 0;

function cycleHighlight() {
    scheduleRows.forEach((row, index) => {
        if (index === currentHighlight) {
            row.style.background = 'rgba(233, 196, 106, 0.08)';
        } else {
            row.style.background = '';
        }
    });
    currentHighlight = (currentHighlight + 1) % scheduleRows.length;
}

setInterval(cycleHighlight, 3000);

// ---------- FORM SUBMISSION ----------
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'TRANSMITTING...';
    submitBtn.style.background = '#2a9d8f';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = '✓ RESERVATION CONFIRMED!';
        submitBtn.style.background = '#264653';
        submitBtn.style.color = '#e9c46a';

        // Create celebration particles
        createCelebrationParticles(submitBtn);

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.disabled = false;
            bookingForm.reset();
        }, 3000);
    }, 1500);
});

function createCelebrationParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.background = ['#e9c46a', '#e76f51', '#2a9d8f', '#f4a261'][Math.floor(Math.random() * 4)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        particle.style.transition = 'none';
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 80 + Math.random() * 60;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        requestAnimationFrame(() => {
            particle.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease';
            particle.style.transform = `translate(${dx}px, ${dy}px)`;
            particle.style.opacity = '0';
        });

        setTimeout(() => particle.remove(), 1000);
    }
}

// ---------- SMOOTH SCROLL FOR NAV LINKS ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ---------- CARD HOVER TILT EFFECT ----------
const destinationCards = document.querySelectorAll('.destination-card');

destinationCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ---------- SCHEDULE TICKING CLOCK ----------
const statusBoarding = document.querySelectorAll('.status-boarding');

function updateBoardingStatus() {
    statusBoarding.forEach(status => {
        const now = new Date();
        const seconds = now.getSeconds();
        if (seconds % 2 === 0) {
            status.style.opacity = '1';
        } else {
            status.style.opacity = '0.4';
        }
    });
}

setInterval(updateBoardingStatus, 1000);

// ---------- CURSOR CUSTOMIZATION (desktop only) ----------
if (window.matchMedia('(pointer: fine)').matches) {
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e76f51;
        pointer-events: none;
        z-index: 10001;
        transition: transform 0.15s ease;
        mix-blend-mode: difference;
    `;

    const cursorRing = document.createElement('div');
    cursorRing.style.cssText = `
        position: fixed;
        width: 32px;
        height: 32px;
        border: 1.5px solid #2a9d8f;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease;
        transform: translate(-50%, -50%);
    `;

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX - 4 + 'px';
        cursorDot.style.top = mouseY - 4 + 'px';
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .card-btn, input, select, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '48px';
            cursorRing.style.height = '48px';
            cursorRing.style.borderColor = '#e76f51';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '32px';
            cursorRing.style.height = '32px';
            cursorRing.style.borderColor = '#2a9d8f';
        });
    });
}

// ---------- TESTIMONIAL ROTATION HIGHLIGHT ----------
const testimonials = document.querySelectorAll('.testimonial');

testimonials.forEach((testimonial, index) => {
    testimonial.addEventListener('mouseenter', () => {
        testimonials.forEach((t, i) => {
            if (i === index) {
                t.style.borderColor = '#e76f51';
                t.style.boxShadow = '0 15px 40px rgba(231, 111, 81, 0.15)';
            } else {
                t.style.borderColor = '';
                t.style.boxShadow = '';
            }
        });
    });
});

// ---------- SCROLL PROGRESS BAR ----------
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #e76f51, #e9c46a, #2a9d8f);
    z-index: 10001;
    transition: width 0.1s linear;
`;

document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ---------- LAUNCH SEQUENCE ON HERO CLICK ----------
const heroContent = document.querySelector('.hero-content');

heroContent.addEventListener('dblclick', () => {
    heroContent.style.animation = 'none';
    heroContent.style.transform = 'scale(1.02)';
    heroContent.style.transition = 'transform 0.3s ease';

    setTimeout(() => {
        heroContent.style.transform = 'scale(1)';
    }, 300);
});

// ---------- CONSOLE EASTER EGG ----------
console.log('%c✦ STARFIELD TRAVEL CO. ✦', 'color: #e9c46a; font-size: 20px; font-weight: bold; letter-spacing: 4px;');
console.log('%cMaking The Cosmos A Family Affair Since 1962', 'color: #2a9d8f; font-size: 12px; font-style: italic;');
console.log('%c🚀 Fair winds and following stars! 🚀', 'color: #e76f51; font-size: 14px;');
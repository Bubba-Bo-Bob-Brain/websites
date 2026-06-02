// ===== Lantern Glow Follows Cursor =====
const lanternGlow = document.getElementById('lantern-glow');

document.addEventListener('mousemove', (e) => {
    lanternGlow.style.left = e.clientX + 'px';
    lanternGlow.style.top = e.clientY + 'px';
});

// ===== Incense Smoke Particle System =====
const smokeCanvas = document.getElementById('smoke-canvas');
const smokeCtx = smokeCanvas.getContext('2d');

function resizeSmokeCanvas() {
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;
}
resizeSmokeCanvas();
window.addEventListener('resize', resizeSmokeCanvas);

class SmokeParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * smokeCanvas.width;
        this.y = smokeCanvas.height + 10;
        this.size = Math.random() * 60 + 20;
        this.maxSize = this.size * 3;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.06 + 0.02;
        this.fadeRate = Math.random() * 0.002 + 0.001;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.wobbleAmount = Math.random() * 0.5 + 0.2;
        this.life = 1;
        this.wobbleOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount;
        this.size += 0.15;
        this.life -= this.fadeRate;

        if (this.life <= 0 || this.y < -50) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(180, 170, 150, 1)');
        gradient.addColorStop(0.4, 'rgba(180, 170, 150, 0.6)');
        gradient.addColorStop(1, 'rgba(180, 170, 150, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const particles = [];
for (let i = 0; i < 40; i++) {
    const p = new SmokeParticle();
    p.y = Math.random() * smokeCanvas.height;
    particles.push(p);
}

function animateSmoke(time) {
    smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

    particles.forEach(p => {
        p.update(time);
        p.draw(smokeCtx);
    });

    requestAnimationFrame(animateSmoke);
}
requestAnimationFrame(animateSmoke);

// ===== Rub to Reveal on Product Cards =====
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    const overlay = card.querySelector('.rub-overlay');
    const revealContent = card.querySelector('.reveal-content');
    let revealed = false;
    let rubCount = 0;
    const requiredRubs = 3;

    card.addEventListener('click', () => {
        if (revealed) return;

        rubCount++;

        if (rubCount >= requiredRubs) {
            overlay.classList.add('hidden');
            revealContent.classList.add('visible');
            revealed = true;

            // Add a subtle sparkle burst
            createSparkleBurst(card);
        } else {
            // Animate the lamp icon on each rub
            const lampIcon = overlay.querySelector('.lamp-icon');
            lampIcon.style.transform = 'scale(1.3) rotate(15deg)';
            lampIcon.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                lampIcon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }
    });
});

// ===== Sparkle Burst Effect =====
function createSparkleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = centerX + 'px';
        sparkle.style.top = centerY + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.borderRadius = '50%';
        sparkle.style.background = `hsl(${40 + Math.random() * 20}, 80%, ${60 + Math.random() * 30}%)`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '100';
        sparkle.style.boxShadow = `0 0 6px hsl(${40 + Math.random() * 20}, 80%, 70%)`;
        document.body.appendChild(sparkle);

        const angle = (Math.PI * 2 / 12) * i;
        const velocity = 80 + Math.random() * 60;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        sparkle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 400,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
            fill: 'forwards'
        }).onfinish = () => sparkle.remove();
    }
}

// ===== Scroll-Based Fade-In for Product Categories =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.product-category').forEach(cat => {
    categoryObserver.observe(cat);
});

// ===== Enter Button Scroll =====
const enterBtn = document.querySelector('.enter-btn');
if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        document.querySelector('.products-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// ===== Floating Stars Background =====
function createFloatingStars() {
    const heroStars = document.querySelector('.hero-stars');
    if (!heroStars) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.style.position = 'fixed';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.width = (Math.random() * 2 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.borderRadius = '50%';
        star.style.background = `hsl(${40 + Math.random() * 20}, 70%, ${60 + Math.random() * 30}%)`;
        star.style.boxShadow = `0 0 ${Math.random() * 4 + 2}px hsl(${40 + Math.random() * 20}, 70%, 70%)`;
        star.style.opacity = Math.random() * 0.5 + 0.1;
        star.style.pointerEvents = 'none';
        star.style.zIndex = '1';
        star.style.animation = `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        document.body.appendChild(star);
    }
}
createFloatingStars();

// ===== Nav Link Active State Based on Scroll =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.product-category');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.borderColor = 'rgba(196, 160, 53, 0.3)';
        link.style.color = 'var(--gold-warm)';
        if (link.getAttribute('href') === '#' + current) {
            link.style.borderColor = 'var(--gold-bright)';
            link.style.color = 'var(--gold-bright)';
            link.style.boxShadow = '0 0 15px rgba(232, 200, 74, 0.15)';
        }
    });
});

// ===== Ambient Lantern Flicker on Header =====
function flickerLantern() {
    const header = document.querySelector('.bazaar-header');
    if (!header) return;

    setInterval(() => {
        const intensity = 0.8 + Math.random() * 0.2;
        header.style.filter = `brightness(${intensity})`;
    }, 2000 + Math.random() * 1000);
}
flickerLantern();

// ===== Product Card Tilt Effect =====
productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Lore Cards Parallax =====
const loreSection = document.querySelector('.lore-section');
if (loreSection) {
    loreSection.addEventListener('mousemove', (e) => {
        const cards = loreSection.querySelectorAll('.lore-card');
        const rect = loreSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const relX = (x / rect.width - 0.5) * 10;

        cards.forEach((card, i) => {
            const factor = (i - 1) * 3;
            card.style.transform = `translateX(${relX * factor}px)`;
        });
    });
}

// ===== Custom Cursor Trails (subtle) =====
let trailParticles = [];
const maxTrail = 8;

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.3) return; // Performance: only on some moves

    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '3px';
    trail.style.height = '3px';
    trail.style.borderRadius = '50%';
    trail.style.background = 'rgba(232, 200, 74, 0.3)';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '1';
    trail.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    document.body.appendChild(trail);

    trailParticles.push(trail);

    if (trailParticles.length > maxTrail) {
        const old = trailParticles.shift();
        old.style.opacity = '0';
        old.style.transform = 'scale(0)';
        setTimeout(() => old.remove(), 800);
    }

    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0)';
        setTimeout(() => trail.remove(), 800);
    }, 100);
});

// ===== Night Sky Gradient Shift =====
let hueShift = 0;
function shiftNightSky() {
    hueShift += 0.02;
    const root = document.documentElement;
    const nightHue = 230 + Math.sin(hueShift) * 10;
    root.style.setProperty('--night-hue', nightHue);
    requestAnimationFrame(shiftNightSky);
}
shiftNightSky();

// ===== Atmospheric Pulsing Orbs =====
function createOrbs() {
    const orbCount = 5;
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'atmosphere-orb';
        orb.style.position = 'fixed';
        orb.style.width = (150 + Math.random() * 200) + 'px';
        orb.style.height = orb.style.width;
        orb.style.borderRadius = '50%';
        orb.style.left = Math.random() * 100 + 'vw';
        orb.style.top = Math.random() * 100 + 'vh';
        orb.style.background = `radial-gradient(circle, rgba(${196 + Math.random() * 40}, ${160 + Math.random() * 40}, ${53 + Math.random() * 20}, 0.03) 0%, transparent 70%)`;
        orb.style.pointerEvents = 'none';
        orb.style.zIndex = '0';
        orb.style.filter = 'blur(40px)';
        orb.style.animation = `orbFloat ${15 + Math.random() * 10}s ease-in-out infinite`;
        orb.style.animationDelay = `${Math.random() * 10}s`;
        document.body.appendChild(orb);
    }
}
createOrbs();

// Add orb animation keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes orbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(30px, -20px) scale(1.1); opacity: 0.5; }
        50% { transform: translate(-20px, 30px) scale(0.95); opacity: 0.4; }
        75% { transform: translate(20px, 20px) scale(1.05); opacity: 0.5; }
    }
`;
document.head.appendChild(styleSheet);

// ===== Console Easter Egg =====
console.log('%c✦ The Bazaar Awaits ✦', 'color: #E8C84A; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(232,200,74,0.5);');
console.log('%c"Rub the lamp three times and the truth shall be revealed..."', 'color: #C4A035; font-size: 12px; font-style: italic;');
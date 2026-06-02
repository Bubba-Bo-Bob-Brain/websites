// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('custom-cursor');
const cursorCore = cursor.querySelector('.cursor-core');
const cursorRing = cursor.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    cursorRing.style.transform = 'translate(-50%, -50%)';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== SPARKLE TRAIL ON MOUSE MOVE =====
const sparkleCanvas = document.getElementById('sparkle-canvas');
const sparkleCtx = sparkleCanvas.getContext('2d');
sparkleCanvas.width = window.innerWidth;
sparkleCanvas.height = window.innerHeight;

class Sparkle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 - 1;
        this.color = ['#FFB6C1', '#DDA0DD', '#87CEEB', '#FFD700', '#FF69B4', '#B5EAD7'][Math.floor(Math.random() * 6)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.shape = Math.random() > 0.5 ? 'star' : 'circle';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
        this.vy += 0.02;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;

        if (this.shape === 'star') {
            this.drawStar(ctx, 0, 0, 5, this.size, this.size * 0.4);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
}

let sparkles = [];
let lastSparkleTime = 0;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime > 30) {
        for (let i = 0; i < 2; i++) {
            sparkles.push(new Sparkle(e.clientX + (Math.random() - 0.5) * 20, e.clientY + (Math.random() - 0.5) * 20));
        }
        lastSparkleTime = now;
    }
});

function animateSparkles() {
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    sparkles = sparkles.filter(s => s.life > 0);
    sparkles.forEach(s => {
        s.update();
        s.draw(sparkleCtx);
    });
    requestAnimationFrame(animateSparkles);
}
animateSparkles();

window.addEventListener('resize', () => {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
});

// ===== FLOATING PARTICLES =====
const particlesContainer = document.getElementById('particles-container');

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const types = ['❤', '✦', '✧', '⋆', '♡', '★', '～', '◇', '○', '△'];
    particle.textContent = types[Math.floor(Math.random() * types.length)];

    const size = Math.random() * 16 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;

    particle.style.cssText = `
        left: ${left}%;
        font-size: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        color: ${['#FFB6C1', '#DDA0DD', '#87CEEB', '#FFD700', '#FF69B4', '#B5EAD7'][Math.floor(Math.random() * 6)]};
    `;

    particlesContainer.appendChild(particle);

    setTimeout(() => particle.remove(), (duration + delay) * 1000);
}

// Generate initial particles
for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, Math.random() * 3000);
}
setInterval(createParticle, 2000);

// ===== FLOATING HEARTS ON CLICK =====
document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.textContent = ['❤', '♡', '💕', '✦', '✧', '★', '🌸', '💫'][Math.floor(Math.random() * 8)];
            heart.style.left = (e.clientX + (Math.random() - 0.5) * 60) + 'px';
            heart.style.top = (e.clientY + (Math.random() - 0.5) * 60) + 'px';
            heart.style.fontSize = (Math.random() * 14 + 12) + 'px';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, i * 80);
    }
});

// ===== MASCOT INTERACTIONS =====
const mascot = document.getElementById('mascot');
const mascotSpeech = document.getElementById('mascot-speech');

const mascotMessages = [
    "✧ Welcome to Moe Paradise! ✧",
    "✦ Don't forget to try the Gacha! ✦",
    "♡ You're such a good visitor~ ♡",
    "✧ Check out the manga section! ✧",
    "★ I believe in you! ★",
    "～ Moe moe kyun! ～",
    "✦ Have you watched any good anime lately? ✦",
    "♡ You make my heart sparkle~ ♡",
    "✧ Keep exploring, friend! ✧",
    "★ Every click is a new adventure! ★",
    "～ Boketto~ (daydreaming) ～",
    "✦ The cutest site on the internet! ✦",
    "♡ Mochi is your best guide~ ♡",
    "✧ Sparkle sparkle~ ✧",
    "★ Pocky break? ★"
];

let messageIndex = 0;

mascot.addEventListener('click', () => {
    messageIndex = (messageIndex + 1) % mascotMessages.length;
    mascotSpeech.style.animation = 'none';
    mascotSpeech.offsetHeight;
    mascotSpeech.style.animation = 'speechFloat 3s ease-in-out infinite';
    mascotSpeech.querySelector('p').textContent = mascotMessages[messageIndex];

    // Extra sparkle burst on mascot click
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('floating-heart');
        sparkle.textContent = ['✦', '✧', '★', '⋆', '💕', '🌸'][Math.floor(Math.random() * 6)];
        sparkle.style.left = (mascot.getBoundingClientRect().left + Math.random() * 80) + 'px';
        sparkle.style.top = (mascot.getBoundingClientRect().top + Math.random() * 80) + 'px';
        sparkle.style.fontSize = (Math.random() * 12 + 10) + 'px';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3000);
    }
});

// Mascot follows cursor subtly
document.addEventListener('mousemove', (e) => {
    const mascotRect = mascot.getBoundingClientRect();
    const mascotCenterX = mascotRect.left + mascotRect.width / 2;
    const mascotCenterY = mascotRect.top + mascotRect.height / 2;
    const dist = Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY);

    if (dist < 200) {
        const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
        const force = (200 - dist) / 200;
        mascot.style.transform = `translate(${Math.cos(angle) * force * 5}px, ${Math.sin(angle) * force * 5}px)`;
    } else {
        mascot.style.transform = 'translate(0, 0)';
    }
});

// ===== CARD FLIP ANIMATIONS =====
const mangaCards = document.querySelectorAll('.manga-card');

mangaCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
    });
});

// ===== GACHA SYSTEM =====
const gachaButton = document.getElementById('gacha-button');
const gachaResult = document.getElementById('gacha-result');
const gachaWindow = document.getElementById('gacha-window');
const collectionGrid = document.getElementById('collection-grid');

const gachaCharacters = [
    { emoji: '🌸', name: 'Sakura-chan', rarity: 'SSR', rarityClass: 'rarity-ssr', chance: 0.05 },
    { emoji: '👑', name: 'Princess Hoshi', rarity: 'SSR', rarityClass: 'rarity-ssr', chance: 0.05 },
    { emoji: '🐉', name: 'Draco-kun', rarity: 'SSR', rarityClass: 'rarity-ssr', chance: 0.05 },
    { emoji: '🌙', name: 'Tsuki-sama', rarity: 'SSR', rarityClass: 'rarity-ssr', chance: 0.05 },
    { emoji: '⭐', name: 'Hoshi-kun', rarity: 'SR', rarityClass: 'rarity-sr', chance: 0.15 },
    { emoji: '🎀', name: 'Mochi-chan', rarity: 'SR', rarityClass: 'rarity-sr', chance: 0.15 },
    { emoji: '☕', name: 'Coffee-cat', rarity: 'SR', rarityClass: 'rarity-sr', chance: 0.15 },
    { emoji: '🍀', name: 'Kira-chan', rarity: 'SR', rarityClass: 'rarity-sr', chance: 0.15 },
    { emoji: '🎵', name: 'Melody', rarity: 'SR', rarityClass: 'rarity-sr', chance: 0.15 },
    { emoji: '🦊', name: 'Kitsune', rarity: 'SR', rarityClass: 'rarity-sr', chance: 0.15 },
    { emoji: '🌷', name: 'Tulip-san', rarity: 'R', rarityClass: 'rarity-r', chance: 0.25 },
    { emoji: '🐱', name: 'Neko-chan', rarity: 'R', rarityClass: 'rarity-r', chance: 0.25 },
    { emoji: '🍡', name: 'Dango-kun', rarity: 'R', rarityClass: 'rarity-r', chance: 0.25 },
    { emoji: '🎒', name: 'Bag-chan', rarity: 'R', rarityClass: 'rarity-r', chance: 0.25 },
];

let collection = [];
let isRevealing = false;

gachaButton.addEventListener('click', () => {
    if (isRevealing) return;
    isRevealing = true;

    // Determine character
    const roll = Math.random();
    let cumulative = 0;
    let selected = gachaCharacters[0];
    for (const char of gachaCharacters) {
        cumulative += char.chance;
        if (roll <= cumulative) {
            selected = char;
            break;
        }
    }

    // Reveal animation
    gachaResult.innerHTML = '<p class="gacha-prompt">Summoning...</p>';
    gachaResult.style.animation = 'none';
    gachaResult.offsetHeight;
    gachaResult.style.animation = 'gachaReveal 0.8s ease';

    setTimeout(() => {
        gachaResult.innerHTML = `
            <span class="gacha-character">${selected.emoji}</span>
            <p class="gacha-char-name">${selected.name}</p>
            <span class="gacha-char-rarity ${selected.rarityClass}">✦ ${selected.rarity} ✦</span>
        `;

        // Add to collection
        collection.push(selected);
        updateCollection();

        // SSR celebration
        if (selected.rarity === 'SSR') {
            celebrateSSR();
        }

        isRevealing = false;
    }, 800);
});

function updateCollection() {
    collectionGrid.innerHTML = '';
    // Show unique characters
    const unique = [...new Map(collection.map(c => [c.name, c])).values()];
    unique.forEach(char => {
        const item = document.createElement('div');
        item.classList.add('collection-item');
        item.textContent = char.emoji;
        item.title = `${char.name} (${char.rarity})`;
        collectionGrid.appendChild(item);
    });
}

function celebrateSSR() {
    // Burst of sparkles and particles
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('floating-heart');
            particle.textContent = ['✦', '✧', '★', '⋆', '💕', '🌸', '💫', '🎉', '🎊'][Math.floor(Math.random() * 9)];
            particle.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 400) + 'px';
            particle.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 400) + 'px';
            particle.style.fontSize = (Math.random() * 20 + 14) + 'px';
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 3000);
        }, i * 50);
    }
}

// ===== PASTEL COLOR SHIFT ON SCROLL =====
let lastScrollY = 0;
const root = document.documentElement;

const colorThemes = [
    { '--pink-2': '#FF69B4', '--lavender-1': '#DDA0DD', '--sky-1': '#87CEEB' },
    { '--pink-2': '#FF85A2', '--lavender-1': '#D8BFD8', '--sky-1': '#7EC8E3' },
    { '--pink-2': '#FFA07A', '--lavender-1': '#DDA0DD', '--sky-1': '#98FB98' },
    { '--pink-2': '#FFB6C1', '--lavender-1': '#BA55D3', '--sky-1': '#87CEEB' },
    { '--pink-2': '#FF69B4', '--lavender-1': '#E6E6FA', '--sky-1': '#B0E0E6' },
];

document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
    const themeIndex = Math.floor(scrollPercent * (colorThemes.length - 1));
    const theme = colorThemes[themeIndex];

    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    lastScrollY = scrollY;
});

// ===== SCROLL REVEAL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.8s ease ${index * 0.1}s both`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.manga-card, .anime-card, .character-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== NAVIGATION HIGHLIGHT ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.fontWeight = link.getAttribute('href') === `#${current}` ? '600' : '400';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.background = 'var(--pink-1)';
        } else {
            link.style.background = 'transparent';
        }
    });
});

// ===== MASCOT IDLE MESSAGES =====
setInterval(() => {
    if (Math.random() > 0.7) {
        const idleMessages = [
            "✧ Boketto~ ✧",
            "♪ La la la~ ♪",
            "～ Nyan~ ～",
            "✦ Sparkle~ ✦",
            "♡ Moe~ ♡"
        ];
        mascotSpeech.querySelector('p').textContent = idleMessages[Math.floor(Math.random() * idleMessages.length)];
    }
}, 8000);

// ===== SMOOTH NAVIGATION =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== HERO SECTION ENTER ANIMATION =====
window.addEventListener('load', () => {
    document.querySelector('.hero-content').style.animation = 'fadeInUp 1s ease both';
    document.querySelector('.hero-title').style.animation = 'fadeInUp 1s ease 0.2s both';
    document.querySelector('.hero-subtitle').style.animation = 'fadeInUp 1s ease 0.4s both';
    document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s ease 0.6s both';
});

// ===== ADDITIONAL FLOATING HEARTS PERIODICALLY =====
setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = ['❤', '♡', '✦', '🌸', '★'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 12 + 10) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
}, 4000);

// ===== BUBBLE EFFECT ON GACHA =====
gachaButton.addEventListener('mouseenter', () => {
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.classList.add('floating-heart');
            bubble.textContent = '○';
            bubble.style.left = (gachaWindow.getBoundingClientRect().left + Math.random() * gachaWindow.offsetWidth) + 'px';
            bubble.style.top = (gachaWindow.getBoundingClientRect().top + Math.random() * gachaWindow.offsetHeight) + 'px';
            bubble.style.fontSize = (Math.random() * 10 + 8) + 'px';
            bubble.style.color = 'var(--accent-cool)';
            bubble.style.animationDuration = '2s';
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 2000);
        }, i * 100);
    }
});
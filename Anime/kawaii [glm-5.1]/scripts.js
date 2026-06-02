const sparkleContainer = document.getElementById('sparkleTrailContainer');
const mascotCompanion = document.getElementById('mascotCompanion');
const mascotSpeech = document.getElementById('mascotSpeech');
const speechText = document.getElementById('speechText');
const kawaiiCursor = document.getElementById('kawaiiCursor');
const notificationToast = document.getElementById('notificationToast');
const toastIcon = document.getElementById('toastIcon');
const toastText = document.getElementById('toastText');
const gachaPullBtn = document.getElementById('gachaPullBtn');
const gachaResultOverlay = document.getElementById('gachaResultOverlay');
const gachaResultCard = document.getElementById('gachaResultCard');
const resultCloseBtn = document.getElementById('resultCloseBtn');
const resultRarityBadge = document.getElementById('resultRarityBadge');
const resultName = document.getElementById('resultName');
const resultTitle = document.getElementById('resultTitle');
const resultHair = document.getElementById('resultHair');
const resultMouth = document.getElementById('resultMouth');
const resultAvatar = document.getElementById('resultAvatar');
const ticketCountEl = document.getElementById('ticketCount');
const kawaiiHeader = document.getElementById('kawaiiHeader');
const heroExploreBtn = document.getElementById('heroExploreBtn');
const heroGachaBtn = document.getElementById('heroGachaBtn');

const gachaCharacters = [
    { name: 'Sakura Hime', title: 'Moonlight Princess', rarity: 'SSR', hairColor: 'linear-gradient(180deg, #FFB6C1, #FF8A9E)', mouth: 'ω', eyeColor: '#E07080' },
    { name: 'Aoi Ryuusei', title: 'Starfall Knight', rarity: 'SSR', hairColor: 'linear-gradient(180deg, #A0C4FF, #6090D0)', mouth: '◡', eyeColor: '#6090D0' },
    { name: 'Midori no Majo', title: 'Emerald Enchantress', rarity: 'SR', hairColor: 'linear-gradient(180deg, #B2DFDB, #80C8B0)', mouth: '▽', eyeColor: '#60B090' },
    { name: 'Akane Honoo', title: 'Crimson Flame Dancer', rarity: 'SR', hairColor: 'linear-gradient(180deg, #FFA8A9, #E07070)', mouth: '◡', eyeColor: '#D06060' },
    { name: 'Yukina Fuyu', title: 'Frost Priestess', rarity: 'SSR', hairColor: 'linear-gradient(180deg, #E8D8F8, #C8B0E8)', mouth: 'ω', eyeColor: '#9070C0' },
    { name: 'Hikari Tenshi', title: 'Radiant Seraph', rarity: 'SSR', hairColor: 'linear-gradient(180deg, #FFF9C4, #FFE066)', mouth: 'ω', eyeColor: '#C0A020' },
    { name: 'Kuro Neko', title: 'Shadow Cat Burglar', rarity: 'SR', hairColor: 'linear-gradient(180deg, #B0B0B0, #808080)', mouth: '◡', eyeColor: '#606060' },
    { name: 'Momo Chan', title: 'Peach Blossom Maid', rarity: 'R', hairColor: 'linear-gradient(180deg, #FFDAB9, #FFB88C)', mouth: '▽', eyeColor: '#D09060' },
    { name: 'Sora Tsubasa', title: 'Sky Wing Scout', rarity: 'R', hairColor: 'linear-gradient(180deg, #B3E5FC, #81D4FA)', mouth: 'ω', eyeColor: '#50A0D0' },
    { name: 'Rin Natsuki', title: 'Summer Storm Samurai', rarity: 'SR', hairColor: 'linear-gradient(180deg, #FF8A80, #FF5252)', mouth: '◡', eyeColor: '#E04040' },
    { name: 'Luna Tsukiyomi', title: 'Moonlit Oracle', rarity: 'SSR', hairColor: 'linear-gradient(180deg, #D1A8FF, #B080E0)', mouth: 'ω', eyeColor: '#A070D0' },
    { name: 'Hana Ikimono', title: 'Flower Beast Tamer', rarity: 'R', hairColor: 'linear-gradient(180deg, #F8BBD0, #F48FB1)', mouth: '▽', eyeColor: '#E06090' },
];

const mascotPhrases = [
    'Nya~! Welcome!',
    'Kawaii desu ne~ ♡',
    'Doki doki~! 💓',
    'Sugoi! Amazing~! ✨',
    'Let\'s explore together!',
    'Moe moe kyun~! 💕',
    'Nani?! So cool~!',
    'Ganbatte~! You got this!',
    'I love anime~! 🌸',
    'Pull the gacha, nya~!',
    'Yatta~! ★',
    'So sparkly~! ✧',
    'Ichiban kawaii~!',
    'Senpai noticed me! 💗',
];

const sparkleSymbols = ['✦', '✧', '★', '♡', '✿', '❀', '✨', '⋅', '⊹'];
let ticketCount = 5;
let lastScrollY = 0;
let mascotBounceTimeout = null;
let speechTimeout = null;
let isGachaAnimating = false;

function createSparkleParticle(x, y) {
    const particle = document.createElement('span');
    particle.classList.add('sparkle-particle');
    const symbol = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    particle.textContent = symbol;
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    particle.style.left = (x + offsetX) + 'px';
    particle.style.top = (y + offsetY) + 'px';
    const colors = ['#FFB6C1', '#D1A8FF', '#B3E5FC', '#B2DFDB', '#FFF9C4', '#FFD1DC', '#FFA8A9'];
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    const size = 8 + Math.random() * 12;
    particle.style.fontSize = size + 'px';
    sparkleContainer.appendChild(particle);
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 1000);
}

let sparkleThrottleTimer = null;
document.addEventListener('mousemove', (e) => {
    if (sparkleThrottleTimer) return;
    sparkleThrottleTimer = setTimeout(() => {
        sparkleThrottleTimer = null;
    }, 40);
    createSparkleParticle(e.clientX, e.clientY);
    kawaiiCursor.style.left = e.clientX + 'px';
    kawaiiCursor.style.top = e.clientY + 'px';
    if (!kawaiiCursor.classList.contains('visible')) {
        kawaiiCursor.classList.add('visible');
    }
});

document.addEventListener('mousedown', () => {
    kawaiiCursor.classList.add('clicking');
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = parseFloat(kawaiiCursor.style.left) || 0;
            const y = parseFloat(kawaiiCursor.style.top) || 0;
            createSparkleParticle(x, y);
        }, i * 50);
    }
});

document.addEventListener('mouseup', () => {
    kawaiiCursor.classList.remove('clicking');
});

document.addEventListener('mouseleave', () => {
    kawaiiCursor.classList.remove('visible');
});

mascotCompanion.addEventListener('click', () => {
    triggerMascotBounce();
    showMascotSpeech();
});

function triggerMascotBounce() {
    mascotCompanion.classList.add('bouncing');
    if (mascotBounceTimeout) clearTimeout(mascotBounceTimeout);
    mascotBounceTimeout = setTimeout(() => {
        mascotCompanion.classList.remove('bouncing');
    }, 600);
}

function showMascotSpeech() {
    const phrase = mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)];
    speechText.textContent = phrase;
    mascotSpeech.classList.add('visible');
    if (speechTimeout) clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
        mascotSpeech.classList.remove('visible');
    }, 3000);
}

setInterval(() => {
    triggerMascotBounce();
}, 15000);

setTimeout(() => {
    showMascotSpeech();
}, 3000);

setInterval(() => {
    if (Math.random() > 0.6) {
        showMascotSpeech();
    }
}, 20000);

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
        kawaiiHeader.classList.add('scrolled');
    } else {
        kawaiiHeader.classList.remove('scrolled');
    }
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    if (scrollDelta > 100) {
        triggerMascotBounce();
        lastScrollY = currentScrollY;
    }
    updateActiveNav();
    checkCultureItemsVisibility();
});

const chibiNavBtns = document.querySelectorAll('.chibi-nav-btn');
chibiNavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const targetSection = btn.getAttribute('data-section');
        const targetEl = document.getElementById(targetSection);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        chibiNavBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function updateActiveNav() {
    const sections = ['hero', 'gacha', 'featured', 'gallery', 'culture', 'facts'];
    let currentSection = 'hero';
    for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) {
                currentSection = sectionId;
            }
        }
    }
    chibiNavBtns.forEach((btn) => {
        const btnSection = btn.getAttribute('data-section');
        if (btnSection === currentSection) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

gachaPullBtn.addEventListener('click', pullGacha);

heroGachaBtn.addEventListener('click', () => {
    const gachaSection = document.getElementById('gacha');
    if (gachaSection) {
        gachaSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(pullGacha, 800);
    }
});

heroExploreBtn.addEventListener('click', () => {
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
});

function pullGacha() {
    if (isGachaAnimating) return;
    if (ticketCount <= 0) {
        showToast('🎟️', 'No tickets left, nya~! Come back later!');
        return;
    }
    isGachaAnimating = true;
    ticketCount--;
    ticketCountEl.textContent = ticketCount;
    gachaPullBtn.classList.add('pulling');
    const capsules = document.querySelectorAll('.gacha-capsule');
    capsules.forEach((cap) => {
        cap.style.animation = 'capsuleShake 0.3s ease-in-out infinite';
    });
    const style = document.createElement('style');
    style.id = 'gachaShakeStyle';
    style.textContent = `
        @keyframes capsuleShake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-4px) rotate(-5deg); }
            50% { transform: translateX(4px) rotate(5deg); }
            75% { transform: translateX(-2px) rotate(-2deg); }
        }
    `;
    document.head.appendChild(style);
    setTimeout(() => {
        const character = selectGachaCharacter();
        showGachaResult(character);
        capsules.forEach((cap) => {
            cap.style.animation = '';
        });
        const shakeStyle = document.getElementById('gachaShakeStyle');
        if (shakeStyle) shakeStyle.remove();
        gachaPullBtn.classList.remove('pulling');
    }, 1200);
}

function selectGachaCharacter() {
    const roll = Math.random();
    let rarity;
    if (roll < 0.05) {
        rarity = 'SSR';
    } else if (roll < 0.25) {
        rarity = 'SR';
    } else {
        rarity = 'R';
    }
    const pool = gachaCharacters.filter((c) => c.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
}

function showGachaResult(character) {
    resultRarityBadge.textContent = character.rarity;
    resultRarityBadge.className = 'result-rarity-badge';
    if (character.rarity === 'SSR') {
        resultRarityBadge.classList.add('rarity-ssr');
        gachaResultCard.style.borderColor = '#FFD700';
        gachaResultCard.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.5), 0 20px 60px rgba(0,0,0,0.2)';
        resultAvatar.style.borderColor = '#FFD700';
    } else if (character.rarity === 'SR') {
        resultRarityBadge.classList.add('rarity-sr');
        gachaResultCard.style.borderColor = '#D1A8FF';
        gachaResultCard.style.boxShadow = '0 0 30px rgba(209, 168, 255, 0.5), 0 20px 60px rgba(0,0,0,0.2)';
        resultAvatar.style.borderColor = '#D1A8FF';
    } else {
        resultRarityBadge.classList.add('rarity-r');
        gachaResultCard.style.borderColor = '#A0C4FF';
        gachaResultCard.style.boxShadow = '0 0 20px rgba(160, 196, 255, 0.5), 0 20px 60px rgba(0,0,0,0.2)';
        resultAvatar.style.borderColor = '#A0C4FF';
    }
    resultName.textContent = character.name;
    resultTitle.textContent = character.title;
    resultHair.style.background = character.hairColor;
    resultMouth.textContent = character.mouth;
    const eyes = gachaResultCard.querySelectorAll('.result-chibi-eye');
    eyes.forEach((eye) => {
        eye.style.background = character.eyeColor;
    });
    gachaResultOverlay.classList.add('active');
    if (character.rarity === 'SSR') {
        createSSRSparkleBurst();
    }
    const rarityMessages = {
        SSR: '🌟 SSR PULL! Sugoi~!!!',
        SR: '✨ SR Pull! Nice one, nya~!',
        R: '🎀 R Pull! Still kawaii~!',
    };
    showToast('🎰', rarityMessages[character.rarity]);
    setTimeout(() => {
        isGachaAnimating = false;
    }, 500);
}

function createSSRSparkleBurst() {
    const card = gachaResultCard;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const angle = (i / 30) * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createSparkleParticle(x, y);
        }, i * 30);
    }
}

resultCloseBtn.addEventListener('click', () => {
    gachaResultOverlay.classList.remove('active');
    gachaResultCard.style.borderColor = '';
    gachaResultCard.style.boxShadow = '';
});

gachaResultOverlay.addEventListener('click', (e) => {
    if (e.target === gachaResultOverlay) {
        gachaResultOverlay.classList.remove('active');
        gachaResultCard.style.borderColor = '';
        gachaResultCard.style.boxShadow = '';
    }
});

function showToast(icon, text) {
    toastIcon.textContent = icon;
    toastText.textContent = text;
    notificationToast.classList.add('visible');
    setTimeout(() => {
        notificationToast.classList.remove('visible');
    }, 3000);
}

const cultureItems = document.querySelectorAll('.culture-item');
function checkCultureItemsVisibility() {
    cultureItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
            item.classList.add('visible');
        }
    });
}

const factCards = document.querySelectorAll('.fact-card');
const factObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

factCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    factObserver.observe(card);
});

const featuredCards = document.querySelectorAll('.featured-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });

featuredCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.7s var(--bounce-ease) ${index * 0.15}s`;
    cardObserver.observe(card);
});

const chibiCards = document.querySelectorAll('.chibi-card');
const chibiObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, { threshold: 0.15 });

chibiCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = `all 0.6s var(--bounce-ease) ${index * 0.1}s`;
    chibiObserver.observe(card);
});

chibiCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
        const name = card.getAttribute('data-name');
        const rarity = card.getAttribute('data-rarity');
        const rarityStars = rarity === 'SSR' ? '★★★' : rarity === 'SR' ? '★★' : '★';
        showToast(rarity === 'SSR' ? '🌟' : '✨', `${name} — ${rarity} ${rarityStars}!`);
    });
});

const featuredCarousel = document.getElementById('featuredCarousel');
let isDragging = false;
let startX = 0;
let scrollLeftVal = 0;

featuredCarousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - featuredCarousel.offsetLeft;
    scrollLeftVal = featuredCarousel.scrollLeft;
    featuredCarousel.style.cursor = 'grabbing';
});

featuredCarousel.addEventListener('mouseleave', () => {
    isDragging = false;
    featuredCarousel.style.cursor = '';
});

featuredCarousel.addEventListener('mouseup', () => {
    isDragging = false;
    featuredCarousel.style.cursor = '';
});

featuredCarousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - featuredCarousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    featuredCarousel.scrollLeft = scrollLeftVal - walk;
});

document.querySelectorAll('.kawaii-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', (e) => {
        const rect = btn.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createSparkleParticle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 80);
        }
    });
});

document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        for (let i = 0; i < 6; i++) {
            const rect = btn.getBoundingClientRect();
            createSparkleParticle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        }
        showToast('💕', 'Nya~! Link coming soon!');
    });
});

document.querySelectorAll('.fact-card').forEach((card) => {
    card.addEventListener('click', () => {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'factCardWiggle 0.5s var(--bounce-ease)';
    });
});

const factWiggleStyle = document.createElement('style');
factWiggleStyle.textContent = `
    @keyframes factCardWiggle {
        0% { transform: translateY(-6px) rotate(-0.5deg); }
        25% { transform: translateY(-8px) rotate(1deg); }
        50% { transform: translateY(-4px) rotate(-0.5deg); }
        75% { transform: translateY(-6px) rotate(0.5deg); }
        100% { transform: translateY(-6px) rotate(-0.5deg); }
    }
`;
document.head.appendChild(factWiggleStyle);

const gachaCapsules = document.querySelectorAll('.gacha-capsule');
gachaCapsules.forEach((capsule, index) => {
    capsule.style.setProperty('--cap-delay', index);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        showToast('✨', 'Welcome to Moe Moe Kyun Dreamland~! ♡');
    }, 1500);
    setTimeout(() => {
        showMascotSpeech();
    }, 3000);
    checkCultureItemsVisibility();
    updateActiveNav();
});

setInterval(() => {
    if (ticketCount < 5) {
        ticketCount++;
        ticketCountEl.textContent = ticketCount;
        showToast('🎟️', 'A ticket regenerated, nya~!');
    }
}, 60000);

const navEmojiMap = {
    hero: '🏠',
    gacha: '🎰',
    featured: '🌟',
    gallery: '🎨',
    culture: '🎌',
};

chibiNavBtns.forEach((btn) => {
    const section = btn.getAttribute('data-section');
    const emoji = navEmojiMap[section] || '✨';
    btn.addEventListener('mouseenter', () => {
        const faces = btn.querySelectorAll('.chibi-eye-nav');
        faces.forEach((eye) => {
            eye.style.height = '3px';
            eye.style.borderRadius = '3px';
            eye.style.background = 'var(--pastel-rose)';
        });
        const mouth = btn.querySelector('.chibi-mouth-nav');
        if (mouth) mouth.textContent = '▽';
    });
    btn.addEventListener('mouseleave', () => {
        const faces = btn.querySelectorAll('.chibi-eye-nav');
        faces.forEach((eye) => {
            eye.style.height = '5px';
            eye.style.borderRadius = '50%';
            eye.style.background = 'var(--kawaii-dark)';
        });
        const mouth = btn.querySelector('.chibi-mouth-nav');
        if (mouth) mouth.textContent = 'ω';
    });
});

const heroSection = document.getElementById('hero');
if (heroSection) {
    const parallaxClouds = heroSection.querySelectorAll('.kawaii-cloud');
    window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        parallaxClouds.forEach((cloud, index) => {
            const speed = (index + 1) * 5;
            const xOffset = mouseX * speed;
            const yOffset = mouseY * speed * 0.5;
            cloud.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gachaResultOverlay.classList.contains('active')) {
        gachaResultOverlay.classList.remove('active');
        gachaResultCard.style.borderColor = '';
        gachaResultCard.style.boxShadow = '';
    }
});
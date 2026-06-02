// Custom cursor and sparkle trail
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailParticles = [];

const sparkles = ['✦', '✧', '★', '✶', '💖', '✨', '🌟'];

function createTrailParticle(x, y) {
    const particle = document.createElement('span');
    particle.className = 'cursor-trail';
    particle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    particle.style.fontSize = (Math.random() * 12 + 8) + 'px';
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 800);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (Math.random() > 0.4) {
        createTrailParticle(e.clientX, e.clientY);
    }
});

// Hide default cursor and show custom pixel cursor
document.addEventListener('mousemove', (e) => {
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    customCursor.textContent = '💖';
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
    document.body.appendChild(customCursor);

    requestAnimationFrame(() => {
        if (customCursor.parentNode) {
            customCursor.remove();
        }
    });
});

// Hit counter animation
const hitCounter = document.getElementById('hitCounter');
let count = 3847;
hitCounter.textContent = count;

setInterval(() => {
    count += Math.floor(Math.random() * 3) + 1;
    hitCounter.textContent = count;
}, 5000);

// Guestbook functionality
const gbSubmit = document.getElementById('gbSubmit');
const gbName = document.getElementById('gbName');
const gbMessage = document.getElementById('gbMessage');
const guestbookEntries = document.getElementById('guestbookEntries');

const smileySets = [
    ['😍💕✨'],
    ['🤘🔥✌️'],
    ['😢💔🥺'],
    ['🤣💅✨'],
    ['😐👍'],
    ['💜🦋💫'],
    ['🌸✨💕'],
    ['😭💖🥺']
];

gbSubmit.addEventListener('click', () => {
    const name = gbName.value.trim() || 'AnOnYmOuS';
    const message = gbMessage.value.trim();

    if (!message) {
        gbMessage.style.borderColor = '#FF4500';
        setTimeout(() => {
            gbMessage.style.borderColor = '';
        }, 500);
        return;
    }

    const smileys = smileySets[Math.floor(Math.random() * smileySets.length)][0];
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

    const entry = document.createElement('div');
    entry.className = 'gb-entry';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(20px)';
    entry.innerHTML = `
        <div class="gb-header">
            <span class="gb-name">${escapeHtml(name)}</span>
            <span class="gb-date">${dateStr}</span>
        </div>
        <div class="gb-text">${escapeHtml(message)}</div>
        <div class="gb-smileys">${smileys}</div>
    `;

    guestbookEntries.insertBefore(entry, guestbookEntries.firstChild);

    requestAnimationFrame(() => {
        entry.style.transition = 'opacity 0.5s, transform 0.5s';
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
    });

    gbName.value = '';
    gbMessage.value = '';
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Quiz functionality
const quizSubmit = document.getElementById('quizSubmit');
const quizResult = document.getElementById('quizResult');

const quizResults = {
    'a-a-a': 'U r a HaRcOrE EmO!! 🔥 U luv hot pink and black and u never stop listening 2 Linkin Park. ur my kinda person!!',
    'a-a-b': 'U r a DrEaMy EmO!! 🌙 U spend all ur time writing poetry and crying 2 My Immortal. so deep 😭',
    'a-a-c': 'U r a SiCk EmO!! 💀 U like dark stuff and ur not afraid 2 show it. rawr!!',
    'a-a-d': 'U r a HaPpY EmO!! 🌈 U like lime green and u try 2 balance being emo w/ being happy. good 4 u!!',
    'a-b-a': 'U r a StReEty EmO!! 🛹 U luv electric blue and ur always on AIM. chill vibes only',
    'a-b-b': 'U r a MiNdFuL EmO!! 🧠 U listen 2 music and think about life. so deep omg',
    'a-b-c': 'U r a DaRk EmO!! 🖤 U like blood red and dark purple. mysterious af',
    'a-b-d': 'U r a WrItEr EmO!! 📝 U write in ur journal and no1 understands u. that makes it even better',
    'a-c-a': 'U r a PeRfEcT EmO!! ✨ U picked the best song and color combo. ur literally perfect',
    'a-c-b': 'U r a SeViLe EmO!! 😈 U like I Write Sins and ur kinda scary but in a hot way',
    'a-c-c': 'U r a ImAgInAtIoN EmO!! 🌀 U luv Crawling and dark stuff. ur mind is a whirlwind',
    'a-c-d': 'U r a ToUcHy FeEly EmO!! 💕 U write in ur journal and wear ur heart on ur sleeve',
    'a-d-a': 'U r a SpOrTy EmO!! ⚡ U like lime green and Linkin Park. ur unique and that rocks',
    'a-d-b': 'U r a ClAsSiC EmO!! 📀 U luv the mall and Evanescence. ur a true emo',
    'a-d-c': 'U r a UnDeRcOvEr EmO!! 🎭 U like dark stuff but u hide it. one day u will come out',
    'a-d-d': 'U r a DoRkY EmO!! 🤓 U write in ur journal and no1 knows. thats ur superpower',

    'b-a-a': 'U r a LiLi LiKe LuCkY EmO!! 🍀 U got hot pink and LP and u feel lucky 2 be alive',
    'b-a-b': 'U r a AnGel EmO!! 😇 U picked Evanescence and AIM. ur an angel in emo form',
    'b-a-c': 'U r a PaInTuL EmO!! 🎨 U like dark red and Panic! ur art is ur soul',
    'b-a-d': 'U r a FrEsH EmO!! 🌊 U like lime green and u bring new energy 2 the scene',

    'b-b-a': 'U r a ChIlL EmO!! 😎 U listen 2 music and talk on AIM. lifes good',
    'b-b-b': 'U r a SoUlFuL EmO!! 🎵 My Immortal is ur anthem and u feel everything deeply',
    'b-b-c': 'U r a DrAmAtIc EmO!! 🎭 I Write Sins and dark purple. ur life is a movie',
    'b-b-d': 'U r a QuIeT EmO!! 🤫 U write in ur journal and keep ur thoughts hidden. mysterious',

    'b-c-a': 'U r a StRaNgE EmO!! 🌀 Crawling and hot pink. ur weird but in the best way',
    'b-c-b': 'U r a BrOkEn EmO!! 💔 My Immortal and Crawling. ur heart is shattered but u keep going',
    'b-c-c': 'U r a FuLl MoOn EmO!! 🌕 Blood red and dark purple under the full moon',
    'b-c-d': 'U r a PeRfEcTlY ImPrEfEcT EmO!! ✨ U write and u cry and u love it',

    'b-d-a': 'U r a SpRiNg EmO!! 🌸 Lime green and Linkin Park. u bring light 2 the darkness',
    'b-d-b': 'U r a MeLoW EmO!! 🍯 Evanescence and journals. ur like honey on a dark night',
    'b-d-c': 'U r a OnE oF A KiNd EmO!! 🦋 Dark colors and lime green. u break all the rules',
    'b-d-d': 'U r a SeCrEt EmO!! 🤫 U write in ur journal and hide ur feelings. one day u will share',

    'c-a-a': 'U r a FiRe EmO!! 🔥 Blood red and LP. ur passion burns bright',
    'c-a-b': 'U r a BeAuTiFuL EmO!! 🌹 Dark red and Evanescence. ur pain makes u gorgeous',
    'c-a-c': 'U r a DaRk AnGeL EmO!! 👼 Blood red and Panic! ur wings are made of shadows',
    'c-a-d': 'U r a ReBeL EmO!! ⚔️ Dark red and lime green. u fight the system',

    'c-b-a': 'U r a StRoNg EmO!! 💪 Crawling and LP. ur pain makes u stronger',
    'c-b-b': 'U r a MoOnLiGhT EmO!! 🌙 My Immortal and Crawling. u shine in the dark',
    'c-b-c': 'U r a ThReE DiMeNsIoN EmO!! 🎲 Dark red, Panic!, and Crawling. ur layers are deep',
    'c-b-d': 'U r a WoRdS EmO!! 📖 U write and u feel everything. ur soul is a book',

    'c-c-a': 'U r a LeGeNdArY EmO!! 👑 All dark picks. ur the ultimate emo and everyone knows it',
    'c-c-b': 'U r a BrOkEn BuT BeAuTiFuL EmO!! 💎 Dark red and Evanescence. ur cracks let the light in',
    'c-c-c': 'U r a DrEaMwOrLd EmO!! 🌀 The darkest of the dark. u live in ur own world',
    'c-c-d': 'U r a UnDeRwOrLd EmO!! 🕷️ Dark red and lime green. u walk between worlds',

    'c-d-a': 'U r a CoNtRaSt EmO!! ⚡ Dark red and lime green and LP. ur contradictions make u amazing',
    'c-d-b': 'U r a CrYsTaL EmO!! 💎 Dark and Evanescence. u sparkle even in the dark',
    'c-d-c': 'U r a BaLlAd EmO!! 🎶 Dark red, Panic!, and lime green. ur life is a song',
    'c-d-d': 'U r a PhAnToM EmO!! 👻 Dark and hidden. u write and no1 knows ur secret',

    'd-a-a': 'U r a RaW EmO!! 🌿 Lime green and LP. ur energy is infectious',
    'd-a-b': 'U r a FrEsH EmO!! 🌱 Evanescence and lime green. u bring growth 2 the scene',
    'd-a-c': 'U r a PiXeL EmO!! 🎮 Lime green and Panic! ur life is a game and u r winning',
    'd-a-d': 'U r a NaTuRaL EmO!! 🍃 Lime green and journals. u are one with nature',

    'd-b-a': 'U r a BrIgHt EmO!! ☀️ Lime green and LP. u light up every room',
    'd-b-b': 'U r a GReEn AnGeL EmO!! 🌿 Evanescence and lime green. ur halo glows',
    'd-b-c': 'U r a CrAzY EmO!! 🤪 Lime green and Panic! ur energy is off the charts',
    'd-b-d': 'U r a TrUe EmO!! 💚 Lime green and journals. u are real and that is rare',

    'd-c-a': 'U r a UnStOpPaBlE EmO!! 🚀 Lime green, LP, and Crawling. nothing can stop u',
    'd-c-b': 'U r a LiFe EmO!! 🌍 My Immortal, Crawling, and lime green. u feel everything',
    'd-c-c': 'U r a EcLaCtIc EmO!! 🎨 All the dark picks plus lime. u are everything',
    'd-c-d': 'U r a AnImAl EmO!! 🐾 Dark and lime and writing. u are wild and free',

    'd-d-a': 'U r a LuMiNoUs EmO!! 💡 Lime green and LP. u glow in the dark',
    'd-d-b': 'U r a OpTiMiSt EmO!! 🌈 Evanescence and journals. u find hope in everything',
    'd-d-c': 'U r a EcLeCtIc EmO!! 🌈 Panic! and lime green. u are beautifully random',
    'd-d-d': 'U r a FiNaL BoSs EmO!! 👾 Lime green and all writing. u have mastered the emo lifestyle'
};

quizSubmit.addEventListener('click', () => {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');

    if (!q1 || !q2 || !q3) {
        quizResult.textContent = '!! u have 2 answer ALL questions!! try again!!';
        quizResult.style.color = '#FF4500';
        setTimeout(() => {
            quizResult.style.color = '';
        }, 1000);
        return;
    }

    const key = q1.value + '-' + q2.value + '-' + q3.value;
    const result = quizResults[key] || 'U r a 1 oF A KiNd EmO!! ✨ there is no one else like u!!';

    quizResult.textContent = result;
    quizResult.style.opacity = '0';
    quizResult.style.transform = 'scale(0.8)';

    requestAnimationFrame(() => {
        quizResult.style.transition = 'all 0.5s';
        quizResult.style.opacity = '1';
        quizResult.style.transform = 'scale(1)';
    });
});

// Music player simulation
const playBtn = document.getElementById('playBtn');
const vinylSpin = document.getElementById('vinylSpin');

let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    vinylSpin.classList.toggle('paused', !isPlaying);
    playBtn.textContent = isPlaying ? '⏸' : '▶';

    if (isPlaying) {
        playBtn.style.background = 'linear-gradient(180deg, #FF69B4, #FF1493)';
    } else {
        playBtn.style.background = 'linear-gradient(180deg, #00BFFF, #0066cc)';
    }
});

// Navigation active state
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Smooth scroll for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add sparkle effect on widget hover
const widgets = document.querySelectorAll('.widget');

widgets.forEach(widget => {
    widget.addEventListener('mouseenter', () => {
        const rect = widget.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'cursor-trail';
            sparkle.textContent = '✦';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            sparkle.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            sparkle.style.fontSize = '10px';
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }
    });
});

// Poem text reveal animation
const poem = document.querySelector('.poem');
if (poem) {
    const poemText = poem.textContent;
    poem.textContent = '';
    poem.style.opacity = '0';

    const lines = poemText.split('\n');
    lines.forEach((line, index) => {
        setTimeout(() => {
            const lineSpan = document.createElement('span');
            lineSpan.textContent = line + '\n';
            lineSpan.style.opacity = '0';
            lineSpan.style.display = 'block';
            lineSpan.style.transition = 'opacity 0.8s';
            poem.appendChild(lineSpan);

            requestAnimationFrame(() => {
                lineSpan.style.opacity = '1';
            });
        }, index * 400);
    });

    setTimeout(() => {
        poem.style.opacity = '1';
    }, lines.length * 400 + 200);
}

// Scroll-triggered animations for sections
const sections = document.querySelectorAll('.content-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s, transform 0.8s';
    observer.observe(section);
});

// Blinkies random color shift
const blinkies = document.querySelectorAll('.blinkie');

blinkies.forEach((blinkie, index) => {
    setInterval(() => {
        const colors = ['#FF69B4', '#9B30FF', '#00BFFF', '#FFD700', '#FF4500', '#32CD32', '#FF1493'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        blinkie.style.borderColor = randomColor;
    }, 2000 + index * 300);
});

// Friend card click interaction
const friendCards = document.querySelectorAll('.friend-card');

friendCards.forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(1.05) rotate(2deg)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    });
});

// Auto-scroll marquee text highlight
const marqueeBar = document.querySelector('.marquee-bar marquee');
if (marqueeBar) {
    const originalText = marqueeBar.textContent;
    let charIndex = 0;

    setInterval(() => {
        charIndex = (charIndex + 1) % originalText.length;
        marqueeBar.style.color = `hsl(${(charIndex * 10) % 360}, 100%, 70%)`;
    }, 50);
}

// Glitter text char animation enhancement
const glitterChars = document.querySelectorAll('.glitter-char');

glitterChars.forEach(char => {
    char.addEventListener('mouseenter', () => {
        char.style.transform = 'scale(1.5) rotate(15deg)';
        char.style.transition = 'transform 0.2s';
    });

    char.addEventListener('mouseleave', () => {
        char.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Mood ring color change on click
const moodRingInner = document.querySelector('.mood-ring-inner');
if (moodRingInner) {
    const moods = [
        { color: '#FF69B4', text: 'CrUsHeD 💔' },
        { color: '#9B30FF', text: 'MeLaNcHoLy 🌙' },
        { color: '#00BFFF', text: 'HaPpY ☀️' },
        { color: '#FF4500', text: 'AnGrY 😤' },
        { color: '#32CD32', text: 'ChIlL 🍃' },
        { color: '#FFD700', text: 'ExCiTeD ✨' }
    ];

    let moodIndex = 0;

    setInterval(() => {
        moodIndex = (moodIndex + 1) % moods.length;
        moodRingInner.style.background = moods[moodIndex].color;
        document.querySelector('.mood-value').textContent = moods[moodIndex].text;
    }, 3000);
}

// Visitor counter increment on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(st - lastScrollTop) > 100) {
        count += 1;
        hitCounter.textContent = count;
        lastScrollTop = st;
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbowBg 2s linear infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbowBg {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
    }
});

// Initial page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Staggered reveal of widgets
    const allWidgets = document.querySelectorAll('.widget');
    allWidgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';
        widget.style.transition = 'opacity 0.5s, transform 0.5s';

        setTimeout(() => {
            widget.style.opacity = '1';
            widget.style.transform = 'translateY(0)';
        }, 200 + index * 100);
    });
});
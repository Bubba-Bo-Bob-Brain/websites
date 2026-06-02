// ========== HERO CANVAS - Pixel Art Background ==========
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');

function resizeHeroCanvas() {
    heroCanvas.width = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;
    drawHeroScene();
}

function drawHeroScene() {
    const w = heroCanvas.width;
    const h = heroCanvas.height;
    const time = Date.now() / 1000;

    heroCtx.clearRect(0, 0, w, h);

    // Dark sky gradient
    const skyGrad = heroCtx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0a0a1a');
    skyGrad.addColorStop(0.5, '#1a1020');
    skyGrad.addColorStop(1, '#2a1520');
    heroCtx.fillStyle = skyGrad;
    heroCtx.fillRect(0, 0, w, h);

    // Stars (pixel-style)
    heroCtx.fillStyle = '#e8c860';
    for (let i = 0; i < 40; i++) {
        const sx = (i * 137.5 + time * 2) % w;
        const sy = (i * 97.3) % (h * 0.5);
        const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
        heroCtx.globalAlpha = 0.3 + twinkle * 0.7;
        const starSize = (i % 3 === 0) ? 3 : 2;
        heroCtx.fillRect(Math.floor(sx / 4) * 4, Math.floor(sy / 4) * 4, starSize, starSize);
    }
    heroCtx.globalAlpha = 1;

    // Moon
    const moonX = w * 0.75;
    const moonY = h * 0.2;
    heroCtx.fillStyle = '#e8d5b8';
    heroCtx.beginPath();
    heroCtx.arc(moonX, moonY, 40, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.fillStyle = '#1a1020';
    heroCtx.beginPath();
    heroCtx.arc(moonX + 15, moonY - 10, 35, 0, Math.PI * 2);
    heroCtx.fill();

    // Castle silhouette (pixel art)
    heroCtx.fillStyle = '#0a0f05';
    const castleBase = h * 0.65;
    const pixelSize = 8;

    // Castle body
    for (let x = Math.floor(w * 0.3 / pixelSize); x < Math.floor(w * 0.7 / pixelSize); x++) {
        for (let y = Math.floor(castleBase / pixelSize); y < Math.floor(h * 0.85 / pixelSize); y++) {
            heroCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    // Castle towers
    for (let tower = 0; tower < 3; tower++) {
        const tx = w * 0.3 + tower * (w * 0.2);
        const tw = pixelSize * 3;
        for (let x = 0; x < tw; x++) {
            for (let y = Math.floor(castleBase / pixelSize) - 8; y < Math.floor(castleBase / pixelSize); y++) {
                heroCtx.fillRect(tx + x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
        // Tower top (pointed)
        for (let py = 0; py < 3; py++) {
            const pw = tw - py * 2;
            for (let x = 0; x < pw; x++) {
                heroCtx.fillRect(tx + (Math.floor(pw / 2) - Math.floor(pw / 2) + x) * pixelSize, 
                    (Math.floor(castleBase / pixelSize) - 8 - py) * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    // Castle windows (pixel dots)
    heroCtx.fillStyle = '#c8a84e';
    const windowRows = [Math.floor(castleBase / pixelSize) + 2, Math.floor(castleBase / pixelSize) + 5];
    for (let row of windowRows) {
        for (let wx = Math.floor(w * 0.35 / pixelSize); wx < Math.floor(w * 0.65 / pixelSize); wx += 3) {
            heroCtx.fillRect(wx * pixelSize, row * pixelSize, pixelSize, pixelSize);
        }
    }

    // Ground
    heroCtx.fillStyle = '#1a0f05';
    heroCtx.fillRect(0, h * 0.85, w, h * 0.15);

    // Fog layers
    heroCtx.globalAlpha = 0.15;
    for (let f = 0; f < 3; f++) {
        const fogY = h * 0.75 + f * 30 + Math.sin(time + f) * 10;
        heroCtx.fillStyle = '#b89b72';
        heroCtx.fillRect(0, fogY, w, 40);
    }
    heroCtx.globalAlpha = 1;

    // Trees (pixel style)
    for (let i = 0; i < 8; i++) {
        const tx = (i * w / 8) + 30;
        const ty = h * 0.82;
        heroCtx.fillStyle = '#0a0f05';
        // Trunk
        heroCtx.fillRect(tx, ty - 30, 6, 30);
        // Canopy (pixel blocks)
        for (let cy = 0; cy < 4; cy++) {
            for (let cx = -cy; cx <= cy; cx++) {
                heroCtx.fillRect(tx + cx * 6, ty - 30 - cy * 8, 6, 8);
            }
        }
    }
}

// Animate hero canvas
let heroAnimFrame;
function animateHero() {
    drawHeroScene();
    heroAnimFrame = requestAnimationFrame(animateHero);
}
animateHero();

window.addEventListener('resize', resizeHeroCanvas);

// ========== DAY-NIGHT CYCLE ==========
const dayNightIndicator = document.getElementById('day-night-indicator');
const cycleLabel = dayNightIndicator.querySelector('.cycle-label');
const sunIcon = dayNightIndicator.querySelector('.sun-icon');
const moonIcon = dayNightIndicator.querySelector('.moon-icon');

let cyclePosition = 0.5; // 0 = midnight, 0.5 = noon, 1 = midnight

function updateDayNightCycle() {
    const now = Date.now() / 1000;
    cyclePosition = (Math.sin(now / 30) + 1) / 2; // Slow cycle over 60 seconds

    const isDay = cyclePosition > 0.35 && cyclePosition < 0.65;

    if (isDay) {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0.3';
        cycleLabel.textContent = 'Midday';
    } else if (cyclePosition > 0.65 || cyclePosition < 0.15) {
        sunIcon.style.opacity = '0.3';
        moonIcon.style.opacity = '1';
        cycleLabel.textContent = 'Midnight';
    } else {
        sunIcon.style.opacity = '0.5';
        moonIcon.style.opacity = '0.5';
        cycleLabel.textContent = cyclePosition < 0.35 ? 'Dusk' : 'Dawn';
    }

    // Update body background based on cycle
    const body = document.body;
    if (cyclePosition < 0.2) {
        body.style.background = '#1a1020';
        body.style.color = '#d4b896';
    } else if (cyclePosition < 0.4) {
        body.style.background = '#2a1a10';
        body.style.color = '#d4b896';
    } else if (cyclePosition > 0.8) {
        body.style.background = '#1a1020';
        body.style.color = '#d4b896';
    } else {
        body.style.background = '#d4b896';
        body.style.color = '#2a1a0a';
    }
}

setInterval(updateDayNightCycle, 1000);
updateDayNightCycle();

// ========== SCROLL PROGRESS ==========
const scrollProgress = document.getElementById('scroll-progress');
const progressFill = scrollProgress.querySelector('.progress-fill');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressFill.style.width = scrollPercent + '%';
});

// ========== TIMELINE SCROLL ANIMATIONS ==========
const timelineEntries = document.querySelectorAll('.timeline-entry');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
        }
    });
}, observerOptions);

timelineEntries.forEach(entry => {
    timelineObserver.observe(entry);
});

// ========== VILLAGE MAP CANVAS ==========
const villageCanvas = document.getElementById('village-canvas');
const villageCtx = villageCanvas.getContext('2d');

function resizeVillageCanvas() {
    const rect = villageCanvas.getBoundingClientRect();
    villageCanvas.width = rect.width;
    villageCanvas.height = rect.height;
    drawVillageMap();
}

const pixelSize = 4;

function drawVillageMap() {
    const w = villageCanvas.width;
    const h = villageCanvas.height;
    const time = Date.now() / 1000;

    villageCtx.clearRect(0, 0, w, h);

    // Parchment background
    const bgGrad = villageCtx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#e8d5b8');
    bgGrad.addColorStop(0.5, '#d4b896');
    bgGrad.addColorStop(1, '#e8d5b8');
    villageCtx.fillStyle = bgGrad;
    villageCtx.fillRect(0, 0, w, h);

    // Grid (pixel)
    villageCtx.strokeStyle = 'rgba(42, 26, 10, 0.1)';
    villageCtx.lineWidth = 1;
    for (let x = 0; x < w; x += pixelSize) {
        villageCtx.beginPath();
        villageCtx.moveTo(x, 0);
        villageCtx.lineTo(x, h);
        villageCtx.stroke();
    }
    for (let y = 0; y < h; y += pixelSize) {
        villageCtx.beginPath();
        villageCtx.moveTo(0, y);
        villageCtx.lineTo(w, y);
        villageCtx.stroke();
    }

    // Terrain - water (top)
    villageCtx.fillStyle = '#5a7a9a';
    villageCtx.fillRect(0, 0, w, h * 0.15);

    // Forest areas
    villageCtx.fillStyle = '#2d4a2d';
    // Left forest
    for (let x = 0; x < w * 0.15; x += pixelSize) {
        for (let y = h * 0.2; y < h * 0.5; y += pixelSize) {
            if (Math.random() > 0.3) {
                villageCtx.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }
    // Right forest
    for (let x = w * 0.85; x < w; x += pixelSize) {
        for (let y = h * 0.25; y < h * 0.55; y += pixelSize) {
            if (Math.random() > 0.3) {
                villageCtx.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }

    // Paths (dirt)
    villageCtx.fillStyle = '#8b7355';
    // Main road
    villageCtx.fillRect(w * 0.4, 0, w * 0.2, h);
    // Side paths
    villageCtx.fillRect(0, h * 0.4, w, h * 0.08);

    // Castle
    const castleX = w * 0.5;
    const castleY = h * 0.45;
    villageCtx.fillStyle = '#4a4a4a';
    villageCtx.fillRect(castleX - 20, castleY - 15, 40, 30);
    // Towers
    villageCtx.fillRect(castleX - 25, castleY - 25, 10, 25);
    villageCtx.fillRect(castleX + 15, castleY - 25, 10, 25);
    // Tower tops
    villageCtx.fillRect(castleX - 25, castleY - 30, 10, 5);
    villageCtx.fillRect(castleX + 15, castleY - 30, 10, 5);
    // Gate
    villageCtx.fillStyle = '#2a1a0a';
    villageCtx.fillRect(castleX - 8, castleY + 10, 16, 10);

    // Church
    const churchX = w * 0.35;
    const churchY = h * 0.35;
    villageCtx.fillStyle = '#8b7355';
    villageCtx.fillRect(churchX - 10, churchY - 5, 20, 20);
    // Steeple
    villageCtx.fillRect(churchX - 4, churchY - 20, 8, 15);
    villageCtx.fillRect(churchX - 6, churchY - 25, 12, 5);
    // Cross
    villageCtx.fillStyle = '#c8a84e';
    villageCtx.fillRect(churchX - 1, churchY - 30, 2, 5);
    villageCtx.fillRect(churchX - 2, churchY - 28, 4, 2);

    // Houses
    const housePositions = [
        [w * 0.25, h * 0.5], [w * 0.3, h * 0.55], [w * 0.6, h * 0.5],
        [w * 0.65, h * 0.55], [w * 0.55, h * 0.6], [w * 0.45, h * 0.6]
    ];
    villageCtx.fillStyle = '#6b4423';
    housePositions.forEach(([hx, hy]) => {
        villageCtx.fillRect(hx - 6, hy - 5, 12, 10);
        // Roof
        villageCtx.fillStyle = '#4a2c17';
        villageCtx.fillRect(hx - 8, hy - 8, 16, 3);
        villageCtx.fillStyle = '#6b4423';
    });

    // Market
    const marketX = w * 0.5;
    const marketY = h * 0.65;
    villageCtx.fillStyle = '#c8a84e';
    villageCtx.fillRect(marketX - 15, marketY - 5, 30, 10);
    // Stalls
    villageCtx.fillStyle = '#8b6b4a';
    villageCtx.fillRect(marketX - 12, marketY - 8, 8, 3);
    villageCtx.fillRect(marketX + 4, marketY - 8, 8, 3);

    // Graveyard
    const graveX = w * 0.15;
    const graveY = h * 0.65;
    villageCtx.fillStyle = '#3a3a3a';
    for (let i = 0; i < 5; i++) {
        villageCtx.fillRect(graveX + i * 10, graveY, 6, 8);
        villageCtx.fillRect(graveX + i * 10 + 2, graveY - 4, 2, 4);
    }

    // Animated elements
    // Smoke from castle
    villageCtx.fillStyle = 'rgba(180, 170, 150, 0.3)';
    for (let s = 0; s < 3; s++) {
        const smokeY = castleY - 35 - s * 15 - (time * 10 % 30);
        villageCtx.fillRect(castleX - 5 + s * 3, smokeY, 10, 5);
    }

    // Torch flicker at church
    if (Math.sin(time * 5) > 0.3) {
        villageCtx.fillStyle = '#e8c860';
        villageCtx.fillRect(churchX, churchY - 32, 2, 2);
    }

    // Villagers (small pixel figures)
    villageCtx.fillStyle = '#2a1a0a';
    const villagerPositions = [
        [w * 0.3, h * 0.5], [w * 0.55, h * 0.58], [w * 0.7, h * 0.52]
    ];
    villagerPositions.forEach(([vx, vy]) => {
        // Body
        villageCtx.fillRect(vx - 2, vy - 2, 4, 4);
        // Head
        villageCtx.fillRect(vx - 1, vy - 4, 2, 2);
    });

    // Map border
    villageCtx.strokeStyle = '#8a6d2b';
    villageCtx.lineWidth = 3;
    villageCtx.strokeRect(2, 2, w - 4, h - 4);

    // Compass rose
    const compassX = w - 50;
    const compassY = h - 50;
    villageCtx.strokeStyle = '#8a6d2b';
    villageCtx.lineWidth = 2;
    villageCtx.beginPath();
    villageCtx.moveTo(compassX, compassY - 15);
    villageCtx.lineTo(compassX, compassY + 15);
    villageCtx.moveTo(compassX - 15, compassY);
    villageCtx.lineTo(compassX + 15, compassY);
    villageCtx.stroke();
    villageCtx.fillStyle = '#8a6d2b';
    villageCtx.font = '10px Cinzel';
    villageCtx.textAlign = 'center';
    villageCtx.fillText('N', compassX, compassY - 18);
}

resizeVillageCanvas();
window.addEventListener('resize', resizeVillageCanvas);

// ========== BELL SOUND (Web Audio API) ==========
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playBellSound(frequency, duration = 2) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.type = 'sine';

    // Bell envelope
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);

    // Add harmonics for richer bell sound
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.frequency.setValueAtTime(frequency * 2.0, audioCtx.currentTime);
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0, audioCtx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration * 0.7);
    osc2.start(audioCtx.currentTime);
    osc2.stop(audioCtx.currentTime + duration * 0.7);

    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.frequency.setValueAtTime(frequency * 3.0, audioCtx.currentTime);
    osc3.type = 'sine';
    gain3.gain.setValueAtTime(0, audioCtx.currentTime);
    gain3.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration * 0.4);
    osc3.start(audioCtx.currentTime);
    osc3.stop(audioCtx.currentTime + duration * 0.4);
}

// ========== BELL ANIMATIONS ==========
const bellButtons = document.querySelectorAll('.bell-button');
const bellMessage = document.getElementById('bell-message');
const bellMessages = [
    "The bells ring out across the fog...",
    "A solemn toll echoes through the valley...",
    "The great bell shakes the stones of the tower...",
    "Villagers pause, heads bowed in prayer...",
    "The evening bell calls all souls to rest...",
    "Mortality rings in every chime...",
    "The dead hear what the living cannot...",
    "Three bells — for the past, present, and future..."
];

function ringBell(bellId) {
    const bell = document.getElementById(bellId);
    if (bell) {
        bell.classList.add('ringing');
        setTimeout(() => bell.classList.remove('ringing'), 500);
    }

    const frequencies = {
        'large-bell': 130,
        'medium-bell': 200,
        'small-bell': 350
    };

    if (frequencies[bellId]) {
        playBellSound(frequencies[bellId], 3);
    }

    bellMessage.textContent = bellMessages[Math.floor(Math.random() * bellMessages.length)];
    bellMessage.style.opacity = '0';
    setTimeout(() => {
        bellMessage.style.opacity = '1';
    }, 100);
}

bellButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const bellType = btn.dataset.bell;
        if (bellType === 'all') {
            // Ring all bells
            ['large-bell', 'medium-bell', 'small-bell'].forEach((bellId, i) => {
                setTimeout(() => ringBell(bellId), i * 300);
            });
            bellMessage.textContent = "All bells toll together — the kingdom trembles...";
        } else {
            ringBell(bellType);
        }
    });
});

// Tower bells
const towerBells = document.querySelectorAll('.bell-large, .bell-medium, .bell-small');
towerBells.forEach(bell => {
    bell.addEventListener('click', () => {
        bell.classList.add('ringing');
        setTimeout(() => bell.classList.remove('ringing'), 500);
        playBellSound(180, 2);
        bellMessage.textContent = "A hand strikes the iron bell...";
    });
});

// ========== ENTER BUTTON ==========
const enterBtn = document.getElementById('enter-btn');
enterBtn.addEventListener('click', () => {
    // Scroll to chronicle section
    document.getElementById('chronicle').scrollIntoView({ behavior: 'smooth' });

    // Ring the hero bells
    const bells = document.querySelectorAll('.bell-container .bell');
    bells.forEach((bell, i) => {
        setTimeout(() => {
            bell.classList.add('ringing');
            setTimeout(() => bell.classList.remove('ringing'), 500);
        }, i * 200);
    });

    playBellSound(150, 3);
});

// ========== PLAGUE DOCTOR INTERACTION ==========
const plagueDoctor = document.querySelector('.plague-doctor');
const plagueAura = document.querySelector('.plague-aura');

if (plagueDoctor) {
    plagueDoctor.addEventListener('mouseenter', () => {
        plagueAura.style.animation = 'aura-pulse 1s ease-in-out infinite';
        plagueAura.style.transform = 'scale(1.3)';
    });

    plagueDoctor.addEventListener('mouseleave', () => {
        plagueAura.style.animation = 'aura-pulse 4s ease-in-out infinite';
        plagueAura.style.transform = 'scale(1)';
    });
}

// ========== SMOOTH SCROLL FOR NAV LINKS ==========
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== PARCHMENT CARD HOVER EFFECTS ==========
document.querySelectorAll('.parchment-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
        card.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    });
});

// ========== VILLAGE MAP INTERACTIVITY ==========
villageCanvas.addEventListener('mousemove', (e) => {
    const rect = villageCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if hovering over castle
    if (x > villageCanvas.width * 0.4 && x < villageCanvas.width * 0.6 &&
        y > villageCanvas.height * 0.4 && y < villageCanvas.height * 0.5) {
        villageCanvas.style.cursor = 'pointer';
        villageCanvas.title = 'Ashford Castle — Seat of the Lord';
    }
    // Church
    else if (x > villageCanvas.width * 0.3 && x < villageCanvas.width * 0.4 &&
        y > villageCanvas.height * 0.3 && y < villageCanvas.height * 0.4) {
        villageCanvas.style.cursor = 'pointer';
        villageCanvas.title = 'St. Agnes Church — Where prayers go unanswered';
    }
    // Market
    else if (x > villageCanvas.width * 0.4 && x < villageCanvas.width * 0.6 &&
        y > villageCanvas.height * 0.6 && y < villageCanvas.height * 0.68) {
        villageCanvas.style.cursor = 'pointer';
        villageCanvas.title = 'The Market Square — Empty stalls and empty promises';
    }
    else {
        villageCanvas.style.cursor = 'crosshair';
        villageCanvas.title = '';
    }
});

// ========== ENTRANCE ANIMATION ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Animate hero title letters
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';
        line.style.transition = `all 0.6s ease ${i * 0.2}s`;
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 100);
    });
});

// ========== STAT BAR ANIMATION ==========
const statBars = document.querySelectorAll('.stat-fill');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 200);
        }
    });
}, { threshold: 0.5 });

statBars.forEach(bar => statsObserver.observe(bar));

// ========== TOLLING BELLS HERO ANIMATION ==========
const heroBells = document.querySelectorAll('.bell-container .bell');
setInterval(() => {
    const randomBell = heroBells[Math.floor(Math.random() * heroBells.length)];
    randomBell.classList.add('ringing');
    setTimeout(() => randomBell.classList.remove('ringing'), 500);
}, 8000);

// ========== PIXEL ART NOISE OVERLAY ==========
// Ensure noise overlay stays on top
const noiseOverlay = document.getElementById('noise-overlay');
const allElements = document.querySelectorAll('*');
allElements.forEach(el => {
    el.style.position = el.style.position || 'static';
});
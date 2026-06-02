/* Dark Ages Chronicles - Interactive Scripts */

// ==================== CONFIGURATION & STATE ====================

const CONFIG = {
    particles: {
        count: 50,
        colors: ['rgba(255, 215, 0, 0.6)', 'rgba(139, 0, 0, 0.4)', 'rgba(212, 175, 55, 0.5)'],
        size: { min: 1, max: 3 }
    },
    stars: {
        count: 150,
        twinkleSpeed: 0.02
    },
    torch: {
        flickerIntensity: 15,
        color: 'rgba(255, 136, 0, 0.15)'
    }
};

const STATE = {
    timeIndex: 0,
    times: ['day', 'dusk', 'night'],
    seasonIndex: 0,
    seasons: ['winter', 'spring', 'summer', 'autumn'],
    bellTolls: 0,
    blessings: 0,
    unlockedCodices: ['bestiary'],
    mapHovered: false,
    mouse: { x: 0, y: 0 },
    frame: 0
};

// ==================== DOM ELEMENTS ====================

const DOM = {
    cursor: document.getElementById('pixel-cursor'),
    body: document.body,
    starfield: document.getElementById('starfield'),
    particleCanvas: document.getElementById('particle-canvas'),
    torchCanvas: document.getElementById('torch-canvas'),
    timeToggle: document.getElementById('time-toggle'),
    seasonIndicator: document.getElementById('season-indicator'),
    bellTower: document.getElementById('bell-tower'),
    locationPanel: document.getElementById('location-panel'),
    plagueDoctor: document.getElementById('plague-doct'),
    doctorDialogue: document.getElementById('doctor-dialogue'),
    cauldron: document.getElementById('cauldron'),
    steamEffect: document.getElementById('steam-effect'),
    ratContainer: document.getElementById('rat-container'),
    roseWindow: document.getElementById('rose-window'),
    typewriterTargets: document.querySelectorAll('.typewriter-target'),
    interactiveElements: document.querySelectorAll('a, button, .map-location, .codex, .slot'),
    mapLocations: document.querySelectorAll('.map-location')
};

// ==================== CANVAS CONTEXTS ====================

const CTX = {
    stars: DOM.starfield.getContext('2d'),
    particles: DOM.particleCanvas.getContext('2d'),
    torch: DOM.torchCanvas.getContext('2d'),
    rose: DOM.roseWindow.getContext('2d')
};

// ==================== INITIALIZATION ====================

function init() {
    setupCanvases();
    setupEventListeners();
    setupIntersectionObserver();
    setupAnimations();
    drawRoseWindow();
    spawnRats();
    
    // Start animation loops
    requestAnimationFrame(animateLoop);
    
    // Initialize audio context on first interaction
    document.addEventListener('click', initAudio, { once: true });
}

function setupCanvases() {
    // Set canvas sizes to match display size
    const resizeCanvas = (canvas) => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || window.innerWidth;
        canvas.height = rect.height || window.innerHeight;
    };
    
    [DOM.starfield, DOM.particleCanvas, DOM.torchCanvas].forEach(resizeCanvas);
    
    // Handle resize
    window.addEventListener('resize', () => {
        [DOM.starfield, DOM.particleCanvas, DOM.torchCanvas].forEach(resizeCanvas);
        initStars();
    });
    
    initStars();
    initParticles();
}

// ==================== STARFIELD SYSTEM ====================

let stars = [];

function initStars() {
    stars = [];
    const width = DOM.starfield.width;
    const height = DOM.starfield.height;
    
    for (let i = 0; i < CONFIG.stars.count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            brightness: Math.random(),
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
}

function drawStars() {
    const ctx = CTX.stars;
    const width = DOM.starfield.width;
    const height = DOM.starfield.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Only show stars at night
    if (STATE.times[STATE.timeIndex] !== 'night') return;
    
    stars.forEach(star => {
        star.twinklePhase += CONFIG.stars.twinkleSpeed;
        const brightness = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
        
        // Occasional shooting star
        if (Math.random() < 0.001) {
            drawShootingStar(ctx, star.x, star.y);
        }
    });
}

function drawShootingStar(ctx, x, y) {
    const length = 30 + Math.random() * 20;
    const angle = Math.PI / 4;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - length * Math.cos(angle), y - length * Math.sin(angle));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ==================== PARTICLE SYSTEM ====================

let particles = [];

function initParticles() {
    particles = [];
    const width = DOM.particleCanvas.width;
    const height = DOM.particleCanvas.height;
    
    for (let i = 0; i < CONFIG.particles.count; i++) {
        particles.push(createParticle(width, height));
    }
}

function createParticle(width, height) {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2, // Slight upward drift
        size: Math.random() * (CONFIG.particles.size.max - CONFIG.particles.size.min) + CONFIG.particles.size.min,
        color: CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)],
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
    };
}

function drawParticles() {
    const ctx = CTX.particles;
    const width = DOM.particleCanvas.width;
    const height = DOM.particleCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        // Reset if out of bounds or expired
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life > p.maxLife) {
            particles[i] = createParticle(width, height);
            particles[i].y = height + 10; // Spawn from bottom
        }
        
        const alpha = 1 - (p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, `${alpha})`);
        ctx.fill();
    });
}

// ==================== TORCH LIGHTING ====================

function drawTorch() {
    const ctx = CTX.torch;
    const width = DOM.torchCanvas.width;
    const height = DOM.torchCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Only active at night or near candles
    const isNight = STATE.times[STATE.timeIndex] === 'night';
    if (!isNight) return;
    
    // Mouse-following torch light
    const gradient = ctx.createRadialGradient(
        STATE.mouse.x, STATE.mouse.y, 0,
        STATE.mouse.x, STATE.mouse.y, 150
    );
    
    gradient.addColorStop(0, 'rgba(255, 136, 0, 0.2)');
    gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.1)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add flicker effect
    if (Math.random() < 0.1) {
        const offsetX = (Math.random() - 0.5) * CONFIG.torch.flickerIntensity;
        const offsetY = (Math.random() - 0.5) * CONFIG.torch.flickerIntensity;
        
        const flickerGradient = ctx.createRadialGradient(
            STATE.mouse.x + offsetX, STATE.mouse.y + offsetY, 0,
            STATE.mouse.x + offsetX, STATE.mouse.y + offsetY, 100
        );
        flickerGradient.addColorStop(0, 'rgba(255, 200, 100, 0.1)');
        flickerGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = flickerGradient;
        ctx.fillRect(0, 0, width, height);
    }
}

// ==================== ROSE WINDOW DRAWING ====================

function drawRoseWindow() {
    const ctx = CTX.rose;
    const centerX = 100;
    const centerY = 100;
    const radius = 90;
    
    // Clear
    ctx.clearRect(0, 0, 200, 200);
    
    // Draw petals
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const petals = 12;
    
    for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const nextAngle = ((i + 1) / petals) * Math.PI * 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, nextAngle);
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(1, colors[(i + 1) % colors.length]);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Decorative details
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
    }
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Custom cursor
    document.addEventListener('mousemove', (e) => {
        STATE.mouse.x = e.clientX;
        STATE.mouse.y = e.clientY;
        
        DOM.cursor.style.left = e.clientX + 'px';
        DOM.cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effects for interactive elements
    DOM.interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => DOM.cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => DOM.cursor.classList.remove('hover'));
    });
    
    // Time toggle
    DOM.timeToggle.addEventListener('click', toggleTime);
    
    // Season wheel
    DOM.seasonIndicator.addEventListener('click', toggleSeason);
    
    // Bell tower
    DOM.bellTower.addEventListener('click', tollBell);
    
    // Plague doctor interaction
    DOM.plagueDoctor?.addEventListener('click', interactWithDoctor);
    
    // Cauldron interaction
    DOM.cauldron?.addEventListener('click', stirCauldron);
    
    // Ingredient slots
    document.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('click', () => addIngredient(slot.dataset.ingredient));
    });
    
    // Map locations
    DOM.mapLocations.forEach(location => {
        location.addEventListener('mouseenter', (e) => showLocationInfo(e, location));
        location.addEventListener('mouseleave', hideLocationInfo);
        location.addEventListener('click', (e) => selectLocation(location));
    });
    
    // Codex interactions
    document.querySelectorAll('.codex').forEach(codex => {
        codex.addEventListener('click', () => openCodex(codex));
    });
    
    // Scroll-based parallax for candles
    window.addEventListener('scroll', handleScroll);
}

// ==================== TIME & SEASON SYSTEMS ====================

function toggleTime() {
    STATE.timeIndex = (STATE.timeIndex + 1) % STATE.times.length;
    const newTime = STATE.times[STATE.timeIndex];
    
    DOM.body.setAttribute('data-time', newTime);
    
    // Visual feedback
    const celestial = document.getElementById('celestial-body');
    if (newTime === 'night') {
        playSound('transition');
        spawnMoreStars();
    } else if (newTime === 'dusk') {
        playSound('transition');
    }
    
    // Update torch intensity based on time
    updateLighting();
}

function toggleSeason() {
    STATE.seasonIndex = (STATE.seasonIndex + 1) % STATE.seasons.length;
    const newSeason = STATE.seasons[STATE.seasonIndex];
    
    DOM.body.setAttribute('data-season', newSeason);
    
    const icons = ['❄️', '🌸', '☀️', '🍂'];
    const labels = ['Wintertide', 'Springtide', 'Summertide', 'Harvestide'];
    
    DOM.seasonIndicator.querySelector('.season-icon').textContent = icons[STATE.seasonIndex];
    DOM.seasonIndicator.querySelector('.season-label').textContent = labels[STATE.seasonIndex];
    
    playSound('page-turn');
}

function updateLighting() {
    const time = STATE.times[STATE.timeIndex];
    const particles = document.querySelectorAll('.particle-canvas');
    
    if (time === 'night') {
        CONFIG.particles.colors = ['rgba(255, 215, 0, 0.3)', 'rgba(139, 0, 0, 0.2)'];
    } else {
        CONFIG.particles.colors = ['rgba(255, 215, 0, 0.6)', 'rgba(139, 0, 0, 0.4)'];
    }
}

function spawnMoreStars() {
    // Temporary boost in stars when night falls
    const extraStars = 50;
    const width = DOM.starfield.width;
    const height = DOM.starfield.height;
    
    for (let i = 0; i < extraStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3,
            brightness: 0,
            twinklePhase: 0,
            fadingIn: true
        });
    }
}

// ==================== BELL SYSTEM ====================

function tollBell() {
    STATE.bellTolls++;
    
    // Visual animation
    const assembly = document.getElementById('bell-assembly');
    const soundWaves = document.getElementById('sound-waves');
    
    // Create sound wave rings
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            wave.className = 'sound-wave';
            wave.style.animation = `wave-expand 1s ease-out forwards`;
            soundWaves.appendChild(wave);
            
            setTimeout(() => wave.remove(), 1000);
        }, i * 200);
    }
    
    // Play sound
    playSound('bell');
    
    // Check for unlocks
    if (STATE.bellTolls >= 3 && !STATE.unlockedCodices.includes('chronicles')) {
        unlockCodex('chronicles');
    }
    
    // Screen shake effect at night
    if (STATE.times[STATE.timeIndex] === 'night') {
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
}

// ==================== MAP INTERACTIVITY ====================

const locationData = {
    castle: {
        name: 'Castle Blackwood',
        description: 'Seat of the troubled Duke. Its halls echo with the silence of emptied chambers.',
        population: '47 souls remaining'
    },
    village: {
        name: 'Village of Ashford',
        description: 'Once thriving market town. Now quarantined, marked with the red cross.',
        population: '12 souls remaining'
    },
    monastery: {
        name: 'Saint Cuthbert\'s Abbey',
        description: 'The brothers pray for deliverance while the scriptorium preserves what knowledge remains.',
        population: '23 brothers'
    },
    hut: {
        name: 'Physician\'s Hut',
        description: 'Where the masked healer mixes potions of dubious efficacy.',
        population: '1 physician'
    }
};

function showLocationInfo(e, location) {
    const key = location.dataset.location;
    const data = locationData[key];
    
    if (!data) return;
    
    DOM.locationPanel.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <p style="color: #8b0000; font-size: 0.8rem; margin-top: 0.5rem;">${data.population}</p>
    `;
    
    DOM.locationPanel.classList.add('active');
    
    // Add pulse animation to location
    location.style.filter = 'drop-shadow(0 0 10px #ffd700)';
}

function hideLocationInfo() {
    DOM.locationPanel.classList.remove('active');
    DOM.mapLocations.forEach(loc => {
        loc.style.filter = '';
    });
}

function selectLocation(location) {
    playSound('select');
    location.style.transform = 'scale(0.95)';
    setTimeout(() => {
        location.style.transform = '';
    }, 150);
}

// ==================== PLAGUE DOCTOR ====================

const doctorQuotes = [
    "The miasma spreads on foul air. Keep your herbs close and your faith closer...",
    "I have seen the signs. The buboes speak of divine judgment.",
    "My mask protects me from the corrupted air. You should pray it suffices.",
    "The cure is often worse than the malady. I have leeches prepared.",
    "Forty days and forty nights. That is how long we must wait."
];

function interactWithDoctor() {
    const quote = doctorQuotes[Math.floor(Math.random() * doctorQuotes.length)];
    
    const dialogue = DOM.doctorDialogue;
    dialogue.querySelector('p').textContent = `"${quote}"`;
    dialogue.classList.add('visible');
    
    // Doctor animation
    const doctor = DOM.plagueDoctor;
    doctor.style.transform = 'translateY(-5px)';
    setTimeout(() => {
        doctor.style.transform = '';
    }, 300);
    
    playSound('mumble');
    
    // Hide after delay
    clearTimeout(window.doctorTimeout);
    window.doctorTimeout = setTimeout(() => {
        dialogue.classList.remove('visible');
    }, 5000);
}

// ==================== CAULDRON SYSTEM ====================

function stirCauldron() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, i) => {
        setTimeout(() => {
            bubble.style.animation = 'none';
            bubble.offsetHeight; // Trigger reflow
            bubble.style.animation = 'rise 1s ease-in forwards';
        }, i * 100);
    });
    
    // Add steam
    createSteam();
    
    playSound('bubble');
    
    // Check for blessing accumulation
    if (Math.random() > 0.7) {
        STATE.blessings++;
        if (STATE.blessings >= 3 && !STATE.unlockedCodices.includes('grimoire')) {
            unlockCodex('grimoire');
        }
    }
}

function createSteam() {
    for (let i = 0; i < 5; i++) {
        const steam = document.createElement('div');
        steam.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            left: ${50 + (Math.random() - 0.5) * 40}%;
            bottom: 50%;
            animation: steam-rise 2s ease-out forwards;
            filter: blur(5px);
        `;
        DOM.steamEffect.appendChild(steam);
        
        setTimeout(() => steam.remove(), 2000);
    }
}

function addIngredient(type) {
    playSound('plop');
    
    // Visual feedback in cauldron
    const colors = {
        herbs: '#4a8',
        potion: '#84a',
        bone: '#dcb',
        blood: '#a00'
    };
    
    const liquid = document.querySelector('.liquid-surface');
    if (liquid) {
        liquid.style.background = `linear-gradient(180deg, ${colors[type]} 0%, #2a0040 100%)`;
        setTimeout(() => {
            liquid.style.background = '';
        }, 1000);
    }
}

// ==================== CODEX SYSTEM ====================

function unlockCodex(codexId) {
    if (STATE.unlockedCodices.includes(codexId)) return;
    
    STATE.unlockedCodices.push(codexId);
    
    const codex = document.querySelector(`.codex[data-unlocked="false"]:has([data-chapter="${codexId === 'chronicles' ? 'IV' : codexId === 'grimoire' ? 'III' : 'II'}"])`);
    if (codex) {
        codex.dataset.unlocked = 'true';
        codex.querySelector('.codex-spine')?.classList.remove('locked');
        codex.querySelector('.codex-cover')?.classList.remove('locked');
        
        // Animation
        codex.style.animation = 'unlock-pulse 1s ease';
        playSound('unlock');
    }
}

function openCodex(codex) {
    if (codex.dataset.unlocked !== 'true') {
        playSound('locked');
        codex.style.animation = 'shake 0.5s';
        setTimeout(() => codex.style.animation = '', 500);
        return;
    }
    
    playSound('page-turn');
    
    const pageViewer = document.getElementById('page-viewer');
    pageViewer.style.opacity = '0';
    
    setTimeout(() => {
        // Update content based on codex
        const chapter = codex.dataset.chapter;
        updatePageContent(chapter);
        pageViewer.style.opacity = '1';
    }, 300);
}

function updatePageContent(chapter) {
    const content = {
        'I': {
            text: 'In the beginning was the Word, and the Word was with the scribe...',
            cap: 'I',
            doodle: 'monk'
        },
        'II': {
            text: 'The kingdom of Aethelgard spans from the misty river to the ancient wood...',
            cap: 'M',
            doodle: 'castle'
        },
        'III': {
            text: 'The physician must know the four humors: blood, phlegm, yellow bile, and black bile...',
            cap: 'P',
            doodle: 'mask'
        },
        'IV': {
            text: 'The chronicles record the years of darkness, when the great pestilence walked among us...',
            cap: 'A',
            doodle: 'raven'
        }
    };
    
    const data = content[chapter] || content['I'];
    const viewer = document.getElementById('page-viewer');
    
    viewer.innerHTML = `
        <div class="displayed-page">
            <div class="page-texture"></div>
            <div class="initial-cap">${data.cap}</div>
            <p>${data.text}</p>
            <div class="marginalia">
                <div class="marginal-drawing" id="doodle-${data.doodle}"></div>
            </div>
        </div>
    `;
}

// ==================== RAT SYSTEM ====================

function spawnRats() {
    if (!DOM.ratContainer) return;
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            createRat();
        }
    }, 3000);
}

function createRat() {
    const rat = document.createElement('div');
    rat.style.cssText = `
        position: absolute;
        width: 20px;
        height: 10px;
        background: #2a2a2a;
        border-radius: 10px 5px 5px 10px;
        left: -30px;
        top: ${Math.random() * 80 + 10}%;
        animation: scurry 5s linear forwards;
    `;
    
    // Add tail
    const tail = document.createElement('div');
    tail.style.cssText = `
        position: absolute;
        width: 15px;
        height: 3px;
        background: #2a2a2a;
        right: -10px;
        top: 50%;
        transform: rotate(-10deg);
    `;
    rat.appendChild(tail);
    
    DOM.ratContainer.appendChild(rat);
    
    setTimeout(() => rat.remove(), 5000);
}

// ==================== TYPEWRITER EFFECT ====================

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add delay if specified
                const delay = entry.target.dataset.delay;
                if (delay) {
                    entry.target.style.animationDelay = delay + 'ms';
                }
            }
        });
    }, { threshold: 0.5 });
    
    DOM.typewriterTargets.forEach(target => observer.observe(target));
}

// ==================== SCROLL EFFECTS ====================

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Parallax for candles
    document.querySelectorAll('.candle-stand').forEach((candle, i) => {
        const speed = 0.5 + (i * 0.1);
        candle.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Update compass based on scroll position (simulated direction)
    const compass = document.getElementById('compass-needle');
    if (compass) {
        const rotation = (scrollY * 0.1) % 360;
        compass.style.transform = `rotate(${rotation}deg)`;
    }
}

// ==================== ANIMATION LOOP ====================

function animateLoop() {
    STATE.frame++;
    
    drawStars();
    drawParticles();
    drawTorch();
    
    // Update wax drips randomly
    if (STATE.frame % 60 === 0) {
        updateWaxDrips();
    }
    
    requestAnimationFrame(animateLoop);
}

function updateWaxDrips() {
    document.querySelectorAll('.wax-drip').forEach(drip => {
        if (Math.random() > 0.95) {
            drip.style.height = Math.random() * 30 + 'px';
        }
    });
}

// ==================== AUDIO SYSTEM ====================

let audioContext = null;
let sounds = {};

function initAudio() {
    if (audioContext) return;
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Generate procedural sounds
    sounds = {
        bell: createBellSound(),
        page: createPageSound(),
        select: createSelectSound(),
        bubble: createBubbleSound(),
        locked: createLockedSound(),
        unlock: createUnlockSound(),
        transition: createTransitionSound(),
        mumble: createMumbleSound(),
        plop: createPlopSound()
    };
}

function playSound(name) {
    if (!audioContext || !sounds[name]) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = sounds[name];
    source.connect(audioContext.destination);
    source.start(0);
}

// Procedural sound generation
function createBellSound() {
    const duration = 2;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Bell tone with harmonics
        data[i] = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 2) * 0.3 +
                  Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 3) * 0.2 +
                  Math.sin(2 * Math.PI * 1320 * t) * Math.exp(-t * 4) * 0.1;
    }
    
    return buffer;
}

function createPageSound() {
    const duration = 0.5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Paper rustle (noise)
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 5) * 0.1;
    }
    
    return buffer;
}

function createSelectSound() {
    const duration = 0.1;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.sin(2 * Math.PI * 800 * (i / sampleRate)) * 0.1;
    }
    
    return buffer;
}

function createBubbleSound() {
    const duration = 0.3;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 10) * 0.2;
    }
    
    return buffer;
}

function createLockedSound() {
    const duration = 0.2;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 150 * t) * (t < 0.1 ? 1 : 0) * 0.3;
    }
    
    return buffer;
}

function createUnlockSound() {
    const duration = 0.5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * (400 + t * 400) * t) * Math.exp(-t * 3) * 0.2;
    }
    
    return buffer;
}

function createTransitionSound() {
    const duration = 1;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 100 * t) * Math.sin(2 * Math.PI * 0.5 * t) * 0.2;
    }
    
    return buffer;
}

function createMumbleSound() {
    const duration = 0.5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.sin(2 * Math.PI * 150 * t) * 0.1;
    }
    
    return buffer;
}

function createPlopSound() {
    const duration = 0.2;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 20) * 0.3;
    }
    
    return buffer;
}

// ==================== SETUP ANIMATIONS ====================

function setupAnimations() {
    // Add keyframes for steam
    const style = document.createElement('style');
    style.textContent = `
        @keyframes steam-rise {
            0% { transform: translateY(0) scale(1); opacity: 0.6; }
            100% { transform: translateY(-100px) scale(2); opacity: 0; }
        }
        
        @keyframes scurry {
            0% { left: -30px; }
            100% { left: 100%; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes unlock-pulse {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.1); filter: brightness(1.5); }
            100% { transform: scale(1); filter: brightness(1); }
        }
    `;
    document.head.appendChild(style);
}

// ==================== START ====================

document.addEventListener('DOMContentLoaded', init);
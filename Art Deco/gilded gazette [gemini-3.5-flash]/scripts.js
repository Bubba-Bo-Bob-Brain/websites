const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');
const interactiveElements = document.querySelectorAll('a, button, select, input, .nav-item');

function updateCursorPosition(e) {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
}

document.addEventListener('mousemove', updateCursorPosition);

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-link');
    });
    element.addEventListener('mouseleave', () => {
        document.body.classList.add('hovering-link');
        document.body.classList.remove('hovering-link');
    });
});

const canvas = document.getElementById('champagne-canvas');
const ctx = canvas.getContext('2d');
let bubblesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ChampagneBubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.sin(Math.random() * 2) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) {
            this.y = canvas.height + 10;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 229, 171, ${this.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(212, 175, 55, ${this.opacity + 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

function initBubbles() {
    bubblesArray = [];
    const bubbleCount = Math.floor(window.innerWidth / 15);
    for (let i = 0; i < bubbleCount; i++) {
        bubblesArray.push(new ChampagneBubble());
    }
}

function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }
    requestAnimationFrame(animateBubbles);
}

initBubbles();
animateBubbles();

const heroBg = document.querySelector('.hero-parallax-bg');
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    heroBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
});

const playButton = document.getElementById('play-btn');
const vinyl = document.getElementById('vinyl');
const gramophoneArm = document.getElementById('gramophone-arm');
const trackName = document.getElementById('track-name');

let audioContext = null;
let staticNode = null;
let melodyInterval = null;
let isPlaying = false;

function createVinylScratchSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        let whiteNoise = Math.random() * 2 - 1;
        let crackle = Math.random() > 0.995 ? (Math.random() * 0.8 - 0.4) : 0;
        output[i] = (whiteNoise * 0.015) + crackle;
    }

    staticNode = audioContext.createBufferSource();
    staticNode.buffer = noiseBuffer;
    staticNode.loop = true;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, audioContext.currentTime);

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, audioContext.currentTime);
    bandpass.Q.setValueAtTime(1.5, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    staticNode.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(audioContext.destination);

    staticNode.start(0);
}

function stopVinylScratchSound() {
    if (staticNode) {
        staticNode.stop();
        staticNode.disconnect();
        staticNode = null;
    }
}

const jazzNotes = [261.63, 293.66, 311.13, 349.23, 392.00, 440.00, 466.16, 523.25];
let melodyStep = 0;

function playJazzMelodyStep() {
    if (!audioContext || audioContext.state === 'suspended') return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    const noteIndex = Math.floor(Math.random() * jazzNotes.length);
    osc.frequency.setValueAtTime(jazzNotes[noteIndex], audioContext.currentTime);

    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);

    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, audioContext.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.7);
}

function startMelody() {
    melodyInterval = setInterval(playJazzMelodyStep, 450);
}

function stopMelody() {
    if (melodyInterval) {
        clearInterval(melodyInterval);
        melodyInterval = null;
    }
}

playButton.addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true;
        playButton.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSE BROADCAST';
        vinyl.classList.add('spinning');
        gramophoneArm.classList.add('active');
        trackName.textContent = '"Charleston Gold" - Live at The Ritz (Spinning)';
        
        try {
            createVinylScratchSound();
            startMelody();
        } catch (error) {
            trackName.textContent = 'Audio Error - Check Browser Permissions';
        }
    } else {
        isPlaying = false;
        playButton.innerHTML = '<i class="fa-solid fa-play"></i> PLAY BROADCAST';
        vinyl.classList.remove('spinning');
        gramophoneArm.classList.remove('active');
        trackName.textContent = '"Charleston Gold" - Live at The Ritz (Paused)';
        stopVinylScratchSound();
        stopMelody();
    }
});

const horoscopes = {
    aries: "The cosmos demand symmetry in your finances this week. A dashing stranger in a cream silk tuxedo will offer an intriguing venture near the NYSE.",
    taurus: "A sudden invitation to an underground speakeasy on 5th Avenue will reveal a secret. Keep your pearls close and your wits closer.",
    gemini: "Two glittering paths lie before you. One is paved with gold-leaf luxury, the other with midnight jazz. Choose both, for you are a socialite of two worlds.",
    cancer: "A quiet lounge is your sanctuary. A glass of champagne 'Le Monarque' will inspire a creative breakthrough that captures the spirit of the century.",
    leo: "Your charisma rivals the grand sunburst at the Ritz. Take center stage at the grand ballroom, for all eyes are destined to admire your exquisite frame.",
    virgo: "Meticulous design will save the day. A geometric puzzle in your architectural affairs will resolve itself once the saxophones begin to play.",
    libra: "Balance your champagne flutes and your social calendars. An unexpected telegram from Paris promises a shipment of hand-beaded silk gowns.",
    scorpio: "An enigma wrapped in velvet. A midnight car ride in a Zephyr-8 will reveal the location of the city's most exclusive, hidden salon.",
    sagittarius: "Adventure calls you beyond the concrete towers. A weekend excursion to the Gatsby estate will broaden your horizons and fill your dance card.",
    capricorn: "Your ambitions soar higher than the Chrysler building. Build your empire with symmetrical precision, and let the gold accents fall where they may.",
    aquarius: "A radical new philosophy beckons. Wear your bobbed hair with pride and lead the charge into the shimmering, electric future of the metropolis.",
    pisces: "A dream of syncopated rhythms will guide your steps. Trust the melody you hear at twilight, for it is the sound of prosperity arriving."
};

const signSelect = document.getElementById('sign-select');
const horoscopeText = document.getElementById('horoscope-text');

signSelect.addEventListener('change', () => {
    const selectedSign = signSelect.value;
    const prediction = horoscopes[selectedSign];
    
    horoscopeText.style.opacity = '0';
    
    setTimeout(() => {
        horoscopeText.textContent = prediction;
        horoscopeText.style.opacity = '1';
    }, 400);
});
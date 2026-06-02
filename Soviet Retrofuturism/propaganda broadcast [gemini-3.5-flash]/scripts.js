document.addEventListener('DOMContentLoaded', () => {
    initStardate();
    initTicker();
    initSlides();
    initDialsAndSwitches();
    initAudioEngine();
    initConsole();
    initPlanProgress();
});

/* ==========================================================================
   DYNAMIC TELEMETRY (STARDATE)
   ========================================================================== */
function initStardate() {
    const counterEl = document.getElementById('stardate-counter');
    if (!counterEl) return;

    function updateStardate() {
        const baseDate = 2105;
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const diff = now - startOfYear;
        const oneYear = 1000 * 60 * 60 * 24 * 365.25;
        const fraction = diff / oneYear;
        const stardate = (baseDate + fraction).toFixed(6);
        counterEl.textContent = stardate;
    }

    updateStardate();
    setInterval(updateStardate, 137);
}

/* ==========================================================================
   TICKER CLONING FOR SEAMLESS LOOP
   ========================================================================== */
function initTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
}

/* ==========================================================================
   DISPATCH SLIDESHOW
   ========================================================================== */
function initSlides() {
    const slides = document.querySelectorAll('.dispatch-slide');
    const dots = document.querySelectorAll('.nav-dot');
    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    
    if (!slides.length) return;
    
    let currentIndex = 0;
    let autoRotateTimer = null;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentIndex = (index + slides.length) % slides.length;
        
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    function startAutoRotation() {
        stopAutoRotation();
        autoRotateTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 8000);
    }

    function stopAutoRotation() {
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
        }
    }

    btnPrev.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startAutoRotation();
    });

    btnNext.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startAutoRotation();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoRotation();
        });
    });

    startAutoRotation();
}

/* ==========================================================================
   DIALS AND MECHANICAL SWITCHES
   ========================================================================== */
let audioVolume = 0.5;
let staticVolumeLevel = 0.15;
let signalQuality = 1.0;

function initDialsAndSwitches() {
    const dialSignal = document.getElementById('dial-signal');
    const dialVolume = document.getElementById('dial-volume');
    const toggleStatic = document.getElementById('btn-audio-static');
    const toggleAnthem = document.getElementById('btn-anthem');

    let signalRotation = 180;
    let volumeRotation = 150;

    if (dialSignal) {
        dialSignal.style.transform = `rotate(${signalRotation}deg)`;
        dialSignal.addEventListener('click', () => {
            signalRotation = (signalRotation + 45) % 360;
            dialSignal.style.transform = `rotate(${signalRotation}deg)`;
            signalQuality = Math.abs(Math.sin(signalRotation * Math.PI / 180));
            updateStaticInterference();
        });
    }

    if (dialVolume) {
        dialVolume.style.transform = `rotate(${volumeRotation}deg)`;
        dialVolume.addEventListener('click', () => {
            volumeRotation = (volumeRotation + 45) % 360;
            if (volumeRotation > 315) volumeRotation = 0;
            dialVolume.style.transform = `rotate(${volumeRotation}deg)`;
            audioVolume = volumeRotation / 315;
            updateGlobalVolume();
        });
    }

    if (toggleStatic) {
        toggleStatic.addEventListener('click', () => {
            toggleStatic.classList.toggle('active');
            const isActive = toggleStatic.classList.contains('active');
            staticVolumeLevel = isActive ? 0.15 : 0;
            updateStaticInterference();
        });
    }

    if (toggleAnthem) {
        toggleAnthem.addEventListener('click', () => {
            toggleAnthem.classList.toggle('active');
            const isActive = toggleAnthem.classList.contains('active');
            if (isActive) {
                startAnthemSeq();
            } else {
                stopAnthemSeq();
            }
        });
    }
}

/* ==========================================================================
   SYNTHETIC RETRO AUDIO ENGINE (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let staticNode = null;
let staticGainNode = null;
let masterGainNode = null;
let synthTimer = null;

function initAudioEngine() {
    document.body.addEventListener('click', ensureAudioContext, { once: true });
}

function ensureAudioContext() {
    if (audioCtx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(audioVolume, audioCtx.currentTime);
    masterGainNode.connect(audioCtx.destination);
    
    createStaticNoise();
}

function createStaticNoise() {
    if (!audioCtx) return;

    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    staticNode = audioCtx.createBufferSource();
    staticNode.buffer = noiseBuffer;
    staticNode.loop = true;

    staticGainNode = audioCtx.createGain();
    const currentNoiseLevel = (1.0 - signalQuality) * 0.2 + staticVolumeLevel;
    staticGainNode.gain.setValueAtTime(currentNoiseLevel, audioCtx.currentTime);

    staticNode.connect(staticGainNode);
    staticGainNode.connect(masterGainNode);
    staticNode.start();
}

function updateStaticInterference() {
    if (!staticGainNode || !audioCtx) return;
    const currentNoiseLevel = (1.0 - signalQuality) * 0.2 + staticVolumeLevel;
    staticGainNode.gain.linearRampToValueAtTime(currentNoiseLevel, audioCtx.currentTime + 0.1);
}

function updateGlobalVolume() {
    if (!masterGainNode || !audioCtx) return;
    masterGainNode.gain.linearRampToValueAtTime(audioVolume, audioCtx.currentTime + 0.1);
}

/* Procedural Soviet Retro-Synth Anthem Sequencer */
const ANTHEM_NOTES = [
    261.63, 329.63, 392.00, 329.63, 440.00, 392.00, 349.23, 261.63,
    293.66, 349.23, 440.00, 349.23, 493.88, 440.00, 392.00, 329.63,
    329.63, 392.00, 523.25, 392.00, 587.33, 523.25, 493.88, 392.00,
    440.00, 349.23, 392.00, 329.63, 349.23, 293.66, 329.63, 261.63
];

let seqStep = 0;

function playSynthNote(freq, duration) {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Slight analog detune simulation
    osc.detune.setValueAtTime((Math.random() - 0.5) * 8, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration - 0.02);
    
    osc.connect(gain);
    gain.connect(masterGainNode);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function startAnthemSeq() {
    stopAnthemSeq();
    seqStep = 0;
    
    function tick() {
        const freq = ANTHEM_NOTES[seqStep];
        playSynthNote(freq, 0.45);
        seqStep = (seqStep + 1) % ANTHEM_NOTES.length;
        synthTimer = setTimeout(tick, 500);
    }
    
    ensureAudioContext();
    tick();
}

function stopAnthemSeq() {
    if (synthTimer) {
        clearTimeout(synthTimer);
        synthTimer = null;
    }
}

/* ==========================================================================
   INTERACTIVE PROPAGANDA CONSOLE
   ========================================================================== */
const DEVIATION_REPLIES = [
    "LOGGING CITIZEN COMPLAINT... SECURING SYSTEM COMPLIANCE.",
    "SCANNING SECTOR FOR UN-COSMIC ATTITUDES... ALL CLEAR.",
    "REPORT SUBMITTED TO THE HIGH DEFENSE RADAR IN GAGARINGRAD.",
    "ALERT! NEIGHBOR SECTOR REGISTERED 0.02% DEVOTION SURGE.",
    "YOUR VIGILANCE INCREASES REPLICATOR SPEED BY 5%!",
    "COSMIC CADETS DISPATCHED TO INVESTIGATE ANOMALOUS CHATTER."
];

const RATION_REPLIES = [
    "VITAMINIZED RADISH STEW TOKEN GENERATED... COLLECT AT POD 4.",
    "EXTRA SUGAR BEET CONCENTRATE ALLOCATED FOR YOUR CONSTRUCTIVE BEHAVIOR.",
    "DENIED. REPORT TO HYDRO-WHEAT DISPOSAL DEPOT FOR EXERCISE.",
    "RATION MULTIPLIER GRANTED! CELEBRATE THE 12TH FIVE-YEAR GOAL.",
    "SYNTH-PROTEIN GEL PACK #12 HAS BEEN RETRO-ROUTED TO YOUR LIVING DECK.",
    "CITIZEN REWARD STACK: ONE BLOCK OF STATE-APPROVED CHICORY CONCENTRATE."
];

function initConsole() {
    const outputEl = document.getElementById('console-msg');
    const btnDev = document.getElementById('btn-report-deviation');
    const btnRat = document.getElementById('btn-request-ration');
    
    if (!outputEl) return;
    
    let typingTimer = null;

    function typeWriter(text) {
        if (typingTimer) clearInterval(typingTimer);
        outputEl.textContent = '';
        let index = 0;
        
        typingTimer = setInterval(() => {
            if (index < text.length) {
                outputEl.textContent += text[index];
                index++;
                
                // Add a cute little retro hum sound on typing if audio is live
                if (audioCtx && Math.random() > 0.4) {
                    playSynthNote(800 + Math.random() * 400, 0.02);
                }
            } else {
                clearInterval(typingTimer);
            }
        }, 30);
    }

    btnDev.addEventListener('click', () => {
        ensureAudioContext();
        const rand = DEVIATION_REPLIES[Math.floor(Math.random() * DEVIATION_REPLIES.length)];
        typeWriter(rand);
    });

    btnRat.addEventListener('click', () => {
        ensureAudioContext();
        const rand = RATION_REPLIES[Math.floor(Math.random() * RATION_REPLIES.length)];
        typeWriter(rand);
    });
}

/* ==========================================================================
   PLAN PROGRESS BAR SIMULATION (DYNAMIC STAKHANOVITE GROWTH)
   ========================================================================== */
function initPlanProgress() {
    const pct1 = document.getElementById('plan-1-pct');
    const pct2 = document.getElementById('plan-2-pct');
    const pct3 = document.getElementById('plan-3-pct');
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            if (pct1) {
                const cur = parseInt(pct1.textContent);
                pct1.textContent = `${cur + 1}%`;
            }
        }
        if (Math.random() > 0.85) {
            if (pct2) {
                const cur = parseInt(pct2.textContent);
                if (cur < 100) {
                    pct2.textContent = `${cur + 1}%`;
                    const bar = pct2.parentElement.nextElementSibling.firstElementChild;
                    if (bar) bar.style.width = `${cur + 1}%`;
                }
            }
        }
        if (Math.random() > 0.75) {
            if (pct3) {
                const cur = parseInt(pct3.textContent);
                pct3.textContent = `${cur + 1}%`;
            }
        }
    }, 4000);
}
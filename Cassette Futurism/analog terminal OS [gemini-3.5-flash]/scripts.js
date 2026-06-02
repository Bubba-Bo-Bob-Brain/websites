// CHRONOS-76 ANALOG OPERATING SYSTEM Core Control Unit

// Global State
let audioCtx = null;
let systemHums = [];
let tapeHiss = null;
let isAudioMuted = false;
let isPowerOn = true;

let tapePosition = 1200; // Counter value (arbitrary magnetic units)
let tapeState = 'STANDBY'; // 'STANDBY', 'READING', 'REWINDING', 'FORWARDING'
let tapeAnimationId = null;
let lastTime = 0;

let currentTrackIndex = 0;
let targetTrackIndex = 0;

// Dial Knob Values
let azimuthVal = 0.50;
let biasVal = 0.75;

// Elements cache
const bodyEl = document.body;
const btnInitialize = document.getElementById('btn-initialize');
const consentOverlay = document.getElementById('consent-overlay');
const powerToggle = document.getElementById('power-toggle');
const audioToggle = document.getElementById('audio-toggle');
const tapeStateText = document.getElementById('tape-state-text');
const tapeCounterEl = document.getElementById('tape-counter');
const sysStatusVal = document.getElementById('sys-status-val');
const activeSectorEl = document.getElementById('active-sector');

const leftReel = document.getElementById('left-reel');
const rightReel = document.getElementById('right-reel');
const leftTapeMass = document.getElementById('left-tape-mass');
const rightTapeMass = document.getElementById('right-tape-mass');

const needleReadGroup = document.getElementById('needle-read-group');
const needleFluxGroup = document.getElementById('needle-flux-group');

const tunerSliderNeedle = document.getElementById('tuner-slider-needle');
const tracksList = document.getElementById('tracks-list');
const trackRows = document.querySelectorAll('.track-row');

const tickerPaperStream = document.getElementById('ticker-paper-stream');
const btnClearTicker = document.getElementById('btn-clear-ticker');

const terminalInput = document.getElementById('terminal-input');
const terminalHistory = document.getElementById('terminal-history');
const macroButtons = document.querySelectorAll('.macro-btn');

const knobAzimuth = document.getElementById('knob-azimuth');
const knobBias = document.getElementById('knob-bias');
const valAzimuth = document.getElementById('val-azimuth');
const valBias = document.getElementById('val-bias');

// Setup Audio Synthesizer (Web Audio API)
function initAudio() {
    if (audioCtx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // 1. Industrial Transformer Hum (50Hz + harmonics)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const humGain = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.value = 50; // Mains frequency
    osc2.type = 'sawtooth';
    osc2.frequency.value = 100; // 2nd Harmonic
    
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    
    humGain.gain.value = 0.08;
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(humGain);
    humGain.connect(audioCtx.destination);
    
    osc1.start(0);
    osc2.start(0);
    
    systemHums.push(osc1, osc2, humGain);

    // 2. White Noise / Tape Hiss Emulator
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 6000;
    noiseFilter.Q.value = 1.2;
    
    const hissGain = audioCtx.createGain();
    hissGain.gain.value = 0.005; // Soft ambient hiss
    
    whiteNoiseSource.connect(noiseFilter);
    noiseFilter.connect(hissGain);
    hissGain.connect(audioCtx.destination);
    whiteNoiseSource.start(0);
    
    tapeHiss = hissGain;
}

// Play UI Click feedback
function playBeepClick(frequency, duration, type = 'sine', volume = 0.1) {
    if (!audioCtx || isAudioMuted || !isPowerOn) return;
    
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Safe catch if Web Audio block is active
    }
}

// Simulate Relay Switch Clunk sound
function playMechanicalSwitch() {
    playBeepClick(150, 0.04, 'triangle', 0.25);
    setTimeout(() => {
        playBeepClick(80, 0.08, 'sawtooth', 0.15);
    }, 20);
}

// Tape Drive Read/Write dynamic high frequency sound bursts
function playTapeDataChirp() {
    if (Math.random() > 0.4) {
        const frequency = 800 + Math.random() * 1200;
        playBeepClick(frequency, 0.03, 'sine', 0.04);
    }
}

// Initialize system elements
btnInitialize.addEventListener('click', () => {
    initAudio();
    consentOverlay.style.display = 'none';
    addTickerTapeLog("SYSTEM COILS INITIALIZED. POWER STEADY.");
    playMechanicalSwitch();
});

// Hardware Theme Selection Buttons
const themeButtons = [
    { btn: document.getElementById('btn-theme-amber'), class: 'theme-amber' },
    { btn: document.getElementById('btn-theme-green'), class: 'theme-green' },
    { btn: document.getElementById('btn-theme-cyan'), class: 'theme-cyan' }
];

themeButtons.forEach(item => {
    item.btn.addEventListener('click', () => {
        if (!isPowerOn) return;
        playBeepClick(600, 0.05, 'sine', 0.15);
        themeButtons.forEach(x => {
            x.btn.classList.remove('active');
            bodyEl.classList.remove(x.class);
        });
        item.btn.classList.add('active');
        bodyEl.classList.add(item.class);
        addTickerTapeLog(`PHOSPHOR CALIBRATION RESET TO: ${item.class.toUpperCase()}`);
    });
});

// Hardware Audio Toggle
audioToggle.addEventListener('change', () => {
    isAudioMuted = !audioToggle.checked;
    playMechanicalSwitch();
    
    // Toggle active label look
    const indicators = audioToggle.closest('.switch-housing').querySelectorAll('.switch-indicator-text');
    indicators[0].classList.toggle('active', isAudioMuted);
    indicators[1].classList.toggle('active', !isAudioMuted);

    if (tapeHiss && systemHums.length > 0) {
        const gainVal = isAudioMuted ? 0 : 1;
        tapeHiss.gain.value = isAudioMuted ? 0 : 0.005;
        if (systemHums[2]) {
            systemHums[2].gain.value = isAudioMuted ? 0 : 0.08;
        }
    }
});

// Hardware Power Switch
powerToggle.addEventListener('change', () => {
    isPowerOn = powerToggle.checked;
    playMechanicalSwitch();

    const indicators = powerToggle.closest('.switch-housing').querySelectorAll('.switch-indicator-text');
    indicators[0].classList.toggle('active', !isPowerOn);
    indicators[1].classList.toggle('active', isPowerOn);

    if (isPowerOn) {
        bodyEl.classList.remove('power-off');
        bodyEl.classList.add('power-on');
        if (tapeHiss && systemHums.length > 0 && !isAudioMuted) {
            tapeHiss.gain.value = 0.005;
            systemHums[2].gain.value = 0.08;
        }
        addTickerTapeLog("CORES RE-ENERGIZED. HIGH TENSION POWER RESTORED.");
    } else {
        bodyEl.classList.add('power-off');
        bodyEl.classList.remove('power-on');
        if (tapeHiss && systemHums.length > 0) {
            tapeHiss.gain.value = 0;
            systemHums[2].gain.value = 0;
        }
        haltTapeDrive();
    }
});

// Ticker Tape log outputs
function addTickerTapeLog(text) {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const line = document.createElement('div');
    line.className = 'ticker-line';
    line.innerText = `[${timestamp}] ${text}`;
    tickerPaperStream.appendChild(line);
    tickerPaperStream.scrollTop = tickerPaperStream.scrollHeight;
}

btnClearTicker.addEventListener('click', () => {
    if (!isPowerOn) return;
    playBeepClick(400, 0.06, 'triangle', 0.12);
    tickerPaperStream.innerHTML = '';
    addTickerTapeLog("TAPE MEMORY LOG SEVERED. NEW REGISTER MOUNTED.");
});

// Mechanical VU Needle physics engine
let needleReadTargetAngle = -45;
let needleFluxTargetAngle = -20;
let needleReadCurAngle = -45;
let needleFluxCurAngle = -20;

function updateVUMeters() {
    if (!isPowerOn) {
        needleReadCurAngle = -60;
        needleFluxCurAngle = -60;
    } else {
        // Base vibration noise
        let baseNoiseRead = (Math.random() - 0.5) * 5;
        let baseNoiseFlux = (Math.random() - 0.5) * 4;

        // Custom targets based on Tape State
        if (tapeState === 'READING') {
            needleReadTargetAngle = 0 + (Math.random() - 0.5) * 25;
            needleFluxTargetAngle = 10 + (Math.random() - 0.5) * 35;
            playTapeDataChirp();
        } else if (tapeState === 'REWINDING' || tapeState === 'FORWARDING') {
            needleReadTargetAngle = -35 + (Math.random() - 0.5) * 10;
            needleFluxTargetAngle = 40 + (Math.random() - 0.5) * 20;
        } else {
            // Standby low hum vibration
            needleReadTargetAngle = -45 + baseNoiseRead;
            needleFluxTargetAngle = -25 + baseNoiseFlux;
        }

        // Apply azimuth and bias knob values to modify VU levels slightly
        needleReadTargetAngle += (azimuthVal - 0.5) * 30;
        needleFluxTargetAngle += (biasVal - 0.75) * 40;

        // Soft interpolation spring physics
        needleReadCurAngle += (needleReadTargetAngle - needleReadCurAngle) * 0.25;
        needleFluxCurAngle += (needleFluxTargetAngle - needleFluxCurAngle) * 0.25;
    }

    needleReadGroup.setAttribute('transform', `rotate(${needleReadCurAngle}, 80, 90)`);
    needleFluxGroup.setAttribute('transform', `rotate(${needleFluxCurAngle}, 80, 90)`);

    requestAnimationFrame(updateVUMeters);
}
requestAnimationFrame(updateVUMeters);

// Tape Reel Mechanics Engine
function updateTapeReelLogic(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPowerOn) {
        tapeState = 'STANDBY';
        tapeStateText.innerText = "OFFLINE";
        sysStatusVal.innerText = "POWER DOWN";
        haltTapeAnimations();
        return;
    }

    let positionDelta = 0;

    if (tapeState === 'READING') {
        positionDelta = 0.15 * elapsed;
        sysStatusVal.innerText = "SECTOR READING";
        // Normal spin
        leftReel.classList.add('spinning-read');
        rightReel.classList.add('spinning-read');
        leftReel.classList.remove('spinning-fast-forward', 'spinning-rewind');
        rightReel.classList.remove('spinning-fast-forward', 'spinning-rewind');
    } else if (tapeState === 'FORWARDING') {
        positionDelta = 1.2 * elapsed;
        sysStatusVal.innerText = "FAST SEEKING";
        leftReel.classList.add('spinning-fast-forward');
        rightReel.classList.add('spinning-fast-forward');
        leftReel.classList.remove('spinning-read', 'spinning-rewind');
        rightReel.classList.remove('spinning-read', 'spinning-rewind');
    } else if (tapeState === 'REWINDING') {
        positionDelta = -1.2 * elapsed;
        sysStatusVal.innerText = "FAST REWINDING";
        leftReel.classList.add('spinning-rewind');
        rightReel.classList.add('spinning-rewind');
        leftReel.classList.remove('spinning-read', 'spinning-fast-forward');
        rightReel.classList.remove('spinning-read', 'spinning-fast-forward');
    } else {
        // Standby
        sysStatusVal.innerText = "MONITORING";
        haltTapeAnimations();
    }

    tapePosition += positionDelta;

    // Bounds lock
    if (tapePosition > 9999) {
        tapePosition = 9999;
        haltTapeDrive();
        addTickerTapeLog("CRITICAL: TAPE TERMINATION END POINT REACHED.");
        playBeepClick(1200, 0.4, 'sawtooth', 0.15);
    } else if (tapePosition < 0) {
        tapePosition = 0;
        haltTapeDrive();
        addTickerTapeLog("CRITICAL: TAPE ORIGIN POINT REACHED.");
        playBeepClick(1200, 0.4, 'sawtooth', 0.15);
    }

    // Render Tape Counter
    const displayCounter = Math.floor(tapePosition).toString().padStart(4, '0');
    tapeCounterEl.innerText = displayCounter;

    // Adjust Tape Thickness Mass visually depending on position
    const leftRadius = 68 - (tapePosition / 9999) * 28;
    const rightRadius = 40 + (tapePosition / 9999) * 28;
    
    leftTapeMass.setAttribute('r', leftRadius);
    leftTapeMass.setAttribute('stroke-width', (leftRadius - 25));
    
    rightTapeMass.setAttribute('r', rightRadius);
    rightTapeMass.setAttribute('stroke-width', (rightRadius - 25));

    tapeAnimationId = requestAnimationFrame(updateTapeReelLogic);
}

function haltTapeAnimations() {
    leftReel.classList.remove('spinning-read', 'spinning-fast-forward', 'spinning-rewind');
    rightReel.classList.remove('spinning-read', 'spinning-fast-forward', 'spinning-rewind');
}

function haltTapeDrive() {
    tapeState = 'STANDBY';
    tapeStateText.innerText = "STANDBY";
    document.querySelectorAll('.btn-tape-control').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-stop').classList.add('active');
}

// Tape Control Hardware Panel Actions
document.getElementById('btn-play').addEventListener('click', () => {
    if (!isPowerOn) return;
    playMechanicalSwitch();
    tapeState = 'READING';
    tapeStateText.innerText = "READ SPEED";
    document.querySelectorAll('.btn-tape-control').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-play').classList.add('active');
    addTickerTapeLog("TAPE READ SEQUENCER COMMENCED.");
});

document.getElementById('btn-stop').addEventListener('click', () => {
    if (!isPowerOn) return;
    playMechanicalSwitch();
    haltTapeDrive();
    addTickerTapeLog("MAGNETIC DRIVE CLUTCH DISENGAGED.");
});

document.getElementById('btn-fastforward').addEventListener('click', () => {
    if (!isPowerOn) return;
    playMechanicalSwitch();
    tapeState = 'FORWARDING';
    tapeStateText.innerText = "FWD SEEK";
    document.querySelectorAll('.btn-tape-control').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-fastforward').classList.add('active');
    addTickerTapeLog("FAST REEL CAPSTAN ADVANCING...");
});

document.getElementById('btn-rewind').addEventListener('click', () => {
    if (!isPowerOn) return;
    playMechanicalSwitch();
    tapeState = 'REWINDING';
    tapeStateText.innerText = "REW SEEK";
    document.querySelectorAll('.btn-tape-control').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-rewind').classList.add('active');
    addTickerTapeLog("FAST REEL REWIND SEQUENCE ENGAGED...");
});

// Kick off Reel Logic Loop
tapeAnimationId = requestAnimationFrame(updateTapeReelLogic);

// Tuner and File Selection Interaction
function selectTrack(index) {
    if (!isPowerOn) return;
    
    const selectedRow = trackRows[index];
    if (!selectedRow) return;

    currentTrackIndex = index;

    // Highlight active row visually
    trackRows.forEach(row => row.classList.remove('active'));
    selectedRow.classList.add('active');

    // Fetch details
    const trackName = selectedRow.querySelector('.track-name').innerText;
    const trackSector = selectedRow.dataset.sector;
    const trackSize = selectedRow.dataset.size;

    // Update Top Status Details
    activeSectorEl.innerText = trackSector;

    // Calculate simulated slider height position based on selected index
    const sliderPercentage = (index / (trackRows.length - 1)) * 90; // Up to 90% top offset
    tunerSliderNeedle.style.top = `${sliderPercentage}%`;

    // Mechanical Search Sweep Audio feedback
    playBeepClick(350 + (index * 80), 0.35, 'triangle', 0.18);
    
    // Auto initiate temporary fast tape spin seek
    tapeState = (index > targetTrackIndex) ? 'FORWARDING' : 'REWINDING';
    targetTrackIndex = index;
    tapeStateText.innerText = "INDEXING";

    addTickerTapeLog(`HEAD SEARCH ENGAGED: TRACK 0${index + 1} -> [${trackName}]`);

    setTimeout(() => {
        tapeState = 'READING';
        tapeStateText.innerText = "READING";
        addTickerTapeLog(`SECTOR LOCK COMPLETED. FILE [${trackName}] SIZE: ${trackSize} LOADED TO ROM BUFFER.`);
        playBeepClick(880, 0.15, 'sine', 0.2);
        
        // Print header inside terminal console
        writeTerminalLine(`>> LOADED FILE: ${trackName}`);
        writeTerminalLine(`>> SECTOR OFFSET: ${trackSector} | ROM RESIDENT.`);
    }, 1200);
}

// Wire up clicking on track items
trackRows.forEach((row, idx) => {
    row.addEventListener('click', () => {
        selectTrack(idx);
    });
});

// Mechanical Dragging / Wheel Logic on Rotators
function setupRotaryKnob(knobEl, displayEl, minVal, maxVal, step, unit = "") {
    let startY = 0;
    let startVal = parseFloat(knobEl.dataset.value);

    function onPointerMove(e) {
        const deltaY = startY - e.clientY;
        let newVal = startVal + deltaY * step;
        newVal = Math.max(minVal, Math.min(maxVal, newVal));
        
        knobEl.dataset.value = newVal;
        displayEl.innerText = newVal.toFixed(2) + unit;
        
        // Turn indicator inside knob
        const angle = ((newVal - minVal) / (maxVal - minVal)) * 270 - 135;
        knobEl.querySelector('.knob-indicator').style.transform = `rotate(${angle}deg)`;

        // Keep local memory
        if (knobEl.id === 'knob-azimuth') {
            azimuthVal = newVal;
        } else {
            biasVal = newVal;
        }

        // Slight micro clicks while rotating
        if (Math.floor(deltaY) % 5 === 0) {
            playBeepClick(1200, 0.005, 'sine', 0.02);
        }
    }

    function onPointerUp() {
        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('mouseup', onPointerUp);
    }

    knobEl.addEventListener('mousedown', (e) => {
        if (!isPowerOn) return;
        startY = e.clientY;
        startVal = parseFloat(knobEl.dataset.value);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);
    });
}

setupRotaryKnob(knobAzimuth, valAzimuth, 0.0, 1.0, 0.005, "");
setupRotaryKnob(knobBias, valBias, 0.0, 10.0, 0.05, "V");

// Terminal Shell Commands Logic
function writeTerminalLine(text) {
    const line = document.createElement('div');
    line.innerHTML = text;
    terminalHistory.appendChild(line);
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
}

terminalInput.addEventListener('keydown', (e) => {
    if (!isPowerOn) return;

    // Simulate mechanical key strike clicks
    if (e.key.length === 1) {
        playBeepClick(500 + Math.random() * 400, 0.015, 'triangle', 0.12);
    }

    if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim();
        terminalInput.value = '';
        if (rawCmd === '') return;

        playMechanicalSwitch();
        writeTerminalLine(`&gt; ${rawCmd.toUpperCase()}`);
        executeCommand(rawCmd);
    }
});

// Interactive commands
function executeCommand(inputString) {
    const tokens = inputString.toUpperCase().split(' ');
    const cmd = tokens[0];

    switch (cmd) {
        case 'HELP':
            writeTerminalLine("--- AVAILABLE ANALOG OPERATORS ---");
            writeTerminalLine("DIR      : LIST FILES ON ACTIVE CORE SECTORS");
            writeTerminalLine("READ     : RUN PLAYBACK ON MAGNETIC TAPE REELS");
            writeTerminalLine("TENSION  : RE-ALIGN PHYSICAL TAPE DRIVE CLUTCH");
            writeTerminalLine("DUMP     : HEX DUMP CURRENT TAPE SEGMENT");
            writeTerminalLine("SATELLITE: COMMENCE DEEP SPACE TELEMETRY SWEEP");
            writeTerminalLine("CLEAR    : ERASE CRT MONITOR SCREEN HISTORY");
            break;
        case 'DIR':
            writeTerminalLine("--- DIRECTORY OF TAPE SEGMENT 'CHRONOS-76' ---");
            trackRows.forEach(row => {
                const name = row.querySelector('.track-name').innerText;
                const size = row.dataset.size;
                writeTerminalLine(`* ${name.padEnd(25)} ${size}`);
            });
            addTickerTapeLog("ROM FILE DIRECTORY EXECUTED.");
            break;
        case 'READ':
            document.getElementById('btn-play').click();
            writeTerminalLine(">> INITIALIZING TAPE READ HEADS.");
            break;
        case 'TENSION':
            playBeepClick(220, 0.5, 'triangle', 0.3);
            writeTerminalLine(">> ADJUSTING DRIVE REEL TENSION CAPSTANS... OK.");
            addTickerTapeLog("TAPE CAPSTAN INDUCTIVE TENSION CALIBRATED.");
            break;
        case 'DUMP':
            writeTerminalLine("--- MEMORY CORE HEX DUMP ---");
            writeTerminalLine("0x0010: AD F1 2C 04 AA B2 FE DD 90 2A");
            writeTerminalLine("0x0020: 34 C1 4F 12 CC DE DA AB FA FF");
            writeTerminalLine("0x0030: E2 00 23 1C CF D0 02 AA D2 1C");
            addTickerTapeLog("HEXADECIMAL TELEMETRY CORE DUMP OUTPUT.");
            break;
        case 'SATELLITE':
            writeTerminalLine(">> CONNECTING COUPLER TO ORBITAL ARRAY...");
            addTickerTapeLog("COMMENCING ORBITAL TELEMETRY INTERCEPT...");
            setTimeout(() => {
                writeTerminalLine(">> SATELLITE CHRONOS-9 FOUND [AZIMUTH: 184.2]");
                writeTerminalLine(">> SIGNALS STEADY. FEEDING TELEMETRY DIRECT TO TICKER.");
                addTickerTapeLog("SAT-9: ORBITAL CORRECTION AT +12.4 SECS SUCCESSFUL.");
                playBeepClick(1500, 0.1, 'sine', 0.25);
            }, 1500);
            break;
        case 'CLEAR':
            terminalHistory.innerHTML = '';
            break;
        default:
            writeTerminalLine(`?? OPERATOR EXCEPTION: "${cmd}" NOT REGISTERED.`);
            playBeepClick(250, 0.3, 'sawtooth', 0.15);
            break;
    }
}

// Shortcut Macro Buttons
macroButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isPowerOn) return;
        const cmd = btn.dataset.cmd;
        playMechanicalSwitch();
        writeTerminalLine(`&gt; ${cmd}`);
        executeCommand(cmd);
    });
});

// Setup Initial Screen Text and start
addTickerTapeLog("CHRONOS-76 COLD BOOT COMPLETE. ROM LOAD 100%.");
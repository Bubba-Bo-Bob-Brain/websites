// ===== DOM ELEMENTS =====
const navCoords = document.getElementById('nav-coords');
const shieldIntegrity = document.getElementById('shield-integrity');
const targetLock = document.getElementById('target-lock');
const commsFreq = document.getElementById('comms-freq');
const chromeGrid = document.querySelector('.chrome-grid-floor');

// Buttons
const engageWarpBtn = document.getElementById('engage-warp');
const plotCourseBtn = document.getElementById('plot-course');
const raiseShieldsBtn = document.getElementById('raise-shields');
const lowerShieldsBtn = document.getElementById('lower-shields');
const firePhasersBtn = document.getElementById('fire-phasers');
const fireTorpedoesBtn = document.getElementById('fire-torpedoes');
const openChannelBtn = document.getElementById('open-channel');
const closeChannelBtn = document.getElementById('close-channel');

// Shield SVG
const integrityFill = document.querySelector('.integrity-fill');

// ===== STATE VARIABLES =====
let shieldsActive = true;
let targetLocked = false;
let warpEngaged = false;
let commsOpen = false;
let currentShieldIntegrity = 92;
let currentFreq = 5.73;
let gridSpeed = 20; // Default animation duration in seconds

// ===== SOUND EFFECTS (Optional) =====
// Note: In a real implementation, you'd load actual audio files.
// Here, we simulate the Web Audio API for synthwave beeps.
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(frequency = 800, duration = 0.1) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playSynthwaveTone() {
    const notes = [261.63, 329.63, 392.00, 440.00]; // C4, E4, G4, A4
    notes.forEach((freq, i) => {
        setTimeout(() => playBeep(freq, 0.2), i * 100);
    });
}

// ===== DYNAMIC READOUTS =====
// Randomize navigation coordinates
function updateNavCoords() {
    const x = (Math.random() * 100).toFixed(3);
    const y = (Math.random() * 100).toFixed(3);
    const z = (Math.random() * 100).toFixed(3);
    navCoords.textContent = `X: ${x} | Y: ${y} | Z: ${z}`;
}
setInterval(updateNavCoords, 3000);

// Randomize comms frequency
function updateCommsFreq() {
    currentFreq = (5 + Math.random() * 5).toFixed(2);
    commsFreq.textContent = `${currentFreq} MHz`;
}
setInterval(updateCommsFreq, 2000);

// Shield integrity fluctuations
function updateShieldIntegrity() {
    if (shieldsActive) {
        currentShieldIntegrity = Math.max(0, currentShieldIntegrity + (Math.random() * 2 - 0.5));
    } else {
        currentShieldIntegrity = Math.max(0, currentShieldIntegrity - (Math.random() * 1));
    }
    shieldIntegrity.textContent = `${Math.floor(currentShieldIntegrity)}%`;
    const circumference = 283; // 2 * PI * 45 (SVG circle radius)
    const offset = circumference - (currentShieldIntegrity / 100) * circumference;
    integrityFill.style.strokeDashoffset = offset;

    // Change color based on integrity
    if (currentShieldIntegrity < 30) {
        integrityFill.style.stroke = '#ff2a6d'; // Red
    } else if (currentShieldIntegrity < 70) {
        integrityFill.style.stroke = '#f9f002'; // Yellow
    } else {
        integrityFill.style.stroke = '#05d9e8'; // Cyan
    }
}
setInterval(updateShieldIntegrity, 500);

// ===== TARGET LOCK SEQUENCE =====
function toggleTargetLock() {
    targetLocked = !targetLocked;
    if (targetLocked) {
        targetLock.textContent = 'TARGET LOCKED';
        targetLock.style.color = '#00ff9f';
        targetLock.style.textShadow = '0 0 10px #00ff9f';
        playBeep(1000, 0.3);
    } else {
        targetLock.textContent = 'LOCKING...';
        targetLock.style.color = '#ff6b35';
        targetLock.style.textShadow = '0 0 10px #ff6b35';
    }
}

// ===== WARP DRIVE EFFECTS =====
function engageWarpDrive() {
    warpEngaged = !warpEngaged;
    if (warpEngaged) {
        engageWarpBtn.textContent = 'DISENGAGE WARP';
        chromeGrid.style.animationDuration = `${gridSpeed / 2}s`;
        document.body.style.animation = 'shake 0.5s infinite linear';
        playSynthwaveTone();
    } else {
        engageWarpBtn.textContent = 'ENGAGE WARP';
        chromeGrid.style.animationDuration = `${gridSpeed}s`;
        document.body.style.animation = 'none';
    }
}

// Add shake effect for warp drive
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 5px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, -5px); }
    }
`;
document.head.appendChild(style);

// ===== SHIELD CONTROLS =====
function toggleShields() {
    shieldsActive = !shieldsActive;
    const shieldStatusIndicator = document.querySelector('.shield-status');
    if (shieldsActive) {
        raiseShieldsBtn.textContent = 'LOWER SHIELDS';
        shieldStatusIndicator.style.background = '#05d9e8';
        shieldStatusIndicator.style.boxShadow = '0 0 10px #05d9e8';
        playBeep(600, 0.2);
    } else {
        raiseShieldsBtn.textContent = 'RAISE SHIELDS';
        shieldStatusIndicator.style.background = '#ff2a6d';
        shieldStatusIndicator.style.boxShadow = '0 0 10px #ff2a6d';
        playBeep(400, 0.2);
    }
}

// ===== WEAPON CONTROLS =====
function firePhasers() {
    if (targetLocked) {
        const reticle = document.querySelector('.reticle-ring');
        reticle.style.animation = 'none';
        setTimeout(() => {
            reticle.style.animation = 'rotateReticle 0.5s linear infinite';
        }, 100);
        playBeep(1200, 0.1);
        playBeep(1000, 0.1);
        setTimeout(() => toggleTargetLock(), 500);
    } else {
        alert('TARGET NOT LOCKED!');
    }
}

function fireTorpedoes() {
    if (targetLocked) {
        const crosshair = document.querySelector('.reticle-crosshair');
        crosshair.style.animation = 'none';
        crosshair.style.background = '#ff2a6d';
        setTimeout(() => {
            crosshair.style.animation = 'scanCrosshair 0.3s ease-in-out infinite alternate';
            crosshair.style.background = '#ff6b35';
        }, 300);
        playBeep(200, 0.5);
        setTimeout(() => toggleTargetLock(), 1000);
    } else {
        alert('TARGET NOT LOCKED!');
    }
}

// ===== COMMS CONTROLS =====
function toggleComms() {
    commsOpen = !commsOpen;
    const commsStatusIndicator = document.querySelector('.comms-status');
    if (commsOpen) {
        openChannelBtn.textContent = 'CLOSE CHANNEL';
        commsStatusIndicator.style.background = '#00ff9f';
        commsStatusIndicator.style.boxShadow = '0 0 10px #00ff9f';
        // Animate waveform bars
        const bars = document.querySelectorAll('.waveform-bar');
        bars.forEach(bar => {
            bar.style.animationDuration = '0.2s';
        });
        playBeep(800, 0.3);
    } else {
        openChannelBtn.textContent = 'OPEN CHANNEL';
        commsStatusIndicator.style.background = '#d300c5';
        commsStatusIndicator.style.boxShadow = '0 0 10px #d300c5';
        const bars = document.querySelectorAll('.waveform-bar');
        bars.forEach(bar => {
            bar.style.animationDuration = '0.5s';
        });
        playBeep(600, 0.2);
    }
}

// ===== EVENT LISTENERS =====
// Navigation
plotCourseBtn.addEventListener('click', () => {
    updateNavCoords();
    playBeep(700, 0.1);
});

// Shields
raiseShieldsBtn.addEventListener('click', toggleShields);
lowerShieldsBtn.addEventListener('click', toggleShields);

// Weapons
firePhasersBtn.addEventListener('click', firePhasers);
fireTorpedoesBtn.addEventListener('click', fireTorpedoes);

// Comms
openChannelBtn.addEventListener('click', toggleComms);
closeChannelBtn.addEventListener('click', toggleComms);

// Warp Drive
engageWarpBtn.addEventListener('click', engageWarpDrive);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': // Warp
            engageWarpDrive();
            break;
        case 'KeyS': // Shields
            toggleShields();
            break;
        case 'KeyF': // Fire Phasers
            firePhasers();
            break;
        case 'KeyT': // Fire Torpedoes
            fireTorpedoes();
            break;
        case 'KeyC': // Comms
            toggleComms();
            break;
        case 'KeyL': // Target Lock
            toggleTargetLock();
            break;
    }
});

// ===== INITIALIZE =====
// Set initial button states
lowerShieldsBtn.style.display = 'none';
closeChannelBtn.style.display = 'none';

// Start with shields active
toggleShields();
toggleShields(); // Reset to active (initial state)
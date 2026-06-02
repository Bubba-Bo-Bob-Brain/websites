const frequencyCanvas = document.getElementById("frequency-display");
const frequencyContext = frequencyCanvas.getContext("2d");

const starsFar = document.getElementById("stars-far");
const starsMid = document.getElementById("stars-mid");
const starsNear = document.getElementById("stars-near");
const gridFloor = document.querySelector(".chrome-grid-floor");

const warpSlider = document.getElementById("warp-slider");
const warpVal = document.getElementById("warp-val");

const coordX = document.getElementById("coord-x");
const coordY = document.getElementById("coord-y");
const coordZ = document.getElementById("coord-z");
const stardateTicker = document.getElementById("stardate-ticker");

const targetName = document.getElementById("target-name");
const targetDistance = document.getElementById("target-distance");
const targetLockPct = document.getElementById("target-lock-pct");

const shieldRing = document.getElementById("shield-ring");
const shieldPctVal = document.getElementById("shield-pct-val");
const toggleShieldsBtn = document.getElementById("toggle-shields");
const toggleDeflectorBtn = document.getElementById("toggle-deflector");
const hullPct = document.getElementById("hull-pct");
const hullBar = document.getElementById("hull-bar");

const weaponSlots = document.querySelectorAll(".weapon-slot");
const fireButton = document.getElementById("fire-button");

const commsFeed = document.getElementById("comms-feed");

const destinationButtons = document.querySelectorAll(".destination-selector .btn-console");

const btnAutoNav = document.getElementById("btn-auto-nav");
const btnOrbit = document.getElementById("btn-orbit");
const btnHyper = document.getElementById("btn-hyper");
const btnScan = document.getElementById("btn-scan");
const btnHolo = document.getElementById("btn-holo");
const btnChatter = document.getElementById("btn-chatter");

const destructInput = document.getElementById("destruct-input");
const btnDestruct = document.getElementById("btn-destruct");
const bridgeContainer = document.querySelector(".bridge-container");

let audioContextInstance = null;
let currentDestination = "neo-tokyo";
let shieldGeneratorOnline = true;
let deflectorArrayOnline = true;
let shieldChargeValue = 100;
let hullIntegrityValue = 92;
let activeWeaponId = "weapon-phasers";
let targetDistanceValue = 12408;
let alertSequenceActive = false;
let autoNavMode = false;
let holographicSimulationActive = false;

const spaceDestinations = {
    "neo-tokyo": {
        name: "NEO-TOKYO SECTOR",
        coords: [482.91, 910.44, 105.11],
        target: "CYBER_DREADNOUGHT",
        targetDistance: 12408
    },
    "chrome-nebula": {
        name: "CHROME NEBULA",
        coords: [104.55, 309.82, -450.78],
        target: "ASTEROID_MINING_RIG",
        targetDistance: 45902
    },
    "outrun-ridge": {
        name: "OUTRUN RIDGE",
        coords: [880.19, -512.04, 321.45],
        target: "SYNTH_PIRATE_RUNNER",
        targetDistance: 3105
    }
};

function initializeAudio() {
    if (!audioContextInstance) {
        audioContextInstance = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playRetroSound(frequency, duration, type, slideTo = null) {
    if (!audioContextInstance) return;
    
    const oscillator = audioContextInstance.createOscillator();
    const gainNode = audioContextInstance.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContextInstance.currentTime);
    
    if (slideTo) {
        oscillator.frequency.exponentialRampToValueAtTime(slideTo, audioContextInstance.currentTime + duration);
    }
    
    gainNode.gain.setValueAtTime(0.15, audioContextInstance.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextInstance.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextInstance.destination);
    
    oscillator.start();
    oscillator.stop(audioContextInstance.currentTime + duration);
}

function handleResize() {
    frequencyCanvas.width = frequencyCanvas.offsetWidth;
    frequencyCanvas.height = frequencyCanvas.offsetHeight;
}

function drawSynthwaveFrequencies() {
    requestAnimationFrame(drawSynthwaveFrequencies);
    
    frequencyContext.clearRect(0, 0, frequencyCanvas.width, frequencyCanvas.height);
    
    frequencyContext.shadowBlur = 8;
    frequencyContext.shadowColor = "#ff007f";
    frequencyContext.strokeStyle = "#ff007f";
    frequencyContext.lineWidth = 2;
    frequencyContext.beginPath();
    
    const sliceWidth = frequencyCanvas.width / 40;
    const timeFactor = Date.now() * 0.005;
    
    for (let i = 0; i <= 40; i++) {
        const x = i * sliceWidth;
        const baseSine = Math.sin(i * 0.3 + timeFactor);
        const noiseFactor = Math.sin(i * 0.8 - timeFactor * 1.5) * 0.4;
        const amplitude = alertSequenceActive ? 22 : (autoNavMode ? 15 : 8);
        const y = (frequencyCanvas.height / 2) + (baseSine + noiseFactor) * amplitude;
        
        if (i === 0) {
            frequencyContext.moveTo(x, y);
        } else {
            frequencyContext.lineTo(x, y);
        }
    }
    frequencyContext.stroke();

    frequencyContext.shadowColor = "#00f3ff";
    frequencyContext.strokeStyle = "#00f3ff";
    frequencyContext.lineWidth = 1;
    frequencyContext.beginPath();
    
    for (let i = 0; i <= 40; i++) {
        const x = i * sliceWidth;
        const baseSine = Math.cos(i * 0.4 - timeFactor * 0.8);
        const amplitude = alertSequenceActive ? 18 : 6;
        const y = (frequencyCanvas.height / 2) + baseSine * amplitude;
        
        if (i === 0) {
            frequencyContext.moveTo(x, y);
        } else {
            frequencyContext.lineTo(x, y);
        }
    }
    frequencyContext.stroke();
    frequencyContext.shadowBlur = 0;
}

function updateTelemetryData() {
    const currentStardate = parseFloat(stardateTicker.textContent);
    stardateTicker.textContent = (currentStardate + 0.001).toFixed(3);

    const activeDest = spaceDestinations[currentDestination];
    const warpFactorValue = parseFloat(warpSlider.value);
    
    const driftSpeed = warpFactorValue * 0.05;
    const dx = (Math.random() - 0.5) * driftSpeed;
    const dy = (Math.random() - 0.5) * driftSpeed;
    const dz = (Math.random() - 0.5) * driftSpeed;

    activeDest.coords[0] += dx;
    activeDest.coords[1] += dy;
    activeDest.coords[2] += dz;

    coordX.textContent = activeDest.coords[0].toFixed(2);
    coordY.textContent = activeDest.coords[1].toFixed(2);
    coordZ.textContent = activeDest.coords[2].toFixed(2);

    if (targetDistanceValue > 200) {
        targetDistanceValue -= Math.floor(warpFactorValue * 12);
        if (targetDistanceValue < 200) targetDistanceValue = 200;
        targetDistance.textContent = targetDistanceValue.toLocaleString() + " KM";
    }

    const lockVariation = (95 + Math.random() * 5).toFixed(1) + "%";
    targetLockPct.textContent = lockVariation;
}

function updateWarpSpeed() {
    const warpFactorValue = parseFloat(warpSlider.value);
    warpVal.textContent = warpFactorValue.toFixed(1);

    if (warpFactorValue === 0) {
        starsFar.style.animationPlayState = "paused";
        starsMid.style.animationPlayState = "paused";
        starsNear.style.animationPlayState = "paused";
        gridFloor.style.animationPlayState = "paused";
    } else {
        starsFar.style.animationPlayState = "running";
        starsMid.style.animationPlayState = "running";
        starsNear.style.animationPlayState = "running";
        gridFloor.style.animationPlayState = "running";

        const farDuration = 120 / warpFactorValue;
        const midDuration = 80 / warpFactorValue;
        const nearDuration = 40 / warpFactorValue;
        const gridDuration = 8 / warpFactorValue;

        starsFar.style.animationDuration = `${farDuration}s`;
        starsMid.style.animationDuration = `${midDuration}s`;
        starsNear.style.animationDuration = `${nearDuration}s`;
        gridFloor.style.animationDuration = `${gridDuration}s`;
    }
}

function updateShieldDisplay() {
    if (shieldGeneratorOnline) {
        shieldRing.style.borderColor = "var(--neon-cyan)";
        shieldRing.style.animationPlayState = "running";
        shieldPctVal.textContent = `${shieldChargeValue}%`;
        shieldPctVal.style.color = "var(--neon-cyan)";
    } else {
        shieldRing.style.borderColor = "rgba(255, 0, 0, 0.2)";
        shieldRing.style.animationPlayState = "paused";
        shieldPctVal.textContent = "OFFLINE";
        shieldPctVal.style.color = "var(--neon-red)";
    }
}

function handleShieldToggle() {
    initializeAudio();
    shieldGeneratorOnline = !shieldGeneratorOnline;
    if (shieldGeneratorOnline) {
        toggleShieldsBtn.textContent = "ONLINE";
        toggleShieldsBtn.classList.add("active");
        playRetroSound(440, 0.4, "sine", 880);
        appendCommsMessage("SYS", "Defensive Shield Generator activated.");
        regenerateShieldsGradually();
    } else {
        toggleShieldsBtn.textContent = "OFFLINE";
        toggleShieldsBtn.classList.remove("active");
        playRetroSound(880, 0.4, "sine", 220);
        appendCommsMessage("SYS_ALERT", "Shield Generator deactivated. Defenses vulnerable!");
        shieldChargeValue = 0;
        updateShieldDisplay();
    }
}

function regenerateShieldsGradually() {
    if (!shieldGeneratorOnline) return;
    if (shieldChargeValue < 100) {
        shieldChargeValue += 2;
        if (shieldChargeValue > 100) shieldChargeValue = 100;
        updateShieldDisplay();
        setTimeout(regenerateShieldsGradually, 150);
    }
}

function handleDeflectorToggle() {
    initializeAudio();
    deflectorArrayOnline = !deflectorArrayOnline;
    if (deflectorArrayOnline) {
        toggleDeflectorBtn.textContent = "ONLINE";
        toggleDeflectorBtn.classList.add("active");
        playRetroSound(520, 0.3, "sine", 1040);
        appendCommsMessage("SYS", "Deflector array targeting optimized.");
    } else {
        toggleDeflectorBtn.textContent = "OFFLINE";
        toggleDeflectorBtn.classList.remove("active");
        playRetroSound(1040, 0.3, "sine", 130);
        appendCommsMessage("SYS_ALERT", "Deflector field collapsed.");
    }
}

function appendCommsMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("feed-message");
    
    const senderSpan = document.createElement("span");
    senderSpan.classList.add("msg-sender");
    senderSpan.textContent = `[${sender.toUpperCase()}]: `;
    
    const textNode = document.createTextNode(message);
    
    messageElement.appendChild(senderSpan);
    messageElement.appendChild(textNode);
    commsFeed.appendChild(messageElement);
    
    commsFeed.scrollTop = commsFeed.scrollHeight;
}

function selectWeapon(event) {
    initializeAudio();
    const chosenSlot = event.currentTarget;
    weaponSlots.forEach(slot => slot.classList.remove("armed"));
    chosenSlot.classList.add("armed");
    activeWeaponId = chosenSlot.id;
    
    const weaponName = chosenSlot.querySelector(".weapon-name").textContent;
    playRetroSound(600, 0.15, "triangle", 900);
    appendCommsMessage("TACTICAL", `Selected and ready: ${weaponName}`);
}

function fireActiveWeapon() {
    initializeAudio();
    const activeSlot = document.getElementById(activeWeaponId);
    const weaponName = activeSlot.querySelector(".weapon-name").textContent;
    
    appendCommsMessage("TACTICAL", `DISCHARGING ${weaponName}!`);
    
    if (activeWeaponId === "weapon-phasers") {
        playRetroSound(1200, 0.6, "sawtooth", 150);
    } else if (activeWeaponId === "weapon-torpedoes") {
        playRetroSound(250, 0.8, "triangle", 80);
    } else {
        playRetroSound(1800, 1.2, "sawtooth", 1800);
    }

    const currentFlash = bridgeContainer.style.boxShadow;
    bridgeContainer.style.boxShadow = "inset 0 0 100px rgba(255, 0, 127, 0.8)";
    setTimeout(() => {
        bridgeContainer.style.boxShadow = currentFlash;
    }, 150);

    if (Math.random() > 0.4) {
        setTimeout(() => {
            appendCommsMessage("TACTICAL", "Target shield disruption detected.");
            playRetroSound(150, 0.3, "sawtooth");
        }, 600);
    }
}

function selectDestination(event) {
    initializeAudio();
    const destinationKey = event.currentTarget.getAttribute("data-dest");
    const chosenDestination = spaceDestinations[destinationKey];
    
    destinationButtons.forEach(btn => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");
    
    currentDestination = destinationKey;
    targetDistanceValue = chosenDestination.targetDistance;
    
    targetName.textContent = chosenDestination.target;
    targetDistance.textContent = targetDistanceValue.toLocaleString() + " KM";
    
    playRetroSound(300, 0.4, "sine", 600);
    appendCommsMessage("NAV", `Course plotted to ${chosenDestination.name}. Calculating optimal warp vector.`);
}

function handleAutoNavigation() {
    initializeAudio();
    autoNavMode = !autoNavMode;
    if (autoNavMode) {
        btnAutoNav.classList.add("alert-btn");
        appendCommsMessage("AUTO-PILOT", "Autopilot sequence active. System controlling thrusters.");
        playRetroSound(700, 0.2, "square");
    } else {
        btnAutoNav.classList.remove("alert-btn");
        appendCommsMessage("AUTO-PILOT", "Manual controls restored.");
        playRetroSound(500, 0.2, "square");
    }
}

function handleOrbitalLock() {
    initializeAudio();
    playRetroSound(800, 0.3, "sine", 400);
    appendCommsMessage("NAV", "Establishing planetary orbit stabilization...");
    setTimeout(() => {
        appendCommsMessage("NAV", "Orbital insertion sequence successful. Speed stabilized.");
    }, 1200);
}

function handleHyperDrive() {
    initializeAudio();
    appendCommsMessage("WARP_SYS", "Initiating hyper-drive safety override!");
    playRetroSound(150, 1.5, "sawtooth", 2000);
    warpSlider.value = 9.9;
    updateWarpSpeed();
}

function handleDeepScan() {
    initializeAudio();
    playRetroSound(100, 1.0, "sine", 800);
    appendCommsMessage("SENSORS", "Broadband spatial tachyon sweep in progress...");
    setTimeout(() => {
        appendCommsMessage("SENSORS", "Sweep completed. No hostile cloaked signals found.");
    }, 2000);
}

function handleHoloDeck() {
    initializeAudio();
    holographicSimulationActive = !holographicSimulationActive;
    if (holographicSimulationActive) {
        btnHolo.classList.add("alert-btn");
        bridgeContainer.style.filter = "hue-rotate(90deg) contrast(1.2)";
        appendCommsMessage("SYS", "Holographic grid simulation overlay active.");
        playRetroSound(600, 0.5, "triangle", 300);
    } else {
        btnHolo.classList.remove("alert-btn");
        bridgeContainer.style.filter = "none";
        appendCommsMessage("SYS", "Holographic overlay deactivated.");
        playRetroSound(300, 0.5, "triangle", 600);
    }
}

function handleDeNoise() {
    initializeAudio();
    playRetroSound(900, 0.1, "sine");
    appendCommsMessage("COMMS", "De-noised sub-space channels. Communication lines cleared.");
}

function handleSelfDestruct() {
    initializeAudio();
    const enteredCode = destructInput.value;
    
    if (enteredCode === "1988" || enteredCode === "8800") {
        if (!alertSequenceActive) {
            alertSequenceActive = true;
            destructInput.disabled = true;
            btnDestruct.textContent = "SAFE";
            bridgeContainer.style.animation = "grid-scroll 0.5s linear infinite";
            document.body.style.boxShadow = "inset 0 0 150px rgba(255, 0, 0, 0.9)";
            appendCommsMessage("SYS_ALERT", "SELF-DESTRUCT INITIATED. 60 SECONDS TO CORE EXPLOSION.");
            playSelfDestructAlarm();
        } else {
            abortSelfDestruct();
        }
    } else {
        playRetroSound(150, 0.5, "square");
        appendCommsMessage("SYS_ALERT", "INVALID SECURITY CODE. SECURITY PROTOCOL TRIGGERED.");
        destructInput.value = "";
    }
}

function playSelfDestructAlarm() {
    if (!alertSequenceActive) return;
    playRetroSound(660, 0.4, "sawtooth", 330);
    setTimeout(playSelfDestructAlarm, 1000);
}

function abortSelfDestruct() {
    alertSequenceActive = false;
    destructInput.disabled = false;
    destructInput.value = "";
    btnDestruct.textContent = "ARM";
    bridgeContainer.style.animation = "none";
    document.body.style.boxShadow = "none";
    appendCommsMessage("SYS", "Self-destruct cancelled. All systems returning to normal.");
    playRetroSound(440, 0.8, "sine", 880);
}

window.addEventListener("resize", handleResize);
warpSlider.addEventListener("input", updateWarpSpeed);
toggleShieldsBtn.addEventListener("click", handleShieldToggle);
toggleDeflectorBtn.addEventListener("click", handleDeflectorToggle);
fireButton.addEventListener("click", fireActiveWeapon);
btnAutoNav.addEventListener("click", handleAutoNavigation);
btnOrbit.addEventListener("click", handleOrbitalLock);
btnHyper.addEventListener("click", handleHyperDrive);
btnScan.addEventListener("click", handleDeepScan);
btnHolo.addEventListener("click", handleHoloDeck);
btnChatter.addEventListener("click", handleDeNoise);
btnDestruct.addEventListener("click", handleSelfDestruct);

weaponSlots.forEach(slot => {
    slot.addEventListener("click", selectWeapon);
});

destinationButtons.forEach(btn => {
    btn.addEventListener("click", selectDestination);
});

document.addEventListener("click", initializeAudio, { once: true });

handleResize();
drawSynthwaveFrequencies();
updateWarpSpeed();
updateShieldDisplay();
setInterval(updateTelemetryData, 100);
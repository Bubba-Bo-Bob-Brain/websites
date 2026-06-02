const ambientSoundButton = document.getElementById("btn-ambient-sound");
const shardCountDisplay = document.getElementById("shard-count");
const breakSealButton = document.getElementById("btn-break-seal");
const waxSeal = document.querySelector(".wax-seal");
const cursedSealOverlay = document.getElementById("cursed-seal-overlay");
const btnBidMinus = document.getElementById("btn-bid-minus");
const btnBidPlus = document.getElementById("btn-bid-plus");
const bidAmountInput = document.getElementById("bid-amount-input");
const btnSubmitBid = document.getElementById("btn-submit-bid");
const currentHighestBidDisplay = document.getElementById("current-highest-bid");
const currentLeaderDisplay = document.getElementById("current-leader");
const spectralLedgerRows = document.getElementById("spectral-ledger-rows");
const vaultEventLog = document.getElementById("vault-event-log");
const modalCovenant = document.getElementById("modal-covenant");
const modalBtnCancel = document.getElementById("modal-btn-cancel");
const modalBtnConfirm = document.getElementById("modal-btn-confirm");

let userSoulShards = 66609;
let currentHighestBid = 12450;
let currentLeader = "Arch-Lich Malakor";
let isAudioContextRunning = false;
let audioContext;
let masterGainNode;
let lowOscillator;
let highOscillator;
let filterNode;
let spaceDroneLFO;

const dynamicEntities = [
    "The Faceless Weaver",
    "Countess Bathory's Shade",
    "A Forgotten Demiurge",
    "The Bleeding Seraph",
    "Sovereign Yogg-Sothoth",
    "Baroness Vexia",
    "The Weeping Nun",
    "Arch-Lich Malakor",
    "An Unnamed Abomination",
    "The Collector of Sighs"
];

const occultWhispers = [
    "Do you hear the singing in the walls?",
    "Your shadow is stretching toward the seal...",
    "The blood of the innocent is never truly lost.",
    "Bidding is merely another word for binding.",
    "A soul is a temporary vessel; relics are eternal.",
    "The Void King demands a tribute of essence."
];

let grandRelicSecondsLeft = 13339;

const catalogItems = [
    { id: 2, secondsLeft: 4442, title: "SOUL-STITCHER'S NEEDLE", minOffer: 4200 },
    { id: 3, secondsLeft: 2531, title: "PHIAL OF STAR-GRAVE DUST", minOffer: 8950 },
    { id: 4, secondsLeft: 14995, title: "THE THIRD EYE OF ARGUS", minOffer: 15000 }
];

function initializeTimers() {
    setInterval(updateGrandRelicTimer, 1000);
    setInterval(updateCatalogTimers, 1000);
}

function updateGrandRelicTimer() {
    if (grandRelicSecondsLeft > 0) {
        grandRelicSecondsLeft--;
    } else {
        grandRelicSecondsLeft = 14400;
    }

    const hours = Math.floor(grandRelicSecondsLeft / 3600);
    const minutes = Math.floor((grandRelicSecondsLeft % 3600) / 60);
    const seconds = grandRelicSecondsLeft % 60;

    document.getElementById("time-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("time-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("time-seconds").textContent = String(seconds).padStart(2, "0");

    updateCandleMeltdown(hours, minutes, seconds);
}

function updateCandleMeltdown(h, m, s) {
    const hoursCandleWax = document.querySelector("#candle-hours .wax-body");
    const minutesCandleWax = document.querySelector("#candle-minutes .wax-body");
    const secondsCandleWax = document.querySelector("#candle-seconds .wax-body");

    if (hoursCandleWax) {
        hoursCandleWax.style.height = `${25 + (h * 3)}px`;
    }
    if (minutesCandleWax) {
        minutesCandleWax.style.height = `${20 + (m * 0.3)}px`;
    }
    if (secondsCandleWax) {
        secondsCandleWax.style.height = `${15 + (s * 0.4)}px`;
    }
}

function updateCatalogTimers() {
    catalogItems.forEach(item => {
        if (item.secondsLeft > 0) {
            item.secondsLeft--;
        } else {
            item.secondsLeft = 7200;
        }

        const h = Math.floor(item.secondsLeft / 3600);
        const m = Math.floor((item.secondsLeft % 3600) / 60);
        const s = item.secondsLeft % 60;

        const timerElement = document.getElementById(`timer-lot-${item.id}`);
        if (timerElement) {
            timerElement.innerHTML = `<i class="fa-regular fa-clock"></i> ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
        }
    });
}

function createAudioDrone() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    masterGainNode.connect(audioContext.destination);

    filterNode = audioContext.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(180, audioContext.currentTime);
    filterNode.connect(masterGainNode);

    lowOscillator = audioContext.createOscillator();
    lowOscillator.type = "sawtooth";
    lowOscillator.frequency.setValueAtTime(55, audioContext.currentTime);
    lowOscillator.connect(filterNode);

    highOscillator = audioContext.createOscillator();
    highOscillator.type = "sine";
    highOscillator.frequency.setValueAtTime(110, audioContext.currentTime);
    highOscillator.connect(filterNode);

    spaceDroneLFO = audioContext.createOscillator();
    spaceDroneLFO.type = "sine";
    spaceDroneLFO.frequency.setValueAtTime(0.2, audioContext.currentTime);
    
    const lfoGain = audioContext.createGain();
    lfoGain.gain.setValueAtTime(40, audioContext.currentTime);
    
    spaceDroneLFO.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);

    lowOscillator.start();
    highOscillator.start();
    spaceDroneLFO.start();
}

function toggleAudioDrone() {
    if (!audioContext) {
        createAudioDrone();
    }

    if (isAudioContextRunning) {
        masterGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
        ambientSoundButton.querySelector("i").className = "fa-solid fa-volume-xmark";
        ambientSoundButton.classList.remove("active");
        isAudioContextRunning = false;
        logEvent("Spectral Whispers silenced.", "system-msg");
    } else {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        masterGainNode.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 2.0);
        ambientSoundButton.querySelector("i").className = "fa-solid fa-volume-high";
        ambientSoundButton.classList.add("active");
        isAudioContextRunning = true;
        logEvent("The Void hums. Spectral Whispers activated.", "feed-msg");
        triggerWhisperSoundEffect(150, 0.1);
    }
}

function triggerWhisperSoundEffect(frequencyValue, duration) {
    if (!isAudioContextRunning || !audioContext) return;

    const whisperGain = audioContext.createGain();
    whisperGain.gain.setValueAtTime(0.02, audioContext.currentTime);
    whisperGain.connect(masterGainNode);

    const whisperOsc = audioContext.createOscillator();
    whisperOsc.type = "triangle";
    whisperOsc.frequency.setValueAtTime(frequencyValue, audioContext.currentTime);
    whisperOsc.connect(whisperGain);

    whisperOsc.start();
    whisperOsc.stop(audioContext.currentTime + duration);
}

function breakCursedSeal() {
    if (!cursedSealOverlay.classList.contains("active")) return;

    cursedSealOverlay.classList.remove("active");
    cursedSealOverlay.classList.add("broken");
    
    triggerSealDebrisExplosion();
    logEvent("CRITICAL: Covenant Seal Broken. Lot #013 revealed to the material plane.", "danger-msg");
    triggerWhisperSoundEffect(80, 0.8);
}

function triggerSealDebrisExplosion() {
    const parentContainer = cursedSealOverlay.parentElement;
    const sealRect = waxSeal.getBoundingClientRect();
    const parentRect = parentContainer.getBoundingClientRect();

    const explosionCenterX = sealRect.left - parentRect.left + (sealRect.width / 2);
    const explosionCenterY = sealRect.top - parentRect.top + (sealRect.height / 2);

    const runes = ["🜏", "🜎", "🜁", "🜄", "🜃", "🜂", "☠", "🜔", "🜕", "🜚"];

    for (let i = 0; i < 45; i++) {
        const particle = document.createElement("span");
        particle.textContent = runes[Math.floor(Math.random() * runes.length)];
        particle.style.position = "absolute";
        particle.style.left = `${explosionCenterX}px`;
        particle.style.top = `${explosionCenterY}px`;
        particle.style.color = Math.random() > 0.5 ? "var(--color-blood)" : "var(--color-occult-gold)";
        particle.style.fontSize = `${10 + Math.random() * 20}px`;
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "15";
        particle.style.textShadow = "0 0 8px rgba(207, 20, 43, 0.8)";
        
        parentContainer.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 8 + Math.random() * 18;
        const xTarget = Math.cos(angle) * velocity * 15;
        const yTarget = Math.sin(angle) * velocity * 15;
        const rotation = Math.random() * 720 - 360;

        const particleAnimation = particle.animate([
            { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
            { transform: `translate(${xTarget}px, ${yTarget}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1500,
            easing: "cubic-bezier(0.1, 0.8, 0.3, 1)"
        });

        particleAnimation.onfinish = () => {
            particle.remove();
        };
    }
}

function adjustBidInput(stepDirection) {
    const currentValue = parseInt(bidAmountInput.value) || currentHighestBid;
    const targetValue = currentValue + (stepDirection * 250);
    
    if (targetValue >= currentHighestBid + 50) {
        bidAmountInput.value = targetValue;
    }
}

function openCovenantModal() {
    const proposedBid = parseInt(bidAmountInput.value);

    if (cursedSealOverlay.classList.contains("active")) {
        logEvent("ACTION BLOCKED: You must break the Seal of Condemnation before bidding.", "danger-msg");
        return;
    }

    if (proposedBid <= currentHighestBid) {
        logEvent("TRANSACTION REJECTED: Your offering is insufficient.", "danger-msg");
        return;
    }

    if (proposedBid > userSoulShards) {
        logEvent("TRANSACTION REJECTED: Your soul reservoir contains insufficient shards.", "danger-msg");
        return;
    }

    modalCovenant.classList.add("active");
}

function closeCovenantModal() {
    modalCovenant.classList.remove("active");
}

function processUserBid() {
    const confirmedBid = parseInt(bidAmountInput.value);

    userSoulShards -= confirmedBid;
    currentHighestBid = confirmedBid;
    currentLeader = "Your Damned Soul";

    shardCountDisplay.textContent = userSoulShards.toLocaleString();
    currentHighestBidDisplay.textContent = currentHighestBid.toLocaleString();
    currentLeaderDisplay.innerHTML = `LEAD OFFERER: <span class="spectral-name">${currentLeader}</span>`;

    addLedgerRow("Just now", currentLeader, confirmedBid);
    logEvent(`COVENANT SEALED: You pledged ${confirmedBid.toLocaleString()} Shards on Lot #013.`, "feed-msg");
    triggerWhisperSoundEffect(440, 0.5);

    const minNextBid = currentHighestBid + 250;
    bidAmountInput.value = minNextBid;
    bidAmountInput.min = minNextBid;

    closeCovenantModal();
    simulateCounterBids();
}

function addLedgerRow(time, entityName, bidAmount) {
    const row = document.createElement("div");
    row.className = "ledger-row spectral-entry";
    row.innerHTML = `
        <span class="spectral-time">${time}</span>
        <span class="spectral-entity-name">${entityName}</span>
        <span class="spectral-bid-amount">${bidAmount.toLocaleString()} 🜎</span>
    `;

    spectralLedgerRows.insertBefore(row, spectralLedgerRows.firstChild);

    if (spectralLedgerRows.children.length > 5) {
        spectralLedgerRows.removeChild(spectralLedgerRows.lastChild);
    }
}

function logEvent(text, messageClass) {
    const date = new Date();
    const timestamp = `[${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}]`;
    
    const entry = document.createElement("p");
    entry.className = `log-entry ${messageClass}`;
    entry.textContent = `${timestamp} ${text}`;

    vaultEventLog.appendChild(entry);
    vaultEventLog.scrollTop = vaultEventLog.scrollHeight;

    if (vaultEventLog.children.length > 20) {
        vaultEventLog.removeChild(vaultEventLog.firstChild);
    }
}

function simulateCounterBids() {
    const delay = 4000 + Math.random() * 8000;
    setTimeout(() => {
        if (Math.random() > 0.4) {
            const outbiddingEntity = dynamicEntities[Math.floor(Math.random() * dynamicEntities.length)];
            const outbidIncrement = 250 + (Math.floor(Math.random() * 4) * 250);
            currentHighestBid += outbidIncrement;
            currentLeader = outbiddingEntity;

            currentHighestBidDisplay.textContent = currentHighestBid.toLocaleString();
            currentLeaderDisplay.innerHTML = `LEAD OFFERER: <span class="spectral-name">${currentLeader}</span>`;

            addLedgerRow("1s ago", currentLeader, currentHighestBid);
            logEvent(`OUTBID: ${currentLeader} raised the covenant to ${currentHighestBid.toLocaleString()} Shards.`, "danger-msg");
            
            triggerWhisperSoundEffect(220, 0.4);

            const minNextBid = currentHighestBid + 250;
            bidAmountInput.value = minNextBid;
            bidAmountInput.min = minNextBid;
        }
    }, delay);
}

function registerWhisperHoverEffects() {
    const hoverElements = document.querySelectorAll("[data-whisper]");
    hoverElements.forEach(element => {
        element.addEventListener("mouseenter", () => {
            const whisperText = element.getAttribute("data-whisper");
            triggerWhisperSoundEffect(300 + Math.random() * 300, 0.1);
            if (Math.random() > 0.5) {
                const randomWhisper = occultWhispers[Math.floor(Math.random() * occultWhispers.length)];
                logEvent(`*Whisper* "${randomWhisper}"`, "system-msg");
            } else {
                logEvent(`*Whisper* "${whisperText}"`, "system-msg");
            }
        });
    });
}

function simulateChamberEvents() {
    setInterval(() => {
        const events = [
            "The ambient room temperature drops by 6 degrees.",
            "A chilling breeze flickers the central candelabra.",
            "Distant laughter of lost souls resonates from the abyss.",
            "The Void King's Heart beats irregularly. Keep your distance.",
            "Astral alignment suggests a localized curse anomaly.",
            "Your shadow appears to be looking back at you.",
            "Lot #014 is starting to emit a low, vibrating hum.",
            "An unspeakable entity passes through the circle of transaction."
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        logEvent(randomEvent, "system-msg");
    }, 15000);
}

function handleCatalogBidding(event) {
    const targetButton = event.target;
    if (!targetButton.classList.contains("catalog-bid-btn")) return;

    const lotId = targetButton.getAttribute("data-target");
    const lotCard = targetButton.closest(".catalog-card");
    const lotTitle = lotCard.querySelector(".catalog-item-title").textContent;
    const priceValueString = lotCard.querySelector(".price-val").textContent;
    const currentPrice = parseInt(priceValueString.replace(/[^0-9]/g, ""));

    if (userSoulShards < currentPrice) {
        logEvent(`TRANSACTION REJECTED: Your essence cannot cover the reserve price for ${lotTitle}.`, "danger-msg");
        return;
    }

    userSoulShards -= currentPrice;
    shardCountDisplay.textContent = userSoulShards.toLocaleString();

    const newPrice = Math.floor(currentPrice * 1.15);
    lotCard.querySelector(".price-val").textContent = `${newPrice.toLocaleString()} 🜎`;

    logEvent(`ACQUISITION SECURED: You placed a winning pact on ${lotTitle} for ${currentPrice.toLocaleString()} Shards.`, "feed-msg");
    triggerWhisperSoundEffect(600, 0.3);

    targetButton.textContent = "SECURED";
    targetButton.disabled = true;
    targetButton.style.borderColor = "var(--color-spectral)";
    targetButton.style.color = "var(--color-spectral)";
}

function attachEventListeners() {
    ambientSoundButton.addEventListener("click", toggleAudioDrone);
    breakSealButton.addEventListener("click", breakCursedSeal);
    waxSeal.addEventListener("click", breakCursedSeal);
    
    btnBidMinus.addEventListener("click", () => adjustBidInput(-1));
    btnBidPlus.addEventListener("click", () => adjustBidInput(1));
    btnSubmitBid.addEventListener("click", openCovenantModal);

    modalBtnCancel.addEventListener("click", closeCovenantModal);
    modalBtnConfirm.addEventListener("click", processUserBid);

    document.querySelector(".catalog-grid").addEventListener("click", handleCatalogBidding);
}

function initializeVault() {
    initializeTimers();
    attachEventListeners();
    registerWhisperHoverEffects();
    simulateChamberEvents();
}

window.addEventListener("DOMContentLoaded", initializeVault);
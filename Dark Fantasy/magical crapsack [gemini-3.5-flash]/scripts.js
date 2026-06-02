const regionalDatabase = {
    fens: {
        name: "The Whispering Fens",
        threat: "Silt-Lurkers & Rot-Spore",
        threatLevel: "threat-high",
        lifeExpectancy: "34 Cycles",
        toxicity: "Extremely Lethal",
        lore: "A swamp of liquefied marrow and decayed memory. Those who venture here hear the weeping voices of their unborn ancestors. To inhale the mist is to guarantee a slow crystallization of the lungs within three lunar cycles."
    },
    spire: {
        name: "The Sanguine Spire",
        threat: "Eldritch Hemomancers",
        threatLevel: "threat-severe",
        lifeExpectancy: "12 Cycles",
        toxicity: "Atmospheric Blood Mist",
        lore: "An impossible needle of black obsidian pointing toward the dying sun. Blood is drawn from the pores of any living creature that approaches within three leagues, ascending in a spiral toward the summit."
    },
    plains: {
        name: "The Ashen Plains",
        threat: "Glass-Storms & Flayed Husks",
        threatLevel: "threat-high",
        lifeExpectancy: "45 Cycles",
        toxicity: "Calcified Ash Fallout",
        lore: "Once a great kingdom, now a grey desert where the soil is literal ground bone. Violent glass-storms scrape flesh from bone in seconds, leaving behind weeping husks that walk the wastes in endless agony."
    },
    abyss: {
        name: "The Abyssal Trench",
        threat: "The Blind Leviathan",
        threatLevel: "threat-severe",
        lifeExpectancy: "0.2 Cycles",
        toxicity: "Soul-Crushing Gravity",
        lore: "The deep scar of Mortis-Terra where light has been legally outlawed by cosmic forces. The pressure is so intense that thoughts themselves are crushed into physical weight, driving all visitors immediately mad."
    }
};

const ancientCurses = [
    {
        name: "The Rotting Crown",
        description: "Your scalp will slowly sprout sharp crowns of black iron that grow inward, flooding your mind with the screams of long-dead kings.",
        severity: "Terminal",
        duration: "13 Moons"
    },
    {
        name: "Marrow-Weep",
        description: "Your bones slowly turn to warm liquid, weeping through your skin as red salt. Your skeletal structural integrity degrades weekly.",
        severity: "Severe",
        duration: "40 Moons"
    },
    {
        name: "Shadow-Eater's Sight",
        description: "Your eyes glaze over with black mold. You can only see living entities, but you see them as weeping, flayed skeletons screaming for release.",
        severity: "Incurable",
        duration: "Indefinite"
    },
    {
        name: "The Glass-Lung Curse",
        description: "Every breath you draw crystallizes into tiny volcanic shards within your throat. You cough up red glass with every word spoken.",
        severity: "Terminal",
        duration: "3 Moons"
    },
    {
        name: "Parasitic Shadow",
        description: "Your shadow detaches from your feet at night, whispering your deepest secrets to the local horrors and slowly strangling you while you sleep.",
        severity: "Severe",
        duration: "66 Moons"
    }
];

const artifactLore = {
    "iron-cradle": {
        title: "The Iron Cradle",
        text: "An iron torture-harness designed for infants of high nobility. Those locked inside never age, but their continuous weeping feeds the black soil below."
    },
    "weeping-chalice": {
        title: "Chalice of Weeping Marrow",
        text: "Drinking from this goblet grants deep cosmic revelations, but permanently converts the user's bone marrow into slow-burning brimstone."
    },
    "cinder-eye": {
        title: "The Cinder-Bound Eye",
        text: "The fossilized eyeball of a forgotten deity. It constantly drips warm black tar and stares unblinkingly at the nearest source of despair."
    }
};

const state = {
    audioInitialized: false,
    audioContext: null,
    droneNode: null,
    filterNode: null,
    noiseNode: null
};

function initializeCustomCursor() {
    const cursor = document.getElementById("custom-cursor");
    
    document.addEventListener("mousemove", (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    });

    document.addEventListener("mousedown", () => {
        cursor.classList.add("clicking");
    });

    document.addEventListener("mouseup", () => {
        cursor.classList.remove("clicking");
    });
}

function initializeAshFall() {
    const container = document.getElementById("ash-particles");
    const maxParticles = 45;

    for (let i = 0; i < maxParticles; i++) {
        createAshParticle(container);
    }
}

function createAshParticle(container) {
    const particle = document.createElement("div");
    particle.classList.add("ash-particle");
    
    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * -20;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}vw`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
}

function initializeMiseryIndex() {
    const miseryValueElement = document.getElementById("misery-value");
    let baseMisery = 99.8412;

    setInterval(() => {
        baseMisery += Math.random() * 0.0003;
        if (baseMisery >= 100) {
            baseMisery = 99.9999;
        }
        miseryValueElement.textContent = `${baseMisery.toFixed(4)}%`;
    }, 2500);
}

function initializeEclipseCountdown() {
    const timerElement = document.getElementById("countdown-timer");
    let hours = 14;
    let minutes = 32;
    let seconds = 45;
    let milliseconds = 99;

    setInterval(() => {
        milliseconds--;
        if (milliseconds < 0) {
            milliseconds = 99;
            seconds--;
        }
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        if (hours < 0) {
            hours = 24;
        }

        const hStr = String(hours).padStart(2, "0");
        const mStr = String(minutes).padStart(2, "0");
        const sStr = String(seconds).padStart(2, "0");
        const msStr = String(milliseconds).padStart(2, "0");

        timerElement.textContent = `${hStr}:${mStr}:${sStr}:${msStr}`;
    }, 10);
}

function initializeBlightedMap() {
    const nodes = document.querySelectorAll(".map-node");
    const dynName = document.getElementById("dyn-region-name");
    const dynThreat = document.getElementById("dyn-region-threat");
    const dynLife = document.getElementById("dyn-region-life");
    const dynTox = document.getElementById("dyn-region-tox");
    const dynLore = document.getElementById("dyn-region-lore");

    nodes.forEach(node => {
        node.addEventListener("click", () => {
            nodes.forEach(n => n.classList.remove("node-active"));
            node.classList.add("node-active");

            const regionKey = node.getAttribute("data-region");
            const data = regionalDatabase[regionKey];

            if (data) {
                dynName.textContent = data.name;
                dynThreat.textContent = data.threat;
                dynThreat.className = data.threatLevel;
                dynLife.textContent = data.lifeExpectancy;
                dynTox.textContent = data.toxicity;
                dynLore.textContent = data.lore;
            }
        });
    });
}

function initializeCurseBinder() {
    const form = document.getElementById("affliction-form");
    const output = document.getElementById("curse-output");
    const cName = document.getElementById("curse-name");
    const cDesc = document.getElementById("curse-desc");
    const cSeverity = document.getElementById("curse-severity");
    const cDuration = document.getElementById("curse-duration");

    form.addEventListener("submit", () => {
        const inputName = document.getElementById("mortal-name").value.trim();
        if (!inputName) return;

        const curseIndex = Math.abs(hashString(inputName)) % ancientCurses.length;
        const selectedCurse = ancientCurses[curseIndex];

        cName.textContent = selectedCurse.name;
        cDesc.textContent = `Behold, ${inputName}. Your offering has been consumed. ${selectedCurse.description}`;
        cSeverity.textContent = selectedCurse.severity;
        cDuration.textContent = selectedCurse.duration;

        output.classList.remove("hidden");
        output.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function initializeReliquary() {
    const cards = document.querySelectorAll(".artifact-card");
    const title = document.getElementById("inspect-title");
    const text = document.getElementById("inspect-text");

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            const key = card.getAttribute("data-artifact");
            const data = artifactLore[key];
            if (data) {
                title.textContent = data.title;
                text.textContent = data.text;
                
                const statusText = card.querySelector(".artifact-status");
                if (statusText) {
                    statusText.textContent = "INSPECTING ANCIENT COGNITION";
                    statusText.classList.remove("locked");
                    statusText.classList.add("active");
                }
            }
        });

        card.addEventListener("mouseleave", () => {
            const statusText = card.querySelector(".artifact-status");
            if (statusText) {
                statusText.textContent = "RESONATING DREAD";
                statusText.classList.remove("active");
                statusText.classList.add("locked");
            }
        });
    });
}

function initializeCovenantSelector() {
    const buttons = document.querySelectorAll(".cov-btn");
    const root = document.documentElement;

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const cov = btn.getAttribute("data-cov");
            if (cov === "iron") {
                root.style.setProperty("--color-blood", "#6b0c0c");
                root.style.setProperty("--color-blood-glow", "#b11616");
                root.style.setProperty("--shadow-blood", "0 0 15px rgba(107, 12, 12, 0.6)");
            } else if (cov === "rot") {
                root.style.setProperty("--color-blood", "#3a4731");
                root.style.setProperty("--color-blood-glow", "#638250");
                root.style.setProperty("--shadow-blood", "0 0 15px rgba(58, 71, 49, 0.6)");
            } else if (cov === "ash") {
                root.style.setProperty("--color-blood", "#47433c");
                root.style.setProperty("--color-blood-glow", "#8c8275");
                root.style.setProperty("--shadow-blood", "0 0 15px rgba(140, 130, 117, 0.6)");
            }
        });
    });
}

function initializeAmbientSynth() {
    const toggle = document.getElementById("ambient-toggle");
    const textLabel = toggle.querySelector(".sound-text");

    toggle.addEventListener("click", () => {
        if (!state.audioInitialized) {
            setupAudioSynthesis();
            state.audioInitialized = true;
            textLabel.textContent = "CHAMBER WHISPERS: ON";
            toggle.style.borderColor = "var(--color-blood-glow)";
        } else {
            if (state.audioContext.state === "suspended") {
                state.audioContext.resume();
                textLabel.textContent = "CHAMBER WHISPERS: ON";
            } else if (state.audioContext.state === "running") {
                state.audioContext.suspend();
                textLabel.textContent = "CHAMBER WHISPERS: OFF";
            }
        }
    });
}

function setupAudioSynthesis() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContextClass();

    const lowOscillator = state.audioContext.createOscillator();
    const midOscillator = state.audioContext.createOscillator();
    const filter = state.audioContext.createBiquadFilter();
    const masterGain = state.audioContext.createGain();

    lowOscillator.type = "sawtooth";
    lowOscillator.frequency.value = 45; 

    midOscillator.type = "sine";
    midOscillator.frequency.value = 90; 

    filter.type = "lowpass";
    filter.frequency.value = 150; 
    filter.Q.value = 8;

    masterGain.gain.value = 0.18;

    lowOscillator.connect(filter);
    midOscillator.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(state.audioContext.destination);

    lowOscillator.start();
    midOscillator.start();

    setupAtmosphericCrackle(masterGain);
}

function setupAtmosphericCrackle(destinationNode) {
    const bufferSize = 2 * state.audioContext.sampleRate;
    const noiseBuffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
    const outputBuffer = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        outputBuffer[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = state.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = state.audioContext.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 3.0;

    const noiseGain = state.audioContext.createGain();
    noiseGain.gain.value = 0.015;

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destinationNode);

    whiteNoise.start();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeCustomCursor();
    initializeAshFall();
    initializeMiseryIndex();
    initializeEclipseCountdown();
    initializeBlightedMap();
    initializeCurseBinder();
    initializeReliquary();
    initializeCovenantSelector();
    initializeAmbientSynth();
});
const preloader = document.getElementById("preloader");
const enterButton = document.getElementById("enter-btn");
const interactiveChart = document.getElementById("interactive-chart");
const celestialDome = document.getElementById("celestial-dome");
const wakeCanvas = document.getElementById("wake-canvas");
const canvasContext = wakeCanvas.getContext("2d");

const toggleStars = document.getElementById("toggle-stars");
const toggleCurrents = document.getElementById("toggle-currents");
const toggleSticks = document.getElementById("toggle-sticks");
const toggleWake = document.getElementById("toggle-wake");

const quadrantButtons = document.querySelectorAll(".quadrant-btn");
const houseDescription = document.getElementById("house-description");
const constellationButtons = document.querySelectorAll(".const-btn");
const loreTarget = document.getElementById("lore-target");

const starNodes = document.querySelectorAll(".interactive-star");
const islandNodes = document.querySelectorAll(".island-node");

const statPitch = document.getElementById("stat-pitch");
const statSwell = document.getElementById("stat-swell");
const statLat = document.getElementById("stat-lat");
const statZenith = document.getElementById("stat-zenith");

const ambientToggle = document.getElementById("ambient-toggle");
const volumeSlider = document.getElementById("volume-slider");

let isAudioInitialized = false;
let audioContext;
let oceanHumNode;
let waveFilterNode;
let lowFrequencyOscillator;
let masterGainNode;
let isAudioPlaying = false;

let isDragging = false;
let startAngle = 0;
let currentRotation = 0;
let baseRotation = 0;

let wakeParticles = [];
let isWakeEnabled = true;

const quadrantLore = {
    koolau: {
        title: "Koʻolau (North-East)",
        desc: "The quadrant of the trade winds, where key guiding stars rise to guide voyages towards Tahiti and the Marquesas."
    },
    malanai: {
        title: "Malanai (South-East)",
        desc: "The horizon of creation. Stars rising here represent ancestral pathways and guide navigators towards the Southern Cross."
    },
    kona: {
        title: "Kona (South-West)",
        desc: "The quadrant of heavy seas and southern storms. Home to stars that guide navigators returning from the extreme south."
    },
    hoolua: {
        title: "Hoʻolua (North-West)",
        desc: "The quadrant of the setting sun and celestial descent. Navigators watch stars setting here to double-check heading alignments."
    }
};

const constellationLore = {
    fishhook: {
        title: "Manaiakalani (Maui's Fishhook)",
        desc: "Scorpius constellation. Represents the legendary bone hook used by Maui to pull the Hawaiian islands from the depths of the ocean floor. Aligns directly with southern routes.",
        id: "const-fishhook"
    },
    pointer: {
        title: "Nā Hānai (The Southern Cross)",
        desc: "Crux constellation. The ultimate navigational pointer. When the top and bottom stars of the cross line up vertically, they point directly to true South.",
        id: "const-pointer"
    },
    pleiades: {
        title: "Makaliʻi (The Little Eyes)",
        desc: "The Pleiades cluster. Its rising in the late autumn sky signals the start of the Makahiki harvest season and a period of deep spiritual peace across Polynesia.",
        id: "const-pleiades"
    },
    "canoe-bailer": {
        title: "Kāheiheilu (The Great Canoe Bailer)",
        desc: "A giant cosmic scoop encompassing stars of Orion and Taurus. Represents the tool used to empty water from double-hulled voyaging canoes during rough oceanic crossings.",
        id: "const-canoe-bailer"
    }
};

const defaultLoreHTML = `
    <div class="empty-lore-state">
        <p>Select a star constellation, hover an island shell, or spin the celestial dome to unlock navigation wisdom.</p>
        <div class="carved-tiki-accent">
            <svg viewBox="0 0 100 40" class="tiki-mini-svg">
                <path d="M10,20 Q30,10 50,20 Q70,10 90,20 M10,30 Q30,35 50,30 Q70,35 90,30" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="30" cy="20" r="4" fill="currentColor" />
                <circle cx="70" cy="20" r="4" fill="currentColor" />
            </svg>
        </div>
    </div>
`;

function initializeApp() {
    setupPreloader();
    setupCanvas();
    setupRotationControl();
    setupToggles();
    setupQuadrants();
    setupConstellations();
    setupHoverables();
    setupAudioSystem();
    animateParticles();
}

function setupPreloader() {
    enterButton.addEventListener("click", () => {
        preloader.classList.add("fade-out");
        if (!isAudioInitialized) {
            startSynthesizer();
        }
    });
}

function setupCanvas() {
    function resizeCanvas() {
        const bounds = interactiveChart.getBoundingClientRect();
        wakeCanvas.width = bounds.width;
        wakeCanvas.height = bounds.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}

function getAngle(clientX, clientY) {
    const rect = interactiveChart.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX);
}

function setupRotationControl() {
    interactiveChart.addEventListener("mousedown", (event) => {
        if (event.target.closest(".interactive-star") || event.target.closest(".island-node")) return;
        isDragging = true;
        startAngle = getAngle(event.clientX, event.clientY) - baseRotation;
    });

    window.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        const currentAngle = getAngle(event.clientX, event.clientY);
        currentRotation = currentAngle - startAngle;
        celestialDome.style.transform = `rotate(${currentRotation * (180 / Math.PI)}deg)`;
        
        const headingDegrees = Math.round((currentRotation * (180 / Math.PI)) % 360);
        updateDynamicHUD(headingDegrees);
    });

    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            baseRotation = currentRotation;
        }
    });

    interactiveChart.addEventListener("touchstart", (event) => {
        if (event.target.closest(".interactive-star") || event.target.closest(".island-node")) return;
        isDragging = true;
        const touch = event.touches[0];
        startAngle = getAngle(touch.clientX, touch.clientY) - baseRotation;
    }, { passive: true });

    window.addEventListener("touchmove", (event) => {
        if (!isDragging) return;
        const touch = event.touches[0];
        const currentAngle = getAngle(touch.clientX, touch.clientY);
        currentRotation = currentAngle - startAngle;
        celestialDome.style.transform = `rotate(${currentRotation * (180 / Math.PI)}deg)`;
        
        const headingDegrees = Math.round((currentRotation * (180 / Math.PI)) % 360);
        updateDynamicHUD(headingDegrees);
    }, { passive: true });

    window.addEventListener("touchend", () => {
        if (isDragging) {
            isDragging = false;
            baseRotation = currentRotation;
        }
    });
}

function updateDynamicHUD(headingDegrees) {
    let normalizedHeading = headingDegrees < 0 ? headingDegrees + 360 : headingDegrees;
    let headingText = "East-North-East";
    
    if (normalizedHeading >= 337 || normalizedHeading < 22) headingText = "North (Hōkūpaʻa)";
    else if (normalizedHeading >= 22 && normalizedHeading < 67) headingText = "North-East (Koʻolau)";
    else if (normalizedHeading >= 67 && normalizedHeading < 112) headingText = "East (Hikina)";
    else if (normalizedHeading >= 112 && normalizedHeading < 157) headingText = "South-East (Malanai)";
    else if (normalizedHeading >= 157 && normalizedHeading < 202) headingText = "South (Hema)";
    else if (normalizedHeading >= 202 && normalizedHeading < 247) headingText = "South-West (Kona)";
    else if (normalizedHeading >= 247 && normalizedHeading < 292) headingText = "West (Komohana)";
    else if (normalizedHeading >= 292 && normalizedHeading < 337) headingText = "North-West (Hoʻolua)";

    statSwell.textContent = `${headingText} Swell`;
    
    const calculatedPitch = (Math.sin(Date.now() / 800) * 1.8 + 2.0).toFixed(1);
    statPitch.textContent = `${calculatedPitch}° (Optimal)`;
}

function setupToggles() {
    toggleStars.addEventListener("change", (e) => {
        celestialDome.style.opacity = e.target.checked ? "1" : "0";
    });

    toggleCurrents.addEventListener("change", (e) => {
        document.getElementById("currents-overlay").style.opacity = e.target.checked ? "0.8" : "0";
    });

    toggleSticks.addEventListener("change", (e) => {
        document.getElementById("stick-chart-layer").style.opacity = e.target.checked ? "0.8" : "0";
    });

    toggleWake.addEventListener("change", (e) => {
        isWakeEnabled = e.target.checked;
        if (!isWakeEnabled) {
            wakeParticles = [];
            canvasContext.clearRect(0, 0, wakeCanvas.width, wakeCanvas.height);
        }
    });
}

function setupQuadrants() {
    quadrantButtons.forEach(button => {
        button.addEventListener("click", () => {
            quadrantButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            const quadrantKey = button.getAttribute("data-quadrant");
            const data = quadrantLore[quadrantKey];
            
            houseDescription.innerHTML = `<strong class="highlight-text">${data.title}:</strong> ${data.desc}`;
        });
    });
}

function setupConstellations() {
    constellationButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isActive = button.classList.contains("active");
            
            constellationButtons.forEach(btn => btn.classList.remove("active"));
            const allPaths = document.querySelectorAll(".constellation-path");
            allPaths.forEach(path => path.classList.remove("highlighted"));

            if (!isActive) {
                button.classList.add("active");
                const constKey = button.getAttribute("data-const");
                const data = constellationLore[constKey];
                
                const targetPath = document.getElementById(data.id);
                if (targetPath) {
                    targetPath.classList.add("highlighted");
                }

                loreTarget.innerHTML = `
                    <h4 class="active-lore-title">${data.title}</h4>
                    <span class="active-lore-meta">Constellation Blueprint</span>
                    <p class="active-lore-desc">${data.desc}</p>
                `;
            } else {
                loreTarget.innerHTML = defaultLoreHTML;
            }
        });
    });
}

function setupHoverables() {
    starNodes.forEach(star => {
        star.addEventListener("mouseenter", () => {
            const starName = star.getAttribute("data-star");
            const starMeaning = star.getAttribute("data-meaning");
            
            loreTarget.innerHTML = `
                <h4 class="active-lore-title">${starName}</h4>
                <span class="active-lore-meta">Guiding Star (Hōkū)</span>
                <p class="active-lore-desc">${starMeaning}</p>
            `;

            statZenith.textContent = `${starName} at Meridian`;
        });

        star.addEventListener("mouseleave", () => {
            resetLoreToActiveSelection();
        });
    });

    islandNodes.forEach(island => {
        island.addEventListener("mouseenter", () => {
            const islandName = island.getAttribute("data-name");
            const islandDesc = island.getAttribute("data-desc");
            
            loreTarget.innerHTML = `
                <h4 class="active-lore-title">${islandName}</h4>
                <span class="active-lore-meta">Island Destination (Motu)</span>
                <p class="active-lore-desc">${islandDesc}</p>
            `;

            if (islandName === "Hawaiki") {
                statLat.textContent = "0° 00' Equator";
            } else if (islandName === "Oʻahu") {
                statLat.textContent = "21° 18' N (Hawaiʻi)";
            } else if (islandName === "Aotearoa") {
                statLat.textContent = "41° 17' S (New Zealand)";
            } else if (islandName === "Tahiti Nui") {
                statLat.textContent = "17° 39' S (Society Islands)";
            } else if (islandName === "Rapa Nui") {
                statLat.textContent = "27° 07' S (Easter Island)";
            } else {
                statLat.textContent = "Latitude Variable";
            }
        });

        island.addEventListener("mouseleave", () => {
            resetLoreToActiveSelection();
        });
    });
}

function resetLoreToActiveSelection() {
    const activeConstButton = document.querySelector(".const-btn.active");
    if (activeConstButton) {
        const constKey = activeConstButton.getAttribute("data-const");
        const data = constellationLore[constKey];
        loreTarget.innerHTML = `
            <h4 class="active-lore-title">${data.title}</h4>
            <span class="active-lore-meta">Constellation Blueprint</span>
            <p class="active-lore-desc">${data.desc}</p>
        `;
    } else {
        loreTarget.innerHTML = defaultLoreHTML;
    }
}

function spawnWakeParticles(x, y) {
    if (!isWakeEnabled) return;
    const rect = interactiveChart.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;

    for (let i = 0; i < 3; i++) {
        wakeParticles.push({
            x: relativeX,
            y: relativeY,
            radius: Math.random() * 4 + 1.5,
            color: Math.random() > 0.3 ? "#00f5d4" : "#00d4ff",
            alpha: 1,
            decay: Math.random() * 0.015 + 0.01,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5 + 0.8
        });
    }
}

interactiveChart.addEventListener("mousemove", (e) => {
    spawnWakeParticles(e.clientX, e.clientY);
});

interactiveChart.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    spawnWakeParticles(touch.clientX, touch.clientY);
}, { passive: true });

function animateParticles() {
    canvasContext.clearRect(0, 0, wakeCanvas.width, wakeCanvas.height);
    
    for (let i = wakeParticles.length - 1; i >= 0; i--) {
        const p = wakeParticles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
            wakeParticles.splice(i, 1);
            continue;
        }

        canvasContext.save();
        canvasContext.globalCompositeOperation = "lighter";
        canvasContext.globalAlpha = p.alpha;
        canvasContext.beginPath();
        canvasContext.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = p.color;
        
        canvasContext.shadowBlur = 8;
        canvasContext.shadowColor = p.color;
        
        canvasContext.fill();
        canvasContext.restore();
    }
    requestAnimationFrame(animateParticles);
}

function setupAudioSystem() {
    ambientToggle.addEventListener("click", () => {
        if (!isAudioInitialized) {
            startSynthesizer();
            isAudioInitialized = true;
        }

        if (isAudioPlaying) {
            masterGainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
            ambientToggle.classList.remove("playing");
            ambientToggle.querySelector(".audio-text").textContent = "Activate Ocean Hum";
            volumeSlider.disabled = true;
            isAudioPlaying = false;
        } else {
            audioContext.resume();
            const targetVolume = volumeSlider.value / 100;
            masterGainNode.gain.exponentialRampToValueAtTime(targetVolume, audioContext.currentTime + 1);
            ambientToggle.classList.add("playing");
            ambientToggle.querySelector(".audio-text").textContent = "Silence Horizon";
            volumeSlider.disabled = false;
            isAudioPlaying = true;
        }
    });

    volumeSlider.addEventListener("input", (e) => {
        if (isAudioPlaying && masterGainNode) {
            const targetVolume = e.target.value / 100;
            masterGainNode.gain.linearRampToValueAtTime(targetVolume, audioContext.currentTime + 0.1);
        }
    });
}

function startSynthesizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);

    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const outputChannel = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        outputChannel[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = outputChannel[i];
        outputChannel[i] *= 3.5;
    }

    const pinkNoiseSource = audioContext.createBufferSource();
    pinkNoiseSource.buffer = noiseBuffer;
    pinkNoiseSource.loop = true;

    waveFilterNode = audioContext.createBiquadFilter();
    waveFilterNode.type = "lowpass";
    waveFilterNode.frequency.setValueAtTime(350, audioContext.currentTime);
    waveFilterNode.Q.setValueAtTime(1.2, audioContext.currentTime);

    lowFrequencyOscillator = audioContext.createOscillator();
    lowFrequencyOscillator.type = "sine";
    lowFrequencyOscillator.frequency.setValueAtTime(0.08, audioContext.currentTime);

    const lfoGain = audioContext.createGain();
    lfoGain.gain.setValueAtTime(180, audioContext.currentTime);

    const bassOscillatorOne = audioContext.createOscillator();
    bassOscillatorOne.type = "sine";
    bassOscillatorOne.frequency.setValueAtTime(45, audioContext.currentTime);

    const bassOscillatorTwo = audioContext.createOscillator();
    bassOscillatorTwo.type = "sine";
    bassOscillatorTwo.frequency.setValueAtTime(45.4, audioContext.currentTime);

    const bassGain = audioContext.createGain();
    bassGain.gain.setValueAtTime(0.08, audioContext.currentTime);

    lowFrequencyOscillator.connect(lfoGain);
    lfoGain.connect(waveFilterNode.frequency);

    pinkNoiseSource.connect(waveFilterNode);
    waveFilterNode.connect(masterGainNode);

    bassOscillatorOne.connect(bassGain);
    bassOscillatorTwo.connect(bassGain);
    bassGain.connect(masterGainNode);

    masterGainNode.connect(audioContext.destination);

    pinkNoiseSource.start(0);
    lowFrequencyOscillator.start(0);
    bassOscillatorOne.start(0);
    bassOscillatorTwo.start(0);
}

document.addEventListener("DOMContentLoaded", initializeApp);
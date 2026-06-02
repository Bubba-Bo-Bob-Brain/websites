const creatureData = {
    "void-stalker": {
        name: "The Void Stalker",
        class: "Class V Fiend • Abyssal Born",
        lore: "A silent hunter that manifests from the condensation of localized sorrow. It feeds upon the last memories of dying wanderers, wearing their voices to lure companions into the darkness.",
        weakness: "Silver and Sunstone Runes",
        aggression: "Extreme (Unprovoked)",
        svg: `<g stroke="#2c1a1a" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M100,50 L80,30 L75,45 L100,70 L125,45 L120,30 Z" />
            <circle cx="90" cy="65" r="3" fill="#ff3333" class="glowing-eye"/>
            <circle cx="110" cy="65" r="3" fill="#ff3333" class="glowing-eye"/>
            <path d="M100,70 L100,150 M100,85 L70,95 M100,85 L130,95 M100,105 L65,115 M100,105 L135,115 M100,125 L75,135 M100,125 L125,135" />
            <path d="M70,95 L50,140 L30,180" />
            <path d="M130,95 L150,140 L170,180" />
            <path d="M90,150 L80,190" />
            <path d="M110,150 L120,190" />
            <path d="M40,60 Q50,40 60,50" />
            <path d="M160,60 Q150,40 140,50" />
        </g>`
    },
    "plague-weaver": {
        name: "The Plague Weaver",
        class: "Class IV Insectoid • Pestilence Bringer",
        lore: "An ancient arachnid weaver that knits webs from toxic miasma. It nests in hollow crypts, waiting to cocoon lost souls and liquefy their life essence into dark venom.",
        weakness: "Purifying Fire and Ash",
        aggression: "High (Defensive)",
        svg: `<g stroke="#2c1a1a" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="100" cy="80" r="15" />
            <circle cx="100" cy="115" r="25" />
            <circle cx="95" cy="75" r="2" fill="#00ff00" />
            <circle cx="105" cy="75" r="2" fill="#00ff00" />
            <circle cx="90" cy="80" r="1.5" fill="#00ff00" />
            <circle cx="110" cy="80" r="1.5" fill="#00ff00" />
            <path d="M85,80 Q50,60 30,90" />
            <path d="M115,80 Q150,60 170,90" />
            <path d="M80,105 Q40,100 20,130" />
            <path d="M120,105 Q160,100 180,130" />
            <path d="M80,120 Q30,130 25,160" />
            <path d="M120,120 Q170,130 175,160" />
            <path d="M85,135 Q40,160 45,190" />
            <path d="M115,135 Q160,160 155,190" />
            <path d="M90,140 L100,165 L110,140" />
        </g>`
    },
    "ash-knight": {
        name: "The Cursed Ash Knight",
        class: "Class VI Undead • Hollow Warden",
        lore: "A fallen champion bound to a suit of charred iron plate. Hollowed by a centuries-old curse, this sentinel eternally guards the ruins of the Sunken Citadel.",
        weakness: "Abyssal Runes & Shattering Force",
        aggression: "Extremely Hostile",
        svg: `<g stroke="#2c1a1a" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="80" y="45" width="40" height="40" rx="5" />
            <path d="M85,60 L115,60 M100,45 L100,85" />
            <path d="M100,30 L100,45" />
            <path d="M100,30 Q115,20 125,35" />
            <rect x="70" y="85" width="60" height="70" rx="10" />
            <path d="M80,110 L120,110 M90,130 L110,130" />
            <path d="M55,90 L70,100 L60,140 M145,90 L130,100 L140,140" />
            <path d="M85,155 L80,195 M115,155 L120,195" />
        </g>`
    },
    "gorgon-mother": {
        name: "The Abyssal Leviathan",
        class: "Class VII Titan • Deep Swallower",
        lore: "An ancient marine horror residing in the pressure of the boiling dark seas. It is said its maw can swallow merchant galleons whole, dragging their iron anchors to the underworld.",
        weakness: "Lightning runes and Iron anchors",
        aggression: "Unfathomable",
        svg: `<g stroke="#2c1a1a" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M50,100 Q100,20 150,100 Q100,180 50,100 Z" />
            <circle cx="100" cy="100" r="25" />
            <circle cx="100" cy="100" r="10" fill="#ff7700" class="glowing-eye" />
            <path d="M55,100 L40,85 M55,110 L35,120 M145,100 L160,85 M145,110 L165,120" />
            <path d="M85,40 Q100,10 115,40" />
            <path d="M85,160 Q100,190 115,160" />
            <path d="M75,60 Q100,45 125,60" />
            <path d="M75,140 Q100,155 125,140" />
        </g>`
    }
};

const forgeCombinations = {
    "fire+shadow": "Shadowflame Eruption: You have forged a volatile essence of absolute dark flame. This spell incinerates protective wards and burns the very soul of the target.",
    "fire+spirit": "Ethereal Phoenix Spark: A delicate balance of wild fire and soul spark. It grants the wielder short-lived immortality, reviving them if they fall in the shadow chambers.",
    "fire+iron": "Magma Core Shield: Molten iron infused with core fire. It manifests an impenetrable molten shield that melts incoming physical projectiles before impact.",
    "shadow+spirit": "Phantasmal Wraith-Tether: Pure shadow linked to a spiritual anchor. It summons a bound phantom that distorts the sight of nearby monsters, rendering you invisible.",
    "shadow+iron": "Obsidian Blade: Brittle shadow compressed within solid iron. It yields a dark weapon that absorbs ambient light and grows sharper with every drop of blood it tastes.",
    "spirit+iron": "Living Golem Aegis: A spark of anima bound inside heavy iron plating. This awakens an autonomous iron companion that absorbs all physical damage intended for its master.",
    "fire+fire": "Infernal Supernova: A dangerous concentration of flame runes. It generates a devastating localized explosion, but threatens to singe the eyebrows of the caster.",
    "shadow+shadow": "Total Eclipse Essence: Darkness folded into darkness. It completely extinguishes all ambient torchlight in the region, blinding both you and your foes.",
    "spirit+spirit": "Astral Projection Anchor: Overwhelming spiritual alignment that detaches your consciousness from your physical shell, allowing safe scouting of abyssal rifts.",
    "iron+iron": "Tectonic Bastion Wall: Double-layered reinforced iron runic energy. It summons an immovable wall of dark steel from the earth to block massive beast onslaughts."
};

let audioContext = null;
let droneOscillator = null;
let droneFilter = null;
let lowPassOscillator = null;
let customCursor = document.getElementById("custom-cursor");
let torchGlow = document.getElementById("torch-glow");
let isAudioEnabled = false;
let isTorchEnabled = true;

let firstSelectedRune = null;
let secondSelectedRune = null;

function initializeCustomCursor() {
    document.addEventListener("mousemove", (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        customCursor.style.display = "block";
        customCursor.style.left = `${mouseX}px`;
        customCursor.style.top = `${mouseY}px`;
        
        if (isTorchEnabled) {
            torchGlow.style.background = `radial-gradient(circle 420px at ${mouseX}px ${mouseY}px, rgba(229, 142, 38, 0.15) 0%, rgba(124, 26, 26, 0.05) 55%, transparent 100%)`;
        } else {
            torchGlow.style.background = "none";
        }
        
        if (Math.random() < 0.12) {
            createSpark(mouseX, mouseY);
        }
    });
}

function handleTorchFlicker() {
    setInterval(() => {
        if (!isTorchEnabled) return;
        const flickerX = (Math.random() - 0.5) * 15;
        const flickerY = (Math.random() - 0.5) * 15;
        document.documentElement.style.setProperty("--torch-flicker-x", `${flickerX}px`);
        document.documentElement.style.setProperty("--torch-flicker-y", `${flickerY}px`);
    }, 120);
}

function createSpark(x, y) {
    const container = document.getElementById("spark-container");
    const spark = document.createElement("div");
    spark.classList.add("spark");
    
    const size = Math.random() * 3 + 1;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    
    spark.style.left = `${x + (Math.random() - 0.5) * 20}px`;
    spark.style.top = `${y + (Math.random() - 0.5) * 20}px`;
    
    const velocityX = (Math.random() - 0.5) * 2;
    const velocityY = -Math.random() * 3 - 1;
    let opacity = 1;
    
    container.appendChild(spark);
    
    let currentX = parseFloat(spark.style.left);
    let currentY = parseFloat(spark.style.top);
    
    function animate() {
        if (opacity <= 0) {
            spark.remove();
            return;
        }
        currentX += velocityX;
        currentY += velocityY;
        opacity -= 0.02;
        
        spark.style.left = `${currentX}px`;
        spark.style.top = `${currentY}px`;
        spark.style.opacity = opacity;
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

function setupAudioDrone() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    droneOscillator = audioContext.createOscillator();
    droneOscillator.type = "sawtooth";
    droneOscillator.frequency.value = 55;
    
    droneFilter = audioContext.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 120;
    droneFilter.Q.value = 5;
    
    lowPassOscillator = audioContext.createOscillator();
    lowPassOscillator.type = "sine";
    lowPassOscillator.frequency.value = 0.2;
    
    const modulationGain = audioContext.createGain();
    modulationGain.gain.value = 30;
    
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.25;
    
    lowPassOscillator.connect(modulationGain);
    modulationGain.connect(droneFilter.frequency);
    
    droneOscillator.connect(droneFilter);
    droneFilter.connect(masterGain);
    masterGain.connect(audioContext.destination);
    
    droneOscillator.start();
    lowPassOscillator.start();
}

function toggleAudio() {
    const audioToggleBtn = document.getElementById("ambient-audio-toggle");
    if (!audioContext) {
        setupAudioDrone();
        isAudioEnabled = true;
        audioToggleBtn.classList.add("active");
        audioToggleBtn.querySelector(".text").textContent = "Drone On";
    } else {
        if (audioContext.state === "suspended") {
            audioContext.resume();
            isAudioEnabled = true;
            audioToggleBtn.classList.add("active");
            audioToggleBtn.querySelector(".text").textContent = "Drone On";
        } else if (audioContext.state === "running") {
            audioContext.suspend();
            isAudioEnabled = false;
            audioToggleBtn.classList.remove("active");
            audioToggleBtn.querySelector(".text").textContent = "Drone Off";
        }
    }
}

function setupGateKeeper() {
    const unlockBtn = document.getElementById("unlock-btn");
    const gateKeeper = document.getElementById("gate-keeper");
    const mainInterface = document.getElementById("main-interface");
    
    unlockBtn.addEventListener("click", () => {
        try {
            setupAudioDrone();
            isAudioEnabled = true;
            document.getElementById("ambient-audio-toggle").classList.add("active");
        } catch (e) {
            console.log("Audio autostart blocked or failed, waiting for user toggle.");
        }
        
        gateKeeper.classList.remove("active");
        gateKeeper.classList.add("hidden");
        mainInterface.classList.remove("hidden");
        
        setTimeout(() => {
            mainInterface.classList.add("active");
        }, 100);
    });
}

function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const pages = document.querySelectorAll(".tome-page");
    
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetPageId = button.getAttribute("data-target");
            
            navButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            pages.forEach(page => {
                page.classList.add("hidden");
                page.classList.remove("active");
            });
            
            const targetPage = document.getElementById(targetPageId);
            targetPage.classList.remove("hidden");
            setTimeout(() => {
                targetPage.classList.add("active");
            }, 50);
        });
    });
}

function setupBestiary() {
    const creatureItems = document.querySelectorAll(".creature-item");
    const displayCard = document.getElementById("creature-display");
    const nameEl = document.getElementById("creature-name");
    const classEl = document.getElementById("creature-class");
    const sketchEl = document.getElementById("creature-sketch");
    const loreEl = document.getElementById("creature-lore");
    const weaknessEl = document.getElementById("creature-weakness");
    const aggressionEl = document.getElementById("creature-aggression");
    
    creatureItems.forEach(item => {
        item.addEventListener("click", () => {
            creatureItems.forEach(ci => ci.classList.remove("active"));
            item.classList.add("active");
            
            const key = item.getAttribute("data-creature");
            const data = creatureData[key];
            
            displayCard.style.opacity = "0";
            
            setTimeout(() => {
                nameEl.textContent = data.name;
                classEl.textContent = data.class;
                sketchEl.innerHTML = data.svg;
                loreEl.textContent = `"${data.lore}"`;
                weaknessEl.textContent = data.weakness;
                aggressionEl.textContent = data.aggression;
                
                displayCard.style.opacity = "1";
            }, 300);
        });
    });
}

function setupRuneForge() {
    const runeStones = document.querySelectorAll(".rune-stone");
    const slot1 = document.getElementById("slot-1");
    const slot2 = document.getElementById("slot-2");
    const catalystBtn = document.getElementById("forge-catalyst-btn");
    const outputPanel = document.getElementById("forge-output-panel");
    const resultText = document.getElementById("forge-result-text");
    const resetBtn = document.getElementById("reset-forge-btn");
    
    runeStones.forEach(stone => {
        stone.addEventListener("click", () => {
            if (stone.classList.contains("selected-in-slot")) return;
            
            const runeType = stone.getAttribute("data-rune");
            const runeSymbol = stone.querySelector(".rune-symbol").textContent;
            
            if (slot1.getAttribute("data-active-rune") === "none") {
                setSlot(slot1, runeType, runeSymbol);
                stone.classList.add("selected-in-slot");
            } else if (slot2.getAttribute("data-active-rune") === "none") {
                setSlot(slot2, runeType, runeSymbol);
                stone.classList.add("selected-in-slot");
            }
            
            evaluateCatalystState();
        });
    });
    
    slot1.addEventListener("click", () => clearSlot(slot1));
    slot2.addEventListener("click", () => clearSlot(slot2));
    
    catalystBtn.addEventListener("click", () => {
        const r1 = slot1.getAttribute("data-active-rune");
        const r2 = slot2.getAttribute("data-active-rune");
        
        const key1 = `${r1}+${r2}`;
        const key2 = `${r2}+${r1}`;
        const combinationResult = forgeCombinations[key1] || forgeCombinations[key2] || "The runes collapse into unstable cosmic dust. No reaction occurs.";
        
        triggerForgeExplosion();
        
        catalystBtn.disabled = true;
        
        setTimeout(() => {
            resultText.textContent = combinationResult;
            outputPanel.classList.remove("hidden");
        }, 800);
    });
    
    resetBtn.addEventListener("click", purgeForgeAltar);
}

function setSlot(slotElement, runeType, symbol) {
    slotElement.setAttribute("data-active-rune", runeType);
    slotElement.innerHTML = `<span class="rune-symbol">${symbol}</span>`;
    slotElement.classList.add("occupied");
}

function clearSlot(slotElement) {
    const runeType = slotElement.getAttribute("data-active-rune");
    if (runeType === "none") return;
    
    const correspondingStone = document.querySelector(`.rune-stone[data-rune="${runeType}"]`);
    if (correspondingStone) {
        correspondingStone.classList.remove("selected-in-slot");
    }
    
    slotElement.setAttribute("data-active-rune", "none");
    const slotId = slotElement.id === "slot-1" ? "Rune I" : "Rune II";
    slotElement.innerHTML = `<span class="slot-placeholder">Place ${slotId}</span>`;
    slotElement.classList.remove("occupied");
    
    evaluateCatalystState();
}

function evaluateCatalystState() {
    const slot1Active = document.getElementById("slot-1").getAttribute("data-active-rune") !== "none";
    const slot2Active = document.getElementById("slot-2").getAttribute("data-active-rune") !== "none";
    const catalystBtn = document.getElementById("forge-catalyst-btn");
    
    catalystBtn.disabled = !(slot1Active && slot2Active);
}

function purgeForgeAltar() {
    clearSlot(document.getElementById("slot-1"));
    clearSlot(document.getElementById("slot-2"));
    document.getElementById("forge-output-panel").classList.add("hidden");
}

function triggerForgeExplosion() {
    const altar = document.querySelector(".altar-seal-container");
    const rect = altar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            createSpark(centerX + (Math.random() - 0.5) * 50, centerY + (Math.random() - 0.5) * 50);
        }, i * 15);
    }
}

function setupToggleButtons() {
    const audioToggleBtn = document.getElementById("ambient-audio-toggle");
    const torchToggleBtn = document.getElementById("torch-toggle");
    
    audioToggleBtn.addEventListener("click", toggleAudio);
    
    torchToggleBtn.addEventListener("click", () => {
        isTorchEnabled = !isTorchEnabled;
        if (isTorchEnabled) {
            torchToggleBtn.classList.add("active");
            torchToggleBtn.querySelector(".text").textContent = "Torch On";
        } else {
            torchToggleBtn.classList.remove("active");
            torchToggleBtn.querySelector(".text").textContent = "Torch Off";
            torchGlow.style.background = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeCustomCursor();
    handleTorchFlicker();
    setupGateKeeper();
    setupNavigation();
    setupBestiary();
    setupRuneForge();
    setupToggleButtons();
});
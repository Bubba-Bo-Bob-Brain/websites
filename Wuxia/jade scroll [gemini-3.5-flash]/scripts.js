const ACUPOINTS_DATA = {
    "Baihui": {
        zh: "百會",
        en: "Baihui (Crown Point)",
        desc: "Located at the crown of the head. It is the meeting point of all hundred channels, where heavenly Yang energy enters the mortal vessel. Cultivating this point clarifies intent and opens celestial perception."
    },
    "Shanzhong": {
        zh: "膻中",
        en: "Shanzhong (Chest Center)",
        desc: "The middle Dantian and sea of Qi. Located in the center of the chest, it regulates emotional stability and transforms raw physical essence into refined inner strength."
    },
    "Dantian": {
        zh: "丹田",
        en: "Dantian (Elixir Field)",
        desc: "The primary reservoir of vital cosmic essence. It sits three finger-breadths below the navel. All martial paths require a crystallized Dantian to store and cycle spiritual Qi."
    },
    "Laogong-L": {
        zh: "左勞宮",
        en: "Left Laogong (Gate of Labor)",
        desc: "Located in the center of the left palm. Highly critical for discharging offensive externalized Qi, casting palm barriers, and projecting internal heat."
    },
    "Laogong-R": {
        zh: "右勞宮",
        en: "Right Laogong (Gate of Labor)",
        desc: "Located in the center of the right palm. Acts as the principal focal outlet for sword-Qi projection and physical redirection of kinetic impacts."
    },
    "Yongquan-L": {
        zh: "左湧泉",
        en: "Left Yongquan (Gushing Spring)",
        desc: "Located on the sole of the left foot. It connects the cultivator directly to the deep earthly ley-lines, allowing instant grounding and recovery of depleted energy."
    },
    "Yongquan-R": {
        zh: "右湧泉",
        en: "Right Yongquan (Gushing Spring)",
        desc: "Located on the sole of the right foot. Governs agility, explosive wind-leaping techniques, and balance across turbulent surfaces."
    }
};

const SKILL_TREE_RELATIONS = {
    "node-base": {
        children: ["node-palm", "node-shield"]
    },
    "node-palm": {
        parent: "node-base",
        children: ["node-sword"]
    },
    "node-shield": {
        parent: "node-base",
        children: ["node-breath"]
    },
    "node-sword": {
        parent: "node-palm",
        children: []
    },
    "node-breath": {
        parent: "node-shield",
        children: []
    }
};

let audioContext = null;
let ambientOscillator = null;
let ambientGain = null;
let isAudioPlaying = false;
let currentSelectedNodeId = null;

const mistContainer = document.getElementById("mistContainer");
const introScreen = document.getElementById("introScreen");
const unrollBtn = document.getElementById("unrollBtn");
const scrollWrapper = document.getElementById("scrollWrapper");
const musicToggle = document.getElementById("musicToggle");
const sealNav = document.querySelector(".seal-navigation");
const navSeals = document.querySelectorAll(".nav-seal");
const scrollSections = document.querySelectorAll(".scroll-section");
const acupoints = document.querySelectorAll(".acupoint");
const acupointName = document.getElementById("acupointName");
const acupointDesc = document.getElementById("acupointDesc");
const treeSvg = document.getElementById("treeSvg");
const treeNodes = document.querySelectorAll(".tree-node");
const detailModal = document.getElementById("detailModal");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalZhTitle = document.getElementById("modalZhTitle");
const modalEnTitle = document.getElementById("modalEnTitle");
const modalBadge = document.getElementById("modalBadge");
const modalLore = document.getElementById("modalLore");
const cultivateBtn = document.getElementById("cultivateBtn");

function init() {
    createMistClouds();
    setupEventListeners();
}

function createMistClouds() {
    const cloudCount = 8;
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("mist-cloud");
        
        const size = Math.random() * 300 + 200;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size}px`;
        
        cloud.style.left = `${Math.random() * 100}vw`;
        cloud.style.top = `${Math.random() * 100}vh`;
        
        const duration = Math.random() * 40 + 30;
        const delay = Math.random() * -40;
        cloud.style.animationDuration = `${duration}s`;
        cloud.style.animationDelay = `${delay}s`;
        
        mistContainer.appendChild(cloud);
    }
}

function setupEventListeners() {
    unrollBtn.addEventListener("click", unrollScroll);
    musicToggle.addEventListener("click", toggleAmbientSound);
    
    acupoints.forEach(point => {
        point.addEventListener("mouseenter", handleAcupointHover);
    });

    treeNodes.forEach(node => {
        node.addEventListener("click", () => openNodeDetails(node));
    });

    modalClose.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
    cultivateBtn.addEventListener("click", cultivateTechnique);

    window.addEventListener("scroll", handleScrollSpy);
    window.addEventListener("resize", drawTreeConnections);

    navSeals.forEach(seal => {
        seal.addEventListener("click", handleSealNavClick);
    });
}

function unrollScroll() {
    introScreen.classList.add("fade-out");
    scrollWrapper.classList.remove("hidden");
    
    setTimeout(() => {
        scrollWrapper.classList.add("unrolled");
        sealNav.classList.add("visible");
        drawTreeConnections();
    }, 150);

    tryInitAudio();
}

function tryInitAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function toggleAmbientSound() {
    tryInitAudio();
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    if (isAudioPlaying) {
        stopAmbientSound();
    } else {
        startAmbientSound();
    }
}

function startAmbientSound() {
    ambientOscillator = audioContext.createOscillator();
    ambientGain = audioContext.createGain();
    
    ambientOscillator.type = "sine";
    ambientOscillator.frequency.setValueAtTime(110, audioContext.currentTime); // Low A drone
    
    ambientGain.gain.setValueAtTime(0, audioContext.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 2.5); // Smooth fade in
    
    ambientOscillator.connect(ambientGain);
    ambientGain.connect(audioContext.destination);
    ambientOscillator.start();
    
    playFlutePulse();
    
    isAudioPlaying = true;
    musicToggle.classList.add("active-music");
}

function stopAmbientSound() {
    if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        setTimeout(() => {
            if (ambientOscillator) {
                ambientOscillator.stop();
                ambientOscillator.disconnect();
            }
        }, 1000);
    }
    isAudioPlaying = false;
    musicToggle.classList.remove("active-music");
}

function playFlutePulse() {
    if (!isAudioPlaying) return;

    const fluteOsc = audioContext.createOscillator();
    const fluteGain = audioContext.createGain();
    
    fluteOsc.type = "triangle";
    const frequencies = [330, 392, 440, 523, 587]; // Pentatonic scale notes
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    fluteOsc.frequency.setValueAtTime(randomFreq, audioContext.currentTime);
    
    fluteGain.gain.setValueAtTime(0, audioContext.currentTime);
    fluteGain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 1.5);
    fluteGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 5);
    
    fluteOsc.connect(fluteGain);
    fluteGain.connect(audioContext.destination);
    
    fluteOsc.start();
    fluteOsc.stop(audioContext.currentTime + 5);
    
    const nextPulseDelay = Math.random() * 6000 + 4000;
    setTimeout(playFlutePulse, nextPulseDelay);
}

function handleAcupointHover(event) {
    const pointId = event.target.getAttribute("data-point");
    const data = ACUPOINTS_DATA[pointId];
    
    if (data) {
        acupoints.forEach(p => p.classList.remove("active-point"));
        event.target.classList.add("active-point");
        
        acupointName.textContent = `${data.zh} · ${data.en}`;
        acupointDesc.textContent = data.desc;
        
        playTinyChime();
    }
}

function playTinyChime() {
    if (!isAudioPlaying || !audioContext) return;
    
    const chimeOsc = audioContext.createOscillator();
    const chimeGain = audioContext.createGain();
    
    chimeOsc.type = "sine";
    chimeOsc.frequency.setValueAtTime(880, audioContext.currentTime);
    chimeOsc.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.3);
    
    chimeGain.gain.setValueAtTime(0.03, audioContext.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.4);
    
    chimeOsc.connect(chimeGain);
    chimeGain.connect(audioContext.destination);
    
    chimeOsc.start();
    chimeOsc.stop(audioContext.currentTime + 0.4);
}

function handleScrollSpy() {
    let currentSectionId = "";
    
    scrollSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 250) {
            currentSectionId = section.getAttribute("id");
        }
    });
    
    navSeals.forEach(seal => {
        seal.classList.remove("active-nav");
        if (seal.getAttribute("data-target") === currentSectionId) {
            seal.classList.add("active-nav");
        }
    });
}

function handleSealNavClick(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("data-target");
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function openNodeDetails(node) {
    currentSelectedNodeId = node.id;
    
    const title = node.getAttribute("data-title");
    const zh = node.getAttribute("data-zh");
    const type = node.getAttribute("data-type");
    const lore = node.getAttribute("data-lore");
    
    modalZhTitle.textContent = zh;
    modalEnTitle.textContent = title;
    modalBadge.textContent = type;
    modalLore.textContent = lore;
    
    updateModalActionState(node);
    
    detailModal.classList.add("active");
    playTinyChime();
}

function updateModalActionState(node) {
    if (node.classList.contains("active")) {
        cultivateBtn.textContent = "Fully Mastered";
        cultivateBtn.disabled = true;
    } else {
        const relation = SKILL_TREE_RELATIONS[currentSelectedNodeId];
        const parentId = relation ? relation.parent : null;
        
        if (parentId) {
            const parentNode = document.getElementById(parentId);
            if (parentNode && parentNode.classList.contains("active")) {
                cultivateBtn.textContent = "Channel Cultivation";
                cultivateBtn.disabled = false;
            } else {
                cultivateBtn.textContent = "Prerequisites Locked";
                cultivateBtn.disabled = true;
            }
        } else {
            cultivateBtn.textContent = "Channel Cultivation";
            cultivateBtn.disabled = false;
        }
    }
}

function closeModal() {
    detailModal.classList.remove("active");
}

function cultivateTechnique() {
    if (!currentSelectedNodeId) return;
    
    const node = document.getElementById(currentSelectedNodeId);
    if (node && !node.classList.contains("active")) {
        node.classList.remove("locked");
        node.classList.add("active");
        
        playCultivateImpactSound();
        triggerInkSplatterVisual(node);
        
        drawTreeConnections();
        closeModal();
    }
}

function playCultivateImpactSound() {
    if (!isAudioPlaying || !audioContext) return;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, audioContext.currentTime);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.8);
}

function triggerInkSplatterVisual(element) {
    const rect = element.getBoundingClientRect();
    const splatter = document.createElement("div");
    
    splatter.style.position = "fixed";
    splatter.style.top = `${rect.top + rect.height / 2 - 40}px`;
    splatter.style.left = `${rect.left + rect.width / 2 - 40}px`;
    splatter.style.width = "80px";
    splatter.style.height = "80px";
    splatter.style.borderRadius = "50%";
    splatter.style.background = "radial-gradient(circle, #111 20%, transparent 70%)";
    splatter.style.pointerEvents = "none";
    splatter.style.zIndex = "200";
    splatter.style.transform = "scale(0.5)";
    splatter.style.opacity = "0.8";
    splatter.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
    
    document.body.appendChild(splatter);
    
    setTimeout(() => {
        splatter.style.transform = "scale(2.2)";
        splatter.style.opacity = "0";
    }, 10);
    
    setTimeout(() => {
        splatter.remove();
    }, 700);
}

function drawTreeConnections() {
    if (scrollWrapper.classList.contains("hidden")) return;
    
    while (treeSvg.firstChild) {
        treeSvg.removeChild(treeSvg.firstChild);
    }
    
    const svgRect = treeSvg.getBoundingClientRect();
    
    Object.keys(SKILL_TREE_RELATIONS).forEach(parentId => {
        const parentNode = document.getElementById(parentId);
        const childrenIds = SKILL_TREE_RELATIONS[parentId].children;
        
        if (!parentNode) return;
        
        const parentRect = parentNode.getBoundingClientRect();
        const parentX = (parentRect.left + parentRect.width / 2) - svgRect.left;
        const parentY = (parentRect.top + parentRect.height / 2) - svgRect.top;
        
        childrenIds.forEach(childId => {
            const childNode = document.getElementById(childId);
            if (!childNode) return;
            
            const childRect = childNode.getBoundingClientRect();
            const childX = (childRect.left + childRect.width / 2) - svgRect.left;
            const childY = (childRect.top + childRect.height / 2) - svgRect.top;
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            const controlY = parentY + (childY - parentY) / 2;
            const d = `M ${parentX} ${parentY} C ${parentX} ${controlY}, ${childX} ${controlY}, ${childX} ${childY}`;
            
            path.setAttribute("d", d);
            
            if (parentNode.classList.contains("active") && childNode.classList.contains("active")) {
                path.classList.add("unlocked");
            }
            
            treeSvg.appendChild(path);
        });
    });
}

window.addEventListener("DOMContentLoaded", init);
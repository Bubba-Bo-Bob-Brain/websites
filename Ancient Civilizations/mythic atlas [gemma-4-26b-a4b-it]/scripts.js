/**
 * Chronicles of Aethelgard - Interactive Atlas
 * Core Engine
 */

"use strict";

// --- 1. Data: The Lore Database ---
const LORE_DATABASE = {
    "territory-isles": {
        title: "The Sunken Isles",
        description: "Once a sprawling archipelago of merchant princes, the Sunken Isles were lost to the Great Deluge during the Dawn Age. Today, only the highest peaks remain, inhabited by sea-nomads who trade in bioluminescent pearls and coral-etched relics.",
        mythos: "It is said that the islands didn't sink, but were pulled down by the slumbering Leviathan to serve as its coral garden."
    },
    "territory-peaks": {
        title: "The Iron Peaks",
        description: "A brutal, vertical landscape of jagged obsidian and eternal snow. The mountain-kin dwell in cities carved directly into the granite, mastering the art of smithing celestial metals found only in the highest reaches.",
        mythos: "The peaks are the frozen teeth of the World-Serpent, waiting for the era of ash to thaw."
    },
    "territory-reach": {
        title: "The Verdant Reach",
        description: "A massive, primordial jungle where the trees grow so tall they pierce the clouds. The flora here is sentient, and the local tribes live in a delicate, symbiotic trance with the forest's heartbeat.",
        mythos: "Legend speaks of a Great Seed at the heart of the Reach that, if planted, could regrow the entire world."
    },
    "sigil-eye": {
        title: "The Eye of Ra",
        description: "A celestial phenomenon observed only during the Golden Age.",
        mythos: "A golden orb that watches the desert sands, ensuring that no king forgets his mortality."
    },
    "sigil-wake": {
        title: "The Leviathan's Wake",
        description: "A permanent whirlpool in the southern seas.",
        mythos: "The churning water is not a current, but the breathing of a god beneath the waves."
    }
};

// --- 2. State Management ---
const state = {
    currentEra: 'golden-age',
    selectedRegion: null,
    isPanelOpen: false
};

// --- 3. DOM Elements ---
const elements = {
    body: document.body,
    map: document.getElementById('map-wrapper'),
    worldMap: document.getElementById('world-map'),
    lorePanel: document.getElementById('lore-panel'),
    loreTitle: document.getElementById('lore-title'),
    loreBody: document.getElementById('lore-body'),
    loreMythos: document.getElementById('lore-mythos'),
    mythosText: document.getElementById('mythos-text'),
    eraSlider: document.getElementById('era-slider'),
    eraMarkers: document.querySelectorAll('.era-marker'),
    cursor: document.getElementById('custom-cursor'),
    interactiveElements: document.querySelectorAll('.territory, .sigil, .era-marker, .legend-item')
};

// --- 4. Initialization ---
function init() {
    setupEventListeners();
    setupCursor();
    updateEraUI();
    console.log("The Chronicles of Aethelgard have been initialized.");
}

// --- 5. Event Listeners ---
function setupEventListeners() {
    // Era Slider Change
    elements.eraSlider.addEventListener('input', (e) => {
        const eras = ['dawn', 'golden-age', 'ash-age'];
        state.currentEra = eras[e.target.value];
        updateEraUI();
    });

    // Map Clicks (Delegation)
    elements.worldMap.addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle Territory Clicks
        if (target.classList.contains('territory')) {
            handleLoreDiscovery(target.id);
        }
        
        // Handle Sigil Clicks
        if (target.classList.contains('sigil')) {
            const mythKey = `sigil-${target.getAttribute('data-myth').toLowerCase().replace(/\s+/g, '-')}`;
            // Fallback to a simpler lookup if the key isn't perfect
            const lookup = target.getAttribute('data-myth') === "The Eye of Ra" ? "sigil-eye" : "sigil-wake";
            handleLoreDiscovery(lookup);
        }
    });

    // Close lore when clicking the map background
    elements.map.addEventListener('click', (e) => {
        if (e.target.tagName === 'rect' || e.target.tagName === 'svg') {
            closeLorePanel();
        }
    });

    // Window resize handling
    window.addEventListener('resize', () => {
        // Potential logic for repositioning elements if needed
    });
}

function setupCursor() {
    // Smooth Cursor Movement
    window.addEventListener('mousemove', (e) => {
        elements.cursor.style.left = e.clientX + 'px';
        elements.cursor.style.top = e.clientY + 'px';

        // Parallax Effect on Map
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        elements.worldMap.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Cursor Interactions
    elements.interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            elements.cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            elements.cursor.classList.remove('hovering');
        });
        el.addEventListener('mousedown', () => {
            elements.cursor.classList.add('clicking');
        });
        el.addEventListener('mouseup', () => {
            elements.cursor.classList.remove('clicking');
        });
    });
}

// --- 6. Core Logic Functions ---

/**
 * Updates the visual atmosphere based on the selected era
 */
function updateEraUI() {
    // Update Body Class for CSS Variable shifts
    elements.body.className = `era-${state.currentEra}`;

    // Update Timeline Markers
    elements.eraMarkers.forEach(marker => {
        if (marker.getAttribute('data-era') === state.currentEra) {
            marker.classList.add('active');
        } else {
            marker.classList.remove('active');
        }
    });

    // Trigger a subtle map pulse on era change
    elements.worldMap.style.filter = 'brightness(1.2) saturate(1.2)';
    setTimeout(() => {
        elements.worldMap.style.filter = 'brightness(1) saturate(1)';
    }, 500);
}

/**
 * Reveals the lore for a specific region or sigil
 * @param {string} id - The key in LORE_DATABASE
 */
function handleLoreDiscovery(id) {
    const data = LORE_DATABASE[id];
    if (!data) return;

    // Update Content
    elements.loreTitle.textContent = data.title;
    elements.loreBody.innerHTML = `<p>${data.description}</p>`;

    if (data.mythos) {
        elements.loreMythos.classList.remove('hidden');
        elements.mythosText.textContent = data.mythos;
    } else {
        elements.loreMythos.classList.add('hidden');
    }

    // Open Panel
    openLorePanel();

    // Visual Feedback on Map
    const clickedElement = document.getElementById(id);
    if (clickedElement) {
        clickedElement.style.filter = 'drop-shadow(0 0 15px var(--color-gold))';
        setTimeout(() => {
            clickedElement.style.filter = '';
        }, 1000);
    }
}

function openLorePanel() {
    elements.lorePanel.classList.add('active');
    state.isPanelOpen = true;
}

function closeLorePanel() {
    elements.lorePanel.classList.remove('active');
    state.isPanelOpen = false;
}

// --- 7. Run ---
document.addEventListener('DOMContentLoaded', init);
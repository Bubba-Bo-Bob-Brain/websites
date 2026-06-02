/**
 * THE OBSIDIAN CODEX - CORE LOGIC
 * Implements: Ring Physics (Inertia/Friction), Glyph Translation, and Celestial Timing.
 */

"use strict";

// --- 1. DATA & CONFIGURATION ---

const GLYPH_DATA = {
    'ring-solar': {
        count: 12,
        names: ['Jaguar', 'Serpent', 'Eagle', 'Coatl', 'Moon', 'Sun', 'Storm', 'Earth', 'Wind', 'Fire', 'Water', 'Star'],
        meanings: ['Power & Night', 'Wisdom & Earth', 'Ascension & Sky', 'Creation', 'Cyclicality', 'Vitality', 'Chaos', 'Stability', 'Movement', 'Transformation', 'Flow', 'Destiny'],
        color: '#d4af37'
    },
    'ring-ritual': {
        count: 20,
        names: ['Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan', 'Cimi', 'Manik', 'Lamat', 'Muluc', 'Oc', 'Chil', 'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau', 'Lamat', 'Muluc', 'Oc', 'Chil'],
        meanings: ['Primordial Water', 'Spirit/Wind', 'Darkness', 'Corn/Life', 'Serpent', 'Death', 'Deer', 'Star/Venus', 'Water', 'Dog', 'Water', 'Rabbit', 'Earth', 'Flint', 'Storm', 'Lord/Sun'],
        color: '#00a86b'
    },
    'ring-lunar': {
        count: 13,
        names: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent', 'Dark Moon', 'Eclipse', 'Solar Zenith', 'Equinox', 'Solstice'],
        meanings: ['The Void', 'Growth', 'Balance', 'Abundance', 'Fullness', 'Release', 'Reflection', 'Surrender', 'Silence', 'Shadow', 'Peak Energy', 'Equalization', 'Seasonal Shift'],
        color: '#ffffff'
    }
};

const CONFIG = {
    friction: 0.97,        // How much velocity is kept per frame (0.97 = heavy stone)
    dragSensitivity: 0.005, // Sensitivity of the drag
    minVelocity: 0.001,    // Threshold to stop the momentum loop
    rotationStep: 1        // Smoothing factor
};

// --- 2. STATE MANAGEMENT ---

const state = {
    rings: {}, // Stores { element, rotation, velocity, isDragging, lastAngle }
    activeRing: null,
    isAnimating: false
};

// --- 3. DOM ELEMENTS ---

const elements = {
    rings: {
        'ring-solar': document.getElementById('ring-solar'),
        'ring-ritual': document.getElementById('ring-ritual'),
        'ring-lunar': document.getElementById('ring-inner') // Mapping 'ring-inner' from HTML
    },
    timer: document.getElementById('timer'),
    glyphName: document.getElementById('glyph-name'),
    glyphMeaning: document.getElementById('glyph-meaning'),
    glyphDisplay: document.getElementById('active-glyph'),
    tributeList: document.getElementById('tribute-list')
};

// --- 4. INITIALIZATION ---

function init() {
    setupRings();
    setupEventListeners();
    startEclipseTimer();
    startPhysicsLoop();
    
    console.log("The Obsidian Codex is active.");
}

/**
 * Programmatically creates the glyphs and positions them in the rings.
 */
function setupRings() {
    Object.keys(GLYPH_DATA).forEach(ringId => {
        const ringEl = elements.rings[ringId];
        const data = GLYPH_DATA[ringId];
        
        // Initialize state for this ring
        state.rings[ringId] = {
            element: ringEl,
            rotation: 0,
            velocity: 0,
            isDragging: false,
            lastAngle: 0
        };

        // Create Glyph elements
        for (let i = 0; i < data.count; i++) {
            const angle = (i * (360 / data.count));
            const glyph = document.createElement('div');
            glyph.className = 'ring-glyph';
            glyph.style.position = 'absolute';
            glyph.style.width = '40px';
            glyph.style.height = '40px';
            glyph.style.left = '50%';
            glyph.style.top = '50%';
            
            // Use transform to place glyphs in a circle
            // We rotate the container, then translate it out, then rotate the glyph back to stay upright
            glyph.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-${ringEl.offsetWidth / 2}px)`;
            
            // Add a simple geometric "glyph" SVG
            glyph.innerHTML = `
                <svg viewBox="0 0 100 100" style="fill: ${data.color}; filter: drop-shadow(0 0 2px ${data.color});">
                    <path d="M50 10 L90 90 L10 90 Z" opacity="0.8" />
                    <circle cx="50" cy="60" r="15" fill="white" opacity="0.5" />
                </svg>
            `;
            
            // Store metadata for lookup
            glyph.dataset.index = i;
            glyph.dataset.name = data.names[i];
            glyph.dataset.meaning = data.meanings[i];
            
            ringEl.appendChild(glyph);
        }
    });
}

// --- 5. INTERACTION LOGIC ---

function setupEventListeners() {
    // Use PointerEvents for unified Mouse/Touch support
    Object.keys(state.rings).forEach(ringId => {
        const el = state.rings[ringId].element;

        el.addEventListener('pointerdown', (e) => {
            state.activeRing = ringId;
            state.rings[ringId].isDragging = true;
            state.rings[ringId].velocity = 0;
            
            // Get initial angle
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            state.rings[ringId].lastAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            
            el.setPointerCapture(e.pointerId);
        });

        el.addEventListener('pointermove', (e) => {
            const ring = state.rings[ringId];
            if (!ring.isDragging) return;

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            let delta = currentAngle - ring.lastAngle;

            // Handle the 180 to -180 jump
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            ring.rotation += delta;
            ring.velocity = delta; // Velocity is the speed of the drag
            ring.lastAngle = currentAngle;
        });

        el.addEventListener('pointerup', (e) => {
            state.rings[ringId].isDragging = false;
            state.activeRing = null;
        });
    });
}

// --- 6. PHYSICS & ANIMATION LOOP ---

function startPhysicsLoop() {
    const loop = () => {
        Object.keys(state.rings).forEach(ringId => {
            const ring = state.rings[ringId];

            if (!ring.isDragging) {
                // Apply friction to velocity
                if (Math.abs(ring.velocity) > CONFIG.minVelocity) {
                    ring.rotation += ring.velocity;
                    ring.velocity *= CONFIG.friction;
                } else {
                    ring.velocity = 0;
                }
            }

            // Apply the rotation to the DOM
            ring.element.style.transform = `rotate(${ring.rotation}deg)`;

            // If the ring is moving or being dragged, update the translation
            if (ring.isDragging || Math.abs(ring.velocity) > CONFIG.minVelocity) {
                updateTranslation(ringId, ring.rotation);
            }
        });

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

/**
 * Determines which glyph is currently at the "top" (0 degrees) 
 * and updates the UI.
 */
function updateTranslation(ringId, rotation) {
    const data = GLYPH_DATA[ringId];
    
    // Normalize rotation to 0-360
    let normalizedRotation = (rotation % 360 + 360) % 360;
    
    // The "top" of the wheel is 270 degrees in standard math coordinates (relative to center)
    // But since we rotate the container, we find which glyph index is closest to the 0-degree marker
    // We subtract the rotation from 360 to find the "effective" rotation of the glyphs
    const effectiveRotation = (360 - normalizedRotation) % 360;
    const index = Math.round(effectiveRotation / (360 / data.count)) % data.count;
    
    const finalIndex = index < 0 ? index + data.count : index;

    // Only update DOM if the index has changed to save performance
    if (elements.glyphName.dataset.currentIndex != finalIndex) {
        elements.glyphName.dataset.currentIndex = finalIndex;
        
        // Update UI
        elements.glyphName.innerText = data.names[finalIndex];
        elements.glyphMeaning.innerText = data.meanings[finalIndex];
        
        // Visual feedback in the translation card
        elements.glyphDisplay.style.transform = `scale(${1 + (Math.abs(state.rings[ringId].velocity) * 0.1)})`;
        
        // Set the icon color based on ring
        elements.glyphDisplay.style.borderColor = data.color;
        
        // Create a temporary SVG icon for the display
        elements.glyphDisplay.innerHTML = `
            <svg viewBox="0 0 100 100" style="fill: ${data.color}; filter: drop-shadow(0 0 8px ${data.color});">
                <path d="M50 10 L90 90 L10 90 Z" />
                <circle cx="50" cy="60" r="15" fill="white" opacity="0.5" />
            </svg>
        `;
    }
}

// --- 7. COSMIC TIMERS ---

function startEclipseTimer() {
    // Set a dummy target date: 24 hours from now
    const targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            elements.timer.innerText = "00:00:00:00";
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const ms = Math.floor((distance % 1000) / 10);

        // Formatted as HH:MM:SS:ms
        elements.timer.innerText = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
    }, 50);
}

// Initialize the Codex
window.addEventListener('DOMContentLoaded', init);
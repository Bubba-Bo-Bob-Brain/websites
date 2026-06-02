/**
 * ==========================================================================
 * OPUS MAGNUM — THE ALCHEMIST'S LABORATORY
 * Core Simulation Engine
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STAGE DATA & FORMULAS ---
    const STAGES = {
        NIGREDO: {
            id: 'nigredo',
            name: 'Nigredo',
            process: 'Putrefactio',
            color: '#0d0d0d',
            glow: 'rgba(50, 50, 50, 0.3)',
            accent: '#3a3a3a',
            requiredIngredients: ['lead', 'salt'],
            requiredPlanets: ['node-saturn'],
            grimoireIndex: 0,
            logSuccess: 'Nigredo complete. The matter has died; the black crow takes flight.',
            logHint: 'Nigredo requires Plumbum and Sal, aligned under the shadow of Saturnus.'
        },
        ALBEDO: {
            id: 'albedo',
            name: 'Albedo',
            process: 'Purificatio',
            color: '#e5e9f0',
            glow: 'rgba(229, 233, 240, 0.25)',
            accent: '#ffffff',
            requiredIngredients: ['silver', 'mercury'],
            requiredPlanets: ['node-moon', 'node-mercury'],
            grimoireIndex: 1,
            logSuccess: 'Albedo achieved. Wash the ash; the white swan emerges from the dark waters.',
            logHint: 'Albedo requires Argentum and Mercurius, aligned with Luna and Mercurius.'
        },
        CITRINITAS: {
            id: 'citrinitas',
            name: 'Citrinitas',
            process: 'Sublimatio',
            color: '#d4af37',
            glow: 'rgba(212, 175, 55, 0.35)',
            accent: '#ffd000',
            requiredIngredients: ['sulfur', 'gold'],
            requiredPlanets: ['node-jupiter', 'node-venus'],
            grimoireIndex: 2,
            logSuccess: 'Citrinitas awakened. The solar dawn breaks, wisdom shines like gold leaf.',
            logHint: 'Citrinitas requires Sulphur and Aurum, aligned under Jupiter and Venus.'
        },
        RUBEDO: {
            id: 'rubedo',
            name: 'Rubedo',
            process: 'Consummatio',
            color: '#8b0000',
            glow: 'rgba(139, 0, 0, 0.55)',
            accent: '#ff2200',
            requiredIngredients: ['gold', 'mercury'],
            requiredPlanets: ['node-sun', 'node-mars'],
            grimoireIndex: 3,
            logSuccess: 'RUBEDO REACHED! The red elixir crystallizes. The Great Work is consummated.',
            logHint: 'Rubedo requires Aurum and Mercurius, aligned under Sol and Mars.'
        }
    };

    const INGREDIENTS = {
        lead: { name: 'Plumbum', color: '#404040', text: 'heavy grey dust' },
        salt: { name: 'Sal Terrae', color: '#e0dbcd', text: 'sparkling white crystals' },
        silver: { name: 'Argentum', color: '#b0c4de', text: 'pure silver dust' },
        mercury: { name: 'Mercurius', color: '#7fffd4', text: 'shimmering liquid spirit' },
        sulfur: { name: 'Sulphur', color: '#ffd700', text: 'burning yellow powder' },
        gold: { name: 'Aurum', color: '#ff8c00', text: 'gleaming solar gold' }
    };

    // --- STATE ENGINE ---
    let currentStageKey = 'NIGREDO';
    let selectedIngredientKey = null;
    let mortarIngredientKey = null;
    let grindProgress = 0;
    let crucibleIngredients = [];
    let alignedPlanets = new Set();
    let isStoneManifested = false;

    // --- DOM ELEMENT REFERENCES ---
    const nodes = document.querySelectorAll('.node-group');
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    const mortarInteractive = document.getElementById('mortar-interactive');
    const pestleHandle = document.getElementById('pestle-handle');
    const mortarFill = document.getElementById('mortar-fill');
    const grindBar = document.getElementById('grind-bar');
    const heatTransmuteBtn = document.getElementById('heat-transmute-btn');
    const crucibleLiquid = document.getElementById('liquid-mixture');
    const bubbleContainer = document.getElementById('bubbles');
    const journalConsole = document.getElementById('journal-console');
    const celestialClock = document.getElementById('celestial-clock');
    const resetBtn = document.getElementById('reset-btn');
    const stoneManifestation = document.getElementById('stone-manifestation');
    const formulaSections = document.querySelectorAll('.formula-section');

    // --- INITIALIZATION ---
    function init() {
        setupPlanetaryToggles();
        setupIngredientSelection();
        setupMortarGrinding();
        setupTransmutationExecution();
        setupRealtimeClock();
        setupBubbles();
        applyStageTheme(STAGES[currentStageKey]);
        writeToJournal('The furnace embers are lit. Align the cosmos and prepare the ingredients.', 'system-msg');
    }

    // --- JOURNAL LOGGER ---
    function writeToJournal(message, customClass = '') {
        const entry = document.createElement('p');
        entry.className = `log-entry ${customClass}`;
        entry.innerHTML = `✦ [${new Date().toLocaleTimeString()}] ${message}`;
        
        journalConsole.appendChild(entry);
        
        // Auto-scroll to the bottom of the console logs
        journalConsole.scrollTop = journalConsole.scrollHeight;
    }

    // --- CELESTIAL CLOCK GENERATOR ---
    function setupRealtimeClock() {
        const constellations = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const decans = ['I°', 'II°', 'III°'];
        
        setInterval(() => {
            const randomConst = constellations[Math.floor(Math.random() * constellations.length)];
            const randomDecan = decans[Math.floor(Math.random() * decans.length)];
            const degrees = Math.floor(Math.random() * 30);
            celestialClock.textContent = `Ascendant: ${randomConst} ✦ ${degrees}° ${randomDecan} Decan`;
        }, 12000);
    }

    // --- BUBBLES SIMULATOR (CRUCIBLE) ---
    function setupBubbles() {
        setInterval(() => {
            if (isStoneManifested) return;
            createBubble();
        }, 350);
    }

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 12 + 4;
        const leftPosition = Math.random() * 100;
        const duration = Math.random() * 2 + 2;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${leftPosition}%`;
        bubble.style.animationDuration = `${duration}s`;
        
        bubbleContainer.appendChild(bubble);

        // Remove from DOM when animation completes
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    }

    // --- STAGE VISUAL THEMING ---
    function applyStageTheme(stage) {
        const root = document.documentElement;
        
        // Dynamic CSS variables smoothly blending the atmosphere
        root.style.setProperty('--phase-color', stage.color);
        root.style.setProperty('--phase-glow', stage.glow);
        root.style.setProperty('--phase-accent', stage.accent);

        // Update Grimoire Text active highlights
        formulaSections.forEach((section, index) => {
            if (index === stage.grimoireIndex) {
                section.classList.add('active-recipe');
            } else {
                section.classList.remove('active-recipe');
            }
        });

        // Update active tracker nodes at top right
        document.querySelectorAll('.stage-node').forEach(node => {
            if (node.getAttribute('data-stage') === stage.id) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });
    }

    // --- PLANETARY ALIGNMENT ---
    function setupPlanetaryToggles() {
        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const nodeId = node.id;
                
                if (alignedPlanets.has(nodeId)) {
                    alignedPlanets.delete(nodeId);
                    node.querySelector('.node-bg').style.stroke = 'var(--gold-leaf)';
                    node.querySelector('.node-bg').style.fill = '#1c150d';
                    writeToJournal(`Celestial alignment broken with ${nodeId.split('-')[1].toUpperCase()}.`, 'system-msg');
                } else {
                    alignedPlanets.add(nodeId);
                    node.querySelector('.node-bg').style.stroke = '#ffffff';
                    node.querySelector('.node-bg').style.fill = 'var(--phase-accent)';
                    writeToJournal(`Cosmic alignment confirmed: ${nodeId.split('-')[1].toUpperCase()} is active.`, 'system-msg');
                }
                
                checkFormulas();
            });
        });
    }

    // --- INGREDIENT CABINET SELECTION ---
    function setupIngredientSelection() {
        ingredientCards.forEach(card => {
            card.addEventListener('click', () => {
                const ingredient = card.getAttribute('data-ingredient');
                
                // Toggle active card state
                ingredientCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                selectedIngredientKey = ingredient;
                
                // Automatically place it in the mortar
                loadMortar(ingredient);
            });
        });
    }

    // --- MORTAR PROCESSING ---
    function loadMortar(ingredientKey) {
        mortarIngredientKey = ingredientKey;
        grindProgress = 0;
        grindBar.style.width = '0%';
        heatTransmuteBtn.classList.add('disabled');

        const details = INGREDIENTS[ingredientKey];
        mortarFill.style.height = '15%';
        mortarFill.style.background = details.color;

        writeToJournal(`Placed raw ${details.name} into the mortar bowl.`);
    }

    function setupMortarGrinding() {
        mortarInteractive.addEventListener('click', () => {
            if (!mortarIngredientKey) {
                writeToJournal('The mortar is currently empty. Choose an ingredient from the apothecary cabinet first.', 'system-msg');
                return;
            }

            if (grindProgress >= 100) return;

            // Trigger physical pestle animation
            pestleHandle.classList.add('grind');
            setTimeout(() => {
                pestleHandle.classList.remove('grind');
            }, 300);

            // Increment grind progress
            grindProgress += 15;
            if (grindProgress > 100) grindProgress = 100;

            grindBar.style.width = `${grindProgress}%`;
            mortarFill.style.height = `${15 + (grindProgress * 0.45)}%`;

            if (grindProgress === 100) {
                const details = INGREDIENTS[mortarIngredientKey];
                writeToJournal(`Perfect grind. ${details.name} reduced to ${details.text}. Ready to heat-transmute.`, 'system-msg');
                heatTransmuteBtn.classList.remove('disabled');
            }
        });
    }

    // --- HEAT TRANSMUTATION & PROJECTING ELEMENTS ---
    function setupTransmutationExecution() {
        heatTransmuteBtn.addEventListener('click', () => {
            if (heatTransmuteBtn.classList.contains('disabled') || !mortarIngredientKey) return;

            const ingName = INGREDIENTS[mortarIngredientKey].name;
            crucibleIngredients.push(mortarIngredientKey);
            
            writeToJournal(`Projected ${ingName} dust directly into the boiling crucible!`);
            
            // Visual projection effect: briefly flash liquid to match the added dust
            const originColor = crucibleLiquid.style.background;
            crucibleLiquid.style.background = INGREDIENTS[mortarIngredientKey].color;
            
            setTimeout(() => {
                crucibleLiquid.style.background = '';
            }, 800);

            // Reset mortar
            mortarIngredientKey = null;
            grindProgress = 0;
            grindBar.style.width = '0%';
            mortarFill.style.height = '0%';
            heatTransmuteBtn.classList.add('disabled');
            ingredientCards.forEach(c => c.classList.remove('selected'));

            // Assess crucible contents
            checkFormulas();
        });
    }

    // --- VALIDATE FORMULAS AND CELESTIAL ALIGNMENTS ---
    function checkFormulas() {
        if (isStoneManifested) return;

        const stage = STAGES[currentStageKey];
        
        // 1. Check if required elements exist in the crucible
        const hasIngredients = stage.requiredIngredients.every(ing => crucibleIngredients.includes(ing));
        
        // 2. Check if required planetary nodes are aligned (active)
        const hasPlanets = stage.requiredPlanets.every(planet => alignedPlanets.has(planet));

        if (hasIngredients && hasPlanets) {
            advanceStage();
        } else if (hasIngredients && !hasPlanets) {
            writeToJournal(`The matter is prepared inside the crucible, but the astrological alignment is wrong. Refer to the Grimoire!`, 'system-msg');
        }
    }

    // --- STAGE ADVANCEMENT LOGIC ---
    function advanceStage() {
        const completedStage = STAGES[currentStageKey];
        writeToJournal(completedStage.logSuccess, 'stage-up-msg');

        // Clear crucible contents for next stage
        crucibleIngredients = [];

        // Proceed to next stage or trigger Lapis Philosophorum
        if (currentStageKey === 'NIGREDO') {
            currentStageKey = 'ALBEDO';
        } else if (currentStageKey === 'ALBEDO') {
            currentStageKey = 'CITRINITAS';
        } else if (currentStageKey === 'CITRINITAS') {
            currentStageKey = 'RUBEDO';
        } else if (currentStageKey === 'RUBEDO') {
            manifestPhilosophersStone();
            return;
        }

        applyStageTheme(STAGES[currentStageKey]);
    }

    // --- THE PHILOSOPHER'S STONE MANIFESTATION ---
    function manifestPhilosophersStone() {
        isStoneManifested = true;
        
        // Animate Stone reveal
        stoneManifestation.classList.add('reveal');
        
        // Flash central celestial ring gold
        document.querySelector('.inner-ring').style.stroke = '#ffffff';
        document.querySelector('.outer-ring').style.stroke = '#ffd700';

        writeToJournal('THE GREAT WORK IS COMPLETE! The Lapis Philosophorum radiates pure, eternal light.', 'stage-up-msg');
        writeToJournal('The alchemist has transcended. Time and mortality bend in the laboratory.', 'system-msg');
    }

    // --- RESET REVERT ACTION ---
    resetBtn.addEventListener('click', () => {
        currentStageKey = 'NIGREDO';
        selectedIngredientKey = null;
        mortarIngredientKey = null;
        grindProgress = 0;
        crucibleIngredients = [];
        alignedPlanets.clear();
        isStoneManifested = false;

        // Reset planetary stroke states
        nodes.forEach(node => {
            node.querySelector('.node-bg').style.stroke = 'var(--gold-leaf)';
            node.querySelector('.node-bg').style.fill = '#1c150d';
        });

        // Clear UI states
        stoneManifestation.classList.remove('reveal');
        mortarFill.style.height = '0%';
        grindBar.style.width = '0%';
        heatTransmuteBtn.classList.add('disabled');
        ingredientCards.forEach(c => c.classList.remove('selected'));

        applyStageTheme(STAGES[currentStageKey]);
        
        // Clear old logs and write clean state
        journalConsole.innerHTML = '';
        writeToJournal('The Opus Magnum has been dissolved. Matter returned to raw prima materia.', 'system-msg');
    });

    // Run Engine
    init();
});
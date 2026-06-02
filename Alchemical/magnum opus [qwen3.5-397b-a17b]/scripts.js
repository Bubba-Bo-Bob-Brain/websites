/**
 * OPUS MAGNUM - INTERACTIVE SCRIPT
 * Handles the logic of the Great Work: Transmutation, Stages, and Manuscript logging.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  const ALCHEMICAL_STAGES = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
  let currentStageIndex = 0;
  let crucibleContents = [];
  const MAX_INGREDIENTS = 4;

  // --- DOM ELEMENTS ---
  const body = document.body;
  const btnTransmute = document.getElementById('btn-transmute');
  const stageDots = document.querySelectorAll('.stage-dot');
  const logEntry = document.getElementById('log-entry');
  const ingredientBtns = document.querySelectorAll('.ingredient-btn');
  const liquid = document.querySelector('.liquid');
  const bubbles = document.querySelector('.bubbles');
  const coreSymbolPath = document.querySelector('.alchemical-symbol path');
  const coreContainer = document.querySelector('.core-reactor');

  // --- LATIN DICTIONARY FOR LOGS ---
  const LOG_MESSAGES = {
    nigredo: [
      "Materia Prima prepared. The darkness precedes the light.",
      "Calcination complete. The ego is burned away.",
      "Putrefaction begins. Blackness rises from the depths."
    ],
    albedo: [
      "Ablution successful. The white stone appears.",
      "Purification of the soul. The moon rises.",
      "Sublimation: The volatile becomes fixed."
    ],
    citrinitas: [
      "The sun awakens. Golden hues emerge.",
      "Fermentation brings life to the dead matter.",
      "The dawn of wisdom approaches."
    ],
    rubedo: [
      "Coagulation complete. The Red King reigns.",
      "The Philosopher's Stone is within reach.",
      "Unity achieved. As above, so below."
    ]
  };

  // --- SVG PATHS FOR SYMBOLS ---
  const SYMBOL_PATHS = {
    nigredo: "M50 5 L95 85 L5 85 Z", // Triangle (Fire/Sulfur)
    albedo: "M50 95 L5 15 L95 15 Z", // Inverted Triangle (Water/Moon)
    citrinitas: "M50 5 L95 85 L5 85 Z M50 20 L80 85 L20 85 Z", // Double Triangle (Sun)
    rubedo: "M50 5 A45 45 0 1 1 50 95 A45 45 0 1 1 50 5 M50 25 L50 75 M25 50 L75 50" // Circle + Cross (Earth/Stone)
  };

  // --- CORE FUNCTIONS ---

  /**
   * Advances the alchemical stage to the next level.
   */
  function advanceStage() {
    if (currentStageIndex < ALCHEMICAL_STAGES.length - 1) {
      currentStageIndex++;
      updateStageVisuals();
      addToLog(`Stage advanced: ${ALCHEMICAL_STAGES[currentStageIndex].toUpperCase()}`);
      triggerTransmutationEffect();
    } else {
      // Loop back or end game logic
      currentStageIndex = 0;
      updateStageVisuals();
      addToLog("The cycle resets. The Great Work is eternal.");
    }
  }

  /**
   * Updates the DOM to reflect the new stage (colors, classes, text).
   */
  function updateStageVisuals() {
    const newStage = ALCHEMICAL_STAGES[currentStageIndex];
    
    // Update Body Class for CSS Variables
    body.className = `stage-${newStage}`;

    // Update Dots
    stageDots.forEach((dot, index) => {
      if (index === currentStageIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update SVG Symbol
    if (coreSymbolPath && SYMBOL_PATHS[newStage]) {
      coreSymbolPath.setAttribute('d', SYMBOL_PATHS[newStage]);
    }

    // Adjust bubble intensity based on stage
    if (newStage === 'rubedo') {
      bubbles.style.animationDuration = '0.5s';
    } else {
      bubbles.style.animationDuration = '2s';
    }
  }

  /**
   * Simulates the visual effect of transmutation.
   */
  function triggerTransmutationEffect() {
    if (!coreContainer) return;
    
    // Flash the core
    coreContainer.style.transform = "scale(1.2)";
    coreContainer.style.transition = "transform 0.2s ease-out";
    
    setTimeout(() => {
      coreContainer.style.transform = "scale(1)";
      coreContainer.style.transition = "transform 0.5s ease-in-out";
    }, 200);
  }

  /**
   * Adds text to the manuscript log with a typing effect.
   */
  function addToLog(text) {
    if (!logEntry) return;

    // Clear current text
    logEntry.textContent = "";
    let i = 0;
    
    const typeWriter = () => {
      if (i < text.length) {
        logEntry.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30); // Typing speed
      }
    };
    
    typeWriter();
  }

  /**
   * Handles adding an ingredient to the crucible.
   */
  function addIngredient(element) {
    if (crucibleContents.length >= MAX_INGREDIENTS) {
      addToLog("The crucible is full. Initiate transmutation.");
      return;
    }

    crucibleContents.push(element);
    
    const elementNames = {
      lead: "Plumbum",
      mercury: "Hydrargyrum",
      sulfur: "Sulfur",
      salt: "Sal"
    };

    addToLog(`Added ${elementNames[element] || element} to the vessel.`);

    // Visual feedback in crucible
    const fillPercentage = (crucibleContents.length / MAX_INGREDIENTS) * 100;
    liquid.style.height = `${fillPercentage}%`;

    // Change liquid color slightly based on ingredient
    if (element === 'sulfur') liquid.style.backgroundColor = '#b8860b';
    if (element === 'mercury') liquid.style.backgroundColor = '#c0c0c0';
    if (element === 'lead') liquid.style.backgroundColor = '#555';
    if (element === 'salt') liquid.style.backgroundColor = '#eee';
  }

  /**
   * Resets the crucible.
   */
  function resetCrucible() {
    crucibleContents = [];
    liquid.style.height = '0%';
    liquid.style.backgroundColor = ''; // Reset to CSS default
    addToLog("The vessel is cleansed. Begin anew.");
  }

  // --- EVENT LISTENERS ---

  // Transmute Button
  if (btnTransmute) {
    btnTransmute.addEventListener('click', () => {
      if (crucibleContents.length === 0) {
        addToLog("The vessel is empty. Add materia first.");
      } else {
        advanceStage();
        // Optional: Reset crucible after transmutation if full
        if (crucibleContents.length >= MAX_INGREDIENTS) {
          resetCrucible();
        }
      }
    });
  }

  // Ingredient Buttons
  ingredientBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const element = e.target.dataset.element;
      if (element) {
        addIngredient(element);
      }
    });
  });

  // Stage Dots (Direct Navigation)
  stageDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentStageIndex = index;
      updateStageVisuals();
      addToLog(`Manual override: Entered ${ALCHEMICAL_STAGES[index].toUpperCase()}`);
    });
  });

  // Initialize log
  addToLog("Welcome, Alchemist. The Great Work begins.");
});
// ===== DOM Elements =====
const stageIndicators = document.querySelectorAll('.stage');
const transmutationCircle = document.querySelector('.transmutation-circle');
const crucibleLiquid = document.querySelector('.crucible-liquid');
const elementSymbols = document.querySelectorAll('.element-symbol');
const philosophersStone = document.querySelector('.philosophers-stone');
const stoneStages = document.querySelectorAll('.stone-stage');
const mortarPestle = document.getElementById('mortar');
const pestle = document.querySelector('.pestle');
const ingredientBtns = document.querySelectorAll('.ingredient-btn');
const ingredientsInMortar = document.querySelectorAll('.ingredient');
const manuscriptMarginalia = document.querySelector('.marginalia');
const zodiacSymbols = document.querySelectorAll('.zodiac-symbol');

// ===== State Management =====
let currentStage = 'nigredo';
let groundIngredients = new Set();
let isGrinding = false;
let rotationSpeed = 1; // Default speed for transmutation circle

// ===== Initialize the Laboratory =====
function initLaboratory() {
    setStage(currentStage);
    setupEventListeners();
    startAnimations();
    checkScrollMarginalia();
}

// ===== Stage Progression =====
function advanceStage() {
    const stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = (currentIndex + 1) % stages.length;
    currentStage = stages[nextIndex];
    setStage(currentStage);

    // Trigger crucible reaction if ingredients are present
    if (groundIngredients.size >= 2) {
        triggerCrucibleReaction();
    }
}

function setStage(stage) {
    // Update stage indicators
    stageIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.dataset.stage === stage) {
            indicator.classList.add('active');
        }
    });

    // Update Philosopher's Stone
    stoneStages.forEach(stone => {
        stone.style.opacity = '0';
        if (stone.classList.contains(stage)) {
            stone.style.opacity = '1';
        }
    });

    // Adjust transmutation circle speed based on stage
    switch (stage) {
        case 'nigredo':
            rotationSpeed = 1;
            break;
        case 'albedo':
            rotationSpeed = 1.5;
            break;
        case 'citrinitas':
            rotationSpeed = 2;
            break;
        case 'rubedo':
            rotationSpeed = 2.5;
            break;
    }
    updateCircleRotation();
}

// ===== Transmutation Circle Rotation =====
function updateCircleRotation() {
    const circle = transmutationCircle;
    circle.style.animation = `rotateCircle ${60 / rotationSpeed}s linear infinite`;
}

// ===== Crucible Reactions =====
function triggerCrucibleReaction() {
    crucibleLiquid.style.background = 'linear-gradient(to top, #ff6b6b, #ffd700)';
    elementSymbols.forEach(symbol => {
        symbol.style.opacity = '0';
        symbol.style.transform = 'translateY(20px)';
    });

    setTimeout(() => {
        crucibleLiquid.style.background = 'linear-gradient(to top, var(--mercury), rgba(192, 192, 192, 0.5))';
        elementSymbols.forEach(symbol => {
            symbol.style.opacity = '1';
            symbol.style.transform = 'translateY(0)';
        });
        advanceStage();
    }, 2000);
}

// ===== Mortar & Pestle Grinding =====
function grindIngredient(ingredient) {
    if (isGrinding) return;

    isGrinding = true;
    groundIngredients.add(ingredient);

    // Visual feedback: pestle animation
    pestle.style.transform = 'translateX(-50%) rotate(30deg)';
    mortarPestle.style.transform = 'scale(1.05)';

    // Show ingredient in mortar
    const ingredientElement = document.querySelector(`.ingredient[data-ingredient="${ingredient}"]`);
    if (ingredientElement) {
        ingredientElement.style.opacity = '1';
        ingredientElement.style.transform = 'scale(1)';
    }

    // Play grinding sound (placeholder: console log for demo)
    console.log(`Grinding ${ingredient}...`);

    // Reset after animation
    setTimeout(() => {
        pestle.style.transform = 'translateX(-50%) rotate(0deg)';
        mortarPestle.style.transform = 'scale(1)';
        isGrinding = false;

        // Check if enough ingredients are ground to advance stage
        if (groundIngredients.size >= 2) {
            advanceStage();
        }
    }, 1000);
}

// ===== Scroll-Triggered Marginalia =====
function checkScrollMarginalia() {
    const manuscriptPanel = document.querySelector('.manuscript-panel');
    const rect = manuscriptPanel.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
        manuscriptMarginalia.style.opacity = '1';
        manuscriptMarginalia.style.transform = 'translateY(0)';
    } else {
        manuscriptMarginalia.style.opacity = '0';
        manuscriptMarginalia.style.transform = 'translateY(20px)';
    }
}

// ===== Celestial Connections =====
function connectZodiacToElements() {
    zodiacSymbols.forEach((symbol, index) => {
        const element = elementSymbols[index % elementSymbols.length];
        const symbolRect = symbol.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const line = document.createElement('div');
        line.className = 'celestial-connection';
        line.style.position = 'fixed';
        line.style.left = `${symbolRect.left + symbolRect.width / 2}px`;
        line.style.top = `${symbolRect.top + symbolRect.height / 2}px`;
        line.style.width = '1px';
        line.style.height = `${Math.abs(elementRect.top - symbolRect.top)}px`;
        line.style.background = 'linear-gradient(to bottom, var(--gold), transparent)';
        line.style.transform = `rotate(${Math.atan2(elementRect.left - symbolRect.left, elementRect.top - symbolRect.top)}rad)`;
        line.style.transformOrigin = '0 0';
        line.style.zIndex = '-1';
        line.style.pointerEvents = 'none';
        line.style.opacity = '0.3';

        document.body.appendChild(line);

        // Animate the line
        setTimeout(() => {
            line.style.opacity = '0.7';
        }, 1000);
    });
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Stage indicators click
    stageIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            currentStage = indicator.dataset.stage;
            setStage(currentStage);
        });
    });

    // Ingredient buttons
    ingredientBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const ingredient = btn.dataset.ingredient;
            grindIngredient(ingredient);
        });
    });

    // Mortar & pestle click
    mortarPestle.addEventListener('click', () => {
        if (groundIngredients.size === 0) {
            console.log("Add ingredients first!");
            return;
        }
        grindIngredient([...groundIngredients][0]);
    });

    // Scroll for marginalia
    window.addEventListener('scroll', checkScrollMarginalia);

    // Transmutation circle click (advance stage)
    transmutationCircle.addEventListener('click', advanceStage);

    // Connect zodiac to elements on load
    window.addEventListener('load', connectZodiacToElements);
}

// ===== Animations =====
function startAnimations() {
    // Bubbles in crucible
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        bubble.style.animationDelay = `${index * 0.5}s`;
    });

    // Floating annotations
    const annotations = document.querySelectorAll('.annotation');
    annotations.forEach((annotation, index) => {
        annotation.style.animationDelay = `${index * 2}s`;
    });
}

// ===== Initialize on Load =====
window.addEventListener('DOMContentLoaded', initLaboratory);
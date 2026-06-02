// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const philosophersStone = document.getElementById('philosophers-stone');
    const stages = document.querySelectorAll('.stage');
    const crucible = document.querySelector('.crucible');
    const elements = document.querySelectorAll('.element');
    const conjunctionResult = document.getElementById('conjunction-result');
    const mortar = document.querySelector('.mortar');
    const pestle = document.getElementById('pestle-handle');
    const ingredients = document.querySelectorAll('.ingredient');
    const manuscriptPage = document.querySelector('.manuscript-page');
    const sigil = document.querySelector('.sigil');
    
    // Current stage tracking
    let currentStage = 'nigredo';
    const stageOrder = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    let stageIndex = 0;
    
    // Element states
    let elementStates = {
        sulfur: false,
        mercury: false,
        salt: false
    };
    
    // Initialize the laboratory
    function initLaboratory() {
        updateStage(currentStage);
        setupEventListeners();
        startAmbientAnimations();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Stage selection
        stages.forEach(stage => {
            stage.addEventListener('click', function() {
                const stageName = this.dataset.stage;
                updateStage(stageName);
            });
        });
        
        // Pestle grinding
        pestle.addEventListener('click', grindIngredients);
        
        // Drag ingredients to crucible
        ingredients.forEach(ingredient => {
            ingredient.addEventListener('dragstart', handleDragStart);
        });
        
        crucible.addEventListener('dragover', handleDragOver);
        crucible.addEventListener('drop', handleDrop);
        
        // Manuscript interaction
        manuscriptPage.addEventListener('click', revealSigil);
    }
    
    // Update the alchemical stage
    function updateStage(stageName) {
        // Remove active class from all stages
        stages.forEach(stage => stage.classList.remove('active'));
        
        // Add active class to selected stage
        const activeStage = document.querySelector(`.stage[data-stage="${stageName}"]`);
        if (activeStage) {
            activeStage.classList.add('active');
        }
        
        // Update philosopher's stone appearance
        philosophersStone.className = 'center-stone ' + stageName;
        
        // Store current stage
        currentStage = stageName;
        
        // Find index for stage progression
        stageIndex = stageOrder.indexOf(stageName);
    }
    
    // Progress to next stage
    function progressToNextStage() {
        if (stageIndex < stageOrder.length - 1) {
            stageIndex++;
            updateStage(stageOrder[stageIndex]);
        }
    }
    
    // Grind ingredients with mortar and pestle
    function grindIngredients() {
        // Add grinding animation
        pestle.classList.add('grind-animation');
        
        // After animation completes
        setTimeout(() => {
            pestle.classList.remove('grind-animation');
            
            // Show visual feedback
            mortar.style.boxShadow = 'inset 0 5px 15px rgba(255, 215, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3)';
            
            // Progress to next stage after grinding
            setTimeout(() => {
                progressToNextStage();
                mortar.style.boxShadow = 'inset 0 5px 10px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.3)';
            }, 1000);
        }, 500);
    }
    
    // Handle drag start for ingredients
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', this.dataset.type);
        this.style.opacity = '0.5';
    }
    
    // Handle drag over crucible
    function handleDragOver(e) {
        e.preventDefault();
    }
    
    // Handle drop into crucible
    function handleDrop(e) {
        e.preventDefault();
        const elementType = e.dataTransfer.getData('text/plain');
        
        // Reset element opacity
        document.querySelector(`.ingredient[data-type="${elementType}"]`).style.opacity = '1';
        
        // Mark element as added
        elementStates[elementType] = true;
        
        // Animate element into crucible
        const elementInCrucible = document.querySelector(`.element[data-element="${elementType}"]`);
        elementInCrucible.style.transform = 'scale(1.2)';
        elementInCrucible.style.opacity = '1';
        
        // Check if all elements are combined
        checkElementCombination();
    }
    
    // Check if all three elements are combined
    function checkElementCombination() {
        if (elementStates.sulfur && elementStates.mercury && elementStates.salt) {
            // Show conjunction result
            conjunctionResult.textContent = '🜛'; // Alchemical symbol for conjunction
            conjunctionResult.style.opacity = '1';
            
            // Add visual effects
            crucible.style.boxShadow = 'inset 0 0 30px rgba(255, 215, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.5)';
            
            // Progress to next stage after combination
            setTimeout(() => {
                progressToNextStage();
            }, 2000);
        }
    }
    
    // Reveal sigil in manuscript
    function revealSigil() {
        sigil.style.animation = 'pulse 1s infinite';
        sigil.style.color = '#d4af37';
        sigil.style.textShadow = '0 0 15px rgba(212, 175, 55, 0.8)';
        
        // Add mystical glow to manuscript
        manuscriptPage.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.1)';
        
        // Progress to next stage
        setTimeout(() => {
            progressToNextStage();
        }, 1500);
    }
    
    // Start ambient animations
    function startAmbientAnimations() {
        // Animate planetary symbols
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach((symbol, index) => {
            symbol.style.animation = `pulse ${3 + index * 0.5}s infinite`;
            symbol.style.animationDelay = `${index * 0.3}s`;
        });
        
        // Animate zodiac signs
        const signs = document.querySelectorAll('.sign');
        signs.forEach((sign, index) => {
            sign.style.animation = `pulse ${4 + index * 0.3}s infinite`;
            sign.style.animationDelay = `${index * 0.4}s`;
        });
    }
    
    // Initialize the laboratory when page loads
    initLaboratory();
});
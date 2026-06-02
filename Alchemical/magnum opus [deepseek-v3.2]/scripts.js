// ============================================
// LABORATORIUM HERMETICUM - INTERACTIVE SCRIPT
// ============================================

// Global state for the alchemical laboratory
const LaboratoryState = {
    currentStage: 'nigredo',
    stageProgress: {
        nigredo: 100,
        albedo: 40,
        citrinitas: 10,
        rubedo: 5
    },
    heatLevel: 35,
    circleRotation: false,
    circleSpeed: 1,
    materialsGround: 0,
    philosopherStoneProgress: 24,
    elapsedDays: 7,
    elapsedHours: 9,
    soundEnabled: true,
    animationsActive: true
};

// DOM Elements
const DOM = {
    // Transmutation Circle
    transmutationCircle: document.getElementById('transmutationCircle'),
    rotateCircleBtn: document.getElementById('rotateCircle'),
    advanceStageBtn: document.getElementById('advanceStage'),
    
    // Elemental Crucible
    elementalCrucible: document.getElementById('elementalCrucible'),
    heatControl: document.getElementById('heatControl'),
    heatValue: document.getElementById('heatValue'),
    
    // Mortar & Pestle
    mortarPestle: document.getElementById('mortarPestle'),
    grindBtn: document.querySelector('.grind-btn'),
    grindBar: document.querySelector('.grind-bar'),
    grindText: document.querySelector('.grind-text'),
    pestle: document.querySelector('.pestle'),
    ingredients: document.querySelectorAll('.ingredient'),
    
    // Materials Shelf
    materials: document.querySelectorAll('.material'),
    
    // Alchemical Stages
    stages: document.querySelectorAll('.stage'),
    stageProgressBars: document.querySelectorAll('.progress-bar'),
    stonePreview: document.getElementById('stonePreview'),
    conjunctioValue: document.getElementById('conjunctioValue'),
    
    // Manuscript
    marginalNotes: document.querySelectorAll('.marginal-note'),
    scrollContent: document.querySelector('.scroll-content'),
    
    // Laboratory Controls
    resetWorkBtn: document.getElementById('resetWork'),
    toggleSoundBtn: document.getElementById('toggleSound'),
    stageTransition: document.getElementById('stageTransition'),
    transitionText: document.querySelector('.transition-text'),
    
    // Time Display
    elapsedTime: document.getElementById('elapsedTime'),
    
    // Celestial Overlay
    constellations: document.querySelectorAll('.constellation')
};

// Alchemical symbols and their meanings
const AlchemicalSymbols = {
    elements: {
        fire: { symbol: '🜂', color: '#ff4500', latin: 'Ignis' },
        water: { symbol: '🜄', color: '#1e90ff', latin: 'Aqua' },
        air: { symbol: '🜁', color: '#87ceeb', latin: 'Aer' },
        earth: { symbol: '🜃', color: '#8b4513', latin: 'Terra' }
    },
    planets: {
        sun: { symbol: '☉', color: '#ffd700', latin: 'Sol' },
        moon: { symbol: '☽', color: '#c0c0c0', latin: 'Luna' },
        mercury: { symbol: '☿', color: '#a9a9a9', latin: 'Mercurius' },
        venus: { symbol: '♀', color: '#ff69b4', latin: 'Venus' },
        mars: { symbol: '♂', color: '#dc143c', latin: 'Mars' },
        jupiter: { symbol: '♃', color: '#ff8c00', latin: 'Iuppiter' },
        saturn: { symbol: '♄', color: '#8b4513', latin: 'Saturnus' }
    },
    materials: {
        quicksilver: { symbol: '☿', latin: 'Argentum Vivum', effect: 'volatile' },
        sulphur: { symbol: '🜍', latin: 'Sulphur', effect: 'combustible' },
        salt: { symbol: '🜔', latin: 'Sal', effect: 'fixative' },
        gold: { symbol: '☉', latin: 'Aurum', effect: 'noble' },
        lead: { symbol: '♄', latin: 'Plumbum', effect: 'base' },
        vitriol: { symbol: '🜖', latin: 'Vitriolum', effect: 'corrosive' }
    }
};

// Sound effects (using Web Audio API when available)
const SoundSystem = {
    audioContext: null,
    sounds: {},
    
    init() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Web Audio API not supported:', e);
        }
    },
    
    createSounds() {
        // Create simple oscillator sounds for alchemical effects
        if (!this.audioContext) return;
        
        this.sounds = {
            grind: this.createGrindSound(),
            bubble: this.createBubbleSound(),
            transition: this.createTransitionSound(),
            click: this.createClickSound()
        };
    },
    
    createGrindSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        return { oscillator, gainNode };
    },
    
    createBubbleSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        
        return { oscillator, gainNode };
    },
    
    createTransitionSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'triangle';
        
        return { oscillator, gainNode };
    },
    
    createClickSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        return { oscillator, gainNode };
    },
    
    playSound(name) {
        if (!LaboratoryState.soundEnabled || !this.sounds[name]) return;
        
        const now = this.audioContext.currentTime;
        const sound = this.sounds[name];
        
        switch(name) {
            case 'grind':
                sound.oscillator.frequency.setValueAtTime(120, now);
                sound.gainNode.gain.setValueAtTime(0.1, now);
                sound.oscillator.start(now);
                sound.oscillator.stop(now + 0.5);
                break;
                
            case 'bubble':
                sound.oscillator.frequency.setValueAtTime(200 + Math.random() * 100, now);
                sound.gainNode.gain.setValueAtTime(0.05, now);
                sound.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                sound.oscillator.start(now);
                sound.oscillator.stop(now + 0.3);
                break;
                
            case 'click':
                sound.oscillator.frequency.setValueAtTime(800, now);
                sound.gainNode.gain.setValueAtTime(0.1, now);
                sound.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                sound.oscillator.start(now);
                sound.oscillator.stop(now + 0.1);
                break;
        }
    }
};

// Initialize the laboratory
function initLaboratory() {
    console.log('Laboratorium Hermeticum initializing...');
    
    // Initialize sound system
    SoundSystem.init();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize animations
    initAnimations();
    
    // Update initial state display
    updateStageDisplay();
    updateHeatDisplay();
    updateTimeDisplay();
    updateStoneProgress();
    
    // Start circle rotation
    toggleCircleRotation(true);
    
    // Start crucible animations
    startCrucibleAnimations();
    
    // Random constellation twinkling
    initConstellationEffects();
    
    console.log('Laboratory ready. Current stage:', LaboratoryState.currentStage);
}

// Set up all event listeners
function setupEventListeners() {
    // Transmutation Circle Controls
    DOM.rotateCircleBtn.addEventListener('click', toggleCircleRotation);
    DOM.advanceStageBtn.addEventListener('click', advanceAlchemicalStage);
    
    // Heat Control
    DOM.heatControl.addEventListener('input', updateHeatLevel);
    
    // Mortar & Pestle Interaction
    DOM.grindBtn.addEventListener('click', grindIngredients);
    DOM.pestle.addEventListener('click', () => {
        SoundSystem.playSound('click');
        animatePestleStrike();
    });
    
    // Material Interactions
    DOM.materials.forEach(material => {
        material.addEventListener('click', () => {
            const materialType = material.dataset.material;
            addMaterialToCrucible(materialType);
        });
    });
    
    // Stage Transitions
    DOM.stages.forEach(stage => {
        stage.addEventListener('click', () => {
            const stageName = stage.dataset.stage;
            if (stageName !== LaboratoryState.currentStage) {
                transitionToStage(stageName);
            }
        });
    });
    
    // Manuscript Scroll Effects
    DOM.scrollContent.addEventListener('scroll', revealMarginalia);
    
    // Laboratory Controls
    DOM.resetWorkBtn.addEventListener('click', resetLaboratory);
    DOM.toggleSoundBtn.addEventListener('click', toggleSound);
    
    // Window events
    window.addEventListener('resize', handleResize);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Initialize animations
function initAnimations() {
    // Floating elements in crucible
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        // Randomize animation delay
        el.style.animationDelay = `${index * 2 + Math.random() * 2}s`;
    });
    
    // Bubbles in crucible
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        // Randomize bubble size and position
        const size = 8 + Math.random() * 8;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${20 + Math.random() * 60}%`;
    });
    
    // Start ambient animations
    requestAnimationFrame(updateAmbientAnimations);
}

// Handle crucible animations
function startCrucibleAnimations() {
    // Random bubble generation
    setInterval(() => {
        if (LaboratoryState.animationsActive) {
            createBubble();
            if (LaboratoryState.heatLevel > 50) {
                SoundSystem.playSound('bubble');
            }
        }
    }, 1000);
    
    // Update crucible color based on heat
    setInterval(() => {
        updateCrucibleAppearance();
    }, 100);
}

// Create random bubble in crucible
function createBubble() {
    if (!DOM.elementalCrucible || !LaboratoryState.animationsActive) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = 6 + Math.random() * 10;
    const left = 10 + Math.random() * 80;
    const delay = Math.random() * 2;
    
    bubble.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${0.3 + Math.random() * 0.4});
        border-radius: 50%;
        bottom: 30%;
        left: ${left}%;
        animation: bubbleFloat ${1 + Math.random() * 2}s infinite ease-in-out;
        animation-delay: ${delay}s;
        z-index: 1;
    `;
    
    DOM.elementalCrucible.appendChild(bubble);
    
    // Remove bubble after animation completes
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 3000);
}

// Update crucible appearance based on heat
function updateCrucibleAppearance() {
    const crucibleLiquid = document.querySelector('.crucible-liquid');
    if (!crucibleLiquid) return;
    
    const heat = LaboratoryState.heatLevel;
    let color1, color2;
    
    if (heat < 30) {
        // Cool - blue/green tones
        color1 = 'rgba(30, 144, 255, 0.6)';
        color2 = 'rgba(67, 179, 174, 0.8)';
    } else if (heat < 60) {
        // Warm - copper/orange tones
        color1 = 'rgba(184, 115, 51, 0.6)';
        color2 = 'rgba(220, 100, 20, 0.8)';
    } else {
        // Hot - red/orange tones
        color1 = 'rgba(220, 20, 60, 0.6)';
        color2 = 'rgba(255, 69, 0, 0.8)';
    }
    
    crucibleLiquid.style.background = `linear-gradient(to top, ${color1}, ${color2})`;
    
    // Add glow effect when very hot
    if (heat > 80) {
        DOM.elementalCrucible.style.boxShadow = `
            inset 0 -20px 30px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(255, 69, 0, 0.5)
        `;
    } else {
        DOM.elementalCrucible.style.boxShadow = `
            inset 0 -20px 30px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.5)
        `;
    }
}

// Toggle circle rotation
function toggleCircleRotation(forceState) {
    if (forceState !== undefined) {
        LaboratoryState.circleRotation = forceState;
    } else {
        LaboratoryState.circleRotation = !LaboratoryState.circleRotation;
        SoundSystem.playSound('click');
    }
    
    const circleRings = document.querySelectorAll('.circle-ring');
    
    if (LaboratoryState.circleRotation) {
        circleRings.forEach(ring => {
            ring.style.animationPlayState = 'running';
        });
        DOM.rotateCircleBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Circle';
    } else {
        circleRings.forEach(ring => {
            ring.style.animationPlayState = 'paused';
        });
        DOM.rotateCircleBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Rotate Circle';
    }
}

// Update heat level
function updateHeatLevel() {
    LaboratoryState.heatLevel = parseInt(DOM.heatControl.value);
    DOM.heatValue.textContent = LaboratoryState.heatLevel;
    
    // Update heat-dependent animations
    updateCrucibleAppearance();
    
    // Increase bubble frequency with heat
    if (LaboratoryState.heatLevel > 70 && Math.random() > 0.7) {
        createBubble();
    }
}

// Grind ingredients in mortar
function grindIngredients() {
    if (LaboratoryState.materialsGround >= 100) return;
    
    SoundSystem.playSound('grind');
    
    // Animate pestle
    animatePestleGrind();
    
    // Update grind progress
    LaboratoryState.materialsGround = Math.min(100, LaboratoryState.materialsGround + 10);
    DOM.grindBar.style.width = `${LaboratoryState.materialsGround}%`;
    
    // Update grind text
    let grindLevel;
    if (LaboratoryState.materialsGround < 30) {
        grindLevel = 'Coarse';
    } else if (LaboratoryState.materialsGround < 70) {
        grindLevel = 'Medium';
    } else {
        grindLevel = 'Fine';
    }
    DOM.grindText.textContent = grindLevel;
    
    // Animate ingredients
    DOM.ingredients.forEach(ingredient => {
        const rotation = Math.random() * 360;
        const x = Math.random() * 40 - 20;
        const y = Math.random() * 20 - 10;
        
        ingredient.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        
        // Reset after animation
        setTimeout(() => {
            ingredient.style.transform = '';
        }, 500);
    });
    
    // If grinding is complete, advance alchemical progress
    if (LaboratoryState.materialsGround >= 100) {
        setTimeout(() => {
            LaboratoryState.stageProgress.albedo = Math.min(100, LaboratoryState.stageProgress.albedo + 20);
            updateStageDisplay();
            updateStoneProgress();
            
            // Visual feedback
            showTemporaryMessage('Ingredients prepared for the White Work', 'albedo');
        }, 1000);
    }
}

// Animate pestle for grinding
function animatePestleGrind() {
    DOM.pestle.style.transform = 'rotate(-15deg) translateY(-20px)';
    
    setTimeout(() => {
        DOM.pestle.style.transform = 'rotate(-15deg)';
    }, 300);
}

// Animate pestle strike
function animatePestleStrike() {
    DOM.pestle.style.transform = 'rotate(-45deg)';
    
    setTimeout(() => {
        DOM.pestle.style.transform = 'rotate(-15deg)';
    }, 200);
}

// Add material to crucible
function addMaterialToCrucible(materialType) {
    SoundSystem.playSound('click');
    
    const materialInfo = AlchemicalSymbols.materials[materialType];
    if (!materialInfo) return;
    
    // Create floating material element
    const materialElement = document.createElement('div');
    materialElement.className = 'floating-material';
    materialElement.textContent = materialInfo.symbol;
    materialElement.dataset.material = materialType;
    
    // Style based on material
    materialElement.style.cssText = `
        position: absolute;
        font-family: 'MedievalSharp', cursive;
        font-size: 2rem;
        top: ${20 + Math.random() * 60}%;
        left: ${20 + Math.random() * 60}%;
        opacity: 0.9;
        animation: materialDissolve 3s ease-in forwards;
        z-index: 2;
    `;
    
    // Color based on material
    switch(materialType) {
        case 'quicksilver':
            materialElement.style.color = '#c0c0c0';
            materialElement.style.textShadow = '0 0 10px silver';
            break;
        case 'sulphur':
            materialElement.style.color = '#ff8c00';
            break;
        case 'gold':
            materialElement.style.color = '#ffd700';
            materialElement.style.textShadow = '0 0 10px gold';
            break;
        case 'lead':
            materialElement.style.color = '#696969';
            break;
    }
    
    DOM.elementalCrucible.appendChild(materialElement);
    
    // Remove after animation
    setTimeout(() => {
        if (materialElement.parentNode) {
            materialElement.parentNode.removeChild(materialElement);
        }
    }, 3000);
    
    // Update alchemical progress
    const progressIncrease = {
        quicksilver: 5,
        sulphur: 3,
        salt: 4,
        gold: 8,
        lead: 2,
        vitriol: 6
    }[materialType] || 2;
    
    LaboratoryState.stageProgress[LaboratoryState.currentStage] = Math.min(
        100, 
        LaboratoryState.stageProgress[LaboratoryState.currentStage] + progressIncrease
    );
    
    updateStageDisplay();
    updateStoneProgress();
    
    // Show temporary message
    showTemporaryMessage(`${materialInfo.latin} added to the Athanor`, 'info');
}

// Advance to next alchemical stage
function advanceAlchemicalStage() {
    const stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    const currentIndex = stages.indexOf(LaboratoryState.currentStage);
    
    if (currentIndex === -1 || currentIndex >= stages.length - 1) return;
    
    const nextStage = stages[currentIndex + 1];
    
    // Check if current stage is complete
    if (LaboratoryState.stageProgress[LaboratoryState.currentStage] < 100) {
        showTemporaryMessage(`Complete the ${LaboratoryState.currentStage} stage first`, 'warning');
        return;
    }
    
    // Transition to next stage
    transitionToStage(nextStage);
    SoundSystem.playSound('transition');
}

// Transition to a specific stage
function transitionToStage(stageName) {
    if (!['nigredo', 'albedo', 'citrinitas', 'rubedo'].includes(stageName)) return;
    
    // Update current stage
    LaboratoryState.currentStage = stageName;
    
    // Show transition overlay
    DOM.stageTransition.style.display = 'flex';
    
    // Set transition text based on stage
    const stageTitles = {
        nigredo: 'NIGREDO · The Blackening',
        albedo: 'ALBEDO · The Whitening',
        citrinitas: 'CITRINITAS · The Yellowing',
        rubedo: 'RUBEDO · The Reddening'
    };
    
    DOM.transitionText.textContent = stageTitles[stageName] || stageName.toUpperCase();
    
    // Update document theme
    document.documentElement.setAttribute('data-theme', stageName);
    
    // Update stage display after transition
    setTimeout(() => {
        DOM.stageTransition.style.display = 'none';
        updateStageDisplay();
        
        // Visual feedback
        const stageColors = {
            nigredo: '#b87333',
            albedo: '#c0c0c0',
            citrinitas: '#d4af37',
            rubedo: '#dc143c'
        };
        
        showTemporaryMessage(`Entering ${stageName} stage`, stageName);
        
        // Update laboratory time
        LaboratoryState.elapsedDays += 7;
        LaboratoryState.elapsedHours = (LaboratoryState.elapsedHours + 9) % 24;
        updateTimeDisplay();
        
    }, 2000);
}

// Update stage display
function updateStageDisplay() {
    // Update active stage highlight
    DOM.stages.forEach(stage => {
        if (stage.dataset.stage === LaboratoryState.currentStage) {
            stage.classList.add('active');
        } else {
            stage.classList.remove('active');
        }
    });
    
    // Update progress bars
    DOM.stageProgressBars.forEach((bar, index) => {
        const stage = DOM.stages[index];
        if (!stage) return;
        
        const stageName = stage.dataset.stage;
        const progress = LaboratoryState.stageProgress[stageName] || 0;
        
        bar.style.width = `${progress}%`;
        
        // Update progress bar color based on stage
        switch(stageName) {
            case 'nigredo':
                bar.style.background = 'linear-gradient(90deg, #2c1e1e, #b87333)';
                break;
            case 'albedo':
                bar.style.background = 'linear-gradient(90deg, #c0c0c0, #e8e3d3)';
                break;
            case 'citrinitas':
                bar.style.background = 'linear-gradient(90deg, #d4af37, #ffd700)';
                break;
            case 'rubedo':
                bar.style.background = 'linear-gradient(90deg, #8b0000, #dc143c)';
                break;
        }
    });
    
    // Update Philosopher's Stone
    updateStoneProgress();
}

// Update Philosopher's Stone progress
function updateStoneProgress() {
    // Calculate overall progress (weighted average of stages)
    const totalProgress = 
        (LaboratoryState.stageProgress.nigredo * 0.25) +
        (LaboratoryState.stageProgress.albedo * 0.25) +
        (LaboratoryState.stageProgress.citrinitas * 0.25) +
        (LaboratoryState.stageProgress.rubedo * 0.25);
    
    LaboratoryState.philosopherStoneProgress = Math.round(totalProgress);
    
    // Update display
    DOM.conjunctioValue.textContent = `${LaboratoryState.philosopherStoneProgress}%`;
    
    // Update stone appearance
    updateStoneAppearance();
}

// Update stone appearance based on progress
function updateStoneAppearance() {
    const progress = LaboratoryState.philosopherStoneProgress;
    const stoneCore = document.querySelector('.stone-core');
    const stoneGlow = document.querySelector('.stone-glow');
    
    if (!stoneCore || !stoneGlow) return;
    
    // Adjust glow intensity
    const glowIntensity = progress / 100;
    stoneGlow.style.opacity = 0.3 + (glowIntensity * 0.5);
    
    // Adjust animation speed
    stoneCore.style.animationDuration = `${5 - (glowIntensity * 3)}s`;
    stoneGlow.style.animationDuration = `${3 - (glowIntensity * 1.5)}s`;
    
    // Update gradient based on progress
    if (progress < 25) {
        stoneCore.style.background = 'radial-gradient(circle at 30% 30%, #2c1e1e, #b87333, #1a0f0f)';
    } else if (progress < 50) {
        stoneCore.style.background = 'radial-gradient(circle at 30% 30%, #c0c0c0, #e8e3d3, #b87333)';
    } else if (progress < 75) {
        stoneCore.style.background = 'radial-gradient(circle at 30% 30%, #d4af37, #ffd700, #c0c0c0)';
    } else {
        stoneCore.style.background = 'radial-gradient(circle at 30% 30%, #dc143c, #ffd700, #d4af37)';
    }
}

// Reveal marginalia as user scrolls
function revealMarginalia() {
    const scrollTop = DOM.scrollContent.scrollTop;
    const scrollHeight = DOM.scrollContent.scrollHeight;
    const clientHeight = DOM.scrollContent.clientHeight;
    
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    DOM.marginalNotes.forEach((note, index) => {
        const noteDelay = index * 0.2;
        
        if (scrollPercentage > noteDelay) {
            note.style.opacity = Math.min(1, (scrollPercentage - noteDelay) * 5);
            note.style.transform = `translateX(${Math.max(0, 10 - (scrollPercentage - noteDelay) * 20)}px)`;
        } else {
            note.style.opacity = 0;
            note.style.transform = 'translateX(10px)';
        }
    });
}

// Update time display
function updateTimeDisplay() {
    DOM.elapsedTime.textContent = `Dies: ${LaboratoryState.elapsedDays} | Hora: ${LaboratoryState.elapsedHours}`;
    
    // Increment time periodically
    setTimeout(() => {
        LaboratoryState.elapsedHours = (LaboratoryState.elapsedHours + 1) % 24;
        if (LaboratoryState.elapsedHours === 0) {
            LaboratoryState.elapsedDays++;
        }
        updateTimeDisplay();
    }, 60000); // Update every minute
}

// Initialize constellation effects
function initConstellationEffects() {
    DOM.constellations.forEach(constellation => {
        // Random twinkling
        setInterval(() => {
            if (Math.random() > 0.7) {
                constellation.style.opacity = 0.2 + Math.random() * 0.3;
                
                setTimeout(() => {
                    constellation.style.opacity = 0.1;
                }, 300 + Math.random() * 700);
            }
        }, 2000 + Math.random() * 3000);
    });
}

// Reset laboratory to initial state
function resetLaboratory() {
    if (!confirm('Restart the Great Work from the beginning?')) return;
    
    SoundSystem.playSound('transition');
    
    // Reset state
    LaboratoryState.currentStage = 'nigredo';
    LaboratoryState.stageProgress = {
        nigredo: 100,
        albedo: 40,
        citrinitas: 10,
        rubedo: 5
    };
    LaboratoryState.heatLevel = 35;
    LaboratoryState.materialsGround = 0;
    LaboratoryState.philosopherStoneProgress = 24;
    LaboratoryState.elapsedDays = 7;
    LaboratoryState.elapsedHours = 9;
    
    // Reset UI
    DOM.heatControl.value = LaboratoryState.heatLevel;
    DOM.heatValue.textContent = LaboratoryState.heatLevel;
    DOM.grindBar.style.width = '30%';
    DOM.grindText.textContent = 'Coarse';
    
    // Reset document theme
    document.documentElement.setAttribute('data-theme', 'nigredo');
    
    // Update displays
    updateStageDisplay();
    updateHeatDisplay();
    updateTimeDisplay();
    updateStoneProgress();
    
    // Restart circle rotation
    toggleCircleRotation(true);
    
    // Clear crucible
    const floatingElements = document.querySelectorAll('.floating-element, .floating-material');
    floatingElements.forEach(el => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    // Reset ingredient positions
    DOM.ingredients.forEach(ingredient => {
        ingredient.style.transform = '';
    });
    
    // Show reset message
    showTemporaryMessage('Laboratory reset. Novus Initium.', 'nigredo');
}

// Toggle sound
function toggleSound() {
    LaboratoryState.soundEnabled = !LaboratoryState.soundEnabled;
    
    const icon = DOM.toggleSoundBtn.querySelector('i');
    if (LaboratoryState.soundEnabled) {
        icon.className = 'fas fa-volume-up';
        showTemporaryMessage('Sound enabled', 'info');
    } else {
        icon.className = 'fas fa-volume-mute';
        showTemporaryMessage('Sound muted', 'info');
    }
    
    SoundSystem.playSound('click');
}

// Update ambient animations
function updateAmbientAnimations() {
    // Update floating elements in crucible
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        const time = Date.now() / 1000;
        const offset = index * 0.5;
        const y = Math.sin(time + offset) * 10;
        const x = Math.cos(time + offset * 0.7) * 5;
        
        el.style.transform = `translate(${x}px, ${y}px) rotate(${Math.sin(time + offset) * 10}deg)`;
    });
    
    // Continue animation loop
    requestAnimationFrame(updateAmbientAnimations);
}

// Show temporary message
function showTemporaryMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = 'temporary-message';
    messageElement.textContent = message;
    
    // Style based on type
    let backgroundColor, color;
    switch(type) {
        case 'nigredo':
            backgroundColor = '#2c1e1e';
            color = '#b87333';
            break;
        case 'albedo':
            backgroundColor = '#e8e3d3';
            color = '#5d4037';
            break;
        case 'citrinitas':
            backgroundColor = '#f4c430';
            color = '#5d4037';
            break;
        case 'rubedo':
            backgroundColor = '#8b0000';
            color = '#ffd700';
            break;
        case 'warning':
            backgroundColor = '#8b4513';
            color = '#ffd700';
            break;
        default:
            backgroundColor = '#1a0f0f';
            color = '#c0c0c0';
    }
    
    messageElement.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: ${backgroundColor};
        color: ${color};
        padding: 1rem 2rem;
        border-radius: 4px;
        border: 1px solid ${color};
        font-family: 'Cinzel Decorative', serif;
        font-size: 1.1rem;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        pointer-events: none;
    `;
    
    document.body.appendChild(messageElement);
    
    // Fade in
    setTimeout(() => {
        messageElement.style.opacity = 1;
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        messageElement.style.opacity = 0;
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
        case ' ':
            // Space to toggle circle rotation
            e.preventDefault();
            toggleCircleRotation();
            break;
        case 'arrowright':
        case 'd':
            // Right arrow or D to advance stage
            e.preventDefault();
            advanceAlchemicalStage();
            break;
        case 'arrowup':
        case 'w':
            // Up arrow or W to increase heat
            e.preventDefault();
            LaboratoryState.heatLevel = Math.min(100, LaboratoryState.heatLevel + 5);
            DOM.heatControl.value = LaboratoryState.heatLevel;
            updateHeatLevel();
            break;
        case 'arrowdown':
        case 's':
            // Down arrow or S to decrease heat
            e.preventDefault();
            LaboratoryState.heatLevel = Math.max(0, LaboratoryState.heatLevel - 5);
            DOM.heatControl.value = LaboratoryState.heatLevel;
            updateHeatLevel();
            break;
        case 'r':
            // R to reset
            if (e.ctrlKey) {
                e.preventDefault();
                resetLaboratory();
            }
            break;
        case 'm':
            // M to toggle sound
            e.preventDefault();
            toggleSound();
            break;
    }
}

// Handle window resize
function handleResize() {
    // Adjust circle size for smaller screens
    const circleContainer = document.querySelector('.transmutation-circle-container');
    const workbench = document.querySelector('.workbench');
    
    if (window.innerWidth < 768) {
        if (circleContainer) {
            circleContainer.style.width = '300px';
            circleContainer.style.height = '300px';
        }
    } else {
        if (circleContainer) {
            circleContainer.style.width = '400px';
            circleContainer.style.height = '400px';
        }
    }
    
    // Adjust workbench layout
    if (window.innerWidth < 1200) {
        if (workbench) {
            workbench.style.flexWrap = 'wrap';
        }
    }
}

// Update heat display
function updateHeatDisplay() {
    // This is already handled in updateHeatLevel, but we keep it for completeness
    if (DOM.heatValue) {
        DOM.heatValue.textContent = LaboratoryState.heatLevel;
    }
}

// Add CSS for material dissolve animation
function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes materialDissolve {
            0% {
                opacity: 0.9;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(0.5);
            }
        }
        
        .temporary-message {
            animation: messageFloat 3s ease-in-out;
        }
        
        @keyframes messageFloat {
            0% {
                transform: translateX(-50%) translateY(20px);
                opacity: 0;
            }
            20% {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            80% {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateX(-50%) translateY(-20px);
                opacity: 0;
            }
        }
        
        .floating-material {
            pointer-events: none;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize laboratory
    initLaboratory();
    
    // Show welcome message
    setTimeout(() => {
        showTemporaryMessage('Welcome to the Laboratorium Hermeticum. Begin the Great Work.', 'nigredo');
    }, 1000);
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LaboratoryState,
        AlchemicalSymbols,
        initLaboratory,
        resetLaboratory
    };
}
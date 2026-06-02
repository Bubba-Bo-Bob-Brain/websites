/* ============================================
   LABORATORIUM ALCHEMICUM - OPUS MAGNUM
   Interactive Alchemical Laboratory Scripts
   ============================================ */

// ═══════════════════════════════════════════════════════════════
// STATE MANAGEMENT & CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const AlchemicalState = {
    currentStage: 0, // 0: Nigredo, 1: Albedo, 2: Citrinitas, 3: Rubedo
    stages: ['nigredo', 'albedo', 'citrinitas', 'rubedo'],
    stageNames: {
        nigredo: { latin: 'Nigrum', motto: 'Solve et Coagula', color: '#0a0a0a' },
        albedo: { latin: 'Album', motto: 'Candor Sanctus', color: '#f8f5f0' },
        citrinitas: { latin: 'Flavum', motto: 'Aurum Potabile', color: '#ffd700' },
        rubedo: { latin: 'Rubrum', motto: 'Lapis Philosophorum', color: '#8b0000' }
    },
    grindingProgress: 0,
    maxGrinding: 10,
    isGrinding: false,
    ingredients: [
        { name: 'Vitriol', symbol: '🧪', latin: 'Vitriolum' },
        { name: 'Mercurius', symbol: '☿', latin: 'Mercurius Vivus' },
        { name: 'Sulphur', symbol: '🔥', latin: 'Sulphur' },
        { name: 'Sal', symbol: '🧂', latin: 'Sal' },
        { name: 'Luna', symbol: '☽', latin: 'Argentum' },
        { name: 'Sol', symbol: '☉', latin: 'Aurum' }
    ],
    ingredientsAdded: [],
    stoneFormation: 0, // 0-100%
    celestialPhase: 0
};

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initializeLaboratory();
    startStageProgression();
    initializeCrucible();
    initializeStars();
    initializeScrollReveal();
    initializeMortar();
    initializePlanetaryInteractions();
    initializeKnowledgePanel();
    initializeTransmutationCircle();
    updateStageDisplay();
});

function initializeLaboratory() {
    // Add initial ingredients to the lab
    const container = document.getElementById('ingredients-container');
    AlchemicalState.ingredients.forEach((ing, index) => {
        const el = document.createElement('div');
        el.className = 'ingredient';
        el.dataset.index = index;
        el.innerHTML = `${ing.symbol} ${ing.name}`;
        el.title = `${ing.latin} - ${ing.name}`;
        container.appendChild(el);
    });
    
    // Start with first stage active
    updateStage(0);
}

// ═══════════════════════════════════════════════════════════════
// STAGE PROGRESSION SYSTEM
// ═══════════════════════════════════════════════════════════════

function startStageProgression() {
    // Auto-progress through stages every 30 seconds (for demo)
    // In a real scenario, this would be triggered by user actions
    setInterval(() => {
        if (AlchemicalState.currentStage < 3) {
            advanceStage();
        }
    }, 30000);
}

function advanceStage() {
    if (AlchemicalState.currentStage < 3) {
        updateStage(AlchemicalState.currentStage + 1);
        
        // Add stage transition effects
        triggerStageTransition();
        
        // Update stone formation
        AlchemicalState.stoneFormation = (AlchemicalState.currentStage + 1) * 25;
        updateStoneFormation();
    }
}

function updateStage(stageIndex) {
    AlchemicalState.currentStage = stageIndex;
    const stage = AlchemicalState.stages[stageIndex];
    
    // Update stage indicators
    document.querySelectorAll('.stage-indicator').forEach((ind, i) => {
        ind.classList.remove('active', 'completed');
        if (i === stageIndex) {
            ind.classList.add('active');
        } else if (i < stageIndex) {
            ind.classList.add('completed');
        }
    });
    
    // Update Latin motto
    const mottoEl = document.getElementById('latin-motto');
    if (mottoEl) {
        mottoEl.textContent = `"${AlchemicalState.stageNames[stage].motto}"`;
        mottoEl.style.opacity = '0';
        setTimeout(() => {
            mottoEl.style.opacity = '1';
            mottoEl.style.transition = 'opacity 1s ease-in-out';
        }, 100);
    }
    
    // Update transmutation circle colors
    updateTransmutationCircleColors(stage);
    
    // Update crucible liquid color
    updateCrucibleLiquid(stage);
    
    // Update Philosopher's Stone
    updateStoneColors(stage);
    
    // Update orbital elements
    updateOrbitalElements(stage);
}

function updateStageDisplay() {
    // Initial display update
    updateStage(0);
}

function triggerStageTransition() {
    // Flash effect across the entire lab
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        animation: stageFlash 2s ease-out forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes stageFlash {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
        style.remove();
    }, 2000);
}

// ═══════════════════════════════════════════════════════════════
// TRANSMUTATION CIRCLE INTERACTIONS
// ═══════════════════════════════════════════════════════════════

function initializeTransmutationCircle() {
    const circle = document.querySelector('.transmutation-circle');
    const core = document.querySelector('.transmutation-core');
    const planetarySymbols = document.querySelectorAll('.planet-symbol');
    
    // Click on core to trigger special effect
    if (core) {
        core.style.cursor = 'pointer';
        core.addEventListener('click', () => {
            triggerCoreActivation();
        });
    }
    
    // Planetary symbol interactions
    planetarySymbols.forEach(symbol => {
        symbol.style.cursor = 'pointer';
        symbol.addEventListener('click', (e) => {
            const planet = e.currentTarget.dataset.planet;
            activatePlanet(planet);
        });
        
        symbol.addEventListener('mouseenter', (e) => {
            const planet = e.currentTarget.dataset.planet;
            showPlanetInfo(planet);
        });
        
        symbol.addEventListener('mouseleave', () => {
            hidePlanetInfo();
        });
    });
    
    // Circle speed control based on stage
    updateCircleRotationSpeed();
}

function updateTransmutationCircleColors(stage) {
    const colors = {
        nigredo: { primary: '#2a1a1a', secondary: '#0a0a0a', glow: 'rgba(184, 134, 11, 0.3)' },
        albedo: { primary: '#e8e4df', secondary: '#f8f5f0', glow: 'rgba(248, 245, 240, 0.5)' },
        citrinitas: { primary: '#ffd700', secondary: '#ffaa00', glow: 'rgba(255, 215, 0, 0.6)' },
        rubedo: { primary: '#dc143c', secondary: '#8b0000', glow: 'rgba(139, 0, 0, 0.7)' }
    };
    
    const colorSet = colors[stage];
    
    // Update core circle
    const coreCircle = document.querySelector('.core-circle');
    if (coreCircle) {
        coreCircle.style.fill = colorSet.secondary;
        coreCircle.style.stroke = colorSet.primary;
        coreCircle.style.filter = `drop-shadow(0 0 15px ${colorSet.primary})`;
    }
    
    // Update core symbol
    const coreSymbol = document.querySelector('.core-symbol');
    if (coreSymbol) {
        coreSymbol.style.fill = colorSet.primary;
    }
    
    // Update pulse ring
    const pulseRing = document.querySelector('.pulse-ring');
    if (pulseRing) {
        pulseRing.style.stroke = colorSet.primary;
    }
    
    // Update geometric patterns
    const geometricPatterns = document.querySelectorAll('.geometric-pattern');
    geometricPatterns.forEach(pattern => {
        pattern.style.stroke = colorSet.primary;
        pattern.style.opacity = '0.6';
    });
    
    // Update seal triangles
    const triangles = document.querySelectorAll('.seal-triangle');
    triangles.forEach(tri => {
        tri.style.stroke = colorSet.glow;
    });
}

function updateCircleRotationSpeed() {
    const circle = document.querySelector('.transmutation-circle');
    const speeds = {
        nigredo: '120s',
        albedo: '90s',
        citrinitas: '60s',
        rubedo: '30s'
    };
    
    const stage = AlchemicalState.stages[AlchemicalState.currentStage];
    circle.style.animationDuration = speeds[stage];
}

function triggerCoreActivation() {
    const core = document.querySelector('.transmutation-core');
    core.classList.add('activating');
    
    // Create expanding ring effect
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', '400');
    ring.setAttribute('cy', '400');
    ring.setAttribute('r', '80');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--gold-bright'));
    ring.setAttribute('stroke-width', '4');
    ring.classList.add('activation-ring');
    
    const svg = document.querySelector('.transmutation-circle');
    svg.appendChild(ring);
    
    // Animate ring
    ring.animate([
        { r: 80, opacity: 1, strokeWidth: 4 },
        { r: 200, opacity: 0, strokeWidth: 0 }
    ], {
        duration: 2000,
        easing: 'ease-out'
    }).onfinish = () => ring.remove();
    
    setTimeout(() => {
        core.classList.remove('activating');
    }, 1000);
}

function activatePlanet(planet) {
    const planetSymbol = document.querySelector(`[data-planet="${planet}"]`);
    if (!planetSymbol) return;
    
    // Visual feedback
    planetSymbol.classList.add('activated');
    const circle = planetSymbol.querySelector('circle');
    circle.style.fill = getComputedStyle(document.documentElement).getPropertyValue('--gold-bright');
    circle.style.filter = 'drop-shadow(0 0 15px gold)';
    
    // Create particle effect
    createPlanetParticles(planetSymbol);
    
    setTimeout(() => {
        planetSymbol.classList.remove('activated');
        // Reset color based on current stage
        const stage = AlchemicalState.stages[AlchemicalState.currentStage];
        const colors = {
            nigredo: '#c9b896',
            albedo: '#f8f5f0',
            citrinitas: '#ffd700',
            rubedo: '#8b0000'
        };
        circle.style.fill = colors[stage];
        circle.style.filter = '';
    }, 2000);
}

function createPlanetParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 6px;
            height: 6px;
            background: gold;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 6px gold;
        `;
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function showPlanetInfo(planet) {
    const info = document.createElement('div');
    info.id = 'planet-info';
    info.className = 'planet-tooltip';
    info.style.cssText = `
        position: fixed;
        padding: 8px 12px;
        background: rgba(10, 10, 10, 0.9);
        color: #f5e6c8;
        font-family: 'Crimson Text', serif;
        font-size: 0.9rem;
        border: 1px solid #b8860b;
        border-radius: 4px;
        pointer-events: none;
        z-index: 1000;
        max-width: 200px;
    `;
    
    const planetData = {
        sol: { name: 'Sol (Sun)', latin: 'Sol', element: 'Gold', virtue: 'Consciousness' },
        luna: { name: 'Luna (Moon)', latin: 'Luna', element: 'Silver', virtue: 'Intuition' },
        mercurius: { name: 'Mercurius', latin: 'Mercurius', element: 'Mercury', virtue: 'Transformation' },
        venus: { name: 'Venus', latin: 'Venus', element: 'Copper', virtue: 'Love' },
        mars: { name: 'Mars', latin: 'Mars', element: 'Iron', virtue: 'Will' },
        jupiter: { name: 'Jupiter', latin: 'Iupiter', element: 'Tin', virtue: 'Expansion' }
    };
    
    const data = planetData[planet];
    info.innerHTML = `
        <strong style="color: #ffd700;">${data.name}</strong><br>
        <em>${data.latin}</em><br>
        Element: ${data.element}<br>
        Virtue: ${data.virtue}
    `;
    
    document.body.appendChild(info);
    
    // Position near mouse
    const updatePosition = (e) => {
        info.style.left = (e.clientX + 15) + 'px';
        info.style.top = (e.clientY + 15) + 'px';
    };
    
    document.addEventListener('mousemove', updatePosition);
    
    setTimeout(() => {
        document.removeEventListener('mousemove', updatePosition);
        info.remove();
    }, 3000);
}

function hidePlanetInfo() {
    const info = document.getElementById('planet-info');
    if (info) info.remove();
}

// ═══════════════════════════════════════════════════════════════
// CRUCIBLE & BUBBLING ANIMATION
// ═══════════════════════════════════════════════════════════════

function initializeCrucible() {
    startBubbleGeneration();
    startVaporAnimation();
    updateCrucibleLiquid(0); // Start with Nigredo
}

function startBubbleGeneration() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;
    
    setInterval(() => {
        createBubble(container);
    }, 800 + Math.random() * 1200);
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size and position
    const size = 4 + Math.random() * 8;
    const left = 20 + Math.random() * 60;
    
    bubble.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${2 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
    `;
    
    container.appendChild(bubble);
    
    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, 4000);
}

function startVaporAnimation() {
    const vapor = document.getElementById('vapor');
    if (!vapor) return;
    
    // Randomize vapor intensity based on stage
    setInterval(() => {
        const intensity = 0.3 + (AlchemicalState.currentStage * 0.2);
        vapor.style.animationDuration = (3 + Math.random() * 2) + 's';
        vapor.style.opacity = intensity;
    }, 5000);
}

function updateCrucibleLiquid(stage) {
    const liquid = document.getElementById('alchemical-liquid');
    if (!liquid) return;
    
    const colors = {
        nigredo: 'linear-gradient(180deg, #0a0a0a 0%, #2a1a1a 100%)',
        albedo: 'linear-gradient(180deg, #f8f5f0 0%, #e8e4df 100%)',
        citrinitas: 'linear-gradient(180deg, #ffd700 0%, #ffaa00 100%)',
        rubedo: 'linear-gradient(180deg, #8b0000 0%, #dc143c 100%)'
    };
    
    liquid.style.background = colors[AlchemicalState.stages[stage]];
    
    // Add shimmer effect
    if (stage >= 2) { // Citrinitas and Rubedo
        liquid.classList.add('shimmering');
    } else {
        liquid.classList.remove('shimmering');
    }
}

// ═══════════════════════════════════════════════════════════════
// SCROLL REVEAL FOR MANUSCRIPT
// ═══════════════════════════════════════════════════════════════

function initializeScrollReveal() {
    const pages = document.querySelectorAll('.manuscript-page');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after reveal
                // observer.unobserve(entry.target);
            } else {
                // Hide when scrolling away (for repeated effect)
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    pages.forEach(page => observer.observe(page));
}

// ═══════════════════════════════════════════════════════════════
// MORTAR & PESTLE INTERACTION
// ═══════════════════════════════════════════════════════════════

function initializeMortar() {
    const pestle = document.getElementById('pestle');
    const mortarContainer = document.getElementById('mortar-container');
    const groundSubstance = document.getElementById('ground-substance');
    const results = document.getElementById('grinding-results');
    
    if (!pestle || !mortarContainer) return;
    
    let grindCount = 0;
    const messages = [
        'Pulverizo materiam primam...',
        'Solve et coagula...',
        'Mercurius fixatur...',
        'Subtilitas augentur...',
        'Materia purificatur...',
        'Cibatio incipe...',
        'Calcinatio perfecta...',
        'Separatio elementorum...',
        'Coniunctio oppositum...',
        'Perfectio appropinquat...'
    ];
    
    pestle.addEventListener('click', () => {
        if (grindCount >= AlchemicalState.maxGrinding) {
            showMessage(results, '⚡ Materia iam perfecte pulverizata est!', 'success');
            return;
        }
        
        // Animate pestle
        pestle.style.animation = 'none';
        setTimeout(() => {
            pestle.style.animation = '';
        }, 10);
        
        // Increment grinding
        grindCount++;
        AlchemicalState.grindingProgress = grindCount;
        
        // Update ground substance level
        const height = (grindCount / AlchemicalState.maxGrinding) * 60;
        groundSubstance.style.height = height + '%';
        
        // Show message
        const message = messages[Math.min(grindCount - 1, messages.length - 1)];
        showMessage(results, `✓ ${message}`, 'grind');
        
        // Check for completion
        if (grindCount === AlchemicalState.maxGrinding) {
            setTimeout(() => {
                showMessage(results, '🔥 Materia prima perfecte praeparata!', 'complete');
                triggerIngredientAddition();
            }, 500);
        }
        
        // Add sound effect simulation (visual feedback)
        createGrindParticles(mortarContainer);
    });
}

function showMessage(container, text, type) {
    const msg = document.createElement('div');
    msg.className = 'grind-message';
    msg.textContent = text;
    
    if (type === 'complete') {
        msg.style.background = 'var(--gold-bright)';
        msg.style.color = 'var(--parchment-dark)';
    }
    
    container.appendChild(msg);
    
    setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transform = 'scale(0.8)';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

function createGrindParticles(container) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.7;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX + (Math.random() - 0.5) * 40}px;
            top: ${centerY}px;
            width: 4px;
            height: 4px;
            background: var(--parchment-stain);
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
        `;
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: `translateY(${-20 - Math.random() * 30}px) translateX(${(Math.random() - 0.5) * 30}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 400,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function triggerIngredientAddition() {
    const container = document.getElementById('ingredients-container');
    const ingredients = AlchemicalState.ingredients;
    
    // Add random ingredients to crucible
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const randomIng = ingredients[Math.floor(Math.random() * ingredients.length)];
            if (!AlchemicalState.ingredientsAdded.includes(randomIng.name)) {
                AlchemicalState.ingredientsAdded.push(randomIng.name);
                
                // Visual feedback
                const ingEl = document.createElement('div');
                ingEl.className = 'ingredient added';
                ingEl.innerHTML = `${randomIng.symbol} ${randomIng.name}`;
                ingEl.style.background = 'var(--gold-bright)';
                ingEl.style.color = 'var(--parchment-dark)';
                container.appendChild(ingEl);
                
                // Create sparkle effect
                createSparkle(ingEl);
            }
        }, i * 500);
    }
}

function createSparkle(element) {
    const rect = element.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width/2}px;
        top: ${rect.top + rect.height/2}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, gold 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
    `;
    document.body.appendChild(sparkle);
    
    sparkle.animate([
        { transform: 'scale(0) rotate(0deg)', opacity: 1 },
        { transform: 'scale(2) rotate(180deg)', opacity: 0 }
    ], {
        duration: 800,
        easing: 'ease-out'
    }).onfinish = () => sparkle.remove();
}

// ═══════════════════════════════════════════════════════════════
// PHILOSOPHER'S STONE FORMATION
// ═══════════════════════════════════════════════════════════════

function updateStoneFormation() {
    const stone = document.getElementById('stone');
    const aura = document.getElementById('stone-aura');
    
    if (!stone || !aura) return;
    
    // Update stone rotation speed based on stage
    const core = stone.querySelector('.stone-core');
    const durations = [20, 15, 10, 5]; // seconds for each stage
    core.style.animationDuration = durations[AlchemicalState.currentStage] + 's';
    
    // Update aura intensity
    const auraIntensity = 0.3 + (AlchemicalState.currentStage * 0.2);
    aura.style.opacity = auraIntensity;
    
    // Add stone growth effect
    stone.classList.add('forming');
    setTimeout(() => {
        stone.classList.remove('forming');
    }, 2000);
}

function updateStoneColors(stage) {
    const stone = document.getElementById('stone');
    if (!stone) return;
    
    const colors = {
        nigredo: { gradient: 'linear-gradient(135deg, rgba(50,50,50,0.7) 0%, rgba(10,10,10,0.9) 100%)' },
        albedo: { gradient: 'linear-gradient(135deg, rgba(250,245,240,0.7) 0%, rgba(200,200,200,0.9) 100%)' },
        citrinitas: { gradient: 'linear-gradient(135deg, rgba(255,215,0,0.7) 0%, rgba(255,170,0,0.9) 100%)' },
        rubedo: { gradient: 'linear-gradient(135deg, rgba(255,0,0,0.7) 0%, rgba(139,0,0,0.9) 100%)' }
    };
    
    const facets = stone.querySelectorAll('.facet');
    facets.forEach(facet => {
        facet.style.background = colors[AlchemicalState.stages[stage]].gradient;
    });
    
    // Update core
    const core = stone.querySelector('.stone-core');
    const coreColors = {
        nigredo: 'radial-gradient(circle at 30% 30%, #888 0%, #222 100%)',
        albedo: 'radial-gradient(circle at 30% 30%, #fff 0%, #ccc 100%)',
        citrinitas: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #ffaa00 100%)',
        rubedo: 'radial-gradient(circle at 30% 30%, #ff0000 0%, #8b0000 100%)'
    };
    core.style.background = coreColors[AlchemicalState.stages[stage]];
}

// ═══════════════════════════════════════════════════════════════
// CELESTIAL STARS GENERATION
// ═══════════════════════════════════════════════════════════════

function initializeStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        createStar(container);
    }
    
    // Twinkling animation
    setInterval(() => {
        const stars = container.querySelectorAll('.star');
        const randomStar = stars[Math.floor(Math.random() * stars.length)];
        randomStar.classList.toggle('twinkle');
    }, 200);
}

function createStar(container) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    // Random size
    const size = 1 + Math.random() * 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    // Random twinkle delay
    star.style.animationDelay = Math.random() * 3 + 's';
    
    container.appendChild(star);
}

// ═══════════════════════════════════════════════════════════════
// ORBITAL ELEMENTS RESPONSIVENESS
// ═══════════════════════════════════════════════════════════════

function updateOrbitalElements(stage) {
    const orbitals = document.querySelectorAll('.orbital-element');
    const opacities = [0.6, 0.7, 0.8, 0.9];
    
    orbitals.forEach((orb, index) => {
        orb.style.opacity = opacities[stage];
        orb.style.transform = `translate(${index < 2 ? '-50%' : '0'}, -50%) scale(${1 + stage * 0.1})`;
    });
}

// ═══════════════════════════════════════════════════════════════
// PLANETARY INTERACTIONS (Already defined above)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// HIDDEN KNOWLEDGE PANEL
// ═══════════════════════════════════════════════════════════════

function initializeKnowledgePanel() {
    const toggle = document.querySelector('.knowledge-toggle');
    const panel = document.querySelector('.hidden-knowledge');
    
    if (!toggle || !panel) return;
    
    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Decrypt effect on secret text
        if (panel.classList.contains('active')) {
            const secret = document.getElementById('secret-text');
            if (secret) {
                secret.classList.add('decrypting');
                setTimeout(() => {
                    secret.classList.remove('decrypting');
                }, 3000);
            }
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            panel.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// STAGE NAVIGATION CLICK HANDLERS
// ═══════════════════════════════════════════════════════════════

document.querySelectorAll('.stage-indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
        const stage = indicator.dataset.stage;
        const stageIndex = AlchemicalState.stages.indexOf(stage);
        if (stageIndex !== -1) {
            updateStage(stageIndex);
        }
    });
});

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    // Number keys 1-4 for stage selection
    if (e.key >= '1' && e.key <= '4') {
        const stageIndex = parseInt(e.key) - 1;
        if (stageIndex <= AlchemicalState.currentStage) {
            updateStage(stageIndex);
        }
    }
    
    // Space to advance stage (if not in input)
    if (e.key === ' ' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        if (AlchemicalState.currentStage < 3) {
            advanceStage();
        }
    }
    
    // 'K' to toggle knowledge panel
    if (e.key === 'k' || e.key === 'K') {
        document.querySelector('.knowledge-toggle')?.click();
    }
});

// ═══════════════════════════════════════════════════════════════
// ADVANCED EFFECTS & POLISH
// ═══════════════════════════════════════════════════════════════

// Add shimmer effect to liquid when in Citrinitas or Rubedo
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
    }
    .liquid.shimmering {
        background-size: 200% 100%;
        animation: shimmer 3s linear infinite;
    }
`;
document.head.appendChild(shimmerStyle);

// Stone formation pulse effect
const stonePulseStyle = document.createElement('style');
stonePulseStyle.textContent = `
    @keyframes stonePulse {
        0%, 100% { filter: brightness(1) drop-shadow(0 0 20px currentColor); }
        50% { filter: brightness(1.3) drop-shadow(0 0 40px currentColor); }
    }
    .stone-inner.forming {
        animation: stonePulse 2s ease-in-out;
    }
`;
document.head.appendChild(stonePulseStyle);

// Activation ring animation for core
const activationRingStyle = document.createElement('style');
activationRingStyle.textContent = `
    @keyframes ringExpand {
        0% { r: 80; stroke-width: 4; opacity: 1; }
        100% { r: 250; stroke-width: 0; opacity: 0; }
    }
    .activation-ring {
        animation: ringExpand 2s ease-out forwards;
    }
`;
document.head.appendChild(activationRingStyle);

// Planetary activation effect
const planetActivationStyle = document.createElement('style');
planetActivationStyle.textContent = `
    .planet-symbol.activated circle {
        animation: planetPulse 0.5s ease-out 3;
    }
    @keyframes planetPulse {
        0% { r: 30; }
        50% { r: 40; }
        100% { r: 30; }
    }
`;
document.head.appendChild(planetActivationStyle);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Throttle scroll events for scroll-based animations
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            // Any scroll-based updates can go here
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Clean up animations on page hide
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause intensive animations
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c⚗️ LABORATORIUM ALCHEMICUM ⚗️', 
    'font-size: 20px; color: #b8860b; font-weight: bold; text-shadow: 0 0 10px gold;');
console.log('%cSolve et Coagula', 
    'font-size: 14px; color: #8a7050; font-style: italic;');
console.log('%cPress K to toggle hidden knowledge', 
    'font-size: 12px; color: #5a4030;');
console.log('%cPress 1-4 to jump to stages (unlocked)', 
    'font-size: 12px; color: #5a4030;');
console.log('%cPress Space to advance stage', 
    'font-size: 12px; color: #5a4030;');

// ============================================
// FINAL INITIALIZATION COMPLETE
// ============================================

console.log('✅ Alchemical Laboratory initialized successfully');
console.log(`🎯 Current stage: ${AlchemicalState.stages[AlchemicalState.currentStage]}`);
console.log('🧪 The Great Work begins...');
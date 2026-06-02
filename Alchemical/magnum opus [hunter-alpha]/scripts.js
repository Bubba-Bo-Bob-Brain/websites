/**
 * OPUS MAGNUM — THE ALCHEMICAL LABORATORY
 * Interactive Renaissance Hermetic Workspace
 * ==========================================
 */

// ============================================
// CONFIGURATION & STATE
// ============================================

const CONFIG = {
    stages: [
        {
            name: 'nigredo',
            title: 'Nigredo',
            subtitle: 'The Blackening — Putrefactio',
            description: 'Death and dissolution of the prima materia',
            formula: 'Solve et Coagula — Dissolve the body, free the soul',
            color: '#1a1a1a',
            glowColor: 'rgba(60, 60, 60, 0.3)',
            elementsRequired: ['earth', 'water'],
            rotationSpeed: 120
        },
        {
            name: 'albedo',
            title: 'Albedo',
            subtitle: 'The Whitening — Purificatio',
            description: 'Purification through the waters of life',
            formula: 'Aqua Vitae — The soul is cleansed by lunar light',
            color: '#f0f0f0',
            glowColor: 'rgba(240, 240, 240, 0.2)',
            elementsRequired: ['water', 'air'],
            rotationSpeed: 90
        },
        {
            name: 'citrinitas',
            title: 'Citrinitas',
            subtitle: 'The Yellowing — Aurora',
            description: 'The dawning of solar consciousness',
            formula: 'Sol Oriens — Wisdom manifests through philosophical fire',
            color: '#daa520',
            glowColor: 'rgba(218, 165, 32, 0.3)',
            elementsRequired: ['fire', 'air'],
            rotationSpeed: 60
        },
        {
            name: 'rubedo',
            title: 'Rubedo',
            subtitle: 'The Reddening — Perfectio',
            description: 'The Philosopher\'s Stone is complete',
            formula: 'Lapis Philosophorum — The King rises, crowned in red',
            color: '#8b0000',
            glowColor: 'rgba(139, 0, 0, 0.4)',
            elementsRequired: ['fire', 'earth'],
            rotationSpeed: 30
        }
    ],
    particles: {
        count: 50,
        colors: ['#c9a227', '#b87333', '#ffd700', '#8b7355'],
        maxSize: 3,
        minSize: 0.5
    },
    constellations: {
        count: 80,
        connectionDistance: 120
    }
};

const state = {
    currentStage: -1, // -1 = initium
    addedElements: [],
    grindCount: 0,
    requiredGrinds: 5,
    manuscriptRevealed: 0,
    isAnimating: false,
    circleRotation: 0,
    particles: [],
    stars: []
};

// ============================================
// DOM REFERENCES
// ============================================

const DOM = {
    // Canvases
    celestialCanvas: document.getElementById('celestial-canvas'),
    particleCanvas: document.getElementById('particle-canvas'),
    
    // Transmutation circle
    transmutationCircle: document.getElementById('transmutationCircle'),
    circleGlow: document.getElementById('circleGlow'),
    circleCenter: document.getElementById('circleCenter'),
    eyeOfProvidence: document.getElementById('eyeOfProvidence'),
    stoneEmergence: document.getElementById('stoneEmergence'),
    
    // Stage indicator
    stageIndicator: document.getElementById('stageIndicator'),
    stageMarkers: document.querySelectorAll('.stage-marker'),
    stageLines: document.querySelectorAll('.stage-line'),
    
    // Controls
    advanceBtn: document.getElementById('advanceBtn'),
    resetBtn: document.getElementById('resetBtn'),
    
    // Stage label
    stageLabel: document.getElementById('stageLabel'),
    stageName: document.querySelector('.stage-name'),
    stageDescription: document.querySelector('.stage-description'),
    
    // Crucible
    crucibleContainer: document.getElementById('crucibleContainer'),
    steamContainer: document.getElementById('steamContainer'),
    
    // Elements
    elementTray: document.getElementById('elementTray'),
    elementDraggables: document.querySelectorAll('.element-draggable'),
    
    // Mortar
    mortarPestle: document.getElementById('mortarPestle'),
    pestle: document.getElementById('pestle'),
    grindParticles: document.getElementById('grindParticles'),
    
    // Manuscript
    manuscript: document.getElementById('manuscript'),
    manuscriptPage: document.getElementById('manuscriptPage'),
    manuscriptSections: document.querySelectorAll('.manuscript-section'),
    waxSeal: document.getElementById('waxSeal'),
    
    // Formula
    formulaText: document.getElementById('formulaText'),
    
    // Tooltip
    tooltip: document.getElementById('tooltip'),
    tooltipContent: document.querySelector('.tooltip-content'),
    
    // Planets
    planets: document.querySelectorAll('.planet')
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
    setupCanvases();
    setupEventListeners();
    initParticles();
    initStars();
    animate();
    revealManuscriptSection(0);
    
    // Initial state
    updateStageDisplay();
    
    console.log('⚗️ Opus Magnum initialized — Begin the Great Work');
}

// ============================================
// CANVAS SETUP
// ============================================

function setupCanvases() {
    const resize = () => {
        DOM.celestialCanvas.width = window.innerWidth;
        DOM.celestialCanvas.height = window.innerHeight;
        DOM.particleCanvas.width = window.innerWidth;
        DOM.particleCanvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
}

// ============================================
// PARTICLE SYSTEM
// ============================================

function initParticles() {
    state.particles = [];
    for (let i = 0; i < CONFIG.particles.count; i++) {
        state.particles.push(createParticle());
    }
}

function createParticle() {
    return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: CONFIG.particles.minSize + Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize),
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.1,
        color: CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        life: Math.random() * 200 + 100
    };
}

function updateParticles() {
    state.particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;
        p.opacity = Math.max(0, p.opacity - 0.002);
        
        if (p.life <= 0 || p.y < -10 || p.opacity <= 0) {
            state.particles[i] = createParticle();
            state.particles[i].y = window.innerHeight + 10;
        }
    });
}

function drawParticles(ctx) {
    ctx.clearRect(0, 0, DOM.particleCanvas.width, DOM.particleCanvas.height);
    
    state.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.opacity * 0.3;
        ctx.fill();
    });
    
    ctx.globalAlpha = 1;
}

// ============================================
// CONSTELLATION / CELESTIAL SYSTEM
// ============================================

function initStars() {
    state.stars = [];
    for (let i = 0; i < CONFIG.constellations.count; i++) {
        state.stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
}

function drawConstellations(ctx) {
    ctx.clearRect(0, 0, DOM.celestialCanvas.width, DOM.celestialCanvas.height);
    
    // Update and draw stars
    state.stars.forEach(star => {
        star.twinkle += star.twinkleSpeed;
        const opacity = 0.3 + Math.sin(star.twinkle) * 0.3;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = '#c9a227';
        ctx.globalAlpha = opacity;
        ctx.fill();
    });
    
    // Draw constellation lines
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.15;
    
    for (let i = 0; i < state.stars.length; i++) {
        for (let j = i + 1; j < state.stars.length; j++) {
            const dx = state.stars[i].x - state.stars[j].x;
            const dy = state.stars[i].y - state.stars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < CONFIG.constellations.connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(state.stars[i].x, state.stars[i].y);
                ctx.lineTo(state.stars[j].x, state.stars[j].y);
                ctx.stroke();
            }
        }
    }
    
    ctx.globalAlpha = 1;
}

// ============================================
// ANIMATION LOOP
// ============================================

function animate() {
    const particleCtx = DOM.particleCanvas.getContext('2d');
    const celestialCtx = DOM.celestialCanvas.getContext('2d');
    
    updateParticles();
    drawParticles(particleCtx);
    drawConstellations(celestialCtx);
    
    requestAnimationFrame(animate);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Advance button
    DOM.advanceBtn.addEventListener('click', advanceStage);
    
    // Reset button
    DOM.resetBtn.addEventListener('click', resetLaboratory);
    
    // Element buttons
    DOM.elementDraggables.forEach(el => {
        el.addEventListener('click', () => addElement(el.dataset.element));
    });
    
    // Mortar & Pestle
    DOM.mortarPestle.addEventListener('click', grindMortar);
    
    // Planets (tooltips)
    DOM.planets.forEach(planet => {
        planet.addEventListener('mouseenter', showPlanetTooltip);
        planet.addEventListener('mouseleave', hideTooltip);
    });
    
    // Stage markers
    DOM.stageMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const stageIndex = getStageIndex(marker.dataset.stage);
            if (stageIndex <= state.currentStage + 1) {
                // Can only go to completed or next stage
            }
        });
    });
    
    // Manuscript scroll
    DOM.manuscriptPage.addEventListener('scroll', handleManuscriptScroll);
    
    // Global tooltips
    setupTooltips();
}

// ============================================
// STAGE MANAGEMENT
// ============================================

function getStageIndex(stageName) {
    return CONFIG.stages.findIndex(s => s.name === stageName);
}

function advanceStage() {
    if (state.isAnimating) return;
    
    const nextStage = state.currentStage + 1;
    
    if (nextStage >= CONFIG.stages.length) {
        completeGreatWork();
        return;
    }
    
    const stage = CONFIG.stages[nextStage];
    
    // Check if required elements are added (only for stages beyond initium)
    if (nextStage > 0) {
        const requiredElements = stage.elementsRequired;
        const hasElements = requiredElements.every(el => state.addedElements.includes(el));
        
        if (!hasElements) {
            showNotification(`Add ${requiredElements.join(' and ')} to the crucible first`);
            shakeElement(DOM.elementTray);
            return;
        }
        
        // Check grind count for first advancement
        if (nextStage === 1 && state.grindCount < state.requiredGrinds) {
            showNotification(`Grind the materia ${state.requiredGrinds - state.grindCount} more times`);
            shakeElement(DOM.mortarPestle);
            return;
        }
    }
    
    state.isAnimating = true;
    state.currentStage = nextStage;
    
    // Update body class
    document.body.className = `stage-${stage.name}`;
    
    // Animate stage transition
    animateStageTransition(stage, () => {
        state.isAnimating = false;
        
        // Reveal manuscript section
        revealManuscriptSection(nextStage);
        
        // Reset elements for next stage
        if (nextStage < CONFIG.stages.length - 1) {
            resetElementsForNextStage();
        }
        
        // Check for completion
        if (nextStage === CONFIG.stages.length - 1) {
            setTimeout(completeGreatWork, 2000);
        }
    });
}

function animateStageTransition(stage, callback) {
    // Update glow
    DOM.circleGlow.className = `circle-glow ${stage.name}`;
    
    // Update transmutation circle speed
    DOM.transmutationCircle.classList.add('active');
    const outerRing = DOM.transmutationCircle.querySelector('.outer-ring');
    const planetaryRing = DOM.transmutationCircle.querySelector('.planetary-ring');
    outerRing.style.animationDuration = `${stage.rotationSpeed}s`;
    planetaryRing.style.animationDuration = `${stage.rotationSpeed * 0.75}s`;
    
    // Flash effect
    createFlashEffect();
    
    // Update labels
    DOM.stageName.textContent = stage.title;
    DOM.stageDescription.textContent = stage.subtitle;
    DOM.formulaText.textContent = stage.formula;
    
    // Update stage markers
    updateStageMarkers();
    
    // Update stage lines
    DOM.stageLines.forEach((line, i) => {
        if (i < state.currentStage) {
            line.classList.add('filled');
        }
    });
    
    // Show/hide eye and stone
    if (state.currentStage === CONFIG.stages.length - 1) {
        DOM.eyeOfProvidence.style.opacity = '0';
        DOM.stoneEmergence.classList.add('visible');
    }
    
    setTimeout(callback, 1500);
}

function updateStageMarkers() {
    DOM.stageMarkers.forEach((marker, i) => {
        marker.classList.remove('active', 'completed');
        
        if (i < state.currentStage) {
            marker.classList.add('completed');
        } else if (i === state.currentStage) {
            marker.classList.add('active');
        }
    });
}

function updateStageDisplay() {
    if (state.currentStage < 0) {
        DOM.stageName.textContent = 'Initium';
        DOM.stageDescription.textContent = 'Begin the Great Work';
        DOM.formulaText.textContent = 'Solve et Coagula — Separation et Coniunctio';
    } else {
        const stage = CONFIG.stages[state.currentStage];
        DOM.stageName.textContent = stage.title;
        DOM.stageDescription.textContent = stage.subtitle;
        DOM.formulaText.textContent = stage.formula;
    }
}

// ============================================
// ELEMENT SYSTEM
// ============================================

function addElement(elementType) {
    if (state.addedElements.includes(elementType)) return;
    
    const elementBtn = document.querySelector(`[data-element="${elementType}"]`);
    if (!elementBtn) return;
    
    // Mark as added
    state.addedElements.push(elementType);
    elementBtn.classList.add('added');
    
    // Animate element to crucible
    animateElementToCrucible(elementBtn, elementType);
    
    // Create visual effect in crucible
    createCrucibleEffect(elementType);
    
    // Update steam color based on elements
    updateSteamEffect();
    
    console.log(`Added element: ${elementType}`);
}

function animateElementToCrucible(elementBtn, elementType) {
    const btnRect = elementBtn.getBoundingClientRect();
    const crucibleRect = DOM.crucibleContainer.getBoundingClientRect();
    
    // Create flying element
    const flyingEl = document.createElement('div');
    flyingEl.className = 'flying-element';
    flyingEl.innerHTML = elementBtn.querySelector('.element-symbol').textContent;
    flyingEl.style.cssText = `
        position: fixed;
        left: ${btnRect.left + btnRect.width / 2}px;
        top: ${btnRect.top + btnRect.height / 2}px;
        font-size: 2rem;
        color: ${getElementColor(elementType)};
        z-index: 100;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    document.body.appendChild(flyingEl);
    
    // Animate to crucible
    requestAnimationFrame(() => {
        flyingEl.style.left = `${crucibleRect.left + crucibleRect.width / 2}px`;
        flyingEl.style.top = `${crucibleRect.top + 50}px`;
        flyingEl.style.opacity = '0';
        flyingEl.style.transform = 'scale(0.3)';
    });
    
    setTimeout(() => flyingEl.remove(), 800);
}

function createCrucibleEffect(elementType) {
    const color = getElementColor(elementType);
    
    // Create splash particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'crucible-splash';
        particle.style.cssText = `
            position: absolute;
            width: ${4 + Math.random() * 6}px;
            height: ${4 + Math.random() * 6}px;
            background: ${color};
            border-radius: 50%;
            left: ${40 + Math.random() * 40}%;
            top: 20%;
            pointer-events: none;
            animation: splash 0.6s ease-out forwards;
            --tx: ${(Math.random() - 0.5) * 60}px;
            --ty: ${-20 - Math.random() * 40}px;
        `;
        DOM.crucibleContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
    
    // Add splash animation if not exists
    if (!document.querySelector('#splash-style')) {
        const style = document.createElement('style');
        style.id = 'splash-style';
        style.textContent = `
            @keyframes splash {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function getElementColor(elementType) {
    const colors = {
        fire: '#ff4500',
        water: '#1e90ff',
        earth: '#8b4513',
        air: '#e6e6fa'
    };
    return colors[elementType] || '#c9a227';
}

function updateSteamEffect() {
    const steamWisps = DOM.steamContainer.querySelectorAll('.steam-wisp');
    let color = 'rgba(244, 232, 193, 0.3)';
    
    if (state.addedElements.includes('fire')) {
        color = 'rgba(255, 69, 0, 0.3)';
    }
    if (state.addedElements.includes('water')) {
        color = 'rgba(30, 144, 255, 0.3)';
    }
    if (state.addedElements.includes('earth') && state.addedElements.includes('water')) {
        color = 'rgba(139, 69, 19, 0.4)';
    }
    
    steamWisps.forEach(wisp => {
        wisp.style.background = `radial-gradient(ellipse, ${color} 0%, transparent 70%)`;
    });
}

function resetElementsForNextStage() {
    state.addedElements = [];
    state.grindCount = 0;
    
    DOM.elementDraggables.forEach(el => {
        el.classList.remove('added');
    });
}

// ============================================
// MORTAR & PESTLE
// ============================================

function grindMortar() {
    // Animate pestle
    DOM.pestle.classList.remove('grinding');
    void DOM.pestle.offsetWidth; // Trigger reflow
    DOM.pestle.classList.add('grinding');
    
    // Create grind particles
    createGrindParticles();
    
    // Increment grind count
    state.grindCount++;
    
    // Update visual feedback
    if (state.grindCount >= state.requiredGrinds) {
        DOM.mortarPestle.querySelector('.mortar-hint').textContent = 'Materia prepared ✓';
        DOM.mortarPestle.querySelector('.mortar-hint').style.color = '#c9a227';
    }
    
    console.log(`Grind count: ${state.grindCount}`);
}

function createGrindParticles() {
    const colors = ['#c9a227', '#b87333', '#8b7355', '#5c4a3d'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'grind-particle';
        particle.style.cssText = `
            left: ${30 + Math.random() * 40}%;
            top: ${30 + Math.random() * 40}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            width: ${2 + Math.random() * 3}px;
            height: ${2 + Math.random() * 3}px;
        `;
        DOM.grindParticles.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// ============================================
// MANUSCRIPT SYSTEM
// ============================================

function revealManuscriptSection(index) {
    if (index >= DOM.manuscriptSections.length) return;
    
    const section = DOM.manuscriptSections[index];
    section.classList.add('revealed');
    state.manuscriptRevealed = index + 1;
    
    // Show wax seal on final revelation
    if (index === DOM.manuscriptSections.length - 1) {
        setTimeout(() => {
            DOM.waxSeal.classList.add('visible');
        }, 1000);
    }
}

function handleManuscriptScroll() {
    const scrollTop = DOM.manuscriptPage.scrollTop;
    const scrollHeight = DOM.manuscriptPage.scrollHeight;
    const clientHeight = DOM.manuscriptPage.clientHeight;
    
    // Reveal sections based on scroll position
    const scrollPercent = scrollTop / (scrollHeight - clientHeight);
    const sectionsToReveal = Math.floor(scrollPercent * DOM.manuscriptSections.length) + 1;
    
    for (let i = state.manuscriptRevealed; i < sectionsToReveal && i < DOM.manuscriptSections.length; i++) {
        revealManuscriptSection(i);
    }
}

// ============================================
// TOOLTIP SYSTEM
// ============================================

function setupTooltips() {
    // Tooltips for various elements
    const tooltipElements = [
        { selector: '.element-draggable', getContent: (el) => {
            const element = el.dataset.element;
            const descriptions = {
                fire: { title: 'Ignis — Fire', text: 'The transformative force, agent of calcination and spiritual elevation.' },
                water: { title: 'Aqua — Water', text: 'The universal solvent, dissolver of all forms, carrier of the anima.' },
                earth: { title: 'Terra — Earth', text: 'The prima materia, the body, the vessel of all possibilities.' },
                air: { title: 'Aer — Air', text: 'The spirit, the volatile principle, the breath of life.' }
            };
            return descriptions[element];
        }},
        { selector: '#advanceBtn', getContent: () => ({
            title: 'Transmutare',
            text: 'Advance the Great Work to the next stage of transformation.'
        })},
        { selector: '#resetBtn', getContent: () => ({
            title: 'Renovare',
            text: 'Begin the opus anew. All progress returns to prima materia.'
        })}
    ];
    
    tooltipElements.forEach(({ selector, getContent }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const content = getContent(el);
                if (content) showTooltip(e, content);
            });
            el.addEventListener('mouseleave', hideTooltip);
        });
    });
}

function showTooltip(e, content) {
    DOM.tooltipContent.innerHTML = `
        <div class="tooltip-title">${content.title}</div>
        <div>${content.text}</div>
    `;
    
    positionTooltip(e);
    DOM.tooltip.classList.add('visible');
}

function showPlanetTooltip(e) {
    const planet = e.target;
    const title = planet.getAttribute('title');
    const planetName = planet.dataset.planet;
    
    const descriptions = {
        sun: 'Sol — Source of gold, the perfected consciousness',
        moon: 'Luna — Silver, the receptive principle, governs transformation',
        mercury: 'Mercurius — The messenger, the volatile spirit linking all',
        venus: 'Venus — Copper, governs love and conjunction',
        mars: 'Mars — Iron, the aggressive force of separation',
        jupiter: 'Iupiter — Tin, the expansive principle of growth',
        saturn: 'Saturnus — Lead, the prima materia, where all begins'
    };
    
    showTooltip(e, {
        title: title,
        text: descriptions[planetName] || 'A celestial influence upon the work.'
    });
}

function positionTooltip(e) {
    const x = e.clientX + 15;
    const y = e.clientY + 15;
    
    DOM.tooltip.style.left = `${x}px`;
    DOM.tooltip.style.top = `${y}px`;
}

function hideTooltip() {
    DOM.tooltip.classList.remove('visible');
}

// ============================================
// VISUAL EFFECTS
// ============================================

function createFlashEffect() {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at center, rgba(201, 162, 39, 0.3), transparent 70%);
        pointer-events: none;
        z-index: 999;
        animation: flash-fade 1s ease-out forwards;
    `;
    document.body.appendChild(flash);
    
    // Add animation if not exists
    if (!document.querySelector('#flash-style')) {
        const style = document.createElement('style');
        style.id = 'flash-style';
        style.textContent = `
            @keyframes flash-fade {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => flash.remove(), 1000);
}

function shakeElement(element) {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = 'shake 0.5s ease-in-out';
    
    if (!document.querySelector('#shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alchemical-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(26, 22, 18, 0.95);
        border: 1px solid var(--border-gold, rgba(201, 162, 39, 0.4));
        color: #c9a227;
        padding: 1rem 2rem;
        font-family: 'IM Fell English', serif;
        font-style: italic;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// COMPLETION
// ============================================

function completeGreatWork() {
    console.log('✨ The Great Work is complete! The Philosopher\'s Stone has been achieved.');
    
    // Create celebration effect
    createCelebration();
    
    // Update final display
    DOM.stageName.textContent = 'Opus Consummatum';
    DOM.stageDescription.textContent = 'The Philosopher\'s Stone is achieved';
    DOM.formulaText.textContent = 'Finis Coronat Opus — The end crowns the work';
    
    // Reveal final manuscript section
    revealManuscriptSection(DOM.manuscriptSections.length - 1);
    
    // Add completion class
    document.body.classList.add('work-complete');
    
    showNotification('✨ The Great Work is complete! The Philosopher\'s Stone has been achieved.');
}

function createCelebration() {
    // Multiple celebration bursts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const celebration = document.createElement('div');
            celebration.className = 'complete-celebration';
            celebration.style.left = `${30 + Math.random() * 40}%`;
            celebration.style.top = `${30 + Math.random() * 40}%`;
            document.body.appendChild(celebration);
            setTimeout(() => celebration.remove(), 1500);
        }, i * 300);
    }
    
    // Particle burst
    for (let i = 0; i < 30; i++) {
        state.particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: 2 + Math.random() * 3,
            speedX: (Math.random() - 0.5) * 5,
            speedY: (Math.random() - 0.5) * 5,
            color: Math.random() > 0.5 ? '#ffd700' : '#ff4500',
            opacity: 1,
            life: 100
        });
    }
}

// ============================================
// RESET
// ============================================

function resetLaboratory() {
    if (state.isAnimating) return;
    
    state.isAnimating = true;
    
    // Reset state
    state.currentStage = -1;
    state.addedElements = [];
    state.grindCount = 0;
    state.manuscriptRevealed = 0;
    
    // Reset body class
    document.body.className = '';
    
    // Reset UI elements
    DOM.elementDraggables.forEach(el => el.classList.remove('added'));
    DOM.stageMarkers.forEach(marker => marker.classList.remove('active', 'completed'));
    DOM.stageLines.forEach(line => line.classList.remove('filled'));
    DOM.manuscriptSections.forEach(section => section.classList.remove('revealed'));
    DOM.waxSeal.classList.remove('visible');
    DOM.eyeOfProvidence.style.opacity = '1';
    DOM.stoneEmergence.classList.remove('visible');
    DOM.circleGlow.className = 'circle-glow';
    DOM.transmutationCircle.classList.remove('active');
    
    // Reset mortar hint
    DOM.mortarPestle.querySelector('.mortar-hint').textContent = 'Click to grind';
    DOM.mortarPestle.querySelector('.mortar-hint').style.color = '';
    
    // Reset display
    updateStageDisplay();
    
    // Reveal first manuscript section
    setTimeout(() => {
        revealManuscriptSection(0);
        state.isAnimating = false;
    }, 500);
    
    showNotification('The opus begins anew. Return to prima materia.');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// ============================================
// START THE LABORATORY
// ============================================

document.addEventListener('DOMContentLoaded', init);

// Handle visibility change (pause/resume animations)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Could pause intensive animations here
    } else {
        // Resume
    }
});
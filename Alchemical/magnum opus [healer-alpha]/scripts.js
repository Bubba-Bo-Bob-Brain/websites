/* ============================================================
   OPUS MAGNUM — ALCHEMICAL WORKBENCH ENGINE
   The Great Work of Interactive Transformation
   ============================================================ */

// === STATE MANAGEMENT ===
const AlchemicalState = {
    currentStage: 'nigredo',
    stageIndex: 0,
    rotation: 0,
    ingredients: [],
    grindProgress: 0,
    heatLevel: 0,
    isDistilling: false,
    isGrinding: false,
    isAthanorIgnited: false,
    transmutationCount: 0,
    stageProgress: {
        nigredo: 0,
        albedo: 0,
        citrinitas: 0,
        rubedo: 0
    }
};

// === ZODIAC & ALCHEMICAL SYMBOLS ===
const AlchemicalSymbols = {
    zodiac: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
    runes: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'],
    elements: {
        aurum: { symbol: 'Au', color: '#d4a84b', latin: 'Aurum', meaning: 'Gold — The Perfect Metal' },
        argentum: { symbol: 'Ag', color: '#c0c0c0', latin: 'Argentum', meaning: 'Silver — The Lunar Metal' },
        cuprum: { symbol: 'Cu', color: '#b87333', latin: 'Cuprum', meaning: 'Copper — The Metal of Venus' },
        ferrum: { symbol: 'Fe', color: '#4a4a4a', latin: 'Ferrum', meaning: 'Iron — The Martial Metal' },
        plumbum: { symbol: 'Pb', color: '#3d3d3d', latin: 'Plumbum', meaning: 'Lead — The Saturnine Metal' },
        mercurius: { symbol: 'Hg', color: '#a8a8a8', latin: 'Mercurius', meaning: 'Quicksilver — The Liquid Metal' },
        sulfur: { symbol: 'S', color: '#ffd700', latin: 'Sulphur', meaning: 'Sulfur — The Soul of Metals' },
        sal: { symbol: 'Ⓢ', color: '#f0f0f0', latin: 'Sal', meaning: 'Salt — The Body of Matter' }
    },
    stages: {
        nigredo: { symbol: '☉', color: '#1a1814', coreSymbol: '☿' },
        albedo: { symbol: '☽', color: '#e8e4dc', coreSymbol: '♀' },
        citrinitas: { symbol: '☆', color: '#d4a84b', coreSymbol: '♂' },
        rubedo: { symbol: '♁', color: '#a01020', coreSymbol: '☉' }
    },
    planets: {
        saturn: { symbol: '♄', element: 'lead', metal: 'Plumbum' },
        jupiter: { symbol: '♃', element: 'tin', metal: 'Stannum' },
        mars: { symbol: '♂', element: 'iron', metal: 'Ferrum' },
        venus: { symbol: '♀', element: 'copper', metal: 'Cuprum' },
        mercury: { symbol: '☿', element: 'quicksilver', metal: 'Hydrargyrum' },
        sun: { symbol: '☉', element: 'gold', metal: 'Aurum' },
        moon: { symbol: '☽', element: 'silver', metal: 'Argentum' }
    }
};

// === DOM ELEMENTS ===
const DOM = {
    // Stage navigation
    stageButtons: document.querySelectorAll('.stage-btn'),
    stageProgress: document.getElementById('stage-progress'),
    rotationStatus: document.getElementById('rotation-status'),
    
    // Transmutation circle
    transmutationCircle: document.getElementById('transmutation-circle'),
    transmutationSvg: document.getElementById('transmutation-svg'),
    zodiacRing: document.getElementById('zodiac-ring'),
    runeRing: document.getElementById('rune-ring'),
    geometryLines: document.getElementById('geometry-lines'),
    coreSymbol: document.getElementById('core-symbol'),
    coreGlow: document.getElementById('core-glow'),
    rotateCCW: document.getElementById('rotate-ccw'),
    rotateCW: document.getElementById('rotate-cw'),
    
    // Crucible
    ingredients: document.querySelectorAll('.ingredient'),
    crucibleLiquid: document.getElementById('crucible-liquid'),
    bubblesContainer: document.getElementById('bubbles-container'),
    floatingSymbols: document.getElementById('floating-symbols'),
    resultFormula: document.getElementById('result-formula'),
    transmuteBtn: document.getElementById('transmute-btn'),
    clearBtn: document.getElementById('clear-btn'),
    
    // Manuscript
    revealedTexts: document.querySelectorAll('.revealed-text'),
    marginalNotes: document.querySelectorAll('.marginal-note'),
    marginalSymbols: document.querySelectorAll('.marginal-symbol'),
    marginalDrawings: document.querySelectorAll('.marginal-drawing'),
    stoneReveal: document.getElementById('stone-reveal'),
    stoneBody: document.getElementById('stone-body'),
    
    // Celestial
    constellationCanvas: document.getElementById('constellation-canvas'),
    zodiacWheel: document.getElementById('zodiac-wheel'),
    celestialInfo: document.getElementById('celestial-info'),
    
    // Tools
    mortarPestle: document.getElementById('mortar-pestle'),
    mortarContainer: document.getElementById('mortar-container'),
    pestle: document.getElementById('pestle'),
    grindBar: document.getElementById('grind-bar'),
    grindStatus: document.getElementById('grind-status'),
    athanor: document.getElementById('athanor'),
    athanorFire: document.getElementById('athanor-fire'),
    heatBar: document.getElementById('heat-bar'),
    heatValue: document.getElementById('heat-value'),
    distillBtn: document.getElementById('distill-btn'),
    alembicLiquid: document.getElementById('alembic-liquid'),
    condenserDrip: document.getElementById('condenser-drip'),
    receiverLiquid: document.getElementById('receiver-liquid'),
    
    // Ambient
    ambientCanvas: document.getElementById('ambient-canvas'),
    
    // Tooltips & notifications
    infoTooltip: document.getElementById('info-tooltip'),
    tooltipContent: document.getElementById('tooltip-content'),
    notificationArea: document.getElementById('notification-area')
};

// === INITIALIZATION ===
function initAlchemicalWorkbench() {
    initTransmutationCircle();
    initZodiacWheel();
    initConstellationCanvas();
    initAmbientParticles();
    initScrollObserver();
    initEventListeners();
    updateStageVisuals();
    startAmbientAnimations();
    
    // Initial notification
    showNotification('Welcome to the Great Work. The transformation begins...', 4000);
}

// === TRANSMUTATION CIRCLE SETUP ===
function initTransmutationCircle() {
    // Populate zodiac ring
    AlchemicalSymbols.zodiac.forEach((symbol, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const radius = 245;
        const x = 300 + radius * Math.cos(angle - Math.PI/2);
        const y = 300 + radius * Math.sin(angle - Math.PI/2);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('class', 'zodiac-symbol');
        text.textContent = symbol;
        DOM.zodiacRing.appendChild(text);
    });
    
    // Populate rune ring
    AlchemicalSymbols.runes.forEach((rune, i) => {
        const angle = (i * 15) * (Math.PI / 180);
        const radius = 260;
        const x = 300 + radius * Math.cos(angle - Math.PI/2);
        const y = 300 + radius * Math.sin(angle - Math.PI/2);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('class', 'rune-symbol');
        text.textContent = rune;
        DOM.runeRing.appendChild(text);
    });
    
    // Create geometry lines
    createGeometryLines();
}

function createGeometryLines() {
    const lines = [
        // Cardinal connections
        { x1: 300, y1: 120, x2: 300, y2: 480 },
        { x1: 120, y1: 300, x2: 480, y2: 300 },
        // Diagonal connections
        { x1: 170, y1: 170, x2: 430, y2: 430 },
        { x1: 430, y1: 170, x2: 170, y2: 430 },
        // Inner connections
        { x1: 240, y1: 240, x2: 360, y2: 360 },
        { x1: 360, y1: 240, x2: 240, y2: 360 }
    ];
    
    lines.forEach(line => {
        const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineEl.setAttribute('x1', line.x1);
        lineEl.setAttribute('y1', line.y1);
        lineEl.setAttribute('x2', line.x2);
        lineEl.setAttribute('y2', line.y2);
        DOM.geometryLines.appendChild(lineEl);
    });
}

// === ZODIAC WHEEL SETUP ===
function initZodiacWheel() {
    const zodiacWheel = DOM.zodiacWheel;
    
    // Clear existing houses
    zodiacWheel.querySelectorAll('.zodiac-house').forEach(el => el.remove());
    
    // Create 12 zodiac houses
    for (let i = 0; i < 12; i++) {
        const house = document.createElement('div');
        house.className = 'zodiac-house';
        house.style.transform = `rotate(${i * 30}deg)`;
        house.setAttribute('data-symbol', AlchemicalSymbols.zodiac[i]);
        house.setAttribute('data-index', i);
        
        house.addEventListener('click', () => {
            const zodiacInfo = getZodiacInfo(i);
            showTooltip(house, zodiacInfo);
        });
        
        zodiacWheel.appendChild(house);
    }
}

function getZodiacInfo(index) {
    const zodiacInfo = [
        { name: 'Aries', element: 'Fire', planet: 'Mars', alchemical: 'The Ram — Beginning of Work' },
        { name: 'Taurus', element: 'Earth', planet: 'Venus', alchemical: 'The Bull — Material Foundation' },
        { name: 'Gemini', element: 'Air', planet: 'Mercury', alchemical: 'The Twins — Division & Analysis' },
        { name: 'Cancer', element: 'Water', planet: 'Moon', alchemical: 'The Crab — Receptacle of Dew' },
        { name: 'Leo', element: 'Fire', planet: 'Sun', alchemical: 'The Lion — The Gold within Lead' },
        { name: 'Virgo', element: 'Earth', planet: 'Mercury', alchemical: 'The Virgin — Purity of Matter' },
        { name: 'Libra', element: 'Air', planet: 'Venus', alchemical: 'The Scales — Balance of Opposites' },
        { name: 'Scorpio', element: 'Water', planet: 'Mars', alchemical: 'The Scorpion — Death & Transformation' },
        { name: 'Sagittarius', element: 'Fire', planet: 'Jupiter', alchemical: 'The Archer — Ascent of Spirit' },
        { name: 'Capricorn', element: 'Earth', planet: 'Saturn', alchemical: 'The Goat — Foundation of Work' },
        { name: 'Aquarius', element: 'Air', planet: 'Saturn', alchemical: 'The Water Bearer — Distillation' },
        { name: 'Pisces', element: 'Water', planet: 'Jupiter', alchemical: 'The Fish — Completion of Work' }
    ];
    
    return `<strong>${zodiacInfo[index].name}</strong><br>
            Element: ${zodiacInfo[index].element}<br>
            Planet: ${zodiacInfo[index].planet}<br>
            <em>${zodiacInfo[index].alchemical}</em>`;
}

// === CONSTELLATION CANVAS ===
function initConstellationCanvas() {
    const canvas = DOM.constellationCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawConstellations();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Draw constellations
    function drawConstellations() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(212, 168, 75, 0.3)';
        ctx.lineWidth = 1;
        
        // Draw simple constellation patterns
        const constellations = [
            // Ursa Major (Big Dipper)
            { stars: [[0.2, 0.3], [0.25, 0.35], [0.3, 0.32], [0.35, 0.38], [0.4, 0.35], [0.45, 0.4], [0.5, 0.38]], name: 'Ursa Major' },
            // Orion
            { stars: [[0.6, 0.2], [0.65, 0.25], [0.7, 0.2], [0.65, 0.3], [0.6, 0.35], [0.65, 0.4], [0.7, 0.35]], name: 'Orion' },
            // Cassiopeia
            { stars: [[0.8, 0.6], [0.85, 0.55], [0.9, 0.6], [0.95, 0.55], [0.85, 0.5]], name: 'Cassiopeia' }
        ];
        
        constellations.forEach(constellation => {
            // Draw constellation lines
            ctx.beginPath();
            constellation.stars.forEach((star, i) => {
                const x = star[0] * canvas.width;
                const y = star[1] * canvas.height;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Draw star
                ctx.fillStyle = 'rgba(212, 168, 75, 0.8)';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.stroke();
            
            // Add constellation label
            ctx.fillStyle = 'rgba(93, 64, 55, 0.7)';
            ctx.font = '12px "IM Fell English", serif';
            const centerX = constellation.stars.reduce((sum, star) => sum + star[0], 0) / constellation.stars.length * canvas.width;
            const centerY = constellation.stars.reduce((sum, star) => sum + star[1], 0) / constellation.stars.length * canvas.height;
            ctx.fillText(constellation.name, centerX, centerY + 20);
        });
        
        // Draw alchemical connections
        ctx.strokeStyle = 'rgba(184, 102, 34, 0.2)';
        ctx.setLineDash([5, 5]);
        
        // Connect planets to constellations
        const connections = [
            { from: [0.3, 0.35], to: [0.65, 0.3] }, // Mars to Orion
            { from: [0.7, 0.2], to: [0.85, 0.55] },  // Sun to Cassiopeia
            { from: [0.2, 0.3], to: [0.35, 0.38] }   // Saturn to Ursa Major
        ];
        
        connections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(conn.from[0] * canvas.width, conn.from[1] * canvas.height);
            ctx.lineTo(conn.to[0] * canvas.width, conn.to[1] * canvas.height);
            ctx.stroke();
        });
        
        ctx.setLineDash([]);
    }
}

// === AMBIENT PARTICLES ===
function initAmbientParticles() {
    const canvas = DOM.ambientCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle system
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.7 ? '#d4a84b' : '#8b6914'
        });
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Subtle pulse
            particle.opacity = 0.1 + Math.sin(Date.now() * 0.001 + particle.x) * 0.2;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// === SCROLL OBSERVER ===
function initScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Reveal text
                if (element.classList.contains('revealed-text')) {
                    element.classList.add('visible');
                }
                
                // Reveal marginalia
                if (element.classList.contains('marginal-note') || 
                    element.classList.contains('marginal-symbol') || 
                    element.classList.contains('marginal-drawing')) {
                    element.classList.add('visible');
                }
                
                // Update stage based on scroll position
                updateStageBasedOnScroll(element);
            }
        });
    }, observerOptions);
    
    // Observe elements
    DOM.revealedTexts.forEach(el => observer.observe(el));
    DOM.marginalNotes.forEach(el => observer.observe(el));
    DOM.marginalSymbols.forEach(el => observer.observe(el));
    DOM.marginalDrawings.forEach(el => observer.observe(el));
}

function updateStageBasedOnScroll(element) {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Calculate progress through the page
    const progress = scrollY / (documentHeight - windowHeight);
    
    // Update stage based on progress
    if (progress < 0.25) {
        changeStage('nigredo');
    } else if (progress < 0.5) {
        changeStage('albedo');
    } else if (progress < 0.75) {
        changeStage('citrinitas');
    } else {
        changeStage('rubedo');
    }
}

// === EVENT LISTENERS ===
function initEventListeners() {
    // Stage buttons
    DOM.stageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stage = btn.getAttribute('data-stage');
            changeStage(stage);
        });
    });
    
    // Rotation controls
    DOM.rotateCCW.addEventListener('click', () => rotateCircle(-90));
    DOM.rotateCW.addEventListener('click', () => rotateCircle(90));
    
    // Ingredients
    DOM.ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', () => toggleIngredient(ingredient));
    });
    
    // Transmute button
    DOM.transmuteBtn.addEventListener('click', transmuteIngredients);
    
    // Clear button
    DOM.clearBtn.addEventListener('click', clearCrucible);
    
    // Planetary symbols
    document.querySelectorAll('.planet-symbol').forEach(planet => {
        planet.addEventListener('mouseenter', (e) => {
            const element = planet.getAttribute('data-element');
            const planetInfo = getPlanetInfo(element);
            showTooltip(planet, planetInfo);
        });
        
        planet.addEventListener('mouseleave', hideTooltip);
    });
    
    // Mortar and pestle
    DOM.pestle.addEventListener('mousedown', startGrinding);
    DOM.pestle.addEventListener('mouseup', stopGrinding);
    DOM.pestle.addEventListener('mouseleave', stopGrinding);
    DOM.pestle.addEventListener('touchstart', startGrinding);
    DOM.pestle.addEventListener('touchend', stopGrinding);
    
    // Athanor
    DOM.athanor.addEventListener('click', kindleAthanor);
    
    // Distillation
    DOM.distillBtn.addEventListener('click', startDistillation);
    
    // Stone reveal on scroll
    window.addEventListener('scroll', () => {
        const stoneContainer = document.getElementById('philosophers-stone-container');
        const rect = stoneContainer.getBoundingClientRect();
        
        if (rect.top < window.innerHeight * 0.7 && !DOM.stoneReveal.classList.contains('revealed')) {
            revealPhilosophersStone();
        }
    });
}

// === STAGE MANAGEMENT ===
function changeStage(newStage) {
    if (AlchemicalState.currentStage === newStage) return;
    
    AlchemicalState.currentStage = newStage;
    AlchemicalState.stageIndex = ['nigredo', 'albedo', 'citrinitas', 'rubedo'].indexOf(newStage);
    
    updateStageVisuals();
    updateStageProgress();
    
    // Update core symbol
    const stageData = AlchemicalSymbols.stages[newStage];
    DOM.coreSymbol.textContent = stageData.coreSymbol;
    
    // Update crucible liquid color based on stage
    updateCrucibleColor();
    
    // Show stage change notification
    const stageNames = {
        nigredo: 'Nigredo — The Blackening',
        albedo: 'Albedo — The Whitening', 
        citrinitas: 'Citrinitas — The Yellowing',
        rubedo: 'Rubedo — The Reddening'
    };
    
    showNotification(`Stage: ${stageNames[newStage]}`, 3000);
}

function updateStageVisuals() {
    // Update stage buttons
    DOM.stageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-stage') === AlchemicalState.currentStage) {
            btn.classList.add('active');
        }
    });
    
    // Update rotation status
    const stageNumerals = ['I', 'II', 'III', 'IV'];
    DOM.rotationStatus.textContent = `${stageNumerals[AlchemicalState.stageIndex]} — ${AlchemicalState.currentStage.charAt(0).toUpperCase() + AlchemicalState.currentStage.slice(1)}`;
    
    // Update body class for stage-specific CSS
    document.body.className = `stage-${AlchemicalState.currentStage}`;
    
    // Update core glow color
    const stageColor = AlchemicalSymbols.stages[AlchemicalState.currentStage].color;
    DOM.coreGlow.style.fill = stageColor;
}

function updateStageProgress() {
    const progressWidth = (AlchemicalState.stageIndex + 1) * 25;
    DOM.stageProgress.style.width = `${progressWidth}%`;
}

// === TRANSMUTATION CIRCLE ===
function rotateCircle(degrees) {
    AlchemicalState.rotation += degrees;
    
    // Apply rotation to the entire circle
    DOM.transmutationCircle.style.transform = `rotate(${AlchemicalState.rotation}deg)`;
    
    // Counter-rotate the planetary symbols to keep them upright
    const planetarySymbols = document.getElementById('planetary-symbols');
    planetarySymbols.style.transform = `rotate(${-AlchemicalState.rotation}deg)`;
    
    // Check if rotation triggers stage change (every 180 degrees)
    const normalizedRotation = ((AlchemicalState.rotation % 360) + 360) % 360;
    if (normalizedRotation % 180 === 0) {
        const stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
        const nextStage = stages[(AlchemicalState.stageIndex + 1) % 4];
        changeStage(nextStage);
    }
}

// === CRUCIBLE MECHANICS ===
function toggleIngredient(ingredientElement) {
    const element = ingredientElement.getAttribute('data-element');
    
    if (ingredientElement.classList.contains('selected')) {
        // Remove ingredient
        ingredientElement.classList.remove('selected');
        AlchemicalState.ingredients = AlchemicalState.ingredients.filter(i => i !== element);
    } else {
        // Add ingredient (max 4)
        if (AlchemicalState.ingredients.length < 4) {
            ingredientElement.classList.add('selected');
            AlchemicalState.ingredients.push(element);
            
            // Add floating symbol to crucible
            addFloatingSymbol(element);
        } else {
            showNotification('The vessel can hold only four ingredients at once', 2000);
        }
    }
    
    updateFormulaDisplay();
    updateTransmuteButton();
}

function addFloatingSymbol(element) {
    const symbolData = AlchemicalSymbols.elements[element];
    const symbol = document.createElement('div');
    symbol.className = 'floating-symbol';
    symbol.textContent = symbolData.symbol;
    symbol.style.left = `${Math.random() * 80 + 10}%`;
    symbol.style.top = `${Math.random() * 80 + 10}%`;
    symbol.style.animationDelay = `${Math.random() * 2}s`;
    symbol.style.color = symbolData.color;
    
    DOM.floatingSymbols.appendChild(symbol);
    
    // Add bubble
    addBubble();
}

function addBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = `${Math.random() * 80 + 10}%`;
    bubble.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
    bubble.style.animationDelay = `${Math.random() * 0.5}s`;
    
    DOM.bubblesContainer.appendChild(bubble);
    
    // Remove bubble after animation
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, 3000);
}

function updateFormulaDisplay() {
    if (AlchemicalState.ingredients.length === 0) {
        DOM.resultFormula.innerHTML = '<span class="formula-text">Add ingredients to begin...</span>';
        return;
    }
    
    const symbols = AlchemicalState.ingredients.map(element => 
        `<span style="color: ${AlchemicalSymbols.elements[element].color}">${AlchemicalSymbols.elements[element].symbol}</span>`
    );
    
    DOM.resultFormula.innerHTML = `<span class="formula-text">${symbols.join(' + ')}</span>`;
}

function updateTransmuteButton() {
    DOM.transmuteBtn.disabled = AlchemicalState.ingredients.length < 2;
}

function transmuteIngredients() {
    if (AlchemicalState.ingredients.length < 2) return;
    
    // Start bubbling animation
    const bubblingInterval = setInterval(() => {
        addBubble();
        addBubble();
    }, 200);
    
    // Simulate transmutation process
    setTimeout(() => {
        clearInterval(bubblingInterval);
        
        // Determine result based on ingredients
        const result = determineTransmutationResult();
        
        // Show result
        showNotification(result.message, 4000);
        
        // Update crucible color
        updateCrucibleColor(result.color);
        
        // Add result symbol to floating symbols
        const resultSymbol = document.createElement('div');
        resultSymbol.className = 'floating-symbol';
        resultSymbol.textContent = result.symbol;
        resultSymbol.style.left = '50%';
        resultSymbol.style.top = '50%';
        resultSymbol.style.transform = 'translate(-50%, -50%)';
        resultSymbol.style.fontSize = '24px';
        resultSymbol.style.color = result.color;
        DOM.floatingSymbols.appendChild(resultSymbol);
        
        // Clear ingredients after transmutation
        setTimeout(() => {
            clearCrucible();
            AlchemicalState.transmutationCount++;
            
            // Check for stage advancement
            if (AlchemicalState.transmutationCount % 3 === 0) {
                const stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
                const nextStage = stages[(AlchemicalState.stageIndex + 1) % 4];
                changeStage(nextStage);
            }
        }, 2000);
        
    }, 3000);
}

function determineTransmutationResult() {
    const ingredients = AlchemicalState.ingredients;
    
    // Define transmutation rules
    const rules = [
        {
            ingredients: ['plumbum', 'mercurius'],
            result: { symbol: '☽', color: '#c0c0c0', message: 'Lead and Mercury yield Silver (Argentum) — The Lunar Work' }
        },
        {
            ingredients: ['cuprum', 'sulfur'],
            result: { symbol: '♀', color: '#b87333', message: 'Copper and Sulfur yield Venus\'s Metal — The Feminine Principle' }
        },
        {
            ingredients: ['ferrum', 'sulfur'],
            result: { symbol: '♂', color: '#4a4a4a', message: 'Iron and Sulfur yield Mars\'s Metal — The Martial Work' }
        },
        {
            ingredients: ['aurum', 'mercurius'],
            result: { symbol: '☿', color: '#d4a84b', message: 'Gold and Mercury yield the Philosopher\'s Stone — The Great Work' }
        },
        {
            ingredients: ['sal', 'sulfur'],
            result: { symbol: '🜍', color: '#ffd700', message: 'Salt and Sulfur yield the Body and Soul — The Fundamental Union' }
        }
    ];
    
    // Check for matching rules
    for (const rule of rules) {
        if (rule.ingredients.every(ing => ingredients.includes(ing))) {
            return rule.result;
        }
    }
    
    // Default result for other combinations
    return {
        symbol: '⚗',
        color: '#8b6914',
        message: 'The elements combine into a mysterious compound — Further work is needed'
    };
}

function clearCrucible() {
    // Clear ingredients
    AlchemicalState.ingredients = [];
    
    // Remove selected class from ingredients
    DOM.ingredients.forEach(ingredient => {
        ingredient.classList.remove('selected');
    });
    
    // Clear floating symbols
    DOM.floatingSymbols.innerHTML = '';
    
    // Clear bubbles
    DOM.bubblesContainer.innerHTML = '';
    
    // Reset crucible color
    updateCrucibleColor();
    
    // Update display
    updateFormulaDisplay();
    updateTransmuteButton();
    
    showNotification('The vessel has been purified', 2000);
}

function updateCrucibleColor(specificColor = null) {
    let color;
    
    if (specificColor) {
        color = specificColor;
    } else {
        // Set color based on current stage
        const stageColors = {
            nigredo: 'rgba(26, 24, 20, 0.9)',
            albedo: 'rgba(232, 228, 220, 0.9)',
            citrinitas: 'rgba(212, 168, 75, 0.9)',
            rubedo: 'rgba(160, 16, 32, 0.9)'
        };
        color = stageColors[AlchemicalState.currentStage];
    }
    
    DOM.crucibleLiquid.style.background = color;
}

// === TOOLS INTERACTION ===
function startGrinding(e) {
    e.preventDefault();
    AlchemicalState.isGrinding = true;
    DOM.mortarPestle.classList.add('grinding');
    DOM.pestle.classList.add('grinding');
    
    // Start grinding animation
    const grindInterval = setInterval(() => {
        if (!AlchemicalState.isGrinding) {
            clearInterval(grindInterval);
            return;
        }
        
        AlchemicalState.grindProgress = Math.min(100, AlchemicalState.grindProgress + 2);
        DOM.grindBar.style.width = `${AlchemicalState.grindProgress}%`;
        DOM.grindStatus.textContent = `${AlchemicalState.grindProgress}% Finely Ground`;
        
        // Add burst particles
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'grind-particle';
            particle.style.setProperty('--grind-x', `${(Math.random() - 0.5) * 30}px`);
            particle.style.setProperty('--grind-y', `${-Math.random() * 20 - 10}px`);
            DOM.mortarContainer.querySelector('.mortar-contents').appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 500);
        }
        
        // Check if fully ground
        if (AlchemicalState.grindProgress >= 100) {
            clearInterval(grindInterval);
            stopGrinding();
            showNotification('The materia prima has been perfectly ground', 3000);
        }
    }, 100);
}

function stopGrinding() {
    AlchemicalState.isGrinding = false;
    DOM.mortarPestle.classList.remove('grinding');
    DOM.pestle.classList.remove('grinding');
}

function kindleAthanor() {
    if (AlchemicalState.isAthanorIgnited) {
        // Increase heat
        AlchemicalState.heatLevel = Math.min(1000, AlchemicalState.heatLevel + 50);
    } else {
        // Ignite
        AlchemicalState.isAthanorIgnited = true;
        DOM.athanor.classList.add('ignited');
        AlchemicalState.heatLevel = 100;
        showNotification('The Athanor has been kindled', 2000);
    }
    
    // Update heat display
    DOM.heatBar.style.width = `${AlchemicalState.heatLevel / 10}%`;
    DOM.heatValue.textContent = `${AlchemicalState.heatLevel}°`;
    
    // Check for heat milestones
    if (AlchemicalState.heatLevel === 500) {
        showNotification('The heat reaches the point of calcination', 3000);
    } else if (AlchemicalState.heatLevel === 1000) {
        showNotification('Maximum heat achieved — The point of transformation', 3000);
    }
}

function startDistillation() {
    if (AlchemicalState.isDistilling) return;
    
    AlchemicalState.isDistilling = true;
    DOM.distillBtn.textContent = 'Distilling...';
    DOM.distillBtn.disabled = true;
    
    // Start distillation animation
    let progress = 0;
    const distillationInterval = setInterval(() => {
        progress += 1;
        
        // Update alembic liquid (decreasing)
        DOM.alembicLiquid.style.height = `${Math.max(10, 40 - progress / 2)}%`;
        
        // Update receiver liquid (increasing)
        DOM.receiverLiquid.style.height = `${Math.min(80, progress)}%`;
        
        // Drip animation
        if (progress % 10 === 0) {
            DOM.condenserDrip.classList.add('dripping');
            setTimeout(() => {
                DOM.condenserDrip.classList.remove('dripping');
            }, 1000);
        }
        
        // Complete distillation
        if (progress >= 100) {
            clearInterval(distillationInterval);
            AlchemicalState.isDistilling = false;
            DOM.distillBtn.textContent = 'Begin Distillation';
            DOM.distillBtn.disabled = false;
            
            showNotification('Distillation complete — The essence has been collected', 4000);
            
            // Reset after delay
            setTimeout(() => {
                DOM.alembicLiquid.style.height = '40%';
                DOM.receiverLiquid.style.height = '0%';
            }, 3000);
        }
    }, 100);
}

// === PHILOSOPHER'S STONE ===
function revealPhilosophersStone() {
    DOM.stoneReveal.classList.add('revealed');
    
    // Final stage achievement
    if (AlchemicalState.currentStage !== 'rubedo') {
        changeStage('rubedo');
    }
    
    // Show grand notification
    setTimeout(() => {
        showNotification('The Philosopher\'s Stone has been revealed! The Great Work is complete!', 5000);
    }, 1000);
    
    // Special ambient effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = 'gold';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${Math.random() * 100}vh`;
    sparkle.style.animation = 'sparkle 2s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

// === TOOLTIP SYSTEM ===
function showTooltip(element, content) {
    const rect = element.getBoundingClientRect();
    DOM.tooltipContent.innerHTML = content;
    DOM.infoTooltip.style.left = `${rect.left + rect.width / 2}px`;
    DOM.infoTooltip.style.top = `${rect.top - 10}px`;
    DOM.infoTooltip.style.transform = 'translate(-50%, -100%)';
    DOM.infoTooltip.classList.add('visible');
}

function hideTooltip() {
    DOM.infoTooltip.classList.remove('visible');
}

function getPlanetInfo(element) {
    const planetData = {
        lead: `<strong>Saturn (♄)</strong><br>Element: Lead (Plumbum)<br><em>The heaviest metal, base and corrupt. Yet within it lies the seed of gold.</em>`,
        tin: `<strong>Jupiter (♃)</strong><br>Element: Tin (Stannum)<br><em>The jovial metal, malleable and bright. It expands and grows.</em>`,
        iron: `<strong>Mars (♂)</strong><br>Element: Iron (Ferrum)<br><em>The martial metal, strong and enduring. It tempers and fortifies.</em>`,
        copper: `<strong>Venus (♀)</strong><br>Element: Copper (Cuprum)<br><em>The venereal metal, beautiful and conductive. It unites and attracts.</em>`,
        quicksilver: `<strong>Mercury (☿)</strong><br>Element: Quicksilver (Hydrargyrum)<br><em>The messenger metal, fluid and elusive. It transforms and connects.</em>`,
        gold: `<strong>Sun (☉)</strong><br>Element: Gold (Aurum)<br><em>The perfect metal, incorruptible and radiant. It illuminates and perfects.</em>`,
        silver: `<strong>Moon (☽)</strong><br>Element: Silver (Argentum)<br><em>The lunar metal, pure and reflective. It purifies and receives.</em>`
    };
    
    return planetData[element] || 'Unknown alchemical principle';
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    DOM.notificationArea.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, duration);
}

// === AMBIENT ANIMATIONS ===
function startAmbientAnimations() {
    // Periodic bubble creation in crucible
    setInterval(() => {
        if (AlchemicalState.ingredients.length > 0) {
            addBubble();
        }
    }, 2000);
    
    // Subtle rotation of transmutation circle
    let autoRotate = true;
    setInterval(() => {
        if (autoRotate && !document.hidden) {
            AlchemicalState.rotation += 0.1;
            DOM.transmutationCircle.style.transform = `rotate(${AlchemicalState.rotation}deg)`;
            
            // Counter-rotate planetary symbols
            const planetarySymbols = document.getElementById('planetary-symbols');
            planetarySymbols.style.transform = `rotate(${-AlchemicalState.rotation}deg)`;
        }
    }, 50);
    
    // Pause auto-rotation when user interacts
    DOM.transmutationCircle.addEventListener('mouseenter', () => {
        autoRotate = false;
    });
    
    DOM.transmutationCircle.addEventListener('mouseleave', () => {
        autoRotate = true;
    });
}

// === SPARKLE ANIMATION (for stone reveal) ===
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(2) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', initAlchemicalWorkbench);

// Add smooth scrolling for better experience
document.documentElement.style.scrollBehavior = 'smooth';
/* =========================================
   OPUS MAGNUM — SCRIPTS
   A Renaissance Hermetic Workspace
   ========================================= */

// --- Constants & Configuration ---

const STAGES = [
    {
        id: 'nigredo',
        name: 'NIGREDO',
        latin: 'Putrefactio — Caput Mortuum',
        symbol: '☾',
        bg: '#050505',
        accent: '#4A4A4A',
        text: '#888888',
        glow: 'rgba(255, 255, 255, 0.05)',
        particleColor: 'rgba(150, 150, 150, 0.5)',
        liquidColor: '#1A0A2E',
        requiredIngredients: 1 // Minimal to start feeling active
    },
    {
        id: 'albedo',
        name: 'ALBEDO',
        latin: 'Dealbatio — Ablutio',
        symbol: '☽',
        bg: '#0D0F14',
        accent: '#C0C0C0',
        text: '#E8E8E8',
        glow: 'rgba(192, 192, 192, 0.2)',
        particleColor: 'rgba(200, 220, 255, 0.6)',
        liquidColor: '#2C3E50',
        requiredIngredients: 2
    },
    {
        id: 'citrinitas',
        name: 'CITRINITAS',
        latin: 'Citrinitas — Solarization',
        symbol: '☀',
        bg: '#141008',
        accent: '#FFD700',
        text: '#F0D68A',
        glow: 'rgba(255, 215, 0, 0.3)',
        particleColor: 'rgba(255, 215, 0, 0.7)',
        liquidColor: '#5C4012',
        requiredIngredients: 3
    },
    {
        id: 'rubedo',
        name: 'RUBEDO',
        latin: 'Lapis Philosophorum',
        symbol: '🜒',
        bg: '#140505',
        accent: '#DC143C',
        text: '#FF4500',
        glow: 'rgba(220, 20, 60, 0.4)',
        particleColor: 'rgba(255, 69, 0, 0.8)',
        liquidColor: '#4A0000',
        requiredIngredients: 4
    }
];

const INGREDIENTS = ['sal', 'sulphur', 'mercurius', 'aurum'];
const LOG_MESSAGES = {
    add: {
        sal: 'Sal additum est. Corpus firmatur.',
        sulphur: 'Sulphur additum est. Anima inflammatu.',
        mercurius: 'Mercurius additus est. Spiritus volatilis.',
        aurum: 'Aurum additum est. Perfectio appropinquat.'
    },
    grind: 'Materia triturata est. Subtilitas augetur.',
    advance: 'Transmutatio incipit... Natura transformatur.',
    fail: 'Nondum paratum est. Magis labora.'
};

// --- State Management ---

const state = {
    currentStageIndex: 0,
    ingredientsAdded: new Set(),
    isTransmuting: false,
    isComplete: false,
    grindCount: 0
};

// --- DOM Elements ---

const els = {
    root: document.documentElement,
    stageName: document.getElementById('stageName'),
    stageLatin: document.getElementById('stageLatin'),
    opusSymbol: document.getElementById('opusSymbol'),
    progressFill: document.getElementById('progressFill'),
    btnAdvance: document.getElementById('btnAdvance'),
    btnReset: document.getElementById('btnReset'),
    crucibleLiquid: document.getElementById('crucibleLiquid'),
    liquidSurface: document.getElementById('liquidSurface'),
    logEntries: document.getElementById('logEntries'),
    lapisReveal: document.getElementById('lapisReveal'),
    dustContainer: document.getElementById('dustParticles'),
    particleCanvas: document.getElementById('particleCanvas'),
    crucibleVessel: document.getElementById('crucibleVessel'),
    mortarPestle: document.getElementById('mortarPestle'),
    marginalia: document.querySelectorAll('.marginalia'),
    ingredients: document.querySelectorAll('.ingredient')
};

// --- Initialization ---

function init() {
    createDustParticles();
    initCanvas();
    initDragAndDrop();
    initInteractions();
    updateTheme(0);
    
    // Initial log
    addLog('Laboratorium paratum est. Opus incipit.');
    
    // Enable reset
    els.btnReset.addEventListener('click', resetWork);
}

// --- Theme & Stage Updates ---

function updateTheme(index) {
    const stage = STAGES[index];
    
    // Update CSS Variables
    els.root.style.setProperty('--current-stage-bg', stage.bg);
    els.root.style.setProperty('--current-stage-accent', stage.accent);
    els.root.style.setProperty('--current-stage-text', stage.text);
    els.root.style.setProperty('--current-stage-glow', stage.glow);
    
    // Update Text & Symbols
    els.stageName.textContent = stage.name;
    els.stageLatin.textContent = stage.latin;
    els.opusSymbol.textContent = stage.symbol;
    
    // Update Crucible Liquid
    els.crucibleLiquid.setAttribute('fill', stage.liquidColor);
    
    // Update Particles
    window.particleColor = stage.particleColor;
    
    // Update Progress Nodes
    document.querySelectorAll('.stage-node').forEach((node, i) => {
        node.classList.remove('active', 'completed');
        if (i < index) node.classList.add('completed');
        if (i === index) node.classList.add('active');
    });
    
    // Reveal Marginalia
    els.marginalia.forEach(m => {
        const revealStage = m.getAttribute('data-reveal');
        const stageIndex = STAGES.findIndex(s => s.id === revealStage);
        if (stageIndex !== -1 && stageIndex <= index) {
            m.classList.add('revealed');
        }
    });
}

// --- Interactions ---

function initInteractions() {
    // Advance Button
    els.btnAdvance.addEventListener('click', () => {
        if (state.isTransmuting || state.isComplete) return;
        
        const currentStage = STAGES[state.currentStageIndex];
        
        if (state.ingredientsAdded.size >= currentStage.requiredIngredients) {
            performTransmutation();
        } else {
            addLog(LOG_MESSAGES.fail, true);
            shakeCrucible();
        }
    });

    // Mortar and Pestle
    els.mortarPestle.addEventListener('click', () => {
        if (state.isTransmuting || state.isComplete) return;
        
        state.grindCount++;
        addLog(LOG_MESSAGES.grind);
        
        // Visual feedback
        createExplosion(60, 40, 10, '#8B6914'); // Sparks at mortar position
        
        // Reset animation class to re-trigger
        els.mortarPestle.classList.remove('active-grind');
        void els.mortarPestle.offsetWidth; // force reflow
        els.mortarPestle.classList.add('active-grind');
        
        // Remove class after animation
        setTimeout(() => els.mortarPestle.classList.remove('active-grind'), 300);
    });
}

function performTransmutation() {
    state.isTransmuting = true;
    els.btnAdvance.disabled = true;
    
    addLog(LOG_MESSAGES.advance);
    
    // Visual effects
    createExplosion(window.innerWidth / 2, window.innerHeight / 2, 50, STAGES[state.currentStageIndex].accent);
    shakeCrucible();
    
    // Simulate process time
    setTimeout(() => {
        state.currentStageIndex++;
        
        // Check for completion
        if (state.currentStageIndex >= STAGES.length) {
            state.currentStageIndex = STAGES.length - 1; // Stay on Rubedo
            revealLapis();
        } else {
            updateTheme(state.currentStageIndex);
            addLog('Gradus completus. Perge.', false);
            
            // Reset ingredients for next stage? Or keep cumulative? 
            // Let's keep cumulative but increase requirement.
            // Actually, let's just clear ingredients to force new interaction or just leave them.
            // Let's clear them for "new work".
            state.ingredientsAdded.clear();
            updateButtonState();
        }
        
        state.isTransmuting = false;
        if (!state.isComplete) {
            els.btnAdvance.disabled = false;
        }
    }, 2000);
}

function updateButtonState() {
    const currentStage = STAGES[state.currentStageIndex];
    const ready = state.ingredientsAdded.size >= currentStage.requiredIngredients;
    els.btnAdvance.disabled = !ready;
}

function resetWork() {
    if (state.isComplete) {
        els.lapisReveal.classList.remove('revealed');
        state.isComplete = false;
    }
    
    state.currentStageIndex = 0;
    state.ingredientsAdded.clear();
    state.grindCount = 0;
    state.isTransmuting = false;
    
    els.logEntries.innerHTML = '';
    addLog('Ab initio. Materia prima restituta.');
    
    updateTheme(0);
    updateButtonState();
}

function revealLapis() {
    state.isComplete = true;
    els.btnAdvance.style.display = 'none';
    
    setTimeout(() => {
        els.lapisReveal.classList.add('revealed');
        // Final big explosion
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                createExplosion(
                    window.innerWidth/2 + (Math.random()-0.5)*200, 
                    window.innerHeight/2 + (Math.random()-0.5)*200, 
                    30, '#FFD700'
                );
            }, i * 300);
        }
    }, 1000);
}

function shakeCrucible() {
    els.crucibleVessel.style.animation = 'none';
    els.crucibleVessel.offsetHeight; /* trigger reflow */
    els.crucibleVessel.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    setTimeout(() => els.crucibleVessel.style.animation = '', 500);
}

// --- Drag and Drop (Ingredients) ---

function initDragAndDrop() {
    els.ingredients.forEach(ing => {
        ing.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', ing.getAttribute('data-ingredient'));
            e.dataTransfer.effectAllowed = 'move';
            ing.style.opacity = '0.5';
        });
        
        ing.addEventListener('dragend', () => {
            ing.style.opacity = '1';
        });
    });
    
    // Crucible Drop Zone
    els.crucibleVessel.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
        els.crucibleVessel.style.transform = 'scale(1.05)';
        els.crucibleVessel.style.transition = 'transform 0.2s';
    });
    
    els.crucibleVessel.addEventListener('dragleave', () => {
        els.crucibleVessel.style.transform = 'scale(1)';
    });
    
    els.crucibleVessel.addEventListener('drop', (e) => {
        e.preventDefault();
        els.crucibleVessel.style.transform = 'scale(1)';
        
        const ingredientId = e.dataTransfer.getData('text/plain');
        addIngredient(ingredientId);
    });
}

function addIngredient(id) {
    if (state.ingredientsAdded.has(id)) {
        addLog('Hoc elementum iam adiectum est.', true);
        return;
    }
    
    state.ingredientsAdded.add(id);
    addLog(LOG_MESSAGES.add[id]);
    
    // Visual: Liquid rises slightly or bubbles more
    const liquidLevel = Math.min(100 + (state.ingredientsAdded.size * 15), 160);
    els.crucibleLiquid.setAttribute('d', `M 50 ${liquidLevel} Q 65 ${liquidLevel-5} 100 ${liquidLevel-2} Q 135 ${liquidLevel-5} 150 ${liquidLevel} L 145 180 Q 125 215 100 215 Q 75 215 55 180 Z`);
    
    // Add bubble
    createBubble();
    
    // Small spark
    createExplosion(window.innerWidth * 0.7, window.innerHeight * 0.5, 15, STAGES[state.currentStageIndex].accent);
    
    updateButtonState();
}

function createBubble() {
    const svg = document.getElementById('crucibleSvg');
    const ns = "http://www.w3.org/2000/svg";
    const bubble = document.createElementNS(ns, 'circle');
    
    bubble.setAttribute('cx', 80 + Math.random() * 40);
    bubble.setAttribute('cy', 180);
    bubble.setAttribute('r', 2 + Math.random() * 3);
    bubble.setAttribute('fill', 'rgba(255,255,255,0.4)');
    bubble.classList.add('bubble');
    
    svg.appendChild(bubble);
    
    // Remove after animation
    setTimeout(() => bubble.remove(), 3000);
}

// --- Logging ---

function addLog(msg, isError = false) {
    const entry = document.createElement('p');
    entry.className = 'log-entry';
    if (isError) entry.style.color = 'var(--ink-red)';
    entry.textContent = `> ${msg}`;
    
    els.logEntries.appendChild(entry);
    
    // Auto scroll
    const container = els.logEntries.parentElement;
    container.scrollTop = container.scrollHeight;
    
    // Keep log size manageable
    if (els.logEntries.children.length > 20) {
        els.logEntries.removeChild(els.logEntries.firstChild);
    }
}

// --- Canvas Particles (Embers) ---

let canvas, ctx;
let particles = [];
window.particleColor = 'rgba(150, 150, 150, 0.5)';

function initCanvas() {
    canvas = els.particleCanvas;
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initial particles
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }
    
    animateParticles();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        life: 1
    };
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, index) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        
        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = window.particleColor.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();
        
        // Reset if off screen
        if (p.y < -10) {
            particles[index] = createParticle();
        }
    });
    
    requestAnimationFrame(animateParticles);
}

function createExplosion(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedY: (Math.random() - 0.5) * 5,
            speedX: (Math.random() - 0.5) * 5,
            opacity: 1,
            life: 1,
            decay: 0.02,
            isExplosion: true,
            color: color
        });
    }
    
    // Custom update for explosion particles in the loop (hacky but effective for simple canvas)
    // We'll just let them get cleaned up by the standard loop or overwrite them.
    // Better: splice them out or let them fade.
    // Let's modify the loop slightly to handle decay.
}

// Overwrite the loop to handle explosions properly
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p.isExplosion) {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.life})`);
            ctx.fill();
        } else {
            p.y -= p.speedY;
            p.x += p.speedX;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = window.particleColor.replace(/[\d.]+\)$/, `${p.opacity})`);
            ctx.fill();
            
            if (p.y < -10) {
                particles[i] = createParticle();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// --- DOM Dust Particles ---

function createDustParticles() {
    const count = 20;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'dust-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (5 + Math.random() * 10) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        els.dustContainer.appendChild(p);
    }
}

// --- Start ---

window.addEventListener('DOMContentLoaded', init);

// Add CSS for shake animation dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    .active-grind .pestle {
        animation: grind 0.3s ease-in-out;
    }
`;
document.head.appendChild(styleSheet);
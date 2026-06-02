// Alchemical Laboratory JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        currentStage: 0,
        isGrinding: false,
        isManualControl: false,
        ingredientsGround: 0,
        crucibleProgress: [0, 0, 0, 0]
    };

    // DOM Elements
    const elements = {
        laboratory: document.querySelector('.laboratory'),
        mortarContainer: document.querySelector('.mortar-container'),
        mortar: document.querySelector('.mortar'),
        ingredients: document.querySelectorAll('.ingredient'),
        crucibles: document.querySelectorAll('.crucible'),
        liquidLayers: document.querySelectorAll('.liquid-layer'),
        stageDots: document.querySelectorAll('.stage-dot'),
        resetBtn: document.getElementById('reset-btn'),
        advanceBtn: document.getElementById('advance-btn'),
        manuscript: document.querySelector('.manuscript'),
        stone: document.getElementById('stone'),
        centralSymbol: document.querySelector('.central-symbol'),
        planetOrbits: document.querySelectorAll('.planet-orbit'),
        planets: document.querySelectorAll('.planet')
    };

    // Alchemical stages configuration
    const stages = [
        { name: 'NIGREDO', color: '#1a1a2e', symbol: '☾', element: 'earth' },
        { name: 'ALBEDO', color: '#2d4a3b', symbol: '☽', element: 'water' },
        { name: 'CITRINITAS', color: '#c89b3c', symbol: '☀', element: 'fire' },
        { name: 'RUBEDO', color: '#8b0000', symbol: '⚛', element: 'air' }
    ];

    // Initialize laboratory
    function init() {
        setupEventListeners();
        startBackgroundAnimations();
        updateStageDisplay();
        startManuscriptReveal();
        startPlanetOrbitAnimations();
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Mortar grinding interaction
        elements.mortarContainer.addEventListener('click', handleGrinding);
        elements.mortarContainer.addEventListener('mousedown', startGrinding);
        elements.mortarContainer.addEventListener('mouseup', stopGrinding);
        elements.mortarContainer.addEventListener('mouseleave', stopGrinding);

        // Touch support for mobile
        elements.mortarContainer.addEventListener('touchstart', handleTouchGrinding, { passive: false });
        elements.mortarContainer.addEventListener('touchmove', handleTouchGrinding, { passive: false });
        elements.mortarContainer.addEventListener('touchend', stopGrinding);

        // Stage advancement buttons
        elements.resetBtn.addEventListener('click', resetLaboratory);
        elements.advanceBtn.addEventListener('click', advanceStage);

        // Stage dots for manual progression
        elements.stageDots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToStage(index));
        });

        // Interactive ingredient clicking
        elements.ingredients.forEach(ingredient => {
            ingredient.addEventListener('click', () => {
                ingredient.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    ingredient.style.transform = '';
                }, 200);
            });
        });

        // Stone hover interaction
        elements.stone.addEventListener('mouseenter', () => {
            elements.stone.style.animationPlayState = 'paused';
        });
        elements.stone.addEventListener('mouseleave', () => {
            elements.stone.style.animationPlayState = 'running';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    // Grinding mechanics
    function startGrinding() {
        if (state.isManualControl) return;
        state.isGrinding = true;
        elements.mortarContainer.classList.add('grinding');
        elements.mortar.style.animation = 'rotate 2s linear infinite';
        
        // Grind ingredients
        elements.ingredients.forEach(ingredient => {
            ingredient.style.animation = 'grind 0.3s ease-out infinite';
        });
    }

    function handleGrinding() {
        if (!state.isGrinding && !state.isManualControl) {
            startGrinding();
            setTimeout(stopGrinding, 1000);
        }
    }

    function handleTouchGrinding(e) {
        e.preventDefault();
        startGrinding();
    }

    function stopGrinding() {
        state.isGrinding = false;
        elements.mortarContainer.classList.remove('grinding');
        elements.mortar.style.animation = '';
        elements.ingredients.forEach(ingredient => {
            ingredient.style.animation = '';
        });
    }

    // Stage progression system
    function advanceStage() {
        if (state.currentStage < stages.length - 1) {
            state.currentStage++;
            updateStage();
        } else {
            // Complete the work - ultimate transformation
            completeAlchemicalWork();
        }
    }

    function goToStage(stageIndex) {
        if (stageIndex >= state.currentStage && stageIndex < stages.length) {
            state.currentStage = stageIndex;
            updateStage();
        }
    }

    function resetLaboratory() {
        state.currentStage = 0;
        state.crucibleProgress = [0, 0, 0, 0];
        updateStage();
        
        // Reset animations
        elements.literature.forEach(line => {
            line.style.animation = 'none';
            line.offsetHeight; // Trigger reflow
            line.style.animation = '';
        });
    }

    function updateStage() {
        const stage = stages[state.currentStage];
        
        // Update color scheme
        document.documentElement.style.setProperty('--gold-ancient', 
            blendColors('#b8860b', stage.color, state.currentStage / stages.length));
        
        // Update crucible liquids
        elements.literature.forEach((line, index) => {
            if (index <= state.currentStage) {
                line.classList.add('revealed');
            }
        });

        // Update stage indicator
        elements.stageDots.forEach((dot, index) => {
            dot.classList.toggle('active', index <= state.currentStage);
        });

        // Animate crucible progression
        animateCrucible(state.currentStage);

        // Update manuscript visibility
        updateManuscriptReveal();

        // Update central symbol
        elements.centralSymbol.textContent = stage.symbol;
        elements.centralSymbol.style.color = stage.color;

        // Update planet orbits based on stage
        updatePlanetaryAlignments();
    }

    function animateCrucible(stageIndex) {
        const crucible = elements.crucibles[stageIndex];
        if (crucible) {
            const liquid = crucible.querySelector('.liquid-layer');
            if (liquid) {
                liquid.style.animation = `bubble${stageIndex + 1} 2s infinite`;
                liquid.style.opacity = '0.9';
                
                // Add glow effect
                liquid.style.boxShadow = `0 0 ${20 + stageIndex * 5}px ${stages[stageIndex].color}`;
            }
        }
    }

    // Manuscript reveal system
    function startManuscriptReveal() {
        // Lines are revealed through CSS animations
        // JavaScript controls when to trigger them
        setTimeout(() => {
            const lines = elements.manuscript.querySelectorAll('.manuscript-line');
            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }, 2000);
    }

    function updateManuscriptReveal() {
        const lines = elements.manuscript.querySelectorAll('.manuscript-line');
        lines.forEach((line, index) => {
            if (index <= state.currentStage * 3) {
                line.classList.add('revealed');
            }
        });
    }

    // Planetary alignment system
    function updatePlanetaryAlignments() {
        const angle = (state.currentStage / stages.length) * 360;
        elements.planetOrbits.forEach(orbit => {
            orbit.style.transform = `rotate(${angle}deg)`;
        });
        
        // Animate planets
        elements.planets.forEach((planet, index) => {
            const delay = (index / elements.planets.length) * 2;
            setTimeout(() => {
                planet.style.animationPlayState = state.currentStage >= index ? 'running' : 'paused';
            }, delay * 1000);
        });
    }

    // Complete transformation sequence
    function completeAlchemicalWork() {
        // Stone transformation
        elements.stone.style.animation = 'stoneGlow 0.5s infinite alternate';
        elements.stone.style.background = 'radial-gradient(circle, #ffd700, #ff8c00, #ff4500, #ffd700)';
        
        // Show completion message
        setTimeout(() => {
            alert('🧪 THE GREAT WORK IS COMPLETE! 🧪\nThe Philosopher\'s Stone has been achieved!');
        }, 1000);

        // Extraordinary visual effects
        createExplosionEffect();
        playCompletionSound();
    }

    function createExplosionEffect() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    background: radial-gradient(circle, #ffd700, #ff4500);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    animation: particleExplode ${Math.random() * 2 + 1}s ease-out forwards;
                `;
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 3000);
            }, i * 50);
        }
    }

    function playCompletionSound() {
        // Create subtle sound effect using Web Audio API if available
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        }
    }

    // Color blending utility
    function blendColors(color1, color2, ratio) {
        // Simple color blending based on stage progression
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Handle keyboard shortcuts
    function handleKeyboardShortcuts(e) {
        switch(e.key) {
            case '1': goToStage(0); break;
            case '2': goToStage(1); break;
            case '3': goToStage(2); break;
            case '4': goToStage(3); break;
            case ' ': e.preventDefault(); advanceStage(); break;
            case 'r': resetLaboratory(); break;
        }
    }

    // Start the laboratory
    init();
});

// Add CSS animations dynamically for bubbling effects
const styleSheet = document.styleSheets[0];
const bubblingKeyframes = `
    @keyframes bubble1 {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-30px) scale(1.5); opacity: 0.3; }
        100% { transform: translateY(-60px) scale(0); opacity: 0; }
    }
    @keyframes bubble2 {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-25px) scale(1.3); opacity: 0.3; }
        100% { transform: translateY(-50px) scale(0); opacity: 0; }
    }
    @keyframes bubble3 {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-35px) scale(1.6); opacity: 0.3; }
        100% { transform: translateY(-70px) scale(0); opacity: 0; }
    }
    @keyframes bubble4 {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-20px) scale(1.4); opacity: 0.3; }
        100% { transform: translateY(-40px) scale(0); opacity: 0; }
    }
`;

// Inject keyframes if not already present
if (!Array.from(document.styleSheets).some(sheet => {
    try {
        return Array.from(sheet.cssRules || sheet.rules).some(rule => 
            rule.type === CSSRule.KEYFRAMES_RULE && rule.name.startsWith('bubble')
        );
    } catch(e) {
        return false;
    }
})) {
    const style = document.createElement('style');
    style.textContent = bubblingKeyframes;
    document.head.appendChild(style);
}
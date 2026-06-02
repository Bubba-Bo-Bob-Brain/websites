document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration & State ---
    const state = {
        stage: 0, // 0: Nigredo, 1: Albedo, 2: Citrinitas, 3: Rubedo
        heat: 10,
        ingredients: [],
        isGrinding: false,
        isTransmuting: false
    };

    const stages = [
        { id: 'nigredo', name: 'NIGREDO', desc: 'Putrefactio et Mortificatio', color: '#1a1a1a', flameColor: '#ff4500' },
        { id: 'albedo', name: 'ALBEDO', desc: 'Purificatio et Lavatio', color: '#e8e6e1', flameColor: '#add8e6' }, // Blue-ish white flame
        { id: 'citrinitas', name: 'CITRINITAS', desc: 'Illuminatio et Sol', color: '#f4d03f', flameColor: '#ffd700' },
        { id: 'rubedo', name: 'RUBEDO', desc: 'Unio Mystica et Lapis', color: '#b91c1c', flameColor: '#ff0000' }
    ];

    const latinPhrases = [
        "Solve et Coagula",
        "Visita Interiora Terrae Rectificando Invenies Occultum Lapidem",
        "Primum est nigrum, deinde album, deinde rubeum",
        "Aurum nostrum non est aurum vulgi",
        "Ignis purificat omnia",
        "Tria prima: Sulfur, Mercurius, Sal",
        "Sic transit gloria mundi"
    ];

    // --- DOM Elements ---
    const elements = {
        body: document.body,
        liquid: document.getElementById('crucible-liquid'),
        sediment: document.getElementById('sediment-layer'),
        bubblesContainer: document.getElementById('bubbles-container'),
        flameContainer: document.getElementById('flame-container'),
        statusReadout: document.getElementById('status-readout'),
        transmuteBtn: document.getElementById('transmute-btn'),
        heatSlider: document.getElementById('heat-slider'),
        mortar: document.getElementById('mortar-pestle'),
        ingredientBtns: document.querySelectorAll('.ingredient'),
        stageItems: document.querySelectorAll('.stage'),
        stone: document.getElementById('stone-reward'),
        rings: document.querySelectorAll('.ring'),
        ritualText: document.getElementById('ritual-text')
    };

    // --- Initialization ---
    function init() {
        startBubbles();
        updateStatus("Praeparatio incipit. Orationes et Labor.");
        setInterval(cycleLatinText, 8000);
        
        // Add initial sediment
        elements.sediment.style.opacity = '1';
    }

    // --- Core Logic: The Great Work ---
    function attemptTransmutation() {
        if (state.isTransmuting) return;
        
        const currentStageData = stages[state.stage];
        
        // Logic to advance stage
        let canAdvance = false;

        if (state.stage === 0) { // Nigredo -> Albedo
            // Need heat > 60, some grinding done, some ingredients
            if (state.heat > 60 && state.ingredients.length >= 2) canAdvance = true;
        } else if (state.stage === 1) { // Albedo -> Citrinitas
            // Need max heat, grinding done
            if (state.heat > 80 && state.ingredients.length >= 3) canAdvance = true;
        } else if (state.stage === 2) { // Citrinitas -> Rubedo
            if (state.heat > 90) canAdvance = true;
        }

        if (canAdvance) {
            performTransmutation();
        } else {
            giveFeedback();
        }
    }

    function performTransmutation() {
        state.isTransmuting = true;
        updateStatus("Magia procedit...");
        
        // Visual flair: Speed up rings
        elements.rings.forEach(ring => {
            ring.style.animationDuration = '2s';
        });

        // Flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'white';
        flash.style.opacity = '0.8';
        flash.style.zIndex = '200';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 2s ease-out';
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 2000);
        }, 100);

        // Wait for transition
        setTimeout(() => {
            advanceStage();
            state.isTransmuting = false;
            
            // Reset rings speed
            elements.rings.forEach(ring => {
                ring.style.animationDuration = ''; // Reverts to CSS default
            });
        }, 2500);
    }

    function advanceStage() {
        state.stage++;
        
        if (state.stage >= stages.length) {
            // Completion
            finalizeStone();
            return;
        }

        const newStage = stages[state.stage];
        
        // Update UI Classes
        elements.body.className = `stage-${newStage.id}`;
        elements.stageItems.forEach((item, index) => {
            item.classList.toggle('active', index === state.stage);
        });

        // Update Liquid Visuals
        elements.liquid.style.backgroundColor = newStage.color;
        updateStatus(`${newStage.name}: ${newStage.desc}`);
        
        // Reset ingredients for next stage requirement
        state.ingredients = [];
    }

    function finalizeStone() {
        elements.liquid.style.height = '0%'; // Liquid evaporates/merges
        updateStatus("LAPIS PHILOSOPHORUM RECEPTUM EST!");
        
        setTimeout(() => {
            elements.stone.classList.add('materialized');
            elements.transmuteBtn.style.display = 'none';
        }, 1000);
    }

    function giveFeedback() {
        if (state.heat < 50) {
            updateStatus("Ignis non satis est! (Add heat)");
        } else if (state.ingredients.length < 2) {
            updateStatus("Materia prima caret! (Add ingredients)");
        } else {
            updateStatus("Non est tempus. (Grind more or wait)");
        }
        
        // Shake button
        elements.transmuteBtn.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 200 });
    }

    // --- Interactive Components ---

    // Heat Control
    elements.heatSlider.addEventListener('input', (e) => {
        state.heat = parseInt(e.target.value);
        const intensity = state.heat / 100;
        
        // Adjust Flame
        const flames = document.querySelectorAll('.flame');
        flames.forEach(f => {
            f.style.opacity = 0.2 + (intensity * 0.8);
            f.style.height = `${40 + (intensity * 40)}px`;
            f.style.animationDuration = `${0.4 - (intensity * 0.3)}s`;
        });

        // Adjust Liquid agitation (turbulence visual)
        elements.liquid.style.filter = `blur(${intensity * 2}px)`;
    });

    // Ingredients
    elements.ingredientBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const element = btn.dataset.element;
            state.ingredients.push(element);
            
            // Visual drop into crucible
            createParticle(btn);
            updateStatus(`Additur: ${element.toUpperCase()}`);
            
            // Reset grind status to require work again
            state.isGrinding = false;
            elements.mortar.classList.remove('grinding');
        });
    });

    function createParticle(source) {
        const rect = source.getBoundingClientRect();
        const crucibleRect = elements.liquid.getBoundingClientRect();
        
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${rect.left + rect.width/2}px`;
        particle.style.top = `${rect.top}px`;
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = 'var(--ink-gold)';
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '50';
        particle.style.pointerEvents = 'none';
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${crucibleRect.left - rect.left}px, ${crucibleRect.top - rect.top + 50}px) scale(0)`, opacity: 0 }
        ], { duration: 600, easing: 'ease-in' });
        
        animation.onfinish = () => particle.remove();
    }

    // Mortar & Pestle
    elements.mortar.addEventListener('click', () => {
        elements.mortar.classList.add('grinding');
        state.isGrinding = true;
        
        // Add some bubbles to simulate reaction
        for(let i=0; i<5; i++) {
            setTimeout(() => createBubble(true), i * 100);
        }

        setTimeout(() => {
            elements.mortar.classList.remove('grinding');
        }, 600);
    });

    // Main Button
    elements.transmuteBtn.addEventListener('click', attemptTransmutation);

    // --- Visual Effects Systems ---

    function startBubbles() {
        setInterval(() => {
            // More heat = more bubbles
            const chance = state.heat / 100; 
            if (Math.random() < chance) {
                createBubble();
            }
        }, 200);
    }

    function createBubble(force = false) {
        if (!force && state.stage === 4) return; // No bubbles if stone is made

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = 5 + Math.random() * 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 80 + 10}%`;
        bubble.style.animationDuration = `${1 + Math.random()}s`;
        
        // Color depends on stage
        if (state.stage === 0) bubble.style.background = 'rgba(255,255,255,0.1)';
        if (state.stage === 1) bubble.style.background = 'rgba(255,255,255,0.4)';
        if (state.stage === 2) bubble.style.background = 'rgba(255, 215, 0, 0.5)';
        if (state.stage === 3) bubble.style.background = 'rgba(255, 0, 0, 0.5)';

        elements.bubblesContainer.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 2000);
    }

    function updateStatus(text) {
        elements.statusReadout.style.opacity = 0;
        setTimeout(() => {
            elements.statusReadout.textContent = text;
            elements.statusReadout.style.opacity = 1;
        }, 200);
    }

    function cycleLatinText() {
        const phrase = latinPhrases[Math.floor(Math.random() * latinPhrases.length)];
        elements.ritualText.style.opacity = 0;
        setTimeout(() => {
            elements.ritualText.textContent = phrase;
            elements.ritualText.style.opacity = 1;
        }, 1000);
    }

    // Initialize
    init();
});
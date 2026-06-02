/* ============================================
   Opus Magnum — The Alchemist's Workbench
   scripts.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        stageIndex: 0,
        progress: 0,
        temperature: 0,
        grindProgress: 0,
        currentPage: 1,
        totalPages: 4,
        isGrinding: false
    };

    // --- DOM Element Cache ---
    const dom = {
        body: document.body,
        progressFill: document.getElementById('progressFill'),
        tempFill: document.getElementById('temperatureFill'),
        tempValue: document.getElementById('temperatureValue'),
        reactionStatus: document.querySelector('#reactionStatus .status-text'),
        grindFill: document.getElementById('grindFill'),
        mortar: document.getElementById('mortarPestle'),
        liquid: document.getElementById('liquidSurface'),
        bubbles: document.querySelectorAll('.bubble'),
        centerSymbol: document.getElementById('centerSymbol'),
        stageMarkers: document.querySelectorAll('.stage-marker'),
        prevBtn: document.getElementById('prevPage'),
        nextBtn: document.getElementById('nextPage'),
        pageIndicator: document.getElementById('pageIndicator'),
        pages: document.querySelectorAll('.manuscript-page'),
        marginalia1: document.getElementById('marginalia1'),
        tooltip: document.getElementById('tooltip'),
        tooltipText: document.getElementById('tooltipText'),
        stoneAura: document.getElementById('stoneAura'),
        stoneStatus: document.querySelector('#stoneStatus .status-text'),
        annotations: document.querySelectorAll('.annotation'),
        constellation1: document.getElementById('constellation1'),
        constellation2: document.getElementById('constellation2'),
        ingredients: document.querySelectorAll('.ingredient'),
        circleSvg: document.getElementById('circleSvg'),
        planetarySymbols: document.querySelectorAll('.planet-symbol'),
        dissolvingSymbols: document.querySelectorAll('.element-symbol'),
        crucibleSection: document.getElementById('crucibleSection')
    };

    const STAGES = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    const INGREDIENT_DATA = {
        fire: { name: 'Ignis', effect: 'Increases Calor' },
        water: { name: 'Aqua', effect: 'Stabilizes Solution' },
        air: { name: 'Aer', effect: 'Promotes Volatilization' },
        earth: { name: 'Terra', effect: 'Grounds the Essence' }
    };

    let grindInterval = null;

    // --- Initialization ---
    function init() {
        setupDragAndDrop();
        setupMortarPestle();
        setupNavigation();
        setupTooltips();
        setupStageMarkers();
        updateUI();
        startDecayLoop();
        revealConstellations();
        animateAnnotations();
    }

    // --- Core Logic ---

    function updateStage(index) {
        if (index < 0 || index >= STAGES.length) return;
        
        state.stageIndex = index;
        const stage = STAGES[index];
        
        // Update theme and CSS variables
        dom.body.dataset.stage = stage;
        
        // Update progress markers
        dom.stageMarkers.forEach((m, i) => {
            m.classList.toggle('active', i === index);
        });

        // Sync manuscript to stage
        navigateToPage(index + 1);
        
        // Update center transmutation symbol
        const stageSymbols = ['☽', '☉', '✦', '◆'];
        dom.centerSymbol.textContent = stageSymbols[index];
        
        // Reveal annotations in later stages
        if (index >= 1) {
            dom.annotations.forEach(a => a.classList.add('visible'));
        }
        
        // Check completion
        if (index === 3 && state.progress >= 100) {
            completeStone();
        }

        updateUI();
    }

    function addProgress(amount) {
        state.progress = Math.min(100, state.progress + amount);
        
        // Sequential stage advancement
        let nextStageIndex = state.stageIndex;
        if (state.stageIndex === 0 && state.progress >= 25) nextStageIndex = 1;
        else if (state.stageIndex === 1 && state.progress >= 50) nextStageIndex = 2;
        else if (state.stageIndex === 2 && state.progress >= 75) nextStageIndex = 3;
        
        if (nextStageIndex > state.stageIndex) {
            updateStage(nextStageIndex);
        }
        
        updateUI();
    }

    function updateUI() {
        // Main progress bar
        dom.progressFill.style.width = `${state.progress}%`;
        
        // Temperature gauge
        const tempDisplay = Math.min(100, state.temperature);
        dom.tempFill.style.width = `${tempDisplay}%`;
        dom.tempValue.textContent = `${Math.round(tempDisplay)}°`;
        
        // Reaction status text
        if (state.temperature < 15) {
            dom.reactionStatus.textContent = 'Dormant';
            dom.reactionStatus.style.color = 'var(--color-ink-faded)';
        } else if (state.temperature < 40) {
            dom.reactionStatus.textContent = 'Awakening';
            dom.reactionStatus.style.color = 'var(--stage-citrinitas)';
        } else if (state.temperature < 70) {
            dom.reactionStatus.textContent = 'Transmuting...';
            dom.reactionStatus.style.color = 'var(--stage-rubedo-accent)';
        } else {
            dom.reactionStatus.textContent = 'Volatile!';
            dom.reactionStatus.style.color = 'var(--stage-rubedo)';
        }

        // Grind progress
        dom.grindFill.style.width = `${state.grindProgress}%`;
        
        // Dynamic bubble speed based on temperature
        const bubbleDuration = Math.max(0.8, 4 - (state.temperature / 25));
        dom.bubbles.forEach(b => {
            b.style.animationDuration = `${bubbleDuration}s`;
        });

        // Liquid surface agitation
        dom.liquid.style.opacity = 0.4 + (state.temperature / 200);
    }

    // --- Interaction Setups ---

    function setupDragAndDrop() {
        dom.ingredients.forEach(ing => {
            ing.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', ing.dataset.element);
                ing.classList.add('dragging');
            });
            ing.addEventListener('dragend', () => {
                ing.classList.remove('dragging');
            });
        });

        // Drop zones: Transmutation Circle & Crucible
        [dom.circleSvg, dom.crucibleSection].forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.transform = 'scale(1.02)';
            });
            zone.addEventListener('dragleave', () => {
                zone.style.transform = 'scale(1)';
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.style.transform = 'scale(1)';
                const type = e.dataTransfer.getData('text/plain');
                if (type && INGREDIENT_DATA[type]) {
                    handleIngredientDrop(type);
                }
            });
        });
    }

    function handleIngredientDrop(type) {
        const data = INGREDIENT_DATA[type];
        state.temperature = Math.min(100, state.temperature + 20);
        addProgress(4);
        
        // Visual feedback pulse
        dom.circleSvg.style.filter = 'brightness(1.3) drop-shadow(0 0 10px var(--stage-current))';
        setTimeout(() => dom.circleSvg.style.filter = 'none', 300);
        
        // Update dissolving symbols dynamically
        if (dom.dissolvingSymbols.length > 0) {
            const sym = dom.dissolvingSymbols[Math.floor(Math.random() * dom.dissolvingSymbols.length)];
            sym.style.fill = 'var(--stage-current)';
            sym.style.animationDuration = '1.5s';
            setTimeout(() => {
                sym.style.fill = '';
                sym.style.animationDuration = '6s';
            }, 2000);
        }
        
        showTooltipAt(window.innerWidth / 2, window.innerHeight / 2, `${data.name} added!`);
    }

    function setupMortarPestle() {
        const startGrinding = (e) => {
            if (e.cancelable) e.preventDefault();
            if (state.isGrinding) return;
            
            state.isGrinding = true;
            dom.mortar.classList.add('grinding');
            
            grindInterval = setInterval(() => {
                state.grindProgress += 3;
                if (state.grindProgress >= 100) {
                    state.grindProgress = 0;
                    addProgress(5); // Bonus progress for completed grind
                    showTooltipAt(dom.mortar.getBoundingClientRect().x + 75, dom.mortar.getBoundingClientRect().y, 'Materia Pulverized!');
                    dom.circleSvg.style.filter = 'brightness(1.2)';
                    setTimeout(() => dom.circleSvg.style.filter = 'none', 200);
                }
                updateUI();
            }, 50);
        };

        const stopGrinding = () => {
            state.isGrinding = false;
            dom.mortar.classList.remove('grinding');
            clearInterval(grindInterval);
            grindInterval = null;
        };

        dom.mortar.addEventListener('mousedown', startGrinding);
        dom.mortar.addEventListener('touchstart', startGrinding, { passive: false });
        window.addEventListener('mouseup', stopGrinding);
        window.addEventListener('touchend', stopGrinding);
    }

    function setupNavigation() {
        dom.prevBtn.addEventListener('click', () => {
            if (state.currentPage > 1) navigateToPage(state.currentPage - 1);
        });
        dom.nextBtn.addEventListener('click', () => {
            if (state.currentPage < state.totalPages) navigateToPage(state.currentPage + 1);
        });
    }

    function navigateToPage(pageNum) {
        state.currentPage = pageNum;
        
        dom.pages.forEach(p => {
            p.classList.toggle('active', parseInt(p.dataset.page) === pageNum);
        });
        
        dom.pageIndicator.textContent = `Folium ${pageNum} / ${state.totalPages}`;
        dom.prevBtn.disabled = pageNum === 1;
        dom.nextBtn.disabled = pageNum === state.totalPages;
        
        // Reveal marginalia on first page after a delay
        if (pageNum === 1) {
            setTimeout(() => dom.marginalia1.classList.add('revealed'), 1200);
        }
    }

    function setupTooltips() {
        const hoverTargets = [
            ...dom.ingredients, 
            ...dom.planetarySymbols, 
            ...document.querySelectorAll('.ingredient-ref')
        ];
        
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                let text = '';
                if (el.classList.contains('ingredient')) {
                    text = `${INGREDIENT_DATA[el.dataset.element]?.name} — ${INGREDIENT_DATA[el.dataset.element]?.effect}`;
                } else if (el.classList.contains('planet-symbol')) {
                    text = `Celestial Body: ${el.dataset.planet?.charAt(0).toUpperCase() + el.dataset.planet?.slice(1)}`;
                } else if (el.classList.contains('ingredient-ref')) {
                    text = `Reference: ${el.dataset.ref}`;
                }
                tooltipText.textContent = text;
                dom.tooltip.classList.add('visible');
            });
            
            el.addEventListener('mousemove', (e) => {
                dom.tooltip.style.left = `${e.clientX + 15}px`;
                dom.tooltip.style.top = `${e.clientY - 10}px`;
            });
            
            el.addEventListener('mouseleave', () => {
                dom.tooltip.classList.remove('visible');
            });
        });
    }

    function showTooltipAt(x, y, text) {
        tooltipText.textContent = text;
        dom.tooltip.style.left = `${x}px`;
        dom.tooltip.style.top = `${y}px`;
        dom.tooltip.classList.add('visible');
        setTimeout(() => dom.tooltip.classList.remove('visible'), 1500);
    }

    function setupStageMarkers() {
        dom.stageMarkers.forEach(m => {
            m.addEventListener('click', () => {
                const idx = STAGES.indexOf(m.dataset.stage);
                if (idx !== -1 && idx !== state.stageIndex) {
                    // Allow clicking to advance, or just visualize. 
                    // For immersion, clicking a marker advances the work directly.
                    state.progress = STAGES.indexOf(STAGES[idx]) * 25 + 5;
                    updateStage(idx);
                }
            });
        });
    }

    // --- Animation & Decay Loops ---

    function startDecayLoop() {
        setInterval(() => {
            if (state.temperature > 0 && !state.isGrinding) {
                state.temperature = Math.max(0, state.temperature - 0.4);
                updateUI();
            }
        }, 100);
    }

    function revealConstellations() {
        setTimeout(() => dom.constellation1.classList.add('visible'), 1500);
        setTimeout(() => dom.constellation2.classList.add('visible'), 3000);
    }

    function animateAnnotations() {
        // Periodically highlight random annotations
        setInterval(() => {
            dom.annotations.forEach(a => a.classList.remove('visible'));
            const randomAnno = dom.annotations[Math.floor(Math.random() * dom.annotations.length)];
            if (randomAnno && state.stageIndex >= 1) {
                randomAnno.classList.add('visible');
            }
        }, 4000);
    }

    function completeStone() {
        dom.stoneAura.classList.add('active');
        dom.stoneStatus.textContent = '✦ MAGNUM OPUS PERFECTUM ✦';
        dom.body.classList.add('opus-complete');
        
        // Final flourish
        dom.centerSymbol.textContent = '◈';
        dom.centerSymbol.style.fill = 'var(--color-gold)';
    }

    // Boot
    init();
});
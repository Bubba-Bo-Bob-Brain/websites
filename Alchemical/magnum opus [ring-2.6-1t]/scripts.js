// ═══════════════════════════════════════════════════════════════════════════
// THE GREAT WORK — Opus Magnum | Interactive Alchemical Laboratory
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── State ────────────────────────────────────────────────────────────
    const state = {
        stage: 0,                        // 0=Nigredo, 1=Albedo, 2=Citrinitas, 3=Rubedo
        stageProgress: [0, 0, 0, 0],     // Progress per stage (0–100)
        selectedElements: new Set(),     // Currently selected element keys
        crucibleIngredients: [],         // Ingredients placed in crucible
        isRotating: false,               // Circle rotation state
        candlelight: false,              // Ambient candlelight toggle
        celestialVisible: true,          // Celestial overlay visibility
        isGrinding: false,               // Mortar grinding state
        workComplete: false,             // Whether Opus Magnum is finished
        circleRotation: 0,              // Accumulated rotation degrees
        planetaryRotation: 0,
        squareRotation: 45,             // Starts at 45° (matches initial SVG transform)
    };

    // ── Stage Configuration ──────────────────────────────────────────────
    const STAGES = [
        {
            key: 'nigredo',
            name: 'NIGREDO',
            latin: 'Nigredo — Putrefactio',
            subtitle: 'The Darkening — Dissolution of the prima materia',
            colorClass: 'stage-nigredo',
            progressTarget: 100,
            elementsRequired: ['sulfur', 'mercury'],
        },
        {
            key: 'albedo',
            name: 'ALBEDO',
            latin: 'Albedo — Purificatio',
            subtitle: 'The Whitening — Purification of the spirit',
            colorClass: 'stage-albedo',
            progressTarget: 100,
            elementsRequired: ['salt'],
        },
        {
            key: 'citrinitas',
            name: 'CITRINITAS',
            latin: 'Citrinitas — Illuminatio',
            subtitle: 'The Yellowing — Solar consciousness awakens',
            colorClass: 'stage-citrinitas',
            progressTarget: 100,
            elementsRequired: ['antimony'],
        },
        {
            key: 'rubedo',
            name: 'RUBEDO',
            latin: 'Rubedo — Coniunctio',
            subtitle: 'The Reddening — The Stone is born',
            colorClass: 'stage-rubedo',
            progressTarget: 100,
            elementsRequired: [],
        },
    ];

    // ── DOM References ───────────────────────────────────────────────────
    const dom = {
        circleContainer:      document.getElementById('circleContainer'),
        transmutationSvg:     document.getElementById('transmutationSvg'),
        planetaryRing:        document.getElementById('planetaryRing'),
        rotationIndicator:    document.getElementById('rotationIndicator'),
        stageLabel:           document.getElementById('stageLabel'),
        crucible:             document.getElementById('crucible'),
        crucibleLiquid:       document.getElementById('crucibleLiquid'),
        crucibleFlame:        document.getElementById('crucibleFlame'),
        dissolveSymbol1:      document.getElementById('dissolveSymbol1'),
        dissolveSymbol2:      document.getElementById('dissolveSymbol2'),
        dissolveSymbol3:      document.getElementById('dissolveSymbol3'),
        combineBtn:           document.getElementById('combineBtn'),
        logEntries:           document.getElementById('logEntries'),
        combinationLog:       document.getElementById('combinationLog'),
        philosopherStone:     document.getElementById('philosopherStone'),
        stoneReveal:          document.getElementById('stoneReveal'),
        stoneGlow:            document.getElementById('stoneGlow'),
        stoneStageLabel:      document.getElementById('stoneStageLabel'),
        stagesContainer:      document.querySelector('.stages-container'),
        overallFill:          document.getElementById('overallFill'),
        completionPercent:    document.getElementById('completionPercent'),
        manuscriptBody:       document.getElementById('manuscriptBody'),
        emberCanvas:          document.getElementById('emberCanvas'),
        celestialOverlay:     document.getElementById('celestialOverlay'),
        mortarContainer:      document.getElementById('mortarContainer'),
        mortar:               document.getElementById('mortar'),
        mortarBowl:           document.querySelector('.mortar-bowl'),
        mortarPestle:         document.getElementById('mortarPestle'),
        mortarIngredients:    document.getElementById('mortarIngredients'),
        controlsPanel:        document.getElementById('controlsPanel'),
        statusToast:          document.getElementById('statusToast'),
        toggleCandles:        document.getElementById('toggleCandles'),
        toggleCelestial:      document.getElementById('toggleCelestial'),
        advanceStage:         document.getElementById('advanceStage'),
        resetWork:            document.getElementById('resetWork'),
    };

    // Stage DOM elements
    const stageElements = [
        document.getElementById('stageNigredo'),
        document.getElementById('stageAlbedo'),
        document.getElementById('stageCitrinitas'),
        document.getElementById('stageRubedo'),
    ];

    const stageFills = [
        document.getElementById('nigredoFill'),
        document.getElementById('albedoFill'),
        document.getElementById('citrinitasFill'),
        document.getElementById('rubedoFill'),
    ];

    // ── Ember Particle System ────────────────────────────────────────────
    const emberCtx = dom.emberCanvas.getContext('2d');
    let embers = [];
    let canvasW, canvasH;

    function resizeCanvas() {
        canvasW = dom.emberCanvas.width = window.innerWidth;
        canvasH = dom.emberCanvas.height = window.innerHeight;
    }

    class Ember {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * canvasW;
            this.y = initial ? Math.random() * canvasH : -10;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = 0.3 + Math.random() * 0.8;
            this.life = 200 + Math.random() * 400;
            this.maxLife = this.life;
            this.size = 1 + Math.random() * 2.5;
            const r = 200 + Math.floor(Math.random() * 55);
            const g = 80 + Math.floor(Math.random() * 80);
            const b = Math.floor(Math.random() * 40);
            this.color = `${r},${g},${b}`;
            this.gravity = 0.005 + Math.random() * 0.01;
            this.flicker = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx + Math.sin(this.flicker) * 0.3;
            this.y -= this.vy;
            this.vy -= this.gravity;
            this.life--;
            this.flicker += 0.05;
        }

        draw(ctx) {
            const alpha = Math.max(0, this.life / this.maxLife);
            const fadeOut = alpha < 0.3 ? alpha / 0.3 : 1;
            const size = this.size * (0.5 + fadeOut * 0.5);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, size * 3
            );
            gradient.addColorStop(0, `rgba(${this.color},${alpha * 0.9})`);
            gradient.addColorStop(0.3, `rgba(${this.color},${alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(${this.color},0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - size * 3, this.y - size * 3, size * 6, size * 6);
        }
    }

    function initEmbers() {
        embers = [];
        for (let i = 0; i < 60; i++) {
            const e = new Ember();
            e.life = Math.random() * e.maxLife;
            embers.push(e);
        }
    }

    function animateEmbers() {
        emberCtx.clearRect(0, 0, canvasW, canvasH);
        for (const e of embers) {
            e.update();
            e.draw(emberCtx);
            if (e.life <= 0) e.reset(false);
        }
        requestAnimationFrame(animateEmbers);
    }

    // ── Toast System ─────────────────────────────────────────────────────
    let toastTimeout = null;

    function showToast(message, subtitle = '', duration = 3500) {
        const toast = dom.statusToast;
        clearTimeout(toastTimeout);

        // Support rich content
        toast.innerHTML = message;
        if (subtitle) {
            const sub = document.createElement('span');
            sub.className = 'toast-subtitle';
            sub.textContent = subtitle;
            toast.appendChild(sub);
        }

        toast.classList.add('visible');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, duration);
    }

    // ── Element Selection ────────────────────────────────────────────────
    const elementData = {
        sulfur:     { symbol: '🜍', name: 'Sulfur', phase: 'fire',      latin: 'Anima' },
        mercury:    { symbol: '☿',  name: 'Mercury', phase: 'air',    latin: 'Spiritus' },
        salt:       { symbol: '🜔',  name: 'Salt', phase: 'earth',    latin: 'Corpus' },
        antimony:   { symbol: '⚣',  name: 'Antimony', phase: 'quintessence', latin: 'Rebis Seed' },
    };

    document.querySelectorAll('.element-symbol').forEach(el => {
        el.addEventListener('click', () => {
            const key = el.dataset.element;
            const phase = el.dataset.phase;

            if (state.selectedElements.has(key)) {
                state.selectedElements.delete(key);
                el.classList.remove('selected');
            } else {
                // Max 3 selected
                if (state.selectedElements.size >= 3) {
                    showToast('⚠ Too many elements', 'The crucible can hold only three components');
                    return;
                }
                state.selectedElements.add(key);
                el.classList.add('selected');
            }
            updateCombinationLog();
        });
    });

    function updateCombinationLog() {
        const entries = dom.logEntries;
        entries.innerHTML = '';

        if (state.selectedElements.size === 0) {
            entries.innerHTML = '<span class="log-empty">No ingredient yet...</span>';
            return;
        }

        state.selectedElements.forEach(key => {
            const data = elementData[key];
            const entry = document.createElement('span');
            entry.className = 'log-entry';
            entry.textContent = `${data.symbol} ${data.name}`;
            entry.title = data.latin;
            entries.appendChild(entry);
        });
    }

    // ── Combine Elements (Conjunctio) ────────────────────────────────────
    dom.combineBtn.addEventListener('click', () => {
        if (state.selectedElements.size === 0) {
            showToast('⚠ No Elements Selected', 'Select elements from the palette first');
            return;
        }

        if (state.workComplete) {
            showToast('✦ The Great Work is Complete', 'The Stone has been perfected');
            return;
        }

        if (state.isGrinding) {
            showToast('⚠ Grinding in Progress', 'Wait for the mortar to finish');
            return;
        }

        const currentStage = STAGES[state.stage];
        const hasRequired = currentStage.elementsRequired.every(
            req => state.selectedElements.has(req)
        );

        if (!hasRequired && state.stage < 3) {
            showToast('⚠ Incorrect Combination', currentStage.subtitle);
            dom.combineBtn.classList.add('alchemical-btn');
            dom.combineBtn.style.animation = 'none';
            void dom.combineBtn.offsetWidth; // Force reflow
            dom.combineBtn.style.animation = 'shake 0.4s ease 2';
            setTimeout(() => dom.combineBtn.style.animation = '', 1000);
            return;
        }

        performConjunction();
    });

    function performConjunction() {
        const btn = dom.combineBtn;
        btn.disabled = true;

        showToast(
            `⚗ CONJUNCTIO — ${STAGES[state.stage].name}`,
            STAGES[state.stage].subtitle,
            3000
        );

        // Intensify crucible animation
        intensifyCrucible();

        // Start circle rotation if not already
        if (!state.isRotating) {
            startCircleRotation();
        }

        // Progress the current stage
        let progress = 0;
        const increment = state.stage === 3 ? 5 : 10;
        const interval = setInterval(() => {
            progress += increment;
            state.stageProgress[state.stage] = Math.min(progress, 100);
            updateProgressUI();

            // Stage transition effects
            if (progress === 30) {
                dissolveElementsInCrucible();
            }
            if (progress === 60) {
                showToast(
                    getStageMidMessage(state.stage),
                    '🔥 The work proceeds...',
                    2500
                );
            }
            if (progress >= 100) {
                clearInterval(interval);
                completeCurrentStage();
                btn.disabled = false;
                calmCrucible();
            }
        }, 200 + Math.random() * 100);

        // Clear selection
        state.selectedElements.clear();
        document.querySelectorAll('.element-symbol').forEach(el => el.classList.remove('selected'));
        updateCombinationLog();
    }

    function getStageMidMessage(stageIndex) {
        const messages = [
            { msg: '🔮 Nigredo deepens...', sub: 'The crow descends — all must dissolve' },
            { msg: '🌙 Albedo washes clean...', sub: 'Lunar silver purifies the work' },
            { msg: '☉ Solar dawn approaches...', sub: 'The tincture begins to manifest' },
            { msg: '🔥 Rubedo ascends!', sub: 'The marriage of Sol and Luna' },
        ];
        return messages[stageIndex] || messages[0];
    }

    // ── Crucible Animations ──────────────────────────────────────────────
    function intensifyCrucible() {
        dom.crucibleLiquid.style.transition = 'background 1s ease';
        dom.crucible.style.transform = 'scale(1.05)';
        dom.crucible.style.transition = 'transform 0.5s ease';

        // Add more bubbles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.style.left = `${10 + Math.random() * 80}%`;
                bubble.style.animationDelay = `${Math.random() * 2}s`;
                bubble.style.animationDuration = `${1.5 + Math.random()}s`;
                dom.crucibleLiquid.appendChild(bubble);
                setTimeout(() => bubble.remove(), 4000);
            }, i * 200);
        }
    }

    function calmCrucible() {
        setTimeout(() => {
            dom.crucible.style.transform = 'scale(1)';
        }, 1000);
    }

    function dissolveElementsInCrucible() {
        const symbols = [dom.dissolveSymbol1, dom.dissolveSymbol2, dom.dissolveSymbol3];
        symbols.forEach(sym => {
            sym.style.transition = 'all 1.5s ease';
            sym.style.opacity = '0';
            sym.style.transform = 'scale(0.2) rotate(180deg)';
        });

        setTimeout(() => {
            // Reappear with new character
            symbols.forEach(sym => {
                sym.style.transition = 'all 1s ease';
                sym.style.opacity = '0.7';
                sym.style.transform = 'scale(1) rotate(0deg)';
            });
        }, 2000);
    }

    // ── Stage Progression ────────────────────────────────────────────────
    function completeCurrentStage() {
        if (state.workComplete) return;

        const current = state.stage;
        state.stageProgress[current] = 100;

        // Mark stage as completed
        const stageEl = stageElements[current];
        stageEl.classList.remove('active');
        stageEl.classList.add('completed');
        stageEl.querySelector('.stage-icon').classList.remove(nigredoColor, albedoColor, citrinitasColor, rubedoColor);

        // Update stone in transmutation circle
        updatePhilosopherStoneInCircle(current);

        // Update overall progress
        updateProgressUI();

        // Reveal manuscript sections
        revealManuscriptSections(current);

        // Stage transition
        if (current < 3) {
            // Advance to next stage
            setTimeout(() => {
                state.stage = current + 1;
                applyStageVisuals(state.stage);

                const next = STAGES[state.stage];
                showToast(
                    `${next.name}`,
                    next.subtitle,
                    4000
                );

                // Activate next stage element
                if (state.stage < 4) {
                    stageElements[state.stage].classList.add('active');
                }

                // Update stone stage label
                dom.stoneStageLabel.textContent = next.name;

                updateStageLabel();
            }, 1500);
        } else {
            // The Great Work is Complete!
            state.workComplete = true;
            completeGreatWork();
        }
    }

    function applyStageVisuals(stageIndex) {
        const stage = STAGES[stageIndex];

        // Remove previous stage class from body
        document.body.classList.remove(
            'stage-nigredo', 'stage-albedo', 'stage-citrinitas', 'stage-rubedo'
        );

        // Add current stage class
        document.body.classList.add(stage.colorClass);

        // Update stage label
        updateStageLabel();

        // Update transmutation circle colors
        updateCircleForStage(stageIndex);

        // Update stone appearance
        updatePhilosopherStoneDisplay(stageIndex);
    }

    function updateStageLabel() {
        const stage = STAGES[state.stage];
        const stageName = dom.stageLabel.querySelector('.stage-name');
        const stageLatin = dom.stageLabel.querySelector('.stage-latin');
        stageName.textContent = stage.name;
        stageLatin.textContent = stage.latin;
    }

    function updateCircleForStage(stageIndex) {
        const circle = dom.transmutationCircle;

        // Update planetary ring colors based on stage
        const planetSymbols = circle.querySelectorAll('.planet-symbol');
        const planetCircles = circle.querySelectorAll('.planet-circle');

        switch (stageIndex) {
            case 0: // Nigredo
                planetSymbols.forEach(s => { s.style.fill = '#5a4a3a'; });
                planetCircles.forEach(c => { c.style.stroke = '#4a3f35'; });
                break;
            case 1: // Albedo
                planetSymbols.forEach(s => { s.style.fill = '#b0b0c0'; });
                planetCircles.forEach(c => { c.style.stroke = '#8a8a9a'; });
                break;
            case 2: // Citrinitas
                planetSymbols.forEach(s => { s.style.fill = '#FFD700'; });
                planetCircles.forEach(c => { c.style.stroke = '#D4AF37'; });
                break;
            case 3: // Rubedo
                planetSymbols.forEach(s => { s.style.fill = '#ff6b6b'; });
                planetCircles.forEach(c => { c.style.stroke = '#cc4444'; });
                break;
        }

        // Update cardinal elements
        const cardinalSymbols = circle.querySelectorAll('.cardinal-symbol');
        const cardinalLabels = circle.querySelectorAll('.cardinal-label');

        switch (stageIndex) {
            case 0:
                cardinalSymbols.forEach(s => { s.style.fill = '#5a4a3a'; });
                cardinalLabels.forEach(l => { l.style.fill = '#6a5a4a'; });
                break;
            case 1:
                cardinalSymbols.forEach(s => { s.style.fill = '#b0b0c0'; });
                cardinalLabels.forEach(l => { l.style.fill = '#9a9aaa'; });
                break;
            case 2:
                cardinalSymbols.forEach(s => { s.style.fill = '#FFD700'; });
                cardinalLabels.forEach(l => { l.style.fill = '#D4AF37'; });
                break;
            case 3:
                cardinalSymbols.forEach(s => { s.style.fill = '#ff6b6b'; });
                cardinalLabels.forEach(l => { l.style.fill = '#cc5555'; });
                break;
        }
    }

    // ── Philosopher's Stone Updates ──────────────────────────────────────
    function updatePhilosopherStoneInCircle(stageIndex) {
        const stone = dom.philosopherStone;
        const base = stone.querySelector('.stone-base');
        const inner = stone.querySelector('.stone-inner');
        const symbol = stone.querySelector('.stone-symbol');

        switch (stageIndex) {
            case 0:
                base.style.stroke = '#3a3020';
                base.style.strokeWidth = '2';
                inner.style.fill = '#1a1210';
                inner.style.stroke = '#4a3f35';
                symbol.style.fill = '#5a4a3a';
                break;
            case 1:
                base.style.stroke = '#b0b0c0';
                base.style.strokeWidth = '1.5';
                inner.style.fill = 'rgba(200,200,210,0.2)';
                inner.style.stroke = '#b0b0c0';
                symbol.style.fill = '#b0b0c0';
                break;
            case 2:
                base.style.stroke = '#FFD700';
                base.style.strokeWidth = '2';
                inner.style.fill = 'rgba(212,175,55,0.15)';
                inner.style.stroke = '#FFD700';
                symbol.style.fill = '#FFD700';
                break;
            case 3:
                base.style.stroke = '#ff6b6b';
                base.style.strokeWidth = '2.5';
                inner.style.fill = 'rgba(255,107,107,0.15)';
                inner.style.stroke = '#ff6b6b';
                symbol.style.fill = '#ff6b6b';
                // Materialize glow
                materializeStoneInCircle();
                break;
        }
    }

    function materializeStoneInCircle() {
        const stone = dom.philosopherStone;
        stone.style.filter = 'drop-shadow(0 0 20px rgba(255,215,0,0.6))';

        // Animate the stone symbol changing
        const symbol = stone.querySelector('.stone-symbol');
        const symbols = ['⬥', '✦', '☽', '☉', '⚗', '⬥'];
        let idx = 0;
        const cycle = setInterval(() => {
            symbol.textContent = symbols[idx];
            idx++;
            if (idx >= symbols.length) {
                symbol.textContent = '⬥';
                clearInterval(cycle);
            }
        }, 200);
    }

    function updatePhilosopherStoneDisplay(stageIndex) {
        const stone = dom.stoneReveal;
        const outer = stone.querySelector('.stone-outer');
        const glyph = stone.querySelector('.stone-glyph');

        stone.className = 'stone-reveal visible';

        switch (stageIndex) {
            case 0:
                outer.style.background = 'radial-gradient(circle at 35% 35%, #4a3f35, #1a1210)';
                outer.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
                glyph.style.color = '#2a2018';
                break;
            case 1:
                outer.style.background = 'radial-gradient(circle at 35% 35%, #ffffff, #c0c0c0, #8a8a8a)';
                outer.style.boxShadow = '0 0 30px rgba(192,192,192,0.4)';
                glyph.style.color = '#2a2a2a';
                break;
            case 2:
                outer.style.background = 'radial-gradient(circle at 35% 35%, #FFE44D, var(--gold), var(--copper))';
                outer.style.boxShadow = '0 0 40px rgba(212,175,55,0.6)';
                glyph.style.color = '#3a2a08';
                break;
            case 3:
                outer.style.background = 'radial-gradient(circle at 35% 35%, #ff8e8e, var(--blood-red), #5a0f0f)';
                outer.style.boxShadow = '0 0 60px rgba(139,26,26,0.6), 0 0 100px rgba(255,100,100,0.2)';
                glyph.style.color = '#2a0a0a';
                break;
        }
    }

    // ── Progress UI ──────────────────────────────────────────────────────
    function updateProgressUI() {
        // Individual stage bars
        for (let i = 0; i < 4; i++) {
            const pct = state.stageProgress[i];
            stageFills[i].style.width = `${pct}%`;
        }

        // Overall progress
        const completed = state.stageProgress.filter(p => p === 100).length;
        const overall = (state.stageProgress.reduce((a, b) => a + b, 0) / 4);
        dom.overallFill.style.width = `${overall}%`;
        dom.completionPercent.textContent = Math.round(overall);

        // Update connector styles
        for (let i = 0; i < 3; i++) {
            const connector = stageElements[i].querySelector('.stage-connector');
            // Handled by CSS sibling selectors
        }
    }

    // ── Manuscript Reveal ────────────────────────────────────────────────
    function revealManuscriptSections(stageIndex) {
        const sections = [
            [document.getElementById('msSection1')],
            [document.getElementById('msSection2')],
            [document.getElementById('msSection3')],
            [document.getElementById('msSection4'), document.getElementById('msSection5')],
            [document.getElementById('msSection6')],
        ];

        // Reveal sections up to current stage + 1
        const sectionsToReveal = sections.slice(0, stageIndex + 2);
        for (const group of sectionsToReveal) {
            for (const section of group) {
                if (section) section.classList.add('revealed');
            }
        }

        // Auto-scroll manuscript to reveal
        const lastRevealed = sectionsToReveal[sectionsToReveal.length - 1];
        if (lastRevealed && lastRevealed.length > 0) {
            setTimeout(() => {
                lastRevealed[lastRevealed.length - 1].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 500);
        }
    }

    // ── Circle Rotation ──────────────────────────────────────────────────
    function startCircleRotation() {
        state.isRotating = true;
        dom.circleContainer.classList.add('rotating');
        dom.rotationIndicator.style.opacity = '0';

        animateCircleRotation();
        showToast('🔄 The Circle Turns', 'Solve et Coagula — the work begins');
    }

    function stopCircleRotation() {
        state.isRotating = false;
        dom.circleContainer.classList.remove('rotating');
        dom.rotationIndicator.style.opacity = '1';
        showToast('⏹ The Circle Rests', 'Conjunctio paused');
    }

    function animateCircleRotation() {
        if (!state.isRotating && state.stageProgress[state.stage] >= 100) return;

        const speed = state.stage === 3 ? 0.3 : 0.5;
        state.circleRotation += speed;
        state.planetaryRotation -= speed * 0.3;
        state.squareRotation += speed * 0.15;

        dom.transmutationSvg.style.transform = `rotate(${state.circleRotation}deg)`;
        dom.planetaryRing.style.transform = `rotate(${state.planetaryRotation}deg)`;

        const squares = dom.transmutationSvg.querySelectorAll('.sacred-square');
        squares.forEach(sq => {
            sq.style.transform = `rotate(${state.squareRotation}deg)`;
        });

        requestAnimationFrame(animateCircleRotation);
    }

    // ── Mortar and Pestle ────────────────────────────────────────────────
    let grindTimeout = null;
    let grindCount = 0;

    dom.mortar.addEventListener('click', () => {
        if (state.isGrinding) return;
        state.isGrinding = true;
        grindCount = 0;

        dom.mortar.classList.add('mortar-grinding');
        showToast('⚗ Grinding Prima Materia', 'The mortar and pestle work...');

        // Grind for a duration, then stop
        grindTimeout = setTimeout(() => {
            dom.mortar.classList.remove('mortar-grinding');
            state.isGrinding = false;
            grindCount = 0;
            showToast('✦ Materia Prima Ground', 'The ingredients are ready for the crucible');

            // Flash the ingredients in the mortar
            const items = dom.mortarIngredients.querySelectorAll('.mortar-item');
            items.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
        }, 3000);
    });

    // ── Controls ─────────────────────────────────────────────────────────
    dom.toggleCandles.addEventListener('click', () => {
        state.candlelight = !state.candlelight;
        dom.toggleCandles.classList.toggle('active', state.candlelight);

        if (state.candlelight) {
            document.body.classList.add('candlelight');
            showToast('🕯 Candlelight Illuminates', 'Shadows dance across the workbench');
        } else {
            document.body.classList.remove('candlelight');
            showToast('🕯 Darkness Returns', 'The candles are extinguished');
        }
    });

    dom.toggleCelestial.addEventListener('click', () => {
        state.celestialVisible = !state.celestialVisible;
        dom.toggleCelestial.classList.toggle('active', state.celestialVisible);
        dom.celestialOverlay.classList.toggle('hidden', !state.celestialVisible);

        showToast(
            state.celestialVisible ? '✦ Stars Revealed' : '✦ Veil Drawn',
            state.celestialVisible ? 'The celestial map shines once more' : 'The heavens are concealed'
        );
    });

    dom.advanceStage.addEventListener('click', () => {
        if (state.workComplete) {
            showToast('✦ The Great Work is Complete', 'All stages fulfilled');
            return;
        }

        // Check if current stage is complete
        if (state.stageProgress[state.stage] < 100) {
            showToast(
                '⚠ The Stage is Not Yet Complete',
                `Complete the ${STAGES[state.stage].name} conjunctio first`
            );
            // Flash the stage indicator
            stageElements[state.stage].style.animation = 'iconPulse 0.3s ease 3';
            setTimeout(() => stageElements[state.stage].style.animation = '', 1000);
            return;
        }

        if (state.stage < 3) {
            const nextStage = state.stage + 1;
            state.stage = nextStage;

            applyStageVisuals(nextStage);
            stageElements[nextStage].classList.add('active');

            const stage = STAGES[nextStage];
            showToast(
                `${stage.name}`,
                stage.subtitle,
                4000
            );

            updateStageLabel();
            updateProgressUI();
            revealManuscriptSections(nextStage - 1);
            updatePhilosopherStoneDisplay(nextStage);
        } else {
            completeGreatWork();
        }
    });

    dom.resetWork.addEventListener('click', () => {
        if (!confirm('Abandon the Great Work? All progress will be lost.')) return;

        resetAll();
    });

    function resetAll() {
        state.stage = 0;
        state.stageProgress = [0, 0, 0, 0];
        state.selectedElements.clear();
        state.isRotating = false;
        state.workComplete = false;
        state.circleRotation = 0;
        state.planetaryRotation = 0;
        state.squareRotation = 45;

        // Reset UI
        dom.circleContainer.classList.remove('rotating');
        document.body.classList.remove('stage-nigredo', 'stage-albedo', 'stage-citrinitas', 'stage-rubedo');
        document.body.classList.add('stage-nigredo');

        stageElements.forEach((el, i) => {
            el.classList.remove('completed');
            el.classList.toggle('active', i === 0);
        });

        updateProgressUI();
        updateStageLabel();
        updateCombinationLog();
        dom.combineBtn.disabled = false;

        // Reset stone
        dom.stoneReveal.className = 'stone-reveal';
        updatePhilosopherStoneDisplay(0);
        updatePhilosopherStoneInCircle(0);

        // Reset manuscript
        document.querySelectorAll('.manuscript-section').forEach(s => s.classList.remove('revealed'));
        document.getElementById('msSection1').classList.add('revealed');

        // Reset transmutation circle colors
        updateCircleForStage(0);

        // Stop rotation animation
        dom.transmutationSvg.style.transform = '';
        dom.planetaryRing.style.transform = '';
        const squares = dom.transmutationSvg.querySelectorAll('.sacred-square');
        squares.forEach(sq => { sq.style.transform = 'rotate(45deg)'; });

        showToast('⟳ The Great Work Resets', 'From the ashes, the prima materia returns');
    }

    // ── Complete the Great Work ──────────────────────────────────────────
    function completeGreatWork() {
        state.workComplete = true;
        state.stageProgress[3] = 100;
        updateProgressUI();

        // Dramatic visual effect
        showToast(
            '✦✦✦ Lapis Philosophorum ✦✦✦',
            'The Great Work is accomplished — As Above, So Below',
            6000
        );

        // Full stone materialization
        dom.stoneReveal.classList.add('visible');
        dom.stoneGlow.style.animation = 'glowPulse 1s ease-in-out infinite';

        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle, rgba(255,215,0,0.4), transparent 70%);
            z-index: 99; pointer-events: none;
            animation: flashBurst 2s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 2500);

        // Add flash keyframe dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flashBurst {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        updatePhilosopherStoneDisplay(3);
        updatePhilosopherStoneInCircle(3);

        // Reveal final manuscript
        revealManuscriptSections(3);

        // Change combine button
        dom.combineBtn.innerHTML = '<span class="btn-icon">⬥</span><span class="btn-text">OPVS COMPLETVM</span>';

        // Continuous rotation celebration
        dom.circleContainer.classList.add('rotating');
        state.isRotating = true;
        animateCircleRotation();
    }

    // ── Scroll-based Manuscript Reveal ───────────────────────────────────
    let scrollRevealed = false;
    function handleScroll() {
        const rect = dom.manuscriptBody.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7 && !scrollRevealed && state.stage >= 0) {
            scrollRevealed = true;
            revealManuscriptSections(state.stage);
        }
    }

    // ── Planetary Node Hover Tooltips ────────────────────────────────────
    function initPlanetaryTooltips() {
        const nodes = dom.transmutationSvg.querySelectorAll('.planetary-node');
        const planetInfo = {
            saturn:  { name: 'Saturn ♄', metal: 'Lead', text: 'Nigredo — The First Matter' },
            jupiter: { name: 'Jupiter ♃', metal: 'Tin',  text: 'Expansion and benevolence' },
            mars:    { name: 'Mars ♂',    metal: 'Iron',  text: 'The force of transformation' },
            sun:     { name: 'Sol ☉',     metal: 'Gold',  text: 'The perfection of the Red Stone' },
            venus:   { name: 'Venus ♀',   metal: 'Copper', text: 'Love dissolves all resistance' },
            mercury: { name: 'Mercury ☿', metal: 'Quicksilver', text: 'The volatile spirit mediator' },
            moon:    { name: 'Luna ☽',    metal: 'Silver', text: 'Reflection and purification' },
        };

        nodes.forEach(node => {
            const planet = node.dataset.planet;
            const info = planetInfo[planet];
            if (!info) return;

            node.style.cursor = 'pointer';

            node.addEventListener('mouseenter', (e) => {
                showToast(`☽ ${info.name} — ${info.metal}`, info.text, 3000);
                node.querySelector('.planet-circle').style.stroke = 'var(--gold-bright)';
            });

            node.addEventListener('mouseleave', () => {
                node.querySelector('.planet-circle').style.stroke = '';
            });
        });
    }

    // ── Cardinal Element Interactions ────────────────────────────────────
    function initCardinalElements() {
        const elements = dom.transmutationSvg.querySelectorAll('.cardinal-element');
        const elementNames = {
            fire:  'IGNIS — The Red Lion, sulfur of the sages',
            air:   'AER — The Mercury of the Philosophers',
            water: 'AQUA — The universal solvent',
            earth: 'TERRA — The Body, the vessel of transformation',
        };

        elements.forEach(el => {
            const elem = el.dataset.element;
            el.style.cursor = 'pointer';

            el.addEventListener('mouseenter', () => {
                showToast(`🜁 ${elementNames[elem] || elem}`, '', 2500);
            });

            el.addEventListener('click', () => {
                // Pulse animation
                el.style.transition = 'transform 0.3s ease';
                el.style.transform = 'scale(1.3)';
                setTimeout(() => { el.style.transform = 'scale(1)'; }, 400);
            });
        });
    }

    // ── Ambient Sound-like Visual Feedback ────────────────────────────────
    // Simulate "singing" bowls with subtle canvas pulses
    function createRippleEffect(x, y, color) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed; left: ${x}px; top: ${y}px;
            width: 10px; height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color}40, transparent);
            pointer-events: none;
            z-index: 50;
            animation: rippleExpand 1.5s ease-out forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1600);

        // Add keyframes if not present
        if (!document.getElementById('rippleStyle')) {
            const style = document.createElement('style');
            style.id = 'rippleStyle';
            style.textContent = `
                @keyframes rippleExpand {
                    0% { width:10px; height:10px; opacity:1; transform:translate(-50%,-50%); }
                    100% { width:200px; height:200px; opacity:0; transform:translate(-50%,-50%); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ── Element Click Ripple ──────────────────────────────────────────────
    document.querySelectorAll('.element-symbol').forEach(el => {
        el.addEventListener('click', (e) => {
            const rect = el.getBoundingClientRect();
            const colors = {
                sulfur:    'rgba(212, 175, 55, 0.5)',
                mercury:   'rgba(192, 192, 192, 0.5)',
                salt:      'rgba(200, 200, 200, 0.3)',
                antimony:  'rgba(184, 115, 51, 0.5)',
            };
            createRippleEffect(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                colors[el.dataset.element] || 'rgba(212,175,55,0.5)'
            );
        });
    });

    // ── Floating Alchemical Symbols ──────────────────────────────────────
    function spawnFloatingSymbol() {
        const symbols = '☿🜍🜔⚣✦☽☉♂♀♄♃';
        const sym = document.createElement('span');
        sym.className = 'floating-symbol';
        sym.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        sym.style.cssText = `
            position: fixed;
            font-size: ${1.5 + Math.random() * 1.5}rem;
            left: ${Math.random() * 100}vw;
            top: ${100 + Math.random() * 50}vh;
            opacity: 0;
            color: var(--gold-dim);
            z-index: 2;
            pointer-events: none;
            animation: symbolFloat ${4 + Math.random() * 6}s ease-in-out forwards;
            filter: drop-shadow(0 0 5px rgba(212,175,55,0.3));
        `;
        document.body.appendChild(sym);
        setTimeout(() => sym.remove(), 10000);
    }

    // Add floating symbol animation to style
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes symbolFloat {
            0% { opacity: 0; transform: translateY(0) rotate(0deg); }
            10% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0; transform: translateY(-100vh) rotate(${Math.random() > 0.5 ? '' : '-'}180deg); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(floatStyle);

    // Spawn occasional floating symbols
    setInterval(spawnFloatingSymbol, 8000);

    // ── Initialization ───────────────────────────────────────────────────
    function init() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initial setup
        stageElements[0].classList.add('active');
        document.body.classList.add('stage-nigredo');
        updateProgressUI();
        updateStageLabel();
        revealManuscriptSections(-1); // Reveal first section
        initPlanetaryTooltips();
        initCardinalElements();
        updateCombinationLog();
        updatePhilosopherStoneDisplay(0);
        updatePhilosopherStoneInCircle(-1);

        // Start ember particles
        initEmbers();
        animateEmbers();

        // Periodic ember burst
        setInterval(() => {
            for (let i = 0; i < 3; i++) {
                const e = new Ember();
                e.y = canvasH + 10;
                embers.push(e);
            }
            if (embers.length > 100) embers.splice(0, 30);
        }, 5000);

        // Initial toast
        setTimeout(() => {
            showToast(
                '⧖ Welcome, Adept ⧖',
                'The Great Work of Transmutation awaits. Combine the elements...',
                5000
            );
        }, 1000);

        // Subtle periodic candle flicker reminder
        setInterval(() => {
            if (!state.candlelight && Math.random() > 0.7) {
                // Occasional faint ember glow
                dom.emberCanvas.style.opacity = '0.5';
                setTimeout(() => { dom.emberCanvas.style.opacity = '1'; }, 500);
            }
        }, 8000);
    }

    // ── Launch ───────────────────────────────────────────────────────────
    init();

})();
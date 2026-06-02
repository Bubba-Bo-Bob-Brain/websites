/* =============================================
   ARCANUM MAGNUM — Alchemical Laboratory Scripts
   ============================================= */

(function() {

    // ============================================
    // STATE
    // ============================================
    const state = {
        currentStage: 0,
        stages: ['nigredo', 'albedo', 'citrinitas', 'rubedo'],
        stageNames: ['NIGREDO', 'ALBEDO', 'CITRINITAS', 'RUBEDO'],
        stageLatin: ['Blackening', 'Whitening', 'Yellowing', 'Reddening'],
        stageColors: {
            nigredo: { primary: '#0d0d0d', accent: '#1a1a1a' },
            albedo: { primary: '#e8e0d0', accent: '#d4c9b0' },
            citrinitas: { primary: '#d4a017', accent: '#f0c040' },
            rubedo: { primary: '#8b1a1a', accent: '#c03030' }
        },
        crucibleElements: [],
        stoneProgress: 0,
        mortarGrindCount: 0,
        particleCount: 0
    };

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const colors = ['#c9a84c', '#b87333', '#43a892', '#c0c0c0', '#8b6914'];
        const count = 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 15;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: 0;
            `;

            container.appendChild(particle);
        }
    }

    // ============================================
    // TRANSAMUTATION CIRCLE
    // ============================================
    function initTransmutationCircle() {
        const circle = document.getElementById('transmutationCircle');
        const rotor = document.getElementById('circleRotor');
        const stageIndicator = document.getElementById('stageIndicator');

        if (!circle || !rotor || !stageIndicator) return;

        let rotationAngle = 0;
        let stageProgress = 0;

        function rotateCircle() {
            rotationAngle += 0.2;
            rotor.style.transform = `rotate(${rotationAngle}deg)`;

            // Advance stage based on full rotations
            stageProgress += 0.2;
            if (stageProgress >= 360) {
                stageProgress = 0;
                advanceStage();
            }

            requestAnimationFrame(rotateCircle);
        }

        function advanceStage() {
            state.currentStage = (state.currentStage + 1) % 4;
            updateStage();
        }

        function updateStage() {
            const stage = state.stages[state.currentStage];
            const indicator = stageIndicator;

            indicator.querySelector('.stage-name').textContent = state.stageNames[state.currentStage];
            indicator.querySelector('.stage-latin').textContent = `"${state.stageLatin[state.currentStage]}"`;

            // Update circle colors based on stage
            const svg = circle.querySelector('.circle-svg');
            if (svg) {
                const goldElements = svg.querySelectorAll('[stroke="var(--gold)"]');
                const copperElements = svg.querySelectorAll('[stroke="var(--copper)"]');
                const silverElements = svg.querySelectorAll('[stroke="var(--silver)"]');

                goldElements.forEach(el => {
                    el.style.stroke = state.stageColors[stage].accent;
                });
                copperElements.forEach(el => {
                    el.style.stroke = state.stageColors[stage].primary;
                });
                silverElements.forEach(el => {
                    el.style.stroke = state.stageColors[stage].accent;
                });
            }

            // Update stone progress
            updateStoneProgress();
        }

        rotateCircle();
    }

    // ============================================
    // CRUCIBLE
    // ============================================
    function initCrucible() {
        const crucible = document.getElementById('crucible');
        const liquid = document.getElementById('crucibleLiquid');
        const bubblesContainer = document.getElementById('crucibleBubbles');
        const vaporContainer = document.getElementById('crucibleVapor');
        const combinationResult = document.getElementById('combinationResult');
        const buttons = document.querySelectorAll('.element-btn');

        if (!crucible || !liquid || !bubblesContainer) return;

        const elementProperties = {
            fire: { color: '#d4a017', symbol: '🜂', name: 'Ignis' },
            water: { color: '#4a7ba7', symbol: '🜄', name: 'Aqua' },
            earth: { color: '#5c4033', symbol: '🜃', name: 'Terra' },
            air: { color: '#c0c0c0', symbol: '🜁', name: 'Aer' },
            mercury: { color: '#8b8b8b', symbol: '☿', name: 'Mercurius' },
            sulfur: { color: '#cc6600', symbol: '⚗', name: 'Sulfur' },
            salt: { color: '#e8e8e8', symbol: '✦', name: 'Sal' }
        };

        const combinations = {
            'fire+water': 'Vapour — Aqua Calida',
            'fire+earth': 'Lava — Terra Ignita',
            'fire+air': 'Lightning — Fulgur',
            'water+earth': 'Mud — Lodos',
            'water+air': 'Rain — Pluvia',
            'earth+air': 'Dust — Pulvis',
            'mercury+sulfur': 'Quintessence — Spiritus',
            'mercury+salt': 'Amalgam — Coniunctio',
            'sulfur+salt': 'Vitriol — Aqua Regia',
            'fire+mercury': 'Cinnabar — Minium',
            'water+mercury': 'Quicksilver — Hydrargyrum',
            'fire+sulfur': 'Sulfur Volatile',
            'fire+salt': 'Alkali — Potassa',
            'water+sulfur': 'Sulfurous Acid',
            'water+salt': 'Brine — Salina',
            'earth+sulfur': 'Bitumen — Petroleum',
            'earth+salt': 'Alum — Salmiacum',
            'air+sulfur': 'Fumes — Nebulae',
            'air+salt': 'Aër fortis',
            'mercury+mercury': 'Mercury — Solubilis',
            'sulfur+sulfur': 'Sulfur — Purificatus',
            'salt+salt': 'Salt — Rectificatum'
        };

        function addBubble(color) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 8 + 4;
            bubble.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 80 + 10}%;
                bottom: 20%;
                border-color: ${color};
                animation-duration: ${Math.random() * 1.5 + 1}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            bubblesContainer.appendChild(bubble);
            setTimeout(() => bubble.remove(), 3000);
        }

        function addVapor() {
            const vapor = document.createElement('div');
            vapor.classList.add('vapor-cloud');
            const size = Math.random() * 40 + 20;
            vapor.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 60 + 20}%;
                top: ${Math.random() * 20}px;
                animation-duration: ${Math.random() * 2 + 3}s;
                animation-delay: ${Math.random() * 1}s;
            `;
            vaporContainer.appendChild(vapor);
            setTimeout(() => vapor.remove(), 5000);
        }

        function updateLiquidColor() {
            if (state.crucibleElements.length === 0) {
                liquid.style.background = 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 50%, #8b6914 100%)';
                return;
            }

            const colors = state.crucibleElements.map(e => elementProperties[e].color);
            const gradient = colors.map((c, i) => `${c} ${i * 25}%`).join(', ');
            liquid.style.background = `linear-gradient(180deg, ${gradient})`;
        }

        function checkCombination() {
            if (state.crucibleElements.length < 2) {
                combinationResult.textContent = '—';
                return;
            }

            const sorted = [...state.crucibleElements].sort();
            const key1 = `${sorted[0]}+${sorted[1]}`;
            const key2 = `${sorted[1]}+${sorted[0]}`;

            const result = combinations[key1] || combinations[key2] || 'Novum Elementum — Unknown';
            combinationResult.textContent = result;

            // Advance stone progress on combination
            if (state.crucibleElements.length >= 2) {
                state.stoneProgress = Math.min(100, state.stoneProgress + 5);
                updateStoneProgress();
            }
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const element = btn.dataset.element;
                if (!element || state.crucibleElements.includes(element)) return;

                state.crucibleElements.push(element);
                updateLiquidColor();
                checkCombination();

                // Bubble effects
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => addBubble(elementProperties[element].color), i * 100);
                }

                // Vapor effects
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => addVapor(), i * 200);
                }

                // Visual feedback
                btn.style.borderColor = elementProperties[element].color;
                btn.style.boxShadow = `0 0 15px ${elementProperties[element].color}40`;
                setTimeout(() => {
                    btn.style.borderColor = '';
                    btn.style.boxShadow = '';
                }, 600);
            });
        });
    }

    // ============================================
    // STAGE REVEAL ON SCROLL
    // ============================================
    function initStageReveal() {
        const stages = document.querySelectorAll('.stage');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 200);
                }
            });
        }, { threshold: 0.2 });

        stages.forEach(stage => observer.observe(stage));
    }

    // ============================================
    // MANUSCRIPT SCROLL REVEAL
    // ============================================
    function initManuscriptReveal() {
        const manuscript = document.getElementById('manuscript');
        if (!manuscript) return;

        const paragraphs = manuscript.querySelectorAll('.manuscript-paragraph');
        const marginalia = manuscript.querySelectorAll('.manuscript-marginalia');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });

        paragraphs.forEach((p, i) => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(20px)';
            p.style.transition = `all 0.8s ease ${i * 0.15}s`;
            observer.observe(p);
        });

        marginalia.forEach(m => {
            m.style.opacity = '0';
            m.style.transition = 'opacity 1s ease';
            observer.observe(m);
        });
    }

    // ============================================
    // MORTAR AND PESTLE
    // ============================================
    function initMortar() {
        const container = document.getElementById('mortarContainer');
        const pestle = document.getElementById('pestle');
        const output = document.getElementById('mortarOutput');
        const ingredients = document.getElementById('mortarIngredients');
        const instructions = document.querySelector('.mortar-instructions');

        if (!container || !pestle) return;

        let isDragging = false;
        let lastY = 0;
        let grindCount = 0;

        const groundIngredients = [
            'Pulvis Sapientiae — Powder of Wisdom',
            'Extractum Vitae — Extract of Life',
            'Tinctura Philosophica — Philosophical Tincture',
            'Ora Caeli — Heavenly Gold',
            'Elixir Mortalis — Mortal Elixir',
            'Quintessentia — Quintessence'
        ];

        function grind() {
            grindCount++;
            pestle.style.transform = `translateX(-50%) rotate(${Math.sin(Date.now() / 50) * 10}deg) translateY(${Math.sin(Date.now() / 100) * 5}px)`;

            // Add grinding particles
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--verdigris);
                border-radius: 50%;
                left: ${50 + Math.random() * 30 - 15}%;
                top: ${30 + Math.random() * 20}%;
                pointer-events: none;
                opacity: 0.6;
                animation: mortarGrindParticle 1s ease-out forwards;
            `;
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);

            // Change ingredient color as it grinds
            const hue = Math.min(360, grindCount * 15);
            ingredients.style.background = `radial-gradient(ellipse, 
                hsl(${hue}, 40%, 40%) 0%, 
                hsl(${hue + 30}, 50%, 25%) 50%,
                transparent 100%)`;

            // Show output every 5 grinds
            if (grindCount % 5 === 0) {
                output.textContent = groundIngredients[Math.min(grindCount / 5 - 1, groundIngredients.length - 1)];
                output.classList.add('visible');
                setTimeout(() => output.classList.remove('visible'), 3000);
            }

            // Update stone progress
            state.stoneProgress = Math.min(100, state.stoneProgress + 2);
            updateStoneProgress();
        }

        pestle.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastY = e.clientY;
            container.style.cursor = 'grabbing';
        });

        pestle.addEventListener('touchstart', (e) => {
            isDragging = true;
            lastY = e.touches[0].clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - lastY;
            if (Math.abs(deltaY) > 5) {
                grind();
                lastY = e.clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - lastY;
            if (Math.abs(deltaY) > 5) {
                grind();
                lastY = e.touches[0].clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Click to grind as well
        pestle.addEventListener('click', () => {
            grind();
            pestle.style.transform = `translateX(-50%) rotate(${Math.random() * 20 - 10}deg) translateY(-5px)`;
            setTimeout(() => {
                pestle.style.transform = 'translateX(-50%) rotate(0deg) translateY(0)';
            }, 150);
        });

        // Add mortar grind particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mortarGrindParticle {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-40px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // PHILOSOPHER'S STONE PROGRESS
    // ============================================
    function updateStoneProgress() {
        const progress = document.getElementById('stoneProgress');
        const labels = document.querySelectorAll('.progress-label');

        if (progress) {
            progress.style.width = `${state.stoneProgress}%`;

            // Change color based on progress
            if (state.stoneProgress < 25) {
                progress.style.background = 'linear-gradient(90deg, #0d0d0d, #1a1a1a)';
            } else if (state.stoneProgress < 50) {
                progress.style.background = 'linear-gradient(90deg, #1a1a1a, #e8e0d0)';
            } else if (state.stoneProgress < 75) {
                progress.style.background = 'linear-gradient(90deg, #e8e0d0, #d4a017)';
            } else {
                progress.style.background = 'linear-gradient(90deg, #d4a017, #c03030, #f0d878)';
            }
        }

        // Activate labels
        labels.forEach((label, i) => {
            const threshold = (i + 1) * 25;
            if (state.stoneProgress >= threshold - 10) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });

        // Update stone appearance
        const stoneInner = document.querySelector('.stone-inner');
        const stoneGlow = document.querySelector('.stone-glow');

        if (stoneInner) {
            if (state.stoneProgress < 25) {
                stoneInner.style.background = 'radial-gradient(circle at 35% 35%, #2a2a2a, #0d0d0d)';
            } else if (state.stoneProgress < 50) {
                stoneInner.style.background = 'radial-gradient(circle at 35% 35%, #e8e0d0, #8b6914)';
            } else if (state.stoneProgress < 75) {
                stoneInner.style.background = 'radial-gradient(circle at 35% 35%, #f0c040, #c9a84c)';
            } else {
                stoneInner.style.background = 'radial-gradient(circle at 35% 35%, #f0d878, #c9a84c, #8b1a1a)';
                stoneInner.style.boxShadow = `
                    inset -10px -10px 20px rgba(0,0,0,0.3),
                    inset 5px 5px 15px rgba(240,216,120,0.5),
                    0 0 50px rgba(240,216,120,0.5),
                    0 0 100px rgba(192,48,48,0.3)
                `;
            }
        }

        if (stoneGlow) {
            const glowIntensity = state.stoneProgress / 100;
            stoneGlow.style.opacity = 0.3 + glowIntensity * 0.7;
        }
    }

    // ============================================
    // CELESTIAL DIAGRAM INTERACTION
    // ============================================
    function initCelestialDiagram() {
        const diagram = document.getElementById('celestialDiagram');
        if (!diagram) return;

        const svg = diagram.querySelector('.celestial-svg');
        if (!svg) return;

        let isHovering = false;

        svg.addEventListener('mouseenter', () => {
            isHovering = true;
            svg.style.filter = 'drop-shadow(0 0 20px rgba(201, 168, 76, 0.3))';
        });

        svg.addEventListener('mouseleave', () => {
            isHovering = false;
            svg.style.filter = 'drop-shadow(0 0 10px rgba(201, 168, 76, 0.1))';
        });

        // Animate connecting lines
        const lines = svg.querySelectorAll('line');
        lines.forEach((line, i) => {
            line.style.animation = `celestialPulse 3s ease-in-out ${i * 0.5}s infinite`;
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes celestialPulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // AMBIENT EFFECTS
    // ============================================
    function initAmbientEffects() {
        // Periodic crucible bubbles
        setInterval(() => {
            const bubblesContainer = document.getElementById('crucibleBubbles');
            if (bubblesContainer && state.crucibleElements.length > 0) {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                const size = Math.random() * 6 + 3;
                bubble.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${Math.random() * 80 + 10}%;
                    bottom: 20%;
                    border-color: var(--gold);
                    animation-duration: ${Math.random() * 2 + 1}s;
                `;
                bubblesContainer.appendChild(bubble);
                setTimeout(() => bubble.remove(), 3000);
            }
        }, 2000);

        // Periodic vapor
        setInterval(() => {
            const vaporContainer = document.getElementById('crucibleVapor');
            if (vaporContainer) {
                const vapor = document.createElement('div');
                vapor.classList.add('vapor-cloud');
                const size = Math.random() * 30 + 15;
                vapor.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${Math.random() * 60 + 20}%;
                    top: 0;
                    animation-duration: ${Math.random() * 3 + 3}s;
                `;
                vaporContainer.appendChild(vapor);
                setTimeout(() => vapor.remove(), 5000);
            }
        }, 3000);
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    function initKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '1') addElementToCrucible('fire');
            if (e.key === '2') addElementToCrucible('water');
            if (e.key === '3') addElementToCrucible('earth');
            if (e.key === '4') addElementToCrucible('air');
            if (e.key === '5') addElementToCrucible('mercury');
            if (e.key === '6') addElementToCrucible('sulfur');
            if (e.key === '7') addElementToCrucible('salt');
            if (e.key === ' ') {
                e.preventDefault();
                advanceStageManually();
            }
        });
    }

    function addElementToCrucible(element) {
        const buttons = document.querySelectorAll('.element-btn');
        buttons.forEach(btn => {
            if (btn.dataset.element === element) {
                btn.click();
            }
        });
    }

    function advanceStageManually() {
        state.currentStage = (state.currentStage + 1) % 4;
        updateStageFromState();
    }

    function updateStageFromState() {
        const stage = state.stages[state.currentStage];
        const indicator = document.getElementById('stageIndicator');

        if (indicator) {
            indicator.querySelector('.stage-name').textContent = state.stageNames[state.currentStage];
            indicator.querySelector('.stage-latin').textContent = `"${state.stageLatin[state.currentStage]}"`;
        }

        // Update circle colors
        const circle = document.getElementById('transmutationCircle');
        const svg = circle?.querySelector('.circle-svg');
        if (svg) {
            const goldElements = svg.querySelectorAll('[stroke="var(--gold)"]');
            const copperElements = svg.querySelectorAll('[stroke="var(--copper)"]');
            goldElements.forEach(el => el.style.stroke = state.stageColors[stage].accent);
            copperElements.forEach(el => el.style.stroke = state.stageColors[stage].primary);
        }

        state.stoneProgress = Math.min(100, state.stoneProgress + 15);
        updateStoneProgress();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        createParticles();
        initTransmutationCircle();
        initCrucible();
        initStageReveal();
        initManuscriptReveal();
        initMortar();
        initCelestialDiagram();
        initAmbientEffects();
        initKeyboardControls();

        // Initial stone progress update
        updateStoneProgress();

        console.log('✦ Arcanum Magnum initialized — The Great Work continues ✦');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
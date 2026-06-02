(function() {
    'use strict';
    var CONFIG = {
        stages: ['nigredo', 'albedo', 'citrinitas', 'rubedo'],
        stageSymbols: {
            nigredo: { main: 'Saturn', text: 'MORTIFICATIO' },
            albedo: { main: 'Moon', text: 'CALCINATIO' },
            citrinitas: { main: 'Sun', text: 'SOL' },
            rubedo: { main: 'Star', text: 'LAPIS' }
        },
        stageColors: {
            nigredo: { primary: '#1a1a1a', secondary: '#2d2d2d', liquid: '#4a235a' },
            albedo: { primary: '#e8e8e8', secondary: '#c0c0c0', liquid: '#bdc3c7' },
            citrinitas: { primary: '#f4d03f', secondary: '#f39c12', liquid: '#f4d03f' },
            rubedo: { primary: '#c0392b', secondary: '#e74c3c', liquid: '#c0392b' }
        },
        mortarGrindTarget: 12,
        particlesCount: 20,
        scrollRevealOffset: 100
    };
    var state = {
        currentStage: 0,
        isGrinding: false,
        grindCount: 0,
        manuscriptPage: 1,
        totalManuscriptPages: 2,
        particles: [],
        audioEnabled: false
    };
    var elements = {};

    function getElement(selector) {
        return document.querySelector(selector);
    }

    function getElements(selector) {
        return document.querySelectorAll(selector);
    }

    function init() {
        elements.body = document.body;
        elements.rotatingCircle = getElement('#rotatingCircle');
        elements.stoneSymbol = getElement('#mainStoneSymbol');
        elements.stoneText = getElement('#stoneText');
        elements.liquidSurface = getElement('#liquidSurface');
        elements.bubblesContainer = getElement('#bubblesContainer');
        elements.risingSymbols = getElement('#risingSymbols');
        elements.advanceStageBtn = getElement('#advanceStageBtn');
        elements.stagePoints = getElements('.stage-point');
        elements.stageModal = getElement('#stageModal');
        elements.modalSymbol = getElement('#modalSymbol');
        elements.modalTitle = getElement('#modalTitle');
        elements.modalText = getElement('#modalText');
        elements.modalClose = getElement('#modalClose');
        elements.manuscriptPage = getElement('#manuscriptPage');
        elements.pageTwo = getElement('#pageTwo');
        elements.prevPage = getElement('#prevPage');
        elements.nextPage = getElement('#nextPage');
        elements.currentPage = getElement('#currentPage');
        elements.mortarSetup = getElement('#mortarSetup');
        elements.mortarContents = getElement('#mortarContents');
        elements.grindingProgress = getElement('#grindingProgress');
        elements.grindCountEl = getElement('#grindCount');
        elements.groundResult = getElement('#groundResult');
        elements.particlesContainer = getElement('#particles');
        elements.celestialMap = getElement('#celestialMap');
        elements.constellations = getElements('.constellation');
        elements.sigils = getElements('.sigil-card');
        elements.audioToggle = getElement('#audioToggle');
        elements.revelationTexts = getElements('.revelation-text');
        elements.ingredients = getElements('.ingredient');
        elements.planetarySymbols = getElements('.planet-symbol');
        setupEventListeners();
        initializeParticles();
        initializeScrollAnimations();
        initializeCrucibleEffects();
        initializeManuscriptReveal();
        initializeCelestialEffects();
        updateStageDisplay();
        injectDynamicStyles();
        console.log('Officina Alchymiae initialized - The Great Work awaits...');
    }

    function setupEventListeners() {
        if (elements.advanceStageBtn) {
            elements.advanceStageBtn.addEventListener('click', advanceStage);
        }
        elements.stagePoints.forEach(function(point, index) {
            point.addEventListener('click', function() {
                setStage(index);
            });
        });
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeModal);
        }
        if (elements.stageModal) {
            elements.stageModal.addEventListener('click', function(e) {
                if (e.target === elements.stageModal) {
                    closeModal();
                }
            });
        }
        if (elements.prevPage) {
            elements.prevPage.addEventListener('click', prevManuscriptPage);
        }
        if (elements.nextPage) {
            elements.nextPage.addEventListener('click', nextManuscriptPage);
        }
        if (elements.mortarSetup) {
            elements.mortarSetup.addEventListener('click', grind);
        }
        if (elements.audioToggle) {
            elements.audioToggle.addEventListener('click', toggleAudio);
        }
        elements.sigils.forEach(function(sigil) {
            sigil.addEventListener('click', handleSigilClick);
            sigil.addEventListener('mouseenter', handleSigilHover);
            sigil.addEventListener('mouseleave', handleSigilLeave);
        });
        elements.ingredients.forEach(function(ingredient) {
            ingredient.addEventListener('click', handleIngredientClick);
        });
        elements.planetarySymbols.forEach(function(planet) {
            planet.addEventListener('click', handlePlanetClick);
            planet.addEventListener('mouseenter', handlePlanetHover);
        });
        var philosopherStone = getElement('#philosopherStone');
        if (philosopherStone) {
            philosopherStone.addEventListener('click', handleStoneClick);
        }
        document.addEventListener('keydown', handleKeyboard);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', debounce(handleResize, 250));
    }

    function advanceStage() {
        var nextStage = (state.currentStage + 1) % CONFIG.stages.length;
        setStage(nextStage);
    }

    function setStage(index) {
        if (index < 0 || index >= CONFIG.stages.length) return;
        var oldStage = CONFIG.stages[state.currentStage];
        state.currentStage = index;
        var newStage = CONFIG.stages[index];
        elements.body.classList.remove('stage-' + oldStage);
        elements.body.classList.add('stage-' + newStage);
        elements.stagePoints.forEach(function(point, i) {
            point.classList.toggle('active', i === index);
        });
        updateStoneDisplay();
        updateCrucibleColors();
        updateParticles();
        showStageModal();
        updateCelestialMap();
    }

    function updateStageDisplay() {
        var stage = CONFIG.stages[state.currentStage];
        elements.body.classList.add('stage-' + stage);
        updateStoneDisplay();
        updateCrucibleColors();
    }

    function updateStoneDisplay() {
        var stage = CONFIG.stages[state.currentStage];
        var symbolData = CONFIG.stageSymbols[stage];
        elements.stoneSymbol.style.opacity = '0';
        elements.stoneText.style.opacity = '0';
        setTimeout(function() {
            elements.stoneSymbol.textContent = symbolData.main;
            elements.stoneText.textContent = symbolData.text;
            elements.stoneSymbol.style.opacity = '1';
            elements.stoneText.style.opacity = '1';
        }, 300);
    }

    function showStageModal() {
        var stage = CONFIG.stages[state.currentStage];
        var symbolData = CONFIG.stageSymbols[stage];
        var colors = CONFIG.stageColors[stage];
        var stageDescriptions = {
            nigredo: {
                title: 'Nigredo - Putrefaction',
                text: 'The first stage begins. The prima materia blackens and dies, surrendering its impurities to the sacred fire of transformation.'
            },
            albedo: {
                title: 'Albedo - Whitening',
                text: 'Purification unfolds. The black matter transmutes to pure white, the albedo of lunar light, cleansing all contamination.'
            },
            citrinitas: {
                title: 'Citrinitas - Yellowing',
                text: 'The solar stage emerges. Golden light suffuses the matter as the sun essence perfects the work toward completion.'
            },
            rubedo: {
                title: 'Rubedo - Reddening',
                text: 'The Great Work completes! The Philosopher Stone manifests in glorious crimson - the red dragon triumphant!'
            }
        };
        var desc = stageDescriptions[stage];
        elements.modalSymbol.textContent = symbolData.main;
        elements.modalSymbol.style.color = colors.primary;
        elements.modalTitle.textContent = desc.title;
        elements.modalText.textContent = desc.text;
        elements.stageModal.classList.add('visible');
        setTimeout(function() {
            if (elements.stageModal.classList.contains('visible')) {
                closeModal();
            }
        }, 5000);
    }

    function closeModal() {
        elements.stageModal.classList.remove('visible');
    }

    function initializeCrucibleEffects() {
        animateBubbles();
        animateRisingSymbols();
        setInterval(randomizeBubbles, 3000);
    }

    function updateCrucibleColors() {
        var stage = CONFIG.stages[state.currentStage];
        var colors = CONFIG.stageColors[stage];
        var liquidStops = document.querySelectorAll('.liquid-stop-1, .liquid-stop-2');
        if (liquidStops[0]) liquidStops[0].style.stopColor = colors.liquid;
        if (liquidStops[1]) liquidStops[1].style.stopColor = shadeColor(colors.liquid, -30);
        elements.liquidSurface.style.transform = 'scaleX(1.1)';
        setTimeout(function() {
            elements.liquidSurface.style.transform = 'scaleX(1)';
        }, 500);
    }

    function animateBubbles() {
        var bubbles = elements.bubblesContainer.querySelectorAll('.bubble');
        bubbles.forEach(function(bubble, i) {
            bubble.style.animationDuration = (1.5 + Math.random()) + 's';
            bubble.style.animationDelay = (i * 0.4) + 's';
        });
    }

    function randomizeBubbles() {
        var bubbles = elements.bubblesContainer.querySelectorAll('.bubble');
        bubbles.forEach(function(bubble) {
            bubble.setAttribute('cx', 100 + Math.random() * 100);
            bubble.setAttribute('cy', 180 + Math.random() * 30);
        });
    }

    function animateRisingSymbols() {
        var symbols = elements.risingSymbols.querySelectorAll('.rising-element');
        symbols.forEach(function(symbol, i) {
            symbol.style.animationDelay = (i * 0.7) + 's';
        });
    }

    function initializeManuscriptReveal() {
        var observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        elements.revelationTexts.forEach(function(text) {
            revealObserver.observe(text);
        });
    }

    function prevManuscriptPage() {
        if (state.manuscriptPage > 1) {
            state.manuscriptPage--;
            updateManuscriptDisplay();
        }
    }

    function nextManuscriptPage() {
        if (state.manuscriptPage < state.totalManuscriptPages) {
            state.manuscriptPage++;
            updateManuscriptDisplay();
        }
    }

    function updateManuscriptDisplay() {
        elements.currentPage.textContent = state.manuscriptPage;
        if (state.manuscriptPage === 1) {
            elements.manuscriptPage.style.opacity = '0';
            elements.pageTwo.classList.remove('active');
            setTimeout(function() {
                elements.manuscriptPage.style.opacity = '1';
            }, 300);
        } else {
            elements.manuscriptPage.style.opacity = '0';
            setTimeout(function() {
                elements.manuscriptPage.style.opacity = '0';
                elements.pageTwo.classList.add('active');
                setTimeout(function() {
                    elements.pageTwo.style.opacity = '1';
                }, 50);
            }, 300);
        }
        elements.prevPage.disabled = state.manuscriptPage === 1;
        elements.nextPage.disabled = state.manuscriptPage === state.totalManuscriptPages;
        var dropCaps = ['V', 'N'];
        var dropCapEl = document.getElementById('dropCap');
        if (dropCapEl) {
            dropCapEl.textContent = dropCaps[state.manuscriptPage - 1];
        }
    }

    function grind() {
        if (state.grindCount >= CONFIG.mortarGrindTarget) return;
        state.isGrinding = true;
        state.grindCount++;
        elements.mortarSetup.classList.add('grinding');
        elements.grindCountEl.textContent = state.grindCount;
        var progress = (state.grindCount / CONFIG.mortarGrindTarget) * 100;
        elements.grindingProgress.style.width = progress + '%';
        updateIngredientChunks();
        setTimeout(function() {
            state.isGrinding = false;
            elements.mortarSetup.classList.remove('grinding');
            if (state.grindCount >= CONFIG.mortarGrindTarget) {
                completeGrinding();
            }
        }, 300);
    }

    function updateIngredientChunks() {
        var chunks = elements.mortarContents.querySelectorAll('.ingredient-chunk');
        var reductionFactor = state.grindCount / CONFIG.mortarGrindTarget;
        chunks.forEach(function(chunk) {
            var scale = 1 - (reductionFactor * 0.8);
            var opacity = 1 - reductionFactor;
            chunk.style.transform = 'scale(' + Math.max(0.2, scale) + ')';
            chunk.style.opacity = Math.max(0.3, opacity);
        });
    }

    function completeGrinding() {
        var rawMaterial = elements.mortarContents.querySelector('.raw-material');
        if (rawMaterial) {
            rawMaterial.style.opacity = '0';
        }
        elements.groundResult.classList.add('visible');
        elements.mortarSetup.style.filter = 'drop-shadow(0 0 20px #d4a84b)';
        elements.mortarSetup.style.cursor = 'default';
    }

    function initializeParticles() {
        for (var i = 0; i < CONFIG.particlesCount; i++) {
            createParticle();
        }
    }

    function createParticle() {
        var particle = document.createElement('div');
        var stage = CONFIG.stages[state.currentStage];
        var particleTypes = ['gold', 'silver'];
        if (stage === 'nigredo') {
            particleTypes.push('silver');
        } else if (stage === 'rubedo') {
            particleTypes.push('fire', 'gold');
        } else if (stage === 'citrinitas') {
            particleTypes.push('gold');
        }
        var type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.className = 'particle particle-' + type;
        var size = 3 + Math.random() * 8;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.animationDuration = (8 + Math.random() * 12) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        elements.particlesContainer.appendChild(particle);
        state.particles.push(particle);
    }

    function updateParticles() {
        state.particles.forEach(function(particle) {
            particle.remove();
        });
        state.particles = [];
        initializeParticles();
    }

    function initializeCelestialEffects() {
        elements.constellations.forEach(function(constellation) {
            constellation.addEventListener('mouseenter', function() {
                highlightConstellation(constellation);
            });
            constellation.addEventListener('mouseleave', function() {
                unhighlightConstellation(constellation);
            });
            constellation.addEventListener('click', function() {
                selectConstellation(constellation);
            });
        });
    }

    function highlightConstellation(constellation) {
        var circles = constellation.querySelectorAll('circle');
        circles.forEach(function(circle) {
            circle.style.transition = 'all 0.3s ease';
            circle.style.filter = 'drop-shadow(0 0 10px #d4a84b)';
        });
    }

    function unhighlightConstellation(constellation) {
        var circles = constellation.querySelectorAll('circle');
        circles.forEach(function(circle) {
            circle.style.filter = 'none';
        });
    }

    function selectConstellation(constellation) {
        var name = constellation.classList[1];
        var element = constellation.dataset.element;
        constellation.style.animation = 'none';
        constellation.offsetHeight;
        constellation.style.animation = 'constellation-flash 0.5s ease';
        console.log('Constellation ' + name.toUpperCase() + ' selected - Element: ' + element);
    }

    function updateCelestialMap() {
        var stage = CONFIG.stages[state.currentStage];
        var connections = document.querySelectorAll('.element-connections line');
        connections.forEach(function(conn) {
            var connClass = 'water';
            if (conn.classList.contains('connection-fire')) connClass = 'fire';
            else if (conn.classList.contains('connection-earth')) connClass = 'earth';
            else if (conn.classList.contains('connection-air')) connClass = 'air';
            if (connClass === stage || (stage === 'albedo' && connClass === 'air')) {
                conn.style.opacity = '1';
                conn.style.strokeWidth = '2';
            } else {
                conn.style.opacity = '0.3';
                conn.style.strokeWidth = '1';
            }
        });
    }

    function handleSigilClick(e) {
        var sigil = e.currentTarget;
        var sigilName = sigil.querySelector('.sigil-name').textContent;
        var ripple = document.createElement('div');
        ripple.className = 'sigil-ripple';
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(212, 168, 75, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple-expand 0.6s ease-out forwards';
        ripple.style.pointerEvents = 'none';
        sigil.appendChild(ripple);
        setTimeout(function() {
            ripple.remove();
        }, 600);
        if (sigil.dataset.sigil === 'philosophers') {
            advanceStage();
        }
        console.log('Sigil activated: ' + sigilName);
    }

    function handleSigilHover(e) {
        var sigil = e.currentTarget;
        sigil.style.transform = 'translateY(-5px) scale(1.02)';
    }

    function handleSigilLeave(e) {
        var sigil = e.currentTarget;
        sigil.style.transform = '';
    }

    function handleIngredientClick(e) {
        var ingredient = e.currentTarget;
        var element = ingredient.dataset.element;
        var name = ingredient.querySelector('.ingredient-name').textContent;
        ingredient.classList.add('active');
        setTimeout(function() {
            ingredient.classList.remove('active');
        }, 300);
        addElementToCrucible(element);
        console.log('Ingredient added: ' + name + ' (' + element + ')');
    }

    function addElementToCrucible(element) {
        var floatingElement = document.createElement('span');
        floatingElement.className = 'rising-element element-' + element;
        floatingElement.textContent = getElementSymbol(element);
        floatingElement.style.position = 'absolute';
        floatingElement.style.left = (120 + Math.random() * 60) + 'px';
        floatingElement.style.top = '150px';
        floatingElement.style.fontSize = '1.5rem';
        floatingElement.style.animation = 'element-rise 2s ease-out forwards';
        var crucibleSvg = document.querySelector('.crucible-svg');
        if (crucibleSvg) {
            crucibleSvg.appendChild(floatingElement);
            setTimeout(function() {
                floatingElement.remove();
            }, 2000);
        }
    }

    function getElementSymbol(element) {
        var symbols = {
            sulfur: 'S',
            mercury: 'Hg',
            salt: 'Na',
            arsenic: 'As'
        };
        return symbols[element] || '*';
    }

    function handlePlanetClick(e) {
        var planet = e.currentTarget;
        var planetName = planet.querySelector('.planet-name').textContent;
        var symbol = planet.querySelector('.planet-glyph');
        symbol.style.animation = 'planet-align 0.5s ease';
        setTimeout(function() {
            symbol.style.animation = '';
        }, 500);
        console.log('Planetary alignment: ' + planetName);
    }

    function handlePlanetHover(e) {
        var planet = e.currentTarget;
        planet.style.filter = 'drop-shadow(0 0 15px currentColor)';
    }

    function handleStoneClick() {
        var stone = document.getElementById('philosopherStone');
        stone.style.animation = 'stone-pulse 0.5s ease';
        setTimeout(function() {
            stone.style.animation = '';
        }, 500);
        createParticleBurst();
        console.log('The Philosopher Stone pulses with power...');
    }

    function createParticleBurst() {
        var stone = document.getElementById('philosopherStone');
        var rect = stone.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        for (var i = 0; i < 8; i++) {
            (function(index) {
                var particle = document.createElement('div');
                particle.className = 'particle particle-gold';
                particle.style.position = 'fixed';
                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';
                particle.style.width = '6px';
                particle.style.height = '6px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                particle.style.transition = 'all 1s ease-out';
                document.body.appendChild(particle);
                var angle = (index / 8) * Math.PI * 2;
                var distance = 100 + Math.random() * 50;
                var targetX = centerX + Math.cos(angle) * distance;
                var targetY = centerY + Math.sin(angle) * distance;
                requestAnimationFrame(function() {
                    particle.style.left = targetX + 'px';
                    particle.style.top = targetY + 'px';
                    particle.style.opacity = '0';
                });
                setTimeout(function() {
                    particle.remove();
                }, 1000);
            })(i);
        }
    }

    function initializeScrollAnimations() {
        var animatedElements = document.querySelectorAll('.crucible-container, .manuscript-container, .mortar-section, .celestial-section, .sigils-section');
        animatedElements.forEach(function(el, i) {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = (i * 0.1) + 's';
        });
        handleScroll();
    }

    function handleScroll() {
        var scrollY = window.scrollY;
        var windowHeight = window.innerHeight;
        var smokeOpacity = Math.max(0, 1 - scrollY / 300);
        document.querySelectorAll('.smoke').forEach(function(smoke) {
            smoke.style.opacity = smokeOpacity;
        });
        var animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        animatedElements.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            var isVisible = rect.top < windowHeight - CONFIG.scrollRevealOffset;
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    }

    function toggleAudio() {
        state.audioEnabled = !state.audioEnabled;
        var icon = elements.audioToggle.querySelector('.audio-icon');
        icon.textContent = state.audioEnabled ? 'ON' : 'OFF';
        if (state.audioEnabled) {
            console.log('Ambient alchemical sounds enabled');
        } else {
            console.log('Ambient sounds disabled');
        }
    }

    function handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                advanceStage();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                setStage((state.currentStage - 1 + CONFIG.stages.length) % CONFIG.stages.length);
                break;
            case 'Escape':
                closeModal();
                break;
            case 'm':
                toggleAudio();
                break;
        }
    }

    function handleResize() {
        handleScroll();
    }

    function shadeColor(color, percent) {
        var num = parseInt(color.replace('#', ''), 16);
        var amt = Math.round(2.55 * percent);
        var R = (num >> 16) + amt;
        var G = (num >> 8 & 0x00FF) + amt;
        var B = (num & 0x0000FF) + amt;
        var newR = R < 255 ? (R < 1 ? 0 : R) : 255;
        var newG = G < 255 ? (G < 1 ? 0 : G) : 255;
        var newB = B < 255 ? (B < 1 ? 0 : B) : 255;
        return '#' + (0x1000000 + (newR * 0x10000) + (newG * 0x100) + newB).toString(16).slice(1);
    }

    function debounce(func, wait) {
        var timeout;
        return function() {
            var args = arguments;
            var later = function() {
                clearTimeout(timeout);
                func.apply(null, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function injectDynamicStyles() {
        var styleSheet = document.createElement('style');
        var css = '@keyframes constellation-flash { 0% { filter: brightness(1); } 50% { filter: brightness(2) drop-shadow(0 0 20px #d4a84b); } 100% { filter: brightness(1); } } ';
        css += '@keyframes planet-align { 0% { transform: scale(1); } 50% { transform: scale(1.3); filter: drop-shadow(0 0 15px currentColor); } 100% { transform: scale(1); } } ';
        css += '@keyframes ripple-expand { 0% { width: 10px; height: 10px; opacity: 1; } 100% { width: 150px; height: 150px; opacity: 0; } } ';
        css += '.ingredient.active { background: rgba(212, 168, 75, 0.4) !important; transform: translateX(5px) scale(1.02); } ';
        css += '.sigil-ripple { position: absolute; top: 50%; left: 50%; background: rgba(212, 168, 75, 0.5); border-radius: 50%; transform: translate(-50%, -50%); animation: ripple-expand 0.6s ease-out forwards; pointer-events: none; } ';
        css += '.stone-symbol { transition: opacity 0.3s ease; } ';
        css += '.liquid-surface { transition: transform 0.5s ease; } ';
        css += '.raw-material { transition: opacity 0.5s ease; } ';
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }

    function showWelcomeMessage() {
        console.log('%cOFFICINA ALCHYMIAE', 'color: #d4a84b; font-size: 18px; font-weight: bold;');
        console.log('%cNavigate the Great Work:', 'color: #c0392b;');
        console.log('%c- Click the Proceed button or press SPACE to advance stages', 'color: #8b7355;');
        console.log('%c- Click stage points to jump to specific stages', 'color: #8b7355;');
        console.log('%c- Click the Philosopher Stone for radiant effects', 'color: #8b7355;');
        console.log('%c- Grind ingredients in the mortar', 'color: #8b7355;');
        console.log('%c- Explore the celestial heavens', 'color: #8b7355;');
        console.log('%c- Examine the ancient sigils', 'color: #8b7355;');
        console.log('%cVisita Interiora Terrae Rectificando Invenies Occultum Lapidem', 'color: #d4a84b; font-style: italic;');
    }

    document.addEventListener('DOMContentLoaded', function() {
        init();
        showWelcomeMessage();
    });
})();
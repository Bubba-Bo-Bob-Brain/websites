/* ============================================================
   LABORATORIUM HERMETICUM — Opus Magnum
   JavaScript: The Living Alchemy
   ============================================================ */

(function () {
    'use strict';

    /* -----------------------------------------------------------
       CONFIGURATION
       ----------------------------------------------------------- */
    var STAGES = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];

    var STAGE_DATA = {
        nigredo: {
            name: 'Nigredo',
            latin: 'Putrefactio',
            progress: 0,
            folio: 'Folio I',
            stoneState: 'Materia Prima',
            stoneStops: ['#3a3a3a', '#1a1a1a', '#0a0a0a'],
            stoneInnerOpacity: 0.1
        },
        albedo: {
            name: 'Albedo',
            latin: 'Albedo',
            progress: 33,
            folio: 'Folio II',
            stoneState: 'Lapis Albus',
            stoneStops: ['#c8c8d8', '#a0a0b8', '#787890'],
            stoneInnerOpacity: 0.3
        },
        citrinitas: {
            name: 'Citrinitas',
            latin: 'Citrinitas',
            progress: 66,
            folio: 'Folio III',
            stoneState: 'Lapis Citrinus',
            stoneStops: ['#d4a840', '#b89030', '#8a6820'],
            stoneInnerOpacity: 0.35
        },
        rubedo: {
            name: 'Rubedo',
            latin: 'Rubedo',
            progress: 100,
            folio: 'Folio IV',
            stoneState: 'Lapis Philosophorum',
            stoneStops: ['#cc2222', '#991818', '#661010'],
            stoneInnerOpacity: 0.4
        }
    };

    var PARTICLE_COUNT = 40;
    var GRIND_SPARKS_COUNT = 12;

    /* -----------------------------------------------------------
       STATE
       ----------------------------------------------------------- */
    var currentStageIndex = 0;
    var isTransitioning = false;
    var particles = [];
    var grindCount = 0;

    /* -----------------------------------------------------------
       DOM REFERENCES
       ----------------------------------------------------------- */
    var body = document.getElementById('laboratory');
    var stageNameEl = document.getElementById('current-stage-name');
    var stageLatinEl = document.getElementById('current-stage-latin');
    var stageProgressEl = document.getElementById('stage-progress');
    var stageMarkers = document.querySelectorAll('.stage-marker');
    var stoneStop1 = document.getElementById('stone-stop-1');
    var stoneStop2 = document.getElementById('stone-stop-2');
    var stoneStop3 = document.getElementById('stone-stop-3');
    var stoneInnerLights = document.querySelectorAll('.stone-inner-light');
    var stoneStateEl = document.querySelector('.stone-state');
    var folioNumEl = document.getElementById('folio-num');
    var manuscriptPages = document.querySelectorAll('.manuscript-page');
    var transitionOverlay = document.getElementById('transition-overlay');
    var particleField = document.getElementById('particle-field');
    var mortarStation = document.getElementById('mortar-station');
    var grindSparksGroup = document.getElementById('grind-sparks');
    var transmutationCircle = document.getElementById('transmutation-circle');
    var outerRotator = document.getElementById('outer-rotator');
    var innerRotator = document.getElementById('inner-rotator');
    var zodiacChars = document.querySelectorAll('.zodiac-char');
    var planetChars = document.querySelectorAll('.planet-char');
    var crucibles = document.querySelectorAll('.crucible');
    var crucibleBubbles = document.querySelectorAll('.crucible-bubbles');

    /* -----------------------------------------------------------
       INITIALIZATION
       ----------------------------------------------------------- */
    function init() {
        createParticles();
        bindEvents();
        startAmbientAnimations();
        updateStageUI(false);
    }

    /* -----------------------------------------------------------
       EVENT BINDING
       ----------------------------------------------------------- */
    function bindEvents() {
        transmutationCircle.addEventListener('click', handleCircleClick);
        transmutationCircle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCircleClick();
            }
        });
        transmutationCircle.setAttribute('tabindex', '0');
        transmutationCircle.setAttribute('role', 'button');
        transmutationCircle.setAttribute('aria-label', 'Advance the Great Work to the next stage');

        mortarStation.addEventListener('click', handleMortarClick);
        mortarStation.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMortarClick();
            }
        });

        crucibles.forEach(function (crucible) {
            crucible.addEventListener('click', function () {
                handleCrucibleClick(this);
            });
            crucible.setAttribute('tabindex', '0');
            crucible.setAttribute('role', 'button');
            crucible.setAttribute('aria-label', 'Examine ' + crucible.dataset.metal + ' crucible');
        });

        zodiacChars.forEach(function (zc) {
            zc.addEventListener('click', function () {
                handleZodiacClick(this);
            });
        });

        document.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
    }

    /* -----------------------------------------------------------
       STAGE MANAGEMENT
       ----------------------------------------------------------- */
    function handleCircleClick() {
        if (isTransitioning) return;
        if (currentStageIndex >= STAGES.length - 1) {
            resetWork();
            return;
        }
        advanceStage();
    }

    function advanceStage() {
        isTransitioning = true;
        currentStageIndex = Math.min(currentStageIndex + 1, STAGES.length - 1);
        performTransition();
    }

    function resetWork() {
        isTransitioning = true;
        currentStageIndex = 0;
        grindCount = 0;
        performTransition();
    }

    function performTransition() {
        transitionOverlay.classList.add('active');

        setTimeout(function () {
            updateStageUI(true);

            setTimeout(function () {
                transitionOverlay.classList.remove('active');
                isTransitioning = false;
            }, 800);
        }, 400);
    }

    function updateStageUI(animated) {
        var stageKey = STAGES[currentStageIndex];
        var data = STAGE_DATA[stageKey];

        body.className = 'stage-' + stageKey;

        stageNameEl.textContent = data.name;
        stageLatinEl.textContent = data.latin;
        stageProgressEl.style.width = data.progress + '%';

        stageMarkers.forEach(function (marker, idx) {
            if (idx <= currentStageIndex) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });

        if (stoneStop1) stoneStop1.setAttribute('stop-color', data.stoneStops[0]);
        if (stoneStop2) stoneStop2.setAttribute('stop-color', data.stoneStops[1]);
        if (stoneStop3) stoneStop3.setAttribute('stop-color', data.stoneStops[2]);

        stoneInnerLights.forEach(function (light) {
            light.setAttribute('opacity', data.stoneInnerOpacity);
        });

        if (stoneStateEl) stoneStateEl.textContent = data.stoneState;
        if (folioNumEl) folioNumEl.textContent = data.folio;

        manuscriptPages.forEach(function (page) {
            var isVisible = page.dataset.page === stageKey;
            page.classList.toggle('visible', isVisible);
        });
    }

    /* -----------------------------------------------------------
       PARTICLE SYSTEM
       ----------------------------------------------------------- */
    function createParticles() {
        var i, particle, p;
        for (i = 0; i < PARTICLE_COUNT; i++) {
            particle = document.createElement('div');
            particle.classList.add('particle');
            particleField.appendChild(particle);
            p = {
                el: particle,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.03,
                speedY: -Math.random() * 0.02 - 0.005,
                opacity: Math.random() * 0.4 + 0.1,
                life: Math.random() * 100,
                maxLife: 200 + Math.random() * 200
            };
            particles.push(p);
        }
    }

    function animateParticles() {
        var i, p, lifeRatio, currentOpacity;
        for (i = 0; i < particles.length; i++) {
            p = particles[i];
            p.life++;
            if (p.life > p.maxLife) {
                p.x = Math.random() * 100;
                p.y = 100 + Math.random() * 10;
                p.life = 0;
                p.maxLife = 200 + Math.random() * 200;
            }

            p.x += p.speedX + Math.sin(p.life * 0.02) * 0.01;
            p.y += p.speedY;

            lifeRatio = p.life / p.maxLife;
            if (lifeRatio < 0.1) {
                currentOpacity = p.opacity * (lifeRatio / 0.1);
            } else if (lifeRatio > 0.8) {
                currentOpacity = p.opacity * ((1 - lifeRatio) / 0.2);
            } else {
                currentOpacity = p.opacity;
            }

            p.el.style.left = p.x + '%';
            p.el.style.top = p.y + '%';
            p.el.style.width = p.size + 'px';
            p.el.style.height = p.size + 'px';
            p.el.style.opacity = currentOpacity;
            p.el.style.background = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-highlight').trim() || '#c9a84c';
        }

        requestAnimationFrame(animateParticles);
    }

    /* -----------------------------------------------------------
       MORTAR AND PESTLE
       ----------------------------------------------------------- */
    function handleMortarClick() {
        if (mortarStation.classList.contains('grinding')) return;

        mortarStation.classList.add('grinding');
        createGrindSparks();
        grindCount++;

        if (grindCount > 0 && grindCount % 8 === 0 && !isTransitioning && currentStageIndex < STAGES.length - 1) {
            setTimeout(function () {
                advanceStage();
            }, 600);
        }

        setTimeout(function () {
            mortarStation.classList.remove('grinding');
        }, 1400);
    }

    function createGrindSparks() {
        var i, spark, angle, radius, cx, cy;
        grindSparksGroup.innerHTML = '';
        for (i = 0; i < GRIND_SPARKS_COUNT; i++) {
            spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            angle = Math.random() * Math.PI * 2;
            radius = Math.random() * 20 + 5;
            cx = 110 + Math.cos(angle) * radius;
            cy = 145 + Math.sin(angle) * radius * 0.5;
            spark.setAttribute('cx', cx);
            spark.setAttribute('cy', cy);
            spark.setAttribute('r', Math.random() * 2 + 1);
            spark.setAttribute('fill', Math.random() > 0.5 ? '#ffd700' : '#ff8c00');
            spark.style.opacity = '1';
            spark.style.transition = 'all 0.8s ease-out';

            grindSparksGroup.appendChild(spark);

            (function (sparkEl, cxVal, cyVal) {
                setTimeout(function () {
                    sparkEl.setAttribute('cx', cxVal + (Math.random() - 0.5) * 40);
                    sparkEl.setAttribute('cy', cyVal - Math.random() * 20);
                    sparkEl.style.opacity = '0';
                }, 50);

                setTimeout(function () {
                    if (sparkEl.parentNode) sparkEl.parentNode.removeChild(sparkEl);
                }, 900);
            })(spark, cx, cy);
        }
    }

    /* -----------------------------------------------------------
       CRUCIBLE INTERACTIONS
       ----------------------------------------------------------- */
    function handleCrucibleClick(crucible) {
        var bubblesGroup, currentBubbles, i, bubble, cx, cy, r;
        crucibles.forEach(function (c) {
            c.classList.remove('active');
        });
        crucible.classList.add('active');

        bubblesGroup = crucible.querySelector('.crucible-bubbles');
        if (bubblesGroup) {
            currentBubbles = bubblesGroup.querySelectorAll('.bubble');
            currentBubbles.forEach(function (b) {
                b.style.animation = 'none';
                b.offsetHeight;
                b.style.animation = '';
            });

            for (i = 0; i < 5; i++) {
                bubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                cx = 40 + Math.random() * 40;
                cy = 70 + Math.random() * 20;
                r = Math.random() * 4 + 2;
                bubble.setAttribute('cx', cx);
                bubble.setAttribute('cy', cy);
                bubble.setAttribute('r', r);
                bubble.setAttribute('class', 'bubble');
                bubble.style.opacity = '0.8';
                bubble.style.animation = 'bubble-rise ' + (1.5 + Math.random()) + 's ease-in forwards';
                bubblesGroup.appendChild(bubble);

                (function (b) {
                    setTimeout(function () {
                        if (b.parentNode) b.parentNode.removeChild(b);
                    }, 3000);
                })(bubble);
            }
        }

        setTimeout(function () {
            crucible.classList.remove('active');
        }, 3000);
    }

    /* -----------------------------------------------------------
       ZODIAC INTERACTIONS
       ----------------------------------------------------------- */
    function handleZodiacClick(zodiacEl) {
        var sign = zodiacEl.getAttribute('data-sign');
        var tooltip;

        zodiacEl.style.transition = 'all 0.3s ease';
        zodiacEl.style.opacity = '1';
        zodiacEl.style.filter = 'drop-shadow(0 0 12px var(--glow-color))';

        tooltip = document.createElement('div');
        tooltip.className = 'zodiac-tooltip';
        tooltip.textContent = getZodiacMeaning(sign);
        tooltip.style.cssText = [
            'position: fixed',
            'left: ' + (zodiacEl.getBoundingClientRect().left + 15) + 'px',
            'top: ' + (zodiacEl.getBoundingClientRect().top - 10) + 'px',
            'font-family: var(--font-marginalia)',
            'font-size: 0.7rem',
            'color: var(--text-highlight)',
            'background: var(--bg-surface)',
            'padding: 0.3rem 0.6rem',
            'border-radius: 4px',
            'border: 1px solid var(--border-metal)',
            'pointer-events: none',
            'z-index: 200',
            'opacity: 0',
            'transition: opacity 0.3s ease',
            'white-space: nowrap'
        ].join(';');
        document.body.appendChild(tooltip);

        setTimeout(function () {
            tooltip.style.opacity = '1';
        }, 50);

        setTimeout(function () {
            tooltip.style.opacity = '0';
            zodiacEl.style.opacity = '';
            zodiacEl.style.filter = '';
            setTimeout(function () {
                if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
            }, 300);
        }, 2500);
    }

    function getZodiacMeaning(sign) {
        var meanings = {
            aries: 'Ignis — The Fire of Beginning',
            taurus: 'Terra — The Body of the Work',
            gemini: 'Rebis — The Dual Nature',
            cancer: 'Aqua — The Washing',
            leo: 'Sulfur — The Solar Principle',
            virgo: 'Luna — The Virgin Earth',
            libra: 'Aequilibrium — The Balance',
            scorpio: 'Putrefactio — Death and Rebirth',
            sagittarius: 'Mercurius — The Volatile',
            capricorn: 'Sal — The Fixed Body',
            aquarius: 'Aqua Permanens — The Philosophic Water',
            pisces: 'Dissolutio — The Great Dissolution'
        };
        return meanings[sign] || 'Arcana Mundi';
    }

    /* -----------------------------------------------------------
       SCROLL-BASED MANUSCRIPT REVEAL
       ----------------------------------------------------------- */
    function handleScroll() {
        var panel = document.getElementById('manuscript-panel');
        if (!panel) return;

        var rect = panel.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        var isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;

        if (isVisible) {
            panel.classList.add('in-view');
        }
    }

    /* -----------------------------------------------------------
       RESIZE HANDLER
       ----------------------------------------------------------- */
    function handleResize() {
        particles.forEach(function (p) {
            p.x = Math.random() * 100;
            p.y = Math.random() * 100;
        });
    }

    /* -----------------------------------------------------------
       AMBIENT ANIMATIONS
       ----------------------------------------------------------- */
    function startAmbientAnimations() {
        animateParticles();
        animateCircleRotation();
        animateFlames();
        animateStoneGlow();
        animatePlanetaryPulse();
    }

    function animateCircleRotation() {
        var angle = 0;
        setInterval(function () {
            angle += 0.15;
            if (outerRotator) {
                outerRotator.style.transform = 'rotate(' + angle + 'deg)';
            }
            if (innerRotator) {
                innerRotator.style.transform = 'rotate(' + (-angle * 1.5) + 'deg)';
            }
        }, 50);
    }

    function animateFlames() {
        var flames = document.querySelectorAll('.flame-shape');
        setInterval(function () {
            var scaleX, scaleY;
            flames.forEach(function (flame) {
                scaleX = 0.9 + Math.random() * 0.3;
                scaleY = 0.85 + Math.random() * 0.3;
                flame.style.transform = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')';
                flame.style.transition = 'transform 0.3s ease';
            });
        }, 300);
    }

    function animateStoneGlow() {
        var glow = document.getElementById('stone-glow');
        if (!glow) return;

        var phase = 0;
        setInterval(function () {
            phase += 0.05;
            var scale = 1 + Math.sin(phase) * 0.2;
            var glowOpacity = 0.4 + Math.sin(phase) * 0.2;
            glow.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
            glow.style.opacity = glowOpacity;
        }, 80);
    }

    function animatePlanetaryPulse() {
        var phase = 0;
        setInterval(function () {
            phase += 0.02;
            planetChars.forEach(function (planet, idx) {
                var offset = idx * 0.5;
                var brightness = 0.7 + Math.sin(phase + offset) * 0.3;
                planet.style.opacity = brightness;
            });
        }, 100);
    }

    /* -----------------------------------------------------------
       KEYBOARD SHORTCUT: Space to advance stage
       ----------------------------------------------------------- */
    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            handleCircleClick();
        }
    });

    /* -----------------------------------------------------------
       BOOT
       ----------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
/* ============================================ THE CELESTIAL SCROLL OF MARTIAL ARTS scripts.js - Interactive Features & Animations ============================================ */

(function() {
    'use strict';

    // ============================================ SKILL DATA ============================================
    var skillInfo = {
        'dragon-origin': { title: '龍源 · Dragon Origin', description: 'The foundation of all Dragon Fist techniques. Unlocks the primal dragon energy within.', damage: '—', cost: '0' },
        'dragon-breath': { title: '龍息 · Dragon Breath', description: 'Channel internal qi to enhance strikes with explosive power.', damage: '120%', cost: '15' },
        'iron-dragon': { title: '鐵龍 · Iron Dragon', description: 'Harden your body to resist damage while delivering crushing blows.', damage: '150%', cost: '25' },
        'sky-dragon': { title: '天龍 · Sky Dragon', description: 'Float like clouds, strike like thunder from above.', damage: '180%', cost: '30' },
        'iron-body': { title: '金剛身 · Vajra Form', description: 'Achieve an impenetrable defensive stance.', damage: '80%', cost: '35' },
        'dragon-roar': { title: '龍吼 · Dragon\'s Roar', description: 'Release a devastating shout that staggers all nearby enemies.', damage: '200%', cost: '45' },
        'cloud-step': { title: '雲步 · Cloud Step', description: 'Move with ethereal lightness, dodging attacks effortlessly.', damage: '100%', cost: '20' },
        'dragon-flight': { title: '龍飛 · Dragon Flight', description: 'Ascend to the heavens and strike from above.', damage: '250%', cost: '50' },
        'phoenix-origin': { title: '鳳源 · Phoenix Origin', description: 'The rebirth of martial power from ash and flame.', damage: '—', cost: '0' },
        'phoenix-eye': { title: '鳳眼 · Phoenix Eye', description: 'See through illusions and strike with precision.', damage: '130%', cost: '18' },
        'flame-palm': { title: '焰掌 · Flame Palm', description: 'Infuse your palms with burning qi.', damage: '160%', cost: '28' },
        'wing-shield': { title: '翼盾 · Wing Shield', description: 'Create a protective barrier of phoenix feathers.', damage: '—', cost: '22' },
        'inferno-strike': { title: '烈火 · Inferno Strike', description: 'Unleash a torrent of flames upon your enemy.', damage: '220%', cost: '40' },
        'rebirth': { title: '涅槃 · Nirvana', description: 'Rise from defeat stronger than before.', damage: '—', cost: '60' },
        'mirror-shield': { title: '鏡盾 · Mirror Shield', description: 'Reflect attacks back at the attacker.', damage: '100%', cost: '35' },
        'rebirth-final': { title: '鳳凰 · Phoenix Reborn', description: 'Achieve ultimate resurrection and power.', damage: '300%', cost: '80' }
    };

    // ============================================ DOM CACHE ============================================
    var elements = {
        body: document.body,
        html: document.documentElement,
        scrollContainer: document.querySelector('.scroll-content'),
        scrollSections: document.querySelectorAll('.scroll-section'),
        navSeals: document.querySelectorAll('.nav-seal'),
        parallaxLayers: document.querySelectorAll('.parallax-layer'),
        skillNodes: document.querySelectorAll('.skill-node'),
        skillTrees: document.querySelectorAll('.skill-tree'),
        skillTooltip: document.getElementById('skill-tooltip'),
        meridianCards: document.querySelectorAll('.meridian-card'),
        timerToggles: document.querySelectorAll('.timer-toggle'),
        progressFill: document.querySelector('.progress-fill'),
        ambientParticles: document.getElementById('ambient-particles'),
        humanSilhouette: document.querySelector('.human-silhouette'),
        flyingCrane: document.querySelector('.flying-crane'),
        qiParticles: document.querySelectorAll('.qi-particle'),
        meridians: document.querySelectorAll('.meridian-lines path'),
        breathCircle: document.querySelector('.breath-circle'),
        timerDisplays: document.querySelectorAll('.timer-display')
    };

    // ============================================ STATE ============================================
    var state = {
        lastScrollY: 0,
        currentSection: 0,
        isScrolling: false,
        timers: {},
        particlePositions: []
    };

    // ============================================ UTILITY FUNCTIONS ============================================
    function throttle(func, limit) {
        var inThrottle = false;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    function debounce(func, wait) {
        var timeout;
        return function() {
            var args = arguments;
            var context = this;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    function easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t - 1) + b;
    }

    // ============================================ PARALLAX EFFECT ============================================
    function updateParallax(scrollY) {
        var scrollHeight = elements.html.scrollHeight - window.innerHeight;
        var scrollPercent = scrollY / scrollHeight;
        
        elements.parallaxLayers.forEach(function(layer) {
            var speed = parseFloat(layer.dataset.speed) || 0.5;
            var offset = scrollY * speed * 0.5;
            layer.style.transform = 'translateY(' + offset + 'px)';
        });

        var clouds = document.querySelectorAll('.cloud');
        clouds.forEach(function(cloud, index) {
            var speed = 0.2 + (index * 0.1);
            var offset = scrollY * speed * 0.3;
            cloud.style.transform = 'translateY(' + offset + 'px)';
        });

        if (elements.flyingCrane) {
            var craneOffset = scrollY * 0.15;
            elements.flyingCrane.style.transform = 'translateY(' + craneOffset + 'px)';
        }
    }

    // ============================================ NAVIGATION ============================================
    function updateNavigation(scrollY) {
        var sections = elements.scrollSections;
        var currentSectionIndex = 0;
        
        sections.forEach(function(section, index) {
            var sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - window.innerHeight / 2) {
                currentSectionIndex = index;
            }
        });

        elements.navSeals.forEach(function(seal, index) {
            if (index === currentSectionIndex) {
                seal.classList.add('active');
            } else {
                seal.classList.remove('active');
            }
        });
        
        state.currentSection = currentSectionIndex;
    }

    // ============================================ SCROLL PROGRESS ============================================
    function updateScrollProgress() {
        var scrollHeight = elements.html.scrollHeight - window.innerHeight;
        var scrollPercent = (window.pageYOffset / scrollHeight) * 100;
        
        if (elements.progressFill) {
            elements.progressFill.style.height = Math.min(scrollPercent, 100) + '%';
        }
    }

    // ============================================ SCROLL HANDLER ============================================
    function onScroll() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        updateParallax(scrollY);
        updateNavigation(scrollY);
        updateScrollProgress();
        updateSectionVisibility(scrollY);
        state.lastScrollY = scrollY;
    }

    // ============================================ SECTION VISIBILITY ============================================
    function initScrollAnimations() {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.scrollSections.forEach(function(section) {
            observer.observe(section);
        });

        var nodeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        elements.skillNodes.forEach(function(node) {
            nodeObserver.observe(node);
        });
    }

    function updateSectionVisibility(scrollY) {
        elements.scrollSections.forEach(function(section) {
            var rect = section.getBoundingClientRect();
            var isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            if (isVisible) {
                section.classList.add('visible');
            }
        });
    }

    // ============================================ SKILL TOOLTIP ============================================
    function showSkillTooltip(event, node) {
        var skillId = node.dataset.skill;
        var info = skillInfo[skillId];
        if (!info) return;
        
        var tooltip = elements.skillTooltip;
        tooltip.querySelector('.tooltip-title').textContent = info.title;
        tooltip.querySelector('.tooltip-description').textContent = info.description;
        tooltip.querySelector('.tooltip-stat.damage strong').textContent = info.damage;
        tooltip.querySelector('.tooltip-stat.cost strong').textContent = info.cost;
        tooltip.classList.add('active');
        moveSkillTooltip(event);
    }

    function hideSkillTooltip() {
        elements.skillTooltip.classList.remove('active');
    }

    function moveSkillTooltip(event) {
        var tooltip = elements.skillTooltip;
        var rect = tooltip.getBoundingClientRect();
        var x = event.clientX + 15;
        var y = event.clientY + 15;
        var maxX = window.innerWidth - rect.width - 20;
        var maxY = window.innerHeight - rect.height - 20;
        
        tooltip.style.left = Math.min(x, maxX) + 'px';
        tooltip.style.top = Math.min(y, maxY) + 'px';
    }

    function onSkillClick(event, node) {
        var nodeInner = node.querySelector('.node-inner');
        nodeInner.style.transform = 'scale(0.95)';
        setTimeout(function() {
            nodeInner.style.transform = '';
        }, 150);
        
        node.classList.add('activated');
        setTimeout(function() {
            node.classList.remove('activated');
        }, 500);
    }

    // ============================================ MERIDIAN INTERACTIONS ============================================
    function highlightMeridian(meridianType) {
        var meridianLine = document.querySelector('.meridian-' + meridianType);
        if (meridianLine) {
            meridianLine.style.stroke = 'var(--vermillion-light)';
            meridianLine.style.strokeWidth = '5';
            meridianLine.style.opacity = '1';
        }
    }

    function unhighlightMeridians() {
        document.querySelectorAll('.meridian-lines path').forEach(function(path) {
            path.style.stroke = '';
            path.style.strokeWidth = '';
            path.style.opacity = '';
        });
    }

    // ============================================ QI FLOW ANIMATION ============================================
    function startQiAnimation() {
        animateQiParticles();
        animateMeridianPulse();
    }

    function animateQiParticles() {
        var particles = document.querySelectorAll('.qi-particle');
        particles.forEach(function(particle, index) {
            var delay = index * 300;
            var duration = 2000 + (index * 200);
            setInterval(function() {
                particle.style.animation = 'none';
                particle.offsetHeight;
                particle.style.animation = 'qiPulse ' + duration + 'ms ease-in-out infinite';
                particle.style.animationDelay = delay + 'ms';
            }, delay);
        });
    }

    function animateMeridianPulse() {
        var meridians = document.querySelectorAll('.meridian-lines path');
        meridians.forEach(function(meridian, index) {
            meridian.style.animation = 'none';
            meridian.offsetHeight;
            meridian.style.animation = 'meridianFlow ' + (3000 + (index * 500)) + 'ms linear infinite';
            meridian.style.animationDelay = (index * 200) + 'ms';
        });
    }

    // ============================================ FLYING CRANE ANIMATION ============================================
    function startFlyingCraneAnimation() {
        if (!elements.flyingCrane) return;
        
        var crane = elements.flyingCrane;
        var wings = crane.querySelectorAll('.crane-wing');
        
        wings.forEach(function(wing, index) {
            setInterval(function() {
                var angle = index === 0 ? -15 : 15;
                wing.style.transform = 'rotate(' + angle + 'deg)';
                setTimeout(function() {
                    wing.style.transform = 'rotate(0deg)';
                }, 400);
            }, 800 + (index * 200));
        });
    }

    // ============================================ AMBIENT PARTICLES ============================================
    function createAmbientParticles() {
        var container = elements.ambientParticles;
        if (!container) return;
        
        var particleCount = 20;
        var colors = ['var(--vermillion)', 'var(--ink-medium)', 'var(--gold)'];
        
        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (12 + Math.random() * 8) + 's';
            
            var size = 2 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.opacity = 0.2 + Math.random() * 0.4;
            
            container.appendChild(particle);
        }
    }

    // ============================================ BREATH EXERCISES ============================================
    function initBreathExercises() {
        if (elements.breathCircle) {
            var breathe = function() {
                elements.breathCircle.style.animation = 'none';
                elements.breathCircle.offsetHeight;
                elements.breathCircle.style.animation = 'breathExercise 8s ease-in-out infinite';
            };
            breathe();
        }
    }

    // ============================================ TIMER FUNCTIONALITY ============================================
    function toggleTimer(button, index) {
        var display = elements.timerDisplays[index];
        var isRunning = button.textContent === 'Pause';
        
        if (isRunning) {
            pauseTimer(index);
            button.textContent = 'Resume';
        } else {
            if (state.timers[index]) {
                resumeTimer(index, display);
                button.textContent = 'Pause';
            } else {
                startTimer(index, display);
                button.textContent = 'Pause';
            }
        }
    }

    function startTimer(index, display) {
        var seconds = 0;
        state.timers[index] = {
            seconds: seconds,
            interval: setInterval(function() {
                seconds++;
                state.timers[index].seconds = seconds;
                display.textContent = formatTime(seconds);
            }, 1000)
        };
    }

    function pauseTimer(index) {
        if (state.timers[index]) {
            clearInterval(state.timers[index].interval);
        }
    }

    function resumeTimer(index, display) {
        var savedSeconds = state.timers[index].seconds;
        state.timers[index] = {
            seconds: savedSeconds,
            interval: setInterval(function() {
                savedSeconds++;
                state.timers[index].seconds = savedSeconds;
                display.textContent = formatTime(savedSeconds);
            }, 1000)
        };
    }

    function formatTime(totalSeconds) {
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        return minutes + ':' + (seconds.toString().padStart(2, '0'));
    }

    // ============================================ SMOOTH SCROLLING ============================================
    function smoothScrollTo(event, anchor) {
        event.preventDefault();
        var targetId = anchor.getAttribute('href');
        var targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            var targetPosition = targetElement.offsetTop;
            var startPosition = window.pageYOffset;
            var distance = targetPosition - startPosition;
            var duration = 1000;
            var startTime = null;
            
            var animation = function(currentTime) {
                if (startTime === null) startTime = currentTime;
                var timeElapsed = currentTime - startTime;
                var run = easeOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };
            
            requestAnimationFrame(animation);
        }
    }

    // ============================================ KEYBOARD NAVIGATION ============================================
    function handleKeyboard(event) {
        var key = event.key;
        
        if (key >= '1' && key <= '5') {
            var sectionIndex = parseInt(key) - 1;
            var sections = ['hero', 'cultivation', 'skill-trees', 'meridians', 'techniques'];
            var targetSection = document.getElementById(sections[sectionIndex]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        if (key === 't' || key === 'T') {
            elements.timerToggles.forEach(function(btn) {
                if (btn.textContent === 'Begin') {
                    btn.click();
                }
            });
        }
    }

    // ============================================ VISIBILITY CHANGE HANDLER ============================================
    function onVisibilityChange() {
        if (document.hidden) {
            pauseAnimations();
        } else {
            resumeAnimations();
        }
    }

    function pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    function resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    // ============================================ EVENT BINDINGS ============================================
    function bindEvents() {
        window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
        window.addEventListener('resize', debounce(onScroll, 200));
        
        elements.skillNodes.forEach(function(node) {
            node.addEventListener('mouseenter', function(e) { showSkillTooltip(e, node); });
            node.addEventListener('mouseleave', hideSkillTooltip);
            node.addEventListener('mousemove', function(e) { moveSkillTooltip(e); });
            node.addEventListener('click', function(e) { onSkillClick(e, node); });
        });
        
        elements.meridianCards.forEach(function(card) {
            card.addEventListener('mouseenter', function() { highlightMeridian(card.dataset.meridian); });
            card.addEventListener('mouseleave', unhighlightMeridians);
        });
        
        elements.timerToggles.forEach(function(btn, index) {
            btn.addEventListener('click', function() { toggleTimer(btn, index); });
        });
        
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) { smoothScrollTo(e, anchor); });
        });
        
        document.addEventListener('keydown', handleKeyboard);
        document.addEventListener('visibilitychange', onVisibilityChange);
    }

    // ============================================ INITIALIZE ============================================
    function init() {
        bindEvents();
        createAmbientParticles();
        initScrollAnimations();
        startQiAnimation();
        startFlyingCraneAnimation();
        initBreathExercises();
        updateScrollProgress();
        injectDynamicStyles();
        
        setTimeout(function() {
            onScroll();
        }, 100);
    }

    // ============================================ DYNAMIC STYLES ============================================
    function injectDynamicStyles() {
        var styleSheet = document.createElement('style');
        styleSheet.textContent = 
            '@keyframes skillActivate {' +
            '  0% { box-shadow: 0 0 0 0 var(--vermillion); }' +
            '  50% { box-shadow: 0 0 30px 10px var(--vermillion); }' +
            '  100% { box-shadow: 0 0 0 0 var(--vermillion); }' +
            '}' +
            '@keyframes particleOrbit {' +
            '  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); opacity: 0.8; }' +
            '  50% { opacity: 0.3; }' +
            '  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); opacity: 0.8; }' +
            '}' +
            '.skill-node.activated .node-inner {' +
            '  animation: nodeActivate 0.5s ease-out;' +
            '}' +
            '@keyframes nodeActivate {' +
            '  0% { transform: scale(1); }' +
            '  50% { transform: scale(1.15); box-shadow: 0 0 40px var(--vermillion); }' +
            '  100% { transform: scale(1); }' +
            '}' +
            '.nav-seal.active .seal {' +
            '  transform: scale(1.15) rotate(0deg) !important;' +
            '  box-shadow: 0 0 20px var(--vermillion);' +
            '}' +
            '.nav-seal.active .seal::after {' +
            '  content: "";' +
            '  position: absolute;' +
            '  top: -5px;' +
            '  left: 50%;' +
            '  transform: translateX(-50%);' +
            '  width: 0;' +
            '  height: 0;' +
            '  border-left: 8px solid transparent;' +
            '  border-right: 8px solid transparent;' +
            '  border-top: 8px solid var(--vermillion);' +
            '}';
        document.head.appendChild(styleSheet);
    }

    // ============================================ CONSOLE MESSAGE ============================================
    console.log('%c天武秘笈 %cThe Celestial Scroll of Martial Arts %c\n\n"The blade that seeks to cut has already lost.\nThe sword that simply is, cuts everything."\n— Grandmaster Tian Ming\n\n',
        'font-size: 24px; color: #c41e3a; font-weight: bold;',
        'font-size: 14px; color: #1a1a1a;',
        'font-size: 12px; color: #666;'
    );

    // ============================================ START APPLICATION ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
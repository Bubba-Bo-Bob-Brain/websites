document.addEventListener('DOMContentLoaded', function() {
    const AlchemicalLaboratory = {
        currentStage: 'nigredo',
        stages: ['nigredo', 'albedo', 'citrinitas', 'rubedo'],
        rotationAngle: 0,
        grindCount: 0,
        maxGrinds: 9,
        combinedElements: [],
        circleRotating: false,

        init: function() {
            this.cacheElements();
            this.bindEvents();
            this.initAnimations();
            this.updateMoonPhase();
            this.setAlchemicalYear();
            this.startAmbientEffects();
        },

        cacheElements: function() {
            this.body = document.body;
            this.transmutationCircle = document.getElementById('main-circle');
            this.centerGlyph = document.getElementById('center-glyph');
            this.stageMarkers = document.querySelectorAll('.stage-marker');
            this.crucibles = document.querySelectorAll('.crucible');
            this.mortar = document.getElementById('mortar');
            this.pestle = document.getElementById('pestle');
            this.mortarContents = document.getElementById('mortar-contents');
            this.stone = document.getElementById('stone');
            this.stoneStage = document.getElementById('stone-stage');
            this.ingredientJars = document.querySelectorAll('.ingredient-jar');
            this.manuscriptPages = document.querySelectorAll('.manuscript-page');
            this.revealedTexts = document.querySelectorAll('.revealed-text');
            this.zodiacSymbols = document.querySelectorAll('.zodiac-symbol');
            this.planetarySigils = document.querySelectorAll('.planetary-sigil');
            this.elementTriangles = document.querySelectorAll('.element-triangle');
            this.tooltip = document.getElementById('tooltip');
            this.furnaceTemp = document.getElementById('furnace-temp');
            this.currentZodiac = document.getElementById('current-zodiac');
        },

        bindEvents: function() {
            if (this.transmutationCircle) {
                this.transmutationCircle.addEventListener('click', this.handleCircleClick.bind(this));
            }

            this.stageMarkers.forEach(function(marker) {
                marker.addEventListener('click', this.handleStageClick.bind(this));
            }.bind(this));

            this.crucibles.forEach(function(crucible) {
                crucible.addEventListener('click', this.handleCrucibleClick.bind(this));
            }.bind(this));

            if (this.pestle) {
                this.pestle.addEventListener('click', this.handlePestleClick.bind(this));
            }

            this.ingredientJars.forEach(function(jar) {
                jar.addEventListener('click', this.handleJarClick.bind(this));
            }.bind(this));

            this.zodiacSymbols.forEach(function(symbol) {
                symbol.addEventListener('mouseenter', this.showTooltip.bind(this));
                symbol.addEventListener('mouseleave', this.hideTooltip.bind(this));
            }.bind(this));

            this.planetarySigils.forEach(function(sigil) {
                sigil.addEventListener('mouseenter', this.showTooltip.bind(this));
                sigil.addEventListener('mouseleave', this.hideTooltip.bind(this));
            }.bind(this));

            this.elementTriangles.forEach(function(triangle) {
                triangle.addEventListener('click', this.handleElementClick.bind(this));
            }.bind(this));

            window.addEventListener('scroll', this.handleScroll.bind(this));
            window.addEventListener('resize', this.handleResize.bind(this));
        },

        initAnimations: function() {
            this.animateBubbles();
            this.animateFlames();
            this.animateSmoke();
            this.animateStoneGlow();
        },

        handleCircleClick: function(e) {
            if (this.circleRotating) return;

            this.circleRotating = true;
            this.rotationAngle += 30;

            this.transmutationCircle.style.transform = 'rotate(' + this.rotationAngle + 'deg)';

            this.advanceStage();

            var self = this;
            setTimeout(function() {
                self.circleRotating = false;
            }, 800);
        },

        handleStageClick: function(e) {
            var marker = e.currentTarget;
            var stage = marker.dataset.stage;
            this.setStage(stage);
        },

        handleCrucibleClick: function(e) {
            var crucible = e.currentTarget;
            var planet = crucible.dataset.planet;
            var element = crucible.dataset.element;

            this.animateCrucible(crucible);
            this.addElementToCombination(planet, element);
        },

        handlePestleClick: function(e) {
            if (this.grindCount >= this.maxGrinds) {
                this.completeGrinding();
                return;
            }

            this.grindCount++;
            this.pestle.classList.add('grinding');

            var self = this;
            setTimeout(function() {
                self.pestle.classList.remove('grinding');
            }, 300);

            this.updateMortarContents();
            this.increaseFurnaceTemp();
        },

        handleJarClick: function(e) {
            var jar = e.currentTarget;
            var ingredient = jar.dataset.ingredient;
            this.addIngredientToMortar(ingredient);
            this.animateJar(jar);
        },

        handleElementClick: function(e) {
            var triangle = e.currentTarget;
            var element = triangle.dataset.element;
            this.pulseElement(element);
        },

        handleScroll: function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.revealedTexts.forEach(function(text) {
                var rect = text.getBoundingClientRect();
                var windowHeight = window.innerHeight;
                if (rect.top < windowHeight * 0.8) {
                    text.classList.add('visible');
                }
            });
        },

        handleResize: function() {
            this.positionZodiacSymbols();
        },

        advanceStage: function() {
            var currentIndex = this.stages.indexOf(this.currentStage);
            var nextIndex = (currentIndex + 1) % this.stages.length;
            var nextStage = this.stages[nextIndex];
            this.setStage(nextStage);
        },

        setStage: function(stage) {
            this.currentStage = stage;
            this.body.dataset.stage = stage;

            this.stageMarkers.forEach(function(marker) {
                marker.classList.remove('active');
                if (marker.dataset.stage === stage) {
                    marker.classList.add('active');
                }
            });

            if (this.stoneStage) {
                var stageNames = {
                    'nigredo': 'Nigredo',
                    'albedo': 'Albedo',
                    'citrinitas': 'Citrinitas',
                    'rubedo': 'Rubedo'
                };
                this.stoneStage.textContent = stageNames[stage];
            }

            this.updateStoneAppearance(stage);
            this.updateCenterGlyph(stage);
            this.announceTransformation(stage);
        },

        updateStoneAppearance: function(stage) {
            if (!this.stone) return;

            var colors = {
                'nigredo': {
                    background: 'radial-gradient(circle at 30% 30%, #4a4a4a 0%, #1a1a1a 70%, #0a0a0a 100%)',
                    glow: '0 0 20px rgba(50, 50, 50, 0.8)'
                },
                'albedo': {
                    background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #c0c0c0 50%, #808080 100%)',
                    glow: '0 0 30px rgba(192, 192, 192, 0.8)'
                },
                'citrinitas': {
                    background: 'radial-gradient(circle at 30% 30%, #fff59d 0%, #ffd700 50%, #b8860b 100%)',
                    glow: '0 0 40px rgba(255, 215, 0, 0.8)'
                },
                'rubedo': {
                    background: 'radial-gradient(circle at 30% 30%, #ffb6c1 0%, #cd5c5c 50%, #8b0000 100%)',
                    glow: '0 0 50px rgba(205, 92, 92, 0.8)'
                }
            };

            var config = colors[stage];
            this.stone.style.background = config.background;
            this.stone.querySelector('.stone-glow').style.boxShadow = config.glow;

            this.stone.style.transform = 'scale(1.1)';
            var self = this;
            setTimeout(function() {
                self.stone.style.transform = 'scale(1)';
            }, 500);
        },

        updateCenterGlyph: function(stage) {
            if (!this.centerGlyph) return;

            var glyphs = {
                'nigredo': '♄',
                'albedo': '☽',
                'citrinitas': '☉',
                'rubedo': '☿'
            };

            this.centerGlyph.style.opacity = '0';
            var self = this;
            setTimeout(function() {
                self.centerGlyph.textContent = glyphs[stage];
                self.centerGlyph.style.opacity = '1';
            }, 200);
        },

        announceTransformation: function(stage) {
            var announcements = {
                'nigredo': 'Putrefactio inititur...',
                'albedo': 'Albedo lucem revelat...',
                'citrinitas': 'Aurificatio perficitur...',
                'rubedo': 'Rubedinatio completur!'
            };

            this.flashMessage(announcements[stage]);
        },

        flashMessage: function(message) {
            var flash = document.createElement('div');
            flash.className = 'flash-message';
            flash.textContent = message;
            flash.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); ' +
                'font-family: \'Cinzel Decorative\', serif; font-size: 1.5rem; color: #d4a847; ' +
                'text-shadow: 0 0 20px rgba(212, 168, 71, 0.8); z-index: 1000; ' +
                'opacity: 0; transition: opacity 0.5s; pointer-events: none;';

            document.body.appendChild(flash);

            setTimeout(function() {
                flash.style.opacity = '1';
            }, 50);

            setTimeout(function() {
                flash.style.opacity = '0';
                setTimeout(function() {
                    flash.remove();
                }, 500);
            }, 2000);
        },

        animateCrucible: function(crucible) {
            var vessel = crucible.querySelector('.crucible-vessel');
            vessel.style.transform = 'scale(1.1)';
            setTimeout(function() {
                vessel.style.transform = 'scale(1)';
            }, 200);

            var particles = crucible.querySelectorAll('.element-particle');
            particles.forEach(function(particle) {
                particle.style.transform = 'scale(1.5) rotate(180deg)';
                setTimeout(function() {
                    particle.style.transform = 'scale(1) rotate(0deg)';
                }, 400);
            });
        },

        addElementToCombination: function(planet, element) {
            this.combinedElements.push({ planet: planet, element: element });

            if (this.combinedElements.length >= 2) {
                this.checkCombination();
            }
        },

        checkCombination: function() {
            var first = this.combinedElements[0];
            var second = this.combinedElements[1];

            if (first.planet === 'sol' || second.planet === 'sol') {
                this.flashMessage('Aurum purificatum!');
            }

            this.combinedElements = [];
        },

        addIngredientToMortar: function(ingredient) {
            var symbols = {
                'sulfur': '🜍',
                'mercury': '☿',
                'salt': '🜔',
                'antimony': '♃'
            };

            var symbol = document.createElement('span');
            symbol.className = 'ground-ingredient';
            symbol.textContent = symbols[ingredient] || '?';
            symbol.style.opacity = '0.5';
            symbol.style.transform = 'scale(0.5)';

            if (this.mortarContents) {
                this.mortarContents.appendChild(symbol);

                setTimeout(function() {
                    symbol.style.opacity = '1';
                    symbol.style.transform = 'scale(1)';
                }, 100);
            }
        },

        updateMortarContents: function() {
            var particles = this.mortarContents.querySelectorAll('.ground-ingredient');
            var progress = this.grindCount / this.maxGrinds;

            particles.forEach(function(particle) {
                var scale = 1 - (progress * 0.5);
                var opacity = 0.3 + (progress * 0.7);
                particle.style.transform = 'scale(' + scale + ')';
                particle.style.opacity = opacity;
            });

            if (this.grindCount === Math.floor(this.maxGrinds / 2)) {
                this.flashMessage('Materia teritur...');
            }
        },

        completeGrinding: function() {
            this.flashMessage('Pulvis praeparatus!');

            if (this.mortarContents) {
                var particles = this.mortarContents.querySelectorAll('.ground-ingredient');
                particles.forEach(function(particle) {
                    particle.style.transform = 'scale(0.3)';
                    particle.style.opacity = '0.8';
                    particle.style.filter = 'blur(1px)';
                });
            }

            this.grindCount = 0;
        },

        increaseFurnaceTemp: function() {
            if (!this.furnaceTemp) return;

            var temps = ['I', 'II', 'III', 'IV', 'V'];
            var currentTemp = this.furnaceTemp.textContent;
            var currentIndex = temps.indexOf(currentTemp);
            var nextIndex = Math.min(currentIndex + 1, temps.length - 1);
            this.furnaceTemp.textContent = temps[nextIndex];

            if (nextIndex >= temps.length - 1) {
                setTimeout(function() {
                    this.furnaceTemp.textContent = 'III';
                }.bind(this), 2000);
            }
        },

        animateJar: function(jar) {
            jar.style.transform = 'translateY(-5px)';
            setTimeout(function() {
                jar.style.transform = 'translateY(0)';
            }, 200);
        },

        pulseElement: function(element) {
            var colors = {
                'fire': '#ff6b35',
                'air': '#fff59d',
                'water': '#4fc3f7',
                'earth': '#8d6e63'
            };

            var triangle = document.querySelector('.element-triangle[data-element="' + element + '"]');
            if (triangle) {
                triangle.style.filter = 'drop-shadow(0 0 20px ' + colors[element] + ')';
                setTimeout(function() {
                    triangle.style.filter = '';
                }, 500);
            }
        },

        animateBubbles: function() {
            var bubbles = document.querySelectorAll('.bubble');
            bubbles.forEach(function(bubble) {
                var delay = Math.random() * 2;
                bubble.style.animationDelay = delay + 's';
            });
        },

        animateFlames: function() {
            var flames = document.querySelectorAll('.flame');
            flames.forEach(function(flame, index) {
                setInterval(function() {
                    var scale = 0.8 + Math.random() * 0.4;
                    flame.style.transform = 'scaleY(' + scale + ')';
                }, 200 + index * 50);
            });
        },

        animateSmoke: function() {
            var smokeParticles = document.querySelectorAll('.smoke-particle');
            smokeParticles.forEach(function(particle) {
                var duration = 2 + Math.random() * 2;
                particle.style.animationDuration = duration + 's';
            });
        },

        animateStoneGlow: function() {
            if (!this.stone) return;

            var glowElement = this.stone.querySelector('.stone-glow');
            if (!glowElement) return;

            setInterval(function() {
                var intensity = 20 + Math.random() * 30;
                glowElement.style.boxShadow = '0 0 ' + intensity + 'px rgba(212, 168, 71, 0.6)';
            }, 1000);
        },

        showTooltip: function(e) {
            var target = e.currentTarget;
            var content = this.getTooltipContent(target);

            if (!content) return;

            this.tooltip.querySelector('.tooltip-content').textContent = content;
            this.tooltip.classList.add('visible');

            var rect = target.getBoundingClientRect();
            var tooltipRect = this.tooltip.getBoundingClientRect();

            var left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            var top = rect.top - tooltipRect.height - 10;

            left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
            top = Math.max(10, top);

            this.tooltip.style.left = left + 'px';
            this.tooltip.style.top = top + 'px';
        },

        hideTooltip: function() {
            this.tooltip.classList.remove('visible');
        },

        getTooltipContent: function(element) {
            var sign = element.dataset.sign;
            var planet = element.dataset.planet;

            if (sign) {
                var zodiacInfo = {
                    'aries': 'Aries ♈ — Ignis, Mars',
                    'taurus': 'Taurus ♉ — Terra, Venus',
                    'gemini': 'Gemini ♊ — Aer, Mercurius',
                    'cancer': 'Cancer ♋ — Aqua, Luna',
                    'leo': 'Leo ♌ — Ignis, Sol',
                    'virgo': 'Virgo ♍ — Terra, Mercurius',
                    'libra': 'Libra ♎ — Aer, Venus',
                    'scorpio': 'Scorpio ♏ — Aqua, Mars',
                    'sagittarius': 'Sagittarius ♐ — Ignis, Iupiter',
                    'capricorn': 'Capricorn ♑ — Terra, Saturnus',
                    'aquarius': 'Aquarius ♒ — Aer, Saturnus',
                    'pisces': 'Pisces ♓ — Aqua, Iupiter'
                };
                return zodiacInfo[sign];
            }

            if (planet) {
                var planetInfo = {
                    'saturn': '♄ Saturnus — Plumbum (Lead)',
                    'jupiter': '♃ Iupiter — Stannum (Tin)',
                    'mars': '♂ Mars — Ferrum (Iron)',
                    'sol': '☉ Sol — Aurum (Gold)',
                    'venus': '♀ Venus — Cuprum (Copper)',
                    'mercury': '☿ Mercurius — Argentum Vivum',
                    'luna': '☽ Luna — Argentum (Silver)'
                };
                return planetInfo[planet];
            }

            return null;
        },

        updateMoonPhase: function() {
            var moonIcons = document.querySelectorAll('.moon-icon');
            var phases = ['new', 'waxing', 'full', 'waning'];
            var today = new Date();
            var dayOfMonth = today.getDate();
            var phaseIndex = Math.floor((dayOfMonth % 28) / 7);

            moonIcons.forEach(function(icon, index) {
                icon.classList.remove('active');
                if (index === phaseIndex) {
                    icon.classList.add('active');
                }
            });

            var zodiacs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
            var month = today.getMonth();
            var zodiacIndex = Math.floor((month + 2) % 12);

            if (this.currentZodiac) {
                this.currentZodiac.textContent = zodiacs[zodiacIndex];
            }
        },

        setAlchemicalYear: function() {
            var yearElement = document.getElementById('alchemical-year');
            if (!yearElement) return;

            var year = new Date().getFullYear();
            var romanNumerals = this.toRomanNumerals(year);
            yearElement.textContent = romanNumerals;
        },

        toRomanNumerals: function(num) {
            var lookup = {
                M: 1000, CM: 900, D: 500, CD: 400,
                C: 100, XC: 90, L: 50, XL: 40,
                X: 10, IX: 9, V: 5, IV: 4, I: 1
            };
            var roman = '';
            for (var key in lookup) {
                while (num >= lookup[key]) {
                    roman += key;
                    num -= lookup[key];
                }
            }
            return roman;
        },

        startAmbientEffects: function() {
            this.startParticleDrift();
            this.startSigilPulse();
        },

        startParticleDrift: function() {
            var particles = document.querySelectorAll('.element-particle');
            particles.forEach(function(particle) {
                var duration = 2 + Math.random() * 2;
                particle.style.animationDuration = duration + 's';
            });
        },

        startSigilPulse: function() {
            var sigils = document.querySelectorAll('.planetary-sigil');
            sigils.forEach(function(sigil, index) {
                setInterval(function() {
                    sigil.style.opacity = '0.7';
                    setTimeout(function() {
                        sigil.style.opacity = '1';
                    }, 500);
                }, 3000 + index * 500);
            });
        },

        positionZodiacSymbols: function() {
            // Handled by CSS for responsive design
        }
    };

    AlchemicalLaboratory.init();

    window.Laboratory = AlchemicalLaboratory;
});
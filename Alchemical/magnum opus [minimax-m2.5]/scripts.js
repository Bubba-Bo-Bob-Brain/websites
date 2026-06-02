/* ============================================
   LABORATORIUM ALCHEMICUM - The Great Work
   Interactive Alchemical Laboratory
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the laboratory
    const laboratory = new AlchemicalLaboratory();
    laboratory.init();
});

class AlchemicalLaboratory {
    constructor() {
        // Current stage of the Great Work
        this.currentStage = 'nigredo';
        this.stages = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
        this.stageIndex = 0;
        
        // Element counts for the crucible
        this.elements = {
            fire: false,
            water: false,
            air: false,
            earth: false,
            salt: false,
            mercury: false,
            sulfur: false
        };
        
        // Grinding state
        this.isGrinding = false;
        
        // Scroll reveal state
        this.revealProgress = 0;
    }

    init() {
        this.initStageNavigation();
        this.initManuscriptReveal();
        this.initCrucible();
        this.initMortarPestle();
        this.initElementalTools();
        this.initTransmutationCircle();
        this.initZodiacSymbols();
        this.initScrollPrompt();
        
        // Set initial stage
        this.setStage('nigredo');
        
        // Start continuous animations
        this.startAnimations();
    }

    /* ============================================
       STAGE NAVIGATION
       ============================================ */
    initStageNavigation() {
        const stageMarkers = document.querySelectorAll('.stage-marker');
        
        stageMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                const stage = marker.dataset.stage;
                this.setStage(stage);
            });
        });
    }

    setStage(stage) {
        this.currentStage = stage;
        this.stageIndex = this.stages.indexOf(stage);
        
        // Update body class
        document.body.className = stage;
        
        // Update stage markers
        document.querySelectorAll('.stage-marker').forEach((marker, index) => {
            if (index <= this.stageIndex) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
        
        // Update crucible liquid
        const crucibleLiquid = document.getElementById('crucibleLiquid');
        crucibleLiquid.className = 'crucible-liquid ' + stage;
        
        // Update Philosopher's Stone
        const stone = document.getElementById('philosophersStone');
        stone.className = 'philosophers-stone ' + stage;
        
        // Show stone based on stage
        if (this.stageIndex >= 2) {
            stone.querySelector('.stone-core').classList.add('visible');
            stone.querySelector('.stone-aura').classList.add('visible');
            
            if (stage === 'rubedo') {
                stone.querySelector('.stone-rays').classList.add('visible');
            }
        } else {
            stone.querySelector('.stone-core').classList.remove('visible');
            stone.querySelector('.stone-aura').classList.remove('visible');
            stone.querySelector('.stone-rays').classList.remove('visible');
        }
        
        // Update element sigils in crucible based on stage
        this.updateCrucibleElements();
        
        // Show notification
        this.showStageNotification(stage);
        
        // Advance manuscript
        this.advanceManuscript();
    }

    showStageNotification(stage) {
        const notification = document.getElementById('stageNotification');
        const textEl = notification.querySelector('.notification-text');
        
        const stageTexts = {
            nigredo: {
                main: 'NIGREDO',
                sub: 'The Blackening - Putrefaction'
            },
            albedo: {
                main: 'ALBEDO',
                sub: 'The Whitening - Purification'
            },
            citrinitas: {
                main: 'CITRINITAS',
                sub: 'The Yellowing - Illumination'
            },
            rubedo: {
                main: 'RUBEDO',
                sub: 'The Reddening - Completion'
            }
        };
        
        textEl.innerHTML = `
            <span class="notification-text">${stageTexts[stage].main}</span>
            <span class="notification-sub">${stageTexts[stage].sub}</span>
        `;
        
        notification.classList.add('visible');
        
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }

    /* ============================================
       MANUSCRIPT REVEAL ON SCROLL
       ============================================ */
    initManuscriptReveal() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Initial check
        this.handleScroll();
    }

    handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.revealProgress = Math.min(scrollTop / (docHeight * 0.5), 1);
        
        // Reveal manuscript text progressively
        const texts = document.querySelectorAll('.manuscript-text');
        texts.forEach((text, index) => {
            const threshold = (index + 1) / (texts.length + 1);
            if (this.revealProgress >= threshold) {
                text.classList.add('revealed');
            }
        });
        
        // Reveal marginalia
        const marginalia = document.querySelectorAll('.marginal-note');
        marginalia.forEach((note, index) => {
            const threshold = 0.3 + (index * 0.1);
            if (this.revealProgress >= threshold) {
                note.classList.add('revealed');
            }
        });
        
        // Hide scroll prompt after some scrolling
        const scrollPrompt = document.getElementById('scrollPrompt');
        if (this.revealProgress > 0.2) {
            scrollPrompt.style.opacity = '0';
        } else {
            scrollPrompt.style.opacity = '1';
        }
    }

    advanceManuscript() {
        // Auto-reveal some manuscript content based on stage
        const texts = document.querySelectorAll('.manuscript-text');
        
        texts.forEach((text, index) => {
            const revealLevel = (index + 1) * 0.25;
            if (this.stageIndex >= revealLevel) {
                text.classList.add('revealed');
            }
        });
        
        // Reveal marginalia
        const marginalia = document.querySelectorAll('.marginal-note');
        marginalia.forEach((note, index) => {
            if (index <= this.stageIndex * 1.5) {
                note.classList.add('revealed');
            }
        });
    }

    /* ============================================
       CRUCIBLE & ELEMENTS
       ============================================ */
    initCrucible() {
        const sigils = document.querySelectorAll('.element-sigil');
        
        sigils.forEach(sigil => {
            sigil.addEventListener('click', () => {
                const type = sigil.classList.contains('sigil-fire') ? 'fire' :
                            sigil.classList.contains('sigil-water') ? 'water' :
                            sigil.classList.contains('sigil-air') ? 'air' :
                            sigil.classList.contains('sigil-earth') ? 'earth' :
                            sigil.classList.contains('sigil-salt') ? 'salt' :
                            sigil.classList.contains('sigil-mercury') ? 'mercury' : 'sulfur';
                
                this.toggleElement(type);
            });
        });
        
        this.updateCrucibleElements();
    }

    toggleElement(element) {
        this.elements[element] = !this.elements[element];
        this.updateCrucibleElements();
    }

    updateCrucibleElements() {
        const sigils = {
            fire: document.querySelector('.sigil-fire'),
            water: document.querySelector('.sigil-water'),
            air: document.querySelector('.sigil-air'),
            earth: document.querySelector('.sigil-earth'),
            salt: document.querySelector('.sigil-salt'),
            mercury: document.querySelector('.sigil-mercury'),
            sulfur: document.querySelector('.sigil-sulfur')
        };
        
        // Define which elements appear at which stages
        const stageElements = {
            nigredo: ['fire', 'earth', 'sulfur'],
            albedo: ['water', 'air', 'mercury'],
            citrinitas: ['fire', 'mercury', 'sulfur'],
            rubedo: ['fire', 'water', 'salt', 'mercury', 'sulfur']
        };
        
        const allowedElements = stageElements[this.currentStage] || [];
        
        Object.keys(sigils).forEach(element => {
            if (allowedElements.includes(element) || this.elements[element]) {
                sigils[element].classList.add('active');
            } else {
                sigils[element].classList.remove('active');
            }
        });
    }

    /* ============================================
       MORTAR AND PESTLE
       ============================================ */
    initMortarPestle() {
        const mortarPestle = document.getElementById('mortarPestle');
        const pestle = document.getElementById('pestle');
        const groundMatter = document.getElementById('groundMatter');
        const ingredients = document.querySelectorAll('.ingredient');
        
        let grindCount = 0;
        
        mortarPestle.addEventListener('click', () => {
            if (this.isGrinding) return;
            
            this.isGrinding = true;
            pestle.classList.add('grinding');
            
            // Ground ingredients progressively
            setTimeout(() => {
                if (grindCount < ingredients.length) {
                    ingredients[grindCount].classList.add('ground');
                    grindCount++;
                }
                
                if (grindCount > 0) {
                    groundMatter.classList.add('visible');
                }
            }, 500);
            
            setTimeout(() => {
                if (grindCount < ingredients.length) {
                    ingredients[grindCount].classList.add('ground');
                    grindCount++;
                }
            }, 1000);
            
            setTimeout(() => {
                pestle.classList.remove('grinding');
                this.isGrinding = false;
                
                // Add to crucible when fully ground
                if (grindCount >= ingredients.length) {
                    this.addGroundMatterToCrucible();
                }
            }, 1500);
        });
    }

    addGroundMatterToCrucible() {
        // Visual feedback - pulse the crucible
        const crucible = document.getElementById('crucible');
        crucible.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            crucible.style.transform = 'scale(1)';
        }, 300);
        
        // Advance to next stage if available
        if (this.stageIndex < this.stages.length - 1) {
            setTimeout(() => {
                const nextStage = this.stages[this.stageIndex + 1];
                this.setStage(nextStage);
            }, 1000);
        }
    }

    /* ============================================
       ELEMENTAL TOOLS
       ============================================ */
    initElementalTools() {
        const tools = document.querySelectorAll('.tool');
        
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                const element = tool.dataset.element;
                this.addElementToCrucible(element);
                
                // Visual feedback
                tool.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tool.style.transform = '';
                }, 150);
            });
        });
    }

    addElementToCrucible(element) {
        this.elements[element] = true;
        this.updateCrucibleElements();
        
        // Add element to the transmutation
        this.triggerTransmutation();
    }

    triggerTransmutation() {
        const circle = document.getElementById('transmutationCircle');
        
        // Speed up rotation temporarily
        const rotationGroup = document.getElementById('circleRotation');
        rotationGroup.style.animationDuration = '5s';
        
        setTimeout(() => {
            rotationGroup.style.animationDuration = '120s';
        }, 3000);
        
        // Flash effect
        circle.style.filter = 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))';
        
        setTimeout(() => {
            circle.style.filter = '';
        }, 500);
        
        // Check if enough elements - advance stage
        const activeElements = Object.values(this.elements).filter(v => v).length;
        
        if (activeElements >= 4 && this.stageIndex < this.stages.length - 1) {
            setTimeout(() => {
                const nextStage = this.stages[this.stageIndex + 1];
                this.setStage(nextStage);
            }, 2000);
        }
    }

    /* ============================================
       TRANSMUTATION CIRCLE
       ============================================ */
    initTransmutationCircle() {
        const circle = document.getElementById('transmutationCircle');
        const rotationGroup = document.getElementById('circleRotation');
        
        circle.addEventListener('click', () => {
            // Speed up rotation on click
            const currentDuration = parseFloat(getComputedStyle(rotationGroup).animationDuration);
            const newDuration = Math.max(currentDuration / 3, 10);
            rotationGroup.style.animationDuration = newDuration + 's';
            
            // Reset after delay
            setTimeout(() => {
                rotationGroup.style.animationDuration = '120s';
            }, 5000);
            
            // Trigger transmutation
            this.triggerTransmutation();
        });
    }

    /* ============================================
       ZODIAC SYMBOLS
       ============================================ */
    initZodiacSymbols() {
        const zodiacRing = document.getElementById('zodiacRing');
        
        const zodiacSymbols = [
            { symbol: '♈', name: 'Aries', angle: 0 },
            { symbol: '♉', name: 'Taurus', angle: 30 },
            { symbol: '♊', name: 'Gemini', angle: 60 },
            { symbol: '♋', name: 'Cancer', angle: 90 },
            { symbol: '♌', name: 'Leo', angle: 120 },
            { symbol: '♍', name: 'Virgo', angle: 150 },
            { symbol: '♎', name: 'Libra', angle: 180 },
            { symbol: '♏', name: 'Scorpio', angle: 210 },
            { symbol: '♐', name: 'Sagittarius', angle: 240 },
            { symbol: '♑', name: 'Capricorn', angle: 270 },
            { symbol: '♒', name: 'Aquarius', angle: 300 },
            { symbol: '♓', name: 'Pisces', angle: 330 }
        ];
        
        const radius = 40; // vmin
        
        zodiacSymbols.forEach(z => {
            const el = document.createElement('span');
            el.className = 'zodiac-symbol';
            el.textContent = z.symbol;
            
            // Convert angle to position
            const rad = (z.angle - 90) * (Math.PI / 180);
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            
            el.style.left = `calc(50% + ${x}vmin - 0.6em)`;
            el.style.top = `calc(50% + ${y}vmin - 0.6em)`;
            el.title = z.name;
            
            zodiacRing.appendChild(el);
        });
    }

    /* ============================================
       SCROLL PROMPT
       ============================================ */
    initScrollPrompt() {
        const scrollPrompt = document.getElementById('scrollPrompt');
        
        // Hide after first scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollPrompt.style.opacity = '0';
            }
        }, { once: true });
    }

    /* ============================================
       CONTINUOUS ANIMATIONS
       ============================================ */
    startAnimations() {
        // Add dynamic bubble behavior
        this.animateBubbles();
        
        // Animate planetary orbits with varying speeds
        this.animatePlanets();
        
        // Pulse the Philosopher's Stone at final stage
        if (this.currentStage === 'rubedo') {
            this.pulseStone();
        }
    }

    animateBubbles() {
        const bubbles = document.querySelectorAll('.bubble');
        
        bubbles.forEach((bubble, index) => {
            // Randomize initial positions
            bubble.style.left = Math.random() * 80 + 10 + '%';
            
            // Continuous animation is handled by CSS
            // Add random variations
            setInterval(() => {
                if (Math.random() > 0.7) {
                    bubble.style.left = Math.random() * 80 + 10 + '%';
                }
            }, 3000);
        });
    }

    animatePlanets() {
        const orbits = document.querySelectorAll('.orbit');
        
        orbits.forEach((orbit, index) => {
            // Add slight randomization to orbit positions
            const planetSymbol = orbit.querySelector('.planet-symbol');
            
            setInterval(() => {
                const randomOffset = Math.random() * 360;
                planetSymbol.style.transform = `translateX(-50%) rotate(${randomOffset}deg)`;
            }, 5000 + (index * 1000));
        });
    }

    pulseStone() {
        const stone = document.getElementById('philosophersStone');
        
        if (this.currentStage === 'rubedo') {
            const core = stone.querySelector('.stone-core');
            const aura = stone.querySelector('.stone-aura');
            
            // Additional pulsing for the completed stone
            setInterval(() => {
                core.style.transform = 'translate(-50%, -50%) scale(1.15)';
                setTimeout(() => {
                    core.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 500);
            }, 3000);
        }
    }
}

/* ============================================
   ADDITIONAL ENHANCEMENTS
   ============================================ */

// Keyboard navigation between stages
document.addEventListener('keydown', (e) => {
    const laboratory = window.alchemicalLaboratory || document.querySelector('.laboratory');
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // Next stage
        const markers = document.querySelectorAll('.stage-marker');
        const activeIndex = Array.from(markers).findIndex(m => m.classList.contains('active') && !m.classList.contains('active-advanced'));
        
        if (activeIndex < markers.length - 1) {
            markers[activeIndex + 1].click();
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // Previous stage
        const markers = document.querySelectorAll('.stage-marker');
        const activeIndex = Array.from(markers).findIndex(m => m.classList.contains('active'));
        
        if (activeIndex > 0) {
            markers[activeIndex - 1].click();
        }
    }
});

// Mouse movement parallax for celestial sphere
document.addEventListener('mousemove', (e) => {
    const celestialSphere = document.getElementById('celestialSphere');
    const stars = celestialSphere.querySelector('.stars');
    
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    
    stars.style.transform = `translate(${x}px, ${y}px)`;
});

// Sound effects (optional - only if user hasn't disabled them)
class AlchemicalSoundEngine {
    constructor() {
        this.enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.audioContext = null;
    }
    
    init() {
        if (!this.enabled) return;
        
        // Create audio context on first interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playGrind() {
        this.playTone(80, 0.1, 'sawtooth');
    }
    
    playTransmutation() {
        // Harmonic chord
        [220, 277, 330, 440].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 1.5, 'sine'), i * 100);
        });
    }
}

// Initialize sound engine
const soundEngine = new AlchemicalSoundEngine();
soundEngine.init();

// Expose laboratory instance for debugging
window.alchemicalLaboratory = null;

// Re-initialize after DOM is ready
setTimeout(() => {
    window.alchemicalLaboratory = document.body.alchemicalLaboratory;
}, 100);
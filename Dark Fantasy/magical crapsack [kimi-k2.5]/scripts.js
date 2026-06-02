/**
 * THE CARRION COURTS - Scripts of the Damned
 * Where code meets curse and functionality becomes fate
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initCursor();
    initAshFall();
    initSufferingMeter();
    initCounters();
    initInteractiveMap();
    initRitualCalendar();
    initAfflictionTracker();
    initScrollEffects();
    initAmbientCorruption();
    initBloodRainToggle();
});

/* ============================================
CURSOR OF THE DAMNED
Custom cursor with trailing ethereal presence
============================================ */
function initCursor() {
    const cursor = document.getElementById('cursor-sigil');
    const trail = document.getElementById('cursor-trail');
    
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor following
    function animateCursor() {
        // Linear interpolation for smooth following
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        trail.style.opacity = '0.6';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .region, .cursed-item, .ritual-date, .curse-slot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/* ============================================
ASH FALL SYSTEM
Eternal precipitation of the burned world
============================================ */
function initAshFall() {
    const container = document.getElementById('ash-fall-container');
    if (!container) return;

    const particleCount = 50;
    const particles = [];

    class AshParticle {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'ash-particle';
            this.reset();
            container.appendChild(this.element);
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = -10;
            this.speed = 0.5 + Math.random() * 1.5;
            this.drift = (Math.random() - 0.5) * 0.5;
            this.size = 1 + Math.random() * 2;
            this.life = 100 + Math.random() * 100;
            
            this.element.style.left = this.x + 'px';
            this.element.style.width = this.size + 'px';
            this.element.style.height = this.size + 'px';
            this.element.style.animationDuration = (10 + Math.random() * 10) + 's';
        }

        update() {
            this.y += this.speed;
            this.x += this.drift;
            this.life--;

            if (this.y > window.innerHeight || this.life <= 0) {
                this.reset();
            } else {
                this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            }
        }
    }

    // Create particle pool
    for (let i = 0; i < particleCount; i++) {
        particles.push(new AshParticle());
    }

    // Animation loop
    function animate() {
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
BLOOD RAIN INCURSION
Toggleable apocalyptic precipitation
============================================ */
function initBloodRainToggle() {
    const container = document.getElementById('blood-rain-container');
    if (!container) return;

    // Activate blood rain on click of suffering meter
    const meter = document.querySelector('.meter-frame');
    if (meter) {
        meter.addEventListener('click', () => {
            container.classList.toggle('active');
            if (container.classList.contains('active')) {
                createBloodDrops();
            }
        });
    }

    function createBloodDrops() {
        const dropCount = 30;
        for (let i = 0; i < dropCount; i++) {
            setTimeout(() => {
                if (!container.classList.contains('active')) return;
                
                const drop = document.createElement('div');
                drop.className = 'blood-drop';
                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
                drop.style.animationDelay = Math.random() * 2 + 's';
                container.appendChild(drop);

                setTimeout(() => drop.remove(), 3000);
            }, i * 100);
        }

        // Continue creating drops while active
        if (container.classList.contains('active')) {
            setTimeout(createBloodDrops, 3000);
        }
    }
}

/* ============================================
SUFFERING METER ANIMATION
The liquid rises, the bubbles churn
============================================ */
function initSufferingMeter() {
    const liquid = document.querySelector('.suffering-liquid');
    const bubblesContainer = document.querySelector('.bubbles-container');
    if (!liquid || !bubblesContainer) return;

    // Animate to target height
    const targetHeight = liquid.dataset.sufferingLevel || 87;
    
    setTimeout(() => {
        liquid.style.height = targetHeight + '%';
    }, 500);

    // Create suffering bubbles
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = 4 + Math.random() * 8;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '0';
        bubble.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        bubblesContainer.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 4000);
    }

    // Spawn bubbles periodically
    setInterval(() => {
        if (Math.random() > 0.3) createBubble();
    }, 800);
}

/* ============================================
AFFLICTION COUNTERS
Numbers climb like the dead from graves
============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(element, target) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            
            // Add some randomness to make it feel organic/corrupted
            if (Math.random() > 0.7) {
                current += (Math.random() - 0.5) * 10;
            }

            if (step >= steps) {
                current = target;
                clearInterval(timer);
            }

            element.textContent = Math.floor(current).toLocaleString();
        }, duration / steps);
    }
}

/* ============================================
INTERACTIVE BLIGHT MAP
Regions pulse with malignant energy
============================================ */
function initInteractiveMap() {
    const regions = document.querySelectorAll('.region');
    
    regions.forEach(region => {
        // Parallax effect on mouse move
        region.addEventListener('mousemove', (e) => {
            const rect = region.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const aura = region.querySelector('.region-aura');
            if (aura) {
                aura.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            }
        });

        // Click to reveal deeper lore
        region.addEventListener('click', () => {
            const name = region.querySelector('.region-name').textContent;
            showManifestation(`You peer into ${name}... The visions assault your sanity.`, 'vision');
        });
    });
}

/* ============================================
RITUAL CALENDAR
Countdown to inevitable doom
============================================ */
function initRitualCalendar() {
    const dates = document.querySelectorAll('.ritual-countdown');
    
    dates.forEach(date => {
        const valueEl = date.querySelector('.count-value');
        if (!valueEl) return;
        
        const targetDays = parseInt(date.dataset.days);
        if (isNaN(targetDays)) return;

        // Countdown animation
        let current = targetDays;
        const interval = setInterval(() => {
            if (Math.random() > 0.9) {
                current--;
                if (current < 0) current = 0;
                valueEl.textContent = current.toString().padStart(2, '0');
                
                // Flash effect
                valueEl.style.textShadow = '0 0 20px #ff0000';
                setTimeout(() => {
                    valueEl.style.textShadow = '';
                }, 300);
            }
        }, 2000);
    });

    // Add ominous hover sounds (visual feedback)
    const ritualDates = document.querySelectorAll('.ritual-date');
    ritualDates.forEach(date => {
        date.addEventListener('mouseenter', () => {
            date.style.transform = 'translateY(-5px) scale(1.02)';
        });
        date.addEventListener('mouseleave', () => {
            date.style.transform = '';
        });
    });
}

/* ============================================
AFFLICTION TRACKER
Manage your curses, sign your fate
============================================ */
function initAfflictionTracker() {
    const contractBtn = document.getElementById('contract-btn');
    const curseSlots = document.querySelectorAll('.curse-slot.empty');
    const soulMeter = document.querySelector('.soul-remaining');
    const soulPercent = document.querySelector('.soul-percent');
    
    if (!contractBtn) return;

    const curses = [
        { name: 'The Hollow Laugh', sigil: '☠', duration: 'Perpetual' },
        { name: 'Grave-Touched', sigil: '⚰', duration: 'Eternal' },
        { name: 'Bone-Rot', sigil: '🜏', duration: 'Terminal' },
        { name: 'Mind-Flay', sigil: '۞', duration: 'Unending' },
        { name: 'Soul-Hunger', sigil: '⚔', duration: 'Infinite' },
        { name: 'Void-Stain', sigil: '⛤', duration: 'Absolute' }
    ];

    let currentSoul = 34;
    let curseIndex = 0;

    contractBtn.addEventListener('click', () => {
        // Find empty slot
        const emptySlot = document.querySelector('.curse-slot.empty');
        if (!emptySlot) {
            showManifestation('NO VACANT CURSE SLOTS REMAIN. YOUR SOUL IS FULL.', 'error');
            return;
        }

        if (currentSoul <= 10) {
            showManifestation('WARNING: SOUL INTEGRITY CRITICAL. FURTHER CONTRACTS WILL RESULT IN IMMEDIATE HOLLOWING.', 'warning');
            return;
        }

        // Add curse
        const curse = curses[curseIndex % curses.length];
        curseIndex++;

        emptySlot.classList.remove('empty');
        emptySlot.classList.add('occupied');
        emptySlot.innerHTML = `
            <div class="curse-sigil">${curse.sigil}</div>
            <span class="curse-name">${curse.name}</span>
            <span class="curse-duration">${curse.duration}</span>
            <button class="curse-inspect" aria-label="Inspect ${curse.name}">Inspect</button>
        `;

        // Drain soul
        currentSoul -= 15;
        if (currentSoul < 0) currentSoul = 0;
        
        soulMeter.style.width = currentSoul + '%';
        soulPercent.textContent = currentSoul + '%';
        
        // Visual feedback
        soulMeter.style.filter = 'brightness(1.5)';
        setTimeout(() => soulMeter.style.filter = '', 300);

        showManifestation(`CONTRACT SIGNED: ${curse.name} has been bound to your essence.`, 'success');

        // Re-initialize inspect buttons
        initInspectButtons();
    });

    function initInspectButtons() {
        document.querySelectorAll('.curse-inspect').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const curseName = btn.previousElementSibling.previousElementSibling.textContent;
                showManifestation(`Inspecting ${curseName}... You see the threads of fate that bind you.`, 'info');
            });
        });
    }
    initInspectButtons();
}

/* ============================================
MANIFESTATION SYSTEM
Display messages from the void
============================================ */
function showManifestation(message, type = 'info') {
    const container = document.getElementById('curse-manifestation');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `manifestation ${type}`;
    el.textContent = message;
    el.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 12, 0.95);
        border: 1px solid #8b0000;
        color: #d4c5b5;
        padding: 1rem 2rem;
        font-family: 'Cinzel', serif;
        font-size: 0.9rem;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
    `;

    container.appendChild(el);
    
    // Fade in
    requestAnimationFrame(() => {
        el.style.opacity = '1';
    });

    // Fade out and remove
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
    }, 4000);
}

/* ============================================
SCROLL EFFECTS
Parallax and reveal animations
============================================ */
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add corruption effect to text
                if (entry.target.classList.contains('section-title')) {
                    corruptText(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all major sections
    document.querySelectorAll('section, article, .cursed-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Parallax for fog layer
    const fog = document.getElementById('fog-layer');
    if (fog) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            fog.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

/* ============================================
TEXT CORRUPTION EFFECT
Letters flicker between states
============================================ */
function corruptText(element) {
    const text = element.textContent;
    const chars = '☠⚰۞⛤⚔☾☽✚';
    
    // Don't corrupt if already processing
    if (element.dataset.corrupting) return;
    element.dataset.corrupting = 'true';

    let iterations = 0;
    const originalText = text;
    
    const interval = setInterval(() => {
        element.textContent = text
            .split('')
            .map((char, index) => {
                if (index < iterations) return originalText[index];
                if (char === ' ') return ' ';
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += 1/3;
        
        if (iterations >= text.length) {
            clearInterval(interval);
            element.textContent = originalText;
            delete element.dataset.corrupting;
        }
    }, 30);
}

/* ============================================
AMBIENT CORRUPTION
Random flickers and disturbances
============================================ */
function initAmbientCorruption() {
    // Random flicker on gold elements
    setInterval(() => {
        const goldElements = document.querySelectorAll('.seal-ring, .curse-tier');
        if (goldElements.length > 0 && Math.random() > 0.7) {
            const random = goldElements[Math.floor(Math.random() * goldElements.length)];
            random.style.filter = 'brightness(1.5)';
            setTimeout(() => random.style.filter = '', 100);
        }
    }, 3000);

    // Occasional screen shake
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.transform = `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`;
            setTimeout(() => {
                document.body.style.transform = '';
            }, 50);
        }
    }, 5000);

    // Random whisper text in footer
    const decayText = document.querySelector('.decay-text');
    if (decayText) {
        const whispers = [
            'The end is not coming. It has already happened.',
            'Listen to the static between thoughts.',
            'Your bones know what your mind denies.',
            'The King beneath is awake and hungry.',
            'Mercy is a memory of a gentler world.'
        ];
        
        setInterval(() => {
            if (Math.random() > 0.8) {
                decayText.style.opacity = '0';
                setTimeout(() => {
                    decayText.textContent = whispers[Math.floor(Math.random() * whispers.length)];
                    decayText.style.opacity = '0.6';
                }, 500);
            }
        }, 10000);
    }
}

/* ============================================
CURSED ARTIFACT INTERACTIONS
Hover effects for the damned relics
============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const artifacts = document.querySelectorAll('.cursed-item');
    
    artifacts.forEach(artifact => {
        artifact.addEventListener('mouseenter', () => {
            // Create temporary visual distortion
            const visual = artifact.querySelector('.item-visual');
            if (visual) {
                visual.style.filter = 'contrast(1.2) brightness(1.1) hue-rotate(10deg)';
            }
            
            // Whisper the curse name
            const name = artifact.querySelector('.item-name').textContent;
            showManifestation(`${name} calls to you...`, 'whisper');
        });
        
        artifact.addEventListener('mouseleave', () => {
            const visual = artifact.querySelector('.item-visual');
            if (visual) {
                visual.style.filter = '';
            }
        });
    });
});

/* ============================================
KEYBOARD NAVIGATION
Accessibility for the accursed
============================================ */
document.addEventListener('keydown', (e) => {
    // ESC to toggle blood rain
    if (e.key === 'Escape') {
        const bloodRain = document.getElementById('blood-rain-container');
        if (bloodRain) {
            bloodRain.classList.toggle('active');
        }
    }
    
    // Space to trigger random manifestation
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        const messages = [
            'The walls whisper when you are not listening.',
            'Something follows your cursor.',
            'Your soul feels lighter. Too light.',
            'The numbers lie. The suffering is greater.'
        ];
        showManifestation(messages[Math.floor(Math.random() * messages.length)], 'random');
    }
});
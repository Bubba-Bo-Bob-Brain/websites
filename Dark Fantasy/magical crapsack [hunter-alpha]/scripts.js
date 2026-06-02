/* ============================================
   THE BLIGHTED KINGDOMS
   Interactive Scripts
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function debounce(func, wait = 20) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function isInViewport(element, threshold = 0.15) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
    }

    // ============================================
    // EMBER PARTICLE SYSTEM
    // ============================================
    
    class EmberParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.maxParticles = 60;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isRunning = true;
            
            this.resize();
            this.init();
            this.bindEvents();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push(this.createParticle());
            }
        }

        createParticle(fromBottom = false) {
            const colors = [
                { r: 201, g: 162, b: 39 },   // Candlelight gold
                { r: 139, g: 0, b: 0 },       // Blood red
                { r: 196, g: 30, b: 30 },     // Bright red
                { r: 160, g: 125, b: 28 },    // Dim gold
                { r: 61, g: 92, b: 61 },      // Sickly green (rare)
            ];
            
            const colorWeights = [0.35, 0.25, 0.2, 0.15, 0.05];
            let random = Math.random();
            let colorIndex = 0;
            let cumulative = 0;
            
            for (let i = 0; i < colorWeights.length; i++) {
                cumulative += colorWeights[i];
                if (random <= cumulative) {
                    colorIndex = i;
                    break;
                }
            }
            
            const color = colors[colorIndex];
            const size = randomRange(1, 4);
            
            return {
                x: randomRange(0, this.canvas.width),
                y: fromBottom ? this.canvas.height + 10 : randomRange(0, this.canvas.height),
                size: size,
                speedX: randomRange(-0.3, 0.3),
                speedY: randomRange(-0.8, -0.2),
                color: color,
                alpha: randomRange(0.3, 0.9),
                alphaDecay: randomRange(0.001, 0.005),
                wobble: randomRange(0, Math.PI * 2),
                wobbleSpeed: randomRange(0.01, 0.03),
                wobbleAmount: randomRange(0.5, 2),
                life: 1,
                flicker: Math.random() > 0.7,
                flickerSpeed: randomRange(0.05, 0.15)
            };
        }

        updateParticle(particle) {
            particle.wobble += particle.wobbleSpeed;
            particle.x += particle.speedX + Math.sin(particle.wobble) * particle.wobbleAmount;
            particle.y += particle.speedY;
            particle.life -= particle.alphaDecay;
            
            // Flicker effect
            if (particle.flicker) {
                particle.alpha = particle.life * (0.5 + Math.sin(particle.wobble * particle.flickerSpeed * 50) * 0.5);
            } else {
                particle.alpha = particle.life * 0.8;
            }
            
            // Mouse interaction - gentle push
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                const force = (100 - dist) / 100;
                particle.x += (dx / dist) * force * 0.5;
                particle.y += (dy / dist) * force * 0.5;
            }
            
            return particle.life > 0 && 
                   particle.y > -20 && 
                   particle.x > -20 && 
                   particle.x < this.canvas.width + 20;
        }

        drawParticle(particle) {
            const { x, y, size, color, alpha } = particle;
            
            // Glow effect
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Core
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            this.ctx.fill();
        }

        animate() {
            if (!this.isRunning) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and filter particles
            this.particles = this.particles.filter(p => this.updateParticle(p));
            
            // Draw particles
            this.particles.forEach(p => this.drawParticle(p));
            
            // Spawn new particles
            while (this.particles.length < this.maxParticles) {
                this.particles.push(this.createParticle(true));
            }
            
            requestAnimationFrame(() => this.animate());
        }

        bindEvents() {
            window.addEventListener('resize', debounce(() => this.resize(), 100));
            
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
        }

        destroy() {
            this.isRunning = false;
            this.particles = [];
        }
    }

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    
    class TypewriterEffect {
        constructor(element, options = {}) {
            this.element = element;
            this.text = element.textContent;
            this.speed = options.speed || 30;
            this.startDelay = options.startDelay || 2500;
            this.cursor = options.cursor !== false;
            this.onComplete = options.onComplete || null;
            
            this.currentIndex = 0;
            this.isTyping = false;
            this.isComplete = false;
            
            this.init();
        }

        init() {
            this.element.textContent = '';
            
            if (this.cursor) {
                this.cursorElement = document.createElement('span');
                this.cursorElement.className = 'typewriter-cursor';
                this.element.appendChild(this.cursorElement);
            }
            
            setTimeout(() => this.start(), this.startDelay);
        }

        start() {
            this.isTyping = true;
            this.type();
        }

        type() {
            if (this.currentIndex < this.text.length) {
                const char = this.text.charAt(this.currentIndex);
                
                if (this.cursor) {
                    this.element.insertBefore(
                        document.createTextNode(char),
                        this.cursorElement
                    );
                } else {
                    this.element.textContent += char;
                }
                
                this.currentIndex++;
                
                // Variable speed for natural feel
                let delay = this.speed;
                if (char === '.' || char === '!' || char === '?') {
                    delay *= 4;
                } else if (char === ',') {
                    delay *= 2;
                } else if (char === ' ') {
                    delay *= 0.5;
                }
                
                setTimeout(() => this.type(), delay + randomRange(-10, 10));
            } else {
                this.isComplete = true;
                this.isTyping = false;
                
                // Remove cursor after a delay
                if (this.cursor) {
                    setTimeout(() => {
                        this.cursorElement.style.animation = 'none';
                        this.cursorElement.style.opacity = '0';
                    }, 2000);
                }
                
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }
    }

    // ============================================
    // SCROLL REVEAL OBSERVER
    // ============================================
    
    class ScrollRevealManager {
        constructor() {
            this.elements = [];
            this.observer = null;
            this.init();
        }

        init() {
            // Add reveal classes to elements
            this.addRevealElements();
            
            // Create intersection observer
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Trigger specific animations based on element type
                        this.triggerElementAnimation(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            // Observe all reveal elements
            this.elements.forEach(el => this.observer.observe(el));
        }

        addRevealElements() {
            // Timeline entries
            document.querySelectorAll('.timeline-entry').forEach(el => {
                this.elements.push(el);
            });
            
            // Lore stats
            document.querySelectorAll('.lore-stat').forEach(el => {
                el.classList.add('reveal');
                this.elements.push(el);
            });
            
            // Artifact cards
            document.querySelectorAll('.artifact-card').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${i * 0.1}s`;
                this.elements.push(el);
            });
            
            // Landscape cards
            document.querySelectorAll('.landscape-card').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${i * 0.15}s`;
                this.elements.push(el);
            });
            
            // Bestiary entries
            document.querySelectorAll('.bestiary-entry').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${i * 0.1}s`;
                this.elements.push(el);
            });
            
            // Breakdown items
            document.querySelectorAll('.breakdown-item').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${i * 0.08}s`;
                this.elements.push(el);
            });
            
            // Section headers
            document.querySelectorAll('.section-header').forEach(el => {
                el.classList.add('reveal');
                this.elements.push(el);
            });
            
            // Section subtitles
            document.querySelectorAll('.section-subtitle').forEach(el => {
                el.classList.add('reveal');
                this.elements.push(el);
            });
            
            // Calendar months
            document.querySelectorAll('.calendar-month').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${i * 0.15}s`;
                this.elements.push(el);
            });
            
            // Lunar display
            const lunarDisplay = document.querySelector('.lunar-display');
            if (lunarDisplay) {
                lunarDisplay.classList.add('reveal');
                this.elements.push(lunarDisplay);
            }
            
            // Affliction selector
            const afflictionSelector = document.querySelector('.affliction-selector');
            if (afflictionSelector) {
                afflictionSelector.classList.add('reveal');
                this.elements.push(afflictionSelector);
            }
        }

        triggerElementAnimation(element) {
            // Trigger counter animation for stats
            if (element.classList.contains('lore-stat')) {
                const numberEl = element.querySelector('.stat-number');
                if (numberEl && !numberEl.dataset.animated) {
                    animateCounter(numberEl);
                    numberEl.dataset.animated = 'true';
                }
            }
            
            // Trigger breakdown bar fill
            if (element.classList.contains('breakdown-item')) {
                const fill = element.querySelector('.breakdown-fill');
                const value = element.dataset.value;
                if (fill && value) {
                    setTimeout(() => {
                        fill.style.width = `${value}%`;
                    }, 200);
                }
            }
            
            // Trigger suffering meter
            if (element.classList.contains('suffering-meter-container')) {
                animateSufferingMeter();
            }
        }
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // ============================================
    // SUFFERING METER ANIMATION
    // ============================================
    
    function animateSufferingMeter() {
        const meterFill = document.getElementById('meterFill');
        const readingValue = document.getElementById('readingValue');
        const readingStatus = document.getElementById('readingStatus');
        
        if (!meterFill || meterFill.dataset.animated) return;
        meterFill.dataset.animated = 'true';
        
        const targetPercent = 73;
        const targetValue = 7342;
        const duration = 3000;
        const startTime = performance.now();
        
        const statuses = [
            { threshold: 0, text: 'Calculating...' },
            { threshold: 20, text: 'Reading entrails...' },
            { threshold: 40, text: 'Consulting the void...' },
            { threshold: 60, text: 'The suffering is immense...' },
            { threshold: 80, text: 'BEYOND MEASURE' },
            { threshold: 100, text: 'APOCALYPTIC AGONY' }
        ];
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentPercent = targetPercent * easeOutExpo;
            const currentValue = Math.round(targetValue * easeOutExpo);
            
            meterFill.style.width = `${currentPercent}%`;
            readingValue.textContent = currentValue.toLocaleString();
            
            // Update status text
            for (let i = statuses.length - 1; i >= 0; i--) {
                if (currentPercent >= statuses[i].threshold) {
                    readingStatus.textContent = statuses[i].text;
                    break;
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // ============================================
    // NAVIGATION CONTROLLER
    // ============================================
    
    class NavigationController {
        constructor() {
            this.nav = document.getElementById('mainNav');
            this.lastScrollY = 0;
            this.ticking = false;
            
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                this.lastScrollY = window.scrollY;
                
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.update();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            });
            
            // Smooth scroll for nav links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        const navHeight = this.nav.offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Active link highlighting
            this.updateActiveLink();
        }

        update() {
            const scrollY = this.lastScrollY;
            
            // Add scrolled class
            if (scrollY > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            this.updateActiveLink();
        }

        updateActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.offsetHeight;
                
                if (this.lastScrollY >= sectionTop && this.lastScrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // ============================================
    // AFFLICTION TRACKER
    // ============================================
    
    class AfflictionTracker {
        constructor() {
            this.buttons = document.querySelectorAll('.affliction-btn');
            this.panels = document.querySelectorAll('.affliction-panel');
            
            this.init();
        }

        init() {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const afflictionId = btn.dataset.affliction;
                    this.switchPanel(afflictionId);
                    this.updateButtons(btn);
                });
            });
        }

        switchPanel(afflictionId) {
            this.panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `affliction-${afflictionId}`) {
                    panel.classList.add('active');
                    
                    // Animate stat bars
                    const statBars = panel.querySelectorAll('.stat-bar-fill');
                    statBars.forEach(bar => {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 100);
                    });
                }
            });
        }

        updateButtons(activeBtn) {
            this.buttons.forEach(btn => {
                btn.classList.remove('active');
            });
            activeBtn.classList.add('active');
        }
    }

    // ============================================
    // LUNAR PHASE TRACKER
    // ============================================
    
    class LunarPhaseTracker {
        constructor() {
            this.moonPhase = document.getElementById('moonPhase');
            this.lunarName = document.getElementById('lunarName');
            this.lunarMeaning = document.getElementById('lunarMeaning');
            
            this.phases = [
                {
                    name: 'New Moon',
                    meaning: 'The darkness is absolute. The Blight stirs in its deepest slumber, and the creatures of shadow grow bold. Never travel alone during the New Moon.',
                    shadowTransform: 'translateX(-100%)'
                },
                {
                    name: 'Waxing Crescent',
                    meaning: 'A sliver of pale light returns. Small acts of magic regain their potency, but the Blight\'s servants are roused from their rest.',
                    shadowTransform: 'translateX(-60%)'
                },
                {
                    name: 'First Quarter',
                    meaning: 'Balance between light and dark. The most dangerous time — both hope and despair hold equal power. Fortunes are made and lost.',
                    shadowTransform: 'translateX(-20%)'
                },
                {
                    name: 'Waxing Gibbous',
                    meaning: 'Light grows, but so does the Blight\'s hunger. The corruption feeds on the approaching fullness, growing restless and aggressive.',
                    shadowTransform: 'translateX(20%)'
                },
                {
                    name: 'Full Moon',
                    meaning: 'The Pale Eye opens fully. All magic reaches its peak, but so does the Blight\'s awareness. It watches. It always watches.',
                    shadowTransform: 'translateX(100%)'
                },
                {
                    name: 'Waning Gibbous',
                    meaning: 'The eye begins to close. The aftermath of the Full Moon\'s power leaves the world wounded and weeping. Best time for dark rituals.',
                    shadowTransform: 'translateX(60%)'
                },
                {
                    name: 'Last Quarter',
                    meaning: 'Balance returns, but darker this time. The memory of power lingers, tempting the desperate. Many fall to corruption here.',
                    shadowTransform: 'translateX(20%)'
                },
                {
                    name: 'Waning Crescent',
                    meaning: 'A time of diminishing power — the Blight recedes slightly, offering brief respite to those who endure. Rest while you can.',
                    shadowTransform: 'translateX(-60%)'
                }
            ];
            
            this.currentPhase = 0;
            this.init();
        }

        init() {
            this.updatePhase();
            
            // Cycle through phases for demonstration
            setInterval(() => {
                this.currentPhase = (this.currentPhase + 1) % this.phases.length;
                this.updatePhase();
            }, 8000);
        }

        updatePhase() {
            const phase = this.phases[this.currentPhase];
            
            if (this.lunarName) {
                this.lunarName.style.opacity = '0';
                setTimeout(() => {
                    this.lunarName.textContent = phase.name;
                    this.lunarName.style.opacity = '1';
                }, 300);
            }
            
            if (this.lunarMeaning) {
                this.lunarMeaning.style.opacity = '0';
                setTimeout(() => {
                    this.lunarMeaning.textContent = phase.meaning;
                    this.lunarMeaning.style.opacity = '1';
                }, 400);
            }
            
            // Update moon shadow
            const moonShadow = this.moonPhase?.querySelector('.moon-shadow');
            if (moonShadow) {
                moonShadow.style.transform = phase.shadowTransform;
            }
        }
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    
    class ParallaxManager {
        constructor() {
            this.elements = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.ticking = false;
            
            this.init();
        }

        init() {
            // Add parallax to landscape cards
            document.querySelectorAll('.landscape-card').forEach(card => {
                this.elements.push({
                    element: card,
                    bg: card.querySelector('.landscape-bg'),
                    intensity: 0.02
                });
            });
            
            // Add parallax to artifact cards
            document.querySelectorAll('.artifact-card').forEach(card => {
                this.elements.push({
                    element: card,
                    glow: card.querySelector('.artifact-glow'),
                    intensity: 0.03
                });
            });
            
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.update();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            });
        }

        update() {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const deltaX = (this.mouseX - centerX) / centerX;
            const deltaY = (this.mouseY - centerY) / centerY;
            
            this.elements.forEach(item => {
                const rect = item.element.getBoundingClientRect();
                
                // Only apply parallax if element is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (item.bg) {
                        const translateX = deltaX * item.intensity * 50;
                        const translateY = deltaY * item.intensity * 50;
                        item.bg.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
                    }
                    
                    if (item.glow) {
                        const glowX = 50 + deltaX * 20;
                        const glowY = 50 + deltaY * 20;
                        item.glow.style.background = `radial-gradient(ellipse at ${glowX}% ${glowY}%, rgba(139, 0, 0, 0.2) 0%, transparent 70%)`;
                    }
                }
            });
        }
    }

    // ============================================
    // CALENDAR INTERACTIONS
    // ============================================
    
    class CalendarInteractions {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('.calendar-day[data-ritual]').forEach(day => {
                day.addEventListener('mouseenter', () => {
                    this.showTooltip(day);
                });
                
                day.addEventListener('mouseleave', () => {
                    this.hideTooltip(day);
                });
            });
        }

        showTooltip(day) {
            const event = day.querySelector('.day-event');
            if (event) {
                event.style.transform = 'scale(1.1)';
                event.style.textShadow = '0 0 10px currentColor';
            }
        }

        hideTooltip(day) {
            const event = day.querySelector('.day-event');
            if (event) {
                event.style.transform = 'scale(1)';
                event.style.textShadow = 'none';
            }
        }
    }

    // ============================================
    // ARTIFACT CARD EFFECTS
    // ============================================
    
    class ArtifactCardEffects {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('.artifact-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }
    }

    // ============================================
    // TIMELINE ANIMATION
    // ============================================
    
    class TimelineAnimation {
        constructor() {
            this.line = document.querySelector('.timeline-line');
            this.init();
        }

        init() {
            if (this.line) {
                window.addEventListener('scroll', debounce(() => {
                    this.updateLine();
                }, 10));
                
                this.updateLine();
            }
        }

        updateLine() {
            const timeline = document.querySelector('.timeline');
            if (!timeline) return;
            
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const visibleTop = Math.max(0, -rect.top + windowHeight * 0.3);
            const progress = Math.min(1, visibleTop / (rect.height - windowHeight * 0.3));
            
            this.line.style.background = `linear-gradient(180deg, 
                var(--blood) 0%, 
                var(--blood) ${progress * 100}%, 
                rgba(139, 0, 0, 0.2) ${progress * 100}%, 
                rgba(139, 0, 0, 0.2) 100%)`;
        }
    }

    // ============================================
    // AMBIENT SOUND VISUALIZER (Visual only)
    // ============================================
    
    class AmbientVisualizer {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            // Add subtle breathing animation to certain elements
            document.querySelectorAll('.section-symbol').forEach(symbol => {
                this.elements.push({
                    element: symbol,
                    baseDelay: randomRange(0, 2)
                });
            });
            
            // Add random flicker to candlelight elements
            document.querySelectorAll('.candlelight, [class*="candle"]').forEach(el => {
                el.style.animation = `candleFlicker ${randomRange(0.08, 0.15)}s ease-in-out infinite alternate`;
            });
        }
    }

    // ============================================
    // CURSOR EFFECTS
    // ============================================
    
    class CursorEffects {
        constructor() {
            this.cursor = null;
            this.cursorTrail = [];
            this.maxTrail = 5;
            this.init();
        }

        init() {
            // Create custom cursor for desktop
            if (window.innerWidth > 1024) {
                this.createCursor();
                this.bindEvents();
            }
        }

        createCursor() {
            // Main cursor
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            this.cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border: 1px solid var(--blood);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transition: transform 0.15s ease, opacity 0.15s ease;
                mix-blend-mode: difference;
            `;
            document.body.appendChild(this.cursor);
            
            // Cursor dot
            this.cursorDot = document.createElement('div');
            this.cursorDot.className = 'custom-cursor-dot';
            this.cursorDot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--candlelight);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transition: transform 0.05s ease;
            `;
            document.body.appendChild(this.cursorDot);
            
            // Trail elements
            for (let i = 0; i < this.maxTrail; i++) {
                const trail = document.createElement('div');
                trail.style.cssText = `
                    position: fixed;
                    width: ${6 - i}px;
                    height: ${6 - i}px;
                    background: var(--blood);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 99998;
                    opacity: ${0.3 - i * 0.05};
                    transition: transform ${0.1 + i * 0.05}s ease;
                `;
                document.body.appendChild(trail);
                this.cursorTrail.push({
                    element: trail,
                    x: 0,
                    y: 0
                });
            }
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                if (this.cursor) {
                    this.cursor.style.left = `${e.clientX - 10}px`;
                    this.cursor.style.top = `${e.clientY - 10}px`;
                }
                
                if (this.cursorDot) {
                    this.cursorDot.style.left = `${e.clientX - 2}px`;
                    this.cursorDot.style.top = `${e.clientY - 2}px`;
                }
                
                // Update trail with delay
                this.cursorTrail.forEach((trail, i) => {
                    setTimeout(() => {
                        trail.x = e.clientX;
                        trail.y = e.clientY;
                        trail.element.style.left = `${trail.x - (6 - i) / 2}px`;
                        trail.element.style.top = `${trail.y - (6 - i) / 2}px`;
                    }, i * 30);
                });
            });
            
            // Hover effects
            const hoverElements = document.querySelectorAll('a, button, .artifact-card, .landscape-card, .calendar-day');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    if (this.cursor) {
                        this.cursor.style.transform = 'scale(1.5)';
                        this.cursor.style.borderColor = 'var(--candlelight)';
                    }
                });
                
                el.addEventListener('mouseleave', () => {
                    if (this.cursor) {
                        this.cursor.style.transform = 'scale(1)';
                        this.cursor.style.borderColor = 'var(--blood)';
                    }
                });
            });
        }
    }

    // ============================================
    // GLITCH TEXT EFFECT (for special elements)
    // ============================================
    
    class GlitchTextEffect {
        constructor() {
            this.init();
        }

        init() {
            // Apply to "current age" timeline entry
            const nowEntry = document.querySelector('.timeline-entry-now');
            if (nowEntry) {
                const title = nowEntry.querySelector('.card-title');
                if (title) {
                    this.applyGlitch(title);
                }
            }
        }

        applyGlitch(element) {
            const text = element.textContent;
            const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
            
            element.addEventListener('mouseenter', () => {
                let iterations = 0;
                const maxIterations = text.length;
                
                const interval = setInterval(() => {
                    element.textContent = text
                        .split('')
                        .map((char, index) => {
                            if (index < iterations) {
                                return text[index];
                            }
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        })
                        .join('');
                    
                    if (iterations >= maxIterations) {
                        clearInterval(interval);
                    }
                    
                    iterations += 1/3;
                }, 30);
            });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    document.addEventListener('DOMContentLoaded', () => {
        console.log('%c⛧ The Blighted Kingdoms ⛧', 
            'color: #8b0000; font-size: 24px; font-family: serif; text-shadow: 0 0 10px #c9a227;');
        console.log('%cA World of Endless Suffering', 
            'color: #d4c5a9; font-size: 14px; font-family: serif;');
        console.log('%c"Hope is the cruelest affliction of all."', 
            'color: #6a6058; font-size: 12px; font-style: italic;');
        
        // Initialize ember particle system
        const emberCanvas = document.getElementById('ember-canvas');
        if (emberCanvas) {
            new EmberParticleSystem(emberCanvas);
        }
        
        // Initialize typewriter effect
        const typewriterElement = document.getElementById('typewriter');
        if (typewriterElement) {
            new TypewriterEffect(typewriterElement, {
                speed: 35,
                startDelay: 2800
            });
        }
        
        // Initialize scroll reveal
        new ScrollRevealManager();
        
        // Initialize navigation
        new NavigationController();
        
        // Initialize affliction tracker
        new AfflictionTracker();
        
        // Initialize lunar phase tracker
        new LunarPhaseTracker();
        
        // Initialize parallax effects
        new ParallaxManager();
        
        // Initialize calendar interactions
        new CalendarInteractions();
        
        // Initialize artifact card effects
        new ArtifactCardEffects();
        
        // Initialize timeline animation
        new TimelineAnimation();
        
        // Initialize ambient visualizer
        new AmbientVisualizer();
        
        // Initialize cursor effects
        new CursorEffects();
        
        // Initialize glitch text effect
        new GlitchTextEffect();
        
        // Add loading complete class
        document.body.classList.add('loaded');
        
        // Staggered initial reveal for hero elements
        setTimeout(() => {
            document.querySelector('.hero-content')?.classList.add('revealed');
        }, 500);
    });

    // ============================================
    // PAGE VISIBILITY HANDLER
    // ============================================
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });

})();
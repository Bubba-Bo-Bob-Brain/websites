// Main application namespace
const VeridiaApp = {
    curseLevel: 0,
    miseryLevel: 0,
    sufferingCategories: {
        physical: 0,
        emotional: 0,
        spiritual: 0
    },
    curseStage: 1,
    particles: [],
    stars: [],
    clouds: [],
    
    init() {
        this.createParticles();
        this.setupEventListeners();
        this.animateTitle();
        this.updateCurseMeter();
        this.updateMiseryLedger();
        this.setupRitualCalendar();
        this.setupCurseTracker();
        this.animateElements();
        this.startBackgroundEffects();
    },
    
    // Create floating particles
    createParticles() {
        const container = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    },
    
    // Animate main title
    animateTitle() {
        const title = document.querySelector('.title-main');
        setInterval(() => {
            const intensity = Math.sin(Date.now() / 2000) * 0.3 + 0.7;
            title.style.opacity = intensity;
        }, 50);
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
        
        // Navigation smooth scroll
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Add interactive effects to artifact cards
        document.querySelectorAll('.artifact-card').forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.triggerCurseEffect();
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            card.style.animationDelay = (index * 0.1) + 's';
        });
        
        // Calendar day interactions
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                const ritual = day.getAttribute('data-ritual');
                this.performRitual(ritual);
            });
        });
    },
    
    // Update curse meter
    updateCurseMeter() {
        const fill = document.getElementById('curseFill');
        const value = document.getElementById('curseValue');
        
        setInterval(() => {
            // Simulate curse progression
            if (Math.random() > 0.7) {
                this.curseLevel = Math.min(100, this.curseLevel + Math.random() * 5);
            } else if (Math.random() > 0.9) {
                this.curseLevel = Math.max(0, this.curseLevel - Math.random() * 3);
            }
            
            fill.style.width = this.curseLevel + '%';
            value.textContent = Math.round(this.curseLevel) + '%';
            
            // Color change based on level
            if (this.curseLevel > 70) {
                fill.style.background = 'linear-gradient(90deg, #ff0000, #8b0000, #4b0082)';
                value.style.color = '#ff0000';
                this.checkCurseAlert();
            } else if (this.curseLevel > 40) {
                fill.style.background = 'linear-gradient(90deg, #ff6600, #c4451e, #9b30ff)';
                value.style.color = '#ff6600';
            } else {
                fill.style.background = 'linear-gradient(90deg, #dc143c, #8b0000, #4b0082)';
                value.style.color = '#dc143c';
            }
        }, 2000);
    },
    
    // Check for curse alerts
    checkCurseAlert() {
        if (this.curseLevel > 70 && Math.random() > 0.95) {
            this.triggerCurseEffect();
        }
    },
    
    // Trigger visual curse effect
    triggerCurseEffect() {
        const overlay = document.getElementById('curseOverlay');
        const text = document.getElementById('curseText');
        const messages = [
            'THE CURSE AWAKENS',
            'SUFFERING INCREASES',
            'DARKNESS GATHERS',
            'FATE TURNS AGAINST YOU',
            'THE DICE OF DOOM ROLL',
            'SOULS ARE CLAIMED'
        ];
        
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 2000);
        
        // Add screen shake effect
        document.body.style.animation = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.animation = 'shake 0.5s ease';
    },
    
    // Update misery ledger
    updateMiseryLedger() {
        setInterval(() => {
            // Simulate misery accumulation
            if (Math.random() > 0.5) {
                this.miseryLevel = Math.min(100, this.miseryLevel + Math.random() * 3);
                
                // Update misery meters
                const physicalFill = document.querySelector('.physical');
                const emotionalFill = document.querySelector('.emotional');
                const spiritualFill = document.querySelector('.spiritual');
                
                this.sufferingCategories.physical = Math.min(100, this.sufferingCategories.physical + Math.random() * 5);
                this.sufferingCategories.emotional = Math.min(100, this.sufferingCategories.emotional + Math.random() * 4);
                this.sufferingCategories.spiritual = Math.min(100, this.sufferingCategories.spiritual + Math.random() * 6);
                
                if (physicalFill) physicalFill.style.width = this.sufferingCategories.physical + '%';
                if (emotionalFill) emotionalFill.style.width = this.sufferingCategories.emotional + '%';
                if (spiritualFill) spiritualFill.style.width = this.sufferingCategories.spiritual + '%';
                
                // Update stats
                document.getElementById('soulCount').textContent = Math.floor(this.miseryLevel * 10);
                document.getElementById('tormentLevel').textContent = Math.floor(this.miseryLevel / 10);
                document.getElementById('despairIndex').textContent = Math.round(this.miseryLevel) + '%';
            }
        }, 3000);
    },
    
    // Setup ritual calendar
    setupRitualCalendar() {
        // Update current date
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
        
        // Animate ritual days on hover
        document.querySelectorAll('.ritual-day').forEach(day => {
            day.addEventListener('mouseenter', () => {
                day.style.transform = 'scale(1.05)';
                day.style.boxShadow = '0 0 20px rgba(155, 48, 255, 0.5)';
            });
            
            day.addEventListener('mouseleave', () => {
                day.style.transform = 'scale(1)';
                day.style.boxShadow = 'none';
            });
        });
    },
    
    // Setup curse tracker
    setupCurseTracker() {
        const stages = document.querySelectorAll('.curse-stage');
        const dot = document.getElementById('progressDot');
        const line = document.getElementById('progressLine');
        
        // Animate progress dot
        setInterval(() => {
            const progress = (this.curseLevel / 100) * 100;
            dot.style.left = progress + '%';
            line.style.width = progress + '%';
            
            // Update stage indicators
            stages.forEach((stage, index) => {
                const stageProgress = ((index + 1) / stages.length) * 100;
                if (progress >= stageProgress - 20 && progress <= stageProgress + 20) {
                    stage.style.borderColor = '#ff0000';
                    stage.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
                } else {
                    stage.style.borderColor = '';
                    stage.style.boxShadow = '';
                }
            });
        }, 100);
    },
    
    // Animate elements on page
    animateElements() {
        // Animate mountains
        const mountains = document.querySelectorAll('.mountain');
        setInterval(() => {
            mountains.forEach(mountain => {
                const offset = Math.sin(Date.now() / 5000 + mountain.offsetWidth) * 2;
                mountain.style.transform = `translateY(${offset}px)`;
            });
        }, 50);
        
        // Animate river
        const river = document.querySelector('.cursed-river');
        setInterval(() => {
            const intensity = Math.sin(Date.now() / 1000) * 0.2 + 0.8;
            river.style.opacity = intensity;
        }, 100);
    },
    
    // Start background effects
    startBackgroundEffects() {
        // Random curse triggers
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.triggerRandomEffect();
            }
        }, 5000);
        
        // Ambient sound simulation (visual only)
        this.createAmbientVisuals();
    },
    
    // Trigger random effects
    triggerRandomEffect() {
        const effects = [
            () => this.triggerCurseEffect(),
            () => this.addFloatingText('THE DICE WHISPER...'),
            () => this.addFloatingText('SHADOWS MOVE'),
            () => this.addFloatingText('BLOOD MOON RISES')
        ];
        
        effects[Math.floor(Math.random() * effects.length)]();
    },
    
    // Add floating text
    addFloatingText(text) {
        const container = document.getElementById('particles');
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: fixed;
            color: var(--glow-red);
            font-family: 'Cinzel Decorative', serif;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9998;
            animation: floatText 2s ease-out forwards;
            text-shadow: 0 0 10px var(--glow-red);
        `;
        
        // Add keyframes dynamically
        if (!document.getElementById('floatTextKeyframes')) {
            const style = document.createElement('style');
            style.id = 'floatTextKeyframes';
            style.textContent = `
                @keyframes floatText {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        const startX = Math.random() * window.innerWidth;
        floatingText.style.left = startX + 'px';
        floatingText.style.top = (window.innerHeight + 50) + 'px';
        
        container.appendChild(floatingText);
        
        setTimeout(() => {
            if (floatingText.parentNode) {
                floatingText.parentNode.removeChild(floatingText);
            }
        }, 2000);
    },
    
    // Create ambient visual effects
    createAmbientVisuals() {
        const container = document.getElementById('particles');
        
        // Add occasional glowing particles
        setInterval(() => {
            if (Math.random() > 0.5) {
                const glow = document.createElement('div');
                glow.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: var(--glow-red);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--glow-red);
                    animation: floatParticle 3s linear forwards;
                    pointer-events: none;
                `;
                
                glow.style.left = Math.random() * 100 + 'vw';
                glow.style.top = (Math.random() * 100) + 'vh';
                
                container.appendChild(glow);
                
                setTimeout(() => {
                    if (glow.parentNode) {
                        glow.parentNode.removeChild(glow);
                    }
                }, 3000);
            }
        }, 3000);
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    VeridiaApp.init();
});

// Add shake animation for curse effects
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Add parallax effect for background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const parallaxElements = document.querySelectorAll('.sky-container, .clouds');
    
    parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
    });
});

// Add keyboard interaction for curse activation
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        VeridiaApp.triggerCurseEffect();
    }
});
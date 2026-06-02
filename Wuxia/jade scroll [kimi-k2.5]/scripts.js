/**
 * 武道真經 - The True Scripture of Martial Arts
 * Interactive Scripts for the Ancient Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    const scrollApp = new WuxiaScroll();
    scrollApp.init();
});

class WuxiaScroll {
    constructor() {
        this.currentSection = 'hero';
        this.isScrolling = false;
        this.qiParticles = [];
        this.meditationInterval = null;
        this.meditationTime = 0;
        
        // Realm data for cultivation section
        this.realmData = {
            mortal: {
                title: 'Mortal Realm',
                description: 'The beginning of all paths. The body is weak, the spirit unawakened. Only through persistent training can one glimpse the threshold of cultivation.',
                stats: { qi: 10, lifespan: 100, power: 5 }
            },
            refining: {
                title: 'Body Refining',
                description: 'Tempering flesh and bone like steel. The practitioner begins to surpass mortal limits, their skin becoming as tough as leather, muscles like iron bands.',
                stats: { qi: 30, lifespan: 120, power: 25 }
            },
            tempering: {
                title: 'Bone Tempering',
                description: 'Marrow transforms, bones become jade-like. Internal energy begins to circulate as the dantian awakens from its slumber.',
                stats: { qi: 60, lifespan: 150, power: 60 }
            },
            qi: {
                title: 'Qi Gathering',
                description: 'Heaven and earth essence converges in the body. The cultivator can sense spiritual energy and draw it into their meridians.',
                stats: { qi: 85, lifespan: 200, power: 100 }
            },
            core: {
                title: 'Core Formation',
                description: 'A golden core condenses in the dantian, the foundation of immortality. Spiritual power becomes vast and profound.',
                stats: { qi: 95, lifespan: 500, power: 300 }
            },
            nascent: {
                title: 'Nascent Soul',
                description: 'The soul takes form, separate from the physical vessel. Even if the body perishes, the soul may endure and seek rebirth.',
                stats: { qi: 98, lifespan: 1000, power: 800 }
            },
            immortal: {
                title: 'Immortal Ascension',
                description: 'The flesh transforms into immortal matter, transcending the laws of mortality. Power to sunder mountains and drain seas.',
                stats: { qi: 99, lifespan: 10000, power: 5000 }
            },
            dao: {
                title: 'Dao Fusion',
                description: 'One with the universe, indistinguishable from the Dao itself. The ultimate boundary where self becomes the infinite.',
                stats: { qi: 100, lifespan: Infinity, power: Infinity }
            }
        };

        // Meridian descriptions
        this.meridianInfo = {
            'du-mai': 'The Governing Vessel (Du Mai) runs along the spine and governs all Yang meridians. It is the sea of Yang, controlling the body\'s defensive energy and spiritual ascent.',
            'ren-mai': 'The Conception Vessel (Ren Mai) runs along the midline of the front body. It governs all Yin meridians and nourishes the internal organs.',
            'heart': 'The Heart Meridian governs the imperial fire, housing the Shen (spirit). When open, it brings clarity, wisdom, and emotional balance.',
            'lung': 'The Lung Meridian governs Qi and respiration, spreading defensive energy throughout the body like mist covering a valley.',
            'liver': 'The Liver Meridian stores blood and ensures the smooth flow of Qi. It is responsible for vision, planning, and the sinews.'
        };
    }

    init() {
        this.initNavigation();
        this.initParallax();
        this.initCultivationTree();
        this.initTechniques();
        this.initMeridians();
        this.initScrollAnimations();
        this.initQiEffects();
    }

    // Navigation Module
    initNavigation() {
        const seals = document.querySelectorAll('.seal');
        
        seals.forEach(seal => {
            seal.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
                this.updateActiveSeal(section);
            });
        });

        // Update active seal on scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.detectCurrentSection();
        }, 100));
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Offset for the scroll rollers
        const offset = 80;
        const top = section.offsetTop - offset;

        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });

        this.currentSection = sectionId;
    }

    updateActiveSeal(sectionId) {
        document.querySelectorAll('.seal').forEach(seal => {
            seal.classList.remove('active');
            if (seal.dataset.section === sectionId) {
                seal.classList.add('active');
            }
        });
    }

    detectCurrentSection() {
        const sections = document.querySelectorAll('.scroll-section');
        const scrollPos = window.scrollY + window.innerHeight / 2;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                if (this.currentSection !== section.id) {
                    this.currentSection = section.id;
                    this.updateActiveSeal(section.id);
                }
            }
        });
    }

    // Parallax Background Effects
    initParallax() {
        const layers = document.querySelectorAll('.atmosphere > div');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }, 16));

        // Mouse parallax for atmosphere
        document.addEventListener('mousemove', this.throttle((e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            
            document.querySelector('.mist-layer').style.transform = 
                `translate(${mouseX}px, ${mouseY}px)`;
        }, 16));
    }

    // Cultivation Skill Tree Module
    initCultivationTree() {
        const nodes = document.querySelectorAll('.realm-node');
        const infoPanel = document.getElementById('realm-info');
        
        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const realm = e.target.dataset.realm;
                this.showRealmInfo(realm, infoPanel);
                this.highlightPath(e.target);
                this.createQiBurst(e.target);
            });

            // Hover effects
            node.addEventListener('mouseenter', (e) => {
                this.animateNodePulse(e.target);
            });
        });

        // Animate branches on scroll
        this.observeElement('.cultivation-section', () => {
            document.querySelectorAll('.branch-path').forEach((path, index) => {
                setTimeout(() => {
                    path.style.strokeDashoffset = '0';
                }, index * 300);
            });
        });
    }

    showRealmInfo(realm, panel) {
        const data = this.realmData[realm];
        if (!data) return;

        // Update content with fade effect
        panel.style.opacity = '0';
        
        setTimeout(() => {
            panel.querySelector('.realm-title').textContent = data.title;
            panel.querySelector('.realm-description').textContent = data.description;
            
            // Update stat bars
            const stats = panel.querySelectorAll('.stat-fill');
            if (stats.length >= 3) {
                stats[0].style.width = `${data.stats.qi}%`;
                stats[1].style.width = `${Math.min(data.stats.lifespan / 10, 100)}%`;
                stats[2].style.width = `${Math.min(data.stats.power / 50, 100)}%`;
            }
            
            panel.style.opacity = '1';
        }, 200);
    }

    highlightPath(activeNode) {
        // Remove previous highlights
        document.querySelectorAll('.realm-node').forEach(n => {
            n.classList.remove('active');
        });
        
        activeNode.classList.add('active');
        
        // Animate connecting paths
        const realm = activeNode.dataset.realm;
        const connectedPaths = document.querySelectorAll(`[data-realm="${realm}"]`);
        connectedPaths.forEach(path => {
            path.style.stroke = '#b22222';
            path.style.strokeWidth = '5';
            setTimeout(() => {
                path.style.stroke = '';
                path.style.strokeWidth = '';
            }, 1000);
        });
    }

    animateNodePulse(node) {
        node.style.transform = 'scale(1.2)';
        setTimeout(() => {
            node.style.transform = '';
        }, 300);
    }

    createQiBurst(node) {
        const rect = node.getBoundingClientRect();
        const svg = document.querySelector('.skill-tree-svg');
        const pt = svg.createSVGPoint();
        pt.x = rect.left + rect.width / 2;
        pt.y = rect.top + rect.height / 2;
        
        // Create burst particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('r', '3');
            particle.setAttribute('fill', '#c9a961');
            particle.setAttribute('cx', pt.x);
            particle.setAttribute('cy', pt.y);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.transition = 'all 0.6s ease-out';
            svg.querySelector('.qi-particles').appendChild(particle);
            
            requestAnimationFrame(() => {
                particle.style.transform = `translate(${tx}px, ${ty}px)`;
                particle.style.opacity = '0';
            });
            
            setTimeout(() => particle.remove(), 600);
        }
    }

    // Techniques Module
    initTechniques() {
        const cards = document.querySelectorAll('.technique-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.showTechniqueDetail(card);
            });
            
            // Ink wash effect on hover
            card.addEventListener('mouseenter', (e) => {
                const ink = e.currentTarget.querySelector('.card-ink-wash');
                ink.style.transform = 'scale(1.5)';
                ink.style.opacity = '0.1';
            });
            
            card.addEventListener('mouseleave', (e) => {
                const ink = e.currentTarget.querySelector('.card-ink-wash');
                ink.style.transform = '';
                ink.style.opacity = '';
            });
        });
    }

    showTechniqueDetail(card) {
        const style = card.dataset.style;
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Could expand to show modal with detailed technique information
        console.log(`Studying the secrets of ${style} style...`);
    }

    // Meridians Module
    initMeridians() {
        const buttons = document.querySelectorAll('.meridian-btn');
        const points = document.querySelectorAll('.acupuncture-points circle');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meridian = e.target.dataset.meridian;
                this.highlightMeridian(meridian);
                this.updateMeridianInfo(meridian);
                
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        points.forEach(point => {
            point.addEventListener('click', (e) => {
                const pointName = e.target.dataset.point;
                this.showPointInfo(pointName);
                this.pulsePoint(e.target);
            });
        });

        // Meditation timer
        const meditateBtn = document.querySelector('.meditate-btn');
        if (meditateBtn) {
            meditateBtn.addEventListener('click', () => {
                this.toggleMeditation();
            });
        }
    }

    highlightMeridian(meridian) {
        const lines = document.querySelectorAll('.meridian-line');
        
        lines.forEach(line => {
            line.style.opacity = '0.2';
            line.style.filter = '';
        });

        if (meridian === 'all') {
            lines.forEach(line => {
                line.style.opacity = '0.6';
                line.style.animation = 'pulse 3s infinite';
            });
        } else {
            const target = document.querySelector(`.${meridian}`);
            if (target) {
                target.style.opacity = '1';
                target.style.filter = 'drop-shadow(0 0 8px currentColor)';
                target.style.strokeWidth = '5';
            }
        }
    }

    updateMeridianInfo(meridian) {
        const text = document.getElementById('meridian-text');
        const poetic = text.querySelector('.poetic-text');
        
        if (this.meridianInfo[meridian]) {
            poetic.style.opacity = '0';
            setTimeout(() => {
                poetic.innerHTML = `"${this.meridianInfo[meridian]}"`;
                poetic.style.opacity = '1';
            }, 300);
        }
    }

    showPointInfo(pointName) {
        console.log(`Activating point: ${pointName}`);
    }

    pulsePoint(point) {
        const originalR = point.getAttribute('r');
        point.setAttribute('r', '10');
        point.style.fill = '#b22222';
        
        setTimeout(() => {
            point.setAttribute('r', originalR);
            point.style.fill = '';
        }, 500);
    }

    toggleMeditation() {
        const btn = document.querySelector('.meditate-btn');
        const display = document.querySelector('.timer-display');
        
        if (this.meditationInterval) {
            // Stop meditation
            clearInterval(this.meditationInterval);
            this.meditationInterval = null;
            btn.textContent = 'Begin Circulation';
            btn.style.background = '#b22222';
            display.textContent = '00:00';
            this.meditationTime = 0;
        } else {
            // Start meditation
            btn.textContent = 'End Circulation';
            btn.style.background = '#2c2c2c';
            
            this.meditationInterval = setInterval(() => {
                this.meditationTime++;
                const mins = Math.floor(this.meditationTime / 60).toString().padStart(2, '0');
                const secs = (this.meditationTime % 60).toString().padStart(2, '0');
                display.textContent = `${mins}:${secs}`;
                
                // Visual breathing effect
                if (this.meditationTime % 4 === 0) {
                    this.createBreathingEffect();
                }
            }, 1000);
        }
    }

    createBreathingEffect() {
        const diagram = document.querySelector('.meridian-diagram');
        diagram.style.transform = 'scale(1.02)';
        setTimeout(() => {
            diagram.style.transform = '';
        }, 2000);
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger specific animations based on section
                    if (entry.target.classList.contains('technique-card')) {
                        this.staggerCards(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-section, .technique-card').forEach(el => {
            el.classList.add('scroll-hidden');
            observer.observe(el);
        });
    }

    observeElement(selector, callback) {
        const element = document.querySelector(selector);
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(element);
    }

    staggerCards(card) {
        const index = Array.from(card.parentElement.children).indexOf(card);
        card.style.animationDelay = `${index * 0.1}s`;
    }

    // Qi Energy Effects
    initQiEffects() {
        // Random ambient Qi particles
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createAmbientQi();
            }
        }, 3000);
    }

    createAmbientQi() {
        const scroll = document.querySelector('.silk-scroll');
        const particle = document.createElement('div');
        particle.className = 'ambient-qi';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(201,169,97,0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            z-index: 10;
        `;
        
        scroll.appendChild(particle);
        
        // Animate
        const duration = 5000 + Math.random() * 5000;
        particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0 },
            { transform: 'translateY(-100px) scale(1.5)', opacity: 0.8, offset: 0.5 },
            { transform: 'translateY(-200px) scale(0)', opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }

    // Utility: Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    .scroll-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .technique-card.scroll-hidden {
        transform: translateY(50px) scale(0.95);
    }
    
    .technique-card.revealed {
        transform: translateY(0) scale(1);
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
    }
    
    .realm-info-panel {
        transition: opacity 0.3s ease;
    }
    
    .poetic-text {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
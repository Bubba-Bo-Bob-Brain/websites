/* ============================================ 武经总要 — The Martial Arts Canon Scroll JavaScript Controller ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Utility Functions ---
    const debounce = (fn, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    };

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    // --- Parallax Background System ---
    class ParallaxController {
        constructor() {
            this.layers = document.querySelectorAll('.parallax-layer');
            this.ticking = false;
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            this.onScroll(); // Initial call
        }

        onScroll() {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }

        update() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            this.layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const yOffset = -(scrollY * speed);
                
                // Add subtle horizontal drift for clouds
                let xOffset = 0;
                if (layer.classList.contains('clouds-layer')) {
                    xOffset = Math.sin(scrollY * 0.002) * 20;
                }

                layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
            });
        }
    }

    // --- Qi Energy Particle System ---
    class QiParticleSystem {
        constructor() {
            this.container = document.getElementById('qiParticles');
            this.particles = [];
            this.maxParticles = 25;
            this.mouseX = 0;
            this.mouseY = 0;
            this.init();
        }

        init() {
            // Track mouse for subtle interaction
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            // Initial spawn
            for (let i = 0; i < this.maxParticles; i++) {
                this.createParticle(true);
            }

            // Continuous generation
            setInterval(() => this.maintainParticles(), 3000);
        }

        createParticle(initial = false) {
            const particle = document.createElement('div');
            particle.className = 'qi-particle';
            
            const size = Math.random() * 5 + 2;
            const startX = Math.random() * 100;
            const startY = initial ? Math.random() * 100 : 110; // Start below screen
            const duration = Math.random() * 12 + 10;
            const delay = Math.random() * 3;
            const hue = Math.random() > 0.7 ? '40, 80%, 60%' : '45, 70%, 50%'; // Gold variations

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${startX}%`;
            particle.style.top = `${startY}%`;
            particle.style.background = `radial-gradient(circle, hsla(${hue}, 0.9), transparent)`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 0.4)`;

            this.container.appendChild(particle);
            this.particles.push(particle);

            // Remove after animation completes
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                    this.particles = this.particles.filter(p => p !== particle);
                }
            }, (duration + delay) * 1000);
        }

        maintainParticles() {
            const currentCount = this.particles.length;
            if (currentCount < this.maxParticles) {
                const toAdd = this.maxParticles - currentCount;
                for (let i = 0; i < toAdd; i++) {
                    this.createParticle();
                }
            }
        }
    }

    // --- Scroll Reveal Observer ---
    class ScrollReveal {
        constructor() {
            this.sections = document.querySelectorAll('.scroll-section');
            this.navButtons = document.querySelectorAll('.seal-btn');
            this.init();
        }

        init() {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -80px 0px'
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Update active navigation
                        const id = entry.target.id;
                        this.navButtons.forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.target === id);
                        });
                    }
                });
            }, observerOptions);

            this.sections.forEach(section => sectionObserver.observe(section));

            // Also observe header for initial active state
            const header = document.querySelector('.scroll-header');
            if (header) {
                const headerObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.navButtons.forEach(btn => btn.classList.remove('active'));
                        }
                    });
                }, { threshold: 0.5 });
                headerObserver.observe(header);
            }
        }
    }

    // --- Skill Tree Interactive System ---
    class SkillTree {
        constructor() {
            this.nodes = document.querySelectorAll('.skill-node');
            this.tooltip = null;
            this.activeNode = null;
            this.init();
        }

        init() {
            // Create tooltip
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'skill-tooltip';
            this.tooltip.setAttribute('role', 'tooltip');
            document.body.appendChild(this.tooltip);

            // Node interactions
            this.nodes.forEach(node => {
                node.setAttribute('tabindex', '0');
                node.setAttribute('role', 'button');
                node.setAttribute('aria-label', 'Skill node - click for details');

                node.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.activateNode(node);
                });

                node.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.activateNode(node);
                    }
                });

                node.addEventListener('mouseenter', () => {
                    this.highlightNode(node);
                });

                node.addEventListener('mouseleave', () => {
                    if (this.activeNode !== node) {
                        this.resetNode(node);
                    }
                });
            });

            // Close tooltip on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.skill-node') && !e.target.closest('.skill-tooltip')) {
                    this.deactivateAll();
                }
            });

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.deactivateAll();
                }
            });
        }

        activateNode(node) {
            this.deactivateAll();
            this.activeNode = node;
            
            // Visual feedback
            const circle = node.querySelector('circle');
            if (circle) {
                circle.style.strokeWidth = '4';
                circle.style.stroke = 'rgba(201, 169, 89, 1)';
            }

            // Get node info
            const textEl = node.querySelector('.node-text');
            const subtextEl = node.querySelector('.node-subtext');
            const text = textEl ? textEl.textContent : 'Unknown';
            const subtext = subtextEl ? subtextEl.textContent : '';

            // Update tooltip content
            this.tooltip.innerHTML = `
                <div class="tooltip-title">${text}</div>
                <div class="tooltip-subtitle">${subtext}</div>
                <div class="tooltip-divider"></div>
                <div class="tooltip-desc">${this.getDescription(text)}</div>
            `;

            // Position tooltip
            this.positionTooltip(node);
            this.tooltip.classList.add('active');

            // Pulse animation
            node.style.transform = 'scale(1.15)';
            setTimeout(() => {
                if (node === this.activeNode) {
                    node.style.transform = 'scale(1.1)';
                }
            }, 150);
        }

        deactivateAll() {
            if (this.activeNode) {
                this.resetNode(this.activeNode);
                this.activeNode = null;
            }
            this.tooltip.classList.remove('active');
        }

        resetNode(node) {
            const circle = node.querySelector('circle');
            if (circle) {
                // Reset to original style based on class
                if (node.classList.contains('root-node-group')) {
                    circle.style.strokeWidth = '2.5';
                    circle.style.stroke = 'rgba(180, 140, 80, 0.6)';
                } else if (node.classList.contains('tier1-node')) {
                    circle.style.strokeWidth = '2';
                    circle.style.stroke = 'rgba(180, 140, 80, 0.5)';
                } else if (node.classList.contains('tier2-node')) {
                    circle.style.strokeWidth = '2';
                    circle.style.stroke = 'rgba(180, 140, 80, 0.45)';
                } else {
                    circle.style.strokeWidth = '1.8';
                    circle.style.stroke = 'rgba(180, 140, 80, 0.4)';
                }
            }
            node.style.transform = '';
        }

        highlightNode(node) {
            if (this.activeNode === node) return;
            
            const circle = node.querySelector('circle');
            if (circle) {
                circle.style.strokeWidth = '3';
                circle.style.stroke = 'rgba(201, 169, 89, 0.8)';
            }
        }

        positionTooltip(node) {
            const rect = node.getBoundingClientRect();
            const tooltipRect = this.tooltip.getBoundingClientRect();
            
            let left = rect.left + rect.width / 2 - 150; // Center horizontally (half of max-width)
            let top = rect.top - tooltipRect.height - 15;

            // Boundary checks
            if (left < 10) left = 10;
            if (left + 300 > window.innerWidth - 10) {
                left = window.innerWidth - 310;
            }
            if (top < 10) {
                top = rect.bottom + 15; // Show below instead
            }

            this.tooltip.style.left = `${left}px`;
            this.tooltip.style.top = `${top}px`;
        }

        getDescription(text) {
            const db = {
                '内功根基': 'The primordial root of all internal cultivation. Like a deep wellspring, it contains the potential for limitless growth. Master this, and all other techniques will flourish.',
                '气旋凝练': 'Spin the primordial qi into a concentrated vortex within the dantian. This technique increases energy density exponentially, forming the basis for all advanced inner arts.',
                '骨脉通玄': 'Cleanse and open the bone meridians, allowing qi to circulate through the skeletal framework. Grants immense physical strength and unbreakable bone structure.',
                '神识初醒': 'Awaken the divine consciousness. The spirit ascends from slumber, enabling perception of the spiritual realm and laying the foundation for soul-based cultivation.',
                '丹田筑基': 'Establish the golden foundation in the lower dantian. This is the crucible where qi is refined and stored, the core of one\'s internal power.',
                '经脉贯通': 'Unblock and connect all twelve primary meridians. Qi flows like a river unhindered, allowing energy to reach every extremity without resistance.',
                '灵台清明': 'Purify the spirit platform between the eyebrows. Achieve razor-sharp mental clarity, enhanced perception, and immunity to spiritual attacks.',
                '金丹大道': 'Condense qi into a golden core within the dantian. This crystallized sphere of pure energy represents a major breakthrough in cultivation, granting extended lifespan and supernatural powers.',
                '元婴显化': 'Manifest the infant spirit from the golden core. The cultivator\'s consciousness can now project beyond the physical body, enabling remote perception and spiritual travel.',
                '天人合一': 'Merge with the heavenly dao. The boundary between self and universe dissolves. The cultivator becomes one with the flow of creation itself, achieving immortality.'
            };
            return db[text] || 'An ancient technique shrouded in mystery. Only the most dedicated practitioners unlock its true potential.';
        }
    }

    // --- Navigation Controller ---
    class NavigationController {
        constructor() {
            this.buttons = document.querySelectorAll('.seal-btn');
            this.init();
        }

        init() {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetId = btn.dataset.target;
                    this.scrollToSection(targetId);
                });
            });
        }

        scrollToSection(id) {
            const section = document.getElementById(id);
            if (!section) return;

            const headerOffset = 100;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Add ripple effect to clicked seal
            const btn = document.querySelector(`.seal-btn[data-target="${id}"]`);
            if (btn) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            }
        }
    }

    // --- Ink Wash Scroll Effect ---
    class InkWashScroll {
        constructor() {
            this.splashes = document.querySelectorAll('.ink-splash');
            this.sections = document.querySelectorAll('.scroll-section');
            this.init();
        }

        init() {
            window.addEventListener('scroll', debounce(() => this.onScroll(), 16), { passive: true });
            this.onScroll();
        }

        onScroll() {
            const scrollY = window.pageYOffset;
            
            // Parallax ink splashes
            this.splashes.forEach((splash, i) => {
                const speed = (i + 1) * 0.03;
                const yPos = scrollY * speed;
                const scale = 1 + Math.sin(scrollY * 0.001) * 0.1;
                splash.style.transform = `translateY(${yPos}px) scale(${scale})`;
            });

            // Section-specific ink wash intensity
            this.sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
                
                const wash = section.querySelector('.section-content');
                if (wash && progress > 0 && progress < 1) {
                    const intensity = Math.sin(progress * Math.PI) * 0.05;
                    wash.style.background = `radial-gradient(circle at 50% 50%, rgba(26, 20, 16, ${intensity}), transparent 70%)`;
                }
            });
        }
    }

    // --- Staggered Text Animation ---
    class TextAnimator {
        constructor() {
            this.animatedElements = [];
            this.init();
        }

        init() {
            // Animate header elements
            const headerElements = document.querySelectorAll('.main-title, .subtitle, .era-tag, .header-seal');
            headerElements.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.transitionDelay = `${i * 0.15}s`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 300);
            });

            // Animate intro paragraphs
            const introTexts = document.querySelectorAll('.intro-text');
            introTexts.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.transitionDelay = `${0.8 + i * 0.2}s`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 300);
            });
        }
    }

    // --- Meridian Qi Flow Enhancement ---
    class MeridianFlow {
        constructor() {
            this.lines = document.querySelectorAll('.meridian-line');
            this.init();
        }

        init() {
            // Add random variation to animation delays
            this.lines.forEach((line, i) => {
                line.style.animationDelay = `${i * 0.5}s`;
                
                // Randomize dash array slightly for organic feel
                const dash = Math.random() * 4 + 6;
                const gap = Math.random() * 4 + 4;
                line.style.strokeDasharray = `${dash} ${gap}`;
            });

            // Mouse interaction - subtle attraction
            document.addEventListener('mousemove', debounce((e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                this.lines.forEach((line, i) => {
                    const offset = (x + y) * (i + 1) * 2;
                    line.style.strokeDashoffset = `${offset}`;
                });
            }, 50));
        }
    }

    // --- Scroll Progress Indicator (Subtle) ---
    class ScrollProgress {
        constructor() {
            this.indicator = null;
            this.init();
        }

        init() {
            // Create a subtle progress bar at the very top
            this.indicator = document.createElement('div');
            this.indicator.className = 'scroll-progress';
            this.indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 2px;
                background: linear-gradient(90deg, #8b2323, #c9a959);
                z-index: 1000;
                transition: width 0.1s ease-out;
                box-shadow: 0 0 10px rgba(201, 169, 89, 0.5);
            `;
            document.body.appendChild(this.indicator);

            window.addEventListener('scroll', debounce(() => this.update(), 16), { passive: true });
            this.update();
        }

        update() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.indicator.style.width = `${progress}%`;
        }
    }

    // --- Initialize All Systems ---
    try {
        new ParallaxController();
        new QiParticleSystem();
        new ScrollReveal();
        new SkillTree();
        new NavigationController();
        new InkWashScroll();
        new TextAnimator();
        new MeridianFlow();
        new ScrollProgress();

        console.log('%c武经总要 %c— The Martial Arts Canon %cInitialized',
            'font-family: "Ma Shan Zheng", cursive; font-size: 24px; color: #8b2323;',
            'font-family: serif; color: #c9a959;',
            'color: #6b5d4a;');
    } catch (error) {
        console.warn('Scroll initialization warning:', error);
    }
});
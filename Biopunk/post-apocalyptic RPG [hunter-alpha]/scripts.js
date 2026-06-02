/* ═══════════════════════════════════════════════════════════
   MUTAGEN — Post-Apocalyptic Biopunk RPG
   Interactive Systems & Animations
   ═══════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ── CONFIGURATION ── */
    const CONFIG = {
        particleCount: 60,
        preloaderDuration: 2500,
        scrollRevealThreshold: 0.15,
        counterDuration: 2000,
        navHideThreshold: 100
    };

    /* ── STATE ── */
    const state = {
        isLoaded: false,
        scrollY: 0,
        lastScrollY: 0,
        isNavHidden: false,
        selectedNode: null
    };

    /* ── DOM REFERENCES ── */
    const dom = {};

    /* ═══════════════════════════════════════════════════════════
       INITIALIZATION
       ═══════════════════════════════════════════════════════════ */

    function init() {
        cacheDom();
        initPreloader();
        initParticles();
        initNavigation();
        initHeroCounters();
        initMutationFilters();
        initContaminationMap();
        initEnhancementTree();
        initScrollReveal();
        initParallax();
        initTerminalTyping();
    }

    function cacheDom() {
        dom.preloader = document.getElementById('preloader');
        dom.preloaderBar = document.getElementById('preloaderBar');
        dom.preloaderPct = document.getElementById('preloaderPct');
        dom.navbar = document.getElementById('navbar');
        dom.navLinks = document.getElementById('navLinks');
        dom.navToggle = document.getElementById('navToggle');
        dom.particleCanvas = document.getElementById('bioParticles');
        dom.mutationCards = document.querySelectorAll('.mutation-card');
        dom.filterBtns = document.querySelectorAll('.filter-btn');
        dom.zoneMarkers = document.querySelectorAll('.zone-marker');
        dom.zoneCards = document.querySelectorAll('.zone-card');
        dom.treeNodes = document.querySelectorAll('.tree-node');
        dom.treeInfoPanel = document.getElementById('treeInfoPanel');
        dom.heroStats = document.querySelectorAll('.stat-num[data-target]');
        dom.revealElements = document.querySelectorAll('.section-header, .mutation-card, .survival-card, .lore-entry, .zone-card, .enhancement-tree');
        dom.heroVeins = document.querySelector('.hero-veins');
        dom.terminalLines = document.querySelectorAll('.terminal-line');
    }

    /* ═══════════════════════════════════════════════════════════
       PRELOADER
       ═══════════════════════════════════════════════════════════ */

    function initPreloader() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(hidePreloader, 300);
            }
            updatePreloader(progress);
        }, CONFIG.preloaderDuration / 8);
    }

    function updatePreloader(progress) {
        const rounded = Math.min(Math.round(progress), 100);
        if (dom.preloaderBar) {
            dom.preloaderBar.style.width = rounded + '%';
        }
        if (dom.preloaderPct) {
            dom.preloaderPct.textContent = rounded + '%';
        }
    }

    function hidePreloader() {
        if (dom.preloader) {
            dom.preloader.classList.add('hidden');
            state.isLoaded = true;
            document.body.style.overflow = '';
            triggerScrollReveal();
        }
    }

    /* ═══════════════════════════════════════════════════════════
       PARTICLE SYSTEM — Floating Bio-spores
       ═══════════════════════════════════════════════════════════ */

    function initParticles() {
        if (!dom.particleCanvas) return;

        const canvas = dom.particleCanvas;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                
                // Color variation
                const colors = [
                    { r: 57, g: 255, b: 142 },   // bio-green
                    { r: 232, g: 255, b: 62 },   // toxic-yellow
                    { r: 255, g: 107, b: 157 },  // flesh-pink
                    { r: 62, g: 191, b: 255 }    // neural-blue
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += this.pulseSpeed;

                // Wrap around screen
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas.height + 10;
                if (this.y > canvas.height + 10) this.y = -10;
            }

            draw() {
                const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7;
                const currentOpacity = this.opacity * pulseFactor;
                const currentSize = this.size * pulseFactor;

                // Glow effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, currentSize * 3
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity * 1.5})`;
                ctx.fill();
            }
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < CONFIG.particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationId = requestAnimationFrame(animate);
        }

        // Initialize
        resize();
        createParticles();
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    /* ═══════════════════════════════════════════════════════════
       NAVIGATION
       ═══════════════════════════════════════════════════════════ */

    function initNavigation() {
        if (!dom.navbar) return;

        // Mobile toggle
        if (dom.navToggle && dom.navLinks) {
            dom.navToggle.addEventListener('click', () => {
                dom.navToggle.classList.toggle('active');
                dom.navLinks.classList.toggle('active');
            });

            // Close menu when clicking a link
            dom.navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    dom.navToggle.classList.remove('active');
                    dom.navLinks.classList.remove('active');
                });
            });
        }

        // Scroll behavior
        let ticking = false;
        window.addEventListener('scroll', () => {
            state.scrollY = window.scrollY;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleNavScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = dom.navbar.offsetHeight + 20;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function handleNavScroll() {
        const scrollDelta = state.scrollY - state.lastScrollY;
        
        // Add scrolled class for background
        if (state.scrollY > 50) {
            dom.navbar.classList.add('scrolled');
        } else {
            dom.navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (scrollDelta > 10 && state.scrollY > CONFIG.navHideThreshold) {
            if (!state.isNavHidden) {
                dom.navbar.classList.add('hidden');
                state.isNavHidden = true;
            }
        } else if (scrollDelta < -10) {
            if (state.isNavHidden) {
                dom.navbar.classList.remove('hidden');
                state.isNavHidden = false;
            }
        }

        state.lastScrollY = state.scrollY;
    }

    /* ═══════════════════════════════════════════════════════════
       HERO COUNTERS
       ═══════════════════════════════════════════════════════════ */

    function initHeroCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    function animateCounters() {
        dom.heroStats.forEach(stat => {
            const target = stat.getAttribute('data-target');
            
            // Skip if target is not a number
            if (target === '∞') return;

            const targetNum = parseInt(target, 10);
            if (isNaN(targetNum)) return;

            const duration = CONFIG.counterDuration;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * targetNum);
                
                stat.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    /* ═══════════════════════════════════════════════════════════
       MUTATION FILTERS
       ═══════════════════════════════════════════════════════════ */

    function initMutationFilters() {
        dom.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                dom.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                filterMutationCards(filter);
            });
        });
    }

    function filterMutationCards(filter) {
        dom.mutationCards.forEach((card, index) => {
            const type = card.getAttribute('data-type');
            const shouldShow = filter === 'all' || type === filter;
            
            if (shouldShow) {
                card.style.display = '';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 80);
            } else {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════
       CONTAMINATION MAP
       ═══════════════════════════════════════════════════════════ */

    function initContaminationMap() {
        // Zone marker interactions
        dom.zoneMarkers.forEach(marker => {
            marker.addEventListener('mouseenter', () => {
                highlightZoneCard(marker.getAttribute('data-zone'));
            });
            
            marker.addEventListener('mouseleave', () => {
                unhighlightZoneCards();
            });

            marker.addEventListener('click', () => {
                const zone = marker.getAttribute('data-zone');
                scrollToZoneCard(zone);
            });

            // Keyboard accessibility
            marker.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const zone = marker.getAttribute('data-zone');
                    scrollToZoneCard(zone);
                }
            });
        });

        // Zone card hover effects
        dom.zoneCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const zone = card.getAttribute('data-zone');
                highlightZoneMarker(zone);
            });
            
            card.addEventListener('mouseleave', () => {
                unhighlightZoneMarkers();
            });
        });
    }

    function highlightZoneCard(zone) {
        dom.zoneCards.forEach(card => {
            if (card.getAttribute('data-zone') === zone) {
                card.style.borderColor = 'var(--bio-green)';
                card.style.background = 'rgba(57, 255, 142, 0.05)';
            }
        });
    }

    function unhighlightZoneCards() {
        dom.zoneCards.forEach(card => {
            card.style.borderColor = '';
            card.style.background = '';
        });
    }

    function highlightZoneMarker(zone) {
        dom.zoneMarkers.forEach(marker => {
            if (marker.getAttribute('data-zone') === zone) {
                const dot = marker.querySelector('.marker-dot');
                if (dot) {
                    dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
                }
            }
        });
    }

    function unhighlightZoneMarkers() {
        dom.zoneMarkers.forEach(marker => {
            const dot = marker.querySelector('.marker-dot');
            if (dot) {
                dot.style.transform = '';
            }
        });
    }

    function scrollToZoneCard(zone) {
        const card = document.querySelector(`.zone-card[data-zone="${zone}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'cardPulse 0.6s ease';
        }
    }

    /* ═══════════════════════════════════════════════════════════
       BIO-ENHANCEMENT TREE
       ═══════════════════════════════════════════════════════════ */

    function initEnhancementTree() {
        const nodeData = {
            origin: {
                icon: '◉',
                title: 'Origin Point',
                desc: 'The beginning of all mutation paths. Every enhancement stems from this nexus of biological potential.',
                prereq: 'None',
                cost: '0 Biomass',
                reversibility: 'N/A',
                stability: 'Stable'
            },
            feral: {
                icon: '🐾',
                title: 'Feral Path',
                desc: 'Embrace the beast within. Primal mutations that enhance physical prowess at the cost of higher reasoning.',
                prereq: 'Origin Point',
                cost: '150 Biomass',
                reversibility: 'Partial',
                stability: 'Volatile'
            },
            synthetic: {
                icon: '⚙',
                title: 'Synthetic Path',
                desc: 'Merge flesh with machine. Cybernetic augmentations that grant precision and cold efficiency.',
                prereq: 'Origin Point',
                cost: '200 Biomass + Components',
                reversibility: 'Irreversible',
                stability: 'Stable'
            },
            hive: {
                icon: '⬡',
                title: 'Hive Path',
                desc: 'Join the collective. Symbiotic organisms that connect you to a greater intelligence.',
                prereq: 'Origin Point',
                cost: '180 Biomass + Neural Sample',
                reversibility: 'Impossible',
                stability: 'Unknown'
            },
            predator: {
                icon: '🦷',
                title: 'Predator',
                desc: 'Enhanced hunting instincts. Night vision, heightened senses, and lethal reflexes.',
                prereq: 'Feral Path',
                cost: '250 Biomass',
                reversibility: 'Partial',
                stability: 'Unstable'
            },
            regenerator: {
                icon: '🫀',
                title: 'Regenerator',
                desc: 'Rapid cellular regeneration. Wounds heal in minutes, limbs regrow in days.',
                prereq: 'Feral Path',
                cost: '300 Biomass',
                reversibility: 'Impossible',
                stability: 'Volatile'
            },
            overclock: {
                icon: '⚡',
                title: 'Overclock',
                desc: 'Push biological limits beyond safe parameters. Superhuman speed and reflexes.',
                prereq: 'Synthetic Path',
                cost: '280 Biomass + Neural Lace',
                reversibility: 'Irreversible',
                stability: 'Critical'
            },
            ghost: {
                icon: '👁',
                title: 'Ghost Wire',
                desc: 'Become invisible to detection systems. Phase through solid matter briefly.',
                prereq: 'Synthetic Path',
                cost: '350 Biomass + Phase Crystal',
                reversibility: 'Unknown',
                stability: 'Unknown'
            },
            brood: {
                icon: '🥚',
                title: 'Brood Mind',
                desc: 'Command lesser organisms. Create and control your own biological servants.',
                prereq: 'Hive Path',
                cost: '400 Biomass + Brood Sample',
                reversibility: 'Impossible',
                stability: 'Hive-Dependent'
            },
            assimilator: {
                icon: '☣',
                title: 'Assimilator',
                desc: 'Absorb mutations from others. Consume biological material to gain its properties.',
                prereq: 'Hive Path',
                cost: '500 Biomass + Assimilation Gland',
                reversibility: 'Irreversible',
                stability: 'Chaotic'
            }
        };

        dom.treeNodes.forEach(node => {
            node.addEventListener('click', () => {
                const nodeId = node.getAttribute('data-node');
                const data = nodeData[nodeId];
                
                if (data) {
                    updateTreeInfoPanel(data);
                    selectTreeNode(node);
                }
            });

            // Keyboard accessibility
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    node.click();
                }
            });
        });
    }

    function updateTreeInfoPanel(data) {
        if (!dom.treeInfoPanel) return;

        const iconEl = dom.treeInfoPanel.querySelector('.info-panel-icon');
        const titleEl = dom.treeInfoPanel.querySelector('.info-panel-title');
        const descEl = dom.treeInfoPanel.querySelector('.info-panel-desc');
        const statsEl = dom.treeInfoPanel.querySelector('.info-panel-stats');

        if (iconEl) iconEl.textContent = data.icon;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        
        if (statsEl) {
            statsEl.style.display = 'block';
            const statVals = statsEl.querySelectorAll('.info-stat-val');
            if (statVals.length >= 4) {
                statVals[0].textContent = data.prereq;
                statVals[1].textContent = data.cost;
                statVals[2].textContent = data.reversibility;
                statVals[3].textContent = data.stability;
            }
        }

        // Animate panel
        dom.treeInfoPanel.style.animation = 'none';
        dom.treeInfoPanel.offsetHeight;
        dom.treeInfoPanel.style.animation = 'panelReveal 0.4s ease';
    }

    function selectTreeNode(selectedNode) {
        dom.treeNodes.forEach(node => {
            node.classList.remove('selected');
        });
        selectedNode.classList.add('selected');
        state.selectedNode = selectedNode.getAttribute('data-node');
    }

    /* ═══════════════════════════════════════════════════════════
       SCROLL REVEAL
       ═══════════════════════════════════════════════════════════ */

    function initScrollReveal() {
        // Add reveal class to elements
        dom.revealElements.forEach(el => {
            el.classList.add('reveal');
        });

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.scrollRevealThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        dom.revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    function triggerScrollReveal() {
        // Trigger reveal for elements already in view
        dom.revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, 200);
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════
       PARALLAX EFFECTS
       ═══════════════════════════════════════════════════════════ */

    function initParallax() {
        if (!dom.heroVeins) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
                    
                    if (scrolled < heroHeight) {
                        const parallaxValue = scrolled * 0.3;
                        dom.heroVeins.style.transform = `translateY(${parallaxValue}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════
       TERMINAL TYPING EFFECT
       ═══════════════════════════════════════════════════════════ */

    function initTerminalTyping() {
        const typingLine = document.querySelector('.terminal-line.typing');
        if (!typingLine) return;

        const messages = [
            'Scanning mutation signatures...',
            'WARNING: Anomalous bio-signatures detected',
            'The Spine is moving again',
            'New specimen catalogued: MUT-0702',
            'Contamination spreading in Sector 7',
            'Hive network activity increasing',
            'Biomass reserves critical',
            'Evolution in progress...'
        ];

        let messageIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const cursor = typingLine.querySelector('.t-cursor');
        const prompt = typingLine.querySelector('.t-prompt');

        function type() {
            const currentMessage = messages[messageIndex];
            
            if (!isDeleting) {
                charIndex++;
                if (charIndex > currentMessage.length) {
                    setTimeout(() => {
                        isDeleting = true;
                        type();
                    }, 2000);
                    return;
                }
            } else {
                charIndex--;
                if (charIndex < 0) {
                    isDeleting = false;
                    messageIndex = (messageIndex + 1) % messages.length;
                    setTimeout(type, 500);
                    return;
                }
            }

            // Update text content
            const textNode = document.createTextNode(currentMessage.substring(0, charIndex));
            typingLine.innerHTML = '';
            typingLine.appendChild(prompt);
            typingLine.appendChild(textNode);
            typingLine.appendChild(cursor);

            const speed = isDeleting ? 30 : 50 + Math.random() * 50;
            setTimeout(type, speed);
        }

        // Start typing after a delay
        setTimeout(type, 3000);
    }

    /* ═══════════════════════════════════════════════════════════
       DYNAMIC STYLES (Injected)
       ═══════════════════════════════════════════════════════════ */

    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cardPulse {
                0% { box-shadow: 0 0 0 0 rgba(57, 255, 142, 0.4); }
                70% { box-shadow: 0 0 0 15px rgba(57, 255, 142, 0); }
                100% { box-shadow: 0 0 0 0 rgba(57, 255, 142, 0); }
            }
            
            @keyframes panelReveal {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .tree-node.selected .node-core {
                border-color: var(--toxic-yellow) !important;
                box-shadow: 0 0 25px rgba(232, 255, 62, 0.5) !important;
            }
            
            .tree-node.selected .node-label {
                color: var(--toxic-yellow);
            }
            
            .mutation-card {
                transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
            
            .survival-card:hover .survival-card-title {
                color: var(--flesh-pink);
                transition: color 0.3s ease;
            }
            
            .zone-marker:focus {
                outline: none;
            }
            
            .zone-marker:focus .marker-dot {
                transform: translate(-50%, -50%) scale(1.5);
                outline: 2px solid var(--bone-white);
                outline-offset: 4px;
            }
            
            .tree-node:focus {
                outline: none;
            }
            
            .tree-node:focus .node-core {
                outline: 2px solid var(--bio-green);
                outline-offset: 4px;
            }
            
            /* Breathing animation for organic elements */
            .card-icon svg {
                animation: iconBreathe 4s ease-in-out infinite;
            }
            
            @keyframes iconBreathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* Enhanced hover for lore entries */
            .lore-entry {
                position: relative;
                overflow: hidden;
            }
            
            .lore-entry::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(57, 255, 142, 0.03), transparent);
                transition: left 0.6s ease;
            }
            
            .lore-entry:hover::before {
                left: 100%;
            }
            
            /* Glitch effect on card hover */
            .mutation-card:hover .card-title {
                animation: textGlitch 0.3s ease;
            }
            
            @keyframes textGlitch {
                0%, 100% { transform: translate(0); }
                25% { transform: translate(-2px, 1px); }
                50% { transform: translate(2px, -1px); }
                75% { transform: translate(-1px, -1px); }
            }
            
            /* Map marker connection lines */
            .zone-marker::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 1px;
                background: linear-gradient(90deg, currentColor, transparent);
                transform-origin: left center;
                opacity: 0.3;
            }
            
            /* Survival card status colors */
            .survival-card-footer .survival-status {
                transition: all 0.3s ease;
            }
            
            .survival-card:hover .survival-status {
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }

    /* ═══════════════════════════════════════════════════════════
       AMBIENT EFFECTS
       ═══════════════════════════════════════════════════════════ */

    function initAmbientEffects() {
        // Random flicker effect on certain elements
        const flickerElements = document.querySelectorAll('.status-dot, .terminal-dot.red');
        
        setInterval(() => {
            flickerElements.forEach(el => {
                if (Math.random() > 0.95) {
                    el.style.opacity = '0.3';
                    setTimeout(() => {
                        el.style.opacity = '';
                    }, 100);
                }
            });
        }, 200);

        // Subtle screen shake on critical events (simulated)
        const criticalMarkers = document.querySelectorAll('[data-zone="spine"], [data-zone="crimson"]');
        criticalMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                document.body.style.animation = 'screenShake 0.3s ease';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 300);
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       CUSTOM CURSOR TRAIL (Bio-spore effect)
       ═══════════════════════════════════════════════════════════ */

    function initCursorTrail() {
        const trail = [];
        const trailLength = 8;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: ${6 - i * 0.5}px;
                height: ${6 - i * 0.5}px;
                background: var(--bio-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.6 - i * 0.07};
                transition: transform 0.1s ease;
                box-shadow: 0 0 ${4 - i * 0.3}px var(--bio-green-glow);
            `;
            document.body.appendChild(dot);
            trail.push({ el: dot, x: 0, y: 0 });
        }

        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateTrail() {
            let prevX = mouseX;
            let prevY = mouseY;

            trail.forEach((dot, i) => {
                const speed = 0.3 - i * 0.03;
                dot.x += (prevX - dot.x) * speed;
                dot.y += (prevY - dot.y) * speed;
                dot.el.style.left = dot.x + 'px';
                dot.el.style.top = dot.y + 'px';
                prevX = dot.x;
                prevY = dot.y;
            });

            requestAnimationFrame(animateTrail);
        }

        animateTrail();

        // Hide on touch devices
        if ('ontouchstart' in window) {
            trail.forEach(dot => dot.el.style.display = 'none');
        }
    }

    /* ═══════════════════════════════════════════════════════════
       MUTATION CARD INTERACTIONS
       ═══════════════════════════════════════════════════════════ */

    function initMutationCardInteractions() {
        dom.mutationCards.forEach(card => {
            // Tilt effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });

            // Click to expand (toggle detailed view)
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       SURVIVAL CARD RANDOMIZATION
       ═══════════════════════════════════════════════════════════ */

    function initSurvivalCardEffects() {
        const cards = document.querySelectorAll('.survival-card');
        
        cards.forEach(card => {
            const envItems = card.querySelectorAll('.env-item');
            
            // Randomize environmental data on hover
            card.addEventListener('mouseenter', () => {
                envItems.forEach(item => {
                    item.style.animation = 'envFlicker 0.5s ease';
                });
            });

            card.addEventListener('mouseleave', () => {
                envItems.forEach(item => {
                    item.style.animation = '';
                });
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       KEYBOARD SHORTCUTS
       ═══════════════════════════════════════════════════════════ */

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape to close mobile menu
            if (e.key === 'Escape') {
                if (dom.navLinks?.classList.contains('active')) {
                    dom.navToggle?.classList.remove('active');
                    dom.navLinks.classList.remove('active');
                }
            }

            // Number keys for navigation
            if (e.key >= '1' && e.key <= '5') {
                const sections = ['#mutations', '#contamination', '#enhancements', '#survival', '#lore'];
                const target = document.querySelector(sections[parseInt(e.key) - 1]);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════
       PERFORMANCE MONITORING
       ═══════════════════════════════════════════════════════════ */

    function initPerformanceOptimizations() {
        // Reduce animations if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-med', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
            
            // Disable particle system
            const canvas = document.getElementById('bioParticles');
            if (canvas) canvas.style.display = 'none';
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════
       LAUNCH
       ═══════════════════════════════════════════════════════════ */

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    function bootstrap() {
        injectDynamicStyles();
        init();
        initAmbientEffects();
        initCursorTrail();
        initMutationCardInteractions();
        initSurvivalCardEffects();
        initKeyboardShortcuts();
        initPerformanceOptimizations();

        console.log(
            '%c◈ MUTAGEN SYSTEMS ONLINE %c\n' +
            '%cBiopunk RPG Archive v4.7.2\n' +
            'Mutation protocols initialized\n' +
            'Contamination sensors active\n' +
            '%c⚠ WARNING: The Spine is listening',
            'color: #39ff8e; font-size: 16px; font-weight: bold;',
            '',
            'color: #a89ea2; font-size: 11px;',
            'color: #ff2d4a; font-size: 11px; font-weight: bold;'
        );
    }

})();
/**
 * GENESIS DECAY — Biopunk RPG
 * Master JavaScript Controller
 * Handles: Loading, Cursor, Navigation, Animations, Interactions
 */

(function () {
    'use strict';

    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', () => {
        initLoadingScreen();
        initCustomCursor();
        initNavigation();
        initHeroEffects();
        initScrollReveal();
        initMutationCatalog();
        initContaminationMap();
        initTechTree();
        initCodexTabs();
        initFactionCards();
    });

    // --- Loading Screen ---
    function initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.querySelector('.loading-text');

        const loadingMessages = [
            'Initializing Genesis Strain...',
            'Scanning bio-signatures...',
            'Loading mutation catalog...',
            'Calibrating neural links...',
            'Accessing contamination data...',
            'Preparing survival protocols...',
            'System ready.'
        ];

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;

            loadingBar.style.width = `${progress}%`;

            const msgIndex = Math.min(
                Math.floor((progress / 100) * loadingMessages.length),
                loadingMessages.length - 1
            );
            loadingText.textContent = loadingMessages[msgIndex];

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    // Trigger hero animations
                    triggerHeroAnimations();
                }, 500);
            }
        }, 150);
    }

    // --- Custom Cursor ---
    function initCustomCursor() {
        const cursor = document.getElementById('cursor');
        const cursorRing = document.getElementById('cursor-ring');

        if (!cursor || !cursorRing) return;

        // Check for touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            cursor.style.display = 'none';
            cursorRing.style.display = 'none';
            return;
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .mutation-card, .tree-node, .faction-card, .zone-pulse, .zone-labels text');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }

    // --- Navigation ---
    function initNavigation() {
        const nav = document.getElementById('mainNav');
        const toggle = document.getElementById('navToggle');
        const navVeins = document.querySelector('.nav-veins');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Mobile toggle
        if (toggle) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                if (navVeins) {
                    const isVisible = navVeins.style.display === 'flex';
                    navVeins.style.display = isVisible ? 'none' : 'flex';
                    // Simple animation for mobile menu
                    if (!isVisible) {
                        navVeins.style.flexDirection = 'column';
                        navVeins.style.position = 'absolute';
                        navVeins.style.top = '100%';
                        navVeins.style.left = '0';
                        navVeins.style.right = '0';
                        navVeins.style.background = 'rgba(5, 8, 8, 0.98)';
                        navVeins.style.padding = '2rem';
                        navVeins.style.gap = '1.5rem';
                        navVeins.style.borderBottom = '1px solid rgba(0, 255, 170, 0.1)';
                        navVeins.style.animation = 'slideDown 0.3s ease forwards';
                    }
                }
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open
                    if (navVeins && window.innerWidth <= 768) {
                        navVeins.style.display = 'none';
                        toggle.classList.remove('active');
                    }
                }
            });
        });
    }

    // --- Hero Effects ---
    function initHeroEffects() {
        generateSpores();
        animateStats();
    }

    function triggerHeroAnimations() {
        // Additional hero animations can be triggered here if needed
        // CSS animations are set with delays, so this is just a hook
    }

    function generateSpores() {
        const sporeField = document.getElementById('sporeField');
        if (!sporeField) return;

        const sporeCount = 40;
        for (let i = 0; i < sporeCount; i++) {
            createSpore(sporeField);
        }
    }

    function createSpore(container) {
        const spore = document.createElement('div');
        spore.classList.add('spore');
        spore.style.left = `${Math.random() * 100}%`;
        spore.style.width = `${Math.random() * 4 + 2}px`;
        spore.style.height = spore.style.width;
        spore.style.animationDuration = `${Math.random() * 6 + 5}s`;
        spore.style.animationDelay = `${Math.random() * 5}s`;
        spore.style.opacity = Math.random() * 0.6;
        container.appendChild(spore);

        spore.addEventListener('animationend', () => {
            spore.remove();
            createSpore(container); // Recycle spore
        });
    }

    function animateStats() {
        const stats = document.querySelectorAll('.stat-value[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    animateNumber(el, 0, target, 2000);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    function animateNumber(el, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            el.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // --- Scroll Reveal ---
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.section-header, .mutation-card, .faction-card, .codex-entry, .tech-tree-container'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Trigger specific animations for children
                    if (entry.target.classList.contains('mutation-card')) {
                        triggerMutationCardAnimation(entry.target);
                    }
                    if (entry.target.classList.contains('faction-card')) {
                        triggerFactionStatAnimation(entry.target);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Mutation Catalog ---
    function initMutationCatalog() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.mutation-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Card mouse tracking for radial gradient
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }

    function triggerMutationCardAnimation(card) {
        // Animate stat bars
        const bars = card.querySelectorAll('.mut-stat-fill');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = `${bar.getAttribute('data-width')}%`;
            }, index * 100);
        });
    }

    // --- Contamination Map ---
    function initContaminationMap() {
        const zoneData = {
            'ground-zero': {
                name: 'GROUND ZERO',
                class: 'CRITICAL',
                desc: 'The epicenter of the Genesis Event. Radiation and bio-hazard levels are off the charts. Mutated mega-fauna roam the ruins of the Prometheus Facility. Survival time without Level IV protection: < 2 minutes.',
                density: '98.7%',
                rate: 'Exponential',
                survival: '0.4%'
            },
            'the-hive': {
                name: 'THE HIVE',
                class: 'HIGH',
                desc: 'A massive organic structure grown by hive-mutated subjects. Communication signals detected. Approach with extreme caution; the Hive knows you are coming.',
                density: '76.3%',
                rate: 'High',
                survival: '12.5%'
            },
            'flesh-gardens': {
                name: 'FLESH GARDENS',
                class: 'HIGH',
                desc: 'Former agricultural zone now overrun by sentient plant-animal hybrids. The flora here is carnivorous and territorial. Harvesters prize the bio-active compounds found here.',
                density: '68.1%',
                rate: 'High',
                survival: '18.2%'
            },
            'spore-marsh': {
                name: 'SPORE MARSH',
                class: 'MODERATE',
                desc: 'Wetlands saturated with airborne spores. Respiratory protection is mandatory. Strange bioluminescent fungi provide light but emit neurotoxins.',
                density: '45.5%',
                rate: 'Moderate',
                survival: '45.0%'
            },
            'bone-yard': {
                name: 'BONE YARD',
                class: 'MODERATE',
                desc: 'A graveyard of pre-outbreak vehicles and structures. Scavengers frequent this area. The ground is littered with calcified remains of early mutations.',
                density: '32.8%',
                rate: 'Low-Moderate',
                survival: '62.1%'
            },
            'safe-haven': {
                name: 'SAFE HAVEN',
                class: 'LOW',
                desc: 'A Purist-controlled settlement with heavy decontamination protocols. Trading post available. Strict entry requirements for mutated individuals.',
                density: '8.2%',
                rate: 'Negligible',
                survival: '95.5%'
            },
            'outpost-7': {
                name: 'OUTPOST 7',
                class: 'LOW',
                desc: 'Remote research station operated by the Symbiotes. Experimental treatments available. Open to all factions, but weapons must be checked.',
                density: '11.4%',
                rate: 'Low',
                survival: '88.3%'
            }
        };

        const zones = document.querySelectorAll('.zone-pulse');
        const zoneLabels = document.querySelectorAll('.zone-labels text');
        const detailPanel = document.getElementById('zoneDetail');

        function showZoneDetail(zoneId) {
            const data = zoneData[zoneId];
            if (!data || !detailPanel) return;

            detailPanel.querySelector('.zone-detail-name').textContent = data.name;
            const classEl = detailPanel.querySelector('.zone-detail-class');
            classEl.textContent = data.class;
            classEl.style.borderColor = data.class === 'CRITICAL' ? '#ff0040' :
                                        data.class === 'HIGH' ? '#ff6600' :
                                        data.class === 'MODERATE' ? '#ffcc00' : '#00ffaa';
            classEl.style.color = classEl.style.borderColor;

            detailPanel.querySelector('.zone-detail-desc').innerHTML = data.desc;
            detailPanel.querySelector('.zone-stat:nth-child(1) .zone-stat-value').textContent = data.density;
            detailPanel.querySelector('.zone-stat:nth-child(2) .zone-stat-value').textContent = data.rate;
            detailPanel.querySelector('.zone-stat:nth-child(3) .zone-stat-value').textContent = data.survival;
        }

        zones.forEach(zone => {
            zone.addEventListener('click', () => {
                const zoneId = zone.getAttribute('data-zone');
                showZoneDetail(zoneId);
            });
            zone.addEventListener('mouseenter', () => {
                const zoneId = zone.getAttribute('data-zone');
                showZoneDetail(zoneId);
            });
        });

        zoneLabels.forEach(label => {
            label.addEventListener('click', (e) => {
                const text = e.target.textContent.toLowerCase().replace(/\s+/g, '-');
                // Map text to zone ID
                const map = {
                    'ground-zero': 'ground-zero',
                    'the-hive': 'the-hive',
                    'flesh-gardens': 'flesh-gardens',
                    'spore-marsh': 'spore-marsh',
                    'bone-yard': 'bone-yard',
                    'safe-haven': 'safe-haven',
                    'outpost-7': 'outpost-7'
                };
                if (map[text]) {
                    showZoneDetail(map[text]);
                }
            });
        });
    }

    // --- Tech Tree ---
    function initTechTree() {
        const nodeData = {
            'genesis': {
                title: 'Genesis Strain',
                desc: 'The base infection. All evolutionary paths stem from this point. Exposure to the Genesis Strain initiates cellular restructuring and unlocks mutation potential.',
                req: 'None (Base Infection)',
                cost: '0 BP',
                conflict: 'None'
            },
            'somatic': {
                title: 'Somatic Branch',
                desc: 'Focuses on physical mutations and structural changes to the body. Increases durability, strength, and natural weaponry.',
                req: 'Genesis Strain',
                cost: '50 BP',
                conflict: 'Neural Branch (partial)'
            },
            'neural': {
                title: 'Neural Branch',
                desc: 'Develops cognitive and sensory mutations. Enhances perception, telepathy, and control over biological systems.',
                req: 'Genesis Strain',
                cost: '50 BP',
                conflict: 'Somatic Branch (partial)'
            },
            'symbiotic': {
                title: 'Symbiotic Branch',
                desc: 'Integration with external organisms. Allows bonding with flora and fauna for mutual benefit.',
                req: 'Genesis Strain',
                cost: '50 BP',
                conflict: 'None'
            },
            'armor': {
                title: 'Chitin Armor',
                desc: 'Develop layered chitinous plates beneath the epidermis. Provides natural armor against physical attacks.',
                req: 'Somatic Branch',
                cost: '120 BP',
                conflict: 'Bio-Weapons (cannot max both)'
            },
            'weapons': {
                title: 'Bio-Weapons',
                desc: 'Mutate limbs into natural weapons: bone blades, acid spitters, venomous stingers.',
                req: 'Somatic Branch',
                cost: '120 BP',
                conflict: 'Chitin Armor (cannot max both)'
            },
            'empathy': {
                title: 'Bio-Empathy',
                desc: 'Read the biological signals of other living things. Detect emotions, health status, and intentions.',
                req: 'Neural Branch',
                cost: '100 BP',
                conflict: 'None'
            },
            'hivemind': {
                title: 'Hive Mind',
                desc: 'Connect your consciousness to a network. Share thoughts, senses, and coordinate with other hive members.',
                req: 'Neural Branch',
                cost: '200 BP',
                conflict: 'Individualism (Lore penalty)'
            },
            'flora': {
                title: 'Flora Bond',
                desc: 'Symbiotic relationship with plant life. Can accelerate growth, extract nutrients, and camouflage.',
                req: 'Symbiotic Branch',
                cost: '100 BP',
                conflict: 'Fauna Bond (cannot max both)'
            },
            'fauna': {
                title: 'Fauna Bond',
                desc: 'Symbiotic relationship with mutated animals. Can tame, command, and merge traits with beasts.',
                req: 'Symbiotic Branch',
                cost: '100 BP',
                conflict: 'Flora Bond (cannot max both)'
            },
            'living-fortress': {
                title: 'Living Fortress',
                desc: 'Ultimate defense. Body becomes a near-impenetrable bio-structure. Regeneration and armor combined.',
                req: 'Chitin Armor (Max)',
                cost: '500 BP',
                conflict: 'Apex Predator'
            },
            'apex-predator': {
                title: 'Apex Predator',
                desc: 'Ultimate offense. Become the perfect hunter. All natural weapons enhanced with lethal efficiency.',
                req: 'Bio-Weapons (Max)',
                cost: '500 BP',
                conflict: 'Living Fortress'
            },
            'overmind': {
                title: 'The Overmind',
                desc: 'Control the swarm. Direct the actions of all hive-connected subjects within range. Absolute collective power.',
                req: 'Hive Mind (Max)',
                cost: '750 BP',
                conflict: 'Humanity (Lore: Loss of Self)'
            },
            'world-root': {
                title: 'World Root',
                desc: 'Become the ecosystem. Your consciousness spreads through plant networks. Immortality through assimilation.',
                req: 'Flora Bond (Max)',
                cost: '600 BP',
                conflict: 'Mobility (Stationary)'
            }
        };

        const nodes = document.querySelectorAll('.tree-node');
        const detailPanel = document.getElementById('enhancementDetail');

        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const nodeId = node.getAttribute('data-node');
                showNodeDetail(nodeId);
                highlightPath(nodeId);
            });
        });

        function showNodeDetail(nodeId) {
            const data = nodeData[nodeId];
            if (!data || !detailPanel) return;

            detailPanel.querySelector('.enhancement-title').textContent = data.title;
            detailPanel.querySelector('.enhancement-desc').textContent = data.desc;
            detailPanel.querySelector('.enhancement-req').textContent = `Requirements: ${data.req}`;
            detailPanel.querySelector('.enhancement-cost').textContent = `Bio-Point Cost: ${data.cost}`;
            detailPanel.querySelector('.enhancement-conflict').textContent = `Conflicts: ${data.conflict}`;

            // Visual feedback on selected node
            nodes.forEach(n => n.querySelector('.node-core').style.borderColor = '');
            const targetNode = document.querySelector(`[data-node="${nodeId}"]`);
            if (targetNode) {
                targetNode.querySelector('.node-core').style.borderColor = 'var(--color-bio-green)';
                targetNode.querySelector('.node-core').style.boxShadow = '0 0 30px var(--color-bio-green-glow)';
            }
        }

        function highlightPath(nodeId) {
            // Simple path highlighting: highlight the node and its parent recursively
            const node = document.querySelector(`[data-node="${nodeId}"]`);
            if (!node) return;

            // Reset all
            nodes.forEach(n => {
                n.style.opacity = '0.4';
                n.querySelector('.node-core').style.borderColor = '';
                n.querySelector('.node-core').style.boxShadow = '';
            });

            // Highlight path
            let current = node;
            while (current) {
                current.style.opacity = '1';
                current.querySelector('.node-core').style.borderColor = 'var(--color-bio-green)';
                current.querySelector('.node-core').style.boxShadow = '0 0 20px var(--color-bio-green-glow)';
                const parentId = current.getAttribute('data-parent');
                if (parentId) {
                    current = document.querySelector(`[data-node="${parentId}"]`);
                } else {
                    break;
                }
            }
        }
    }

    // --- Codex Tabs ---
    function initCodexTabs() {
        const tabs = document.querySelectorAll('.codex-tab');
        const panels = document.querySelectorAll('.codex-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.getAttribute('data-panel') === target) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }

    // --- Faction Cards ---
    function initFactionCards() {
        const cards = document.querySelectorAll('.faction-card');

        // Mouse tracking for glow
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }

    function triggerFactionStatAnimation(card) {
        const bars = card.querySelectorAll('.faction-stat-fill');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = `${bar.getAttribute('data-width')}%`;
            }, index * 150);
        });
    }

})();
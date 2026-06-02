/* ═══════════════════════════════════════════════════════════════════════
   CHIMERA PROTOCOL — Post-Apocalyptic Biopunk RPG Scripts
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Wait for DOM ──────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', () => {
        initParticles();
        initTypingEffect();
        initCounterAnimations();
        initMutationFilters();
        initMutationCards();
        initTechTree();
        initZoneMap();
        initBiomass();
        initNavigation();
        initScrollReveal();
        initAmbientEffects();
        initCursorEffects();
    });

    // ── 1. PARTICLE SYSTEM (Spore Atmosphere) ─────────────────────────

    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const PARTICLE_COUNT = 80;
        const COLORS = [
            'rgba(57, 255, 20,',   // bio-green
            'rgba(157, 0, 255,',    // purple
            'rgba(0, 212, 255,',    // cyan
            'rgba(255, 140, 0,',    // orange
            'rgba(255, 0, 64,',     // red
            'rgba(255, 255, 255,',  // white
        ];

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.opacity = Math.random() * 0.5 + 0.1;
                this.pulseSpeed = Math.random() * 0.02 + 0.005;
                this.pulseOffset = Math.random() * Math.PI * 2;
                this.wobbleAmp = Math.random() * 0.5 + 0.2;
                this.wobbleSpeed = Math.random() * 0.01 + 0.003;
                this.wobbleOffset = Math.random() * Math.PI * 2;
            }

            update(time) {
                this.x += this.speedX + Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmp;
                this.y += this.speedY;

                // Drift slight sine wave horizontally
                this.x += Math.sin(time * 0.001 + this.pulseOffset) * 0.15;

                // Fade in/out
                this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.pulseSpeed + this.pulseOffset));

                // Reset if off screen
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.currentOpacity + ')';
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.currentOpacity * 0.15) + ')';
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        // Draw occasional connecting lines between nearby particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(57, 255, 20, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate(timestamp) {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(timestamp);
                p.draw(ctx);
            });

            drawConnections();
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        // Resize handler
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });
    }

    // ── 2. TYPING EFFECT ───────────────────────────────────────────────

    function initTypingEffect() {
        const el = document.getElementById('typed-subtitle');
        if (!el) return;

        const phrases = [
            '"Your genome is your weapon. Your body is the battlefield."',
            '"In the ashes of the old world, evolution is no longer natural."',
            '"Every mutation is a choice. Every choice has a cost."',
            '"The Chimera Protocol does not ask if you are ready."',
            '"Adapt. Evolve. Survive. Or become biomass."',
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                el.textContent = currentPhrase.substring(0, charIndex - 1) + '_';
                charIndex--;
                timeout = isDeleting ? 25 : 40;
            } else {
                el.textContent = currentPhrase.substring(0, charIndex + 1) + '_';
                charIndex++;
                timeout = 50 + Math.random() * 50;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                timeout = 2500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                timeout = 500;
            }

            setTimeout(type, timeout);
        }

        // Start after a short delay
        setTimeout(type, 1500);
    }

    // ── 3. COUNTER ANIMATION (Hero Stats) ─────────────────────────────

    function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        let animated = false;

        function animateCounter(counter) {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(c => animateCounter(c));
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) observer.observe(heroStats);
    }

    // ── 4. MUTATION FILTERS ───────────────────────────────────────────

    function initMutationFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.mutation-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const matches = filter === 'all' || category === filter;

                    if (matches) {
                        card.style.display = '';
                        card.style.animation = 'cardFadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ── 5. MUTATION CARD INTERACTIONS ─────────────────────────────────

    function initMutationCards() {
        const cards = document.querySelectorAll('.mutation-card');

        // Add cardFadeIn keyframe dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cardFadeIn {
                from { opacity: 0; transform: scale(0.9) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
        `;
        document.head.appendChild(style);

        cards.forEach((card, index) => {
            // Stagger entrance
            card.style.animationDelay = `${index * 0.08}s`;

            // Flip on hover for desktop, click for mobile
            let isTouchDevice = false;

            card.addEventListener('mouseenter', () => {
                if (!isTouchDevice) {
                    card.classList.add('flipped');
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!isTouchDevice) {
                    card.classList.remove('flipped');
                }
            });

            card.addEventListener('click', () => {
                isTouchDevice = true;
                card.classList.toggle('flipped');
            });

            // Animate stat bars when card becomes visible
            const bars = card.querySelectorAll('.bar-fill');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bars.forEach((bar, i) => {
                            const width = bar.style.width;
                            bar.style.width = '0';
                            setTimeout(() => {
                                bar.style.width = width;
                            }, i * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(card);
        });
    }

    // ── 6. TECH TREE ──────────────────────────────────────────────────

    function initTechTree() {
        const nodes = document.querySelectorAll('.tech-node');
        const biomassCurrent = document.getElementById('biomass-current');
        const biomassFill = document.getElementById('biomass-fill');
        let biomass = 45;
        let unlocked = new Set(['core-1']); // Genome Anchor starts unlocked

        // Initial state
        nodes.forEach(node => {
            const id = node.getAttribute('data-id');
            if (unlocked.has(id)) {
                node.classList.add('unlocked');
            } else {
                node.classList.add('locked');
            }
        });

        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const id = node.getAttribute('data-id');
                const tier = parseInt(node.getAttribute('data-tier'), 10);

                if (unlocked.has(id)) {
                    showNotification('Module already unlocked', 'info');
                    return;
                }

                if (node.classList.contains('locked')) {
                    // Check tier prerequisites
                    const tier1Unlocked = unlocked.has('core-1') && unlocked.has('core-2');
                    const tier2Unlocked = unlocked.has('aug-1') || unlocked.has('aug-2') || unlocked.has('aug-3');
                    const tier3Unlocked = unlocked.size >= 5;

                    let canUnlock = false;
                    if (tier === 2 && tier1Unlocked) canUnlock = true;
                    if (tier === 3 && tier2Unlocked) canUnlock = true;
                    if (tier === 4 && tier3Unlocked) canUnlock = true;

                    if (!canUnlock) {
                        showNotification('Prerequisites not met', 'error');
                        return;
                    }

                    // Cost from tooltip
                    const costEl = node.querySelector('.node-cost');
                    const costText = costEl ? costEl.textContent : '';
                    const costMatch = costText.match(/(\d+)\s*BP/);
                    const cost = costMatch ? parseInt(costMatch[1], 10) : 0;

                    if (biomass >= cost) {
                        biomass -= cost;
                        updateBiomass();

                        node.classList.remove('locked');
                        node.classList.add('unlocked');

                        // Visual feedback
                        node.style.transform = 'scale(1.1)';
                        setTimeout(() => { node.style.transform = ''; }, 300);

                        // Burst effect
                        createBurstEffect(node);

                        showNotification('Augmentation unlocked!', 'success');
                    } else {
                        showNotification('Insufficient biomass', 'error');
                    }
                }
            });
        });

        function updateBiomass() {
            biomassCurrent.textContent = biomass;
            const percentage = (biomass / 100) * 100;
            biomassFill.style.width = percentage + '%';
        }

        function createBurstEffect(node) {
            const rect = node.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    left: ${cx}px;
                    top: ${cy}px;
                    width: 6px;
                    height: 6px;
                    background: var(--bio-green);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    box-shadow: 0 0 10px var(--bio-green);
                `;
                document.body.appendChild(particle);

                const angle = (Math.PI * 2 * i) / 12;
                const distance = 60 + Math.random() * 40;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 600 + Math.random() * 200,
                    easing: 'ease-out'
                }).onfinish = () => particle.remove();
            }
        }
    }

    // ── 7. CONTAMINATION ZONE MAP ─────────────────────────────────────

    function initZoneMap() {
        const zones = document.querySelectorAll('.zone-overlay');
        const zoneName = document.getElementById('zone-name');
        const zoneContent = document.getElementById('zone-content');
        const dangerFill = document.getElementById('danger-fill');
        const dangerValue = document.getElementById('danger-value');
        const detailPanel = document.getElementById('zone-detail');
        const closeBtn = document.getElementById('zone-close');

        const zoneData = {
            1: {
                name: 'The Spore Fields — Zone 7G',
                danger: 25,
                color: '#39ff14',
                content: `
                    <h4>Classification: LOW RISK (Class I)</h4>
                    <p>Once agricultural farmland, now overrun with bioluminescent fungal colonies. Spore concentration is moderate but manageable with standard filtration.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Edible Tubers (Harvest Rating: B+)</li>
                        <li>Clean Groundwater (3m below surface)</li>
                        <li>Salvageable Pre-War Structures</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Spore Moths (nocturnal, UV-sensitive)</li>
                        <li>Unstable terrain near fungal groves</li>
                    </ul>
                `
            },
            2: {
                name: 'Crater Vertigo — Zone 12D',
                danger: 89,
                color: '#ff0040',
                content: `
                    <h4>Classification: EXTREME (Class IV)</h4>
                    <p>Impact crater from the Second Strike. Radiation levels remain lethal at the epicenter. Mutated megafauna patrol the rim. Do not enter without Tier IV shielding.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Pre-War Military Cache (unconfirmed)</li>
                        <li>High-Grade Plutonium Deposits</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Radiation (800+ REM/hr at center)</li>
                        <li>Alpha Predators (hostile, armored)</li>
                        <li>Unstable gravitational anomalies</li>
                    </ul>
                `
            },
            3: {
                name: 'The Acid Flats — Zone 5K',
                danger: 65,
                color: '#ff8c00',
                content: `
                    <h4>Classification: HIGH (Class III)</h4>
                    <p>Vast salt plains contaminated with industrial runoff. The ground itself is mildly corrosive. Atmospheric acid fog rolls in unpredictably. Travel only during clear periods.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Chemical Processing Equipment (intact)</li>
                        <li>Acid-Resistant Alloys</li>
                        <li>Geothermal Vents (energy source)</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Acid Fog Events (every 6–8 hours)</li>
                        <li>Corrosive Slime Colonies</li>
                        <li>Rust Stalkers (ambush predators)</li>
                    </ul>
                `
            },
            4: {
                name: 'Hive Nexus Omega — Zone 0X',
                danger: 97,
                color: '#ff0040',
                content: `
                    <h4>Classification: EXTREME+ (Class IV+)</h4>
                    <p>The largest known Hive structure. Chitinous towers extend 200 meters. The central intelligence coordinates all Hive activity within a 200km radius. All previous expeditions have failed to return.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Chitinous Biomatter (extremely valuable)</li>
                        <li>Hive Communication Nodes</li>
                        <li>Unknown Organic Technology</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Hive Mind (psionic attack range)</li>
                        <li>Swarm Defense (millions of organisms)</li>
                        <li>Adaptive Immune Response</li>
                        <li>DO NOT ENGAGE — OBSERVE ONLY</li>
                    </ul>
                `
            },
            5: {
                name: 'The Whispering Grove — Zone 3V',
                danger: 45,
                color: '#9d00ff',
                content: `
                    <h4>Classification: ANOMALOUS (Class V)</h4>
                    <p>Dense forest of genetically mutated trees exhibiting collective intelligence. Visitors report auditory hallucinations and temporal displacement. Time does not flow normally here.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Psigenic Crystals (natural growth)</li>
                        <li>Temporally-Stable Flora</li>
                        <li>Anomalous Organic Compounds</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Temporal Loops (documented: 3–47 cycles)</li>
                        <li>Psychic Dampening Field</li>
                        <li>Sentient Root Network (hostile to tech)</li>
                    </ul>
                `
            },
            6: {
                name: 'Settlement Echo — Zone 2A',
                danger: 15,
                color: '#39ff14',
                content: `
                    <h4>Classification: LOW RISK (Class I)</h4>
                    <p>Remnants of a pre-war research settlement. Structures largely intact. A small community of survivors has established a trading post. Relatively safe, but trust must be earned.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Trading Post (supplies, information)</li>
                        <li>Intact Laboratory (Tier I research)</li>
                        <li>Clean Water Purifier</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Raider scouts (occasional)</li>
                        <li>Political tensions between factions</li>
                    </ul>
                `
            },
            7: {
                name: 'The Melt Coast — Zone 9M',
                danger: 72,
                color: '#ff8c00',
                content: `
                    <h4>Classification: HIGH (Class III)</h4>
                    <p>Coastal region where the sea turned acidic after the bioweapon detonations. The water glows an eerie green. Mutated marine life makes amphibious travel extremely dangerous.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Submerged Pre-War Facilities</li>
                        <li>Bio-Luminescent Fuel Source</li>
                        <li>Aquatic Biomass (harvestable)</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Acidic Water (full hazmat required)</li>
                        <li>Leviathan-class Sea Organism</li>
                        <li>Corrosive Salt Storms</li>
                    </ul>
                `
            },
            8: {
                name: 'Frozen Archive — Zone 1N',
                danger: 35,
                color: '#00d4ff',
                content: `
                    <h4>Classification: MODERATE (Class II)</h4>
                    <p>An underground cryogenic facility. The surface is frozen tundra, but the sub-levels contain preserved pre-war knowledge and genetic libraries. Cold is the primary enemy here.</p>
                    <h4>Resources:</h4>
                    <ul>
                        <li>Cryo-Preserved Genetic Archive</li>
                        <li>Advanced Medical Supplies</li>
                        <li>Pre-War AI Core (functional)</li>
                    </ul>
                    <h4>Threats:</h4>
                    <ul>
                        <li>Sub-zero Surface Temperatures</li>
                        <li>Cryogenic Defense Systems</li>
                        <li>Frozen but Not Dead Specimens</li>
                    </ul>
                `
            }
        };

        function openZone(zoneId) {
            const data = zoneData[zoneId];
            if (!data) return;

            zoneName.textContent = data.name;
            zoneName.style.color = data.color;
            zoneContent.innerHTML = data.content;
            dangerFill.style.width = data.danger + '%';
            dangerValue.textContent = data.danger + '/100';

            // Color the danger bar
            if (data.danger <= 30) {
                dangerFill.style.background = 'linear-gradient(90deg, #39ff14, #1a8a08)';
            } else if (data.danger <= 50) {
                dangerFill.style.background = 'linear-gradient(90deg, #00d4ff, #006680)';
            } else if (data.danger <= 70) {
                dangerFill.style.background = 'linear-gradient(90deg, #ff8c00, #804000)';
            } else {
                dangerFill.style.background = 'linear-gradient(90deg, #ff0040, #8a0020)';
            }

            detailPanel.classList.add('active');
            detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        zones.forEach(zone => {
            zone.addEventListener('mouseenter', () => {
                const id = zone.getAttribute('data-zone');
                openZone(id);
            });

            zone.addEventListener('click', () => {
                const id = zone.getAttribute('data-zone');
                openZone(id);
            });
        });

        closeBtn.addEventListener('click', () => {
            detailPanel.classList.remove('active');
        });
    }

    // ── 8. BIOMASS REGENERATION ────────────────────────────────────────

    function initBiomass() {
        const btn = document.getElementById('biomass-regen');
        const fill = document.getElementById('biomass-fill');
        const current = document.getElementById('biomass-current');
        let biomass = 45;

        btn.addEventListener('click', () => {
            if (biomass >= 100) {
                showNotification('Biomass pool is full', 'info');
                return;
            }

            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.querySelector('span').textContent = 'Regenerating...';

            const interval = setInterval(() => {
                biomass = Math.min(biomass + 2, 100);
                current.textContent = biomass;
                fill.style.width = biomass + '%';

                if (biomass >= 100) {
                    clearInterval(interval);
                    btn.querySelector('span').textContent = 'Biomass Full';
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.style.opacity = '';
                        btn.querySelector('span').textContent = 'Regenerate Biomass';
                    }, 1500);
                    showNotification('Biomass pool regenerated!', 'success');
                }
            }, 150);
        });
    }

    // ── 9. NAVIGATION ──────────────────────────────────────────────────

    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        function updateActiveLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();

        // Smooth scroll with offset for fixed nav
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    const navHeight = document.querySelector('.main-nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    // ── 10. SCROLL REVEAL ──────────────────────────────────────────────

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.mutations-section, .tech-tree-section, .contamination-section, .survival-section, .factions-section, .cta-section, .main-footer').forEach(el => {
            el.style.opacity = '0';
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // ── 11. AMBIENT EFFECTS ────────────────────────────────────────────

    function initAmbientEffects() {
        // Subtle background pulse
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let hue = 0;
        function ambientPulse() {
            hue = (hue + 0.05) % 360;
            // Very subtle color shift on the organic blobs
            requestAnimationFrame(ambientPulse);
        }
        ambientPulse();

        // Add floating spore motes to sections
        const sections = document.querySelectorAll('.mutations-section, .tech-tree-section, .contamination-section');
        sections.forEach(section => {
            for (let i = 0; i < 5; i++) {
                const mote = document.createElement('div');
                mote.style.cssText = `
                    position: absolute;
                    width: ${2 + Math.random() * 3}px;
                    height: ${2 + Math.random() * 3}px;
                    background: rgba(57, 255, 20, ${0.1 + Math.random() * 0.2});
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    pointer-events: none;
                    animation: moteFloat ${3 + Math.random() * 5}s ease-in-out infinite;
                    animation-delay: ${-Math.random() * 5}s;
                    box-shadow: 0 0 6px rgba(57, 255, 20, 0.3);
                `;
                section.style.position = 'relative';
                section.appendChild(mote);
            }
        });

        // Inject keyframes for mote animation
        const moteStyle = document.createElement('style');
        moteStyle.textContent = `
            @keyframes moteFloat {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
                25% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
                50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
                75% { transform: translateY(-25px) translateX(15px); opacity: 0.6; }
            }
        `;
        document.head.appendChild(moteStyle);
    }

    // ── 12. CURSOR EFFECT ─────────────────────────────────────────────

    function initCursorEffects() {
        // Only on non-touch devices
        if ('ontouchstart' in window) return;

        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 1.5px solid rgba(57, 255, 20, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10001;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s, box-shadow 0.3s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        const follower = document.createElement('div');
        follower.id = 'cursor-follower';
        follower.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--bio-green);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10002;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px var(--bio-green);
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(follower);

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects on interactive elements
        const interactiveEls = document.querySelectorAll(
            'a, button, .mutation-card, .tech-node, .faction-card, .nav-link, .filter-btn'
        );

        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = 'rgba(57, 255, 20, 0.9)';
                cursor.style.boxShadow = '0 0 20px var(--bio-green-glow)';
                follower.style.transform = 'translate(-50%, -50%) scale(2)';
                follower.style.boxShadow = '0 0 20px var(--bio-green)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderColor = 'rgba(57, 255, 20, 0.6)';
                cursor.style.boxShadow = 'none';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.boxShadow = '0 0 10px var(--bio-green)';
            });
        });
    }

    // ── NOTIFICATION SYSTEM ────────────────────────────────────────────

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        const colors = {
            success: { bg: 'rgba(57, 255, 20,', border: '#39ff14', text: '#39ff14' },
            error: { bg: 'rgba(255, 0, 64,', border: '#ff0040', text: '#ff0040' },
            info: { bg: 'rgba(0, 212, 255,', border: '#00d4ff', text: '#00d4ff' },
        };

        const c = colors[type] || colors.info;

        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 30px;
            background: ${c.bg}0.15);
            backdrop-filter: blur(20px);
            border: 1px solid ${c.border};
            border-left: 3px solid ${c.border};
            color: ${c.text};
            padding: 16px 24px;
            border-radius: 4px;
            font-family: 'VT323', monospace;
            font-size: 1.1rem;
            letter-spacing: 1px;
            z-index: 100000;
            box-shadow: 0 0 30px ${c.bg}0.2), inset 0 0 20px ${c.bg}0.05);
            animation: notifIn 0.4s ease forwards;
            max-width: 350px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'notifOut 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 3000);

        // Inject keyframes if not already present
        if (!document.getElementById('notif-keyframes')) {
            const kf = document.createElement('style');
            kf.id = 'notif-keyframes';
            kf.textContent = `
                @keyframes notifIn {
                    from { opacity: 0; transform: translateX(60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes notifOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(60px); }
                }
            `;
            document.head.appendChild(kf);
        }
    }

    // ── EXPOSE NOTIFICATION GLOBALLY for tech tree ────────────────────
    window.showNotification = showNotification;

})();
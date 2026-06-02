/**
 * ÆTHER ARCHIVE - INTERACTIVE SYSTEMS
 * Institute of Forbidden Cartography
 * 
 * WARNING: Execution of these functions may induce:
 * - Reality slippage
 * - Spontaneous pattern recognition in noise
 * - The sensation of being observed
 */

const Archive = (function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION & STATE
    // ═══════════════════════════════════════════════════════════════
    
    const config = {
        sanity: {
            current: 100,
            max: 100,
            min: 0,
            decayRate: 0.05, // Sanity loss per scroll pixel
            criticalThreshold: 30,
            breakdownThreshold: 10
        },
        corruption: {
            chars: '▓░▒█■□▪▫◊○●◦†‡§¶',
            glitchChars: '҉҈҂҃҄҅҆҇҉̷̴̵̶̷̸̷̴̵̶̷̸̡̢̧̨̛̛̖̗̘̙̜̝̞̟̚',
            scrambleSpeed: 50
        },
        void: {
            starCount: 150,
            tentacleSegments: 20
        }
    };

    const state = {
        scrolled: 0,
        maxScroll: 0,
        mouseX: 0,
        mouseY: 0,
        isVeilBreached: false,
        activeSection: null,
        glitchIntensity: 0,
        audioContext: null,
        whispers: []
    };

    // ═══════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    const utils = {
        // Generate random character from string
        randomChar: (str) => str[Math.floor(Math.random() * str.length)],
        
        // Clamp value between min and max
        clamp: (val, min, max) => Math.min(Math.max(val, min), max),
        
        // Random range
        random: (min, max) => Math.random() * (max - min) + min,
        
        // Easing function for smooth animations
        ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        
        // Debounce function
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Text scrambling with callback
        scrambleText: (element, originalText, duration = 1000, callback) => {
            const chars = config.corruption.chars;
            const steps = duration / config.corruption.scrambleSpeed;
            let step = 0;
            
            const interval = setInterval(() => {
                let corrupted = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (originalText[i] === ' ') {
                        corrupted += ' ';
                    } else if (step / steps > i / originalText.length) {
                        corrupted += originalText[i];
                    } else {
                        corrupted += utils.randomChar(chars);
                    }
                }
                element.textContent = corrupted;
                step++;
                
                if (step >= steps) {
                    clearInterval(interval);
                    element.textContent = originalText;
                    if (callback) callback();
                }
            }, config.corruption.scrambleSpeed);
        },

        // Generate disturbing search result based on query and sanity
        generateResult: (query, sanity) => {
            const templates = [
                { title: "Subject #{id}: {name}", desc: "Last seen {location}. {condition}." },
                { title: "Incident Report #{id}", desc: "Witness describes {phenomenon}. Status: {status}." },
                { title: "Artifact #{id}: {object}", desc: "Recovered from {location}. Do not {action}." },
                { title: "Stellar Anomaly {designation}", desc: "Emits {radiation}. Distance: {distance}." }
            ];

            const subjects = ["Carter", "Velasquez", "Subject 7", "Agent Vance", "Unknown", "[REDACTED]"];
            const locations = ["the void", "sub-basement 4", "R'lyeh coordinates", "the space between", "your current location"];
            const conditions = ["Sanity compromised", "Never existed", "Watching you now", "Transcended", "HUNGRY"];
            const phenomena = ["impossible geometry", "non-Euclidean angles", "the color that watches", "temporal recursion", "self-awareness in the archive"];
            const objects = ["stone tablet", "living compass", "mirror that remembers", "book with no pages", "your reflection"];
            const actions = ["read aloud", "observe directly", "think about", "acknowledge", "breathe near"];
            const statuses = ["Uncontained", "Everywhere", "Behind you", "Waiting", "Active"];
            const radiations = ["audible light", "consciousness", "geometric fear", "temporal bleed", "██████"];
            const distances = ["impossible", "negative", "inside you", "simultaneous", "approaching"];

            const template = templates[Math.floor(Math.random() * templates.length)];
            const id = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            
            let corruption = '';
            if (sanity < 50) corruption = ' [CORRUPTED]';
            if (sanity < 20) corruption = ' [IT KNOWS]';
            if (sanity < 10) corruption = ' [RUN]';

            const fillTemplate = (str) => {
                return str
                    .replace('{id}', id)
                    .replace('{name}', subjects[Math.floor(Math.random() * subjects.length)])
                    .replace('{location}', locations[Math.floor(Math.random() * locations.length)])
                    .replace('{condition}', conditions[Math.floor(Math.random() * conditions.length)])
                    .replace('{phenomenon}', phenomena[Math.floor(Math.random() * phenomena.length)])
                    .replace('{status}', statuses[Math.floor(Math.random() * statuses.length)])
                    .replace('{object}', objects[Math.floor(Math.random() * objects.length)])
                    .replace('{action}', actions[Math.floor(Math.random() * actions.length)])
                    .replace('{radiation}', radiations[Math.floor(Math.random() * radiations.length)])
                    .replace('{distance}', distances[Math.floor(Math.random() * distances.length)])
                    .replace('{designation}', 'X-' + Math.floor(Math.random() * 999) + '-Ω');
            };

            return {
                title: fillTemplate(template.title) + corruption,
                description: fillTemplate(template.desc),
                sanity: sanity
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SANITY SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const SanitySystem = {
        init() {
            this.bar = document.getElementById('sanity-bar');
            this.percentage = document.getElementById('sanity-percentage');
            this.label = document.querySelector('.sanity-label');
            this.html = document.documentElement;
            this.lastUpdate = Date.now();
        },

        update(value) {
            config.sanity.current = utils.clamp(value, config.sanity.min, config.sanity.max);
            
            // Update visual elements
            if (this.bar) {
                this.bar.style.width = `${config.sanity.current}%`;
            }
            if (this.percentage) {
                this.percentage.textContent = `${Math.floor(config.sanity.current)}%`;
                
                // Corrupt percentage text at low sanity
                if (config.sanity.current < 30) {
                    this.percentage.style.color = '#ff3333';
                    if (Math.random() > 0.7) {
                        this.percentage.textContent = 'ERR%';
                    }
                }
            }

            // Update HTML data attribute for CSS hooks
            this.html.setAttribute('data-sanity', Math.floor(config.sanity.current));
            
            // Corrupt label at low sanity
            if (config.sanity.current < 50 && this.label) {
                if (Math.random() > 0.9) {
                    this.label.classList.add('corrupted');
                    this.label.textContent = 'COHERENCE';
                    setTimeout(() => {
                        this.label.classList.remove('corrupted');
                        this.label.textContent = 'COHERENCE';
                    }, 500);
                }
            }

            // Trigger critical effects
            if (config.sanity.current <= config.sanity.breakdownThreshold) {
                this.triggerBreakdown();
            }
        },

        decay(amount) {
            this.update(config.sanity.current - amount);
        },

        restore(amount) {
            this.update(config.sanity.current + amount);
        },

        triggerBreakdown() {
            // Visual breakdown effects
            if (Math.random() > 0.95) {
                GlitchSystem.triggerMajorGlitch();
            }
            
            // Whispers intensify
            if (AudioSystem && AudioSystem.whisperGain) {
                AudioSystem.whisperGain.gain.value = 0.3;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STARFIELD SYSTEM (Canvas)
    // ═══════════════════════════════════════════════════════════════

    const Starfield = {
        init() {
            this.canvas = document.getElementById('starfield');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.resize();
            
            // Create stars
            for (let i = 0; i < config.void.starCount; i++) {
                this.stars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    z: Math.random() * 2 + 0.5, // depth
                    size: Math.random() * 2,
                    pulse: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.2 + 0.1
                });
            }

            window.addEventListener('resize', () => this.resize());
            this.animate();
        },

        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        },

        animate() {
            this.ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
            this.ctx.fillRect(0, 0, this.width, this.height);

            const sanityFactor = (100 - config.sanity.current) / 100;
            
            this.stars.forEach(star => {
                // Update position
                star.x -= star.speed * (1 + sanityFactor * 2);
                star.pulse += 0.02;
                
                // Wrap around
                if (star.x < 0) star.x = this.width;
                
                // Draw star
                const brightness = 0.5 + Math.sin(star.pulse) * 0.5;
                const color = sanityFactor > 0.5 ? 
                    `rgba(255, 50, 50, ${brightness})` : 
                    `rgba(80, 200, 120, ${brightness})`;
                
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
                this.ctx.fill();

                // Connect nearby stars at low sanity (constellation effect)
                if (sanityFactor > 0.3) {
                    this.stars.forEach(other => {
                        const dx = star.x - other.x;
                        const dy = star.y - other.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 50 * sanityFactor && dist > 0) {
                            this.ctx.strokeStyle = `rgba(80, 200, 120, ${0.1 * sanityFactor})`;
                            this.ctx.lineWidth = 0.5;
                            this.ctx.beginPath();
                            this.ctx.moveTo(star.x, star.y);
                            this.ctx.lineTo(other.x, other.y);
                            this.ctx.stroke();
                        }
                    });
                }
            });

            // Occasional "anomalies" - stars that move wrong
            if (sanityFactor > 0.6 && Math.random() > 0.99) {
                const anomaly = this.stars[Math.floor(Math.random() * this.stars.length)];
                anomaly.x += utils.random(-10, 10);
                anomaly.y += utils.random(-10, 10);
            }

            requestAnimationFrame(() => this.animate());
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // TEXT CORRUPTION SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const TextCorruption = {
        init() {
            // Initialize hover corruption for corruptible texts
            document.querySelectorAll('.corruptible-text').forEach(el => {
                el.addEventListener('mouseenter', (e) => this.corrupt(e.target));
                el.addEventListener('mouseleave', (e) => this.restore(e.target));
            });

            // Initialize data-corrupt elements
            document.querySelectorAll('[data-corrupt]').forEach(el => {
                const original = el.getAttribute('data-corrupt');
                el.addEventListener('mouseenter', () => {
                    utils.scrambleText(el, original, 500);
                });
            });

            // Store originals
            document.querySelectorAll('.corruptible-text').forEach(el => {
                el.dataset.original = el.textContent;
            });
        },

        corrupt(element) {
            if (!element.dataset.original) return;
            
            const original = element.dataset.original;
            const level = element.closest('[data-corruption-level]')?.dataset.corruptionLevel || 'low';
            
            let corruption = '';
            for (let char of original) {
                if (char === ' ') {
                    corruption += ' ';
                } else if (Math.random() < 0.3) {
                    corruption += utils.randomChar(config.corruption.chars);
                } else {
                    corruption += char;
                }
            }

            // High corruption adds glitchy unicode
            if (level === 'high' && config.sanity.current < 50) {
                corruption = corruption.split('').map(c => 
                    Math.random() < 0.2 ? utils.randomChar(config.corruption.glitchChars) : c
                ).join('');
            }

            element.textContent = corruption;
            element.style.textShadow = '0 0 5px rgba(80, 200, 120, 0.5)';
        },

        restore(element) {
            if (element.dataset.original) {
                element.textContent = element.dataset.original;
                element.style.textShadow = '';
            }
        },

        // Global corruption effect at low sanity
        randomCorruption() {
            if (config.sanity.current > 70) return;
            
            const texts = document.querySelectorAll('.corruptible-text');
            if (texts.length === 0) return;
            
            const victim = texts[Math.floor(Math.random() * texts.length)];
            const original = victim.dataset.original || victim.textContent;
            
            // Brief corruption
            this.corrupt(victim);
            setTimeout(() => this.restore(victim), 200);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // GLITCH SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const GlitchSystem = {
        init() {
            this.glitchInterval = setInterval(() => {
                if (Math.random() < state.glitchIntensity) {
                    this.triggerMinorGlitch();
                }
            }, 1000);
        },

        triggerMinorGlitch() {
            const elements = document.querySelectorAll('.section-title, .entry-title, .testimony-content');
            if (elements.length === 0) return;
            
            const target = elements[Math.floor(Math.random() * elements.length)];
            const original = target.style.transform;
            
            target.style.transform = `translate(${utils.random(-5, 5)}px, ${utils.random(-2, 2)}px)`;
            target.style.filter = 'hue-rotate(90deg) brightness(1.2)';
            
            setTimeout(() => {
                target.style.transform = original;
                target.style.filter = '';
            }, 100);
        },

        triggerMajorGlitch() {
            const body = document.body;
            body.style.animation = 'textGlitch 0.3s infinite';
            
            // Flash red
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 0, 0, 0.2);
                pointer-events: none;
                z-index: 9999;
                animation: fadeOut 0.5s forwards;
            `;
            document.body.appendChild(flash);
            
            setTimeout(() => {
                body.style.animation = '';
                flash.remove();
            }, 500);
        },

        updateIntensity() {
            // Glitch intensity increases as sanity decreases
            state.glitchIntensity = (100 - config.sanity.current) / 100 * 0.3;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SEARCH SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const SearchSystem = {
        init() {
            this.input = document.getElementById('archive-search');
            this.results = document.getElementById('search-results');
            this.trigger = document.getElementById('search-trigger');
            
            if (!this.input) return;

            this.input.addEventListener('input', utils.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));

            this.trigger.addEventListener('click', () => {
                this.handleSearch(this.input.value, true);
            });

            // Focus effects
            this.input.addEventListener('focus', () => {
                document.body.style.boxShadow = 'inset 0 0 100px rgba(80, 200, 120, 0.1)';
            });
            
            this.input.addEventListener('blur', () => {
                document.body.style.boxShadow = '';
            });
        },

        handleSearch(query, force = false) {
            if (!force && query.length < 2) {
                this.results.innerHTML = '';
                return;
            }

            // Generate disturbing results based on sanity
            const resultCount = Math.floor(Math.random() * 3) + 1;
            let html = '';
            
            for (let i = 0; i < resultCount; i++) {
                const result = utils.generateResult(query, config.sanity.current);
                html += this.renderResult(result, i);
            }

            // At very low sanity, add "personal" results
            if (config.sanity.current < 40 && Math.random() > 0.5) {
                html += this.renderPersonalResult();
            }

            this.results.innerHTML = html;
            this.results.style.opacity = '0';
            this.results.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                this.results.style.transition = 'all 0.3s';
                this.results.style.opacity = '1';
                this.results.style.transform = 'translateY(0)';
            }, 50);

            // Searching costs sanity
            SanitySystem.decay(0.5);
        },

        renderResult(result, index) {
            const corruptionClass = result.sanity < 50 ? 'corrupted' : '';
            return `
                <div class="search-result ${corruptionClass}" style="
                    padding: 1rem;
                    border-bottom: 1px solid rgba(80, 200, 120, 0.2);
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.background='rgba(80, 200, 120, 0.1)'" 
                   onmouseout="this.style.background='transparent'"
                   onclick="SanitySystem.decay(2)">
                    <h4 style="font-family: var(--font-ancient); color: var(--ichor); margin-bottom: 0.5rem;">
                        ${result.title}
                    </h4>
                    <p style="font-family: var(--font-elegant); color: #888; font-size: 0.9rem;">
                        ${result.description}
                    </p>
                </div>
            `;
        },

        renderPersonalResult() {
            const messages = [
                "Query matches your psychological profile",
                "You searched for this before. You don't remember.",
                "Behind you.",
                "It knows you're looking.",
                "Stop searching. Please."
            ];
            return `
                <div class="search-result personal" style="
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 50, 50, 0.3);
                    background: rgba(40, 10, 10, 0.2);
                ">
                    <h4 style="font-family: var(--font-archive); color: var(--blood-glow); margin-bottom: 0.5rem;">
                        PERSONAL NOTICE
                    </h4>
                    <p style="font-family: var(--font-elegant); color: #aaa; font-size: 0.9rem;">
                        ${messages[Math.floor(Math.random() * messages.length)]}
                    </p>
                </div>
            `;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCROLL & INTERSECTION SYSTEMS
    // ═══════════════════════════════════════════════════════════════

    const ScrollSystem = {
        init() {
            this.sections = document.querySelectorAll('.archive-section');
            this.testimonies = document.querySelectorAll('.testimony-entry');
            
            // Intersection Observer for sections
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.handleSectionEnter(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            this.sections.forEach(section => this.observer.observe(section));

            // Testimony observer
            this.testimonyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.3 });

            this.testimonies.forEach(t => this.testimonyObserver.observe(t));

            // Scroll event for sanity decay
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const current = window.scrollY;
                const delta = Math.abs(current - lastScroll);
                
                if (delta > 50) {
                    SanitySystem.decay(delta * config.sanity.decayRate);
                    GlitchSystem.updateIntensity();
                    lastScroll = current;
                }

                // Parallax effects
                this.handleParallax(current);
            });
        },

        handleSectionEnter(section) {
            const depth = parseInt(section.dataset.depth) || 1;
            
            // Deeper sections cost more sanity
            const cost = depth * 2;
            SanitySystem.decay(cost);
            
            // Update active section
            state.activeSection = section.id;
            
            // Special effects for deep sections
            if (depth >= 3) {
                AudioSystem?.intensify();
            }
        },

        handleParallax(scroll) {
            // Non-Euclidean parallax - elements move at different rates
            const elements = document.querySelectorAll('.text-entry, .catalogue-item');
            elements.forEach((el, i) => {
                const speed = (i % 3 + 1) * 0.1;
                const y = scroll * speed;
                el.style.transform = `translateY(${y * 0.05}px)`;
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // AUDIO SYSTEM (Web Audio API)
    // ═══════════════════════════════════════════════════════════════

    const AudioSystem = {
        init() {
            // Only initialize on user interaction
            document.addEventListener('click', () => this.setup(), { once: true });
        },

        setup() {
            if (this.context) return;
            
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create ambient drone
            this.drone = this.createDrone();
            this.drone.connect(this.context.destination);
            
            // Whisper channel
            this.whisperGain = this.context.createGain();
            this.whisperGain.gain.value = 0;
            this.whisperGain.connect(this.context.destination);
            
            // Start ambient sound
            this.drone.start();
            
            // Periodic whispers at low sanity
            setInterval(() => {
                if (config.sanity.current < 60 && Math.random() > 0.7) {
                    this.playWhisper();
                }
            }, 10000);
        },

        createDrone() {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = 50;
            gain.gain.value = 0.05;
            
            // Modulate for unease
            const lfo = this.context.createOscillator();
            lfo.frequency.value = 0.1;
            const lfoGain = this.context.createGain();
            lfoGain.gain.value = 10;
            
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            
            osc.connect(gain);
            return osc;
        },

        playWhisper() {
            if (!this.context) return;
            
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 2);
            
            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(0.02, this.context.currentTime + 0.5);
            gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 2);
            
            // Filter for "voice-like" quality
            const filter = this.context.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800;
            filter.Q.value = 1;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.whisperGain);
            
            osc.start();
            osc.stop(this.context.currentTime + 2);
        },

        intensify() {
            if (this.drone && this.context) {
                this.drone.frequency.linearRampToValueAtTime(60, this.context.currentTime + 2);
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // VEIL BREACH
    // ═══════════════════════════════════════════════════════════════

    const VeilSystem = {
        init() {
            this.veil = document.getElementById('veil-of-ignorance');
            this.button = document.getElementById('breach-veil');
            this.archive = document.getElementById('archive-container');

            if (!this.button) return;

            this.button.addEventListener('click', () => this.breach());
            
            // Pre-load audio on hover
            this.button.addEventListener('mouseenter', () => {
                this.button.style.transform = 'scale(1.05)';
                document.body.style.cursor = 'not-allowed';
                setTimeout(() => {
                    document.body.style.cursor = '';
                }, 100);
            });
        },

        breach() {
            this.veil.classList.add('breached');
            this.archive.classList.remove('unrevealed');
            this.archive.classList.add('unveiled');
            
            state.isVeilBreached = true;
            
            // Initialize systems
            setTimeout(() => {
                Starfield.init();
                ScrollSystem.init();
                TextCorruption.init();
                GlitchSystem.init();
                SearchSystem.init();
                AudioSystem.init();
            }, 1000);

            // Initial sanity cost for breaching the veil
            SanitySystem.decay(5);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // MOUSE TRACKING & INTERACTION
    // ═══════════════════════════════════════════════════════════════

    const InteractionSystem = {
        init() {
            document.addEventListener('mousemove', (e) => {
                state.mouseX = e.clientX / window.innerWidth;
                state.mouseY = e.clientY / window.innerHeight;
                
                // Subtle parallax on elements
                this.updateParallax();
            });

            // Random "breathing" of the page
            setInterval(() => {
                if (Math.random() > 0.95) {
                    this.breathe();
                }
            }, 5000);
        },

        updateParallax() {
            const elements = document.querySelectorAll('.text-entry, .catalogue-item');
            const x = (state.mouseX - 0.5) * 20;
            const y = (state.mouseY - 0.5) * 20;
            
            elements.forEach((el, i) => {
                const depth = (i % 5 + 1) * 0.02;
                el.style.transform = `
                    perspective(1000px) 
                    rotateX(${y * depth}deg) 
                    rotateY(${x * depth}deg)
                    translateZ(${Math.sin(Date.now() / 1000) * 5}px)
                `;
            });
        },

        breathe() {
            document.body.style.transform = 'scale(1.002)';
            setTimeout(() => {
                document.body.style.transform = 'scale(1)';
            }, 200);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // CONSTITUTION RENDERING (Stellar Charts)
    // ═══════════════════════════════════════════════════════════════

    const ConstellationSystem = {
        init() {
            this.canvas = document.getElementById('constellation-render');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.constellations = [];
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            this.generateConstellation();
            this.animate();
        },

        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        generateConstellation() {
            // Generate random stars in the void
            const count = 30;
            for (let i = 0; i < count; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 3 + 1,
                    type: Math.random() > 0.8 ? 'dead' : Math.random() > 0.5 ? 'screaming' : 'hungry',
                    pulse: Math.random() * Math.PI * 2
                });
            }
        },

        animate() {
            if (!this.ctx) return;
            
            this.ctx.fillStyle = 'rgba(5, 5, 8, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const sanityFactor = (100 - config.sanity.current) / 100;
            
            this.stars.forEach(star => {
                star.pulse += 0.02;
                
                // Color based on type and sanity
                let color;
                if (star.type === 'dead') {
                    color = `rgba(50, 50, 50, ${0.5 + Math.sin(star.pulse) * 0.3})`;
                } else if (star.type === 'screaming') {
                    color = `rgba(255, 215, 0, ${0.7 + Math.sin(star.pulse) * 0.3})`;
                } else {
                    const r = Math.floor(255 * sanityFactor);
                    const g = Math.floor(50 * (1 - sanityFactor));
                    const b = Math.floor(50 * (1 - sanityFactor));
                    color = `rgba(${r}, ${g}, ${b}, ${0.6 + Math.sin(star.pulse) * 0.4})`;
                }
                
                // Draw star
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Glow effect
                if (star.type !== 'dead') {
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = color;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }
            });
            
            // Connect stars at low sanity to show "patterns"
            if (sanityFactor > 0.4) {
                this.ctx.strokeStyle = `rgba(80, 200, 120, ${0.1 * sanityFactor})`;
                this.ctx.lineWidth = 1;
                
                for (let i = 0; i < this.stars.length; i++) {
                    for (let j = i + 1; j < this.stars.length; j++) {
                        const dx = this.stars[i].x - this.stars[j].x;
                        const dy = this.stars[i].y - this.stars[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 100 * sanityFactor) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
                            this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
                            this.ctx.stroke();
                        }
                    }
                }
            }
            
            requestAnimationFrame(() => this.animate());
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        SanitySystem.init();
        VeilSystem.init();
        InteractionSystem.init();
        ConstellationSystem.init();
        
        // Periodic sanity corruption
        setInterval(() => {
            if (state.isVeilBreached && config.sanity.current > 0) {
                TextCorruption.randomCorruption();
                
                // Passive sanity drain in deep sections
                if (state.activeSection === 'testimonies' || state.activeSection === 'catalogue') {
                    SanitySystem.decay(0.1);
                }
            }
        }, 5000);

        console.log('%cÆTHER ARCHIVE INITIALIZED', 'color: #50c878; font-size: 20px;');
        console.log('%cYour sanity is being monitored.', 'color: #666;');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose some systems for debugging
    return {
        sanity: SanitySystem,
        config: config,
        state: state
    };

})();
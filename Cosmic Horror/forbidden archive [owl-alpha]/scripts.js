/* ============================================
   THE OSSUARY INDEX — SCRIPTS
   Archive of the Unknowable
   ============================================ */

(function () {
    'use strict';

    /* ========================================
       SANITY SYSTEM
       ======================================== */
    const SanitySystem = {
        level: 100,
        decayRate: 0,
        isDegrading: false,

        init() {
            this.bar = document.getElementById('sanity-bar');
            this.valueDisplay = document.getElementById('sanity-value');
            this.statusDisplay = document.getElementById('sanity-status');
            this.body = document.body;

            this.bindEvents();
            this.updateDisplay();
        },

        bindEvents() {
            let scrollAccumulator = 0;

            window.addEventListener('scroll', () => {
                scrollAccumulator += Math.abs(window.scrollY - (this.lastScrollY || 0));
                this.lastScrollY = window.scrollY;

                if (scrollAccumulator > 500) {
                    this.decrease(1);
                    scrollAccumulator = 0;
                }
            }, { passive: true });

            document.querySelectorAll('[data-sanity-cost]').forEach((el) => {
                el.addEventListener('mouseenter', () => {
                    const cost = parseInt(el.dataset.sanityCost, 10);
                    if (!el.dataset.triggered) {
                        this.decrease(cost);
                        el.dataset.triggered = 'true';
                    }
                });
            });

            document.addEventListener('mousemove', (e) => {
                this.updateEyeTracking(e);
            });
        },

        decrease(amount) {
            this.level = Math.max(0, this.level - amount);
            this.updateDisplay();
            this.applySanityEffects();
            this.checkThresholds();
        },

        updateDisplay() {
            if (this.bar) {
                this.bar.style.width = this.level + '%';
            }
            if (this.valueDisplay) {
                this.valueDisplay.textContent = Math.round(this.level) + '%';
            }
            if (this.statusDisplay) {
                this.statusDisplay.textContent = this.getStatusText();
            }
        },

        getStatusText() {
            if (this.level > 80) return 'Lucid';
            if (this.level > 60) return 'Unsettled';
            if (this.level > 40) return 'Disturbed';
            if (this.level > 20) return 'Fracturing';
            if (this.level > 5) return 'Dissolving';
            return 'Gone';
        },

        applySanityEffects() {
            this.body.classList.remove('sanity-low', 'sanity-critical');

            if (this.level <= 20) {
                this.body.classList.add('sanity-critical');
            } else if (this.level <= 50) {
                this.body.classList.add('sanity-low');
            }
        },

        checkThresholds() {
            const thresholds = [75, 50, 25, 10];
            thresholds.forEach((t) => {
                if (this.level <= t && !this[`threshold_${t}`]) {
                    this[`threshold_${t}`] = true;
                    this.triggerThresholdEvent(t);
                }
            });
        },

        triggerThresholdEvent(threshold) {
            const messages = {
                75: 'You feel watched.',
                50: 'The text seems to shift when you\'re not looking directly at it.',
                25: 'You hear something breathing behind the screen.',
                10: 'It knows you\'re here. It has always known.'
            };

            if (messages[threshold]) {
                WhisperOverlay.show(messages[threshold], 3000);
            }
        },

        updateEyeTracking(e) {
            const pupils = document.querySelectorAll('.pupil, .footer-pupil');
            pupils.forEach((pupil) => {
                const rect = pupil.parentElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const distance = Math.min(
                    Math.hypot(e.clientX - centerX, e.clientY - centerY),
                    100
                );
                const moveX = Math.cos(angle) * (distance / 20);
                const moveY = Math.sin(angle) * (distance / 20);
                pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }
    };

    /* ========================================
       WHISPER OVERLAY
       ======================================== */
    const WhisperOverlay = {
        element: null,
        timeout: null,

        init() {
            this.element = document.getElementById('whisper');
        },

        show(text, duration = 2000) {
            if (!this.element) return;

            clearTimeout(this.timeout);

            this.element.innerHTML = `<span class="whisper-text" style="
                font-family: 'La Belle Aurore', cursive;
                font-size: 1.2rem;
                color: rgba(139, 26, 26, 0.6);
                letter-spacing: 0.1em;
                text-align: center;
                padding: 20px;
            ">${text}</span>`;
            this.element.classList.add('active');

            this.timeout = setTimeout(() => {
                this.element.classList.remove('active');
            }, duration);
        }
    };

    /* ========================================
       TEXT CORRUPTION SYSTEM
       ======================================== */
    const TextCorruption = {
        glitchChars: '̷̸̶̵̡̢̧̛̛̪̫̞̠̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎̀́̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔̽̾̿̀́͂̓̈́͆͊͋͌̕̚͘͜͟͝͞͠͡',
        corruptMap: {
            'a': 'ɐ', 'e': 'ǝ', 'i': 'ᴉ', 'o': 'ɔ', 'u': 'ʌ',
            'n': 'ᴎ', 'm': 'ɯ', 's': 'ƨ', 't': 'ʇ', 'r': 'ɹ',
            'A': '∀', 'E': 'Ǝ', 'I': 'I', 'O': 'O', 'U': '∩',
            'N': 'N', 'M': 'W', 'S': 'S', 'T': '⊥', 'R': 'ɹ'
        },

        init() {
            this.setupCorruptibleText();
            this.startAmbientCorruption();
        },

        setupCorruptibleText() {
            document.querySelectorAll('.corruptible').forEach((el) => {
                el.dataset.original = el.dataset.original || el.textContent;

                el.addEventListener('mouseenter', () => {
                    this.corruptElement(el);
                });

                el.addEventListener('mouseleave', () => {
                    this.restoreElement(el);
                });
            });
        },

        corruptElement(el) {
            const original = el.dataset.original;
            if (!original) return;

            let corrupted = '';
            const corruptionLevel = Math.random() * 0.4 + 0.1;

            for (let i = 0; i < original.length; i++) {
                const char = original[i];
                if (Math.random() < corruptionLevel) {
                    if (this.corruptMap[char]) {
                        corrupted += this.corruptMap[char];
                    } else if (char.match(/[a-zA-Z]/)) {
                        corrupted += this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                    } else {
                        corrupted += char;
                    }
                } else {
                    corrupted += char;
                }
            }

            el.textContent = corrupted;
            el.style.color = 'var(--color-blood)';
        },

        restoreElement(el) {
            if (el.dataset.original) {
                el.textContent = el.dataset.original;
                el.style.color = '';
            }
        },

        startAmbientCorruption() {
            setInterval(() => {
                if (SanitySystem.level > 50) return;

                const allText = document.querySelectorAll('.entry-preview p, .testimony-text, .annotation-text');
                if (allText.length === 0) return;

                const target = allText[Math.floor(Math.random() * allText.length)];
                const original = target.textContent;

                if (original.length < 10) return;

                const pos = Math.floor(Math.random() * original.length);
                const glitchChar = this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];

                target.textContent = original.substring(0, pos) + glitchChar + original.substring(pos + 1);

                setTimeout(() => {
                    target.textContent = original;
                }, 150 + Math.random() * 200);
            }, 3000 + Math.random() * 4000);
        }
    };

    /* ========================================
       TENDRIK CANVAS SYSTEM
       ======================================== */
    const TendrilSystem = {
        canvas: null,
        ctx: null,
        tendrils: [],
        animationId: null,

        init() {
            this.canvas = document.getElementById('tendril-canvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.createTendrils();
            this.animate();

            window.addEventListener('resize', () => this.resize());
        },

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        createTendrils() {
            this.tendrils = [];
            const count = 6;

            for (let i = 0; i < count; i++) {
                const edge = Math.floor(Math.random() * 4);
                let x, y;

                switch (edge) {
                    case 0: x = Math.random() * this.canvas.width; y = 0; break;
                    case 1: x = this.canvas.width; y = Math.random() * this.canvas.height; break;
                    case 2: x = Math.random() * this.canvas.width; y = this.canvas.height; break;
                    case 3: x = 0; y = Math.random() * this.canvas.height; break;
                }

                this.tendrils.push({
                    x: x,
                    y: y,
                    segments: [],
                    segmentCount: 12 + Math.floor(Math.random() * 8),
                    speed: 0.3 + Math.random() * 0.4,
                    angle: Math.random() * Math.PI * 2,
                    angleSpeed: (Math.random() - 0.5) * 0.02,
                    thickness: 1 + Math.random() * 2,
                    color: `rgba(139, 26, 26, ${0.08 + Math.random() * 0.08})`,
                    targetX: this.canvas.width * (0.3 + Math.random() * 0.4),
                    targetY: this.canvas.height * (0.3 + Math.random() * 0.4),
                    phase: Math.random() * Math.PI * 2
                });
            }
        },

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const sanityFactor = (100 - SanitySystem.level) / 100;
            const alpha = 0.08 + sanityFactor * 0.15;

            this.tendrils.forEach((tendril) => {
                tendril.angle += tendril.angleSpeed;
                tendril.phase += 0.01;

                const dx = tendril.targetX - tendril.x;
                const dy = tendril.targetY - tendril.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 50) {
                    tendril.x += (dx / dist) * tendril.speed;
                    tendril.y += (dy / dist) * tendril.speed;
                }

                tendril.segments.unshift({ x: tendril.x, y: tendril.y });
                if (tendril.segments.length > tendril.segmentCount) {
                    tendril.segments.pop();
                }

                if (tendril.segments.length < 2) return;

                this.ctx.beginPath();
                this.ctx.moveTo(tendril.segments[0].x, tendril.segments[0].y);

                for (let i = 1; i < tendril.segments.length; i++) {
                    const seg = tendril.segments[i];
                    const wobble = Math.sin(tendril.phase + i * 0.3) * (3 + sanityFactor * 8);
                    const prev = tendril.segments[i - 1];
                    const cpx = (prev.x + seg.x) / 2 + wobble;
                    const cpy = (prev.y + seg.y) / 2 + wobble;
                    this.ctx.quadraticCurveTo(cpx, cpy, seg.x, seg.y);
                }

                const gradient = this.ctx.createLinearGradient(
                    tendril.x, tendril.y,
                    tendril.segments[tendril.segments.length - 1].x,
                    tendril.segments[tendril.segments.length - 1].y
                );
                gradient.addColorStop(0, `rgba(139, 26, 26, ${alpha})`);
                gradient.addColorStop(1, `rgba(139, 26, 26, 0)`);

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = tendril.thickness;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();

                for (let i = 0; i < tendril.segments.length; i += 3) {
                    if (i >= tendril.segments.length) break;
                    const seg = tendril.segments[i];
                    const size = 1 + Math.random() * 1.5;
                    this.ctx.beginPath();
                    this.ctx.arc(
                        seg.x + Math.sin(tendril.phase + i) * 5,
                        seg.y + Math.cos(tendril.phase + i) * 5,
                        size,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fillStyle = `rgba(139, 26, 26, ${alpha * 0.3})`;
                    this.ctx.fill();
                }
            });

            this.animationId = requestAnimationFrame(() => this.animate());
        }
    };

    /* ========================================
       STAR CHART SYSTEM
       ======================================== */
    const StarCharts = {
        charts: [],

        init() {
            this.initChart('chart-canvas-1', 'graveyard');
            this.initChart('chart-canvas-2', 'maw');
            this.initInteractiveChart();
        },

        initChart(canvasId, type) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const stars = [];

            const starCount = type === 'graveyard' ? 200 : 150;

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random(),
                    twinkleSpeed: 0.01 + Math.random() * 0.03,
                    twinklePhase: Math.random() * Math.PI * 2,
                    dead: type === 'graveyard' ? Math.random() < 0.3 : Math.random() < 0.5,
                    pulse: type === 'maw' && Math.random() < 0.1
                });
            }

            if (type === 'graveyard') {
                const cx = width * 0.45;
                const cy = height * 0.45;
                for (let i = 0; i < 60; i++) {
                    const angle = (i / 60) * Math.PI * 2;
                    const radius = 30 + Math.random() * 50;
                    stars.push({
                        x: cx + Math.cos(angle) * radius,
                        y: cy + Math.sin(angle) * radius,
                        size: Math.random() * 1.5 + 0.3,
                        brightness: 0.2,
                        twinkleSpeed: 0.005,
                        twinklePhase: Math.random() * Math.PI * 2,
                        dead: true,
                        pulse: false
                    });
                }
            }

            if (type === 'maw') {
                const cx = width * 0.5;
                const cy = height * 0.4;
                for (let i = 0; i < 80; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 80;
                    stars.push({
                        x: cx + Math.cos(angle) * radius,
                        y: cy + Math.sin(angle) * radius,
                        size: 0,
                        brightness: 0,
                        twinkleSpeed: 0,
                        twinklePhase: 0,
                        dead: true,
                        void: true
                    });
                }
            }

            const chart = {
                canvas,
                ctx,
                width,
                height,
                stars,
                type,
                animationId: null
            };

            this.charts.push(chart);
            this.animateChart(chart);
        },

        animateChart(chart) {
            const animate = () => {
                chart.ctx.fillStyle = 'rgba(5, 5, 8, 0.95)';
                chart.ctx.fillRect(0, 0, chart.width, chart.height);

                chart.ctx.strokeStyle = 'rgba(42, 42, 61, 0.1)';
                chart.ctx.lineWidth = 0.5;
                for (let x = 0; x < chart.width; x += 40) {
                    chart.ctx.beginPath();
                    chart.ctx.moveTo(x, 0);
                    chart.ctx.lineTo(x, chart.height);
                    chart.ctx.stroke();
                }
                for (let y = 0; y < chart.height; y += 40) {
                    chart.ctx.beginPath();
                    chart.ctx.moveTo(0, y);
                    chart.ctx.lineTo(chart.width, y);
                    chart.ctx.stroke();
                }

                chart.stars.forEach((star) => {
                    star.twinklePhase += star.twinkleSpeed;

                    if (star.void) {
                        chart.ctx.beginPath();
                        chart.ctx.arc(star.x, star.y, 8 + Math.sin(star.twinklePhase) * 3, 0, Math.PI * 2);
                        const voidGrad = chart.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 12);
                        voidGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
                        voidGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        chart.ctx.fillStyle = voidGrad;
                        chart.ctx.fill();
                        return;
                    }

                    const twinkle = star.brightness * (0.5 + 0.5 * Math.sin(star.twinklePhase));

                    if (star.dead) {
                        chart.ctx.beginPath();
                        chart.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                        chart.ctx.fillStyle = `rgba(80, 80, 100, ${twinkle * 0.3})`;
                        chart.ctx.fill();

                        if (Math.sin(star.twinklePhase) > 0.95) {
                            chart.ctx.beginPath();
                            chart.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                            chart.ctx.fillStyle = `rgba(139, 26, 26, ${twinkle * 0.05})`;
                            chart.ctx.fill();
                        }
                    } else {
                        const pulse = star.pulse ? 0.5 + 0.5 * Math.sin(star.twinklePhase * 3) : 1;
                        chart.ctx.beginPath();
                        chart.ctx.arc(star.x, star.y, star.size * pulse, 0, Math.PI * 2);
                        chart.ctx.fillStyle = `rgba(180, 180, 220, ${twinkle * 0.6})`;
                        chart.ctx.fill();

                        if (star.size > 1.5) {
                            chart.ctx.beginPath();
                            chart.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                            chart.ctx.fillStyle = `rgba(180, 180, 220, ${twinkle * 0.1})`;
                            chart.ctx.fill();
                        }
                    }
                });

                chart.animationId = requestAnimationFrame(animate);
            };

            animate();
        },

        initInteractiveChart() {
            const canvas = document.getElementById('chart-canvas-interactive');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const stars = [];
            const signals = [];

            for (let i = 0; i < 100; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5 + 0.3,
                    brightness: Math.random(),
                    speed: 0.01 + Math.random() * 0.02,
                    phase: Math.random() * Math.PI * 2
                });
            }

            const outputEl = document.getElementById('chart-output');

            const focusMessages = [
                'The telescope focuses. The stars are not where they should be. They have moved closer.',
                'Focus achieved. You see a pattern in the darkness between stars. It looks like a face.',
                'The lens resolves. What you thought was empty space is full of something. Something vast.',
                'Focus sharpens. The stars are blinking. In unison. Like eyes.',
                'The telescope sees. You wish it couldn\'t. You wish you couldn\'t.'
            ];

            const decodeMessages = [
                'Signal decoded: "TURN BACK" — Origin: your own neural patterns, reflected from 12 billion years ago.',
                'Signal decoded: A mathematical proof that consciousness is a wound in spacetime. The proof is correct.',
                'Signal decoded: Your name, spoken in a voice you recognize but have never heard.',
                'Signal decoded: Coordinates. They point to the screen you are currently looking at.',
                'Signal decoded: "WE SEE YOU SEEING US." The signal is not coming from space. It is coming from the signal itself.'
            ];

            const reachMessages = [
                'Probe extended. It touched something. The something touched back. The probe is now reading your vital signs.',
                'Probe reached the target. The target is not a place. It is a state of being. The probe is now in that state.',
                'Probe extended into the void. The void is not empty. The void is full of probes from other archives. They are all reaching for the same thing.',
                'Probe made contact. Contact is not a metaphor. Something is holding the probe. Something with fingers.',
                'Probe extended. It found the edge of the map. The edge is not a boundary. It is a mouth.'
            ];

            const animate = () => {
                ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
                ctx.fillRect(0, 0, width, height);

                stars.forEach((star) => {
                    star.phase += star.speed;
                    const twinkle = star.brightness * (0.4 + 0.6 * Math.sin(star.phase));

                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(180, 180, 220, ${twinkle * 0.5})`;
                    ctx.fill();
                });

                signals.forEach((signal, index) => {
                    signal.phase += 0.02;
                    signal.radius += 0.5;

                    ctx.beginPath();
                    ctx.arc(signal.x, signal.y, signal.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(42, 107, 74, ${Math.max(0, 0.3 - signal.radius / 200)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    if (signal.radius > 200) {
                        signals.splice(index, 1);
                    }
                });

                requestAnimationFrame(animate);
            };

            animate();

            document.querySelectorAll('.chart-btn').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    const cost = parseInt(btn.querySelector('.btn-cost').textContent.match(/\d+/)[0], 10);

                    SanitySystem.decrease(cost);

                    const signalX = 100 + Math.random() * (width - 200);
                    const signalY = 100 + Math.random() * (height - 200);
                    signals.push({ x: signalX, y: signalY, radius: 0, phase: 0 });

                    let messages;
                    switch (action) {
                        case 'focus': messages = focusMessages; break;
                        case 'decode': messages = decodeMessages; break;
                        case 'reach': messages = reachMessages; break;
                        default: messages = focusMessages;
                    }

                    const message = messages[Math.floor(Math.random() * messages.length)];

                    if (outputEl) {
                        outputEl.textContent = message;
                        outputEl.classList.add('has-content');
                        outputEl.style.animation = 'none';
                        outputEl.offsetHeight;
                        outputEl.style.animation = 'warning-appear 0.5s ease forwards';
                    }
                });
            });
        }
    };

    /* ========================================
       SEARCH SYSTEM
       ======================================== */
    const SearchSystem = {
        resultsContainer: null,
        input: null,
        button: null,

        searchDatabase: [
            {
                title: 'OSS-001: The Litany of Holes',
                snippet: 'A pre-human text describing geometries that exist in the spaces between...',
                meta: 'Hazard Class Ω — Pre-human origin',
                hazard: 'omega'
            },
            {
                title: 'OSS-047: Hymn to the Unborn God',
                snippet: 'Throat-singing notation recovered from excavation site Γ-9. The hymn describes...',
                meta: 'Hazard Class Δ — Abyssal origin',
                hazard: 'delta'
            },
            {
                title: 'OSS-113: The Book That Reads You',
                snippet: 'An adaptive text that rewrites itself for each reader. Found inside the skull of...',
                meta: 'Hazard Class Σ — Origin unknown',
                hazard: 'sigma'
            },
            {
                title: 'OSS-256: Chronicle of the Last Light',
                snippet: 'A text from the future describing the final epoch. Causality is uncertain...',
                meta: 'Hazard Class Ω+ — Temporal origin',
                hazard: 'omega'
            },
            {
                title: 'Field Report: Site Γ-9 Excavation',
                snippet: 'The excavation team reported walls that were "warm" and "wet." Dimensions inside...',
                meta: 'Hazard Class Γ — Spatial anomaly',
                hazard: 'gamma'
            },
            {
                title: 'Signal Analysis: The Hollow Cluster',
                snippet: '400 dead stars arranged in a pattern. The pattern has been decoded as...',
                meta: 'Hazard Class Θ — Ontological',
                hazard: 'theta'
            },
            {
                title: 'Incident Report: Translation Team Delta',
                snippet: 'All members deceased. Final transmission described the text as "breathing"...',
                meta: 'Hazard Class Ω — Lethal',
                hazard: 'omega'
            },
            {
                title: 'Autonomous Mapping Log: Sector Θ-12',
                snippet: 'The mapping process became autonomous. No team was assigned. The chart draws itself...',
                meta: 'Hazard Class Θ — Self-propagating',
                hazard: 'theta'
            }
        ],

        disturbingResults: [
            {
                title: 'ENTRY NOT FOUND',
                snippet: 'Your search term does not exist in the Archive. It exists in you. It has always existed in you.',
                meta: 'Hazard Class: YOU',
                hazard: 'omega'
            },
            {
                title: 'SEARCH RESULT #1',
                snippet: 'You. You are the search result. You have always been the search result.',
                meta: 'Hazard Class: SELF',
                hazard: 'omega'
            },
            {
                title: 'INQUIRY PROCESSED',
                snippet: 'The Archive has processed your inquiry. The Archive has processed you. You are now indexed.',
                meta: 'Hazard Class: ARCHIVE',
                hazard: 'sigma'
            },
            {
                title: 'RESULT REDACTED',
                snippet: 'This result has been redacted for your protection. The redaction is the result. The result is the redaction.',
                meta: 'Hazard Class: ████',
                hazard: 'omega'
            },
            {
                title: 'SEARCH COMPLETE',
                snippet: '0 results found. 1 result found. The result is the search itself. You are searching for what is searching you.',
                meta: 'Hazard Class: RECURSIVE',
                hazard: 'theta'
            }
        ],

        init() {
            this.resultsContainer = document.getElementById('search-results');
            this.input = document.getElementById('search-input');
            this.button = document.getElementById('search-button');

            if (this.button) {
                this.button.addEventListener('click', () => this.performSearch());
            }

            if (this.input) {
                this.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.performSearch();
                    }
                });
            }

            this.setupCategoryTags();
            this.animateResultCount();
        },

        performSearch() {
            if (!this.input || !this.resultsContainer) return;

            const query = this.input.value.trim().toLowerCase();
            SanitySystem.decrease(4);

            this.resultsContainer.innerHTML = '<div class="search-placeholder"><p class="placeholder-text">Processing inquiry...</p></div>';

            setTimeout(() => {
                const results = this.getResults(query);
                this.renderResults(results, query);
            }, 800 + Math.random() * 1200);
        },

        getResults(query) {
            if (SanitySystem.level < 30) {
                return this.disturbingResults.slice(0, 2 + Math.floor(Math.random() * 3));
            }

            if (SanitySystem.level < 60) {
                const normal = this.searchDatabase.filter((r) =>
                    r.title.toLowerCase().includes(query) ||
                    r.snippet.toLowerCase().includes(query) ||
                    query.length === 0
                );
                const disturbing = this.disturbingResults.slice(0, 1);
                return [...normal.slice(0, 3), ...disturbing];
            }

            if (!query) {
                return this.searchDatabase.slice(0, 4);
            }

            return this.searchDatabase.filter((r) =>
                r.title.toLowerCase().includes(query) ||
                r.snippet.toLowerCase().includes(query)
            ).slice(0, 5);
        },

        renderResults(results, query) {
            if (results.length === 0) {
                this.resultsContainer.innerHTML = `
                    <div class="search-placeholder">
                        <p class="placeholder-text">No entries found for "${this.escapeHtml(query)}".</p>
                        <p class="placeholder-subtext">The Archive does not contain what you seek. The Archive contains what seeks you.</p>
                    </div>
                `;
                return;
            }

            let html = '';
            results.forEach((result) => {
                const highlightedSnippet = query
                    ? this.highlightText(result.snippet, query)
                    : result.snippet;

                html += `
                    <div class="search-result-item" data-sanity-cost="2">
                        <div class="result-title">${this.escapeHtml(result.title)}</div>
                        <div class="result-snippet">${highlightedSnippet}</div>
                        <div class="result-meta">${this.escapeHtml(result.meta)}</div>
                    </div>
                `;
            });

            this.resultsContainer.innerHTML = html;

            this.resultsContainer.querySelectorAll('.search-result-item').forEach((item) => {
                item.addEventListener('click', () => {
                    SanitySystem.decrease(2);
                    item.style.background = 'rgba(139, 26, 26, 0.1)';
                    setTimeout(() => {
                        item.style.background = '';
                    }, 300);
                });
            });
        },

        highlightText(text, query) {
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        setupCategoryTags() {
            document.querySelectorAll('.hazard-tag, .phenom-tag').forEach((tag) => {
                tag.addEventListener('click', () => {
                    if (this.input) {
                        this.input.value = tag.textContent.trim().split(' ')[0];
                    }
                    this.performSearch();
                });
            });
        },

        animateResultCount() {
            const countEl = document.getElementById('result-count');
            if (!countEl) return;

            let count = Infinity;
            let displayCount = 99999;

            setInterval(() => {
                displayCount += Math.floor(Math.random() * 100 - 30);
                displayCount = Math.max(1000, Math.min(999999, displayCount));
                countEl.textContent = displayCount.toLocaleString();
            }, 2000);
        }
    };

    /* ========================================
       REDACTION REVEAL SYSTEM
       ======================================== */
    const RedactionSystem = {
        init() {
            document.querySelectorAll('.redacted-block').forEach((block) => {
                block.addEventListener('click', () => {
                    if (block.dataset.revealed === 'true') return;
                    block.dataset.revealed = 'true';

                    const hidden = block.dataset.hidden;
                    block.innerHTML = `<span style="color: var(--color-blood-bright); font-style: italic;">${hidden}</span>`;
                    block.style.background = 'rgba(139, 26, 26, 0.2)';
                    block.style.borderLeftColor = 'var(--color-blood-bright)';

                    SanitySystem.decrease(2);
                });
            });

            document.querySelectorAll('.redaction').forEach((redaction) => {
                redaction.addEventListener('mouseenter', () => {
                    if (Math.random() < 0.3) {
                        const original = redaction.textContent;
                        const revealed = this.generateRedactedContent();
                        redaction.textContent = revealed;
                        redaction.style.color = 'var(--color-blood)';
                        redaction.style.opacity = '0.6';

                        setTimeout(() => {
                            redaction.textContent = original;
                            redaction.style.color = '';
                            redaction.style.opacity = '';
                        }, 1500);
                    }
                });
            });
        },

        generateRedactedContent() {
            const fragments = [
                'SUBJECT TERMINATED',
                'REALITY BREACH',
                'IT SEES YOU',
                'DO NOT LOOK',
                'THEY ARE HERE',
                'END OF LINE',
                'NO ESCAPE',
                'IT REMEMBERS',
                'YOU WERE WARNED',
                'THE LOOP CLOSES'
            ];
            return fragments[Math.floor(Math.random() * fragments.length)];
        }
    };

    /* ========================================
       SCROLL REVEAL ANIMATIONS
       ======================================== */
    const ScrollReveal = {
        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );

            document.querySelectorAll('.text-entry, .star-chart, .testimony').forEach((el) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(el);
            });
        }
    };

    /* ========================================
       AMBIENT EFFECTS
       ======================================== */
    const AmbientEffects = {
        init() {
            this.startRandomWhispers();
            this.startCursorEffects();
        },

        startRandomWhispers() {
            const whispers = [
                'Do you feel that?',
                'It\'s getting closer.',
                'The Archive grows.',
                'You are being indexed.',
                'Look behind you.',
                'The text is watching.',
                'Don\'t stop reading.',
                'It knows your name.',
                'The walls are thin here.',
                'You\'ve been here before.'
            ];

            setInterval(() => {
                if (SanitySystem.level > 70) return;
                if (Math.random() > 0.3) return;

                const whisper = whispers[Math.floor(Math.random() * whispers.length)];
                WhisperOverlay.show(whisper, 2000);
            }, 30000);
        },

        startCursorEffects() {
            let lastX = 0;
            let lastY = 0;

            document.addEventListener('mousemove', (e) => {
                const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
                lastX = e.clientX;
                lastY = e.clientY;

                if (speed > 50 && SanitySystem.level < 40 && Math.random() < 0.1) {
                    this.createTrailDot(e.clientX, e.clientY);
                }
            });
        },

        createTrailDot(x, y) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: rgba(139, 26, 26, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: all 1s ease;
            `;
            document.body.appendChild(dot);

            requestAnimationFrame(() => {
                dot.style.transform = `scale(0) translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`;
                dot.style.opacity = '0';
            });

            setTimeout(() => dot.remove(), 1000);
        }
    };

    /* ========================================
       NAVIGATION EFFECTS
       ======================================== */
    const NavigationEffects = {
        init() {
            this.setupSmoothScroll();
            this.setupNavHighlight();
        },

        setupSmoothScroll() {
            document.querySelectorAll('.nav-link, .cta-button').forEach((link) => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        },

        setupNavHighlight() {
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.nav-link');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.id;
                            navLinks.forEach((link) => {
                                link.classList.remove('active');
                                if (link.getAttribute('href') === '#' + id) {
                                    link.classList.add('active');
                                }
                            });
                        }
                    });
                },
                { threshold: 0.3 }
            );

            sections.forEach((section) => observer.observe(section));
        }
    };

    /* ========================================
       INITIALIZATION
       ======================================== */
    function init() {
        SanitySystem.init();
        WhisperOverlay.init();
        TextCorruption.init();
        TendrilSystem.init();
        StarCharts.init();
        SearchSystem.init();
        RedactionSystem.init();
        ScrollReveal.init();
        AmbientEffects.init();
        NavigationEffects.init();

        console.log('%c THE OSSUARY INDEX ', 'background: #8b1a1a; color: #d0d0e8; font-size: 14px; padding: 5px 10px;');
        console.log('%c You have opened the Archive. It will not forget. ', 'color: #5a5a7a; font-style: italic;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
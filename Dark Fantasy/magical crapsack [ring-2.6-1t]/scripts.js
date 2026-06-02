/* ═══════════════════════════════════════════════════════════════
   VORTHANIS — The Cursed Dominion
   JavaScript: The Bleak Codex — Scripts
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ───── Utility: DOM Ready ─────
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 1. CUSTOM CURSOR GLOW
    // ═══════════════════════════════════════════════════════════
    function initCursor() {
        const glow = document.getElementById('cursor-glow');
        if (!glow) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        // Hide glow on hover over interactive elements
        const interactive = document.querySelectorAll('a, button, input, select');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => glow.style.opacity = '0');
            el.addEventListener('mouseleave', () => glow.style.opacity = '1');
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 2. ASH PARTICLE CANVAS
    // ═══════════════════════════════════════════════════════════
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let width, height;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height;
                this.size = Math.random() * 2.5 + 0.3;
                this.speedY = Math.random() * 0.8 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.decay = Math.random() * 0.002 + 0.0005;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
                // Color: ember-like — dark orange, red, or grey ash
                const colors = [
                    'rgba(200, 80, 20, ',  // ember
                    'rgba(180, 50, 10, ',  // deep ember
                    'rgba(100, 100, 100, ', // ash grey
                    'rgba(150, 70, 30, ',   // mid ember
                    'rgba(80, 30, 10, '     // dark speck
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.15;
                this.y += this.speedY;
                this.opacity -= this.decay;
                if (this.opacity <= 0 || this.y > height + 10 || this.x < -10 || this.x > width + 10) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        }

        const count = 120;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ═══════════════════════════════════════════════════════════
    // 3. SCROLL-TRIGGERED FADE ANIMATIONS
    // ═══════════════════════════════════════════════════════════
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-fade]').forEach(el => {
            observer.observe(el);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 4. COUNTER ANIMATION
    // ═══════════════════════════════════════════════════════════
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter="true"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));

        function animateCounter(el, target) {
            const duration = 2000;
            const startTime = performance.now();
            const isFloat = target % 1 !== 0;
            const decimalTarget = parseFloat('0.' + el.querySelector('.stat-number')?.dataset?.decimal || '0');

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const current = Math.floor(eased * target);

                if (current < target) {
                    el.querySelector('.stat-number') || el.firstElementChild
                        ? (el.querySelector('.stat-number') || el.firstElementChild).textContent = current.toLocaleString()
                        : null;
                    requestAnimationFrame(update);
                } else {
                    el.querySelector('.stat-number') || el.firstElementChild
                        ? (el.querySelector('.stat-number') || el.firstElementChild).textContent = target.toLocaleString()
                        : null;
                }
            }
            requestAnimationFrame(update);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 5. NAVIGATION
    // ═══════════════════════════════════════════════════════════
    function initNavigation() {
        const nav = document.getElementById('main-nav');
        const toggle = document.getElementById('nav-toggle');
        const navList = document.getElementById('nav-toggle-list');
        const links = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        // Mobile toggle
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navList.classList.toggle('open');
        });

        // Close mobile nav on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navList.classList.remove('open');
            });
        });

        // Scroll-based nav styling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Active link based on scroll position
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 6. MISERY METER — SVG Arc Animation
    // ═══════════════════════════════════════════════════════════
    function initMiseryMeter() {
        const svg = document.querySelector('.meter-svg');
        if (!svg) return;

        const ns = 'http://www.w3.org/2000/svg';

        // Create gradient
        const defs = document.createElementNS(ns, 'defs');
        const linearGrad = document.createElementNS(ns, 'linearGradient');
        linearGrad.setAttribute('id', 'miseryGradient');

        const stop1 = document.createElementNS(ns, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#8b2a2a');

        const stop2 = document.createElementNS(ns, 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#dc143c');

        const stop3 = document.createElementNS(ns, 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#ff6b6b');

        linearGrad.appendChild(stop1);
        linearGrad.appendChild(stop2);
        linearGrad.appendChild(stop3);
        defs.appendChild(linearGrad);
        svg.prepend(defs);

        // Create tick marks and labels
        const ticksGroup = document.getElementById('meter-ticks');
        const cx = 150, cy = 150, r = 130;
        const totalAngle = 270; // degrees of the arc
        const startAngle = 135; // starting angle in degrees
        const numTicks = 10;

        for (let i = 0; i <= numTicks; i++) {
            const angleDeg = startAngle + (totalAngle * i / numTicks);
            const angleRad = (angleDeg - 90) * Math.PI / 180;

            const x1 = cx + (r - 12) * Math.cos(angleRad);
            const y1 = cy + (r - 12) * Math.sin(angleRad);
            const x2 = cx + (r + 5) * Math.cos(angleRad);
            const y2 = cy + (r + 5) * Math.sin(angleRad);

            const line = document.createElementNS(ns, 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            ticksGroup.appendChild(line);

            if (i % 2 === 0) {
                const labelX = cx + (r + 18) * Math.cos(angleRad);
                const labelY = cy + (r + 18) * Math.sin(angleRad);
                const text = document.createElementNS(ns, 'text');
                text.setAttribute('x', labelX);
                text.setAttribute('y', labelY);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.textContent = (i * 10) % 100 === 0 ? (i * 10) / 10 + '' : '';
                ticksGroup.appendChild(text);
            }
        }

        // Animate the arc on load
        const arc = document.getElementById('misery-arc');
        const circumference = 2 * Math.PI * 130; // ~816.8
        const targetOffset = circumference - (circumference * 0.94); // 94% filled

        arc.style.strokeDasharray = circumference;
        arc.style.strokeDashoffset = circumference; // start at 0%

        setTimeout(() => {
            arc.style.strokeDashoffset = targetOffset;
        }, 500);
    }

    // ═══════════════════════════════════════════════════════════
    // 7. AFFLICTION FILTERING AND SORTING
    // ═══════════════════════════════════════════════════════════
    function initAfflictionTracker() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const sortSelect = document.getElementById('sort-afflictions');
        const afflictionsList = document.getElementById('afflictions-list');
        const cards = afflictionsList.querySelectorAll('.affliction-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            });
        });

        sortSelect.addEventListener('change', applyFilters);

        function applyFilters() {
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            const sortValue = sortSelect.value;

            const sortedCards = Array.from(cards).filter(card => {
                if (activeFilter === 'all') return true;
                return card.dataset.category === activeFilter;
            });

            // Sort
            sortedCards.sort((a, b) => {
                const sevA = parseInt(a.dataset.severity);
                const sevB = parseInt(b.dataset.severity);
                const nameA = a.querySelector('h3').textContent.trim();
                const nameB = b.querySelector('h3').textContent.trim();

                switch (sortValue) {
                    case 'severity-desc': return sevB - sevA;
                    case 'severity-asc': return sevA - sevB;
                    case 'name-asc': return nameA.localeCompare(nameB);
                    case 'name-desc': return nameB.localeCompare(nameA);
                    default: return 0;
                }
            });

            // Re-append in sorted/filtered order
            sortedCards.forEach(card => afflictionsList.appendChild(card));

            // Re-trigger fade animations for visible cards
            sortedCards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 * i);
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 8. RITUAL CALENDAR — DETAILS AND INTERACTIONS
    // ═══════════════════════════════════════════════════════════
    function initRitualCalendar() {
        const ritualData = {
            'the-gathering-of-ash': {
                name: 'The Gathering of Ash',
                type: 'Observance',
                day: '4th of Ashvane',
                description: 'On this day, the scattered remnants of the dead are collected and brought to the Ash Pits of Ghrondarath. Families who still have graves to visit gather what remains of their loved ones — bone fragments, melted keepsakes, soil from collapsed homes. These are cast into the volcanic maw, where they are said to join the ever-burning pyre that fuels the mountain\'s wrath.',
                warning: 'Participation is mandatory in most settlements. Refusal is interpreted as an insult to the dead and is punishable by exile — or worse, by being cast into the Pits oneself.'
            },
            'blood-ascension': {
                name: 'The Blood Ascension',
                type: 'Blood Moon Event',
                day: '8th of Ashvane',
                description: 'The first Blood Moon of the cycle rises, painting the world in crimson. On this night, the transformation rate of the Blood Moon Sickness peaks. Those who have been weakening for days finally succumb, twisting into ravenous vessels of hunger. The skies bleed. The ground trembles. The wolves fall silent, for even they sense the ancient power stirring.',
                warning: 'No shelter is fully safe. Barricaded structures reduce risk by only 40%. The Blood Moon\'s influence penetrates stone, wood, and iron alike. Historical records indicate that subterranean shelters offer only marginal improvement.'
            },
            'the-weeping': {
                name: 'The Weeping',
                type: 'Divine Remembrance',
                day: '12th of Ashvane',
                description: 'A day of mourning for the last confirmed divine act — a cascade of tears that fell from a cloudless sky over the ruins of Valtheris twelve years before the Silence began. On this day, water sources turn brackky and statues of forgotten gods weep streaks of rust. Clerics who still cling to vestiges of power report hearing faint hymns from beyond the void.',
                warning: 'The Weeping is both sacred and cursed. Those who drink the rain on this day report vivid visions of paradise — visions from which they never emotionally recover, finding reality unbearable by comparison.'
            },
            'night-of-open-graves': {
                name: 'The Night of Open Graves',
                type: 'Day of Reckoning',
                day: '15th of Ashvane',
                description: 'The single most feared night in the Vorthanan calendar. The dead do not merely rise — they emerge. Graves burst open, crypts crack apart, and the earth itself vomits forth its contents. The Hollow Plague reaches its zenith, and every corpse within a hundred miles stirs. The boundary between death and life becomes not just thin, but nonexistent.',
                warning: 'DO NOT BE OUTDOORS. Historical mortality data from the Night of Open Graves: 94% of those caught outside perish or join the dead. Fortifications are not guaranteed safety — the dead have been known to breach walls and doors. This is not superstition. This is empirical fact.'
            },
            'the-feast-of-tears': {
                name: 'The Feast of Tears',
                type: 'Ritual',
                day: '19th of Ashvane',
                description: 'A grotesque celebration held by the surviving cults of the old faiths. In hidden groves and underground chambers, acolytes gather to share a meal of salted earth and diluted blood while chanting hymns to gods who no longer answer. The Feast commemorates a pact made during the First Age — a bargain for survival that was never honored by the other party.',
                warning: 'Cult activity increases 300% during this period. Unexplained disappearances spike. Witnesses report seeing robed figures processing through streets in complete silence, carrying bundles wrapped in dark cloth.'
            },
            'the-eclipse-of-thanos': {
                name: 'The Eclipse of Thanos',
                type: 'Celestial Anomaly',
                day: '23rd of Ashvane',
                description: 'The sun is consumed by an eclipse that lasts exactly thirteen minutes. During this time, the wards that hold back the worst of the dark magic fail. Spells of binding dissolve. Sealed evils stir. The sky turns a sickly green-black, and stars that have no names burn briefly in the void before the sun returns — diminished, as if something took a bite from it.',
                warning: 'The Eclipse of Thanos occurs once every thirteen years. Each occurrence, the sun returns slightly dimmer. Scholars estimate that in approximately 4,000 years, it will not return at all.'
            },
            'the-summoning-of-the-forgotten': {
                name: 'The Summoning of the Forgotten',
                type: 'Ritual',
                day: '27th of Ashvane',
                description: 'Deep beneath the Shattered Sanctum, entities that predate recorded history stir and call out. On this night, those with the knowledge and the madness to listen can hear names spoken in languages that predate the human tongue. Some cultists attempt to answer these calls, opening doorways that should never be opened.',
                warning: 'The summoning cannot be prevented, only endured. Seismic activity increases. Strange lights appear beneath the surface of the earth. Sleep becomes impossible for the sensitive. The Forgotten do not seek to conquer — they seek only to be remembered.'
            },
            'convergence-of-void': {
                name: 'The Convergence of the Void',
                type: 'Day of Reckoning',
                day: '31st of Ashvane',
                description: 'The final day of the cycle. The barriers between planes of existence are at their thinnest. The Void — that endless, hungry emptiness between realities — presses against the walls of existence with all its weight. Those who are near thresholds (ancient portals, dimensional weak points, places of great death) report seeing shapes in the periphery. Shapes that are not shapes. Colors that are not colors.',
                warning: 'This day marks the anniversary of the First Tear — the event that cracked reality and allowed suffering to enter the world. No celebration is held. No mourning is appropriate. Only silence and the desperate hope that tomorrow, the cycle begins again and perhaps, perhaps this time, the cracks will have grown just a little too wide.'
            }
        };

        const detailPanel = document.getElementById('ritual-detail');
        const detailContent = document.getElementById('ritual-detail-content');
        const closeBtn = document.getElementById('ritual-close');

        // Click handlers for ritual days
        document.querySelectorAll('.ritual-day, .bloodmoon-day, .eclipse-day, .doomsday').forEach(day => {
            day.addEventListener('click', () => {
                const ritualId = day.dataset.ritual;
                const data = ritualData[ritualId];
                if (!data) return;

                let severityClass = '';
                if (day.classList.contains('doomsday')) severityClass = 'severity-doom';
                else if (day.classList.contains('eclipse-day')) severityClass = 'severity-eclipse';
                else if (day.classList.contains('bloodmoon-day')) severityClass = 'severity-bloodmoon';

                detailContent.innerHTML = `
                    <span class="ritual-type">${data.type} — ${data.day}</span>
                    <h3>${data.name}</h3>
                    <p>${data.description}</p>
                    <div class="ritual-warning">
                        <strong><i class="fas fa-exclamation-triangle"></i> Warning:</strong><br>
                        ${data.warning}
                    </div>
                `;

                detailPanel.setAttribute('data-visible', 'true');
                document.body.classList.add('modal-open');
            });
        });

        // Close panel
        closeBtn.addEventListener('click', closePanel);
        detailPanel.addEventListener('click', (e) => {
            if (e.target === detailPanel) closePanel();
        });

        function closePanel() {
            detailPanel.setAttribute('data-visible', 'false');
            document.body.classList.remove('modal-open');
        }

        // Keyboard close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && detailPanel.getAttribute('data-visible') === 'true') {
                closePanel();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 9. REGION "BEAR WITNESS" INTERACTIONS
    // ═══════════════════════════════════════════════════════════
    function initRegionButtons() {
        const regionData = {
            'ashfall': {
                witness: 'You stand at the edge of the Ashfall Expanse. The air is thick with particulate — each breath tastes of iron and sulfur. The ground beneath your boots crunches, not with gravel, but with the calcified remains of what once grew here. To the north, the silhouette of Mount Ghrondarath belches smoke against a sky that has not been blue in thirteen years. You feel your throat tightening. Your eyes water. You turn back.',
                no_witness: 'You are not ready to witness this. The Ashfall does not forgive the unprepared.'
            },
            'dreadmire': {
                witness: 'The Dreadmire does not look at you. It does not need to. You feel its attention like a weight on your chest. The water is black and still, reflecting nothing — not the sky, not your face, not even light itself. Something moves beneath the surface, displacing the black water in slow, deliberate patterns. You step back. The water reaches for your boot. You pull away just in time. The Dreadmire remembers you now.',
                no_witness: 'Some places do not want to be seen. The Dreadmire is one of them.'
            },
            'hollowed-peaks': {
                witness: 'The silence here is wrong. It is not the absence of sound — it is a presence of silence, thick and deliberate, as if the mountains themselves are listening. You place your hand against the stone. It is warm. Not from the sun — there is no sun here. From below. Something vast and ancient moves in the deep places of the world, and the Peaks are its heartbeat. You remove your hand. The stone pulses once beneath your palm.',
                no_witness: 'The Peaks choose who may witness them. You were not chosen today.'
            },
            'gloomveil': {
                witness: 'You enter the Gloomveil and the world ends. There is no light here. None at all. Your torch — magical, alchemical, whatever its source — gutters and dims as if the darkness itself is hungry. The whispers begin immediately. Not in your ears. Inside your mind. Fragments of languages you have never heard, carrying meanings you were not meant to understand. The trees watch. You are certain of this. You begin to walk. The path behind you is gone.',
                no_witness: 'The Gloomveil does not reveal itself to those who still have hope.'
            },
            'sanguine-coast': {
                witness: 'The sea is red. Not red like sunset, or red like rust. Red like the inside of a body. The waves lap at the blackened shore with a sound like lapping tongues. You kneel and cup the water in your hands. It is warm. Thicker than water should be. Something pale and segmented brushes against your ankle beneath the surface. You throw the water away and watch as the wet sand beneath it begins to darken. You leave. The coast does not let you leave. Not fully.',
                no_witness: 'What lies beneath the Sanguine Coast does not wish to be known. It is patient. It has always been patient.'
            },
            'shattered-sanctum': {
                witness: 'Valtheris was magnificent once. You know this because the ruins are too grand, too deliberate in their destruction, to have been anything less than glorious. The shattered towers still reach upward, as if the city died mid-prayer. But it is the silence that undoes you. Not the absence of sound — the absence of LIFE. No insects. No birds. No wind through broken windows. And yet, from somewhere deep below the Sanctum Palace, you hear a rhythm. A slow, steady, breathing. Something vast slumbers beneath the city. You pray it stays asleep. Your prayer is not answered.',
                no_witness: 'The Sanctum does not admit the unworthy. Or perhaps it does — and what lies within decides their worthiness.'
            }
        };

        document.querySelectorAll('.btn-witness').forEach(btn => {
            btn.addEventListener('click', () => {
                const region = btn.dataset.region;
                const data = regionData[region];
                const card = btn.closest('.region-card');

                if (!data) return;

                const existing = card.querySelector('.witness-testimony');
                if (existing) {
                    existing.remove();
                    btn.innerHTML = '<i class="fas fa-eye"></i> Bear Witness';
                    return;
                }

                const testimony = document.createElement('div');
                testimony.className = 'witness-testimony';
                testimony.innerHTML = `<p><em>"${data.witness}"</em></p>`;

                // Style the testimony
                testimony.style.cssText = `
                    padding: 1rem 1.25rem;
                    margin-top: 0.75rem;
                    background: rgba(139, 0, 0, 0.08);
                    border-left: 3px solid var(--color-maroon);
                    border-radius: 0 4px 4px 0;
                    color: var(--color-pale-bone);
                    font-family: 'Crimson Text', serif;
                    font-style: italic;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    animation: fadeInUp 0.5s ease forwards;
                `;

                btn.parentNode.insertBefore(testimony, btn.nextSibling);
                btn.innerHTML = '<i class="fas fa-eye-slash"></i> Look Away';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 10. WITNESS CHECKBOX TRACKING
    // ═══════════════════════════════════════════════════════════
    function initWitnessTracking() {
        const checkboxes = document.querySelectorAll('.witness-checkbox');
        const witnessed = new Set();

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const affliction = cb.dataset.affliction;
                if (cb.checked) {
                    witnessed.add(affliction);
                    // Visual feedback
                    const footer = cb.closest('.affliction-footer');
                    footer.style.background = 'rgba(139, 0, 0, 0.15)';
                    footer.style.borderTopColor = 'rgba(139, 0, 0, 0.4)';

                    const label = footer.querySelector('.witness-label');
                    label.innerHTML = '<i class="fas fa-eye"></i> Witnessed — inscribed upon your soul';
                    label.style.color = '#ef9a9a';
                } else {
                    witnessed.delete(affliction);
                    const footer = cb.closest('.affliction-footer');
                    footer.style.background = '';
                    footer.style.borderTopColor = '';

                    const label = footer.querySelector('.witness-label');
                    label.innerHTML = '<i class="fas fa-eye"></i> I have witnessed this horror';
                    label.style.color = '';
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 11. BACK TO TOP
    // ═══════════════════════════════════════════════════════════
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 12. HERO PARTICLES (floating embers in hero section)
    // ═══════════════════════════════════════════════════════════
    function initHeroParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: ${Math.random() > 0.5 ? 'rgba(200, 80, 20, 0.6)' : 'rgba(139, 42, 42, 0.4)'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: heroFloat ${Math.random() * 10 + 8}s ease-in-out ${Math.random() * -10}s infinite;
                pointer-events: none;
                box-shadow: 0 0 ${Math.random() * 6 + 2}px rgba(220, 20, 60, 0.3);
            `;
            container.appendChild(particle);
        }

        // Inject keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes heroFloat {
                0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                50% { transform: translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 40 - 20}px) scale(${Math.random() * 0.5 + 0.5}); }
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════
    // 13. COUNTER ANIMATION (improved)
    // ═══════════════════════════════════════════════════════════
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter="true"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));

        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const numEl = el.querySelector('.stat-number') || el.querySelector('.summary-number') || el;
            if (!numEl) return;

            const duration = 2200;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                // Format number
                numEl.textContent = current.toLocaleString ? current.toLocaleString() : current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    numEl.textContent = target.toLocaleString ? target.toLocaleString() : target;
                }
            }
            requestAnimationFrame(update);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 14. DYNAMIC SKEW ON SCROLL (hero tilt effect)
    // ═══════════════════════════════════════════════════════════
    function initScrollEffects() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const skew = scrolled * 0.03;
                hero.style.transform = `perspective(1000px) rotateX(${skew}deg)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.3;
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════
    // 15. TYPEWRITER EFFECT ON HERO SUBTITLE
    // ═══════════════════════════════════════════════════════════
    function initTypewriter() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        let index = 0;

        // Wait for hero to be mostly visible
        setTimeout(() => {
            function type() {
                if (index < text.length) {
                    subtitle.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, Math.random() * 30 + 15);
                }
            }
            type();
        }, 1200);
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZE EVERYTHING
    // ═══════════════════════════════════════════════════════════
    ready(() => {
        initCursor();
        initParticles();
        initScrollAnimations();
        initCounters();
        initNavigation();
        initMiseryMeter();
        initAfflictionTracker();
        initRitualCalendar();
        initRegionButtons();
        initWitnessTracking();
        initBackToTop();
        initHeroParticles();
        initCounterAnimations();
        initScrollEffects();
        initTypewriter();
    });

})();
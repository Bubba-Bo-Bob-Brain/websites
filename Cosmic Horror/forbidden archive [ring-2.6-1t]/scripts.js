// ============================================================
// LENG DIGITAL ARCHIVE — RESTRICTED ACCESS TERMINAL
// Script Module v0.9.7 — Department of Ontological Cartography
// CLEARANCE LEVEL: INSUFFICIENT FOR EXECUTION CONTEXT
// ============================================================

(function () {
    'use strict';

    // ============================================================
    // 1. STATE MANAGEMENT
    // ============================================================

    const State = {
        sanity: 100,
        entropy: 0,
        scrollDepth: 0,
        isModalOpen: false,
        activeFilter: 'all',
        uptime: 0,
        recordCount: 47,
        viewedEntries: new Set(),
        whisperedPhrase: '',
        isTyping: false,
    };

    // ============================================================
    // 2. DOM REFERENCES
    // ============================================================

    const DOM = {
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingBar: document.getElementById('loading-bar'),
        loadingText: document.getElementById('loading-text'),
        loadingSub: document.getElementById('loading-sub'),
        sanityContainer: document.getElementById('sanity-container'),
        sanityBar: document.getElementById('sanity-bar'),
        sanityValue: document.getElementById('sanity-value'),
        realityStatus: document.getElementById('reality-status'),
        entropyLevel: document.getElementById('entropy-level'),
        uptimeDisplay: document.getElementById('uptime'),
        lastCheck: document.getElementById('last-check'),
        recordCountDisplay: document.getElementById('record-count'),
        accessLevel: document.getElementById('access-level'),
        searchInput: document.getElementById('search-input'),
        searchAutocomplete: document.getElementById('search-autocomplete'),
        catalogGrid: document.getElementById('catalog-grid'),
        mainContent: document.getElementById('main-content'),
        modalOverlay: document.getElementById('detail-modal'),
        modalBody: document.getElementById('modal-body'),
        modalClose: document.getElementById('modal-close'),
        noiseCanvas: document.getElementById('noise-canvas'),
        cursorGlow: document.getElementById('cursor-glow'),
        scrollWarning: document.getElementById('scroll-warning'),
        searchTags: document.querySelectorAll('.tag'),
        entryDescriptions: document.querySelectorAll('.entry-description'),
    };

    // ============================================================
    // 3. CANVAS NOISE GENERATOR
    // ============================================================

    const NoiseCanvas = (() => {
        let ctx, width, height, imageData, pixels, frameCount = 0;

        function init() {
            const canvas = DOM.noiseCanvas;
            ctx = canvas.getContext('2d');
            resize();
            window.addEventListener('resize', resize);
            animate();
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            imageData = ctx.createImageData(width, height);
            pixels = imageData.data;
        }

        function animate() {
            frameCount++;
            for (let i = 0; i < pixels.length; i += 4) {
                const val = Math.random() * 255;
                pixels[i] = val;       // R
                pixels[i + 1] = val;   // G
                pixels[i + 2] = val;   // B
                pixels[i + 3] = 255;   // A
            }
            ctx.putImageData(imageData, 0, 0);
            requestAnimationFrame(animate);
        }

        return { init };
    })();

    // ============================================================
    // 4. LOADING SEQUENCE
    // ============================================================

    const LoadingSequence = (() => {
        const messages = [
            'INITIALIZING TERMINAL...',
            'LOADING INDEX TABLES...',
            'DECRYPTING MANUSCRIPT CACHE...',
            'VERIFYING ONTOLOGICAL INTEGRITY...',
            'ESTABLISHING REALITY ANCHOR...',
            'LOADING STAR CHARTS...',
            'DECODING TESTIMONY RECORDS...',
            'SYNCHRONIZING TEMPORAL BUFFERS...',
            'VERIFYING CLEARANCE...',
            'ACCESS GRANTED — WELCOME, RESEARCHER.',
        ];

        function start() {
            let progress = 0;
            let msgIndex = 0;

            function update() {
                progress += Math.random() * 3 + 0.5;
                if (progress > 100) progress = 100;

                DOM.loadingBar.style.width = progress + '%';

                if (Math.floor(progress) % 12 === 0 && msgIndex < messages.length) {
                    DOM.loadingText.textContent = messages[msgIndex];
                    msgIndex++;
                }

                if (progress < 100) {
                    requestAnimationFrame(update);
                } else {
                    DOM.loadingText.textContent = messages[messages.length - 1];
                    setTimeout(() => {
                        DOM.loadingOverlay.classList.add('hidden');
                        DOM.loadingOverlay.addEventListener('transitionend', () => {
                            DOM.loadingOverlay.style.display = 'none';
                            App.init();
                        });
                    }, 800);
                }
            }

            requestAnimationFrame(update);
        }

        return { start };
    })();

    // ============================================================
    // 5. SANITY METER SYSTEM
    // ============================================================

    const SanitySystem = (() => {
        let sanityInterval;

        function update() {
            const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
            const scrollCurrent = window.scrollY || document.documentElement.scrollTop;
            const depth = scrollMax > 0 ? scrollCurrent / scrollMax : 0;

            State.scrollDepth = depth;
            State.entropy = Math.min(1, depth * 1.5 + Math.sin(Date.now() / 50000) * 0.05);
            State.sanity = Math.max(0, 100 - (depth * 80) - (State.viewedEntries.size * 2.5));
            State.sanity = Math.round(State.sanity * 100) / 100;

            // Update UI
            DOM.sanityBar.style.width = State.sanity + '%';
            DOM.sanityValue.textContent = Math.round(State.sanity) + '%';
            DOM.entropyLevel.textContent = State.entropy.toFixed(3);

            // Status changes
            DOM.sanityContainer.classList.remove('sanity-critical', 'sanity-low');
            DOM.realityStatus.classList.remove('status-warn');

            if (State.sanity < 30) {
                DOM.sanityContainer.classList.add('sanity-critical');
                DOM.realityStatus.textContent = 'FRAGILE';
                DOM.realityStatus.classList.add('status-warn');
            } else if (State.sanity < 60) {
                DOM.sanityContainer.classList.add('sanity-low');
                DOM.realityStatus.textContent = 'DEGRADED';
                DOM.realityStatus.classList.add('status-warn');
            } else {
                DOM.realityStatus.textContent = 'STABLE';
            }

            // Subtle visual distortions at low sanity
            if (State.sanity < 40) {
                const intensity = (40 - State.sanity) / 40;
                document.body.style.setProperty('--glow-amber', `0 0 ${30 + intensity * 40}px rgba(201, 168, 76, ${0.3 + intensity * 0.3}), 0 0 ${80 + intensity * 60}px rgba(201, 168, 76, ${0.1 + intensity * 0.15})`);
            }

            DOM.lastCheck.textContent = new Date().toLocaleTimeString();
        }

        function start() {
            sanityInterval = setInterval(update, 500);
            update();
        }

        return { start, update };
    })();

    // ============================================================
    // 6. UPTIME COUNTER
    // ============================================================

    const UptimeCounter = (() => {
        function start() {
            setInterval(() => {
                State.uptime++;
                const hours = Math.floor(State.uptime / 3600);
                const minutes = Math.floor((State.uptime % 3600) / 60);
                const seconds = State.uptime % 60;
                DOM.uptimeDisplay.textContent =
                    String(hours).padStart(2, '0') + ':' +
                    String(minutes).padStart(2, '0') + ':' +
                    String(seconds).padStart(2, '0');
            }, 1000);
        }

        return { start };
    })();

    // ============================================================
    // 7. CURSOR GLOW EFFECT
    // ============================================================

    const CursorGlow = (() => {
        function init() {
            document.addEventListener('mousemove', (e) => {
                DOM.cursorGlow.style.left = e.clientX + 'px';
                DOM.cursorGlow.style.top = e.clientY + 'px';
            });
        }

        return { init };
    })();

    // ============================================================
    // 8. TENTACLE WRITHE ENHANCEMENT
    // ============================================================

    const Tentacles = (() => {
        function init() {
            const leftTentacles = document.querySelectorAll('.tentacle-left path');
            const rightTentacles = document.querySelectorAll('.tentacle-right path');

            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;

                leftTentacles.forEach((t, i) => {
                    const offset = (i + 1) * 5;
                    t.style.transform = `translate(${x * offset}px, ${y * offset * 0.5}px)`;
                });

                rightTentacles.forEach((t, i) => {
                    const offset = (i + 1) * 5;
                    t.style.transform = `translate(${x * offset}px, ${y * offset * 0.5}px)`;
                });
            });
        }

        return { init };
    })();

    // ============================================================
    // 9. NON-EUCLIDEAN PARALLAX EFFECT
    // ============================================================

    const Parallax = (() => {
        function init() {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const sections = document.querySelectorAll('.catalog-section');

                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    const centerY = window.innerHeight / 2;
                    const distance = rect.top - centerY;
                    const factor = distance / centerY;

                    const rotateY = factor * (index % 2 === 0 ? 0.8 : -0.6);
                    const translateX = factor * (index % 3 === 0 ? 8 : -5);
                    const skewY = factor * 0.3;

                    section.style.transform = `perspective(1200px) rotateY(${rotateY}deg) translateX(${translateX}px) skewY(${skewY}deg)`;
                    section.style.opacity = 1 - Math.abs(factor) * 0.15;
                });
            }, { passive: true });
        }

        return { init };
    })();

    // ============================================================
    // 10. GLITCH TEXT EFFECT ON HOVER
    // ============================================================

    const GlitchEffect = (() => {
        const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01234567890!@#$%^&*()';

        function corruptText(element) {
            const original = element.getAttribute('data-text') || element.textContent;
            const duration = 800;
            const startTime = Date.now();
            let interval;

            interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                if (progress >= 1) {
                    clearInterval(interval);
                    element.textContent = original;
                    return;
                }

                let corrupted = '';
                for (let i = 0; i < original.length; i++) {
                    if (original[i] === ' ') {
                        corrupted += ' ';
                    } else {
                        const chaos = Math.random();
                        if (chaos < progress * 0.8) {
                            corrupted += original[i];
                        } else {
                            corrupted += glyphs[Math.floor(Math.random() * glyphs.length)];
                        }
                    }
                }
                element.textContent = corrupted;
            }, 40);
        }

        function init() {
            document.querySelectorAll('.glitch').forEach((el) => {
                el.addEventListener('mouseenter', () => corruptText(el));
            });
        }

        return { init };
    })();

    // ============================================================
    // 11. DESCRIPTION HOVER REVELATION
    // ============================================================

    const HoverReveal = (() => {
        function init() {
            document.querySelectorAll('.entry-description[data-hover-text]').forEach((desc) => {
                const fullText = desc.getAttribute('data-hover-text');
                const normalText = desc.textContent;
                let isHovering = false;

                desc.addEventListener('mouseenter', () => {
                    isHovering = true;
                    let index = 0;
                    const typeInterval = setInterval(() => {
                        if (!isHovering || index >= fullText.length) {
                            clearInterval(typeInterval);
                            if (isHovering) desc.textContent = fullText;
                            return;
                        }
                        desc.textContent = fullText.substring(0, index + 1) + normalText.substring(index + 1);
                        index++;
                    }, 25);
                });

                desc.addEventListener('mouseleave', () => {
                    isHovering = false;
                    const fadeOutInterval = setInterval(() => {
                        if (isHovering) {
                            clearInterval(fadeOutInterval);
                            return;
                        }
                        desc.textContent = normalText;
                        clearInterval(fadeOutInterval);
                    }, 300);
                });
            });
        }

        return { init };
    })();

    // ============================================================
    // 12. SEARCH SYSTEM WITH DISTURBING AUTOCOMPLETE
    // ============================================================

    const SearchSystem = (() => {
        const searchIndex = [
            { title: 'The Codex Pallidus', category: 'text', id: 't001', class: 'Keter' },
            { title: 'Treatise on the Geometry of Non-Being', category: 'text', id: 't002', class: 'Euclid' },
            { title: 'The Seventh Litany of What Follows', category: 'text', id: 't003', class: 'Apollyon' },
            { title: 'Marginalia of the Pale Garden', category: 'text', id: 't004', class: 'Safe' },
            { title: 'Liber Absconditus Fulguris', category: 'text', id: 't005', class: 'Keter' },
            { title: 'Choir of the Subcutaneous', category: 'text', id: 't006', class: 'Euclid' },
            { title: 'Vela X-7: The Cemetery Spiral', category: 'chart', id: 'c001', class: 'Keter' },
            { title: 'Cartographia Nulla — Map of the Void', category: 'chart', id: 'c002', class: 'Euclid' },
            { title: 'NGC-0000: The Galaxy That Maps Back', category: 'chart', id: 'c003', class: 'Apollyon' },
            { title: 'Survey of the Ember Remnant', category: 'chart', id: 'c004', class: 'Safe' },
            { title: 'Account of D-9341: The Geometry Room', category: 'testimony', id: 'w001', class: 'Keter' },
            { title: "Dr. Harlow's Field Notes — Night 14", category: 'testimony', id: 'w002', class: 'Euclid' },
            { title: 'Transcript — Undersea Listening Post Theta', category: 'testimony', id: 'w003', class: 'Apollyon' },
            { title: 'Interview with the Boy from Snorraholt', category: 'testimony', id: 'w004', class: 'Euclid' },
            { title: 'The Obsidian Mirror of Ur', category: 'artifact', id: 'a001', class: 'Keter' },
            { title: 'The Resonant Tuning Fork', category: 'artifact', id: 'a002', class: 'Euclid' },
        ];

        // Disturbing search suggestion phrases
        const disturbingPrompts = [
            'you shouldn\'t have searched for this',
            '3 results found. 2 are watching you.',
            'the archive is watching your query',
            'relevance: irrelevant. Fate: inevitable.',
            'this search remembers you',
            '404: Sanity not found',
            'the void stared back. it knows your name.',
            'results filtered by your cognitive profile',
            'warning: last researcher of this query was never found',
            'your search pattern has been logged',
            'the index rearranges itself for you',
            '07 01 12 15 19 08 — do you recognize this?',
        ];

        function showResults(query) {
            const q = query.toLowerCase().trim();
            const results = q
                ? searchIndex.filter((item) =>
                    item.title.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.class.toLowerCase().includes(q)
                  )
                : [];

            DOM.searchAutocomplete.innerHTML = '';

            if (results.length > 0) {
                results.forEach((result) => {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.innerHTML = `
                        <div class="result-title">${highlightMatch(result.title, q)}</div>
                        <div class="result-category">${result.class} — ${result.category.toUpperCase()}</div>
                    `;
                    div.addEventListener('click', () => {
                        openModal(result.id);
                        DOM.searchAutocomplete.classList.remove('visible');
                        DOM.searchInput.value = '';
                    });
                    DOM.searchAutocomplete.appendChild(div);
                });
            } else if (q.length > 0) {
                const disturbance = disturbingPrompts[Math.floor(Math.random() * disturbingPrompts.length)];
                const div = document.createElement('div');
                div.className = 'search-no-results';
                div.textContent = `⊙ ${disturbance} ⊙`;
                DOM.searchAutocomplete.appendChild(div);
            }

            DOM.searchAutocomplete.classList.toggle('visible', results.length > 0 || (q.length > 0 && results.length === 0));
        }

        function highlightMatch(text, query) {
            if (!query) return escapeHTML(text);
            const escaped = escapeHTML(text);
            const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
            return escaped.replace(regex, '<span style="color:var(--color-amber-bright);font-weight:700;">$1</span>');
        }

        function escapeHTML(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function init() {
            DOM.searchInput.addEventListener('input', () => {
                showResults(DOM.searchInput.value);
            });

            DOM.searchInput.addEventListener('focus', () => {
                if (DOM.searchInput.value.trim().length > 0) {
                    showResults(DOM.searchInput.value);
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    DOM.searchAutocomplete.classList.remove('visible');
                }
            });

            // Whispering autocomplete
            DOM.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    DOM.searchAutocomplete.classList.remove('visible');
                    // Whisper the query
                    whisperQuery(DOM.searchInput.value);
                }
            });
        }

        function whisperQuery(query) {
            if (!query.trim()) return;

            // Create a floating whisper text
            const whisper = document.createElement('div');
            whisper.className = 'search-whisper';
            const phrases = [
                `"${query}"... they will hear you...`,
                `you asked for "${query}"... was it wise?`,
                `the index shifts for "${query}"...`,
                `something has noted your interest in "${query}"...`,
                `"${query}" — the archive remembers...`,
            ];
            whisper.textContent = phrases[Math.floor(Math.random() * phrases.length)];
            whisper.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-family: 'Space Mono', monospace;
                font-size: 0.7rem;
                color: rgba(201, 168, 76, 0.6);
                letter-spacing: 0.1em;
                z-index: 9999;
                max-width: 350px;
                padding: 12px 16px;
                background: rgba(6, 6, 12, 0.9);
                border: 1px solid rgba(201, 168, 76, 0.2);
                border-left: 3px solid var(--color-amber-dim);
                animation: whisperFadeIn 0.5s ease forwards;
                pointer-events: none;
            `;
            document.body.appendChild(whisper);

            setTimeout(() => {
                whisper.style.opacity = '0';
                whisper.style.transition = 'opacity 1s ease';
                setTimeout(() => whisper.remove(), 1000);
            }, 5000);
        }

        return { init };
    })();

    // ============================================================
    // 13. FILTER SYSTEM
    // ============================================================

    const FilterSystem = (() => {
        function init() {
            DOM.searchTags.forEach((tag) => {
                tag.addEventListener('click', () => {
                    const filter = tag.dataset.filter;
                    State.activeFilter = filter;

                    // Update active tag
                    DOM.searchTags.forEach((t) => t.classList.remove('active'));
                    tag.classList.add('active');

                    // Filter entries
                    filterEntries(filter);
                });
            });
        }

        function filterEntries(filter) {
            document.querySelectorAll('.catalog-entry').forEach((entry) => {
                if (filter === 'all' || entry.dataset.category === filter) {
                    entry.style.display = '';
                    entry.style.animation = 'none';
                    entry.offsetHeight; // Trigger reflow
                    entry.style.animation = '';
                } else {
                    entry.style.display = 'none';
                }
            });

            // Update record count
            const visible = document.querySelectorAll('.catalog-entry[style*="display: block"], .catalog-entry:not([style*="display: none"])').length;
            // More reliable count
            let count = 0;
            document.querySelectorAll('.catalog-entry').forEach((e) => {
                if (e.style.display !== 'none') count++;
            });
            DOM.recordCountDisplay.textContent = count;
            DOM.accessLevel.textContent = count;
        }

        return { init };
    })();

    // ============================================================
    // 14. MODAL SYSTEM
    // ============================================================

    const ModalSystem = (() => {
        // Extended content for each record
        const detailedContent = {
            t001: {
                title: 'The Codex Pallidus',
                class: 'keter',
                classLabel: 'KETER',
                meta: `
                    <div><span>Date of Origin:</span> Estimated 1583 CE (disputed)</div>
                    <div><span>Author:</span> ████████ — identity redacted</div>
                    <div><span>Pages:</span> ████ (varies per reading)</div>
                    <div><span>Medium:</span> Unknown organic substrate</div>
                    <div><span>Location:</span> Vault 7, Wing C, Site-███</div>
                `,
                description: `
                    <p>The Codex Pallidus is a manuscript bound in what analysis confirms is not any known animal skin. Radiocarbon dating produces contradictory results, ranging from 2000 BCE to 1987. The text within is written in an alphabet that bears superficial resemblance to medieval Greek but follows no known linguistic rules.</p>
                    <p style="margin-top:12px;">The most disturbing property of the Codex is its responsive nature. When a reader is not directly observing the page, the text rearranges itself. Linguists who have memorized passages report that the content changes to describe <em>them</em> — their childhood, their fears, their deaths. The accuracy of these descriptions is 100%.</p>
                    <p style="margin-top:12px;">All subjects who have completed a full reading (estimated 14 hours continuous) have reported the same final passage: a description of the reader, in perfect detail, reading the passage itself. This recursion has caused permanent dissociative episodes in 6 of 11 readers.</p>
                `,
                tags: ['linguistic anomaly', 'cognitohazard', 'textual mutation', 'extradimensional', 'self-referential'],
                transcript: `TRANSCRIPT — SUBJECT D-9102
                
                "I... I finished it. The last page. And it described me reading it. 
                Not metaphorically. Not poetically. It described me, right now, 
                in this chair, reading about me reading it. The margins had notes 
                in my handwriting — notes I haven't written yet. 
                
                (30 seconds of silence)
                
                I don't recommend finishing it. I don't recommend having started it."
                
                [END TRANSCRIPT]`
            },
            t002: {
                title: 'Treatise on the Geometry of Non-Being',
                class: 'euclid',
                classLabel: 'EUCLID',
                meta: `
                    <div><span>Author:</span> J. Álvarez</div>
                    <div><span>Date:</span> 1847</div>
                    <div><span>Pages:</span> 13 surviving</div>
                    <div><span>Origin:</span> Private collection, Buenos Aires</div>
                `,
                description: `
                    <p>Thirteen surviving pages describe geometries in negative-dimensional space. Each theorem is logically sound yet produces acute spatial disorientation in anyone who attempts to verify the proofs manually. Three independent mathematicians who verified the theorems required hospitalization for spatial dissociation.</p>
                    <p style="margin-top:12px;">The diagrams included in the treatise appear to extend beyond the physical page boundary. When photographed, the diagrams in developed film occupy a larger area than the paper they were drawn on.</p>
                `,
                tags: ['mathematical anomaly', 'spatial distortion', 'cognitohazard'],
                transcript: `Researcher Field Note — "The angles don't add up. I know they don't add up. 
                I've checked 14 times. But the proof is correct. It HAS to be correct. 
                I just can't reconcile it with three-dimensional space because IT DOESN'T EXIST in three dimensions."`
            },
            t003: {
                title: 'The Seventh Litany of What Follows',
                class: 'apollyon',
                classLabel: 'APOLLYON',
                meta: `
                    <div><span>Date of Origin:</span> Unknown</div>
                    <div><span>Author:</span> UNKNOWN</div>
                    <div><span>Pages:</span> ∞?</div>
                    <div><span>Location:</span> [REDACTED]</div>
                `,
                description: `
                    <p>Recovered from a sealed chamber beneath [REDACTED]. The text appears to extend infinitely; all attempts at photocopying or digital scanning produce pages that continue beyond any physical boundary. Reading proceeds normally until the reader encounters their own name, at which point the text ahead describes their death in perfect detail.</p>
                    <p style="margin-top:12px;">The binding of the text is anomalous — the first page is also the last page, but the content between them is not finite. Attempts to destroy the text have resulted in the text appearing in nearby surfaces. It has been relocated ███ times.</p>
                `,
                tags: ['extradimensional', 'prophetic', 'ontological hazard', 'indestructible', 'extraterrestrial origin'],
                transcript: `CLASSIFIED — Incident Report ██/███
                
                "It doesn't end. It doesn't BEGIN. We opened the chamber 
                and it was already there. It wasn't placed there — it was 
                WAITING. I've been reading for 11 hours. I found my name 
                on page ██. What follows is accurate. God help us all."
                
                [TRANSMISSION TERMINATED — SIGNAL LOST]`
            },
            t004: {
                title: 'Marginalia of the Pale Garden',
                class: 'safe',
                classLabel: 'SAFE',
                meta: `
                    <div><span>Date of Origin:</span> 1672</div>
                    <div><span>Author:</span> Mother Céline</div>
                    <div><span>Pages:</span> 214</div>
                    <div><span>Origin:</span> Carthusian Monastery, [REDACTED]</div>
                `,
                description: `
                    <p>A gardening manual describing the cultivation of flora from a region that does not correspond to any point on Earth's surface. The plants described are beautiful but their Latin nomenclature induces severe migraines. Illustrations move when viewed from different angles.</p>
                    <p style="margin-top:12px;">Despite its anomalous properties, the text is considered relatively safe. The primary risk is the euphoric effect of prolonged reading — subjects report an overwhelming desire to "plant the garden" described within. No known locations match the geography described.</p>
                `,
                tags: ['botanical', 'euphoric agent', 'non-Euclidean cartography'],
                transcript: null
            },
            t005: {
                title: 'Liber Absconditus Fulguris',
                class: 'keter',
                classLabel: 'KETER',
                meta: `
                    <div><span>Date of Origin:</span> Unknown</div>
                    <div><span>Author:</span> ████████████</div>
                    <div><span>Pages:</span> ████</div>
                    <div><span>Copies Known:</span> 3</div>
                `,
                description: `
                    <p>The Book of Hidden Lightning. Electromagnetic equipment fails within 12 meters of any copy. Subjects who sleep near the text report dreams of an infinite desert under a sky of green fire. Three copies exist; each was found inside a meteorite impact crater.</p>
                    <p style="margin-top:12px;">The text is written in a metallic ink that has been identified as neither an element nor any known compound. When read aloud, the vibrations produced resonate at frequencies that cause structural damage to surrounding materials. The text describes — in exacting detail — an event that has not yet occurred but will be responsible for ████ casualties.</p>
                `,
                tags: ['electromagnetic anomaly', 'oneiric projection', 'extraterrestrial origin', 'precognitive'],
                transcript: null
            },
            t006: {
                title: 'Choir of the Subcutaneous',
                class: 'euclid',
                classLabel: 'EUCLID',
                meta: `
                    <div><span>Author:</span> Dr. E. Voss</div>
                    <div><span>Date:</span> 1923</div>
                    <div><span>Pages:</span> 89</div>
                    <div><span>Language:</span> Must be read aloud</div>
                `,
                description: `
                    <p>A medical treatise describing a harmonic language spoken by the human subcutaneous tissue when stimulated at precise frequencies. The text itself must be read aloud; silent reading produces no comprehension. The sound produced during reading has caused mass hemorrhaging in three documented public readings.</p>
                    <p style="margin-top:12px;">Dr. Voss's research suggests that the language predates human speech by an estimated 400,000 years, encoded in the resonance patterns of human tissue itself. The implications of this are — to say the least — unsettling.</p>
                `,
                tags: ['acoustic hazard', 'biological anomaly', 'medical', 'paleolinguistics'],
                transcript: null
            },
            c001: {
                title: 'Vela X-7: The Cemetery Spiral',
                class: 'keter',
                classLabel: 'KETER',
                meta: `
                    <div><span>Distance:</span> 2.7 Billion Light-Years</div>
                    <div><span>Status:</span> ☠ EXTINCT</div>
                    <div><span>Chart Date:</span> Unknown</div>
                    <div><span>Recovery:</span> Extraterrestrial Signal</div>
                `,
                description: `
                    <p>A star chart of a galaxy that ceased to exist approximately 2.7 billion years ago, recovered from a signal that predates the galaxy's own formation. Navigation officers who study the chart report an overwhelming sense of being watched from a direction that does not correspond to any spatial axis.</p>
                    <p style="margin-top:12px;">The chart contains star systems that, according to current cosmological models, should not have been capable of forming at the depicted epoch. Three navigators who spent more than 4 hours studying the chart attempted to chart a course toward the galaxy's former location. None were found.</p>
                `,
                tags: ['temporal paradox', 'deep space', 'extraterrestrial signal', 'navigation hazard'],
                transcript: null
            },
            c002: {
                title: 'Cartographia Nulla — Map of the Void',
                class: 'euclid',
                classLabel: 'EUCLID',
                meta: `
                    <div><span>Region:</span> Local Void</div>
                    <div><span>Scale:</span> ∞</div>
                    <div><span>Date:</span> 1987</div>
                    <div><span>Cartographers:</span> 3 (all compromised)</div>
                `,
                description: `
                    <p>A map of a region of space where no galaxies, stars, or dark matter have been detected. The chart extends in directions that volunteers insist "feel longer than they should." Three cartographers who worked on this project independently began drawing the same spiral pattern, which none could explain.</p>
                `,
                tags: ['cosmic void', 'perceptual distortion', 'psychological hazard'],
                transcript: null
            },
            c003: {
                title: 'NGC-0000: The Galaxy That Maps Back',
                class: 'apollyon',
                classLabel: 'APOLLYON',
                meta: `
                    <div><span>Distance:</span> UNKNOWN</div>
                    <div><span>Status:</span> ◌ ACTIVELY OBSERVED</div>
                    <div><span>Observation Risk:</span> NEUROLOGICAL</div>
                `,
                description: `
                    <p>A chart depicting a galaxy whose shape, when viewed for longer than seven seconds, appears to mirror the observer's neural network. Prolonged exposure causes subjects to lose the ability to distinguish between their own memories and astronomical data. The telescope that captured this image has since been found pointing at nothing.</p>
                    <p style="margin-top:12px;">Current theory suggests the galaxy is not merely shaped like a neural network — it IS a neural network. The implications of a galaxy-scale consciousness remain unexplored due to the immediate and irreversible cognitive damage caused by observation.</p>
                `,
                tags: ['neurological hazard', 'self-referential', 'active observation', 'xenoneurology'],
                transcript: null
            },
            c004: {
                title: 'Survey of the Ember Remnant',
                class: 'safe',
                classLabel: 'SAFE',
                meta: `
                    <div><span>Distance:</span> 412 Million Light-Years</div>
                    <div><span>Status:</span> ☠ QUENCHED</div>
                    <div><span>Date:</span> 1962</div>
                `,
                description: `
                    <p>A star chart of a galaxy cluster that underwent premature heat death. Unusually, all spectral readings show a faint repeating pattern in the infrared that corresponds to no known natural phenomenon. The pattern resembles a counting system, but no base has been identified.</p>
                `,
                tags: ['infrared anomaly', 'signal pattern', 'extinct civilization?'],
                transcript: null
            },
            w001: {
                title: 'Account of D-9341: The Geometry Room',
                class: 'keter',
                classLabel: 'KETER',
                meta: `
                    <div><span>Date:</span> REDACTED</div>
                    <div><span>Witness:</span> D-9341</div>
                    <div><span>Current Status:</span> ████████</div>
                    <div><span>Location:</span> Site-███, Sublevel 4</div>
                `,
                description: `
                    <p>Subject reports entering a room where all internal angles summed to more than 360 degrees. "The corners," the transcript reads, "went places that corners have no right to go." Subject was found 72 hours later, walking in a perfect circle, speaking in a language that does not exist. They had no pulse but were conscious throughout questioning.</p>
                    <p style="margin-top:12px;">The room has since been sealed. Attempts to measure its dimensions from outside produce results that are mathematically impossible. The space inside, if the readings are accurate, is larger than the building that contains it.</p>
                `,
                tags: ['spatial anomaly', 'amnestic treatment', 'physical law violation', 'Euclidean failure'],
                transcript: `TRANSCRIPT — D-9341 INTERROGATION, SESSION 7
                
                INTERROGATOR: "Can you describe the room?"
                D-9341: "It... it had too many walls. Not too many walls — the right 
                number of walls. But they were in the wrong places. The corners 
                went places that corners have no right to go."
                
                INTERROGATOR: "What happened when you tried to leave?"
                D-9341: "There was no 'away.' Every direction led to the center. 
                The center was everywhere. I was the center. The room was me."
                
                [D-9341 begins drawing a circle. Does not stop for 11 hours.]
                
                INTERROGATOR: "D-9341? D-9341, respond."
                D-9341: "Why are you asking me questions? I've always been here. 
                You're the one who just arrived."
                
                [END TRANSCRIPT]`
            },
            w002: {
                title: "Dr. Harlow's Field Notes — Night 14",
                class: 'euclid',
                classLabel: 'EUCLID',
                meta: `
                    <div><span>Date:</span> 04/██/19██</div>
                    <div><span>Witness:</span> Dr. R. Harlow</div>
                    <div><span>Status:</span> RECOVERED</div>
                    <div><span>Location:</span> Site-███</div>
                `,
                description: `
                    <p>Partial field notes recovered from Site-███. Dr. Harlow describes the gradual realization that the entity being studied was studying them back. The handwriting degrades over four pages, becoming geometrically precise in a way no human hand could achieve. Final entry: "I understand now why it has been so patient."</p>
                `,
                tags: ['cognitohazard', 'field research', 'entity interaction', 'handwriting analysis'],
                transcript: `EXCERPT — FIELD NOTES, NIGHT 14
                
                "Day 14. The specimen has not moved. It cannot move — we've 
                confirmed this repeatedly. But I notice it is facing a 
                different direction than yesterday. Not a different 
                direction — a different FACE. It has more than one."
                
                "The cameras show nothing. All four angles captured 
                identically. But I SAW it. I saw it look at me."
                
                "Correction: I saw it look THROUGH me. As if I were 
                transparent. As if my skeleton were the interesting part."
                
                [Remainder illegible — handwriting shifts to precise 
                geometric patterns. Ink analysis reveals the 'ink' is 
                not ink.]
                
                Final legible entry: "I understand now."`
            },
            w003: {
                title: 'Transcript — Undersea Listening Post Theta',
                class: 'apollyon',
                classLabel: 'APOLLYON',
                meta: `
                    <div><span>Date:</span> REDACTED/20██</div>
                    <div><span>Witnesses:</span> 14 PERSONNEL</div>
                    <div><span>Current Status:</span> ████████</div>
                    <div><span>Location:</span> Mariana Trench</div>
                `,
                description: `
                    <p>Audio transcript recovered from Listening Post Theta, deep in the Mariana Trench. The recording begins with standard oceanic ambient noise. At 00:14:33, all personnel begin speaking in unison a phrase in no known language. At 00:14:34, the recording ends. Post-recovery analysis found the phrase translates roughly to "We have heard you. When do we begin?"</p>
                    <p style="margin-top:12px;">All 14 personnel were recovered alive. None could recall what happened during the 14-second gap. Under hypnosis, all 14 produced identical drawings of a structure described as "the building where the ocean thinks." None had architectural training.</p>
                `,
                tags: ['acoustic anomaly', 'mass possession', 'deep ocean', 'xenolinguistics'],
                transcript: `AUDIO TRANSCRIPT — LISTENING POST THETA
                [00:00:00] Standard oceanic ambient. Hydrophone nominal.
                [00:05:12] Unidentified low-frequency vibration detected.
                [00:09:44] Vibration pattern shifts. Possible structure detected.
                [00:12:30] Senior Researcher Marenko notes "the pattern is 
                almost linguistic." Requesting additional analysis.
                [00:14:30] All hydrophones register simultaneous spike.
                [00:14:31] Personnel begin to move.
                [00:14:32] All 14 personnel standing. Facing same direction.
                [00:14:33] ████ ████ ████ ████ ████ ████ ████ ████ ████ 
                ████ ████ ████ ████
                [00:14:34] [END RECORDING]
                
                [POST-RECOVERY NOTE: The unidentified phrase, when 
                cross-referenced with 14,000+ linguistic databases, 
                produced a partial match to no known language. However, 
                a structural match was found in ████████████████ 
                phonological models dating to approximately ████ BCE.]
                `
            },
            w004: {
                title: 'Interview with the Boy from Snorraholt',
                class: 'euclid',
                classLabel: 'EUCLID',
                meta: `
                    <div><span>Date:</span> 12/██/20██</div>
                    <div><span>Witness:</span> ███ ████████ (Age 7)</div>
                    <div><span>Status:</span> RETIRED (AGED)</div>
                    <div><span>Origin:</span> Snorraholt, Iceland</div>
                `,
                description: `
                    <p>A seven-year-old Icelandic boy described in perfect detail an underground library containing "books made of light." His descriptions matched no known architectural style but precisely matched the layout of a sealed Foundation vault built in 1951. The boy had never left his village. He drew a symbol on the wall that matched the Archive's own seal. He has not aged since.</p>
                `,
                tags: ['temporal anomaly', 'child witness', 'spatial knowledge', 'rejuvenation?'],
                transcript: `TRANSCRIPT — INTERVIEW, Snorraholt, Iceland
                
                INTERVIEWER: "Can you tell me about the library?"
                BOY: "It's under the mountain. The books don't have pages. 
                They have light inside them."
                
                INTERVIEWER: "How many books are there?"
                BOY: "All of them. Every book that was ever written and 
                every book that hasn't been written yet."
                
                INTERVIEWER: "Who takes care of the library?"
                BOY: "The Librarian. But the Librarian IS the library. 
                They're the same. They've been waiting for so long."
                
                [The boy draws a complex geometric symbol. Researcher 
                recognizes it as identical to the Archive's seal — a 
                symbol not made public until 1951.]
                
                INTERVIEWER: "Where did you learn this symbol?"
                BOY: [no response. smiles. stops blinking.]
                
                [END INTERVIEW — Subject has not visibly aged in the 
                3 years since. Medical examination inconclusive.]`
            },
            a001: {
                title: 'The Obsidian Mirror of Ur',
                class: 'keter',
                classLabel: 'KETER',
                meta: `
                    <div><span>Era:</span> ~3000 BCE</div>
                    <div><span>Origin:</span> Sumerian Ziggurat, Ur</div>
                    <div><span>Current Status:</span> ████ (contained)</div>
                    <div><span>Surface Temp:</span> -273.15°C</div>
                `,
                description: `
                    <p>A polished obsidian disc recovered from a Sumerian ziggurat. The mirror does not reflect the present — all who gaze into it report seeing a version of themselves that has not yet lived. Three researchers have entered permanent vegetative states after prolonged observation. The mirror's surface temperature is consistently -273.15°C, regardless of environment.</p>
                `,
                tags: ['temporal viewing', 'cryogenic anomaly', 'mesopotamian origin', 'cognitohazard'],
                transcript: null
            },
            a002: {
                title: 'The Resonant Tuning Fork',
                class: 'euclid',
                classLabel: 'EUCLID',
                meta: `
                    <div><span>Era:</span> Unknown</div>
                    <div><span>Origin:</span> UNKNOWN</div>
                    <div><span>Frequency:</span> 7.83 Hz</div>
                    <div><span>Material:</span> Unknown alloy</div>
                `,
                description: `
                    <p>A tuning fork that vibrates at exactly 7.83 Hz — the Earth's fundamental resonant frequency — despite being constructed from an unknown metallic alloy not found on the periodic table. When struck, all electronic displays within 50 meters show the same image: a spiral galaxy being consumed by darkness.</p>
                `,
                tags: ['acoustic anomaly', 'unknown material', 'electronic disruption', 'Schumann resonance'],
                transcript: null
            },
        };

        function openModal(entryId) {
            const content = detailedContent[entryId];
            if (!content) {
                // Generic content for unmapped entries
                const entry = document.querySelector(`[data-id="${entryId}"]`);
                const title = entry.querySelector('.entry-title').textContent;
                const classEl = entry.querySelector('.entry-classification');
                const classText = classEl ? classEl.querySelector('.class-value').textContent : 'UNKNOWN';
                const desc = entry.querySelector('.entry-description').textContent;
                const tags = Array.from(entry.querySelectorAll('.entry-tags span')).map(s => s.textContent);

                DOM.modalBody.innerHTML = `
                    <h3 class="modal-title">${title}</h3>
                    <div class="modal-class ${classText.toLowerCase()}">${classText}</div>
                    <div class="modal-description"><p>${desc}</p></div>
                    <div class="modal-tags">${tags.map(t => `<span>${t}</span>`).join('')}</div>
                `;
            } else {
                DOM.modalBody.innerHTML = `
                    <h3 class="modal-title">${content.title}</h3>
                    <div class="modal-class ${content.class}">${content.classLabel}</div>
                    <div class="modal-meta">${content.meta}</div>
                    <div class="modal-description">${content.description}</div>
                    <div class="modal-tags">${content.tags.map(t => `<span>${t}</span>`).join('')}</div>
                    ${content.transcript ? `<div class="modal-transcript">${content.transcript}</div>` : ''}
                `;
            }

            DOM.modalOverlay.classList.add('visible');
            State.isModalOpen = true;
            document.body.style.overflow = 'hidden';

            // Degrade sanity slightly on viewing detail
            State.sanity = Math.max(0, State.sanity - 1);
            State.viewedEntries.add(entryId);
        }

        function closeModal() {
            DOM.modalOverlay.classList.remove('visible');
            State.isModalOpen = false;
            document.body.style.overflow = '';
        }

        function init() {
            DOM.modalClose.addEventListener('click', closeModal);
            DOM.modalOverlay.addEventListener('click', (e) => {
                if (e.target === DOM.modalOverlay) closeModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && State.isModalOpen) closeModal();
            });

            // Bind access buttons
            document.querySelectorAll('.entry-access-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const entry = btn.closest('.catalog-entry');
                    if (entry) openModal(entry.dataset.id);
                });
            });

            // Bind entry click (open modal)
            document.querySelectorAll('.catalog-entry').forEach((entry) => {
                entry.addEventListener('click', () => {
                    if (!e || !e.target.closest('.entry-access-btn')) {
                        openModal(entry.dataset.id);
                    }
                });
            });
        }

        return { init };
    })();

    // ============================================================
    // 15. WHISPER CSS INJECTION
    // ============================================================

    const WhisperStyles = (() => {
        function init() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes whisperFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .search-whisper {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.7rem;
                    color: rgba(201, 168, 76, 0.6);
                    letter-spacing: 0.1em;
                    z-index: 9999;
                    max-width: 350px;
                    padding: 12px 16px;
                    background: rgba(6, 6, 12, 0.9);
                    border: 1px solid rgba(201, 168, 76, 0.2);
                    border-left: 3px solid rgba(201, 168, 76, 0.4);
                    pointer-events: none;
                    backdrop-filter: blur(4px);
                }
            `;
            document.head.appendChild(style);
        }

        return { init };
    })();

    // ============================================================
    // 16. VISUAL DISTURBANCES AT LOW SANITY
    // ============================================================

    const VisualDisturbances = (() => {
        let rafId;

        function init() {
            applyStyles();
            animate();
        }

        function applyStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .distortion-active .catalog-entry:hover {
                    transform: translateY(-2px) rotateX(${Math.random() * 0.5 - 0.25}deg) rotateY(${Math.random() * 0.5 - 0.25}deg);
                }
                @keyframes subtleShake {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(0.3px, -0.3px); }
                    50% { transform: translate(-0.3px, 0.3px); }
                    75% { transform: translate(0.3px, 0.3px); }
                }
                .disturbance-shake {
                    animation: subtleShake 0.1s infinite;
                }
                @keyframes textDrift {
                    0%, 100% { letter-spacing: 0em; }
                    50% { letter-spacing: 0.05em; }
                }
                .disturbance-drift {
                    animation: textDrift 3s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }

        function animate() {
            const threshold = 0.5; // Below 50% sanity

            if (State.sanity < 50) {
                const intensity = (50 - State.sanity) / 50;

                // Random character corruption in descriptions
                if (Math.random() < intensity * 0.02) {
                    corruptRandomCharacter();
                }

                // Subtle page shake at very low sanity
                if (State.sanity < 25 && Math.random() < 0.01) {
                    document.body.classList.add('disturbance-shake');
                    setTimeout(() => document.body.classList.remove('disturbance-shake'), 200);
                }

                // Header text drift
                if (State.sanity < 35) {
                    const subtitle = document.querySelector('.sub-line-2');
                    if (subtitle && Math.random() < 0.01) {
                        subtitle.classList.add('disturbance-drift');
                        setTimeout(() => subtitle.classList.remove('disturbance-drift'), 3000);
                    }
                }
            }

            rafId = requestAnimationFrame(animate);
        }

        function corruptRandomCharacter() {
            const descriptions = document.querySelectorAll('.entry-description');
            if (descriptions.length === 0) return;

            const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
            const text = randomDesc.textContent;
            if (text.length < 10) return;

            const pos = Math.floor(Math.random() * (text.length - 2)) + 1;
            const glyphs = '█▓▒░╗╔╚╝║═';
            const corrupted = text.substring(0, pos) + glyphs[Math.floor(Math.random() * glyphs.length)] + text.substring(pos + 1);
            randomDesc.textContent = corrupted;

            // Restore after brief moment
            setTimeout(() => {
                // Find original text from data-hover-text
                const original = randomDesc.getAttribute('data-hover-text') || text;
                randomDesc.textContent = original;
            }, 150);
        }

        return { init };
    })();

    // ============================================================
    // 17. SCROLL DEPTH INDICATOR & SECTION REVEAL
    // ============================================================

    const ScrollEffects = (() => {
        function init() {
            // Intersection observer for staggered reveals
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'perspective(1200px) rotateY(0deg) translateX(0) translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.catalog-entry').forEach((el) => {
                el.style.opacity = '0';
                el.style.transform = 'perspective(1200px) rotateY(0deg) translateY(20px)';
                el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
                observer.observe(el);
            });

            // Scroll listener for depth effects
            window.addEventListener('scroll', () => {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

                // Update tentacle opacity based on scroll
                const tentacles = document.querySelectorAll('.tentacle-overlay');
                tentacles.forEach((t) => {
                    t.style.opacity = 0.5 + (scrollPercent / 200);
                });

                // Warning visibility
                if (scrollPercent > 30) {
                    DOM.scrollWarning.style.opacity = '1';
                    DOM.scrollWarning.style.transform = 'translateY(0)';
                    DOM.scrollWarning.style.transition = 'opacity 1s ease, transform 1s ease';
                } else {
                    DOM.scrollWarning.style.opacity = '0';
                    DOM.scrollWarning.style.transform = 'translateY(20px)';
                }
            }, { passive: true });
        }

        return { init };
    })();

    // ============================================================
    // 18. RECORD COUNTER ANIMATION
    // ============================================================

    const RecordCounter = (() => {
        function animateCount(el, target) {
            let current = 0;
            const increment = Math.ceil(target / 40);
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                el.textContent = current;
            }, 40);
        }

        function init() {
            // Animate record count on load
            setTimeout(() => {
                animateCount(DOM.recordCountDisplay, State.recordCount);
                animateCount(DOM.accessLevel, State.recordCount);
            }, 2000);
        }

        return { init };
    })();

    // ============================================================
    // 19. AMBIENT SOUND SYSTEM (Web Audio API)
    // ============================================================

    const AmbientAudio = (() => {
        let audioCtx, gainNode, oscillator1, oscillator2;
        let isPlaying = false;

        function init() {
            // Create audio context on first user interaction
            document.addEventListener('click', () => {
                if (!audioCtx && !isPlaying) {
                    startAmbient();
                }
            }, { once: true });

            // Also on mousemove after loading
            document.addEventListener('mousemove', () => {
                if (!audioCtx && !isPlaying) {
                    startAmbient();
                }
            }, { once: true });
        }

        function startAmbient() {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = audioCtx.createGain();
                gainNode.gain.value = 0.02;
                gainNode.connect(audioCtx.destination);

                // Low drone
                oscillator1 = audioCtx.createOscillator();
                oscillator1.type = 'sine';
                oscillator1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1
                oscillator1.connect(gainNode);

                // Subtle high drone
                oscillator2 = audioCtx.createOscillator();
                oscillator2.type = 'sine';
                oscillator2.frequency.setValueAtTime(82.5, audioCtx.currentTime); // E2
                oscillator2.connect(gainNode);

                // Add subtle detuning for eerie effect
                oscillator1.detune.setValueAtTime(3, audioCtx.currentTime);
                oscillator2.detune.setValueAtTime(-2, audioCtx.currentTime);

                oscillator1.start();
                oscillator2.start();
                isPlaying = true;

                // Slowly modulate gain based on sanity
                modulateVolume();
            } catch (e) {
                // Audio not supported or blocked
            }
        }

        function modulateVolume() {
            if (!gainNode || !audioCtx) return;

            setInterval(() => {
                if (State.isModalOpen) {
                    gainNode.gain.setTargetAtTime(0.01, audioCtx.currentTime, 0.5);
                } else {
                    const targetGain = 0.01 + (State.sanity / 100) * 0.015;
                    gainNode.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 1);
                }
            }, 2000);
        }

        return { init };
    })();

    // ============================================================
    // 20. MAIN APPLICATION
    // ============================================================

    const App = {
        init() {
            console.log('%c◈ LENG DIGITAL ARCHIVE TERMINAL ◈', 'color: #c9a84c; font-size: 14px; font-family: monospace; background: #06060c; padding: 8px;');
            console.log('%cDepartment of Ontological Cartography & Anomalous Documentation', 'color: #9a9080; font-size: 10px; font-family: monospace;');
            console.log('%cCLASSIFICATION: RESTRICTED // CLEARANCE: INSUFFICIENT // REALITY STATUS: UNCERTAIN', 'color: #8b1a1a; font-size: 10px; font-family: monospace;');

            // Initialize subsystems
            NoiseCanvas.init();
            LoadingSequence.start();
            UptimeCounter.start();
            SanitySystem.start();
            CursorGlow.init();
            Tentacles.init();
            Parallax.init();
            GlitchEffect.init();
            HoverReveal.init();
            SearchSystem.init();
            WhisperStyles.init();
            FilterSystem.init();
            ModalSystem.init();
            VisualDisturbances.init();
            ScrollEffects.init();
            RecordCounter.init();
            AmbientAudio.init();

            // Track entry views on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        State.viewedEntries.add(entry.target.dataset.id);
                    }
                });
            }, { threshold: 0.3 });

            document.querySelectorAll('.catalog-entry').forEach((el) => observer.observe(el));

            // Periodic sanity warning at critical levels
            setInterval(() => {
                if (State.sanity < 20 && !State.isModalOpen) {
                    DOM.sanityValue.textContent = Math.round(State.sanity) + '%';
                    // Flash the sanity bar
                    DOM.sanityBar.style.background = `linear-gradient(90deg, 
                        var(--color-red-bright), var(--color-red), var(--color-red-bright))`;
                    setTimeout(() => {
                        if (State.sanity < 60) {
                            DOM.sanityBar.style.background = '';
                        }
                    }, 500);
                }
            }, 5000);

            // Easter egg: type "IA" to see something special
            let typedSequence = '';
            document.addEventListener('keydown', (e) => {
                typedSequence += e.key.toLowerCase();
                if (typedSequence.length > 10) typedSequence = typedSequence.slice(-10);
                if (typedSequence.includes('iatalmudra')) {
                    // Reveal all redactions
                    document.querySelectorAll('.entry-meta, .entry-description').forEach((el) => {
                        el.style.filter = 'none';
                    });
                    document.querySelectorAll('.meta-item, .entry-description').forEach((el) => {
                        el.textContent = el.textContent.replace(/█+/g, '[DECLASSIFIED]');
                    });
                }
            });
        },
    };

    // Expose State globally for debugging
    window.ArchiveState = State;

    // Auto-start loading sequence
    LoadingSequence.start();

})();
/* ============================================
   THE UNKNOWABLE ARCHIVE - Scripts
   Interactive Eldritch Experience
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - Constants of the Archive
    // ============================================
    const CONFIG = {
        sanity: {
            initial: 100,
            scrollDecay: 0.15,
            hoverCost: 0.5,
            readCost: 10,
            searchCost: 3,
            recoverRate: 0.02,
            criticalThreshold: 25,
            lowThreshold: 50
        },
        glitch: {
            minInterval: 3000,
            maxInterval: 15000,
            duration: 200
        },
        stars: {
            count: 500,
            deadZoneCount: 5
        }
    };

    // ============================================
    // STATE - The Current State of Reality
    // ============================================
    const state = {
        sanity: CONFIG.sanity.initial,
        isScrolling: false,
        scrollTimeout: null,
        audioEnabled: false,
        audioContext: null,
        lastGlitchTime: 0,
        searchCount: 0,
        visitedSections: new Set()
    };

    // ============================================
    // DOM ELEMENTS - Portals to the Interface
    // ============================================
    const elements = {
        sanityFill: null,
        sanityValue: null,
        sanityWarning: null,
        sanityContainer: null,
        galaxyCanvas: null,
        coordX: null,
        coordY: null,
        coordZ: null,
        archiveSearch: null,
        searchBtn: null,
        searchResults: null,
        readingModal: null,
        modalBody: null,
        modalClose: null,
        audioToggle: null
    };

    // ============================================
    // CORRUPTED TEXT DATABASE - Words of Madness
    // ============================================
    const corruptedTexts = {
        'txt-0001': {
            title: 'The Voynich Fragment - Full Transcript',
            content: `
                <p>The following is a partial translation of the Voynich Fragment, recovered from the ruins of a civilization that predates human memory.</p>
                <p><em>[The text begins in what appears to be a botanical description, but the plants described do not exist in any known ecosystem.]</em></p>
                <p>"The根s of the七-dimensional花 extend not through soil, but through the spaces between thoughts. When the花 blooms, it does not produce seeds, but rather <strong>questions that have no answers</strong>. The gardener who tends these花 does not age, for time has forgotten them, just as they have forgotten their own name."</p>
                <p><em>[The text then shifts to what appears to be mating rituals, though the entities described possess anatomies that violate Euclidean geometry.]</em></p>
                <p>"The dance begins when the first dimension折叠s upon itself. The partners must align their非-euclidean forms such that their shadows overlap in the seventh plane. If performed correctly, the resulting union produces a sound that can be heard only by those who have already lost their sanity."</p>
                <p class="modal-warning-text">[Translator's note: After completing this translation, I found I could no longer distinguish between dreams and reality. My cat now speaks to me in a language I almost understand.]</p>
            `
        },
        'txt-042': {
            title: 'Codex of Writhing Shadows - First Chapter',
            content: `
                <p><strong>WARNING: The following text has been known to cause spontaneous nosebleeds, temporal displacement, and in severe cases, the temporary cessation of one's own existence.</strong></p>
                <p>Chapter One: On the Nature of That Which Should Not Be</p>
                <p>"There exists a geometry that the mind cannot hold. It is not merely complex—it is <em>contradictory</em>. Lines that are both straight and curved. Angles that sum to values that would make mathematics weep. This geometry is not theoretical; it is the true shape of reality, and our Euclidean world is merely the shadow it casts."</p>
                <p>"The Shadows do not merely writh—they <strong>communicate</strong>. Each undulation is a word in a language older than light. To watch them is to begin learning this language. To understand them is to forget the language you currently speak."</p>
                <p>"The reader of this Codex should note that the words on this page are rearranging themselves when not observed directly. This is not a flaw in the printing. This is a feature. The text adapts to the reader, becoming whatever text the reader fears most."</p>
                <p class="modal-warning-text">[The rest of this page appears to be written in your own handwriting, though you have no memory of writing it.]</p>
            `
        },
        'txt-666': {
            title: 'THE FINAL TESTAMENT',
            content: `
                <p style="text-align: center; color: #8b1a1a; font-size: 1.2em;"><strong>YOU SHOULD NOT BE READING THIS</strong></p>
                <p>The seal has been broken. The words enter you now, not through your eyes, but through the spaces between your cells. You have always known this text. You were born knowing it. You have simply been forgetting it, and now you remember.</p>
                <p>"I am the end and the beginning. I am the question that cannot be asked and the answer that cannot be understood. You have been looking for me in the stars, in the depths, in the spaces between moments. But I have been looking for you. I have been looking for you since before you existed."</p>
                <p>"The testaments of your gods are footnotes in my diary. The laws of your physics are suggestions I sometimes follow. The love you feel, the fear you carry, the hope that sustains you—these are my breath, and I am exhaling."</p>
                <p style="text-align: center; font-size: 0.9em;"><em>You can feel it now, can't you? That thing behind your eyes. It has always been there. It is waking up.</em></p>
                <p style="text-align: center; color: #8b1a1a;"><strong>IT KNOWS YOU'RE READING THIS</strong></p>
            `
        }
    };

    // ============================================
    // SEARCH RESULTS - Results of Seeking
    // ============================================
    const searchDatabase = {
        'eldritch': [
            { title: 'Eldritch Entities Registry', excerpt: 'Classification of entities beyond human comprehension...', warning: 'High cognitive hazard' },
            { title: 'The Eldritch Correspondence', excerpt: 'Letters between unknowable beings, translated at great cost...', warning: 'Reader disorientation likely' }
        ],
        'void': [
            { title: 'The Void Between Stars', excerpt: 'Where light fears to travel and silence has a voice...', warning: 'Existential dread possible' },
            { title: 'Void Echoes', excerpt: 'Sounds recorded from absolute nothingness...', warning: 'Auditory hallucinations reported' }
        ],
        'forbidden': [
            { title: 'Forbidden Geometries', excerpt: 'Mathematics that proves the impossibility of its own existence...', warning: 'Paradox hazard level: Extreme' },
            { title: 'Forbidden Knowledge Index', excerpt: 'Things known only by those who have ceased to exist...', warning: 'Memory corruption likely' }
        ],
        'ancient': [
            { title: 'Pre-Human Archives', excerpt: 'Records from before the first sunrise...', warning: 'Temporal displacement risk' },
            { title: 'The Ancient Silence', excerpt: 'What existed before sound, and what waits for its return...', warning: 'Awareness of the impossible' }
        ],
        'madness': [
            { title: 'The Blessed Madness', excerpt: 'Sanity is the cage; madness is the key...', warning: 'Cognitive restructuring imminent' },
            { title: 'Madness as Method', excerpt: 'The only way to understand the incomprehensible...', warning: 'Point of no return' }
        ],
        'default': [
            { title: 'Archive Entry #' + Math.floor(Math.random() * 9999), excerpt: 'The knowledge you seek seeks you in return...', warning: 'Mutual observation initiated' },
            { title: 'Unknown Record', excerpt: 'This entry has been watching you since you arrived...', warning: 'It knows your name' }
        ]
    };

    // ============================================
    // INITIALIZATION - Awakening the Archive
    // ============================================
    function init() {
        cacheElements();
        initSanitySystem();
        initScrollEffects();
        initStarChart();
        initSearchPortal();
        initModalSystem();
        initAudioSystem();
        initGlitchEffects();
        initTextCorruption();
        initTestimonyEffects();
        initNavigation();
        
        console.log('%c⚠ ARCHIVE INITIALIZED ⚠', 'color: #8b1a1a; font-size: 20px; font-weight: bold;');
        console.log('%cYou were not meant to find this place.', 'color: #706858; font-style: italic;');
    }

    function cacheElements() {
        elements.sanityFill = document.getElementById('sanityFill');
        elements.sanityValue = document.getElementById('sanityValue');
        elements.sanityWarning = document.getElementById('sanityWarning');
        elements.sanityContainer = document.getElementById('sanityMeter');
        elements.galaxyCanvas = document.getElementById('galaxyCanvas');
        elements.coordX = document.getElementById('coordX');
        elements.coordY = document.getElementById('coordY');
        elements.coordZ = document.getElementById('coordZ');
        elements.archiveSearch = document.getElementById('archiveSearch');
        elements.searchBtn = document.getElementById('searchBtn');
        elements.searchResults = document.getElementById('searchResults');
        elements.readingModal = document.getElementById('readingModal');
        elements.modalBody = document.getElementById('modalBody');
        elements.modalClose = document.querySelector('.modal-close');
        elements.audioToggle = document.getElementById('audioToggle');
    }

    // ============================================
    // SANITY SYSTEM - The Dissolution of Mind
    // ============================================
    function initSanitySystem() {
        updateSanityDisplay();
        
        // Passive sanity recovery when not scrolling
        setInterval(() => {
            if (!state.isScrolling && state.sanity < CONFIG.sanity.initial) {
                modifySanity(CONFIG.sanity.recoverRate);
            }
        }, 100);
    }

    function modifySanity(amount) {
        state.sanity = Math.max(0, Math.min(100, state.sanity + amount));
        updateSanityDisplay();
        updateSanityEffects();
    }

    function updateSanityDisplay() {
        if (!elements.sanityFill || !elements.sanityValue) return;
        
        elements.sanityFill.style.width = state.sanity + '%';
        elements.sanityValue.textContent = Math.round(state.sanity) + '%';
        
        // Update color based on sanity level
        let color;
        if (state.sanity > 75) {
            color = 'var(--sanity-full)';
        } else if (state.sanity > 50) {
            color = 'var(--sanity-moderate)';
        } else if (state.sanity > 25) {
            color = 'var(--sanity-low)';
        } else {
            color = 'var(--sanity-critical)';
        }
        elements.sanityFill.style.backgroundColor = color;
        
        // Update container data attribute for CSS states
        if (elements.sanityContainer) {
            if (state.sanity <= CONFIG.sanity.criticalThreshold) {
                elements.sanityContainer.setAttribute('data-level', 'critical');
            } else if (state.sanity <= CONFIG.sanity.lowThreshold) {
                elements.sanityContainer.setAttribute('data-level', 'low');
            } else {
                elements.sanityContainer.setAttribute('data-level', 'normal');
            }
        }
        
        // Update warning text
        updateSanityWarning();
    }

    function updateSanityWarning() {
        if (!elements.sanityWarning) return;
        
        const warnings = [
            { threshold: 80, text: '' },
            { threshold: 60, text: 'Reality destabilizing...' },
            { threshold: 40, text: 'Cognitive functions impaired' },
            { threshold: 20, text: 'THEY ARE WATCHING' },
            { threshold: 10, text: 'YOU CANNOT UNSEE' },
            { threshold: 0, text: 'WELCOME HOME' }
        ];
        
        const warning = warnings.find(w => state.sanity <= w.threshold);
        elements.sanityWarning.textContent = warning ? warning.text : '';
    }

    function updateSanityEffects() {
        // Body classes for CSS effects
        document.body.classList.remove('sanity-low', 'sanity-critical');
        
        if (state.sanity <= CONFIG.sanity.criticalThreshold) {
            document.body.classList.add('sanity-critical');
        } else if (state.sanity <= CONFIG.sanity.lowThreshold) {
            document.body.classList.add('sanity-low');
        }
        
        // Corruption overlay intensity
        const overlay = document.querySelector('.corruption-overlay');
        if (overlay) {
            const intensity = 1 - (state.sanity / 100);
            overlay.style.opacity = 0.3 + (intensity * 0.7);
        }
    }

    // ============================================
    // SCROLL EFFECTS - Descent into the Archive
    // ============================================
    function initScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            
            // Mark scrolling state
            state.isScrolling = true;
            document.body.classList.add('scrolling');
            
            // Decay sanity based on scroll speed
            const sanityLoss = scrollDelta * CONFIG.sanity.scrollDecay * 0.1;
            modifySanity(-sanityLoss);
            
            // Clear previous timeout
            clearTimeout(state.scrollTimeout);
            
            // Set new timeout to mark scroll end
            state.scrollTimeout = setTimeout(() => {
                state.isScrolling = false;
                document.body.classList.remove('scrolling');
            }, 150);
            
            lastScrollY = currentScrollY;
            
            // Check for section visits
            checkSectionVisits();
        });
    }

    function checkSectionVisits() {
        const sections = document.querySelectorAll('.archive-section');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.7 && rect.bottom > 0;
            
            if (isVisible && !state.visitedSections.has(section.id)) {
                state.visitedSections.add(section.id);
                // Penalize visiting new sections
                modifySanity(-2);
                
                // Trigger section-specific effects
                triggerSectionEffect(section.id);
            }
        });
    }

    function triggerSectionEffect(sectionId) {
        const effects = {
            'incomprehensible-texts': () => {
                triggerGlitch('The texts are reading you back...');
            },
            'dead-galaxies': () => {
                triggerGlitch('The void gazes into you...');
            },
            'testimonies': () => {
                triggerGlitch('Their voices echo in your mind...');
            },
            'search-portal': () => {
                triggerGlitch('What do you truly seek?');
            }
        };
        
        if (effects[sectionId]) {
            setTimeout(effects[sectionId], 500);
        }
    }

    // ============================================
    // STAR CHART - Map of the Dead
    // ============================================
    function initStarChart() {
        if (!elements.galaxyCanvas) return;
        
        const canvas = elements.galaxyCanvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Star data
        const stars = [];
        const deadZones = [
            { x: 0.2, y: 0.3, radius: 60, name: 'NGC-0000', color: '#8b1a1a' },
            { x: 0.7, y: 0.6, radius: 80, name: 'Bootes Abyss', color: '#6b3fa0' },
            { x: 0.5, y: 0.5, radius: 100, name: 'The Center', color: '#4a7c59' },
            { x: 0.8, y: 0.2, radius: 40, name: 'The Silence', color: '#d4cfc4' },
            { x: 0.3, y: 0.7, radius: 50, name: 'KBC Void', color: '#8b8b3a' }
        ];
        
        // Generate stars
        for (let i = 0; i < CONFIG.stars.count; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 2 + 0.5,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                isDead: isPointInDeadZone(Math.random(), Math.random(), deadZones)
            });
        }
        
        function isPointInDeadZone(x, y, zones) {
            return zones.some(zone => {
                const dx = x - zone.x;
                const dy = y - zone.y;
                const distance = Math.sqrt(dx * dx + dy * dy) * Math.min(canvas.width, canvas.height);
                return distance < zone.radius;
            });
        }
        
        let time = 0;
        
        function drawChart() {
            ctx.fillStyle = '#0d0d12';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw dead zones
            deadZones.forEach(zone => {
                const gradient = ctx.createRadialGradient(
                    zone.x * canvas.width,
                    zone.y * canvas.height,
                    0,
                    zone.x * canvas.width,
                    zone.y * canvas.height,
                    zone.radius
                );
                gradient.addColorStop(0, zone.color + '40');
                gradient.addColorStop(0.5, zone.color + '20');
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(
                    zone.x * canvas.width,
                    zone.y * canvas.height,
                    zone.radius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                
                // Zone border
                ctx.strokeStyle = zone.color + '60';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            });
            
            // Draw stars
            stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
                const alpha = star.brightness * twinkle;
                
                if (star.isDead) {
                    // Dead star - dark, barely visible
                    ctx.fillStyle = `rgba(30, 20, 30, ${alpha * 0.3})`;
                } else {
                    // Living star
                    const hue = 40 + Math.random() * 20;
                    ctx.fillStyle = `hsla(${hue}, 30%, 70%, ${alpha})`;
                }
                
                ctx.beginPath();
                ctx.arc(
                    star.x * canvas.width,
                    star.y * canvas.height,
                    star.size,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            });
            
            // Grid lines
            ctx.strokeStyle = 'rgba(74, 124, 89, 0.1)';
            ctx.lineWidth = 0.5;
            
            for (let i = 0; i <= 10; i++) {
                ctx.beginPath();
                ctx.moveTo((canvas.width / 10) * i, 0);
                ctx.lineTo((canvas.width / 10) * i, canvas.height);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(0, (canvas.height / 10) * i);
                ctx.lineTo(canvas.width, (canvas.height / 10) * i);
                ctx.stroke();
            }
            
            // Draw center marker
            ctx.strokeStyle = 'rgba(139, 26, 26, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 30, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2);
            ctx.moveTo(canvas.width / 2, canvas.height / 2 - 30);
            ctx.lineTo(canvas.width / 2, canvas.height / 2 + 30);
            ctx.stroke();
            
            time++;
            requestAnimationFrame(drawChart);
        }
        
        drawChart();
        
        // Mouse tracking for coordinates
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / canvas.width * 100).toFixed(2);
            const y = ((e.clientY - rect.top) / canvas.height * 100).toFixed(2);
            const z = (Math.random() * 100).toFixed(2);
            
            elements.coordX.textContent = `X: ${x}`;
            elements.coordY.textContent = `Y: ${y}`;
            elements.coordZ.textContent = `Z: ${z}`;
        });
        
        // Zone entry hover effects
        document.querySelectorAll('.zone-entry').forEach(entry => {
            entry.addEventListener('mouseenter', () => {
                modifySanity(-1);
                triggerGlitch('The void recognizes your gaze...');
            });
        });
    }

    // ============================================
    // SEARCH PORTAL - Seeking the Unknown
    // ============================================
    function initSearchPortal() {
        if (!elements.archiveSearch || !elements.searchBtn) return;
        
        elements.searchBtn.addEventListener('click', performSearch);
        elements.archiveSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        
        // Suggestion clicks
        document.querySelectorAll('.suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                elements.archiveSearch.value = suggestion.dataset.query;
                performSearch();
            });
        });
        
        // Typing effect - sanity cost
        elements.archiveSearch.addEventListener('input', () => {
            if (Math.random() < 0.1) {
                modifySanity(-0.5);
            }
        });
    }

    function performSearch() {
        const query = elements.archiveSearch.value.toLowerCase().trim();
        if (!query) return;
        
        // Increase search count for escalating horror
        state.searchCount++;
        modifySanity(-CONFIG.sanity.searchCost - (state.searchCount * 2));
        
        // Get results
        let results = searchDatabase[query] || searchDatabase['default'];
        
        // Add disturbing modifications based on search count
        if (state.searchCount > 2) {
            results = results.map(result => ({
                ...result,
                title: corruptString(result.title),
                warning: escalateWarning(result.warning)
            }));
        }
        
        // Display results
        displaySearchResults(results, query);
        
        // Trigger effects
        triggerGlitch('The Archive responds to your query...');
        
        if (state.searchCount > 3) {
            setTimeout(() => {
                triggerGlitch('IT KNOWS WHAT YOU SEEK');
            }, 1000);
        }
    }

    function displaySearchResults(results, query) {
        if (!elements.searchResults) return;
        
        elements.searchResults.innerHTML = `
            <div class="search-results-header">
                <span>Results for: "${query}"</span>
                <span class="result-count">${results.length} record(s) found</span>
            </div>
            ${results.map(result => `
                <div class="search-result-item">
                    <div class="result-title">${result.title}</div>
                    <div class="result-excerpt">${result.excerpt}</div>
                    <div class="result-warning">⚠ ${result.warning}</div>
                </div>
            `).join('')}
        `;
        
        // Animate in
        elements.searchResults.style.opacity = '0';
        elements.searchResults.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            elements.searchResults.style.transition = 'all 0.5s ease';
            elements.searchResults.style.opacity = '1';
            elements.searchResults.style.transform = 'translateY(0)';
        });
    }

    function corruptString(str) {
        const corruptions = {
            'Archive': 'ȺɌȻĦƗVɆ',
            'Registry': 'ɌɆ₲Ɨ$ŧɌɎ',
            'Knowledge': 'Kn0wl3dg3',
            'Void': 'V0ƗĐ',
            'Unknown': 'UÑ₭ñ0wñ'
        };
        
        let result = str;
        Object.keys(corruptions).forEach(key => {
            result = result.replace(new RegExp(key, 'gi'), corruptions[key]);
        });
        return result;
    }

    function escalateWarning(warning) {
        const escalations = [
            warning,
            warning + ' ESCALATED',
            '⚠⚠ ' + warning.toUpperCase() + ' ⚠⚠',
            'YOU HAVE BEEN WARNED',
            'IT IS TOO LATE',
            'T̷H̷E̷Y̷ ̷K̷N̷O̷W̷'
        ];
        
        return escalations[Math.min(state.searchCount, escalations.length - 1)];
    }

    // ============================================
    // MODAL SYSTEM - Windows into Madness
    // ============================================
    function initModalSystem() {
        // Read more buttons
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const textId = btn.dataset.textId;
                openReadingModal(textId);
            });
        });
        
        // Close modal
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeReadingModal);
        }
        
        // Close on overlay click
        if (elements.readingModal) {
            elements.readingModal.querySelector('.modal-overlay').addEventListener('click', closeReadingModal);
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.readingModal.classList.contains('active')) {
                closeReadingModal();
            }
        });
    }

    function openReadingModal(textId) {
        const textData = corruptedTexts[textId];
        if (!textData || !elements.readingModal || !elements.modalBody) return;
        
        // Sanity cost for reading
        modifySanity(-CONFIG.sanity.readCost);
        
        // Populate modal
        elements.modalBody.innerHTML = `
            <h2 style="font-family: var(--font-body); color: var(--bone-white); margin-bottom: 1rem;">
                ${textData.title}
            </h2>
            ${textData.content}
        `;
        
        // Show modal
        elements.readingModal.classList.add('active');
        elements.readingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Corrupt the content over time
        startContentCorruption();
    }

    function closeReadingModal() {
        if (!elements.readingModal) return;
        
        elements.readingModal.classList.remove('active');
        elements.readingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function startContentCorruption() {
        const modalBody = elements.modalBody;
        if (!modalBody) return;
        
        const corruptionInterval = setInterval(() => {
            if (!elements.readingModal.classList.contains('active')) {
                clearInterval(corruptionInterval);
                return;
            }
            
            // Random character corruption
            const textNodes = getTextNodes(modalBody);
            if (textNodes.length > 0) {
                const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
                const text = randomNode.textContent;
                if (text.length > 0) {
                    const pos = Math.floor(Math.random() * text.length);
                    const corrupted = text.substring(0, pos) + getRandomCorruptionChar() + text.substring(pos + 1);
                    randomNode.textContent = corrupted;
                }
            }
            
            // Sanity cost continues while reading
            modifySanity(-0.5);
            
        }, 500);
    }

    function getTextNodes(element) {
        const nodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim().length > 0) {
                nodes.push(node);
            }
        }
        
        return nodes;
    }

    function getRandomCorruptionChar() {
        const corruptions = [
            '█', '▓', '▒', '░', '▄', '▀', '■', '□', '▪', '▫',
            '̴', '̷', '̸', '̵', '̶', '̹', '̺', '̻', '̼',
            'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ',
            'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã'
        ];
        return corruptions[Math.floor(Math.random() * corruptions.length)];
    }

    // ============================================
    // AUDIO SYSTEM - Sounds of the Abyss
    // ============================================
    function initAudioSystem() {
        if (!elements.audioToggle) return;
        
        elements.audioToggle.addEventListener('click', toggleAudio);
    }

    function toggleAudio() {
        state.audioEnabled = !state.audioEnabled;
        elements.audioToggle.classList.toggle('active', state.audioEnabled);
        
        if (state.audioEnabled) {
            startAmbientAudio();
        } else {
            stopAmbientAudio();
        }
    }

    function startAmbientAudio() {
        if (!state.audioContext) {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = state.audioContext;
        
        // Create ambient drone
        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(55, ctx.currentTime); // Low A
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(57, ctx.currentTime); // Slightly detuned
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator1.start();
        oscillator2.start();
        
        // Slowly modulate the frequency for an unsettling effect
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(5, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator1.frequency);
        lfoGain.connect(oscillator2.frequency);
        
        lfo.start();
        
        state.ambientAudio = { oscillator1, oscillator2, gainNode, lfo, filter };
    }

    function stopAmbientAudio() {
        if (state.ambientAudio) {
            state.ambientAudio.oscillator1.stop();
            state.ambientAudio.oscillator2.stop();
            state.ambientAudio.lfo.stop();
            state.ambientAudio = null;
        }
    }

    // ============================================
    // GLITCH EFFECTS - Reality Breakdown
    // ============================================
    function initGlitchEffects() {
        // Random glitch triggers
        setInterval(() => {
            if (Math.random() < 0.3 && state.sanity < 80) {
                triggerRandomGlitch();
            }
        }, CONFIG.glitch.minInterval);
        
        // Sanity-based glitch intensity
        setInterval(() => {
            if (state.sanity < 50 && Math.random() < 0.2) {
                triggerMinorGlitch();
            }
        }, 1000);
    }

    function triggerRandomGlitch() {
        const glitchTypes = [
            triggerScreenShake,
            triggerTextGlitch,
            triggerColorShift,
            triggerScanlineBurst
        ];
        
        const glitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        glitch();
    }

    function triggerMinorGlitch() {
        if (Math.random() < 0.5) {
            triggerTextGlitch();
        } else {
            triggerColorShift();
        }
    }

    function triggerScreenShake() {
        document.body.style.animation = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.animation = 'screen-shake 0.3s ease';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }

    function triggerTextGlitch() {
        const glitchableElements = document.querySelectorAll('.section-title, .site-title, .entry-title');
        if (glitchableElements.length === 0) return;
        
        const element = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
        const originalText = element.textContent;
        
        element.style.textShadow = '2px 0 #8b1a1a, -2px 0 #4a7c59';
        
        setTimeout(() => {
            element.style.textShadow = '';
        }, 200);
    }

    function triggerColorShift() {
        const root = document.documentElement;
        const hueShift = (Math.random() - 0.5) * 10;
        
        root.style.filter = `hue-rotate(${hueShift}deg)`;
        
        setTimeout(() => {
            root.style.filter = '';
        }, 150);
    }

    function triggerScanlineBurst() {
        const overlay = document.querySelector('.corruption-overlay');
        if (!overlay) return;
        
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            overlay.style.opacity = '';
        }, 100);
    }

    function triggerGlitch(message) {
        // Create floating glitch message
        const glitchMsg = document.createElement('div');
        glitchMsg.className = 'floating-glitch';
        glitchMsg.textContent = message;
        glitchMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: var(--font-typewriter);
            font-size: 1.2rem;
            color: var(--corruption-red);
            text-shadow: 2px 0 var(--tentacle-glow), -2px 0 var(--madness-purple);
            z-index: 10001;
            pointer-events: none;
            animation: glitch-fade 2s ease forwards;
            white-space: nowrap;
        `;
        
        document.body.appendChild(glitchMsg);
        
        setTimeout(() => {
            glitchMsg.remove();
        }, 2000);
        
        triggerScreenShake();
    }

    // ============================================
    // TEXT CORRUPTION - Hovering Madness
    // ============================================
    function initTextCorruption() {
        document.querySelectorAll('.corruptible').forEach(element => {
            const originalText = element.dataset.original || element.textContent;
            
            element.addEventListener('mouseenter', () => {
                startTextCorruption(element, originalText);
                modifySanity(-CONFIG.sanity.hoverCost);
            });
            
            element.addEventListener('mouseleave', () => {
                stopTextCorruption(element, originalText);
            });
        });
        
        // Nav link corruption
        document.querySelectorAll('.nav-link').forEach(link => {
            const originalText = link.textContent;
            
            link.addEventListener('mouseenter', () => {
                link.textContent = link.dataset.corrupt || originalText;
                modifySanity(-0.2);
            });
            
            link.addEventListener('mouseleave', () => {
                link.textContent = originalText;
            });
        });
    }

    function startTextCorruption(element, originalText) {
        element.dataset.corrupted = 'true';
        
        const corruptInterval = setInterval(() => {
            if (element.dataset.corrupted !== 'true') {
                clearInterval(corruptInterval);
                return;
            }
            
            let corruptedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    corruptedText += getRandomCorruptionChar();
                } else {
                    corruptedText += originalText[i];
                }
            }
            
            element.textContent = corruptedText;
        }, 50);
        
        element.dataset.corruptInterval = corruptInterval;
    }

    function stopTextCorruption(element, originalText) {
        element.dataset.corrupted = 'false';
        
        if (element.dataset.corruptInterval) {
            clearInterval(parseInt(element.dataset.corruptInterval));
        }
        
        element.textContent = originalText;
    }

    // ============================================
    // TESTIMONY EFFECTS - Voices of the Damned
    // ============================================
    function initTestimonyEffects() {
        document.querySelectorAll('.testimony').forEach(testimony => {
            testimony.addEventListener('mouseenter', () => {
                triggerTestimonyEffect(testimony);
            });
            
            testimony.addEventListener('click', () => {
                modifySanity(-5);
                triggerGlitch('Their words echo in your mind...');
            });
        });
    }

    function triggerTestimonyEffect(testimony) {
        // Subtle visual effect
        testimony.style.transform = 'translateX(5px)';
        testimony.style.borderLeftColor = 'var(--corruption-red)';
        
        setTimeout(() => {
            testimony.style.transform = '';
            testimony.style.borderLeftColor = '';
        }, 300);
        
        modifySanity(-1);
    }

    // ============================================
    // NAVIGATION - Guided Tour of Madness
    // ============================================
    function initNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    modifySanity(-2);
                }
            });
        });
    }

    // ============================================
    // CSS ANIMATION INJECTION
    // ============================================
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes screen-shake {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-2px, 2px); }
                20% { transform: translate(2px, -2px); }
                30% { transform: translate(-2px, -2px); }
                40% { transform: translate(2px, 2px); }
                50% { transform: translate(-2px, 2px); }
                60% { transform: translate(2px, -2px); }
                70% { transform: translate(-2px, -2px); }
                80% { transform: translate(2px, 2px); }
                90% { transform: translate(-2px, 2px); }
            }
            
            @keyframes glitch-fade {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                30% { transform: translate(-48%, -52%) scale(1); }
                40% { transform: translate(-52%, -48%) scale(1); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
            
            .search-results-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--text-secondary);
                font-family: var(--font-typewriter);
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            
            .result-count {
                color: var(--corruption-red);
            }
            
            .modal-warning-text {
                color: var(--corruption-red);
                font-style: italic;
                margin-top: 1rem;
                padding: 0.5rem;
                background: rgba(139, 26, 26, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // START THE ARCHIVE
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        injectAnimationStyles();
        init();
    });

})();
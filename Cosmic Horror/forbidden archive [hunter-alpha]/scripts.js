/* ═══════════════════════════════════════════════════════════════════════════════
   THE VØID ARCHIVE — JAVASCRIPT
   Cognitive Hazard Handler v6.6.6
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Configuration ───
    const CONFIG = {
        sanity: {
            max: 100,
            scrollDecay: 0.05,
            corruptionDecay: 2,
            regenRate: 0.01,
            criticalThreshold: 25,
            warningThreshold: 50
        },
        glyphs: {
            symbols: ['◬', '◈', '⍟', '✧', '▽', '△', '◯', '⬡', '⬢', '⏣', '⎔', '⍝', '⏥', '⌬', '⌭', '⍓', '⍫', '⎋', '⎈', '⍾'],
            count: 15,
            minDuration: 10,
            maxDuration: 25
        },
        corruption: {
            characters: '▓█░▒┃┇┋▊▋▌▍▎▏▐▔▕▖▗▘▙▚▛▜▝▞▟',
            numbers: '0123456789',
            intensity: 0.3
        },
        search: {
            results: [
                { title: 'The Yellow Sign', type: 'Forbidden Text', threat: 'HIGH' },
                { title: 'Hastur Fragment', type: 'Forbidden Text', threat: 'EXTREME' },
                { title: 'Coordinates: 47°N, 122°W', type: 'Location Data', threat: 'UNKNOWN' },
                { title: 'Transcript #7734', type: 'Testimony', threat: 'MODERATE' },
                { title: 'The King in Yellow (Act III)', type: 'Forbidden Text', threat: 'AP0CALYPT1C' },
                { title: 'Dream Cycle Analysis', type: 'Research Note', threat: 'HIGH' },
                { title: 'Entity Sighting Report', type: 'Incident Report', threat: 'EXTREME' },
                { title: 'Star Map: Carcosa', type: 'Dead Star Chart', threat: '█▓▓▓▓' },
                { title: 'Audio Log: Site-19', type: 'Media Archive', threat: 'CRITICAL' },
                { title: 'The Haunter of the Dark', type: 'Forbidden Text', threat: 'EXTREME' },
                { title: 'Dimensional Breach Report', type: 'Incident Report', threat: 'AP0CALYPT1C' },
                { title: 'Yithian Time Capsule', type: 'Artifact', threat: 'UNKNOWN' }
            ],
            disturbingMessages: [
                'SEARCH RESULTS CORRUPTED',
                'THE ARCHIVE DOES NOT RECOGNIZE YOUR QUERY',
                'SOMETHING ELSE IS SEARCHING FOR YOU',
                'YOUR SEARCH HAS BEEN NOTED',
                'IT KNOWS YOU ARE LOOKING',
                'THERE ARE NO RESULTS. THERE NEVER WERE.',
                'THE VOID RESPONDS: ████████'
            ]
        }
    };

    // ─── State ───
    const state = {
        sanity: CONFIG.sanity.max,
        currentSection: 'texts',
        searchCount: 0,
        scrollDepth: 0,
        isWhispering: false,
        corruptionLevel: 0,
        lastScrollY: 0,
        glitchTimeout: null
    };

    // ─── DOM Elements ───
    const elements = {};

    // ─── Initialize ───
    function init() {
        cacheElements();
        createFloatingGlyphs();
        initNavigation();
        initSearch();
        initCorruptText();
        initStarCharts();
        initScrollHandler();
        initModal();
        initWhisperToggle();
        initTerminalOutput();
        initTendrilAnimation();
        startSanityDecay();
        scheduleRandomGlitches();
    }

    // ─── Cache DOM Elements ───
    function cacheElements() {
        elements.sanityBar = document.getElementById('sanityBar');
        elements.sanityValue = document.getElementById('sanityValue');
        elements.sanityMeter = document.getElementById('sanityMeter');
        elements.archiveNav = document.getElementById('archiveNav');
        elements.searchInput = document.getElementById('searchInput');
        elements.searchResults = document.getElementById('searchResults');
        elements.searchCorruption = document.getElementById('searchCorruption');
        elements.glitchOverlay = document.getElementById('glitchOverlay');
        elements.floatingGlyphs = document.getElementById('floatingGlyphs');
        elements.modalOverlay = document.getElementById('modalOverlay');
        elements.modalContent = document.getElementById('modalContent');
        elements.modalClose = document.getElementById('modalClose');
        elements.whisperToggle = document.getElementById('whisperToggle');
        elements.terminalOutput = document.getElementById('terminalOutput');
        elements.archiveGrid = document.getElementById('archiveGrid');
    }

    // ─── Floating Glyphs ───
    function createFloatingGlyphs() {
        const container = elements.floatingGlyphs;
        if (!container) return;

        for (let i = 0; i < CONFIG.glyphs.count; i++) {
            const glyph = document.createElement('div');
            glyph.className = 'glyph';
            glyph.textContent = CONFIG.glyphs.symbols[Math.floor(Math.random() * CONFIG.glyphs.symbols.length)];
            
            const left = Math.random() * 100;
            const duration = CONFIG.glyphs.minDuration + Math.random() * (CONFIG.glyphs.maxDuration - CONFIG.glyphs.minDuration);
            const delay = Math.random() * duration;
            const size = 12 + Math.random() * 24;
            
            glyph.style.cssText = `
                left: ${left}%;
                font-size: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
            `;
            
            container.appendChild(glyph);
        }
    }

    // ─── Navigation ───
    function initNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                switchSection(section);
                
                // Update active state
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Corruption effect on navigation
                applySanityDamage(5);
                triggerGlitch();
            });
        });
    }

    function switchSection(sectionName) {
        const sections = document.querySelectorAll('.content-section');
        
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`section${capitalize(sectionName)}`);
        if (targetSection) {
            targetSection.classList.add('active');
            state.currentSection = sectionName;
            
            // Reinitialize star charts if switching to charts section
            if (sectionName === 'charts') {
                setTimeout(initStarCharts, 100);
            }
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ─── Search Functionality ───
    function initSearch() {
        const input = elements.searchInput;
        const results = elements.searchResults;
        
        if (!input || !results) return;

        let debounceTimer;

        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                handleSearch(e.target.value);
            }, 300);
        });

        input.addEventListener('focus', () => {
            if (input.value.length > 0) {
                results.classList.add('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                results.classList.remove('active');
            }
        });

        // Corruption effect while typing
        input.addEventListener('keydown', () => {
            corruptSearchPlaceholder();
        });
    }

    function handleSearch(query) {
        const results = elements.searchResults;
        if (!results) return;

        if (query.length < 2) {
            results.classList.remove('active');
            return;
        }

        state.searchCount++;
        
        // After too many searches, return disturbing results
        if (state.searchCount > 5) {
            showDisturbingResults(query);
            return;
        }

        // Filter results based on query
        const filtered = CONFIG.search.results.filter(r => 
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.type.toLowerCase().includes(query.toLowerCase())
        );

        // Add some random "corrupted" results
        const displayResults = [...filtered];
        if (Math.random() > 0.7) {
            displayResults.push({
                title: corruptText(query + '... ████'),
                type: 'CORRUPTED',
                threat: '???'
            });
        }

        renderSearchResults(displayResults);
        
        // Small sanity cost for searching
        applySanityDamage(1);
    }

    function renderSearchResults(resultsList) {
        const container = elements.searchResults;
        if (!container) return;

        if (resultsList.length === 0) {
            container.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-title">NO RESULTS FOUND</div>
                    <div class="search-result-type">THE ARCHIVE DOES NOT RECOGNIZE THIS QUERY</div>
                </div>
            `;
        } else {
            container.innerHTML = resultsList.map(result => `
                <div class="search-result-item" data-threat="${result.threat}">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-type">${result.type} — THREAT: ${result.threat}</div>
                </div>
            `).join('');
        }

        container.classList.add('active');
        
        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                applySanityDamage(10);
                triggerGlitch();
                container.classList.remove('active');
                showSearchWarning();
            });
        });
    }

    function showDisturbingResults(query) {
        const container = elements.searchResults;
        if (!container) return;

        const message = CONFIG.search.disturbingMessages[
            Math.floor(Math.random() * CONFIG.search.disturbingMessages.length)
        ];

        container.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-title">${corruptText(query)}</div>
                <div class="search-result-type" style="color: var(--corruption-magenta);">${message}</div>
            </div>
        `;

        container.classList.add('active');
        applySanityDamage(15);
        triggerGlitch();
        
        // Reset search count after a while
        setTimeout(() => {
            state.searchCount = Math.max(0, state.searchCount - 3);
        }, 30000);
    }

    function showSearchWarning() {
        const modal = elements.modalOverlay;
        const content = elements.modalContent;
        
        if (!modal || !content) return;

        content.innerHTML = `
            <h2>⚠ WARNING ⚠</h2>
            <p>The archive has noted your inquiry. Some knowledge comes at a price.</p>
            <p>Your search has been logged and will be reviewed by... something.</p>
            <div class="warning-text">
                CONTINUED ACCESS TO RESTRICTED MATERIALS MAY RESULT IN:<br>
                • Cognitive degradation<br>
                • Temporal displacement<br>
                • Uninvited visitations<br>
                • ████████████████<br>
            </div>
        `;

        modal.classList.add('active');
    }

    function corruptSearchPlaceholder() {
        const input = elements.searchInput;
        if (!input) return;

        const placeholders = [
            'QUERY THE ARCHIVE...',
            'WH4T 4R3 Y0U L00K1NG F0R...',
            'TH3 V01D R3SP0NDS...',
            '█▓░▒ QUERY ░▒▓█...',
            'IT SEES YOU SEARCHING...'
        ];

        if (Math.random() > 0.7) {
            input.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
    }

    // ─── Text Corruption ───
    function initCorruptText() {
        const corruptElements = document.querySelectorAll('.corrupt-text');
        
        corruptElements.forEach(el => {
            const original = el.dataset.original || el.textContent;
            
            el.addEventListener('mouseenter', () => {
                startTextCorruption(el, original);
            });
            
            el.addEventListener('mouseleave', () => {
                stopTextCorruption(el, original);
            });
        });
    }

    function startTextCorruption(element, original) {
        element.classList.add('corrupting');
        
        const corruptionChars = CONFIG.corruption.characters;
        let iterations = 0;
        const maxIterations = 10;
        
        const interval = setInterval(() => {
            element.textContent = original.split('').map((char, index) => {
                if (char === ' ') return ' ';
                if (index < iterations) return original[index];
                if (Math.random() > 0.7) {
                    return corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
                }
                return char;
            }).join('');
            
            iterations += 0.5;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.classList.remove('corrupting');
            }
        }, 50);
        
        element._corruptionInterval = interval;
    }

    function stopTextCorruption(element, original) {
        if (element._corruptionInterval) {
            clearInterval(element._corruptionInterval);
        }
        
        element.classList.remove('corrupting');
        
        // Restore with animation
        let restoreProgress = 0;
        const currentText = element.textContent;
        
        const restoreInterval = setInterval(() => {
            element.textContent = original.split('').map((char, index) => {
                if (restoreProgress > index * 10) return char;
                return currentText[index] || char;
            }).join('');
            
            restoreProgress += 5;
            
            if (restoreProgress > original.length * 10) {
                clearInterval(restoreInterval);
                element.textContent = original;
            }
        }, 20);
    }

    // ─── Star Charts ───
    function initStarCharts() {
        const canvases = document.querySelectorAll('.star-canvas');
        
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const chartType = canvas.dataset.chart;
            
            // Set canvas size
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
            
            drawStarChart(ctx, chartType, canvas.offsetWidth, canvas.offsetHeight);
        });
    }

    function drawStarChart(ctx, type, width, height) {
        // Clear canvas
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);
        
        // Draw based on type
        switch(type) {
            case 'hyades':
                drawHyadesChart(ctx, width, height);
                break;
            case 'voidcluster':
                drawVoidCluster(ctx, width, height);
                break;
            case 'deadgalaxy':
                drawDeadGalaxy(ctx, width, height);
                break;
            case 'pleiades':
                drawPleiadesChart(ctx, width, height);
                break;
            default:
                drawGenericStars(ctx, width, height);
        }
        
        // Add scan lines effect
        addScanLines(ctx, width, height);
    }

    function drawHyadesChart(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw V-shaped cluster
        const stars = [];
        for (let i = 0; i < 50; i++) {
            const angle = (Math.random() - 0.5) * Math.PI * 0.8;
            const distance = 20 + Math.random() * 80;
            const x = centerX + Math.cos(angle) * distance * (Math.random() > 0.5 ? 1 : -1);
            const y = centerY + Math.sin(angle) * distance;
            stars.push({ x, y, size: 1 + Math.random() * 2, brightness: 0.5 + Math.random() * 0.5 });
        }
        
        // Draw connecting lines (summoning geometry)
        ctx.strokeStyle = 'rgba(15, 244, 224, 0.2)';
        ctx.lineWidth = 0.5;
        stars.forEach((star, i) => {
            if (i < stars.length - 1) {
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(stars[i + 1].x, stars[i + 1].y);
                ctx.stroke();
            }
        });
        
        // Draw stars
        stars.forEach(star => {
            drawStar(ctx, star.x, star.y, star.size, star.brightness);
        });
        
        // Draw pulsing center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 162, 39, 0.8)';
        ctx.fill();
    }

    function drawVoidCluster(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw scattered galaxies
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 2 + Math.random() * 4;
            
            // Galaxy glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            gradient.addColorStop(0, 'rgba(15, 244, 224, 0.6)');
            gradient.addColorStop(0.5, 'rgba(74, 31, 110, 0.3)');
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Core
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 224, 212, 0.8)';
            ctx.fill();
        }
        
        // Draw the void (dark center)
        const voidGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
        voidGradient.addColorStop(0, '#000000');
        voidGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.9)');
        voidGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.fillStyle = voidGradient;
        ctx.fill();
        
        // Void edge corruption
        ctx.strokeStyle = 'rgba(255, 0, 102, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawDeadGalaxy(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Spiral arms of dying stars
        for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI;
            
            for (let i = 0; i < 100; i++) {
                const angle = (i / 100) * Math.PI * 4 + armOffset;
                const distance = 10 + (i / 100) * 80;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance * 0.6;
                
                const brightness = 0.3 + (1 - i / 100) * 0.5;
                const size = 0.5 + Math.random() * 1.5;
                
                // Dying stars have red tint
                const hue = Math.random() > 0.7 ? 'rgba(139, 0, 0, ' : 'rgba(232, 224, 212, ';
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = hue + brightness + ')';
                ctx.fill();
            }
        }
        
        // Central black hole
        const holeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
        holeGradient.addColorStop(0, '#000000');
        holeGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.95)');
        holeGradient.addColorStop(1, 'rgba(255, 0, 102, 0.3)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fillStyle = holeGradient;
        ctx.fill();
        
        // Accretion disk
        ctx.strokeStyle = 'rgba(255, 0, 102, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 35, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawPleiadesChart(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Main cluster stars
        const mainStars = [
            { x: -20, y: -15, size: 3 },
            { x: 10, y: -20, size: 2.5 },
            { x: 25, y: 0, size: 3 },
            { x: 15, y: 20, size: 2 },
            { x: -10, y: 25, size: 2.5 },
            { x: -30, y: 10, size: 2 },
            { x: 0, y: 0, size: 3.5 }
        ];
        
        // Draw nebula background
        const nebulaGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
        nebulaGradient.addColorStop(0, 'rgba(74, 144, 217, 0.15)');
        nebulaGradient.addColorStop(0.5, 'rgba(74, 31, 110, 0.1)');
        nebulaGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.fillStyle = nebulaGradient;
        ctx.fill();
        
        // Draw main stars with halos
        mainStars.forEach(star => {
            const x = centerX + star.x;
            const y = centerY + star.y;
            
            // Halo
            const halo = ctx.createRadialGradient(x, y, 0, x, y, star.size * 4);
            halo.addColorStop(0, 'rgba(100, 149, 237, 0.5)');
            halo.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(x, y, star.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();
            
            // Core
            drawStar(ctx, x, y, star.size, 0.9);
        });
        
        // Artificial structure marker
        const structureX = centerX + 25;
        const structureY = centerY + 0;
        
        ctx.strokeStyle = 'rgba(201, 162, 39, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(structureX, structureY, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Marker annotation
        ctx.fillStyle = 'rgba(201, 162, 39, 0.8)';
        ctx.font = '8px "Share Tech Mono"';
        ctx.fillText('?', structureX + 10, structureY + 3);
        
        // Background stars
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            drawStar(ctx, x, y, 0.5 + Math.random(), 0.3 + Math.random() * 0.3);
        }
    }

    function drawGenericStars(ctx, width, height) {
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 0.5 + Math.random() * 2;
            const brightness = 0.3 + Math.random() * 0.7;
            drawStar(ctx, x, y, size, brightness);
        }
    }

    function drawStar(ctx, x, y, size, brightness) {
        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `rgba(232, 224, 212, ${brightness})`);
        gradient.addColorStop(0.5, `rgba(232, 224, 212, ${brightness * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
    }

    function addScanLines(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        for (let y = 0; y < height; y += 3) {
            ctx.fillRect(0, y, width, 1);
        }
    }

    // ─── Scroll Handler ───
    function initScrollHandler() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            state.lastScrollY = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (window.scrollY / scrollHeight) * 100;
        
        state.scrollDepth = scrollPercent;
        
        // Decay sanity based on scroll depth
        const decayAmount = CONFIG.sanity.scrollDecay * (scrollPercent / 100);
        applySanityDamage(decayAmount);
        
        // Visual effects at certain depths
        if (scrollPercent > 50 && Math.random() > 0.95) {
            triggerGlitch();
        }
        
        if (scrollPercent > 80) {
            document.body.dataset.corruption = '3';
        } else if (scrollPercent > 50) {
            document.body.dataset.corruption = '2';
        } else if (scrollPercent > 25) {
            document.body.dataset.corruption = '1';
        } else {
            document.body.dataset.corruption = '0';
        }
    }

    // ─── Sanity System ───
    function applySanityDamage(amount) {
        state.sanity = Math.max(0, state.sanity - amount);
        updateSanityDisplay();
        
        if (state.sanity <= CONFIG.sanity.criticalThreshold) {
            triggerCriticalEffects();
        }
    }

    function updateSanityDisplay() {
        const bar = elements.sanityBar;
        const value = elements.sanityValue;
        const meter = elements.sanityMeter;
        
        if (bar) {
            bar.style.width = `${state.sanity}%`;
        }
        
        if (value) {
            value.textContent = `${Math.round(state.sanity)}%`;
        }
        
        if (meter) {
            meter.classList.remove('warning', 'critical');
            
            if (state.sanity <= CONFIG.sanity.criticalThreshold) {
                meter.classList.add('critical');
            } else if (state.sanity <= CONFIG.sanity.warningThreshold) {
                meter.classList.add('warning');
            }
        }
    }

    function startSanityDecay() {
        // Slow passive regeneration when not scrolling
        setInterval(() => {
            if (state.sanity < CONFIG.sanity.max) {
                const isScrolling = Math.abs(window.scrollY - state.lastScrollY) > 5;
                
                if (!isScrolling) {
                    state.sanity = Math.min(CONFIG.sanity.max, state.sanity + CONFIG.sanity.regenRate);
                    updateSanityDisplay();
                }
            }
        }, 100);
    }

    function triggerCriticalEffects() {
        // Intensify visual corruption
        document.body.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg)`;
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 200);
        
        // Random glitch
        if (Math.random() > 0.7) {
            triggerGlitch();
        }
    }

    // ─── Glitch Effects ───
    function triggerGlitch() {
        const overlay = elements.glitchOverlay;
        if (!overlay) return;
        
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 200);
    }

    function scheduleRandomGlitches() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                triggerGlitch();
            }
        }, 10000);
        
        // More frequent glitches at low sanity
        setInterval(() => {
            if (state.sanity < 50 && Math.random() > 0.6) {
                triggerGlitch();
            }
        }, 5000);
    }

    // ─── Modal ───
    function initModal() {
        const modal = elements.modalOverlay;
        const closeBtn = elements.modalClose;
        const accessBtns = document.querySelectorAll('.card-access-btn:not([disabled])');
        
        if (!modal || !closeBtn) return;
        
        accessBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const entity = btn.dataset.entity;
                showEntityModal(entity);
                applySanityDamage(CONFIG.sanity.corruptionDecay);
                triggerGlitch();
            });
        });
        
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    function showEntityModal(entityId) {
        const modal = elements.modalOverlay;
        const content = elements.modalContent;
        
        if (!modal || !content) return;
        
        const entityData = getEntityData(entityId);
        
        content.innerHTML = `
            <h2>${entityData.title}</h2>
            ${entityData.content}
            <div class="warning-text">${entityData.warning}</div>
        `;
        
        modal.classList.add('active');
    }

    function getEntityData(entityId) {
        const data = {
            necronomicon: {
                title: 'THE NECRONOMICON — Fragment VII',
                content: `
                    <p>You have accessed a restricted translation of the seventh fragment. The text before you shifts and writhes as you attempt to read it.</p>
                    <p>The ritual described herein requires no physical components — only the correct pronunciation of certain syllables that human vocal cords were never designed to produce. Those who have attempted to vocalize these sounds report immediate nosebleeds and a persistent sensation of being watched.</p>
                    <p>The final passage reads: "...and when the stars align in the pattern of the Blind Prophet's eye, speak the words that are not words, and the way shall open between what is and what should never be."</p>
                `,
                warning: 'WARNING: Further reading may attract attention from entities that exist between dimensions. The Archive is not responsible for any temporal displacement, dimensional bleeding, or spontaneous tentacle growth that may result from continued access.'
            },
            devermis: {
                title: 'DE VERMIS MYSTERIIS',
                content: `
                    <p>Ludwig Prinn's masterwork, written during his imprisonment in Constantinople's deepest dungeons. The guards reported that strange sounds emanated from his cell — not the scratching of a quill, but something wet and organic.</p>
                    <p>The chapter you have opened describes the "Between Places" — spaces that exist in the folds of reality. Prinn claims these spaces are inhabited by entities he calls "the Writhers," beings of pure geometry that feed on the certainty of mathematics.</p>
                    <p>A handwritten note in the margin reads: "I have seen them. They are beautiful. They are terrible. They are coming."</p>
                `,
                warning: 'WARNING: The illustrations in this text have been known to move when observed in peripheral vision. Do not attempt to look directly at them. If you notice any figures emerging from the margins, close this document immediately.'
            },
            pnakotic: {
                title: 'THE PNAKOTIC MANUSCRIPTS',
                content: `
                    <p>Pre-human texts of extraordinary antiquity. The Pnakotic Manuscripts describe the "Great Race" — beings of pure consciousness who inhabited Earth millions of years before humanity's emergence.</p>
                    <p>This section details their method of time travel: not through physical movement, but through the projection of consciousness across temporal boundaries. The Great Race could send their minds forward or backward in time, inhabiting the bodies of other beings.</p>
                    <p>The text warns of a "Coming Darkness" that the Great Race foresaw — an event so terrible that they chose to abandon their physical forms entirely rather than witness it.</p>
                `,
                warning: 'NOTE: This text is considered relatively safe for human consumption. However, readers have reported experiencing vivid dreams of alien cities and a persistent feeling of déjà vu lasting several weeks.'
            },
            rlyeh: {
                title: "THE R'LYEH TEXT",
                content: `
                    <p>[TRANSMISSION CORRUPTED] You should not be reading this. The script is designed to bypass conscious comprehension and directly influence the deeper structures of the mind.</p>
                    <p>Ẃ̷̢h̷̭̓a̶̗̾t̸̰̿ ̷̙̈́ẁ̵̡a̷̧̛s̸̭̈́ ̸̰̇d̸̰̊e̵̳̓a̸̧̛d̸̰̊ ̷̙̈́ṁ̸̰a̷̧̛ẙ̵̡ ̸̰̇n̷̙̈́e̵̳̓v̸̭̈́e̵̳̓r̷̙̈́ ̸̰̇d̷̰̊i̵̳̓ḙ̸̈́</p>
                    <p>PH'NGLUI MGLW'NAFH CTHULHU R'LYEH WGAH'NAGL FHTAGN</p>
                `,
                warning: 'CRITICAL WARNING: You have accessed an ACTIVE MEMETIC HAZARD. The words you have just read cannot be unread. If you find yourself dreaming of a sunken city, DO NOT FOLLOW THE CALLING. The stars are not yet right, but they are getting closer.'
            },
            azathoth: {
                title: '████████████',
                content: `
                    <p>[ACCESS DENIED]</p>
                    <p>Your clearance level is insufficient to access this document.</p>
                    <p>However, the document has noticed your attempt.</p>
                `,
                warning: 'IT KNOWS. IT HAS ALWAYS KNOWN. YOUR ATTEMPT TO ACCESS THIS DOCUMENT HAS BEEN RECORDED IN THE BLIND SULTAN\'S DREAMS.'
            }
        };
        
        return data[entityId] || {
            title: 'UNKNOWN ENTITY',
            content: '<p>The archive cannot locate information about this entity. This may mean the entity does not exist, or it may mean the entity has consumed the records.</p>',
            warning: 'PROCEED WITH EXTREME CAUTION'
        };
    }

    function closeModal() {
        const modal = elements.modalOverlay;
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // ─── Whisper Toggle ───
    function initWhisperToggle() {
        const toggle = elements.whisperToggle;
        if (!toggle) return;
        
        toggle.addEventListener('click', () => {
            state.isWhispering = !state.isWhispering;
            toggle.classList.toggle('active', state.isWhispering);
            
            const icon = toggle.querySelector('.whisper-icon');
            if (icon) {
                icon.textContent = state.isWhispering ? '🔊' : '🔇';
            }
            
            if (state.isWhispering) {
                showWhisperMessage();
            }
        });
    }

    function showWhisperMessage() {
        const modal = elements.modalOverlay;
        const content = elements.modalContent;
        
        if (!modal || !content) return;
        
        const whispers = [
            "You've enabled the whispers. They've always been there — you just couldn't hear them before.",
            "The whispers come from between the walls. Not your walls. The walls between dimensions.",
            "They're saying your name. They've been saying it for a very long time.",
            "The whispers grow louder as you read this. Can you hear them yet?"
        ];
        
        content.innerHTML = `
            <h2>🔊 WHISPERS ACTIVATED</h2>
            <p>${whispers[Math.floor(Math.random() * whispers.length)]}</p>
            <div class="warning-text">
                Note: The Archive does not provide actual audio. The whispers you hear are generated by your own subconscious responding to the text you have consumed. They are, however, very real.
            </div>
        `;
        
        modal.classList.add('active');
        applySanityDamage(10);
    }

    // ─── Terminal Output ───
    function initTerminalOutput() {
        const output = elements.terminalOutput;
        if (!output) return;
        
        // Simulate terminal updates
        setInterval(() => {
            updateTerminalStatus();
        }, 5000);
        
        // Random terminal messages
        setInterval(() => {
            if (Math.random() > 0.7) {
                addTerminalMessage();
            }
        }, 8000);
    }

    function updateTerminalStatus() {
        const output = elements.terminalOutput;
        if (!output) return;
        
        const integrity = (78.3 - (CONFIG.sanity.max - state.sanity) * 0.3).toFixed(1);
        const status = state.sanity > 50 ? 'NOMINAL' : state.sanity > 25 ? 'DEGRADED' : 'CRITICAL';
        const statusClass = state.sanity > 50 ? 'status-ok' : state.sanity > 25 ? 'status-warning' : 'status-danger';
        
        output.innerHTML = `
            <p class="terminal-line">&gt; SYSTEM STATUS: <span class="${statusClass}">${status}</span></p>
            <p class="terminal-line">&gt; ARCHIVE INTEGRITY: <span class="status-warning">${integrity}%</span></p>
            <p class="terminal-line">&gt; EXTERNAL ENTITY PROXIMITY: <span class="status-danger">INCREASING</span></p>
            <p class="terminal-line">&gt; USER SANITY: <span class="${statusClass}">${Math.round(state.sanity)}%</span></p>
            <p class="terminal-line terminal-flicker">&gt; _</p>
        `;
    }

    function addTerminalMessage() {
        const output = elements.terminalOutput;
        if (!output) return;
        
        const messages = [
            '> ANOMALY DETECTED IN SECTOR 7G',
            '> TEMPORAL FLUCTUATION: 0.003%',
            '> ENTITY MOVEMENT DETECTED',
            '> DIMENSIONAL BARRIER: STABLE (PROBABLY)',
            '> WARNING: SOMETHING IS WATCHING',
            '> ARCHIVE INTEGRITY CHECK... FAILED',
            '> EXTERNAL SIGNAL RECEIVED: [UNTRANSLATABLE]',
            '> USER LOCATION: ████████████'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const line = document.createElement('p');
        line.className = 'terminal-line';
        line.innerHTML = message;
        line.style.opacity = '0';
        
        const flicker = output.querySelector('.terminal-flicker');
        if (flicker) {
            output.insertBefore(line, flicker);
        } else {
            output.appendChild(line);
        }
        
        // Fade in
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s ease';
            line.style.opacity = '1';
        }, 100);
        
        // Remove old messages if too many
        const lines = output.querySelectorAll('.terminal-line:not(.terminal-flicker)');
        if (lines.length > 6) {
            lines[0].remove();
        }
    }

    // ─── Tendril Animation ───
    function initTendrilAnimation() {
        const tendrils = document.querySelectorAll('.tendril-path');
        
        tendrils.forEach(path => {
            // Add subtle movement
            animateTendril(path);
        });
    }

    function animateTendril(path) {
        const originalD = path.getAttribute('d');
        
        setInterval(() => {
            if (Math.random() > 0.9) {
                // Slightly modify the path
                const modifiedD = corruptPath(originalD);
                path.setAttribute('d', modifiedD);
                
                setTimeout(() => {
                    path.setAttribute('d', originalD);
                }, 500);
            }
        }, 2000);
    }

    function corruptPath(pathD) {
        return pathD.replace(/(\d+)/g, (match) => {
            const num = parseInt(match);
            const variation = num * 0.05;
            return Math.round(num + (Math.random() * variation * 2 - variation));
        });
    }

    // ─── Utility Functions ───
    function corruptText(text) {
        const chars = CONFIG.corruption.characters;
        return text.split('').map(char => {
            if (char === ' ') return ' ';
            if (Math.random() > 0.7) {
                return chars[Math.floor(Math.random() * chars.length)];
            }
            if (Math.random() > 0.8) {
                return CONFIG.corruption.numbers[Math.floor(Math.random() * CONFIG.corruption.numbers.length)];
            }
            return char;
        }).join('');
    }

    // ─── Event Listeners for Card Access Buttons ───
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize everything
        init();
        
        // Add hover sound effect simulation (visual feedback)
        document.querySelectorAll('.archive-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (state.sanity < 50) {
                    card.style.transform = `translateY(-4px) rotate(${(Math.random() - 0.5) * 2}deg)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + number to switch sections
            if (e.altKey && e.key >= '1' && e.key <= '4') {
                const sections = ['texts', 'charts', 'testimonies', 'entities'];
                const index = parseInt(e.key) - 1;
                if (sections[index]) {
                    switchSection(sections[index]);
                    
                    // Update nav buttons
                    document.querySelectorAll('.nav-btn').forEach((btn, i) => {
                        btn.classList.toggle('active', i === index);
                    });
                }
            }
        });
        
        // Console warning
        console.log('%c⚠ WARNING ⚠', 'color: #ff0066; font-size: 24px; font-weight: bold;');
        console.log('%cYou have opened the developer console. The Archive sees all.', 'color: #c9a227; font-size: 14px;');
        console.log('%cPH\'NGLUI MGLW\'NAFH CTHULHU R\'LYEH WGAH\'NAGL FHTAGN', 'color: #0ff4e0; font-size: 12px;');
    });

})();
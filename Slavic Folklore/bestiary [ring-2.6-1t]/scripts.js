/**
 * ============================================================
 * SLAVIC BESTIARY — Interactive Book Script
 * Hand-bound creature compendium navigation, animation & interaction
 * ============================================================
 */

(function () {
    'use strict';

    /* =========================================================
       CREATURE DATA REGISTRY
       ========================================================= */
    const creatures = [
        {
            id: 'leshy',
            page: 3,
            nameSlavic: 'Лешый',
            nameLatin: 'Leshy',
            nameEnglish: 'The Forest Lord',
            classification: 'Beast',
            habitat: 'forest',
            dangerLevel: 5,
            dangerLabel: 'Extreme',
            icon: '🌲'
        },
        {
            id: 'rusalka',
            page: 4,
            nameSlavic: 'Русалка',
            nameLatin: 'Rusalka',
            nameEnglish: 'The Drowning Maiden',
            classification: 'Spirit',
            habitat: 'water',
            dangerLevel: 4,
            dangerLabel: 'High',
            icon: '🌊'
        },
        {
            id: 'babayaga',
            page: 5,
            nameSlavic: 'Баба-Яга',
            nameLatin: 'Baba Yaga',
            nameEnglish: 'The Iron-toothed Hag',
            classification: 'Witch',
            habitat: 'forest',
            dangerLevel: 5,
            dangerLabel: 'Extreme',
            icon: '🏚️'
        },
        {
            id: 'zmey',
            page: 6,
            nameSlavic: 'Змей Горыныч',
            nameLatin: 'Zmey Gorynych',
            nameEnglish: 'The Three-headed Dragon',
            classification: 'Dragon',
            habitat: 'underworld',
            dangerLevel: 5,
            dangerLabel: 'Extreme',
            icon: '🐉'
        },
        {
            id: 'domovoi',
            page: 7,
            nameSlavic: 'Домовой',
            nameLatin: 'Domovoi',
            nameEnglish: 'The Hearth Guardian',
            classification: 'Spirit',
            habitat: 'hearth',
            dangerLevel: 2,
            dangerLabel: 'Low',
            icon: '🏠'
        },
        {
            id: 'vodyanoy',
            page: 8,
            nameSlavic: 'Водяной',
            nameLatin: 'Vodyanoy',
            nameEnglish: 'The Old Man of the Waters',
            classification: 'Spirit',
            habitat: 'water',
            dangerLevel: 4,
            dangerLabel: 'High',
            icon: '🐸'
        },
        {
            id: 'kikimora',
            page: 9,
            nameSlavic: 'Кикимора',
            nameLatin: 'Kikimora',
            nameEnglish: 'The Flaxen Hag',
            classification: 'Spirit',
            habitat: 'hearth',
            dangerLevel: 2,
            dangerLabel: 'Low',
            icon: '🕸️'
        },
        {
            id: 'sirin',
            page: 10,
            nameSlavic: 'Сирин',
            nameLatin: 'Sirin',
            nameEnglish: 'The Bird of Paradise',
            classification: 'Celestial',
            habitat: 'sky',
            dangerLevel: 1,
            dangerLabel: 'None … & All',
            icon: '🕊️'
        },
        {
            id: 'likho',
            page: 11,
            nameSlavic: 'Лихо Одноглазое',
            nameLatin: 'Likho',
            nameEnglish: 'The Evil-Eyed Hag',
            classification: 'Demon',
            habitat: 'underworld',
            dangerLevel: 4,
            dangerLabel: 'High',
            icon: '👁️'
        },
        {
            id: 'zhar-ptitsa',
            page: 12,
            nameSlavic: 'Жар-Птица',
            nameLatin: 'Zhar-Ptitsa',
            nameEnglish: 'The Bird of Living Flame',
            classification: 'Celestial',
            habitat: 'sky',
            dangerLevel: 0,
            dangerLabel: 'Blessing',
            icon: '🔥'
        },
        {
            id: 'upyr',
            page: 13,
            nameSlavic: 'Вупырь',
            nameLatin: 'Upyr',
            nameEnglish: 'The Revenant',
            classification: 'Undead',
            habitat: 'underworld',
            dangerLevel: 4,
            dangerLabel: 'High',
            icon: '🧛'
        }
    ];

    /* =========================================================
       STATE
       ========================================================= */
    const state = {
        currentPage: 0,
        totalPages: 14,
        previousPage: null,
        ambientEnabled: false,
        filter: 'all',
        initialized: false,
        touchStartX: 0,
        touchStartY: 0,
        isDragging: false
    };

    /* =========================================================
       DOM REFERENCES
       ========================================================= */
    const dom = {};

    function cacheDOMElements() {
        dom.book = document.getElementById('bestiary');
        dom.pageCounter = document.getElementById('pageCounter');
        dom.pageCounterText = dom.pageCounter.querySelector('.page-counter-text');
        dom.scrollProgress = document.getElementById('scrollProgress');
        dom.scrollProgressBar = document.getElementById('scrollProgressBar');
        dom.ambientToggle = document.getElementById('ambientToggle');
        dom.navFirst = document.getElementById('navFirst');
        dom.navPrev = document.getElementById('navPrev');
        dom.navNext = document.getElementById('navNext');
        dom.navLast = document.getElementById('navLast');
        dom.creatureIndex = document.getElementById('creatureIndex');
        dom.filterBtns = document.querySelectorAll('.filter-btn');
        dom.canopyOverlay = document.querySelector('.canopy-overlay');
        dom.fireGlow = document.querySelector('.fire-glow');
        dom.allPages = document.querySelectorAll('.page');
    }

    /* =========================================================
       PAGE NAVIGATION
       ========================================================= */
    function goToPage(pageNum, animate = true) {
        if (pageNum < 0 || pageNum > state.totalPages) return;
        if (pageNum === state.currentPage && state.initialized) return;

        const previousPage = state.currentPage;
        state.previousPage = previousPage;
        state.currentPage = pageNum;

        // Update page classes for transition
        dom.allPages.forEach((page) => {
            const p = parseInt(page.dataset.page, 10);
            page.classList.remove('active', 'page--previous', 'page--next');

            if (p === pageNum) {
                // Current page
                if (animate) {
                    // Delay activation slightly for transition effect
                    requestAnimationFrame(() => {
                        page.classList.add('active');
                        triggerEntryAnimations(page);
                    });
                } else {
                    page.classList.add('active');
                    triggerEntryAnimations(page);
                }
            } else if (p === pageNum - 1 || (pageNum === 0 && p === state.totalPages)) {
                page.classList.add('page--previous');
            } else if (p === pageNum + 1 || (pageNum === state.totalPages && p === 0)) {
                page.classList.add('page--next');
            }
        });

        updatePageCounter();
        updateScrollProgress();
        updateURLHash(pageNum);
        updateAmbientForPage(pageNum);

        // Scroll the creature index entry into view if on contents page
        if (pageNum === 2) {
            highlightActiveIndexEntry(null);
        }

        state.initialized = true;
    }

    function nextPage() {
        if (state.currentPage < state.totalPages) {
            goToPage(state.currentPage + 1);
        }
    }

    function prevPage() {
        if (state.currentPage > 0) {
            goToPage(state.currentPage - 1);
        }
    }

    function firstPage() {
        goToPage(0);
    }

    function lastPage() {
        goToPage(state.totalPages);
    }

    /* =========================================================
       ENTRY ANIMATIONS
       ========================================================= */
    function triggerEntryAnimations(page) {
        if (!page.classList.contains('page--entry')) return;

        const layout = page.querySelector('.entry-layout');
        const children = layout ? layout.children : [];

        // Reset animations
        children.forEach((child) => {
            child.style.animation = 'none';
            child.offsetHeight; // Trigger reflow
        });

        // Stagger reveal
        children.forEach((child, i) => {
            child.style.animation = `entryFadeUp 0.6s ${i * 0.12}s ease-out both`;
        });

        // Add subtle parallax pulse to illustration
        const illustration = page.querySelector('.entry-illustration');
        if (illustration) {
            illustration.style.animation = 'illustrationFloat 4s ease-in-out infinite';
        }
    }

    /* =========================================================
       PAGE COUNTER
       ========================================================= */
    function updatePageCounter() {
        const pageLabels = [
            'Обложка',
            'Титул',
            'Содержание',
            'Леший',
            'Русалка',
            'Баба-Яга',
            'Змей',
            'Домовой',
            'Водяной',
            'Кикимора',
            'Сирин',
            'Лихо',
            'Жар-Птица',
            'Вупырь',
            'Задняя Обложка'
        ];

        const currentLabel = pageLabels[state.currentPage] || `Page ${state.currentPage}`;
        dom.pageCounterText.textContent = `${currentLabel} · ${state.currentPage + 1} / ${state.totalPages + 1}`;
    }

    /* =========================================================
       SCROLL PROGRESS
       ========================================================= */
    function updateScrollProgress() {
        const progress = ((state.currentPage) / state.totalPages) * 100;
        dom.scrollProgressBar.style.width = `${progress}%`;
    }

    /* =========================================================
       CREATURE INDEX GENERATION
       ========================================================= */
    function buildCreatureIndex() {
        dom.creatureIndex.innerHTML = '';

        const filtered = state.filter === 'all'
            ? creatures
            : creatures.filter(c => c.habitat === state.filter);

        // Sort by page number
        filtered.sort((a, b) => a.page - b.page);

        filtered.forEach((creature) => {
            const entry = document.createElement('div');
            entry.className = 'index-entry';
            entry.dataset.creatureId = creature.id;
            entry.dataset.gotoPage = creature.page;

            // Danger color indicator
            const dangerColor = getDangerColor(creature.dangerLevel);

            entry.innerHTML = `
                <span class="index-icon">${creature.icon}</span>
                <div class="index-name">
                    ${creature.nameSlavic}
                    <small>${creature.nameEnglish} · ${creature.dangerLabel}</small>
                </div>
                <span class="index-danger-dot" style="color: ${dangerColor}; font-size: 0.6rem;">●</span>
            `;

            entry.addEventListener('click', () => {
                goToPage(creature.page);
            });

            entry.addEventListener('mouseenter', () => {
                entry.classList.add('active-entry');
            });

            entry.addEventListener('mouseleave', () => {
                entry.classList.remove('active-entry');
            });

            dom.creatureIndex.appendChild(entry);
        });
    }

    function getDangerColor(level) {
        if (level === 0) return '#c8a830'; // Blessing
        if (level <= 1) return '#4a6a2a';  // Low
        if (level <= 3) return '#8b8b20';  // Medium
        return '#8b2020';                   // High/Extreme
    }

    /* =========================================================
       FILTER HANDLING
       ========================================================= */
    function setFilter(filter) {
        state.filter = filter;

        dom.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        buildCreatureIndex();
    }

    /* =========================================================
       URL HASH DEEP LINKING
       ========================================================= */
    function updateURLHash(pageNum) {
        const hashMap = {
            0: 'cover',
            1: 'inner-cover',
            2: 'index',
            14: 'back-cover'
        };

        const creature = creatures.find(c => c.page === pageNum);
        const hash = hashMap[pageNum] || (creature ? creature.id : `page-${pageNum}`);

        if (window.location.hash !== `#${hash}`) {
            history.replaceState(null, '', `#${hash}`);
        }
    }

    function navigateFromHash() {
        const hash = window.location.hash.replace('#', '');
        if (!hash) return 0;

        const hashMap = {
            'cover': 0,
            'inner-cover': 1,
            'index': 2,
            'back-cover': 14
        };

        if (hashMap[hash] !== undefined) return hashMap[hash];

        const creature = creatures.find(c => c.id === hash);
        return creature ? creature.page : 0;
    }

    /* =========================================================
       AMBIENT SOUND TOGGLE (Simulated)
       ========================================================= */
    function toggleAmbient() {
        state.ambientEnabled = !state.ambientEnabled;
        dom.ambientToggle.classList.toggle('active', state.ambientEnabled);

        // Update icon
        const svg = dom.ambientToggle.querySelector('svg');
        if (state.ambientEnabled) {
            svg.style.opacity = '1';
            svg.style.filter = 'drop-shadow(0 0 6px rgba(200, 168, 48, 0.5))';
        } else {
            svg.style.opacity = '0.5';
            svg.style.filter = 'none';
        }
    }

    /* =========================================================
       AMBIENT VISUAL EFFECTS PER PAGE
       ========================================================= */
    function updateAmbientForPage(pageNum) {
        // Adjust canopy opacity based on page habitat
        const canopyLayers = document.querySelectorAll('.canopy-layer');
        const fireLayers = document.querySelectorAll('.fire-pillar');

        if (pageNum === 0) {
            // Cover: subtle canopy + warm fire glow
            canopyLayers.forEach(l => { l.style.opacity = '0.4'; l.style.pointerEvents = 'none'; });
            dom.fireGlow.style.opacity = '0.3';
        } else if (state.allPages) {
            const page = document.querySelector(`.page[data-page="${pageNum}"]`);
            if (page) {
                const habitat = page.dataset.habitat;
                switch (habitat) {
                    case 'forest':
                        canopyLayers.forEach(l => { l.style.opacity = '0.8'; });
                        dom.fireGlow.style.opacity = '0.15';
                        break;
                    case 'water':
                        canopyLayers.forEach(l => { l.style.opacity = '0.3'; });
                        dom.fireGlow.style.opacity = '0.25';
                        break;
                    case 'hearth':
                        canopyLayers.forEach(l => { l.style.opacity = '0.15'; });
                        dom.fireGlow.style.opacity = '0.5';
                        break;
                    case 'underworld':
                        canopyLayers.forEach(l => { l.style.opacity = '0.1'; });
                        dom.fireGlow.style.opacity = '0.2';
                        break;
                    case 'sky':
                        canopyLayers.forEach(l => { l.style.opacity = '0.05'; });
                        dom.fireGlow.style.opacity = '0.1';
                        break;
                    default:
                        canopyLayers.forEach(l => { l.style.opacity = '0.3'; });
                        dom.fireGlow.style.opacity = '0.35';
                }
            }
        }
    }

    /* =========================================================
       FIREFLY PARTICLES (Cover Page Ambient)
       ========================================================= */
    function createFireflies() {
        const coverPage = document.querySelector('.page--cover');
        if (!coverPage) return;

        // Use JS-created fireflies for dynamic animation
        for (let i = 0; i < 15; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';
            firefly.style.cssText = `
                position: absolute;
                width: ${3 + Math.random() * 3}px;
                height: ${3 + Math.random() * 3}px;
                background: rgba(255, 200, 50, ${0.3 + Math.random() * 0.5});
                border-radius: 50%;
                top: ${10 + Math.random() * 80}%;
                left: ${10 + Math.random() * 80}%;
                pointer-events: none;
                z-index: 4;
                box-shadow: 0 0 ${4 + Math.random() * 6}px rgba(255, 200, 50, 0.4);
                animation: fireflyDrift ${4 + Math.random() * 6}s ease-in-out infinite alternate,
                           fireflyPulse ${1 + Math.random() * 2}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * 5}s, ${Math.random() * 3}s;
            `;
            coverPage.appendChild(firefly);
        }
    }

    /* =========================================================
       TOUCH / SWIPE SUPPORT
       ========================================================= */
    function handleTouchStart(e) {
        const touch = e.touches[0];
        state.touchStartX = touch.clientX;
        state.touchStartY = touch.clientY;
        state.isDragging = true;
    }

    function handleTouchEnd(e) {
        if (!state.isDragging) return;
        state.isDragging = false;

        const touch = e.changedTouches[0];
        const diffX = touch.clientX - state.touchStartX;
        const diffY = touch.clientY - state.touchStartY;

        // Only consider horizontal swipes that are longer than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX < 0) {
                nextPage(); // Swipe left = next
            } else {
                prevPage(); // Swipe right = previous
            }
        }
    }

    /* =========================================================
       KEYBOARD NAVIGATION
       ========================================================= */
    function handleKeyDown(e) {
        // Don't navigate if in a focused input/textarea
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextPage();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevPage();
                break;
            case 'Home':
                e.preventDefault();
                firstPage();
                break;
            case 'End':
                e.preventDefault();
                lastPage();
                break;
            case 'ArrowDown':
                e.preventDefault();
                // Scroll within active page content
                scrollWithinPage(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                scrollWithinPage(-1);
                break;
        }
    }

    function scrollWithinPage(direction) {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;

        const scrollable = activePage.querySelector('.entry-text');
        if (!scrollable) return;

        const amount = 80;
        scrollable.scrollBy({ top: amount * direction, behavior: 'smooth' });
    }

    /* =========================================================
       PARALLAX ON MOUSE MOVE (Subtle)
       ========================================================= */
    function handleMouseMove(e) {
        if (!dom.canopyOverlay) return;

        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Very subtle parallax on canopy
        const layers = dom.canopyOverlay.querySelectorAll('.canopy-layer');
        layers.forEach((layer, i) => {
            const factor = (i + 1) * 3;
            layer.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    }

    /* =========================================================
       INITIALIZATION
       ========================================================= */
    function init() {
        cacheDOMElements();

        // Build the creature index
        buildCreatureIndex();

        // Create ambient fireflies on cover
        createFireflies();

        // Determine starting page from URL hash or default to 0 (cover)
        const startPage = navigateFromHash();
        goToPage(startPage, false);

        // Attach global event listeners
        dom.navFirst.addEventListener('click', firstPage);
        dom.navPrev.addEventListener('click', prevPage);
        dom.navNext.addEventListener('click', nextPage);
        dom.navLast.addEventListener('click', lastPage);

        dom.ambientToggle.addEventListener('click', toggleAmbient);

        // Filter buttons
        dom.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => setFilter(btn.dataset.filter));
        });

        // Inline navigation buttons on entry pages (prev arrows)
        document.addEventListener('click', (e) => {
            const navPrevBtn = e.target.closest('.nav-prev');
            if (navPrevBtn && navPrevBtn.dataset.goto) {
                e.preventDefault();
                goToPage(parseInt(navPrevBtn.dataset.goto, 10));
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);

        // Touch/Swipe support
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Subtle parallax on mouse move
        document.addEventListener('mousemove', handleMouseMove);

        // Hash change listener for deep linking
        window.addEventListener('hashchange', () => {
            goToPage(navigateFromHash());
        });

        // Periodic subtle ambient animations
        setInterval(() => {
            if (!state.ambientEnabled) return;
            // Could trigger random firefly flickers, etc.
        }, 8000);

        // Animate cover fireflies continuously
        animateCoverAmbience();

        console.log('%c🧛 СВАТАЯ КНИГА — Slavic Bestiary Loaded', 'color: #c8a830; font-family: serif; font-size: 14px; background: #1a1410; padding: 8px; border-radius: 4px;');
    }

    /* =========================================================
       COVER AMBIENT CONTINUOUS ANIMATION
       ========================================================= */
    function animateCoverAmbience() {
        // Periodically add sparkle particles to cover
        setInterval(() => {
            const cover = document.querySelector('.page--cover .page-content');
            if (!cover || !cover.parentElement.classList.contains('active')) return;

            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 3}px;
                height: ${2 + Math.random() * 3}px;
                background: rgba(255, 220, 100, ${0.2 + Math.random() * 0.4});
                border-radius: 50%;
                top: ${5 + Math.random() * 90}%;
                left: ${5 + Math.random() * 90}%;
                pointer-events: none;
                z-index: 5;
                box-shadow: 0 0 ${3 + Math.random() * 5}px rgba(255, 200, 50, 0.3);
                animation: sparkleFade ${2 + Math.random() * 3}s ease-out forwards;
            `;
            cover.appendChild(sparkle);

            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
            }, 4000);
        }, 3000);
    }

    /* =========================================================
       DYNAMIC STYLE INJECTION FOR CUSTOM ANIMATIONS
       ========================================================= */
    function injectCustomAnimations() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes entryFadeUp {
                0% {
                    opacity: 0;
                    transform: translateY(24px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes illustrationFloat {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-6px);
                }
            }

            @keyframes fireflyDrift {
                0% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(${10 - Math.random() * 20}px, ${-10 - Math.random() * 15}px);
                }
                50% {
                    transform: translate(${5 - Math.random() * 10}px, ${-5 - Math.random() * 10}px);
                }
                100% {
                    transform: translate(${-10 + Math.random() * 20}px, ${-15 - Math.random() * 10}px);
                }
            }

            @keyframes fireflyPulse {
                0%, 100% {
                    opacity: 0.3;
                    box-shadow: 0 0 4px rgba(255, 200, 50, 0.2);
                }
                50% {
                    opacity: 1;
                    box-shadow: 0 0 10px rgba(255, 200, 50, 0.6);
                }
            }

            @keyframes sparkleFade {
                0% {
                    opacity: 0;
                    transform: scale(0);
                }
                20% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.3) translateY(-30px);
                }
            }

            /* Smooth scrollbar styling */
            .creature-index {
                scrollbar-width: thin;
                scrollbar-color: var(--color-ink-faded) transparent;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    /* =========================================================
       RUN ON DOM READY
       ========================================================= */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectCustomAnimations();
            init();
        });
    } else {
        injectCustomAnimations();
        init();
    }

})();
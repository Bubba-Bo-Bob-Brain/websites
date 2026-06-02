/* ============================================
   THE PLAGUE CODEX — SCRIPTS
   Immersive Interactivity & Ambient Effects
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       1. BODY LOADED — Fade in fog layers
       ---------------------------------------- */
    document.body.classList.add('loaded');

    /* ----------------------------------------
       2. EMBER PARTICLE SYSTEM
       ---------------------------------------- */
    function createEmbers() {
        const container = document.querySelector('.ember-container');
        if (!container) return;

        const emberCount = 25;

        for (let i = 0; i < emberCount; i++) {
            const ember = document.createElement('div');
            ember.classList.add('ember');

            const leftPos = Math.random() * 100;
            const duration = 12 + Math.random() * 18;
            const delay = Math.random() * 20;
            const size = 2 + Math.random() * 3;
            const driftX = -30 + Math.random() * 60;

            ember.style.left = leftPos + '%';
            ember.style.width = size + 'px';
            ember.style.height = size + 'px';
            ember.style.animationDuration = duration + 's';
            ember.style.animationDelay = delay + 's';
            ember.style.setProperty('--drift-x', driftX + 'px');

            const brightness = 0.5 + Math.random() * 0.5;
            ember.style.opacity = brightness;

            container.appendChild(ember);
        }
    }

    createEmbers();

    /* ----------------------------------------
       3. STAT BAR ANIMATION ON SCROLL
       ---------------------------------------- */
    function initStatBarAnimations() {
        const statFills = document.querySelectorAll('.stat-fill');

        if (!('IntersectionObserver' in window)) {
            statFills.forEach(function (fill) {
                const value = fill.getAttribute('data-value');
                if (value) {
                    fill.style.width = value + '%';
                }
            });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const value = fill.getAttribute('data-value');
                    if (value) {
                        fill.style.width = value + '%';
                    }
                    observer.unobserve(fill);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        statFills.forEach(function (fill) {
            observer.observe(fill);
        });
    }

    initStatBarAnimations();

    /* ----------------------------------------
       4. CHARACTER FILTERING SYSTEM
       ---------------------------------------- */
    function initFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.character-card');
        const countNumber = document.querySelector('.count-number');

        let currentClassFilter = 'all';
        let currentAlignmentFilter = null;

        function getFilterType(filterValue) {
            const classFilters = ['all', 'peasant', 'clergy', 'noble', 'outcast'];
            if (classFilters.includes(filterValue)) {
                return 'class';
            }
            return 'alignment';
        }

        function applyFilters() {
            let visibleCount = 0;

            cards.forEach(function (card) {
                const cardClass = card.getAttribute('data-class');
                const cardAlignment = card.getAttribute('data-alignment');

                let classMatch = (currentClassFilter === 'all' || cardClass === currentClassFilter);
                let alignmentMatch = (!currentAlignmentFilter || cardAlignment === currentAlignmentFilter);

                if (classMatch && alignmentMatch) {
                    card.classList.remove('card-hidden');
                    card.classList.add('card-visible');
                    visibleCount++;
                } else {
                    card.classList.add('card-hidden');
                    card.classList.remove('card-visible');
                }
            });

            if (countNumber) {
                animateCountNumber(countNumber, visibleCount);
            }

            if (visibleCount === 0) {
                showNoResultsMessage();
            } else {
                hideNoResultsMessage();
            }
        }

        function animateCountNumber(element, targetValue) {
            const currentValue = parseInt(element.textContent, 10) || 0;
            if (currentValue === targetValue) return;

            const duration = 400;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const displayValue = Math.round(currentValue + (targetValue - currentValue) * eased);

                element.textContent = displayValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }

            requestAnimationFrame(updateCount);
        }

        let noResultsEl = null;

        function showNoResultsMessage() {
            if (noResultsEl) {
                noResultsEl.style.display = 'block';
                return;
            }

            const grid = document.querySelector('.gallery-grid');
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'no-results-message';
            noResultsEl.innerHTML =
                '<div class="no-results-icon">💀</div>' +
                '<div class="no-results-text">No souls match your inquiry...</div>' +
                '<div class="no-results-subtext">The plague takes all in time. Try another filter.</div>';
            grid.appendChild(noResultsEl);
        }

        function hideNoResultsMessage() {
            if (noResultsEl) {
                noResultsEl.style.display = 'none';
            }
        }

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const filterValue = this.getAttribute('data-filter');
                const filterType = getFilterType(filterValue);

                if (filterType === 'class') {
                    filterButtons.forEach(function (btn) {
                        const btnFilter = btn.getAttribute('data-filter');
                        if (getFilterType(btnFilter) === 'class') {
                            btn.classList.remove('active');
                            btn.setAttribute('aria-pressed', 'false');
                        }
                    });

                    this.classList.add('active');
                    this.setAttribute('aria-pressed', 'true');
                    currentClassFilter = filterValue;
                } else {
                    if (this.classList.contains('active')) {
                        this.classList.remove('active');
                        this.setAttribute('aria-pressed', 'false');
                        currentAlignmentFilter = null;
                    } else {
                        filterButtons.forEach(function (btn) {
                            const btnFilter = btn.getAttribute('data-filter');
                            if (getFilterType(btnFilter) === 'alignment') {
                                btn.classList.remove('active');
                                btn.setAttribute('aria-pressed', 'false');
                            }
                        });

                        this.classList.add('active');
                        this.setAttribute('aria-pressed', 'true');
                        currentAlignmentFilter = filterValue;
                    }
                }

                applyFilters();
            });
        });
    }

    initFiltering();

    /* ----------------------------------------
       5. CARD HOVER DETAIL REVEAL
       ---------------------------------------- */
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.character-card');

        cards.forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                this.style.zIndex = '20';
            });

            card.addEventListener('mouseleave', function () {
                this.style.zIndex = '';
            });
        });
    }

    initCardHoverEffects();

    /* ----------------------------------------
       6. PARALLAX FOG ON MOUSE MOVE
       ---------------------------------------- */
    function initFogParallax() {
        const fogLayers = document.querySelectorAll('.fog');

        if (fogLayers.length === 0) return;

        let ticking = false;

        document.addEventListener('mousemove', function (event) {
            if (!ticking) {
                requestAnimationFrame(function () {
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    const offsetX = (event.clientX - centerX) / centerX;
                    const offsetY = (event.clientY - centerY) / centerY;

                    fogLayers.forEach(function (layer, index) {
                        const depth = (index + 1) * 0.3;
                        const moveX = offsetX * depth * 8;
                        const moveY = offsetY * depth * 5;

                        layer.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
                    });

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    initFogParallax();

    /* ----------------------------------------
       7. SCROLL-TRIGGERED HEADER EFFECT
       ---------------------------------------- */
    function initHeaderScrollEffect() {
        const header = document.querySelector('.codex-header');
        if (!header) return;

        let lastScrollY = 0;
        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    const scrollY = window.scrollY;
                    const headerRect = header.getBoundingClientRect();
                    const headerBottom = headerRect.bottom;

                    if (headerBottom > 0) {
                        const opacity = Math.max(0, Math.min(1, headerBottom / headerRect.height));
                        const scale = 0.95 + opacity * 0.05;

                        header.style.opacity = opacity;
                        header.style.transform = 'scale(' + scale + ')';
                    } else {
                        header.style.opacity = '0';
                    }

                    lastScrollY = scrollY;
                    ticking = false;
                });

                ticking = true;
            }
        }, { passive: true });
    }

    initHeaderScrollEffect();

    /* ----------------------------------------
       8. DYNAMIC PLAGUE COUNT IN HEADER
       ---------------------------------------- */
    function initPlagueYearTicker() {
        const yearElement = document.querySelector('.subtitle-above');
        if (!yearElement) return;

        const baseYear = 1348;
        let currentYear = baseYear;

        setInterval(function () {
            currentYear = baseYear + Math.floor(Math.random() * 3);
            yearElement.style.opacity = '0';

            setTimeout(function () {
                yearElement.textContent = 'Anno Domini ' + currentYear;
                yearElement.style.opacity = '1';
            }, 500);
        }, 8000);

        yearElement.style.transition = 'opacity 0.5s ease';
    }

    initPlagueYearTicker();

    /* ----------------------------------------
       9. KEYBOARD SHORTCUTS
       ---------------------------------------- */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function (event) {
            const key = event.key.toLowerCase();

            if (key === 'escape') {
                const allSoulsBtn = document.querySelector('[data-filter="all"]');
                if (allSoulsBtn) {
                    allSoulsBtn.click();
                }

                document.querySelectorAll('.filter-btn[data-filter]').forEach(function (btn) {
                    const filterValue = btn.getAttribute('data-filter');
                    const classFilters = ['peasant', 'clergy', 'noble', 'outcast'];
                    const alignFilters = ['virtuous', 'neutral', 'ruthless'];

                    if (classFilters.includes(filterValue) || alignFilters.includes(filterValue)) {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    }
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    initKeyboardShortcuts();

    /* ----------------------------------------
       10. CARD CLICK — EXPAND DETAIL
       ---------------------------------------- */
    function initCardExpansion() {
        const cards = document.querySelectorAll('.character-card');

        cards.forEach(function (card) {
            card.addEventListener('click', function (event) {
                if (event.target.closest('.filter-btn')) return;

                const isAlreadyExpanded = this.classList.contains('card-expanded');

                cards.forEach(function (c) {
                    c.classList.remove('card-expanded');
                    c.style.transform = '';
                });

                if (!isAlreadyExpanded) {
                    this.classList.add('card-expanded');
                    this.style.transform = 'scale(1.02)';

                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });
    }

    initCardExpansion();

    /* ----------------------------------------
       11. SURVIVOR COUNT PULSE
       ---------------------------------------- */
    function initCountPulse() {
        const countEl = document.querySelector('.count-number');
        if (!countEl) return;

        setInterval(function () {
            countEl.style.transition = 'text-shadow 2s ease';
            countEl.style.textShadow = '0 0 15px rgba(212, 168, 67, 0.6)';

            setTimeout(function () {
                countEl.style.textShadow = 'none';
            }, 2000);
        }, 10000);
    }

    initCountPulse();

    /* ----------------------------------------
       12. DECORATIVE NO-RESULTS STYLES
       (injected dynamically)
       ---------------------------------------- */
    function injectNoResultsStyles() {
        const style = document.createElement('style');
        style.textContent = '.no-results-message{grid-column:1/-1;text-align:center;padding:4rem 2rem;background:rgba(26,20,16,0.6);border:1px solid rgba(184,146,46,0.15);border-radius:6px;}.no-results-icon{font-size:3rem;margin-bottom:1rem;animation:skullBreath 4s ease-in-out infinite;}.no-results-text{font-family:var(--font-display);font-size:1.4rem;color:var(--parchment-mid);margin-bottom:0.5rem;}.no-results-subtext{font-family:var(--font-body);font-size:0.78rem;color:var(--parchment-dark);font-style:italic;}';
        document.head.appendChild(style);
    }

    injectNoResultsStyles();

})();
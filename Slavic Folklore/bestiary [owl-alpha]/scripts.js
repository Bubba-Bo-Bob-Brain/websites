/* ============================================
   ТВАРОГА — Bestiary of Slavic Lore
   Scripts: Bringing the Grimoire to Life
   ============================================ */

(function () {
    'use strict';

    /* === Ember Particle System === */
    function createEmberParticle() {
        const container = document.getElementById('emberParticles');
        if (!container) return;

        const ember = document.createElement('div');
        ember.classList.add('ember');

        const startX = Math.random() * 100;
        const drift = (Math.random() * 60 - 30) + 'px';
        const duration = 6 + Math.random() * 8;
        const delay = Math.random() * 2;
        const size = 2 + Math.random() * 3;

        ember.style.left = startX + '%';
        ember.style.bottom = '-10px';
        ember.style.width = size + 'px';
        ember.style.height = size + 'px';
        ember.style.setProperty('--drift', drift);
        ember.style.animationDuration = duration + 's';
        ember.style.animationDelay = delay + 's';

        container.appendChild(ember);

        ember.addEventListener('animationend', function () {
            ember.remove();
        });
    }

    function initEmberSystem() {
        for (let i = 0; i < 8; i++) {
            setTimeout(createEmberParticle, i * 400);
        }

        setInterval(function () {
            const activeEmbers = document.querySelectorAll('.ember').length;
            if (activeEmbers < 12) {
                createEmberParticle();
            }
        }, 800);
    }

    /* === Leaf Particle System === */
    function createLeafParticle() {
        const container = document.getElementById('leafParticles');
        if (!container) return;

        const leaf = document.createElement('div');
        leaf.classList.add('leaf');

        const startX = Math.random() * 100;
        const duration = 10 + Math.random() * 8;
        const delay = Math.random() * 3;
        const size = 8 + Math.random() * 8;
        const rotation = Math.random() * 360;

        leaf.style.left = startX + '%';
        leaf.style.top = '-20px';
        leaf.style.width = size + 'px';
        leaf.style.height = size * 0.67 + 'px';
        leaf.style.borderRadius = '0 50% 50% 50%';
        leaf.style.transform = 'rotate(' + rotation + 'deg)';
        leaf.style.animationDuration = duration + 's';
        leaf.style.animationDelay = delay + 's';

        const colors = ['#2d4a2d', '#3a5a3a', '#1a3a1a', '#4a6a4a', '#2a4a2a'];
        leaf.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(leaf);

        leaf.addEventListener('animationend', function () {
            leaf.remove();
        });
    }

    function initLeafSystem() {
        for (let i = 0; i < 4; i++) {
            setTimeout(createLeafParticle, i * 1500);
        }

        setInterval(function () {
            const activeLeaves = document.querySelectorAll('.leaf').length;
            if (activeLeaves < 6) {
                createLeafParticle();
            }
        }, 2500);
    }

    /* === Creature Filtering System === */
    function initFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const creatureEntries = document.querySelectorAll('.creature-entry');

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');

                filterButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });

                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');

                creatureEntries.forEach(function (entry) {
                    const habitats = entry.getAttribute('data-habitat');
                    const matches = filter === 'all' || habitats.indexOf(filter) !== -1;

                    if (matches) {
                        entry.classList.remove('hidden');
                        entry.classList.remove('fade-out');
                        entry.classList.add('fade-in');
                    } else {
                        entry.classList.add('fade-out');
                        entry.classList.remove('fade-in');

                        setTimeout(function () {
                            if (entry.classList.contains('fade-out')) {
                                entry.classList.add('hidden');
                            }
                        }, 500);
                    }
                });

                const visibleCount = document.querySelectorAll('.creature-entry:not(.hidden)').length;
                announceFilterResult(filter, visibleCount);
            });
        });
    }

    function announceFilterResult(filter, count) {
        let announcement = document.getElementById('filter-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'filter-announcement';
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.style.position = 'absolute';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.style.clip = 'rect(0, 0, 0, 0)';
            announcement.style.whiteSpace = 'nowrap';
            announcement.style.border = '0';
            announcement.style.padding = '0';
            announcement.style.margin = '-1px';
            document.body.appendChild(announcement);
        }

        const filterLabel = filter === 'all' ? 'all creatures' : filter + ' creatures';
        announcement.textContent = 'Showing ' + count + ' ' + filterLabel;
    }

    /* === Scroll-Triggered Reveal Animation === */
    function initScrollReveal() {
        const entries = document.querySelectorAll('.creature-entry');

        if (!('IntersectionObserver' in window)) {
            entries.forEach(function (entry) {
                entry.classList.add('is-visible');
            });
            return;
        }

        const observer = new IntersectionObserver(function (observed) {
            observed.forEach(function (item) {
                if (item.isIntersecting) {
                    item.target.classList.add('is-visible');
                    observer.unobserve(item.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        entries.forEach(function (entry) {
            observer.observe(entry);
        });
    }

    /* === Danger Rating Hover Effect === */
    function initDangerRatings() {
        const dangerSymbols = document.querySelectorAll('.danger-symbol');

        dangerSymbols.forEach(function (symbol) {
            symbol.addEventListener('mouseenter', function () {
                const level = this.getAttribute('data-level');
                const labels = {
                    '1': 'Harmless — No danger to the cautious traveler',
                    '2': 'Caution — Exercise care and respect',
                    '3': 'Dangerous — Significant threat to life and limb',
                    '4': 'Lethal — Death is the likely outcome',
                    '5': 'Doom — Turn back. There is no survival.'
                };

                this.setAttribute('title', labels[level] || '');
            });
        });
    }

    /* === Smooth Scroll for Navigation === */
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const targetId = target.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerOffset = 40;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
        });
    }

    /* === Hearth Glow Intensity Based on Scroll === */
    function initScrollGlow() {
        const glowElements = document.querySelectorAll('.glow-left, .glow-right, .glow-top, .glow-bottom');

        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
                    const intensity = 0.6 + Math.sin(scrollPercent * Math.PI * 2) * 0.3;

                    glowElements.forEach(function (el) {
                        el.style.opacity = intensity;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* === Creature Entry Expand/Collapse for Detail Sections === */
    function initDetailSections() {
        const detailSections = document.querySelectorAll('.detail-section');

        detailSections.forEach(function (section) {
            const title = section.querySelector('.detail-title');
            if (!title) return;

            title.style.cursor = 'pointer';
            title.setAttribute('role', 'button');
            title.setAttribute('tabindex', '0');
            title.setAttribute('aria-expanded', 'true');

            const content = section.querySelectorAll('p, blockquote');
            content.forEach(function (el) {
                el.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease';
            });

            function toggleSection() {
                const isExpanded = title.getAttribute('aria-expanded') === 'true';

                title.setAttribute('aria-expanded', !isExpanded);

                content.forEach(function (el) {
                    if (isExpanded) {
                        el.style.maxHeight = '0';
                        el.style.opacity = '0';
                        el.style.overflow = 'hidden';
                        el.style.paddingTop = '0';
                        el.style.paddingBottom = '0';
                        el.style.marginTop = '0';
                        el.style.marginBottom = '0';
                    } else {
                        el.style.maxHeight = '500px';
                        el.style.opacity = '1';
                        el.style.overflow = 'visible';
                        el.style.paddingTop = '';
                        el.style.paddingBottom = '';
                        el.style.marginTop = '';
                        el.style.marginBottom = '';
                    }
                });
            }

            title.addEventListener('click', toggleSection);
            title.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection();
                }
            });
        });
    }

    /* === Typing Effect for Book Title on Load === */
    function initTitleReveal() {
        const cyrillicTitle = document.querySelector('.title-cyrillic');
        if (!cyrillicTitle) return;

        const originalText = cyrillicTitle.textContent;
        cyrillicTitle.textContent = '';

        let charIndex = 0;

        function typeChar() {
            if (charIndex < originalText.length) {
                cyrillicTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 120);
            }
        }

        setTimeout(typeChar, 300);
    }

    /* === Parallax Effect for Canopy Overlay === */
    function initCanopyParallax() {
        const canopy = document.querySelector('.canopy-overlay');
        if (!canopy) return;

        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    const scrollY = window.pageYOffset;
                    const offset = scrollY * 0.15;
                    canopy.style.transform = 'translateY(' + offset + 'px)';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* === Keyboard Navigation Enhancement === */
    function initKeyboardNav() {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const allButtons = document.querySelectorAll('.filter-btn');
                allButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });

                const allButton = document.querySelector('.filter-btn[data-filter="all"]');
                if (allButton) {
                    allButton.classList.add('active');
                    allButton.setAttribute('aria-pressed', 'true');
                }

                const creatureEntries = document.querySelectorAll('.creature-entry');
                creatureEntries.forEach(function (entry) {
                    entry.classList.remove('hidden', 'fade-out');
                    entry.classList.add('fade-in');
                });

                announceFilterResult('all', creatureEntries.length);
            }
        });
    }

    /* === Add Staggered Animation Delays === */
    function initStaggeredAnimations() {
        const entries = document.querySelectorAll('.creature-entry');
        entries.forEach(function (entry, index) {
            entry.style.animationDelay = (index * 0.1) + 's';
        });
    }

    /* === Page Load Progress Indicator === */
    function initLoadProgress() {
        const bookContainer = document.querySelector('.book-container');
        if (!bookContainer) return;

        bookContainer.style.opacity = '0';
        bookContainer.style.transform = 'translateY(20px)';
        bookContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        window.addEventListener('load', function () {
            setTimeout(function () {
                bookContainer.style.opacity = '1';
                bookContainer.style.transform = 'translateY(0)';
            }, 100);
        });

        setTimeout(function () {
            bookContainer.style.opacity = '1';
            bookContainer.style.transform = 'translateY(0)';
        }, 500);
    }

    /* === Initialize Everything === */
    function init() {
        initLoadProgress();
        initTitleReveal();
        initEmberSystem();
        initLeafSystem();
        initFiltering();
        initScrollReveal();
        initDangerRatings();
        initSmoothScroll();
        initScrollGlow();
        initDetailSections();
        initCanopyParallax();
        initKeyboardNav();
        initStaggeredAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
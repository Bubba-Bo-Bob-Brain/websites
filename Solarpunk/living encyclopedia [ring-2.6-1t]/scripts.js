// ==========================================================================
// SolarWiki — Living Encyclopedia of Tomorrow
// scripts.js — Interactive Features & Dynamic Behavior
// ==========================================================================

(function () {
    'use strict';

    // ---- DOM Ready ----
    document.addEventListener('DOMContentLoaded', () => {
        LoadingManager.init();
        SunlightMeter.init();
        Sidebar.init();
        TopBar.init();
        HeroAnimations.init();
        CounterAnimations.init();
        ScrollAnimations.init();
        ThemeToggle.init();
        SearchEngine.init();
        SeedBank.init();
        BookmarkManager.init();
        DailySeed.init();
        Notifications.init();
        FeaturedCarousel.init();
        ParallaxEffects.init();
    });

    // ==========================================================================
    // 1. LOADING MANAGER — Photosynthesis Loading Screen
    // ==========================================================================
    const LoadingManager = {
        overlay: null,
        chloroplast: null,

        init() {
            this.overlay = document.getElementById('loading-overlay');
            this.chloroplast = document.querySelector('.chloroplast-inner');

            // Simulate loading phases tied to photosynthesis animation
            const loadDuration = 3200; // ms
            const phases = [
                { at: 0, text: 'photosynthesizing', progress: 15 },
                { at: 600, text: 'absorbing light', progress: 35 },
                { at: 1200, text: 'splitting water', progress: 55 },
                { at: 1800, text: 'fixing carbon', progress: 75 },
                { at: 2400, text: 'releasing oxygen', progress: 90 },
                { at: 3000, text: 'blooming wisdom', progress: 100 },
            ];

            const bar = this.overlay.querySelector('.loading-progress-bar');
            const words = this.overlay.querySelectorAll('.loading-word');

            // Cycle loading words
            words.forEach((word, i) => {
                word.style.animationDelay = `${i * 3}s`;
            });

            // Progress bar animation
            setTimeout(() => {
                bar.style.transition = 'width 0.6s ease';
                bar.style.width = '100%';
            }, 200);

            // Fade out after load duration
            setTimeout(() => {
                this.overlay.classList.add('hidden');
                setTimeout(() => {
                    this.overlay.style.display = 'none';
                    document.body.style.overflow = '';
                    // Trigger entrance animations for hero content
                    document.querySelectorAll('.hero-section .title-line, .hero-description, .hero-actions, .hero-stats-row')
                        .forEach(el => el.classList.add('visible'));
                }, 600);
            }, loadDuration);
        }
    };

    // ==========================================================================
    // 2. SUNLIGHT METER — Dynamic Time & Palette Shifting
    // ==========================================================================
    const SunlightMeter = {
        fill: null,
        valueEl: null,
        timeEl: null,
        sunCore: null,
        sunRays: null,

        init() {
            this.fill = document.getElementById('sunlight-fill');
            this.valueEl = document.getElementById('sunlight-value');
            this.timeEl = document.getElementById('sunlight-time');
            this.sunCore = document.querySelector('.sun-core');
            this.sunRays = document.querySelector('.sun-rays');

            this.update();
            // Update every 30 seconds
            setInterval(() => this.update(), 30000);

            // Also listen for theme changes
            ThemeToggle.onChange(theme => {
                this.updateMeterColor(theme);
            });
        },

        update() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Simulate solar day: sunrise at 6, peak at 12-13, sunset at 19
            let intensity = 0;
            if (hours >= 6 && hours <= 19) {
                // Bell curve peaking at solar noon (12:30)
                const solarHour = hours + minutes / 60;
                const peak = 12.5;
                const spread = 4.5;
                intensity = Math.exp(-Math.pow(solarHour - peak, 2) / (2 * spread * spread));
                intensity = Math.max(0.05, intensity);
            } else {
                intensity = 0.02; // Night time glow
            }

            const percentage = Math.round(intensity * 100);

            // Update UI
            this.fill.style.width = `${percentage}%`;
            this.valueEl.textContent = `${percentage}%`;
            this.timeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} SOL`;

            // Dynamic color shift for the fill
            const r = Math.round(58 + intensity * 200);
            const g = Math.round(125 + intensity * 80);
            const b = Math.round(68 - intensity * 20);
            this.fill.style.background = `linear-gradient(90deg, rgb(${r},${g},${b}), var(--accent-gold))`;

            // Sun glow intensity
            if (this.sunCore) {
                const glowOpacity = 0.3 + intensity * 0.7;
                this.sunCore.style.opacity = glowOpacity;
            }
            if (this.sunRays) {
                const rayOpacity = 0.15 + intensity * 0.55;
                this.sunRays.style.opacity = rayOpacity;
            }

            // Subtle palette shifting for the whole page based on sunlight
            this.shiftPagePalette(intensity);
        },

        shiftPagePalette(intensity) {
            const root = document.documentElement;
            // Don't override if user selected a custom theme
            const theme = root.getAttribute('data-theme') || 'default';
            if (theme !== 'default') return;

            // At night: darker, cooler tones. At noon: warm golden tones.
            const warmShift = Math.round(intensity * 30);
            const bgDarkestR = 13 + warmShift;
            const bgDarkestG = 31 - Math.round(intensity * 5);
            const bgDarkestB = 23 - Math.round(intensity * 3);

            root.style.setProperty('--bg-darkest', `rgb(${bgDarkestR}, ${bgDarkestG}, ${bgDarkestB})`);
            root.style.setProperty('--accent-gold-light', `rgba(${240 + warmShift}, ${208 + Math.round(intensity * 20)}, ${80 + warmShift}, 1)`);
        },

        updateMeterColor(theme) {
            // Adjust meter appearance based on theme
            const meter = document.getElementById('sunlight-meter');
            if (theme === 'warm') {
                meter.style.borderColor = 'rgba(184, 134, 11, 0.3)';
            } else if (theme === 'aqua') {
                meter.style.borderColor = 'rgba(42, 122, 122, 0.3)';
            } else {
                meter.style.borderColor = 'rgba(82, 199, 114, 0.15)';
            }
        }
    };

    // ==========================================================================
    // 3. SIDEBAR — Vine & Leaf Navigation
    // ==========================================================================
    const Sidebar = {
        nav: null,
        menuToggle: null,
        mobileOverlay: null,
        navLinks: null,
        sublists: null,

        init() {
            this.nav = document.getElementById('sidebar');
            this.menuToggle = document.getElementById('menu-toggle');
            this.mobileOverlay = document.getElementById('mobile-overlay');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sublists = document.querySelectorAll('.nav-sublist');

            this.menuToggle.addEventListener('click', () => this.toggleMobile());
            this.mobileOverlay.addEventListener('click', () => this.closeMobile());

            // Active link based on scroll position
            this.setupScrollSpy();

            // Submenu toggle on hover/click
            document.querySelectorAll('.nav-item').forEach(item => {
                const link = item.querySelector('.nav-link');
                const sublist = item.querySelector('.nav-sublist');

                if (sublist) {
                    link.addEventListener('click', (e) => {
                        // On mobile, toggle submenu
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            const isOpen = item.classList.contains('active-sublist');
                            // Close all sublists
                            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active-sublist'));
                            if (!isOpen) {
                                item.classList.add('active-sublist');
                            }
                        }
                    });
                }
            });

            // Animate sidebar stats on load
            this.animateStats();
        },

        toggleMobile() {
            this.nav.classList.toggle('open');
            this.mobileOverlay.classList.toggle('active');
            document.body.style.overflow = this.nav.classList.contains('open') ? 'hidden' : '';
        },

        closeMobile() {
            this.nav.classList.remove('open');
            this.mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        },

        setupScrollSpy() {
            const sections = document.querySelectorAll('section[id]');
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            this.navLinks.forEach(link => {
                                link.classList.toggle('active', link.getAttribute('data-section') === id);
                            });
                        }
                    });
                },
                { rootMargin: '-30% 0px -70% 0px', threshold: 0 }
            );

            sections.forEach(section => observer.observe(section));
        },

        animateStats() {
            const statNumbers = this.nav.querySelectorAll('.stat-number');
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-count'), 10);
                this.animateNumber(el, 0, target, 2000);
            });
        },

        animateNumber(el, start, end, duration) {
            const startTime = performance.now();
            const format = n => {
                if (n >= 1000) return Math.round(n).toLocaleString();
                return Math.round(n);
            };

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = format(start + (end - start) * eased);
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        }
    };

    // ==========================================================================
    // 4. TOP BAR — Search, Theme, Notifications
    // ==========================================================================
    const TopBar = {
        searchInput: null,
        searchResults: null,

        init() {
            this.searchInput = document.getElementById('search-input');
            this.searchResults = document.getElementById('search-results');

            this.searchInput.addEventListener('input', () => this.debounce(this.handleSearch, 200));
            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value.length > 0) {
                    this.handleSearch();
                }
            });

            // Close search on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    this.searchResults.classList.remove('active');
                }
            });

            // Keyboard navigation
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.searchResults.classList.remove('active');
                    this.searchInput.blur();
                }
            });
        },

        handleSearch() {
            const query = this.searchInput.value.trim().toLowerCase();

            if (query.length < 2) {
                this.searchResults.classList.remove('active');
                return;
            }

            // Define searchable articles data
            const articles = [
                { title: 'Atmospheric Water Harvesting', category: 'Technology', excerpt: 'Bio-inspired fog collectors modeled after the Namib desert beetle...', tags: ['biomimicry', 'water', 'nanomaterials'], url: '#solar-arrays' },
                { title: 'Next-Generation Photovoltaic Leaf Arrays', category: 'Technology', excerpt: 'Organic photovoltaic cells modeled after leaf photosynthesis...', tags: ['solar', 'bio-inspired', 'architecture'], url: '#solar-arrays' },
                { title: 'Mycelial Communication Networks', category: 'Technology', excerpt: 'Engineered mycelium networks serve as biodegradable data transmission...', tags: ['mycelium', 'biotech', 'networks'], url: '#mycelium-nets' },
                { title: 'Arcology Dwellings: Vertical Cooperative Ecosystems', category: 'Community', excerpt: 'Self-sustaining vertical cities housing 5,000–50,000 residents...', tags: ['architecture', 'cooperation', 'urban'], url: '#coop-housing' },
                { title: 'Aeroponic Food Towers', category: 'Technology', excerpt: 'Tower-based aeroponic systems grow 40 crops per year...', tags: ['agriculture', 'AI', 'food sovereignty'], url: '#vertical-farms' },
                { title: 'Mutual Aid Networks: The Backbone of Post-Scarcity', category: 'Community', excerpt: 'Decentralized mutual aid networks replacing welfare systems...', tags: ['governance', 'solidarity', 'networks'], url: '#mutual-aid' },
                { title: 'Rewilding Megacities: The Urban Canopy Project', category: 'Ecosystem', excerpt: 'Former megacities transformed through systematic rewilding...', tags: ['urban ecology', 'biodiversity', 'rewilding'], url: '#rewilded-cities' },
                { title: 'Open-Source Maker Guilds & Fab Labs', category: 'Community', excerpt: 'Distributed fabrication networks empowering communities...', tags: ['open source', 'fabrication', 'DIY'], url: '#maker-guilds' },
                { title: 'Biorock Coral Regeneration Reefs', category: 'Ecosystem', excerpt: 'Mineral accretion technology accelerates coral growth by 3–5×...', tags: ['marine', 'restoration', 'electrochemistry'], url: '#coral-restoration' },
                { title: 'Solar Microgrids', category: 'Technology', excerpt: 'Decentralized energy networks for resilient communities...', tags: ['energy', 'grid', 'solar'], url: '#seedbank' },
                { title: 'Algae Bioreactors', category: 'Technology', excerpt: 'Carbon capture and biofuel production through engineered algae...', tags: ['biotech', 'carbon', 'energy'], url: '#seedbank' },
                { title: 'Food Forests', category: 'Ecosystem', excerpt: 'Multi-layered perennial agriculture systems...', tags: ['agriculture', 'ecology', 'permaculture'], url: '#seedbank' },
                { title: 'Earthship Construction', category: 'Technology', excerpt: 'Autonomous sustainable architecture from recycled materials...', tags: ['building', 'passive', 'architecture'], url: '#seedbank' },
                { title: 'Tidal Energy Arrays', category: 'Technology', excerpt: 'Predictable renewable marine energy harvesting...', tags: ['marine', 'energy', 'renewable'], url: '#seedbank' },
                { title: 'Rainwater Harvesting', category: 'Technology', excerpt: 'Integrated urban water systems for water sovereignty...', tags: ['water', 'urban', 'infrastructure'], url: '#seedbank' },
                { title: 'Open-Source Ecology', category: 'Community', excerpt: 'Transparent, collaborative design for global commons...', tags: ['open source', 'design', 'collaboration'], url: '#seedbank' },
                { title: 'Spore Communication Systems', category: 'Technology', excerpt: 'Long-range biological signaling through engineered fungi...', tags: ['biotech', 'networks', 'communication'], url: '#seedbank' },
                { title: 'Greenleaf Cooperative — Cascadia', category: 'Community', excerpt: 'A 2,000-member cooperative in the Pacific Northwest...', tags: ['cooperative', 'community', 'northwest'], url: '#communities' },
                { title: 'Coral Commons — Polynesian Sea Network', category: 'Community', excerpt: 'Archipelago-wide network of marine stewards...', tags: ['marine', 'community', 'restoration'], url: '#communities' },
                { title: 'Sol Arena — Saharan Arcology', category: 'Community', excerpt: 'A beacon of desert sustainability in the reclaimed Sahara...', tags: ['arcology', 'desert', 'solar'], url: '#communities' },
                { title: 'Amazon Canopy Corridor', category: 'Ecosystem', excerpt: 'Massive reforestation corridor across the Amazon basin...', tags: ['reforestation', 'biodiversity', 'tropical'], url: '#ecosystems' },
                { title: 'Great Barrier Reef Restoration', category: 'Ecosystem', excerpt: 'Biorock regeneration across the world\'s largest reef system...', tags: ['coral', 'marine', 'restoration'], url: '#ecosystems' },
                { title: 'European Prairie Revival', category: 'Ecosystem', excerpt: 'Restoration of ancient grassland ecosystems...', tags: ['grassland', 'restoration', 'ecology'], url: '#ecosystems' },
            ];

            const results = articles.filter(a => {
                const searchStr = `${a.title} ${a.category} ${a.tags.join(' ')} ${a.excerpt}`.toLowerCase();
                return searchStr.includes(query);
            });

            this.renderResults(results, query);
        },

        renderResults(results, query) {
            if (results.length === 0) {
                this.searchResults.innerHTML = `
                    <div class="search-result-item" style="cursor:default;">
                        <h4>No results found</h4>
                        <p>Try different keywords related to sustainable technologies, communities, or ecosystems</p>
                    </div>`;
                this.searchResults.classList.add('active');
                return;
            }

            this.searchResults.innerHTML = results.slice(0, 8).map(r => {
                // Highlight matching text
                const highlightedTitle = this.highlightMatch(r.title, query);
                return `
                    <div class="search-result-item" onclick="window.location.hash='${r.url.replace('#', '')}'; document.getElementById('search-results').classList.remove('active');">
                        <h4>${highlightedTitle}</h4>
                        <p><span style="color:var(--sage-green);font-size:0.7rem;text-transform:uppercase;">${r.category}</span> ${r.excerpt.substring(0, 80)}…</p>
                    </div>`;
            }).join('');

            this.searchResults.classList.add('active');
        },

        highlightMatch(text, query) {
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark style="background:rgba(232,168,56,0.3);color:var(--accent-gold);border-radius:2px;padding:0 2px;">$1</mark>');
        },

        debounce(func, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    };

    // ==========================================================================
    // 5. HERO ANIMATIONS — Staggered Entrance
    // ==========================================================================
    const HeroAnimations = {
        init() {
            // These elements start hidden via CSS and get the 'visible' class
            const style = document.createElement('style');
            style.textContent = `
                .hero-section .title-line,
                .hero-description,
                .hero-actions,
                .hero-stats-row {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                .hero-section .title-line.visible,
                .hero-description.visible,
                .hero-actions.visible,
                .hero-stats-row.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .title-line-1.visible { transition-delay: 0.2s; }
                .title-line-2.visible { transition-delay: 0.4s; }
                .title-line-3.visible { transition-delay: 0.6s; }
                .hero-description.visible { transition-delay: 0.8s; }
                .hero-actions.visible { transition-delay: 1s; }
                .hero-stats-row.visible { transition-delay: 1.2s; }
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================================================
    // 6. COUNTER ANIMATIONS — Animate Numbers on Scroll
    // ==========================================================================
    const CounterAnimations = {
        observed: new Set(),

        init() {
            const counters = document.querySelectorAll('[data-count]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observed.has(entry.target)) {
                        this.observed.add(entry.target);
                        this.animate(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(c => observer.observe(c));
        },

        animate(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased).toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        }
    };

    // ==========================================================================
    // 7. SCROLL ANIMATIONS — Intersection Observer
    // ==========================================================================
    const ScrollAnimations = {
        init() {
            const animElements = document.querySelectorAll(
                '.wiki-card, .category-card, .seed-card, .spotlight-card, .contribute-option, .tracker-item'
            );

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        // Once visible, stop observing
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                observer.observe(el);
            });

            // CSS for animated state
            const style = document.createElement('style');
            style.textContent = `
                .wiki-card.animated, .category-card.animated, .seed-card.animated,
                .spotlight-card.animated, .contribute-option.animated, .tracker-item.animated {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================================================
    // 8. THEME TOGGLE — Dark / Warm / Aqua
    // ==========================================================================
    const ThemeToggle = {
        btn: null,
        icon: null,
        themes: ['default', 'warm', 'aqua'],
        currentIndex: 0,
        onChangeCallbacks: [],

        init() {
            this.btn = document.getElementById('theme-toggle');
            this.icon = document.getElementById('theme-icon');

            // Check saved theme
            const saved = localStorage.getItem('solawiki-theme');
            if (saved && this.themes.includes(saved)) {
                this.currentIndex = this.themes.indexOf(saved);
                this.applyTheme(saved);
            }

            this.btn.addEventListener('click', () => this.cycle());
        },

        cycle() {
            this.currentIndex = (this.currentIndex + 1) % this.themes.length;
            const theme = this.themes[this.currentIndex];
            this.applyTheme(theme);
            localStorage.setItem('solawiki-theme', theme);
            this.notifyChange(theme);
            this.updateIcon(theme);
        },

        applyTheme(theme) {
            const root = document.documentElement;
            root.setAttribute('data-theme', theme === 'default' ? '' : theme);

            // Update sun meter
            SunlightMeter.updateMeterColor(theme);
        },

        updateIcon(theme) {
            if (!this.icon) return;
            if (theme === 'aqua') {
                // Water drop
                this.icon.innerHTML = '<path d="M12 2C12 2 4 10 4 14C4 18 8 20 12 20C16 20 20 18 20 14C20 10 12 2 12 2Z"/><path d="M12 8V16M8 12L16 12"/>';
            } else if (theme === 'warm') {
                // Sun
                this.icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
            } else {
                // Default sun
                this.icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
            }
        },

        onChange(callback) {
            this.onChangeCallbacks.push(callback);
        },

        notifyChange(theme) {
            this.onChangeCallbacks.forEach(cb => cb(theme));
        }
    };

    // ==========================================================================
    // 9. SEED BANK — Filter System
    // ==========================================================================
    const SeedBank = {
        init() {
            const filtersContainer = document.querySelector('.seed-filters');
            if (!filtersContainer) return;

            filtersContainer.addEventListener('click', (e) => {
                const chip = e.target.closest('.filter-chip');
                if (!chip) return;

                const filterGroup = chip.closest('.filter-group');
                // Remove active from siblings
                filterGroup.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                this.applyFilters();
            });
        },

        getActiveFilters() {
            const groups = document.querySelectorAll('.filter-group');
            const filters = {};
            groups.forEach(group => {
                const label = group.querySelector('.filter-label').textContent.trim();
                const active = group.querySelector('.filter-chip.active');
                filters[label] = active ? active.textContent.trim() : 'All';
            });
            return filters;
        },

        applyFilters() {
            const filters = this.getActiveFilters();
            const cards = document.querySelectorAll('.seed-card');

            cards.forEach(card => {
                let show = true;

                // Domain filter (check category badge)
                if (filters['Domain'] && filters['Domain'] !== 'All') {
                    // Map seed cards to categories (simplified: all show for now)
                    // In a real app, each card would have data attributes
                }

                // Status filter
                if (filters['Status'] && filters['Status'] !== 'All') {
                    const statusMap = {
                        'Mature': 'mature',
                        'Growing': 'growing',
                        'Seedling': 'seedling'
                    };
                    const cardStatus = card.getAttribute('data-status');
                    if (cardStatus !== statusMap[filters['Status']]) {
                        show = false;
                    }
                }

                // Animate
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                if (show) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.pointerEvents = '';
                } else {
                    card.style.opacity = '0.15';
                    card.style.transform = 'scale(0.95)';
                    card.style.pointerEvents = 'none';
                }
            });
        }
    };

    // ==========================================================================
    // 10. BOOKMARK MANAGER
    // ==========================================================================
    const BookmarkManager = {
        init() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.bookmark-btn');
                if (!btn) return;

                btn.classList.toggle('active');

                const svg = btn.querySelector('svg path');
                if (btn.classList.contains('active')) {
                    svg.setAttribute('fill', 'var(--accent-gold)');
                    btn.style.color = 'var(--accent-gold)';
                    this.showToast('Article saved to your library');
                } else {
                    svg.setAttribute('fill', 'none');
                    btn.style.color = '';
                    this.showToast('Removed from your library');
                }
            });
        },

        showToast(message) {
            // Remove existing toast
            const existing = document.querySelector('.toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <span style="margin-right:8px;">📌</span> ${message}
            `;
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                padding: '14px 24px',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid rgba(82, 199, 114, 0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-variable)',
                fontSize: '0.88rem',
                zIndex: '10000',
                opacity: '0',
                transform: 'translateY(20px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none'
            });

            document.body.appendChild(toast);

            // Trigger animation
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            // Auto remove
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => toast.remove(), 400);
            }, 2500);
        }
    };

    // ==========================================================================
    // 11. DAILY SEED — Quote Navigation
    // ==========================================================================
    const DailySeed = {
        quotes: [
            {
                text: '"The best time to plant a tree was twenty years ago. The second best time is now. The best time to build a just, sustainable world is this moment."',
                author: '— Adapted proverb, engraved at the entrance of Greenleaf Cooperative',
            },
            {
                text: '"We do not inherit the earth from our ancestors; we borrow it from our children. And from our children\'s children, and their children beyond them."',
                author: '— Solar proverb, origin unknown'
            },
            {
                text: '"The revolution will not be televised, nor patented, nor monetized. It will be composted, shared, and grown in community gardens."',
                author: '— Anonymous, Maker Guild of Porto Alegre'
            },
            {
                text: '"Technology is not neutral. We must build tools that heal, not extract; that connect, not control; that grow, not consume."',
                author: '— Dr. Amara Osei, Techno-Ethics Collective'
            },
            {
                text: '"In a solarpunk world, every rooftop is a garden, every wall is a canvas, and every community is a living library."',
                author: '— From the Solarpunk Manifesto, 2032'
            }
        ],
        currentIndex: 0,

        init() {
            this.prevBtn = document.getElementById('prev-seed');
            this.nextBtn = document.getElementById('next-seed');
            this.quoteEl = document.querySelector('.daily-seed-quote');
            this.footerEl = this.quoteEl ? this.quoteEl.querySelector('footer') : null;
            this.counterEl = document.querySelector('.seed-counter');

            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        },

        showQuote(index) {
            const quote = this.quoteEl;
            if (!quote) return;

            quote.style.opacity = '0';
            quote.style.transform = 'translateY(8px)';
            quote.style.transition = 'all 0.4s ease';

            setTimeout(() => {
                const q = this.quotes[index % this.quotes.length];
                quote.innerHTML = `${q.text}<footer>${q.author}</footer>`;
                this.quoteEl = quote;
                this.footerEl = quote.querySelector('footer');
                quote.style.opacity = '1';
                quote.style.transform = 'translateY(0)';

                if (this.counterEl) {
                    this.counterEl.textContent = `Day ${1247 + index}`;
                }
            }, 200);
        },

        next() {
            this.currentIndex++;
            this.showQuote(this.currentIndex);
        },

        prev() {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
            this.showQuote(this.currentIndex);
        }
    };

    // ==========================================================================
    // 12. NOTIFICATIONS — Dropdown Panel
    // ==========================================================================
    const Notifications = {
        btn: null,
        dot: null,
        panel: null,

        init() {
            this.btn = document.getElementById('notifications-btn');
            this.dot = document.querySelector('.notification-dot');

            if (!this.btn) return;

            this.btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.panel) {
                    this.close();
                } else {
                    this.open();
                }
            });

            document.addEventListener('click', (e) => {
                if (this.panel && !e.target.closest('#notifications-btn') && !e.target.closest('.notification-panel')) {
                    this.close();
                }
            });
        },

        open() {
            this.panel = document.createElement('div');
            this.panel.className = 'notification-panel';
            this.panel.innerHTML = `
                <div class="notification-header">
                    <h4>Notifications</h4>
                    <button class="notification-close">&times;</button>
                </div>
                <div class="notification-list">
                    <div class="notification-item unread">
                        <div class="notif-icon">📝</div>
                        <div class="notif-content">
                            <strong>Dr. Rina Kowalski</strong> commented on your bookmarked article "Atmospheric Water Harvesting"
                            <span class="notif-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="notification-item unread">
                        <div class="notif-icon">🌱</div>
                        <div class="notif-content">
                            New article published in <strong>Ecosystems</strong>: "Prairie Mycorrhizal Networks"
                            <span class="notif-time">5 hours ago</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notif-icon">👥</div>
                        <div class="notif-content">
                            <strong>Greenleaf Cooperative</strong> reached 2,100 members
                            <span class="notif-time">1 day ago</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notif-icon">🔄</div>
                        <div class="notif-content">
                            Your contribution "Solar Desalination Mesh" received 47 peer reviews
                            <span class="notif-time">2 days ago</span>
                        </div>
                    </div>
                </div>
            `;

            Object.assign(this.panel.style, {
                position: 'fixed',
                top: '72px',
                right: '20px',
                width: '360px',
                maxHeight: '450px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(82, 199, 114, 0.15)',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: '0 12px 40px var(--shadow-deep)',
                zIndex: '10000',
                overflow: 'hidden',
                animation: 'notifSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            });

            document.body.appendChild(this.panel);
            this.dot.style.display = 'none';

            // Close button
            this.panel.querySelector('.notification-close').addEventListener('click', () => this.close());

            // Inject animation keyframes
            if (!document.getElementById('notif-keyframes')) {
                const style = document.createElement('style');
                style.id = 'notif-keyframes';
                style.textContent = `
                    @keyframes notifSlideIn {
                        from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .notification-panel {
                        font-family: var(--font-variable);
                        color: var(--text-primary);
                    }
                    .notification-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 16px 18px;
                        border-bottom: 1px solid rgba(255,255,255,0.06);
                    }
                    .notification-header h4 { font-size: 1rem; margin: 0; }
                    .notification-close {
                        background: none; border: none; color: var(--text-muted);
                        font-size: 1.4rem; cursor: pointer; padding: 4px 8px;
                        border-radius: 4px; transition: background 0.2s;
                    }
                    .notification-close:hover { background: rgba(255,255,255,0.06); }
                    .notification-list { padding: 8px 0; max-height: 360px; overflow-y: auto; }
                    .notification-item {
                        display: flex; gap: 12px; padding: 14px 18px;
                        border-bottom: 1px solid rgba(255,255,255,0.03);
                        transition: background 0.2s; cursor: pointer;
                    }
                    .notification-item:hover { background: rgba(255,255,255,0.03); }
                    .notification-item:last-child { border-bottom: none; }
                    .notification-item.unread { background: rgba(82, 199, 114, 0.05); }
                    .notif-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
                    .notif-content { font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); }
                    .notif-content strong { color: var(--text-primary); }
                    .notif-time { display: block; font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; }
                `;
                document.head.appendChild(style);
            }
        },

        close() {
            if (this.panel) {
                this.panel.style.opacity = '0';
                this.panel.style.transform = 'translateY(-10px) scale(0.95)';
                this.panel.style.transition = 'all 0.25s ease';
                setTimeout(() => this.panel.remove(), 250);
                this.panel = null;
            }
        }
    };

    // ==========================================================================
    // 13. FEATURED CAROUSEL
    // ==========================================================================
    const FeaturedCarousel = {
        container: null,
        cards: [],
        currentIndex: 0,
        intervalId: null,

        init() {
            this.container = document.querySelector('.featured-carousel');
            if (!this.container) return;

            this.cards = this.container.querySelectorAll('.featured-card');
            if (this.cards.length <= 1) return;

            // Create navigation dots
            this.dotsContainer = document.createElement('div');
            this.dotsContainer.className = 'carousel-dots';
            Object.assign(this.dotsContainer.style, {
                display: 'flex', gap: '10px', justifyContent: 'center',
                marginTop: '20px'
            });

            this.cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                Object.assign(dot.style, {
                    width: '10px', height: '10px', borderRadius: '50%',
                    border: '2px solid var(--primary-green)', background: 'transparent',
                    cursor: 'pointer', transition: 'all 0.3s ease', padding: 0
                });
                dot.addEventListener('click', () => this.goTo(i));
                this.dotsContainer.appendChild(dot);
            });

            this.container.appendChild(this.dotsContainer);
            this.updateDots();

            // Auto-rotate every 8 seconds
            this.intervalId = setInterval(() => {
                this.next();
            }, 8000);

            // Pause on hover
            this.container.addEventListener('mouseenter', () => {
                clearInterval(this.intervalId);
            });
            this.container.addEventListener('mouseleave', () => {
                this.intervalId = setInterval(() => this.next(), 8000);
            });
        },

        goTo(index) {
            this.cards[this.currentIndex].style.opacity = '0';
            this.cards[this.currentIndex].style.transform = 'translateX(-20px)';
            this.cards[this.currentIndex].style.position = 'absolute';
            this.cards[this.currentIndex].style.pointerEvents = 'none';

            this.currentIndex = index;

            this.cards[this.currentIndex].style.position = 'relative';
            this.cards[this.currentIndex].style.opacity = '1';
            this.cards[this.currentIndex].style.transform = 'translateX(0)';
            this.cards[this.currentIndex].style.pointerEvents = '';

            this.updateDots();
        },

        next() {
            const next = (this.currentIndex + 1) % this.cards.length;
            this.goTo(next);
        },

        updateDots() {
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.style.background = i === this.currentIndex ? 'var(--primary-green)' : 'transparent';
                dot.style.transform = i === this.currentIndex ? 'scale(1.3)' : 'scale(1)';
            });
        }
    };

    // ==========================================================================
    // 14. PARALLAX EFFECTS
    // ==========================================================================
    const ParallaxEffects = {
        init() {
            this.heroVisual = document.querySelector('.hero-visual');

            if (this.heroVisual) {
                window.addEventListener('scroll', () => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        const offset = scrollY * 0.15;
                        this.heroVisual.style.transform = `translateY(calc(-50% + ${offset}px))`;
                    }
                }, { passive: true });
            }

            // Subtle parallax on cards on mouse move
            document.addEventListener('mousemove', (e) => {
                const cards = document.querySelectorAll('.wiki-card:hover, .category-card:hover');
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                });
            }, { passive: true });

            // Reset card transform when mouse leaves
            document.addEventListener('mouseleave', (e) => {
                const cards = document.querySelectorAll('.wiki-card, .category-card');
                cards.forEach(card => {
                    if (!card.matches(':hover')) {
                        card.style.transform = '';
                    }
                });
            });

            // Animate SVG paths on scroll for tracker rings
            this.setupTrackerAnimations();
        },

        setupTrackerAnimations() {
            const rings = document.querySelectorAll('.ring-fill');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Re-trigger animation
                        const el = entry.target;
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                        el.style.animation = '';
                    }
                });
            }, { threshold: 0.3 });

            rings.forEach(ring => observer.observe(ring));
        }
    };

    // ==========================================================================
    // 15. AMBIENT PARTICLES — Floating pollen/spore particles
    // ==========================================================================
    (function initParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'ambient-particles';
        particlesContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;';

        // Create particles
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 3}px;
                height: ${2 + Math.random() * 3}px;
                background: ${Math.random() > 0.5 ? 'var(--sage-green)' : 'var(--accent-gold)'};
                border-radius: 50%;
                opacity: ${0.1 + Math.random() * 0.3};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${8 + Math.random() * 12}s ease-in-out infinite;
                animation-delay: ${-Math.random() * 10}s;
            `;
            particlesContainer.appendChild(particle);
        }

        document.body.appendChild(particlesContainer);

        // Add keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translate(0, 0) scale(1); }
                25% { transform: translate(${30 - Math.random() * 60}px, ${-40 - Math.random() * 30}px) scale(1.2); }
                50% { transform: translate(${20 - Math.random() * 40}px, ${20 + Math.random() * 20}px) scale(0.8); }
                75% { transform: translate(${-30 + Math.random() * 60}px, ${-20 - Math.random() * 20}px) scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    })();

    // ==========================================================================
    // 16. SMOOTH SCROLL for anchor links
    // ==========================================================================
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile sidebar if open
                Sidebar.closeMobile();
            }
        }
    });

    // ==========================================================================
    // 17. INTERSECTION OBSERVER — Reveal sections as they scroll into view
    // ==========================================================================
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });

    // Immediately show the hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }

})();
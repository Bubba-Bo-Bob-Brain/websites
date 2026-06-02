/* =====================================================
THE TERRARIUM — SOLARPUNK ENCYCLOPEDIA SCRIPTS
Bringing the botanical wiki to life
===================================================== */

(function() {
    'use strict';

    /* =====================================================
    CONFIGURATION & DATA
    ===================================================== */
    const CONFIG = {
        loadingDuration: 2800,
        solarIndexRange: { min: 20, max: 95 },
        solarUpdateInterval: 30000,
        statAnimationDuration: 2000,
        scrollThreshold: 100
    };

    const SEED_DATA = [
        { name: 'Heirloom Tomato', scientific: 'Solanum lycopersicum', category: 'crops', region: 'temperate', status: 'thriving', icon: '🍅' },
        { name: 'Ginkgo Biloba', scientific: 'Ginkgo biloba', category: 'trees', region: 'temperate', status: 'thriving', icon: '🌳' },
        { name: 'Quinoa', scientific: 'Chenopodium quinoa', category: 'crops', region: 'arid', status: 'cultivated', icon: '🌾' },
        { name: 'Blue Agave', scientific: 'Agave tequilana', category: 'medicinal', region: 'arid', status: 'recovering', icon: '🌵' },
        { name: 'Water Lily', scientific: 'Nymphaea spp.', category: 'aquatic', region: 'tropical', status: 'thriving', icon: '🪷' },
        { name: 'Bamboo', scientific: 'Bambusoideae', category: 'trees', region: 'tropical', status: 'cultivated', icon: '🎋' },
        { name: 'Saffron Crocus', scientific: 'Crocus sativus', category: 'medicinal', region: 'temperate', status: 'rare', icon: '🌸' },
        { name: 'Moringa', scientific: 'Moringa oleifera', category: 'medicinal', region: 'tropical', status: 'cultivated', icon: '🌿' },
        { name: 'Amaranth', scientific: 'Amaranthus spp.', category: 'crops', region: 'tropical', status: 'recovering', icon: '🌱' },
        { name: 'Arctic Moss', scientific: 'Calliergon giganteum', category: 'flowers', region: 'polar', status: 'recovering', icon: '🧊' },
        { name: 'Sacred Lotus', scientific: 'Nelumbo nucifera', category: 'aquatic', region: 'tropical', status: 'thriving', icon: '🪷' },
        { name: 'Cedar of Lebanon', scientific: 'Cedrus libani', category: 'trees', region: 'temperate', status: 'rare', icon: '🌲' }
    ];

    const SEARCH_DATABASE = [
        { term: 'Solar Harvesting', category: 'Technologies', resultCount: 1284 },
        { term: 'Mycelial Networks', category: 'Technologies', resultCount: 456 },
        { term: 'Permaculture', category: 'Agriculture', resultCount: 892 },
        { term: 'Ecovillages', category: 'Communities', resultCount: 342 },
        { term: 'Rewilding', category: 'Ecosystems', resultCount: 567 },
        { term: 'Hydroponics', category: 'Agriculture', resultCount: 734 },
        { term: 'Bamboo Architecture', category: 'Architecture', resultCount: 234 },
        { term: 'Water Purification', category: 'Technologies', resultCount: 445 },
        { term: 'Community Governance', category: 'Communities', resultCount: 189 },
        { term: 'Seed Preservation', category: 'Reference', resultCount: 312 },
        { term: 'Vertical Forests', category: 'Architecture', resultCount: 167 },
        { term: 'Ocean Restoration', category: 'Ecosystems', resultCount: 423 }
    ];

    /* =====================================================
    DOM REFERENCES
    ===================================================== */
    const DOM = {
        loadingScreen: document.getElementById('loading-screen'),
        mainContent: document.getElementById('main-content'),
        sunlightMeter: document.getElementById('sunlight-meter'),
        meterFill: document.getElementById('meter-fill'),
        meterValue: document.getElementById('meter-value'),
        meterToggle: document.getElementById('meter-toggle'),
        sidebar: document.getElementById('sidebar'),
        sidebarCollapse: document.getElementById('sidebar-collapse'),
        searchInput: document.getElementById('search-input'),
        searchResults: document.getElementById('search-results'),
        seedGrid: document.getElementById('seed-grid'),
        seedCategory: document.getElementById('seed-category'),
        seedRegion: document.getElementById('seed-region'),
        seedStatus: document.getElementById('seed-status'),
        worldMap: document.getElementById('world-map')
    };

    /* =====================================================
    UTILITY FUNCTIONS
    ===================================================== */
    const Utils = {
        clamp: function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        random: function(min, max) {
            return Math.random() * (max - min) + min;
        },
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction() {
                const args = arguments;
                const later = function() {
                    clearTimeout(timeout);
                    func.apply(null, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() {
                        inThrottle = false;
                    }, limit);
                }
            };
        },
        animateValue: function(element, start, end, duration) {
            const startTime = performance.now();
            const update = function(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (end - start) * easeOut);
                element.textContent = current.toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            requestAnimationFrame(update);
        },
        getCurrentSolarIndex: function() {
            const hour = new Date().getHours();
            if (hour >= 6 && hour <= 18) {
                const peak = 14;
                const distance = Math.abs(hour - peak);
                return CONFIG.solarIndexRange.max - (distance * 5);
            } else {
                return CONFIG.solarIndexRange.min;
            }
        }
    };

    /* =====================================================
    LOADING SCREEN
    ===================================================== */
    const LoadingScreen = {
        init: function() {
            this.hideAfterDelay();
            this.setupKeyboardShortcut();
        },
        hideAfterDelay: function() {
            const self = this;
            setTimeout(function() {
                self.hide();
            }, CONFIG.loadingDuration);
        },
        hide: function() {
            DOM.loadingScreen.classList.add('hidden');
            DOM.mainContent.classList.add('visible');
            this.initializeAnimations();
        },
        setupKeyboardShortcut: function() {
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !DOM.loadingScreen.classList.contains('hidden')) {
                    LoadingScreen.hide();
                }
            });
        },
        initializeAnimations: function() {
            StatsCounter.animateAll();
            ScrollAnimations.init();
            SolarMeter.startUpdates();
        }
    };

    /* =====================================================
    SOLAR INTENSITY METER
    ===================================================== */
    const SolarMeter = {
        currentIndex: 72,
        isDayMode: true,
        init: function() {
            this.currentIndex = Math.round(Utils.getCurrentSolarIndex());
            this.updateDisplay();
            this.bindEvents();
        },
        bindEvents: function() {
            const self = this;
            if (DOM.meterToggle) {
                DOM.meterToggle.addEventListener('click', function() {
                    self.toggleMode();
                });
            }
            if (DOM.meterFill && DOM.meterFill.parentElement) {
                DOM.meterFill.parentElement.addEventListener('click', function(e) {
                    const rect = this.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = (clickX / rect.width) * 100;
                    self.setIndex(Math.round(percentage));
                });
            }
        },
        toggleMode: function() {
            this.isDayMode = !this.isDayMode;
            if (this.isDayMode) {
                document.body.removeAttribute('data-theme');
            } else {
                document.body.setAttribute('data-theme', 'evening');
            }
            if (DOM.meterToggle) {
                DOM.meterToggle.style.transform = this.isDayMode ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        },
        setIndex: function(value) {
            this.currentIndex = Utils.clamp(value, 0, 100);
            this.updateDisplay();
            if (this.currentIndex < 40) {
                document.body.setAttribute('data-solar-level', 'low');
            } else if (this.currentIndex < 70) {
                document.body.setAttribute('data-solar-level', 'medium');
            } else {
                document.body.setAttribute('data-solar-level', 'high');
            }
        },
        updateDisplay: function() {
            if (DOM.meterFill) {
                DOM.meterFill.style.width = this.currentIndex + '%';
            }
            if (DOM.meterValue) {
                DOM.meterValue.textContent = this.currentIndex + '%';
                if (this.currentIndex >= 70) {
                    DOM.meterValue.style.color = 'var(--green-vibrant)';
                } else if (this.currentIndex >= 40) {
                    DOM.meterValue.style.color = 'var(--accent-sun)';
                } else {
                    DOM.meterValue.style.color = 'var(--text-muted)';
                }
            }
        },
        startUpdates: function() {
            const self = this;
            setInterval(function() {
                const naturalIndex = Utils.getCurrentSolarIndex();
                const variation = Utils.random(-5, 5);
                const newIndex = Math.round(Utils.clamp(naturalIndex + variation, 0, 100));
                self.setIndex(newIndex);
            }, CONFIG.solarUpdateInterval);
        }
    };

    /* =====================================================
    STATS COUNTER
    ===================================================== */
    const StatsCounter = {
        animateAll: function() {
            const statNumbers = document.querySelectorAll('.stat-number[data-target]');
            statNumbers.forEach(function(el) {
                const target = parseInt(el.dataset.target, 10);
                Utils.animateValue(el, 0, target, CONFIG.statAnimationDuration);
            });
        }
    };

    /* =====================================================
    SIDEBAR NAVIGATION
    ===================================================== */
    const Sidebar = {
        isCollapsed: false,
        init: function() {
            this.bindEvents();
            this.highlightActiveNav();
        },
        bindEvents: function() {
            const self = this;
            if (DOM.sidebarCollapse) {
                DOM.sidebarCollapse.addEventListener('click', function() {
                    self.toggle();
                });
            }
            document.addEventListener('click', function(e) {
                if (self.isCollapsed && DOM.sidebar && DOM.sidebar.contains(e.target)) {
                    self.toggle();
                }
            });
        },
        toggle: function() {
            this.isCollapsed = !this.isCollapsed;
            if (DOM.sidebar) {
                DOM.sidebar.classList.toggle('collapsed', this.isCollapsed);
            }
            if (DOM.sidebarCollapse) {
                const svg = DOM.sidebarCollapse.querySelector('svg');
                if (svg) {
                    svg.style.transform = this.isCollapsed ? 'rotate(180deg)' : '';
                }
            }
        },
        highlightActiveNav: function() {
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('section[id]');
            const self = this;
            window.addEventListener('scroll', Utils.throttle(function() {
                let current = '';
                sections.forEach(function(section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });
                navItems.forEach(function(item) {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + current) {
                        item.classList.add('active');
                    }
                });
            }, 100));
        }
    };

    /* =====================================================
    SEARCH FUNCTIONALITY
    ===================================================== */
    const Search = {
        init: function() {
            this.bindEvents();
            this.setupKeyboardShortcut();
        },
        bindEvents: function() {
            const self = this;
            if (DOM.searchInput) {
                DOM.searchInput.addEventListener('input', Utils.debounce(function(e) {
                    self.handleInput(e);
                }, 200));
                DOM.searchInput.addEventListener('focus', function() {
                    self.showResults();
                });
                DOM.searchInput.addEventListener('blur', function() {
                    setTimeout(function() {
                        self.hideResults();
                    }, 200);
                });
                DOM.searchInput.addEventListener('keydown', function(e) {
                    self.handleKeydown(e);
                });
            }
        },
        handleInput: function(e) {
            const query = e.target.value.trim().toLowerCase();
            if (query.length < 2) {
                this.hideResults();
                return;
            }
            const results = this.search(query);
            this.displayResults(results);
        },
        search: function(query) {
            return SEARCH_DATABASE.filter(function(item) {
                return item.term.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
            });
        },
        displayResults: function(results) {
            if (!DOM.searchResults) return;
            if (results.length === 0) {
                DOM.searchResults.innerHTML = '<div class="search-no-results"><p>No results found for your query.</p><span>Try searching for technologies, communities, or ecosystems</span></div>';
            } else {
                const html = results.slice(0, 6).map(function(item) {
                    return '<div class="search-result-item" data-term="' + item.term + '">' +
                        '<div class="result-category">' + item.category + '</div>' +
                        '<div class="result-term">' + item.term + '</div>' +
                        '<div class="result-count">' + item.resultCount + ' articles</div>' +
                        '</div>';
                }).join('');
                DOM.searchResults.innerHTML = html;
                const self = this;
                document.querySelectorAll('.search-result-item').forEach(function(el) {
                    el.addEventListener('click', function() {
                        const term = el.dataset.term;
                        if (DOM.searchInput) DOM.searchInput.value = term;
                        self.hideResults();
                    });
                });
            }
            this.showResults();
        },
        showResults: function() {
            if (DOM.searchResults) {
                DOM.searchResults.classList.add('active');
            }
        },
        hideResults: function() {
            if (DOM.searchResults) {
                DOM.searchResults.classList.remove('active');
            }
        },
        handleKeydown: function(e) {
            if (e.key === 'Escape') {
                this.hideResults();
                if (DOM.searchInput) DOM.searchInput.blur();
            }
            if (e.key === 'Enter') {
                const firstResult = document.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            }
        },
        setupKeyboardShortcut: function() {
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    if (DOM.searchInput) DOM.searchInput.focus();
                }
            });
        }
    };

    /* =====================================================
    SEED BANK
    ===================================================== */
    const SeedBank = {
        currentPage: 1,
        itemsPerPage: 8,
        init: function() {
            this.populateSeeds();
            this.bindEvents();
        },
        bindEvents: function() {
            const self = this;
            if (DOM.seedCategory) {
                DOM.seedCategory.addEventListener('change', function() {
                    self.filterSeeds();
                });
            }
            if (DOM.seedRegion) {
                DOM.seedRegion.addEventListener('change', function() {
                    self.filterSeeds();
                });
            }
            if (DOM.seedStatus) {
                DOM.seedStatus.addEventListener('change', function() {
                    self.filterSeeds();
                });
            }
            document.querySelectorAll('.page-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) {
                        const direction = svg.getAttribute('d').includes('15') ? 1 : -1;
                        self.changePage(direction);
                    }
                });
            });
        },
        populateSeeds: function(filteredData) {
            if (!DOM.seedGrid) return;
            filteredData = filteredData || SEED_DATA;
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const pageData = filteredData.slice(startIndex, startIndex + this.itemsPerPage);
            const html = pageData.map(function(seed) {
                return '<div class="seed-card" data-category="' + seed.category + '" data-region="' + seed.region + '" data-status="' + seed.status + '">' +
                    '<div class="seed-icon">' + seed.icon + '</div>' +
                    '<h4>' + seed.name + '</h4>' +
                    '<p class="scientific-name">' + seed.scientific + '</p>' +
                    '<span class="seed-status ' + seed.status + '">' + seed.status + '</span>' +
                    '</div>';
            }).join('');
            DOM.seedGrid.innerHTML = html;
            this.bindSeedCardEvents();
        },
        bindSeedCardEvents: function() {
            document.querySelectorAll('.seed-card').forEach(function(card) {
                card.addEventListener('mouseenter', function() {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';
                });
                card.addEventListener('click', function() {
                    const seedName = card.querySelector('h4').textContent;
                    SeedBank.showSeedDetail(seedName);
                });
            });
        },
        filterSeeds: function() {
            const category = DOM.seedCategory ? DOM.seedCategory.value : 'all';
            const region = DOM.seedRegion ? DOM.seedRegion.value : 'all';
            const status = DOM.seedStatus ? DOM.seedStatus.value : 'all';
            const filtered = SEED_DATA.filter(function(seed) {
                const matchCategory = category === 'all' || seed.category === category;
                const matchRegion = region === 'all' || seed.region === region;
                const matchStatus = status === 'all' || seed.status === status;
                return matchCategory && matchRegion && matchStatus;
            });
            this.currentPage = 1;
            this.populateSeeds(filtered);
            this.updatePagination(filtered.length);
        },
        changePage: function(direction) {
            const totalPages = Math.ceil(SEED_DATA.length / this.itemsPerPage);
            this.currentPage = Utils.clamp(this.currentPage + direction, 1, totalPages);
            this.filterSeeds();
            this.updatePagination();
        },
        updatePagination: function(total) {
            if (!DOM.seedGrid) return;
            total = total || SEED_DATA.length;
            const totalPages = Math.ceil(total / this.itemsPerPage);
            const pageInfo = document.querySelector('.page-info');
            if (pageInfo) {
                pageInfo.innerHTML = 'Page <strong>' + this.currentPage + '</strong> of <strong>' + totalPages + '</strong>';
            }
            document.querySelectorAll('.page-btn').forEach(function(btn) {
                const svg = btn.querySelector('svg');
                if (svg) {
                    const isPrevBtn = svg.getAttribute('d').includes('15');
                    btn.disabled = isPrevBtn ? self.currentPage === 1 : self.currentPage === totalPages;
                }
            });
        },
        showSeedDetail: function(name) {
            console.log('Showing details for: ' + name);
        }
    };

    /* =====================================================
    SCROLL ANIMATIONS
    ===================================================== */
    const ScrollAnimations = {
        init: function() {
            this.setupIntersectionObserver();
            this.setupParallax();
            this.setupTimelineProgress();
        },
        setupIntersectionObserver: function() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            const self = this;
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        if (entry.target.classList.contains('category-card')) {
                            self.staggerChildren(entry.target);
                        }
                    }
                });
            }, observerOptions);
            document.querySelectorAll('.scroll-animate, .category-card, .timeline-item, .seed-card').forEach(function(el) {
                el.classList.add('scroll-animate');
                observer.observe(el);
            });
        },
        staggerChildren: function(element) {
            const children = element.children;
            Array.from(children).forEach(function(child, index) {
                child.style.transitionDelay = (index * 0.1) + 's';
            });
        },
        setupParallax: function() {
            const banner = document.querySelector('.welcome-banner');
            const decoration = document.querySelector('.banner-decoration');
            if (!banner || !decoration) return;
            window.addEventListener('scroll', Utils.throttle(function() {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;
                if (scrolled < banner.offsetHeight) {
                    decoration.style.transform = 'translateY(' + rate + 'px)';
                }
            }, 16));
        },
        setupTimelineProgress: function() {
            const timeline = document.querySelector('.timeline');
            const progress = document.querySelector('.timeline-progress');
            if (!timeline || !progress) return;
            window.addEventListener('scroll', Utils.throttle(function() {
                const rect = timeline.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const timelineHeight = timeline.offsetHeight;
                const scrolled = windowHeight - rect.top;
                const progressPercent = Utils.clamp((scrolled / (windowHeight + timelineHeight)) * 100, 0, 100);
                progress.style.setProperty('--progress', progressPercent + '%');
            }, 50));
        }
    };

    /* =====================================================
    WORLD MAP INTERACTIONS
    ===================================================== */
    const WorldMap = {
        init: function() {
            if (!DOM.worldMap) return;
            this.bindEvents();
            this.animateMarkers();
        },
        bindEvents: function() {
            const self = this;
            const markers = DOM.worldMap.querySelectorAll('.marker-group');
            markers.forEach(function(marker) {
                marker.addEventListener('mouseenter', function() {
                    self.highlightMarker(marker);
                });
                marker.addEventListener('mouseleave', function() {
                    self.unhighlightMarker(marker);
                });
                marker.addEventListener('click', function() {
                    self.selectRegion(marker);
                });
            });
            const connections = DOM.worldMap.querySelector('.connections');
            if (connections) {
                connections.addEventListener('mouseenter', function() {
                    connections.style.opacity = '0.8';
                });
                connections.addEventListener('mouseleave', function() {
                    connections.style.opacity = '0.5';
                });
            }
        },
        highlightMarker: function(marker) {
            const pulse = marker.querySelector('.marker-pulse');
            const circle = marker.querySelector('circle:last-child');
            if (pulse) pulse.style.animationDuration = '1s';
            if (circle) circle.style.transform = 'scale(1.3)';
        },
        unhighlightMarker: function(marker) {
            const pulse = marker.querySelector('.marker-pulse');
            const circle = marker.querySelector('circle:last-child');
            if (pulse) pulse.style.animationDuration = '2s';
            if (circle) circle.style.transform = 'scale(1)';
        },
        selectRegion: function(marker) {
            const region = marker.dataset.region;
            const label = marker.querySelector('.marker-label');
            if (label) {
                this.showRegionInfo(label.textContent, region);
            }
        },
        animateMarkers: function() {
            const markers = DOM.worldMap.querySelectorAll('.marker-group');
            markers.forEach(function(marker, index) {
                marker.style.opacity = '0';
                marker.style.transform = 'scale(0)';
                setTimeout(function() {
                    marker.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    marker.style.opacity = '1';
                    marker.style.transform = 'scale(1)';
                }, 500 + (index * 200));
            });
        },
        showRegionInfo: function(name, region) {
            const info = document.createElement('div');
            info.className = 'region-info-popup';
            info.innerHTML = '<div class="region-info-header">' +
                '<h4>' + name + '</h4>' +
                '<button class="region-info-close">&times;</button>' +
                '</div>' +
                '<div class="region-info-content">' +
                '<p>Loading ecosystem data...</p>' +
                '</div>';
            document.body.appendChild(info);
            requestAnimationFrame(function() {
                info.classList.add('show');
            });
            const closeBtn = info.querySelector('.region-info-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    info.classList.remove('show');
                    setTimeout(function() {
                        info.remove();
                    }, 300);
                });
            }
            const content = info.querySelector('.region-info-content');
            setTimeout(function() {
                if (content) {
                    content.innerHTML = '<div class="region-stats">' +
                        '<div class="region-stat"><span class="stat-value">+156%</span><span class="stat-label">Biodiversity Increase</span></div>' +
                        '<div class="region-stat"><span class="stat-value">4,200 km²</span><span class="stat-label">Protected Area</span></div>' +
                        '<div class="region-stat"><span class="stat-value">342</span><span class="stat-label">Species Restored</span></div>' +
                        '</div>' +
                        '<a href="#' + region + '" class="region-link">View Full Documentation →</a>';
                }
            }, 800);
        }
    };

    /* =====================================================
    INTERACTIVE TIMELINE
    ===================================================== */
    const Timeline = {
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            const items = document.querySelectorAll('.timeline-item');
            const self = this;
            items.forEach(function(item) {
                item.addEventListener('click', function() {
                    self.expandItem(item);
                });
                item.addEventListener('mouseenter', function() {
                    self.hoverItem(item);
                });
                item.addEventListener('mouseleave', function() {
                    self.unhoverItem(item);
                });
            });
        },
        expandItem: function(item) {
            const wasExpanded = item.classList.contains('expanded');
            document.querySelectorAll('.timeline-item.expanded').forEach(function(el) {
                el.classList.remove('expanded');
                const content = el.querySelector('.timeline-content');
                if (content) content.style.maxHeight = 'null';
            });
            if (!wasExpanded) {
                item.classList.add('expanded');
                const content = item.querySelector('.timeline-content');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
            }
        },
        hoverItem: function(item) {
            item.style.zIndex = '10';
            const marker = item.querySelector('.timeline-marker');
            if (marker) marker.style.transform = 'scale(1.2)';
        },
        unhoverItem: function(item) {
            item.style.zIndex = '';
            const marker = item.querySelector('.timeline-marker');
            if (marker) marker.style.transform = '';
        }
    };

    /* =====================================================
    CONTRIBUTOR BADGE COUNTER
    ===================================================== */
    const ContributorBadge = {
        init: function() {
            this.animateBadge();
        },
        animateBadge: function() {
            const badgeCount = document.querySelector('.badge-count');
            if (!badgeCount) return;
            const target = 2847;
            let current = 0;
            const duration = 1500;
            const startTime = performance.now();
            const update = function(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                current = Math.floor(target * easeOut);
                badgeCount.textContent = current.toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            requestAnimationFrame(update);
        }
    };

    /* =====================================================
    SMOOTH SCROLL FOR NAVIGATION
    ===================================================== */
    const SmoothScroll = {
        init: function() {
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    if (target) {
                        const offset = 100;
                        const targetPosition = target.offsetTop - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    /* =====================================================
    KEYBOARD NAVIGATION
    ===================================================== */
    const KeyboardNav = {
        init: function() {
            document.addEventListener('keydown', function(e) {
                if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    const mainContent = document.getElementById('content');
                    if (mainContent) mainContent.focus();
                }
                if (e.key === '[' && e.altKey) {
                    Sidebar.toggle();
                }
            });
        }
    };

    /* =====================================================
    DYNAMIC STYLES
    ===================================================== */
    const DynamicStyles = {
        init: function() {
            this.injectStyles();
        },
        injectStyles: function() {
            const styles = '.search-results { max-height: 400px; overflow-y: auto; }' +
                '.search-result-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid var(--green-pale); transition: background var(--transition-fast); }' +
                '.search-result-item:hover { background: var(--green-pale); }' +
                '.search-result-item:last-child { border-bottom: none; }' +
                '.result-category { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--green-vibrant); margin-bottom: 4px; }' +
                '.result-term { font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }' +
                '.result-count { font-size: 0.8rem; color: var(--text-muted); }' +
                '.search-no-results { padding: 20px; text-align: center; }' +
                '.search-no-results p { color: var(--text-secondary); margin-bottom: 8px; }' +
                '.search-no-results span { font-size: 0.85rem; color: var(--text-muted); }' +
                '.region-info-popup { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); background: var(--bg-primary); border: 2px solid var(--green-pale); border-radius: var(--radius-lg); padding: 24px; min-width: 320px; box-shadow: var(--shadow-xl); opacity: 0; visibility: hidden; transition: all var(--transition-normal); z-index: 500; }' +
                '.region-info-popup.show { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }' +
                '.region-info-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--green-pale); }' +
                '.region-info-header h4 { font-family: var(--font-display); font-size: 1.1rem; color: var(--green-deep); }' +
                '.region-info-close { background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; line-height: 1; }' +
                '.region-info-close:hover { color: var(--text-primary); }' +
                '.region-stats { display: flex; gap: 20px; margin-bottom: 16px; }' +
                '.region-stat { text-align: center; flex: 1; }' +
                '.region-stat .stat-value { display: block; font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--green-vibrant); }' +
                '.region-stat .stat-label { font-size: 0.75rem; color: var(--text-muted); }' +
                '.region-link { display: inline-block; color: var(--green-vibrant); font-weight: 500; text-decoration: none; }' +
                '.region-link:hover { text-decoration: underline; }' +
                '.sidebar.collapsed .sidebar-inner { max-height: 60px; overflow: hidden; }' +
                '.sidebar.collapsed .sidebar-nav, .sidebar.collapsed .sidebar-footer { display: none; }' +
                '.timeline-content { max-height: 100px; overflow: hidden; transition: max-height 0.3s ease; }' +
                '.timeline-item.expanded .timeline-content { max-height: 300px; }' +
                '.seed-card:active { transform: scale(0.98); }' +
                '.loading-screen.hidden { opacity: 0; visibility: hidden; pointer-events: none; }' +
                '.main-content.visible { opacity: 1; transform: translateY(0); }' +
                '.scroll-animate { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }' +
                '.scroll-animate.visible { opacity: 1; transform: translateY(0); }' +
                '@media (max-width: 768px) { .banner-stats { justify-content: space-between; } .stat-item { flex: 1 1 45%; text-align: center; } .banner-decoration { display: none; } }' +
                '@media (max-width: 768px) { .vine-border { height: 20px; } .vine-leaves ellipse:nth-child(n+7) { display: none; } }' +
                '@media (max-width: 768px) { .footer-main { grid-template-columns: 1fr; } .footer-bottom { flex-direction: column; text-align: center; } }';
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    };

    /* =====================================================
    INITIALIZATION
    ===================================================== */
    function init() {
        LoadingScreen.init();
        SolarMeter.init();
        Sidebar.init();
        Search.init();
        SeedBank.init();
        WorldMap.init();
        Timeline.init();
        ContributorBadge.init();
        SmoothScroll.init();
        KeyboardNav.init();
        DynamicStyles.init();
        console.log('%c🌱 The Terrarium initialized', 'color: #40916C; font-size: 14px; font-weight: bold;');
        console.log('%cCollaborative Encyclopedia of the Green Renaissance', 'color: #2D6A4F; font-size: 12px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* =====================================================
    ADDITIONAL POLISH
    ===================================================== */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }

    const setupFavicon = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#40916C';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.quadraticCurveTo(28, 12, 24, 24);
        ctx.quadraticCurveTo(16, 30, 16, 28);
        ctx.quadraticCurveTo(16, 30, 8, 24);
        ctx.quadraticCurveTo(4, 12, 16, 4);
        ctx.fill();
        ctx.strokeStyle = '#2D6A4F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(16, 26);
        ctx.stroke();
    };
    setupFavicon();

    if (typeof window !== 'undefined') {
        window.Terrarium = {
            SolarMeter: SolarMeter,
            Search: Search,
            SeedBank: SeedBank,
            WorldMap: WorldMap,
            Timeline: Timeline
        };
    }

})();
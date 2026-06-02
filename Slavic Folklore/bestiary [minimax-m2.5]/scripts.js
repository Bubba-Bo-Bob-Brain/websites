/* ========================================
BESTIARUM SLAVORUM - The Slavic Bestiary
JavaScript - Circa 1697
======================================== */

(function() {
    'use strict';

    // ========================================
    // INITIALIZATION
    // ========================================
    
    document.addEventListener('DOMContentLoaded', function() {
        Bestiary.init();
    });

    // Main Bestiary Namespace
    const Bestiary = {
        
        // State
        isOpen: false,
        currentFilter: 'all',
        scrollTimeout: null,
        
        // Initialize the bestiary
        init: function() {
            this.setupInitialState();
            this.setupEventListeners();
            this.initAnimations();
            this.logPerformance();
        },

        // ========================================
        // INITIAL STATE SETUP
        // ========================================
        
        setupInitialState: function() {
            const bestiaryContent = document.getElementById('bestiary');
            const titlePage = document.getElementById('title-page');
            
            if (bestiaryContent) {
                bestiaryContent.style.display = 'none';
            }
            if (titlePage) {
                titlePage.style.display = 'flex';
            }
        },

        // ========================================
        // EVENT LISTENERS
        // ========================================
        
        setupEventListeners: function() {
            // Keyboard navigation
            document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
            
            // Anchor links
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', this.handleAnchorClick.bind(this));
            }.bind(this));
            
            // Scroll spy
            window.addEventListener('scroll', this.handleScrollSpy.bind(this), { passive: true });
            
            // Search debounce
            const searchInput = document.getElementById('creature-search');
            if (searchInput) {
                let debounceTimer;
                searchInput.addEventListener('input', function() {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(this.filterCreatures.bind(this), 300);
                }.bind(this));
            }
            
            // Touch swipe
            this.setupTouchSwipe();
            
            // Window resize
            window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
            
            // Popstate (browser back button)
            window.addEventListener('popstate', this.handlePopState.bind(this));
            
            // Before print
            window.addEventListener('beforeprint', function() {
                document.body.classList.add('printing');
            });
            
            window.addEventListener('afterprint', function() {
                document.body.classList.remove('printing');
            });
        },

        // ========================================
        // BOOK OPENING
        // ========================================
        
        openBestiary: function() {
            const titlePage = document.getElementById('title-page');
            const bestiaryContent = document.getElementById('bestiary');
            
            if (!titlePage || !bestiaryContent) return;
            
            this.isOpen = true;
            
            // Fade out title page
            titlePage.classList.add('fade-out');
            
            setTimeout(function() {
                titlePage.style.display = 'none';
                bestiaryContent.style.display = 'block';
                
                // Trigger animations
                setTimeout(function() {
                    bestiaryContent.classList.add('fade-in');
                    this.animateEntries();
                }.bind(this), 100);
                
                // Update URL
                window.history.pushState({}, '', '#bestiary');
            }.bind(this), 500);
        },

        animateEntries: function() {
            const entries = document.querySelectorAll('.creature-entry');
            entries.forEach(function(entry, index) {
                entry.style.opacity = '0';
                entry.style.transform = 'translateY(30px)';
                setTimeout(function() {
                    entry.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.style.opacity = '1';
                    entry.style.transform = 'translateY(0)';
                }, index * 100);
            });
        },

        // ========================================
        // NAVIGATION
        // ========================================
        
        scrollToPrev: function() {
            const entries = document.querySelectorAll('.creature-entry');
            const scrollPos = window.scrollY;
            let prevEntry = null;
            
            entries.forEach(function(entry) {
                const entryTop = entry.offsetTop;
                if (entryTop < scrollPos - 100) {
                    prevEntry = entry;
                }
            });
            
            if (prevEntry) {
                prevEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        scrollToNext: function() {
            const entries = document.querySelectorAll('.creature-entry');
            const scrollPos = window.scrollY;
            let nextEntry = null;
            
            entries.forEach(function(entry) {
                const entryTop = entry.offsetTop;
                if (entryTop > scrollPos + 200) {
                    if (!nextEntry) nextEntry = entry;
                }
            });
            
            if (nextEntry) {
                nextEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        handleKeyboardNavigation: function(e) {
            // Don't handle if typing in search
            const searchActive = document.activeElement === document.getElementById('creature-search');
            if (searchActive) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'j':
                    e.preventDefault();
                    this.scrollToNext();
                    break;
                case 'ArrowUp':
                case 'k':
                    e.preventDefault();
                    this.scrollToPrev();
                    break;
                case 'Escape':
                    this.closeSearch();
                    break;
                case '/':
                    e.preventDefault();
                    this.toggleSearch();
                    break;
            }
        },

        handleAnchorClick: function(e) {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState({}, '', href);
                }
            }
        },

        handlePopState: function() {
            const bestiaryContent = document.getElementById('bestiary');
            const titlePage = document.getElementById('title-page');
            
            if (window.location.hash === '' || !window.location.hash) {
                if (titlePage) {
                    titlePage.style.display = 'flex';
                    titlePage.classList.remove('fade-out');
                }
                if (bestiaryContent) {
                    bestiaryContent.style.display = 'none';
                }
                this.isOpen = false;
            } else if (window.location.hash === '#bestiary') {
                if (titlePage) titlePage.style.display = 'none';
                if (bestiaryContent) bestiaryContent.style.display = 'block';
                this.isOpen = true;
            }
        },

        // ========================================
        // SCROLL SPY
        // ========================================
        
        handleScrollSpy: function() {
            if (this.scrollTimeout) {
                cancelAnimationFrame(this.scrollTimeout);
            }
            
            this.scrollTimeout = requestAnimationFrame(function() {
                const entries = document.querySelectorAll('.creature-entry');
                const tocLinks = document.querySelectorAll('.toc-entry');
                let currentId = '';
                const scrollPos = window.scrollY + 200;
                
                entries.forEach(function(entry) {
                    const entryTop = entry.offsetTop;
                    const entryHeight = entry.offsetHeight;
                    if (scrollPos >= entryTop && scrollPos < entryTop + entryHeight) {
                        currentId = entry.getAttribute('id');
                    }
                });
                
                tocLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentId) {
                        link.classList.add('active');
                    }
                });
                
                // Update parallax
                this.updateParallax();
            }.bind(this));
        },

        updateParallax: function() {
            const scrollY = window.scrollY;
            const canopy = document.querySelector('.forest-canopy');
            
            if (canopy) {
                canopy.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
            }
            
            // Update hearth glow
            const hearthGlows = document.querySelectorAll('.hearth-glow');
            hearthGlows.forEach(function(glow) {
                const intensity = Math.max(0.3, 0.7 - scrollY * 0.0005);
                glow.style.opacity = intensity;
            });
        },

        // ========================================
        // SEARCH & FILTER
        // ========================================
        
        toggleSearch: function() {
            const panel = document.getElementById('search-panel');
            if (panel) {
                panel.classList.toggle('active');
                if (panel.classList.contains('active')) {
                    setTimeout(function() {
                        const searchInput = document.getElementById('creature-search');
                        if (searchInput) searchInput.focus();
                    }, 100);
                }
            }
        },

        closeSearch: function() {
            const panel = document.getElementById('search-panel');
            if (panel) {
                panel.classList.remove('active');
            }
        },

        filterCreatures: function() {
            const searchInput = document.getElementById('creature-search');
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const entries = document.querySelectorAll('.creature-entry');
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            const currentFilter = activeFilterBtn ? activeFilterBtn.dataset.level : 'all';
            
            entries.forEach(function(entry) {
                const name = entry.querySelector('.creature-name').textContent.toLowerCase();
                const subtitle = entry.querySelector('.creature-subtitle').textContent.toLowerCase();
                const description = entry.querySelector('.creature-description').textContent.toLowerCase();
                const dangerText = entry.querySelector('.rating-text').textContent.toLowerCase();
                
                const matchesSearch = name.includes(searchTerm) || 
                                      subtitle.includes(searchTerm) || 
                                      description.includes(searchTerm);
                const matchesFilter = this.checkDangerFilter(dangerText, currentFilter);
                
                if (matchesSearch && matchesFilter) {
                    entry.style.display = 'block';
                    this.animateEntry(entry);
                } else {
                    entry.style.display = 'none';
                }
            }.bind(this));
        },

        checkDangerFilter: function(dangerText, filter) {
            if (filter === 'all') return true;
            
            const dangerLevels = {
                'benevolent': ['benevolent'],
                'low': ['low', 'unpredictable'],
                'medium': ['guarded', 'dangerous', 'haunting'],
                'high': ['dangerous', 'deadly', 'immortal']
            };
            
            const levels = dangerLevels[filter];
            if (!levels) return true;
            
            return levels.some(function(level) {
                return dangerText.includes(level);
            });
        },

        setFilter: function(level) {
            document.querySelectorAll('.filter-btn').forEach(function(btn) {
                btn.classList.remove('active');
                if (btn.dataset.level === level) {
                    btn.classList.add('active');
                }
            });
            
            this.currentFilter = level;
            this.filterCreatures();
        },

        animateEntry: function(entry) {
            entry.style.transition = 'opacity 0.3s ease';
            entry.style.opacity = '1';
        },

        // ========================================
        // ANIMATIONS
        // ========================================
        
        initAnimations: function() {
            // Intersection Observer
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                
                document.querySelectorAll('.creature-entry').forEach(function(entry) {
                    observer.observe(entry);
                });
            }
        },

        // ========================================
        // TOUCH SWIPE
        // ========================================
        
        setupTouchSwipe: function() {
            let touchStartX = 0;
            let touchEndX = 0;
            const minSwipeDistance = 50;
            
            document.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            document.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX, minSwipeDistance);
            }.bind(this), { passive: true });
        },

        handleSwipe: function(startX, endX, minDistance) {
            const swipeDistance = endX - startX;
            if (Math.abs(swipeDistance) > minDistance) {
                if (swipeDistance > 0) {
                    this.scrollToPrev();
                } else {
                    this.scrollToNext();
                }
            }
        },

        // ========================================
        // UTILITIES
        // ========================================
        
        handleResize: function() {
            // Handle responsive adjustments
            this.handleScrollSpy();
        },

        createRipple: function(event, element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles
            const style = document.createElement('style');
            style.textContent = '.ripple { position: absolute; border-radius: 50%; ' +
                'background: rgba(255,255,255,0.4); transform: scale(0); ' +
                'animation: ripple-animation 0.6s linear; pointer-events: none; } ' +
                '@keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }';
            
            document.head.appendChild(style);
            element.appendChild(ripple);
            
            ripple.addEventListener('animationend', function() {
                ripple.remove();
                style.remove();
            });
        },

        logPerformance: function() {
            if (window.performance && window.performance.mark) {
                window.performance.mark('bestiary-loaded');
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        if (window.performance.getEntriesByName('bestiary-loaded').length) {
                            console.log('Bestiarum Slavorum loaded successfully');
                        }
                    }, 0);
                });
            }
        },

        // ========================================
        // PUBLIC API
        // ========================================
        
        open: function() {
            this.openBestiary();
        },

        getScrollPos: function() {
            return window.scrollY || window.pageYOffset;
        },

        scrollToElement: function(element, offset) {
            offset = offset || 0;
            const top = element.getBoundingClientRect().top + this.getScrollPos() - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    };

    // Make functions globally accessible
    window.Bestiary = Bestiary;
    window.openBestiary = function() { Bestiary.openBestiary(); };
    window.toggleSearch = function() { Bestiary.toggleSearch(); };
    window.filterCreatures = function() { Bestiary.filterCreatures(); };
    window.setFilter = function(level) { Bestiary.setFilter(level); };
    window.scrollToPrev = function() { Bestiary.scrollToPrev(); };
    window.scrollToNext = function() { Bestiary.scrollToNext(); };

})();
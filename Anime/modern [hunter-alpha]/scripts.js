/* ========================================
   ANIMAX — Manga & Anime Website
   Interactive JavaScript
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // Preloader
    // ========================================
    const preloader = document.getElementById('preloader');
    
    function hidePreloader() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }, 2200);
    }

    window.addEventListener('load', hidePreloader);
    document.body.style.overflow = 'hidden';

    // ========================================
    // Custom Cursor
    // ========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    var hoverElements = document.querySelectorAll('a, button, .manga-card, .anime-card, .filter-btn, .dot');
    hoverElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', function() {
            cursorRing.classList.remove('hover');
        });
    });

    // ========================================
    // Navigation
    // ========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var scrollPos = window.scrollY + 100;
        
        sections.forEach(function(section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Hero Panel Reveal Animation
    // ========================================
    function initAnimations() {
        var panels = document.querySelectorAll('.reveal-panel');
        panels.forEach(function(panel, index) {
            var delay = parseInt(panel.getAttribute('data-delay')) || 0;
            setTimeout(function() {
                panel.classList.add('visible');
            }, 300 + (delay * 150));
        });
    }

    // ========================================
    // Stat Counter Animation
    // ========================================
    var statNumbers = document.querySelectorAll('.stat-number');
    var statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;
        
        statNumbers.forEach(function(stat) {
            var target = parseInt(stat.getAttribute('data-target'));
            var duration = 2000;
            var start = 0;
            var startTime = null;
            
            function updateNumber(currentTime) {
                if (!startTime) startTime = currentTime;
                var progress = Math.min((currentTime - startTime) / duration, 1);
                var easeProgress = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(easeProgress * target);
                stat.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(updateNumber);
        });
    }

    // ========================================
    // Scroll Reveal (Intersection Observer)
    // ========================================
    var revealElements = document.querySelectorAll('.reveal-up');
    
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(function() {
                    entry.target.classList.add('visible');
                }, delay * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // Stats observer
    var heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        var statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    // ========================================
    // Manga Filter
    // ========================================
    var filterBtns = document.querySelectorAll('.filter-btn');
    var mangaCards = document.querySelectorAll('.manga-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = this.getAttribute('data-filter');
            
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            mangaCards.forEach(function(card) {
                var genre = card.getAttribute('data-genre');
                
                if (filter === 'all' || genre === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(function() {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ========================================
    // Character Carousel
    // ========================================
    var characterCards = document.querySelectorAll('.character-card');
    var carouselDots = document.querySelectorAll('.dot');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var currentCharacter = 0;

    function showCharacter(index) {
        characterCards.forEach(function(card) {
            card.classList.remove('active');
        });
        carouselDots.forEach(function(dot) {
            dot.classList.remove('active');
        });
        
        characterCards[index].classList.add('active');
        carouselDots[index].classList.add('active');
        currentCharacter = index;
        
        animateStatBars(characterCards[index]);
    }

    function animateStatBars(card) {
        var fills = card.querySelectorAll('.stat-fill');
        fills.forEach(function(fill) {
            var value = fill.getAttribute('data-value');
            fill.style.width = '0';
            setTimeout(function() {
                fill.style.width = value + '%';
            }, 100);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            var newIndex = currentCharacter - 1;
            if (newIndex < 0) newIndex = characterCards.length - 1;
            showCharacter(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            var newIndex = currentCharacter + 1;
            if (newIndex >= characterCards.length) newIndex = 0;
            showCharacter(newIndex);
        });
    }

    carouselDots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            showCharacter(index);
        });
    });

    // Auto-advance carousel
    var carouselInterval = setInterval(function() {
        var newIndex = currentCharacter + 1;
        if (newIndex >= characterCards.length) newIndex = 0;
        showCharacter(newIndex);
    }, 6000);

    var carousel = document.getElementById('characterCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            clearInterval(carouselInterval);
        });
        carousel.addEventListener('mouseleave', function() {
            carouselInterval = setInterval(function() {
                var newIndex = currentCharacter + 1;
                if (newIndex >= characterCards.length) newIndex = 0;
                showCharacter(newIndex);
            }, 6000);
        });
    }

    // Initialize first character stat bars
    if (characterCards.length > 0) {
        animateStatBars(characterCards[0]);
    }

    // ========================================
    // Season Selector
    // ========================================
    var seasons = [
        { name: 'Winter 2025', jp: '冬 2025' },
        { name: 'Spring 2025', jp: '春 2025' },
        { name: 'Summer 2025', jp: '夏 2025' },
        { name: 'Fall 2025', jp: '秋 2025' }
    ];
    var currentSeason = 1;

    var seasonName = document.getElementById('seasonName');
    var seasonJp = document.getElementById('seasonJp');
    var seasonPrev = document.getElementById('seasonPrev');
    var seasonNext = document.getElementById('seasonNext');

    function updateSeason(index) {
        if (seasonName && seasonJp) {
            seasonName.textContent = seasons[index].name;
            seasonJp.textContent = seasons[index].jp;
        }
        currentSeason = index;
    }

    if (seasonPrev) {
        seasonPrev.addEventListener('click', function() {
            var newIndex = currentSeason - 1;
            if (newIndex < 0) newIndex = seasons.length - 1;
            updateSeason(newIndex);
        });
    }

    if (seasonNext) {
        seasonNext.addEventListener('click', function() {
            var newIndex = currentSeason + 1;
            if (newIndex >= seasons.length) newIndex = 0;
            updateSeason(newIndex);
        });
    }

    // ========================================
    // Anime Progress Bars
    // ========================================
    var animeCards = document.querySelectorAll('.anime-card');

    var progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var progress = entry.target.getAttribute('data-progress');
                var fill = entry.target.querySelector('.anime-progress-fill');
                if (fill) {
                    setTimeout(function() {
                        fill.style.width = progress + '%';
                    }, 200);
                }
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    animeCards.forEach(function(card) {
        progressObserver.observe(card);
    });

    // ========================================
    // Track Button Toggle
    // ========================================
    var trackBtns = document.querySelectorAll('.anime-track-btn:not(.completed)');
    
    trackBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.classList.contains('tracking')) {
                this.classList.remove('tracking');
                this.querySelector('.track-icon').textContent = '+';
            } else {
                this.classList.add('tracking');
                this.querySelector('.track-icon').textContent = '✓';
            }
        });
    });

    // ========================================
    // Parallax Effect for Hero
    // ========================================
    var heroSection = document.querySelector('.hero');
    var heroPanels = document.querySelector('.hero-manga-panels');
    
    window.addEventListener('scroll', function() {
        if (heroSection && heroPanels) {
            var scrolled = window.scrollY;
            var heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                var parallaxValue = scrolled * 0.3;
                heroPanels.style.transform = 'translateY(' + parallaxValue + 'px)';
            }
        }
    });

    // ========================================
    // Manga Card Hover Effects
    // ========================================
    mangaCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });

    // ========================================
    // Button Ripple Effect
    // ========================================
    var buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var ripple = document.createElement('span');
            ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:ripple 0.6s linear;pointer-events:none;';
            
            var rect = this.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple keyframes
    var style = document.createElement('style');
    style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0;}}';
    document.head.appendChild(style);

    // ========================================
    // Keyboard Navigation
    // ========================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        if (carousel) {
            if (e.key === 'ArrowLeft') {
                var newIndex = currentCharacter - 1;
                if (newIndex < 0) newIndex = characterCards.length - 1;
                showCharacter(newIndex);
            }
            if (e.key === 'ArrowRight') {
                var newIndex = currentCharacter + 1;
                if (newIndex >= characterCards.length) newIndex = 0;
                showCharacter(newIndex);
            }
        }
    });

    // ========================================
    // Touch Swipe for Carousel
    // ========================================
    var touchStartX = 0;
    var touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                var newIndex = currentCharacter + 1;
                if (newIndex >= characterCards.length) newIndex = 0;
                showCharacter(newIndex);
            } else {
                var newIndex = currentCharacter - 1;
                if (newIndex < 0) newIndex = characterCards.length - 1;
                showCharacter(newIndex);
            }
        }
    }

    // ========================================
    // Debounce Utility
    // ========================================
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // ========================================
    // Performance: Reduce motion check
    // ========================================
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }

})();
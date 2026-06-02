/* ========================================
   INKBLOT - Manga & Anime Universe JavaScript
   ======================================== */

(function() {
    'use strict';

    // DOM Elements
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuBtn = document.querySelector('.nav-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const searchBtn = document.querySelector('.nav-search');
    const searchModal = document.querySelector('.search-modal');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.character-card');
    const dots = document.querySelectorAll('.dot');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const animeItems = document.querySelectorAll('.anime-list-item');
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const toastContainer = document.querySelector('.toast-container');
    const pageTransition = document.querySelector('.page-transition');

    // Variables
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let currentIndex = 0;
    const totalCards = cards.length;
    let autoplayInterval;

    // Initialize all functions
    function init() {
        initCursor();
        initNavigation();
        initMobileMenu();
        initSearchModal();
        initCharacterCarousel();
        initAnimeFilters();
        initNewsletterForm();
        initScrollEffects();
        initStatCounters();
        initToastNotifications();
        initIntersectionObserver();
        initHoverEffects();
        initPageLoad();
    }

    /* Custom Cursor */
    function initCursor() {
        if (!cursor || !follower) return;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        document.addEventListener('mousedown', function() {
            cursor.classList.add('clicking');
        });

        document.addEventListener('mouseup', function() {
            cursor.classList.remove('clicking');
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .manga-card, .anime-list-item, .news-card, input');
        interactiveElements.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', function() {
                cursor.classList.remove('hovering');
            });
        });
    }

    /* Navigation */
    function initNavigation() {
        if (!nav) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Update active nav link
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            
            sections.forEach(function(section) {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.offsetHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Smooth scroll
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* Mobile Menu */
    function initMobileMenu() {
        if (!menuBtn || !mobileMenu) return;

        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    /* Search Modal */
    function initSearchModal() {
        if (!searchBtn || !searchModal) return;

        function openSearch() {
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(function() {
                if (searchInput) searchInput.focus();
            }, 300);
        }

        function closeSearch() {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
        }

        searchBtn.addEventListener('click', openSearch);
        
        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearch();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearch();
            }
        });

        // Suggestion tags
        const suggestionTags = document.querySelectorAll('.suggestion-tag');
        suggestionTags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                if (searchInput) {
                    searchInput.value = this.textContent;
                    searchInput.focus();
                }
            });
        });
    }

    /* Character Carousel */
    function initCharacterCarousel() {
        if (!track || totalCards === 0) return;

        function updateCarousel() {
            cards.forEach(function(card, index) {
                card.classList.remove('active', 'prev');
                if (index === currentIndex) {
                    card.classList.add('active');
                    animateStatBars(card);
                } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
                    card.classList.add('prev');
                }
            });

            dots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function animateStatBars(card) {
            const statFills = card.querySelectorAll('.stat-fill');
            statFills.forEach(function(fill) {
                const fillWidth = fill.style.getPropertyValue('--fill');
                fill.style.width = '0';
                setTimeout(function() {
                    fill.style.width = fillWidth;
                }, 100);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + totalCards) % totalCards;
            updateCarousel();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);

        startAutoplay();
        setTimeout(function() {
            goToSlide(0);
        }, 500);
    }

    /* Anime Filters */
    function initAnimeFilters() {
        if (tabBtns.length === 0) return;

        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                tabBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                const filter = this.dataset.filter;

                animeItems.forEach(function(item) {
                    if (filter === 'all') {
                        item.style.display = 'grid';
                    } else {
                        const rank = parseInt(item.dataset.rank);
                        let show = false;
                        if (filter === 'popular' && rank <= 3) show = true;
                        if (filter === 'new' && rank > 3) show = true;
                        item.style.display = show ? 'grid' : 'none';
                    }
                });
            });
        });
    }

    /* Newsletter Form */
    function initNewsletterForm() {
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                showToast('Thank you for subscribing!');
                newsletterInput.value = '';
            } else {
                showToast('Please enter a valid email address', 'error');
                if (newsletterInput) newsletterInput.focus();
            }
        });
    }

    /* Scroll Effects */
    function initScrollEffects() {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroPanels = document.querySelectorAll('.manga-panel');
            
            heroPanels.forEach(function(panel, index) {
                const speed = 0.1 + (index * 0.05);
                panel.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
            });

            const heroContent = document.querySelector('.hero-text-container');
            if (heroContent) {
                const opacity = Math.max(0, 1 - scrolled / 500);
                heroContent.style.opacity = opacity;
            }
        });
    }

    /* Stat Counters */
    function initStatCounters() {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        let animated = false;

        function animateCounter(el) {
            const target = parseFloat(el.dataset.count);
            const duration = 2000;
            const startTime = performance.now();
            const isDecimal = target % 1 !== 0;

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = target * easeOutQuart;

                if (isDecimal) {
                    el.textContent = current.toFixed(1);
                } else {
                    el.textContent = Math.floor(current).toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(function(stat, index) {
                        setTimeout(function() {
                            animateCounter(stat);
                            stat.parentElement.classList.add('visible');
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    /* Toast Notifications */
    function initToastNotifications() {
        window.showToast = function(message, type) {
            type = type || 'success';
            
            if (!toastContainer) return;

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = '<div class="toast-icon">' + (type === 'success' ? '&#10003;' : '!') + '</div><span class="toast-message">' + message + '</span>';
            
            toastContainer.appendChild(toast);

            setTimeout(function() {
                toast.classList.add('removing');
                setTimeout(function() {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        };

        // Bookmark button handlers
        const bookmarkBtns = document.querySelectorAll('.action-btn.bookmark');
        bookmarkBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                this.classList.toggle('bookmarked');
                const isBookmarked = this.classList.contains('bookmarked');
                showToast(isBookmarked ? 'Added to watchlist!' : 'Removed from watchlist!');
            });
        });
    }

    /* Intersection Observer */
    function initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.manga-card, .news-card').forEach(function(el) {
            observer.observe(el);
        });
    }

    /* Hover Effects */
    function initHoverEffects() {
        const mangaCards = document.querySelectorAll('.manga-card');
        mangaCards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });

        // Read button
        document.querySelectorAll('.read-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                showToast('Opening manga reader...');
            });
        });

        // Play button
        document.querySelectorAll('.play-button, .action-btn.play').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                showToast('Opening player...');
            });
        });

        // Bookmark buttons
        document.querySelectorAll('.action-btn.bookmark').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // Social links
        document.querySelectorAll('.social-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.getAttribute('aria-label');
                showToast('Opening ' + platform + '...');
            });
        });
    }

    /* Page Load Animation */
    function initPageLoad() {
        if (pageTransition) {
            pageTransition.classList.remove('active');
        }

        const heroElements = document.querySelectorAll('.hero-subtitle, .hero-title .title-line, .hero-description, .hero-cta');
        heroElements.forEach(function(el, index) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(function() {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + (index * 150));
        });
    }

    /* Keyboard Navigation */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    /* Reduce Motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }

    /* Console Branding */
    console.log('%c INKBLOT', 'font-size: 24px; font-weight: bold; color: #ff3366; text-shadow: 2px 2px 0 #00d4ff;');
    console.log('%cManga & Anime Universe', 'font-size: 14px; color: #b8b8c8;');
    console.log('%cWelcome, Otaku! ', 'font-size: 12px; color: #6a6a7a;');

    /* Initialize on DOM Ready */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
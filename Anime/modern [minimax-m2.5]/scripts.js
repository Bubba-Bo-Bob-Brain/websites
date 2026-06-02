/* ============================================ INKVERSE - Manga & Anime Website JavaScript ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCursor();
    initNavigation();
    initMobileMenu();
    initHeroStats();
    initMangaFilter();
    initAnimeCarousel();
    initCharacterCarousel();
    initSeasonalTracker();
    initScrollTop();
    initScrollAnimations();
    initNewsletter();
});

/* ============================================ Custom Cursor ============================================ */
function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorOuter = cursor.querySelector('.cursor-outer');
    const cursorInner = cursor.querySelector('.cursor-inner');
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorInner.style.left = mouseX + 'px';
        cursorInner.style.top = mouseY + 'px';
    });
    
    // Smooth outer cursor animation
    (function animateCursor() {
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
        cursorOuter.style.left = outerX + 'px';
        cursorOuter.style.top = outerY + 'px';
        requestAnimationFrame(animateCursor);
    })();
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .manga-card, .character-card, .thumb');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Hide default cursor on hover
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button').forEach(el => {
        el.style.cursor = 'none';
    });
}

/* ============================================ Navigation ============================================ */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================ Mobile Menu ============================================ */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    let isOpen = false;
    
    navToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            animateHamburger(true);
        } else {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            animateHamburger(false);
        }
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            isOpen = false;
            animateHamburger(false);
        });
    });
    
    function animateHamburger(open) {
        const spans = navToggle.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    }
}

/* ============================================ Hero Stats Counter ============================================ */
function initHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        const statsSection = document.querySelector('.hero-stats');
        const rect = statsSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight - 100) {
            animated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(target * easeOut);
                    
                    stat.textContent = current + (target === 98 ? '%' : target === 25 ? 'M+' : '');
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }
                
                requestAnimationFrame(updateCounter);
            });
        }
    }
    
    window.addEventListener('scroll', animateStats);
    // Check on load
    animateStats();
}

/* ============================================ Manga Filter ============================================ */
function initMangaFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mangaCards = document.querySelectorAll('.manga-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter cards
            mangaCards.forEach(card => {
                const genre = card.getAttribute('data-genre');
                if (filter === 'all' || genre === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ============================================ Anime Carousel ============================================ */
function initAnimeCarousel() {
    const slides = document.querySelectorAll('.anime-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoPlayInterval;
    
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i < index) slide.classList.add('prev');
        });
        
        // Add active to current slide
        slides[index].classList.add('active');
        
        // Update indicators
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(i);
            startAutoPlay();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });
    
    // Start autoplay
    startAutoPlay();
}

/* ============================================ Character Carousel ============================================ */
function initCharacterCarousel() {
    const characterCards = document.querySelectorAll('.character-card');
    const prevCharBtn = document.getElementById('prevChar');
    const nextCharBtn = document.getElementById('nextChar');
    const thumbnails = document.querySelectorAll('.thumb');
    let currentCharacter = 0;
    
    function showCharacter(index) {
        characterCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        currentCharacter = index;
    }
    
    function nextCharacter() {
        const next = (currentCharacter + 1) % characterCards.length;
        showCharacter(next);
    }
    
    function prevCharacter() {
        const prev = (currentCharacter - 1 + characterCards.length) % characterCards.length;
        showCharacter(prev);
    }
    
    prevCharBtn.addEventListener('click', prevCharacter);
    nextCharBtn.addEventListener('click', nextCharacter);
    
    thumbnails.forEach((thumb, i) => {
        thumb.addEventListener('click', () => showCharacter(i));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevCharacter();
        else if (e.key === 'ArrowRight') nextCharacter();
    });
    
    // Auto-animate stat bars when character changes
    characterCards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statFills = entry.target.querySelectorAll('.stat-fill');
                    statFills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 100);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(characterCards[index]);
    });
}

/* ============================================ Seasonal Tracker ============================================ */
function initSeasonalTracker() {
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonPanels = document.querySelectorAll('.season-panel');
    
    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const season = tab.getAttribute('data-season');
            
            // Update active tab
            seasonTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding panel
            seasonPanels.forEach(panel => {
                panel.classList.toggle('active', panel.getAttribute('data-season') === season);
            });
        });
    });
    
    // Update tracker stats based on status
    function updateTrackerStats() {
        const watchingCount = document.querySelectorAll('.item-status.watching').length;
        const completedCount = document.querySelectorAll('.item-status.completed').length;
        const plannedCount = document.querySelectorAll('.item-status.planned').length;
        
        document.getElementById('watchingCount').textContent = watchingCount;
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('plannedCount').textContent = plannedCount;
    }
    
    updateTrackerStats();
}

/* ============================================ Scroll to Top ============================================ */
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================ Scroll Animations ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .manga-card, .anime-slide, .character-card, .season-panel, .newsletter-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Stagger animation for manga cards
    const mangaCards = document.querySelectorAll('.manga-card');
    mangaCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

/* ============================================ Newsletter Form ============================================ */
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('.newsletter-input').value;
        
        // Simulate subscription (in production, this would call an API)
        const btn = form.querySelector('.newsletter-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Subscribed!</span> <span>✓</span>';
        btn.style.background = '#22c55e';
        
        form.querySelector('.newsletter-input').value = '';
        form.querySelector('.newsletter-input').placeholder = 'Thank you for subscribing!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

/* ============================================ Utility Functions ============================================ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================ Additional Effects ============================================ */
// Parallax effect for hero section
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}, 16));

// Add ink splash animation on hover for manga cards
document.querySelectorAll('.manga-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const splash = document.createElement('div');
        splash.className = 'hover-splash';
        splash.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: var(--ink-accent);
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.3;
            pointer-events: none;
            animation: splashExpand 0.5s ease-out forwards;
        `;
        card.appendChild(splash);
        setTimeout(() => splash.remove(), 500);
    });
});

// Add keyframe for splash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes splashExpand {
        0% { transform: scale(0); opacity: 0.3; }
        100% { transform: scale(3); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Audio visualizer effect on character cards (visual only)
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const aura = card.querySelector('.character-aura');
        if (aura) {
            aura.style.animationDuration = '1s';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const aura = card.querySelector('.character-aura');
        if (aura) {
            aura.style.animationDuration = '3s';
        }
    });
});

// Smooth reveal for sections
const revealSection = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

// Initialize intersection observer for sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    
    const observer = new IntersectionObserver(revealSection, { threshold: 0.1 });
    observer.observe(section);
});

// Console message for fun
console.log('%c🎌 INKVERSE - Manga & Anime Universe', 'font-size: 20px; color: #ff2d2d; font-weight: bold;');
console.log('%cWelcome to the dark side of anime! アニメの世界へようこそ！', 'font-size: 14px; color: #f5f5f5;');
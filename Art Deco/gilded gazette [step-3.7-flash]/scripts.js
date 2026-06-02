/* ============================================ GATSBY'S GAZETTE - IMMERSIVE ART DECO EXPERIENCE Lavish 1920s Editorial JavaScript ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initChampagneBubbles();
    initParallaxHero();
    initScrollAnimations();
    initNavigation();
    initSmoothScrolling();
    initArticleReveal();
    initReadingProgress();
});

/* --- Preloader Sequence --- */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // Ensure minimum display time for dramatic effect
    const minDisplayTime = 2000;
    const startTime = Date.now();
    
    window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsed);
        
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Clean up DOM after transition
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.remove();
                }
            }, 800);
        }, remainingTime);
    });
}

/* --- Champagne Bubble Particle System --- */
function initChampagneBubbles() {
    const container = document.querySelector('.champagne-bubbles');
    if (!container) return;
    
    const config = {
        maxBubbles: 30,
        spawnInterval: 400,
        minSize: 3,
        maxSize: 10,
        minDuration: 8,
        maxDuration: 14
    };
    
    const activeBubbles = [];
    
    // Initial burst of bubbles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBubble(container, activeBubbles, config), i * 100);
    }
    
    // Continuous gentle stream
    setInterval(() => {
        if (activeBubbles.length < config.maxBubbles) {
            createBubble(container, activeBubbles, config);
        }
    }, config.spawnInterval);
}

function createBubble(container, activeBubbles, config) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Organic size variation
    const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random horizontal distribution with slight clustering
    const leftPos = Math.random() * 100;
    bubble.style.left = `${leftPos}%`;
    
    // Varied ascent speeds for natural feel
    const duration = Math.random() * (config.maxDuration - config.minDuration) + config.minDuration;
    bubble.style.animationDuration = `${duration}s`;
    
    // Staggered start times
    const delay = Math.random() * 2;
    bubble.style.animationDelay = `${delay}s`;
    
    // Slight color variation - some more golden, some more white
    const hue = Math.random() > 0.7 ? '45deg' : '40deg';
    const saturation = Math.random() > 0.5 ? '80%' : '60%';
    bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1}))`;
    
    container.appendChild(bubble);
    activeBubbles.push(bubble);
    
    // Cleanup after animation
    const totalLifetime = (duration + delay) * 1000 + 500;
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
            const index = activeBubbles.indexOf(bubble);
            if (index > -1) activeBubbles.splice(index, 1);
        }
    }, totalLifetime);
}

/* --- Parallax Hero Background --- */
function initParallaxHero() {
    const heroBg = document.querySelector('.hero-bg');
    const hero = document.querySelector('.hero');
    if (!heroBg || !hero) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        // Only calculate when hero is visible
        if (scrollY <= heroHeight) {
            // Smooth parallax with easing
            const parallaxSpeed = 0.35;
            const yOffset = scrollY * parallaxSpeed;
            heroBg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            
            // Fade effect based on scroll
            const opacity = 1 - (scrollY / heroHeight) * 0.5;
            heroBg.style.opacity = Math.max(0.5, opacity);
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call
    updateParallax();
}

/* --- Intersection Observer for Scroll Animations --- */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add staggered delay for grouped elements
                if (entry.target.classList.contains('vintage-ad')) {
                    const ads = entry.target.parentElement.querySelectorAll('.vintage-ad');
                    ads.forEach((ad, index) => {
                        ad.style.transitionDelay = `${index * 0.15}s`;
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sidebar advertisements
    document.querySelectorAll('.vintage-ad').forEach(ad => {
        ad.classList.add('animate-on-scroll');
        observer.observe(ad);
    });
    
    // Observe society snippet
    const societySnippet = document.querySelector('.society-snippet');
    if (societySnippet) {
        societySnippet.classList.add('animate-on-scroll');
        observer.observe(societySnippet);
    }
    
    // Observe geometric dividers
    document.querySelectorAll('.geo-divider').forEach(divider => {
        divider.classList.add('animate-on-scroll');
        observer.observe(divider);
    });
}

/* --- Navigation Active State --- */
function initNavigation() {
    const sections = document.querySelectorAll('section[id], article[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    // Inject active state styles
    const navStyles = document.createElement('style');
    navStyles.textContent = `
        .main-nav a.active {
            color: #FFEAA7;
        }
        .main-nav a.active::after {
            width: 100%;
            background: #FFEAA7;
        }
    `;
    document.head.appendChild(navStyles);
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/* --- Smooth Scrolling with Offset --- */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll with custom easing
                const startPosition = window.pageYOffset;
                const distance = offsetPosition - startPosition;
                const duration = 1200;
                let startTime = null;
                
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Ease in-out cubic
                    const ease = progress < 0.5 
                        ? 4 * progress * progress * progress 
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * ease);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}

/* --- Article Content Reveal Animation --- */
function initArticleReveal() {
    const articles = document.querySelectorAll('.feature-article');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const article = entry.target;
                revealArticleContent(article);
                observer.unobserve(article);
            }
        });
    }, observerOptions);
    
    articles.forEach(article => {
        // Set initial states
        const elements = article.querySelectorAll('.article-headline, .article-meta, .article-image, .article-content p, .geo-divider');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        observer.observe(article);
    });
}

function revealArticleContent(article) {
    const timeline = [
        { selector: '.article-headline', delay: 0, duration: 800 },
        { selector: '.article-meta', delay: 200, duration: 600 },
        { selector: '.article-image', delay: 400, duration: 1000 },
        { selector: '.article-content p', delay: 600, duration: 600, stagger: 100 },
        { selector: '.geo-divider', delay: 800, duration: 800 }
    ];
    
    timeline.forEach(item => {
        const elements = article.querySelectorAll(item.selector);
        elements.forEach((el, index) => {
            const staggerDelay = item.stagger ? index * item.stagger : 0;
            const totalDelay = item.delay + staggerDelay;
            
            setTimeout(() => {
                el.style.transition = `opacity ${item.duration}ms ease, transform ${item.duration}ms ease`;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, totalDelay);
        });
    });
}

/* --- Reading Progress Indicator --- */
function initReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.classList.add('reading-progress');
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    // Inject styles
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(212, 175, 55, 0.2);
            z-index: 10000;
            pointer-events: none;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #D4AF37, #FFEAA7, #D4AF37);
            width: 0%;
            transition: width 0.1s linear;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
    `;
    document.head.appendChild(progressStyles);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
    }, { passive: true });
}

/* --- Elegant Hover Effects for Ads --- */
document.querySelectorAll('.vintage-ad').forEach(ad => {
    ad.addEventListener('mouseenter', function() {
        const border = this.querySelector('.ad-border');
        if (border) {
            border.style.transform = 'scale(1.02)';
            border.style.transition = 'transform 0.3s ease';
        }
    });
    
    ad.addEventListener('mouseleave', function() {
        const border = this.querySelector('.ad-border');
        if (border) {
            border.style.transform = 'scale(1)';
        }
    });
});

/* --- Keyboard Navigation Enhancement --- */
document.addEventListener('keydown', (e) => {
    // Press 'M' to return to masthead
    if (e.key === 'm' || e.key === 'M') {
        if (document.activeElement.tagName !== 'INPUT') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
});

/* --- Console Easter Egg --- */
console.log('%c Gatsby\'s Gazette %c Est. 1925 ', 
    'background: #0A0A0A; color: #D4AF37; font-size: 20px; padding: 10px; font-family: serif; letter-spacing: 2px;',
    'background: #D4AF37; color: #0A0A0A; font-size: 12px; padding: 10px;'
);
console.log('%cThe parties continue...', 'color: #D4AF37; font-style: italic;');
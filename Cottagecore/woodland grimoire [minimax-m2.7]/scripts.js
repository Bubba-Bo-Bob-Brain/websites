/* =====================================================
THE COTTAGE WITCH'S HERBALIST GUIDE - SCRIPTS
Bringing Magic to Life
===================================================== */

/**
 * Wait for DOM to be fully loaded
 */
const waitForDOM = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

/**
 * Debounce function for performance
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for scroll events
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if element is in viewport
 */
const isInViewport = (element, threshold = 0.2) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
};

/**
 * Get current moon phase name
 */
const getMoonPhaseName = (illumination) => {
    if (illumination < 0.03) return 'New Moon';
    if (illumination < 0.22) return 'Waxing Crescent';
    if (illumination < 0.28) return 'First Quarter';
    if (illumination < 0.47) return 'Waxing Gibbous';
    if (illumination < 0.53) return 'Full Moon';
    if (illumination < 0.72) return 'Waning Gibbous';
    if (illumination < 0.78) return 'Last Quarter';
    if (illumination < 0.97) return 'Waning Crescent';
    return 'New Moon';
};

/* =====================================================
LOADING SCREEN
===================================================== */
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContent = document.getElementById('main-content');
        this.minLoadTime = 2500;
        this.maxLoadTime = 4000;
        this.init();
    }

    init() {
        if (!this.loadingScreen) return;
        
        this.loadingScreen.addEventListener('click', () => this.hideLoadingScreen());
        setTimeout(() => this.hideLoadingScreen(), this.maxLoadTime);
        setTimeout(() => this.showMainContent(), this.minLoadTime);
    }

    hideLoadingScreen() {
        if (this.loadingScreen.classList.contains('hidden')) return;
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            if (this.loadingScreen.parentNode) {
                this.loadingScreen.parentNode.removeChild(this.loadingScreen);
            }
        }, 800);
    }

    showMainContent() {
        if (this.mainContent) {
            this.mainContent.classList.add('visible');
            setTimeout(() => this.animateEntrance(), 300);
        }
    }

    animateEntrance() {
        const headers = document.querySelectorAll('.section-header');
        headers.forEach((header, index) => {
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, index * 200);
        });

        const cards = document.querySelectorAll('.potion-card, .flower-card, .foraging-item, .note-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotate(0deg)';
            }, 500 + (index * 100));
        });
    }
}

/* =====================================================
NIGHT MODE TOGGLE (Moth & Candlelight)
===================================================== */
class NightModeToggle {
    constructor() {
        this.toggle = document.getElementById('night-toggle');
        this.isNightMode = false;
        this.candleFlame = document.querySelector('.candle-flame');
        this.moth = document.querySelector('.moth');
        this.init();
    }

    init() {
        if (!this.toggle) return;

        const savedTheme = localStorage.getItem('cottageWitchTheme');
        if (savedTheme === 'night') {
            this.enableNightMode();
        }

        this.toggle.addEventListener('click', () => this.toggleNightMode());
        
        this.toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleNightMode();
            }
        });

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('cottageWitchTheme')) {
                    if (e.matches) {
                        this.enableNightMode();
                    } else {
                        this.disableNightMode();
                    }
                }
            });
        }
    }

    toggleNightMode() {
        if (this.isNightMode) {
            this.disableNightMode();
        } else {
            this.enableNightMode();
        }
    }

    enableNightMode() {
        this.isNightMode = true;
        document.documentElement.setAttribute('data-theme', 'night');
        localStorage.setItem('cottageWitchTheme', 'night');
        this.animateCandleBrighter();
        this.animateMothActive();
        this.addStarfield();
        if (this.toggle) {
            this.toggle.setAttribute('aria-label', 'Switch to day mode');
        }
    }

    disableNightMode() {
        this.isNightMode = false;
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('cottageWitchTheme', 'day');
        this.animateCandleNormal();
        this.animateMothRest();
        this.removeStarfield();
        if (this.toggle) {
            this.toggle.setAttribute('aria-label', 'Switch to night mode');
        }
    }

    animateCandleBrighter() {
        if (this.candleFlame) {
            this.candleFlame.style.transition = 'all 0.5s ease';
            this.candleFlame.style.filter = 'brightness(1.5)';
            this.candleFlame.style.transform = 'scale(1.2)';
        }
    }

    animateCandleNormal() {
        if (this.candleFlame) {
            this.candleFlame.style.filter = 'brightness(1)';
            this.candleFlame.style.transform = 'scale(1)';
        }
    }

    animateMothActive() {
        if (this.moth) {
            this.moth.style.transition = 'all 0.3s ease';
            this.moth.style.transform = 'scale(1.1)';
            this.moth.style.filter = 'drop-shadow(0 0 5px var(--gold))';
        }
    }

    animateMothRest() {
        if (this.moth) {
            this.moth.style.transform = 'scale(1)';
            this.moth.style.filter = 'none';
        }
    }

    addStarfield() {
        if (document.querySelector('.starfield')) return;
        
        const starfield = document.createElement('div');
        starfield.className = 'starfield';
        starfield.innerHTML = this.generateStars(50);
        document.body.appendChild(starfield);
        
        setTimeout(() => {
            starfield.style.opacity = '1';
        }, 100);
    }

    removeStarfield() {
        const starfield = document.querySelector('.starfield');
        if (starfield) {
            starfield.style.opacity = '0';
            setTimeout(() => {
                if (starfield.parentNode) starfield.parentNode.removeChild(starfield);
            }, 500);
        }
    }

    generateStars(count) {
        let stars = '';
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 1;
            const delay = Math.random() * 3;
            const duration = Math.random() * 2 + 2;
            stars += `<div class="star-field-star" style="
                left: ${x}%; 
                top: ${y}%; 
                width: ${size}px; 
                height: ${size}px; 
                animation-delay: ${delay}s; 
                animation-duration: ${duration}s;
            "></div>`;
        }
        return stars;
    }
}

/* =====================================================
MOON PHASE INDICATOR
===================================================== */
class MoonPhaseIndicator {
    constructor() {
        this.container = document.querySelector('.moon-phase');
        this.phaseText = document.querySelector('.moon-phase-text');
        this.moonSvg = document.querySelector('.moon-svg');
        this.init();
    }

    init() {
        if (!this.container) return;
        const phase = this.calculateMoonPhase();
        this.updateMoonVisual(phase);
        this.updatePhaseText(phase);
    }

    calculateMoonPhase() {
        const newMoonJDN = 2451550;
        const synodicMonth = 29.530588853;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        
        let jdn = (1461 * (year + 4800 + (month - 14) / 12)) / 4 + 
                  (367 * (month - 2 - 12 * ((month - 14) / 12))) / 12 - 
                  (3 * ((year + 4900 + (month - 14) / 12) / 100)) / 4 + 
                  day - 32075;
        
        const daysSinceNew = jdn - newMoonJDN;
        const currentCycleDay = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
        const illumination = (1 - Math.cos((2 * Math.PI * currentCycleDay) / synodicMonth)) / 2;
        
        return {
            day: currentCycleDay,
            illumination: illumination,
            phase: Math.floor((currentCycleDay / synodicMonth) * 8) % 8
        };
    }

    updateMoonVisual(phase) {
        if (!this.moonSvg) return;
        const mask = this.moonSvg.querySelector('#moon-mask circle:last-child');
        if (mask) {
            const shadowOffset = phase.illumination * 50;
            mask.style.transform = `translateX(${shadowOffset - 25}px)`;
        }
    }

    updatePhaseText(phase) {
        if (!this.phaseText) return;
        const phaseName = getMoonPhaseName(phase.illumination);
        this.phaseText.textContent = phaseName;
        const percentage = Math.round(phase.illumination * 100);
        this.phaseText.setAttribute('title', `${percentage}% illuminated`);
    }
}

/* =====================================================
NAVIGATION
===================================================== */
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.content-section');
        this.init();
    }

    init() {
        if (!this.navLinks.length) return;

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                    this.updateActiveLink(link);
                }
            });
        });

        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
        this.handleScroll();
    }

    smoothScrollTo(element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    handleScroll() {
        const scrollPosition = window.scrollY + 200;
        this.sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const correspondingLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (correspondingLink) {
                    this.updateActiveLink(correspondingLink);
                }
            }
        });
    }

    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link === activeLink) {
                link.classList.add('active');
            }
        });
    }
}

/* =====================================================
SEASONAL TABS
===================================================== */
class SeasonalTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.season-tab');
        this.contents = document.querySelectorAll('.season-content');
        this.init();
    }

    init() {
        if (!this.tabs.length) return;

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchSeason(tab));
            
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    this.handleKeyboardNavigation(e);
                }
            });
        });
    }

    switchSeason(selectedTab) {
        const season = selectedTab.dataset.season;

        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab === selectedTab) {
                tab.classList.add('active');
            }
        });

        this.contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${season}-content`) {
                content.classList.add('active');
                this.animateItems(content);
            }
        });

        if (history.pushState) {
            history.pushState(null, '', `#${season}`);
        } else {
            window.location.hash = season;
        }
    }

    animateItems(container) {
        const items = container.querySelectorAll('.foraging-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleKeyboardNavigation(e) {
        const activeTab = document.querySelector('.season-tab.active');
        const currentIndex = Array.from(this.tabs).indexOf(activeTab);
        let newIndex;
        
        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        } else {
            newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        this.tabs[newIndex].focus();
        this.switchSeason(this.tabs[newIndex]);
    }
}

/* =====================================================
SCROLL ANIMATIONS
===================================================== */
class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.collectAnimatedElements();
        this.checkVisibleElements();
        window.addEventListener('scroll', throttle(() => this.checkVisibleElements(), 100));
        window.addEventListener('resize', debounce(() => this.collectAnimatedElements(), 200));
    }

    collectAnimatedElements() {
        document.querySelectorAll('.section-header').forEach(el => {
            if (!this.animatedElements.includes(el)) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                this.animatedElements.push(el);
            }
        });

        document.querySelectorAll('.potion-card, .flower-card, .foraging-item, .note-card').forEach(el => {
            if (!el.style.opacity || el.style.opacity === '1') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                if (!this.animatedElements.includes(el)) {
                    this.animatedElements.push(el);
                }
            }
        });

        document.querySelectorAll('.legend-item').forEach(el => {
            if (!this.animatedElements.includes(el)) {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                this.animatedElements.push(el);
            }
        });
    }

    checkVisibleElements() {
        this.animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0)';
            }
        });
    }
}

/* =====================================================
INTERSECTION OBSERVER FOR LAZY LOADING
===================================================== */
class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px', threshold: 0.1 });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* =====================================================
PARALLAX EFFECTS
===================================================== */
class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('.watercolor-splash, .hero-illustration');
        this.enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        if (!this.enabled) return;
        window.addEventListener('scroll', throttle(() => this.updateParallax(), 50));
        this.updateParallax();
    }

    updateParallax() {
        const scrollY = window.scrollY;
        this.elements.forEach((element, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

/* =====================================================
SMOOTH SCROLL FOR ANCHOR LINKS
===================================================== */
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/* =====================================================
ACCESSIBILITY ENHANCEMENTS
===================================================== */
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.createSkipLink();
        this.setupFocusTrap();
        this.setupReducedMotion();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.open').forEach(modal => {
                    modal.classList.remove('open');
                });
            }
        });
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-medium', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    }
}

/* =====================================================
SEASONAL CELEBRATION
===================================================== */
class SeasonalCelebration {
    constructor() {
        this.checkSeason();
    }

    checkSeason() {
        const month = new Date().getMonth();
        
        if (month >= 2 && month <= 4) {
            this.addPetalEffect();
        }
        if (month >= 5 && month <= 7) {
            this.addFireflyEffect();
        }
        if (month >= 8 && month <= 10) {
            this.addLeafEffect();
        }
        if (month === 11 || month <= 1) {
            this.addSnowflakeEffect();
        }
    }

    addPetalEffect() {
        // Floating petal decorations for spring
        const petalsContainer = document.createElement('div');
        petalsContainer.className = 'seasonal-petals';
        petalsContainer.innerHTML = `
            <style>
                .seasonal-petals {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                    overflow: hidden;
                }
                .petal {
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    background: linear-gradient(135deg, rgba(255, 182, 193, 0.6), rgba(255, 218, 233, 0.4));
                    border-radius: 50% 0 50% 50%;
                    animation: petalFall linear infinite;
                    opacity: 0.5;
                }
                @keyframes petalFall {
                    0% {
                        transform: translateY(-20px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.5;
                    }
                    90% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            </style>
        `;
        
        for (let i = 0; i < 8; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
            petal.style.animationDelay = (Math.random() * 10) + 's';
            petalsContainer.appendChild(petal);
        }
        
        document.body.appendChild(petalsContainer);
    }

    addFireflyEffect() {
        // Summer firefly decorations
        const firefliesContainer = document.createElement('div');
        firefliesContainer.className = 'seasonal-fireflies';
        firefliesContainer.innerHTML = `
            <style>
                .seasonal-fireflies {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }
                .firefly {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: radial-gradient(circle, rgba(255, 255, 150, 0.9), rgba(255, 255, 100, 0.3));
                    border-radius: 50%;
                    animation: fireflyGlow ease-in-out infinite;
                    box-shadow: 0 0 10px 3px rgba(255, 255, 150, 0.5);
                }
                @keyframes fireflyGlow {
                    0%, 100% {
                        opacity: 0;
                        transform: translate(0, 0);
                    }
                    25% {
                        opacity: 0.9;
                    }
                    50% {
                        opacity: 0.4;
                        transform: translate(20px, -30px);
                    }
                    75% {
                        opacity: 0.8;
                    }
                }
            </style>
        `;
        
        for (let i = 0; i < 6; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';
            firefly.style.left = (20 + Math.random() * 60) + '%';
            firefly.style.top = (30 + Math.random() * 50) + '%';
            firefly.style.animationDuration = (3 + Math.random() * 4) + 's';
            firefly.style.animationDelay = (Math.random() * 5) + 's';
            firefliesContainer.appendChild(firefly);
        }
        
        document.body.appendChild(firefliesContainer);
    }

    addLeafEffect() {
        // Autumn falling leaves
        const leavesContainer = document.createElement('div');
        leavesContainer.className = 'seasonal-leaves';
        leavesContainer.innerHTML = `
            <style>
                .seasonal-leaves {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                    overflow: hidden;
                }
                .autumn-leaf {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    animation: leafFall linear infinite;
                }
                .autumn-leaf svg {
                    width: 100%;
                    height: 100%;
                }
                @keyframes leafFall {
                    0% {
                        transform: translateY(-30px) rotate(0deg) translateX(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.7;
                    }
                    90% {
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(100vh) rotate(540deg) translateX(100px);
                        opacity: 0;
                    }
                }
            </style>
        `;
        
        const leafColors = ['#c4a060', '#b7410e', '#8b4513', '#d2691e', '#a0522d'];
        
        for (let i = 0; i < 6; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'autumn-leaf';
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDuration = (8 + Math.random() * 8) + 's';
            leaf.style.animationDelay = (Math.random() * 10) + 's';
            leaf.style.color = leafColors[Math.floor(Math.random() * leafColors.length)];
            leaf.innerHTML = `<svg viewBox="0 0 20 20"><path d="M10 0 Q15 5 15 10 Q15 15 10 20 Q5 15 5 10 Q5 5 10 0" fill="currentColor"/></svg>`;
            leavesContainer.appendChild(leaf);
        }
        
        document.body.appendChild(leavesContainer);
    }

    addSnowflakeEffect() {
        // Winter snowflakes
        const snowContainer = document.createElement('div');
        snowContainer.className = 'seasonal-snow';
        snowContainer.innerHTML = `
            <style>
                .seasonal-snow {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                    overflow: hidden;
                }
                .snowflake-char {
                    position: absolute;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    animation: snowFall linear infinite;
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
                @keyframes snowFall {
                    0% {
                        transform: translateY(-20px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                    }
                    90% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            </style>
        `;
        
        const snowflakes = ['❄', '❅', '❆', '✧', '✦'];
        
        for (let i = 0; i < 15; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake-char';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = (5 + Math.random() * 10) + 's';
            snowflake.style.animationDelay = (Math.random() * 8) + 's';
            snowflake.style.fontSize = (10 + Math.random() * 10) + 'px';
            snowContainer.appendChild(snowflake);
        }
        
        document.body.appendChild(snowContainer);
    }
}

/* =====================================================
PERFORMANCE MONITORING
===================================================== */
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.duration > 50) {
                            console.log('Long task detected:', entry.name);
                        }
                    });
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Not supported
            }
        }
    }
}

/* =====================================================
ADDITIONAL CSS STYLES FOR DYNAMIC ELEMENTS
===================================================== */
const addDynamicStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* Starfield styles */
        .starfield {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .star-field-star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: starTwinkleField 3s ease-in-out infinite;
        }
        
        @keyframes starTwinkleField {
            0%, 100% {
                opacity: 0.2;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.5);
            }
        }
        
        /* Skip link */
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--forest);
            color: white;
            padding: 8px 16px;
            z-index: 10000;
            transition: top 0.3s;
            text-decoration: none;
            font-family: var(--font-handwriting);
            border-radius: 0 0 8px 0;
        }
        
        .skip-link:focus {
            top: 0;
        }
        
        /* Cursor trail */
        .cursor-trail {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9998;
        }
        
        .trail-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--sage);
            border-radius: 50%;
            opacity: 0.6;
            transform: translate(-50%, -50%);
            animation: trailFade 0.5s ease-out forwards;
        }
        
        @keyframes trailFade {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
            }
        }
        
        /* Night mode specific starfield */
        [data-theme="night"] .starfield {
            opacity: 1;
        }
        
        /* Night mode corner flourish */
        [data-theme="night"] .corner-flourish {
            color: var(--gold);
            opacity: 0.3;
        }
        
        /* Smooth reveal for sections */
        .content-section {
            opacity: 1;
        }
        
        /* Paper fold effect for notes */
        .note-paper::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 0 30px 30px;
            border-color: transparent transparent rgba(0,0,0,0.05) transparent;
        }
        
        /* Hover effect for foraging items */
        .foraging-item:hover .foraging-icon {
            transform: scale(1.1);
        }
        
        .foraging-item .foraging-icon {
            transition: transform 0.3s ease;
        }
        
        /* Potion card liquid shimmer */
        .potion-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
            );
            transition: left 0.5s ease;
        }
        
        .potion-card:hover::after {
            left: 150%;
        }
        
        /* Wheel animation pause on hover */
        .wheel-svg:hover {
            animation-play-state: paused;
        }
        
        /* Enhanced pressed flower frame */
        .specimen-frame::before {
            content: '';
            position: absolute;
            inset: 5px;
            border: 1px solid var(--parchment-aged);
            pointer-events: none;
            opacity: 0.5;
        }
        
        /* Recipe note paper lines */
        .note-card.aged-paper .note-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 30px;
            width: 1px;
            height: 100%;
            background: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 23px,
                rgba(139, 90, 43, 0.1) 24px
            );
        }
    `;
    document.head.appendChild(styleSheet);
};

/* =====================================================
INITIALIZE ALL FEATURES
===================================================== */
waitForDOM(() => {
    console.log('✨ The Cottage Witch\'s Herbalist Guide is awakening...');
    
    // Add dynamic CSS styles
    addDynamicStyles();
    
    // Initialize all features
    new LoadingScreen();
    new NightModeToggle();
    new MoonPhaseIndicator();
    new Navigation();
    new SeasonalTabs();
    new ScrollAnimations();
    new ParallaxEffects();
    new LazyLoader();
    new SmoothScroll();
    new AccessibilityEnhancements();
    new SeasonalCelebration();
    new PerformanceMonitor();
    
    console.log('🌿 All magical systems initialized!');
    
    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('cottageWitchReady'));
});

/* =====================================================
EXPORT FOR DEBUGGING (in development)
===================================================== */
if (typeof window !== 'undefined') {
    window.CottageWitch = {
        version: '1.0.0',
        getLoadingScreen: () => document.getElementById('loading-screen'),
        getMainContent: () => document.getElementById('main-content'),
        isNightMode: () => document.documentElement.getAttribute('data-theme') === 'night',
        toggleNightMode: () => {
            const toggle = new NightModeToggle();
            toggle.toggleNightMode();
        },
        getCurrentSeason: () => {
            const month = new Date().getMonth();
            if (month >= 2 && month <= 4) return 'spring';
            if (month >= 5 && month <= 7) return 'summer';
            if (month >= 8 && month <= 10) return 'autumn';
            return 'winter';
        }
    };
}
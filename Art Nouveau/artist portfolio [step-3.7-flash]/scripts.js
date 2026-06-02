(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        parallaxIntensity: 0.3,
        mouseGlowIntensity: 0.15,
        scrollAnimationThreshold: 0.15,
        headerScrollThreshold: 50,
        goldParticleCount: 20,
        animationDuration: 800
    };

    // State
    const state = {
        scrollY: 0,
        mouseX: 0,
        mouseY: 0,
        isScrolling: false,
        activeSection: null,
        particles: [],
        rafId: null
    };

    // DOM Elements
    const elements = {
        header: document.querySelector('.main-header'),
        navItems: document.querySelectorAll('.nav-item'),
        sections: document.querySelectorAll('section'),
        animateElements: document.querySelectorAll('[data-animate]'),
        galleryItems: document.querySelectorAll('.gallery-item'),
        heroSection: document.querySelector('.hero-section'),
        bgVines: document.querySelectorAll('.vine-vine'),
        ornamentalDividers: document.querySelectorAll('.ornamental-divider'),
        ctaButtons: document.querySelectorAll('[data-hover-effect="gold-expand"]'),
        logo: document.querySelector('.logo-icon')
    };

    // Utility Functions
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
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

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Golden Cursor
    class GoldenCursor {
        constructor() {
            this.cursor = null;
            this.glow = null;
            this.pos = { x: 0, y: 0 };
            this.target = { x: 0, y: 0 };
            this.isVisible = false;
            this.init();
        }

        init() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'golden-cursor';
            this.cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-glow"></div>';
            
            Object.assign(this.cursor.style, {
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: '9999',
                mixBlendMode: 'difference',
                transition: 'opacity 0.3s ease'
            });

            const dot = this.cursor.querySelector('.cursor-dot');
            const glow = this.cursor.querySelector('.cursor-glow');

            Object.assign(dot.style, {
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--color-gold)',
                borderRadius: '50%',
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px var(--color-gold)'
            });

            Object.assign(glow.style, {
                width: '40px',
                height: '40px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(8px)'
            });

            document.body.appendChild(this.cursor);
            this.glow = glow;
            this.dot = dot;

            document.addEventListener('mousemove', (e) => {
                this.target.x = e.clientX;
                this.target.y = e.clientY;
                if (!this.isVisible) {
                    this.isVisible = true;
                    this.cursor.style.opacity = '1';
                }
            });

            document.addEventListener('mouseleave', () => {
                this.isVisible = false;
                this.cursor.style.opacity = '0';
            });

            if ('ontouchstart' in window) {
                this.cursor.style.display = 'none';
            }

            this.animate();
        }

        animate() {
            this.pos.x = lerp(this.pos.x, this.target.x, 0.15);
            this.pos.y = lerp(this.pos.y, this.target.y, 0.15);
            
            if (this.dot && this.glow) {
                this.dot.style.left = `${this.pos.x}px`;
                this.dot.style.top = `${this.pos.y}px`;
                this.glow.style.left = `${this.pos.x}px`;
                this.glow.style.top = `${this.pos.y}px`;
            }
            
            requestAnimationFrame(() => this.animate());
        }

        expand() {
            if (this.dot) {
                this.dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
                this.dot.style.backgroundColor = 'var(--color-gold-light)';
            }
            if (this.glow) {
                this.glow.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.glow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.5) 0%, transparent 70%)';
            }
        }

        contract() {
            if (this.dot) {
                this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
                this.dot.style.backgroundColor = 'var(--color-gold)';
            }
            if (this.glow) {
                this.glow.style.transform = 'translate(-50%, -50%) scale(1)';
                this.glow.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)';
            }
        }
    }

    // Parallax Background Vines
    class ParallaxVines {
        constructor() {
            this.vines = elements.bgVines;
            this.scrollY = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetScrollY = 0;
            this.targetMouseX = 0;
            this.targetMouseY = 0;
            this.init();
        }

        init() {
            if (this.vines.length === 0) return;
            
            document.addEventListener('mousemove', (e) => {
                this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            window.addEventListener('scroll', () => {
                this.targetScrollY = window.scrollY;
            });

            this.animate();
        }

        animate() {
            this.scrollY = lerp(this.scrollY, this.targetScrollY, 0.1);
            this.mouseX = lerp(this.mouseX, this.targetMouseX, 0.05);
            this.mouseY = lerp(this.mouseY, this.targetMouseY, 0.05);

            this.vines.forEach((vine, index) => {
                const speed = (index + 1) * 0.15;
                const mouseOffsetX = this.mouseX * 20 * speed;
                const mouseOffsetY = this.mouseY * 20 * speed;
                const scrollOffset = this.scrollY * speed * 0.5;
                vine.style.transform = `translate3d(${mouseOffsetX}px, ${scrollOffset + mouseOffsetY}px, 0)`;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // Scroll Animation System
    class ScrollAnimator {
        constructor() {
            this.observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: CONFIG.scrollAnimationThreshold
            };
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, parseInt(delay));
                    }
                });
            }, this.observerOptions);
            this.init();
        }

        init() {
            elements.animateElements.forEach(el => {
                this.observer.observe(el);
            });

            elements.galleryItems.forEach((item, index) => {
                if (!item.dataset.delay) {
                    item.dataset.delay = index * 100;
                }
                this.observer.observe(item);
            });
        }
    }

    // Header Scroll Effect
    class HeaderController {
        constructor() {
            this.header = elements.header;
            this.lastScroll = 0;
            this.ticking = false;
            this.init();
        }

        init() {
            if (!this.header) return;
            
            window.addEventListener('scroll', () => {
                this.onScroll();
            }, { passive: true });

            this.onScroll();
        }

        onScroll() {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateHeader();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }

        updateHeader() {
            const scrollY = window.scrollY;
            if (scrollY > CONFIG.headerScrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            this.lastScroll = scrollY;
        }
    }

    // Smooth Scroll Navigation
    class SmoothNavigation {
        constructor() {
            this.navItems = elements.navItems;
            this.init();
        }

        init() {
            this.navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = item.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        this.scrollTo(targetSection);
                    }
                });
            });

            elements.ctaButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const href = btn.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) this.scrollTo(target);
                    }
                });
            });
        }

        scrollTo(target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            target.style.animation = 'none';
            target.offsetHeight;
            target.style.animation = 'section-pulse 0.6s ease-out';
        }
    }

    // Gallery Interactive Effects
    class GalleryEffects {
        constructor() {
            this.items = elements.galleryItems;
            this.cursor = null;
            this.init();
        }

        init() {
            this.items.forEach(item => {
                item.addEventListener('mousemove', (e) => {
                    this.handleTilt(e, item);
                });

                item.addEventListener('mouseleave', () => {
                    this.resetTilt(item);
                });

                item.addEventListener('click', () => {
                    this.handleClick(item);
                });
            });

            if (window.goldenCursor) {
                this.cursor = window.goldenCursor;
            }
        }

        handleTilt(e, item) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        }

        resetTilt(item) {
            item.style.transform = '';
        }

        handleClick(item) {
            const ripple = document.createElement('div');
            ripple.className = 'gallery-ripple';
            
            Object.assign(ripple.style, {
                position: 'absolute',
                width: '20px',
                height: '20px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                animation: 'ripple-expand 0.6s ease-out forwards'
            });

            const rect = item.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            item.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        }
    }

    // Floating Gold Particles
    class GoldParticles {
        constructor() {
            this.particles = [];
            this.container = null;
            this.init();
        }

        init() {
            this.container = document.createElement('div');
            this.container.className = 'gold-particles';
            
            Object.assign(this.container.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '1',
                overflow: 'hidden'
            });

            document.body.appendChild(this.container);

            for (let i = 0; i < CONFIG.goldParticleCount; i++) {
                this.createParticle();
            }

            this.animate();
        }

        createParticle() {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 5;

            Object.assign(particle.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'var(--color-gold)',
                borderRadius: '50%',
                left: `${startX}px`,
                top: `${window.innerHeight + 10}px`,
                opacity: Math.random() * 0.5 + 0.2,
                boxShadow: `0 0 ${size * 2}px var(--color-gold)`
            });

            this.container.appendChild(particle);

            this.particles.push({
                element: particle,
                x: startX,
                y: window.innerHeight + 10,
                speed: Math.random() * 0.5 + 0.2,
                wobble: Math.random() * 2 - 1,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                duration: duration,
                delay: delay,
                startTime: Date.now() + delay * 1000
            });
        }

        animate() {
            const now = Date.now();
            
            this.particles.forEach((p) => {
                if (now < p.startTime) return;
                
                const elapsed = (now - p.startTime) / 1000;
                const progress = elapsed / p.duration;

                if (progress >= 1) {
                    p.y = window.innerHeight + 10;
                    p.x = Math.random() * window.innerWidth;
                    p.startTime = now + Math.random() * 2000;
                    p.element.style.top = `${p.y}px`;
                    p.element.style.left = `${p.x}px`;
                    return;
                }

                p.y -= p.speed;
                p.x += Math.sin(elapsed * p.wobbleSpeed * 10) * p.wobble;

                if (p.y < -10) {
                    p.y = window.innerHeight + 10;
                    p.x = Math.random() * window.innerWidth;
                }

                p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // Active Navigation State
    class ActiveNavigation {
        constructor() {
            this.sections = elements.sections;
            this.navItems = elements.navItems;
            this.init();
        }

        init() {
            if (!this.sections.length || !this.navItems.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActive(entry.target.id);
                    }
                });
            }, {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            });

            this.sections.forEach(section => {
                observer.observe(section);
            });
        }

        setActive(sectionId) {
            this.navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === `#${sectionId}`) {
                    item.classList.add('active');
                    item.style.color = 'var(--color-gold)';
                } else {
                    item.classList.remove('active');
                    item.style.color = '';
                }
            });
        }
    }

    // Image Loading Effects
    class ImageLoader {
        constructor() {
            this.images = document.querySelectorAll('.gallery-image');
            this.init();
        }

        init() {
            this.images.forEach(img => {
                img.classList.add('image-loading');
                
                img.addEventListener('load', () => {
                    img.classList.remove('image-loading');
                    img.classList.add('image-loaded');
                });

                if (img.complete) {
                    img.classList.remove('image-loading');
                    img.classList.add('image-loaded');
                }
            });
        }
    }

    // Mouse Glow Effect on Hero
    class MouseGlow {
        constructor() {
            this.hero = elements.heroSection;
            this.glowElement = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.currentX = 0;
            this.currentY = 0;
            this.init();
        }

        init() {
            if (!this.hero) return;

            this.glowElement = document.createElement('div');
            this.glowElement.className = 'hero-mouse-glow';
            
            Object.assign(this.glowElement.style, {
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: '1',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });

            this.hero.appendChild(this.glowElement);

            this.hero.addEventListener('mousemove', (e) => {
                const rect = this.hero.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
                this.glowElement.style.opacity = '1';
            });

            this.hero.addEventListener('mouseleave', () => {
                this.glowElement.style.opacity = '0';
            });

            this.animate();
        }

        animate() {
            this.currentX = lerp(this.currentX, this.mouseX, 0.1);
            this.currentY = lerp(this.currentY, this.mouseY, 0.1);
            
            if (this.glowElement) {
                this.glowElement.style.left = `${this.currentX}px`;
                this.glowElement.style.top = `${this.currentY}px`;
            }
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // Text Scramble Effect
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Keyboard Navigation
    class KeyboardNavigation {
        constructor() {
            this.init();
        }

        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }

                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    const activeItem = document.querySelector('.gallery-item:hover');
                    if (activeItem) {
                        e.preventDefault();
                        const items = Array.from(elements.galleryItems);
                        const currentIndex = items.indexOf(activeItem);
                        const nextIndex = e.key === 'ArrowDown' 
                            ? (currentIndex + 1) % items.length 
                            : (currentIndex - 1 + items.length) % items.length;
                        
                        items[nextIndex].focus();
                        items[nextIndex].scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            });
        }
    }

    // Performance Monitor
    class PerformanceMonitor {
        constructor() {
            this.fps = 0;
            this.frames = 0;
            this.lastTime = performance.now();
            this.init();
        }

        init() {
            const measure = () => {
                this.frames++;
                const time = performance.now();
                
                if (time >= this.lastTime + 1000) {
                    this.fps = Math.round((this.frames * 1000) / (time - this.lastTime));
                    this.frames = 0;
                    this.lastTime = time;
                    
                    if (this.fps < 30) {
                        console.warn(`Low FPS: ${this.fps}`);
                    }
                }
                
                requestAnimationFrame(measure);
            };
            
            requestAnimationFrame(measure);
        }
    }

    // Initialize Everything
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrap);
        } else {
            bootstrap();
        }
    }

    function bootstrap() {
        const scrollAnimator = new ScrollAnimator();
        const headerController = new HeaderController();
        const smoothNavigation = new SmoothNavigation();
        const galleryEffects = new GalleryEffects();
        const activeNavigation = new ActiveNavigation();
        const imageLoader = new ImageLoader();
        const keyboardNavigation = new KeyboardNavigation();
        
        const goldenCursor = new GoldenCursor();
        window.goldenCursor = goldenCursor;
        
        const parallaxVines = new ParallaxVines();
        const mouseGlow = new MouseGlow();
        const goldParticles = new GoldParticles();
        
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, [data-hover-effect]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => goldenCursor.expand());
            el.addEventListener('mouseleave', () => goldenCursor.contract());
        });

        console.log('%c🌸 Atelier de la Flore %cInitialized', 
            'font-family: "Cinzel Decorative", serif; font-size: 1.2em; color: #d4af37;', 
            'font-family: "Cormorant Garamond", serif; color: #f5f0e1;');
        console.log('%cArt Nouveau Portfolio Ready', 'font-style: italic; color: #9b7bb8;');

        injectDynamicStyles();
    }

    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .golden-cursor {
                transition: opacity 0.3s ease;
            }
            
            .gallery-image {
                opacity: 0;
                transition: opacity 0.6s ease, transform 0.6s ease, filter 0.4s ease;
            }
            
            .gallery-image.image-loaded {
                opacity: 1;
            }
            
            .gallery-image.image-loading {
                opacity: 0;
            }
            
            @keyframes ripple-expand {
                0% { width: 20px; height: 20px; opacity: 0.8; }
                100% { width: 400px; height: 400px; opacity: 0; }
            }
            
            .gallery-ripple {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: ripple-expand 0.6s ease-out forwards;
            }
            
            @keyframes section-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.01); }
                100% { transform: scale(1); }
            }
            
            .scramble {
                color: var(--color-gold);
                opacity: 0.7;
            }
            
            .nav-item.active {
                color: var(--color-gold) !important;
            }
            
            .nav-item.active::after {
                width: 100% !important;
            }
            
            .hero-mouse-glow {
                transition: opacity 0.3s ease;
            }
            
            @media (max-width: 768px) {
                .golden-cursor {
                    display: none !important;
                }
            }
            
            @media print {
                .golden-cursor, .gold-particles, .hero-mouse-glow {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    init();
})();
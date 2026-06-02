/* ============================================
   THE GOLDEN AGE - Art Deco Magazine Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================================
    // CHAMPAGNE BUBBLE PARTICLE SYSTEM
    // ============================================

    class ChampagneBubbles {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                maxBubbles: options.maxBubbles || 30,
                spawnInterval: options.spawnInterval || 800,
                minSize: options.minSize || 4,
                maxSize: options.maxSize || 15,
                minDuration: options.minDuration || 8000,
                maxDuration: options.maxDuration || 15000,
                ...options
            };
            this.bubbles = [];
            this.isRunning = false;
            this.intervalId = null;
        }

        createBubble() {
            if (this.bubbles.length >= this.options.maxBubbles) {
                const oldestBubble = this.bubbles.shift();
                if (oldestBubble && oldestBubble.element) {
                    oldestBubble.element.remove();
                }
            }

            const bubble = document.createElement('div');
            bubble.classList.add('bubble');

            const size = this.random(this.options.minSize, this.options.maxSize);
            const duration = this.random(this.options.minDuration, this.options.maxDuration);
            const drift = this.random(-50, 50);
            const startPosition = this.random(0, 100);

            bubble.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${startPosition}%;
                --drift: ${drift}px;
                animation-duration: ${duration}ms;
            `;

            this.container.appendChild(bubble);

            const bubbleData = {
                element: bubble,
                createdAt: Date.now()
            };

            this.bubbles.push(bubbleData);

            bubble.addEventListener('animationend', () => {
                bubble.remove();
                const index = this.bubbles.indexOf(bubbleData);
                if (index > -1) {
                    this.bubbles.splice(index, 1);
                }
            });
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;

            for (let i = 0; i < 10; i++) {
                setTimeout(() => this.createBubble(), i * 200);
            }

            this.intervalId = setInterval(() => {
                this.createBubble();
            }, this.options.spawnInterval);
        }

        stop() {
            if (!this.isRunning) return;
            this.isRunning = false;

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }

        random(min, max) {
            return Math.random() * (max - min) + min;
        }
    }

    // ============================================
    // PARALLAX SCROLLING
    // ============================================

    class ParallaxController {
        constructor() {
            this.layers = document.querySelectorAll('.parallax-layer');
            this.ticking = false;
            this.scrollY = 0;
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
            this.updateLayers();
        }

        onScroll() {
            this.scrollY = window.scrollY;
            if (!this.ticking) {
                requestAnimationFrame(() => this.updateLayers());
                this.ticking = true;
            }
        }

        updateLayers() {
            this.layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const yPos = -(this.scrollY * speed);
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            this.ticking = false;
        }
    }

    // ============================================
    // ANIMATED MASTHEAD
    // ============================================

    class MastheadAnimator {
        constructor() {
            this.letters = document.querySelectorAll('.masthead-letter');
            this.isAnimating = false;
            this.init();
        }

        init() {
            this.letters.forEach((letter, index) => {
                letter.addEventListener('mouseenter', () => this.animateLetter(letter));
            });

            this.startIdleAnimation();
        }

        animateLetter(letter) {
            if (letter.classList.contains('space')) return;

            letter.style.animation = 'none';
            letter.offsetHeight;
            letter.style.animation = 'letterPop 0.5s ease-out';
        }

        startIdleAnimation() {
            setInterval(() => {
                const randomIndex = Math.floor(Math.random() * this.letters.length);
                const letter = this.letters[randomIndex];
                if (!letter.classList.contains('space')) {
                    letter.style.filter = 'brightness(1.5) drop-shadow(0 0 20px rgba(255, 215, 0, 1))';
                    setTimeout(() => {
                        letter.style.filter = '';
                    }, 300);
                }
            }, 2000);
        }
    }

    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ============================================

    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        const headerOffset = 100;
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

    // ============================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ============================================

    class ScrollAnimations {
        constructor() {
            this.elements = document.querySelectorAll(
                '.column-article, .lifestyle-card, .vintage-ad, .sidebar-section'
            );
            this.init();
        }

        init() {
            this.observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateIn(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);

            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                this.observer.observe(el);
            });
        }

        animateIn(element) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    }

    // ============================================
    // SUNBURST ROTATION ENHANCEMENT
    // ============================================

    class SunburstEnhancer {
        constructor() {
            this.sunbursts = document.querySelectorAll('.sunburst');
            this.mouseX = 0;
            this.mouseY = 0;
            this.init();
        }

        init() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
                this.mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            });

            this.animate();
        }

        animate() {
            this.sunbursts.forEach((sunburst, index) => {
                const multiplier = (index + 1) * 0.5;
                const rotation = sunburst.style.transform.match(/rotate\(([-\d.]+)deg\)/);
                const currentRotation = rotation ? parseFloat(rotation[1]) : 0;
                
                sunburst.style.transform = `
                    translate(-50%, -50%) 
                    rotate(${currentRotation + 0.02 * (index % 2 === 0 ? 1 : -1)}deg)
                    translateX(${this.mouseX * multiplier}px)
                    translateY(${this.mouseY * multiplier}px)
                `;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // DECORATIVE ELEMENTS ANIMATION
    // ============================================

    class DecorativeAnimations {
        constructor() {
            this.dividers = document.querySelectorAll('.divider-diamond');
            this.ornaments = document.querySelectorAll('.divider-ornament');
            this.init();
        }

        init() {
            this.dividers.forEach(divider => {
                divider.addEventListener('mouseenter', () => {
                    divider.style.animation = 'none';
                    divider.offsetHeight;
                    divider.style.animation = 'diamondSpin 1s ease-out';
                });
            });

            this.startOrnamentPulse();
        }

        startOrnamentPulse() {
            setInterval(() => {
                this.ornaments.forEach((ornament, index) => {
                    setTimeout(() => {
                        ornament.style.transform = 'scale(1.5)';
                        setTimeout(() => {
                            ornament.style.transform = 'scale(1)';
                        }, 300);
                    }, index * 200);
                });
            }, 3000);
        }
    }

    // ============================================
    // VINTAGE AD HOVER EFFECTS
    // ============================================

    class VintageAdEffects {
        constructor() {
            this.ads = document.querySelectorAll('.vintage-ad');
            this.init();
        }

        init() {
            this.ads.forEach(ad => {
                ad.addEventListener('mouseenter', () => this.enhanceAd(ad));
                ad.addEventListener('mouseleave', () => this.resetAd(ad));
            });
        }

        enhanceAd(ad) {
            const frame = ad.querySelector('.ad-frame');
            frame.style.transform = 'scale(1.02)';
            frame.style.transition = 'transform 0.4s ease-out';
            frame.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';
        }

        resetAd(ad) {
            const frame = ad.querySelector('.ad-frame');
            frame.style.transform = 'scale(1)';
            frame.style.boxShadow = '';
        }
    }

    // ============================================
    // READING PROGRESS INDICATOR
    // ============================================

    class ReadingProgress {
        constructor() {
            this.progressBar = null;
            this.init();
        }

        init() {
            this.createProgressBar();
            window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
        }

        createProgressBar() {
            this.progressBar = document.createElement('div');
            this.progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--gold-dark), var(--gold-primary), var(--gold-light));
                z-index: 10000;
                transition: width 0.1s ease-out;
                box-shadow: 0 0 10px var(--gold-primary);
            `;
            document.body.appendChild(this.progressBar);
        }

        updateProgress() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.progressBar.style.width = scrolled + '%';
        }
    }

    // ============================================
    // DROP CAP ENHANCEMENT
    // ============================================

    class DropCapEnhancer {
        constructor() {
            this.dropCaps = document.querySelectorAll('.drop-cap-letter');
            this.init();
        }

        init() {
            this.dropCaps.forEach(cap => {
                cap.style.cursor = 'default';
                cap.addEventListener('mouseenter', () => {
                    cap.style.transform = 'scale(1.1) rotate(-5deg)';
                    cap.style.transition = 'transform 0.3s ease-out';
                });
                cap.addEventListener('mouseleave', () => {
                    cap.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        }
    }

    // ============================================
    // CORNER ORNAMENT ANIMATION
    // ============================================

    class CornerOrnamentEffects {
        constructor() {
            this.ornaments = document.querySelectorAll('.corner-ornament');
            this.init();
        }

        init() {
            this.ornaments.forEach((ornament, index) => {
                ornament.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
                ornament.style.cursor = 'pointer';
                
                ornament.addEventListener('mouseenter', () => {
                    const scale = index % 2 === 0 ? 1.1 : 1.15;
                    ornament.style.transform = this.getScaleTransform(ornament, scale);
                    ornament.style.opacity = '1';
                });

                ornament.addEventListener('mouseleave', () => {
                    ornament.style.transform = this.getBaseTransform(ornament);
                    ornament.style.opacity = '0.8';
                });
            });
        }

        getBaseTransform(ornament) {
            if (ornament.classList.contains('top-right')) return 'scaleX(-1)';
            if (ornament.classList.contains('bottom-left')) return 'scaleY(-1)';
            if (ornament.classList.contains('bottom-right')) return 'scale(-1)';
            return 'scale(1)';
        }

        getScaleTransform(ornament, scale) {
            const base = this.getBaseTransform(ornament);
            return `${base} scale(${scale})`;
        }
    }

    // ============================================
    // LIFESTYLE CARD SHIMMER
    // ============================================

    class LifestyleCardShimmer {
        constructor() {
            this.cards = document.querySelectorAll('.lifestyle-card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                const shimmer = document.createElement('div');
                shimmer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
                    pointer-events: none;
                    z-index: 10;
                `;
                
                const frame = card.querySelector('.card-frame');
                frame.style.position = 'relative';
                frame.style.overflow = 'hidden';
                frame.appendChild(shimmer);

                card.addEventListener('mouseenter', () => {
                    shimmer.style.animation = 'shimmer 1.5s ease-out';
                });

                shimmer.addEventListener('animationend', () => {
                    shimmer.style.animation = '';
                });
            });
        }
    }

    // Add shimmer keyframes
    const shimmerStyle = document.createElement('style');
    shimmerStyle.textContent = `
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        @keyframes letterPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        @keyframes diamondSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(shimmerStyle);

    // ============================================
    // INTERSECTION OBSERVER FOR HEADER
    // ============================================

    class HeaderEffects {
        constructor() {
            this.header = document.querySelector('.main-header');
            this.hero = document.querySelector('.hero-section');
            this.lastScroll = 0;
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        }

        onScroll() {
            const currentScroll = window.pageYOffset;
            const scrollDiff = currentScroll - this.lastScroll;

            if (scrollDiff > 0 && currentScroll > 100) {
                this.header.style.transform = 'translateY(-20px)';
                this.header.style.opacity = '0.95';
            } else {
                this.header.style.transform = 'translateY(0)';
                this.header.style.opacity = '1';
            }

            this.lastScroll = currentScroll;
        }
    }

    // ============================================
    // TYPING EFFECT FOR TAGLINE
    // ============================================

    class TaglineTyping {
        constructor() {
            this.tagline = document.querySelector('.tagline');
            this.originalText = '';
            this.init();
        }

        init() {
            if (!this.tagline) return;
            this.originalText = this.tagline.textContent;
            this.tagline.textContent = '';
            this.tagline.style.borderRight = '2px solid var(--gold-primary)';
            this.tagline.style.animation = 'blink 1s step-end infinite';
            
            setTimeout(() => this.typeText(), 2000);
        }

        typeText() {
            let i = 0;
            const typeInterval = setInterval(() => {
                this.tagline.textContent += this.originalText.charAt(i);
                i++;
                if (i >= this.originalText.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        this.tagline.style.borderRight = 'none';
                        this.tagline.style.animation = 'none';
                    }, 2000);
                }
            }, 50);
        }
    }

    // Add blink animation
    const blinkStyle = document.createElement('style');
    blinkStyle.textContent = `
        @keyframes blink {
            0%, 100% { border-color: var(--gold-primary); }
            50% { border-color: transparent; }
        }
    `;
    document.head.appendChild(blinkStyle);

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================

    class BackToTop {
        constructor() {
            this.button = null;
            this.init();
        }

        init() {
            this.createButton();
            window.addEventListener('scroll', () => this.toggleVisibility(), { passive: true });
        }

        createButton() {
            this.button = document.createElement('button');
            this.button.innerHTML = '↑';
            this.button.setAttribute('aria-label', 'Back to top');
            this.button.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--gold-dark), var(--gold-primary));
                color: var(--black);
                border: 2px solid var(--gold-light);
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease-out;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            `;

            this.button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            this.button.addEventListener('mouseenter', () => {
                this.button.style.transform = 'scale(1.1)';
                this.button.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.6)';
            });

            this.button.addEventListener('mouseleave', () => {
                this.button.style.transform = 'scale(1)';
                this.button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            });

            document.body.appendChild(this.button);
        }

        toggleVisibility() {
            if (window.pageYOffset > 500) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        }
    }

    // ============================================
    // SOCIAL SHARE EFFECTS (Vintage Style)
    // ============================================

    class SocialShare {
        constructor() {
            this.init();
        }

        init() {
            const footerLinks = document.querySelectorAll('.footer-list a');
            footerLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href') === '#') {
                        e.preventDefault();
                        this.showToast('Coming soon in our next edition!');
                    }
                });
            });
        }

        showToast(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--black);
                color: var(--gold-primary);
                padding: 15px 30px;
                border: 2px solid var(--gold-primary);
                font-family: var(--font-accent);
                letter-spacing: 2px;
                text-transform: uppercase;
                font-size: 0.85rem;
                z-index: 10000;
                animation: fadeInOut 3s ease-out forwards;
            `;

            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 3000);
        }
    }

    // Add toast animation
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(toastStyle);

    // ============================================
    // PRELOADER
    // ============================================

    class Preloader {
        constructor() {
            this.init();
        }

        init() {
            const preloader = document.createElement('div');
            preloader.id = 'preloader';
            preloader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--black);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                transition: opacity 0.8s ease-out, visibility 0.8s ease-out;
            `;

            const loaderContent = document.createElement('div');
            loaderContent.style.textAlign = 'center';

            const loaderDiamond = document.createElement('div');
            loaderDiamond.style.cssText = `
                width: 40px;
                height: 40px;
                background: var(--gold-primary);
                transform: rotate(45deg);
                margin: 0 auto 20px;
                animation: loaderPulse 1.5s ease-in-out infinite;
            `;

            const loaderText = document.createElement('div');
            loaderText.textContent = 'Loading';
            loaderText.style.cssText = `
                font-family: var(--font-accent);
                color: var(--gold-primary);
                letter-spacing: 5px;
                text-transform: uppercase;
                font-size: 0.9rem;
            `;

            loaderContent.appendChild(loaderDiamond);
            loaderContent.appendChild(loaderText);
            preloader.appendChild(loaderContent);
            document.body.appendChild(preloader);

            // Add loader animation
            const loaderStyle = document.createElement('style');
            loaderStyle.textContent = `
                @keyframes loaderPulse {
                    0%, 100% { transform: rotate(45deg) scale(1); opacity: 1; }
                    50% { transform: rotate(225deg) scale(1.2); opacity: 0.7; }
                }
            `;
            document.head.appendChild(loaderStyle);

            window.addEventListener('load', () => {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => preloader.remove(), 800);
                }, 500);
            });
        }
    }

    // ============================================
    // INITIALIZE ALL COMPONENTS
    // ============================================

    // Preloader
    new Preloader();

    // Champagne Bubbles
    const bubblesContainer = document.getElementById('bubbles-container');
    if (bubblesContainer) {
        const bubbles = new ChampagneBubbles(bubblesContainer, {
            maxBubbles: 25,
            spawnInterval: 1000,
            minSize: 4,
            maxSize: 12,
            minDuration: 10000,
            maxDuration: 18000
        });
        bubbles.start();

        // Pause bubbles when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                bubbles.stop();
            } else {
                bubbles.start();
            }
        });
    }

    // Parallax
    new ParallaxController();

    // Masthead Animation
    new MastheadAnimator();

    // Smooth Scroll
    new SmoothScroll();

    // Scroll Animations
    new ScrollAnimations();

    // Sunburst Enhancement
    new SunburstEnhancer();

    // Decorative Animations
    new DecorativeAnimations();

    // Vintage Ad Effects
    new VintageAdEffects();

    // Reading Progress
    new ReadingProgress();

    // Drop Cap Enhancement
    new DropCapEnhancer();

    // Corner Ornament Effects
    new CornerOrnamentEffects();

    // Lifestyle Card Shimmer
    new LifestyleCardShimmer();

    // Header Effects
    new HeaderEffects();

    // Tagline Typing
    new TaglineTyping();

    // Back to Top
    new BackToTop();

    // Social Share
    new SocialShare();

    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================

    console.log(
        '%c✦ THE GOLDEN AGE ✦',
        'color: #D4AF37; font-size: 24px; font-weight: bold; letter-spacing: 5px;'
    );
    console.log(
        '%cAn Art Deco Magazine Experience',
        'color: #8B6914; font-size: 12px; letter-spacing: 3px;'
    );
});
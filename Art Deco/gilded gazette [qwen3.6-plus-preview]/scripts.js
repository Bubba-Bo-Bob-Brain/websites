/**
 * THE GILDED CHRONICLE — Interactive Features
 * A lavish 1920s Art Deco Magazine Experience
 */

(function() {
    'use strict';

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const Utils = {
        /**
         * Throttle function for scroll/resize events
         */
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Debounce function for input events
         */
        debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        /**
         * Random number between min and max
         */
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Check if element is in viewport
         */
        isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        },

        /**
         * Smooth scroll to element
         */
        smoothScrollTo(target, offset = 80) {
            const element = document.querySelector(target);
            if (!element) return;
            
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1200;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function: easeInOutCubic
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
    };

    // ============================================
    // CHAMPAGNE BUBBLE PARTICLES
    // ============================================
    const ChampagneBubbles = {
        container: null,
        bubbles: [],
        maxBubbles: 35,
        isActive: true,

        init() {
            this.container = document.getElementById('champagne-bubbles');
            if (!this.container) return;
            
            this.createInitialBubbles();
            this.startBubbleLoop();
        },

        createBubble() {
            if (this.bubbles.length >= this.maxBubbles) return;
            
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            const size = Utils.random(4, 18);
            const left = Utils.random(0, 100);
            const duration = Utils.random(8, 18);
            const delay = Utils.random(0, 4);
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.opacity = Utils.random(0.2, 0.6);
            
            this.container.appendChild(bubble);
            this.bubbles.push(bubble);
            
            // Remove and recreate after animation completes
            bubble.addEventListener('animationend', () => {
                bubble.remove();
                this.bubbles = this.bubbles.filter(b => b !== bubble);
                if (this.isActive) this.createBubble();
            });
        },

        createInitialBubbles() {
            for (let i = 0; i < 15; i++) {
                setTimeout(() => this.createBubble(), i * 200);
            }
        },

        startBubbleLoop() {
            setInterval(() => {
                if (this.isActive && this.bubbles.length < 20) {
                    this.createBubble();
                }
            }, 1500);
        },

        pause() {
            this.isActive = false;
        },

        resume() {
            this.isActive = true;
            this.startBubbleLoop();
        }
    };

    // ============================================
    // SUNBURST RAY GENERATION
    // ============================================
    const SunburstRays = {
        init() {
            const raysContainer = document.querySelector('.hero-rays');
            if (!raysContainer) return;

            const rayCount = 24;
            const angle = 360 / rayCount;
            
            raysContainer.style.background = 'none';
            
            for (let i = 0; i < rayCount; i++) {
                const ray = document.createElement('div');
                ray.style.position = 'absolute';
                ray.style.top = '0';
                ray.style.left = '50%';
                ray.style.width = '2px';
                ray.style.height = '50%';
                ray.style.transformOrigin = 'bottom center';
                ray.style.transform = `translateX(-50%) rotate(${i * angle}deg)`;
                ray.style.background = i % 2 === 0 
                    ? 'linear-gradient(to top, rgba(212, 175, 55, 0.08), transparent)' 
                    : 'transparent';
                raysContainer.appendChild(ray);
            }
        }
    };

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const ScrollReveals = {
        elements: [],
        observer: null,

        init() {
            // Add reveal class to sections
            const sections = document.querySelectorAll(
                '.editors-letter, .feature-article, .society-columns, ' +
                '.advertisements, .jazz-culture, .fashion-luxe, .subscription-banner, ' +
                '.article-card, .vintage-ad, .fashion-item, .timeline-event, ' +
                '.section-header, .article-header, .letter-header, .culture-article'
            );
            
            sections.forEach((el, index) => {
                el.classList.add('reveal');
                el.style.transitionDelay = `${(index % 4) * 0.1}s`;
            });
            
            // Intersection Observer for performance
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);
            
            document.querySelectorAll('.reveal').forEach(el => {
                this.observer.observe(el);
            });
        }
    };

    // ============================================
    // PARALLAX HERO EFFECT
    // ============================================
    const ParallaxHero = {
        hero: null,
        heroContent: null,
        sunburst: null,
        rays: null,
        
        init() {
            this.hero = document.querySelector('.hero-section');
            this.heroContent = document.querySelector('.hero-content');
            this.sunburst = document.querySelector('.sunburst-bg svg');
            this.rays = document.querySelector('.hero-rays');
            
            if (!this.hero) return;
            
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 16), { passive: true });
            
            // Initial call
            this.handleScroll();
        },

        handleScroll() {
            const scrollY = window.pageYOffset;
            const heroTop = this.hero.offsetTop;
            const heroHeight = this.hero.offsetHeight;
            
            // Only calculate if hero is in view
            if (scrollY > heroTop + heroHeight) return;
            
            const scrolled = scrollY - heroTop;
            const progress = Math.max(0, Math.min(1, scrolled / heroHeight));
            
            // Parallax for content
            if (this.heroContent) {
                this.heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                this.heroContent.style.opacity = 1 - progress * 1.2;
            }
            
            // Parallax for sunburst
            if (this.sunburst) {
                this.sunburst.style.transform = `translateY(${scrolled * 0.15}px) scale(${1 + progress * 0.1})`;
            }
            
            // Parallax for rays (rotate based on scroll)
            if (this.rays) {
                this.rays.style.transform = `translate(-50%, -50%) rotate(${progress * 30}deg)`;
            }
        }
    };

    // ============================================
    // NAVIGATION CONTROLLER
    // ============================================
    const Navigation = {
        nav: null,
        links: null,
        sections: [],
        lastScrollY: 0,
        isScrollingUp: false,

        init() {
            this.nav = document.querySelector('.main-navigation');
            this.links = document.querySelectorAll('.nav-link[href^="#"]');
            this.sections = Array.from(document.querySelectorAll('section[id]'));
            
            if (!this.nav) return;
            
            // Smooth scroll for nav links
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        Utils.smoothScrollTo(href, 80);
                    }
                });
            });
            
            // Scroll behavior
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
                this.updateActiveLink();
            }, 16), { passive: true });
        },

        handleScroll() {
            const currentScrollY = window.pageYOffset;
            this.isScrollingUp = currentScrollY < this.lastScrollY;
            
            if (currentScrollY > 100) {
                this.nav.style.background = 'rgba(18, 18, 21, 0.95)';
                this.nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
            } else {
                this.nav.style.background = 'var(--bg-secondary)';
                this.nav.style.boxShadow = 'none';
            }
            
            this.lastScrollY = currentScrollY;
        },

        updateActiveLink() {
            const scrollY = window.pageYOffset + 200;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    this.links.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    };

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const ScrollToTop = {
        button: null,

        init() {
            this.button = document.getElementById('scrollToTop');
            if (!this.button) return;
            
            this.button.addEventListener('click', () => {
                Utils.smoothScrollTo('#hero', 0);
            });
            
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleVisibility();
            }, 16), { passive: true });
        },

        handleVisibility() {
            if (window.pageYOffset > 600) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }
    };

    // ============================================
    // MASTHEAD ENTRANCE ANIMATION
    // ============================================
    const MastheadAnimation = {
        init() {
            const masthead = document.querySelector('.masthead');
            if (!masthead) return;
            
            const title = masthead.querySelector('.title-main');
            const subtitleTop = masthead.querySelector('.masthead-subtitle-top');
            const subtitleBottom = masthead.querySelector('.masthead-subtitle-bottom');
            const divider = masthead.querySelector('.masthead-divider');
            const edition = masthead.querySelector('.masthead-edition');
            
            // Initial states
            const elements = [
                { el: subtitleTop, delay: 200, duration: 800 },
                { el: title, delay: 500, duration: 1000 },
                { el: divider, delay: 900, duration: 600 },
                { el: subtitleBottom, delay: 1200, duration: 800 },
                { el: edition, delay: 1500, duration: 600 }
            ];
            
            // Set initial state
            elements.forEach(({ el }) => {
                if (el) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                }
            });
            
            // Animate on load
            window.addEventListener('load', () => {
                elements.forEach(({ el, delay, duration }) => {
                    if (!el) return;
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        el.style.transitionDuration = `${duration}ms`;
                    }, delay);
                });
                
                // Add shimmer effect to main title after animation
                setTimeout(() => {
                    if (title) {
                        title.classList.add('shimmer-text');
                    }
                }, 2500);
            });
        }
    };

    // ============================================
    // FORM HANDLER
    // ============================================
    const FormHandler = {
        form: null,

        init() {
            this.form = document.querySelector('.subscription-form');
            if (!this.form) return;
            
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        },

        handleSubmit() {
            const btn = this.form.querySelector('.subscribe-btn');
            const originalText = btn.innerHTML;
            
            // Simulate submission
            btn.disabled = true;
            btn.innerHTML = '<span class="btn-text">Processing...</span>';
            
            setTimeout(() => {
                btn.innerHTML = '<span class="btn-text">Subscription Received! ✦</span>';
                btn.style.borderColor = '#4a7c59';
                btn.style.color = '#4a7c59';
                
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    this.form.reset();
                }, 3000);
            }, 1500);
        }
    };

    // ============================================
    // CARD HOVER TILT EFFECT
    // ============================================
    const CardTiltEffect = {
        cards: [],

        init() {
            this.cards = document.querySelectorAll('.article-card, .vintage-ad');
            
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMove(e, card));
                card.addEventListener('mouseleave', () => this.handleLeave(card));
            });
        },

        handleMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        },

        handleLeave(card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        }
    };

    // ============================================
    // DYNAMIC EDITION DATE
    // ============================================
    const DynamicDate = {
        init() {
            const editionEl = document.querySelector('.masthead-edition');
            if (!editionEl) return;
            
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            const now = new Date();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            
            editionEl.textContent = `Vol. XII — No. 4 — ${month} ${year} Edition — Price: One Shilling`;
        }
    };

    // ============================================
    // CURSOR SPARKLE TRAIL (SUBTLE)
    // ============================================
    const CursorSparkle = {
        canvas: null,
        ctx: null,
        particles: [],
        isActive: true,
        maxParticles: 15,

        init() {
            // Only activate on desktop
            if (window.matchMedia('(pointer: coarse)').matches) return;
            
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
            `;
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', (e) => this.handleMove(e));
            
            this.animate();
        },

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        handleMove(e) {
            if (!this.isActive) return;
            
            if (Math.random() > 0.85) {
                this.createParticle(e.clientX, e.clientY);
            }
        },

        createParticle(x, y) {
            this.particles.push({
                x,
                y,
                size: Utils.random(1, 3),
                speedX: Utils.random(-0.5, 0.5),
                speedY: Utils.random(-1, -0.2),
                opacity: Utils.random(0.5, 1),
                decay: Utils.random(0.01, 0.03),
                color: Math.random() > 0.5 ? '212, 175, 55' : '243, 229, 171'
            });
            
            // Limit particles
            if (this.particles.length > this.maxParticles) {
                this.particles.shift();
            }
        },

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles = this.particles.filter(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.opacity -= p.decay;
                
                if (p.opacity <= 0) return false;
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
                this.ctx.fill();
                
                return true;
            });
            
            requestAnimationFrame(() => this.animate());
        }
    };

    // ============================================
    // READING PROGRESS INDICATOR
    // ============================================
    const ReadingProgress = {
        bar: null,

        init() {
            this.bar = document.createElement('div');
            this.bar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--gold), var(--gold-light));
                width: 0%;
                z-index: 10000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(this.bar);
            
            window.addEventListener('scroll', Utils.throttle(() => {
                this.update();
            }, 16), { passive: true });
        },

        update() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.bar.style.width = `${Math.min(progress, 100)}%`;
        }
    };

    // ============================================
    // INITIALIZE ALL MODULES
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        ChampagneBubbles.init();
        SunburstRays.init();
        ScrollReveals.init();
        ParallaxHero.init();
        Navigation.init();
        ScrollToTop.init();
        MastheadAnimation.init();
        FormHandler.init();
        CardTiltEffect.init();
        DynamicDate.init();
        CursorSparkle.init();
        ReadingProgress.init();
        
        // Log initialization
        console.log('%c✦ The Gilded Chronicle ✦', 
            'color: #d4af37; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(212,175,55,0.5);');
        console.log('%cEst. MMXXIV — A Publication of Distinction', 
            'color: #c4b9a8; font-size: 11px; font-style: italic;');
    });
})();
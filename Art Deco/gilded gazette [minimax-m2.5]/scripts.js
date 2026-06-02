/* ============================================ THE GOLDEN AGE GAZETTE JavaScript Interactive Features A Chronicle of the Jazz Age ============================================ */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initChampagneBubbles();
        initParallax();
        initScrollAnimations();
        initNavigation();
        initHoverEffects();
        initCounterAnimation();
    }

    // ============================================ CHAMPAGNE BUBBLE PARTICLES 
    // ============================================
    function initChampagneBubbles() {
        const canvas = document.getElementById('bubble-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let bubbles = [];
        let animationId;

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Bubble class
        class Bubble {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.radius = Math.random() * 3 + 1;
                this.speed = Math.random() * 1.5 + 0.5;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.y -= this.speed;
                this.wobble += this.wobbleSpeed;
                this.x += Math.sin(this.wobble) * 0.5;
                
                // Reset when bubble goes off screen
                if (this.y < -10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                
                // Gold/champagne color gradient
                const goldIntensity = 0.7 + Math.sin(Date.now() * 0.001 + this.wobble) * 0.3;
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * goldIntensity})`;
                ctx.fill();

                // Add highlight
                ctx.beginPath();
                ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 248, 231, ${this.opacity * 0.8})`;
                ctx.fill();
            }
        }

        // Initialize bubbles
        function initBubbles() {
            const bubbleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < bubbleCount; i++) {
                const bubble = new Bubble();
                bubble.y = Math.random() * canvas.height;
                bubbles.push(bubble);
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(bubble => {
                bubble.update();
                bubble.draw();
            });
            animationId = requestAnimationFrame(animate);
        }

        initBubbles();
        animate();

        // Reduce bubbles on mobile for performance
        if (window.innerWidth < 768) {
            bubbles = bubbles.slice(0, 30);
        }
    }

    // ============================================ PARALLAX EFFECTS 
    // ============================================
    function initParallax() {
        const heroSection = document.querySelector('.hero-section');
        const parallax = document.querySelector('.hero-parallax');
        
        if (!heroSection || !parallax) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                const speed = 0.3;
                parallax.style.transform = `translateY(${scrolled * speed}px)`;
                
                // Fade out hero content on scroll
                const content = document.querySelector('.hero-content');
                if (content) {
                    const opacity = 1 - (scrolled / heroHeight);
                    content.style.opacity = Math.max(0, opacity);
                    content.style.transform = `translateY(${scrolled * 0.2}px)`;
                }
            }
        }

        // Add subtle floating animation to hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            let floatY = 0;
            let direction = 1;
            
            function floatAnimation() {
                floatY += 0.3 * direction;
                if (Math.abs(floatY) > 10) direction *= -1;
                heroContent.style.transform = `translateY(${floatY}px)`;
                requestAnimationFrame(floatAnimation);
            }
            
            floatAnimation();
        }
    }

    // ============================================ SCROLL ANIMATIONS 
    // ============================================
    function initScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elements to animate
        const animateElements = document.querySelectorAll('.feature-article, .sidebar-widget, .ad-container, .pull-quote');
        
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });

        // Add animate-in class styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);

        // Staggered animation for registry items
        const registryItems = document.querySelectorAll('.registry-item');
        registryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            item.style.transition = `all 0.4s ease ${index * 0.1}s`;
            observer.observe(item);
        });

        // Animate events list items
        const eventItems = document.querySelectorAll('.events-list li');
        eventItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `all 0.4s ease ${index * 0.15}s`;
            observer.observe(item);
        });
    }

    // ============================================ NAVIGATION 
    // ============================================
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', handleNavHover);
            link.addEventListener('mouseleave', handleNavLeave);
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll-based nav styling
        let lastScroll = 0;
        const nav = document.querySelector('.main-nav');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
            lastScroll = currentScroll;
        });

        // Add nav-scrolled styles
        const navStyle = document.createElement('style');
        navStyle.textContent = `
            .main-nav.nav-scrolled {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: rgba(255, 248, 231, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(navStyle);
    }

    function handleNavHover(e) {
        const link = e.target;
        link.style.transform = 'translateX(5px)';
    }

    function handleNavLeave(e) {
        const link = e.target;
        link.style.transform = 'translateX(0)';
    }

    // ============================================ HOVER EFFECTS 
    // ============================================
    function initHoverEffects() {
        // Article cards hover effect
        const articles = document.querySelectorAll('.feature-article');
        articles.forEach(article => {
            article.addEventListener('mouseenter', () => {
                article.style.transform = 'translateY(-5px)';
                article.style.boxShadow = '0 10px 40px rgba(201, 162, 39, 0.2)';
            });
            article.addEventListener('mouseleave', () => {
                article.style.transform = 'translateY(0)';
                article.style.boxShadow = 'none';
            });
        });

        // Ad container shine effect
        const ads = document.querySelectorAll('.ad-container');
        ads.forEach(ad => {
            ad.addEventListener('mouseenter', createShineEffect);
        });

        // Sidebar widgets hover
        const widgets = document.querySelectorAll('.sidebar-widget');
        widgets.forEach(widget => {
            widget.addEventListener('mouseenter', () => {
                const title = widget.querySelector('.widget-title');
                if (title) {
                    title.style.color = '#C9A227';
                }
            });
            widget.addEventListener('mouseleave', () => {
                const title = widget.querySelector('.widget-title');
                if (title) {
                    title.style.color = '';
                }
            });
        });

        // Diamond pulse effect
        const diamonds = document.querySelectorAll('.masthead-divider .diamond');
        diamonds.forEach((diamond, index) => {
            setInterval(() => {
                diamond.style.transform = 'rotate(45deg) scale(1.3)';
                diamond.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    diamond.style.transform = 'rotate(45deg) scale(1)';
                }, 300);
            }, 2000 + index * 500);
        });
    }

    function createShineEffect(e) {
        const ad = e.currentTarget;
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
            pointer-events: none;
            z-index: 10;
        `;
        
        ad.style.position = 'relative';
        ad.style.overflow = 'hidden';
        ad.appendChild(shine);

        // Trigger shine animation
        setTimeout(() => {
            shine.style.left = '100%';
        }, 10);

        // Remove shine element after animation
        setTimeout(() => {
            shine.remove();
        }, 600);
    }

    // ============================================ COUNTER ANIMATIONS 
    // ============================================
    function initCounterAnimation() {
        // Animate decorative elements
        const decoElements = document.querySelectorAll('.deco-diamond, .diamond, .sunburst-small');
        decoElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'scale(0) rotate(45deg)';
            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'scale(1) rotate(45deg)';
            }, 500 + index * 50);
        });

        // Add rotation for non-diamond elements
        const nonDiamonds = document.querySelectorAll('.sunburst-small');
        nonDiamonds.forEach(el => {
            el.style.transform = 'scale(0) rotate(0deg)';
            setTimeout(() => {
                el.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        });
    }

    // ============================================ EASTER EGG - KONAMI CODE 
    // ============================================
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSecretEffect();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateSecretEffect() {
        // Flash gold effect
        document.body.style.animation = 'goldFlash 0.5s ease';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);

        // Add gold flash animation
        const flashStyle = document.createElement('style');
        flashStyle.textContent = `
            @keyframes goldFlash {
                0%, 100% { filter: none; }
                50% { filter: sepia(1) hue-rotate(10deg) saturate(3); }
            }
        `;
        document.head.appendChild(flashStyle);

        // Create celebration message
        const msg = document.createElement('div');
        msg.textContent = '✦ The Jazz Age Awaits! ✦';
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Cinzel', serif;
            font-size: 2rem;
            color: #C9A227;
            text-shadow: 0 0 20px rgba(201, 162, 39, 0.8);
            z-index: 10000;
            animation: fadeOut 2s ease forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 2000);
    }

    // Add fadeOut animation
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
    `;
    document.head.appendChild(fadeStyle);

    // ============================================ PERFORMANCE OPTIMIZATIONS 
    // ============================================
    
    // Reduce animations on prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-duration', '0ms');
        
        // Stop bubble animation
        const canvas = document.getElementById('bubble-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Lazy load images (if any)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

})();
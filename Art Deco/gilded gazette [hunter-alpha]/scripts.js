/* ============================================
   THE GILDED GAZETTE
   Interactive Scripts & Animations
   Est. 1923
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CHAMPAGNE BUBBLE PARTICLE SYSTEM
    // ============================================
    class ChampagneBubbles {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.bubbles = [];
            this.maxBubbles = 60;
            this.animationId = null;
            
            this.resize();
            this.init();
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        init() {
            // Create initial bubbles
            for (let i = 0; i < this.maxBubbles; i++) {
                this.bubbles.push(this.createBubble());
            }
        }
        
        createBubble() {
            const size = Math.random() * 4 + 1;
            return {
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                size: size,
                speedY: Math.random() * 1.5 + 0.3,
                speedX: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                wobbleAmount: Math.random() * 30 + 10,
                phase: Math.random() * Math.PI * 2,
                // Gold tinted bubbles
                hue: Math.random() * 30 + 35, // Gold range
                saturation: Math.random() * 30 + 50,
                lightness: Math.random() * 20 + 60
            };
        }
        
        updateBubble(bubble) {
            // Move bubble upward
            bubble.y -= bubble.speedY;
            
            // Wobble side to side
            bubble.phase += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.phase) * 0.5 + bubble.speedX;
            
            // Fade out as it rises
            const progress = 1 - (bubble.y / this.canvas.height);
            if (progress > 0.7) {
                bubble.opacity *= 0.995;
            }
            
            // Reset bubble when it goes off screen
            if (bubble.y < -20 || bubble.opacity < 0.01) {
                bubble.y = this.canvas.height + Math.random() * 50;
                bubble.x = Math.random() * this.canvas.width;
                bubble.opacity = Math.random() * 0.4 + 0.1;
            }
        }
        
        drawBubble(bubble) {
            const ctx = this.ctx;
            
            // Bubble glow
            const gradient = ctx.createRadialGradient(
                bubble.x, bubble.y, 0,
                bubble.x, bubble.y, bubble.size * 3
            );
            
            const color = `hsla(${bubble.hue}, ${bubble.saturation}%, ${bubble.lightness}%, `;
            
            gradient.addColorStop(0, color + bubble.opacity + ')');
            gradient.addColorStop(0.5, color + (bubble.opacity * 0.5) + ')');
            gradient.addColorStop(1, color + '0)');
            
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Bubble highlight
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${bubble.hue}, ${bubble.saturation}%, 90%, ${bubble.opacity * 0.8})`;
            ctx.fill();
            
            // Bubble rim
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${bubble.hue}, ${bubble.saturation}%, 70%, ${bubble.opacity * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            // Specular highlight
            ctx.beginPath();
            ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${bubble.hue}, 20%, 95%, ${bubble.opacity * 0.6})`;
            ctx.fill();
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.bubbles.forEach(bubble => {
                this.updateBubble(bubble);
                this.drawBubble(bubble);
            });
            
            this.animationId = requestAnimationFrame(() => this.animate());
        }
        
        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }

    // ============================================
    // PARALLAX SCROLLING
    // ============================================
    class ParallaxController {
        constructor() {
            this.hero = document.querySelector('.hero');
            this.heroBg = document.querySelector('.hero-parallax-bg');
            this.heroSunburst = document.querySelector('.hero-sunburst');
            this.scrollIndicator = document.querySelector('.hero-scroll-indicator');
            
            this.ticking = false;
            this.lastScrollY = 0;
            
            this.init();
        }
        
        init() {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        }
        
        onScroll() {
            this.lastScrollY = window.scrollY;
            
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }
        
        update() {
            const scrollY = this.lastScrollY;
            const windowHeight = window.innerHeight;
            
            // Hero parallax effect
            if (this.heroBg && scrollY < windowHeight * 1.5) {
                const parallaxOffset = scrollY * 0.4;
                this.heroBg.style.transform = `translateY(${parallaxOffset}px)`;
            }
            
            // Sunburst rotation based on scroll
            if (this.heroSunburst && scrollY < windowHeight * 1.5) {
                const rotation = scrollY * 0.02;
                this.heroSunburst.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            }
            
            // Fade scroll indicator
            if (this.scrollIndicator) {
                const opacity = Math.max(0, 1 - (scrollY / 200));
                this.scrollIndicator.style.opacity = opacity;
            }
        }
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    class ScrollReveal {
        constructor() {
            this.elements = [];
            this.init();
        }
        
        init() {
            // Select elements to animate
            const selectors = [
                '.featured-article',
                '.article-card',
                '.editorial-column',
                '.culture-feature',
                '.culture-card',
                '.advertisement',
                '.gold-divider'
            ];
            
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.classList.add('reveal-element');
                    this.elements.push(el);
                });
            });
            
            // Create observer
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            // Observe elements
            this.elements.forEach(el => this.observer.observe(el));
        }
        
        handleIntersection(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    
                    // Unobserve after revealing
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // ============================================
    // MASTHEAD ANIMATION
    // ============================================
    class MastheadAnimation {
        constructor() {
            this.masthead = document.querySelector('.masthead');
            this.title = document.querySelector('.title-main');
            this.navLinks = document.querySelectorAll('.masthead-nav a');
            
            this.init();
        }
        
        init() {
            // Animate title on load
            this.animateTitle();
            
            // Nav link hover effects
            this.setupNavEffects();
            
            // Masthead scroll behavior
            this.setupScrollBehavior();
        }
        
        animateTitle() {
            if (!this.title) return;
            
            const text = this.title.textContent;
            this.title.innerHTML = '';
            
            // Create spans for each letter
            text.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('letter-animate');
                this.title.appendChild(span);
            });
        }
        
        setupNavEffects() {
            this.navLinks.forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    // Create ripple effect
                    const ripple = document.createElement('span');
                    ripple.classList.add('nav-ripple');
                    e.target.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        }
        
        setupScrollBehavior() {
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                const currentScroll = window.scrollY;
                
                if (currentScroll > 100) {
                    this.masthead.classList.add('scrolled');
                } else {
                    this.masthead.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
            }, { passive: true });
        }
    }

    // ============================================
    // GOLD SHIMMER EFFECT
    // ============================================
    class GoldShimmer {
        constructor() {
            this.init();
        }
        
        init() {
            // Add shimmer to gold elements on mouse move
            const goldElements = document.querySelectorAll('.article-title, .section-title, .footer-title');
            
            goldElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    
                    el.style.setProperty('--shimmer-x', `${x}%`);
                    el.style.setProperty('--shimmer-y', `${y}%`);
                });
            });
        }
    }

    // ============================================
    // ADVERTISEMENT HOVER EFFECTS
    // ============================================
    class AdEffects {
        constructor() {
            this.ads = document.querySelectorAll('.advertisement');
            this.init();
        }
        
        init() {
            this.ads.forEach(ad => {
                ad.addEventListener('mouseenter', () => this.onHover(ad));
                ad.addEventListener('mouseleave', () => this.onLeave(ad));
            });
        }
        
        onHover(ad) {
            // Add golden glow
            ad.style.filter = 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))';
            
            // Animate inner elements
            const headline = ad.querySelector('.ad-headline');
            if (headline) {
                headline.style.transform = 'scale(1.05)';
            }
        }
        
        onLeave(ad) {
            ad.style.filter = '';
            
            const headline = ad.querySelector('.ad-headline');
            if (headline) {
                headline.style.transform = '';
            }
        }
    }

    // ============================================
    // SMOOTH SCROLL NAVIGATION
    // ============================================
    class SmoothNav {
        constructor() {
            this.links = document.querySelectorAll('a[href^="#"]');
            this.init();
        }
        
        init() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        
                        const headerOffset = 100;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;
                        
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
    // GEOMETRIC PATTERN GENERATOR
    // ============================================
    class GeometricPatterns {
        constructor() {
            this.createDecorations();
        }
        
        createDecorations() {
            // Add floating geometric elements
            this.addFloatingShapes();
        }
        
        addFloatingShapes() {
            const container = document.querySelector('.hero');
            if (!container) return;
            
            const shapes = ['◇', '○', '△', '⬡'];
            
            for (let i = 0; i < 15; i++) {
                const shape = document.createElement('div');
                shape.className = 'floating-shape';
                shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                shape.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    font-size: ${Math.random() * 20 + 10}px;
                    color: rgba(212, 175, 55, ${Math.random() * 0.1 + 0.05});
                    pointer-events: none;
                    animation: floatShape ${Math.random() * 10 + 10}s ease-in-out infinite;
                    animation-delay: ${Math.random() * -10}s;
                `;
                container.appendChild(shape);
            }
            
            // Add CSS animation
            if (!document.getElementById('floating-shapes-style')) {
                const style = document.createElement('style');
                style.id = 'floating-shapes-style';
                style.textContent = `
                    @keyframes floatShape {
                        0%, 100% { 
                            transform: translateY(0) rotate(0deg); 
                            opacity: 0.5;
                        }
                        25% { 
                            transform: translateY(-20px) rotate(90deg); 
                            opacity: 0.8;
                        }
                        50% { 
                            transform: translateY(-10px) rotate(180deg); 
                            opacity: 0.5;
                        }
                        75% { 
                            transform: translateY(-30px) rotate(270deg); 
                            opacity: 0.7;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // ============================================
    // CURSOR TRAIL EFFECT
    // ============================================
    class CursorTrail {
        constructor() {
            this.trail = [];
            this.maxTrail = 8;
            this.init();
        }
        
        init() {
            // Create trail elements
            for (let i = 0; i < this.maxTrail; i++) {
                const dot = document.createElement('div');
                dot.className = 'cursor-trail-dot';
                dot.style.cssText = `
                    position: fixed;
                    width: ${8 - i}px;
                    height: ${8 - i}px;
                    background: radial-gradient(circle, rgba(212, 175, 55, ${0.6 - i * 0.07}), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transition: transform ${0.1 + i * 0.02}s ease;
                `;
                document.body.appendChild(dot);
                this.trail.push({ el: dot, x: 0, y: 0 });
            }
            
            // Track mouse
            document.addEventListener('mousemove', (e) => this.updateTrail(e));
        }
        
        updateTrail(e) {
            // Update positions with delay
            this.trail.forEach((dot, index) => {
                setTimeout(() => {
                    dot.x = e.clientX;
                    dot.y = e.clientY;
                    dot.el.style.transform = `translate(${dot.x - 4}px, ${dot.y - 4}px)`;
                }, index * 30);
            });
        }
    }

    // ============================================
    // TYPOGRAPHY ANIMATIONS
    // ============================================
    class TypographyAnimations {
        constructor() {
            this.init();
        }
        
        init() {
            // Drop cap hover effect
            this.setupDropCaps();
            
            // Pull quote animation
            this.setupPullQuotes();
        }
        
        setupDropCaps() {
            const dropCaps = document.querySelectorAll('.drop-cap');
            
            dropCaps.forEach(cap => {
                cap.addEventListener('mouseenter', () => {
                    cap.style.transform = 'scale(1.1) rotate(-5deg)';
                    cap.style.textShadow = '4px 4px 0 var(--gold-dark), 8px 8px 0 rgba(212, 175, 55, 0.3)';
                });
                
                cap.addEventListener('mouseleave', () => {
                    cap.style.transform = '';
                    cap.style.textShadow = '';
                });
            });
        }
        
        setupPullQuotes() {
            const quotes = document.querySelectorAll('.pull-quote');
            
            quotes.forEach(quote => {
                quote.addEventListener('mouseenter', () => {
                    quote.style.borderLeftColor = 'var(--gold-bright)';
                    quote.style.borderRightColor = 'var(--gold-bright)';
                });
                
                quote.addEventListener('mouseleave', () => {
                    quote.style.borderLeftColor = '';
                    quote.style.borderRightColor = '';
                });
            });
        }
    }

    // ============================================
    // LOADING SEQUENCE
    // ============================================
    class LoadingSequence {
        constructor() {
            this.init();
        }
        
        init() {
            // Create loading overlay
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-sunburst">
                        <svg viewBox="0 0 100 100" width="80" height="80">
                            <g class="loading-rays">
                                ${Array.from({length: 12}, (_, i) => 
                                    `<line x1="50" y1="50" x2="50" y2="10" 
                                         transform="rotate(${i * 30} 50 50)"
                                         stroke="#d4af37" stroke-width="1"/>`
                                ).join('')}
                            </g>
                            <circle cx="50" cy="50" r="8" fill="#d4af37"/>
                        </svg>
                    </div>
                    <p class="loading-text">The Gilded Gazette</p>
                </div>
            `;
            
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0a0a;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.8s ease, visibility 0.8s ease;
            `;
            
            document.body.appendChild(overlay);
            
            // Add loading styles
            const style = document.createElement('style');
            style.textContent = `
                .loading-content {
                    text-align: center;
                }
                .loading-sunburst {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .loading-text {
                    font-family: 'Cinzel Decorative', serif;
                    font-size: 1.5rem;
                    color: #d4af37;
                    margin-top: 20px;
                    letter-spacing: 0.3em;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            // Hide loading after page loads
            window.addEventListener('load', () => {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                    setTimeout(() => overlay.remove(), 800);
                }, 1000);
            });
        }
    }

    // ============================================
    // INTERACTIVE ARTICLE CARDS
    // ============================================
    class InteractiveCards {
        constructor() {
            this.cards = document.querySelectorAll('.article-card, .culture-card');
            this.init();
        }
        
        init() {
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
                card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
            });
        }
        
        handleMouseMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            
            // Gold highlight
            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(212, 175, 55, 0.1) 0%,
                    var(--noir-light) 50%
                )
            `;
        }
        
        handleMouseLeave(e, card) {
            card.style.transform = '';
            card.style.background = '';
        }
    }

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Loading sequence
        new LoadingSequence();
        
        // Core features
        const bubblesCanvas = document.getElementById('bubbles-canvas');
        if (bubblesCanvas) {
            new ChampagneBubbles(bubblesCanvas);
        }
        
        new ParallaxController();
        new ScrollReveal();
        new MastheadAnimation();
        new GoldShimmer();
        new AdEffects();
        new SmoothNav();
        new GeometricPatterns();
        new TypographyAnimations();
        new InteractiveCards();
        
        // Optional: Cursor trail (uncomment to enable)
        // new CursorTrail();
        
        console.log('%c✦ The Gilded Gazette ✦', 
            'color: #d4af37; font-size: 24px; font-family: Georgia, serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
        console.log('%cA Journal of Refinement Since 1923', 
            'color: #f7e7ce; font-size: 12px; font-family: Georgia, serif; font-style: italic;');
    });

    // ============================================
    // REVEAL ELEMENT STYLES (injected via JS)
    // ============================================
    const revealStyles = document.createElement('style');
    revealStyles.textContent = `
        .reveal-element {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .letter-animate {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            animation: letterReveal 0.5s ease forwards;
        }
        
        @keyframes letterReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .nav-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(212, 175, 55, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.6s ease forwards;
        }
        
        @keyframes rippleExpand {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
        
        .masthead.scrolled {
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
        }
        
        /* Gold shimmer on titles */
        .article-title,
        .section-title,
        .footer-title {
            background-size: 200% 200%;
            background-image: linear-gradient(
                135deg,
                var(--gold-dark) 0%,
                var(--gold-primary) 25%,
                var(--gold-bright) 50%,
                var(--gold-primary) 75%,
                var(--gold-dark) 100%
            );
            -webkit-background-clip: text;
            background-clip: text;
        }
        
        .article-title:hover,
        .section-title:hover,
        .footer-title:hover {
            animation: shimmerText 2s ease infinite;
        }
        
        @keyframes shimmerText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Drop cap transition */
        .drop-cap {
            transition: transform 0.3s ease, text-shadow 0.3s ease;
        }
        
        /* Pull quote transition */
        .pull-quote {
            transition: border-color 0.3s ease;
        }
        
        /* Card transitions */
        .article-card,
        .culture-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
        }
        
        /* Ad headline transition */
        .ad-headline {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(revealStyles);

})();
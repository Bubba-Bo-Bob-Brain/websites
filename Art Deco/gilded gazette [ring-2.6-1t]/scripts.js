/* ============================================================
   THE GILDED CHRONICLE — Interactive Scripts
   ============================================================ */

(function () {
    'use strict';

    /* ============================
       UTILITY FUNCTIONS
       ============================ */

    /**
     * Check if an element is in the viewport
     * @param {Element} el
     * @param {number} offset - percentage of element height visible before triggering
     * @returns {boolean}
     */
    function isInViewport(el, offset) {
        if (!el) return false;
        offset = offset || 0.15;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * (1 - offset) && rect.bottom >= windowHeight * offset;
    }

    /**
     * Generate a random number between min and max
     */
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Debounce function for scroll/resize events
     */
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /* ============================
       1. CHAMPAGNE BUBBLE PARTICLES
       ============================ */

    const bubbleCanvas = document.getElementById('bubbleCanvas');
    const bubbleCtx = bubbleCanvas.getContext('2d');
    let bubbles = [];
    let bubbleAnimationId;

    /**
     * Resize the bubble canvas to match the viewport
     */
    function resizeBubbleCanvas() {
        bubbleCanvas.width = window.innerWidth;
        bubbleCanvas.height = window.innerHeight;
    }

    /**
     * Bubble class — represents a single champagne bubble
     */
    class Bubble {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = randomRange(0, bubbleCanvas.width);
            this.y = bubbleCanvas.height + randomRange(10, 100);
            this.radius = randomRange(1.5, 6);
            this.speedY = randomRange(0.3, 1.8);
            this.speedX = randomRange(-0.4, 0.4);
            this.opacity = randomRange(0.15, 0.6);
            this.fadeSpeed = randomRange(0.001, 0.004);
            this.wobble = randomRange(0, Math.PI * 2);
            this.wobbleSpeed = randomRange(0.01, 0.04);
            this.wobbleAmplitude = randomRange(0.5, 2);

            // Golden shimmer color variations
            const goldTint = Math.random();
            if (goldTint < 0.4) {
                // Warm gold
                this.r = 245;
                this.g = 208;
                this.b = 138;
            } else if (goldTint < 0.7) {
                // Champagne cream
                this.r = 255;
                this.g = 240;
                this.b = 210;
            } else {
                // Soft amber
                this.r = 230;
                this.g = 195;
                this.b = 120;
            }
        }

        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmplitude * 0.1;
            this.opacity -= this.fadeSpeed;

            // Add subtle size pulsing
            this.radius += Math.sin(this.wobble * 2) * 0.02;

            // Reset if bubble goes off screen or fades out
            if (this.y + this.radius < -20 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            // Outer glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 2.5
            );
            gradient.addColorStop(0, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${this.r}, ${this.g}, ${this.b}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Bubble body
            ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity * 0.15})`;
            ctx.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity * 0.6})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Highlight reflection
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.4})`;
            ctx.beginPath();
            ctx.arc(
                this.x - this.radius * 0.3,
                this.y - this.radius * 0.3,
                this.radius * 0.3,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.restore();
        }
    }

    /**
     * Initialize bubbles
     */
    function initBubbles() {
        resizeBubbleCanvas();
        bubbles = [];
        const bubbleCount = Math.min(Math.floor(window.innerWidth / 8), 60);
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = new Bubble();
            // Distribute initial positions vertically
            bubble.y = randomRange(0, bubbleCanvas.height);
            bubble.opacity = randomRange(0.05, 0.4);
            bubbles.push(bubble);
        }
    }

    /**
     * Animate bubbles
     */
    function animateBubbles() {
        bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

        // Only draw bubbles on the hero section and early scroll
        const scrollProgress = window.scrollY / (window.innerHeight * 1.5);
        const fadeMultiplier = Math.max(0, 1 - scrollProgress);

        if (fadeMultiplier <= 0) {
            bubbleAnimationId = requestAnimationFrame(animateBubbles);
            return;
        }

        bubbles.forEach(bubble => {
            bubble.update();
            const adjustedOpacity = bubble.opacity * fadeMultiplier;
            bubbleCtx.save();
            bubbleCtx.globalAlpha = adjustedOpacity;

            const gradient = bubbleCtx.createRadialGradient(
                bubble.x, bubble.y, 0,
                bubble.x, bubble.y, bubble.radius * 2.5
            );
            gradient.addColorStop(0, `rgba(${bubble.r}, ${bubble.g}, ${bubble.b}, ${adjustedOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${bubble.r}, ${bubble.g}, ${bubble.b}, 0)`);
            bubbleCtx.fillStyle = gradient;
            bubbleCtx.beginPath();
            bubbleCtx.arc(bubble.x, bubble.y, bubble.radius * 2.5, 0, Math.PI * 2);
            bubbleCtx.fill();

            bubbleCtx.fillStyle = `rgba(${bubble.r}, ${bubble.g}, ${bubble.b}, ${adjustedOpacity * 0.15})`;
            bubbleCtx.strokeStyle = `rgba(${bubble.r}, ${bubble.g}, ${bubble.b}, ${adjustedOpacity * 0.6})`;
            bubbleCtx.lineWidth = 0.5;
            bubbleCtx.beginPath();
            bubbleCtx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            bubbleCtx.fill();
            bubbleCtx.stroke();

            bubbleCtx.fillStyle = `rgba(255, 255, 255, ${adjustedOpacity * 0.4})`;
            bubbleCtx.beginPath();
            bubbleCtx.arc(
                bubble.x - bubble.radius * 0.3,
                bubble.y - bubble.radius * 0.3,
                bubble.radius * 0.3,
                0,
                Math.PI * 2
            );
            bubbleCtx.fill();

            bubbleCtx.restore();
        });

        bubbleAnimationId = requestAnimationFrame(animateBubbles);
    }

    /* ============================
       2. PARALLAX EFFECT
       ============================ */

    const heroSection = document.querySelector('.hero-section');
    const heroBackLayer = document.querySelector('.hero-parallax-layer--back');
    const heroMidLayer = document.querySelector('.hero-parallax-layer--mid');
    const heroFan = document.querySelector('.hero-fan');

    function applyParallax() {
        if (!heroSection) return;

        const scrollY = window.scrollY;
        const heroRect = heroSection.getBoundingClientRect();
        const heroCenter = heroRect.top + heroRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distanceFromCenter = heroCenter - viewportCenter;
        const normalizedDistance = distanceFromCenter / (heroRect.height + window.innerHeight);

        // Only apply parallax when hero section is visible
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
            const backOffset = scrollY * 0.15;
            const midOffset = scrollY * 0.35;

            heroBackLayer.style.transform = `translateY(${backOffset}px)`;
            heroMidLayer.style.transform = `translateY(${midOffset}px)`;

            // Rotate fan subtly on scroll
            if (heroFan) {
                const fanRotation = normalizedDistance * 15;
                heroFan.style.transform = `rotate(${fanRotation}deg) scale(1.1)`;
                heroFan.style.opacity = Math.max(0, 0.15 - Math.abs(normalizedDistance) * 0.3);
            }

            // Fade hero content out on scroll
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const heroFade = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
                heroContent.style.opacity = heroFade;
                heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
            }
        }
    }

    /* ============================
       3. SCROLL-TRIGGERED ANIMATIONS
       ============================ */

    const animateElements = document.querySelectorAll('.animate-in');
    const sectionHeaders = document.querySelectorAll('.section-header');

    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // For section headers, trigger child animations
                    if (entry.target.classList.contains('section-header')) {
                        const title = entry.target.querySelector('.section-title');
                        const subtitle = entry.target.querySelector('.section-subtitle');
                        const overtitle = entry.target.querySelector('.section-overtitle');
                        if (overtitle) overtitle.classList.add('visible');
                        if (title) title.classList.add('visible');
                        if (subtitle) subtitle.classList.add('visible');
                    }
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    // Observe all animatable elements
    animateElements.forEach((el, index) => {
        // Ensure elements start hidden for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        animationObserver.observe(el);
    });

    // Also observe section headers for staggered child animations
    sectionHeaders.forEach(header => {
        const children = header.querySelectorAll('.section-overtitle, .section-title, .section-subtitle, .section-ornament');
        children.forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(10px)';
            child.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
        });
        header.addEventListener('visible', () => {
            children.forEach(c => c.classList.add('visible'));
        });
    });

    // Custom handling for section headers
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('.section-overtitle, .section-title, .section-subtitle, .section-ornament');
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, i * 120);
                    });
                }
            });
        },
        { threshold: 0.2 }
    );

    sectionHeaders.forEach(h => headerObserver.observe(h));

    /* ============================
       4. NAVIGATION — SCROLL SPY
       ============================ */

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [];

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                sections.push({
                    id: href.substring(1),
                    element: target,
                    link: link
                });
            }
        }
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.element.offsetTop;
            const sectionBottom = sectionTop + section.element.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                section.link.classList.add('active');
            }
        });
    }

    // Active nav link styling
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--gold-bright) !important;
            text-shadow: 0 0 10px rgba(212, 168, 67, 0.4);
        }
        .nav-link.active::after {
            width: 100% !important;
            background: var(--gold-bright) !important;
        }
    `;
    document.head.appendChild(style);

    /* ============================
       5. SMOOTH SCROLL FOR NAV LINKS
       ============================ */

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
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
            }
        });
    });

    /* ============================
       6. BACK TO TOP BUTTON
       ============================ */

    const backToTopBtn = document.querySelector('.back-to-top');

    function handleBackToTop() {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('visible');
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.classList.remove('visible');
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    }

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ============================
       7. NEWSLETTER FORM INTERACTION
       ============================ */

    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = document.getElementById('email-input');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            if (!email || !email.includes('@')) {
                showNewsletterFeedback('Please enter a valid correspondence address...', false);
                return;
            }

            // Simulate subscription
            const btn = newsletterForm.querySelector('.newsletter-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Subscribing <span class="btn-deco">✦</span>';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                showNewsletterFeedback('You have been inscribed to The Gilded Dispatch. A wax seal confirmation is forthcoming.', true);
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                emailInput.value = '';
            }, 1500);
        });
    }

    function showNewsletterFeedback(message, isSuccess) {
        // Remove existing feedback
        const existing = document.querySelector('.newsletter-feedback');
        if (existing) existing.remove();

        const feedback = document.createElement('div');
        feedback.className = 'newsletter-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            margin-top: 0.8rem;
            padding: 0.7rem 1rem;
            font-family: 'Cormorant Garamond', serif;
            font-size: 0.85rem;
            font-style: italic;
            border-radius: 2px;
            text-align: center;
            animation: feedbackFade 0.4s ease;
            ${isSuccess
                ? 'background: rgba(212, 168, 67, 0.1); color: var(--gold-bright); border: 1px solid rgba(212, 168, 67, 0.3);'
                : 'background: rgba(180, 60, 60, 0.1); color: #e0a0a0; border: 1px solid rgba(180, 60, 60, 0.3);'}
        `;

        newsletterForm.appendChild(feedback);

        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transition = 'opacity 0.4s ease';
            setTimeout(() => feedback.remove(), 400);
        }, 4000);
    }

    // Add feedback animation keyframe
    const feedbackStyle = document.createElement('style');
    feedbackStyle.textContent = `
        @keyframes feedbackFade {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(feedbackStyle);

    /* ============================
       8. INTERACTIVE GOLD SHIMMER ON HOVER
       ============================ */

    // Add shimmer effect to feature cards and editorial cards on hover
    const shimmerCards = document.querySelectorAll('.feature-card, .editorial-card, .arts-card');

    shimmerCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.setProperty('transition', 'all 0.4s ease');
        });
    });

    /* ============================
       9. SCROLL-BASED OPACITY FOR SECTION HEADERS
       ============================ */

    function handleHeaderOpacity() {
        sectionHeaders.forEach(header => {
            const rect = header.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const distance = Math.abs(rect.top + rect.height / 2 - windowHeight / 2);
            const maxDistance = windowHeight * 0.8;
            const opacity = Math.max(0.3, 1 - distance / maxDistance);
            header.style.opacity = opacity;
        });
    }

    /* ============================
       10. DYNAMIC GLOW UNDER CURSOR ON HERO
       ============================ */

    const heroSectionEl = document.querySelector('.hero-section');

    if (heroSectionEl) {
        heroSectionEl.addEventListener('mousemove', debounce(function (e) {
            const rect = heroSectionEl.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            heroSectionEl.style.setProperty('--cursor-x', `${x}%`);
            heroSectionEl.style.setProperty('--cursor-y', `${y}%`);
        }, 16));
    }

    /* ============================
       11. AD CARD INTERACTION — gentle 3D tilt
       ============================ */

    const adCards = document.querySelectorAll('.ad-card');

    adCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ============================
       12. CHRONICLE CARD NUMBER REVEAL
       ============================ */

    const chronicleCards = document.querySelectorAll('.chronicle-card');

    const chronicleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const number = entry.target.querySelector('.chronicle-number');
                    if (number) {
                        number.style.transition = 'transform 0.6s ease, color 0.6s ease';
                        number.style.transform = 'scale(1)';
                        number.style.color = 'rgba(212, 168, 67, 0.3)';
                    }
                }
            });
        },
        { threshold: 0.3 }
    );

    chronicleCards.forEach(card => {
        const number = card.querySelector('.chronicle-number');
        if (number) {
            number.style.transform = 'scale(0.5)';
            number.style.transition = 'transform 0.6s ease, color 0.6s ease';
            number.style.display = 'inline-block';
            chronicleObserver.observe(card);
        }
    });

    /* ============================
       13. COUNTER ANIMATION FOR CHRONICLE NUMBERS
       ============================ */

    // Animate numbers counting up when visible
    function animateNumber(el, target) {
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = String(Math.floor(current)).padStart(2, '0');
        }, 30);
    }

    /* ============================
       14. NAVBAR SHRINK ON SCROLL
       ============================ */

    const mainNav = document.querySelector('.main-nav');
    let lastScroll = 0;

    function handleNavScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            mainNav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            mainNav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }

    /* ============================
       15. REVEAL EDITORIAL FLOAT FRAME WITH DELAY
       ============================ */

    const floatFrames = document.querySelectorAll('.editorial-float-frame');

    const floatFrameObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate(-15px, -15px)';
                }
            });
        },
        { threshold: 0.3 }
    );

    floatFrames.forEach(frame => {
        frame.style.opacity = '0';
        frame.style.transform = 'translate(0, 0)';
        frame.style.transition = 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s';
        floatFrameObserver.observe(frame);
    });

    /* ============================
       16. TYPING EFFECT FOR HERO DECK (subtle)
       ============================ */
    // Not a full typing effect — just a gentle fade-in sequence for hero text elements

    function animateHeroSequence() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        const elements = [
            heroContent.querySelector('.hero-eyebrow'),
            heroContent.querySelector('.hero-headline'),
            heroContent.querySelector('.hero-deck'),
            heroContent.querySelector('.hero-byline'),
            heroContent.querySelector('.hero-cta')
        ].filter(Boolean);

        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            el.style.transition = `opacity 0.8s ease ${i * 0.2}s, transform 0.8s ease ${i * 0.2}s`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            });
        });
    }

    /* ============================
       17. GOLD LEAF DIVIDER ANIMATION
       ============================ */

    const goldDividers = document.querySelectorAll('.gold-divider');

    const dividerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const svg = entry.target.querySelector('svg');
                    if (svg) {
                        const children = svg.children;
                        for (let child of children) {
                            child.style.transition = 'opacity 0.6s ease';
                            child.style.opacity = '0';
                        }
                        // Stagger the reveal of SVG children
                        Array.from(children).forEach((child, i) => {
                            setTimeout(() => {
                                child.style.opacity = child.getAttribute('opacity') || '';
                                child.style.removeProperty('opacity');
                            }, i * 30);
                        });
                    }
                }
            });
        },
        { threshold: 0.5 }
    );

    goldDividers.forEach(d => dividerObserver.observe(d));

    /* ============================
       18. PRELOADER / PAGE LOAD SEQUENCE
       ============================ */

    function initPageSequence() {
        // Start bubble animation
        animateBubbles();

        // Animate hero sequence
        animateHeroSequence();

        // Start scroll spy
        updateActiveNav();
    }

    /* ============================
       EVENT LISTENERS & INIT
       ============================ */

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            applyParallax();
            handleBackToTop();
            updateActiveNav();
            handleNavScroll();
            handleHeaderOpacity();
        });
    }, { passive: true });

    window.addEventListener('resize', debounce(() => {
        resizeBubbleCanvas();
        // Re-init bubbles on resize
        initBubbles();
    }, 250));

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageSequence);
    } else {
        initPageSequence();
    }

    /* ============================
       19. KEYBOARD NAVIGATION SUPPORT
       ============================ */

    document.addEventListener('keydown', (e) => {
        // Escape closes any open interactive elements
        if (e.key === 'Escape') {
            // Could close modals, dropdowns, etc.
        }
    });

    /* ============================
       20. REDUCED MOTION PREFERENCE
       ============================ */

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionPreference() {
        if (motionQuery.matches) {
            // Disable parallax
            heroBackLayer.style.transform = 'none';
            heroMidLayer.style.transform = 'none';
            if (heroFan) heroFan.style.display = 'none';

            // Disable bubble animation
            cancelAnimationFrame(bubbleAnimationId);
            bubbleCanvas.style.display = 'none';

            // Remove all transitions for animated elements
            document.querySelectorAll('.animate-in, .nav-link, .feature-card, .arts-card, .editorial-card, .chronicle-card, .ad-card').forEach(el => {
                el.style.transition = 'none';
            });
        }
    }

    if (motionQuery.matches) {
        handleMotionPreference();
    }
    motionQuery.addEventListener('change', handleMotionPreference);

    /* ============================
       21. ENSURE INITIAL PARALLAX STATE
       ============================ */
    applyParallax();

})();
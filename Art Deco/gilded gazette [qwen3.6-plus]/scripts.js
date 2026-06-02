/**
 * THE GILDED CHRONICLE — JavaScript
 * Handles interactivity, animations, parallax effects, and immersive details.
 */

document.addEventListener('DOMContentLoaded', () => {
    initChampagneBubbles();
    initScrollReveal();
    initHeroParallax();
    initBackToTop();
    initSmoothScroll();
    initNavigation();
});

/**
 * 1. Champagne Bubble Particles
 * Generates elegant, floating bubbles that rise from the bottom of the screen.
 * Mimics the effervescence of a freshly poured glass of vintage champagne.
 */
function initChampagneBubbles() {
    const container = document.getElementById('champagne-particles');
    if (!container) return;

    let bubbleCount = 0;
    const MAX_BUBBLES = 25; // Performance cap to prevent DOM overload

    const createBubble = () => {
        if (bubbleCount >= MAX_BUBBLES) return;

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubbleCount++;

        // Randomize physical properties for organic variation
        const size = Math.random() * 10 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 8; // 8-14 seconds
        const delay = Math.random() * 2;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.opacity = Math.random() * 0.3 + 0.1;

        container.appendChild(bubble);

        // Clean up DOM after animation completes
        bubble.addEventListener('animationend', () => {
            bubble.remove();
            bubbleCount--;
        });
    };

    // Initial ambient burst
    for (let i = 0; i < 10; i++) {
        setTimeout(createBubble, Math.random() * 2000);
    }

    // Continuous gentle generation
    setInterval(createBubble, 800);
}

/**
 * 2. Scroll Reveal Animations
 * Uses IntersectionObserver to elegantly fade in sections as they enter the viewport.
 */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after revealing to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-reveal]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * 3. Hero Section Parallax
 * Applies a subtle, performant parallax effect to the sunburst background on scroll.
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero-section');
    const sunburst = document.querySelector('.sunburst-bg');
    
    if (!hero || !sunburst) return;

    const updateParallax = () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        // Only calculate if hero is still partially in view
        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            
            // Calculate dynamic transforms
            const translateY = progress * 50; // Max 50px downward shift
            const rotate = progress * 20;     // Max 20deg rotation
            const opacity = 1 - (progress * 0.85); // Fade out smoothly

            // Apply transforms while preserving CSS centering
            sunburst.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) rotate(${rotate}deg)`;
            sunburst.style.opacity = Math.max(0, opacity);
        }
    };

    // Use requestAnimationFrame for buttery 60fps performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * 4. Back to Top Button
 * Manages visibility and smooth scroll behavior for the floating action button.
 */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const toggleVisibility = () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 5. Smooth Scroll for Anchor Links
 * Intercepts internal navigation links and scrolls smoothly to target sections,
 * accounting for the sticky navigation bar height.
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const nav = document.querySelector('.deco-nav');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 6. Navigation Enhancement
 * Dynamically adjusts the navigation bar's appearance based on scroll position
 * to enhance depth and focus as the user reads deeper into the magazine.
 */
function initNavigation() {
    const nav = document.querySelector('.deco-nav');
    if (!nav) return;

    const updateNav = () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(201, 168, 76, 0.12), 0 1px 0 rgba(201, 168, 76, 0.3)';
            nav.style.borderBottom = '1px solid rgba(201, 168, 76, 0.5)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.92)';
            nav.style.boxShadow = 'none';
            nav.style.borderBottom = '1px solid rgba(201, 168, 76, 0.8)';
        }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
}
/**
 * KAIZEN MANGA // INTERACTION ENGINE
 * Professional-grade motion and interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INJECT ANIMATION STYLES
    // We inject these to ensure the JS reveal logic has the necessary CSS transitions
    const style = document.createElement('style');
    style.textContent = `
        /* Reveal Animation States */
        .hero-panel, .spotlight-card, .anime-entry, .manga-panel, .section-header {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), 
                        transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* Staggered Delays for Grid Items */
        .anime-entry:nth-child(2) { transition-delay: 0.1s; }
        .anime-entry:nth-child(3) { transition-delay: 0.2s; }
        .anime-entry:nth-child(4) { transition-delay: 0.3s; }

        /* Cursor Active State */
        #cursor-follower.active {
            transform: translate(-50%, -50%) scale(2);
            background: rgba(0, 245, 212, 0.1);
            border-color: #00f5d4;
        }
    `;
    document.head.appendChild(style);

    // 2. CUSTOM CURSOR ENGINE
    const cursor = document.querySelector('#custom-cursor');
    const follower = document.querySelector('#cursor-follower');
    const interactables = document.querySelectorAll('a, button, .anime-entry, .btn-main, .btn-secondary');

    document.addEventListener('mousemove', (e) => {
        // Fast cursor
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Smooth follower (using requestAnimationFrame for performance in a real app, 
        // but direct style update is fine here for the follower's CSS transition)
        follower.style.left = `${e.clientX}px`;
        follower.style.top = `${e.clientY}px`;
    });

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('active'));
        el.addEventListener('mouseleave', () => follower.classList.remove('active'));
    });

    // 3. HERO PARALLAX ENGINE
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.side-panel-image img');

    if (heroSection && heroImage) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate movement offset (-20 to 20 pixels)
            const moveX = (clientX - innerWidth / 2) / innerWidth * 30;
            const moveY = (clientY - innerHeight / 2) / innerHeight * 30;

            heroImage.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        });

        // Reset position when mouse leaves hero
        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transform = `scale(1) translate(0, 0)`;
        });
    }

    // 4. SCROLL REVEAL ENGINE (Intersection Observer)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Once revealed, stop observing this element
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Target all elements that should animate on scroll
    const elementsToReveal = document.querySelectorAll(
        '.hero-panel, .spotlight-card, .anime-entry, .manga-panel, .section-header, .magazine-header'
    );
    
    elementsToReveal.forEach(el => revealObserver.observe(el));

    // 5. CHARACTER SPOTLIGHT CAROUSEL (Simulated Interaction)
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const spotlightCard = document.querySelector('.spotlight-card');

    if (prevBtn && nextBtn) {
        // We simulate a "next" action by adding a shake and changing text
        // In a production app, this would swap data/images
        const handleCarouselClick = () => {
            spotlightCard.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            spotlightCard.style.transform = 'scale(0.95) rotate(-1deg)';
            
            setTimeout(() => {
                spotlightCard.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        };

        prevBtn.addEventListener('click', handleCarouselClick);
        nextBtn.addEventListener('click', handleCarouselClick);
    }

    // 6. LOG CONSOLE (For Developer Experience)
    console.log("%c KAIZEN MANGA ENGINE ACTIVE ", "background: #e63946; color: #fff; font-weight: bold;");
});
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. CURTAIN REVEAL ANIMATION
    // =========================================
    const curtainBtn = document.getElementById('raise-curtain-btn');
    const body = document.body;

    if (curtainBtn) {
        curtainBtn.addEventListener('click', () => {
            // Add class to trigger CSS transitions
            body.classList.add('curtain-open');
            
            // Play a subtle sound effect (optional, commented out to prevent autoplay issues)
            // const audio = new Audio('path_to_curtain_sound.mp3');
            // audio.play();

            // Remove the curtain container from DOM after animation to improve performance
            setTimeout(() => {
                const curtainContainer = document.getElementById('curtain-container');
                if (curtainContainer) {
                    curtainContainer.style.display = 'none';
                }
            }, 1500);
        });
    }

    // =========================================
    // 2. DYNAMIC SPOTLIGHT (CHIAROSCURO EFFECT)
    // =========================================
    const spotlightLayer = document.getElementById('spotlight-layer');

    document.addEventListener('mousemove', (e) => {
        if (body.classList.contains('curtain-open')) {
            const x = e.clientX;
            const y = e.clientY;

            // Update CSS variables for the gradient position
            if (spotlightLayer) {
                spotlightLayer.style.setProperty('--x', `${x}px`);
                spotlightLayer.style.setProperty('--y', `${y}px`);
            }
        }
    });

    // =========================================
    // 3. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.hero-text, .hero-visual, .event-card, .box-text, .box-visual'
    );

    animatedElements.forEach((el, index) => {
        // Add initial styles for staggered animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
        
        observer.observe(el);
    });

    // Add the 'animate-in' class logic via CSS class injection or direct style manipulation
    // We'll use a class for cleaner separation
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // =========================================
    // 4. INTERACTIVE SEATING CHART (HOVER EFFECTS)
    // =========================================
    const seats = document.querySelectorAll('.seat-row span'); // If we added spans later
    // For now, we'll just add a hover effect to the grid rows
    const seatRows = document.querySelectorAll('.seat-row');
    
    seatRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.color = 'var(--color-gold)';
            row.style.textShadow = '0 0 10px var(--color-gold)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.color = '#444';
            row.style.textShadow = 'none';
        });
    });

    // =========================================
    // 5. PARALLAX EFFECT FOR HERO IMAGE
    // =========================================
    const heroVisual = document.querySelector('.hero-visual');
    
    document.addEventListener('scroll', () => {
        if (window.scrollY < 600) {
            if (heroVisual) {
                const scrolled = window.scrollY;
                heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        }
    });
});
/**
 * The Verdant Grimoire - Enchantment Engine
 * A collection of magical interactions for a whimsical herbalist website.
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCustomCursor();
    initThemeToggle();
    initSeasonalWheel();
    initScrollReveal();
});

/**
 * 1. THE RITUAL LOADING SEQUENCE
 * Fades out the cauldron loading screen after a simulated 'brewing' time.
 */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Simulate the time it takes to brew a potion
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000); // Wait for fade-out to complete
    }, 3000);
}

/**
 * 2. THE EMBER CURSOR
 * A smooth, organic cursor that follows the mouse with a slight lag,
 * making it feel like a floating spark of magic.
 */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0, mouseY = 0; // Actual mouse position
    let cursorX = 0, cursorY = 0; // Smoothed cursor position

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Ease the cursor towards the mouse position (Lerp)
        // The 0.1 value controls the "weight" or "lag" of the magic spark
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Interaction: Scale cursor on hoverable elements
    const interactables = document.querySelectorAll('button, .recipe-card, .season-handle, .switch');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(2.5)';
            cursor.style.backgroundColor = 'var(--accent-ochre)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
            cursor.style.backgroundColor = 'var(--accent-gold)';
        });
    });
}

/**
 * 3. THE CELESTIAL THEME SHIFT
 * Swaps the body class to trigger the CSS variable theme transition.
 */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('night-theme');
            localStorage.setItem('grimoire-theme', 'night');
        } else {
            body.classList.remove('night-theme');
            localStorage.setItem('grimoire-theme', 'day');
        }
    });

    // Persist user preference
    const savedTheme = localStorage.getItem('grimoire-theme');
    if (savedTheme === 'night') {
        toggle.checked = true;
        body.classList.add('night-theme');
    }
}

/**
 * 4. THE SEASONAL COMPASS
 * Rotates the seasonal wheel to align the selected season to the top.
 */
function initSeasonalWheel() {
    const wheel = document.getElementById('seasonal-wheel');
    const handles = document.querySelectorAll('.season-handle');
    
    const seasonRotations = {
        'spring': 0,
        'summer': -90,
        'autumn': -180,
        'winter': -270
    };

    handles.forEach(handle => {
        handle.addEventListener('click', (e) => {
            // Prevent event bubbling if necessary
            e.stopPropagation();
            
            const season = handle.getAttribute('data-season');
            const rotation = seasonRotations[season];

            // Rotate the entire wheel container
            wheel.style.transform = `rotate(${rotation}deg)`;
            
            // Optional: Add a visual "pulse" to the selected season
            handles.forEach(h => h.style.scale = '1');
            handle.style.scale = '1.5';

            console.log(`The spirits align for ${season}...`);
            // Here you could trigger filtering logic for the recipe cards
        });
    });
}

/**
 * 5. THE ALCHEMY OF MOTION (Scroll Reveal)
 * Uses IntersectionObserver to manifest elements as they enter the viewport.
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll(
        '.recipe-card, .featured-potion, .section-heading, .lore-item'
    );

    revealElements.forEach(el => {
        // We apply a base style via JS if not in CSS to ensure they start invisible
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        
        observer.observe(el);
    });

    // Add the "revealed" state to the CSS logic via a class update
    // (In a production environment, these styles would be in the CSS file)
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}
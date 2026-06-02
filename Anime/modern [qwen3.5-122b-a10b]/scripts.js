document.addEventListener('DOMContentLoaded', () => {
    // --- 1. PRELOADER SEQUENCE ---
    const loader = document.getElementById('loader');
    const bars = document.querySelectorAll('.loader-bar');
    const body = document.body;

    // Animate bars sequentially
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = '100%';
        }, index * 150);
    });

    // Hide loader after animation
    setTimeout(() => {
        if (loader) {
            loader.style.transform = 'translateY(-100%)'; // Slide up like a shutter
            body.style.overflowY = 'auto'; // Re-enable scrolling
        }
    }, 2500);

    // --- 2. CUSTOM CURSOR & HOVER EFFECTS ---
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Mouse movement logic
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        
        // Circle follows with lag (handled by CSS transition)
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    });

    // Hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .manga-card, .char-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorDot.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorDot.classList.remove('active');
        });
    });

    // --- 3. INTERSECTION OBSERVER (SCROLL ANIMATIONS) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Staggered animation for cards
                if (entry.target.classList.contains('manga-card')) {
                    const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                    entry.target.style.transitionDelay = delay;
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements to animate
    document.querySelectorAll('.manga-card').forEach(el => observer.observe(el));
    document.querySelectorAll('.section-title, .hero-text').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // --- 4. PARALLAX HERO EFFECT ---
    const heroSection = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');
    const panel1 = document.querySelector('.panel-1');
    const panel2 = document.querySelector('.panel-2');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Move text slightly
            if (heroText) heroText.style.transform = `translateX(${x * 0.5}px) translateY(${y * 0.5}px)`;
            
            // Move panels more for depth
            if (panel1) panel1.style.transform = `translate(-50%, -50%) rotate(-5deg) translateX(${x * 2}px) translateY(${y * 2}px)`;
            if (panel2) panel2.style.transform = `rotate(5deg) translateX(${x * 3}px) translateY(${y * 3}px)`;
        });
    }

    // --- 5. DYNAMIC GLITCH EFFECT ON TITLE ---
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            // Randomly trigger a "glitch" class on the text
            glitchText.style.textShadow = `${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0px var(--color-accent)`;
            setTimeout(() => {
                glitchText.style.textShadow = 'none';
            }, 100);
        }, 3000);
    }

    // --- 6. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log("INK & CHROMA: Systems Online.");
});

// Add CSS for cursor dynamically
const style = document.createElement('style');
style.innerHTML = `
    .custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        border: 2px solid var(--color-accent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, background 0.2s;
        mix-blend-mode: difference;
    }
    .custom-cursor.active {
        transform: translate(-50%, -50%) scale(1.5);
        background: rgba(0, 240, 255, 0.2);
        border-color: var(--color-alert);
    }
    .custom-cursor-dot {
        position: fixed;
        top: 0;
        left: 0;
        width: 6px;
        height: 6px;
        background: var(--color-ink);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 10000;
        transition: background 0.2s;
    }
    .custom-cursor-dot.active {
        background: var(--color-accent);
    }
    .fade-in-up {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .fade-in-up.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
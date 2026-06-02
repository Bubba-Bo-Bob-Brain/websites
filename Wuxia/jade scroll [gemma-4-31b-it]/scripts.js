/**
 * THE ETERNAL CODEX - SPIRIT ENGINE
 * Logic for ink flow, brush interactions, and scroll reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    initBrushCursor();
    initScrollReveals();
    initMeridianSystem();
    initSmoothScroll();
});

/**
 * 1. Custom Brush Cursor
 * Simulates an ink brush that grows and shrinks based on movement speed.
 */
function initBrushCursor() {
    const cursor = document.getElementById('brush-cursor');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Move cursor
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        // Calculate speed for dynamic brush size
        const speed = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
        const size = Math.min(30, 10 + speed * 2);
        cursor.style.width = `${size}px`;
        cursor.style.height = `${size}px`;
    });

    // Interaction effect: expand when hovering over clickable elements
    document.querySelectorAll('a, .acupoint, .technique-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'var(--color-cinnabar)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--color-ink)';
        });
    });
}

/**
 * 2. Scroll Reveals
 * Uses Intersection Observer to "paint" sections into view.
 */
function initScrollReveals() {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's a section, trigger the ink paths inside it
                if (entry.target.id === 'meridians') {
                    animateQiFlow();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * 3. Meridian & Qi System
 * Animates SVG paths to simulate energy flow and handles acupoint info.
 */
function initMeridianSystem() {
    const acupoints = document.querySelectorAll('.acupoint');
    const infoBox = document.getElementById('point-description');

    acupoints.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            const pointName = e.target.getAttribute('data-point');
            infoBox.style.opacity = '0';
            
            setTimeout(() => {
                infoBox.innerText = `Sensing Qi at: ${pointName}...`;
                infoBox.style.opacity = '1';
                infoBox.style.color = 'var(--color-cinnabar)';
            }, 200);

            // Highlight the paths connected to this point (visual simulation)
            document.querySelectorAll('.qi-path').forEach(path => {
                path.style.stroke = 'var(--color-gold)';
                path.style.strokeWidth = '5px';
            });
        });

        point.addEventListener('mouseleave', () => {
            document.querySelectorAll('.qi-path').forEach(path => {
                path.style.stroke = 'var(--color-ink)';
                path.style.strokeWidth = '3px';
            });
            infoBox.style.color = 'var(--color-ink)';
        });
    });
}

function animateQiFlow() {
    const paths = document.querySelectorAll('.qi-path');
    paths.forEach((path, index) => {
        // Trigger the CSS stroke-dashoffset animation with a stagger
        setTimeout(() => {
            path.style.strokeDashoffset = '0';
        }, index * 400);
    });
}

/**
 * 4. Smooth Scrolling
 * Enhances the feel of unrolling the scroll.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add a subtle "paper noise" movement to the parallax background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const bamboo = document.querySelector('.layer-bamboo');
    const mountains = document.querySelector('.layer-mountains');
    
    if (bamboo) bamboo.style.transform = `translateY(${scrolled * 0.2}px)`;
    if (mountains) mountains.style.transform = `translateY(${scrolled * 0.1}px)`;
});
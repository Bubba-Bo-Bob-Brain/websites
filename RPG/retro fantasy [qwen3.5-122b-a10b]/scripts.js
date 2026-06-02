/**
 * The Arcanum Codex - Interactive Scripts
 * Handles loading sequences, custom cursors, parallax effects, and scroll reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loading Sequence (Mana Core Initialization) ---
    const loader = document.getElementById('loader');
    const loaderText = loader.querySelector('.typewriter');
    const messages = [
        "Initializing Mana Core...",
        "Calibrating Runes...",
        "Summoning Spirits...",
        "Welcome, Traveler."
    ];
    
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
        const currentMsg = messages[msgIndex];
        
        if (isDeleting) {
            loaderText.textContent = currentMsg.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster when deleting
        } else {
            loaderText.textContent = currentMsg.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentMsg.length) {
            // Finished typing message, pause before deleting
            isDeleting = true;
            typeSpeed = 2000; 
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next message
            isDeleting = false;
            msgIndex = (msgIndex + 1) % messages.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Start the typewriter effect
    typeWriter();

    // Remove loader after a set time (simulating load complete)
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Trigger initial animations
            initScrollAnimations();
        }, 1000);
    }, 5000); // 5 seconds total loading simulation

    // --- 2. Custom Magical Cursor ---
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move the dot instantly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth follow animation for the outer ring
    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for cursor
    const interactables = document.querySelectorAll('a, button, .item-slot, .quest-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorDot.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorDot.classList.remove('hovered');
        });
    });

    // --- 3. Hero Section Parallax ---
    const heroSection = document.getElementById('hero');
    const portal = document.querySelector('.hero-bg-portal');
    const heroContent = document.querySelector('.hero-content');

    heroSection.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 50;
        const y = (window.innerHeight - e.pageY * 2) / 50;

        // Move portal slightly opposite to mouse
        portal.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
        
        // Move content slightly in same direction for depth
        heroContent.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
    });

    // --- 4. Scroll Reveal Animations ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing once revealed
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.section-container, .quest-card, .item-slot, .book-page');
        revealElements.forEach(el => {
            el.classList.add('reveal-hidden'); // Initial state handled by CSS
            observer.observe(el);
        });
    }
});

// --- CSS Styles for JS-generated elements (Injected dynamically) ---
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .custom-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, background-color 0.3s;
        box-shadow: 0 0 10px var(--accent-cyan);
    }

    .custom-cursor.hovered {
        width: 60px;
        height: 60px;
        background-color: rgba(0, 243, 255, 0.1);
        border-color: var(--accent-gold);
    }

    .custom-cursor-dot {
        position: fixed;
        top: 0;
        left: 0;
        width: 6px;
        height: 6px;
        background-color: var(--accent-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px var(--accent-gold);
    }

    .reveal-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    }

    .reveal-hidden.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Staggered animation for grid items */
    .item-slot.reveal-hidden.visible {
        transition-delay: calc(var(--item-index, 0) * 0.1s);
    }
`;
document.head.appendChild(styleSheet);
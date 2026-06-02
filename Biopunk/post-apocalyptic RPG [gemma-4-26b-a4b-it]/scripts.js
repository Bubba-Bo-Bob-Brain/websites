/**
 * NEURAL SPORE // Core Interface Logic
 * Immersive Biopunk Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParallax();
    initTypingEffect();
    initScrollReveal();
    initTechTree();
    initMapInteractions();
});

/**
 * 1. NEURAL CURSOR
 * A smooth-following cursor that reacts to interactive elements.
 */
function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Update target position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth interpolation loop (Lerp)
    function animateCursor() {
        // The lower the 0.1, the more "laggy" and organic the movement feels
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale cursor on hover
    const interactiveElements = document.querySelectorAll('a, button, .tech-node, .hotspot, .mutation-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(3)';
            cursor.style.background = 'rgba(0, 242, 255, 0.2)';
            cursor.style.border = '1px solid var(--color-biolum)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(3)', '');
            cursor.style.background = 'var(--color-biolum)';
            cursor.style.border = 'none';
        });
    });
}

/**
 * 2. BIO-PARALLAX
 * Subtle movement of background elements to create depth.
 */
function initParallax() {
    const nucleus = document.querySelector('.nucleus');
    const organicCore = document.querySelector('.organic-core');

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;

        if (nucleus) {
            nucleus.style.transform = `translate(calc(-50% + ${x * 2}px), calc(-50% + ${y * 2}px))`;
        }
        if (organicCore) {
            organicCore.style.transform = `translate(${x * -1}px, ${y * -1}px)`;
        }
    });
}

/**
 * 3. TERMINAL TYPING EFFECT
 * Simulates a biological data readout in the hero section.
 */
function initTypingEffect() {
    const heroDesc = document.querySelector('.hero-description');
    const text = heroDesc.textContent;
    heroDesc.textContent = ''; // Clear initial text

    let i = 0;
    function type() {
        if (i < text.length) {
            heroDesc.textContent += text.charAt(i);
            i++;
            // Random typing speed for more "organic" feel
            const speed = Math.random() * (100 - 30) + 30;
            setTimeout(type, speed);
        }
    }

    // Small delay before starting the "boot" sequence
    setTimeout(type, 1000);
}

/**
 * 4. SCROLL REVEAL
 * Triggers staggered animations for cards and sections using IntersectionObserver.
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on index to create a staggered "wave" effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll('.mutation-card, .section-header, .tech-node');
    
    revealElements.forEach(el => {
        // Set initial state for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
}

/**
 * 5. TECH TREE INTERACTION
 * Simulates selecting an evolutionary path.
 */
function initTechTree() {
    const nodes = document.querySelectorAll('.tech-node');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            // Reset all nodes
            nodes.forEach(n => n.classList.remove('active'));
            
            // Activate clicked node
            node.classList.add('active');
            
            // Console feedback (acting as a biological log)
            const nodeId = node.getAttribute('data-node');
            console.log(`%c [BIO-LOG]: Sequencing ${nodeId}... SUCCESS.`, 'color: #00f2ff; font-weight: bold;');
            
            // Visual feedback: Flash the node
            node.querySelector('.node-core').style.borderColor = 'var(--color-accent)';
            setTimeout(() => {
                node.querySelector('.node-core').style.borderColor = '';
            }, 500);
        });
    });
}

/**
 * 6. MAP INTERACTIONS
 * Simulates exploring contamination zones.
 */
function initMapInteractions() {
    const hotspots = document.querySelectorAll('.hotspot');

    hotspots.forEach(spot => {
        spot.addEventListener('mouseenter', () => {
            // Trigger a visual "alert" in the console
            console.warn('%c [WARNING]: High bio-contamination detected in zone!', 'color: #ff3e3e;');
        });

        spot.addEventListener('click', (e) => {
            // In a real app, this would open a modal or a new data layer
            alert("ZONE DATA: Extreme spore density. Genetic integrity: 14%. Recommendation: Deploy containment mesh.");
        });
    });
}
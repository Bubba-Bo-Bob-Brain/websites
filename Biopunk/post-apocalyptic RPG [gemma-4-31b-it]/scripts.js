/**
 * MYCELIUM NEXUS - CORE LOGIC
 * Theme: Organic-Industrial / Biopunk
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initScrollReveal();
    initMutationFilters();
    initBioTree();
    initHUDGlitches();
});

/**
 * 1. THE ORGANIC CURSOR
 * A custom cursor that mimics a biological cell.
 */
function initCursor() {
    const cursor = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        // Smoothly follow the mouse with a slight lag for an "organic" feel
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.transform = `translate(-50%, -50%)`;
    });

    // Expand cursor when hovering over interactive elements
    const interactives = document.querySelectorAll('a, button, .specimen-card, .tree-node');
    
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.backgroundColor = 'var(--color-bio-cyan)';
            cursor.style.boxShadow = '0 0 30px var(--color-bio-cyan)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'var(--color-toxic-green)';
            cursor.style.boxShadow = '0 0 15px var(--color-toxic-green)';
        });
    });
}

/**
 * 2. SCROLL REVEAL ENGINE
 * Staggered animations for elements as they enter the viewport.
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, we can stop observing
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const elementsToReveal = document.querySelectorAll('.specimen-card, .section-header, .tree-node, .codex-entry');
    
    elementsToReveal.forEach((el, index) => {
        // Set a custom CSS variable for staggered delay
        el.style.setProperty('--reveal-delay', `${index * 0.1}s`);
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });

    // Add a CSS class globally via JS to handle the "revealed" state since we are adding logic here
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed { 
            opacity: 1 !important; 
            transform: translateY(0) !important; 
            transition-delay: var(--reveal-delay) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 3. MUTATION FILTERS
 * Logic for filtering the Specimen Vault.
 */
function initMutationFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const specimens = document.querySelectorAll('.specimen-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            specimens.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
}

/**
 * 4. BIO-TREE PULSE
 * Simulates a biological signal traveling through the tech tree.
 */
function initBioTree() {
    const nodes = document.querySelectorAll('.tree-node');
    let currentIndex = 0;

    function pulseNode() {
        if (nodes.length === 0) return;

        const node = nodes[currentIndex];
        node.style.transition = 'all 0.3s ease';
        node.style.boxShadow = '0 0 40px var(--color-toxic-green)';
        node.style.transform = 'scale(1.1)';

        setTimeout(() => {
            node.style.boxShadow = '';
            node.style.transform = 'scale(1)';
        }, 400);

        currentIndex = (currentIndex + 1) % nodes.length;
    }

    // Pulse every 2 seconds to feel like a heartbeat/signal
    setInterval(pulseNode, 2000);
}

/**
 * 5. HUD GLITCHES
 * Occasional visual flickers for the system status.
 */
function initHUDGlitches() {
    const statusText = document.querySelector('.status-text');
    const glitchMessages = [
        "BIO-SYNC: ACTIVE",
        "BIO-SYNC: UNSTABLE",
        "CELLULAR DRIFT DETECTED",
        "SYNCING NEURAL PATHS...",
        "BIO-SYNC: ACTIVE"
    ];

    setInterval(() => {
        if (Math.random() > 0.8) {
            const randomMsg = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
            statusText.innerText = randomMsg;
            statusText.style.color = 'var(--color-blood-accent)';
            
            setTimeout(() => {
                statusText.innerText = "BIO-SYNC: ACTIVE";
                statusText.style.color = 'var(--color-bio-cyan)';
            }, 150);
        }
    }, 4000);
}
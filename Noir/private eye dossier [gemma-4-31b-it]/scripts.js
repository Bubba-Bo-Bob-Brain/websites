/**
 * NOIR DOSSIER - INTERACTIVE LOGIC
 * Features: Drag-and-drop connectivity, Typewriter reveal, 
 * Smoke particles, and Case File navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmokeCursor();
    initCorkboard();
    initFolderNavigation();
    initTypewriterEffect();
});

/**
 * 1. SMOKE WISP CURSOR
 * Creates a trail of fading particles following the mouse
 */
function initSmokeCursor() {
    const container = document.getElementById('smoke-container');
    
    document.addEventListener('mousemove', (e) => {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        
        // Randomize size and position slightly for organic feel
        const size = Math.random() * 40 + 20;
        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;
        smoke.style.left = `${e.clientX - size/2}px`;
        smoke.style.top = `${e.clientY - size/2}px`;
        
        // Inject styles dynamically for the smoke effect
        Object.assign(smoke.style, {
            position: 'absolute',
            backgroundColor: 'rgba(150, 150, 150, 0.2)',
            borderRadius: '50%',
            filter: 'blur(15px)',
            pointerEvents: 'none',
            transition: 'all 1.5s ease-out',
            zIndex: '1100'
        });

        container.appendChild(smoke);

        // Animate and remove
        requestAnimationFrame(() => {
            smoke.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${-100 - Math.random() * 50}px) scale(2)`;
            smoke.style.opacity = '0';
        });

        setTimeout(() => smoke.remove(), 1500);
    });
}

/**
 * 2. CONSPIRACY CORKBOARD
 * Handles dragging of evidence and drawing the red threads
 */
function initCorkboard() {
    const canvas = document.getElementById('thread-canvas');
    const cards = document.querySelectorAll('.evidence-card, .sticky-note');
    let activeCard = null;
    let offset = { x: 0, y: 0 };

    // Define which nodes are connected (The "Conspiracy Map")
    const connections = [
        { from: 'node-1', to: 'node-2' },
        { from: 'node-2', to: 'node-4' },
        { from: 'node-4', to: 'node-3' },
        { from: 'node-3', to: 'node-1' },
    ];

    function drawThreads() {
        canvas.innerHTML = ''; // Clear canvas
        connections.forEach(conn => {
            const startEl = document.getElementById(conn.from);
            const endEl = document.getElementById(conn.to);
            
            if (startEl && endEl) {
                const startRect = startEl.getBoundingClientRect();
                const endRect = endEl.getBoundingClientRect();
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startRect.left + startRect.width / 2);
                line.setAttribute('y1', startRect.top + startRect.height / 2);
                line.setAttribute('x2', endRect.left + endRect.width / 2);
                line.setAttribute('y2', endRect.top + endRect.height / 2);
                line.setAttribute('stroke', '#a80000'); // Crimson Red
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '2,1'); // Slightly textured thread
                line.setAttribute('opacity', '0.7');
                canvas.appendChild(line);
            }
        });
    }

    cards.forEach(card => {
        card.addEventListener('mousedown', (e) => {
            activeCard = card;
            const rect = card.getBoundingClientRect();
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
            card.style.zIndex = '100';
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeCard) return;
        
        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;
        
        activeCard.style.left = `${x}px`;
        activeCard.style.top = `${y}px`;
        
        drawThreads();
    });

    document.addEventListener('mouseup', () => {
        if (activeCard) activeCard.style.zIndex = '10';
        activeCard = null;
    });

    // Initial draw and handle window resize
    window.addEventListener('resize', drawThreads);
    drawThreads();
}

/**
 * 3. FOLDER NAVIGATION
 * Switches between dossier sections
 */
function initFolderNavigation() {
    const btns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.folder-section');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === target) {
                    s.classList.add('active');
                    // Trigger typewriter effect when section becomes visible
                    initTypewriterEffect(s);
                }
            });
        });
    });
}

/**
 * 4. TYPEWRITER TEXT REVEAL
 * Animates text to look like it's being typed in real-time
 */
function initTypewriterEffect(container = document.querySelector('.folder-section.active')) {
    const texts = container.querySelectorAll('.typewriter-text');
    
    texts.forEach((el, index) => {
        const originalText = el.innerText;
        el.innerText = '';
        
        let charIndex = 0;
        // Stagger the start of each paragraph
        setTimeout(() => {
            const interval = setInterval(() => {
                if (charIndex < originalText.length) {
                    el.innerText += originalText.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 30); // Typing speed
        }, index * 500);
    });
}
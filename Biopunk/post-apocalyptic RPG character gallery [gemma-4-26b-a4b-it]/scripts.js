/**
 * NEURAL-LINK // BIOPUNK_ARCHIVE
 * System Scripts: Life-Cycle & Immersive Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initObserver();
    initGlitchEngine();
    initTerminalLogs();
    initCardInteractions();
});

/**
 * 1. CHRONOS SYSTEM
 * Updates the HUD clock with a technical, high-precision format.
 */
function initClock() {
    const clockElement = document.getElementById('clock');
    
    const update = () => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        
        clockElement.textContent = `${h}:${m}:${s}:${ms}`;
    };

    setInterval(update, 50);
    update();
}

/**
 * 2. OBSERVATION SYSTEM
 * Triggers animation of progress bars only when they enter the viewport.
 * This simulates "fetching" data from the bio-database.
 */
function initObserver() {
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Find all progress elements within this card
                const progressFills = card.querySelectorAll('.progress-fill, .skill-val');
                
                progressFills.forEach((bar, index) => {
                    // We use a staggered timeout to make the bars "load" one by one
                    setTimeout(() => {
                        // The actual width is already set in HTML via inline styles
                        // We just need to ensure the transition is triggered.
                        // Since we are using CSS transitions, changing opacity or 
                        // a tiny bit of width can trigger it, but since width is 
                        // already there, we'll force a "re-flow" by toggling a class
                        // or simply letting the CSS transition work on entry.
                        bar.style.opacity = '1';
                    }, index * 100);
                });

                // Stop observing once the data is "loaded"
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    // Target all character cards
    document.querySelectorAll('.character-card').forEach(card => {
        // Set initial state for bars to be invisible/zero-width if needed
        // For this implementation, we rely on the CSS transition once observed.
        observer.observe(card);
    });
}

/**
 * 3. GLITCH ENGINE
 * Periodically triggers visual "instability" in the UI.
 */
function initGlitchEngine() {
    const glitchTargets = document.querySelectorAll('.glitch-text, .status-indicator, .title-main');
    
    const triggerGlitch = () => {
        // Pick a random target
        const target = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
        
        // Apply a temporary class or style
        target.style.textShadow = '2px 0 #ff003c, -2px 0 #00f2ff';
        target.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        
        setTimeout(() => {
            target.style.textShadow = 'none';
            target.style.transform = 'none';
        }, 150);

        // Schedule next glitch at a random interval (3 to 10 seconds)
        const nextGlitch = Math.random() * 7000 + 3000;
        setTimeout(triggerGlitch, nextGlitch);
    };

    // Start the engine
    setTimeout(triggerGlitch, 2000);
}

/**
 * 4. TERMINAL LOGS
 * Injects random "bio-data" strings into the footer to simulate active processing.
 */
function initTerminalLogs() {
    const footerRight = document.querySelector('.footer-right');
    const logFragments = [
        "SEQ_STABLE", "MUTATION_DETECTED", "DNA_SCAN_OK", "CONTAM_LEVEL_HIGH", 
        "LINK_SYNCING", "NEURAL_PATH_ACTIVE", "VOID_SIGNAL_DETECTED", "RECOVERY_MODE",
        "CELL_DIVISION_ERR", "BIO_SIG_LOW", "SYNC_COMPLETE"
    ];

    setInterval(() => {
        const fragment = logFragments[Math.floor(Math.random() * logFragments.length)];
        const span = document.createElement('span');
        span.className = 'mono';
        span.style.color = 'var(--accent-cyan)';
        span.style.marginLeft = '10px';
        span.textContent = `// ${fragment}`;
        
        // Add to footer and limit number of logs
        footerRight.appendChild(span);
        if (footerRight.children.length > 4) {
            footerRight.removeChild(footerRight.firstChild);
        }

        // Remove the old span effectively
        setTimeout(() => {
            if(span.parentNode) span.style.opacity = '0';
        }, 2000);
    }, 4000);
}

/**
 * 5. CARD INTERACTIONS
 * Simulates "accessing" a specimen's data on click.
 */
function initCardInteractions() {
    const cards = document.querySelectorAll('.character-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Visual Feedback: Flash the card
            card.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
            
            // 2. Simulate "Data Fetching"
            const originalName = card.querySelector('.char-name').textContent;
            const nameElement = card.querySelector('.char-name');
            
            nameElement.textContent = "ACCESSING...";
            nameElement.style.color = 'var(--accent-blood)';

            // 3. Return to normal after a delay
            setTimeout(() => {
                card.style.backgroundColor = 'var(--bg-card)';
                nameElement.textContent = originalName;
                nameElement.style.color = 'var(--text-main)';
            }, 800);

            // 4. Add a small console log to the "system" (visual only)
            console.log(`%c [SYSTEM] Accessing Specimen: ${originalName} `, 'background: #050705; color: #39ff14; font-weight: bold;');
        });
    });
}
/**
 * RETRO_CORE // System Logic
 * Purpose: Handles boot sequence, cheat codes, and immersive interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initCheatCodeListener();
    initInteractiveElements();
});

/**
 * 1. BOOT SEQUENCE
 * Simulates the loading of a 90s operating system.
 */
function initBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const progressFill = document.querySelector('.progress-fill');
    const bootTexts = document.querySelectorAll('.boot-text');
    
    let progress = 0;
    
    // Animate progress bar
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            completeBoot();
        }
    }, 200);

    function completeBoot() {
        // Fade out boot screen
        setTimeout(() => {
            bootScreen.style.transition = 'opacity 1s ease';
            bootScreen.style.opacity = '0';
            
            setTimeout(() => {
                bootScreen.style.display = 'none';
                document.body.classList.add('system-ready');
                console.log("SYSTEM_CORE: Online");
            }, 1000);
        }, 500);
    }
}

/**
 * 2. CHEAT CODE ENGINE (Konami Code)
 * Detects 'UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, B, A'
 * Or a simplified version for this demo: 'UP, UP, DOWN, DOWN'
 */
function initCheatCodeListener() {
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'];
    let inputSequence = [];
    const cheatInput = document.getElementById('cheat-input');

    window.addEventListener('keydown', (e) => {
        inputSequence.push(e.key);
        
        // Keep only the last 4 keys
        if (inputSequence.length > secretCode.length) {
            inputSequence.shift();
        }

        // Check if sequence matches
        if (JSON.stringify(inputSequence) === JSON.stringify(secretCode)) {
            triggerGlitchMode();
            inputSequence = []; // Reset
        }
    });
}

function triggerGlitchMode() {
    console.log("CHEAT_CODE_DETECTED: ACTIVATING GLITCH_MODE");
    
    // Visual feedback for cheat code
    document.body.style.filter = 'hue-rotate(90deg) invert(1)';
    document.body.style.transition = 'filter 0.2s ease';
    
    // Add a temporary "glitch" class to the body
    document.body.classList.add('glitch-active');

    // Revert after 3 seconds
    setTimeout(() => {
        document.body.style.filter = 'none';
        document.body.classList.remove('glitch-active');
    }, 3000);

    // Alert the user in a retro way
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent-pink);
        color: white;
        padding: 20px;
        font-family: var(--font-pixel);
        z-index: 100001;
        border: 4px solid white;
        box-shadow: 10px 10px 0px black;
    `;
    alertBox.innerHTML = "CHEAT ACTIVATED!<br>MOD_MODE: ON";
    document.body.appendChild(alertBox);

    setTimeout(() => alertBox.remove(), 2000);
}

/**
 * 3. INTERACTIVE ELEMENTS
 * Handles hover effects and UI responsiveness.
 */
function initInteractiveElements() {
    const cards = document.querySelectorAll('.game-card');
    const navLinks = document.querySelectorAll('.nav-link');
    const mascot = document.getElementById('mascot');

    // Card Hover Effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // In a real app, play sfx-hover
            console.log("SFX: HOVER_BEEP");
        });

        card.addEventListener('click', () => {
            const title = card.querySelector('.game-title').innerText;
            alert(`INITIALIZING: ${title}...`);
        });
    });

    // Smooth Scroll for Nav
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mascot interaction
    mascot.addEventListener('mouseover', () => {
        mascot.style.animation = 'none';
        // Trigger a little "jump"
        mascot.style.transform = 'scale(1.5)';
        setTimeout(() => {
            mascot.style.transform = 'scale(1)';
            mascot.style.animation = 'mascot-float 3s ease-in-out infinite';
        }, 200);
    });
}

// Global error handler to keep the "system" feeling stable
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error(`SYSTEM_CRITICAL_ERROR: ${msg} at ${lineNo}:${columnNo}`);
    return true; 
};
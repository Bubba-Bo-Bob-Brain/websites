/**
 * GALACTIC PROLETARIAT DISPATCH - Broadcast Logic
 * Version: 1.0.42 (State Approved)
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initGlitchEffect();
    initLoyaltySystem();
    initTickerDuplication();
    initInteractiveElements();
});

/**
 * Sets the fictional date to the year 2145
 */
function initClock() {
    const dateElement = document.getElementById('current-date');
    
    function updateDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = "2145"; // Fictional Future
        
        dateElement.innerText = `DATE: ${day}.${month}.${year} | STATUS: ACTIVE`;
    }
    
    updateDate();
    setInterval(updateDate, 60000);
}

/**
 * Simulates random CRT signal interference
 * Randomly shifts the screen or adds a temporary flicker
 */
function initGlitchEffect() {
    const container = document.querySelector('.broadcast-container');
    
    function triggerGlitch() {
        // Randomly decide if a glitch happens
        if (Math.random() > 0.95) {
            const glitchType = Math.floor(Math.random() * 3);
            
            if (glitchType === 0) {
                // Sudden horizontal shift
                container.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
                setTimeout(() => container.style.transform = 'translateX(0)', 50);
            } else if (glitchType === 1) {
                // Brief opacity flicker
                container.style.opacity = '0.7';
                setTimeout(() => container.style.opacity = '1', 100);
            } else {
                // Color shift simulation
                container.style.filter = 'hue-rotate(90deg) contrast(1.5)';
                setTimeout(() => container.style.filter = 'none', 150);
            }
        }
        
        // Schedule next check
        setTimeout(triggerGlitch, Math.random() * 3000 + 1000);
    }
    
    triggerGlitch();
}

/**
 * Handles the "Confirm Loyalty" interaction
 * Simulates a state verification process
 */
function initLoyaltySystem() {
    const loyaltyBtn = document.getElementById('loyalty-btn');
    
    loyaltyBtn.addEventListener('click', () => {
        const originalText = loyaltyBtn.innerText;
        
        // Phase 1: Scanning
        loyaltyBtn.disabled = true;
        loyaltyBtn.innerText = "SCANNING BIOMETRICS...";
        loyaltyBtn.style.borderColor = "#00ff00";
        loyaltyBtn.style.color = "#00ff00";

        setTimeout(() => {
            // Phase 2: Analyzing
            loyaltyBtn.innerText = "ANALYZING LOYALTY...";
            
            setTimeout(() => {
                // Phase 3: Verdict
                const isLoyal = Math.random() > 0.1; // 90% chance of being "loyal"
                
                if (isLoyal) {
                    loyaltyBtn.innerText = "LOYALTY VERIFIED ✓";
                    loyaltyBtn.style.backgroundColor = "#00ff00";
                    loyaltyBtn.style.color = "#000";
                    alert("CITIZEN: Your devotion to the Galactic Proletariat is noted. Return to your workstation.");
                } else {
                    loyaltyBtn.innerText = "DEVIATION DETECTED ⚠";
                    loyaltyBtn.style.backgroundColor = "red";
                    loyaltyBtn.style.color = "white";
                    alert("WARNING: Irregular thought patterns detected. A Sector Warden has been dispatched to your coordinates.");
                }
                
                // Reset after a while
                setTimeout(() => {
                    loyaltyBtn.disabled = false;
                    loyaltyBtn.innerText = originalText;
                    loyaltyBtn.style.backgroundColor = "transparent";
                    loyaltyBtn.style.color = "var(--gold)";
                    loyaltyBtn.style.borderColor = "var(--gold)";
                }, 5000);
                
            }, 1500);
        }, 1500);
    });
}

/**
 * Ensures the ticker is perfectly seamless by duplicating content
 */
function initTickerDuplication() {
    const tickerMove = document.querySelector('.ticker-move');
    if (tickerMove) {
        const content = tickerMove.innerHTML;
        tickerMove.innerHTML += content; // Duplicate for infinite loop
    }
}

/**
 * Miscellaneous immersive interactions
 */
function initInteractiveElements() {
    // Add "Click" sound effect simulation (visual only)
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });
    });

    // Console easter egg for "hackers"
    console.log("%cSTOP! Unauthorized access to State Terminals is punishable by orbital reassignment.", "color: red; font-size: 20px; font-weight: bold;");
    console.log("%cGLORY TO THE COSMOS.", "color: gold; font-size: 14px;");
}
/**
 * ZVEZDA: State Space Broadcast - Logic
 * Handles dynamic content, system logs, and interactive glitch effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDateDisplay();
    initSystemLog();
    initGlitchEffects();
    initTickerSpeed();
});

/**
 * 1. Date Display
 * Formats the current date in a specific "State Standard" format.
 */
function initDateDisplay() {
    const dateElement = document.getElementById('current-date');
    
    function updateDate() {
        const now = new Date();
        // Custom formatting: DD.MM.YYYY HH:MM:SS
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const time = now.toLocaleTimeString('en-GB', { hour12: false });
        
        dateElement.textContent = `${day}.${month}.${year} // ${time}`;
    }

    updateDate();
    setInterval(updateDate, 1000);
}

/**
 * 2. System Log Generator
 * Simulates a live terminal feed in the stats card.
 */
function initSystemLog() {
    const logContainer = document.getElementById('system-log');
    const messages = [
        "SCANNING ORBITAL DEBRIS...",
        "SYNCING WITH LENIN-1 RELAY...",
        "DECRYPTING IMPERIALIST SIGNALS...",
        "RADIATION LEVELS: NOMINAL",
        "UPDATING FIVE-YEAR PLAN METRICS...",
        "PURGING CACHE...",
        "RE-ROUTING POWER TO SIBERIA...",
        "VERIFYING WORKER CREDENTIALS...",
        "DOWNLOADING NEW PROPAGANDA ASSETS...",
        "STABILIZING GRAVITY PLATES...",
        "CHECKING OXYGEN LEVELS...",
        "AWAITING COMMANDER INPUT..."
    ];

    function addLogEntry() {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.textContent = msg;
        
        // Add timestamp
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        div.textContent = `[${time}] ${msg}`;

        logContainer.appendChild(div);
        
        // Auto scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;

        // Limit log size to prevent memory issues
        if (logContainer.children.length > 15) {
            logContainer.removeChild(logContainer.children[0]);
        }
    }

    // Initial random entries
    for(let i=0; i<5; i++) addLogEntry();

    // Random interval between 1s and 4s
    setInterval(() => {
        if(Math.random() > 0.3) addLogEntry();
    }, 2000);
}

/**
 * 3. Interactive Glitch Effects
 * Adds a random visual glitch to buttons and headers on hover.
 */
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.btn-propaganda, .main-title, .hero-headline');

    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Apply a random transform
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            const randomSkew = (Math.random() - 0.5) * 10;
            
            el.style.transform = `translate(${randomX}px, ${randomY}px) skew(${randomSkew}deg)`;
            
            // Change color momentarily
            const originalColor = getComputedStyle(el).color;
            el.style.color = '#fff';
            el.style.textShadow = '2px 0 #D92027, -2px 0 #F2A900';

            // Reset after short delay
            setTimeout(() => {
                el.style.transform = 'none';
                el.style.color = originalColor;
                el.style.textShadow = 'none';
            }, 150);
        });
    });
}

/**
 * 4. Ticker Speed Variation
 * Occasionally speeds up the ticker to simulate "Breaking News" urgency.
 */
function initTickerSpeed() {
    const track = document.querySelector('.ticker-track');
    
    setInterval(() => {
        // 10% chance to speed up
        if (Math.random() > 0.9) {
            track.style.animationDuration = '10s'; // Speed up
            setTimeout(() => {
                track.style.animationDuration = '20s'; // Reset
            }, 5000);
        }
    }, 10000);
}
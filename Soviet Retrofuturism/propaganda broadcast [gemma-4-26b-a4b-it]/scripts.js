/**
 * VOICE OF THE COSMOS - COMMAND INTERFACE
 * Implementation of the Broadcast Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDataDrift();
    initSignalInterference();
    initInteractions();
});

/**
 * 1. THE TEMPORAL ENGINE
 * Updates the broadcast timestamp
 */
function initClock() {
    const clockElement = document.getElementById('clock');
    
    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${h}:${m}:${s}`;
        requestAnimationFrame(() => {}); // Placeholder for high-perf loops
    }
    
    setInterval(update, 1000);
    update();
}

/**
 * 2. THE DATA FLUCTUATION ENGINE
 * Simulates real-time reporting of industrial quotas
 */
function initDataDrift() {
    const quotaValues = document.querySelectorAll('.quota-list .val');
    const progressBar = document.querySelector('.progress-bar-fill');
    let currentProgress = 78;

    setInterval(() => {
        // Randomly drift the quotas
        quotaValues.forEach(val => {
            const currentVal = parseFloat(val.textContent);
            const drift = (Math.random() - 0.5) * 2; // Drift between -1 and 1
            const newVal = Math.max(80, Math.min(200, currentVal + drift));
            val.textContent = `${newVal.toFixed(1)}%`;
        });

        // Slowly progress the 5-year plan
        currentProgress += Math.random() * 0.01;
        if (currentProgress > 100) currentProgress = 0; // Reset for loop
        progressBar.style.width = `${currentProgress}%`;
        
    }, 3000);
}

/**
 * 3. THE SIGNAL INTERFERENCE ENGINE
 * Simulates cosmic radiation and signal degradation
 */
function initSignalInterference() {
    const container = document.querySelector('.app-container');
    const overlay = document.querySelector('.crt-overlay');

    function triggerGlitch() {
        // Apply intense visual distortion
        container.style.filter = `
            hue-rotate(${Math.random() * 90 - 45}deg) 
            contrast(${1.5 + Math.random()}) 
            brightness(${0.8 + Math.random() * 0.4})
        `;
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        
        // Shake the container
        container.style.transform = `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`;

        // Reset after a short burst
        setTimeout(() => {
            container.style.filter = 'none';
            container.style.transform = 'none';
            overlay.style.backgroundColor = 'transparent';
        }, 150 + Math.random() * 300);
    }

    // Trigger glitches at random intervals
    const scheduleNextGlitch = () => {
        const delay = Math.random() * 15000 + 5000; // Every 5 to 20 seconds
        setTimeout(() => {
            triggerGlitch();
            scheduleNextGlitch();
        }, delay);
    };

    scheduleNextGlitch();
}

/**
 * 4. INTERACTIVE FEEDBACK
 * Adds mechanical weight to user actions
 */
function initInteractions() {
    const newsItems = document.querySelectorAll('.news-item');
    const liveIndicator = document.querySelector('.live-indicator');

    // Clicking a news item "selects" it with a glitch effect
    newsItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.backgroundColor = 'var(--color-red)';
            item.style.color = 'white';
            
            // Simulate "Loading Dispatch..."
            setTimeout(() => {
                item.style.backgroundColor = '';
                item.style.color = '';
            }, 500);
        });
    });

    // Clicking the LIVE indicator "re-syncs" the signal
    liveIndicator.addEventListener('click', () => {
        const container = document.querySelector('.app-container');
        container.style.animation = 'none';
        // Force reflow
        void container.offsetWidth; 
        container.style.animation = 'glitch 0.2s ease-in-out';
        console.log("SIGNAL RE-SYNCED WITH CENTRAL COMMAND");
    });
}

// Inject a tiny bit of dynamic CSS for the glitch-active state if needed
const style = document.createElement('style');
style.innerHTML = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-5px, 5px); }
        40% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        80% { transform: translate(5px, -5px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c SYSTEM INITIALIZED: MOSCOW-PRIME ORBITAL LINK ESTABLISHED ", "background: #D20000; color: #FFD700; font-size: 16px; font-weight: bold; padding: 5px;");
    
    initClock();
    initProgressBars();
    initSeamlessTicker();
    initSignalInterference();
    initInteractivity();
});

/**
 * Initializes the "Live" Clock with a hardcoded future year (2087)
 * to maintain the retro-futuristic immersion.
 */
function initClock() {
    const clockElement = document.getElementById('live-clock');
    
    function updateTime() {
        const now = new Date();
        // Override year to 2087 for immersion
        const futureDate = new Date(now);
        futureDate.setFullYear(2087);
        
        const hours = String(futureDate.getHours()).padStart(2, '0');
        const minutes = String(futureDate.getMinutes()).padStart(2, '0');
        const seconds = String(futureDate.getSeconds()).padStart(2, '0');
        
        clockElement.innerText = `${hours}:${minutes}:${seconds} MSK`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

/**
 * Animates the Five-Year Plan progress bar on load.
 * Adds a "data loading" effect.
 */
function initProgressBars() {
    const progressBar = document.getElementById('progress-bar-fill');
    const targetWidth = progressBar.style.width; // Should be set in inline style in HTML or parsed
    
    // Reset to 0 first for animation
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        // Animate to the value defined in HTML (e.g., 98%)
        const finalWidth = progressBar.parentElement.parentElement.getAttribute('data-width') || '98%';
        progressBar.style.width = finalWidth;
        
        // Trigger a text update in the console
        console.log(`%c PRODUCTION TARGET: ${finalWidth} ACHIEVED `, "color: #D20000; font-weight: bold;");
    }, 500);
}

/**
 * Duplicates the ticker content to ensure a seamless infinite loop
 * without gaps when the CSS animation resets.
 */
function initSeamlessTicker() {
    const track = document.querySelector('.ticker-content');
    const clone = track.cloneNode(true);
    track.parentNode.appendChild(clone);
}

/**
 * Simulates random broadcast signal interference/glitches.
 * Occasionally shakes the screen or adds static noise.
 */
function initSignalInterference() {
    const mainWrapper = document.querySelector('.main-wrapper');
    const crtOverlay = document.querySelector('.crt-overlay');
    
    function triggerInterference() {
        const interferenceType = Math.random();
        
        // 10% chance of a screen "shake"
        if (interferenceType > 0.9) {
            mainWrapper.classList.add('signal-shake');
            setTimeout(() => {
                mainWrapper.classList.remove('signal-shake');
            }, 200);
        }
        
        // 5% chance of heavy static overlay
        if (interferenceType > 0.95) {
            crtOverlay.style.opacity = '0.8';
            setTimeout(() => {
                crtOverlay.style.opacity = '1';
            }, 150);
        }

        // Schedule next interference (random interval between 2s and 8s)
        const nextInterference = Math.random() * 6000 + 2000;
        setTimeout(triggerInterference, nextInterference);
    }
    
    triggerInterference();
}

/**
 * Handles user interactivity (Buttons, Nav links).
 * Replaces native alerts with thematic "system notifications".
 */
function initInteractivity() {
    
    // Create a toast container for system messages
    const toastContainer = document.createElement('div');
    toastContainer.id = 'system-toast';
    document.body.appendChild(toastContainer);
    
    // Function to show toast
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `<span class="toast-icon">!</span> ${message}`;
        
        toastContainer.appendChild(toast);
        
        // Play a simple beep sound (Audio Context)
        playBeep();
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    
    // Simple synth beep for UI feedback
    function playBeep() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Ignore audio errors if blocked by browser autoplay policies
        }
    }
    
    // Button Listeners
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const articleTitle = e.target.closest('.news-card').querySelector('h3').innerText;
            showToast(`ACCESSING ARCHIVES: "${articleTitle.substring(0, 20)}..."`);
        });
    });
    
    // Navigation Listeners
    document.querySelectorAll('.state-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.state-nav a').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            showToast(`CONNECTING TO SECTOR: ${e.target.innerText}`);
        });
    });
}
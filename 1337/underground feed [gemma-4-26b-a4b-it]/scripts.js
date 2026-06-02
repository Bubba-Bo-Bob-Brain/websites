/**
 * NEURAL_NET // VOID_FEED
 * CORE LOGIC ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    initDecryptionMechanic();
    initTraceSimulation();
    initTickerAnimation();
    initGlitchTriggers();
});

/**
 * Decryption Mechanic
 * Simulates the process of cracking an encrypted message.
 * When "DECRYPT" is clicked, the text transforms from gibberish to cleartext.
 */
function initDecryptionMechanic() {
    const decryptButtons = document.querySelectorAll('.action-btn');

    decryptButtons.forEach(button => {
        if (button.textContent === 'DECRYPT') {
            button.addEventListener('click', function(e) {
                const packet = e.target.closest('.data-packet');
                const encryptedElement = packet.querySelector('.decryption-text');
                
                if (encryptedElement) {
                    decryptText(encryptedElement, button);
                }
            });
        }
    });
}

async function decryptText(element, button) {
    const originalText = element.textContent;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    let iterations = 0;
    const maxIterations = 20;
    
    button.disabled = true;
    button.textContent = "DECRYPTING...";
    button.style.color = "var(--warning-amber)";

    const interval = setInterval(() => {
        element.textContent = originalText
            .split("")
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return charset[Math.floor(Math.random() * charset.length)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.textContent = originalText;
            element.style.color = "var(--primary-green)";
            button.textContent = "DECRYPT_COMPLETE";
            button.style.borderColor = "var(--primary-green)";
        }

        iterations += 1 / 3;
    }, 30);
}

/**
 * Trace Simulation
 * Randomly triggers the "Trace Detected" modal to create tension.
 */
function initTraceSimulation() {
    const modal = document.getElementById('alert-modal');
    
    // Random interval between 30 to 60 seconds for a trace alert
    const triggerTrace = () => {
        const delay = Math.random() * (60000 - 30000) + 30000;
        
        setTimeout(() => {
            showTraceModal(modal);
            triggerTrace(); // Schedule next potential trace
        }, delay);
    };

    triggerTrace();
}

function showTraceModal(modal) {
    // Apply a temporary glitch to the whole body
    document.body.classList.add('glitch-active');
    modal.classList.remove('hidden');
    
    // Play a subtle "error" sound via console or visual cue
    console.warn("!!! TRACE DETECTED: UNAUTHORIZED CONNECTION ATTEMPT !!!");
}

// Global function called by the button in HTML
window.closeModal = function() {
    const modal = document.getElementById('alert-modal');
    modal.classList.add('hidden');
    document.body.classList.remove('glitch-active');
};

/**
 * Glitch Triggers
 * Adds visual flair to random elements to simulate network instability.
 */
function initGlitchTriggers() {
    const elements = document.querySelectorAll('.data-packet, .status-item, .logo');
    
    setInterval(() => {
        const target = elements[Math.floor(Math.random() * elements.length)];
        target.style.opacity = "0.5";
        target.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        
        setTimeout(() => {
            target.style.opacity = "1";
            target.style.transform = "translateX(0)";
        }, 150);
    }, 4000);
}

/**
 * Ticker Animation
 * Ensures the intel ticker feels continuous.
 */
function initTickerAnimation() {
    const tickerList = document.getElementById('ticker-list');
    
    // Clone the list items to ensure seamless looping
    const items = tickerList.innerHTML;
    tickerList.innerHTML = items + items; 
}

/**
 * Utility: Randomizing technical data
 * To make the interface feel "live"
 */
function updateLatency() {
    const latencyElement = document.querySelector('.status-item .highlight');
    if (latencyElement) {
        const newLatency = Math.floor(Math.random() * (25 - 8) + 8);
        latencyElement.textContent = `${newLatency}ms`;
    }
}

setInterval(updateLatency, 5000);
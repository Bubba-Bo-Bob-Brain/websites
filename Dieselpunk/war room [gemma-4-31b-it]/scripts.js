/**
 * OPERATION IRON CURTAIN - Command Systems
 * Logic for immersive analog interactions, teletype feeds, and unit management.
 */

document.addEventListener('DOMContentLoaded', () => {
    initRadioIntercepts();
    initResourceGauges();
    initUnitMovement();
    initPropagandaCarousel();
    initAtmosphericEffects();
});

/**
 * 1. RADIO INTERCEPTS SYSTEM
 * Simulates a teletype machine printing encrypted messages in real-time.
 */
function initRadioIntercepts() {
    const log = document.getElementById('intercept-log');
    const messages = [
        "SQUADRON 7: Enemy movement detected in Sector 4. Requesting air support.",
        "HIGH COMMAND: All units maintain radio silence until 0400 hours.",
        "INTEL: Intercepted transmission from Eastern Front suggests a decoy.",
        "LOGISTICS: Fuel shipments delayed. Oil quotas failing in Sector 2.",
        "SQUADRON 12: Bridge at Sector 7 is compromised. Retreating to fallback point.",
        "HIGH COMMAND: Operation 'Iron Curtain' is now in Phase 2. Execute.",
        "UNKNOWN: [STATIC]... they are coming through the valley... [STATIC]...",
        "INTEL: Decryption of Enemy Code 'Sable' complete. Target: Rhine Bridge.",
        "LOGISTICS: Manpower reserves at 82%. Draft order 402-B active."
    ];

    function addEntry() {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const entry = document.createElement('p');
        entry.className = 'log-entry';
        
        // Simulating a teletype effect by adding characters one by one
        log.appendChild(entry);
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < msg.length) {
                entry.textContent += msg.charAt(charIndex);
                charIndex++;
                log.scrollTop = log.scrollHeight;
                setTimeout(typeChar, Math.random() * 50 + 20);
            }
        }
        typeChar();
    }

    // Start the feed
    setInterval(addEntry, 8000);
    addEntry(); // Initial message
}

/**
 * 2. ANALOG GAUGE SYSTEM
 * Creates a "jittery" analog feel where needles move toward a target value with slight oscillation.
 */
function initResourceGauges() {
    const gauges = [
        { id: 'gauge-steel', min: -90, max: 90, current: 45 },
        { id: 'gauge-oil', min: -90, max: 90, current: 110 },
        { id: 'gauge-manpower', min: -90, max: 90, current: 160 }
    ];

    function updateGauges() {
        gauges.forEach(gauge => {
            const element = document.getElementById(gauge.id);
            if (!element) return;

            const needle = element.querySelector('.gauge-needle');
            const valueDisplay = element.querySelector('.gauge-value');

            // Add a slight random jitter to the value
            const jitter = (Math.random() - 0.5) * 5;
            const targetRotation = gauge.current + jitter;
            
            needle.style.setProperty('--rotation', `${targetRotation}deg`);
            
            // Update text value occasionally
            if (Math.random() > 0.8) {
                const percent = Math.floor(Math.random() * 100);
                valueDisplay.textContent = `${percent}%`;
            }
        });
    }

    setInterval(updateGauges, 150);
}

/**
 * 3. UNIT MOVEMENT SYSTEM
 * Implements drag-and-drop for the unit tokens on the map.
 */
function initUnitMovement() {
    const tokens = document.querySelectorAll('.unit-token');
    const map = document.getElementById('map-container');

    tokens.forEach(token => {
        token.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', null); // Necessary for Firefox
            token.style.opacity = '0.5';
        });

        token.addEventListener('dragend', () => {
            token.style.opacity = '1';
        });
    });

    map.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
    });

    map.addEventListener('drop', (e) => {
        e.preventDefault();
        const token = document.querySelector('.unit-token:active') || 
                      document.querySelector('.unit-token[style*="opacity: 0.5"]');
        
        if (token) {
            const rect = map.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Snap to grid (50px grid)
            const snapX = Math.round(x / 50) * 50;
            const snapY = Math.round(y / 50) * 50;
            
            // Convert to percentage for responsive positioning
            const percentX = (snapX / rect.width) * 100;
            const percentY = (snapY / rect.height) * 100;
            
            token.style.left = `${percentX}%`;
            token.style.top = `${percentY}%`;
        }
    });
}

/**
 * 4. PROPAGANDA CAROUSEL
 * Rotates the posters in the margin.
 */
function initPropagandaCarousel() {
    const carousel = document.getElementById('propaganda-carousel');
    const posters = [
        { 
            img: 'https://images.unsplash.com/photo-1578301978693-85fa9c070656?q=80&w=500', 
            text: 'STRENGTH THROUGH UNITY' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=500', 
            text: 'VIGILANCE IS VICTORY' 
        },
        { 
            img: 'https://images.unsplash.com/photo-1533929736458-ca588d0bc60e?q=80&w=500', 
            text: 'PRODUCTION IS PATRIOTISM' 
        }
    ];

    let currentIndex = 0;

    function rotatePoster() {
        currentIndex = (currentIndex + 1) % posters.length;
        const poster = posters[currentIndex];
        
        carousel.style.opacity = 0;
        setTimeout(() => {
            carousel.innerHTML = `
                <div class="poster" style="background-image: url('${poster.img}');">
                    <span class="poster-text">${poster.text}</span>
                </div>
            `;
            carousel.style.opacity = 1;
        }, 500);
    }

    setInterval(rotatePoster, 10000);
}

/**
 * 5. ATMOSPHERIC EFFECTS
 * Randomly alters the lighting and adds "electrical" noise.
 */
function initAtmosphericEffects() {
    const light = document.querySelector('.overhead-light');
    
    function randomFlicker() {
        // Occasionally force a deeper dim to simulate a power surge
        if (Math.random() > 0.95) {
            light.style.opacity = '0.3';
            setTimeout(() => {
                light.style.opacity = '1';
            }, Math.random() * 200 + 50);
        }
    }

    setInterval(randomFlicker, 3000);
}
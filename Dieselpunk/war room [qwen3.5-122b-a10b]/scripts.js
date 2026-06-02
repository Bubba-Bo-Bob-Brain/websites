/**
 * STEP 3: scripts.js
 * Logic for the 1940s Alternate History War Room
 * - Real-time clock
 * - Radio intercept simulation
 * - Analog gauge fluctuation
 * - Drag-and-drop unit markers
 * - Interactive console toggles
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initRadioFeed();
    initGauges();
    initDragAndDrop();
    initConsoleToggles();
});

// --- 1. Real-Time Clock ---
function initClock() {
    const clockElement = document.getElementById('clock-time');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// --- 2. Radio Intercept Simulation ---
function initRadioFeed() {
    const feed = document.getElementById('radio-log');
    const messages = [
        "Static... Enemy fleet spotted at Sector 4...",
        "Requesting air support over the northern ridge...",
        "Fuel reserves critical. Awaiting delivery...",
        "Intercepted code: 'Iron Vanguard' movement detected...",
        "Weather report: Heavy fog in the valley...",
        "Supply convoy delayed due to bridge collapse...",
        "Enemy artillery barrage imminent. Take cover...",
        "Radar contact lost. Possible jamming...",
        "New unit deployed: Heavy Tank Battalion...",
        "Comms check. Can you read me? Over."
    ];

    function addMessage() {
        const msgText = messages[Math.floor(Math.random() * messages.length)];
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="timestamp">${timeString}</span> <span class="msg">${msgText}</span>`;
        
        // Insert at top
        feed.insertBefore(entry, feed.firstChild);
        
        // Keep only last 6 messages
        if (feed.children.length > 6) {
            feed.removeChild(feed.lastChild);
        }
    }

    // Add a message every 3-7 seconds
    function scheduleNext() {
        const delay = Math.random() * 4000 + 3000;
        setTimeout(() => {
            addMessage();
            scheduleNext();
        }, delay);
    }
    
    scheduleNext();
}

// --- 3. Analog Gauge Fluctuation ---
function initGauges() {
    const needles = document.querySelectorAll('.needle');
    
    needles.forEach(needle => {
        // Set initial random angle
        let currentAngle = 0;
        if (needle.style.getPropertyValue('--angle')) {
            currentAngle = parseFloat(needle.style.getPropertyValue('--angle'));
        }

        function fluctuate() {
            // Randomly adjust angle slightly
            const change = (Math.random() - 0.5) * 10; // +/- 5 degrees
            currentAngle += change;
            
            // Clamp values (0 to 180 degrees)
            if (currentAngle < 0) currentAngle = 0;
            if (currentAngle > 180) currentAngle = 180;
            
            needle.style.setProperty('--angle', `${currentAngle}deg`);
            
            // Randomize next fluctuation speed
            const nextTime = Math.random() * 1000 + 500;
            setTimeout(fluctuate, nextTime);
        }
        
        fluctuate();
    });
}

// --- 4. Drag and Drop Unit Markers ---
function initDragAndDrop() {
    const markers = document.querySelectorAll('.unit-marker');
    const mapContainer = document.querySelector('.map-grid-container');
    let activeMarker = null;
    let initialX, initialY, currentX, currentY;
    let xOffset = 0, yOffset = 0;

    markers.forEach(marker => {
        marker.addEventListener('mousedown', dragStart);
    });

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        activeMarker = e.target.closest('.unit-marker');
        
        // Get current position
        const rect = activeMarker.getBoundingClientRect();
        const containerRect = mapContainer.getBoundingClientRect();
        
        // Calculate offset relative to the container
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        
        // Store current transform values if any (simplified for this demo)
        // In a production app, we'd parse the transform matrix
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        activeMarker = null;
    }

    function drag(e) {
        if (activeMarker) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // Calculate position relative to container
            const containerRect = mapContainer.getBoundingClientRect();
            
            let newLeft = e.clientX - containerRect.left - (activeMarker.offsetWidth / 2);
            let newTop = e.clientY - containerRect.top - (activeMarker.offsetHeight / 2);
            
            // Boundary checks
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft > containerRect.width - activeMarker.offsetWidth) newLeft = containerRect.width - activeMarker.offsetWidth;
            if (newTop > containerRect.height - activeMarker.offsetHeight) newTop = containerRect.height - activeMarker.offsetHeight;
            
            // Apply new position
            activeMarker.style.left = `${newLeft}px`;
            activeMarker.style.top = `${newTop}px`;
            
            // Remove inline style to use percentage for responsiveness if needed, 
            // but for this demo, pixels are more precise for dragging.
            // We remove the inline style set in HTML to let JS take over
            activeMarker.style.removeProperty('left');
            activeMarker.style.removeProperty('top');
            activeMarker.style.left = `${newLeft}px`;
            activeMarker.style.top = `${newTop}px`;
        }
    }
}

// --- 5. Console Toggles & Radar Effect ---
function initConsoleToggles() {
    const radarBtn = document.getElementById('radar-toggle');
    const commsBtn = document.getElementById('comms-toggle');
    const mapContainer = document.querySelector('.map-grid-container');

    radarBtn.addEventListener('click', () => {
        radarBtn.classList.toggle('active');
        
        if (radarBtn.classList.contains('active')) {
            // Add radar sweep effect
            const sweep = document.createElement('div');
            sweep.style.position = 'absolute';
            sweep.style.top = '0';
            sweep.style.left = '0';
            sweep.style.width = '100%';
            sweep.style.height = '100%';
            sweep.style.background = 'conic-gradient(from 0deg, transparent 0deg, rgba(76, 175, 80, 0.1) 60deg, transparent 60deg)';
            sweep.style.borderRadius = '50%';
            sweep.style.transform = 'scale(1.5)';
            sweep.style.animation = 'radar-sweep 4s linear infinite';
            sweep.style.pointerEvents = 'none';
            sweep.style.zIndex = '5';
            
            // Inject keyframes dynamically
            if (!document.getElementById('radar-keyframes')) {
                const style = document.createElement('style');
                style.id = 'radar-keyframes';
                style.textContent = `
                    @keyframes radar-sweep {
                        from { transform: rotate(0deg) scale(1.5); }
                        to { transform: rotate(360deg) scale(1.5); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            mapContainer.appendChild(sweep);
        } else {
            // Remove sweep
            const sweep = mapContainer.querySelector('[style*="conic-gradient"]');
            if (sweep) sweep.remove();
        }
    });

    commsBtn.addEventListener('click', () => {
        commsBtn.classList.toggle('active');
        // Visual feedback only for this demo
        if (commsBtn.classList.contains('active')) {
            console.log("Comms Channel Open: Frequency 14.2 MHz");
        } else {
            console.log("Comms Channel Closed");
        }
    });
}
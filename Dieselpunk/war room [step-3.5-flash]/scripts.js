// ===== 1940s Alternate-History War Room JavaScript =====
// Interactive features and animations for the strategic command center

document.addEventListener('DOMContentLoaded', function() {
    // ----- Initialize all systems -----
    initDateTime();
    initGauges();
    initUnitTokens();
    initLampFlicker();
    initRadioFeed();
    initPosterRotator();
    initAlertSystem();
});

// ----- Real-time Clock & Date -----
function initDateTime() {
    const datetimeElement = document.getElementById('datetime');
    
    function updateDateTime() {
        const now = new Date();
        // Format: "TUESDAY, 14 NOVEMBER 1944 - 14:30:45"
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                       'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        
        const dayName = days[now.getDay()];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = 1944; // Alternate history fixed year
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        datetimeElement.textContent = `${dayName}, ${day} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// ----- Analog Gauges with Animated Needles -----
function initGauges() {
    const gauges = document.querySelectorAll('.gauge');
    
    gauges.forEach(gauge => {
        const value = parseInt(gauge.dataset.value);
        // Map 0-100% to -135deg to +135deg range
        const rotation = -135 + (value / 100) * 270;
        const needle = gauge.querySelector('.gauge-needle');
        const valueDisplay = gauge.querySelector('.gauge-value');
        
        // Set CSS variable for rotation
        gauge.style.setProperty('--rotation', `${rotation}deg`);
        
        // Animate needle on load with slight delay for effect
        setTimeout(() => {
            needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        }, Math.random() * 1000);
        
        // Update value display
        valueDisplay.textContent = `${value}%`;
        
        // Periodically fluctuate values slightly for realism
        setInterval(() => {
            const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newValue = Math.max(0, Math.min(100, value + fluctuation));
            const newRotation = -135 + (newValue / 100) * 270;
            needle.style.transform = `translateX(-50%) rotate(${newRotation}deg)`;
            valueDisplay.textContent = `${newValue}%`;
        }, 5000 + Math.random() * 10000);
    });
}

// ----- Draggable Unit Tokens with Grid Snapping -----
function initUnitTokens() {
    const tokens = document.querySelectorAll('.unit-token');
    const table = document.getElementById('strategy-table');
    const gridSize = 40; // Grid cell size in pixels (matches CSS grid)
    
    tokens.forEach(token => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        
        // Mouse events
        token.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events for mobile
        token.addEventListener('touchstart', startDragTouch);
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', stopDrag);
        
        function startDrag(e) {
            isDragging = true;
            token.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = token.offsetLeft;
            initialTop = token.offsetTop;
            
            e.preventDefault();
        }
        
        function startDragTouch(e) {
            const touch = e.touches[0];
            isDragging = true;
            token.classList.add('dragging');
            
            startX = touch.clientX;
            startY = touch.clientY;
            initialLeft = token.offsetLeft;
            initialTop = token.offsetTop;
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;
            
            // Constrain to table bounds
            const tableRect = table.getBoundingClientRect();
            const tokenRect = token.getBoundingClientRect();
            const maxLeft = tableRect.width - tokenRect.width;
            const maxTop = tableRect.height - tokenRect.height;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            token.style.left = newLeft + 'px';
            token.style.top = newTop + 'px';
            
            e.preventDefault();
        }
        
        function dragTouch(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;
            
            // Constrain to table bounds
            const tableRect = table.getBoundingClientRect();
            const tokenRect = token.getBoundingClientRect();
            const maxLeft = tableRect.width - tokenRect.width;
            const maxTop = tableRect.height - tokenRect.height;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            token.style.left = newLeft + 'px';
            token.style.top = newTop + 'px';
            
            e.preventDefault();
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            token.classList.remove('dragging');
            
            // Snap to grid
            const currentLeft = token.offsetLeft;
            const currentTop = token.offsetTop;
            
            const snappedLeft = Math.round(currentLeft / gridSize) * gridSize;
            const snappedTop = Math.round(currentTop / gridSize) * gridSize;
            
            token.style.left = snappedLeft + 'px';
            token.style.top = snappedTop + 'px';
            
            // Update data-location attribute
            const gridX = Math.round(snappedLeft / gridSize) + 1;
            const gridY = Math.round(snappedTop / gridSize) + 1;
            token.dataset.location = `${gridX},${gridY}`;
            
            // Play placement sound effect (optional visual feedback)
            token.style.transform = 'scale(1.2)';
            setTimeout(() => {
                token.style.transform = '';
            }, 150);
        }
    });
}

// ----- Overhead Lamp Flicker & Dynamic Shadows -----
function initLampFlicker() {
    const lampBulb = document.querySelector('.lamp-bulb');
    const flickerOverlay = document.getElementById('lamp-flicker-overlay');
    
    // Random bulb flicker intensity
    setInterval(() => {
        const intensity = 0.85 + Math.random() * 0.15; // 0.85 to 1.0
        lampBulb.style.opacity = intensity;
    }, 100 + Math.random() * 200);
    
    // Periodic dramatic flickers
    setInterval(() => {
        if (Math.random() > 0.7) {
            // Quick double flicker
            lampBulb.style.transition = 'opacity 0.05s';
            lampBulb.style.opacity = '0.6';
            
            setTimeout(() => {
                lampBulb.style.opacity = '1';
            }, 50);
            
            setTimeout(() => {
                lampBulb.style.opacity = '0.7';
            }, 100);
            
            setTimeout(() => {
                lampBulb.style.opacity = '1';
                lampBulb.style.transition = 'opacity 0.1s infinite';
            }, 150);
        }
    }, 3000);
    
    // Dynamic shadow movement (simulates slight bulb movement)
    let shadowX = 0;
    let shadowY = 0;
    
    setInterval(() => {
        shadowX = Math.sin(Date.now() / 5000) * 10;
        shadowY = Math.cos(Date.now() / 7000) * 5;
        
        flickerOverlay.style.background = `
            radial-gradient(
                ellipse at ${50 + shadowX}% ${20 + shadowY}%,
                rgba(255, 204, 0, 0.1) 0%,
                transparent 60%
            )
        `;
    }, 100);
}

// ----- Radio Intercept Feed Generator -----
function initRadioFeed() {
    const radioLog = document.getElementById('radio-log');
    
    // 1940s-style military radio messages
    const messageTemplates = [
        { source: 'Alpha-1', message: 'Patrol reporting enemy movement at grid reference K-7. Requesting aerial reconnaissance.' },
        { source: 'Bravo-3', message: 'Supply convoy delayed due to road damage. ETA 2 hours.' },
        { source: 'Charlie-2', message: 'Weather update: Fog bank moving in from the east. Visibility reduced to 500 meters.' },
        { source: 'Delta-4', message: 'Enemy artillery positions identified. Coordinates follow...' },
        { source: 'Echo-1', message: 'Fuel reserves at 65%. Urgent resupply needed within 48 hours.' },
        { source: 'Foxtrot-5', message: 'Reconnaissance plane spotted enemy tank column moving north along highway 9.' },
        { source: 'Golf-3', message: 'All units report status. Transmission ends.' },
        { source: 'Hotel-2', message: 'Medical evacuation requested at forward operating base. Casualties incoming.' },
        { source: 'India-4', message: 'Radio check. Signal strength strong. Over.' },
        { source: 'Juliett-1', message: 'Enemy radio intercepts indicate possible offensive preparations. Stand by.' },
        { source: 'Kilo-5', message: 'Bridge at river crossing secure. Engineers beginning repairs.' },
        { source: 'Lima-3', message: 'Ammunition depot at full capacity. No shortages reported.' },
        { source: 'Mike-2', message: 'Night patrols increased. All units maintain heightened vigilance.' },
        { source: 'November-4', message: 'Railway line clear for supply transport. Proceed as scheduled.' },
        { source: 'Oscar-1', message: 'Enemy air activity minimal. Our fighters maintaining patrol.' }
    ];
    
    // Static crackle phrases
    const crackles = ['[CRACKLE]', '[STATIC]', '[PAUSE]', '[OVER]', '[COPY]', '[ROGER]'];
    
    function addRadioMessage() {
        const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
        const now = new Date();
        const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        // Randomly add crackle elements
        let formattedMessage = template.message;
        if (Math.random() > 0.6) {
            const crackle = crackles[Math.floor(Math.random() * crackles.length)];
            const position = Math.floor(Math.random() * (formattedMessage.split(' ').length));
            const words = formattedMessage.split(' ');
            words.splice(position, 0, crackle);
            formattedMessage = words.join(' ');
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'radio-message';
        messageElement.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="source">${template.source}:</span>
            <span class="message">${formattedMessage}</span>
        `;
        
        radioLog.appendChild(messageElement);
        
        // Auto-scroll to bottom
        radioLog.scrollTop = radioLog.scrollHeight;
        
        // Limit messages to 50 to prevent memory issues
        const messages = radioLog.querySelectorAll('.radio-message');
        if (messages.length > 50) {
            messages[0].remove();
        }
    }
    
    // Add initial messages with staggered timing
    for (let i = 0; i < 5; i++) {
        setTimeout(() => addRadioMessage(), i * 2000);
    }
    
    // Continue adding random messages
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance every interval
            addRadioMessage();
        }
    }, 4000 + Math.random() * 6000);
}

// ----- Propaganda Poster Rotator -----
function initPosterRotator() {
    const posters = document.querySelectorAll('.poster');
    let currentIndex = 0;
    
    function rotatePosters() {
        posters[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % posters.length;
        posters[currentIndex].classList.add('active');
    }
    
    // Rotate every 8 seconds
    setInterval(rotatePosters, 8000);
}

// ----- Alert Level System -----
function initAlertSystem() {
    const alertElement = document.getElementById('alert-level');
    const alertLevels = [
        { level: 'GREEN', color: '#339933', text: 'NORMAL' },
        { level: 'YELLOW', color: '#ff9933', text: 'CAUTION' },
        { level: 'ORANGE', color: '#ff6600', text: 'ALERT' },
        { level: 'RED', color: '#cc3333', text: 'EMERGENCY' }
    ];
    
    let currentAlert = 1; // Start at YELLOW (index 1)
    
    function updateAlertLevel() {
        // 20% chance to change alert level each update
        if (Math.random() > 0.8) {
            // Randomly move up or down
            const direction = Math.random() > 0.5 ? 1 : -1;
            currentAlert = Math.max(0, Math.min(3, currentAlert + direction));
        }
        
        const alert = alertLevels[currentAlert];
        alertElement.textContent = `ALERT LEVEL: ${alert.level}`;
        alertElement.style.background = `${alert.color}33`; // 20% opacity hex
        alertElement.style.borderColor = alert.color;
        alertElement.style.color = alert.color;
        
        // Add pulsing effect for higher alerts
        if (currentAlert >= 2) {
            alertElement.style.animation = 'pulse-alert 1s infinite';
        } else {
            alertElement.style.animation = 'pulse-alert 2s infinite';
        }
    }
    
    // Update every 10 seconds
    setInterval(updateAlertLevel, 10000);
    updateAlertLevel(); // Initial call
}

// ----- Ambient Sound Toggle (Optional - not implemented but ready) -----
// Could be added with Web Audio API for war room ambience

// ----- Keyboard Shortcuts (Easter Eggs) -----
document.addEventListener('keydown', function(e) {
    // Press 'R' to reset unit positions
    if (e.key === 'r' || e.key === 'R') {
        const tokens = document.querySelectorAll('.unit-token');
        tokens.forEach(token => {
            const gridSize = 40;
            // Return to random grid positions
            const maxGridX = Math.floor((token.parentElement.offsetWidth - 50) / gridSize);
            const maxGridY = Math.floor((token.parentElement.offsetHeight - 50) / gridSize);
            
            const newGridX = Math.floor(Math.random() * maxGridX);
            const newGridY = Math.floor(Math.random() * maxGridY);
            
            token.style.left = (newGridX * gridSize) + 'px';
            token.style.top = (newGridY * gridSize) + 'px';
            token.dataset.location = `${newGridX + 1},${newGridY + 1}`;
        });
    }
    
    // Press 'L' to toggle lamp (if we had a switch)
    if (e.key === 'l' || e.key === 'L') {
        const bulb = document.querySelector('.lamp-bulb');
        if (bulb.style.opacity === '0') {
            bulb.style.opacity = '1';
        } else {
            bulb.style.opacity = '0';
        }
    }
});

// ----- Console Easter Egg -----
console.log('%c STRATEGIC COMMAND CENTER ', 'background: #2a2a2a; color: #f4e8d0; font-size: 20px; font-weight: bold; padding: 10px; border: 2px solid #b5a642;');
console.log('%c TOP SECRET - 1944 ALTERNATE HISTORY ', 'color: #b5a642; font-style: italic;');
console.log('%c Press "R" to randomize unit positions. Press "L" to toggle lamp. ', 'color: #33cc33;');
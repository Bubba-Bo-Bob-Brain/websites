// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initDraggableUnits();
    initRadioTransmission();
    initGauges();
    initPropagandaRotator();
    initMapControls();
    initLampShadow();
});

// Draggable Unit Markers
function initDraggableUnits() {
    const unitMarkers = document.querySelectorAll('.unit-marker');
    const map = document.getElementById('strategyMap');
    
    unitMarkers.forEach(marker => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        
        marker.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = map.getBoundingClientRect();
            initialLeft = parseFloat(marker.style.left) || (e.clientX - rect.left - 12);
            initialTop = parseFloat(marker.style.top) || (e.clientY - rect.top - 12);
            
            marker.style.cursor = 'grabbing';
            marker.style.zIndex = '100';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const rect = map.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Constrain to map boundaries
            const maxX = rect.width - 24;
            const maxY = rect.height - 24;
            
            const boundedX = Math.max(0, Math.min(x - 12, maxX));
            const boundedY = Math.max(0, Math.min(y - 12, maxY));
            
            marker.style.left = boundedX + 'px';
            marker.style.top = boundedY + 'px';
            
            // Update hidden input values if they exist
            const unitInput = marker.querySelector('input[type="hidden"]');
            if (unitInput) {
                unitInput.value = `${boundedX},${boundedY}`;
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                marker.style.cursor = 'grab';
                marker.style.zIndex = '10';
            }
        });
        
        // Touch support for mobile
        marker.addEventListener('touchstart', function(e) {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            const rect = map.getBoundingClientRect();
            initialLeft = parseFloat(marker.style.left) || (touch.clientX - rect.left - 12);
            initialTop = parseFloat(marker.style.top) || (touch.clientY - rect.top - 12);
            
            marker.style.zIndex = '100';
            e.preventDefault();
        }, { passive: false });
        
        marker.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const rect = map.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const maxX = rect.width - 24;
            const maxY = rect.height - 24;
            
            const boundedX = Math.max(0, Math.min(x - 12, maxX));
            const boundedY = Math.max(0, Math.min(y - 12, maxY));
            
            marker.style.left = boundedX + 'px';
            marker.style.top = boundedY + 'px';
            e.preventDefault();
        }, { passive: false });
        
        marker.addEventListener('touchend', function() {
            if (isDragging) {
                isDragging = false;
                marker.style.zIndex = '10';
            }
        });
    });
}

// Radio Transmission System
function initRadioTransmission() {
    const transmissionLog = document.getElementById('transmissionLog');
    const toggleButton = document.getElementById('toggleRadio');
    const clearButton = document.getElementById('clearLog');
    const transmitButton = document.getElementById('newTransmission');
    const radioDisplay = document.getElementById('radioDisplay');
    
    let radioActive = true;
    const transmissions = [
        { type: 'incoming', sender: 'DIVISION ALPHA', message: 'Requesting artillery support at sector 4' },
        { type: 'incoming', sender: 'RECON PATROL', message: 'Enemy movements detected north of position' },
        { type: 'outgoing', sender: 'HQ COMMAND', message: 'Hold position until further orders' },
        { type: 'incoming', sender: 'AIR CORPS', message: 'Weather conditions deteriorating rapidly' },
        { type: 'outgoing', sender: 'HQ COMMAND', message: 'All units report status immediately' },
        { type: 'critical', sender: 'URGENT', message: 'ENEMY ARMORED DIVISION APPROACHING' },
        { type: 'incoming', sender: 'MEDICAL CORPS', message: 'Casualties mounting at field hospital' },
        { type: 'outgoing', sender: 'HQ COMMAND', message: 'Evacuation route established' }
    ];
    
    function addTransmission() {
        if (!radioActive) return;
        
        const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
        const now = new Date();
        const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        const transElement = document.createElement('div');
        transElement.className = `transmission ${transmission.type}`;
        transElement.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="sender">${transmission.sender}</span>
            <span class="message">${transmission.message}</span>
        `;
        
        transmissionLog.appendChild(transElement);
        
        // Auto-scroll to bottom
        transmissionLog.scrollTop = transmissionLog.scrollHeight;
        
        // Remove old transmissions to keep log manageable
        if (transmissionLog.children.length > 50) {
            transmissionLog.removeChild(transmissionLog.firstChild);
        }
    }
    
    // Add initial transmissions
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => addTransmission(), i * 1000);
        }
    }, 1000);
    
    // Periodic transmissions
    setInterval(() => {
        if (radioActive && Math.random() > 0.3) {
            addTransmission();
        }
    }, 3000);
    
    // Toggle radio
    toggleButton.addEventListener('click', function() {
        radioActive = !radioActive;
        this.textContent = radioActive ? 'ACTIVE' : 'MUTE';
        this.style.color = radioActive ? 'var(--steel-green)' : 'var(--steel-red)';
    });
    
    // Clear log
    clearButton.addEventListener('click', function() {
        transmissionLog.innerHTML = '';
    });
    
    // Manual transmit
    transmitButton.addEventListener('click', function() {
        const message = prompt('Enter transmission message:');
        if (message) {
            const now = new Date();
            const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
            
            const transElement = document.createElement('div');
            transElement.className = 'transmission outgoing';
            transElement.innerHTML = `
                <span class="timestamp">${timestamp}</span>
                <span class="sender">HQ COMMAND</span>
                <span class="message">${message}</span>
            `;
            
            transmissionLog.appendChild(transElement);
            transmissionLog.scrollTop = transmissionLog.scrollHeight;
        }
    });
}

// Gauge Animation System
function initGauges() {
    const gauges = document.querySelectorAll('.gauge');
    
    gauges.forEach(gauge => {
        const needle = gauge.querySelector('.gauge-needle');
        const targetValue = Math.random() * 120 - 20; // -20 to 100 degrees
        
        // Animate needle to target position
        setTimeout(() => {
            needle.style.transform = `translate(-50%, -100%) rotate(${targetValue}deg)`;
        }, Math.random() * 2000);
        
        // Update gauge value display
        const valueDisplay = gauge.nextElementSibling.nextElementSibling;
        const finalValue = Math.max(0, Math.min(100, Math.round(targetValue * 1.11)));
        
        setTimeout(() => {
            animateValue(valueDisplay, 0, finalValue, 2000);
        }, 2000);
    });
    
    // Animate numeric values
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Periodic gauge updates
    setInterval(() => {
        const values = ['armyQuota', 'airforceQuota', 'navyQuota', 'industryQuota'];
        const targets = [75, 60, 45, 80];
        
        values.forEach((valueId, index) => {
            const element = document.getElementById(valueId);
            if (element) {
                const currentValue = parseInt(element.textContent);
                const targetValue = targets[index] + (Math.random() * 20 - 10);
                animateValue(element, currentValue, Math.max(0, Math.min(100, Math.round(targetValue))), 1500);
            }
        });
    }, 10000);
}

// Propaganda Poster Rotator
function initPropagandaRotator() {
    const posters = document.querySelectorAll('.propaganda-poster');
    const posterCount = posters.length;
    let currentPoster = 0;
    
    function rotatePoster() {
        // Remove active class from current
        posters[currentPoster].classList.remove('active');
        
        // Move to next poster
        currentPoster = (currentPoster + 1) % posterCount;
        
        // Add active class to next
        posters[currentPoster].classList.add('active');
    }
    
    // Rotate every 5 seconds
    setInterval(rotatePoster, 5000);
}

// Map Controls
function initMapControls() {
    const map = document.getElementById('strategyMap');
    const rotateButton = document.getElementById('rotateMap');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    
    let rotation = 0;
    let zoom = 1;
    
    rotateButton.addEventListener('click', function() {
        rotation += 45;
        map.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    });
    
    zoomInButton.addEventListener('click', function() {
        zoom = Math.min(zoom + 0.2, 3);
        map.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    });
    
    zoomOutButton.addEventListener('click', function() {
        zoom = Math.max(zoom - 0.2, 0.5);
        map.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    });
    
    // Mouse wheel zoom
    map.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            zoom = Math.max(zoom - 0.1, 0.5);
        } else {
            zoom = Math.min(zoom + 0.1, 3);
        }
        map.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    }, { passive: false });
}

// Overhead Lamp Effect
function initLampShadow() {
    const lampShadow = document.querySelector('.lamp-shadow');
    let shadowX = 30;
    let shadowY = 30;
    let shadowIntensity = 0.3;
    
    function animateLamp() {
        // Subtle movement for realistic lamp effect
        shadowX += (Math.random() - 0.5) * 2;
        shadowY += (Math.random() - 0.5) * 2;
        
        // Constrain movement
        shadowX = Math.max(10, Math.min(70, shadowX));
        shadowY = Math.max(10, Math.min(70, shadowY));
        
        lampShadow.style.left = shadowX + '%';
        lampShadow.style.top = shadowY + '%';
        lampShadow.style.opacity = shadowIntensity + (Math.random() * 0.2 - 0.1);
        
        requestAnimationFrame(animateLamp);
    }
    
    animateLamp();
}

// Add new transmission programmatically
function addNewTransmission(sender, message, type = 'incoming') {
    const transmissionLog = document.getElementById('transmissionLog');
    const now = new Date();
    const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    
    const transElement = document.createElement('div');
    transElement.className = `transmission ${type}`;
    transElement.innerHTML = `
        <span class="timestamp">${timestamp}</span>
        <span class="sender">${sender}</span>
        <span class="message">${message}</span>
    `;
    
    transmissionLog.appendChild(transElement);
    transmissionLog.scrollTop = transmissionLog.scrollHeight;
    
    // Limit log size
    if (transmissionLog.children.length > 50) {
        transmissionLog.removeChild(transmissionLog.firstChild);
    }
}

// Simulate system events
setInterval(() => {
    const events = [
        { sender: 'FRONT LINE', message: 'Heavy resistance encountered at checkpoint 7', type: 'critical' },
        { sender: 'LOGISTICS', message: 'Ammunition supplies running low', type: 'warning' },
        { sender: 'RECON', message: 'New enemy position identified', type: 'incoming' },
        { sender: 'ARTILLERY', message: 'Coordinate bombardment successful', type: 'outgoing' },
        { sender: 'COMMAND', message: 'Strategic retreat authorized', type: 'critical' }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    addNewTransmission(event.sender, event.message, event.type);
}, 15000);

// Add initial unit markers with positions
window.addEventListener('load', function() {
    // Add some initial unit positions
    const map = document.getElementById('strategyMap');
    const units = [
        { unit: 'infantry', left: '15%', top: '20%' },
        { unit: 'armor', left: '35%', top: '45%' },
        { unit: 'artillery', left: '55%', top: '30%' },
        { unit: 'aircraft', left: '75%', top: '60%' }
    ];
    
    units.forEach(unit => {
        const marker = document.createElement('div');
        marker.className = `unit-marker ${unit.unit}`;
        marker.style.left = unit.left;
        marker.style.top = unit.top;
        marker.draggable = true;
        
        const icon = document.createElement('div');
        icon.className = 'unit-icon';
        icon.textContent = unit.unit.toUpperCase().substring(0, 3);
        marker.appendChild(icon);
        
        // Add hidden input to store position
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `${unit.unit}_position`;
        input.value = `${unit.left},${unit.top}`;
        marker.appendChild(input);
        
        map.appendChild(marker);
    });
    
    // Re-init draggable for dynamically added elements
    initDraggableUnits();
});
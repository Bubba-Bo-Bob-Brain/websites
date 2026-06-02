// ============================================
// JOINT STRATEGIC COMMAND — WAR ROOM SCRIPTS
// 1940s Alternate History Military Interface
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initOverheadLamp();
    initRadioSystem();
    initMapSystem();
    initProductionGauges();
    initPropagandaRotation();
    initTickerSystem();
    initStatusSystem();
    initToolSystem();
});

// —— Overhead Lamp with Realistic Flicker ——
function initOverheadLamp() {
    const lamp = document.getElementById('overheadLamp');
    const shadow = document.getElementById('lampShadow');
    
    shadow.classList.add('active');
    
    function flicker() {
        const duration = Math.random() * 150 + 50;
        lamp.style.opacity = Math.random() * 0.4 + 0.6;
        lamp.classList.add('lamp-flicker');
        
        setTimeout(() => {
            lamp.classList.remove('lamp-flicker');
            lamp.style.opacity = 1;
        }, duration);
        
        const nextFlicker = Math.random() * 8000 + 2000;
        setTimeout(flicker, nextFlicker);
    }
    
    setTimeout(flicker, 3000);
}

// —— Radio Intercept System ——
function initRadioSystem() {
    const frequencyDisplay = document.getElementById('frequency');
    const tunerNeedle = document.getElementById('tunerNeedle');
    const volumeNeedle = document.getElementById('volumeNeedle');
    const gainNeedle = document.getElementById('gainNeedle');
    const radioLog = document.getElementById('radioLog');
    const morseKey = document.getElementById('morseKey');
    const soundIndicator = document.getElementById('soundIndicator');
    
    let currentFreq = 3.142;
    let isTransmitting = false;
    
    // Animate tuner needle
    function driftFrequency() {
        const drift = (Math.random() - 0.5) * 0.05;
        currentFreq = Math.max(2.0, Math.min(10.0, currentFreq + drift));
        frequencyDisplay.textContent = currentFreq.toFixed(3);
        
        const percent = (currentFreq - 2.0) / 8.0;
        tunerNeedle.style.transform = `translateX(${percent * 200 - 100}px)`;
        
        setTimeout(driftFrequency, Math.random() * 2000 + 500);
    }
    driftFrequency();
    
    // Animate volume/gain dials
    function animateDials() {
        const volAngle = -45 + Math.random() * 90;
        const gainAngle = -45 + Math.random() * 90;
        volumeNeedle.style.transform = `translate(-50%, -100%) rotate(${volAngle}deg)`;
        gainNeedle.style.transform = `translate(-50%, -100%) rotate(${gainAngle}deg)`;
        
        setTimeout(animateDials, Math.random() * 1500 + 500);
    }
    animateDials();
    
    // Morse key transmit
    morseKey.addEventListener('mousedown', () => {
        isTransmitting = true;
        morseKey.classList.add('transmitting');
        soundIndicator.classList.add('active');
        addLogEntry('OUTGOING', 'TRANSMITTING: STAND BY...', 'transmitting');
    });
    
    morseKey.addEventListener('mouseup', () => {
        isTransmitting = false;
        morseKey.classList.remove('transmitting');
        soundIndicator.classList.remove('active');
        addLogEntry('SENT', 'TRANSMISSION COMPLETE — AWAITING ACK', 'sent');
    });
    
    morseKey.addEventListener('mouseleave', () => {
        if (isTransmitting) {
            isTransmitting = false;
            morseKey.classList.remove('transmitting');
            soundIndicator.classList.remove('active');
        }
    });
    
    // Auto-generate incoming messages
    const messagePool = [
        { type: 'received', signal: '···', text: 'Intercepted: ENCRYPTED TRAFFIC, Sector 7-G' },
        { type: 'received', signal: '···', text: 'Confirmed: CONVOY MOVEMENT, Grid 4-Alpha' },
        { type: 'static', signal: '~', text: '[STATIC BURST — ATMOSPHERIC]' },
        { type: 'received', signal: '···', text: 'Decoded: SUPPLY DROP COORDINATES UPDATED' },
        { type: 'received', signal: '···', text: 'Alert: ENEMY PATROL SIGHTED, River Crossing' },
        { type: 'static', signal: '~', text: '[INTERFERENCE — SOLAR ACTIVITY]' },
        { type: 'received', signal: '···', text: 'Urgent: REQUESTING ARTILLERY SUPPORT, Grid 5-Bravo' },
        { type: 'decoded', signal: '★', text: 'PRIORITY: ALL UNITS — STAND TO' },
        { type: 'received', signal: '···', text: 'Confirmed: AIR STRIKE INCOMING, TAKE COVER' },
        { type: 'static', signal: '~', text: '[SIGNAL LOST — RETRYING]' }
    ];
    
    function addLogEntry(type, text, cssClass = null) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${cssClass || type}`;
        
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 8);
        
        const signal = type === 'transmitting' ? '▶' : type === 'sent' ? '✓' : type === 'decoded' ? '★' : type === 'static' ? '~' : '···';
        
        entry.innerHTML = `
            <span class="log-time">${timeStr}</span>
            <span class="log-signal">${signal}</span>
            <span class="log-text">${text}</span>
        `;
        
        radioLog.appendChild(entry);
        radioLog.scrollTop = radioLog.scrollHeight;
        
        // Remove old entries
        while (radioLog.children.length > 20) {
            radioLog.removeChild(radioLog.firstChild);
        }
    }
    
    function autoGenerateMessage() {
        if (Math.random() > 0.3 && !isTransmitting) {
            const msg = messagePool[Math.floor(Math.random() * messagePool.length)];
            addLogEntry(msg.type, msg.text);
            
            // Brief flash on sound indicator for received messages
            if (msg.type === 'received' || msg.type === 'decoded') {
                soundIndicator.classList.add('active');
                setTimeout(() => soundIndicator.classList.remove('active'), 100);
            }
        }
        
        setTimeout(autoGenerateMessage, Math.random() * 6000 + 3000);
    }
    setTimeout(autoGenerateMessage, 5000);
}

// —— Map System with Draggable Units ——
function initMapSystem() {
    const mapContainer = document.getElementById('mapContainer');
    const coordReadout = document.getElementById('coordReadout');
    const compassNeedle = document.getElementById('compassNeedle');
    const crtOverlay = document.querySelector('.crt-overlay');
    
    // Generate grid coordinates
    const mapGrid = document.getElementById('mapGrid');
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                position: absolute;
                left: ${i * 40}px;
                top: ${j * 40}px;
                width: 40px;
                height: 40px;
                border-right: 1px solid rgba(196, 176, 130, 0.08);
                border-bottom: 1px solid rgba(196, 176, 130, 0.08);
                pointer-events: none;
            `;
        }
    }
    
    // Coordinate tracking
    mapContainer.addEventListener('mousemove', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        coordReadout.textContent = `X: ${x.toString().padStart(3, '0')} Y: ${y.toString().padStart(3, '0')}`;
    });
    
    // Compass drift
    let compassAngle = 0;
    function driftCompass() {
        compassAngle += (Math.random() - 0.5) * 4;
        compassNeedle.style.transform = `translate(-50%, -100%) rotate(${compassAngle}deg)`;
        setTimeout(driftCompass, Math.random() * 1000 + 500);
    }
    driftCompass();
    
    // Draggable unit markers
    const markers = document.querySelectorAll('.unit-marker[draggable="true"]');
    let draggedMarker = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    markers.forEach(marker => {
        marker.addEventListener('dragstart', (e) => {
            draggedMarker = marker;
            const rect = marker.getBoundingClientRect();
            const parentRect = mapContainer.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left - 18;
            dragOffsetY = e.clientY - rect.top - 18;
            marker.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        marker.addEventListener('dragend', () => {
            marker.classList.remove('dragging');
            draggedMarker = null;
        });
    });
    
    mapContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    mapContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedMarker) {
            const rect = mapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - dragOffsetX;
            const y = e.clientY - rect.top - dragOffsetY;
            
            const clampedX = Math.max(18, Math.min(rect.width - 18, x));
            const clampedY = Math.max(18, Math.min(rect.height - 18, y));
            
            draggedMarker.style.left = `${clampedX}px`;
            draggedMarker.style.top = `${clampedY}px`;
        }
    });
    
    // Touch support for mobile
    markers.forEach(marker => {
        marker.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = marker.getBoundingClientRect();
            dragOffsetX = touch.clientX - rect.left;
            dragOffsetY = touch.clientY - rect.top;
            marker.classList.add('dragging');
            e.preventDefault();
        });
        
        marker.addEventListener('touchmove', (e) => {
            if (!marker.classList.contains('dragging')) return;
            const touch = e.touches[0];
            const rect = mapContainer.getBoundingClientRect();
            const x = touch.clientX - rect.left - dragOffsetX + 18;
            const y = touch.clientY - rect.top - dragOffsetY + 18;
            
            const clampedX = Math.max(18, Math.min(rect.width - 18, x));
            const clampedY = Math.max(18, Math.min(rect.height - 18, y));
            
            marker.style.left = `${clampedX}px`;
            marker.style.top = `${clampedY}px`;
            e.preventDefault();
        });
        
        marker.addEventListener('touchend', () => {
            marker.classList.remove('dragging');
        });
    });
    
    // Periodic CRT flicker effect
    function crtFlicker() {
        crtOverlay.classList.add('active');
        setTimeout(() => {
            crtOverlay.classList.remove('active');
        }, 100);
        
        setTimeout(crtFlicker, Math.random() * 15000 + 10000);
    }
    setTimeout(crtFlicker, 8000);
}

// —— Production Gauges Animation ——
function initProductionGauges() {
    const gauges = [
        { id: 'tankGauge', valueId: 'tankValue', target: 74 },
        { id: 'planeGauge', valueId: 'planeValue', target: 60 },
        { id: 'shipGauge', valueId: 'shipValue', target: 86 },
        { id: 'ammoGauge', valueId: 'ammoValue', target: 50 }
    ];
    
    const maxDash = 126;
    
    function updateGauges() {
        gauges.forEach(g => {
            const variation = (Math.random() - 0.5) * 6;
            const newValue = Math.max(0, Math.min(100, g.target + variation));
            const dashOffset = maxDash - (newValue / 100 * maxDash);
            
            const gauge = document.getElementById(g.id);
            const valueDisplay = document.getElementById(g.valueId);
            
            if (gauge) gauge.style.strokeDashoffset = dashOffset;
            if (valueDisplay) valueDisplay.textContent = `${Math.round(newValue)}%`;
        });
        
        setTimeout(updateGauges, Math.random() * 4000 + 3000);
    }
    
    // Initial animation
    setTimeout(updateGauges, 2000);
}

// —— Propaganda Poster Rotation ——
function initPropagandaRotation() {
    const posters = document.querySelectorAll('.propaganda-poster');
    const dotsContainer = document.getElementById('posterDots');
    const prevBtn = document.getElementById('posterPrev');
    const nextBtn = document.getElementById('posterNext');
    
    let currentIndex = 0;
    let autoRotateInterval;
    
    // Create dots
    posters.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `poster-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToPoster(i));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.poster-dot');
    
    function goToPoster(index) {
        posters[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        currentIndex = index;
        
        posters[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    function nextPoster() {
        goToPoster((currentIndex + 1) % posters.length);
    }
    
    function prevPoster() {
        goToPoster((currentIndex - 1 + posters.length) % posters.length);
    }
    
    prevBtn.addEventListener('click', () => {
        prevPoster();
        resetAutoRotate();
    });
    
    nextBtn.addEventListener('click', () => {
        nextPoster();
        resetAutoRotate();
    });
    
    function autoRotate() {
        nextPoster();
    }
    
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(autoRotate, 6000);
    }
    
    autoRotateInterval = setInterval(autoRotate, 6000);
}

// —— Ticker System ——
function initTickerSystem() {
    const tickerTime = document.getElementById('tickerTime');
    
    function updateTime() {
        const now = new Date();
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        const seconds = now.getUTCSeconds().toString().padStart(2, '0');
        tickerTime.textContent = `${hours}:${minutes}:${seconds} ZULU`;
    }
    
    setInterval(updateTime, 1000);
    updateTime();
}

// —— Status System ——
function initStatusSystem() {
    const statusLight = document.getElementById('statusLight');
    const statusText = document.getElementById('statusText');
    
    const statuses = [
        { class: '', text: 'OPERATIONAL' },
        { class: 'alert', text: 'ALERT CONDITION' }
    ];
    
    let isAlert = false;
    
    function toggleAlert() {
        isAlert = !isAlert;
        
        if (isAlert) {
            statusLight.classList.add('alert');
            statusText.textContent = 'ALERT CONDITION';
            statusText.style.color = 'var(--red-bright)';
        } else {
            statusLight.classList.remove('alert');
            statusText.textContent = 'OPERATIONAL';
            statusText.style.color = 'var(--green-bright)';
        }
        
        const nextToggle = isAlert ? Math.random() * 5000 + 3000 : Math.random() * 20000 + 15000;
        setTimeout(toggleAlert, nextToggle);
    }
    
    setTimeout(toggleAlert, 20000);
}

// —— Tool System ——
function initToolSystem() {
    const toolBtns = document.querySelectorAll('.tool-btn');
    
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// —— Dynamic Paths Drawing ——
function drawPath(startX, startY, endX, endY, controlX, controlY) {
    const pathsLayer = document.getElementById('pathsLayer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
    path.setAttribute('d', d);
    path.setAttribute('class', 'planned-path');
    path.setAttribute('stroke-dasharray', '8,4');
    
    pathsLayer.appendChild(path);
    
    // Auto-remove after animation
    setTimeout(() => {
        if (path.parentNode) path.parentNode.removeChild(path);
    }, 10000);
}

// —— Random Background Activity ——
setInterval(() => {
    // Occasional coordinate flash in readout
    const readout = document.getElementById('coordReadout');
    if (readout && Math.random() > 0.95) {
        const original = readout.textContent;
        readout.style.color = 'var(--amber-glow)';
        setTimeout(() => {
            readout.style.color = 'var(--green-glow)';
        }, 200);
    }
}, 1000);
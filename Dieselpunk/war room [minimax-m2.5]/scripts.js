// ========================================
// 1940s WAR ROOM - JAVASCRIPT
// Allied Strategic Command Operations Center
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeWarRoom();
});

function initializeWarRoom() {
    initDraggableTokens();
    initClock();
    initMapControls();
    initAnalogGauges();
    initRadioTransmission();
    initProductionQuotas();
    initAmbientEffects();
}

// ========================================
// DRAGGABLE UNIT TOKENS
// ========================================

function initDraggableTokens() {
    const tokens = document.querySelectorAll('.unit-token');
    let activeToken = null;
    let offsetX, offsetY;

    tokens.forEach(function(token) {
        token.addEventListener('mousedown', startDrag);
        token.addEventListener('touchstart', startDrag, { passive: false });
    });

    function startDrag(e) {
        e.preventDefault();
        activeToken = this;
        const rect = activeToken.getBoundingClientRect();
        const container = document.querySelector('.map-container');
        const containerRect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        activeToken.style.zIndex = '100';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if (!activeToken) return;
        e.preventDefault();
        const container = document.querySelector('.map-container');
        const containerRect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let newX = clientX - containerRect.left - offsetX;
        let newY = clientY - containerRect.top - offsetY;
        const maxX = containerRect.width - activeToken.offsetWidth;
        const maxY = containerRect.height - activeToken.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        activeToken.style.left = newX + 'px';
        activeToken.style.top = newY + 'px';
    }

    function endDrag() {
        if (activeToken) {
            activeToken.style.zIndex = '10';
        }
        activeToken = null;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);
    }
}

// ========================================
// REAL-TIME CLOCK
// ========================================

function initClock() {
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const hourRotation = (hours % 12) * 30 + (minutes / 2);
        const minuteRotation = minutes * 6;
        const secondRotation = seconds * 6;
        const hourHand = document.querySelector('.clock-hour');
        const minuteHand = document.querySelector('.clock-minute');
        const secondHand = document.querySelector('.clock-second');
        const clockLabel = document.querySelector('.clock-label');
        if (hourHand) hourHand.style.setProperty('--hour-rotation', hourRotation + 'deg');
        if (minuteHand) minuteHand.style.setProperty('--minute-rotation', minuteRotation + 'deg');
        if (secondHand) secondHand.style.setProperty('--second-rotation', secondRotation + 'deg');
        if (clockLabel) {
            const timeString = hours.toString().padStart(2, '0') + minutes.toString().padStart(2, '0') + ' HRS';
            clockLabel.textContent = timeString;
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// ========================================
// MAP CONTROLS
// ========================================

function initMapControls() {
    const mapContainer = document.querySelector('.map-container');
    const mapGrid = document.querySelector('.map-grid');
    const strategyMap = document.querySelector('.strategy-map');
    const unitsLayer = document.querySelector('.units-layer');
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let startPanX, startPanY;

    document.getElementById('zoomIn').addEventListener('click', function() {
        scale = Math.min(scale + 0.2, 2);
        applyTransform();
    });

    document.getElementById('zoomOut').addEventListener('click', function() {
        scale = Math.max(scale - 0.2, 0.5);
        applyTransform();
    });

    document.getElementById('resetMap').addEventListener('click', function() {
        scale = 1;
        panX = 0;
        panY = 0;
        applyTransform();
    });

    document.getElementById('toggleGrid').addEventListener('click', function() {
        this.classList.toggle('active');
        mapGrid.classList.toggle('active');
    });

    document.getElementById('toggleFog').addEventListener('click', function() {
        this.classList.toggle('active');
    });

    function applyTransform() {
        var transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
        if (strategyMap) strategyMap.style.transform = transform;
        if (unitsLayer) unitsLayer.style.transform = transform;
    }

    mapContainer.addEventListener('mousedown', function(e) {
        if (e.target === mapContainer || e.target.classList.contains('map-grid')) {
            isPanning = true;
            startPanX = e.clientX - panX;
            startPanY = e.clientY - panY;
            mapContainer.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!isPanning) return;
        panX = e.clientX - startPanX;
        panY = e.clientY - startPanY;
        applyTransform();
    });

    document.addEventListener('mouseup', function() {
        isPanning = false;
        mapContainer.style.cursor = 'grab';
    });
}

// ========================================
// ANALOG GAUGES
// ========================================

function initAnalogGauges() {
    var gauges = document.querySelectorAll('.gauge');
    var resourceValues = { steel: 72, fuel: 58, ammo: 85, food: 45 };

    function animateGauge(gauge, targetValue) {
        var needle = gauge.querySelector('.gauge-needle');
        if (!needle) return;
        var rotation = (targetValue / 100) * 180 - 90;
        needle.style.setProperty('--rotation', rotation + 'deg');
    }

    setTimeout(function() {
        gauges.forEach(function(gauge, index) {
            var label = gauge.querySelector('.gauge-label');
            var value = 0;
            if (label) {
                var labelText = label.textContent.toLowerCase();
                value = resourceValues[labelText] || Math.random() * 100;
            }
            setTimeout(function() {
                animateGauge(gauge, value);
            }, index * 200);
        });
    }, 500);

    setInterval(function() {
        gauges.forEach(function(gauge) {
            var label = gauge.querySelector('.gauge-label');
            if (label) {
                var labelText = label.textContent.toLowerCase();
                var currentValue = resourceValues[labelText];
                var variation = (Math.random() - 0.5) * 10;
                var newValue = Math.max(10, Math.min(100, currentValue + variation));
                resourceValues[labelText] = newValue;
                animateGauge(gauge, newValue);
            }
        });
    }, 5000);
}

// ========================================
// RADIO TRANSMISSION LOG
// ========================================

function initRadioTransmission() {
    var radioLog = document.querySelector('.radio-log');
    var transmissionMessages = [
        { text: '...ARTILLERY BARRAGE CONFIRMED SECTOR 12...', type: 'incoming' },
        { text: '...SUPPLY CONVOY ARRIVED SAFELY...', type: 'incoming' },
        { text: '/// ENCRYPTION KEY UPDATED ///', type: 'system' },
        { text: '...ENEMY RADAR DETECTED BEARING 270...', type: 'enemy' },
        { text: '...MEDICAL UNIT REQUESTING ASSISTANCE...', type: 'incoming' },
        { text: '...AERIAL RECONNAISSANCE COMPLETE...', type: 'incoming' },
        { text: '/// FREQUENCY HOPPING INITIATED ///', type: 'system' },
        { text: '...SABOTEURS SPOTTED NEAR RIVER CROSSING...', type: 'incoming' },
        { text: '...FUNKER STORUNG IM BEREICH...', type: 'enemy' },
        { text: '...REINFORCEMENTS INBOUND ETA 30 MIN...', type: 'incoming' }
    ];

    function getCurrentTime() {
        var now = new Date();
        return now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    }

    function addTransmission() {
        var message = transmissionMessages[Math.floor(Math.random() * transmissionMessages.length)];
        var entry = document.createElement('div');
        entry.className = 'log-entry ' + message.type;
        entry.innerHTML = '<span class="log-time">' + getCurrentTime() + '</span><span class="log-text">' + message.text + '</span>';
        radioLog.appendChild(entry);
        radioLog.scrollTop = radioLog.scrollHeight;
        var entries = radioLog.querySelectorAll('.log-entry');
        if (entries.length > 15) {
            entries[0].remove();
        }
    }

    setTimeout(function() {
        addTransmission();
    }, 2000);

    setInterval(function() {
        addTransmission();
    }, 8000 + Math.random() * 7000);

    function animateDial() {
        var needle = document.querySelector('.dial-needle');
        if (needle) {
            var randomPosition = 40 + Math.random() * 40;
            needle.style.left = randomPosition + '%';
        }
    }
    setInterval(animateDial, 2000);
    animateDial();
}

// ========================================
// PRODUCTION QUOTAS
// ========================================

function initProductionQuotas() {
    var quotaBars = document.querySelectorAll('.quota-fill');
    var quotaValues = document.querySelectorAll('.quota-value');
    var targets = [78, 92, 65, 88];
    var currentValues = [0, 0, 0, 0];

    function animateQuotas() {
        quotaBars.forEach(function(bar, index) {
            if (currentValues[index] < targets[index]) {
                currentValues[index] += Math.random() * 5;
                currentValues[index] = Math.min(currentValues[index], targets[index]);
                bar.style.width = currentValues[index] + '%';
                if (quotaValues[index]) {
                    quotaValues[index].textContent = Math.floor(currentValues[index]) + '/100';
                }
            }
        });
        if (currentValues.some(function(val, i) { return val < targets[i]; })) {
            requestAnimationFrame(animateQuotas);
        }
    }
    animateQuotas();

    setInterval(function() {
        quotaBars.forEach(function(bar, index) {
            var variation = (Math.random() - 0.3) * 5;
            targets[index] = Math.max(20, Math.min(100, targets[index] + variation));
            var newWidth = Math.max(10, Math.min(100, targets[index]));
            bar.style.width = newWidth + '%';
            if (quotaValues[index]) {
                quotaValues[index].textContent = Math.floor(newWidth) + '/100';
            }
        });
    }, 10000);
}

// ========================================
// AMBIENT EFFECTS
// ========================================

function initAmbientEffects() {
    var lampBulb = document.querySelector('.lamp-bulb');
    if (lampBulb) {
        setInterval(function() {
            if (Math.random() > 0.95) {
                lampBulb.style.opacity = '0.6';
                setTimeout(function() {
                    lampBulb.style.opacity = '1';
                }, 100 + Math.random() * 200);
            }
        }, 2000);
    }

    var statusItems = document.querySelectorAll('.status-item');
    function updateStatus() {
        statusItems.forEach(function(item, index) {
            if (index === 2) {
                var statuses = ['CRITICAL', 'LOW', 'MODERATE', 'GOOD'];
                var currentStatus = item.textContent.split(': ')[1];
                if (Math.random() > 0.7) {
                    var newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    item.innerHTML = item.innerHTML.replace(currentStatus, newStatus);
                }
            }
        });
    }
    setInterval(updateStatus, 15000);

    var posters = document.querySelectorAll('.propaganda-frame');
    setInterval(function() {
        posters.forEach(function(poster) {
            poster.style.opacity = '0.7';
            poster.style.transform = 'scale(0.98)';
            setTimeout(function() {
                poster.style.opacity = '1';
                poster.style.transform = 'scale(1)';
            }, 300);
        });
    }, 30000);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'g' || e.key === 'G') {
        document.getElementById('toggleGrid').click();
    }
    if (e.key === 'f' || e.key === 'F') {
        document.getElementById('toggleFog').click();
    }
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('resetMap').click();
    }
    if (e.key === '+' || e.key === '=') {
        document.getElementById('zoomIn').click();
    }
    if (e.key === '-') {
        document.getElementById('zoomOut').click();
    }
});

// ========================================
// CONSOLE EASTER EGG
// ========================================

console.log('ALLIED STRATEGIC COMMAND');
console.log('Tactics is the art of using troops in battle. Strategy is the art of using battles to win the war.');
console.log('Press G to toggle grid | F for fog of war | R to reset map');
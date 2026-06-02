/* =========================================
   SUPREME COMMAND WAR ROOM - JAVASCRIPT
   1940s Alternate History Military Logic
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION & STATE ---
    const CONFIG = {
        clockInterval: 1000,
        radioInterval: 12000,
        gaugeFluctuationInterval: 3000,
        posterRotationInterval: 8000,
        lampFlickerInterval: 100,
        maxRadioMessages: 20
    };

    const STATE = {
        isDragging: false,
        draggedElement: null,
        dragOffset: { x: 0, y: 0 },
        currentPosterIndex: 0,
        radioMessageCount: 0,
        mapZoom: 1
    };

    // --- DOM REFERENCES ---
    const DOM = {
        clockTime: document.getElementById('currentTime'),
        clockDate: document.getElementById('currentDate'),
        lastUpdate: document.getElementById('lastUpdate'),
        lampGlow: document.getElementById('lampGlow'),
        freqSlider: document.getElementById('freqSlider'),
        freqDisplay: document.getElementById('freqDisplay'),
        volumeSlider: document.getElementById('volumeSlider'),
        signalFill: document.getElementById('signalFill'),
        signalNeedle: document.getElementById('signalNeedle'),
        radioFeed: document.getElementById('radioFeed'),
        scanBtn: document.getElementById('scanBtn'),
        decryptBtn: document.getElementById('decryptBtn'),
        gridToggle: document.getElementById('gridToggle'),
        terrainToggle: document.getElementById('terrainToggle'),
        supplyToggle: document.getElementById('supplyToggle'),
        mapContainer: document.getElementById('mapContainer'),
        gridOverlay: document.getElementById('gridOverlay'),
        unitMarkers: document.getElementById('unitMarkers'),
        contextMenu: document.getElementById('contextMenu'),
        unitTooltip: document.getElementById('unitTooltip'),
        posterFrame: document.getElementById('posterFrame'),
        // Gauges
        steelNeedle: document.getElementById('steelNeedle'),
        fuelNeedle: document.getElementById('fuelNeedle'),
        ammoNeedle: document.getElementById('ammoNeedle'),
        steelValue: document.getElementById('steelValue'),
        fuelValue: document.getElementById('fuelValue'),
        ammoValue: document.getElementById('ammoValue'),
        steelGaugeArc: document.getElementById('steelGaugeArc'),
        fuelGaugeArc: document.getElementById('fuelGaugeArc'),
        ammoGaugeArc: document.getElementById('ammoGaugeArc')
    };

    // --- UTILITY FUNCTIONS ---
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // --- CLOCK & DATE SYSTEM ---
    function updateClock() {
        const now = new Date();
        const timeString = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Alternate history date base
        const baseDate = new Date(1943, 10, 14); 
        // We'll just show current time for realism but with a 1940s date flavor
        const dateString = `${padZero(now.getHours())} ${now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()} 1943`;
        
        DOM.clockTime.textContent = timeString;
        DOM.clockDate.textContent = dateString;
        DOM.lastUpdate.textContent = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
    }

    setInterval(updateClock, CONFIG.clockInterval);
    updateClock();

    // --- LAMP FLICKER EFFECT ---
    function animateLamp() {
        // Randomly adjust opacity to simulate erratic power grid or old bulb
        if (Math.random() > 0.7) {
            const opacity = randomFloat(0.6, 0.9);
            DOM.lampGlow.style.opacity = opacity;
        }
    }
    setInterval(animateLamp, CONFIG.lampFlickerInterval);

    // --- RADIO INTERCEPT SYSTEM ---
    const RADIO_MESSAGES = [
        { source: 'STATION EAGLE-4', priority: 'PRIORITY', text: 'ENEMY ARMORED DIVISION REPORTED CROSSING SECTOR DELTA. REQUESTING AIR SUPPORT.' },
        { source: 'OUTPOST VEGA', priority: 'ROUTINE', text: 'SUPPLY CONVOY BRAVO-7 ARRIVED ON SCHEDULE. MUNITIONS DEPOSITED AT FORWARD BASE ALPHA.' },
        { source: 'HQ COMMAND', priority: 'URGENT', text: 'ALL UNITS MAINTAIN RADIO SILENCE UNTIL 1600 HOURS. OPERATION NIGHTFALL COMMENCES.' },
        { source: 'INTEL DIVISION', priority: 'CLASSIFIED', text: 'INTERCEPTED ENCRYPTION KEY ALPHA-9. DECRYPTING TRAFFIC...' },
        { source: 'FIELD MEDIC', priority: 'URGENT', text: 'CASUALTY EVAC REQUIRED AT GRID 7-CHARLIE. UNDER HEAVY FIRE.' },
        { source: 'ARTILLERY BATTALION', priority: 'ROUTINE', text: 'FIRE MISSION COMPLETED. TARGET NEUTRALIZED. AWAITING NEW COORDINATES.' },
        { source: 'RECON FLIGHT 4', priority: 'INTEL', text: 'AERIAL PHOTOGRAPHY COMPLETE. NEW TRENCH WORKS DETECTED EAST OF RIVER.' },
        { source: 'ENGINEERING CORPS', priority: 'ROUTINE', text: 'BRIDGE REPAIRS 80% COMPLETE. EXPECT FULL CAPACITY BY 1800 HOURS.' },
        { source: 'UNKNOWN SIGNAL', priority: 'STATIC', text: '...krrrt... coordinates... krrrt... repeat...' }
    ];

    function addRadioMessage(msg = null) {
        const messageData = msg || RADIO_MESSAGES[randomInt(0, RADIO_MESSAGES.length - 1)];
        
        const now = new Date();
        const timeStr = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
        
        const priorityClass = 
            messageData.priority === 'URGENT' || messageData.priority === 'PRIORITY' ? 'priority-high' : 
            messageData.priority === 'STATIC' ? 'static-message' : 'priority-medium';

        const messageEl = document.createElement('div');
        messageEl.className = `radio-message ${priorityClass}`;
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-10px)';
        
        messageEl.innerHTML = `
            <div class="msg-header">
                <span class="msg-time">${timeStr}</span>
                <span class="msg-source">[${messageData.source}]</span>
                <span class="msg-priority ${priorityClass}">${messageData.priority}</span>
            </div>
            <div class="msg-content">
                <p class="msg-text">${messageData.priority === 'STATIC' ? messageData.text : 'INTERCEPT: ' + messageData.text}</p>
            </div>
        `;

        DOM.radioFeed.appendChild(messageEl);
        
        // Animate entry
        requestAnimationFrame(() => {
            messageEl.style.transition = 'all 0.4s ease-out';
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateY(0)';
        });

        // Auto-scroll
        DOM.radioFeed.scrollTop = DOM.radioFeed.scrollHeight;

        // Limit messages
        if (DOM.radioFeed.children.length > CONFIG.maxRadioMessages) {
            DOM.radioFeed.removeChild(DOM.radioFeed.firstChild);
        }
    }

    // Initial population
    RADIO_MESSAGES.slice(0, 3).forEach(msg => addRadioMessage(msg));

    // Periodic new messages
    setInterval(() => {
        if (Math.random() > 0.4) {
            addRadioMessage();
        }
    }, CONFIG.radioInterval);

    // Radio Controls
    DOM.freqSlider.addEventListener('input', (e) => {
        DOM.freqDisplay.textContent = `${parseFloat(e.target.value).toFixed(2)} MHz`;
        updateSignalStrength();
    });

    DOM.volumeSlider.addEventListener('input', (e) => {
        // Visual feedback only for this demo
        const vol = e.target.value;
        DOM.signalFill.style.opacity = 0.3 + (vol / 100) * 0.7;
    });

    function updateSignalStrength() {
        // Simulate signal strength based on frequency proximity to "good" channels
        const freq = parseFloat(DOM.freqSlider.value);
        let strength = 50;
        
        // Sweet spots
        if (freq > 13 && freq < 15) strength = randomInt(80, 95);
        else if (freq > 22 && freq < 24) strength = randomInt(70, 85);
        else if (freq > 5 && freq < 7) strength = randomInt(60, 75);
        else strength = randomInt(10, 40);

        DOM.signalFill.style.width = `${strength}%`;
        DOM.signalNeedle.style.left = `${strength}%`;
    }

    DOM.scanBtn.addEventListener('click', () => {
        DOM.scanBtn.classList.add('active');
        DOM.scanBtn.style.borderColor = 'var(--accent-gold)';
        
        // Animate slider
        let scanInterval = setInterval(() => {
            let currentVal = parseFloat(DOM.freqSlider.value);
            let newVal = currentVal + 0.5;
            if (newVal > 30) newVal = 1;
            DOM.freqSlider.value = newVal;
            DOM.freqDisplay.textContent = `${newVal.toFixed(2)} MHz`;
            updateSignalStrength();
        }, 50);

        setTimeout(() => {
            clearInterval(scanInterval);
            DOM.scanBtn.classList.remove('active');
            DOM.scanBtn.style.borderColor = '';
            addRadioMessage({ source: 'AUTO-SCAN', priority: 'ROUTINE', text: 'SCAN COMPLETE. NO NEW HOSTILE TRAFFIC DETECTED.' });
        }, 2000);
    });

    DOM.decryptBtn.addEventListener('click', () => {
        DOM.decryptBtn.classList.add('active');
        DOM.decryptBtn.style.borderColor = 'var(--accent-gold)';
        
        addRadioMessage({ source: 'CRYPTO UNIT', priority: 'URGENT', text: 'DECRYPTING HIGH-PRIORITY MESSAGE... SUCCESS. TRANSMITTING TO COMMAND.' });
        
        setTimeout(() => {
            DOM.decryptBtn.classList.remove('active');
            DOM.decryptBtn.style.borderColor = '';
        }, 3000);
    });

    // --- DRAGGABLE UNIT MARKERS ---
    const friendlyMarkers = document.querySelectorAll('.unit-marker.friendly');
    
    friendlyMarkers.forEach(marker => {
        marker.addEventListener('mousedown', startDrag);
        
        // Tooltip events
        marker.addEventListener('mouseenter', (e) => showTooltip(e, marker));
        marker.addEventListener('mouseleave', hideTooltip);
        marker.addEventListener('mousemove', (e) => moveTooltip(e));
    });

    function startDrag(e) {
        if (e.button !== 0) return; // Only left click
        
        STATE.isDragging = true;
        STATE.draggedElement = e.currentTarget;
        STATE.draggedElement.classList.add('dragging');
        
        const rect = STATE.draggedElement.getBoundingClientRect();
        const containerRect = DOM.mapContainer.getBoundingClientRect();
        
        STATE.dragOffset.x = e.clientX - rect.left - rect.width / 2;
        STATE.dragOffset.y = e.clientY - rect.top - rect.height / 2;
        
        e.preventDefault();
    }

    document.addEventListener('mousemove', (e) => {
        if (!STATE.isDragging || !STATE.draggedElement) return;
        
        const containerRect = DOM.mapContainer.getBoundingClientRect();
        let x = e.clientX - containerRect.left - STATE.dragOffset.x;
        let y = e.clientY - containerRect.top - STATE.dragOffset.y;
        
        // Convert to percentages for responsive positioning
        let xPercent = (x / containerRect.width) * 100;
        let yPercent = (y / containerRect.height) * 100;
        
        // Constrain
        xPercent = Math.max(2, Math.min(98, xPercent));
        yPercent = Math.max(2, Math.min(98, yPercent));
        
        STATE.draggedElement.style.left = `${xPercent}%`;
        STATE.draggedElement.style.top = `${yPercent}%`;
    });

    document.addEventListener('mouseup', () => {
        if (STATE.isDragging && STATE.draggedElement) {
            STATE.draggedElement.classList.remove('dragging');
            STATE.isDragging = false;
            STATE.draggedElement = null;
        }
    });

    // --- TOOLTIP SYSTEM ---
    const TOOLTIP_DATA = {
        'alpha-1': { type: 'ARMORED DIVISION', strength: '85%', personnel: '12,400', equipment: '120 TANKS', orders: 'HOLD POSITION' },
        'bravo-3': { type: 'INFANTRY BRIGADE', strength: '62%', personnel: '4,200', equipment: 'LIGHT ARMS', orders: 'REDEPLOY TO DELTA' },
        'charlie-7': { type: 'ENGINEERING CORPS', strength: '91%', personnel: '850', equipment: 'HEAVY MACHINERY', orders: 'BRIDGE REPAIR' },
        'delta-2': { type: 'ARTILLERY BATTALION', strength: '78%', personnel: '1,100', equipment: '24 HOWITZERS', orders: 'FIRE SUPPORT' }
    };

    function showTooltip(e, marker) {
        const unitId = marker.dataset.unit;
        const data = TOOLTIP_DATA[unitId];
        if (!data) return;
        
        document.getElementById('tooltipUnitName').textContent = marker.querySelector('.marker-label').textContent;
        document.getElementById('tooltipUnitType').textContent = data.type;
        document.getElementById('tooltipStrength').textContent = data.strength;
        document.getElementById('tooltipPersonnel').textContent = data.personnel;
        document.getElementById('tooltipEquipment').textContent = data.equipment;
        document.getElementById('tooltipOrders').textContent = data.orders;
        
        DOM.unitTooltip.classList.add('visible');
        moveTooltip(e);
    }

    function moveTooltip(e) {
        DOM.unitTooltip.style.left = `${e.clientX + 15}px`;
        DOM.unitTooltip.style.top = `${e.clientY + 15}px`;
    }

    function hideTooltip() {
        DOM.unitTooltip.classList.remove('visible');
    }

    // --- CONTEXT MENU ---
    DOM.mapContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        DOM.contextMenu.style.left = `${e.clientX}px`;
        DOM.contextMenu.style.top = `${e.clientY}px`;
        DOM.contextMenu.classList.add('visible');
    });

    document.addEventListener('click', (e) => {
        if (!DOM.contextMenu.contains(e.target)) {
            DOM.contextMenu.classList.remove('visible');
        }
    });

    document.querySelectorAll('.context-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            DOM.contextMenu.classList.remove('visible');
            
            // Simulate action feedback
            addRadioMessage({ 
                source: 'COMMAND LOG', 
                priority: 'ROUTINE', 
                text: `ACTION LOGGED: ${action.toUpperCase()} REQUEST RECEIVED. PROCESSING...` 
            });
        });
    });

    // --- MAP CONTROLS ---
    DOM.gridToggle.addEventListener('click', () => {
        DOM.gridToggle.classList.toggle('active');
        DOM.gridOverlay.classList.toggle('visible');
    });

    DOM.terrainToggle.addEventListener('click', () => {
        DOM.terrainToggle.classList.toggle('active');
        const svg = document.querySelector('.terrain-svg');
        svg.style.opacity = DOM.terrainToggle.classList.contains('active') ? '0.4' : '0.8';
    });

    DOM.supplyToggle.addEventListener('click', () => {
        DOM.supplyToggle.classList.toggle('active');
        const lines = document.querySelectorAll('.supply-lines-svg path');
        const isVisible = DOM.supplyToggle.classList.contains('active');
        lines.forEach(line => {
            line.style.opacity = isVisible ? '0.6' : '0';
        });
    });

    // --- ANALOG GAUGE ANIMATION ---
    // Needle rotation helper
    function setGaugeNeedle(needleEl, arcEl, valueEl, percentage) {
        // Gauge is 180 degrees from left to right
        // 0% = -90deg, 100% = 90deg
        const rotation = -90 + (percentage / 100) * 180;
        needleEl.style.transformOrigin = '60px 60px';
        needleEl.style.transform = `rotate(${rotation}deg)`;
        
        // Update text
        valueEl.textContent = `${Math.round(percentage)}%`;
        
        // Update arc length (approximation using stroke-dasharray)
        // Circumference of semi-circle with r=45 is pi*45 ≈ 141.37
        const maxDash = 141;
        const dashLen = (percentage / 100) * maxDash;
        arcEl.style.strokeDasharray = `${dashLen} ${maxDash}`;
    }

    // Initial set
    setGaugeNeedle(DOM.steelNeedle, DOM.steelGaugeArc, DOM.steelValue, 72);
    setGaugeNeedle(DOM.fuelNeedle, DOM.fuelGaugeArc, DOM.fuelValue, 58);
    setGaugeNeedle(DOM.ammoNeedle, DOM.ammoGaugeArc, DOM.ammoValue, 85);

    // Fluctuation
    let gaugeState = { steel: 72, fuel: 58, ammo: 85 };
    
    setInterval(() => {
        // Random walk
        gaugeState.steel = Math.max(60, Math.min(90, gaugeState.steel + randomFloat(-2, 2)));
        gaugeState.fuel = Math.max(40, Math.min(75, gaugeState.fuel + randomFloat(-1.5, 1.5)));
        gaugeState.ammo = Math.max(70, Math.min(95, gaugeState.ammo + randomFloat(-1, 1)));
        
        setGaugeNeedle(DOM.steelNeedle, DOM.steelGaugeArc, DOM.steelValue, gaugeState.steel);
        setGaugeNeedle(DOM.fuelNeedle, DOM.fuelGaugeArc, DOM.fuelValue, gaugeState.fuel);
        setGaugeNeedle(DOM.ammoNeedle, DOM.ammoGaugeArc, DOM.ammoValue, gaugeState.ammo);
    }, CONFIG.gaugeFluctuationInterval);

    // --- PROPAGANDA POSTER ROTATION ---
    const POSTERS = [
        {
            title: 'VICTORY DEMANDS SACRIFICE',
            slogan: 'EVERY WORKER A SOLDIER — EVERY FACTORY A FORTRESS',
            svg: `<path d="M 40 70 L 100 30 L 160 70" fill="none" stroke="#8a6a3a" stroke-width="3"/><circle cx="100" cy="40" r="15" fill="none" stroke="#c4a94d" stroke-width="2"/><text x="100" y="45" text-anchor="middle" fill="#c4a94d" font-size="14" font-family="Russo One">★</text>`
        },
        {
            title: 'SILENCE IS SECURITY',
            slogan: 'LOOSE LIPS SINK SHIPS — GUARD YOUR TONGUE',
            svg: `<rect x="60" y="30" width="80" height="40" rx="5" fill="none" stroke="#c4a94d" stroke-width="2"/><path d="M 80 50 L 90 60 L 120 35" fill="none" stroke="#8a6a3a" stroke-width="3"/><circle cx="70" cy="40" r="3" fill="#c4a94d"/>`
        },
        {
            title: 'PRODUCE FOR THE FRONT',
            slogan: 'THE LINE HOLDS BECAUSE YOU DELIVER',
            svg: `<path d="M 50 60 L 80 40 L 110 60 L 150 60" fill="none" stroke="#c4a94d" stroke-width="2"/><circle cx="65" cy="65" r="5" fill="#8a6a3a"/><circle cx="135" cy="65" r="5" fill="#8a6a3a"/><rect x="75" y="40" width="10" height="15" fill="#c4a94d"/>`
        }
    ];

    function rotatePoster() {
        STATE.currentPosterIndex = (STATE.currentPosterIndex + 1) % POSTERS.length;
        const poster = POSTERS[STATE.currentPosterIndex];
        const content = DOM.posterFrame.querySelector('.poster-content');
        
        // Fade out
        content.style.transition = 'opacity 0.5s ease';
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.querySelector('.poster-title').textContent = poster.title;
            content.querySelector('.poster-slogan').textContent = poster.slogan;
            content.querySelector('.poster-graphic').innerHTML = poster.svg;
            
            // Fade in
            content.style.opacity = '1';
        }, 500);
    }

    setInterval(rotatePoster, CONFIG.posterRotationInterval);

    // --- INITIALIZATION ---
    console.log('WAR ROOM SYSTEM INITIALIZED. ALL SYSTEMS NOMINAL.');
    updateSignalStrength();
});
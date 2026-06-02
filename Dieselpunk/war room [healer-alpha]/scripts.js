/* =====================================================
   COMMAND BUNKER OMEGA-7 - INTERACTIVE WAR ROOM
   1940s Alternate History Military Command Center
   ===================================================== */

// === CONFIGURATION ===
const CONFIG = {
    // Radio intercept messages
    radioMessages: {
        channelA: [
            "INTERCEPT: ENEMY CONVOY MOVING SOUTH ON HIGHWAY 7... GRID REF G-12...",
            "BREAKING: FRENCH RESISTANCE REPORTS ENEMY TROOP BUILDUP NEAR OAKHAVEN...",
            "UPDATE: AIR RECONFIRMS BRIDGE DEMOLITION AT RIVER CROSSING ALPHA...",
            "URGENT: GERMAN PANZER DIVISION SPOTTED MOVING TOWARDS SECTOR D-8...",
            "INTEL: ENEMY RADIO TRAFFIC INDICATES MAJOR OFFENSIVE PLANNED FOR DAWN...",
            "ALERT: SUBMARINE ACTIVITY DETECTED IN CHANNEL APPROACHES...",
            "REPORT: RESISTANCE CELL COMPROMISED IN EISENSTADT... SWITCH TO PLAN B...",
            "INTERCEPT: LUFTWAFFE REDEPLOYING FIGHTERS TO EASTERN FRONT..."
        ],
        channelB: [
            "WEATHER: HEAVY FOG EXPECTED OVER ENGLISH CHANNEL... 0600-1200...",
            "SUPPLY: MUNITIONS SHIPMENT DELAYED... ETA NOW 48 HOURS...",
            "PERSONNEL: 500 REPLACEMENTS EN ROUTE TO 12TH ARMORED DIVISION...",
            "MAINTENANCE: TANK REPAIRS 75% COMPLETE... READY BY 0800...",
            "INTELLIGENCE: CAPTURED ENEMY DOCUMENTS BEING ANALYZED...",
            "MEDICAL: FIELD HOSPITAL AT CAPACITY... REQUESTING ADDITIONAL AMBULANCES...",
            "COMMS: RADIO RELAY STATION CHARLIE OFFLINE... TECH CREWS DISPATCHED...",
            "TRANSPORT: CONVOY OMEGA-7 DELAYED BY ROAD CONDITIONS..."
        ],
        channelC: [
            "COMMAND: GENERAL BLACKWOOD SCHEDULED FOR BRIEFING AT 0600...",
            "SECURITY: PERIMETER PATROLS INCREASED... UNKNOWN CONTACTS REPORTED...",
            "LOGISTICS: FUEL RESERVES AT 62%... PRIORITY TO ARMORED UNITS...",
            "RECON: PHOTOGRAPHS FROM OPERATION OVERLORD BEING DEVELOPED...",
            "DIPLOMATIC: ALLIED LIAISON OFFICERS ARRIVING 1400...",
            "TRAINING: NEW ANTI-TANK TACTICS TO BE IMPLEMENTED...",
            "INTELLIGENCE: ENCRYPTED MESSAGE RECEIVED FROM MOSCOW...",
            "ALERT: POSSIBLE ESPIONAGE ACTIVITY IN SECTOR 7..."
        ]
    },

    // Field report messages
    fieldReports: [
        { source: "RECON WING", text: "Enemy artillery positions identified in grid F-9.", urgent: false },
        { source: "12th ARMORED", text: "Engaging enemy armor near Bridgeport. Requesting air support.", urgent: true },
        { source: "5th INFANTRY", text: "Secured crossroads at grid B-4. Enemy retreating east.", urgent: false },
        { source: "NAVY LIAISON", text: "U-boat activity reported in sector 4. Convoys rerouted.", urgent: true },
        { source: "SPECIAL FORCES", text: "Sabotage mission complete. Enemy supply depot destroyed.", urgent: false },
        { source: "INTELLIGENCE", text: "Decoded message: Enemy reserves moving to front line.", urgent: true },
        { source: "ENGINEERS", text: "Bridge repairs on route K-14 completed ahead of schedule.", urgent: false },
        { source: "AIR DEFENSE", text: "Enemy bombers detected 50 miles out. Alert status raised.", urgent: true }
    ],

    // Propaganda poster rotation
    propagandaPosters: [
        {
            icon: "⭐",
            headline: "THE ENEMY",
            subline: "MUST BE DEFEATED",
            call: "RALLY TO THE CAUSE",
            footer: "ALLIED FORCES HIGH COMMAND"
        },
        {
            icon: "✊",
            headline: "VICTORY",
            subline: "IS CERTAIN",
            call: "DO YOUR PART",
            footer: "HOME FRONT COMMAND"
        },
        {
            icon: "🏭",
            headline: "PRODUCE",
            subline: "FOR VICTORY",
            call: "EVERY SHELL COUNTS",
            footer: "WAR PRODUCTION BOARD"
        },
        {
            icon: "🛡️",
            headline: "DEFEND",
            subline: "OUR FREEDOM",
            call: "STAND FIRM",
            footer: "CIVIL DEFENSE CORPS"
        },
        {
            icon: "✈️",
            headline: "AIR POWER",
            subline: "WINS WARS",
            call: "BUILD MORE PLANES",
            footer: "ARMY AIR FORCES"
        }
    ],

    // Unit names for deployment
    unitNames: {
        infantry: ["1st INF", "2nd INF", "3rd INF", "4th INF", "5th INF", "6th INF"],
        armor: ["1st ARM", "2nd ARM", "3rd ARM", "4th ARM", "5th ARM"],
        artillery: ["1st ART", "2nd ART", "3rd ART", "4th ART", "5th ART"],
        air: ["TAC-1", "TAC-2", "TAC-3", "TAC-4", "TAC-5"],
        naval: ["NAV-1", "NAV-2", "NAV-3", "NAV-4"]
    },

    // Grid coordinates for map
    gridColumns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    gridRows: ['1', '2', '3', '4', '5', '6']
};

// === STATE MANAGEMENT ===
const STATE = {
    currentChannel: 'A',
    currentSide: 'allied',
    mapZoom: 1,
    gridVisible: true,
    deployedUnits: [],
    unitCounter: 0,
    gaugeValues: {
        steel: 78,
        oil: 62,
        manpower: 91,
        munitions: 54
    },
    threatLevel: 3,
    audioEnabled: true,
    posterIndex: 0
};

// === DOM ELEMENTS ===
const DOM = {
    // Time displays
    currentDate: document.getElementById('current-date'),
    zuluTime: document.getElementById('zulu-time'),
    countdown: document.getElementById('countdown'),
    
    // Radio elements
    interceptLog: document.getElementById('intercept-log'),
    currentFreq: document.getElementById('current-freq'),
    signalStrength: document.getElementById('signal-strength'),
    
    // Map elements
    strategyMap: document.getElementById('strategy-map'),
    gridOverlay: document.getElementById('grid-overlay'),
    unitTokens: document.getElementById('unit-tokens'),
    
    // Gauges
    needleSteel: document.getElementById('needle-steel'),
    needleOil: document.getElementById('needle-oil'),
    needleManpower: document.getElementById('needle-manpower'),
    needleMunitions: document.getElementById('needle-munitions'),
    
    valueSteel: document.getElementById('value-steel'),
    valueOil: document.getElementById('value-oil'),
    valueManpower: document.getElementById('value-manpower'),
    valueMunitions: document.getElementById('value-munitions'),
    
    // Controls
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    gridToggle: document.getElementById('grid-toggle'),
    clearUnits: document.getElementById('clear-units'),
    
    // Channel buttons
    channelButtons: document.querySelectorAll('.channel-btn'),
    
    // Side toggles
    alliedToggle: document.getElementById('allied-toggle'),
    enemyToggle: document.getElementById('enemy-toggle'),
    
    // Poster elements
    posterShowcase: document.getElementById('poster-showcase'),
    closePoster: document.getElementById('close-poster'),
    posterFrames: document.querySelectorAll('.poster-frame'),
    
    // Audio indicator
    audioIndicator: document.getElementById('audio-indicator'),
    
    // Tooltip
    unitTooltip: document.getElementById('unit-tooltip'),
    tooltipUnitName: document.getElementById('tooltip-unit-name'),
    tooltipUnitType: document.getElementById('tooltip-unit-type'),
    tooltipUnitStatus: document.getElementById('tooltip-unit-status'),
    tooltipUnitPos: document.getElementById('tooltip-unit-pos'),
    
    // Threat level
    threatDots: document.querySelectorAll('#threat-level .alert-dot'),
    alertText: document.querySelector('.alert-text')
};

// === UTILITY FUNCTIONS ===
const UTILS = {
    // Format time with leading zeros
    padZero: (num) => num.toString().padStart(2, '0'),
    
    // Get random number between min and max (inclusive)
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Get random element from array
    randomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    // Get current grid position from coordinates
    getGridPosition: (x, y) => {
        const colIndex = Math.floor(x / 100);
        const rowIndex = Math.floor(y / 100);
        const col = CONFIG.gridColumns[colIndex] || '?';
        const row = CONFIG.gridRows[rowIndex] || '?';
        return `${col}-${row}`;
    },
    
    // Convert timestamp to 1940s format
    formatTimestamp1940s: (date) => {
        const hours = UTILS.padZero(date.getHours());
        const minutes = UTILS.padZero(date.getMinutes());
        const seconds = UTILS.padZero(date.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    },
    
    // Get current date in 1940s format
    getCurrentDate1940s: () => {
        const date = new Date();
        const day = UTILS.padZero(date.getDate());
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = months[date.getMonth()];
        const year = '1944'; // Alternate history year
        return `${day} ${month} ${year}`;
    },
    
    // Create element with class and content
    createElement: (tag, className, textContent = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    },
    
    // Shake effect for elements
    shakeElement: (element, intensity = 5, duration = 300) => {
        const originalTransform = element.style.transform;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        animate();
    },
    
    // Play a simple beep sound (using Web Audio API)
    playBeep: (frequency = 800, duration = 100) => {
        if (!STATE.audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.log('Audio not supported');
        }
    },
    
    // Radio static sound
    playStaticSound: () => {
        if (!STATE.audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.05;
            
            noise.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            noise.start();
            
            setTimeout(() => {
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                setTimeout(() => noise.stop(), 100);
            }, 200);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
};

// === TIME MANAGEMENT ===
const TimeManager = {
    updateInterval: null,
    countdownTarget: null,
    
    init: function() {
        // Set initial countdown target (3 hours from now)
        this.countdownTarget = new Date();
        this.countdownTarget.setHours(this.countdownTarget.getHours() + 3);
        
        // Update immediately
        this.updateAll();
        
        // Set interval for updates
        this.updateInterval = setInterval(() => this.updateAll(), 1000);
    },
    
    updateAll: function() {
        this.updateDateTime();
        this.updateCountdown();
    },
    
    updateDateTime: function() {
        const now = new Date();
        
        // Update date (always show 1944 for alternate history)
        DOM.currentDate.textContent = UTILS.getCurrentDate1940s();
        
        // Update Zulu time (simulated, not real UTC)
        const zuluHour = (now.getUTCHours() + 4) % 24; // Offset for alternate timezone
        const zuluTime = `${UTILS.padZero(zuluHour)}:${UTILS.padZero(now.getUTCMinutes())}:${UTILS.padZero(now.getUTCSeconds())}`;
        DOM.zuluTime.textContent = zuluTime;
    },
    
    updateCountdown: function() {
        const now = new Date();
        const diff = this.countdownTarget - now;
        
        if (diff <= 0) {
            // Reset countdown to 3 hours when it reaches 0
            this.countdownTarget = new Date(now.getTime() + 3 * 60 * 60 * 1000);
            UTILS.playBeep(1200, 300); // Alert beep
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        DOM.countdown.textContent = `${UTILS.padZero(hours)}:${UTILS.padZero(minutes)}:${UTILS.padZero(seconds)}`;
    },
    
    // Add time to countdown (for interactions)
    addTime: function(minutes) {
        this.countdownTarget = new Date(this.countdownTarget.getTime() + minutes * 60 * 1000);
        this.updateCountdown();
        UTILS.playBeep(600, 100);
    }
};

// === RADIO INTERCEPT SYSTEM ===
const RadioSystem = {
    lastMessageTime: 0,
    messageInterval: 8000, // 8 seconds between messages
    
    init: function() {
        // Add initial messages
        this.addInitialMessages();
        
        // Set up channel switching
        DOM.channelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchChannel(e.target.dataset.channel);
                UTILS.playBeep(400, 50);
            });
        });
        
        // Start message generation
        setInterval(() => this.generateNewMessage(), this.messageInterval);
        
        // Random signal strength updates
        setInterval(() => this.updateSignalStrength(), 3000);
    },
    
    addInitialMessages: function() {
        // Clear existing
        DOM.interceptLog.innerHTML = '';
        
        // Add 3 initial messages
        for (let i = 0; i < 3; i++) {
            this.addMessage(UTILS.randomElement(CONFIG.radioMessages.channelA), false);
        }
    },
    
    switchChannel: function(channel) {
        if (channel === STATE.currentChannel) return;
        
        STATE.currentChannel = channel;
        
        // Update UI
        DOM.channelButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.channel === channel);
        });
        
        // Update frequency display
        const frequencies = { A: '3847.2 kHz', B: '4123.5 kHz', C: '5678.9 kHz' };
        DOM.currentFreq.textContent = frequencies[channel];
        
        // Clear and add new messages for this channel
        DOM.interceptLog.innerHTML = '';
        this.addInitialMessages();
        
        // Play static sound
        UTILS.playStaticSound();
    },
    
    generateNewMessage: function() {
        const channelKey = `channel${STATE.currentChannel}`;
        const messages = CONFIG.radioMessages[channelKey];
        const message = UTILS.randomElement(messages);
        
        this.addMessage(message, true);
        
        // Randomly update threat level
        if (Math.random() < 0.1) {
            ThreatManager.updateRandomly();
        }
    },
    
    addMessage: function(message, playSound = true) {
        const entry = UTILS.createElement('div', 'intercept-entry');
        
        // Add timestamp
        const timestamp = UTILS.createElement('span', 'timestamp', `[${UTILS.formatTimestamp1940s(new Date())}] `);
        entry.appendChild(timestamp);
        
        // Add message content (sometimes with encrypted parts)
        if (Math.random() < 0.3) {
            // Add encrypted section
            const parts = message.split(' ');
            const encryptedIndex = UTILS.randomInt(1, parts.length - 1);
            const encryptedText = Array.from({length: 8}, () => 
                String.fromCharCode(UTILS.randomInt(65, 90))
            ).join('');
            
            for (let i = 0; i < parts.length; i++) {
                if (i === encryptedIndex) {
                    const encryptedSpan = UTILS.createElement('span', 'encrypted', `[${encryptedText}] `);
                    entry.appendChild(encryptedSpan);
                } else {
                    entry.appendChild(document.createTextNode(parts[i] + ' '));
                }
            }
        } else {
            entry.appendChild(document.createTextNode(message));
        }
        
        // Add to log
        DOM.interceptLog.appendChild(entry);
        
        // Auto-scroll to bottom
        DOM.interceptLog.scrollTop = DOM.interceptLog.scrollHeight;
        
        // Keep only last 20 messages
        while (DOM.interceptLog.children.length > 20) {
            DOM.interceptLog.removeChild(DOM.interceptLog.firstChild);
        }
        
        // Play sound effect
        if (playSound && STATE.audioEnabled) {
            UTILS.playBeep(300, 50);
            setTimeout(() => UTILS.playBeep(400, 50), 100);
        }
    },
    
    updateSignalStrength: function() {
        // Random signal strength between 40% and 95%
        const strength = UTILS.randomInt(40, 95);
        DOM.signalStrength.style.width = `${strength}%`;
        
        // Change color based on strength
        if (strength < 60) {
            DOM.signalStrength.style.background = `linear-gradient(90deg, 
                var(--alert-amber) 0%, 
                var(--alert-amber) 60%, 
                var(--alert-red) 100%)`;
        } else {
            DOM.signalStrength.style.background = `linear-gradient(90deg, 
                var(--alert-green) 0%, 
                var(--alert-green) 60%, 
                var(--alert-amber) 80%, 
                var(--alert-red) 100%)`;
        }
    }
};

// === GAUGE SYSTEM ===
const GaugeSystem = {
    animationIntervals: [],
    
    init: function() {
        // Initialize gauges with current values
        this.updateAllGauges();
        
        // Start gauge animations
        this.startGaugeAnimations();
    },
    
    updateAllGauges: function() {
        this.updateGauge('steel', STATE.gaugeValues.steel);
        this.updateGauge('oil', STATE.gaugeValues.oil);
        this.updateGauge('manpower', STATE.gaugeValues.manpower);
        this.updateGauge('munitions', STATE.gaugeValues.munitions);
    },
    
    updateGauge: function(type, value) {
        // Clamp value between 0 and 100
        value = Math.max(0, Math.min(100, value));
        STATE.gaugeValues[type] = value;
        
        // Calculate needle rotation (-45deg to 45deg for 0% to 100%)
        const rotation = (value / 100) * 90 - 45;
        
        // Update needle
        const needle = DOM[`needle${type.charAt(0).toUpperCase() + type.slice(1)}`];
        if (needle) {
            needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        }
        
        // Update value display
        const valueDisplay = DOM[`value${type.charAt(0).toUpperCase() + type.slice(1)}`];
        if (valueDisplay) {
            valueDisplay.textContent = `${Math.round(value)}%`;
            
            // Change color based on value
            if (value < 40) {
                valueDisplay.style.color = 'var(--alert-red)';
                valueDisplay.style.textShadow = '0 0 8px rgba(153, 51, 51, 0.5)';
            } else if (value < 70) {
                valueDisplay.style.color = 'var(--alert-amber)';
                valueDisplay.style.textShadow = '0 0 8px rgba(170, 119, 34, 0.5)';
            } else {
                valueDisplay.style.color = 'var(--alert-green)';
                valueDisplay.style.textShadow = '0 0 8px rgba(68, 119, 68, 0.5)';
            }
        }
    },
    
    startGaugeAnimations: function() {
        // Clear existing intervals
        this.animationIntervals.forEach(interval => clearInterval(interval));
        this.animationIntervals = [];
        
        // Animate each gauge with different intervals
        const gauges = ['steel', 'oil', 'manpower', 'munitions'];
        
        gauges.forEach((gauge, index) => {
            const interval = setInterval(() => {
                // Random fluctuation between -3 and +3
                const fluctuation = (Math.random() - 0.5) * 6;
                let newValue = STATE.gaugeValues[gauge] + fluctuation;
                
                // Clamp to reasonable ranges
                newValue = Math.max(30, Math.min(95, newValue));
                
                this.updateGauge(gauge, newValue);
            }, 2000 + index * 500); // Stagger updates
            
            this.animationIntervals.push(interval);
        });
    },
    
    // Simulate resource consumption
    consumeResources: function() {
        // Decrease resources randomly
        const decrease = Math.random() * 2;
        
        ['steel', 'oil', 'munitions'].forEach(resource => {
            const newValue = STATE.gaugeValues[resource] - decrease * Math.random();
            this.updateGauge(resource, Math.max(20, newValue));
        });
        
        // Manpower fluctuates differently
        if (Math.random() < 0.3) {
            const manpowerChange = (Math.random() - 0.3) * 5; // More likely to decrease
            const newManpower = STATE.gaugeValues.manpower + manpowerChange;
            this.updateGauge('manpower', Math.max(40, Math.min(100, newManpower)));
        }
    }
};

// === MAP AND UNIT MANAGEMENT ===
const MapSystem = {
    draggedElement: null,
    dragOffset: { x: 0, y: 0 },
    unitCounter: 0,
    
    init: function() {
        this.setupDragAndDrop();
        this.setupMapControls();
        this.setupPalette();
        this.initializeUnits();
        
        // Randomly move enemy units occasionally
        setInterval(() => this.moveRandomEnemyUnit(), 15000);
    },
    
    setupDragAndDrop: function() {
        // For existing units
        document.querySelectorAll('.unit-token').forEach(unit => {
            this.setupUnitDragging(unit);
        });
        
        // For palette units
        document.querySelectorAll('.palette-unit').forEach(unit => {
            unit.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('unitType', unit.dataset.type);
                e.dataTransfer.setData('source', 'palette');
                unit.style.opacity = '0.5';
            });
            
            unit.addEventListener('dragend', (e) => {
                unit.style.opacity = '1';
            });
        });
        
        // Map drop zone
        DOM.strategyMap.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        DOM.strategyMap.addEventListener('drop', (e) => {
            e.preventDefault();
            const unitType = e.dataTransfer.getData('unitType');
            const source = e.dataTransfer.getData('source');
            
            if (source === 'palette' && unitType) {
                // Get drop position relative to map
                const rect = DOM.strategyMap.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.deployUnit(unitType, x, y);
                UTILS.playBeep(500, 100);
            }
        });
        
        // Map click to deselect
        DOM.strategyMap.addEventListener('click', (e) => {
            if (e.target === DOM.strategyMap || e.target.classList.contains('grid-overlay')) {
                this.deselectAllUnits();
            }
        });
    },
    
    setupUnitDragging: function(unit) {
        unit.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.draggedElement = unit;
            
            // Get position
            const rect = unit.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            // Add dragging class
            unit.classList.add('dragging');
            unit.style.zIndex = '100';
            
            // Show tooltip
            this.showUnitTooltip(unit, e.clientX, e.clientY);
        });
        
        // Unit click for selection
        unit.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectUnit(unit);
        });
        
        // Unit hover for tooltip
        unit.addEventListener('mouseenter', (e) => {
            this.showUnitTooltip(unit, e.clientX, e.clientY);
        });
        
        unit.addEventListener('mouseleave', () => {
            this.hideUnitTooltip();
        });
    },
    
    initializeUnits: function() {
        // Count initial units
        this.unitCounter = document.querySelectorAll('.unit-token').length;
    },
    
    deployUnit: function(type, x, y) {
        // Snap to grid
        const gridSize = 100;
        const snappedX = Math.round(x / gridSize) * gridSize;
        const snappedY = Math.round(y / gridSize) * gridSize;
        
        // Get unit name
        const unitNames = CONFIG.unitNames[type] || ['UNKNOWN'];
        const unitName = UTILS.randomElement(unitNames);
        
        // Create unit element
        const unit = UTILS.createElement('div', `unit-token ${STATE.currentSide} ${type}`);
        unit.draggable = true;
        unit.dataset.type = type;
        unit.dataset.unit = `${unitName} ${type.toUpperCase()}`;
        
        // Position
        unit.style.left = `${snappedX}px`;
        unit.style.top = `${snappedY}px`;
        
        // Icon
        const icon = UTILS.createElement('div', 'token-icon');
        const iconSymbols = {
            infantry: '▲',
            armor: '◆',
            artillery: '●',
            air: '✦',
            naval: '◆'
        };
        icon.textContent = iconSymbols[type] || '?';
        
        // Label
        const label = UTILS.createElement('div', 'token-label', unitName);
        
        // Assemble
        unit.appendChild(icon);
        unit.appendChild(label);
        
        // Add to map
        DOM.unitTokens.appendChild(unit);
        
        // Setup dragging
        this.setupUnitDragging(unit);
        
        // Animation
        unit.style.transform = 'scale(0)';
        setTimeout(() => {
            unit.style.transform = 'scale(1)';
            unit.style.transition = 'transform 0.3s ease-out';
        }, 10);
        
        // Update counter
        this.unitCounter++;
        
        // Log deployment
        FieldReportsSystem.addReport({
            source: "COMMAND",
            text: `${unitName} ${type.toUpperCase()} deployed to grid ${UTILS.getGridPosition(snappedX, snappedY)}.`,
            urgent: false
        });
    },
    
    selectUnit: function(unit) {
        this.deselectAllUnits();
        unit.classList.add('selected');
        unit.style.boxShadow = '0 0 15px rgba(255, 200, 50, 0.7)';
        
        UTILS.playBeep(700, 50);
    },
    
    deselectAllUnits: function() {
        document.querySelectorAll('.unit-token.selected').forEach(unit => {
            unit.classList.remove('selected');
            unit.style.boxShadow = '';
        });
    },
    
    showUnitTooltip: function(unit, x, y) {
        DOM.tooltipUnitName.textContent = unit.dataset.unit || 'UNKNOWN';
        DOM.tooltipUnitType.textContent = unit.dataset.type ? unit.dataset.type.toUpperCase() : 'UNKNOWN';
        DOM.tooltipUnitStatus.textContent = unit.classList.contains('enemy') ? 'HOSTILE' : 'FRIENDLY';
        
        // Calculate grid position
        const left = parseInt(unit.style.left) || 0;
        const top = parseInt(unit.style.top) || 0;
        DOM.tooltipUnitPos.textContent = UTILS.getGridPosition(left, top);
        
        // Position tooltip
        DOM.unitTooltip.style.left = `${x + 15}px`;
        DOM.unitTooltip.style.top = `${y + 15}px`;
        DOM.unitTooltip.classList.add('active');
    },
    
    hideUnitTooltip: function() {
        DOM.unitTooltip.classList.remove('active');
    },
    
    moveRandomEnemyUnit: function() {
        // Get all enemy units
        const enemyUnits = document.querySelectorAll('.unit-token.enemy');
        if (enemyUnits.length === 0) return;
        
        // Pick random enemy unit
        const randomUnit = enemyUnits[Math.floor(Math.random() * enemyUnits.length)];
        
        // Move it slightly
        const currentLeft = parseInt(randomUnit.style.left) || 0;
        const currentTop = parseInt(randomUnit.style.top) || 0;
        
        const newLeft = currentLeft + (Math.random() - 0.5) * 40;
        const newTop = currentTop + (Math.random() - 0.5) * 40;
        
        // Animate movement
        randomUnit.style.transition = 'left 2s, top 2s';
        randomUnit.style.left = `${newLeft}px`;
        randomUnit.style.top = `${newTop}px`;
        
        // Show movement in field reports
        if (Math.random() < 0.3) {
            FieldReportsSystem.addReport({
                source: "RECON",
                text: `Enemy ${randomUnit.dataset.type} unit observed moving to grid ${UTILS.getGridPosition(newLeft, newTop)}.`,
                urgent: false
            });
        }
    },
    
    setupMapControls: function() {
        // Zoom controls
        DOM.zoomIn.addEventListener('click', () => {
            STATE.mapZoom = Math.min(1.5, STATE.mapZoom + 0.1);
            DOM.strategyMap.style.transform = `scale(${STATE.mapZoom})`;
            UTILS.playBeep(600, 50);
        });
        
        DOM.zoomOut.addEventListener('click', () => {
            STATE.mapZoom = Math.max(0.5, STATE.mapZoom - 0.1);
            DOM.strategyMap.style.transform = `scale(${STATE.mapZoom})`;
            UTILS.playBeep(400, 50);
        });
        
        // Grid toggle
        DOM.gridToggle.addEventListener('click', () => {
            STATE.gridVisible = !STATE.gridVisible;
            DOM.gridOverlay.classList.toggle('hidden', !STATE.gridVisible);
            DOM.gridToggle.style.background = STATE.gridVisible ? 'var(--olive-mid)' : 'var(--steel-mid)';
            UTILS.playBeep(500, 50);
        });
        
        // Clear units
        DOM.clearUnits.addEventListener('click', () => {
            if (confirm('Clear all deployed units from the map?')) {
                // Keep only enemy units
                document.querySelectorAll('.unit-token.allied').forEach(unit => {
                    unit.style.transform = 'scale(0)';
                    setTimeout(() => unit.remove(), 300);
                });
                
                // Reset counter
                this.unitCounter = document.querySelectorAll('.unit-token').length;
                
                FieldReportsSystem.addReport({
                    source: "COMMAND",
                    text: "All allied units have been recalled from the map.",
                    urgent: false
                });
                
                UTILS.playBeep(300, 150);
            }
        });
        
        // Map panning with mouse drag
        let isPanning = false;
        let panStart = { x: 0, y: 0 };
        let mapOffset = { x: 0, y: 0 };
        
        DOM.strategyMap.addEventListener('mousedown', (e) => {
            if (e.target === DOM.strategyMap || e.target.classList.contains('grid-overlay')) {
                isPanning = true;
                panStart = { x: e.clientX, y: e.clientY };
                DOM.strategyMap.style.cursor = 'grabbing';
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            // Handle unit dragging
            if (this.draggedElement) {
                const rect = DOM.strategyMap.getBoundingClientRect();
                const x = e.clientX - rect.left - this.dragOffset.x;
                const y = e.clientY - rect.top - this.dragOffset.y;
                
                // Snap to grid
                const gridSize = 100;
                const snappedX = Math.round(x / gridSize) * gridSize;
                const snappedY = Math.round(y / gridSize) * gridSize;
                
                this.draggedElement.style.left = `${snappedX}px`;
                this.draggedElement.style.top = `${snappedY}px`;
                
                // Update tooltip
                this.showUnitTooltip(this.draggedElement, e.clientX, e.clientY);
            }
            
            // Handle map panning
            if (isPanning) {
                const dx = e.clientX - panStart.x;
                const dy = e.clientY - panStart.y;
                
                // Note: Actual panning would require more complex implementation
                // This is a simplified version
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.draggedElement) {
                this.draggedElement.classList.remove('dragging');
                this.draggedElement.style.zIndex = '10';
                this.draggedElement = null;
            }
            
            if (isPanning) {
                isPanning = false;
                DOM.strategyMap.style.cursor = '';
            }
        });
    },
    
    setupPalette: function() {
        // Side toggles
        DOM.alliedToggle.addEventListener('click', () => {
            STATE.currentSide = 'allied';
            DOM.alliedToggle.classList.add('active');
            DOM.enemyToggle.classList.remove('active');
            UTILS.playBeep(500, 50);
        });
        
        DOM.enemyToggle.addEventListener('click', () => {
            STATE.currentSide = 'enemy';
            DOM.enemyToggle.classList.add('active');
            DOM.alliedToggle.classList.remove('active');
            UTILS.playBeep(500, 50);
        });
    }
};

// === FIELD REPORTS SYSTEM ===
const FieldReportsSystem = {
    reportsLog: document.getElementById('reports-log'),
    reportInterval: 15000, // 15 seconds
    
    init: function() {
        // Start generating reports
        setInterval(() => this.generateRandomReport(), this.reportInterval);
    },
    
    generateRandomReport: function() {
        const report = UTILS.randomElement(CONFIG.fieldReports);
        this.addReport(report);
    },
    
    addReport: function(report) {
        const entry = UTILS.createElement('div', `report-entry ${report.urgent ? 'urgent' : ''}`);
        
        // Time
        const time = UTILS.createElement('span', 'report-time', UTILS.formatTimestamp1940s(new Date()));
        entry.appendChild(time);
        
        // Source
        const source = UTILS.createElement('span', 'report-source', `[${report.source}]`);
        entry.appendChild(source);
        
        // Text
        const text = UTILS.createElement('p', 'report-text', report.text);
        entry.appendChild(text);
        
        // Add to log
        this.reportsLog.insertBefore(entry, this.reportsLog.firstChild);
        
        // Keep only last 10 reports
        while (this.reportsLog.children.length > 10) {
            this.reportsLog.removeChild(this.reportsLog.lastChild);
        }
        
        // Sound effect for urgent reports
        if (report.urgent) {
            UTILS.shakeElement(entry, 3, 500);
            UTILS.playBeep(800, 100);
            setTimeout(() => UTILS.playBeep(1000, 100), 150);
        }
    }
};

// === THREAT LEVEL SYSTEM ===
const ThreatManager = {
    updateRandomly: function() {
        // Randomly change threat level
        const change = Math.random() < 0.7 ? 1 : -1; // More likely to increase
        STATE.threatLevel = Math.max(1, Math.min(5, STATE.threatLevel + change));
        
        this.updateThreatDisplay();
        
        // Sound effect for threat change
        if (change > 0) {
            UTILS.playBeep(1000, 150);
        } else {
            UTILS.playBeep(400, 150);
        }
    },
    
    updateThreatDisplay: function() {
        // Update dots
        DOM.threatDots.forEach((dot, index) => {
            dot.classList.toggle('active', index < STATE.threatLevel);
        });
        
        // Update text
        const threatTexts = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'SEVERE'];
        DOM.alertText.textContent = threatTexts[STATE.threatLevel - 1] || 'UNKNOWN';
        
        // Change color based on level
        if (STATE.threatLevel <= 2) {
            DOM.alertText.style.color = 'var(--alert-green)';
        } else if (STATE.threatLevel <= 3) {
            DOM.alertText.style.color = 'var(--alert-amber)';
        } else {
            DOM.alertText.style.color = 'var(--alert-red)';
        }
    }
};

// === PROPAGANDA POSTER SYSTEM ===
const PosterSystem = {
    rotationInterval: 20000, // 20 seconds
    
    init: function() {
        // Click handlers for poster frames
        DOM.posterFrames.forEach((frame, index) => {
            frame.addEventListener('click', () => {
                this.openPosterShowcase(index);
                UTILS.playBeep(600, 100);
            });
        });
        
        // Close button
        DOM.closePoster.addEventListener('click', () => {
            this.closePosterShowcase();
            UTILS.playBeep(400, 100);
        });
        
        // Click outside to close
        DOM.posterShowcase.addEventListener('click', (e) => {
            if (e.target === DOM.posterShowcase) {
                this.closePosterShowcase();
            }
        });
        
        // Auto-rotate posters in showcase
        setInterval(() => this.rotatePoster(), this.rotationInterval);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (DOM.posterShowcase.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closePosterShowcase();
                } else if (e.key === 'ArrowRight') {
                    this.nextPoster();
                } else if (e.key === 'ArrowLeft') {
                    this.prevPoster();
                }
            }
        });
    },
    
    openPosterShowcase: function(index = 0) {
        STATE.posterIndex = index;
        this.updatePosterContent();
        DOM.posterShowcase.classList.add('active');
    },
    
    closePosterShowcase: function() {
        DOM.posterShowcase.classList.remove('active');
    },
    
    rotatePoster: function() {
        if (DOM.posterShowcase.classList.contains('active')) {
            this.nextPoster();
        }
    },
    
    nextPoster: function() {
        STATE.posterIndex = (STATE.posterIndex + 1) % CONFIG.propagandaPosters.length;
        this.updatePosterContent();
        UTILS.playBeep(500, 50);
    },
    
    prevPoster: function() {
        STATE.posterIndex = (STATE.posterIndex - 1 + CONFIG.propagandaPosters.length) % CONFIG.propagandaPosters.length;
        this.updatePosterContent();
        UTILS.playBeep(500, 50);
    },
    
    updatePosterContent: function() {
        const poster = CONFIG.propagandaPosters[STATE.posterIndex];
        const mainPoster = DOM.posterShowcase.querySelector('.propaganda-main .poster-content');
        
        if (mainPoster && poster) {
            mainPoster.innerHTML = `
                <div class="poster-main-icon">${poster.icon}</div>
                <div class="poster-main-text">
                    <span class="poster-main-headline">${poster.headline}</span>
                    <span class="poster-main-subline">${poster.subline}</span>
                    <span class="poster-main-call">${poster.call}</span>
                </div>
                <div class="poster-main-footer">${poster.footer}</div>
            `;
        }
    }
};

// === AUDIO SYSTEM ===
const AudioSystem = {
    init: function() {
        // Audio toggle
        DOM.audioIndicator.addEventListener('click', () => {
            STATE.audioEnabled = !STATE.audioEnabled;
            DOM.audioIndicator.classList.toggle('muted', !STATE.audioEnabled);
            
            const audioText = DOM.audioIndicator.querySelector('.audio-text');
            audioText.textContent = STATE.audioEnabled ? 'AUDIO ENABLED' : 'AUDIO MUTED';
            
            if (STATE.audioEnabled) {
                UTILS.playBeep(600, 100);
            }
        });
        
        // Initialize with audio enabled
        DOM.audioIndicator.classList.remove('muted');
    }
};

// === LAMP FLICKER EFFECT ===
const LampEffect = {
    flickerInterval: null,
    
    init: function() {
        // Enhanced random flicker
        this.flickerInterval = setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance of flicker
                this.triggerFlicker();
            }
        }, 2000);
    },
    
    triggerFlicker: function() {
        const lamp = document.querySelector('.lamp-flicker');
        if (lamp) {
            // Random intensity
            const intensity = 0.3 + Math.random() * 0.7;
            lamp.style.opacity = intensity;
            
            // Return to normal after short delay
            setTimeout(() => {
                lamp.style.opacity = 1;
            }, 50 + Math.random() * 100);
            
            // Occasional double flicker
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    lamp.style.opacity = 0.4 + Math.random() * 0.4;
                    setTimeout(() => {
                        lamp.style.opacity = 1;
                    }, 30);
                }, 80);
            }
        }
    }
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Command Bunker Omega-7 Initializing...');
    
    // Initialize all systems
    TimeManager.init();
    RadioSystem.init();
    GaugeSystem.init();
    MapSystem.init();
    FieldReportsSystem.init();
    ThreatManager.updateThreatDisplay();
    PosterSystem.init();
    AudioSystem.init();
    LampEffect.init();
    
    // Resource consumption simulation
    setInterval(() => GaugeSystem.consumeResources(), 10000);
    
    // Initial system ready message
    setTimeout(() => {
        FieldReportsSystem.addReport({
            source: "SYSTEM",
            text: "All systems operational. Command bunker online.",
            urgent: false
        });
        
        // Play startup sound
        UTILS.playBeep(800, 100);
        setTimeout(() => UTILS.playBeep(1000, 100), 150);
        setTimeout(() => UTILS.playBeep(1200, 100), 300);
    }, 1000);
    
    console.log('Command Bunker Omega-7 Online');
});

// === GLOBAL EVENT LISTENERS ===
// Prevent context menu on map
DOM.strategyMap.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + M: Toggle map grid
    if (e.altKey && e.key === 'm') {
        DOM.gridToggle.click();
    }
    
    // Alt + Z: Toggle zoom
    if (e.altKey && e.key === 'z') {
        DOM.zoomIn.click();
    }
    
    // Alt + X: Clear units
    if (e.altKey && e.key === 'x') {
        DOM.clearUnits.click();
    }
    
    // Alt + A: Toggle audio
    if (e.altKey && e.key === 'a') {
        DOM.audioIndicator.click();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Adjust map scaling if needed
    if (STATE.mapZoom !== 1) {
        DOM.strategyMap.style.transform = `scale(${STATE.mapZoom})`;
    }
});

// Save state before unload (for future localStorage implementation)
window.addEventListener('beforeunload', () => {
    // Could save unit positions and other state here
    console.log('Saving command bunker state...');
});
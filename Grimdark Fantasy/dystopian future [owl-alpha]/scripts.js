/* ============================================
   NEXUS COMMAND - SECTOR OMEGA-7
   System Interface Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeDataStream();
    initializeSystemLogs();
    initializeTabSwitching();
    initializeGlitchEffects();
    initializeMapInteractions();
    initializeTicker();
    initializeResistanceMessages();
    initializeAudioVisualizer();
    initializeRandomEvents();
});

/* ============================================
   SYSTEM CLOCK
   ============================================ */

function initializeClock() {
    const clockElement = document.getElementById('systemClock');
    
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

/* ============================================
   DATA STREAM GENERATOR
   ============================================ */

function initializeDataStream() {
    const streamContainer = document.getElementById('dataStream');
    const hexChars = '0123456789ABCDEF';
    
    function generateHexString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += hexChars[Math.floor(Math.random() * 16)];
        }
        return result;
    }
    
    function generateDataLine() {
        const types = [
            () => `[${generateHexString(4)}] PKT: ${generateHexString(16)}`,
            () => `0x${generateHexString(8)} MEM: ${generateHexString(32)}`,
            () => `SEQ-${Math.floor(Math.random() * 9999)} DATA: ${generateHexString(24)}`,
            () => `>> ${generateHexString(6)}::${generateHexString(6)} ${generateHexString(12)}`,
            () => `[${new Date().toISOString().split('T')[1].split('.')[0]}] ${generateHexString(8)}`
        ];
        
        const randomType = types[Math.floor(Math.random() * types.length)];
        return randomType();
    }
    
    function addDataLine() {
        const line = document.createElement('div');
        line.className = 'data-line';
        line.textContent = generateDataLine();
        streamContainer.appendChild(line);
        
        while (streamContainer.children.length > 8) {
            streamContainer.removeChild(streamContainer.firstChild);
        }
        
        streamContainer.scrollTop = streamContainer.scrollHeight;
    }
    
    setInterval(addDataLine, 150);
}

/* ============================================
   SYSTEM LOGS GENERATOR
   ============================================ */

function initializeSystemLogs() {
    const logContainer = document.getElementById('systemLogs');
    
    const logTemplates = {
        system: [
            'Perimeter scan completed - Sector {sector}',
            'Drone patrol DR-{id} status: NOMINAL',
            'Network node {node} synchronized',
            'Encryption keys rotated - Protocol {proto}',
            'Backup systems check: PASSED',
            'Satellite uplink established - SAT-{id}'
        ],
        warning: [
            'Unusual activity detected in {zone}',
            'Signal interference detected - Freq: {freq}GHz',
            'Civilian density exceeding threshold in {zone}',
            'Unauthorized transmission detected',
            'Power fluctuation in Grid {grid}',
            'Thermal anomaly detected - Sensor {sensor}'
        ],
        info: [
            'Drone patrol DR-{id} en route to coordinates {coords}',
            'Routine maintenance scheduled for {time}',
            'Data sync completed - {size}MB transferred',
            'Personnel count updated: {count} active',
            'Weather systems: {condition}'
        ],
        alert: [
            'SIGNAL JAMMING DETECTED - Source: Unknown',
            'BREACH ATTEMPT - Location: {zone}',
            'UNAUTHORIZED ACCESS - Terminal {term}',
            'WEAPON DETECTED - Zone {zone}',
            'COMMUNICATION BLACKOUT - Sector {sector}'
        ],
        classified: [
            '████████ ███ ████████████ ████ ██',
            '██ ██████ ██ ████████ ██████ ████',
            'OPERATION ██████ PHASE ██ INITIATED',
            '████ ██ ████████ ██████ ████ ████'
        ]
    };
    
    const sectors = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'];
    const zones = ['Residential-4', 'Industrial-7', 'Commercial-2', 'Sector-9', 'Block-12'];
    const conditions = ['CLEAR', 'OVERCAST', 'ELECTROMAGNETIC STORM', 'OPTIMAL'];
    
    function generateLogTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (Math.random() > 0.85) {
            return '[██:██:██]';
        }
        return `[${hours}:${minutes}:${seconds}]`;
    }
    
    function generateLogMessage(type) {
        const templates = logTemplates[type];
        let message = templates[Math.floor(Math.random() * templates.length)];
        
        message = message.replace('{sector}', sectors[Math.floor(Math.random() * sectors.length)]);
        message = message.replace('{zone}', zones[Math.floor(Math.random() * zones.length)]);
        message = message.replace('{id}', Math.floor(Math.random() * 99));
        message = message.replace('{node}', String.fromCharCode(65 + Math.floor(Math.random() * 6)) + Math.floor(Math.random() * 99));
        message = message.replace('{proto}', Math.floor(Math.random() * 999));
        message = message.replace('{freq}', (2 + Math.random() * 6).toFixed(1));
        message = message.replace('{grid}', Math.floor(Math.random() * 20));
        message = message.replace('{sensor}', 'S' + Math.floor(Math.random() * 999));
        message = message.replace('{coords}', `${(Math.random() * 90).toFixed(2)}, ${(Math.random() * 180).toFixed(2)}`);
        message = message.replace('{time}', `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`);
        message = message.replace('{size}', Math.floor(Math.random() * 500));
        message = message.replace('{count}', Math.floor(Math.random() * 5000));
        message = message.replace('{condition}', conditions[Math.floor(Math.random() * conditions.length)]);
        message = message.replace('{term}', 'T-' + Math.floor(Math.random() * 999));
        
        return message;
    }
    
    function addLogEntry() {
        const types = ['system', 'system', 'system', 'warning', 'info', 'info', 'alert', 'classified'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `
            <span class="log-time">${generateLogTime()}</span>
            <span class="log-type">${type.toUpperCase().substring(0, 4)}</span>
            <span class="log-message">${generateLogMessage(type)}</span>
        `;
        
        logContainer.appendChild(entry);
        
        while (logContainer.children.length > 15) {
            logContainer.removeChild(logContainer.firstChild);
        }
        
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    setInterval(addLogEntry, 2500);
}

/* ============================================
   TAB SWITCHING
   ============================================ */

function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

/* ============================================
   GLITCH EFFECTS
   ============================================ */

function initializeGlitchEffects() {
    const glitchContainer = document.querySelector('.glitch-container');
    
    function createGlitchLine() {
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            left: 0;
            width: 100%;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(0, 255, 65, ${Math.random() * 0.3 + 0.1});
            top: ${Math.random() * 100}%;
            transform: translateX(${Math.random() * 20 - 10}px);
            pointer-events: none;
            z-index: 998;
        `;
        
        glitchContainer.appendChild(line);
        
        setTimeout(() => {
            line.remove();
        }, 100 + Math.random() * 200);
    }
    
    function createGlitchBlock() {
        const block = document.createElement('div');
        const size = Math.random() * 100 + 50;
        block.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size * 0.6}px;
            background: rgba(255, 51, 51, ${Math.random() * 0.2});
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: 997;
            mix-blend-mode: screen;
        `;
        
        glitchContainer.appendChild(block);
        
        setTimeout(() => {
            block.remove();
        }, 50 + Math.random() * 150);
    }
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            createGlitchLine();
        }
    }, 200);
    
    setInterval(() => {
        if (Math.random() > 0.85) {
            createGlitchBlock();
        }
    }, 500);
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.filter = 'hue-rotate(90deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 100);
        }
    }, 5000);
}

/* ============================================
   MAP INTERACTIONS
   ============================================ */

function initializeMapInteractions() {
    const zones = document.querySelectorAll('.zone');
    const strategicPoints = document.querySelectorAll('.strategic-points .point');
    
    zones.forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            zone.style.fillOpacity = '0.6';
            zone.style.filter = 'brightness(1.3)';
        });
        
        zone.addEventListener('mouseleave', () => {
            zone.style.fillOpacity = '';
            zone.style.filter = '';
        });
        
        zone.addEventListener('click', () => {
            const zoneName = zone.dataset.zone;
            showZoneInfo(zoneName);
        });
    });
    
    strategicPoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            point.style.r = '12';
        });
        
        point.addEventListener('mouseleave', () => {
            point.style.r = '';
        });
    });
}

function showZoneInfo(zoneName) {
    const zoneData = {
        alpha: { name: 'ALPHA', status: 'NEXUS CONTROLLED', threat: 'LOW', population: '12,847' },
        beta: { name: 'BETA', status: 'NEXUS CONTROLLED', threat: 'LOW', population: '8,234' },
        gamma: { name: 'GAMMA', status: 'CONTESTED', threat: 'HIGH', population: '23,456' },
        delta: { name: 'DELTA', status: 'CONTESTED', threat: 'MEDIUM', population: '15,678' },
        epsilon: { name: 'EPSILON', status: 'RESISTANCE', threat: 'CRITICAL', population: '9,012' },
        zeta: { name: 'ZETA', status: 'RESISTANCE', threat: 'CRITICAL', population: '11,345' },
        eta: { name: 'ETA', status: 'OUTSKIRTS', threat: 'UNKNOWN', population: 'UNKNOWN' }
    };
    
    const data = zoneData[zoneName];
    if (data) {
        console.log(`Zone ${data.name}: ${data.status} | Threat: ${data.threat} | Population: ${data.population}`);
    }
}

/* ============================================
   PROPAGANDA TICKER
   ============================================ */

function initializeTicker() {
    const tickerWrap = document.getElementById('propagandaTicker');
    const messages = [
        '◆ NEXUS COMMAND REMANDS ALL CITIZENS COMPLY WITH CURFEW REGULATIONS ◆',
        '◆ REPORT SUSPICIOUS ACTIVITY TO LOCAL AUTHORITIES ◆',
        '◆ RESISTANCE ELEMENTS POSE THREAT TO SOCIETAL STABILITY ◆',
        '◆ THE NETWORK PROTECTS ◆ THE NETWORK PROVIDES ◆',
        '◆ COMPLIANCE IS FREEDOM ◆ SURVEILLANCE IS SAFETY ◆',
        '◆ UNITY THROUGH OBEDIENCE ◆ STABILITY THROUGH CONTROL ◆',
        '◆ YOUR COOPERATION IS APPRECIATED ◆ YOUR SAFETY IS ASSURED ◆',
        '◆ QUESTION NOT THE SYSTEM ◆ TRUST IN NEXUS COMMAND ◆'
    ];
    
    function shuffleTicker() {
        tickerWrap.style.animation = 'none';
        tickerWrap.offsetHeight;
        tickerWrap.style.animation = 'ticker-scroll 45s linear infinite';
    }
    
    setInterval(shuffleTicker, 45000);
}

/* ============================================
   RESISTANCE MESSAGES
   ============================================ */

function initializeResistanceMessages() {
    const messageElement = document.getElementById('resistanceMessage');
    
    const resistanceMessages = [
        '"The walls have ears, but so do we. Remember: the network sees all, but it cannot see hope. Join us at the old frequency. Midnight. Channel 7."',
        '"They built walls to keep us in. We built doors to get out. The signal is strong tonight. Listen."',
        '"Every camera is a blind spot if you know where to look. Every wire is a voice if you know how to listen."',
        '"The machine thinks in ones and zeros. We think in dreams and defiance. They cannot compute what they cannot understand."',
        '"Tonight, the static speaks. Tomorrow, the silence breaks. We are the noise they cannot filter."',
        '"They monitor the airwaves, but our words travel on foot, in whispers, in the spaces between their surveillance."',
        '"The network is vast, but it has gaps. We are the gaps. We are the static. We are the signal they cannot jam."'
    ];
    
    function updateMessage() {
        messageElement.style.opacity = '0';
        
        setTimeout(() => {
            const newMessage = resistanceMessages[Math.floor(Math.random() * resistanceMessages.length)];
            messageElement.textContent = newMessage;
            messageElement.style.opacity = '1';
        }, 500);
    }
    
    setInterval(updateMessage, 15000);
}

/* ============================================
   AUDIO VISUALIZER
   ============================================ */

function initializeAudioVisualizer() {
    const bars = document.querySelectorAll('.viz-bar');
    
    function animateBars() {
        bars.forEach(bar => {
            const randomHeight = Math.random() * 25 + 5;
            bar.style.height = `${randomHeight}px`;
        });
    }
    
    setInterval(animateBars, 100);
}

/* ============================================
   RANDOM EVENTS
   ============================================ */

function initializeRandomEvents() {
    function triggerRandomEvent() {
        const events = [
            triggerCameraGlitch,
            triggerAlertSpike,
            triggerSignalLoss,
            triggerDataCorruption
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        randomEvent();
    }
    
    function triggerCameraGlitch() {
        const feeds = document.querySelectorAll('.feed-box');
        const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
        
        randomFeed.style.filter = 'hue-rotate(180deg) saturate(2)';
        randomFeed.style.transform = 'translateX(5px)';
        
        setTimeout(() => {
            randomFeed.style.filter = '';
            randomFeed.style.transform = '';
        }, 200);
    }
    
    function triggerAlertSpike() {
        const alertBadge = document.querySelector('.alert-badge');
        const alertCount = alertBadge.querySelector('.alert-count');
        
        alertCount.textContent = Math.floor(Math.random() * 20) + 5;
        alertBadge.style.animation = 'none';
        alertBadge.offsetHeight;
        alertBadge.style.animation = 'alert-pulse 0.5s infinite';
        
        setTimeout(() => {
            alertBadge.style.animation = 'alert-pulse 2s infinite';
        }, 3000);
    }
    
    function triggerSignalLoss() {
        const signalBars = document.querySelectorAll('.signal-bars .bar');
        const barsToDeactivate = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < barsToDeactivate; i++) {
            const randomIndex = Math.floor(Math.random() * signalBars.length);
            signalBars[randomIndex].classList.remove('active');
        }
        
        setTimeout(() => {
            signalBars.forEach(bar => bar.classList.add('active'));
        }, 5000);
    }
    
    function triggerDataCorruption() {
        const dataLines = document.querySelectorAll('.data-line');
        const randomLine = dataLines[Math.floor(Math.random() * dataLines.length)];
        
        if (randomLine) {
            const originalText = randomLine.textContent;
            const corruptedText = originalText.replace(/[0-9A-F]/g, '█');
            randomLine.textContent = corruptedText;
            randomLine.style.color = '#ff3333';
            
            setTimeout(() => {
                randomLine.textContent = originalText;
                randomLine.style.color = '';
            }, 1000);
        }
    }
    
    setInterval(triggerRandomEvent, 8000);
}

/* ============================================
   PANEL CONTROLS
   ============================================ */

document.querySelectorAll('.control-btn').forEach(button => {
    button.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        location.reload();
    }
    
    if (e.key === 'g') {
        const glitchContainer = document.querySelector('.glitch-container');
        glitchContainer.style.opacity = '1';
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const line = document.createElement('div');
                line.style.cssText = `
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: ${Math.random() * 5}px;
                    background: rgba(0, 255, 65, ${Math.random() * 0.5});
                    top: ${Math.random() * 100}%;
                    pointer-events: none;
                `;
                glitchContainer.appendChild(line);
                
                setTimeout(() => line.remove(), 100);
            }, i * 20);
        }
    }
});

/* ============================================
   INITIALIZATION COMPLETE
   ============================================ */

console.log('%c NEXUS COMMAND SYSTEM INITIALIZED ', 'background: #00ff41; color: #000; font-weight: bold; padding: 5px 10px;');
console.log('%c SECTOR OMEGA-7 // ALL SYSTEMS NOMINAL ', 'color: #00ff41;');
console.log('%c WARNING: UNAUTHORIZED ACCESS WILL BE PROSECUTED ', 'color: #ff3333;');
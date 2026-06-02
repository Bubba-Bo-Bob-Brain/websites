/**
 * OPERATION: IRON SHIELD - Strategic Command Systems
 * 1940s Alternate History Military Command Interface
 */

// Global State
const WarState = {
    turn: 1,
    threatLevel: 35,
    gauges: {
        steel: 84,
        oil: 62,
        manpower: 91
    },
    weather: {
        temp: 12,
        condition: 'FOG',
        wind: 'NW 15km'
    },
    posters: ['VICTORY THROUGH UNITY', 'PRODUCE FOR THE FRONT', 'SILENCE MEANS SECURITY'],
    currentPoster: 0
};

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const random = (min, max) => Math.random() * (max - min) + min;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeAtmosphere();
    initializeGauges();
    initializeDragAndDrop();
    initializeRadioSystem();
    initializePosters();
    initializeControls();
    startGlobalTicker();
});

/* ==================== ATMOSPHERIC SYSTEMS ==================== */

function initializeAtmosphere() {
    // Create dust particles
    const dustContainer = $('#dust-particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        particle.style.left = `${random(0, 100)}%`;
        particle.style.animationDelay = `${random(0, 10)}s`;
        particle.style.animationDuration = `${random(8, 15)}s`;
        dustContainer.appendChild(particle);
    }

    // Update date display with slight drift to simulate alternate timeline
    updateWarDate();
    setInterval(updateWarDate, 60000);
}

function updateWarDate() {
    const now = new Date();
    const year = 1947;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    $('#war-date').textContent = `${year}.${month}.${day} // ${hours}:${minutes}`;
}

/* ==================== ANALOG GAUGE SYSTEMS ==================== */

function initializeGauges() {
    updateGaugeDisplay('steel', WarState.gauges.steel);
    updateGaugeDisplay('oil', WarState.gauges.oil);
    updateGaugeDisplay('man', WarState.gauges.manpower);
    
    // Simulate fluctuating gauge readings
    setInterval(() => {
        fluctuateGauges();
    }, 3000);
}

function updateGaugeDisplay(type, value) {
    const needle = $(`#${type}-needle`);
    const fill = $(`#${type}-fill`);
    const display = $(`#${type}-value`);
    
    if (!needle || !fill || !display) return;
    
    // Calculate rotation (-135 to +135 degrees)
    const rotation = -135 + (value / 100) * 270;
    needle.style.transform = `rotate(${rotation}deg)`;
    
    // Update SVG stroke dash offset for fill arc
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;
    fill.style.strokeDashoffset = offset;
    
    // Update numeric display
    display.textContent = `${Math.round(value)}%`;
}

function fluctuateGauges() {
    // Random small fluctuations to simulate analog jitter
    WarState.gauges.steel = clamp(WarState.gauges.steel + random(-2, 2), 75, 95);
    WarState.gauges.oil = clamp(WarState.gauges.oil + random(-3, 3), 50, 75);
    WarState.gauges.manpower = clamp(WarState.gauges.manpower + random(-1, 1), 85, 98);
    
    updateGaugeDisplay('steel', WarState.gauges.steel);
    updateGaugeDisplay('oil', WarState.gauges.oil);
    updateGaugeDisplay('man', WarState.gauges.manpower);
}

/* ==================== STRATEGY MAP - DRAG & DROP ==================== */

function initializeDragAndDrop() {
    const tokens = $$('.unit-token');
    const map = $('#strategy-map');
    
    let draggedToken = null;
    let offsetX = 0;
    let offsetY = 0;
    
    tokens.forEach(token => {
        token.addEventListener('dragstart', (e) => {
            draggedToken = token;
            const rect = token.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            token.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            // Required for Firefox
            e.dataTransfer.setData('text/plain', token.dataset.unitId);
        });
        
        token.addEventListener('dragend', () => {
            token.classList.remove('dragging');
            draggedToken = null;
        });
        
        // Touch support for mobile
        token.addEventListener('touchstart', handleTouchStart, {passive: false});
        token.addEventListener('touchmove', handleTouchMove, {passive: false});
        token.addEventListener('touchend', handleTouchEnd);
    });
    
    map.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    map.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedToken) return;
        
        const mapRect = map.getBoundingClientRect();
        const x = e.clientX - mapRect.left - offsetX;
        const y = e.clientY - mapRect.top - offsetY;
        
        // Snap to grid (10% increments)
        const snapX = Math.round(x / (mapRect.width / 10)) * (mapRect.width / 10);
        const snapY = Math.round(y / (mapRect.height / 10)) * (mapRect.height / 10);
        
        const finalX = clamp(snapX, 0, mapRect.width - 50);
        const finalY = clamp(snapY, 0, mapRect.height - 50);
        
        const pctX = (finalX / mapRect.width) * 100;
        const pctY = (finalY / mapRect.height) * 100;
        
        draggedToken.style.left = `${pctX}%`;
        draggedToken.style.top = `${pctY}%`;
        
        // Visual feedback
        createDeploymentEffect(finalX, finalY);
    });
    
    // Touch handlers
    let touchToken = null;
    let touchOffsetX = 0;
    let touchOffsetY = 0;
    
    function handleTouchStart(e) {
        touchToken = e.currentTarget;
        const touch = e.touches[0];
        const rect = touchToken.getBoundingClientRect();
        touchOffsetX = touch.clientX - rect.left;
        touchOffsetY = touch.clientY - rect.top;
        touchToken.classList.add('dragging');
    }
    
    function handleTouchMove(e) {
        if (!touchToken) return;
        e.preventDefault();
        const touch = e.touches[0];
        const map = $('#strategy-map');
        const mapRect = map.getBoundingClientRect();
        
        const x = touch.clientX - mapRect.left - touchOffsetX;
        const y = touch.clientY - mapRect.top - touchOffsetY;
        
        touchToken.style.left = `${(x / mapRect.width) * 100}%`;
        touchToken.style.top = `${(y / mapRect.height) * 100}%`;
    }
    
    function handleTouchEnd(e) {
        if (touchToken) {
            touchToken.classList.remove('dragging');
            touchToken = null;
        }
    }
}

function createDeploymentEffect(x, y) {
    const map = $('#strategy-map');
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border: 2px solid var(--brass);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
        pointer-events: none;
        z-index: 150;
    `;
    
    map.appendChild(ripple);
    
    // Animate ripple
    const anim = ripple.animate([
        { width: '20px', height: '20px', opacity: 1 },
        { width: '60px', height: '60px', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    });
    
    anim.onfinish = () => ripple.remove();
}

/* ==================== RADIO INTERCEPT SYSTEM ==================== */

function initializeRadioSystem() {
    // Generate initial intercepts
    const log = $('#radio-log');
    
    // Simulate incoming transmissions
    setInterval(() => {
        if (Math.random() > 0.7) {
            generateIntercept();
        }
    }, 5000);
    
    // Update signal strength
    setInterval(updateSignalStrength, 2000);
    
    // Start morse code transmission
    startMorseTransmission();
}

function generateIntercept() {
    const sources = [
        { name: '[ENEMY COMMS]', type: 'enemy', encrypted: true },
        { name: '[FIELD UNIT 7]', type: 'friendly', encrypted: false },
        { name: '[FIELD UNIT 3]', type: 'friendly', encrypted: false },
        { name: '[AIR COMMAND]', type: 'friendly', encrypted: false },
        { name: '[SIGINT STATION]', type: 'intel', encrypted: true },
        { name: '[NORTHERN SECTOR]', type: 'friendly', encrypted: false }
    ];
    
    const messages = [
        'Position secured. Awaiting orders.',
        'Enemy movement detected at grid C-4.',
        'Supply convoy en route.',
        'Weather conditions deteriorating.',
        'Artillery support requested.',
        'Reconnaissance complete.',
        'Unit repositioning to secondary coordinates.',
        'Contact lost with forward outpost.',
        'Reinforcements arriving 0600 hours.',
        'Tactical withdrawal initiated.'
    ];
    
    const encryptedMessages = [
        'XK-293 // ALPHA BRAVO CHARLIE',
        'ZM-441 // GRID REFERENCE UPDATE',
        'QT-112 // PRIORITY TRANSMISSION',
        'NV-883 // ENCRYPTED BURST',
        'LP-009 // SECURE CHANNEL'
    ];
    
    const source = sources[Math.floor(Math.random() * sources.length)];
    const isEncrypted = source.encrypted || Math.random() > 0.7;
    const messageText = isEncrypted 
        ? encryptedMessages[Math.floor(Math.random() * encryptedMessages.length)]
        : messages[Math.floor(Math.random() * messages.length)];
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${source.type === 'enemy' ? 'urgent' : ''}`;
    entry.innerHTML = `
        <span class="timestamp">${timeStr}</span>
        <span class="source">${source.name}</span>
        <span class="message ${isEncrypted ? 'encrypted' : ''}">${messageText}</span>
    `;
    
    const log = $('#radio-log');
    log.insertBefore(entry, log.firstChild);
    
    // Limit entries
    while (log.children.length > 20) {
        log.removeChild(log.lastChild);
    }
    
    // Flash effect for urgent
    if (source.type === 'enemy') {
        flashAlert();
    }
}

function updateSignalStrength() {
    const bars = $$('.strength-bar');
    const strength = Math.floor(random(1, 5));
    
    bars.forEach((bar, index) => {
        bar.classList.toggle('active', index < strength);
    });
    
    // Update frequency display slightly
    const freq = (447 + random(0, 10)).toFixed(1);
    $('#freq-display').textContent = freq;
    
    // Move tuning needle
    const needle = $('#tune-needle');
    const pos = 45 + random(-5, 5);
    needle.style.left = `${pos}%`;
}

function flashAlert() {
    const panel = $('.comms-panel');
    panel.style.boxShadow = 'inset 0 0 20px rgba(220, 38, 38, 0.5), 0 0 0 2px rgba(220, 38, 38, 0.8)';
    setTimeout(() => {
        panel.style.boxShadow = '';
    }, 500);
}

function startMorseTransmission() {
    const morseMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
        'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
        'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
        'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
        'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
        'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '0': '-----'
    };
    
    const words = ['URGENT', 'COMMAND', 'STRIKE', 'DEFEND', 'MOVE', 'ATTACK', 'HOLD'];
    let currentWord = '';
    let morseIndex = 0;
    let charIndex = 0;
    
    setInterval(() => {
        const lamp = $('#morse-light');
        const output = $('#morse-output');
        
        if (morseIndex === 0 && charIndex === 0) {
            currentWord = words[Math.floor(Math.random() * words.length)];
        }
        
        const char = currentWord[charIndex];
        const morse = morseMap[char] || '';
        
        if (morseIndex < morse.length) {
            const symbol = morse[morseIndex];
            lamp.classList.add('active');
            output.textContent = currentWord.substring(0, charIndex) + (symbol === '.' ? '·' : '−');
            
            setTimeout(() => {
                lamp.classList.remove('active');
            }, symbol === '.' ? 200 : 600);
            
            morseIndex++;
        } else {
            morseIndex = 0;
            charIndex++;
            if (charIndex >= currentWord.length) {
                charIndex = 0;
                output.textContent = '';
            }
            // Gap between letters
        }
    }, 800);
}

/* ==================== PROPAGANDA SYSTEM ==================== */

function initializePosters() {
    const prevBtn = $('#prev-poster');
    const nextBtn = $('#next-poster');
    
    prevBtn.addEventListener('click', () => rotatePoster(-1));
    nextBtn.addEventListener('click', () => rotatePoster(1));
    
    // Auto-rotate every 10 seconds
    setInterval(() => rotatePoster(1), 10000);
}

function rotatePoster(direction) {
    const slides = $$('.poster-slide');
    slides[WarState.currentPoster].classList.remove('active');
    
    WarState.currentPoster = (WarState.currentPoster + direction + slides.length) % slides.length;
    
    slides[WarState.currentPoster].classList.add('active');
}

/* ==================== CONTROL SYSTEMS ==================== */

function initializeControls() {
    // Deploy button
    $('#deploy-btn').addEventListener('click', () => {
        incrementTurn();
        flashButtonEffect('#deploy-btn');
    });
    
    // Intercept button
    $('#intercept-btn').addEventListener('click', () => {
        generateIntercept();
        flashButtonEffect('#intercept-btn');
    });
    
    // Scramble button - increases threat
    $('#scramble-btn').addEventListener('click', () => {
        WarState.threatLevel = clamp(WarState.threatLevel + random(10, 20), 0, 100);
        updateThreatDial();
        flashButtonEffect('#scramble-btn');
        
        // Red alert effect
        document.body.style.animation = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.animation = 'alert-flash 0.5s ease';
    });
}

function flashButtonEffect(selector) {
    const btn = $(selector);
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 100);
}

function incrementTurn() {
    WarState.turn++;
    $('#turn-counter').textContent = String(WarState.turn).padStart(3, '0');
    
    // Update quota numbers randomly
    updateQuotas();
}

function updateQuotas() {
    const quotas = [
        { id: 'tank-quota', current: 73, max: 100 },
        { id: 'arty-quota', current: 45, max: 100 },
        { id: 'air-quota', current: 88, max: 100 }
    ];
    
    quotas.forEach(q => {
        const change = Math.floor(random(-5, 8));
        const newVal = clamp(parseInt($(q.id).textContent.split('/')[0]) + change, 0, q.max);
        $(q.id).textContent = `${newVal}/${q.max}`;
        $(q.id).previousElementSibling.querySelector('.quota-fill').style.width = `${newVal}%`;
    });
}

function updateThreatDial() {
    const needle = $('#threat-needle');
    const rotation = -90 + (WarState.threatLevel / 100) * 180;
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // Color coding based on threat
    if (WarState.threatLevel > 75) {
        needle.style.background = 'var(--warning-red)';
        needle.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.8)';
    } else if (WarState.threatLevel > 40) {
        needle.style.background = 'var(--alert-amber)';
        needle.style.boxShadow = '0 0 5px rgba(245, 158, 11, 0.5)';
    } else {
        needle.style.background = 'var(--safe-green)';
        needle.style.boxShadow = '0 0 5px rgba(22, 163, 74, 0.3)';
    }
}

/* ==================== GLOBAL TICKER ==================== */

function startGlobalTicker() {
    // Update weather periodically
    setInterval(() => {
        const conditions = ['FOG', 'CLEAR', 'RAIN', 'SNOW', 'WIND'];
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        
        if (Math.random() > 0.8) {
            WarState.weather.condition = conditions[Math.floor(Math.random() * conditions.length)];
            WarState.weather.wind = `${dirs[Math.floor(Math.random() * dirs.length)]} ${Math.floor(random(5, 30))}km`;
            WarState.weather.temp = Math.floor(random(5, 25));
            
            $('#weather-data').innerHTML = `
                <span class="temp">${WarState.weather.temp}°C</span>
                <span class="condition">${WarState.weather.condition}</span>
                <span class="wind">${WarState.weather.wind}</span>
            `;
        }
    }, 15000);
    
    // Decay threat over time
    setInterval(() => {
        if (WarState.threatLevel > 20) {
            WarState.threatLevel -= 1;
            updateThreatDial();
        }
    }, 5000);
}

// Add custom animation for red alert
const style = document.createElement('style');
style.textContent = `
    @keyframes alert-flash {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3) sepia(1) hue-rotate(-30deg); }
    }
`;
document.head.appendChild(style);
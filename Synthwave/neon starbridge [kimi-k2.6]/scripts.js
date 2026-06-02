// ============================================
// STARVAULT-X BRIDGE CONSOLE - MAIN SYSTEMS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAllSystems();
});

// Global state
let warpActive = false;
let shieldIntegrity = 100;
let alertLevel = 'STANDBY';
let currentWarp = 0;
let targetLocked = false;

// ============================================
// SYSTEM INITIALIZATION
// ============================================

function initializeAllSystems() {
    initClock();
    initStarField();
    initShieldRing();
    initWarpSlider();
    initWeapons();
    initComms();
    initAlerts();
    initEngineering();
    initHelm();
    initCoursePlot();
    startRandomUpdates();
}

// ============================================
// CLOCK & TIME SYSTEMS
// ============================================

function initClock() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.textContent = timeStr;
    }
    
    // Update stardate based on a fictional calculation
    const stardate = calculateStardate(now);
    const stardateEl = document.getElementById('stardate');
    if (stardateEl) {
        stardateEl.textContent = `STARDATE ${stardate}`;
    }
}

function calculateStardate(date) {
    const base = 4725;
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const fraction = dayOfYear / 365;
    const timeFraction = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
    return (base + fraction + timeFraction * 0.001).toFixed(1);
}

// ============================================
// STAR FIELD & VIEWPORT
// ============================================

function initStarField() {
    const starField = document.getElementById('starField');
    if (!starField) return;
    
    // Create static stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: ${Math.random() > 0.8 ? '#ffffff' : Math.random() > 0.5 ? '#a0d8ff' : '#ffddaa'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        starField.appendChild(star);
    }
    
    // Add keyframe for twinkle
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// WARP SYSTEM
// ============================================

function initWarpSlider() {
    const warpSlider = document.getElementById('warpThumb');
    const warpFill = document.getElementById('warpFill');
    const warpReadout = document.getElementById('warpReadout');
    const engageBtn = document.getElementById('engageBtn');
    const sliderTrack = document.querySelector('.slider-track');
    
    if (!sliderTrack || !warpSlider) return;
    
    let isDragging = false;
    let currentWarpValue = 0;
    
    warpSlider.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => {
        if (isDragging) isDragging = false;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = sliderTrack.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        
        updateWarpDisplay(percent);
    });
    
    // Touch support
    warpSlider.addEventListener('touchstart', () => isDragging = true);
    document.addEventListener('touchend', () => {
        if (isDragging) isDragging = false;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const rect = sliderTrack.getBoundingClientRect();
        let percent = (e.touches[0].clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        
        updateWarpDisplay(percent);
    });
    
    engageBtn.addEventListener('click', () => {
        const warpValue = parseFloat(warpReadout?.textContent || '0');
        if (warpValue > 0) {
            engageWarp(warpValue);
        }
    });
}

function updateWarpDisplay(percent) {
    const warpSlider = document.getElementById('warpThumb');
    const warpFill = document.getElementById('warpFill');
    const warpReadout = document.getElementById('warpReadout');
    const velocityReadout = document.getElementById('velocityReadout');
    
    if (warpSlider) warpSlider.style.left = (percent * 100) + '%';
    if (warpFill) warpFill.style.width = (percent * 100) + '%';
    
    const warpValue = (percent * 9.99).toFixed(2);
    if (warpReadout) warpReadout.textContent = warpValue;
    if (velocityReadout) velocityReadout.textContent = (percent * 2.5).toFixed(2);
}

function engageWarp(warpFactor) {
    if (warpActive) return;
    
    warpActive = true;
    const warpStreaks = document.getElementById('warpStreaks');
    const gridFloor = document.querySelector('.grid-floor');
    const body = document.body;
    
    // Create warp streaks
    if (warpStreaks) {
        warpStreaks.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const streak = document.createElement('div');
            streak.style.cssText = `
                position: absolute;
                width: 2px;
                height: ${50 + Math.random() * 200}px;
                background: linear-gradient(to bottom, transparent, #ffffff, transparent);
                left: ${Math.random() * 100}%;
                top: -200px;
                opacity: 0;
                animation: warpStreak ${0.2 + Math.random() * 0.3}s linear infinite;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            warpStreaks.appendChild(streak);
        }
        warpStreaks.classList.add('active');
    }
    
    // Speed up grid
    if (gridFloor) {
        gridFloor.style.animationDuration = '0.1s';
    }
    
    body.classList.add('warp-active');
    
    // Log the event
    addCommsLog('NAVIGATION', `Warp ${warpFactor} engaged. All systems nominal.`);
    
    // Auto-disengage after 5 seconds
    setTimeout(() => {
        disengageWarp();
    }, 5000);
}

function disengageWarp() {
    warpActive = false;
    const warpStreaks = document.getElementById('warpStreaks');
    const gridFloor = document.querySelector('.grid-floor');
    const body = document.body;
    
    if (warpStreaks) {
        warpStreaks.classList.remove('active');
        setTimeout(() => { warpStreaks.innerHTML = ''; }, 500);
    }
    
    if (gridFloor) {
        gridFloor.style.animationDuration = '2s';
    }
    
    body.classList.remove('warp-active');
    addCommsLog('NAVIGATION', 'Warp drive disengaged. Dropping to impulse.');
}

// Add warp streak keyframe
const warpStyle = document.createElement('style');
warpStyle.textContent = `
    @keyframes warpStreak {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(600px); opacity: 0; }
    }
`;
document.head.appendChild(warpStyle);

// ============================================
// SHIELD SYSTEMS
// ============================================

function initShieldRing() {
    updateShieldDisplay(100);
    
    const raiseBtn = document.getElementById('shieldRaise');
    const lowerBtn = document.getElementById('shieldLower');
    const modulateBtn = document.getElementById('shieldModulate');
    
    if (raiseBtn) raiseBtn.addEventListener('click', () => {
        setShieldIntegrity(100);
        addCommsLog('SHIELDS', 'Shields raised to maximum.');
    });
    
    if (lowerBtn) lowerBtn.addEventListener('click', () => {
        setShieldIntegrity(0);
        addCommsLog('SHIELDS', 'Shields lowered.');
    });
    
    if (modulateBtn) modulateBtn.addEventListener('click', () => {
        modulateShields();
    });
}

function updateShieldDisplay(integrity) {
    const ring = document.getElementById('shieldHealthRing');
    const percentage = document.getElementById('shieldPercentage');
    const circumference = 2 * Math.PI * 85; // r=85
    
    if (ring) {
        const offset = circumference - (integrity / 100) * circumference;
        ring.style.strokeDashoffset = offset;
        
        // Color change based on integrity
        if (integrity > 50) {
            ring.style.stroke = '#00ff88';
        } else if (integrity > 25) {
            ring.style.stroke = '#ffea00';
        } else {
            ring.style.stroke = '#ff0000';
        }
    }
    
    if (percentage) percentage.textContent = Math.round(integrity) + '%';
    
    // Update sector bars
    const sectors = document.querySelectorAll('.sector-fill');
    sectors.forEach((sector, index) => {
        const variance = (Math.sin(Date.now() / 1000 + index) + 1) / 2;
        const sectorIntegrity = Math.max(0, Math.min(100, integrity + (variance * 10 - 5)));
        sector.style.width = sectorIntegrity + '%';
    });
}

function setShieldIntegrity(value) {
    shieldIntegrity = Math.max(0, Math.min(100, value));
    updateShieldDisplay(shieldIntegrity);
}

function modulateShields() {
    addCommsLog('SHIELDS', 'Harmonic modulation in progress...');
    
    const ring = document.getElementById('shieldHealthRing');
    if (ring) {
        ring.style.animation = 'modulatePulse 0.5s ease-in-out 3';
        setTimeout(() => {
            ring.style.animation = '';
        }, 1500);
    }
    
    // Add modulation style
    const modStyle = document.createElement('style');
    modStyle.textContent = `
        @keyframes modulatePulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; filter: hue-rotate(90deg); }
        }
    `;
    document.head.appendChild(modStyle);
}

// ============================================
// WEAPONS SYSTEMS
// ============================================

function initWeapons() {
    const firePhaser = document.getElementById('firePhaser');
    const fireTorpedo = document.getElementById('fireTorpedo');
    const fireDisruptor = document.getElementById('fireDisruptor');
    
    if (firePhaser) {
        firePhaser.addEventListener('click', () => fireWeapon('phaser'));
    }
    if (fireTorpedo) {
        fireTorpedo.addEventListener('click', () => fireWeapon('torpedo'));
    }
    if (fireDisruptor) {
        fireDisruptor.addEventListener('click', () => fireWeapon('disruptor'));
    }
    
    // Start with random target data
    updateTargetData();
}

function fireWeapon(type) {
    const lockReticle = document.getElementById('lockReticle');
    
    // Flash effect
    if (lockReticle) {
        lockReticle.style.filter = 'brightness(2)';
        setTimeout(() => {
            lockReticle.style.filter = '';
        }, 100);
    }
    
    // Update target lock
    if (!targetLocked) {
        targetLocked = true;
        updateTargetLock();
    }
    
    // Log
    const weaponNames = {
        'phaser': 'Phaser arrays',
        'torpedo': 'Photon torpedo',
        'disruptor': 'Disruptor beam'
    };
    
    addCommsLog('WEAPONS', `${weaponNames[type]} fired. Impact confirmed.`);
    
    // Animate charge bar
    const chargeBar = document.querySelector(`[data-bank="${type}"] .charge-bar`);
    if (chargeBar) {
        chargeBar.style.width = '0%';
        setTimeout(() => {
            chargeBar.style.transition = 'width 2s ease';
            chargeBar.style.width = '100%';
        }, 100);
    }
    
    // Decrease torpedo count
    if (type === 'torpedo') {
        const countEl = document.getElementById('torpedoCount');
        if (countEl) {
            let count = parseInt(countEl.textContent);
            if (count > 0) {
                countEl.textContent = count - 1;
            }
        }
    }
}

function updateTargetLock() {
    const reticle = document.getElementById('lockReticle');
    const indicator = document.getElementById('lockIndicator');
    
    if (reticle) {
        reticle.classList.add('locked');
    }
    if (indicator) {
        indicator.textContent = 'LOCKED';
        indicator.style.color = '#ff0000';
    }
    
    updateTargetData();
}

function updateTargetData() {
    const distance = document.getElementById('targetDistance');
    const targetClass = document.getElementById('targetClass');
    const shields = document.getElementById('targetShields');
    
    const distances = ['12.4 AU', '8.7 AU', '3.2 AU', '15.9 AU'];
    const classes = ['CRUISER', 'DESTROYER', 'UNKNOWN', 'TRANSPORT'];
    const shieldVals = ['87%', '45%', '100%', '0%'];
    
    if (distance) distance.textContent = distances[Math.floor(Math.random() * distances.length)];
    if (targetClass) targetClass.textContent = classes[Math.floor(Math.random() * classes.length)];
    if (shields) shields.textContent = shieldVals[Math.floor(Math.random() * shieldVals.length)];
}

// ============================================
// COMMUNICATIONS
// ============================================

function initComms() {
    initFreqCanvas();
    initChannelSelect();
    
    const transmitBtn = document.getElementById('transmitBtn');
    const transmitInput = document.getElementById('transmitInput');
    
    if (transmitBtn) {
        transmitBtn.addEventListener('click', () => transmitMessage());
    }
    
    if (transmitInput) {
        transmitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') transmitMessage();
        });
    }
}

function initFreqCanvas() {
    const canvas = document.getElementById('freqCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    function drawWaveform() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        const time = Date.now() / 1000;
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + 
                Math.sin(x * 0.02 + time * 5) * 20 * Math.sin(time) +
                Math.sin(x * 0.05 + time * 3) * 10 +
                (Math.random() - 0.5) * 5;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw second wave
        ctx.strokeStyle = '#ff00a0';
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + 
                Math.sin(x * 0.03 - time * 4) * 15 +
                Math.cos(x * 0.01 + time * 2) * 10;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        requestAnimationFrame(drawWaveform);
    }
    
    drawWaveform();
}

function initChannelSelect() {
    const channelBtns = document.querySelectorAll('.channel-btn');
    
    channelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            channelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const channel = btn.dataset.chan;
            addCommsLog('COMMS', `Switched to ${channel.toUpperCase()} channel.`);
        });
    });
}

function addCommsLog(source, message) {
    const log = document.getElementById('messageLog');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry system';
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    entry.innerHTML = `
        <span class="log-time">[${timeStr}]</span>
        <span class="log-source">[${source}]</span>
        <span class="log-text">${message}</span>
    `;
    
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 50 entries
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
    
    // Auto-scroll to top
    log.scrollTop = 0;
}

function transmitMessage() {
    const input = document.getElementById('transmitInput');
    if (!input || !input.value.trim()) return;
    
    addCommsLog('OUTGOING', input.value);
    input.value = '';
}

// ============================================
// ALERT SYSTEMS
// ============================================

function initAlerts() {
    const redAlert = document.getElementById('redAlert');
    const yellowAlert = document.getElementById('yellowAlert');
    const blueAlert = document.getElementById('blueAlert');
    
    if (redAlert) {
        redAlert.addEventListener('click', () => setAlert('red'));
    }
    if (yellowAlert) {
        yellowAlert.addEventListener('click', () => setAlert('yellow'));
    }
    if (blueAlert) {
        blueAlert.addEventListener('click', () => setAlert('blue'));
    }
}

function setAlert(level) {
    const indicator = document.getElementById('alertIndicator');
    const body = document.body;
    
    // Remove all alert classes
    body.classList.remove('red-alert', 'yellow-alert', 'blue-alert');
    
    if (indicator) {
        indicator.classList.remove('red-alert', 'yellow-alert', 'blue-alert');
        
        switch(level) {
            case 'red':
                indicator.textContent = 'RED ALERT';
                indicator.classList.add('red-alert');
                body.classList.add('red-alert');
                alertLevel = 'RED ALERT';
                addCommsLog('ALERT', 'RED ALERT! Battle stations!');
                break;
            case 'yellow':
                indicator.textContent = 'YELLOW ALERT';
                indicator.classList.add('yellow-alert');
                body.classList.add('yellow-alert');
                alertLevel = 'YELLOW ALERT';
                addCommsLog('ALERT', 'YELLOW ALERT. All hands to stations.');
                break;
            case 'blue':
                indicator.textContent = 'BLUE ALERT';
                indicator.classList.add('blue-alert');
                body.classList.add('blue-alert');
                alertLevel = 'BLUE ALERT';
                addCommsLog('ALERT', 'BLUE ALERT. Standby mode engaged.');
                break;
            default:
                indicator.textContent = 'STANDBY';
                alertLevel = 'STANDBY';
        }
    }
    
    // Play alert sound effect (visual only)
    const statusBar = document.querySelector('.status-bar');
    if (statusBar) {
        statusBar.style.animation = 'none';
        statusBar.offsetHeight; // Trigger reflow
        statusBar.style.animation = '';
    }
}

// ============================================
// ENGINEERING
// ============================================

function initEngineering() {
    updateEngineeringGauges();
    setInterval(updateEngineeringGauges, 3000);
}

function updateEngineeringGauges() {
    const powerVal = document.getElementById('powerVal');
    const tempVal = document.getElementById('tempVal');
    const effVal = document.getElementById('effVal');
    
    const powerRing = document.getElementById('powerRing');
    const tempRing = document.getElementById('tempRing');
    const effRing = document.getElementById('effRing');
    
    const power = 70 + Math.random() * 25;
    const temp = 40 + Math.random() * 30;
    const eff = 55 + Math.random() * 30;
    
    if (powerVal) powerVal.textContent = Math.round(power);
    if (tempVal) tempVal.textContent = Math.round(temp);
    if (effVal) effVal.textContent = Math.round(eff);
    
    // Update SVG rings
    const circumference = 2 * Math.PI * 50; // r=50
    
    if (powerRing) {
        powerRing.style.strokeDashoffset = circumference - (power / 100) * circumference;
    }
    if (tempRing) {
        tempRing.style.strokeDashoffset = circumference - (temp / 100) * circumference;
    }
    if (effRing) {
        effRing.style.strokeDashoffset = circumference - (eff / 100) * circumference;
    }
}

// ============================================
// HELM
// ============================================

function initHelm() {
    const wheel = document.getElementById('helmWheel');
    let rotation = 0;
    
    // Continuous slow rotation
    setInterval(() => {
        rotation += 0.5;
        if (wheel) {
            wheel.style.transform = `rotate(${rotation}deg)`;
        }
    }, 50);
}

// ============================================
// COURSE PLOT
// ============================================

function initCoursePlot() {
    const inputs = document.querySelectorAll('.course-inputs input');
    
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateCourseDisplay();
        });
    });
}

function updateCourseDisplay() {
    const x = document.getElementById('courseX');
    const y = document.getElementById('courseY');
    const z = document.getElementById('courseZ');
    
    // Visual feedback that course has changed
    const line = document.getElementById('courseLine');
    if (line) {
        line.style.opacity = '1';
        setTimeout(() => {
            line.style.opacity = '0.5';
        }, 500);
    }
}

// ============================================
// RANDOM SYSTEM UPDATES
// ============================================

function startRandomUpdates() {
    // Random shield fluctuations
    setInterval(() => {
        if (shieldIntegrity > 0 && shieldIntegrity < 100) {
            const change = (Math.random() - 0.5) * 5;
            shieldIntegrity = Math.max(0, Math.min(100, shieldIntegrity + change));
            updateShieldDisplay(shieldIntegrity);
        }
    }, 2000);
    
    // Random comms messages
    const messages = [
        { source: 'NAVIGATION', text: 'Long-range sensors detecting anomalous readings.' },
        { source: 'SCIENCE', text: 'Stellar cartography update complete.' },
        { source: 'TACTICAL', text: 'Weapon systems charged and standing by.' },
        { source: 'ENGINEERING', text: 'Dilithium chamber pressure nominal.' },
        { source: 'MEDICAL', text: 'Sickbay reports all stations ready.' },
        { source: 'OPS', text: 'Cargo bay inventory complete.' }
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            addCommsLog(msg.source, msg.text);
        }
    }, 10000);
    
    // Random engineering fluctuations
    setInterval(() => {
        const coreFill = document.getElementById('coreFill');
        if (coreFill) {
            const width = 60 + Math.random() * 20;
            coreFill.style.width = width + '%';
        }
    }, 5000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Prevent context menu for immersive experience
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // W for warp
    if (e.key === 'w' || e.key === 'W') {
        const warpReadout = document.getElementById('warpReadout');
        const warp = warpReadout ? parseFloat(warpReadout.textContent) : 0;
        if (warp > 0) engageWarp(warp);
    }
    
    // Number keys for alerts
    if (e.key === '1') setAlert('red');
    if (e.key === '2') setAlert('yellow');
    if (e.key === '3') setAlert('blue');
});

// Mouse parallax for star field
document.addEventListener('mousemove', (e) => {
    const starField = document.getElementById('starField');
    if (!starField) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    
    starField.style.transform = `translate(${x}px, ${y}px)`;
});
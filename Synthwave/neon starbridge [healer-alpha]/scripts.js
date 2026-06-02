/* ==========================================
   USS NEON HORIZON - BRIDGE CONSOLE
   Interactive Systems Controller
   ========================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initStarfield();
    initMissionClock();
    initCoordinateSystem();
    initNavigation();
    initWarpDrive();
    initShieldRing();
    initTargetingSystem();
    initWeapons();
    initCommunications();
    initPowerSystems();
    initStarfieldParallax();
});

/* ==========================================
   STARFIELD PARALLAX
   ========================================== */

function initStarfieldParallax() {
    const starfield = document.getElementById('starfield');
    const layers = starfield.querySelectorAll('.stars-layer');
    
    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        layers[0].style.transform = `translate(${x * 5}px, ${y * 5}px)`;
        layers[1].style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        layers[2].style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    });
}

function initStarfield() {
    // Generate additional dynamic stars
    const starfield = document.getElementById('starfield');
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 2 + 1}px;
            height: ${Math.random() * 2 + 1}px;
            background: ${Math.random() > 0.7 ? '#00ffff' : Math.random() > 0.5 ? '#ff00ff' : '#ffffff'};
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        starfield.appendChild(star);
    }
    
    // Add twinkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================
   MISSION CLOCK
   ========================================== */

let missionStartTime = Date.now();

function initMissionClock() {
    const missionTimeEl = document.getElementById('missionTime');
    const stardateEl = document.getElementById('stardate');
    
    function updateClock() {
        const elapsed = Date.now() - missionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        missionTimeEl.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update stardate (simulated)
        const baseStardate = 58432.7;
        const stardateIncrement = elapsed / 1000000; // 1 second real = 0.001 stardate
        stardateEl.textContent = (baseStardate + stardateIncrement).toFixed(1);
    }
    
    setInterval(updateClock, 1000);
    updateClock();
}

/* ==========================================
   COORDINATE SYSTEM
   ========================================== */

function initCoordinateSystem() {
    const coordX = document.getElementById('coordX');
    const coordY = document.getElementById('coordY');
    const coordZ = document.getElementById('coordZ');
    const distValue = document.getElementById('distValue');
    
    let x = 847.239;
    let y = -234.891;
    let z = 1923.445;
    let distance = 4.246;
    
    function updateCoordinates() {
        // Simulate movement
        x += (Math.random() - 0.3) * 0.01;
        y += (Math.random() - 0.5) * 0.005;
        z += (Math.random() - 0.2) * 0.02;
        distance = Math.max(0, distance - 0.00001);
        
        coordX.textContent = `+${x.toFixed(3).padStart(7, '0')}`;
        coordY.textContent = `${y.toFixed(3).padStart(8, '0')}`;
        coordZ.textContent = `+${z.toFixed(3).padStart(7, '0')}`;
        distValue.textContent = distance.toFixed(3);
    }
    
    setInterval(updateCoordinates, 500);
}

/* ==========================================
   NAVIGATION SYSTEM
   ========================================== */

let currentHeading = 247.3;
let warpFactor = 7.2;
let fieldStability = 98.7;

function initNavigation() {
    const compassNeedle = document.querySelector('.compass-needle');
    const headingValue = document.getElementById('headingValue');
    const warpBtns = document.querySelectorAll('.warp-btn');
    const warpNumber = document.getElementById('warpNumber');
    const stabilityFill = document.getElementById('stabilityFill');
    const stabilityValue = document.getElementById('stabilityValue');
    
    // Update compass heading
    function updateHeading() {
        currentHeading += (Math.random() - 0.5) * 0.5;
        if (currentHeading < 0) currentHeading += 360;
        if (currentHeading >= 360) currentHeading -= 360;
        
        compassNeedle.style.transform = `translate(-50%, -100%) rotate(${currentHeading}deg)`;
        headingValue.textContent = currentHeading.toFixed(1);
    }
    
    setInterval(updateHeading, 100);
    
    // Warp drive controls
    warpBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            
            if (action === 'increase' && warpFactor < 10) {
                warpFactor = Math.min(10, warpFactor + 0.1);
            } else if (action === 'decrease' && warpFactor > 1) {
                warpFactor = Math.max(1, warpFactor - 0.1);
            }
            
            warpNumber.textContent = warpFactor.toFixed(1);
            updateWarpFill();
            
            // Update stability based on warp factor
            fieldStability = 100 - (warpFactor - 1) * 3 + Math.random() * 2;
            fieldStability = Math.min(100, Math.max(0, fieldStability));
            stabilityFill.style.width = `${fieldStability}%`;
            stabilityValue.textContent = `${fieldStability.toFixed(1)}%`;
            
            // Update ETA based on warp
            updateETA();
            
            addLogEntry('system', `Warp factor adjusted to ${warpFactor.toFixed(1)}`);
        });
    });
    
    // Initialize warp fill
    updateWarpFill();
}

function updateWarpFill() {
    const warpFill = document.getElementById('warpFill');
    const maxDash = 264; // Circumference
    const percentage = warpFactor / 10;
    const dashOffset = maxDash * (1 - percentage);
    warpFill.style.strokeDashoffset = dashOffset;
}

function updateETA() {
    const etaValue = document.getElementById('etaValue');
    const baseDays = 147;
    const adjustedDays = Math.round(baseDays * (7.2 / warpFactor));
    etaValue.textContent = `${adjustedDays} DAYS`;
}

/* ==========================================
   SHIELD RING
   ========================================== */

let shieldIntegrity = 100;

function initShieldRing() {
    const shieldBar = document.getElementById('shieldBar');
    const shieldPercent = document.getElementById('shieldPercent');
    
    function updateShieldRing() {
        const circumference = 2 * Math.PI * 90; // 565
        const offset = circumference * (1 - shieldIntegrity / 100);
        shieldBar.style.strokeDashoffset = offset;
        shieldPercent.textContent = Math.round(shieldIntegrity);
    }
    
    // Simulate minor shield fluctuations
    setInterval(() => {
        shieldIntegrity += (Math.random() - 0.5) * 0.5;
        shieldIntegrity = Math.max(0, Math.min(100, shieldIntegrity));
        updateShieldRing();
    }, 2000);
    
    updateShieldRing();
    
    // Shield boost button
    const shieldBoost = document.getElementById('shieldBoost');
    shieldBoost.addEventListener('click', () => {
        shieldIntegrity = Math.min(100, shieldIntegrity + 10);
        updateShieldRing();
        updateShieldQuadrants();
        addLogEntry('system', 'Shield boost activated - integrity increased');
    });
    
    // Shield harmonize button
    const shieldHarmonize = document.getElementById('shieldHarmonize');
    shieldHarmonize.addEventListener('click', () => {
        shieldIntegrity = 100;
        updateShieldRing();
        harmonizeShieldQuadrants();
        addLogEntry('system', 'Shield harmonization complete - all quadrants balanced');
    });
}

function updateShieldQuadrants() {
    const quadrants = ['Front', 'Rear', 'Port', 'Starboard'];
    quadrants.forEach(quad => {
        const el = document.getElementById(`shield${quad}`);
        const fill = el.querySelector('.quad-fill');
        const value = el.querySelector('.quad-value');
        const percent = Math.min(100, parseInt(value.textContent) + 10);
        fill.style.width = `${percent}%`;
        value.textContent = `${percent}%`;
    });
}

function harmonizeShieldQuadrants() {
    const quadrants = ['Front', 'Rear', 'Port', 'Starboard'];
    quadrants.forEach(quad => {
        const el = document.getElementById(`shield${quad}`);
        const fill = el.querySelector('.quad-fill');
        const value = el.querySelector('.quad-value');
        fill.style.width = '100%';
        value.textContent = '100%';
    });
}

/* ==========================================
   TARGETING SYSTEM
   ========================================== */

const targetClasses = ['FREIGHTER', 'SCOUT', 'CRUISER', 'DESTROYER', 'UNKNOWN'];
const targetNames = ['KLINGON BIRD OF PREY', 'ROMULAN WARBIRD', 'CARGO VESSEL', 'DERELICT', 'ASTEROID'];
let targetLocked = false;
let currentTarget = null;

function initTargetingSystem() {
    const reticleOuter = document.getElementById('reticleOuter');
    const targetName = document.querySelector('.target-name');
    const targetDist = document.querySelector('.target-dist');
    const lockStatus = document.getElementById('lockStatus');
    const targetStatus = document.getElementById('targetStatus');
    const targetClass = document.getElementById('targetClass');
    const targetThreat = document.getElementById('targetThreat');
    
    // Random target simulation
    function simulateTargetScan() {
        if (!targetLocked) {
            const hasTarget = Math.random() > 0.7;
            
            if (hasTarget) {
                currentTarget = {
                    name: targetNames[Math.floor(Math.random() * targetNames.length)],
                    class: targetClasses[Math.floor(Math.random() * targetClasses.length)],
                    distance: (Math.random() * 100 + 5).toFixed(1),
                    threat: Math.floor(Math.random() * 8) + 1
                };
                
                targetName.textContent = `TARGET: ${currentTarget.name}`;
                targetDist.textContent = `DIST: ${currentTarget.distance} KM`;
                targetStatus.textContent = 'DETECTED';
                targetClass.textContent = currentTarget.class;
                targetThreat.textContent = `${currentTarget.threat}/10`;
                
                // Change threat color based on level
                if (currentTarget.threat >= 6) {
                    targetThreat.style.color = '#ff0040';
                } else if (currentTarget.threat >= 3) {
                    targetThreat.style.color = '#ffaa00';
                } else {
                    targetThreat.style.color = '#00ff80';
                }
                
                lockStatus.textContent = 'TARGET DETECTED';
                lockStatus.style.color = '#ffaa00';
            }
        }
    }
    
    setInterval(simulateTargetScan, 3000);
    
    // Click to lock target
    reticleOuter.addEventListener('click', () => {
        if (currentTarget && !targetLocked) {
            targetLocked = true;
            lockStatus.textContent = 'TARGET LOCKED';
            lockStatus.style.color = '#ff0080';
            lockStatus.style.animation = 'none';
            targetStatus.textContent = 'LOCKED';
            addLogEntry('system', `Target lock acquired: ${currentTarget.name}`);
        } else if (targetLocked) {
            targetLocked = false;
            lockStatus.textContent = 'SCAN MODE';
            lockStatus.style.color = '#00ffff';
            lockStatus.style.animation = 'scan-flash 1.5s ease-in-out infinite';
            targetStatus.textContent = 'SCANNING';
            currentTarget = null;
            targetName.textContent = 'TARGET: UNKNOWN';
            targetDist.textContent = 'DIST: ---';
            targetClass.textContent = '---';
            targetThreat.textContent = '---/10';
            addLogEntry('system', 'Target lock released');
        }
    });
}

/* ==========================================
   WEAPONS SYSTEMS
   ========================================== */

let phaserEnergy1 = 100;
let phaserEnergy2 = 100;
let torpedoReserve = 247;
let tubeStatus = ['LOADED', 'LOADED', 'LOADING', 'EMPTY'];

function initWeapons() {
    const fireBtn = document.getElementById('fireBtn');
    const phaserFill1 = document.getElementById('phaserFill1');
    const phaserFill2 = document.getElementById('phaserFill2');
    const phaserValue1 = document.getElementById('phaserValue1');
    const phaserValue2 = document.getElementById('phaserValue2');
    const torpedoReserveEl = document.getElementById('torpedoReserve');
    
    // Phaser recharge simulation
    setInterval(() => {
        phaserEnergy1 = Math.min(100, phaserEnergy1 + 2);
        phaserEnergy2 = Math.min(100, phaserEnergy2 + 2);
        
        phaserFill1.style.width = `${phaserEnergy1}%`;
        phaserFill2.style.width = `${phaserEnergy2}%`;
        phaserValue1.textContent = `${Math.round(phaserEnergy1)}%`;
        phaserValue2.textContent = `${Math.round(phaserEnergy2)}%`;
    }, 500);
    
    // Torpedo loading simulation
    setInterval(() => {
        for (let i = 0; i < tubeStatus.length; i++) {
            if (tubeStatus[i] === 'LOADING') {
                tubeStatus[i] = 'LOADED';
                updateTubeDisplay(i + 1);
            } else if (tubeStatus[i] === 'EMPTY' && torpedoReserve > 0) {
                if (Math.random() > 0.7) {
                    tubeStatus[i] = 'LOADING';
                    updateTubeDisplay(i + 1);
                }
            }
        }
    }, 2000);
    
    // Fire button
    fireBtn.addEventListener('click', () => {
        if (targetLocked && (phaserEnergy1 > 20 || tubeStatus.includes('LOADED'))) {
            // Fire phasers
            if (phaserEnergy1 >= 20) {
                phaserEnergy1 -= 30;
                phaserFill1.style.width = `${phaserEnergy1}%`;
                phaserValue1.textContent = `${Math.round(phaserEnergy1)}%`;
                addLogEntry('system', 'Phaser bank Alpha fired');
            }
            
            // Fire torpedo if available
            const loadedTubeIndex = tubeStatus.indexOf('LOADED');
            if (loadedTubeIndex !== -1) {
                tubeStatus[loadedTubeIndex] = 'EMPTY';
                torpedoReserve--;
                updateTubeDisplay(loadedTubeIndex + 1);
                torpedoReserveEl.textContent = torpedoReserve;
                addLogEntry('system', `Photon torpedo launched from Tube ${loadedTubeIndex + 1}`);
            }
            
            // Visual feedback
            fireBtn.style.boxShadow = '0 0 30px #ff0080, inset 0 0 30px rgba(255, 0, 128, 0.5)';
            setTimeout(() => {
                fireBtn.style.boxShadow = '';
            }, 200);
            
            // Damage target if locked
            if (currentTarget && Math.random() > 0.3) {
                addLogEntry('incoming', `Direct hit on ${currentTarget.name}!`);
            }
        } else if (!targetLocked) {
            addLogEntry('system', 'WARNING: No target locked');
        }
    });
}

function updateTubeDisplay(tubeNum) {
    const tube = document.getElementById(`tube${tubeNum}`);
    const icon = tube.querySelector('.tube-icon');
    const status = tube.querySelector('.tube-status');
    const statusText = tubeStatus[tubeNum - 1];
    
    status.textContent = statusText;
    
    if (statusText === 'LOADED') {
        icon.textContent = '◇';
        icon.classList.remove('empty');
        status.classList.remove('empty');
        status.style.color = '#00ff80';
    } else if (statusText === 'LOADING') {
        icon.textContent = '◇';
        icon.classList.remove('empty');
        status.classList.remove('empty');
        status.style.color = '#ffaa00';
    } else {
        icon.textContent = '○';
        icon.classList.add('empty');
        status.classList.add('empty');
        status.style.color = '';
    }
}

/* ==========================================
   COMMUNICATIONS SYSTEM
   ========================================== */

let currentFreq = 147.842;
let currentChannel = 1;

function initCommunications() {
    const freqVisualizer = document.getElementById('freqVisualizer');
    const freqValue = document.getElementById('freqValue');
    const freqUp = document.getElementById('freqUp');
    const freqDown = document.getElementById('freqDown');
    const freqScan = document.getElementById('freqScan');
    const signalBars = document.querySelectorAll('.sig-bar');
    const signalValue = document.getElementById('signalValue');
    const channels = document.querySelectorAll('.channel');
    const transmitBtn = document.getElementById('transmitBtn');
    const transmitInput = document.getElementById('transmitInput');
    
    // Create frequency visualizer bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'freq-bar';
        bar.style.height = `${Math.random() * 40 + 10}px`;
        freqVisualizer.appendChild(bar);
    }
    
    // Animate frequency visualizer
    const freqBars = freqVisualizer.querySelectorAll('.freq-bar');
    setInterval(() => {
        freqBars.forEach(bar => {
            bar.style.height = `${Math.random() * 40 + 10}px`;
        });
    }, 100);
    
    // Frequency controls
    freqUp.addEventListener('click', () => {
        currentFreq = Math.min(999.999, currentFreq + 0.1);
        freqValue.textContent = currentFreq.toFixed(3);
        addLogEntry('system', `Frequency adjusted to ${currentFreq.toFixed(3)} MHz`);
    });
    
    freqDown.addEventListener('click', () => {
        currentFreq = Math.max(1, currentFreq - 0.1);
        freqValue.textContent = currentFreq.toFixed(3);
        addLogEntry('system', `Frequency adjusted to ${currentFreq.toFixed(3)} MHz`);
    });
    
    freqScan.addEventListener('click', () => {
        // Simulate frequency scan
        let scanCount = 0;
        const scanInterval = setInterval(() => {
            currentFreq = Math.random() * 500 + 100;
            freqValue.textContent = currentFreq.toFixed(3);
            scanCount++;
            
            if (scanCount >= 10) {
                clearInterval(scanInterval);
                addLogEntry('system', `Scan complete - Active frequency: ${currentFreq.toFixed(3)} MHz`);
            }
        }, 100);
    });
    
    // Signal strength animation
    setInterval(() => {
        let strength = 0;
        signalBars.forEach((bar, index) => {
            const isActive = Math.random() > 0.2;
            if (isActive) {
                bar.style.opacity = '1';
                strength += 12.5;
            } else {
                bar.style.opacity = '0.3';
            }
        });
        signalValue.textContent = `${Math.round(strength)}%`;
    }, 500);
    
    // Channel selection
    channels.forEach(channel => {
        channel.addEventListener('click', () => {
            channels.forEach(ch => ch.classList.remove('active'));
            channel.classList.add('active');
            currentChannel = parseInt(channel.dataset.channel);
            const channelName = channel.querySelector('.ch-name').textContent;
            addLogEntry('system', `Switched to ${channelName} (CH ${currentChannel})`);
        });
    });
    
    // Transmit functionality
    transmitBtn.addEventListener('click', () => {
        const message = transmitInput.value.trim();
        if (message) {
            addLogEntry('outgoing', `[SENT] ${message}`);
            transmitInput.value = '';
            
            // Simulate response
            setTimeout(() => {
                const responses = [
                    'Acknowledged.',
                    'Message received. Standing by.',
                    'Copy that, Neon Horizon.',
                    'Understood. Continue current course.',
                    'Transmission confirmed.'
                ];
                addLogEntry('incoming', `[STARFLEET] ${responses[Math.floor(Math.random() * responses.length)]}`);
            }, 2000 + Math.random() * 3000);
        }
    });
    
    transmitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            transmitBtn.click();
        }
    });
}

/* ==========================================
   MESSAGE LOG
   ========================================== */

function addLogEntry(type, message) {
    const messageLog = document.getElementById('messageLog');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-msg">${message}</span>
    `;
    
    messageLog.insertBefore(entry, messageLog.firstChild);
    
    // Keep only last 50 entries
    while (messageLog.children.length > 50) {
        messageLog.removeChild(messageLog.lastChild);
    }
}

/* ==========================================
   POWER SYSTEMS
   ========================================== */

function initPowerSystems() {
    const impulseFill = document.getElementById('impulseFill');
    const impulseValue = document.getElementById('impulseValue');
    const reactorValue = document.getElementById('reactorValue');
    const powerBars = document.querySelectorAll('.power-bar .power-fill');
    
    let impulseLevel = 75;
    let reactorOutput = 94.2;
    
    // Animate power bars
    setInterval(() => {
        powerBars.forEach(bar => {
            const currentHeight = parseFloat(bar.style.height) || 80;
            const newHeight = currentHeight + (Math.random() - 0.5) * 10;
            bar.style.height = `${Math.max(20, Math.min(100, newHeight))}%`;
        });
    }, 500);
    
    // Reactor output fluctuation
    setInterval(() => {
        reactorOutput += (Math.random() - 0.5) * 2;
        reactorOutput = Math.max(80, Math.min(100, reactorOutput));
        reactorValue.textContent = reactorOutput.toFixed(1);
    }, 1000);
    
    // Impulse engine fluctuation
    setInterval(() => {
        impulseLevel += (Math.random() - 0.5) * 5;
        impulseLevel = Math.max(50, Math.min(100, impulseLevel));
        impulseFill.style.width = `${impulseLevel}%`;
        impulseValue.textContent = `${Math.round(impulseLevel)}%`;
    }, 1500);
}

/* ==========================================
   RANDOM EVENTS
   ========================================== */

// Simulate random incoming messages
setInterval(() => {
    if (Math.random() > 0.8) {
        const messages = [
            'Long-range sensors detecting anomalies in sector 4.',
            'Subspace interference detected. Adjusting frequencies.',
            'Navigation beacon updated. Course correction applied.',
            'Background radiation levels nominal.',
            'Deep space telemetry received from Starbase 7.',
            'Asteroid field detected 2 light-years ahead.',
            'Subspace relay station signal acquired.',
            'Cosmic ray burst detected. Shields holding.'
        ];
        addLogEntry('incoming', `[STARFLEET] ${messages[Math.floor(Math.random() * messages.length)]}`);
    }
}, 15000);

// Simulate random system events
setInterval(() => {
    if (Math.random() > 0.85) {
        const events = [
            'Plasma conduits realigned.',
            'Deuterium reserves at optimal levels.',
            'Lateral array calibration complete.',
            'Environmental systems check passed.',
            'Computer core diagnostic complete.'
        ];
        addLogEntry('system', `[SYSTEM] ${events[Math.floor(Math.random() * events.length)]}`);
    }
}, 20000);

// Simulate occasional shield damage
setInterval(() => {
    if (Math.random() > 0.95 && shieldIntegrity > 50) {
        const damage = Math.random() * 10 + 5;
        shieldIntegrity = Math.max(0, shieldIntegrity - damage);
        
        // Update specific quadrant
        const quadrants = ['Front', 'Rear', 'Port', 'Starboard'];
        const quad = quadrants[Math.floor(Math.random() * quadrants.length)];
        const el = document.getElementById(`shield${quad}`);
        const fill = el.querySelector('.quad-fill');
        const value = el.querySelector('.quad-value');
        const newPercent = Math.max(0, parseInt(value.textContent) - Math.round(damage));
        fill.style.width = `${newPercent}%`;
        value.textContent = `${newPercent}%`;
        
        addLogEntry('system', `WARNING: Shield impact on ${quad} quadrant`);
    }
}, 30000);

/* ==========================================
   KEYBOARD SHORTCUTS
   ========================================== */

document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 't':
            document.getElementById('reticleOuter').click();
            break;
        case 'f':
            document.getElementById('fireBtn').click();
            break;
        case 'b':
            document.getElementById('shieldBoost').click();
            break;
        case 'h':
            document.getElementById('shieldHarmonize').click();
            break;
        case 'arrowup':
            document.getElementById('freqUp').click();
            break;
        case 'arrowdown':
            document.getElementById('freqDown').click();
            break;
        case '+':
        case '=':
            document.querySelector('[data-action="increase"]').click();
            break;
        case '-':
            document.querySelector('[data-action="decrease"]').click();
            break;
    }
});

/* ==========================================
   INITIALIZATION COMPLETE
   ========================================== */

console.log('%c USS NEON HORIZON - Bridge Console v3.87 ', 
    'background: linear-gradient(90deg, #ff00ff, #00ffff); color: #000; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c All systems initialized and online.', 
    'color: #00ff80; font-size: 12px;');
console.log('%c Keyboard shortcuts: T=target, F=fire, B=boost shields, H=harmonize, +/-=warp', 
    'color: #00ffff; font-size: 10px;');
// =========================================
// STARSHIP BRIDGE CONSOLE - SYNTHWAVE EDITION
// JavaScript Controller
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initStarField();
    initClock();
    initNavigation();
    initShields();
    initWeapons();
    initComms();
    initEmergencyAlerts();
    initEffects();
});

// =========================================
// STAR FIELD GENERATOR
// =========================================
function initStarField() {
    const starField = document.getElementById('starField');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random twinkle duration
        star.style.setProperty('--twinkle-duration', `${Math.random() * 3 + 2}s`);
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        // Parallax layers (closer stars move faster)
        const speed = Math.random() * 0.5 + 0.1;
        star.dataset.speed = speed;
        
        starField.appendChild(star);
    }
    
    // Animate star movement
    animateStars();
}

function animateStars() {
    const stars = document.querySelectorAll('.star');
    let positions = new Array(stars.length).fill(0).map(() => Math.random() * 100);
    
    function update() {
        stars.forEach((star, i) => {
            const speed = parseFloat(star.dataset.speed);
            positions[i] += speed;
            if (positions[i] > 100) positions[i] = 0;
            star.style.top = `${positions[i]}%`;
        });
        requestAnimationFrame(update);
    }
    update();
}

// =========================================
// CLOCK & STARDATE
// =========================================
function initClock() {
    const timeDisplay = document.querySelector('.clock-display .time');
    const dateDisplay = document.querySelector('.clock-display .date');
    let stardate = 0;
    
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        timeDisplay.textContent = timeStr;
        
        // Simple stardate calculation (fictional)
        stardate += 0.001;
        const stardateStr = stardate.toFixed(1);
        dateDisplay.textContent = `STARDATE ${stardateStr}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// =========================================
// NAVIGATION SYSTEM
// =========================================
function initNavigation() {
    const navX = document.getElementById('navX');
    const navY = document.getElementById('navY');
    const navZ = document.getElementById('navZ');
    const warpRing = document.getElementById('warpRing');
    const warpValue = document.getElementById('warpValue');
    
    // Current coordinates
    let coords = { x: 123.45, y: 678.90, z: 234.56 };
    let currentWarp = 6.5;
    let targetWarp = 6.5;
    
    // Update coordinates with slight random variation
    setInterval(() => {
        coords.x += (Math.random() - 0.5) * 0.1;
        coords.y += (Math.random() - 0.5) * 0.1;
        coords.z += (Math.random() - 0.5) * 0.1;
        
        navX.textContent = coords.x.toFixed(2);
        navY.textContent = coords.y.toFixed(2);
        navZ.textContent = coords.z.toFixed(2);
    }, 1000);
    
    // Animate warp ring
    function animateWarpRing() {
        const circumference = 339.292;
        const dashOffset = circumference - (currentWarp / 10) * circumference;
        warpRing.style.strokeDasharray = `${circumference} ${circumference}`;
        warpRing.style.strokeDashoffset = dashOffset;
        warpRing.style.stroke = getWarpColor(currentWarp);
        warpValue.textContent = currentWarp.toFixed(1);
    }
    
    function getWarpColor(warp) {
        if (warp < 5) return '#00d4ff'; // cyan
        if (warp < 7) return '#b026ff'; // purple
        if (warp < 9) return '#ff00ff'; // pink
        return '#ff5e00'; // orange
    }
    
    // Smooth warp factor transition
    function updateWarp() {
        if (Math.abs(currentWarp - targetWarp) > 0.01) {
            currentWarp += (targetWarp - currentWarp) * 0.05;
            animateWarpRing();
            requestAnimationFrame(updateWarp);
        }
    }
    
    // Button handlers
    document.getElementById('impulseBtn').addEventListener('click', () => {
        targetWarp = 0.5;
        setActiveButton('impulseBtn');
    });
    
    document.getElementById('warpBtn').addEventListener('click', () => {
        targetWarp = 8.2;
        setActiveButton('warpBtn');
    });
    
    document.getElementById('stopBtn').addEventListener('click', () => {
        targetWarp = 0;
        setActiveButton('stopBtn');
    });
    
    function setActiveButton(activeId) {
        document.querySelectorAll('.nav-controls .control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }
    
    animateWarpRing();
    setInterval(updateWarp, 50);
}

// =========================================
// SHIELDS SYSTEM
// =========================================
function initShields() {
    const shieldRing = document.getElementById('shieldRing');
    const shieldPercent = document.getElementById('shieldPercent');
    const shieldForward = document.getElementById('shieldForward');
    const shieldAft = document.getElementById('shieldAft');
    const shieldPort = document.getElementById('shieldPort');
    const shieldStarboard = document.getElementById('shieldStarboard');
    const shieldFreq = document.getElementById('shieldFreq');
    const shieldFreqValue = document.getElementById('shieldFreqValue');
    const shieldToggle = document.getElementById('shieldToggle');
    
    // Shield integrity
    let overallIntegrity = 78;
    let shieldsActive = true;
    let shieldDegradation = 0;
    
    const circumference = 339.292; // 2 * PI * 54
    
    function updateShields() {
        // Random degradation over time
        if (shieldsActive && Math.random() < 0.01) {
            shieldDegradation += Math.random() * 2;
            overallIntegrity = Math.max(0, 78 - shieldDegradation);
            
            // Update overall ring
            const dashOffset = circumference - (overallIntegrity / 100) * circumference;
            shieldRing.style.strokeDashoffset = dashOffset;
            shieldPercent.textContent = Math.round(overallIntegrity);
            
            // Update sector bars with variation
            const forward = Math.min(100, 85 - shieldDegradation * (0.8 + Math.random() * 0.4));
            const aft = Math.min(100, 72 - shieldDegradation * (0.7 + Math.random() * 0.3));
            const port = Math.min(100, 68 - shieldDegradation * (0.6 + Math.random() * 0.4));
            const starboard = Math.min(100, 81 - shieldDegradation * (0.9 + Math.random() * 0.2));
            
            shieldForward.style.width = `${forward}%`;
            shieldAft.style.width = `${aft}%`;
            shieldPort.style.width = `${port}%`;
            shieldStarboard.style.width = `${starboard}%`;
            
            // Change color based on integrity
            if (overallIntegrity < 30) {
                shieldRing.style.stroke = '#ff0044';
                shieldRing.style.filter = 'drop-shadow(0 0 8px #ff0044)';
            } else if (overallIntegrity < 60) {
                shieldRing.style.stroke = '#ffaa00';
                shieldRing.style.filter = 'drop-shadow(0 0 8px #ffaa00)';
            }
        }
        
        requestAnimationFrame(updateShields);
    }
    
    // Shield frequency slider
    shieldFreq.addEventListener('input', (e) => {
        const value = e.target.value;
        shieldFreqValue.textContent = `${value}.0`;
        
        // Update visual feedback
        const hue = 300 - (value / 100) * 60; // Purple to pink
        const color = `hsl(${hue}, 100%, 50%)`;
        document.documentElement.style.setProperty('--neon-pink', color);
    });
    
    // Modulation buttons
    document.querySelectorAll('.mod-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mod-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Change shield frequency based on modulation
            const mods = {
                'phase': 42,
                'harmonic': 67,
                'resonant': 89
            };
            shieldFreq.value = mods[btn.dataset.mod];
            shieldFreqValue.textContent = `${mods[btn.dataset.mod]}.0`;
        });
    });
    
    // Shield toggle
    shieldToggle.addEventListener('click', () => {
        shieldsActive = !shieldsActive;
        shieldToggle.classList.toggle('active', shieldsActive);
        shieldRing.style.opacity = shieldsActive ? 1 : 0.3;
        
        // Update panel status
        const statusEl = document.querySelector('.shields-panel .panel-status');
        if (shieldsActive) {
            statusEl.textContent = 'ACTIVE';
            statusEl.classList.remove('warning');
        } else {
            statusEl.textContent = 'INACTIVE';
            statusEl.classList.add('warning');
        }
    });
    
    // Initial shield ring
    shieldRing.style.strokeDasharray = `${circumference} ${circumference}`;
    shieldRing.style.strokeDashoffset = circumference - (overallIntegrity / 100) * circumference;
    
    updateShields();
}

// =========================================
// WEAPONS SYSTEM
// =========================================
function initWeapons() {
    const targetName = document.getElementById('targetName');
    const targetDistance = document.getElementById('targetDistance');
    const targetVelocity = document.getElementById('targetVelocity');
    const threatLevel = document.getElementById('threatLevel');
    const phaserPower = document.getElementById('phaserPower');
    const firePhasers = document.getElementById('firePhasers');
    const fireTorpedoes = document.getElementById('fireTorpedoes');
    const targetReticle = document.getElementById('targetReticle');
    
    let targetAcquired = false;
    let torpedoCount = 12;
    
    // Simulate target acquisition
    const targets = [
        { name: 'ROMULAN WARBIRD', class: 'D7-Class Cruiser', distance: 25000, velocity: 0.75, threat: 'HIGH' },
        { name: 'KLINGON BIRD-OF-PREY', class: 'BOP-Class', distance: 18000, velocity: 0.92, threat: 'MEDIUM' },
        { name: 'FERENGI MARAUDER', class: 'Keldon-Class', distance: 32000, velocity: 0.45, threat: 'LOW' },
        { name: 'BORG CUBE', class: 'Biomass Vessel', distance: 50000, velocity: 0.3, threat: 'EXTREME' },
        { name: 'CARDASSIAN GALOR', class: 'Galor-Class', distance: 22000, velocity: 0.68, threat: 'MEDIUM' }
    ];
    
    // Auto-acquire random target periodically
    setInterval(() => {
        if (!targetAcquired && Math.random() < 0.3) {
            acquireTarget();
        }
    }, 10000);
    
    function acquireTarget() {
        const target = targets[Math.floor(Math.random() * targets.length)];
        targetAcquired = true;
        
        // Show reticle animation
        targetReticle.classList.add('active');
        
        // Update display
        targetName.textContent = target.name;
        targetName.style.color = getThreatColor(target.threat);
        document.querySelector('.target-class').textContent = target.class;
        targetDistance.textContent = `${target.distance.toLocaleString()} km`;
        targetVelocity.textContent = `${(target.velocity * 299792).toFixed(0)} km/s`;
        threatLevel.textContent = target.threat;
        threatLevel.className = 'stat-value ' + getThreatClass(target.threat);
        
        // Fade out reticle after 3 seconds
        setTimeout(() => {
            targetReticle.classList.remove('active');
        }, 3000);
    }
    
    function getThreatColor(threat) {
        switch(threat) {
            case 'EXTREME': return '#ff0044';
            case 'HIGH': return '#ff5e00';
            case 'MEDIUM': return '#ffaa00';
            case 'LOW': return '#00ff88';
            default: return '#00d4ff';
        }
    }
    
    function getThreatClass(threat) {
        switch(threat) {
            case 'EXTREME': return 'threat-high';
            case 'HIGH': return 'threat-high';
            case 'MEDIUM': return 'threat-medium';
            case 'LOW': return 'threat-low';
            default: return '';
        }
    }
    
    // Fire phasers
    firePhasers.addEventListener('click', () => {
        if (!targetAcquired) {
            showAlert('NO TARGET LOCKED');
            return;
        }
        
        firePhasers.classList.add('firing');
        const phaserLight = document.querySelector('.weapon-type:first-child .status-light');
        phaserLight.classList.add('firing');
        
        // Power drain effect
        let power = 100;
        const drainInterval = setInterval(() => {
            power -= 20;
            phaserPower.style.width = `${power}%`;
            if (power <= 0) {
                clearInterval(drainInterval);
                setTimeout(() => {
                    firePhasers.classList.remove('firing');
                    phaserLight.classList.remove('firing');
                    phaserPower.style.width = '100%';
                }, 500);
            }
        }, 100);
        
        // Screen shake effect
        document.body.style.animation = 'shake 0.2s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 200);
    });
    
    // Fire torpedoes
    fireTorpedoes.addEventListener('click', () => {
        if (torpedoCount <= 0) {
            showAlert('NO TORPEDOES REMAINING');
            return;
        }
        
        if (!targetAcquired) {
            showAlert('NO TARGET LOCKED');
            return;
        }
        
        fireTorpedoes.classList.add('firing');
        torpedoCount--;
        document.querySelector('.torpedo-count .count-number').textContent = torpedoCount;
        
        // Create torpedo effect
        createTorpedoEffect();
        
        setTimeout(() => {
            fireTorpedoes.classList.remove('firing');
        }, 500);
        
        // Reload after 5 seconds if count is low
        if (torpedoCount < 5) {
            setTimeout(() => {
                torpedoCount = Math.min(12, torpedoCount + 1);
                document.querySelector('.torpedo-count .count-number').textContent = torpedoCount;
            }, 5000);
        }
    });
    
    function createTorpedoEffect() {
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.top = '50%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.width = '20px';
        effect.style.height = '20px';
        effect.style.background = 'radial-gradient(circle, #ffaa00, transparent)';
        effect.style.borderRadius = '50%';
        effect.style.boxShadow = '0 0 30px #ffaa00, 0 0 60px #ff5e00';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '9999';
        
        document.body.appendChild(effect);
        
        // Animate outward
        let size = 20;
        let opacity = 1;
        const expand = setInterval(() => {
            size += 10;
            opacity -= 0.05;
            effect.style.width = `${size}px`;
            effect.style.height = `${size}px`;
            effect.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(expand);
                effect.remove();
            }
        }, 50);
    }
    
    // Click on target display to acquire target manually
    document.querySelector('.target-display').addEventListener('click', acquireTarget);
}

// =========================================
// COMMUNICATIONS SYSTEM
// =========================================
function initComms() {
    const freqBars = document.getElementById('freqBars');
    const tuningKnob = document.getElementById('tuningKnob');
    const tuningValue = document.getElementById('tuningValue');
    const messageLog = document.getElementById('messageLog');
    const transmitBtn = document.getElementById('transmitBtn');
    const micWave = document.getElementById('micWave');
    const clearLog = document.getElementById('clearLog');
    
    // Generate frequency bars
    const barCount = 32;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'freq-bar';
        bar.style.height = '10%';
        freqBars.appendChild(bar);
    }
    
    const bars = document.querySelectorAll('.freq-bar');
    let currentFreq = 245.6;
    let isTransmitting = false;
    
    // Animate frequency bars (synthesizer effect)
    function animateFreqBars() {
        bars.forEach((bar, i) => {
            // Create wave pattern
            const wave = Math.sin(Date.now() / 500 + i * 0.5) * 0.5 + 0.5;
            const noise = Math.random() * 0.3;
            const height = (wave * 0.7 + noise * 0.3) * 80 + 10;
            bar.style.height = `${height}%`;
            
            // Color based on height
            const hue = 300 - (height / 100) * 60;
            bar.style.background = `linear-gradient(0deg, hsl(${hue}, 100%, 50%), hsl(${hue + 30}, 100%, 60%))`;
        });
        
        if (!isTransmitting) {
            requestAnimationFrame(animateFreqBars);
        }
    }
    animateFreqBars();
    
    // Tuning knob rotation
    let knobRotation = 45;
    tuningKnob.addEventListener('click', (e) => {
        const rect = tuningKnob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let degrees = angle * (180 / Math.PI) + 90;
        
        // Normalize to 0-360
        if (degrees < 0) degrees += 360;
        
        // Snap to 45-degree increments
        knobRotation = Math.round(degrees / 45) * 45;
        if (knobRotation >= 360) knobRotation = 0;
        
        tuningKnob.style.transform = `rotate(${knobRotation}deg)`;
        
        // Update frequency value
        currentFreq = 100 + (knobRotation / 360) * 400;
        tuningValue.textContent = `${currentFreq.toFixed(1)} MHz`;
        
        // Change frequency bar colors
        const hue = 300 - (knobRotation / 360) * 60;
        document.documentElement.style.setProperty('--neon-purple', `hsl(${hue}, 100%, 50%)`);
    });
    
    // Transmit button
    transmitBtn.addEventListener('mousedown', () => {
        isTransmitting = true;
        transmitBtn.classList.add('active');
        micWave.classList.add('active');
        
        // Start transmitting animation
        function transmitAnim() {
            if (!isTransmitting) return;
            bars.forEach((bar, i) => {
                const height = Math.random() * 90 + 10;
                bar.style.height = `${height}%`;
            });
            requestAnimationFrame(transmitAnim);
        }
        transmitAnim();
    });
    
    transmitBtn.addEventListener('mouseup', () => {
        isTransmitting = false;
        transmitBtn.classList.remove('active');
        micWave.classList.remove('active');
    });
    
    transmitBtn.addEventListener('mouseleave', () => {
        isTransmitting = false;
        transmitBtn.classList.remove('active');
        micWave.classList.remove('active');
    });
    
    // Clear log
    clearLog.addEventListener('click', () => {
        messageLog.innerHTML = '';
    });
    
    // Simulate incoming messages
    const incomingMessages = [
        { source: 'STARBASE 12', text: 'New mission parameters uploaded.' },
        { source: 'SCIENCE VESSEL', text: 'Anomalous readings detected in sector 7G.' },
        { source: 'FREIGHTER K-7', text: 'Thank you for escort, Titan. Clear to proceed.' },
        { source: 'UNKNOWN', text: 'Encrypted transmission intercepted. Decoding...' },
        { source: 'STARFLEET COMMAND', text: 'Recall to spacedock for maintenance.' },
        { source: 'MEDICAL SHIP', text: 'Plague outbreak on colony world. Requesting assistance.' },
        { source: 'KLINGON EMBASSY', text: 'Diplomatic summit in three days.' }
    ];
    
    function addMessage(source, text) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        entry.innerHTML = `
            <span class="entry-time">[${time}]</span>
            <span class="entry-source">${source}</span>
            <span class="entry-text">${text}</span>
        `;
        
        messageLog.appendChild(entry);
        messageLog.scrollTop = messageLog.scrollHeight;
        
        // Limit log entries
        if (messageLog.children.length > 20) {
            messageLog.removeChild(messageLog.firstChild);
        }
    }
    
    // Random incoming messages
    setInterval(() => {
        if (Math.random() < 0.1) {
            const msg = incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
            addMessage(msg.source, msg.text);
        }
    }, 15000);
}

// =========================================
// EMERGENCY ALERT SYSTEM
// =========================================
function initEmergencyAlerts() {
    const redAlert = document.getElementById('redAlert');
    const yellowAlert = document.getElementById('yellowAlert');
    const greenAlert = document.getElementById('greenAlert');
    const alertBanner = document.getElementById('alertBanner');
    const chromatic = document.getElementById('chromatic');
    
    let currentAlert = 'GREEN';
    
    function setAlert(level) {
        currentAlert = level;
        
        // Update banner
        alertBanner.className = 'alert-banner';
        const messages = {
            'RED': 'RED ALERT - COMBAT SITUATION',
            'YELLOW': 'YELLOW ALERT - INCREASED READINESS',
            'GREEN': 'SYSTEMS NOMINAL'
        };
        alertBanner.querySelector('.alert-text').textContent = messages[level];
        
        if (level === 'RED') {
            alertBanner.classList.add('danger');
            chromatic.classList.add('active');
            document.body.style.filter = 'contrast(1.2) brightness(1.1)';
        } else if (level === 'YELLOW') {
            alertBanner.classList.add('warning');
            chromatic.classList.remove('active');
            document.body.style.filter = 'contrast(1.1)';
        } else {
            chromatic.classList.remove('active');
            document.body.style.filter = '';
        }
        
        // Update system indicators
        updateSystemIndicators(level);
    }
    
    function updateSystemIndicators(alertLevel) {
        const indicators = document.querySelectorAll('.system-indicator');
        indicators.forEach(ind => {
            const system = ind.dataset.system;
            if (alertLevel === 'RED') {
                if (system === 'weapons' || system === 'shields') {
                    ind.classList.add('active');
                    ind.classList.remove('warning');
                } else {
                    ind.classList.remove('active');
                }
            } else if (alertLevel === 'YELLOW') {
                ind.classList.add('active');
                ind.classList.remove('warning');
            } else {
                ind.classList.add('active');
                if (system === 'shields') {
                    ind.classList.add('warning');
                } else {
                    ind.classList.remove('warning');
                }
            }
        });
    }
    
    redAlert.addEventListener('click', () => setAlert('RED'));
    yellowAlert.addEventListener('click', () => setAlert('YELLOW'));
    greenAlert.addEventListener('click', () => setAlert('GREEN'));
    
    // Initial state
    setAlert('GREEN');
    
    // Random alert simulation
    setInterval(() => {
        if (Math.random() < 0.05) {
            const alerts = ['GREEN', 'YELLOW', 'RED'];
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            setAlert(randomAlert);
            
            // Auto-resolve after 5 seconds (except for RED which stays longer)
            if (randomAlert !== 'RED') {
                setTimeout(() => setAlert('GREEN'), 5000);
            }
        }
    }, 30000);
}

// =========================================
// VISUAL EFFECTS
// =========================================
function initEffects() {
    // Add shake animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Chromatic aberration on alert
    const chromatic = document.getElementById('chromatic');
    
    // CRT flicker effect
    setInterval(() => {
        const crt = document.querySelector('.crt-overlay');
        if (crt && Math.random() < 0.02) {
            crt.style.opacity = 0.15 + Math.random() * 0.1;
            setTimeout(() => {
                crt.style.opacity = '';
            }, 50);
        }
    }, 100);
    
    // Panel hover effects
    document.querySelectorAll('.panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            panel.style.boxShadow = `
                inset 0 0 20px rgba(0, 0, 0, 0.3),
                0 4px 10px rgba(0, 0, 0, 0.2),
                0 0 20px var(--neon-cyan, rgba(0, 212, 255, 0.3))
            `;
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.boxShadow = `
                inset 0 0 20px rgba(0, 0, 0, 0.3),
                0 4px 10px rgba(0, 0, 0, 0.2)
            `;
        });
    });
    
    // Button ripple effects
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = 'width 0.6s, height 0.6s, opacity 0.6s';
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.width = '200px';
                ripple.style.height = '200px';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// =========================================
// UTILITY FUNCTIONS
// =========================================
function showAlert(message) {
    const banner = document.getElementById('alertBanner');
    banner.classList.add('warning');
    banner.querySelector('.alert-text').textContent = message;
    
    setTimeout(() => {
        banner.classList.remove('warning');
        banner.querySelector('.alert-text').textContent = 'SYSTEMS NOMINAL';
    }, 3000);
}

// =========================================
// GRID FLOOR ENHANCEMENT
// =========================================
// Add extra glow to grid floor lines
setInterval(() => {
    const gridFloor = document.getElementById('gridFloor');
    if (gridFloor) {
        const glowIntensity = 0.3 + Math.sin(Date.now() / 1000) * 0.2;
        gridFloor.style.opacity = glowIntensity;
    }
}, 100);

// =========================================
// INITIALIZATION COMPLETE
// =========================================
console.log('%c USS TITAN BRIDGE CONSOLE ', 'background: #0a001a; color: #00ffff; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Systems online. Synthwave protocols engaged. ', 'color: #ff00ff;');
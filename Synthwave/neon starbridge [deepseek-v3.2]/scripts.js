// scripts.js
// NOVA-SYNTHIA Bridge Console - Interactive Synthwave Experience

document.addEventListener('DOMContentLoaded', function() {
    console.log('NOVA-SYNTHIA Bridge Console initializing...');
    
    // ===== GLOBAL STATE =====
    const state = {
        alertActive: false,
        shieldsOnline: true,
        shieldIntegrity: 100,
        targetLocked: false,
        warpFactor: 0.0,
        commFrequency: 141.1,
        audioEnabled: true,
        nightMode: false,
        phaserCharge: 87,
        torpedoCount: 12,
        starDate: '83.7.15'
    };
    
    // ===== AUDIO SYSTEM =====
    const ambientAudio = document.getElementById('ambientAudio');
    ambientAudio.volume = 0.3;
    
    // Audio toggle
    document.getElementById('soundToggle').addEventListener('click', function() {
        state.audioEnabled = !state.audioEnabled;
        if (state.audioEnabled) {
            ambientAudio.play().catch(e => console.log('Audio play failed:', e));
            this.innerHTML = '<i class="fas fa-volume-up"></i> AUDIO';
            this.style.color = 'var(--synth-secondary)';
            addLogEntry('Audio systems activated.');
        } else {
            ambientAudio.pause();
            this.innerHTML = '<i class="fas fa-volume-mute"></i> AUDIO';
            this.style.color = '#888';
            addLogEntry('Audio systems muted.');
        }
    });
    
    // Try to play audio on load (with user interaction requirement)
    document.addEventListener('click', function initAudio() {
        if (state.audioEnabled && ambientAudio.paused) {
            ambientAudio.play().catch(e => console.log('Audio requires user interaction'));
        }
        document.removeEventListener('click', initAudio);
    });
    
    // ===== STARFIELD GENERATION =====
    function generateStarfield() {
        const starfield = document.getElementById('starfield');
        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // Random size and opacity for depth
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            const speed = Math.random() * 0.5 + 0.1; // Parallax speed
            
            star.style.cssText = `
                position: absolute;
                left: ${left}%;
                top: ${top}%;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                opacity: ${opacity};
                box-shadow: 0 0 ${size * 2}px white;
                animation: starTwinkle ${Math.random() * 5 + 3}s infinite alternate;
                z-index: 1;
            `;
            
            // Add parallax on scroll
            star.setAttribute('data-speed', speed);
            
            starfield.appendChild(star);
        }
        
        // Add CSS for twinkle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes starTwinkle {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Parallax on mouse move
        document.addEventListener('mousemove', function(e) {
            const stars = document.querySelectorAll('.starfield .star');
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            stars.forEach(star => {
                const speed = parseFloat(star.getAttribute('data-speed'));
                const x = xAxis * speed;
                const y = yAxis * speed;
                star.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
        
        addLogEntry('Starfield rendered with parallax effect.');
    }
    
    // ===== ALERT SYSTEM =====
    const alertOverlay = document.getElementById('alertOverlay');
    const alertButton = document.getElementById('alertButton');
    
    alertButton.addEventListener('click', function() {
        state.alertActive = !state.alertActive;
        
        if (state.alertActive) {
            alertOverlay.style.display = 'flex';
            document.body.style.animation = 'alertPulseBody 0.5s infinite alternate';
            addLogEntry('RED ALERT! All systems at maximum readiness.');
            
            // Add emergency CSS
            const alertStyle = document.createElement('style');
            alertStyle.textContent = `
                @keyframes alertPulseBody {
                    from { filter: brightness(1); }
                    to { filter: brightness(1.3); }
                }
            `;
            alertStyle.id = 'alertAnimation';
            document.head.appendChild(alertStyle);
        } else {
            alertOverlay.style.display = 'none';
            document.body.style.animation = '';
            const alertStyle = document.getElementById('alertAnimation');
            if (alertStyle) alertStyle.remove();
            addLogEntry('Alert status cleared. Returning to normal operations.');
        }
    });
    
    // ===== NAVIGATION PANEL =====
    const warpSlider = document.getElementById('warpSlider');
    const warpOutput = document.querySelector('.slider-value[for="warpSlider"]');
    const speedReadout = document.getElementById('speedReadout');
    
    warpSlider.addEventListener('input', function() {
        state.warpFactor = parseFloat(this.value);
        warpOutput.textContent = state.warpFactor.toFixed(1);
        speedReadout.textContent = `WARP FACTOR: ${state.warpFactor.toFixed(1)}`;
        
        // Update starfield speed based on warp
        const stars = document.querySelectorAll('.starfield .star');
        stars.forEach(star => {
            const baseSpeed = parseFloat(star.getAttribute('data-speed'));
            const warpSpeed = baseSpeed * (1 + state.warpFactor / 5);
            star.style.animationDuration = `${5 / (1 + state.warpFactor)}s`;
        });
        
        // Update coordinate display
        const coordDisplay = document.querySelector('.coord-display');
        const x = (Math.random() * 1000).toFixed(1);
        const y = (Math.random() * 1000).toFixed(1);
        const z = (Math.random() * 1000).toFixed(1);
        coordDisplay.value = `X: ${x} Y: ${y} Z: ${z}`;
        
        // Update grid coordinates
        const gridCoord = document.getElementById('gridCoord');
        const sectors = ['Λ-7', 'Ξ-12', 'Ω-3', 'Δ-9', 'Σ-5'];
        gridCoord.textContent = `SECTOR ${sectors[Math.floor(Math.random() * sectors.length)]}`;
    });
    
    // Plot Course button
    document.querySelector('.nav-panel .control-btn:nth-child(1)').addEventListener('click', function() {
        addLogEntry('Course plotted to new coordinates.');
        // Animate the star system
        const orbits = document.querySelectorAll('.orbit');
        orbits.forEach(orbit => {
            orbit.style.animationPlayState = 'running';
            orbit.style.animationDuration = `${Math.random() * 20 + 15}s`;
        });
    });
    
    // ===== SHIELDS PANEL =====
    const shieldToggle = document.getElementById('shieldToggle');
    const shieldIntegrityDisplay = document.getElementById('shieldIntegrity');
    const levelBar = document.querySelector('.level-bar');
    
    shieldToggle.addEventListener('click', function() {
        state.shieldsOnline = !state.shieldsOnline;
        
        if (state.shieldsOnline) {
            this.classList.add('active');
            this.innerHTML = '<i class="fas fa-power-off"></i> ONLINE';
            this.style.color = '#00ff00';
            
            // Recharge shields
            state.shieldIntegrity = 100;
            shieldIntegrityDisplay.textContent = state.shieldIntegrity;
            levelBar.style.setProperty('--level', '100%');
            
            // Activate shield ring animation
            document.querySelectorAll('.ring-segment').forEach(seg => {
                seg.style.animationPlayState = 'running';
            });
            
            addLogEntry('Deflector shields activated. Integrity at 100%.');
        } else {
            this.classList.remove('active');
            this.innerHTML = '<i class="fas fa-power-off"></i> OFFLINE';
            this.style.color = '#ff5555';
            
            // Stop shield ring animation
            document.querySelectorAll('.ring-segment').forEach(seg => {
                seg.style.animationPlayState = 'paused';
            });
            
            addLogEntry('Deflector shields deactivated. Hull exposed.');
        }
    });
    
    // Shield damage simulation
    function simulateShieldDamage() {
        if (!state.shieldsOnline || state.shieldIntegrity <= 0) return;
        
        // Random small damage
        const damage = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
        if (damage > 0) {
            state.shieldIntegrity = Math.max(0, state.shieldIntegrity - damage);
            shieldIntegrityDisplay.textContent = state.shieldIntegrity;
            levelBar.style.setProperty('--level', `${state.shieldIntegrity}%`);
            
            // Flash shield ring
            document.querySelectorAll('.ring-segment').forEach(seg => {
                seg.style.animationDuration = '0.3s';
                setTimeout(() => {
                    seg.style.animationDuration = '2s';
                }, 300);
            });
            
            if (state.shieldIntegrity < 30) {
                addLogEntry(`Warning: Shield integrity critical at ${state.shieldIntegrity}%`);
            }
        }
    }
    
    // Modulate button
    document.querySelector('.shields-panel .control-btn:nth-child(2)').addEventListener('click', function() {
        // Randomize frequency visualizer
        const freqBars = document.querySelectorAll('.freq-bar');
        freqBars.forEach(bar => {
            const newHeight = Math.floor(Math.random() * 80) + 20;
            bar.style.setProperty('--height', `${newHeight}%`);
        });
        addLogEntry('Shield frequency modulated. Scanning for optimal harmonic.');
    });
    
    // ===== WEAPONS PANEL =====
    const targetReticle = document.getElementById('targetReticle');
    const lockText = targetReticle.querySelector('.lock-text');
    const firePhaserBtn = document.getElementById('firePhaser');
    const fireTorpedoBtn = document.getElementById('fireTorpedo');
    const targetLockBtn = document.getElementById('targetLock');
    const chargeIndicator = document.querySelector('.charge-level');
    
    // Target lock sequence
    targetLockBtn.addEventListener('click', function() {
        if (state.targetLocked) {
            state.targetLocked = false;
            lockText.textContent = 'SCANNING...';
            targetReticle.style.animation = 'none';
            setTimeout(() => {
                targetReticle.style.animation = '';
            }, 10);
            addLogEntry('Target lock disengaged.');
            return;
        }
        
        lockText.textContent = 'ACQUIRING...';
        targetReticle.style.animation = 'reticlePulse 0.5s infinite alternate';
        
        // Simulate lock sequence
        setTimeout(() => {
            lockText.textContent = 'TRACKING...';
        }, 1000);
        
        setTimeout(() => {
            state.targetLocked = true;
            lockText.textContent = 'TARGET LOCKED';
            targetReticle.style.animation = 'reticlePulse 0.2s infinite alternate';
            document.querySelector('.reticle-dot').style.background = '#00ff00';
            
            // Update viewport readout
            const targets = ['UNKNOWN VESSEL', 'ASTEROID CLUSTER', 'STARBASE 12', 'PIRATE SCOUT'];
            const target = targets[Math.floor(Math.random() * targets.length)];
            document.getElementById('targetReadout').textContent = `TARGET: ${target}`;
            
            addLogEntry(`Target locked: ${target}. Weapons armed.`);
        }, 2000);
    });
    
    // Fire phasers
    firePhaserBtn.addEventListener('click', function() {
        if (!state.targetLocked) {
            addLogEntry('Cannot fire: No target locked.');
            return;
        }
        
        if (state.phaserCharge < 10) {
            addLogEntry('Phaser banks depleted. Recharging...');
            return;
        }
        
        // Consume charge
        state.phaserCharge = Math.max(0, state.phaserCharge - 10);
        chargeIndicator.style.setProperty('--charge', `${state.phaserCharge}%`);
        
        // Visual effect
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'phaserFire 0.3s';
        }, 10);
        
        // Add phaser fire animation CSS
        const phaserStyle = document.createElement('style');
        phaserStyle.textContent = `
            @keyframes phaserFire {
                0% { box-shadow: 0 0 10px var(--synth-accent); background: rgba(255, 85, 0, 0.3); }
                50% { box-shadow: 0 0 40px var(--synth-accent); background: rgba(255, 85, 0, 0.8); }
                100% { box-shadow: 0 0 10px var(--synth-accent); background: rgba(255, 85, 0, 0.1); }
            }
        `;
        document.head.appendChild(phaserStyle);
        setTimeout(() => phaserStyle.remove(), 500);
        
        // Viewport flash
        document.querySelector('.main-viewport').style.boxShadow = 'inset 0 0 100px rgba(255, 85, 0, 0.5)';
        setTimeout(() => {
            document.querySelector('.main-viewport').style.boxShadow = '';
        }, 100);
        
        addLogEntry('Phasers fired. Target hit.');
        
        // Recharge over time
        setTimeout(() => {
            state.phaserCharge = Math.min(100, state.phaserCharge + 1);
            chargeIndicator.style.setProperty('--charge', `${state.phaserCharge}%`);
        }, 1000);
    });
    
    // Fire torpedo
    fireTorpedoBtn.addEventListener('click', function() {
        if (!state.targetLocked) {
            addLogEntry('Cannot launch: No target locked.');
            return;
        }
        
        if (state.torpedoCount <= 0) {
            addLogEntry('Torpedo bays empty.');
            return;
        }
        
        state.torpedoCount--;
        document.querySelector('.ammo-count').textContent = `${state.torpedoCount} / 24`;
        
        // Visual effect
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'torpedoLaunch 0.5s';
        }, 10);
        
        // Add torpedo launch animation CSS
        const torpedoStyle = document.createElement('style');
        torpedoStyle.textContent = `
            @keyframes torpedoLaunch {
                0% { transform: scale(1); box-shadow: 0 0 10px var(--synth-accent); }
                50% { transform: scale(1.1); box-shadow: 0 0 50px var(--synth-accent); }
                100% { transform: scale(1); box-shadow: 0 0 10px var(--synth-accent); }
            }
        `;
        document.head.appendChild(torpedoStyle);
        setTimeout(() => torpedoStyle.remove(), 600);
        
        // Missile trail effect in viewport
        const viewport = document.querySelector('.main-viewport');
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: absolute;
            bottom: 50%;
            left: 20%;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 15px solid var(--synth-accent);
            animation: torpedoTrail 1s forwards;
            z-index: 5;
        `;
        
        const trailStyle = document.createElement('style');
        trailStyle.textContent = `
            @keyframes torpedoTrail {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(100px, -100px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(trailStyle);
        
        viewport.appendChild(trail);
        setTimeout(() => {
            trail.remove();
            trailStyle.remove();
        }, 1000);
        
        addLogEntry(`Photon torpedo launched. ${state.torpedoCount} remaining.`);
        
        // Simulate shield damage to target
        setTimeout(simulateShieldDamage, 800);
    });
    
    // ===== COMMUNICATIONS PANEL =====
    const eqVisualizer = document.getElementById('eqVisualizer');
    const waveformDisplay = document.getElementById('waveformDisplay');
    const freqSlider = document.getElementById('freqSlider');
    const freqOutput = document.querySelector('.slider-value[for="freqSlider"]');
    const commLine1 = document.getElementById('commLine1');
    const commLine2 = document.getElementById('commLine2');
    const scanButton = document.getElementById('scanButton');
    
    // Generate EQ bars
    function generateEQ() {
        eqVisualizer.innerHTML = '';
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.className = 'eq-bar';
            bar.style.setProperty('--i', i);
            bar.style.height = `${Math.random() * 50 + 10}px`;
            bar.style.animationDelay = `${i * 0.05}s`;
            eqVisualizer.appendChild(bar);
        }
    }
    
    // Generate waveform
    function generateWaveform() {
        waveformDisplay.innerHTML = '';
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        
        const path = document.createElementNS(svgNS, "path");
        let d = "M 0 20 ";
        for (let x = 0; x <= 100; x += 2) {
            const y = 20 + Math.sin(x * 0.2 + Date.now() * 0.001) * 15 + Math.random() * 5;
            d += `L ${x} ${y} `;
        }
        path.setAttribute("d", d);
        path.setAttribute("stroke", "var(--synth-primary)");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        
        svg.appendChild(path);
        waveformDisplay.appendChild(svg);
    }
    
    // Frequency slider
    freqSlider.addEventListener('input', function() {
        state.commFrequency = parseFloat(this.value) + Math.random();
        freqOutput.textContent = state.commFrequency.toFixed(1);
        commLine1.textContent = `>> BAND OPEN: ${state.commFrequency.toFixed(1)} MHZ`;
        
        // Update EQ based on frequency
        generateEQ();
    });
    
    // Scan button
    scanButton.addEventListener('click', function() {
        commLine2.textContent = ">> DECODING: STAND BY";
        
        // Simulate scanning
        setTimeout(() => {
            const messages = [
                ">> SIGNAL ACQUIRED: CARRIER WAVE DETECTED",
                ">> DECODED: 'NOVA-SYNTHIA, THIS IS STARBASE 12'",
                ">> TRANSMISSION: 'ALL SYSTEMS NOMINAL'",
                ">> STATIC: BACKGROUND COSMIC NOISE",
                ">> ENCRYPTED: UNKNOWN PROTOCOL DETECTED"
            ];
            const message = messages[Math.floor(Math.random() * messages.length)];
            commLine2.textContent = message;
            addLogEntry(`Communication scan completed: ${message.substring(3)}`);
        }, 1500);
    });
    
    // Animate EQ and waveform
    setInterval(() => {
        // Animate EQ bars
        const bars = document.querySelectorAll('.eq-bar');
        bars.forEach(bar => {
            const newHeight = Math.random() * 50 + 10;
            bar.style.height = `${newHeight}px`;
        });
        
        // Update waveform
        generateWaveform();
    }, 200);
    
    // ===== SYSTEM LOG =====
    const systemLog = document.getElementById('systemLog');
    
    function addLogEntry(message) {
        const timestamp = new Date();
        const timeString = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${state.starDate} ${timeString}] ${message}`;
        
        systemLog.appendChild(logEntry);
        systemLog.scrollTop = systemLog.scrollHeight;
        
        // Limit log entries
        if (systemLog.children.length > 10) {
            systemLog.removeChild(systemLog.firstChild);
        }
    }
    
    // Clear log button
    document.getElementById('logClear').addEventListener('click', function() {
        systemLog.innerHTML = '';
        addLogEntry('System log cleared.');
    });
    
    // ===== NIGHT MODE =====
    document.getElementById('nightModeToggle').addEventListener('click', function() {
        state.nightMode = !state.nightMode;
        
        if (state.nightMode) {
            document.documentElement.style.setProperty('--synth-dark', '#000010');
            document.documentElement.style.setProperty('--synth-darker', '#000005');
            document.documentElement.style.setProperty('--synth-bg', 'linear-gradient(135deg, #000010 0%, #0a001a 70%, #000a1a 100%)');
            this.innerHTML = '<i class="fas fa-sun"></i> DAY';
            addLogEntry('Night mode activated. Reducing ambient lighting.');
        } else {
            document.documentElement.style.setProperty('--synth-dark', '#0a0a1a');
            document.documentElement.style.setProperty('--synth-darker', '#050510');
            document.documentElement.style.setProperty('--synth-bg', 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 70%, #0a1a2a 100%)');
            this.innerHTML = '<i class="fas fa-moon"></i> NIGHT';
            addLogEntry('Day mode restored. Full lighting operational.');
        }
    });
    
    // ===== RANDOM SYSTEM UPDATES =====
    setInterval(() => {
        // Random system status updates
        const statuses = ['NOMINAL', 'OPTIMAL', 'STABLE', 'SCANNING'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        document.getElementById('sysStatus').textContent = randomStatus;
        
        // Update stardate (increment slowly)
        const [year, month, day] = state.starDate.split('.').map(Number);
        const newDay = (day + 0.1).toFixed(1);
        state.starDate = `${year}.${month}.${newDay}`;
        document.getElementById('starDate').textContent = state.starDate;
        
        // Random shield damage
        if (state.shieldsOnline && Math.random() > 0.8) {
            simulateShieldDamage();
        }
        
        // Random target acquisition simulation
        if (!state.targetLocked && Math.random() > 0.9) {
            const targets = ['UNKNOWN CONTACT', 'DEBRIS FIELD', 'NEUTRAL VESSEL'];
            document.getElementById('targetReadout').textContent = `SCAN: ${targets[Math.floor(Math.random() * targets.length)]}`;
        }
    }, 5000);
    
    // ===== INITIALIZATION =====
    function initializeConsole() {
        // Generate visual elements
        generateStarfield();
        generateEQ();
        generateWaveform();
        
        // Set initial values
        warpOutput.textContent = state.warpFactor.toFixed(1);
        freqOutput.textContent = state.commFrequency.toFixed(1);
        shieldIntegrityDisplay.textContent = state.shieldIntegrity;
        document.querySelector('.ammo-count').textContent = `${state.torpedoCount} / 24`;
        
        // Add welcome log entries
        addLogEntry('NOVA-SYNTHIA bridge console initialized.');
        addLogEntry('All systems nominal. Welcome, Commander.');
        addLogEntry('Synthwave interface engaged. Ready for duty.');
        
        // Start audio if enabled
        if (state.audioEnabled) {
            setTimeout(() => {
                ambientAudio.play().catch(e => console.log('Audio autoplay blocked'));
            }, 1000);
        }
        
        console.log('Bridge console fully operational.');
    }
    
    // Initialize everything
    initializeConsole();
});
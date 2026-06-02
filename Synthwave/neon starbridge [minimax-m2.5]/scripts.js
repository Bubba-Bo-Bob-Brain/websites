/**
 * USS NEON HORIZON - Bridge Console Controller
 * Peak Synthwave Aesthetic Interactive System
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Core Systems Initialization
    // ============================================
    
    const ConsoleBridge = {
        
        // Configuration
        config: {
            starCount: 200,
            gridSpeed: 3,
            waveUpdateRate: 50,
            stardateIncrement: 0.0001,
            shieldDrainRate: 0.5,
            targetLockChance: 0.02
        },
        
        // State
        state: {
            stardate: 47824.5,
            shieldIntegrity: 100,
            targetLocked: false,
            velocity: 0.72,
            course: 247.9,
            frequency: 142.857,
            commsLog: [],
            running: true
        },
        
        // DOM Elements
        elements: {},
        
        // Initialize the console
        init() {
            this.cacheElements();
            this.createStarField();
            this.initWaveCanvas();
            this.initEventListeners();
            this.startSystems();
            console.log('🚀 USS NEON HORIZON - Systems Online');
        },
        
        // Cache DOM elements
        cacheElements() {
            this.elements = {
                starField: document.getElementById('starField'),
                gridFloor: document.getElementById('gridFloor'),
                targetReticle: document.getElementById('targetReticle'),
                shieldArc: document.getElementById('shieldArc'),
                shieldPercent: document.getElementById('shieldPercent'),
                shieldFwd: document.getElementById('shieldFwd'),
                shieldAft: document.getElementById('shieldAft'),
                shieldPort: document.getElementById('shieldPort'),
                shieldStar: document.getElementById('shieldStar'),
                stardate: document.getElementById('stardate'),
                courseValue: document.getElementById('courseValue'),
                velocityValue: document.getElementById('velocityValue'),
                etaValue: document.getElementById('etaValue'),
                freqValue: document.getElementById('freqValue'),
                waveCanvas: document.getElementById('waveCanvas'),
                commsLog: document.getElementById('commsLog'),
                starMap: document.getElementById('starMap'),
                mainRing: document.getElementById('mainRing'),
                navControls: document.querySelectorAll('.nav-controls .console-btn'),
                commsControls: document.querySelectorAll('.comms-controls .console-btn')
            };
        },
        
        // Create animated star field
        createStarField() {
            const starField = this.elements.starField;
            const canvas = document.createElement('canvas');
            canvas.id = 'starsCanvas';
            canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
            starField.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            const stars = [];
            const numStars = this.config.starCount;
            
            function resize() {
                canvas.width = starField.offsetWidth;
                canvas.height = starField.offsetHeight;
            }
            
            resize();
            window.addEventListener('resize', resize);
            
            // Initialize stars
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.6,
                    size: Math.random() * 2 + 0.5,
                    speed: Math.random() * 0.5 + 0.1,
                    brightness: Math.random()
                });
            }
            
            // Animation loop
            let time = 0;
            const animate = () => {
                if (!this.state.running) return;
                time += 0.01;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                stars.forEach(star => {
                    // Parallax movement
                    star.y += star.speed;
                    if (star.y > canvas.height * 0.6) {
                        star.y = 0;
                        star.x = Math.random() * canvas.width;
                    }
                    
                    // Twinkle effect
                    const twinkle = Math.sin(time * 2 + star.brightness * 10) * 0.3 + 0.7;
                    
                    // Draw star
                    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${twinkle})`);
                    gradient.addColorStop(0.5, `rgba(200, 220, 255, ${twinkle * 0.5})`);
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                requestAnimationFrame(animate);
            };
            
            animate();
        },
        
        // Initialize wave canvas for frequency display
        initWaveCanvas() {
            const canvas = this.elements.waveCanvas;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth || 280;
            canvas.height = canvas.offsetHeight || 60;
            
            let phase = 0;
            const waves = [];
            
            // Create multiple wave layers
            for (let i = 0; i < 3; i++) {
                waves.push({
                    amplitude: 10 + Math.random() * 15,
                    frequency: 0.02 + Math.random() * 0.02,
                    phase: Math.random() * Math.PI * 2,
                    color: i === 0 ? '#00fff2' : i === 1 ? '#ff00ff' : '#bf00ff',
                    offset: i * 10
                });
            }
            
            const animate = () => {
                if (!this.state.running) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                phase += 0.05;
                
                waves.forEach((wave, index) => {
                    ctx.beginPath();
                    ctx.strokeStyle = wave.color;
                    ctx.lineWidth = 1.5;
                    
                    for (let x = 0; x < canvas.width; x++) {
                        const y = canvas.height / 2 + 
                            Math.sin(x * wave.frequency + phase + wave.phase) * wave.amplitude + 
                            wave.offset;
                        if (x === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    
                    ctx.globalAlpha = 0.6 - index * 0.15;
                    ctx.stroke();
                });
                
                ctx.globalAlpha = 1;
                requestAnimationFrame(animate);
            };
            
            animate();
        },
        
        // Initialize event listeners
        initEventListeners() {
            // Navigation buttons
            this.elements.navControls.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleNavButton(e.target.closest('button'));
                });
            });
            
            // Communications buttons
            this.elements.commsControls.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleCommsButton(e.target.closest('button'));
                });
            });
            
            // Shield click to toggle target lock
            document.querySelector('.shield-donut').addEventListener('click', () => {
                this.toggleTargetLock();
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                this.handleKeyboard(e);
            });
        },
        
        // Handle navigation button clicks
        handleNavButton(btn) {
            const label = btn.querySelector('.btn-label').textContent;
            this.playButtonSound();
            
            switch(label) {
                case 'PLOT COURSE':
                    this.plotCourse();
                    break;
                case 'SCAN SECTOR':
                    this.scanSector();
                    break;
            }
        },
        
        // Handle communications button clicks
        handleCommsButton(btn) {
            const label = btn.querySelector('.btn-label').textContent;
            this.playButtonSound();
            
            switch(label) {
                case 'TRANSMIT':
                    this.transmitMessage();
                    break;
                case 'SCAN FREQ':
                    this.scanFrequencies();
                    break;
                case 'DISTRESS':
                    this.sendDistress();
                    break;
            }
        },
        
        // Handle keyboard shortcuts
        handleKeyboard(e) {
            switch(e.key) {
                case 't':
                case 'T':
                    this.toggleTargetLock();
                    break;
                case 's':
                case 'S':
                    this.scanSector();
                    break;
                case 'c':
                case 'C':
                    this.plotCourse();
                    break;
                case ' ':
                    this.emergencyShieldBoost();
                    break;
            }
        },
        
        // Plot new course
        plotCourse() {
            const newCourse = (Math.random() * 360).toFixed(1);
            this.state.course = parseFloat(newCourse);
            this.elements.courseValue.textContent = `${newCourse}°`;
            this.addCommsLog('SYSTEM', 'New course plotted');
            this.flashElement(this.elements.courseValue);
        },
        
        // Scan sector
        scanSector() {
            this.addCommsLog('SCANNER', 'Scanning sector...');
            
            setTimeout(() => {
                const anomalies = Math.floor(Math.random() * 5);
                this.addCommsLog('SCANNER', `Found ${anomalies} signatures`);
                
                if (anomalies > 0 && !this.state.targetLocked) {
                    this.activateTargetLock();
                }
            }, 1500);
        },
        
        // Transmit message
        transmitMessage() {
            const messages = [
                'Proceeding to destination',
                'Course confirmed',
                'All systems nominal',
                'Standing by'
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            this.addCommsLog('USS NH-7', msg, 'outgoing');
        },
        
        // Scan frequencies
        scanFrequencies() {
            this.addCommsLog('COMMS', 'Scanning frequency range...');
            
            let scanPhase = 0;
            const scanInterval = setInterval(() => {
                scanPhase += 0.5;
                const freq = 140 + scanPhase;
                this.state.frequency = freq;
                this.elements.freqValue.textContent = `${freq.toFixed(3)} MHz`;
                
                if (freq >= 148) {
                    clearInterval(scanInterval);
                    this.state.frequency = 142.857;
                    this.elements.freqValue.textContent = '142.857 MHz';
                    this.addCommsLog('COMMS', 'Scan complete - no active signals');
                }
            }, 50);
        },
        
        // Send distress signal
        sendDistress() {
            this.addCommsLog('DISTRESS', '⚠ DISTRESS SIGNAL TRANSMITTED ⚠', 'outgoing');
            this.flashElement(document.querySelector('.comms-panel'), 'red');
            
            // Simulate response
            setTimeout(() => {
                this.addCommsLog('FEDCOM-7', 'Distress signal received. Help en route.');
            }, 2000);
        },
        
        // Toggle target lock
        toggleTargetLock() {
            if (this.state.targetLocked) {
                this.deactivateTargetLock();
            } else {
                this.activateTargetLock();
            }
        },
        
        // Activate target lock
        activateTargetLock() {
            this.state.targetLocked = true;
            this.elements.targetReticle.classList.add('active');
            this.addCommsLog('TACTICAL', 'Target lock acquired');
        },
        
        // Deactivate target lock
        deactivateTargetLock() {
            this.state.targetLocked = false;
            this.elements.targetReticle.classList.remove('active');
            this.addCommsLog('TACTICAL', 'Target lock released');
        },
        
        // Emergency shield boost
        emergencyShieldBoost() {
            this.state.shieldIntegrity = Math.min(100, this.state.shieldIntegrity + 25);
            this.updateShieldDisplay();
            this.addCommsLog('SHIELDS', 'Emergency boost activated');
        },
        
        // Update shield display
        updateShieldDisplay() {
            const integrity = this.state.shieldIntegrity;
            const circumference = 251.2; // 2 * PI * 40
            const offset = circumference - (circumference * integrity / 100);
            
            this.elements.shieldArc.style.strokeDashoffset = offset;
            this.elements.shieldPercent.textContent = `${Math.round(integrity)}%`;
            
            // Update individual facets
            const fwd = Math.round(integrity * (0.9 + Math.random() * 0.1));
            const aft = Math.round(integrity * (0.85 + Math.random() * 0.15));
            const port = Math.round(integrity * (0.88 + Math.random() * 0.12));
            const star = Math.round(integrity * (0.87 + Math.random() * 0.13));
            
            this.elements.shieldFwd.textContent = `${fwd}%`;
            this.elements.shieldAft.textContent = `${aft}%`;
            this.elements.shieldPort.textContent = `${port}%`;
            this.elements.shieldStar.textContent = `${star}%`;
            
            // Color based on integrity
            if (integrity < 30) {
                this.elements.shieldArc.style.stroke = '#ff0000';
            } else if (integrity < 60) {
                this.elements.shieldArc.style.stroke = '#ff6b00';
            } else {
                this.elements.shieldArc.style.stroke = '#00fff2';
            }
        },
        
        // Add message to comms log
        addCommsLog(channel, message, type = 'incoming') {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.innerHTML = `<span class="log-time">${this.state.stardate.toFixed(1)}</span><span class="log-channel">${channel}</span><span class="log-msg">${message}</span>`;
            
            this.elements.commsLog.appendChild(entry);
            this.elements.commsLog.scrollTop = this.elements.commsLog.scrollHeight;
            
            // Keep only last 20 entries
            while (this.elements.commsLog.children.length > 20) {
                this.elements.commsLog.removeChild(this.elements.commsLog.firstChild);
            }
        },
        
        // Flash element for attention
        flashElement(element, color = 'cyan') {
            const originalBorder = element.style.border;
            
            const flash = () => {
                element.style.border = `2px solid ${color}`;
                setTimeout(() => {
                    element.style.border = originalBorder;
                }, 150);
            };
            
            flash();
            setTimeout(flash, 300);
        },
        
        // Play button sound (visual feedback)
        playButtonSound() {
            // Visual feedback only
            document.querySelectorAll('.console-btn').forEach(btn => {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 100);
            });
        },
        
        // Start all systems
        startSystems() {
            this.startStardate();
            this.startDynamicSystems();
        },
        
        // Start stardate counter
        startStardate() {
            setInterval(() => {
                if (!this.state.running) return;
                this.state.stardate += this.config.stardateIncrement;
                this.elements.stardate.textContent = this.state.stardate.toFixed(1);
            }, 100);
        },
        
        // Start dynamic systems
        startDynamicSystems() {
            // Random system events
            setInterval(() => {
                if (!this.state.running) return;
                
                // Random velocity fluctuation
                if (Math.random() < 0.3) {
                    const fluctuation = (Math.random() - 0.5) * 0.02;
                    this.state.velocity = Math.max(0.5, Math.min(0.99, this.state.velocity + fluctuation));
                    this.elements.velocityValue.textContent = `${this.state.velocity.toFixed(2)}c`;
                }
                
                // Random shield fluctuation
                if (this.state.shieldIntegrity > 0) {
                    if (Math.random() < 0.2) {
                        this.state.shieldIntegrity = Math.max(0, this.state.shieldIntegrity - this.config.shieldDrainRate);
                        this.updateShieldDisplay();
                    }
                }
                
                // Random course drift
                if (Math.random() < 0.1) {
                    this.state.course += (Math.random() - 0.5) * 0.1;
                    if (this.state.course < 0) this.state.course += 360;
                    if (this.state.course > 360) this.state.course -= 360;
                    this.elements.courseValue.textContent = `${this.state.course.toFixed(1)}°`;
                }
                
                // Random frequency drift
                if (Math.random() < 0.4) {
                    this.state.frequency += (Math.random() - 0.5) * 0.1;
                    if (this.state.frequency < 140) this.state.frequency = 148;
                    if (this.state.frequency > 148) this.state.frequency = 140;
                    this.elements.freqValue.textContent = `${this.state.frequency.toFixed(3)} MHz`;
                }
                
                // Random target lock
                if (Math.random() < this.config.targetLockChance && !this.state.targetLocked) {
                    this.activateTargetLock();
                }
                
                // Random comms messages
                if (Math.random() < 0.05) {
                    const messages = [
                        { channel: 'FEDCOM-7', msg: 'All vessels maintain station' },
                        { channel: 'WEATHER', msg: 'Solar flare detected in sector' },
                        { channel: 'TRAFFIC', msg: 'Merchant convoy entering zone' },
                        { channel: 'SCIENCE', msg: 'Analyzing warp signature' },
                        { channel: 'FEDCOM-7', msg: 'Status report required' },
                        { channel: 'ALERT', msg: 'Unidentified contact approaching' }
                    ];
                    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                    this.addCommsLog(randomMsg.channel, randomMsg.msg);
                }
                
            }, 1000);
            
            // Update ETA periodically
            setInterval(() => {
                if (!this.state.running) return;
                const baseEta = 4.2;
                const adjusted = baseEta - (this.state.velocity - 0.7) * 5;
                this.elements.etaValue.textContent = `~${adjusted.toFixed(1)} YRS`;
            }, 5000);
        },
        
        // Pause/resume systems
        pause() {
            this.state.running = false;
        },
        
        resume() {
            this.state.running = true;
        }
    };
    
    // Initialize the bridge console
    ConsoleBridge.init();
    
    // ============================================
    // Easter Egg: Konami Code
    // ============================================
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        console.log('🎮 CHEAT ACTIVATED: Maximum Shields & Warp Speed!');
        ConsoleBridge.state.shieldIntegrity = 100;
        ConsoleBridge.state.velocity = 0.99;
        ConsoleBridge.updateShieldDisplay();
        ConsoleBridge.elements.velocityValue.textContent = '0.99c';
        ConsoleBridge.addCommsLog('SYSTEM', '⚡ WARP DRIVE ENGAGED ⚡');
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    // ============================================
    // Handle visibility change (pause when tab hidden)
    // ============================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            ConsoleBridge.pause();
        } else {
            ConsoleBridge.resume();
        }
    });
    
});
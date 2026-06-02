/* ============================================
   DEEP-SEA RESEARCH DASHBOARD JAVASCRIPT
   Abyssal Horizon Research Station
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Abyssal Horizon Research Station - Dashboard Initializing...');
    
    // Audio elements
    const sonarAudio = document.getElementById('sonar-ping-audio');
    const klaxonAudio = document.getElementById('klaxon-audio');
    const ambientAudio = document.getElementById('ambient-audio');
    
    // DOM Elements
    const particleLayer = document.getElementById('particle-layer');
    const sonarLayer = document.getElementById('sonar-layer');
    const sonarDisplay = document.getElementById('sonar-display');
    const bioluminescenceDisplay = document.getElementById('bioluminescence-display');
    const klaxonLight = document.getElementById('klaxon-light');
    
    // Interactive Controls
    const sonarPingBtn = document.getElementById('sonar-ping');
    const intensitySlider = document.getElementById('intensity-slider');
    const intensityValue = document.getElementById('intensity-value');
    const testKlaxonBtn = document.getElementById('test-klaxon');
    const emergencyProcedureBtn = document.getElementById('emergency-procedure');
    const addLogEntryBtn = document.getElementById('add-log-entry');
    const logInput = document.getElementById('log-input');
    const logSubmitBtn = document.getElementById('log-submit');
    
    // Data Displays
    const depthValue = document.getElementById('depth-value');
    const pressureValue = document.getElementById('pressure-value');
    const stationTime = document.getElementById('station-time');
    const pressureBar = document.getElementById('pressure-bar');
    const integrityValue = document.getElementById('integrity-value');
    
    // Initialize the dashboard
    initDashboard();
    
    /* ============================================
       INITIALIZATION FUNCTIONS
       ============================================ */
    
    function initDashboard() {
        console.log('Initializing deep-sea dashboard...');
        
        // Start ambient audio
        ambientAudio.volume = 0.3;
        ambientAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
        
        // Initialize water particles
        createWaterParticles();
        
        // Initialize bioluminescent particles
        createBioluminescentParticles();
        
        // Start real-time updates
        startRealTimeUpdates();
        
        // Initialize sonar ripple system
        initSonarRippleSystem();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update CSS variables based on initial depth
        updateDepthBasedEffects();
        
        console.log('Dashboard initialization complete.');
    }
    
    /* ============================================
       WATER PARTICLE SYSTEM
       ============================================ */
    
    function createWaterParticles() {
        console.log('Generating water particles...');
        
        // Create particles that drift like underwater sediment
        for (let i = 0; i < 80; i++) {
            const particle = document.createElement('div');
            particle.classList.add('water-particle');
            
            // Random properties
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = Math.random() * 0.3 + 0.1;
            const duration = Math.random() * 30 + 20;
            const delay = Math.random() * 10;
            
            // Apply styles
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(100, 200, 255, ${opacity});
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                pointer-events: none;
                animation: particle-drift ${duration}s linear infinite ${delay}s;
                filter: blur(0.5px);
                z-index: 1;
            `;
            
            particleLayer.appendChild(particle);
        }
        
        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particle-drift {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: ${Math.random() * 0.5 + 0.3};
                }
                90% {
                    opacity: ${Math.random() * 0.5 + 0.3};
                }
                100% {
                    transform: translateY(${Math.random() * 100 - 50}vh) translateX(${Math.random() * 100 - 50}vw);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /* ============================================
       BIOLUMINESCENT PARTICLE SYSTEM
       ============================================ */
    
    function createBioluminescentParticles() {
        console.log('Generating bioluminescent particles...');
        
        // Clear any existing particles
        bioluminescenceDisplay.innerHTML = '';
        
        // Get current intensity from slider
        const intensity = parseInt(intensitySlider.value);
        
        // Number of particles based on intensity
        const particleCount = Math.floor(intensity / 10) + 5;
        
        // Bioluminescent colors
        const colors = [
            'rgba(0, 255, 170, 0.8)',  // Bio teal
            'rgba(0, 204, 255, 0.8)',   // Bio cyan
            'rgba(170, 0, 255, 0.8)',   // Bio purple
            'rgba(255, 0, 170, 0.8)',   // Bio magenta
            'rgba(255, 255, 0, 0.8)'    // Bio yellow
        ];
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('bio-particle');
            
            // Random properties
            const size = Math.random() * 8 + 3;
            const posX = Math.random() * 95;
            const posY = Math.random() * 95;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 2;
            const glowSize = size * 2;
            
            // Apply styles
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                pointer-events: none;
                box-shadow: 0 0 ${glowSize}px ${color};
                animation: bio-pulse ${duration}s ease-in-out infinite ${delay}s;
                z-index: 2;
            `;
            
            bioluminescenceDisplay.appendChild(particle);
        }
        
        // Add CSS for bioluminescent pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bio-pulse {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.9;
                    transform: scale(${1 + Math.random() * 0.5});
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /* ============================================
       SONAR SYSTEM
       ============================================ */
    
    function initSonarRippleSystem() {
        console.log('Initializing sonar ripple system...');
        
        // Create initial ripples
        setTimeout(() => createSonarRipple(), 1000);
        setTimeout(() => createSonarRipple(), 3000);
        
        // Set interval for automatic pings
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
                createSonarRipple();
            }
        }, 10000);
    }
    
    function createSonarRipple(centerX = 50, centerY = 50) {
        const ripple = document.createElement('div');
        ripple.classList.add('sonar-ripple');
        
        // Apply styles
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(170, 0, 255, 0.8);
            border-radius: 50%;
            top: ${centerY}%;
            left: ${centerX}%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: sonar-wave 3s linear forwards;
            z-index: 3;
        `;
        
        sonarLayer.appendChild(ripple);
        
        // Add CSS for sonar wave animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sonar-wave {
                0% {
                    width: 20px;
                    height: 20px;
                    opacity: 0.8;
                    border-width: 2px;
                }
                100% {
                    width: 100vw;
                    height: 100vw;
                    opacity: 0;
                    border-width: 1px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 3000);
        
        // Update sonar targets
        updateSonarTargets();
    }
    
    function updateSonarTargets() {
        const targets = document.querySelectorAll('.sonar-target');
        
        targets.forEach(target => {
            // Random movement
            const currentTop = parseFloat(target.style.top);
            const currentLeft = parseFloat(target.style.left);
            
            const newTop = Math.max(10, Math.min(90, currentTop + (Math.random() * 4 - 2)));
            const newLeft = Math.max(10, Math.min(90, currentLeft + (Math.random() * 4 - 2)));
            
            target.style.top = `${newTop}%`;
            target.style.left = `${newLeft}%`;
            
            // Randomly change target type occasionally
            if (Math.random() > 0.95) {
                const types = ['biological', 'geological', 'unknown'];
                const newType = types[Math.floor(Math.random() * types.length)];
                target.setAttribute('data-type', newType);
                
                // Update color based on type
                if (newType === 'biological') {
                    target.style.background = '#00ffaa';
                    target.style.color = '#00ffaa';
                } else if (newType === 'geological') {
                    target.style.background = '#ffff00';
                    target.style.color = '#ffff00';
                } else {
                    target.style.background = '#ff00aa';
                    target.style.color = '#ff00aa';
                }
            }
        });
    }
    
    /* ============================================
       REAL-TIME DATA UPDATES
       ============================================ */
    
    function startRealTimeUpdates() {
        console.log('Starting real-time data updates...');
        
        // Update time every second
        setInterval(updateStationTime, 1000);
        
        // Update depth and pressure values every 5 seconds
        setInterval(updateDepthAndPressure, 5000);
        
        // Update hull integrity and pressure bar every 3 seconds
        setInterval(updateHullMetrics, 3000);
        
        // Update environmental data every 10 seconds
        setInterval(updateEnvironmentalData, 10000);
        
        // Update system statuses every 15 seconds
        setInterval(updateSystemStatuses, 15000);
        
        // Initial updates
        updateStationTime();
        updateDepthAndPressure();
        updateHullMetrics();
        updateEnvironmentalData();
        updateSystemStatuses();
    }
    
    function updateStationTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        stationTime.textContent = timeString;
        
        // Update CSS variable for time-based effects
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeValue = hours * 60 + minutes;
        
        // Simulate day/night cycle effect (subtle)
        const timeFactor = Math.sin(timeValue / 720 * Math.PI) * 0.1 + 0.9;
        document.documentElement.style.setProperty('--glow-intensity', timeFactor.toString());
    }
    
    function updateDepthAndPressure() {
        // Simulate small depth changes
        const currentDepth = parseInt(depthValue.textContent.replace(',', ''));
        const depthChange = Math.floor(Math.random() * 21) - 10; // -10 to +10
        
        let newDepth = currentDepth + depthChange;
        
        // Keep depth within realistic bounds
        newDepth = Math.max(10800, Math.min(11100, newDepth));
        
        // Update depth display
        depthValue.textContent = newDepth.toLocaleString();
        
        // Calculate pressure based on depth (approx 1 atm per 10m)
        const newPressure = Math.round((newDepth / 10) * 1.03);
        pressureValue.textContent = newPressure.toLocaleString();
        
        // Update CSS variable for depth-based effects
        document.documentElement.style.setProperty('--current-depth', newDepth.toString());
        
        // Update visual effects based on new depth
        updateDepthBasedEffects();
    }
    
    function updateDepthBasedEffects() {
        const depth = parseInt(depthValue.textContent.replace(',', ''));
        
        // Calculate depth factor (0 to 1)
        const depthFactor = (depth - 10800) / 300; // Normalize between 10800-11100
        
        // Update background gradient based on depth
        const blueIndex = Math.min(5, Math.floor(depthFactor * 5));
        const backgroundColor = getComputedStyle(document.documentElement)
            .getPropertyValue(`--depth-blue-${blueIndex}`).trim();
        
        // Update pressure warning bar
        const pressureLoad = Math.min(100, Math.max(0, depthFactor * 85 + 15 + Math.random() * 10));
        pressureBar.style.width = `${pressureLoad}%`;
        
        // Update klaxon animation based on pressure
        if (pressureLoad > 90) {
            klaxonLight.style.animation = 'klaxon-pulse 1s infinite';
        } else if (pressureLoad > 80) {
            klaxonLight.style.animation = 'klaxon-pulse 2s infinite';
        } else {
            klaxonLight.style.animation = 'klaxon-pulse 4s infinite';
        }
        
        // Update hull integrity based on pressure
        const integrity = Math.max(80, 100 - (pressureLoad / 10));
        integrityValue.textContent = `${Math.round(integrity)}%`;
        
        // Update hull stress visuals
        updateHullStressVisuals(integrity);
    }
    
    function updateHullStressVisuals(integrity) {
        const hullSections = document.querySelectorAll('.section-stress');
        
        hullSections.forEach(section => {
            const currentHeight = parseFloat(section.style.height);
            const stressChange = (100 - integrity) / 20; // Factor based on integrity
            
            // Each section has different stress characteristics
            const sectionFactor = {
                'front': 1.2,
                'port': 0.8,
                'starboard': 0.7,
                'keel': 1.8,
                'stern': 1.0
            }[section.parentElement.dataset.section] || 1;
            
            const newHeight = Math.min(30, Math.max(2, stressChange * sectionFactor * 10 + (Math.random() * 5)));
            section.style.height = `${newHeight}%`;
            
            // Update color based on stress level
            if (newHeight > 20) {
                section.style.background = 'linear-gradient(to top, var(--status-critical) 0%, var(--status-warning) 100%)';
            } else if (newHeight > 10) {
                section.style.background = 'linear-gradient(to top, var(--status-warning) 0%, var(--status-ok) 50%)';
            } else {
                section.style.background = 'linear-gradient(to top, var(--status-ok) 0%, rgba(0, 255, 170, 0.5) 100%)';
            }
        });
    }
    
    function updateHullMetrics() {
        // Update random micro-fractures count
        const fracturesElement = document.querySelector('.hull-metrics .metric:nth-child(1) .metric-value');
        const currentFractures = parseInt(fracturesElement.textContent);
        const newFractures = Math.max(0, Math.min(10, currentFractures + (Math.random() > 0.7 ? 1 : 0)));
        fracturesElement.textContent = newFractures;
        
        // Update compression
        const compressionElement = document.querySelector('.hull-metrics .metric:nth-child(2) .metric-value');
        const compression = (Math.random() * 0.1 + 0.45).toFixed(2);
        compressionElement.textContent = `${compression}%`;
        
        // Update material fatigue
        const fatigueElement = document.querySelector('.hull-metrics .metric:nth-child(3) .metric-value');
        const currentFatigue = parseFloat(fatigueElement.textContent.replace('%', ''));
        const newFatigue = Math.min(5.0, currentFatigue + (Math.random() * 0.05));
        fatigueElement.textContent = `${newFatigue.toFixed(1)}%`;
    }
    
    function updateEnvironmentalData() {
        // Update current speed
        const speedElement = document.querySelector('.speed-value');
        const currentSpeed = parseFloat(speedElement.textContent);
        const newSpeed = Math.max(0.1, Math.min(2.0, currentSpeed + (Math.random() * 0.4 - 0.2)));
        speedElement.textContent = newSpeed.toFixed(1);
        
        // Update current direction (subtle animation)
        const arrowElement = document.querySelector('.direction-arrow');
        const rotations = ['0deg', '15deg', '-15deg', '30deg', '-30deg'];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        arrowElement.style.transform = `rotate(${randomRotation})`;
        
        // Update environment metrics
        const metrics = document.querySelectorAll('.environment-metrics .metric-value');
        
        if (metrics.length >= 4) {
            // Salinity
            const salinity = (Math.random() * 1 + 34.5).toFixed(1);
            metrics[0].textContent = `${salinity} ppt`;
            
            // O2 Saturation
            const o2 = (Math.random() * 0.5 + 4.0).toFixed(1);
            metrics[1].textContent = `${o2}%`;
            
            // pH
            const ph = (Math.random() * 0.2 + 7.8).toFixed(1);
            metrics[2].textContent = ph;
            
            // Turbidity (randomly changes)
            const turbidities = ['Low', 'Medium', 'High'];
            const newTurbidity = turbidities[Math.floor(Math.random() * turbidities.length)];
            metrics[3].textContent = newTurbidity;
        }
    }
    
    function updateSystemStatuses() {
        const systemItems = document.querySelectorAll('.system-item');
        
        systemItems.forEach(item => {
            // Randomly change status occasionally
            if (Math.random() > 0.9) {
                const statuses = ['status-ok', 'status-warning', 'status-critical'];
                const currentStatus = Array.from(item.classList).find(cls => cls.startsWith('status-'));
                const otherStatuses = statuses.filter(s => s !== currentStatus);
                
                if (otherStatuses.length > 0 && Math.random() > 0.7) {
                    // Remove current status
                    if (currentStatus) {
                        item.classList.remove(currentStatus);
                    }
                    
                    // Add new random status
                    const newStatus = otherStatuses[Math.floor(Math.random() * otherStatuses.length)];
                    item.classList.add(newStatus);
                    
                    // Update status text
                    const statusElement = item.querySelector('.system-status');
                    if (statusElement) {
                        if (newStatus === 'status-ok') {
                            statusElement.textContent = 'NOMINAL';
                            item.querySelector('.system-icon').style.color = getComputedStyle(document.documentElement)
                                .getPropertyValue('--status-ok').trim();
                        } else if (newStatus === 'status-warning') {
                            statusElement.textContent = 'ELEVATED';
                            item.querySelector('.system-icon').style.color = getComputedStyle(document.documentElement)
                                .getPropertyValue('--status-warning').trim();
                        } else {
                            statusElement.textContent = 'CRITICAL';
                            item.querySelector('.system-icon').style.color = getComputedStyle(document.documentElement)
                                .getPropertyValue('--status-critical').trim();
                        }
                    }
                }
            }
        });
        
        // Update alerts based on system status
        updateSystemAlerts();
    }
    
    function updateSystemAlerts() {
        const alertList = document.querySelector('.alert-list');
        const criticalAlerts = document.querySelectorAll('.system-item.status-critical');
        const warningAlerts = document.querySelectorAll('.system-item.status-warning');
        
        // Clear existing alerts except the first two (static)
        const existingAlerts = Array.from(alertList.children).slice(2);
        existingAlerts.forEach(alert => alert.remove());
        
        // Add new alerts based on system status
        criticalAlerts.forEach((system, index) => {
            if (index < 2) { // Limit to 2 critical alerts
                const systemName = system.querySelector('.system-name').textContent;
                const alertItem = document.createElement('div');
                alertItem.className = 'alert-item critical';
                alertItem.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="alert-text">${systemName} SYSTEM REQUIRES IMMEDIATE ATTENTION</div>
                `;
                alertList.appendChild(alertItem);
            }
        });
        
        warningAlerts.forEach((system, index) => {
            if (index < 2) { // Limit to 2 warning alerts
                const systemName = system.querySelector('.system-name').textContent;
                const alertItem = document.createElement('div');
                alertItem.className = 'alert-item warning';
                alertItem.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <div class="alert-text">${systemName} PERFORMANCE DEGRADED - MONITOR CLOSELY</div>
                `;
                alertList.appendChild(alertItem);
            }
        });
    }
    
    /* ============================================
       EVENT LISTENERS SETUP
       ============================================ */
    
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Sonar Ping Button
        sonarPingBtn.addEventListener('click', function() {
            console.log('Sonar ping emitted');
            
            // Play sonar sound
            sonarAudio.currentTime = 0;
            sonarAudio.play().catch(e => console.log('Sonar audio play failed:', e));
            
            // Create ripple from center of sonar display
            const rect = sonarDisplay.getBoundingClientRect();
            const centerX = (rect.left + rect.width / 2) / window.innerWidth * 100;
            const centerY = (rect.top + rect.height / 2) / window.innerHeight * 100;
            
            createSonarRipple(centerX, centerY);
            
            // Add visual feedback to button
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 300);
        });
        
        // Bioluminescence Intensity Slider
        intensitySlider.addEventListener('input', function() {
            const value = this.value;
            intensityValue.textContent = `${value}%`;
            
            // Update particle count based on intensity
            createBioluminescentParticles();
            
            // Update fauna spectrum bars
            updateFaunaSpectrum(value);
        });
        
        // Test Klaxon Button
        testKlaxonBtn.addEventListener('click', function() {
            console.log('Testing pressure warning klaxon');
            
            // Play klaxon sound
            klaxonAudio.currentTime = 0;
            klaxonAudio.play().catch(e => console.log('Klaxon audio play failed:', e));
            
            // Intensify klaxon light animation
            klaxonLight.style.animation = 'klaxon-pulse 0.5s infinite';
            
            // Reset after 3 seconds
            setTimeout(() => {
                updateDepthBasedEffects(); // Restore normal animation
            }, 3000);
            
            // Add visual feedback
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 300);
        });
        
        // Emergency Procedure Button
        emergencyProcedureBtn.addEventListener('click', function() {
            console.log('Emergency surface procedure initiated');
            
            if (confirm('CONFIRM EMERGENCY SURFACE PROCEDURE?\n\nThis will initiate rapid decompression and ascent protocols.')) {
                // Intensify all warnings
                klaxonLight.style.animation = 'klaxon-pulse 0.2s infinite';
                document.body.style.animation = 'emergency-pulse 0.5s infinite';
                
                // Create emergency CSS animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes emergency-pulse {
                        0%, 100% { background-color: rgba(255, 50, 50, 0.05); }
                        50% { background-color: rgba(255, 50, 50, 0.2); }
                    }
                `;
                document.head.appendChild(style);
                
                // Simulate emergency ascent
                simulateEmergencyAscent();
                
                // Add log entry
                addLogEntry('EMERGENCY SURFACE PROCEDURE INITIATED - ALL PERSONNEL TO STATIONS');
            }
        });
        
        // Add Log Entry Button
        addLogEntryBtn.addEventListener('click', function() {
            logInput.focus();
        });
        
        // Submit Log Entry
        logSubmitBtn.addEventListener('click', function() {
            const text = logInput.value.trim();
            if (text) {
                addLogEntry(text);
                logInput.value = '';
            }
        });
        
        // Allow Enter key to submit log (but Shift+Enter for new line)
        logInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                logSubmitBtn.click();
            }
        });
        
        // Hull section click for inspection
        document.querySelectorAll('.hull-section').forEach(section => {
            section.addEventListener('click', function() {
                const sectionName = this.dataset.section;
                const stressHeight = parseFloat(this.querySelector('.section-stress').style.height);
                
                alert(`HULL SECTION INSPECTION: ${sectionName.toUpperCase()}\n\nStress Level: ${stressHeight.toFixed(1)}%\nStatus: ${stressHeight > 20 ? 'CRITICAL' : stressHeight > 10 ? 'ELEVATED' : 'NOMINAL'}\n\nRecommended Action: ${stressHeight > 20 ? 'IMMEDIATE MAINTENANCE REQUIRED' : stressHeight > 10 ? 'SCHEDULE INSPECTION' : 'MONITOR'}`);
            });
        });
        
        // Sonar target clicks for details
        document.querySelectorAll('.sonar-target').forEach(target => {
            target.addEventListener('click', function(e) {
                e.stopPropagation();
                const type = this.dataset.type;
                const top = this.style.top;
                const left = this.style.left;
                
                const typeNames = {
                    'biological': 'BIOLOGICAL ENTITY',
                    'geological': 'GEOLOGICAL FEATURE',
                    'unknown': 'UNIDENTIFIED CONTACT'
                };
                
                alert(`SONAR CONTACT DETAILS\n\nType: ${typeNames[type]}\nPosition: ${top}, ${left}\nRange: ${Math.floor(Math.random() * 400) + 100}m\nSignature: ${type === 'biological' ? 'Organic, pulsating' : type === 'geological' ? 'Inorganic, static' : 'Anomalous, fluctuating'}`);
            });
        });
        
        // Window resize handling
        window.addEventListener('resize', function() {
            // Recreate particles on resize for proper positioning
            particleLayer.innerHTML = '';
            createWaterParticles();
        });
    }
    
    /* ============================================
       HELPER FUNCTIONS
       ============================================ */
    
    function updateFaunaSpectrum(intensity) {
        const spectrumBars = document.querySelectorAll('.spectrum-bar');
        const intensityNum = parseInt(intensity);
        
        spectrumBars.forEach((bar, index) => {
            const dataIntensity = parseInt(bar.dataset.intensity);
            const color = bar.dataset.color;
            
            // Adjust height based on intensity slider and individual bar factor
            const heightFactor = intensityNum / 100;
            const newHeight = Math.min(95, Math.max(5, dataIntensity * heightFactor + (Math.random() * 10)));
            
            // Update the bar
            bar.style.setProperty('--bar-height', `${newHeight}%`);
            bar.querySelector('::before').style.height = `${newHeight}%`;
            
            // Update color intensity
            const opacity = 0.3 + (intensityNum / 100) * 0.7;
            bar.style.background = `linear-gradient(to top, ${color}${Math.round(opacity * 255).toString(16)} 0%, ${color}00 100%)`;
        });
    }
    
    function addLogEntry(text) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const logEntries = document.querySelector('.log-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'log-entry';
        newEntry.innerHTML = `
            <div class="log-time">${timeString}</div>
            <div class="log-content">${text}</div>
        `;
        
        // Add at the top
        logEntries.insertBefore(newEntry, logEntries.firstChild);
        
        // Limit to 10 entries
        const entries = logEntries.children;
        if (entries.length > 10) {
            logEntries.removeChild(entries[entries.length - 1]);
        }
        
        // Animate new entry
        newEntry.style.opacity = '0';
        newEntry.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            newEntry.style.transition = 'all 0.5s ease';
            newEntry.style.opacity = '1';
            newEntry.style.transform = 'translateX(0)';
        }, 10);
    }
    
    function simulateEmergencyAscent() {
        console.log('Simulating emergency ascent...');
        
        // Rapidly decrease depth
        let currentDepth = parseInt(depthValue.textContent.replace(',', ''));
        const descentInterval = setInterval(() => {
            currentDepth -= 50; // Rapid ascent
            
            if (currentDepth <= 0) {
                currentDepth = 0;
                clearInterval(descentInterval);
                
                // Reset emergency state after reaching surface
                setTimeout(() => {
                    document.body.style.animation = '';
                    klaxonLight.style.animation = 'klaxon-pulse 4s infinite';
                    alert('EMERGENCY ASCENT COMPLETE\n\nStation has reached surface. All systems stabilizing.');
                }, 2000);
            }
            
            depthValue.textContent = currentDepth.toLocaleString();
            updateDepthBasedEffects();
        }, 100);
        
        // Stop after 10 seconds
        setTimeout(() => {
            clearInterval(descentInterval);
        }, 10000);
    }
    
    /* ============================================
       ADDITIONAL VISUAL EFFECTS
       ============================================ */
    
    // Create occasional bubble effects
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance every 5 seconds
            createBubble();
        }
    }, 5000);
    
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 15 + 5;
        const startX = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        
        bubble.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at 30% 30%, rgba(200, 230, 255, 0.8), rgba(100, 180, 255, 0.3));
            border-radius: 50%;
            left: ${startX}%;
            bottom: -20px;
            pointer-events: none;
            z-index: 5;
            animation: bubble-rise ${duration}s linear forwards;
        `;
        
        document.body.appendChild(bubble);
        
        // Add CSS for bubble animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bubble-rise {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-120vh) scale(${0.3 + Math.random() * 0.3});
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove bubble after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, duration * 1000);
    }
    
    // Initialize fauna spectrum
    updateFaunaSpectrum(intensitySlider.value);
    
    console.log('Dashboard JavaScript loaded successfully.');
});
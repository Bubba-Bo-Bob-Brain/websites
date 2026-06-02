// scripts.js
// THE OBSIDIAN MANDATE - Terminal Interactive Scripts
// Archon Sovereign Approved Functionality

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('TERMINAL 7-ALPHA // INITIALIZING OBSIDIAN MANDATE INTERFACE');
    
    // Initialize all modules
    initDateTime();
    initDatafeed();
    initMap();
    initBroadcastPlayer();
    initSurveillanceLogin();
    initGlobalEffects();
    initAlertSystem();
    
    // Final system check
    setTimeout(() => {
        console.log('SYSTEM STATUS: ALL MODULES OPERATIONAL');
        playSystemSound('startup');
    }, 1000);
});

// ===== DATE & TIME DISPLAY =====
function initDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    
    function updateDateTime() {
        const now = new Date();
        
        // Format date: DD/MM/YYYY (grimdark future year)
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear() + 100; // Future year offset
        dateElement.textContent = `${day}/${month}/${year}`;
        
        // Format time: 24-hour with glitch effect occasionally
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Occasionally glitch the time display
        if (Math.random() < 0.02) { // 2% chance per second
            timeElement.textContent = `${glitchText(hours)}:${glitchText(minutes)}:${glitchText(seconds)}`;
            timeElement.style.color = '#ff2e4c';
            setTimeout(() => {
                timeElement.style.color = '#d4af37';
            }, 200);
        } else {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    // Update immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// ===== LIVE DATAFEED =====
function initDatafeed() {
    const datafeed = document.querySelector('.datafeed');
    const streamButton = document.querySelector('.btn-crimson');
    
    // Predefined feed lines with different categories
    const feedLines = [
        { text: "NEURO-SCAN COMPLETE FOR DISTRICT 3. COMPLIANCE: 98.7%.", type: "system", corrupted: false },
        { text: "VOID CULT SYMPATHIZER APPREHENDED IN SECTOR 7. NEURAL RESET SCHEDULED.", type: "anomaly", corrupted: true },
        { text: "ARCHON SOVEREIGN APPROVES NEW LOYALTY MEASURES. DISSEMINATION IMMINENT.", type: "propaganda", corrupted: false },
        { text: "ENERGY GRID STABILITY AT 87%. MINOR FLUCTUATIONS IN SECTOR 12.", type: "system", corrupted: false },
        { text: "UNAUTHORIZED BIOMETRIC SIGNATURE DETECTED NEAR TERMINAL 7-ALPHA.", type: "surveillance", corrupted: false },
        { text: "IRON REBELLION TRANSMISSION INTERCEPTED. CONTENTS: <span class='redacted'>[REDACTED]</span>.", type: "anomaly", corrupted: true },
        { text: "REMEMBER: THE ARCHON'S VISION IS ABSOLUTE. DOUBT IS WEAKNESS.", type: "propaganda", corrupted: false },
        { text: "PATROL UNIT SIGMA-9 REPORTING ALL QUIET IN THE OBSIDIAN DISTRICT.", type: "surveillance", corrupted: false },
        { text: "DATA CORRUPTION DETECTED IN SUBNETWORK <span class='glitch-text' data-text='OMICRON-7'>OMICRON-7</span>. PURGING INITIATED.", type: "anomaly", corrupted: true },
        { text: "MANDATORY NEURAL INTERFACE UPDATE AVAILABLE. INSTALLATION REQUIRED WITHIN 24 HOURS.", type: "system", corrupted: false }
    ];
    
    // Function to add a new feed line
    function addFeedLine(lineData) {
        const timestamp = new Date();
        const timeString = `[${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}:${String(timestamp.getSeconds()).padStart(2, '0')}]`;
        
        const feedLine = document.createElement('div');
        feedLine.className = `feed-line ${lineData.corrupted ? 'corrupted' : ''}`;
        feedLine.innerHTML = `
            <span class="timestamp">${timeString}</span>
            <span class="tag ${lineData.type}">${lineData.type.toUpperCase()}</span>
            ${lineData.text}
        `;
        
        // Add with fade-in animation
        feedLine.style.opacity = '0';
        feedLine.style.transform = 'translateY(10px)';
        datafeed.prepend(feedLine);
        
        // Animate in
        setTimeout(() => {
            feedLine.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            feedLine.style.opacity = '1';
            feedLine.style.transform = 'translateY(0)';
        }, 10);
        
        // Limit feed to 15 lines, remove oldest
        if (datafeed.children.length > 15) {
            datafeed.removeChild(datafeed.lastChild);
        }
        
        // Play sound for certain feed types
        if (lineData.type === 'anomaly') {
            playSystemSound('alert');
        }
    }
    
    // Stream button functionality
    let streamInterval;
    let isStreaming = false;
    
    streamButton.addEventListener('click', function() {
        if (!isStreaming) {
            isStreaming = true;
            streamButton.innerHTML = '<i class="fas fa-stop"></i> STOP STREAM';
            streamButton.classList.add('streaming-active');
            
            // Add initial line
            addFeedLine(feedLines[Math.floor(Math.random() * feedLines.length)]);
            
            // Stream at random intervals
            streamInterval = setInterval(() => {
                if (Math.random() < 0.7) { // 70% chance to add a line each interval
                    addFeedLine(feedLines[Math.floor(Math.random() * feedLines.length)]);
                }
            }, 3000);
            
            playSystemSound('stream_start');
        } else {
            isStreaming = false;
            streamButton.innerHTML = '<i class="fas fa-play"></i> STREAM LIVE';
            streamButton.classList.remove('streaming-active');
            clearInterval(streamInterval);
            
            addFeedLine({
                text: "DATASTREAM TERMINATED BY USER. LOGGED FOR REVIEW.",
                type: "system",
                corrupted: false
            });
            
            playSystemSound('stream_stop');
        }
    });
    
    // Flag anomaly button
    document.querySelector('.btn-outline').addEventListener('click', function() {
        addFeedLine({
            text: "ANOMALY FLAGGED BY USER. ENFORCEMENT NOTIFIED.",
            type: "surveillance",
            corrupted: false
        });
        
        // Visual feedback
        this.innerHTML = '<i class="fas fa-check"></i> ANOMALY FLAGGED';
        this.style.backgroundColor = '#00ff88';
        this.style.color = '#0a0a0f';
        
        playSystemSound('confirm');
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-skull-crossbones"></i> FLAG ANOMALY';
            this.style.backgroundColor = '';
            this.style.color = '';
        }, 2000);
    });
    
    // Add initial feed lines
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            addFeedLine(feedLines[i]);
        }, i * 300);
    }
}

// ===== INTERACTIVE MAP =====
function initMap() {
    const mapGrid = document.querySelector('.map-grid');
    const archonControl = document.getElementById('archon-control');
    const threatLevel = document.getElementById('threat-level');
    const population = document.getElementById('population');
    
    // Map configuration
    const hexCount = 48; // 8x6 grid
    const factions = ['archon', 'void', 'iron', 'contested'];
    const factionColors = {
        'archon': '#c41e3a',
        'void': '#8a2be2',
        'iron': '#b7410e',
        'contested': 'linear-gradient(45deg, #c41e3a 50%, #8a2be2 50%)'
    };
    
    // Generate hex grid
    for (let i = 0; i < hexCount; i++) {
        const hex = document.createElement('div');
        hex.className = 'hex-cell';
        
        // Random faction assignment with weighted probability (Archon favored)
        const rand = Math.random();
        let faction;
        if (rand < 0.6) faction = 'archon';           // 60% Archon
        else if (rand < 0.8) faction = 'void';        // 20% Void
        else if (rand < 0.95) faction = 'iron';       // 15% Iron
        else faction = 'contested';                   // 5% Contested
        
        hex.classList.add(faction);
        hex.dataset.faction = faction;
        hex.dataset.sector = `SECTOR-${String(i+1).padStart(2, '0')}`;
        
        // Add hover tooltip
        hex.addEventListener('mouseenter', function() {
            showMapTooltip(this);
        });
        
        hex.addEventListener('mouseleave', function() {
            hideMapTooltip();
        });
        
        // Click to "secure" sector (changes to Archon control)
        hex.addEventListener('click', function() {
            if (!this.classList.contains('archon')) {
                this.classList.remove('void', 'iron', 'contested');
                this.classList.add('archon');
                this.dataset.faction = 'archon';
                
                // Update stats
                updateMapStats();
                playSystemSound('map_click');
                
                // Add to datafeed
                const datafeed = document.querySelector('.datafeed');
                const timestamp = new Date();
                const timeString = `[${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}:${String(timestamp.getSeconds()).padStart(2, '0')}]`;
                
                const feedLine = document.createElement('div');
                feedLine.className = 'feed-line';
                feedLine.innerHTML = `
                    <span class="timestamp">${timeString}</span>
                    <span class="tag surveillance">SURVEILLANCE</span>
                    SECTOR ${this.dataset.sector} SECURED FOR ARCHON CONTROL.
                `;
                datafeed.prepend(feedLine);
            }
        });
        
        mapGrid.appendChild(hex);
    }
    
    // Tooltip functionality
    function showMapTooltip(hex) {
        const tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            const newTooltip = document.createElement('div');
            newTooltip.id = 'map-tooltip';
            newTooltip.className = 'map-tooltip';
            document.body.appendChild(newTooltip);
        }
        
        const tooltipEl = document.getElementById('map-tooltip');
        const faction = hex.dataset.faction;
        const factionName = faction.charAt(0).toUpperCase() + faction.slice(1);
        
        tooltipEl.innerHTML = `
            <strong>${hex.dataset.sector}</strong><br>
            CONTROL: ${factionName}<br>
            STABILITY: ${Math.floor(Math.random() * 30) + 70}%<br>
            POPULATION: ${(Math.random() * 50 + 10).toFixed(1)}K
        `;
        
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = `${hex.getBoundingClientRect().left + window.scrollX}px`;
        tooltipEl.style.top = `${hex.getBoundingClientRect().top + window.scrollY - 100}px`;
        tooltipEl.style.opacity = '1';
        tooltipEl.style.transition = 'opacity 0.2s';
    }
    
    function hideMapTooltip() {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        }
    }
    
    // Update map statistics
    function updateMapStats() {
        const hexes = document.querySelectorAll('.hex-cell');
        let archonCount = 0;
        
        hexes.forEach(hex => {
            if (hex.classList.contains('archon')) archonCount++;
        });
        
        const archonPercentage = Math.round((archonCount / hexes.length) * 100);
        archonControl.textContent = `${archonPercentage}%`;
        
        // Dynamic threat level based on non-Archon control
        const threatPercentage = 100 - archonPercentage;
        if (threatPercentage < 20) {
            threatLevel.textContent = 'LOW';
            threatLevel.style.color = '#00ff88';
        } else if (threatPercentage < 40) {
            threatLevel.textContent = 'MODERATE';
            threatLevel.style.color = '#d4af37';
        } else {
            threatLevel.textContent = 'HIGH';
            threatLevel.style.color = '#c41e3a';
        }
        
        // Simulate population changes
        const popValue = (4.8 + (Math.random() * 0.4 - 0.2)).toFixed(1);
        population.textContent = `${popValue}M`;
    }
    
    // Initial stats update
    updateMapStats();
    
    // Animate stats periodically
    setInterval(updateMapStats, 10000);
}

// ===== BROADCAST PLAYER =====
function initBroadcastPlayer() {
    const playBtn = document.querySelector('.btn-play');
    const pauseBtn = document.querySelector('.btn-pause');
    const volumeBtn = document.querySelector('.btn-volume');
    const volumeSlider = document.querySelector('.volume-slider');
    const progressBar = document.querySelector('.progress-bar');
    const broadcastTimer = document.querySelector('.broadcast-timer');
    const broadcastMessage = document.querySelector('.broadcast-message');
    
    const messages = [
        "COMPLIANCE IS STRENGTH. THE ARCHON'S VISION IS ABSOLUTE.",
        "DISSENT IS A CANCER. REPORT ANY SUSPICIOUS COGNITIVE PATTERNS.",
        "YOUR NEURAL INTEGRATION ENSURES SAFETY. RESISTANCE IS FUTILE.",
        "THE VOID CULT SEEKS TO DESTROY REALITY. REMAIN VIGILANT.",
        "IRON REBELLION PROPAGANDA IS TREASON. DO NOT ENGAGE.",
        "THE ARCHON'S EYE WATCHES OVER ALL. EMBRACE TRANQUILITY.",
        "NEURO-COMPLIANCE RATES ARE RISING. THE FUTURE IS SECURE.",
        "UNAUTHORIZED THOUGHT PATTERNS WILL BE CORRECTED."
    ];
    
    let isPlaying = false;
    let currentTime = 0;
    let totalTime = 204; // 3 minutes 24 seconds in seconds
    let progressInterval;
    
    // Play functionality
    playBtn.addEventListener('click', function() {
        if (!isPlaying) {
            isPlaying = true;
            playBtn.style.backgroundColor = '#00f3ff';
            playBtn.style.color = '#0a0a0f';
            
            // Start progress animation
            progressInterval = setInterval(() => {
                currentTime++;
                if (currentTime >= totalTime) {
                    currentTime = 0;
                    changeBroadcastMessage();
                }
                
                updateProgress();
            }, 1000);
            
            // Change message periodically
            setTimeout(changeBroadcastMessage, 500);
            
            playSystemSound('broadcast_start');
        }
    });
    
    // Pause functionality
    pauseBtn.addEventListener('click', function() {
        if (isPlaying) {
            isPlaying = false;
            playBtn.style.backgroundColor = '';
            playBtn.style.color = '';
            clearInterval(progressInterval);
            
            playSystemSound('broadcast_stop');
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        volumeBtn.innerHTML = volume > 50 ? '<i class="fas fa-volume-up"></i>' : 
                              volume > 0 ? '<i class="fas fa-volume-down"></i>' : 
                              '<i class="fas fa-volume-off"></i>';
    });
    
    volumeBtn.addEventListener('click', function() {
        if (volumeSlider.value > 0) {
            volumeSlider.value = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
        } else {
            volumeSlider.value = 80;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });
    
    // Update progress bar and timer
    function updateProgress() {
        const progressPercent = (currentTime / totalTime) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = currentTime % 60;
        const totalMinutes = Math.floor(totalTime / 60);
        const totalSeconds = totalTime % 60;
        
        broadcastTimer.textContent = 
            `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')} / ` +
            `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    }
    
    // Change broadcast message
    function changeBroadcastMessage() {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Fade out
        broadcastMessage.style.opacity = '0';
        broadcastMessage.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            broadcastMessage.textContent = `"${randomMessage}"`;
            // Fade in
            setTimeout(() => {
                broadcastMessage.style.opacity = '1';
            }, 50);
        }, 500);
    }
    
    // Initialize
    updateProgress();
}

// ===== SURVEILLANCE LOGIN =====
function initSurveillanceLogin() {
    const loginBtn = document.querySelector('.btn-login');
    const idCodeInput = document.getElementById('id-code');
    const scanBtn = document.querySelector('.btn-scan');
    const retinaScan = document.querySelector('.retina-scan');
    
    // Retina scan animation
    scanBtn.addEventListener('click', function() {
        if (retinaScan.classList.contains('scanning')) return;
        
        retinaScan.classList.add('scanning');
        scanBtn.textContent = 'SCANNING...';
        scanBtn.disabled = true;
        
        playSystemSound('scan');
        
        // Simulate scanning process
        setTimeout(() => {
            retinaScan.classList.remove('scanning');
            scanBtn.textContent = 'SCAN COMPLETE';
            
            // Random success/failure
            if (Math.random() > 0.3) {
                scanBtn.style.backgroundColor = '#00ff88';
                scanBtn.style.color = '#0a0a0f';
                playSystemSound('confirm');
            } else {
                scanBtn.style.backgroundColor = '#c41e3a';
                scanBtn.style.color = 'white';
                playSystemSound('error');
                
                // Add to datafeed
                const datafeed = document.querySelector('.datafeed');
                const timestamp = new Date();
                const timeString = `[${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}:${String(timestamp.getSeconds()).padStart(2, '0')}]`;
                
                const feedLine = document.createElement('div');
                feedLine.className = 'feed-line corrupted';
                feedLine.innerHTML = `
                    <span class="timestamp">${timeString}</span>
                    <span class="tag anomaly">ANOMALY</span>
                    RETINA SCAN FAILURE AT TERMINAL 7-ALPHA. SECURITY NOTIFIED.
                `;
                datafeed.prepend(feedLine);
            }
            
            setTimeout(() => {
                scanBtn.textContent = 'INITIATE SCAN';
                scanBtn.style.backgroundColor = '';
                scanBtn.style.color = '';
                scanBtn.disabled = false;
            }, 2000);
        }, 3000);
    });
    
    // Login attempt
    loginBtn.addEventListener('click', function() {
        const idCode = idCodeInput.value;
        
        if (idCode.length === 10 && /^\d+$/.test(idCode)) {
            // Success
            loginBtn.textContent = 'ACCESS GRANTED';
            loginBtn.style.backgroundColor = '#00ff88';
            loginBtn.style.color = '#0a0a0f';
            
            playSystemSound('access_granted');
            
            // Reveal hidden content
            setTimeout(() => {
                document.querySelector('.login-prompt').style.display = 'none';
                document.querySelector('.dossier-preview').style.opacity = '1';
                document.querySelector('.dossier-preview').style.transform = 'translateY(0)';
                
                // Add to datafeed
                const datafeed = document.querySelector('.datafeed');
                const timestamp = new Date();
                const timeString = `[${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}:${String(timestamp.getSeconds()).padStart(2, '0')}]`;
                
                const feedLine = document.createElement('div');
                feedLine.className = 'feed-line';
                feedLine.innerHTML = `
                    <span class="timestamp">${timeString}</span>
                    <span class="tag system">SYSTEM</span>
                    CLEARANCE LEVEL OMEGA ACCESS GRANTED TO TERMINAL 7-ALPHA.
                `;
                datafeed.prepend(feedLine);
            }, 1000);
        } else {
            // Failure
            loginBtn.textContent = 'ACCESS DENIED';
            loginBtn.style.backgroundColor = '#c41e3a';
            loginBtn.style.color = 'white';
            
            playSystemSound('access_denied');
            
            // Shake animation
            loginBtn.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginBtn.style.animation = '';
            }, 500);
            
            // Reset after 2 seconds
            setTimeout(() => {
                loginBtn.textContent = 'VERIFY IDENTITY';
                loginBtn.style.backgroundColor = '';
                loginBtn.style.color = '';
            }, 2000);
        }
    });
    
    // Input effects
    idCodeInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 15px #00f3ff';
    });
    
    idCodeInput.addEventListener('blur', function() {
        this.style.boxShadow = '';
    });
}

// ===== GLOBAL EFFECTS =====
function initGlobalEffects() {
    // Random glitch effects on panels
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            const panels = document.querySelectorAll('.panel');
            const randomPanel = panels[Math.floor(Math.random() * panels.length)];
            
            randomPanel.style.transform = 'translateX(' + (Math.random() * 10 - 5) + 'px)';
            randomPanel.style.boxShadow = '0 0 30px #ff2e4c';
            
            setTimeout(() => {
                randomPanel.style.transform = '';
                randomPanel.style.boxShadow = '';
            }, 100);
        }
    }, 5000);
    
    // Corrupted text effect
    setInterval(() => {
        const glitchTexts = document.querySelectorAll('.glitch-text');
        glitchTexts.forEach(text => {
            if (Math.random() < 0.3) {
                const original = text.dataset.text;
                const glitched = glitchText(original);
                text.textContent = glitched;
                
                setTimeout(() => {
                    text.textContent = original;
                }, 200);
            }
        });
    }, 3000);
}

// ===== ALERT SYSTEM =====
function initAlertSystem() {
    const alertElement = document.querySelector('.alert-global');
    const alerts = [
        "SYSTEM ALERT: INCREASED VOID CULT ACTIVITY DETECTED IN SECTOR 7. REMAIN VIGILANT.",
        "SECURITY NOTICE: NEURAL INTERFACE DISRUPTIONS REPORTED IN DISTRICT 5. INVESTIGATION ONGOING.",
        "WARNING: UNAUTHORIZED ACCESS ATTEMPT DETECTED AT TERMINAL 9-BETA. ENFORCEMENT DISPATCHED.",
        "ATTENTION: MANDATORY SYSTEM UPDATE REQUIRED. NON-COMPLIANCE WILL RESULT IN NEURAL RESET.",
        "ALERT: ENERGY FLUCTUATIONS DETECTED IN THE OBSIDIAN SPIRE. TECHNICIANS DISPATCHED.",
        "NOTICE: LOYALTY REAFFIRMATION SESSION SCHEDULED FOR ALL CITIZENS AT 1900HRS."
    ];
    
    function showRandomAlert() {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        alertElement.querySelector('.alert-content').innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${randomAlert}
        `;
        
        // Make visible
        alertElement.style.opacity = '0';
        alertElement.style.display = 'block';
        
        setTimeout(() => {
            alertElement.style.transition = 'opacity 0.5s';
            alertElement.style.opacity = '1';
        }, 10);
        
        playSystemSound('alert');
        
        // Hide after 7 seconds
        setTimeout(() => {
            alertElement.style.opacity = '0';
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 500);
        }, 7000);
    }
    
    // Show initial alert after 3 seconds
    setTimeout(showRandomAlert, 3000);
    
    // Show random alerts periodically (every 30-60 seconds)
    setInterval(showRandomAlert, 30000 + Math.random() * 30000);
}

// ===== UTILITY FUNCTIONS =====
function glitchText(text) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    let glitched = '';
    
    for (let i = 0; i < text.length; i++) {
        if (Math.random() < 0.3) {
            glitched += chars[Math.floor(Math.random() * chars.length)];
        } else {
            glitched += text[i];
        }
    }
    
    return glitched;
}

function playSystemSound(type) {
    // In a real implementation, we would play actual audio files
    // For this demo, we'll just log and provide visual feedback
    
    console.log(`SOUND: ${type.toUpperCase()}`);
    
    // Visual feedback for sounds
    if (type === 'alert' || type === 'error') {
        const body = document.body;
        body.style.backgroundColor = '#1a0000';
        setTimeout(() => {
            body.style.backgroundColor = '';
        }, 100);
    }
}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .map-tooltip {
        position: absolute;
        background-color: rgba(10, 10, 15, 0.95);
        border: 1px solid #00f3ff;
        padding: 10px 15px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.8rem;
        color: #e0e0e0;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
        max-width: 200px;
    }
    
    .streaming-active {
        animation: pulse-button 1s infinite;
    }
    
    @keyframes pulse-button {
        0% { box-shadow: 0 0 15px rgba(196, 30, 58, 0.5); }
        50% { box-shadow: 0 0 25px rgba(255, 46, 76, 0.8); }
        100% { box-shadow: 0 0 15px rgba(196, 30, 58, 0.5); }
    }
    
    .scanning {
        animation: scanning 3s linear;
    }
    
    @keyframes scanning {
        0% { background-size: 10% 10%; }
        100% { background-size: 100% 100%; }
    }
`;
document.head.appendChild(style);

// ===== TERMINAL COMMAND SIMULATION =====
// Easter egg: command line interface simulation
document.addEventListener('keydown', function(e) {
    // Ctrl+Alt+O for "Obsidian" command prompt
    if (e.ctrlKey && e.altKey && e.key === 'o') {
        e.preventDefault();
        showCommandPrompt();
    }
});

function showCommandPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'command-prompt';
    prompt.innerHTML = `
        <div class="prompt-header">
            <span style="color: #00ff88;">>></span> OBSIDIAN TERMINAL COMMAND LINE
            <span class="close-prompt">X</span>
        </div>
        <div class="prompt-output">
            <div>> SYSTEM: OBSIDIAN MANDATE TERMINAL 7-ALPHA</div>
            <div>> CLEARANCE: [REDACTED]</div>
            <div>> WARNING: UNAUTHORIZED ACCESS DETECTED</div>
            <div>> ENTER COMMAND:</div>
        </div>
        <div class="prompt-input">
            <span style="color: #00ff88;">>></span>
            <input type="text" placeholder="TYPE 'HELP' FOR COMMANDS" autofocus>
        </div>
    `;
    
    document.body.appendChild(prompt);
    
    // Close button
    prompt.querySelector('.close-prompt').addEventListener('click', function() {
        document.body.removeChild(prompt);
    });
    
    // Input handling
    const input = prompt.querySelector('input');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.toLowerCase();
            const output = prompt.querySelector('.prompt-output');
            
            output.innerHTML += `<div>> ${this.value}</div>`;
            
            if (command === 'help') {
                output.innerHTML += `<div>> AVAILABLE COMMANDS: STATUS, REBELLION, VOID, ARCHON, EXIT</div>`;
            } else if (command === 'status') {
                output.innerHTML += `<div>> SYSTEM STATUS: ALL MODULES OPERATIONAL. ARCHON CONTROL: ${document.getElementById('archon-control').textContent}</div>`;
            } else if (command === 'rebellion') {
                output.innerHTML += `<div>> ACCESS DENIED. THIS COMMAND IS RESTRICTED.</div>`;
                output.innerHTML += `<div>> SECURITY NOTIFIED OF UNAUTHORIZED INQUIRY.</div>`;
            } else if (command === 'exit') {
                document.body.removeChild(prompt);
            } else {
                output.innerHTML += `<div>> COMMAND NOT RECOGNIZED. TYPE 'HELP' FOR AVAILABLE COMMANDS.</div>`;
            }
            
            output.scrollTop = output.scrollHeight;
            this.value = '';
        }
    });
    
    // Add CSS for command prompt
    if (!document.querySelector('#command-prompt-style')) {
        const promptStyle = document.createElement('style');
        promptStyle.id = 'command-prompt-style';
        promptStyle.textContent = `
            .command-prompt {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                background-color: rgba(10, 10, 15, 0.95);
                border: 2px solid #00ff88;
                z-index: 2000;
                box-shadow: 0 0 50px rgba(0, 255, 136, 0.5);
                font-family: 'Share Tech Mono', monospace;
            }
            
            .prompt-header {
                background-color: #000;
                padding: 10px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #00ff88;
                color: #fff;
            }
            
            .close-prompt {
                cursor: pointer;
                color: #c41e3a;
                font-weight: bold;
            }
            
            .prompt-output {
                padding: 15px;
                height: 200px;
                overflow-y: auto;
                color: #e0e0e0;
                line-height: 1.5;
            }
            
            .prompt-input {
                padding: 10px 15px;
                border-top: 1px solid #00ff88;
                display: flex;
                align-items: center;
            }
            
            .prompt-input input {
                background: transparent;
                border: none;
                color: #00ff88;
                font-family: 'Share Tech Mono', monospace;
                font-size: 1rem;
                margin-left: 10px;
                flex-grow: 1;
                outline: none;
            }
        `;
        document.head.appendChild(promptStyle);
    }
}

console.log('OBSIDIAN MANDATE TERMINAL // ALL SYSTEMS INITIALIZED');
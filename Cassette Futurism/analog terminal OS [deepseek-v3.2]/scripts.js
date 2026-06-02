/* ============================================
   NEXUS-70 OPERATING SYSTEM - INTERACTIVE FUNCTIONALITY
   Features:
   - Toggle switch interactions with sound
   - Tape reel animations and controls
   - Rotary dial navigation
   - File manager interactions
   - Ticker tape console with dynamic logging
   - CRT effect controls
   - System status updates
   ============================================ */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('NEXUS-70 OS Initializing...');
    
    // Initialize all system modules
    initToggleSwitches();
    initTapeControls();
    initRotaryDial();
    initFileManager();
    initConsole();
    initSystemControls();
    initCRTEffects();
    initAudio();
    
    // Start system status updates
    startSystemUpdates();
    
    // Initial system log
    addLogEntry('[19:47:15] NEXUS-70 INTERFACE INITIALIZED');
    addLogEntry('[19:47:16] ALL SYSTEMS OPERATIONAL');
    
    console.log('NEXUS-70 OS Ready.');
});

// Initialize toggle switches
function initToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch.large');
    
    toggleSwitches.forEach(switchElement => {
        switchElement.addEventListener('click', function() {
            const currentState = this.getAttribute('data-state');
            const newState = currentState === 'on' ? 'off' : 'on';
            
            // Update visual state
            this.setAttribute('data-state', newState);
            const lever = this.querySelector('.toggle-lever');
            
            // Animate lever movement
            if (newState === 'on') {
                lever.style.transform = 'translateX(30px)';
                lever.style.backgroundColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--accent-green').trim();
                
                // Update label if it's the CRT Bloom toggle
                if (this.closest('.toggle-unit')?.querySelector('.toggle-label')?.textContent === 'CRT BLOOM') {
                    document.querySelector('.crt-overlay').style.opacity = '0.6';
                    addLogEntry('[19:47:20] CRT BLOOM EFFECT: ENABLED');
                }
                
                // Update label if it's the Scanlines toggle
                if (this.closest('.toggle-unit')?.querySelector('.toggle-label')?.textContent === 'SCANLINES') {
                    document.querySelector('.scanlines').style.opacity = '0.7';
                    addLogEntry('[19:47:21] SCANLINE EFFECT: ENABLED');
                }
            } else {
                lever.style.transform = 'translateX(2px)';
                lever.style.backgroundColor = '#555';
                
                // Update label if it's the CRT Bloom toggle
                if (this.closest('.toggle-unit')?.querySelector('.toggle-label')?.textContent === 'CRT BLOOM') {
                    document.querySelector('.crt-overlay').style.opacity = '0.2';
                    addLogEntry('[19:47:22] CRT BLOOM EFFECT: DISABLED');
                }
                
                // Update label if it's the Scanlines toggle
                if (this.closest('.toggle-unit')?.querySelector('.toggle-label')?.textContent === 'SCANLINES') {
                    document.querySelector('.scanlines').style.opacity = '0.3';
                    addLogEntry('[19:47:23] SCANLINE EFFECT: DISABLED');
                }
            }
            
            // Play toggle sound
            playSound('toggle-sound');
            
            // Add haptic feedback simulation
            simulateHapticFeedback();
        });
    });
    
    // Mode toggle (monochrome/green)
    const modeToggle = document.getElementById('toggle-monochrome');
    const toggleKnob = modeToggle.querySelector('.toggle-knob');
    
    modeToggle.addEventListener('click', function() {
        const body = document.body;
        const isGreenMode = body.classList.contains('green-mode');
        
        if (isGreenMode) {
            body.classList.remove('green-mode');
            toggleKnob.style.transform = 'translateX(0)';
            addLogEntry('[19:47:25] DISPLAY MODE: AMBER PHOSPHOR');
        } else {
            body.classList.add('green-mode');
            toggleKnob.style.transform = 'translateX(26px)';
            addLogEntry('[19:47:26] DISPLAY MODE: GREEN PHOSPHOR');
        }
        
        playSound('click-sound');
    });
    
    // Power button
    const powerBtn = document.getElementById('power-btn');
    powerBtn.addEventListener('click', function() {
        // Toggle power state visual
        this.classList.toggle('power-off');
        
        if (this.classList.contains('power-off')) {
            this.innerHTML = '<i class="fas fa-power-off"></i>';
            this.style.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-red').trim();
            addLogEntry('[19:47:30] SYSTEM POWER: STANDBY MODE');
            
            // Dim interface
            document.querySelector('.nexus-os').style.opacity = '0.7';
            document.querySelector('.nexus-os').style.filter = 'grayscale(50%)';
            
            // Stop animations
            stopAllAnimations();
        } else {
            this.innerHTML = '<i class="fas fa-power-off"></i>';
            this.style.color = '';
            addLogEntry('[19:47:35] SYSTEM POWER: FULL OPERATIONAL');
            
            // Restore interface
            document.querySelector('.nexus-os').style.opacity = '1';
            document.querySelector('.nexus-os').style.filter = '';
            
            // Restart animations
            restartAllAnimations();
        }
        
        playSound('toggle-sound');
    });
}

// Initialize tape controls
function initTapeControls() {
    const rewindBtn = document.getElementById('rewind-btn');
    const playBtn = document.getElementById('play-btn');
    const fastForwardBtn = document.getElementById('fastforward-btn');
    const tapeReels = document.querySelectorAll('.reel .tape-film');
    const tapeMeter = document.querySelector('.meter-fill');
    const tapePosition = document.querySelector('.tape-position');
    
    // Set initial state
    let tapeSpeed = 10; // seconds for full rotation
    let tapePos = 65; // position 65/100
    let isPlaying = true;
    
    // Function to update tape animation speed
    function updateTapeSpeed(speed) {
        tapeReels.forEach(reel => {
            reel.style.animationDuration = `${speed}s`;
        });
    }
    
    // Function to update tape position
    function updateTapePosition(newPos) {
        tapePos = Math.max(0, Math.min(100, newPos));
        tapeMeter.style.width = `${tapePos}%`;
        tapePosition.textContent = `${tapePos.toString().padStart(3, '0')}/100`;
    }
    
    // Rewind button
    rewindBtn.addEventListener('click', function() {
        playSound('tape-sound');
        
        // Update button states
        rewindBtn.classList.add('active');
        playBtn.classList.remove('active');
        fastForwardBtn.classList.remove('active');
        
        // Speed up animation for rewind
        updateTapeSpeed(3);
        
        // Animate tape position decreasing
        let rewindInterval = setInterval(() => {
            if (tapePos <= 0) {
                clearInterval(rewindInterval);
                addLogEntry('[19:47:40] TAPE OPERATION: REWIND COMPLETE');
                return;
            }
            
            tapePos--;
            updateTapePosition(tapePos);
        }, 30);
        
        // Log the operation
        addLogEntry('[19:47:38] TAPE OPERATION: REWIND INITIATED');
        
        // Reset speed after 3 seconds
        setTimeout(() => {
            if (rewindBtn.classList.contains('active')) {
                updateTapeSpeed(10);
            }
        }, 3000);
    });
    
    // Play button
    playBtn.addEventListener('click', function() {
        playSound('click-sound');
        
        // Update button states
        rewindBtn.classList.remove('active');
        playBtn.classList.add('active');
        fastForwardBtn.classList.remove('active');
        
        // Normal speed for play
        updateTapeSpeed(10);
        
        // Log the operation
        addLogEntry('[19:47:42] TAPE OPERATION: READ MODE');
        
        // Simulate reading
        if (!isPlaying) {
            isPlaying = true;
            restartAllAnimations();
        }
    });
    
    // Fast forward button
    fastForwardBtn.addEventListener('click', function() {
        playSound('tape-sound');
        
        // Update button states
        rewindBtn.classList.remove('active');
        playBtn.classList.remove('active');
        fastForwardBtn.classList.add('active');
        
        // Speed up animation for fast forward
        updateTapeSpeed(3);
        
        // Animate tape position increasing
        let ffInterval = setInterval(() => {
            if (tapePos >= 100) {
                clearInterval(ffInterval);
                addLogEntry('[19:47:45] TAPE OPERATION: FAST FORWARD COMPLETE');
                return;
            }
            
            tapePos++;
            updateTapePosition(tapePos);
        }, 30);
        
        // Log the operation
        addLogEntry('[19:47:43] TAPE OPERATION: FAST FORWARD INITIATED');
        
        // Reset speed after 3 seconds
        setTimeout(() => {
            if (fastForwardBtn.classList.contains('active')) {
                updateTapeSpeed(10);
            }
        }, 3000);
    });
    
    // Simulate tape movement during "play" mode
    setInterval(() => {
        if (playBtn.classList.contains('active') && isPlaying) {
            // Slowly advance tape during play
            if (tapePos < 100) {
                tapePos += 0.1;
                updateTapePosition(tapePos);
            } else {
                // Loop back to beginning
                tapePos = 0;
                updateTapePosition(tapePos);
                addLogEntry('[19:48:00] TAPE OPERATION: END OF TAPE, REWINDING');
            }
        }
    }, 1000);
}

// Initialize rotary dial
function initRotaryDial() {
    const dialFace = document.querySelector('.dial-face');
    const dialPointer = document.querySelector('.dial-pointer');
    const dialOptions = document.querySelectorAll('.dial-option');
    const dialCenter = document.querySelector('.dial-center');
    
    let isDragging = false;
    let currentRotation = 120; // Starting position (SYSTEM)
    
    // Set initial active option
    setActiveDialOption(180); // SYSTEM is at 180deg
    
    // Mouse events for desktop
    dialFace.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // Touch events for mobile
    dialFace.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        dialCenter.style.backgroundColor = '#444'; // Visual feedback
        playSound('click-sound');
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        // Get coordinates
        let clientX, clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        // Calculate angle
        const rect = dialFace.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        // Calculate angle in radians, then convert to degrees
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Adjust to have 0° at the top
        angle += 90;
        if (angle < 0) angle += 360;
        
        // Snap to nearest 45 degrees
        const snappedAngle = Math.round(angle / 45) * 45;
        
        // Update rotation
        currentRotation = snappedAngle;
        dialPointer.style.setProperty('--dial-rotation', `${currentRotation}deg`);
        
        // Update active option
        setActiveDialOption(currentRotation);
    }
    
    function stopDrag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        isDragging = false;
        dialCenter.style.backgroundColor = '';
        
        // Add log entry for the selection
        const activeOption = document.querySelector('.dial-option.active');
        if (activeOption) {
            const optionText = activeOption.textContent;
            addLogEntry(`[19:47:50] NAVIGATION DIAL: ${optionText} SELECTED`);
        }
        
        // Simulate haptic feedback
        simulateHapticFeedback();
    }
    
    function setActiveDialOption(angle) {
        // Normalize angle to 0-360
        angle = ((angle % 360) + 360) % 360;
        
        // Remove active class from all options
        dialOptions.forEach(option => option.classList.remove('active'));
        
        // Find and activate the corresponding option
        dialOptions.forEach(option => {
            const optionAngle = parseInt(option.getAttribute('data-position'));
            if (Math.abs(angle - optionAngle) < 45 || 
                Math.abs(angle - (optionAngle + 360)) < 45 ||
                Math.abs(angle - (optionAngle - 360)) < 45) {
                option.classList.add('active');
            }
        });
    }
    
    // Also allow clicking on options directly
    dialOptions.forEach(option => {
        option.addEventListener('click', function() {
            const angle = parseInt(this.getAttribute('data-position'));
            currentRotation = angle;
            dialPointer.style.setProperty('--dial-rotation', `${currentRotation}deg`);
            setActiveDialOption(angle);
            
            playSound('click-sound');
            addLogEntry(`[19:47:55] NAVIGATION DIAL: ${this.textContent} SELECTED`);
        });
    });
}

// Initialize file manager
function initFileManager() {
    const fileRows = document.querySelectorAll('.file-row');
    const fmButtons = document.querySelectorAll('.fm-btn');
    const executeBtn = document.querySelector('.execute-btn');
    const commandInput = document.getElementById('command-input');
    
    // File row selection
    fileRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove selected class from all rows
            fileRows.forEach(r => r.classList.remove('selected'));
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // Update command input with filename
            const fileName = this.querySelector('.col-name').textContent.trim();
            commandInput.value = `RUN "${fileName}"`;
            
            // Log the selection
            addLogEntry(`[19:48:05] FILE SELECTED: ${fileName}`);
            
            playSound('click-sound');
        });
    });
    
    // File manager button actions
    fmButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            const selectedFile = document.querySelector('.file-row.selected');
            
            if (!selectedFile && action !== 'HELP') {
                addLogEntry('[19:48:10] ERROR: NO FILE SELECTED');
                return;
            }
            
            const fileName = selectedFile ? 
                selectedFile.querySelector('.col-name').textContent.trim() : 'N/A';
            
            switch(action) {
                case 'EXECUTE':
                    addLogEntry(`[19:48:12] EXECUTING: ${fileName}`);
                    simulateFileExecution(fileName);
                    break;
                case 'COPY':
                    addLogEntry(`[19:48:15] COPYING: ${fileName}`);
                    simulateFileCopy(fileName);
                    break;
                case 'DELETE':
                    addLogEntry(`[19:48:18] DELETING: ${fileName}`);
                    simulateFileDeletion(selectedFile);
                    break;
                case 'EDIT':
                    addLogEntry(`[19:48:20] EDITING: ${fileName}`);
                    simulateFileEdit(fileName);
                    break;
                case 'PRINT':
                    addLogEntry(`[19:48:22] PRINTING: ${fileName}`);
                    simulatePrintOperation(fileName);
                    break;
            }
            
            playSound('click-sound');
        });
    });
    
    // Execute command button
    executeBtn.addEventListener('click', function() {
        const command = commandInput.value.trim();
        if (command) {
            executeCommand(command);
            commandInput.value = '';
        }
    });
    
    // Enter key in command input
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            if (command) {
                executeCommand(command);
                this.value = '';
            }
        }
    });
    
    // Quick command buttons
    const quickCommands = document.querySelectorAll('.qcmd-btn');
    quickCommands.forEach(btn => {
        btn.addEventListener('click', function() {
            const cmd = this.textContent.trim();
            commandInput.value = cmd;
            playSound('click-sound');
        });
    });
}

// Initialize console and logging
function initConsole() {
    const tickerTape = document.querySelector('.tape-content');
    
    // Function to add log entries (already defined as addLogEntry)
    // Ensure it scrolls to bottom
    window.addLogEntry = function(entry) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = entry;
        
        tickerTape.appendChild(logEntry);
        
        // Scroll to bottom
        tickerTape.parentElement.scrollTop = tickerTape.parentElement.scrollHeight;
        
        // Limit to 50 entries
        if (tickerTape.children.length > 50) {
            tickerTape.removeChild(tickerTape.firstChild);
        }
    };
}

// Initialize system controls
function initSystemControls() {
    // Update system time
    function updateSystemTime() {
        const now = new Date();
        const timeDisplay = document.querySelector('.time-display');
        const dateDisplay = document.querySelector('.date-display');
        
        // Format time as HH:MM:SS
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Format date as DD-MMM-YYYY (1970s style)
        const dateString = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
        
        timeDisplay.textContent = timeString;
        dateDisplay.textContent = dateString;
    }
    
    // Update every second
    setInterval(updateSystemTime, 1000);
    updateSystemTime(); // Initial call
    
    // Random system status updates
    setInterval(() => {
        // Randomly toggle a status light
        const statusLights = document.querySelectorAll('.status-light');
        const randomIndex = Math.floor(Math.random() * statusLights.length);
        const randomLight = statusLights[randomIndex];
        
        // Only toggle if not the power-off state
        if (!document.getElementById('power-btn').classList.contains('power-off')) {
            const wasActive = randomLight.classList.contains('active');
            
            if (Math.random() > 0.7) { // 30% chance to change state
                if (wasActive) {
                    randomLight.classList.remove('active');
                    addLogEntry(`[${getCurrentTime()}] SYSTEM: ${randomLight.dataset.status.toUpperCase()} STATUS DEGRADED`);
                } else {
                    randomLight.classList.add('active');
                    addLogEntry(`[${getCurrentTime()}] SYSTEM: ${randomLight.dataset.status.toUpperCase()} STATUS RESTORED`);
                }
            }
        }
    }, 10000); // Every 10 seconds
}

// Initialize CRT effects
function initCRTEffects() {
    const brightnessKnob = document.querySelector('.brightness-knob');
    const contrastKnob = document.querySelector('.contrast-knob');
    
    // Simulate knob turning
    [brightnessKnob, contrastKnob].forEach((knob, index) => {
        let isDragging = false;
        let rotation = 0;
        
        knob.addEventListener('mousedown', startKnobDrag);
        knob.addEventListener('touchstart', startKnobDrag);
        
        function startKnobDrag(e) {
            e.preventDefault();
            isDragging = true;
            document.addEventListener('mousemove', dragKnob);
            document.addEventListener('touchmove', dragKnob);
            document.addEventListener('mouseup', stopKnobDrag);
            document.addEventListener('touchend', stopKnobDrag);
            
            playSound('click-sound');
        }
        
        function dragKnob(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            // Calculate rotation based on mouse movement
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const rect = knob.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = clientX - centerX;
            
            // Update rotation (-180 to 180 degrees)
            rotation = Math.max(-180, Math.min(180, deltaX));
            knob.style.transform = `rotate(${rotation}deg)`;
            
            // Update CRT effect based on knob
            if (index === 0) { // Brightness
                const brightness = Math.max(0.5, Math.min(1.5, 1 + rotation / 360));
                document.querySelector('.crt-screen').style.filter = `brightness(${brightness})`;
            } else { // Contrast
                const contrast = Math.max(0.5, Math.min(2, 1 + rotation / 360));
                document.querySelector('.crt-screen').style.filter += ` contrast(${contrast})`;
            }
        }
        
        function stopKnobDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', dragKnob);
            document.removeEventListener('touchmove', dragKnob);
            document.removeEventListener('mouseup', stopKnobDrag);
            document.removeEventListener('touchend', stopKnobDrag);
            
            // Spring back to center
            knob.style.transition = 'transform 0.5s ease';
            knob.style.transform = 'rotate(0deg)';
            
            setTimeout(() => {
                knob.style.transition = '';
            }, 500);
            
            // Log adjustment
            const knobType = index === 0 ? 'BRIGHTNESS' : 'CONTRAST';
            addLogEntry(`[${getCurrentTime()}] CRT ${knobType} ADJUSTED`);
        }
    });
}

// Initialize audio system
function initAudio() {
    // Audio elements are already in HTML
    // Function to play sounds
    window.playSound = function(soundId) {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                // Audio play failed (might be due to browser autoplay policy)
                console.log(`Audio play failed: ${e.message}`);
            });
        }
    };
}

// Start system updates
function startSystemUpdates() {
    // Update CPU gauge randomly
    setInterval(() => {
        const cpuNeedle = document.querySelector('.gauge-needle[style*="cpu"]');
        if (cpuNeedle) {
            const currentRotation = parseFloat(cpuNeedle.style.getPropertyValue('--needle-rotation')) || 68;
            const newRotation = Math.max(0, Math.min(180, currentRotation + (Math.random() * 20 - 10)));
            cpuNeedle.style.setProperty('--needle-rotation', `${newRotation}deg`);
            
            // Update value display
            const cpuValue = Math.round((newRotation / 180) * 100);
            cpuNeedle.closest('.gauge-dial').querySelector('.gauge-value').textContent = `${cpuValue}%`;
        }
    }, 3000);
    
    // Update memory gauge
    setInterval(() => {
        const memNeedle = document.querySelector('.gauge-needle[style*="mem"]');
        if (memNeedle) {
            const currentRotation = parseFloat(memNeedle.style.getPropertyValue('--needle-rotation')) || 42;
            const newRotation = Math.max(0, Math.min(180, currentRotation + (Math.random() * 6 - 3)));
            memNeedle.style.setProperty('--needle-rotation', `${newRotation}deg`);
            
            // Update value display
            const memValue = Math.round((newRotation / 180) * 100);
            memNeedle.closest('.gauge-dial').querySelector('.gauge-value').textContent = `${memValue}%`;
        }
    }, 5000);
    
    // Update storage gauge (slowly increases)
    let storageValue = 85;
    setInterval(() => {
        const storageNeedle = document.querySelector('.gauge-needle[style*="storage"]');
        if (storageNeedle && Math.random() > 0.8) { // 20% chance
            storageValue = Math.min(95, storageValue + 0.5);
            const newRotation = (storageValue / 100) * 180;
            storageNeedle.style.setProperty('--needle-rotation', `${newRotation}deg`);
            
            // Update value display
            storageNeedle.closest('.gauge-dial').querySelector('.gauge-value').textContent = `${Math.round(storageValue)}%`;
        }
    }, 10000);
}

// Utility functions
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function simulateHapticFeedback() {
    // In a real implementation, this would use the Vibration API
    // For now, we'll just add a visual effect
    document.body.style.transform = 'scale(0.999)';
    setTimeout(() => {
        document.body.style.transform = '';
    }, 50);
}

function stopAllAnimations() {
    // Stop CSS animations
    const animatedElements = document.querySelectorAll('*');
    animatedElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.animationName !== 'none') {
            el.style.animationPlayState = 'paused';
        }
    });
}

function restartAllAnimations() {
    // Restart CSS animations
    const animatedElements = document.querySelectorAll('*');
    animatedElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.animationName !== 'none') {
            el.style.animationPlayState = 'running';
        }
    });
}

// Command execution simulation
function executeCommand(command) {
    addLogEntry(`[${getCurrentTime()}] COMMAND: ${command}`);
    
    // Simulate command processing
    setTimeout(() => {
        const responses = [
            `COMMAND "${command}" EXECUTED SUCCESSFULLY`,
            `SYNTAX ERROR IN COMMAND`,
            `FILE NOT FOUND`,
            `ACCESS DENIED`,
            `SYSTEM BUSY, TRY AGAIN LATER`,
            `COMMAND COMPLETED WITH WARNINGS`,
            `INSUFFICIENT MEMORY`,
            `DEVICE NOT READY`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addLogEntry(`[${getCurrentTime()}] SYSTEM: ${randomResponse}`);
    }, 500 + Math.random() * 1000);
}

// File operation simulations
function simulateFileExecution(filename) {
    // Visual feedback
    const selectedFile = document.querySelector('.file-row.selected');
    if (selectedFile) {
        selectedFile.style.backgroundColor = 'rgba(255, 180, 70, 0.3)';
        setTimeout(() => {
            selectedFile.style.backgroundColor = '';
        }, 1000);
    }
    
    // Simulate execution delay
    setTimeout(() => {
        addLogEntry(`[${getCurrentTime()}] EXECUTION COMPLETE: ${filename}`);
    }, 1500);
}

function simulateFileCopy(filename) {
    // Add a new file to the table
    const tableBody = document.querySelector('.table-body');
    const newRow = document.createElement('div');
    newRow.className = 'file-row';
    newRow.innerHTML = `
        <div class="col-name"><i class="fas fa-copy"></i> ${filename.replace('.', '_COPY.')}</div>
        <div class="col-size">1.44 MB</div>
        <div class="col-modified">${getCurrentTime().split('[')[1]?.split(']')[0] || '12-MAY-77'}</div>
        <div class="col-type">COPY</div>
    `;
    
    // Add click event to new row
    newRow.addEventListener('click', function() {
        document.querySelectorAll('.file-row').forEach(r => r.classList.remove('selected'));
        this.classList.add('selected');
    });
    
    tableBody.appendChild(newRow);
    
    // Log completion
    setTimeout(() => {
        addLogEntry(`[${getCurrentTime()}] COPY COMPLETE: ${filename}`);
    }, 1000);
}

function simulateFileDeletion(fileRow) {
    // Visual effect
    fileRow.style.opacity = '0.5';
    fileRow.style.transform = 'translateX(-20px)';
    
    // Remove after animation
    setTimeout(() => {
        if (fileRow.parentNode) {
            fileRow.parentNode.removeChild(fileRow);
            addLogEntry(`[${getCurrentTime()}] DELETION COMPLETE`);
        }
    }, 500);
}

function simulateFileEdit(filename) {
    // Change the modified time
    const selectedFile = document.querySelector('.file-row.selected');
    if (selectedFile) {
        const modifiedCell = selectedFile.querySelector('.col-modified');
        modifiedCell.textContent = `${getCurrentTime().split('[')[1]?.split(']')[0] || '12-MAY-77'} ${Math.floor(Math.random()*24).toString().padStart(2, '0')}:${Math.floor(Math.random()*60).toString().padStart(2, '0')}`;
        
        // Visual feedback
        selectedFile.style.backgroundColor = 'rgba(255, 180, 70, 0.2)';
        setTimeout(() => {
            selectedFile.style.backgroundColor = '';
        }, 1000);
        
        addLogEntry(`[${getCurrentTime()}] EDIT COMPLETE: ${filename}`);
    }
}

function simulatePrintOperation(filename) {
    // Simulate printing animation
    const printHead = document.querySelector('.print-dots');
    const originalAnimation = printHead.style.animation;
    
    // Speed up printing animation
    printHead.style.animation = 'print-dots-move 0.1s linear infinite';
    
    // Add print log entry
    addLogEntry(`[${getCurrentTime()}] PRINTING: ${filename}...`);
    
    // Simulate print completion
    setTimeout(() => {
        printHead.style.animation = originalAnimation;
        addLogEntry(`[${getCurrentTime()}] PRINT COMPLETE: ${filename}`);
        
        // Add to ticker tape
        addLogEntry(`=== PRINT OUTPUT: ${filename} ===`);
        addLogEntry(`This is a simulated printout of ${filename}`);
        addLogEntry(`Generated by NEXUS-70 OS on ${new Date().toLocaleDateString()}`);
        addLogEntry(`================================`);
    }, 3000);
}

// Add some initial dynamic behavior
setTimeout(() => {
    // Random system events
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance
            const events = [
                'MEMORY ALLOCATION COMPLETED',
                'DISK DEFRAGMENTATION IN PROGRESS',
                'NETWORK PACKET RECEIVED',
                'BACKGROUND PROCESS COMPLETED',
                'SYSTEM CHECKPOINT CREATED',
                'CACHE FLUSHED',
                'USER SESSION RENEWED'
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            addLogEntry(`[${getCurrentTime()}] SYSTEM: ${randomEvent}`);
        }
    }, 8000);
}, 5000);
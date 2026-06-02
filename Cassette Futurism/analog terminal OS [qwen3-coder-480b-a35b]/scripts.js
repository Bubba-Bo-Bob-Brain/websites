// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const terminalOutput = document.getElementById('terminal-output');
const tickerContent = document.getElementById('ticker-content');
const rotaryDial = document.getElementById('rotary-dial');
const dialNumbers = document.querySelectorAll('.number');
const amberToggle = document.getElementById('amber-toggle');
const greenToggle = document.getElementById('green-toggle');
const shutdownBtn = document.getElementById('shutdown-btn');
const restartBtn = document.getElementById('restart-btn');
const tapeButtons = document.querySelectorAll('.tape-btn');
const clickSound = document.getElementById('click-sound');

// System Monitor Elements
const cpuValue = document.getElementById('cpu-value');
const memoryValue = document.getElementById('memory-value');
const diskValue = document.getElementById('disk-value');
const networkValue = document.getElementById('network-value');
const cpuBar = document.getElementById('cpu-bar');
const memoryBar = document.getElementById('memory-bar');
const diskBar = document.getElementById('disk-bar');

// Display Mode State
let currentMode = 'amber'; // 'amber' or 'green'

// Update System Time
function updateSystemTime() {
    const now = new Date();
    const timeString = now.toTimeString().substr(0, 8);
    currentTimeElement.textContent = timeString;
}

// Initialize System Time and Update Every Second
updateSystemTime();
setInterval(updateSystemTime, 1000);

// Terminal Functionality
function addToTerminal(command, output) {
    const promptLine = document.createElement('div');
    promptLine.className = 'prompt-line';
    promptLine.innerHTML = `<span class="prompt">NEXUS-75:> </span><span class="command">${command}</span>`;
    
    const outputLine = document.createElement('div');
    outputLine.className = 'output-line';
    outputLine.textContent = output;
    
    const cursorLine = document.createElement('div');
    cursorLine.className = 'prompt-line';
    cursorLine.innerHTML = '<span class="prompt">NEXUS-75:> </span><span class="cursor">█</span>';
    
    // Remove existing cursor
    const existingCursor = terminalOutput.querySelector('.cursor');
    if (existingCursor) {
        existingCursor.parentElement.remove();
    }
    
    terminalOutput.appendChild(promptLine);
    terminalOutput.appendChild(outputLine);
    terminalOutput.appendChild(cursorLine);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Ticker Tape Animation
function updateTickerTape() {
    const messages = [
        "SYSTEM BOOT COMPLETE",
        "MEMORY TEST PASSED",
        "LOADING FILE MANAGER",
        "INITIALIZING TERMINAL",
        "SYSTEM READY FOR INPUT",
        "NETWORK OFFLINE",
        "TAPE DRIVE CONNECTED",
        "MONITORING RESOURCES",
        "SECURITY PROTOCOLS ACTIVE"
    ];
    
    let content = "";
    for (let i = 0; i < 10; i++) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        content += `${randomMessage} • `;
    }
    
    tickerContent.textContent = content;
}

// Initialize Ticker Tape
updateTickerTape();
setInterval(updateTickerTape, 15000);

// Rotary Dial Interaction
let isDragging = false;
let startX, startY, startAngle;
let currentRotation = 0;

function getAngleFromCenter(clientX, clientY) {
    const rect = rotaryDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Calculate angle in radians and convert to degrees
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize to 0-360 range
    if (angle < 0) angle += 360;
    
    return angle;
}

function handleDialStart(e) {
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    startX = clientX;
    startY = clientY;
    startAngle = getAngleFromCenter(clientX, clientY);
    
    rotaryDial.style.cursor = 'grabbing';
    playClickSound();
}

function handleDialMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const currentAngle = getAngleFromCenter(clientX, clientY);
    let angleDiff = currentAngle - startAngle;
    
    // Handle wrap-around
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    currentRotation += angleDiff;
    startAngle = currentAngle;
    
    // Limit rotation to prevent over-rotation
    currentRotation = Math.max(-360, Math.min(360, currentRotation));
    
    rotaryDial.style.transform = `rotate(${currentRotation}deg)`;
}

function handleDialEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    rotaryDial.style.cursor = 'grab';
    
    // Determine which number was selected based on rotation
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const segmentSize = 360 / 10; // 10 segments for numbers 0-9
    const selectedIndex = Math.floor((normalizedRotation + segmentSize / 2) / segmentSize) % 10;
    const selectedNumber = selectedIndex === 0 ? 0 : 10 - selectedIndex;
    
    // Animate back to center
    const targetRotation = Math.round(currentRotation / 360) * 360;
    const rotationDiff = targetRotation - currentRotation;
    
    let progress = 0;
    const duration = 500;
    const startTime = performance.now();
    
    function animateReturn(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentRot = currentRotation + rotationDiff * easedProgress;
        rotaryDial.style.transform = `rotate(${currentRot}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animateReturn);
        } else {
            currentRotation = targetRotation;
            // Add to terminal when dial completes
            addToTerminal(`DIAL ${selectedNumber}`, `NUMBER ${selectedNumber} SELECTED`);
        }
    }
    
    requestAnimationFrame(animateReturn);
}

// Event Listeners for Rotary Dial
rotaryDial.addEventListener('mousedown', handleDialStart);
rotaryDial.addEventListener('touchstart', handleDialStart, { passive: false });

document.addEventListener('mousemove', handleDialMove);
document.addEventListener('touchmove', handleDialMove, { passive: false });

document.addEventListener('mouseup', handleDialEnd);
document.addEventListener('touchend', handleDialEnd);

// Position dial numbers in a circle
function positionDialNumbers() {
    const radius = 35;
    const centerX = 50;
    const centerY = 50;
    
    dialNumbers.forEach((num, index) => {
        const angle = (index * 36 - 90) * (Math.PI / 180); // Convert to radians
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        num.style.left = `${x}px`;
        num.style.top = `${y}px`;
    });
}

positionDialNumbers();

// Display Mode Toggle
function setDisplayMode(mode) {
    document.body.classList.remove('amber-mode', 'green-mode');
    
    if (mode === 'amber') {
        document.body.classList.add('amber-mode');
        currentMode = 'amber';
        amberToggle.classList.add('active');
        greenToggle.classList.remove('active');
    } else if (mode === 'green') {
        document.body.classList.add('green-mode');
        currentMode = 'green';
        greenToggle.classList.add('active');
        amberToggle.classList.remove('active');
    }
    
    playClickSound();
}

amberToggle.addEventListener('click', () => setDisplayMode('amber'));
greenToggle.addEventListener('click', () => setDisplayMode('green'));

// System Controls
shutdownBtn.addEventListener('click', () => {
    playClickSound();
    addToTerminal("SHUTDOWN", "SYSTEM SHUTTING DOWN...");
    
    // Simulate shutdown sequence
    setTimeout(() => {
        document.body.style.filter = "brightness(0)";
        setTimeout(() => {
            document.body.innerHTML = "<div class='shutdown-message'>SYSTEM OFFLINE</div>";
            document.body.style.background = "#000";
            document.body.style.display = "flex";
            document.body.style.justifyContent = "center";
            document.body.style.alignItems = "center";
            document.body.style.height = "100vh";
            document.body.style.color = currentMode === 'amber' ? "#ffcc00" : "#00ff00";
            document.body.style.fontFamily = "'Share Tech Mono', monospace";
            document.body.style.fontSize = "24px";
        }, 1000);
    }, 2000);
});

restartBtn.addEventListener('click', () => {
    playClickSound();
    addToTerminal("RESTART", "SYSTEM REBOOTING...");
    
    // Simulate restart sequence
    document.body.style.filter = "brightness(0)";
    setTimeout(() => {
        location.reload();
    }, 2000);
});

// Tape Drive Controls
tapeButtons.forEach(button => {
    button.addEventListener('click', () => {
        playClickSound();
        const action = button.textContent.trim().split(' ')[1];
        
        switch(action) {
            case 'REWIND':
                addToTerminal("TAPE REWIND", "REWINDING TAPE...");
                simulateTapeOperation("REWIND COMPLETE");
                break;
            case 'PLAY':
                addToTerminal("TAPE PLAY", "PLAYING TAPE...");
                simulateTapeOperation("PLAYBACK COMPLETE");
                break;
            case 'STOP':
                addToTerminal("TAPE STOP", "STOPPING TAPE...");
                simulateTapeOperation("TAPE STOPPED");
                break;
            case 'FFWD':
                addToTerminal("TAPE FAST FORWARD", "FAST FORWARDING TAPE...");
                simulateTapeOperation("FFWD COMPLETE");
                break;
        }
    });
});

function simulateTapeOperation(message) {
    // Add a delay to simulate operation
    setTimeout(() => {
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        outputLine.textContent = message;
        terminalOutput.insertBefore(outputLine, terminalOutput.lastChild);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 1500);
}

// System Monitor Updates
function updateSystemMonitor() {
    // Simulate changing values
    const cpuUsage = Math.floor(Math.random() * 30) + 30; // 30-60%
    const memoryUsed = Math.floor(Math.random() * 20) + 20; // 20-40KB
    const diskSpeed = (Math.random() * 2 + 0.5).toFixed(1); // 0.5-2.5 MB/s
    
    cpuValue.textContent = `${cpuUsage}%`;
    memoryValue.textContent = `${memoryUsed}KB/64KB`;
    diskValue.textContent = `${diskSpeed}MB/s`;
    
    // Update bars
    cpuBar.style.width = `${cpuUsage}%`;
    memoryBar.style.width = `${(memoryUsed / 64) * 100}%`;
    diskBar.style.width = `${Math.min(diskSpeed * 20, 100)}%`; // Scale for visualization
}

// Initialize and update system monitor every 2 seconds
updateSystemMonitor();
setInterval(updateSystemMonitor, 2000);

// Play Click Sound
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Audio play failed:", e));
}

// File Item Interaction
const fileItems = document.querySelectorAll('.file-item');
fileItems.forEach(item => {
    item.addEventListener('click', () => {
        playClickSound();
        const fileName = item.querySelector('.name').textContent;
        addToTerminal(`OPEN ${fileName}`, `OPENING FILE: ${fileName}`);
    });
});

// Window Controls
const closeButtons = document.querySelectorAll('.window-btn.close');
const minimizeButtons = document.querySelectorAll('.window-btn.minimize');
const maximizeButtons = document.querySelectorAll('.window-btn.maximize');

closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        playClickSound();
        const window = e.target.closest('.file-manager, .terminal-window, .system-monitor');
        if (window) {
            window.style.display = 'none';
        }
    });
});

minimizeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        playClickSound();
        const window = e.target.closest('.file-manager, .terminal-window, .system-monitor');
        if (window) {
            window.style.height = '40px';
            window.querySelector('.window-content').style.display = 'none';
        }
    });
});

maximizeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        playClickSound();
        const window = e.target.closest('.file-manager, .terminal-window, .system-monitor');
        if (window) {
            if (window.style.position === 'fixed') {
                // Restore window
                window.style.position = '';
                window.style.top = '';
                window.style.left = '';
                window.style.width = '';
                window.style.height = '';
                window.style.zIndex = '';
                window.querySelector('.window-content').style.display = '';
            } else {
                // Maximize window
                window.style.position = 'fixed';
                window.style.top = '15px';
                window.style.left = '15px';
                window.style.width = 'calc(100% - 30px)';
                window.style.height = 'calc(100% - 150px)';
                window.style.zIndex = '1000';
                window.querySelector('.window-content').style.display = '';
            }
        }
    });
});

// Initialize with amber mode
setDisplayMode('amber');

// Analog Clock Update
function updateAnalogClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    
    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    
    document.querySelector('.second-hand').style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    document.querySelector('.minute-hand').style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    document.querySelector('.hour-hand').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
}

// Initialize and update analog clock every second
updateAnalogClock();
setInterval(updateAnalogClock, 1000);

// Prevent context menu on right-click
document.addEventListener('contextmenu', e => e.preventDefault());
/* ============================================================
   DATACORE-7 OPERATING SYSTEM
   Interactive Mainframe Interface Controller
   ============================================================ */

// ===== SYSTEM STATE =====
const SystemState = {
    powerOn: true,
    bootComplete: false,
    currentDrive: 'A',
    phosphorMode: 'amber',
    scanlinesEnabled: true,
    soundEnabled: true,
    flickerEnabled: true,
    uptime: 0,
    selectedFile: 'MEMO.MEM',
    currentPath: '/USER/DOCUMENTS',
    capsLock: false,
    numLock: true,
    scrollLock: false,
    cpuUsage: 12,
    memUsage: 48,
    consolePaused: false,
    scrollLockConsole: false
};

// ===== DOM ELEMENTS =====
const DOM = {
    // CRT Elements
    crtScreen: document.getElementById('crtScreen'),
    crtOffOverlay: document.getElementById('crtOffOverlay'),
    bootOverlay: document.getElementById('bootOverlay'),
    
    // System Display
    timeDisplay: document.getElementById('timeDisplay'),
    dateDisplay: document.getElementById('dateDisplay'),
    uptimeDisplay: document.getElementById('uptimeDisplay'),
    activityIndicator: document.getElementById('activityIndicator'),
    
    // Controls
    driveDial: document.getElementById('driveDial'),
    dialPointer: document.getElementById('dialPointer'),
    currentDrive: document.getElementById('currentDrive'),
    phosphorToggle: document.getElementById('phosphorToggle'),
    scanlineToggle: document.getElementById('scanlineToggle'),
    soundToggle: document.getElementById('soundToggle'),
    flickerToggle: document.getElementById('flickerToggle'),
    
    // VU Meter
    diskUsageL: document.getElementById('diskUsageL'),
    diskUsageR: document.getElementById('diskUsageR'),
    diskPeakL: document.getElementById('diskPeakL'),
    diskPeakR: document.getElementById('diskPeakR'),
    
    // Tape Unit
    supplyReel1: document.getElementById('supplyReel1'),
    takeupReel1: document.getElementById('takeupReel1'),
    tapeLabel1: document.getElementById('tapeLabel1'),
    tapeStatus1: document.getElementById('tapeStatus1'),
    
    // Oscilloscope
    oscCanvas: document.getElementById('oscCanvas'),
    oscReading: document.getElementById('oscReading'),
    
    // File Manager
    directoryTree: document.getElementById('directoryTree'),
    fileList: document.getElementById('fileList'),
    filePreview: document.getElementById('filePreview'),
    currentPath: document.getElementById('currentPath'),
    
    // Console
    consoleOutput: document.getElementById('consoleOutput'),
    consoleInput: document.getElementById('consoleInput'),
    clearConsoleBtn: document.getElementById('clearConsoleBtn'),
    scrollLockBtn: document.getElementById('scrollLockBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    
    // Status Bar
    statusMessage: document.getElementById('statusMessage'),
    cpuFill: document.getElementById('cpuFill'),
    cpuValue: document.getElementById('cpuValue'),
    memFill: document.getElementById('memFill'),
    memValue: document.getElementById('memValue'),
    fileCount: document.getElementById('fileCount'),
    freeSpace: document.getElementById('freeSpace'),
    
    // Keyboard LEDs
    capsLed: document.getElementById('capsLed'),
    numLed: document.getElementById('numLed'),
    scrollLed: document.getElementById('scrollLed'),
    
    // Physical Controls
    powerButton: document.getElementById('powerButton'),
    powerLed: document.getElementById('powerLed'),
    brightnessKnob: document.getElementById('brightnessKnob'),
    contrastKnob: document.getElementById('contrastKnob'),
    
    // Status Lights
    hddLight: document.getElementById('hddLight'),
    tapeLight: document.getElementById('tapeLight'),
    errorLight: document.getElementById('errorLight'),
    
    // Boot Progress
    bootProgressBar: document.getElementById('bootProgressBar'),
    
    // Menu items
    menuItems: document.querySelectorAll('.menu-item'),
    
    // File items
    fileItems: document.querySelectorAll('.file-item'),
    
    // Tree items
    treeItems: document.querySelectorAll('.tree-item')
};

// ===== AUDIO CONTEXT =====
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(frequency, duration, type = 'sine', volume = 0.1) {
    if (!SystemState.soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playClickSound() {
    playTone(800, 0.05, 'square', 0.05);
}

function playBeepSound() {
    playTone(440, 0.1, 'sine', 0.08);
}

function playBootSound() {
    playTone(220, 0.3, 'sine', 0.1);
    setTimeout(() => playTone(330, 0.3, 'sine', 0.1), 200);
    setTimeout(() => playTone(440, 0.4, 'sine', 0.1), 400);
}

function playTapeSound() {
    if (!SystemState.soundEnabled || !audioContext) return;
    
    const noise = audioContext.createBufferSource();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.02;
    }
    
    noise.buffer = buffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    
    noise.connect(filter);
    filter.connect(audioContext.destination);
    noise.start();
}

// ===== CLOCK & UPTIME =====
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    DOM.timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Format date as YYYY.MM.DD (1970s style)
    const year = 1978; // Fixed year for immersion
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    DOM.dateDisplay.textContent = `${year}.${month}.${day}`;
}

function updateUptime() {
    if (!SystemState.powerOn || !SystemState.bootComplete) return;
    
    SystemState.uptime++;
    
    const hours = String(Math.floor(SystemState.uptime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((SystemState.uptime % 3600) / 60)).padStart(2, '0');
    const seconds = String(SystemState.uptime % 60).padStart(2, '0');
    
    DOM.uptimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// ===== ROTARY DIAL =====
let dialAngle = 0;
const drivePositions = { 'A': 0, 'B': 90, 'C': 180, 'D': 270 };
const drives = ['A', 'B', 'C', 'D'];

function updateDial(drive) {
    const targetAngle = drivePositions[drive];
    dialAngle = targetAngle;
    DOM.dialPointer.style.transform = `translateX(-50%) rotate(${dialAngle}deg)`;
    DOM.currentDrive.textContent = `DRIVE ${drive}:`;
    SystemState.currentDrive = drive;
    
    // Update dial face rotation
    DOM.driveDial.querySelector('.dial-face').style.transform = `rotate(${dialAngle}deg)`;
    
    // Log to console
    addConsoleLine(`DRIVE SELECT: Unit ${drive} selected`, 'system');
    
    // Trigger HDD activity
    triggerHDDActivity();
    playClickSound();
}

function initDial() {
    const dialFace = DOM.driveDial.querySelector('.dial-face');
    
    dialFace.addEventListener('click', () => {
        const currentIndex = drives.indexOf(SystemState.currentDrive);
        const nextIndex = (currentIndex + 1) % drives.length;
        updateDial(drives[nextIndex]);
    });
    
    // Initialize at position A
    updateDial('A');
}

// ===== TOGGLE SWITCHES =====
function initToggleSwitches() {
    // Phosphor Toggle
    DOM.phosphorToggle.addEventListener('click', () => {
        const current = DOM.phosphorToggle.dataset.active;
        const newMode = current === 'amber' ? 'green' : 'amber';
        DOM.phosphorToggle.dataset.active = newMode;
        
        if (newMode === 'green') {
            document.body.classList.add('green-phosphor');
        } else {
            document.body.classList.remove('green-phosphor');
        }
        
        SystemState.phosphorMode = newMode;
        addConsoleLine(`PHOSPHOR MODE: ${newMode.toUpperCase()}`, 'system');
        playClickSound();
    });
    
    // Scanline Toggle
    DOM.scanlineToggle.addEventListener('click', () => {
        const current = DOM.scanlineToggle.dataset.active;
        const newState = current === 'on' ? 'off' : 'on';
        DOM.scanlineToggle.dataset.active = newState;
        
        if (newState === 'off') {
            document.body.classList.add('no-scanlines');
        } else {
            document.body.classList.remove('no-scanlines');
        }
        
        SystemState.scanlinesEnabled = newState === 'on';
        addConsoleLine(`SCANLINES: ${newState.toUpperCase()}`, 'system');
        playClickSound();
    });
    
    // Sound Toggle
    DOM.soundToggle.addEventListener('click', () => {
        const current = DOM.soundToggle.dataset.active;
        const newState = current === 'on' ? 'off' : 'on';
        DOM.soundToggle.dataset.active = newState;
        SystemState.soundEnabled = newState === 'on';
        
        addConsoleLine(`AUDIO: ${newState.toUpperCase()}`, 'system');
        if (newState === 'on') playClickSound();
    });
    
    // Flicker Toggle
    DOM.flickerToggle.addEventListener('click', () => {
        const current = DOM.flickerToggle.dataset.active;
        const newState = current === 'on' ? 'off' : 'on';
        DOM.flickerToggle.dataset.active = newState;
        
        if (newState === 'off') {
            document.body.classList.add('no-flicker');
        } else {
            document.body.classList.remove('no-flicker');
        }
        
        SystemState.flickerEnabled = newState === 'on';
        addConsoleLine(`CRT FLICKER: ${newState.toUpperCase()}`, 'system');
        playClickSound();
    });
}

// ===== VU METER ANIMATION =====
function animateVUMeter() {
    if (!SystemState.powerOn) return;
    
    // Simulate disk usage fluctuation
    const baseUsage = 67;
    const variation = Math.sin(Date.now() / 1000) * 5 + Math.random() * 3;
    const usage = baseUsage + variation;
    
    // Convert to VU scale (0-100% to height percentage)
    const height = Math.min(95, Math.max(10, usage));
    
    DOM.diskUsageL.style.height = `${height}%`;
    DOM.diskUsageR.style.height = `${height - 2 + Math.random() * 4}%`;
    
    // Peak indicators
    const peakL = Math.min(95, height + Math.random() * 10);
    const peakR = Math.min(95, height - 2 + Math.random() * 10);
    
    DOM.diskPeakL.style.bottom = `${peakL}%`;
    DOM.diskPeakR.style.bottom = `${peakR}%`;
    
    // Slowly decay peaks
    setTimeout(() => {
        DOM.diskPeakL.style.bottom = `${Math.max(height - 5, 10)}%`;
        DOM.diskPeakR.style.bottom = `${Math.max(height - 7, 10)}%`;
    }, 500);
}

// ===== OSCILLOSCOPE =====
let oscAnimationId = null;
let oscPhase = 0;

function initOscilloscope() {
    const canvas = DOM.oscCanvas;
    const ctx = canvas.getContext('2d');
    
    function drawWaveform() {
        if (!SystemState.powerOn) return;
        
        ctx.fillStyle = 'rgba(0, 17, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Get phosphor color
        const isGreen = document.body.classList.contains('green-phosphor');
        ctx.strokeStyle = isGreen ? '#33ff33' : '#ffb000';
        ctx.lineWidth = 2;
        ctx.shadowColor = isGreen ? '#33ff33' : '#ffb000';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        
        const amplitude = 25;
        const frequency = 0.05;
        const speed = 0.1;
        
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + 
                Math.sin((x * frequency) + oscPhase) * amplitude * 
                Math.sin((x * 0.02) + oscPhase * 0.5) +
                Math.sin((x * frequency * 2) + oscPhase * 1.5) * (amplitude * 0.3);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        oscPhase += speed;
        oscAnimationId = requestAnimationFrame(drawWaveform);
    }
    
    drawWaveform();
    
    // Update frequency reading
    setInterval(() => {
        if (SystemState.powerOn) {
            const freq = (1.2 + Math.sin(Date.now() / 2000) * 0.3).toFixed(1);
            DOM.oscReading.textContent = `${freq} kHz`;
        }
    }, 500);
}

// ===== REEL-TO-REEL TAPE =====
let tapeSpinning = false;

function spinTape(spin) {
    const supplyReel = DOM.supplyReel1.querySelector('.reel-flange');
    const takeupReel = DOM.takeupReel1.querySelector('.reel-flange');
    
    if (spin) {
        supplyReel.style.animation = 'reelSpin 2s linear infinite';
        takeupReel.style.animation = 'reelSpin 1.5s linear infinite reverse';
        DOM.tapeStatus1.textContent = 'ACTIVE';
        DOM.tapeStatus1.style.color = 'var(--phosphor-primary)';
        tapeSpinning = true;
        
        // Activate tape light
        DOM.tapeLight.querySelector('.light-bulb').classList.add('active-amber');
    } else {
        supplyReel.style.animation = 'none';
        takeupReel.style.animation = 'none';
        DOM.tapeStatus1.textContent = 'STANDBY';
        DOM.tapeStatus1.style.color = 'var(--phosphor-dim)';
        tapeSpinning = false;
        
        DOM.tapeLight.querySelector('.light-bulb').classList.remove('active-amber');
    }
}

function triggerTapeActivity(duration = 2000) {
    if (tapeSpinning) return;
    
    spinTape(true);
    playTapeSound();
    
    setTimeout(() => {
        spinTape(false);
    }, duration);
}

// ===== FILE MANAGER =====
function initFileManager() {
    // File item selection
    DOM.fileItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove selection from all
            DOM.fileItems.forEach(f => f.classList.remove('selected'));
            
            // Select clicked item
            item.classList.add('selected');
            
            // Update preview panel
            const fileName = item.dataset.name;
            const fileType = item.dataset.type;
            SystemState.selectedFile = fileName;
            
            updateFilePreview(fileName, fileType);
            
            playClickSound();
            triggerHDDActivity();
        });
        
        // Double click to open
        item.addEventListener('dblclick', () => {
            const fileType = item.dataset.type;
            const fileName = item.dataset.name;
            
            if (fileType === 'folder') {
                navigateToFolder(fileName);
            } else {
                openFile(fileName);
            }
        });
    });
    
    // Tree item selection
    DOM.treeItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Remove selection from all
            DOM.treeItems.forEach(t => t.classList.remove('selected'));
            
            // Select clicked item
            item.classList.add('selected');
            
            // Toggle expand/collapse
            const expandIcon = item.querySelector('.tree-expand');
            const children = item.nextElementSibling;
            
            if (children && children.classList.contains('tree-children')) {
                if (expandIcon.textContent === '▼') {
                    expandIcon.textContent = '▸';
                    children.style.display = 'none';
                } else {
                    expandIcon.textContent = '▼';
                    children.style.display = 'block';
                }
            }
            
            playClickSound();
        });
    });
}

function updateFilePreview(fileName, fileType) {
    const previewIcon = DOM.filePreview.querySelector('.preview-icon');
    const previewTitle = DOM.filePreview.querySelector('.preview-title');
    const propRows = DOM.filePreview.querySelectorAll('.prop-value');
    
    previewTitle.textContent = fileName;
    
    // Generate random file properties for immersion
    const sizes = ['1.2 KB', '2.4 KB', '3.7 KB', '8.1 KB', '16.8 KB', '48.0 KB'];
    const clusters = ['#0127', '#0247', '#0389', '#0512', '#0678', '#0891'];
    
    propRows[0].textContent = fileType === 'folder' ? 'DIRECTORY' : 'MEMORY FILE';
    propRows[1].textContent = fileType === 'folder' ? '14 ITEMS' : sizes[Math.floor(Math.random() * sizes.length)];
    propRows[2].textContent = '1978.03.12 09:14';
    propRows[3].textContent = '1978.03.14 15:42';
    propRows[4].textContent = 'R/W ARCHIVE';
    propRows[5].textContent = clusters[Math.floor(Math.random() * clusters.length)];
}

function navigateToFolder(folderName) {
    SystemState.currentPath = `/USER/${folderName}`;
    DOM.currentPath.textContent = `A:${SystemState.currentPath}`;
    
    addConsoleLine(`DIR: Changed to ${folderName}`, 'system');
    triggerHDDActivity();
    playBeepSound();
}

function openFile(fileName) {
    addConsoleLine(`OPEN: Opening file ${fileName}...`, 'system');
    triggerTapeActivity(1500);
    triggerHDDActivity();
    
    // Simulate file loading
    setTimeout(() => {
        addConsoleLine(`FILE: ${fileName} loaded successfully`, 'success');
        updateStatusMessage(`FILE OPENED: ${fileName}`);
    }, 1500);
}

// ===== CONSOLE =====
function initConsole() {
    // Command input
    DOM.consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = DOM.consoleInput.value.trim();
            if (command) {
                processCommand(command);
                DOM.consoleInput.value = '';
            }
        }
    });
    
    // Clear console
    DOM.clearConsoleBtn.addEventListener('click', () => {
        DOM.consoleOutput.innerHTML = '';
        addConsoleLine('Console cleared.', 'system');
        playClickSound();
    });
    
    // Scroll lock
    DOM.scrollLockBtn.addEventListener('click', () => {
        SystemState.scrollLockConsole = !SystemState.scrollLockConsole;
        DOM.scrollLockBtn.classList.toggle('active', SystemState.scrollLockConsole);
        addConsoleLine(`SCROLL LOCK: ${SystemState.scrollLockConsole ? 'ON' : 'OFF'}`, 'system');
        playClickSound();
    });
    
    // Pause
    DOM.pauseBtn.addEventListener('click', () => {
        SystemState.consolePaused = !SystemState.consolePaused;
        DOM.pauseBtn.classList.toggle('active', SystemState.consolePaused);
        addConsoleLine(`OUTPUT ${SystemState.consolePaused ? 'PAUSED' : 'RESUMED'}`, 'system');
        playClickSound();
    });
}

function addConsoleLine(text, type = 'normal') {
    if (SystemState.consolePaused && type !== 'system') return;
    
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = text;
    
    DOM.consoleOutput.appendChild(line);
    
    // Auto-scroll if not locked
    if (!SystemState.scrollLockConsole) {
        DOM.consoleOutput.scrollTop = DOM.consoleOutput.scrollHeight;
    }
    
    // Limit console history
    const lines = DOM.consoleOutput.querySelectorAll('.console-line');
    if (lines.length > 100) {
        lines[0].remove();
    }
}

function processCommand(command) {
    const cmd = command.toUpperCase();
    const parts = cmd.split(' ');
    
    addConsoleLine(`A:\\> ${command}`, 'command');
    
    switch (parts[0]) {
        case 'HELP':
            addConsoleLine('Available commands: HELP, DIR, TYPE, CLS, DATE, TIME, VER, MEM, TAPE, REBOOT', 'system');
            break;
            
        case 'DIR':
            addConsoleLine('Directory of A:\\USER\\DOCUMENTS', 'system');
            addConsoleLine('.              <DIR>     03-12-78', 'normal');
            addConsoleLine('..             <DIR>     03-12-78', 'normal');
            addConsoleLine('PROJECTS       <DIR>     03-10-78', 'normal');
            addConsoleLine('REPORTS        <DIR>     03-08-78', 'normal');
            addConsoleLine('README    .DOC  2,456    03-12-78', 'normal');
            addConsoleLine('BUDGET   .DAT 16,832    03-11-78', 'normal');
            addConsoleLine('ANALYSIS .EXE  8,192    03-09-78', 'normal');
            addConsoleLine('CONFIG   .SYS    512    03-01-78', 'normal');
            addConsoleLine('NOTES    .TXT  1,234    03-14-78', 'normal');
            addConsoleLine('MEMO     .MEM  3,789    03-14-78', 'normal');
            addConsoleLine('         6 file(s)    32,915 bytes', 'system');
            addConsoleLine('         3 dir(s)     3,276,800 bytes free', 'system');
            triggerHDDActivity();
            break;
            
        case 'CLS':
            DOM.consoleOutput.innerHTML = '';
            addConsoleLine('Console cleared.', 'system');
            break;
            
        case 'DATE':
            addConsoleLine(`Current date: 1978.03.14`, 'system');
            break;
            
        case 'TIME':
            const now = new Date();
            addConsoleLine(`Current time: ${now.toTimeString().split(' ')[0]}`, 'system');
            break;
            
        case 'VER':
            addConsoleLine('DATACORE-7 Operating System Version 3.2.1', 'system');
            addConsoleLine('Copyright (C) 1978 DATACORE SYSTEMS INC.', 'system');
            break;
            
        case 'MEM':
            addConsoleLine('Memory Report:', 'system');
            addConsoleLine('  Total:     65,536 bytes (64K)', 'normal');
            addConsoleLine('  Available: 17,408 bytes (17K)', 'normal');
            addConsoleLine('  Used:      48,128 bytes (47K)', 'normal');
            break;
            
        case 'TAPE':
            if (parts[1] === 'BACKUP') {
                addConsoleLine('TAPE: Initiating backup sequence...', 'system');
                triggerTapeActivity(5000);
            } else if (parts[1] === 'STATUS') {
                addConsoleLine(`TAPE UNIT 1: ${DOM.tapeStatus1.textContent}`, 'system');
                addConsoleLine(`Label: ${DOM.tapeLabel1.textContent}`, 'system');
            } else {
                addConsoleLine('Usage: TAPE [BACKUP|STATUS]', 'system');
            }
            break;
            
        case 'REBOOT':
            addConsoleLine('SYSTEM: Rebooting...', 'error');
            setTimeout(() => {
                location.reload();
            }, 2000);
            break;
            
        default:
            addConsoleLine(`Unknown command: ${parts[0]}`, 'error');
            addConsoleLine('Type HELP for available commands.', 'system');
            playTone(200, 0.2, 'square', 0.05);
    }
    
    playClickSound();
}

// ===== MENU SYSTEM =====
function initMenus() {
    DOM.menuItems.forEach(item => {
        const trigger = item.querySelector('.menu-trigger');
        const dropdown = item.querySelector('.menu-dropdown');
        
        if (trigger && dropdown) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close all other dropdowns
                document.querySelectorAll('.menu-dropdown').forEach(d => {
                    if (d !== dropdown) d.style.display = 'none';
                });
                
                // Toggle this dropdown
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                playClickSound();
            });
            
            // Menu option clicks
            const options = dropdown.querySelectorAll('.menu-option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    const action = option.dataset.action;
                    handleMenuAction(action);
                    dropdown.style.display = 'none';
                });
            });
        }
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.menu-dropdown').forEach(d => {
            d.style.display = 'none';
        });
    });
}

function handleMenuAction(action) {
    switch (action) {
        case 'new':
            addConsoleLine('FILE: Creating new file...', 'system');
            triggerHDDActivity();
            break;
        case 'open':
            if (SystemState.selectedFile) {
                openFile(SystemState.selectedFile);
            }
            break;
        case 'save':
            addConsoleLine('FILE: Saving changes...', 'system');
            triggerHDDActivity();
            break;
        case 'backup':
            addConsoleLine('TAPE: Starting backup to tape...', 'system');
            triggerTapeActivity(5000);
            break;
        case 'restore':
            addConsoleLine('TAPE: Restoring from tape...', 'system');
            triggerTapeActivity(5000);
            break;
        case 'terminal':
            DOM.consoleInput.focus();
            break;
        case 'about':
            addConsoleLine('DATACORE-7 Operating System v3.2.1', 'system');
            addConsoleLine('Copyright (C) 1978 DATACORE SYSTEMS INC.', 'system');
            addConsoleLine('All rights reserved.', 'system');
            break;
        default:
            addConsoleLine(`Menu action: ${action}`, 'system');
    }
    
    updateStatusMessage(`ACTION: ${action.toUpperCase()}`);
    playClickSound();
}

// ===== STATUS BAR =====
function updateStatusMessage(message) {
    const statusText = DOM.statusMessage.querySelector('.status-text');
    statusText.textContent = message;
    
    // Reset after delay
    setTimeout(() => {
        statusText.textContent = 'READY';
    }, 3000);
}

function updateResourceBars() {
    if (!SystemState.powerOn) return;
    
    // Simulate CPU fluctuation
    SystemState.cpuUsage = Math.max(5, Math.min(95, 
        SystemState.cpuUsage + (Math.random() - 0.5) * 10
    ));
    
    // Simulate memory fluctuation
    SystemState.memUsage = Math.max(32, Math.min(60,
        SystemState.memUsage + (Math.random() - 0.5) * 5
    ));
    
    DOM.cpuFill.style.width = `${SystemState.cpuUsage}%`;
    DOM.cpuValue.textContent = `${Math.round(SystemState.cpuUsage)}%`;
    
    DOM.memFill.style.width = `${SystemState.memUsage}%`;
    DOM.memValue.textContent = `${Math.round(SystemState.memUsage)}K`;
}

// ===== HDD ACTIVITY =====
function triggerHDDActivity() {
    const hddBulb = DOM.hddLight.querySelector('.light-bulb');
    hddBulb.classList.add('active-green');
    
    setTimeout(() => {
        hddBulb.classList.remove('active-green');
    }, 500);
}

// ===== KEYBOARD LEDS =====
function initKeyboardLEDs() {
    // Initial state
    DOM.numLed.classList.add('active');
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'CapsLock') {
            SystemState.capsLock = !SystemState.capsLock;
            DOM.capsLed.classList.toggle('active', SystemState.capsLock);
        }
        if (e.key === 'ScrollLock') {
            SystemState.scrollLock = !SystemState.scrollLock;
            DOM.scrollLed.classList.toggle('active', SystemState.scrollLock);
        }
    });
}

// ===== POWER CONTROL =====
function initPowerControl() {
    DOM.powerButton.addEventListener('click', () => {
        initAudio();
        
        if (SystemState.powerOn) {
            powerOff();
        } else {
            powerOn();
        }
    });
}

function powerOff() {
    SystemState.powerOn = false;
    DOM.powerLed.classList.remove('on');
    
    // CRT turn off effect
    DOM.crtOffOverlay.classList.add('off');
    DOM.crtOffOverlay.style.opacity = '1';
    
    // Stop oscilloscope
    if (oscAnimationId) {
        cancelAnimationFrame(oscAnimationId);
    }
    
    // Stop tape
    spinTape(false);
    
    // Turn off status lights
    DOM.hddLight.querySelector('.light-bulb').classList.remove('active-green');
    DOM.tapeLight.querySelector('.light-bulb').classList.remove('active-amber');
    
    playTone(100, 0.5, 'sine', 0.1);
    
    addConsoleLine('SYSTEM: Powering down...', 'system');
}

function powerOn() {
    SystemState.powerOn = true;
    DOM.powerLed.classList.add('on');
    
    // CRT turn on effect
    DOM.crtOffOverlay.style.opacity = '0';
    setTimeout(() => {
        DOM.crtOffOverlay.classList.remove('off');
    }, 500);
    
    // Restart oscilloscope
    initOscilloscope();
    
    playBootSound();
    
    addConsoleLine('SYSTEM: Powering up...', 'system');
    addConsoleLine('SYSTEM: All systems nominal.', 'success');
    
    updateStatusMessage('SYSTEM POWERED ON');
}

// ===== PHYSICAL KNOBS =====
function initKnobs() {
    let brightnessRotation = 0;
    let contrastRotation = 0;
    
    DOM.brightnessKnob.addEventListener('click', () => {
        brightnessRotation = (brightnessRotation + 30) % 360;
        DOM.brightnessKnob.style.transform = `rotate(${brightnessRotation}deg)`;
        
        // Adjust CRT brightness
        const brightness = 0.8 + (brightnessRotation / 360) * 0.4;
        DOM.crtScreen.style.filter = `brightness(${brightness})`;
        
        playClickSound();
        addConsoleLine(`BRIGHTNESS: ${Math.round((brightnessRotation / 360) * 100)}%`, 'system');
    });
    
    DOM.contrastKnob.addEventListener('click', () => {
        contrastRotation = (contrastRotation + 30) % 360;
        DOM.contrastKnob.style.transform = `rotate(${contrastRotation}deg)`;
        
        // Adjust CRT contrast
        const contrast = 0.9 + (contrastRotation / 360) * 0.3;
        DOM.crtScreen.style.filter = `contrast(${contrast})`;
        
        playClickSound();
        addConsoleLine(`CONTRAST: ${Math.round((contrastRotation / 360) * 100)}%`, 'system');
    });
}

// ===== PANEL BUTTONS =====
function initPanelButtons() {
    // Directory navigation
    document.getElementById('dirUpBtn').addEventListener('click', () => {
        addConsoleLine('DIR: Navigating up...', 'system');
        triggerHDDActivity();
        playClickSound();
    });
    
    document.getElementById('dirRefreshBtn').addEventListener('click', () => {
        addConsoleLine('DIR: Refreshing directory...', 'system');
        triggerHDDActivity();
        playClickSound();
    });
    
    // View buttons
    document.getElementById('viewIconsBtn').addEventListener('click', () => {
        DOM.fileList.classList.add('files-grid');
        DOM.fileList.classList.remove('files-list');
        document.getElementById('viewIconsBtn').classList.add('active');
        document.getElementById('viewListBtn').classList.remove('active');
        playClickSound();
    });
    
    document.getElementById('viewListBtn').addEventListener('click', () => {
        DOM.fileList.classList.remove('files-grid');
        DOM.fileList.classList.add('files-list');
        document.getElementById('viewListBtn').classList.add('active');
        document.getElementById('viewIconsBtn').classList.remove('active');
        playClickSound();
    });
    
    // Action buttons
    document.getElementById('openBtn').addEventListener('click', () => {
        if (SystemState.selectedFile) {
            openFile(SystemState.selectedFile);
        }
    });
    
    document.getElementById('copyBtn').addEventListener('click', () => {
        addConsoleLine(`COPY: ${SystemState.selectedFile} copied to clipboard`, 'system');
        updateStatusMessage('FILE COPIED');
        playClickSound();
    });
    
    document.getElementById('moveBtn').addEventListener('click', () => {
        addConsoleLine(`MOVE: ${SystemState.selectedFile} ready to move`, 'system');
        updateStatusMessage('SELECT DESTINATION');
        playClickSound();
    });
    
    document.getElementById('deleteBtn').addEventListener('click', () => {
        addConsoleLine(`DELETE: Confirm deletion of ${SystemState.selectedFile}?`, 'error');
        updateStatusMessage('CONFIRM DELETE');
        playTone(200, 0.2, 'square', 0.05);
    });
    
    document.getElementById('backupBtn').addEventListener('click', () => {
        addConsoleLine(`TAPE: Backing up ${SystemState.selectedFile}...`, 'system');
        triggerTapeActivity(3000);
        updateStatusMessage('BACKUP IN PROGRESS');
    });
}

// ===== BOOT SEQUENCE =====
function runBootSequence() {
    playBootSound();
    
    const bootLines = [
        { id: 'bootLine1', text: 'BIOS CHECK...............OK', delay: 500 },
        { id: 'bootLine2', text: 'MEMORY TEST..............64K OK', delay: 1000 },
        { id: 'bootLine3', text: 'LOADING KERNEL...........OK', delay: 1500 },
        { id: 'bootLine4', text: 'INITIALIZING DRIVES......OK', delay: 2000 },
        { id: 'bootLine5', text: 'MOUNTING TAPE UNIT.......OK', delay: 2500 },
        { id: 'bootLine6', text: 'STARTING SYSTEM..........OK', delay: 3000 }
    ];
    
    bootLines.forEach(line => {
        setTimeout(() => {
            const el = document.getElementById(line.id);
            if (el) {
                el.textContent = line.text;
                playTone(600 + Math.random() * 200, 0.05, 'square', 0.03);
            }
        }, line.delay);
    });
    
    // Hide boot overlay after sequence
    setTimeout(() => {
        DOM.bootOverlay.style.display = 'none';
        SystemState.bootComplete = true;
        
        // Initial system messages
        addConsoleLine('═══ SYSTEM READY ═══', 'timestamp');
        addConsoleLine('Welcome to DATACORE-7 Operating System', 'system');
        addConsoleLine('Type HELP for available commands', 'system');
        
        // Turn on power LED
        DOM.powerLed.classList.add('on');
        
        // Start tape animation briefly
        triggerTapeActivity(2000);
    }, 8000);
}

// ===== PERIODIC UPDATES =====
function startPeriodicUpdates() {
    // Clock update
    setInterval(updateClock, 1000);
    
    // Uptime update
    setInterval(updateUptime, 1000);
    
    // VU meter animation
    setInterval(animateVUMeter, 100);
    
    // Resource bars update
    setInterval(updateResourceBars, 2000);
    
    // Random system messages
    setInterval(() => {
        if (SystemState.bootComplete && SystemState.powerOn && Math.random() > 0.8) {
            const messages = [
                'SYSTEM: Background task completed',
                'SYSTEM: Memory defragmentation complete',
                'SYSTEM: Cache flushed',
                'SYSTEM: Index updated',
                'SYSTEM: Scan complete - no errors found'
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            addConsoleLine(msg, 'system');
        }
    }, 30000);
}

// ===== INITIALIZE SYSTEM =====
function initSystem() {
    console.log('DATACORE-7 Operating System initializing...');
    
    // Run boot sequence
    runBootSequence();
    
    // Initialize all components
    initDial();
    initToggleSwitches();
    initOscilloscope();
    initFileManager();
    initConsole();
    initMenus();
    initPowerControl();
    initKnobs();
    initPanelButtons();
    initKeyboardLEDs();
    
    // Start periodic updates
    startPeriodicUpdates();
    
    // Initial clock update
    updateClock();
    
    // Initialize VU meters
    animateVUMeter();
    
    console.log('DATACORE-7 Operating System ready.');
}

// ===== START SYSTEM =====
document.addEventListener('DOMContentLoaded', () => {
    // Small delay for effect
    setTimeout(initSystem, 500);
});

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        if (oscAnimationId) {
            cancelAnimationFrame(oscAnimationId);
        }
    } else {
        // Page is visible again
        if (SystemState.powerOn) {
            initOscilloscope();
        }
    }
});
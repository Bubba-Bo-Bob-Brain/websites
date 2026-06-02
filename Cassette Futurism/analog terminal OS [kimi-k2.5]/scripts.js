/**
 * ANALOG/DIGITAL HYBRID OS v7.4.2
 * Core System Controller
 * 1970s Retro-Futuristic Interface Logic
 */

// System State
const SystemState = {
    tapeStatus: 'STOPPED', // STOPPED, PLAYING, REWINDING, FAST_FORWARD
    tapePosition: 0,
    selectedFiles: new Set(),
    phosphorMode: 'amber',
    cpuLoad: 15,
    memoryUsage: 32,
    currentDialAngle: 0,
    isDraggingDial: false,
    commandHistory: [],
    commandIndex: -1
};

// DOM Elements Cache
const DOM = {
    body: document.body,
    clock: document.getElementById('system-clock'),
    cpuNeedle: document.getElementById('cpu-needle'),
    memNeedle: document.getElementById('mem-needle'),
    cpuValue: document.getElementById('cpu-value'),
    memValue: document.getElementById('mem-value'),
    counterDigits: [
        document.getElementById('counter-1'),
        document.getElementById('counter-2'),
        document.getElementById('counter-3'),
        document.getElementById('counter-4')
    ],
    reelLeft: document.getElementById('reel-left'),
    reelRight: document.getElementById('reel-right'),
    tapeSurface: document.getElementById('tape-surface'),
    deckStatus: document.getElementById('deck-status'),
    cassetteOverlay: document.getElementById('cassette-overlay'),
    cassetteLeft: document.getElementById('cassette-left'),
    cassetteRight: document.getElementById('cassette-right'),
    cassetteStatus: document.getElementById('cassette-status'),
    tickerContent: document.getElementById('ticker-content'),
    commandInput: document.getElementById('command-input'),
    fileList: document.getElementById('file-list'),
    dial: document.getElementById('rotary-dial'),
    dialFace: document.querySelector('.dial-face'),
    taskProgress: document.getElementById('task-progress'),
    taskText: document.getElementById('task-text'),
    audioLevels: document.querySelectorAll('.audio-level')
};

// Initialize System
document.addEventListener('DOMContentLoaded', () => {
    initializeClock();
    initializeMeters();
    initializeTapeDeck();
    initializeFileManager();
    initializeRotaryDial();
    initializePhosphorControls();
    initializeConsole();
    startSystemLoops();
    
    // Boot sequence log
    addLogEntry('SYSTEM BOOT SEQUENCE COMPLETE', 'success');
    addLogEntry('ALL SUBSYSTEMS OPERATIONAL', 'system');
    setTimeout(() => {
        addLogEntry('READY FOR USER INPUT', 'info');
    }, 500);
});

// Clock System
function initializeClock() {
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        DOM.clock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Analog Meter Simulation
function initializeMeters() {
    // CPU Load simulation with realistic fluctuations
    setInterval(() => {
        const variation = (Math.random() - 0.5) * 20;
        SystemState.cpuLoad = Math.max(5, Math.min(95, SystemState.cpuLoad + variation));
        updateMeter(DOM.cpuNeedle, DOM.cpuValue, SystemState.cpuLoad);
    }, 2000);

    // Memory usage simulation
    setInterval(() => {
        const variation = (Math.random() - 0.5) * 10;
        SystemState.memoryUsage = Math.max(10, Math.min(90, SystemState.memoryUsage + variation));
        updateMeter(DOM.memNeedle, DOM.memValue, SystemState.memoryUsage);
    }, 3000);

    // Initial update
    updateMeter(DOM.cpuNeedle, DOM.cpuValue, SystemState.cpuLoad);
    updateMeter(DOM.memNeedle, DOM.memValue, SystemState.memoryUsage);
}

function updateMeter(needleElement, valueElement, value) {
    // Map 0-100 to -45 to 45 degrees (90 degree swing)
    const angle = -45 + (value / 100) * 90;
    needleElement.style.transform = `rotate(${angle}deg)`;
    valueElement.textContent = `${Math.round(value)}%`;
    
    // Add glow effect on high load
    if (value > 80) {
        valueElement.style.textShadow = '0 0 10px currentColor, 0 0 20px currentColor';
    } else {
        valueElement.style.textShadow = '0 0 5px currentColor';
    }
}

// Tape Counter Animation
function updateTapeCounter(direction = 1) {
    SystemState.tapePosition += direction;
    if (SystemState.tapePosition < 0) SystemState.tapePosition = 9999;
    if (SystemState.tapePosition > 9999) SystemState.tapePosition = 0;
    
    const posStr = String(SystemState.tapePosition).padStart(4, '0');
    DOM.counterDigits.forEach((digit, index) => {
        digit.textContent = posStr[index];
        // Add flip animation class briefly
        digit.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            digit.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Tape Deck Control System
function initializeTapeDeck() {
    const btnPlay = document.getElementById('btn-play');
    const btnStop = document.getElementById('btn-stop');
    const btnRewind = document.getElementById('btn-rewind');
    const btnFF = document.getElementById('btn-ff');

    btnPlay.addEventListener('click', () => setTapeMode('PLAYING'));
    btnStop.addEventListener('click', () => setTapeMode('STOPPED'));
    btnRewind.addEventListener('click', () => performTapeOperation('REWINDING', -5));
    btnFF.addEventListener('click', () => performTapeOperation('FAST_FORWARD', 5));

    // Tape counter increment during play
    setInterval(() => {
        if (SystemState.tapeStatus === 'PLAYING') {
            updateTapeCounter(1);
        }
    }, 1000);
}

function setTapeMode(mode) {
    SystemState.tapeStatus = mode;
    
    // Reset all states
    DOM.reelLeft.classList.remove('spinning', 'spinning-fast');
    DOM.reelRight.classList.remove('spinning', 'spinning-fast');
    DOM.tapeSurface.classList.remove('moving');
    
    switch(mode) {
        case 'PLAYING':
            DOM.reelLeft.classList.add('spinning');
            DOM.reelRight.classList.add('spinning');
            DOM.tapeSurface.classList.add('moving');
            DOM.deckStatus.textContent = 'PLAYING';
            DOM.deckStatus.style.animation = 'pulse 1s infinite';
            addLogEntry('TAPE DECK: PLAYING', 'info');
            break;
        case 'STOPPED':
            DOM.deckStatus.textContent = 'READY';
            DOM.deckStatus.style.animation = 'none';
            addLogEntry('TAPE DECK: STOPPED', 'info');
            break;
    }
}

function performTapeOperation(operation, speed) {
    if (SystemState.tapeStatus === operation) return;
    
    SystemState.tapeStatus = operation;
    DOM.deckStatus.textContent = operation === 'REWINDING' ? 'REWINDING' : 'FAST FWD';
    
    // Spin reels fast
    DOM.reelLeft.classList.add('spinning-fast');
    DOM.reelRight.classList.add('spinning-fast');
    
    // Show cassette overlay for rewind
    if (operation === 'REWINDING') {
        showCassetteOverlay();
    }
    
    // Simulate tape movement
    const interval = setInterval(() => {
        updateTapeCounter(speed > 0 ? 1 : -1);
    }, 100);
    
    // Stop after 3 seconds
    setTimeout(() => {
        clearInterval(interval);
        setTapeMode('STOPPED');
        hideCassetteOverlay();
    }, 3000);
    
    addLogEntry(`TAPE DECK: ${operation} INITIATED`, 'system');
}

function showCassetteOverlay() {
    DOM.cassetteOverlay.classList.add('active');
    DOM.cassetteLeft.classList.add('spinning');
    DOM.cassetteRight.classList.add('spinning');
    
    // Randomly update cassette status text
    const statuses = ['SEEKING...', 'REWINDING...', 'LOADING...', 'BUFFERING...'];
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        DOM.cassetteStatus.textContent = statuses[statusIndex % statuses.length];
        statusIndex++;
    }, 800);
    
    DOM.cassetteOverlay.dataset.intervalId = statusInterval;
}

function hideCassetteOverlay() {
    DOM.cassetteOverlay.classList.remove('active');
    DOM.cassetteLeft.classList.remove('spinning');
    DOM.cassetteRight.classList.remove('spinning');
    
    const intervalId = DOM.cassetteOverlay.dataset.intervalId;
    if (intervalId) clearInterval(parseInt(intervalId));
}

// File Manager
function initializeFileManager() {
    const fileItems = document.querySelectorAll('.file-item');
    const btnNew = document.getElementById('btn-new');
    const btnDel = document.getElementById('btn-del');
    
    fileItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Handle checkbox clicks separately
            if (e.target.type === 'checkbox') {
                e.stopPropagation();
                toggleFileSelection(item, e.target.checked);
            } else {
                // Select/deselect row
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                toggleFileSelection(item, checkbox.checked);
            }
        });
    });
    
    btnNew.addEventListener('click', () => {
        addLogEntry('CREATING NEW FILE...', 'system');
        simulateTask('CREATING FILE', 1500, () => {
            addNewFile();
            addLogEntry('FILE CREATED: NEW_DOC.TXT', 'success');
        });
    });
    
    btnDel.addEventListener('click', () => {
        if (SystemState.selectedFiles.size === 0) {
            addLogEntry('ERROR: NO FILES SELECTED', 'error');
            return;
        }
        
        addLogEntry(`DELETING ${SystemState.selectedFiles.size} FILE(S)...`, 'system');
        simulateTask('DELETING', 2000, () => {
            deleteSelectedFiles();
            addLogEntry('FILES DELETED SUCCESSFULLY', 'success');
        });
    });
}

function toggleFileSelection(item, selected) {
    const filename = item.dataset.file;
    if (selected) {
        SystemState.selectedFiles.add(filename);
        item.classList.add('selected');
    } else {
        SystemState.selectedFiles.delete(filename);
        item.classList.remove('selected');
    }
}

function addNewFile() {
    const newFile = document.createElement('div');
    newFile.className = 'file-item';
    newFile.dataset.file = 'new_doc.txt';
    newFile.innerHTML = `
        <span class="col-select"><input type="checkbox"></span>
        <span class="col-name">NEW_DOC.TXT</span>
        <span class="col-size">0 KB</span>
        <span class="col-date">${new Date().toISOString().split('T')[0]}</span>
        <span class="col-type">TXT</span>
    `;
    
    // Add event listeners
    newFile.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
            e.stopPropagation();
            toggleFileSelection(newFile, e.target.checked);
        } else {
            const checkbox = newFile.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            toggleFileSelection(newFile, checkbox.checked);
        }
    });
    
    DOM.fileList.insertBefore(newFile, DOM.fileList.firstChild);
    
    // Flash effect
    newFile.style.background = 'rgba(255, 176, 0, 0.4)';
    setTimeout(() => {
        newFile.style.background = '';
    }, 500);
}

function deleteSelectedFiles() {
    const items = document.querySelectorAll('.file-item');
    items.forEach(item => {
        if (SystemState.selectedFiles.has(item.dataset.file)) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100%)';
            setTimeout(() => item.remove(), 300);
        }
    });
    SystemState.selectedFiles.clear();
}

// Rotary Dial Interface
function initializeRotaryDial() {
    const dialOptions = document.querySelectorAll('.dial-option');
    let startAngle = 0;
    let currentRotation = 0;
    
    DOM.dial.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch support
    DOM.dial.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
    document.addEventListener('touchmove', (e) => drag(e.touches[0]));
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        SystemState.isDraggingDial = true;
        const rect = DOM.dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    }
    
    function drag(e) {
        if (!SystemState.isDraggingDial) return;
        
        const rect = DOM.dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        
        let rotation = angle - startAngle + currentRotation;
        
        // Normalize to 0-360
        rotation = (rotation + 360) % 360;
        
        DOM.dialFace.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        // Update active option based on rotation
        updateDialSelection(rotation);
    }
    
    function endDrag() {
        if (!SystemState.isDraggingDial) return;
        SystemState.isDraggingDial = false;
        
        // Snap to nearest 45 degrees
        const rect = DOM.dialFace.getBoundingClientRect();
        const style = window.getComputedStyle(DOM.dialFace);
        const matrix = new DOMMatrix(style.transform);
        const angle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
        
        const snappedAngle = Math.round(angle / 45) * 45;
        DOM.dialFace.style.transform = `translate(-50%, -50%) rotate(${snappedAngle}deg)`;
        currentRotation = snappedAngle;
        
        // Trigger action for selected option
        triggerDialAction(snappedAngle);
    }
    
    function updateDialSelection(rotation) {
        dialOptions.forEach(opt => {
            const optAngle = parseInt(opt.dataset.angle);
            const diff = Math.abs(((rotation - optAngle + 360) % 360));
            if (diff < 22.5 || diff > 337.5) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }
    
    function triggerDialAction(angle) {
        const normalized = ((angle % 360) + 360) % 360;
        const options = {
            0: 'SYSTEM',
            45: 'FILES',
            90: 'NETWORK',
            135: 'TERMINAL',
            180: 'CONFIG',
            225: 'LOGS',
            270: 'UTILITIES',
            315: 'EXIT'
        };
        
        const action = options[normalized];
        if (action) {
            addLogEntry(`NAVIGATION: ${action}`, 'info');
            
            // Simulate menu change delay
            if (action === 'FILES') {
                simulateTask('ACCESSING FILE SYSTEM', 800);
            } else if (action === 'NETWORK') {
                simulateTask('INITIALIZING MODEM', 1200);
            }
        }
    }
    
    // Click on dial options
    dialOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const angle = parseInt(opt.dataset.angle);
            DOM.dialFace.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            currentRotation = angle;
            triggerDialAction(angle);
        });
    });
}

// Phosphor Color Controls
function initializePhosphorControls() {
    const buttons = document.querySelectorAll('.phosphor-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            setPhosphorColor(color);
            
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function setPhosphorColor(color) {
    SystemState.phosphorMode = color;
    DOM.body.setAttribute('data-phosphor', color);
    addLogEntry(`DISPLAY MODE: ${color.toUpperCase()} PHOSPHOR`, 'system');
    
    // Screen flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--phosphor-primary);
        opacity: 0.3;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.5s;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.style.opacity = '0', 50);
    setTimeout(() => flash.remove(), 550);
}

// Console/Command System
function initializeConsole() {
    DOM.commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = DOM.commandInput.value.trim().toUpperCase();
            if (command) {
                processCommand(command);
                SystemState.commandHistory.push(command);
                SystemState.commandIndex = SystemState.commandHistory.length;
                DOM.commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (SystemState.commandIndex > 0) {
                SystemState.commandIndex--;
                DOM.commandInput.value = SystemState.commandHistory[SystemState.commandIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (SystemState.commandIndex < SystemState.commandHistory.length - 1) {
                SystemState.commandIndex++;
                DOM.commandInput.value = SystemState.commandHistory[SystemState.commandIndex];
            } else {
                SystemState.commandIndex = SystemState.commandHistory.length;
                DOM.commandInput.value = '';
            }
        }
    });
}

function processCommand(command) {
    addLogEntry(`> ${command}`, 'info');
    
    const commands = {
        'HELP': () => {
            addLogEntry('AVAILABLE COMMANDS:', 'system');
            addLogEntry('HELP, STATUS, DIR, CLS, REBOOT', 'system');
            addLogEntry('TAPE: PLAY, STOP, REWIND, EJECT', 'system');
        },
        'STATUS': () => {
            addLogEntry(`CPU: ${Math.round(SystemState.cpuLoad)}% | MEM: ${Math.round(SystemState.memoryUsage)}%`, 'system');
            addLogEntry(`TAPE POS: ${String(SystemState.tapePosition).padStart(4, '0')}`, 'system');
        },
        'DIR': () => {
            addLogEntry('VOLUME: VOL001', 'system');
            addLogEntry('4 FILES FOUND', 'system');
        },
        'CLS': () => {
            DOM.tickerContent.innerHTML = '';
            addLogEntry('SCREEN CLEARED', 'system');
        },
        'REBOOT': () => {
            addLogEntry('INITIATING REBOOT SEQUENCE...', 'error');
            simulateTask('REBOOTING', 3000, () => {
                location.reload();
            });
        },
        'PLAY': () => setTapeMode('PLAYING'),
        'STOP': () => setTapeMode('STOPPED'),
        'REWIND': () => performTapeOperation('REWINDING', -5),
        'EJECT': () => {
            addLogEntry('WARNING: EJECT NOT IMPLEMENTED', 'error');
        }
    };
    
    if (commands[command]) {
        setTimeout(() => commands[command](), 300);
    } else {
        setTimeout(() => {
            addLogEntry(`UNKNOWN COMMAND: ${command}`, 'error');
        }, 300);
    }
}

function addLogEntry(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    entry.style.opacity = '0';
    DOM.tickerContent.appendChild(entry);
    
    // Typewriter effect
    let i = 0;
    const text = message;
    entry.textContent = '';
    
    const typeInterval = setInterval(() => {
        entry.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            entry.classList.add('visible');
        }
    }, 20);
    
    // Auto-scroll
    DOM.tickerContent.scrollTop = DOM.tickerContent.scrollHeight;
    
    // Limit entries
    while (DOM.tickerContent.children.length > 50) {
        DOM.tickerContent.removeChild(DOM.tickerContent.firstChild);
    }
}

// Task Progress Simulation
function simulateTask(label, duration, callback) {
    DOM.taskText.textContent = label;
    DOM.taskProgress.style.width = '0%';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        DOM.taskProgress.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                DOM.taskText.textContent = 'IDLE';
                DOM.taskProgress.style.width = '0%';
                if (callback) callback();
            }, 200);
        }
    }, duration / 50);
}

// System Background Loops
function startSystemLoops() {
    // Random system messages
    const messages = [
        { text: 'ROUTINE MAINTENANCE CYCLE', type: 'system' },
        { text: 'MEMORY CHECK: OK', type: 'success' },
        { text: 'BUFFER FLUSHED', type: 'info' },
        { text: 'TEMP: 42°C STABLE', type: 'system' }
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            addLogEntry(msg.text, msg.type);
        }
    }, 8000);
    
    // Audio level animation
    setInterval(() => {
        DOM.audioLevels.forEach(level => {
            const height = Math.random() * 80 + 20;
            level.style.setProperty('--level-height', `${height}%`);
        });
    }, 100);
    
    // Random screen flicker intensity
    setInterval(() => {
        const flicker = document.querySelector('.flicker-overlay');
        if (Math.random() > 0.95) {
            flicker.style.opacity = '0.1';
            setTimeout(() => {
                flicker.style.opacity = '0';
            }, 50);
        }
    }, 2000);
}

// Utility: Random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Prevent context menu for authentic feel
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    addLogEntry('RIGHT CLICK DISABLED', 'error');
});
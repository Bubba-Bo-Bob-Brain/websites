/** ============================================
 * MAGNETEX-7 OPERATING SYSTEM
 * Interactive System Controller
 * Version 7.2.4 (1979)
 * ============================================ */

// ============================================
// SYSTEM STATE & CONFIGURATION
// ============================================
const SystemState = {
    isPoweredOn: true,
    isBooting: false,
    isPlaying: false,
    isPaused: false,
    isRewinding: false,
    isFastForward: false,
    isRecording: false,
    tapePosition: 0,
    selectedFile: null,
    colorMode: 'amber', // 'amber' or 'green'
    consolePaused: false,
    dialValue: 0,
    commandHistory: [],
    historyIndex: -1,
    files: [
        { name: 'SYS.CORE', type: 'SYSTEM', size: '2.4MB', date: '1979-03-15', icon: '⚙️' },
        { name: 'KERNEL.BIN', type: 'KERNEL', size: '128KB', date: '1979-03-15', icon: '🔧' },
        { name: 'ARCHIVE_01.MAG', type: 'ARCHIVE', size: '45.2MB', date: '1979-02-28', icon: '📼' },
        { name: 'DATA.LOG', type: 'LOG', size: '512KB', date: '1979-03-14', icon: '📋' },
        { name: 'CONFIG.SYS', type: 'CONFIG', size: '4KB', date: '1979-03-10', icon: '⚡' },
        { name: 'MEMORY.DUMP', type: 'DUMP', size: '16MB', date: '1979-03-12', icon: '💾' },
        { name: 'CALIBRAT.MAP', type: 'MAP', size: '8MB', date: '1979-01-20', icon: '🗺️' },
        { name: 'BACKUP_79.TAR', type: 'BACKUP', size: '120MB', date: '1979-03-01', icon: '📦' },
        { name: 'NETWORK.DRV', type: 'DRIVER', size: '64KB', date: '1979-02-15', icon: '🔌' },
        { name: 'DISPLAY.BUF', type: 'BUFFER', size: '256KB', date: '1979-03-13', icon: '🖥️' },
        { name: 'INPUT.HND', type: 'HANDLER', size: '32KB', date: '1979-02-22', icon: '🎛️' },
        { name: 'CORE_DUMP.ERR', type: 'ERROR', size: '2MB', date: '1979-03-08', icon: '⚠️' }
    ],
    settings: {
        enhancedDisplay: true,
        audioFeedback: true,
        scanlines: true,
        phosphorGlow: true,
        barrelDistort: true
    }
};

// ============================================
// AUDIO CONTEXT FOR SOUND EFFECTS
// ============================================
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playClickSound() {
    if (!SystemState.settings.audioFeedback) return;
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

function playToggleSound() {
    if (!SystemState.settings.audioFeedback) return;
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playBootSound() {
    if (!SystemState.settings.audioFeedback) return;
    initAudio();
    
    const frequencies = [200, 400, 600, 800, 1000];
    frequencies.forEach((freq, i) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 150);
    });
}

// ============================================
// LOGGING SYSTEM
// ============================================
const Logger = {
    log(message, type = 'info') {
        if (SystemState.consolePaused && type !== 'error') return;
        
        const tickerContent = document.getElementById('ticker-content');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const timestamp = new Date().toTimeString().slice(0, 8);
        entry.innerHTML = `
            <span class="log-timestamp">[${timestamp}]</span>
            <span class="log-message ${type}">${message}</span>
        `;
        
        tickerContent.appendChild(entry);
        tickerContent.scrollTop = tickerContent.scrollHeight;
        
        // Keep only last 50 entries
        while (tickerContent.children.length > 50) {
            tickerContent.removeChild(tickerContent.firstChild);
        }
    },
    
    clear() {
        const tickerContent = document.getElementById('ticker-content');
        tickerContent.innerHTML = '';
        this.log('Event log cleared', 'system');
    }
};

// ============================================
// CLOCK & TIME MANAGEMENT
// ============================================
function updateClock() {
    const clock = document.getElementById('led-clock');
    if (clock) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// ============================================
// COLOR THEME MANAGEMENT
// ============================================
function toggleColorMode() {
    const body = document.body;
    const toggle = document.getElementById('color-toggle');
    
    if (SystemState.colorMode === 'amber') {
        SystemState.colorMode = 'green';
        body.classList.remove('phosphor-amber');
        body.classList.add('phosphor-green');
        toggle.classList.add('active');
        Logger.log('Display mode: VERDANT (GREEN PHOSPHOR)', 'system');
    } else {
        SystemState.colorMode = 'amber';
        body.classList.remove('phosphor-green');
        body.classList.add('phosphor-amber');
        toggle.classList.remove('active');
        Logger.log('Display mode: AMBER PHOSPHOR', 'system');
    }
    
    playToggleSound();
}

// ============================================
// ROTARY DIAL INTERACTION
// ============================================
let isDraggingDial = false;
let dialStartAngle = 0;
let dialCurrentAngle = 0;

function initRotaryDial() {
    const dial = document.getElementById('rotary-dial');
    const dialValue = document.getElementById('dial-value');
    
    if (!dial) return;
    
    dial.addEventListener('mousedown', startDialDrag);
    dial.addEventListener('touchstart', startDialDrag, { passive: false });
    
    document.addEventListener('mousemove', dragDial);
    document.addEventListener('touchmove', dragDial, { passive: false });
    
    document.addEventListener('mouseup', stopDialDrag);
    document.addEventListener('touchend', stopDialDrag);
    
    // Keyboard control
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            rotateDial(-1);
        } else if (e.key === 'ArrowRight') {
            rotateDial(1);
        }
    });
}

function startDialDrag(e) {
    e.preventDefault();
    isDraggingDial = true;
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    dialStartAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
}

function dragDial(e) {
    if (!isDraggingDial) return;
    e.preventDefault();
    
    const dial = document.getElementById('rotary-dial');
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX === undefined) return;
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    let deltaAngle = currentAngle - dialStartAngle;
    
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    dialCurrentAngle += deltaAngle * 0.3;
    dial.style.transform = `translate(-50%, -50%) rotate(${dialCurrentAngle}deg)`;
    
    dialStartAngle = currentAngle;
    
    // Update dial value based on rotation
    const newValue = Math.floor(((dialCurrentAngle % 360) + 360) % 360 / 36) % 10;
    if (newValue !== SystemState.dialValue) {
        SystemState.dialValue = newValue;
        updateDialDisplay();
        playClickSound();
    }
}

function stopDialDrag() {
    isDraggingDial = false;
    // Snap to nearest position
    const snapAngle = SystemState.dialValue * 36;
    dialCurrentAngle = snapAngle;
    const dial = document.getElementById('rotary-dial');
    if (dial) {
        dial.style.transform = `translate(-50%, -50%) rotate(${snapAngle}deg)`;
    }
}

function rotateDial(direction) {
    SystemState.dialValue = (SystemState.dialValue + direction + 10) % 10;
    dialCurrentAngle = SystemState.dialValue * 36;
    const dial = document.getElementById('rotary-dial');
    if (dial) {
        dial.style.transform = `translate(-50%, -50%) rotate(${dialCurrentAngle}deg)`;
    }
    updateDialDisplay();
    playClickSound();
}

function updateDialDisplay() {
    const dialValueEl = document.getElementById('dial-value');
    if (dialValueEl) {
        dialValueEl.textContent = String(SystemState.dialValue).padStart(2, '0');
    }
    // Update path based on dial value
    const paths = [
        'TAPE://ARCHIVE/PUBLIC/DOCUMENTS',
        'TAPE://ARCHIVE/SYSTEM/FILES',
        'TAPE://ARCHIVE/BACKUP/1979',
        'TAPE://ARCHIVE/LOGS/ERRORS',
        'TAPE://ARCHIVE/DATA/PROCESSED',
        'TAPE://ARCHIVE/CONFIG/DEVICES',
        'TAPE://ARCHIVE/KERNEL/MODULES',
        'TAPE://ARCHIVE/DRIVERS/NETWORK',
        'TAPE://ARCHIVE/DUMPS/MEMORY',
        'TAPE://SYSTEM/CORE'
    ];
    const pathEl = document.getElementById('current-path');
    if (pathEl) {
        pathEl.textContent = paths[SystemState.dialValue];
    }
}

// ============================================
// VU METER ANIMATION
// ============================================
function animateVUMeter() {
    const bars = document.querySelectorAll('.vu-bar');
    const level = Math.floor(Math.random() * 10) + 1;
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            if (index < level) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        }, index * 30);
    });
}

// ============================================
// ANALOG GAUGE ANIMATION
// ============================================
function animateGauges() {
    const memoryGauge = document.querySelector('#gauge-memory .gauge-needle');
    const storageGauge = document.querySelector('#gauge-storage .gauge-needle');
    
    if (memoryGauge) {
        const memoryLevel = -60 + (Math.random() * 50);
        memoryGauge.style.transform = `translateX(-50%) rotate(${memoryLevel}deg)`;
    }
    
    if (storageGauge) {
        const storageLevel = -60 + (Math.random() * 70);
        storageGauge.style.transform = `translateX(-50%) rotate(${storageLevel}deg)`;
    }
}

// ============================================
// TAPE REEL CONTROLS
// ============================================
function updateTapeReels() {
    const leftReel = document.getElementById('left-reel');
    const rightReel = document.getElementById('right-reel');
    
    if (!leftReel || !rightReel) return;
    
    // Reset classes
    leftReel.classList.remove('playing', 'paused', 'rewinding', 'fast-forward');
    rightReel.classList.remove('playing', 'paused', 'rewinding', 'fast-forward');
    
    if (SystemState.isRewinding) {
        leftReel.classList.add('rewinding');
        rightReel.classList.add('rewinding');
    } else if (SystemState.isFastForward) {
        leftReel.classList.add('fast-forward');
        rightReel.classList.add('fast-forward');
    } else if (SystemState.isPlaying) {
        leftReel.classList.add('playing');
        rightReel.classList.add('playing');
    } else if (SystemState.isPaused) {
        leftReel.classList.add('paused');
        rightReel.classList.add('paused');
    }
}

function playTape() {
    SystemState.isPlaying = true;
    SystemState.isPaused = false;
    SystemState.isRewinding = false;
    SystemState.isFastForward = false;
    
    document.getElementById('btn-play').classList.add('active');
    document.getElementById('btn-pause').classList.remove('active');
    document.getElementById('btn-rewind').classList.remove('active');
    document.getElementById('btn-fastforward').classList.remove('active');
    
    updateTapeReels();
    updateIndicators();
    Logger.log('Tape transport: PLAY initiated', 'system');
    playClickSound();
    
    // Animate tape position
    animateTapeCounter();
}

function pauseTape() {
    SystemState.isPaused = true;
    SystemState.isPlaying = false;
    
    document.getElementById('btn-pause').classList.add('active');
    document.getElementById('btn-play').classList.remove('active');
    
    updateTapeReels();
    updateIndicators();
    Logger.log('Tape transport: PAUSE', 'system');
    playClickSound();
}

function stopTape() {
    SystemState.isPlaying = false;
    SystemState.isPaused = false;
    SystemState.isRewinding = false;
    SystemState.isFastForward = false;
    SystemState.isRecording = false;
    
    document.querySelectorAll('.transport-btn').forEach(btn => btn.classList.remove('active'));
    
    updateTapeReels();
    updateIndicators();
    Logger.log('Tape transport: STOP', 'system');
    playClickSound();
}

function rewindTape() {
    if (SystemState.isRewinding) {
        // Stop rewind
        stopTape();
        return;
    }
    
    SystemState.isRewinding = true;
    SystemState.isPlaying = false;
    SystemState.isPaused = false;
    
    document.getElementById('btn-rewind').classList.add('active');
    document.getElementById('btn-play').classList.remove('active');
    document.getElementById('btn-pause').classList.remove('active');
    
    updateTapeReels();
    Logger.log('Tape transport: REWIND - Fast reversing tape...', 'system');
    playClickSound();
    
    // Animate counter backwards
    animateTapeCounter(true);
}

function fastForwardTape() {
    if (SystemState.isFastForward) {
        // Stop fast forward
        stopTape();
        return;
    }
    
    SystemState.isFastForward = true;
    SystemState.isPlaying = false;
    SystemState.isPaused = false;
    
    document.getElementById('btn-fastforward').classList.add('active');
    document.getElementById('btn-play').classList.remove('active');
    document.getElementById('btn-pause').classList.remove('active');
    
    updateTapeReels();
    Logger.log('Tape transport: FAST FORWARD - Accelerating...', 'system');
    playClickSound();
    
    // Animate counter forwards
    animateTapeCounter(false, true);
}

function recordTape() {
    if (SystemState.isRecording) {
        stopTape();
        return;
    }
    
    SystemState.isRecording = true;
    document.getElementById('btn-record').classList.add('active');
    
    // Flash the indicator
    const indTape = document.getElementById('ind-tape');
    if (indTape) indTape.classList.add('active');
    
    Logger.log('WARNING: Recording engaged - Write protection disabled', 'warning');
    playClickSound();
}

function animateTapeCounter(rewinding = false, fastForward = false) {
    const digits = document.querySelectorAll('.counter-digit');
    
    if (rewinding) {
        // Animate backwards
        const interval = setInterval(() => {
            if (!SystemState.isRewinding) {
                clearInterval(interval);
                return;
            }
            SystemState.tapePosition = Math.max(0, SystemState.tapePosition - 1);
            updateCounterDisplay(digits);
        }, 50);
    } else if (fastForward) {
        // Animate forwards fast
        const interval = setInterval(() => {
            if (!SystemState.isFastForward) {
                clearInterval(interval);
                return;
            }
            SystemState.tapePosition = Math.min(99999, SystemState.tapePosition + 1);
            updateCounterDisplay(digits);
        }, 30);
    } else {
        // Normal play speed
        const interval = setInterval(() => {
            if (!SystemState.isPlaying) {
                clearInterval(interval);
                return;
            }
            SystemState.tapePosition = Math.min(99999, SystemState.tapePosition + 1);
            updateCounterDisplay(digits);
        }, 100);
    }
}

function updateCounterDisplay(digits) {
    const value = String(SystemState.tapePosition).padStart(5, '0');
    digits.forEach((digit, index) => {
        digit.textContent = value[index];
    });
}

// ============================================
// FILE LIST MANAGEMENT
// ============================================
function populateFileList() {
    const fileList = document.getElementById('file-list');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    SystemState.files.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.dataset.index = index;
        item.innerHTML = `
            <span class="col-name">
                <span class="file-icon">${file.icon}</span>
                ${file.name}
            </span>
            <span class="col-type">${file.type}</span>
            <span class="col-size">${file.size}</span>
            <span class="col-date">${file.date}</span>
        `;
        
        item.addEventListener('click', () => selectFile(index));
        item.addEventListener('dblclick', () => openFile(index));
        
        fileList.appendChild(item);
    });
    
    Logger.log(`Directory loaded: ${SystemState.files.length} records found`, 'system');
}

function selectFile(index) {
    const items = document.querySelectorAll('.file-item');
    items.forEach(item => item.classList.remove('selected'));
    
    if (index !== null) {
        items[index].classList.add('selected');
        SystemState.selectedFile = SystemState.files[index];
        
        const selectedEl = document.getElementById('selected-file');
        if (selectedEl) {
            selectedEl.textContent = SystemState.selectedFile.name;
        }
        
        playClickSound();
    }
}

function openFile(index) {
    const file = SystemState.files[index];
    Logger.log(`Accessing file: ${file.name}`, 'success');
    
    // Simulate file access animation
    const item = document.querySelectorAll('.file-item')[index];
    item.style.background = 'rgba(51, 255, 51, 0.2)';
    setTimeout(() => {
        item.style.background = '';
    }, 300);
}

// ============================================
// FUNCTION KEYS
// ============================================
function initFunctionKeys() {
    const keys = document.querySelectorAll('.chunky-key');
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const keyType = key.dataset.key;
            handleFunctionKey(keyType);
            playClickSound();
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key.startsWith('F') && !isNaN(e.key.slice(1))) {
            handleFunctionKey(e.key.toUpperCase());
        }
    });
}

function handleFunctionKey(key) {
    switch (key) {
        case 'F1':
            Logger.log('HELP: Available commands - help, dir, copy, move, delete, type, time, clear', 'system');
            break;
        case 'F2':
            if (SystemState.selectedFile) {
                Logger.log(`COPY: Initiating copy of ${SystemState.selectedFile.name}...`, 'system');
                simulateFileOperation('copy');
            } else {
                Logger.log('COPY: No file selected', 'warning');
            }
            break;
        case 'F3':
            if (SystemState.selectedFile) {
                Logger.log(`MOVE: Initiating move of ${SystemState.selectedFile.name}...`, 'system');
                simulateFileOperation('move');
            } else {
                Logger.log('MOVE: No file selected', 'warning');
            }
            break;
        case 'F4':
            if (SystemState.selectedFile) {
                Logger.log(`DELETE: Confirming deletion of ${SystemState.selectedFile.name}...`, 'warning');
                simulateFileOperation('delete');
            } else {
                Logger.log('DELETE: No file selected', 'warning');
            }
            break;
        case 'F5':
            populateFileList();
            Logger.log('Directory refreshed', 'system');
            break;
        case 'F6':
            Logger.log('SEARCH: Opening search interface...', 'system');
            break;
    }
}

function simulateFileOperation(operation) {
    const indicator = document.getElementById('ind-busy');
    if (indicator) indicator.classList.add('active');
    
    // Flash tape reels
    SystemState.isPlaying = true;
    updateTapeReels();
    
    setTimeout(() => {
        if (indicator) indicator.classList.remove('active');
        SystemState.isPlaying = false;
        updateTapeReels();
        
        if (operation === 'copy') {
            Logger.log('Operation complete: File copied successfully', 'success');
        } else if (operation === 'move') {
            Logger.log('Operation complete: File moved successfully', 'success');
        } else if (operation === 'delete') {
            Logger.log('Operation complete: File deleted', 'success');
        }
    }, 2000);
}

// ============================================
// TOGGLE SWITCHES
// ============================================
function initToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch-large input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const id = e.target.id;
            const setting = id.replace('toggle-', '');
            SystemState.settings[setting] = e.target.checked;
            
            applySettings();
            playToggleSound();
            
            Logger.log(`Setting ${setting}: ${e.target.checked ? 'ENABLED' : 'DISABLED'}`, 'system');
        });
    });
}

function applySettings() {
    const screen = document.querySelector('.crt-screen');
    const scanlines = document.querySelector('.scanlines');
    const glow = document.querySelector('.screen-glow');
    
    if (screen && !SystemState.settings.barrelDistort) {
        screen.classList.remove('barrel-distort');
    } else if (screen && SystemState.settings.barrelDistort) {
        screen.classList.add('barrel-distort');
    }
    
    if (scanlines) {
        scanlines.style.display = SystemState.settings.scanlines ? 'block' : 'none';
    }
    
    if (glow) {
        glow.style.opacity = SystemState.settings.phosphorGlow ? '0.3' : '0';
    }
}

// ============================================
// SYSTEM BUTTONS
// ============================================
function initSystemButtons() {
    const emergency = document.getElementById('btn-emergency');
    const reset = document.getElementById('btn-reset');
    const boot = document.getElementById('btn-boot');
    
    if (emergency) {
        emergency.addEventListener('click', () => {
            Logger.log('!!! EMERGENCY STOP ACTIVATED !!!', 'error');
            stopTape();
            playClickSound();
        });
    }
    
    if (reset) {
        reset.addEventListener('click', () => {
            Logger.log('SYSTEM RESET: Rebooting subsystems...', 'warning');
            setTimeout(() => {
                Logger.log('System reset complete', 'success');
            }, 1500);
            playBootSound();
        });
    }
    
    if (boot) {
        boot.addEventListener('click', () => {
            bootSequence();
        });
    }
}

// ============================================
// BOOT SEQUENCE
// ============================================
function bootSequence() {
    if (SystemState.isBooting) return;
    SystemState.isBooting = true;
    
    const bootScreen = document.createElement('div');
    bootScreen.className = 'boot-screen active';
    bootScreen.innerHTML = `
        <div class="boot-logo">MAGNETEX-7</div>
        <div class="boot-text" id="boot-text"></div>
        <div class="boot-progress">
            <div class="boot-progress-bar" id="boot-progress"></div>
        </div>
    `;
    document.body.appendChild(bootScreen);
    
    playBootSound();
    
    const bootMessages = [
        'INITIALIZING MAGNETIC CORE ARRAY...',
        'LOADING KERNEL MODULES.......... OK',
        'CALIBRATING TAPE TRANSPORT...... OK',
        'DETECTING PERIPHERAL DEVICES.... OK',
        'MOUNTING FILE ARCHIVES.......... OK',
        'INITIALIZING DISPLAY BUFFER..... OK',
        'WARMING PHOSPHOR ELEMENTS....... OK',
        'SELF-TEST SEQUENCE.............. OK',
        'SYSTEM READY'
    ];
    
    const bootText = document.getElementById('boot-text');
    const bootProgress = document.getElementById('boot-progress');
    
    let progress = 0;
    let messageIndex = 0;
    
    const interval = setInterval(() => {
        if (messageIndex < bootMessages.length) {
            bootText.innerHTML += bootMessages[messageIndex] + '<br>';
            progress = ((messageIndex + 1) / bootMessages.length) * 100;
            bootProgress.style.width = progress + '%';
            messageIndex++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                setTimeout(() => {
                    bootScreen.remove();
                    SystemState.isBooting = false;
                    Logger.log('=== SYSTEM BOOT COMPLETE ===', 'success');
                }, 500);
            }, 1000);
        }
    }, 400);
}

// ============================================
// CONSOLE INPUT HANDLING
// ============================================
function initConsole() {
    const input = document.getElementById('console-input');
    const submit = document.getElementById('input-submit');
    const clearBtn = document.getElementById('btn-clear-log');
    const pauseBtn = document.getElementById('btn-pause-log');
    
    if (submit) {
        submit.addEventListener('click', processCommand);
    }
    
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand();
            } else if (e.key === 'ArrowUp') {
                navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                navigateHistory(1);
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            Logger.clear();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            SystemState.consolePaused = !SystemState.consolePaused;
            pauseBtn.textContent = SystemState.consolePaused ? 'RESUME' : 'PAUSE';
            Logger.log(`Console output ${SystemState.consolePaused ? 'PAUSED' : 'RESUMED'}`, 'system');
        });
    }
}

function processCommand() {
    const input = document.getElementById('console-input');
    if (!input || !input.value.trim()) return;
    
    const command = input.value.trim().toLowerCase();
    const args = command.split(' ');
    const cmd = args[0];
    
    // Add to history
    SystemState.commandHistory.push(input.value);
    SystemState.historyIndex = SystemState.commandHistory.length;
    
    Logger.log(`> ${input.value}`, 'system');
    input.value = '';
    
    // Process commands
    switch (cmd) {
        case 'help':
            Logger.log('Available commands:', 'system');
            Logger.log('  help     - Display this help message', 'system');
            Logger.log('  dir      - List files in current directory', 'system');
            Logger.log('  copy     - Copy selected file', 'system');
            Logger.log('  delete   - Delete selected file', 'system');
            Logger.log('  time     - Display current time', 'system');
            Logger.log('  clear    - Clear the console', 'system');
            Logger.log('  status   - Display system status', 'system');
            Logger.log('  reboot   - Perform system reboot', 'system');
            Logger.log('  echo     - Echo text to console', 'system');
            break;
            
        case 'dir':
            Logger.log(`Directory of ${document.getElementById('current-path')?.textContent || 'TAPE://ARCHIVE'}:`, 'system');
            SystemState.files.forEach(file => {
                Logger.log(`  ${file.icon} ${file.name.padEnd(15)} ${file.type.padEnd(10)} ${file.size.padStart(10)}`, 'system');
            });
            Logger.log(`${SystemState.files.length} file(s)`, 'system');
            break;
            
        case 'time':
            Logger.log(`Current time: ${new Date().toLocaleString()}`, 'system');
            break;
            
        case 'clear':
            Logger.clear();
            break;
            
        case 'status':
            Logger.log('=== SYSTEM STATUS ===', 'system');
            Logger.log(`Power: ${SystemState.isPoweredOn ? 'ON' : 'OFF'}`, 'system');
            Logger.log(`Tape Position: ${SystemState.tapePosition}`, 'system');
            Logger.log(`Selected File: ${SystemState.selectedFile?.name || 'NONE'}`, 'system');
            Logger.log(`Color Mode: ${SystemState.colorMode.toUpperCase()}`, 'system');
            Logger.log(`CPU Load: ${Math.floor(Math.random() * 40 + 30)}%`, 'system');
            break;
            
        case 'reboot':
            bootSequence();
            break;
            
        case 'echo':
            const text = args.slice(1).join(' ');
            Logger.log(text || '', 'system');
            break;
            
        case 'copy':
        case 'delete':
            if (SystemState.selectedFile) {
                simulateFileOperation(cmd);
            } else {
                Logger.log(`${cmd.toUpperCase()}: No file selected`, 'warning');
            }
            break;
            
        default:
            Logger.log(`Unknown command: ${cmd}`, 'error');
            Logger.log('Type "help" for available commands', 'system');
    }
}

function navigateHistory(direction) {
    const input = document.getElementById('console-input');
    if (!input || SystemState.commandHistory.length === 0) return;
    
    SystemState.historyIndex += direction;
    
    if (SystemState.historyIndex < 0) {
        SystemState.historyIndex = 0;
    } else if (SystemState.historyIndex >= SystemState.commandHistory.length) {
        SystemState.historyIndex = SystemState.commandHistory.length;
        input.value = '';
        return;
    }
    
    input.value = SystemState.commandHistory[SystemState.historyIndex];
}

// ============================================
// INDICATOR LEDs
// ============================================
function updateIndicators() {
    const indPower = document.getElementById('ind-power');
    const indTape = document.getElementById('ind-tape');
    const indDrive = document.getElementById('ind-drive');
    const indError = document.getElementById('ind-error');
    const indBusy = document.getElementById('ind-busy');
    const indReady = document.getElementById('ind-ready');
    
    if (indPower) indPower.classList.add('active');
    if (indTape) {
        if (SystemState.isPlaying || SystemState.isRecording) {
            indTape.classList.add('active');
        } else {
            indTape.classList.remove('active');
        }
    }
    if (indDrive) indDrive.classList.add('active');
    if (indReady) indReady.classList.add('active');
    
    // Blinking busy indicator
    if (indBusy) {
        if (SystemState.isPlaying) {
            indBusy.classList.add('active');
        } else {
            indBusy.classList.remove('active');
        }
    }
}

// ============================================
// LEVEL METERS ANIMATION
// ============================================
function animateLevelMeters() {
    const meterL = document.getElementById('level-meter-l');
    const meterR = document.getElementById('level-meter-r');
    
    if (meterL && meterR && SystemState.isPlaying) {
        const levelL = 40 + Math.random() * 50;
        const levelR = 40 + Math.random() * 50;
        
        meterL.style.width = levelL + '%';
        meterR.style.width = levelR + '%';
    } else if (meterL && meterR) {
        const idleLevel = 5 + Math.random() * 10;
        meterL.style.width = idleLevel + '%';
        meterR.style.width = idleLevel + '%';
    }
}

// ============================================
// MONITOR CONTROLS
// ============================================
function initMonitorControls() {
    const powerBtn = document.getElementById('power-button');
    const brightnessKnob = document.getElementById('knob-brightness');
    const contrastKnob = document.getElementById('knob-contrast');
    
    if (powerBtn) {
        powerBtn.addEventListener('click', () => {
            SystemState.isPoweredOn = !SystemState.isPoweredOn;
            const monitor = document.querySelector('.crt-monitor');
            
            if (SystemState.isPoweredOn) {
                monitor.classList.remove('crt-off');
                Logger.log('System power: ON', 'success');
            } else {
                monitor.classList.add('crt-off');
                Logger.log('System power: OFF', 'warning');
            }
            
            playClickSound();
        });
    }
    
    // Knob rotation
    initKnob(brightnessKnob, (value) => {
        const screen = document.querySelector('.crt-screen');
        if (screen) {
            screen.style.filter = `brightness(${0.5 + value * 0.5})`;
        }
    });
    
    initKnob(contrastKnob, (value) => {
        const screen = document.querySelector('.crt-screen');
        if (screen) {
            screen.style.filter = `contrast(${0.8 + value * 0.4})`;
        }
    });
}

function initKnob(knob, callback) {
    if (!knob) return;
    
    let isDragging = false;
    let startY = 0;
    let currentRotation = 0;
    
    const handleStart = (e) => {
        isDragging = true;
        startY = e.clientY || e.touches[0].clientY;
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
    };
    
    const handleMove = (e) => {
        if (!isDragging) return;
        const clientY = e.clientY || e.touches[0].clientY;
        const deltaY = startY - clientY;
        currentRotation += deltaY * 2;
        currentRotation = Math.max(-135, Math.min(135, currentRotation));
        knob.style.transform = `rotate(${currentRotation}deg)`;
        knob.parentElement.querySelector('.knob-indicator').style.transform = 
            `translateX(-50%) rotate(${currentRotation}deg)`;
        startY = clientY;
        callback(currentRotation / 270);
    };
    
    const handleEnd = () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    };
    
    knob.addEventListener('mousedown', handleStart);
    knob.addEventListener('touchstart', handleStart);
}

// ============================================
// WINDOW CONTROLS
// ============================================
function initWindowControls() {
    const closeBtn = document.querySelector('.window-btn.close');
    const minimizeBtn = document.querySelector('.window-btn.minimize');
    const maximizeBtn = document.querySelector('.window-btn.maximize');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            Logger.log('Window closed', 'warning');
            document.querySelector('.file-manager').style.display = 'none';
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            const content = document.querySelector('.window-content');
            const footer = document.querySelector('.window-footer');
            content.style.display = content.style.display === 'none' ? 'flex' : 'none';
            footer.style.display = footer.style.display === 'none' ? 'flex' : 'none';
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            const window = document.querySelector('.file-manager');
            window.classList.toggle('maximized');
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('MAGNETEX-7 Operating System initializing...');
    
    // Initialize all systems
    updateClock();
    populateFileList();
    initRotaryDial();
    initFunctionKeys();
    initToggleSwitches();
    initSystemButtons();
    initConsole();
    initMonitorControls();
    initWindowControls();
    
    // Set up intervals
    setInterval(updateClock, 1000);
    setInterval(animateVUMeter, 500);
    setInterval(animateGauges, 1000);
    setInterval(animateLevelMeters, 100);
    setInterval(updateIndicators, 500);
    
    // Initialize transport buttons
    const transportButtons = {
        'btn-play': playTape,
        'btn-pause': pauseTape,
        'btn-stop': stopTape,
        'btn-rewind': rewindTape,
        'btn-fastforward': fastForwardTape,
        'btn-record': recordTape
    };
    
    Object.entries(transportButtons).forEach(([id, handler]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', handler);
        }
    });
    
    // Color toggle
    const colorToggle = document.getElementById('color-toggle');
    if (colorToggle) {
        colorToggle.addEventListener('click', toggleColorMode);
    }
    
    // Apply initial settings
    applySettings();
    
    // Log startup
    Logger.log('========================================', 'system');
    Logger.log('MAGNETEX-7 OPERATING SYSTEM v7.2.4', 'system');
    Logger.log('(c) 1979 Magnetex Computing Systems', 'system');
    Logger.log('========================================', 'system');
    Logger.log('System initialized successfully', 'success');
    Logger.log('Ready for input. Type "help" for commands.', 'system');
    
    // Select first file by default
    selectFile(0);
    
    console.log('MAGNETEX-7 initialization complete');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Also handle case where DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 100);
}
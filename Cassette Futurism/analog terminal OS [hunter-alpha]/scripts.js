/* ========================================
   OS/73 PROMETHEUS — Analog Computing System
   Interactive Interface Controller
   ======================================== */

// === System State ===
const SystemState = {
    currentPath: '/SYS',
    selectedFile: null,
    fileCounter: 0,
    theme: 'amber',
    scanlines: true,
    bloom: true,
    curvature: true,
    brightness: 1,
    contrast: 1,
    focus: 1,
    rotaryPosition: 0,
    logPaused: false,
    booted: false
};

// === Virtual File System ===
const FileSystem = {
    '/SYS': [
        { name: 'KERNEL.SYS', type: 'sys', size: 48200, date: '1973-03-15', perm: 'R--' },
        { name: 'BOOTSTRAP.BIN', type: 'exe', size: 2048, date: '1973-02-28', perm: 'R-X' },
        { name: 'MEMORY.DAT', type: 'dat', size: 16384, date: '1973-04-01', perm: 'RW-' },
        { name: 'CONFIG.INI', type: 'cfg', size: 512, date: '1973-03-20', perm: 'RW-' },
        { name: 'SYSTEM.LOG', type: 'log', size: 8192, date: '1973-04-15', perm: 'R--' },
        { name: 'DRIVERS', type: 'dir', size: 0, date: '1973-01-10', perm: 'R-X' },
        { name: 'MODULES', type: 'dir', size: 0, date: '1973-02-14', perm: 'R-X' }
    ],
    '/USR': [
        { name: 'GUEST', type: 'dir', size: 0, date: '1973-03-01', perm: 'RWX' },
        { name: 'ADMIN', type: 'dir', size: 0, date: '1973-01-01', perm: 'RWX' },
        { name: 'OPERATOR', type: 'dir', size: 0, date: '1973-02-15', perm: 'RWX' },
        { name: 'README.TXT', type: 'txt', size: 256, date: '1973-03-10', perm: 'R--' }
    ],
    '/DAT': [
        { name: 'RECORDS.DB', type: 'dat', size: 65536, date: '1973-04-10', perm: 'RW-' },
        { name: 'ARCHIVE', type: 'dir', size: 0, date: '1973-01-20', perm: 'R-X' },
        { name: 'TEMP', type: 'dir', size: 0, date: '1973-04-01', perm: 'RWX' },
        { name: 'BACKUP.TAR', type: 'dat', size: 131072, date: '1973-04-14', perm: 'R--' },
        { name: 'METRICS.CSV', type: 'dat', size: 4096, date: '1973-04-15', perm: 'RW-' }
    ],
    '/BIN': [
        { name: 'FILEMGR.EXE', type: 'exe', size: 12288, date: '1973-03-25', perm: 'R-X' },
        { name: 'EDITOR.EXE', type: 'exe', size: 8192, date: '1973-03-20', perm: 'R-X' },
        { name: 'CALC.EXE', type: 'exe', size: 4096, date: '1973-02-28', perm: 'R-X' },
        { name: 'TERMINAL.EXE', type: 'exe', size: 6144, date: '1973-03-15', perm: 'R-X' },
        { name: 'DISKTOOL.EXE', type: 'exe', size: 10240, date: '1973-04-01', perm: 'R-X' }
    ],
    '/LOG': [
        { name: 'SYSTEM.LOG', type: 'log', size: 32768, date: '1973-04-15', perm: 'R--' },
        { name: 'ERROR.LOG', type: 'log', size: 4096, date: '1973-04-15', perm: 'R--' },
        { name: 'ACCESS.LOG', type: 'log', size: 16384, date: '1973-04-15', perm: 'R--' },
        { name: 'AUDIT.LOG', type: 'log', size: 8192, date: '1973-04-14', perm: 'R--' }
    ],
    '/TMP': [
        { name: 'SWAP.DAT', type: 'dat', size: 32768, date: '1973-04-15', perm: 'RW-' },
        { name: 'CACHE', type: 'dir', size: 0, date: '1973-04-15', perm: 'RWX' }
    ],
    '/SYS/DRIVERS': [
        { name: 'CRTDISP.OUT', type: 'exe', size: 4096, date: '1973-02-10', perm: 'R-X' },
        { name: 'TAPECTL.DRV', type: 'exe', size: 3072, date: '1973-02-12', perm: 'R-X' },
        { name: 'KEYBOARD.DRV', type: 'exe', size: 2048, date: '1973-02-08', perm: 'R-X' },
        { name: 'SERIAL.DRV', type: 'exe', size: 2560, date: '1973-02-15', perm: 'R-X' }
    ],
    '/SYS/MODULES': [
        { name: 'NETWORK.MOD', type: 'sys', size: 6144, date: '1973-03-01', perm: 'R-X' },
        { name: 'CRYPTO.MOD', type: 'sys', size: 4096, date: '1973-03-05', perm: 'R-X' },
        { name: 'SCHEDULER.MOD', type: 'sys', size: 3072, date: '1973-02-28', perm: 'R-X' }
    ]
};

// === Boot Sequence Messages ===
const BootMessages = [
    'PROMETHEUS ANALOG COMPUTING SYSTEM',
    'MODEL 7300 — FIRMWARE REV 4.2.1',
    '═══════════════════════════════════════',
    '',
    'INITIALIZING CORE MEMORY BANKS...',
    '  BANK 0: 8192 BYTES OK',
    '  BANK 1: 8192 BYTES OK',
    '  BANK 2: 8192 BYTES OK',
    '  BANK 3: 4096 BYTES OK',
    '',
    'LOADING TAPE DRIVE CONTROLLER...',
    '  REEL POSITION: HOME',
    '  HEAD ALIGNMENT: CALIBRATED',
    '',
    'SCANNING DISC SUBSYSTEM...',
    '  DISC 0: 120 MB ONLINE',
    '  BAD SECTORS: 0',
    '',
    'STARTING SYSTEM PROCESSES...',
    '  PID 0001: KERNEL.SYS     [RUNNING]',
    '  PID 0014: FILEMGR.EXE    [RUNNING]',
    '  PID 0023: TAPECTL.DRV    [IDLE]',
    '  PID 0031: CRTDISP.OUT    [RUNNING]',
    '  PID 0047: LOGGING.SVC    [WAITING]',
    '',
    'MOUNTING FILE SYSTEMS...',
    '  /SYS   : MOUNTED READ-ONLY',
    '  /USR   : MOUNTED READ-WRITE',
    '  /DAT   : MOUNTED READ-WRITE',
    '  /BIN   : MOUNTED READ-ONLY',
    '  /LOG   : MOUNTED APPEND-ONLY',
    '  /TMP   : MOUNTED READ-WRITE',
    '',
    'SYSTEM READY.',
    'WELCOME TO OS/73 PROMETHEUS'
];

// === DOM Elements ===
const Elements = {};

// === Initialize Application ===
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    runBootSequence();
});

// === Cache DOM Elements ===
function cacheElements() {
    Elements.crtScreen = document.getElementById('crtScreen');
    Elements.startupOverlay = document.getElementById('startupOverlay');
    Elements.bootText = document.getElementById('bootText');
    Elements.bootProgressBar = document.getElementById('bootProgressBar');
    Elements.clockDigits = document.getElementById('clockDigits');
    Elements.memUsage = document.getElementById('memUsage');
    Elements.loadAvg = document.getElementById('loadAvg');
    Elements.currentPath = document.getElementById('currentPath');
    Elements.listingBody = document.getElementById('listingBody');
    Elements.fileCounter = document.getElementById('fileCounter');
    Elements.tickerContent = document.getElementById('tickerContent');
    Elements.tickerTape = document.getElementById('tickerTape');
    Elements.tapeStatus = document.getElementById('tapeStatus');
    Elements.tapeReelContainer = document.getElementById('tapeReelContainer');
    Elements.gaugeNeedle = document.getElementById('gaugeNeedle');
    Elements.gaugeValue = document.getElementById('gaugeValue');
    Elements.rotaryDial = document.getElementById('rotaryDial');
    Elements.rotaryPointer = document.getElementById('rotaryPointer');
    Elements.rotaryReadout = document.getElementById('rotaryReadout');
    Elements.storageFill = document.getElementById('storageFill');
    Elements.storageUsed = document.getElementById('storageUsed');
    Elements.seekProgress = document.getElementById('seekProgress');
    Elements.seekHead = document.getElementById('seekHead');
    Elements.seekCounter = document.getElementById('seekCounter');
    Elements.modalOverlay = document.getElementById('modalOverlay');
    Elements.modalTitle = document.getElementById('modalTitle');
    Elements.modalBody = document.getElementById('modalBody');
    Elements.modalClose = document.getElementById('modalClose');
    Elements.modalConfirm = document.getElementById('modalConfirm');
    Elements.modalCancel = document.getElementById('modalCancel');
    
    // File info elements
    Elements.infoName = document.getElementById('infoName');
    Elements.infoType = document.getElementById('infoType');
    Elements.infoSize = document.getElementById('infoSize');
    Elements.infoCreated = document.getElementById('infoCreated');
    Elements.infoModified = document.getElementById('infoModified');
    Elements.infoPerms = document.getElementById('infoPerms');
    
    // Indicator lights
    Elements.powerLight = document.getElementById('powerLight');
    Elements.cpuLight = document.getElementById('cpuLight');
    Elements.tapeLight = document.getElementById('tapeLight');
    Elements.discLight = document.getElementById('discLight');
    
    // VU bars
    Elements.vuBars = [];
    for (let i = 1; i <= 8; i++) {
        Elements.vuBars.push(document.getElementById('vuBar' + i));
    }
}

// === Boot Sequence ===
async function runBootSequence() {
    addLogEntry('SYSTEM', 'Initiating cold boot sequence...');
    
    // Power on effect
    Elements.powerLight.classList.add('active');
    
    let progress = 0;
    const progressStep = 100 / BootMessages.length;
    
    for (let i = 0; i < BootMessages.length; i++) {
        await sleep(80 + Math.random() * 60);
        
        Elements.bootText.textContent += BootMessages[i] + '\n';
        Elements.bootText.scrollTop = Elements.bootText.scrollHeight;
        
        progress += progressStep;
        Elements.bootProgressBar.style.width = progress + '%';
        
        // Activate lights during boot
        if (i === 10) Elements.cpuLight.classList.add('active');
        if (i === 15) Elements.tapeLight.classList.add('active');
        if (i === 20) Elements.discLight.classList.add('active');
    }
    
    await sleep(800);
    
    // Hide startup overlay
    Elements.startupOverlay.classList.add('hidden');
    SystemState.booted = true;
    
    // Initialize all systems
    initializeSystems();
    addLogEntry('SYSTEM', 'Boot sequence complete. All systems nominal.');
}

// === Initialize All Systems ===
function initializeSystems() {
    startClock();
    startVUMeter();
    startGaugeAnimation();
    renderFileListing();
    setupEventListeners();
    startProcessMonitor();
    startMemoryMonitor();
    animateStorageGauge();
    
    addLogEntry('INFO', 'File manager initialized.');
    addLogEntry('INFO', 'Current directory: ' + SystemState.currentPath);
}

// === Clock ===
function startClock() {
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        Elements.clockDigits.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// === VU Meter Animation ===
function startVUMeter() {
    function animateVU() {
        Elements.vuBars.forEach((bar, index) => {
            const baseHeight = 20 + Math.random() * 60;
            const variation = Math.sin(Date.now() / (200 + index * 50)) * 15;
            const height = Math.min(95, Math.max(10, baseHeight + variation));
            bar.style.height = height + '%';
        });
        requestAnimationFrame(animateVU);
    }
    animateVU();
}

// === Analog Gauge Animation ===
function startGaugeAnimation() {
    let targetValue = 0;
    let currentValue = 0;
    
    function updateGauge() {
        // Randomly change target
        if (Math.random() < 0.02) {
            targetValue = Math.random() * 100;
        }
        
        // Smooth interpolation
        currentValue += (targetValue - currentValue) * 0.05;
        
        // Update needle rotation (-90deg to 90deg)
        const rotation = -90 + (currentValue * 1.8);
        Elements.gaugeNeedle.style.transform = `rotate(${rotation}deg)`;
        
        // Update readout
        Elements.gaugeValue.textContent = Math.round(currentValue * 10);
        
        requestAnimationFrame(updateGauge);
    }
    updateGauge();
}

// === Rotary Dial Navigation ===
function setupRotaryDial() {
    const directories = Object.keys(FileSystem).filter(p => p.split('/').length === 2);
    const dial = Elements.rotaryDial;
    
    dial.addEventListener('click', (e) => {
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const degrees = (angle * 180 / Math.PI + 90 + 360) % 360;
        
        // Map angle to directory index
        const index = Math.floor(degrees / 60) % 6;
        const selectedDir = directories[index];
        
        if (selectedDir && FileSystem[selectedDir]) {
            SystemState.rotaryPosition = index;
            SystemState.currentPath = selectedDir;
            
            // Update visual
            Elements.rotaryPointer.style.transform = `translateX(-50%) rotate(${index * 60 - 150}deg)`;
            Elements.rotaryReadout.textContent = selectedDir;
            Elements.currentPath.textContent = selectedDir;
            
            // Update notch highlighting
            document.querySelectorAll('.rotary-notch').forEach((n, i) => {
                n.classList.toggle('active', i === index);
            });
            
            // Render new directory
            renderFileListing();
            animateTapeOperation();
            
            addLogEntry('INFO', 'Directory changed to: ' + selectedDir);
        }
    });
}

// === Toggle Switches ===
function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentState = parseInt(toggle.dataset.state);
            const newState = currentState === 0 ? 1 : 0;
            toggle.dataset.state = newState;
            
            // Play click sound effect (visual feedback)
            toggle.style.transform = 'scale(0.95)';
            setTimeout(() => toggle.style.transform = '', 100);
            
            // Handle specific toggles
            const id = toggle.id;
            
            if (id === 'togglePhosphor') {
                toggleTheme();
            } else if (id === 'toggleScanlines') {
                toggleScanlines(newState === 1);
            } else if (id === 'toggleBloom') {
                toggleBloom(newState === 1);
            } else if (id === 'toggleCurvature') {
                toggleCurvature(newState === 1);
            }
            
            addLogEntry('INFO', `${id.replace('toggle', '')} set to ${newState === 1 ? 'ON' : 'OFF'}`);
        });
    });
}

// === Theme Toggle ===
function toggleTheme() {
    SystemState.theme = SystemState.theme === 'amber' ? 'green' : 'amber';
    document.body.classList.toggle('theme-green', SystemState.theme === 'green');
    addLogEntry('SYSTEM', `Phosphor mode: ${SystemState.theme.toUpperCase()}`);
}

// === CRT Effect Toggles ===
function toggleScanlines(enabled) {
    SystemState.scanlines = enabled;
    document.querySelector('.scanlines').classList.toggle('hidden', !enabled);
}

function toggleBloom(enabled) {
    SystemState.bloom = enabled;
    document.querySelector('.phosphor-bloom').classList.toggle('hidden', !enabled);
}

function toggleCurvature(enabled) {
    SystemState.curvature = enabled;
    Elements.crtScreen.classList.toggle('curved', enabled);
}

// === File Listing ===
function renderFileListing() {
    const files = FileSystem[SystemState.currentPath] || [];
    Elements.listingBody.innerHTML = '';
    
    files.forEach((file, index) => {
        const entry = document.createElement('div');
        entry.className = 'file-entry';
        entry.dataset.index = index;
        
        const typeIcon = getTypeIcon(file.type);
        
        entry.innerHTML = `
            <span class="file-type-icon ${file.type}">${typeIcon}</span>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${formatSize(file.size)}</span>
            <span class="file-date">${file.date}</span>
            <span class="file-perm">${file.perm}</span>
        `;
        
        entry.addEventListener('click', () => selectFile(index, entry));
        entry.addEventListener('dblclick', () => openFile(file));
        
        Elements.listingBody.appendChild(entry);
    });
    
    SystemState.selectedFile = null;
    updateFileInfo(null);
}

function getTypeIcon(type) {
    const icons = {
        'dir': '◫',
        'exe': '▶',
        'sys': '◈',
        'dat': '▤',
        'txt': '▤',
        'log': '▤',
        'cfg': '⚙'
    };
    return icons[type] || '▤';
}

function formatSize(bytes) {
    if (bytes === 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function selectFile(index, element) {
    // Deselect previous
    document.querySelectorAll('.file-entry').forEach(e => e.classList.remove('selected'));
    
    // Select new
    element.classList.add('selected');
    
    const files = FileSystem[SystemState.currentPath] || [];
    SystemState.selectedFile = files[index];
    
    updateFileInfo(SystemState.selectedFile);
    incrementFileCounter();
    
    addLogEntry('INFO', `Selected: ${SystemState.selectedFile.name}`);
}

function updateFileInfo(file) {
    if (!file) {
        Elements.infoName.textContent = '—';
        Elements.infoType.textContent = '—';
        Elements.infoSize.textContent = '—';
        Elements.infoCreated.textContent = '—';
        Elements.infoModified.textContent = '—';
        Elements.infoPerms.textContent = '—';
        return;
    }
    
    Elements.infoName.textContent = file.name;
    Elements.infoType.textContent = file.type.toUpperCase() + ' FILE';
    Elements.infoSize.textContent = formatSize(file.size);
    Elements.infoCreated.textContent = file.date;
    Elements.infoModified.textContent = file.date;
    Elements.infoPerms.textContent = file.perm;
}

function openFile(file) {
    if (file.type === 'dir') {
        const newPath = SystemState.currentPath === '/' 
            ? '/' + file.name 
            : SystemState.currentPath + '/' + file.name;
        
        if (FileSystem[newPath]) {
            SystemState.currentPath = newPath;
            Elements.currentPath.textContent = newPath;
            renderFileListing();
            animateTapeOperation();
            addLogEntry('INFO', `Opened directory: ${file.name}`);
        }
    } else {
        showModal('FILE VIEWER', `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 2rem; margin-bottom: 15px;">▤</div>
                <div style="color: var(--phosphor-bright); margin-bottom: 10px;">${file.name}</div>
                <div style="color: var(--text-dim); font-size: 0.7rem;">
                    Type: ${file.type.toUpperCase()}<br>
                    Size: ${formatSize(file.size)}<br>
                    <br>
                    [FILE CONTENT WOULD BE DISPLAYED HERE]
                </div>
            </div>
        `);
    }
}

// === File Counter ===
function incrementFileCounter() {
    SystemState.fileCounter++;
    const digits = String(SystemState.fileCounter).padStart(5, '0').split('');
    const counterDigits = Elements.fileCounter.querySelectorAll('.counter-digit');
    
    counterDigits.forEach((digit, index) => {
        const newValue = digits[index];
        if (digit.textContent !== newValue) {
            digit.classList.add('rolling');
            setTimeout(() => {
                digit.textContent = newValue;
                digit.classList.remove('rolling');
            }, 150);
        }
    });
}

// === Tape Animation ===
function animateTapeOperation() {
    const reels = Elements.tapeReelContainer.querySelectorAll('.tape-reel');
    const leftReel = reels[0];
    const rightReel = reels[1];
    
    // Start spinning
    leftReel.classList.add('spinning');
    rightReel.classList.add('spinning', 'reverse');
    Elements.tapeStatus.textContent = 'READING...';
    Elements.tapeStatus.classList.add('active');
    Elements.tapeLight.classList.add('active');
    
    // Animate seek bar
    animateSeekBar();
    
    // Stop after delay
    setTimeout(() => {
        leftReel.classList.remove('spinning');
        rightReel.classList.remove('spinning', 'reverse');
        Elements.tapeStatus.textContent = 'STANDBY';
        Elements.tapeStatus.classList.remove('active');
        Elements.tapeLight.classList.remove('active');
    }, 2000);
}

function animateSeekBar() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        if (progress > 100) {
            clearInterval(interval);
            progress = 0;
        }
        Elements.seekProgress.style.width = progress + '%';
        Elements.seekHead.style.left = progress + '%';
        Elements.seekCounter.textContent = String(Math.floor(progress * 99)).padStart(4, '0');
    }, 40);
}

// === Logging System ===
function addLogEntry(type, message) {
    if (SystemState.logPaused) return;
    
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type.toLowerCase()}`;
    entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
    
    Elements.tickerContent.appendChild(entry);
    
    // Auto-scroll
    Elements.tickerTape.scrollTop = Elements.tickerTape.scrollHeight;
    
    // Limit log entries
    while (Elements.tickerContent.children.length > 100) {
        Elements.tickerContent.removeChild(Elements.tickerContent.firstChild);
    }
}

// === Process Monitor ===
function startProcessMonitor() {
    const processStates = ['RUN', 'IDLE', 'WAIT'];
    
    setInterval(() => {
        const entries = document.querySelectorAll('.process-entry');
        entries.forEach(entry => {
            const stateEl = entry.querySelector('.proc-state');
            if (Math.random() < 0.1) {
                const newState = processStates[Math.floor(Math.random() * processStates.length)];
                stateEl.textContent = newState;
                stateEl.className = 'proc-state ' + newState.toLowerCase();
            }
        });
    }, 2000);
}

// === Memory Monitor ===
function startMemoryMonitor() {
    setInterval(() => {
        const mem = 2000 + Math.floor(Math.random() * 2000);
        Elements.memUsage.textContent = String(mem).padStart(5, '0');
        
        const load = (0.2 + Math.random() * 0.6).toFixed(2);
        Elements.loadAvg.textContent = load;
    }, 3000);
}

// === Storage Gauge Animation ===
function animateStorageGauge() {
    let targetPercent = 39;
    let currentPercent = 0;
    
    function animate() {
        currentPercent += (targetPercent - currentPercent) * 0.1;
        Elements.storageFill.style.width = currentPercent + '%';
        
        if (Math.abs(currentPercent - targetPercent) > 0.1) {
            requestAnimationFrame(animate);
        }
    }
    
    // Slowly increase storage usage
    setInterval(() => {
        targetPercent = Math.min(85, targetPercent + Math.random() * 0.5);
        Elements.storageUsed.textContent = (targetPercent * 1.2).toFixed(1);
        animate();
    }, 10000);
    
    animate();
}

// === Modal System ===
function showModal(title, content, onConfirm = null) {
    Elements.modalTitle.textContent = title;
    Elements.modalBody.innerHTML = content;
    Elements.modalOverlay.classList.add('active');
    
    // Setup confirm handler
    Elements.modalConfirm.onclick = () => {
        if (onConfirm) onConfirm();
        hideModal();
    };
}

function hideModal() {
    Elements.modalOverlay.classList.remove('active');
}

// === Event Listeners ===
function setupEventListeners() {
    // Rotary dial
    setupRotaryDial();
    
    // Toggle switches
    setupToggleSwitches();
    
    // File manager buttons
    document.getElementById('btnParent').addEventListener('click', () => {
        const parts = SystemState.currentPath.split('/').filter(Boolean);
        if (parts.length > 0) {
            parts.pop();
            SystemState.currentPath = '/' + parts.join('/') || '/';
            Elements.currentPath.textContent = SystemState.currentPath;
            renderFileListing();
            animateTapeOperation();
            addLogEntry('INFO', 'Navigated to parent directory.');
        }
    });
    
    document.getElementById('btnRefresh').addEventListener('click', () => {
        renderFileListing();
        animateTapeOperation();
        addLogEntry('INFO', 'Directory listing refreshed.');
    });
    
    document.getElementById('btnSort').addEventListener('click', () => {
        const files = FileSystem[SystemState.currentPath];
        if (files) {
            files.sort((a, b) => a.name.localeCompare(b.name));
            renderFileListing();
            addLogEntry('INFO', 'Directory sorted by name.');
        }
    });
    
    // Action buttons
    document.getElementById('btnOpen').addEventListener('click', () => {
        if (SystemState.selectedFile) {
            openFile(SystemState.selectedFile);
        } else {
            addLogEntry('WARNING', 'No file selected.');
        }
    });
    
    document.getElementById('btnCopy').addEventListener('click', () => {
        if (SystemState.selectedFile) {
            showModal('COPY FILE', `
                <p>Copy "${SystemState.selectedFile.name}" to destination?</p>
                <p style="color: var(--text-dim); margin-top: 10px; font-size: 0.7rem;">
                    Destination: /TMP/COPY_${SystemState.selectedFile.name}
                </p>
            `, () => {
                animateTapeOperation();
                addLogEntry('SUCCESS', `Copied: ${SystemState.selectedFile.name}`);
            });
        } else {
            addLogEntry('WARNING', 'No file selected for copy operation.');
        }
    });
    
    document.getElementById('btnMove').addEventListener('click', () => {
        if (SystemState.selectedFile) {
            showModal('MOVE FILE', `
                <p>Move "${SystemState.selectedFile.name}" to another directory?</p>
                <p style="color: var(--text-dim); margin-top: 10px; font-size: 0.7rem;">
                    Select destination from rotary dial.
                </p>
            `, () => {
                animateTapeOperation();
                addLogEntry('SUCCESS', `Moved: ${SystemState.selectedFile.name}`);
            });
        } else {
            addLogEntry('WARNING', 'No file selected for move operation.');
        }
    });
    
    document.getElementById('btnDelete').addEventListener('click', () => {
        if (SystemState.selectedFile) {
            showModal('⚠ DELETE FILE', `
                <p style="color: var(--danger-color);">WARNING: This action cannot be undone!</p>
                <p style="margin-top: 10px;">Delete "${SystemState.selectedFile.name}" permanently?</p>
            `, () => {
                const files = FileSystem[SystemState.currentPath];
                const index = files.indexOf(SystemState.selectedFile);
                if (index > -1) {
                    files.splice(index, 1);
                    renderFileListing();
                    animateTapeOperation();
                    addLogEntry('ERROR', `Deleted: ${SystemState.selectedFile.name}`);
                }
            });
        } else {
            addLogEntry('WARNING', 'No file selected for deletion.');
        }
    });
    
    document.getElementById('btnInfo').addEventListener('click', () => {
        if (SystemState.selectedFile) {
            const f = SystemState.selectedFile;
            showModal('FILE INFORMATION', `
                <div style="font-family: var(--font-mono);">
                    <div style="margin-bottom: 15px;">
                        <span style="color: var(--text-dim);">NAME:</span>
                        <span style="color: var(--phosphor-bright);">${f.name}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span style="color: var(--text-dim);">TYPE:</span>
                        <span>${f.type.toUpperCase()} FILE</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span style="color: var(--text-dim);">SIZE:</span>
                        <span>${formatSize(f.size)}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span style="color: var(--text-dim);">CREATED:</span>
                        <span>${f.date}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span style="color: var(--text-dim);">PERMISSIONS:</span>
                        <span>${f.perm}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span style="color: var(--text-dim);">LOCATION:</span>
                        <span>${SystemState.currentPath}</span>
                    </div>
                </div>
            `);
        } else {
            addLogEntry('WARNING', 'No file selected for info.');
        }
    });
    
    // Quick action dials
    document.getElementById('btnSysInfo').addEventListener('click', () => {
        showModal('SYSTEM INFORMATION', `
            <div style="font-family: var(--font-mono); font-size: 0.75rem;">
                <div style="margin-bottom: 10px;">
                    <span style="color: var(--phosphor-bright);">OS/73 PROMETHEUS v4.2.1</span>
                </div>
                <div style="color: var(--text-dim); line-height: 1.8;">
                    MODEL: 7300 ANALOG COMPUTING SYSTEM<br>
                    MEMORY: 32 KB CORE<br>
                    STORAGE: 120 MB DISC<br>
                    TAPE: REEL-TO-REEL 9-TRACK<br>
                    DISPLAY: CRT PHOSPHOR<br>
                    <br>
                    MANUFACTURER: PROMETHEUS SYSTEMS<br>
                    YEAR: 1973
                </div>
            </div>
        `);
        addLogEntry('INFO', 'System information displayed.');
    });
    
    document.getElementById('btnBackup').addEventListener('click', () => {
        showModal('SYSTEM BACKUP', `
            <p>Initiate full system backup to tape?</p>
            <p style="color: var(--text-dim); margin-top: 10px; font-size: 0.7rem;">
                Estimated time: 47 minutes<br>
                Tape required: 1x 2400ft reel
            </p>
        `, () => {
            animateTapeOperation();
            addLogEntry('SYSTEM', 'Backup initiated. Writing to tape...');
            setTimeout(() => {
                addLogEntry('SUCCESS', 'Backup complete. 47.3 MB written.');
            }, 3000);
        });
    });
    
    document.getElementById('btnFormat').addEventListener('click', () => {
        showModal('⚠ FORMAT DISC', `
            <p style="color: var(--danger-color);">DANGER: ALL DATA WILL BE LOST!</p>
            <p style="margin-top: 10px;">Format disc 0 (120 MB)?</p>
            <p style="color: var(--text-dim); margin-top: 10px; font-size: 0.7rem;">
                This operation is irreversible.
            </p>
        `, () => {
            addLogEntry('ERROR', 'Format operation requires supervisor clearance.');
        });
    });
    
    document.getElementById('btnReboot').addEventListener('click', () => {
        showModal('SYSTEM REBOOT', `
            <p>Reboot the system?</p>
            <p style="color: var(--text-dim); margin-top: 10px; font-size: 0.7rem;">
                All unsaved data will be lost.
            </p>
        `, () => {
            addLogEntry('SYSTEM', 'Rebooting system...');
            Elements.startupOverlay.classList.remove('hidden');
            Elements.bootText.textContent = '';
            Elements.bootProgressBar.style.width = '0%';
            SystemState.booted = false;
            setTimeout(() => runBootSequence(), 500);
        });
    });
    
    // Log controls
    document.getElementById('btnClearLog').addEventListener('click', () => {
        Elements.tickerContent.innerHTML = '';
        addLogEntry('SYSTEM', 'Log cleared.');
    });
    
    document.getElementById('btnPauseLog').addEventListener('click', (e) => {
        SystemState.logPaused = !SystemState.logPaused;
        e.target.textContent = SystemState.logPaused ? '▶' : '⏸';
        if (!SystemState.logPaused) {
            addLogEntry('SYSTEM', 'Log resumed.');
        }
    });
    
    // Modal close
    Elements.modalClose.addEventListener('click', hideModal);
    Elements.modalCancel.addEventListener('click', hideModal);
    Elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === Elements.modalOverlay) hideModal();
    });
    
    // Knob interactions
    setupKnobs();
    
    // Seek bar interaction
    setupSeekBar();
}

// === Knob Controls ===
function setupKnobs() {
    const brightnessKnob = document.getElementById('brightnessKnob');
    const contrastKnob = document.getElementById('contrastKnob');
    const focusKnob = document.getElementById('focusKnob');
    
    let activeKnob = null;
    let startY = 0;
    let startValue = 0;
    
    function handleKnobStart(e, knob, property) {
        activeKnob = { knob, property };
        startY = e.clientY || e.touches[0].clientY;
        startValue = SystemState[property];
        e.preventDefault();
    }
    
    function handleKnobMove(e) {
        if (!activeKnob) return;
        
        const currentY = e.clientY || (e.touches && e.touches[0].clientY);
        const delta = (startY - currentY) / 100;
        const newValue = Math.max(0.3, Math.min(1.5, startValue + delta));
        
        SystemState[activeKnob.property] = newValue;
        
        // Update CSS variable
        document.documentElement.style.setProperty('--' + activeKnob.property, newValue);
        
        // Rotate knob indicator
        const rotation = (newValue - 0.9) * 180;
        activeKnob.knob.querySelector('.knob-indicator').style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        e.preventDefault();
    }
    
    function handleKnobEnd() {
        activeKnob = null;
    }
    
    brightnessKnob.addEventListener('mousedown', (e) => handleKnobStart(e, brightnessKnob, 'brightness'));
    contrastKnob.addEventListener('mousedown', (e) => handleKnobStart(e, contrastKnob, 'contrast'));
    focusKnob.addEventListener('mousedown', (e) => handleKnobStart(e, focusKnob, 'focus'));
    
    document.addEventListener('mousemove', handleKnobMove);
    document.addEventListener('mouseup', handleKnobEnd);
    
    // Touch support
    brightnessKnob.addEventListener('touchstart', (e) => handleKnobStart(e, brightnessKnob, 'brightness'));
    contrastKnob.addEventListener('touchstart', (e) => handleKnobStart(e, contrastKnob, 'contrast'));
    focusKnob.addEventListener('touchstart', (e) => handleKnobStart(e, focusKnob, 'focus'));
    
    document.addEventListener('touchmove', handleKnobMove);
    document.addEventListener('touchend', handleKnobEnd);
}

// === Seek Bar Interaction ===
function setupSeekBar() {
    const track = document.querySelector('.seek-track');
    let isDragging = false;
    
    function updateSeek(e) {
        const rect = track.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        Elements.seekProgress.style.width = percent + '%';
        Elements.seekHead.style.left = percent + '%';
        Elements.seekCounter.textContent = String(Math.floor(percent * 99)).padStart(4, '0');
    }
    
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSeek(e);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSeek(e);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSeek(e);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) updateSeek(e);
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// === Utility Functions ===
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// === Keyboard Shortcuts ===
document.addEventListener('keydown', (e) => {
    if (!SystemState.booted) return;
    
    switch(e.key) {
        case 'Enter':
            if (SystemState.selectedFile) {
                openFile(SystemState.selectedFile);
            }
            break;
        case 'Backspace':
            document.getElementById('btnParent').click();
            break;
        case 'Delete':
            document.getElementById('btnDelete').click();
            break;
        case 'Escape':
            hideModal();
            break;
        case 'g':
            toggleTheme();
            break;
    }
});

// === Random System Events ===
setInterval(() => {
    if (!SystemState.booted) return;
    
    const events = [
        { type: 'INFO', messages: ['Memory defragmentation complete.', 'Cache flushed.', 'Tape tension nominal.'] },
        { type: 'WARNING', messages: ['Sector retry on disc 0.', 'Memory pressure detected.', 'Tape nearing end of reel.'] },
        { type: 'SYSTEM', messages: ['System clock synchronized.', 'Process scheduler tick.', 'I/O buffer cleared.'] }
    ];
    
    if (Math.random() < 0.3) {
        const event = events[Math.floor(Math.random() * events.length)];
        const message = event.messages[Math.floor(Math.random() * event.messages.length)];
        addLogEntry(event.type, message);
    }
}, 8000);

// === Initial Log Messages ===
setTimeout(() => {
    if (SystemState.booted) {
        addLogEntry('INFO', 'Tip: Use rotary dial to navigate directories.');
        addLogEntry('INFO', 'Press G to toggle phosphor color.');
        addLogEntry('INFO', 'Double-click directories to open them.');
    }
}, 5000);
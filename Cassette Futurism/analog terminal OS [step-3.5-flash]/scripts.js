/* ==========================================
   QUANTUM-70 OS v3.2 - JavaScript Engine
   Bringing the retro-futuristic interface to life
   ========================================== */

// ==========================================
// File System Data & State
// ==========================================
const fileSystem = {
    '/': {
        type: 'directory',
        children: ['USERS', 'SYSTEM', 'PROGRAMS'],
        size: 0,
        date: '1977-01-01 00:00'
    },
    '/USERS': {
        type: 'directory',
        children: ['ADMIN', 'GUEST', 'OPERATOR'],
        size: 0,
        date: '1977-11-20 09:15'
    },
    '/USERS/ADMIN': {
        type: 'directory',
        children: ['WORK', 'PRIVATE', 'SCRIPTS'],
        size: 0,
        date: '1977-11-24 14:30'
    },
    '/USERS/ADMIN/WORK': {
        type: 'directory',
        children: [
            'PROJECT_ALPHA.txt',
            'BUDGET_1978.xls',
            'EMPLOYEE_LIST.db',
            'MEMO_1124.doc',
            'ANALYSIS_DATA.dat',
            'old_backup'
        ],
        size: 0,
        date: '1977-11-24 18:45'
    },
    '/USERS/ADMIN/WORK/PROJECT_ALPHA.txt': {
        type: 'file',
        extension: 'txt',
        size: 14,
        date: '1977-11-24 16:20'
    },
    '/USERS/ADMIN/WORK/BUDGET_1978.xls': {
        type: 'file',
        extension: 'xls',
        size: 128,
        date: '1977-11-23 11:30'
    },
    '/USERS/ADMIN/WORK/EMPLOYEE_LIST.db': {
        type: 'file',
        extension: 'db',
        size: 256,
        date: '1977-11-22 14:15'
    },
    '/USERS/ADMIN/WORK/MEMO_1124.doc': {
        type: 'file',
        extension: 'doc',
        size: 8,
        date: '1977-11-24 10:00'
    },
    '/USERS/ADMIN/WORK/ANALYSIS_DATA.dat': {
        type: 'file',
        extension: 'dat',
        size: 1024,
        date: '1977-11-21 09:45'
    },
    '/USERS/ADMIN/WORK/old_backup': {
        type: 'directory',
        children: [
            'backup1.bak',
            'backup2.bak',
            'archive'
        ],
        size: 0,
        date: '1977-10-15 08:00'
    },
    '/USERS/ADMIN/WORK/old_backup/backup1.bak': {
        type: 'file',
        extension: 'bak',
        size: 512,
        date: '1977-09-30 16:20'
    },
    '/USERS/ADMIN/WORK/old_backup/backup2.bak': {
        type: 'file',
        extension: 'bak',
        size: 512,
        date: '1977-10-01 10:15'
    },
    '/USERS/ADMIN/WORK/old_backup/archive': {
        type: 'directory',
        children: [],
        size: 0,
        date: '1977-08-20 13:40'
    },
    '/USERS/GUEST': {
        type: 'directory',
        children: ['WELCOME.txt'],
        size: 0,
        date: '1977-11-01 08:00'
    },
    '/USERS/GUEST/WELCOME.txt': {
        type: 'file',
        extension: 'txt',
        size: 2,
        date: '1977-11-01 08:00'
    },
    '/USERS/OPERATOR': {
        type: 'directory',
        children: ['LOG', 'MANUAL'],
        size: 0,
        date: '1977-11-15 07:30'
    },
    '/USERS/OPERATOR/LOG': {
        type: 'directory',
        children: ['syslog'],
        size: 0,
        date: '1977-11-24 06:00'
    },
    '/USERS/OPERATOR/LOG/syslog': {
        type: 'file',
        extension: 'log',
        size: 32,
        date: '1977-11-24 23:45'
    },
    '/USERS/OPERATOR/MANUAL': {
        type: 'directory',
        children: ['OPERATIONS.pdf', 'QUICK_REFERENCE.txt'],
        size: 0,
        date: '1977-10-01 10:00'
    },
    '/USERS/OPERATOR/MANUAL/OPERATIONS.pdf': {
        type: 'file',
        extension: 'pdf',
        size: 2048,
        date: '1977-09-15 14:30'
    },
    '/USERS/OPERATOR/MANUAL/QUICK_REFERENCE.txt': {
        type: 'file',
        extension: 'txt',
        size: 6,
        date: '1977-10-01 10:05'
    },
    '/SYSTEM': {
        type: 'directory',
        children: ['KERNEL', 'DRIVERS', 'CONFIG', 'BOOT'],
        size: 0,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/KERNEL': {
        type: 'directory',
        children: ['KRNL.SYS', 'KRNL.DLL', 'KRNL.HLP'],
        size: 0,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/KERNEL/KRNL.SYS': {
        type: 'file',
        extension: 'sys',
        size: 8192,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/KERNEL/KRNL.DLL': {
        type: 'file',
        extension: 'dll',
        size: 4096,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/KERNEL/KRNL.HLP': {
        type: 'file',
        extension: 'hlp',
        size: 512,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/DRIVERS': {
        type: 'directory',
        children: ['VIDEO.DRV', 'KEYBD.DRV', 'MOUSE.DRV', 'PRN.DRV'],
        size: 0,
        date: '1977-06-15 11:20'
    },
    '/SYSTEM/DRIVERS/VIDEO.DRV': {
        type: 'file',
        extension: 'drv',
        size: 2048,
        date: '1977-06-15 11:20'
    },
    '/SYSTEM/DRIVERS/KEYBD.DRV': {
        type: 'file',
        extension: 'drv',
        size: 1024,
        date: '1977-06-15 11:21'
    },
    '/SYSTEM/DRIVERS/MOUSE.DRV': {
        type: 'file',
        extension: 'drv',
        size: 512,
        date: '1977-06-15 11:22'
    },
    '/SYSTEM/DRIVERS/PRN.DRV': {
        type: 'file',
        extension: 'drv',
        size: 256,
        date: '1977-06-15 11:23'
    },
    '/SYSTEM/CONFIG': {
        type: 'directory',
        children: ['CONFIG.SYS', 'AUTOEXEC.BAT', 'QUANTUM.INI'],
        size: 0,
        date: '1977-11-01 09:00'
    },
    '/SYSTEM/CONFIG/CONFIG.SYS': {
        type: 'file',
        extension: 'sys',
        size: 1,
        date: '1977-11-01 09:00'
    },
    '/SYSTEM/CONFIG/AUTOEXEC.BAT': {
        type: 'file',
        extension: 'bat',
        size: 2,
        date: '1977-11-01 09:05'
    },
    '/SYSTEM/CONFIG/QUANTUM.INI': {
        type: 'file',
        extension: 'ini',
        size: 4,
        date: '1977-11-01 09:10'
    },
    '/SYSTEM/BOOT': {
        type: 'directory',
        children: ['BOOT.BIN', 'BOOT.LDR'],
        size: 0,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/BOOT/BOOT.BIN': {
        type: 'file',
        extension: 'bin',
        size: 512,
        date: '1977-01-01 00:00'
    },
    '/SYSTEM/BOOT/BOOT.LDR': {
        type: 'file',
        extension: 'ldr',
        size: 256,
        date: '1977-01-01 00:00'
    },
    '/PROGRAMS': {
        type: 'directory',
        children: ['EDITOR.EXE', 'CALC.EXE', 'TERMINAL.EXE', 'SYSUTIL.EXE'],
        size: 0,
        date: '1977-11-10 10:00'
    },
    '/PROGRAMS/EDITOR.EXE': {
        type: 'file',
        extension: 'exe',
        size: 8192,
        date: '1977-11-10 10:00'
    },
    '/PROGRAMS/CALC.EXE': {
        type: 'file',
        extension: 'exe',
        size: 2048,
        date: '1977-11-10 10:05'
    },
    '/PROGRAMS/TERMINAL.EXE': {
        type: 'file',
        extension: 'exe',
        size: 4096,
        date: '1977-11-10 10:10'
    },
    '/PROGRAMS/SYSUTIL.EXE': {
        type: 'file',
        extension: 'exe',
        size: 6144,
        date: '1977-11-10 10:15'
    }
};

// ==========================================
// Application State
// ==========================================
const state = {
    currentPath: '/USERS/ADMIN/WORK',
    selectedItems: new Set(),
    showHidden: false,
    readOnly: false,
    compressMode: false,
    dialPosition: 0, // 0-7 (N, NE, E, SE, S, SW, W, NW)
    tapeStatus: 'READY',
    isAnimating: false,
    phosphorMode: 'amber',
    systemMetrics: {
        cpu: 23,
        memory: 47,
        storage: 82
    },
    tickerMessages: [
        'SYSTEM INITIALIZED... QUANTUM-70 OS v3.2.1 READY',
        'ALL DEVICES ONLINE. TAPE DRIVER LOADED.',
        'MEMORY CHECK: 64KB TOTAL, 47KB AVAILABLE',
        'AUTO-SCHEDULER ACTIVE. 3 JOBS QUEUED.',
        'SECURITY LEVEL: STANDARD. NO BREACHES DETECTED.',
        'TAPE DRIVE: READY. INSERT MEDIA FOR ACCESS.',
        'NETWORK: DISCONNECTED (NO MODULE INSTALLED)',
        'PRINTER: ONLINE. QUEUE LENGTH: 0 PAGES',
        'BACKUP PROCESS COMPLETE. 124 FILES ARCHIVED.',
        'WARNING: STORAGE AT 82% CAPACITY. CONSIDER PURGE.',
        'SYSTEM CLOCK SYNCED WITH QUANTUM TIMING SIGNAL',
        'ALL SERVICES RUNNING NOMINALLY. NO ERRORS.',
        'MORNING DIAGNOSTICS: ALL SYSTEMS GREEN',
        'USER SESSION ACTIVE. TIME LIMIT: 4 HOURS REMAINING',
        'COMPRESSION ALGORITHM: LZ77-QUANTUM ACTIVE'
    ],
    tickerIndex: 0,
    logEntries: [
        { time: '23:47:12', message: 'System boot sequence completed', type: 'info' },
        { time: '23:47:10', message: 'Tape drive initialization', type: 'info' },
        { time: '23:47:08', message: 'File system check: 124 files, 15 directories', type: 'info' },
        { time: '23:47:05', message: 'Memory test: 64KB OK', type: 'info' },
        { time: '23:47:02', message: 'CPU self-test passed', type: 'info' },
        { time: '23:46:58', message: 'Power-on self test (POST) initiated', type: 'info' }
    ]
};

// ==========================================
// DOM Elements Cache
// ==========================================
const elements = {
    currentPath: document.getElementById('current-path'),
    fileList: document.getElementById('file-list'),
    selectedCount: document.querySelector('.selected-count'),
    totalSize: document.getElementById('total-size'),
    dial: document.getElementById('nav-dial'),
    dialValue: document.getElementById('dial-value'),
    tapeReelLeft: document.getElementById('tape-reel-left'),
    tapeReelRight: document.getElementById('tape-reel-right'),
    tapeStatus: document.getElementById('tape-status'),
    systemLog: document.getElementById('system-log'),
    tickerPaper: document.getElementById('ticker-paper'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalWindow: document.getElementById('modal-window'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    tapeAnimation: document.getElementById('tape-animation'),
    animFilename: document.getElementById('anim-filename'),
    animOperation: document.getElementById('anim-operation'),
    tapeProgress: document.getElementById('tape-progress'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    toggleSwitches: document.querySelectorAll('.toggle-switch'),
    chunkyButtons: document.querySelectorAll('.chunky-btn'),
    actionButtons: document.querySelectorAll('.action-btn'),
    consoleButtons: document.querySelectorAll('.console-btn'),
    cpuNeedle: document.getElementById('cpu-needle'),
    memoryNeedle: document.getElementById('memory-needle'),
    storageNeedle: document.getElementById('storage-needle'),
    cpuValue: document.getElementById('cpu-value'),
    memoryValue: document.getElementById('memory-value'),
    storageValue: document.getElementById('storage-value')
};

// ==========================================
// Utility Functions
// ==========================================
function formatSize(kb) {
    if (kb === 0) return '0 KB';
    if (kb < 1024) return `${kb} KB`;
    if (kb < 1048576) return `${(kb / 1024).toFixed(1)} MB`;
    return `${(kb / 1048576).toFixed(2)} GB`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
}

function formatTime(timeStr) {
    return timeStr;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().substr(0, 8);
}

function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================================
// File System Navigation
// ==========================================
function getDirectoryContents(path) {
    const dir = fileSystem[path];
    if (!dir || dir.type !== 'directory') {
        return [];
    }

    let items = [];
    
    // Add directories first
    dir.children.forEach(child => {
        const childPath = path === '/' ? `/${child}` : `${path}/${child}`;
        const childItem = fileSystem[childPath];
        if (childItem) {
            items.push({
                name: child,
                path: childPath,
                ...childItem
            });
        }
    });

    // Filter hidden files based on toggle
    if (!state.showHidden) {
        items = items.filter(item => !item.name.startsWith('.'));
    }

    // Sort: directories first, then files
    items.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
    });

    return items;
}

function navigateTo(path) {
    state.currentPath = path;
    state.selectedItems.clear();
    elements.currentPath.textContent = path;
    renderFileList();
    updateSelectionInfo();
    addLogEntry(`Navigated to ${path}`, 'info');
}

function getFileIcon(item) {
    if (item.type === 'directory') {
        return '📁';
    }
    
    const icons = {
        'txt': '📄',
        'doc': '📝',
        'xls': '📊',
        'dat': '💾',
        'db': '🗃️',
        'exe': '⚙️',
        'sys': '🔧',
        'drv': '🚗',
        'bat': '📜',
        'ini': '⚙️',
        'bin': '💿',
        'ldr': '📥',
        'hlp': '❓',
        'pdf': '📕',
        'bak': '📦',
        'log': '📋'
    };
    
    return icons[item.extension] || '📄';
}

function renderFileList() {
    const items = getDirectoryContents(state.currentPath);
    elements.fileList.innerHTML = '';
    
    items.forEach(item => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.dataset.path = item.path;
        fileElement.dataset.type = item.type;
        
        if (state.selectedItems.has(item.path)) {
            fileElement.classList.add('selected');
        }
        
        fileElement.innerHTML = `
            <div class="file-name">
                <span class="file-icon ${item.type}">${getFileIcon(item)}</span>
                <span>${item.name}</span>
            </div>
            <div class="file-size">${item.size > 0 ? formatSize(item.size) : ''}</div>
            <div class="file-date">${formatDate(item.date)}</div>
            <div class="file-type">${item.type === 'directory' ? 'DIR' : item.extension.toUpperCase()}</div>
        `;
        
        fileElement.addEventListener('click', () => handleFileClick(item));
        elements.fileList.appendChild(fileElement);
    });
}

function handleFileClick(item) {
    if (state.isAnimating) return;
    
    const path = item.path;
    
    if (item.type === 'directory') {
        // If already selected, deselect and stay; otherwise navigate
        if (state.selectedItems.has(path) && state.selectedItems.size === 1) {
            state.selectedItems.clear();
        } else {
            navigateTo(path);
        }
    } else {
        // Toggle selection
        if (state.selectedItems.has(path)) {
            state.selectedItems.delete(path);
        } else {
            if (!state.readOnly) {
                state.selectedItems.add(path);
            }
        }
    }
    
    renderFileList();
    updateSelectionInfo();
}

function updateSelectionInfo() {
    const count = state.selectedItems.size;
    elements.selectedCount.textContent = count;
    
    let totalSize = 0;
    state.selectedItems.forEach(path => {
        const item = fileSystem[path];
        if (item && item.size) {
            totalSize += item.size;
        }
    });
    elements.totalSize.textContent = totalSize;
}

// ==========================================
// File Operations
// ==========================================
function performOperation(action) {
    if (state.selectedItems.size === 0) {
        showModal('No Selection', 'Please select one or more items to perform this operation.');
        return;
    }
    
    if (state.readOnly && action !== 'copy') {
        showModal('Read-Only Mode', 'This operation is not allowed in read-only mode.');
        return;
    }
    
    const items = Array.from(state.selectedItems).map(path => fileSystem[path]).filter(Boolean);
    const filenames = items.map(item => item.name).join(', ');
    
    switch (action) {
        case 'copy':
            showTapeAnimation('COPY', items);
            simulateTapeOperation('COPY', items).then(() => {
                showModal('Copy Complete', `Successfully copied ${items.length} item(s) to clipboard.`);
                state.selectedItems.clear();
                renderFileList();
                updateSelectionInfo();
            });
            break;
            
        case 'delete':
            showModal('Confirm Delete', 
                `Are you sure you want to delete ${items.length} item(s)?<br><br>` +
                `Items: ${filenames}<br><br>` +
                `<strong>This operation cannot be undone.</strong>`,
                () => {
                    showTapeAnimation('DELETE', items);
                    simulateTapeOperation('DELETE', items).then(() => {
                        showModal('Delete Complete', `Successfully deleted ${items.length} item(s).`);
                        state.selectedItems.clear();
                        renderFileList();
                        updateSelectionInfo();
                        updateStorageMetric();
                    });
                }
            );
            break;
            
        case 'new':
            showModal('Create New Item', 
                '<div style="margin-bottom: 10px;">Enter filename:</div>' +
                '<input type="text" id="new-filename" style="width: 100%; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">' +
                '<div style="margin-top: 10px;">Select type:</div>' +
                '<select id="new-type" style="width: 100%; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">' +
                '<option value="file">File</option>' +
                '<option value="directory">Directory</option>' +
                '</select>',
                () => {
                    const filename = document.getElementById('new-filename').value.trim();
                    const type = document.getElementById('new-type').value;
                    
                    if (!filename) {
                        showModal('Error', 'Filename cannot be empty.');
                        return;
                    }
                    
                    const newPath = state.currentPath === '/' 
                        ? `/${filename}` 
                        : `${state.currentPath}/${filename}`;
                    
                    if (fileSystem[newPath]) {
                        showModal('Error', 'An item with that name already exists.');
                        return;
                    }
                    
                    const newItem = {
                        type: type,
                        size: type === 'file' ? randomInt(1, 100) : 0,
                        date: getCurrentDate() + ' ' + getCurrentTime().substr(0, 5),
                        extension: type === 'file' ? filename.split('.').pop() || 'txt' : null,
                        children: type === 'directory' ? [] : undefined
                    };
                    
                    fileSystem[newPath] = newItem;
                    
                    // Add to parent directory
                    const parentDir = fileSystem[state.currentPath];
                    if (parentDir && parentDir.type === 'directory') {
                        parentDir.children.push(filename);
                    }
                    
                    showTapeAnimation('CREATE', [newItem]);
                    simulateTapeOperation('CREATE', [newItem]).then(() => {
                        showModal('Create Complete', `Created ${type}: ${filename}`);
                        renderFileList();
                        updateStorageMetric();
                    });
                }
            );
            break;
    }
}

function simulateTapeOperation(operation, items) {
    return new Promise(resolve => {
        state.isAnimating = true;
        const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0);
        const duration = Math.max(2000, totalSize * 10); // At least 2 seconds
        
        elements.tapeAnimation.classList.add('active');
        elements.animOperation.textContent = operation + (items.length > 1 ? 'ING' : 'ING');
        elements.animFilename.textContent = items.length === 1 ? items[0].name : `${items.length} ITEMS`;
        elements.tapeProgress.style.width = '0%';
        
        let progress = 0;
        const interval = 50;
        const increment = (interval / duration) * 100;
        
        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    elements.tapeAnimation.classList.remove('active');
                    state.isAnimating = false;
                    resolve();
                }, 500);
            }
            elements.tapeProgress.style.width = progress + '%';
        }, interval);
    });
}

function showTapeAnimation(operation, items) {
    state.tapeStatus = operation.toUpperCase();
    elements.tapeStatus.textContent = state.tapeStatus;
    elements.tapeStatus.style.color = 'var(--accent-red)';
    
    // Start reels spinning
    elements.tapeReelLeft.classList.add('spinning');
    elements.tapeReelRight.classList.add('spinning');
    
    setTimeout(() => {
        elements.tapeStatus.style.color = 'var(--phosphor-primary)';
    }, 3000);
}

// ==========================================
// Modal Management
// ==========================================
function showModal(title, content, onConfirm = null) {
    elements.modalTitle.textContent = title;
    elements.modalContent.innerHTML = content;
    
    // Store confirm handler
    elements.modalOverlay.dataset.confirmHandler = onConfirm ? 'true' : 'false';
    
    elements.modalOverlay.classList.add('active');
    
    // Focus first input if exists
    setTimeout(() => {
        const input = elements.modalContent.querySelector('input');
        if (input) {
            input.focus();
            input.select();
        }
    }, 100);
}

function closeModal() {
    elements.modalOverlay.classList.remove('active');
}

// ==========================================
// Rotary Dial Navigation
// ==========================================
const dialDirections = [
    { angle: -90, label: 'N' },   // North
    { angle: -45, label: 'NE' }, // Northeast
    { angle: 0, label: 'E' },    // East
    { angle: 45, label: 'SE' },  // Southeast
    { angle: 90, label: 'S' },   // South
    { angle: 135, label: 'SW' }, // Southwest
    { angle: 180, label: 'W' },  // West
    { angle: -135, label: 'NW' } // Northwest
];

let isDraggingDial = false;
let dialStartAngle = 0;
let currentDialAngle = -90; // Start pointing up (North)

function getDialAngle(clientX, clientY) {
    const rect = elements.dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
}

function updateDialVisuals() {
    const knob = elements.dial.querySelector('.dial-knob');
    const indicator = elements.dial.querySelector('.dial-indicator');
    
    // Rotate the entire knob assembly
    knob.style.transform = `translate(-50%, -50%) rotate(${currentDialAngle}deg)`;
    
    // Update displayed value
    const directionIndex = Math.round(((currentDialAngle + 180) % 360) / 45);
    const direction = dialDirections[directionIndex];
    elements.dialValue.textContent = direction.label;
    
    // Store current position in state
    state.dialPosition = directionIndex;
}

function handleDialStart(e) {
    if (state.isAnimating) return;
    isDraggingDial = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dialStartAngle = getDialAngle(clientX, clientY);
    elements.dial.style.cursor = 'grabbing';
    e.preventDefault();
}

function handleDialMove(e) {
    if (!isDraggingDial) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const newAngle = getDialAngle(clientX, clientY);
    const deltaAngle = newAngle - dialStartAngle;
    
    currentDialAngle = (currentDialAngle + deltaAngle + 360) % 360;
    dialStartAngle = newAngle;
    
    updateDialVisuals();
    handleDialNavigation();
    e.preventDefault();
}

function handleDialEnd() {
    isDraggingDial = false;
    elements.dial.style.cursor = 'grab';
}

function handleDialNavigation() {
    const direction = dialDirections[state.dialPosition].label;
    const currentPath = state.currentPath;
    const pathParts = currentPath.split('/').filter(p => p);
    
    switch (direction) {
        case 'N':
            // Go up one directory level
            if (pathParts.length > 1) {
                pathParts.pop();
                const newPath = '/' + pathParts.join('/');
                navigateTo(newPath);
            }
            break;
        case 'S':
            // Enter first subdirectory if exists
            const currentDir = fileSystem[currentPath];
            if (currentDir && currentDir.children.length > 0) {
                const firstChild = currentDir.children[0];
                const childPath = currentPath === '/' ? `/${firstChild}` : `${currentPath}/${firstChild}`;
                if (fileSystem[childPath] && fileSystem[childPath].type === 'directory') {
                    navigateTo(childPath);
                }
            }
            break;
        case 'E':
            // Next sibling directory
            if (pathParts.length > 0) {
                const parentPath = '/' + pathParts.slice(0, -1).join('/');
                const parent = fileSystem[parentPath];
                if (parent) {
                    const currentName = pathParts[pathParts.length - 1];
                    const siblings = parent.children.filter(name => {
                        const childPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
                        return fileSystem[childPath] && fileSystem[childPath].type === 'directory';
                    });
                    const currentIndex = siblings.indexOf(currentName);
                    if (currentIndex >= 0 && currentIndex < siblings.length - 1) {
                        const nextSibling = siblings[currentIndex + 1];
                        const newPath = parentPath === '/' ? `/${nextSibling}` : `${parentPath}/${nextSibling}`;
                        navigateTo(newPath);
                    }
                }
            }
            break;
        case 'W':
            // Previous sibling directory
            if (pathParts.length > 0) {
                const parentPath = '/' + pathParts.slice(0, -1).join('/');
                const parent = fileSystem[parentPath];
                if (parent) {
                    const currentName = pathParts[pathParts.length - 1];
                    const siblings = parent.children.filter(name => {
                        const childPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
                        return fileSystem[childPath] && fileSystem[childPath].type === 'directory';
                    });
                    const currentIndex = siblings.indexOf(currentName);
                    if (currentIndex > 0) {
                        const prevSibling = siblings[currentIndex - 1];
                        const newPath = parentPath === '/' ? `/${prevSibling}` : `${parentPath}/${prevSibling}`;
                        navigateTo(newPath);
                    }
                }
            }
            break;
        // NE, SE, NW, SW could be used for other navigation patterns
    }
}

// ==========================================
// Analog Gauges
// ==========================================
function updateGauges() {
    // Animate needles to current values
    const cpuAngle = -135 + (state.systemMetrics.cpu / 100) * 270;
    const memoryAngle = -135 + (state.systemMetrics.memory / 100) * 270;
    const storageAngle = -135 + (state.systemMetrics.storage / 100) * 270;
    
    elements.cpuNeedle.style.transform = `rotate(${cpuAngle}deg)`;
    elements.memoryNeedle.style.transform = `rotate(${memoryAngle}deg)`;
    elements.storageNeedle.style.transform = `rotate(${storageAngle}deg)`;
    
    elements.cpuValue.textContent = state.systemMetrics.cpu + '%';
    elements.memoryValue.textContent = state.systemMetrics.memory + '%';
    elements.storageValue.textContent = state.systemMetrics.storage + '%';
}

function updateMetrics() {
    // Randomly fluctuate metrics
    state.systemMetrics.cpu = Math.max(5, Math.min(95, 
        state.systemMetrics.cpu + randomInt(-5, 5)));
    state.systemMetrics.memory = Math.max(10, Math.min(90, 
        state.systemMetrics.memory + randomInt(-3, 3)));
    // Storage only changes on file operations
    updateGauges();
}

// ==========================================
// Ticker Tape Console
// ==========================================
function addLogEntry(message, type = 'info') {
    const time = getCurrentTime();
    state.logEntries.push({ time, message, type });
    
    // Keep only last 100 entries
    if (state.logEntries.length > 100) {
        state.logEntries.shift();
    }
    
    renderSystemLog();
    addTickerMessage(`${time} - ${message}`);
}

function renderSystemLog() {
    elements.systemLog.innerHTML = '';
    
    state.logEntries.slice(-20).forEach(entry => {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${entry.type}`;
        logEntry.innerHTML = `
            <span class="timestamp">[${entry.time}]</span>
            ${entry.message}
        `;
        elements.systemLog.appendChild(logEntry);
    });
    
    // Scroll to bottom
    elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
}

function addTickerMessage(message) {
    // Add message to ticker
    const messageElement = document.createElement('div');
    messageElement.style.padding = '2px 20px';
    messageElement.style.borderBottom = '1px dashed rgba(255, 176, 0, 0.1)';
    messageElement.textContent = message;
    elements.tickerPaper.appendChild(messageElement);
    
    // Remove old messages if too many
    while (elements.tickerPaper.children.length > 50) {
        elements.tickerPaper.removeChild(elements.tickerPaper.firstChild);
    }
    
    // Auto-scroll
    elements.tickerPaper.scrollTop = elements.tickerPaper.scrollHeight;
}

function startTicker() {
    // Add initial ticker messages
    state.tickerMessages.forEach(msg => {
        addTickerMessage(msg);
    });
    
    // Periodically add new ticker messages
    setInterval(() => {
        const messages = [
            'System health check: ALL SYSTEMS GREEN',
            'Memory defragmentation scheduled for 04:00',
            'Tape drive head cleaning recommended',
            'User session timeout in 30 minutes',
            'Backup verification: 124/124 files OK',
            'Security scan: No threats detected',
            'Temperature normal: 32°C',
            'Network module: OFFLINE (no carrier)',
            'Printer queue: 0 pending jobs',
            'Scheduler: 3 automated tasks pending'
        ];
        const randomMessage = messages[randomInt(0, messages.length - 1)];
        addTickerMessage(randomMessage);
    }, randomInt(15000, 30000));
}

// ==========================================
// Date & Time Display
// ==========================================
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().substr(0, 8);
    
    document.getElementById('current-date').textContent = dateStr;
    document.getElementById('current-time').textContent = timeStr;
}

// ==========================================
// Phosphor Mode Switching
// ==========================================
function setPhosphorMode(mode) {
    // Remove all mode classes
    document.body.classList.remove('phosphor-amber', 'phosphor-green', 'phosphor-white');
    
    // Add new mode class
    if (mode !== 'amber') {
        document.body.classList.add(`phosphor-${mode}`);
    }
    
    state.phosphorMode = mode;
    
    // Update button states
    elements.modeButtons.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    addLogEntry(`Phosphor mode changed to ${mode.toUpperCase()}`, 'info');
}

// ==========================================
// Toggle Switches
// ==========================================
function handleToggle(switchEl) {
    const switchType = switchEl.dataset.switch;
    const isActive = switchEl.classList.toggle('active');
    
    switch (switchType) {
        case 'readonly':
            state.readOnly = isActive;
            addLogEntry(`Read-only mode ${isActive ? 'enabled' : 'disabled'}`, isActive ? 'warning' : 'info');
            break;
        case 'hidden':
            state.showHidden = isActive;
            renderFileList();
            addLogEntry(`Hidden files ${isActive ? 'shown' : 'hidden'}`, 'info');
            break;
        case 'compress':
            state.compressMode = isActive;
            addLogEntry(`Compression ${isActive ? 'enabled' : 'disabled'}`, 'info');
            break;
    }
}

// ==========================================
// Event Listeners
// ==========================================
function initializeEventListeners() {
    // Mode buttons
    elements.modeButtons.forEach(btn => {
        btn.addEventListener('click', () => setPhosphorMode(btn.dataset.mode));
    });
    
    // Toggle switches
    elements.toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', () => handleToggle(toggle));
    });
    
    // Action buttons
    elements.actionButtons.forEach(btn => {
        btn.addEventListener('click', () => performOperation(btn.dataset.action));
    });
    
    // Chunky buttons
    elements.chunkyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.btn;
            addLogEntry(`Button pressed: ${action.toUpperCase()}`, 'info');
            
            switch (action) {
                case 'mount':
                    showModal('Mount Device', 
                        'Select device to mount:<br><br>' +
                        '<select style="width: 100%; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">' +
                        '<option>TAPE DRIVE A:</option>' +
                        '<option>FLOPPY DRIVE B:</option>' +
                        '<option>HARD DISK C:</option>' +
                        '<option>OPTICAL DRIVE D:</option>' +
                        '</select>',
                        () => {
                            addLogEntry('Device mounted successfully', 'info');
                        }
                    );
                    break;
                case 'eject':
                    showModal('Eject Media', 
                        'Eject media from selected drive?',
                        () => {
                            addLogEntry('Media ejected', 'info');
                            elements.tapeReelLeft.classList.remove('spinning');
                            elements.tapeReelRight.classList.remove('spinning');
                            state.tapeStatus = 'READY';
                            elements.tapeStatus.textContent = state.tapeStatus;
                        }
                    );
                    break;
                case 'format':
                    showModal('Format Device', 
                        '<strong>WARNING: ALL DATA WILL BE LOST</strong><br><br>' +
                        'Select device to format:<br><br>' +
                        '<select style="width: 100%; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">' +
                        '<option>TAPE DRIVE A:</option>' +
                        '<option>FLOPPY DRIVE B:</option>' +
                        '<option>HARD DISK C:</option>' +
                        '</select><br><br>' +
                        'Format type:<br>' +
                        '<select style="width: 100%; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">' +
                        '<option>QUICK FORMAT</option>' +
                        '<option>FULL FORMAT (VERIFY)</option>' +
                        '<option>SECURE ERASE (MULTI-PASS)</option>' +
                        '</select>',
                        () => {
                            showTapeAnimation('FORMAT', [{ name: 'DEVICE', size: 0 }]);
                            simulateTapeOperation('FORMAT', [{ name: 'DEVICE', size: 0 }]).then(() => {
                                addLogEntry('Format completed successfully', 'info');
                                updateStorageMetric();
                            });
                        }
                    );
                    break;
                case 'purge':
                    showModal('Purge System', 
                        '<strong>DANGER: SYSTEM PURGE</strong><br><br>' +
                        'This will delete ALL temporary files and clear system caches.<br>' +
                        'User data will NOT be affected.<br><br>' +
                        'Are you sure you want to continue?',
                        () => {
                            addLogEntry('System purge initiated', 'warning');
                            showTapeAnimation('PURGE', [{ name: 'SYSTEM_CACHE', size: 128 }]);
                            simulateTapeOperation('PURGE', [{ name: 'SYSTEM_CACHE', size: 128 }]).then(() => {
                                addLogEntry('System purge complete', 'info');
                                updateStorageMetric();
                            });
                        }
                    );
                    break;
            }
        });
    });
    
    // Console buttons
    elements.consoleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.console;
            switch (action) {
                case 'pause':
                    // Toggle ticker pause
                    if (elements.tickerPaper.style.animationPlayState === 'paused') {
                        elements.tickerPaper.style.animationPlayState = 'running';
                        btn.querySelector('.console-icon').textContent = '⏸';
                        addLogEntry('Ticker resumed', 'info');
                    } else {
                        elements.tickerPaper.style.animationPlayState = 'paused';
                        btn.querySelector('.console-icon').textContent = '▶';
                        addLogEntry('Ticker paused', 'info');
                    }
                    break;
                case 'clear':
                    elements.tickerPaper.innerHTML = '';
                    addLogEntry('Console cleared', 'info');
                    break;
                case 'print':
                    showModal('Print Log', 
                        'Print current system log to:<br><br>' +
                        '<select style="width: 100%; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">' +
                        '<option>LINE PRINTER (LPT1:)</option>' +
                        '<option>DOT MATRIX (LPT2:)</option>' +
                        '<option>FILE: log.txt</option>' +
                        '</select><br><br>' +
                        'Copies: <input type="number" value="1" min="1" max="9" style="width: 50px; padding: 5px; background: #000; border: 1px solid #ffb000; color: #ffb000; font-family: monospace;">',
                        () => {
                            addLogEntry('Print job queued (1 copy)', 'info');
                            // Simulate printing ticker
                            for (let i = 0; i < 5; i++) {
                                setTimeout(() => {
                                    addTickerMessage(`PRINTING... LINE ${i + 1}/5`);
                                }, i * 2000);
                            }
                        }
                    );
                    break;
            }
        });
    });
    
    // Modal events
    document.getElementById('modal-close').addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            closeModal();
        }
    });
    
    // Modal confirm button
    document.querySelector('[data-modal="confirm"]').addEventListener('click', () => {
        const handler = elements.modalOverlay.dataset.confirmHandler;
        if (handler === 'true') {
            // Find the confirm callback stored in the modal
            const confirmCallback = elements.modalOverlay._confirmCallback;
            if (confirmCallback) {
                confirmCallback();
            }
        }
        closeModal();
    });
    
    document.querySelector('[data-modal="cancel"]').addEventListener('click', closeModal);
    
    // Store confirm callback
    const originalShowModal = showModal;
    showModal = function(title, content, onConfirm = null) {
        elements.modalOverlay._confirmCallback = onConfirm;
        originalShowModal(title, content, onConfirm);
    };
    
    // Dial events
    elements.dial.addEventListener('mousedown', handleDialStart);
    elements.dial.addEventListener('touchstart', handleDialStart);
    
    document.addEventListener('mousemove', handleDialMove);
    document.addEventListener('touchmove', handleDialMove);
    
    document.addEventListener('mouseup', handleDialEnd);
    document.addEventListener('touchend', handleDialEnd);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (state.isAnimating) return;
        
        const pathParts = state.currentPath.split('/').filter(p => p);
        
        switch (e.key) {
            case 'ArrowUp':
                if (pathParts.length > 1) {
                    pathParts.pop();
                    navigateTo('/' + pathParts.join('/'));
                }
                break;
            case 'ArrowDown':
                const currentDir = fileSystem[state.currentPath];
                if (currentDir && currentDir.children.length > 0) {
                    const firstChild = currentDir.children[0];
                    const childPath = state.currentPath === '/' ? `/${firstChild}` : `${state.currentPath}/${firstChild}`;
                    if (fileSystem[childPath] && fileSystem[childPath].type === 'directory') {
                        navigateTo(childPath);
                    }
                }
                break;
            case 'ArrowRight':
                // Simulate dial East
                currentDialAngle = 0;
                updateDialVisuals();
                handleDialNavigation();
                break;
            case 'ArrowLeft':
                // Simulate dial West
                currentDialAngle = 180;
                updateDialVisuals();
                handleDialNavigation();
                break;
            case 'Enter':
                if (state.selectedItems.size === 1) {
                    const selectedPath = Array.from(state.selectedItems)[0];
                    const selectedItem = fileSystem[selectedPath];
                    if (selectedItem && selectedItem.type === 'directory') {
                        navigateTo(selectedPath);
                    }
                }
                break;
            case 'Delete':
                if (state.selectedItems.size > 0 && !state.readOnly) {
                    performOperation('delete');
                }
                break;
            case 'Escape':
                if (state.selectedItems.size > 0) {
                    state.selectedItems.clear();
                    renderFileList();
                    updateSelectionInfo();
                }
                closeModal();
                break;
            case 'a':
            case 'A':
                if (e.ctrlKey || e.metaKey) {
                    // Select all files in current directory
                    const items = getDirectoryContents(state.currentPath);
                    items.forEach(item => state.selectedItems.add(item.path));
                    renderFileList();
                    updateSelectionInfo();
                    e.preventDefault();
                }
                break;
        }
    });
}

// ==========================================
// Storage Metric Update
// ==========================================
function updateStorageMetric() {
    // Calculate total used storage
    let totalSize = 0;
    Object.keys(fileSystem).forEach(path => {
        const item = fileSystem[path];
        if (item && item.size) {
            totalSize += item.size;
        }
    });
    
    // Simulate total capacity of 10240KB (10MB)
    const totalCapacity = 10240;
    const usedPercentage = Math.min(95, Math.round((totalSize / totalCapacity) * 100));
    
    state.systemMetrics.storage = usedPercentage;
    updateGauges();
}

// ==========================================
// Initialize Application
// ==========================================
function initializeApp() {
    console.log('QUANTUM-70 OS v3.2.1 Initializing...');
    
    // Set initial date/time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Render initial file list
    renderFileList();
    updateSelectionInfo();
    
    // Initialize gauges
    updateGauges();
    
    // Start metric fluctuations
    setInterval(updateMetrics, 3000);
    
    // Start ticker
    startTicker();
    
    // Render initial system log
    renderSystemLog();
    
    // Set initial phosphor mode
    setPhosphorMode('amber');
    
    // Initialize tape status
    addLogEntry('System ready. Welcome, Administrator.', 'info');
    
    // Add some boot messages with delay
    setTimeout(() => addLogEntry('Loading device drivers...', 'info'), 100);
    setTimeout(() => addLogEntry('Starting network services...', 'info'), 300);
    setTimeout(() => addLogEntry('Mounting volumes...', 'info'), 500);
    setTimeout(() => addLogEntry('User profile loaded', 'info'), 700);
    setTimeout(() => addLogEntry('Desktop initialized', 'info'), 900);
    
    // Start tape reels spinning initially (idle animation)
    setTimeout(() => {
        elements.tapeReelLeft.classList.add('spinning');
        elements.tapeReelRight.classList.add('spinning');
    }, 2000);
    
    console.log('System initialization complete.');
}

// ==========================================
// Start the application when DOM is ready
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ==========================================
// Easter Egg: Konami Code
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiCode.length === konamiIndex) {
            // Trigger secret mode
            document.body.style.animation = 'crt-turn-on 0.5s';
            addLogEntry('SECRET MODE ACTIVATED: SYSTEM DIAGNOSTICS', 'warning');
            
            // Flash all gauges to max
            state.systemMetrics.cpu = 100;
            state.systemMetrics.memory = 100;
            state.systemMetrics.storage = 100;
            updateGauges();
            
            setTimeout(() => {
                state.systemMetrics.cpu = 23;
                state.systemMetrics.memory = 47;
                state.systemMetrics.storage = 82;
                updateGauges();
            }, 3000);
            
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ==========================================
// Performance Monitor (Dev Tools)
// ==========================================
if (window.location.hash === '#debug') {
    setInterval(() => {
        console.log('System Metrics:', state.systemMetrics);
        console.log('Active Path:', state.currentPath);
        console.log('Selected Items:', state.selectedItems.size);
    }, 5000);
}
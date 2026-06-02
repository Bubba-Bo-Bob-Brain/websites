/**
 * SYSTEM // 1974
 * Core Logic & Interaction Script
 * Handles CRT effects, file system simulation, and hardware metaphors.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const clockEl = document.getElementById('clock');
    const rotaryDial = document.getElementById('rotaryDial');
    const fileDisplay = document.getElementById('fileDisplay');
    const consoleLog = document.getElementById('consoleLog');
    const commandInput = document.getElementById('commandInput');
    const glowToggle = document.getElementById('glowToggle');
    const colorToggle = document.getElementById('colorToggle');
    const btnRewind = document.getElementById('btnRewind');
    const btnPlay = document.getElementById('btnPlay');
    const btnStop = document.getElementById('btnStop');
    const btnEject = document.getElementById('btnEject');
    const leftReel = document.querySelector('.left-reel .spool');
    const rightReel = document.querySelector('.right-reel .spool');
    const navBtns = document.querySelectorAll('.nav-btn');

    // --- State ---
    let currentDir = 'root';
    let isPlaying = false;
    let currentSelection = null;
    
    // --- File System Data (Mock) ---
    const fileSystem = {
        root: [
            { name: 'SYSTEM.DAT', type: 'file', size: '12K' },
            { name: 'USERS.INI', type: 'file', size: '4K' },
            { name: 'LOGS/', type: 'dir', size: '--' },
            { name: 'ARCHIVE.TAP', type: 'file', size: '64K' }
        ],
        sys: [
            { name: 'KERNEL.BIN', type: 'file', size: '32K' },
            { name: 'BOOT.SYS', type: 'file', size: '8K' },
            { name: 'DRIVERS/', type: 'dir', size: '--' }
        ],
        usr: [
            { name: 'ADMIN/', type: 'dir', size: '--' },
            { name: 'GUEST/', type: 'dir', size: '--' },
            { name: 'DATA.DUMP', type: 'file', size: '128K' }
        ],
        logs: [
            { name: 'BOOT.LOG', type: 'file', size: '2K' },
            { name: 'ERROR.LOG', type: 'file', size: '1K' },
            { name: 'ACCESS.LOG', type: 'file', size: '15K' }
        ]
    };

    // --- Clock Logic ---
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- Rotary Dial Logic ---
    let currentRotation = 0;
    let isDragging = false;
    let startY = 0;

    rotaryDial.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        rotaryDial.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        rotaryDial.style.cursor = 'pointer';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaY = startY - e.clientY;
        currentRotation += deltaY;
        // Snap to nearest 36 degrees (10 steps)
        const snap = Math.round(currentRotation / 36) * 36;
        rotaryDial.style.transform = `rotate(${snap}deg)`;
        currentRotation = snap;
        
        // Determine selected directory based on rotation
        const index = Math.round(snap / 36) % 10;
        const dirs = ['root', 'sys', 'usr', 'logs', 'root', 'sys', 'usr', 'logs', 'root', 'sys'];
        const selectedDir = dirs[index];
        
        if (selectedDir) {
            switchDirectory(selectedDir);
        }
        startY = e.clientY;
    });

    // --- File Manager Logic ---
    function renderFiles(dir) {
        fileDisplay.innerHTML = '';
        const files = fileSystem[dir] || [];
        
        files.forEach((file, index) => {
            const el = document.createElement('div');
            el.className = 'file-item';
            el.innerHTML = `
                <span>${file.name}</span>
                <span>${file.size}</span>
            `;
            el.onclick = () => selectFile(el, file.name);
            fileDisplay.appendChild(el);
        });
        
        // Add a fake "loading" delay for realism
        addLog(`> ACCESSING DIRECTORY: ${dir.toUpperCase()}... OK`);
    }

    function selectFile(element, fileName) {
        document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        currentSelection = fileName;
        addLog(`> SELECTED: ${fileName}`);
    }

    function switchDirectory(dir) {
        currentDir = dir;
        renderFiles(dir);
        
        // Update Nav Buttons
        navBtns.forEach(btn => {
            if (btn.dataset.dir === dir) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Console Logic ---
    function addLog(text, type = '') {
        const line = document.createElement('div');
        line.className = `log-entry ${type}`;
        line.textContent = text;
        consoleLog.appendChild(line);
        consoleLog.scrollTop = consoleLog.scrollHeight;
    }

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = commandInput.value.trim().toUpperCase();
            addLog(`> ${cmd}`);
            commandInput.value = '';
            
            if (cmd === 'HELP') {
                addLog('COMMANDS: DIR, CLS, REWIND, PLAY, STOP, EJECT, HELP');
            } else if (cmd === 'CLS') {
                consoleLog.innerHTML = '';
            } else if (cmd === 'DIR') {
                renderFiles(currentDir);
            } else if (cmd === 'REWIND') {
                triggerTransport('rewind');
            } else if (cmd === 'PLAY') {
                triggerTransport('play');
            } else if (cmd === 'STOP') {
                triggerTransport('stop');
            } else if (cmd === 'EJECT') {
                triggerTransport('eject');
            } else {
                addLog(`> ERROR: UNKNOWN COMMAND '${cmd}'`, 'error');
            }
        }
    });

    // --- Transport Controls (Reel-to-Reel) ---
    function triggerTransport(action) {
        switch(action) {
            case 'play':
                if (!isPlaying) {
                    isPlaying = true;
                    leftReel.classList.add('spinning');
                    rightReel.classList.add('spinning');
                    addLog('> TAPE PLAYING...');
                    if (currentSelection) {
                        addLog(`> READING: ${currentSelection}...`);
                    }
                }
                break;
            case 'stop':
                isPlaying = false;
                leftReel.classList.remove('spinning');
                rightReel.classList.remove('spinning');
                addLog('> TAPE STOPPED');
                break;
            case 'rewind':
                isPlaying = false;
                leftReel.classList.remove('spinning');
                rightReel.classList.remove('spinning');
                // Visual effect for rewind (reverse spin)
                leftReel.style.animationDirection = 'reverse';
                rightReel.style.animationDirection = 'reverse';
                leftReel.classList.add('spinning');
                rightReel.classList.add('spinning');
                addLog('> REWINDING...');
                setTimeout(() => {
                    leftReel.style.animationDirection = 'normal';
                    rightReel.style.animationDirection = 'normal';
                    leftReel.classList.remove('spinning');
                    rightReel.classList.remove('spinning');
                    addLog('> REWIND COMPLETE');
                }, 2000);
                break;
            case 'eject':
                addLog('> EJECTING TAPE...');
                setTimeout(() => {
                    addLog('> EJECT COMPLETE. SYSTEM IDLE.');
                }, 1500);
                break;
        }
    }

    btnPlay.onclick = () => triggerTransport('play');
    btnStop.onclick = () => triggerTransport('stop');
    btnRewind.onclick = () => triggerTransport('rewind');
    btnEject.onclick = () => triggerTransport('eject');

    // --- Theme Toggles ---
    glowToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.style.filter = 'brightness(1.2) drop-shadow(0 0 5px var(--phosphor-glow))';
        } else {
            document.body.style.filter = 'none';
        }
    });

    colorToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.remove('mode-amber');
            document.body.classList.add('mode-green');
            addLog('> COLOR MODE: AMBER');
        } else {
            document.body.classList.remove('mode-green');
            document.body.classList.add('mode-amber');
            addLog('> COLOR MODE: GREEN');
        }
    });

    // --- Initialization ---
    renderFiles('root');
    addLog('> SYSTEM READY. AWAITING INPUT.');
    
    // Random ambient log entries for realism
    setInterval(() => {
        if (Math.random() > 0.9) {
            const msgs = [
                '> CHECKING MEMORY INTEGRITY...',
                '> HEAT SINK TEMPERATURE: NOMINAL',
                '> SCANNING PERIPHERALS...',
                '> NOISE LEVEL: 42dB'
            ];
            addLog(msgs[Math.floor(Math.random() * msgs.length)]);
        }
    }, 5000);
});
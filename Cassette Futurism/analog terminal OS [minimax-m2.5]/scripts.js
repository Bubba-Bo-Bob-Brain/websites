/**
 * A.N.A.L.O.G. Systems OS-77
 * Retro-Futuristic 1970s Operating System Interface
 * JavaScript Implementation
 */
(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================
    const state = {
        currentTime: new Date(),
        selectedFile: null,
        currentPath: '/VOLUME-1/SYSTEM/',
        files: generateMockFiles(),
        isOperating: false,
        operationProgress: 0,
        dialValue: 0,
        systemLoad: 0,
        audioEnabled: false,
        glowEnabled: true,
        scanlinesEnabled: true,
        phosphorMode: true
    };

    // ============================================
    // Audio Context for Retro Sounds
    // ============================================
    let audioContext = null;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playBeep(frequency = 800, duration = 50, type = 'square') {
        if (!state.audioEnabled) return;
        try {
            const ctx = initAudio();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            console.log('Audio not available');
        }
    }

    function playClick() {
        playBeep(1200, 30, 'square');
    }

    function playBlip() {
        playBeep(600, 80, 'sine');
    }

    function playError() {
        playBeep(200, 300, 'sawtooth');
    }

    function playSuccess() {
        playBeep(1000, 100, 'sine');
        setTimeout(() => playBeep(1200, 100, 'sine'), 100);
    }

    // ============================================
    // Mock File System
    // ============================================
    function generateMockFiles() {
        const types = ['DIR', 'TXT', 'BIN', 'DAT', 'SYS', 'PRG'];
        const names = [
            'BOOT.SYS', 'KERNEL.BIN', 'MEMORY.DAT', 'CONFIG.SYS', 'USERS.DIR',
            'DOCUMENTS', 'BACKUP', 'LOGS', 'TEMP', 'SYSTEM', 'NETWORK',
            'DRIVERS', 'FONTS', 'UTILITIES', 'ARCHIVE', 'DATA', 'INDEX',
            'CACHE', 'CONFIG', 'MASTER', 'CORE', 'DAEMON', 'INIT', 'RC'
        ];
        const files = [];
        for (let i = 0; i < 24; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const name = names[i] || `FILE${i.toString().padStart(3, '0')}.${type}`;
            const size = type === 'DIR' ? '--' : Math.floor(Math.random() * 999).toString().padStart(3, '0') + 'K';
            const date = new Date(1977, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            files.push({ name, type, size, date: dateStr });
        }
        return files;
    }

    // ============================================
    // Clock & Time Functions
    // ============================================
    function updateClock() {
        state.currentTime = new Date();
        const h = state.currentTime.getHours();
        const m = state.currentTime.getMinutes();
        const s = state.currentTime.getSeconds();
        const h12 = h % 12 || 12;
        const ampm = h < 12 ? 'AM' : 'PM';

        document.getElementById('hour-tens').textContent = Math.floor(h12 / 10);
        document.getElementById('hour-ones').textContent = h12 % 10;
        document.getElementById('min-tens').textContent = Math.floor(m / 10);
        document.getElementById('min-ones').textContent = m % 10;
        document.getElementById('sec-tens').textContent = Math.floor(s / 10);
        document.getElementById('sec-ones').textContent = s % 10;
        document.getElementById('ampm').textContent = ampm;
    }

    // ============================================
    // VU Meter Animation
    // ============================================
    function updateVUMeter() {
        state.systemLoad = 30 + Math.sin(Date.now() / 2000) * 20 + Math.random() * 10;
        const needle = document.getElementById('vu-needle');
        const angle = -45 + ((state.systemLoad + 20) / 23) * 90;
        needle.style.transform = `rotate(${angle}deg)`;
    }

    // ============================================
    // Rotary Dial Navigation
    // ============================================
    function initRotaryDial() {
        const dial = document.getElementById('rotary-dial');
        const display = document.getElementById('dial-value');
        let isDragging = false;
        let startAngle = 0;
        let startValue = 0;

        function getAngle(e) {
            const rect = dial.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const x = (e.clientX || e.touches[0].clientX) - centerX;
            const y = (e.clientY || e.touches[0].clientY) - centerY;
            return Math.atan2(y, x) * (180 / Math.PI);
        }

        function handleStart(e) {
            isDragging = true;
            startAngle = getAngle(e);
            startValue = state.dialValue;
            playClick();
            dial.style.cursor = 'grabbing';
        }

        function handleMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const currentAngle = getAngle(e);
            let deltaAngle = currentAngle - startAngle;
            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;
            let newValue = startValue + Math.round(deltaAngle / 20);
            newValue = Math.max(0, Math.min(8, newValue));
            if (newValue !== state.dialValue) {
                state.dialValue = newValue;
                display.textContent = newValue;
                playBlip();
                updateNavigation(newValue);
            }
        }

        function handleEnd() {
            isDragging = false;
            dial.style.cursor = 'grab';
            playClick();
        }

        dial.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        dial.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);

        dial.querySelectorAll('.dial-mark').forEach(mark => {
            mark.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = parseInt(mark.dataset.value);
                state.dialValue = value;
                display.textContent = value;
                playBlip();
                updateNavigation(value);
            });
        });
    }

    function updateNavigation(value) {
        const actions = ['FILES', 'EDIT', 'VIEW', 'TOOLS', 'HELP', 'CONFIG', 'NETWORK', 'DEBUG', 'SHUTDOWN'];
        logToConsole(`NAVIGATION: ${actions[value] || 'UNKNOWN'}`);
    }

    // ============================================
    // File Manager
    // ============================================
    function renderFileList() {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';
        state.files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.dataset.index = index;
            item.innerHTML = `
                <span class="col-name">${file.name}</span>
                <span class="col-type">${file.type}</span>
                <span class="col-size">${file.size}</span>
                <span class="col-date">${file.date}</span>
            `;
            item.addEventListener('click', () => selectFile(index));
            fileList.appendChild(item);
        });
        updateFileCount();
    }

    function selectFile(index) {
        const items = document.querySelectorAll('.file-item');
        items.forEach(item => item.classList.remove('selected'));
        items[index].classList.add('selected');
        state.selectedFile = state.files[index];
        playClick();
        logToConsole(`SELECTED: ${state.selectedFile.name}`);
    }

    function updateFileCount() {
        document.getElementById('file-count').textContent = state.files.length;
    }

    function updatePathDisplay() {
        document.getElementById('current-path').textContent = state.currentPath;
    }

    // ============================================
    // File Operations
    // ============================================
    function performOperation(type) {
        if (state.isOperating) {
            logToConsole('ERROR: OPERATION IN PROGRESS');
            playError();
            return;
        }
        if (!state.selectedFile && type !== 'format') {
            logToConsole('ERROR: NO FILE SELECTED');
            playError();
            return;
        }

        state.isOperating = true;
        state.operationProgress = 0;

        const opType = document.getElementById('op-type');
        const opDetails = document.getElementById('op-details');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        const operations = {
            format: { name: 'FORMAT DRIVE', details: 'Erasing all data on volume...', files: 100 },
            copy: { name: 'COPY FILE', details: `Copying ${state.selectedFile.name}...`, files: 30 },
            delete: { name: 'DELETE FILE', details: `Removing ${state.selectedFile.name}...`, files: 15 },
            rename: { name: 'RENAME FILE', details: `Renaming ${state.selectedFile.name}...`, files: 10 }
        };

        const op = operations[type];
        opType.textContent = op.name;
        opDetails.textContent = op.details;

        const interval = setInterval(() => {
            state.operationProgress += Math.random() * 15 + 5;
            if (state.operationProgress >= 100) {
                state.operationProgress = 100;
                clearInterval(interval);
                completeOperation(type);
            }
            progressFill.style.width = state.operationProgress + '%';
            progressText.textContent = Math.floor(state.operationProgress) + '%';
        }, 200);

        animateTapeOperation(true);
        playBlip();
    }

    function completeOperation(type) {
        setTimeout(() => {
            animateTapeOperation(false);
            document.getElementById('op-type').textContent = 'COMPLETE';
            document.getElementById('op-details').textContent = 'Operation finished successfully';
            state.isOperating = false;
            state.operationProgress = 0;
            document.getElementById('progress-fill').style.width = '0%';
            document.getElementById('progress-text').textContent = '0%';
            playSuccess();

            if (type === 'delete' && state.selectedFile) {
                state.files = state.files.filter(f => f !== state.selectedFile);
                state.selectedFile = null;
                renderFileList();
                logToConsole('FILE DELETED');
            } else if (type === 'format') {
                state.files = generateMockFiles();
                renderFileList();
                logToConsole('VOLUME FORMATTED');
            } else {
                logToConsole(`OPERATION ${type.toUpperCase()} COMPLETE`);
            }

            setTimeout(() => {
                document.getElementById('op-type').textContent = 'IDLE';
                document.getElementById('op-details').textContent = 'System ready for input';
            }, 2000);
        }, 500);
    }

    // ============================================
    // Tape Drive Animation
    // ============================================
    function initTapeControls() {
        const drives = document.querySelectorAll('.tape-drive');
        drives.forEach(drive => {
            const buttons = drive.querySelectorAll('.tape-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    handleTapeAction(drive, action, btn);
                });
            });
        });
    }

    function handleTapeAction(drive, action, btn) {
        const status = drive.querySelector('.tape-status');
        const buttons = drive.querySelectorAll('.tape-btn');
        
        buttons.forEach(b => b.classList.remove('active', 'recording'));

        switch(action) {
            case 'rewind':
                drive.classList.add('rewinding');
                status.textContent = 'REWINDING';
                playBlip();
                setTimeout(() => {
                    drive.classList.remove('rewinding');
                    status.textContent = 'READY';
                }, 2000);
                break;
            case 'play':
                btn.classList.add('active');
                status.textContent = 'PLAYING';
                playBeep(440, 100);
                setTimeout(() => {
                    btn.classList.remove('active');
                    status.textContent = 'READY';
                }, 3000);
                break;
            case 'stop':
                status.textContent = 'STOPPED';
                playClick();
                setTimeout(() => {
                    status.textContent = 'READY';
                }, 500);
                break;
            case 'record':
                btn.classList.add('recording');
                status.textContent = 'RECORDING';
                playBlip();
                setTimeout(() => {
                    btn.classList.remove('recording');
                    status.textContent = 'READY';
                }, 3000);
                break;
            case 'fast-forward':
                drive.classList.add('rewinding');
                status.textContent = 'FAST FWD';
                playBlip();
                setTimeout(() => {
                    drive.classList.remove('rewinding');
                    status.textContent = 'READY';
                }, 1500);
                break;
        }
    }

    function animateTapeOperation(active) {
        const drives = document.querySelectorAll('.tape-drive');
        drives.forEach(drive => {
            if (active) {
                drive.classList.add('rewinding');
                drive.querySelector('.tape-status').textContent = 'TRANSFERRING';
            } else {
                drive.classList.remove('rewinding');
                drive.querySelector('.tape-status').textContent = 'READY';
            }
        });
    }

    // ============================================
    // Console & Command Input
    // ============================================
    function initConsole() {
        const input = document.getElementById('console-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim().toUpperCase();
                if (command) {
                    executeCommand(command);
                    input.value = '';
                }
            }
        });
    }

    function executeCommand(cmd) {
        logToConsole(`> ${cmd}`);
        const parts = cmd.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        switch(command) {
            case 'DIR':
            case 'LS':
                renderFileList();
                logToConsole(`LISTING: ${state.files.length} ITEMS`);
                break;
            case 'CD':
                if (args[0]) {
                    state.currentPath = args[0].startsWith('/') ? args[0] : state.currentPath + args[0] + '/';
                    updatePathDisplay();
                    logToConsole(`CHANGED TO: ${state.currentPath}`);
                }
                break;
            case 'TYPE':
            case 'CAT':
                if (state.selectedFile) {
                    logToConsole(`CONTENTS OF ${state.selectedFile.name}:`);
                    logToConsole('================================');
                    for (let i = 0; i < 5; i++) {
                        logToConsole(`LINE ${i + 1}: Sample text content from file...`);
                    }
                    logToConsole('================================');
                } else {
                    logToConsole('NO FILE SELECTED');
                }
                break;
            case 'DEL':
            case 'RM':
                performOperation('delete');
                break;
            case 'COPY':
            case 'CP':
                performOperation('copy');
                break;
            case 'REN':
            case 'MV':
                performOperation('rename');
                break;
            case 'FORMAT':
                performOperation('format');
                break;
            case 'CLS':
            case 'CLEAR':
                document.getElementById('ticker-tape').innerHTML = '';
                break;
            case 'HELP':
                logToConsole('AVAILABLE COMMANDS:');
                logToConsole('DIR, LS - LIST FILES');
                logToConsole('CD <PATH> - CHANGE DIRECTORY');
                logToConsole('TYPE <FILE> - VIEW FILE');
                logToConsole('DEL <FILE> - DELETE FILE');
                logToConsole('COPY <FILE> - COPY FILE');
                logToConsole('REN <FILE> - RENAME FILE');
                logToConsole('FORMAT - FORMAT DRIVE');
                logToConsole('CLS - CLEAR SCREEN');
                logToConsole('HELP - THIS MESSAGE');
                break;
            default:
                logToConsole(`UNKNOWN COMMAND: ${command}`);
                playError();
        }
    }

    function logToConsole(message) {
        const tape = document.getElementById('ticker-tape');
        const line = document.createElement('div');
        line.className = 'tape-line';
        const time = state.currentTime.toLocaleTimeString('en-US', { hour12: false });
        line.textContent = `[${time}] ${message}`;
        tape.appendChild(line);
        tape.scrollTop = tape.scrollHeight;
        if (tape.children.length > 50) {
            tape.removeChild(tape.firstChild);
        }
    }

    // ============================================
    // Toggle Switches
    // ============================================
    function initToggles() {
        document.getElementById('phosphor-toggle').addEventListener('change', (e) => {
            state.phosphorMode = e.target.checked;
            document.body.classList.toggle('green-mode', !state.phosphorMode);
            document.getElementById('current-mode').textContent = state.phosphorMode ? 'AMBER' : 'GREEN';
            playClick();
            logToConsole(`PHOSPHOR MODE: ${state.phosphorMode ? 'AMBER' : 'GREEN'}`);
        });

        document.getElementById('glow-toggle').addEventListener('change', (e) => {
            state.glowEnabled = e.target.checked;
            document.querySelector('.phosphor-glow').style.display = state.glowEnabled ? 'block' : 'none';
            playClick();
            logToConsole(`GLOW EFFECT: ${state.glowEnabled ? 'ON' : 'OFF'}`);
        });

        document.getElementById('audio-toggle').addEventListener('change', (e) => {
            state.audioEnabled = e.target.checked;
            if (state.audioEnabled) {
                playSuccess();
                logToConsole('AUDIO FEEDBACK ENABLED');
            } else {
                logToConsole('AUDIO FEEDBACK DISABLED');
            }
        });

        document.getElementById('scanline-toggle').addEventListener('change', (e) => {
            state.scanlinesEnabled = e.target.checked;
            document.querySelector('.scanlines').style.display = state.scanlinesEnabled ? 'block' : 'none';
            playClick();
            logToConsole(`SCAN LINES: ${state.scanlinesEnabled ? 'ON' : 'OFF'}`);
        });
    }

    // ============================================
    // Quick Actions
    // ============================================
    function initQuickActions() {
        const actions = document.querySelectorAll('.action-btn');
        actions.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                performOperation(action);
            });
        });
    }

    // ============================================
    // Window Controls
    // ============================================
    function initWindowControls() {
        document.querySelector('.window-btn.minimize').addEventListener('click', () => {
            playClick();
            logToConsole('WINDOW MINIMIZED');
        });
        document.querySelector('.window-btn.maximize').addEventListener('click', () => {
            playClick();
            logToConsole('WINDOW MAXIMIZED');
        });
        document.querySelector('.window-btn.close').addEventListener('click', () => {
            playClick();
            logToConsole('WINDOW CLOSED');
        });
    }

    // ============================================
    // Status Bar Updates
    // ============================================
    function updateStatusBar() {
        const used = Math.floor(Math.random() * 20) + 40;
        document.getElementById('mem-used').textContent = used + 'K';
    }

    // ============================================
    // Memory Display Animation
    // ============================================
    function animateMemory() {
        const base = 48;
        const fluctuation = Math.sin(Date.now() / 3000) * 5 + Math.random() * 2;
        document.getElementById('mem-used').textContent = Math.floor(base + fluctuation) + 'K';

        const ioLight = document.querySelector('.io-light');
        if (Math.random() > 0.95) {
            ioLight.classList.add('active');
            setTimeout(() => ioLight.classList.remove('active'), 100 + Math.random() * 200);
        }

        const memLight = document.querySelector('.mem-light');
        if (Math.random() > 0.9) {
            memLight.classList.add('active');
            setTimeout(() => memLight.classList.remove('active'), 50 + Math.random() * 100);
        }
    }

    // ============================================
    // CRT Flicker Effect
    // ============================================
    function initCRTEffect() {
        const body = document.body;
        setInterval(() => {
            if (Math.random() > 0.98) {
                body.style.filter = 'brightness(1.02)';
                setTimeout(() => {
                    body.style.filter = 'brightness(1)';
                }, 50);
            }
        }, 100);
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        console.log('A.N.A.L.O.G. Systems OS-77 initializing...');
        
        renderFileList();
        updatePathDisplay();
        
        updateClock();
        setInterval(updateClock, 1000);
        
        setInterval(updateVUMeter, 100);
        
        setInterval(animateMemory, 500);
        
        initRotaryDial();
        initTapeControls();
        initConsole();
        initToggles();
        initQuickActions();
        initWindowControls();
        initCRTEffect();
        
        setTimeout(() => {
            logToConsole('WELCOME TO A.N.A.L.O.G. OS-77');
            logToConsole('TYPE "HELP" FOR COMMANDS');
        }, 500);
        
        console.log('System initialized successfully');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
/* ==========================================================================
   DATACORDER OS v7.2 — Main Application Script
   "The future that never was, powered by silicon dreams."
   ========================================================================== */

(function () {
    'use strict';

    // ==================== AUDIO ENGINE ====================
    let audioCtx = null;
    function ensureAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playBeep(freq, duration, type, volume) {
        try {
            ensureAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type || 'square';
            osc.frequency.value = freq || 800;
            gain.gain.value = (volume || 0.1) * (settings.volume / 10);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration / 1000));
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + (duration / 1000));
        } catch (e) { /* audio not available */ }
    }

    function playClick() {
        if (settings.click) playBeep(1200, 30, 'square', 0.05);
    }

    function playBootBeep() { playBeep(440, 100, 'square', 0.15); }
    function playErrorBeep() { playBeep(200, 300, 'sawtooth', 0.1); }
    function playSuccessBeep() { playBeep(880, 80, 'square', 0.1); }

    // ==================== STATE ====================
    let displayMode = 'amber';
    let windowZCounter = 100;
    let activeWindowId = null;
    let settings = {
        phosphor: 75,
        scanlines: 40,
        distortion: 30,
        flicker: 15,
        volume: 5,
        beepfreq: 800,
        bootseq: 'NORMAL (3870H)',
        autosave: 'OFF'
    };
    let calcMemory = 0;
    let mediaPlaying = false;
    let mediaCurrentTrack = 0;
    let mediaInterval = null;
    let mediaPosition = 0; // seconds
    let mediaDuration = 180; // 3 min default
    let dialAngle = 0;
    let consoleHistory = [];
    let consoleHistoryIndex = 0;
    let tickerLines = [];
    let ledAnimFrame = null;
    let vuAnimFrame = null;
    let diskActivityInterval = null;

    // ==================== VIRTUAL FILE SYSTEM ====================
    const fileSystem = {
        'DISK-01': {
            label: 'DISK-01',
            parent: null,
            children: {
                'SYSTEM': {
                    type: 'folder', size: '-', date: '1978-01-15',
                    children: {
                        'KERNEL.SYS': { type: 'SYSTEM', size: '12K', date: '1978-01-15' },
                        'BOOT.ROM': { type: 'ROM', size: '32K', date: '1978-01-15' },
                        'CONFIG.SYS': { type: 'CONFIG', size: '1K', date: '1979-03-22' },
                        'COMMAND.ROM': { type: 'ROM', size: '16K', date: '1978-06-01' }
                    }
                },
                'DOCS': {
                    type: 'folder', size: '-', date: '1978-11-03',
                    children: {
                        'MANIFEST.DOC': { type: 'DOC', size: '4K', date: '1979-01-10' },
                        'README.TXT': { type: 'TXT', size: '2K', date: '1979-02-14' },
                        'CHANGELOG.TXT': { type: 'TXT', size: '8K', date: '1979-06-01' }
                    }
                },
                'PROGRAMS': {
                    type: 'folder', size: '-', date: '1978-09-20',
                    children: {
                        'NOTES.PRG': { type: 'PRG', size: '4K', date: '1979-05-12' },
                        'CALC.EXE': { type: 'EXEC', size: '8K', date: '1978-12-01' },
                        'EDIT.EXE': { type: 'EXEC', size: '12K', date: '1979-01-20' },
                        'PAINT.PRG': { type: 'PRG', size: '16K', date: '1979-04-08' },
                        'MUSIC.PRG': { type: 'PRG', size: '20K', date: '1979-07-19' }
                    }
                },
                'LOGS': {
                    type: 'folder', size: '-', date: '1979-07-01',
                    children: {
                        'LOG_042.TXT': { type: 'TXT', size: '3K', date: '1979-07-22' },
                        'ERROR.LOG': { type: 'LOG', size: '1K', date: '1979-07-23' },
                        'BOOTLOG.TXT': { type: 'TXT', size: '2K', date: '1979-07-24' }
                    }
                },
                'AUTOEXEC.TXT': { type: 'TXT', size: '1K', date: '1979-01-01' },
                'READ.ME': { type: 'TXT', size: '2K', date: '1979-03-15' }
            }
        },
        'ARCHIVE-77': {
            label: 'ARCHIVE-77',
            parent: null,
            children: {
                'OLD_DOCS': {
                    type: 'folder', size: '-', date: '1977-06-01',
                    children: {
                        'SPEC_1977.TXT': { type: 'TXT', size: '6K', date: '1977-03-15' },
                        'PLANS.DOC': { type: 'DOC', size: '10K', date: '1977-08-20' },
                        'NOTES_OLD.PRG': { type: 'PRG', size: '3K', date: '1977-11-01' }
                    }
                },
                'BACKUP_SYS': {
                    type: 'folder', size: '-', date: '1977-12-31',
                    children: {
                        'KERNEL_OLD.SYS': { type: 'SYSTEM', size: '10K', date: '1977-09-01' },
                        'CONFIG_OLD.SYS': { type: 'CONFIG', size: '1K', date: '1977-12-01' }
                    }
                },
                'LEGACY.PRG': { type: 'PRG', size: '2K', date: '1976-12-25' },
                'README.OLD': { type: 'TXT', size: '1K', date: '1977-01-01' }
            }
        },
        'WORK': {
            label: 'WORK',
            parent: null,
            children: {
                'PROJECT_A': {
                    type: 'folder', size: '-', date: '1979-06-01',
                    children: {
                        'DESIGN.DOC': { type: 'DOC', size: '14K', date: '1979-06-15' },
                        'DATA.CSV': { type: 'DAT', size: '5K', date: '1979-07-01' },
                        'REPORT.TXT': { type: 'TXT', size: '8K', date: '1979-07-20' }
                    }
                },
                'PROJECT_B': {
                    type: 'folder', size: '-', date: '1979-05-01',
                    children: {
                        'WIREFRAME.DAT': { type: 'DAT', size: '22K', date: '1979-05-15' },
                        'RENDER.PRG': { type: 'PRG', size: '18K', date: '1979-06-01' }
                    }
                },
                'MEMO.TXT': { type: 'TXT', size: '1K', date: '1979-07-25' }
            }
        },
        'NETWORK': {
            label: 'NETWORK',
            parent: null,
            children: {
                'HOSTS.DAT': { type: 'DAT', size: '2K', date: '1979-07-01' },
                'ROUTES.CFG': { type: 'CFG', size: '1K', date: '1979-06-15' },
                'NETWORK.DAT': { type: 'DAT', size: '4K', date: '1979-07-24' }
            }
        }
    };

    // Tapes for media player
    const tapeLibrary = [
        { name: 'SYNTH-01.WAV', duration: 245, freq: 440 },
        { name: 'BEAT-078.BPM', duration: 312, freq: 330 },
        { name: 'AMBIENT-03.WAV', duration: 480, freq: 220 },
        { name: 'NOISE-EXP.01', duration: 156, freq: 150 },
        { name: 'CLASSICAL-12', duration: 620, freq: 523 },
        { name: 'JAZZ-TRIO-44', duration: 380, freq: 392 }
    ];

    // ==================== UTILITY FUNCTIONS ====================
    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }
    function byId(id) { return document.getElementById(id); }
    function byData(attr, val) { return document.querySelector(`[${attr}="${val}"]`); }

    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
    function pad(n, len) { return String(n).padStart(len || 2, '0'); }

    function dateStr(d) {
        const m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return m[d.getMonth()] + ' ' + pad(d.getDate()) + ' ' + d.getFullYear();
    }

    function timeStr(d) {
        return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }

    function hexStr(len) {
        let s = '';
        for (let i = 0; i < len; i++) s += '0123456789ABCDEF'[rand(0, 15)];
        return s;
    }

    // ==================== BOOT SEQUENCE ====================
    async function boot() {
        const bootText = byId('boot-text');
        const fill = byId('boot-progress-fill');
        const label = byId('boot-progress-label');
        const memDump = byId('boot-memory-dump');

        const bootMessages = [
            { text: '[  OK  ] Initializing DAC-16 processor...', delay: 400 },
            { text: '[  OK  ] Probing memory bus... 65536K found', delay: 300 },
            { text: '[  OK  ] Loading interrupt vector table...', delay: 350 },
            { text: '[  OK  ] Initializing tape controller (2 channels)', delay: 300 },
            { text: '[  OK  ] Disk controller DAC-HD32 detected', delay: 250 },
            { text: '[  OK  ] Calibrating CRT phosphor display...', delay: 300 },
            { text: '[  OK  ] Loading system fonts (8x16 bitmapped)', delay: 200 },
            { text: '[  OK  ] Mounting DISK-01...', delay: 400 },
            { text: '[  OK  ] Reading FAT-16 (256KB volume)', delay: 300 },
            { text: '[  OK  ] Loading COMMAND.ROM...', delay: 250 },
            { text: '[  OK  ] Initializing network stack (300 baud)', delay: 300 },
            { text: '[  OK  ] Loading AUTOEXEC.TXT...', delay: 200 },
            { text: '[  OK  ] System ready.', delay: 100 }
        ];

        // Boot text typing
        for (let i = 0; i < bootMessages.length; i++) {
            const msg = bootMessages[i];
            const line = document.createElement('div');
            line.className = 'boot-line';
            line.textContent = msg.text;
            bootText.appendChild(line);
            playBootBeep();
            await sleep(msg.delay);

            // Update progress
            const pct = Math.round(((i + 1) / bootMessages.length) * 100);
            fill.style.width = pct + '%';
            label.textContent = pct + '% — ' + msg.text.substring(1, 20) + '...';
        }

        // Memory dump
        await sleep(500);
        const memLines = [];
        for (let addr = 0; addr < 64; addr += 16) {
            let line = hexStr(4) + ': ';
            for (let j = 0; j < 16; j++) line += hexStr(2) + ' ';
            line += ' |' + hexStr(8) + '|';
            memLines.push(line);
        }

        for (let i = 0; i < memLines.length; i++) {
            const line = document.createElement('div');
            line.className = 'mem-line';
            line.textContent = memLines[i];
            memDump.appendChild(line);
            await sleep(30);
        }

        await sleep(800);
        label.textContent = 'BOOT COMPLETE';
        playSuccessBeep();

        // Transition to desktop
        await sleep(1000);
        byId('boot-screen').classList.remove('active-screen');
        byId('desktop').classList.remove('hidden');
        byId('desktop').classList.add('active-screen');

        // Start background services
        startClock();
        startVUMeters();
        startLEDs();
        startDiskActivity();

        // Check for first boot
        if (!sessionStorage.getItem('booted')) {
            sessionStorage.setItem('booted', '1');
            addConsoleLine('DATACORDER OS v7.2.31 — Copyright (c) 1979 Datacorder Inc.', 'success');
            addConsoleLine('All rights reserved. 64KB RAM | 256KB ROM | DAC-16 @ 2.0MHZ');
            addConsoleLine('Type HELP for a list of available commands.');
            addConsoleLine('');
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ==================== CLOCK ====================
    function startClock() {
        function update() {
            const now = new Date();
            const timeEl = byId('clock').querySelector('.clock-time');
            const dateEl = byId('clock').querySelector('.clock-date');
            if (timeEl) timeEl.textContent = timeStr(now);
            if (dateEl) dateEl.textContent = dateStr(now).toUpperCase();
        }
        update();
        setInterval(update, 1000);
    }

    // ==================== VU METERS ====================
    function startVUMeters() {
        function update() {
            const cpuFill = byId('vu-cpu-fill');
            const memFill = byId('vu-mem-fill');
            const tapeFill = byId('vu-tape-fill');

            if (cpuFill) {
                const v = rand(20, 75);
                cpuFill.style.height = v + '%';
                byId('vu-cpu-value').textContent = v + '%';
            }
            if (memFill) {
                const v = rand(30, 65);
                memFill.style.height = v + '%';
                const used = Math.round(v * 0.64);
                byId('vu-mem-value').textContent = used + 'K / 64K';
            }
            if (tapeFill) {
                const v = mediaPlaying ? rand(40, 90) : rand(0, 10);
                tapeFill.style.height = v + '%';
                byId('vu-tape-value').textContent = mediaPlaying ? 'ACTIVE' : 'IDLE';
            }
        }
        update();
        setInterval(update, 2000);
    }

    // ==================== LED INDICATORS ====================
    function startLEDs() {
        function blink() {
            const disk = byId('led-disk');
            const tape = byId('led-tape');
            const net = byId('led-net');
            const int = byId('led-int');

            if (disk) disk.classList.toggle('active', Math.random() > 0.6);
            if (tape) tape.classList.toggle('active', mediaPlaying ? Math.random() > 0.2 : Math.random() > 0.8);
            if (net) net.classList.toggle('active', Math.random() > 0.7);
            if (int) int.classList.toggle('active', Math.random() > 0.5);
        }
        setInterval(blink, 800);
    }

    function startDiskActivity() {
        setInterval(() => {
            const ind = byId('indicator-disk');
            if (ind) ind.classList.toggle('active', Math.random() > 0.5);
        }, 1500);
    }

    // ==================== WINDOW MANAGEMENT ====================
    let windowCount = 0;
    const openWindows = [];

    function openApp(appName, fileName) {
        playClick();
        const template = $(`template#template-${appName}`);
        if (!template) return;

        const clone = template.content.cloneNode(true);
        const windowEl = clone.querySelector('.app-window');
        windowEl.id = 'win-' + (++windowCount);

        // Position cascading
        const offset = (windowCount % 5) * 30;
        windowEl.style.left = (60 + offset) + 'px';
        windowEl.style.top = (40 + offset) + 'px';

        // Set title
        const titleEl = windowEl.querySelector('.toolbar-title');
        if (titleEl && fileName) {
            const tplTitle = titleEl.getAttribute('data-default');
            titleEl.textContent = fileName + ' — ' + tplTitle;
            titleEl.dataset.fileName = fileName;
        }

        // Add to container
        byId('windows-container').appendChild(windowEl);
        openWindows.push(windowEl);

        // Focus
        focusWindow(windowEl);

        // Setup window events
        setupWindowEvents(windowEl, appName);

        // App-specific initialization
        switch (appName) {
            case 'textedit': initTextEditor(windowEl, fileName); break;
            case 'filemanager': initFileManager(windowEl, fileName); break;
            case 'calculator': initCalculator(windowEl); break;
            case 'mediaplayer': initMediaPlayer(windowEl, fileName); break;
            case 'dialup': initDialup(windowEl); break;
            case 'settings': initSettings(windowEl); break;
        }

        // Add minimize button to toolbar
        const toolbarLeft = windowEl.querySelector('.toolbar-left');
        if (toolbarLeft) {
            const minBtn = document.createElement('button');
            minBtn.className = 'toolbar-btn';
            minBtn.title = 'Minimize';
            minBtn.textContent = '─ MIN';
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                windowEl.classList.add('minimized');
                windowEl.style.display = 'none';
            });
            toolbarLeft.appendChild(minBtn);
        }

        return windowEl;
    }

    function setupWindowEvents(win, appName) {
        // Close button
        const closeBtn = win.querySelector('.toolbar-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeWindow(win);
            });
        }

        // Focus on click
        win.addEventListener('mousedown', (e) => {
            focusWindow(win);
        });

        // Drag
        makeDraggable(win);
    }

    function closeWindow(win) {
        playClick();
        if (win.parentElement) win.parentElement.removeChild(win);
        const idx = openWindows.indexOf(win);
        if (idx > -1) openWindows.splice(idx, 1);
        if (activeWindowId === win.id) activeWindowId = null;

        // Cleanup media if closing media player
        if (win.dataset.app === 'mediaplayer') stopMedia();
    }

    function focusWindow(win) {
        // Lower all
        openWindows.forEach(w => {
            w.style.zIndex = 100;
            w.classList.remove('focused');
        });
        // Raise selected
        win.style.zIndex = ++windowZCounter;
        win.classList.add('focused');
        activeWindowId = win.id;
    }

    function makeDraggable(win) {
        const toolbar = win.querySelector('.window-toolbar');
        if (!toolbar) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        toolbar.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = win.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            focusWindow(win);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            win.style.left = (startLeft + dx) + 'px';
            win.style.top = (startTop + dy) + 'px';
            win.style.right = 'auto';
            win.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // ==================== DESKTOP ICONS ====================
    function setupDesktop() {
        const icons = byId('desktop-area').querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                icons.forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
                playClick();
            });

            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const app = icon.dataset.app;
                const file = icon.dataset.file;
                openApp(app, file);
            });
        });

        // Click desktop to deselect
        byId('desktop-area').addEventListener('click', () => {
            icons.forEach(i => i.classList.remove('selected'));
        });
    }

    // ==================== TEXT EDITOR ====================
    function initTextEditor(win, fileName) {
        const textArea = win.querySelector('.text-area');
        const lineNumbers = win.querySelector('.line-numbers');
        const statusLines = win.querySelector('[data-status="lines"]');
        const statusCol = win.querySelector('[data-status="col"]');

        // Pre-populate some content based on file
        const fileContents = {
            'AUTOEXEC.TXT': '// AUTOEXEC.TXT — Executed at boot\n// DATACORDER OS v7.2\n\nPATH DISK-01:SYSTEM;\nPATH DISK-01:PROGRAMS;\nLOAD KEYMAP US-ANSI;\nECHO "DATACORDER OS LOADED";\n\n// User auto-exec below:\n',
            'READ.ME': '==============================\n  WELCOME TO DATACORDER OS v7.2\n==============================\n\nSYSTEM REQUIREMENTS:\n  - DAC-16 CPU @ 2.0MHZ\n  - 64KB RAM (MIN)\n  - DATACORDER HD32 DISK CTRL\n  - DATACORDER TAPE DRIVE II\n\nQUICK START:\n  1. Type DIR to list files\n  2. Type RUN <name> to execute\n  3. Type LOAD <tape> to mount tape\n\nFOR DOCUMENTATION, TYPE: HELP\n\n— The Datacorder Team',
            'NOTES.PRG': '// NOTES.PRG — Personal Notes\n// Last modified: 1979-07-22\n\nTODO:\n  - Finish calibrating tape drive\n  - Backup DISK-01 to ARCHIVE-77\n  - Order replacement capacitors\n    for terminal monitor\n  - Update CONFIG.SYS for new RAM\n\nIDEAS:\n  - What if the network could\n    reach beyond 300 baud?\n  - Consider upgrading to 128K RAM\n    if prices drop below $200/K\n\nREM MEMORY:\n  The DAC-16 address bus supports\n  up to 1MB, but who needs that\n  much? ...Famous last words.\n',
            'LOG_042.TXT': '=== SYSTEM LOG — ENTRY 042 ===\n[1979-07-22 08:15:02] BOOT: Normal\n[1979-07-22 08:15:03] DISK: DISK-01 mounted\n[1979-07-22 08:15:04] NET:  Link established\n[1979-07-22 08:32:17] WARN: Tape seek timeout\n[1979-07-22 08:32:18] TAPE: Retry OK\n[1979-07-22 09:14:55] ERR:  Parity error @ 0x4A2F\n[1979-07-22 09:14:56] SYS:  Memory refresh\n[1979-07-22 09:14:57] SYS:  Watchdog reset\n[1979-07-22 10:01:00] NET:  Packet received\n[1979-07-22 10:01:01] NET:  Checksum valid\n[1979-07-22 11:30:00] TAPE: Archive started\n[1979-07-22 12:45:33] TAPE: Archive complete\n'
        };

        if (fileContents[fileName]) {
            textArea.textContent = fileContents[fileName];
        } else {
            textArea.textContent = '// New file — ' + (fileName || 'UNTITLED') + '\n// Created: ' + dateStr(new Date()) + '\n\n';
        }

        function updateLineNumbers() {
            const lines = textArea.textContent.split('\n').length;
            let html = '';
            for (let i = 1; i <= Math.max(lines, 15); i++) {
                html += i + '\n';
            }
            lineNumbers.innerHTML = html;
            if (statusLines) statusLines.textContent = 'LINE ' + (textArea.textContent.substring(0, textArea.selectionStart).split('\n').length);
        }

        function updateCol() {
            if (!statusCol) return;
            const text = textArea.textContent;
            const cursorPos = textArea.selectionStart;
            const lines = text.substring(0, cursorPos).split('\n');
            const col = lines[lines.length - 1].length + 1;
            statusCol.textContent = 'COL ' + col;
        }

        textArea.addEventListener('input', updateLineNumbers);
        textArea.addEventListener('click', () => { updateLineNumbers(); updateCol(); });
        textArea.addEventListener('keyup', () => { updateLineNumbers(); updateCol(); });

        updateLineNumbers();
        updateCol();
    }

    // ==================== FILE MANAGER ====================
    function initFileManager(win, startTape) {
        const tapeListEl = win.querySelector('[data-fm-tape-list]');
        const fileListEl = win.querySelector('[data-fm-file-list]');
        const pathBar = win.querySelector('[data-fm-path-bar]');
        const statusEl = win.querySelector('[data-fm-status]');
        const countEl = win.querySelector('[data-fm-count]');
        const freeEl = win.querySelector('[data-fm-free]');
        const activityFill = win.querySelector('[data-tape-activity-fill]');
        const activityValue = win.querySelector('[data-tape-activity-value]');

        let currentTape = startTape || 'DISK-01';
        let currentPath = [];

        function getTapeFiles(tapeName) {
            const tape = fileSystem[tapeName];
            if (!tape) return [];
            let current = tape.children;
            for (const segment of currentPath) {
                if (current[segment] && current[segment].children) {
                    current = current[segment].children;
                }
            }
            return current;
        }

        function renderTapeList() {
            tapeListEl.innerHTML = '';
            Object.keys(fileSystem).forEach(tapeName => {
                const tape = fileSystem[tapeName];
                const item = document.createElement('div');
                item.className = 'fm-tape-item' + (tapeName === currentTape ? ' active' : '');
                item.innerHTML = '<div class="fm-tape-icon"></div><div class="fm-tape-name">' + tape.label + '</div>';
                item.addEventListener('click', () => {
                    currentTape = tapeName;
                    currentPath = [];
                    renderTapeList();
                    renderFileList();
                    updatePathBar();
                    playClick();
                });
                tapeListEl.appendChild(item);
            });
        }

        function updatePathBar() {
            let html = '';
            html += '<span class="path-segment">' + currentTape + ':</span>';
            if (currentPath.length === 0) {
                html += '<span class="path-separator">/</span>';
            } else {
                let builtPath = '';
                currentPath.forEach((seg, i) => {
                    builtPath += '/' + seg;
                    html += '<span class="path-separator">/</span>';
                    html += '<span class="path-segment" data-path-idx="' + i + '">' + seg + '</span>';
                });
                html += '<span class="path-separator">/</span>';
            }
            pathBar.innerHTML = html;

            // Clickable path segments
            pathBar.querySelectorAll('[data-path-idx]').forEach(seg => {
                seg.style.cursor = 'pointer';
                seg.addEventListener('click', () => {
                    const idx = parseInt(seg.dataset.pathIdx);
                    currentPath = currentPath.slice(0, idx + 1);
                    renderFileList();
                    updatePathBar();
                });
            });
        }

        function renderFileList() {
            const files = getTapeFiles(currentTape);
            fileListEl.innerHTML = '';

            // Sort: folders first
            const entries = Object.entries(files).sort((a, b) => {
                const aIsFolder = a[1].type === 'folder';
                const bIsFolder = b[1].type === 'folder';
                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;
                return a[0].localeCompare(b[0]);
            });

            entries.forEach(([name, info]) => {
                const item = document.createElement('div');
                item.className = 'fm-file-item';
                item.innerHTML = `
                    <span class="fm-file-name">${info.type === 'folder' ? '📁' : '📄'} ${name}</span>
                    <span class="fm-file-type">${info.type}</span>
                    <span class="fm-file-size">${info.size}</span>
                    <span class="fm-file-date">${info.date}</span>
                `;
                item.addEventListener('click', () => {
                    fileListEl.querySelectorAll('.fm-file-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    playClick();
                });
                item.addEventListener('dblclick', () => {
                    if (info.type === 'folder') {
                        currentPath.push(name);
                        renderFileList();
                        updatePathBar();
                        simulateTapeActivity();
                    } else {
                        // Open file in text editor
                        openApp('textedit', name);
                        simulateTapeActivity();
                    }
                });
                fileListEl.appendChild(item);
            });

            if (statusEl) statusEl.textContent = 'READY';
            if (countEl) countEl.textContent = entries.length + ' FILES';

            // Calculate free space
            const fileCount = entries.filter(([_, info]) => info.type !== 'folder').length;
            const totalSize = fileCount * rand(2, 20);
            if (freeEl) freeEl.textContent = 'FREE: ' + (256 - totalSize) + 'K / 256K';
        }

        function simulateTapeActivity() {
            if (activityFill) {
                activityFill.style.width = '80%';
                activityValue.textContent = rand(400, 1200) + ' B/s';
                setTimeout(() => {
                    activityFill.style.width = '0%';
                    activityValue.textContent = '0 KB/s';
                }, 2000);
            }
        }

        // Nav buttons
        const backBtn = win.querySelector('.nav-back');
        const upBtn = win.querySelector('.nav-up');

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (currentPath.length > 0) {
                    currentPath.pop();
                    renderFileList();
                    updatePathBar();
                    playClick();
                    simulateTapeActivity();
                }
            });
        }
        if (upBtn) {
            upBtn.addEventListener('click', () => {
                if (currentPath.length > 0) {
                    currentPath.pop();
                    renderFileList();
                    updatePathBar();
                    playClick();
                    simulateTapeActivity();
                } else {
                    // Go to tape selection
                    const tapes = Object.keys(fileSystem);
                    if (tapes.length > 0) {
                        currentTape = tapes[0];
                        currentPath = [];
                        renderTapeList();
                        renderFileList();
                        updatePathBar();
                    }
                }
            });
        }

        renderTapeList();
        renderFileList();
        updatePathBar();
    }

    // ==================== CALCULATOR ====================
    function initCalculator(win) {
        const display = win.querySelector('[data-calc-display]');
        const memDisplay = win.querySelector('[data-calc-mem]');
        let currentValue = '0';
        let previousValue = null;
        let operation = null;
        let shouldResetDisplay = false;
        let calcMemory = 0;

        function updateDisplay() {
            display.textContent = currentValue;
            if (memDisplay) memDisplay.textContent = 'MEM: ' + calcMemory;
        }

        win.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                const val = btn.dataset.val;

                if (!val) return;

                if (['0','1','2','3','4','5','6','7','8','9','.'].includes(val)) {
                    if (shouldResetDisplay) {
                        currentValue = val === '.' ? '0.' : val;
                        shouldResetDisplay = false;
                    } else {
                        if (val === '.' && currentValue.includes('.')) return;
                        if (currentValue === '0' && val !== '.') {
                            currentValue = val;
                        } else {
                            currentValue += val;
                        }
                    }
                    updateDisplay();
                } else if (['+','−','*','/'].includes(val)) {
                    previousValue = parseFloat(currentValue);
                    operation = val;
                    shouldResetDisplay = true;
                } else if (val === '=') {
                    if (operation && previousValue !== null) {
                        const current = parseFloat(currentValue);
                        let result;
                        switch (operation) {
                            case '+': result = previousValue + current; break;
                            case '−': result = previousValue - current; break;
                            case '*': result = previousValue * current; break;
                            case '/': result = current !== 0 ? previousValue / current : NaN; break;
                        }
                        if (isNaN(result) || !isFinite(result)) {
                            currentValue = 'ERROR';
                            playErrorBeep();
                        } else {
                            currentValue = String(Math.round(result * 1000000) / 1000000);
                            if (currentValue.includes('.') && currentValue.length > 10) {
                                currentValue = parseFloat(currentValue).toPrecision(8);
                            }
                            playSuccessBeep();
                        }
                        operation = null;
                        previousValue = null;
                        shouldResetDisplay = true;
                        updateDisplay();
                    }
                } else if (val === 'C') {
                    currentValue = '0';
                    previousValue = null;
                    operation = null;
                    shouldResetDisplay = false;
                    updateDisplay();
                } else if (val === 'MC') {
                    calcMemory = 0;
                    updateDisplay();
                } else if (val === 'MR') {
                    currentValue = String(calcMemory);
                    shouldResetDisplay = true;
                    updateDisplay();
                } else if (val === 'MS') {
                    calcMemory = parseFloat(currentValue);
                    updateDisplay();
                }
            });
        });

        updateDisplay();
    }

    // ==================== MEDIA PLAYER ====================
    function initMediaPlayer(win, fileName) {
        const trackName = win.querySelector('[data-media-track]');
        const positionDisplay = win.querySelector('[data-media-position]');
        const statusEl = win.querySelector('[data-media-status]');
        const vuLeft = win.querySelector('[data-media-vu="l"]');
        const vuRight = win.querySelector('[data-media-vu="r"]');

        const spoolLeft = win.querySelector('[data-media-spool="left"]');
        const spoolRight = win.querySelector('[data-media-spool="right"]');

        let trackIndex = tapeLibrary.findIndex(t => t.name === fileName) || 0;
        if (trackIndex < 0) trackIndex = 0;

        mediaCurrentTrack = trackIndex;
        mediaDuration = tapeLibrary[trackIndex].duration;
        mediaPosition = 0;

        function updateDisplay() {
            if (trackName) trackName.textContent = 'TRACK ' + (trackIndex + 1).toString().padStart(2, '0') + ' — ' + tapeLibrary[trackIndex].name;
            const remaining = Math.max(0, mediaDuration - mediaPosition);
            if (positionDisplay) {
                positionDisplay.textContent =
                    pad(Math.floor(mediaPosition / 60)) + ':' + pad(Math.floor(mediaPosition % 60)) +
                    ' / ' +
                    pad(Math.floor(mediaDuration / 60)) + ':' + pad(Math.floor(mediaDuration % 60));
            }
        }

        function updateVU() {
            if (!mediaPlaying) {
                if (vuLeft) vuLeft.style.height = '0%';
                if (vuRight) vuRight.style.height = '0%';
                return;
            }
            if (vuLeft) vuLeft.style.height = rand(30, 90) + '%';
            if (vuRight) vuRight.style.height = rand(30, 90) + '%';
        }

        win.querySelectorAll('.media-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                const action = btn.dataset.mediaCtrl;

                if (action === 'play') {
                    if (mediaPlaying) return;
                    mediaPlaying = true;
                    statusEl.textContent = '▶ PLAYING';
                    btn.classList.add('active');
                    win.querySelectorAll('.media-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Start tape spools
                    spoolLeft.classList.add('spinning');
                    spoolRight.classList.add('spinning');

                    mediaInterval = setInterval(() => {
                        mediaPosition += 1;
                        updateDisplay();
                        updateVU();
                        if (mediaPosition >= mediaDuration) {
                            stopMedia();
                            statusEl.textContent = '▶ END OF TAPE';
                        }
                    }, 1000);

                    addTickerLine('TAPE PLAY: ' + tapeLibrary[trackIndex].name + ' @ ' + timeStr(new Date()));
                }

                if (action === 'stop') {
                    stopMedia();
                    statusEl.textContent = '■ STOPPED';
                    updateDisplay();
                }

                if (action === 'pause') {
                    mediaPlaying = !mediaPlaying;
                    statusEl.textContent = mediaPlaying ? '▶ PLAYING' : '⏸ PAUSED';
                    if (mediaPlaying) {
                        spoolLeft.classList.add('spinning');
                        spoolRight.classList.add('spinning');
                    } else {
                        spoolLeft.classList.remove('spinning');
                        spoolRight.classList.remove('spinning');
                    }
                }

                if (action === 'rewind') {
                    mediaPlaying = false;
                    clearInterval(mediaInterval);
                    spoolLeft.classList.remove('spinning');
                    spoolRight.classList.remove('spinning');
                    statusEl.textContent = '⏪ REWINDING...';
                    const rewInterval = setInterval(() => {
                        mediaPosition = Math.max(0, mediaPosition - 5);
                        updateDisplay();
                        if (mediaPosition <= 0) {
                            clearInterval(rewInterval);
                            statusEl.textContent = '■ READY';
                        }
                    }, 50);
                    addTickerLine('TAPE REWIND @ ' + timeStr(new Date()));
                }

                if (action === 'forward') {
                    mediaPlaying = false;
                    clearInterval(mediaInterval);
                    spoolLeft.classList.remove('spinning');
                    spoolRight.classList.remove('spinning');
                    statusEl.textContent = '⏩ FAST-FWD...';
                    const ffInterval = setInterval(() => {
                        mediaPosition = Math.min(mediaDuration, mediaPosition + 5);
                        updateDisplay();
                        if (mediaPosition >= mediaDuration) {
                            clearInterval(ffInterval);
                            statusEl.textContent = '■ END OF TAPE';
                        }
                    }, 50);
                }

                if (action === 'eject') {
                    stopMedia();
                    statusEl.textContent = '⏏ EJECTED';
                    spoolLeft.classList.remove('spinning');
                    spoolRight.classList.remove('spinning');
                    trackIndex = (trackIndex + 1) % tapeLibrary.length;
                    mediaDuration = tapeLibrary[trackIndex].duration;
                    mediaPosition = 0;
                    setTimeout(() => {
                        statusEl.textContent = 'READY';
                        updateDisplay();
                    }, 1500);
                    addTickerLine('TAPE EJECT/LOAD @ ' + timeStr(new Date()));
                }
            });
        });

        function stopMedia() {
            mediaPlaying = false;
            clearInterval(mediaInterval);
            mediaInterval = null;
            spoolLeft.classList.remove('spinning');
            spoolRight.classList.remove('spinning');
            if (vuLeft) vuLeft.style.height = '0%';
            if (vuRight) vuRight.style.height = '0%';
        }

        updateDisplay();
        updateVU();
    }

    function stopMedia() {
        mediaPlaying = false;
        if (mediaInterval) clearInterval(mediaInterval);
        mediaInterval = null;
    }

    // ==================== DIALUP TERMINAL ====================
    function initDialup(win) {
        const display = win.querySelector('[data-dial-number]');
        const statusEl = win.querySelector('[data-dial-status]');
        const terminalOutput = win.querySelector('[data-terminal-output]');
        const modemLights = {
            off: win.querySelector('[data-modem="off"]'),
            ring: win.querySelector('[data-modem="ring"]'),
            link: win.querySelector('[data-modem="link"]'),
            xmit: win.querySelector('[data-modem="xmit"]')
        };

        let dialNumber = '';
        let connected = false;

        function updateDisplay() {
            display.textContent = dialNumber || '█';
        }

        function setModemLight(which) {
            Object.keys(modemLights).forEach(k => {
                if (modemLights[k]) modemLights[k].classList.remove('active');
            });
            if (modemLights[which]) modemLights[which].classList.add('active');
        }

        // Dial pad
        win.querySelectorAll('.dial-key').forEach(key => {
            key.addEventListener('click', () => {
                playClick();
                if (connected) return;
                const val = key.dataset.val;
                if (dialNumber.length < 12) {
                    dialNumber += val;
                    updateDisplay();
                }
            });
        });

        // Dial button
        win.querySelector('[data-dial-trigger]').addEventListener('click', () => {
            if (connected) return;
            if (dialNumber.length < 5) {
                addTerminalLine('ERROR: Number too short.', 'error');
                playErrorBeep();
                return;
            }

            playBeep(900, 200, 'sine', 0.15);
            statusEl.textContent = 'DIALING...';
            setModemLight('off');

            // Simulate dialing
            let digits = dialNumber.split('');
            let i = 0;
            const dialInterval = setInterval(() => {
                if (i < digits.length) {
                    playBeep(600 + parseInt(digits[i]) * 50, 100, 'sine', 0.1);
                    addTerminalLine('DTMF: ' + digits[i], '');
                    i++;
                } else {
                    clearInterval(dialInterval);
                    // Ringing
                    statusEl.textContent = 'RINGING...';
                    setModemLight('ring');
                    playBeep(440, 300, 'sine', 0.08);

                    setTimeout(() => {
                        playBeep(440, 200, 'sine', 0.08);
                        setTimeout(() => {
                            // Connect
                            statusEl.textContent = 'CONNECTED 300';
                            setModemLight('link');
                            connected = true;
                            addTerminalLine('CONNECT 300 baud', 'success');
                            addTerminalLine('ATDT ' + dialNumber, '');
                            addTerminalLine('CONNECT', 'success');
                            addTerminalLine('');
                            addTerminalLine('Remote host: DATACORDER BBS v3.14');
                            addTerminalLine('Welcome, caller. Type HELP for commands.');
                            addTerminalLine('');
                        }, 500);
                    }, 1000);
                }
            }, 300);
        });

        // Hang up button
        win.querySelector('[title="Hang Up"]').addEventListener('click', () => {
            playBeep(300, 500, 'sine', 0.1);
            connected = false;
            dialNumber = '';
            statusEl.textContent = 'DISCONNECTED';
            setModemLight('off');
            updateDisplay();
            addTerminalLine('CARRIER LOST', 'error');
        });

        function addTerminalLine(text, cls) {
            const line = document.createElement('div');
            line.className = 'term-line' + (cls ? ' ' + cls : '');
            line.textContent = text;
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        addTerminalLine('DATACORDER MODEM v2.1', 'success');
        addTerminalLine('Ready. Enter phone number and press DIAL.');
        addTerminalLine('');
    }

    // ==================== SYSTEM CONSOLE ====================
    function initConsole() {
        const consoleScreen = byId('console-screen');
        const consolePaper = byId('console-paper');
        const input = byId('console-input');
        let history = [];
        let histIndex = 0;

        function addLine(text, cls) {
            const line = document.createElement('div');
            line.className = 'console-line' + (cls ? ' ' + cls : '');
            line.textContent = text;
            consolePaper.appendChild(line);
            consolePaper.scrollTop = consolePaper.scrollHeight;
        }

        function addConsoleLine(text, cls) {
            // Split long lines
            const maxLen = 70;
            if (text.length > maxLen) {
                for (let i = 0; i < text.length; i += maxLen) {
                    addLine(text.substring(i, i + maxLen), cls);
                }
            } else {
                addLine(text, cls);
            }
        }

        function processCommand(cmd) {
            cmd = cmd.trim();
            if (!cmd) return;

            history.unshift(cmd);
            histIndex = 0;
            addConsoleLine('> ' + cmd);

            const parts = cmd.split(/\s+/);
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);

            switch (command) {
                case 'help':
                case '?':
                    addConsoleLine('');
                    addConsoleLine('Available commands:', 'success');
                    addConsoleLine('  DIR / LS      - List files on current tape');
                    addConsoleLine('  CD <dir>      - Change directory');
                    addConsoleLine('  CAT <file>    - Display file contents');
                    addConsoleLine('  TYPE <file>   - Same as CAT');
                    addConsoleLine('  VER           - Display system version');
                    addConsoleLine('  DATE          - Display current date');
                    addConsoleLine('  TIME          - Display current time');
                    addConsoleLine('  CLS / CLEAR   - Clear screen');
                    addConsoleLine('  BEEP [freq]   - System beep');
                    addConsoleLine('  SYSINFO       - System information');
                    addConsoleLine('  MEMORY        - Memory map');
                    addConsoleLine('  WHOAMI        - Current user');
                    addConsoleLine('  NETSTAT       - Network status');
                    addConsoleLine('  PING <host>   - Ping host');
                    addConsoleLine('  TELNET <addr> - Connect to host');
                    addConsoleLine('  FORMAT <tape> - Format tape');
                    addConsoleLine('  MKDIR <name>  - Create directory');
                    addConsoleLine('  TREE          - Directory tree');
                    addConsoleLine('  RUN <prog>    - Run program');
                    addConsoleLine('  TAPE          - Open tape deck');
                    addConsoleLine('  DIAL          - Open dialer');
                    addConsoleLine('  SHUTDOWN      - Shut down system');
                    addConsoleLine('  REBOOT        - Reboot system');
                    addConsoleLine('  EXIT          - Close console');
                    addConsoleLine('');
                    break;

                case 'dir':
                case 'ls':
                    let listTape = 'DISK-01';
                    if (args[0]) listTape = args[0].toUpperCase();
                    const tape = fileSystem[listTape];
                    if (tape) {
                        addConsoleLine(' Volume in drive 0 is ' + tape.label);
                        addConsoleLine(' Volume Serial Number is ' + hexStr(4) + '-' + hexStr(4));
                        addConsoleLine('');
                        const entries = Object.entries(tape.children);
                        entries.forEach(([name, info]) => {
                            const isDir = info.type === 'folder';
                            const size = isDir ? '<DIR>' : info.size.padStart(8);
                            addConsoleLine(
                                (isDir ? 'd' : '-') +
                                ' ' +
                                info.date.padEnd(12) + ' ' +
                                size.padEnd(10) + ' ' +
                                (isDir ? '[DIR] ' : '      ') + name
                            );
                        });
                        addConsoleLine('');
                        addConsoleLine('  ' + entries.length + ' entries');
                        const fileCount = entries.filter(([_, i]) => i.type !== 'folder').length;
                        addConsoleLine('  ' + fileCount + ' file(s), ' + (entries.length - fileCount) + ' dir(s)');
                    } else {
                        addConsoleLine('Error: Tape ' + listTape + ' not found.', 'error');
                    }
                    break;

                case 'cd':
                    if (args[0] && fileSystem[args[0].toUpperCase()]) {
                        addConsoleLine('Changed to ' + args[0].toUpperCase());
                    } else {
                        addConsoleLine('Directory not found.', 'error');
                    }
                    break;

                case 'cat':
                case 'type':
                    if (!args[0]) {
                        addConsoleLine('Usage: CAT <filename>', 'error');
                        break;
                    }
                    addConsoleLine('Displaying contents of ' + args[0] + '...');
                    addConsoleLine('[File content would be displayed here]');
                    addConsoleLine('--- End of file ---');
                    break;

                case 'ver':
                    addConsoleLine('DATACORDER OS v7.2.31');
                    addConsoleLine('Copyright (c) 1979 Datacorder Inc.');
                    addConsoleLine('CPU: DAC-16 @ 2.0MHZ | RAM: 64KB | ROM: 256KB');
                    break;

                case 'date': {
                    const now = new Date();
                    addConsoleLine('Current date: ' + dateStr(now));
                    break;
                }
                case 'time': {
                    const now = new Date();
                    addConsoleLine('Current time: ' + timeStr(now));
                    break;
                }

                case 'cls':
                case 'clear':
                    consolePaper.innerHTML = '';
                    break;

                case 'beep': {
                    const freq = parseInt(args[0]) || 800;
                    playBeep(freq, 200, 'square', 0.15);
                    addConsoleLine('Beep: ' + freq + 'Hz');
                    break;
                }

                case 'sysinfo':
                    addConsoleLine('=== SYSTEM INFORMATION ===');
                    addConsoleLine('OS:       DATACORDER OS v7.2.31');
                    addConsoleLine('CPU:      DAC-16 @ 2.0MHz');
                    addConsoleLine('RAM:      64KB (65536 bytes)');
                    addConsoleLine('ROM:      256KB');
                    addConsoleLine('DISKS:    1 (HD32, 256KB)');
                    addConsoleLine('TAPES:    4 drives');
                    addConsoleLine('NETWORK:  300 baud modem');
                    addConsoleLine('DISPLAY:  ' + displayMode + ' phosphor');
                    addConsoleLine('SERIAL:   DAC-79-04281');
                    addConsoleLine('UPTIME:   ' + Math.floor(performance.now() / 1000) + ' seconds');
                    break;

                case 'memory':
                case 'mem':
                    addConsoleLine('=== MEMORY MAP ===');
                    addConsoleLine('0x0000-0x3FFF: System ROM (16K)');
                    addConsoleLine('0x4000-0x7FFF: Extended ROM (16K)');
                    addConsoleLine('0x8000-0xBFFF: Video RAM (16K)');
                    addConsoleLine('0xC000-0xFFFF: System RAM (16K)');
                    addConsoleLine('Free RAM: ' + rand(16000, 24000) + ' bytes');
                    addConsoleLine('Used RAM: ' + rand(8000, 16000) + ' bytes');
                    for (let i = 0; i < 8; i++) {
                        addConsoleLine(hexStr(4) + ': ' + hexStr(32));
                    }
                    break;

                case 'whoami':
                    addConsoleLine('USER: OPERATOR');
                    addConsoleLine('GROUP: ADMIN');
                    addConsoleLine('HOME: /OPERATOR');
                    break;

                case 'netstat':
                    addConsoleLine('=== NETWORK STATUS ===');
                    addConsoleLine('Interface: MODEM0 (300 baud)');
                    addConsoleLine('Status:     ' + (Math.random() > 0.5 ? 'CONNECTED' : 'IDLE'));
                    addConsoleLine('Protocol:   DATANET v1.2');
                    addConsoleLine('TX Packets: ' + rand(100, 9999));
                    addConsoleLine('RX Packets: ' + rand(100, 9999));
                    addConsoleLine('Errors:     ' + rand(0, 12));
                    break;

                case 'ping':
                    if (!args[0]) {
                        addConsoleLine('Usage: PING <host>', 'error');
                        break;
                    }
                    addConsoleLine('PINGing ' + args[0] + '...');
                    for (let i = 0; i < 4; i++) {
                        setTimeout((j) => {
                            const ms = rand(40, 200);
                            addConsoleLine('Reply from ' + args[0] + ': time=' + ms + 'ms');
                        }, i * 500, i);
                    }
                    break;

                case 'telnet':
                    if (!args[0]) {
                        addConsoleLine('Usage: TELNET <address>', 'error');
                        break;
                    }
                    addConsoleLine('Connecting to ' + args[0] + ':23...');
                    setTimeout(() => {
                        addConsoleLine('Connected to ' + args[0]);
                        addConsoleLine('Escape character is \'^\'.');
                    }, 1000);
                    break;

                case 'format':
                    if (!args[0]) {
                        addConsoleLine('Usage: FORMAT <tape>', 'error');
                        break;
                    }
                    addConsoleLine('WARNING: This will erase all data on ' + args[0]);
                    addConsoleLine('Proceed? (Y/N)');
                    break;

                case 'mkdir':
                    if (!args[0]) {
                        addConsoleLine('Usage: MKDIR <name>', 'error');
                        break;
                    }
                    addConsoleLine('Directory ' + args[0] + ' created.');
                    break;

                case 'tree':
                    addConsoleLine('DATACORDER OS v7.2.31');
                    addConsoleLine('├── DISK-01:');
                    addConsoleLine('│   ├── SYSTEM/');
                    addConsoleLine('│   ├── DOCS/');
                    addConsoleLine('│   ├── PROGRAMS/');
                    addConsoleLine('│   ├── LOGS/');
                    addConsoleLine('├── ARCHIVE-77:');
                    addConsoleLine('│   ├── OLD_DOCS/');
                    addConsoleLine('│   ├── BACKUP_SYS/');
                    addConsoleLine('├── WORK:');
                    addConsoleLine('│   ├── PROJECT_A/');
                    addConsoleLine('│   ├── PROJECT_B/');
                    addConsoleLine('├── NETWORK:');
                    break;

                case 'run':
                    if (!args[0]) {
                        addConsoleLine('Usage: RUN <program>', 'error');
                        break;
                    }
                    addConsoleLine('Loading ' + args[0] + '...');
                    setTimeout(() => {
                        addConsoleLine('Program ' + args[0] + ' loaded.');
                        playSuccessBeep();
                    }, 500);
                    break;

                case 'tape':
                    addConsoleLine('Opening tape deck interface...');
                    showCassetteOverlay();
                    break;

                case 'dial':
                    addConsoleLine('Opening dial-up terminal...');
                    const dialWin = openApp('dialup', 'NETWORK.DAT');
                    if (dialWin) {
                        dialWin.style.left = '120px';
                        dialWin.style.top = '60px';
                    }
                    break;

                case 'shutdown':
                    addConsoleLine('Shutting down...');
                    addConsoleLine('Flushing buffers...');
                    addConsoleLine('Unmounting disks...');
                    setTimeout(() => {
                        addConsoleLine('System halted. It is now safe to power off.');
                        playErrorBeep();
                        setTimeout(() => {
                            byId('boot-screen').classList.add('active-screen');
                            byId('desktop').classList.add('hidden');
                            byId('desktop').classList.remove('active-screen');
                            byId('boot-text').innerHTML = '';
                            byId('boot-progress-fill').style.width = '0%';
                            byId('boot-memory-dump').innerHTML = '';
                            setTimeout(() => boot(), 1500);
                        }, 2000);
                    }, 1500);
                    break;

                case 'reboot':
                    addConsoleLine('Rebooting system...');
                    setTimeout(() => {
                        consolePaper.innerHTML = '';
                        addConsoleLine('System restart...', 'success');
                        setTimeout(() => {
                            byId('boot-screen').classList.add('active-screen');
                            byId('desktop').classList.add('hidden');
                            byId('desktop').classList.remove('active-screen');
                            byId('boot-text').innerHTML = '';
                            byId('boot-progress-fill').style.width = '0%';
                            byId('boot-memory-dump').innerHTML = '';
                            setTimeout(() => boot(), 800);
                        }, 1000);
                    }, 1000);
                    break;

                case 'exit':
                    hideConsole();
                    break;

                case 'cls':
                    consolePaper.innerHTML = '';
                    break;

                default:
                    addConsoleLine('Bad command or file name: ' + command, 'error');
                    playErrorBeep();
            }
        }

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(input.value);
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (histIndex < history.length) {
                    histIndex++;
                    input.value = history[histIndex - 1];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (histIndex > 1) {
                    histIndex--;
                    input.value = history[histIndex - 1];
                } else {
                    histIndex = 0;
                    input.value = '';
                }
            }
        });

        // Make addConsoleLine globally accessible
        window.addConsoleLine = addConsoleLine;
    }

    function showConsole() {
        byId('console-screen').classList.remove('hidden');
        byId('console-screen').style.display = 'flex';
        byId('console-input').focus();
    }

    function hideConsole() {
        byId('console-screen').classList.add('hidden');
    }

    // ==================== CONTROL PANEL ====================
    function initControlPanel() {
        const panel = byId('control-panel');

        // Close button
        byId('panel-close').addEventListener('click', () => {
            panel.classList.add('hidden');
            playClick();
        });

        // Display mode toggles
        const modeToggles = ['toggle-amber', 'toggle-green', 'toggle-white', 'toggle-inverse', 'toggle-bloom'];
        modeToggles.forEach(id => {
            const toggle = byId(id);
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const mode = toggle.dataset.mode;
                    setDisplayMode(mode);
                    playClick();

                    // Visual feedback on toggle
                    modeToggles.forEach(t => {
                        const el = byId(t);
                        if (el) el.classList.remove('active');
                    });
                    toggle.classList.add('active');

                    // For bloom mode, also enable amber
                    byId('crt-screen').className = 'crt-screen ' + mode + '-mode';
                });
            }
        });

        // System toggles
        ['toggle-beep', 'toggle-click', 'toggle-scroll', 'toggle-fan'].forEach(id => {
            const toggle = byId(id);
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const setting = toggle.dataset.setting;
                    if (setting === 'click') {
                        settings.click = !settings.click;
                        toggle.classList.toggle('active', settings.click);
                        toggle.dataset.state = settings.click ? 'on' : 'off';
                    } else if (setting === 'fan') {
                        // Visual only
                        toggle.classList.toggle('active');
                    } else if (setting === 'beep') {
                        toggle.classList.toggle('active');
                        if (toggle.classList.contains('active')) playBeep(800, 200, 'square', 0.1);
                    } else if (setting === 'scroll') {
                        toggle.classList.toggle('active');
                    }
                    playClick();
                });
            }
        });

        // Setting sliders
        const sliderMap = {
            'set-phosphor': { key: 'phosphor', displayId: 'set-phosphor-val', suffix: '%' },
            'set-scanlines': { key: 'scanlines', displayId: 'set-scanlines-val', suffix: '%' },
            'set-distortion': { key: 'distortion', displayId: 'set-distortion-val', suffix: '%' },
            'set-flicker': { key: 'flicker', displayId: 'set-flicker-val', suffix: '%' },
            'set-volume': { key: 'volume', displayId: 'set-volume-val', suffix: '' },
            'set-beepfreq': { key: 'beepfreq', displayId: 'set-beepfreq-val', suffix: '' }
        };

        Object.entries(sliderMap).forEach(([sliderId, config]) => {
            const slider = byId(sliderId);
            const display = byId(config.displayId);
            if (slider && display) {
                slider.addEventListener('input', () => {
                    settings[config.key] = parseInt(slider.value);
                    display.textContent = slider.value + config.suffix;
                    applySettings();
                    playClick();
                });
            }
        });

        // Select dropdowns
        const bootSeqSelect = byId('set-bootseq');
        if (bootSeqSelect) {
            bootSeqSelect.addEventListener('change', () => {
                settings.bootseq = bootSeqSelect.value;
                playClick();
            });
        }

        const autosaveSelect = byId('set-autosave');
        if (autosaveSelect) {
            autosaveSelect.addEventListener('change', () => {
                settings.autosave = autosaveSelect.value;
                playClick();
            });
        }
    }

    function setDisplayMode(mode) {
        displayMode = mode;
        const screen = byId('crt-screen');
        screen.className = 'crt-screen ' + mode + '-mode';

        // Apply bloom glow to monitor
        const monitor = byId('crt-monitor');
        if (mode === 'bloom') {
            monitor.classList.add('glow-active');
        } else {
            monitor.classList.remove('glow-active');
        }

        // Update toggle active states for display modes
        ['toggle-amber', 'toggle-green', 'toggle-white', 'toggle-inverse', 'toggle-bloom'].forEach(id => {
            const t = byId(id);
            if (t) t.classList.toggle('active', t.dataset.mode === mode);
        });
    }

    function applySettings() {
        const screen = byId('crt-screen');
        screen.setAttribute('data-phosphor', settings.phosphor);
        screen.setAttribute('data-scanlines', settings.scanlines);
        screen.setAttribute('data-flicker', settings.flicker);
        screen.setAttribute('data-barrel', settings.distortion);

        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--scanline-opacity', settings.scanlines / 100 * 0.7);

        // Phosphor intensity
        const pl = byId('phosphor-layer');
        if (pl) pl.style.opacity = settings.phosphor / 100;

        // Flicker
        if (settings.flicker < 10) {
            screen.style.animation = 'none';
        } else {
            const dur = 0.05 + (1 - settings.flicker / 100) * 0.2;
            screen.style.animationDuration = dur + 's';
        }
    }

    function showControlPanel() {
        byId('control-panel').classList.remove('hidden');
    }

    function hideControlPanel() {
        byId('control-panel').classList.add('hidden');
    }

    // ==================== ROTARY DIAL ====================
    function initRotaryDial() {
        const dial = byId('rotary-dial');
        const knob = dial.querySelector('.dial-knob-inner');
        const indicator = dial.querySelector('.dial-indicator');
        const holes = dial.querySelectorAll('.dial-hole');

        let isDragging = false;
        let startAngle = 0;
        let currentAngle = 0;
        let currentPos = -1;

        const positions = [0, 45, 90, 135, 180, 225, 270, 315]; // 8 positions
        const posNames = ['DESK', 'FILE', 'TEXT', 'CALC', 'AUDP', 'NETW', 'CONS', 'CONF'];

        function setDialPosition(pos) {
            currentPos = pos;
            currentAngle = positions[pos];
            if (indicator) indicator.style.transform = 'rotate(' + currentAngle + 'deg)';

            // Highlight hole
            holes.forEach((h, i) => h.classList.toggle('active', i === pos));

            // Open app
            const app = holes[pos].dataset.app;
            if (app === 'desktop') {
                // Show desktop
                hideAllWindows();
            } else {
                const fileName = posNames[pos] + '.DAT';
                openApp(app, fileName);
            }

            playBeep(400 + pos * 80, 50, 'square', 0.1);
        }

        knob.addEventListener('mousedown', (e) => {
            isDragging = true;
            startAngle = currentAngle;
            playClick();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = dial.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (angle < 0) angle += 360;
            if (indicator) indicator.style.transform = 'rotate(' + angle + 'deg)';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;

            // Snap to nearest position
            let bestPos = 0;
            let bestDiff = 360;
            positions.forEach((p, i) => {
                let diff = Math.abs(p - currentAngle) % 360;
                if (diff > 180) diff = 360 - diff;
                if (diff < bestDiff) {
                    bestDiff = diff;
                    bestPos = i;
                }
            });
            setDialPosition(bestPos);
        });

        // Click on holes
        holes.forEach((hole, i) => {
            hole.addEventListener('click', () => {
                setDialPosition(i);
                playClick();
            });
        });

        // Double-click to open
        dial.addEventListener('dblclick', () => {
            hideElement(dial);
        });
    }

    // ==================== CASSETTE DECK OVERLAY ====================
    function showCassetteOverlay() {
        const overlay = byId('cassette-overlay');
        overlay.classList.add('visible');
        playBeep(600, 100, 'sine', 0.1);
    }

    function hideCassetteOverlay() {
        byId('cassette-overlay').classList.remove('visible');
    }

    function initCassetteDeck() {
        const overlay = byId('cassette-overlay');

        byId('deck-eject').addEventListener('click', () => {
            hideCassetteOverlay();
            playClick();
        });

        byId('deck-play').addEventListener('click', () => {
            const status = byId('deck-status');
            const btns = overlay.querySelectorAll('.deck-btn');
            btns.forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            status.textContent = '▶ PLAYING';
            status.style.color = '#00FF41';
            playBeep(500, 100, 'sine', 0.1);
        });

        byId('deck-stop').addEventListener('click', () => {
            const status = byId('deck-status');
            const btns = overlay.querySelectorAll('.deck-btn');
            btns.forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            status.textContent = '■ STOPPED';
            status.style.color = 'var(--text-dim)';
            playClick();
        });

        byId('deck-rewind').addEventListener('click', () => {
            const status = byId('deck-status');
            status.textContent = '⏪ REWINDING...';
            status.style.color = 'var(--phosphor-primary)';
            playBeep(300, 150, 'sawtooth', 0.08);
            simulateDeckCounter();
        });

        byId('deck-ffwd').addEventListener('click', () => {
            const status = byId('deck-status');
            status.textContent = '⏩ FAST-FORWARDING...';
            status.style.color = 'var(--phosphor-primary)';
            playBeep(500, 150, 'sawtooth', 0.08);
            simulateDeckCounter();
        });

        byId('deck-eject').addEventListener('click', () => {
            const status = byId('deck-status');
            status.textContent = '⏏ EJECTED';
            status.style.color = '#FF3030';
            playBeep(800, 50, 'square', 0.1);
        });
    }

    function simulateDeckCounter() {
        const counter = byId('deck-counter');
        let total = rand(10, 120);
        let elapsed = 0;
        const iv = setInterval(() => {
            elapsed += rand(1, 5);
            if (elapsed >= total) {
                elapsed = total;
                clearInterval(iv);
            }
            const m = Math.floor(elapsed / 60);
            const s = elapsed % 60;
            counter.textContent = '00:' + pad(m) + ':' + pad(s);
        }, 200);
    }

    // ==================== SETTINGS WINDOW ====================
    function initSettings(win) {
        const sliders = win.querySelectorAll('.setting-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                const valSpan = win.querySelector('[data-setting-val="' + slider.dataset.setting + '"]');
                if (valSpan) valSpan.textContent = slider.value + (slider.dataset.setting === 'phosphor' ? '%' :
                    slider.dataset.setting === 'scanlines' ? '%' :
                    slider.dataset.setting === 'distortion' ? '%' :
                    slider.dataset.setting === 'flicker' ? '%' :
                    slider.dataset.setting === 'volume' ? '' : '');
            });
        });
    }

    // ==================== TASKBAR BUTTONS ====================
    function setupTaskbar() {
        byId('btn-start').addEventListener('click', () => {
            playClick();
            const rect = byId('btn-start').getBoundingClientRect();
            openApp('textedit', 'AUTOEXEC.TXT');
        });

        byId('btn-desktop').addEventListener('click', () => {
            playClick();
            hideAllWindows();
        });

        byId('btn-windows').addEventListener('click', () => {
            playClick();
            // Cycle through windows
            if (openWindows.length > 0) {
                const idx = openWindows.indexOf(byId('win-' + activeWindowId));
                const next = (idx + 1) % openWindows.length;
                focusWindow(openWindows[next]);
            }
        });

        byId('btn-control-panel').addEventListener('click', () => {
            playClick();
            const panel = byId('control-panel');
            if (panel.classList.contains('hidden')) {
                showControlPanel();
            } else {
                hideControlPanel();
            }
        });

        byId('btn-dial').addEventListener('click', () => {
            playClick();
            const dial = byId('rotary-dial');
            dial.classList.toggle('hidden');
        });

        byId('btn-console').addEventListener('click', () => {
            playClick();
            const cs = byId('console-screen');
            if (cs.classList.contains('hidden')) {
                showConsole();
            } else {
                hideConsole();
            }
        });
    }

    function hideAllWindows() {
        openWindows.forEach(w => {
            w.classList.add('minimized');
            w.style.display = 'none';
        });
    }

    // ==================== TICKER TAPE ====================
    function addTickerLine(text) {
        const paper = byId('ticker-paper');
        const line = document.createElement('div');
        const now = new Date();
        line.textContent = '[' + timeStr(now) + '] ' + text;
        paper.appendChild(line);
        paper.scrollTop = paper.scrollHeight;

        // Auto-hide after 5 seconds
        tickerLines.push(line);
        setTimeout(() => {
            if (line.parentElement) {
                line.style.opacity = '0.3';
            }
        }, 5000);
    }

    function initTickerTape() {
        byId('ticker-close').addEventListener('click', () => {
            byId('ticker-tape').classList.remove('visible');
        });

        // Show ticker on any file operation
        setInterval(() => {
            if (Math.random() > 0.85) {
                const msgs = [
                    'SYSTEM IDLE',
                    'TAPE HEAD PARKED',
                    'DISK CACHE FLUSH',
                    'IRQ 7 SERVICED',
                    'MEMORY REFRESH',
                    'SCAN LINE 128',
                    'VBLANK DETECTED',
                    'UART TX BUFFER CLEAR'
                ];
                const tape = byId('ticker-tape');
                if (!tape.classList.contains('visible')) {
                    tape.classList.add('visible');
                }
                addTickerLine(msgs[rand(0, msgs.length - 1)]);
                setTimeout(() => {
                    if (document.querySelectorAll('#ticker-tape .ticker-paper div').length > 20) {
                        tape.classList.remove('visible');
                    }
                }, 3000);
            }
        }, 8000);
    }

    // ==================== KEYBOARD SHORTCUTS ====================
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Escape closes panels
            if (e.key === 'Escape') {
                hideControlPanel();
                hideConsole();
                byId('rotary-dial').classList.add('hidden');
                byId('cassette-overlay').classList.remove('visible');
                return;
            }

            // F1 = Console
            if (e.key === 'F1') {
                e.preventDefault();
                byId('btn-console').click();
            }

            // F2 = Control Panel
            if (e.key === 'F2') {
                e.preventDefault();
                byId('btn-control-panel').click();
            }

            // F3 = Dial
            if (e.key === 'F3') {
                e.preventDefault();
                byId('btn-dial').click();
            }

            // F4 = Cassette
            if (e.key === 'F4') {
                e.preventDefault();
                showCassetteOverlay();
            }

            // Ctrl+1-5 = switch display mode
            if (e.ctrlKey && '12345'.includes(e.key)) {
                e.preventDefault();
                const modes = ['amber', 'green', 'white', 'inverse', 'bloom'];
                setDisplayMode(modes[parseInt(e.key) - 1]);
            }

            // Ctrl+W = close focused window
            if (e.ctrlKey && e.key === 'w') {
                e.preventDefault();
                if (activeWindowId) {
                    const win = byId(activeWindowId);
                    if (win) closeWindow(win);
                }
            }

            // Ctrl+D = desktop
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                hideAllWindows();
            }

            // Ctrl+T = open text editor
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                openApp('textedit', 'NEW_FILE.TXT');
            }

            // Ctrl+F = file manager
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                openApp('filemanager', 'DISK-01');
            }

            // Ctrl+Shift+C = console
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                byId('btn-console').click();
            }
        });
    }

    // ==================== DESKTOP CONTEXT EFFECTS ====================
    function setupDesktopEffects() {
        const desktop = byId('desktop-area');

        // Subtle ambient cursor glow trail
        let trail = [];
        document.addEventListener('mousemove', (e) => {
            if (document.getElementById('crt-screen').contains(e.target)) {
                trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
                if (trail.length > 20) trail.shift();
            }
        });
    }

    // ==================== POWER SWITCH ====================
    function initPowerSwitch() {
        const toggle = byId('power-toggle');
        const led = byId('power-led');

        toggle.addEventListener('click', () => {
            const isOn = toggle.dataset.state === 'on';
            if (isOn) {
                // Power off
                playErrorBeep();
                byId('crt-screen').style.animation = 'none';
                byId('crt-screen').style.opacity = '0';
                led.classList.remove('active');
                toggle.dataset.state = 'off';
                toggle.classList.remove('active');

                setTimeout(() => {
                    // Show boot screen again
                    byId('crt-screen').style.opacity = '1';
                    byId('boot-screen').classList.add('active-screen');
                    byId('desktop').classList.add('hidden');
                    byId('desktop').classList.remove('active-screen');
                    byId('boot-text').innerHTML = '';
                    byId('boot-progress-fill').style.width = '0%';
                    byId('boot-memory-dump').innerHTML = '';

                    setTimeout(() => {
                        led.classList.add('active');
                        boot();
                    }, 1000);
                }, 1500);
            }
        });
    }

    // ==================== KNOBS (CSS rotation via mouse) ============
    function initKnobs() {
        document.querySelectorAll('.control-knob').forEach(knob => {
            const indicator = knob.querySelector('.knob-indicator');
            if (!indicator) return;

            let isDragging = false;
            let startY = 0;
            let startRotation = 0;

            function getRotation() {
                const style = window.getComputedStyle(indicator);
                const matrix = new DOMMatrixReadOnly(style.transform);
                return Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
            }

            knob.addEventListener('mousedown', (e) => {
                isDragging = true;
                startY = e.clientY;
                startRotation = getRotation();
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const dy = startY - e.clientY;
                let newRotation = startRotation + dy * 2;
                newRotation = clamp(newRotation, -60, 60);
                indicator.style.transform = 'translateX(-50%) rotate(' + newRotation + 'deg)';

                // Affect brightness/contrast of screen
                const screen = byId('crt-screen');
                if (knob.classList.contains('brightness-knob')) {
                    const brightness = 0.5 + (newRotation + 60) / 240;
                    screen.style.filter = screen.style.filter.replace(/brightness\([^)]*\)/, '') || '';
                    screen.style.filter += ' brightness(' + brightness + ')';
                }
                if (knob.classList.contains('contrast-knob')) {
                    const contrast = 0.5 + (newRotation + 60) / 240;
                    screen.style.filter = screen.style.filter.replace(/contrast\([^)]*\)/, '') || '';
                    screen.style.filter += ' contrast(' + contrast + ')';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
    }

    // ==================== INIT ====================
    function init() {
        setupDesktop();
        setupTaskbar();
        initControlPanel();
        initRotaryDial();
        initCassetteDeck();
        initConsole();
        initKnobs();
        initPowerSwitch();
        initTickerTape();
        setupKeyboard();
        setupDesktopEffects();
        applySettings();

        // Mark amber toggle active by default
        byId('toggle-amber').classList.add('active');
        byId('toggle-click').classList.add('active');
        byId('toggle-fan').classList.add('active');

        // Boot
        boot();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
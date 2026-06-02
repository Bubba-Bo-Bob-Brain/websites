// ============================================================
// CRONOS-7 OPERATING SYSTEM — MAIN SCRIPT
// Centralized Recursive Operating Nexus — Series 7
// Est. 1978 (Imagined)
// ============================================================

(function () {
    'use strict';

    // =============================================
    // STATE
    // =============================================
    const state = {
        booted: false,
        currentColorMode: 'amber',
        activeWindow: null,
        windows: {},
        systemTime: new Date(1978, 6, 19, 14, 32, 7),
        settings: {
            intensity: true,
            audio: true,
            printer: true,
            network: false,
            voice: false,
            powersave: true,
            barrel: true
        },
        knobs: { contrast: -45, volume: 0, speed: 30 },
        patchConnections: {
            'in-1': false, 'in-2': false, 'in-3': false,
            'out-1': false, 'out-2': false, 'out-3': false
        },
        printoutPaused: false,
        currentDrive: 'sys-drive',
        selectedFile: null
    };

    // =============================================
    // FILE SYSTEM DATA
    // =============================================
    const fileSystems = {
        'sys-drive': {
            name: 'SYS:MAIN',
            files: [
                { name: 'KERNEL.BIN', type: 'SYS', size: '42 KB', date: '03/15/78', icon: '⚙' },
                { name: 'BOOT.ROM', type: 'ROM', size: '16 KB', date: '01/02/78', icon: '🔷' },
                { name: 'CRONOS_CFG', type: 'CFG', size: '2 KB', date: '06/22/78', icon: '📋' },
                { name: 'DEVICE_DRVR', type: 'DRV', size: '28 KB', date: '05/10/78', icon: '🔌' },
                { name: 'MEMORY_MGR', type: 'SYS', size: '12 KB', date: '04/18/78', icon: '🧠' },
                { name: 'SCHEDULER', type: 'SYS', size: '8 KB', date: '04/18/78', icon: '📅' },
                { name: 'ERROR_LOG', type: 'LOG', size: '4 KB', date: '07/18/78', icon: '⚠' },
                { name: 'SYSTEM_DMP', type: 'DMP', size: '128 KB', date: '07/19/78', icon: '💾' },
                { name: 'COMMAND_SYS', type: 'CMD', size: '24 KB', date: '04/01/78', icon: '⌘' },
                { name: 'NETWORK_STACK', type: 'DRV', size: '40 KB', date: '06/15/78', icon: '🌐' },
                { name: 'AUDIO_SERV', type: 'AUD', size: '18 KB', date: '05/22/78', icon: '🔊' },
                { name: 'VIDEO_DRV', type: 'DRV', size: '36 KB', date: '06/01/78', icon: '📺' }
            ]
        },
        'data-drive': {
            name: 'DATA:ARCHIVE',
            files: [
                { name: 'RESEARCH_01', type: 'DAT', size: '256 KB', date: '02/28/78', icon: '📊' },
                { name: 'RESEARCH_02', type: 'DAT', size: '512 KB', date: '03/15/78', icon: '📊' },
                { name: 'WEATHER_MODEL', type: 'DAT', size: '128 KB', date: '06/01/78', icon: '🌀' },
                { name: 'POPULATION_CSV', type: 'TBL', size: '64 KB', date: '05/20/78', icon: '📈' },
                { name: 'GENOME_SEQ_A', type: 'DAT', size: '1024 KB', date: '07/01/78', icon: '🧬' },
                { name: 'ENCRYPTED_09', type: 'ENC', size: '32 KB', date: '07/10/78', icon: '🔒' },
                { name: 'CENSUS_1970', type: 'TBL', size: '256 KB', date: '01/15/78', icon: '📊' },
                { name: 'STAR_CHARTS', type: 'DAT', size: '192 KB', date: '03/20/78', icon: '⭐' },
                { name: 'SEISMIC_DATA', type: 'DAT', size: '340 KB', date: '04/08/78', icon: '📊' }
            ]
        },
        'util-drive': {
            name: 'UTIL:TOOLS',
            files: [
                { name: 'TEXT_EDIT', type: 'APP', size: '48 KB', date: '03/01/78', icon: '✏' },
                { name: 'SPREADSHEET', type: 'APP', size: '96 KB', date: '04/12/78', icon: '📊' },
                { name: 'COMPILER_V2', type: 'APP', size: '256 KB', date: '06/30/78', icon: '⚡' },
                { name: 'DEBUG_TOOL', type: 'APP', size: '64 KB', date: '05/28/78', icon: '🔍' },
                { name: 'DISK_FMT', type: 'UTL', size: '16 KB', date: '02/14/78', icon: '💽' },
                { name: 'GRAFX_LIB', type: 'LIB', size: '128 KB', date: '07/05/78', icon: '🎨' },
                { name: 'SORT_UTIL', type: 'APP', size: '32 KB', date: '04/20/78', icon: '🔀' }
            ]
        },
        'print-drive': {
            name: 'PRINT:OUTPUT',
            files: [
                { name: 'REPORT_77A', type: 'RPT', size: '16 KB', date: '07/01/78', icon: '📄' },
                { name: 'REPORT_77B', type: 'RPT', size: '24 KB', date: '07/08/78', icon: '📄' },
                { name: 'INVENTORY_Q3', type: 'RPT', size: '32 KB', date: '06/30/78', icon: '📋' },
                { name: 'PRINT_QUEUE', type: 'QUE', size: '4 KB', date: '07/19/78', icon: '🖨' }
            ]
        },
        'archive-drive': {
            name: 'ARCHIVE:DEEP',
            files: [
                { name: 'BACKUP_1976', type: 'ARC', size: '2048 KB', date: '12/31/76', icon: '🗄' },
                { name: 'BACKUP_1977', type: 'ARC', size: '4096 KB', date: '12/31/77', icon: '🗄' },
                { name: 'LEGACY_CODE', type: 'SRC', size: '512 KB', date: '01/15/78', icon: '💾' },
                { name: 'OPERATORS_LOG', type: 'LOG', size: '128 KB', date: '07/18/78', icon: '📝' },
                { name: 'VOICE_REC_042', type: 'AUD', size: '256 KB', date: '06/04/78', icon: '🎤' },
                { name: 'FORTRAN_SRC', type: 'SRC', size: '64 KB', date: '02/28/76', icon: '📜' }
            ]
        }
    };

    // =============================================
    // BOOT SEQUENCE
    // =============================================
    const bootMessages = [
        { text: 'CRONOS-7 BIOS v3.4.1 — (C) 1978 Cronos Corp', delay: 200 },
        { text: 'CPU: CRONOS-CP7 @ 2.1MHz — 8-bit Parallel Bus', delay: 300 },
        { text: 'RAM: 64K Dynamic — Checking Memory Banks...', delay: 250 },
        { text: '  Bank 0: 0x0000-0x3FFF [OK]', delay: 150 },
        { text: '  Bank 1: 0x4000-0x7FFF [OK]', delay: 150 },
        { text: '  Bank 2: 0x8000-0xBFFF [OK]', delay: 150 },
        { text: '  Bank 3: 0xC000-0xFFFF [OK]', delay: 150 },
        { text: 'ROM: 16K Firmware — Integrity Check: PASSED', delay: 300 },
        { text: 'TAPE: CRONOS TAPESTRAN 7720 — Online', delay: 200 },
        { text: 'DSK: VOLUME SYS:MAIN — 1024 KB, 128 Files Max', delay: 200 },
        { text: 'DSK: VOLUME DATA:ARCHIVE — 4096 KB, 512 Files Max', delay: 200 },
        { text: 'NET: REMOTE TAPE LINK — Disconnected', delay: 200 },
        { text: 'PRT: Line Printer — Ready', delay: 150 },
        { text: 'KBD: Model 7720 Terminal — Online', delay: 150 },
        { text: 'CRT: Phosphor Display — Geometry Calibrated', delay: 200 },
        { text: '', delay: 200 },
        { text: 'Loading Executive Kernel...', delay: 400 },
        { text: 'Initializing Process Scheduler...', delay: 300 },
        { text: 'Mounting Volume SYS:MAIN...', delay: 250 },
        { text: 'Mounting Volume DATA:ARCHIVE...', delay: 250 },
        { text: 'Loading User Environment...', delay: 300 },
        { text: '', delay: 100 },
        { text: 'CRONOS-7 Desktop v3.4.1 — Ready.', delay: 300 },
        { text: 'Type HELP for command reference.', delay: 200 },
        { text: '', delay: 100 }
    ];

    function runBootSequence() {
        const bootText = document.getElementById('boot-text');
        const memBars = document.querySelectorAll('.mem-bar');
        let index = 0;

        function showNextMessage() {
            if (index >= bootMessages.length) {
                setTimeout(() => {
                    document.getElementById('boot-screen').classList.add('hidden');
                    state.booted = true;
                    startClock();
                    startVUMeters();
                    startPrintout();
                    animateDesktopIcons();
                    startAmbientTapeIdle();
                }, 800);
                return;
            }
            const msg = bootMessages[index];
            bootText.textContent = msg.text;
            index++;
            setTimeout(showNextMessage, msg.delay);
        }

        setTimeout(() => {
            memBars.forEach((bar) => {
                bar.style.height = 60 + Math.random() * 35 + '%';
            });
        }, 300);

        setTimeout(showNextMessage, 1500);
    }

    // =============================================
    // SYSTEM CLOCK
    // =============================================
    function startClock() {
        function updateClock() {
            if (!state.booted) return;
            state.systemTime = new Date(state.systemTime.getTime() + 1000);

            const h = String(state.systemTime.getHours()).padStart(2, '0');
            const m = String(state.systemTime.getMinutes()).padStart(2, '0');
            const s = String(state.systemTime.getSeconds()).padStart(2, '0');
            const mo = String(state.systemTime.getMonth() + 1).padStart(2, '0');
            const d = String(state.systemTime.getDate()).padStart(2, '0');
            const y = state.systemTime.getFullYear();

            document.getElementById('system-time').textContent = h + ':' + m + ':' + s;
            document.getElementById('system-date').textContent = mo + '/' + d + '/' + y;
            document.getElementById('task-time').textContent = h + ':' + m;

            const seconds = state.systemTime.getSeconds() + state.systemTime.getMilliseconds() / 1000;
            const minutes = state.systemTime.getMinutes() + seconds / 60;
            const hours = (state.systemTime.getHours() % 12) + minutes / 60;

            document.getElementById('second-hand').style.transform = 'rotate(' + (seconds * 6) + 'deg)';
            document.getElementById('minute-hand').style.transform = 'rotate(' + (minutes * 6) + 'deg)';
            document.getElementById('hour-hand').style.transform = 'rotate(' + (hours * 30) + 'deg)';
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // =============================================
    // VU METERS
    // =============================================
    function startVUMeters() {
        function updateVU() {
            if (!state.booted) return;

            const cpuVal = 20 + Math.random() * 60;
            const memVal = 40 + Math.random() * 40;
            const dskVal = 5 + Math.random() * 30;

            document.getElementById('vu-cpu').style.height = cpuVal + '%';
            document.getElementById('vu-mem').style.height = memVal + '%';
            document.getElementById('vu-dsk').style.height = dskVal + '%';

            const cpuAngle = -30 + (cpuVal / 100) * 60;
            const memAngle = -30 + (memVal / 100) * 60;
            const dskAngle = -30 + (dskVal / 100) * 60;

            document.getElementById('vu-needle-cpu').style.transform = 'translateX(-50%) rotate(' + cpuAngle + 'deg)';
            document.getElementById('vu-needle-mem').style.transform = 'translateX(-50%) rotate(' + memAngle + 'deg)';
            document.getElementById('vu-needle-dsk').style.transform = 'translateX(-50%) rotate(' + dskAngle + 'deg)';

            document.getElementById('vu-cpu-val').textContent = Math.round(cpuVal) + '%';
            document.getElementById('vu-mem-val').textContent = Math.round(memVal) + '%';
            document.getElementById('vu-dsk-val').textContent = Math.round(dskVal) + '%';
        }
        updateVU();
        setInterval(updateVU, 1500);
    }

    // =============================================
    // DESKTOP ICON IDLE ANIMATION
    // =============================================
    function animateDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon[data-type="drive"]');
        icons.forEach(function (icon, i) {
            const reel = icon.querySelector('.drive-reel');
            setTimeout(function () {
                reel.classList.add('spinning');
                setTimeout(function () { reel.classList.remove('spinning'); }, 2000);
            }, i * 300);
        });

        setInterval(function () {
            if (state.activeWindow) return;
            const icon = icons[Math.floor(Math.random() * icons.length)];
            const reel = icon.querySelector('.drive-reel');
            reel.classList.add('spinning');
            setTimeout(function () { reel.classList.remove('spinning'); }, 1500);
        }, 8000);
    }

    function startAmbientTapeIdle() {
        setInterval(function () {
            if (state.activeWindow !== 'file-manager-window') return;
            const reels = document.querySelectorAll('#file-manager-window .reel-inner');
            reels.forEach(function (r) {
                if (!r.classList.contains('spinning')) {
                    r.style.transition = 'transform 0.4s ease';
                    r.style.transform = 'rotate(' + (Math.random() * 12 - 6) + 'deg)';
                    setTimeout(function () { r.style.transform = 'rotate(0deg)'; }, 400);
                }
            });
        }, 4000);
    }

    // =============================================
    // WINDOW MANAGEMENT
    // =============================================
    function openWindow(windowId) {
        var win = document.getElementById(windowId);
        if (win) {
            win.classList.add('visible');
            state.activeWindow = windowId;
            state.windows[windowId] = true;
            updateTaskButtons();

            var titles = {
                'file-manager-window': 'FILE MANAGER — TAPESTRAN 7720 ONLINE',
                'settings-window': 'SYSTEM CONTROL PANEL — ACCESS GRANTED'
            };
            if (titles[windowId]) {
                addPrintoutLine('> WINDOW_OPEN: ' + titles[windowId], 'success');
            }
        }
    }

    function closeWindow(windowId) {
        var win = document.getElementById(windowId);
        if (win) {
            win.classList.remove('visible');
            if (state.activeWindow === windowId) state.activeWindow = null;
            delete state.windows[windowId];
            updateTaskButtons();
        }
    }

    function minimizeWindow(windowId) {
        var win = document.getElementById(windowId);
        if (win) {
            win.classList.remove('visible');
            if (state.activeWindow === windowId) state.activeWindow = null;
            updateTaskButtons();
        }
    }

    function updateTaskButtons() {
        document.querySelectorAll('.task-btn').forEach(function (btn) {
            var winId = btn.dataset.window + '-window';
            btn.classList.toggle('active', !!state.windows[winId]);
        });
    }

    // Window dragging
    function initWindowDrag(win) {
        var titleBar = win.querySelector('.window-title-bar');
        var isDragging = false, startX, startY, startLeft, startTop;

        titleBar.addEventListener('mousedown', function (e) {
            if (e.target.closest('.window-controls')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            var rect = win.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            win.style.transition = 'none';
            // Bring to front
            document.querySelectorAll('.window.visible').forEach(function (w) { w.style.zIndex = 10; });
            win.style.zIndex = 50;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            win.style.left = (startLeft + e.clientX - startX) + 'px';
            win.style.top = (startTop + e.clientY - startY) + 'px';
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) { isDragging = false; win.style.transition = ''; }
        });
    }

    // =============================================
    // FILE MANAGER / TAPE DECK
    // =============================================
    function populateFileList(driveId) {
        var fs = fileSystems[driveId];
        if (!fs) return;

        var tape = document.getElementById('file-list-tape');
        tape.innerHTML = '';

        document.getElementById('tape-label-left').textContent = fs.name.split(':')[0] + ':';
        document.getElementById('file-manager-title').textContent = fs.name + ' — FILE MANAGER';
        state.selectedFile = null;

        fs.files.forEach(function (file, i) {
            var entry = document.createElement('div');
            entry.className = 'file-entry';
            entry.innerHTML =
                '<span class="file-icon">' + file.icon + '</span>' +
                '<span class="file-name">' + file.name + '</span>' +
                '<span class="file-type-badge">' + file.type + '</span>' +
                '<span class="file-size">' + file.size + '</span>' +
                '<span class="file-date">' + file.date + '</span>';

            entry.addEventListener('click', function () {
                tape.querySelectorAll('.file-entry').forEach(function (e) { e.classList.remove('selected'); });
                entry.classList.add('selected');
                state.selectedFile = file;

                document.getElementById('file-info-name').textContent = file.name;
                document.getElementById('file-info-size').textContent = file.size;
                document.getElementById('file-info-type').textContent = file.type;
                document.getElementById('file-info-date').textContent = file.date;

                addPrintoutLine('> SELECT: ' + file.name + ' (' + file.size + ', ' + file.type + ')', '');

                var tapeLed = document.getElementById('tape-led');
                tapeLed.classList.add('active', 'blink-fast');
                setTimeout(function () { tapeLed.classList.remove('active', 'blink-fast'); }, 800);
            });

            entry.addEventListener('dblclick', function () {
                addPrintoutLine('> LOAD: ' + file.name + ' — Accessing tape block...', 'printing');
                simulateTapeAccess(function () {
                    addPrintoutLine('> LOADED: ' + file.name + ' — ' + file.size + ' transferred to buffer.', 'success');
                });
            });

            tape.appendChild(entry);
        });

        updateReelTape(driveId);
        updateReelCounters();
    }

    function updateReelTape(driveId) {
        var fs = fileSystems[driveId];
        var fileCount = fs ? fs.files.length : 0;

        ['left-tape', 'right-tape'].forEach(function (id) {
            var el = document.getElementById(id);
            el.innerHTML = '';
            for (var i = 0; i < fileCount; i++) {
                var mark = document.createElement('div');
                mark.style.cssText =
                    'position:absolute;width:3px;height:3px;background:var(--phosphor-dim);' +
                    'border-radius:50%;top:' + (12 + Math.random() * 76) + '%;left:' + (5 + Math.random() * 90) + '%;' +
                    'box-shadow:0 0 2px var(--phosphor-dim);';
                el.appendChild(mark);
            }
        });
    }

    function updateReelCounters() {
        var total = fileSystems[state.currentDrive] ? fileSystems[state.currentDrive].files.length * 12 : 0;
        var pos = Math.floor(Math.random() * total);
        document.getElementById('left-counter').textContent = String(pos).padStart(3, '0');
        document.getElementById('right-counter').textContent = String(total - pos).padStart(3, '0');
    }

    function simulateTapeAccess(callback) {
        var reels = document.querySelectorAll('#file-manager-window .tape-reel .reel-inner');
        reels.forEach(function (r) { r.classList.add('spinning'); });

        var interval = setInterval(function () {
            var pct = Math.random();
            document.getElementById('tape-vu-left').style.width = (pct * 100) + '%';
            document.getElementById('tape-vu-right').style.width = ((1 - pct) * 100) + '%';
        }, 80);

        setTimeout(function () {
            clearInterval(interval);
            reels.forEach(function (r) { r.classList.remove('spinning'); });
            document.getElementById('tape-vu-left').style.width = '0%';
            document.getElementById('tape-vu-right').style.width = '0%';
            if (callback) callback();
        }, 1800 + Math.random() * 800);
    }

    // Transport Controls
    document.getElementById('play-btn').addEventListener('click', function () {
        if (state.selectedFile) {
            addPrintoutLine('> ACCESS: Reading ' + state.selectedFile.name + ' from tape...', 'printing');
            simulateTapeAccess(function () {
                addPrintoutLine('> OK: ' + state.selectedFile.name + ' loaded into memory buffer.', 'success');
            });
            document.getElementById('fm-status').textContent = 'ACCESSING';
            document.getElementById('fm-led').classList.add('active');
            setTimeout(function () {
                document.getElementById('fm-status').textContent = 'READY';
                document.getElementById('fm-led').classList.remove('active');
            }, 2000);
        } else {
            addPrintoutLine('> ERROR: No file selected. Click a file entry to select.', 'error');
        }
    });

    document.getElementById('stop-btn').addEventListener('click', function () {
        addPrintoutLine('> CLOSE: Tape transport stopped.', '');
        document.querySelectorAll('#file-manager-window .tape-reel .reel-inner').forEach(function (r) { r.classList.remove('spinning'); });
        document.getElementById('fm-status').textContent = 'READY';
        document.getElementById('fm-led').classList.remove('active');
    });

    document.getElementById('rewind-btn').addEventListener('click', function () {
        addPrintoutLine('> REWIND: Seeking to beginning of tape...', 'printing');
        var leftReel = document.getElementById('left-reel');
        leftReel.classList.add('rewinding');
        setTimeout(function () { leftReel.classList.remove('rewinding'); }, 800);
        simulateTapeAccess(function () {
            addPrintoutLine('> OK: Tape position reset to block 000.', 'success');
            document.getElementById('left-counter').textContent = '000';
            document.getElementById('right-counter').textContent = String(
                (fileSystems[state.currentDrive] ? fileSystems[state.currentDrive].files.length * 12 : 0)
            ).padStart(3, '0');
        });
    });

    document.getElementById('fwd-btn').addEventListener('click', function () {
        addPrintoutLine('> FWD: Advancing tape to next file marker...', 'printing');
        var count = Math.floor(Math.random() * 200) + 10;
        document.getElementById('right-counter').textContent = String(count).padStart(3, '0');
        document.getElementById('left-counter').textContent = String(256 - count).padStart(3, '0');
        simulateTapeAccess(function () {
            addPrintoutLine('> OK: Tape advanced. Next file in buffer zone.', 'success');
        });
    });

    document.getElementById('eject-btn').addEventListener('click', function () {
        addPrintoutLine('> EJECT: Unloading tape cartridge...', 'printing');
        simulateTapeAccess(function () {
            addPrintoutLine('> EJECTED: Cartridge removed safely.', 'warning');
            if (state.currentDrive === 'sys-drive') {
                state.currentDrive = 'data-drive';
                populateFileList('data-drive');
                addPrintoutLine('> INSERT: DATA:ARCHIVE mounted on VOL I.', 'success');
            } else if (state.currentDrive === 'data-drive') {
                state.currentDrive = 'util-drive';
                populateFileList('util-drive');
                addPrintoutLine('> INSERT: UTIL:TOOLS mounted on VOL I.', 'success');
            } else if (state.currentDrive === 'util-drive') {
                state.currentDrive = 'print-drive';
                populateFileList('print-drive');
                addPrintoutLine('> INSERT: PRINT:OUTPUT mounted on VOL I.', 'success');
            } else if (state.currentDrive === 'print-drive') {
                state.currentDrive = 'archive-drive';
                populateFileList('archive-drive');
                addPrintoutLine('> INSERT: ARCHIVE:DEEP mounted on VOL I.', 'success');
            } else {
                state.currentDrive = 'sys-drive';
                populateFileList('sys-drive');
                addPrintoutLine('> INSERT: SYS:MAIN mounted on VOL I.', 'success');
            }
        });
    });

    document.getElementById('rec-btn').addEventListener('click', function () {
        addPrintoutLine('> WRITE: Tape recording mode engaged — writing file...', 'warning');
        document.getElementById('tape-vu-right').style.width = '75%';
        document.getElementById('tape-vu-right').style.background = 'linear-gradient(90deg, var(--danger), #ff6040)';
        simulateTapeAccess(function () {
            document.getElementById('tape-vu-right').style.width = '0%';
            document.getElementById('tape-vu-right').style.background = '';
            addPrintoutLine('> OK: Write complete. Verify with READ.', 'success');
        });
    });

    // =============================================
    // SETTINGS PANEL
    // =============================================
    document.querySelectorAll('.toggle-switch input').forEach(function (input) {
        input.addEventListener('change', function () {
            var setting = this.closest('.toggle-switch').dataset.setting;
            state.settings[setting] = this.checked;
            var label = this.nextElementSibling;

            if (this.checked) {
                addPrintoutLine('> SET: ' + setting.toUpperCase() + ' = ON', '');
                label.style.borderColor = 'var(--phosphor-dim)';
                label.style.boxShadow = 'inset 0 0 6px var(--phosphor-glow)';
            } else {
                addPrintoutLine('> SET: ' + setting.toUpperCase() + ' = OFF', '');
                label.style.borderColor = '#333';
                label.style.boxShadow = 'none';
            }

            if (setting === 'barrel') {
                var barrel = document.querySelector('.barrel-distortion');
                var mask = document.querySelector('.crt-mask');
                barrel.style.opacity = this.checked ? '1' : '0';
                mask.style.opacity = this.checked ? '1' : '0';
            }

            if (setting === 'powersave') {
                document.querySelector('.scanlines').style.opacity = this.checked ? '0.08' : '0';
            }

            if (setting === 'intensity') {
                document.querySelector('.phosphor-glow').style.opacity = this.checked ? '1' : '0.15';
            }
        });

        if (input.checked) {
            var label = input.nextElementSibling;
            label.style.borderColor = 'var(--phosphor-dim)';
            label.style.boxShadow = 'inset 0 0 6px var(--phosphor-glow)';
        }
    });

    // Color mode
    document.querySelectorAll('.color-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.color-btn').forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            var mode = this.dataset.color;
            state.currentColorMode = mode;
            document.body.classList.remove('green-phosphor', 'white-phosphor');
            if (mode === 'green') document.body.classList.add('green-phosphor');
            if (mode === 'white') document.body.classList.add('white-phosphor');
            addPrintoutLine('> SET: PHOSPHOR_MODE = ' + mode.toUpperCase(), 'success');
        });
    });

    // Analog knobs
    document.querySelectorAll('.analog-knob').forEach(function (knob) {
        var dragging = false, startY, startVal;
        var param = knob.dataset.knob;

        knob.addEventListener('mousedown', function (e) {
            dragging = true;
            startY = e.clientY;
            startVal = state.knobs[param];
            e.preventDefault();
        });

        knob.addEventListener('touchstart', function (e) {
            dragging = true;
            startY = e.touches[0].clientY;
            startVal = state.knobs[param];
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            var newVal = Math.max(-90, Math.min(90, startVal + (startY - e.clientY)));
            state.knobs[param] = newVal;
            knob.querySelector('.knob-indicator').style.transform = 'translateX(-50%) rotate(' + newVal + 'deg)';
            if (param === 'contrast') {
                var b = 0.5 + (newVal + 90) / 180 * 0.5;
                document.querySelector('.screen-content').style.filter = 'brightness(' + b + ')';
            }
        });

        document.addEventListener('touchmove', function (e) {
            if (!dragging) return;
            var newVal = Math.max(-90, Math.min(90, startVal + (startY - e.touches[0].clientY)));
            state.knobs[param] = newVal;
            knob.querySelector('.knob-indicator').style.transform = 'translateX(-50%) rotate(' + newVal + 'deg)';
        });

        function endDrag() {
            if (dragging) {
                dragging = false;
                addPrintoutLine('> SET: ' + param.toUpperCase() + ' = ' + state.knobs[param] + '°', '');
            }
        }
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    });

    // =============================================
    // PATCH BAY
    // =============================================
    var firstJack = null;

    document.querySelectorAll('.patch-jack').forEach(function (jack) {
        jack.addEventListener('click', function () {
            if (!firstJack) {
                firstJack = this;
                this.classList.add('connected');
                addPrintoutLine('> PATCH: Jack ' + this.dataset.jack + ' selected as source.', 'printing');
            } else if (firstJack === this) {
                this.classList.remove('connected');
                firstJack = null;
            } else {
                this.classList.add('connected');
                addPrintoutLine('> PATCH: ' + firstJack.dataset.jack + ' → ' + this.dataset.jack + ' connected.', 'success');

                var cable = document.getElementById('patch-cable-1');
                var path = cable.querySelector('path');
                var ny1 = 10 + Math.random() * 20;
                var ny2 = 30 + Math.random() * 20;
                path.setAttribute('d', 'M 10 20 C 30 ' + ny1 + ', 70 ' + ny2 + ', 90 20');
                cable.style.stroke = 'var(--phosphor)';
                cable.style.opacity = '0.8';
                setTimeout(function () { cable.style.opacity = '0.15'; }, 4000);

                firstJack = null;
            }
        });
    });

    // =============================================
    // ROTARY DIAL NAVIGATION
    // =============================================
    var dialEl = document.getElementById('dial-hole');
    var dialInput = document.getElementById('dial-input');
    var dialRotation = 0;
    var dialDragging = false, dialStartAngle, dialStartRotation;

    function getDialAngle(cx, cy, px, py) {
        return Math.atan2(py - cy, px - cx) * (180 / Math.PI);
    }

    var dialFace = document.querySelector('.rotary-dial');

    dialEl.addEventListener('mousedown', function (e) {
        var rect = dialFace.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        dialDragging = true;
        dialStartAngle = getDialAngle(cx, cy, e.clientX, e.clientY);
        dialStartRotation = dialRotation;
        e.preventDefault();
    });

    dialEl.addEventListener('touchstart', function (e) {
        var rect = dialFace.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        dialDragging = true;
        dialStartAngle = getDialAngle(cx, cy, e.touches[0].clientX, e.touches[0].clientY);
        dialStartRotation = dialRotation;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('mousemove', function (e) {
        if (!dialDragging) return;
        var rect = dialFace.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var cur = getDialAngle(cx, cy, e.clientX, e.clientY);
        var diff = cur - dialStartAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        dialRotation = Math.max(-120, Math.min(120, dialStartRotation + diff));
        dialEl.style.transform = 'translate(-50%, -50%) rotate(' + dialRotation + 'deg)';
        var num = Math.round(((dialRotation + 120) / 240) * 9);
        if (num >= 0 && num <= 9) dialInput.value = num.toString();
    });

    document.addEventListener('touchmove', function (e) {
        if (!dialDragging) return;
        var rect = dialFace.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var cur = getDialAngle(cx, cy, e.touches[0].clientX, e.touches[0].clientY);
        var diff = cur - dialStartAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        dialRotation = Math.max(-120, Math.min(120, dialStartRotation + diff));
        dialEl.style.transform = 'translate(-50%, -50%) rotate(' + dialRotation + 'deg)';
        var num = Math.round(((dialRotation + 120) / 240) * 9);
        if (num >= 0 && num <= 9) dialInput.value = num.toString();
    });

    function endDialDrag() {
        if (dialDragging) { dialDragging = false; }
    }
    document.addEventListener('mouseup', endDialDrag);
    document.addEventListener('touchend', endDialDrag);

    // Dial number clicks
    document.querySelectorAll('.dial-num').forEach(function (num) {
        num.addEventListener('click', function () {
            dialInput.value = this.textContent;
            addPrintoutLine('> DIAL: Input \'' + this.textContent + '\'', '');
            var pos = parseInt(this.dataset.pos);
            var angle = (pos / 10) * 360 - 90;
            dialEl.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg)';
        });
    });

    document.getElementById('dial-enter-btn').addEventListener('click', function () {
        if (dialInput.value) {
            addPrintoutLine('> EXECUTE: Address "' + dialInput.value + '" dispatched to network.', 'success');
            dialInput.value = '';
        }
    });

    // =============================================
    // PRINTOUT CONSOLE
    // =============================================
    var consoleAutoMessages = [
        { text: 'SYS: Periodic memory refresh completed.', type: '' },
        { text: 'DSK: Volume SYS:MAIN — 42 files indexed.', type: 'success' },
        { text: 'NET: Remote tape link polling... timeout.', type: 'error' },
        { text: 'USR: Desktop interaction logged.', type: '' },
        { text: 'CRT: Phosphor warm-up cycle complete.', type: '' },
        { text: 'PRC: CPU temperature nominal (42°C).', type: '' },
        { text: 'AUD: No audio alerts in queue.', type: '' },
        { text: 'SYS: All daemon processes running.', type: 'success' },
        { text: 'TPE: Tape transport calibration OK.', type: '' },
        { text: 'SEC: No unauthorized access attempts.', type: 'success' },
        { text: 'PWR: Power supply stable at 5.0V ±0.1V.', type: '' },
        { text: 'MEM: Garbage collection pass completed.', type: '' },
        { text: 'DSK: Defragmentation not required.', type: '' },
        { text: 'NET: Last successful sync: never.', type: 'warning' },
        { text: 'USR: Welcome back, Operator.', type: 'accent' }
    ];

    function addPrintoutLine(text, type) {
        if (!state.settings.printer && type !== 'error') return;

        var paper = document.getElementById('console-paper');
        var line = document.createElement('div');
        line.className = 'print-line ' + type;

        var now = new Date();
        var ts = String(now.getHours()).padStart(2, '0') + ':' +
                 String(now.getMinutes()).padStart(2, '0') + ':' +
                 String(now.getSeconds()).padStart(2, '0');
        line.textContent = '[' + ts + '] ' + text;

        paper.appendChild(line);
        paper.scrollTop = paper.scrollHeight;

        line.classList.add('printing');
        setTimeout(function () { line.classList.remove('printing'); }, 80);
    }

    function startPrintout() {
        var msgIndex = 0;
        setInterval(function () {
            if (!state.printoutPaused && state.booted && state.settings.printer) {
                addPrintoutLine(consoleAutoMessages[msgIndex].text, consoleAutoMessages[msgIndex].type);
                msgIndex = (msgIndex + 1) % consoleAutoMessages.length;
            }
        }, 8000);
    }

    document.getElementById('console-feed').addEventListener('click', function () {
        addPrintoutLine('--- FORM FEED ---', '');
        var paper = document.getElementById('console-paper');
        var holes = document.createElement('div');
        holes.className = 'paper-holes-row';
        paper.appendChild(holes);
    });

    document.getElementById('console-pause').addEventListener('click', function () {
        state.printoutPaused = !state.printoutPaused;
        this.textContent = state.printoutPaused ? '▷ RESUME' : '‖ PAUSE';
        addPrintoutLine(state.printoutPaused ? '> PRINTER PAUSED' : '> PRINTER RESUMED', 'warning');
    });

    document.getElementById('console-clear').addEventListener('click', function () {
        var paper = document.getElementById('console-paper');
        var holes = paper.querySelectorAll('.paper-holes-row');
        paper.innerHTML = '';
        holes.forEach(function (h) { paper.appendChild(h); });
        addPrintoutLine('Buffer cleared.', '');
    });

    // =============================================
    // TASK BAR & SYSTEM BUTTONS
    // =============================================
    document.querySelectorAll('.task-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var winId = btn.dataset.window + '-window';
            var win = document.getElementById(winId);
            if (win.classList.contains('visible')) {
                minimizeWindow(winId);
            } else {
                openWindow(winId);
            }
        });
    });

    document.getElementById('btn-shutdown').addEventListener('click', function () {
        var overlay = document.getElementById('shutdown-overlay');
        overlay.classList.add('active');
        addPrintoutLine('> SHUTDOWN INITIATED — Saving state to NVRAM...', 'error');

        var dotCount = 0;
        var shutdownDots = document.querySelectorAll('.shutdown-dot');
        var dotInterval = setInterval(function () {
            shutdownDots.forEach(function (d, i) {
                d.style.opacity = i <= dotCount ? '1' : '0.2';
            });
            dotCount = (dotCount + 1) % 3;
        }, 500);

        setTimeout(function () {
            clearInterval(dotInterval);
            addPrintoutLine('> SHUTDOWN COMPLETE — It is now safe to power off.', 'error');
        }, 3000);

        setTimeout(function () {
            document.getElementById('boot-screen').classList.remove('hidden');
            overlay.classList.remove('active');
            state.booted = false;
            document.querySelectorAll('.window.visible').forEach(function (w) { w.classList.remove('visible'); });
            shutdownDots.forEach(function (d) { d.style.opacity = '1'; });
            setTimeout(function () { runBootSequence(); }, 500);
        }, 6000);
    });

    document.getElementById('btn-restart').addEventListener('click', function () {
        addPrintoutLine('> RESTART: System rebooting...', 'warning');
        setTimeout(function () {
            document.querySelectorAll('.window.visible').forEach(function (w) { w.classList.remove('visible'); });
            document.getElementById('boot-screen').classList.remove('hidden');
            state.booted = false;
            setTimeout(function () { runBootSequence(); }, 800);
        }, 1500);
    });

    // =============================================
    // WINDOW CONTROLS
    // =============================================
    document.querySelectorAll('.win-close').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeWindow(this.closest('.window').id);
        });
    });

    document.querySelectorAll('.win-min').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            minimizeWindow(this.closest('.window').id);
        });
    });

    document.querySelectorAll('.win-max').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var win = this.closest('.window');
            win.classList.toggle('maximized');
        });
    });

    // =============================================
    // DESKTOP ICON DOUBLE-CLICK
    // =============================================
    document.querySelectorAll('.desktop-icon[data-type="drive"]').forEach(function (icon) {
        icon.addEventListener('dblclick', function () {
            state.currentDrive = this.dataset.id;
            populateFileList(this.dataset.id);
            openWindow('file-manager-window');
        });

        icon.addEventListener('click', function () {
            var reels = this.querySelectorAll('.drive-reel');
            reels.forEach(function (r) {
                r.classList.add('spinning');
                setTimeout(function () { r.classList.remove('spinning'); }, 1000);
            });
        });
    });

    document.querySelector('.desktop-icon[data-type="terminal"]').addEventListener('dblclick', function () {
        addPrintoutLine('> TERMINAL: Command interface opened.', 'printing');
        addPrintoutLine('> CRONOS-7 v3.4.1 — Command Ready', '');
        addPrintoutLine('> Type HELP for available commands.', '', '');
    });

    document.querySelector('.desktop-icon[data-type="calculator"]').addEventListener('dblclick', function () {
        addPrintoutLine('> ANALYZER: Scientific calculator loaded.', 'printing');
        addPrintoutLine('> PI approximation: 3.14159265', '');
    });

    // =============================================
    // CRT FLICKER
    // =============================================
    setInterval(function () {
        if (!state.booted) return;
        if (Math.random() > 0.96) {
            var screen = document.querySelector('.crt-screen');
            screen.style.opacity = '0.92';
            setTimeout(function () { screen.style.opacity = ''; }, 50 + Math.random() * 100);
        }
    }, 3000);

    // =============================================
    // INIT
    // =============================================
    runBootSequence();

})();
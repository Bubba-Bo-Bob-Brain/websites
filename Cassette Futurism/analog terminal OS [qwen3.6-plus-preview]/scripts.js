/* ═══════════════════════════════════════════════════════
   ANALOG/OS v3.7 — Mainframe Control Scripts
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ───────────────────────────────────────────────────────
    // State & Configuration
    // ───────────────────────────────────────────────────────
    const state = {
        clockInterval: null,
        meterInterval: null,
        tapeInterval: null,
        tapeTime: 0,
        tapePlaying: false,
        tapeRewinding: false,
        tapeFFing: false,
        currentMode: 'FILES',
        selectedFile: null,
        brightness: 1.0,
        operationCount: 47,
        isOnline: true
    };

    // ───────────────────────────────────────────────────────
    // DOM References
    // ───────────────────────────────────────────────────────
    const elements = {
        clock: document.getElementById('system-clock'),
        date: document.getElementById('system-date'),
        cpuNeedle: document.getElementById('cpu-needle'),
        memNeedle: document.getElementById('mem-needle'),
        diskNeedle: document.getElementById('disk-needle'),
        reelLeft: document.getElementById('reel-left'),
        reelRight: document.getElementById('reel-right'),
        tapeCounter: document.getElementById('tape-counter'),
        tapeBtns: document.querySelectorAll('.tape-btn'),
        fileList: document.getElementById('file-list'),
        previewContent: document.getElementById('preview-content'),
        rotaryKnob: document.getElementById('rotary-knob'),
        rotaryDisplay: document.getElementById('rotary-display'),
        rotaryMarkers: document.querySelectorAll('.rotary-marker'),
        switches: document.querySelectorAll('.toggle-switch'),
        nixieDigits: document.querySelectorAll('.nixie-digit span'),
        logContent: document.getElementById('log-content'),
        logClearBtn: document.getElementById('log-clear'),
        commandInput: document.getElementById('command-input'),
        brightnessSlider: document.getElementById('brightness-slider'),
        screen: document.getElementById('screen'),
        operationOverlay: document.getElementById('operation-overlay'),
        operationText: document.getElementById('operation-text'),
        contextMenu: document.getElementById('context-menu'),
        stripStatus: document.getElementById('strip-status'),
        indicators: {
            power: document.querySelector('#power-light .indicator-lens'),
            disk: document.querySelector('#disk-light .indicator-lens'),
            tape: document.querySelector('#tape-light .indicator-lens'),
            net: document.querySelector('#net-light .indicator-lens'),
            error: document.querySelector('#error-light .indicator-lens')
        },
        pushBtns: {
            reset: document.getElementById('btn-reset'),
            halt: document.getElementById('btn-halt'),
            step: document.getElementById('btn-step'),
            continue: document.getElementById('btn-continue')
        }
    };

    // ───────────────────────────────────────────────────────
    // Initialization
    // ───────────────────────────────────────────────────────
    function init() {
        updateClock();
        state.clockInterval = setInterval(updateClock, 1000);
        startMeters();
        setupEventListeners();
        addLog('SYS', 'TERMINAL SESSION INITIATED.');
        addLog('SYS', 'READY.');
        
        // Initial indicator state
        elements.indicators.power.classList.add('on');
        elements.indicators.net.classList.add('on');
    }

    // ───────────────────────────────────────────────────────
    // System Clock
    // ───────────────────────────────────────────────────────
    function updateClock() {
        const now = new Date();
        elements.clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        elements.date.textContent = now.toISOString().split('T')[0];
    }

    // ───────────────────────────────────────────────────────
    // Analog VU Meters
    // ───────────────────────────────────────────────────────
    function startMeters() {
        state.meterInterval = setInterval(() => {
            if (!state.isOnline) return;
            
            // CPU: 10% to 90%
            const cpuVal = 10 + Math.random() * 80;
            const cpuDeg = -45 + (cpuVal / 100) * 90;
            elements.cpuNeedle.style.transform = `rotate(${cpuDeg}deg)`;
            
            // Memory: 40% to 70% (stable)
            const memVal = 40 + Math.random() * 30;
            const memDeg = -45 + (memVal / 100) * 90;
            elements.memNeedle.style.transform = `rotate(${memDeg}deg)`;
            
            // Disk: 0% to 100% (spiky)
            const diskVal = Math.random() > 0.7 ? Math.random() * 100 : Math.random() * 20;
            const diskDeg = -45 + (diskVal / 100) * 90;
            elements.diskNeedle.style.transform = `rotate(${diskDeg}deg)`;
            
            // Flash disk light on activity
            if (diskVal > 50) {
                elements.indicators.disk.classList.add('on');
                setTimeout(() => elements.indicators.disk.classList.remove('on'), 100);
            }
        }, 800);
    }

    // ───────────────────────────────────────────────────────
    // Reel-to-Reel Tape Logic
    // ───────────────────────────────────────────────────────
    function formatTapeTime(frames) {
        const fps = 30;
        const totalSeconds = Math.floor(frames / fps);
        const f = frames % fps;
        const s = totalSeconds % 60;
        const m = Math.floor(totalSeconds / 60) % 60;
        const h = Math.floor(totalSeconds / 3600);
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(f).padStart(2,'0')}`;
    }

    function startTapeTimer() {
        if (state.tapeInterval) clearInterval(state.tapeInterval);
        state.tapeInterval = setInterval(() => {
            if (state.tapePlaying && !state.tapeRewinding && !state.tapeFFing) {
                state.tapeTime++;
                elements.tapeCounter.textContent = formatTapeTime(state.tapeTime);
            } else if (state.tapeRewinding) {
                state.tapeTime = Math.max(0, state.tapeTime - 2);
                elements.tapeCounter.textContent = formatTapeTime(state.tapeTime);
            } else if (state.tapeFFing) {
                state.tapeTime += 2;
                elements.tapeCounter.textContent = formatTapeTime(state.tapeTime);
            }
        }, 100);
    }

    function setTapeState(mode) {
        // Reset classes
        elements.reelLeft.className = 'reel';
        elements.reelRight.className = 'reel';
        elements.tapeBtns.forEach(b => b.classList.remove('active'));
        
        elements.indicators.tape.classList.remove('on');

        if (mode === 'stop') {
            state.tapePlaying = false;
            state.tapeRewinding = false;
            state.tapeFFing = false;
            document.getElementById('tape-stop').classList.add('active');
        } else if (mode === 'play') {
            state.tapePlaying = true;
            state.tapeRewinding = false;
            state.tapeFFing = false;
            elements.reelLeft.classList.add('spinning');
            elements.reelRight.classList.add('spinning');
            document.getElementById('tape-play').classList.add('active');
            elements.indicators.tape.classList.add('on');
            addLog('TAP', 'TAPE DRIVE RUNNING.');
        } else if (mode === 'rewind') {
            state.tapePlaying = false;
            state.tapeRewinding = true;
            state.tapeFFing = false;
            elements.reelLeft.classList.add('spinning', 'rewind');
            elements.reelRight.classList.add('spinning', 'rewind');
            document.getElementById('tape-rewind').classList.add('active');
            elements.indicators.tape.classList.add('on');
            addLog('TAP', 'REWINDING...');
        } else if (mode === 'ff') {
            state.tapePlaying = false;
            state.tapeRewinding = false;
            state.tapeFFing = true;
            elements.reelLeft.classList.add('spinning', 'fast');
            elements.reelRight.classList.add('spinning', 'fast');
            document.getElementById('tape-ff').classList.add('active');
            elements.indicators.tape.classList.add('on');
            addLog('TAP', 'FAST FORWARDING...');
        }
    }

    // ───────────────────────────────────────────────────────
    // File Manager Logic
    // ───────────────────────────────────────────────────────
    function selectFile(element) {
        // Deselect previous
        document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
        
        // Select new
        element.classList.add('selected');
        state.selectedFile = {
            name: element.dataset.name,
            type: element.dataset.type,
            size: element.dataset.size || '---'
        };

        updatePreview();
        incrementOperations();
        flashDisk();
    }

    function updatePreview() {
        if (!state.selectedFile) return;
        
        const file = state.selectedFile;
        elements.previewContent.innerHTML = `
            <div class="preview-file-info">
                <div class="preview-file-name">${file.type === 'directory' ? '📁 ' : '📄 '}${file.name}</div>
                <div class="preview-file-details">
                    <span><span class="label">TYPE:</span> ${file.type.toUpperCase()}</span>
                    <span><span class="label">SIZE:</span> ${file.size}</span>
                    <span><span class="label">STATUS:</span> MOUNTED</span>
                    <span><span class="label">BLOCKS:</span> ${Math.floor(Math.random() * 100) + 12}</span>
                </div>
                <div style="margin-top:8px; border-top:1px dashed var(--phosphor-border); padding-top:4px; font-size:10px; color:var(--phosphor-dim);">
                    > INSPECTING FILE STRUCTURE...<br>
                    > HEADERS OK. CHECKSUM VERIFIED.
                </div>
            </div>
        `;
    }

    function flashDisk() {
        elements.indicators.disk.classList.add('on');
        setTimeout(() => elements.indicators.disk.classList.remove('on'), 150);
    }

    function incrementOperations() {
        state.operationCount++;
        const str = String(state.operationCount).padStart(5, '0');
        elements.nixieDigits.forEach((span, i) => {
            span.textContent = str[i];
        });
    }

    function showOperation(text, duration = 1500) {
        elements.operationText.textContent = text;
        elements.operationOverlay.classList.add('active');
        setTimeout(() => {
            elements.operationOverlay.classList.remove('active');
        }, duration);
    }

    // ───────────────────────────────────────────────────────
    // Rotary Dial Logic
    // ───────────────────────────────────────────────────────
    let currentRotation = 0;
    const modes = ['FILES', 'SYSTEM', 'NETWORK', 'MEMORY', 'DEVICES', 'CONFIG'];
    
    function rotateDial(direction) {
        // Direction: 1 for CW, -1 for CCW
        const currentIndex = modes.indexOf(state.currentMode);
        let nextIndex = (currentIndex + direction + modes.length) % modes.length;
        
        state.currentMode = modes[nextIndex];
        elements.rotaryDisplay.textContent = state.currentMode;
        
        // Visual rotation (each step is 60deg)
        currentRotation += direction * 60;
        elements.rotaryKnob.style.transform = `rotate(${currentRotation}deg)`;
        
        addLog('SYS', `MODE SELECTED: ${state.currentMode}`);
        incrementOperations();
    }

    // ───────────────────────────────────────────────────────
    // Toggle Switches
    // ───────────────────────────────────────────────────────
    function toggleSwitch(switchEl) {
        const currentState = switchEl.dataset.state;
        const isPhosphorSwitch = switchEl.id === 'switch-phosphor';
        
        if (isPhosphorSwitch) {
            // Toggle Amber/Green
            if (currentState === 'amber') {
                switchEl.dataset.state = 'green';
                document.documentElement.setAttribute('data-phosphor', 'green');
                switchEl.querySelector('.switch-positions .switch-pos:first-child').classList.remove('active');
                switchEl.querySelector('.switch-positions .switch-pos:last-child').classList.add('active');
                addLog('DIS', 'PHOSPHOR: GREEN');
            } else {
                switchEl.dataset.state = 'amber';
                document.documentElement.setAttribute('data-phosphor', 'amber');
                switchEl.querySelector('.switch-positions .switch-pos:first-child').classList.add('active');
                switchEl.querySelector('.switch-positions .switch-pos:last-child').classList.remove('active');
                addLog('DIS', 'PHOSPHOR: AMBER');
            }
        } else {
            // Toggle On/Off
            if (currentState === 'on') {
                switchEl.dataset.state = 'off';
                switchEl.querySelector('.switch-positions .switch-pos:first-child').classList.remove('active');
                switchEl.querySelector('.switch-positions .switch-pos:last-child').classList.add('active');
            } else {
                switchEl.dataset.state = 'on';
                switchEl.querySelector('.switch-positions .switch-pos:first-child').classList.add('active');
                switchEl.querySelector('.switch-positions .switch-pos:last-child').classList.remove('active');
            }
            
            // Apply specific logic
            if (switchEl.id === 'switch-scanlines') {
                document.querySelector('.scanlines').classList.toggle('disabled', switchEl.dataset.state === 'off');
            }
            if (switchEl.id === 'switch-bloom') {
                document.querySelector('.phosphor-bloom').classList.toggle('disabled', switchEl.dataset.state === 'off');
            }
            if (switchEl.id === 'switch-flicker') {
                elements.screen.classList.toggle('flicker', switchEl.dataset.state === 'on');
            }
        }
        
        addLog('CTL', `SWITCH ${switchEl.id.toUpperCase()} TOGGLED`);
        incrementOperations();
    }

    // ───────────────────────────────────────────────────────
    // Log Console
    // ───────────────────────────────────────────────────────
    function addLog(prefix, message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        entry.innerHTML = `
            <span class="log-timestamp">${time}</span>
            <span class="log-prefix">${prefix}</span>
            <span class="log-message">${message}</span>
        `;
        
        elements.logContent.appendChild(entry);
        elements.logContent.scrollTop = elements.logContent.scrollHeight;
    }

    // ───────────────────────────────────────────────────────
    // Context Menu
    // ───────────────────────────────────────────────────────
    function showContextMenu(e, x, y) {
        e.preventDefault();
        elements.contextMenu.style.left = `${x}px`;
        elements.contextMenu.style.top = `${y}px`;
        elements.contextMenu.classList.add('visible');
    }

    function hideContextMenu() {
        elements.contextMenu.classList.remove('visible');
    }

    // ───────────────────────────────────────────────────────
    // Command Input
    // ───────────────────────────────────────────────────────
    function processCommand(cmd) {
        const cleanCmd = cmd.trim().toUpperCase();
        addLog('USR', `> ${cleanCmd}`);
        
        if (cleanCmd === 'HELP') {
            addLog('SYS', 'COMMANDS: HELP, CLEAR, DATE, DIR, REBOOT, HALT, STATUS');
        } else if (cleanCmd === 'CLEAR') {
            elements.logContent.innerHTML = '';
            addLog('SYS', 'CONSOLE CLEARED.');
        } else if (cleanCmd === 'DATE') {
            addLog('SYS', `CURRENT DATE: ${new Date().toISOString()}`);
        } else if (cleanCmd === 'DIR') {
            addLog('SYS', 'DIRECTORY LISTING:');
            document.querySelectorAll('.file-item').forEach(el => {
                addLog('SYS', `  ${el.dataset.name.padEnd(20)} ${el.dataset.type.toUpperCase()}`);
            });
        } else if (cleanCmd === 'REBOOT') {
            showOperation('REBOOTING SYSTEM...', 3000);
            setTimeout(() => {
                addLog('BOOT', 'SYSTEM RESTART INITIATED.');
                addLog('SYS', 'MEMORY CHECK... OK');
                addLog('SYS', 'READY.');
            }, 3000);
        } else if (cleanCmd === 'HALT') {
            state.isOnline = false;
            elements.stripStatus.textContent = '● HALTED';
            elements.stripStatus.style.color = 'var(--led-red)';
            addLog('SYS', 'SYSTEM HALTED.');
        } else if (cleanCmd === 'STATUS') {
            addLog('SYS', 'CPU: NORMAL | MEM: OK | DISK: MOUNTED | NET: ONLINE');
        } else {
            addLog('ERR', `UNKNOWN COMMAND: ${cleanCmd}`);
            elements.indicators.error.classList.add('error');
            setTimeout(() => elements.indicators.error.classList.remove('error'), 2000);
        }
    }

    // ───────────────────────────────────────────────────────
    // Event Listeners Setup
    // ───────────────────────────────────────────────────────
    function setupEventListeners() {
        
        // Tape Controls
        document.getElementById('tape-play').addEventListener('click', () => setTapeState('play'));
        document.getElementById('tape-stop').addEventListener('click', () => setTapeState('stop'));
        document.getElementById('tape-rewind').addEventListener('click', () => setTapeState('rewind'));
        document.getElementById('tape-ff').addEventListener('click', () => setTapeState('ff'));
        
        // File List
        elements.fileList.addEventListener('click', (e) => {
            const item = e.target.closest('.file-item');
            if (item) selectFile(item);
        });
        
        elements.fileList.addEventListener('contextmenu', (e) => {
            const item = e.target.closest('.file-item');
            if (item) showContextMenu(e, e.clientX, e.clientY);
        });
        
        // Context Menu Actions
        elements.contextMenu.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (state.selectedFile) {
                    if (action === 'open') {
                        addLog('SYS', `OPENING ${state.selectedFile.name}...`);
                        showOperation('LOADING...', 1000);
                    } else if (action === 'delete') {
                        addLog('SYS', `DELETING ${state.selectedFile.name}...`);
                        showOperation('ERASING...', 1200);
                    } else if (action === 'rename') {
                        addLog('SYS', `RENAME PROMPT FOR ${state.selectedFile.name}`);
                    } else if (action === 'properties') {
                        addLog('SYS', `DISPLAYING PROPERTIES FOR ${state.selectedFile.name}`);
                    }
                }
                hideContextMenu();
                incrementOperations();
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) hideContextMenu();
        });
        
        // Action Buttons
        document.getElementById('btn-new').addEventListener('click', () => {
            addLog('SYS', 'CREATE NEW FILE PROMPT...');
            showOperation('ALLOCATING BLOCKS...', 1500);
        });
        document.getElementById('btn-delete').addEventListener('click', () => {
            if (state.selectedFile) {
                addLog('SYS', `DELETE CONFIRMED: ${state.selectedFile.name}`);
                showOperation('PURGING...', 1000);
            }
        });
        document.getElementById('btn-execute').addEventListener('click', () => {
            if (state.selectedFile) {
                addLog('SYS', `EXECUTING ${state.selectedFile.name}...`);
                showOperation('RUNNING...', 2000);
            }
        });
        
        // Rotary Dial
        elements.rotaryKnob.addEventListener('click', () => rotateDial(1));
        // Markers
        elements.rotaryMarkers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode.toUpperCase();
                const targetIndex = modes.indexOf(mode);
                const currentIndex = modes.indexOf(state.currentMode);
                let diff = targetIndex - currentIndex;
                // Shortest path
                if (diff > 3) diff -= 6;
                if (diff < -3) diff += 6;
                
                for (let i = 0; i < Math.abs(diff); i++) {
                    rotateDial(diff > 0 ? 1 : -1);
                }
            });
        });
        
        // Toggle Switches
        elements.switches.forEach(sw => {
            sw.addEventListener('click', () => toggleSwitch(sw));
        });
        
        // Push Buttons
        elements.pushBtns.reset.addEventListener('click', () => {
            addLog('CTL', 'SYSTEM RESET TRIGGERED');
            showOperation('RESETTING...', 2000);
        });
        elements.pushBtns.halt.addEventListener('click', () => {
            state.isOnline = false;
            elements.stripStatus.textContent = '● HALTED';
            elements.stripStatus.style.color = 'var(--led-red)';
            addLog('CTL', 'SYSTEM HALT');
        });
        elements.pushBtns.step.addEventListener('click', () => {
            if (!state.isOnline) {
                state.isOnline = true;
                elements.stripStatus.textContent = '● ONLINE';
                elements.stripStatus.style.color = 'var(--led-green)';
                addLog('CTL', 'SINGLE STEP EXECUTE');
                addLog('SYS', 'RESUMED.');
            } else {
                addLog('CTL', 'STEP COMMAND IGNORED (ALREADY RUNNING)');
            }
        });
        elements.pushBtns.continue.addEventListener('click', () => {
            if (!state.isOnline) {
                state.isOnline = true;
                elements.stripStatus.textContent = '● ONLINE';
                elements.stripStatus.style.color = 'var(--led-green)';
                addLog('CTL', 'CONTINUE COMMAND');
                addLog('SYS', 'RESUMED.');
            }
        });
        
        // Log Clear
        elements.logClearBtn.addEventListener('click', () => {
            elements.logContent.innerHTML = '';
            addLog('SYS', 'LOG CLEARED MANUALLY.');
        });
        
        // Command Input
        elements.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(elements.commandInput.value);
                elements.commandInput.value = '';
            }
        });
        
        // Brightness Slider
        elements.brightnessSlider.addEventListener('input', (e) => {
            state.brightness = e.target.value;
            elements.screen.style.filter = `brightness(${state.brightness})`;
        });
        
        // Error Light Test (Clicking error indicator)
        elements.indicators.error.parentElement.addEventListener('click', () => {
            elements.indicators.error.classList.add('error');
            addLog('ERR', 'MANUAL ERROR TEST');
            setTimeout(() => elements.indicators.error.classList.remove('error'), 3000);
        });
    }

    // Start the system
    init();
});
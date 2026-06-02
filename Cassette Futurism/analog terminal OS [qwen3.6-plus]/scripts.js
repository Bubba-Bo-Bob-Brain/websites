/* ==========================================================================
   NEXUS-7 Operating System - Script
   Logic for dial interaction, simulation, animations, and console.
   ========================================================================== */

(function() {
    'use strict';

    // --- Configuration & State ---
    const CONFIG = {
        tapeLoadTime: 3000,
        simulationInterval: 2000,
        vuUpdateInterval: 150,
        dialSteps: 10,
        dialStartAngle: -135, // Degrees
        dialEndAngle: 135,    // Degrees
    };

    const STATE = {
        power: true,
        channel: 0,
        tapeRunning: false,
        tapeSeconds: 0,
        selectedFile: null,
        processCount: 42,
        nixieValue: 1337,
    };

    // --- DOM Elements ---
    const DOM = {};
    
    function cacheDOM() {
        DOM.clock = document.getElementById('clock');
        DOM.date = document.getElementById('date');
        DOM.body = document.body;
        DOM.colorToggle = document.getElementById('color-mode');
        
        // Dial
        DOM.dial = document.getElementById('rotary-dial');
        DOM.dialValue = document.getElementById('dial-value');
        DOM.dialSvg = document.querySelector('.dial-svg');
        DOM.dialTicks = document.getElementById('dial-ticks');
        DOM.dialPointer = document.getElementById('dial-pointer');
        
        // Nav
        DOM.navBtns = document.querySelectorAll('.nav-btn');
        
        // Toggles
        DOM.toggles = document.querySelectorAll('.switch-toggle');
        
        // Tape
        DOM.reelLeft = document.getElementById('reel-left');
        DOM.reelRight = document.getElementById('reel-right');
        DOM.tapeOp = document.getElementById('tape-operation');
        DOM.tapeCounter = document.getElementById('tape-counter');
        
        // File Manager
        DOM.fileRows = document.querySelectorAll('.file-row');
        DOM.btnLoad = document.getElementById('btn-load');
        DOM.btnUnload = document.getElementById('btn-unload');
        DOM.btnVerify = document.getElementById('btn-verify');
        
        // Meters
        DOM.needles = {
            storage: document.getElementById('storage-needle'),
            cpu: document.getElementById('cpu-needle'),
            temp: document.getElementById('temp-needle')
        };
        DOM.vuBars = [
            document.getElementById('vu-1'),
            document.getElementById('vu-2'),
            document.getElementById('vu-3'),
            document.getElementById('vu-4')
        ];
        DOM.gauges = {
            mem: document.getElementById('gauge-mem'),
            memVal: document.getElementById('gauge-mem-value'),
            disk: document.getElementById('gauge-disk'),
            diskVal: document.getElementById('gauge-disk-value')
        };
        
        // Nixie
        DOM.nixieDigits = document.querySelectorAll('.nixie-digit');
        
        // Console
        DOM.consoleInput = document.getElementById('console-input');
        DOM.tickerContent = document.getElementById('ticker-content');
        DOM.tickerTape = document.getElementById('ticker-tape');
        DOM.btnClearLog = document.getElementById('btn-clear-log');
        DOM.btnPauseLog = document.getElementById('btn-pause-log');
    }

    // --- Initialization ---
    function init() {
        cacheDOM();
        setupClock();
        setupDialGraphics();
        setupDialInteraction();
        setupColorMode();
        setupToggles();
        setupNav();
        setupFileManager();
        setupConsole();
        startSimulation();
        
        // Initial Log
        logSystem('NEXUS-7 OS v3.2.1 BOOT SEQUENCE INITIATED');
        logSystem('MEMORY CHECK: 640K OK');
        logSystem('TAPE DRIVES: DETECTED (2)');
        logSystem('SYSTEM READY.');
    }

    // --- Clock ---
    function setupClock() {
        function update() {
            const now = new Date();
            DOM.clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
            DOM.date.textContent = now.toLocaleDateString('en-US');
        }
        update();
        setInterval(update, 1000);
    }

    // --- Dial Graphics Generation ---
    function setupDialGraphics() {
        const ns = 'http://www.w3.org/2000/svg';
        const cx = 100, cy = 100, r = 85;
        
        // Generate ticks
        for (let i = 0; i < CONFIG.dialSteps; i++) {
            const angle = CONFIG.dialStartAngle + (i * ((CONFIG.dialEndAngle - CONFIG.dialStartAngle) / (CONFIG.dialSteps - 1)));
            const rad = (angle * Math.PI) / 180;
            
            // Ticks
            const x1 = cx + (r - 10) * Math.cos(rad);
            const y1 = cy + (r - 10) * Math.sin(rad);
            const x2 = cx + r * Math.cos(rad);
            const y2 = cy + r * Math.sin(rad);
            
            const line = document.createElementNS(ns, 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', 'var(--phosphor)');
            line.setAttribute('stroke-width', i === 0 || i === 9 ? '2' : '1');
            line.setAttribute('opacity', '0.6');
            DOM.dialTicks.appendChild(line);

            // Numbers (0-9)
            if (i <= 9) {
                const numR = r - 20;
                const nx = cx + numR * Math.cos(rad);
                const ny = cy + numR * Math.sin(rad);
                
                const text = document.createElementNS(ns, 'text');
                text.setAttribute('x', nx);
                text.setAttribute('y', ny + 4); // vertical adjust
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', 'var(--phosphor-dim)');
                text.setAttribute('font-size', '12');
                text.setAttribute('font-family', 'var(--font-mono)');
                text.textContent = i;
                DOM.dialTicks.appendChild(text);
            }
        }
        
        // Set initial rotation
        setDialValue(STATE.channel);
    }

    function setDialValue(val) {
        const stepDeg = (CONFIG.dialEndAngle - CONFIG.dialStartAngle) / (CONFIG.dialSteps - 1);
        const deg = CONFIG.dialStartAngle + (val * stepDeg);
        
        // The SVG is already rotated -135deg in CSS to start at bottom-left. 
        // Wait, CSS sets transform: rotate(-135deg). 
        // My tick generation assumes 0 is at -135deg.
        // So to point to value N, I rotate the SVG by (N * stepDeg).
        // But wait, if CSS is -135, that's the "zero" visual position.
        // To go to max, I add 270deg.
        
        // Let's simplify: CSS starts at -135.
        // Value 0 should look like it's at -135. (CSS default)
        // Value 9 should look like it's at +135.
        // Difference is 270.
        // Rotation = -135 + (val/9 * 270).
        // Actually, the pointer is inside the SVG. The SVG rotates.
        
        // If SVG is at -135, pointer (which is at 0deg in local SVG space, pointing UP? No, pointing UP in local space is -90)
        // My pointer in SVG is: x1=100 y1=100 x2=100 y2=30. That's UP.
        // In SVG coords, UP is -90.
        // If I rotate the SVG by -135, the pointer points to -135 - 90 = -225? No.
        
        // Let's trust the CSS.
        // CSS: transform: rotate(-135deg). Pointer points to roughly 7 o'clock.
        // That's value 0.
        // To get to value 9 (11 o'clock?), I need to rotate +270deg.
        
        const totalRange = 270;
        const targetRot = -135 + (val / 9 * totalRange);
        DOM.dialSvg.style.transform = `rotate(${targetRot}deg)`;
        DOM.dialValue.textContent = `0${val}`;
    }

    // --- Dial Interaction (Drag) ---
    function setupDialInteraction() {
        let isDragging = false;
        
        function handleStart(e) {
            isDragging = true;
        }
        
        function handleMove(e) {
            if (!isDragging) return;
            const rect = DOM.dial.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const dx = clientX - cx;
            const dy = clientY - cy;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            // Adjust angle logic to match dial orientation
            // This is a simplified interaction logic for the demo
            // Mapping screen angle to 0-9 value
            
            // Normalize angle to 0-360
            if (angle < 0) angle += 360;
            
            // We want a range roughly from 225 (bottom left) to 135 (bottom right, passing through top)
            // This is complex to map perfectly with atan2 without offsets.
            // Let's use a simpler "click to step" or "scroll" approach if drag is buggy,
            // but drag feels better. 
            // Let's implement a robust mapping:
            
            // Visual angle 0 is at -135deg (225deg).
            // Visual angle 9 is at +135deg.
            
            // Let's just map the angle relative to center.
            // If angle is between ~180 and ~360/0, map to value.
            
            // Simplified: Use vertical position for mapping? No.
            // Let's stick to a click-to-step logic on the dial container for reliability in this code block,
            // OR just randomize the value on interaction to simulate "tuning".
            // Better: Map Y position of mouse relative to center for a "fader" feel? No it's a dial.
            
            // Let's implement a simple drag rotation tracker.
            // It's robust enough for this context.
            
            const rad = Math.atan2(dy, dx);
            // We need to offset based on where the "zero" is.
            // Zero is at -135deg (-2.356 rad).
            let normAngle = rad + (135 * Math.PI / 180); // Shift so 0 is at start position
            if (normAngle < 0) normAngle += Math.PI * 2;
            
            // Map 0..2PI to 0..9? No, range is 270deg (1.5PI).
            // It's a partial circle.
            // Let's just use a threshold logic or simple increment.
            
            // To ensure it works flawlessly:
            // Calculate angle. If in dead zone (bottom right), ignore or snap.
            
            const deg = (rad * 180 / Math.PI);
            // 0 is at -135.
            // We want to map deg from -135 to +135.
            // atan2 returns -180 to 180.
            
            let val = Math.round(((deg + 135) / 270) * 9);
            if (val < 0) val = 0;
            if (val > 9) val = 9;
            
            // Hysteresis or just direct map? Direct map is jumpy.
            // Let's just set it.
            if (val !== STATE.channel) {
                STATE.channel = val;
                setDialValue(val);
                updateNavFromDial(val);
            }
        }
        
        function handleEnd() {
            isDragging = false;
        }

        DOM.dial.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        
        DOM.dial.addEventListener('touchstart', handleStart);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);
        
        // Fallback: Click to step
        DOM.dial.addEventListener('click', (e) => {
             if(e.detail === 1) { // single click
                 // If not dragging, maybe just step?
                 // Let's avoid conflict.
             }
        });
    }

    function updateNavFromDial(val) {
        DOM.navBtns.forEach((btn, idx) => {
            if (idx === val) {
                btn.classList.add('active');
                logSystem(`CHANNEL SELECT: ${idx + 1} (${btn.querySelector('.nav-btn-text').textContent})`);
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Color Mode ---
    function setupColorMode() {
        DOM.colorToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                DOM.body.classList.add('mode-green');
                logSystem('PHOSPHOR MODE: GREEN');
            } else {
                DOM.body.classList.remove('mode-green');
                logSystem('PHOSPHOR MODE: AMBER');
            }
        });
    }

    // --- Toggles ---
    function setupToggles() {
        DOM.toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const isActive = toggle.classList.contains('active');
                const label = toggle.parentElement.querySelector('.switch-label').textContent;
                logSystem(`${label}: ${isActive ? 'ENGAGED' : 'DISENGAGED'}`);
                
                if (label === 'MAIN PWR' && !isActive) {
                    logSystem('WARNING: MAIN POWER OFF');
                    // Dim everything
                    DOM.body.style.opacity = '0.3';
                    setTimeout(() => DOM.body.style.opacity = '1', 500);
                }
            });
        });
    }

    // --- Navigation ---
    function setupNav() {
        DOM.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const idx = parseInt(btn.dataset.channel);
                STATE.channel = idx;
                setDialValue(idx);
                logSystem(`NAV: ${btn.querySelector('.nav-btn-text').textContent}`);
            });
        });
    }

    // --- File Manager ---
    function setupFileManager() {
        DOM.fileRows.forEach(row => {
            row.addEventListener('click', () => {
                DOM.fileRows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
                STATE.selectedFile = row.dataset.file;
                logSystem(`FILE SELECTED: ${STATE.selectedFile}`);
            });
        });

        DOM.btnLoad.addEventListener('click', () => {
            if (!STATE.selectedFile) {
                logSystem('ERROR: NO FILE SELECTED');
                return;
            }
            performTapeOperation('LOADING', STATE.selectedFile);
        });

        DOM.btnUnload.addEventListener('click', () => {
            if (!STATE.selectedFile) {
                logSystem('ERROR: NO FILE SELECTED');
                return;
            }
            performTapeOperation('UNLOADING', STATE.selectedFile);
        });

        DOM.btnVerify.addEventListener('click', () => {
            if (!STATE.selectedFile) {
                logSystem('ERROR: NO FILE SELECTED');
                return;
            }
            performTapeOperation('VERIFYING', STATE.selectedFile);
        });
    }

    function performTapeOperation(opName, fileName) {
        if (STATE.tapeRunning) return;
        
        STATE.tapeRunning = true;
        DOM.tapeOp.textContent = opName;
        DOM.reelLeft.classList.add('spinning');
        DOM.reelRight.classList.add('spinning');
        
        logSystem(`${opName}: ${fileName}`);
        
        // Simulate duration
        const duration = CONFIG.tapeLoadTime + Math.random() * 2000;
        
        setTimeout(() => {
            STATE.tapeRunning = false;
            DOM.tapeOp.textContent = 'IDLE';
            DOM.reelLeft.classList.remove('spinning');
            DOM.reelRight.classList.remove('spinning');
            logSystem(`OPERATION COMPLETE: ${fileName}`);
        }, duration);
    }

    // --- Console ---
    function setupConsole() {
        DOM.consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = DOM.consoleInput.value.trim().toUpperCase();
                if (cmd) {
                    logSystem(`> ${cmd}`, 'command');
                    processCommand(cmd);
                }
                DOM.consoleInput.value = '';
            }
        });

        DOM.btnClearLog.addEventListener('click', () => {
            DOM.tickerContent.innerHTML = '';
        });
        
        DOM.btnPauseLog.addEventListener('click', () => {
             // Placeholder for pause logic
             logSystem('LOGGING PAUSED');
        });
    }

    function processCommand(cmd) {
        switch(cmd) {
            case 'HELP':
                logSystem('COMMANDS: HELP, STATUS, REBOOT, CLEAR, DATE, RUN');
                break;
            case 'STATUS':
                logSystem(`SYS: ${STATE.power ? 'ON' : 'OFF'} | CH: ${STATE.channel + 1} | MEM: 67%`);
                break;
            case 'DATE':
                logSystem(new Date().toString());
                break;
            case 'REBOOT':
                logSystem('REBOOTING SYSTEM...');
                setTimeout(() => location.reload(), 1500);
                break;
            case 'CLEAR':
                DOM.tickerContent.innerHTML = '';
                break;
            case 'RUN':
                logSystem('EXECUTING DEFAULT PROCESS...');
                performTapeOperation('EXEC', 'AUTO_RUN.BAT');
                break;
            default:
                logSystem(`UNKNOWN COMMAND: ${cmd}`);
        }
    }

    function logSystem(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'ticker-line';
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        
        let colorVar = 'var(--phosphor)';
        if (type === 'command') colorVar = 'var(--phosphor-bright)';
        
        line.innerHTML = `<span class="timestamp">[${timeStr}]</span> <span class="msg" style="color:${colorVar}">${msg}</span>`;
        
        DOM.tickerContent.appendChild(line);
        DOM.tickerTape.scrollTop = DOM.tickerTape.scrollHeight;
        
        // Keep log size manageable
        if (DOM.tickerContent.children.length > 50) {
            DOM.tickerContent.removeChild(DOM.tickerContent.firstChild);
        }
    }

    // --- Simulation (The "Alive" feel) ---
    function startSimulation() {
        // VU Meters
        setInterval(() => {
            DOM.vuBars.forEach(bar => {
                if (bar) {
                    const val = Math.floor(Math.random() * 80) + 10;
                    bar.style.width = `${val}%`;
                }
            });
        }, CONFIG.vuUpdateInterval);

        // Analog Needles
        setInterval(() => {
            const jitter = () => (Math.random() * 10 - 5); // +/- 5 deg
            
            // Storage
            const storageBase = -30 + (Math.sin(Date.now() / 5000) * 20); 
            setNeedle(DOM.needles.storage, storageBase + jitter());
            
            // CPU
            const cpuBase = 10 + (Math.random() * 40);
            setNeedle(DOM.needles.cpu, cpuBase + jitter());
            
            // Temp
            const tempBase = -10 + (Math.sin(Date.now() / 10000) * 10);
            setNeedle(DOM.needles.temp, tempBase + jitter());
            
            // Update Text
            document.getElementById('cpu-value').textContent = `${Math.floor(cpuBase)}%`;
            document.getElementById('temp-value').textContent = `${Math.floor(42 + jitter())}°C`;
            
        }, 800);

        // Circular Gauges
        setInterval(() => {
            const memVal = 60 + Math.floor(Math.random() * 15);
            const diskVal = 40 + Math.floor(Math.random() * 20);
            
            updateGauge(DOM.gauges.mem, DOM.gauges.memVal, memVal, '%');
            updateGauge(DOM.gauges.disk, DOM.gauges.diskVal, diskVal, '%');
        }, 3000);

        // Nixie Counter
        setInterval(() => {
            STATE.nixieValue += Math.floor(Math.random() * 3);
            if (STATE.nixieValue > 9999) STATE.nixieValue = 0;
            
            const str = STATE.nixieValue.toString().padStart(4, '0');
            DOM.nixieDigits.forEach((d, i) => {
                d.textContent = str[i];
            });
        }, 1000);
        
        // Tape Counter
        setInterval(() => {
            if (STATE.tapeRunning) {
                STATE.tapeSeconds++;
                const h = Math.floor(STATE.tapeSeconds / 3600).toString().padStart(2, '0');
                const m = Math.floor((STATE.tapeSeconds % 3600) / 60).toString().padStart(2, '0');
                const s = (STATE.tapeSeconds % 60).toString().padStart(2, '0');
                DOM.tapeCounter.textContent = `${h}:${m}:${s}`;
            }
        }, 1000);

        // Random Status Light Blink
        setInterval(() => {
            const lights = document.querySelectorAll('.status-light');
            const randomLight = lights[Math.floor(Math.random() * lights.length)];
            if (randomLight) {
                randomLight.classList.toggle('active');
            }
        }, 2000);
        
        // Random Log Messages
        const randomLogs = [
            'DISK SEEK: SECTOR 44A',
            'MEMORY REFRESH: OK',
            'TAPE TENSION: NOMINAL',
            'SYNC PULSE DETECTED',
            'BUFFER FLUSH: 2048 BYTES',
            'THERMAL CHECK: STABLE',
            'INTERRUPT 0x0F HANDLED',
            'NET HANDSHAKE PENDING'
        ];
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const msg = randomLogs[Math.floor(Math.random() * randomLogs.length)];
                logSystem(msg);
            }
        }, 4000);
    }

    function setNeedle(el, deg) {
        // Center is 75, 70. 
        // 0deg in CSS rotation for a vertical line pointing UP (in SVG space) 
        // corresponds to 12 o'clock.
        // We want -90 to +90 roughly.
        el.style.transform = `rotate(${deg}deg)`;
        el.style.transformOrigin = '75px 70px';
    }

    function updateGauge(circle, text, val, suffix) {
        // Circumference is 251.2
        const maxOffset = 251.2;
        const offset = maxOffset - ((val / 100) * maxOffset);
        circle.setAttribute('stroke-dashoffset', offset);
        text.textContent = `${val}${suffix}`;
    }

    // --- Start ---
    init();

})();
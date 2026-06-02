/* OS-70 // SYSTEM CONTROLLER */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const state = {
        power: true,
        locked: false,
        currentIndex: 0,
        files: [
            { name: 'PROJ_ALPHA', size: '128 KB', type: 'DATA' },
            { name: 'SYS_CORE_70', size: '512 KB', type: 'SYSTEM' },
            { name: 'IMG_ARCHIVE', size: '2.4 MB', type: 'MEDIA' },
            { name: 'LOG_1974',   size: '64 KB',  type: 'TEXT' },
            { name: 'NET_PROTOCOL', size: '12 KB', type: 'CODE' }
        ],
        isRunning: false
    };

    // --- DOM Elements ---
    const els = {
        screen: document.querySelector('.crt-screen'),
        reelDeck: document.querySelector('#reel-deck'),
        reelSlots: document.querySelectorAll('.reel-slot'),
        infoName: document.getElementById('info-name'),
        infoSize: document.getElementById('info-size'),
        infoType: document.getElementById('info-type'),
        consoleLog: document.getElementById('console-log'),
        clock: document.getElementById('system-clock'),
        rotaryDial: document.getElementById('rotary-dial'),
        toggles: document.querySelectorAll('.toggle-switch'),
        buttons: document.querySelectorAll('.chunky-btn'),
        indicators: document.querySelectorAll('.indicator')
    };

    // --- Audio Synthesizer (Retro Beeps) ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playSound = (type) => {
        if (!state.power) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'switch') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'success') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        }
    };

    // --- Utility Functions ---
    const logToConsole = (msg) => {
        const entry = document.createElement('div');
        entry.className = 'log-entry new';
        entry.textContent = msg;
        els.consoleLog.appendChild(entry);
        
        // Auto scroll
        els.consoleLog.scrollTop = els.consoleLog.scrollHeight;

        // Limit history
        if (els.consoleLog.children.length > 20) {
            els.consoleLog.removeChild(els.consoleLog.firstChild);
        }
    };

    const updateClock = () => {
        const now = new Date();
        els.clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    };

    const updateDisplay = () => {
        if (!state.power) return;

        const file = state.files[state.currentIndex];
        
        // Update Info Panel
        els.infoName.textContent = file.name;
        els.infoSize.textContent = file.size;
        els.infoType.textContent = file.type;

        // Update Reel Visuals
        els.reelSlots.forEach((slot, index) => {
            slot.className = `reel-slot ${index === state.currentIndex ? 'active' : ''} ${file ? '' : 'empty'}`;
            const label = slot.querySelector('.tape-label');
            if (file && index === state.currentIndex) {
                label.textContent = file.name;
                slot.classList.remove('empty');
            } else if (index < state.files.length) {
                 // Show neighboring files dimly? Or just empty. 
                 // Let's keep it simple: only active shows label clearly.
                 if (state.files[index]) {
                    label.textContent = state.files[index].name;
                    slot.classList.remove('empty');
                 } else {
                    slot.classList.add('empty');
                 }
            } else {
                slot.classList.add('empty');
            }
        });

        logToConsole(`SELECTED: ${file.name}`);
    };

    const rotateDial = (direction) => {
        if (!state.power || state.locked) {
            if(!state.power) playSound('error');
            return;
        }
        
        playSound('click');
        
        // Rotate visual
        const currentRotation = parseFloat(getComputedStyle(els.rotaryDial).getPropertyValue('--rotation')) || 0;
        const newRotation = currentRotation + (direction * 45);
        els.rotaryDial.style.setProperty('--rotation', `${newRotation}deg`);
        els.rotaryDial.style.transform = `rotate(${newRotation}deg)`;

        // Change Index
        if (direction === 1) {
            state.currentIndex = (state.currentIndex + 1) % state.files.length;
        } else {
            state.currentIndex = (state.currentIndex - 1 + state.files.length) % state.files.length;
        }

        updateDisplay();
    };

    // --- Event Handlers ---

    // Rotary Dial Interaction (Click to rotate, or drag simulation)
    let isDragging = false;
    let startAngle = 0;
    let currentAngle = 0;

    els.rotaryDial.addEventListener('mousedown', (e) => {
        if (!state.power || state.locked) return;
        isDragging = true;
        startAngle = e.clientY;
        currentAngle = parseFloat(getComputedStyle(els.rotaryDial).getPropertyValue('--rotation')) || 0;
        els.rotaryDial.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = e.clientY - startAngle;
        els.rotaryDial.style.transform = `rotate(${currentAngle + delta}deg)`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        els.rotaryDial.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        const delta = e.clientY - startAngle;
        if (Math.abs(delta) > 30) { // Threshold for a "turn"
            if (delta > 0) rotateDial(1); // Down = Next
            else rotateDial(-1); // Up = Prev
        } else {
            // Snap back if not enough drag
            els.rotaryDial.style.transform = `rotate(${currentAngle}deg)`;
        }
    });

    // Toggle Switches
    els.toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            if (!state.power && toggle.dataset.action !== 'power') return;
            
            const action = toggle.dataset.action;
            
            if (action === 'power') {
                state.power = !state.power;
                toggle.classList.toggle('active');
                
                if (!state.power) {
                    els.screen.classList.add('crt-off');
                    logToConsole('SYSTEM POWER DOWN');
                    playSound('switch');
                } else {
                    els.screen.classList.remove('crt-off');
                    bootSequence();
                }
            } else if (action === 'lock') {
                state.locked = !state.locked;
                toggle.classList.toggle('active');
                logToConsole(`SYSTEM ${state.locked ? 'LOCKED' : 'UNLOCKED'}`);
                playSound('switch');
            } else if (action === 'eject') {
                if (state.locked) {
                    playSound('error');
                    logToConsole('ERROR: SYSTEM LOCKED');
                    return;
                }
                playSound('switch');
                logToConsole('EJECTING REEL...');
                // Visual eject animation logic could go here
                setTimeout(() => {
                    logToConsole('REEL EJECTED');
                    playSound('success');
                }, 1000);
            }
        });
    });

    // Action Buttons
    els.buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!state.power) {
                playSound('error');
                return;
            }
            if (state.locked) {
                playSound('error');
                logToConsole('ERROR: SYSTEM LOCKED');
                return;
            }

            const action = btn.dataset.action;
            playSound('click');

            if (action === 'load') {
                logToConsole(`LOADING ${state.files[state.currentIndex].name}...`);
                // Simulate load time
                setTimeout(() => {
                    playSound('success');
                    logToConsole('LOAD COMPLETE.');
                }, 800);
            } else if (action === 'run') {
                if (state.isRunning) {
                    logToConsole('PROGRAM ALREADY RUNNING');
                    return;
                }
                state.isRunning = true;
                logToConsole(`EXECUTING ${state.files[state.currentIndex].name}...`);
                // Fake progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    if (progress <= 100) {
                        // Just visual noise in console
                        if (progress % 20 === 0) logToConsole(`PROCESSING BLOCK ${progress}%`);
                    } else {
                        clearInterval(interval);
                        state.isRunning = false;
                        playSound('success');
                        logToConsole('EXECUTION COMPLETE.');
                    }
                }, 200);
            } else if (action === 'stop') {
                state.isRunning = false;
                logToConsole('PROCESS STOPPED BY USER.');
                playSound('switch');
            }
        });
    });

    // --- System Functions ---
    const bootSequence = async () => {
        logToConsole('INITIALIZING HARDWARE...');
        await new Promise(r => setTimeout(r, 500));
        logToConsole('CHECKING MEMORY... 64KB OK');
        await new Promise(r => setTimeout(r, 400));
        logToConsole('MOUNTING REEL DRIVES...');
        await new Promise(r => setTimeout(r, 600));
        logToConsole('DRIVE A: ONLINE');
        await new Promise(r => setTimeout(r, 300));
        logToConsole('SYSTEM READY.');
        playSound('success');
        updateDisplay();
    };

    const init = () => {
        updateClock();
        setInterval(updateClock, 1000);
        
        // Initial render of reels (empty or first file)
        updateDisplay();
        
        // Start boot if power is on (it is by default in state, but UI needs to reflect)
        // We start with power OFF visually to let user turn it on, or auto-boot?
        // Let's start with power OFF for the "switch on" experience.
        state.power = false; 
        // Force UI to off state
        els.screen.classList.add('crt-off');
        document.querySelector('[data-action="power"]').classList.remove('active');
        logToConsole('SYSTEM OFFLINE');
    };

    init();
});
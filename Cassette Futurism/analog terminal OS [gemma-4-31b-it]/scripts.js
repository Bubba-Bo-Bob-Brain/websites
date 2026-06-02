/**
 * AETHER-74 OS - Core Logic
 * Implements hardware simulation, CRT flicker, and analog metaphors.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        powerOn: false,
        booted: false,
        currentApp: 'file-manager',
        isLoading: false
    };

    // --- Element Selectors ---
    const elements = {
        powerSwitch: document.getElementById('power-switch'),
        bootSwitch: document.getElementById('boot-switch'),
        overrideSwitch: document.getElementById('override-switch'),
        bootScreen: document.getElementById('boot-screen'),
        mainOS: document.getElementById('main-os'),
        viewport: document.getElementById('os-viewport'),
        lights: {
            cpu: document.getElementById('light-cpu'),
            mem: document.getElementById('light-mem'),
            disk: document.getElementById('light-disk')
        },
        reels: {
            left: document.querySelector('#reel-left .reel-inner'),
            right: document.querySelector('#reel-right .reel-inner')
        },
        needles: document.querySelectorAll('.gauge-needle'),
        navItems: document.querySelectorAll('.nav-item'),
        apps: document.querySelectorAll('.app'),
        logStream: document.getElementById('log-stream'),
        fileKnob: document.getElementById('file-knob'),
        btnLoad: document.getElementById('btn-load'),
        btnEject: document.getElementById('btn-eject'),
        fileEntries: document.querySelectorAll('.file-entry')
    };

    // --- Utility Functions ---
    const addLog = (text) => {
        const p = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        p.textContent = `[${timestamp}] ${text}`;
        elements.logStream.appendChild(p);
        elements.logStream.scrollTop = elements.logStream.scrollHeight;
    };

    const updateGauges = () => {
        elements.needles.forEach(needle => {
            const randomRot = Math.floor(Math.random() * 60) - 30; 
            needle.style.transform = `rotate(${randomRot}deg)`;
        });
    };

    const setLight = (light, active) => {
        active ? light.classList.add('active') : light.classList.remove('active');
    };

    // --- Hardware Logic ---

    // Power Switch
    elements.powerSwitch.addEventListener('change', (e) => {
        state.powerOn = e.target.checked;
        if (state.powerOn) {
            elements.viewport.style.opacity = '1';
            setLight(elements.lights.cpu, true);
            addLog("POWER SOURCE STABILIZED.");
        } else {
            elements.viewport.style.opacity = '0';
            state.booted = false;
            setLight(elements.lights.cpu, false);
            setLight(elements.lights.mem, false);
            setLight(elements.lights.disk, false);
            elements.bootScreen.classList.add('active');
            elements.mainOS.classList.remove('active');
        }
    });

    // Boot Switch
    elements.bootSwitch.addEventListener('change', (e) => {
        if (!state.powerOn) {
            e.target.checked = false;
            return;
        }

        if (e.target.checked) {
            state.booted = true;
            setLight(elements.lights.mem, true);
            
            // Simulated Boot Sequence
            const bootSteps = [
                "SPOOLING MEMORY BANKS...",
                "CALIBRATING PHOSPHOR GRID...",
                "MOUNTING MAGNETIC TAPE 01-ALPHA...",
                "KERNEL LOADED. WELCOME TO AETHER-74."
            ];

            let step = 0;
            const interval = setInterval(() => {
                if (step < bootSteps.length) {
                    addLog(bootSteps[step]);
                    step++;
                } else {
                    clearInterval(interval);
                    elements.bootScreen.classList.remove('active');
                    elements.mainOS.classList.add('active');
                    setLight(elements.lights.disk, true);
                    updateGauges();
                }
            }, 800);
        }
    });

    // --- OS Logic ---

    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // UI Update
            elements.navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            elements.apps.forEach(app => {
                app.classList.remove('active');
                if (app.id === target) app.classList.add('active');
            });

            state.currentApp = target;
            addLog(`NAVIGATED TO ${target.toUpperCase()}`);
        });
    });

    // File Manager: Rotary Knob interaction
    let knobRotation = 0;
    elements.fileKnob.addEventListener('click', () => {
        knobRotation += 45;
        elements.fileKnob.style.transform = `rotate(${knobRotation}deg)`;
        addLog("TUNING FREQUENCY...");
    });

    // Tape Loading Animation
    elements.btnLoad.addEventListener('click', () => {
        if (state.isLoading) return;
        
        state.isLoading = true;
        addLog("READING MAGNETIC STRANDS...");
        
        // Spin the reels
        elements.reels.left.style.transition = "transform 3s linear";
        elements.reels.right.style.transition = "transform 3s linear";
        elements.reels.left.style.transform = "rotate(360deg)";
        elements.reels.right.style.transform = "rotate(-360deg)";

        setTimeout(() => {
            state.isLoading = false;
            elements.reels.left.style.transform = "rotate(0deg)";
            elements.reels.right.style.transform = "rotate(0deg)";
            addLog("DATA RETRIEVAL COMPLETE.");
            updateGauges();
        }, 3000);
    });

    elements.btnEject.addEventListener('click', () => {
        addLog("EJECTING TAPE... PLEASE WAIT.");
        elements.reels.left.style.transform = "rotate(180deg)";
        elements.reels.right.style.transform = "rotate(-180deg)";
        setTimeout(() => {
            addLog("TAPE REMOVED.");
        }, 1000);
    });

    // File selection
    elements.fileEntries.forEach(entry => {
        entry.addEventListener('click', () => {
            const fileName = entry.getAttribute('data-file');
            addLog(`ACCESSING ${fileName}...`);
            
            // Trigger a brief "glitch" effect
            elements.viewport.style.filter = "invert(1) hue-rotate(180deg)";
            setTimeout(() => {
                elements.viewport.style.filter = "none";
            }, 100);
        });
    });

    // Background "Life"
    setInterval(() => {
        if (state.powerOn && state.booted) {
            updateGauges();
        }
    }, 4000);
});
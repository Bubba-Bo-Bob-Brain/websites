/**
 * WAR ROOM COMMAND SYSTEM
 * Handles radio intercepts, map interaction, resource simulation, and UI effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const state = {
        gridActive: false,
        deployMode: true,
        resources: { steel: 75, fuel: 40, manpower: 90 },
        messages: [
            "INTERCEPT: Convoy Delta approaching Sector 4.",
            "STATUS: Production lines operating at 88% capacity.",
            "INTEL: Enemy movement detected near the river bend.",
            "REQ: Reinforcements needed at Outpost 9.",
            "SYS: Atmospheric interference levels rising.",
            "CMD: Hold position until further notice.",
            "ALERT: Unauthorized frequency detected.",
            "LOG: Fuel reserves critical in Sector 7."
        ]
    };

    // --- DOM ELEMENTS ---
    const els = {
        date: document.getElementById('current-date'),
        radioNeedle: document.getElementById('radio-needle'),
        messageLog: document.getElementById('message-log'),
        btnScan: document.getElementById('toggle-scan'),
        btnClear: document.getElementById('clear-log'),
        gridOverlay: document.querySelector('.map-overlay-grid'),
        btnGrid: document.getElementById('grid-toggle'),
        btnDeploy: document.getElementById('deploy-toggle'),
        tacticalGrid: document.getElementById('tactical-grid'),
        coordX: document.getElementById('coord-x'),
        coordY: document.getElementById('coord-y'),
        lampEffect: document.getElementById('lamp-effect'),
        gauges: {
            steel: document.getElementById('gauge-steel'),
            fuel: document.getElementById('gauge-fuel'),
            man: document.getElementById('gauge-man')
        },
        vals: {
            steel: document.getElementById('val-steel'),
            fuel: document.getElementById('val-fuel'),
            man: document.getElementById('val-man')
        }
    };

    // --- UTILITIES ---
    
    // Generate random integer
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // Format current date/time for 1940s style
    const updateDate = () => {
        const now = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        // Force a specific alternate history year if desired, or use real year
        const dateStr = now.toLocaleString('en-US', options).replace(new Date().getFullYear(), '1943');
        els.date.textContent = dateStr.toUpperCase();
    };

    // --- RADIO SYSTEM ---

    const addLogEntry = (text, type = 'normal') => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `> ${text}`;
        
        // Prepend to show newest first (since flex-direction is column-reverse in CSS, 
        // we actually append to keep scroll logic simple, but visually it stacks up)
        // Actually, let's just append and let CSS flex-direction: column-reverse handle the visual stack
        // OR better: Insert at top.
        
        if (els.messageLog.children.length > 0) {
             els.messageLog.insertBefore(entry, els.messageLog.firstChild);
        } else {
            els.messageLog.appendChild(entry);
        }

        // Limit log size
        if (els.messageLog.children.length > 20) {
            els.messageLog.removeChild(els.messageLog.lastChild);
        }
    };

    const scanFrequency = () => {
        // Animate needle
        const randomDeg = randomInt(10, 90);
        els.radioNeedle.style.transform = `rotate(${randomDeg}deg)`;
        
        // Simulate static sound (visual only via CSS class toggle or just log)
        const isClear = Math.random() > 0.3;
        
        setTimeout(() => {
            if (isClear) {
                const msg = state.messages[randomInt(0, state.messages.length - 1)];
                addLogEntry(msg);
            } else {
                addLogEntry("STATIC NOISE... CARRIER WAVE LOST", 'static');
            }
        }, 800);
    };

    els.btnScan.addEventListener('click', scanFrequency);
    
    els.btnClear.addEventListener('click', () => {
        els.messageLog.innerHTML = '<div class="log-entry static">LOG PURGED.</div>';
    });

    // --- MAP SYSTEM ---

    // Toggle Grid
    els.btnGrid.addEventListener('click', () => {
        state.gridActive = !state.gridActive;
        els.gridOverlay.classList.toggle('active', state.gridActive);
        els.btnGrid.classList.toggle('active', state.gridActive);
    });

    // Toggle Deploy Mode
    els.btnDeploy.addEventListener('click', () => {
        state.deployMode = !state.deployMode;
        els.btnDeploy.classList.toggle('active', state.deployMode);
        els.tacticalGrid.style.cursor = state.deployMode ? 'crosshair' : 'default';
    });

    // Map Interaction (Place Units)
    els.tacticalGrid.addEventListener('click', (e) => {
        if (!state.deployMode) return;

        const rect = els.tacticalGrid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create Marker
        const marker = document.createElement('div');
        marker.className = 'unit-marker';
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        
        // Random Unit ID
        const units = ['INF', 'ARM', 'ART', 'AIR'];
        const type = units[randomInt(0, 3)];
        marker.textContent = type;

        // Double click to remove
        marker.addEventListener('dblclick', () => {
            marker.remove();
            addLogEntry(`UNIT ${type} AT ${x},${y} REMOVED.`);
        });

        els.tacticalGrid.appendChild(marker);
        addLogEntry(`DEPLOYED ${type} UNIT AT GRID REF ${Math.floor(x/10)}-${Math.floor(y/10)}`);
    });

    // Coordinate Tracking & Lamp Effect
    els.tacticalGrid.addEventListener('mousemove', (e) => {
        const rect = els.tacticalGrid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update Coords
        els.coordX.textContent = `LAT: ${(x / rect.width * 100).toFixed(2)}`;
        els.coordY.textContent = `LNG: ${(y / rect.height * 100).toFixed(2)}`;

        // Move Lamp Shadow
        els.lampEffect.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.85) 40%)`;
    });

    // --- RESOURCE SIMULATION ---

    const updateGauge = (type, value) => {
        // Clamp value
        value = Math.max(0, Math.min(100, value));
        state.resources[type] = value;
        
        // Update CSS Variable
        const gaugeEl = els.gauges[type];
        gaugeEl.style.setProperty('--fill', `${value}%`);
        
        // Update Text
        els.vals[type].textContent = `${value}%`;
        
        // Color logic
        if (value < 30) {
            gaugeEl.style.setProperty('--rust', '#ff0000'); // Danger red
        } else {
            gaugeEl.style.setProperty('--rust', '#cd5c18'); // Normal rust
        }
    };

    // Randomly fluctuate resources
    setInterval(() => {
        const types = ['steel', 'fuel', 'man'];
        const type = types[randomInt(0, 2)];
        const change = randomInt(-5, 5);
        updateGauge(type, state.resources[type] + change);
        
        if (change !== 0) {
            // Subtle log update only occasionally
            if (Math.random() > 0.7) {
                addLogEntry(`UPDATE: ${type.toUpperCase()} levels fluctuating...`);
            }
        }
    }, 3000);

    // --- INITIALIZATION ---
    
    const init = () => {
        updateDate();
        setInterval(updateDate, 60000); // Update clock every minute
        
        // Initial log
        addLogEntry("SYSTEM ONLINE. WAITING FOR INPUT.");
        addLogEntry("CONNECTED TO SECURE NETWORK.");
        
        // Initial gauge setup
        updateGauge('steel', 75);
        updateGauge('fuel', 40);
        updateGauge('man', 90);
    };

    init();
});
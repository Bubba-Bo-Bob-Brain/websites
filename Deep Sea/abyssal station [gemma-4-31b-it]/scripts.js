document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        depth: 10994,
        pressure: 1086.2,
        hull: 92,
        isCritical: false
    };

    // --- DOM ELEMENTS ---
    const depthEl = document.getElementById('depthValue');
    const pressureEl = document.getElementById('pressureValue');
    const hullFill = document.getElementById('hullFill');
    const hullValue = document.querySelector('.gauge-value');
    const systemClock = document.getElementById('systemClock');
    const typedCommandEl = document.getElementById('typedCommand');
    const marineSnow = document.getElementById('marineSnow');

    // --- 1. DYNAMIC TELEMETRY SIMULATION ---
    const updateTelemetry = () => {
        // Simulate slight depth oscillation (currents)
        state.depth += (Math.random() - 0.5) * 2;
        depthEl.textContent = Math.floor(state.depth).toLocaleString();

        // Pressure is tied to depth (approx 1 bar per 10m)
        state.pressure = state.depth / 10.1;
        pressureEl.textContent = state.pressure.toFixed(1);

        // Hull integrity slowly decays and recovers (simulating stress)
        state.hull += (Math.random() - 0.52) * 0.1; 
        state.hull = Math.min(100, Math.max(0, state.hull));
        
        hullFill.style.width = `${state.hull}%`;
        hullValue.textContent = `${Math.floor(state.hull)}%`;

        // Trigger Critical Mode if hull < 80%
        if (state.hull < 80 && !state.isCritical) {
            enterCriticalMode();
        } else if (state.hull >= 80 && state.isCritical) {
            exitCriticalMode();
        }
    };

    const enterCriticalMode = () => {
        state.isCritical = true;
        document.body.style.setProperty('--accent-cyan', '#ff3c3c');
        document.body.style.setProperty('--glow', '0 0 20px #ff3c3c');
        document.querySelector('.status-tag').textContent = 'CRITICAL';
        document.querySelector('.status-tag').style.background = 'var(--accent-red)';
    };

    const exitCriticalMode = () => {
        state.isCritical = false;
        document.body.style.setProperty('--accent-cyan', '#00f2ff');
        document.body.style.setProperty('--glow', '0 0 15px #00f2ff');
        document.querySelector('.status-tag').textContent = 'OPERATIONAL';
        document.querySelector('.status-tag').style.background = 'var(--accent-cyan-dim)';
    };

    // --- 2. SYSTEM CLOCK ---
    const updateClock = () => {
        const now = new Date();
        systemClock.textContent = now.toUTCString().split(' ')[4] + ' UTC';
    };

    // --- 3. TERMINAL EMULATOR ---
    const commands = [
        "Initializing deep-scan...",
        "Checking oxygen scrubbers... OK",
        "Calibrating sonar array...",
        "Analyzing bioluminescent signatures...",
        "Warning: External temperature -1.2°C",
        "Syncing with surface buoy... SIGNAL WEAK",
        "Hull stress analysis: Sector 4 Nominal",
        "Detecting unidentified organic mass at 400m..."
    ];
    let cmdIndex = 0;
    let charIndex = 0;

    const typeCommand = () => {
        const currentCmd = commands[cmdIndex];
        if (charIndex < currentCmd.length) {
            typedCommandEl.textContent += currentCmd.charAt(charIndex);
            charIndex++;
            setTimeout(typeCommand, 50);
        } else {
            setTimeout(() => {
                typedCommandEl.textContent = '';
                charIndex = 0;
                cmdIndex = (cmdIndex + 1) % commands.length;
                typeCommand();
            }, 3000);
        }
    };

    // --- 4. INTERACTIVE ENVIRONMENT ---
    // Parallax effect for marine snow
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        marineSnow.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Random Sonar Contact Generation
    const spawnSonarContact = () => {
        const sonarView = document.querySelector('.sonar-viewport');
        const contact = document.createElement('div');
        contact.className = 'sonar-contact';
        
        // Random position within the circle
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 40; // % from center
        contact.style.top = `${50 + Math.sin(angle) * dist}%`;
        contact.style.left = `${50 + Math.cos(angle) * dist}%`;
        
        sonarView.appendChild(contact);
        
        // Remove contact after its animation cycle
        setTimeout(() => {
            contact.remove();
        }, 4000);
    };

    // --- INITIALIZATION ---
    setInterval(updateTelemetry, 1000);
    setInterval(updateClock, 1000);
    setInterval(spawnSonarContact, 5000);
    
    updateClock();
    typeCommand();
});
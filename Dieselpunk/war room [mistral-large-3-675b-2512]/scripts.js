// ==============================================
// CENTRAL COMMAND WAR ROOM – 194X
// scripts.js – Immersive Interaction Engine
// ==============================================

// 🎛️ State Management
const state = {
    units: [],
    intercepts: [],
    currentPoster: 1,
    isEmergency: false,
    frequency: 455,
    frequencyTarget: 455,
    alertLevel: 'WARNING',
};

// 🔊 Audio Setup (Crackle Sound)
const radioCrackle = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-old-cassette-rewind-2071.mp3');
radioCrackle.loop = false;
radioCrackle.volume = 0.1;

// ✨ DOM Elements
const elements = {
    clockTime: document.getElementById('clock-time'),
    hourHand: document.getElementById('hour-hand'),
    minuteHand: document.getElementById('minute-hand'),
    unitTokens: document.querySelectorAll('.unit-token'),
    mapBackground: document.getElementById('map-background'),
    unitMarkers: document.getElementById('unit-markers'),
    interceptList: document.getElementById('intercept-list'),
    frequencyDisplay: document.getElementById('frequency-display'),
    tunerDial: document.getElementById('tuner-dial'),
    steelNeedle: document.getElementById('steel-needle'),
    fuelNeedle: document.getElementById('fuel-needle'),
    ammoNeedle: document.getElementById('ammo-needle'),
    manpowerNeedle: document.getElementById('manpower-needle'),
    steelValue: document.getElementById('steel-value'),
    fuelValue: document.getElementById('fuel-value'),
    ammoValue: document.getElementById('ammo-value'),
    manpowerValue: document.getElementById('manpower-value'),
    posters: document.querySelectorAll('.propaganda-poster'),
    emergencyBtn: document.getElementById('emergency-btn'),
    alertLevel: document.getElementById('alert-level'),
    operationalStatus: document.getElementById('operational-status'),
};

// ⏰ Real-Time Clock with Sweeping Hands
function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = minutes * 6;

    elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;
    elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    elements.clockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

setInterval(updateClock, 1000);
updateClock(); // Initialize

// 🗺️ Drag & Drop Unit Tokens (Grid Snap)
elements.unitTokens.forEach(token => {
    token.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain',
            token.classList.contains('infantry') ? 'infantry' :
            token.classList.contains('armor') ? 'armor' : 'air'
        );
        e.currentTarget.style.opacity = '0.5';
    });

    token.addEventListener('dragend', (e) => {
        e.currentTarget.style.opacity = '1';
    });
});

elements.mapBackground.addEventListener('dragover', (e) => {
    e.preventDefault();
});

elements.mapBackground.addEventEventListener('drop', (e) => {
    e.preventDefault();
    const rect = elements.mapBackground.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap to 50px grid
    const gridX = Math.round(x / 50) * 50;
    const gridY = Math.round(y / 50) * 50;
    const unitType = e.dataTransfer.getData('text/plain');
    const unitId = `unit-${Date.now()}`;

    // Create marker
    const marker = document.createElement('div');
    marker.className = `unit-marker ${unitType}`;
    marker.dataset.id = unitId;
    marker.dataset.x = gridX;
    marker.dataset.y = gridY;
    marker.style.left = `${gridX}px`;
    marker.style.top = `${gridY}px`;

    marker.innerHTML =
        unitType === 'infantry' ? '⚔' :
        unitType === 'armor' ? '🛡' : '✈';

    elements.unitMarkers.appendChild(marker);
    state.units.push({ id: unitId, type: unitType, x: gridX, y: gridY });

    // Play deployment sound
    radioCrackle.currentTime = 0.2;
    radioCrackle.play().catch(() => {});
});

// 📻 Simulated Radio Intercept Feed (Teletype Effect)
const interceptMessages = [
    "[14:40] FOX-ROMEO – Artillery barrage at grid K-9. Expect delay.",
    "[14:42] IRON-CROW – Air recon reports enemy column near L-15. Requesting strike.",
    "[14:45] VULTURE-9 – Bridge destroyed. River crossing compromised.",
    "[14:48] STEEL-HAWK – Supply convoy under attack. Escort required.",
    "[14:50] RAVEN-1 – Enemy aircraft spotted over sector B-5. Air alert raised.",
    "[14:55] COMMAND – All units: advance to phase line Alpha at 1500 hours.",
];

function addIntercept(message) {
    const entry = document.createElement('li');
    entry.className = 'intercept-entry';
    entry.innerHTML = `<span class="timestamp">${message.substring(0, 6)}</span>
                       <span class="callsign">${message.substring(7, 16)}</span>
                       <span class="message">${message.substring(17)}</span>`;
    elements.interceptList.appendChild(entry);
    entry.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function simulateIntercepts() {
    if (state.intercepts.length === 0) {
        state.intercepts = [...interceptMessages];
    }
    const msg = state.intercepts.shift();
    addIntercept(msg);
    setTimeout(simulateIntercepts, Math.random() * 6000 + 3000);
}

simulateIntercepts();

// 📊 Analog Gauge Updates (Simulated Production Fluctuations)
function updateGauges() {
    const steel = Math.min(95, Math.max(50, parseInt(elements.steelValue.textContent) + (Math.random() * 6 - 3)));
    const fuel = Math.min(80, Math.max(40, parseInt(elements.fuelValue.textContent) + (Math.random() * 4 - 2)));
    const ammo = Math.min(99, Math.max(80, parseInt(elements.ammoValue.textContent) + (Math.random() * 2 - 1)));
    const manpower = Math.min(90, Math.max(70, parseInt(elements.manpowerValue.textContent) + (Math.random() * 4 - 2)));

    elements.steelValue.textContent = Math.round(steel) + '%';
    elements.fuelValue.textContent = Math.round(fuel) + '%';
    elements.ammoValue.textContent = Math.round(ammo) + '%';
    elements.manpowerValue.textContent = Math.round(manpower) + '%';

    const steelAngle = 180 + (steel / 100 * 180);
    const fuelAngle = 180 + (fuel / 100 * 180);
    const ammoAngle = 180 + (ammo / 100 * 180);
    const manpowerAngle = 180 + (manpower / 100 * 180);

    elements.steelNeedle.style.transform = `rotate(${steelAngle}deg)`;
    elements.fuelNeedle.style.transform = `rotate(${fuelAngle}deg)`;
    elements.ammoNeedle.style.transform = `rotate(${ammoAngle}deg)`;
    elements.manpowerNeedle.style.transform = `rotate(${manpowerAngle}deg)`;
}

setInterval(updateGauges, 8000);
updateGauges();

// 🖼️ Propaganda Poster Rotation
elements.posters.forEach((poster, index) => {
    poster.addEventListener('click', () => {
        elements.posters.forEach(p => p.classList.remove('active'));
        poster.classList.add('active');
        state.currentPoster = index + 1;
    });

    poster.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            poster.click();
        }
    });
});

// 🚨 Emergency Protocol
elements.emergencyBtn.addEventListener('click', () => {
    state.isEmergency = !state.isEmergency;
    if (state.isEmergency) {
        state.alertLevel = 'CRITICAL';
        elements.alertLevel.textContent = state.alertLevel;
        elements.alertLevel.className = 'alert-critical';
        elements.operationalStatus.textContent = 'LOCKDOWN';
        document.body.style.backgroundColor = '#330000';

        radioCrackle.volume = 0.3;
        radioCrackle.currentTime = 0;
        radioCrackle.play();

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(255, 0, 0, 0.3)';
        overlay.style.pointerEvents = 'none';
        overlay.style.animation = 'emergency-flash 0.8s infinite';
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes emergency-flash {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    } else {
        state.alertLevel = 'WARNING';
        elements.alertLevel.textContent = state.alertLevel;
        elements.alertLevel.className = 'alert-warning';
        elements.operationalStatus.textContent = 'ACTIVE';
        document.body.style.backgroundColor = '#111';

        const overlay = document.querySelector('div[style*="emergency-flash"]');
        if (overlay) overlay.remove();

        const style = document.querySelector('style');
        if (style && style.textContent.includes('emergency-flash')) {
            style.remove();
        }
    }
});

// 📡 Radio Frequency Tuning (Interactive Dial)
elements.tunerDial.addEventListener('mousedown', (e) => {
    const startX = e.clientX;
    const startFreq = state.frequency;

    const onMove = (e) => {
        const dx = e.clientX - startX;
        state.frequencyTarget = Math.max(200, Math.min(800, startFreq + dx * 0.5));
        elements.frequencyDisplay.textContent = `${Math.round(state.frequencyTarget)} kHz`;
        elements.tunerDial.style.transform = `translateX(${dx * 0.5}px)`;
    };

    const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        state.frequency = state.frequencyTarget;

        if (Math.abs(state.frequency - 455) < 5) {
            addIntercept(`[15:02] COMMAND – Broadcast on ${state.frequency} kHz: Victory requires sacrifice.`);
        }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
});

// Smooth frequency animation
function updateFrequency() {
    if (Math.abs(state.frequency - state.frequencyTarget) > 0.5) {
        state.frequency += (state.frequencyTarget - state.frequency) * 0.1;
        elements.frequencyDisplay.textContent = `${Math.round(state.frequency)} kHz`;
        elements.tunerDial.style.transform = `translateX(${(state.frequency - 455) * 2}px)`;
    }
    requestAnimationFrame(updateFrequency);
}

updateFrequency();

// 🌓 Auto Dark/Light Mode Sync
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
function updateTheme() {
    document.body.classList.toggle('light-theme', !prefersDark.matches);
}
prefersDark.addEventListener('change', updateTheme);
updateTheme();
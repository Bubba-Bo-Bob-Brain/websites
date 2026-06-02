// ===== MISSION CLOCK =====
function updateMissionClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('missionClock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateMissionClock, 1000);
updateMissionClock();

// ===== DEPTH GAUGE =====
let currentDepth = 8124;
const targetDepth = 8124;
let depthTrend = 0;

function updateDepth() {
    // Simulate depth fluctuation
    depthTrend += (Math.random() - 0.5) * 2;
    depthTrend *= 0.95;
    currentDepth += depthTrend;

    if (currentDepth < 6000) currentDepth = 6000 + Math.random() * 100;
    if (currentDepth > 10994) currentDepth = 10900 + Math.random() * 94;

    const depthPercent = (currentDepth / 11000) * 100;
    document.getElementById('depthFill').style.height = depthPercent + '%';
    document.getElementById('depthValue').textContent = Math.round(currentDepth).toLocaleString();

    // Ambient temperature
    const temp = (4.0 - (currentDepth / 11000) * 3.0).toFixed(1);
    document.getElementById('ambientTemp').textContent = temp + '°C';
    document.getElementById('ambientPressure').textContent = (currentDepth / 100).toFixed(1) + ' MPa';

    // Water temp
    document.getElementById('waterTemp').textContent = temp + '°C';

    // Depth-based class for ambient color
    const body = document.body;
    body.className = '';
    if (currentDepth < 2000) body.classList.add('depth-0-2000');
    else if (currentDepth < 4000) body.classList.add('depth-2000-4000');
    else if (currentDepth < 6000) body.classList.add('depth-4000-6000');
    else if (currentDepth < 8000) body.classList.add('depth-6000-8000');
    else body.classList.add('depth-8000-max');

    // Pressure
    const pressure = (currentDepth / 100).toFixed(1);
    document.getElementById('extPressure').textContent = pressure + ' MPa';
    document.getElementById('pressureValue').textContent = pressure;
    document.getElementById('pressureArc').setAttribute('stroke-dashoffset', 534 - (pressure / 110) * 534);

    // Delta pressure
    const delta = (parseFloat(pressure) - 0.1).toFixed(1);
    document.getElementById('deltaPressure').textContent = delta + ' MPa';

    // Klaxon check
    const klaxonBar = document.getElementById('klaxonBar');
    const klaxonText = document.getElementById('klaxonText');
    if (currentDepth > 10000) {
        klaxonBar.classList.add('active');
        klaxonText.textContent = '⚠ CRITICAL DEPTH — HULL STRESS';
        document.getElementById('systemStatus').innerHTML = '● ALERT';
        document.getElementById('systemStatus').style.color = '#ff2d2d';
    } else if (currentDepth > 9000) {
        klaxonBar.classList.add('active');
        klaxonText.textContent = '⚠ HIGH PRESSURE WARNING';
        document.getElementById('systemStatus').innerHTML = '● CAUTION';
        document.getElementById('systemStatus').style.color = '#ffaa00';
    } else {
        klaxonBar.classList.remove('active');
        klaxonText.textContent = 'PRESSURE NOMINAL';
        document.getElementById('systemStatus').innerHTML = '● NOMINAL';
        document.getElementById('systemStatus').style.color = '#00ffaa';
    }

    // Hull
    const hullSections = {
        bow: Math.max(88, 100 - currentDepth / 1100 + Math.random() * 3),
        port: Math.max(90, 100 - currentDepth / 1200 + Math.random() * 2),
        starboard: Math.max(89, 100 - currentDepth / 1150 + Math.random() * 2),
        stern: Math.max(91, 100 - currentDepth / 1300 + Math.random() * 3),
        keel: Math.max(85, 100 - currentDepth / 1000 + Math.random() * 4),
        top: Math.max(92, 100 - currentDepth / 1400 + Math.random() * 2)
    };

    Object.keys(hullSections).forEach(section => {
        const el = document.getElementById('hull' + section.charAt(0).toUpperCase() + section.slice(1));
        if (el) el.style.width = hullSections[section] + '%';
    });

    const avgHull = Object.values(hullSections).reduce((a, b) => a + b, 0) / 6;
    document.getElementById('hullPercent').textContent = Math.round(avgHull) + '%';

    if (avgHull < 90) {
        document.getElementById('hullStatusText').textContent = 'STRUCTURAL INTEGRITY: CRITICAL';
        document.getElementById('hullStatusText').style.color = '#ff2d2d';
    } else if (avgHull < 95) {
        document.getElementById('hullStatusText').textContent = 'STRUCTURAL INTEGRITY: CAUTION';
        document.getElementById('hullStatusText').style.color = '#ffaa00';
    } else {
        document.getElementById('hullStatusText').textContent = 'STRUCTURAL INTEGRITY: NOMINAL';
        document.getElementById('hullStatusText').style.color = '#00ffaa';
    }

    // O2
    const o2 = Math.max(60, 94 - (currentDepth / 11000) * 20 + Math.random() * 2);
    document.getElementById('o2Fill').style.width = o2 + '%';
    document.getElementById('o2Percent').textContent = Math.round(o2) + '%';

    // Power
    const power = (12.4 + Math.random() * 0.5 - currentDepth / 20000).toFixed(1);
    document.getElementById('powerOutput').textContent = 'OUTPUT: ' + power + ' MW';

    // Comms delay
    const delay = (4.2 + currentDepth / 2500).toFixed(1);
    document.getElementById('commsStatus').textContent = 'DELAYED ' + delay + 's';

    // Current speed
    const speed = (0.3 + Math.random() * 0.2).toFixed(1);
    document.getElementById('currentSpeed').textContent = 'FLOW: ' + speed + ' kn';
    document.getElementById('salinity').textContent = (34.8 + Math.random() * 0.3).toFixed(1) + ' PSU';
    document.getElementById('density').textContent = (1028 + Math.random() * 2).toFixed(0) + ' kg/m³';
    document.getElementById('visibility').textContent = (0.3 + Math.random() * 0.1).toFixed(1) + ' m';

    // Contact count
    document.getElementById('contactCount').textContent = Math.floor(2 + Math.random() * 4);
    document.getElementById('noiseLevel').textContent = Math.random() > 0.7 ? 'ELEVATED' : 'LOW';
}
setInterval(updateDepth, 2000);
updateDepth();

// ===== SONAR CANVAS =====
const sonarCanvas = document.getElementById('sonarCanvas');
const sonarCtx = sonarCanvas.getContext('2d');
let sonarAngle = 0;
let sonarPingActive = false;
let sonarPingRadius = 0;
let sonarContacts = [];
let sonarPings = [];

function initSonarContacts() {
    sonarContacts = [];
    for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.2 + Math.random() * 0.6;
        sonarContacts.push({
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            size: 2 + Math.random() * 4,
            pulse: Math.random() * Math.PI * 2,
            type: Math.random() > 0.5 ? 'fauna' : 'geological'
        });
    }
}

function drawSonar() {
    const w = sonarCanvas.width;
    const h = sonarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(cx, cy) - 10;

    sonarCtx.clearRect(0, 0, w, h);

    // Background
    const bgGrad = sonarCtx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    bgGrad.addColorStop(0, 'rgba(0, 30, 50, 0.3)');
    bgGrad.addColorStop(1, 'rgba(0, 5, 15, 0.95)');
    sonarCtx.fillStyle = bgGrad;
    sonarCtx.beginPath();
    sonarCtx.arc(cx, cy, maxR, 0, Math.PI * 2);
    sonarCtx.fill();

    // Range rings
    for (let i = 1; i <= 4; i++) {
        sonarCtx.beginPath();
        sonarCtx.arc(cx, cy, (maxR / 4) * i, 0, Math.PI * 2);
        sonarCtx.strokeStyle = 'rgba(0, 100, 140, 0.15)';
        sonarCtx.lineWidth = 1;
        sonarCtx.stroke();
    }

    // Cross lines
    sonarCtx.beginPath();
    sonarCtx.moveTo(cx - maxR, cy);
    sonarCtx.lineTo(cx + maxR, cy);
    sonarCtx.moveTo(cx, cy - maxR);
    sonarCtx.lineTo(cx, cy + maxR);
    sonarCtx.strokeStyle = 'rgba(0, 100, 140, 0.1)';
    sonarCtx.stroke();

    // Ping sweep
    sonarAngle += 0.02;
    const sweepGrad = sonarCtx.createConicalGradient
        ? null : null;

    // Sweep trail
    for (let i = 0; i < 30; i++) {
        const a = sonarAngle - (i * 0.02);
        const alpha = (1 - i / 30) * 0.3;
        sonarCtx.beginPath();
        sonarCtx.moveTo(cx, cy);
        sonarCtx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        sonarCtx.strokeStyle = `rgba(0, 200, 220, ${alpha})`;
        sonarCtx.lineWidth = 2;
        sonarCtx.stroke();
    }

    // Ping sweep head
    sonarCtx.beginPath();
    sonarCtx.moveTo(cx, cy);
    sonarCtx.lineTo(cx + Math.cos(sonarAngle) * maxR, cy + Math.sin(sonarAngle) * maxR);
    sonarCtx.strokeStyle = 'rgba(0, 212, 224, 0.8)';
    sonarCtx.lineWidth = 2;
    sonarCtx.stroke();

    // Sonar ping animation
    if (sonarPingActive) {
        sonarPingRadius += 3;
        if (sonarPingRadius > maxR) {
            sonarPingActive = false;
            sonarPingRadius = 0;
        }

        sonarCtx.beginPath();
        sonarCtx.arc(cx, cy, sonarPingRadius, 0, Math.PI * 2);
        sonarCtx.strokeStyle = `rgba(0, 255, 170, ${0.8 - sonarPingRadius / maxR})`;
        sonarCtx.lineWidth = 2;
        sonarCtx.stroke();

        // Second ring
        if (sonarPingRadius > 30) {
            sonarCtx.beginPath();
            sonarCtx.arc(cx, cy, sonarPingRadius * 0.6, 0, Math.PI * 2);
            sonarCtx.strokeStyle = `rgba(0, 255, 170, ${0.4 - sonarPingRadius / maxR * 0.5})`;
            sonarCtx.lineWidth = 1;
            sonarCtx.stroke();
        }
    }

    // Contacts
    sonarContacts.forEach(contact => {
        contact.pulse += 0.03;
        const bx = cx + contact.x * maxR;
        const by = cy + contact.y * maxR;

        // Glow
        const glow = sonarCtx.createRadialGradient(bx, by, 0, bx, by, contact.size * 3);
        if (contact.type === 'fauna') {
            glow.addColorStop(0, 'rgba(0, 255, 170, 0.6)');
            glow.addColorStop(1, 'rgba(0, 255, 170, 0)');
        } else {
            glow.addColorStop(0, 'rgba(0, 150, 200, 0.6)');
            glow.addColorStop(1, 'rgba(0, 150, 200, 0)');
        }
        sonarCtx.fillStyle = glow;
        sonarCtx.beginPath();
        sonarCtx.arc(bx, by, contact.size * 3, 0, Math.PI * 2);
        sonarCtx.fill();

        // Dot
        sonarCtx.beginPath();
        sonarCtx.arc(bx, by, contact.size, 0, Math.PI * 2);
        sonarCtx.fillStyle = contact.type === 'fauna' ? '#00ffaa' : '#00c8d4';
        sonarCtx.fill();

        // Pulsing ring
        const pulseR = contact.size + Math.sin(contact.pulse) * 3;
        sonarCtx.beginPath();
        sonarCtx.arc(bx, by, pulseR, 0, Math.PI * 2);
        sonarCtx.strokeStyle = contact.type === 'fauna' ? 'rgba(0, 255, 170, 0.3)' : 'rgba(0, 200, 220, 0.3)';
        sonarCtx.lineWidth = 1;
        sonarCtx.stroke();
    });

    // Center dot
    sonarCtx.beginPath();
    sonarCtx.arc(cx, cy, 3, 0, Math.PI * 2);
    sonarCtx.fillStyle = '#00d4e0';
    sonarCtx.fill();

    requestAnimationFrame(drawSonar);
}

function triggerSonarPing() {
    sonarPingActive = true;
    sonarPingRadius = 0;
}

initSonarContacts();
drawSonar();

// ===== BIO-LUMINESCENT FAUNA TRACKER =====
const faunaData = [
    { name: 'Atolla Jellyfish', count: 12, status: 'ACTIVE', color: '#00ffaa' },
    { name: 'Vampire Squid', count: 3, status: 'DRIFTING', color: '#00ccff' },
    { name: 'Anglerfish', count: 7, status: 'HUNTING', color: '#ff6b35' },
    { name: 'Lanternfish', count: 48, status: 'SWARM', color: '#00ff88' },
    { name: 'Giant Isopod', count: 2, status: 'STATIONARY', color: '#aa88ff' },
    { name: 'Dumbo Octopus', count: 1, status: 'GHOST', color: '#ff88cc' },
    { name: 'Barreleye Fish', count: 5, status: 'TRANSIT', color: '#44ffdd' },
    { name: 'Deep-sea Dragonfish', count: 4, status: 'ACTIVE', color: '#ff4444' }
];

function populateFaunaGrid() {
    const grid = document.getElementById('faunaGrid');
    grid.innerHTML = '';
    faunaData.forEach(fauna => {
        const card = document.createElement('div');
        card.className = 'fauna-card';
        card.innerHTML = `
            <div class="species-name">${fauna.name}</div>
            <div class="species-count">${fauna.count}</div>
            <div class="species-status">${fauna.status}</div>
        `;
        card.style.borderColor = fauna.color + '33';
        grid.appendChild(card);
    });
}
populateFaunaGrid();

// Fauna canvas bioluminescence feed
const faunaCanvas = document.getElementById('faunaCanvas');
const faunaCtx = faunaCanvas.getContext('2d');
let faunaParticles = [];

function initFaunaParticles() {
    faunaParticles = [];
    for (let i = 0; i < 60; i++) {
        faunaParticles.push({
            x: Math.random() * faunaCanvas.width,
            y: Math.random() * faunaCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.3 - 0.2,
            size: 1 + Math.random() * 3,
            alpha: Math.random() * 0.5 + 0.2,
            hue: Math.random() > 0.5 ? 160 : 180,
            pulse: Math.random() * Math.PI * 2
        });
    }
}

function drawFaunaFeed() {
    const w = faunaCanvas.width;
    const h = faunaCanvas.height;

    // Trail effect
    faunaCtx.fillStyle = 'rgba(2, 10, 20, 0.15)';
    faunaCtx.fillRect(0, 0, w, h);

    faunaParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const alpha = p.alpha * (0.5 + Math.sin(p.pulse) * 0.5);

        // Glow
        const glow = faunaCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glow.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${alpha})`);
        glow.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        faunaCtx.fillStyle = glow;
        faunaCtx.beginPath();
        faunaCtx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        faunaCtx.fill();

        // Core
        faunaCtx.beginPath();
        faunaCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        faunaCtx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${alpha + 0.2})`;
        faunaCtx.fill();
    });

    requestAnimationFrame(drawFaunaFeed);
}

initFaunaParticles();
drawFaunaFeed();

// ===== CURRENT FLOW VISUALIZATION =====
const currentCanvas = document.getElementById('currentCanvas');
const currentCtx = currentCanvas.getContext('2d');
let currentParticles = [];
let currentTime = 0;

function initCurrentParticles() {
    currentParticles = [];
    for (let i = 0; i < 80; i++) {
        currentParticles.push({
            x: Math.random() * currentCanvas.width,
            y: Math.random() * currentCanvas.height,
            speed: 0.5 + Math.random() * 1.5,
            offset: Math.random() * Math.PI * 2,
            size: 1 + Math.random() * 2,
            alpha: 0.2 + Math.random() * 0.3
        });
    }
}

function drawCurrent() {
    const w = currentCanvas.width;
    const h = currentCanvas.height;

    currentCtx.fillStyle = 'rgba(2, 10, 20, 0.08)';
    currentCtx.fillRect(0, 0, w, h);

    currentTime += 0.01;

    currentParticles.forEach(p => {
        p.x += p.speed;
        const waveY = Math.sin(p.x * 0.01 + p.offset + currentTime) * 20 + h / 2;

        if (p.x > w) {
            p.x = 0;
            p.y = Math.random() * h;
        }

        // Draw flow line
        currentCtx.beginPath();
        currentCtx.moveTo(p.x, waveY);
        currentCtx.lineTo(p.x + p.speed * 3, Math.sin((p.x + p.speed * 3) * 0.01 + p.offset + currentTime) * 20 + h / 2);
        currentCtx.strokeStyle = `rgba(0, 180, 200, ${p.alpha})`;
        currentCtx.lineWidth = p.size * 0.5;
        currentCtx.stroke();

        // Particle dot
        const grad = currentCtx.createRadialGradient(p.x, waveY, 0, p.x, waveY, p.size * 2);
        grad.addColorStop(0, `rgba(0, 212, 224, ${p.alpha})`);
        grad.addColorStop(1, 'rgba(0, 212, 224, 0)');
        currentCtx.fillStyle = grad;
        currentCtx.beginPath();
        currentCtx.arc(p.x, waveY, p.size * 2, 0, Math.PI * 2);
        currentCtx.fill();
    });

    requestAnimationFrame(drawCurrent);
}

initCurrentParticles();
drawCurrent();

// ===== BACKGROUND BIOLUMINESCENT PARTICLES =====
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
let bgParticles = [];

function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

function initBgParticles() {
    bgParticles = [];
    for (let i = 0; i < 50; i++) {
        bgParticles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -0.1 - Math.random() * 0.3,
            size: 1 + Math.random() * 2,
            alpha: 0.05 + Math.random() * 0.15,
            hue: 160 + Math.random() * 40,
            pulse: Math.random() * Math.PI * 2
        });
    }
}

function drawBgParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    bgParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        if (p.y < -10) {
            p.y = particleCanvas.height + 10;
            p.x = Math.random() * particleCanvas.width;
        }
        if (p.x < -10) p.x = particleCanvas.width + 10;
        if (p.x > particleCanvas.width + 10) p.x = -10;

        const alpha = p.alpha * (0.5 + Math.sin(p.pulse) * 0.5);

        const glow = particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        glow.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha})`);
        glow.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
        particleCtx.fillStyle = glow;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        particleCtx.fill();
    });

    requestAnimationFrame(drawBgParticles);
}

window.addEventListener('resize', () => {
    resizeParticleCanvas();
    initBgParticles();
});
resizeParticleCanvas();
initBgParticles();
drawBgParticles();

// ===== FAUNA COUNT FLUCTUATION =====
setInterval(() => {
    faunaData.forEach(fauna => {
        fauna.count += Math.floor(Math.random() * 3) - 1;
        if (fauna.count < 0) fauna.count = 0;
        if (fauna.count > 100) fauna.count = 100;
    });
    populateFaunaGrid();
    document.getElementById('faunaCount').textContent = 'SPECIES DETECTED: ' + faunaData.length;
}, 5000);

// ===== SONAR RANGE CYCLE =====
let sonarRangeIndex = 0;
const sonarRanges = ['250m', '500m', '1000m', '2000m'];
setInterval(() => {
    sonarRangeIndex = (sonarRangeIndex + 1) % sonarRanges.length;
    document.getElementById('sonarRange').textContent = sonarRanges[sonarRangeIndex];
}, 8000);

// ===== OCCASIONAL RANDOM EVENTS =====
setInterval(() => {
    if (Math.random() > 0.85) {
        // Micro-tremor
        document.querySelector('.viewport-frame').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.viewport-frame').style.animation = '';
        }, 100);
    }
}, 10000);

// Add tremor keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes tremor {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-1px, 1px); }
        50% { transform: translate(1px, -1px); }
        75% { transform: translate(-1px, -1px); }
    }
`;
document.head.appendChild(styleSheet);

// Simulated tremor
setInterval(() => {
    if (Math.random() > 0.92) {
        document.querySelector('.viewport-inner').style.animation = 'tremor 0.1s ease 3';
        setTimeout(() => {
            document.querySelector('.viewport-inner').style.animation = '';
        }, 300);
    }
}, 5000);

// ===== SMOOTH PANEL FADE-IN ON LOAD =====
document.querySelectorAll('.panel').forEach((panel, i) => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(20px)';
    panel.style.transition = `opacity 0.8s ease ${i * 0.1}s, transform 0.8s ease ${i * 0.1}s`;
    setTimeout(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
    }, 100);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'p') {
        e.preventDefault();
        triggerSonarPing();
    }
});

console.log('%cABYSSAL STATION HYDRA-7 — OPERATIONS DASHBOARD ONLINE', 'color: #00d4e0; font-size: 14px; font-weight: bold;');
console.log('%cDepth: ' + Math.round(currentDepth) + 'm | Pressure: ' + (currentDepth / 100).toFixed(1) + ' MPa | Status: NOMINAL', 'color: #5a8a9e; font-size: 11px;');
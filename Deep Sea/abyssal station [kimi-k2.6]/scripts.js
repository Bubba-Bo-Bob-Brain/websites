// ==========================================
// ABYSSAL STATION ORPHEUS — Primary Operations
// ==========================================

// Core state
const state = {
    depth: 10847,
    targetDepth: 10847,
    pressure: 1086,
    missionStart: Date.now() - (184 * 24 * 60 * 60 * 1000) - (6 * 60 * 60 * 1000) - (23 * 60 * 1000),
    depthHistory: [],
    maxHistoryPoints: 60,
    sonarAngle: 0,
    sonarContacts: [],
    faunaPositions: [
        { x: 25, y: 30, dx: 0.15, dy: 0.08, species: 'A. victoris', color: 'var(--accent-cyan)' },
        { x: 70, y: 55, dx: -0.12, dy: 0.18, species: 'T. glomerosa', color: 'var(--accent-magenta)' },
        { x: 45, y: 75, dx: 0.08, dy: -0.1, species: 'P. lumina', color: 'var(--accent-lime)' },
        { x: 85, y: 20, dx: -0.2, dy: 0.05, species: 'UNCLASSIFIED', color: 'var(--accent-amber)' }
    ],
    particles: [],
    currentParticles: [],
    hullStressPhase: 0,
    klaxonActive: false
};

// DOM references
const els = {
    depthValue: document.getElementById('depth-value'),
    depthZone: document.getElementById('depth-zone'),
    depthGradient: document.getElementById('depth-gradient'),
    descentRate: document.getElementById('descent-rate'),
    seafloorDist: document.getElementById('seafloor-dist'),
    depthPolyline: document.getElementById('depth-polyline'),
    depthPolygon: document.getElementById('depth-polygon'),
    pressureNeedle: document.getElementById('pressure-needle'),
    pressureValue: document.getElementById('pressure-value'),
    pressureBar: document.getElementById('pressure-bar'),
    pressureDiff: document.getElementById('pressure-diff'),
    integrityMargin: document.getElementById('integrity-margin'),
    klaxonBar: document.getElementById('klaxon-bar'),
    missionTimer: document.getElementById('mission-timer'),
    envStatus: document.getElementById('env-status'),
    cameraCoords: document.getElementById('camera-coords'),
    cameraTimestamp: document.getElementById('camera-timestamp'),
    sonarSweep: document.getElementById('sonar-sweep'),
    sonarBlips: document.getElementById('sonar-blips'),
    contactBearing: document.getElementById('contact-bearing'),
    contactDistance: document.getElementById('contact-distance'),
    contactClass: document.getElementById('contact-class'),
    faunaMap: document.getElementById('fauna-map'),
    tracker1: document.getElementById('tracker-1'),
    tracker2: document.getElementById('tracker-2'),
    tracker3: document.getElementById('tracker-3'),
    tracker4: document.getElementById('tracker-4'),
    spectraBars: document.querySelectorAll('.spectra-bar'),
    hullAggregate: document.getElementById('hull-aggregate'),
    currentVelocity: document.getElementById('current-velocity'),
    currentDirection: document.getElementById('current-direction'),
    currentTemp: document.getElementById('current-temp'),
    currentSalinity: document.getElementById('current-salinity'),
    systemClock: document.getElementById('system-clock'),
    deepSeaBg: document.getElementById('deep-sea-bg')
};

// Canvas contexts
const bioCanvas = document.getElementById('bioluminescent-particles');
const bioCtx = bioCanvas.getContext('2d');
const sonarCanvas = document.getElementById('sonar-canvas');
const sonarCtx = sonarCanvas.getContext('2d');
const currentCanvas = document.getElementById('current-flow-canvas');
const currentCtx = currentCanvas.getContext('2d');

// Resize canvases
function resizeCanvases() {
    const rect = bioCanvas.getBoundingClientRect();
    bioCanvas.width = rect.width;
    bioCanvas.height = rect.height;
    sonarCanvas.width = rect.width;
    sonarCanvas.height = rect.height;
    
    const currentRect = currentCanvas.getBoundingClientRect();
    currentCanvas.width = currentRect.width;
    currentCanvas.height = currentRect.height;
    
    initParticles();
    initCurrentParticles();
}
window.addEventListener('resize', resizeCanvases);

// ==========================================
// PARTICLE SYSTEMS
// ==========================================

function initParticles() {
    state.particles = [];
    const count = Math.floor((bioCanvas.width * bioCanvas.height) / 8000);
    for (let i = 0; i < count; i++) {
        state.particles.push(createParticle());
    }
}

function createParticle() {
    const colors = ['#00e5c4', '#e5007a', '#7ae500', '#e5a300', '#00a384'];
    return {
        x: Math.random() * bioCanvas.width,
        y: Math.random() * bioCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 3 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01
    };
}

function updateParticles() {
    bioCtx.clearRect(0, 0, bioCanvas.width, bioCanvas.height);
    
    state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;
        
        const pulseAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulsePhase));
        
        if (p.x < -10) p.x = bioCanvas.width + 10;
        if (p.x > bioCanvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = bioCanvas.height + 10;
        if (p.y > bioCanvas.height + 10) p.y = -10;
        
        bioCtx.beginPath();
        bioCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bioCtx.fillStyle = p.color;
        bioCtx.globalAlpha = pulseAlpha;
        bioCtx.fill();
        
        // Glow
        const glow = bioCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'transparent');
        bioCtx.beginPath();
        bioCtx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        bioCtx.fillStyle = glow;
        bioCtx.globalAlpha = pulseAlpha * 0.3;
        bioCtx.fill();
    });
    
    bioCtx.globalAlpha = 1;
}

// ==========================================
// SONAR CANVAS
// ==========================================

function drawSonarCanvas() {
    const cx = sonarCanvas.width / 2;
    const cy = sonarCanvas.height / 2;
    const maxRadius = Math.min(cx, cy) * 0.9;
    
    sonarCtx.clearRect(0, 0, sonarCanvas.width, sonarCanvas.height);
    
    // Ping ripple effect
    const time = Date.now() / 1000;
    const pingPhase = (time % 4) / 4;
    
    if (pingPhase < 0.5) {
        const rippleRadius = pingPhase * 2 * maxRadius;
        sonarCtx.beginPath();
        sonarCtx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
        sonarCtx.strokeStyle = `rgba(0, 229, 196, ${0.3 * (1 - pingPhase * 2)})`;
        sonarCtx.lineWidth = 2;
        sonarCtx.stroke();
        
        // Secondary ripple
        if (pingPhase > 0.1) {
            const ripple2 = (pingPhase - 0.1) * 2 * maxRadius;
            sonarCtx.beginPath();
            sonarCtx.arc(cx, cy, ripple2, 0, Math.PI * 2);
            sonarCtx.strokeStyle = `rgba(0, 229, 196, ${0.15 * (1 - (pingPhase - 0.1) * 2.2)})`;
            sonarCtx.lineWidth = 1;
            sonarCtx.stroke();
        }
    }
    
    // Contact echoes
    state.sonarContacts.forEach((contact, i) => {
        const contactPhase = ((time + contact.delay) % 4) / 4;
        if (contactPhase < 0.6) {
            const echoRadius = contactPhase * maxRadius * contact.distance;
            const angle = contact.angle * Math.PI / 180;
            const ex = cx + Math.cos(angle) * echoRadius;
            const ey = cy + Math.sin(angle) * echoRadius;
            
            const echoAlpha = 0.4 * (1 - contactPhase / 0.6);
            sonarCtx.beginPath();
            sonarCtx.arc(ex, ey, 4, 0, Math.PI * 2);
            sonarCtx.fillStyle = `rgba(0, 229, 196, ${echoAlpha})`;
            sonarCtx.fill();
        }
    });
    
    // Sweep arc glow
    const sweepAngle = ((time * 90) % 360) * Math.PI / 180;
    sonarCtx.save();
    sonarCtx.translate(cx, cy);
    sonarCtx.rotate(sweepAngle);
    sonarCtx.beginPath();
    sonarCtx.moveTo(0, 0);
    sonarCtx.arc(0, 0, maxRadius, -0.15, 0.15);
    sonarCtx.closePath();
    const sweepGrad = sonarCtx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
    sweepGrad.addColorStop(0, 'rgba(0, 229, 196, 0.2)');
    sweepGrad.addColorStop(1, 'transparent');
    sonarCtx.fillStyle = sweepGrad;
    sonarCtx.fill();
    sonarCtx.restore();
}

// ==========================================
// CURRENT FLOW VISUALIZATION
// ==========================================

function initCurrentParticles() {
    state.currentParticles = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
        state.currentParticles.push({
            x: Math.random() * currentCanvas.width,
            y: Math.random() * currentCanvas.height,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 0.5,
            trail: []
        });
    }
}

function updateCurrentFlow() {
    const time = Date.now() / 1000;
    const width = currentCanvas.width;
    const height = currentCanvas.height;
    
    currentCtx.fillStyle = 'rgba(6, 10, 15, 0.15)';
    currentCtx.fillRect(0, 0, width, height);
    
    // Flow field based on Perlin-like noise
    state.currentParticles.forEach(p => {
        // Calculate flow velocity at position
        const nx = p.x / width * 4;
        const ny = p.y / height * 4;
        const angle = Math.sin(nx + time * 0.3) * Math.cos(ny - time * 0.2) * Math.PI * 2;
        const speed = 0.5 + Math.sin(time * 0.5 + nx) * 0.3;
        
        const targetVx = Math.cos(angle) * speed;
        const targetVy = Math.sin(angle) * speed + 0.2; // Slight downward bias
        
        p.vx += (targetVx - p.vx) * 0.05;
        p.vy += (targetVy - p.vy) * 0.05;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();
        
        // Wrap
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;
        
        // Draw trail
        if (p.trail.length > 1) {
            currentCtx.beginPath();
            currentCtx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
                currentCtx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            const trailAlpha = 0.15;
            currentCtx.strokeStyle = `rgba(0, 229, 196, ${trailAlpha})`;
            currentCtx.lineWidth = p.size * 0.5;
            currentCtx.stroke();
        }
        
        // Draw particle
        const speedMag = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const hue = 170 + speedMag * 30;
        currentCtx.beginPath();
        currentCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        currentCtx.fillStyle = `hsla(${hue}, 70%, 50%, 0.6)`;
        currentCtx.fill();
    });
}

// ==========================================
// DEPTH & PRESSURE SYSTEMS
// ==========================================

function updateDepth() {
    // Slowly drift depth
    const drift = (Math.sin(Date.now() / 30000) * 0.5 + Math.random() * 0.2 - 0.1);
    state.depth = Math.max(10000, Math.min(11000, state.depth + drift * 0.01));
    
    const depthInt = Math.floor(state.depth);
    els.depthValue.textContent = depthInt.toLocaleString();
    
    // Update zone
    let zone, zoneColor, depthCategory;
    if (state.depth < 4000) {
        zone = 'BATHYAL ZONE';
        zoneColor = 'var(--accent-cyan)';
        depthCategory = 'shallow';
    } else if (state.depth < 6000) {
        zone = 'ABYSSAL ZONE';
        zoneColor = 'var(--accent-cyan-dim)';
        depthCategory = 'mid';
    } else if (state.depth < 8000) {
        zone = 'LOWER ABYSSAL';
        zoneColor = 'var(--accent-amber)';
        depthCategory = 'deep';
    } else {
        zone = 'HADAL ZONE';
        zoneColor = 'var(--accent-magenta)';
        depthCategory = 'hadal';
    }
    
    els.depthZone.textContent = zone;
    els.depthZone.style.color = zoneColor;
    document.body.setAttribute('data-depth', depthCategory);
    
    // Update gradient overlay based on depth
    const depthRatio = (state.depth - 10000) / 1000;
    const temp = 4 - depthRatio * 2.6; // Temperature drops with depth
    const blueIntensity = 0.1 + depthRatio * 0.3;
    els.depthGradient.style.background = `radial-gradient(ellipse at center, rgba(0, ${Math.floor(50 - depthRatio * 30)}, ${Math.floor(80 + depthRatio * 40)}, ${blueIntensity}) 0%, transparent 70%)`;
    
    // Update camera background color temperature
    const warmth = 1 - depthRatio * 0.7;
    els.deepSeaBg.style.filter = `hue-rotate(${depthRatio * 30}deg) saturate(${0.5 + depthRatio * 0.5}) brightness(${0.3 + warmth * 0.2})`;
    
    // Descent rate
    const rate = drift > 0 ? `+${drift.toFixed(1)}` : drift.toFixed(1);
    els.descentRate.textContent = `${rate} m/min`;
    els.descentRate.style.color = drift > 0.3 ? 'var(--accent-amber)' : 'var(--text-primary)';
    
    // Seafloor distance (assuming ~13,000m max ocean depth here)
    const seafloor = Math.max(0, 13000 - state.depth);
    els.seafloorDist.textContent = `${Math.floor(seafloor).toLocaleString()} m`;
    
    // Update chart
    state.depthHistory.push(state.depth);
    if (state.depthHistory.length > state.maxHistoryPoints) {
        state.depthHistory.shift();
    }
    updateDepthChart();
    
    // Update pressure
    state.pressure = state.depth * 0.1 + Math.sin(Date.now() / 5000) * 2;
    updatePressure();
}

function updateDepthChart() {
    if (state.depthHistory.length < 2) return;
    
    const min = Math.min(...state.depthHistory);
    const max = Math.max(...state.depthHistory);
    const range = max - min || 1;
    const w = 300;
    const h = 80;
    
    const points = state.depthHistory.map((d, i) => {
        const x = (i / (state.maxHistoryPoints - 1)) * w;
        const y = h - ((d - min) / range) * (h - 10) - 5;
        return `${x},${y}`;
    }).join(' ');
    
    els.depthPolyline.setAttribute('points', points);
    els.depthPolygon.setAttribute('points', `${points} 300,80 0,80`);
}

function updatePressure() {
    const pressureInt = Math.floor(state.pressure);
    els.pressureValue.textContent = pressureInt.toLocaleString();
    
    // Needle rotation: -135 to +135 degrees, mapped 0-1500 bar
    const needleAngle = -135 + (state.pressure / 1500) * 270;
    els.pressureNeedle.style.transform = `translateX(-50%) rotate(${needleAngle}deg)`;
    
    // Bar width
    const barPercent = Math.min(100, (state.pressure / 1300) * 100);
    els.pressureBar.style.width = `${barPercent}%`;
    
    // Pressure differential (small fluctuation)
    const diff = (Math.sin(Date.now() / 8000) * 0.05).toFixed(2);
    els.pressureDiff.textContent = `${diff} bar`;
    
    // Integrity margin
    const margin = ((1100 - state.pressure) / 1100 * 100).toFixed(1);
    els.integrityMargin.textContent = `${margin}%`;
    els.integrityMargin.style.color = margin < 10 ? 'var(--accent-red)' : margin < 20 ? 'var(--accent-amber)' : 'var(--accent-lime)';
    
    // Klaxon trigger
    const shouldKlaxon = state.pressure > 1150 || margin < 5;
    if (shouldKlaxon !== state.klaxonActive) {
        state.klaxonActive = shouldKlaxon;
        els.klaxonBar.classList.toggle('active', shouldKlaxon);
    }
}

// ==========================================
// TIMER & CLOCK
// ==========================================

function updateTimers() {
    // Mission elapsed
    const elapsed = Date.now() - state.missionStart;
    const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
    const hours = Math.floor((elapsed % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((elapsed % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((elapsed % (60 * 1000)) / 1000);
    
    els.missionTimer.textContent = 
        `${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // System clock
    const now = new Date();
    els.systemClock.textContent = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
    
    // Camera timestamp
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
    els.cameraTimestamp.textContent = `${now.getFullYear()}.${String(dayOfYear).padStart(3, '0')}.${now.toISOString().split('T')[1].split('.')[0]}`;
}

// ==========================================
// SONAR SYSTEM
// ==========================================

function updateSonar() {
    // Generate contacts
    if (Math.random() < 0.02 && state.sonarContacts.length < 5) {
        state.sonarContacts.push({
            angle: Math.random() * 360,
            distance: 0.3 + Math.random() * 0.7,
            delay: Math.random() * 2
        });
    }
    
    // Clean old contacts
    state.sonarContacts = state.sonarContacts.filter((_, i) => Math.random() > 0.005);
    
    // Update display contact
    if (state.sonarContacts.length > 0) {
        const active = state.sonarContacts[0];
        els.contactBearing.textContent = `${Math.floor(active.angle).toString().padStart(3, '0')}°`;
        els.contactDistance.textContent = `${Math.floor(active.distance * 2000)} m`;
        
        const classes = ['UNKNOWN BIOLOGICAL', 'SEAFLOOR CONTACT', 'THERMOCLINE BOUNDARY', 'SUSPENDED SEDIMENT'];
        els.contactClass.textContent = classes[Math.floor(active.delay * 2) % classes.length];
    }
    
    // Update blips on screen
    els.sonarBlips.innerHTML = '';
    state.sonarContacts.forEach((contact, i) => {
        const blip = document.createElement('div');
        blip.className = 'sonar-blip';
        const rad = contact.angle * Math.PI / 180;
        const dist = contact.distance * 40; // percentage
        blip.style.left = `${50 + Math.cos(rad) * dist}%`;
        blip.style.top = `${50 + Math.sin(rad) * dist}%`;
        blip.style.color = i === 0 ? 'var(--accent-cyan)' : 'var(--border-bright)';
        blip.style.background = i === 0 ? 'var(--accent-cyan)' : 'var(--border-bright)';
        els.sonarBlips.appendChild(blip);
    });
}

// ==========================================
// FAUNA TRACKING
// ==========================================

function updateFauna() {
    const trackers = [els.tracker1, els.tracker2, els.tracker3, els.tracker4];
    
    state.faunaPositions.forEach((fauna, i) => {
        // Update position
        fauna.x += fauna.dx;
        fauna.y += fauna.dy;
        
        // Bounce off walls
        if (fauna.x < 5 || fauna.x > 95) fauna.dx *= -1;
        if (fauna.y < 5 || fauna.y > 95) fauna.dy *= -1;
        
        // Keep in bounds
        fauna.x = Math.max(5, Math.min(95, fauna.x));
        fauna.y = Math.max(5, Math.min(95, fauna.y));
        
        // Update tracker element
        const tracker = trackers[i];
        if (tracker) {
            tracker.style.left = `${fauna.x}%`;
            tracker.style.top = `${fauna.y}%`;
            const ping = tracker.querySelector('.tracker-ping');
            ping.style.background = fauna.color;
            ping.style.boxShadow = `0 0 8px ${fauna.color}`;
        }
    });
    
    // Update spectra bars
    els.spectraBars.forEach((bar, i) => {
        const baseHeight = [60, 40, 80, 25, 55][i];
        const variation = Math.sin(Date.now() / 2000 + i * 1.5) * 15;
        bar.style.height = `${Math.max(10, Math.min(95, baseHeight + variation))}%`;
    });
}

// ==========================================
// HULL INTEGRITY
// ==========================================

function updateHull() {
    state.hullStressPhase += 0.02;
    
    // Slight fluctuation in aggregate
    const baseAggregate = 93.8;
    const fluctuation = Math.sin(state.hullStressPhase) * 0.3 + Math.sin(state.hullStressPhase * 1.7) * 0.2;
    const aggregate = (baseAggregate + fluctuation).toFixed(1);
    els.hullAggregate.textContent = `${aggregate}%`;
    
    // Update ring A (forward) - most stress
    const ringA = 94.2 + Math.sin(state.hullStressPhase * 0.8) * 0.4;
    document.querySelector('.hull-ring:nth-child(1) .ring-fill').style.width = `${ringA}%`;
    document.querySelector('.hull-ring:nth-child(1) .ring-value').textContent = `${ringA.toFixed(1)}%`;
    
    // Update aggregate progress ring
    const circumference = 2 * Math.PI * 50;
    const offset = circumference * (1 - aggregate / 100);
    document.querySelector('.aggregate-progress').style.strokeDashoffset = offset;
}

// ==========================================
// CURRENT METRICS
// ==========================================

function updateCurrent() {
    const time = Date.now() / 1000;
    
    const velocity = 0.12 + Math.sin(time * 0.3) * 0.03;
    els.currentVelocity.textContent = `${velocity.toFixed(2)} m/s`;
    
    const direction = 247 + Math.sin(time * 0.2) * 15;
    const dirText = direction < 180 ? `${Math.floor(direction)}° N` : `${Math.floor(360 - direction)}° S`;
    els.currentDirection.textContent = `${Math.floor(direction)}° ${dirText.split(' ')[1]}`;
    
    const temp = 1.4 + Math.sin(time * 0.15) * 0.3;
    els.currentTemp.textContent = `${temp.toFixed(1)}°C`;
    
    const salinity = 34.7 + Math.sin(time * 0.1) * 0.2;
    els.currentSalinity.textContent = `${salinity.toFixed(1)} PSU`;
}

// ==========================================
// COORDINATE DRIFT
// ==========================================

let coordLat = -(35 + 42/60 + 15/3600);
let coordLon = 142 + 19/60 + 33/3600;

function updateCoords() {
    // Very slow drift
    coordLat += (Math.random() - 0.5) * 0.000001;
    coordLon += (Math.random() - 0.5) * 0.000001;
    
    const latDeg = Math.floor(Math.abs(coordLat));
    const latMin = Math.floor((Math.abs(coordLat) - latDeg) * 60);
    const latSec = Math.floor(((Math.abs(coordLat) - latDeg) * 60 - latMin) * 60);
    const latDir = coordLat < 0 ? 'S' : 'N';
    
    const lonDeg = Math.floor(Math.abs(coordLon));
    const lonMin = Math.floor((Math.abs(coordLon) - lonDeg) * 60);
    const lonSec = Math.floor(((Math.abs(coordLon) - lonDeg) * 60 - lonMin) * 60);
    const lonDir = coordLon < 0 ? 'W' : 'E';
    
    els.cameraCoords.textContent = `${latDeg}°${String(latMin).padStart(2,'0')}'${String(latSec).padStart(2,'0')}"${latDir} ${lonDeg}°${String(lonMin).padStart(2,'0')}'${String(lonSec).padStart(2,'0')}"${lonDir}`;
}

// ==========================================
// ENVIRONMENT STATUS
// ==========================================

function updateEnvStatus() {
    const statuses = ['NOMINAL', 'STABLE', 'MONITORING', 'NOMINAL'];
    const status = statuses[Math.floor(Date.now() / 30000) % statuses.length];
    els.envStatus.textContent = status;
    els.envStatus.style.color = status === 'NOMINAL' ? 'var(--accent-lime)' : 'var(--accent-cyan)';
}

// ==========================================
// MAIN LOOP
// ==========================================

function animate() {
    updateParticles();
    drawSonarCanvas();
    updateCurrentFlow();
    requestAnimationFrame(animate);
}

function tick() {
    updateDepth();
    updateTimers();
    updateSonar();
    updateFauna();
    updateHull();
    updateCurrent();
    updateCoords();
    updateEnvStatus();
}

// Initialize
resizeCanvases();
initParticles();
initCurrentParticles();

// Start loops
animate();
setInterval(tick, 1000 / 30); // 30fps for data updates

// Initial call
tick();
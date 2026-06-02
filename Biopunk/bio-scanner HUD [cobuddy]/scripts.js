// ===== TIMESTAMP & CLOCK =====
function updateTimestamp() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
    document.getElementById('timestamp').textContent = `${hours}:${minutes}:${seconds}.${ms} UTC`;
}
setInterval(updateTimestamp, 50);

// ===== HEARTBEAT ECG CANVAS =====
const hbCanvas = document.getElementById('heartbeat-canvas');
const hbCtx = hbCanvas.getContext('2d');
let hbOffset = 0;
let hbTime = 0;

function drawHeartbeat() {
    const w = hbCanvas.width;
    const h = hbCanvas.height;
    const mid = h / 2;

    hbCtx.clearRect(0, 0, w, h);

    // Grid lines
    hbCtx.strokeStyle = 'rgba(0, 255, 120, 0.04)';
    hbCtx.lineWidth = 0.5;
    for (let y = 0; y < h; y += 10) {
        hbCtx.beginPath();
        hbCtx.moveTo(0, y);
        hbCtx.lineTo(w, y);
        hbCtx.stroke();
    }
    for (let x = 0; x < w; x += 20) {
        hbCtx.beginPath();
        hbCtx.moveTo(x, 0);
        hbCtx.lineTo(x, h);
        hbCtx.stroke();
    }

    // ECG waveform
    hbCtx.beginPath();
    hbCtx.strokeStyle = '#ff3366';
    hbCtx.lineWidth = 1.5;
    hbCtx.shadowColor = '#ff3366';
    hbCtx.shadowBlur = 4;

    const bpm = 87;
    const beatDuration = (60 / bpm) * 1000;
    const samplesPerBeat = beatDuration / 16;

    for (let x = 0; x < w; x++) {
        const phase = ((x + hbOffset) % samplesPerBeat) / samplesPerBeat;
        let y = mid;

        // P wave
        if (phase < 0.1) {
            y = mid - 8 * Math.sin(phase * Math.PI / 0.1);
        }
        // QRS complex
        else if (phase >= 0.15 && phase < 0.2) {
            const t = (phase - 0.15) / 0.05;
            if (t < 0.3) {
                y = mid + 25 * t;
            } else {
                y = mid - 20 * (t - 0.3) / 0.7;
            }
        } else if (phase >= 0.2 && phase < 0.22) {
            y = mid - 15;
        }
        // T wave
        else if (phase >= 0.3 && phase < 0.45) {
            const t = (phase - 0.3) / 0.15;
            y = mid - 12 * Math.sin(t * Math.PI);
        }

        if (x === 0) {
            hbCtx.moveTo(x, y);
        } else {
            hbCtx.lineTo(x, y);
        }
    }

    hbCtx.stroke();
    hbCtx.shadowBlur = 0;

    // Glow trail
    const gradient = hbCtx.createLinearGradient(w - 100, 0, w, 0);
    gradient.addColorStop(0, 'rgba(255, 51, 102, 0)');
    gradient.addColorStop(1, 'rgba(255, 51, 102, 0.3)');
    hbCtx.strokeStyle = gradient;
    hbCtx.lineWidth = 3;
    hbCtx.beginPath();

    for (let x = Math.max(0, w - 60); x < w; x++) {
        const phase = ((x + hbOffset) % samplesPerBeat) / samplesPerBeat;
        let y = mid;
        if (phase < 0.1) {
            y = mid - 8 * Math.sin(phase * Math.PI / 0.1);
        } else if (phase >= 0.15 && phase < 0.2) {
            const t = (phase - 0.15) / 0.05;
            if (t < 0.3) y = mid + 25 * t;
            else y = mid - 20 * (t - 0.3) / 0.7;
        } else if (phase >= 0.2 && phase < 0.22) {
            y = mid - 15;
        } else if (phase >= 0.3 && phase < 0.45) {
            const t = (phase - 0.3) / 0.15;
            y = mid - 12 * Math.sin(t * Math.PI);
        }
        if (x === Math.max(0, w - 60)) hbCtx.moveTo(x, y);
        else hbCtx.lineTo(x, y);
    }
    hbCtx.stroke();

    hbOffset += 2;
    requestAnimationFrame(drawHeartbeat);
}
drawHeartbeat();

// ===== NANOMACHINE SWARM CANVAS =====
const nanoCanvas = document.getElementById('nano-canvas');
const nanoCtx = nanoCanvas.getContext('2d');
let nanoParticles = [];
const NANO_COUNT = 60;

function initNanoParticles() {
    nanoParticles = [];
    for (let i = 0; i < NANO_COUNT; i++) {
        nanoParticles.push({
            x: Math.random() * nanoCanvas.width,
            y: Math.random() * nanoCanvas.height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2 + 0.5,
            color: ['#00ff78', '#00ccff', '#ff3366', '#ffb400'][Math.floor(Math.random() * 4)],
            alpha: Math.random() * 0.6 + 0.2,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
}

function drawNanoSwarm() {
    nanoCtx.clearRect(0, 0, nanoCanvas.width, nanoCanvas.height);

    // Grid background
    nanoCtx.strokeStyle = 'rgba(0, 255, 120, 0.05)';
    nanoCtx.lineWidth = 0.5;
    for (let x = 0; x < nanoCanvas.width; x += 15) {
        nanoCtx.beginPath();
        nanoCtx.moveTo(x, 0);
        nanoCtx.lineTo(x, nanoCanvas.height);
        nanoCtx.stroke();
    }
    for (let y = 0; y < nanoCanvas.height; y += 15) {
        nanoCtx.beginPath();
        nanoCtx.moveTo(0, y);
        nanoCtx.lineTo(nanoCanvas.width, y);
        nanoCtx.stroke();
    }

    // Draw connections
    for (let i = 0; i < nanoParticles.length; i++) {
        for (let j = i + 1; j < nanoParticles.length; j++) {
            const dx = nanoParticles[i].x - nanoParticles[j].x;
            const dy = nanoParticles[i].y - nanoParticles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50) {
                nanoCtx.beginPath();
                nanoCtx.strokeStyle = `rgba(0, 255, 120, ${0.1 * (1 - dist / 50)})`;
                nanoCtx.lineWidth = 0.5;
                nanoCtx.moveTo(nanoParticles[i].x, nanoParticles[i].y);
                nanoCtx.lineTo(nanoParticles[j].x, nanoParticles[j].y);
                nanoCtx.stroke();
            }
        }
    }

    // Draw and update particles
    nanoParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += 0.03;

        if (p.x < 0 || p.x > nanoCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > nanoCanvas.height) p.vy *= -1;

        // Add slight organic drift
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
            p.vx *= 0.99;
            p.vy *= 0.99;
        }

        const pulse = Math.sin(p.pulsePhase) * 0.3 + 0.7;
        const size = p.size * pulse;

        nanoCtx.beginPath();
        nanoCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
        nanoCtx.fillStyle = p.color;
        nanoCtx.globalAlpha = p.alpha * pulse;
        nanoCtx.fill();
        nanoCtx.globalAlpha = 1;

        // Glow
        nanoCtx.beginPath();
        nanoCtx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
        nanoCtx.fillStyle = p.color;
        nanoCtx.globalAlpha = 0.1 * pulse;
        nanoCtx.fill();
        nanoCtx.globalAlpha = 1;
    });

    requestAnimationFrame(drawNanoSwarm);
}

initNanoParticles();
drawNanoSwarm();

// ===== REAL-TIME DATA UPDATES =====
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function jitter(base, range) {
    return base + (Math.random() - 0.5) * range;
}

function updateOrganData() {
    // Heart
    const heartBpm = Math.round(jitter(87, 8));
    document.getElementById('bpm').textContent = heartBpm;
    document.getElementById('heart-eff').textContent = Math.round(jitter(94, 6));
    const heartBar = document.getElementById('bar-heart');
    heartBar.style.width = clamp(heartBpm + 5, 40, 100) + '%';

    // Brain
    document.getElementById('brain-pwr').textContent = (jitter(3.2, 0.6)).toFixed(1);
    document.getElementById('brain-sync').textContent = Math.round(jitter(89, 10));
    const brainBar = document.getElementById('bar-brain');
    brainBar.style.width = clamp(jitter(72, 12), 30, 95) + '%';

    // Lungs
    document.getElementById('lung-o2').textContent = Math.round(jitter(98, 4));
    document.getElementById('lung-cap').textContent = (jitter(0.4, 0.08)).toFixed(2);
    const lungBar = document.getElementById('bar-lungs');
    lungBar.style.width = clamp(jitter(91, 8), 50, 100) + '%';

    // Liver
    document.getElementById('liver-fxn').textContent = Math.round(jitter(72, 10));
    document.getElementById('liver-tox').textContent = (jitter(4.1, 1.5)).toFixed(1);
    const liverBar = document.getElementById('bar-liver');
    liverBar.style.width = clamp(jitter(63, 15), 20, 80) + '%';

    // Kidneys
    document.getElementById('kidney-gfr').textContent = Math.round(jitter(92, 8));
    document.getElementById('kidney-fltr').textContent = (jitter(0.8, 0.2)).toFixed(2);
    const kidneyBar = document.getElementById('bar-kidneys');
    kidneyBar.style.width = clamp(jitter(78, 10), 40, 95) + '%';

    // Spine
    document.getElementById('spine-link').textContent = Math.round(jitter(97, 3));
    document.getElementById('spine-sync').textContent = Math.round(jitter(99, 2));
    const spineBar = document.getElementById('bar-spine');
    spineBar.style.width = clamp(jitter(95, 5), 70, 100) + '%';
}

// ===== MUTATION PROGRESSION =====
function updateMutation() {
    const mutation = clamp(jitter(42, 3), 0, 100);
    document.getElementById('mutation-fill').style.width = mutation + '%';
    document.getElementById('mutation-marker').style.left = mutation + '%';
    document.getElementById('mutation-val').textContent = Math.round(mutation);
}

// ===== TOXIN LEVELS =====
function updateToxins() {
    const toxins = [
        { id: 'hexyl', base: 34, range: 12 },
        { id: 'cyano', base: 67, range: 14 },
        { id: 'bio', base: 12, range: 8 },
        { id: 'neuro', base: 89, range: 10 },
        { id: 'cell', base: 45, range: 16 }
    ];

    toxins.forEach(t => {
        const val = clamp(Math.round(jitter(t.base, t.range)), 0, 100);
        document.getElementById(`toxin-${t.id}`).style.width = val + '%';
        document.getElementById(`toxin-${t.id}-val`).textContent = val;

        const fill = document.getElementById(`toxin-${t.id}`);
        if (val < 30) fill.setAttribute('data-level', 'low');
        else if (val < 70) fill.setAttribute('data-level', 'medium');
        else fill.setAttribute('data-level', 'high');
    });
}

// ===== NEURAL INTEGRITY =====
function updateNeural() {
    const val = Math.round(jitter(75, 8));
    document.getElementById('neuralValue').textContent = clamp(val, 50, 99);
    const arc = document.getElementById('ni-arc');
    const circumference = 314;
    const offset = circumference - (clamp(val, 50, 99) / 100) * circumference;
    arc.setAttribute('stroke-dashoffset', offset);
}

// ===== GENE MATRIX FLICKER =====
function updateGeneMatrix() {
    const rows = document.querySelectorAll('.gene-row');
    rows.forEach(row => {
        const dots = row.querySelectorAll('.gene-dot');
        dots.forEach((dot, i) => {
            if (Math.random() < 0.02) {
                dot.classList.toggle('active');
            }
        });
    });
}

// ===== NANO STATS =====
function updateNanoStats() {
    const count = Math.round(jitter(2847103, 100000));
    document.getElementById('nano-count').textContent = count.toLocaleString();
    document.getElementById('nano-deploy').textContent = (jitter(78.3, 2)).toFixed(1) + '%';
    document.getElementById('nano-repair').textContent = (jitter(12.4, 3)).toFixed(1) + '/s';
    document.getElementById('nano-threats').textContent = Math.round(jitter(847, 20));
}

// ===== SYSTEM STATS =====
function updateSystemStats() {
    document.getElementById('sys-integrity').textContent = (jitter(94.7, 1)).toFixed(1);
    document.getElementById('mem-alloc').textContent = (jitter(2.1, 0.3)).toFixed(1);
    document.getElementById('cpu-load').textContent = Math.round(jitter(67, 12));
}

// ===== ALERT SYSTEM =====
const alertMessages = [
    'HEPATIC ANOMALY DETECTED — SEQUENCE ANALYSIS REQUIRED',
    'NEURAL LINK FLUCTUATION — CALIBRATION INITIATED',
    'TOXIN SPIKE: NEURO-FLUX — COUNTERMEASURE DEPLOYED',
    'NANOMACHINE SWARM RECONFIGURED — ZONE 7',
    'GENE-LOCUS D1 CORRUPTION — ISOLATION PROTOCOL',
    'CARDIAC RHYTHM ANOMALY — PACING ADJUSTED',
    'BIO-AX THRESHOLD EXCEEDED — DETOX ACTIVATED'
];

let alertIndex = 0;
function triggerAlert() {
    const overlay = document.getElementById('alert-overlay');
    const text = document.getElementById('alert-text');
    text.textContent = alertMessages[alertIndex % alertMessages.length];
    overlay.classList.add('visible');
    setTimeout(() => {
        overlay.classList.remove('visible');
    }, 2500);
    alertIndex++;
}

// Periodic alert
setInterval(() => {
    if (Math.random() < 0.3) {
        triggerAlert();
    }
}, 8000);

// Initial alert after 3 seconds
setTimeout(triggerAlert, 3000);

// ===== BODY WIREFRAME PULSE =====
function pulseWireframe() {
    const wireframe = document.getElementById('body-wireframe');
    const organs = wireframe.querySelectorAll('.wire-organ');
    const heartbeat = 87;

    // Pulse the heart wireframe
    const wireHeart = document.getElementById('wire-heart');
    const heartCircle = wireHeart.querySelector('circle');
    if (heartCircle) {
        const phase = (Date.now() % (60000 / heartbeat)) / (60000 / heartbeat);
        const scale = 1 + 0.08 * Math.sin(phase * Math.PI * 2);
        heartCircle.setAttribute('r', (3 * scale).toFixed(2));
    }

    // Subtle opacity pulse on all wire organs
    organs.forEach(organ => {
        const phase = (Date.now() % 4000) / 4000;
        organ.style.opacity = 0.5 + 0.2 * Math.sin(phase * Math.PI);
    });

    requestAnimationFrame(pulseWireframe);
}
pulseWireframe();

// ===== RUN ALL UPDATES =====
setInterval(updateOrganData, 2000);
setInterval(updateMutation, 3000);
setInterval(updateToxins, 2500);
setInterval(updateNeural, 1500);
setInterval(updateGeneMatrix, 1000);
setInterval(updateNanoStats, 2000);
setInterval(updateSystemStats, 1800);

// Initial update
updateOrganData();
updateMutation();
updateToxins();
updateNeural();
updateGeneMatrix();
updateNanoStats();
updateSystemStats();

// ===== INTERACTIVE HOVER EFFECTS ON ORGANS =====
document.querySelectorAll('.organ-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        const organName = this.querySelector('.organ-name').textContent;
        const wireOrgan = document.getElementById(`wire-${organName.toLowerCase()}`);
        if (wireOrgan) {
            wireOrgan.style.opacity = '1';
            wireOrgan.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 120, 0.5))';
        }
    });

    card.addEventListener('mouseleave', function () {
        const organName = this.querySelector('.organ-name').textContent;
        const wireOrgan = document.getElementById(`wire-${organName.toLowerCase()}`);
        if (wireOrgan) {
            wireOrgan.style.opacity = '';
            wireOrgan.style.filter = '';
        }
    });
});

// ===== BREATHING AMBIENT SOUND VISUALIZATION (SUBTLE PULSE) =====
function ambientPulse() {
    const cards = document.querySelectorAll('.organ-card');
    const now = Date.now();
    const heartbeat = 87;
    const cycle = 60000 / heartbeat;

    cards.forEach((card, i) => {
        const phase = ((now + i * 200) % cycle) / cycle;
        const scale = 1 + 0.005 * Math.sin(phase * Math.PI * 2);
        card.style.transform = `scale(${scale})`;
    });

    requestAnimationFrame(ambientPulse);
}
ambientPulse();

// ===== CORNER DECORATION PULSE =====
function pulseCorners() {
    const corners = document.querySelectorAll('.corner-decor');
    const now = Date.now();
    corners.forEach((corner, i) => {
        const phase = (now / 1000 + i) % 2;
        corner.style.opacity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(phase * Math.PI));
    });
    requestAnimationFrame(pulseCorners);
}
pulseCorners();

// ===== BODY PULSE RING ANIMATION =====
function animateBodyPulse() {
    const ring = document.querySelector('.body-pulse-ring');
    if (ring) {
        const now = Date.now();
        const phase = (now / 3000) % 1;
        const scale = 1 + 0.15 * Math.sin(phase * Math.PI * 2);
        const opacity = 0.3 - 0.2 * Math.sin(phase * Math.PI * 2);
        ring.style.transform = `scale(${scale})`;
        ring.style.opacity = Math.max(0, opacity);
    }
    requestAnimationFrame(animateBodyPulse);
}
animateBodyPulse();

// ===== DATA GLITCH EFFECT =====
function glitchEffect() {
    const panels = document.querySelectorAll('.panel-section, .organ-card');
    if (Math.random() < 0.05) {
        const randomPanel = panels[Math.floor(Math.random() * panels.length)];
        randomPanel.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
        setTimeout(() => {
            randomPanel.style.transform = '';
        }, 100);
    }
    requestAnimationFrame(glitchEffect);
}
glitchEffect();

// ===== SCAN LINE SPEED VARIATION =====
const scanLine = document.querySelector('.scan-line');
let scanSpeed = 4;
setInterval(() => {
    scanSpeed = 3 + Math.random() * 2;
    scanLine.style.animationDuration = scanSpeed + 's';
}, 5000);
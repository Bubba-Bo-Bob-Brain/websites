// =====================
// STARFIELD PARALLAX
// =====================
const starCanvas = document.getElementById('starfield-canvas');
const starCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
resizeStarCanvas();
window.addEventListener('resize', resizeStarCanvas);

class Star {
  constructor() {
    this.reset();
    this.y = Math.random() * starCanvas.height;
  }
  reset() {
    this.x = Math.random() * starCanvas.width;
    this.y = -5;
    this.size = Math.random() * 2 + 0.5;
    this.speed = Math.random() * 0.5 + 0.1;
    this.brightness = Math.random() * 0.7 + 0.3;
    this.hue = Math.random() > 0.8 ? 300 : 180;
  }
  update() {
    this.y += this.speed;
    if (this.y > starCanvas.height + 5) this.reset();
  }
  draw() {
    starCtx.beginPath();
    starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    starCtx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.brightness})`;
    starCtx.fill();
    if (this.size > 1.2) {
      starCtx.beginPath();
      starCtx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      starCtx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.brightness * 0.15})`;
      starCtx.fill();
    }
  }
}

for (let i = 0; i < 200; i++) {
  stars.push(new Star());
}

function animateStarfield() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  // Deep background gradient
  const grad = starCtx.createRadialGradient(
    starCanvas.width / 2, starCanvas.height / 2, 0,
    starCanvas.width / 2, starCanvas.height / 2, starCanvas.width * 0.7
  );
  grad.addColorStop(0, '#0d0520');
  grad.addColorStop(0.5, '#080818');
  grad.addColorStop(1, '#020208');
  starCtx.fillStyle = grad;
  starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateStarfield);
}
animateStarfield();

// =====================
// NAVIGATION CANVAS
// =====================
const navCanvas = document.getElementById('nav-canvas');
const navCtx = navCanvas.getContext('2d');

function resizeNavCanvas() {
  const rect = navCanvas.parentElement.getBoundingClientRect();
  navCanvas.width = rect.width;
  navCanvas.height = 140;
}
resizeNavCanvas();
window.addEventListener('resize', resizeNavCanvas);

let navDots = [];
for (let i = 0; i < 30; i++) {
  navDots.push({
    x: Math.random() * 360,
    y: Math.random() * 200,
    size: Math.random() * 1.5 + 0.5,
    pulse: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.01
  });
}

function drawNav() {
  navCtx.clearRect(0, 0, navCanvas.width, navCanvas.height);
  // Grid
  navCtx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
  navCtx.lineWidth = 0.5;
  for (let x = 0; x < navCanvas.width; x += 30) {
    navCtx.beginPath();
    navCtx.moveTo(x, 0);
    navCtx.lineTo(x, navCanvas.height);
    navCtx.stroke();
  }
  for (let y = 0; y < navCanvas.height; y += 30) {
    navCtx.beginPath();
    navCtx.moveTo(0, y);
    navCtx.lineTo(navCanvas.width, y);
    navCtx.stroke();
  }
  // Nav dots (stars/waypoints)
  navDots.forEach(dot => {
    dot.pulse += dot.speed;
    const opacity = 0.3 + Math.sin(dot.pulse) * 0.3;
    navCtx.beginPath();
    navCtx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    navCtx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
    navCtx.fill();
    // Connect some dots
    if (Math.random() > 0.97) {
      navDots.forEach(other => {
        if (other !== dot) {
          const dist = Math.hypot(other.x - dot.x, other.y - dot.y);
          if (dist < 80) {
            navCtx.beginPath();
            navCtx.moveTo(dot.x, dot.y);
            navCtx.lineTo(other.x, other.y);
            navCtx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
            navCtx.lineWidth = 0.5;
            navCtx.stroke();
          }
        }
      });
    }
  });
  // Ship position indicator
  navCtx.beginPath();
  navCtx.arc(navCanvas.width / 2, navCanvas.height / 2, 4, 0, Math.PI * 2);
  navCtx.fillStyle = '#00f0ff';
  navCtx.fill();
  navCtx.beginPath();
  navCtx.arc(navCanvas.width / 2, navCanvas.height / 2, 8, 0, Math.PI * 2);
  navCtx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  navCtx.lineWidth = 1;
  navCtx.stroke();
  // Heading line
  navCtx.beginPath();
  navCtx.moveTo(navCanvas.width / 2, navCanvas.height / 2);
  navCtx.lineTo(navCanvas.width / 2 + 40, navCanvas.height / 2 - 30);
  navCtx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
  navCtx.lineWidth = 1;
  navCtx.stroke();
  requestAnimationFrame(drawNav);
}
drawNav();

// =====================
// FREQUENCY VISUALIZER
// =====================
const freqCanvas = document.getElementById('freq-canvas');
const freqCtx = freqCanvas.getContext('2d');

function resizeFreqCanvas() {
  freqCanvas.width = freqCanvas.parentElement.offsetWidth;
  freqCanvas.height = 60;
}
resizeFreqCanvas();
window.addEventListener('resize', resizeFreqCanvas);

let freqData = new Array(64).fill(0);
let freqPhase = 0;

function drawFreq() {
  freqCtx.clearRect(0, 0, freqCanvas.width, freqCanvas.height);
  // Background grid lines
  freqCtx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
  freqCtx.lineWidth = 0.5;
  for (let y = 0; y < freqCanvas.height; y += 10) {
    freqCtx.beginPath();
    freqCtx.moveTo(0, y);
    freqCtx.lineTo(freqCanvas.width, y);
    freqCtx.stroke();
  }
  // Generate waveform
  freqPhase += 0.03;
  for (let i = 0; i < freqData.length; i++) {
    const target = Math.sin(freqPhase + i * 0.15) * 15 +
      Math.sin(freqPhase * 1.7 + i * 0.08) * 10 +
      Math.sin(freqPhase * 0.3 + i * 0.25) * 8 +
      (Math.random() - 0.5) * 4;
    freqData[i] += (target - freqData[i]) * 0.15;
  }
  // Draw waveform
  freqCtx.beginPath();
  freqCtx.moveTo(0, freqCanvas.height / 2);
  for (let i = 0; i < freqData.length; i++) {
    const x = (i / freqData.length) * freqCanvas.width;
    const y = freqCanvas.height / 2 + freqData[i];
    freqCtx.lineTo(x, y);
  }
  freqCtx.strokeStyle = '#00f0ff';
  freqCtx.lineWidth = 1.5;
  freqCtx.shadowColor = '#00f0ff';
  freqCtx.shadowBlur = 6;
  freqCtx.stroke();
  freqCtx.shadowBlur = 0;
  // Mirror waveform
  freqCtx.beginPath();
  for (let i = 0; i < freqData.length; i++) {
    const x = (i / freqData.length) * freqCanvas.width;
    const y = freqCanvas.height / 2 - freqData[i];
    if (i === 0) freqCtx.moveTo(x, y);
    else freqCtx.lineTo(x, y);
  }
  freqCtx.strokeStyle = 'rgba(255, 0, 255, 0.4)';
  freqCtx.lineWidth = 1;
  freqCtx.stroke();
  // Frequency bars
  for (let i = 0; i < freqData.length; i += 2) {
    const barHeight = Math.abs(freqData[i]) * 0.5;
    freqCtx.fillStyle = `rgba(0, 240, 255, ${0.1 + Math.abs(freqData[i]) / 50})`;
    freqCtx.fillRect(
      (i / freqData.length) * freqCanvas.width,
      freqCanvas.height / 2 - barHeight,
      freqCanvas.width / freqData.length - 1,
      barHeight * 2
    );
  }
  requestAnimationFrame(drawFreq);
}
drawFreq();

// =====================
// REACTOR VISUALIZATION
// =====================
const reactorCanvas = document.getElementById('reactor-canvas');
const reactorCtx = reactorCanvas.getContext('2d');

function resizeReactorCanvas() {
  reactorCanvas.width = reactorCanvas.parentElement.offsetWidth;
  reactorCanvas.height = 80;
}
resizeReactorCanvas();
window.addEventListener('resize', resizeReactorCanvas);

let reactorPhase = 0;

function drawReactor() {
  reactorCtx.clearRect(0, 0, reactorCanvas.width, reactorCanvas.height);
  reactorPhase += 0.02;
  const cx = reactorCanvas.width / 2;
  const cy = reactorCanvas.height / 2;
  // Core glow
  const coreGrad = reactorCtx.createRadialGradient(cx, cy, 0, cx, cy, 35);
  coreGrad.addColorStop(0, 'rgba(255, 102, 0, 0.6)');
  coreGrad.addColorStop(0.5, 'rgba(255, 45, 149, 0.3)');
  coreGrad.addColorStop(1, 'transparent');
  reactorCtx.fillStyle = coreGrad;
  reactorCtx.fillRect(0, 0, reactorCanvas.width, reactorCanvas.height);
  // Energy rings
  for (let i = 0; i < 3; i++) {
    const radius = 15 + i * 10 + Math.sin(reactorPhase + i) * 5;
    reactorCtx.beginPath();
    reactorCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    reactorCtx.strokeStyle = `rgba(255, ${102 + i * 40}, 0, ${0.3 + Math.sin(reactorPhase + i) * 0.15})`;
    reactorCtx.lineWidth = 1;
    reactorCtx.stroke();
  }
  // Spinning particle arcs
  for (let i = 0; i < 4; i++) {
    const angle = reactorPhase * (1 + i * 0.3) + (i * Math.PI / 2);
    const r = 20 + Math.sin(reactorPhase * 0.5 + i) * 8;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r * 0.6;
    reactorCtx.beginPath();
    reactorCtx.arc(px, py, 2, 0, Math.PI * 2);
    reactorCtx.fillStyle = '#ff6600';
    reactorCtx.shadowColor = '#ff6600';
    reactorCtx.shadowBlur = 6;
    reactorCtx.fill();
    reactorCtx.shadowBlur = 0;
  }
  // Plasma flow bars
  for (let i = 0; i < 8; i++) {
    const barX = (i / 8) * reactorCanvas.width;
    const barH = 4 + Math.sin(reactorPhase * 2 + i * 0.8) * 3;
    reactorCtx.fillStyle = `rgba(255, 102, 0, ${0.3 + Math.sin(reactorPhase + i) * 0.15})`;
    reactorCtx.fillRect(barX, cy - barH / 2, reactorCanvas.width / 8 - 2, barH);
  }
  requestAnimationFrame(drawReactor);
}
drawReactor();

// =====================
// REAL-TIME CLOCK & STARDATE
// =====================
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time-display').textContent = `${h}:${m}:${s}`;
  // Stardate calculation (fictional)
  const start = new Date(2320, 0, 1);
  const diff = now - start;
  const days = diff / 86400000;
  const stardate = (3847 + days / 365.25).toFixed(2);
  document.getElementById('stardate').textContent = `STARDATE ${stardate}`;
}
setInterval(updateClock, 1000);
updateClock();

// =====================
// POWER SLIDERS
// =====================
document.querySelectorAll('.power-slider').forEach(slider => {
  slider.addEventListener('input', function () {
    const power = this.dataset.power;
    const val = document.getElementById(`power-${power}`);
    if (val) val.textContent = `${this.value}%`;
    // Update fill color based on value
    const fill = this.parentElement.querySelector('.power-slider');
    if (this.value > 70) {
      this.style.background = `linear-gradient(90deg, rgba(0,240,255,0.3), rgba(255,0,255,0.3))`;
    } else if (this.value < 30) {
      this.style.background = `rgba(255,51,51,0.2)`;
    } else {
      this.style.background = `rgba(240,224,0,0.2)`;
    }
  });
});

// =====================
// ALERT STATUS
// =====================
let currentAlert = 'green';

document.getElementById('alert-green').addEventListener('click', function () {
  setAlert('green');
});
document.getElementById('alert-yellow').addEventListener('click', function () {
  setAlert('yellow');
});
document.getElementById('alert-red').addEventListener('click', function () {
  setAlert('red');
});

function setAlert(level) {
  currentAlert = level;
  const status = document.getElementById('alert-status');
  status.className = `alert-status ${level}`;
  status.textContent = `CONDITION ${level === 'green' ? 'GREEN' : level.toUpperCase()}`;
  document.querySelectorAll('.alert-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`alert-${level}`).classList.add('active');
  // Add alert log entry
  const log = document.getElementById('alert-log');
  const entry = document.createElement('div');
  entry.className = `alert-entry ${level === 'red' ? 'yellow' : level === 'yellow' ? 'yellow' : 'blue'}`;
  if (level === 'red') {
    entry.textContent = `🔴 RED ALERT — All hands to battle stations`;
  } else if (level === 'yellow') {
    entry.textContent = `⚠ CONDITION YELLOW — Elevated readiness`;
  } else {
    entry.textContent = `✓ CONDITION GREEN — Normal operations`;
  }
  log.insertBefore(entry, log.firstChild);
}

// =====================
// TARGET LOCK SYSTEM
// =====================
let targetLocked = false;
const reticle = document.getElementById('target-reticle');

document.querySelector('.viewport-frame').addEventListener('click', function () {
  targetLocked = !targetLocked;
  const targetName = document.getElementById('target-name');
  const targetDistance = document.getElementById('target-distance');
  const torpCount = document.getElementById('torp-count');
  if (targetLocked) {
    targetName.textContent = 'KLIINGON D7';
    targetDistance.textContent = 'DISTANCE: 14.2 KM — BEARING 247';
    torpCount.textContent = '22';
    reticle.style.transform = 'translate(-50%, -50%) scale(1.3)';
  } else {
    targetName.textContent = 'NO TARGET LOCKED';
    targetDistance.textContent = '—';
    torpCount.textContent = '24';
    reticle.style.transform = 'translate(-50%, -50%) scale(1)';
  }
});

// =====================
// TORPEDO INDICATORS
// =====================
document.querySelectorAll('.torp-dot').forEach((dot, i) => {
  dot.classList.add('active');
  if (i >= 4) dot.classList.remove('active');
});

// =====================
// SHIELD INTEGRITY ANIMATION
// =====================
function animateShields() {
  const segments = ['fwd', 'port', 'stbd', 'aft'];
  segments.forEach(seg => {
    const fill = document.getElementById(`shield-${seg}`);
    if (fill) {
      const val = 80 + Math.sin(Date.now() / 2000 + segments.indexOf(seg)) * 10;
      fill.style.width = `${val}%`;
    }
  });
}
setInterval(animateShields, 100);

// =====================
// WARP INDICATOR ANIMATION
// =====================
function animateWarp() {
  const fill = document.getElementById('warp-fill');
  if (fill) {
    const val = 58 + Math.sin(Date.now() / 3000) * 8;
    fill.style.width = `${val}%`;
  }
}
setInterval(animateWarp, 100);

// =====================
// COMM BUTTON INTERACTIONS
// =====================
document.getElementById('comm-send').addEventListener('click', function () {
  const log = document.getElementById('comm-log');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span> <span class="log-from">SYNTHWAVE:</span> Channel open — awaiting response.`;
  log.insertBefore(entry, log.firstChild);
});

document.getElementById('comm-hail').addEventListener('click', function () {
  const log = document.getElementById('comm-log');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span> <span class="log-from">HAIL:</span> Broadband hail — all frequencies.`;
  log.insertBefore(entry, log.firstChild);
});

document.getElementById('comm-record').addEventListener('click', function () {
  this.classList.toggle('recording');
  if (this.classList.contains('recording')) {
    this.style.background = 'rgba(255, 0, 0, 0.3)';
    this.style.borderColor = '#ff3333';
    this.style.boxShadow = '0 0 10px rgba(255, 51, 51, 0.4)';
  } else {
    this.style.background = 'rgba(0, 0, 0, 0.4)';
    this.style.borderColor = 'rgba(0, 240, 255, 0.2)';
    this.style.boxShadow = 'none';
  }
});

// =====================
// NAVIGATION DATA UPDATES
// =====================
function updateNavData() {
  const headings = ['247.3° / 012', '251.8° / 007', '243.1° / 015', '249.5° / 010'];
  const sectors = ['7G — KEPLER', '7G — KEPLER', '7H — ANDROMEDA', '7G — KEPLER'];
  const velocities = ['WARP 6.2', 'WARP 6.5', 'WARP 5.8', 'WARP 6.3'];
  const idx = Math.floor(Math.random() * headings.length);
  document.getElementById('heading').textContent = headings[idx];
  document.getElementById('sector').textContent = sectors[idx];
  document.getElementById('velocity').textContent = velocities[idx];
}
setInterval(updateNavData, 8000);

// =====================
// ENGINEERING STATS UPDATES
// =====================
function updateEngineering() {
  const temp = (2800 + Math.random() * 100).toFixed(0);
  const plasma = (92 + Math.random() * 6).toFixed(1);
  const dilithium = (85 + Math.random() * 5).toFixed(1);
  document.getElementById('core-temp').textContent = `${Number(temp).toLocaleString()} K`;
  document.getElementById('plasma-flow').textContent = `${plasma}%`;
  document.getElementById('dilithium').textContent = `${dilithium}%`;
}
setInterval(updateEngineering, 3000);

// =====================
// FREQUENCY DRIFT
// =====================
function updateFrequency() {
  const freq = (47.8 + Math.random() * 0.1).toFixed(3);
  document.getElementById('freq-value').textContent = `${freq} MHz`;
}
setInterval(updateFrequency, 2000);

// =====================
// BEAM ARRAY ANIMATION
// =====================
function animateBeams() {
  document.querySelectorAll('.beam-fill').forEach((fill, i) => {
    const val = 60 + Math.sin(Date.now() / 1500 + i * 1.5) * 25;
    fill.style.width = `${val}%`;
  });
}
setInterval(animateBeams, 100);

// =====================
// SYSTEMS CHECK BLINK
// =====================
function animateSystems() {
  document.querySelectorAll('.sys-item').forEach(item => {
    if (Math.random() > 0.95) {
      item.style.opacity = '0.3';
      setTimeout(() => item.style.opacity = '1', 200);
    }
  });
}
setInterval(animateSystems, 2000);

// =====================
// SHIELD RING ANIMATION
// =====================
function animateShieldRings() {
  const rings = document.querySelectorAll('.shield-ring');
  rings.forEach((ring, i) => {
    const scale = 1 + Math.sin(Date.now() / 2000 + i) * 0.02;
    ring.style.strokeDasharray = `${Math.PI * 2 * 80 * scale}`;
  });
}
setInterval(animateShieldRings, 50);

// =====================
// RETICLE PULSE
// =====================
function reticlePulse() {
  if (targetLocked) {
    const ring = document.querySelector('.reticle-ring');
    const scale = 1 + Math.sin(Date.now() / 500) * 0.08;
    ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
}
setInterval(reticlePulse, 50);

// =====================
// SCAN LINES ANIMATION
// =====================
function scanLineAnimation() {
  const scanLines = document.querySelectorAll('.scan-lines');
  scanLines.forEach(lines => {
    const style = window.getComputedStyle(lines);
    const currentBg = style.background;
  });
}
setInterval(scanLineAnimation, 100);

// =====================
// INIT
// =====================
console.log('%c BRIDGE CONSOLE v2.1 — USS SYNTHWAVE NCC-8080 ', 'background: #0a0a14; color: #00f0ff; font-family: monospace; padding: 10px; border: 1px solid #00f0ff;');
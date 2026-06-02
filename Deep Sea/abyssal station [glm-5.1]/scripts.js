const DEPTH_BASE = 10847;
const DEPTH_DRIFT_SPEED = 0.3;
const CRUSH_DEPTH = 11000;
const MISSION_START = Date.now() - (287 * 86400000 + 14 * 3600000 + 33 * 60000);

let currentDepth = DEPTH_BASE;
let depthDirection = 1;
let sonarRange = 500;
let sonarPingActive = false;
let sonarPings = [];
let klaxonActive = false;
let hullIntegrity = {
  overall: 97.3,
  forward: 98.1,
  aft: 96.7,
  port: 97.4,
  starboard: 97.8,
  dorsal: 96.2,
  ventral: 98.5
};
let sonarContacts = [
  { id: 'ALPHA', bearing: 47, range: 320, type: 'L-MASS', drift: 0.02 },
  { id: 'BETA', bearing: 189, range: 412, type: 'M-MASS', drift: -0.01 },
  { id: 'GAMMA', bearing: 312, range: 198, type: 'S-MASS', drift: 0.015 }
];
let faunaLogQueue = [];
let lastFaunaLogTime = 0;

const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
const currentCanvas = document.getElementById('currentCanvas');
const currentCtx = currentCanvas.getContext('2d');
const sonarCanvas = document.getElementById('sonarCanvas');
const sonarCtx = sonarCanvas.getContext('2d');
const sonarMiniCanvas = document.getElementById('sonarMiniCanvas');
const sonarMiniCtx = sonarMiniCanvas.getContext('2d');

function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;

  particleCanvas.width = window.innerWidth * dpr;
  particleCanvas.height = window.innerHeight * dpr;
  particleCtx.scale(dpr, dpr);

  currentCanvas.width = window.innerWidth * dpr;
  currentCanvas.height = window.innerHeight * dpr;
  currentCtx.scale(dpr, dpr);

  const sonarFrame = sonarCanvas.parentElement;
  const sw = sonarFrame.clientWidth;
  const sh = sonarFrame.clientHeight;
  sonarCanvas.width = sw * dpr;
  sonarCanvas.height = sh * dpr;
  sonarCtx.scale(dpr, dpr);

  const miniFrame = sonarMiniCanvas.parentElement;
  const mw = miniFrame.clientWidth;
  const mh = miniFrame.clientHeight;
  sonarMiniCanvas.width = mw * dpr;
  sonarMiniCanvas.height = mh * dpr;
  sonarMiniCtx.scale(dpr, dpr);
}

window.addEventListener('resize', resizeCanvases);
resizeCanvases();

const particles = [];
const PARTICLE_COUNT = 80;

class BiolumParticle {
  constructor() {
    this.reset(true);
  }

  reset(initial) {
    this.x = Math.random() * window.innerWidth;
    this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 10;
    this.size = Math.random() * 3 + 0.5;
    this.baseAlpha = Math.random() * 0.4 + 0.1;
    this.alpha = this.baseAlpha;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.hue = Math.random() < 0.6 ? 170 + Math.random() * 20 : 280 + Math.random() * 30;
    this.saturation = 80 + Math.random() * 20;
    this.lightness = 50 + Math.random() * 30;
    this.driftAmplitude = Math.random() * 1.5 + 0.5;
    this.driftFreq = Math.random() * 0.005 + 0.002;
    this.age = 0;
  }

  update() {
    this.age++;
    this.x += this.vx + Math.sin(this.age * this.driftFreq) * this.driftAmplitude * 0.1;
    this.y += this.vy;
    this.alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.age * this.pulseSpeed + this.pulseOffset));

    if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) {
      this.reset(false);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    const color = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
    const glowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha * 0.3})`;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new BiolumParticle());
}

const currentLines = [];
const CURRENT_LINE_COUNT = 30;

class CurrentLine {
  constructor() {
    this.reset(true);
  }

  reset(initial) {
    this.y = initial ? Math.random() * window.innerHeight : -20;
    this.x = Math.random() * window.innerWidth;
    this.length = Math.random() * 120 + 40;
    this.speed = Math.random() * 0.8 + 0.2;
    this.alpha = Math.random() * 0.08 + 0.02;
    this.waveAmp = Math.random() * 20 + 5;
    this.waveFreq = Math.random() * 0.01 + 0.005;
    this.phase = Math.random() * Math.PI * 2;
    this.segments = Math.floor(this.length / 4);
  }

  update() {
    this.y += this.speed;
    this.phase += 0.01;
    if (this.y > window.innerHeight + 30) {
      this.reset(false);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = `rgba(0, 180, 220, 1)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= this.segments; i++) {
      const t = i / this.segments;
      const px = this.x + Math.sin(this.phase + t * this.waveFreq * this.length) * this.waveAmp;
      const py = this.y - this.length + t * this.length;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }
}

for (let i = 0; i < CURRENT_LINE_COUNT; i++) {
  currentLines.push(new CurrentLine());
}

class SonarPing {
  constructor(x, y, maxRadius) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.alpha = 0.8;
    this.speed = 1.5;
  }

  update() {
    this.radius += this.speed;
    this.alpha = 0.8 * (1 - this.radius / this.maxRadius);
    return this.radius < this.maxRadius;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = '#00ffd5';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffd5';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = this.alpha * 0.3;
    ctx.lineWidth = 6;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

function updateClocks() {
  const now = new Date();
  const utc = now.toUTCString().split(' ')[4];
  document.getElementById('utcClock').textContent = utc;

  const elapsed = Date.now() - MISSION_START;
  const days = Math.floor(elapsed / 86400000);
  const hrs = Math.floor((elapsed % 86400000) / 3600000);
  const mins = Math.floor((elapsed % 3600000) / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  document.getElementById('missionClock').textContent =
    `${days}:${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function updateDepth() {
  currentDepth += depthDirection * DEPTH_DRIFT_SPEED * (0.5 + Math.random() * 0.5);

  if (currentDepth > DEPTH_BASE + 15) depthDirection = -1;
  if (currentDepth < DEPTH_BASE - 10) depthDirection = 1;

  const depthStr = Math.round(currentDepth).toLocaleString();
  document.getElementById('depthValue').textContent = depthStr;
  document.getElementById('hudDepth').textContent = depthStr + 'm';

  const fillPercent = (currentDepth / CRUSH_DEPTH) * 100;
  document.getElementById('depthFill').style.height = fillPercent + '%';

  const crushMarkerPos = 100 - (CRUSH_DEPTH / 12000) * 100;
  document.getElementById('crushMarker').style.top = crushMarkerPos + '%';

  const trendVal = (DEPTH_DRIFT_SPEED * depthDirection * 3.6).toFixed(1);
  document.getElementById('depthTrendValue').textContent =
    (depthDirection > 0 ? '+' : '') + trendVal + 'm/h';
  document.getElementById('depthTrendArrow').innerHTML =
    depthDirection > 0 ? '&#9660;' : '&#9650;';
  document.getElementById('depthTrendArrow').style.color =
    depthDirection > 0 ? 'var(--amber)' : 'var(--cyan)';
  document.getElementById('depthTrendArrow').style.color =
    depthDirection > 0 ? '#ffaa00' : '#00ffd5';

  const zone = currentDepth > 6000 ? 'HADOPELAGIC' : currentDepth > 4000 ? 'ABYSSOPELAGIC' : 'BATHYPELAGIC';
  document.getElementById('depthZone').textContent = zone;

  updateAmbientColor();
}

function updateAmbientColor() {
  const ratio = Math.min(currentDepth / CRUSH_DEPTH, 1);
  const r = Math.round(6 + (20 - 6) * (1 - ratio));
  const g = Math.round(10 + (10 - 10) * (1 - ratio));
  const b = Math.round(18 + (5 - 18) * (1 - ratio));

  const ambientR = Math.round(0 + (30 - 0) * (1 - ratio));
  const ambientG = Math.round(80 + (120 - 80) * (1 - ratio));
  const ambientB = Math.round(120 + (180 - 120) * (1 - ratio));

  document.querySelector('.ambient-overlay').style.background =
    `radial-gradient(ellipse at 50% 30%, rgba(${ambientR}, ${ambientG}, ${ambientB}, ${0.15 * (1 - ratio * 0.5)}) 0%, transparent 60%), ` +
    `radial-gradient(ellipse at 20% 80%, rgba(0, 255, 213, ${0.03 * (1 - ratio * 0.7)}) 0%, transparent 40%), ` +
    `radial-gradient(ellipse at 80% 70%, rgba(0, 100, 180, ${0.05 * (1 - ratio * 0.6)}) 0%, transparent 40%)`;

  if (ratio > 0.92) {
    document.querySelector('.ambient-overlay').style.background +=
      `, radial-gradient(ellipse at 50% 50%, rgba(255, 34, 68, ${(ratio - 0.92) * 2}) 0%, transparent 70%)`;
  }
}

function updatePressure() {
  const depthRatio = currentDepth / 1000;
  const basePressure = depthRatio * 100.6;
  const noise = (Math.random() - 0.5) * 2;
  const pressure = basePressure + noise;
  const pressureStr = pressure.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  document.getElementById('pressureValue').textContent = pressureStr;
  document.getElementById('pressureExt').textContent = pressureStr + ' ATM';

  const maxDisplayPressure = 1200;
  const pressurePercent = Math.min((pressure / maxDisplayPressure) * 100, 100);
  document.getElementById('pressureBarFill').style.width = pressurePercent + '%';
  document.getElementById('pressureMarker').style.left = pressurePercent + '%';

  const diff = pressure - 1.0;
  document.getElementById('pressureDiff').textContent =
    diff.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ATM';

  const temp = (1.4 + (Math.random() - 0.5) * 0.1).toFixed(1);
  document.getElementById('pressureTemp').textContent = temp + '\u00B0C';

  const badge = document.getElementById('pressureBadge');
  if (pressurePercent > 90) {
    badge.textContent = 'CRITICAL';
    badge.className = 'section-badge badge-critical';
  } else if (pressurePercent > 75) {
    badge.textContent = 'CAUTION';
    badge.className = 'section-badge badge-warning';
  } else {
    badge.textContent = 'NOMINAL';
    badge.className = 'section-badge badge-nominal';
  }
}

function updateHull() {
  Object.keys(hullIntegrity).forEach(key => {
    if (key === 'overall') return;
    const drift = (Math.random() - 0.5) * 0.02;
    hullIntegrity[key] = Math.max(80, Math.min(100, hullIntegrity[key] + drift));
  });

  const sections = Object.keys(hullIntegrity).filter(k => k !== 'overall');
  hullIntegrity.overall = sections.reduce((sum, k) => sum + hullIntegrity[k], 0) / sections.length;

  document.getElementById('hullPercent').textContent = hullIntegrity.overall.toFixed(1);
  const ringCircumference = 2 * Math.PI * 42;
  const ringOffset = ringCircumference * (1 - hullIntegrity.overall / 100);
  const ringProgress = document.getElementById('hullRingProgress');
  ringProgress.setAttribute('stroke-dashoffset', ringOffset.toFixed(1));

  const sectionMap = {
    forward: 'hullForward',
    aft: 'hullAft',
    port: 'hullPort',
    starboard: 'hullStarboard',
    dorsal: 'hullDorsal',
    ventral: 'hullVentral'
  };

  Object.entries(sectionMap).forEach(([key, id]) => {
    const val = hullIntegrity[key];
    const fillEl = document.getElementById(id);
    const valEl = document.getElementById(id + 'Val');
    fillEl.style.width = val + '%';
    valEl.textContent = val.toFixed(1) + '%';

    if (val < 90) {
      fillEl.style.background = 'var(--red)';
      valEl.style.color = 'var(--red)';
    } else if (val < 95) {
      fillEl.style.background = 'var(--amber)';
      valEl.style.color = 'var(--amber)';
    } else {
      fillEl.style.background = 'var(--green)';
      valEl.style.color = 'var(--green)';
    }
  });

  const hullColor = hullIntegrity.overall > 95 ? '#00ff88' :
    hullIntegrity.overall > 90 ? '#ffaa00' : '#ff2244';
  ringProgress.setAttribute('stroke', hullColor);
  document.documentElement.style.setProperty('--hull-ring-color', hullColor);

  const badge = document.getElementById('hullBadge');
  if (hullIntegrity.overall < 90) {
    badge.textContent = 'CRITICAL';
    badge.className = 'section-badge badge-critical';
  } else if (hullIntegrity.overall < 95) {
    badge.textContent = 'CAUTION';
    badge.className = 'section-badge badge-warning';
  } else {
    badge.textContent = 'NOMINAL';
    badge.className = 'section-badge badge-nominal';
  }

  const stressPercent = ((100 - hullIntegrity.overall) / 85 * 100).toFixed(1);
  document.getElementById('stressValue').textContent =
    (100 - hullIntegrity.overall).toFixed(1) + '% / 85% THRESHOLD';
  document.getElementById('stressFill').style.width = stressPercent + '%';

  updateHullDiagramPoints();
  updateKlaxon();
}

function updateHullDiagramPoints() {
  const points = document.querySelectorAll('.hull-point');
  const values = [
    hullIntegrity.forward,
    hullIntegrity.forward,
    hullIntegrity.dorsal,
    hullIntegrity.ventral,
    hullIntegrity.aft,
    hullIntegrity.aft
  ];
  points.forEach((point, i) => {
    const val = values[i] || 97;
    if (val < 90) point.setAttribute('fill', '#ff2244');
    else if (val < 95) point.setAttribute('fill', '#ffaa00');
    else point.setAttribute('fill', '#00ff88');
  });

  const diagramRing = document.getElementById('hullDiagramRing');
  const totalPerimeter = 2 * Math.PI * 80 + 2 * Math.PI * 40;
  const dashOffset = totalPerimeter * (1 - hullIntegrity.overall / 100);
  diagramRing.setAttribute('stroke-dashoffset', dashOffset.toFixed(1));

  const ringColor = hullIntegrity.overall > 95 ? 'rgba(0,255,136,0.4)' :
    hullIntegrity.overall > 90 ? 'rgba(255,170,0,0.5)' : 'rgba(255,34,68,0.5)';
  diagramRing.setAttribute('stroke', ringColor);
}

function updateKlaxon() {
  const depthRatio = currentDepth / CRUSH_DEPTH;
  const shouldActivate = depthRatio > 0.93 || hullIntegrity.overall < 92;

  const klaxonBar = document.getElementById('klaxonBar');
  if (shouldActivate && !klaxonActive) {
    klaxonActive = true;
    klaxonBar.classList.add('active');
    document.getElementById('klaxonText').style.opacity = '1';
  } else if (!shouldActivate && klaxonActive) {
    klaxonActive = false;
    klaxonBar.classList.remove('active');
    document.getElementById('klaxonText').style.opacity = '0.5';
  }

  if (depthRatio > 0.93) {
    document.getElementById('klaxonText').textContent =
      'CRUSH DEPTH PROXIMITY WARNING \u2014 ' + Math.round(CRUSH_DEPTH - currentDepth) + 'm MARGIN';
  } else if (hullIntegrity.overall < 92) {
    document.getElementById('klaxonText').textContent =
      'HULL INTEGRITY WARNING \u2014 STRESS FATIGUE APPROACHING THRESHOLD';
  } else {
    document.getElementById('klaxonText').textContent =
      'PRESSURE WARNING \u2014 HULL STRESS APPROACHING THRESHOLD';
  }
}

function updateSonarContacts() {
  sonarContacts.forEach(contact => {
    contact.bearing += contact.drift * (0.5 + Math.random());
    if (contact.bearing < 0) contact.bearing += 360;
    if (contact.bearing >= 360) contact.bearing -= 360;
    contact.range += (Math.random() - 0.5) * 2;
    contact.range = Math.max(50, Math.min(sonarRange * 0.9, contact.range));
  });

  const alphaEl = document.getElementById('contactAlpha');
  const betaEl = document.getElementById('contactBeta');
  const gammaEl = document.getElementById('contactGamma');

  if (alphaEl) {
    alphaEl.children[1].textContent = Math.round(sonarContacts[0].bearing) + '\u00B0';
    alphaEl.children[2].textContent = Math.round(sonarContacts[0].range) + 'm';
  }
  if (betaEl) {
    betaEl.children[1].textContent = Math.round(sonarContacts[1].bearing) + '\u00B0';
    betaEl.children[2].textContent = Math.round(sonarContacts[1].range) + 'm';
  }
  if (gammaEl) {
    gammaEl.children[1].textContent = Math.round(sonarContacts[2].bearing) + '\u00B0';
    gammaEl.children[2].textContent = Math.round(sonarContacts[2].range) + 'm';
  }
}

function updateSignalStrength() {
  const bars = document.querySelectorAll('.signal-bar');
  const activeCount = 3 + Math.floor(Math.random() * 3);
  bars.forEach((bar, i) => {
    if (i < activeCount) bar.classList.add('active');
    else bar.classList.remove('active');
  });
  const dbVal = -30 - Math.floor(Math.random() * 30);
  document.getElementById('signalValue').textContent = dbVal + 'dB';
}

function updateFaunaActivity() {
  const activity = 50 + Math.random() * 35;
  document.getElementById('activityFill').style.width = activity + '%';
  document.getElementById('activityValue').textContent = Math.round(activity) + '%';

  const count = 12 + Math.floor(Math.random() * 6);
  document.getElementById('faunaCount').textContent = count;

  const items = document.querySelectorAll('.fauna-item');
  items.forEach(item => {
    const distEl = item.querySelector('.fauna-distance');
    const currentDist = parseInt(distEl.textContent);
    const newDist = Math.max(5, currentDist + Math.round((Math.random() - 0.5) * 8));
    distEl.textContent = newDist + 'm';
  });
}

function addFaunaLogEntry() {
  const now = new Date();
  const time = now.toUTCString().split(' ')[4].substring(0, 8);
  const species = [
    { name: 'Atolla Jellyfish', glow: '#cc66ff', count: Math.floor(Math.random() * 8) + 1 },
    { name: 'Comb Jelly', glow: '#00ccff', count: Math.floor(Math.random() * 12) + 2 },
    { name: 'Abyssal Anglerfish', glow: '#00ffd5', count: Math.floor(Math.random() * 3) + 1 },
    { name: 'Deep-Sea Dragonfish', glow: '#ff8800', count: Math.floor(Math.random() * 2) + 1 },
    { name: 'Vampire Squid', glow: '#ff00aa', count: 1 },
    { name: 'Barreleye Fish', glow: '#66ffcc', count: Math.floor(Math.random() * 4) + 1 },
    { name: 'Dumbo Octopus', glow: '#ff66aa', count: 1 }
  ];
  const sp = species[Math.floor(Math.random() * species.length)];

  const logContainer = document.getElementById('faunaLog');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML =
    `<span class="log-time">${time}</span>` +
    `<span class="log-species" style="--glow: ${sp.glow}">${sp.name} \u2022 ${sp.count} ${sp.count > 1 ? 'entities' : 'entity'}</span>`;

  logContainer.insertBefore(entry, logContainer.firstChild);
  if (logContainer.children.length > 5) {
    logContainer.removeChild(logContainer.lastChild);
  }
}

function drawSonarMain(timestamp) {
  const container = sonarCanvas.parentElement;
  const w = container.clientWidth;
  const h = container.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) * 0.85;

  sonarCtx.clearRect(0, 0, w, h);

  sonarCtx.strokeStyle = 'rgba(0, 255, 213, 0.06)';
  sonarCtx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    sonarCtx.beginPath();
    sonarCtx.arc(cx, cy, maxR * (i / 4), 0, Math.PI * 2);
    sonarCtx.stroke();
  }

  sonarCtx.strokeStyle = 'rgba(0, 255, 213, 0.04)';
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = angle * Math.PI / 180;
    sonarCtx.beginPath();
    sonarCtx.moveTo(cx, cy);
    sonarCtx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
    sonarCtx.stroke();
  }

  const sweepAngle = ((timestamp || 0) / 8) % 360;
  const sweepRad = sweepAngle * Math.PI / 180;
  const gradient = sonarCtx.createConicalGradient
    ? null
    : null;

  sonarCtx.save();
  sonarCtx.translate(cx, cy);
  sonarCtx.rotate(sweepRad);
  const sweepGrad = sonarCtx.createLinearGradient(0, 0, maxR, 0);
  sweepGrad.addColorStop(0, 'rgba(0, 255, 213, 0.0)');
  sweepGrad.addColorStop(1, 'rgba(0, 255, 213, 0.08)');
  sonarCtx.fillStyle = sweepGrad;
  sonarCtx.beginPath();
  sonarCtx.moveTo(0, 0);
  sonarCtx.arc(0, 0, maxR, -0.3, 0);
  sonarCtx.closePath();
  sonarCtx.fill();
  sonarCtx.restore();

  sonarContacts.forEach(contact => {
    const cRad = contact.bearing * Math.PI / 180;
    const cDist = (contact.range / sonarRange) * maxR;
    const cX = cx + Math.sin(cRad) * cDist;
    const cY = cy - Math.cos(cRad) * cDist;

    const angleDiff = Math.abs(sweepAngle - contact.bearing) % 360;
    const fadeFactor = angleDiff < 60 ? 1 - angleDiff / 60 : 0;

    sonarCtx.save();
    sonarCtx.globalAlpha = 0.3 + fadeFactor * 0.7;

    const blipColor = contact.id === 'ALPHA' ? '#00ffd5' :
      contact.id === 'BETA' ? '#ffaa00' : '#cc44ff';
    sonarCtx.fillStyle = blipColor;
    sonarCtx.shadowColor = blipColor;
    sonarCtx.shadowBlur = 8 + fadeFactor * 12;
    sonarCtx.beginPath();
    sonarCtx.arc(cX, cY, 3, 0, Math.PI * 2);
    sonarCtx.fill();

    sonarCtx.restore();
  });

  sonarPings = sonarPings.filter(ping => {
    const alive = ping.update();
    ping.draw(sonarCtx);
    return alive;
  });
}

function drawSonarMini(timestamp) {
  const container = sonarMiniCanvas.parentElement;
  const w = container.clientWidth;
  const h = container.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) - 4;

  sonarMiniCtx.clearRect(0, 0, w, h);

  sonarMiniCtx.strokeStyle = 'rgba(0, 255, 213, 0.08)';
  sonarMiniCtx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    sonarMiniCtx.beginPath();
    sonarMiniCtx.arc(cx, cy, maxR * (i / 3), 0, Math.PI * 2);
    sonarMiniCtx.stroke();
  }

  sonarMiniCtx.strokeStyle = 'rgba(0, 255, 213, 0.05)';
  for (let angle = 0; angle < 360; angle += 45) {
    const rad = angle * Math.PI / 180;
    sonarMiniCtx.beginPath();
    sonarMiniCtx.moveTo(cx, cy);
    sonarMiniCtx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
    sonarMiniCtx.stroke();
  }

  const sweepAngle = ((timestamp || 0) / 8) % 360;
  const sweepRad = (sweepAngle - 90) * Math.PI / 180;

  sonarMiniCtx.save();
  sonarMiniCtx.translate(cx, cy);
  sonarMiniCtx.rotate(sweepRad);
  const sweepGrad = sonarMiniCtx.createLinearGradient(0, 0, maxR, 0);
  sweepGrad.addColorStop(0, 'rgba(0, 255, 213, 0.0)');
  sweepGrad.addColorStop(1, 'rgba(0, 255, 213, 0.15)');
  sonarMiniCtx.fillStyle = sweepGrad;
  sonarMiniCtx.beginPath();
  sonarMiniCtx.moveTo(0, 0);
  sonarMiniCtx.arc(0, 0, maxR, -0.4, 0);
  sonarMiniCtx.closePath();
  sonarMiniCtx.fill();
  sonarMiniCtx.restore();

  sonarContacts.forEach(contact => {
    const cRad = (contact.bearing - 90) * Math.PI / 180;
    const cDist = (contact.range / sonarRange) * maxR;
    const cX = cx + Math.cos(cRad) * cDist;
    const cY = cy + Math.sin(cRad) * cDist;

    const angleDiff = Math.abs(sweepAngle - contact.bearing) % 360;
    const fadeFactor = angleDiff < 60 ? 1 - angleDiff / 60 : 0;

    sonarMiniCtx.save();
    sonarMiniCtx.globalAlpha = 0.4 + fadeFactor * 0.6;
    const blipColor = contact.id === 'ALPHA' ? '#00ffd5' :
      contact.id === 'BETA' ? '#ffaa00' : '#cc44ff';
    sonarMiniCtx.fillStyle = blipColor;
    sonarMiniCtx.shadowColor = blipColor;
    sonarMiniCtx.shadowBlur = 6 + fadeFactor * 10;
    sonarMiniCtx.beginPath();
    sonarMiniCtx.arc(cX, cY, 2.5, 0, Math.PI * 2);
    sonarMiniCtx.fill();
    sonarMiniCtx.restore();
  });
}

function drawParticles() {
  particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(p => {
    p.update();
    p.draw(particleCtx);
  });
}

function drawCurrents() {
  currentCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  currentLines.forEach(l => {
    l.update();
    l.draw(currentCtx);
  });
}

function triggerSonarPing() {
  const container = sonarCanvas.parentElement;
  const w = container.clientWidth;
  const h = container.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(cx, cy) * 0.85;

  sonarPings.push(new SonarPing(cx, cy, maxR));

  const btn = document.getElementById('sonarPingBtn');
  btn.style.color = '#ffffff';
  btn.style.textShadow = '0 0 15px rgba(0, 255, 213, 0.8)';
  setTimeout(() => {
    btn.style.color = '';
    btn.style.textShadow = '';
  }, 300);
}

document.getElementById('sonarPingBtn').addEventListener('click', triggerSonarPing);

document.querySelectorAll('.range-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sonarRange = parseInt(btn.dataset.range);
    document.getElementById('hudRange').textContent = sonarRange >= 1000 ?
      (sonarRange / 1000) + 'km' : sonarRange + 'm';
  });
});

function updateComms() {
  const dot = document.getElementById('commsDot');
  const text = document.getElementById('commsText');
  const latency = document.getElementById('commsLatency');
  const footerDot = document.getElementById('commsFooterDot');
  const footerVal = document.getElementById('commsFooterVal');

  const lat = (3.8 + Math.random() * 1.5).toFixed(1);
  latency.textContent = lat + 's LATENCY';

  if (Math.random() < 0.05) {
    dot.style.background = 'var(--red)';
    dot.style.boxShadow = '0 0 6px var(--red)';
    text.textContent = 'LOST';
    text.style.color = 'var(--red)';
    footerDot.className = 'status-dot status-critical';
    footerVal.textContent = 'OFFLINE';

    setTimeout(() => {
      dot.style.background = '';
      dot.style.boxShadow = '';
      text.textContent = 'DELAYED';
      text.style.color = '';
      footerDot.className = 'status-dot status-warn';
      footerVal.textContent = 'DEGRADED';
    }, 2000 + Math.random() * 3000);
  }
}

function updateAlertStatus() {
  const alertDot = document.querySelector('.alert-dot');
  const alertText = document.getElementById('alertText');

  if (klaxonActive) {
    alertDot.style.background = 'var(--red)';
    alertDot.style.boxShadow = '0 0 8px var(--red)';
    alertText.textContent = 'WARNING';
    alertText.style.color = 'var(--red)';
  } else if (hullIntegrity.overall < 96) {
    alertDot.style.background = 'var(--amber)';
    alertDot.style.boxShadow = '0 0 8px var(--amber)';
    alertText.textContent = 'CAUTION';
    alertText.style.color = 'var(--amber)';
  } else {
    alertDot.style.background = 'var(--green)';
    alertDot.style.boxShadow = '0 0 8px var(--green)';
    alertText.textContent = 'NOMINAL';
    alertText.style.color = 'var(--green)';
  }
}

function updateHudData() {
  const bearing = (247 + Math.sin(Date.now() / 10000) * 5).toFixed(0);
  document.getElementById('hudBearing').textContent = bearing + '\u00B0';
  const salinity = (35.0 + Math.sin(Date.now() / 15000) * 0.5).toFixed(1);
  document.getElementById('hudSalinity').textContent = salinity + '\u2030';
}

function updateFooterSystems() {
  const powerVar = 82 + Math.random() * 6;
  document.getElementById('powerVal').textContent = Math.round(powerVar) + '% CAPACITY';
  document.getElementById('powerOutput').textContent = (3.8 + Math.random() * 0.8).toFixed(1) + ' MW';

  const o2 = 20.8 + Math.random() * 1.2;
  document.getElementById('o2Value').textContent = o2.toFixed(1) + '%';
  document.getElementById('o2Value').style.color = o2 < 20.5 ? 'var(--amber)' : 'var(--green)';
}

let mainLoopFrame = 0;

function mainLoop(timestamp) {
  drawParticles();
  drawCurrents();
  drawSonarMain(timestamp);
  drawSonarMini(timestamp);

  mainLoopFrame++;
  if (mainLoopFrame % 60 === 0) {
    updateClocks();
    updateDepth();
    updatePressure();
    updateHull();
    updateSonarContacts();
    updateSignalStrength();
    updateAlertStatus();
    updateHudData();
    updateFooterSystems();
  }

  if (mainLoopFrame % 120 === 0) {
    updateFaunaActivity();
  }

  if (mainLoopFrame % 300 === 0) {
    addFaunaLogEntry();
    updateComms();
  }

  if (mainLoopFrame % 600 === 0) {
    triggerSonarPing();
  }

  requestAnimationFrame(mainLoop);
}

updateClocks();
updateDepth();
updatePressure();
updateHull();
updateSonarContacts();
updateSignalStrength();
updateFaunaActivity();
updateAlertStatus();
updateHudData();
updateFooterSystems();

requestAnimationFrame(mainLoop);

setInterval(updateClocks, 1000);
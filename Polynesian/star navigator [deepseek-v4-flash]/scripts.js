// ===== Configuration =====
const CONFIG = {
  starCount: 200,
  constellationCount: 8,
  islandCount: 7,
  currentCount: 5,
  swellCount: 6,
  markerCount: 4,
  starMinRadius: 1.2,
  starMaxRadius: 3.5,
  centerX: 400,
  centerY: 400,
  domeRadius: 380,
};

// ===== DOM References =====
const starCanvas = document.getElementById('starCanvas');
const ctx = starCanvas.getContext('2d');
const svg = document.querySelector('.star-dome');
const ns = 'http://www.w3.org/2000/svg';
const starGroup = document.getElementById('starGroup');
const constellationGroup = document.getElementById('constellationGroup');
const wayfindingGroup = document.getElementById('wayfindingGroup');
const islandGroup = document.getElementById('islandGroup');
const currentGroup = document.getElementById('currentGroup');
const waveGroup = document.getElementById('waveGroup');
const markerGroup = document.getElementById('markerGroup');
const wakeCanvas = document.getElementById('wakeCanvas');
const wakeCtx = wakeCanvas.getContext('2d');
const navButtons = document.querySelectorAll('.nav-btn');

// ===== State =====
let mouseX = 0;
let mouseY = 0;
let currentMode = 'stars';
let stars = [];
let constellations = [];
let islands = [];
let currents = [];
let swells = [];
let markers = [];
let wakePoints = [];
let frameId = null;

// ===== Star Canvas Background =====
function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}

function generateBackgroundStars() {
  const width = starCanvas.width;
  const height = starCanvas.height;
  stars = [];
  for (let i = 0; i < CONFIG.starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: CONFIG.starMinRadius + Math.random() * (CONFIG.starMaxRadius - CONFIG.starMinRadius),
      alpha: 0.3 + Math.random() * 0.7,
      speed: 0.0005 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.5 + Math.random() * 2,
    });
  }
}

function drawBackgroundStars(time) {
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  for (const star of stars) {
    const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.phase));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 232, 192, ${star.alpha * twinkle})`;
    ctx.fill();

    if (star.radius > 2.5) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 232, 192, ${star.alpha * twinkle * 0.08})`;
      ctx.fill();
    }
  }
}

// ===== Helper: Create SVG Element =====
function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

// ===== Generate Constellation Stars =====
function generateConstellations() {
  const centerX = CONFIG.centerX;
  const centerY = CONFIG.centerY;
  const radius = CONFIG.domeRadius;

  const constellationData = [
    { name: 'Matariki', count: 7, baseAngle: 0.2, baseDist: 0.5, color: '#ffe8c0' },
    { name: 'Te Punga', count: 5, baseAngle: 1.8, baseDist: 0.6, color: '#d4b0e0' },
    { name: 'Mere', count: 4, baseAngle: 3.5, baseDist: 0.4, color: '#b0d8ff' },
    { name: 'Tautoru', count: 3, baseAngle: 4.8, baseDist: 0.7, color: '#ffc8a0' },
    { name: 'Takurua', count: 6, baseAngle: 2.5, baseDist: 0.35, color: '#c0e8ff' },
    { name: 'Whanui', count: 4, baseAngle: 5.9, baseDist: 0.55, color: '#ffd8b0' },
    { name: 'Puanga', count: 5, baseAngle: 0.9, baseDist: 0.45, color: '#e0c8ff' },
    { name: 'Rigel', count: 3, baseAngle: 4.0, baseDist: 0.65, color: '#b0e0ff' },
  ];

  constellations = [];

  for (const data of constellationData) {
    const points = [];
    for (let i = 0; i < data.count; i++) {
      const angle = data.baseAngle + (i / data.count) * 0.8 + (Math.random() - 0.5) * 0.3;
      const dist = data.baseDist + (Math.random() - 0.5) * 0.15;
      const x = centerX + Math.cos(angle) * radius * dist;
      const y = centerY + Math.sin(angle) * radius * dist;
      points.push({ x, y, label: `${data.name}-${i + 1}` });
    }

    // Draw constellation lines
    const lineGroup = document.createElementNS(ns, 'g');
    for (let i = 0; i < points.length - 1; i++) {
      const line = createSVGElement('line', {
        x1: points[i].x,
        y1: points[i].y,
        x2: points[i + 1].x,
        y2: points[i + 1].y,
        class: 'constellation-line',
      });
      lineGroup.appendChild(line);
    }
    // Connect last to first for some constellations
    if (data.name === 'Matariki' || data.name === 'Tautoru') {
      const closeLine = createSVGElement('line', {
        x1: points[points.length - 1].x,
        y1: points[points.length - 1].y,
        x2: points[0].x,
        y2: points[0].y,
        class: 'constellation-line',
      });
      lineGroup.appendChild(closeLine);
    }
    constellationGroup.appendChild(lineGroup);

    // Draw star points
    for (const point of points) {
      const starEl = createSVGElement('circle', {
        cx: point.x,
        cy: point.y,
        r: 2 + Math.random() * 2.5,
        class: 'star-point',
        fill: data.color,
        opacity: 0.7 + Math.random() * 0.3,
      });
      starGroup.appendChild(starEl);
    }

    constellations.push({ name: data.name, points });
  }
}

// ===== Generate Islands =====
function generateIslands() {
  const centerX = CONFIG.centerX;
  const centerY = CONFIG.centerY;
  const radius = CONFIG.domeRadius;

  const islandData = [
    { name: 'Hawaiʻi', angle: 0.8, dist: 0.85, size: 12 },
    { name: 'Tahiti', angle: 2.1, dist: 0.6, size: 10 },
    { name: 'Aotearoa', angle: 3.6, dist: 0.75, size: 14 },
    { name: 'Rapa Nui', angle: 5.0, dist: 0.9, size: 8 },
    { name: 'Samoa', angle: 1.4, dist: 0.55, size: 9 },
    { name: 'Fiji', angle: 2.8, dist: 0.5, size: 10 },
    { name: 'Marquesas', angle: 4.3, dist: 0.65, size: 7 },
  ];

  islands = [];
  for (const data of islandData) {
    const x = centerX + Math.cos(data.angle) * radius * data.dist;
    const y = centerY + Math.sin(data.angle) * radius * data.dist;

    // Island circle
    const circle = createSVGElement('circle', {
      cx: x,
      cy: y,
      r: data.size,
      class: 'island-marker',
    });
    islandGroup.appendChild(circle);

    // Island label
    const label = createSVGElement('text', {
      x: x,
      y: y + data.size + 10,
      class: 'island-label',
      'text-anchor': 'middle',
    });
    label.textContent = data.name;
    islandGroup.appendChild(label);

    islands.push({ name: data.name, x, y, size: data.size });
  }
}

// ===== Generate Ocean Currents =====
function generateCurrents() {
  const centerX = CONFIG.centerX;
  const centerY = CONFIG.centerY;
  const radius = CONFIG.domeRadius;

  const currentData = [
    { startAngle: 0.5, endAngle: 2.0, dist: 0.7, label: 'North Pacific' },
    { startAngle: 2.5, endAngle: 4.0, dist: 0.5, label: 'South Pacific' },
    { startAngle: 4.5, endAngle: 5.8, dist: 0.8, label: 'Equatorial' },
    { startAngle: 1.0, endAngle: 3.5, dist: 0.3, label: 'Coastal' },
    { startAngle: 3.0, endAngle: 5.5, dist: 0.6, label: 'Subtropical' },
  ];

  for (const data of currentData) {
    const steps = 20;
    let pathD = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = data.startAngle + (data.endAngle - data.startAngle) * t;
      const distOffset = Math.sin(t * Math.PI * 4) * 0.05;
      const dist = data.dist + distOffset;
      const x = centerX + Math.cos(angle) * radius * dist;
      const y = centerY + Math.sin(angle) * radius * dist;
      if (i === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    }

    const path = createSVGElement('path', {
      d: pathD,
      class: 'current-path',
    });
    currentGroup.appendChild(path);
  }
}

// ===== Generate Wave Swells =====
function generateSwells() {
  const centerX = CONFIG.centerX;
  const centerY = CONFIG.centerY;
  const radius = CONFIG.domeRadius;

  for (let i = 0; i < CONFIG.swellCount; i++) {
    const baseRadius = 50 + i * 45;
    const variation = 10 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;

    let pathD = '';
    const steps = 40;
    for (let j = 0; j <= steps; j++) {
      const t = (j / steps) * Math.PI * 2;
      const r = baseRadius + Math.sin(t * 3 + angle) * variation;
      const x = centerX + Math.cos(t) * r;
      const y = centerY + Math.sin(t) * r;
      if (j === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    }
    pathD += ' Z';

    const path = createSVGElement('path', {
      d: pathD,
      class: 'wave-swell',
    });
    waveGroup.appendChild(path);
  }
}

// ===== Generate Navigation Markers =====
function generateMarkers() {
  const centerX = CONFIG.centerX;
  const centerY = CONFIG.centerY;
  const radius = CONFIG.domeRadius;

  const markerAngles = [0.3, 2.8, 4.2, 5.7];

  for (let i = 0; i < markerAngles.length; i++) {
    const angle = markerAngles[i];
    const dist = 0.4 + Math.random() * 0.3;
    const x = centerX + Math.cos(angle) * radius * dist;
    const y = centerY + Math.sin(angle) * radius * dist;

    const group = document.createElementNS(ns, 'g');
    group.setAttribute('class', 'nav-marker-group');

    // Pole
    const pole = createSVGElement('line', {
      x1: x,
      y1: y + 15,
      x2: x,
      y2: y - 15,
      class: 'nav-marker-pole',
    });
    group.appendChild(pole);

    // Head
    const head = createSVGElement('circle', {
      cx: x,
      cy: y - 15,
      r: 4,
      class: 'nav-marker-head',
    });
    group.appendChild(head);

    // Carved details
    const detail1 = createSVGElement('line', {
      x1: x - 3,
      y1: y - 5,
      x2: x + 3,
      y2: y - 5,
      stroke: '#7a5230',
      'stroke-width': 1,
    });
    group.appendChild(detail1);

    const detail2 = createSVGElement('line', {
      x1: x - 2,
      y1: y + 5,
      x2: x + 2,
      y2: y + 5,
      stroke: '#7a5230',
      'stroke-width': 1,
    });
    group.appendChild(detail2);

    markerGroup.appendChild(group);
    markers.push({ x, y });
  }
}

// ===== Generate Wayfinding Lines =====
function generateWayfindingLines() {
  const centerX = CONFIG.centerX;
  const centerY = CONFIG.centerY;
  const radius = CONFIG.domeRadius;

  // Connect islands with wayfinding paths
  for (let i = 0; i < islands.length - 1; i++) {
    const from = islands[i];
    const to = islands[i + 1];
    if (from && to) {
      // Slight curve
      const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 40;
      const midY = (from.y + to.y) / 2 + (Math.random() - 0.5) * 40;
      const d = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
      const path = createSVGElement('path', {
        d: d,
        class: 'wayfinding-line',
      });
      wayfindingGroup.appendChild(path);
    }
  }

  // Connect some stars to islands
  if (constellations.length > 0 && islands.length > 0) {
    for (let i = 0; i < 3; i++) {
      const constIdx = Math.floor(Math.random() * constellations.length);
      const islandIdx = Math.floor(Math.random() * islands.length);
      const constPoints = constellations[constIdx].points;
      if (constPoints.length > 0 && islands[islandIdx]) {
        const starPoint = constPoints[Math.floor(Math.random() * constPoints.length)];
        const island = islands[islandIdx];
        const midX = (starPoint.x + island.x) / 2 + (Math.random() - 0.5) * 30;
        const midY = (starPoint.y + island.y) / 2 + (Math.random() - 0.5) * 30;
        const d = `M ${starPoint.x} ${starPoint.y} Q ${midX} ${midY} ${island.x} ${island.y}`;
        const path = createSVGElement('path', {
          d: d,
          class: 'wayfinding-line',
          'stroke-opacity': '0.15',
        });
        wayfindingGroup.appendChild(path);
      }
    }
  }
}

// ===== Bioluminescent Wake Effect =====
function initWakeCanvas() {
  const rect = document.querySelector('.chart-area').getBoundingClientRect();
  wakeCanvas.width = rect.width;
  wakeCanvas.height = rect.height;
}

function drawWake(time) {
  wakeCtx.clearRect(0, 0, wakeCanvas.width, wakeCanvas.height);

  // Add new wake points near the center, moving outward
  const centerX = wakeCanvas.width / 2;
  const centerY = wakeCanvas.height / 2;

  if (Math.random() > 0.4) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 5 + Math.random() * 15;
    wakePoints.push({
      x: centerX + Math.cos(angle) * dist,
      y: centerY + Math.sin(angle) * dist,
      vx: Math.cos(angle) * (0.3 + Math.random() * 0.5),
      vy: Math.sin(angle) * (0.3 + Math.random() * 0.5),
      life: 1,
      decay: 0.005 + Math.random() * 0.01,
      size: 1 + Math.random() * 2,
    });
  }

  // Update and draw wake points
  for (let i = wakePoints.length - 1; i >= 0; i--) {
    const p = wakePoints[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx += (Math.random() - 0.5) * 0.02;
    p.vy += (Math.random() - 0.5) * 0.02;
    p.life -= p.decay;

    if (p.life <= 0) {
      wakePoints.splice(i, 1);
      continue;
    }

    const alpha = p.life * 0.4;
    const radius = p.size * p.life;

    wakeCtx.beginPath();
    wakeCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    wakeCtx.fillStyle = `rgba(100, 220, 255, ${alpha})`;
    wakeCtx.fill();

    // Glow
    wakeCtx.beginPath();
    wakeCtx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
    wakeCtx.fillStyle = `rgba(100, 220, 255, ${alpha * 0.15})`;
    wakeCtx.fill();
  }

  // Limit wake points
  if (wakePoints.length > 300) {
    wakePoints.splice(0, wakePoints.length - 300);
  }
}

// ===== Mouse Tracking =====
function handleMouseMove(e) {
  const rect = document.querySelector('.chart-area').getBoundingClientRect();
  mouseX = ((e.clientX - rect.left) / rect.width) * 800;
  mouseY = ((e.clientY - rect.top) / rect.height) * 800;

  // Subtle parallax on star dome
  const dx = (mouseX - 400) * 0.02;
  const dy = (mouseY - 400) * 0.02;
  svg.style.transform = `translate(${dx}px, ${dy}px)`;
  svg.style.transition = 'transform 0.1s ease-out';
}

// ===== Navigation Buttons =====
function setupNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;

      // Toggle visibility of chart layers
      const visibility = {
        stars: ['starGroup', 'constellationGroup'],
        currents: ['currentGroup'],
        waves: ['waveGroup'],
        islands: ['islandGroup', 'markerGroup'],
      };

      // Hide all groups first
      const allGroups = [starGroup, constellationGroup, wayfindingGroup, islandGroup, currentGroup, waveGroup, markerGroup];
      allGroups.forEach(g => g.style.opacity = '0.15');

      // Show selected groups
      const selected = visibility[currentMode] || [];
      selected.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = '1';
      });

      // Always show wayfinding lines subtly
      wayfindingGroup.style.opacity = '0.4';
    });
  });

  // Default: show stars
  starGroup.style.opacity = '1';
  constellationGroup.style.opacity = '1';
  wayfindingGroup.style.opacity = '0.4';
}

// ===== Animation Loop =====
function animate(time) {
  drawBackgroundStars(time / 1000);
  drawWake(time / 1000);
  frameId = requestAnimationFrame(animate);
}

// ===== Initialize Everything =====
function init() {
  resizeStarCanvas();
  generateBackgroundStars();
  generateConstellations();
  generateIslands();
  generateCurrents();
  generateSwells();
  generateMarkers();
  generateWayfindingLines();
  initWakeCanvas();
  setupNavigation();

  window.addEventListener('resize', () => {
    resizeStarCanvas();
    generateBackgroundStars();
    initWakeCanvas();
  });

  document.querySelector('.chart-area').addEventListener('mousemove', handleMouseMove);

  animate(0);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
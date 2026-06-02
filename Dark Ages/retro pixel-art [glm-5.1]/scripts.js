document.addEventListener('DOMContentLoaded', () => {
  initCycle();
  createAshParticles();
  renderPlagueDoctor();
  initVillageMap();
  initBellTower();
  initDeathCounter();
  initScrollReveals();
  initSmoothScroll();
});

const CYCLE_PHASES = [
  { name: 'dawn', label: 'Dawn', duration: 30 },
  { name: 'day', label: 'Day', duration: 30 },
  { name: 'dusk', label: 'Dusk', duration: 30 },
  { name: 'night', label: 'Night', duration: 30 },
  { name: 'late-night', label: 'Late Night', duration: 30 },
  { name: 'pre-dawn', label: 'Pre-Dawn', duration: 30 },
];

let cyclePhaseIndex = 0;
let cyclePhaseStart = Date.now();

function initCycle() {
  updateCycle();
}

function updateCycle() {
  const phase = CYCLE_PHASES[cyclePhaseIndex];
  const elapsed = (Date.now() - cyclePhaseStart) / 1000;
  const phaseProgress = Math.min(elapsed / phase.duration, 1);

  document.body.dataset.cycle = phase.name;

  const cycleLabel = document.getElementById('cycle-label');
  const cycleProgress = document.getElementById('cycle-progress');
  const cycleMarker = document.getElementById('cycle-marker');

  if (cycleLabel) cycleLabel.textContent = phase.label;
  if (cycleProgress) cycleProgress.style.width = (phaseProgress * 100) + '%';

  if (cycleMarker) {
    const totalProgress = (cyclePhaseIndex + phaseProgress) / CYCLE_PHASES.length;
    cycleMarker.style.left = (totalProgress * 94) + '%';
  }

  if (phaseProgress >= 1) {
    cyclePhaseIndex = (cyclePhaseIndex + 1) % CYCLE_PHASES.length;
    cyclePhaseStart = Date.now();
  }

  requestAnimationFrame(updateCycle);
}

function createAshParticles() {
  const container = document.getElementById('particle-container');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const particle = document.createElement('div');
    particle.className = 'ash-particle';

    const size = 2 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '-10px';
    particle.style.animationDuration = (8 + Math.random() * 14) + 's';
    particle.style.animationDelay = (Math.random() * 15) + 's';

    if (Math.random() > 0.6) {
      particle.style.background = '#ff8844';
      particle.style.boxShadow = '0 0 3px rgba(255,136,68,0.5)';
    }

    container.appendChild(particle);
  }
}

function renderPlagueDoctor() {
  const doctorEl = document.getElementById('plague-doctor');
  if (!doctorEl) return;

  const PIXEL = 4;

  const colorMap = {
    '1': '#1a1a2a',
    '2': '#2a2a3a',
    '3': '#d4c8a0',
    '4': '#8b6914',
    '5': '#1a0808',
    '6': '#1a1a2a',
    '7': '#2a2a3a',
    '8': '#5a3a1a',
    '9': '#2a1a08',
  };

  const pattern = [
    '000011110000',
    '000111111000',
    '001111111100',
    '001111111100',
    '002222222200',
    '003353353300',
    '003333333300',
    '003344443300',
    '000344443000',
    '000034430000',
    '000004400000',
    '006666666600',
    '066666666660',
    '666766667666',
    '666668666666',
    '666668666666',
    '066668666660',
    '066668666660',
    '066668666660',
    '006668666600',
    '006668666600',
    '000686660000',
    '000686660000',
    '000086600000',
    '000086600000',
    '000086600000',
    '000986900000',
    '009989900000',
    '009900990000',
  ];

  const containerWidth = 64;
  const containerHeight = 128;
  const patternWidth = pattern[0].length * PIXEL;
  const patternHeight = pattern.length * PIXEL;
  const offsetX = (containerWidth - patternWidth) / 2;
  const offsetY = (containerHeight - patternHeight) / 2;

  const shadows = [];

  for (let row = 0; row < pattern.length; row++) {
    const rowStr = pattern[row];
    for (let col = 0; col < rowStr.length; col++) {
      const code = rowStr[col];
      if (code !== '0' && colorMap[code]) {
        const x = offsetX + col * PIXEL;
        const y = offsetY + row * PIXEL;
        shadows.push(x + 'px ' + y + 'px 0 ' + colorMap[code]);
      }
    }
  }

  const pixel = document.createElement('div');
  pixel.style.width = PIXEL + 'px';
  pixel.style.height = PIXEL + 'px';
  pixel.style.position = 'absolute';
  pixel.style.top = '0';
  pixel.style.left = '0';
  pixel.style.boxShadow = shadows.join(', ');

  doctorEl.appendChild(pixel);
}

function initVillageMap() {
  const canvas = document.getElementById('village-map');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const P = 8;

  const buildings = [
    {
      name: "Lord's Keep",
      x: 38, y: 3, w: 18, h: 14,
      desc: 'The seat of Baron Ashenmoor. Within these grey walls, the lord dispenses justice and hoards grain against the winter. The villagers pay their tithes here — a third of all they grow.'
    },
    {
      name: 'Chapel of St. Aldhelm',
      x: 14, y: 6, w: 12, h: 14,
      desc: 'The village chapel, raised upon stones older than memory. Father Thomas says mass each Sunday, and the villagers pray for deliverance from the pestilence that stalks the land.'
    },
    {
      name: 'The Hovels',
      x: 6, y: 28, w: 24, h: 10,
      desc: 'Wattle and daub huts where the serfs dwell. Smoke rises from drafty chimneys, the thatch grows thin, and the children cough through the long winter nights.'
    },
    {
      name: 'Ashenmoor Market',
      x: 36, y: 26, w: 20, h: 10,
      desc: 'The weekly market where peasants trade their meager surplus. A blacksmith, a brewer, and a baker eke out their living here. News from distant lands arrives with the merchants.'
    },
    {
      name: 'Darkwood Forest',
      x: 72, y: 5, w: 20, h: 24,
      desc: 'The ancient forest where outlaws hide and wolves howl. Woodsmen dare not venture deep after dark, for the trees are said to remember older, darker things than men.'
    }
  ];

  const grassNoise = [];
  for (let x = 0; x < 100; x++) {
    grassNoise[x] = [];
    for (let y = 0; y < 63; y++) {
      grassNoise[x][y] = Math.random();
    }
  }

  const forestTrees = [];
  for (let i = 0; i < 18; i++) {
    forestTrees.push({
      x: 73 + Math.floor(Math.random() * 18),
      y: 6 + Math.floor(Math.random() * 22),
    });
  }

  const scatteredTrees = [];
  for (let i = 0; i < 8; i++) {
    scatteredTrees.push({
      x: 2 + Math.floor(Math.random() * 30),
      y: 42 + Math.floor(Math.random() * 16),
    });
  }

  let hoveredBuilding = null;
  let staticImageData = null;

  function drawPixel(px, py, color) {
    ctx.fillStyle = color;
    ctx.fillRect(px * P, py * P, P, P);
  }

  function drawTree(tx, ty, leafColor, trunkColor) {
    drawPixel(tx, ty + 2, trunkColor);
    drawPixel(tx - 1, ty, leafColor);
    drawPixel(tx, ty, leafColor);
    drawPixel(tx + 1, ty, leafColor);
    drawPixel(tx, ty + 1, leafColor);
  }

  function drawStaticMap() {
    ctx.fillStyle = '#3a4a28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 63; y++) {
        const noise = grassNoise[x][y];
        if (noise < 0.07) {
          drawPixel(x, y, '#2a3a20');
        } else if (noise > 0.93) {
          drawPixel(x, y, '#4a5a30');
        }
      }
    }

    for (let y = 0; y < 63; y++) {
      const xBase = 60 + Math.sin(y * 0.12) * 4;
      const width = 3 + Math.sin(y * 0.18);
      ctx.fillStyle = '#2a3a5a';
      for (let dx = -1; dx <= width; dx++) {
        const rx = Math.floor(xBase + dx);
        if (rx >= 0 && rx < 100) {
          ctx.fillRect(rx * P, y * P, P, P);
        }
      }
      if (y % 3 === 0) {
        const rx = Math.floor(xBase + 1);
        if (rx >= 0 && rx < 100) {
          drawPixel(rx, y, '#3a4a6a');
        }
      }
    }

    ctx.fillStyle = '#5a4a2a';
    for (let x = 14; x < 72; x++) {
      drawPixel(x, 24, '#5a4a2a');
      drawPixel(x, 25, '#5a4a2a');
    }
    for (let y = 14; y < 24; y++) {
      drawPixel(47, y, '#5a4a2a');
    }
    for (let y = 14; y < 24; y++) {
      drawPixel(20, y, '#5a4a2a');
    }
    for (let y = 28; y < 38; y++) {
      drawPixel(18, y, '#5a4a2a');
    }
    for (let y = 26; y < 36; y++) {
      drawPixel(46, y, '#5a4a2a');
    }

    drawPixel(59, 24, '#5a3a1a');
    drawPixel(60, 24, '#5a3a1a');
    drawPixel(61, 24, '#5a3a1a');
    drawPixel(62, 24, '#5a3a1a');
    drawPixel(63, 24, '#5a3a1a');
    drawPixel(59, 25, '#5a3a1a');
    drawPixel(60, 25, '#5a3a1a');
    drawPixel(61, 25, '#5a3a1a');
    drawPixel(62, 25, '#5a3a1a');
    drawPixel(63, 25, '#5a3a1a');
    drawPixel(59, 24, '#4a2a0a');
    drawPixel(63, 24, '#4a2a0a');

    ctx.fillStyle = '#6a6a2a';
    for (let x = 4; x < 28; x++) {
      for (let y = 42; y < 56; y++) {
        drawPixel(x, y, grassNoise[x][y] > 0.85 ? '#7a7a3a' : '#6a6a2a');
      }
    }
    ctx.fillStyle = '#5a5a22';
    for (let x = 42; x < 56; x++) {
      for (let y = 42; y < 56; y++) {
        drawPixel(x, y, grassNoise[x][y] > 0.85 ? '#6a6a32' : '#5a5a22');
      }
    }

    ctx.fillStyle = '#5a5a1a';
    for (let y = 44; y < 55; y += 3) {
      for (let x = 5; x < 27; x++) {
        drawPixel(x, y, '#5a5a1a');
      }
      for (let x = 43; x < 55; x++) {
        drawPixel(x, y, '#5a5a1a');
      }
    }

    drawKeep();
    drawChapel();
    drawHovels();
    drawMarket();
    drawForestArea();

    drawPixel(47, 30, '#5a5a5a');
    drawPixel(48, 30, '#5a5a5a');
    drawPixel(47, 31, '#5a5a5a');
    drawPixel(48, 31, '#5a5a5a');
    drawPixel(47, 30, '#3a3a4a');
    drawPixel(48, 30, '#3a3a4a');
    drawPixel(46, 29, '#4a3a1a');
    drawPixel(47, 29, '#4a3a1a');
    drawPixel(48, 29, '#4a3a1a');
    drawPixel(49, 29, '#4a3a1a');

    for (let g = 0; g < 4; g++) {
      const gx = 8 + g * 2;
      const gy = 22;
      drawPixel(gx, gy, '#7a7a7a');
      drawPixel(gx, gy + 1, '#7a7a7a');
      drawPixel(gx - 1, gy, '#7a7a7a');
    }

    scatteredTrees.forEach(t => drawTree(t.x, t.y, '#2a4a1a', '#3a2a10'));
    forestTrees.forEach(t => drawTree(t.x, t.y, '#1a3a0a', '#2a1a08'));

    drawPixel(92, 3, '#c9a844');
    drawPixel(92, 4, '#c9a844');
    drawPixel(91, 4, '#c9a844');
    drawPixel(93, 4, '#c9a844');
    drawPixel(92, 5, '#c9a844');
    drawPixel(92, 7, '#8b6914');
    drawPixel(90, 5, '#8b6914');
    drawPixel(94, 5, '#8b6914');

    staticImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function drawKeep() {
    const bx = 38, by = 3, bw = 18, bh = 14;

    ctx.fillStyle = '#6a6a7a';
    ctx.fillRect(bx * P, by * P, bw * P, bh * P);

    ctx.fillStyle = '#7a7a8a';
    ctx.fillRect(bx * P, (by - 3) * P, 3 * P, 3 * P);
    ctx.fillRect((bx + bw - 3) * P, (by - 3) * P, 3 * P, 3 * P);

    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect((bx - 1) * P, (by - 4) * P, 5 * P, P);
    ctx.fillRect(bx * P, (by - 5) * P, 3 * P, P);
    ctx.fillRect((bx + bw - 4) * P, (by - 4) * P, 5 * P, P);
    ctx.fillRect((bx + bw - 3) * P, (by - 5) * P, 3 * P, P);

    ctx.fillStyle = '#3a2a1a';
    for (let rx = 0; rx < bw; rx++) {
      const roofH = Math.max(0, 3 - Math.floor(Math.abs(rx - bw / 2)));
      for (let ry = 0; ry < roofH; ry++) {
        drawPixel(bx + rx, by - 1 - ry, '#3a2a1a');
      }
    }

    drawPixel(bx + 8, by + bh - 4, '#2a1a08');
    drawPixel(bx + 9, by + bh - 4, '#2a1a08');
    drawPixel(bx + 8, by + bh - 3, '#2a1a08');
    drawPixel(bx + 9, by + bh - 3, '#2a1a08');
    drawPixel(bx + 8, by + bh - 2, '#2a1a08');
    drawPixel(bx + 9, by + bh - 2, '#2a1a08');
    drawPixel(bx + 8, by + bh - 1, '#2a1a08');
    drawPixel(bx + 9, by + bh - 1, '#2a1a08');

    drawPixel(bx + 3, by + 4, '#ffcc44');
    drawPixel(bx + bw - 4, by + 4, '#ffcc44');
    drawPixel(bx + 3, by + 8, '#ffcc44');
    drawPixel(bx + bw - 4, by + 8, '#ffcc44');

    ctx.fillStyle = '#5a5a6a';
    ctx.fillRect((bx + 1) * P, (by + 1) * P, (bw - 2) * P, P);
  }

  function drawChapel() {
    const bx = 14, by = 6, bw = 12, bh = 14;

    ctx.fillStyle = '#c4b890';
    ctx.fillRect(bx * P, by * P, bw * P, bh * P);

    ctx.fillStyle = '#b4a880';
    ctx.fillRect((bx + 5) * P, (by - 3) * P, 2 * P, 3 * P);

    drawPixel(bx + 5, by - 6, '#c9a844');
    drawPixel(bx + 4, by - 5, '#c9a844');
    drawPixel(bx + 5, by - 5, '#c9a844');
    drawPixel(bx + 6, by - 5, '#c9a844');
    drawPixel(bx + 5, by - 4, '#c9a844');

    ctx.fillStyle = '#a49870';
    for (let rx = 0; rx < bw; rx++) {
      const roofH = Math.max(0, 2 - Math.floor(Math.abs(rx - bw / 2)));
      for (let ry = 0; ry < roofH; ry++) {
        drawPixel(bx + rx, by - 1 - ry, '#a49870');
      }
    }

    drawPixel(bx + 5, by + 3, '#ffcc44');
    drawPixel(bx + 6, by + 3, '#ffcc44');
    drawPixel(bx + 5, by + 4, '#ffcc44');
    drawPixel(bx + 6, by + 4, '#ffcc44');

    drawPixel(bx + 5, by + bh - 4, '#2a1a08');
    drawPixel(bx + 6, by + bh - 4, '#2a1a08');
    drawPixel(bx + 5, by + bh - 3, '#2a1a08');
    drawPixel(bx + 6, by + bh - 3, '#2a1a08');
    drawPixel(bx + 5, by + bh - 2, '#2a1a08');
    drawPixel(bx + 6, by + bh - 2, '#2a1a08');
    drawPixel(bx + 4, by + bh - 4, '#2a1a08');
    drawPixel(bx + 7, by + bh - 4, '#2a1a08');
  }

  function drawHovels() {
    const bx = 6, by = 28, bw = 24, bh = 10;

    ctx.fillStyle = '#6a4a2a';
    ctx.fillRect(bx * P, by * P, bw * P, bh * P);

    for (let h = 0; h < 3; h++) {
      const hx = bx + h * 8;

      drawPixel(hx + 1, by - 1, '#4a2a0a');
      drawPixel(hx + 2, by - 1, '#4a2a0a');
      drawPixel(hx + 3, by - 1, '#4a2a0a');
      drawPixel(hx + 4, by - 1, '#4a2a0a');
      drawPixel(hx + 5, by - 1, '#4a2a0a');
      drawPixel(hx, by, '#4a2a0a');
      drawPixel(hx + 6, by, '#4a2a0a');

      drawPixel(hx + 3, by + bh - 2, '#1a0a00');
      drawPixel(hx + 3, by + bh - 1, '#1a0a00');

      drawPixel(hx + 5, by - 2, 'rgba(100,90,80,0.3)');

      drawPixel(hx + 2, by + 3, '#ffcc44');
    }
  }

  function drawMarket() {
    const bx = 36, by = 26, bw = 20, bh = 10;

    ctx.fillStyle = '#8a6a3a';
    ctx.fillRect(bx * P, by * P, bw * P, bh * P);

    for (let s = 0; s < 3; s++) {
      const sx = bx + s * 6 + 1;

      drawPixel(sx, by + 1, '#8a5a2a');
      drawPixel(sx + 1, by + 1, '#8a5a2a');
      drawPixel(sx + 2, by + 1, '#8a5a2a');
      drawPixel(sx + 3, by + 1, '#8a5a2a');

      drawPixel(sx, by + 2, '#5a3a1a');
      drawPixel(sx + 3, by + 2, '#5a3a1a');
      drawPixel(sx, by + 3, '#5a3a1a');
      drawPixel(sx + 3, by + 3, '#5a3a1a');
      drawPixel(sx, by + 4, '#5a3a1a');
      drawPixel(sx + 3, by + 4, '#5a3a1a');

      drawPixel(sx + 1, by + 2, '#c9a844');
      drawPixel(sx + 2, by + 2, '#c9a844');
      drawPixel(sx + 1, by + 3, '#8b1a1a');
      drawPixel(sx + 2, by + 3, '#5a3a1a');
    }
  }

  function drawForestArea() {
    const bx = 72, by = 5, bw = 20, bh = 24;

    ctx.fillStyle = '#2a4a1a';
    ctx.fillRect(bx * P, by * P, bw * P, bh * P);

    for (let x = bx; x < bx + bw; x++) {
      for (let y = by; y < by + bh; y++) {
        if (grassNoise[x] && grassNoise[x][y] && grassNoise[x][y] > 0.7) {
          drawPixel(x, y, '#1a3a0a');
        }
      }
    }
  }

  function drawMap() {
    if (!staticImageData) return;

    ctx.putImageData(staticImageData, 0, 0);

    if (hoveredBuilding) {
      const b = hoveredBuilding;

      ctx.fillStyle = 'rgba(201,168,68,0.12)';
      ctx.fillRect(b.x * P, b.y * P, b.w * P, b.h * P);

      ctx.strokeStyle = '#c9a844';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(b.x * P - 2, b.y * P - 2, b.w * P + 4, b.h * P + 4);
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(201,168,68,0.6)';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(b.name, b.x * P, (b.y - 2) * P);
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const px = Math.floor(mx / P);
    const py = Math.floor(my / P);

    let found = null;
    for (const b of buildings) {
      if (px >= b.x && px < b.x + b.w && py >= b.y && py < b.y + b.h) {
        found = b;
        break;
      }
    }

    if (found !== hoveredBuilding) {
      hoveredBuilding = found;
      drawMap();

      const titleEl = document.getElementById('map-info-title');
      const textEl = document.getElementById('map-info-text');

      if (found) {
        titleEl.textContent = found.name;
        textEl.textContent = found.desc;
      } else {
        titleEl.textContent = 'Explore the Village';
        textEl.textContent = 'Hover over buildings to discover what lies within Ashenmoor, a settlement on the edge of the known world.';
      }
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredBuilding = null;
    drawMap();
    document.getElementById('map-info-title').textContent = 'Explore the Village';
    document.getElementById('map-info-text').textContent = 'Hover over buildings to discover what lies within Ashenmoor, a settlement on the edge of the known world.';
  });

  drawStaticMap();
  drawMap();
}

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playBellSound() {
  try {
    const ac = getAudioContext();
    const fundamental = 180;
    const harmonics = [1, 2.0, 2.76, 3.95, 5.2];
    const amplitudes = [1, 0.5, 0.35, 0.2, 0.1];
    const decays = [3, 2.2, 1.8, 1.2, 0.8];

    harmonics.forEach((h, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'sine';
      osc.frequency.value = fundamental * h;

      gain.gain.setValueAtTime(amplitudes[i] * 0.08, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + decays[i]);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + decays[i]);
    });
  } catch (e) {

  }
}

let tollCount = 0;
let bellCooldown = false;

function initBellTower() {
  const ringBtn = document.getElementById('bell-ring-btn');
  const ropeHandle = document.getElementById('rope-handle');

  if (ringBtn) {
    ringBtn.addEventListener('click', ringBell);
  }
  if (ropeHandle) {
    ropeHandle.addEventListener('click', ringBell);
  }
}

function ringBell() {
  if (bellCooldown) return;
  bellCooldown = true;

  const assembly = document.getElementById('bell-assembly');
  const rope = document.getElementById('rope');

  if (assembly) {
    assembly.classList.remove('ringing');
    void assembly.offsetWidth;
    assembly.classList.add('ringing');
  }

  if (rope) {
    rope.classList.add('pulled');
  }

  tollCount++;
  const tollEl = document.getElementById('toll-count');
  if (tollEl) tollEl.textContent = tollCount;

  playBellSound();
  createBellRipple();

  setTimeout(() => {
    if (assembly) assembly.classList.remove('ringing');
    if (rope) rope.classList.remove('pulled');
    bellCooldown = false;
  }, 1600);
}

function createBellRipple() {
  const container = document.getElementById('bell-ripple-container');
  if (!container) return;

  const bellSection = document.getElementById('bell-tower');
  if (!bellSection) return;

  const rect = bellSection.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height * 0.25;

  for (let i = 0; i < 3; i++) {
    const ripple = document.createElement('div');
    ripple.className = 'bell-ripple';
    ripple.style.left = centerX + 'px';
    ripple.style.top = centerY + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animationDelay = (i * 0.3) + 's';

    container.appendChild(ripple);

    setTimeout(() => ripple.remove(), 2500);
  }
}

let deathCount = 0;
const DEATH_TARGET = 25000000;

function initDeathCounter() {
  updateDeathCounter();
}

function updateDeathCounter() {
  if (deathCount < DEATH_TARGET) {
    const increment = Math.random() < 0.08
      ? Math.floor(Math.random() * 500) + 50
      : Math.floor(Math.random() * 3) + 1;

    deathCount = Math.min(deathCount + increment, DEATH_TARGET);

    const counterEl = document.getElementById('death-counter');
    if (counterEl) {
      counterEl.textContent = deathCount.toLocaleString();
    }
  }

  const delay = Math.random() < 0.08 ? 80 : 200 + Math.random() * 300;
  setTimeout(updateDeathCounter, delay);
}

function initScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.timeline-event, .plague-event').forEach(el => {
    observer.observe(el);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('#main-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
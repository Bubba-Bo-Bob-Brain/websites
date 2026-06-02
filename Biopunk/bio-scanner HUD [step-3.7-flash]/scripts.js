document.addEventListener('DOMContentLoaded', () => {
  // --------------------------
  // Core Element References
  // --------------------------
  const sysTime = document.getElementById('sysTime');
  const sysDate = document.getElementById('sysDate');
  const ekgCanvas = document.getElementById('ekgCanvas');
  const ekgCtx = ekgCanvas.getContext('2d');
  const nanoCanvas = document.getElementById('nanoCanvas');
  const nanoCtx = nanoCanvas.getContext('2d');
  const geneGrid = document.getElementById('geneGrid');
  const leftStream = document.getElementById('leftStream');
  const rightStream = document.getElementById('rightStream');
  const bpmValue = document.getElementById('bpmValue');
  const organCards = document.querySelectorAll('.organ-card');
  const hotspots = document.querySelectorAll('.hotspot');
  const toxinBars = document.querySelectorAll('.toxin-bar-fill');
  const toxinValues = document.querySelectorAll('.toxin-value');
  const metricValues = document.querySelectorAll('.metric-value');
  const nanoCountEl = document.getElementById('nanoCount');
  const root = document.documentElement;

  // --------------------------
  // System Time/Date (2077 Timeline)
  // --------------------------
  const updateSystemTime = () => {
    const now = new Date();
    // Set fixed 2077 date as per HUD context
    const fakeDate = new Date(now.getTime() + (57 * 365 + 14) * 24 * 60 * 60 * 1000); // 57 years from 2020
    const hours = String(fakeDate.getHours()).padStart(2, '0');
    const minutes = String(fakeDate.getMinutes()).padStart(2, '0');
    const seconds = String(fakeDate.getSeconds()).padStart(2, '0');
    const year = fakeDate.getFullYear();
    const month = String(fakeDate.getMonth() + 1).padStart(2, '0');
    const day = String(fakeDate.getDate()).padStart(2, '0');

    sysTime.textContent = `${hours}:${minutes}:${seconds}`;
    sysDate.textContent = `${year}.${month}.${day}`;
  };
  setInterval(updateSystemTime, 1000);
  updateSystemTime();

  // --------------------------
  // EKG Trace Renderer
  // --------------------------
  let ekgData = [];
  const ekgBufferSize = 300;
  let currentBPM = 72;
  let lastBeatTime = 0;
  const beatInterval = () => 60000 / currentBPM;

  // Generate realistic PQRST waveform
  const generateHeartbeat = () => {
    const points = [];
    const samples = 40;
    // Flat line before beat
    for (let i = 0; i < 10; i++) points.push(0);
    // P wave
    for (let i = 0; i < 5; i++) points.push(Math.sin(i / 5 * Math.PI) * 0.15);
    // Flat
    for (let i = 0; i < 3; i++) points.push(0);
    // Q dip
    points.push(-0.1);
    // R spike
    points.push(1);
    // S dip
    points.push(-0.2);
    // Flat
    for (let i = 0; i < 4; i++) points.push(0);
    // T wave
    for (let i = 0; i < 8; i++) points.push(Math.sin(i / 8 * Math.PI) * 0.25);
    // Flat after beat
    for (let i = 0; i < 10; i++) points.push(0);
    return points;
  };

  const heartbeatWaveform = generateHeartbeat();

  const resizeEkgCanvas = () => {
    ekgCanvas.width = ekgCanvas.offsetWidth;
    ekgCanvas.height = ekgCanvas.offsetHeight;
  };
  resizeEkgCanvas();
  window.addEventListener('resize', resizeEkgCanvas);

  const drawEkg = (timestamp) => {
    ekgCtx.clearRect(0, 0, ekgCanvas.width, ekgCanvas.height);
    ekgCtx.strokeStyle = '#ff2d6f';
    ekgCtx.lineWidth = 1.5;
    ekgCtx.shadowBlur = 4;
    ekgCtx.shadowColor = '#ff2d6f';

    // Add new data point based on BPM
    if (timestamp - lastBeatTime > beatInterval()) {
      ekgData.push(...heartbeatWaveform);
      lastBeatTime = timestamp;
    }
    // Add small noise to simulate real signal
    ekgData.push(ekgData[ekgData.length - 1] + (Math.random() - 0.5) * 0.05);

    // Trim buffer
    if (ekgData.length > ekgBufferSize) ekgData.splice(0, ekgData.length - ekgBufferSize);

    // Draw trace
    ekgCtx.beginPath();
    const stepX = ekgCanvas.width / ekgBufferSize;
    const stepY = ekgCanvas.height / 2;

    ekgData.forEach((val, i) => {
      const x = i * stepX;
      const y = stepY - (val * stepY * 0.8);
      if (i === 0) ekgCtx.moveTo(x, y);
      else ekgCtx.lineTo(x, y);
    });
    ekgCtx.stroke();

    // Draw grid lines
    ekgCtx.strokeStyle = 'rgba(255, 45, 111, 0.1)';
    ekgCtx.lineWidth = 0.5;
    ekgCtx.shadowBlur = 0;
    for (let i = 0; i < ekgCanvas.width; i += 20) {
      ekgCtx.beginPath();
      ekgCtx.moveTo(i, 0);
      ekgCtx.lineTo(i, ekgCanvas.height);
      ekgCtx.stroke();
    }
    for (let i = 0; i < ekgCanvas.height; i += 20) {
      ekgCtx.beginPath();
      ekgCtx.moveTo(0, i);
      ekgCtx.lineTo(ekgCanvas.width, i);
      ekgCtx.stroke();
    }

    requestAnimationFrame(drawEkg);
  };
  requestAnimationFrame(drawEkg);

  // --------------------------
  // Nanomachine Swarm Visualizer
  // --------------------------
  let nanoParticles = [];
  const particleCount = 120;

  const resizeNanoCanvas = () => {
    nanoCanvas.width = nanoCanvas.offsetWidth;
    nanoCanvas.height = nanoCanvas.offsetHeight;
  };
  resizeNanoCanvas();
  window.addEventListener('resize', resizeNanoCanvas);

  class NanoParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * nanoCanvas.width;
      this.y = Math.random() * nanoCanvas.height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.size = Math.random() * 2 + 0.8;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.7 ? '#a78bfa' : '#00f0ff';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce off edges
      if (this.x < 0 || this.x > nanoCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > nanoCanvas.height) this.vy *= -1;
      // Slight attraction to center
      const centerX = nanoCanvas.width / 2;
      const centerY = nanoCanvas.height / 2;
      this.vx += (centerX - this.x) * 0.0003;
      this.vy += (centerY - this.y) * 0.0003;
      // Limit velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx = (this.vx / speed) * 1.5;
        this.vy = (this.vy / speed) * 1.5;
      }
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    nanoParticles.push(new NanoParticle());
  }

  const animateNanoSwarm = () => {
    nanoCtx.clearRect(0, 0, nanoCanvas.width, nanoCanvas.height);
    nanoParticles.forEach(p => {
      p.update();
      p.draw(nanoCtx);
    });
    // Draw connection lines between close particles
    nanoCtx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    nanoCtx.lineWidth = 0.5;
    for (let i = 0; i < nanoParticles.length; i++) {
      for (let j = i + 1; j < nanoParticles.length; j++) {
        const dx = nanoParticles[i].x - nanoParticles[j].x;
        const dy = nanoParticles[i].y - nanoParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25) {
          nanoCtx.beginPath();
          nanoCtx.moveTo(nanoParticles[i].x, nanoParticles[i].y);
          nanoCtx.lineTo(nanoParticles[j].x, nanoParticles[j].y);
          nanoCtx.stroke();
        }
      }
    }
    requestAnimationFrame(animateNanoSwarm);
  };
  requestAnimationFrame(animateNanoSwarm);

  // Update nano count periodically
  const updateNanoCount = () => {
    const baseCount = 2847392;
    const variation = Math.floor(Math.random() * 200 - 100);
    nanoCountEl.textContent = (baseCount + variation).toLocaleString();
  };
  setInterval(updateNanoCount, 3000);

  // --------------------------
  // Gene-Splice Matrix Generator
  // --------------------------
  const generateGeneMatrix = () => {
    geneGrid.innerHTML = '';
    const rows = 4;
    const cols = 8;
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement('div');
      cell.className = 'gene-cell';
      const status = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'med' : 'low';
      cell.classList.add(status);
      cell.dataset.index = i;
      geneGrid.appendChild(cell);
    }
  };
  generateGeneMatrix();

  // Random mutation events in gene matrix
  const triggerGeneMutation = () => {
    const cells = document.querySelectorAll('.gene-cell');
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    const statuses = ['high', 'med', 'low'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    randomCell.classList.remove('high', 'med', 'low');
    randomCell.classList.add(newStatus);
    // Flash effect
    randomCell.style.boxShadow = '0 0 15px currentColor';
    setTimeout(() => {
      randomCell.style.boxShadow = '';
    }, 300);
  };
  setInterval(triggerGeneMutation, 1500);

  // --------------------------
  // Real-Time Metric Fluctuation
  // --------------------------
  const organRanges = {
    cardio: { hr: [68, 76], bpSys: [118, 124], bpDia: [78, 82], co: [5.0, 5.4] },
    respiratory: { spo2: [97.5, 99.1], co2: [36, 40], rr: [15, 17] },
    hepatic: { alt: [135, 155], ast: [110, 130], bil: [2.6, 3.0] },
    renal: { gfr: [93, 97], crea: [0.85, 0.95], bun: [16, 20] },
    neural: { sync: [99.5, 99.9], lat: [0.2, 0.4], bw: [8.2, 8.6] },
    immune: { wbc: [6.8, 7.6], lym: [26, 30], ig: [92, 96] }
  };

  const toxinRanges = {
    heavyMetals: [20, 26],
    radiation: [6, 10],
    synthetic: [42, 48],
    pathogens: [10, 14],
    metabolic: [28, 34]
  };

  const fluctuateMetrics = () => {
    // Update organ metrics
    organCards.forEach(card => {
      const organ = card.dataset.organ;
      const ranges = organRanges[organ];
      const metrics = card.querySelectorAll('.metric-value');
      let values = [];
      if (organ === 'cardio') {
        values = [
          Math.floor(Math.random() * (ranges.hr[1] - ranges.hr[0]) + ranges.hr[0]),
          `${Math.floor(Math.random() * (ranges.bpSys[1] - ranges.bpSys[0]) + ranges.bpSys[0])}/${Math.floor(Math.random() * (ranges.bpDia[1] - ranges.bpDia[0]) + ranges.bpDia[0])}`,
          (Math.random() * (ranges.co[1] - ranges.co[0]) + ranges.co[0]).toFixed(1)
        ];
      } else if (organ === 'respiratory') {
        values = [
          (Math.random() * (ranges.spo2[1] - ranges.spo2[0]) + ranges.spo2[0]).toFixed(1),
          Math.floor(Math.random() * (ranges.co2[1] - ranges.co2[0]) + ranges.co2[0]),
          Math.floor(Math.random() * (ranges.rr[1] - ranges.rr[0]) + ranges.rr[0])
        ];
      } else if (organ === 'hepatic') {
        values = [
          Math.floor(Math.random() * (ranges.alt[1] - ranges.alt[0]) + ranges.alt[0]),
          Math.floor(Math.random() * (ranges.ast[1] - ranges.ast[0]) + ranges.ast[0]),
          (Math.random() * (ranges.bil[1] - ranges.bil[0]) + ranges.bil[0]).toFixed(1)
        ];
      } else if (organ === 'renal') {
        values = [
          Math.floor(Math.random() * (ranges.gfr[1] - ranges.gfr[0]) + ranges.gfr[0]),
          (Math.random() * (ranges.crea[1] - ranges.crea[0]) + ranges.crea[0]).toFixed(1),
          Math.floor(Math.random() * (ranges.bun[1] - ranges.bun[0]) + ranges.bun[0])
        ];
      } else if (organ === 'neural') {
        values = [
          (Math.random() * (ranges.sync[1] - ranges.sync[0]) + ranges.sync[0]).toFixed(1),
          (Math.random() * (ranges.lat[1] - ranges.lat[0]) + ranges.lat[0]).toFixed(1),
          (Math.random() * (ranges.bw[1] - ranges.bw[0]) + ranges.bw[0]).toFixed(1)
        ];
      } else if (organ === 'immune') {
        values = [
          (Math.random() * (ranges.wbc[1] - ranges.wbc[0]) + ranges.wbc[0]).toFixed(1),
          Math.floor(Math.random() * (ranges.lym[1] - ranges.lym[0]) + ranges.lym[0]),
          Math.floor(Math.random() * (ranges.ig[1] - ranges.ig[0]) + ranges.ig[0])
        ];
      }
      metrics.forEach((metric, i) => {
        metric.textContent = values[i];
      });
      // Update organ bar fill
      const barFill = card.querySelector('.bar-fill');
      let fillPercent = 0;
      if (organ === 'cardio') fillPercent = ((values[0] - 60) / 40) * 100;
      else if (organ === 'respiratory') fillPercent = ((values[0] - 95) / 5) * 100;
      else if (organ === 'hepatic') fillPercent = (values[0] / 200) * 100;
      else if (organ === 'renal') fillPercent = (values[0] / 150) * 100;
      else if (organ === 'neural') fillPercent = values[0];
      else if (organ === 'immune') fillPercent = (values[2] / 100) * 100;
      barFill.style.setProperty('--fill', `${Math.min(fillPercent, 100)}%`);
    });

    // Update toxin levels
    const toxinNames = ['Heavy Metals', 'Radiation', 'Synthetic Cpd', 'Pathogens', 'Metabolic Waste'];
    toxinNames.forEach((name, i) => {
      const [min, max] = toxinRanges[name.toLowerCase().replace(' ', '')];
      const newVal = Math.floor(Math.random() * (max - min) + min);
      toxinValues[i].textContent = `${newVal}%`;
      toxinBars[i].style.setProperty('--toxin-fill', `${newVal}%`);
    });

    // Update BPM display
    const newBPM = Math.floor(Math.random() * (74 - 70) + 70);
    bpmValue.textContent = newBPM;
    currentBPM = newBPM;
    // Update pulse speed CSS variable to match BPM
    root.style.setProperty('--pulse-speed', `${60 / currentBPM}s`);
  };
  setInterval(fluctuateMetrics, 2500);

  // --------------------------
  // Data Stream Generator
  // --------------------------
  const generateStreamLine = () => {
    const prefixes = ['0x', 'NANO', 'HEP', 'REN', 'NEU', 'IMM', 'SYS', 'SCAN', 'ALERT', 'SYNC'];
    const suffixes = ['DEPLOY', 'FLUX', 'SPIKE', 'OK', 'WARN', 'ERR', 'SYNC', 'LAT', 'BW', 'LEVEL'];
    const hex = Math.random().toString(16).substr(2, 4).toUpperCase();
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const num = Math.floor(Math.random() * 9999);
    return `${prefix}::${hex} ${suffix} ${num} :: ${Math.random().toString(36).substr(2, 6)}`;
  };

  const populateDataStream = (stream) => {
    const line = document.createElement('div');
    line.className = 'stream-line';
    line.textContent = generateStreamLine();
    stream.appendChild(line);
    // Remove old lines to prevent DOM bloat
    if (stream.children.length > 30) {
      stream.removeChild(stream.firstChild);
    }
  };

  // Initial population
  for (let i = 0; i < 15; i++) {
    populateStreamLine(leftStream);
    populateStreamLine(rightStream);
  }
  setInterval(() => populateDataStream(leftStream), 120);
  setInterval(() => populateDataStream(rightStream), 150);

  // --------------------------
  // Hotspot & Organ Card Interaction
  // --------------------------
  // Tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'hotspot-tooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(8, 18, 28, 0.95);
    border: 1px solid var(--hud-cyan);
    padding: 8px 12px;
    border-radius: 3px;
    font-size: 11px;
    pointer-events: none;
    z-index: 1002;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
    font-family: var(--font-mono);
  `;
  document.body.appendChild(tooltip);

  // Link hotspots to organ cards
  hotspots.forEach(hotspot => {
    const organ = hotspot.dataset.organ;
    const matchingCard = document.querySelector(`.organ-card[data-organ="${organ}"]`);

    // Hover hotspot: highlight card + show tooltip
    hotspot.addEventListener('mouseenter', (e) => {
      matchingCard.style.borderColor = 'var(--hud-cyan)';
      matchingCard.style.boxShadow = '0 0 25px var(--hud-cyan-dim), inset 0 0 25px var(--hud-cyan-dim)';
      tooltip.style.opacity = '1';
      updateTooltipContent(organ);
    });

    hotspot.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    });

    hotspot.addEventListener('mouseleave', () => {
      matchingCard.style.borderColor = '';
      matchingCard.style.boxShadow = '';
      tooltip.style.opacity = '0';
    });

    // Hover card: highlight hotspot
    if (matchingCard) {
      matchingCard.addEventListener('mouseenter', () => {
        hotspot.setAttribute('r', hotspot.classList.contains('heart') ? 8 : 7);
        hotspot.style.opacity = '1';
      });
      matchingCard.addEventListener('mouseleave', () => {
        hotspot.setAttribute('r', hotspot.classList.contains('heart') ? 6 : 5);
        hotspot.style.opacity = '';
      });
    }
  });

  const updateTooltipContent = (organ) => {
    const card = document.querySelector(`.organ-card[data-organ="${organ}"]`);
    const name = card.querySelector('.organ-name').textContent;
    const status = card.querySelector('.organ-status').textContent;
    const primaryMetric = card.querySelectorAll('.metric-value')[0].textContent;
    const unit = card.querySelectorAll('.metric-unit')[0].textContent;
    tooltip.innerHTML = `
      <div style="color: var(--hud-cyan); margin-bottom: 4px; letter-spacing: 1px;">${name}</div>
      <div style="color: ${status === 'NOMINAL' ? 'var(--hud-green)' : 'var(--hud-orange)'}; margin-bottom: 4px;">${status}</div>
      <div>PRIMARY: ${primaryMetric}${unit}</div>
    `;
  };

  // --------------------------
  // Random Event System
  // --------------------------
  const triggerRandomEvent = () => {
    const events = [
      {
        name: 'heartSpike',
        action: () => {
          currentBPM = Math.floor(Math.random() * 20 + 100);
          bpmValue.textContent = currentBPM;
          bpmValue.style.color = 'var(--hud-red)';
          bpmValue.style.textShadow = '0 0 15px var(--hud-red)';
          root.style.setProperty('--pulse-speed', `${60 / currentBPM}s`);
          // Reset after 3s
          setTimeout(() => {
            currentBPM = Math.floor(Math.random() * 4 + 70);
            bpmValue.textContent = currentBPM;
            bpmValue.style.color = '';
            bpmValue.style.textShadow = '';
            root.style.setProperty('--pulse-speed', `${60 / currentBPM}s`);
          }, 3000);
        }
      },
      {
        name: 'toxinSpike',
        action: () => {
          const randomToxin = Math.floor(Math.random() * toxinBars.length);
          const originalFill = toxinBars[randomToxin].style.getPropertyValue('--toxin-fill');
          toxinBars[randomToxin].style.setProperty('--toxin-fill', '85%');
          toxinBars[randomToxin].classList.add('warning');
          toxinValues[randomToxin].textContent = '85%';
          toxinValues[randomToxin].style.color = 'var(--hud-red)';
          // Reset after 5s
          setTimeout(() => {
            toxinBars[randomToxin].style.setProperty('--toxin-fill', originalFill);
            toxinBars[randomToxin].classList.remove('warning');
            toxinValues[randomToxin].textContent = originalFill;
            toxinValues[randomToxin].style.color = '';
          }, 5000);
        }
      },
      {
        name: 'neuralHiccup',
        action: () => {
          const neuralCard = document.querySelector('.organ-card[data-organ="neural"]');
          const syncMetric = neuralCard.querySelectorAll('.metric-value')[0];
          const originalSync = syncMetric.textContent;
          syncMetric.textContent = '94.2';
          syncMetric.style.color = 'var(--hud-red)';
          neuralCard.querySelector('.organ-status').textContent = 'DEGRADED';
          neuralCard.querySelector('.organ-status').className = 'organ-status status-elevated';
          neuralCard.querySelector('.indicator').classList.add('indicator-warning');
          // Reset after 2s
          setTimeout(() => {
            syncMetric.textContent = originalSync;
            syncMetric.style.color = '';
            neuralCard.querySelector('.organ-status').textContent = 'NOMINAL';
            neuralCard.querySelector('.organ-status').className = 'organ-status status-nominal';
            neuralCard.querySelector('.indicator').classList.remove('indicator-warning');
          }, 2000);
        }
      }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent.action();
  };
  // Trigger random event every 8-15 seconds
  const scheduleRandomEvent = () => {
    setTimeout(() => {
      triggerRandomEvent();
      scheduleRandomEvent();
    }, Math.random() * 7000 + 8000);
  };
  scheduleRandomEvent();

  // --------------------------
  // Initial Animation Triggers
  // --------------------------
  // Add staggered fade-in to organ cards on load
  organCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.animation = `fadeIn 0.5s ease-out ${i * 0.1}s forwards`;
  });
});
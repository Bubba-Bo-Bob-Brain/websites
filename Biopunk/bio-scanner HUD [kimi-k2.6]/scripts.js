// === VISCERAL.OS — Core System ===

const VisceralOS = {
  heartbeat: 72,
  baseHeartbeat: 72,
  mutationLevel: 12.7,
  lastBeat: 0,
  beatInterval: 60000 / 72,
  organs: {},
  nanoswarm: [],
  neuralPath: [],
  logs: [],
  isRunning: true
};

// === Utility Functions ===

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function formatTime(date) {
  return date.toTimeString().slice(0, 8);
}

// === Logging System ===

function addLog(message, level = 'info') {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  const time = formatTime(new Date());
  const levelClass = level.toLowerCase();
  const levelTag = levelClass === 'warning' ? 'WARN' : levelClass === 'error' ? 'ERROR' : 'INFO';
  entry.innerHTML = `<span class="log-time">${time}</span> <span class="log-level ${levelClass}">[${levelTag}]</span> ${message}`;
  const container = document.getElementById('log-entries');
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
  while (container.children.length > 50) {
    container.removeChild(container.firstChild);
  }
}

// === Clock ===

function updateClock() {
  document.getElementById('system-clock').textContent = formatTime(new Date());
}

// === Heartbeat System ===

function updateHeartbeat() {
  const now = Date.now();
  const variation = Math.sin(now / 10000) * 8 + randomRange(-3, 3);
  VisceralOS.heartbeat = clamp(Math.round(VisceralOS.baseHeartbeat + variation), 55, 110);
  VisceralOS.beatInterval = 60000 / VisceralOS.heartbeat;
  
  document.getElementById('bpm-value').textContent = VisceralOS.heartbeat;
  
  const root = document.documentElement;
  const pulseDuration = 60 / VisceralOS.heartbeat;
  root.style.setProperty('--pulse-duration', `${pulseDuration}s`);
  
  const ecgActive = document.querySelector('.ecg-active');
  if (ecgActive) {
    ecgActive.style.animationDuration = `${pulseDuration}s`;
  }
}

// === Organ Data Simulation ===

const organData = {
  heart: {
    output: { current: 4.8, target: 5.0, variance: 0.3 },
    synch: { current: 92, target: 95, variance: 3 }
  },
  lungs: {
    o2: { current: 96.4, target: 98, variance: 1 },
    co2: { current: 34, target: 40, variance: 4 }
  },
  liver: {
    filter: { current: 67, target: 85, variance: 5 },
    toxin: { current: 23, target: 15, variance: 3 }
  },
  brain: {
    link: { current: 89.3, target: 95, variance: 2 },
    activity: { current: 45, target: 50, variance: 8 }
  }
};

function updateOrgan(organName) {
  const data = organData[organName];
  if (!data) return;
  
  for (const [metric, info] of Object.entries(data)) {
    info.current += randomRange(-info.variance, info.variance) * 0.1;
    info.current = lerp(info.current, info.target, 0.005);
    info.current = clamp(info.current, 0, metric === 'toxin' || metric === 'co2' ? 100 : 100);
  }
  
  const statuses = {
    heart: () => {
      const output = data.output.current;
      const synch = data.synch.current;
      const outputEl = document.getElementById('heart-output');
      const outputVal = document.getElementById('heart-output-val');
      const synchEl = document.getElementById('heart-synch');
      const synchVal = document.getElementById('heart-synch-val');
      const statusEl = document.getElementById('heart-status');
      const trendEl = document.getElementById('heart-trend');
      
      if (outputEl) outputEl.style.width = `${clamp(output / 7 * 100, 0, 100)}%`;
      if (outputVal) outputVal.textContent = `${output.toFixed(1)} L/min`;
      if (synchEl) synchEl.style.width = `${synch}%`;
      if (synchVal) synchVal.textContent = `${synch.toFixed(0)}%`;
      
      if (statusEl) {
        if (synch < 70) {
          statusEl.textContent = 'CRITICAL';
          statusEl.className = 'organ-status danger';
          trendEl.className = 'trend danger';
        } else if (synch < 85) {
          statusEl.textContent = 'DEGRADED';
          statusEl.className = 'organ-status warning';
          trendEl.className = 'trend warning';
        } else {
          statusEl.textContent = 'NOMINAL';
          statusEl.className = 'organ-status';
          trendEl.className = 'trend';
        }
      }
    },
    lungs: () => {
      const o2 = data.o2.current;
      const co2 = data.co2.current;
      document.getElementById('lung-o2').style.width = `${o2}%`;
      document.getElementById('lung-o2-val').textContent = `${o2.toFixed(1)}%`;
      document.getElementById('lung-co2').style.width = `${co2 / 60 * 100}%`;
      document.getElementById('lung-co2-val').textContent = `${Math.round(co2)} mmHg`;
      
      const statusEl = document.getElementById('lungs-status');
      if (o2 < 90) {
        statusEl.textContent = 'HYPOXIC';
        statusEl.className = 'organ-status danger';
      } else if (o2 < 94) {
        statusEl.textContent = 'REDUCED';
        statusEl.className = 'organ-status warning';
      } else {
        statusEl.textContent = 'NOMINAL';
        statusEl.className = 'organ-status';
      }
    },
    liver: () => {
      const filter = data.filter.current;
      const toxin = data.toxin.current;
      document.getElementById('liver-filter').style.width = `${filter}%`;
      document.getElementById('liver-filter-val').textContent = `${Math.round(filter)}% EFF`;
      document.getElementById('liver-toxin').style.width = `${toxin / 50 * 100}%`;
      document.getElementById('liver-toxin-val').textContent = `${toxin.toFixed(1)} μg/mL`;
      
      const statusEl = document.getElementById('liver-status');
      const trendEl = document.getElementById('liver-trend');
      if (toxin > 30 || filter < 50) {
        statusEl.textContent = 'FAILING';
        statusEl.className = 'organ-status danger';
        trendEl.className = 'trend danger';
      } else if (toxin > 20 || filter < 70) {
        statusEl.textContent = 'ELEVATED';
        statusEl.className = 'organ-status warning';
        trendEl.className = 'trend warning';
      } else {
        statusEl.textContent = 'NOMINAL';
        statusEl.className = 'organ-status';
        trendEl.className = 'trend';
      }
    },
    brain: () => {
      const link = data.brain.link.current;
      const activity = data.brain.activity.current;
      document.getElementById('brain-link').style.width = `${link}%`;
      document.getElementById('brain-link-val').textContent = `${link.toFixed(1)}%`;
      document.getElementById('brain-activity').style.width = `${activity / 100 * 100}%`;
      document.getElementById('brain-activity-val').textContent = `${activity.toFixed(0)} Hz`;
      
      const statusEl = document.getElementById('brain-status');
      if (link < 60) {
        statusEl.textContent = 'DISCONNECTED';
        statusEl.className = 'organ-status danger';
      } else if (link < 80) {
        statusEl.textContent = 'DEGRADED';
        statusEl.className = 'organ-status warning';
      } else {
        statusEl.textContent = 'SYNCHRONIZED';
        statusEl.className = 'organ-status';
      }
    }
  };
  
  if (statuses[organName]) statuses[organName]();
}

// === Nanomachine Swarm Visualizer ===

class Nanoswarm {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.targets = [];
    this.resize();
    
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: randomRange(0, this.width),
        y: randomRange(0, this.height),
        vx: randomRange(-0.5, 0.5),
        vy: randomRange(-0.5, 0.5),
        size: randomRange(1, 3),
        phase: randomRange(0, Math.PI * 2),
        targetOrgan: null
      });
    }
    
    this.targets = [
      { x: this.width * 0.3, y: this.height * 0.3, active: true },
      { x: this.width * 0.7, y: this.height * 0.5, active: false },
      { x: this.width * 0.5, y: this.height * 0.7, active: false }
    ];
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = rect.width;
    this.height = rect.height;
  }
  
  update() {
    const time = Date.now() * 0.001;
    
    this.particles.forEach(p => {
      p.phase += 0.02;
      
      const activeTarget = this.targets.find(t => t.active);
      if (activeTarget && Math.random() < 0.02) {
        p.targetOrgan = activeTarget;
      }
      
      if (p.targetOrgan) {
        const dx = p.targetOrgan.x - p.x;
        const dy = p.targetOrgan.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 20) {
          p.targetOrgan = null;
        } else {
          p.vx += dx * 0.0003;
          p.vy += dy * 0.0003;
        }
      }
      
      p.vx += Math.sin(p.phase) * 0.01;
      p.vy += Math.cos(p.phase * 0.7) * 0.01;
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    });
    
    this.targets.forEach((t, i) => {
      t.x = this.width * (0.3 + i * 0.2);
      t.y = this.height * (0.3 + Math.sin(time + i) * 0.2);
    });
  }
  
  draw() {
    this.ctx.fillStyle = 'rgba(10, 5, 8, 0.15)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.particles.forEach(p => {
      const brightness = 0.5 + Math.sin(p.phase) * 0.5;
      const r = Math.floor(255 * brightness);
      const g = Math.floor(182 * brightness * 0.6);
      const b = Math.floor(39 * brightness * 0.3);
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgb(${r},${g},${b})`;
      this.ctx.fill();
      
      this.particles.forEach(other => {
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 40 && dist > 0) {
          const alpha = (1 - dist / 40) * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(255, 182, 39, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });
    
    this.targets.forEach(t => {
      if (!t.active) return;
      this.ctx.beginPath();
      this.ctx.arc(t.x, t.y, 15, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(139, 38, 53, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }
  
  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// === Gene-Splice Matrix ===

function initGeneMatrix() {
  const grid = document.getElementById('gene-grid');
  if (!grid) return;
  
  const states = ['compatible', 'unstable', 'rejected', 'unknown'];
  const weights = [0.4, 0.25, 0.15, 0.2];
  
  for (let i = 0; i < 36; i++) {
    const cell = document.createElement('div');
    cell.className = 'gene-cell';
    
    let rand = Math.random();
    let stateIndex = 0;
    let cumulative = 0;
    
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (rand < cumulative) {
        stateIndex = j;
        break;
      }
    }
    
    cell.classList.add(states[stateIndex]);
    cell.dataset.index = i;
    
    cell.addEventListener('mouseenter', () => {
      const geneNames = ['ATP7B', 'CFTR', 'HBB', 'HTT', 'LDLR', 'PAH', 'SERPINA1', 'TP53', 'BRCA1', 'EGFR', 'KRAS', 'MYC'];
      const geneName = geneNames[i % geneNames.length];
      const variants = ['ΔF508', 'G551D', 'R117H', 'W1282X', 'N1303K', 'G542X'];
      const variant = variants[Math.floor(Math.random() * variants.length)];
      
      addLog(`Gene ${geneName} variant ${variant}: ${states[stateIndex].toUpperCase()}`, 
        states[stateIndex] === 'rejected' ? 'error' : states[stateIndex] === 'unstable' ? 'warning' : 'info');
    });
    
    grid.appendChild(cell);
  }
  
  setInterval(() => {
    const cells = grid.querySelectorAll('.gene-cell');
    const cell = cells[Math.floor(Math.random() * cells.length)];
    const currentStates = states.filter(s => cell.classList.contains(s));
    cell.classList.remove(...states);
    
    let newState;
    if (Math.random() < 0.3) {
      newState = 'unknown';
    } else {
      newState = states[Math.floor(Math.random() * 3)];
    }
    cell.classList.add(newState);
    
    if (newState === 'rejected' && Math.random() < 0.3) {
      addLog(`Gene locus ${cell.dataset.index} rejection cascade detected`, 'error');
    }
  }, 3000);
}

// === Neural Link Cascade ===

function initNeuralMap() {
  const nodes = document.querySelectorAll('.neural-node');
  const connections = document.querySelectorAll('.neural-connection');
  
  const nodePositions = {
    'occipital': { x: 0.2, y: 0.05 },
    'parietal': { x: 0.8, y: 0.05 },
    'frontal': { x: 0.5, y: 0.25 },
    'temporal': { x: 0.15, y: 0.35 },
    'cerebellum': { x: 0.85, y: 0.35 },
    'brainstem': { x: 0.5, y: 0.55 },
    'spine': { x: 0.5, y: 0.75 }
  };
  
  function updateConnections() {
    const mapRect = document.getElementById('neural-map').getBoundingClientRect();
    
    connections.forEach(conn => {
      const connType = conn.dataset.conn;
      const [from, to] = connType.split('-');
      const fromNode = document.querySelector(`[data-node="${from}"]`);
      const toNode = document.querySelector(`[data-node="${to}"]`);
      
      if (!fromNode || !toNode) return;
      
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      
      const x1 = fromRect.left + fromRect.width / 2 - mapRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - mapRect.top;
      const x2 = toRect.left + toRect.width / 2 - mapRect.left;
      const y2 = toRect.top + toRect.height / 2 - mapRect.top;
      
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      
      conn.style.width = `${length}px`;
      conn.style.left = `${x1}px`;
      conn.style.top = `${y1 - 1}px`;
      conn.style.transform = `rotate(${angle}deg)`;
    });
  }
  
  let activeNode = 0;
  const nodeOrder = ['occipital', 'parietal', 'frontal', 'temporal', 'cerebellum', 'brainstem', 'spine'];
  
  function propagateSignal() {
    nodes.forEach(n => n.classList.remove('active'));
    connections.forEach(c => c.classList.remove('active'));
    
    const currentNode = nodeOrder[activeNode];
    const nodeEl = document.querySelector(`[data-node="${currentNode}"]`);
    if (nodeEl) nodeEl.classList.add('active');
    
    const prevNode = nodeOrder[(activeNode - 1 + nodeOrder.length) % nodeOrder.length];
    const connEl = document.querySelector(`[data-conn="${prevNode.charAt(0)}-${currentNode.charAt(0)}"]`) ||
                   document.querySelector(`[data-conn="${currentNode === 'brainstem' ? 'c-s' : prevNode === 'brainstem' ? 's-sp' : ''}"]`);
    if (connEl) connEl.classList.add('active');
    
    activeNode = (activeNode + 1) % nodeOrder.length;
    
    const bw = 800 + Math.random() * 80;
    const lat = 0.2 + Math.random() * 0.2;
    const loss = Math.random() * 0.003;
    
    document.getElementById('neural-bw').textContent = `${bw.toFixed(0)} Tbps`;
    document.getElementById('neural-lat').textContent = `${lat.toFixed(1)} ms`;
    document.getElementById('neural-loss').textContent = `${loss.toFixed(3)}%`;
  }
  
  setInterval(propagateSignal, 800);
  updateConnections();
  window.addEventListener('resize', updateConnections);
  
  setInterval(() => {
    const statusEl = document.getElementById('neural-status');
    const loss = parseFloat(document.getElementById('neural-loss').textContent);
    if (loss > 0.002) {
      statusEl.textContent = 'DEGRADED';
      statusEl.className = 'organ-status warning';
    } else {
      statusEl.textContent = 'STABLE';
      statusEl.className = 'organ-status';
    }
  }, 2000);
}

// === Body Wireframe Interactions ===

function initBodyWireframe() {
  const markers = document.querySelectorAll('.organ-marker');
  const popup = document.getElementById('organ-popup');
  const popupTitle = document.getElementById('popup-title');
  const popupBody = document.getElementById('popup-body');
  
  const organInfo = {
    heart: {
      title: 'CARDIAC CORE Mk.IV',
      body: 'Synthetic myocardium with piezoelectric contractile fibers. Autonomic regulation active. Synch rate fluctuating within acceptable parameters. Recommend calibration if synch drops below 85%.'
    },
    lungs: {
      title: 'PULMONARY ARRAY ENHANCED',
      body: 'Alveolar surface area increased 340% via nanostructured membranes. Gas exchange efficiency nominal. CO₂ clearance optimal. Filter replacement due in 47 cycles.'
    },
    liver: {
      title: 'HEPATIC FILTER NANO-POROUS V2',
      body: 'WARNING: Filtration efficiency declining. Toxin accumulation detected. Nanoswarm deployment in progress. Consider full replacement if no improvement within 12 hours.'
    },
    brain: {
      title: 'NEURAL CORE QUANTUM LACE v7',
      body: 'Quantum-entangled synaptic mesh operational. Link integrity above threshold. Occasional decoherence events logged but auto-corrected. Consciousness continuity: 99.97%.'
    },
    stomach: {
      title: 'GASTRIC PROCESSOR',
      body: 'Enzymatic breakdown accelerated via synthetic catalysts. pH regulation stable. Nutrient extraction efficiency: 94%.'
    },
    kidneys: {
      title: 'RENAL FILTRATION PAIR',
      body: 'Ultrafiltration rate nominal. Osmotic balance maintained. Electrolyte regulation within parameters. Dialysis bypass not required.'
    },
    intestines: {
      title: 'INTESTINAL TRACT MODIFIED',
      body: 'Extended villi with enhanced absorption. Gut biome monitored and regulated. Fermentation byproducts within safe levels.'
    }
  };
  
  markers.forEach(marker => {
    marker.addEventListener('mouseenter', () => {
      const organ = marker.dataset.organ;
      const info = organInfo[organ];
      
      if (info && popup && popupTitle && popupBody) {
        popupTitle.textContent = info.title;
        popupBody.textContent = info.body;
        popup.classList.add('visible');
        
        const rect = marker.getBoundingClientRect();
        const containerRect = marker.closest('.body-scan-frame').getBoundingClientRect();
        popup.style.left = `${rect.left - containerRect.left + 20}px`;
        popup.style.top = `${rect.top - containerRect.top - 10}px`;
      }
      
      marker.classList.add('active');
      addLog(`Anatomical scan: ${organ.toUpperCase()} selected`, 'info');
    });
    
    marker.addEventListener('mouseleave', () => {
      marker.classList.remove('active');
      if (popup) popup.classList.remove('visible');
    });
  });
}

// === Mutation Progression ===

function updateMutation() {
  VisceralOS.mutationLevel += randomRange(-0.1, 0.3);
  VisceralOS.mutationLevel = clamp(VisceralOS.mutationLevel, 0, 100);
  
  const percentEl = document.getElementById('mutation-percent');
  if (percentEl) {
    percentEl.textContent = `${VisceralOS.mutationLevel.toFixed(1)}%`;
  }
  
  const overlay = document.getElementById('mutation-overlay');
  if (overlay) {
    if (VisceralOS.mutationLevel > 50) {
      overlay.style.borderColor = 'var(--red-danger)';
    } else if (VisceralOS.mutationLevel > 25) {
      overlay.style.borderColor = 'var(--amber-warn)';
    }
  }
  
  if (Math.random() < 0.01 && VisceralOS.mutationLevel > 30) {
    addLog(`Mutation cascade detected: level ${VisceralOS.mutationLevel.toFixed(1)}%`, 'warning');
  }
  
  if (Math.random() < 0.005 && VisceralOS.mutationLevel > 60) {
    addLog('CRITICAL: Uncontrolled mutation event — containment protocols engaged', 'error');
    document.getElementById('alert-status').textContent = 'BIOHAZARD';
    document.getElementById('alert-status').className = 'alert-status danger';
  }
}

// === Toxin Gauges ===

function updateToxinGauges() {
  const gauges = {
    heavy: { current: 34, max: 50, el: 'heavy-val', fill: 'toxin-heavy' },
    rad: { current: 12, max: 100, el: 'rad-val', fill: 'toxin-rad' },
    path: { current: 58, max: 100, el: 'path-val', fill: 'toxin-path' },
    chem: { current: 22, max: 80, el: 'chem-val', fill: 'toxin-chem' }
  };
  
  for (const [key, data] of Object.entries(gauges)) {
    data.current += randomRange(-2, 2);
    data.current = clamp(data.current, 0, data.max * 1.5);
    
    const valEl = document.getElementById(data.el);
    const fillEl = document.getElementById(data.fill);
    
    if (valEl) valEl.textContent = Math.round(data.current);
    
    if (fillEl) {
      const pct = Math.min(data.current / data.max, 1);
      const angle = pct * 180;
      const rad = angle * Math.PI / 180;
      const x = 50 + 40 * Math.cos(Math.PI - rad);
      const y = 50 - 40 * Math.sin(rad);
      const largeArc = angle > 180 ? 1 : 0;
      
      fillEl.setAttribute('d', `M10,50 A40,40 0 ${largeArc},1 ${x},${y}`);
      
      fillEl.classList.remove('warning', 'danger');
      if (pct > 0.8) {
        fillEl.classList.add('danger');
      } else if (pct > 0.6) {
        fillEl.classList.add('warning');
      }
    }
  }
}

// === Global Alert Status ===

function updateGlobalStatus() {
  const alertEl = document.getElementById('alert-status');
  if (!alertEl) return;
  
  let worstStatus = 'STABLE';
  let hasWarning = false;
  let hasDanger = false;
  
  document.querySelectorAll('.organ-status').forEach(status => {
    if (status.classList.contains('danger')) hasDanger = true;
    else if (status.classList.contains('warning')) hasWarning = true;
  });
  
  if (VisceralOS.mutationLevel > 60) hasDanger = true;
  else if (VisceralOS.mutationLevel > 30) hasWarning = true;
  
  if (hasDanger) {
    worstStatus = 'CRITICAL';
    alertEl.className = 'alert-status danger';
  } else if (hasWarning) {
    worstStatus = 'CAUTION';
    alertEl.className = 'alert-status warning';
  } else {
    alertEl.className = 'alert-status';
  }
  
  alertEl.textContent = worstStatus;
}

// === Random Events ===

function triggerRandomEvent() {
  const events = [
    () => {
      addLog('Nanoswarm repositioning — new target coordinates locked', 'info');
      document.getElementById('nano-target').textContent = ['HEPATIC', 'NEURAL', 'CARDIAC', 'PULMONARY'][Math.floor(Math.random() * 4)];
    },
    () => {
      const newUnits = (2 + Math.random() * 1).toFixed(1);
      document.getElementById('nano-units').textContent = `${newUnits}×10⁹`;
      document.getElementById('nano-efficacy').textContent = `${Math.round(80 + Math.random() * 15)}%`;
    },
    () => {
      addLog('Spontaneous neural decoherence event — auto-corrected', 'warning');
    },
    () => {
      const geneStatus = document.getElementById('gene-status');
      if (geneStatus) {
        geneStatus.textContent = 'ANALYZING';
        geneStatus.className = 'organ-status warning';
        setTimeout(() => {
          geneStatus.textContent = 'PENDING';
          geneStatus.className = 'organ-status';
        }, 2000);
      }
    }
  ];
  
  if (Math.random() < 0.3) {
    const event = events[Math.floor(Math.random() * events.length)];
    event();
  }
}

// === Main Loop ===

function mainLoop() {
  updateClock();
  updateHeartbeat();
  
  ['heart', 'lungs', 'liver', 'brain'].forEach(updateOrgan);
  updateMutation();
  updateToxinGauges();
  updateGlobalStatus();
  
  if (Math.random() < 0.02) triggerRandomEvent();
}

// === Initialization ===

document.addEventListener('DOMContentLoaded', () => {
  addLog('VISCERAL.OS v4.2.9-biohazard initializing...', 'info');
  
  setTimeout(() => addLog('Biocore Monitor Unit 7 — handshake accepted', 'info'), 200);
  setTimeout(() => addLog('Patient CYB-7749 neural imprint verified', 'info'), 500);
  setTimeout(() => addLog('WARNING: Hepatic filter efficiency 67% — below nominal threshold', 'warning'), 1200);
  setTimeout(() => addLog('Auto-response: Nanoswarm deployment authorized', 'info'), 1800);
  setTimeout(() => addLog('Quantum Lace v7 synchronization complete', 'info'), 2500);
  
  const nanoCanvas = document.getElementById('nano-canvas');
  if (nanoCanvas) {
    const swarm = new Nanoswarm(nanoCanvas);
    swarm.animate();
  }
  
  initGeneMatrix();
  initNeuralMap();
  initBodyWireframe();
  
  setInterval(mainLoop, 100);
  
  setInterval(() => {
    if (Math.random() < 0.1) {
      const logs = [
        'Peripheral sensor calibration complete',
        'Synthetic hormone levels adjusted',
        'Immune response markers stable',
        'Microbiome diversity index: 0.87',
        'Cellular regeneration rate: 104% baseline',
        'Biometric signature hash updated'
      ];
      addLog(logs[Math.floor(Math.random() * logs.length)], 'info');
    }
  }, 8000);
  
  addLog('All systems operational — monitoring active', 'info');
});
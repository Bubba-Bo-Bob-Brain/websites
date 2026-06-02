/* ============================================
   BIOSCAN // CYBERNETIC PATIENT INTERFACE
   MAIN CONTROLLER & VISUALIZATION ENGINE
   ============================================ */

(function () {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    bpm: 72,
    heartbeatInterval: 0,
    scanPhaseDuration: 15000,
    warningInterval: 25000,
    logInterval: 3000,
    dataFluctuationInterval: 2000,
    colors: {
      primary: '#2dff8a',
      primaryDim: '#1a7a4d',
      secondary: '#00e5ff',
      warning: '#ffaa00',
      critical: '#ff2a2a',
      neural: '#b967ff',
      unknown: '#6a7bff',
      bg: '#0a1612',
      textDim: '#4a6b5a'
    },
    scanPhases: [
      'DEEP TISSUE ANALYSIS',
      'NEURAL MAPPING',
      'CYBERNETIC INTEGRITY',
      'TOXIN SCREENING',
      'GENOME SEQUENCING',
      'NANOMACHINE DIAGNOSTIC',
      'MUTATION ASSESSMENT',
      'FULL SYSTEM SCAN'
    ]
  };

  // Calculate heartbeat interval from BPM
  CONFIG.heartbeatInterval = 60000 / CONFIG.bpm;

  // ===== STATE =====
  const state = {
    timestamp: 0,
    ecgOffset: 0,
    ecgPhase: 0,
    nanoParticles: [],
    helixPhase: 0,
    neuralPhase: 0,
    currentScanPhase: 0,
    warningActive: false,
    logEntries: [],
    organData: {},
    neuralData: {},
    toxinData: {},
    nanoData: {}
  };

  // ===== UTILITY FUNCTIONS =====
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function padZero(n, digits = 2) {
    return String(n).padStart(digits, '0');
  }

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const mil = Math.floor((ms % 1000) / 10);
    return `${padZero(h)}:${padZero(m)}:${padZero(s)}.${padZero(mil)}`;
  }

  function getTimestamp() {
    return formatTime(state.timestamp);
  }

  // ===== CANVAS HELPERS =====
  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  // ===== ECG ENGINE =====
  const ECGEngine = {
    generateECGPoint(phase, amplitude = 1) {
      const p = phase % 1;
      // P wave
      if (p < 0.1) return Math.sin(p * 10 * Math.PI) * 0.2 * amplitude;
      // QRS complex
      if (p >= 0.15 && p < 0.18) return -0.3 * amplitude;
      if (p >= 0.18 && p < 0.22) return 1.0 * amplitude;
      if (p >= 0.22 && p < 0.26) return -0.4 * amplitude;
      // T wave
      if (p >= 0.35 && p < 0.5) return Math.sin((p - 0.35) * 20 * Math.PI / 3) * 0.3 * amplitude;
      // Baseline noise
      return (Math.random() - 0.5) * 0.05 * amplitude;
    },

    drawECG(canvasId, speed = 2, amplitude = 1, color = null) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const { ctx, width, height } = setupCanvas(canvas);
      
      ctx.clearRect(0, 0, width, height);
      
      const strokeColor = color || CONFIG.colors.primary;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 4;
      ctx.beginPath();

      const pointsPerFrame = Math.max(1, Math.floor(width / 100));
      for (let x = 0; x < width; x += 2) {
        const phase = (state.ecgOffset + x * speed / width) % 1;
        const y = height / 2 - this.generateECGPoint(phase, amplitude) * height * 0.4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  // ===== NANOMACHINE SWARM =====
  const NanoSwarm = {
    init(count = 120) {
      state.nanoParticles = [];
      for (let i = 0; i < count; i++) {
        state.nanoParticles.push({
          x: rand(20, 580),
          y: rand(10, 150),
          vx: rand(-0.3, 0.3),
          vy: rand(-0.3, 0.3),
          size: rand(1, 3),
          alpha: rand(0.3, 0.9),
          pulse: rand(0, Math.PI * 2),
          targetX: rand(100, 500),
          targetY: rand(30, 130),
          behavior: pick(['orbit', 'drift', 'pulse', 'cluster'])
        });
      }
    },

    update(dt) {
      const particles = state.nanoParticles;
      const time = state.timestamp / 1000;
      
      particles.forEach(p => {
        p.pulse += 0.05;
        
        switch (p.behavior) {
          case 'orbit':
            const cx = 300, cy = 80;
            const angle = time * 0.5 + p.pulse;
            const radius = 30 + Math.sin(p.pulse) * 15;
            p.targetX = cx + Math.cos(angle) * radius;
            p.targetY = cy + Math.sin(angle) * radius;
            break;
          case 'cluster':
            p.targetX = 300 + Math.sin(time + p.pulse) * 50;
            p.targetY = 80 + Math.cos(time * 0.7 + p.pulse) * 30;
            break;
          case 'pulse':
            p.alpha = 0.3 + Math.sin(p.pulse * 2) * 0.5;
            break;
        }

        // Attract to target
        p.vx += (p.targetX - p.x) * 0.005;
        p.vy += (p.targetY - p.y) * 0.005;
        
        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.x < -10) p.x = 610;
        if (p.x > 610) p.x = -10;
        if (p.y < -10) p.y = 170;
        if (p.y > 170) p.y = -10;
      });
    },

    draw(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const { ctx, width, height } = setupCanvas(canvas);
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(45, 255, 138, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < state.nanoParticles.length; i++) {
        for (let j = i + 1; j < state.nanoParticles.length; j++) {
          const dx = state.nanoParticles[i].x - state.nanoParticles[j].x;
          const dy = state.nanoParticles[i].y - state.nanoParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            ctx.globalAlpha = (1 - dist / 50) * 0.3;
            ctx.beginPath();
            ctx.moveTo(state.nanoParticles[i].x, state.nanoParticles[i].y);
            ctx.lineTo(state.nanoParticles[j].x, state.nanoParticles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw particles
      state.nanoParticles.forEach(p => {
        ctx.fillStyle = CONFIG.colors.primary;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = CONFIG.colors.primary;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Draw swarm center indicator
      ctx.strokeStyle = 'rgba(45, 255, 138, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(300, 80, 40 + Math.sin(state.timestamp / 500) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  // ===== MUTATION HELIX =====
  const MutationHelix = {
    draw(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const { ctx, width, height } = setupCanvas(canvas);
      
      ctx.clearRect(0, 0, width, height);
      
      const time = state.timestamp / 1000;
      const amplitude = 30;
      const frequency = 0.03;
      const speed = 0.8;
      const segments = 60;
      const segmentHeight = height / segments;
      
      ctx.lineWidth = 2;
      
      // Strand 1
      ctx.strokeStyle = CONFIG.colors.primary;
      ctx.shadowColor = CONFIG.colors.primary;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const y = i * segmentHeight;
        const phase = i * frequency * Math.PI * 2 + time * speed;
        const x = width / 2 + Math.sin(phase) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Strand 2
      ctx.strokeStyle = CONFIG.colors.secondary;
      ctx.shadowColor = CONFIG.colors.secondary;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const y = i * segmentHeight;
        const phase = i * frequency * Math.PI * 2 + time * speed + Math.PI;
        const x = width / 2 + Math.sin(phase) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Base pairs
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
      for (let i = 0; i <= segments; i += 2) {
        const y = i * segmentHeight;
        const phase1 = i * frequency * Math.PI * 2 + time * speed;
        const phase2 = phase1 + Math.PI;
        const x1 = width / 2 + Math.sin(phase1) * amplitude;
        const x2 = width / 2 + Math.sin(phase2) * amplitude;
        
        const depth = Math.cos(phase1);
        const alpha = Math.max(0.1, depth * 0.5 + 0.3);
        ctx.strokeStyle = `rgba(45, 255, 138, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        
        // Nodes
        if (i % 4 === 0) {
          ctx.fillStyle = `rgba(45, 255, 138, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x1, y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x2, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Mutation markers (red pulses)
      ctx.fillStyle = CONFIG.colors.critical;
      ctx.shadowColor = CONFIG.colors.critical;
      ctx.shadowBlur = 8;
      for (let i = 0; i < 3; i++) {
        const idx = ((i * 17 + Math.floor(time * 2)) % segments) * segmentHeight;
        const phase = idx * frequency * Math.PI * 2 + time * speed;
        const x = width / 2 + Math.sin(phase) * amplitude;
        const pulse = Math.sin(time * 3 + i) * 0.5 + 0.5;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(x, idx, 3 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  };

  // ===== NEURAL WAVEFORM =====
  const NeuralWaveform = {
    draw(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const { ctx, width, height } = setupCanvas(canvas);
      
      ctx.clearRect(0, 0, width, height);
      
      const time = state.timestamp / 1000;
      ctx.strokeStyle = CONFIG.colors.neural;
      ctx.shadowColor = CONFIG.colors.neural;
      ctx.shadowBlur = 4;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const freq1 = 0.02;
        const freq2 = 0.05;
        const freq3 = 0.01;
        const phase = x * freq1 + time * 1.5;
        const y = height / 2 
          + Math.sin(phase) * 10 
          + Math.sin(x * freq2 + time * 2.3) * 6
          + Math.sin(x * freq3 + time * 0.5) * 8
          + (Math.random() - 0.5) * 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  // ===== GENE MATRIX =====
  const GeneMatrix = {
    init() {
      const container = document.getElementById('geneMatrix');
      if (!container) return;
      container.innerHTML = '';
      
      const rows = 6;
      const cols = 8;
      const states = ['compatible', 'partial', 'rejected', 'unknown'];
      
      for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = `gene-cell gene-cell--${pick(states)}`;
        cell.dataset.index = i;
        cell.title = `Gene locus ${i + 1}`;
        container.appendChild(cell);
      }
    },

    randomize() {
      const cells = document.querySelectorAll('.gene-cell');
      const states = ['compatible', 'partial', 'rejected', 'unknown'];
      
      // Randomly change a few cells
      const changeCount = randInt(2, 6);
      for (let i = 0; i < changeCount; i++) {
        const idx = randInt(0, cells.length);
        cells[idx].className = `gene-cell gene-cell--${pick(states)}`;
      }
    }
  };

  // ===== SYSTEM LOG =====
  const SystemLog = {
    messages: {
      info: [
        'Neural handshake verified',
        'Nanomachine relay established',
        'Organ scan cycle initiated',
        'Bio-signals within parameters',
        'Cybernetic sync maintained',
        'Gene expression stable',
        'Tissue regeneration active',
        'Metabolic baseline nominal',
        'Enzyme cascade detected',
        'Protein synthesis ongoing'
      ],
      warn: [
        'Mutation spike detected in STRAND β',
        'Liver toxin load approaching threshold',
        'Neural latency variance +12ms',
        'Nanomachine degradation rate elevated',
        'Sensory feedback desync detected',
        'Blood pressure fluctuation noted',
        'O2 saturation trending downward',
        'Synthetic enzyme depletion warning'
      ],
      crit: [
        'STRAND γ mutation exceeding limits',
        'CRITICAL: Nano-decay toxin levels',
        'Neural link integrity compromised',
        'Bio-rejection markers detected',
        'CYBER-CORTEX sync instability',
        'Organ perfusion compromised',
        'Genome instability index high'
      ],
      nano: [
        'Nanomachine cluster deployed to liver',
        'Swarm recalibration complete',
        'Nanite relay node activated',
        'Repair protocol initiated sector 4',
        'Swarm density optimized',
        'Degraded nanites recycled'
      ]
    },

    addEntry() {
      const container = document.getElementById('logContainer');
      if (!container) return;
      
      const types = ['info', 'info', 'info', 'warn', 'nano', 'crit'];
      const type = pick(types);
      const message = pick(this.messages[type]);
      const time = getTimestamp();
      
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-type log-type--${type}">[${type.toUpperCase()}]</span>
        <span class="log-message">${message}</span>
      `;
      
      container.prepend(entry);
      
      // Keep only last 20 entries
      while (container.children.length > 20) {
        container.removeChild(container.lastChild);
      }
    }
  };

  // ===== DATA SIMULATION =====
  const DataSimulator = {
    init() {
      state.organData = {
        heartRate: { value: 72, min: 65, max: 85, unit: 'BPM' },
        ejectionFrac: { value: 64, min: 55, max: 70, unit: '%' },
        o2Sat: { value: 94, min: 90, max: 98, unit: '%' },
        lungCapacity: { value: 5.2, min: 4.8, max: 5.6, unit: 'L' },
        toxinLoad: { value: 'HIGH', options: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
        regenerationRate: { value: 23, min: 18, max: 28, unit: '%' },
        filtration: { value: 89, min: 80, max: 95, unit: 'ml/min' },
        neuralActivity: { value: 'ELEVATED', options: ['NOMINAL', 'ELEVATED', 'HYPERACTIVE', 'SUPPRESSED'] },
        synapseLoad: { value: 67, min: 55, max: 75, unit: '%' },
        totalToxicLoad: { value: 59.8, min: 45, max: 72, unit: '%' }
      };
      
      state.neuralData = {
        linkIntegrity: { value: 80, min: 70, max: 92 },
        cortexLink: { value: 92, min: 85, max: 98 },
        motorInterface: { value: 88, min: 80, max: 95 },
        sensoryFeedback: { value: 71, min: 60, max: 80 },
        memoryBus: { value: 45, min: 35, max: 55 }
      };
      
      state.nanoData = {
        active: { value: 2.4, min: 2.1, max: 2.7, unit: 'M' },
        dormant: { value: 0.8, min: 0.5, max: 1.1, unit: 'M' },
        degraded: { value: 12.3, min: 8, max: 18, unit: 'K' },
        coordination: { value: 96.7, min: 94, max: 98.5, unit: '%' }
      };
    },

    fluctuate() {
      // Organ data
      for (const key in state.organData) {
        const d = state.organData[key];
        if (d.options) {
          d.value = pick(d.options);
        } else {
          d.value = lerp(d.value, rand(d.min, d.max), 0.3);
          d.value = parseFloat(d.value.toFixed(1));
        }
      }
      
      // Neural data
      for (const key in state.neuralData) {
        const d = state.neuralData[key];
        d.value = lerp(d.value, rand(d.min, d.max), 0.2);
        d.value = Math.round(d.value);
      }
      
      // Nano data
      for (const key in state.nanoData) {
        const d = state.nanoData[key];
        d.value = lerp(d.value, rand(d.min, d.max), 0.25);
        d.value = parseFloat(d.value.toFixed(1));
      }
      
      this.updateDOM();
    },

    updateDOM() {
      // Heart
      const hr = document.getElementById('heartRate');
      if (hr) hr.innerHTML = `${Math.round(state.organData.heartRate.value)} <small>BPM</small>`;
      
      const ef = document.getElementById('ejectionFrac');
      if (ef) ef.innerHTML = `${Math.round(state.organData.ejectionFrac.value)} <small>%</small>`;
      
      // Lungs
      const o2 = document.getElementById('o2Sat');
      if (o2) o2.innerHTML = `${Math.round(state.organData.o2Sat.value)} <small>%</small>`;
      
      const lc = document.getElementById('lungCapacity');
      if (lc) lc.innerHTML = `${state.organData.lungCapacity.value.toFixed(1)} <small>L</small>`;
      
      // Liver
      const tl = document.getElementById('toxinLoad');
      if (tl) tl.textContent = state.organData.toxinLoad.value;
      
      const rr = document.getElementById('regenRate');
      if (rr) rr.innerHTML = `${Math.round(state.organData.regenerationRate.value)} <small>%</small>`;
      
      // Kidneys
      const filt = document.getElementById('filtration');
      if (filt) filt.innerHTML = `${Math.round(state.organData.filtration.value)} <small>ml/min</small>`;
      
      // Brain
      const na = document.getElementById('neuralActivity');
      if (na) na.textContent = state.organData.neuralActivity.value;
      
      const sl = document.getElementById('synapseLoad');
      if (sl) sl.innerHTML = `${Math.round(state.organData.synapseLoad.value)} <small>%</small>`;
      
      // Total toxic load
      const ttl = document.getElementById('totalToxicLoad');
      if (ttl) ttl.textContent = `${state.organData.totalToxicLoad.value.toFixed(1)}%`;
      
      // Neural stats
      const nl = document.getElementById('neuralValue');
      if (nl) nl.textContent = `${state.neuralData.linkIntegrity.value}%`;
      
      const cl = document.getElementById('cortexLink');
      if (cl) cl.textContent = `${state.neuralData.cortexLink.value}%`;
      
      const mi = document.getElementById('motorInterface');
      if (mi) mi.textContent = `${state.neuralData.motorInterface.value}%`;
      
      const sf = document.getElementById('sensoryFeedback');
      if (sf) sf.textContent = `${state.neuralData.sensoryFeedback.value}%`;
      
      const mb = document.getElementById('memoryBus');
      if (mb) mb.textContent = `${state.neuralData.memoryBus.value}%`;
      
      // Nano stats
      const naEl = document.getElementById('nanoActive');
      if (naEl) naEl.textContent = `${state.nanoData.active.value}M`;
      
      const nd = document.getElementById('nanoDormant');
      if (nd) nd.textContent = `${state.nanoData.dormant.value}M`;
      
      const ndg = document.getElementById('nanoDegraded');
      if (ndg) ndg.textContent = `${state.nanoData.degraded.value}K`;
      
      const nc = document.getElementById('nanoCoord');
      if (nc) nc.textContent = `${state.nanoData.coordination.value}%`;
    }
  };

  // ===== SCAN PHASE CYCLING =====
  const ScanController = {
    updatePhase() {
      state.currentScanPhase = (state.currentScanPhase + 1) % CONFIG.scanPhases.length;
      const phaseEl = document.getElementById('scanPhase');
      if (phaseEl) {
        phaseEl.style.opacity = '0';
        setTimeout(() => {
          phaseEl.textContent = CONFIG.scanPhases[state.currentScanPhase];
          phaseEl.style.opacity = '1';
        }, 300);
      }
    }
  };

  // ===== WARNING SYSTEM =====
  const WarningSystem = {
    trigger() {
      if (state.warningActive) return;
      state.warningActive = true;
      
      const overlay = document.getElementById('warningOverlay');
      const msgEl = document.getElementById('warningMessage');
      if (!overlay || !msgEl) return;
      
      const warnings = [
        'CRITICAL MUTATION DETECTED',
        'NEURAL LINK INSTABILITY',
        'TOXIN LEVELS EXCEEDING LIMITS',
        'NANOMACHINE SWARM DESYNC',
        'ORGAN REJECTION IMMINENT',
        'CYBER-CORTEX BREACH DETECTED'
      ];
      
      msgEl.textContent = pick(warnings);
      overlay.classList.add('active');
      
      setTimeout(() => {
        overlay.classList.remove('active');
        state.warningActive = false;
      }, 3000);
    }
  };

  // ===== HEARTBEAT PULSE =====
  const HeartbeatPulse = {
    trigger() {
      const pulse = document.querySelector('.bg-pulse-overlay');
      if (pulse) {
        pulse.style.animation = 'none';
        pulse.offsetHeight; // force reflow
        pulse.style.animation = `pulseOverlay ${CONFIG.heartbeatInterval}ms ease-out`;
      }
    }
  };

  // ===== TIMESTAMP UPDATER =====
  const TimeUpdater = {
    update() {
      state.timestamp += 16; // approximate ms per frame
      const timeEl = document.getElementById('sysTime');
      if (timeEl) timeEl.textContent = getTimestamp();
      
      // Update BPM display
      const bpmEl = document.getElementById('bpmDisplay');
      if (bpmEl) {
        const currentBPM = Math.round(state.organData.heartRate.value);
        bpmEl.textContent = `${currentBPM} BPM`;
      }
    }
  };

  // ===== TOP BAR HEARTBEAT LINE =====
  const TopBarHeartbeat = {
    update() {
      const polyline = document.getElementById('topHeartbeat');
      if (!polyline) return;
      
      const width = 200;
      const height = 40;
      const points = [];
      const segments = 50;
      
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const phase = (state.ecgOffset + i * 0.02) % 1;
        const y = height / 2 - ECGEngine.generateECGPoint(phase, 1) * height * 0.35;
        points.push(`${x},${y}`);
      }
      
      polyline.setAttribute('points', points.join(' '));
    }
  };

  // ===== ORGAN CARD BREATHING SYNC =====
  const OrganSync = {
    update() {
      const cards = document.querySelectorAll('.organ-card');
      const beatPhase = (state.timestamp % CONFIG.heartbeatInterval) / CONFIG.heartbeatInterval;
      
      cards.forEach((card, i) => {
        const offset = i * 0.1;
        const scale = 1 + Math.sin((beatPhase + offset) * Math.PI * 2) * 0.005;
        card.style.transform = `scale(${scale})`;
      });
    }
  };

  // ===== BODY WIREFRAME SYNC =====
  const BodySync = {
    update() {
      const beatPhase = (state.timestamp % CONFIG.heartbeatInterval) / CONFIG.heartbeatInterval;
      const heart = document.getElementById('wireHeart');
      if (heart) {
        const scale = 1 + Math.sin(beatPhase * Math.PI * 2) * 0.15;
        heart.style.transform = `scale(${scale})`;
        heart.style.transformOrigin = '140px 180px';
      }
    }
  };

  // ===== INITIALIZATION =====
  function init() {
    console.log('[BIOSCAN] Initializing cybernetic patient interface...');
    
    // Initialize subsystems
    NanoSwarm.init(120);
    GeneMatrix.init();
    DataSimulator.init();
    
    // Generate initial log entries
    for (let i = 0; i < 5; i++) {
      SystemLog.addEntry();
    }
    
    // Heartbeat loop
    let lastBeat = 0;
    
    // Animation loop
    let lastFrame = performance.now();
    
    function animate(now) {
      const dt = now - lastFrame;
      lastFrame = now;
      
      // Update time
      TimeUpdater.update();
      
      // Check heartbeat
      if (state.timestamp - lastBeat >= CONFIG.heartbeatInterval) {
        HeartbeatPulse.trigger();
        lastBeat = state.timestamp;
      }
      
      // Update ECG phase
      state.ecgOffset += 0.005;
      if (state.ecgOffset > 1) state.ecgOffset -= 1;
      
      // Draw all canvases
      ECGEngine.drawECG('ecgMain', 1.5, 1);
      ECGEngine.drawECG('ecgHeart', 2, 1.2);
      ECGEngine.drawECG('ecgLungs', 1.2, 0.8, CONFIG.colors.secondary);
      ECGEngine.drawECG('ecgLiver', 0.8, 0.6, CONFIG.colors.warning);
      ECGEngine.drawECG('ecgKidneys', 1.0, 0.7);
      ECGEngine.drawECG('ecgBrain', 0.6, 0.5, CONFIG.colors.neural);
      ECGEngine.drawECG('ecgSpine', 1.0, 0.6);
      
      NanoSwarm.update(dt);
      NanoSwarm.draw('nanoSwarm');
      MutationHelix.draw('mutationHelix');
      NeuralWaveform.draw('neuralWaveform');
      TopBarHeartbeat.update();
      OrganSync.update();
      BodySync.update();
      
      requestAnimationFrame(animate);
    }
    
    // Periodic updates
    setInterval(() => DataSimulator.fluctuate(), CONFIG.dataFluctuationInterval);
    setInterval(() => SystemLog.addEntry(), CONFIG.logInterval);
    setInterval(() => GeneMatrix.randomize(), 8000);
    setInterval(() => ScanController.updatePhase(), CONFIG.scanPhaseDuration);
    setInterval(() => WarningSystem.trigger(), CONFIG.warningInterval);
    
    // Start animation
    requestAnimationFrame(animate);
    
    console.log('[BIOSCAN] Interface online. Monitoring subject KAIROS, ELIAS V.');
  }

  // ===== START =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
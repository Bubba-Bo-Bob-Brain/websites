const HUD = {
  bpm: 147,
  heartbeatPhase: 0,
  time: 0,
  lastTimestamp: 0,
  ecgBuffer: [],
  ecgWritePos: 0,
  pvcCounter: 0,
  nextPvcIn: 8,
  isPvcBeat: false,
  organIntegrity: {
    heart: 34,
    lungs: 52,
    liver: 74,
    kidneys: 38,
    spleen: 89,
    pancreas: 8
  },
  toxinLevels: {
    cytotoxin: 847,
    metals: 412,
    prion: 1204,
    mutagen: 98,
    nanodebris: 567
  },
  neuralStats: {
    integrity: 61,
    bandwidth: 44.2,
    latency: 23.4,
    synapseError: 8.7
  },
  nanoStats: {
    active: 3.2,
    degraded: 1.1,
    failed: 0.4,
    replication: 2.1,
    fuel: 41.2,
    coherence: 73.4
  },
  missions: {
    '001': { progress: 34, target: 'heart' },
    '002': { progress: 67, target: 'kidneys' },
    '003': { progress: 0, target: 'neural' },
    '004': { progress: 0, target: 'mutation' }
  },
  mutationProgress: 78,
  cycleSeconds: 0,
  nanoParticles: [],
  swarmParticles: [],
  hotspotPositions: {
    heart: { x: 0.5, y: 0.24 },
    lungs: { x: 0.42, y: 0.29 },
    liver: { x: 0.58, y: 0.35 },
    kidneys: { x: 0.4, y: 0.39 },
    spleen: { x: 0.5, y: 0.32 },
    pancreas: { x: 0.5, y: 0.39 }
  }
};

function init() {
  initEcgBuffer();
  initNanoParticles();
  initSwarmParticles();
  updateHeartbeatDuration();
  requestAnimationFrame(mainLoop);
  setInterval(updateDataReadouts, 800);
  setInterval(updateCycleTime, 1000);
}

function initEcgBuffer() {
  const canvas = document.getElementById('heartbeat-canvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = canvas.offsetHeight * 2;
  HUD.ecgBuffer = new Array(canvas.width).fill(0);
}

function initNanoParticles() {
  HUD.nanoParticles = [];
  for (let i = 0; i < 80; i++) {
    HUD.nanoParticles.push(createNanoParticle());
  }
}

function createNanoParticle() {
  const targets = Object.keys(HUD.hotspotPositions);
  const target = targets[Math.floor(Math.random() * targets.length)];
  const pos = HUD.hotspotPositions[target];
  return {
    x: pos.x + (Math.random() - 0.5) * 0.15,
    y: pos.y + (Math.random() - 0.5) * 0.12,
    vx: (Math.random() - 0.5) * 0.002,
    vy: (Math.random() - 0.5) * 0.002,
    targetX: pos.x,
    targetY: pos.y,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.3,
    state: Math.random() > 0.3 ? 'active' : (Math.random() > 0.5 ? 'degraded' : 'failed'),
    phase: Math.random() * Math.PI * 2,
    targetOrgan: target,
    life: Math.random() * 200 + 100
  };
}

function initSwarmParticles() {
  HUD.swarmParticles = [];
  for (let i = 0; i < 200; i++) {
    HUD.swarmParticles.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.003,
      vy: (Math.random() - 0.5) * 0.003,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      state: Math.random() > 0.65 ? 'active' : (Math.random() > 0.4 ? 'degraded' : 'failed'),
      phase: Math.random() * Math.PI * 2
    });
  }
}

function updateHeartbeatDuration() {
  const duration = 60 / HUD.bpm;
  document.documentElement.style.setProperty('--heartbeat-duration', duration + 's');
}

function mainLoop(timestamp) {
  if (!HUD.lastTimestamp) HUD.lastTimestamp = timestamp;
  const dt = (timestamp - HUD.lastTimestamp) / 1000;
  HUD.lastTimestamp = timestamp;
  HUD.time += dt;

  updateEcg(dt);
  drawEcg();
  updateNanoParticles(dt);
  drawNanoParticles();
  updateSwarmParticles(dt);
  drawSwarmParticles();

  requestAnimationFrame(mainLoop);
}

function getEcgValue(phase) {
  if (phase < 0 || phase > 1) return 0;

  if (phase < 0.1) {
    const t = phase / 0.1;
    return 0.15 * Math.sin(t * Math.PI);
  }
  if (phase < 0.18) return 0;

  if (phase < 0.22) {
    const t = (phase - 0.18) / 0.04;
    return -0.1 * Math.sin(t * Math.PI);
  }

  if (phase < 0.28) {
    const t = (phase - 0.22) / 0.06;
    if (t < 0.3) return -0.1 + t / 0.3 * 1.1;
    if (t < 0.5) return 1.0;
    if (t < 0.8) return 1.0 - (t - 0.5) / 0.3 * 1.4;
    return -0.4 + (t - 0.8) / 0.2 * 0.4;
  }

  if (phase < 0.35) {
    const t = (phase - 0.28) / 0.07;
    return -0.05 * Math.sin(t * Math.PI);
  }

  if (phase < 0.55) {
    const t = (phase - 0.35) / 0.2;
    return 0.25 * Math.sin(t * Math.PI);
  }

  return 0;
}

function getPvcValue(phase) {
  if (phase < 0 || phase > 1) return 0;

  if (phase < 0.05) return 0;
  if (phase < 0.15) {
    const t = (phase - 0.05) / 0.1;
    if (t < 0.4) return t / 0.4 * 1.8;
    if (t < 0.6) return 1.8;
    return 1.8 - (t - 0.6) / 0.4 * 2.4;
  }
  if (phase < 0.22) {
    const t = (phase - 0.15) / 0.07;
    return -0.6 + t * 0.6;
  }
  if (phase < 0.4) {
    const t = (phase - 0.22) / 0.18;
    return 0.3 * Math.sin(t * Math.PI);
  }
  return 0;
}

function updateEcg(dt) {
  const beatsPerSecond = HUD.bpm / 60;
  const phaseIncrement = dt * beatsPerSecond;
  HUD.heartbeatPhase += phaseIncrement;

  const canvas = document.getElementById('heartbeat-canvas');
  if (!canvas) return;
  const samplesPerFrame = Math.max(1, Math.floor(canvas.width * dt / 4));

  for (let s = 0; s < samplesPerFrame; s++) {
    const beatPhase = HUD.heartbeatPhase % 1;

    if (beatPhase < phaseIncrement / samplesPerFrame && !HUD.isPvcBeat) {
      HUD.pvcCounter++;
      if (HUD.pvcCounter >= HUD.nextPvcIn) {
        HUD.isPvcBeat = true;
        HUD.pvcCounter = 0;
        HUD.nextPvcIn = Math.floor(Math.random() * 6) + 5;
      }
    }

    let value;
    if (HUD.isPvcBeat) {
      value = getPvcValue(beatPhase);
      if (beatPhase > 0.9) {
        HUD.isPvcBeat = false;
      }
    } else {
      value = getEcgValue(beatPhase);
      value += (Math.random() - 0.5) * 0.02;
    }

    if (Math.random() < 0.003) {
      value += (Math.random() - 0.5) * 0.3;
    }

    HUD.ecgBuffer[HUD.ecgWritePos] = value;
    HUD.ecgWritePos = (HUD.ecgWritePos + 1) % HUD.ecgBuffer.length;
  }
}

function drawEcg() {
  const canvas = document.getElementById('heartbeat-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(0, 255, 106, 0.08)';
  ctx.lineWidth = 1;
  for (let gy = 0; gy < h; gy += h / 5) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }
  for (let gx = 0; gx < w; gx += w / 10) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }

  const centerY = h * 0.55;
  const amplitude = h * 0.35;
  const writePos = HUD.ecgWritePos;
  const bufLen = HUD.ecgBuffer.length;

  ctx.strokeStyle = '#00ff6a';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(0, 255, 106, 0.6)';
  ctx.shadowBlur = 8;
  ctx.beginPath();

  let started = false;
  for (let i = 0; i < bufLen; i++) {
    const idx = (writePos + i) % bufLen;
    const x = (i / bufLen) * w;
    const y = centerY - HUD.ecgBuffer[idx] * amplitude;

    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  const cursorIdx = (writePos - 1 + bufLen) % bufLen;
  const cursorX = ((bufLen - 1) / bufLen) * w;
  const cursorY = centerY - HUD.ecgBuffer[cursorIdx] * amplitude;

  ctx.beginPath();
  ctx.arc(cursorX, cursorY, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#00ff6a';
  ctx.shadowColor = 'rgba(0, 255, 106, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  const fadeWidth = w * 0.08;
  const gradient = ctx.createLinearGradient(0, 0, fadeWidth, 0);
  gradient.addColorStop(0, 'rgba(5, 8, 5, 1)');
  gradient.addColorStop(1, 'rgba(5, 8, 5, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, fadeWidth, h);
}

function updateNanoParticles(dt) {
  HUD.nanoParticles.forEach((p, i) => {
    p.phase += dt * 2;
    p.life -= 1;

    const dx = p.targetX - p.x;
    const dy = p.targetY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.02) {
      p.vx += dx * 0.01;
      p.vy += dy * 0.01;
    }

    p.vx += Math.sin(p.phase) * 0.0005;
    p.vy += Math.cos(p.phase * 0.7) * 0.0005;

    p.vx *= 0.95;
    p.vy *= 0.95;

    p.x += p.vx;
    p.y += p.vy;

    p.opacity = 0.3 + Math.sin(p.phase * 1.5) * 0.2;

    if (p.life <= 0 || p.x < -0.1 || p.x > 1.1 || p.y < -0.1 || p.y > 1.1) {
      HUD.nanoParticles[i] = createNanoParticle();
    }
  });
}

function drawNanoParticles() {
  const canvas = document.getElementById('nanomachine-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  HUD.nanoParticles.forEach(p => {
    const x = p.x * canvas.width;
    const y = p.y * canvas.height;
    const size = p.size;

    let color;
    if (p.state === 'active') {
      color = `rgba(0, 255, 106, ${p.opacity})`;
    } else if (p.state === 'degraded') {
      color = `rgba(255, 170, 0, ${p.opacity * 0.7})`;
    } else {
      color = `rgba(255, 0, 51, ${p.opacity * 0.5})`;
    }

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    if (p.state === 'active' && Math.random() > 0.7) {
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 106, ${p.opacity * 0.1})`;
      ctx.fill();
    }
  });
}

function updateSwarmParticles(dt) {
  HUD.swarmParticles.forEach(p => {
    p.phase += dt * 1.5;

    p.vx += Math.sin(p.phase + p.y * 5) * 0.0003;
    p.vy += Math.cos(p.phase * 0.8 + p.x * 5) * 0.0003;

    p.vx *= 0.98;
    p.vy *= 0.98;

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) { p.x = 0; p.vx *= -1; }
    if (p.x > 1) { p.x = 1; p.vx *= -1; }
    if (p.y < 0) { p.y = 0; p.vy *= -1; }
    if (p.y > 1) { p.y = 1; p.vy *= -1; }

    p.opacity = 0.3 + Math.sin(p.phase * 2) * 0.2;
  });
}

function drawSwarmParticles() {
  const canvas = document.getElementById('swarm-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  ctx.fillStyle = 'rgba(5, 8, 5, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  HUD.swarmParticles.forEach(p => {
    const x = p.x * canvas.width;
    const y = p.y * canvas.height;

    let color;
    if (p.state === 'active') {
      color = `rgba(0, 204, 170, ${p.opacity})`;
    } else if (p.state === 'degraded') {
      color = `rgba(255, 170, 0, ${p.opacity * 0.6})`;
    } else {
      color = `rgba(255, 0, 51, ${p.opacity * 0.4})`;
    }

    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  const nearby = 30;
  ctx.lineWidth = 0.3;
  for (let i = 0; i < HUD.swarmParticles.length; i++) {
    const a = HUD.swarmParticles[i];
    if (a.state !== 'active') continue;
    for (let j = i + 1; j < HUD.swarmParticles.length; j++) {
      const b = HUD.swarmParticles[j];
      if (b.state !== 'active') continue;
      const dx = (a.x - b.x) * canvas.width;
      const dy = (a.y - b.y) * canvas.height;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearby) {
        const alpha = (1 - dist / nearby) * 0.15;
        ctx.strokeStyle = `rgba(0, 204, 170, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
        ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
        ctx.stroke();
      }
    }
  }
}

function updateDataReadouts() {
  updateVitals();
  updateOrganData();
  updateToxinData();
  updateNeuralData();
  updateNanoData();
  updateMutationData();
  updateMissionProgress();
  updateFooterData();
}

function fluctuate(base, range, min, max) {
  const val = base + (Math.random() - 0.5) * range;
  return Math.max(min, Math.min(max, val));
}

function updateVitals() {
  HUD.bpm = Math.round(fluctuate(HUD.bpm, 8, 120, 180));
  const bpmEl = document.getElementById('bpm-value');
  if (bpmEl) bpmEl.textContent = HUD.bpm + ' BPM';
  updateHeartbeatDuration();

  const coreTemp = fluctuate(38.7, 0.3, 37.5, 40.2).toFixed(1);
  setTextContent('core-temp', coreTemp + '°C');

  const systolic = Math.round(fluctuate(147, 12, 110, 190));
  const diastolic = Math.round(fluctuate(89, 8, 60, 110));
  setTextContent('blood-pressure', diastolic + '/' + systolic);

  const ph = fluctuate(7.28, 0.05, 7.1, 7.45).toFixed(2);
  setTextContent('ph-level', ph);

  const spo2 = Math.round(fluctuate(82, 4, 70, 92));
  setTextContent('spo2', spo2 + '%');
}

function updateOrganData() {
  HUD.organIntegrity.heart = clampIntegrity(HUD.organIntegrity.heart + (Math.random() - 0.52) * 0.8);
  HUD.organIntegrity.lungs = clampIntegrity(HUD.organIntegrity.lungs + (Math.random() - 0.5) * 0.3);
  HUD.organIntegrity.liver = clampIntegrity(HUD.organIntegrity.liver + (Math.random() - 0.48) * 0.2);
  HUD.organIntegrity.kidneys = clampIntegrity(HUD.organIntegrity.kidneys + (Math.random() - 0.52) * 0.5);
  HUD.organIntegrity.spleen = clampIntegrity(HUD.organIntegrity.spleen + (Math.random() - 0.3) * 0.4);
  HUD.organIntegrity.pancreas = clampIntegrity(HUD.organIntegrity.pancreas + (Math.random() - 0.7) * 0.3);

  document.querySelectorAll('.organ-card').forEach(card => {
    const organ = card.dataset.organ;
    const integrity = HUD.organIntegrity[organ];
    if (integrity === undefined) return;

    const pctEl = card.querySelector('.organ-integrity');
    if (pctEl) pctEl.textContent = Math.round(integrity) + '%';

    const barFill = card.querySelector('.organ-bar-fill');
    if (barFill) barFill.style.width = Math.round(integrity) + '%';

    card.dataset.integrity = Math.round(integrity);
  });

  const cardiacOutput = fluctuate(3.2, 0.5, 1.8, 5.0).toFixed(1);
  setTextContent('cardiac-output', cardiacOutput + ' L/min');

  const o2sat = Math.round(fluctuate(82, 3, 70, 92));
  setTextContent('o2-sat', o2sat + '%');

  const respRate = Math.round(fluctuate(28, 4, 18, 40));
  setTextContent('resp-rate', respRate + '/min');

  const hepaticFilt = Math.round(fluctuate(74, 5, 50, 90));
  setTextContent('hepatic-filtration', hepaticFilt + '%');

  const renalGfr = Math.round(fluctuate(38, 6, 20, 60));
  setTextContent('renal-gfr', renalGfr + ' mL');

  const glucose = Math.round(fluctuate(487, 30, 300, 600));
  setTextContent('glucose-level', glucose + ' mg');

  const pvc = Math.round(fluctuate(7, 3, 2, 15));
  setTextContent('pvc-count', pvc + '/min');
}

function updateToxinData() {
  HUD.toxinLevels.cytotoxin = Math.round(fluctuate(HUD.toxinLevels.cytotoxin, 20, 600, 999));
  HUD.toxinLevels.metals = Math.round(fluctuate(HUD.toxinLevels.metals, 15, 200, 800));
  HUD.toxinLevels.prion = Math.round(fluctuate(HUD.toxinLevels.prion, 30, 800, 2000));
  HUD.toxinLevels.mutagen = Math.round(fluctuate(HUD.toxinLevels.mutagen, 10, 20, 300));
  HUD.toxinLevels.nanodebris = Math.round(fluctuate(HUD.toxinLevels.nanodebris, 20, 200, 900));

  setTextContent('toxin-cytotoxin', HUD.toxinLevels.cytotoxin + ' ppb');
  setTextContent('toxin-metals', HUD.toxinLevels.metals + ' ppb');
  setTextContent('toxin-prion', HUD.toxinLevels.prion.toLocaleString() + ' U');
  setTextContent('toxin-mutagen', HUD.toxinLevels.mutagen + ' ppb');
  setTextContent('toxin-nanodebris', HUD.toxinLevels.nanodebris + ' cnt');

  document.querySelectorAll('.toxin-bar-fill').forEach((bar, i) => {
    const levels = [HUD.toxinLevels.cytotoxin, HUD.toxinLevels.metals, HUD.toxinLevels.prion, HUD.toxinLevels.mutagen, HUD.toxinLevels.nanodebris];
    const maxes = [1000, 1000, 2000, 500, 1000];
    if (levels[i] !== undefined) {
      bar.style.width = Math.min(100, (levels[i] / maxes[i]) * 100) + '%';
    }
  });
}

function updateNeuralData() {
  HUD.neuralStats.integrity = fluctuate(HUD.neuralStats.integrity, 1.5, 40, 80);
  HUD.neuralStats.bandwidth = fluctuate(HUD.neuralStats.bandwidth, 2, 20, 70);
  HUD.neuralStats.latency = fluctuate(HUD.neuralStats.latency, 3, 10, 50);
  HUD.neuralStats.synapseError = fluctuate(HUD.neuralStats.synapseError, 1, 3, 20);

  const intBar = document.getElementById('neural-integrity-bar');
  if (intBar) intBar.style.width = Math.round(HUD.neuralStats.integrity) + '%';
  setTextContent('neural-integrity', Math.round(HUD.neuralStats.integrity) + '%');

  setTextContent('neural-bandwidth', HUD.neuralStats.bandwidth.toFixed(1) + ' Tb/s');
  setTextContent('neural-latency', HUD.neuralStats.latency.toFixed(1) + 'ms');
  setTextContent('synapse-error', HUD.neuralStats.synapseError.toFixed(1) + '%');

  const activeChannels = Math.round(fluctuate(847, 30, 600, 1000));
  setTextContent('active-channels', activeChannels.toLocaleString() + ' / 1,204');

  const rejected = Math.round(fluctuate(14892, 500, 5000, 30000));
  setTextContent('rejected-packets', rejected.toLocaleString());

  const corticalLoad = fluctuate(78.3, 3, 50, 99).toFixed(1);
  setTextContent('cortical-load', corticalLoad + '%');
}

function updateNanoData() {
  HUD.nanoStats.active = fluctuate(HUD.nanoStats.active, 0.1, 2.0, 4.5);
  HUD.nanoStats.degraded = fluctuate(HUD.nanoStats.degraded, 0.05, 0.5, 2.0);
  HUD.nanoStats.failed = fluctuate(HUD.nanoStats.failed, 0.03, 0.1, 1.0);
  HUD.nanoStats.replication = fluctuate(HUD.nanoStats.replication, 0.2, 0.5, 5.0);
  HUD.nanoStats.fuel = fluctuate(HUD.nanoStats.fuel, 0.5, 20, 80);
  HUD.nanoStats.coherence = fluctuate(HUD.nanoStats.coherence, 1, 50, 95);

  setTextContent('nano-active', HUD.nanoStats.active.toFixed(1) + ' × 10⁹');
  setTextContent('nano-degraded', HUD.nanoStats.degraded.toFixed(1) + ' × 10⁹');
  setTextContent('nano-failed', HUD.nanoStats.failed.toFixed(1) + ' × 10⁹');
  setTextContent('nano-replication', HUD.nanoStats.replication.toFixed(1) + ' × 10⁶/hr');
  setTextContent('nano-fuel', HUD.nanoStats.fuel.toFixed(1) + '%');
  setTextContent('swarm-coherence', HUD.nanoStats.coherence.toFixed(1) + '%');
}

function updateMutationData() {
  HUD.mutationProgress = Math.min(99, HUD.mutationProgress + (Math.random() - 0.4) * 0.15);

  const fillEl = document.getElementById('mutation-fill');
  if (fillEl) fillEl.style.width = HUD.mutationProgress.toFixed(1) + '%';

  const rate = fluctuate(2.3, 0.5, 0.5, 5.0).toFixed(1);
  setTextContent('mutation-rate', '+' + rate + '%/cycle');
}

function updateMissionProgress() {
  Object.keys(HUD.missions).forEach(id => {
    const mission = HUD.missions[id];
    if (mission.progress > 0 && mission.progress < 100) {
      mission.progress = Math.min(100, mission.progress + Math.random() * 0.3);
    }

    const barEl = document.getElementById('mission-' + id + '-bar');
    const pctEl = document.getElementById('mission-' + id + '-pct');
    if (barEl) barEl.style.width = Math.round(mission.progress) + '%';
    if (pctEl && mission.progress > 0) pctEl.textContent = Math.round(mission.progress) + '%';
  });
}

function updateFooterData() {
  const biomass = fluctuate(94.7, 0.3, 90, 100).toFixed(1);
  setTextContent('biomass-value', biomass + 'kg');

  const cybernetic = fluctuate(12.3, 0.1, 10, 15).toFixed(1);
  setTextContent('cybernetic-value', cybernetic + 'kg');

  const xeno = fluctuate(8.9, 0.2, 5, 15).toFixed(1);
  setTextContent('xeno-value', xeno + 'kg');

  const integration = Math.round(fluctuate(67, 1, 50, 85));
  setTextContent('integration-value', integration + '%');

  const uplink = fluctuate(847.3, 20, 500, 1200).toFixed(1);
  setTextContent('uplink-speed', 'UPLINK: ' + uplink + ' Gb/s');

  const scanDepth = fluctuate(12.4, 2, 5, 30).toFixed(1);
  setTextContent('scan-depth', scanDepth + 'mm');

  const tissueDensity = fluctuate(1.04, 0.05, 0.8, 1.3).toFixed(2);
  setTextContent('tissue-density', tissueDensity + ' g/cm³');

  const anomalies = Math.round(fluctuate(14, 3, 5, 30));
  setTextContent('anomaly-count', anomalies + ' DETECTED');

  const cellDiv = fluctuate(2.4, 0.3, 0.5, 5.0).toFixed(1);
  setTextContent('cell-division', cellDiv + ' × 10⁶/s');
}

function updateCycleTime() {
  HUD.cycleSeconds++;
  const baseYear = 2187;
  const baseDay = 103;
  const totalDays = baseDay + Math.floor(HUD.cycleSeconds / 86400);
  const year = baseYear + Math.floor(totalDays / 365);
  const day = totalDays % 365;
  const dayStr = String(day).padStart(2, '0');
  const remainingSecs = HUD.cycleSeconds % 86400;
  const hours = Math.floor(remainingSecs / 3600) % 24;
  const minutes = Math.floor((remainingSecs % 3600) / 60);
  const seconds = remainingSecs % 60;
  const timeStr = [hours, minutes, seconds].map(v => String(v).padStart(2, '0')).join(':');
  setTextContent('cycle-time', year + '.' + dayStr + ' — ' + timeStr);
}

function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function clampIntegrity(val) {
  return Math.max(0, Math.min(100, val));
}

window.addEventListener('load', init);

window.addEventListener('resize', () => {
  const canvas = document.getElementById('heartbeat-canvas');
  if (canvas) {
    const oldBuffer = [...HUD.ecgBuffer];
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    HUD.ecgBuffer = new Array(canvas.width).fill(0);
    const copyLen = Math.min(oldBuffer.length, HUD.ecgBuffer.length);
    for (let i = 0; i < copyLen; i++) {
      HUD.ecgBuffer[i] = oldBuffer[i];
    }
    HUD.ecgWritePos = HUD.ecgWritePos % HUD.ecgBuffer.length;
  }
});
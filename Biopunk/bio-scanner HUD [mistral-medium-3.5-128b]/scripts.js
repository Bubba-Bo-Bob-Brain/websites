// ===== DOM Elements =====
const elements = {
  // Vital Signs
  bpmValue: document.querySelector('.bpm-value'),
  oxygenValue: document.querySelector('.oxygen-value'),
  heartbeatIcon: document.querySelector('.heart-icon'),
  heartbeatSound: document.getElementById('heartbeat-sound'),

  // Organ Status
  organCards: document.querySelectorAll('.organ-card'),
  organStatusBars: document.querySelectorAll('.status-fill'),
  organValues: document.querySelectorAll('.organ-value'),

  // Mutation Tracker
  mutationPercent: document.querySelector('.mutation-percent span'),
  mutationNodes: document.querySelectorAll('.mutation-nodes .node'),

  // Nanomachine Visualizer
  swarmParticles: document.querySelectorAll('.swarm-particle'),
  swarmTarget: document.querySelector('.swarm-target'),
  deploymentStats: document.querySelectorAll('.deployment-stats .stat-value'),

  // Toxin Meters
  toxinMeters: document.querySelectorAll('.meter-fill'),
  toxinValues: document.querySelectorAll('.meter-value'),

  // Neural Link
  waveformPath: document.querySelector('.waveform-path'),
  linkStats: document.querySelectorAll('.link-stats .stat-value'),

  // Gene-Splice Matrix
  matrixCells: document.querySelectorAll('.matrix-cell'),
  compatibilityScore: document.querySelector('.compatibility-score span'),

  // Global HUD
  hudContainer: document.querySelector('.hud-container')
};

// ===== State Management =====
const state = {
  bpm: 124,
  oxygen: 98,
  organs: {
    heart: { value: 92, trend: 0.1 },
    lungs: { value: 85, trend: -0.2 },
    liver: { value: 78, trend: 0.3 },
    neural: { value: 65, trend: -0.15 }
  },
  mutationRate: 23,
  nanomachines: {
    active: 4287,
    deployed: 12450,
    target: 'LIVER (TOXIN SCRUB)'
  },
  toxins: {
    neurotoxin: 35,
    cybertoxin: 62,
    radiation: 18
  },
  neuralLink: {
    signalStrength: 65,
    latency: 12,
    errorRate: 2.1
  },
  geneSplice: {
    compatibility: 78,
    cells: Array.from({ length: 16 }, () => Math.random() > 0.5)
  },
  heartbeatInterval: null,
  breathInterval: null,
  mutationInterval: null,
  nanomachineInterval: null,
  toxinInterval: null,
  neuralInterval: null,
  geneSpliceInterval: null
};

// ===== Utility Functions =====
// Clamp value between min and max
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Random float between min and max
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// Random integer between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ===== Animation: Heartbeat =====
const updateHeartbeat = () => {
  // Simulate BPM fluctuation (90-140)
  state.bpm = clamp(state.bpm + randomFloat(-2, 2), 90, 140);
  elements.bpmValue.textContent = Math.round(state.bpm);

  // Sync heartbeat icon pulse
  elements.heartbeatIcon.style.animationDuration = `${60 / state.bpm}s`;

  // Sync oxygen with BPM (inverse relationship)
  state.oxygen = clamp(state.oxygen + randomFloat(-1, 1), 85, 100);
  elements.oxygenValue.textContent = `${Math.round(state.oxygen)}%`;

  // Play heartbeat sound if enabled
  if (elements.heartbeatSound) {
    elements.heartbeatSound.volume = 0.1;
    elements.heartbeatSound.play().catch(() => {});
  }
};

// ===== Animation: Breathing Lungs =====
const updateBreathing = () => {
  const lungsCard = document.querySelector('.organ-card.lungs');
  const breathElement = lungsCard.querySelector('.organ-breath');

  // Simulate breathing cycle
  const scale = 1 + Math.sin(Date.now() / 1000) * 0.05;
  lungsCard.style.transform = `scale(${scale})`;
  breathElement.style.opacity = 0.3 + Math.sin(Date.now() / 1000) * 0.3;
};

// ===== Animation: Organ Status =====
const updateOrganStatus = () => {
  elements.organCards.forEach(card => {
    const organ = card.dataset.organ;
    const statusBar = card.querySelector('.status-fill');
    const valueElement = card.querySelector('.organ-value');

    // Update value with trend
    state.organs[organ].value = clamp(
      state.organs[organ].value + randomFloat(-0.5, 0.5) + state.organs[organ].trend,
      0,
      100
    );

    // Update UI
    valueElement.textContent = `${Math.round(state.organs[organ].value)}%`;
    statusBar.style.width = `${state.organs[organ].value}%`;

    // Change trend direction randomly
    if (Math.random() < 0.05) {
      state.organs[organ].trend = randomFloat(-0.3, 0.3);
    }
  });
};

// ===== Animation: Mutation Progression =====
const updateMutation = () => {
  // Simulate mutation rate change
  state.mutationRate = clamp(state.mutationRate + randomFloat(-1, 1), 0, 100);
  elements.mutationPercent.textContent = `${Math.round(state.mutationRate)}%`;

  // Randomly corrupt/heal nodes
  elements.mutationNodes.forEach(node => {
    if (Math.random() < 0.05) {
      node.classList.toggle('corrupted');
    }
  });

  // Update DNA helix color based on mutation rate
  const helixStrands = document.querySelectorAll('.helix-strand');
  const mutationRatio = state.mutationRate / 100;
  helixStrands.forEach(strand => {
    strand.style.background = `linear-gradient(
      to bottom,
      ${interpolateColor('#0ff0a3', '#ff2a6d', mutationRatio)},
      ${interpolateColor('#00d4ff', '#8a2be2', mutationRatio)}
    )`;
  });
};

// Color interpolation helper
const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};

// Hex to RGB converter
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// ===== Animation: Nanomachine Swarm =====
const updateNanomachines = () => {
  // Update particle positions
  elements.swarmParticles.forEach(particle => {
    const x = parseFloat(particle.style.getPropertyValue('--x')) || 50;
    const y = parseFloat(particle.style.getPropertyValue('--y')) || 50;

    // Move particles toward target (50%, 50%)
    const targetX = 50;
    const targetY = 50;
    const speed = 0.5;

    const newX = x + (targetX - x) * speed * 0.1;
    const newY = y + (targetY - y) * speed * 0.1;

    particle.style.setProperty('--x', `${newX}%`);
    particle.style.setProperty('--y', `${newY}%`);

    // Randomly reset particles to simulate new deployment
    if (Math.random() < 0.02) {
      particle.style.setProperty('--x', `${randomInt(0, 100)}%`);
      particle.style.setProperty('--y', `${randomInt(0, 100)}%`);
    }
  });

  // Update stats
  state.nanomachines.active = clamp(state.nanomachines.active + randomInt(-100, 200), 0, 20000);
  state.nanomachines.deployed = clamp(state.nanomachines.deployed + randomInt(0, 50), 0, 50000);

  elements.deploymentStats[0].textContent = state.nanomachines.active.toLocaleString();
  elements.deploymentStats[1].textContent = state.nanomachines.deployed.toLocaleString();

  // Randomly change target
  if (Math.random() < 0.01) {
    const targets = [
      'LIVER (TOXIN SCRUB)',
      'NEURAL LINK (REPAIR)',
      'HEART (STABILIZATION)',
      'LUNGS (OXYGEN ENHANCEMENT)'
    ];
    state.nanomachines.target = targets[randomInt(0, targets.length - 1)];
    elements.deploymentStats[2].textContent = state.nanomachines.target;
  }
};

// ===== Animation: Toxin Levels =====
const updateToxins = () => {
  const toxinTypes = ['neurotoxin', 'cybertoxin', 'radiation'];

  toxinTypes.forEach((type, index) => {
    // Update toxin level
    state.toxins[type] = clamp(state.toxins[type] + randomFloat(-2, 2), 0, 100);
    elements.toxinMeters[index].style.height = `${state.toxins[type]}%`;
    elements.toxinValues[index].textContent = `${Math.round(state.toxins[type])}%`;
  });
};

// ===== Animation: Neural Link =====
const updateNeuralLink = () => {
  // Update neural stats
  state.neuralLink.signalStrength = clamp(
    state.neuralLink.signalStrength + randomFloat(-1, 1),
    0,
    100
  );
  state.neuralLink.latency = clamp(
    state.neuralLink.latency + randomFloat(-1, 1),
    0,
    50
  );
  state.neuralLink.errorRate = clamp(
    state.neuralLink.errorRate + randomFloat(-0.2, 0.2),
    0,
    10
  );

  elements.linkStats[0].textContent = `${Math.round(state.neuralLink.signalStrength)}%`;
  elements.linkStats[1].textContent = `${Math.round(state.neuralLink.latency)}ms`;
  elements.linkStats[2].textContent = `${state.neuralLink.errorRate.toFixed(1)}%`;

  // Distort waveform based on error rate
  const distortion = state.neuralLink.errorRate / 10;
  const newPath = generateWaveformPath(distortion);
  elements.waveformPath.setAttribute('d', newPath);
};

// Generate SVG path for EEG waveform with distortion
const generateWaveformPath = (distortion) => {
  const points = [];
  const segments = 20;
  const width = 300;
  const height = 100;
  const centerY = height / 2;

  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const baseY = centerY + Math.sin((i / segments) * Math.PI * 4) * 20;
    const distortedY = baseY + (Math.random() * distortion * 40 - distortion * 20);
    points.push(`${x},${clamp(distortedY, 0, height)}`);
  }

  return `M${points[0]} Q${points.slice(1, -1).join(' ')} ${points[points.length - 1]}`;
};

// ===== Animation: Gene-Splice Matrix =====
const updateGeneSplice = () => {
  // Randomly toggle cell compatibility
  elements.matrixCells.forEach((cell, index) => {
    if (Math.random() < 0.05) {
      state.geneSplice.cells[index] = !state.geneSplice.cells[index];
      cell.dataset.compatible = state.geneSplice.cells[index];
    }
  });

  // Update compatibility score
  const compatibleCount = state.geneSplice.cells.filter(c => c).length;
  state.geneSplice.compatibility = Math.round((compatibleCount / state.geneSplice.cells.length) * 100);
  elements.compatibilityScore.textContent = `${state.geneSplice.compatibility}%`;
};

// ===== Event Listeners =====
// Hover effects for organ cards
elements.organCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px) scale(1.02)';
    card.style.boxShadow = '0 10px 30px rgba(0, 255, 163, 0.3)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

// Click to toggle heartbeat sound
elements.heartbeatIcon.addEventListener('click', () => {
  if (elements.heartbeatSound.paused) {
    elements.heartbeatSound.play().catch(() => {});
  } else {
    elements.heartbeatSound.pause();
  }
});

// ===== Initialization =====
const init = () => {
  // Set initial values from state
  elements.bpmValue.textContent = state.bpm;
  elements.oxygenValue.textContent = `${state.oxygen}%`;
  elements.mutationPercent.textContent = `${state.mutationRate}%`;
  elements.compatibilityScore.textContent = `${state.geneSplice.compatibility}%`;

  elements.organValues.forEach((el, index) => {
    const organ = elements.organCards[index].dataset.organ;
    el.textContent = `${state.organs[organ].value}%`;
  });

  elements.toxinValues.forEach((el, index) => {
    el.textContent = `${state.toxins[Object.keys(state.toxins)[index]]}%`;
  });

  elements.linkStats.forEach((el, index) => {
    el.textContent = index === 0
      ? `${state.neuralLink.signalStrength}%`
      : index === 1
        ? `${state.neuralLink.latency}ms`
        : `${state.neuralLink.errorRate.toFixed(1)}%`;
  });

  elements.deploymentStats[0].textContent = state.nanomachines.active.toLocaleString();
  elements.deploymentStats[1].textContent = state.nanomachines.deployed.toLocaleString();
  elements.deploymentStats[2].textContent = state.nanomachines.target;

  // Initialize intervals
  state.heartbeatInterval = setInterval(updateHeartbeat, 1000);
  state.breathInterval = setInterval(updateBreathing, 50);
  state.mutationInterval = setInterval(updateMutation, 2000);
  state.nanomachineInterval = setInterval(updateNanomachines, 100);
  state.toxinInterval = setInterval(updateToxins, 3000);
  state.neuralInterval = setInterval(updateNeuralLink, 1500);
  state.geneSpliceInterval = setInterval(updateGeneSplice, 800);

  // Initial waveform path
  elements.waveformPath.setAttribute('d', generateWaveformPath(0));
};

// ===== Cleanup =====
window.addEventListener('beforeunload', () => {
  clearInterval(state.heartbeatInterval);
  clearInterval(state.breathInterval);
  clearInterval(state.mutationInterval);
  clearInterval(state.nanomachineInterval);
  clearInterval(state.toxinInterval);
  clearInterval(state.neuralInterval);
  clearInterval(state.geneSpliceInterval);
});

// ===== Start the HUD =====
init();
// ===== DOM Elements =====
const sonarRing = document.getElementById('sonar-ring');
const sonarPing = document.getElementById('sonar-ping');
const sonarTargets = document.getElementById('sonar-targets');
const depthNeedle = document.getElementById('depth-needle');
const depthValue = document.getElementById('depth-value');
const hullStressFill = document.getElementById('hull-stress-fill');
const hullStressBar = document.getElementById('hull-stress-bar');
const klaxonLight = document.getElementById('klaxon-light');
const klaxonText = document.getElementById('klaxon-text');
const klaxonBar = document.getElementById('klaxon-bar');
const ambientOverlay = document.getElementById('ambient-overlay');
const timeDisplay = document.getElementById('time-display');
const particlesContainer = document.getElementById('particles');
const faunaGrid = document.getElementById('fauna-grid');
const speciesCount = document.getElementById('species-count');
const alertsContainer = document.getElementById('alerts-container');

// ===== Configuration =====
const config = {
  maxDepth: 10000, // meters
  depthIncrement: 0.5, // meters per frame
  sonarPingInterval: 3000, // ms
  particleSpawnInterval: 500, // ms
  particleCount: 20,
  faunaUpdateInterval: 5000, // ms
  hullStressThresholds: {
    safe: 0.7,
    warning: 0.85,
    danger: 0.95
  }
};

// ===== State =====
let state = {
  depth: 0,
  isDescending: true,
  sonarActive: false,
  lastPingTime: 0,
  particles: [],
  fauna: [],
  hullStress: 0,
  alerts: []
};

// ===== Utility Functions =====
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function updateTimeDisplay() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function addAlert(message, type = 'info') {
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  alertsContainer.appendChild(alertElement);

  // Remove after 5 seconds
  setTimeout(() => {
    alertElement.remove();
  }, 5000);
}

// ===== Depth Simulation =====
function updateDepth() {
  if (state.isDescending) {
    state.depth += config.depthIncrement;
    if (state.depth >= config.maxDepth) {
      state.isDescending = false;
      addAlert('MAX DEPTH REACHED', 'danger');
    }
  } else {
    state.depth -= config.depthIncrement;
    if (state.depth <= 0) {
      state.isDescending = true;
      addAlert('SURFACING', 'info');
    }
  }

  // Update gauge needle (0-100% = 0-10000m)
  const depthPercentage = (state.depth / config.maxDepth) * 100;
  const needleRotation = (depthPercentage * 1.8) - 90; // -90° to +90°
  depthNeedle.style.transform = `rotate(${needleRotation}deg)`;
  depthValue.textContent = Math.round(state.depth);

  // Update hull stress (non-linear scaling)
  state.hullStress = Math.min(1, Math.pow(state.depth / config.maxDepth, 1.5));
  hullStressFill.style.width = `${state.hullStress * 100}%`;

  // Update ambient lighting (blue -> purple)
  const lightIntensity = Math.min(0.3, state.depth / 30000);
  const blueValue = Math.max(0, 255 - (state.depth / 40));
  const purpleValue = Math.min(255, state.depth / 40);
  ambientOverlay.style.background = `rgba(${purpleValue}, ${blueValue}, ${blueValue + 50}, ${lightIntensity})`;

  // Update klaxon based on hull stress
  updateKlaxon();
}

function updateKlaxon() {
  klaxonLight.classList.remove('warning', 'danger');
  if (state.hullStress >= config.hullStressThresholds.danger) {
    klaxonLight.classList.add('danger');
    klaxonText.textContent = 'HULL BREACH IMMINENT';
    klaxonBar.style.background = 'rgba(255, 0, 0, 0.3)';
    if (!state.alerts.includes('hull-danger')) {
      addAlert('CRITICAL HULL STRESS', 'danger');
      state.alerts.push('hull-danger');
    }
  } else if (state.hullStress >= config.hullStressThresholds.warning) {
    klaxonLight.classList.add('warning');
    klaxonText.textContent = 'HULL STRESS HIGH';
    klaxonBar.style.background = 'rgba(255, 100, 0, 0.3)';
    if (state.alerts.includes('hull-danger')) {
      state.alerts = state.alerts.filter(alert => alert !== 'hull-danger');
    }
    if (!state.alerts.includes('hull-warning')) {
      addAlert('HULL STRESS ELEVATED', 'warning');
      state.alerts.push('hull-warning');
    }
  } else {
    klaxonText.textContent = 'SYSTEM NOMINAL';
    klaxonBar.style.background = 'rgba(0, 212, 255, 0.1)';
    state.alerts = state.alerts.filter(alert => !alert.startsWith('hull-'));
  }
}

// ===== Sonar System =====
function triggerSonarPing() {
  state.sonarActive = true;
  state.lastPingTime = Date.now();

  // Reset sonar ring animation
  sonarRing.style.animation = 'none';
  void sonarRing.offsetWidth; // Trigger reflow
  sonarRing.style.animation = 'sonarRingPulse 4s infinite ease-out';

  // Reset sonar ping animation
  sonarPing.style.animation = 'none';
  void sonarPing.offsetWidth;
  sonarPing.style.animation = 'sonarPing 2s infinite ease-out';

  // Clear previous targets
  sonarTargets.innerHTML = '';

  // Generate random targets (1-5)
  const targetCount = Math.floor(randomInRange(1, 6));
  for (let i = 0; i < targetCount; i++) {
    const target = document.createElement('div');
    target.className = 'sonar-target';

    // Random position (polar coordinates)
    const angle = randomInRange(0, 360);
    const distance = randomInRange(0.2, 0.9); // 20%-90% of sonar radius
    const x = 50 + Math.cos(degreesToRadians(angle)) * distance * 50;
    const y = 50 + Math.sin(degreesToRadians(angle)) * distance * 50;

    target.style.left = `${x}%`;
    target.style.top = `${y}%`;
    target.style.transform = `translate(-50%, -50%)`;

    // Random size and color
    const size = randomInRange(0.3, 0.8);
    target.style.width = `${size}rem`;
    target.style.height = `${size}rem`;

    // Random color (bioluminescent hues)
    const hue = randomInRange(180, 240);
    target.style.background = `hsl(${hue}, 100%, 50%)`;
    target.style.boxShadow = `0 0 10px hsl(${hue}, 100%, 70%)`;

    sonarTargets.appendChild(target);

    // Remove target after animation
    setTimeout(() => {
      target.remove();
    }, 4000);
  }

  // Schedule next ping
  setTimeout(triggerSonarPing, config.sonarPingInterval);
}

// ===== Bioluminescent Particles =====
function createParticle() {
  if (state.particles.length >= config.particleCount) return;

  const particle = document.createElement('div');
  particle.className = 'particle';

  // Random position
  particle.style.left = `${randomInRange(0, 100)}%`;
  particle.style.top = `${randomInRange(0, 100)}%`;

  // Random size
  const size = randomInRange(0.3, 0.8);
  particle.style.width = `${size}rem`;
  particle.style.height = `${size}rem`;

  // Random color (blue-green hues)
  const hue = randomInRange(180, 220);
  particle.style.background = `hsl(${hue}, 100%, 60%)`;
  particle.style.boxShadow = `0 0 ${randomInRange(5, 15)}px hsl(${hue}, 100%, 80%)`;

  // Random animation duration
  particle.style.animationDuration = `${randomInRange(5, 15)}s`;
  particle.style.animationDelay = `${randomInRange(0, 5)}s`;

  particlesContainer.appendChild(particle);

  // Store particle reference
  state.particles.push(particle);

  // Remove particle after lifetime
  setTimeout(() => {
    particle.remove();
    state.particles = state.particles.filter(p => p !== particle);
  }, 15000);
}

function updateParticles() {
  // Spawn new particles periodically
  setInterval(createParticle, config.particleSpawnInterval);

  // Initial burst of particles
  for (let i = 0; i < 5; i++) {
    setTimeout(createParticle, i * 200);
  }
}

// ===== Fauna Tracking =====
function updateFaunaGrid() {
  // Clear previous fauna
  faunaGrid.innerHTML = '';

  // Generate random fauna (3-8 species)
  const faunaCount = Math.floor(randomInRange(3, 9));
  state.fauna = [];

  for (let i = 0; i < faunaCount; i++) {
    const faunaTypes = [
      'Anglerfish',
      'Giant Squid',
      'Viperfish',
      'Jellyfish',
      'Lanternfish',
      'Hatchetfish',
      'Amphipod',
      'Shrimp'
    ];
    const name = faunaTypes[Math.floor(randomInRange(0, faunaTypes.length))];
    const depth = Math.round(randomInRange(1000, config.maxDepth));
    const size = randomInRange(0.5, 5).toFixed(1);

    state.fauna.push({ name, depth, size });

    const faunaElement = document.createElement('div');
    faunaElement.className = 'fauna-item';
    faunaElement.innerHTML = `
      <span class="fauna-name">${name}</span>
      <span class="fauna-depth">${depth}m</span>
      <span class="fauna-size">${size}m</span>
    `;
    faunaGrid.appendChild(faunaElement);
  }

  speciesCount.textContent = faunaCount;
}

// ===== Initialization =====
function init() {
  // Start depth simulation
  setInterval(updateDepth, 50);

  // Start time display
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 1000);

  // Start sonar system
  triggerSonarPing();

  // Start particle system
  updateParticles();

  // Start fauna tracking
  updateFaunaGrid();
  setInterval(updateFaunaGrid, config.faunaUpdateInterval);

  // Initial klaxon state
  updateKlaxon();
}

// ===== Run on Load =====
window.addEventListener('load', init);
// ===== DOM ELEMENTS =====
// Header
const speedDisplay = document.getElementById('speed');
const headingDisplay = document.getElementById('heading');
const altitudeDisplay = document.getElementById('altitude');

// Navigation
const throttleSlider = document.getElementById('throttle');
const headingSlider = document.getElementById('heading-slider');
const engageWarpBtn = document.getElementById('engage-warp');
const radarCanvas = document.getElementById('radarCanvas');
const radarSweep = document.querySelector('.radar-sweep');

// Shields
const shieldPowerSlider = document.getElementById('shield-power');
const shieldEqualizeBtn = document.getElementById('shield-equalize');
const shieldMeter = document.getElementById('shieldMeter');

// Weapons
const weaponPowerSlider = document.getElementById('weapon-power');
const fireWeaponBtn = document.getElementById('fire-weapon');
const targetReticle = document.getElementById('targetReticle');
const targetDistance = document.getElementById('targetDistance');
const targetLock = document.getElementById('targetLock');

// Communications
const commsFrequencySlider = document.getElementById('comms-frequency');
const hailBtn = document.getElementById('hail');
const commsCanvas = document.getElementById('commsCanvas');
const commsText = document.getElementById('commsText');

// Audio
const buttonSound = document.getElementById('buttonSound');
const shieldSound = document.getElementById('shieldSound');
const warpSound = document.getElementById('warpSound');

// Background
const stars = document.getElementById('stars');
const gridFloor = document.querySelector('.grid-floor');

// ===== SHIP STATE =====
let shipState = {
  speed: 32,
  heading: 247,
  altitude: 450,
  shieldPower: 80,
  weaponPower: 50,
  targetLocked: false,
  warpEngaged: false,
};

// ===== INITIALIZE =====
function init() {
  setupCanvas();
  updateShipState();
  setupEventListeners();
  startAnimations();
}

// ===== CANVAS SETUP =====
function setupCanvas() {
  // Radar Canvas
  const radarCtx = radarCanvas.getContext('2d');
  radarCanvas.width = 300;
  radarCanvas.height = 200;

  // Comms Canvas
  const commsCtx = commsCanvas.getContext('2d');
  commsCanvas.width = 300;
  commsCanvas.height = 150;
  animateCommsDisplay(commsCtx);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Sliders
  throttleSlider.addEventListener('input', () => {
    shipState.speed = parseInt(throttleSlider.value);
    updateShipState();
  });

  headingSlider.addEventListener('input', () => {
    shipState.heading = parseInt(headingSlider.value);
    updateShipState();
    radarSweep.style.transform = `rotate(${shipState.heading}deg)`;
  });

  shieldPowerSlider.addEventListener('input', () => {
    shipState.shieldPower = parseInt(shieldPowerSlider.value);
    updateShipState();
    shieldSound.currentTime = 0;
    shieldSound.play();
  });

  weaponPowerSlider.addEventListener('input', () => {
    shipState.weaponPower = parseInt(weaponPowerSlider.value);
    targetReticle.style.boxShadow = `0 0 ${shipState.weaponPower / 2}px var(--neon-pink)`;
  });

  commsFrequencySlider.addEventListener('input', () => {
    // Update comms display animation
  });

  // Buttons
  engageWarpBtn.addEventListener('click', () => {
    shipState.warpEngaged = !shipState.warpEngaged;
    if (shipState.warpEngaged) {
      engageWarpBtn.textContent = 'DISENGAGE WARP';
      warpSound.play();
      document.body.style.background = 'radial-gradient(ellipse at center, #0a0412 0%, #000033 100%)';
    } else {
      engageWarpBtn.textContent = 'ENGAGE WARP';
      warpSound.pause();
      warpSound.currentTime = 0;
      document.body.style.background = '';
    }
    playButtonSound();
  });

  shieldEqualizeBtn.addEventListener('click', () => {
    shieldPowerSlider.value = 50;
    shipState.shieldPower = 50;
    updateShipState();
    playButtonSound();
  });

  fireWeaponBtn.addEventListener('click', () => {
    shipState.targetLocked = !shipState.targetLocked;
    targetLock.textContent = shipState.targetLocked ? 'LOCK: ON' : 'LOCK: OFF';
    targetReticle.style.animation = shipState.targetLocked
      ? 'reticleLock 1s ease-in-out'
      : 'reticleScan 3s linear infinite';
    playButtonSound();
  });

  hailBtn.addEventListener('click', () => {
    commsText.textContent = 'OUTGOING TRANSMISSION...';
    setTimeout(() => {
      commsText.textContent = 'INCOMING: "Greetings, U.S.S. Neon Horizon!"';
    }, 2000);
    playButtonSound();
  });

  // Parallax (Mouse Move)
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    stars.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
    gridFloor.style.transform = `translateX(${x * 50}px) translateZ(-200px) scale(2)`;
  });
}

// ===== UPDATE SHIP STATE =====
function updateShipState() {
  speedDisplay.textContent = `SPEED: WARP ${shipState.speed / 10}`;
  headingDisplay.textContent = `HDG: ${shipState.heading}°`;
  shieldMeter.style.setProperty('--shield-value', `${shipState.shieldPower}%`);
}

// ===== ANIMATIONS =====
function startAnimations() {
  // Radar Sweep (already handled by CSS, but JS can add dynamic elements)
  // Shield Pulse (handled by CSS)
  // Target Reticle (handled by CSS)
}

// Comms Display (Canvas)
function animateCommsDisplay(ctx) {
  let particles = [];
  const particleCount = 50;

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * commsCanvas.width,
      y: Math.random() * commsCanvas.height,
      speed: Math.random() * 2 + 1,
      size: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, commsCanvas.width, commsCanvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.x += p.speed;
      if (p.x > commsCanvas.width) p.x = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== SOUND EFFECTS =====
function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play();
}

// ===== INITIALIZE =====
init();
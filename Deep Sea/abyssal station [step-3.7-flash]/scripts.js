// Inject dynamic styles for custom animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  @keyframes rippleExpand {
    0% { width: 20px; height: 20px; opacity: 1; border-width: 2px; }
    100% { width: 400px; height: 400px; opacity: 0; border-width: 0px; }
  }
  .shake { animation: screenShake 0.5s ease-in-out; }
  @keyframes screenShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
`;
document.head.appendChild(dynamicStyles);

document.addEventListener('DOMContentLoaded', () => {
  initBioluminescentParticles();
  initDepthGauge();
  initPressureMonitor();
  initSonar();
  initHullMonitor();
  initCurrentFlow();
  initAlertSystem();
  startMissionTimer();
  initFaunaTracker();
});

function initBioluminescentParticles() {
  const particleLayer = document.querySelector('.ui-particle-layer');
  const particleCount = 40;
  const colors = ['#00f0ff', '#00d4aa', '#39ff14'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('ui-particle');
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 6 + 6}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;
    particleLayer.appendChild(particle);
  }
}

function initDepthGauge() {
  const depthValue = document.querySelector('.depth-value');
  const depthTrend = document.querySelector('.depth-trend');
  let currentDepth = 2847;
  let trend = 12;

  setInterval(() => {
    if (Math.random() > 0.9) {
      trend = Math.random() * 15 + 5;
    }
    currentDepth += trend / 60;
    depthValue.textContent = Math.round(currentDepth);
    depthValue.dataset.currentDepth = currentDepth;

    if (currentDepth < 2000) {
      depthValue.style.color = '#00f0ff';
      depthValue.style.textShadow = '0 0 30px rgba(0, 240, 255, 0.3)';
    } else if (currentDepth < 3000) {
      depthValue.style.color = '#00d4aa';
      depthValue.style.textShadow = '0 0 30px rgba(0, 212, 170, 0.3)';
    } else if (currentDepth < 3500) {
      depthValue.style.color = '#ffaa00';
      depthValue.style.textShadow = '0 0 30px rgba(255, 170, 0, 0.3)';
    } else {
      depthValue.style.color = '#ff2244';
      depthValue.style.textShadow = '0 0 30px rgba(255, 34, 68, 0.3)';
    }

    const trendDirection = trend >= 10 ? '▼' : '▲';
    depthTrend.textContent = `${trendDirection} ${trend.toFixed(1)}m/min`;
  }, 1000);
}

function initPressureMonitor() {
  const pressureValue = document.querySelector('.pressure-value');
  const pressureCanvas = document.querySelector('.pressure-graph');
  const ctx = pressureCanvas.getContext('2d');
  const klaxonBar = document.getElementById('pressure-klaxon');
  let currentPressure = 287.4;
  const pressureHistory = new Array(30).fill(287.4);

  const dpr = window.devicePixelRatio || 1;
  const rect = pressureCanvas.getBoundingClientRect();
  pressureCanvas.width = rect.width * dpr;
  pressureCanvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  function updatePressure() {
    const depth = parseFloat(document.querySelector('.depth-value').dataset.currentDepth);
    const basePressure = depth / 10;
    const fluctuation = (Math.random() - 0.5) * 2;
    currentPressure = basePressure + fluctuation;
    pressureValue.textContent = currentPressure.toFixed(1);
    pressureValue.dataset.currentPressure = currentPressure;

    pressureHistory.push(currentPressure);
    if (pressureHistory.length > 30) pressureHistory.shift();

    drawPressureGraph(ctx, pressureHistory, rect.width, rect.height);

    if (currentPressure > 320) {
      klaxonBar.classList.add('active');
      document.querySelector('.dashboard').classList.add('shake');
      setTimeout(() => document.querySelector('.dashboard').classList.remove('shake'), 500);
      if (!window.pressureWarningInterval) {
        window.pressureWarningInterval = setInterval(() => {
          addAlert('warning', `PRESSURE CRITICAL: ${currentPressure.toFixed(1)} ATM - EVACUATE TO SAFER DEPTH IMMEDIATELY`);
        }, 5000);
      }
    } else {
      klaxonBar.classList.remove('active');
      if (window.pressureWarningInterval) {
        clearInterval(window.pressureWarningInterval);
        window.pressureWarningInterval = null;
      }
    }
  }

  function drawPressureGraph(ctx, data, width, height) {
    ctx.clearRect(0, 0, width, height);
    const padding = 10;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const maxVal = Math.max(...data, 350);
    const minVal = Math.min(...data, 250);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    data.forEach((val, index) => {
      const x = padding + (graphWidth / (data.length - 1)) * index;
      const y = padding + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  setInterval(updatePressure, 2000);
  updatePressure();
}

function initSonar() {
  const pingBtn = document.getElementById('manual-ping');
  const sonarDisplay = document.querySelector('.sonar-display');

  pingBtn.addEventListener('click', () => {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.border = '2px solid rgba(0, 240, 255, 0.8)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'rippleExpand 2s ease-out forwards';
    ripple.style.pointerEvents = 'none';
    sonarDisplay.appendChild(ripple);
    setTimeout(() => ripple.remove(), 2000);

    const tempBlip = document.createElement('div');
    tempBlip.classList.add('sonar-blip', 'unknown');
    const angle = Math.random() * 360;
    const distance = Math.random() * 40 + 10;
    tempBlip.style.setProperty('--angle', `${angle}deg`);
    tempBlip.style.setProperty('--distance', `${distance}%`);
    sonarDisplay.appendChild(tempBlip);
    setTimeout(() => tempBlip.remove(), 5000);

    addAlert('info', 'Manual sonar ping emitted, new unknown contact detected');
  });

  setInterval(() => {
    const blips = document.querySelectorAll('.sonar-blip');
    blips.forEach(blip => {
      if (blip.style.animationName === 'rippleExpand') return;
      const currentDistance = parseFloat(blip.style.getPropertyValue('--distance'));
      const newDistance = currentDistance + (Math.random() - 0.5) * 5;
      blip.style.setProperty('--distance', `${Math.max(10, Math.min(70, newDistance))}%`);
    });
  }, 3000);
}

function initHullMonitor() {
  const hullZones = document.querySelectorAll('.hull-zone');
  const stressValue = document.querySelector('.stress-value');

  setInterval(() => {
    hullZones.forEach(zone => {
      let currentIntegrity = parseInt(zone.dataset.integrity);
      currentIntegrity += Math.random() > 0.5 ? 1 : -1;
      currentIntegrity = Math.max(0, Math.min(100, currentIntegrity));
      zone.dataset.integrity = currentIntegrity;
      zone.querySelector('.zone-value').textContent = `${currentIntegrity}%`;
      zone.querySelector('.zone-fill').style.width = `${currentIntegrity}%`;

      if (currentIntegrity < 70) {
        zone.querySelector('.zone-fill').style.background = 'linear-gradient(90deg, #ff2244, #ff6600)';
        zone.querySelector('.zone-fill').style.boxShadow = '0 0 10px #ff2244';
      } else if (currentIntegrity < 85) {
        zone.querySelector('.zone-fill').style.background = 'linear-gradient(90deg, #ffaa00, #ff6600)';
        zone.querySelector('.zone-fill').style.boxShadow = '0 0 10px #ffaa00';
      } else {
        zone.querySelector('.zone-fill').style.background = 'linear-gradient(90deg, #00d4aa, #00f0ff)';
        zone.querySelector('.zone-fill').style.boxShadow = '0 0 10px #00f0ff';
      }
    });

    const baseStress = 140 + (parseFloat(document.querySelector('.depth-value').dataset.currentDepth) - 2847) * 0.01;
    const stressFluctuation = (Math.random() - 0.5) * 5;
    const totalStress = baseStress + stressFluctuation;
    stressValue.textContent = `${totalStress.toFixed(1)} MPa`;

    const criticalZones = Array.from(hullZones).filter(z => parseInt(z.dataset.integrity) < 70);
    if (criticalZones.length > 0) {
      addAlert('warning', `Hull integrity critical in ${criticalZones.map(z => z.dataset.zone.toUpperCase()).join(', ')} zones`);
    }
  }, 5000);
}

function initCurrentFlow() {
  const canvas = document.querySelector('.current-canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const flowLines = [];
  const lineCount = 6;
  for (let i = 0; i < lineCount; i++) {
    flowLines.push({
      y: (rect.height / (lineCount + 1)) * (i + 1),
      amplitude: Math.random() * 10 + 5,
      frequency: Math.random() * 0.02 + 0.01,
      speed: Math.random() * 0.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.3 + 0.1
    });
  }

  function animateCurrent() {
    ctx.clearRect(0, 0, rect.width, rect.height);

    flowLines.forEach(line => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 240, 255, ${line.opacity})`;
      ctx.lineWidth = 1.5;

      for (let x = 0; x < rect.width; x++) {
        const y = line.y + Math.sin(x * line.frequency + line.phase) * line.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      line.phase -= line.speed * 0.05;
    });

    requestAnimationFrame(animateCurrent);
  }

  animateCurrent();
}

function initAlertSystem() {
  setInterval(() => {
    const alertTypes = [
      { type: 'info', message: 'Bioluminescent fauna sighting updated' },
      { type: 'info', message: 'Sonar sweep completed, no new contacts' },
      { type: 'normal', message: 'All systems operating within normal parameters' },
      { type: 'info', message: 'Current flow velocity stable' }
    ];
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    addAlert(randomAlert.type, randomAlert.message);
  }, 15000);

  setInterval(() => {
    const fauna = ['Anglerfish', 'Vampire Squid', 'Giant Isopod', 'Atolla Jellyfish'];
    const randomFauna = fauna[Math.floor(Math.random() * fauna.length)];
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    const distance = Math.floor(Math.random() * 500) + 50;
    addAlert('info', `Bioluminescent ${randomFauna} detected ${distance}m ${randomDir}`);
  }, 20000);
}

function addAlert(type, message) {
  const alertLog = document.getElementById('alert-log');
  const alertEntry = document.createElement('div');
  alertEntry.classList.add('alert-entry', type);

  const alertTime = document.querySelector('.timer-value').textContent;
  alertEntry.innerHTML = `
    <span class="alert-time">${alertTime}</span>
    <span class="alert-message">${message}</span>
  `;

  alertLog.insertBefore(alertEntry, alertLog.firstChild);

  if (alertLog.children.length > 10) {
    alertLog.removeChild(alertLog.lastChild);
  }
}

function startMissionTimer() {
  const timerValue = document.querySelector('.timer-value');
  let elapsed = 127 * 3600 + 42 * 60 + 19;

  setInterval(() => {
    elapsed++;
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    timerValue.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function initFaunaTracker() {
  const faunaItems = document.querySelectorAll('.fauna-item');

  setInterval(() => {
    const randomFauna = faunaItems[Math.floor(Math.random() * faunaItems.length)];
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    const distance = Math.floor(Math.random() * 500) + 50;
    const meta = randomFauna.querySelector('.fauna-meta');
    const newText = meta.textContent.replace(/Last Seen: .+/, `Last Seen: ${distance}m ${randomDir}`);
    meta.textContent = newText;
  }, 10000);

  setInterval(() => {
    const randomFauna = faunaItems[Math.floor(Math.random() * faunaItems.length)];
    const threatLevels = ['none', 'low', 'medium', 'high'];
    const currentThreat = randomFauna.querySelector('.fauna-threat');
    const currentClass = Array.from(currentThreat.classList).find(c => c !== 'fauna-threat');
    const currentIndex = threatLevels.indexOf(currentClass);
    const newIndex = Math.max(0, Math.min(threatLevels.length - 1, currentIndex + Math.random() > 0.5 ? 1 : -1));
    currentThreat.classList.remove(currentClass);
    currentThreat.classList.add(threatLevels[newIndex]);
    if (threatLevels[newIndex] === 'high') {
      addAlert('warning', `High threat detected: ${randomFauna.dataset.species} nearby`);
    }
  }, 15000);
}
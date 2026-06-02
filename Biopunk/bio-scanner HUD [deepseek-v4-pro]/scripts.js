(function() {
  const clockElement = document.getElementById('real-time-clock');
  const bpmElement = document.getElementById('bpm-value');
  const respElement = document.getElementById('resp-value');
  const logElement = document.getElementById('log-message');
  const alertFlash = document.getElementById('alert-flash');
  const neuralIndicator = document.getElementById('neural-indicator');
  const deployBtn = document.getElementById('deploy-nanites');
  const recallBtn = document.getElementById('recall-nanites');
  const naniteCountSpan = document.getElementById('nanite-count');
  const naniteEffSpan = document.getElementById('nanite-eff');

  const ecgCanvas = document.getElementById('ecg-canvas');
  const swarmCanvas = document.getElementById('swarm-canvas');
  const ctxEcg = ecgCanvas.getContext('2d');
  const ctxSwarm = swarmCanvas.getContext('2d');

  let bpm = 82;
  let respiration = 16;
  let naniteActive = 12450;
  let naniteEfficiency = 94;
  let swarmParticles = [];
  const MAX_PARTICLES = 60;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const millis = String(now.getMilliseconds()).padStart(3, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}.${millis}`;
    requestAnimationFrame(() => setTimeout(updateClock, 30));
  }

  function fluctuateVitals() {
    bpm = Math.max(60, Math.min(110, bpm + (Math.random() - 0.5) * 4));
    respiration = Math.max(10, Math.min(22, respiration + (Math.random() - 0.5) * 1.5));
    bpmElement.textContent = Math.floor(bpm);
    respElement.textContent = Math.floor(respiration);

    const logMessages = [
      "CHIMERA-7X VITALS STABLE // MUTATION DRIFT DETECTED",
      "NANITE SWARM EFFICIENCY NOMINAL",
      "WARNING: NECROTOXIN LEVELS RISING",
      "NEURAL LINK BANDWIDTH OPTIMAL",
      "OMEGA STRAIN EXPRESSING PHASE 3 MARKERS"
    ];
    if (Math.random() < 0.3) {
      logElement.textContent = logMessages[Math.floor(Math.random() * logMessages.length)];
    }
  }

  function drawECG() {
    ctxEcg.clearRect(0, 0, ecgCanvas.width, ecgCanvas.height);
    ctxEcg.strokeStyle = '#e63946';
    ctxEcg.lineWidth = 2.2;
    ctxEcg.shadowColor = '#e63946';
    ctxEcg.shadowBlur = 8;
    ctxEcg.beginPath();

    const width = ecgCanvas.width;
    const height = ecgCanvas.height;
    const step = width / 150;
    let x = 0;
    const baseY = height / 2;

    ctxEcg.moveTo(x, baseY);

    for (let i = 0; i < width; i += step) {
      x = i;
      let y = baseY + Math.sin(i * 0.08 + Date.now() * 0.01) * 6;

      if (i > width * 0.65 && i < width * 0.75) {
        const spikePhase = (i - width * 0.65) / (width * 0.1);
        if (spikePhase < 0.1) y = baseY - 25;
        else if (spikePhase < 0.2) y = baseY + 15;
        else if (spikePhase < 0.35) y = baseY - 35;
        else y = baseY;
      }
      ctxEcg.lineTo(x, y);
    }
    ctxEcg.stroke();
    ctxEcg.shadowBlur = 0;
  }

  function initSwarm() {
    swarmParticles = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      swarmParticles.push({
        x: Math.random() * swarmCanvas.width,
        y: Math.random() * swarmCanvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 2.5 + 0.8
      });
    }
  }

  function drawSwarm() {
    ctxSwarm.clearRect(0, 0, swarmCanvas.width, swarmCanvas.height);
    ctxSwarm.fillStyle = '#2ecc40';
    ctxSwarm.shadowColor = '#2ecc40';
    ctxSwarm.shadowBlur = 6;

    for (let p of swarmParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > swarmCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > swarmCanvas.height) p.vy *= -1;
      ctxSwarm.beginPath();
      ctxSwarm.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctxSwarm.fill();
    }
    ctxSwarm.shadowBlur = 0;
  }

  function updateNaniteStats() {
    naniteActive = Math.max(8000, Math.min(18000, naniteActive + (Math.random() - 0.5) * 200));
    naniteEfficiency = Math.max(82, Math.min(99, naniteEfficiency + (Math.random() - 0.5) * 1.8));
    naniteCountSpan.textContent = Math.floor(naniteActive).toLocaleString();
    naniteEffSpan.textContent = Math.floor(naniteEfficiency) + '%';
  }

  function triggerAlert() {
    alertFlash.classList.add('active');
    setTimeout(() => alertFlash.classList.remove('active'), 180);
  }

  function simulateOrganBreathing() {
    const organs = document.querySelectorAll('.organ');
    organs.forEach(organ => organ.classList.add('breathing'));
  }

  function handleDeploy() {
    naniteActive += 1200;
    triggerAlert();
    logElement.textContent = "NANITE SWARM DEPLOYED // TARGETING MUTATION NODES";
  }

  function handleRecall() {
    naniteActive -= 900;
    logElement.textContent = "NANITE SWARM RECALLED // MAINTENANCE CYCLE INITIATED";
  }

  deployBtn.addEventListener('click', handleDeploy);
  recallBtn.addEventListener('click', handleRecall);

  setInterval(fluctuateVitals, 2000);
  setInterval(updateNaniteStats, 3500);
  setInterval(() => {
    if (Math.random() < 0.25) triggerAlert();
  }, 9000);

  function animationLoop() {
    drawECG();
    drawSwarm();
    requestAnimationFrame(animationLoop);
  }

  updateClock();
  simulateOrganBreathing();
  initSwarm();
  animationLoop();
})();
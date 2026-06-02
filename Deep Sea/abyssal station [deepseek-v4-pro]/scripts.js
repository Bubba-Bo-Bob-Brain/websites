(function() {
  const canvas = document.getElementById('bioluminescent-canvas');
  const ctx = canvas.getContext('2d');
  const particleLayer = document.getElementById('particle-drift-layer');
  const depthFill = document.getElementById('depth-fill');
  const depthNum = document.getElementById('current-depth-num');
  const missionTimer = document.getElementById('mission-timer');
  const pressureWarning = document.getElementById('pressure-warning');
  const sonarCanvas = document.getElementById('sonar-canvas');
  const sonarCtx = sonarCanvas.getContext('2d');
  const pressureGaugeArc = document.getElementById('gauge-arc');
  const pressureValueDisplay = document.getElementById('pressure-value');
  const faunaBars = document.querySelectorAll('.spectrum-bar');
  const flowPath1 = document.getElementById('flow-path-1');
  const flowPath2 = document.getElementById('flow-path-2');

  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 90;
  let animationFrame;
  let sonarAngle = 0;
  let depthTarget = 5834;
  let currentDepth = 5834;
  let pressureValue = 612;
  let missionStartTime = Date.now() - (4 * 3600 * 1000) - (22 * 60 * 1000);

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class BioluminescentParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 3.2 + 0.8;
      this.speedY = Math.random() * 0.25 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.hue = Math.random() > 0.7 ? 180 : 280;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset();
        this.y = height + 15;
        this.x = Math.random() * width;
      }
    }
    draw(ctx) {
      const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
      const alpha = this.opacity * pulse;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${alpha})`;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 70%, ${alpha * 0.8})`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new BioluminescentParticle());
  }

  function animateBioluminescence() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    animationFrame = requestAnimationFrame(animateBioluminescence);
  }
  animateBioluminescence();

  function updateDepthDisplay() {
    if (Math.abs(currentDepth - depthTarget) > 2) {
      currentDepth += (depthTarget - currentDepth) * 0.08;
    } else {
      currentDepth = depthTarget;
    }
    depthNum.textContent = Math.round(currentDepth).toString();
    const maxDepth = 10000;
    const percent = Math.min((currentDepth / maxDepth) * 100, 100);
    depthFill.style.width = `${percent}%`;

    const red = Math.min(255, Math.floor((currentDepth / maxDepth) * 255));
    const green = Math.max(0, 200 - red);
    const blue = Math.max(0, 255 - red);
    depthFill.style.background = `linear-gradient(90deg, #00E5FF, rgb(${red}, ${green}, ${blue}))`;
    depthFill.style.boxShadow = `0 0 15px rgb(${red}, ${green}, ${blue})`;

    document.querySelector('.depth-value-display').style.textShadow = `0 0 20px rgb(${red}, ${green}, ${blue})`;
  }

  function updateMissionClock() {
    const now = Date.now();
    const elapsed = new Date(now - missionStartTime);
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = elapsed.getUTCHours();
    const minutes = elapsed.getUTCMinutes();
    const seconds = elapsed.getUTCSeconds();
    missionTimer.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function drawSonar() {
    const w = sonarCanvas.width;
    const h = sonarCanvas.height;
    sonarCtx.clearRect(0, 0, w, h);
    sonarCtx.save();
    sonarCtx.translate(w/2, h/2);

    sonarCtx.beginPath();
    sonarCtx.moveTo(0,0);
    sonarCtx.arc(0, 0, w/2 - 2, sonarAngle - 0.4, sonarAngle + 0.4);
    sonarCtx.closePath();
    const gradient = sonarCtx.createRadialGradient(0,0,0,0,0,w/2);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
    sonarCtx.fillStyle = gradient;
    sonarCtx.fill();

    sonarCtx.beginPath();
    sonarCtx.arc(0,0, w/2 - 4, 0, Math.PI*2);
    sonarCtx.strokeStyle = 'rgba(0,229,255,0.4)';
    sonarCtx.lineWidth = 1.5;
    sonarCtx.stroke();

    sonarCtx.restore();
    sonarAngle += 0.025;
  }

  function updatePressureGauge() {
    const maxPressure = 800;
    const circumference = 264;
    const offset = circumference - (pressureValue / maxPressure) * circumference;
    pressureGaugeArc.setAttribute('stroke-dashoffset', offset);
    pressureValueDisplay.textContent = pressureValue;

    if (pressureValue > 700) {
      pressureGaugeArc.setAttribute('stroke', '#FF4D6D');
      document.querySelector('.pressure-panel .panel-status').className = 'panel-status critical';
      document.querySelector('.pressure-panel .panel-status').textContent = 'CRIT';
    } else if (pressureValue > 550) {
      pressureGaugeArc.setAttribute('stroke', '#FFB347');
    } else {
      pressureGaugeArc.setAttribute('stroke', '#7DF9FF');
    }
  }

  function randomizeFauna() {
    faunaBars.forEach(bar => {
      const newHeight = Math.floor(Math.random() * 70) + 20;
      bar.style.height = `${newHeight}%`;
    });
  }

  function updateCurrentFlow() {
    const time = Date.now() / 1000;
    const amp1 = Math.sin(time * 0.8) * 8;
    const amp2 = Math.cos(time * 0.6) * 6;
    flowPath1.setAttribute('d', `M0,30 Q25,${30 + amp1} 50,30 T100,30 T150,30 T200,30`);
    flowPath2.setAttribute('d', `M0,20 Q25,${20 + amp2} 50,20 T100,20 T150,20 T200,20`);
  }

  function togglePressureWarning() {
    if (pressureValue > 680) {
      pressureWarning.style.opacity = '1';
    } else {
      pressureWarning.style.opacity = '0.3';
    }
  }

  function simulateData() {
    depthTarget = 5800 + Math.sin(Date.now() * 0.002) * 150;
    pressureValue = Math.floor(610 + Math.sin(Date.now() * 0.003) * 30 + (depthTarget - 5800) * 0.2);
    
    updateDepthDisplay();
    updatePressureGauge();
    togglePressureWarning();
    drawSonar();
    updateMissionClock();
    updateCurrentFlow();

    if (Math.random() < 0.02) {
      randomizeFauna();
      document.querySelector('.species-entry .count').textContent = Math.floor(200 + Math.random() * 30);
    }
  }

  setInterval(simulateData, 60);

  const hullSections = document.querySelectorAll('.hull-section');
  function updateHullStress() {
    const stressLevel = (pressureValue - 580) / 200;
    hullSections.forEach((sec, idx) => {
      const variation = Math.sin(Date.now() * 0.01 + idx) * 0.1;
      const alpha = Math.min(0.7, stressLevel * 0.6 + variation);
      sec.style.background = `rgba(255, 77, 109, ${alpha})`;
      sec.style.borderColor = `rgba(255, 77, 109, ${alpha + 0.2})`;
    });
    document.getElementById('composite-value').textContent = `${Math.max(75, (100 - stressLevel * 30)).toFixed(1)}%`;
    document.getElementById('fracture-count').textContent = Math.floor(stressLevel * 5);
  }
  setInterval(updateHullStress, 200);

  window.addEventListener('beforeunload', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
})();
(function() {
  const starfieldCanvas = document.getElementById('starfield');
  const starCtx = starfieldCanvas.getContext('2d');
  const synthCanvas = document.getElementById('synthCanvas');
  const synthCtx = synthCanvas.getContext('2d');
  const pitchLadder = document.getElementById('pitchLadder');
  const shieldRingFill = document.getElementById('shieldRingFill');
  const shieldPercentEl = document.getElementById('shieldPercent');
  const starDateEl = document.getElementById('starDate');
  const lockTextEl = document.getElementById('lockText');
  const freqValueEl = document.getElementById('freqValue');
  const hailButton = document.getElementById('hailButton');
  const coordX = document.getElementById('coordX');
  const coordY = document.getElementById('coordY');
  const coordZ = document.getElementById('coordZ');

  let stars = [];
  let animationFrame;
  let starDateBase = 3247.9;
  let shieldIntegrity = 98;
  let targetLocked = false;
  let synthDataOffset = 0;
  const synthDataHistory = [];

  function resizeStarfield() {
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    const count = Math.floor((starfieldCanvas.width * starfieldCanvas.height) / 1800);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * starfieldCanvas.width,
        y: Math.random() * starfieldCanvas.height,
        radius: Math.random() * 2.2 + 0.3,
        brightness: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.7 ? '#ff8c42' : '#e0e7ff'
      });
    }
  }

  function drawStarfield() {
    starCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > starfieldCanvas.height + 5) {
        star.y = -5;
        star.x = Math.random() * starfieldCanvas.width;
      }

      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starCtx.fillStyle = star.color;
      starCtx.globalAlpha = star.brightness * (0.6 + 0.4 * Math.sin(Date.now() * 0.002 + star.x));
      starCtx.fill();

      if (star.radius > 1.4) {
        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
        starCtx.fillStyle = star.color;
        starCtx.globalAlpha = star.brightness * 0.08;
        starCtx.fill();
      }
    });

    starCtx.globalAlpha = 1;
  }

  function drawPitchLadder() {
    pitchLadder.innerHTML = '';
    const lines = 15;
    const centerY = 150;
    const spacing = 18;
    const time = Date.now() * 0.0005;

    for (let i = -Math.floor(lines/2); i <= Math.floor(lines/2); i++) {
      const yOffset = centerY + i * spacing + Math.sin(time + i * 0.4) * 5;
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.left = '50%';
      line.style.top = yOffset + 'px';
      line.style.transform = 'translateX(-50%)';
      line.style.height = '1px';
      line.style.background = i === 0 ? '#ff2d75' : '#00f0ff';
      line.style.boxShadow = i === 0 ? '0 0 8px #ff2d75' : '0 0 4px #00f0ff';
      line.style.width = (60 - Math.abs(i) * 3) + 'px';
      line.style.opacity = 1 - Math.abs(i) * 0.06;
      pitchLadder.appendChild(line);
    }
  }

  function updateShieldRing() {
    const circumference = 502;
    const offset = circumference - (shieldIntegrity / 100) * circumference;
    shieldRingFill.style.strokeDashoffset = offset;
    shieldPercentEl.textContent = Math.floor(shieldIntegrity) + '%';

    if (shieldIntegrity < 30) {
      shieldRingFill.style.stroke = '#ff2d75';
      shieldRingFill.style.filter = 'drop-shadow(0 0 10px #ff2d75)';
    } else if (shieldIntegrity < 60) {
      shieldRingFill.style.stroke = '#ff8c42';
      shieldRingFill.style.filter = 'drop-shadow(0 0 8px #ff8c42)';
    } else {
      shieldRingFill.style.stroke = '#00f0ff';
      shieldRingFill.style.filter = 'drop-shadow(0 0 6px #00f0ff)';
    }
  }

  function fluctuateShield() {
    const drift = (Math.random() - 0.5) * 0.6;
    shieldIntegrity = Math.min(100, Math.max(15, shieldIntegrity + drift));
    updateShieldRing();
  }

  function updateStarDate() {
    starDateBase += 0.002;
    starDateEl.textContent = starDateBase.toFixed(1);
  }

  function simulateTargetLock() {
    if (Math.random() < 0.008) {
      targetLocked = !targetLocked;
      if (targetLocked) {
        lockTextEl.textContent = 'LOCKED';
        lockTextEl.style.color = '#ff2d75';
        lockTextEl.style.textShadow = '0 0 12px #ff2d75';
      } else {
        lockTextEl.textContent = 'SCANNING';
        lockTextEl.style.color = '#ff8c42';
        lockTextEl.style.textShadow = '0 0 8px #ff8c42';
      }
    }
  }

  function drawSynthWave() {
    synthCtx.clearRect(0, 0, synthCanvas.width, synthCanvas.height);
    const width = synthCanvas.width;
    const height = synthCanvas.height;
    const centerY = height / 2;

    synthDataOffset += 0.12;
    synthDataHistory.push(Math.sin(synthDataOffset * 0.7) * 12 + Math.sin(synthDataOffset * 1.3) * 8 + Math.random() * 4);
    if (synthDataHistory.length > width) {
      synthDataHistory.shift();
    }

    synthCtx.beginPath();
    synthCtx.strokeStyle = '#b347ea';
    synthCtx.lineWidth = 1.5;
    synthCtx.shadowColor = '#b347ea';
    synthCtx.shadowBlur = 8;

    for (let i = 0; i < synthDataHistory.length; i++) {
      const x = i;
      const y = centerY + synthDataHistory[i];
      if (i === 0) synthCtx.moveTo(x, y);
      else synthCtx.lineTo(x, y);
    }
    synthCtx.stroke();

    synthCtx.beginPath();
    synthCtx.strokeStyle = '#00f0ff';
    synthCtx.lineWidth = 1;
    synthCtx.shadowColor = '#00f0ff';
    synthCtx.shadowBlur = 6;

    for (let i = 0; i < synthDataHistory.length; i++) {
      const x = i;
      const y = centerY + synthDataHistory[i] * 0.6 + 4;
      if (i === 0) synthCtx.moveTo(x, y);
      else synthCtx.lineTo(x, y);
    }
    synthCtx.stroke();

    synthCtx.shadowBlur = 0;
    synthCtx.fillStyle = 'rgba(10,10,20,0.15)';
    synthCtx.fillRect(0, 0, width, height);

    const freqBase = 142.7 + Math.sin(synthDataOffset * 0.3) * 2.3;
    freqValueEl.textContent = freqBase.toFixed(1) + ' MHz';
  }

  function updateCoords() {
    const time = Date.now() * 0.0002;
    coordX.textContent = 'X: ' + (452.9 + Math.sin(time) * 12.3).toFixed(1);
    coordY.textContent = 'Y: ' + (-231.1 + Math.cos(time * 0.8) * 8.7).toFixed(1);
    coordZ.textContent = 'Z: ' + (887.4 + Math.sin(time * 1.1) * 15.2).toFixed(1);
  }

  function animate() {
    drawStarfield();
    drawPitchLadder();
    drawSynthWave();
    updateStarDate();
    simulateTargetLock();
    updateCoords();

    animationFrame = requestAnimationFrame(animate);
  }

  setInterval(fluctuateShield, 1200);

  hailButton.addEventListener('click', () => {
    const logsContainer = document.querySelector('.comm-logs');
    const newLog = document.createElement('div');
    newLog.className = 'log-entry incoming';
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2,'0') + ':' +
                    now.getMinutes().toString().padStart(2,'0') + ':' +
                    now.getSeconds().toString().padStart(2,'0');
    newLog.innerHTML = '<span class="log-time">' + timeStr + '</span> <span class="log-msg">HAIL SENT: CH 7</span>';
    logsContainer.appendChild(newLog);

    if (logsContainer.children.length > 5) {
      logsContainer.removeChild(logsContainer.firstChild);
    }

    hailButton.style.transform = 'scale(0.92)';
    setTimeout(() => { hailButton.style.transform = ''; }, 120);
  });

  window.addEventListener('resize', () => {
    resizeStarfield();
  });

  resizeStarfield();
  updateShieldRing();
  animate();
})();
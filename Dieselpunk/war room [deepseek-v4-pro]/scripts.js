(function() {
  'use strict';

  const lampBulb = document.getElementById('lampBulb');
  const lightCone = document.getElementById('lightCone');
  const pullChain = document.getElementById('pullChain');
  let lampOn = true;

  function toggleLamp() {
    lampOn = !lampOn;
    if (lampOn) {
      lampBulb.classList.remove('off');
      lightCone.classList.remove('dim');
    } else {
      lampBulb.classList.add('off');
      lightCone.classList.add('dim');
    }
  }

  pullChain.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLamp();
  });

  const mapCanvas = document.getElementById('mapCanvas');
  const ctx = mapCanvas.getContext('2d');

  function drawMap() {
    const w = mapCanvas.width = mapCanvas.clientWidth;
    const h = mapCanvas.height = mapCanvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#2d4430';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#5a6a3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.4);
    ctx.quadraticCurveTo(w * 0.3, h * 0.2, w * 0.5, h * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.6);
    ctx.quadraticCurveTo(w * 0.8, h * 0.7, w * 0.9, h * 0.3);
    ctx.stroke();

    ctx.fillStyle = '#4a5a3a';
    ctx.beginPath();
    ctx.arc(w * 0.25, h * 0.35, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a9a6a';
    ctx.stroke();

    ctx.fillStyle = '#3a4a2a';
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.65, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
      const x = 30 + i * 50;
      const y = 50 + Math.sin(i * 0.9) * 20;
      ctx.fillStyle = '#6a7a4a';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.font = '10px "Share Tech Mono"';
    ctx.fillStyle = '#b0a87a';
    ctx.fillText('SECTOR 7', w*0.18, h*0.25);
    ctx.fillText('SECTOR 12', w*0.68, h*0.55);
  }

  window.addEventListener('resize', drawMap);
  drawMap();

  const tokens = document.querySelectorAll('.token');
  const tableSurface = document.querySelector('.table-surface');

  tokens.forEach(token => {
    token.addEventListener('dragstart', handleDragStart);
    token.addEventListener('dragend', handleDragEnd);
  });

  tableSurface.addEventListener('dragover', (e) => e.preventDefault());
  tableSurface.addEventListener('drop', handleDrop);

  let draggedToken = null;
  let offsetX = 0, offsetY = 0;

  function handleDragStart(e) {
    draggedToken = this;
    const rect = this.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    this.style.opacity = '0.7';
    e.dataTransfer.setData('text/plain', '');
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedToken = null;
  }

  function handleDrop(e) {
    e.preventDefault();
    if (!draggedToken) return;
    const tableRect = tableSurface.getBoundingClientRect();
    const tokenRect = draggedToken.getBoundingClientRect();
    let newLeft = e.clientX - tableRect.left - offsetX;
    let newTop = e.clientY - tableRect.top - offsetY;

    newLeft = Math.max(0, Math.min(newLeft, tableRect.width - tokenRect.width));
    newTop = Math.max(0, Math.min(newTop, tableRect.height - tokenRect.height));

    draggedToken.style.left = newLeft + 'px';
    draggedToken.style.top = newTop + 'px';
  }

  function updateGauge(needleId, valueId, percentage) {
    const needle = document.getElementById(needleId);
    const valueEl = document.getElementById(valueId);
    if (!needle || !valueEl) return;
    const angle = -90 + (percentage * 180) / 100;
    needle.style.transform = `rotate(${angle}deg)`;
    valueEl.textContent = Math.round(percentage) + '%';
  }

  function randomizeGauges() {
    updateGauge('needleSteel', 'valueSteel', 60 + Math.random() * 35);
    updateGauge('needleFuel', 'valueFuel', 30 + Math.random() * 40);
    updateGauge('needleAmmo', 'valueAmmo', 70 + Math.random() * 30);
    const quotaFill = document.getElementById('quotaFill');
    if (quotaFill) {
      quotaFill.style.width = (55 + Math.random() * 30) + '%';
    }
  }

  setInterval(randomizeGauges, 4200);
  randomizeGauges();

  const radioLog = document.getElementById('radioLog');
  const messages = [
    { freq: '4.92 MHz', text: '...UNIDENTIFIED AIRCRAFT HEADING 270 · ALTITUDE ANGELS 15...' },
    { freq: '5.33 MHz', text: '...SUPPLY DEPOT UNDER ARTILLERY FIRE · REQUEST COUNTER-BATTERY...' },
    { freq: '3.76 MHz', text: '...ARMORED COLUMN SPOTTED GRID 18-42 · STRENGTH BATTALION...' },
    { freq: '6.01 MHz', text: '...WEATHER CLOSING IN · VISIBILITY DROPPING BELOW 500 METERS...' },
    { freq: '4.55 MHz', text: '...PARTISAN SABOTAGE REPORTED ON RAIL LINE CHARLIE...' }
  ];

  function addRadioMessage() {
    if (!radioLog) return;
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const now = new Date();
    const time = now.toTimeString().slice(0,8);
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">${time}</span> <span class="log-freq">${msg.freq}</span> <span class="log-message">${msg.text}</span>`;
    radioLog.appendChild(entry);
    radioLog.scrollTop = radioLog.scrollHeight;
    if (radioLog.children.length > 10) {
      radioLog.removeChild(radioLog.children[0]);
    }
  }

  setInterval(addRadioMessage, 7000);
  addRadioMessage();
  addRadioMessage();

  const posters = document.querySelectorAll('.poster-slide');
  let currentPoster = 0;

  function rotatePoster() {
    posters.forEach(p => p.classList.remove('poster-active'));
    posters[currentPoster].classList.add('poster-active');
    currentPoster = (currentPoster + 1) % posters.length;
  }

  setInterval(rotatePoster, 8000);

  const lampShade = document.querySelector('.lamp-shade');
  if (lampShade) {
    let flickerTimeout;
    function subtleFlicker() {
      if (!lampOn) return;
      const bulb = document.getElementById('lampBulb');
      if (bulb) {
        const intensity = 0.7 + Math.random() * 0.3;
        bulb.style.boxShadow = `0 0 ${20 + intensity*25}px #ffaa00, 0 0 ${50 + intensity*30}px #ff8800`;
      }
      flickerTimeout = setTimeout(subtleFlicker, 80 + Math.random() * 250);
    }
    subtleFlicker();
  }

})();
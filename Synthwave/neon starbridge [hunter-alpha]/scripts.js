// Bridge Console - Main JavaScript
(function() {
  'use strict';

  // ===== BOOT SEQUENCE =====
  const bootOverlay = document.getElementById('boot-overlay');
  const bootText = document.getElementById('boot-text');
  const bootProgressBar = document.getElementById('boot-progress-bar');

  const bootMessages = [
    'INITIALIZING BRIDGE SYSTEMS...',
    'LOADING NAVIGATION SUBSYSTEM...',
    'CALIBRATING SENSOR ARRAYS...',
    'ESTABLISHING SUBSPACE LINK...',
    'POWERING WEAPONS ARRAY...',
    'ACTIVATING SHIELD GENERATORS...',
    'SYNCING CHRONOMETERS...',
    'LOADING STAR CHARTS...',
    'RUNNING DIAGNOSTICS...',
    'ALL SYSTEMS OPERATIONAL.'
  ];

  let bootIndex = 0;
  let bootProgress = 0;

  function runBootSequence() {
    if (bootIndex < bootMessages.length) {
      bootText.textContent += bootMessages[bootIndex] + '\n';
      bootProgress = ((bootIndex + 1) / bootMessages.length) * 100;
      bootProgressBar.style.width = bootProgress + '%';
      bootIndex++;
      setTimeout(runBootSequence, 300 + Math.random() * 200);
    } else {
      setTimeout(() => {
        bootOverlay.classList.add('hidden');
        setTimeout(() => {
          bootOverlay.style.display = 'none';
          initializeAllSystems();
        }, 500);
      }, 500);
    }
  }

  // ===== STAR CHART CANVAS =====
  function initStarChart() {
    const canvas = document.getElementById('star-chart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    let frame = 0;
    function drawStarChart() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * i / 10, 0);
        ctx.lineTo(canvas.width * i / 10, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * i / 10);
        ctx.lineTo(canvas.width, canvas.height * i / 10);
        ctx.stroke();
      }

      // Stars
      stars.forEach(star => {
        const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(0, 240, 255, ${star.brightness * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Course line
      ctx.strokeStyle = 'rgba(255, 0, 170, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.3, canvas.height * 0.7);
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.3);
      ctx.stroke();
      ctx.setLineDash([]);

      // Current position dot
      const pos = 0.5 + Math.sin(frame * 0.01) * 0.1;
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(canvas.width * pos, canvas.height * (1 - pos), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      frame++;
      requestAnimationFrame(drawStarChart);
    }
    drawStarChart();
  }

  // ===== VIEWPORT CANVAS =====
  function initViewport() {
    const canvas = document.getElementById('viewport-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Stars for the viewport
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        size: Math.random() * 2 + 0.5
      });
    }

    // Chrome grid
    const gridLines = [];
    for (let i = 0; i < 20; i++) {
      gridLines.push(i / 19);
    }

    let frame = 0;
    let gridOffset = 0;

    function drawViewport() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Horizon gradient
      const horizonY = canvas.height * 0.65;
      const gradient = ctx.createLinearGradient(0, horizonY - 50, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(255, 0, 170, 0)');
      gradient.addColorStop(0.3, 'rgba(255, 0, 170, 0.15)');
      gradient.addColorStop(0.6, 'rgba(255, 102, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 0, 170, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY - 50, canvas.width, canvas.height - horizonY + 50);

      // Sun
      const sunY = horizonY - 20;
      const sunGradient = ctx.createRadialGradient(canvas.width / 2, sunY, 0, canvas.width / 2, sunY, 80);
      sunGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
      sunGradient.addColorStop(0.3, 'rgba(255, 100, 50, 0.4)');
      sunGradient.addColorStop(0.6, 'rgba(255, 50, 100, 0.2)');
      sunGradient.addColorStop(1, 'rgba(255, 0, 100, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, sunY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Sun stripes
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, sunY, 60, 0, Math.PI * 2);
      ctx.clip();
      for (let i = 0; i < 8; i++) {
        const y = sunY - 60 + i * 16;
        ctx.fillStyle = 'rgba(10, 10, 20, 0.6)';
        ctx.fillRect(canvas.width / 2 - 70, y, 140, 4);
      }
      ctx.restore();

      // Chrome grid
      gridOffset = (gridOffset + 0.5) % 20;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      for (let i = 0; i < 30; i++) {
        const y = horizonY + (i * i * 2) + gridOffset;
        if (y > canvas.height) continue;
        const perspective = (y - horizonY) / (canvas.height - horizonY);
        ctx.globalAlpha = 0.05 + perspective * 0.15;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical grid lines
      const vanishX = canvas.width / 2;
      ctx.globalAlpha = 0.1;
      for (let i = -10; i <= 10; i++) {
        const baseX = vanishX + i * 60;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY);
        ctx.lineTo(baseX, canvas.height);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Stars
      stars.forEach(star => {
        const brightness = 0.3 + Math.sin(frame * 0.02 + star.x * 10) * 0.2;
        ctx.fillStyle = `rgba(224, 232, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(star.x * canvas.width, star.y * horizonY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frame++;
      requestAnimationFrame(drawViewport);
    }
    drawViewport();
  }

  // ===== FIRING ARC CANVAS =====
  function initFiringArc() {
    const canvas = document.getElementById('firing-arc-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let scanAngle = 0;

    function drawFiringArc() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 10;

      // Outer ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Ship outline
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius * 0.3);
      ctx.lineTo(cx - radius * 0.15, cy + radius * 0.2);
      ctx.lineTo(cx, cy + radius * 0.15);
      ctx.lineTo(cx + radius * 0.15, cy + radius * 0.2);
      ctx.closePath();
      ctx.stroke();

      // Firing arcs
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius * 0.8, -Math.PI * 0.7, -Math.PI * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 0, 170, 0.1)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius * 0.8, Math.PI * 0.3, Math.PI * 0.7);
      ctx.closePath();
      ctx.fill();

      // Scan sweep
      scanAngle += 0.02;
      const sweepGradient = ctx.createConicalGradient ? null : null;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(scanAngle) * radius, cy + Math.sin(scanAngle) * radius);
      ctx.stroke();

      // Target blip
      const targetAngle = Math.PI * 0.4;
      const targetDist = radius * 0.7;
      const targetX = cx + Math.cos(targetAngle) * targetDist;
      const targetY = cy + Math.sin(targetAngle) * targetDist;
      const blink = Math.sin(frame * 0.1) > 0;
      
      if (blink) {
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frame++;
      requestAnimationFrame(drawFiringArc);
    }
    drawFiringArc();
  }

  // ===== FREQUENCY CANVAS =====
  function initFreqDisplay() {
    const canvas = document.getElementById('freq-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const bars = [];
    for (let i = 0; i < 32; i++) {
      bars.push({
        height: Math.random(),
        targetHeight: Math.random(),
        speed: Math.random() * 0.05 + 0.02
      });
    }

    let frame = 0;

    function drawFreqDisplay() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / bars.length - 1;
      
      bars.forEach((bar, i) => {
        // Animate towards target
        bar.height += (bar.targetHeight - bar.height) * bar.speed;
        
        // Occasionally change target
        if (Math.random() < 0.02) {
          bar.targetHeight = Math.random();
        }

        const h = bar.height * canvas.height * 0.8;
        const x = i * (barWidth + 1);
        const y = canvas.height - h;

        // Gradient bar
        const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 170, 0.6)');
        gradient.addColorStop(1, 'rgba(153, 51, 255, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, h);

        // Glow effect
        ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.fillRect(x, y - 2, barWidth, 4);
      });

      // Waveform overlay
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x + frame * 2) * 0.05) * 10 + Math.sin((x + frame) * 0.1) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      frame++;
      requestAnimationFrame(drawFreqDisplay);
    }
    drawFreqDisplay();
  }

  // ===== CLOCK UPDATE =====
  function updateClock() {
    const clockEl = document.getElementById('ship-clock');
    if (!clockEl) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}:${secs}`;
  }

  // ===== STARDATE UPDATE =====
  function updateStardate() {
    const stardateEl = document.getElementById('stardate');
    if (!stardateEl) return;
    
    const now = new Date();
    const base = 47634.42;
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const stardate = base + (dayOfYear * 0.01) + (now.getHours() * 0.001);
    stardateEl.textContent = stardate.toFixed(2);
  }

  // ===== DYNAMIC DATA UPDATES =====
  function updateNavigationData() {
    const elements = {
      'heading-val': () => (270 + Math.random() * 10).toFixed(2),
      'pitch-val': () => (10 + Math.random() * 5).toFixed(2),
      'roll-val': () => (Math.random() * 2 - 1).toFixed(2),
      'hud-pitch': () => (10 + Math.random() * 5).toFixed(2),
      'hud-roll': () => (Math.random() * 2 - 1).toFixed(2),
      'hud-heading': () => (270 + Math.random() * 10).toFixed(2),
      'warp-speed': () => {
        const speeds = ['1,247c', '1,248c', '1,249c', '1,246c'];
        return speeds[Math.floor(Math.random() * speeds.length)];
      }
    };

    Object.keys(elements).forEach(id => {
      const el = document.getElementById(id);
      if (el && Math.random() < 0.1) {
        el.textContent = elements[id]();
      }
    });
  }

  // ===== RETICLE ANIMATION =====
  function updateReticle() {
    const reticle = document.getElementById('reticle');
    if (!reticle) return;
    
    const range = document.getElementById('reticle-range');
    if (range && Math.random() < 0.05) {
      const val = 14000 + Math.floor(Math.random() * 500);
      range.textContent = val.toLocaleString() + ' km';
    }
  }

  // ===== SHIELD ANIMATION =====
  function updateShields() {
    const shieldPct = document.getElementById('shield-pct');
    const shieldArc = document.getElementById('shield-arc');
    
    if (shieldPct && Math.random() < 0.02) {
      const current = parseInt(shieldPct.textContent);
      const newVal = Math.max(85, Math.min(98, current + (Math.random() > 0.5 ? 1 : -1)));
      shieldPct.textContent = newVal;
      
      if (shieldArc) {
        const rotation = -45 + (newVal / 100) * 270;
        shieldArc.style.clipPath = `inset(0 ${100 - newVal}% 0 0)`;
      }
    }
  }

  // ===== WEAPON CHARGE ANIMATION =====
  function updateWeapons() {
    const phaserCharge = document.getElementById('phaser-charge');
    const torpedoCharge = document.getElementById('torpedo-charge');
    
    if (phaserCharge && Math.random() < 0.03) {
      const current = parseInt(phaserCharge.style.width);
      const newVal = Math.max(90, Math.min(100, current + (Math.random() > 0.7 ? 1 : 0)));
      phaserCharge.style.width = newVal + '%';
    }
    
    if (torpedoCharge && Math.random() < 0.02) {
      const current = parseInt(torpedoCharge.style.width);
      const newVal = Math.max(80, Math.min(95, current + (Math.random() > 0.5 ? 1 : -1)));
      torpedoCharge.style.width = newVal + '%';
    }
  }

  // ===== ENGINEERING STATS =====
  function updateEngineering() {
    const reactorVal = document.getElementById('reactor-val');
    const reactorFill = document.getElementById('reactor-fill');
    
    if (reactorVal && Math.random() < 0.03) {
      const current = parseInt(reactorVal.textContent);
      const newVal = Math.max(78, Math.min(88, current + (Math.random() > 0.5 ? 1 : -1)));
      reactorVal.textContent = newVal;
      
      if (reactorFill) {
        reactorFill.style.clipPath = `inset(0 ${100 - newVal}% 0 0)`;
      }
    }
  }

  // ===== COMM LOG =====
  const commMessages = [
    'Starfleet Command: Maintain current heading',
    'Deep Space 9: Weather update received',
    'USS Enterprise: Passing coordinates verified',
    'Starbase 12: Docking bay reserved',
    'Science Division: Nebula scan complete',
    'Engineering: Warp core stable',
    'Tactical: All sectors clear',
    'Medical: Crew health nominal'
  ];

  function addCommLog() {
    const log = document.getElementById('incoming-log');
    if (!log || Math.random() > 0.01) return;
    
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const msg = commMessages[Math.floor(Math.random() * commMessages.length)];
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">${time}</span><span class="log-msg">${msg}</span>`;
    
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 5 entries
    while (log.children.length > 5) {
      log.removeChild(log.lastChild);
    }
  }

  // ===== BUTTON INTERACTIONS =====
  function initButtons() {
    // Alert button
    const alertBtn = document.getElementById('btn-alert');
    const alertStrip = document.getElementById('alert-strip');
    const alertText = alertStrip ? alertStrip.querySelector('.alert-text') : null;
    let alertState = 0; // 0: normal, 1: yellow, 2: red
    
    if (alertBtn) {
      alertBtn.addEventListener('click', () => {
        alertState = (alertState + 1) % 3;
        
        if (alertStrip) {
          alertStrip.classList.remove('warning', 'danger');
          if (alertState === 1) {
            alertStrip.classList.add('warning');
            if (alertText) alertText.textContent = 'YELLOW ALERT';
          } else if (alertState === 2) {
            alertStrip.classList.add('danger');
            if (alertText) alertText.textContent = 'RED ALERT';
          } else {
            if (alertText) alertText.textContent = 'ALL SYSTEMS NOMINAL';
          }
        }
      });
    }

    // Scan button
    const scanBtn = document.getElementById('btn-scan');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        scanBtn.classList.add('active');
        setTimeout(() => scanBtn.classList.remove('active'), 2000);
        
        // Update target info
        const targetName = document.getElementById('target-name');
        const targetClass = document.getElementById('target-class');
        const targetRange = document.getElementById('target-range');
        const targetThreat = document.getElementById('target-threat');
        
        if (targetName) targetName.textContent = 'VESSEL DETECTED';
        if (targetClass) targetClass.textContent = 'CRUISER CLASS';
        if (targetRange) targetRange.textContent = '14,280 KM';
        if (targetThreat) targetThreat.textContent = 'LOW';
      });
    }

    // Lock button
    const lockBtn = document.getElementById('btn-lock');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        lockBtn.classList.toggle('active');
      });
    }

    // Grid button
    const gridBtn = document.getElementById('btn-grid');
    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        gridBtn.classList.toggle('active');
      });
    }

    // Warp button
    const warpBtn = document.getElementById('btn-warp');
    if (warpBtn) {
      warpBtn.addEventListener('click', () => {
        warpBtn.classList.toggle('active');
        const speedLines = document.getElementById('speed-lines');
        if (speedLines) {
          speedLines.style.opacity = warpBtn.classList.contains('active') ? '1' : '0';
        }
      });
    }

    // Fire phasers button
    const firePhasers = document.getElementById('btn-fire-phasers');
    if (firePhasers) {
      firePhasers.addEventListener('click', () => {
        firePhasers.style.boxShadow = '0 0 30px var(--cyan)';
        const charge = document.getElementById('phaser-charge');
        if (charge) {
          const current = parseInt(charge.style.width);
          charge.style.width = Math.max(0, current - 20) + '%';
        }
        setTimeout(() => {
          firePhasers.style.boxShadow = '';
        }, 300);
      });
    }

    // Fire torpedo button
    const fireTorpedo = document.getElementById('btn-fire-torpedo');
    if (fireTorpedo) {
      fireTorpedo.addEventListener('click', () => {
        fireTorpedo.style.boxShadow = '0 0 30px var(--pink)';
        const charge = document.getElementById('torpedo-charge');
        const count = document.getElementById('torpedo-count');
        if (charge) {
          const current = parseInt(charge.style.width);
          charge.style.width = Math.max(0, current - 10) + '%';
        }
        if (count) {
          const current = parseInt(count.textContent);
          count.textContent = Math.max(0, current - 1);
        }
        setTimeout(() => {
          fireTorpedo.style.boxShadow = '';
        }, 300);
      });
    }

    // Hail button
    const hailBtn = document.getElementById('btn-hail');
    if (hailBtn) {
      hailBtn.addEventListener('click', () => {
        hailBtn.classList.add('active');
        setTimeout(() => hailBtn.classList.remove('active'), 3000);
      });
    }

    // Encrypt button
    const encryptBtn = document.getElementById('btn-encrypt');
    if (encryptBtn) {
      encryptBtn.addEventListener('click', () => {
        encryptBtn.classList.toggle('active');
      });
    }
  }

  // ===== COORDINATE ANIMATION =====
  function updateCoordinates() {
    const coords = [
      { el: 'coord-x', val: 'coord-x-val', min: 240, max: 260 },
      { el: 'coord-y', val: 'coord-y-val', min: -95, max: -80 },
      { el: 'coord-z', val: 'coord-z-val', min: 500, max: 530 }
    ];

    coords.forEach(coord => {
      if (Math.random() < 0.02) {
        const valEl = document.getElementById(coord.val);
        const barEl = document.getElementById(coord.el);
        if (valEl && barEl) {
          const newVal = coord.min + Math.random() * (coord.max - coord.min);
          const sign = newVal >= 0 ? '+' : '';
          valEl.textContent = sign + newVal.toFixed(2);
          
          const percent = ((newVal - coord.min) / (coord.max - coord.min)) * 100;
          barEl.style.width = percent + '%';
        }
      }
    });
  }

  // ===== MAIN UPDATE LOOP =====
  function updateLoop() {
    updateNavigationData();
    updateReticle();
    updateShields();
    updateWeapons();
    updateEngineering();
    addCommLog();
    updateCoordinates();
    requestAnimationFrame(updateLoop);
  }

  // ===== INITIALIZE ALL SYSTEMS =====
  function initializeAllSystems() {
    initStarChart();
    initViewport();
    initFiringArc();
    initFreqDisplay();
    initButtons();
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Start stardate
    updateStardate();
    setInterval(updateStardate, 60000);
    
    // Start update loop
    updateLoop();
  }

  // ===== START BOOT SEQUENCE =====
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runBootSequence, 500);
  });

})();
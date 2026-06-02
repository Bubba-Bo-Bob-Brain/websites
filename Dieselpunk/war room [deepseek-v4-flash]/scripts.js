// ============================================
// THE WAR ROOM — OPERATION IRON ANVIL
// Interactive Command Center Scripts
// ============================================

(function () {
  'use strict';

  // ============================================
  // 1. CLOCK & TIMESTAMP UPDATER
  // ============================================
  const clockDisplay = document.getElementById('clockDisplay');
  let clockMinutes = 14;
  let clockHours = 14;

  function updateClock() {
    clockMinutes += 1;
    if (clockMinutes >= 60) {
      clockMinutes = 0;
      clockHours += 1;
      if (clockHours >= 24) clockHours = 0;
    }
    const timeStr = String(clockHours).padStart(2, '0') + ':' + String(clockMinutes).padStart(2, '0');
    if (clockDisplay) clockDisplay.textContent = timeStr;
  }

  setInterval(updateClock, 30000); // every 30 seconds real time = 1 minute game time

  // ============================================
  // 2. RADIO FEED — LIVE INTERCEPT SIMULATION
  // ============================================
  const radioFeed = document.getElementById('radioFeed');
  const radioMessages = [
    { channel: 1, callsign: 'HAWK 6-4', msg: 'Enemy armor column sighted moving south on Route 7. Request air support.' },
    { channel: 2, callsign: 'IRONHIDE', msg: 'Ammunition low. Resupply drop needed at grid 9-2. Over.' },
    { channel: 3, callsign: 'BERLIN', msg: 'All units: hold current positions. Do not advance beyond Phase Line Green.' },
    { channel: 1, callsign: 'VANGUARD', msg: 'Bridge secured. Crossing begins now. No opposition.' },
    { channel: 2, callsign: 'LIMEY', msg: 'Bandits at 3 o\'clock low. Engaging. Out.' },
    { channel: 3, callsign: 'WATCHTOWER', msg: 'Radar contact bearing 270. Range 80 miles. Altitude unknown.' },
    { channel: 1, callsign: 'RAVEN 2-1', msg: 'Photo recon complete. Enemy fortifications at grid 4-7. Heavy AA.' },
    { channel: 2, callsign: 'SABER', msg: 'Patrol reports civilian movement near forward line. Evacuating.' },
    { channel: 3, callsign: 'PANTHER 1-1-7', msg: 'Engine damage. Returning to base. Request escort.' },
    { channel: 1, callsign: 'CASTLE', msg: 'Artillery battery in position. Coordinates locked. Awaiting fire order.' },
    { channel: 2, callsign: 'COPPERHEAD', msg: 'Supply convoy delayed 2 hours due to road damage. ETA 1800.' },
    { channel: 3, callsign: 'BERLIN', msg: 'Enemy breakthrough at sector 8. Commit reserves immediately.' },
  ];

  function addRadioMessage() {
    const msg = radioMessages[Math.floor(Math.random() * radioMessages.length)];
    const timestamp = String(clockHours).padStart(2, '0') + ':' + String(clockMinutes).padStart(2, '0');
    const feedLine = document.createElement('div');
    feedLine.className = 'feed-line';
    feedLine.dataset.channel = msg.channel;
    feedLine.innerHTML = `<span class="timestamp">${timestamp}</span> <span class="callsign">${msg.callsign}</span> — "${msg.msg}"`;
    radioFeed.appendChild(feedLine);
    radioFeed.scrollTop = radioFeed.scrollHeight;

    // Keep max 20 messages
    while (radioFeed.children.length > 20) {
      radioFeed.removeChild(radioFeed.firstChild);
    }
  }

  // Add initial messages
  for (let i = 0; i < 6; i++) {
    addRadioMessage();
  }

  setInterval(addRadioMessage, 12000); // new message every 12 seconds

  // ============================================
  // 3. STRATEGY MAP — TOKEN DEPLOYMENT
  // ============================================
  const mapContainer = document.getElementById('mapContainer');
  const mapTokens = document.getElementById('mapTokens');
  const mapCoords = document.getElementById('mapCoords');

  // Unit data
  const units = [
    { id: 'A1', type: 'ally', label: '1st INF', x: 20, y: 35 },
    { id: 'A2', type: 'ally', label: '2nd ARM', x: 35, y: 45 },
    { id: 'A3', type: 'ally', label: '101st', x: 28, y: 55 },
    { id: 'A4', type: 'ally', label: '4th INF', x: 45, y: 30 },
    { id: 'A5', type: 'ally', label: '82nd', x: 50, y: 60 },
    { id: 'E1', type: 'enemy', label: 'SS 1', x: 70, y: 40 },
    { id: 'E2', type: 'enemy', label: 'SS 2', x: 80, y: 55 },
    { id: 'E3', type: 'enemy', label: 'INF', x: 65, y: 65 },
    { id: 'E4', type: 'enemy', label: 'ARM', x: 75, y: 30 },
    { id: 'U1', type: 'unknown', label: '???', x: 55, y: 45 },
    { id: 'U2', type: 'unknown', label: '???', x: 40, y: 70 },
  ];

  function createTokens() {
    units.forEach(unit => {
      const token = document.createElement('div');
      token.className = `token ${unit.type}`;
      token.style.left = unit.x + '%';
      token.style.top = unit.y + '%';
      token.dataset.unitId = unit.id;
      token.title = unit.label;

      const label = document.createElement('span');
      label.className = 'token-label';
      label.textContent = unit.label;
      token.appendChild(label);

      token.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('selected');
        showUnitInfo(unit);
      });

      mapTokens.appendChild(token);
    });
  }

  function showUnitInfo(unit) {
    if (mapCoords) {
      mapCoords.textContent = `${unit.label} @ GRID ${unit.x}-${unit.y}`;
      mapCoords.style.color = '#d4a843';
      setTimeout(() => {
        mapCoords.style.color = '';
      }, 3000);
    }
  }

  createTokens();

  // Token movement animation (simulate repositioning)
  function moveRandomToken() {
    const tokens = mapTokens.querySelectorAll('.token');
    if (tokens.length === 0) return;
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
    const newX = 10 + Math.random() * 80;
    const newY = 10 + Math.random() * 80;
    randomToken.style.transition = 'left 3s ease, top 3s ease';
    randomToken.style.left = newX + '%';
    randomToken.style.top = newY + '%';

    // Update unit data
    const unitId = randomToken.dataset.unitId;
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      unit.x = Math.round(newX);
      unit.y = Math.round(newY);
    }

    // Flash effect
    randomToken.style.boxShadow = '0 0 20px rgba(255,200,50,0.8)';
    setTimeout(() => {
      randomToken.style.boxShadow = '';
    }, 1000);
  }

  setInterval(moveRandomToken, 25000); // move a token every 25 seconds

  // Map coordinate tracking on mouse move
  if (mapContainer) {
    mapContainer.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      if (mapCoords) {
        mapCoords.textContent = `GRID: ${x}-${y}`;
      }
    });
  }

  // ============================================
  // 4. GAUGE NEEDLE ANIMATION
  // ============================================
  const gaugeItems = document.querySelectorAll('.gauge-item');
  gaugeItems.forEach(item => {
    const needle = item.querySelector('.gauge-needle');
    if (!needle) return;

    // Random initial rotation
    const baseRotation = -20 + Math.random() * 40;
    needle.style.transform = `rotate(${baseRotation}deg)`;

    // Animate needle with slight variation
    function animateNeedle() {
      const targetRotation = -25 + Math.random() * 50;
      needle.style.transition = 'transform 2s ease-in-out';
      needle.style.transform = `rotate(${targetRotation}deg)`;
    }

    setInterval(animateNeedle, 4000 + Math.random() * 3000);
  });

  // ============================================
  // 5. PROPAGANDA POSTER ROTATION
  // ============================================
  const propagandaRotation = document.getElementById('propagandaRotation');
  if (propagandaRotation) {
    const posters = propagandaRotation.querySelectorAll('.propaganda-poster');
    let currentPosterIndex = 0;

    function showNextPoster() {
      posters.forEach((poster, index) => {
        poster.style.opacity = index === currentPosterIndex ? '1' : '0';
        poster.style.transition = 'opacity 1s ease';
      });
      currentPosterIndex = (currentPosterIndex + 1) % posters.length;
    }

    showNextPoster();
    setInterval(showNextPoster, 8000);
  }

  // ============================================
  // 6. OVERHEAD LAMP FLICKER ENHANCEMENT
  // ============================================
  const overheadLamp = document.getElementById('overheadLamp');
  if (overheadLamp) {
    const bulb = overheadLamp.querySelector('.lamp-bulb');
    const light = overheadLamp.querySelector('.lamp-light');

    function extraFlicker() {
      if (Math.random() < 0.1) { // 10% chance
        bulb.style.animation = 'none';
        bulb.style.opacity = '0.3';
        if (light) light.style.opacity = '0.2';

        setTimeout(() => {
          bulb.style.opacity = '1';
          if (light) light.style.opacity = '1';
          bulb.style.animation = 'lamp-flicker 4s ease-in-out infinite';
        }, 150 + Math.random() * 200);
      }
    }

    setInterval(extraFlicker, 12000);
  }

  // ============================================
  // 7. PRODUCTION QUOTA BAR ANIMATION
  // ============================================
  const quotaFills = document.querySelectorAll('.quota-fill');
  quotaFills.forEach(fill => {
    const targetWidth = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.transition = 'width 2s ease';
      fill.style.width = targetWidth;
    }, 500);
  });

  // Simulate quota changes
  function updateQuotas() {
    const quotaItems = document.querySelectorAll('.quota-item');
    quotaItems.forEach(item => {
      const fill = item.querySelector('.quota-fill');
      const value = item.querySelector('.quota-value');
      if (fill && value) {
        const currentWidth = parseFloat(fill.style.width) || 0;
        const change = (Math.random() - 0.5) * 10;
        let newWidth = Math.min(100, Math.max(0, currentWidth + change));
        fill.style.transition = 'width 3s ease';
        fill.style.width = newWidth + '%';

        // Update text value (simplified)
        const textParts = value.textContent.split('/');
        if (textParts.length === 2) {
          const max = parseInt(textParts[1].replace(/[^0-9]/g, '')) || 100;
          const newVal = Math.round((newWidth / 100) * max);
          value.textContent = newVal + '/' + max;
        }
      }
    });
  }

  setInterval(updateQuotas, 15000);

  // ============================================
  // 8. MAP GRID LINES (dynamic overlay)
  // ============================================
  const mapGrid = document.getElementById('mapGrid');
  if (mapGrid) {
    for (let i = 0; i < 12; i++) {
      const hLine = document.createElement('div');
      hLine.style.cssText = `
        position: absolute;
        left: 0;
        right: 0;
        top: ${(i / 12) * 100}%;
        height: 1px;
        background: rgba(100,100,100,0.15);
        pointer-events: none;
      `;
      mapGrid.appendChild(hLine);

      const vLine = document.createElement('div');
      vLine.style.cssText = `
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${(i / 12) * 100}%;
        width: 1px;
        background: rgba(100,100,100,0.15);
        pointer-events: none;
      `;
      mapGrid.appendChild(vLine);
    }
  }

  // ============================================
  // 9. ATMOSPHERIC EFFECTS
  // ============================================

  // Subtle background static noise overlay
  const noiseOverlay = document.createElement('div');
  noiseOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  `;
  document.body.appendChild(noiseOverlay);

  // ============================================
  // 10. WINDOW TITLE TICKER
  // ============================================
  const baseTitle = 'THE WAR ROOM — OPERATION IRON ANVIL';
  let tickCount = 0;
  setInterval(() => {
    tickCount++;
    if (tickCount % 2 === 0) {
      document.title = baseTitle;
    } else {
      document.title = `⚡ ${baseTitle} ⚡`;
    }
  }, 60000); // every minute

  // ============================================
  // INIT LOG
  // ============================================
  console.log('[WAR ROOM] All systems operational. Good luck, Commander.');
  console.log(`[WAR ROOM] ${units.length} units deployed. Radio intercept active.`);

})();
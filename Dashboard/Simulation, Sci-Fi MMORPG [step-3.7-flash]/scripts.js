document.addEventListener('DOMContentLoaded', () => {
  // Server Time Clock
  const serverTimeEl = document.getElementById('server-time');
  let gameYear = 2847;
  let gameDay = 156;
  let gameHour = 14;
  let gameMinute = 27;
  let gameSecond = 3;

  const updateServerTime = () => {
    gameSecond++;
    if (gameSecond >= 60) {
      gameSecond = 0;
      gameMinute++;
      if (gameMinute >= 60) {
        gameMinute = 0;
        gameHour++;
        if (gameHour >= 24) {
          gameHour = 0;
          gameDay++;
          if (gameDay >= 365) {
            gameDay = 1;
            gameYear++;
          }
        }
      }
    }
    const formattedTime = `${gameYear}.${String(gameDay).padStart(3, '0')}.${String(gameHour).padStart(2, '0')} ${String(gameHour).padStart(2, '0')}:${String(gameMinute).padStart(2, '0')}:${String(gameSecond).padStart(2, '0')} UTC`;
    serverTimeEl.textContent = formattedTime;
  };
  setInterval(updateServerTime, 1000);

  // Sector Grid Generation
  const sectorGrid = document.getElementById('sector-grid');
  const sectorIcons = ['⭐', '🌑', '🌕', '🌖', '🌗', '🌘', '🪐', '🛸', '☄️'];
  const controlTypes = ['friendly', 'hostile', 'neutral'];
  const resourceTypes = ['none', 'tritanium', 'dilithium', 'plasma', 'dark-matter', 'credits'];
  const resourceEmojis = { none: '', tritanium: '🪨', dilithium: '💎', plasma: '⚡', 'dark-matter': '🌑', credits: '💰' };

  // Generate full 9x9 grid
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const sectorId = `${String.fromCharCode(65 + row)}${col + 1}`;
      let existingSector = document.querySelector(`.sector[data-sector="${sectorId}"]`);
      if (!existingSector) {
        existingSector = document.createElement('div');
        existingSector.className = 'sector';
        existingSector.dataset.sector = sectorId;
        sectorGrid.appendChild(existingSector);
      }
      // Set random attributes if not already set
      if (!existingSector.dataset.control) {
        existingSector.dataset.control = controlTypes[Math.floor(Math.random() * controlTypes.length)];
      }
      if (!existingSector.dataset.resources) {
        const resource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        existingSector.dataset.resources = resource;
      }
      if (!existingSector.querySelector('.sector-icon')) {
        const icon = document.createElement('span');
        icon.className = 'sector-icon';
        icon.textContent = sectorIcons[Math.floor(Math.random() * sectorIcons.length)];
        existingSector.appendChild(icon);
      }
      // Add control indicator
      if (!existingSector.querySelector('.sector-control-indicator')) {
        const controlIndicator = document.createElement('span');
        controlIndicator.className = `sector-control-indicator ${existingSector.dataset.control}`;
        existingSector.appendChild(controlIndicator);
      }
      // Add resource indicator
      if (!existingSector.querySelector('.sector-resource-indicator') && existingSector.dataset.resources !== 'none') {
        const resourceIndicator = document.createElement('span');
        resourceIndicator.className = 'sector-resource-indicator';
        resourceIndicator.textContent = resourceEmojis[existingSector.dataset.resources];
        existingSector.appendChild(resourceIndicator);
      }
    }
  }

  // Map Filter Functionality
  const mapBtns = document.querySelectorAll('.map-btn');
  mapBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mapBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.sector').forEach(sector => {
        if (filter === 'all') {
          sector.style.display = 'flex';
        } else if (filter === 'resource') {
          sector.style.display = sector.dataset.resources !== 'none' ? 'flex' : 'none';
        } else {
          sector.style.display = sector.dataset.control === filter ? 'flex' : 'none';
        }
      });
    });
  });

  // Sector Tooltips
  const tooltip = document.createElement('div');
  tooltip.className = 'sector-tooltip';
  tooltip.style.cssText = 'position: fixed; background: rgba(10,14,23,0.95); border: 1px solid var(--accent-cyan); padding: 0.5rem; border-radius: 2px; font-size: 0.75rem; pointer-events: none; z-index: 1000; display: none; box-shadow: 0 0 15px rgba(6,182,212,0.3);';
  document.body.appendChild(tooltip);

  document.querySelectorAll('.sector').forEach(sector => {
    sector.addEventListener('mouseenter', (e) => {
      const sectorId = sector.dataset.sector;
      const control = sector.dataset.control.charAt(0).toUpperCase() + sector.dataset.control.slice(1);
      const resource = sector.dataset.resources.charAt(0).toUpperCase() + sector.dataset.resources.slice(1);
      tooltip.innerHTML = `<strong>Sector ${sectorId}</strong><br>Control: ${control}<br>Resource: ${resource}`;
      tooltip.style.display = 'block';
    });
    sector.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 10}px`;
    });
    sector.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });

  // Fleet ETA Countdown & Map Tracking
  const fleetRows = document.querySelectorAll('.fleet-row');
  const fleetOverlay = document.getElementById('fleet-overlay');
  const fleetEmojis = { deployed: '🚀', mining: '⛏️', scouting: '🛸', trading: '🚢' };
  const fleetMapIcons = [];

  fleetRows.forEach(row => {
    const fleetId = row.dataset.fleetId;
    const etaEl = row.querySelector('.fleet-eta');
    const statusEl = row.querySelector('.fleet-status');
    const locationEl = row.querySelector('.fleet-location');
    const destinationEl = row.querySelector('.fleet-destination');
    let [hours, minutes, seconds] = etaEl.textContent.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Create fleet map icon
    const fleetIcon = document.createElement('div');
    fleetIcon.textContent = fleetEmojis[statusEl.classList.contains('deployed') ? 'deployed' : statusEl.classList.contains('mining') ? 'mining' : statusEl.classList.contains('scouting') ? 'scouting' : 'trading'];
    fleetIcon.style.cssText = 'position: absolute; font-size: 1.2rem; filter: drop-shadow(0 0 4px var(--accent-cyan)); transition: all 1s linear; z-index: 10;';
    fleetOverlay.appendChild(fleetIcon);
    fleetMapIcons.push({ id: fleetId, icon: fleetIcon, currentSector: locationEl.textContent.replace('Sector ', ''), destination: destinationEl.textContent.replace('Sector ', ''), eta: totalSeconds, status: statusEl.textContent.toLowerCase() });

    // Countdown ETA
    const updateETA = () => {
      if (totalSeconds <= 0) {
        etaEl.textContent = 'ARRIVED';
        statusEl.textContent = 'Arrived';
        statusEl.className = `fleet-status arrived`;
        statusEl.style.background = 'rgba(16,185,129,0.15)';
        statusEl.style.color = 'var(--accent-green)';
        statusEl.style.borderColor = 'rgba(16,185,129,0.3)';
        locationEl.textContent = destinationEl.textContent;
        destinationEl.textContent = '-';
        fleetIcon.style.filter = 'drop-shadow(0 0 4px var(--accent-green))';
        return;
      }
      totalSeconds--;
      hours = Math.floor(totalSeconds / 3600);
      minutes = Math.floor((totalSeconds % 3600) / 60);
      seconds = totalSeconds % 60;
      etaEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      // Update fleet position on map
      const progress = 1 - (totalSeconds / (hours * 3600 + minutes * 60 + seconds + 1));
      const currentSectorEl = document.querySelector(`.sector[data-sector="${fleetMapIcons.find(f => f.id === fleetId).currentSector}"]`);
      const destSectorEl = document.querySelector(`.sector[data-sector="${fleetMapIcons.find(f => f.id === fleetId).destination}"]`);
      if (currentSectorEl && destSectorEl) {
        const currentRect = currentSectorEl.getBoundingClientRect();
        const destRect = destSectorEl.getBoundingClientRect();
        const mapRect = sectorGrid.getBoundingClientRect();
        const x = currentRect.left + (destRect.left - currentRect.left) * progress - mapRect.left + 10;
        const y = currentRect.top + (destRect.top - currentRect.top) * progress - mapRect.top + 10;
        fleetIcon.style.left = `${x}px`;
        fleetIcon.style.top = `${y}px`;
      }
    };
    setInterval(updateETA, 1000);
  });

  // Resource Tick
  const resourceItems = document.querySelectorAll('.resource-item');
  const resourceStorageEls = {};
  const resourceRateEls = {};
  const storageValueEls = {};

  resourceItems.forEach(item => {
    const resource = item.dataset.resource;
    resourceStorageEls[resource] = item.querySelector('.bar--storage .bar-fill');
    resourceRateEls[resource] = parseFloat(item.querySelector('.resource-rate').textContent.replace(/[^0-9.-]/g, ''));
    storageValueEls[resource] = item.querySelector('.storage-value');
    const [current, max] = storageValueEls[resource].textContent.split(' / ').map(Number);
    item.dataset.current = current;
    item.dataset.max = max;
  });

  const updateResources = () => {
    resourceItems.forEach(item => {
      const resource = item.dataset.resource;
      const current = parseFloat(item.dataset.current);
      const max = parseFloat(item.dataset.max);
      const rate = resourceRateEls[resource];
      const increment = rate / 1200; // 1200 ticks per hour (3s per tick)
      const newCurrent = Math.min(current + increment, max);
      item.dataset.current = newCurrent;
      const percentage = (newCurrent / max) * 100;
      resourceStorageEls[resource].style.width = `${percentage}%`;
      storageValueEls[resource].textContent = `${Math.floor(newCurrent).toLocaleString()} / ${max.toLocaleString()}`;

      // Warning if over 90% capacity
      if (percentage >= 90) {
        item.style.borderLeftColor = 'var(--accent-red)';
        item.style.animation = 'alert-pulse 1s ease-in-out infinite';
      } else {
        item.style.borderLeftColor = '';
        item.style.animation = '';
      }
    });
  };
  setInterval(updateResources, 3000);

  // War Front Dynamics
  const warFronts = document.querySelectorAll('.war-front');
  const updateWarFronts = () => {
    warFronts.forEach(front => {
      const controlBar = front.querySelector('.bar--control .bar-fill');
      const controlValue = front.querySelector('.control-value');
      const casualtiesEl = front.querySelector('.front-stat:first-child .stat-value');
      const reinforcementsEl = front.querySelector('.front-stat:last-child .stat-value');
      const statusEl = front.querySelector('.front-status');

      let currentControl = parseFloat(controlValue.textContent);
      const controlChange = (Math.random() * 4) - 2; // -2 to +2
      const newControl = Math.max(0, Math.min(100, currentControl + controlChange));
      controlBar.style.width = `${newControl}%`;
      controlValue.textContent = `${Math.floor(newControl)}%`;

      // Update casualties
      let casualties = parseInt(casualtiesEl.textContent.replace(/,/g, ''));
      casualties += Math.floor(Math.random() * 50) - 20;
      casualtiesEl.textContent = casualties.toLocaleString();

      // Update reinforcements
      let reinforcements = parseInt(reinforcementsEl.textContent.replace(/,/g, ''));
      reinforcements += Math.floor(Math.random() * 100) - 30;
      reinforcementsEl.textContent = reinforcements.toLocaleString();

      // Update status
      if (newControl < 30 && statusEl.classList.contains('stable')) {
        statusEl.textContent = 'Active';
        statusEl.className = 'front-status active';
      } else if (newControl < 20 && !statusEl.classList.contains('critical')) {
        statusEl.textContent = 'Critical';
        statusEl.className = 'front-status critical';
      } else if (newControl > 70 && statusEl.classList.contains('active')) {
        statusEl.textContent = 'Stable';
        statusEl.className = 'front-status stable';
      }
    });
  };
  setInterval(updateWarFronts, 5000);

  // Event Log Generator
  const eventLog = document.querySelector('.event-log');
  const eventTypes = [
    { type: 'critical', icon: '⚠️', texts: ['Xenon fleet spotted in Sector 7G', 'Dilithium storage at critical capacity', 'Outpost 12 under heavy attack'] },
    { type: 'info', icon: '📡', texts: ['Long-range scan complete for Sector D4', 'New trade route discovered: A1 to C3', 'Fleet #FLT-003 refueled at B2 Hub'] },
    { type: 'success', icon: '✅', texts: ['Trade convoy #TC-042 arrived at destination', 'Research project completed: Plasma Coil V2', 'Sector 12B secured by Terran forces'] },
    { type: 'warning', icon: '⚠️', texts: ['Plasma levels dropping in Sector B1', 'Fleet #FLT-004 low on fuel', 'Unusual energy signature detected in Sector E5'] }
  ];

  const addRandomEvent = () => {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const eventText = eventType.texts[Math.floor(Math.random() * eventType.texts.length)];
    const now = new Date();
    const eventTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const eventItem = document.createElement('li');
    eventItem.className = `event-item event--${eventType.type}`;
    eventItem.innerHTML = `<span class="event-time">${eventTime}</span><span class="event-icon">${eventType.icon}</span><span class="event-text">${eventText}</span>`;
    eventLog.insertBefore(eventItem, eventLog.firstChild);
    // Keep only 20 events max
    if (eventLog.children.length > 20) {
      eventLog.removeChild(eventLog.lastChild);
    }
  };
  setInterval(addRandomEvent, 10000);
  // Add initial event
  addRandomEvent();

  // System Metrics Fluctuation
  const metricValues = document.querySelectorAll('.metric-value');
  const updateMetrics = () => {
    // Players online: 280k-290k
    metricValues[0].textContent = (280000 + Math.floor(Math.random() * 10000)).toLocaleString();
    // Server load: 40-45%
    metricValues[1].textContent = `${40 + Math.floor(Math.random() * 5)}%`;
    // Latency: 10-15ms
    metricValues[2].textContent = `${10 + Math.floor(Math.random() * 5)}ms`;
    // Active instances: 1200-1300
    metricValues[3].textContent = (1200 + Math.floor(Math.random() * 100)).toLocaleString();
  };
  setInterval(updateMetrics, 4000);

  // Player Bar Regeneration
  const hpBar = document.querySelector('.bar--hp .bar-fill');
  const hpValue = document.querySelector('.bar--hp .bar-value');
  const mpBar = document.querySelector('.bar--mp .bar-fill');
  const mpValue = document.querySelector('.bar--mp .bar-value');
  const xpBar = document.querySelector('.bar--xp .bar-fill');
  const xpValue = document.querySelector('.bar--xp .bar-value');

  let hp = 8200;
  let mp = 3200;
  let xp = 47000;

  const updatePlayerBars = () => {
    hp = Math.min(hp + Math.floor(Math.random() * 10) + 5, 10000);
    mp = Math.min(mp + Math.floor(Math.random() * 7) + 3, 5000);
    xp = Math.min(xp + Math.floor(Math.random() * 20) + 10, 100000);

    hpBar.style.width = `${(hp / 10000) * 100}%`;
    hpValue.textContent = `${hp.toLocaleString()}/10,000`;
    mpBar.style.width = `${(mp / 5000) * 100}%`;
    mpValue.textContent = `${mp.toLocaleString()}/5,000`;
    xpBar.style.width = `${(xp / 100000) * 100}%`;
    xpValue.textContent = `${xp.toLocaleString()}/100,000`;
  };
  setInterval(updatePlayerBars, 2000);

  // Alert Interactions
  const criticalAlert = document.querySelector('.alert--critical');
  const notificationAlert = document.querySelector('.alert--warning');
  const sector7GFront = document.querySelector('.war-front[data-front="sector-7g"]');
  const eventLogSection = document.querySelector('.panel--event-log');

  criticalAlert.addEventListener('click', () => {
    sector7GFront.scrollIntoView({ behavior: 'smooth', block: 'center' });
    sector7GFront.style.boxShadow = '0 0 30px rgba(239,68,68,0.5)';
    setTimeout(() => {
      sector7GFront.style.boxShadow = '';
    }, 2000);
  });

  notificationAlert.addEventListener('click', () => {
    eventLogSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Random Glitch Effect
  const applyGlitch = () => {
    const topBar = document.querySelector('.top-bar');
    topBar.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
    topBar.style.filter = `hue-rotate(${Math.random() * 30}deg)`;
    setTimeout(() => {
      topBar.style.transform = '';
      topBar.style.filter = '';
    }, 100);
  };
  setInterval(applyGlitch, 15000);

  // Auto-scroll event log to newest
  const scrollEventLog = () => {
    eventLog.scrollTop = 0;
  };
  eventLog.addEventListener('DOMNodeInserted', scrollEventLog);
});
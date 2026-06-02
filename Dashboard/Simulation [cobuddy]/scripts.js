// GLOBE-7 PLANETARY MONITORING SYSTEM — SCRIPTS

(function () {
  'use strict';

  // --- Clock ---
  function updateClock() {
    const now = new Date();
    const utc = now.toISOString().slice(11, 19) + ' UTC';
    const el = document.getElementById('clock');
    if (el) el.textContent = utc;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Population Ticker ---
  let basePop = 8124731082;
  let birthsBase = 302847;
  let deathsBase = 166412;
  let popEl = document.getElementById('popTicker');
  let birthsEl = document.getElementById('birthsToday');
  let deathsEl = document.getElementById('deathsToday');

  function updatePopulation() {
    const now = Date.now();
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const msElapsed = now - dayStart.getTime();
    const secInDay = 86400;
    const fraction = msElapsed / (secInDay * 1000);

    const pop = Math.floor(basePop + (fraction * birthsBase - fraction * deathsBase));
    const births = Math.floor(birthsBase * fraction);
    const deaths = Math.floor(deathsBase * fraction);

    if (popEl) popEl.textContent = pop.toLocaleString();
    if (birthsEl) birthsEl.textContent = births.toLocaleString();
    if (deathsEl) deathsEl.textContent = deaths.toLocaleString();
  }
  setInterval(updatePopulation, 1000);
  updatePopulation();

  // --- Seismic Feed Ticker ---
  const seismicData = [
    { time: '14:22:07', mag: '5.4M', loc: '35.2°N 139.7°E', type: '⚠ STRONG' },
    { time: '14:18:33', mag: '3.1M', loc: '-33.4°S 70.6°W', type: '● MILD' },
    { time: '14:15:01', mag: '6.7M', loc: '28.2°N 87.0°E', type: '⚠ STRONG' },
    { time: '14:11:44', mag: '2.8M', loc: '64.1°N 21.9°W', type: '● MILD' },
    { time: '14:08:19', mag: '4.9M', loc: '-6.2°S 106.8°E', type: '⚠ STRONG' },
    { time: '14:04:55', mag: '1.9M', loc: '42.4°N 18.7°E', type: '● MILD' },
    { time: '13:59:30', mag: '5.1M', loc: '-15.4°S 167.9°E', type: '⚠ STRONG' },
    { time: '13:55:12', mag: '2.3M', loc: '19.4°N 155.3°W', type: '● MILD' },
  ];

  const recentSeismic = document.querySelector('.recent-seismic');
  function rotateSeismic() {
    if (!recentSeismic) return;
    const entries = recentSeismic.querySelectorAll('.seismic-entry');
    const total = entries.length;
    if (total === 0) return;

    const lastEntry = entries[total - 1];
    const clone = lastEntry.cloneNode(true);
    clone.querySelector('.seis-time').textContent = new Date().toTimeString().slice(0, 8);
    const randomMag = (Math.random() * 6 + 1).toFixed(1) + 'M';
    clone.querySelector('.seis-mag').textContent = randomMag;
    clone.querySelector('.seis-type').textContent = parseFloat(randomMag) > 4 ? '⚠ STRONG' : '● MILD';

    const lats = ['-33.4°S', '28.2°N', '-6.2°S', '42.4°N', '-15.4°S', '19.4°N', '35.2°N', '64.1°N', '51.5°N', '23.1°S'];
    const lons = ['70.6°W', '87.0°E', '106.8°E', '18.7°E', '167.9°E', '155.3°W', '139.7°E', '21.9°W', '0.1°W', '118.0°E'];
    const li = Math.floor(Math.random() * lats.length);
    const lo = Math.floor(Math.random() * lons.length);
    clone.querySelector('.seis-loc').textContent = `${lats[li]} ${lons[lo]}`;

    recentSeismic.appendChild(clone);
    entries[0].remove();
  }
  setInterval(rotateSeismic, 4000);

  // --- Alert Feed ---
  const alertData = [
    { text: '🔴 VOLCANIC ERUPTION — Merapi, Indonesia — Ash column 8km', level: 'critical' },
    { text: '🟡 EARTHQUAKE — 6.2M off coast Chile — Tsunami watch', level: 'warning' },
    { text: '🟡 HURRICANE — Mariah Cat 4 approaching Philippines', level: 'warning' },
    { text: '🔵 OZONE HOLE — Expansion to 24.8M km² recorded', level: 'info' },
    { text: '🟡 DROUGHT — Horn of Africa — 12M affected', level: 'warning' },
    { text: '🔴 CONFLICT — Eastern Mediterranean — Active engagement', level: 'critical' },
    { text: '🔵 ARCTIC ICE — Record low extent: 3.74M km²', level: 'info' },
    { text: '🟡 WILDFIRE — Canada — 2.1M hectares burning', level: 'warning' },
    { text: '🔵 SOLAR STORM — CME detected — Minor geomagnetic disturbance', level: 'info' },
    { text: '🟡 FLOOD — Pakistan — Indus River breach — 8M displaced', level: 'warning' },
    { text: '🔴 TSUNAMI — 4.1M Pacific — Advisory issued', level: 'critical' },
    { text: '🟡 HEATWAVE — Europe — 42°C recorded in Spain', level: 'warning' },
    { text: '🔵 SPECIES ALERT — Coral bleaching event — Great Barrier Reef', level: 'info' },
    { text: '🔴 PLUME DETECTED — Nord Stream region — Monitoring', level: 'critical' },
    { text: '🟡 AIR QUALITY — Delhi AQI 412 — Hazardous', level: 'warning' },
  ];

  const alertsFeed = document.getElementById('alertsFeed');
  let alertIndex = 0;

  function addAlert() {
    if (!alertsFeed) return;
    const data = alertData[alertIndex % alertData.length];
    const entry = document.createElement('div');
    entry.className = 'alert-entry ' + data.level;
    entry.textContent = data.text;
    alertsFeed.insertBefore(entry, alertsFeed.firstChild);

    if (alertsFeed.children.length > 12) {
      alertsFeed.removeChild(alertsFeed.lastChild);
    }
    alertIndex++;
  }
  setInterval(addAlert, 6000);
  addAlert();

  // --- Log Entries ---
  const logMessages = [
    '[SCAN] Surface thermal sweep complete',
    '[DATA] Ocean buoy array synced — 2,847 nodes',
    '[WARN] Seismic anomaly detected — Ring of Fire',
    '[GPS] Satellite constellation nominal — 421 tracked',
    '[NET] Comms relay handshake — all channels open',
    '[SCAN] Agricultural zone assessment — cycle 447',
    '[DATA] Atmospheric CO₂ sampled — 421.3 ppm',
    '[OK] All subsystems reporting — 47/47 online',
    '[SCAN] Polar ice extent measurement — +0.3% w/w',
    '[DATA] Biomass index update — oceanic: 7.4/10',
    '[WARN] UV index elevated — ozone thinning detected',
    '[NET] Deep sea probe telemetry — depth 4,200m',
    '[SCAN] Deforestation alert — Amazon basin — 340ha',
    '[DATA] Trade flow analysis — 14,832 vessels active',
    '[OK] Backup systems check — redundant array healthy',
    '[WARN] Methane spike — Siberian permafrost — +12ppb',
    '[SCAN] Glacier retreat measurement — -0.6km/yr',
    '[DATA] Seafloor thermal vent activity — 23 active',
    '[NET] Undersea cable integrity — all 12 routes nominal',
    '[OK] Calibration complete — spectral sensors ±0.01%',
  ];

  const logEntries = document.getElementById('logEntries');
  let logIndex = 0;

  function addLog() {
    if (!logEntries) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const msg = logMessages[logIndex % logMessages.length];
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">${time}</span><span class="log-msg">${msg}</span>`;
    logEntries.insertBefore(entry, logEntries.firstChild);

    if (logEntries.children.length > 20) {
      logEntries.removeChild(logEntries.lastChild);
    }
    logIndex++;
  }
  setInterval(addLog, 3000);
  addLog();

  // --- Map Coordinate Update ---
  const mapCoords = document.querySelector('.map-coords');
  const mapOverlay = document.getElementById('mapOverlay');

  function updateMapCoords() {
    if (mapCoords) {
      const lat = (Math.random() * 180 - 90).toFixed(3);
      const lon = (Math.random() * 360 - 180).toFixed(3);
      const zoom = (1 + Math.random() * 0.5).toFixed(1);
      mapCoords.textContent = `LAT: ${lat}° | LON: ${lon}° | ZOOM: ${zoom}x`;
    }

    // Map overlay pulse
    if (mapOverlay) {
      const pulse = document.createElement('div');
      pulse.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(0, 212, 255, 0.6);
        border-radius: 50%;
        top: ${20 + Math.random() * 60}%;
        left: ${10 + Math.random() * 80}%;
        box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
        animation: map-pulse 2s ease-out forwards;
        pointer-events: none;
      `;
      mapOverlay.appendChild(pulse);
      setTimeout(() => pulse.remove(), 2000);
    }
  }
  setInterval(updateMapCoords, 2000);

  // --- Trade Route Visualization ---
  const tradeRoutes = document.getElementById('tradeRoutes');
  function drawTradeRoutes() {
    if (!tradeRoutes) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;inset:0;opacity:0.3;pointer-events:none;';

    const routes = [
      'M10,20 Q30,10 50,25 Q70,40 90,20',
      'M20,40 Q40,30 60,45 Q80,55 95,35',
      'M5,60 Q25,50 45,65 Q65,75 85,55',
      'M15,75 Q35,65 55,80 Q75,90 90,70',
      'M30,10 Q50,5 70,15 Q85,25 95,15',
    ];

    routes.forEach((d, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', i % 2 === 0 ? '#a855f7' : '#00d4ff');
      path.setAttribute('stroke-width', '0.5');
      path.setAttribute('opacity', '0.4');
      svg.appendChild(path);
    });

    tradeRoutes.appendChild(svg);
  }
  drawTradeRoutes();

  // --- Animate bar fills on load ---
  function animateBars() {
    document.querySelectorAll('.bar-fill, .r-bar-fill, .c-bar-fill, .age-fill, .climate-bar').forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      bar.style.transition = 'width 1.5s ease-out';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }
  setTimeout(animateBars, 300);

  // --- Stagger panel reveals ---
  function revealPanels() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, i) => {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(8px)';
      panel.style.transition = `opacity 0.4s ease ${i * 0.03}s, transform 0.4s ease ${i * 0.03}s`;
      setTimeout(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      }, 50);
    });
  }
  setTimeout(revealPanels, 100);

  // --- Ambient data fluctuation ---
  function fluctuateValues() {
    document.querySelectorAll('.o-val, .ts-val, .e-val, .ps-val, .metric-val').forEach(el => {
      if (Math.random() > 0.7) {
        const original = el.textContent;
        const hasSign = original.match(/^[+-]/);
        const num = parseFloat(original.replace(/[^0-9.+-]/g, ''));
        if (!isNaN(num) && Math.abs(num) < 1000) {
          const fluctuation = num * (0.998 + Math.random() * 0.004);
          el.style.transition = 'color 0.5s';
          el.style.color = '#00d4ff';
          setTimeout(() => {
            el.style.color = '';
          }, 500);
        }
      }
    });
  }
  setInterval(fluctuateValues, 5000);

  // --- Add map pulse keyframe dynamically ---
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes map-pulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  // --- Secondary ticker fade effect ---
  const tickerItems = document.querySelectorAll('.ticker-item');
  tickerItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transition = `opacity 0.3s ease ${i * 0.05}s`;
    setTimeout(() => {
      item.style.opacity = '1';
    }, 100);
  });

  // --- Bottom ticker marquee start ---
  const bottomTicker = document.getElementById('bottomTicker');
  if (bottomTicker) {
    // Duplicate content for seamless loop
    const clone = bottomTicker.innerHTML;
    bottomTicker.innerHTML += clone;
  }

  // --- Ocean current arrow animation ---
  document.querySelectorAll('.current-arrow').forEach(arrow => {
    arrow.style.animation = `currentFlow ${3 + Math.random() * 2}s ease-in-out infinite alternate`;
  });

  // Add current flow keyframe
  const styleSheet2 = document.createElement('style');
  styleSheet2.textContent = `
    @keyframes currentFlow {
      0% { opacity: 0.3; transform: translateX(-5px); }
      100% { opacity: 0.7; transform: translateX(5px); }
    }
  `;
  document.head.appendChild(styleSheet2);

  // --- Seismic bar pulse ---
  setInterval(() => {
    document.querySelectorAll('.tectonic-item').forEach(item => {
      const bar = item.querySelector('.bar-fill');
      if (bar) {
        bar.style.transition = 'transform 0.2s';
        bar.style.transform = 'scaleY(1.5)';
        setTimeout(() => {
          bar.style.transform = 'scaleY(1)';
        }, 200);
      }
    });
  }, 8000);

  // --- Volcanic status flash ---
  setInterval(() => {
    document.querySelectorAll('.volcano-status').forEach(status => {
      if (status.textContent.includes('ERUPTING')) {
        status.style.boxShadow = '0 0 8px rgba(255,59,92,0.3)';
        setTimeout(() => {
          status.style.boxShadow = '';
        }, 300);
      }
    });
  }, 2000);

  // --- Trade route shimmer ---
  const tradeVisual = document.querySelector('.trade-route-visual');
  if (tradeVisual) {
    tradeVisual.addEventListener('mouseenter', () => {
      tradeVisual.style.background = 'rgba(168,85,247,0.06)';
      tradeVisual.style.transition = 'background 0.3s';
    });
    tradeVisual.addEventListener('mouseleave', () => {
      tradeVisual.style.background = '';
    });
  }

  // --- Resource bar hover ---
  document.querySelectorAll('.resource-entry').forEach(entry => {
    entry.addEventListener('mouseenter', () => {
      entry.style.background = 'rgba(0,0,0,0.15)';
      entry.style.borderRadius = '1px';
      entry.style.padding = '2px 3px';
      entry.style.transition = 'all 0.2s';
    });
    entry.addEventListener('mouseleave', () => {
      entry.style.background = '';
      entry.style.borderRadius = '';
      entry.style.padding = '';
    });
  });

  // --- Weather item highlight ---
  document.querySelectorAll('.weather-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = 'rgba(0,212,255,0.05)';
      item.style.borderRadius = '1px';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '';
      item.style.borderRadius = '';
    });
  });

  // --- Continent bar animation ---
  function animateContinentBars() {
    document.querySelectorAll('.c-bar-fill').forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      bar.style.transition = 'width 1s ease-out';
      setTimeout(() => {
        bar.style.width = width;
      }, 200);
    });
  }
  setTimeout(animateContinentBars, 500);

  // --- Age distribution animation ---
  function animateAgeBars() {
    document.querySelectorAll('.age-fill').forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      bar.style.transition = 'width 1.2s ease-out';
      setTimeout(() => {
        bar.style.width = width;
      }, 300);
    });
  }
  setTimeout(animateAgeBars, 600);

  // --- Console easter egg ---
  console.log('%c🌍 GLOBE-7 PLANETARY MONITORING SYSTEM', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
  console.log('%cAll systems nominal. Welcome, operator.', 'color: #00ff88; font-size: 12px;');
  console.log('%cSurface thermal sweep: COMPLETE', 'color: #6b7d8e; font-size: 10px;');
  console.log('%cOcean buoy array: SYNCED — 2,847 nodes', 'color: #6b7d8e; font-size: 10px;');
  console.log('%cAtmospheric CO₂: 421.3 ppm', 'color: #ff3b5c; font-size: 10px;');
})();
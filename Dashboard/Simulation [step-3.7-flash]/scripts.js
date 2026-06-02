document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const utcTimeEl = document.getElementById('utcTime');
  const utcDateEl = document.getElementById('utcDate');
  const missionTimerEl = document.getElementById('missionTimer');
  const uptimeEl = document.getElementById('uptime');
  const tectonicListEl = document.getElementById('tectonicList');
  const quakeCountEl = document.getElementById('quakeCount');
  const maxMagEl = document.getElementById('maxMag');
  const avgDepthEl = document.getElementById('avgDepth');
  const volcanoListEl = document.getElementById('volcanoList');
  const worldPopEl = document.getElementById('worldPop');
  const birthsPerMinEl = document.getElementById('birthsPerMin');
  const deathsPerMinEl = document.getElementById('deathsPerMin');
  const alertsFeedEl = document.getElementById('alertsFeed');
  const alertCountHdrEl = document.getElementById('alertCountHdr');
  const alertCountBadgeEl = document.getElementById('alertCountBadge');
  const coordReadoutEl = document.getElementById('coordReadout');
  const globeSvg = document.getElementById('globeSvg');
  const cpuLoadEl = document.getElementById('cpuLoad');
  const memLoadEl = document.getElementById('memLoad');
  const netLoadEl = document.getElementById('netLoad');
  const dataRateHdrEl = document.getElementById('dataRateHdr');
  const dataRateFooterEl = document.getElementById('dataRateFooter');
  const satCountEl = document.getElementById('satCount');
  const nodeCountEl = document.getElementById('nodeCount');

  // State
  let pageLoadTime = Date.now();
  let missionStart = new Date('2020-01-01T00:00:00Z');
  let worldPopulation = 8045311447;
  let alertCount = 0;
  let tectonicData = [];
  let volcanoData = [];
  let currentMaxMag = 0;
  let totalDepth = 0;

  // Helpers
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomFloat = (min, max, decimals = 2) => (Math.random() * (max - min) + min).toFixed(decimals);
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatTime = (date) => date.toISOString().split('T')[1].split('.')[0];
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Clock & Timers
  const updateClocks = () => {
    const now = new Date();
    utcTimeEl.textContent = formatTime(now);
    utcDateEl.textContent = formatDate(now);

    const missionDiff = now - missionStart;
    const missionDays = Math.floor(missionDiff / (1000 * 60 * 60 * 24));
    const missionHours = Math.floor((missionDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const missionMinutes = Math.floor((missionDiff % (1000 * 60 * 60)) / (1000 * 60));
    const missionSeconds = Math.floor((missionDiff % (1000 * 60)) / 1000);
    missionTimerEl.textContent = `${String(missionDays).padStart(3, '0')}:${String(missionHours).padStart(2, '0')}:${String(missionMinutes).padStart(2, '0')}:${String(missionSeconds).padStart(2, '0')}`;

    const uptimeDiff = now - pageLoadTime;
    const uptimeHours = Math.floor(uptimeDiff / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptimeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const uptimeSeconds = Math.floor((uptimeDiff % (1000 * 60)) / 1000);
    uptimeEl.textContent = `${String(uptimeHours).padStart(3, '0')}:${String(uptimeMinutes).padStart(2, '0')}:${String(uptimeSeconds).padStart(2, '0')}`;
  };
  setInterval(updateClocks, 1000);
  updateClocks();

  // Tectonic Activity
  const tectonicLocations = ['Pacific Ring of Fire', 'Mid-Atlantic Ridge', 'Alpine Fault', 'San Andreas Fault', 'Japan Trench', 'Chile Trench', 'Turkey Fault Line', 'Himalayan Seismic Zone', 'East African Rift', 'Philippine Fault'];
  const generateTectonicEntry = () => {
    const mag = randomFloat(2.5, 7.2);
    const depth = randomInt(5, 700);
    const location = tectonicLocations[randomInt(0, tectonicLocations.length - 1)];
    const time = new Date(Date.now() - randomInt(0, 86400000)).toISOString().split('T')[1].split('.')[0];
    return { mag, depth, location, time };
  };

  const initTectonicData = () => {
    for (let i = 0; i < 12; i++) {
      tectonicData.push(generateTectonicEntry());
    }
    tectonicData.sort((a, b) => b.mag - a.mag);
    currentMaxMag = tectonicData[0].mag;
    totalDepth = tectonicData.reduce((sum, item) => sum + item.depth, 0);
    renderTectonicList();
    updateTectonicStats();
  };

  const renderTectonicList = () => {
    tectonicListEl.innerHTML = tectonicData.map(quake => `
      <div class="tectonic-item">
        <span class="tectonic-mag">${quake.mag}</span>
        <span class="tectonic-loc">${quake.location}</span>
        <span class="tectonic-depth">${quake.depth}km</span>
        <span class="tectonic-time">${quake.time}</span>
      </div>
    `).join('');
  };

  const updateTectonicStats = () => {
    quakeCountEl.textContent = tectonicData.length;
    maxMagEl.textContent = currentMaxMag.toFixed(1);
    avgDepthEl.textContent = Math.round(totalDepth / tectonicData.length);
  };

  const addNewTectonicEntry = () => {
    const newQuake = generateTectonicEntry();
    tectonicData.unshift(newQuake);
    if (newQuake.mag > currentMaxMag) currentMaxMag = newQuake.mag;
    totalDepth += newQuake.depth;
    if (tectonicData.length > 15) {
      const removed = tectonicData.pop();
      totalDepth -= removed.depth;
    }
    renderTectonicList();
    updateTectonicStats();
  };
  setInterval(addNewTectonicEntry, randomInt(8000, 15000));
  initTectonicData();

  // Volcanic Activity
  const volcanoNames = ['Etna', 'Kilauea', 'Stromboli', 'Sakurajima', 'Mount Merapi', 'Mount Yasur', 'Eyjafjallajökull', 'Mount Fuji', 'Popocatépetl', 'Mount Rainier'];
  const initVolcanoData = () => {
    volcanoData = volcanoNames.map(name => ({
      name,
      status: Math.random() > 0.7 ? 'active' : 'dormant',
      alertLevel: Math.random() > 0.8 ? 'elevated' : 'normal'
    }));
    renderVolcanoList();
  };

  const renderVolcanoList = () => {
    volcanoListEl.innerHTML = volcanoData.map(vol => `
      <div class="volcano-item ${vol.status === 'active' ? 'active' : ''}">
        <span class="volcano-name">${vol.name}</span>
        <span class="volcano-status ${vol.status}">${vol.status.toUpperCase()}</span>
      </div>
    `).join('');
  };

  const updateVolcanoStatus = () => {
    const randomVol = volcanoData[randomInt(0, volcanoData.length - 1)];
    randomVol.status = Math.random() > 0.6 ? 'active' : 'dormant';
    renderVolcanoList();
  };
  setInterval(updateVolcanoStatus, 20000);
  initVolcanoData();

  // Population Ticker
  const updatePopulation = () => {
    const increment = randomInt(2, 4);
    worldPopulation += increment;
    worldPopEl.textContent = formatNumber(worldPopulation);
    worldPopEl.classList.add('data-updated');
    setTimeout(() => worldPopEl.classList.remove('data-updated'), 600);

    const births = randomInt(250, 262);
    const deaths = randomInt(105, 112);
    birthsPerMinEl.textContent = births;
    deathsPerMinEl.textContent = deaths;
  };
  setInterval(updatePopulation, 1000);

  // Disaster Feed
  const disasterTypes = [
    { icon: '🌀', text: 'Tropical storm forming' },
    { icon: '🌪️', text: 'Tornado outbreak reported' },
    { icon: '🌊', text: 'Flash flood warning' },
    { icon: '🔥', text: 'Wildfire spreading rapidly' },
    { icon: '❄️', text: 'Blizzard conditions' },
    { icon: '🌋', text: 'Volcanic ash cloud detected' },
    { icon: '🌍', text: 'Minor seismic activity' },
    { icon: '⛈️', text: 'Severe thunderstorm' }
  ];
  const disasterRegions = ['Southeast US', 'South Asia', 'Mediterranean', 'West Africa', 'East Asia', 'South America', 'Northern Europe', 'Oceania'];

  const addDisasterEntry = () => {
    const disaster = disasterTypes[randomInt(0, disasterTypes.length - 1)];
    const region = disasterRegions[randomInt(0, disasterRegions.length - 1)];
    const time = new Date().toISOString().split('T')[1].split('.')[0];
    const isCritical = Math.random() > 0.8;

    const entry = document.createElement('div');
    entry.className = `disaster-item ${isCritical ? 'critical' : ''}`;
    entry.innerHTML = `
      <span class="disaster-icon">${disaster.icon}</span>
      <span class="disaster-text">${disaster.text} - ${region}</span>
      <span class="disaster-time">${time}</span>
    `;

    alertsFeedEl.insertBefore(entry, alertsFeedEl.firstChild);
    if (alertsFeedEl.children.length > 20) {
      alertsFeedEl.removeChild(alertsFeedEl.lastChild);
    }
  };
  setInterval(addDisasterEntry, randomInt(7000, 14000));
  for (let i = 0; i < 8; i++) addDisasterEntry();

  // Alerts Feed
  const alertTypes = [
    { level: 'critical', text: 'Tsunami warning issued for coastal regions' },
    { level: 'critical', text: 'Category 5 cyclone approaching' },
    { level: 'warning', text: 'Power grid overload detected in EU' },
    { level: 'warning', text: 'Water supply contamination alert' },
    { level: 'info', text: 'Satellite constellation update complete' },
    { level: 'info', text: 'New climate data batch processed' },
    { level: 'warning', text: 'Air quality index hazardous' },
    { level: 'critical', text: 'Earthquake damage assessment required' }
  ];
  const alertRegions = ['Global', 'Asia Pacific', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

  const addAlertEntry = () => {
    const alert = alertTypes[randomInt(0, alertTypes.length - 1)];
    const region = alertRegions[randomInt(0, alertRegions.length - 1)];
    const time = new Date().toISOString().split('T')[1].split('.')[0];
    alertCount++;

    const entry = document.createElement('div');
    entry.className = `alert-item ${alert.level}`;
    entry.innerHTML = `
      <span class="alert-level ${alert.level}">${alert.level.toUpperCase()}</span>
      <span class="alert-text">${alert.text}</span>
      <span class="alert-region">${region}</span>
      <span class="alert-time">${time}</span>
    `;

    alertsFeedEl.insertBefore(entry, alertsFeedEl.firstChild);
    if (alertsFeedEl.children.length > 25) {
      alertsFeedEl.removeChild(alertsFeedEl.lastChild);
    }

    alertCountHdrEl.textContent = alertCount;
    alertCountBadgeEl.textContent = alertCount;
    alertCountHdrEl.classList.add('data-updated');
    alertCountBadgeEl.classList.add('data-updated');
    setTimeout(() => {
      alertCountHdrEl.classList.remove('data-updated');
      alertCountBadgeEl.classList.remove('data-updated');
    }, 600);
  };
  setInterval(addAlertEntry, randomInt(4000, 10000));
  for (let i = 0; i < 5; i++) addAlertEntry();

  // Globe Interaction
  globeSvg.addEventListener('mousemove', (e) => {
    const rect = globeSvg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const lon = ((x - centerX) / centerX) * 180;
    const lat = 90 - ((y - centerY) / centerY) * 90;
    coordReadoutEl.textContent = `LAT ${lat.toFixed(2)} | LON ${lon.toFixed(2)}`;
  });

  globeSvg.addEventListener('mouseleave', () => {
    coordReadoutEl.textContent = 'LAT 0.00 | LON 0.00';
  });

  // Periodic Data Updates
  const updateRandomStats = () => {
    const dataRate = randomFloat(4.2, 5.1);
    dataRateHdrEl.textContent = dataRate;
    dataRateFooterEl.textContent = dataRate;
    dataRateHdrEl.classList.add('data-updated');
    dataRateFooterEl.classList.add('data-updated');
    setTimeout(() => {
      dataRateHdrEl.classList.remove('data-updated');
      dataRateFooterEl.classList.remove('data-updated');
    }, 600);

    cpuLoadEl.textContent = `${randomInt(18, 42)}%`;
    memLoadEl.textContent = `${randomInt(38, 52)}%`;
    netLoadEl.textContent = `${randomFloat(0.9, 1.7)} Gbps`;

    satCountEl.textContent = formatNumber(randomInt(8240, 8255));
    nodeCountEl.textContent = formatNumber(randomInt(12480, 12505));
  };
  setInterval(updateRandomStats, 3000);

  // Space Launch Countdowns
  const launchTimers = document.querySelectorAll('.launch-time');
  const updateLaunchTimers = () => {
    launchTimers.forEach(timer => {
      let [prefix, time] = timer.textContent.split(' ');
      let [h, m, s] = time.split(':').map(Number);
      if (prefix === 'T-') {
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; prefix = 'T+'; }
      } else {
        s++;
        if (s > 59) { s = 0; m++; }
        if (m > 59) { m = 0; h++; }
      }
      timer.textContent = `${prefix}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    });
  };
  setInterval(updateLaunchTimers, 1000);

  // Globe Marker Random Flash
  const globeMarkers = document.querySelectorAll('.gmarker');
  const flashRandomMarker = () => {
    const marker = globeMarkers[randomInt(0, globeMarkers.length - 1)];
    marker.style.opacity = '1';
    marker.style.filter = 'url(#glowCyan) brightness(1.5)';
    setTimeout(() => {
      marker.style.opacity = '';
      marker.style.filter = '';
    }, 300);
  };
  setInterval(flashRandomMarker, 2000);

  // Trade Route Dot Animation Randomization
  const routeDots = document.querySelectorAll('.rdot');
  routeDots.forEach(dot => {
    dot.style.animationDelay = `${randomInt(0, 3)}s`;
    dot.style.animationDuration = `${randomFloat(2, 4)}s`;
  });
});
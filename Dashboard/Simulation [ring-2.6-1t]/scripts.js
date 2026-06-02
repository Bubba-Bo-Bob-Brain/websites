/* ═══════════════════════════════════════════════════════════════
   GAIA-Σ PLANETARY SIMULATION DASHBOARD — JAVASCRIPT ENGINE
   Brings the static dashboard to life with live data simulation,
   sparklines, real-time counters, and dynamic feeds.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Utility Functions ──
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function formatNum(n) {
    return n.toLocaleString('en-US');
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ── Sparkline Renderer ──
  // Draws small time-series sparklines on each vital's canvas
  function drawSparkline(canvas, key) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Size canvas to fit container
    canvas.width = rect.width * dpr;
    canvas.height = 28 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '28px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = 28;
    const points = 40;

    // Generate or retrieve data
    if (!canvas._data) {
      canvas._data = [];
      let base;
      switch (key) {
        case 'mass': base = 5.972; break;
        case 'diameter': base = 12742; break;
        default: base = 1;
      }
      for (let i = 0; i < points; i++) {
        canvas._data.push(base + rand(-base * 0.001, base * 0.001));
      }
    }

    const data = canvas._data;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = w / (points - 1);

    ctx.clearRect(0, 0, w, h);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i < points; i++) {
      const x = i * step;
      const y = h - ((data[i] - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const x = i * step;
      const y = h - ((data[i] - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Push new data point (simulate drift)
    let newVal;
    switch (key) {
      case 'mass': newVal = 5.972 + rand(-0.0005, 0.0005); break;
      case 'diameter': newVal = 12742 + rand(-0.01, 0.01); break;
      default: newVal = 1;
    }
    data.push(newVal);
    data.shift();
  }

  // ── Weather Data ──
  const cities = [
    { name: 'New York', temp: 22, humid: 65, icon: '🌤️' },
    { name: 'London', temp: 16, humid: 78, icon: '🌧️' },
    { name: 'Tokyo', temp: 28, humid: 72, icon: '⛅' },
    { name: 'Sydney', temp: 19, humid: 55, icon: '☀️' },
    { name: 'Moscow', temp: 8, humid: 80, icon: '🌨️' },
    { name: 'Dubai', temp: 41, humid: 45, icon: '☀️' },
    { name: 'São Paulo', temp: 25, humid: 70, icon: '🌦️' },
    { name: 'Mumbai', temp: 30, humid: 85, icon: '🌧️' },
    { name: 'Cairo', temp: 36, humid: 25, icon: '☀️' },
    { name: 'Beijing', temp: 27, humid: 60, icon: '🌫️' },
    { name: 'Paris', temp: 18, humid: 72, icon: '🌤️' },
    { name: 'Singapore', temp: 31, humid: 84, icon: '⛈️' },
    { name: 'Rio', temp: 26, humid: 75, icon: '🌤️' },
    { name: 'Toronto', temp: 14, humid: 62, icon: '🌥️' },
    { name: 'Seoul', temp: 24, humid: 58, icon: '⛅' },
    { name: 'Nairobi', temp: 23, humid: 50, icon: '🌤️' },
  ];

  function renderWeather() {
    const grid = document.getElementById('weather-grid');
    // Generate more weather entries by cycling through cities with variations
    let html = '';
    for (let i = 0; i < 24; i++) {
      const c = cities[i % cities.length];
      const temp = c.temp + randInt(-3, 3);
      const humid = Math.max(10, Math.min(99, c.humid + randInt(-10, 10)));
      const wind = randInt(5, 45);
      const pres = (1010 + randInt(-15, 15)).toString();
      html += `<div class="weather-item">
        <span class="w-city">${c.icon} ${c.name}</span>
        <span class="w-temp">${temp}°C</span>
        <span class="w-humid">💧${humid}%</span>
      </div>`;
    }
    grid.innerHTML = html;
  }

  // ── Tectonic Plates ──
  const plates = [
    { name: 'Pacific Plate', speed: '75 mm/yr', dir: 'NW', type: 'Oceanic' },
    { name: 'North American', speed: '25 mm/yr', dir: 'W', type: 'Continental' },
    { name: 'South American', speed: '27 mm/yr', dir: 'W', type: 'Continental' },
    { name: 'Eurasian', speed: '20 mm/yr', dir: 'E', type: 'Continental' },
    { name: 'African', speed: '22 mm/yr', dir: 'NE', type: 'Continental' },
    { name: 'Indo-Australian', speed: '67 mm/yr', dir: 'N', type: 'Mixed' },
    { name: 'Antarctic', speed: '12 mm/yr', dir: 'N', type: 'Continental' },
    { name: 'Nazca', speed: '79 mm/yr', dir: 'E', type: 'Oceanic' },
    { name: 'Cocos', speed: '67 mm/yr', dir: 'NE', type: 'Oceanic' },
    { name: 'Philippine Sea', speed: '80 mm/yr', dir: 'NW', type: 'Oceanic' },
    { name: 'Scotia', speed: '20 mm/yr', dir: 'E', type: 'Mixed' },
    { name: 'Caribbean', speed: '18 mm/yr', dir: 'W', type: 'Continental' },
  ];

  function renderTectonics() {
    const grid = document.getElementById('tectonic-grid');
    let html = '';
    plates.forEach(p => {
      const depth = rand(10, 200).toFixed(0);
      const stress = randInt(1, 100);
      const stressColor = stress > 80 ? 'var(--accent-red)' : stress > 50 ? 'var(--accent-yellow)' : 'var(--accent-green)';
      html += `<div class="tectonic-item">
        <div class="t-name">${p.name}</div>
        <div class="t-detail">
          ${p.type} · ${p.dir} ${p.speed}<br>
          Depth: ${depth} km · Stress: <span style="color:${stressColor}">${stress}%</span>
        </div>
      </div>`;
    });
    grid.innerHTML = html;
  }

  // ── Volcano Feed ──
  const volcanoNames = [
    'Kīlauea', 'Mount Etna', 'Stromboli', 'Sakurajima', 'Popocatépetl',
    'Villarrica', 'Nyiragongo', 'Merapi', 'Arenal', 'Eyjafjallajökull',
    'Taal', 'Krakatoa', 'Mauna Loa', 'Galeras', 'Santa María',
    'Fuego', 'Sinabung', 'Sheveluch', 'Karymsky', 'Chikurachki'
  ];
  const volcanoLocs = [
    'Hawaii, USA', 'Sicily, Italy', 'Aeolian Is., Italy', 'Kyushu, Japan',
    'México', 'Chile', 'DR Congo', 'Java, Indonesia', 'Costa Rica',
    'Iceland', 'Luzon, Philippines', 'Sunda Strait, Indonesia',
    'Hawaii, USA', 'Colombia', 'Guatemala', 'Guatemala',
    'Sumatra, Indonesia', 'Kamchatka, Russia', 'Kamchatka, Russia', 'Kuril Is., Russia'
  ];

  function renderVolcanoes() {
    const feed = document.getElementById('volcano-feed');
    let html = '';
    for (let i = 0; i < 8; i++) {
      const idx = randInt(0, volcanoNames.length - 1);
      const mag = (rand(1, 5)).toFixed(1);
      const hoursAgo = randInt(0, 23);
      const minsAgo = randInt(0, 59);
      const colorClass = parseFloat(mag) >= 4 ? 'volcano-mag m4' : parseFloat(mag) >= 3 ? 'volcano-mag m3' : 'volcano-mag m2';
      html += `<div class="volcano-item">
        <span class="${colorClass}">M${mag}</span>
        <span class="volcano-loc">${volcanoNames[idx]} · ${volcanoLocs[idx]}</span>
        <span class="volcano-time">${hoursAgo}h ${minsAgo}m ago</span>
      </div>`;
    }
    feed.innerHTML = html;
  }

  // ── Seismic Feed ──
  function renderSeismic() {
    const feed = document.getElementById('seismic-feed');
    let html = '';
    const regions = [
      'Off coast of Honshu, Japan', 'Central Chile', 'Eastern New Guinea',
      'South Sandwich Islands', 'Mid-Indian Ridge', 'Northern Mid-Atlantic Ridge',
      'Rat Islands, Aleutian', 'Izu Islands, Japan', 'South of Fiji',
      'Vanuatu', 'Tonga', 'Svalbard', 'Southern Alaska',
      'Antarctic Peninsula', 'Philippine Sea', 'Celebes Sea'
    ];
    for (let i = 0; i < 10; i++) {
      const mag = rand(2.5, 7.2).toFixed(1);
      const depth = randInt(5, 680);
      const hoursAgo = randInt(0, 60);
      const region = pickRandom(regions);
      const magClass = mag >= 5 ? 'seismic-mag m4' : mag >= 4 ? 'seismic-mag m3' : mag >= 3 ? 'seismic-mag m2' : 'seismic-mag';
      html += `<div class="seismic-item">
        <span class="${magClass}">M${mag}</span>
        <span class="seismic-loc">${region}</span>
        <span class="seismic-time">${depth} km · ${hoursAgo}h ago</span>
      </div>`;
    }
    feed.innerHTML = html;
  }

  // ── Biome Grid ──
  const biomes = [
    { icon: '🌴', name: 'Tropical Forest', pct: '36.0%', temp: '27°C', color: '#2d8a4e' },
    { icon: '🏜️', name: 'Desert/Arid', pct: '20.4%', temp: '22°C', color: '#c9952c' },
    { icon: '🌾', name: 'Temperate Grass', pct: '14.6%', temp: '12°C', color: '#8db84e' },
    { icon: '🌲', name: 'Boreal Forest', pct: '6.8%', temp: '-2°C', color: '#3a7a4f' },
    { icon: '🏔️', name: 'Tundra', pct: '5.2%', temp: '-10°C', color: '#9ab8c2' },
    { icon: '🧊', name: 'Ice Cap', pct: '4.2%', temp: '-30°C', color: '#d4e4ed' },
    { icon: '🌺', name: 'Mediterranean', pct: '2.5%', temp: '16°C', color: '#c48b3a' },
    { icon: '🌿', name: 'Tropical Savanna', pct: '8.7%', temp: '25°C', color: '#b8a842' },
    { icon: '🍂', name: 'Temperate Deciduous', pct: '4.8%', temp: '10°C', color: '#8b7a4f' },
    { icon: '🪨', name: 'Montane', pct: '1.6%', temp: '2°C', color: '#9a9a9a' },
    { icon: '🦀', name: 'Mangrove', pct: '0.8%', temp: '28°C', color: '#5a8a5a' },
    { icon: '🌊', name: 'Wetland/Marsh', pct: '2.4%', temp: '18°C', color: '#5a8fa8' },
  ];

  function renderBiomes() {
    const grid = document.getElementById('biome-grid');
    let html = '';
    biomes.forEach(b => {
      html += `<div class="biome-item">
        <div class="biome-icon">${b.icon}</div>
        <div class="biome-name">${b.name}</div>
        <div class="biome-pct">${b.pct}</div>
        <div class="biome-temp">${b.temp}</div>
      </div>`;
    });
    grid.innerHTML = html;
  }

  // ── Events Feed ──
  const eventTypes = ['🌍 DIPLOMACY', '💹 ECONOMY', '🔬 SCIENCE', '🏥 HEALTH', '⚡ ENERGY', '🛰️ SPACE'];
  const eventHeadlines = [
    'Global summit on ocean biodiversity concludes with historic treaty',
    'Record-breaking solar farm commissioned in Sahara region',
    'New deep-sea species discovered in Mariana Trench expedition',
    'International fusion reactor achieves 100-second plasma milestone',
    'Arctic shipping route opens earliest on record',
    'Global AI governance framework adopted by 140 nations',
    'Major earthquake early warning system expanded to Indian Ocean',
    'World food reserves reach 18-month high',
    'Antarctic ice shelf monitoring detects acceleration in melt rate',
    'Global vaccination campaign reaches 95% coverage milestone',
    'Quantum internet backbone spans transatlantic route',
    'Carbon capture facility removes 1M tonnes milestone',
    'New mineral deposit discovered in Greenland',
    'El Niño pattern shifts to neutral conditions',
    'Global internet traffic peaks at 8.2 Tbps',
    'Historic peace accord signed in conflict zone',
  ];

  function renderEvents() {
    const feed = document.getElementById('events-feed');
    let html = '';
    for (let i = 0; i < 8; i++) {
      const type = pickRandom(eventTypes);
      const headline = pickRandom(eventHeadlines);
      const minsAgo = randInt(1, 599);
      html += `<div class="event-item">
        <span class="event-time">${minsAgo < 60 ? minsAgo + 'm' : Math.floor(minsAgo / 60) + 'h'}</span>
        <span class="event-type">${type}</span>
        <span class="event-loc">${headline}</span>
      </div>`;
    }
    feed.innerHTML = html;
  }

  // ── Disasters Feed ──
  const disasterTypes = [
    { type: '🌋 VOLCANO', cls: 'dis-type' },
    { type: '🌀 TROPICAL STORM', cls: 'dis-type' },
    { type: '🌊 TSUNAMI WATCH', cls: 'dis-type' },
    { type: '🔥 WILDFIRE', cls: 'dis-type' },
    { type: '🏔️ LANDSLIDE', cls: 'dis-type' },
    { type: '🌧️ FLOOD', cls: 'dis-type' },
  ];
  const disasterLocs = [
    'Ring of Fire, Pacific', 'Caribbean Sea', 'Indonesian Archipelago',
    'Mediterranean East', 'South China Sea', 'Indian Ocean',
    'Central America', 'Western US', 'Southern Europe',
    'South Pacific'
  ];

  function renderDisasters() {
    const div = document.getElementById('disasters');
    let html = '';
    const count = randInt(2, 5);
    for (let i = 0; i < count; i++) {
      const d = pickRandom(disasterTypes);
      const loc = pickRandom(disasterLocs);
      const mag = d.type.includes('VOLCANO') ? `VAI: ${randInt(1, 4)}` :
                  d.type.includes('STORM') ? `Cat ${randInt(1, 5)}` :
                  d.type.includes('TSUNAMI') ? `${rand(1, 4).toFixed(1)}m wave` :
                  d.type.includes('WILDFIRE') ? `${randInt(50, 5000)} ha` :
                  d.type.includes('FLOOD') ? `L${rand(1, 4).toFixed(1)}` :
                  `M${rand(3, 6).toFixed(1)}`;
      html += `<div class="disaster-item">
        <span class="dis-type">${d.type}</span>
        <span class="dis-mag">${mag}</span>
        <span class="dis-loc">${loc}</span>
      </div>`;
    }
    div.innerHTML = html;
  }

  // ── Real-time Population Counter ──
  let population = 8132456789;
  const popDisplay = document.getElementById('pop-total');

  function updatePopulation() {
    // ~2.5 births/sec net globally → ~2.5 * tick factor
    population += randInt(1, 4);
    popDisplay.textContent = formatNum(population);
  }

  // ── Simulation Clock ──
  const simTimeEl = document.getElementById('sim-time');
  let simDate = new Date('2025-07-09T14:32:07Z');

  function updateSimTime() {
    // Advance sim time slightly faster than real time (10×)
    simDate = new Date(simDate.getTime() + 100); // 100ms sim per ~10ms real
    const y = simDate.getUTCFullYear();
    const mo = String(simDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(simDate.getUTCDate()).padStart(2, '0');
    const h = String(simDate.getUTCHours()).padStart(2, '0');
    const mi = String(simDate.getUTCMinutes()).padStart(2, '0');
    const s = String(simDate.getUTCSeconds()).padStart(2, '0');
    simTimeEl.textContent = `${y}-${mo}-${d} ${h}:${mi}:${s} UTC`;
  }

  // ── Epoch Counter ──
  const epochEl = document.getElementById('epoch-display');
  let epochVal = 4543000000;

  function updateEpoch() {
    epochVal += rand(0.000001, 0.00001);
    epochEl.textContent = epochVal.toFixed(7).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' yr';
  }

  // ── FPS Counter ──
  const fpsEl = document.getElementById('fps');
  let frameCount = 0;
  let lastFpsTime = performance.now();

  function updateFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
      fpsEl.textContent = frameCount;
      frameCount = 0;
      lastFpsTime = now;
    }
  }

  // ── Data Points Counter ──
  const dpsEl = document.getElementById('dps');
  let dpsVal = 2400000;

  function updateDPS() {
    dpsVal += randInt(-50000, 50000);
    dpsEl.textContent = formatNum(Math.max(2000000, dpsVal));
  }

  // ── Currency Fluctuation ──
  const currencyElements = document.querySelectorAll('.currency-row span:nth-child(2)');

  function fluctuateCurrencies() {
    document.querySelectorAll('.currency-row').forEach(row => {
      const span = row.children[1];
      const chg = row.children[2];
      const val = parseFloat(span.textContent);
      if (isNaN(val)) return;
      const delta = val * rand(-0.003, 0.003);
      const newVal = val + delta;
      // Determine decimals based on currency
      const decimals = newVal > 10 ? 2 : newVal > 1 ? 2 : 4;
      span.textContent = newVal.toFixed(decimals);
      if (delta > 0) {
        chg.textContent = '+' + (delta / val * 100).toFixed(2) + '%';
        chg.className = 'chg-up';
      } else {
        chg.textContent = (delta / val * 100).toFixed(2) + '%';
        chg.className = 'chg-down';
      }
    });
  }

  // ── Sparkline Data Update Loop ──
  let sparkInterval;

  function startSparklines() {
    const canvases = document.querySelectorAll('.spark');
    // Initial draw
    canvases.forEach(c => drawSparkline(c, c.dataset.key));
    // Update every 2 seconds
    sparkInterval = setInterval(() => {
      canvases.forEach(c => drawSparkline(c, c.dataset.key));
    }, 2000);
  }

  // ── Initialize Everything ──
  function init() {
    renderWeather();
    renderTectonics();
    renderVolcanoes();
    renderSeismic();
    renderBiomes();
    renderEvents();
    renderDisasters();
    startSparklines();

    // Main update loop
    setInterval(updatePopulation, 300);     // Pop update every 300ms
    setInterval(updateSimTime, 100);        // Sim clock every 100ms
    setInterval(updateEpoch, 2000);         // Epoch every 2s
    setInterval(updateFPS, 1000);           // FPS every 1s
    setInterval(updateDPS, 3000);           // DPS every 3s
    setInterval(fluctuateCurrencies, 4000); // Currency every 4s
    setInterval(renderVolcanoes, 15000);    // Volcanoes every 15s
    setInterval(renderSeismic, 12000);      // Seismic every 12s
    setInterval(renderEvents, 20000);       // Events every 20s
    setInterval(renderDisasters, 25000);    // Disasters every 25s
    setInterval(renderWeather, 30000);      // Weather every 30s
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
// ===== Global State =====
const state = {
  population: 8045311447,
  temperature: 14.2,
  water: 71.4,
  volcanoes: 1500,
  storms: 42,
  energy: 18.4,
  zoom: 10000000,
  lat: 40.7128,
  long: -74.0060,
  alerts: [
    { type: 'critical', message: 'Volcanic Eruption in Iceland', timestamp: Date.now() },
    { type: 'warning', message: 'Rising Sea Levels (+3mm/year)', timestamp: Date.now() - 3600000 },
    { type: 'info', message: 'New Deep-Sea Vent Discovered', timestamp: Date.now() - 7200000 }
  ],
  climateZones: {
    desert: 20.1,
    forest: 31.2,
    polar: 10.4,
    marine: 38.3,
    mountain: 12.8,
    tropical: 15.6
  },
  resources: {
    oil: '1.7T barrels',
    coal: '1.1T tonnes',
    iron: '85B tonnes',
    gold: '244K tonnes',
    arable: '13.7M km²',
    freshwater: '2.5%'
  },
  tradeRoutes: [
    { from: 'NA', to: 'EU', volume: '12.4M tons/month', type: '✈️' },
    { from: 'Asia', to: 'NA', volume: '8.9M tons/month', type: '🚢' },
    { from: 'EU', to: 'Asia', volume: '6.2M tons/month', type: '🚂' }
  ],
  tectonicEvents: [
    { type: 'earthquake', location: 'Pacific Ring', magnitude: 5.2, time: '12m ago' },
    { type: 'fissure', location: 'Mid-Atlantic Ridge', magnitude: null, time: '3h ago' },
    { type: 'shift', location: 'Himalayan', magnitude: '3mm/year', time: 'Ongoing' }
  ]
};

// ===== DOM Elements =====
const elements = {
  population: document.querySelector('[data-type="population"]'),
  temperature: document.querySelector('[data-type="temperature"]'),
  water: document.querySelector('[data-type="water"]'),
  volcanoes: document.querySelector('[data-type="volcanoes"]'),
  storms: document.querySelector('[data-type="storms"]'),
  energy: document.querySelector('[data-type="energy"]'),
  planetMap: document.getElementById('planet-map'),
  overlayLatLong: document.querySelector('.overlay-stat:first-child span'),
  overlayZoom: document.querySelector('.overlay-stat:last-child span'),
  alertBar: document.querySelector('.alert-bar'),
  climateCells: document.querySelectorAll('.climate-cell'),
  resourceCells: document.querySelectorAll('.resource-cell'),
  feedItems: document.querySelectorAll('.feed-item'),
  tradeItems: document.querySelectorAll('.trade-item'),
  zoomInBtn: document.querySelector('[data-action="zoom-in"]'),
  zoomOutBtn: document.querySelector('[data-action="zoom-out"]'),
  resetViewBtn: document.querySelector('[data-action="reset-view"]')
};

// ===== Canvas Setup =====
const ctx = elements.planetMap.getContext('2d');
let isDragging = false;
let lastX, lastY;
let offsetX = 0, offsetY = 0;

function resizeCanvas() {
  elements.planetMap.width = elements.planetMap.parentElement.clientWidth;
  elements.planetMap.height = elements.planetMap.parentElement.clientHeight;
  drawPlanet();
}

function drawPlanet() {
  const { width, height } = elements.planetMap;
  ctx.clearRect(0, 0, width, height);

  // Base planet (dark blue with landmasses)
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) / 2);
  gradient.addColorStop(0, '#0a1e3a');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Landmasses (simplified continents)
  ctx.fillStyle = '#1a3a5c';
  ctx.beginPath();
  ctx.arc(width / 2 + offsetX, height / 2 + offsetY, width / 4, 0, Math.PI * 2);
  ctx.fill();

  // Grid lines
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) {
    const x = (width / 10) * i + offsetX;
    const y = (height / 10) * i + offsetY;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Resource overlays (randomized dots)
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width + offsetX;
    const y = Math.random() * height + offsetY;
    const size = Math.random() * 2;
    ctx.fillStyle = `rgba(0, 245, 255, ${Math.random() * 0.5 + 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Trade routes (curved lines)
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.5)';
  ctx.lineWidth = 1;
  for (const route of state.tradeRoutes) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const endX = Math.random() * width;
    const endY = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(startX + offsetX, startY + offsetY);
    ctx.quadraticCurveTo((startX + endX) / 2, (startY + endY) / 2 - 50, endX + offsetX, endY + offsetY);
    ctx.stroke();
  }

  // Tectonic activity (red pulses)
  for (const event of state.tectonicEvents) {
    const x = Math.random() * width + offsetX;
    const y = Math.random() * height + offsetY;
    const size = event.magnitude ? event.magnitude / 2 : 2;
    ctx.fillStyle = 'rgba(255, 0, 64, 0.7)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== Data Updates =====
function updateStats() {
  // Random fluctuations for realism
  state.population += Math.floor(Math.random() * 100000) - 50000;
  state.temperature += (Math.random() * 0.2 - 0.1).toFixed(1);
  state.water = (71.4 + (Math.random() * 0.2 - 0.1)).toFixed(1);
  state.volcanoes += Math.floor(Math.random() * 5) - 2;
  state.storms += Math.floor(Math.random() * 3) - 1;
  state.energy += (Math.random() * 0.5 - 0.25).toFixed(1);

  // Update DOM
  elements.population.textContent = state.population.toLocaleString();
  elements.temperature.textContent = `${state.temperature}°C`;
  elements.water.textContent = `${state.water}%`;
  elements.volcanoes.textContent = state.volcanoes;
  elements.storms.textContent = state.storms;
  elements.energy.textContent = `${state.energy} TW`;
  elements.overlayLatLong.textContent = `Lat: ${state.lat.toFixed(4)}° ${state.lat >= 0 ? 'N' : 'S'}, Long: ${Math.abs(state.long).toFixed(4)}° ${state.long >= 0 ? 'E' : 'W'}`;
  elements.overlayZoom.textContent = `Zoom: 1:${state.zoom.toLocaleString()}`;
}

function updateClimateZones() {
  for (const [zone, value] of Object.entries(state.climateZones)) {
    const cell = Array.from(elements.climateCells).find(el => el.textContent.includes(zone));
    if (cell) {
      const newValue = (parseFloat(value) + (Math.random() * 0.5 - 0.25)).toFixed(1);
      state.climateZones[zone] = parseFloat(newValue);
      cell.innerHTML = `${cell.innerHTML.split(':')[0]}: ${newValue}%`;
    }
  }
}

function updateTectonicFeed() {
  const newEvent = {
    type: ['earthquake', 'fissure', 'shift'][Math.floor(Math.random() * 3)],
    location: ['Pacific Ring', 'Mid-Atlantic Ridge', 'Himalayan', 'San Andreas'][Math.floor(Math.random() * 4)],
    magnitude: Math.random() > 0.5 ? (Math.random() * 8 + 2).toFixed(1) : null,
    time: `${Math.floor(Math.random() * 60)}m ago`
  };
  state.tectonicEvents.unshift(newEvent);
  if (state.tectonicEvents.length > 4) state.tectonicEvents.pop();

  // Update DOM
  elements.feedItems.forEach((item, index) => {
    if (state.tectonicEvents[index]) {
      const event = state.tectonicEvents[index];
      item.innerHTML = `${event.type === 'earthquake' ? '⚠️' : event.type === 'fissure' ? '🔥' : '⚡'} <span>${event.location}: ${event.magnitude ? `${event.magnitude} Magnitude` : 'New Fissure'} (${event.time})</span>`;
      if (event.type === 'earthquake' && parseFloat(event.magnitude) > 6) {
        item.innerHTML += ' <span class="alert">⚠️ Tsunami Risk</span>';
      }
    }
  });
}

function updateTradeRoutes() {
  for (const [i, route] of state.tradeRoutes.entries()) {
    const newVolume = (parseFloat(route.volume) + (Math.random() * 1 - 0.5)).toFixed(1) + 'M tons/month';
    state.tradeRoutes[i].volume = newVolume;
    elements.tradeItems[i].innerHTML = `${route.type} <span>${route.from} → ${route.to}: ${newVolume}</span>`;
  }
}

function updateAlerts() {
  // Randomly add/remove alerts
  if (Math.random() > 0.9) {
    const types = ['critical', 'warning', 'info'];
    const messages = [
      'Volcanic Eruption in Iceland',
      'Rising Sea Levels (+3mm/year)',
      'New Deep-Sea Vent Discovered',
      'Solar Flare Detected',
      'Meteor Shower in Progress',
      'Ozone Layer Depletion Accelerating'
    ];
    const newAlert = {
      type: types[Math.floor(Math.random() * types.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: Date.now()
    };
    state.alerts.unshift(newAlert);
    if (state.alerts.length > 3) state.alerts.pop();
  }

  // Update DOM
  elements.alertBar.innerHTML = '';
  state.alerts.forEach(alert => {
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${alert.type}`;
    alertElement.innerHTML = `${alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'} <span>${alert.message}</span>`;
    elements.alertBar.appendChild(alertElement);
  });
}

// ===== Map Controls =====
function zoomIn() {
  state.zoom = Math.max(1000000, state.zoom / 1.5);
  drawPlanet();
}

function zoomOut() {
  state.zoom = Math.min(100000000, state.zoom * 1.5);
  drawPlanet();
}

function resetView() {
  state.zoom = 10000000;
  state.lat = 40.7128;
  state.long = -74.0060;
  offsetX = 0;
  offsetY = 0;
  drawPlanet();
}

// ===== Mouse Interactions =====
elements.planetMap.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

elements.planetMap.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  offsetX += dx;
  offsetY += dy;
  lastX = e.clientX;
  lastY = e.clientY;
  drawPlanet();
});

elements.planetMap.addEventListener('mouseup', () => {
  isDragging = false;
});

elements.planetMap.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
});

// ===== Event Listeners =====
elements.zoomInBtn.addEventListener('click', zoomIn);
elements.zoomOutBtn.addEventListener('click', zoomOut);
elements.resetViewBtn.addEventListener('click', resetView);

// ===== Initialization =====
function init() {
  resizeCanvas();
  updateStats();
  updateClimateZones();
  updateTectonicFeed();
  updateTradeRoutes();
  updateAlerts();
  drawPlanet();

  // Set up periodic updates
  setInterval(updateStats, 1000);
  setInterval(updateClimateZones, 5000);
  setInterval(updateTectonicFeed, 10000);
  setInterval(updateTradeRoutes, 15000);
  setInterval(updateAlerts, 20000);

  // Handle window resize
  window.addEventListener('resize', resizeCanvas);
}

// Start the dashboard
init();
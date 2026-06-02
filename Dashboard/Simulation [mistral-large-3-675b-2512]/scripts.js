// ===== GLOBAL VARIABLES =====
const populationStart = 7987654321;
const co2Start = 420;
const tempStart = 15.3;
let simSpeed = 1;

// ===== DOM ELEMENTS =====
// Time/Date
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
// Population
const populationTickerEl = document.getElementById('population-ticker');
// Earthquakes
const earthquakeTickerEl = document.getElementById('earthquake-ticker');
const tectonicFeedEl = document.getElementById('tectonic-feed');
// Climate
const globalTempEl = document.getElementById('global-temp');
const co2LevelsEl = document.getElementById('co2-levels');
const seaLevelEl = document.getElementById('sea-level');
// Atmosphere
const o2LevelEl = document.getElementById('o2-level');
const co2LevelEl = document.getElementById('co2-level');
const co2Path = document.querySelector('.co2-path');
const o2Path = document.querySelector('.o2-path');
// Trade
const tradeVolumeEl = document.getElementById('trade-volume');
const shipsActiveEl = document.getElementById('ships-active');
// System
const simSpeedEl = document.getElementById('sim-speed');
const batteryLevelEl = document.getElementById('battery-level');
const dataLagEl = document.getElementById('data-lag');

// ===== UTILITY FUNCTIONS =====
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ===== TIME/DATE UPDATES =====
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  timeEl.textContent = time;
  dateEl.textContent = date;
}
updateClock();
setInterval(updateClock, 1000);

// ===== POPULATION SIMULATION =====
function updatePopulation() {
  const growthRate = randomFloat(2.0, 2.8, 1) * simSpeed;
  const currentPop = parseInt(populationTickerEl.textContent.replace(/[^\d]/g, ''));
  const newPop = currentPop + Math.floor(growthRate * 10);

  populationTickerEl.innerHTML = `
    <span>${formatNumber(newPop)}</span>
    <span>👶 +${growthRate}/s</span>
  `;
}
setInterval(updatePopulation, 1000);

// ===== EARTHQUAKE SIMULATION =====
function generateEarthquake() {
  const magnitude = randomFloat(3.0, 8.0, 1);
  const locations = ["Japan", "California", "Chile", "Indonesia", "Nepal", "Turkey"];
  const location = locations[randomInt(0, locations.length - 1)];

  // Update ticker
  const span = document.createElement('span');
  span.textContent = magnitude;
  earthquakeTickerEl.appendChild(span);
  if (earthquakeTickerEl.children.length > 10) {
    earthquakeTickerEl.removeChild(earthquakeTickerEl.children[0]);
  }

  // Add to tectonic feed
  const feedItem = document.createElement('div');
  feedItem.className = 'feed-item';
  feedItem.innerHTML = `🌊 [ALERT] ${magnitude} magnitude quake near ${location}`;
  tectonicFeedEl.prepend(feedItem);
  if (tectonicFeedEl.children.length > 15) {
    tectonicFeedEl.removeChild(tectonicFeedEl.children[tectonicFeedEl.children.length - 1]);
  }
}
setInterval(generateEarthquake, 3000);

// ===== CLIMATE SIMULATION =====
function updateClimate() {
  // Temperature fluctuation
  const tempChange = randomFloat(-0.2, 0.3, 1);
  const currentTemp = parseFloat(globalTempEl.textContent);
  globalTempEl.textContent = `${(currentTemp + tempChange).toFixed(1)}°C`;

  // CO2 fluctuation
  const co2Change = randomFloat(-1, 2);
  const currentCO2 = parseInt(co2LevelsEl.textContent);
  co2LevelsEl.textContent = `${currentCO2 + co2Change}ppm`;

  // Sea level rise
  const seaLevelChange = randomFloat(-0.1, 0.2, 1);
  const currentSeaLevel = parseFloat(seaLevelEl.textContent);
  seaLevelEl.textContent = `${(currentSeaLevel + seaLevelChange).toFixed(1)}mm/yr`;
}
setInterval(updateClimate, 5000);

// ===== ATMOSPHERIC GRAPHS =====
function updateAtmosphericGraphs() {
  // Generate random paths for CO2 and O2
  const co2PathData = generateSmoothPath(10);
  const o2PathData = generateSmoothPath(10, 30, 70); // Higher baseline

  co2Path.setAttribute('d', co2PathData);
  o2Path.setAttribute('d', o2PathData);

  // Update levels
  const o2Level = randomFloat(20.8, 21.0, 1);
  const co2Level = randomFloat(0.041, 0.043, 3);

  o2LevelEl.textContent = `${o2Level}%`;
  co2LevelEl.textContent = `${co2Level}%`;

  // Restart animation
  co2Path.style.animation = 'none';
  o2Path.style.animation = 'none';
  setTimeout(() => {
    co2Path.style.animation = 'draw-path 5s ease-in-out forwards';
    o2Path.style.animation = 'draw-path 5s ease-in-out forwards 0.5s';
  }, 10);
}

function generateSmoothPath(points, min = 60, max = 90) {
  let path = `M0,${randomInt(min, max)}`;
  for (let i = 1; i <= points; i++) {
    const x = (i * 20);
    const y = randomInt(min, max);
    path += ` Q${x - 10},${y} ${x},${y}`;
  }
  return path;
}
setInterval(updateAtmosphericGraphs, 10000);

// ===== TRADE ROUTES =====
function updateTradeRoutes() {
  const volume = parseInt(tradeVolumeEl.textContent.replace(/[^\d]/g, ''));
  const newVolume = volume + randomInt(10, 50) * simSpeed;
  tradeVolumeEl.textContent = `$${formatNumber(newVolume)}T`;

  const ships = parseInt(shipsActiveEl.textContent.replace(/[^\d]/g, ''));
  const newShips = ships + randomInt(-5, 10) * simSpeed;
  shipsActiveEl.textContent = `${formatNumber(newShips)}`;
}
setInterval(updateTradeRoutes, 2000);

// ===== SYSTEM STATUS =====
function updateSystemStatus() {
  // Battery simulation
  const battery = randomInt(80, 100);
  batteryLevelEl.textContent = `${battery}%`;

  // Data lag simulation
  const lag = randomFloat(0.1, 0.5, 1);
  dataLagEl.textContent = `${lag}s`;

  // Simulation speed
  simSpeedEl.textContent = `${simSpeed}x`;
}
setInterval(updateSystemStatus, 1000);

// ===== WEATHER ALERTS =====
function generateWeatherAlert() {
  const events = [
    "🌪️ Tornado warning: Kansas (+2h)",
    "☀️ Heatwave: Australia (+48h)",
    "🌧️ Monsoon: India (+6h)",
    "❄️ Blizzard: Canada (+12h)",
    "🌊 Hurricane: Florida (+24h)",
    "🔥 Wildfire: California (+3h)"
  ];
  const event = events[randomInt(0, events.length - 1)];

  const alert = document.createElement('span');
  alert.textContent = event;
  document.getElementById('weather-ticker').appendChild(alert);

  if (document.getElementById('weather-ticker').children.length > 5) {
    document.getElementById('weather-ticker').removeChild(
      document.getElementById('weather-ticker').children[0]
    );
  }
}
setInterval(generateWeatherAlert, 8000);

// ===== SIMULATION SPEED CONTROL =====
document.addEventListener('keydown', (e) => {
  if (e.key === '+') {
    simSpeed = Math.min(simSpeed + 0.1, 5);
  } else if (e.key === '-') {
    simSpeed = Math.max(simSpeed - 0.1, 0.1);
  }
});

// ===== INITIALIZE =====
function init() {
  // Populate initial data
  updatePopulation();
  generateEarthquake();
  updateClimate();
  updateAtmosphericGraphs();
  updateTradeRoutes();
  updateSystemStatus();
  generateWeatherAlert();

  // Start animations
  document.querySelectorAll('.trade-arc').forEach(arc => {
    arc.style.animation = 'arc-pulse 2s infinite alternate';
  });
}
init();
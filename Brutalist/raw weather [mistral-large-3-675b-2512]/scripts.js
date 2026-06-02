// BRUTAL WEATHER TERMINAL v1.0
// =============================
// NO LIBS. NO FRAMEWORKS. JUST RAW JS.

// DOM SELECTORS (EXPOSED FOR DEBUGGING)
const tempGlitch = document.querySelector('.temp-glitch');
const tempLabel = document.querySelector('.temp-label');
const windArrow = document.querySelector('.wind-arrow');
const alertPanel = document.querySelector('.alert-panel');
const alertText = alertPanel.querySelector('p');
const statRows = document.querySelectorAll('.stat-row');
const forecastRows = document.querySelectorAll('.forecast-panel tbody tr');
const structuralElements = document.querySelectorAll('.structural-element');
const backgroundNoise = document.querySelector('.background-noise');

// CONFIG (RAW CONSTANTS)
const WEATHER_DATA = {
  currentTemp: 23,
  feelsLike: 21,
  humidity: 87,
  pressure: 1013,
  windSpeed: 12,
  windDirection: 45, // degrees
  alerts: [
    "HEAVY RAIN EXPECTED AFTER 18:00",
    "FLOOD RISK IN LOW-LYING AREAS",
    "WARNING: STRONG WINDS TONIGHT"
  ],
  hourly: [
    { time: "12:00", temp: 23, condition: "☁", wind: "10 KM/H" },
    { time: "13:00", temp: 24, condition: "☁", wind: "12 KM/H" },
    { time: "14:00", temp: 25, condition: "☀", wind: "8 KM/H" },
    { time: "15:00", temp: 26, condition: "☀", wind: "6 KM/H" },
    { time: "16:00", temp: 25, condition: "☁", wind: "9 KM/H" }
  ]
};

// GLITCH ENGINE (BRUTALIST FLAVOR)
function triggerGlitch() {
  tempGlitch.style.textShadow = `2px 0 0 var(--neon-cyan), -2px 0 0 var(--alert-red)`;
  setTimeout(() => {
    tempGlitch.style.textShadow = `2px 0 0 var(--neon-cyan), -2px 0 0 var(--neon-magenta)`;
  }, 100);
}

// FORCE REPAINT (ANTI-SMOOTHNESS)
function forceReflow(element) {
  element.style.display = 'none';
  void element.offsetWidth; // TRIGGER REPAINT
  element.style.display = '';
}

// UPDATE WEATHER DATA (RAW, NO ANIMATIONS)
function updateWeather() {
  // RANDOM TEMP FLUCTUATION (±2°C)
  const tempChange = Math.random() > 0.5 ? 1 : -1;
  WEATHER_DATA.currentTemp += tempChange;
  tempGlitch.setAttribute('data-text', `${WEATHER_DATA.currentTemp}°`);
  tempGlitch.textContent = `${WEATHER_DATA.currentTemp}°`;
  tempLabel.textContent = `CURRENT // RAW (${new Date().toLocaleTimeString()})`;

  // WIND DIRECTION (RANDOM ROTATION)
  WEATHER_DATA.windDirection = (WEATHER_DATA.windDirection + (Math.random() * 30 - 15)) % 360;
  windArrow.style.transform = `rotate(${WEATHER_DATA.windDirection}deg)`;

  // HUMIDITY/PRESSURE (RANDOM DRIFT)
  WEATHER_DATA.humidity = Math.min(100, Math.max(0, WEATHER_DATA.humidity + (Math.random() * 4 - 2)));
  WEATHER_DATA.pressure = Math.min(1030, Math.max(980, WEATHER_DATA.pressure + (Math.random() * 2 - 1)));

  statRows[0].querySelector('span:last-child').textContent = `${Math.round(WEATHER_DATA.humidity)}%`;
  statRows[1].querySelector('span:last-child').textContent = `${WEATHER_DATA.pressure} MB`;

  // HOURLY FORECAST (SHIFT ROWS)
  const shiftedHourly = [...WEATHER_DATA.hourly];
  shiftedHourly.push(shiftedHourly.shift());
  shiftedHourly[shiftedHourly.length - 1].temp += Math.random() > 0.5 ? 1 : -1;

  forecastRows.forEach((row, i) => {
    row.children[1].textContent = `${shiftedHourly[i].temp}°`;
    row.children[2].textContent = shiftedHourly[i].condition;
    row.children[3].textContent = shiftedHourly[i].wind;
  });

  // ALERTS (RANDOM TRIGGERS)
  if (Math.random() > 0.8) {
    alertPanel.style.borderColor = `var(--alert-red)`;
    alertText.textContent = WEATHER_DATA.alerts[Math.floor(Math.random() * WEATHER_DATA.alerts.length)];
    forceReflow(alertPanel);
    triggerGlitch();
  } else {
    alertPanel.style.borderColor = `var(--gray)`;
  }
}

// STRUCTURAL GLITCHES (EXPOSED BUGS)
function structuralGlitch() {
  structuralElements.forEach(el => {
    el.style.opacity = Math.random() > 0.7 ? '0.8' : '0.1';
    el.style.transform = `scale(${Math.random() > 0.5 ? 1 : 1.02})`;
  });
  backgroundNoise.style.opacity = Math.random() > 0.5 ? '0.2' : '0.05';
}

// INITIALIZE (BRUTALIST LOAD)
document.addEventListener('DOMContentLoaded', () => {
  // FORCE INITIAL GLITCH
  tempGlitch.style.color = 'transparent';
  setTimeout(() => {
    tempGlitch.style.color = 'var(--white)';
    triggerGlitch();
  }, 300);

  // SETUP INTERVALS (AGGRESSIVE TIMING)
  setInterval(updateWeather, 5000);
  setInterval(structuralGlitch, 2000);
  setInterval(triggerGlitch, 1000);

  // DEBUG OUTPUT (EXPOSED CONSOLE)
  console.log('%cBRUTAL WEATHER TERMINAL', 'font-family: monospace; font-size: 2rem; color: #0ff; text-shadow: 2px 2px 0 #f0f');
  console.log('%cDATA STREAM ACTIVE', 'font-family: monospace; color: #ccc');
});
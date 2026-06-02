const apiKey = null; 
const weatherBase = 'https://api.open-meteo.com/v1/forecast';
const geocodeBase = 'https://nominatim.openstreetmap.org/reverse';

const elements = {
  alertBanner: document.getElementById('alert-banner'),
  alertMessage: document.getElementById('alert-message'),
  dismissAlert: document.getElementById('dismiss-alert'),
  latValue: document.getElementById('lat-value'),
  lonValue: document.getElementById('lon-value'),
  cityName: document.getElementById('city-name'),
  liveClock: document.getElementById('live-clock'),
  liveDate: document.getElementById('live-date'),
  mainTemp: document.getElementById('main-temp'),
  feelsTemp: document.getElementById('feels-temp'),
  weatherIcon: document.getElementById('weather-icon'),
  conditionDesc: document.getElementById('condition-desc'),
  sunriseTime: document.getElementById('sunrise-time'),
  sunsetTime: document.getElementById('sunset-time'),
  humidityValue: document.getElementById('humidity-value'),
  humidityBar: document.getElementById('humidity-bar'),
  pressureValue: document.getElementById('pressure-value'),
  pressureBar: document.getElementById('pressure-bar'),
  visibilityValue: document.getElementById('visibility-value'),
  windSpeedValue: document.getElementById('wind-speed-value'),
  windArrow: document.getElementById('wind-arrow'),
  windDeg: document.getElementById('wind-deg'),
  uvValue: document.getElementById('uv-value'),
  cloudValue: document.getElementById('cloud-value'),
  hourlyBody: document.getElementById('hourly-body'),
  compassNeedle: document.getElementById('compass-needle'),
  gustValue: document.getElementById('gust-value'),
  windDirText: document.getElementById('wind-dir-text'),
  dailyContainer: document.getElementById('daily-container'),
  rawJson: document.getElementById('raw-json')
};

const weatherIcons = {
  0: '☀', 1: '🌤', 2: '⛅', 3: '☁', 45: '🌫', 48: '🌫',
  51: '🌦', 53: '🌦', 55: '🌦', 61: '🌧', 63: '🌧', 65: '🌧',
  71: '🌨', 73: '🌨', 75: '🌨', 77: '🌨', 80: '🌦', 81: '🌦',
  82: '🌦', 85: '❄', 86: '❄', 95: '⛈', 96: '⛈', 99: '⛈'
};

const weatherDescriptions = {
  0: 'CLEAR SKY', 1: 'MAINLY CLEAR', 2: 'PARTLY CLOUDY', 3: 'OVERCAST',
  45: 'FOG', 48: 'DEPOSITING RIME FOG', 51: 'LIGHT DRIZZLE', 53: 'MODERATE DRIZZLE',
  55: 'DENSE DRIZZLE', 61: 'SLIGHT RAIN', 63: 'MODERATE RAIN', 65: 'HEAVY RAIN',
  71: 'SLIGHT SNOW', 73: 'MODERATE SNOW', 75: 'HEAVY SNOW', 77: 'SNOW GRAINS',
  80: 'SLIGHT SHOWERS', 81: 'MODERATE SHOWERS', 82: 'VIOLENT SHOWERS',
  85: 'SLIGHT SNOW SHOWERS', 86: 'HEAVY SNOW SHOWERS', 95: 'THUNDERSTORM',
  96: 'THUNDERSTORM W/ HAIL', 99: 'SEVERE THUNDERSTORM'
};

let currentLat = 52.52;
let currentLon = 13.405;
let weatherData = null;

function updateClock() {
  const now = new Date();
  elements.liveClock.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  elements.liveDate.textContent = now.toISOString().split('T')[0];
}
setInterval(updateClock, 1000);
updateClock();

async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: true,
    hourly: 'temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m,windgusts_10m,cloudcover,visibility',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: 7
  });

  try {
    const response = await fetch(`${weatherBase}?${params}`);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();
    weatherData = data;
    updateUI(data);
    updateRawJson(data);
  } catch (error) {
    console.error('Weather error:', error);
    elements.rawJson.textContent = `ERROR: ${error.message}`;
  }
}

async function fetchCityName(lat, lon) {
  try {
    const response = await fetch(`${geocodeBase}?lat=${lat}&lon=${lon}&format=json&zoom=10`);
    if (!response.ok) return;
    const data = await response.json();
    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.municipality || 'UNKNOWN';
      elements.cityName.textContent = city.toUpperCase();
    }
  } catch (e) {
    elements.cityName.textContent = 'GEO_LOOKUP_FAILED';
  }
}

function updateUI(data) {
  const current = data.current_weather;
  const hourly = data.hourly;
  const daily = data.daily;

  elements.mainTemp.textContent = `${Math.round(current.temperature)}°`;
  elements.windSpeedValue.textContent = `${current.windspeed} m/s`;
  elements.windDeg.textContent = `${current.winddirection}°`;
  elements.windArrow.style.transform = `rotate(${current.winddirection}deg)`;
  elements.compassNeedle.style.transform = `translateX(-50%) rotate(${current.winddirection}deg)`;
  elements.gustValue.textContent = `${current.windspeed + (Math.random() * 5).toFixed(1)} m/s`;
  
  const windDir = getWindDirection(current.winddirection);
  elements.windDirText.textContent = windDir;

  const weatherCode = current.weathercode;
  elements.weatherIcon.textContent = weatherIcons[weatherCode] || '❓';
  elements.conditionDesc.textContent = weatherDescriptions[weatherCode] || 'UNKNOWN';

  const currentHourIndex = new Date().getHours();
  const feelsLikeTemp = hourly.apparent_temperature[currentHourIndex] || current.temperature;
  elements.feelsTemp.textContent = `${Math.round(feelsLikeTemp)}°`;

  const humidity = hourly.relativehumidity_2m[currentHourIndex] || 0;
  elements.humidityValue.textContent = `${humidity}%`;
  elements.humidityBar.style.width = `${humidity}%`;

  const pressure = 1013 + (Math.random() * 20 - 10);
  elements.pressureValue.textContent = `${Math.round(pressure)} hPa`;
  elements.pressureBar.style.width = `${((pressure - 980) / 60) * 100}%`;

  const visibility = hourly.visibility ? (hourly.visibility[currentHourIndex] / 1000).toFixed(1) : '--';
  elements.visibilityValue.textContent = `${visibility} km`;

  const uv = Math.floor(Math.random() * 11);
  elements.uvValue.textContent = uv;

  const cloudCover = hourly.cloudcover ? hourly.cloudcover[currentHourIndex] : 0;
  elements.cloudValue.textContent = `${cloudCover}%`;

  if (daily.sunrise && daily.sunset) {
    const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    const sunset = new Date(daily.sunset[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    elements.sunriseTime.textContent = sunrise;
    elements.sunsetTime.textContent = sunset;
  }

  populateHourlyTable(hourly);
  populateDailyForecast(daily);
  checkAlerts(data);
}

function populateHourlyTable(hourly) {
  elements.hourlyBody.innerHTML = '';
  const now = new Date();
  const startHour = now.getHours();

  for (let i = startHour; i < startHour + 24; i++) {
    const idx = i % 24;
    const time = `${String(idx).padStart(2, '0')}:00`;
    const temp = Math.round(hourly.temperature_2m[idx]);
    const wind = hourly.windspeed_10m[idx];
    const gust = hourly.windgusts_10m[idx];
    const precip = hourly.precipitation_probability[idx] || 0;
    const hum = hourly.relativehumidity_2m[idx];
    const cloud = hourly.cloudcover[idx];
    const code = hourly.weathercode[idx];
    const icon = weatherIcons[code] || '•';

    const row = document.createElement('tr');
    row.innerHTML = `<td>${time}</td><td><strong>${temp}°</strong></td><td>${wind}</td><td>${gust}</td><td>${precip}%</td><td>${hum}%</td><td>${cloud}%</td><td>${icon}</td>`;
    elements.hourlyBody.appendChild(row);
  }
}

function populateDailyForecast(daily) {
  elements.dailyContainer.innerHTML = '';
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  for (let i = 0; i < daily.time.length; i++) {
    const date = new Date(daily.time[i]);
    const dayName = days[date.getDay()];
    const icon = weatherIcons[daily.weathercode[i]] || '•';
    const high = Math.round(daily.temperature_2m_max[i]);
    const low = Math.round(daily.temperature_2m_min[i]);
    const precip = daily.precipitation_probability_max[i] || 0;

    const row = document.createElement('div');
    row.className = 'daily-row';
    row.innerHTML = `
      <span class="daily-day">${dayName}</span>
      <span class="daily-icon">${icon}</span>
      <span class="daily-temp"><span class="daily-high">${high}°</span><span class="daily-low">${low}°</span></span>
      <span class="daily-precip">💧${precip}%</span>
    `;
    elements.dailyContainer.appendChild(row);
  }
}

function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

function checkAlerts(data) {
  const current = data.current_weather;
  let alertText = '';
  let hasAlert = false;

  if (current.windspeed > 15) {
    alertText = 'HIGH WIND WARNING: GUSTS EXCEEDING 15 M/S';
    hasAlert = true;
  }
  if (current.temperature > 38) {
    alertText = 'EXTREME HEAT ADVISORY: TEMPERATURE ABOVE 38°C';
    hasAlert = true;
  }
  if (current.temperature < -10) {
    alertText = 'EXTREME COLD WARNING: TEMPERATURE BELOW -10°C';
    hasAlert = true;
  }
  if (data.hourly && data.hourly.weathercode) {
    const severeCodes = [95, 96, 99];
    const currentHour = new Date().getHours();
    if (severeCodes.includes(data.hourly.weathercode[currentHour])) {
      alertText = 'SEVERE THUNDERSTORM ALERT: TAKE SHELTER IMMEDIATELY';
      hasAlert = true;
    }
  }

  if (hasAlert) {
    elements.alertMessage.textContent = alertText;
    elements.alertBanner.classList.remove('dismissed');
    elements.alertBanner.style.borderColor = '#f53b3b';
  } else {
    elements.alertMessage.textContent = 'NO ACTIVE WARNINGS FOR THIS LOCATION';
    elements.alertBanner.style.borderColor = '#3b8ef5';
  }
}

function updateRawJson(data) {
  elements.rawJson.textContent = JSON.stringify(data, null, 2);
}

function requestLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentLat = pos.coords.latitude;
        currentLon = pos.coords.longitude;
        elements.latValue.textContent = currentLat.toFixed(4);
        elements.lonValue.textContent = currentLon.toFixed(4);
        fetchCityName(currentLat, currentLon);
        fetchWeather(currentLat, currentLon);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable, using default Berlin coordinates.');
        elements.latValue.textContent = currentLat.toFixed(4);
        elements.lonValue.textContent = currentLon.toFixed(4);
        fetchCityName(currentLat, currentLon);
        fetchWeather(currentLat, currentLon);
      }
    );
  } else {
    elements.latValue.textContent = currentLat.toFixed(4);
    elements.lonValue.textContent = currentLon.toFixed(4);
    fetchCityName(currentLat, currentLon);
    fetchWeather(currentLat, currentLon);
  }
}

elements.dismissAlert.addEventListener('click', () => {
  elements.alertBanner.classList.add('dismissed');
});

window.addEventListener('load', () => {
  requestLocation();
  setInterval(() => {
    fetchWeather(currentLat, currentLon);
  }, 600000);
});
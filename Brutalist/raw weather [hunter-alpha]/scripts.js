/* ============================================
   BRUTAL WEATHER // STATION_001
   JAVASCRIPT // DATA STREAM CONTROLLER
   // no beauty. only function.
   ============================================ */

// === CONFIGURATION ===
const CONFIG = {
    API_KEY: '4d8fb5b93d4af21d66a2948710284366', // Demo key - replace with your own
    API_BASE: 'https://api.openweathermap.org/data/2.5',
    GEO_API: 'https://api.openweathermap.org/geo/1.0',
    DEFAULT_CITY: 'London',
    UNITS: 'metric',
    UPDATE_INTERVAL: 300000, // 5 minutes
    ANIMATION_DURATION: 800
};

// === STATE ===
const state = {
    currentCity: CONFIG.DEFAULT_CITY,
    weatherData: null,
    forecastData: null,
    isLoading: false,
    lastUpdate: null,
    coordinates: null
};

// === DOM ELEMENTS ===
const DOM = {
    // Header
    lastUpdate: document.getElementById('last-update'),
    locationDisplay: document.getElementById('location-display'),
    locationInput: document.getElementById('location-input'),
    locationBtn: document.getElementById('location-btn'),
    
    // Temperature
    tempValue: document.getElementById('temp-value'),
    feelsLike: document.getElementById('feels-like'),
    tempCondition: document.getElementById('temp-condition'),
    
    // Data Panels
    humidity: document.getElementById('humidity'),
    humidityBar: document.getElementById('humidity-bar'),
    pressure: document.getElementById('pressure'),
    pressureTrend: document.getElementById('pressure-trend'),
    visibility: document.getElementById('visibility'),
    uvIndex: document.getElementById('uv-index'),
    uvMarker: document.getElementById('uv-marker'),
    
    // Wind
    windArrow: document.getElementById('wind-arrow'),
    windSpeed: document.getElementById('wind-speed'),
    windGust: document.getElementById('wind-gust'),
    windDir: document.getElementById('wind-dir'),
    
    // Sun
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    arcSun: document.getElementById('arc-sun'),
    
    // Alert
    alertBlock: document.getElementById('alert-block'),
    alertBody: document.getElementById('alert-body'),
    
    // Hourly
    hourlyBody: document.getElementById('hourly-body'),
    
    // Daily
    dailyGrid: document.getElementById('daily-grid'),
    
    // AQI
    aqiNumber: document.getElementById('aqi-number'),
    aqiLabel: document.getElementById('aqi-label'),
    aqiMarker: document.getElementById('aqi-marker'),
    
    // Precipitation
    precipBars: document.getElementById('precip-bars'),
    
    // Footer
    footerStatus: document.getElementById('footer-status'),
    
    // Reveal elements
    revealElements: document.querySelectorAll('[data-reveal]')
};

// === UTILITY FUNCTIONS ===

/**
 * Format time from timestamp
 */
function formatTime(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toUTCString().slice(17, 22);
}

/**
 * Format day name from timestamp
 */
function formatDay(timestamp) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const date = new Date(timestamp * 1000);
    return days[date.getDay()];
}

/**
 * Format hour from timestamp
 */
function formatHour(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.getHours().toString().padStart(2, '0') + ':00';
}

/**
 * Get weather icon (emoji fallback)
 */
function getWeatherIcon(code, isDay = true) {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return icons[code] || '❓';
}

/**
 * Get weather condition text
 */
function getConditionText(code) {
    const conditions = {
        200: 'THUNDERSTORM', 201: 'THUNDERSTORM', 202: 'HEAVY THUNDERSTORM',
        210: 'LIGHT THUNDER', 211: 'THUNDERSTORM', 212: 'HEAVY THUNDER',
        221: 'ROUGH THUNDER', 230: 'THUNDER DRIZZLE', 231: 'THUNDER DRIZZLE',
        232: 'HEAVY THUNDER DRIZZLE',
        300: 'LIGHT DRIZZLE', 301: 'DRIZZLE', 302: 'HEAVY DRIZZLE',
        310: 'LIGHT RAIN', 311: 'RAIN DRIZZLE', 312: 'HEAVY RAIN DRIZZLE',
        313: 'SHOWER RAIN', 314: 'HEAVY SHOWER', 321: 'SHOWER DRIZZLE',
        500: 'LIGHT RAIN', 501: 'MODERATE RAIN', 502: 'HEAVY RAIN',
        503: 'VERY HEAVY RAIN', 504: 'EXTREME RAIN', 511: 'FREEZING RAIN',
        520: 'LIGHT SHOWER', 521: 'SHOWER RAIN', 522: 'HEAVY SHOWER',
        531: 'ROUGH SHOWER',
        600: 'LIGHT SNOW', 601: 'SNOW', 602: 'HEAVY SNOW',
        611: 'SLEET', 612: 'LIGHT SLEET', 613: 'HEAVY SLEET',
        615: 'LIGHT RAIN SNOW', 616: 'RAIN SNOW', 620: 'LIGHT SHOWER SNOW',
        621: 'SHOWER SNOW', 622: 'HEAVY SHOWER SNOW',
        701: 'MIST', 711: 'SMOKE', 721: 'HAZE', 731: 'SAND DUST',
        741: 'FOG', 751: 'SAND', 761: 'DUST', 762: 'VOLCANIC ASH',
        771: 'SQUALLS', 781: 'TORNADO',
        800: 'CLEAR SKY',
        801: 'FEW CLOUDS', 802: 'SCATTERED CLOUDS',
        803: 'BROKEN CLOUDS', 804: 'OVERCAST'
    };
    return conditions[code] || 'UNKNOWN';
}

/**
 * Get AQI label and color
 */
function getAQIInfo(aqi) {
    const levels = [
        { max: 50, label: 'GOOD', color: '#00e400' },
        { max: 100, label: 'MODERATE', color: '#ffff00' },
        { max: 150, label: 'UNHEALTHY (SENSITIVE)', color: '#ff7e00' },
        { max: 200, label: 'UNHEALTHY', color: '#ff0000' },
        { max: 300, label: 'VERY UNHEALTHY', color: '#8f3f97' },
        { max: 500, label: 'HAZARDOUS', color: '#7e0023' }
    ];
    return levels.find(l => aqi <= l.max) || levels[levels.length - 1];
}

/**
 * Animate number counting
 */
function animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const diff = end - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (diff * easeOut);
        
        element.textContent = Math.round(current * 10) / 10 + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Update clock display
 */
function updateClock() {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    DOM.lastUpdate.textContent = `LAST UPDATE: ${timeStr}`;
}

// === DATA FETCHING ===

/**
 * Fetch weather data from API
 */
async function fetchWeatherData(city) {
    try {
        state.isLoading = true;
        updateStatus('FETCHING...', 'var(--accent-yellow)');
        
        // Get coordinates first
        const geoResponse = await fetch(
            `${CONFIG.GEO_API}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${CONFIG.API_KEY}`
        );
        
        if (!geoResponse.ok) throw new Error('Geocoding failed');
        
        const geoData = await geoResponse.json();
        if (!geoData.length) throw new Error('City not found');
        
        const { lat, lon, name, country } = geoData[0];
        state.coordinates = { lat, lon };
        state.currentCity = name;
        
        // Fetch current weather
        const weatherResponse = await fetch(
            `${CONFIG.API_BASE}/weather?lat=${lat}&lon=${lon}&units=${CONFIG.UNITS}&appid=${CONFIG.API_KEY}`
        );
        
        if (!weatherResponse.ok) throw new Error('Weather fetch failed');
        
        const weatherData = await weatherResponse.json();
        state.weatherData = weatherData;
        
        // Fetch forecast
        const forecastResponse = await fetch(
            `${CONFIG.API_BASE}/forecast?lat=${lat}&lon=${lon}&units=${CONFIG.UNITS}&appid=${CONFIG.API_KEY}`
        );
        
        if (!forecastResponse.ok) throw new Error('Forecast fetch failed');
        
        const forecastData = await forecastResponse.json();
        state.forecastData = forecastData;
        
        // Try to fetch AQI
        try {
            const aqiResponse = await fetch(
                `${CONFIG.API_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`
            );
            if (aqiResponse.ok) {
                const aqiData = await aqiResponse.json();
                state.aqiData = aqiData;
            }
        } catch (e) {
            console.warn('AQI data unavailable:', e);
        }
        
        // Update UI
        updateUI(weatherData, forecastData, `${name}, ${country}`);
        
        state.lastUpdate = new Date();
        updateStatus('OPERATIONAL', 'var(--accent-green)');
        state.isLoading = false;
        
        // Update location display
        DOM.locationDisplay.textContent = `${name}, ${country}`.toUpperCase();
        
    } catch (error) {
        console.error('Fetch error:', error);
        updateStatus('ERROR: ' + error.message.toUpperCase(), 'var(--accent-red)');
        state.isLoading = false;
        
        // Load demo data on error
        loadDemoData(city);
    }
}

/**
 * Update status display
 */
function updateStatus(text, color) {
    DOM.footerStatus.textContent = `STATUS: ${text}`;
    DOM.footerStatus.style.color = color;
}

/**
 * Update all UI elements
 */
function updateUI(weather, forecast, locationName) {
    // === TEMPERATURE ===
    const temp = Math.round(weather.main.temp);
    const feelsLike = Math.round(weather.main.feels_like);
    const condition = getConditionText(weather.weather[0].id);
    
    animateValue(DOM.tempValue, 0, temp, CONFIG.ANIMATION_DURATION);
    DOM.feelsLike.textContent = feelsLike;
    DOM.tempCondition.textContent = `[ ${condition} ]`;
    
    // === HUMIDITY ===
    const humidity = weather.main.humidity;
    DOM.humidity.textContent = humidity;
    DOM.humidityBar.style.width = humidity + '%';
    
    // Color based on humidity
    if (humidity > 70) {
        DOM.humidityBar.style.background = 'var(--accent-cyan)';
    } else if (humidity < 30) {
        DOM.humidityBar.style.background = 'var(--accent-orange)';
    } else {
        DOM.humidityBar.style.background = 'var(--accent-green)';
    }
    
    // === PRESSURE ===
    const pressure = weather.main.pressure;
    DOM.pressure.textContent = pressure;
    
    // Pressure trend indicator
    if (pressure > 1020) {
        DOM.pressureTrend.textContent = '↑ HIGH';
        DOM.pressureTrend.style.color = 'var(--accent-green)';
    } else if (pressure < 1000) {
        DOM.pressureTrend.textContent = '↓ LOW';
        DOM.pressureTrend.style.color = 'var(--accent-red)';
    } else {
        DOM.pressureTrend.textContent = '→ STABLE';
        DOM.pressureTrend.style.color = 'var(--text-secondary)';
    }
    
    // === VISIBILITY ===
    const visibility = (weather.visibility / 1000).toFixed(1);
    DOM.visibility.textContent = visibility;
    
    // === UV INDEX (simulated based on time/clouds) ===
    const cloudiness = weather.clouds.all;
    const hour = new Date().getHours();
    let simulatedUV = 0;
    
    if (hour >= 6 && hour <= 18) {
        const peakHour = 12;
        const hourDiff = Math.abs(hour - peakHour);
        const baseUV = 8 - (hourDiff * 0.8);
        simulatedUV = Math.max(0, baseUV * (1 - cloudiness / 100));
    }
    
    DOM.uvIndex.textContent = Math.round(simulatedUV);
    DOM.uvMarker.style.left = `${Math.min(simulatedUV / 11 * 100, 100)}%`;
    
    // Color UV value
    if (simulatedUV > 8) {
        DOM.uvIndex.style.color = 'var(--accent-red)';
    } else if (simulatedUV > 5) {
        DOM.uvIndex.style.color = 'var(--accent-orange)';
    } else if (simulatedUV > 2) {
        DOM.uvIndex.style.color = 'var(--accent-yellow)';
    } else {
        DOM.uvIndex.style.color = 'var(--accent-green)';
    }
    
    // === WIND ===
    const windSpeed = weather.wind.speed;
    const windGust = weather.wind.gust || windSpeed * 1.5;
    const windDeg = weather.wind.deg;
    
    DOM.windSpeed.textContent = windSpeed.toFixed(1);
    DOM.windGust.textContent = windGust.toFixed(1);
    DOM.windDir.textContent = windDeg;
    
    // Rotate compass arrow
    DOM.windArrow.style.transform = `translate(-50%, -100%) rotate(${windDeg}deg)`;
    
    // === SUNRISE/SUNSET ===
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const timezone = weather.timezone;
    
    DOM.sunrise.textContent = formatTime(sunrise, timezone);
    DOM.sunset.textContent = formatTime(sunset, timezone);
    
    // Calculate sun position
    const now = Math.floor(Date.now() / 1000);
    const dayLength = sunset - sunrise;
    const timeSinceSunrise = now - sunrise;
    let sunPosition = (timeSinceSunrise / dayLength) * 100;
    sunPosition = Math.max(0, Math.min(100, sunPosition));
    
    if (now < sunrise || now > sunset) {
        sunPosition = now < sunrise ? 0 : 100;
    }
    
    DOM.arcSun.style.left = `${sunPosition}%`;
    
    // === WEATHER ALERTS ===
    checkAlerts(weather);
    
    // === AQI ===
    if (state.aqiData && state.aqiData.list && state.aqiData.list[0]) {
        const aqi = state.aqiData.list[0].main.aqi * 50; // Convert 1-5 scale to approximate AQI
        const aqiComponents = state.aqiData.list[0].components;
        const pm25 = aqiComponents.pm2_5;
        
        // Better AQI estimate based on PM2.5
        let estimatedAQI = pm25;
        if (pm25 > 35) estimatedAQI = pm25 * 1.5;
        if (pm25 > 55) estimatedAQI = pm25 * 2;
        
        const aqiInfo = getAQIInfo(estimatedAQI);
        DOM.aqiNumber.textContent = Math.round(estimatedAQI);
        DOM.aqiNumber.style.color = aqiInfo.color;
        DOM.aqiLabel.textContent = `[ ${aqiInfo.label} ]`;
        DOM.aqiMarker.style.left = `${Math.min(estimatedAQI / 500 * 100, 100)}%`;
    }
    
    // === HOURLY FORECAST ===
    updateHourlyForecast(forecast);
    
    // === DAILY FORECAST ===
    updateDailyForecast(forecast);
    
    // === PRECIPITATION BARS ===
    updatePrecipitation(forecast);
}

/**
 * Check for weather alerts
 */
function checkAlerts(weather) {
    const condition = weather.weather[0].id;
    const windSpeed = weather.wind.speed;
    const temp = weather.main.temp;
    
    let alerts = [];
    
    // Thunderstorm alert
    if (condition >= 200 && condition < 300) {
        alerts.push('THUNDERSTORM WARNING // SEEK SHELTER IMMEDIATELY');
    }
    
    // Extreme heat
    if (temp > 35) {
        alerts.push(`EXTREME HEAT ALERT // ${Math.round(temp)}°C // STAY HYDRATED`);
    }
    
    // Extreme cold
    if (temp < -10) {
        alerts.push(`EXTREME COLD ALERT // ${Math.round(temp)}°C // FROSTBITE RISK`);
    }
    
    // High wind
    if (windSpeed > 20) {
        alerts.push(`HIGH WIND WARNING // ${windSpeed.toFixed(1)} m/s // SECURE LOOSE OBJECTS`);
    }
    
    // Fog
    if (condition === 741) {
        alerts.push('DENSE FOG ADVISORY // REDUCED VISIBILITY // DRIVE CAREFULLY');
    }
    
    // Snow
    if (condition >= 600 && condition < 700) {
        alerts.push('WINTER WEATHER ALERT // SNOW CONDITIONS // TRAVEL WITH CAUTION');
    }
    
    if (alerts.length > 0) {
        DOM.alertBlock.style.display = 'flex';
        DOM.alertBody.innerHTML = alerts.join('<br>// ');
    } else {
        DOM.alertBlock.style.display = 'none';
    }
}

/**
 * Update hourly forecast table
 */
function updateHourlyForecast(forecast) {
    const hours = forecast.list.slice(0, 8); // Next 24 hours (3-hour intervals)
    
    DOM.hourlyBody.innerHTML = hours.map((hour, index) => {
        const time = formatHour(hour.dt);
        const temp = Math.round(hour.main.temp);
        const feels = Math.round(hour.main.feels_like);
        const wind = hour.wind.speed.toFixed(1);
        const precip = Math.round((hour.pop || 0) * 100);
        const hum = hour.main.humidity;
        const condition = getConditionText(hour.weather[0].id);
        
        // Precipitation highlight
        const precipClass = precip > 50 ? 'text-cyan' : precip > 20 ? 'text-yellow' : '';
        
        return `
            <tr style="animation: fadeSlideIn 0.3s ease-out ${index * 0.05}s both;">
                <td style="color: var(--accent-yellow);">${time}</td>
                <td>${temp}°</td>
                <td style="color: var(--text-secondary);">${feels}°</td>
                <td>${wind} m/s</td>
                <td class="${precipClass}">${precip}%</td>
                <td>${hum}%</td>
                <td style="color: var(--accent-cyan); font-size: 0.7rem;">${condition}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Update daily forecast
 */
function updateDailyForecast(forecast) {
    // Group by day
    const dailyData = {};
    
    forecast.list.forEach(item => {
        const day = formatDay(item.dt);
        if (!dailyData[day]) {
            dailyData[day] = {
                temps: [],
                icon: item.weather[0].icon,
                condition: item.weather[0].id
            };
        }
        dailyData[day].temps.push(item.main.temp);
    });
    
    const days = Object.entries(dailyData).slice(0, 7);
    
    DOM.dailyGrid.innerHTML = days.map(([day, data], index) => {
        const high = Math.round(Math.max(...data.temps));
        const low = Math.round(Math.min(...data.temps));
        const icon = getWeatherIcon(data.icon);
        
        return `
            <div class="daily-card" style="animation: fadeSlideIn 0.3s ease-out ${index * 0.05}s both;">
                <div class="daily-day">${day}</div>
                <div class="daily-icon">${icon}</div>
                <div class="daily-temps">
                    <span class="daily-high">${high}°</span>
                    <span class="daily-sep">/</span>
                    <span class="daily-low">${low}°</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update precipitation bars
 */
function updatePrecipitation(forecast) {
    const hours = forecast.list.slice(0, 24);
    
    DOM.precipBars.innerHTML = hours.map((hour, index) => {
        const precip = Math.round((hour.pop || 0) * 100);
        const height = Math.max(2, precip * 1.5);
        const time = formatHour(hour.dt);
        
        return `
            <div class="precip-bar" 
                 style="height: ${height}px; animation: growUp 0.5s ease-out ${index * 0.03}s both;"
                 data-value="${precip}% @ ${time}">
            </div>
        `;
    }).join('');
}

/**
 * Load demo data for when API fails
 */
function loadDemoData(city) {
    console.log('Loading demo data for:', city);
    
    const demoWeather = {
        main: {
            temp: 18,
            feels_like: 16,
            humidity: 65,
            pressure: 1015
        },
        visibility: 10000,
        wind: {
            speed: 5.2,
            deg: 225,
            gust: 8.1
        },
        clouds: { all: 40 },
        weather: [{ id: 801, icon: '02d' }],
        sys: {
            sunrise: Math.floor(Date.now() / 1000) - 21600,
            sunset: Math.floor(Date.now() / 1000) + 21600
        },
        timezone: 0
    };
    
    const demoForecast = {
        list: Array.from({ length: 40 }, (_, i) => ({
            dt: Math.floor(Date.now() / 1000) + (i * 10800),
            main: {
                temp: 15 + Math.random() * 10,
                feels_like: 14 + Math.random() * 10,
                humidity: 50 + Math.random() * 30
            },
            wind: { speed: 3 + Math.random() * 7 },
            pop: Math.random() * 0.5,
            weather: [{ id: [800, 801, 802, 500, 501][Math.floor(Math.random() * 5)], icon: '02d' }],
            clouds: { all: Math.random() * 100 }
        }))
    };
    
    state.aqiData = {
        list: [{
            main: { aqi: 2 },
            components: { pm2_5: 25 }
        }]
    };
    
    updateUI(demoWeather, demoForecast, `${city.toUpperCase()} [DEMO]`);
    DOM.locationDisplay.textContent = `${city.toUpperCase()} [DEMO DATA]`;
}

// === SCROLL REVEAL ===

/**
 * Initialize scroll reveal observer
 */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    DOM.revealElements.forEach(el => observer.observe(el));
}

// === KEYBOARD SHORTCUTS ===

/**
 * Handle keyboard shortcuts
 */
function handleKeyboard(e) {
    // Focus search on '/'
    if (e.key === '/' && document.activeElement !== DOM.locationInput) {
        e.preventDefault();
        DOM.locationInput.focus();
    }
    
    // Escape to blur
    if (e.key === 'Escape') {
        DOM.locationInput.blur();
    }
    
    // Enter to search
    if (e.key === 'Enter' && document.activeElement === DOM.locationInput) {
        handleLocationSubmit();
    }
}

// === EVENT HANDLERS ===

/**
 * Handle location search
 */
function handleLocationSubmit() {
    const city = DOM.locationInput.value.trim();
    if (city && !state.isLoading) {
        fetchWeatherData(city);
        DOM.locationInput.value = '';
        DOM.locationInput.blur();
    }
}

// === INITIALIZATION ===

/**
 * Initialize the application
 */
function init() {
    console.log('%c BRUTAL WEATHER // INITIALIZING...', 
        'background: #ffd000; color: #0d0d0d; padding: 4px 8px; font-family: monospace;');
    
    // Set up event listeners
    DOM.locationBtn.addEventListener('click', handleLocationSubmit);
    DOM.locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLocationSubmit();
    });
    document.addEventListener('keydown', handleKeyboard);
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initial data fetch
    fetchWeatherData(CONFIG.DEFAULT_CITY);
    
    // Auto-refresh
    setInterval(() => {
        if (state.currentCity && !state.isLoading) {
            fetchWeatherData(state.currentCity);
        }
    }, CONFIG.UPDATE_INTERVAL);
    
    // Add CSS animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeSlideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes growUp {
            from {
                transform: scaleY(0);
                transform-origin: bottom;
            }
            to {
                transform: scaleY(1);
                transform-origin: bottom;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('%c STATUS: OPERATIONAL // NO BEAUTY. ONLY DATA.', 
        'background: #00ff00; color: #0d0d0d; padding: 4px 8px; font-family: monospace;');
}

// === START ===
document.addEventListener('DOMContentLoaded', init);
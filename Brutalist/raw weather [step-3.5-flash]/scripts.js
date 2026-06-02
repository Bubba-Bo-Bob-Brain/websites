// ============================================
// WEATHER TERMINAL KX-79 // RAW_INTERFACE
// ============================================

// API CONFIGURATION (REPLACE WITH YOUR OWN KEY FOR REAL DATA)
const API_KEY = ''; // OpenWeatherMap API key (optional - will use mock data if empty)
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// DOM ELEMENTS
const elements = {
    locationInput: document.getElementById('location-input'),
    locSubmit: document.getElementById('loc-submit'),
    latDisplay: document.getElementById('lat-display'),
    lonDisplay: document.getElementById('lon-display'),
    timezoneDisplay: document.getElementById('timezone-display'),
    clock: document.getElementById('clock'),
    currentTemp: document.getElementById('current-temp'),
    tempCondition: document.getElementById('temp-condition'),
    windArrow: document.getElementById('wind-arrow'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    uvIndex: document.getElementById('uv-index'),
    dewpoint: document.getElementById('dewpoint'),
    cloudCover: document.getElementById('cloud-cover'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    hourlyTableBody: document.querySelector('#hourly-table tbody'),
    weeklyForecast: document.getElementById('weekly-forecast'),
    alertsPanel: document.getElementById('alerts-panel'),
    alertMessage: document.getElementById('alert-message'),
    alertExpiry: document.getElementById('alert-expiry'),
    lastUpdate: document.getElementById('last-update'),
    latency: document.getElementById('latency'),
    marquee: document.querySelector('.marquee-content')
};

// SYSTEM STATE
let currentLocation = {
    name: 'NEW YORK CITY',
    lat: 40.7128,
    lon: -74.0060,
    timezone: -5
};

// WEATHER CONDITIONS MAPPING
const weatherConditions = {
    '01d': 'CLEAR', '01n': 'CLEAR',
    '02d': 'PARTLY CLOUDY', '02n': 'PARTLY CLOUDY',
    '03d': 'CLOUDY', '03n': 'CLOUDY',
    '04d': 'OVERCAST', '04n': 'OVERCAST',
    '09d': 'RAIN', '09n': 'RAIN',
    '10d': 'RAIN', '10n': 'RAIN',
    '11d': 'STORM', '11n': 'STORM',
    '13d': 'SNOW', '13n': 'SNOW',
    '50d': 'FOG', '50n': 'FOG'
};

// ALERT MESSAGES (BRUTALIST)
const alertMessages = [
    { type: 'SEVERE', text: 'TORNADO WARNING: TAKE SHELTER IMMEDIATELY', color: '#ff3333' },
    { type: 'MODERATE', text: 'HEAT ADVISORY: HIGH RISK OF HEAT EXHAUSTION', color: '#ff9900' },
    { type: 'MINOR', text: 'FLOOD WATCH: WATER LEVELS RISING IN LOW-LYING AREAS', color: '#ffff00' },
    { type: 'SEVERE', text: 'BLIZZARD WARNING: WHITEOUT CONDITIONS EXPECTED', color: '#ff3333' }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initEventListeners();
    loadWeatherData(currentLocation);
    startRealTimeUpdates();
    addGlitchEffects();
});

function initEventListeners() {
    elements.locSubmit.addEventListener('click', handleLocationSearch);
    elements.locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLocationSearch();
    });
}

function handleLocationSearch() {
    const query = elements.locationInput.value.trim();
    if (!query) return;
    
    // Check if query is coordinates (simple regex)
    const coordMatch = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    
    if (coordMatch) {
        currentLocation = {
            name: `COORDINATES (${query})`,
            lat: parseFloat(coordMatch[1]),
            lon: parseFloat(coordMatch[2]),
            timezone: 0
        };
    } else {
        // For city names, we'll use the geocoding API
        geocodeCity(query);
    }
}

async function geocodeCity(city) {
    if (!API_KEY) {
        // Mock geocoding
        const mockCoords = {
            'LONDON': { lat: 51.5074, lon: -0.1278, timezone: 0 },
            'TOKYO': { lat: 35.6762, lon: 139.6503, timezone: 9 },
            'PARIS': { lat: 48.8566, lon: 2.3522, timezone: 1 },
            'BERLIN': { lat: 52.5200, lon: 13.4050, timezone: 1 },
            'SYDNEY': { lat: -33.8688, lon: 151.2093, timezone: 10 }
        };
        
        const normalized = city.toUpperCase();
        if (mockCoords[normalized]) {
            currentLocation = {
                name: normalized,
                ...mockCoords[normalized]
            };
            loadWeatherData(currentLocation);
        } else {
            // Random coordinates for unknown cities
            currentLocation = {
                name: city.toUpperCase(),
                lat: (Math.random() * 180 - 90).toFixed(4),
                lon: (Math.random() * 360 - 180).toFixed(4),
                timezone: Math.floor(Math.random() * 24 - 12)
            };
            loadWeatherData(currentLocation);
        }
        return;
    }
    
    try {
        const response = await fetch(
            `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
        );
        const data = await response.json();
        
        if (data.cod === 200) {
            currentLocation = {
                name: data.name.toUpperCase(),
                lat: data.coord.lat,
                lon: data.coord.lon,
                timezone: data.timezone / 3600
            };
            loadWeatherData(currentLocation);
        }
    } catch (error) {
        console.error('Geocoding failed:', error);
        showAlert('ERROR', 'LOCATION NOT FOUND', 0);
    }
}

// ============================================
// WEATHER DATA LOADING
// ============================================

async function loadWeatherData(location) {
    const startTime = performance.now();
    
    if (API_KEY) {
        await fetchRealWeather(location);
    } else {
        await loadMockWeather(location);
    }
    
    const endTime = performance.now();
    elements.latency.textContent = Math.round(endTime - startTime);
    elements.lastUpdate.textContent = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

async function fetchRealWeather(location) {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${API_BASE}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=imperial`),
            fetch(`${API_BASE}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=imperial`)
        ]);
        
        const current = await currentRes.json();
        const forecast = await forecastRes.json();
        
        if (current.cod === 200 && forecast.cod === '200') {
            updateCurrentWeather(current);
            updateHourlyForecast(forecast.list.slice(0, 12)); // Next 36 hours (12 * 3-hour intervals)
            updateWeeklyForecast(forecast.list);
            updateCoordinates(location.name, location.lat, location.lon, location.timezone);
        }
    } catch (error) {
        console.error('API fetch failed:', error);
        loadMockWeather(location);
    }
}

async function loadMockWeather(location) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    const now = new Date();
    const hour = now.getHours();
    
    // Generate realistic mock data based on time and location
    const baseTemp = location.lat > 0 ? 
        (60 - Math.abs(location.lat) * 0.5) : // Colder as you go north
        (80 - Math.abs(location.lat) * 0.3);  // Warmer in south
    
    const currentTemp = Math.round(baseTemp + (Math.random() * 20 - 10));
    const conditions = Object.keys(weatherConditions);
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const mockCurrent = {
        name: location.name,
        coord: { lat: location.lat, lon: location.lon },
        main: {
            temp: currentTemp,
            humidity: Math.round(40 + Math.random() * 40),
            pressure: Math.round(1010 + Math.random() * 20),
            feels_like: currentTemp + (Math.random() * 4 - 2),
            dew_point: currentTemp - (10 + Math.random() * 10)
        },
        weather: [{ icon: randomCondition, description: weatherConditions[randomCondition] }],
        wind: { speed: Math.round(5 + Math.random() * 20), deg: Math.floor(Math.random() * 360) },
        visibility: Math.round(5 + Math.random() * 10),
        clouds: { all: Math.round(Math.random() * 100) },
        sys: {
            sunrise: 1609459200 + hour * 3600 + (6 * 3600), // Mock sunrise
            sunset: 1609459200 + hour * 3600 + (18 * 3600) // Mock sunset
        },
        timezone: location.timezone * 3600
    };
    
    // Generate mock hourly forecast
    const mockForecastList = [];
    for (let i = 0; i < 12; i++) {
        const hourOffset = i * 3;
        const tempChange = Math.sin(hourOffset / 12 * Math.PI) * 10;
        mockForecastList.push({
            dt: Math.floor(now.getTime() / 1000) + hourOffset * 3600,
            main: {
                temp: currentTemp + tempChange + (Math.random() * 4 - 2),
                humidity: Math.round(40 + Math.random() * 40),
                pressure: Math.round(1010 + Math.random() * 10)
            },
            weather: [{ 
                icon: conditions[Math.floor(Math.random() * conditions.length)],
                description: weatherConditions[conditions[Math.floor(Math.random() * conditions.length)]]
            }],
            wind: { speed: Math.round(5 + Math.random() * 15), deg: Math.floor(Math.random() * 360) },
            pop: Math.round(Math.random() * 100), // Probability of precipitation
            clouds: { all: Math.round(Math.random() * 100) }
        });
    }
    
    const mockForecast = { list: mockForecastList };
    
    updateCurrentWeather(mockCurrent);
    updateHourlyForecast(mockForecastList);
    updateWeeklyForecast(mockForecastList);
    updateCoordinates(location.name, location.lat, location.lon, location.timezone);
    
    // Randomly show alerts sometimes
    if (Math.random() > 0.7) {
        const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        showAlert(alert.type, alert.text, 30 + Math.random() * 60);
    }
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

function updateCurrentWeather(data) {
    // Temperature with dramatic animation
    animateValue(elements.currentTemp, parseInt(elements.currentTemp.textContent), Math.round(data.main.temp), 1000);
    
    elements.tempCondition.textContent = data.weather[0].description;
    elements.windSpeed.textContent = data.wind.speed;
    elements.windArrow.style.setProperty('--wind-deg', `${data.wind.deg}deg`);
    
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.pressure.textContent = `${Math.round(data.main.pressure)} hPa`;
    elements.visibility.textContent = `${data.visibility / 1000} km`;
    elements.cloudCover.textContent = `${data.clouds.all}%`;
    elements.dewpoint.textContent = `${Math.round(data.main.dew_point)}°F`;
    
    // UV Index (mock if not available)
    const uv = Math.round(Math.random() * 11);
    elements.uvIndex.textContent = uv;
    elements.uvIndex.style.color = uv > 7 ? '#ff3333' : uv > 4 ? '#ffff00' : '#ccff00';
    
    // Sunrise/Sunset conversion
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    elements.sunrise.textContent = sunrise.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    elements.sunset.textContent = sunset.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function updateHourlyForecast(hourlyData) {
    elements.hourlyTableBody.innerHTML = '';
    
    hourlyData.forEach((hour, index) => {
        const date = new Date(hour.dt * 1000);
        const timeStr = date.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const condition = weatherConditions[hour.weather[0].icon] || hour.weather[0].description;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="time-cell">${timeStr}</td>
            <td class="temp-cell">${Math.round(hour.main.temp)}°</td>
            <td class="cond-cell">${condition}</td>
            <td class="precip-cell">${hour.pop}%</td>
            <td class="wind-cell">
                <div class="wind-indicator" style="--dir: ${hour.wind.deg}deg;">
                    <div class="wind-dir-arrow"></div>
                </div>
                ${hour.wind.speed}
            </td>
            <td class="hum-cell">${hour.main.humidity}%</td>
        `;
        
        // Staggered animation
        row.style.animation = `slideIn 0.3s ease-out ${index * 0.05}s both`;
        elements.hourlyTableBody.appendChild(row);
    });
}

function updateWeeklyForecast(hourlyData) {
    elements.weeklyForecast.innerHTML = '';
    
    // Group by day
    const dailyData = {};
    hourlyData.forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
                date: date,
                temps: [],
                conditions: [],
                icons: []
            };
        }
        
        dailyData[dayKey].temps.push(hour.main.temp);
        dailyData[dayKey].conditions.push(hour.weather[0].description);
        dailyData[dayKey].icons.push(hour.weather[0].icon);
    });
    
    // Take up to 7 days
    const days = Object.values(dailyData).slice(0, 7);
    
    days.forEach((day, index) => {
        const high = Math.max(...day.temps);
        const low = Math.min(...day.temps);
        const mainCondition = day.conditions[0]; // Use first of day
        
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayName = dayNames[day.date.getDay()];
        const dateStr = day.date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        const card = document.createElement('div');
        card.className = 'weekly-card';
        card.innerHTML = `
            <div class="weekly-day">${dayName}</div>
            <div class="weekly-date">${dateStr}</div>
            <div class="weekly-temp">
                <span class="weekly-high">${Math.round(high)}°</span>
                <span class="weekly-low">${Math.round(low)}°</span>
            </div>
            <div class="weekly-condition">${mainCondition}</div>
        `;
        
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
        elements.weeklyForecast.appendChild(card);
    });
}

function updateCoordinates(name, lat, lon, timezone) {
    elements.latDisplay.textContent = lat.toFixed(4);
    elements.lonDisplay.textContent = lon.toFixed(4);
    elements.timezoneDisplay.textContent = timezone > 0 ? `UTC+${timezone}` : `UTC${timezone}`;
    elements.locationInput.value = name;
}

function showAlert(type, message, expiresInMinutes) {
    elements.alertsPanel.style.display = 'flex';
    elements.alertMessage.textContent = message;
    
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + expiresInMinutes);
    elements.alertExpiry.textContent = expiry.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Color based on type
    const colors = {
        'SEVERE': '#ff3333',
        'MODERATE': '#ff9900',
        'MINOR': '#ffff00'
    };
    elements.alertsPanel.style.backgroundColor = colors[type] || '#ff3333';
    
    // Auto-hide after expiresInMinutes
    setTimeout(() => {
        elements.alertsPanel.style.display = 'none';
    }, expiresInMinutes * 60 * 1000);
}

// ============================================
// CLOCK & REAL-TIME UPDATES
// ============================================

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    elements.clock.textContent = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

function startRealTimeUpdates() {
    // Update weather every 10 minutes
    setInterval(() => {
        loadWeatherData(currentLocation);
    }, 10 * 60 * 1000);
    
    // Random glitch effects
    setInterval(() => {
        if (Math.random() > 0.95) {
            triggerGlitch();
        }
    }, 3000);
}

// ============================================
// ANIMATIONS & EFFECTS
// ============================================

function animateValue(element, start, end, duration) {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    
    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        element.textContent = value;
        
        if (value !== end) {
            requestAnimationFrame(run);
        }
    }
    
    requestAnimationFrame(run);
}

function addGlitchEffects() {
    // Random glitch on marquee
    setInterval(() => {
        if (Math.random() > 0.9) {
            elements.marquee.style.textShadow = `
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(255,0,0,0.7),
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(0,255,0,0.7),
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(0,0,255,0.7)
            `;
            setTimeout(() => {
                elements.marquee.style.textShadow = 'none';
            }, 100);
        }
    }, 2000);
}

function triggerGlitch() {
    document.body.classList.add('glitch-active');
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
    }, 200);
}

// ============================================
// ADDITIONAL STYLES INJECTION (FOR DYNAMIC EFFECTS)
// ============================================

const glitchStyles = document.createElement('style');
glitchStyles.textContent = `
    .glitch-active .temp-display {
        animation: glitch-text 0.3s infinite;
        text-shadow: 
            -2px -2px 0 var(--color-alert-red),
            2px 2px 0 var(--color-acid-green);
    }
    
    @keyframes glitch-text {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    .wind-indicator {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        margin-right: 4px;
        vertical-align: middle;
    }
    
    .wind-dir-arrow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 12px solid var(--color-acid-green);
        transform-origin: center;
        transform: rotate(calc(var(--dir) - 90deg));
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .time-cell { font-weight: bold; color: var(--color-acid-green); }
    .temp-cell { font-weight: bold; color: var(--color-acid-yellow); }
    .cond-cell { text-transform: uppercase; font-size: 11px; }
    .precip-cell { color: var(--color-acid-green); }
    .wind-cell { display: flex; align-items: center; }
    .hum-cell { color: var(--color-acid-green); }
`;
document.head.appendChild(glitchStyles);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K to focus location input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.locationInput.focus();
        elements.locationInput.select();
    }
    
    // Escape to clear alerts
    if (e.key === 'Escape') {
        elements.alertsPanel.style.display = 'none';
    }
    
    // Ctrl+R to refresh (without cache)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        loadWeatherData(currentLocation);
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log(`
%c
╔══════════════════════════════════════════╗
║     WEATHER TERMINAL KX-79             ║
║     RAW_INTERFACE v3.2                 ║
║                                        ║
║     SYSTEM STATUS: OPERATIONAL         ║
║     DATA SOURCE: ${API_KEY ? 'OPENWEATHERMAP' : 'MOCK_DATA'}       ║
║     CONNECTION: ${API_KEY ? 'ENCRYPTED' : 'LOCAL'}               ║
╚══════════════════════════════════════════╝
`, 'color: #ccff00; background: #000; font-family: monospace; padding: 10px;');

// ============================================
// PERFORMANCE MONITORING (DEBUG ONLY)
// ============================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setInterval(() => {
        const memory = performance.memory;
        if (memory) {
            console.log(`Memory used: ${Math.round(memory.usedJSHeapSize / 1048576)}MB`);
        }
    }, 30000);
}
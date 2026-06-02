// ============================================
// WEATHER DASHBOARD - BRUTALIST JAVASCRIPT
// RAW. EXPOSED. FUNCTIONAL.
// ============================================

// --- MOCK WEATHER DATA (Simulating API Response) ---
const weatherData = {
    current: {
        temperature: 72,
        feelsLike: 68,
        condition: 'PARTLY_CLOUDY',
        humidity: 72,
        dewPoint: 58,
        pressure: 30.12,
        pressureTrend: 'rising',
        windSpeed: 14,
        windGust: 23,
        windDirection: 270, // degrees
        windDirectionText: 'W',
        uvIndex: 6,
        visibility: 10,
        aqi: 42,
        aqiCategory: 'GOOD'
    },
    sun: {
        sunrise: '06:42',
        sunset: '19:58',
        daylight: '13h 16m',
        solarNoon: '13:20',
        maxElevation: 62.4
    },
    moon: {
        phase: 'FIRST_QUARTER',
        phaseEmoji: '🌓',
        illumination: 52,
        rise: '14:28',
        set: '02:45'
    },
    alerts: [
        {
            type: 'ADVISORY',
            message: 'SMALL_CRAFT_ADVISORY_IN_EFFECT_UNTIL_1800PST',
            issued: '0945PST'
        }
    ],
    rawMetar: 'KSFO 051856Z 27014G23KT 10SM FEW035 SCT060 19/11 A3012',
    station: 'KSFO'
};

// --- DOM ELEMENT REFERENCES ---
const elements = {
    // Temperature
    mainTemp: document.getElementById('main-temp'),
    feelsLike: document.getElementById('feels-like'),
    condition: document.getElementById('condition'),
    tempBarFill: document.getElementById('temp-bar-fill'),
    tempBarMarker: document.getElementById('temp-bar-marker'),
    timestamp: document.getElementById('timestamp'),
    
    // Wind
    windArrow: document.getElementById('wind-arrow'),
    windDir: document.getElementById('wind-dir'),
    windDeg: document.getElementById('wind-deg'),
    windSpeed: document.getElementById('wind-speed'),
    windGust: document.getElementById('wind-gust'),
    beaufort: document.getElementById('beaufort'),
    
    // Humidity
    humidity: document.getElementById('humidity'),
    humidityFill: document.getElementById('humidity-fill'),
    dewPoint: document.getElementById('dew-point'),
    
    // Pressure
    pressure: document.getElementById('pressure'),
    pressureTrend: document.getElementById('pressure-trend'),
    
    // UV
    uvValue: document.getElementById('uv-value'),
    uvCategory: document.getElementById('uv-category'),
    
    // Visibility
    visValue: document.getElementById('vis-value'),
    visCondition: document.getElementById('vis-condition'),
    
    // Sun
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    daylight: document.getElementById('daylight'),
    
    // Alerts
    alertBanner: document.getElementById('alert-banner'),
    alertMessage: document.getElementById('alert-message'),
    
    // Hourly
    hourlyBody: document.getElementById('hourly-body'),
    peakTemp: document.getElementById('peak-temp'),
    
    // Weekly
    weeklyGrid: document.getElementById('weekly-grid'),
    
    // Precipitation
    rainChance: document.getElementById('rain-chance'),
    rainFill: document.getElementById('rain-fill'),
    snowChance: document.getElementById('snow-chance'),
    snowFill: document.getElementById('snow-fill'),
    precipAccum: document.getElementById('precip-accum'),
    humidTrend: document.getElementById('humid-trend'),
    
    // AQI
    aqiValue: document.getElementById('aqi-value'),
    aqiCategory: document.getElementById('aqi-category'),
    pm25: document.getElementById('pm25'),
    pm10: document.getElementById('pm10'),
    o3: document.getElementById('o3'),
    no2: document.getElementById('no2'),
    
    // Moon
    moonVisual: document.getElementById('moon-visual'),
    moonName: document.getElementById('moon-name'),
    moonIllum: document.getElementById('moon-illum'),
    moonrise: document.getElementById('moonrise'),
    moonset: document.getElementById('moonset'),
    solarNoon: document.getElementById('solar-noon'),
    solarElev: document.getElementById('solar-elev'),
    
    // Terminal
    terminalBody: document.getElementById('terminal-body'),
    obsTime: document.getElementById('obs-time'),
    rawMetar: document.getElementById('raw-metar'),
    
    // Footer
    currentTime: document.getElementById('current-time')
};

// --- UTILITY FUNCTIONS ---

// Convert wind degrees to cardinal direction
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Get Beaufort scale description
function getBeaufortDescription(speed) {
    if (speed < 1) return 'CALM';
    if (speed < 4) return 'LIGHT_AIR';
    if (speed < 8) return 'LIGHT_BREEZE';
    if (speed < 13) return 'GENTLE_BREEZE';
    if (speed < 19) return 'MODERATE_BREEZE';
    if (speed < 25) return 'FRESH_BREEZE';
    if (speed < 32) return 'STRONG_BREEZE';
    if (speed < 40) return 'NEAR_GALE';
    if (speed < 48) return 'GALE';
    if (speed < 56) return 'STRONG_GALE';
    return 'STORM';
}

// Get UV category
function getUVCategory(uvIndex) {
    if (uvIndex <= 2) return 'LOW';
    if (uvIndex <= 5) return 'MODERATE';
    if (uvIndex <= 7) return 'HIGH';
    if (uvIndex <= 10) return 'VERY_HIGH';
    return 'EXTREME';
}

// Get temperature color class
function getTemperatureColorClass(temp) {
    if (temp < 32) return 'cold';
    if (temp < 68) return 'cool';
    if (temp < 86) return 'mild';
    if (temp < 100) return 'warm';
    return 'hot';
}

// Generate random variation for simulation
function randomVariation(value, range) {
    return value + (Math.random() * range * 2 - range);
}

// Format time as HH:MM:SS
function formatTime(date) {
    return date.toTimeString().split(' ')[0];
}

// --- UPDATE FUNCTIONS ---

function updateCurrentTime() {
    const now = new Date();
    elements.currentTime.textContent = formatTime(now);
    elements.timestamp.textContent = `LAST_UPDATE: ${formatTime(now)}`;
}

function updateTemperature(temp) {
    elements.mainTemp.textContent = Math.round(temp);
    elements.mainTemp.className = `temp-value ${getTemperatureColorClass(temp)}`;
    
    // Update temperature bar (0-120°F scale)
    const percentage = Math.min(100, Math.max(0, (temp / 120) * 100));
    elements.tempBarFill.style.width = `${percentage}%`;
    elements.tempBarMarker.style.left = `${percentage}%`;
}

function updateWindData(speed, gust, direction) {
    elements.windSpeed.textContent = Math.round(speed);
    elements.windGust.textContent = Math.round(gust);
    elements.windDir.textContent = getWindDirection(direction);
    elements.windDeg.textContent = `${direction}°`;
    
    // Rotate wind arrow (convert degrees to CSS rotation)
    elements.windArrow.style.transform = `rotate(${direction}deg)`;
    
    // Update Beaufort description
    const beaufortDesc = getBeaufortDescription(speed);
    elements.beaufort.textContent = `BEAUFORT: ${Math.floor(speed / 5)} (${beaufortDesc})`;
}

function updateHumidity(humidity, dewPoint) {
    elements.humidity.innerHTML = `${humidity}<span class="percent">%</span>`;
    elements.humidityFill.style.height = `${humidity}%`;
    elements.dewPoint.textContent = dewPoint;
}

function updatePressure(pressure, trend) {
    elements.pressure.textContent = pressure.toFixed(2);
    
    const trendArrow = trend === 'rising' ? '↗' : trend === 'falling' ? '↘' : '→';
    const trendText = trend.toUpperCase();
    elements.pressureTrend.innerHTML = `<span class="trend-arrow">${trendArrow}</span> ${trendText}`;
}

function updateUV(uvIndex) {
    elements.uvValue.textContent = uvIndex;
    elements.uvValue.className = `uv-value ${getUVCategory(uvIndex).toLowerCase().replace('_', '-')}`;
    elements.uvCategory.textContent = getUVCategory(uvIndex);
    
    // Update active UV segment
    const uvSegments = document.querySelectorAll('.uv-segment');
    uvSegments.forEach((segment, index) => {
        segment.classList.remove('active');
        if (uvIndex >= index * 2 && uvIndex <= (index + 1) * 2) {
            segment.classList.add('active');
        }
    });
}

function updateAlerts() {
    if (weatherData.alerts && weatherData.alerts.length > 0) {
        elements.alertBanner.classList.add('active');
        elements.alertMessage.textContent = weatherData.alerts[0].message;
    } else {
        elements.alertBanner.classList.remove('active');
    }
}

function updateHourlyForecast() {
    const hourlyData = [];
    const baseTemp = weatherData.current.temperature;
    const now = new Date();
    
    // Generate 24 hours of mock data
    for (let i = 0; i < 24; i++) {
        const hour = new Date(now);
        hour.setHours(now.getHours() + i);
        
        // Temperature curve (higher in afternoon, lower at night)
        const hourOfDay = hour.getHours();
        let tempVariation = 0;
        if (hourOfDay >= 6 && hourOfDay <= 18) {
            tempVariation = Math.sin((hourOfDay - 6) / 12 * Math.PI) * 8;
        } else {
            tempVariation = -5 - Math.random() * 3;
        }
        
        const temp = Math.round(baseTemp + tempVariation + (Math.random() * 4 - 2));
        
        // Conditions based on time
        const conditions = ['CLEAR', 'PARTLY_CLOUDY', 'CLOUDY', 'LIGHT_RAIN', 'CLEAR'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        // Precipitation chance based on condition
        let precipChance = 0;
        if (condition === 'LIGHT_RAIN') precipChance = Math.round(60 + Math.random() * 30);
        else if (condition === 'CLOUDY') precipChance = Math.round(10 + Math.random() * 20);
        
        hourlyData.push({
            time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            temp: temp,
            condition: condition,
            precip: precipChance,
            wind: Math.round(weatherData.current.windSpeed + (Math.random() * 6 - 3)),
            humidity: Math.round(weatherData.current.humidity + (Math.random() * 10 - 5))
        });
    }
    
    // Clear and rebuild table
    elements.hourlyBody.innerHTML = '';
    
    hourlyData.forEach(hour => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hour.time}</td>
            <td>${hour.temp}°F</td>
            <td>${hour.condition}</td>
            <td>${hour.precip}%</td>
            <td>${hour.wind} MPH</td>
            <td>${hour.humidity}%</td>
        `;
        elements.hourlyBody.appendChild(row);
    });
    
    // Update peak temp display
    const peakTemp = Math.max(...hourlyData.map(h => h.temp));
    const peakHour = hourlyData.find(h => h.temp === peakTemp).time;
    elements.peakTemp.textContent = `${peakTemp}°F@${peakHour}`;
}

function updateWeeklyForecast() {
    const weeklyData = [];
    const conditions = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌤️'];
    const conditionNames = ['CLEAR', 'PARTLY_CLOUDY', 'CLOUDY', 'RAIN', 'STORM', 'MOSTLY_SUNNY'];
    
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
        const dayIndex = (today + i) % 7;
        const conditionIndex = Math.floor(Math.random() * conditions.length);
        
        weeklyData.push({
            day: days[dayIndex],
            icon: conditions[conditionIndex],
            condition: conditionNames[conditionIndex],
            high: Math.round(weatherData.current.temperature + (Math.random() * 10 - 5)),
            low: Math.round(weatherData.current.temperature - 10 - (Math.random() * 5)),
            precip: Math.round(Math.random() * 60)
        });
    }
    
    // Clear and rebuild grid
    elements.weeklyGrid.innerHTML = '';
    
    weeklyData.forEach((day, index) => {
        const card = document.createElement('div');
        card.className = `day-card ${index === 0 ? 'today' : ''}`;
        card.innerHTML = `
            <div class="day-name">${day.day}</div>
            <div class="day-icon">${day.icon}</div>
            <div class="day-high">${day.high}°</div>
            <div class="day-low">${day.low}°</div>
            <div class="day-condition">${day.condition}</div>
            <div class="day-precip">PRECIP: ${day.precip}%</div>
        `;
        elements.weeklyGrid.appendChild(card);
    });
}

function updatePrecipitation() {
    // Simulate precipitation data
    const rainChance = Math.round(Math.random() * 30);
    const snowChance = Math.round(Math.random() * 10);
    
    elements.rainChance.innerHTML = `${rainChance}<span class="percent">%</span>`;
    elements.rainFill.style.width = `${rainChance}%`;
    
    elements.snowChance.innerHTML = `${snowChance}<span class="percent">%</span>`;
    elements.snowFill.style.width = `${snowChance}%`;
    
    elements.precipAccum.innerHTML = `${(Math.random() * 0.1).toFixed(2)}<span class="unit">in</span>`;
    
    // Random humidity trend
    const trends = ['↗ INCREASING', '↘ DECREASING', '→ STEADY'];
    elements.humidTrend.textContent = trends[Math.floor(Math.random() * trends.length)];
}

function updateAQI() {
    const aqi = Math.round(weatherData.current.aqi + (Math.random() * 10 - 5));
    elements.aqiValue.textContent = aqi;
    
    // Determine AQI category
    let category = 'GOOD';
    let colorClass = 'good';
    
    if (aqi > 300) {
        category = 'HAZARDOUS';
        colorClass = 'hazardous';
    } else if (aqi > 200) {
        category = 'VERY_UNHEALTHY';
        colorClass = 'very-unhealthy';
    } else if (aqi > 150) {
        category = 'UNHEALTHY';
        colorClass = 'unhealthy';
    } else if (aqi > 100) {
        category = 'UNHEALTHY_FOR_SENSITIVE_GROUPS';
        colorClass = 'unhealthy-sensitive';
    } else if (aqi > 50) {
        category = 'MODERATE';
        colorClass = 'moderate';
    }
    
    elements.aqiCategory.textContent = category;
    elements.aqiValue.className = `aqi-value ${colorClass}`;
    
    // Update pollutant values
    elements.pm25.textContent = (Math.random() * 15).toFixed(1);
    elements.pm10.textContent = Math.round(Math.random() * 20);
    elements.o3.textContent = (Math.random() * 0.05).toFixed(3);
    elements.no2.textContent = (Math.random() * 0.03).toFixed(3);
}

function updateAstronomicalData() {
    // Moon data (static for demo)
    elements.moonVisual.textContent = weatherData.moon.phaseEmoji;
    elements.moonName.textContent = weatherData.moon.phase;
    elements.moonIllum.textContent = `${weatherData.moon.illumination}%`;
    elements.moonrise.textContent = weatherData.moon.rise;
    elements.moonset.textContent = weatherData.moon.set;
    elements.solarNoon.textContent = weatherData.sun.solarNoon;
    elements.solarElev.textContent = `${weatherData.sun.maxElevation}°`;
}

function updateTerminal() {
    const now = new Date();
    elements.obsTime.textContent = now.toISOString().slice(0, 19).replace('T', ' ');
    elements.rawMetar.textContent = weatherData.rawMetar;
    
    // Add new terminal line for update
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.textContent = `> DATA_REFRESH: ${formatTime(now)}`;
    newLine.style.animation = 'none';
    newLine.offsetHeight; // Trigger reflow
    newLine.style.animation = 'terminal-fade 0.3s ease forwards';
    
    // Insert before cursor line
    const cursorLine = elements.terminalBody.querySelector('.cursor-line');
    elements.terminalBody.insertBefore(newLine, cursorLine);
    
    // Keep only last 12 lines
    const lines = elements.terminalBody.querySelectorAll('.terminal-line:not(.cursor-line)');
    if (lines.length > 12) {
        lines[0].remove();
    }
}

// --- DATA SIMULATION (Replace with real API calls in production) ---
function simulateDataUpdate() {
    // Randomly vary current conditions
    weatherData.current.temperature = randomVariation(weatherData.current.temperature, 0.5);
    weatherData.current.feelsLike = weatherData.current.temperature - 4;
    weatherData.current.humidity = Math.round(randomVariation(weatherData.current.humidity, 2));
    weatherData.current.windSpeed = randomVariation(weatherData.current.windSpeed, 1);
    weatherData.current.windGust = weatherData.current.windSpeed + Math.round(Math.random() * 10);
    weatherData.current.windDirection = (weatherData.current.windDirection + Math.round(Math.random() * 10 - 5) + 360) % 360;
    weatherData.current.pressure = randomVariation(weatherData.current.pressure, 0.01);
    weatherData.current.uvIndex = Math.round(randomVariation(weatherData.current.uvIndex, 0.5));
    
    // Update UI with new data
    updateAllData();
}

function updateAllData() {
    updateTemperature(weatherData.current.temperature);
    updateWindData(
        weatherData.current.windSpeed,
        weatherData.current.windGust,
        weatherData.current.windDirection
    );
    updateHumidity(weatherData.current.humidity, weatherData.current.dewPoint);
    updatePressure(weatherData.current.pressure, weatherData.current.pressureTrend);
    updateUV(weatherData.current.uvIndex);
    updateAlerts();
    updatePrecipitation();
    updateAQI();
    updateTerminal();
}

// --- INITIALIZATION ---
function initializeDashboard() {
    // Set initial time
    updateCurrentTime();
    
    // Update hourly and weekly forecasts (these don't change frequently)
    updateHourlyForecast();
    updateWeeklyForecast();
    updateAstronomicalData();
    
    // Set initial condition text
    elements.condition.textContent = weatherData.current.condition;
    elements.visCondition.textContent = 'CLEAR';
    
    // Initial data update
    updateAllData();
    
    // Set up intervals
    setInterval(updateCurrentTime, 1000); // Update time every second
    setInterval(simulateDataUpdate, 30000); // Update weather data every 30 seconds
    
    // Initial terminal setup
    updateTerminal();
    
    // Show alert after 3 seconds (for demo)
    setTimeout(() => {
        if (Math.random() > 0.7) { // 30% chance to show alert
            elements.alertBanner.classList.add('active');
        }
    }, 3000);
    
    console.log('WEATHER_DASHBOARD_INITIALIZED');
    console.log('DATA_SOURCE: SIMULATED');
    console.log('UPDATE_INTERVAL: 30s');
}

// --- EVENT LISTENERS ---
// Add hover effects for panels
document.querySelectorAll('.panel').forEach(panel => {
    panel.addEventListener('mouseenter', () => {
        panel.style.zIndex = '30';
    });
    
    panel.addEventListener('mouseleave', () => {
        panel.style.zIndex = '20';
    });
});

// Manual refresh button (hidden in header)
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        simulateDataUpdate();
        console.log('MANUAL_REFRESH_TRIGGERED');
    }
});

// Start the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
// scripts.js
// BRUTALIST WEATHER DASHBOARD - ANTI-DESIGN FUNCTIONALITY
// RAW DATA HANDLING WITH INTENTIONAL IMPERFECTIONS

// === CONFIGURATION - EXPOSED API DETAILS ===
const CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE', // Intentionally exposed
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_CITY: 'Berlin',
    UPDATE_INTERVAL: 300000, // 5 minutes - exposed as raw number
    UNITS: 'metric'
};

// === STATE MANAGEMENT - BRUTALIST APPROACH ===
let appState = {
    currentCity: CONFIG.DEFAULT_CITY,
    units: CONFIG.UNITS,
    lastUpdate: null,
    alerts: [],
    isBlinking: false,
    dataLoadAttempts: 0
};

// === DOM ELEMENTS - GLOBAL ACCESS ===
// Temperature elements
const tempValue = document.getElementById('current-temp');
const tempUnit = document.querySelector('.temp-unit');
const tempLocation = document.getElementById('current-location');

// Control elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const geolocateBtn = document.getElementById('geolocate-btn');
const unitOptions = document.querySelectorAll('.unit-option');
const refreshBtn = document.getElementById('refresh-btn');

// Condition elements
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uv-index');

// Wind elements
const windSpeed = document.getElementById('wind-speed');
const windGust = document.getElementById('wind-gust');
const windDegrees = document.getElementById('wind-degrees');
const windArrow = document.getElementById('wind-arrow');

// Forecast elements
const forecastTable = document.getElementById('hourly-forecast').querySelector('tbody');

// Alert elements
const alertPanel = document.getElementById('alert-panel');
const alertCount = document.getElementById('alert-count');
const alertContent = document.getElementById('alert-content');
const blinkStatus = document.getElementById('blink-status');

// Footer elements
const lastUpdate = document.getElementById('last-update');
const viewportSize = document.getElementById('viewport-size');

// === UTILITY FUNCTIONS - RAW AND EXPOSED ===
function brutalLog(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${type}] ${message}`);
    
    // Also update debug overlay
    if (type === 'ERROR') {
        document.querySelector('.debug-highlight').textContent = 'ERROR DETECTED';
        document.querySelector('.debug-highlight').style.color = 'var(--brutal-red)';
    }
}

function updateViewportSize() {
    viewportSize.textContent = `${window.innerWidth}×${window.innerHeight}`;
}

function formatTime(timestamp) {
    // Raw formatting with military time
    const date = new Date(timestamp * 1000);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
}

function capitalizeBrutal(str) {
    // Intentionally imperfect capitalization
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getWindDirection(degrees) {
    // Raw wind direction calculation
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// === DATA FETCHING - WITH INTENTIONAL RAW ERROR HANDLING ===
async function fetchWeatherData(city) {
    brutalLog(`Fetching weather for: ${city}`, 'FETCH');
    appState.dataLoadAttempts++;
    
    try {
        const response = await fetch(
            `${CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${appState.units}&appid=${CONFIG.API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        brutalLog(`Data received for ${data.name}`, 'SUCCESS');
        return data;
    } catch (error) {
        brutalLog(`Failed to fetch: ${error.message}`, 'ERROR');
        // Fallback to mock data if API fails
        return generateMockData(city);
    }
}

async function fetchHourlyForecast(city) {
    try {
        const response = await fetch(
            `${CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${appState.units}&appid=${CONFIG.API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`Forecast API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.list.slice(0, 8); // First 8 periods (24 hours)
    } catch (error) {
        brutalLog(`Forecast failed: ${error.message}`, 'ERROR');
        return generateMockForecast();
    }
}

function generateMockData(city) {
    // Raw mock data for when API fails
    brutalLog(`Using mock data for ${city}`, 'WARNING');
    
    return {
        name: city,
        main: {
            temp: Math.floor(Math.random() * 30) - 5,
            feels_like: Math.floor(Math.random() * 30) - 5,
            humidity: Math.floor(Math.random() * 100),
            pressure: Math.floor(Math.random() * 50) + 980
        },
        wind: {
            speed: Math.floor(Math.random() * 50),
            gust: Math.floor(Math.random() * 70),
            deg: Math.floor(Math.random() * 360)
        },
        visibility: Math.floor(Math.random() * 10000),
        weather: [{
            main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
            description: ['clear sky', 'few clouds', 'light rain', 'heavy snow'][Math.floor(Math.random() * 4)]
        }],
        dt: Math.floor(Date.now() / 1000)
    };
}

function generateMockForecast() {
    const forecast = [];
    const now = Math.floor(Date.now() / 1000);
    
    for (let i = 0; i < 8; i++) {
        forecast.push({
            dt: now + (i * 3 * 3600), // Every 3 hours
            main: {
                temp: Math.floor(Math.random() * 30) - 5
            },
            weather: [{
                main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)]
            }],
            pop: Math.random().toFixed(2), // Precipitation probability
            wind: {
                speed: Math.floor(Math.random() * 30)
            }
        });
    }
    
    return forecast;
}

// === DATA RENDERING - ANTI-DESIMPLE APPROACH ===
function renderCurrentWeather(data) {
    // Update temperature monster
    tempValue.textContent = Math.round(data.main.temp);
    tempLocation.textContent = data.name.toUpperCase();
    
    // Update conditions
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Mock UV index (OpenWeather doesn't provide this in free tier)
    uvIndex.textContent = Math.floor(Math.random() * 11);
    
    // Update wind
    windSpeed.textContent = `${Math.round(data.wind.speed)} ${appState.units === 'metric' ? 'km/h' : 'mph'}`;
    windGust.textContent = data.wind.gust ? 
        `${Math.round(data.wind.gust)} ${appState.units === 'metric' ? 'km/h' : 'mph'}` : 
        'N/A';
    
    // Update wind direction arrow
    const degrees = data.wind.deg;
    windDegrees.textContent = `${degrees}° ${getWindDirection(degrees)}`;
    windArrow.style.transform = `rotate(${degrees}deg) translateX(0)`;
    
    // Update last update time
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString();
    appState.lastUpdate = now;
    
    // Randomly generate alerts (for demonstration)
    generateRandomAlerts(data);
}

function renderHourlyForecast(forecastData) {
    // Clear existing rows (keep the loading message if present)
    forecastTable.innerHTML = '';
    
    forecastData.forEach((period, index) => {
        const row = document.createElement('tr');
        
        // Add alternating background for brutalist effect
        if (index % 3 === 0) {
            row.style.backgroundColor = '#1a1a1a';
        }
        
        // Time cell
        const timeCell = document.createElement('td');
        timeCell.textContent = formatTime(period.dt);
        
        // Temperature cell
        const tempCell = document.createElement('td');
        tempCell.textContent = `${Math.round(period.main.temp)}°`;
        tempCell.style.fontWeight = 'bold';
        tempCell.style.color = period.main.temp > 20 ? 'var(--brutal-red)' : 'var(--brutal-blue)';
        
        // Condition cell
        const conditionCell = document.createElement('td');
        conditionCell.textContent = period.weather[0].main;
        
        // Precipitation cell
        const precipCell = document.createElement('td');
        const pop = period.pop * 100;
        precipCell.textContent = `${pop.toFixed(0)}%`;
        precipCell.style.color = pop > 50 ? 'var(--brutal-blue)' : 'var(--brutal-concrete-light)';
        
        // Wind cell
        const windCell = document.createElement('td');
        windCell.textContent = `${Math.round(period.wind.speed)} ${appState.units === 'metric' ? 'km/h' : 'mph'}`;
        
        // Append cells
        row.appendChild(timeCell);
        row.appendChild(tempCell);
        row.appendChild(conditionCell);
        row.appendChild(precipCell);
        row.appendChild(windCell);
        
        // Add to table
        forecastTable.appendChild(row);
    });
}

function generateRandomAlerts(weatherData) {
    // Generate random alerts for demonstration
    appState.alerts = [];
    
    // Always have at least 1 alert for effect
    const alertTypes = [
        {
            type: 'WIND',
            condition: weatherData.wind.speed > 40,
            message: 'HIGH WIND WARNING: Gusts exceeding safety thresholds'
        },
        {
            type: 'TEMPERATURE',
            condition: weatherData.main.temp > 35 || weatherData.main.temp < -10,
            message: `EXTREME TEMPERATURE: ${Math.round(weatherData.main.temp)}°${appState.units === 'metric' ? 'C' : 'F'}`
        },
        {
            type: 'VISIBILITY',
            condition: weatherData.visibility < 2000,
            message: 'LOW VISIBILITY: Exercise caution when traveling'
        },
        {
            type: 'PRESSURE',
            condition: Math.random() > 0.7, // Random chance
            message: 'RAPID BAROMETRIC CHANGE: Storm system approaching'
        }
    ];
    
    alertTypes.forEach(alert => {
        if (alert.condition) {
            appState.alerts.push({
                type: alert.type,
                message: alert.message,
                severity: Math.random() > 0.5 ? 'SEVERE' : 'MODERATE',
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });
    
    // If no alerts, add a system alert
    if (appState.alerts.length === 0 && Math.random() > 0.5) {
        appState.alerts.push({
            type: 'SYSTEM',
            message: 'ALL SYSTEMS NOMINAL. NO WEATHER HAZARDS DETECTED.',
            severity: 'INFO',
            timestamp: new Date().toLocaleTimeString()
        });
    }
    
    renderAlerts();
}

function renderAlerts() {
    alertCount.textContent = `${appState.alerts.length} ACTIVE`;
    
    // Clear previous alerts
    alertContent.innerHTML = '';
    
    if (appState.alerts.length === 0) {
        alertContent.innerHTML = '<div class="no-alerts">NO ACTIVE ALERTS</div>';
        alertPanel.style.backgroundColor = 'var(--brutal-concrete)';
        return;
    }
    
    // Sort by severity
    const severityOrder = { SEVERE: 0, MODERATE: 1, INFO: 2 };
    appState.alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    // Create alert elements
    appState.alerts.forEach((alert, index) => {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert-item';
        alertElement.style.marginBottom = '10px';
        alertElement.style.padding = '10px';
        alertElement.style.borderLeft = '5px solid';
        alertElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        
        // Color code by severity
        if (alert.severity === 'SEVERE') {
            alertElement.style.borderLeftColor = 'var(--brutal-red)';
            alertElement.style.color = 'var(--brutal-red)';
        } else if (alert.severity === 'MODERATE') {
            alertElement.style.borderLeftColor = 'var(--brutal-yellow)';
            alertElement.style.color = 'var(--brutal-yellow)';
        } else {
            alertElement.style.borderLeftColor = 'var(--brutal-blue)';
            alertElement.style.color = 'var(--brutal-blue)';
        }
        
        // Alert content
        alertElement.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <strong>${alert.type} ALERT</strong>
                <span style="font-family: var(--font-terminal);">${alert.timestamp}</span>
            </div>
            <div>${alert.message}</div>
            <div style="font-size: 0.8rem; margin-top: 5px; opacity: 0.8;">
                Severity: ${alert.severity} | ID: ${index.toString(16).toUpperCase()}
            </div>
        `;
        
        alertContent.appendChild(alertElement);
    });
    
    // Update alert panel color based on highest severity
    const highestSeverity = appState.alerts[0].severity;
    if (highestSeverity === 'SEVERE') {
        alertPanel.style.backgroundColor = 'var(--alert-bg)';
        alertPanel.style.color = 'var(--alert-text)';
        alertPanel.style.borderColor = 'var(--alert-border)';
        
        // Auto-enable blinking for severe alerts
        if (!appState.isBlinking) {
            toggleBlinkMode();
        }
    } else {
        alertPanel.style.backgroundColor = 'var(--brutal-concrete-dark)';
        alertPanel.style.color = 'var(--brutal-yellow)';
        alertPanel.style.borderColor = 'var(--brutal-yellow)';
    }
}

// === INTERACTIONS - AGGRESSIVE USER EXPERIENCE ===
function toggleBlinkMode() {
    appState.isBlinking = !appState.isBlinking;
    
    if (appState.isBlinking) {
        alertPanel.classList.add('blink-active');
        blinkStatus.textContent = 'ON';
        blinkStatus.style.color = 'var(--brutal-red)';
        
        // Also blink the temperature for maximum effect
        tempValue.style.animation = 'brutal-blink 0.8s infinite';
        brutalLog('BLINK MODE ACTIVATED - EPILEPSY WARNING', 'WARNING');
    } else {
        alertPanel.classList.remove('blink-active');
        tempValue.style.animation = '';
        blinkStatus.textContent = 'OFF';
        blinkStatus.style.color = 'var(--brutal-concrete-light)';
    }
}

function updateUnits(unitSystem) {
    appState.units = unitSystem;
    
    // Update unit toggle buttons
    unitOptions.forEach(option => {
        if (option.dataset.unit === unitSystem) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update temperature unit display
    tempUnit.textContent = unitSystem === 'metric' ? '°C' : '°F';
    
    // Reload data with new units
    loadWeatherData(appState.currentCity);
}

async function loadWeatherData(city) {
    brutalLog(`Loading weather data for ${city}`, 'SYSTEM');
    
    // Show loading state
    tempValue.textContent = '---';
    tempLocation.textContent = 'LOADING...';
    
    // Fetch data
    const currentData = await fetchWeatherData(city);
    const forecastData = await fetchHourlyForecast(city);
    
    // Update state
    appState.currentCity = currentData.name;
    locationInput.value = currentData.name;
    
    // Render data
    renderCurrentWeather(currentData);
    renderHourlyForecast(forecastData);
    
    brutalLog(`Data load complete for ${currentData.name}`, 'SUCCESS');
    
    // Update debug info
    document.querySelector('.debug-highlight').textContent = 
        `${appState.dataLoadAttempts} ATTEMPTS`;
}

async function getUserLocation() {
    if (!navigator.geolocation) {
        brutalLog('Geolocation not supported', 'ERROR');
        alertContent.innerHTML = '<div style="color: var(--brutal-red);">GEOLOCATION FAILED: API NOT SUPPORTED</div>';
        return;
    }
    
    brutalLog('Attempting geolocation...', 'SYSTEM');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            brutalLog(`Location acquired: ${latitude}, ${longitude}`, 'SUCCESS');
            
            try {
                // Reverse geocode to get city name
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${CONFIG.API_KEY}`
                );
                
                if (response.ok) {
                    const locationData = await response.json();
                    if (locationData.length > 0) {
                        const city = locationData[0].name;
                        loadWeatherData(city);
                    }
                }
            } catch (error) {
                brutalLog(`Reverse geocode failed: ${error.message}`, 'ERROR');
                // Fallback to coordinates
                loadWeatherData(`${latitude.toFixed(2)},${longitude.toFixed(2)}`);
            }
        },
        (error) => {
            brutalLog(`Geolocation error: ${error.message}`, 'ERROR');
            alertContent.innerHTML = `<div style="color: var(--brutal-red);">GEOLOCATION DENIED: ${error.message}</div>`;
        }
    );
}

// === INITIALIZATION - BRUTAL STARTUP ===
function initializeApp() {
    brutalLog('BRUTAL WEATHER DASHBOARD INITIALIZING', 'SYSTEM');
    
    // Update viewport size
    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    
    // Set up event listeners
    searchBtn.addEventListener('click', () => {
        const city = locationInput.value.trim();
        if (city) {
            loadWeatherData(city);
        } else {
            // Show error in input
            locationInput.style.borderColor = 'var(--brutal-red)';
            locationInput.style.backgroundColor = '#330000';
            setTimeout(() => {
                locationInput.style.borderColor = 'var(--brutal-concrete)';
                locationInput.style.backgroundColor = 'black';
            }, 1000);
        }
    });
    
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    geolocateBtn.addEventListener('click', getUserLocation);
    
    unitOptions.forEach(option => {
        option.addEventListener('click', () => {
            updateUnits(option.dataset.unit);
        });
    });
    
    refreshBtn.addEventListener('click', () => {
        brutalLog('MANUAL REFRESH TRIGGERED', 'SYSTEM');
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> REFRESHING';
        loadWeatherData(appState.currentCity).then(() => {
            refreshBtn.innerHTML = '<i class="fas fa-redo"></i> FORCE REFRESH';
        });
    });
    
    // Alert panel click toggles blink mode
    alertPanel.addEventListener('click', toggleBlinkMode);
    
    // Add random console messages for brutalist effect
    setInterval(() => {
        const messages = [
            'SYSTEM: All sensors operational',
            'DATA: Feed integrity verified',
            'UI: Anti-design metrics optimal',
            'NETWORK: Connection nominal',
            'ALERT: No critical issues detected'
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        brutalLog(randomMsg, 'SYSTEM');
    }, 15000);
    
    // Auto-refresh data
    setInterval(() => {
        brutalLog('Auto-refresh triggered', 'SYSTEM');
        loadWeatherData(appState.currentCity);
    }, CONFIG.UPDATE_INTERVAL);
    
    // Initial data load
    loadWeatherData(CONFIG.DEFAULT_CITY);
    
    brutalLog('INITIALIZATION COMPLETE - BRUTAL MODE ACTIVE', 'SUCCESS');
}

// === START THE BRUTALITY ===
document.addEventListener('DOMContentLoaded', initializeApp);

// Expose some functions globally for debugging (anti-pattern, intentionally)
window.brutalWeather = {
    reload: () => loadWeatherData(appState.currentCity),
    toggleBlink: toggleBlinkMode,
    generateAlerts: () => generateRandomAlerts({}),
    state: () => appState
};

brutalLog('Script loaded - ready for brutal weather reporting', 'SYSTEM');
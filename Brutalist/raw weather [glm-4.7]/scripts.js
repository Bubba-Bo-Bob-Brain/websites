document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM ELEMENTS ---
    const clockEl = document.getElementById('clock');
    const locationEl = document.getElementById('location');
    const coordsEl = document.getElementById('coordinates');
    const mainTempEl = document.getElementById('main-temp');
    const conditionEl = document.getElementById('condition-text');
    const alertStatusEl = document.getElementById('alert-status');
    const bodyEl = document.body;
    
    // Wind
    const windArrow = document.getElementById('wind-arrow');
    const windSpeedEl = document.getElementById('wind-speed');
    const windDirTextEl = document.getElementById('wind-dir-text');
    
    // Details
    const humidityVal = document.getElementById('humidity-val');
    const humidityBar = document.getElementById('humidity-bar');
    const pressureVal = document.getElementById('pressure-val');
    const visibilityVal = document.getElementById('visibility-val');
    const uvVal = document.getElementById('uv-val');
    
    // Forecast
    const forecastBody = document.getElementById('forecast-body');
    
    // Console
    const consoleOutput = document.getElementById('console-output');

    // --- STATE & DATA ---
    let weatherState = {
        temp: 0,
        condition: 'CLEAR',
        humidity: 0,
        pressure: 1013,
        windSpeed: 0,
        windDir: 0, // Degrees
        uv: 0,
        visibility: 0
    };

    const CONDITIONS = ['CLEAR', 'OVERCAST', 'RAIN', 'DRIZZLE', 'THUNDERSTORM', 'FOG', 'HAZE'];
    
    // --- UTILITIES ---
    function log(msg, type = 'INFO') {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const timestamp = new Date().toLocaleTimeString('en-US', {hour12: false});
        entry.innerHTML = `<span style="opacity:0.5">[${timestamp}]</span> [${type}] ${msg}`;
        consoleOutput.appendChild(entry);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCardinalDirection(angle) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(angle / 45) % 8];
    }

    // --- CORE FUNCTIONS ---

    function updateClock() {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('en-GB'); // 24h format
    }

    function simulateGPS() {
        log('TRIANGULATING POSITION...');
        setTimeout(() => {
            const lat = (Math.random() * 180 - 90).toFixed(4);
            const lon = (Math.random() * 360 - 180).toFixed(4);
            locationEl.innerText = "SECTOR_7 // OUTER_RIM";
            coordsEl.innerText = `${lat} / ${lon}`;
            log(`POSITION LOCKED: ${lat}, ${lon}`, 'SUCCESS');
        }, 1500);
    }

    function generateWeatherData() {
        // Simulate a "living" environment
        weatherState.temp = getRandomInt(-5, 35);
        weatherState.humidity = getRandomInt(30, 95);
        weatherState.pressure = getRandomInt(980, 1030);
        weatherState.windSpeed = getRandomInt(0, 60);
        weatherState.windDir = getRandomInt(0, 360);
        weatherState.uv = getRandomInt(0, 11);
        weatherState.visibility = (Math.random() * 10 + 1).toFixed(1);
        weatherState.condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    }

    function updateUI() {
        // Update Main Temp with animation effect
        mainTempEl.style.opacity = 0;
        setTimeout(() => {
            mainTempEl.innerText = weatherState.temp;
            conditionEl.innerText = weatherState.condition;
            mainTempEl.style.opacity = 1;
        }, 200);

        // Update Details
        humidityVal.innerText = `${weatherState.humidity}%`;
        humidityBar.style.width = `${weatherState.humidity}%`;
        pressureVal.innerText = `${weatherState.pressure} hPa`;
        visibilityVal.innerText = `${weatherState.visibility} km`;
        uvVal.innerText = weatherState.uv;

        // Update Wind
        windSpeedEl.innerText = weatherState.windSpeed;
        windDirTextEl.innerText = getCardinalDirection(weatherState.windDir);
        windArrow.style.transform = `rotate(${weatherState.windDir}deg)`;

        // Check for Alert State (e.g. High Wind or Storm)
        if (weatherState.windSpeed > 50 || weatherState.condition === 'THUNDERSTORM') {
            triggerAlert();
        } else {
            clearAlert();
        }
    }

    function triggerAlert() {
        if (!bodyEl.classList.contains('alert-active')) {
            bodyEl.classList.add('alert-active');
            alertStatusEl.innerText = "CRITICAL";
            log(`ALERT: HIGH VELOCITY WIND DETECTED [${weatherState.windSpeed} KM/H]`, 'WARN');
        }
    }

    function clearAlert() {
        if (bodyEl.classList.contains('alert-active')) {
            bodyEl.classList.remove('alert-active');
            alertStatusEl.innerText = "NORMAL";
            log('SYSTEM NORMALIZED', 'SUCCESS');
        }
    }

    function renderForecastTable() {
        forecastBody.innerHTML = ''; // Clear existing
        let currentHour = new Date().getHours();

        for (let i = 0; i < 24; i++) {
            const row = document.createElement('tr');
            
            // Time
            let hour = (currentHour + i) % 24;
            let timeStr = hour.toString().padStart(2, '0') + ":00";
            
            // Data variation
            let fTemp = weatherState.temp + getRandomInt(-3, 3);
            let fRain = getRandomInt(0, 100);
            let fWind = weatherState.windSpeed + getRandomInt(-10, 10);
            let icon = fRain > 50 ? "RAIN" : (hour > 6 && hour < 18 ? "SUN" : "MOON");

            // Constructing raw HTML cells intentionally simple
            row.innerHTML = `
                <td>${timeStr}</td>
                <td style="color: var(--accent-cyan)">${icon}</td>
                <td style="font-weight:bold">${fTemp}°</td>
                <td>${fTemp - 2}°</td>
                <td style="color: ${fRain > 70 ? 'var(--accent-red)' : 'inherit'}">${fRain}%</td>
                <td>${fWind}</td>
            `;
            forecastBody.appendChild(row);
        }
        log('HOURLY_PROJECTION GENERATED', 'DATA');
    }

    function periodicDataShift() {
        // Subtle shifts to make it feel alive without full regeneration
        let shift = getRandomInt(-1, 1);
        let newTemp = parseInt(mainTempEl.innerText) + shift;
        mainTempEl.innerText = newTemp;

        let newPress = parseInt(pressureVal.innerText) + getRandomInt(-1, 1);
        pressureVal.innerText = `${newPress} hPa`;

        if (Math.random() > 0.8) {
            log('MICRO-CLIMATE SHIFT DETECTED', 'INFO');
        }
    }

    // --- INITIALIZATION SEQUENCE ---
    log('INITIALIZING ATMOS_RAW PROTOCOLS...', 'SYS');
    log('LOADING MODULES: [THERMAL] [BAROMETRIC] [ANEMOMETRIC]', 'SYS');
    
    setTimeout(() => {
        updateClock();
        simulateGPS();
        generateWeatherData();
        updateUI();
        renderForecastTable();
        
        // Start loops
        setInterval(updateClock, 1000);
        setInterval(periodicDataShift, 3000); // Subtle changes every 3s
        
        // Full refresh every 60 seconds to simulate new data packet
        setInterval(() => {
            log('FETCHING NEW SATELLITE PACKET...', 'NET');
            generateWeatherData();
            updateUI();
            renderForecastTable();
        }, 60000);

    }, 1000);

});
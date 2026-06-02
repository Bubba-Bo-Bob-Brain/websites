/**
 * ATMOS-BRUT // METEOROLOGICAL ENGINE
 * Focus: Raw data injection, glitch updates, and mechanical movement.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        city: "LONDON, UK",
        temp: 24,
        condition: "PARTLY_CLOUDY",
        humidity: 64,
        pressure: 1012,
        windSpeed: 12,
        windDeg: 45,
        feelsLike: 22
    };

    // --- DOM ELEMENTS ---
    const elements = {
        bgTemp: document.getElementById('bg-temp'),
        currentTime: document.getElementById('current-time'),
        cityInput: document.getElementById('city-input'),
        fetchBtn: document.getElementById('fetch-btn'),
        cityCoords: document.getElementById('city-coords'),
        weatherDesc: document.getElementById('weather-desc'),
        feelsLike: document.getElementById('feels-like'),
        humidityVal: document.getElementById('humidity-val'),
        pressureVal: document.getElementById('pressure-val'),
        windArrow: document.getElementById('wind-arrow'),
        windSpeed: document.getElementById('wind-speed'),
        forecastBody: document.getElementById('forecast-body')
    };

    // --- CORE FUNCTIONS ---

    // Update the digital clock with raw precision
    function updateClock() {
        const now = new Date();
        elements.currentTime.innerText = now.toTimeString().split(' ')[0];
    }

    // Simulate a "glitch" effect when updating text
    function glitchUpdate(element, newValue) {
        const originalValue = element.innerText;
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.innerText = Math.random().toString(36).substring(7).toUpperCase();
            iterations++;
            if (iterations > 5) {
                clearInterval(interval);
                element.innerText = newValue;
            }
        }, 40);
    }

    // Update the UI based on current state
    function renderUI() {
        glitchUpdate(elements.bgTemp, `${state.temp}°`);
        glitchUpdate(elements.weatherDesc, state.condition);
        glitchUpdate(elements.feelsLike, `FEELS_LIKE: ${state.feelsLike}°C`);
        glitchUpdate(elements.humidityVal, `${state.humidity}%`);
        glitchUpdate(elements.pressureVal, `${state.pressure} hPa`);
        glitchUpdate(elements.windSpeed, `${state.windSpeed} km/h`);
        
        // Rotate wind arrow (pure CSS rotation)
        elements.windArrow.style.transform = `rotate(${state.windDeg}deg)`;
    }

    // Generate the "Merciless" Forecast Table
    function generateForecast() {
        elements.forecastBody.innerHTML = '';
        const conditions = ['CLEAR', 'STORM', 'CLOUDY', 'FOG', 'RAIN'];
        
        for (let i = 0; i < 8; i++) {
            const hour = (new Date().getHours() + i) % 24;
            const temp = state.temp + Math.floor(Math.random() * 5) - 2;
            const precip = Math.floor(Math.random() * 100);
            const cond = conditions[Math.floor(Math.random() * conditions.length)];
            
            const row = `
                <tr>
                    <td>${hour.toString().padStart(2, '0')}:00</td>
                    <td>${temp}°</td>
                    <td>${precip}%</td>
                    <td>${cond}</td>
                </tr>
            `;
            elements.forecastBody.innerHTML += row;
        }
    }

    // Simulate fetching new city data
    async function fetchWeatherData() {
        const city = elements.cityInput.value || "UNKNOWN_LOC";
        elements.fetchBtn.innerText = "PROCESSING...";
        elements.fetchBtn.disabled = true;

        // Artificial delay to simulate raw data retrieval from a mainframe
        await new Promise(resolve => setTimeout(resolve, 800));

        // Randomize data for simulation
        state.city = city.toUpperCase();
        state.temp = Math.floor(Math.random() * 35);
        state.feelsLike = state.temp + Math.floor(Math.random() * 4) - 2;
        state.condition = ["CLEAR", "STORM", "HEAVY_RAIN", "FOG", "PARTLY_CLOUDY"][Math.floor(Math.random() * 5)];
        state.humidity = Math.floor(Math.random() * 100);
        state.pressure = 980 + Math.floor(Math.random() * 50);
        state.windSpeed = Math.floor(Math.random() * 120);
        state.windDeg = Math.floor(Math.random() * 360);

        // Update coords randomly
        const lat = (Math.random() * 180 - 90).toFixed(4);
        const lon = (Math.random() * 360 - 180).toFixed(4);
        elements.cityCoords.innerText = `LAT: ${lat} | LON: ${lon}`;

        renderUI();
        generateForecast();

        elements.fetchBtn.innerText = "EXECUTE";
        elements.fetchBtn.disabled = false;
    }

    // --- INITIALIZATION ---

    // Clock loop
    setInterval(updateClock, 1000);
    updateClock();

    // Event Listeners
    elements.fetchBtn.addEventListener('click', fetchWeatherData);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchWeatherData();
    });

    // Initial boot sequence
    setTimeout(() => {
        renderUI();
        generateForecast();
    }, 500);
});
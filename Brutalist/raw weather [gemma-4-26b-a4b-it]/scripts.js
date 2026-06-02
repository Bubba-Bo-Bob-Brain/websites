/**
 * METEO_CORE // SYSTEM ENGINE
 * VERSION: 1.0.4-STABLE (UNSTABLE)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const elements = {
        clock: document.getElementById('live-clock'),
        temp: document.getElementById('current-temp'),
        forecastBody: document.getElementById('forecast-body'),
        eventLog: document.getElementById('event-log'),
        windCompass: document.querySelector('.wind-compass'),
        windSpeed: document.getElementById('wind-speed'),
        alertPanel: document.querySelector('.alert-active'),
        body: document.body
    };

    // --- CONFIGURATION ---
    const CONFIG = {
        UPDATE_INTERVAL: 3000,    // 3 seconds for metrics
        LOG_INTERVAL: 12000,      // 12 seconds for system logs
        ALERT_CHANCE: 0.05,       // 5% chance per cycle to trigger alert
        DATA_VOLATILITY: 0.5      // How much data fluctuates
    };

    // --- STATE ---
    let state = {
        temp: 24.0,
        humidity: 64,
        pressure: 1012,
        windSpeed: 12,
        windDir: 0,
        isAlerting: false
    };

    // --- UTILITIES ---
    const formatTime = (date) => {
        return date.toTimeString().split(' ')[0];
    };

    const logEvent = (message) => {
        const time = formatTime(new Date());
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${time}] ${message}`;
        elements.eventLog.prepend(entry);

        // Keep log from growing infinitely
        if (elements.eventLog.children.length > 20) {
            elements.eventLog.removeChild(elements.eventLog.lastChild);
        }
    };

    // --- CORE LOGIC ---

    const updateClock = () => {
        elements.clock.textContent = formatTime(new Date());
    };

    const simulateData = () => {
        // Add slight randomness to simulate real sensor fluctuations
        state.temp += (Math.random() - 0.5) * CONFIG.DATA_VOLATILITY;
        state.humidity += Math.floor((Math.random() - 0.5) * 2);
        state.pressure += Math.floor((Math.random() - 0.5) * 1);
        state.windSpeed = Math.max(0, state.windSpeed + (Math.random() - 0.5) * 2);
        state.windDir = (state.windDir + Math.floor(Math.random() * 45 - 22)) % 360;

        // Update DOM
        elements.temp.textContent = `${state.temp.toFixed(1)}°C`;
        elements.windSpeed.textContent = `${state.windSpeed.toFixed(0)} KM/H`;
        
        // Update Wind Compass (CSS Rotation)
        elements.windCompass.style.transform = `rotate(${state.windDir}deg)`;

        // Check for Random Alert Trigger
        if (!state.isAlerting && Math.random() < CONFIG.ALERT_CHANCE) {
            triggerAlert();
        }
    };

    const populateForecast = () => {
        const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
        elements.forecastBody.innerHTML = ''; // Clear existing

        hours.forEach(hour => {
            const row = document.createElement('tr');
            const t = (state.temp + (Math.random() * 4 - 2)).toFixed(0);
            const p = (Math.random() * 10).toFixed(1);
            const w = (Math.random() * 20).toFixed(0);
            const status = Math.random() > 0.8 ? 'WARN' : 'NOMINAL';

            row.innerHTML = `
                <td>${hour}</td>
                <td>${t}°C</td>
                <td>${p}mm</td>
                <td>${w}km/h</td>
                <td style="color: ${status === 'WARN' ? 'var(--danger-color)' : 'var(--accent-color)'}">${status}</td>
            `;
            elements.forecastBody.appendChild(row);
        });
    };

    const triggerAlert = () => {
        state.isAlerting = true;
        logEvent("!!! SEVERE_WEATHER_WARNING_DETECTED !!!");
        
        // Visual feedback
        elements.alertPanel.classList.add('alert-active');
        elements.alertPanel.querySelector('.value').textContent = "EXTREME";
        elements.body.style.backgroundColor = "#300"; // Dark red tint

        // Duration of alert
        setTimeout(() => {
            state.isAlerting = false;
            elements.alertPanel.classList.remove('alert-active');
            elements.alertPanel.querySelector('.value').textContent = "NONE";
            elements.body.style.backgroundColor = "var(--bg-color)";
            logEvent("SYSTEM_STATUS: RECOVERED");
        }, 5000);
    };

    // --- INITIALIZATION ---

    const init = () => {
        logEvent("CORE_BOOT_SEQUENCE_INITIATED");
        logEvent("LOADING_METEO_MODULES...");
        
        // Populate initial data
        updateClock();
        simulateData();
        populateForecast();

        // Set Intervals
        setInterval(updateClock, 1000);
        setInterval(simulateData, CONFIG.UPDATE_INTERVAL);
        setInterval(() => {
            const msgs = [
                "DATA_STREAM_STABLE",
                "SENSOR_CALIBRATION_OK",
                "BUFFER_CLEARED",
                "NET_LATENCY_LOW",
                "WIND_VECTOR_SYNCED"
            ];
            logEvent(msgs[Math.floor(Math.random() * msgs.length)]);
        }, CONFIG.LOG_INTERVAL);

        logEvent("SYSTEM_READY");
    };

    init();
});
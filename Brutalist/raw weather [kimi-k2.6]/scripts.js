// ============================================================
// WX-STATION CONTROL SYSTEM
// NO FRAMEWORKS. VANILLA BRUTALITY.
// ============================================================

(function() {
    'use strict';

    // ---- STATE ----
    const state = {
        temp: -3.2,
        tempTrend: -2.3,
        windSpeed: 28,
        windGust: 41,
        windDir: 337.5, // degrees
        pressure: 982.4,
        pressureTrend: 'falling',
        precipAccum: 12.7,
        precipRate: 2.3,
        lastUpdate: Date.now(),
        forecastData: [],
        extendedData: []
    };

    // ---- DOM REFERENCES ----
    const els = {
        time: document.getElementById('current-time'),
        temp: document.getElementById('main-temp'),
        tempTrend: document.getElementById('temp-trend'),
        windArrow: document.getElementById('wind-arrow'),
        windSpeed: document.getElementById('wind-speed'),
        windDir: document.getElementById('wind-dir'),
        pressure: document.getElementById('pressure'),
        pressureTrend: document.getElementById('pressure-trend'),
        precipTotal: document.getElementById('precip-total'),
        precipFill: document.getElementById('precip-fill'),
        forecastBody: document.getElementById('forecast-body'),
        extendedGrid: document.getElementById('extended-grid'),
        memoryDump: document.getElementById('memory-dump'),
        alertPanel: document.getElementById('alert-panel')
    };

    // ---- UTILITIES ----
    function pad2(n) {
        return n.toString().padStart(2, '0');
    }

    function formatTime(date) {
        return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
    }

    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    function jitter(value, amount) {
        return value + randomRange(-amount, amount);
    }

    function degToCompass(deg) {
        const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return dirs[Math.round(deg / 22.5) % 16];
    }

    function generateHex(length) {
        return Array.from({length}, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
    }

    // ---- FORECAST GENERATION ----
    function generateForecast() {
        const conditions = ['SNOW', 'HEAVY SNOW', 'BLOWING SNOW', 'SNOW', 'CLOUDY', 'OVERCAST', 'SNOW', 'DRIZZLE'];
        const now = new Date();
        const hours = [];
        
        for (let i = 0; i < 24; i++) {
            const hour = (now.getHours() + i) % 24;
            const temp = Math.round(jitter(state.temp + (i < 6 ? -2 : i > 18 ? -4 : 1), 1.5));
            const cond = conditions[Math.floor(Math.random() * conditions.length)];
            const wind = Math.round(jitter(state.windSpeed + (i < 12 ? 5 : -3), 8));
            const pcp = i < 16 ? (Math.random() > 0.3 ? (Math.random() * 3).toFixed(1) : '0.0') : '0.0';
            const baro = (state.pressure + Math.sin(i / 6) * 3 + randomRange(-1, 1)).toFixed(1);
            
            hours.push({
                hour: pad2(hour) + ':00',
                temp: temp,
                cond: cond,
                wind: wind,
                pcp: pcp,
                baro: baro
            });
        }
        
        return hours;
    }

    function generateExtended() {
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const conditions = ['SNOW', 'CLOUDY', 'SNOW', 'OVERCAST', 'SNOW', 'PARTLY', 'SNOW'];
        const today = new Date().getDay();
        const result = [];
        
        for (let i = 0; i < 7; i++) {
            const dayIdx = (today + i) % 7;
            const high = Math.round(jitter(state.temp + 2 - i * 0.5, 2));
            const low = high - Math.round(randomRange(6, 12));
            
            result.push({
                name: i === 0 ? 'TODAY' : days[dayIdx],
                high: high,
                low: low,
                cond: conditions[i]
            });
        }
        
        return result;
    }

    // ---- RENDER FUNCTIONS ----
    function renderTime() {
        els.time.textContent = formatTime(new Date());
    }

    function renderTemp() {
        const display = Math.round(state.temp);
        els.temp.textContent = (display > 0 ? '+' : '') + display;
        
        const trendSymbol = state.tempTrend > 0 ? '▲' : '▼';
        const trendAbs = Math.abs(state.tempTrend).toFixed(1);
        els.tempTrend.textContent = `${trendSymbol} ${trendAbs}°/HR`;
    }

    function renderWind() {
        els.windArrow.style.transform = `rotate(${state.windDir}deg)`;
        els.windSpeed.textContent = Math.round(state.windSpeed);
        els.windDir.textContent = degToCompass(state.windDir);
    }

    function renderPressure() {
        els.pressure.textContent = state.pressure.toFixed(1);
    }

    function renderPrecip() {
        els.precipTotal.textContent = state.precipAccum.toFixed(1);
        const fillPercent = Math.min((state.precipAccum / 25) * 100, 100);
        els.precipFill.style.width = fillPercent + '%';
    }

    function renderForecast() {
        els.forecastBody.innerHTML = state.forecastData.map(row => `
            <tr>
                <td>${row.hour}</td>
                <td>${row.temp > 0 ? '+' : ''}${row.temp}°</td>
                <td>${row.cond}</td>
                <td>${row.wind} <span style="color:#666;font-size:0.75em;">KM/H</span></td>
                <td>${row.pcp}</td>
                <td>${row.baro}</td>
            </tr>
        `).join('');
    }

    function renderExtended() {
        els.extendedGrid.innerHTML = state.extendedData.map(day => `
            <div class="extended-day">
                <div class="extended-day-name">${day.name}</div>
                <div class="extended-day-temp-high">${day.high > 0 ? '+' : ''}${day.high}°</div>
                <div class="extended-day-temp-low">${day.low}°</div>
                <div class="extended-day-cond">${day.cond}</div>
            </div>
        `).join('');
    }

    function renderMemoryDump() {
        els.memoryDump.textContent = 'MEM: ' + generateHex(8);
    }

    // ---- SIMULATION ----
    function simulateWeather() {
        // Temperature drift
        state.temp += jitter(0, 0.15);
        state.tempTrend = jitter(state.tempTrend * 0.95, 0.3);
        
        // Wind gustiness
        state.windSpeed = jitter(state.windSpeed, 2);
        state.windGust = state.windSpeed + randomRange(8, 18);
        state.windDir = (state.windDir + jitter(0, 3)) % 360;
        
        // Pressure fall
        state.pressure -= randomRange(0, 0.15);
        
        // Precipitation accumulation
        state.precipRate = jitter(state.precipRate, 0.4);
        state.precipRate = Math.max(0, state.precipRate);
        state.precipAccum += state.precipRate / 60; // per minute
        
        // Regenerate forecast occasionally
        if (Math.random() < 0.05) {
            state.forecastData = generateForecast();
            renderForecast();
        }
    }

    // ---- ALERT TOGGLE ----
    function toggleAlert() {
        // Randomly hide/show alert for dramatic effect
        if (Math.random() < 0.003) {
            els.alertPanel.style.display = els.alertPanel.style.display === 'none' ? 'block' : 'none';
        }
    }

    // ---- INITIALIZATION ----
    function init() {
        state.forecastData = generateForecast();
        state.extendedData = generateExtended();
        
        renderTime();
        renderTemp();
        renderWind();
        renderPressure();
        renderPrecip();
        renderForecast();
        renderExtended();
        renderMemoryDump();
        
        // Main update loop
        setInterval(() => {
            renderTime();
            simulateWeather();
            renderTemp();
            renderWind();
            renderPressure();
            renderPrecip();
            toggleAlert();
        }, 1000);
        
        // Memory dump scramble
        setInterval(renderMemoryDump, 200);
        
        // Full forecast refresh
        setInterval(() => {
            state.forecastData = generateForecast();
            renderForecast();
            state.extendedData = generateExtended();
            renderExtended();
        }, 30000);
    }

    // ---- EXPOSED FOR DEBUGGING (BRUTALIST HONESTY) ----
    window.WX = {
        state: state,
        forceUpdate: function() {
            state.forecastData = generateForecast();
            renderForecast();
        },
        setTemp: function(t) { state.temp = t; renderTemp(); }
    };

    // Start the machine
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
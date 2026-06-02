/* =========================================
   WEATHER_DATA_TERMINAL // CORE_LOGIC
   ========================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initMarquee();
    populateForecastTable();
    populateDailyForecast();
    initLiveDataSimulation();
    initRenderTime();
    console.log('[SYSTEM] WEATHER_TERMINAL_INITIATED // STATUS: ONLINE');
});

/* =========================================
   CLOCK & TIME MODULE
   ========================================= */

function initClock() {
    const clockEl = document.querySelector('.clock-time');
    const timestampEl = document.getElementById('liveTimestamp');
    
    function updateTime() {
        const now = new Date();
        const utcString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        
        // Floating clock
        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                timeZone: 'UTC'
            });
        }

        // Header timestamp
        if (timestampEl) {
            timestampEl.textContent = utcString;
        }
    }

    setInterval(updateTime, 1000);
    updateTime();
}

/* =========================================
   MARQUEE MODULE
   ========================================= */

function initMarquee() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (!marqueeContent) return;

    // Duplicate content for seamless loop
    const content = marqueeContent.innerHTML;
    marqueeContent.innerHTML = content + content;
}

/* =========================================
   DATA GENERATION MODULE
   ========================================= */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

const CONDITIONS = [
    'CLEAR', 'PARTLY_CLOUDY', 'OVERCAST', 'LIGHT_RAIN', 
    'HEAVY_RAIN', 'THUNDERSTORM', 'HAZE', 'WINDY'
];

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/* =========================================
   HOURLY FORECAST TABLE
   ========================================= */

function populateForecastTable() {
    const tbody = document.getElementById('forecastBody');
    if (!tbody) return;

    const now = new Date();
    let html = '';

    // Generate 24 hours
    for (let i = 0; i < 24; i++) {
        const hourTime = new Date(now.getTime() + i * 60 * 60 * 1000);
        const hourStr = hourTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        const temp = getRandomFloat(22, 39);
        const feels = (parseFloat(temp) + getRandomFloat(-1, 4)).toFixed(1);
        const humidity = getRandomInt(40, 90);
        const wind = getRandomInt(5, 45);
        const dirIdx = getRandomInt(0, 7);
        const dir = DIRECTIONS[dirIdx];
        const pressure = (1005 + Math.random() * 20).toFixed(1);
        const precip = getRandomInt(0, 100);
        const cloud = getRandomInt(0, 100);
        const uv = getRandomInt(1, 12);
        const cond = CONDITIONS[getRandomInt(0, CONDITIONS.length - 1)];

        // Highlight current hour
        const isCurrent = i === 0;
        const rowClass = isCurrent ? 'style="background: rgba(0, 255, 65, 0.1);"' : '';
        const timeClass = isCurrent ? 'style="color: #00ff41; font-weight: bold;"' : '';

        html += `
            <tr ${rowClass}>
                <td ${timeClass}>${hourStr}</td>
                <td>${temp}</td>
                <td>${feels}</td>
                <td>${humidity}%</td>
                <td>${wind}</td>
                <td>${dir}</td>
                <td>${pressure}</td>
                <td class="${precip > 50 ? 'highlight' : ''}">${precip}%</td>
                <td>${cloud}%</td>
                <td class="${uv > 8 ? 'uv-extreme' : ''}">${uv}</td>
                <td class="condition">${cond}</td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
}

/* =========================================
   DAILY FORECAST MODULE
   ========================================= */

function populateDailyForecast() {
    const container = document.getElementById('dailyForecast');
    if (!container) return;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const now = new Date();
    let html = '';

    for (let i = 0; i < 5; i++) {
        const dayDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        const dayName = days[dayDate.getDay()];
        const maxT = getRandomInt(28, 42);
        const minT = maxT - getRandomInt(8, 15);
        const cond = CONDITIONS[getRandomInt(0, CONDITIONS.length - 1)];
        const precip = getRandomInt(0, 80);

        html += `
            <div class="daily-row">
                <span class="daily-day">${dayName}</span>
                <span class="daily-condition">${cond}</span>
                <span class="daily-temp-range">
                    <span class="temp-max">${maxT}°</span>
                    <span class="temp-min">${minT}°</span>
                </span>
                <span class="daily-precip">💧${precip}%</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

/* =========================================
   LIVE DATA SIMULATION
   ========================================= */

function initLiveDataSimulation() {
    // Subtle fluctuation of main temperature
    const mainTempEl = document.getElementById('mainTemp');
    const feelsLikeEl = document.getElementById('feelsLike');
    const windSpeedEl = document.getElementById('windSpeed');

    setInterval(() => {
        if (mainTempEl) {
            const current = parseFloat(mainTempEl.textContent);
            const change = (Math.random() - 0.5) * 0.1; // Small drift
            mainTempEl.textContent = (current + change).toFixed(1);
        }
        
        if (feelsLikeEl) {
            const current = parseFloat(feelsLikeEl.textContent);
            const change = (Math.random() - 0.5) * 0.15;
            feelsLikeEl.textContent = (current + change).toFixed(1);
        }

        if (windSpeedEl) {
            const current = parseFloat(windSpeedEl.textContent);
            const change = (Math.random() - 0.5) * 2;
            windSpeedEl.textContent = Math.max(0, current + change).toFixed(1);
        }
    }, 3000);
}

/* =========================================
   RENDER TIME
   ========================================= */

function initRenderTime() {
    const renderEl = document.getElementById('renderTime');
    if (renderEl) {
        // Simulate render time calculation
        const time = (Math.random() * 50 + 10).toFixed(0);
        renderEl.textContent = `RENDER_TIME: ${time}ms`;
    }
}
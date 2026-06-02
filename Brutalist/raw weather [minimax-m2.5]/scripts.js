/**
 * BRUTALIST WEATHER DASHBOARD
 * RAW_DATA_STREAM // NO_MERCY
 *
 * Uses Open-Meteo API (free, no key required)
 */
(function() {
    'use strict';

    // ============================================ CONFIGURATION ============================================
    const CONFIG = {
        location: {
            lat: 40.7128,
            lon: -74.0060,
            name: 'NEW YORK_METRO'
        },
        apiBase: 'https://api.open-meteo.com/v1/forecast',
        updateInterval: 60000,
    };

    // ============================================ STATE MANAGEMENT ============================================
    const state = {
        weather: null,
        hourlyForecast: [],
        alerts: [],
        lastUpdate: null,
        apiStatus: 'CONNECTING',
        renderStart: performance.now()
    };

    // ============================================ DOM ELEMENTS ============================================
    const elements = {
        utcTime: document.getElementById('utc-time'),
        currentDate: document.getElementById('current-date'),
        mainTemp: document.getElementById('main-temp'),
        tempHigh: document.getElementById('temp-high'),
        tempLow: document.getElementById('temp-low'),
        feelsLike: document.getElementById('feels-like'),
        weatherIcon: document.getElementById('weather-icon'),
        conditionText: document.getElementById('condition-text'),
        windArrow: document.getElementById('wind-arrow'),
        windSpeed: document.getElementById('wind-speed'),
        windDir: document.getElementById('wind-dir'),
        humidityValue: document.getElementById('humidity-value'),
        humidityBar: document.getElementById('humidity-bar'),
        pressureValue: document.getElementById('pressure-value'),
        visibilityValue: document.getElementById('visibility-value'),
        uvValue: document.getElementById('uv-value'),
        sunriseValue: document.getElementById('sunrise-value'),
        sunsetValue: document.getElementById('sunset-value'),
        forecastTbody: document.getElementById('forecast-tbody'),
        alertContent: document.getElementById('alert-content'),
        apiStatus: document.getElementById('api-status'),
        lastUpdate: document.getElementById('last-update'),
        renderTime: document.getElementById('render-time')
    };

    // ============================================ UTILITY FUNCTIONS ============================================
    function fahrenheitFromCelsius(c) {
        return Math.round(c * 9/5 + 32);
    }

    function formatTime(isoString) {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function formatDate(isoString) {
        if (!isoString) return 'YYYY-MM-DD';
        const date = new Date(isoString);
        return date.toISOString().split('T')[0];
    }

    function getWeatherIcon(code) {
        const icons = {
            0: '☀',
            1: '🌤',
            2: '⛅',
            3: '☁',
            45: '🌫',
            48: '🌫',
            51: '🌧',
            53: '🌧',
            55: '🌧',
            61: '🌧',
            63: '🌧',
            65: '🌧',
            71: '🌨',
            73: '🌨',
            75: '❄',
            77: '🌨',
            80: '🌦',
            81: '🌦',
            82: '⛈',
            85: '🌨',
            86: '❄',
            95: '⛈',
            96: '⛈',
            99: '⛈'
        };
        return icons[code] || '☁';
    }

    function getConditionText(code) {
        const conditions = {
            0: 'CLEAR_SKY',
            1: 'MAINLY_CLEAR',
            2: 'PARTLY_CLOUDY',
            3: 'OVERCAST',
            45: 'FOG',
            48: 'FOG',
            51: 'DRIZZLE_LIGHT',
            53: 'DRIZZLE_MODERATE',
            55: 'DRIZZLE_DENSE',
            61: 'RAIN_SLIGHT',
            63: 'RAIN_MODERATE',
            65: 'RAIN_HEAVY',
            71: 'SNOW_SLIGHT',
            73: 'SNOW_MODERATE',
            75: 'SNOW_HEAVY',
            77: 'SNOW_GRAINS',
            80: 'SHOWERS_SLIGHT',
            81: 'SHOWERS_MODERATE',
            82: 'SHOWERS_VIOLENT',
            85: 'SNOW_SHOWERS_SLIGHT',
            86: 'SNOW_SHOWERS_HEAVY',
            95: 'THUNDERSTORM',
            96: 'THUNDERSTORM_HAIL',
            99: 'THUNDERSTORM_HAIL'
        };
        return conditions[code] || 'UNKNOWN';
    }

    function getUVIndex(uv) {
        if (uv <= 2) return { value: uv, level: 'LOW', color: '#00ff66' };
        if (uv <= 5) return { value: uv, level: 'MODERATE', color: '#ffcc00' };
        if (uv <= 7) return { value: uv, level: 'HIGH', color: '#ff6600' };
        if (uv <= 10) return { value: uv, level: 'VERY_HIGH', color: '#ff0033' };
        return { value: uv, level: 'EXTREME', color: '#ff00ff' };
    }

    // ============================================ CLOCK FUNCTIONS ============================================
    function updateClock() {
        const now = new Date();
        elements.utcTime.textContent = now.toISOString().split('.')[0].replace('T', ' ');
        elements.currentDate.textContent = formatDate(now.toISOString());
    }

    // ============================================ API FUNCTIONS ============================================
    async function fetchWeatherData() {
        const { lat, lon } = CONFIG.location;
        const url = `${CONFIG.apiBase}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=2`;

        try {
            state.apiStatus = 'FETCHING...';
            updateApiStatus();
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP_${response.status}`);
            const data = await response.json();
            state.weather = data;
            state.hourlyForecast = data.hourly || {};
            state.lastUpdate = new Date();
            state.apiStatus = 'CONNECTED';
            updateApiStatus();
            return true;
        } catch (error) {
            console.error('API Error:', error);
            state.apiStatus = 'ERROR';
            updateApiStatus();
            return false;
        }
    }

    // ============================================ UI UPDATE FUNCTIONS ============================================
    function updateApiStatus() {
        elements.apiStatus.textContent = state.apiStatus;
        elements.apiStatus.className = 'debug-value';
        if (state.apiStatus === 'ERROR') {
            elements.apiStatus.classList.add('error');
        } else if (state.apiStatus === 'CONNECTING' || state.apiStatus === 'FETCHING...') {
            elements.apiStatus.classList.add('connecting');
        } else {
            elements.apiStatus.textContent = 'OK';
        }
    }

    function updateCurrentWeather() {
        if (!state.weather) return;
        const current = state.weather.current;
        const daily = state.weather.daily;

        elements.mainTemp.textContent = fahrenheitFromCelsius(current.temperature_2m);
        elements.mainTemp.className = 'temp-value';
        if (current.temperature_2m < 10) {
            elements.mainTemp.classList.add('cold');
        }

        if (daily && daily.temperature_2m_max) {
            elements.tempHigh.textContent = fahrenheitFromCelsius(daily.temperature_2m_max[0]);
            elements.tempLow.textContent = fahrenheitFromCelsius(daily.temperature_2m_min[0]);
        }

        elements.feelsLike.textContent = fahrenheitFromCelsius(current.apparent_temperature);
        elements.weatherIcon.textContent = getWeatherIcon(current.weather_code);
        elements.conditionText.textContent = getConditionText(current.weather_code);

        const windDeg = current.wind_direction_10m;
        const windSpeed = Math.round(current.wind_speed_10m * 0.621371);
        elements.windSpeed.textContent = windSpeed;
        elements.windDir.textContent = `${windDeg}°`;
        elements.windArrow.style.transform = `rotate(${windDeg}deg)`;

        const humidity = current.relative_humidity_2m;
        elements.humidityValue.textContent = humidity;
        elements.humidityBar.style.width = `${humidity}%`;

        const pressure = (current.surface_pressure * 0.02953).toFixed(2);
        elements.pressureValue.textContent = pressure;

        const visibility = Math.round(10 - (current.cloud_cover / 10));
        elements.visibilityValue.textContent = visibility;

        if (daily && daily.uv_index_max) {
            const uvData = getUVIndex(daily.uv_index_max[0]);
            elements.uvValue.textContent = uvData.value;
            elements.uvValue.style.color = uvData.color;
        }

        if (daily) {
            elements.sunriseValue.textContent = formatTime(daily.sunrise[0]);
            elements.sunsetValue.textContent = formatTime(daily.sunset[0]);
        }
    }

    function updateHourlyForecast() {
        if (!state.hourlyForecast.time) return;
        const tbody = elements.forecastTbody;
        tbody.innerHTML = '';
        const now = new Date();
        const currentHour = now.getUTCHours();

        for (let i = 0; i < 24; i++) {
            const hourIndex = currentHour + i;
            if (hourIndex >= state.hourlyForecast.time.length) break;
            const time = state.hourlyForecast.time[hourIndex];
            const temp = state.hourlyForecast.temperature_2m[hourIndex];
            const code = state.hourlyForecast.weather_code[hourIndex];
            const precip = state.hourlyForecast.precipitation_probability[hourIndex] || 0;
            const wind = Math.round((state.hourlyForecast.wind_speed_10m[hourIndex] || 0) * 0.621371);
            const hum = state.hourlyForecast.relative_humidity_2m[hourIndex] || 0;
            const hourDate = new Date(time);
            const hourStr = hourDate.getUTCHours().toString().padStart(2, '0') + ':00';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${hourStr} UTC</td>
                <td>${fahrenheitFromCelsius(temp)}°F</td>
                <td>${getWeatherIcon(code)}</td>
                <td>${precip}%</td>
                <td>${wind} mph</td>
                <td>${hum}%</td>
            `;
            if (i === 0) {
                row.style.background = 'rgba(255, 51, 0, 0.2)';
                row.style.borderLeft = '3px solid #ff3300';
            }
            tbody.appendChild(row);
        }
    }

    function updateAlerts() {
        if (!state.weather) return;
        const current = state.weather.current;
        const alerts = [];

        if (current.precipitation > 5) {
            alerts.push({
                type: 'WARNING',
                title: 'HEAVY_PRECIPITATION',
                desc: 'Significant rainfall detected. Exercise caution outdoors.'
            });
        }
        if (current.wind_speed_10m > 50) {
            alerts.push({
                type: 'WARNING',
                title: 'HIGH_WIND',
                desc: 'Wind speeds exceeding 50 km/h. Secure loose objects.'
            });
        }
        if (current.weather_code >= 95) {
            alerts.push({
                type: 'ALERT',
                title: 'THUNDERSTORM',
                desc: 'Thunderstorm activity in the area. Seek shelter.'
            });
        }
        if (state.weather.daily && state.weather.daily.uv_index_max[0] > 7) {
            alerts.push({
                type: 'ADVISORY',
                title: 'UV_WARNING',
                desc: 'Very high UV index. Limit sun exposure.'
            });
        }

        if (alerts.length > 0) {
            elements.alertContent.innerHTML = '';
            alerts.forEach(alert => {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert-active';
                alertDiv.innerHTML = `
                    <div class="alert-title">${alert.type}: ${alert.title}</div>
                    <div class="alert-desc">${alert.desc}</div>
                `;
                elements.alertContent.appendChild(alertDiv);
            });
        } else {
            elements.alertContent.innerHTML = '<div class="no-alerts">NO_ACTIVE_WATCHES_OR_WARNINGS</div>';
        }
    }

    function updateLastUpdate() {
        if (state.lastUpdate) {
            elements.lastUpdate.textContent = state.lastUpdate.toISOString().split('.')[0].replace('T', ' ');
        }
    }

    function calculateRenderTime() {
        const renderTime = Math.round(performance.now() - state.renderStart);
        elements.renderTime.textContent = `${renderTime}ms`;
    }

    // ============================================ INITIALIZATION ============================================
    async function init() {
        console.log('%c WEATHER_DATA_STREAM // RAW ', 'background: #ff3300; color: #000; font-family: monospace; font-size: 20px; font-weight: bold;');
        console.log('%c Initializing brutalist dashboard...', 'color: #888;');
        updateClock();
        setInterval(updateClock, 1000);

        const success = await fetchWeatherData();
        if (success) {
            updateCurrentWeather();
            updateHourlyForecast();
            updateAlerts();
            updateLastUpdate();

            setInterval(async () => {
                await fetchWeatherData();
                updateCurrentWeather();
                updateHourlyForecast();
                updateLastUpdate();
            }, CONFIG.updateInterval);
        }
        calculateRenderTime();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
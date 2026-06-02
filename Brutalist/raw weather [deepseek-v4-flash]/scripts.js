// BRUTAL WEATHER ENGINE v2.4.1
// Raw data processing and DOM manipulation
// No frameworks. No mercy. Pure functionality.

class BrutalWeather {
    constructor() {
        this.data = this.initializeData();
        this.streamMessages = [
            '[SYNC] SATELLITE ARRAY: CONNECTED',
            '[PROC] BAROMETRIC DATA: PARSED',
            '[WARN] WIND SHEAR DETECTED AT 1200M',
            '[DATA] TEMPERATURE SENSOR: CALIBRATED',
            '[SYNC] DOPPLER RADAR: ACTIVE',
            '[ALRT] PRESSURE DROP: 2.3 hPa/HR',
            '[PROC] HUMIDITY ARRAY: STABLE',
            '[DATA] UV SENSOR: NOMINAL',
            '[SYNC] GPS LOCK: ACQUIRED',
            '[WARN] TURBULENCE FORECAST: MODERATE'
        ];
        this.streamIndex = 0;
        this.updateInterval = null;
        this.streamInterval = null;
        this.forecastData = this.generateForecastData();
        this.dailyData = this.generateDailyData();
        
        this.init();
    }

    initializeData() {
        return {
            temperature: 32,
            feelsLike: 28,
            condition: 'SCATTERED THUNDERSTORMS',
            windSpeed: 24,
            windDirection: 225, // degrees (SW)
            windDirText: 'SW',
            windGust: 38,
            pressure: 1012,
            pressureTrend: '▼ FALLING RAPIDLY',
            humidity: 87,
            dewPoint: 19,
            uvIndex: 5,
            visibility: 8,
            isAlert: true,
            alertMessage: 'THUNDERSTORM WARNING IN EFFECT UNTIL 23:45 - SEEK SHELTER IMMEDIATELY'
        };
    }

    init() {
        this.renderInitialData();
        this.startLiveUpdates();
        this.startDataStream();
        this.populateForecastTable();
        this.populateDailyGrid();
        this.updateLastUpdateTime();
    }

    renderInitialData() {
        // Temperature
        document.getElementById('tempValue').textContent = this.data.temperature;
        document.getElementById('feelsLike').textContent = this.data.feelsLike;
        document.getElementById('condition').textContent = this.data.condition;

        // Wind
        document.getElementById('windSpeed').textContent = this.data.windSpeed;
        document.getElementById('windDir').textContent = this.data.windDirText;
        document.getElementById('windGust').textContent = this.data.windGust;
        this.updateWindArrow(this.data.windDirection);

        // Pressure
        document.getElementById('pressureValue').textContent = this.data.pressure;
        document.getElementById('pressureTrend').textContent = this.data.pressureTrend;

        // Humidity
        document.getElementById('humidityValue').textContent = this.data.humidity;
        document.getElementById('humidityFill').style.width = this.data.humidity + '%';
        document.getElementById('dewPoint').textContent = this.data.dewPoint;

        // UV
        document.getElementById('uvValue').textContent = this.data.uvIndex;
        this.updateUVStatus(this.data.uvIndex);

        // Visibility
        document.getElementById('visibilityValue').textContent = this.data.visibility;

        // Alert
        if (this.data.isAlert) {
            document.getElementById('alertMessage').textContent = this.data.alertMessage;
            document.querySelector('.alert-zone').style.display = 'block';
        } else {
            document.querySelector('.alert-zone').style.display = 'none';
        }
    }

    updateWindArrow(degrees) {
        const arrow = document.getElementById('windArrow');
        // Wind direction: arrows point FROM direction
        // Meteorological convention: wind direction is where wind comes FROM
        // Arrow should point TO the direction wind is going (opposite)
        const arrowDegrees = degrees + 180;
        arrow.style.transform = `rotate(${arrowDegrees}deg)`;
    }

    updateUVStatus(index) {
        const statusEl = document.getElementById('uvStatus');
        const uvValue = document.getElementById('uvValue');
        
        uvValue.textContent = index;
        
        if (index <= 2) {
            statusEl.textContent = 'LOW';
            statusEl.style.color = '#00aa00';
        } else if (index <= 5) {
            statusEl.textContent = 'MODERATE';
            statusEl.style.color = '#aacc00';
        } else if (index <= 7) {
            statusEl.textContent = 'HIGH';
            statusEl.style.color = '#ffcc00';
        } else if (index <= 10) {
            statusEl.textContent = 'VERY HIGH';
            statusEl.style.color = '#ff8800';
        } else {
            statusEl.textContent = 'EXTREME';
            statusEl.style.color = '#ff0044';
        }
    }

    generateForecastData() {
        const conditions = [
            'CLEAR', 'PARTLY CLOUDY', 'CLOUDY', 'LIGHT RAIN',
            'HEAVY RAIN', 'THUNDERSTORMS', 'FOG', 'HAZE',
            'WINDY', 'DRIZZLE', 'SLEET', 'SNOW SHOWERS'
        ];
        
        const windDirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                         'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        
        const forecast = [];
        const now = new Date();
        
        for (let i = 0; i < 24; i++) {
            const hour = new Date(now.getTime() + i * 3600000);
            const hourStr = hour.getHours().toString().padStart(2, '0') + ':00';
            
            const temp = Math.round(this.data.temperature + (Math.random() - 0.5) * 8);
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const windSpeed = Math.round(10 + Math.random() * 40);
            const windDir = windDirs[Math.floor(Math.random() * windDirs.length)];
            const precip = Math.round(Math.random() * 80);
            const humidity = Math.round(40 + Math.random() * 55);
            
            forecast.push({
                time: hourStr,
                temp: temp,
                condition: condition,
                wind: `${windSpeed} km/h ${windDir}`,
                precip: precip + '%',
                humidity: humidity + '%'
            });
        }
        
        return forecast;
    }

    generateDailyData() {
        const days = ['TODAY', 'TOMORROW', 'DAY 3'];
        const conditions = ['SCATTERED T-STORMS', 'PARTLY CLOUDY', 'MOSTLY CLOUDY'];
        const details = ['WIND: 24 KM/H SW • HUMIDITY: 87%', 
                        'WIND: 18 KM/H NW • HUMIDITY: 65%',
                        'WIND: 32 KM/H S • HUMIDITY: 78%'];
        
        return days.map((day, index) => {
            const high = Math.round(this.data.temperature + 4 + Math.random() * 6);
            const low = Math.round(this.data.temperature - 6 - Math.random() * 4);
            return {
                day: day,
                high: high,
                low: low,
                condition: conditions[index],
                details: details[index]
            };
        });
    }

    populateForecastTable() {
        const tbody = document.getElementById('forecastBody');
        tbody.innerHTML = '';
        
        this.forecastData.forEach(hour => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${hour.time}</td>
                <td>${hour.temp}°C</td>
                <td>${hour.condition}</td>
                <td>${hour.wind}</td>
                <td>${hour.precip}</td>
                <td>${hour.humidity}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    populateDailyGrid() {
        const grid = document.getElementById('dailyGrid');
        grid.innerHTML = '';
        
        this.dailyData.forEach(day => {
            const card = document.createElement('div');
            card.className = 'daily-card';
            card.innerHTML = `
                <div class="daily-date">${day.day}</div>
                <div class="daily-temp">${day.high}°</div>
                <div class="daily-temp-range">
                    <span>H: ${day.high}°</span> / <span>L: ${day.low}°</span>
                </div>
                <div class="daily-condition">${day.condition}</div>
                <div class="daily-details">${day.details}</div>
            `;
            grid.appendChild(card);
        });
    }

    startLiveUpdates() {
        this.updateInterval = setInterval(() => {
            this.simulateDataChange();
            this.renderInitialData();
            this.updateLastUpdateTime();
        }, 5000);
    }

    simulateDataChange() {
        // Simulate natural data fluctuations
        this.data.temperature += (Math.random() - 0.5) * 0.6;
        this.data.temperature = Math.round(this.data.temperature * 10) / 10;
        
        this.data.feelsLike = this.data.temperature + (Math.random() - 0.5) * 4;
        this.data.feelsLike = Math.round(this.data.feelsLike * 10) / 10;
        
        this.data.windSpeed = Math.max(0, this.data.windSpeed + (Math.random() - 0.5) * 5);
        this.data.windSpeed = Math.round(this.data.windSpeed);
        
        this.data.windDirection = (this.data.windDirection + (Math.random() - 0.5) * 20) % 360;
        if (this.data.windDirection < 0) this.data.windDirection += 360;
        this.data.windDirText = this.degreesToDirection(this.data.windDirection);
        
        this.data.windGust = Math.round(this.data.windSpeed * (1.2 + Math.random() * 0.6));
        
        this.data.pressure += (Math.random() - 0.5) * 1.2;
        this.data.pressure = Math.round(this.data.pressure * 10) / 10;
        
        // Pressure trend logic
        if (this.data.pressure < 1010) {
            this.data.pressureTrend = '▼ FALLING RAPIDLY';
        } else if (this.data.pressure < 1015) {
            this.data.pressureTrend = '▼ FALLING';
        } else if (this.data.pressure < 1020) {
            this.data.pressureTrend = '→ STEADY';
        } else {
            this.data.pressureTrend = '▲ RISING';
        }
        
        this.data.humidity = Math.min(100, Math.max(20, 
            this.data.humidity + (Math.random() - 0.5) * 4));
        this.data.humidity = Math.round(this.data.humidity);
        
        this.data.dewPoint = Math.round(this.data.temperature - 
            (100 - this.data.humidity) / 5);
        
        this.data.uvIndex = Math.min(11, Math.max(0, 
            this.data.uvIndex + (Math.random() - 0.5) * 2));
        this.data.uvIndex = Math.round(this.data.uvIndex);
        
        this.data.visibility = Math.max(0.5, 
            this.data.visibility + (Math.random() - 0.5) * 2);
        this.data.visibility = Math.round(this.data.visibility * 10) / 10;
        
        // Random condition changes
        if (Math.random() < 0.1) {
            const conditions = [
                'CLEAR SKIES', 'PARTLY CLOUDY', 'OVERCAST',
                'LIGHT DRIZZLE', 'SCATTERED THUNDERSTORMS',
                'HEAVY RAIN', 'FOGGY', 'HAZY'
            ];
            this.data.condition = conditions[Math.floor(Math.random() * conditions.length)];
        }
        
        // Update wind arrow
        this.updateWindArrow(this.data.windDirection);
        
        // Update humidity bar
        document.getElementById('humidityFill').style.width = this.data.humidity + '%';
    }

    degreesToDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    startDataStream() {
        this.streamInterval = setInterval(() => {
            this.addStreamMessage();
        }, 2000);
    }

    addStreamMessage() {
        const stream = document.getElementById('streamLive');
        const message = this.streamMessages[this.streamIndex % this.streamMessages.length];
        
        // Create new stream line
        const line = document.createElement('div');
        line.className = 'stream-line';
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        line.textContent = `[${timestamp}] ${message}`;
        
        // Insert before the live indicator
        stream.parentNode.insertBefore(line, stream);
        
        // Update live indicator
        const liveTimestamp = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        stream.textContent = `[LIVE] ${liveTimestamp} // SENSOR ARRAY: OPERATIONAL`;
        
        // Limit stream lines to prevent memory issues
        const streamContainer = document.getElementById('dataStream');
        while (streamContainer.children.length > 50) {
            streamContainer.removeChild(streamContainer.children[0]);
        }
        
        this.streamIndex++;
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = `LAST UPDATE: ${timeStr}`;
    }

    // Cleanup method for potential future use
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const weather = new BrutalWeather();
    
    // Expose to console for debugging (brutalist transparency)
    console.log('BRUTAL WEATHER ENGINE v2.4.1 // INITIALIZED');
    console.log('RAW DATA OBJECT:', weather.data);
    console.log('FORECAST ARRAY:', weather.forecastData);
    console.log('DAILY OUTLOOK:', weather.dailyData);
});
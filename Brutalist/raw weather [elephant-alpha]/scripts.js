// scripts.js

// Brutal Weather Dashboard - JavaScript Core
class BrutalWeatherDashboard {
    constructor() {
        this.data = {
            temperature: 0,
            condition: '',
            humidity: 0,
            pressure: 0,
            visibility: 0,
            windSpeed: 0,
            windGust: 0,
            windDirection: 0,
            co2: 0,
            oxygen: 0,
            sulfur: 0,
            seismic: 0,
            magnetic: 0,
            radiation: 0,
            riverLevel: 0,
            groundwater: 0,
            snowDepth: 0,
            cpuLoad: 0,
            memory: 0,
            network: 0,
            alerts: []
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.generateMockData();
        this.updateAllDisplays();
        this.startAlertSystem();
    }
    
    setupEventListeners() {
        // Keyboard controls for brutal interaction
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'r':
                case 'R':
                    this.generateMockData();
                    this.updateAllDisplays();
                    break;
                case 'a':
                case 'A':
                    this.triggerAlert();
                    break;
                case 'c':
                case 'C':
                    this.toggleChaosMode();
                    break;
            }
        });
        
        // Mouse movement affects data
        document.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e.clientX, e.clientY);
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    generateMockData() {
        // Generate realistic-looking random data
        this.data.temperature = Math.floor(Math.random() * 60) - 20; // -20 to 40°C
        this.data.humidity = Math.floor(Math.random() * 100);
        this.data.pressure = 980 + Math.floor(Math.random() * 40);
        this.data.visibility = (Math.random() * 20).toFixed(1);
        this.data.windSpeed = (Math.random() * 50).toFixed(1);
        this.data.windGust = (Math.random() * 80).toFixed(1);
        this.data.windDirection = Math.floor(Math.random() * 360);
        this.data.co2 = 300 + Math.floor(Math.random() * 500);
        this.data.oxygen = 20 + (Math.random() * 5);
        this.data.sulfur = Math.floor(Math.random() * 100);
        this.data.seismic = (Math.random() * 10).toFixed(2);
        this.data.magnetic = 20 + Math.floor(Math.random() * 50);
        this.data.radiation = (Math.random() * 10).toFixed(2);
        this.data.riverLevel = (Math.random() * 10).toFixed(2);
        this.data.groundwater = (Math.random() * 50).toFixed(2);
        this.data.snowDepth = Math.floor(Math.random() * 200);
        this.data.cpuLoad = Math.floor(Math.random() * 100);
        this.data.memory = Math.floor(Math.random() * 100);
        this.data.network = Math.floor(Math.random() * 500);
        
        this.generateCondition();
        this.generateAlerts();
        this.updateForecastTable();
    }
    
    generateCondition() {
        const conditions = [
            'CLEAR', 'CLOUDY', 'RAIN', 'SNOW', 
            'STORM', 'FOG', 'HAZE', 'WINDY',
            'EXTREME HEAT', 'BLIZZARD', 'TORRENTIAL RAIN',
            'ICE STORM', 'DUST DEVIL', 'THUNDER HAIL'
        ];
        this.data.condition = conditions[Math.floor(Math.random() * conditions.length)];
    }
    
    generateAlerts() {
        const alertTypes = [
            { type: 'normal', message: 'ALL SYSTEMS NOMINAL', level: 1 },
            { type: 'warning', message: 'ELEVATED PARTICULATE MATTER DETECTED', level: 2 },
            { type: 'critical', message: 'ATMOSPHERIC INSTABILITY - IMMINENT STORM SYSTEM', level: 3 },
            { type: 'critical', message: 'SEISMIC ACTIVITY DETECTED - LEVEL 4', level: 4 },
            { type: 'warning', message: 'RADIATION LEVELS ELEVATED IN SECTOR 7', level: 2 },
            { type: 'normal', message: 'GRID SYNCHRONIZATION MAINTAINED', level: 1 }
        ];
        
        const count = 2 + Math.floor(Math.random() * 3);
        this.data.alerts = [];
        for (let i = 0; i < count; i++) {
            const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            this.data.alerts.push({
                type: alert.type,
                message: alert.message,
                timestamp: this.getCurrentTime()
            });
        }
    }
    
    updateAllDisplays() {
        this.updateTemperatureDisplay();
        this.updateWindDisplay();
        this.updateAlertDisplay();
        this.updateForecastTable();
        this.updateAtmosphericPanel();
        this.updateGeophysicalPanel();
        this.updateHydrologicalPanel();
        this.updateStatusBar();
    }
    
    updateTemperatureDisplay() {
        document.getElementById('main-temp').textContent = this.data.temperature + '°';
        document.getElementById('condition').textContent = this.data.condition;
        document.getElementById('humidity').textContent = this.data.humidity;
        document.getElementById('pressure').textContent = this.data.pressure;
        document.getElementById('visibility').textContent = this.data.visibility;
        
        // Temperature color coding
        const tempEl = document.getElementById('main-temp');
        const conditionEl = document.getElementById('condition');
        const temp = this.data.temperature;
        
        if (temp > 35 || temp < -10) {
            tempEl.style.color = '#ff3333';
            tempEl.style.textShadow = '5px 5px 0 #ff0000, 10px 10px 0 rgba(255,0,0,0.5)';
            conditionEl.style.color = '#ffcc00';
        } else if (temp > 25) {
            tempEl.style.color = '#ff6600';
            tempEl.style.textShadow = '5px 5px 0 #ffaa00';
            conditionEl.style.color = '#ffaa00';
        } else if (temp > 15) {
            tempEl.style.color = '#33ff33';
            tempEl.style.textShadow = '5px 5px 0 #00aa00';
            conditionEl.style.color = '#33ff33';
        } else if (temp > 0) {
            tempEl.style.color = '#3399ff';
            tempEl.style.textShadow = '5px 5px 0 #0066cc';
            conditionEl.style.color = '#66ccff';
        } else {
            tempEl.style.color = '#cc33ff';
            tempEl.style.textShadow = '5px 5px 0 #9900cc';
            conditionEl.style.color = '#cc99ff';
        }
    }
    
    updateWindDisplay() {
        document.getElementById('wind-speed').textContent = this.data.windSpeed + ' m/s';
        document.getElementById('wind-gust').textContent = 'GUST: ' + this.data.windGust + ' m/s';
        
        // Rotate wind arrow based on direction
        const arrow = document.getElementById('wind-arrow');
        const direction = this.data.windDirection;
        arrow.style.transform = `rotate(${direction}deg)`;
        
        // Color based on wind speed
        const speed = parseFloat(this.data.windSpeed);
        if (speed > 30) {
            arrow.style.color = '#ff3333';
        } else if (speed > 20) {
            arrow.style.color = '#ff9900';
        } else if (speed > 10) {
            arrow.style.color = '#ffcc00';
        } else {
            arrow.style.color = '#33ff33';
        }
    }
    
    updateAlertDisplay() {
        const container = document.getElementById('alerts');
        if (this.data.alerts.length === 0) {
            container.innerHTML = '<div class="alert-item normal">NO ACTIVE ALERTS</div>';
            return;
        }
        
        container.innerHTML = this.data.alerts.map(alert => 
            `<div class="alert-item ${alert.type}">${alert.message}</div>`
        ).join('');
    }
    
    updateForecastTable() {
        const tbody = document.querySelector('#forecast-table tbody');
        const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
        
        let html = '';
        hours.forEach((hour, index) => {
            const temp = Math.floor(this.data.temperature + (Math.random() * 10 - 5));
            const conditions = ['CLEAR', 'CLOUDY', 'RAIN', 'SNOW', 'STORM'];
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const wind = (this.data.windSpeed + (Math.random() * 10)).toFixed(1);
            const rain = Math.random() > 0.5 ? 'YES' : 'NO';
            const humidity = Math.floor(this.data.humidity + (Math.random() * 20 - 10));
            
            html += `
                <tr>
                    <td>${hour}</td>
                    <td>${temp}°</td>
                    <td>${condition}</td>
                    <td>${wind} m/s</td>
                    <td>${rain}</td>
                    <td>${humidity}%</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    updateAtmosphericPanel() {
        document.getElementById('co2').textContent = this.data.co2;
        document.getElementById('oxygen').textContent = this.data.oxygen.toFixed(2);
        document.getElementById('sulfur').textContent = this.data.sulfur;
    }
    
    updateGeophysicalPanel() {
        document.getElementById('seismic').textContent = this.data.seismic;
        document.getElementById('magnetic').textContent = this.data.magnetic;
        document.getElementById('radiation').textContent = this.data.radiation;
    }
    
    updateHydrologicalPanel() {
        document.getElementById('river').textContent = this.data.riverLevel;
        document.getElementById('groundwater').textContent = this.data.groundwater;
        document.getElementById('snow').textContent = this.data.snowDepth;
    }
    
    updateStatusBar() {
        this.data.cpuLoad = Math.floor(Math.random() * 100);
        this.data.memory = Math.floor(Math.random() * 100);
        this.data.network = Math.floor(Math.random() * 500);
        
        document.getElementById('cpu-load').textContent = this.data.cpuLoad;
        document.getElementById('memory').textContent = this.data.memory;
        document.getElementById('network').textContent = this.data.network;
        document.getElementById('sync-status').textContent = this.data.cpuLoad > 80 ? 'OVERLOAD' : 'ONLINE';
        document.getElementById('system-status').textContent = this.data.cpuLoad > 90 ? 'CRITICAL' : 'STABLE';
        
        // System status color coding
        const systemStatus = document.getElementById('system-status');
        if (this.data.cpuLoad > 90) {
            systemStatus.style.color = '#ff3333';
        } else if (this.data.cpuLoad > 70) {
            systemStatus.style.color = '#ff9900';
        } else {
            systemStatus.style.color = '#33ff33';
        }
    }
    
    triggerAlert() {
        const alertMessages = [
            '!!! SYSTEM BREACH DETECTED !!!',
            '!!! POWER GRID INSTABILITY !!!',
            '!!! ATMOSPHERIC COLLAPSE IMMINENT !!!',
            '!!! RADITIONAL FAILURE IMMINENT !!!',
            '!!! GLOBAL CLIMATE SYSTEM FAILURE !!!'
        ];
        
        const alert = {
            type: 'critical',
            message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
            timestamp: this.getCurrentTime()
        };
        
        this.data.alerts.unshift(alert);
        if (this.data.alerts.length > 5) {
            this.data.alerts = this.data.alerts.slice(0, 5);
        }
        
        this.updateAlertDisplay();
        
        // Visual flash effect
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = 'alert-flash 0.5s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }, 10);
    }
    
    toggleChaosMode() {
        document.body.style.filter = 'hue-rotate(' + (Math.random() * 360) + 'deg) invert(0.3)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
    
    updateMousePosition(x, y) {
        // Subtle parallax effect based on mouse position
        const intensity = 0.02;
        document.querySelector('.temperature-overlay').style.transform = 
            `rotate(${(x / window.innerWidth - 0.5) * intensity}deg)`;
        document.querySelector('.wind-section').style.transform = 
            `rotate(${(y / window.innerHeight - 0.5) * -intensity}deg)`;
    }
    
    handleResize() {
        // Recalculate positions on resize
        this.updateMousePosition(window.innerWidth / 2, window.innerHeight / 2);
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }
    
    startRealTimeUpdates() {
        setInterval(() => {
            // Update time
            document.getElementById('system-time').textContent = this.getCurrentTime();
            
            // Update location tag with random coordinates
            if (Math.random() > 0.9) {
                this.generateMockData();
                this.updateTemperatureDisplay();
                this.updateWindDisplay();
            }
        }, 1000);
        
        // Full data refresh every 5 seconds
        setInterval(() => {
            this.generateMockData();
            this.updateAllDisplays();
        }, 5000);
    }
    
    startAlertSystem() {
        // Random alert triggers
        setInterval(() => {
            if (Math.random() > 0.95) {
                this.triggerAlert();
            }
        }, 10000);
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrutalWeatherDashboard();
});

// Add some additional brutalist animations
const style = document.createElement('style');
style.textContent = `
    @keyframes alert-flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
        75% { opacity: 1; }
    }
    
    @keyframes data-flicker {
        0%, 95%, 100% { opacity: 1; }
        96% { opacity: 0.8; }
        97% { opacity: 1; }
        98% { opacity: 0.9; }
        99% { opacity: 1; }
    }
    
    .temp-display, .alert-item, .metric {
        animation: data-flicker 3s infinite;
    }
    
    .dashboard-header {
        animation: header-flicker 5s infinite;
    }
    
    @keyframes header-flicker {
        0%, 90%, 100% { opacity: 1; }
        91% { opacity: 0.8; }
        92% { opacity: 1; }
        93% { opacity: 0.9; }
        94% { opacity: 1; }
        95% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);
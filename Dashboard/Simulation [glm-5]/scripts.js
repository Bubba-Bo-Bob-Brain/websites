const SimulationDashboard = {
    state: {
        population: 8247391826,
        temperature: 14.72,
        co2: 412.7,
        seaLevel: 2.34,
        energy: 847.2,
        trade: 847.3,
        satellites: 7847,
        earthquakes: 2847,
        simTime: { year: 2847, day: 127, hour: 14, minute: 32, second: 7 }
    },

    cityData: [
        { name: '🗼 Tokyo', pop: 37.4, trend: 'down' },
        { name: '🇮🇳 Delhi', pop: 32.9, trend: 'up' },
        { name: '🇨🇳 Shanghai', pop: 29.2, trend: 'up' },
        { name: '🇧🇷 São Paulo', pop: 22.4, trend: 'up' },
        { name: '🇲🇽 Mexico City', pop: 21.9, trend: 'stable' },
        { name: '🇪🇬 Cairo', pop: 21.3, trend: 'up' },
        { name: '🇮🇳 Mumbai', pop: 21.0, trend: 'up' },
        { name: '🇨🇳 Beijing', pop: 20.9, trend: 'down' },
        { name: '🇧🇩 Dhaka', pop: 20.6, trend: 'up' },
        { name: '🇯🇵 Osaka', pop: 19.1, trend: 'down' },
        { name: '🇺🇸 New York', pop: 18.8, trend: 'stable' },
        { name: '🇵🇰 Karachi', pop: 16.8, trend: 'up' },
        { name: '🇦🇷 Buenos Aires', pop: 15.5, trend: 'stable' },
        { name: '🇹🇷 Istanbul', pop: 15.4, trend: 'up' },
        { name: '🇹🇭 Bangkok', pop: 14.8, trend: 'up' },
        { name: '🇮🇳 Kolkata', pop: 14.7, trend: 'up' },
        { name: '🇵🇭 Manila', pop: 14.4, trend: 'up' },
        { name: '🇳🇬 Lagos', pop: 14.1, trend: 'up' },
        { name: '🇧🇷 Rio', pop: 13.6, trend: 'stable' },
        { name: '🇨🇳 Guangzhou', pop: 13.5, trend: 'up' }
    ],

    alerts: [
        { icon: '🌋', msg: 'VOLCANIC ERUPTION - Mt. Tharsis - Evacuate Sector 7G', type: 'critical', action: 'ACTION REQUIRED' },
        { icon: '🌊', msg: 'TSUNAMI WARNING - Eastern Coast - ETA 47 minutes', type: 'critical', action: 'MONITORING' },
        { icon: '👥', msg: 'FAMINE ALERT - Sector 12B - Resource threshold exceeded', type: 'critical', action: 'INTERVENTION' },
        { icon: '🛰️', msg: 'COLLISION WARNING - SAT-2847 / DEBRIS-91847 - 12km', type: 'warning', action: 'EVASION' },
        { icon: '🌡️', msg: 'HEAT WAVE - Sector 8A - 48°C expected - 3 days', type: 'warning', action: 'ADVISORY' },
        { icon: '🌪️', msg: 'TORNADO OUTBREAK - Plains Sector - 12 confirmed', type: 'warning', action: 'ALERT' },
        { icon: '📡', msg: 'SATELLITE HANDOVER - SAT-4471 entering coverage zone', type: 'info', action: 'INFO' },
        { icon: '🌱', msg: 'HARVEST COMPLETE - Sector 5E - 12.4Mt yield', type: 'info', action: 'LOGGED' }
    ],

    quakeLocations: [
        'Mt. Tharsis [7G]', 'Rift Valley [3C]', 'Coastal Zone [12B]', 'Deep Ocean [9A]',
        'Mountain Chain [5E]', 'Volcanic Arc [2D]', 'Subduction Zone [8F]', 'Hotspot [6A]',
        'Transform Fault [4B]', 'Mid-Ocean Ridge [11C]'
    ],

    satelliteMessages: [
        'Orbital adjust complete', 'Data downlink: 847 GB', 'Thermal nominal',
        'Attitude correction', 'Imaging sequence start', 'Telemetry stable',
        'Battery charging', 'Signal strength optimal', 'Course correction delta-v: 0.4m/s'
    ],

    init: function() {
        this.generateCityGrid();
        this.generateResourceGrid();
        this.generateSeaLevelGraph();
        this.startRealTimeUpdates();
        this.startAnimations();
        this.bindEvents();
    },

    generateCityGrid: function() {
        const grid = document.getElementById('city-grid');
        if (!grid) return;
        
        grid.innerHTML = this.cityData.map((city, i) => `
            <div class="city-item">
                <span class="city-rank">${i + 1}.</span>
                <span class="city-name">${city.name}</span>
                <span class="city-pop">${city.pop}M</span>
                <span class="city-trend ${city.trend}">${city.trend === 'up' ? '↑' : city.trend === 'down' ? '↓' : '→'}</span>
            </div>
        `).join('');
    },

    generateResourceGrid: function() {
        const grid = document.getElementById('resource-grid');
        if (!grid) return;
        
        let html = '';
        for (let i = 0; i < 200; i++) {
            const type = Math.random();
            let colorClass = '';
            if (type < 0.25) colorClass = 'background: rgba(255,200,0,0.3)';
            else if (type < 0.5) colorClass = 'background: rgba(168,64,255,0.3)';
            else if (type < 0.75) colorClass = 'background: rgba(64,160,255,0.3)';
            else colorClass = 'background: rgba(64,255,128,0.3)';
            html += `<div style="${colorClass}; border-radius: 1px;"></div>`;
        }
        grid.innerHTML = html;
    },

    generateSeaLevelGraph: function() {
        const graph = document.getElementById('sealvl-graph');
        if (!graph) return;
        
        let bars = '';
        for (let i = 0; i < 50; i++) {
            const height = 20 + Math.sin(i * 0.2) * 15 + Math.random() * 10 + i * 0.3;
            const color = i > 40 ? '#ff4060' : i > 30 ? '#ffc800' : '#00ffa8';
            bars += `<div style="width: 2px; height: ${height}%; background: ${color}; position: absolute; bottom: 0; left: ${i * 2}%"></div>`;
        }
        graph.innerHTML = bars;
    },

    startRealTimeUpdates: function() {
        setInterval(() => {
            this.updateTime();
            this.updatePopulation();
            this.updateTickers();
            this.updateQuakeFeed();
            this.updateSatelliteFeed();
            this.updateAlerts();
            this.updateStats();
        }, 1000);

        setInterval(() => {
            this.updateSeaLevelGraph();
            this.updateResourceGrid();
        }, 5000);
    },

    updateTime: function() {
        const realTimeEl = document.getElementById('real-time');
        const simTimeEl = document.getElementById('sim-time');
        
        if (realTimeEl) {
            const now = new Date();
            realTimeEl.textContent = now.toTimeString().split(' ')[0];
        }
        
        if (simTimeEl) {
            this.state.simTime.second++;
            if (this.state.simTime.second >= 60) {
                this.state.simTime.second = 0;
                this.state.simTime.minute++;
                if (this.state.simTime.minute >= 60) {
                    this.state.simTime.minute = 0;
                    this.state.simTime.hour++;
                    if (this.state.simTime.hour >= 24) {
                        this.state.simTime.hour = 0;
                        this.state.simTime.day++;
                        if (this.state.simTime.day >= 365) {
                            this.state.simTime.day = 1;
                            this.state.simTime.year++;
                        }
                    }
                }
            }
            const { year, day, hour, minute, second } = this.state.simTime;
            simTimeEl.textContent = `${year}.${String(day).padStart(3, '0')}.${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        }
    },

    updatePopulation: function() {
        this.state.population += Math.floor(Math.random() * 5 - 1);
        
        const popTotal = document.getElementById('pop-total');
        const popTicker = document.getElementById('pop-ticker');
        
        if (popTotal) {
            popTotal.textContent = this.state.population.toLocaleString();
        }
        if (popTicker) {
            popTicker.textContent = this.state.population.toLocaleString();
        }
    },

    updateTickers: function() {
        this.state.temperature += (Math.random() - 0.5) * 0.01;
        this.state.co2 += (Math.random() - 0.5) * 0.1;
        this.state.seaLevel += (Math.random() - 0.5) * 0.001;
        this.state.energy += (Math.random() - 0.5) * 1;
        this.state.trade += (Math.random() - 0.5) * 0.1;
        
        const tempTicker = document.getElementById('temp-ticker');
        const co2Ticker = document.getElementById('co2-ticker');
        const seaTicker = document.getElementById('sea-ticker');
        const energyTicker = document.getElementById('energy-ticker');
        const tradeTicker = document.getElementById('trade-ticker');
        
        if (tempTicker) tempTicker.textContent = this.state.temperature.toFixed(2) + '°C';
        if (co2Ticker) co2Ticker.textContent = this.state.co2.toFixed(1) + 'ppm';
        if (seaTicker) seaTicker.textContent = '+' + this.state.seaLevel.toFixed(2) + 'm';
        if (energyTicker) energyTicker.textContent = this.state.energy.toFixed(1) + 'PW';
        if (tradeTicker) tradeTicker.textContent = '$' + this.state.trade.toFixed(1) + 'T';
    },

    updateQuakeFeed: function() {
        const feed = document.getElementById('quake-feed');
        const count = document.getElementById('quake-count');
        
        if (Math.random() > 0.7 && feed) {
            const mag = Math.random() * 7;
            let magClass = 'mag-low';
            if (mag > 5) magClass = 'mag-high';
            else if (mag > 3) magClass = 'mag-mid';
            
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            
            const newItem = document.createElement('div');
            newItem.className = 'feed-item';
            newItem.innerHTML = `
                <span class="feed-time">${timeStr}</span>
                <span class="feed-mag ${magClass}">${mag.toFixed(1)}</span>
                <span class="feed-loc">${this.quakeLocations[Math.floor(Math.random() * this.quakeLocations.length)]}</span>
                <span class="feed-depth">${Math.floor(Math.random() * 100 + 1)}km</span>
            `;
            
            feed.insertBefore(newItem, feed.firstChild);
            
            if (feed.children.length > 10) {
                feed.removeChild(feed.lastChild);
            }
            
            this.state.earthquakes++;
        }
        
        if (count) {
            count.textContent = this.state.earthquakes.toLocaleString() + ' today';
        }
    },

    updateSatelliteFeed: function() {
        const feed = document.getElementById('sat-feed');
        const activeCount = document.getElementById('sat-active');
        
        if (Math.random() > 0.6 && feed) {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            const satId = Math.floor(Math.random() * 9000) + 1000;
            
            const newItem = document.createElement('div');
            newItem.className = 'sf-item';
            newItem.innerHTML = `
                <span class="sf-time">${timeStr}</span>
                <span class="sf-sat">SAT-${satId}</span>
                <span class="sf-msg">${this.satelliteMessages[Math.floor(Math.random() * this.satelliteMessages.length)]}</span>
            `;
            
            feed.insertBefore(newItem, feed.firstChild);
            
            if (feed.children.length > 8) {
                feed.removeChild(feed.lastChild);
            }
        }
        
        if (activeCount) {
            if (Math.random() > 0.95) {
                this.state.satellites += Math.random() > 0.5 ? 1 : -1;
            }
            activeCount.textContent = this.state.satellites.toLocaleString();
        }
    },

    updateAlerts: function() {
        const feed = document.getElementById('alert-feed');
        
        if (Math.random() > 0.85 && feed) {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            
            const alertTypes = [
                { icon: '🌡️', msg: 'TEMPERATURE ANOMALY - Sector ' + Math.floor(Math.random() * 20) + ' - ' + (Math.random() * 20 + 30).toFixed(1) + '°C', type: 'warning', action: 'MONITORING' },
                { icon: '📡', msg: 'COMMUNICATION DISRUPTION - Relay ' + Math.floor(Math.random() * 100), type: 'warning', action: 'REDIRECT' },
                { icon: '🚨', msg: 'SECURITY BREACH - Zone ' + Math.floor(Math.random() * 10) + ' - Investigating', type: 'critical', action: 'ALERT' },
                { icon: '🌿', msg: 'ECOSYSTEM SHIFT - Biome ' + Math.floor(Math.random() * 50) + ' - Species migration detected', type: 'info', action: 'LOGGED' },
                { icon: '⚡', msg: 'POWER FLUCTUATION - Grid ' + Math.floor(Math.random() * 20) + ' - Stabilizing', type: 'warning', action: 'COMPENSATING' },
                { icon: '💨', msg: 'STORM ALERT - Cyclone forming in Sector ' + Math.floor(Math.random() * 15), type: 'warning', action: 'TRACKING' }
            ];
            
            const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            
            const newItem = document.createElement('div');
            newItem.className = `alert-item ${alert.type}`;
            newItem.innerHTML = `
                <span class="alert-time">${timeStr}</span>
                <span class="alert-icon">${alert.icon}</span>
                <span class="alert-msg">${alert.msg}</span>
                <span class="alert-action">${alert.action}</span>
            `;
            
            feed.insertBefore(newItem, feed.firstChild);
            
            if (feed.children.length > 12) {
                feed.removeChild(feed.lastChild);
            }
        }
    },

    updateStats: function() {
        const criticalCount = document.getElementById('critical-count');
        const warningCount = document.getElementById('warning-count');
        const nominalCount = document.getElementById('nominal-count');
        
        if (criticalCount) {
            const val = parseInt(criticalCount.textContent.replace(',', ''));
            criticalCount.textContent = Math.max(0, val + Math.floor(Math.random() * 3) - 1);
        }
        
        if (warningCount) {
            const val = parseInt(warningCount.textContent.replace(',', ''));
            warningCount.textContent = Math.max(0, val + Math.floor(Math.random() * 5) - 2);
        }
    },

    updateSeaLevelGraph: function() {
        const graph = document.getElementById('sealvl-graph');
        if (!graph) return;
        
        this.generateSeaLevelGraph();
    },

    updateResourceGrid: function() {
        this.generateResourceGrid();
    },

    startAnimations: function() {
        this.animatePlanet();
        this.animateTradeRoutes();
        this.animateVolcanoes();
    },

    animatePlanet: function() {
        const planet = document.querySelector('.planet-sphere');
        if (!planet) return;
        
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            planet.style.transform = `rotate(${rotation}deg)`;
        }, 100);
    },

    animateTradeRoutes: function() {
        const routesContainer = document.getElementById('trade-routes');
        if (!routesContainer) return;
        
        const routes = [
            { x1: 12, y1: 35, x2: 75, y2: 30 },
            { x1: 75, y1: 30, x2: 58, y2: 40 },
            { x1: 45, y1: 25, x2: 12, y2: 35 },
            { x1: 58, y1: 40, x2: 45, y2: 25 },
            { x1: 18, y1: 32, x2: 58, y2: 40 }
        ];
        
        let svg = `<svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">`;
        routes.forEach((route, i) => {
            const animDelay = Math.random() * 3;
            svg += `
                <line x1="${route.x1}%" y1="${route.y1}%" x2="${route.x2}%" y2="${route.y2}%" 
                      stroke="#00ffa8" stroke-width="1" stroke-dasharray="5,5" opacity="0.4">
                    <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" begin="${animDelay}s"/>
                </line>
            `;
        });
        svg += '</svg>';
        routesContainer.innerHTML = svg;
    },

    animateVolcanoes: function() {
        const volcanoLayer = document.getElementById('volcano-layer');
        if (!volcanoLayer) return;
        
        const volcanoes = [];
        for (let i = 0; i < 8; i++) {
            volcanoes.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                active: Math.random() > 0.6
            });
        }
        
        let html = '';
        volcanoes.forEach(v => {
            const color = v.active ? '#ff4060' : '#ffc800';
            const size = v.active ? 8 : 5;
            html += `
                <div style="position: absolute; left: ${v.x}%; top: ${v.y}%; width: ${size}px; height: ${size}px; 
                            background: ${color}; border-radius: 50%; box-shadow: 0 0 10px ${color};
                            animation: volcano-pulse ${1 + Math.random()}s infinite;"></div>
            `;
        });
        volcanoLayer.innerHTML = html;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes volcano-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents: function() {
        const ctrlBtns = document.querySelectorAll('.ctrl-btn');
        ctrlBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.panel-controls');
                if (parent) {
                    parent.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        });

        const plates = document.querySelectorAll('.plate');
        plates.forEach(plate => {
            plate.addEventListener('click', () => {
                const name = plate.dataset.plate;
                plate.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    plate.style.transform = '';
                }, 200);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('Simulation Dashboard - All systems nominal');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SimulationDashboard.init();
});

const TickerAnimation = {
    items: [],
    
    init: function() {
        const tickerScroll = document.querySelector('.ticker-scroll');
        if (!tickerScroll) return;
        
        this.items = Array.from(tickerScroll.children);
        this.items.forEach(item => {
            const clone = item.cloneNode(true);
            tickerScroll.appendChild(clone);
        });
    }
};

const DataVisualizer = {
    createSparkline: function(container, data, color) {
        if (!container) return;
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        let path = '';
        data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((val - min) / range) * 100;
            path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
        });
        
        container.innerHTML = `
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%;">
                <path d="${path}" fill="none" stroke="${color}" stroke-width="2"/>
            </svg>
        `;
    }
};

const StatusMonitor = {
    checkHealth: function() {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            const badge = panel.querySelector('.panel-badge');
            if (badge && badge.classList.contains('live')) {
                badge.style.opacity = badge.style.opacity === '0.5' ? '1' : '0.5';
            }
        });
    },
    
    start: function() {
        setInterval(() => this.checkHealth(), 2000);
    }
};

StatusMonitor.start();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimulationDashboard, TickerAnimation, DataVisualizer, StatusMonitor };
}
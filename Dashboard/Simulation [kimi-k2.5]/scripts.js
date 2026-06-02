// TERRA-SIM v9.2.1 Control Systems
// Global Overview Dashboard Controller

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        population: {
            base: 8142593471,
            birthRate: 2.3,      // per second
            deathRate: 1.8,      // per second
            startTime: Date.now()
        },
        updateIntervals: {
            clock: 50,           // ms
            population: 100,     // ms
            seismic: 3000,       // ms
            weather: 5000,       // ms
            trade: 4000,         // ms
            energy: 2000,        // ms
            alerts: 15000        // ms
        }
    };

    // State Management
    const state = {
        population: CONFIG.population.base,
        alerts: [],
        coordinates: { lat: 35.6762, lon: 139.6503, alt: 0 },
        globeRotation: 0,
        activeStorms: 3,
        seismicActivity: []
    };

    // Utility Functions
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(Math.floor(num));
    const formatDecimal = (num, dec = 1) => num.toFixed(dec);
    const randomRange = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // UTC Clock with milliseconds
    function updateClock() {
        const now = new Date();
        const iso = now.toISOString();
        const formatted = iso.replace('T', ' ').replace('Z', '').slice(0, -4) + ' UTC';
        const element = document.getElementById('utc-clock');
        if (element) {
            element.textContent = formatted;
            element.style.color = '#00d4ff';
            setTimeout(() => {
                element.style.color = '#e0e0e0';
            }, 100);
        }
    }

    // Population Simulator (Real-time calculation based on rates)
    function updatePopulation() {
        const elapsed = (Date.now() - CONFIG.population.startTime) / 1000;
        const netGrowth = (CONFIG.population.birthRate - CONFIG.population.deathRate) * elapsed;
        const currentPop = CONFIG.population.base + netGrowth;
        
        const popElement = document.getElementById('world-pop');
        if (popElement) {
            popElement.textContent = formatNumber(currentPop);
            
            // Visual pulse on update
            if (Math.floor(Date.now() / 1000) % 2 === 0) {
                popElement.style.textShadow = '0 0 30px rgba(0, 212, 255, 0.8)';
            } else {
                popElement.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
            }
        }
    }

    // Seismic Activity Generator
    const locations = [
        { name: '35.6762°N 139.6503°E', region: 'Tokyo' },
        { name: '37.7749°N 122.4194°W', region: 'San Francisco' },
        { name: '3.4653°S 62.2159°W', region: 'Amazon' },
        { name: '64.1466°N 21.9426°W', region: 'Iceland' },
        { name: '28.3949°N 84.1240°E', region: 'Himalaya' },
        { name: '34.0522°N 118.2437°W', region: 'Los Angeles' },
        { name: '19.4326°N 99.1332°W', region: 'Mexico City' },
        { name: '41.9028°N 12.4964°E', region: 'Rome' }
    ];

    function generateSeismicEvent() {
        const tbody = document.querySelector('#seismic-stream');
        if (!tbody) return;

        const mag = randomRange(1.0, 6.5);
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const depth = randomInt(2, 60);
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

        let magClass = 'mag-1';
        if (mag >= 6) magClass = 'mag-6';
        else if (mag >= 5) magClass = 'mag-5';
        else if (mag >= 4) magClass = 'mag-4';
        else if (mag >= 3) magClass = 'mag-3';
        else if (mag >= 2) magClass = 'mag-2';

        let statusClass = 'status-ok';
        let statusText = '●';
        if (mag >= 5) {
            statusClass = 'status-alert';
            triggerAlert(`SEISMIC EVENT M${mag.toFixed(1)} - ${loc.region}`);
        } else if (mag >= 3.5) {
            statusClass = 'status-warn';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="${magClass}">${mag.toFixed(1)}</td>
            <td>${loc.name}</td>
            <td>${depth}km</td>
            <td>${timeStr}</td>
            <td class="${statusClass}">${statusText}</td>
        `;

        tbody.insertBefore(row, tbody.firstChild);
        if (tbody.children.length > 6) {
            tbody.removeChild(tbody.lastChild);
        }
    }

    // Storm Tracker Updates
    function updateStorms() {
        const windElements = document.querySelectorAll('.s-wind');
        const presElements = document.querySelectorAll('.s-pres');
        
        windElements.forEach(el => {
            const base = parseInt(el.textContent) || 100;
            const variation = randomInt(-5, 5);
            el.textContent = `${base + variation} km/h`;
        });

        presElements.forEach(el => {
            const base = parseInt(el.textContent) || 980;
            const variation = randomInt(-2, 2);
            el.textContent = `${base + variation} hPa`;
        });
    }

    // Energy Grid Fluctuations
    function updateEnergyGrid() {
        const loadFill = document.querySelector('.load-fill');
        if (loadFill) {
            const variation = randomInt(-2, 3);
            const currentLoad = 89 + variation;
            loadFill.style.width = `${currentLoad}%`;
            
            const loadVal = document.querySelector('.load-val');
            if (loadVal) loadVal.textContent = `${currentLoad}.2%`;
            
            if (currentLoad > 90) {
                loadFill.style.background = 'linear-gradient(90deg, #ff2244, #ff8800)';
                if (Math.random() > 0.95) triggerAlert('GRID LOAD CRITICAL: >90%');
            } else {
                loadFill.style.background = 'linear-gradient(90deg, #00ff88, #ffdd00 70%, #ff2244 100%)';
            }
        }
    }

    // Trade Route Congestion Simulator
    function updateTradeRoutes() {
        const congestions = document.querySelectorAll('.node-congestion');
        const states = ['●●●●●', '●●●●○', '●●●○○', '●●○○○', '●○○○○', '●●●●●'];
        
        congestions.forEach(el => {
            if (Math.random() > 0.7) {
                el.textContent = states[Math.floor(Math.random() * states.length)];
            }
        });
    }

    // Globe Coordinate Tracking
    function updateGlobeCoords() {
        const coordDisplay = document.getElementById('cursor-coords');
        if (coordDisplay) {
            // Simulate slow drift of coordinates
            state.coordinates.lat += randomRange(-0.1, 0.1);
            state.coordinates.lon += randomRange(-0.1, 0.1);
            
            // Wrap coordinates
            if (state.coordinates.lat > 90) state.coordinates.lat = -90;
            if (state.coordinates.lat < -90) state.coordinates.lat = 90;
            if (state.coordinates.lon > 180) state.coordinates.lon = -180;
            if (state.coordinates.lon < -180) state.coordinates.lon = 180;
            
            const latStr = `${Math.abs(state.coordinates.lat).toFixed(4)} ${state.coordinates.lat >= 0 ? 'N' : 'S'}`;
            const lonStr = `${Math.abs(state.coordinates.lon).toFixed(4)} ${state.coordinates.lon >= 0 ? 'E' : 'W'}`;
            
            coordDisplay.textContent = `LAT: ${latStr} | LON: ${lonStr} | ALT: ${Math.floor(randomInt(0, 5000))}m`;
        }
    }

    // ASCII Globe Rotation Effect
    function rotateASCIIGlobe() {
        const globe = document.getElementById('rotating-globe');
        if (globe) {
            state.globeRotation = (state.globeRotation + 1) % 360;
            // Subtle transform for 3D effect
            globe.style.transform = `perspective(1000px) rotateY(${state.globeRotation * 0.1}deg)`;
            
            // Occasionally swap characters to simulate surface activity
            if (state.globeRotation % 50 === 0) {
                const chars = ['🌊', '🏔️', '🏜️', '🌳', '🏙️', '🌊', '⛰️', '🏝️'];
                let content = globe.textContent;
                const randomPos = Math.floor(Math.random() * content.length);
                const randomChar = chars[Math.floor(Math.random() * chars.length)];
                // Simple character replacement for visual effect
                if (content[randomPos] !== '\n' && content[randomPos] !== ' ' && content[randomPos] !== '.' && content[randomPos] !== '-') {
                    // Note: This is a visual hack - full replacement would require maintaining state
                }
            }
        }
    }

    // Alert System
    function triggerAlert(message) {
        const alertQueue = document.querySelector('.status-warning');
        if (alertQueue) {
            alertQueue.textContent = `${Math.floor(Math.random() * 5) + 1} ⚠️`;
            alertQueue.classList.add('glitch');
            setTimeout(() => alertQueue.classList.remove('glitch'), 1000);
        }
        
        console.warn(`TERRA-SIM ALERT: ${message}`);
        
        // Flash header
        const header = document.querySelector('.sys-header');
        if (header) {
            header.style.boxShadow = '0 0 20px rgba(255, 34, 68, 0.5)';
            setTimeout(() => {
                header.style.boxShadow = 'none';
            }, 500);
        }
    }

    // Ticker Speed Control
    function adjustTickerSpeed() {
        const ticker = document.querySelector('.ticker');
        if (ticker && Math.random() > 0.95) {
            const speed = randomInt(20, 40);
            ticker.style.animationDuration = `${speed}s`;
        }
    }

    // Atmospheric CO2 Fluctuation
    function updateAtmosphere() {
        const co2Element = document.querySelector('.co2-fill');
        if (co2Element) {
            const baseWidth = 0.042;
            const fluctuation = randomRange(-0.002, 0.005);
            co2Element.style.width = `${(baseWidth + fluctuation)}%`;
        }
    }

    // Magnetic Field Monitor
    let magneticField = 25000;
    function updateMagneticField() {
        const variation = randomInt(-50, 50);
        magneticField += variation;
        // Update would go to specific element if displayed
    }

    // Solar Activity
    function updateSolarActivity() {
        if (Math.random() > 0.99) {
            triggerAlert('SOLAR FLARE DETECTED: M-CLASS EVENT');
        }
    }

    // Interactive Hover Effects for Panels
    function initInteractions() {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.style.zIndex = '100';
            });
            panel.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    panel.style.zIndex = '';
                }, 300);
            });
        });

        // Seismic table row interaction
        const seismicTable = document.querySelector('.seismic-table');
        if (seismicTable) {
            seismicTable.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row) {
                    row.style.background = 'rgba(0, 212, 255, 0.2)';
                    setTimeout(() => {
                        row.style.background = '';
                    }, 1000);
                }
            });
        }
    }

    // Initialize all systems
    function init() {
        console.log('🌍 TERRA-SIM v9.2.1 INITIALIZED');
        console.log('Target: Earth-Prime | Resolution: 4K Optimized');
        
        // Start loops
        setInterval(updateClock, CONFIG.updateIntervals.clock);
        setInterval(updatePopulation, CONFIG.updateIntervals.population);
        setInterval(generateSeismicEvent, CONFIG.updateIntervals.seismic);
        setInterval(updateStorms, CONFIG.updateIntervals.weather);
        setInterval(updateEnergyGrid, CONFIG.updateIntervals.energy);
        setInterval(updateTradeRoutes, CONFIG.updateIntervals.trade);
        setInterval(updateGlobeCoords, 200);
        setInterval(rotateASCIIGlobe, 100);
        setInterval(adjustTickerSpeed, 10000);
        setInterval(updateAtmosphere, 5000);
        setInterval(updateMagneticField, 3000);
        setInterval(updateSolarActivity, 5000);
        setInterval(() => triggerAlert('ROUTINE SYSTEM CHECK'), 60000);

        // Initial calls
        updateClock();
        updatePopulation();
        initInteractions();

        // Random alert simulation
        setTimeout(() => {
            triggerAlert('MAGNETIC FIELD ANOMALY DETECTED: SOUTH ATLANTIC');
        }, 5000);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose emergency controls to window for debugging
    window.TerraSim = {
        status: () => console.log('System Optimal | Load: 94.2%'),
        triggerAlert: triggerAlert,
        getPopulation: () => state.population,
        forceSeismic: generateSeismicEvent
    };

})();
/**
 * PLANET-9 Global Simulation Matrix
 * Interactive Dashboard JavaScript
 * Optimized for 4K displays with high information density
 */
(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        simSpeed: 1,
        startDate: new Date('2847-06-15T09:42:00'),
        population: 8742156847,
        birthRate: 284719 / 86400,
        deathRate: 118432 / 86400,
        updateInterval: 1000
    };

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const State = {
        simTime: new Date(CONFIG.startDate),
        lastUpdate: Date.now(),
        tickCount: 0
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function formatNumber(num, decimals = 0) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomBetween(min, max + 1));
    }

    // ============================================
    // SIMULATION TIME
    // ============================================
    function updateSimulationTime() {
        const now = Date.now();
        const delta = (now - State.lastUpdate) * CONFIG.simSpeed;
        State.simTime = new Date(State.simTime.getTime() + delta);
        State.lastUpdate = now;
        State.tickCount++;

        const year = State.simTime.getFullYear();
        const dayOfYear = Math.floor((State.simTime - new Date(year, 0, 0)) / 86400000);
        const hours = padZero(State.simTime.getHours());
        const minutes = padZero(State.simTime.getMinutes());
        const seconds = padZero(State.simTime.getSeconds());

        document.getElementById('simTime').textContent = `${year}.${dayOfYear}.${hours}:${minutes}:${seconds}`;
    }

    // ============================================
    // POPULATION COUNTER
    // ============================================
    function updatePopulation() {
        const births = CONFIG.birthRate * CONFIG.simSpeed;
        const deaths = CONFIG.deathRate * CONFIG.simSpeed;
        CONFIG.population += births - deaths;

        const counter = document.getElementById('popCounter');
        const stat = document.getElementById('populationStat');

        if (counter) {
            counter.textContent = formatNumber(Math.floor(CONFIG.population));
            counter.classList.add('data-updated');
            setTimeout(() => counter.classList.remove('data-updated'), 500);
        }
        if (stat) {
            stat.textContent = (CONFIG.population / 1e12).toFixed(3) + 'T';
        }
    }

    // ============================================
    // SEISMIC FEED SIMULATION
    // ============================================
    const earthquakeLocations = [
        'Pacific Ring',
        'Himalayan Zone',
        'Mid-Atlantic Ridge',
        'Alpine Fault NZ',
        'Cascadia Subduction',
        'Andean Margin',
        'Java Trench',
        'Mariana Trench',
        'San Andreas',
        'East African Rift'
    ];

    const earthquakeDepths = [15, 22, 28, 34, 42, 55, 68, 75, 89, 95, 112, 125, 145];

    function generateEarthquake() {
        const magnitude = randomBetween(2.5, 7.8);
        const location = earthquakeLocations[randomInt(0, earthquakeLocations.length - 1)];
        const depth = earthquakeDepths[randomInt(0, earthquakeDepths.length - 1)];
        return {
            magnitude: magnitude.toFixed(1),
            location: location,
            depth: depth,
            time: 'JUST NOW'
        };
    }

    function addEarthquakeToFeed() {
        const feed = document.getElementById('seismicFeed');
        if (!feed) return;

        const earthquake = generateEarthquake();
        const severityClass = earthquake.magnitude >= 7 ? 'major' :
                             earthquake.magnitude >= 6 ? 'significant' :
                             earthquake.magnitude >= 5 ? 'moderate' : 'minor';

        const item = document.createElement('div');
        item.className = 'feed-item ' + severityClass;
        item.innerHTML = '<span class="quake-mag">' + earthquake.magnitude + '</span>' +
                         '<span class="quake-loc">' + earthquake.location + '</span>' +
                         '<span class="quake-depth">' + earthquake.depth + 'km</span>' +
                         '<span class="quake-time">' + earthquake.time + '</span>';

        feed.insertBefore(item, feed.firstChild);

        while (feed.children.length > 8) {
            feed.removeChild(feed.lastChild);
        }

        for (let i = 1; i < feed.children.length; i++) {
            const timeEl = feed.children[i].querySelector('.quake-time');
            if (timeEl) {
                const mins = parseInt(timeEl.textContent) || 0;
                timeEl.textContent = (mins + 1) + 'm ago';
            }
        }
    }

    // ============================================
    // WEATHER SYSTEMS SIMULATION
    // ============================================
    function updateWeatherSystems() {
        const systems = document.querySelectorAll('.ws-item');
        systems.forEach(function(sys) {
            const offsetX = randomBetween(-2, 2);
            const offsetY = randomBetween(-2, 2);
            const currentLeft = parseFloat(sys.style.left) || 0;
            const currentTop = parseFloat(sys.style.top) || 0;
            sys.style.left = Math.max(5, Math.min(90, currentLeft + offsetX)) + '%';
            sys.style.top = Math.max(10, Math.min(85, currentTop + offsetY)) + '%';
        });
    }

    // ============================================
    // CHARTS INITIALIZATION
    // ============================================
    let charts = {};

    function initCharts() {
        Chart.defaults.color = '#8b949e';
        Chart.defaults.borderColor = '#30363d';
        Chart.defaults.font.family = "'JetBrains Mono', monospace";
        Chart.defaults.font.size = 9;

        initDemographicsChart();
        initPHChart();
        initTradeChart();
        initGovTypeChart();
    }

    function initDemographicsChart() {
        const ctx = document.getElementById('agePyramidCanvas');
        if (!ctx) return;

        const maleData = [8.2, 9.1, 8.8, 8.5, 7.2, 5.8, 3.4, 1.8, 0.6, 0.2];
        const femaleData = [7.8, 8.7, 8.4, 8.1, 6.9, 5.5, 3.2, 1.7, 0.5, 0.2];

        charts.demographics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-4', '5-9', '10-14', '15-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
                datasets: [
                    {
                        label: 'Male',
                        data: maleData,
                        backgroundColor: 'rgba(0, 170, 255, 0.7)',
                        borderRadius: 2
                    },
                    {
                        label: 'Female',
                        data: femaleData.map(function(v) { return -v; }),
                        backgroundColor: 'rgba(255, 102, 170, 0.7)',
                        borderRadius: 2
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { callback: function(v) { return Math.abs(v) + '%'; } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 7 } }
                    }
                }
            }
        });
    }

    function initPHChart() {
        const ctx = document.getElementById('phChartCanvas');
        if (!ctx) return;

        charts.ph = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Surface', '200m', '500m', '1000m', '2000m', 'Deep'],
                datasets: [{
                    data: [8.15, 8.12, 8.08, 8.02, 7.95, 7.88],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#00d4ff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        min: 7.7,
                        max: 8.3,
                        grid: { color: 'rgba(48, 54, 61, 0.5)' },
                        ticks: { font: { size: 7 } }
                    }
                }
            }
        });
    }

    function initTradeChart() {
        const ctx = document.getElementById('tradeChartCanvas');
        if (!ctx) return;

        charts.trade = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['NA', 'EU', 'AS', 'ME', 'AF', 'SA', 'OC'],
                datasets: [
                    {
                        label: 'Exports',
                        data: [2.1, 1.8, 3.2, 0.9, 0.4, 0.5, 0.6],
                        backgroundColor: 'rgba(0, 255, 136, 0.7)',
                        borderRadius: 2
                    },
                    {
                        label: 'Imports',
                        data: [1.9, 1.7, 2.8, 0.8, 0.5, 0.6, 0.7],
                        backgroundColor: 'rgba(255, 51, 102, 0.7)',
                        borderRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 7 } } },
                    y: { display: false }
                }
            }
        });
    }

    function initGovTypeChart() {
        const ctx = document.getElementById('govTypeCanvas');
        if (!ctx) return;

        charts.gov = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Democratic', 'Republic', 'Monarchy', 'Theocratic', 'Dictatorship'],
                datasets: [{
                    data: [45, 28, 12, 8, 7],
                    backgroundColor: ['#00d4ff', '#00ff88', '#ffaa00', '#aa66ff', '#ff3366'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 8, padding: 4, font: { size: 7 } }
                    }
                }
            }
        });
    }

    // ============================================
    // TICKER ANIMATION
    // ============================================
    function initTicker() {
        const ticker = document.getElementById('newsTicker');
        if (!ticker) return;
        const content = ticker.innerHTML;
        ticker.innerHTML = content + content;
    }

    // ============================================
    // INTERACTIVE ELEMENTS
    // ============================================
    function initViewControls() {
        const buttons = document.querySelectorAll('.vc-btn');
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                buttons.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
            });
        });
    }

    function initLocationHover() {
        const regions = document.querySelectorAll('.map-region');
        const locationInfo = document.getElementById('locationInfo');

        const locationData = {
            'na': { name: 'North America', region: 'Western Hemisphere', temp: '12C', condition: 'Partly Cloudy', pop: '578M', alt: '1,500m' },
            'eu': { name: 'Europe', region: 'Northern Hemisphere', temp: '11C', condition: 'Overcast', pop: '748M', alt: '340m' },
            'asia': { name: 'Asia', region: 'Eastern Hemisphere', temp: '18C', condition: 'Rainy', pop: '4.7B', alt: '950m' },
            'africa': { name: 'Africa', region: 'Southern Hemisphere', temp: '24C', condition: 'Clear', pop: '1.4B', alt: '590m' },
            'sa': { name: 'South America', region: 'Western Hemisphere', temp: '22C', condition: 'Tropical', pop: '430M', alt: '640m' },
            'oceania': { name: 'Oceania', region: 'Pacific Region', temp: '20C', condition: 'Coastal', pop: '45M', alt: '200m' }
        };

        regions.forEach(function(region) {
            region.addEventListener('mouseenter', function() {
                const regionClass = Array.from(this.classList).find(function(c) { return c !== 'map-region'; });
                if (regionClass && locationData[regionClass]) {
                    const data = locationData[regionClass];
                    locationInfo.innerHTML = '<span class="loc-name">' + data.name + '</span>' +
                                             '<span class="loc-region">' + data.region + '</span>' +
                                             '<div class="loc-weather"><span class="loc-temp">' + data.temp + '</span></div>' +
                                             '<div class="loc-details"><span>Pop: ' + data.pop + '</span><span>Alt: ' + data.alt + '</span></div>';
                }
            });
        });
    }

    // ============================================
    // CONTROL BUTTONS
    // ============================================
    function initControls() {
        const fullscreenBtn = document.querySelector('.ctrl-btn[title="Fullscreen"]');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        const timeAccel = document.getElementById('timeAccel');
        if (timeAccel) {
            timeAccel.addEventListener('click', cycleTimeAccel);
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function() {});
        } else {
            document.exitFullscreen();
        }
    }

    function cycleTimeAccel() {
        const accelerations = [1, 2, 5, 10, 50, 100, 1000];
        const currentIndex = accelerations.indexOf(CONFIG.simSpeed);
        const nextIndex = (currentIndex + 1) % accelerations.length;
        CONFIG.simSpeed = accelerations[nextIndex];
        document.getElementById('timeAccel').textContent = 'x' + CONFIG.simSpeed;
    }

    // ============================================
    // DYNAMIC DATA UPDATES
    // ============================================
    function updateVolcanoActivity() {
        const volcanoItems = document.querySelectorAll('.volcano-item');
        volcanoItems.forEach(function(item) {
            const fill = item.querySelector('.volc-fill');
            if (fill) {
                const currentWidth = parseFloat(fill.style.width) || 50;
                const change = randomBetween(-2, 2);
                const newWidth = Math.max(10, Math.min(100, currentWidth + change));
                fill.style.width = newWidth + '%';
            }
        });
    }

    function updateMarketData() {
        const marketValues = document.querySelectorAll('.ei-value');
        marketValues.forEach(function(el) {
            const change = randomBetween(-0.5, 0.8);
            el.classList.toggle('up', change > 0);
            el.classList.toggle('down', change <= 0);
        });
    }

    function updateWeatherAlerts() {
        const alerts = document.querySelectorAll('.walt');
        const alertTypes = [
            { class: 'red', text: 'RED FLAG', locations: ['CA', 'AZ', 'NV'] },
            { class: 'orange', text: 'SEVERE TSTM', locations: ['TX', 'OK', 'KS'] },
            { class: 'yellow', text: 'FLOOD WATCH', locations: ['NC', 'SC', 'GA'] },
            { class: 'blue', text: 'BLIZZARD', locations: ['AK', 'MT', 'WY'] },
            { class: 'purple', text: 'TYPHOON', locations: ['JP', 'KR', 'PH'] }
        ];

        alerts.forEach(function(alert, i) {
            const type = alertTypes[i % alertTypes.length];
            alert.className = 'walt ' + type.class;
            alert.textContent = type.text + ' ' + type.locations[randomInt(0, 2)];
        });
    }

    function updateEnergyGrid() {
        const gridItems = document.querySelectorAll('.egr-item');
        gridItems.forEach(function(item) {
            const loadEl = item.querySelector('.egr-load');
            const fillEl = item.querySelector('.egr-fill');
            if (loadEl && fillEl) {
                const currentLoad = parseInt(loadEl.textContent) || 50;
                const change = randomBetween(-3, 3);
                const newLoad = Math.max(30, Math.min(95, currentLoad + change));
                loadEl.textContent = newLoad + '%';
                fillEl.style.width = newLoad + '%';
                fillEl.classList.toggle('high', newLoad >= 80);
            }
        });
    }

    function updateTemperature() {
        const pmValues = document.querySelectorAll('.pm-value');
        const tempEl = pmValues[0];
        if (tempEl) {
            const currentTemp = parseFloat(tempEl.textContent) || 14.7;
            const change = randomBetween(-0.1, 0.1);
            const newTemp = Math.max(10, Math.min(20, currentTemp + change));
            tempEl.textContent = newTemp.toFixed(1) + 'C';
        }
    }

    function updateOrbitalData() {
        const sunriseEl = document.getElementById('sunriseTime');
        const sunsetEl = document.getElementById('sunsetTime');
        const noonEl = document.getElementById('solarNoon');

        if (sunriseEl && sunsetEl && noonEl) {
            const sunriseMinutes = 6 * 60 + 42 + randomInt(-2, 2);
            const sunsetMinutes = 18 * 60 + 52 + randomInt(-2, 2);
            const sunriseHours = Math.floor(sunriseMinutes / 60);
            const sunriseMins = sunriseMinutes % 60;
            const sunsetHours = Math.floor(sunsetMinutes / 60);
            const sunsetMins = sunsetMinutes % 60;

            sunriseEl.textContent = padZero(sunriseHours) + ':' + padZero(sunriseMins) + ' UTC';
            sunsetEl.textContent = padZero(sunsetHours) + ':' + padZero(sunsetMins) + ' UTC';

            const noonMinutes = (sunriseMinutes + sunsetMinutes) / 2;
            const noonHours = Math.floor(noonMinutes / 60);
            const noonMins = Math.floor(noonMinutes % 60);
            noonEl.textContent = padZero(noonHours) + ':' + padZero(noonMins) + ' UTC';
        }
    }

    // ============================================
    // AMBIENT ANIMATIONS
    // ============================================
    function pulseDataElements() {
        document.querySelectorAll('.panel-badge.alert').forEach(function(el) {
            el.style.opacity = (0.7 + Math.sin(State.tickCount * 0.1) * 0.3).toFixed(2);
        });
    }

    // ============================================
    // MAIN LOOP
    // ============================================
    function mainLoop() {
        updateSimulationTime();

        if (State.tickCount % 10 === 0) {
            updatePopulation();
        }
        if (State.tickCount % 5 === 0) {
            addEarthquakeToFeed();
            updateWeatherSystems();
        }
        if (State.tickCount % 15 === 0) {
            updateVolcanoActivity();
            updateWeatherAlerts();
        }
        if (State.tickCount % 20 === 0) {
            updateMarketData();
            updateEnergyGrid();
            updateTemperature();
        }
        if (State.tickCount % 30 === 0) {
            updateOrbitalData();
        }
        if (State.tickCount % 100 === 0) {
            updateCharts();
        }

        pulseDataElements();
    }

    function updateCharts() {
        if (charts.ph) {
            const newData = charts.ph.data.datasets[0].data.map(function(v) {
                return v + randomBetween(-0.01, 0.01);
            });
            charts.ph.data.datasets[0].data = newData;
            charts.ph.update('none');
        }
        if (charts.trade) {
            charts.trade.data.datasets.forEach(function(ds) {
                ds.data = ds.data.map(function(v) {
                    return Math.max(0.1, v + randomBetween(-0.2, 0.3));
                });
            });
            charts.trade.update('none');
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        console.log('PLANET-9 Global Simulation Matrix initializing...');
        initCharts();
        initTicker();
        initViewControls();
        initLocationHover();
        initControls();

        setInterval(mainLoop, CONFIG.updateInterval);

        console.log('Dashboard ready. Simulation time: ' + CONFIG.startDate.toISOString());
        console.log('Information density: MAXIMUM');
        console.log('4K Optimization: ACTIVE');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
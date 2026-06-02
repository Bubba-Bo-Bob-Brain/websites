/**
 * TERRA-7 PLANETARY SIMULATION DASHBOARD
 * JavaScript - Interactive Simulation Engine
 * 
 * Handles real-time data simulation, map rendering, event logging,
 * and all dynamic dashboard behaviors.
 */

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const CONFIG = {
    updateIntervals: {
        clock: 1000,
        population: 2000,
        metrics: 5000,
        seismicFeed: 8000,
        eventLog: 4000,
        mapData: 15000,
        economic: 12000,
        weather: 20000
    },
    colors: {
        accent: '#00e5ff',
        secondary: '#00ff88',
        warning: '#ffaa00',
        danger: '#ff3344',
        info: '#00aaff',
        grid: 'rgba(0, 229, 255, 0.12)',
        hotspot: '#ff3344',
        population: '#00f0ff',
        vegetation: '#00ff88',
        arid: '#ffaa00',
        water: '#1a3a5c'
    },
    seismicLocations: [
        { name: 'PACIFIC RING', lat: 34.1, lon: 141.2 },
        { name: 'SAN ANDREAS FAULT', lat: 35.9, lon: -120.6 },
        { name: 'MID-ATLANTIC RIDGE', lat: 28.4, lon: -43.7 },
        { name: 'HIMALAYAN FRONT', lat: 28.2, lon: 84.1 },
        { name: 'JAPAN TRENCH', lat: 37.8, lon: 143.9 },
        { name: 'CASCADIA SUBDUCTION', lat: 46.2, lon: -124.1 },
        { name: 'EAST AFRICAN RIFT', lat: -2.4, lon: 34.7 },
        { name: 'TONGA TRENCH', lat: -20.5, lon: -174.0 },
        { name: 'PERU-CHILE TRENCH', lat: -15.8, lon: -75.4 },
        { name: 'ALEUTIAN TRENCH', lat: 52.3, lon: -168.5 }
    ],
    volcanoes: [
        { name: 'KILAUEA', status: 'ERUPTING', alert: 'CRITICAL' },
        { name: 'POAS', status: 'UNREST', alert: 'WARNING' },
        { name: 'ETNA', status: 'DEGASSING', alert: 'WATCH' },
        { name: 'MERAPI', status: 'ERUPTING', alert: 'CRITICAL' },
        { name: 'FAGRADALSFJALL', status: 'QUIESCENT', alert: 'WATCH' },
        { name: 'POPOCATEPETL', status: 'DEGASSING', alert: 'WARNING' }
    ],
    weatherSystems: [
        { name: 'TYPHOON KROSA', cat: 'CAT 4', wind: 215, lat: 18.4, lon: 134.2 },
        { name: 'MCC COMPLEX', cat: 'SEVERE', wind: 95, lat: 41.2, lon: -96.8 },
        { name: 'HABOOB', cat: 'EXTREME', wind: 120, lat: 24.1, lon: 12.4 },
        { name: 'ATMOSPHERIC RIVER', cat: 'HEAVY', wind: 65, lat: 36.8, lon: -122.1 },
        { name: 'CYCLONE BELAL', cat: 'CAT 2', wind: 155, lat: -18.2, lon: 57.4 }
    ],
    eventTypes: [
        { icon: '🌋', category: 'TECTONIC', templates: [
            'M{mag} earthquake detected at {loc} | Depth: {depth}km',
            'Volcanic activity increase at {volcano} | Alert level: {alert}',
            'Tectonic plate displacement: {disp}mm recorded at {loc}'
        ]},
        { icon: '🌀', category: 'WEATHER', templates: [
            '{system} wind speeds updated to {wind}km/h',
            'Pressure system forming near {loc} | {pressure}hPa',
            'Precipitation alert: {amount}mm expected in {region}'
        ]},
        { icon: '🌊', category: 'OCEANIC', templates: [
            'Sea surface temperature anomaly: +{temp}°C at {loc}',
            'Current velocity change detected in {current}',
            'Wave height alert: {height}m swells approaching {coast}'
        ]},
        { icon: '📊', category: 'ECONOMIC', templates: [
            'Trade volume update: {route} corridor at {volume}',
            'Market fluctuation: {market} {change}',
            'Resource price shift: {resource} now ${price}/unit'
        ]},
        { icon: '🛰️', category: 'NETWORK', templates: [
            'Satellite {sat} orbit adjustment complete',
            'Data throughput spike: {throughput}PB/h detected',
            'Communication relay established at {loc}'
        ]},
        { icon: '🌱', category: 'ENVIRONMENT', templates: [
            'Deforestation rate update: {rate}% change in {region}',
            'Species migration detected: {species} moving {direction}',
            'Carbon sink capacity: {capacity}Mt CO₂ absorbed'
        ]}
    ],
    regions: ['AMAZON BASIN', 'CONGO BASIN', 'SIBERIA', 'SE ASIA', 'CENTRAL AFRICA', 'BAMAKO REGION'],
    species: ['MONARCH BUTTERFLY', 'ARCTIC TERN', 'BLUE WHALE', 'CARIBOU', 'WILDEBEEST', 'SALMON'],
    directions: ['NORTH', 'SOUTHWEST', 'NORTHEAST', 'SOUTH', 'WEST'],
    currents: ['GULF STREAM', 'KUROSHIO', 'ANTARCTIC CIRCUMPOLAR', 'HUMBOLDT', 'AGULHAS'],
    routes: ['ASIA-EUROPE', 'TRANS-PACIFIC', 'TRANS-ATLANTIC', 'ASIA-AMERICAS'],
    markets: ['DOW', 'NASDAQ', 'S&P 500', 'NIKKEI', 'FTSE', 'DAX', 'SHANGHAI'],
    resources: ['CRUDE OIL', 'NATURAL GAS', 'LITHIUM', 'COPPER', 'GOLD', 'IRON ORE']
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
    population: 8142394821,
    popGrowthRate: 2.3,
    simDate: new Date(),
    quakesToday: 847,
    activeVolcanoes: 23,
    shipsAtSea: 52847,
    flightsAirborne: 18293,
    co2Level: 421.7,
    globalTemp: 14.82,
    oceanLevel: 3.6,
    globalGDP: 105.4,
    logCount: 2847,
    mapLayer: 'terrain',
    mapPoints: [],
    eventLog: []
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max));
}

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function generateEventLogEntry() {
    const eventType = randomChoice(CONFIG.eventTypes);
    const template = randomChoice(eventType.templates);
    let message = template;
    
    message = message.replace('{mag}', random(2.0, 6.5).toFixed(1));
    message = message.replace('{loc}', `${random(-60, 60).toFixed(1)}°${random(-180, 180).toFixed(1)}°`);
    message = message.replace('{depth}', randomInt(5, 700));
    message = message.replace('{volcano}', randomChoice(CONFIG.volcanoes).name);
    message = message.replace('{alert}', randomChoice(['LOW', 'MODERATE', 'ELEVATED', 'HIGH']));
    message = message.replace('{disp}', random(0.1, 15.0).toFixed(1));
    message = message.replace('{system}', randomChoice(CONFIG.weatherSystems).name);
    message = message.replace('{wind}', randomInt(50, 280));
    message = message.replace('{pressure}', randomInt(900, 1030));
    message = message.replace('{amount}', randomInt(10, 150));
    message = message.replace('{region}', randomChoice(CONFIG.regions));
    message = message.replace('{temp}', random(0.1, 2.5).toFixed(1));
    message = message.replace('{current}', randomChoice(CONFIG.currents));
    message = message.replace('{height}', randomInt(2, 12));
    message = message.replace('{coast}', randomChoice(CONFIG.regions));
    message = message.replace('{route}', randomChoice(CONFIG.routes));
    message = message.replace('{volume}', `$${randomInt(100, 800)}B`);
    message = message.replace('{market}', randomChoice(CONFIG.markets));
    message = message.replace('{change}', randomChoice(['+0.3%', '-0.5%', '+1.2%', '-0.8%', '+0.6%']));
    message = message.replace('{resource}', randomChoice(CONFIG.resources));
    message = message.replace('{price}', randomInt(15, 2000));
    message = message.replace('{sat}', `STARLINK-${randomInt(1000, 9999)}`);
    message = message.replace('{throughput}', randomInt(50, 500));
    message = message.replace('{rate}', random(-5, 15).toFixed(1));
    message = message.replace('{species}', randomChoice(CONFIG.species));
    message = message.replace('{direction}', randomChoice(CONFIG.directions));
    message = message.replace('{capacity}', randomInt(50, 500));
    
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    
    return {
        icon: eventType.icon,
        category: eventType.category,
        message: message,
        time: timeStr,
        id: ++state.logCount
    };
}

// ==========================================
// CLOCK & TIME
// ==========================================
function updateClock() {
    const now = new Date();
    state.simDate = now;
    
    document.getElementById('sim-date').textContent = 
        `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    
    document.getElementById('sim-time').textContent = 
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} UTC`;
    
    // Update cycle indicator
    const hours = now.getHours() + now.getMinutes() / 60;
    const dayProgress = (hours / 24) * 100;
    document.querySelector('.cycle-progress').style.width = `${dayProgress}%`;
    
    const remaining = 24 - hours;
    const remHours = Math.floor(remaining);
    const remMins = Math.floor((remaining - remHours) * 60);
    document.querySelector('.cycle-time').textContent = `${remHours}:${String(remMins).padStart(2, '0')}`;
}

// ==========================================
// POPULATION COUNTER
// ==========================================
function updatePopulation() {
    state.population += Math.floor(state.popGrowthRate * (CONFIG.updateIntervals.population / 1000));
    
    const popStr = formatNumber(state.population);
    document.getElementById('global-pop').textContent = popStr;
    document.getElementById('pop-global').textContent = popStr;
    
    // Subtle animation on change
    const el = document.getElementById('global-pop');
    el.style.color = CONFIG.colors.secondary;
    setTimeout(() => { el.style.color = ''; }, 300);
}

// ==========================================
// METRICS UPDATE
// ==========================================
function updateMetrics() {
    // Temperature
    state.globalTemp += random(-0.01, 0.02);
    state.globalTemp = clamp(state.globalTemp, 14.0, 16.0);
    document.getElementById('global-temp').textContent = `${state.globalTemp.toFixed(2)}°C`;
    
    // CO2
    state.co2Level += random(0.01, 0.08);
    document.getElementById('global-co2').textContent = state.co2Level.toFixed(1);
    
    // Ocean level
    state.oceanLevel += random(0.001, 0.005);
    document.getElementById('ocean-level').textContent = `+${state.oceanLevel.toFixed(1)}mm`;
    
    // GDP
    state.globalGDP += random(-0.01, 0.03);
    document.getElementById('global-gdp').textContent = `$${state.globalGDP.toFixed(1)}T`;
    
    // SST anomaly
    const sst = 0.92 + random(-0.02, 0.02);
    document.getElementById('sst-anomaly').textContent = `+${sst.toFixed(2)}°C`;
    
    // Ships & flights
    state.shipsAtSea += randomInt(-50, 50);
    state.shipsAtSea = clamp(state.shipsAtSea, 50000, 55000);
    document.getElementById('ships-count').textContent = formatNumber(state.shipsAtSea);
    
    state.flightsAirborne += randomInt(-100, 100);
    state.flightsAirborne = clamp(state.flightsAirborne, 15000, 22000);
    document.getElementById('flights-count').textContent = formatNumber(state.flightsAirborne);
    
    // Quakes today
    state.quakesToday += randomInt(0, 3);
    document.getElementById('quakes-today').textContent = formatNumber(state.quakesToday);
}

// ==========================================
// SEISMIC FEED
// ==========================================
function updateSeismicFeed() {
    const feed = document.getElementById('seismic-feed');
    
    const loc = randomChoice(CONFIG.seismicLocations);
    const mag = random(2.0, 5.8).toFixed(1);
    const depth = randomInt(5, 100);
    const minutesAgo = randomInt(1, 60);
    
    let magClass = 'magnitude-2';
    if (parseFloat(mag) >= 5.0) magClass = 'magnitude-5';
    else if (parseFloat(mag) >= 4.0) magClass = 'magnitude-4';
    else if (parseFloat(mag) >= 3.0) magClass = 'magnitude-3';
    
    const entry = document.createElement('div');
    entry.className = `feed-item ${magClass}`;
    entry.innerHTML = `
        <span class="mag-badge">${mag}</span>
        <span class="location">${loc.name} - ${loc.lat.toFixed(1)}°${loc.lon >= 0 ? 'N' : 'S'} ${Math.abs(loc.lon).toFixed(1)}°${loc.lon >= 0 ? 'E' : 'W'}</span>
        <span class="time">${minutesAgo}m ago</span>
        <span class="depth">${depth}km</span>
    `;
    
    entry.style.animation = 'fade-in 0.3s ease-out';
    feed.insertBefore(entry, feed.firstChild);
    
    // Remove oldest if too many
    while (feed.children.length > 7) {
        feed.removeChild(feed.lastChild);
    }
}

// ==========================================
// EVENT LOG
// ==========================================
function addEventLogEntry() {
    const entry = generateEventLogEntry();
    state.eventLog.unshift(entry);
    
    // Keep max 50 entries
    if (state.eventLog.length > 50) {
        state.eventLog.pop();
    }
    
    renderEventLog();
    
    // Update log count
    document.getElementById('log-count').textContent = `${formatNumber(state.logCount)} events`;
}

function renderEventLog() {
    const container = document.getElementById('log-entries');
    container.innerHTML = '';
    
    state.eventLog.slice(0, 15).forEach(entry => {
        const el = document.createElement('div');
        el.className = 'feed-item';
        el.style.gridTemplateColumns = '16px 1fr auto';
        el.style.fontSize = '0.5rem';
        el.innerHTML = `
            <span class="alert-icon">${entry.icon}</span>
            <span class="location" style="font-size: 0.5rem;">${entry.message}</span>
            <span class="time" style="font-size: 0.45rem;">${entry.time}</span>
        `;
        container.appendChild(el);
    });
}

// ==========================================
// MAP RENDERING (Canvas)
// ==========================================
let mapCanvas, mapCtx;
let mapAnimFrame;

function initMap() {
    const container = document.getElementById('main-map');
    mapCanvas = document.createElement('canvas');
    mapCanvas.style.position = 'absolute';
    mapCanvas.style.top = '0';
    mapCanvas.style.left = '0';
    mapCanvas.style.width = '100%';
    mapCanvas.style.height = '100%';
    container.insertBefore(mapCanvas, container.firstChild);
    
    mapCtx = mapCanvas.getContext('2d');
    resizeMap();
    
    // Generate initial map points
    generateMapPoints();
    
    // Start animation loop
    animateMap();
    
    // Handle resize
    window.addEventListener('resize', resizeMap);
    
    // Map button interactions
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.mapLayer = e.target.dataset.layer;
            generateMapPoints();
        });
    });
}

function resizeMap() {
    const container = document.getElementById('main-map');
    const rect = container.getBoundingClientRect();
    mapCanvas.width = rect.width * window.devicePixelRatio;
    mapCanvas.height = rect.height * window.devicePixelRatio;
    mapCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function generateMapPoints() {
    state.mapPoints = [];
    
    const w = mapCanvas.width / window.devicePixelRatio;
    const h = mapCanvas.height / window.devicePixelRatio;
    
    // Generate continent-like shapes using random points
    const numPoints = state.mapLayer === 'population' ? 300 : 
                      state.mapLayer === 'climate' ? 200 : 
                      state.mapLayer === 'resources' ? 150 :
                      state.mapLayer === 'trade' ? 100 : 250;
    
    for (let i = 0; i < numPoints; i++) {
        state.mapPoints.push({
            x: random(0.05, 0.95) * w,
            y: random(0.05, 0.95) * h,
            size: random(1, 4),
            intensity: random(0.2, 1),
            pulse: random(0, Math.PI * 2),
            pulseSpeed: random(0.5, 2),
            vx: random(-0.1, 0.1),
            vy: random(-0.1, 0.1),
            color: getPointColor()
        });
    }
    
    // Add some "hotspots"
    for (let i = 0; i < 8; i++) {
        state.mapPoints.push({
            x: random(0.1, 0.9) * w,
            y: random(0.1, 0.9) * h,
            size: random(8, 15),
            intensity: random(0.6, 1),
            pulse: random(0, Math.PI * 2),
            pulseSpeed: random(1, 3),
            vx: 0,
            vy: 0,
            color: CONFIG.colors.hotspot,
            isHotspot: true
        });
    }
}

function getPointColor() {
    switch (state.mapLayer) {
        case 'population':
            return CONFIG.colors.population;
        case 'climate':
            return randomChoice([CONFIG.colors.vegetation, CONFIG.colors.arid, '#0088ff']);
        case 'resources':
            return randomChoice([CONFIG.colors.warning, CONFIG.colors.secondary, '#ff6432']);
        case 'trade':
            return CONFIG.colors.info;
        default:
            return CONFIG.colors.vegetation;
    }
}

function animateMap() {
    const w = mapCanvas.width / window.devicePixelRatio;
    const h = mapCanvas.height / window.devicePixelRatio;
    
    mapCtx.clearRect(0, 0, w, h);
    
    // Draw subtle grid
    drawGrid(w, h);
    
    // Draw map points
    state.mapPoints.forEach(point => {
        // Update pulse
        point.pulse += point.pulseSpeed * 0.02;
        const pulseScale = 1 + Math.sin(point.pulse) * 0.3;
        
        // Update position for non-hotspots
        if (!point.isHotspot) {
            point.x += point.vx;
            point.y += point.vy;
            
            // Wrap around
            if (point.x < 0) point.x = w;
            if (point.x > w) point.x = 0;
            if (point.y < 0) point.y = h;
            if (point.y > h) point.y = 0;
        }
        
        // Draw point
        const alpha = point.intensity * (0.3 + Math.sin(point.pulse) * 0.2 + 0.5);
        mapCtx.globalAlpha = alpha;
        
        if (point.isHotspot) {
            // Draw hotspot with glow
            const gradient = mapCtx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, point.size * pulseScale
            );
            gradient.addColorStop(0, point.color);
            gradient.addColorStop(0.5, point.color + '80');
            gradient.addColorStop(1, 'transparent');
            
            mapCtx.fillStyle = gradient;
            mapCtx.beginPath();
            mapCtx.arc(point.x, point.y, point.size * pulseScale, 0, Math.PI * 2);
            mapCtx.fill();
        } else {
            // Draw regular point
            mapCtx.fillStyle = point.color;
            mapCtx.beginPath();
            mapCtx.arc(point.x, point.y, point.size * pulseScale * 0.5, 0, Math.PI * 2);
            mapCtx.fill();
        }
        
        mapCtx.globalAlpha = 1;
    });
    
    // Draw trade routes if active
    if (state.mapLayer === 'trade') {
        drawTradeRoutes(w, h);
    }
    
    mapAnimFrame = requestAnimationFrame(animateMap);
}

function drawGrid(w, h) {
    mapCtx.strokeStyle = CONFIG.colors.grid;
    mapCtx.lineWidth = 0.5;
    mapCtx.globalAlpha = 0.3;
    
    const spacing = 40;
    
    for (let x = 0; x < w; x += spacing) {
        mapCtx.beginPath();
        mapCtx.moveTo(x, 0);
        mapCtx.lineTo(x, h);
        mapCtx.stroke();
    }
    
    for (let y = 0; y < h; y += spacing) {
        mapCtx.beginPath();
        mapCtx.moveTo(0, y);
        mapCtx.lineTo(w, y);
        mapCtx.stroke();
    }
    
    mapCtx.globalAlpha = 1;
}

function drawTradeRoutes(w, h) {
    const routes = [
        { from: { x: 0.75, y: 0.35 }, to: { x: 0.2, y: 0.4 } },
        { from: { x: 0.55, y: 0.3 }, to: { x: 0.15, y: 0.45 } },
        { from: { x: 0.75, y: 0.35 }, to: { x: 0.8, y: 0.35 } },
        { from: { x: 0.45, y: 0.25 }, to: { x: 0.2, y: 0.4 } },
        { from: { x: 0.75, y: 0.35 }, to: { x: 0.45, y: 0.25 } }
    ];
    
    const time = Date.now() * 0.001;
    
    routes.forEach(route => {
        const x1 = route.from.x * w;
        const y1 = route.from.y * h;
        const x2 = route.to.x * w;
        const y2 = route.to.y * h;
        
        // Draw curved path
        mapCtx.strokeStyle = CONFIG.colors.info + '40';
        mapCtx.lineWidth = 1;
        mapCtx.setLineDash([4, 4]);
        mapCtx.beginPath();
        mapCtx.moveTo(x1, y1);
        const cpX = (x1 + x2) / 2 + random(-30, 30);
        const cpY = (y1 + y2) / 2 + random(-20, 20);
        mapCtx.quadraticCurveTo(cpX, cpY, x2, y2);
        mapCtx.stroke();
        mapCtx.setLineDash([]);
        
        // Draw moving dot
        const t = (time * 0.15) % 1;
        const dotX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpX + t * t * x2;
        const dotY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpY + t * t * y2;
        
        mapCtx.fillStyle = CONFIG.colors.info;
        mapCtx.beginPath();
        mapCtx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        mapCtx.fill();
    });
}

// ==========================================
// TICKER BAR
// ==========================================
function initTicker() {
    const ticker = document.getElementById('ticker');
    // Duplicate content for seamless loop
    ticker.innerHTML += ticker.innerHTML;
}

// ==========================================
// COORDINATE TRACKING
// ==========================================
function initCoordinateTracking() {
    const mapContainer = document.getElementById('main-map');
    
    mapContainer.addEventListener('mousemove', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const lat = (0.5 - y) * 180;
        const lon = (x - 0.5) * 360;
        
        document.querySelector('.coord-lat').textContent = `${lat.toFixed(4)}°${lat >= 0 ? 'N' : 'S'}`;
        document.querySelector('.coord-lon').textContent = `${Math.abs(lon).toFixed(4)}°${lon >= 0 ? 'E' : 'W'}`;
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
    // Initialize clock
    updateClock();
    setInterval(updateClock, CONFIG.updateIntervals.clock);
    
    // Initialize population counter
    setInterval(updatePopulation, CONFIG.updateIntervals.population);
    
    // Initialize metrics updates
    setInterval(updateMetrics, CONFIG.updateIntervals.metrics);
    
    // Initialize seismic feed updates
    setInterval(updateSeismicFeed, CONFIG.updateIntervals.seismicFeed);
    
    // Initialize event log
    for (let i = 0; i < 10; i++) {
        state.eventLog.push(generateEventLogEntry());
    }
    renderEventLog();
    setInterval(addEventLogEntry, CONFIG.updateIntervals.eventLog);
    
    // Initialize map
    initMap();
    
    // Initialize ticker
    initTicker();
    
    // Initialize coordinate tracking
    initCoordinateTracking();
    
    // Initial log entry
    console.log('🌍 TERRA-7 Planetary Simulation initialized');
    console.log(`📊 Monitoring ${state.logCount} global events`);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
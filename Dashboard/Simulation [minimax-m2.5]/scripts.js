/* ============================================
PLANETOSCOPE - GLOBAL SIMULATION DASHBOARD
JavaScript Controller v4.7.2
============================================ */

// ============================================
// CONFIGURATION & DATA
// ============================================

const CONFIG = {
    tickRate: 100, // ms per tick
    maxQuakes: 50,
    maxVolcanoes: 15,
    maxWeather: 10,
    newsItems: 20
};

const LOCATIONS = {
    quakes: [
        { name: 'Tokushima, Japan', lat: 34.0658, lon: 134.5693 },
        { name: 'Samoa', lat: -13.7590, lon: -172.1046 },
        { name: 'Southern Peru', lat: -15.3900, lon: -70.1000 },
        { name: 'Kamchatka Peninsula', lat: 56.0000, lon: 160.0000 },
        { name: 'Mendoza, Argentina', lat: -32.8895, lon: -68.8458 },
        { name: 'Solomon Islands', lat: -9.6457, lon: 160.1564 },
        { name: 'Iceland', lat: 64.9631, lon: -19.0208 },
        { name: 'New Zealand', lat: -40.9006, lon: 174.8860 },
        { name: 'California, USA', lat: 36.7783, lon: -119.4179 },
        { name: 'Greece', lat: 39.0742, lon: 21.8243 },
        { name: 'Turkey', lat: 38.9637, lon: 35.2433 },
        { name: 'Nepal', lat: 28.3949, lon: 84.1240 },
        { name: 'Philippines', lat: 12.8797, lon: 121.7740 },
        { name: 'Indonesia', lat: -0.7893, lon: 113.9213 },
        { name: 'Chile', lat: -35.6751, lon: -71.5430 },
        { name: 'Mexico', lat: 23.6345, lon: -102.5528 },
        { name: 'Fiji', lat: -17.7134, lon: 178.0650 },
        { name: 'Papua New Guinea', lat: -6.3150, lon: 143.9555 },
        { name: 'Tonga', lat: -21.1790, lon: -175.1982 },
        { name: 'Vanuatu', lat: -15.3767, lon: 166.9592 }
    ],
    volcanoes: [
        { name: 'Mount Etna', country: 'Italy', status: 'active' },
        { name: 'Kilauea', country: 'USA', status: 'active' },
        { name: 'Stromboli', country: 'Italy', status: 'active' },
        { name: 'Mount Merapi', country: 'Indonesia', status: 'active' },
        { name: 'Popocatépetl', country: 'Mexico', status: 'active' },
        { name: 'Sakurajima', country: 'Japan', status: 'active' },
        { name: 'Mount Vesuvius', country: 'Italy', status: 'dormant' },
        { name: 'Mauna Loa', country: 'USA', status: 'active' },
        { name: 'Eyjafjallajökull', country: 'Iceland', status: 'dormant' },
        { name: 'Mount Rainier', country: 'USA', status: 'dormant' },
        { name: 'Cotopaxi', country: 'Ecuador', status: 'active' },
        { name: 'Villarrica', country: 'Chile', status: 'active' }
    ],
    weather: [
        { name: 'Typhoon Nepartak', type: 'TC', cat: 4 },
        { name: 'Hurricane Franklin', type: 'HU', cat: 3 },
        { name: 'Cyclone Bansi', type: 'TC', cat: 2 },
        { name: 'Storm Dennis', type: 'ST', cat: 1 },
        { name: 'Typhoon Kujira', type: 'TC', cat: 1 },
        { name: 'Super Typhoon Surigae', type: 'TY', cat: 5 },
        { name: 'Storm Alex', type: 'ST', cat: 2 },
        { name: 'Cyclone Jobo', type: 'TC', cat: 1 }
    ],
    news: [
        { category: 'geo', headline: '6.8 magnitude earthquake strikes off Papua New Guinea coast' },
        { category: 'geo', headline: 'New volcanic island emerges in Pacific after submarine eruption' },
        { category: 'climate', headline: 'Arctic sea ice reaches annual minimum, 4th lowest on record' },
        { category: 'econ', headline: 'Global trade volume surpasses pre-pandemic levels by 12%' },
        { category: 'tech', headline: 'SpaceX launches 60 new Starlink satellites into orbit' },
        { category: 'geo', headline: 'Scientists discover new hydrothermal vent field in Atlantic' },
        { category: 'climate', headline: 'Amazon rainforest shows signs of regeneration in protected areas' },
        { category: 'econ', headline: 'Oil prices fluctuate as OPEC+ maintains production targets' },
        { category: 'tech', headline: 'New ocean monitoring satellite successfully reaches orbit' },
        { category: 'geo', headline: 'Major fault line in San Andreas shows increased seismic activity' },
        { category: 'climate', headline: 'Global renewable energy capacity exceeds 3,000 GW milestone' },
        { category: 'econ', headline: 'Semiconductor shortage eases as new factories come online' },
        { category: 'geo', headline: 'Underwater landslide triggers tsunami warning in Pacific' },
        { category: 'tech', headline: 'AI climate model achieves unprecedented accuracy in predictions' },
        { category: 'climate', headline: 'Coral reef restoration project shows 85% success rate' }
    ]
};

// ============================================
// STATE
// ============================================

let state = {
    tick: 847293847,
    solDay: 1847,
    globalPop: 8147000000,
    globalTemp: 14.87,
    co2Level: 421.4,
    energyUsage: 18.4,
    tickCounter: 0
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(3) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(0);
}

function formatTime(date) {
    return date.toISOString().substr(11, 12);
}

// ============================================
// QUAKE GENERATOR
// ============================================

function generateQuake() {
    const location = LOCATIONS.quakes[randomInt(0, LOCATIONS.quakes.length - 1)];
    const magnitude = random(4.0, 9.5).toFixed(1);
    const intensity = magnitude >= 7.0 ? 'major' : magnitude >= 5.0 ? 'moderate' : 'minor';
    
    const depth = randomInt(5, 300);
    const time = new Date(Date.now() - randomInt(0, 3600000));
    const timeStr = time.toTimeString().substr(0, 5);
    
    return {
        magnitude,
        intensity,
        location: location.name,
        depth,
        time: timeStr,
        lat: location.lat.toFixed(1),
        lon: location.lon.toFixed(1)
    };
}

function updateQuakeFeed() {
    const feed = document.getElementById('quake-feed');
    const countBadge = document.getElementById('quake-count');
    
    const quake = generateQuake();
    const item = document.createElement('div');
    item.className = `feed-item ${quake.intensity}`;
    item.innerHTML = `
        <span class="feed-magnitude">M${quake.magnitude}</span>
        <span class="feed-location">${quake.location}</span>
        <span class="feed-time">${quake.time}</span>
    `;
    
    feed.insertBefore(item, feed.firstChild);
    
    // Keep only last 15 items
    while (feed.children.length > 15) {
        feed.removeChild(feed.lastChild);
    }
    
    countBadge.textContent = feed.children.length;
}

// ============================================
// VOLCANO GENERATOR
// ============================================

function updateVolcanoFeed() {
    const feed = document.getElementById('volcano-feed');
    const countBadge = document.getElementById('volcano-count');
    
    // Random chance to generate activity
    if (Math.random() > 0.3) return;
    
    const volcano = LOCATIONS.volcanoes[randomInt(0, LOCATIONS.volcanoes.length - 1)];
    const activities = ['erupting', 'smoking', 'seismic swarm', 'ash emission', 'lava flow'];
    const activity = activities[randomInt(0, activities.length - 1)];
    const time = new Date(Date.now() - randomInt(0, 7200000));
    
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
        <span class="feed-magnitude" style="color: var(--accent-orange)">${volcano.status === 'active' ? '🔴' : '🟡'}</span>
        <span class="feed-location">${volcano.name}</span>
        <span class="feed-time">${activity}</span>
    `;
    
    feed.insertBefore(item, feed.firstChild);
    
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
    
    countBadge.textContent = feed.children.length;
}

// ============================================
// SEISMIC ACTIVITY UPDATE
// ============================================

function updateSeismicActivity() {
    const zones = ['ring-fire', 'alpine', 'mid-atlantic', 'himalayan', 'east-africa'];
    const levels = ['LOW', 'LOW', 'MOD', 'MOD', 'HIGH', 'HIGH'];
    
    zones.forEach(zone => {
        const el = document.getElementById(zone.substring(0, 2).toLowerCase() + '-activity');
        if (el) {
            el.textContent = levels[randomInt(0, levels.length - 1)];
            el.style.color = el.textContent === 'HIGH' ? 'var(--accent-red)' : 
                           el.textContent === 'MOD' ? 'var(--accent-orange)' : 'var(--accent-green)';
        }
    });
}

// ============================================
// WEATHER SYSTEMS
// ============================================

function updateWeatherSystems() {
    const feed = document.getElementById('weather-feed');
    const countBadge = document.getElementById('storm-count');
    
    // Update existing systems
    if (feed.children.length > 0 && Math.random() > 0.5) {
        const systems = feed.querySelectorAll('.weather-system');
        systems.forEach(sys => {
            const strength = sys.querySelector('.sys-strength');
            const newCat = randomInt(1, 5);
            strength.className = `sys-strength cat-${newCat}`;
            strength.textContent = `CAT ${newCat}`;
        });
    }
    
    // Add new system occasionally
    if (Math.random() > 0.7 && feed.children.length < 8) {
        const weather = LOCATIONS.weather[randomInt(0, LOCATIONS.weather.length - 1)];
        const item = document.createElement('div');
        item.className = 'weather-system';
        item.innerHTML = `
            <span class="sys-icon-small">${weather.type === 'TC' || weather.type === 'TY' ? '🌀' : '⛈️'}</span>
            <span class="sys-name">${weather.name}</span>
            <span class="sys-strength cat-${weather.cat}">CAT ${weather.cat}</span>
        `;
        feed.appendChild(item);
    }
    
    countBadge.textContent = feed.children.length;
}

// ============================================
// POPULATION UPDATES
// ============================================

function updatePopulation() {
    const births = randomInt(350000, 420000);
    const deaths = randomInt(140000, 170000);
    const netGrowth = births - deaths;
    
    state.globalPop += netGrowth / 86400; // Daily rate converted to per-second
    
    document.querySelector('.pop-stat:nth-child(1) .pop-value').innerHTML = 
        `+${formatNumber(births)}<span class="pop-unit">/day</span>`;
    document.querySelector('.pop-stat:nth-child(2) .pop-value').innerHTML = 
        `-${formatNumber(deaths)}<span class="pop-unit">/day</span>`;
    document.querySelector('.pop-stat:nth-child(3) .pop-value').innerHTML = 
        `+${formatNumber(netGrowth)}<span class="pop-unit">/day</span>`;
    
    document.getElementById('global-pop').textContent = 
        (state.globalPop / 1e9).toFixed(3) + 'B';
}

// ============================================
// CLIMATE DATA
// ============================================

function updateClimateData() {
    // Temperature fluctuation
    state.globalTemp += random(-0.01, 0.01);
    document.getElementById('global-temp').textContent = state.globalTemp.toFixed(2) + '°C';
    
    // CO2 level
    state.co2Level += random(0.01, 0.05);
    document.getElementById('co2-level').textContent = state.co2Level.toFixed(1) + 'ppm';
    
    // Energy usage
    state.energyUsage += random(-0.1, 0.2);
    document.getElementById('energy-usage').textContent = state.energyUsage.toFixed(1) + 'TW';
}

// ============================================
// TIME & DATE
// ============================================

function updateTime() {
    const now = new Date();
    
    // UTC Time with milliseconds
    document.getElementById('utc-time').textContent = formatTime(now) + '.' + 
        now.getMilliseconds().toString().padStart(3, '0');
    
    // LMT (Local Mean Time) - simulated
    const lmt = new Date(now.getTime() + randomInt(-1800000, 1800000));
    document.getElementById('lmt-time').textContent = formatTime(lmt).substr(0, 8);
    
    // Sol day (Mars-like simulation)
    state.solDay = 1847 + Math.floor(now.getTime() / 86400000);
    document.getElementById('sol-day').textContent = state.solDay.toLocaleString();
}

// ============================================
// TICK COUNTER
// ============================================

function updateTickCounter() {
    state.tick++;
    document.getElementById('tick-counter').textContent = state.tick.toLocaleString();
}

// ============================================
// NEWS TICKER
// ============================================

function updateTicker() {
    const ticker = document.getElementById('news-ticker');
    ticker.innerHTML = '';
    
    const time = new Date();
    
    for (let i = 0; i < 10; i++) {
        const news = LOCATIONS.news[randomInt(0, LOCATIONS.news.length - 1)];
        const itemTime = new Date(time.getTime() - randomInt(0, 3600000));
        
        const item = document.createElement('span');
        item.className = 'ticker-item';
        item.innerHTML = `
            <span class="ticker-time">${itemTime.toTimeString().substr(0, 5)}</span>
            <span class="ticker-category ${news.category}">${news.category.toUpperCase()}</span>
            <span class="ticker-headline">${news.headline}</span>
            <span style="margin: 0 16px; color: var(--border-color)">///</span>
        `;
        ticker.appendChild(item);
    }
}

// ============================================
// PLANET CONTROLS
// ============================================

function initPlanetControls() {
    const buttons = document.querySelectorAll('.ctrl-btn');
    const planetView = document.getElementById('planet-view');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Visual feedback for layer change
            const layer = btn.dataset.layer;
            const globe = document.querySelector('.planet-globe');
            
            // Remove all layer classes
            globe.classList.remove('layer-terrain', 'layer-temp', 'layer-precip', 'layer-pop', 'layer-sat');
            globe.classList.add('layer-' + layer);
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

function initializeDashboard() {
    // Initial population of data
    for (let i = 0; i < 15; i++) {
        updateQuakeFeed();
    }
    
    for (let i = 0; i < 5; i++) {
        updateVolcanoFeed();
    }
    
    for (let i = 0; i < 6; i++) {
        updateWeatherSystems();
    }
    
    updateTicker();
    updatePopulation();
    updateTime();
    updateTickCounter();
    initPlanetControls();
    
    // Start the main loop
    setInterval(() => {
        updateTickCounter();
        
        // Various update frequencies
        if (state.tick % 10 === 0) updateTime();
        if (state.tick % 20 === 0) updateQuakeFeed();
        if (state.tick % 25 === 0) updateVolcanoFeed();
        if (state.tick % 30 === 0) updateWeatherSystems();
        if (state.tick % 50 === 0) updateSeismicActivity();
        if (state.tick % 100 === 0) {
            updatePopulation();
            updateClimateData();
        }
    }, CONFIG.tickRate);
    
    // Ticker update every 15 seconds
    setInterval(updateTicker, 15000);
    
    // Clock update every 100ms for milliseconds display
    setInterval(updateTime, 100);
}

// ============================================
// DOCUMENT READY
// ============================================

document.addEventListener('DOMContentLoaded', initializeDashboard);

// ============================================
// ADDITIONAL INTERACTIVE FEATURES
// ============================================

// Panel hover effects - highlight related data
document.querySelectorAll('.panel').forEach(panel => {
    panel.addEventListener('mouseenter', () => {
        panel.style.zIndex = '10';
    });
    panel.addEventListener('mouseleave', () => {
        panel.style.zIndex = '1';
    });
});

// System status icons - click handlers
document.querySelectorAll('.system-status .sys-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const titles = {
            '⚙️': 'Server Load: 23%',
            '🧠': 'Memory: 4.2GB / 16GB',
            '📡': 'Network: 847ms latency',
            '🚨': 'Alerts: 3 critical'
        };
        
        // Visual feedback
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);
        
        console.log(titles[icon.textContent] || 'System check');
    });
});

// Resource trend indicators - click to show details
document.querySelectorAll('.resource-item').forEach(item => {
    item.addEventListener('click', () => {
        const resourceName = item.querySelector('.res-name').textContent;
        const trend = item.querySelector('.res-trend').textContent;
        
        // Toggle trend direction for demo
        const trends = ['▲', '▼', '━'];
        const currentIdx = trends.indexOf(trend);
        const nextTrend = trends[(currentIdx + 1) % 3];
        item.querySelector('.res-trend').textContent = nextTrend;
        
        // Update color
        item.querySelector('.res-trend').className = 'res-trend ' + 
            (nextTrend === '▲' ? 'up' : nextTrend === '▼' ? 'down' : 'stable');
    });
});

// Add random data fluctuation to energy sources
setInterval(() => {
    const sources = document.querySelectorAll('.energy-source');
    const values = [randomInt(58, 66), randomInt(7, 11), randomInt(25, 33)];
    
    sources.forEach((source, i) => {
        const pct = values[i];
        const label = source.querySelector('span:last-child');
        label.textContent = pct + '%';
        source.style.setProperty('--pct', pct + '%');
    });
}, 5000);

// Orbital debris counter increment
setInterval(() => {
    const debris = document.getElementById('orbital-debris');
    if (debris) {
        const current = parseInt(debris.textContent.replace(/,/g, ''));
        const newVal = current + randomInt(1, 5);
        debris.textContent = newVal.toLocaleString();
    }
}, 3000);

// ============================================
// ANIMATION LOOP FOR VISUAL FLAIR
// ============================================

function animateGlobe() {
    const globe = document.querySelector('.planet-globe');
    if (globe) {
        // Subtle rotation speed variation
        const speed = 60 + Math.sin(Date.now() / 10000) * 5;
        globe.style.animationDuration = speed + 's';
    }
    
    requestAnimationFrame(animateGlobe);
}

animateGlobe();

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'R' to reset tick counter
    if (e.key === 'r' || e.key === 'R') {
        state.tick = 0;
    }
    
    // Press 'Space' to pause/resume (visual indicator)
    if (e.key === ' ') {
        const indicator = document.querySelector('.status-indicator');
        indicator.classList.toggle('active');
    }
});

console.log('%c🌍 PLANETOSCOPE v4.7.2', 'font-size: 20px; color: #06b6d4; font-weight: bold;');
console.log('%cGlobal Simulation Dashboard Loaded', 'color: #64748b;');
console.log('%cPress R to reset tick counter | Press Space to toggle simulation', 'color: #94a3b8;');
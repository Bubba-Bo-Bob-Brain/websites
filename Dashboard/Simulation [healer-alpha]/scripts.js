// scripts.js - Planetary Command Dashboard

// Global state
const dashboardState = {
    updateTime: 0,
    dataStreamMessages: [],
    lastUpdate: Date.now(),
    isRunning: true,
    updateFrequency: 100, // milliseconds between updates
    dataPoints: 2400000
};

// Data generators
const dataGenerators = {
    // Generate random earthquake
    earthquake: () => {
        const lat = (Math.random() * 180 - 90).toFixed(1);
        const lon = (Math.random() * 360 - 180).toFixed(1);
        const mag = (Math.random() * 6 + 1).toFixed(1);
        const depth = Math.floor(Math.random() * 700);
        const locations = ['PACIFIC RING', 'ALPINE BELT', 'MID-ATLANTIC', 'HIMALAYAN', 'ANDEAN', 'EAST AFRICAN'];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        return `🔴 SEISMIC: ${location} ${lat}°${Math.random() > 0.5 ? 'N' : 'S'} ${lon}°${Math.random() > 0.5 ? 'E' : 'W'} M${mag} DEPTH:${depth}km`;
    },
    
    // Generate volcanic activity
    volcanic: () => {
        const volcanoes = [
            'KILAUEA', 'ETNA', 'VESUVIUS', 'PINATUBO', 'FUJI', 'MERAPI', 
            'SANTORINI', 'OLYMPUS MONS', 'EREBUS', 'TAMBORA'
        ];
        const volcano = volcanoes[Math.floor(Math.random() * volcanoes.length)];
        const activity = ['ERUPTING', 'UNREST', 'TREMORS', 'GAS EMISSION', 'NORMAL'][Math.floor(Math.random() * 5)];
        const level = Math.floor(Math.random() * 5) + 1;
        
        return `🌋 VOLCANIC: ${volcano} ${activity} LEVEL ${level}`;
    },
    
    // Generate weather event
    weather: () => {
        const events = [
            '🌀 HURRICANE FORMING', '🌪️ TORNADO SIGHTED', '🌧️ MONSOON INTENSIFYING',
            '❄️ BLIZZARD WARNING', '☀️ HEAT WAVE', '🌊 STORM SURGE', '💨 JET STREAM SHIFT'
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        const regions = ['NORTH ATLANTIC', 'PACIFIC', 'INDIAN OCEAN', 'ARCTIC', 'MEDITERRANEAN', 'GULF OF MEXICO'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const intensity = ['LOW', 'MODERATE', 'HIGH', 'SEVERE'][Math.floor(Math.random() * 4)];
        
        return `⛅ WEATHER: ${event} ${region} INTENSITY: ${intensity}`;
    },
    
    // Generate population change
    population: () => {
        const change = Math.floor(Math.random() * 100000) - 50000;
        const action = change > 0 ? 'GROWTH' : 'DECLINE';
        const region = ['ASIA', 'EUROPE', 'AFRICA', 'AMERICAS', 'OCEANIA'][Math.floor(Math.random() * 5)];
        const rate = (Math.random() * 2).toFixed(2);
        
        return `👥 DEMOGRAPHICS: ${region} ${action} ${Math.abs(change).toLocaleString()} RATE: ${rate}%`;
    },
    
    // Generate trade data
    trade: () => {
        const commodities = ['CRUDE OIL', 'NATURAL GAS', 'GRAIN', 'SEMICONDUCTORS', 'LITHIUM', 'RARE EARTHS'];
        const commodity = commodities[Math.floor(Math.random() * commodities.length)];
        const change = (Math.random() * 10 - 5).toFixed(1);
        const action = change > 0 ? '↑' : '↓';
        const volume = Math.floor(Math.random() * 1000000);
        
        return `💰 TRADE: ${commodity} ${action}${Math.abs(change)}% VOL: ${volume.toLocaleString()} MT`;
    },
    
    // Generate space event
    space: () => {
        const events = [
            '🛰️ SATELLITE DEPLOYED', '🚀 ROCKET LAUNCH', '☄️ ASTEROID FLYBY',
            '🌌 SOLAR FLARE', '🌠 METEOR SHOWER', '👨‍🚀 SPACEWALK'
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        const detail = ['LOW EARTH ORBIT', 'GEOSTATIONARY', 'LUNAR ORBIT', 'MARS TRANSFER', 'DEEP SPACE'][Math.floor(Math.random() * 5)];
        
        return `🌌 SPACE: ${event} ${detail}`;
    },
    
    // Generate environmental data
    environmental: () => {
        const metrics = [
            { name: 'CO2 LEVELS', unit: 'ppm', min: 415, max: 425 },
            { name: 'OCEAN ACIDITY', unit: 'pH', min: 8.05, max: 8.15 },
            { name: 'ARCTIC ICE', unit: 'km²', min: 4.5, max: 5.5 },
            { name: 'GLOBAL TEMP', unit: '°C', min: 14.8, max: 15.2 }
        ];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = (Math.random() * (metric.max - metric.min) + metric.min).toFixed(2);
        const trend = Math.random() > 0.5 ? '↑' : '↓';
        
        return `🌿 ENV: ${metric.name}: ${value}${metric.unit} ${trend}`;
    },
    
    // Generate system alert
    system: () => {
        const systems = ['POWER GRID', 'COMM NETWORK', 'TRANSPORT', 'WATER SUPPLY', 'WASTE MGMT'];
        const system = systems[Math.floor(Math.random() * systems.length)];
        const status = ['OPTIMAL', 'DEGRADED', 'CRITICAL', 'MAINTENANCE'][Math.floor(Math.random() * 4)];
        const load = Math.floor(Math.random() * 100);
        
        return `⚙️ SYSTEM: ${system} STATUS: ${status} LOAD: ${load}%`;
    }
};

// Update functions
function updateClocks() {
    const now = new Date();
    
    // Update universal time (simulated)
    const universalTime = new Date(now.getTime() + 3600000 * 6); // 6 hours ahead
    const year = 2157;
    const dayOfYear = Math.floor((universalTime - new Date(universalTime.getFullYear(), 0, 0)) / 86400000);
    const hours = String(universalTime.getHours()).padStart(2, '0');
    const minutes = String(universalTime.getMinutes()).padStart(2, '0');
    const seconds = String(universalTime.getSeconds()).padStart(2, '0');
    
    document.querySelector('.universal-time').textContent = 
        `${year}.${String(dayOfYear).padStart(3, '0')}.${hours}:${minutes}:${seconds}`;
    
    // Update local time
    const localHours = String(now.getHours()).padStart(2, '0');
    const localMinutes = String(now.getMinutes()).padStart(2, '0');
    const localSeconds = String(now.getSeconds()).padStart(2, '0');
    document.querySelector('.local-time').textContent = 
        `LOCAL: ${localHours}:${localMinutes}:${localSeconds}`;
    
    // Update solar cycle
    const dayOfYearReal = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    document.querySelector('.solar-cycle').textContent = `☀️ DAY ${dayOfYearReal}/365`;
}

function updatePopulation() {
    const populationElement = document.querySelector('.pop-number');
    const currentPop = parseInt(populationElement.textContent.replace(/,/g, ''));
    const change = Math.floor(Math.random() * 100000) - 50000;
    const newPop = currentPop + change;
    populationElement.textContent = newPop.toLocaleString();
    
    // Update growth rate
    const growthElement = document.querySelector('.pop-growth');
    const growthRate = (change / 365 / 24 / 60 / 60).toFixed(0); // per second
    growthElement.textContent = change > 0 ? `(+${Math.abs(change).toLocaleString()}/s)` : `(-${Math.abs(change).toLocaleString()}/s)`;
}

function updateGDP() {
    const gdpElement = document.querySelector('.gdp-number');
    const currentGDP = parseFloat(gdpElement.textContent.replace('$', '').replace('T', ''));
    const change = (Math.random() * 0.1 - 0.05).toFixed(3);
    const newGDP = currentGDP + parseFloat(change);
    gdpElement.textContent = `$${newGDP.toFixed(1)}T`;
    
    // Update growth rate
    const growthElement = document.querySelector('.gdp-growth');
    const growthRate = (change / currentGDP * 100).toFixed(2);
    growthElement.textContent = change > 0 ? `(+${growthRate}%/s)` : `(${growthRate}%/s)`;
}

function updateSeismicReadings() {
    const quakeList = document.querySelector('.quake-list');
    const quakes = quakeList.querySelectorAll('.quake-item');
    
    // Remove oldest quake if more than 5
    if (quakes.length >= 5) {
        quakes[0].remove();
    }
    
    // Add new quake
    const newQuake = document.createElement('div');
    newQuake.className = 'quake-item';
    newQuake.textContent = dataGenerators.earthquake();
    quakeList.appendChild(newQuake);
    
    // Update quake count
    const quakeCount = document.querySelector('.quakes-recent');
    const currentCount = parseInt(quakeCount.textContent.match(/\d+/)[0]);
    quakeCount.textContent = `RECENT QUAKES: ${currentCount + 1} (24H)`;
}

function updateWeatherSystems() {
    const systemList = document.querySelector('.system-list');
    const systems = systemList.querySelectorAll('.weather-system');
    
    // Randomly update one weather system
    if (systems.length > 0 && Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * systems.length);
        systems[randomIndex].textContent = dataGenerators.weather();
    }
}

function updateDataStream() {
    const streamContent = document.getElementById('dataStream');
    const generators = Object.values(dataGenerators);
    const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
    const newMessage = randomGenerator();
    
    // Add to beginning of array
    dashboardState.dataStreamMessages.unshift(newMessage);
    
    // Keep only last 20 messages
    if (dashboardState.dataStreamMessages.length > 20) {
        dashboardState.dataStreamMessages.pop();
    }
    
    // Update display
    streamContent.innerHTML = dashboardState.dataStreamMessages.map(msg => 
        `<span style="color: ${getRandomColor()}">${msg}</span>`
    ).join(' | ');
}

function getRandomColor() {
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88', '#ff8800', '#0088ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateResourceStatus() {
    // Update water resource
    const waterItem = document.querySelector('.resource-item:first-child .resource-value');
    const waterValue = (Math.random() * 0.1 + 2.45).toFixed(2);
    waterItem.textContent = `${waterValue}%`;
    
    // Update oil reserves
    const oilItem = document.querySelector('.resource-item:nth-child(2) .resource-value');
    const oilValue = (Math.random() * 0.1 + 1.65).toFixed(2);
    oilItem.textContent = `${oilValue}T bbl`;
    
    // Update energy mix
    const energySources = document.querySelectorAll('.energy-source');
    energySources.forEach(source => {
        const currentWidth = parseInt(source.style.width);
        const change = Math.random() * 2 - 1;
        const newWidth = Math.max(5, Math.min(35, currentWidth + change));
        source.style.width = `${newWidth}%`;
        
        // Update text
        const sourceName = source.textContent.split(' ')[1];
        const percentage = Math.round(newWidth);
        source.textContent = `${getEnergyIcon(sourceName)} ${sourceName} ${percentage}%`;
    });
}

function getEnergyIcon(source) {
    const icons = {
        'COAL': '⚫',
        'OIL': '🛢️',
        'GAS': '🔥',
        'NUCLEAR': '☢️',
        'RENEW': '🌱'
    };
    return icons[source] || '⚡';
}

function updateSystemInfo() {
    // Update data points
    dashboardState.dataPoints += Math.floor(Math.random() * 1000);
    document.querySelector('.data-points').textContent = 
        `DATA POINTS: ${dashboardState.dataPoints.toLocaleString()}`;
    
    // Update latency
    const latency = Math.floor(Math.random() * 20) + 5;
    document.querySelector('.latency').textContent = `LATENCY: ${latency}ms`;
    
    // Update uptime
    const uptime = (99.9 + Math.random() * 0.09).toFixed(3);
    document.querySelector('.uptime').textContent = `UPTIME: ${uptime}%`;
}

function updateGlobalHealth() {
    const healthIndicator = document.querySelector('.health-indicator');
    const currentHealth = parseInt(healthIndicator.textContent.match(/\d+/)[0]);
    const change = Math.random() * 2 - 1;
    const newHealth = Math.max(80, Math.min(95, currentHealth + change));
    healthIndicator.textContent = `HEALTH: ${Math.round(newHealth)}%`;
    
    // Update threat level randomly
    if (Math.random() > 0.95) {
        const threatLevels = ['🟢 LOW', '🟡 MODERATE', '🟠 ELEVATED', '🔴 HIGH'];
        const newThreat = threatLevels[Math.floor(Math.random() * threatLevels.length)];
        document.querySelector('.threat-level').textContent = `THREAT: ${newThreat}`;
    }
}

function updateBiodiversity() {
    // Update forest cover
    const forestFill = document.querySelector('.forest-fill');
    const forestText = document.querySelector('.forest-text');
    const currentWidth = parseInt(forestFill.style.width);
    const change = Math.random() * 0.1 - 0.05;
    const newWidth = Math.max(28, Math.min(33, currentWidth + change));
    forestFill.style.width = `${newWidth}%`;
    
    const forestArea = (4.06 * (newWidth / 31)).toFixed(2);
    forestText.textContent = `${newWidth.toFixed(1)}% (${forestArea}B ha)`;
    
    // Update deforestation rate
    const deforestation = document.querySelector('.deforestation');
    const rate = (Math.random() * 2 + 9).toFixed(1);
    deforestation.textContent = `📉 DEFORESTATION: -${rate}M ha/yr`;
}

function updateSpaceDebris() {
    const debrisCount = document.querySelector('.debris-count');
    const currentCount = parseInt(debrisCount.textContent.match(/[\d,]+/)[0].replace(',', ''));
    const change = Math.floor(Math.random() * 10) - 3;
    const newCount = currentCount + change;
    debrisCount.textContent = `⚠️ SPACE DEBRIS: ${newCount.toLocaleString()} TRACKED OBJECTS`;
}

// Animation functions
function animateElements() {
    // Pulse animation for alert items
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Glowing animation for important numbers
    const glowElements = document.querySelectorAll('.planet-code, .universal-time, .pop-number, .gdp-number');
    glowElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

function initDataStream() {
    // Initialize data stream with some messages
    for (let i = 0; i < 10; i++) {
        const generators = Object.values(dataGenerators);
        const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
        dashboardState.dataStreamMessages.push(randomGenerator());
    }
    updateDataStream();
}

// Main update loop
function mainUpdateLoop() {
    if (!dashboardState.isRunning) return;
    
    dashboardState.updateTime += dashboardState.updateFrequency;
    
    // Update clocks every second
    if (dashboardState.updateTime % 1000 < dashboardState.updateFrequency) {
        updateClocks();
    }
    
    // Update population every 2 seconds
    if (dashboardState.updateTime % 2000 < dashboardState.updateFrequency) {
        updatePopulation();
    }
    
    // Update GDP every 3 seconds
    if (dashboardState.updateTime % 3000 < dashboardState.updateFrequency) {
        updateGDP();
    }
    
    // Update seismic readings every 5 seconds
    if (dashboardState.updateTime % 5000 < dashboardState.updateFrequency) {
        updateSeismicReadings();
    }
    
    // Update data stream every 1.5 seconds
    if (dashboardState.updateTime % 1500 < dashboardState.updateFrequency) {
        updateDataStream();
    }
    
    // Update system info every second
    updateSystemInfo();
    
    // Update other elements less frequently
    if (dashboardState.updateTime % 4000 < dashboardState.updateFrequency) {
        updateWeatherSystems();
        updateResourceStatus();
        updateGlobalHealth();
    }
    
    if (dashboardState.updateTime % 7000 < dashboardState.updateFrequency) {
        updateBiodiversity();
        updateSpaceDebris();
    }
    
    requestAnimationFrame(mainUpdateLoop);
}

// Control functions
function toggleDashboard() {
    dashboardState.isRunning = !dashboardState.isRunning;
    if (dashboardState.isRunning) {
        mainUpdateLoop();
        document.querySelector('.control-btn:nth-child(1)').textContent = '⏸️ PAUSE';
    } else {
        document.querySelector('.control-btn:nth-child(1)').textContent = '▶️ RESUME';
    }
}

function refreshAll() {
    // Reset data points
    dashboardState.dataPoints = 2400000;
    
    // Update all components
    updateClocks();
    updatePopulation();
    updateGDP();
    updateSeismicReadings();
    updateWeatherSystems();
    updateDataStream();
    updateResourceStatus();
    updateGlobalHealth();
    updateBiodiversity();
    updateSpaceDebris();
    
    // Visual feedback
    const btn = document.querySelector('.control-btn:nth-child(1)');
    btn.style.background = 'rgba(0, 255, 255, 0.3)';
    setTimeout(() => {
        btn.style.background = '';
    }, 500);
}

function exportData() {
    // Create export data object
    const exportData = {
        timestamp: new Date().toISOString(),
        planet: 'TERRA PRIME',
        code: 'PX-789-Ω',
        population: document.querySelector('.pop-number').textContent,
        gdp: document.querySelector('.gdp-number').textContent,
        globalHealth: document.querySelector('.health-indicator').textContent,
        dataPoints: dashboardState.dataPoints,
        messages: dashboardState.dataStreamMessages.slice(0, 10)
    };
    
    // Create download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planetary_data_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function toggleDetails() {
    const panels = document.querySelectorAll('.tectonic-panel, .volcanic-panel, .topography-panel, .climate-zones, .weather-systems, .atmospheric-composition, .solar-wind-data, .population-panel, .biodiversity-panel, .resource-panel, .economic-panel');
    
    panels.forEach(panel => {
        const details = panel.querySelectorAll('.quake-list, .volcano-list, .precipitation-map, .gas-list, .aqi-scale, .demographic-breakdown, .density-map, .city-list, .species-count, .endangered-species, .resource-grid, .trade-routes, .economic-indicators');
        
        details.forEach(detail => {
            if (detail.style.display === 'none') {
                detail.style.display = '';
            } else {
                detail.style.display = 'none';
            }
        });
    });
}

// Initialize dashboard
function initDashboard() {
    console.log('Initializing Planetary Command Dashboard...');
    
    // Initialize data stream
    initDataStream();
    
    // Set up animations
    animateElements();
    
    // Set up control buttons
    document.querySelectorAll('.control-btn').forEach((btn, index) => {
        switch(index) {
            case 0: btn.addEventListener('click', toggleDashboard); break;
            case 1: btn.addEventListener('click', refreshAll); break;
            case 2: btn.addEventListener('click', exportData); break;
            case 3: btn.addEventListener('click', toggleDetails); break;
        }
    });
    
    // Start main update loop
    mainUpdateLoop();
    
    console.log('Dashboard initialized successfully');
    console.log('System ready for planetary monitoring');
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        dashboardState.isRunning = false;
    } else {
        dashboardState.isRunning = true;
        mainUpdateLoop();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch(e.key) {
            case 'r': 
                e.preventDefault();
                refreshAll();
                break;
            case 'e':
                e.preventDefault();
                exportData();
                break;
            case ' ':
                e.preventDefault();
                toggleDashboard();
                break;
            case 'd':
                e.preventDefault();
                toggleDetails();
                break;
        }
    }
});

// Add some initial dynamic behavior
setTimeout(() => {
    // Simulate initial data burst
    for (let i = 0; i < 5; i++) {
        setTimeout(updateDataStream, i * 300);
    }
}, 1000);
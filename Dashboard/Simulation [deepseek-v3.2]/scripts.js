// PLANETARY SIMULATION DASHBOARD - JAVASCRIPT
// Real-time simulation engine for planetary systems

// Global Variables
let simulationRunning = true;
let simulationSpeed = 1.0;
let simulationTime = 0;
let lastUpdateTime = Date.now();
let globeRotationSpeed = 0.002;
let globeCanvas, globeCtx;
let selectedRegion = "NORTH ATLANTIC";
let populationCounter = 8045311429;
let populationRate = 2.4; // Net increase per second
let dataFeeds = {};
let panelStates = {};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('⍟ TERRA-SIM v4.7.2 INITIALIZING...');
    
    // Initialize modules
    initDateTime();
    initGlobe();
    initDataFeeds();
    initEventListeners();
    initPanelStates();
    startSimulationLoop();
    
    console.log('✅ Dashboard initialized successfully');
    
    // Simulate initial data loading
    simulateInitialDataLoad();
});

// Initialize date/time display
function initDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const year = 2378;
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    document.getElementById('datetime').textContent = 
        `SIM TIME: YEAR ${year} • ${hours}:${minutes}:${seconds} UTC`;
    
    // Update uptime counter
    if (simulationRunning) {
        simulationTime += simulationSpeed;
        updateUptime();
    }
}

function updateUptime() {
    const days = Math.floor(simulationTime / 86400);
    const hours = Math.floor((simulationTime % 86400) / 3600);
    const minutes = Math.floor((simulationTime % 3600) / 60);
    const seconds = Math.floor(simulationTime % 60);
    
    document.getElementById('uptime').textContent = 
        `UPTIME: ${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize interactive globe
function initGlobe() {
    globeCanvas = document.getElementById('globe-canvas');
    globeCtx = globeCanvas.getContext('2d');
    
    // Set canvas size
    resizeGlobeCanvas();
    window.addEventListener('resize', resizeGlobeCanvas);
    
    // Start globe animation
    animateGlobe();
    
    // Initialize globe controls
    initGlobeControls();
}

function resizeGlobeCanvas() {
    const container = document.getElementById('globe-container');
    globeCanvas.width = container.clientWidth;
    globeCanvas.height = container.clientHeight;
    drawGlobe();
}

function drawGlobe() {
    const width = globeCanvas.width;
    const height = globeCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Clear canvas
    globeCtx.clearRect(0, 0, width, height);
    
    // Draw space background
    drawSpaceBackground(width, height);
    
    // Draw globe
    drawEarthGlobe(centerX, centerY, radius);
    
    // Draw grid if enabled
    if (panelStates.globeGrid) {
        drawGlobeGrid(centerX, centerY, radius);
    }
    
    // Draw coordinates if enabled
    if (panelStates.globeCoords) {
        drawCoordinates(centerX, centerY, radius);
    }
    
    // Draw selected region
    drawSelectedRegion(centerX, centerY, radius);
}

function drawSpaceBackground(width, height) {
    // Gradient background
    const gradient = globeCtx.createRadialGradient(
        width * 0.7, height * 0.3, 0,
        width * 0.7, height * 0.3, width * 0.8
    );
    gradient.addColorStop(0, 'rgba(10, 5, 30, 0.8)');
    gradient.addColorStop(1, 'rgba(5, 2, 15, 0.9)');
    
    globeCtx.fillStyle = gradient;
    globeCtx.fillRect(0, 0, width, height);
    
    // Starfield
    drawStarfield(width, height);
}

function drawStarfield(width, height) {
    globeCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Create a fixed star pattern for performance
    if (!window.starfieldPositions) {
        window.starfieldPositions = [];
        for (let i = 0; i < 150; i++) {
            window.starfieldPositions.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                brightness: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    window.starfieldPositions.forEach(star => {
        globeCtx.globalAlpha = star.brightness;
        globeCtx.beginPath();
        globeCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        globeCtx.fill();
    });
    globeCtx.globalAlpha = 1;
}

function drawEarthGlobe(centerX, centerY, radius) {
    // Draw globe shadow
    globeCtx.beginPath();
    globeCtx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    globeCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    globeCtx.fill();
    
    // Draw globe
    globeCtx.beginPath();
    globeCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    // Create gradient for Earth
    const gradient = globeCtx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, 0,
        centerX, centerY, radius
    );
    gradient.addColorStop(0, '#1a5fb4');
    gradient.addColorStop(0.3, '#26a269');
    gradient.addColorStop(0.6, '#8ff0a4');
    gradient.addColorStop(0.8, '#f5f5f5');
    gradient.addColorStop(1, '#c0bfbc');
    
    globeCtx.fillStyle = gradient;
    globeCtx.fill();
    
    // Draw continent outlines
    drawContinents(centerX, centerY, radius);
    
    // Draw atmosphere glow
    globeCtx.beginPath();
    globeCtx.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
    globeCtx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    globeCtx.lineWidth = 2;
    globeCtx.stroke();
    
    // Draw terminator line (day/night)
    drawTerminatorLine(centerX, centerY, radius);
}

function drawContinents(centerX, centerY, radius) {
    globeCtx.strokeStyle = 'rgba(30, 40, 60, 0.7)';
    globeCtx.lineWidth = 1;
    
    // Simplified continent shapes (in a real implementation, these would be proper geographic data)
    const continents = [
        { // North America
            color: '#2d5c3e',
            points: [
                {x: 0.2, y: 0.3}, {x: 0.3, y: 0.25}, {x: 0.4, y: 0.2},
                {x: 0.5, y: 0.25}, {x: 0.55, y: 0.4}, {x: 0.45, y: 0.5},
                {x: 0.35, y: 0.55}, {x: 0.25, y: 0.45}, {x: 0.2, y: 0.3}
            ]
        },
        { // South America
            color: '#3d6c4e',
            points: [
                {x: 0.4, y: 0.55}, {x: 0.5, y: 0.6}, {x: 0.6, y: 0.7},
                {x: 0.55, y: 0.8}, {x: 0.45, y: 0.75}, {x: 0.4, y: 0.65},
                {x: 0.35, y: 0.55}
            ]
        },
        { // Europe/Africa
            color: '#2d5c3e',
            points: [
                {x: 0.5, y: 0.3}, {x: 0.6, y: 0.25}, {x: 0.7, y: 0.3},
                {x: 0.75, y: 0.4}, {x: 0.7, y: 0.5}, {x: 0.65, y: 0.6},
                {x: 0.55, y: 0.65}, {x: 0.45, y: 0.6}, {x: 0.4, y: 0.5},
                {x: 0.45, y: 0.4}, {x: 0.5, y: 0.3}
            ]
        },
        { // Asia
            color: '#3d6c4e',
            points: [
                {x: 0.7, y: 0.2}, {x: 0.8, y: 0.25}, {x: 0.85, y: 0.35},
                {x: 0.9, y: 0.5}, {x: 0.85, y: 0.6}, {x: 0.75, y: 0.55},
                {x: 0.7, y: 0.45}, {x: 0.65, y: 0.35}, {x: 0.7, y: 0.2}
            ]
        },
        { // Australia
            color: '#4d7c5e',
            points: [
                {x: 0.85, y: 0.65}, {x: 0.9, y: 0.7}, {x: 0.95, y: 0.75},
                {x: 0.9, y: 0.8}, {x: 0.85, y: 0.75}, {x: 0.8, y: 0.7},
                {x: 0.85, y: 0.65}
            ]
        }
    ];
    
    continents.forEach(continent => {
        globeCtx.fillStyle = continent.color;
        globeCtx.beginPath();
        
        continent.points.forEach((point, index) => {
            const x = centerX + (point.x - 0.5) * radius * 1.8;
            const y = centerY + (point.y - 0.5) * radius * 1.8;
            
            if (index === 0) {
                globeCtx.moveTo(x, y);
            } else {
                globeCtx.lineTo(x, y);
            }
        });
        
        globeCtx.closePath();
        globeCtx.fill();
        globeCtx.stroke();
    });
}

function drawTerminatorLine(centerX, centerY, radius) {
    const time = Date.now() * 0.001;
    const angle = time * 0.1;
    
    globeCtx.beginPath();
    globeCtx.ellipse(
        centerX + Math.cos(angle) * radius * 0.3,
        centerY,
        radius * 0.7,
        radius,
        0, 0, Math.PI * 2
    );
    globeCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    globeCtx.lineWidth = 3;
    globeCtx.stroke();
}

function drawGlobeGrid(centerX, centerY, radius) {
    globeCtx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    globeCtx.lineWidth = 0.5;
    
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
        const latRad = (lat * Math.PI) / 180;
        const y = centerY + Math.sin(latRad) * radius;
        const xRadius = Math.cos(latRad) * radius;
        
        globeCtx.beginPath();
        globeCtx.ellipse(centerX, y, xRadius, radius * 0.05, 0, 0, Math.PI * 2);
        globeCtx.stroke();
    }
    
    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
        const lonRad = (lon * Math.PI) / 180;
        const x1 = centerX + Math.cos(lonRad) * radius;
        const y1 = centerY + Math.sin(lonRad) * radius;
        const x2 = centerX + Math.cos(lonRad + Math.PI) * radius;
        const y2 = centerY + Math.sin(lonRad + Math.PI) * radius;
        
        globeCtx.beginPath();
        globeCtx.moveTo(x1, y1);
        globeCtx.lineTo(x2, y2);
        globeCtx.stroke();
    }
}

function drawCoordinates(centerX, centerY, radius) {
    globeCtx.fillStyle = 'rgba(0, 243, 255, 0.6)';
    globeCtx.font = '10px "Share Tech Mono"';
    globeCtx.textAlign = 'center';
    
    // Label some coordinates
    const coordinates = [
        {lat: 0, lon: 0, label: '0°, 0°'},
        {lat: 90, lon: 0, label: 'N Pole'},
        {lat: -90, lon: 0, label: 'S Pole'},
        {lat: 0, lon: 90, label: '90°E'},
        {lat: 0, lon: -90, label: '90°W'},
        {lat: 0, lon: 180, label: '180°'}
    ];
    
    coordinates.forEach(coord => {
        const latRad = (coord.lat * Math.PI) / 180;
        const lonRad = (coord.lon * Math.PI) / 180;
        
        const x = centerX + Math.cos(latRad) * Math.cos(lonRad) * radius;
        const y = centerY + Math.cos(latRad) * Math.sin(lonRad) * radius;
        
        globeCtx.fillText(coord.label, x, y);
    });
}

function drawSelectedRegion(centerX, centerY, radius) {
    // Highlight North Atlantic region
    const regionPoints = [
        {x: 0.4, y: 0.4}, {x: 0.5, y: 0.35}, {x: 0.6, y: 0.4},
        {x: 0.55, y: 0.5}, {x: 0.45, y: 0.55}, {x: 0.4, y: 0.4}
    ];
    
    globeCtx.strokeStyle = 'rgba(255, 0, 200, 0.6)';
    globeCtx.fillStyle = 'rgba(255, 0, 200, 0.1)';
    globeCtx.lineWidth = 2;
    
    globeCtx.beginPath();
    regionPoints.forEach((point, index) => {
        const x = centerX + (point.x - 0.5) * radius * 1.8;
        const y = centerY + (point.y - 0.5) * radius * 1.8;
        
        if (index === 0) {
            globeCtx.moveTo(x, y);
        } else {
            globeCtx.lineTo(x, y);
        }
    });
    
    globeCtx.closePath();
    globeCtx.fill();
    globeCtx.stroke();
    
    // Add pulsing dot
    const pulseTime = Date.now() * 0.001;
    const pulseSize = 5 + Math.sin(pulseTime * 3) * 2;
    
    const dotX = centerX + (0.5 - 0.5) * radius * 1.8;
    const dotY = centerY + (0.45 - 0.5) * radius * 1.8;
    
    globeCtx.beginPath();
    globeCtx.arc(dotX, dotY, pulseSize, 0, Math.PI * 2);
    globeCtx.fillStyle = 'rgba(255, 0, 200, 0.8)';
    globeCtx.fill();
}

function animateGlobe() {
    drawGlobe();
    requestAnimationFrame(animateGlobe);
}

// Initialize globe controls
function initGlobeControls() {
    // Rotation controls
    document.getElementById('rotate-stop').addEventListener('click', () => {
        globeRotationSpeed = 0;
        updateActiveButton('rotate-stop');
    });
    
    document.getElementById('rotate-slow').addEventListener('click', () => {
        globeRotationSpeed = 0.002;
        updateActiveButton('rotate-slow');
    });
    
    document.getElementById('rotate-fast').addEventListener('click', () => {
        globeRotationSpeed = 0.01;
        updateActiveButton('rotate-fast');
    });
    
    // Zoom controls
    document.getElementById('zoom-out').addEventListener('click', () => {
        // In a real implementation, this would adjust camera zoom
        showNotification('Zoom level decreased', 'info');
    });
    
    document.getElementById('zoom-reset').addEventListener('click', () => {
        showNotification('Zoom reset to default', 'info');
    });
    
    document.getElementById('zoom-in').addEventListener('click', () => {
        showNotification('Zoom level increased', 'info');
    });
    
    // Grid/coordinate toggles
    document.getElementById('grid-toggle').addEventListener('click', function() {
        panelStates.globeGrid = !panelStates.globeGrid;
        this.classList.toggle('active');
        showNotification(panelStates.globeGrid ? 'Grid enabled' : 'Grid disabled', 'info');
    });
    
    document.getElementById('coords-toggle').addEventListener('click', function() {
        panelStates.globeCoords = !panelStates.globeCoords;
        this.classList.toggle('active');
        showNotification(panelStates.globeCoords ? 'Coordinates enabled' : 'Coordinates disabled', 'info');
    });
    
    // View mode buttons
    document.querySelectorAll('[data-view]').forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            updateActiveButton(this.id);
            showNotification(`Switched to ${view.toUpperCase()} view`, 'info');
            
            // Update globe visualization based on view
            // (In a full implementation, this would change shaders/textures)
        });
    });
}

// Initialize data feeds
function initDataFeeds() {
    dataFeeds = {
        tectonic: {
            interval: 5000,
            lastUpdate: 0,
            data: []
        },
        weather: {
            interval: 3000,
            lastUpdate: 0,
            data: []
        },
        population: {
            interval: 1000,
            lastUpdate: 0,
            data: []
        },
        energy: {
            interval: 10000,
            lastUpdate: 0,
            data: []
        }
    };
}

// Initialize event listeners
function initEventListeners() {
    // Simulation speed controls
    document.querySelectorAll('.speed-control').forEach(button => {
        button.addEventListener('click', function() {
            simulationSpeed = parseFloat(this.getAttribute('data-speed'));
            document.getElementById('sim-speed').textContent = `${simulationSpeed}x`;
            
            // Update active state
            document.querySelectorAll('.speed-control').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            showNotification(`Simulation speed set to ${simulationSpeed}x`, 'info');
        });
    });
    
    // Panel controls
    document.querySelectorAll('.panel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.getAttribute('data-panel');
            const view = this.getAttribute('data-view');
            
            if (panel) {
                // Panel mode switch
                updateActiveButton(this.id, `.panel-btn[data-panel="${panel}"]`);
                showNotification(`Switched to ${panel.toUpperCase()} mode`, 'info');
            }
            
            if (view) {
                // View mode switch
                updateActiveButton(this.id, `.panel-btn[data-view="${view}"]`);
            }
        });
    });
    
    // Footer controls
    document.getElementById('pause-sim').addEventListener('click', function() {
        simulationRunning = !simulationRunning;
        
        if (simulationRunning) {
            this.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
            showNotification('Simulation resumed', 'success');
        } else {
            this.innerHTML = '<i class="fas fa-play"></i> RESUME';
            showNotification('Simulation paused', 'warning');
        }
    });
    
    document.getElementById('reset-sim').addEventListener('click', function() {
        if (confirm('Reset simulation to initial state? This will clear all collected data.')) {
            simulationTime = 0;
            populationCounter = 8045311429;
            updatePopulationCounter();
            showNotification('Simulation reset to initial state', 'warning');
        }
    });
    
    document.getElementById('export-data').addEventListener('click', function() {
        exportSimulationData();
    });
    
    // Modal close button
    document.getElementById('modal-close').addEventListener('click', function() {
        document.getElementById('modal-overlay').style.display = 'none';
    });
    
    // Close modal when clicking outside
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Feed items click for details
    document.querySelectorAll('.feed-item, .alert-item, .trade-item').forEach(item => {
        item.addEventListener('click', function() {
            showDetailModal(this);
        });
    });
}

// Initialize panel states
function initPanelStates() {
    panelStates = {
        globeGrid: true,
        globeCoords: false,
        corePanel: 'live',
        climatePanel: 'global',
        bioPanel: 'biodiv',
        humanPanel: 'pop',
        energyPanel: 'prod'
    };
}

// Main simulation loop
function startSimulationLoop() {
    setInterval(updateSimulation, 1000 / 30); // 30fps
}

function updateSimulation() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTime) / 1000;
    
    if (simulationRunning) {
        // Update population counter
        if (currentTime - dataFeeds.population.lastUpdate >= dataFeeds.population.interval) {
            updatePopulationCounter();
            dataFeeds.population.lastUpdate = currentTime;
        }
        
        // Update tectonic feed
        if (currentTime - dataFeeds.tectonic.lastUpdate >= dataFeeds.tectonic.interval) {
            updateTectonicFeed();
            dataFeeds.tectonic.lastUpdate = currentTime;
        }
        
        // Update weather feed
        if (currentTime - dataFeeds.weather.lastUpdate >= dataFeeds.weather.interval) {
            updateWeatherFeed();
            dataFeeds.weather.lastUpdate = currentTime;
        }
        
        // Update energy production
        if (currentTime - dataFeeds.energy.lastUpdate >= dataFeeds.energy.interval) {
            updateEnergyProduction();
            dataFeeds.energy.lastUpdate = currentTime;
        }
        
        // Update random metrics
        updateRandomMetrics();
        
        // Update system load indicator
        updateSystemLoad();
    }
    
    lastUpdateTime = currentTime;
}

// Update population counter
function updatePopulationCounter() {
    // Increase population based on rate
    populationCounter += populationRate * simulationSpeed;
    
    // Format with commas
    const formattedPopulation = Math.floor(populationCounter).toLocaleString();
    document.getElementById('population-counter').textContent = formattedPopulation;
    
    // Update net change indicator
    const popChange = document.querySelector('.pop-change');
    popChange.textContent = `+1.05% annually • Net +${populationRate.toFixed(1)}/sec`;
}

// Update tectonic activity feed
function updateTectonicFeed() {
    const feedContainer = document.querySelector('.tectonic-feed .feed-container');
    const feedItems = feedContainer.querySelectorAll('.feed-item');
    
    // Shift items up
    feedItems.forEach((item, index) => {
        if (index < feedItems.length - 1) {
            const nextItem = feedItems[index + 1];
            
            // Copy data from next item
            const timeSpan = item.querySelector('.feed-time');
            const nextTimeSpan = nextItem.querySelector('.feed-time');
            if (timeSpan && nextTimeSpan) timeSpan.textContent = nextTimeSpan.textContent;
            
            // Update other fields similarly...
        }
    });
    
    // Add new random event at bottom
    const lastItem = feedItems[feedItems.length - 1];
    const eventTypes = ['quake', 'volcano', 'tremor', 'drift'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Update last item with new data
    if (lastItem) {
        lastItem.className = `feed-item ${eventType}`;
        
        const timeSpan = lastItem.querySelector('.feed-time');
        if (timeSpan) timeSpan.textContent = timeString;
        
        // Random location based on event type
        let location = '';
        if (eventType === 'quake') location = 'RING OF FIRE';
        else if (eventType === 'volcano') location = 'MOUNT VESUVIA';
        else if (eventType === 'tremor') location = 'HIMALAYAN BELT';
        else location = 'PACIFIC PLATE';
        
        const locationSpan = lastItem.querySelector('.feed-location');
        if (locationSpan) {
            locationSpan.innerHTML = `<i class="fas fa-${eventType === 'volcano' ? 'fire' : 'map-marker-alt'}"></i> ${location}`;
        }
        
        // Random magnitude
        let magnitude = '';
        if (eventType === 'quake' || eventType === 'tremor') {
            magnitude = `M ${(Math.random() * 3 + 4).toFixed(1)}`;
        } else if (eventType === 'volcano') {
            magnitude = `VEI ${Math.floor(Math.random() * 4 + 1)}`;
        } else {
            magnitude = `${(Math.random() * 5 + 5).toFixed(1)}cm/yr`;
        }
        
        const magnitudeSpan = lastItem.querySelector('.feed-magnitude');
        if (magnitudeSpan) magnitudeSpan.textContent = magnitude;
    }
}

// Update weather feed
function updateWeatherFeed() {
    const alertsContainer = document.querySelector('.weather-feed .alerts-container');
    const alertItems = alertsContainer.querySelectorAll('.alert-item');
    
    // Update intensity values slightly
    alertItems.forEach(item => {
        const intensitySpan = item.querySelector('.alert-intensity');
        if (intensitySpan) {
            const currentValue = intensitySpan.textContent;
            let newValue = '';
            
            if (currentValue.includes('CAT')) {
                // Hurricane category
                const cat = parseInt(currentValue.split(' ')[1]);
                const newCat = Math.min(5, Math.max(1, cat + (Math.random() > 0.5 ? 1 : -1)));
                newValue = `CAT ${newCat}`;
            } else if (currentValue.includes('°C')) {
                // Temperature
                const temp = parseFloat(currentValue);
                const newTemp = temp + (Math.random() * 2 - 1);
                newValue = `${newTemp.toFixed(1)}°C`;
            } else if (currentValue.includes('mm')) {
                // Rainfall
                const rain = parseFloat(currentValue);
                const newRain = rain + (Math.random() * 100 - 50);
                newValue = `${Math.max(0, newRain).toFixed(0)}mm`;
            } else if (currentValue.includes('km²')) {
                // Wildfire area
                const area = parseFloat(currentValue);
                const newArea = area + (Math.random() * 200 - 100);
                newValue = `${Math.max(0, newArea).toFixed(0)} km²`;
            }
            
            if (newValue) intensitySpan.textContent = newValue;
        }
    });
}

// Update energy production
function updateEnergyProduction() {
    // Update energy source percentages slightly
    const sources = ['oil', 'coal', 'gas', 'renewables', 'nuclear'];
    
    sources.forEach(source => {
        const sourceItem = document.querySelector(`.source-item.${source}`);
        if (sourceItem) {
            const valueSpan = sourceItem.querySelector('.source-value');
            const barFill = sourceItem.querySelector('.source-fill');
            
            if (valueSpan && barFill) {
                const currentValue = parseFloat(valueSpan.textContent);
                const change = (Math.random() * 0.4 - 0.2); // Random change between -0.2 and +0.2
                const newValue = Math.max(0, Math.min(100, currentValue + change));
                
                valueSpan.textContent = `${newValue.toFixed(1)}%`;
                barFill.style.width = `${newValue}%`;
            }
        }
    });
}

// Update random metrics
function updateRandomMetrics() {
    // Update random metric values slightly
    const metricItems = document.querySelectorAll('.metric-item:not(.critical)');
    
    metricItems.forEach(item => {
        if (Math.random() > 0.7) { // 30% chance to update each frame
            const valueSpan = item.querySelector('.metric-value');
            const changeSpan = item.querySelector('.metric-change');
            const barFill = item.querySelector('.metric-fill');
            
            if (valueSpan && !valueSpan.textContent.includes('°C')) {
                const parts = valueSpan.textContent.split(' ');
                if (parts.length > 0) {
                    const numericValue = parseFloat(parts[0]);
                    if (!isNaN(numericValue)) {
                        const change = (Math.random() * 0.1 - 0.05); // Small random change
                        const newValue = Math.max(0, numericValue + change);
                        
                        valueSpan.textContent = `${newValue.toFixed(2)}${parts.length > 1 ? ' ' + parts[1] : ''}`;
                        
                        if (changeSpan) {
                            const changeValue = parseFloat(changeSpan.textContent.replace(/[+-]/g, ''));
                            if (!isNaN(changeValue)) {
                                const newChange = changeValue + (Math.random() * 0.01 - 0.005);
                                changeSpan.textContent = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(3)}`;
                            }
                        }
                        
                        if (barFill) {
                            const currentWidth = parseFloat(barFill.style.width);
                            if (!isNaN(currentWidth)) {
                                const newWidth = Math.max(0, Math.min(100, currentWidth + change * 10));
                                barFill.style.width = `${newWidth}%`;
                            }
                        }
                    }
                }
            }
        }
    });
}

// Update system load indicator
function updateSystemLoad() {
    const loadElement = document.getElementById('system-load');
    const loadFill = document.querySelector('.load-fill');
    
    if (loadElement && loadFill) {
        // Simulate varying system load
        const baseLoad = 87;
        const variation = Math.sin(Date.now() * 0.001) * 3;
        const currentLoad = Math.max(10, Math.min(99, baseLoad + variation));
        
        loadElement.textContent = `${Math.round(currentLoad)}%`;
        loadFill.style.width = `${currentLoad}%`;
        
        // Change color based on load
        if (currentLoad > 90) {
            loadFill.style.background = 'linear-gradient(90deg, var(--neon-orange), var(--neon-red))';
        } else if (currentLoad > 80) {
            loadFill.style.background = 'linear-gradient(90deg, var(--neon-yellow), var(--neon-orange))';
        } else {
            loadFill.style.background = 'linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))';
        }
    }
}

// Show detail modal
function showDetailModal(element) {
    const modal = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Determine content based on element type
    let title = '';
    let content = '';
    
    if (element.classList.contains('feed-item')) {
        const location = element.querySelector('.feed-location').textContent;
        const magnitude = element.querySelector('.feed-magnitude').textContent;
        const status = element.querySelector('.feed-status').textContent;
        
        title = `Tectonic Event: ${location}`;
        content = `
            <div class="modal-detail">
                <div class="detail-row">
                    <span class="detail-label">Magnitude:</span>
                    <span class="detail-value">${magnitude}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${element.querySelector('.feed-time').textContent}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Depth:</span>
                    <span class="detail-value">${element.querySelector('.feed-depth').textContent}</span>
                </div>
                <div class="detail-description">
                    <p>Detailed seismic analysis and impact assessment would appear here in a full implementation.</p>
                </div>
            </div>
        `;
    } else if (element.classList.contains('alert-item')) {
        const location = element.querySelector('.alert-location').textContent;
        const intensity = element.querySelector('.alert-intensity').textContent;
        
        title = `Weather Alert: ${location}`;
        content = `
            <div class="modal-detail">
                <div class="detail-row">
                    <span class="detail-label">Intensity:</span>
                    <span class="detail-value">${intensity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${element.querySelector('.alert-status').textContent}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${element.classList.contains('hurricane') ? 'Hurricane' : 
                                               element.classList.contains('heatwave') ? 'Heat Wave' :
                                               element.classList.contains('flood') ? 'Flood' : 'Wildfire'}</span>
                </div>
                <div class="detail-description">
                    <p>Detailed meteorological data, forecast models, and emergency response information would appear here.</p>
                </div>
            </div>
        `;
    }
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

// Export simulation data
function exportSimulationData() {
    const data = {
        timestamp: new Date().toISOString(),
        simulationTime: simulationTime,
        simulationSpeed: simulationSpeed,
        population: populationCounter,
        metrics: {
            coreTemp: '6,027°C',
            globalTemp: '15.2°C',
            co2Concentration: '418 ppm',
            extinctionRate: '150/day',
            energyProduction: '178,421 TWh/yr'
        }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `terra-sim-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Data exported successfully', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span class="notification-text">${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? 'rgba(0, 255, 157, 0.9)' : 
                         type === 'warning' ? 'rgba(255, 221, 0, 0.9)' : 
                         'rgba(0, 243, 255, 0.9)'};
        color: var(--primary-dark);
        padding: 0.75rem 1rem;
        border-radius: var(--radius-base);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Update active button state
function updateActiveButton(buttonId, selector = null) {
    if (selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('active');
    }
}

// Simulate initial data load
function simulateInitialDataLoad() {
    // Show loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progress >= 100) {
            clearInterval(interval);
            showNotification('All data feeds initialized and active', 'success');
        }
    }, 50);
}

// Add CSS for modal details
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-detail {
        font-family: var(--font-body);
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(0, 243, 255, 0.1);
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .detail-label {
        color: #8a8aff;
        font-family: var(--font-mono);
        font-size: 0.9rem;
    }
    
    .detail-value {
        color: white;
        font-weight: 700;
        font-family: var(--font-heading);
    }
    
    .detail-description {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: rgba(0, 10, 20, 0.5);
        border-radius: var(--radius-base);
        border: 1px solid rgba(0, 243, 255, 0.1);
        color: #c0c0ff;
        font-size: 0.9rem;
        line-height: 1.5;
    }
`;
document.head.appendChild(modalStyles);

// Performance optimization for 4K
function optimizeFor4K() {
    // Reduce animation frequency on very high resolution
    if (window.innerWidth >= 3840) {
        // Adjust intervals for better performance
        dataFeeds.tectonic.interval = 8000;
        dataFeeds.weather.interval = 5000;
        
        // Throttle some animations
        const originalUpdateSimulation = updateSimulation;
        let frameCount = 0;
        updateSimulation = function() {
            frameCount++;
            if (frameCount % 2 === 0) { // Update every other frame
                originalUpdateSimulation();
            }
        };
    }
}

// Call optimization
optimizeFor4K();

// Export functions for debugging
window.simulator = {
    pauseSimulation: function() {
        simulationRunning = false;
        showNotification('Simulation paused via console', 'warning');
    },
    resumeSimulation: function() {
        simulationRunning = true;
        showNotification('Simulation resumed via console', 'success');
    },
    setSpeed: function(speed) {
        simulationSpeed = speed;
        document.getElementById('sim-speed').textContent = `${speed}x`;
        showNotification(`Simulation speed set to ${speed}x via console`, 'info');
    },
    getStats: function() {
        return {
            simulationTime,
            simulationSpeed,
            population: populationCounter,
            running: simulationRunning
        };
    }
};

console.log('🚀 Planetary Simulation Dashboard JavaScript loaded');
console.log('📊 Available console commands:');
console.log('  - simulator.pauseSimulation()');
console.log('  - simulator.resumeSimulation()');
console.log('  - simulator.setSpeed(2.5)');
console.log('  - simulator.getStats()');
// ============================================
// ABYSSAL WATCH - Deep-Sea Research Station
// Primary Dashboard Operations Script
// ============================================

// Global state
const state = {
    depth: 10876, // meters at Challenger Deep
    pressure: 1088.6, // atmospheres
    temperature: 2.1,
    salinity: 34.5,
    currentSpeed: 0.3,
    currentDirection: 45, // degrees
    hullIntegrity: 100,
    pingRate: 1.0,
    faunaCount: 0,
    systemStatus: 'NOMINAL', // NOMINAL, WARNING, CRITICAL
    alerts: [],
    fauna: [],
    damageLog: [],
    lastPingTime: 0,
    autoPingInterval: null,
    simulationInterval: null
};

// Canvas contexts
let viewportCanvas, viewportCtx;
let currentFlowCanvas, currentFlowCtx;

// Particle systems
let bioluminescentParticles = [];
let currentFlowParticles = [];

// DOM element references
const elements = {};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

function init() {
    cacheElements();
    setupCanvases();
    initializeParticles();
    setupEventListeners();
    startSimulation();
    startAutoPing();
    startClock();
    animate();
}

function cacheElements() {
    // Cache all DOM elements for performance
    const elementIds = [
        'primary-depth', 'depth-ring-fill', 'ambient-overlay', 'hull-cracks',
        'status-indicator', 'status-text', 'pressure-warning-indicator',
        'current-date', 'current-time', 'pressure-value', 'pressure-bar-fill',
        'pressure-trend', 'trend-indicator', 'klaxon-bar', 'klaxon-fill',
        'klaxon-warning', 'temperature', 'salinity', 'current-speed-env',
        'visibility', 'sonar-sweep', 'sonar-blips', 'sonar-ping-ripples',
        'manual-ping', 'ping-rate', 'fauna-count-badge', 'fauna-list',
        'integrity-percentage', 'hull-fore-port', 'hull-fore-starboard',
        'hull-mid-port', 'hull-mid-starboard', 'hull-aft-port',
        'hull-aft-starboard', 'damage-log', 'current-flow-canvas',
        'flow-intensity', 'flow-direction', 'alert-overlay', 'alert-message'
    ];
    
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
    });
}

function setupCanvases() {
    // Viewport canvas for bioluminescent particles
    viewportCanvas = document.getElementById('viewport');
    viewportCtx = viewportCanvas.getContext('2d');
    
    // Current flow canvas
    currentFlowCanvas = document.getElementById('current-flow-canvas');
    currentFlowCtx = currentFlowCanvas.getContext('2d');
    
    // Resize canvases to fill containers
    function resizeCanvases() {
        // Viewport fills window
        viewportCanvas.width = window.innerWidth;
        viewportCanvas.height = window.innerHeight;
        
        // Current flow canvas
        const flowContainer = currentFlowCanvas.parentElement;
        currentFlowCanvas.width = flowContainer.clientWidth;
        currentFlowCanvas.height = flowContainer.clientHeight;
    }
    
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
}

function initializeParticles() {
    // Create bioluminescent particles
    for (let i = 0; i < 150; i++) {
        bioluminescentParticles.push(createBioluminescentParticle());
    }
    
    // Create current flow particles
    for (let i = 0; i < 80; i++) {
        currentFlowParticles.push(createCurrentFlowParticle());
    }
}

function createBioluminescentParticle() {
    const types = ['jellyfish', 'viperfish', 'squid', 'unknown'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const colors = {
        jellyfish: { r: 0, g: 240, b: 255 },   // Cyan
        viperfish: { r: 255, g: 136, b: 0 },   // Orange
        squid: { r: 136, g: 0, b: 255 },       // Purple
        unknown: { r: 255, g: 51, b: 68 }      // Red
    };
    
    return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[type],
        type: type,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.5 + 0.3
    };
}

function createCurrentFlowParticle() {
    return {
        x: Math.random() * currentFlowCanvas.width,
        y: Math.random() * currentFlowCanvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 1,
        angle: state.currentDirection * (Math.PI / 180),
        opacity: Math.random() * 0.4 + 0.1,
        trail: []
    };
}

function startClock() {
    function updateClock() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '/');
        
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        elements['current-date'].textContent = dateStr;
        elements['current-time'].textContent = timeStr;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

function startSimulation() {
    // Simulate sensor data updates every 2 seconds
    state.simulationInterval = setInterval(() => {
        updateSensorData();
        updateFauna();
        updateHullIntegrity();
    }, 2000);
    
    // More frequent updates for some values
    setInterval(() => {
        updateDepthPressure();
        updateEnvironment();
    }, 1000);
}

function updateDepthPressure() {
    // Simulate depth changes (small variations)
    const depthChange = (Math.random() - 0.5) * 2;
    state.depth = Math.max(0, state.depth + depthChange);
    state.pressure = (state.depth / 10) + (Math.random() * 0.2 - 0.1);
    
    // Update depth ring
    const maxDepth = 11000;
    const depthPercent = state.depth / maxDepth;
    const circumference = 339.292;
    const offset = circumference - (depthPercent * circumference);
    elements['depth-ring-fill'].style.strokeDashoffset = offset;
    elements['primary-depth'].textContent = Math.round(state.depth);
    
    // Update pressure display
    elements['pressure-value'].textContent = state.pressure.toFixed(1);
    const pressurePercent = Math.min(100, (state.pressure / 500) * 100);
    elements['pressure-bar-fill'].style.width = `${pressurePercent}%`;
    
    // Update pressure trend
    const trend = (Math.random() * 0.4 - 0.2).toFixed(1);
    elements['pressure-trend'].textContent = trend;
    const trendIndicator = elements['trend-indicator'];
    if (trend > 0) {
        trendIndicator.textContent = '↑';
        trendIndicator.className = 'trend-indicator up';
    } else if (trend < 0) {
        trendIndicator.textContent = '↓';
        trendIndicator.className = 'trend-indicator down';
    } else {
        trendIndicator.textContent = '→';
        trendIndicator.className = 'trend-indicator';
    }
    
    // Update klaxon bar based on pressure
    updatePressureWarnings();
}

function updatePressureWarnings() {
    const pressureValue = parseFloat(elements['pressure-value'].textContent);
    const klaxonBar = elements['klaxon-bar'];
    const klaxonFill = elements['klaxon-fill'];
    const klaxonWarning = elements['klaxon-warning'];
    const pressureBarFill = elements['pressure-bar-fill'];
    const pressureValueDisplay = elements['pressure-value'];
    const pressureWarningIndicator = elements['pressure-warning-indicator'];
    const statusIndicator = elements['status-indicator'];
    const statusText = elements['status-text'];
    
    // Reset classes
    pressureBarFill.classList.remove('warning', 'critical');
    pressureValueDisplay.classList.remove('warning', 'critical');
    statusIndicator.classList.remove('warning', 'critical');
    statusText.textContent = 'ALL SYSTEMS NOMINAL';
    klaxonBar.classList.remove('active');
    klaxonWarning.classList.remove('active');
    pressureWarningIndicator.classList.remove('active');
    
    if (pressureValue > 450) {
        // Critical
        pressureBarFill.classList.add('critical');
        pressureValueDisplay.classList.add('critical');
        statusIndicator.classList.add('critical');
        statusText.textContent = 'CRITICAL PRESSURE';
        klaxonBar.classList.add('active');
        klaxonWarning.classList.add('active');
        pressureWarningIndicator.classList.add('active');
        
        // Trigger alert overlay
        showAlert('CRITICAL HULL PRESSURE - IMMEDIATE ACTION REQUIRED');
    } else if (pressureValue > 300) {
        // Warning
        pressureBarFill.classList.add('warning');
        pressureValueDisplay.classList.add('warning');
        statusIndicator.classList.add('warning');
        statusText.textContent = 'PRESSURE ELEVATED';
        klaxonBar.classList.add('active');
        pressureWarningIndicator.classList.add('active');
    }
}

function updateEnvironment() {
    // Simulate small environmental changes
    state.temperature += (Math.random() - 0.5) * 0.1;
    state.salinity += (Math.random() - 0.5) * 0.1;
    state.currentSpeed += (Math.random() - 0.5) * 0.1;
    state.currentDirection += (Math.random() - 0.5) * 5;
    
    // Clamp values
    state.temperature = Math.max(0, Math.min(4, state.temperature));
    state.salinity = Math.max(30, Math.min(37, state.salinity));
    state.currentSpeed = Math.max(0, Math.min(2, state.currentSpeed));
    state.currentDirection = (state.currentDirection + 360) % 360;
    
    // Update display
    elements['temperature'].textContent = state.temperature.toFixed(1);
    elements['salinity'].textContent = state.salinity.toFixed(1);
    elements['current-speed-env'].textContent = state.currentSpeed.toFixed(1);
    elements['flow-intensity'].textContent = `${state.currentSpeed.toFixed(1)} m/s`;
    
    // Update flow direction arrow
    const arrow = elements['flow-direction'].querySelector('.direction-arrow');
    arrow.style.transform = `rotate(${state.currentDirection}deg)`;
    
    // Update current flow particles
    currentFlowParticles.forEach(p => {
        p.angle = state.currentDirection * (Math.PI / 180);
    });
}

function updateSensorData() {
    // Simulate various sensor readings
    // This could be expanded with more realistic data patterns
}

function updateFauna() {
    // Randomly add or remove fauna
    const shouldAdd = Math.random() > 0.7;
    const shouldRemove = Math.random() > 0.9 && state.fauna.length > 0;
    
    if (shouldAdd && state.fauna.length < 10) {
        addRandomFauna();
    }
    
    if (shouldRemove && state.fauna.length > 0) {
        const index = Math.floor(Math.random() * state.fauna.length);
        state.fauna.splice(index, 1);
    }
    
    // Update fauna count
    elements['fauna-count-badge'].textContent = state.fauna.length;
    
    // Update fauna list
    renderFaunaList();
}

function addRandomFauna() {
    const types = [
        { name: 'Aequorea Victoria', type: 'jellyfish', size: '12cm', distance: Math.floor(Math.random() * 500) + 50 },
        { name: 'Chauliodus Sloani', type: 'viperfish', size: '30cm', distance: Math.floor(Math.random() * 800) + 100 },
        { name: 'Architeuthis Dux', type: 'giant squid', size: '10m', distance: Math.floor(Math.random() * 2000) + 500 },
        { name: 'Unknown Specimen', type: 'unknown', size: '???', distance: Math.floor(Math.random() * 300) + 20 }
    ];
    
    const fauna = types[Math.floor(Math.random() * types.length)];
    state.fauna.push({
        ...fauna,
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
    
    // Add sonar blip for new fauna
    addSonarBlip();
}

function renderFaunaList() {
    const listContainer = elements['fauna-list'];
    listContainer.innerHTML = '';
    
    // Sort by distance (closest first)
    const sortedFauna = [...state.fauna].sort((a, b) => a.distance - b.distance);
    
    sortedFauna.forEach(f => {
        const item = document.createElement('div');
        item.className = `fauna-item type-${f.type}`;
        item.innerHTML = `
            <div class="fauna-info">
                <div class="fauna-name">${f.name}</div>
                <div class="fauna-details">Size: ${f.size} | Detected: ${f.time}</div>
            </div>
            <div class="fauna-distance">${f.distance}m</div>
        `;
        listContainer.appendChild(item);
    });
}

function updateHullIntegrity() {
    // Random chance of hull damage
    if (state.hullIntegrity > 30 && Math.random() > 0.95) {
        const damageAmount = Math.random() * 2 + 0.5;
        state.hullIntegrity = Math.max(0, state.hullIntegrity - damageAmount);
        
        // Add damage log entry
        const sections = ['fore-port', 'fore-starboard', 'mid-port', 'mid-starboard', 'aft-port', 'aft-starboard'];
        const damagedSection = sections[Math.floor(Math.random() * sections.length)];
        
        addDamageLog(damagedSection, damageAmount);
        
        // Update hull section display
        updateHullSection(damagedSection);
        
        // Show cracks if integrity is low
        if (state.hullIntegrity < 70) {
            elements['hull-cracks'].classList.add('active');
        }
    }
    
    // Update integrity percentage display
    elements['integrity-percentage'].textContent = `${Math.round(state.hullIntegrity)}%`;
    
    // Update color based on integrity
    const integrityDisplay = elements['integrity-percentage'];
    integrityDisplay.classList.remove('warning', 'critical');
    if (state.hullIntegrity < 50) {
        integrityDisplay.classList.add('critical');
        if (state.hullIntegrity < 30) {
            showAlert('HULL INTEGRITY CRITICAL - EVACUATION MAY BE NECESSARY');
        }
    } else if (state.hullIntegrity < 70) {
        integrityDisplay.classList.add('warning');
    }
}

function addDamageLog(section, amount) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const entry = document.createElement('div');
    entry.className = 'damage-log-entry';
    entry.innerHTML = `
        <span class="damage-time">${time}</span>
        <span class="damage-section">${section.replace('-', ' ').toUpperCase()}</span>
        <span>-${amount.toFixed(1)}%</span>
    `;
    
    const logContainer = elements['damage-log'];
    logContainer.insertBefore(entry, logContainer.firstChild);
    
    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

function updateHullSection(sectionId) {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
        section.classList.add('damaged');
        
        // Determine if critical
        if (state.hullIntegrity < 40) {
            section.classList.add('critical');
        }
    }
}

function startAutoPing() {
    state.autoPingInterval = setInterval(() => {
        triggerPing();
    }, 1000 / state.pingRate);
    
    // Update ping rate display periodically
    setInterval(() => {
        // Simulate ping rate variations
        state.pingRate = Math.max(0.5, Math.min(2, state.pingRate + (Math.random() - 0.5) * 0.2));
        elements['ping-rate'].textContent = state.pingRate.toFixed(1);
        
        // Restart auto ping with new rate
        clearInterval(state.autoPingInterval);
        state.autoPingInterval = setInterval(() => {
            triggerPing();
        }, 1000 / state.pingRate);
    }, 5000);
}

function setupEventListeners() {
    elements['manual-ping'].addEventListener('click', () => {
        triggerPing(true);
    });
}

function triggerPing(manual = false) {
    const sonarDisplay = document.querySelector('.sonar-display');
    const rect = sonarDisplay.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Add ripple effect
    const ripplesContainer = elements['sonar-ping-ripples'];
    const ripple = document.createElement('div');
    ripple.className = 'ping-ripple';
    ripple.style.left = `${centerX}px`;
    ripple.style.top = `${centerY}px`;
    ripplesContainer.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 2000);
    
    // Generate sonar blips (simulate detected objects)
    const blipCount = Math.floor(Math.random() * 3) + (manual ? 5 : 1);
    for (let i = 0; i < blipCount; i++) {
        setTimeout(() => {
            addSonarBlip(centerX, centerY, rect);
        }, i * 100);
    }
}

function addSonarBlip(centerX, centerY, rect) {
    const blipsContainer = elements['sonar-blips'];
    const blip = document.createElement('div');
    blip.className = 'sonar-blip';
    
    // Random position within sonar circle
    const maxRadius = Math.min(rect.width, rect.height) / 2 - 10;
    const distance = Math.random() * maxRadius;
    const angle = Math.random() * Math.PI * 2;
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    blip.style.left = `${x}px`;
    blip.style.top = `${y}px`;
    
    blipsContainer.appendChild(blip);
    
    // Remove after animation
    setTimeout(() => {
        blip.remove();
    }, 2000);
}

function showAlert(message) {
    const alertOverlay = elements['alert-overlay'];
    const alertMessage = elements['alert-message'];
    
    alertMessage.textContent = message;
    alertOverlay.classList.add('active');
    
    // Auto-hide after 5 seconds unless it's critical
    setTimeout(() => {
        if (state.systemStatus !== 'CRITICAL') {
            alertOverlay.classList.remove('active');
        }
    }, 5000);
}

function animate() {
    // Clear canvases
    viewportCtx.clearRect(0, 0, viewportCanvas.width, viewportCanvas.height);
    currentFlowCtx.clearRect(0, 0, currentFlowCanvas.width, currentFlowCanvas.height);
    
    // Update and draw bioluminescent particles
    updateBioluminescentParticles();
    
    // Update and draw current flow
    updateCurrentFlow();
    
    // Continue animation loop
    requestAnimationFrame(animate);
}

function updateBioluminescentParticles() {
    bioluminescentParticles.forEach(p => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around screen
        if (p.x < 0) p.x = viewportCanvas.width;
        if (p.x > viewportCanvas.width) p.x = 0;
        if (p.y < 0) p.y = viewportCanvas.height;
        if (p.y > viewportCanvas.height) p.y = 0;
        
        // Update pulse
        p.pulse += p.pulseSpeed;
        
        // Draw particle
        const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        const { r, g, b } = p.color;
        
        viewportCtx.beginPath();
        viewportCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        viewportCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        viewportCtx.fill();
        
        // Draw glow
        viewportCtx.beginPath();
        viewportCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = viewportCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        viewportCtx.fillStyle = gradient;
        viewportCtx.fill();
    });
}

function updateCurrentFlow() {
    if (!currentFlowCanvas || !currentFlowCtx) return;
    
    const width = currentFlowCanvas.width;
    const height = currentFlowCanvas.height;
    
    currentFlowParticles.forEach(p => {
        // Store previous position for trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 10) {
            p.trail.shift();
        }
        
        // Move particle
        p.x += Math.cos(p.angle) * p.speed * (state.currentSpeed * 2);
        p.y += Math.sin(p.angle) * p.speed * (state.currentSpeed * 2);
        
        // Wrap around with some padding
        const padding = 20;
        if (p.x < -padding) p.x = width + padding;
        if (p.x > width + padding) p.x = -padding;
        if (p.y < -padding) p.y = height + padding;
        if (p.y > height + padding) p.y = -padding;
        
        // Draw trail
        if (p.trail.length > 1) {
            currentFlowCtx.beginPath();
            currentFlowCtx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
                currentFlowCtx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            currentFlowCtx.strokeStyle = `rgba(0, 240, 255, ${p.opacity * 0.5})`;
            currentFlowCtx.lineWidth = p.size * 0.5;
            currentFlowCtx.stroke();
        }
        
        // Draw particle
        currentFlowCtx.beginPath();
        currentFlowCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        currentFlowCtx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        currentFlowCtx.fill();
    });
}

// Emergency functions that could be triggered by external systems
window.triggerCriticalAlert = function(message) {
    state.systemStatus = 'CRITICAL';
    showAlert(message || 'CRITICAL SYSTEM FAILURE');
};

window.increasePressure = function(amount) {
    state.pressure += amount;
    updatePressureWarnings();
};

window.damageHull = function(section, severity) {
    state.hullIntegrity -= severity;
    addDamageLog(section, severity);
    updateHullSection(section);
    updateHullIntegrity();
};

window.addFaunaContact = function(name, type, distance) {
    state.fauna.push({
        name,
        type,
        distance,
        size: 'unknown',
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
    renderFaunaList();
    addSonarBlip();
};

// Simulate depth changes (for demo purposes)
window.setDepth = function(newDepth) {
    state.depth = newDepth;
    updateDepthPressure();
};

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (state.autoPingInterval) clearInterval(state.autoPingInterval);
    if (state.simulationInterval) clearInterval(state.simulationInterval);
});

// Initialize some fauna after a delay to populate the list
setTimeout(() => {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => addRandomFauna(), i * 1000);
    }
}, 2000);

console.log('Abyssal Watch Dashboard Initialized');
console.log('Station depth:', state.depth, 'meters');
console.log('All systems operational');
// Global Dashboard State
const state = {
    mode: 'climate',
    rotation: 0,
    mouseX: 0,
    mouseY: 0,
    hoverLat: 0,
    hoverLon: 0
};

// ========== PLANET CANVAS ==========
const canvas = document.getElementById('planet-canvas');
const ctx = canvas.getContext('2d');
const W = 800;
const H = 800;
const radius = 320;
const centerX = W / 2;
const centerY = H / 2;

// ========== GENERATE PLANET DATA ==========
const grid = [];
for (let i = 0; i < 36; i++) {
    grid[i] = [];
    for (let j = 0; j < 36; j++) {
        const lat = (i / 36) * Math.PI - Math.PI / 2;
        const lon = (j / 36) * Math.PI * 2;
        const noise = Math.sin(i * 0.5 + j * 0.3) * Math.cos(i * 0.2 - j * 0.4) * 0.5 + 0.5;
        grid[i][j] = {
            elevation: noise,
            temperature: 30 * Math.cos(lat) - 10 + (noise * 10),
            population: Math.floor(noise * 1000000),
            resources: noise * 100,
            trade: Math.floor(noise * 100)
        };
    }
}

// ========== RENDER FUNCTIONS ==========
function drawBackground() {
    // Ocean gradient
    const oceanGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    oceanGrad.addColorStop(0, '#0a1628');
    oceanGrad.addColorStop(1, '#0d1f3c');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = oceanGrad;
    ctx.fill();

    // Atmosphere glow
    const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.85, centerX, centerY, radius * 1.15);
    glowGrad.addColorStop(0, 'rgba(0, 180, 255, 0)');
    glowGrad.addColorStop(0.5, 'rgba(0, 180, 255, 0.06)');
    glowGrad.addColorStop(1, 'rgba(0, 180, 255, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();
}

function drawGrid() {
    // Latitude lines
    for (let i = 0; i <= 18; i++) {
        const angle = (i / 18) * Math.PI;
        const yOffset = radius * Math.sin(angle - Math.PI / 2);
        const xRadius = radius * Math.cos(angle - Math.PI / 2);
        if (xRadius > 0) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + yOffset, xRadius, 2, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 180, 255, 0.06)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    // Longitude lines
    for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        ctx.strokeStyle = 'rgba(0, 180, 255, 0.05)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

function drawContinents() {
    const continents = [
        { x: 0.55, y: 0.35, rx: 0.15, ry: 0.2 },   // Europe
        { x: 0.55, y: 0.48, rx: 0.16, ry: 0.22 },   // Africa
        { x: 0.25, y: 0.28, rx: 0.12, ry: 0.25 },   // North America
        { x: 0.28, y: 0.5, rx: 0.07, ry: 0.18 },    // South America
        { x: 0.72, y: 0.3, rx: 0.2, ry: 0.3 },      // Asia
        { x: 0.83, y: 0.42, rx: 0.1, ry: 0.07 },    // Australia
        { x: 0.48, y: 0.15, rx: 0.05, ry: 0.05 }    // Greenland
    ];

    continents.forEach(c => {
        const x = centerX + (c.x - 0.5) * radius * 1.6;
        const y = centerY + (c.y - 0.5) * radius * 1.6;
        ctx.beginPath();
        ctx.ellipse(x, y, c.rx * radius, c.ry * radius, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 160, 80, 0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(60, 200, 100, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function drawClimateZones() {
    const zones = [
        { y: 0.1, color: 'rgba(0, 150, 255, 0.12)', label: 'Polar' },
        { y: 0.25, color: 'rgba(80, 200, 255, 0.08)', label: 'Tundra' },
        { y: 0.4, color: 'rgba(80, 255, 80, 0.08)', label: 'Temperate' },
        { y: 0.55, color: 'rgba(255, 200, 50, 0.08)', label: 'Subtropical' },
        { y: 0.7, color: 'rgba(255, 100, 50, 0.1)', label: 'Tropical' },
        { y: 0.85, color: 'rgba(255, 150, 50, 0.08)', label: 'Equatorial' }
    ];

    zones.forEach(zone => {
        ctx.fillStyle = zone.color;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + (zone.y - 0.5) * radius * 1.6, radius * 1.1, radius * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPopulationDots() {
    const cities = [
        { x: 0.72, y: 0.3, size: 12 },   // Tokyo/Shanghai
        { x: 0.55, y: 0.35, size: 8 },   // Europe
        { x: 0.3, y: 0.3, size: 6 },     // US East
        { x: 0.55, y: 0.5, size: 5 },    // West Africa
        { x: 0.6, y: 0.55, size: 4 },    // South Africa
        { x: 0.25, y: 0.25, size: 3 },   // US West
        { x: 0.75, y: 0.35, size: 5 },   // India
        { x: 0.83, y: 0.4, size: 3 },    // Australia
        { x: 0.3, y: 0.5, size: 4 },     // Brazil
        { x: 0.65, y: 0.28, size: 4 }    // Russia
    ];

    cities.forEach(city => {
        const x = centerX + (city.x - 0.5) * radius * 1.6;
        const y = centerY + (city.y - 0.5) * radius * 1.6;
        ctx.beginPath();
        ctx.arc(x, y, city.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 200, 50, 0.3)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, city.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 220, 100, 0.5)';
        ctx.fill();
    });
}

function drawResources() {
    const resources = [
        { x: 0.65, y: 0.35, color: '#ff4444', size: 8 },   // Oil - Middle East
        { x: 0.45, y: 0.45, color: '#44ff44', size: 6 },   // Food - Africa
        { x: 0.3, y: 0.3, color: '#888888', size: 7 },     // Minerals - Americas
        { x: 0.55, y: 0.55, color: '#ffaa00', size: 5 },   // Energy - Africa
        { x: 0.7, y: 0.4, color: '#44aaff', size: 6 },     // Water - Asia
        { x: 0.25, y: 0.5, color: '#88ff88', size: 5 },    // Food - South America
        { x: 0.75, y: 0.3, color: '#ff8888', size: 7 }     // Oil - Russia
    ];

    resources.forEach(r => {
        const x = centerX + (r.x - 0.5) * radius * 1.6;
        const y = centerY + (r.y - 0.5) * radius * 1.6;
        ctx.beginPath();
        ctx.arc(x, y, r.size, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, r.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

function drawTradeRoutes() {
    const routes = [
        { x1: 0.72, y1: 0.3, x2: 0.55, y2: 0.35 },  // Asia to Europe
        { x1: 0.55, y1: 0.35, x2: 0.3, y2: 0.3 },    // Europe to US
        { x1: 0.3, y1: 0.3, x2: 0.25, y2: 0.5 },     // US to South America
        { x1: 0.72, y1: 0.3, x2: 0.65, y2: 0.35 },   // Asia to Middle East
        { x1: 0.65, y1: 0.35, x2: 0.55, y2: 0.48 },  // Middle East to Africa
        { x1: 0.55, y1: 0.48, x2: 0.3, y2: 0.5 }     // Africa to South America
    ];

    routes.forEach(route => {
        const x1 = centerX + (route.x1 - 0.5) * radius * 1.6;
        const y1 = centerY + (route.y1 - 0.5) * radius * 1.6;
        const x2 = centerX + (route.x2 - 0.5) * radius * 1.6;
        const y2 = centerY + (route.y2 - 0.5) * radius * 1.6;
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 40;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
    });
}

// ========== MAIN RENDER ==========
function renderCanvas() {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    
    // Clip to sphere
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    drawBackground();
    drawGrid();
    drawContinents();

    // Draw mode-specific overlays
    if (state.mode === 'climate' || state.mode === 'all') {
        drawClimateZones();
    }
    if (state.mode === 'population' || state.mode === 'all') {
        drawPopulationDots();
    }
    if (state.mode === 'resources' || state.mode === 'all') {
        drawResources();
    }
    if (state.mode === 'trade' || state.mode === 'all') {
        drawTradeRoutes();
    }

    ctx.restore();
    
    // Draw outer border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 180, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// ========== OVERLAY SWITCHING ==========
document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.overlay-item').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        state.mode = this.dataset.mode;
        renderCanvas();
    });
});

// ========== MOUSE TRACKING ==========
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    state.mouseX = (e.clientX - rect.left) / rect.width * W;
    state.mouseY = (e.clientY - rect.top) / rect.height * H;
    
    const dx = state.mouseX - centerX;
    const dy = state.mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist <= radius) {
        const lat = (Math.asin(dy / radius) * 180) / Math.PI;
        const lon = (Math.atan2(dx, dy) * 180) / Math.PI;
        document.getElementById('coord-lat').textContent = `${lat.toFixed(1)}°${lat >= 0 ? 'N' : 'S'}`;
        document.getElementById('coord-lon').textContent = `${lon.toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;
    }
});

canvas.addEventListener('mouseleave', () => {
    document.getElementById('coord-lat').textContent = '0.00°N';
    document.getElementById('coord-lon').textContent = '0.00°E';
});

// ========== DATA SIMULATION ==========
function simulateDataUpdates() {
    // Update time
    const now = new Date();
    document.getElementById('world-time').textContent = now.toUTCString().split(' ')[4] + ' UTC';
    
    // Update population counter
    const popEl = document.getElementById('population');
    let pop = parseInt(popEl.textContent.replace(/,/g, ''));
    pop += Math.floor(Math.random() * 100) + 50;
    popEl.textContent = pop.toLocaleString();
    
    // Update temperature with small variation
    const tempEl = document.getElementById('global-temp');
    let temp = parseFloat(tempEl.textContent);
    temp += (Math.random() - 0.5) * 0.1;
    tempEl.textContent = temp.toFixed(1) + '°C';
    
    // Update sea level
    const seaEl = document.getElementById('sea-level');
    let sea = parseFloat(seaEl.textContent);
    sea += (Math.random() - 0.5) * 0.02;
    seaEl.textContent = (sea > 0 ? '+' : '') + sea.toFixed(1) + 'm';
    
    // Update CO2
    const co2El = document.getElementById('co2-level');
    let co2 = parseFloat(co2El.textContent);
    co2 += (Math.random() - 0.5) * 0.5;
    co2El.textContent = co2.toFixed(1) + ' ppm';
    
    // Update biodiversity
    const bioEl = document.getElementById('biodiversity');
    let bio = parseFloat(bioEl.textContent);
    bio += (Math.random() - 0.5) * 0.002;
    bioEl.textContent = bio.toFixed(3);
    
    // Update energy use
    const energyEl = document.getElementById('energy-use');
    let energy = parseFloat(energyEl.textContent);
    energy += (Math.random() - 0.5) * 0.5;
    energyEl.textContent = energy.toFixed(1) + ' TW';
}

function simulateFeedItems() {
    const feeds = [
        '🌋 Mauna Loa tremor detected',
        '🌊 El Niño index: +1.8°C',
        '📊 S&amp;P 500: 5,284 ▲0.7%',
        '🌍 Population +2.3/sec',
        '🔥 Amazon deforestation: 0.8 km²/h',
        '🌊 Arctic ice minimum: 4.2M km²',
        '🌀 Typhoon approaching Philippines',
        '🌋 Etna eruption alert level raised',
        '📈 Global markets up 1.2%',
        '🌊 Pacific garbage patch expanding',
        '🔥 Siberian wildfires contained',
        '🌿 Reforestation in Brazil +2%',
        '⚡ Solar flare activity increasing',
        '🌊 Coral bleaching Great Barrier Reef',
        '🏭 Industrial emissions -0.3% this month'
    ];
    
    document.querySelectorAll('[id^="feed-item-"]').forEach((el, index) => {
        const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
        el.textContent = randomFeed;
    });
}

// ========== INITIALIZATION ==========
renderCanvas();

// Start data simulation
setInterval(simulateDataUpdates, 2000);
setInterval(simulateFeedItems, 5000);

// Add subtle pulsing to key stats
document.querySelectorAll('.stat-val').forEach(el => {
    if (el.textContent.includes('.')) {
        setInterval(() => {
            const val = parseFloat(el.textContent);
            if (!isNaN(val)) {
                const variation = (Math.random() - 0.5) * 0.02;
                const newVal = (val + variation);
                const decimals = el.textContent.split('.')[1]?.length || 1;
                el.textContent = el.textContent.replace(/[\d.]+/, newVal.toFixed(decimals));
            }
        }, 3000 + Math.random() * 2000);
    }
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    const modes = ['climate', 'tectonic', 'population', 'resources', 'trade'];
    const currentIndex = modes.indexOf(state.mode);
    
    if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % modes.length;
        document.querySelectorAll('.overlay-item')[nextIndex]?.click();
    } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
        document.querySelectorAll('.overlay-item')[prevIndex]?.click();
    }
});

console.log('🌍 TERRA DASHBOARD initialized successfully');
console.log('📍 Use arrow keys ← → to switch overlays');
console.log('🖱️ Hover over the planet to see coordinates');
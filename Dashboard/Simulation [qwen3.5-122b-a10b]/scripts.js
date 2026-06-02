/**
 * GAIA-OS // SIMULATION ENGINE
 * Handles procedural generation, data simulation, and canvas rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CONFIG = {
        planetColor: '#00f3ff',
        atmosphereColor: 'rgba(0, 243, 255, 0.1)',
        landColor: '#005f63',
        gridColor: 'rgba(0, 243, 255, 0.05)',
        rotationSpeed: 0.002,
        updateInterval: 1000, // ms
        logInterval: 2500, // ms
    };

    // --- State Management ---
    const state = {
        population: 8124593002,
        co2: 424.1,
        temp: 15.4,
        time: new Date(),
        rotation: 0,
        isRunning: true
    };

    // --- DOM Elements ---
    const els = {
        clock: document.getElementById('sim-clock'),
        pop: document.getElementById('pop-counter'),
        cpu: document.getElementById('cpu-load'),
        mem: document.getElementById('mem-load'),
        lat: document.getElementById('lat-val'),
        lon: document.getElementById('lon-val'),
        quakeFeed: document.getElementById('quake-feed'),
        logConsole: document.getElementById('system-log'),
        canvas: document.getElementById('planet-canvas')
    };

    // --- Canvas & Planet Rendering ---
    const ctx = els.canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resizeCanvas() {
        const parent = els.canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        els.canvas.width = width;
        els.canvas.height = height;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = Math.floor((width * height) / 4000); // Density based on screen size
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function drawPlanet() {
        ctx.clearRect(0, 0, width, height);
        
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.35;

        // Draw Atmosphere Glow
        const gradient = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.2);
        gradient.addColorStop(0, CONFIG.atmosphereColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw Planet Base
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#020508';
        ctx.fill();
        ctx.strokeStyle = CONFIG.gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw Grid Lines (Latitude/Longitude)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        // Longitudes
        for (let i = 0; i < 12; i++) {
            const x = cx + (i * (width / 12)) - (width / 24);
            ctx.beginPath();
            ctx.moveTo(x, cy - radius);
            ctx.lineTo(x, cy + radius);
            ctx.strokeStyle = CONFIG.gridColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Latitudes
        for (let i = -2; i <= 2; i++) {
            const y = cy + (i * (height / 10));
            ctx.beginPath();
            ctx.moveTo(cx - radius, y);
            ctx.lineTo(cx + radius, y);
            ctx.strokeStyle = CONFIG.gridColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Draw "Landmasses" (Abstract blobs)
        ctx.fillStyle = CONFIG.landColor;
        for(let i=0; i<5; i++) {
            const angle = (state.rotation * 0.5) + (i * 1.2);
            const px = cx + Math.cos(angle) * (radius * 0.6);
            const py = cy + Math.sin(angle * 0.5) * (radius * 0.4);
            ctx.beginPath();
            ctx.arc(px, py, radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Particles (Data points/Stars)
        ctx.fillStyle = CONFIG.planetColor;
        particles.forEach(p => {
            // Simple parallax effect
            const px = (p.x + state.rotation * 50) % width;
            const finalX = px < 0 ? px + width : px;
            
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(finalX, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        ctx.restore();

        // Update Rotation
        state.rotation += CONFIG.rotationSpeed;
        
        // Update Coordinate Readout
        const simLat = (Math.sin(state.rotation) * 45).toFixed(2);
        const simLon = ((state.rotation * 180 / Math.PI) % 360).toFixed(2);
        els.lat.innerText = simLat;
        els.lon.innerText = simLon;

        requestAnimationFrame(drawPlanet);
    }

    // --- Data Simulation Functions ---

    function updateClock() {
        state.time = new Date();
        els.clock.innerText = state.time.toISOString().split('T')[1].split('.')[0] + " UTC";
    }

    function updatePopulation() {
        // Random fluctuation
        const change = Math.floor(Math.random() * 5) - 1; 
        state.population += change;
        els.pop.innerText = state.population.toLocaleString();
    }

    function updateSystemLoad() {
        const cpu = Math.floor(Math.random() * 30) + 30; // 30-60%
        const mem = Math.floor(Math.random() * 5) + 10; // 10-15TB
        els.cpu.innerText = cpu + "%";
        els.mem.innerText = `${mem}TB / 64TB`;
        
        // Visual feedback for high load
        els.cpu.style.color = cpu > 80 ? 'var(--danger)' : 'var(--text-main)';
    }

    function addQuake() {
        const locations = [
            "Pacific Ring", "Andes Fault", "Himalayan Belt", "Mid-Atlantic Ridge", 
            "Alpine-Himalayan", "Caribbean Plate", "Java Trench", "San Andreas"
        ];
        const magnitudes = [
            { val: "M7.0+", class: "severity-high", icon: "🌋" },
            { val: "M5.0-M6.9", class: "severity-med", icon: "📉" },
            { val: "M3.0-M4.9", class: "severity-low", icon: "⚠️" }
        ];

        const loc = locations[Math.floor(Math.random() * locations.length)];
        const mag = magnitudes[Math.floor(Math.random() * magnitudes.length)];
        const time = state.time.toISOString().split('T')[1].split('.')[0].substring(0, 5);

        const li = document.createElement('li');
        li.className = `feed-item ${mag.class}`;
        li.innerHTML = `
            <span class="time">${time}</span>
            <span class="loc">${loc} (${mag.val})</span>
            <span class="icon">${mag.icon}</span>
        `;

        els.quakeFeed.prepend(li);
        if (els.quakeFeed.children.length > 8) {
            els.quakeFeed.lastElementChild.remove();
        }
    }

    function addLog() {
        const messages = [
            "Packet received from SAT-04",
            "Re-calibrating thermal sensors",
            "Ocean current data synced",
            "Trade route optimization complete",
            "Atmospheric scrubbing active",
            "Tectonic plate shift detected (Minor)",
            "Population census update...",
            "Energy grid load balancing...",
            "Encryption key rotated",
            "Satellite uplink established"
        ];
        
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const div = document.createElement('div');
        div.className = 'log-line';
        div.innerText = `> ${msg}`;
        
        els.logConsole.appendChild(div);
        if (els.logConsole.children.length > 6) {
            els.logConsole.firstElementChild.remove();
        }
    }

    function fluctuateStocks() {
        const rows = document.querySelectorAll('.stock-row span.up, .stock-row span.down');
        rows.forEach(row => {
            if (Math.random() > 0.7) {
                const current = parseFloat(row.innerText.replace(/,/g, '').replace('$', ''));
                const change = (Math.random() - 0.5) * (current * 0.002);
                const newVal = (current + change).toFixed(2);
                row.innerText = row.innerText.includes('$') ? `$${newVal}` : newVal;
                
                // Flash effect
                row.style.color = change > 0 ? 'var(--success)' : 'var(--danger)';
                setTimeout(() => {
                    row.style.color = ''; // Reset to CSS class color
                }, 500);
            }
        });
    }

    // --- Main Loops ---

    // Canvas Loop
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawPlanet();

    // Data Loops
    setInterval(updateClock, 1000);
    setInterval(updatePopulation, 2000);
    setInterval(updateSystemLoad, 1500);
    setInterval(addQuake, 4000); // New quake every 4s
    setInterval(addLog, 2500); // New log every 2.5s
    setInterval(fluctuateStocks, 1000); // Stock updates every 1s

    // Initial triggers
    addQuake();
    addLog();
    addLog();
});
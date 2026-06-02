document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITIES ---
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
    
    // --- 1. SIMULATION CLOCK ---
    const clockEl = document.getElementById('sim-clock');
    let simTime = new Date().getTime();
    
    function updateClock() {
        // Advance time faster than real time
        simTime += 1000 * 60 * 60 * 2; // Add 2 hours per tick
        const date = new Date(simTime);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        clockEl.innerText = `${y}-${m}-${d} :: ${h}:${min}:${s}`;
    }
    setInterval(updateClock, 100);

    // --- 2. POPULATION COUNTER ---
    const popEl = document.getElementById('pop-counter');
    let population = 8045312101;

    function updatePopulation() {
        const growth = randomInt(1, 5);
        population += growth;
        popEl.innerText = population.toLocaleString();
    }
    setInterval(updatePopulation, 400); // Updates every 400ms

    // --- 3. SEISMIC GRAPH CANVAS ---
    const canvas = document.getElementById('seismicCanvas');
    const ctx = canvas.getContext('2d');
    
    // Handle DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let dataPoints = new Array(Math.floor(rect.width / 2)).fill(rect.height / 2);
    let offset = 0;

    function drawSeismic() {
        // Fade out effect
        ctx.fillStyle = 'rgba(0, 10, 20, 0.2)';
        ctx.fillRect(0, 0, rect.width, rect.height);

        ctx.beginPath();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;

        // Shift data and add new random noise
        dataPoints.shift();
        const lastPoint = dataPoints[dataPoints.length - 1] || (rect.height / 2);
        const volatility = Math.random() > 0.95 ? 30 : 2; // Occasional spike
        const newValue = lastPoint + (Math.random() * volatility * 2 - volatility);
        
        // Clamp to canvas height
        const clampedValue = Math.max(5, Math.min(rect.height - 5, newValue));
        dataPoints.push(clampedValue);

        // Draw lines
        for (let i = 0; i < dataPoints.length; i++) {
            const x = i * 2;
            const y = dataPoints[i];
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Update text readout randomly
        if (Math.random() > 0.9) {
            const mag = (Math.abs(clampedValue - rect.height/2) / 10).toFixed(1);
            const el = document.getElementById('seismic-val');
            el.innerText = mag + " ML";
            el.style.color = mag > 2.5 ? '#ff2a2a' : '#00f0ff';
        }

        requestAnimationFrame(drawSeismic);
    }
    drawSeismic();

    // --- 4. TEMPERATURE GRID GENERATOR & UPDATER ---
    const tempGrid = document.getElementById('temp-grid');
    const gridCells = [];

    // Create Grid Cells
    for (let i = 0; i < 32; i++) {
        const cell = document.createElement('div');
        cell.className = 'map-cell';
        tempGrid.appendChild(cell);
        gridCells.push(cell);
    }

    function updateTempGrid() {
        gridCells.forEach(cell => {
            const r = Math.random();
            let color;
            // Probability distribution for temp
            if (r < 0.2) color = '#3498db'; // Cold
            else if (r < 0.6) color = '#f1c40f'; // Temperate
            else if (r < 0.85) color = '#e67e22'; // Warm
            else color = '#e74c3c'; // Hot
            
            cell.style.backgroundColor = color;
            cell.style.opacity = randomFloat(0.3, 0.9);
        });
    }
    setInterval(updateTempGrid, 2000);

    // --- 5. LOG GENERATORS ---
    const kernelLog = document.getElementById('kernel-log');
    const bioLog = document.getElementById('bio-log');
    
    const kernelMessages = [
        "SYNCING SATELLITE ARRAY...",
        "RECEIVING PACKET: 45MB",
        "ENCRYPTION KEY ROTATION",
        "CHECKING DISK INTEGRITY... OK",
        "UPDATING WEATHER MODELS",
        "GARBAGE COLLECTION: 0.04s",
        "PINGING SERVERS... 24ms",
        "OPTIMIZING RENDER PIPELINE"
    ];

    const bioMessages = [
        "AMPHIBIA: Local decline detected",
        "MAMMALIA: Migration started (Sector 4)",
        "INSECTA: Population spike +0.4%",
        "PLANTAE: Photosynthesis efficiency 94%",
        "PISCES: Acidification warning",
        "AVES: Migration route altered",
        "REPTILIA: Hibernation cycle begun",
        "BACTERIA: Resistance mutation detected"
    ];

    function addLogEntry(container, messages) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const time = new Date().toLocaleTimeString('en-US', {hour12: false});
        const p = document.createElement('p');
        p.innerText = `[${time}] ${msg}`;
        container.appendChild(p);
        
        // Auto scroll
        container.scrollTop = container.scrollHeight;

        // Prune old logs to prevent memory leak
        if (container.children.length > 20) {
            container.removeChild(container.firstChild);
        }
    }

    setInterval(() => addLogEntry(kernelLog, kernelMessages), 800);
    setInterval(() => addLogEntry(bioLog, bioMessages), 1200);

    // --- 6. GLOBAL VALUES FLUCTUATION ---
    const globalTempEl = document.getElementById('global-temp');
    let currentTemp = 14.8;

    function fluctuateValues() {
        // Temp
        const change = randomFloat(-0.05, 0.05);
        currentTemp += parseFloat(change);
        globalTempEl.innerText = currentTemp.toFixed(2) + "°C";
        
        // Random color flicker for status
        const status = document.querySelector('.sys-status');
        if(Math.random() > 0.98) {
            status.style.color = '#ff9d00';
            setTimeout(() => status.style.color = '#00ff66', 200);
        }
    }
    setInterval(fluctuateValues, 1000);

    // --- 7. TICKER DUPLICATION (For seamless loop) ---
    const ticker = document.getElementById('global-ticker');
    ticker.innerHTML += ticker.innerHTML; // Double content for infinite scroll illusion

    // --- 8. PLANET MARKERS ANIMATION (Random Glitch) ---
    const markers = document.querySelectorAll('.marker');
    setInterval(() => {
        markers.forEach(m => {
            if(Math.random() > 0.7) {
                m.style.opacity = Math.random();
                m.style.transform = `scale(${randomFloat(0.8, 1.2)})`;
            }
        });
    }, 500);

    console.log("SYSTEM ONLINE: MONITORING ACTIVE");
});
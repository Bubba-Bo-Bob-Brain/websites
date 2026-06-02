/**
 * OMNISPHERE v4.0.2 - Core Simulation Engine
 * Handles real-time telemetry, seismic feeds, and visual dynamism.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPopulationTicker();
    initSystemClock();
    initSeismicFeed();
    initClimatePulse();
    initConsoleLogs();
    initPlanetParallax();
    initResourceFluctuation();
});

// --- 1. Global Telemetry Tickers ---
function initPopulationTicker() {
    const popElement = document.getElementById('pop-count');
    let population = 8102455210;

    setInterval(() => {
        // Simulate births and deaths (net growth)
        const change = Math.floor(Math.random() * 15) - 4; 
        population += change;
        popElement.innerText = population.toLocaleString();
    }, 1000);
}

function initSystemClock() {
    const clockElement = document.getElementById('sim-clock');
    setInterval(() => {
        const now = new Date();
        clockElement.innerText = now.toTimeString().split(' ')[0];
    }, 1000);
}

// --- 2. Seismic Event Simulation ---
function initSeismicFeed() {
    const feed = document.getElementById('seismic-feed');
    const eventTypes = ['Tectonic Shift', 'Volcanic Tremor', 'Magma Displacement', 'Subduction Event', 'Crustal Fracture'];
    const regions = ['PAC-RIM', 'MID-ATL', 'EU-SUTURE', 'ANDES-ARC', 'HIMALAYA-Z'];

    function addEvent() {
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const mag = (Math.random() * (8.2 - 2.1) + 2.1).toFixed(1);
        const coords = `${(Math.random() * 180 - 90).toFixed(2)}°, ${(Math.random() * 360 - 180).toFixed(2)}°`;

        const entry = document.createElement('div');
        entry.className = 'feed-entry';
        entry.innerHTML = `
            <span>[${region}] ${type}</span>
            <span style="color: var(--accent-alert)">${mag} Mw | ${coords}</span>
        `;

        feed.prepend(entry);

        // Maintain performance by limiting DOM elements
        if (feed.children.length > 50) {
            feed.removeChild(feed.lastChild);
        }
    }

    // Random intervals for "unpredictable" seismic activity
    (function loop() {
        const rand = Math.random() * 3000 + 500;
        setTimeout(() => {
            addEvent();
            loop();
        }, rand);
    })();
}

// --- 3. Climate Matrix Pulse ---
function initClimatePulse() {
    const cells = document.querySelectorAll('.climate-cell');
    
    setInterval(() => {
        // Pick 3 random cells to update
        for(let i = 0; i < 3; i++) {
            const idx = Math.floor(Math.random() * cells.length);
            const cell = cells[idx];
            
            const temp = Math.floor(Math.random() * 50) - 20;
            const hum = Math.floor(Math.random() * 100);
            
            cell.style.color = 'var(--accent-primary)';
            cell.innerText = `T:${temp} H:${hum}`;
            
            setTimeout(() => {
                cell.style.color = 'var(--text-dim)';
            }, 500);
        }
    }, 2000);
}

// --- 4. Console Log Simulation ---
function initConsoleLogs() {
    const consoleDiv = document.querySelector('.console-log');
    const logs = [
        "Syncing orbital mesh node 0x4F2...",
        "Recalculating atmospheric drag coefficients...",
        "Fetching demographic delta from Sector 4...",
        "Warning: Thermal spike in Magma Chamber 12...",
        "Packet loss detected in Oceanic Sensor Array...",
        "Updating global trade vectors...",
        "Simulation kernel heartbeat: OK",
        "Optimizing resource distribution map..."
    ];

    setInterval(() => {
        const line = document.createElement('div');
        line.className = 'log-line';
        const timestamp = (Math.random() * 0.1).toFixed(4);
        line.innerText = `[${timestamp}] ${logs[Math.floor(Math.random() * logs.length)]}`;
        
        consoleDiv.appendChild(line);
        if (consoleDiv.children.length > 4) {
            consoleDiv.removeChild(consoleDiv.firstChild);
        }
    }, 3000);
}

// --- 5. Planet Parallax Effect ---
function initPlanetParallax() {
    const viewport = document.querySelector('.planet-viewport');
    const sphere = document.querySelector('.planet-sphere');
    const continents = document.querySelectorAll('.continent');

    window.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        // Move sphere slightly
        sphere.style.transform = `translate(${xAxis}px, ${yAxis}px)`;

        // Move continents in opposite direction for depth
        continents.forEach((cont, idx) => {
            const factor = (idx + 1) * 0.5;
            cont.style.transform = `translate(${-xAxis * factor}px, ${-yAxis * factor}px)`;
        });
    });
}

// --- 6. Resource Matrix Fluctuation ---
function initResourceFluctuation() {
    const tableCells = document.querySelectorAll('.resource-matrix td');
    
    setInterval(() => {
        const randomCell = tableCells[Math.floor(Math.random() * tableCells.length)];
        if (randomCell.innerText.includes('%')) {
            const currentVal = parseFloat(randomCell.innerText);
            const newVal = (currentVal + (Math.random() * 0.4 - 0.2)).toFixed(1);
            randomCell.innerText = `${newVal}%`;
            randomCell.style.color = 'var(--accent-primary)';
            
            setTimeout(() => {
                randomCell.style.color = 'var(--text-main)';
            }, 800);
        }
    }, 4000);
}
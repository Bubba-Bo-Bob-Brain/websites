/**
 * AETHERIC CODEX - WORLD ENGINE
 * Simulates live MMORPG data streams for a high-density dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    initWorldClock();
    initMarketSimulation();
    initEventStream();
    initHeatmap();
    initRaidSimulation();
    initMapGrid();
});

/**
 * 1. WORLD CLOCK ENGINE
 * Updates the time and provides a sense of temporal progression.
 */
function initWorldClock() {
    const clockEl = document.getElementById('world-clock');
    
    function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${h}:${m}:${s}`;
    }
    
    setInterval(update, 1000);
    update();
}

/**
 * 2. MARKET SIMULATION
 * Randomly fluctuates economy values to simulate a living market.
 */
function initMarketSimulation() {
    const ecoItems = document.querySelectorAll('.eco-item');
    
    setInterval(() => {
        ecoItems.forEach(item => {
            const valEl = item.querySelector('.eco-val');
            if (!valEl) return;

            // Only fluctuate items that have numbers
            const currentVal = parseFloat(valEl.textContent.replace(/[^\d.-]/g, ''));
            if (isNaN(currentVal)) return;

            // Random fluctuation between -2% and +2%
            const changePercent = (Math.random() * 0.04) - 0.02;
            const newVal = currentVal + (currentVal * changePercent);
            
            // Update text and styling
            valEl.textContent = (changePercent >= 0 ? '📈 ' : '📉 ') + newVal.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1});
            valEl.className = 'eco-val ' + (changePercent >= 0 ? 'up' : 'down');
        });
    }, 3000); // Update every 3 seconds
}

/**
 * 3. EVENT STREAM ENGINE
 * Injects new "world events" into the bottom ticker.
 */
function initEventStream() {
    const streamEl = document.getElementById('event-stream');
    const eventTemplates = [
        "⚔️ Siege of Silvergate has begun!",
        "💎 Legendary Item 'Aether Blade' dropped by Malphas.",
        "⛈️ Heavy rain reported in the Whispering Woods.",
        "🪙 Market Crash: Mana Crystal prices plummeting!",
        "🐉 Dragon sighting in the Northern Peaks!",
        "🛡️ Guild 'Eternal Guard' captured the Holy Grail.",
        "🌑 Void Breach detected in Sector 4.",
        "🌿 Harvest season begins in the Elven Realms.",
        "🔥 Volcanic activity increasing in Ashfall Basin.",
        "✨ Mana density increasing in the Leyline Nexus."
    ];

    function addEvent() {
        const now = new Date();
        const timestamp = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        const text = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        
        const newEntry = document.createElement('span');
        newEntry.className = 'log-entry';
        newEntry.textContent = `${timestamp} ${text}`;
        
        streamEl.appendChild(newEntry);

        // Keep the DOM clean: remove old entries
        if (streamEl.children.length > 20) {
            streamEl.removeChild(streamEl.firstChild);
        }

        // Auto-scroll effect (simulated by shifting)
        streamEl.scrollLeft = streamEl.scrollWidth;
    }

    setInterval(addEvent, 5000);
    addEvent(); // Initial call
}

/**
 * 4. HEATMAP GENERATION
 * Creates a high-density grid of "population" cells.
 */
function initHeatmap() {
    const heatmapEl = document.getElementById('heatmap');
    const cellCount = 50;

    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'heat-cell';
        
        // Randomize "density" via opacity/color
        const density = Math.random();
        cell.style.opacity = density;
        if (density > 0.8) cell.style.backgroundColor = 'var(--accent-cyan)';
        else if (density > 0.5) cell.style.backgroundColor = 'var(--accent-violet)';
        else if (density > 0.2) cell.style.backgroundColor = 'var(--accent-gold)';
        
        heatmapEl.appendChild(cell);
    }
}

/**
 * 5. RAID BOSS SIMULATION
 * Makes the HP bars move slightly to simulate real combat.
 */
function initRaidSimulation() {
    const hpFills = document.querySelectorAll('.hp-fill');
    
    setInterval(() => {
        hpFills.forEach(fill => {
            let currentWidth = parseFloat(fill.style.width);
            // Bosses take damage or heal slightly
            const change = (Math.random() * 2) - 0.8; 
            currentWidth = Math.min(Math.max(currentWidth + change, 1), 100);
            fill.style.width = `${currentWidth}%`;
        });
    }, 2000);
}

/**
 * 6. MAP GRID INITIALIZATION
 * Populates the map with tactical "noise" to look like a real map.
 */
function initMapGrid() {
    const mapGrid = document.getElementById('territory-map');
    // We use the CSS background-image for the main grid, 
    // but we can inject small "activity" dots via JS.
    
    setInterval(() => {
        // Occasionally spawn a "combat" or "event" dot on the map
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = Math.random() > 0.5 ? 'var(--accent-crimson)' : 'var(--accent-cyan)';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.boxShadow = `0 0 5px ${dot.style.backgroundColor}`;
        dot.style.transition = 'opacity 2s';
        
        mapGrid.parentElement.appendChild(dot);
        
        // Fade out and remove
        setTimeout(() => {
            dot.style.opacity = '0';
            setTimeout(() => dot.remove(), 2000);
        }, 3000);
    }, 1500);
}
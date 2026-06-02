/**
 * Aetheria Omni-View - World Dashboard Logic
 * Simulates a live MMORPG backend interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initMap();
    startLiveFeed();
    startEconomyTicker();
    startResourceSimulation();
    initInteractions();
});

// 1. Clock & Time System
function initClock() {
    const serverStatus = document.querySelector('.server-status');
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        // Update the server status text dynamically
        if(serverStatus) {
            serverStatus.innerHTML = `
                <span class="status-dot online"></span> 
                SERVER: <strong>ETERNAL-01</strong> | 
                TIME: <strong>${timeString}</strong> | 
                DATE: <strong>${dateString}</strong> | 
                UPTIME: <span class="uptime-counter">4,291</span> HRS
            `;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 2. Dynamic Map Generation
function initMap() {
    const mapGrid = document.querySelector('.map-grid');
    if (!mapGrid) return;

    // Configuration for the map
    const rows = 12;
    const cols = 16;
    const factions = [
        { class: 'royal', name: 'Royal', icon: '👑' },
        { class: 'rebel', name: 'Rebel', icon: '⚔️' },
        { class: 'neutral', name: 'Neutral', icon: '🏰' },
        { class: 'danger', name: 'Hostile', icon: '🐉' }
    ];

    mapGrid.innerHTML = ''; // Clear placeholder

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'map-cell';
        
        // Randomize faction based on probability
        const rand = Math.random();
        let faction;
        if (rand < 0.4) faction = factions[0]; // 40% Royal
        else if (rand < 0.7) faction = factions[1]; // 30% Rebel
        else if (rand < 0.85) faction = factions[2]; // 15% Neutral
        else faction = factions[3]; // 15% Hostile

        cell.classList.add(faction.class);
        cell.dataset.faction = faction.name;
        cell.dataset.icon = faction.icon;
        
        // Add a random "terrain" variation
        const terrain = Math.random() > 0.8 ? 'mountain' : (Math.random() > 0.5 ? 'forest' : 'plains');
        cell.dataset.terrain = terrain;

        // Tooltip logic
        cell.addEventListener('mouseenter', (e) => {
            showTooltip(e, faction.name, terrain);
        });
        cell.addEventListener('mouseleave', hideTooltip);

        mapGrid.appendChild(cell);
    }
}

// 3. Live Event Feed Simulation
function startLiveFeed() {
    const feedContainer = document.getElementById('event-feed');
    if (!feedContainer) return;

    const events = [
        { type: 'epic', msg: 'Player <strong>DarkSlayer99</strong> looted <strong>Ancient Relic</strong> in the Void.' },
        { type: 'rare', msg: 'Guild <strong>[Ironclad]</strong> declared war on <strong>[Shadow]</strong>.' },
        { type: 'common', msg: 'Server tick rate optimized to 60ms.' },
        { type: 'epic', msg: 'World Boss <strong>Chaos Leviathan</strong> has spawned in the Deep Ocean!' },
        { type: 'rare', msg: 'Player <strong>MageQueen</strong> crafted a <strong>Legendary Staff</strong>.' },
        { type: 'common', msg: 'Market price for <strong>Gold</strong> fluctuated by +2%.' },
        { type: 'danger', msg: 'WARNING: High latency detected in Sector 7.' },
        { type: 'common', msg: 'New dungeon instance <strong>Crystal Caverns</strong> opened.' }
    ];

    const tags = {
        epic: 'EPIC',
        rare: 'RARE',
        common: 'INFO',
        danger: 'ALERT'
    };

    function addEvent() {
        const event = events[Math.floor(Math.random() * events.length)];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        const div = document.createElement('div');
        div.className = 'feed-item';
        div.innerHTML = `
            <span class="time">${time}</span>
            <span class="tag ${event.type}">${tags[event.type]}</span>
            <span class="msg">${event.msg}</span>
        `;

        // Insert at top
        feedContainer.insertBefore(div, feedContainer.firstChild);

        // Limit length
        if (feedContainer.children.length > 15) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
    }

    // Add initial events
    for(let i=0; i<5; i++) addEvent();

    // Add new events randomly
    setInterval(() => {
        if(Math.random() > 0.3) addEvent(); // 70% chance to add event every tick
    }, 2000);
}

// 4. Economy Ticker Simulation
function startEconomyTicker() {
    const items = document.querySelectorAll('.ticker-item');
    
    setInterval(() => {
        items.forEach(item => {
            const span = item.querySelector('span');
            if (!span) return;
            
            const currentVal = parseInt(span.innerText.replace(/[^0-9]/g, '')) || 0;
            const change = Math.floor(Math.random() * 200) - 100; // Random change
            const newVal = currentVal + change;
            
            // Update class based on change
            span.className = change > 0 ? 'up' : (change < 0 ? 'down' : 'flat');
            span.innerText = `${change > 0 ? '▲' : (change < 0 ? '▼' : '➡')} ${newVal.toLocaleString()}`;
        });
    }, 3000);
}

// 5. Resource Simulation (CPU, RAM, etc.)
function startResourceSimulation() {
    const bars = document.querySelectorAll('.mini-bar .fill');
    
    setInterval(() => {
        bars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width) || 0;
            const fluctuation = Math.floor(Math.random() * 10) - 5;
            let newWidth = currentWidth + fluctuation;
            
            // Clamp values
            if (newWidth < 5) newWidth = 5;
            if (newWidth > 95) newWidth = 95;
            
            bar.style.width = `${newWidth}%`;
            
            // Color change on high load
            if (newWidth > 80) {
                bar.style.backgroundColor = '#ef4444'; // Red
            } else if (newWidth > 50) {
                bar.style.backgroundColor = '#f59e0b'; // Orange
            } else {
                bar.style.backgroundColor = '#10b981'; // Green
            }
        });
    }, 1500);
}

// 6. Interactions & Tooltips
function initInteractions() {
    // Hover effects for guilds
    const guildRows = document.querySelectorAll('.ranking-table tbody tr');
    guildRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'scale(1.02)';
            row.style.zIndex = '10';
            row.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'scale(1)';
            row.style.zIndex = '1';
            row.style.boxShadow = 'none';
        });
    });

    // Click on map cells to "zoom" (simulated)
    const mapCells = document.querySelectorAll('.map-cell');
    mapCells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Remove active from others
            mapCells.forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            
            // Flash effect
            cell.style.boxShadow = `0 0 20px var(--${cell.dataset.faction.toLowerCase()})`;
            setTimeout(() => {
                cell.style.boxShadow = '';
            }, 500);
        });
    });
}

// Tooltip Helper
function showTooltip(e, faction, terrain) {
    let tooltip = document.getElementById('map-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'map-tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div class="tt-title">${faction} Territory</div>
        <div class="tt-sub">Terrain: ${terrain}</div>
        <div class="tt-stat">Population: ${(Math.random() * 10000).toFixed(0)}</div>
    `;
    
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}
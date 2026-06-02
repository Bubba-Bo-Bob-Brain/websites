/**
 * OMNI-COMMAND // SIMULATION SCRIPT
 * Handles real-time data simulation, UI updates, and interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const UPDATE_INTERVAL = 1000; // 1 second for major updates
    const FAST_UPDATE = 200; // 200ms for jittery effects
    const LOG_SPEED = 3500; // ms between log entries

    // --- DOM ELEMENTS ---
    const clockEl = document.getElementById('clock');
    const resourceRows = document.querySelectorAll('.res-row');
    const fleetRows = document.querySelectorAll('.fleet-table tbody tr');
    const logFeed = document.querySelector('.log-feed');
    const mapSystems = document.querySelectorAll('.star-system');
    const diagCharts = document.querySelectorAll('.radial-chart');
    const tickerEl = document.querySelector('.ticker');

    // --- UTILS ---
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    // --- 1. CLOCK SYSTEM ---
    function updateClock() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        
        // Format: YYYY-MM-DD // HH:MM:SS:MS
        clockEl.textContent = `${date} // ${time}:${ms}`;
    }
    setInterval(updateClock, 50); // High refresh for ms

    // --- 2. ECONOMY SIMULATION ---
    function updateEconomy() {
        resourceRows.forEach(row => {
            const valEl = row.querySelector('.val');
            const trendEl = row.querySelector('.trend');
            let currentVal = parseInt(valEl.textContent.replace(/,/g, ''));
            
            // Random fluctuation
            const change = randomInt(-500, 500);
            let newVal = currentVal + change;
            
            // Update Value
            valEl.textContent = formatNumber(newVal);
            
            // Update Trend
            if (change > 0) {
                trendEl.textContent = `▲ ${randomFloat(0.1, 5.0)}%`;
                trendEl.className = 'trend up';
            } else if (change < 0) {
                trendEl.textContent = `▼ ${randomFloat(0.1, 5.0)}%`;
                trendEl.className = 'trend down';
            } else {
                trendEl.textContent = '—';
                trendEl.className = 'trend';
            }
        });
    }
    setInterval(updateEconomy, 1500);

    // --- 3. FLEET STATUS SIMULATION ---
    function updateFleet() {
        fleetRows.forEach(row => {
            const statusCell = row.querySelector('td:last-child'); // HP Bar container
            const statusText = row.querySelector('.status-battle, .status-idle, .status-move, .status-warn');
            const hpBar = statusCell.querySelector('div');
            
            // Randomly damage or heal ships in battle
            if (statusText && statusText.classList.contains('status-battle')) {
                const currentWidth = parseInt(hpBar.style.width) || 80;
                const damage = randomInt(-10, 2); // Mostly damage
                const newWidth = Math.max(0, Math.min(100, currentWidth + damage));
                
                hpBar.style.width = `${newWidth}%`;
                
                // Color change based on HP
                if (newWidth < 30) {
                    hpBar.style.backgroundColor = 'var(--c-secondary)';
                    statusText.textContent = 'CRITICAL';
                } else if (newWidth < 60) {
                    hpBar.style.backgroundColor = 'var(--c-accent)';
                    statusText.textContent = 'DAMAGED';
                } else {
                    hpBar.style.backgroundColor = 'var(--c-success)';
                    statusText.textContent = 'ENGAGED';
                }
            }
        });
    }
    setInterval(updateFleet, 2000);

    // --- 4. SYSTEM DIAGNOSTICS (Jitter Effect) ---
    function updateDiagnostics() {
        diagCharts.forEach(chart => {
            // Randomly jitter the percentage slightly to make it look "live"
            const currentP = parseInt(chart.style.getPropertyValue('--p')) || 85;
            const jitter = randomInt(-2, 2);
            const newVal = Math.max(0, Math.min(100, currentP + jitter));
            
            chart.style.setProperty('--p', newVal);
            // Only update text if it's a significant change or random chance
            if(Math.random() > 0.7) {
                chart.textContent = `${newVal}${chart.textContent.includes('%') ? '%' : ''}`;
            }
        });
    }
    setInterval(updateDiagnostics, 500);

    // --- 5. LOG FEED GENERATOR ---
    const logMessages = [
        { type: 'SYS', msg: 'Optimizing warp drive efficiency...' },
        { type: 'COM', msg: 'Encrypted packet received from Sector 7.' },
        { type: 'WAR', msg: 'Hostile signatures detected in deep space.' },
        { type: 'MIN', msg: 'Mining drone batch #442 returned with ore.' },
        { type: 'SYS', msg: 'Rerouting power to shields.' },
        { type: 'TRADE', msg: 'Plasma futures dropped 2% on exchange.' },
        { type: 'ENG', msg: 'Coolant levels nominal.' },
        { type: 'NAV', msg: 'Calculating trajectory to Proxima Centauri.' }
    ];

    function addLogEntry() {
        const entryData = logMessages[randomInt(0, logMessages.length - 1)];
        const time = new Date().toTimeString().split(' ')[0];
        
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `[${time}] <span class="sys">${entryData.type}:</span> ${entryData.msg}`;
        
        logFeed.appendChild(div);
        
        // Auto scroll to bottom
        logFeed.scrollTop = logFeed.scrollHeight;
        
        // Limit log size to prevent memory issues
        if (logFeed.children.length > 50) {
            logFeed.removeChild(logFeed.firstChild);
        }
    }
    setInterval(addLogEntry, LOG_SPEED);

    // --- 6. INTERACTIVITY (Map Hover) ---
    mapSystems.forEach(system => {
        system.addEventListener('mouseenter', (e) => {
            const label = system.querySelector('.label').textContent;
            // Create a temporary tooltip
            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.top = '-40px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = 'rgba(0,0,0,0.9)';
            tooltip.style.border = '1px solid var(--c-primary)';
            tooltip.style.color = 'var(--c-primary)';
            tooltip.style.padding = '5px 10px';
            tooltip.style.fontSize = '0.7rem';
            tooltip.style.zIndex = '100';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.textContent = `TARGET: ${label} // SCAN: COMPLETE`;
            
            system.appendChild(tooltip);
        });

        system.addEventListener('mouseleave', () => {
            const tooltip = system.querySelector('div');
            if (tooltip) tooltip.remove();
        });
    });

    // --- 7. TICKER ANIMATION ---
    // Simple CSS animation trigger or JS scroll could go here.
    // For now, the CSS keyframes handle the visual, JS just ensures content is fresh.
    setInterval(() => {
        // Rotate ticker text occasionally
        const messages = [
            "MARKET UPDATE: PLASMA PRICES RISING DUE TO SECTOR 9 CONFLICT",
            "MINING YIELDS DOWN 12% // NEW TECH UNLOCKED: GRAVITY LASSO",
            "ATTENTION: WARP LANE 4 CLOSED FOR MAINTENANCE",
            "FACTION WAR: ALLIANCE GAINS TERRITORY IN SECTOR 12"
        ];
        const msg = messages[randomInt(0, messages.length - 1)];
        tickerEl.textContent = `>> ${msg} >>`;
    }, 8000);

    // --- INITIALIZE ---
    updateClock();
    updateEconomy();
    updateFleet();
    updateDiagnostics();
    addLogEntry(); // Initial log
});
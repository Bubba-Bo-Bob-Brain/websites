/**
 * AEGIS COMMAND NEXUS - CORE OPERATING SYSTEM
 * Logic & Simulation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initCommandCenter();
});

function initCommandCenter() {
    console.log("%c AEGIS COMMAND NEXUS INITIALIZED ", "background: #00f2ff; color: #000; font-weight: bold;");

    // 1. Initialize Subsystems
    startStardateClock();
    generateStarMap();
    startIntelFeed();
    startDataOscillation();
    startResourceSimulation();
    
    // 2. Setup Event Listeners
    setupInteractions();
}

/**
 * SYSTEM TIMEKEEPING
 * Increments the stardate continuously to simulate real-time cosmic progression.
 */
function startStardateClock() {
    const stardateEl = document.getElementById('stardate');
    let baseDate = 4492.12;

    setInterval(() => {
        baseDate += 0.001;
        stardateEl.textContent = baseDate.toFixed(2);
    }, 100);
}

/**
 * STAR MAP VISUALIZER
 * Generates a dense field of stars and moving fleet/sector entities.
 */
function generateStarMap() {
    const map = document.getElementById('star-map');
    const starCount = 150;
    const entityCount = 15;

    // Create Static Stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star-entity';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2;
        const opacity = Math.random();

        Object.assign(star.style, {
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: '#fff',
            borderRadius: '50%',
            opacity: opacity,
            boxShadow: `0 0 ${size * 2}px #fff`
        });
        map.appendChild(star);
    }

    // Create Moving Entities (Fleets/Anomalies)
    for (let i = 0; i < entityCount; i++) {
        createMovingEntity(map);
    }

    // Add a scanning line effect
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line-visual';
    Object.assign(scanLine.style, {
        position: 'absolute',
        width: '100%',
        height: '2px',
        background: 'rgba(0, 242, 255, 0.2)',
        boxShadow: '0 0 15px var(--accent-cyan)',
        top: '0',
        zIndex: '10'
    });
    map.appendChild(scanLine);

    // Animate scanning line
    let scanPos = 0;
    setInterval(() => {
        scanPos = scanPos >= 100 ? 0 : scanPos + 0.5;
        scanLine.style.top = `${scanPos}%`;
    }, 30);
}

function createMovingEntity(container) {
    const entity = document.createElement('div');
    const typeRoll = Math.random();
    let color = 'var(--accent-cyan)';
    let symbol = '🛰️';

    if (typeRoll > 0.8) { color = 'var(--accent-red)'; symbol = '⚠️'; }
    else if (typeRoll > 0.6) { color = 'var(--accent-amber)'; symbol = '🛸'; }

    Object.assign(entity.style, {
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: '10px',
        color: color,
        cursor: 'pointer',
        zIndex: '5',
        transition: 'all 5s linear'
    });
    entity.textContent = symbol;
    container.appendChild(entity);

    // Movement Loop
    setInterval(() => {
        entity.style.left = `${Math.random() * 100}%`;
        entity.style.top = `${Math.random() * 100}%`;
    }, 5000 + Math.random() * 5000);
}

/**
 * INTEL FEED (TERMINAL)
 * Simulates a live stream of intercepted communications and system logs.
 */
function startIntelFeed() {
    const terminal = document.getElementById('terminal-output');
    const messages = [
        { t: "SYSTEM", m: "Sub-space relay synchronization active.", c: "text-cyan" },
        { t: "INTEL", m: "Unidentified signature detected in Sector 4.", c: "text-amber" },
        { t: "ALERT", m: "Border skirmish reported: Terra vs Reavers.", c: "text-red" },
        { t: "ECON", m: "Market volatility rising in Helium-3 futures.", c: "text-cyan" },
        { t: "LOG", m: "Dreadnought 'Aegis-01' completed docking.", c: "" },
        { t: "WARN", m: "Solar flare activity increasing in Quadrant-7.", c: "text-amber" },
        { t: "SYS", m: "Encryption key rotated for Command Link.", c: "text-cyan" },
        { t: "COMBAT", m: "Fleet deployment status: GREEN.", c: "text-cyan" },
        { t: "CRITICAL", m: "Fuel reserves dropping below safety margin!", c: "text-red" }
    ];

    function addLog() {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        const line = document.createElement('div');
        line.className = `log-line ${msg.c}`;
        line.innerHTML = `[${time}] ${msg.t}: ${msg.m}`;
        
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;

        // Keep terminal from growing infinitely
        if (terminal.childNodes.length > 50) {
            terminal.removeChild(terminal.firstChild);
        }
    }

    setInterval(addLog, 2500);
}

/**
 * DATA OSCILLATION
 * Simulates real-time fluctuations in fleet and tech data.
 */
function startDataOscillation() {
    const values = document.querySelectorAll('.val, .pct');
    
    setInterval(() => {
        const target = values[Math.floor(Math.random() * values.length)];
        const originalText = target.textContent.replace(/[^\d.]/g, '');
        const currentVal = parseFloat(originalText) || 0;
        
        // Small jitter
        const jitter = (Math.random() - 0.5) * (currentVal * 0.01);
        const newVal = currentVal + jitter;

        if (target.classList.contains('pct')) {
            target.textContent = `${newVal.toFixed(1)}%`;
        } else {
            // Handle comma-separated numbers like 14,209
            const formatted = Math.floor(newVal).toLocaleString();
            target.textContent = formatted;
        }
    }, 1500);
}

/**
 * RESOURCE SIMULATION
 * Dynamically updates progress bars to simulate energy/fuel consumption.
 */
function startResourceSimulation() {
    const bars = document.querySelectorAll('.progress-fill');
    
    setInterval(() => {
        bars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width);
            let newWidth = currentWidth + (Math.random() - 0.5) * 2;
            
            // Clamp between 5% and 98%
            if (newWidth < 5) newWidth = 5;
            if (newWidth > 98) newWidth = 98;
            
            bar.style.width = `${newWidth}%`;

            // Visual warning if low
            if (newWidth < 20) {
                bar.style.backgroundColor = 'var(--accent-red)';
            } else {
                bar.style.backgroundColor = 'var(--accent-cyan)';
            }
        });
    }, 3000);
}

/**
 * INTERACTION HANDLING
 */
function setupInteractions() {
    // Click on map entities to "inspect"
    document.getElementById('star-map').addEventListener('click', (e) => {
        if (e.target.classList.contains('star-entity') || e.target.textContent !== '') {
            const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
            const term = document.getElementById('terminal-output');
            const log = document.createElement('div');
            log.className = 'log-line text-cyan';
            log.textContent = `[${time}] MANUAL SCAN: Entity inspected at coordinates [${Math.round(e.offsetX)}, ${Math.round(e.offsetY)}]`;
            term.appendChild(log);
            term.scrollTop = term.scrollHeight;
        }
    });

    // Hover effect for modules to simulate "focus"
    const modules = document.querySelectorAll('.module');
    modules.forEach(mod => {
        mod.addEventListener('mouseenter', () => {
            mod.style.borderColor = 'var(--accent-cyan)';
            mod.style.boxShadow = 'inset 0 0 15px rgba(0, 242, 255, 0.1)';
        });
        mod.addEventListener('mouseleave', () => {
            mod.style.borderColor = 'var(--border-thin)';
            mod.style.boxShadow = 'none';
        });
    });
}
/**
 * OMNI-CORE // Galactic Command Interface
 * Logic Engine v4.02.9
 */

document.addEventListener('DOMContentLoaded', () => {
    initGalacticMap();
    initSystemClock();
    initLogStream();
    initDataFlux();
    initCoordinateTracker();
});

// --- 1. GALACTIC MAP GENERATOR ---
function initGalacticMap() {
    const starGroup = document.getElementById('star-systems');
    const starCount = 120; // High density for 4K
    const colors = ['#00f2ff', '#ffffff', '#ffb300', '#ff003c', '#39ff14'];
    
    // Generate random stars
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * 1000;
        const y = Math.random() * 1000;
        const radius = Math.random() * 2 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", color);
        circle.setAttribute("class", "star");
        
        // Random flickering animation for stars
        circle.style.animation = `blink ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`;
        
        starGroup.appendChild(circle);

        // Randomly connect stars to create a "web" (limited to avoid clutter)
        if (i > 0 && Math.random() > 0.96) {
            const prevStar = starGroup.children[i - 1];
            const prevX = prevStar.getAttribute("cx");
            const prevY = prevStar.getAttribute("cy");
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y);
            line.setAttribute("x2", prevX);
            line.setAttribute("y2", prevY);
            line.setAttribute("stroke", "rgba(0, 242, 255, 0.15)");
            line.setAttribute("stroke-width", "0.5");
            starGroup.prepend(line);
        }
    }
}

// --- 2. SYSTEM CLOCK & STARDATE ---
function initSystemClock() {
    const dateEl = document.getElementById('stardate');
    setInterval(() => {
        const now = new Date();
        const stardate = `2441.${now.getMonth() + 1}.${now.getDate()} // ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        dateEl.innerText = stardate;
    }, 1000);
}

// --- 3. REAL-TIME LOG STREAM ---
function initLogStream() {
    const output = document.getElementById('console-output');
    const events = [
        { msg: "Scanning Sector 7G... No anomalies detected.", type: "info" },
        { msg: "Energy spike detected in Andromeda Core.", type: "warn" },
        { msg: "Fleet 'Iron Will' reporting 20% hull integrity!", type: "crit" },
        { msg: "Resource freighter 'The Gilded Void' docked at Station 9.", type: "info" },
        { msg: "Psi-Weaponry research reached 44% completion.", type: "info" },
        { msg: "Warning: Gravity well instability in Krios Nebula.", type: "warn" },
        { msg: "Unauthorized access attempt in Sub-Grid 12.", type: "crit" },
        { msg: "Faction shift: Void Walkers gaining territory.", type: "info" },
        { msg: "Deep Space Probe 04 returned signal: 'Unknown Biologicals'.", type: "warn" },
    ];

    setInterval(() => {
        const event = events[Math.floor(Math.random() * events.length)];
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const timestamp = `[${new Date().toLocaleTimeString([], {hour12: false})}]`;
        const typeClass = `log-${event.type}`;
        const typeLabel = event.type.toUpperCase();

        entry.innerHTML = `${timestamp} <span class="${typeClass}">${typeLabel}</span>: ${event.msg}`;
        
        output.prepend(entry);

        // Keep the log lean
        if (output.children.length > 50) {
            output.removeChild(output.lastChild);
        }
    }, 3000);
}

// --- 4. DATA FLUX (RANDOMIZING NUMBERS) ---
function initDataFlux() {
    // Randomize resource values
    const fluxVals = document.querySelectorAll('.flux-val');
    const factionFills = document.querySelectorAll('.progress-bar .fill');
    const factionPercs = document.querySelectorAll('.f-perc');

    setInterval(() => {
        // Update Resource Values
        fluxVals.forEach(val => {
            const current = parseFloat(val.innerText.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 10;
            const newVal = (current + change).toFixed(1);
            const unit = val.innerText.includes('k') ? 'k/s' : '/s';
            val.innerText = `${newVal}${unit}`;
        });

        // Update Faction Bars slightly to simulate shifting war
        factionFills.forEach((fill, index) => {
            const currentWidth = parseInt(fill.style.width);
            const shift = (Math.random() - 0.5) * 0.5;
            const newWidth = Math.max(5, Math.min(95, currentWidth + shift));
            fill.style.width = `${newWidth}%`;
            factionPercs[index].innerText = `${Math.round(newWidth)}%`;
        });
    }, 2000);
}

// --- 5. COORDINATE TRACKER ---
function initCoordinateTracker() {
    const readout = document.querySelector('.coordinate-readout');
    const mapArea = document.querySelector('.nexus-map');

    mapArea.addEventListener('mousemove', (e) => {
        const rect = mapArea.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 1000).toFixed(2);
        const y = ((e.clientY - rect.top) / rect.height * 1000).toFixed(2);
        const z = (Math.random() * 0.1).toFixed(3);
        
        readout.innerText = `X: ${x} // Y: ${y} // Z: ${z}`;
    });
}

// --- EXTRA: RANDOM GLITCH EFFECT ---
setInterval(() => {
    if (Math.random() > 0.95) {
        const glitchText = document.querySelector('.glitch-text');
        glitchText.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        setTimeout(() => {
            glitchText.style.transform = 'translateX(0)';
        }, 50);
    }
}, 500);
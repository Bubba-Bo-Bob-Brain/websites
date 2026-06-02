document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL CLOCK ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toISOString().split('T')[1].split('.')[0];
        document.getElementById('clock').innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. STAR MAP GENERATION ---
    const starMap = document.getElementById('starMap');
    const starCount = 150;

    function createStars() {
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random positioning
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 1; // 1px to 3px
            const opacity = Math.random() * 0.7 + 0.3;
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.opacity = opacity;

            // Random twinkle delay
            star.style.animation = `blink ${Math.random() * 3 + 1}s infinite alternate`;

            starMap.appendChild(star);
        }
    }
    createStars();

    // --- 3. SPARKLINE GENERATION (SVG) ---
    function drawSparkline(elementId, color) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const width = container.clientWidth || 100;
        const height = 20;
        const points = [];
        const segments = 20;

        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * width;
            const y = Math.random() * height;
            points.push(`${x},${y}`);
        }

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.overflow = "visible";

        const polyline = document.createElementNS(svgNS, "polyline");
        polyline.setAttribute("points", points.join(" "));
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke", color);
        polyline.setAttribute("stroke-width", "1.5");
        polyline.setAttribute("stroke-linecap", "round");
        polyline.setAttribute("stroke-linejoin", "round");

        svg.appendChild(polyline);
        container.appendChild(svg);
    }

    // Initialize Sparklines
    drawSparkline('spark-energy', '#00ff66');
    drawSparkline('spark-matter', '#ff0055');
    drawSparkline('spark-alloys', '#ffcc00');
    drawSparkline('spark-data', '#00f3ff');

    // --- 4. DATA SIMULATION (Live Updates) ---
    
    // Helper to get random float
    const rnd = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

    // Resource Fluctuation
    setInterval(() => {
        const energyVal = document.querySelector('.res-card[data-type="energy"] .res-value');
        if (energyVal) {
            let current = parseFloat(energyVal.innerText);
            let change = (Math.random() - 0.5) * 0.5;
            let newVal = (current + change).toFixed(1);
            if (newVal > 100) newVal = 100;
            if (newVal < 0) newVal = 0;
            energyVal.innerText = `${newVal}%`;
            
            // Visual warning if low
            if(newVal < 20) energyVal.style.color = 'red';
            else energyVal.style.color = 'var(--text-main)';
        }
    }, 2000);

    // Market Ticker Animation
    const marketItems = document.querySelectorAll('.ticker-item .val');
    setInterval(() => {
        const randomItem = marketItems[Math.floor(Math.random() * marketItems.length)];
        const direction = Math.random() > 0.5 ? 1 : -1;
        let val = parseFloat(randomItem.innerText);
        val = (val + (rnd(0.1, 2.0) * direction)).toFixed(1);
        
        let arrow = direction > 0 ? '▲' : '▼';
        let className = direction > 0 ? 'up' : 'down';
        
        randomItem.className = `val ${className}`;
        randomItem.innerText = `${val} ${arrow}`;
    }, 800);

    // Research Progress Cycle
    const researchFill = document.querySelector('.tech-node.active .fill');
    const researchStatus = document.querySelector('.tech-node.active .node-status');
    let progress = 64;
    
    setInterval(() => {
        if (progress < 100) {
            progress += 0.5;
            if (progress > 100) progress = 100;
            researchFill.style.width = `${progress}%`;
            researchStatus.innerText = `${Math.floor(progress)}%`;
        } else {
            // Reset simulation for "Warp Drive" to keep it alive
            setTimeout(() => {
                progress = 0;
                researchStatus.innerText = "RE-CALIBRATING";
                researchFill.style.background = "#ff0055";
            }, 3000);
        }
    }, 200);

    // --- 5. TERMINAL LOG SIMULATION ---
    const terminal = document.getElementById('terminalOutput');
    const messages = [
        { type: 'sys', text: 'Scanning sector 7G...' },
        { type: 'sys', text: 'Packet loss detected on Node 4.' },
        { type: 'msg', text: 'Incoming transmission: "Stand by for jump."' },
        { type: 'err', text: 'Warning: Shield harmonics unstable.' },
        { type: 'usr', text: 'Command: Execute diagnostic.' },
        { type: 'sys', text: 'Diagnostic complete. 0 errors found.' },
        { type: 'msg', text: 'Trade route established with Kepler-186f.' },
        { type: 'sys', text: 'Updating galaxy map...' },
        { type: 'err', text: 'Firewall breach attempt blocked.' },
        { type: 'sys', text: 'Drone #42 returning to base.' }
    ];

    function addLog() {
        const msgData = messages[Math.floor(Math.random() * messages.length)];
        const now = new Date().toISOString().split('T')[1].split('.')[0];
        
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = `<span class="ts">${now}</span> <span class="txt ${msgData.type}">${msgData.text}</span>`;
        
        terminal.appendChild(line);
        
        // Auto scroll
        terminal.scrollTop = terminal.scrollHeight;

        // Limit log size
        if (terminal.children.length > 20) {
            terminal.removeChild(terminal.firstChild);
        }
    }

    // Random interval for logs
    function scheduleLog() {
        const delay = Math.random() * 3000 + 1000;
        setTimeout(() => {
            addLog();
            scheduleLog();
        }, delay);
    }
    scheduleLog();

    // --- 6. FLEET SHIELD REGENERATION (Visual Only) ---
    const hullBars = document.querySelectorAll('.ship-stats .bar');
    setInterval(() => {
        const randomBar = hullBars[Math.floor(Math.random() * hullBars.length)];
        // Only fluctuate shields that aren't 0 or 100
        let currentW = parseInt(randomBar.style.width);
        if (currentW > 10 && currentW < 95) {
            let change = Math.random() > 0.5 ? 2 : -2;
            randomBar.style.width = `${currentW + change}%`;
        }
    }, 1000);

});
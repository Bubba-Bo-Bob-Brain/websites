// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const CONFIG = {
        starCount: 100,
        updateInterval: 2000,
        logInterval: 3500
    };

    // --- DOM Elements ---
    const clockEl = document.getElementById('clock');
    const cpuValEl = document.getElementById('cpu-val');
    const memValEl = document.getElementById('mem-val');
    const chatLogEl = document.getElementById('chat-log');
    const starMapContainer = document.getElementById('star-map');
    const ctx = starMapContainer ? starMapContainer.querySelector('canvas').getContext('2d') : null;
    
    // Helper: Random Integer
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // --- 1. Clock & Time ---
    function updateClock() {
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-GB');
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. Dynamic Data Simulation ---
    function updateStats() {
        // Simulate CPU/Mem fluctuations
        if (cpuValEl) cpuValEl.textContent = `${randomInt(10, 45)}%`;
        if (memValEl) memValEl.textContent = `${(Math.random() * (4.8 - 4.0) + 4.0).toFixed(1)}GB`;

        // Simulate Market Ticker changes
        const tickers = document.querySelectorAll('.ticker-item span');
        tickers.forEach(span => {
            if (Math.random() > 0.7) { // 30% chance to update
                const isUp = Math.random() > 0.5;
                const val = (Math.random() * 5).toFixed(1);
                span.className = isUp ? 'up' : 'down';
                span.textContent = `${isUp ? '▲' : '▼'} ${val}%`;
                
                // Visual flash effect
                const parent = span.parentElement;
                parent.style.opacity = '1';
                setTimeout(() => { parent.style.opacity = '0.5'; }, 800);
            }
        });
    }
    setInterval(updateStats, CONFIG.updateInterval);

    // --- 3. Chat & Log Simulation ---
    const chatUsers = ['CmdrShepard', 'Ripley', 'MalReynolds', 'Kirk', 'Solo', 'Merchant01', 'System'];
    const chatMessages = [
        'Selling cheap ore!', 
        'Need help in Sector 7!', 
        'Anyone up for a raid?', 
        'Price of Titanium is dropping.', 
        'Watch out for pirates.', 
        'Just upgraded my engine!', 
        'LFG Dungeon Run.'
    ];
    const systemLogs = [
        'Syncing node...', 
        'Packet loss detected.', 
        'New faction war declared.', 
        'Resource extraction complete.', 
        'Fleet arrived at destination.'
    ];

    function addLogEntry(source, user, msg) {
        if (!chatLogEl) return;
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<span class="tag">[${source}]</span> <span class="user">${user}:</span> ${msg}`;
        
        // Insert at the top
        chatLogEl.prepend(div);

        // Keep list clean (max 20 items)
        if (chatLogEl.children.length > 20) {
            chatLogEl.lastElementChild.remove();
        }
    }

    function simulateChat() {
        if (Math.random() > 0.6) {
            const user = chatUsers[randomInt(0, chatUsers.length - 1)];
            const msg = chatMessages[randomInt(0, chatMessages.length - 1)];
            const source = user === 'System' ? 'SYS' : (Math.random() > 0.7 ? 'TRADE' : 'ALL');
            addLogEntry(source, user, msg);
        }
    }

    function simulateSystemLog() {
        const msg = systemLogs[randomInt(0, systemLogs.length - 1)];
        const time = new Date().toLocaleTimeString('en-GB');
        const footerLog = document.querySelector('.system-log');
        
        if (footerLog) {
            const span = document.createElement('span');
            span.className = 'log-time';
            span.textContent = `[${time}] ${msg}  `;
            footerLog.appendChild(span);
            // Auto scroll footer
            footerLog.scrollLeft = footerLog.scrollWidth;
        }
    }

    setInterval(simulateChat, CONFIG.logInterval);
    setInterval(simulateSystemLog, 4000);

    // --- 4. Star Map Canvas Animation ---
    let stars = [];
    let rotation = 0;

    function initStars() {
        if (!starMapContainer || !ctx) return;
        
        const canvas = starMapContainer.querySelector('canvas');
        // Ensure canvas exists, if not create it
        if (!canvas) {
            const newCanvas = document.createElement('canvas');
            starMapContainer.appendChild(newCanvas);
            // Re-select context
            const newCtx = newCanvas.getContext('2d');
             // We need to re-assign ctx variable logic, but since ctx is const, 
             // we will just use the newCanvas directly in the loop below via closure or re-query.
             // For simplicity in this scope, we'll just re-run init on resize.
             return; 
        }

        const width = starMapContainer.offsetWidth;
        const height = starMapContainer.offsetHeight;
        
        // Resize canvas to fit container
        const canvasEl = starMapContainer.querySelector('canvas');
        canvasEl.width = width;
        canvasEl.height = height;
        const context = canvasEl.getContext('2d');

        stars = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            });
        }

        // Animation Loop
        function animate() {
            if (!canvasEl) return;
            const w = canvasEl.width;
            const h = canvasEl.height;
            
            context.clearRect(0, 0, w, h);

            // Draw Grid
            context.strokeStyle = 'rgba(0, 240, 255, 0.1)';
            context.lineWidth = 1;
            const gridSize = 40;
            
            context.beginPath();
            for (let x = 0; x <= w; x += gridSize) {
                context.moveTo(x, 0);
                context.lineTo(x, h);
            }
            for (let y = 0; y <= h; y += gridSize) {
                context.moveTo(0, y);
                context.lineTo(w, y);
            }
            context.stroke();

            // Draw Stars
            context.fillStyle = '#fff';
            stars.forEach(star => {
                context.globalAlpha = star.opacity;
                context.beginPath();
                context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                context.fill();

                // Twinkle
                star.opacity += (Math.random() - 0.5) * 0.1;
                if (star.opacity < 0.1) star.opacity = 0.1;
                if (star.opacity > 0.9) star.opacity = 0.9;

                // Move
                star.x += Math.sin(rotation * star.speed) * 0.5;
                star.y += Math.cos(rotation * star.speed) * 0.5;

                // Wrap
                if (star.x > w) star.x = 0;
                if (star.x < 0) star.x = w;
                if (star.y > h) star.y = 0;
                if (star.y < 0) star.y = h;
            });

            // Draw Scanline Circle
            rotation += 0.005;
            const centerX = w / 2;
            const centerY = h / 2;
            const radius = 100 + Math.sin(rotation) * 20;
            
            context.strokeStyle = 'rgba(0, 240, 255, 0.3)';
            context.lineWidth = 2;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.stroke();

            // Center Marker
            context.fillStyle = '#ff2a2a';
            context.beginPath();
            context.arc(centerX, centerY, 3, 0, Math.PI * 2);
            context.fill();

            requestAnimationFrame(animate);
        }
        animate();
    }

    // Initialize Map
    // Create canvas element dynamically if not in HTML to ensure clean state
    if (starMapContainer && !starMapContainer.querySelector('canvas')) {
        const canvas = document.createElement('canvas');
        starMapContainer.appendChild(canvas);
    }
    initStars();

    // Handle Resize
    window.addEventListener('resize', () => {
        initStars();
    });

    // --- 5. Interactive Buttons ---
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const originalText = e.target.textContent;
            e.target.textContent = 'PROCESSING...';
            setTimeout(() => {
                e.target.textContent = originalText;
            }, 800);
        });
    });
});
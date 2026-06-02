document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. MISSION CLOCK --- */
    function updateClock() {
        const now = new Date();
        const timeString = now.toISOString().substr(11, 8);
        document.getElementById('mission-clock').textContent = `SYS.TIME ${timeString}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* --- 2. STARFIELD GENERATION --- */
    const starContainer = document.getElementById('starfield');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 2;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.background = 'white';
        star.style.position = 'absolute';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random();
        star.style.boxShadow = `0 0 ${size * 2}px white`;
        
        // Add subtle twinkle animation via CSS transition/animation
        star.style.transition = `opacity ${duration}s infinite alternate`;
        
        starContainer.appendChild(star);
    }

    /* --- 3. SHIELD VISUALIZER (CANVAS) --- */
    const shieldCanvas = document.getElementById('shieldCanvas');
    const sCtx = shieldCanvas.getContext('2d');
    const shieldPct = document.getElementById('shield-pct');
    
    let shieldAngle = 0;

    function drawShields() {
        const width = shieldCanvas.width;
        const height = shieldCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 100;

        sCtx.clearRect(0, 0, width, height);
        sCtx.lineWidth = 3;
        
        // Rotating Arc 1 (Outer)
        sCtx.beginPath();
        sCtx.strokeStyle = '#00ffff'; // Cyan
        sCtx.arc(centerX, centerY, radius, shieldAngle, shieldAngle + Math.PI * 1.5);
        sCtx.stroke();
        
        // Rotating Arc 2 (Inner - Opposite)
        sCtx.beginPath();
        sCtx.strokeStyle = '#ff00ff'; // Magenta
        sCtx.arc(centerX, centerY, radius - 20, shieldAngle + Math.PI, shieldAngle + Math.PI * 2.5);
        sCtx.stroke();

        // Core Circle
        sCtx.beginPath();
        sCtx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        sCtx.arc(centerX, centerY, radius - 40, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.strokeStyle = '#0aff0a';
        sCtx.lineWidth = 1;
        sCtx.stroke();

        // Update rotation
        shieldAngle += 0.02;

        // Randomly fluctuate shield percentage text
        if (Math.random() > 0.95) {
            let current = parseInt(shieldPct.innerText);
            let change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let next = Math.max(0, Math.min(100, current + change));
            shieldPct.innerText = next;
            
            // Visual warning if low
            if (next < 30) {
                shieldPct.style.color = 'red';
                shieldPct.style.textShadow = '0 0 10px red';
            } else {
                shieldPct.style.color = 'white';
                shieldPct.style.textShadow = '0 0 10px cyan';
            }
        }

        requestAnimationFrame(drawShields);
    }
    drawShields();

    /* --- 4. AUDIO VISUALIZER (CANVAS) --- */
    const audioCanvas = document.getElementById('audioCanvas');
    const aCtx = audioCanvas.getContext('2d');
    const barWidth = 6;
    const gap = 2;
    const bars = Math.floor(audioCanvas.width / (barWidth + gap));

    function drawAudio() {
        aCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
        
        for (let i = 0; i < bars; i++) {
            // Generate pseudo-random height based on sine waves + noise
            const time = Date.now() * 0.005;
            const h = Math.abs(Math.sin(i * 0.2 + time) * 30) + Math.random() * 20;
            
            const x = i * (barWidth + gap);
            const y = audioCanvas.height - h;

            // Gradient fill
            const gradient = aCtx.createLinearGradient(0, y, 0, audioCanvas.height);
            gradient.addColorStop(0, '#bc13fe');
            gradient.addColorStop(1, '#00ffff');

            aCtx.fillStyle = gradient;
            aCtx.fillRect(x, y, barWidth, h);
        }

        requestAnimationFrame(drawAudio);
    }
    drawAudio();

    /* --- 5. FREQUENCY JITTER --- */
    const freqVal = document.getElementById('freq-val');
    setInterval(() => {
        const base = 104.0;
        const jitter = (Math.random() * 1.5).toFixed(1);
        freqVal.innerText = (base + parseFloat(jitter)).toFixed(1);
    }, 500);

    /* --- 6. TERMINAL LOG UPDATES --- */
    const logContainer = document.getElementById('terminal-log');
    const logMessages = [
        "Scanning sector 7G...",
        "Incoming transmission from outpost.",
        "Shield harmonics adjusted.",
        "Life support stable.",
        "Calculating jump trajectory...",
        "Background radiation normal.",
        "Encrypting data stream...",
        "Proximity alert: debris field.",
        "Engine output: 98%.",
        "Updating starchart database."
    ];

    function addLog() {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        
        const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        
        entry.innerHTML = `<span class="timestamp">${timeStr}</span> // ${msg}`;
        logContainer.appendChild(entry);
        
        // Auto scroll
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // Add a log every 3-6 seconds
    function randomLog() {
        addLog();
        setTimeout(randomLog, Math.random() * 3000 + 3000);
    }
    randomLog();

    /* --- 7. INTERACTIVITY --- */
    
    // Warp Speed Effect
    const gridFloor = document.getElementById('grid-floor');
    document.querySelectorAll('.cyber-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Add click ripple effect (simple visual feedback)
            this.style.transform = "scale(0.95)";
            setTimeout(() => this.style.transform = "scale(1)", 100);

            if (this.innerText === "WARP ENGAGE") {
                gridFloor.style.animationDuration = "0.2s"; // Speed up grid
                addLog();
                setTimeout(() => {
                    gridFloor.style.animationDuration = "2s"; // Reset
                }, 3000);
            }
            
            if (this.innerText === "RED ALERT") {
                document.body.style.boxShadow = "inset 0 0 50px red";
                addLog();
                setTimeout(() => {
                    document.body.style.boxShadow = "none";
                }, 1000);
            }
        });
    });

    // Weapon Selection
    const weapons = document.querySelectorAll('.weapon-card');
    weapons.forEach(w => {
        w.addEventListener('click', () => {
            weapons.forEach(weap => weap.classList.remove('active'));
            w.classList.add('active');
            
            // Log selection
            const name = w.querySelector('.weapon-name').innerText;
            const entry = document.createElement('div');
            entry.classList.add('log-entry');
            entry.style.color = '#ff00ff';
            entry.innerHTML = `<span class="timestamp">MANUAL</span> // ${name} SELECTED`;
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        });
    });
});
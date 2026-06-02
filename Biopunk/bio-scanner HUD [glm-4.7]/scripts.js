document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONSTANTS & CONFIG ---
    const logMessages = [
        "SCANNING NEURAL PATHWAYS...",
        "NANOBOTS RECALIBRATING...",
        "DETECTED: ANOMALY IN SECTOR 4",
        "PAIN RECEPTORS: SUPPRESSED",
        "WARNING: CELLULAR DECAY ACCELERATING",
        "UPLOADING BIOMETRICS TO CLOUD...",
        "FILTERING BLOODSTREAM... 98% COMPLETE",
        "ADRENALINE SPIKE DETECTED",
        "MUTATION RATE: STABLE",
        "SYNAPTIC RESPONSE: 12ms",
        "MEMORY FRAGMENTATION DETECTED"
    ];

    // --- 1. SYSTEM CLOCK ---
    const clockEl = document.getElementById('sys-clock');
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        clockEl.textContent = `${h}:${m}:${s}:${ms}`;
        requestAnimationFrame(updateClock);
    }
    updateClock();

    // --- 2. DNA STRAND GENERATOR ---
    const dnaContainer = document.getElementById('dna-visual');
    const bases = ['A', 'T', 'C', 'G', 'X', 'Ø'];
    
    function generateDNA() {
        dnaContainer.innerHTML = '';
        for (let i = 0; i < 40; i++) {
            const base = document.createElement('span');
            base.textContent = bases[Math.floor(Math.random() * bases.length)];
            base.className = 'base-pair';
            
            // Randomize appearance for glitchy bio look
            if (Math.random() > 0.8) {
                base.style.color = '#ff003c'; // Mutation color
                base.style.textShadow = '0 0 5px #ff003c';
            } else {
                base.style.color = '#00ff9d';
            }
            
            // Randomly flip
            if (i % 2 !== 0) {
                base.style.transform = 'rotate(180deg)';
                base.style.marginTop = '5px';
            }
            
            dnaContainer.appendChild(base);
        }
    }
    generateDNA();
    // Regenerate occasionally to simulate active sequencing
    setInterval(generateDNA, 2000);


    // --- 3. ECG VISUALIZATION (CANVAS) ---
    const ecgCanvas = document.getElementById('ecg-canvas');
    const ecgCtx = ecgCanvas.getContext('2d');
    let ecgX = 0;
    let ecgY = ecgCanvas.height / 2;
    let speed = 2;
    
    // Resize handling
    function resizeCanvas(canvas) {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }
    resizeCanvas(ecgCanvas);
    window.addEventListener('resize', () => resizeCanvas(ecgCanvas));

    let lastBeatTime = 0;
    
    function drawECG(timestamp) {
        // Fade effect for the trail
        ecgCtx.fillStyle = 'rgba(0, 20, 15, 0.1)';
        ecgCtx.fillRect(0, 0, ecgCanvas.width, ecgCanvas.height);

        ecgCtx.lineWidth = 2;
        ecgCtx.strokeStyle = '#00ff9d';
        ecgCtx.shadowBlur = 5;
        ecgCtx.shadowColor = '#00ff9d';
        ecgCtx.beginPath();
        ecgCtx.moveTo(ecgX, ecgY);

        ecgX += speed;

        // Heartbeat Simulation (QRS Complex)
        const beatInterval = 600; // ms (approx 100bpm)
        const timeSinceBeat = timestamp - lastBeatTime;
        
        if (timeSinceBeat > beatInterval) {
            // Trigger beat
            if (timeSinceBeat < beatInterval + 100) {
                // P Wave
                ecgY -= 10;
            } else if (timeSinceBeat < beatInterval + 150) {
                // Q
                ecgY += 5;
            } else if (timeSinceBeat < beatInterval + 200) {
                // R (Spike up)
                ecgY -= 60;
            } else if (timeSinceBeat < beatInterval + 250) {
                // S (Spike down)
                ecgY += 30;
            } else if (timeSinceBeat < beatInterval + 400) {
                // T Wave
                ecgY -= 15;
            } else {
                // Reset beat timer
                lastBeatTime = timestamp;
                triggerHeartbeatVisuals();
            }
        } else {
            // Return to baseline with slight noise
            const targetY = ecgCanvas.height / 2;
            const noise = (Math.random() - 0.5) * 4;
            ecgY += (targetY - ecgY) * 0.1 + noise;
        }

        ecgCtx.lineTo(ecgX, ecgY);
        ecgCtx.stroke();

        // Reset X if off screen
        if (ecgX > ecgCanvas.width) {
            ecgX = 0;
            ecgY = ecgCanvas.height / 2;
            ecgCtx.moveTo(0, ecgY);
        }

        requestAnimationFrame(drawECG);
    }
    requestAnimationFrame(drawECG);


    // --- 4. NANO-SWARM VISUALIZATION (CANVAS) ---
    const nanoCanvas = document.getElementById('nano-canvas');
    const nanoCtx = nanoCanvas.getContext('2d');
    resizeCanvas(nanoCanvas);
    window.addEventListener('resize', () => resizeCanvas(nanoCanvas));

    const particles = [];
    const particleCount = 40;

    class Particle {
        constructor() {
            this.x = Math.random() * nanoCanvas.width;
            this.y = Math.random() * nanoCanvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > nanoCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > nanoCanvas.height) this.vy *= -1;
        }

        draw() {
            nanoCtx.fillStyle = '#00f3ff';
            nanoCtx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    // Initialize particles
    for(let i=0; i<particleCount; i++) particles.push(new Particle());

    function animateNanos() {
        nanoCtx.clearRect(0, 0, nanoCanvas.width, nanoCanvas.height);
        
        // Draw connections
        nanoCtx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
        nanoCtx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect nearby particles
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 60) {
                    nanoCtx.beginPath();
                    nanoCtx.moveTo(particles[i].x, particles[i].y);
                    nanoCtx.lineTo(particles[j].x, particles[j].y);
                    nanoCtx.stroke();
                }
            }
        }
        requestAnimationFrame(animateNanos);
    }
    animateNanos();


    // --- 5. INTERACTIVITY & LOGIC ---

    // Heartbeat Visual Sync
    function triggerHeartbeatVisuals() {
        // Update BPM text slightly
        const bpmDisplay = document.getElementById('bpm-display');
        const currentBpm = parseInt(bpmDisplay.textContent);
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        bpmDisplay.textContent = currentBpm + variance;

        // Trigger breathing animation on organs
        const organs = document.querySelectorAll('.organ-item');
        organs.forEach(organ => {
            organ.style.transform = 'scale(1.05)';
            setTimeout(() => organ.style.transform = 'scale(1)', 150);
        });
    }

    // Console Logger
    const consoleOutput = document.getElementById('console-log');
    
    function addLog() {
        const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        const p = document.createElement('p');
        p.textContent = `> ${msg}`;
        consoleOutput.appendChild(p);
        
        // Auto scroll
        consoleOutput.scrollTop = consoleOutput.scrollHeight;

        // Limit log entries
        if (consoleOutput.children.length > 8) {
            consoleOutput.removeChild(consoleOutput.firstChild);
        }
    }
    setInterval(addLog, 2500);

    // Hotspot Interaction
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(spot => {
        spot.addEventListener('click', function() {
            const info = this.getAttribute('data-info');
            // Create a temporary floating tooltip or log it
            const p = document.createElement('p');
            p.style.color = '#ff003c';
            p.textContent = `> INSPECTING: ${info}`;
            consoleOutput.appendChild(p);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            
            // Visual feedback
            this.style.fill = '#ff003c';
            this.style.r = '8';
            setTimeout(() => {
                this.style.fill = '#030507';
                this.style.r = '4';
            }, 500);
        });
    });

    // --- 6. TOXIN LEVEL FLUCTUATION ---
    const toxMeters = document.querySelectorAll('.circular-meter circle.circle');
    setInterval(() => {
        toxMeters.forEach(meter => {
            // Get current dasharray
            let currentVal = parseInt(meter.getAttribute('stroke-dasharray'));
            // Random walk
            let change = Math.floor(Math.random() * 5) - 2; 
            let newVal = currentVal + change;
            // Clamp
            if(newVal > 100) newVal = 100;
            if(newVal < 0) newVal = 0;
            
            meter.setAttribute('stroke-dasharray', `${newVal}, 100`);
            
            // Update text percentage if needed (simple selector assumption)
            const parent = meter.closest('.circular-meter');
            const text = parent.querySelector('.percentage');
            if(text) text.textContent = `${newVal}%`;
        });
    }, 1000);

});
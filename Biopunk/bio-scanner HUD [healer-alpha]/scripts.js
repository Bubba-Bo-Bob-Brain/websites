// ============================================
// BIOCORE BIOPUNK MEDICAL HUD - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initECG();
    initNeuralWave();
    initNanoSwarm();
    initGeneMatrix();
    initDateTime();
    initFrameCounter();
    initOrganAnimations();
    initDataUpdates();
    initInteractions();
});

// ============================================
// ECG WAVEFORM ANIMATION
// ============================================
function initECG() {
    const canvas = document.getElementById('ecgCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // ECG parameters
    const ecg = {
        positions: [],
        heartRate: 72,
        lastBeat: 0,
        beatInterval: 833, // ms for 72 BPM
        amplitude: 0.8,
        noise: 0.02,
        width: 0,
        speed: 2,
        colors: {
            line: '#00ffaa',
            glow: 'rgba(0, 255, 170, 0.5)',
            background: 'rgba(0, 0, 0, 0.3)'
        }
    };
    
    // Generate ECG waveform points
    function generateECGPoint(x, time) {
        const baseY = canvas.height / 2;
        let y = baseY;
        
        // Time relative to last beat
        const timeSinceBeat = (time - ecg.lastBeat) % ecg.beatInterval;
        const beatProgress = timeSinceBeat / ecg.beatInterval;
        
        // PQRST complex simulation
        if (beatProgress < 0.1) {
            // P wave
            y -= Math.sin(beatProgress * Math.PI * 10) * 15 * ecg.amplitude;
        } else if (beatProgress < 0.15) {
            // PR segment
            y -= 5;
        } else if (beatProgress < 0.2) {
            // Q wave
            y += Math.sin((beatProgress - 0.15) * Math.PI * 20) * 8 * ecg.amplitude;
        } else if (beatProgress < 0.25) {
            // R wave (sharp peak)
            y -= Math.sin((beatProgress - 0.2) * Math.PI * 20) * 45 * ecg.amplitude;
        } else if (beatProgress < 0.3) {
            // S wave
            y += Math.sin((beatProgress - 0.25) * Math.PI * 20) * 20 * ecg.amplitude;
        } else if (beatProgress < 0.5) {
            // ST segment
            y += 5;
        } else if (beatProgress < 0.7) {
            // T wave
            y -= Math.sin((beatProgress - 0.5) * Math.PI * 5) * 12 * ecg.amplitude;
        }
        
        // Add some noise
        y += (Math.random() - 0.5) * ecg.noise * 50;
        
        // Keep within bounds
        return Math.max(5, Math.min(canvas.height - 5, y));
    }
    
    // Draw ECG
    function drawECG(timestamp) {
        // Clear canvas
        ctx.fillStyle = ecg.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update heart rate display
        const bpmDisplay = document.getElementById('ecgBpmDisplay');
        const heartBpm = document.getElementById('heartBpm');
        if (bpmDisplay && heartBpm) {
            bpmDisplay.textContent = ecg.heartRate;
            heartBpm.textContent = ecg.heartRate;
        }
        
        // Add new points
        const x = ecg.width;
        const y = generateECGPoint(x, timestamp);
        ecg.positions.push({ x, y });
        
        // Move existing points left
        ecg.positions.forEach(point => {
            point.x -= ecg.speed;
        });
        
        // Remove points that are off screen
        ecg.positions = ecg.positions.filter(point => point.x > -10);
        
        // Draw waveform
        if (ecg.positions.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = ecg.colors.line;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Add glow effect
            ctx.shadowColor = ecg.colors.glow;
            ctx.shadowBlur = 10;
            
            // Draw line
            ctx.moveTo(ecg.positions[0].x, ecg.positions[0].y);
            for (let i = 1; i < ecg.positions.length; i++) {
                ctx.lineTo(ecg.positions[i].x, ecg.positions[i].y);
            }
            ctx.stroke();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
        
        // Draw grid lines (subtle)
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 10) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Trigger next frame
        requestAnimationFrame(drawECG);
    }
    
    // Start animation
    requestAnimationFrame(drawECG);
    
    // Update heart rate periodically
    setInterval(() => {
        ecg.heartRate = 68 + Math.floor(Math.random() * 10);
        ecg.beatInterval = 60000 / ecg.heartRate;
    }, 3000);
}

// ============================================
// NEURAL WAVE VISUALIZATION
// ============================================
function initNeuralWave() {
    const canvas = document.getElementById('neuralWaveCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const waves = [
        { frequency: 0.02, amplitude: 15, phase: 0, speed: 0.05, color: '#00aaff' },
        { frequency: 0.03, amplitude: 10, phase: Math.PI/4, speed: 0.03, color: '#8855ff' },
        { frequency: 0.01, amplitude: 20, phase: Math.PI/2, speed: 0.02, color: '#00ffaa' }
    ];
    
    let time = 0;
    
    function drawNeuralWave() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw each wave
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            
            // Add glow
            ctx.shadowColor = wave.color;
            ctx.shadowBlur = 5;
            
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height/2 + 
                         Math.sin(x * wave.frequency + wave.phase + time * wave.speed) * wave.amplitude +
                         Math.sin(x * wave.frequency * 2.5 + wave.phase * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.3;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
        });
        
        // Draw nodes (synapses)
        const nodeCount = 8;
        for (let i = 0; i < nodeCount; i++) {
            const x = (canvas.width / (nodeCount + 1)) * (i + 1);
            const y = canvas.height/2 + 
                     Math.sin(x * waves[0].frequency + waves[0].phase + time * waves[0].speed) * waves[0].amplitude;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00aaff';
            ctx.fill();
            
            // Draw connection to next node
            if (i < nodeCount - 1) {
                const nextX = (canvas.width / (nodeCount + 1)) * (i + 2);
                const nextY = canvas.height/2 + 
                             Math.sin(nextX * waves[0].frequency + waves[0].phase + time * waves[0].speed) * waves[0].amplitude;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, nextY);
                ctx.strokeStyle = 'rgba(0, 170, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        time++;
        requestAnimationFrame(drawNeuralWave);
    }
    
    drawNeuralWave();
}

// ============================================
// NANOMACHINE SWARM ANIMATION
// ============================================
function initNanoSwarm() {
    const canvas = document.getElementById('nanoCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Nanomachine particles
    const nanomachines = [];
    const particleCount = 150;
    
    // Body silhouette boundary (simplified)
    const bodyBounds = {
        head: { x: canvas.width * 0.5, y: canvas.height * 0.15, radius: 40 },
        torso: { x: canvas.width * 0.5, y: canvas.height * 0.4, width: 100, height: 150 },
        armLeft: { x: canvas.width * 0.3, y: canvas.height * 0.35, width: 20, height: 120 },
        armRight: { x: canvas.width * 0.7, y: canvas.height * 0.35, width: 20, height: 120 },
        legLeft: { x: canvas.width * 0.4, y: canvas.height * 0.7, width: 25, height: 180 },
        legRight: { x: canvas.width * 0.6, y: canvas.height * 0.7, width: 25, height: 180 }
    };
    
    // Create nanomachines
    for (let i = 0; i < particleCount; i++) {
        nanomachines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            color: Math.random() > 0.7 ? '#00ffaa' : 
                   Math.random() > 0.5 ? '#00e5ff' : '#88ffdd',
            alpha: Math.random() * 0.5 + 0.3,
            inBody: false,
            target: null,
            repairMode: Math.random() > 0.8
        });
    }
    
    // Check if point is inside body bounds
    function isInBody(x, y) {
        // Check head
        const headDist = Math.sqrt(
            Math.pow(x - bodyBounds.head.x, 2) + 
            Math.pow(y - bodyBounds.head.y, 2)
        );
        if (headDist < bodyBounds.head.radius) return true;
        
        // Check torso
        if (x > bodyBounds.torso.x - bodyBounds.torso.width/2 &&
            x < bodyBounds.torso.x + bodyBounds.torso.width/2 &&
            y > bodyBounds.torso.y - bodyBounds.torso.height/2 &&
            y < bodyBounds.torso.y + bodyBounds.torso.height/2) return true;
        
        // Check arms
        if ((x > bodyBounds.armLeft.x - bodyBounds.armLeft.width/2 &&
             x < bodyBounds.armLeft.x + bodyBounds.armLeft.width/2 &&
             y > bodyBounds.armLeft.y - bodyBounds.armLeft.height/2 &&
             y < bodyBounds.armLeft.y + bodyBounds.armLeft.height/2) ||
            (x > bodyBounds.armRight.x - bodyBounds.armRight.width/2 &&
             x < bodyBounds.armRight.x + bodyBounds.armRight.width/2 &&
             y > bodyBounds.armRight.y - bodyBounds.armRight.height/2 &&
             y < bodyBounds.armRight.y + bodyBounds.armRight.height/2)) return true;
        
        // Check legs
        if ((x > bodyBounds.legLeft.x - bodyBounds.legLeft.width/2 &&
             x < bodyBounds.legLeft.x + bodyBounds.legLeft.width/2 &&
             y > bodyBounds.legLeft.y - bodyBounds.legLeft.height/2 &&
             y < bodyBounds.legLeft.y + bodyBounds.legLeft.height/2) ||
            (x > bodyBounds.legRight.x - bodyBounds.legRight.width/2 &&
             x < bodyBounds.legRight.x + bodyBounds.legRight.width/2 &&
             y > bodyBounds.legRight.y - bodyBounds.legRight.height/2 &&
             y < bodyBounds.legRight.y + bodyBounds.legRight.height/2)) return true;
        
        return false;
    }
    
    // Draw nanomachines
    function drawNanoSwarm() {
        // Clear with trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update body bounds based on container size
        bodyBounds.head.x = canvas.width * 0.5;
        bodyBounds.head.y = canvas.height * 0.15;
        bodyBounds.torso.x = canvas.width * 0.5;
        bodyBounds.torso.y = canvas.height * 0.4;
        bodyBounds.armLeft.x = canvas.width * 0.3;
        bodyBounds.armLeft.y = canvas.height * 0.35;
        bodyBounds.armRight.x = canvas.width * 0.7;
        bodyBounds.armRight.y = canvas.height * 0.35;
        bodyBounds.legLeft.x = canvas.width * 0.4;
        bodyBounds.legLeft.y = canvas.height * 0.7;
        bodyBounds.legRight.x = canvas.width * 0.6;
        bodyBounds.legRight.y = canvas.height * 0.7;
        
        // Update and draw each nanomachine
        nanomachines.forEach(nano => {
            // Determine if in body
            nano.inBody = isInBody(nano.x, nano.y);
            
            // Movement behavior
            if (nano.inBody) {
                // Swarm behavior inside body
                if (Math.random() < 0.02) {
                    // Occasionally change direction
                    nano.vx += (Math.random() - 0.5) * 0.5;
                    nano.vy += (Math.random() - 0.5) * 0.5;
                }
                
                // Repair mode - move toward specific locations
                if (nano.repairMode && !nano.target) {
                    // Set target to a random organ location
                    const targets = [
                        { x: canvas.width * 0.45, y: canvas.height * 0.35 }, // Heart
                        { x: canvas.width * 0.55, y: canvas.height * 0.35 }, // Lungs
                        { x: canvas.width * 0.5, y: canvas.height * 0.45 }, // Liver
                        { x: canvas.width * 0.5, y: canvas.height * 0.5 }, // Kidneys
                        { x: canvas.width * 0.45, y: canvas.height * 0.45 } // Spleen
                    ];
                    nano.target = targets[Math.floor(Math.random() * targets.length)];
                }
                
                // Move toward target if in repair mode
                if (nano.repairMode && nano.target) {
                    const dx = nano.target.x - nano.x;
                    const dy = nano.target.y - nano.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 10) {
                        nano.vx += (dx / dist) * 0.1;
                        nano.vy += (dy / dist) * 0.1;
                    } else {
                        // Reached target, stop repair mode temporarily
                        nano.repairMode = false;
                        nano.target = null;
                        setTimeout(() => {
                            nano.repairMode = Math.random() > 0.5;
                        }, 2000);
                    }
                }
            } else {
                // Outside body - move toward body
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const dx = centerX - nano.x;
                const dy = centerY - nano.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 50) {
                    nano.vx += (dx / dist) * 0.05;
                    nano.vy += (dy / dist) * 0.05;
                }
            }
            
            // Apply velocity limits
            const maxSpeed = nano.inBody ? 1.5 : 2.5;
            const speed = Math.sqrt(nano.vx * nano.vx + nano.vy * nano.vy);
            if (speed > maxSpeed) {
                nano.vx = (nano.vx / speed) * maxSpeed;
                nano.vy = (nano.vy / speed) * maxSpeed;
            }
            
            // Update position
            nano.x += nano.vx;
            nano.y += nano.vy;
            
            // Add some random movement
            nano.vx += (Math.random() - 0.5) * 0.1;
            nano.vy += (Math.random() - 0.5) * 0.1;
            
            // Boundary conditions
            if (nano.x < 0) nano.x = canvas.width;
            if (nano.x > canvas.width) nano.x = 0;
            if (nano.y < 0) nano.y = canvas.height;
            if (nano.y > canvas.height) nano.y = 0;
            
            // Draw the nanomachine
            ctx.beginPath();
            ctx.arc(nano.x, nano.y, nano.size, 0, Math.PI * 2);
            
            // Different colors for different states
            let fillColor = nano.color;
            if (nano.repairMode) {
                fillColor = '#ffaa00'; // Orange for repair mode
            } else if (nano.inBody) {
                fillColor = '#00ffaa'; // Green when inside body
            } else {
                fillColor = 'rgba(0, 229, 255, 0.5)'; // Blue when outside
            }
            
            ctx.fillStyle = fillColor;
            ctx.globalAlpha = nano.alpha;
            ctx.fill();
            
            // Draw connections to nearby nanomachines
            nanomachines.forEach(other => {
                if (nano === other) return;
                
                const dx = nano.x - other.x;
                const dy = nano.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 30) {
                    ctx.beginPath();
                    ctx.moveTo(nano.x, nano.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(0, 255, 170, ${0.2 * (1 - dist/30)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
            
            ctx.globalAlpha = 1;
        });
        
        requestAnimationFrame(drawNanoSwarm);
    }
    
    drawNanoSwarm();
}

// ============================================
// GENE MATRIX GENERATION
// ============================================
function initGeneMatrix() {
    const matrix = document.getElementById('geneMatrix');
    const rows = 8;
    const cols = 8;
    
    // Create matrix cells
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'gene-cell';
        
        // Random compatibility level
        const rand = Math.random();
        if (rand > 0.7) {
            cell.classList.add('gene-cell--high');
        } else if (rand > 0.4) {
            cell.classList.add('gene-cell--mid');
        } else {
            cell.classList.add('gene-cell--low');
        }
        
        // Add hover effect
        cell.addEventListener('mouseenter', () => {
            cell.style.transform = 'scale(1.3)';
            cell.style.zIndex = '1';
            cell.style.boxShadow = '0 0 10px rgba(0, 255, 170, 0.5)';
        });
        
        cell.addEventListener('mouseleave', () => {
            cell.style.transform = '';
            cell.style.zIndex = '';
            cell.style.boxShadow = '';
        });
        
        matrix.appendChild(cell);
    }
    
    // Periodically update some cells
    setInterval(() => {
        const cells = matrix.querySelectorAll('.gene-cell');
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        
        // Remove all classes
        randomCell.classList.remove('gene-cell--high', 'gene-cell--mid', 'gene-cell--low');
        
        // Add new random class
        const rand = Math.random();
        if (rand > 0.7) {
            randomCell.classList.add('gene-cell--high');
        } else if (rand > 0.4) {
            randomCell.classList.add('gene-cell--mid');
        } else {
            randomCell.classList.add('gene-cell--low');
        }
    }, 2000);
}

// ============================================
// DATE/TIME UPDATES
// ============================================
function initDateTime() {
    const dateElement = document.querySelector('.datetime .date');
    const timeElement = document.querySelector('.datetime .time');
    
    function updateDateTime() {
        const now = new Date();
        
        // Format as 2187.06.14 (future date)
        const futureYear = now.getFullYear() + 166;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        dateElement.textContent = `${futureYear}.${month}.${day}`;
        
        // Format time with milliseconds
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}.${ms}`;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 100);
}

// ============================================
// FRAME COUNTER
// ============================================
function initFrameCounter() {
    const frameElement = document.getElementById('scanFrame');
    const progressElement = document.getElementById('scanProgress');
    let frame = 847293;
    let progress = 99.7;
    
    function updateFrame() {
        frame += Math.floor(Math.random() * 3);
        progress = 99.5 + Math.random() * 0.5;
        
        frameElement.textContent = `FRAME: ${frame.toLocaleString()}`;
        progressElement.textContent = `PROGRESS: ${progress.toFixed(1)}%`;
    }
    
    setInterval(updateFrame, 100);
}

// ============================================
// ORGAN ANIMATIONS & DATA UPDATES
// ============================================
function initOrganAnimations() {
    // Organ data with realistic ranges
    const organData = {
        heart: { bpm: 72, output: 5.2 },
        lungs: { spo2: 94, rate: 18 },
        kidneys: { gfr: 58 },
        brain: { activity: 79 }
    };
    
    function updateOrganData() {
        // Heart data
        organData.heart.bpm = 68 + Math.floor(Math.random() * 10);
        organData.heart.output = (4.8 + Math.random() * 0.8).toFixed(1);
        
        document.getElementById('heartBpm').textContent = organData.heart.bpm;
        document.getElementById('heartOutput').textContent = `${organData.heart.output} L/min`;
        
        // Lungs data
        organData.lungs.spo2 = 92 + Math.floor(Math.random() * 6);
        organData.lungs.rate = 16 + Math.floor(Math.random() * 5);
        
        document.getElementById('lungSpo2').textContent = `${organData.lungs.spo2}%`;
        document.getElementById('lungRate').textContent = `${organData.lungs.rate} /min`;
        
        // Kidneys data
        organData.kidneys.gfr = 55 + Math.floor(Math.random() * 8);
        document.getElementById('kidneyGfr').textContent = `${organData.kidneys.gfr} mL`;
        
        // Brain data
        organData.brain.activity = 75 + Math.floor(Math.random() * 10);
        document.getElementById('brainActivity').textContent = `${organData.brain.activity}%`;
        
        // Liver toxin clearance
        const toxinClearances = ['FAST', 'NOMINAL', 'SLOW', 'CRITICAL'];
        document.getElementById('liverToxin').textContent = 
            toxinClearances[Math.floor(Math.random() * toxinClearances.length)];
    }
    
    // Update toxin levels
    function updateToxinLevels() {
        const toxinValues = {
            heavy: (1.8 + Math.random() * 1.2).toFixed(1),
            bio: (0.5 + Math.random() * 0.6).toFixed(1),
            nano: (4.0 + Math.random() * 2.2).toFixed(1),
            rad: (0.1 + Math.random() * 0.4).toFixed(1)
        };
        
        document.getElementById('toxinHeavy').textContent = `${toxinValues.heavy} ppm`;
        document.getElementById('toxinBio').textContent = `${toxinValues.bio} mg/L`;
        document.getElementById('toxinNano').textContent = `${toxinValues.nano} ug`;
        document.getElementById('toxinRad').textContent = `${toxinValues.rad} mSv`;
        
        // Update toxin bar fills
        const toxinBars = document.querySelectorAll('.toxin-fill');
        toxinBars.forEach(bar => {
            const currentFill = parseFloat(bar.style.getPropertyValue('--fill'));
            const newFill = Math.max(5, Math.min(95, currentFill + (Math.random() - 0.5) * 10));
            bar.style.setProperty('--fill', `${newFill}%`);
        });
    }
    
    // Update neural integrity
    function updateNeuralIntegrity() {
        const integrity = 82 + Math.random() * 6;
        document.getElementById('neuralIntegrity').textContent = `${integrity.toFixed(1)}%`;
        
        // Update neural metrics
        const metrics = document.querySelectorAll('.nm-value');
        metrics.forEach(metric => {
            if (!metric.classList.contains('nm-value--warn')) {
                const currentValue = parseFloat(metric.textContent);
                const newValue = currentValue + (Math.random() - 0.5) * 0.1;
                metric.textContent = newValue.toFixed(1) + (metric.textContent.includes('TB/s') ? ' TB/s' : ' ms');
            }
        });
    }
    
    // Update nano deployment stats
    function updateNanoStats() {
        const total = 840000 + Math.floor(Math.random() * 15000);
        const active = Math.floor(total * (0.7 + Math.random() * 0.05));
        const repair = Math.floor(total * (0.2 + Math.random() * 0.05));
        const dead = total - active - repair;
        
        document.getElementById('nanoTotal').textContent = total.toLocaleString();
        document.getElementById('nanoActive').textContent = active.toLocaleString();
        document.getElementById('nanoRepair').textContent = repair.toLocaleString();
        document.getElementById('nanoDead').textContent = dead.toLocaleString();
        
        // Update deployment zones
        const zones = document.querySelectorAll('.zone-fill');
        zones.forEach(zone => {
            const currentFill = parseFloat(zone.style.getPropertyValue('--zfill'));
            const newFill = Math.max(30, Math.min(98, currentFill + (Math.random() - 0.5) * 5));
            zone.style.setProperty('--zfill', `${newFill}%`);
            
            // Update percentage text
            const pctElement = zone.closest('.zone-item').querySelector('.zone-pct');
            pctElement.textContent = `${Math.round(newFill)}%`;
        });
    }
    
    // Update mutation gauge
    function updateMutationGauge() {
        const mutationValue = 65 + Math.random() * 8;
        document.getElementById('mutationValue').textContent = `${mutationValue.toFixed(1)}%`;
        
        // Update mutation details
        document.getElementById('chromAberr').textContent = `${20 + Math.floor(Math.random() * 8)} detected`;
        document.getElementById('geneAnomaly').textContent = `${140 + Math.floor(Math.random() * 20)} loci`;
        document.getElementById('proteinError').textContent = `${(7 + Math.random() * 3).toFixed(1)}%`;
        document.getElementById('repFidelity').textContent = `${(90 + Math.random() * 3).toFixed(1)}%`;
        
        const stability = 40 + Math.floor(Math.random() * 15);
        document.getElementById('projStability').textContent = `${stability} DAYS`;
    }
    
    // Update threat level
    function updateThreatLevel() {
        const threat = 60 + Math.random() * 15;
        document.getElementById('threatValue').textContent = `${threat.toFixed(1)}%`;
        document.getElementById('threatFill').style.width = `${threat}%`;
    }
    
    // Start all updates
    setInterval(updateOrganData, 2000);
    setInterval(updateToxinLevels, 3000);
    setInterval(updateNeuralIntegrity, 2500);
    setInterval(updateNanoStats, 4000);
    setInterval(updateMutationGauge, 5000);
    setInterval(updateThreatLevel, 3500);
    
    // Initial updates
    updateOrganData();
    updateToxinLevels();
    updateNeuralIntegrity();
    updateNanoStats();
    updateMutationGauge();
    updateThreatLevel();
}

// ============================================
// DATA UPDATES (MISC)
// ============================================
function initDataUpdates() {
    // Update patient ID occasionally
    const patientIdElement = document.getElementById('patientId');
    const patientIds = ['CX-7734-OMEGA', 'CX-7734-ALPHA', 'CX-7734-BETA', 'CX-7734-GAMMA'];
    
    setInterval(() => {
        patientIdElement.textContent = patientIds[Math.floor(Math.random() * patientIds.length)];
    }, 30000);
    
    // Update scan status
    const scanStatusElement = document.getElementById('scanStatus');
    const scanStatuses = [
        'CONTINUOUS SCAN ACTIVE',
        'DEEP TISSUE SCAN',
        'NEURAL MAPPING MODE',
        'NANO DISTRIBUTION ANALYSIS',
        'GENOME SEQUENCING'
    ];
    
    setInterval(() => {
        const span = scanStatusElement.querySelector('span:last-child');
        span.textContent = scanStatuses[Math.floor(Math.random() * scanStatuses.length)];
    }, 15000);
    
    // Update data strip with new readings
    const dataStrip = document.getElementById('dataStrip');
    const dataReadings = [
        '[CORE TEMP: 36.8C]',
        '[BLOOD pH: 7.38]',
        '[O2 SAT: 94%]',
        '[GLUCOSE: 92 mg/dL]',
        '[CORTISOL: 18.4 ug/dL]',
        '[INSULIN: 12.3 uIU/mL]',
        '[HEMOGLOBIN: 13.2 g/dL]',
        '[PLATELETS: 245K/uL]',
        '[WBC: 7.8K/uL]',
        '[CREATININE: 1.4 mg/dL]',
        '[BUN: 18 mg/dL]',
        '[LACTATE: 1.2 mmol/L]'
    ];
    
    // Update a random reading periodically
    setInterval(() => {
        const spans = dataStrip.querySelectorAll('span');
        const randomSpan = spans[Math.floor(Math.random() * spans.length)];
        
        // Generate new value based on reading type
        let newText = randomSpan.textContent;
        if (newText.includes('TEMP')) {
            const temp = (36.5 + Math.random() * 0.6).toFixed(1);
            newText = `[CORE TEMP: ${temp}C]`;
        } else if (newText.includes('pH')) {
            const ph = (7.35 + Math.random() * 0.06).toFixed(2);
            newText = `[BLOOD pH: ${ph}]`;
        } else if (newText.includes('O2')) {
            const o2 = 92 + Math.floor(Math.random() * 6);
            newText = `[O2 SAT: ${o2}%]`;
        }
        
        randomSpan.textContent = newText;
    }, 5000);
}

// ============================================
// INTERACTIVE FEATURES
// ============================================
function initInteractions() {
    // Organ markers in body scanner
    const organMarkers = document.querySelectorAll('.organ-marker');
    const organCards = document.querySelectorAll('.organ-card');
    
    organMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            const organ = marker.dataset.organ;
            const card = document.querySelector(`.organ-card[data-organ="${organ}"]`);
            if (card) {
                card.style.transform = 'scale(1.05)';
                card.style.borderColor = 'rgba(0, 255, 170, 0.8)';
                card.style.boxShadow = '0 0 20px rgba(0, 255, 170, 0.3)';
            }
        });
        
        marker.addEventListener('mouseleave', () => {
            const organ = marker.dataset.organ;
            const card = document.querySelector(`.organ-card[data-organ="${organ}"]`);
            if (card) {
                card.style.transform = '';
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }
        });
    });
    
    // Organ cards hover effect
    organCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const organ = card.dataset.organ;
            const marker = document.querySelector(`.organ-marker[data-organ="${organ}"]`);
            if (marker) {
                const pulseRing = marker.querySelector('.pulse-ring');
                const core = marker.querySelector('.core');
                
                if (pulseRing) {
                    pulseRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    pulseRing.style.opacity = '1';
                }
                
                if (core) {
                    core.style.transform = 'translate(-50%, -50%) scale(1.5)';
                }
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const organ = card.dataset.organ;
            const marker = document.querySelector(`.organ-marker[data-organ="${organ}"]`);
            if (marker) {
                const pulseRing = marker.querySelector('.pulse-ring');
                const core = marker.querySelector('.core');
                
                if (pulseRing) {
                    pulseRing.style.transform = '';
                    pulseRing.style.opacity = '';
                }
                
                if (core) {
                    core.style.transform = '';
                }
            }
        });
    });
    
    // Neural rings interaction
    const neuralRings = document.getElementById('neuralRings');
    neuralRings.addEventListener('mouseenter', () => {
        const rings = neuralRings.querySelectorAll('.neural-ring');
        rings.forEach(ring => {
            ring.style.animationDuration = '5s';
            ring.style.opacity = '0.8';
        });
    });
    
    neuralRings.addEventListener('mouseleave', () => {
        const rings = neuralRings.querySelectorAll('.neural-ring');
        rings.forEach((ring, index) => {
            ring.style.animationDuration = `${20 - index * 5}s`;
            ring.style.opacity = '0.5';
        });
    });
    
    // Alert items click to acknowledge
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('alert-item--critical')) {
                item.classList.remove('alert-item--critical');
                item.classList.add('alert-item--info');
                item.querySelector('.alert-text').textContent = 'ACKNOWLEDGED: ' + 
                    item.querySelector('.alert-text').textContent;
            }
        });
    });
    
    // Add glitch effect on keypress
    document.addEventListener('keydown', (e) => {
        if (e.key === 'g') {
            document.body.style.animation = 'glitch 0.3s ease';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 300);
        }
    });
    
    // Add glitch keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
}
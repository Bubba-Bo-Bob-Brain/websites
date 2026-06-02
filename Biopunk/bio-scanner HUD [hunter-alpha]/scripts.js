/* ============================================
   NEXUS-7 BIOLOGICAL INTEGRITY MONITOR
   Biopunk Medical HUD - JavaScript
   ============================================ */

// Global State
const state = {
    bpm: 72,
    bpmVariation: 0,
    startTime: Date.now(),
    frameCount: 0,
    logEntries: [],
    deployedNano: 847000,
    totalNano: 2400000,
    repairingNano: 124000,
    mutationProgress: 47
};

// ECG Canvas Setup
const ecgCanvas = document.getElementById('ecgCanvas');
const ecgCtx = ecgCanvas ? ecgCanvas.getContext('2d') : null;
let ecgData = [];
const ECG_POINTS = 200;

// Neural Canvas Setup
const neuralCanvas = document.getElementById('neuralCanvas');
const neuralCtx = neuralCanvas ? neuralCanvas.getContext('2d') : null;
let neuralNodes = [];
let neuralConnections = [];

// Nano Canvas Setup
const nanoCanvas = document.getElementById('nanoCanvas');
const nanoCtx = nanoCanvas ? nanoCanvas.getContext('2d') : null;
let nanoParticles = [];

// Initialize everything
function init() {
    resizeCanvases();
    initECG();
    initNeuralNetwork();
    initNanoSwarm();
    generateGeneSequence();
    generateGeneMatrix();
    startAnimationLoop();
    setupEventListeners();
    startDataUpdates();
    addLogEntry('SYS', 'NEXUS-7 biological integrity monitor initialized');
    addLogEntry('BIO', 'Scanning subject KAEL-07 neural pathways');
    addLogEntry('ALERT', '2 anomalies detected in cardiac region');
}

// Canvas Resize Handler
function resizeCanvases() {
    if (ecgCanvas) {
        ecgCanvas.width = ecgCanvas.offsetWidth * window.devicePixelRatio;
        ecgCanvas.height = ecgCanvas.offsetHeight * window.devicePixelRatio;
        ecgCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    if (neuralCanvas) {
        neuralCanvas.width = neuralCanvas.offsetWidth * window.devicePixelRatio;
        neuralCanvas.height = neuralCanvas.offsetHeight * window.devicePixelRatio;
        neuralCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    if (nanoCanvas) {
        nanoCanvas.width = nanoCanvas.offsetWidth * window.devicePixelRatio;
        nanoCanvas.height = nanoCanvas.offsetHeight * window.devicePixelRatio;
        nanoCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
}

// ECG Functions
function initECG() {
    ecgData = [];
    for (let i = 0; i < ECG_POINTS; i++) {
        ecgData.push(0);
    }
}

function generateECGPoint(index, bpm) {
    const cycleLength = Math.floor(60 / (bpm / 60) * 3);
    const position = index % cycleLength;
    const normalizedPos = position / cycleLength;
    
    let value = 0;
    
    // P wave
    if (normalizedPos > 0.1 && normalizedPos < 0.2) {
        value = Math.sin((normalizedPos - 0.1) * Math.PI / 0.1) * 0.15;
    }
    // QRS complex
    else if (normalizedPos > 0.25 && normalizedPos < 0.28) {
        value = -0.1;
    }
    else if (normalizedPos > 0.28 && normalizedPos < 0.32) {
        value = Math.sin((normalizedPos - 0.28) * Math.PI / 0.04) * 0.9;
    }
    else if (normalizedPos > 0.32 && normalizedPos < 0.35) {
        value = -0.2;
    }
    // T wave
    else if (normalizedPos > 0.45 && normalizedPos < 0.6) {
        value = Math.sin((normalizedPos - 0.45) * Math.PI / 0.15) * 0.25;
    }
    
    // Add some noise
    value += (Math.random() - 0.5) * 0.02;
    
    return value;
}

function drawECG() {
    if (!ecgCtx || !ecgCanvas) return;
    
    const width = ecgCanvas.offsetWidth;
    const height = ecgCanvas.offsetHeight;
    const centerY = height / 2;
    
    ecgCtx.clearRect(0, 0, width, height);
    
    // Draw grid
    ecgCtx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ecgCtx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 20) {
        ecgCtx.beginPath();
        ecgCtx.moveTo(i, 0);
        ecgCtx.lineTo(i, height);
        ecgCtx.stroke();
    }
    
    for (let i = 0; i < height; i += 20) {
        ecgCtx.beginPath();
        ecgCtx.moveTo(0, i);
        ecgCtx.lineTo(width, i);
        ecgCtx.stroke();
    }
    
    // Draw ECG line
    ecgCtx.beginPath();
    ecgCtx.strokeStyle = '#00ff88';
    ecgCtx.lineWidth = 2;
    ecgCtx.shadowColor = '#00ff88';
    ecgCtx.shadowBlur = 10;
    
    const pointWidth = width / ECG_POINTS;
    
    for (let i = 0; i < ecgData.length; i++) {
        const x = i * pointWidth;
        const y = centerY - (ecgData[i] * (height * 0.35));
        
        if (i === 0) {
            ecgCtx.moveTo(x, y);
        } else {
            ecgCtx.lineTo(x, y);
        }
    }
    
    ecgCtx.stroke();
    ecgCtx.shadowBlur = 0;
    
    // Draw leading dot
    const lastIndex = (ecgData.length - 1);
    const lastX = lastIndex * pointWidth;
    const lastY = centerY - (ecgData[lastIndex] * (height * 0.35));
    
    ecgCtx.beginPath();
    ecgCtx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ecgCtx.fillStyle = '#00ff88';
    ecgCtx.shadowColor = '#00ff88';
    ecgCtx.shadowBlur = 15;
    ecgCtx.fill();
    ecgCtx.shadowBlur = 0;
}

function updateECG() {
    state.bpmVariation += (Math.random() - 0.5) * 0.5;
    state.bpmVariation = Math.max(-3, Math.min(3, state.bpmVariation));
    
    const currentBPM = state.bpm + state.bpmVariation;
    
    ecgData.shift();
    ecgData.push(generateECGPoint(state.frameCount, currentBPM));
    
    // Update BPM display
    const bpmDisplay = document.getElementById('bpmValue');
    if (bpmDisplay) {
        bpmDisplay.textContent = Math.round(currentBPM);
    }
}

// Neural Network Functions
function initNeuralNetwork() {
    neuralNodes = [];
    neuralConnections = [];
    
    const width = neuralCanvas ? neuralCanvas.offsetWidth : 280;
    const height = neuralCanvas ? neuralCanvas.offsetHeight : 180;
    
    // Create nodes
    for (let i = 0; i < 25; i++) {
        neuralNodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 3 + Math.random() * 3,
            pulse: Math.random() * Math.PI * 2,
            active: Math.random() > 0.3
        });
    }
    
    // Create connections
    for (let i = 0; i < neuralNodes.length; i++) {
        for (let j = i + 1; j < neuralNodes.length; j++) {
            if (Math.random() > 0.7) {
                neuralConnections.push({
                    from: i,
                    to: j,
                    signal: Math.random(),
                    speed: 0.01 + Math.random() * 0.02,
                    degraded: Math.random() > 0.8
                });
            }
        }
    }
}

function drawNeuralNetwork() {
    if (!neuralCtx || !neuralCanvas) return;
    
    const width = neuralCanvas.offsetWidth;
    const height = neuralCanvas.offsetHeight;
    
    neuralCtx.clearRect(0, 0, width, height);
    
    // Update and draw connections
    neuralConnections.forEach(conn => {
        const from = neuralNodes[conn.from];
        const to = neuralNodes[conn.to];
        
        conn.signal += conn.speed;
        if (conn.signal > 1) conn.signal = 0;
        
        const gradient = neuralCtx.createLinearGradient(from.x, from.y, to.x, to.y);
        
        if (conn.degraded) {
            gradient.addColorStop(0, 'rgba(255, 170, 0, 0.1)');
            gradient.addColorStop(conn.signal, 'rgba(255, 170, 0, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 170, 0, 0.1)');
        } else {
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
            gradient.addColorStop(conn.signal, 'rgba(0, 255, 136, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0.1)');
        }
        
        neuralCtx.beginPath();
        neuralCtx.strokeStyle = gradient;
        neuralCtx.lineWidth = 1;
        neuralCtx.moveTo(from.x, from.y);
        neuralCtx.lineTo(to.x, to.y);
        neuralCtx.stroke();
    });
    
    // Update and draw nodes
    neuralNodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.05;
        
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        
        const pulseSize = Math.sin(node.pulse) * 2;
        
        neuralCtx.beginPath();
        neuralCtx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2);
        
        if (node.active) {
            neuralCtx.fillStyle = '#00ff88';
            neuralCtx.shadowColor = '#00ff88';
            neuralCtx.shadowBlur = 10;
        } else {
            neuralCtx.fillStyle = '#ff0044';
            neuralCtx.shadowColor = '#ff0044';
            neuralCtx.shadowBlur = 10;
        }
        
        neuralCtx.fill();
        neuralCtx.shadowBlur = 0;
    });
}

// Nano Swarm Functions
function initNanoSwarm() {
    nanoParticles = [];
    
    const width = nanoCanvas ? nanoCanvas.offsetWidth : 400;
    const height = nanoCanvas ? nanoCanvas.offsetHeight : 150;
    
    for (let i = 0; i < 150; i++) {
        nanoParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 2 + Math.random() * 2,
            type: Math.random() > 0.7 ? 'repair' : 'idle',
            target: null,
            life: 1
        });
    }
}

function drawNanoSwarm() {
    if (!nanoCtx || !nanoCanvas) return;
    
    const width = nanoCanvas.offsetWidth;
    const height = nanoCanvas.offsetHeight;
    
    // Fade effect
    nanoCtx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    nanoCtx.fillRect(0, 0, width, height);
    
    // Draw grid background
    nanoCtx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
    nanoCtx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 15) {
        nanoCtx.beginPath();
        nanoCtx.moveTo(i, 0);
        nanoCtx.lineTo(i, height);
        nanoCtx.stroke();
    }
    
    for (let i = 0; i < height; i += 15) {
        nanoCtx.beginPath();
        nanoCtx.moveTo(0, i);
        nanoCtx.lineTo(width, i);
        nanoCtx.stroke();
    }
    
    // Update and draw particles
    nanoParticles.forEach((p, index) => {
        // Flocking behavior
        let avgX = 0, avgY = 0, count = 0;
        
        nanoParticles.forEach((other, otherIndex) => {
            if (index !== otherIndex) {
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 30) {
                    avgX += other.x;
                    avgY += other.y;
                    count++;
                    
                    if (dist < 10) {
                        p.vx -= dx * 0.01;
                        p.vy -= dy * 0.01;
                    }
                }
            }
        });
        
        if (count > 0) {
            avgX /= count;
            avgY /= count;
            p.vx += (avgX - p.x) * 0.001;
            p.vy += (avgY - p.y) * 0.001;
        }
        
        // Limit velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
            p.vx = (p.vx / speed) * 2;
            p.vy = (p.vy / speed) * 2;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
        
        // Draw particle
        nanoCtx.beginPath();
        nanoCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.type === 'repair') {
            nanoCtx.fillStyle = '#00ffff';
            nanoCtx.shadowColor = '#00ffff';
        } else {
            nanoCtx.fillStyle = '#00ff88';
            nanoCtx.shadowColor = '#00ff88';
        }
        
        nanoCtx.shadowBlur = 5;
        nanoCtx.fill();
        nanoCtx.shadowBlur = 0;
        
        // Draw connections between close particles
        nanoParticles.forEach((other, otherIndex) => {
            if (index < otherIndex) {
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 25) {
                    nanoCtx.beginPath();
                    nanoCtx.strokeStyle = `rgba(0, 255, 136, ${(1 - dist / 25) * 0.3})`;
                    nanoCtx.lineWidth = 0.5;
                    nanoCtx.moveTo(p.x, p.y);
                    nanoCtx.lineTo(other.x, other.y);
                    nanoCtx.stroke();
                }
            }
        });
    });
}

// Gene Sequence Generation
function generateGeneSequence() {
    const container = document.getElementById('geneSequence');
    if (!container) return;
    
    const bases = ['A', 'T', 'G', 'C'];
    const mutationPositions = [5, 12, 18, 25, 33, 41, 48, 55, 62, 70];
    
    container.innerHTML = '';
    
    for (let i = 0; i < 80; i++) {
        const base = document.createElement('span');
        base.className = 'gene-base';
        
        if (mutationPositions.includes(i)) {
            base.classList.add('mutated');
            base.textContent = bases[Math.floor(Math.random() * 4)];
        } else {
            const baseType = bases[Math.floor(Math.random() * 4)].toLowerCase();
            base.classList.add(baseType);
            base.textContent = bases[Math.floor(Math.random() * 4)];
        }
        
        container.appendChild(base);
    }
}

// Gene Matrix Generation
function generateGeneMatrix() {
    const container = document.getElementById('geneMatrix');
    if (!container) return;
    
    const genes = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON'];
    const compatibility = ['compatible', 'partial', 'unstable', 'reject'];
    
    container.innerHTML = '';
    
    // Header row
    container.appendChild(createMatrixCell('', 'header'));
    genes.forEach(gene => {
        container.appendChild(createMatrixCell(gene.charAt(0), 'header'));
    });
    
    // Data rows
    genes.forEach((rowGene, rowIndex) => {
        container.appendChild(createMatrixCell(rowGene.charAt(0), 'header'));
        
        genes.forEach((colGene, colIndex) => {
            if (rowIndex === colIndex) {
                container.appendChild(createMatrixCell('-', 'compatible'));
            } else {
                const rand = Math.random();
                let status;
                if (rand < 0.4) status = 'compatible';
                else if (rand < 0.65) status = 'partial';
                else if (rand < 0.85) status = 'unstable';
                else status = 'reject';
                
                container.appendChild(createMatrixCell(Math.floor(Math.random() * 100), status));
            }
        });
    });
}

function createMatrixCell(text, className) {
    const cell = document.createElement('div');
    cell.className = `matrix-cell ${className}`;
    cell.textContent = text;
    return cell;
}

// Log System
function addLogEntry(type, message) {
    const container = document.getElementById('logContainer');
    if (!container) return;
    
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-type ${type.toLowerCase()}">${type}</span>
        <span class="log-msg">${message}</span>
    `;
    
    container.innerHTML = '';
    container.appendChild(entry);
    
    state.logEntries.push({ type, message, time });
    if (state.logEntries.length > 50) {
        state.logEntries.shift();
    }
}

// Data Updates
function startDataUpdates() {
    setInterval(() => {
        updateStats();
        updateThreatLevel();
    }, 2000);
    
    setInterval(() => {
        updateRandomLog();
    }, 5000);
}

function updateStats() {
    // Update neural stats
    const bandwidth = document.getElementById('bandwidth');
    if (bandwidth) {
        const bw = 800 + Math.random() * 100;
        bandwidth.textContent = `${Math.round(bw)} Tb/s`;
    }
    
    const latency = document.getElementById('latency');
    if (latency) {
        const lat = 10 + Math.random() * 5;
        latency.textContent = `${lat.toFixed(1)} ms`;
    }
    
    const packetLoss = document.getElementById('packetLoss');
    if (packetLoss) {
        const loss = 1 + Math.random() * 3;
        packetLoss.textContent = `${loss.toFixed(1)}%`;
    }
    
    const syncRate = document.getElementById('syncRate');
    if (syncRate) {
        const sync = 95 + Math.random() * 4;
        syncRate.textContent = `${sync.toFixed(1)}%`;
    }
    
    // Update nano stats
    const nanoActive = document.getElementById('nanoActive');
    if (nanoActive) {
        state.deployedNano += Math.floor((Math.random() - 0.3) * 1000);
        state.deployedNano = Math.max(0, Math.min(state.totalNano, state.deployedNano));
        nanoActive.textContent = formatNumber(state.deployedNano);
    }
    
    const nanoRepair = document.getElementById('nanoRepair');
    if (nanoRepair) {
        const repair = 10000 + Math.random() * 5000;
        nanoRepair.textContent = formatNumber(Math.round(repair));
    }
    
    const nanoIdle = document.getElementById('nanoIdle');
    if (nanoIdle) {
        const idle = state.totalNano - state.deployedNano;
        nanoIdle.textContent = formatNumber(idle);
    }
    
    // Update mutation stats
    const activeMutations = document.getElementById('activeMutations');
    if (activeMutations) {
        activeMutations.textContent = 6 + Math.floor(Math.random() * 3);
    }
    
    const mutationStability = document.getElementById('mutationStability');
    if (mutationStability) {
        const stability = 70 + Math.random() * 10;
        mutationStability.textContent = `${stability.toFixed(1)}%`;
    }
    
    // Update toxin index
    const toxIndex = document.getElementById('toxIndex');
    if (toxIndex) {
        const tox = 55 + Math.random() * 10;
        toxIndex.textContent = tox.toFixed(1);
    }
}

function updateThreatLevel() {
    const threatFill = document.getElementById('threatFill');
    const threatValue = document.getElementById('threatValue');
    
    if (threatFill && threatValue) {
        const threat = 3 + Math.random() * 2;
        threatValue.textContent = threat.toFixed(1);
        threatFill.style.setProperty('--threat-width', `${threat * 10}%`);
    }
}

function updateRandomLog() {
    const logs = [
        { type: 'BIO', msg: 'Cardiac rhythm stabilizing' },
        { type: 'SYS', msg: 'Neural pathway scan complete' },
        { type: 'BIO', msg: 'Mutation expression increasing' },
        { type: 'ALERT', msg: 'Toxin levels elevated in sector 7' },
        { type: 'BIO', msg: 'Nanomachine swarm efficiency: 94%' },
        { type: 'SYS', msg: 'Gene splice analysis in progress' },
        { type: 'BIO', msg: 'Hepatic mutation phase 2 advancing' },
        { type: 'ALERT', msg: 'Neural link latency spike detected' }
    ];
    
    const log = logs[Math.floor(Math.random() * logs.length)];
    addLogEntry(log.type, log.msg);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Event Listeners
function setupEventListeners() {
    window.addEventListener('resize', () => {
        resizeCanvases();
        initNeuralNetwork();
        initNanoSwarm();
    });
    
    // Deployment buttons
    const deployRepair = document.getElementById('deployRepair');
    if (deployRepair) {
        deployRepair.addEventListener('click', () => {
            addLogEntry('SYS', 'Deploying repair swarm to cardiac region');
            addLogEntry('BIO', '847K nanomachines redirected');
            
            // Visual feedback
            nanoParticles.forEach(p => {
                if (Math.random() > 0.5) {
                    p.type = 'repair';
                }
            });
        });
    }
    
    const deployScan = document.getElementById('deployScan');
    if (deployScan) {
        deployScan.addEventListener('click', () => {
            addLogEntry('SYS', 'Initiating deep tissue scan');
            addLogEntry('BIO', 'Scanning mutation patterns...');
            
            setTimeout(() => {
                addLogEntry('BIO', 'Deep scan complete - 3 new mutations detected');
            }, 2000);
        });
    }
    
    const deployPurge = document.getElementById('deployPurge');
    if (deployPurge) {
        deployPurge.addEventListener('click', () => {
            addLogEntry('ALERT', 'Toxin purge protocol initiated');
            addLogEntry('BIO', 'Filtering neurotoxin-X7 from bloodstream');
            
            setTimeout(() => {
                addLogEntry('BIO', 'Toxin levels reduced by 12%');
            }, 1500);
        });
    }
    
    // Organ dot hover effects
    document.querySelectorAll('.organ-dot').forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const organ = e.target.dataset.organ;
            const status = e.target.dataset.status;
            addLogEntry('BIO', `Analyzing ${organ}: Status ${status}`);
        });
    });
}

// Time Display
function updateTime() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    const systemTime = document.getElementById('systemTime');
    if (systemTime) {
        systemTime.textContent = timeStr;
    }
    
    // Update uptime
    const elapsed = Date.now() - state.startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    const uptime = document.getElementById('uptime');
    if (uptime) {
        uptime.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // Update frame count
    const frameCount = document.getElementById('frameCount');
    if (frameCount) {
        frameCount.textContent = state.frameCount;
    }
    
    // Update memory usage (simulated)
    const memUsage = document.getElementById('memUsage');
    if (memUsage) {
        memUsage.textContent = 240 + Math.floor(Math.random() * 20);
    }
}

// Scan coordinates update
function updateScanCoords() {
    const scanCoord = document.getElementById('scanCoord');
    const scanDepth = document.getElementById('scanDepth');
    
    if (scanCoord) {
        const x = 100 + Math.floor(Math.random() * 100);
        const y = 150 + Math.floor(Math.random() * 100);
        scanCoord.textContent = `X: ${x} Y: ${y}`;
    }
    
    if (scanDepth) {
        const depth = (3 + Math.random() * 3).toFixed(1);
        scanDepth.textContent = `DEPTH: ${depth}cm`;
    }
}

// Main Animation Loop
function startAnimationLoop() {
    function animate() {
        state.frameCount++;
        
        // Update ECG
        updateECG();
        drawECG();
        
        // Draw neural network
        drawNeuralNetwork();
        
        // Draw nano swarm
        drawNanoSwarm();
        
        // Update time display
        if (state.frameCount % 60 === 0) {
            updateTime();
        }
        
        // Update scan coordinates
        if (state.frameCount % 120 === 0) {
            updateScanCoords();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}
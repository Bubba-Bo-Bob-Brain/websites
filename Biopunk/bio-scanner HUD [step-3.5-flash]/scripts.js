// ===== BIOPUNK MEDICAL HUD - SCRIPTS =====

// State Management
const state = {
    patient: {
        id: 'CYB-2077-Δ-8942',
        heartRate: 72,
        spo2: 98,
        systolic: 120,
        diastolic: 80,
        mutationRate: 0.03,
        neuralIntegrity: 94.2,
        neuralLatency: 12,
        neuralBandwidth: 2.4,
        swarmActive: 2400000,
        swarmDeployment: 87,
        swarmMode: 'heal'
    },
    organs: {
        heart: { health: 94, ejection: 62, volume: 72, status: 'stable' },
        lungs: { health: 78, capacity: 4.2, efficiency: 87, status: 'warning' },
        liver: { health: 42, enzymes: 142, detox: 63, status: 'critical' },
        kidneys: { health: 92, gfr: 118, balance: 98, status: 'stable' },
        brain: { health: 91, synapse: 89, coherence: 94, status: 'stable' }
    },
    toxins: {
        heavyMetals: 0.4,
        radiation: 0.9,
        neural: 1.3,
        viral: 0.7
    },
    geneMatrix: {
        muscle: { compat: 88, progress: 72 },
        bone: { compat: 95, progress: 91 },
        nerve: { compat: 76, progress: 58 },
        immune: { compat: 62, progress: 34 }
    }
};

// Canvas Contexts
let heartbeatCtx, swarmCtx;
let heartbeatAnimationId, swarmAnimationId;
let heartbeatData = [];
let swarmParticles = [];
let signalPatternCanvas, signalPatternCtx;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvases();
    initializeEventListeners();
    startDataSimulation();
    startDiagnosticLog();
    updateTime();
    setInterval(updateTime, 1000);
});

// ===== CANVAS SETUP =====
function initializeCanvases() {
    // Heartbeat Canvas
    const heartbeatCanvas = document.getElementById('heartbeat-canvas');
    heartbeatCanvas.width = heartbeatCanvas.offsetWidth * window.devicePixelRatio;
    heartbeatCanvas.height = heartbeatCanvas.offsetHeight * window.devicePixelRatio;
    heartbeatCtx = heartbeatCanvas.getContext('2d');
    heartbeatCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Initialize heartbeat data
    for (let i = 0; i < 100; i++) {
        heartbeatData[i] = 50;
    }
    
    // Swarm Canvas
    const swarmCanvas = document.getElementById('swarm-canvas');
    swarmCanvas.width = swarmCanvas.offsetWidth * window.devicePixelRatio;
    swarmCanvas.height = swarmCanvas.offsetHeight * window.devicePixelRatio;
    swarmCtx = swarmCanvas.getContext('2d');
    
    // Initialize swarm particles
    initializeSwarmParticles(swarmCanvas);
    
    // Start animations
    animateHeartbeat();
    animateSwarm();
    
    // Signal pattern canvas
    signalPatternCanvas = document.getElementById('signal-pattern');
    if (signalPatternCanvas) {
        signalPatternCanvas.width = signalPatternCanvas.offsetWidth;
        signalPatternCanvas.height = signalPatternCanvas.offsetHeight;
        signalPatternCtx = signalPatternCanvas.getContext('2d');
        animateSignalPattern();
    }
}

function initializeSwarmParticles(canvas) {
    const particleCount = 150;
    swarmParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
        swarmParticles.push({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            pulse: Math.random() * Math.PI * 2
        });
    }
}

// ===== ANIMATIONS =====
function animateHeartbeat() {
    const canvas = document.getElementById('heartbeat-canvas');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Generate new heartbeat data point
    const time = Date.now() / 1000;
    const bpm = state.patient.heartRate;
    const beatInterval = 60 / bpm;
    const phase = (time % beatInterval) / beatInterval;
    
    // Simulate ECG pattern
    let value = 50;
    if (phase < 0.1) {
        value = 50 - (phase / 0.1) * 20; // P wave descending
    } else if (phase < 0.15) {
        value = 30 + ((phase - 0.1) / 0.05) * 60; // QRS complex
    } else if (phase < 0.2) {
        value = 90 - ((phase - 0.15) / 0.05) * 40; // S wave
    } else if (phase < 0.3) {
        value = 50 + ((phase - 0.2) / 0.1) * 30; // T wave
    } else if (phase < 0.4) {
        value = 80 - ((phase - 0.3) / 0.1) * 30; // T wave descending
    }
    
    // Add noise
    value += (Math.random() - 0.5) * 10;
    value = Math.max(10, Math.min(90, value));
    
    heartbeatData.push(value);
    heartbeatData.shift();
    
    // Clear canvas
    heartbeatCtx.clearRect(0, 0, width, height);
    
    // Draw grid
    heartbeatCtx.strokeStyle = 'rgba(0, 255, 200, 0.1)';
    heartbeatCtx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 20) {
        heartbeatCtx.beginPath();
        heartbeatCtx.moveTo(x, 0);
        heartbeatCtx.lineTo(x, height);
        heartbeatCtx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
        heartbeatCtx.beginPath();
        heartbeatCtx.moveTo(0, y);
        heartbeatCtx.lineTo(width, y);
        heartbeatCtx.stroke();
    }
    
    // Draw heartbeat line
    heartbeatCtx.strokeStyle = '#00ff88';
    heartbeatCtx.lineWidth = 2;
    heartbeatCtx.shadowColor = '#00ff88';
    heartbeatCtx.shadowBlur = 10;
    heartbeatCtx.beginPath();
    
    const step = width / (heartbeatData.length - 1);
    for (let i = 0; i < heartbeatData.length; i++) {
        const x = i * step;
        const y = height - (heartbeatData[i] / 100 * height);
        if (i === 0) {
            heartbeatCtx.moveTo(x, y);
        } else {
            heartbeatCtx.lineTo(x, y);
        }
    }
    heartbeatCtx.stroke();
    
    // Draw current point
    const lastX = (heartbeatData.length - 1) * step;
    const lastY = height - (heartbeatData[heartbeatData.length - 1] / 100 * height);
    heartbeatCtx.fillStyle = '#00ff88';
    heartbeatCtx.beginPath();
    heartbeatCtx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    heartbeatCtx.fill();
    
    heartbeatAnimationId = requestAnimationFrame(animateHeartbeat);
}

function animateSwarm() {
    const canvas = document.getElementById('swarm-canvas');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const deployment = state.patient.swarmDeployment / 100;
    
    // Clear with fade effect
    swarmCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    swarmCtx.fillRect(0, 0, width, height);
    
    // Draw swarm particles
    swarmParticles.forEach((particle, index) => {
        // Update position based on mode
        let targetX = width / 2;
        let targetY = height / 2;
        
        switch (state.patient.swarmMode) {
            case 'heal':
                // Gentle circular motion around center
                particle.vx += (Math.random() - 0.5) * 0.2;
                particle.vy += (Math.random() - 0.5) * 0.2;
                break;
            case 'repair':
                // Grid-like scanning pattern
                const scanY = (Date.now() / 50) % height;
                const distToScan = Math.abs(particle.y - scanY);
                if (distToScan < 20) {
                    particle.vx = (Math.random() - 0.5) * 3;
                }
                break;
            case 'defend':
                // Rapid movement, forming defensive perimeter
                const angle = Math.atan2(particle.y - height/2, particle.x - width/2);
                particle.vx = Math.cos(angle) * 2;
                particle.vy = Math.sin(angle) * 2;
                break;
            case 'aggressive':
                // Chaotic, high-speed movement
                particle.vx += (Math.random() - 0.5) * 1;
                particle.vy += (Math.random() - 0.5) * 1;
                break;
        }
        
        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        
        // Boundary check - wrap around
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Pulse animation
        particle.pulse += 0.1;
        const pulseSize = Math.sin(particle.pulse) * 0.5 + 1;
        
        // Only draw active particles based on deployment
        if (index < swarmParticles.length * deployment) {
            // Draw connection lines to nearby particles
            swarmCtx.strokeStyle = `rgba(0, 255, 200, ${0.1 * particle.opacity})`;
            swarmCtx.lineWidth = 0.5;
            for (let j = index + 1; j < Math.min(index + 5, swarmParticles.length); j++) {
                if (j < swarmParticles.length * deployment) {
                    const other = swarmParticles[j];
                    const dist = Math.hypot(particle.x - other.x, particle.y - other.y);
                    if (dist < 30) {
                        swarmCtx.beginPath();
                        swarmCtx.moveTo(particle.x, particle.y);
                        swarmCtx.lineTo(other.x, other.y);
                        swarmCtx.stroke();
                    }
                }
            }
            
            // Draw particle
            swarmCtx.fillStyle = `rgba(0, 255, 200, ${particle.opacity * 0.8})`;
            swarmCtx.shadowColor = '#00ffcc';
            swarmCtx.shadowBlur = 5;
            swarmCtx.beginPath();
            swarmCtx.arc(particle.x, particle.y, particle.size * pulseSize, 0, Math.PI * 2);
            swarmCtx.fill();
        }
    });
    
    swarmAnimationId = requestAnimationFrame(animateSwarm);
}

function animateSignalPattern() {
    if (!signalPatternCanvas || !signalPatternCtx) return;
    
    const width = signalPatternCanvas.width;
    const height = signalPatternCanvas.height;
    const time = Date.now() / 1000;
    
    signalPatternCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    signalPatternCtx.fillRect(0, 0, width, height);
    
    // Draw multiple signal waves
    for (let wave = 0; wave < 3; wave++) {
        signalPatternCtx.strokeStyle = `rgba(0, 255, 200, ${0.3 - wave * 0.1})`;
        signalPatternCtx.lineWidth = 1.5;
        signalPatternCtx.beginPath();
        
        const amplitude = 10 + wave * 5;
        const frequency = 0.02 - wave * 0.005;
        const offset = wave * 20;
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + 
                     Math.sin(x * frequency + time * 2 + wave) * amplitude +
                     Math.sin(x * frequency * 2 + time * 3) * (amplitude / 2);
            if (x === 0) {
                signalPatternCtx.moveTo(x, y + offset);
            } else {
                signalPatternCtx.lineTo(x, y + offset);
            }
        }
        signalPatternCtx.stroke();
    }
    
    requestAnimationFrame(animateSignalPattern);
}

// ===== DATA SIMULATION =====
function startDataSimulation() {
    // Update vitals every 2 seconds
    setInterval(updateVitals, 2000);
    
    // Update organs every 3 seconds
    setInterval(updateOrgans, 3000);
    
    // Update toxins every 4 seconds
    setInterval(updateToxins, 4000);
    
    // Update neural link every 2.5 seconds
    setInterval(updateNeuralLink, 2500);
    
    // Update mutation rate every 5 seconds
    setInterval(updateMutationRate, 5000);
    
    // Update swarm stats every 1 second
    setInterval(updateSwarmStats, 1000);
    
    // Update gene matrix every 10 seconds
    setInterval(updateGeneMatrix, 10000);
}

function updateVitals() {
    // Simulate slight variations
    state.patient.heartRate = clamp(70 + (Math.random() - 0.5) * 10, 60, 120);
    state.patient.spo2 = clamp(97 + (Math.random() - 0.5) * 3, 95, 100);
    state.patient.systolic = clamp(115 + (Math.random() - 0.5) * 15, 100, 140);
    state.patient.diastolic = clamp(75 + (Math.random() - 0.5) * 10, 60, 90);
    
    // Update DOM
    document.getElementById('heart-rate').textContent = Math.round(state.patient.heartRate);
    document.getElementById('spo2').textContent = Math.round(state.patient.spo2);
    document.getElementById('blood-pressure').textContent = 
        `${state.patient.systolic}/${state.patient.diastolic}`;
    document.getElementById('heartbeat-number').textContent = Math.round(state.patient.heartRate);
    
    // Update ECG visualization based on heart rate
    const beatInterval = 60 / state.patient.heartRate;
    // This affects the heartbeat animation naturally through the value
}

function updateOrgans() {
    // Update each organ with slight variations
    updateOrgan('heart', 0.5, 1);
    updateOrgan('lungs', 0.3, 0.5);
    updateOrgan('liver', 0.8, 1.5); // Liver degrades faster
    updateOrgan('kidneys', 0.2, 0.3);
    updateOrgan('brain', 0.1, 0.2);
}

function updateOrgan(organName, variance, degradationRate) {
    const organ = state.organs[organName];
    
    // Degrade health slowly
    if (organ.status !== 'critical') {
        organ.health = clamp(organ.health - (Math.random() * degradationRate), 0, 100);
    } else {
        // Critical organs can sometimes stabilize
        if (Math.random() > 0.7) {
            organ.health = clamp(organ.health + Math.random() * 2, 0, 100);
        }
    }
    
    // Update specific stats
    if (organName === 'heart') {
        organ.ejection = clamp(55 + (organ.health / 100) * 20 + (Math.random() - 0.5) * 3, 40, 80);
        organ.volume = clamp(65 + (organ.health / 100) * 20 + (Math.random() - 0.5) * 5, 50, 100);
    } else if (organName === 'lungs') {
        organ.capacity = clamp(3.5 + (organ.health / 100) * 2 + (Math.random() - 0.5) * 0.3, 2, 6);
        organ.efficiency = clamp(70 + (organ.health / 100) * 30 + (Math.random() - 0.5) * 5, 40, 100);
    } else if (organName === 'liver') {
        organ.enzymes = clamp(100 + (100 - organ.health) * 2 + (Math.random() - 0.5) * 20, 50, 300);
        organ.detox = clamp(organ.health + (Math.random() - 0.5) * 10, 0, 100);
    } else if (organName === 'kidneys') {
        organ.gfr = clamp(90 + (organ.health / 100) * 40 + (Math.random() - 0.5) * 10, 60, 150);
        organ.balance = clamp(organ.health + (Math.random() - 0.5) * 5, 0, 100);
    } else if (organName === 'brain') {
        organ.synapse = clamp(80 + (organ.health / 100) * 20 + (Math.random() - 0.5) * 5, 50, 100);
        organ.coherence = clamp(85 + (organ.health / 100) * 15 + (Math.random() - 0.5) * 5, 60, 100);
    }
    
    // Determine status
    if (organ.health >= 80) {
        organ.status = 'stable';
    } else if (organ.health >= 50) {
        organ.status = 'warning';
    } else {
        organ.status = 'critical';
    }
    
    // Update DOM
    const card = document.querySelector(`.organ-card[data-organ="${organName}"]`);
    if (card) {
        // Update status badge
        const statusEl = card.querySelector('.organ-status');
        statusEl.className = `organ-status status-${organ.status}`;
        statusEl.textContent = organ.status.toUpperCase();
        
        // Update stats
        const stats = card.querySelectorAll('.stat-value');
        if (organName === 'heart') {
            stats[0].textContent = `${Math.round(organ.ejection)}%`;
            stats[1].textContent = `${Math.round(organ.volume)}ml`;
        } else if (organName === 'lungs') {
            stats[0].textContent = `${organ.capacity.toFixed(1)}L`;
            stats[1].textContent = `${Math.round(organ.efficiency)}%`;
        } else if (organName === 'liver') {
            stats[0].textContent = Math.round(organ.enzymes);
            stats[1].textContent = `${Math.round(organ.detox)}%`;
        } else if (organName === 'kidneys') {
            stats[0].textContent = Math.round(organ.gfr);
            stats[1].textContent = `${Math.round(organ.balance)}%`;
        } else if (organName === 'brain') {
            stats[0].textContent = `${Math.round(organ.synapse)}%`;
            stats[1].textContent = `${Math.round(organ.coherence)}%`;
        }
        
        // Update health bar
        const healthFill = card.querySelector('.health-fill');
        healthFill.style.width = `${organ.health}%`;
        healthFill.className = `health-fill ${organ.status === 'warning' ? 'warning' : ''} ${organ.status === 'critical' ? 'critical' : ''}`;
    }
}

function updateToxins() {
    // Simulate toxin fluctuation
    state.toxins.heavyMetals = clamp(state.toxins.heavyMetals + (Math.random() - 0.5) * 0.1, 0, 2);
    state.toxins.radiation = clamp(state.toxins.radiation + (Math.random() - 0.5) * 0.2, 0, 2);
    state.toxins.neural = clamp(state.toxins.neural + (Math.random() - 0.5) * 0.15, 0, 2);
    state.toxins.viral = clamp(state.toxins.viral + (Math.random() - 0.5) * 0.1, 0, 2);
    
    // Update DOM
    document.getElementById('toxin-heavy').textContent = state.toxins.heavyMetals.toFixed(1);
    document.getElementById('toxin-radiation').textContent = state.toxins.radiation.toFixed(1);
    document.getElementById('toxin-neural').textContent = state.toxins.neural.toFixed(1);
    document.getElementById('toxin-viral').textContent = state.toxins.viral.toFixed(1);
    
    // Update toxin bars
    const toxinItems = document.querySelectorAll('.toxin-item');
    const toxinValues = [
        state.toxins.heavyMetals / 2, // Scale to 0-1
        state.toxins.radiation / 2,
        state.toxins.neural / 2,
        state.toxins.viral / 2
    ];
    
    toxinItems.forEach((item, index) => {
        const fill = item.querySelector('.toxin-fill');
        const width = toxinValues[index] * 100;
        fill.style.width = `${width}%`;
        
        // Update color based on level
        if (width > 60) {
            fill.classList.add('critical');
            fill.classList.remove('warning');
        } else if (width > 40) {
            fill.classList.add('warning');
            fill.classList.remove('critical');
        } else {
            fill.classList.remove('warning', 'critical');
        }
    });
    
    // Check for critical toxin levels
    if (state.toxins.neural > 1.2) {
        showAlert('CRITICAL: Neural toxin levels exceed safety threshold', 'critical');
    }
}

function updateNeuralLink() {
    // Simulate neural link fluctuations
    state.patient.neuralIntegrity = clamp(92 + (Math.random() - 0.5) * 8, 80, 100);
    state.patient.neuralLatency = clamp(8 + (Math.random() - 0.5) * 8, 4, 30);
    state.patient.neuralBandwidth = clamp(2.0 + (Math.random() - 0.5) * 1, 1, 4);
    
    // Update DOM
    document.getElementById('integrity-value').textContent = `${state.patient.neuralIntegrity.toFixed(1)}%`;
    document.getElementById('integrity-fill').style.width = `${state.patient.neuralIntegrity}%`;
    document.getElementById('latency-value').textContent = `${Math.round(state.patient.neuralLatency)}ms`;
    document.getElementById('bandwidth-value').textContent = `${state.patient.neuralBandwidth.toFixed(1)} TB/s`;
    
    // Update neural status dot
    const statusDot = document.getElementById('neural-status');
    if (state.patient.neuralIntegrity < 85) {
        statusDot.className = 'status-dot';
        statusDot.style.background = 'var(--neon-yellow)';
    } else if (state.patient.neuralIntegrity < 95) {
        statusDot.className = 'status-dot active';
    } else {
        statusDot.className = 'status-dot active';
        statusDot.style.background = 'var(--neon-green)';
    }
}

function updateMutationRate() {
    // Mutation rate slowly increases
    state.patient.mutationRate = clamp(state.patient.mutationRate + (Math.random() - 0.5) * 0.005, 0, 5);
    
    // Update DOM
    document.getElementById('mutation-value').textContent = `${state.patient.mutationRate.toFixed(2)}%`;
    document.getElementById('mutation-fill').style.width = `${state.patient.mutationRate * 20}%`; // Scale up for visibility
    
    // Flash if high
    if (state.patient.mutationRate > 2) {
        document.getElementById('mutation-fill').style.animation = 'mutation-flash 0.5s ease-in-out infinite';
    } else {
        document.getElementById('mutation-fill').style.animation = 'none';
    }
}

function updateSwarmStats() {
    // Simulate swarm count changes based on deployment
    const baseCount = 2400000;
    const activeCount = Math.round(baseCount * (state.patient.swarmDeployment / 100) + (Math.random() - 0.5) * 100000);
    
    state.patient.swarmActive = activeCount;
    
    // Update DOM
    document.getElementById('swarm-active').textContent = formatNumber(activeCount);
    document.getElementById('swarm-deployment').textContent = `${state.patient.swarmDeployment}%`;
    
    // Update deployment slider fill
    document.getElementById('deployment-fill').style.width = `${state.patient.swarmDeployment}%`;
    
    // Update toggle
    const toggle = document.getElementById('swarm-toggle');
    if (state.patient.swarmDeployment > 0) {
        toggle.textContent = 'ACTIVE';
        toggle.classList.add('active');
    } else {
        toggle.textContent = 'INACTIVE';
        toggle.classList.remove('active');
    }
}

function updateGeneMatrix() {
    // Slowly progress gene splicing
    Object.keys(state.geneMatrix).forEach(target => {
        const gene = state.geneMatrix[target];
        if (gene.progress < 100) {
            gene.progress = clamp(gene.progress + Math.random() * 2, 0, 100);
        }
        if (gene.compat < 100) {
            gene.compat = clamp(gene.compat + Math.random() * 0.5, 0, 100);
        }
    });
    
    // Update DOM
    const rows = document.querySelectorAll('.gene-row:not(.header)');
    const targets = ['muscle', 'bone', 'nerve', 'immune'];
    
    rows.forEach((row, index) => {
        const target = targets[index];
        const gene = state.geneMatrix[target];
        
        const compatFill = row.querySelector('.compat-fill');
        const progressFill = row.querySelector('.progress-fill');
        const compatValue = row.querySelector('.compat-value');
        
        if (compatFill) compatFill.style.width = `${gene.compat}%`;
        if (progressFill) progressFill.style.width = `${gene.progress}%`;
        if (compatValue) compatValue.textContent = `${Math.round(gene.compat)}%`;
    });
}

// ===== DIAGNOSTIC LOG =====
function startDiagnosticLog() {
    const logContainer = document.getElementById('diagnostic-log');
    const messages = [
        'Initializing neural interface...',
        'Calibrating biosensors...',
        'Nanomachine swarm activated',
        'Scanning anatomical structures...',
        'Organ function analysis complete',
        'Toxin levels within acceptable range',
        'Gene splice matrix updated',
        'Neural link synchronization: 94.2%',
        'ECG monitoring active',
        'Swarm deployment: optimal',
        'Liver enzyme levels elevated - monitoring',
        'Neural toxin threshold exceeded - warning',
        'Nanomachine deployment increased',
        'System diagnostic complete'
    ];
    
    // Add initial log entries
    messages.forEach((msg, index) => {
        setTimeout(() => {
            addLogEntry(msg);
        }, index * 500);
    });
    
    // Continue adding random log entries
    setInterval(() => {
        const randomMsgs = [
            'Routine scan completed',
            'Nanomachines repairing tissue',
            'Synaptic efficiency optimized',
            'Toxin filtration active',
            'Neural bandwidth stable',
            'Organ health metrics updated',
            'Mutation rate: nominal',
            'Swarm coordination: optimal',
            'Biomarker analysis: normal',
            'System integrity: 98.7%',
            'Calibration check: passed',
            'Signal clarity: excellent',
            'Database synchronization: complete'
        ];
        const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        addLogEntry(msg);
    }, 3000);
}

function addLogEntry(message) {
    const logContainer = document.getElementById('diagnostic-log');
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;
    
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Keep only last 50 entries
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

// ===== ALERT SYSTEM =====
function showAlert(message, level = 'warning') {
    const modal = document.getElementById('alert-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = modal.querySelector('.modal-icon');
    
    modalMessage.textContent = message;
    
    // Set icon and color based on level
    if (level === 'critical') {
        modalIcon.textContent = '⚠';
        modal.style.borderColor = 'var(--neon-red)';
    } else if (level === 'warning') {
        modalIcon.textContent = '⚠';
        modal.style.borderColor = 'var(--neon-yellow)';
    } else {
        modalIcon.textContent = 'ℹ';
        modal.style.borderColor = 'var(--neon-cyan)';
    }
    
    modal.classList.add('active');
    
    // Auto-hide after 10 seconds if not acknowledged
    setTimeout(() => {
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    }, 10000);
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Swarm toggle
    const swarmToggle = document.getElementById('swarm-toggle');
    swarmToggle.addEventListener('click', () => {
        if (state.patient.swarmDeployment > 0) {
            state.patient.swarmDeployment = 0;
            swarmToggle.textContent = 'INACTIVE';
            swarmToggle.classList.remove('active');
            addLogEntry('Nanomachine swarm deactivated');
        } else {
            state.patient.swarmDeployment = 87;
            swarmToggle.textContent = 'ACTIVE';
            swarmToggle.classList.add('active');
            addLogEntry('Nanomachine swarm activated');
        }
    });
    
    // Deployment slider
    const deploymentSlider = document.getElementById('deployment-slider');
    deploymentSlider.addEventListener('input', (e) => {
        state.patient.swarmDeployment = parseInt(e.target.value);
        updateSwarmStats();
    });
    
    // Mode buttons
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.patient.swarmMode = btn.dataset.mode;
            addLogEntry(`Swarm mode changed to: ${state.patient.swarmMode.toUpperCase()}`);
        });
    });
    
    // Modal acknowledge button
    const modalBtn = document.getElementById('modal-acknowledge');
    modalBtn.addEventListener('click', () => {
        document.getElementById('alert-modal').classList.remove('active');
    });
    
    // Organ card hover effects with detailed info
    const organCards = document.querySelectorAll('.organ-card');
    organCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const organ = card.dataset.organ;
            // Could show more detailed tooltip here
        });
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
        // Reinitialize canvases to adjust to new size
        cancelAnimationFrame(heartbeatAnimationId);
        cancelAnimationFrame(swarmAnimationId);
        initializeCanvases();
    });
}

// ===== UTILITIES =====
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function updateTime() {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const date = now.toISOString().split('T')[0].replace(/-/g, '.');
    
    document.getElementById('current-time').textContent = time;
    document.getElementById('current-date').textContent = date;
}

// ===== WIREFRAME INTERACTIVITY =====
// Add subtle interactivity to the anatomical wireframe
document.querySelectorAll('.organ-wireframe').forEach(wireframe => {
    wireframe.style.cursor = 'pointer';
    wireframe.addEventListener('mouseenter', function() {
        this.style.strokeWidth = '3';
        this.style.filter = 'drop-shadow(0 0 15px currentColor)';
    });
    wireframe.addEventListener('mouseleave', function() {
        this.style.strokeWidth = '';
        this.style.filter = '';
    });
});

// ===== ADDITIONAL EFFECTS =====
// Add CSS animation for mutation flash
const style = document.createElement('style');
style.textContent = `
    @keyframes mutation-flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATION =====
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(heartbeatAnimationId);
        cancelAnimationFrame(swarmAnimationId);
    } else {
        animateHeartbeat();
        animateSwarm();
    }
});

console.log('BIO-SYNC Medical HUD Interface Initialized');
console.log('Patient:', state.patient.id);
console.log('Systems: ONLINE');
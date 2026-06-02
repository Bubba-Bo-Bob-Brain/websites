/* ===== BIOPUNK MEDICAL HUD - SURGICAL GOTHIC INTERACTIVITY ===== */

// DOM Elements
const heartbeatWave = document.getElementById('heartbeatWave');
const bpmValue = document.getElementById('bpmValue');
const integrityFill = document.getElementById('integrityFill');
const mutationFill = document.getElementById('mutationFill');
const toxinFill = document.getElementById('toxinFill');
const activeNodes = document.getElementById('activeNodes');
const infectionRate = document.getElementById('infectionRate');
const swarmEfficiency = document.getElementById('swarmEfficiency');
const compatibilityScore = document.getElementById('compatibilityScore');
const collapseTimer = document.getElementById('collapseTimer');
const systemLog = document.getElementById('systemLog');
const dataStream = document.getElementById('dataStream');
const geneMatrix = document.getElementById('geneMatrix');
const swarmVisualizer = document.getElementById('swarmVisualizer');
const neuralWeb = document.getElementById('neuralWeb');
const dnaStrand = document.getElementById('dnaStrand');
const bodyCanvas = document.getElementById('bodyCanvas');
const particleCanvas = document.getElementById('particleCanvas');

// Audio Elements
const heartbeatAudio = document.getElementById('heartbeatAudio');
const warningAudio = document.getElementById('warningAudio');
const scanAudio = document.getElementById('scanAudio');

// Control Buttons
const deployBtn = document.getElementById('deployBtn');
const scanBtn = document.getElementById('scanBtn');
const stabilizeBtn = document.getElementById('stabilizeBtn');
const purgeBtn = document.getElementById('purgeBtn');

// State Variables
let patientStatus = {
    bpm: 142,
    integrity: 37,
    mutation: 68,
    toxin: 74,
    activeNodes: 1247,
    infectionRate: 2.3,
    swarmEfficiency: 47,
    compatibility: 23,
    collapseTime: 272, // seconds
    neuralIntegrity: 42,
    dataThroughput: 61,
    latency: 78
};

let isNanomachineDeployed = false;
let scanActive = false;
let stabilizationActive = false;
let collapseInterval;
let heartbeatInterval;
let dataStreamInterval;
let particleInterval;
let nanomachineInterval;

// Initialize the HUD
function initHUD() {
    console.log('NEXUS-7 Biopunk Medical HUD Initializing...');
    
    // Set initial values
    updateAllDisplays();
    
    // Start dynamic systems
    startHeartbeat();
    startCollapseTimer();
    startDataStream();
    initParticleSystem();
    initBodyWireframe();
    initGeneMatrix();
    initSwarmVisualizer();
    initNeuralWeb();
    initDNAStrand();
    
    // Play ambient heartbeat
    heartbeatAudio.volume = 0.3;
    heartbeatAudio.play().catch(e => console.log('Audio play failed:', e));
    
    // Add initial log entries
    addLogEntry('22:47:03 - SYSTEM INITIALIZATION COMPLETE');
    addLogEntry('22:47:05 - PATIENT VITALS MONITORING ACTIVE');
    
    // Setup event listeners
    setupEventListeners();
    
    // Start periodic updates
    setInterval(updatePatientStatus, 2000);
    
    console.log('HUD Initialization Complete. Patient Status: CRITICAL');
}

// Update all display elements with current state
function updateAllDisplays() {
    bpmValue.textContent = patientStatus.bpm;
    integrityFill.style.width = `${patientStatus.integrity}%`;
    mutationFill.style.width = `${patientStatus.mutation}%`;
    toxinFill.style.height = `${patientStatus.toxin}%`;
    activeNodes.textContent = patientStatus.activeNodes.toLocaleString();
    infectionRate.textContent = `+${patientStatus.infectionRate.toFixed(1)}%/s`;
    swarmEfficiency.textContent = `${patientStatus.swarmEfficiency}%`;
    compatibilityScore.textContent = `${patientStatus.compatibility}%`;
    
    // Update collapse timer
    updateCollapseTimer();
}

// Heartbeat simulation
function startHeartbeat() {
    heartbeatInterval = setInterval(() => {
        // Generate realistic heartbeat waveform
        heartbeatWave.innerHTML = '';
        const width = heartbeatWave.offsetWidth;
        const height = heartbeatWave.offsetHeight;
        
        // Create SVG for heartbeat waveform
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        
        // Create path for heartbeat
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Heartbeat pattern coordinates (simplified)
        const points = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments) * width;
            const t = (i / segments) * Math.PI * 2;
            
            // Complex heartbeat pattern
            let y;
            if (i < segments * 0.1) {
                y = height * 0.5; // Flatline before beat
            } else if (i < segments * 0.2) {
                y = height * 0.2; // P wave
            } else if (i < segments * 0.3) {
                y = height * 0.8; // QRS complex start
            } else if (i < segments * 0.4) {
                y = height * 0.1; // R peak
            } else if (i < segments * 0.5) {
                y = height * 0.7; // S wave
            } else if (i < segments * 0.6) {
                y = height * 0.4; // T wave
            } else {
                y = height * 0.5; // Return to baseline
            }
            
            // Add some randomness for organic feel
            y += (Math.random() - 0.5) * height * 0.05;
            points.push(`${x},${y}`);
        }
        
        const d = `M ${points.join(' L ')}`;
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#ff0055');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        
        // Add glow filter
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'heartbeat-glow');
        
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '3');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        
        svg.appendChild(filter);
        svg.appendChild(path);
        heartbeatWave.appendChild(svg);
        
        // Animate the path drawing
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        
        // Animate
        path.animate([
            { strokeDashoffset: length },
            { strokeDashoffset: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)'
        });
        
        // Sync audio with visualization
        heartbeatAudio.currentTime = 0;
        
    }, 800); // Match BPM animation speed
}

// Collapse timer countdown
function startCollapseTimer() {
    collapseInterval = setInterval(() => {
        if (patientStatus.collapseTime > 0) {
            patientStatus.collapseTime--;
            updateCollapseTimer();
            
            // Randomly trigger warnings as time runs low
            if (patientStatus.collapseTime < 60 && Math.random() > 0.7) {
                triggerRandomWarning();
            }
        } else {
            clearInterval(collapseInterval);
            addLogEntry('SYSTEM COLLAPSE IMMINENT - PATIENT TERMINATION INEVITABLE');
        }
    }, 1000);
}

function updateCollapseTimer() {
    const minutes = Math.floor(patientStatus.collapseTime / 60);
    const seconds = patientStatus.collapseTime % 60;
    collapseTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color as time runs out
    if (patientStatus.collapseTime < 60) {
        collapseTimer.style.animationDuration = '0.5s';
    }
}

// Dynamic data stream overlay
function startDataStream() {
    const medicalData = [
        'BIOSIGNATURE: Θ-9',
        'CYBERNETIC ASSIMILATION: 87%',
        'NANO-PRION CONCENTRATION: CRITICAL',
        'NEURAL INTEGRITY: DEGRADING',
        'GENE-SPLICE REJECTION: 77%',
        'TOXIN LEVELS: EXCEEDING THRESHOLD',
        'HEART CYBERNETICS: FAILING',
        'IMMUNE RESPONSE: SUPPRESSED',
        'NEURAL CORE TEMP: 42.3°C',
        'BLOOD PH: 7.1',
        'CYBERNETIC WASTE ACCUMULATION',
        'SYNAPSE DEGRADATION DETECTED',
        'ORGAN FAILURE IMMINENT',
        'NANOMACHINE SWARM: ACTIVE',
        'PATIENT PROGNOSIS: TERMINAL'
    ];
    
    dataStreamInterval = setInterval(() => {
        // Clear and add new data stream
        dataStream.innerHTML = '';
        
        // Create multiple lines of streaming data
        const lineCount = 50;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'data-line';
            
            // Random data with occasional glitches
            let text;
            if (Math.random() > 0.9) {
                // Glitch effect
                text = '###' + Array(30).fill(0).map(() => 
                    Math.random() > 0.5 ? '1' : '0'
                ).join('') + '###';
            } else {
                text = medicalData[Math.floor(Math.random() * medicalData.length)];
            }
            
            line.textContent = text;
            
            // Random positioning and animation
            line.style.left = `${Math.random() * 100}%`;
            line.style.top = `${Math.random() * 100}%`;
            line.style.opacity = Math.random() * 0.3 + 0.1;
            line.style.fontSize = `${Math.random() * 4 + 10}px`;
            
            // Animation
            line.animate([
                { transform: 'translateY(0)', opacity: 0 },
                { transform: 'translateY(-20px)', opacity: line.style.opacity },
                { transform: 'translateY(-40px)', opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'linear'
            });
            
            dataStream.appendChild(line);
        }
    }, 3000);
}

// Particle system for background
function initParticleSystem() {
    const ctx = particleCanvas.getContext('2d');
    particleCanvas.width = particleCanvas.offsetWidth;
    particleCanvas.height = particleCanvas.offsetHeight;
    
    const particles = [];
    const particleCount = 100;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: Math.random() > 0.7 ? '#00ff9d' : 
                   Math.random() > 0.5 ? '#ff0055' : '#9d00ff',
            opacity: Math.random() * 0.3 + 0.1
        });
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = particleCanvas.width;
            if (particle.x > particleCanvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = particleCanvas.height;
            if (particle.y > particleCanvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Anatomical body wireframe
function initBodyWireframe() {
    const ctx = bodyCanvas.getContext('2d');
    bodyCanvas.width = bodyCanvas.offsetWidth;
    bodyCanvas.height = bodyCanvas.offsetHeight;
    
    function drawBody() {
        ctx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);
        
        // Draw body outline
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        
        // Simplified body silhouette
        ctx.beginPath();
        
        // Head
        ctx.arc(bodyCanvas.width / 2, 100, 40, 0, Math.PI * 2);
        
        // Torso
        ctx.moveTo(bodyCanvas.width / 2, 140);
        ctx.lineTo(bodyCanvas.width / 2, 350);
        
        // Arms
        ctx.moveTo(bodyCanvas.width / 2, 180);
        ctx.lineTo(bodyCanvas.width / 2 - 80, 220);
        ctx.moveTo(bodyCanvas.width / 2, 180);
        ctx.lineTo(bodyCanvas.width / 2 + 80, 220);
        
        // Legs
        ctx.moveTo(bodyCanvas.width / 2, 350);
        ctx.lineTo(bodyCanvas.width / 2 - 50, 450);
        ctx.moveTo(bodyCanvas.width / 2, 350);
        ctx.lineTo(bodyCanvas.width / 2 + 50, 450);
        
        ctx.stroke();
        
        // Draw organ highlights
        const organs = [
            { x: bodyCanvas.width / 2, y: 140, radius: 25, color: '#ff0055', status: 'critical' }, // Heart
            { x: bodyCanvas.width / 2 - 30, y: 200, radius: 20, color: '#ff5500', status: 'severe' }, // Left lung
            { x: bodyCanvas.width / 2 + 30, y: 200, radius: 20, color: '#ff5500', status: 'severe' }, // Right lung
            { x: bodyCanvas.width / 2, y: 280, radius: 30, color: '#ffd300', status: 'moderate' }, // Liver
            { x: bodyCanvas.width / 2, y: 100, radius: 15, color: '#ff0055', status: 'critical' }, // Brain
            { x: bodyCanvas.width / 2, y: 320, radius: 20, color: '#00ff9d', status: 'stable' } // Cybernetics
        ];
        
        organs.forEach(organ => {
            // Pulsing effect
            const pulse = Math.sin(Date.now() / 500) * 0.2 + 1;
            
            ctx.beginPath();
            ctx.arc(organ.x, organ.y, organ.radius * pulse, 0, Math.PI * 2);
            
            // Gradient fill
            const gradient = ctx.createRadialGradient(
                organ.x, organ.y, 0,
                organ.x, organ.y, organ.radius * pulse
            );
            gradient.addColorStop(0, organ.color + 'FF');
            gradient.addColorStop(1, organ.color + '00');
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Glow effect
            ctx.shadowColor = organ.color;
            ctx.shadowBlur = 15;
            ctx.strokeStyle = organ.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;
        });
        
        // Draw nervous system overlay
        ctx.strokeStyle = '#9d00ff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        // Spinal column
        ctx.moveTo(bodyCanvas.width / 2, 120);
        ctx.lineTo(bodyCanvas.width / 2, 350);
        
        // Nerve branches
        for (let i = 140; i < 350; i += 30) {
            ctx.moveTo(bodyCanvas.width / 2, i);
            ctx.lineTo(bodyCanvas.width / 2 - 40 + Math.random() * 80, i + 20);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
    }
    
    // Continuous animation
    setInterval(drawBody, 50);
}

// Gene splice compatibility matrix
function initGeneMatrix() {
    const rows = 5;
    const cols = 5;
    
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        
        // Random status with weighted probabilities
        const rand = Math.random();
        let status;
        if (rand < 0.1) {
            status = 'compatible';
            cell.style.backgroundColor = '#00ff9d';
        } else if (rand < 0.4) {
            status = 'unstable';
            cell.style.backgroundColor = '#ffd300';
        } else {
            status = 'rejected';
            cell.style.backgroundColor = '#ff0055';
        }
        
        cell.dataset.status = status;
        
        // Pulsing animation for unstable cells
        if (status === 'unstable') {
            cell.style.animation = `pulse ${Math.random() * 2 + 1}s infinite`;
        }
        
        // Critical cells blink rapidly
        if (status === 'rejected' && Math.random() > 0.7) {
            cell.style.animation = `blink ${Math.random() * 0.5 + 0.3}s infinite`;
        }
        
        geneMatrix.appendChild(cell);
    }
    
    // Animate random cell mutations
    setInterval(() => {
        const cells = document.querySelectorAll('.matrix-cell');
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        
        // Trigger mutation visual
        randomCell.style.transform = 'scale(1.2)';
        randomCell.style.boxShadow = '0 0 15px currentColor';
        
        setTimeout(() => {
            randomCell.style.transform = 'scale(1)';
            randomCell.style.boxShadow = 'none';
        }, 300);
        
        // Occasionally change status
        if (Math.random() > 0.9) {
            const oldStatus = randomCell.dataset.status;
            let newStatus;
            
            if (oldStatus === 'compatible') {
                newStatus = Math.random() > 0.5 ? 'unstable' : 'rejected';
            } else if (oldStatus === 'unstable') {
                newStatus = Math.random() > 0.7 ? 'compatible' : 'rejected';
            } else {
                newStatus = Math.random() > 0.9 ? 'unstable' : 'rejected';
            }
            
            randomCell.dataset.status = newStatus;
            
            if (newStatus === 'compatible') {
                randomCell.style.backgroundColor = '#00ff9d';
            } else if (newStatus === 'unstable') {
                randomCell.style.backgroundColor = '#ffd300';
                randomCell.style.animation = `pulse ${Math.random() * 2 + 1}s infinite`;
            } else {
                randomCell.style.backgroundColor = '#ff0055';
                randomCell.style.animation = '';
            }
        }
    }, 2000);
}

// Nanomachine swarm visualizer
function initSwarmVisualizer() {
    function drawSwarm() {
        swarmVisualizer.innerHTML = '';
        
        const swarmCount = isNanomachineDeployed ? 50 : 20;
        
        for (let i = 0; i < swarmCount; i++) {
            const nanite = document.createElement('div');
            nanite.className = 'nanite';
            
            // Random positioning
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            nanite.style.left = `${x}%`;
            nanite.style.top = `${y}%`;
            nanite.style.width = `${Math.random() * 6 + 4}px`;
            nanite.style.height = nanite.style.width;
            
            // Color based on activity
            if (isNanomachineDeployed) {
                nanite.style.backgroundColor = Math.random() > 0.7 ? '#00ff9d' : '#00a3ff';
                nanite.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px currentColor`;
            } else {
                nanite.style.backgroundColor = '#ffd300';
                nanite.style.opacity = Math.random() * 0.5 + 0.3;
            }
            
            // Animation
            nanite.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
                { transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(${Math.random() * 0.5 + 0.8})`, opacity: 0.3 },
                { transform: 'translate(0, 0) scale(1)', opacity: 0.8 }
            ], {
                duration: Math.random() * 3000 + 2000,
                iterations: Infinity,
                direction: 'alternate'
            });
            
            swarmVisualizer.appendChild(nanite);
        }
    }
    
    drawSwarm();
    setInterval(drawSwarm, 5000);
}

// Neural web visualization
function initNeuralWeb() {
    const ctx = neuralWeb.getContext('2d');
    neuralWeb.width = neuralWeb.offsetWidth;
    neuralWeb.height = neuralWeb.offsetHeight;
    
    const neurons = [];
    const neuronCount = 15;
    
    // Create neurons
    for (let i = 0; i < neuronCount; i++) {
        neurons.push({
            x: Math.random() * neuralWeb.width,
            y: Math.random() * neuralWeb.height,
            radius: Math.random() * 8 + 4,
            connections: [],
            pulse: 0,
            status: Math.random() > 0.6 ? 'active' : 
                   Math.random() > 0.3 ? 'degraded' : 'failed'
        });
    }
    
    // Create connections
    neurons.forEach((neuron, i) => {
        neuron.connections = [];
        for (let j = i + 1; j < neurons.length; j++) {
            if (Math.random() > 0.7) {
                const distance = Math.sqrt(
                    Math.pow(neuron.x - neurons[j].x, 2) + 
                    Math.pow(neuron.y - neurons[j].y, 2)
                );
                if (distance < 150) {
                    neuron.connections.push(j);
                }
            }
        }
    });
    
    function drawNeuralWeb() {
        ctx.clearRect(0, 0, neuralWeb.width, neuralWeb.height);
        
        // Draw connections first
        neurons.forEach((neuron, i) => {
            neuron.connections.forEach(j => {
                const target = neurons[j];
                
                // Connection style based on status
                let color, width;
                if (neuron.status === 'failed' || target.status === 'failed') {
                    color = '#ff0055';
                    width = 1;
                    ctx.setLineDash([5, 3]);
                } else if (neuron.status === 'degraded' || target.status === 'degraded') {
                    color = '#ff5500';
                    width = 1.5;
                    ctx.setLineDash([3, 3]);
                } else {
                    color = '#9d00ff';
                    width = 2;
                    ctx.setLineDash([]);
                }
                
                // Pulsing connection
                const pulse = (Math.sin(Date.now() / 1000 + i) + 1) / 2;
                ctx.globalAlpha = 0.3 + pulse * 0.3;
                
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.stroke();
            });
        });
        
        ctx.setLineDash([]);
        
        // Draw neurons
        neurons.forEach((neuron, i) => {
            // Update pulse
            neuron.pulse = Math.sin(Date.now() / 500 + i) * 0.3 + 1;
            
            // Neuron color based on status
            let color;
            switch (neuron.status) {
                case 'active': color = '#9d00ff'; break;
                case 'degraded': color = '#ff5500'; break;
                case 'failed': color = '#ff0055'; break;
            }
            
            // Draw neuron glow
            const gradient = ctx.createRadialGradient(
                neuron.x, neuron.y, 0,
                neuron.x, neuron.y, neuron.radius * neuron.pulse * 2
            );
            gradient.addColorStop(0, color + 'FF');
            gradient.addColorStop(1, color + '00');
            
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, neuron.radius * neuron.pulse * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw neuron core
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            // Occasionally change neuron status
            if (Math.random() > 0.995) {
                if (neuron.status === 'active' && Math.random() > 0.7) {
                    neuron.status = 'degraded';
                } else if (neuron.status === 'degraded') {
                    neuron.status = Math.random() > 0.5 ? 'active' : 'failed';
                }
            }
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawNeuralWeb);
    }
    
    drawNeuralWeb();
}

// DNA strand visualization
function initDNAStrand() {
    function drawDNA() {
        dnaStrand.innerHTML = '';
        
        const segmentCount = 20;
        const segmentWidth = dnaStrand.offsetWidth / segmentCount;
        
        for (let i = 0; i < segmentCount; i++) {
            const segment = document.createElement('div');
            segment.className = 'dna-segment';
            
            // Position
            segment.style.left = `${i * segmentWidth}px`;
            segment.style.width = `${segmentWidth}px`;
            
            // Height variation for DNA helix
            const height = 30 + Math.sin(i + Date.now() / 1000) * 15;
            segment.style.height = `${height}px`;
            segment.style.top = `${20 - height / 2}px`;
            
            // Color based on mutation progression
            const mutationRatio = patientStatus.mutation / 100;
            const hue = 120 * (1 - mutationRatio); // Green to red
            segment.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            segment.style.opacity = 0.5 + Math.sin(i + Date.now() / 500) * 0.3;
            
            // Connect segments with lines
            if (i > 0) {
                const connector = document.createElement('div');
                connector.className = 'dna-connector';
                connector.style.left = `${(i - 0.5) * segmentWidth}px`;
                connector.style.width = `${segmentWidth}px`;
                connector.style.height = '2px';
                connector.style.top = '20px';
                connector.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                connector.style.opacity = '0.3';
                dnaStrand.appendChild(connector);
            }
            
            dnaStrand.appendChild(segment);
        }
    }
    
    drawDNA();
    setInterval(drawDNA, 100);
}

// Update patient status randomly (simulating real-time changes)
function updatePatientStatus() {
    // Simulate patient deterioration with occasional improvements
    const change = (Math.random() - 0.6) * 5; // Bias toward deterioration
  
    patientStatus.bpm = Math.max(60, Math.min(180, patientStatus.bpm + (Math.random() - 0.4) * 10));
    patientStatus.integrity = Math.max(10, Math.min(100, patientStatus.integrity + change));
    patientStatus.mutation = Math.max(0, Math.min(100, patientStatus.mutation + Math.random() * 2));
    patientStatus.toxin = Math.max(20, Math.min(95, patientStatus.toxin + (Math.random() - 0.3) * 3));
    
    // Update swarm stats if deployed
    if (isNanomachineDeployed) {
        patientStatus.activeNodes += Math.floor(Math.random() * 50 - 10);
        patientStatus.swarmEfficiency = Math.max(10, Math.min(90, patientStatus.swarmEfficiency + (Math.random() - 0.4) * 5));
        patientStatus.infectionRate = Math.max(0.5, Math.min(5, patientStatus.infectionRate + (Math.random() - 0.5) * 0.5));
    }
    
    // Random compatibility changes
    if (Math.random() > 0.8) {
        patientStatus.compatibility = Math.max(5, Math.min(40, patientStatus.compatibility + (Math.random() - 0.5) * 10));
    }
    
    // Random neural stat changes
    if (Math.random() > 0.7) {
        patientStatus.neuralIntegrity = Math.max(20, Math.min(80, patientStatus.neuralIntegrity + (Math.random() - 0.5) * 8));
        patientStatus.dataThroughput = Math.max(40, Math.min(85, patientStatus.dataThroughput + (Math.random() - 0.5) * 6));
        patientStatus.latency = Math.max(60, Math.min(95, patientStatus.latency + (Math.random() - 0.5) * 7));
    }
    
    updateAllDisplays();
    
    // Add log entry for significant changes
    if (Math.abs(change) > 3) {
        const changeType = change > 0 ? 'IMPROVEMENT' : 'DETERIORATION';
        const system = ['BIOLOGICAL INTEGRITY', 'TOXIN LEVELS', 'NEURAL INTEGRITY', 'CARDIAC FUNCTION'][Math.floor(Math.random() * 4)];
        addLogEntry(`${system}: ${changeType} DETECTED`);
    }
}

// Event Listeners
function setupEventListeners() {
    // Nanomachine deployment
    deployBtn.addEventListener('click', () => {
        if (!isNanomachineDeployed) {
            isNanomachineDeployed = true;
            deployBtn.innerHTML = '<i class="fas fa-pause"></i> HALT DEPLOYMENT';
            deployBtn.style.background = 'linear-gradient(45deg, #ff0055, #ff5500)';
            
            // Update swarm stats
            patientStatus.activeNodes = 2500;
            patientStatus.swarmEfficiency = 65;
            patientStatus.infectionRate = -1.2;
            
            updateAllDisplays();
            
            // Visual feedback
            swarmVisualizer.style.boxShadow = '0 0 30px rgba(0, 255, 157, 0.5)';
            
            addLogEntry('NANOMACHINE COUNTERMEASURES DEPLOYED');
            addLogEntry('INFECTION RATE DECREASING');
            
            // Play deployment sound
            scanAudio.currentTime = 0;
            scanAudio.play().catch(e => console.log('Audio play failed:', e));
            
            // Start nanomachine interval
            nanomachineInterval = setInterval(() => {
                patientStatus.toxin = Math.max(20, patientStatus.toxin - 0.5);
                patientStatus.mutation = Math.max(0, patientStatus.mutation - 0.3);
                updateAllDisplays();
            }, 1000);
        } else {
            isNanomachineDeployed = false;
            deployBtn.innerHTML = '<i class="fas fa-play"></i> DEPLOY COUNTERMEASURES';
            deployBtn.style.background = 'linear-gradient(45deg, #00ff9d, #00a3ff)';
            swarmVisualizer.style.boxShadow = 'none';
            
            clearInterval(nanomachineInterval);
            addLogEntry('NANOMACHINE DEPLOYMENT HALTED');
        }
    });
    
    // Deep scan
    scanBtn.addEventListener('click', () => {
        if (!scanActive) {
            scanActive = true;
            scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SCANNING...';
            
            // Visual feedback
            document.querySelector('.anatomical-display').style.boxShadow = '0 0 40px rgba(0, 163, 255, 0.7)';
            
            // Play scan sound
            scanAudio.currentTime = 0;
            scanAudio.play().catch(e => console.log('Audio play failed:', e));
            
            // Simulate scan results after delay
            setTimeout(() => {
                scanActive = false;
                scanBtn.innerHTML = '<i class="fas fa-search"></i> DEEP SCAN';
                document.querySelector('.anatomical-display').style.boxShadow = 'none';
                
                // Generate "scan results"
                const newToxin = Math.max(20, patientStatus.toxin - Math.random() * 15);
                const newMutation = Math.max(0, patientStatus.mutation - Math.random() * 10);
                
                addLogEntry(`DEEP SCAN COMPLETE: TOXIN LEVELS ${newToxin < patientStatus.toxin ? 'REDUCED' : 'STABLE'}`);
                addLogEntry(`MUTATION PROGRESSION: ${newMutation < patientStatus.mutation ? 'SLOWED' : 'UNCHANGED'}`);
                
                // Update with scan results
                patientStatus.toxin = newToxin;
                patientStatus.mutation = newMutation;
                updateAllDisplays();
            }, 3000);
        }
    });
    
    // Stabilize systems
    stabilizeBtn.addEventListener('click', () => {
        if (!stabilizationActive) {
            stabilizationActive = true;
            stabilizeBtn.innerHTML = '<i class="fas fa-heartbeat"></i> STABILIZING...';
            
            // Visual feedback
            document.body.style.animation = 'pulse 0.5s infinite';
            
            // Play stabilization sound
            warningAudio.currentTime = 0;
            warningAudio.play().catch(e => console.log('Audio play failed:', e));
            
            // Stabilization effect
            const stabilizationInterval = setInterval(() => {
                patientStatus.bpm = Math.max(80, Math.min(120, patientStatus.bpm + (Math.random() - 0.5) * 5));
                patientStatus.integrity = Math.min(100, patientStatus.integrity + 0.5);
                updateAllDisplays();
            }, 200);
            
            // Stop after 5 seconds
            setTimeout(() => {
                stabilizationActive = false;
                stabilizeBtn.innerHTML = '<i class="fas fa-heartbeat"></i> STABILIZE SYSTEMS';
                document.body.style.animation = '';
                clearInterval(stabilizationInterval);
                
                addLogEntry('SYSTEM STABILIZATION COMPLETE');
                addLogEntry('VITAL SIGNS TEMPORARILY STABILIZED');
            }, 5000);
        }
    });
    
    // Initiate purge (dangerous)
    purgeBtn.addEventListener('click', () => {
        if (confirm('WARNING: Initiating system purge will terminate all biological functions. Confirm purge?')) {
            purgeBtn.innerHTML = '<i class="fas fa-skull-crossbones"></i> PURGING...';
            purgeBtn.disabled = true;
            
            // Dramatic visual effects
            document.body.style.animation = 'blink 0.1s infinite';
            document.body.style.backgroundColor = '#ff0055';
            
            // Play warning sound
            warningAudio.loop = true;
            warningAudio.play().catch(e => console.log('Audio play failed:', e));
            
            // Purge sequence
            let purgeProgress = 0;
            const purgeInterval = setInterval(() => {
                purgeProgress += 5;
                
                // Update all stats to show purge
                patientStatus.integrity = Math.max(0, patientStatus.integrity - 5);
                patientStatus.bpm = Math.max(0, patientStatus.bpm - 10);
                patientStatus.toxin = Math.min(100, patientStatus.toxin + 3);
                updateAllDisplays();
                
                // Add purge log entries
                addLogEntry(`SYSTEM PURGE: ${purgeProgress}% COMPLETE`);
                
                if (purgeProgress >= 100) {
                    clearInterval(purgeInterval);
                    warningAudio.loop = false;
                    warningAudio.pause();
                    
                    // Final state
                    patientStatus.integrity = 0;
                    patientStatus.bpm = 0;
                    updateAllDisplays();
                    
                    addLogEntry('SYSTEM PURGE COMPLETE');
                    addLogEntry('PATIENT TERMINATED');
                    
                    // Reset button after delay
                    setTimeout(() => {
                        purgeBtn.innerHTML = '<i class="fas fa-skull-crossbones"></i> INITIATE PURGE';
                        purgeBtn.disabled = false;
                        document.body.style.animation = '';
                        document.body.style.backgroundColor = '';
                    }, 3000);
                }
            }, 500);
        }
    });
}

// Add entry to system log
function addLogEntry(message) {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `${timestamp} - ${message}`;
    
    systemLog.insertBefore(logEntry, systemLog.firstChild);
    
    // Limit log entries
    if (systemLog.children.length > 10) {
        systemLog.removeChild(systemLog.lastChild);
    }
    
    // Animate new entry
    logEntry.animate([
        { backgroundColor: 'rgba(0, 255, 157, 0.3)' },
        { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
    ], {
        duration: 1000
    });
}

// Trigger random warning
function triggerRandomWarning() {
    const warnings = [
        'CRITICAL SYSTEM FAILURE IMMINENT',
        'NEURAL CORE OVERHEATING',
        'CYBERNETIC REJECTION ACCELERATING',
        'TOXIN LEVELS REACHING LETHAL THRESHOLD',
        'HEART CYBERNETICS COMPLETE FAILURE',
        'NANO-PRION COLONIZATION EXPONENTIAL'
    ];
    
    const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
    addLogEntry(`WARNING: ${randomWarning}`);
    
    // Visual warning
    document.body.animate([
        { backgroundColor: '#0d1018' },
        { backgroundColor: '#ff0055' },
        { backgroundColor: '#0d1018' }
    ], {
        duration: 500,
        iterations: 2
    });
    
    // Play warning sound
    warningAudio.currentTime = 0;
    warningAudio.play().catch(e => console.log('Audio play failed:', e));
}

// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', initHUD);

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize canvas elements
    if (bodyCanvas) {
        bodyCanvas.width = bodyCanvas.offsetWidth;
        bodyCanvas.height = bodyCanvas.offsetHeight;
    }
    if (particleCanvas) {
        particleCanvas.width = particleCanvas.offsetWidth;
        particleCanvas.height = particleCanvas.offsetHeight;
    }
    if (neuralWeb) {
        neuralWeb.width = neuralWeb.offsetWidth;
        neuralWeb.height = neuralWeb.offsetHeight;
    }
});

// Add immersive keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':
            // Spacebar toggles nanomachine deployment
            deployBtn.click();
            break;
        case 's':
        case 'S':
            // S for scan
            scanBtn.click();
            break;
        case 'd':
        case 'D':
            // D for stabilize
            stabilizeBtn.click();
            break;
        case 'Escape':
            // Escape mutes audio
            heartbeatAudio.volume = heartbeatAudio.volume > 0 ? 0 : 0.3;
            break;
    }
});

// Add immersive mouse interactions
document.addEventListener('mousemove', (e) => {
    // Subtle parallax effect on grid lines
    const gridLines = document.querySelectorAll('.grid-line');
    const xRatio = e.clientX / window.innerWidth;
    const yRatio = e.clientY / window.innerHeight;
    
    gridLines.forEach((line, i) => {
        const speed = 0.5;
        if (line.classList.contains('horizontal')) {
            line.style.transform = `translateY(calc(-50% + ${(yRatio - 0.5) * 20}px))`;
        } else {
            line.style.transform = `translateX(calc(-50% + ${(xRatio - 0.5) * 20}px))`;
        }
    });
});

console.log('NEXUS-7 Biopunk Medical HUD JavaScript Loaded');
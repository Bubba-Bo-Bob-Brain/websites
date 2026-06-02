// scripts.js

// Patient data simulation
const patientData = {
    name: "SUBJECT-734",
    scanId: "BIOSCAN-7",
    heartRate: 72,
    neuralIntegrity: 87,
    organs: {
        heart: { health: 95, status: "normal" },
        liver: { health: 92, status: "normal" },
        kidneys: { health: 65, status: "degraded" },
        lungs: { health: 98, status: "normal" },
        brain: { health: 42, status: "critical" },
        spleen: { health: 88, status: "normal" }
    },
    toxins: {
        metalloids: 35,
        radioactives: 78,
        biologics: 12,
        nanitives: 92
    },
    nanomachines: {
        active: 1247,
        deploymentRate: 45
    },
    mutation: {
        stage: 3,
        progression: 65,
        effects: [
            { name: "CHROMOSOMAL INSTABILITY", level: 78 },
            { name: "TELEMERASE ACTIVITY", level: 45 }
        ]
    }
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    startRealTimeUpdates();
    initializeAnimations();
});

function initializeDashboard() {
    // Set initial values
    document.getElementById('patientName').textContent = patientData.name;
    document.getElementById('scanId').textContent = patientData.scanId;
    updateTime();
    updateHeartRate(patientData.heartRate);
    updateNeuralIntegrity(patientData.neuralIntegrity);
    updateOrganStatus();
    updateToxinLevels();
    updateNanomachineDeployment();
    updateMutationProgress();
    generateAnatomicalWireframe();
}

function startRealTimeUpdates() {
    // Update time every second
    setInterval(updateTime, 1000);
    
    // Simulate real-time data changes
    setInterval(() => {
        simulatePatientDataChanges();
    }, 3000);
}

function simulatePatientDataChanges() {
    // Simulate heart rate variation
    const heartVariation = Math.floor(Math.random() * 10) - 5;
    patientData.heartRate = Math.max(60, Math.min(100, patientData.heartRate + heartVariation));
    updateHeartRate(patientData.heartRate);
    
    // Simulate neural integrity fluctuation
    const neuralVariation = Math.floor(Math.random() * 4) - 2;
    patientData.neuralIntegrity = Math.max(70, Math.min(95, patientData.neuralIntegrity + neuralVariation));
    updateNeuralIntegrity(patientData.neuralIntegrity);
    
    // Simulate toxin level changes
    Object.keys(patientData.toxins).forEach(toxin => {
        const variation = Math.floor(Math.random() * 6) - 3;
        patientData.toxins[toxin] = Math.max(0, Math.min(100, patientData.toxins[toxin] + variation));
    });
    updateToxinLevels();
    
    // Simulate nanomachine deployment
    const deploymentChange = Math.floor(Math.random() * 10);
    patientData.nanomachines.active += deploymentChange;
    updateNanomachineDeployment();
    
    // Occasionally update mutation progression
    if (Math.random() < 0.3) {
        const progressionChange = Math.floor(Math.random() * 3);
        patientData.mutation.progression = Math.min(100, patientData.mutation.progression + progressionChange);
        updateMutationProgress();
    }
}

function updateHeartRate(bpm) {
    const bpmElement = document.querySelector('.bpm-value');
    bpmElement.textContent = bpm;
    
    // Change color based on heart rate
    bpmElement.style.color = bpm > 100 ? '#ff0044' : bpm < 60 ? '#ff6600' : '#ff0044';
    
    // Update waveform
    drawHeartWaveform(bpm);
}

function updateNeuralIntegrity(integrity) {
    const percentageElement = document.querySelector('.integrity-percentage');
    const fillElement = document.querySelector('.neural-fill');
    
    percentageElement.textContent = integrity + '%';
    fillElement.style.width = integrity + '%';
    
    // Change color based on integrity
    if (integrity < 80) {
        fillElement.style.background = 'linear-gradient(90deg, #ff0044, #ff6600)';
    } else if (integrity < 90) {
        fillElement.style.background = 'linear-gradient(90deg, #00aaff, #00ff88)';
    } else {
        fillElement.style.background = 'linear-gradient(90deg, #00ff88, #00aaff)';
    }
}

function updateOrganStatus() {
    Object.keys(patientData.organs).forEach(organ => {
        const card = document.querySelector(`.organ-card[data-organ="${organ}"]`);
        const data = patientData.organs[organ];
        
        // Update status text
        const statusElement = card.querySelector('.organ-status');
        statusElement.textContent = data.status.toUpperCase();
        statusElement.className = `organ-status status-${data.status}`;
        
        // Update fill width
        const fillElement = card.querySelector('.organ-fill');
        fillElement.style.width = data.health + '%';
    });
}

function updateToxinLevels() {
    const toxinItems = document.querySelectorAll('.toxin-item');
    const toxinNames = ['METALLOIDS', 'RADIOACTIVES', 'BIOLOGICALS', 'NANITIVES'];
    
    toxinItems.forEach((item, index) => {
        const fill = item.querySelector('.toxin-fill');
        const level = item.querySelector('.toxin-level');
        const value = patientData.toxins[toxinNames[index].toLowerCase()];
        
        fill.style.width = value + '%';
        
        // Set color based on level
        if (value > 70) {
            fill.style.background = `linear-gradient(90deg, #ff0044, #ff6600)`;
            level.textContent = 'CRITICAL';
            level.style.color = '#ff0044';
        } else if (value > 40) {
            fill.style.background = `linear-gradient(90deg, #ffaa00, #ff6600)`;
            level.textContent = 'HIGH';
            level.style.color = '#ff6600';
        } else if (value > 20) {
            fill.style.background = `linear-gradient(90deg, #ffaa00, #ffff00)`;
            level.textContent = 'MODERATE';
            level.style.color = '#ffff00';
        } else {
            fill.style.background = `linear-gradient(90deg, #00ff88, #00aaff)`;
            level.textContent = 'LOW';
            level.style.color = '#00ff88';
        }
    });
}

function updateNanomachineDeployment() {
    const countElement = document.querySelector('.deployment-count');
    countElement.textContent = `ACTIVE: ${patientData.nanomachines.active}`;
    
    // Animate the count change
    countElement.style.animation = 'none';
    setTimeout(() => {
        countElement.style.animation = 'blink 0.5s ease-in-out';
    }, 10);
}

function updateMutationProgress() {
    const progressFill = document.querySelector('.timeline-progress');
    const stageElement = document.querySelector('.mutation-stage');
    
    progressFill.style.width = patientData.mutation.progression + '%';
    stageElement.textContent = `STAGE ${patientData.mutation.stage}`;
    
    // Add mutation effect updates
    if (patientData.mutation.progression > 80) {
        document.querySelector('.mutation-panel').style.borderColor = '#ff0044';
    } else if (patientData.mutation.progression > 50) {
        document.querySelector('.mutation-panel').style.borderColor = '#ff6600';
    }
}

function updateTime() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    document.getElementById('currentTime').textContent = timeString;
}

function initializeAnimations() {
    // Add floating particles effect
    createFloatingParticles();
    
    // Add scan line animation to panels
    document.querySelectorAll('.vital-panel, .organ-card, .toxin-panel, .nanomachine-panel, .mutation-panel, .compatibility-matrix').forEach(panel => {
        panel.style.animation = `scan-line 4s linear infinite`;
    });
}

function createFloatingParticles() {
    const container = document.querySelector('.hud-container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.5 ? '#00ff88' : '#00aaff'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        container.appendChild(particle);
    }
    
    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: ${Math.random() * 0.5 + 0.2}; }
            90% { opacity: ${Math.random() * 0.5 + 0.2}; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function generateAnatomicalWireframe() {
    const overlay = document.getElementById('anatomicalOverlay');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 600');
    svg.style.opacity = '0.3';
    
    // Create anatomical wireframe paths
    const paths = [
        // Spine
        `M 400 50 L 400 200 L 420 250 L 400 300 L 380 250 L 400 200 L 400 400`,
        // Rib cage
        `M 350 250 Q 400 280 450 250 Q 430 300 400 320 Q 370 300 350 250`,
        // Heart
        `M 380 320 C 380 300 400 280 420 300 C 440 320 430 350 410 360 C 390 370 370 350 380 320`,
        // Lungs
        `M 250 200 Q 200 250 220 350 Q 280 380 320 350 Q 300 250 250 200`,
        `M 480 200 Q 530 250 510 350 Q 450 380 410 350 Q 430 250 480 200`,
        // Brain
        `M 300 80 Q 280 50 300 20 Q 320 50 300 80 M 300 80 Q 320 110 340 140 M 300 80 Q 280 110 260 140`,
        // Blood vessels
        `M 400 400 L 350 450 L 300 500`,
        `M 400 400 L 450 450 L 500 500`,
        `M 350 300 L 250 350`,
        `M 450 300 L 550 350`
    ];
    
    paths.forEach((d, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', Math.random() > 0.5 ? '#00ff88' : '#00aaff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('opacity', '0.6');
        path.style.animation = `pulse ${2 + Math.random() * 3}s ease-in-out ${index * 0.2}s infinite`;
        svg.appendChild(path);
    });
    
    // Add glowing nodes
    for (let i = 0; i < 15; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const r = Math.random() * 3 + 1;
        
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', Math.random() > 0.5 ? '#00ff88' : '#00aaff');
        circle.setAttribute('opacity', '0.8');
        circle.style.animation = `pulse ${1 + Math.random() * 2}s ease-in-out infinite`;
        svg.appendChild(circle);
    }
    
    overlay.appendChild(svg);
}

// Add dynamic mutation effect on click
document.addEventListener('click', function(e) {
    if (e.target.closest('.organ-card')) {
        const organ = e.target.closest('.organ-card').dataset.organ;
        triggerMutationEffect(organ);
    }
});

function triggerMutationEffect(organ) {
    // Create mutation particle effect
    const container = document.querySelector('.hud-container');
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: #ff0044;
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        animation: mutation-burst 0.5s ease-out forwards;
    `;
    
    // Add burst animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mutation-burst {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 500);
}

// Keyboard shortcuts for simulation
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
        // Reset simulation
        patientData.heartRate = 72;
        patientData.neuralIntegrity = 87;
        patientData.mutation.progression = 0;
        patientData.nanomachines.active = 100;
        Object.keys(patientData.toxins).forEach(toxin => {
            patientData.toxins[toxin] = 0;
        });
        initializeDashboard();
    }
});
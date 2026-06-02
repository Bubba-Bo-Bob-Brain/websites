// Biopunk Medical Scanning HUD - JavaScript Functionality

// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const nanomachineSwarm = document.getElementById('nanomachine-swarm');
const organCards = document.querySelectorAll('.organ-card');
const controlButtons = document.querySelectorAll('.control-btn');
const heartbeatElements = document.querySelectorAll('.heartbeat-visualization, .heart-highlight');
const organBars = document.querySelectorAll('.organ-bar .organ-fill');
const mutationBars = document.querySelectorAll('.mutation-tracker .level-fill');
const toxinBars = document.querySelectorAll('.toxin-bar .toxin-fill');
const neuralLinks = document.querySelectorAll('.neural-link');

// System state
let systemActive = true;
let nanomachinesDeployed = false;
let scanInProgress = false;

// Initialize the HUD
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    createNanomachines(50);
    animateNanomachines();
    
    setupOrganAnimations();
    setupControlButtons();
    
    // Simulate periodic system updates
    setInterval(updateSystemData, 5000);
});

// Update current time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Create nanomachine particles
function createNanomachines(count) {
    for (let i = 0; i < count; i++) {
        const nano = document.createElement('div');
        nano.className = 'nanomachine';
        nano.style.left = `${Math.random() * 100}%`;
        nano.style.top = `${Math.random() * 100}%`;
        nano.style.width = `${Math.random() * 3 + 2}px`;
        nano.style.height = nano.style.width;
        nano.style.opacity = Math.random() * 0.7 + 0.3;
        nano.dataset.vx = (Math.random() - 0.5) * 2;
        nano.dataset.vy = (Math.random() - 0.5) * 2;
        nanomachineSwarm.appendChild(nano);
    }
}

// Animate nanomachines
function animateNanomachines() {
    const nanomachines = document.querySelectorAll('.nanomachine');
    
    function moveNanos() {
        if (!systemActive) return;
        
        nanomachines.forEach(nano => {
            let x = parseFloat(nano.style.left);
            let y = parseFloat(nano.style.top);
            let vx = parseFloat(nano.dataset.vx);
            let vy = parseFloat(nano.dataset.vy);
            
            // Update position
            x += vx;
            y += vy;
            
            // Boundary checks with bounce
            if (x <= 0 || x >= 100) {
                vx *= -1;
                nano.dataset.vx = vx;
            }
            
            if (y <= 0 || y >= 100) {
                vy *= -1;
                nano.dataset.vy = vy;
            }
            
            // Apply new position
            nano.style.left = `${x}%`;
            nano.style.top = `${y}%`;
            
            // Random velocity changes for organic movement
            if (Math.random() > 0.95) {
                nano.dataset.vx = (Math.random() - 0.5) * 2;
                nano.dataset.vy = (Math.random() - 0.5) * 2;
            }
        });
        
        requestAnimationFrame(moveNanos);
    }
    
    moveNanos();
}

// Setup organ animations
function setupOrganAnimations() {
    organCards.forEach(card => {
        // Add random slight variations to breathing animation
        const delay = Math.random() * 2;
        card.style.animationDelay = `${delay}s`;
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'breathe 4s infinite ease-in-out';
            }, 10);
        });
    });
}

// Setup control buttons
function setupControlButtons() {
    document.getElementById('scan-btn').addEventListener('click', function() {
        if (scanInProgress) return;
        
        scanInProgress = true;
        this.textContent = 'SCANNING...';
        this.classList.add('active');
        
        // Simulate scan process
        setTimeout(() => {
            scanInProgress = false;
            this.textContent = 'INITIATE FULL SCAN';
            this.classList.remove('active');
            updateSystemData();
        }, 3000);
    });
    
    document.getElementById('deploy-btn').addEventListener('click', function() {
        if (nanomachinesDeployed) {
            nanomachinesDeployed = false;
            this.textContent = 'DEPLOY NANOMACHINES';
            this.classList.remove('active');
        } else {
            nanomachinesDeployed = true;
            this.textContent = 'NANOMACHINES ACTIVE';
            this.classList.add('active');
            
            // Visual feedback for deployment
            document.body.classList.add('nanomachines-active');
            setTimeout(() => {
                document.body.classList.remove('nanomachines-active');
            }, 2000);
        }
    });
    
    document.getElementById('stabilize-btn').addEventListener('click', function() {
        this.textContent = 'STABILIZING...';
        this.classList.add('active');
        
        // Simulate stabilization
        setTimeout(() => {
            this.textContent = 'STABILIZE SYSTEMS';
            this.classList.remove('active');
            
            // Improve some critical values
            improveCriticalSystems();
        }, 2500);
    });
}

// Update system data periodically
function updateSystemData() {
    // Update organ statuses
    organCards.forEach(card => {
        const statusElement = card.querySelector('.organ-status');
        const valueElement = card.querySelector('.organ-value');
        const barElement = card.querySelector('.organ-fill');
        
        // Get current values
        let currentValue = parseFloat(barElement.style.width);
        let newValue = currentValue + (Math.random() * 10 - 5); // -5 to +5 fluctuation
        
        // Keep within bounds
        newValue = Math.max(10, Math.min(100, newValue));
        
        // Update bar
        barElement.style.width = `${newValue}%`;
        
        // Update status based on value
        if (newValue > 80) {
            statusElement.textContent = 'FUNCTIONAL';
            statusElement.className = 'organ-status';
        } else if (newValue > 50) {
            statusElement.textContent = 'COMPROMISED';
            statusElement.className = 'organ-status degraded';
        } else {
            statusElement.textContent = 'CRITICAL';
            statusElement.className = 'organ-status critical';
        }
        
        // Update value display for specific organs
        const organType = card.dataset.organ;
        if (organType === 'heart') {
            const bpm = Math.round(newValue * 0.8 + 40);
            valueElement.textContent = `${bpm} BPM`;
        } else if (organType === 'lungs') {
            const rate = Math.round(newValue * 0.2 + 8);
            valueElement.textContent = `${rate}/min`;
        } else {
            valueElement.textContent = `${Math.round(newValue)}%`;
        }
    });
    
    // Update mutation levels
    mutationBars.forEach((bar, index) => {
        let currentValue = parseFloat(bar.style.width);
        let change = (Math.random() * 6 - 3); // -3 to +3 fluctuation
        
        // Different behavior for different mutations
        switch(index) {
            case 0: // Cybernetic integration
                change = Math.random() * 2; // Generally improving
                break;
            case 1: // Genetic stability
                change = Math.random() * -4; // Generally degrading
                break;
            case 2: // Bio-electric field
                change = (Math.random() - 0.5) * 4; // Fluctuating
                break;
        }
        
        let newValue = currentValue + change;
        newValue = Math.max(5, Math.min(100, newValue));
        bar.style.width = `${newValue}%`;
    });
    
    // Update toxin levels
    toxinBars.forEach((bar, index) => {
        let currentValue = parseFloat(bar.style.width);
        let change = (Math.random() * 4 - 2); // -2 to +2 fluctuation
        
        // Different behavior for different toxins
        switch(index) {
            case 0: // Neurotoxin-A
                change = Math.random() * 3; // Accumulating
                break;
            case 1: // Cybertox-B
                change = Math.random() * -1; // Clearing slowly
                break;
            case 2: // Metal particulates
                change = Math.random() * 2; // Accumulating
                break;
        }
        
        let newValue = currentValue + change;
        newValue = Math.max(0, Math.min(100, newValue));
        bar.style.width = `${newValue}%`;
    });
    
    // Update neural links
    neuralLinks.forEach(link => {
        const strengthElement = link.querySelector('.link-strength');
        const statusElement = link.querySelector('.link-status');
        
        let currentValue = parseInt(strengthElement.textContent);
        let newValue = currentValue + Math.floor(Math.random() * 11 - 5); // -5 to +5 fluctuation
        newValue = Math.max(5, Math.min(100, newValue));
        
        strengthElement.textContent = `${newValue}%`;
        
        // Update status based on value
        if (newValue > 80) {
            statusElement.textContent = 'STABLE';
            statusElement.className = 'link-status stable';
        } else if (newValue > 40) {
            statusElement.textContent = 'DEGRADED';
            statusElement.className = 'link-status degraded';
        } else {
            statusElement.textContent = 'CRITICAL';
            statusElement.className = 'link-status critical';
        }
    });
    
    // Add random alerts
    if (Math.random() > 0.7) {
        addRandomAlert();
    }
}

// Improve critical systems (for stabilization)
function improveCriticalSystems() {
    // Find critical organs and improve them
    organCards.forEach(card => {
        const statusElement = card.querySelector('.organ-status');
        const barElement = card.querySelector('.organ-fill');
        
        if (statusElement.classList.contains('critical')) {
            let currentValue = parseFloat(barElement.style.width);
            let newValue = Math.min(100, currentValue + 20 + Math.random() * 15);
            barElement.style.width = `${newValue}%`;
            
            // Update status
            if (newValue > 80) {
                statusElement.textContent = 'FUNCTIONAL';
                statusElement.className = 'organ-status';
            } else if (newValue > 50) {
                statusElement.textContent = 'COMPROMISED';
                statusElement.className = 'organ-status degraded';
            }
        }
    });
    
    // Improve critical neural links
    neuralLinks.forEach(link => {
        const strengthElement = link.querySelector('.link-strength');
        const statusElement = link.querySelector('.link-status');
        
        if (statusElement.classList.contains('critical')) {
            let currentValue = parseInt(strengthElement.textContent);
            let newValue = Math.min(100, currentValue + 25 + Math.random() * 20);
            strengthElement.textContent = `${newValue}%`;
            
            // Update status
            if (newValue > 80) {
                statusElement.textContent = 'STABLE';
                statusElement.className = 'link-status stable';
            } else if (newValue > 40) {
                statusElement.textContent = 'DEGRADED';
                statusElement.className = 'link-status degraded';
            }
        }
    });
}

// Add random alert messages
function addRandomAlert() {
    const alertPanel = document.querySelector('.alert-panel');
    const alerts = [
        "LIVER ENZYME SPIKE DETECTED",
        "NEURAL FEEDBACK LOOP ANOMALY",
        "CYBERNETIC INTERFACE OVERLOAD",
        "BLOOD TOXICITY INCREASING",
        "ORGAN REJECTION POSSIBLE",
        "NANOMACHINE CLUSTER FORMING",
        "BIO-ELECTRIC FIELD FLUCTUATING"
    ];
    
    const alertTypes = ['warning', 'critical'];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const alertText = alerts[Math.floor(Math.random() * alerts.length)];
    
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item';
    
    const alertIcon = document.createElement('span');
    alertIcon.className = `alert-icon ${alertType}`;
    alertIcon.textContent = alertType === 'warning' ? '!' : '!!';
    
    const alertMessage = document.createElement('span');
    alertMessage.className = 'alert-text';
    alertMessage.textContent = alertText;
    
    alertItem.appendChild(alertIcon);
    alertItem.appendChild(alertMessage);
    
    // Add to panel
    alertPanel.prepend(alertItem);
    
    // Remove after some time
    setTimeout(() => {
        if (alertItem.parentNode) {
            alertItem.parentNode.removeChild(alertItem);
        }
    }, 8000);
}

// Add visual feedback for nanomachine deployment
document.body.addEventListener('nanomachines-deployed', function() {
    document.body.classList.add('nanomachines-active');
    setTimeout(() => {
        document.body.classList.remove('nanomachines-active');
    }, 2000);
});

// Heartbeat synchronization
function syncHeartbeat() {
    // This would typically be tied to actual biometric data
    // For simulation, we'll just trigger the visual effect
    document.querySelectorAll('.pulse-circle, .heart-highlight').forEach(el => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = '';
        }, 10);
    });
}

// Simulate heartbeat every few seconds
setInterval(syncHeartbeat, 1200);
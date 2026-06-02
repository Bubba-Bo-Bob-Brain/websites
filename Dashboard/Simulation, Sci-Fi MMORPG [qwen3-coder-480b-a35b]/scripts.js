// NEXUS PRIME - Galactic Command Dashboard
// Sci-Fi MMORPG Overview Interface Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initializeClock();
    initializeGalaxyMap();
    initializeFleetList();
    initializeResourceChart();
    initializeAnimations();
    
    // Set up periodic updates
    setInterval(updateDashboard, 30000); // Update every 30 seconds
});

// Clock functionality
function initializeClock() {
    const clockElement = document.getElementById('current-time');
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toUTCString().split(' ')[4];
        clockElement.textContent = `${timeString} GMT`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Galaxy Map Visualization
function initializeGalaxyMap() {
    const galaxyMap = document.getElementById('galaxyMap');
    const sectors = 200; // Number of star systems to generate
    
    // Clear existing content
    galaxyMap.innerHTML = '';
    
    // Generate star systems
    for (let i = 0; i < sectors; i++) {
        const star = document.createElement('div');
        star.className = 'star-system';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size and color
        const size = Math.random() * 3 + 1;
        const colors = ['#ffffff', '#00f0ff', '#bd00ff', '#ff2b5c', '#ffd100'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random status (for visual variety)
        const statuses = ['', 'active', 'threat', 'resource'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.background = color;
        star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        if (status === 'active') {
            star.classList.add('active-sector');
        } else if (status === 'threat') {
            star.classList.add('threat-sector');
        } else if (status === 'resource') {
            star.classList.add('resource-sector');
        }
        
        // Add click event for sector details
        star.addEventListener('click', function() {
            showSectorDetails(x, y);
        });
        
        galaxyMap.appendChild(star);
    }
}

// Show sector details on map click
function showSectorDetails(x, y) {
    // In a real implementation, this would show detailed sector info
    console.log(`Sector details for coordinates: ${x.toFixed(2)}%, ${y.toFixed(2)}%`);
}

// Fleet List Initialization
function initializeFleetList() {
    const fleetList = document.getElementById('fleetList');
    const fleets = [
        { id: 'TF-1', name: 'Alpha Strike Force', location: 'Sector β-7', status: 'combat' },
        { id: 'TF-3', name: 'Gamma Recon Unit', location: 'Sector γ-3', status: 'patrol' },
        { id: 'TF-7', name: 'Delta Defense Fleet', location: 'Sector α-9', status: 'active' },
        { id: 'TF-12', name: 'Omega Supply Convoy', location: 'Transit to δ-12', status: 'patrol' },
        { id: 'TF-15', name: 'Theta Mining Support', location: 'Sector ε-5', status: 'active' },
        { id: 'TF-18', name: 'Lambda Research Escort', location: 'Research Station Ω', status: 'patrol' }
    ];
    
    fleetList.innerHTML = '';
    
    fleets.forEach(fleet => {
        const fleetItem = document.createElement('div');
        fleetItem.className = 'fleet-item';
        
        fleetItem.innerHTML = `
            <div class="fleet-icon">🚀</div>
            <div class="fleet-details">
                <div class="fleet-name">${fleet.name}</div>
                <div class="fleet-location">${fleet.location}</div>
            </div>
            <div class="fleet-status-indicator ${fleet.status}">${getStatusText(fleet.status)}</div>
        `;
        
        fleetList.appendChild(fleetItem);
    });
}

function getStatusText(status) {
    switch(status) {
        case 'combat': return 'COMBAT';
        case 'patrol': return 'PATROL';
        case 'active': return 'ACTIVE';
        default: return 'STANDBY';
    }
}

// Resource Chart using Canvas
function initializeResourceChart() {
    const canvas = document.getElementById('resourceChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw chart background
    ctx.fillStyle = 'rgba(20, 30, 50, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(74, 90, 122, 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = (canvas.width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw resource data (simulated)
    const resources = [
        { name: 'Quantum Crystals', values: [65, 70, 68, 75, 80, 85, 82, 88, 90, 87], color: '#ff2b5c' },
        { name: 'Neutronium', values: [50, 55, 52, 60, 65, 62, 68, 70, 67, 71], color: '#00f0ff' },
        { name: 'Xenon Gas', values: [40, 38, 42, 45, 43, 38, 35, 37, 39, 38], color: '#bd00ff' }
    ];
    
    const pointWidth = canvas.width / 9; // 10 points = 9 segments
    
    resources.forEach(resource => {
        ctx.beginPath();
        ctx.strokeStyle = resource.color;
        ctx.lineWidth = 2;
        
        for (let i = 0; i < resource.values.length; i++) {
            const x = i * pointWidth;
            // Invert Y axis (0 is top)
            const y = canvas.height - (resource.values[i] / 100 * canvas.height);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw points
        for (let i = 0; i < resource.values.length; i++) {
            const x = i * pointWidth;
            const y = canvas.height - (resource.values[i] / 100 * canvas.height);
            
            ctx.beginPath();
            ctx.fillStyle = resource.color;
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Animation initialization
function initializeAnimations() {
    // Animate tech progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
            bar.style.width = width;
        }, 300);
    });
    
    // Animate resource bars
    const resourceBars = document.querySelectorAll('.resource-fill');
    resourceBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-out';
            bar.style.width = width;
        }, 500);
    });
    
    // Add hover effects to panels
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
        });
        
        panel.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
        });
    });
}

// Periodic dashboard updates
function updateDashboard() {
    // Update fleet casualties count with animation
    const casualtyElement = document.querySelector('.casualty-count');
    const currentValue = parseInt(casualtyElement.textContent);
    const newValue = currentValue + Math.floor(Math.random() * 3);
    casualtyElement.textContent = newValue;
    
    // Add animation effect
    casualtyElement.style.color = '#ff2b5c';
    casualtyElement.style.textShadow = '0 0 10px #ff2b5c';
    setTimeout(() => {
        casualtyElement.style.color = '';
        casualtyElement.style.textShadow = '';
    }, 1000);
    
    // Update resource chart with new data
    initializeResourceChart();
    
    // Occasionally update galaxy map
    if (Math.random() > 0.7) {
        initializeGalaxyMap();
    }
    
    // Update alerts
    updateAlerts();
}

// Alert system updates
function updateAlerts() {
    const alertsFooter = document.querySelector('.alerts-footer');
    const alerts = [
        "⚠️ SECTOR γ-3 UNDER ATTACK - REINFORCEMENTS REQUESTED",
        "🔧 MAINTENANCE REQUIRED ON MINING DRONE FLEET 4",
        "📡 COMMUNICATION INTERFERENCE DETECTED IN SECTOR α-9",
        "⚡ POWER SURGE REPORTED AT RESEARCH STATION Ω",
        "🛡️ DEFENSE GRID ONLINE - ALL SYSTEMS NOMINAL"
    ];
    
    // Get current alerts
    const currentAlerts = Array.from(alertsFooter.querySelectorAll('.alert-item'));
    
    // Remove first alert if we have 2 already
    if (currentAlerts.length >= 2) {
        alertsFooter.removeChild(currentAlerts[0]);
    }
    
    // Add new random alert occasionally
    if (Math.random() > 0.5) {
        const newAlert = document.createElement('div');
        newAlert.className = 'alert-item';
        newAlert.innerHTML = `
            <span class="alert-icon">⚠️</span>
            <span class="alert-message">${alerts[Math.floor(Math.random() * alerts.length)]}</span>
        `;
        
        alertsFooter.appendChild(newAlert);
        
        // Auto remove after some time
        setTimeout(() => {
            if (newAlert.parentNode) {
                alertsFooter.removeChild(newAlert);
            }
        }, 15000);
    }
}

// Handle window resize for responsive elements
window.addEventListener('resize', function() {
    initializeResourceChart();
});
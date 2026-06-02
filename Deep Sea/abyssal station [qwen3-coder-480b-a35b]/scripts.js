// scripts.js

// DOM Elements
const depthValue = document.getElementById('depth-value');
const pressureFill = document.getElementById('pressure-fill');
const pressureNeedle = document.getElementById('pressure-needle');
const pressureValue = document.getElementById('pressure-value');
const integrityFill = document.getElementById('integrity-fill');
const integrityValue = document.getElementById('integrity-value');
const crack = document.getElementById('crack');
const depthMarker = document.getElementById('depth-marker');
const warningBar = document.getElementById('warning-bar');
const sonarPing = document.getElementById('sonar-ping');
const radarScan = document.getElementById('radar-scan');
const bioCanvas = document.getElementById('bio-canvas');
const particlesContainer = document.getElementById('particles-container');

// Initial values
let currentDepth = 7842;
let pressure = 784.2;
let integrity = 98.7;
let warningActive = false;

// Set up canvas for bioluminescent tracking
const ctx = bioCanvas.getContext('2d');
bioCanvas.width = bioCanvas.offsetWidth;
bioCanvas.height = bioCanvas.offsetHeight;

// Bioluminescent organisms data
const organisms = [];
const speciesColors = ['#00ffea', '#ff00c8', '#a6ff00'];

// Initialize organisms
function initOrganisms() {
    for (let i = 0; i < 50; i++) {
        organisms.push({
            x: Math.random() * bioCanvas.width,
            y: Math.random() * bioCanvas.height,
            size: Math.random() * 5 + 2,
            speed: Math.random() * 0.5 + 0.1,
            species: Math.floor(Math.random() * 3),
            angle: Math.random() * Math.PI * 2,
            wobble: Math.random() * 0.1,
            wobbleSpeed: Math.random() * 0.02
        });
    }
}

// Draw bioluminescent organisms
function drawOrganisms() {
    ctx.clearRect(0, 0, bioCanvas.width, bioCanvas.height);
    
    organisms.forEach(org => {
        // Update position with wobble
        org.angle += org.wobbleSpeed;
        const wobbleOffset = Math.sin(org.angle) * 2;
        
        org.x += Math.cos(org.angle) * org.speed + wobbleOffset;
        org.y += Math.sin(org.angle) * org.speed;
        
        // Wrap around edges
        if (org.x > bioCanvas.width) org.x = 0;
        if (org.x < 0) org.x = bioCanvas.width;
        if (org.y > bioCanvas.height) org.y = 0;
        if (org.y < 0) org.y = bioCanvas.height;
        
        // Draw organism
        ctx.beginPath();
        ctx.arc(org.x, org.y, org.size, 0, Math.PI * 2);
        ctx.fillStyle = speciesColors[org.species];
        ctx.shadowColor = speciesColors[org.species];
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    requestAnimationFrame(drawOrganisms);
}

// Create background particles
function createParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const colorIndex = Math.floor(Math.random() * 3);
            const colors = [getComputedStyle(document.documentElement).getPropertyValue('--bioluminescent-1'),
                           getComputedStyle(document.documentElement).getPropertyValue('--bioluminescent-2'),
                           getComputedStyle(document.documentElement).getPropertyValue('--bioluminescent-3')];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.color = colors[colorIndex];
            particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation completes
            setTimeout(() => {
                particle.remove();
            }, parseFloat(particle.style.animationDuration) * 1000);
        }, i * 300);
    }
}

// Update depth and related systems
function updateDepth() {
    // Simulate depth changes
    const depthChange = (Math.random() - 0.5) * 10;
    currentDepth = Math.max(0, currentDepth + depthChange);
    
    // Update display
    depthValue.textContent = Math.round(currentDepth).toLocaleString() + 'm';
    
    // Update depth marker position (0m at top, 10000m at bottom)
    const positionPercent = Math.min(100, (currentDepth / 10000) * 100);
    depthMarker.style.top = `calc(${positionPercent}% - 2px)`;
    
    // Update pressure based on depth
    pressure = currentDepth * 0.1;
    updatePressureDisplay();
    
    // Update hull integrity based on depth
    integrity = Math.max(80, 100 - (currentDepth / 10000) * 20 - (Math.random() * 5));
    updateIntegrityDisplay();
    
    // Check for warnings
    checkWarnings();
}

// Update pressure display
function updatePressureDisplay() {
    // Calculate fill percentage (0-1000 atm is our range)
    const fillPercent = Math.min(100, (pressure / 1000) * 100);
    
    // Update gauge fill
    pressureFill.style.background = `conic-gradient(
        var(--accent-green) 0deg,
        var(--accent-green) ${fillPercent * 3.6}deg,
        transparent ${fillPercent * 3.6}deg,
        transparent 360deg
    )`;
    
    // Update needle position (0-270 degrees)
    const needleRotation = (fillPercent / 100) * 270;
    pressureNeedle.style.transform = `rotate(${needleRotation}deg)`;
    
    // Update value display
    pressureValue.textContent = pressure.toFixed(1) + ' ATM';
}

// Update hull integrity display
function updateIntegrityDisplay() {
    // Update meter fill
    integrityFill.style.width = `${integrity}%`;
    
    // Update value display
    integrityValue.textContent = integrity.toFixed(1) + '%';
    
    // Update crack based on integrity
    const crackSize = Math.max(0, (100 - integrity) * 2);
    crack.style.width = `${crackSize}px`;
    crack.style.opacity = `${(100 - integrity) / 50}`;
    
    // Rotate crack randomly
    const rotation = Math.random() * 360;
    crack.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}

// Check for system warnings
function checkWarnings() {
    // Show warning if pressure exceeds 800 ATM or integrity drops below 90%
    if (pressure > 800 || integrity < 90) {
        if (!warningActive) {
            warningBar.classList.remove('hidden');
            warningActive = true;
            
            // Flash warning periodically
            setInterval(() => {
                warningBar.style.visibility = warningBar.style.visibility === 'hidden' ? 'visible' : 'hidden';
            }, 500);
        }
    } else {
        if (warningActive) {
            warningBar.classList.add('hidden');
            warningActive = false;
        }
    }
    
    // Change status colors based on values
    const pressureStatus = document.querySelector('.pressure-status .status-value');
    const integrityStatus = document.querySelector('.integrity-value');
    
    if (pressure > 800) {
        pressureStatus.className = 'status-value critical';
        pressureStatus.textContent = 'CRITICAL';
    } else if (pressure > 600) {
        pressureStatus.className = 'status-value warning';
        pressureStatus.textContent = 'WARNING';
    } else {
        pressureStatus.className = 'status-value ok';
        pressureStatus.textContent = 'STABLE';
    }
    
    if (integrity < 90) {
        integrityStatus.style.color = 'var(--accent-red)';
        integrityStatus.style.textShadow = '0 0 10px rgba(255, 56, 96, 0.5)';
    } else if (integrity < 95) {
        integrityStatus.style.color = 'var(--warning-orange)';
        integrityStatus.style.textShadow = '0 0 10px rgba(255, 153, 0, 0.5)';
    } else {
        integrityStatus.style.color = 'var(--accent-green)';
        integrityStatus.style.textShadow = '0 0 10px rgba(0, 255, 157, 0.5)';
    }
}

// Simulate sonar ping
function simulateSonarPing() {
    // Add ping effect
    sonarPing.classList.remove('ping');
    void sonarPing.offsetWidth; // Trigger reflow
    sonarPing.classList.add('ping');
    
    // Add random objects to sonar
    const objects = document.querySelectorAll('.object');
    objects.forEach(obj => {
        obj.style.opacity = Math.random() > 0.3 ? '1' : '0';
    });
}

// Initialize and run dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    initOrganisms();
    drawOrganisms();
    
    // Start background particle system
    createParticles();
    setInterval(createParticles, 5000);
    
    // Start depth updates
    setInterval(updateDepth, 2000);
    
    // Start sonar pings
    setInterval(simulateSonarPing, 3000);
    
    // Handle window resize for canvas
    window.addEventListener('resize', () => {
        bioCanvas.width = bioCanvas.offsetWidth;
        bioCanvas.height = bioCanvas.offsetHeight;
    });
    
    // Initial update
    updateDepth();
});
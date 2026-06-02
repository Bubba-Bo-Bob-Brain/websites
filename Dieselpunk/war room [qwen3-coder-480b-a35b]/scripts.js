// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initUnitMarkers();
    initRadioControls();
    initProductionGauges();
    initPropagandaPosters();
    initTableControls();
    initClock();
    
    // Start periodic updates
    setInterval(updateClock, 1000);
    setInterval(rotatePropagandaPosters, 8000);
    setInterval(addRandomTransmission, 5000);
});

// Clock functionality
function initClock() {
    updateClock();
}

function updateClock() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    // Format date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
    
    // Format time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes} HOURS`;
}

// Unit Marker Functionality
function initUnitMarkers() {
    const markers = document.querySelectorAll('.unit-marker');
    let draggedMarker = null;
    let offsetX, offsetY;
    
    markers.forEach(marker => {
        marker.addEventListener('mousedown', startDrag);
    });
    
    function startDrag(e) {
        draggedMarker = this;
        const rect = draggedMarker.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        document.addEventListener('mousemove', dragMarker);
        document.addEventListener('mouseup', stopDrag);
        
        // Bring marker to front
        markers.forEach(m => m.style.zIndex = '2');
        draggedMarker.style.zIndex = '10';
    }
    
    function dragMarker(e) {
        if (!draggedMarker) return;
        
        const mapContainer = document.querySelector('.map-container');
        const mapRect = mapContainer.getBoundingClientRect();
        
        let x = e.clientX - mapRect.left - offsetX;
        let y = e.clientY - mapRect.top - offsetY;
        
        // Constrain to map boundaries
        x = Math.max(0, Math.min(x, mapRect.width - draggedMarker.offsetWidth));
        y = Math.max(0, Math.min(y, mapRect.height - draggedMarker.offsetHeight));
        
        draggedMarker.style.left = `${x}px`;
        draggedMarker.style.top = `${y}px`;
    }
    
    function stopDrag() {
        draggedMarker = null;
        document.removeEventListener('mousemove', dragMarker);
        document.removeEventListener('mouseup', stopDrag);
    }
}

// Radio Controls Functionality
function initRadioControls() {
    const scanButton = document.getElementById('scan-button');
    const radioCrackle = document.getElementById('radio-crackle');
    const freqNeedle = document.getElementById('freq-needle');
    const volNeedle = document.getElementById('vol-needle');
    
    // Set initial needle positions
    setNeedlePosition(freqNeedle, 45);
    setNeedlePosition(volNeedle, 65);
    
    scanButton.addEventListener('click', function() {
        // Show crackle effect
        radioCrackle.style.animation = 'none';
        setTimeout(() => {
            radioCrackle.style.animation = 'crackle 0.5s infinite';
        }, 10);
        
        // Simulate scanning
        this.textContent = 'SCANNING...';
        this.disabled = true;
        
        // Randomize frequencies
        setTimeout(() => {
            const newFreq = (Math.random() * 10 + 2).toFixed(2);
            document.getElementById('freq-value').textContent = `${newFreq} MHz`;
            setNeedlePosition(freqNeedle, Math.random() * 90);
            
            const newVol = Math.floor(Math.random() * 100);
            document.getElementById('vol-value').textContent = `${newVol}%`;
            setNeedlePosition(volNeedle, newVol * 0.9);
            
            // Reset button
            this.textContent = 'SCAN';
            this.disabled = false;
            radioCrackle.style.animation = 'crackle 0.5s infinite';
        }, 2000);
    });
}

function setNeedlePosition(needle, angle) {
    needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

// Production Gauges Animation
function initProductionGauges() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const radialGauges = document.querySelectorAll('.radial-gauge');
    
    // Animate progress bars
    progressBars.forEach(bar => {
        const target = parseInt(bar.dataset.target);
        const fill = bar.querySelector('.progress-fill');
        setTimeout(() => {
            fill.style.width = `${target}%`;
        }, 500);
    });
    
    // Animate radial gauges
    radialGauges.forEach((gauge, index) => {
        const pointer = gauge.querySelector('.gauge-pointer');
        const angle = 45 + (index * 90); // Different angles for each gauge
        setTimeout(() => {
            pointer.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
        }, 1000);
    });
}

// Propaganda Poster Rotation
let currentPosterIndex = 0;
const posters = document.querySelectorAll('.propaganda-poster');

function initPropagandaPosters() {
    // Show first poster immediately
    if (posters.length > 0) {
        posters[0].classList.add('active');
    }
}

function rotatePropagandaPosters() {
    // Remove active class from current poster
    posters[currentPosterIndex].classList.remove('active');
    
    // Move to next poster
    currentPosterIndex = (currentPosterIndex + 1) % posters.length;
    
    // Add active class to new poster
    posters[currentPosterIndex].classList.add('active');
}

// Table Controls Functionality
function initTableControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetBtn = document.getElementById('reset-view');
    const mapContainer = document.querySelector('.map-container');
    
    let scale = 1;
    const scaleStep = 0.2;
    
    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + scaleStep, 2);
        updateMapScale();
    });
    
    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - scaleStep, 0.5);
        updateMapScale();
    });
    
    resetBtn.addEventListener('click', () => {
        scale = 1;
        mapContainer.style.transform = '';
        mapContainer.style.transformOrigin = 'center center';
    });
    
    function updateMapScale() {
        mapContainer.style.transform = `scale(${scale})`;
        mapContainer.style.transformOrigin = 'center center';
    }
}

// Radio Transmission Log
function addRandomTransmission() {
    const logContent = document.getElementById('radio-log');
    const messages = [
        "Enemy aircraft spotted heading northeast",
        "Supply drop scheduled for 16:00 hours",
        "Weather conditions deteriorating in sector 5",
        "Allied forces advancing on eastern flank",
        "Communication disruption reported sector 12-A",
        "Reinforcements arriving via transport rail",
        "Artillery bombardment commencing in 5 minutes",
        "Intelligence suggests enemy retreat imminent"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const newEntry = document.createElement('div');
    newEntry.className = 'log-entry';
    newEntry.innerHTML = `
        <span class="timestamp">${hours}:${minutes}</span>
        <span class="message">${randomMessage}</span>
    `;
    
    logContent.prepend(newEntry);
    
    // Limit to 10 entries
    if (logContent.children.length > 10) {
        logContent.removeChild(logContent.lastChild);
    }
}

// Add subtle hover effects for unit markers
document.querySelectorAll('.unit-marker').forEach(marker => {
    marker.addEventListener('mouseenter', function() {
        this.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))';
    });
    
    marker.addEventListener('mouseleave', function() {
        this.style.filter = 'none';
    });
});
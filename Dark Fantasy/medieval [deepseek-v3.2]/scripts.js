// ============================================
// UMBRAL ARCHIVES - DARK FANTASY JAVASCRIPT
// Bringing the Grimoire to Life
// ============================================

// DOM Elements
const candle = document.getElementById('candle');
const lightOverlay = document.getElementById('lightOverlay');
const audioToggle = document.getElementById('audioToggle');
const torchToggle = document.getElementById('torchToggle');
const incantationBtn = document.getElementById('incantationBtn');
const incantationModal = document.getElementById('incantationModal');
const modalClose = document.querySelector('.modal-close');
const speakIncantationBtn = document.getElementById('speakIncantation');
const sealIncantationBtn = document.getElementById('sealIncantation');
const revealProphecyBtn = document.getElementById('revealProphecy');
const resetProphecyBtn = document.getElementById('resetProphecy');
const prophecyText = document.getElementById('prophecyText');
const prophecyLines = document.querySelectorAll('.prophecy-line');
const prophecyOverlay = document.querySelector('.prophecy-reveal-overlay');
const prevCreatureBtn = document.getElementById('prevCreature');
const nextCreatureBtn = document.getElementById('nextCreature');
const creatureCounter = document.getElementById('creatureCounter');
const creatureProfiles = document.querySelectorAll('.creature-profile');
const exploreMapBtn = document.getElementById('exploreMap');
const clearFogBtn = document.getElementById('clearFog');
const mapFog = document.getElementById('mapFog');
const mapMarkers = document.querySelectorAll('.map-marker');
const ancientMap = document.getElementById('ancientMap');
const loreRevealBtn = document.getElementById('loreReveal');
const hiddenLore = document.getElementById('hiddenLore');
const ambientAudio = document.getElementById('ambientAudio');

// State Variables
let isDragging = false;
let isTorchActive = true;
let isAudioPlaying = false;
let currentCreatureIndex = 0;
let isMapExploring = false;
let fogOpacity = 0.7;
let candlePosition = { x: 50, y: 120 };
let lightRadius = 200;

// Initialize the application
function init() {
    console.log('Umbral Archives initialized... The shadows stir.');
    
    // Set up initial candle position
    updateLightPosition(candlePosition.x, candlePosition.y);
    
    // Draw initial creature silhouette
    drawCreatureSilhouette(currentCreatureIndex);
    
    // Draw the ancient map
    drawAncientMap();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start ambient audio with low volume
    ambientAudio.volume = 0.3;
    
    // Initial prophecy state
    prophecyText.classList.add('hidden');
    
    // Add subtle random flicker to all flames
    setInterval(randomizeFlames, 3000);
}

// Set up all event listeners
function setupEventListeners() {
    // Candle drag interactions
    candle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    candle.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Control buttons
    audioToggle.addEventListener('click', toggleAudio);
    torchToggle.addEventListener('click', toggleTorch);
    incantationBtn.addEventListener('click', openIncantationModal);
    modalClose.addEventListener('click', closeIncantationModal);
    speakIncantationBtn.addEventListener('click', speakIncantation);
    sealIncantationBtn.addEventListener('click', closeIncantationModal);
    
    // Prophecy controls
    revealProphecyBtn.addEventListener('click', revealProphecy);
    resetProphecyBtn.addEventListener('click', resetProphecy);
    
    // Bestiary controls
    prevCreatureBtn.addEventListener('click', showPreviousCreature);
    nextCreatureBtn.addEventListener('click', showNextCreature);
    
    // Map controls
    exploreMapBtn.addEventListener('click', exploreMap);
    clearFogBtn.addEventListener('click', clearFog);
    
    // Map marker interactions
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            showMapNotification(`Location revealed: ${location}`);
            pulseElement(this);
        });
    });
    
    // Lore reveal
    loreRevealBtn.addEventListener('click', revealHiddenLore);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === incantationModal) {
            closeIncantationModal();
        }
    });
    
    // Window resize handling
    window.addEventListener('resize', handleResize);
}

// Candle Drag Functionality
function startDrag(e) {
    isDragging = true;
    candle.style.cursor = 'grabbing';
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    let x, y;
    
    if (e.type === 'mousemove') {
        x = e.clientX - containerRect.left;
        y = e.clientY - containerRect.top;
    }
    
    // Constrain candle to container bounds
    x = Math.max(40, Math.min(x, containerRect.width - 40));
    y = Math.max(40, Math.min(y, containerRect.height - 150));
    
    updateLightPosition(x, y);
}

function endDrag() {
    isDragging = false;
    candle.style.cursor = 'grab';
}

// Touch event handlers for mobile
function handleTouchStart(e) {
    isDragging = true;
    candle.style.cursor = 'grabbing';
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const touch = e.touches[0];
    
    let x = touch.clientX - containerRect.left;
    let y = touch.clientY - containerRect.top;
    
    // Constrain candle to container bounds
    x = Math.max(40, Math.min(x, containerRect.width - 40));
    y = Math.max(40, Math.min(y, containerRect.height - 150));
    
    updateLightPosition(x, y);
    e.preventDefault();
}

function handleTouchEnd() {
    isDragging = false;
    candle.style.cursor = 'grab';
}

// Update candle position and light effect
function updateLightPosition(x, y) {
    candlePosition = { x, y };
    
    // Move candle element
    candle.style.left = `${x}px`;
    candle.style.top = `${y}px`;
    
    // Update light overlay gradient
    if (isTorchActive) {
        lightOverlay.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent ${lightRadius}px, rgba(0, 0, 0, 0.8) ${lightRadius + 100}px)`;
        lightOverlay.style.opacity = '0.6';
    }
    
    // Update panel shadows based on light position
    updateDynamicShadows(x, y);
}

// Create dynamic shadows based on candle position
function updateDynamicShadows(x, y) {
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        // Calculate distance from candle to panel center
        const panelCenterX = rect.left + rect.width / 2 - containerRect.left;
        const panelCenterY = rect.top + rect.height / 2 - containerRect.top;
        
        const distance = Math.sqrt(
            Math.pow(panelCenterX - x, 2) + Math.pow(panelCenterY - y, 2)
        );
        
        // Calculate shadow intensity based on distance
        let shadowIntensity = Math.max(0, 1 - distance / 500);
        shadowIntensity = isTorchActive ? shadowIntensity : 0;
        
        // Apply shadow effect
        panel.style.boxShadow = `
            inset 0 0 20px rgba(0, 0, 0, ${0.3 + shadowIntensity * 0.2}),
            0 5px 15px rgba(0, 0, 0, ${0.5 + shadowIntensity * 0.3})
        `;
    });
}

// Control Functions
function toggleAudio() {
    if (isAudioPlaying) {
        ambientAudio.pause();
        audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i><span>Ambience</span>';
        showNotification('Silence falls...', 'info');
    } else {
        ambientAudio.play().catch(e => {
            console.log('Audio play failed:', e);
            showNotification('The silence remains unbroken.', 'warning');
        });
        audioToggle.innerHTML = '<i class="fas fa-volume-up"></i><span>Ambience</span>';
        showNotification('The archives whisper...', 'success');
    }
    isAudioPlaying = !isAudioPlaying;
}

function toggleTorch() {
    isTorchActive = !isTorchActive;
    
    if (isTorchActive) {
        torchToggle.innerHTML = '<i class="fas fa-fire"></i><span>Torchlight</span>';
        lightOverlay.style.opacity = '0.6';
        updateLightPosition(candlePosition.x, candlePosition.y);
        showNotification('Torchlight pierces the gloom.', 'success');
        
        // Light up corner ornaments
        document.querySelectorAll('.flame').forEach(flame => {
            flame.style.opacity = '0.7';
        });
    } else {
        torchToggle.innerHTML = '<i class="fas fa-moon"></i><span>Darkness</span>';
        lightOverlay.style.opacity = '0.9';
        lightOverlay.style.background = 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.9) 70%)';
        showNotification('Darkness embraces the archives.', 'warning');
        
        // Dim corner ornaments
        document.querySelectorAll('.flame').forEach(flame => {
            flame.style.opacity = '0.2';
        });
    }
}

// Prophecy Functions
function revealProphecy() {
    prophecyText.classList.remove('hidden');
    prophecyOverlay.style.opacity = '1';
    
    // Animate each line with a delay
    prophecyLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('revealed');
            
            // Add a subtle sound effect for each line (simulated)
            if (index % 2 === 0) {
                playSubtleSound('reveal');
            }
        }, index * 300);
    });
    
    showNotification('The prophecy is unveiled...', 'success');
    revealProphecyBtn.disabled = true;
    
    // Auto-hide overlay after animation
    setTimeout(() => {
        prophecyOverlay.style.opacity = '0';
    }, 2500);
}

function resetProphecy() {
    prophecyLines.forEach(line => {
        line.classList.remove('revealed');
    });
    
    prophecyText.classList.add('hidden');
    revealProphecyBtn.disabled = false;
    
    showNotification('The words fade back into shadow.', 'info');
}

// Bestiary Functions
function showPreviousCreature() {
    creatureProfiles[currentCreatureIndex].classList.remove('active');
    
    currentCreatureIndex--;
    if (currentCreatureIndex < 0) {
        currentCreatureIndex = creatureProfiles.length - 1;
    }
    
    creatureProfiles[currentCreatureIndex].classList.add('active');
    updateCreatureCounter();
    drawCreatureSilhouette(currentCreatureIndex);
    
    playSubtleSound('page');
}

function showNextCreature() {
    creatureProfiles[currentCreatureIndex].classList.remove('active');
    
    currentCreatureIndex++;
    if (currentCreatureIndex >= creatureProfiles.length) {
        currentCreatureIndex = 0;
    }
    
    creatureProfiles[currentCreatureIndex].classList.add('active');
    updateCreatureCounter();
    drawCreatureSilhouette(currentCreatureIndex);
    
    playSubtleSound('page');
}

function updateCreatureCounter() {
    creatureCounter.textContent = `${currentCreatureIndex + 1}/${creatureProfiles.length}`;
}

function drawCreatureSilhouette(creatureIndex) {
    const silhouetteContainers = document.querySelectorAll('.creature-silhouette');
    const container = silhouetteContainers[creatureIndex];
    
    if (!container) return;
    
    // Clear previous drawing
    container.innerHTML = '';
    
    // Create canvas for drawing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    container.appendChild(canvas);
    
    // Draw different silhouettes based on creature index
    switch(creatureIndex) {
        case 0: // Shade Stalker
            drawShadeStalker(ctx, width, height);
            break;
        case 1: // Gravelord Behemoth
            drawGravelordBehemoth(ctx, width, height);
            break;
        default:
            drawGenericCreature(ctx, width, height, creatureIndex);
    }
    
    // Add subtle animation
    canvas.style.animation = 'gentle-float 6s ease-in-out infinite';
    canvas.style.animationDelay = `${creatureIndex * 0.5}s`;
}

function drawShadeStalker(ctx, width, height) {
    // Draw a wispy, shadowy figure
    ctx.fillStyle = 'rgba(20, 20, 30, 0.8)';
    
    // Main body
    ctx.beginPath();
    ctx.ellipse(width/2, height/2, width/4, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tendrils
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const length = width/3 + Math.random() * width/6;
        
        ctx.beginPath();
        ctx.moveTo(width/2, height/2);
        ctx.lineTo(
            width/2 + Math.cos(angle) * length,
            height/2 + Math.sin(angle) * length
        );
        ctx.strokeStyle = 'rgba(40, 40, 60, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Eyes
    ctx.fillStyle = 'rgba(138, 3, 3, 0.7)';
    ctx.beginPath();
    ctx.arc(width/2 - 15, height/2 - 10, 8, 0, Math.PI * 2);
    ctx.arc(width/2 + 15, height/2 - 10, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawGravelordBehemoth(ctx, width, height) {
    // Draw a hulking armored figure
    ctx.fillStyle = 'rgba(93, 92, 97, 0.8)';
    
    // Body
    ctx.fillRect(width/2 - 40, height/2 - 60, 80, 120);
    
    // Shoulders
    ctx.beginPath();
    ctx.arc(width/2 - 50, height/2 - 40, 20, 0, Math.PI * 2);
    ctx.arc(width/2 + 50, height/2 - 40, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Helmet with horns
    ctx.fillRect(width/2 - 30, height/2 - 80, 60, 30);
    
    // Horns
    ctx.beginPath();
    ctx.moveTo(width/2 - 20, height/2 - 80);
    ctx.lineTo(width/2 - 40, height/2 - 110);
    ctx.lineTo(width/2 - 15, height/2 - 80);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(width/2 + 20, height/2 - 80);
    ctx.lineTo(width/2 + 40, height/2 - 110);
    ctx.lineTo(width/2 + 15, height/2 - 80);
    ctx.fill();
    
    // Weapon
    ctx.fillStyle = 'rgba(138, 58, 10, 0.9)';
    ctx.fillRect(width/2 + 60, height/2 - 20, 10, 80);
    
    // Glowing eyes
    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.beginPath();
    ctx.arc(width/2 - 15, height/2 - 65, 5, 0, Math.PI * 2);
    ctx.arc(width/2 + 15, height/2 - 65, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawGenericCreature(ctx, width, height, index) {
    // Draw a simple silhouette based on index
    ctx.fillStyle = `rgba(${30 + index * 20}, ${20 + index * 10}, ${40 + index * 5}, 0.7)`;
    
    // Random shape
    const shapeType = index % 3;
    
    if (shapeType === 0) {
        // Circular creature
        ctx.beginPath();
        ctx.arc(width/2, height/2, Math.min(width, height)/3, 0, Math.PI * 2);
        ctx.fill();
    } else if (shapeType === 1) {
        // Triangular creature
        ctx.beginPath();
        ctx.moveTo(width/2, height/2 - 40);
        ctx.lineTo(width/2 - 40, height/2 + 40);
        ctx.lineTo(width/2 + 40, height/2 + 40);
        ctx.closePath();
        ctx.fill();
    } else {
        // Rectangular creature
        ctx.fillRect(width/2 - 40, height/2 - 40, 80, 80);
    }
}

// Map Functions
function drawAncientMap() {
    // Create a simple map drawing
    const ctx = ancientMap.getContext('2d');
    const width = ancientMap.clientWidth;
    const height = ancientMap.clientHeight;
    
    ancientMap.width = width;
    ancientMap.height = height;
    
    // Background
    ctx.fillStyle = '#2d241e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw terrain features
    ctx.fillStyle = 'rgba(42, 92, 58, 0.3)';
    
    // Forest area
    for (let i = 0; i < 50; i++) {
        const x = width * 0.4 + Math.random() * width * 0.3;
        const y = height * 0.4 + Math.random() * height * 0.3;
        const size = 5 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Mountains
    ctx.fillStyle = 'rgba(93, 92, 97, 0.5)';
    drawMountainRange(ctx, width * 0.2, height * 0.25, width * 0.2, height * 0.4);
    drawMountainRange(ctx, width * 0.6, height * 0.3, width * 0.25, height * 0.35);
    
    // River
    ctx.strokeStyle = 'rgba(30, 60, 90, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.8, height * 0.1);
    ctx.bezierCurveTo(
        width * 0.6, height * 0.3,
        width * 0.4, height * 0.6,
        width * 0.2, height * 0.9
    );
    ctx.stroke();
    
    // Roads/paths
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.7);
    ctx.lineTo(width * 0.5, height * 0.5);
    ctx.lineTo(width * 0.7, height * 0.6);
    ctx.stroke();
}

function drawMountainRange(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    
    const peaks = 5;
    const peakWidth = width / peaks;
    
    for (let i = 0; i <= peaks; i++) {
        const peakX = x + i * peakWidth;
        const peakY = y + (i % 2 === 0 ? 0 : height * 0.3);
        
        ctx.lineTo(peakX, peakY);
    }
    
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
    ctx.fill();
}

function exploreMap() {
    if (isMapExploring) return;
    
    isMapExploring = true;
    exploreMapBtn.disabled = true;
    
    // Create exploration effect
    const scanLine = document.createElement('div');
    scanLine.style.position = 'absolute';
    scanLine.style.top = '0';
    scanLine.style.left = '0';
    scanLine.style.width = '100%';
    scanLine.style.height = '3px';
    scanLine.style.background = 'linear-gradient(to right, transparent, rgba(201, 162, 39, 0.7), transparent)';
    scanLine.style.boxShadow = '0 0 10px rgba(201, 162, 39, 0.5)';
    scanLine.style.zIndex = '10';
    
    document.querySelector('.map-container').appendChild(scanLine);
    
    // Animate scan line
    scanLine.style.transition = 'top 3s linear';
    scanLine.style.top = '100%';
    
    // Temporarily reduce fog
    mapFog.style.opacity = '0.3';
    
    // Show notification
    showNotification('Exploring the cursed realms...', 'info');
    
    // Reset after animation
    setTimeout(() => {
        scanLine.remove();
        mapFog.style.opacity = fogOpacity.toString();
        isMapExploring = false;
        exploreMapBtn.disabled = false;
    }, 3000);
}

function clearFog() {
    fogOpacity = Math.max(0.1, fogOpacity - 0.2);
    mapFog.style.opacity = fogOpacity.toString();
    
    if (fogOpacity <= 0.1) {
        clearFogBtn.disabled = true;
        showNotification('The fog has lifted!', 'success');
    } else {
        showNotification('A breeze clears some mist...', 'info');
    }
}

// Incantation Functions
function openIncantationModal() {
    incantationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showNotification('The book of shadows opens...', 'warning');
}

function closeIncantationModal() {
    incantationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function speakIncantation() {
    // Visual effects
    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.animation = 'shake 0.5s';
    });
    
    // Change lighting
    lightOverlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
    lightOverlay.style.opacity = '0.8';
    
    // Update candle flame
    const flameInner = document.querySelector('.flame-inner');
    const flameOuter = document.querySelector('.flame-outer');
    
    flameInner.style.background = 'linear-gradient(to top, #ff0000, #ff6b6b)';
    flameOuter.style.background = 'linear-gradient(to top, transparent, rgba(255, 0, 0, 0.5))';
    
    // Show notification
    showNotification('THE UNSPOKEN HAS BEEN INVOKED!', 'danger');
    
    // Play a sound (simulated)
    playSubtleSound('incantation');
    
    // Restore after delay
    setTimeout(() => {
        document.querySelectorAll('.panel').forEach(panel => {
            panel.style.animation = '';
        });
        
        lightOverlay.style.background = `radial-gradient(circle at ${candlePosition.x}px ${candlePosition.y}px, transparent ${lightRadius}px, rgba(0, 0, 0, 0.8) ${lightRadius + 100}px)`;
        lightOverlay.style.opacity = '0.6';
        
        flameInner.style.background = 'linear-gradient(to top, var(--color-flame-core), var(--color-flame))';
        flameOuter.style.background = 'linear-gradient(to top, transparent, var(--color-flame-glow))';
        
        closeIncantationModal();
    }, 2000);
}

// Lore Functions
function revealHiddenLore() {
    hiddenLore.classList.toggle('active');
    
    if (hiddenLore.classList.contains('active')) {
        loreRevealBtn.innerHTML = '<i class="fas fa-hand-point-left"></i> Hide the text';
        showNotification('A hidden truth is revealed...', 'info');
        playSubtleSound('reveal');
    } else {
        loreRevealBtn.innerHTML = '<i class="fas fa-hand-point-right"></i> Touch the text';
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'danger' ? '<i class="fas fa-skull-crossbones"></i>' : 
              type === 'warning' ? '<i class="fas fa-exclamation-triangle"></i>' : 
              type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
              '<i class="fas fa-info-circle"></i>'}
        </span>
        <span class="notification-text">${message}</span>
    `;
    
    // Style based on type
    const colors = {
        danger: 'rgba(138, 3, 3, 0.9)',
        warning: 'rgba(201, 162, 39, 0.9)',
        success: 'rgba(42, 92, 58, 0.9)',
        info: 'rgba(93, 92, 97, 0.9)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: var(--color-parchment);
        padding: 15px 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        border-left: 4px solid ${type === 'danger' ? '#ff0000' : type === 'warning' ? '#ffcc00' : '#ffffff'};
        transform: translateX(120%);
        transition: transform 0.3s ease;
        font-family: var(--font-heading);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function showMapNotification(message) {
    // Simpler notification for map interactions
    const mapContainer = document.querySelector('.map-container');
    
    const note = document.createElement('div');
    note.textContent = message;
    note.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(20, 15, 10, 0.9);
        color: var(--color-gold);
        padding: 8px 15px;
        border-radius: 4px;
        border: 1px solid var(--color-rust);
        font-family: var(--font-heading);
        font-size: 0.9rem;
        z-index: 20;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    mapContainer.appendChild(note);
    
    // Fade in
    setTimeout(() => note.style.opacity = '1', 10);
    
    // Remove after delay
    setTimeout(() => {
        note.style.opacity = '0';
        setTimeout(() => note.remove(), 300);
    }, 2000);
}

function playSubtleSound(type) {
    // Create audio context for subtle sound effects
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different sounds for different events
        switch(type) {
            case 'reveal':
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                break;
            case 'page':
                oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + 0.3);
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                break;
            case 'incantation':
                oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(55, audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime + 0.4);
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
                break;
        }
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.6);
    } catch (e) {
        console.log('Web Audio API not supported:', e);
    }
}

function randomizeFlames() {
    // Add random variation to all flames on the page
    document.querySelectorAll('.flame, .flame-inner').forEach(flame => {
        const randomScale = 0.9 + Math.random() * 0.3;
        const randomOpacity = 0.6 + Math.random() * 0.4;
        
        flame.style.transform = `scaleY(${randomScale})`;
        flame.style.opacity = randomOpacity.toString();
    });
}

function pulseElement(element) {
    element.style.animation = 'pulse-danger 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function handleResize() {
    // Redraw map and creature silhouettes on resize
    drawAncientMap();
    drawCreatureSilhouette(currentCreatureIndex);
    
    // Update candle position constraints
    updateLightPosition(candlePosition.x, candlePosition.y);
}

// Additional CSS for animations not in the main stylesheet
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .notification {
        font-family: var(--font-heading);
    }
    
    canvas {
        display: block;
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(additionalStyles);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
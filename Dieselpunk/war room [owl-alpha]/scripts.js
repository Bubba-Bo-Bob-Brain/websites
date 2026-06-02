/* ============================================
   SECTOR COMMAND - WAR ROOM JAVASCRIPT
   1940s Alternate History Military Command
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initializeClock();
    initializeRadioFeed();
    initializeUnitTokens();
    initializeGauges();
    initializePosters();
    initializeMapControls();
    initializeAlerts();
    initializeAtmosphericEffects();
});

/* ============================================
   CLOCK SYSTEM
   ============================================ */
function initializeClock() {
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    // Set initial wartime date (alternate history: March 1943)
    let gameDate = new Date(1943, 2, 15, 23, 47, 15); // March 15, 1943, 23:47:15
    
    function updateClock() {
        // Increment time (1 real second = 5 game minutes)
        gameDate.setMinutes(gameDate.getMinutes() + 5);
        
        // Format date
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                       'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        
        const day = String(gameDate.getDate()).padStart(2, '0');
        const month = months[gameDate.getMonth()];
        const year = gameDate.getFullYear();
        
        dateElement.textContent = `${day} ${month} ${year}`;
        
        // Format time (24-hour military format)
        const hours = String(gameDate.getHours()).padStart(2, '0');
        const minutes = String(gameDate.getMinutes()).padStart(2, '0');
        const seconds = String(gameDate.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Blink colon effect
        if (gameDate.getSeconds() % 2 === 0) {
            timeElement.style.opacity = '1';
        } else {
            timeElement.style.opacity = '0.7';
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* ============================================
   RADIO INTERCEPT SYSTEM
   ============================================ */
function initializeRadioFeed() {
    const feedContainer = document.getElementById('intercept-feed');
    const freqDisplay = document.getElementById('freq-display');
    
    // Radio intercept messages pool
    const intercepts = [
        { type: 'normal', message: 'ENEMY CONVOY SPOTTED SECTOR 7-GRID' },
        { type: 'normal', message: 'WEATHER: CLEAR SKIES EXPECTED' },
        { type: 'normal', message: 'SUPPLY LINE SECURE - ROUTE ALPHA' },
        { type: 'urgent', message: '⚠ REINFORCEMENTS EN ROUTE TO FRONT' },
        { type: 'normal', message: 'AIR PATROL REPORTING ALL CLEAR' },
        { type: 'urgent', message: '⚠ ARTILLERY FIRE DETECTED GRID REF 42-N' },
        { type: 'normal', message: 'RECON TEAM DELIVERING REPORTS' },
        { type: 'normal', message: 'COMMUNICATION CHECK - ALL STATIONS' },
        { type: 'urgent', message: '⚠ ENEMY ACTIVITY IN SECTOR 12-BRAVO' },
        { type: 'normal', message: 'RESUPPLY COMPLETED - BASE CAMP' },
        { type: 'normal', message: 'SCOUT UNIT REQUESTING PERMISSION TO ADVANCE' },
        { type: 'urgent', message: '⚠ RADAR CONTACT - BEARING 045 DEGREES' },
        { type: 'normal', message: 'FIELD HOSPITAL OPERATIONAL' },
        { type: 'normal', message: 'ENGINEER UNIT CLEARING OBSTACLES' },
        { type: 'urgent', message: '⚠ ENEMY AIRCRAFT INCOMING - TAKE COVER' }
    ];
    
    // Frequency hopping effect
    function updateFrequency() {
        const baseFreq = 7.245;
        const variation = (Math.random() - 0.5) * 0.1;
        freqDisplay.textContent = (baseFreq + variation).toFixed(3) + ' MHz';
    }
    
    // Add new intercept
    function addIntercept() {
        const intercept = intercepts[Math.floor(Math.random() * intercepts.length)];
        const now = new Date();
        const timestamp = String(now.getHours()).padStart(2, '0') + ':' + 
                         String(now.getMinutes()).padStart(2, '0');
        
        const entry = document.createElement('div');
        entry.className = `intercept-entry ${intercept.type}`;
        entry.dataset.time = timestamp;
        entry.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="message">${intercept.message}</span>
        `;
        
        feedContainer.insertBefore(entry, feedContainer.firstChild);
        
        // Remove old entries (keep max 10)
        while (feedContainer.children.length > 10) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
        
        // Flash effect on new message
        entry.style.animation = 'none';
        entry.offsetHeight; // Trigger reflow
        entry.style.animation = 'urgentPulse 1s ease';
    }
    
    // Initial population
    for (let i = 0; i < 3; i++) {
        setTimeout(() => addIntercept(), i * 100);
    }
    
    // Add new intercept every 8-15 seconds
    setInterval(() => {
        if (Math.random() > 0.3) {
            addIntercept();
        }
    }, 8000 + Math.random() * 7000);
    
    // Update frequency display
    setInterval(updateFrequency, 2000);
}

/* ============================================
   DRAGGABLE UNIT TOKENS
   ============================================ */
function initializeUnitTokens() {
    const map = document.getElementById('strategy-map');
    const tokens = document.querySelectorAll('.unit-token[draggable="true"]');
    const preview = document.getElementById('drag-preview');
    
    let activeToken = null;
    let offsetX = 0;
    let offsetY = 0;
    
    tokens.forEach(token => {
        // Mouse events
        token.addEventListener('mousedown', startDrag);
        
        // Touch events
        token.addEventListener('touchstart', startDrag, { passive: false });
    });
    
    function startDrag(e) {
        e.preventDefault();
        activeToken = e.target.closest('.unit-token');
        
        activeToken.classList.add('dragging');
        
        const rect = activeToken.getBoundingClientRect();
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        // Setup preview
        preview.textContent = activeToken.querySelector('.token-inner').textContent;
        preview.className = `drag-preview active ${activeToken.classList.contains('enemy') ? 'enemy' : 'friendly'}`;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }
    
    function drag(e) {
        if (!activeToken) return;
        e.preventDefault();
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        const mapRect = map.getBoundingClientRect();
        
        // Calculate position relative to map
        let newX = clientX - mapRect.left - offsetX;
        let newY = clientY - mapRect.top - offsetY;
        
        // Boundary constraints
        const tokenRect = activeToken.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, mapRect.width - tokenRect.width));
        newY = Math.max(0, Math.min(newY, mapRect.height - tokenRect.height));
        
        // Update token position
        activeToken.style.left = `${(newX / mapRect.width) * 100}%`;
        activeToken.style.top = `${(newY / mapRect.height) * 100}%`;
        
        // Update preview position
        preview.style.left = `${clientX - offsetX}px`;
        preview.style.top = `${clientY - offsetY}px`;
    }
    
    function endDrag(e) {
        if (!activeToken) return;
        
        activeToken.classList.remove('dragging');
        preview.classList.remove('active');
        
        // Snap to grid (optional - 10px grid)
        const mapRect = map.getBoundingClientRect();
        const tokenRect = activeToken.getBoundingClientRect();
        const gridSize = 25; // pixels
        
        const currentX = parseFloat(activeToken.style.left) / 100 * mapRect.width;
        const currentY = parseFloat(activeToken.style.top) / 100 * mapRect.height;
        
        const snappedX = Math.round(currentX / gridSize) * gridSize;
        const snappedY = Math.round(currentY / gridSize) * gridSize;
        
        activeToken.style.left = `${(snappedX / mapRect.width) * 100}%`;
        activeToken.style.top = `${(snappedY / mapRect.height) * 100}%`;
        
        // Trigger deployment confirmation
        showDeploymentConfirmation(activeToken);
        
        activeToken = null;
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);
    }
    
    function showDeploymentConfirmation(token) {
        const unitName = token.querySelector('.token-info').textContent;
        
        // Add to radio feed
        const feedContainer = document.getElementById('intercept-feed');
        const entry = document.createElement('div');
        entry.className = 'intercept-entry';
        const now = new Date();
        const timestamp = String(now.getHours()).padStart(2, '0') + ':' + 
                         String(now.getMinutes()).padStart(2, '0');
        
        entry.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="message">${unitName} DEPLOYED TO NEW POSITION</span>
        `;
        
        feedContainer.insertBefore(entry, feedContainer.firstChild);
        
        // Flash effect
        token.style.boxShadow = '0 0 20px rgba(184, 134, 11, 0.8)';
        setTimeout(() => {
            token.style.boxShadow = '';
        }, 500);
    }
}

/* ============================================
   ANALOG GAUGE SYSTEM
   ============================================ */
function initializeGauges() {
    const gauges = [
        { id: 'gauge-manpower', current: 72, min: 0, max: 100 },
        { id: 'gauge-ammo', current: 45, min: 0, max: 100 },
        { id: 'gauge-fuel', current: 58, min: 0, max: 100 },
        { id: 'gauge-industry', current: 85, min: 0, max: 100 }
    ];
    
    function updateGauge(gauge) {
        const element = document.getElementById(gauge.id);
        if (!element) return;
        
        const needle = element.querySelector('.gauge-needle');
        const valueDisplay = element.querySelector('.gauge-value');
        
        // Calculate needle rotation (-70deg to 70deg range)
        const percentage = (gauge.current - gauge.min) / (gauge.max - gauge.min);
        const angle = -70 + (percentage * 140);
        
        needle.style.setProperty('--value', `${angle}deg`);
        valueDisplay.textContent = `${gauge.current}%`;
        
        // Color coding based on value
        if (gauge.current < 30) {
            valueDisplay.style.color = 'var(--red-bright)';
        } else if (gauge.current < 60) {
            valueDisplay.style.color = 'var(--amber-warning)';
        } else {
            valueDisplay.style.color = 'var(--brass)';
        }
    }
    
    // Initialize gauges
    gauges.forEach(updateGauge);
    
    // Simulate gauge fluctuations
    setInterval(() => {
        gauges.forEach(gauge => {
            // Random fluctuation
            const change = (Math.random() - 0.5) * 4;
            gauge.current = Math.max(gauge.min, Math.min(gauge.max, gauge.current + change));
            updateGauge(gauge);
        });
    }, 5000);
    
    // Update production progress bars
    updateProductionBars();
}

function updateProductionBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    setInterval(() => {
        progressBars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width);
            const change = (Math.random() - 0.5) * 2;
            const newWidth = Math.max(0, Math.min(100, currentWidth + change));
            
            bar.style.width = `${newWidth}%`;
            
            // Update class based on value
            bar.classList.remove('warning', 'danger');
            if (newWidth < 40) {
                bar.classList.add('danger');
            } else if (newWidth < 70) {
                bar.classList.add('warning');
            }
        });
    }, 3000);
}

/* ============================================
   PROPAGANDA POSTER ROTATION
   ============================================ */
function initializePosters() {
    const posters = [
        {
            title: 'VICTORY AWAITS',
            image: '🏭',
            text: 'EVERY FACTORY HOUR COUNTS',
            footer: 'MINISTRY OF PRODUCTION',
            style: 'poster-1'
        },
        {
            title: 'STAND UNITED',
            image: '⚔️',
            text: 'TOGETHER WE ARE UNBREAKABLE',
            footer: 'WAR DEPARTMENT',
            style: 'poster-2'
        },
        {
            title: 'WATCH THE SKIES',
            image: '👁️',
            text: 'ENEMY EYES ARE EVERYWHERE',
            footer: 'INTELLIGENCE BUREAU',
            style: 'poster-3'
        },
        {
            title: 'FUEL THE FIGHT',
            image: '⛽',
            text: 'CONSERVE RESOURCES FOR VICTORY',
            footer: 'LOGISTICS COMMAND',
            style: 'poster-4'
        }
    ];
    
    const posterContainer = document.getElementById('active-poster');
    const indicators = document.querySelectorAll('.indicator');
    let currentPoster = 0;
    
    function rotatePoster() {
        currentPoster = (currentPoster + 1) % posters.length;
        const poster = posters[currentPoster];
        
        // Fade out
        posterContainer.style.opacity = '0';
        
        setTimeout(() => {
            posterContainer.innerHTML = `
                <div class="poster-content ${poster.style}">
                    <div class="poster-title">${poster.title}</div>
                    <div class="poster-image">${poster.image}</div>
                    <div class="poster-text">${poster.text}</div>
                    <div class="poster-footer">${poster.footer}</div>
                </div>
            `;
            
            // Update indicators
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === currentPoster);
            });
            
            // Fade in
            posterContainer.style.opacity = '1';
        }, 500);
    }
    
    // Add transition style
    posterContainer.style.transition = 'opacity 0.5s ease';
    
    // Rotate every 15 seconds
    setInterval(rotatePoster, 15000);
}

/* ============================================
   MAP CONTROLS
   ============================================ */
function initializeMapControls() {
    const btnReset = document.getElementById('btn-reset');
    const btnGrid = document.getElementById('btn-grid');
    const btnUnits = document.getElementById('btn-units');
    const map = document.getElementById('strategy-map');
    const gridOverlay = map.querySelector('.grid-overlay');
    const tokens = document.querySelectorAll('.unit-token');
    
    let gridVisible = true;
    let unitsVisible = true;
    
    btnReset.addEventListener('click', () => {
        // Reset token positions to default
        const defaultPositions = {
            'token-alpha': { top: '30%', left: '40%' },
            'token-bravo': { top: '55%', left: '30%' },
            'token-charlie': { top: '35%', left: '65%' },
            'token-delta': { top: '65%', left: '45%' }
        };
        
        Object.entries(defaultPositions).forEach(([id, pos]) => {
            const token = document.getElementById(id);
            if (token) {
                token.style.top = pos.top;
                token.style.left = pos.left;
            }
        });
        
        // Flash effect
        map.style.boxShadow = '0 0 30px rgba(184, 134, 11, 0.5)';
        setTimeout(() => {
            map.style.boxShadow = '';
        }, 300);
    });
    
    btnGrid.addEventListener('click', () => {
        gridVisible = !gridVisible;
        gridOverlay.style.opacity = gridVisible ? '1' : '0';
        btnGrid.classList.toggle('active', gridVisible);
    });
    
    btnUnits.addEventListener('click', () => {
        unitsVisible = !unitsVisible;
        tokens.forEach(token => {
            token.style.opacity = unitsVisible ? '1' : '0.2';
        });
        btnUnits.classList.toggle('active', unitsVisible);
    });
}

/* ============================================
   ALERT SYSTEM
   ============================================ */
function initializeAlerts() {
    const alertLevel = document.getElementById('alert-level');
    const enemyLosses = document.getElementById('enemy-losses');
    const friendlyLosses = document.getElementById('friendly-losses');
    
    // Alert level cycling
    const alertLevels = ['HIGH ALERT', 'ELEVATED', 'STAND BY', 'HIGH ALERT'];
    let alertIndex = 0;
    
    function cycleAlertLevel() {
        alertIndex = (alertIndex + 1) % alertLevels.length;
        alertLevel.textContent = alertLevels[alertIndex];
        
        // Color coding
        alertLevel.classList.remove('warning', 'danger');
        if (alertLevels[alertIndex] === 'HIGH ALERT') {
            alertLevel.style.color = 'var(--red-bright)';
        } else if (alertLevels[alertIndex] === 'ELEVATED') {
            alertLevel.style.color = 'var(--amber-warning)';
        } else {
            alertLevel.style.color = 'var(--green-bright)';
        }
    }
    
    // Simulate casualty updates
    function updateCasualties() {
        // Parse current values
        let enemy = parseInt(enemyLosses.textContent.replace(/,/g, ''));
        let friendly = parseInt(friendlyLosses.textContent.replace(/,/g, ''));
        
        // Random increases
        enemy += Math.floor(Math.random() * 50) + 10;
        friendly += Math.floor(Math.random() * 15) + 2;
        
        // Update display
        enemyLosses.textContent = enemy.toLocaleString();
        friendlyLosses.textContent = friendly.toLocaleString();
    }
    
    // Update intervals
    setInterval(cycleAlertLevel, 30000);
    setInterval(updateCasualties, 10000);
}

/* ============================================
   ATMOSPHERIC EFFECTS
   ============================================ */
function initializeAtmosphericEffects() {
    // Lamp flicker enhancement
    const lampLight = document.querySelector('.lamp-light');
    
    function enhancedFlicker() {
        const intensity = 0.06 + Math.random() * 0.04;
        lampLight.style.borderTopColor = `rgba(255, 248, 220, ${intensity})`;
    }
    
    setInterval(enhancedFlicker, 100);
    
    // Random signal bar fluctuations
    const signalBars = document.querySelectorAll('.signal-bar');
    
    function fluctuateSignal() {
        signalBars.forEach((bar, index) => {
            const shouldActivate = Math.random() > 0.3;
            if (shouldActivate && index < 4) {
                bar.style.background = 'var(--green-bright)';
                bar.style.boxShadow = '0 0 5px var(--green-bright)';
            } else if (index >= 4) {
                bar.style.background = 'var(--steel-light)';
                bar.style.boxShadow = 'none';
            }
        });
    }
    
    setInterval(fluctuateSignal, 1500);
    
    // Unit status indicator updates
    const unitItems = document.querySelectorAll('.unit-item');
    
    function updateUnitStatus() {
        unitItems.forEach(item => {
            const statusLight = item.querySelector('.unit-status');
            const currentClass = Array.from(statusLight.classList).find(c => c !== 'unit-status');
            
            // Random status changes
            const statuses = ['combat', 'ready', 'resupply', 'standby'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            if (currentClass !== newStatus && Math.random() > 0.7) {
                statusLight.classList.remove(currentClass);
                statusLight.classList.add(newStatus);
            }
        });
    }
    
    setInterval(updateUnitStatus, 8000);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'g':
            document.getElementById('btn-grid').click();
            break;
        case 'u':
            document.getElementById('btn-units').click();
            break;
        case 'r':
            document.getElementById('btn-reset').click();
            break;
    }
});

// Console easter egg for the alternate history setting
console.log(`
╔══════════════════════════════════════════════════════════════╗
║           SECTOR COMMAND - WAR ROOM TERMINAL                ║
║                  CLASSIFIED SYSTEM v2.71                     ║
╠══════════════════════════════════════════════════════════════╣
║  ALTERNATE TIMELINE: 1943                                    ║
║  OPERATION: IRON TEMPEST                                     ║
║  STATUS: ACTIVE                                              ║
╚══════════════════════════════════════════════════════════════╝

Keyboard shortcuts:
  [G] Toggle grid overlay
  [U] Toggle unit visibility
  [R] Reset unit positions
`);
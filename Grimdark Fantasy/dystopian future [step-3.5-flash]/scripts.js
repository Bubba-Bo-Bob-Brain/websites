// ========================================
// NEXUS-7 OMNI-SURVEILLANCE PROTOCOL
// Immersive JavaScript Implementation
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
});

// ========================================
// SYSTEM INITIALIZATION
// ========================================
function initializeSystem() {
    startBootSequence();
    initializeNavigation();
    initializeClock();
    initializeSurveillanceFeeds();
    initializeResistanceNetwork();
    initializeTerritoriesMap();
    initializeDataStream();
    initializeAlerts();
    startSystemUpdates();
}

// ========================================
// BOOT SEQUENCE
// ========================================
function startBootSequence() {
    const bootOverlay = document.getElementById('boot-sequence');
    
    // Simulate system boot with delays
    setTimeout(() => {
        bootOverlay.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            bootOverlay.style.display = 'none';
        }, 1000);
    }, 3500);
}

// ========================================
// NAVIGATION SYSTEM
// ========================================
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    
                    // Initialize section-specific content if needed
                    if (targetId === 'resistance') {
                        renderNetworkMap();
                    } else if (targetId === 'territories') {
                        renderTerritoriesMap();
                    }
                }
            });
            
            // Play sound effect (if we had audio)
            // playSound('click');
        });
    });
}

// ========================================
// SYSTEM CLOCK
// ========================================
function initializeClock() {
    const clockElement = document.getElementById('live-clock');
    const timestampElement = document.getElementById('system-timestamp');
    
    function updateClock() {
        const now = new Date();
        
        // Calculate dystopian year (2584)
        // We'll simulate a date in the future
        const year = 2584;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const formatted = `${year}.${month}.${day} // ${hours}:${minutes}:${seconds}`;
        
        if (clockElement) {
            clockElement.textContent = formatted;
        }
        if (timestampElement) {
            timestampElement.textContent = formatted;
        }
    }
    
    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}

// ========================================
// SURVEILLANCE FEED SYSTEM
// ========================================
function initializeSurveillanceFeeds() {
    const feeds = document.querySelectorAll('.camera-feed');
    
    feeds.forEach(feed => {
        const canvas = feed.querySelector('.feed-canvas');
        if (!canvas) return;
        
        // Set canvas dimensions
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Initialize surveillance simulation
        initializeSurveillanceCanvas(canvas, feed.dataset.cam);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newRect = canvas.getBoundingClientRect();
            canvas.width = newRect.width;
            canvas.height = newRect.height;
        });
    });
    
    // Start random number updates
    startRandomNumberUpdates();
}

function initializeSurveillanceCanvas(canvas, camId) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create static noise particles
    const particles = [];
    const numParticles = 50 + Math.random() * 100;
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.7 ? '#ff3333' : '#aaaaaa'
        });
    }
    
    function draw() {
        // Clear with slight fade for motion blur
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw scanlines
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move particle
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        });
        
        // Add random static
        if (Math.random() > 0.95) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const w = Math.random() * 50 + 10;
            const h = Math.random() * 2 + 1;
            ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.3})`;
            ctx.fillRect(x, y, w, h);
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Animation loop
    function animate() {
        draw();
        requestAnimationFrame(animate);
    }
    animate();
}

function startRandomNumberUpdates() {
    const randomValues = document.querySelectorAll('.random-number');
    
    setInterval(() => {
        randomValues.forEach(element => {
            const min = parseInt(element.dataset.min) || 0;
            const max = parseInt(element.dataset.max) || 100;
            const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
            
            // Add a quick transition effect
            element.style.opacity = 0.5;
            setTimeout(() => {
                element.textContent = newValue;
                element.style.opacity = 1;
            }, 50);
        });
    }, 3000);
}

// ========================================
// RESISTANCE NETWORK MAP
// ========================================
let networkData = [];

function initializeResistanceNetwork() {
    generateNetworkData();
    updateNetworkStats();
}

function generateNetworkData() {
    const numCells = 47;
    const statuses = ['active', 'compromised', 'silenced'];
    const statusWeights = [0.25, 0.15, 0.6]; // Probability weights
    
    networkData = [];
    
    for (let i = 0; i < numCells; i++) {
        const rand = Math.random();
        let status;
        if (rand < statusWeights[0]) status = 'active';
        else if (rand < statusWeights[0] + statusWeights[1]) status = 'compromised';
        else status = 'silenced';
        
        networkData.push({
            id: `CELL-${String(i + 1).padStart(3, '0')}`,
            x: Math.random() * 900 + 50,
            y: Math.random() * 500 + 50,
            status: status,
            location: `SECTOR ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 10) + 1}`,
            leader: getRandomName(),
            members: Math.floor(Math.random() * 15) + 2,
            lastContact: getRandomTimeAgo(),
            threatLevel: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)]
        });
    }
    
    // Generate connections between nearby cells
    networkData.forEach((cell, i) => {
        cell.connections = [];
        networkData.forEach((otherCell, j) => {
            if (i !== j) {
                const distance = Math.hypot(cell.x - otherCell.x, cell.y - otherCell.y);
                if (distance < 150 && Math.random() > 0.5) {
                    cell.connections.push(otherCell.id);
                }
            }
        });
    });
}

function getRandomName() {
    const firstNames = ['Kira', 'Marcus', 'Zara', 'Viktor', 'Elara', 'Jax', 'Luna', 'Rook', 'Sage', 'Kael', 'Mira', 'Dax'];
    const lastNames = ['Vance', 'Solo', 'Rook', 'Steel', 'Flux', 'Cipher', 'Nova', 'Vex', 'Shade', 'Wren'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function getRandomTimeAgo() {
    const times = ['2 hours ago', '5 hours ago', '12 hours ago', '1 day ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago'];
    return times[Math.floor(Math.random() * times.length)];
}

function renderNetworkMap() {
    const svg = document.querySelector('.map-svg');
    if (!svg) return;
    
    const connectionsLayer = document.getElementById('connections-layer');
    const nodesLayer = document.getElementById('nodes-layer');
    
    // Clear existing
    connectionsLayer.innerHTML = '';
    nodesLayer.innerHTML = '';
    
    // Draw connections first (so they appear behind nodes)
    networkData.forEach(cell => {
        cell.connections.forEach(connId => {
            const targetCell = networkData.find(c => c.id === connId);
            if (targetCell && cell.x < targetCell.x) { // Only draw once per pair
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', cell.x);
                line.setAttribute('y1', cell.y);
                line.setAttribute('x2', targetCell.x);
                line.setAttribute('y2', targetCell.y);
                line.setAttribute('stroke', '#00aaff');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('stroke-opacity', '0.3');
                line.classList.add('connection-line');
                connectionsLayer.appendChild(line);
                
                // Add animated pulse along the line
                animateConnectionPulse(line);
            }
        });
    });
    
    // Draw nodes
    networkData.forEach(cell => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('node-group');
        group.dataset.cellId = cell.id;
        
        // Outer glow based on status
        const glowSize = cell.status === 'active' ? 8 : (cell.status === 'compromised' ? 6 : 4);
        const glowColor = cell.status === 'active' ? '#00ff66' : (cell.status === 'compromised' ? '#ffaa00' : '#666666');
        
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', cell.x);
        glow.setAttribute('cy', cell.y);
        glow.setAttribute('r', glowSize + 5);
        glow.setAttribute('fill', 'none');
        glow.setAttribute('stroke', glowColor);
        glow.setAttribute('stroke-width', '2');
        glow.setAttribute('opacity', '0.5');
        glow.classList.add('node-glow');
        
        // Main node
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', cell.x);
        node.setAttribute('cy', cell.y);
        node.setAttribute('r', glowSize);
        node.setAttribute('fill', glowColor);
        node.classList.add('node');
        node.style.cursor = 'pointer';
        node.style.transition = 'r 0.3s ease';
        
        // Add pulse animation for active nodes
        if (cell.status === 'active') {
            animateNodePulse(node);
        }
        
        // Node label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cell.x);
        text.setAttribute('y', cell.y + glowSize + 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#a0a0a0');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-family', 'JetBrains Mono, monospace');
        text.textContent = cell.id;
        
        group.appendChild(glow);
        group.appendChild(node);
        group.appendChild(text);
        nodesLayer.appendChild(group);
        
        // Add hover interaction
        group.addEventListener('mouseenter', () => showCellDetails(cell));
        group.addEventListener('mouseleave', () => hideCellDetails());
        group.addEventListener('click', () => selectCell(cell));
    });
    
    // Animate connections periodically
    setInterval(() => {
        const lines = connectionsLayer.querySelectorAll('.connection-line');
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        if (randomLine) {
            animateConnectionPulse(randomLine);
        }
    }, 2000);
}

function animateConnectionPulse(line) {
    const length = Math.hypot(
        parseFloat(line.getAttribute('x2')) - parseFloat(line.getAttribute('x1')),
        parseFloat(line.getAttribute('y2')) - parseFloat(line.getAttribute('y1'))
    );
    
    const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulse.setAttribute('r', '3');
    pulse.setAttribute('fill', '#00aaff');
    pulse.setAttribute('opacity', '1');
    
    const startX = parseFloat(line.getAttribute('x1'));
    const startY = parseFloat(line.getAttribute('y1'));
    const angle = Math.atan2(
        parseFloat(line.getAttribute('y2')) - startY,
        parseFloat(line.getAttribute('x2')) - startX
    );
    
    pulse.setAttribute('cx', startX);
    pulse.setAttribute('cy', startY);
    
    const svg = line.ownerSVGElement;
    svg.appendChild(pulse);
    
    let progress = 0;
    const speed = 0.02;
    
    function animatePulse() {
        progress += speed;
        const x = startX + Math.cos(angle) * length * progress;
        const y = startY + Math.sin(angle) * length * progress;
        
        pulse.setAttribute('cx', x);
        pulse.setAttribute('cy', y);
        pulse.setAttribute('opacity', 1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animatePulse);
        } else {
            pulse.remove();
        }
    }
    animatePulse();
}

function animateNodePulse(node) {
    let scale = 1;
    let growing = true;
    
    function pulse() {
        if (growing) {
            scale += 0.01;
            if (scale >= 1.2) growing = false;
        } else {
            scale -= 0.01;
            if (scale <= 1) growing = true;
        }
        node.setAttribute('r', parseFloat(node.getAttribute('r')) * scale);
        requestAnimationFrame(pulse);
    }
    // Comment out to avoid too much animation
    // pulse();
}

function showCellDetails(cell) {
    const details = document.getElementById('cell-details');
    if (!details) return;
    
    document.getElementById('cell-id').textContent = cell.id;
    document.getElementById('cell-status').textContent = cell.status.toUpperCase();
    document.getElementById('cell-status').style.background = 
        cell.status === 'active' ? '#00ff66' : 
        cell.status === 'compromised' ? '#ffaa00' : '#666666';
    document.getElementById('cell-location').textContent = cell.location;
    document.getElementById('cell-leader').textContent = cell.leader;
    document.getElementById('cell-members').textContent = cell.members;
    document.getElementById('cell-contact').textContent = cell.lastContact;
    document.getElementById('cell-threat').textContent = cell.threatLevel;
    
    details.style.display = 'block';
}

function hideCellDetails() {
    const details = document.getElementById('cell-details');
    if (details) {
        details.style.display = 'none';
    }
}

function selectCell(cell) {
    // Could trigger more detailed view or action
    console.log('Selected cell:', cell);
}

function updateNetworkStats() {
    const stats = {
        total: networkData.length,
        active: networkData.filter(c => c.status === 'active').length,
        compromised: networkData.filter(c => c.status === 'compromised').length,
        silenced: networkData.filter(c => c.status === 'silenced').length
    };
    
    // Animate numbers counting up
    animateValue('total-cells', 0, stats.total, 1000);
    animateValue('active-cells', 0, stats.active, 1000);
    animateValue('compromised-cells', 0, stats.compromised, 1000);
    animateValue('silenced-cells', 0, stats.silenced, 1000);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + range * easeOutQuad(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ========================================
// TERRITORIES MAP
// ========================================
let districts = [];

function initializeTerritoriesMap() {
    generateDistricts();
    renderTerritoriesMap();
}

function generateDistricts() {
    districts = [
        {
            id: 'alpha',
            name: 'ALPHA PRECINCT',
            control: 92,
            population: '2.4M',
            patrols: 347,
            incidents: 12,
            path: 'M 50 50 L 300 50 L 300 250 L 100 300 L 50 200 Z'
        },
        {
            id: 'beta',
            name: 'BETA SECTOR',
            control: 67,
            population: '1.8M',
            patrols: 412,
            incidents: 43,
            path: 'M 300 50 L 600 50 L 550 200 L 300 250 Z'
        },
        {
            id: 'gamma',
            name: 'GAMMA OUTLANDS',
            control: 34,
            population: '0.9M',
            patrols: 128,
            incidents: 87,
            path: 'M 600 50 L 750 50 L 750 250 L 550 200 Z'
        },
        {
            id: 'delta',
            name: 'DELTA INDUSTRIAL',
            control: 78,
            population: '1.2M',
            patrols: 289,
            incidents: 23,
            path: 'M 50 200 L 100 300 L 200 500 L 50 550 Z'
        },
        {
            id: 'epsilon',
            name: 'EPSILON RESIDENTIAL',
            control: 45,
            population: '2.1M',
            patrols: 356,
            incidents: 67,
            path: 'M 100 300 L 300 250 L 350 450 L 200 500 Z'
        },
        {
            id: 'zeta',
            name: 'ZETA COMMERCIAL',
            control: 88,
            population: '1.6M',
            patrols: 278,
            incidents: 8,
            path: 'M 300 250 L 550 200 L 500 400 L 350 450 Z'
        }
    ];
}

function renderTerritoriesMap() {
    const districtsLayer = document.getElementById('districts-layer');
    const labelsLayer = document.getElementById('district-labels');
    if (!districtsLayer || !labelsLayer) return;
    
    districtsLayer.innerHTML = '';
    labelsLayer.innerHTML = '';
    
    districts.forEach(district => {
        // Create district path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', district.path);
        path.setAttribute('fill', getControlColor(district.control));
        path.setAttribute('stroke', '#ff0000');
        path.setAttribute('stroke-width', '2');
        path.style.cursor = 'pointer';
        path.style.transition = 'fill 0.3s ease, transform 0.3s ease';
        path.dataset.district = district.id;
        
        // Add hover effect
        path.addEventListener('mouseenter', () => {
            path.style.transform = 'scale(1.02)';
            path.style.filter = 'drop-shadow(0 0 10px rgba(255,0,0,0.5))';
            highlightTerritoryCard(district.id);
        });
        
        path.addEventListener('mouseleave', () => {
            path.style.transform = 'scale(1)';
            path.style.filter = 'none';
            unhighlightTerritoryCards();
        });
        
        districtsLayer.appendChild(path);
        
        // Add label
        const bbox = path.getBBox();
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', bbox.x + bbox.width / 2);
        text.setAttribute('y', bbox.y + bbox.height / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-family', 'JetBrains Mono, monospace');
        text.setAttribute('pointer-events', 'none');
        text.textContent = district.id.toUpperCase();
        labelsLayer.appendChild(text);
    });
}

function getControlColor(percentage) {
    if (percentage >= 85) return '#ff3333'; // Full control
    if (percentage >= 50) return '#ff9933'; // Partial
    if (percentage >= 20) return '#ffff33'; // Contested
    return '#33ff33'; // Resistance
}

function highlightTerritoryCard(districtId) {
    const cards = document.querySelectorAll('.territory-card');
    cards.forEach(card => {
        if (card.dataset.district === districtId) {
            card.style.borderColor = '#ff3333';
            card.style.boxShadow = '0 0 20px rgba(255,0,0,0.4)';
        }
    });
}

function unhighlightTerritoryCards() {
    const cards = document.querySelectorAll('.territory-card');
    cards.forEach(card => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
    });
}

// ========================================
// CORRUPTED DATA STREAM
// ========================================
let dataStreamActive = true;
let linesProcessed = 1247;
const dataStreamContainer = document.getElementById('data-stream');

function initializeDataStream() {
    if (!dataStreamContainer) return;
    
    // Generate initial data
    for (let i = 0; i < 20; i++) {
        addDataLine();
    }
    
    // Auto-scroll to bottom
    dataStreamContainer.scrollTop = dataStreamContainer.scrollHeight;
    
    // Button handlers
    const pauseBtn = document.getElementById('pause-stream');
    const clearBtn = document.getElementById('clear-stream');
    const downloadBtn = document.getElementById('download-stream');
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            dataStreamActive = !dataStreamActive;
            pauseBtn.textContent = dataStreamActive ? '⏸ PAUSE' : '▶ RESUME';
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            dataStreamContainer.innerHTML = '';
            linesProcessed = 0;
            updateDataStats();
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadDataStream();
        });
    }
    
    // Continuously add data
    setInterval(() => {
        if (dataStreamActive && Math.random() > 0.3) {
            addDataLine();
            updateDataStats();
            
            // Auto-scroll if near bottom
            const isNearBottom = dataStreamContainer.scrollHeight - dataStreamContainer.scrollTop - dataStreamContainer.clientHeight < 100;
            if (isNearBottom) {
                dataStreamContainer.scrollTop = dataStreamContainer.scrollHeight;
            }
        }
    }, 800);
}

function addDataLine() {
    const lineTypes = ['normal', 'corrupted', 'partial', 'redacted', 'encoded'];
    const weights = [0.4, 0.25, 0.15, 0.15, 0.05];
    
    const rand = Math.random();
    let type = 'normal';
    let cumulative = 0;
    
    for (let i = 0; i < lineTypes.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
            type = lineTypes[i];
            break;
        }
    }
    
    const line = document.createElement('div');
    line.className = 'data-line';
    if (type !== 'normal') line.classList.add(type);
    
    const timestamp = `[${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}]`;
    const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let content = '';
    switch(type) {
        case 'normal':
            content = `${timestamp} DATA_PACKET_${hex} :: SECTOR_${Math.floor(Math.random() * 9) + 1} :: STATUS_${['OK', 'STABLE', 'NORMAL'][Math.floor(Math.random() * 3)]} :: SIGNAL_${(Math.random() * 100).toFixed(2)}%`;
            break;
        case 'corrupted':
            content = `${timestamp} █${''.padEnd(20, '█')} CORRUPTION_DETECTED █${''.padEnd(15, '█')} ${Math.random().toString(36).substring(2, 10)}`;
            break;
        case 'partial':
            content = `${timestamp} FRAGMENT_${hex} :: INCOMPLETE_DATA_${Math.floor(Math.random() * 9999)} ... [PARITY_CHECK_FAILED]`;
            break;
        case 'redacted':
            content = `${timestamp} CLASSIFIED_${hex} :: ██████████████████████ :: SUBJECT: [REDACTED] :: CLEARANCE: LEVEL_${Math.floor(Math.random() * 9) + 1}`;
            break;
        case 'encoded':
            const encoded = btoa(Math.random().toString(36).repeat(3)).substring(0, 30);
            content = `${timestamp} ENC:${encoded} :: DEC_KEY:${Math.random().toString(16).substring(2, 10)}`;
            break;
    }
    
    line.textContent = content;
    
    // Insert at random position for more dynamic feel
    const lines = dataStreamContainer.querySelectorAll('.data-line');
    if (lines.length > 0) {
        const insertPos = Math.floor(Math.random() * Math.min(10, lines.length));
        dataStreamContainer.insertBefore(line, lines[insertPos]);
    } else {
        dataStreamContainer.appendChild(line);
    }
    
    // Limit total lines
    while (dataStreamContainer.children.length > 100) {
        dataStreamContainer.removeChild(dataStreamContainer.firstChild);
    }
    
    linesProcessed++;
}

function updateDataStats() {
    const processedEl = document.getElementById('lines-processed');
    const corruptionEl = document.getElementById('corruption-rate');
    const decryptFill = document.getElementById('decrypt-fill');
    const decryptValue = document.getElementById('decrypt-value');
    
    if (processedEl) processedEl.textContent = linesProcessed.toLocaleString();
    if (corruptionEl) corruptionEl.textContent = `${Math.floor(75 + Math.random() * 20)}%`;
    
    // Slowly increase decryption progress
    const currentProgress = parseFloat(decryptFill.style.width) || 23;
    if (currentProgress < 100) {
        const newProgress = Math.min(currentProgress + 0.1, 100);
        decryptFill.style.width = `${newProgress}%`;
        decryptValue.textContent = `${newProgress.toFixed(1)}%`;
    }
}

function downloadDataStream() {
    const content = Array.from(dataStreamContainer.querySelectorAll('.data-line'))
        .map(line => line.textContent)
        .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus7_corrupted_data_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ========================================
// ALERT SYSTEM
// ========================================
function initializeAlerts() {
    const modal = document.getElementById('alert-modal');
    const acknowledgeBtn = document.getElementById('alert-acknowledge');
    const detailsBtn = document.getElementById('alert-details');
    
    if (acknowledgeBtn) {
        acknowledgeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            // Navigate to surveillance section
            document.querySelector('[data-target="surveillance"]').click();
            modal.classList.remove('active');
        });
    }
    
    // Random alerts
    setInterval(() => {
        if (Math.random() > 0.98) { // 2% chance every interval
            triggerRandomAlert();
        }
    }, 10000);
}

function triggerRandomAlert() {
    const alerts = [
        'Unauthorized access attempt detected from Sector 7-G.',
        'Resistance communication intercepted. Encrypting...',
        'Perimeter breach alert: Gate Delta compromised.',
        'Loyalty index dropping in Beta Sector. Deploy patrols.',
        'Surveillance drone offline in Alpha Precinct.',
        'Data corruption spreading through Network Node 12.',
        'Citizen non-compliance detected: Block C-9.',
        'Unusual energy signature detected in Gamma Outlands.'
    ];
    
    const alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
        alertMessage.textContent = alerts[Math.floor(Math.random() * alerts.length)];
    }
    
    const modal = document.getElementById('alert-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

// ========================================
// SYSTEM-WIDE UPDATES
// ========================================
function startSystemUpdates() {
    // Update loyalty meter periodically
    setInterval(() => {
        const meterFill = document.querySelector('.meter-fill');
        if (meterFill) {
            const currentWidth = parseFloat(meterFill.style.width) || 73;
            const change = (Math.random() - 0.5) * 4; // Random change between -2 and +2
            const newWidth = Math.max(20, Math.min(100, currentWidth + change));
            meterFill.style.width = `${newWidth}%`;
            meterFill.nextElementSibling.textContent = `${newWidth.toFixed(0)}%`;
        }
    }, 5000);
    
    // Randomly update control percentages in territory cards
    setInterval(() => {
        const cards = document.querySelectorAll('.territory-card');
        cards.forEach(card => {
            const fill = card.querySelector('.control-fill');
            const percentSpan = card.querySelector('.control-percent');
            if (fill && percentSpan) {
                const currentWidth = parseFloat(fill.style.width);
                const change = Math.floor((Math.random() - 0.5) * 5);
                const newWidth = Math.max(10, Math.min(100, currentWidth + change));
                fill.style.width = `${newWidth}%`;
                
                // Update percentage text and color
                percentSpan.textContent = `${newWidth}%`;
                percentSpan.className = 'control-percent';
                if (newWidth < 50) percentSpan.classList.add('danger');
                else if (newWidth < 85) percentSpan.classList.add('warning');
            }
        });
    }, 8000);
    
    // Simulate occasional camera feed alerts
    setInterval(() => {
        const feeds = document.querySelectorAll('.camera-feed');
        const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
        const alertBox = randomFeed.querySelector('.alert-box');
        
        if (alertBox && Math.random() > 0.7) {
            alertBox.style.display = 'flex';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }
    }, 15000);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth parallax effect on mouse move for header
document.addEventListener('mousemove', (e) => {
    const header = document.querySelector('.header-section');
    if (header) {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        header.style.transform = `perspective(1000px) rotateY(${x * 0.1}deg) rotateX(${-y * 0.1}deg)`;
    }
});

// Easter egg: Konami code reveals hidden message
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    const body = document.body;
    body.style.animation = 'rainbow-bg 5s infinite alternate';
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        body.style.animation = '';
        style.remove();
    }, 5000);
}

// Initialize everything when DOM is ready
// (Already handled by DOMContentLoaded listener at top)
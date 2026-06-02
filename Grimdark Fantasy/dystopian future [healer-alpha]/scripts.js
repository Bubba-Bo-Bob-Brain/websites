/* ============================================
   NEXUS COMMAND - GRIMDARK DYSTOPIAN INTERFACE
   Interactive Systems & Animations
   ============================================ */

// ============================================
// GLOBAL STATE AND CONFIGURATION
// ============================================
const CONFIG = {
    bootDuration: 2500,
    clockUpdateInterval: 1000,
    dataStreamInterval: 1500,
    glitchChance: 0.02,
    warningChance: 0.001,
    nodeCount: 12,
    cameraCount: 6,
    audioBarCount: 32
};

const STATE = {
    isBooting: true,
    isPaused: false,
    currentDocument: 0,
    activeFilter: 'all',
    terminalHistory: [],
    revealedRedactions: new Set()
};

// ============================================
// REDACTED CONTENT DATABASE
// ============================================
const REDACTED_DOCUMENTS = [
    {
        id: 'DOC-7741-Ω',
        content: [
            'PROJECT <span class="redacted" data-reveal="PROMETHEUS">[REDACTED]</span> IS NOW IN PHASE 3.',
            'ALL CITIZENS IN SECTORS <span class="redacted" data-reveal="7, 12, 19">[REDACTED]</span> MUST REPORT FOR MANDATORY NEURAL CALIBRATION.',
            'RESISTANCE ACTIVITY IN ZONE <span class="redacted" data-reveal="NEXUS-PRIME">[REDACTED]</span> HAS BEEN NEUTRALIZED.',
            'THE COLLECTIVE\'S VISION REMAINS <span class="redacted" data-reveal="ABSOLUTE AND ETERNAL">[REDACTED]</span>.'
        ]
    },
    {
        id: 'DOC-9923-Σ',
        content: [
            'SUBJECT <span class="redacted" data-reveal="DR. ELARA VOSS">[REDACTED]</span> HAS BEEN DESIGNATED FOR IMMEDIATE RETRIEVAL.',
            'NEURAL IMPLANT PROTOTYPE <span class="redacted" data-reveal="MK-VII OMEGA">[REDACTED]</span> APPROVED FOR FIELD DEPLOYMENT.',
            'CIVILIAN CASUALTY PROJECTION: <span class="redacted" data-reveal="12,847">[REDACTED]</span> UNITS ACCEPTABLE.',
            'AUTHORIZATION CODE: <span class="redacted" data-reveal="OBSIDIAN-7-THETA">[REDACTED]</span> — DESTROY AFTER READING.'
        ]
    },
    {
        id: 'DOC-3345-Δ',
        content: [
            'SURVEILLANCE INDICATES RESISTANCE CELL <span class="redacted" data-reveal="NIGHTBLOOM">[REDACTED]</span> OPERATING IN SECTOR 9.',
            'RECOMMEND ACTIVATION OF PROTOCOL <span class="redacted" data-reveal="SCORCHED EARTH">[REDACTED]</span> IMMEDIATELY.',
            'INFORMANT STATUS: <span class="redacted" data-reveal="COMPROMISED - TERMINATE">[REDACTED]</span>',
            'THE FUTURE BELONGS TO <span class="redacted" data-reveal="UTOPIA ALONE">[REDACTED]</span>.'
        ]
    }
];

// ============================================
// TERMINAL COMMANDS DATABASE
// ============================================
const TERMINAL_COMMANDS = {
    'help': {
        response: 'AVAILABLE COMMANDS: help, status, scan, locate, decrypt, purge, observe, override, classify'
    },
    'status': {
        response: () => `SYSTEM STATUS:
    NETWORK INTEGRITY: ${Math.floor(Math.random() * 20 + 80)}%
    SURVEILLANCE UPTIME: ${(Math.random() * 5 + 95).toFixed(1)}%
    RESISTANCE THREAT: ${['LOW', 'MODERATE', 'ELEVATED', 'CRITICAL'][Math.floor(Math.random() * 4)]}
    LAST PURGE: ${Math.floor(Math.random() * 48 + 1)}H AGO`
    },
    'scan': {
        response: () => `INITIATING DEEP SCAN...
    SCANNING SECTOR ALPHA... ${Math.random() > 0.7 ? 'ANOMALY DETECTED' : 'CLEAR'}
    SCANNING SECTOR BETA... ${Math.random() > 0.8 ? 'ANOMALY DETECTED' : 'CLEAR'}
    SCANNING SECTOR GAMMA... ${Math.random() > 0.6 ? 'ANOMALY DETECTED' : 'CLEAR'}
    SCAN COMPLETE. ${Math.floor(Math.random() * 5)} POTENTIAL THREATS IDENTIFIED.`
    },
    'locate': {
        response: () => {
            const targets = ['RESISTANCE CELL DELTA', 'INFORMANT 7-CHARLIE', 'ASSET NIGHTSHADE', 'TARGET OMEGA'];
            return `LOCATING TARGET...
    TARGET: ${targets[Math.floor(Math.random() * targets.length)]}
    LAST KNOWN POSITION: SECTOR ${Math.floor(Math.random() * 12 + 1)}, BLOCK ${Math.floor(Math.random() * 100)}
    STATUS: ${Math.random() > 0.5 ? 'MOVING — TRACKING ACTIVE' : 'STATIC — MONITORING'}`;
        }
    },
    'decrypt': {
        response: 'DECRYPTION PROTOCOL INITIATED...\n    AES-256 CIPHER DETECTED\n    APPLYING QUANTUM RESISTANT ALGORITHMS...\n    PARTIAL SUCCESS — 73.2% RECOVERED'
    },
    'purge': {
        response: '⚠️  PURGE REQUIRES ADMINISTRATOR AUTHORIZATION\n    USE "override" COMMAND TO BYPASS SECURITY'
    },
    'override': {
        response: '🔐 OVERRIDE CODE ACCEPTED\n    ADMINISTRATOR ACCESS GRANTED\n    PURGE AUTHORIZED — EXECUTE WITH CAUTION'
    },
    'observe': {
        response: () => `OBSERVATION FEED...
    SUBJECT COUNT: ${Math.floor(Math.random() * 500 + 100)}
    COMPLIANCE RATE: ${Math.floor(Math.random() * 15 + 85)}%
    ANOMALOUS BEHAVIOR: ${Math.floor(Math.random() * 10)} INSTANCES`
    },
    'classify': {
        response: 'CLASSIFICATION LEVEL: OBSIDIAN\n    ACCESS REQUIREMENTS: MINISTERIAL CLEARANCE\n    RETENTION: PERMANENT — NO DELETION'
    }
};

// ============================================
// SURVEILLANCE CAMERA DATA
// ============================================
const CAMERA_FEEDS = [
    { id: 'CAM-A1', sector: 'sector-a', location: 'MAIN GATE', status: 'active' },
    { id: 'CAM-A2', sector: 'sector-a', location: 'PLAZA NORTH', status: 'active' },
    { id: 'CAM-A3', sector: 'sector-a', location: 'TRANSIT HUB', status: 'warning' },
    { id: 'CAM-B1', sector: 'sector-b', location: 'SECTOR B-7', status: 'active' },
    { id: 'CAM-B2', sector: 'sector-b', location: 'RESTRICTED', status: 'danger' },
    { id: 'CAM-R1', sector: 'restricted', location: 'OMEGA LAB', status: 'active' }
];

// ============================================
// RESISTANCE NETWORK NODES
// ============================================
const NETWORK_NODES = [
    { id: 1, x: 15, y: 20, status: 'active', name: 'ALPHA-1' },
    { id: 2, x: 30, y: 35, status: 'active', name: 'BETA-2' },
    { id: 3, x: 45, y: 15, status: 'encrypted', name: 'GAMMA-3' },
    { id: 4, x: 60, y: 45, status: 'active', name: 'DELTA-4' },
    { id: 5, x: 75, y: 25, status: 'compromised', name: 'EPSILON-5' },
    { id: 6, x: 25, y: 60, status: 'active', name: 'ZETA-6' },
    { id: 7, x: 50, y: 70, status: 'encrypted', name: 'ETA-7' },
    { id: 8, x: 85, y: 55, status: 'active', name: 'THETA-8' },
    { id: 9, x: 40, y: 50, status: 'active', name: 'IOTA-9' },
    { id: 10, x: 70, y: 75, status: 'compromised', name: 'KAPPA-10' },
    { id: 11, x: 20, y: 80, status: 'active', name: 'LAMBDA-11' },
    { id: 12, x: 55, y: 30, status: 'encrypted', name: 'MU-12' }
];

const NETWORK_CONNECTIONS = [
    [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7],
    [7, 8], [4, 9], [9, 7], [8, 10], [6, 11], [3, 12],
    [12, 4], [9, 12], [1, 6]
];

// ============================================
// DATA STREAM CONTENT
// ============================================
const DATA_STREAM_CONTENT = [
    { type: 'encrypted', content: '0x7F3A 9B2C E4D1 FF88 0012...' },
    { type: 'encrypted', content: 'CIPHER_BLOCK: AES256 [===========]' },
    { type: 'decrypted', content: '> TRANSMISSION: "NIGHTFALL PROCEEDS AS SCHEDULED"' },
    { type: 'warning', content: '⚠ ANOMALY DETECTED IN SECTOR 7' },
    { type: 'encrypted', content: '0xA1B2 C3D4 E5F6 0718 293A...' },
    { type: 'error', content: '✖ CONNECTION LOST: NODE-5587' },
    { type: 'decrypted', content: '> COORDINATES: 47.3891°N, 8.5247°E' },
    { type: 'encrypted', content: 'QUANTUM_KEY: ████████████ ACTIVE' },
    { type: 'decrypted', content: '> MESSAGE: "THE OWL FLIES AT MIDNIGHT"' },
    { type: 'warning', content: '⚠ ENCRYPTION STRENGTH: DEGRADED' },
    { type: 'encrypted', content: 'PKT_SEQ: 0x8F2A7B1C FRAG: 0x00' },
    { type: 'decrypted', content: '> STATUS: CELL-7 INTEGRITY COMPROMISED' },
    { type: 'error', content: '✖ TRACE DETECTED — INITIATING COUNTERMEASURES' },
    { type: 'encrypted', content: '0xFFEE DDCC BBAA 9988 7766...' },
    { type: 'decrypted', content: '> DIRECTIVE: EVACUATE TO SAFEHOUSE OMEGA' }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
});

function initializeSystem() {
    // Start boot sequence
    setTimeout(() => {
        completeBootSequence();
    }, CONFIG.bootDuration);

    // Initialize all systems
    initializeClock();
    initializeAudioVisualizer();
    initializeSurveillanceGrid();
    initializeResistanceMap();
    initializeDataStream();
    initializeFactionDisplay();
    initializeDocumentViewer();
    initializeTerminal();
    initializeEventListeners();
    startRandomEffects();
}

// ============================================
// BOOT SEQUENCE
// ============================================
function completeBootSequence() {
    const bootOverlay = document.getElementById('bootOverlay');
    bootOverlay.classList.add('fade-out');
    
    setTimeout(() => {
        bootOverlay.style.display = 'none';
        STATE.isBooting = false;
        
        // Trigger initial warning after boot
        setTimeout(() => {
            showWarningModal();
        }, 5000);
    }, 1000);
}

// ============================================
// SYSTEM CLOCK
// ============================================
function initializeClock() {
    updateClock();
    setInterval(updateClock, CONFIG.clockUpdateInterval);
}

function updateClock() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    
    const systemClock = document.getElementById('systemClock');
    const lastUpdate = document.getElementById('lastUpdate');
    
    if (systemClock) systemClock.textContent = timeString;
    if (lastUpdate) lastUpdate.textContent = timeString;
}

// ============================================
// AUDIO VISUALIZER
// ============================================
function initializeAudioVisualizer() {
    const visualizer = document.getElementById('audioVisualizer');
    if (!visualizer) return;

    // Create audio bars
    for (let i = 0; i < CONFIG.audioBarCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        bar.style.height = '5px';
        visualizer.appendChild(bar);
    }

    // Animate audio bars
    animateAudioBars();
}

function animateAudioBars() {
    const bars = document.querySelectorAll('.audio-bar');
    
    function animate() {
        bars.forEach((bar, index) => {
            const height = Math.random() * 35 + 5;
            bar.style.height = `${height}px`;
        });
        
        if (!STATE.isPaused) {
            requestAnimationFrame(() => {
                setTimeout(animate, 100);
            });
        }
    }
    
    animate();
}

// ============================================
// SURVEILLANCE GRID
// ============================================
function initializeSurveillanceGrid() {
    const grid = document.getElementById('surveillanceGrid');
    if (!grid) return;

    CAMERA_FEEDS.forEach((camera, index) => {
        const feed = createCameraFeed(camera, index);
        grid.appendChild(feed);
    });
}

function createCameraFeed(camera, index) {
    const feed = document.createElement('div');
    feed.className = `camera-feed ${camera.status === 'danger' ? 'compromised' : ''}`;
    feed.dataset.sector = camera.sector;
    feed.dataset.id = camera.id;
    
    const statusClass = camera.status === 'active' ? '' : 
                        camera.status === 'warning' ? 'warning' : 'danger';
    
    feed.innerHTML = `
        <div class="camera-number">${camera.id}</div>
        <div class="camera-status ${statusClass}"></div>
        <div class="camera-feed-content">
            <span>${camera.location}</span>
        </div>
        <div class="camera-feed-static"></div>
    `;
    
    // Add click event for full view
    feed.addEventListener('click', () => {
        selectCameraFeed(feed, camera);
    });
    
    // Random glitch effect for compromised cameras
    if (camera.status === 'danger') {
        setInterval(() => {
            if (Math.random() > 0.7) {
                feed.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    feed.style.transform = '';
                }, 100);
            }
        }, 500);
    }
    
    return feed;
}

function selectCameraFeed(feedElement, camera) {
    // Remove previous selection
    document.querySelectorAll('.camera-feed.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    feedElement.classList.add('selected');
    
    // Could expand feed or show details
    console.log(`Selected camera: ${camera.id} at ${camera.location}`);
}

// ============================================
// RESISTANCE NETWORK MAP
// ============================================
function initializeResistanceMap() {
    const mapContainer = document.getElementById('resistanceMap');
    if (!mapContainer) return;

    const nodesContainer = mapContainer.querySelector('.map-nodes');
    const connectionsContainer = mapContainer.querySelector('.map-connections');
    
    // Create connections first (so they appear behind nodes)
    NETWORK_CONNECTIONS.forEach(([fromId, toId]) => {
        const fromNode = NETWORK_NODES.find(n => n.id === fromId);
        const toNode = NETWORK_NODES.find(n => n.id === toId);
        
        if (fromNode && toNode) {
            const connection = createConnection(fromNode, toNode);
            connectionsContainer.appendChild(connection);
        }
    });
    
    // Create nodes
    NETWORK_NODES.forEach(node => {
        const nodeElement = createMapNode(node);
        nodesContainer.appendChild(nodeElement);
    });
}

function createMapNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = `map-node ${node.status}`;
    nodeElement.style.left = `${node.x}%`;
    nodeElement.style.top = `${node.y}%`;
    nodeElement.dataset.nodeId = node.id;
    nodeElement.title = node.name;
    
    // Add tooltip on hover
    nodeElement.addEventListener('mouseenter', (e) => {
        showNodeTooltip(e, node);
    });
    
    nodeElement.addEventListener('mouseleave', () => {
        hideNodeTooltip();
    });
    
    // Random pulsing for active nodes
    if (node.status === 'active') {
        nodeElement.style.animation = `pulse 2s infinite ${Math.random() * 2}s`;
    }
    
    return nodeElement;
}

function createConnection(fromNode, toNode) {
    const connection = document.createElement('div');
    connection.className = 'map-connection';
    
    const container = document.getElementById('resistanceMap');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    const x1 = (fromNode.x / 100) * containerWidth;
    const y1 = (fromNode.y / 100) * containerHeight;
    const x2 = (toNode.x / 100) * containerWidth;
    const y2 = (toNode.y / 100) * containerHeight;
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    connection.style.width = `${length}px`;
    connection.style.left = `${fromNode.x}%`;
    connection.style.top = `${fromNode.y}%`;
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.animationDelay = `${Math.random() * 2}s`;
    
    return connection;
}

function showNodeTooltip(event, node) {
    const existingTooltip = document.querySelector('.node-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'node-tooltip';
    tooltip.innerHTML = `
        <strong>${node.name}</strong><br>
        STATUS: ${node.status.toUpperCase()}<br>
        ID: NODE-${String(node.id).padStart(3, '0')}
    `;
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(10, 10, 15, 0.95);
        border: 1px solid var(--neon-blue);
        padding: 8px 12px;
        font-size: 0.75rem;
        color: var(--text-primary);
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 15px var(--neon-blue-glow);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width + 10}px`;
    tooltip.style.top = `${rect.top}px`;
}

function hideNodeTooltip() {
    const tooltip = document.querySelector('.node-tooltip');
    if (tooltip) tooltip.remove();
}

// ============================================
// DATA STREAM
// ============================================
function initializeDataStream() {
    addDataStreamLine();
    setInterval(addDataStreamLine, CONFIG.dataStreamInterval);
}

function addDataStreamLine() {
    const stream = document.getElementById('dataStream');
    if (!stream) return;
    
    const content = DATA_STREAM_CONTENT[Math.floor(Math.random() * DATA_STREAM_CONTENT.length)];
    const line = document.createElement('div');
    line.className = `data-line ${content.type}`;
    line.textContent = content.content;
    
    stream.appendChild(line);
    
    // Auto-scroll to bottom
    stream.scrollTop = stream.scrollHeight;
    
    // Remove old lines if too many
    const lines = stream.querySelectorAll('.data-line');
    if (lines.length > 50) {
        lines[0].remove();
    }
}

// ============================================
// FACTION TERRITORY DISPLAY
// ============================================
function initializeFactionDisplay() {
    const display = document.getElementById('factionDisplay');
    if (!display) return;
    
    const territoryMap = document.createElement('div');
    territoryMap.className = 'territory-map';
    
    // Define territory zones
    const territories = [
        { name: 'ALPHA', type: 'utopia', x: 5, y: 5, width: 35, height: 40 },
        { name: 'BETA', type: 'utopia', x: 45, y: 5, width: 50, height: 30 },
        { name: 'GAMMA', type: 'contested', x: 5, y: 50, width: 25, height: 45 },
        { name: 'DELTA', type: 'resistance', x: 35, y: 40, width: 30, height: 35 },
        { name: 'EPSILON', type: 'utopia', x: 70, y: 40, width: 25, height: 55 },
        { name: 'ZETA', type: 'resistance', x: 35, y: 80, width: 30, height: 15 }
    ];
    
    territories.forEach(territory => {
        const zone = document.createElement('div');
        zone.className = `territory-zone ${territory.type}`;
        zone.style.left = `${territory.x}%`;
        zone.style.top = `${territory.y}%`;
        zone.style.width = `${territory.width}%`;
        zone.style.height = `${territory.height}%`;
        zone.textContent = territory.name;
        
        zone.addEventListener('click', () => {
            showTerritoryInfo(territory);
        });
        
        territoryMap.appendChild(zone);
    });
    
    display.insertBefore(territoryMap, display.firstChild);
}

function showTerritoryInfo(territory) {
    const info = {
        utopia: { control: 'UTOPIA COLLECTIVE', strength: 'HEAVY GARRISON', threat: 'LOW' },
        resistance: { control: 'SHADOW RESISTANCE', strength: 'CELL OPERATIONS', threat: 'HIGH' },
        contested: { control: 'DISPUTED', strength: 'FLUCTUATING', threat: 'EXTREME' }
    };
    
    console.log(`Territory: ${territory.name}`);
    console.log(`Control: ${info[territory.type].control}`);
    console.log(`Garrison: ${info[territory.type].strength}`);
    console.log(`Threat Level: ${info[territory.type].threat}`);
}

// ============================================
// DOCUMENT VIEWER
// ============================================
function initializeDocumentViewer() {
    loadDocument(STATE.currentDocument);
    
    const revealBtn = document.getElementById('revealBtn');
    const nextDocBtn = document.getElementById('nextDocBtn');
    
    if (revealBtn) {
        revealBtn.addEventListener('click', revealRedacted);
    }
    
    if (nextDocBtn) {
        nextDocBtn.addEventListener('click', nextDocument);
    }
    
    // Add click handlers to redacted elements
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('redacted')) {
            toggleRedaction(e.target);
        }
    });
}

function loadDocument(index) {
    const doc = REDACTED_DOCUMENTS[index];
    const viewer = document.getElementById('documentViewer');
    if (!viewer) return;
    
    const docId = viewer.querySelector('.doc-id');
    const docText = viewer.querySelector('.document-text');
    
    if (docId) docId.textContent = doc.id;
    if (docText) {
        docText.innerHTML = doc.content.map(p => `<p>${p}</p>`).join('');
    }
    
    STATE.currentDocument = index;
}

function revealRedacted() {
    const redactedElements = document.querySelectorAll('.document-text .redacted');
    redactedElements.forEach(el => {
        const revealText = el.dataset.reveal;
        if (revealText) {
            el.textContent = revealText;
            el.classList.add('revealed');
            el.classList.remove('redacted');
        }
    });
}

function toggleRedaction(element) {
    const revealText = element.dataset.reveal;
    if (!revealText) return;
    
    if (element.classList.contains('revealed')) {
        element.textContent = '[REDACTED]';
        element.classList.remove('revealed');
        element.classList.add('redacted');
    } else {
        element.textContent = revealText;
        element.classList.add('revealed');
        element.classList.remove('redacted');
    }
}

function nextDocument() {
    const nextIndex = (STATE.currentDocument + 1) % REDACTED_DOCUMENTS.length;
    loadDocument(nextIndex);
}

// ============================================
// COMMAND TERMINAL
// ============================================
function initializeTerminal() {
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    
    if (!input || !output) return;
    
    // Initial welcome message
    addTerminalLine('NEXUS COMMAND TERMINAL v3.7.2', 'success');
    addTerminalLine('Type "help" for available commands.', 'response');
    addTerminalLine('', 'response');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(input.value.trim());
            input.value = '';
        }
    });
}

function processCommand(command) {
    if (!command) return;
    
    addTerminalLine(`> ${command}`, 'command');
    STATE.terminalHistory.push(command);
    
    const cmd = command.toLowerCase();
    
    if (cmd === 'clear') {
        document.getElementById('terminalOutput').innerHTML = '';
        return;
    }
    
    if (TERMINAL_COMMANDS[cmd]) {
        const response = TERMINAL_COMMANDS[cmd].response;
        const responseText = typeof response === 'function' ? response() : response;
        responseText.split('\n').forEach(line => {
            addTerminalLine(line, 'response');
        });
    } else {
        addTerminalLine(`ERROR: Unknown command "${command}"`, 'error');
        addTerminalLine('Type "help" for available commands.', 'response');
    }
    
    // Scroll to bottom
    const output = document.getElementById('terminalOutput');
    output.scrollTop = output.scrollHeight;
}

function addTerminalLine(text, type = 'response') {
    const output = document.getElementById('terminalOutput');
    if (!output) return;
    
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    output.appendChild(line);
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Surveillance filter buttons
    document.querySelectorAll('.surveillance-controls .control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterSurveillance(filter);
            
            // Update active state
            document.querySelectorAll('.surveillance-controls .control-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
        });
    });
    
    // Panel control buttons
    document.querySelectorAll('.control-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handlePanelAction(action, btn);
        });
    });
    
    // Warning modal acknowledgment
    const acknowledgeBtn = document.getElementById('acknowledgeBtn');
    if (acknowledgeBtn) {
        acknowledgeBtn.addEventListener('click', hideWarningModal);
    }
    
    // Pause/resume functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.target.tagName !== 'INPUT') {
            STATE.isPaused = !STATE.isPaused;
            if (!STATE.isPaused) {
                animateAudioBars();
            }
        }
    });
}

function filterSurveillance(filter) {
    STATE.activeFilter = filter;
    
    document.querySelectorAll('.camera-feed').forEach(feed => {
        if (filter === 'all' || feed.dataset.sector === filter) {
            feed.style.display = '';
        } else {
            feed.style.display = 'none';
        }
    });
}

function handlePanelAction(action, button) {
    switch (action) {
        case 'mute':
            button.textContent = button.textContent === '🔇' ? '🔊' : '🔇';
            break;
        case 'fullscreen':
            const panel = button.closest('.panel');
            if (panel) {
                panel.requestFullscreen?.() || panel.webkitRequestFullscreen?.();
            }
            break;
        case 'decrypt':
            addDataStreamLine();
            addDataStreamLine();
            addDataStreamLine();
            break;
        case 'pause':
            STATE.isPaused = !STATE.isPaused;
            button.textContent = STATE.isPaused ? '▶' : '⏸';
            break;
    }
}

// ============================================
// RANDOM EFFECTS
// ============================================
function startRandomEffects() {
    // Random glitch effect
    setInterval(() => {
        if (Math.random() < CONFIG.glitchChance) {
            triggerGlitchEffect();
        }
    }, 1000);
    
    // Random warning
    setInterval(() => {
        if (Math.random() < CONFIG.warningChance && !STATE.isBooting) {
            showWarningModal();
        }
    }, 5000);
    
    // Random node status change
    setInterval(() => {
        if (Math.random() < 0.1) {
            updateRandomNodeStatus();
        }
    }, 10000);
}

function triggerGlitchEffect() {
    const overlay = document.getElementById('corruptedOverlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 200 + Math.random() * 300);
}

function showWarningModal() {
    const modal = document.getElementById('warningModal');
    if (!modal || STATE.isBooting) return;
    
    modal.classList.add('active');
    
    // Play glitch effect
    triggerGlitchEffect();
}

function hideWarningModal() {
    const modal = document.getElementById('warningModal');
    if (!modal) return;
    
    modal.classList.remove('active');
}

function updateRandomNodeStatus() {
    const nodes = document.querySelectorAll('.map-node');
    if (nodes.length === 0) return;
    
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    const statuses = ['active', 'compromised', 'encrypted'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Remove all status classes
    statuses.forEach(s => randomNode.classList.remove(s));
    randomNode.classList.add(newStatus);
    
    // Update color based on status
    switch (newStatus) {
        case 'active':
            randomNode.style.background = 'var(--neon-green)';
            randomNode.style.boxShadow = '0 0 15px var(--neon-green-glow)';
            break;
        case 'compromised':
            randomNode.style.background = 'var(--neon-red)';
            randomNode.style.boxShadow = '0 0 15px var(--neon-red-glow)';
            break;
        case 'encrypted':
            randomNode.style.background = 'var(--neon-blue)';
            randomNode.style.boxShadow = '0 0 15px var(--neon-blue-glow)';
            break;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function formatTime(date) {
    return date.toTimeString().split(' ')[0];
}

// ============================================
// EXPORT FOR DEBUGGING
// ============================================
window.NEXUS = {
    STATE,
    CONFIG,
    triggerGlitchEffect,
    showWarningModal,
    addTerminalLine,
    processCommand
};
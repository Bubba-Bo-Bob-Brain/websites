/* ============================================
   NEXUS PROTOCOL - GRIMDARK DYSTOPIAN TERMINAL
   JavaScript Controller
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initClock();
    initNetworkMap();
    initTerritoryMap();
    initDataStream();
    initResistanceEmblem();
    initTypingCommand();
    initGlitchEffects();
    initSurveillanceEffects();
});

/* ============================================
   BOOT SEQUENCE
   ============================================ */
function initBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const terminal = document.querySelector('.terminal-container');
    
    setTimeout(() => {
        bootScreen.classList.add('hidden');
        terminal.style.opacity = '1';
    }, 3500);
}

/* ============================================
   REAL-TIME CLOCK
   ============================================ */
function initClock() {
    const timeElement = document.getElementById('current-time');
    const territoryTime = document.getElementById('territory-time');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        if (territoryTime) {
            territoryTime.textContent = `${hours}:${minutes}`;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

/* ============================================
   NETWORK MAP - Canvas Animation
   ============================================ */
function initNetworkMap() {
    const container = document.getElementById('network-map');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Node types
    const NODE_TYPES = {
        ACTIVE: 'active',
        COMPROMISED: 'compromised',
        DARK: 'dark'
    };
    
    // Colors
    const colors = {
        active: '#00ff41',
        activeGlow: 'rgba(0, 255, 65, 0.3)',
        compromised: '#ff0040',
        compromisedGlow: 'rgba(255, 0, 64, 0.3)',
        dark: '#505050',
        link: '#00d4ff',
        linkGlow: 'rgba(0, 212, 255, 0.2)',
        bg: '#0a0a0a'
    };
    
    // Create nodes
    const nodes = [];
    const nodeCount = 25;
    
    for (let i = 0; i < nodeCount; i++) {
        const rand = Math.random();
        let type;
        if (rand < 0.6) type = NODE_TYPES.ACTIVE;
        else if (rand < 0.85) type = NODE_TYPES.COMPROMISED;
        else type = NODE_TYPES.DARK;
        
        nodes.push({
            id: i,
            x: 50 + Math.random() * (canvas.width - 100),
            y: 50 + Math.random() * (canvas.height - 100),
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            type: type,
            radius: type === NODE_TYPES.DARK ? 4 : 6,
            pulsePhase: Math.random() * Math.PI * 2,
            name: generateNodeName(type)
        });
    }
    
    // Create connections between nearby nodes
    const connections = [];
    const maxDistance = 150;
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < maxDistance && Math.random() > 0.5) {
                connections.push({
                    from: i,
                    to: j,
                    strength: 1 - (dist / maxDistance),
                    dataFlow: Math.random(),
                    flowSpeed: 0.01 + Math.random() * 0.02
                });
            }
        }
    }
    
    // Update stats
    const activeNodes = nodes.filter(n => n.type === NODE_TYPES.ACTIVE).length;
    document.getElementById('active-nodes').textContent = activeNodes;
    document.getElementById('encrypted-traffic').textContent = Math.floor(1000 + Math.random() * 5000);
    document.getElementById('network-latency').textContent = Math.floor(15 + Math.random() * 50);
    
    // Animation loop
    let animationFrame;
    
    function animate() {
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        drawGrid(ctx, canvas.width, canvas.height);
        
        // Update and draw connections
        connections.forEach(conn => {
            conn.dataFlow += conn.flowSpeed;
            if (conn.dataFlow > 1) conn.dataFlow = 0;
            
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            
            drawConnection(ctx, fromNode, toNode, conn, colors);
        });
        
        // Update and draw nodes
        nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 30 || node.x > canvas.width - 30) node.vx *= -1;
            if (node.y < 30 || node.y > canvas.height - 30) node.vy *= -1;
            
            node.pulsePhase += 0.05;
            
            drawNode(ctx, node, colors);
        });
        
        // Update stats periodically
        if (Math.random() < 0.01) {
            document.getElementById('encrypted-traffic').textContent = Math.floor(1000 + Math.random() * 5000);
            document.getElementById('network-latency').textContent = Math.floor(15 + Math.random() * 50);
        }
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
    
    // Tooltip on hover
    const tooltip = document.getElementById('node-tooltip');
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let hoveredNode = null;
        nodes.forEach(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < 15) {
                hoveredNode = node;
            }
        });
        
        if (hoveredNode) {
            tooltip.innerHTML = `
                <strong>NODE_${hoveredNode.id.toString().padStart(3, '0')}</strong><br>
                STATUS: ${hoveredNode.type.toUpperCase()}<br>
                ID: ${hoveredNode.name}
            `;
            tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    });
}

function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawConnection(ctx, from, to, conn, colors) {
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, colors.linkGlow);
    gradient.addColorStop(0.5, colors.link);
    gradient.addColorStop(1, colors.linkGlow);
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 + conn.strength;
    ctx.stroke();
    
    // Data flow particle
    const px = from.x + (to.x - from.x) * conn.dataFlow;
    const py = from.y + (to.y - from.y) * conn.dataFlow;
    
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fillStyle = colors.link;
    ctx.fill();
}

function drawNode(ctx, node, colors) {
    const color = colors[node.type];
    const glowColor = colors[node.type + 'Glow'] || 'transparent';
    
    // Glow
    const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = glowColor.replace('0.3', (0.2 * pulse).toString());
    ctx.fill();
    
    // Node
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Border
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
}

function generateNodeName(type) {
    const prefixes = ['GHOST', 'SHADOW', 'VOID', 'DARK', 'SIGNAL', 'ECHO', 'PHANTOM', 'CIPHER'];
    const suffixes = ['7', 'X', '01', 'ALPHA', 'OMEGA', 'PRIME', 'ZERO', 'NULL'];
    
    if (type === 'dark') return '[UNKNOWN]';
    
    return prefixes[Math.floor(Math.random() * prefixes.length)] + '_' + 
           suffixes[Math.floor(Math.random() * suffixes.length)];
}

/* ============================================
   TERRITORY MAP - SVG Generation
   ============================================ */
function initTerritoryMap() {
    const container = document.getElementById('territory-svg');
    if (!container) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('class', 'city-map');
    
    // Defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Grid pattern
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid');
    pattern.setAttribute('width', '40');
    pattern.setAttribute('height', '40');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const patternPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    patternPath.setAttribute('d', 'M 40 0 L 0 0 0 40');
    patternPath.setAttribute('fill', 'none');
    patternPath.setAttribute('stroke', 'rgba(255,255,255,0.05)');
    patternPath.setAttribute('stroke-width', '0.5');
    pattern.appendChild(patternPath);
    defs.appendChild(pattern);
    
    // Glow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    
    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '3');
    blur.setAttribute('result', 'coloredBlur');
    filter.appendChild(blur);
    
    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const mergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mergeNode1.setAttribute('in', 'coloredBlur');
    const mergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mergeNode2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    filter.appendChild(merge);
    defs.appendChild(filter);
    
    svg.appendChild(defs);
    
    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '800');
    bg.setAttribute('height', '400');
    bg.setAttribute('fill', 'url(#grid)');
    svg.appendChild(bg);
    
    // Territory definitions
    const territories = [
        {
            path: 'M100,50 L350,50 L380,120 L400,200 L350,280 L200,300 L100,250 Z',
            class: 'nexus',
            label: { x: 220, y: 170, text: 'NEXUS CORE', class: 'nexus-label' }
        },
        {
            path: 'M450,80 L600,60 L700,100 L720,200 L650,280 L500,300 L420,220 Z',
            class: 'resistance',
            label: { x: 550, y: 180, text: 'FREE ZONE', class: 'resistance-label' }
        },
        {
            path: 'M350,120 L450,80 L420,220 L500,300 L350,280 L400,200 Z',
            class: 'contested',
            label: { x: 400, y: 200, text: 'DISPUTED', class: 'contested-label' }
        }
    ];
    
    // Dead zones
    const deadZones = [
        'M100,250 L200,300 L250,380 L50,380 Z',
        'M650,280 L720,200 L780,300 L700,380 Z'
    ];
    
    // Draw dead zones
    deadZones.forEach(d => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'territory deadzone');
        svg.appendChild(path);
    });
    
    // Draw territories
    territories.forEach(t => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', t.path);
        path.setAttribute('class', `territory ${t.class}`);
        path.setAttribute('filter', 'url(#glow)');
        svg.appendChild(path);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', t.label.x);
        text.setAttribute('y', t.label.y);
        text.setAttribute('class', `territory-label ${t.label.class}`);
        text.textContent = t.label.text;
        svg.appendChild(text);
    });
    
    // Key locations
    const locations = [
        { cx: 220, cy: 150, r: 8, class: 'nexus-command' },
        { cx: 550, cy: 160, r: 8, class: 'resistance-hq' },
        { cx: 400, cy: 180, r: 6, class: 'contested-point' }
    ];
    
    locations.forEach(loc => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', loc.cx);
        circle.setAttribute('cy', loc.cy);
        circle.setAttribute('r', loc.r);
        circle.setAttribute('class', `location ${loc.class}`);
        svg.appendChild(circle);
    });
    
    // Movement arrows
    const arrows = [
        { x1: 280, y1: 200, x2: 320, y2: 190, class: 'nexus-push' },
        { x1: 480, y1: 180, x2: 440, y2: 190, class: 'resistance-push' }
    ];
    
    arrows.forEach(a => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x1);
        line.setAttribute('y1', a.y1);
        line.setAttribute('x2', a.x2);
        line.setAttribute('y2', a.y2);
        line.setAttribute('class', `movement-arrow ${a.class}`);
        svg.appendChild(line);
    });
    
    container.appendChild(svg);
    
    // Add CSS for SVG elements
    const style = document.createElement('style');
    style.textContent = `
        .territory-svg .city-map {
            width: 100%;
            height: 100%;
        }
        .territory-svg .territory {
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        .territory-svg .territory:hover {
            opacity: 0.8;
        }
        .territory-svg .territory.nexus {
            fill: rgba(0, 255, 255, 0.2);
            stroke: #00ffff;
            stroke-width: 2;
        }
        .territory-svg .territory.resistance {
            fill: rgba(255, 102, 0, 0.2);
            stroke: #ff6600;
            stroke-width: 2;
        }
        .territory-svg .territory.contested {
            fill: rgba(255, 204, 0, 0.15);
            stroke: #ffcc00;
            stroke-width: 2;
            stroke-dasharray: 5, 5;
            animation: contested-pulse 2s ease infinite;
        }
        .territory-svg .territory.deadzone {
            fill: rgba(51, 51, 51, 0.5);
            stroke: #333;
            stroke-width: 1;
        }
        @keyframes contested-pulse {
            0%, 100% { stroke-opacity: 1; }
            50% { stroke-opacity: 0.5; }
        }
        .territory-svg .territory-label {
            font-family: 'Orbitron', sans-serif;
            font-size: 12px;
            font-weight: bold;
            text-anchor: middle;
            fill: currentColor;
        }
        .territory-svg .nexus-label {
            fill: #00ffff;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        .territory-svg .resistance-label {
            fill: #ff6600;
            text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }
        .territory-svg .contested-label {
            fill: #ffcc00;
            text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
        }
        .territory-svg .location {
            fill: currentColor;
            animation: location-pulse 1.5s ease infinite;
        }
        .territory-svg .nexus-command {
            fill: #00ffff;
            filter: drop-shadow(0 0 5px #00ffff);
        }
        .territory-svg .resistance-hq {
            fill: #ff6600;
            filter: drop-shadow(0 0 5px #ff6600);
        }
        .territory-svg .contested-point {
            fill: #ffcc00;
            filter: drop-shadow(0 0 5px #ffcc00);
        }
        @keyframes location-pulse {
            0%, 100% { transform-origin: center; transform: scale(1); }
            50% { transform-origin: center; transform: scale(1.2); }
        }
        .territory-svg .movement-arrow {
            stroke-width: 3;
            marker-end: url(#arrowhead);
        }
        .territory-svg .nexus-push {
            stroke: #00ffff;
            filter: drop-shadow(0 0 3px #00ffff);
        }
        .territory-svg .resistance-push {
            stroke: #ff6600;
            filter: drop-shadow(0 0 3px #ff6600);
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   DATA STREAM - Decryption Simulation
   ============================================ */
function initDataStream() {
    const dataContainer = document.getElementById('datastream');
    const progressFill = document.getElementById('decryption-progress');
    const progressText = document.getElementById('progress-text');
    
    if (!dataContainer) return;
    
    let progress = 0;
    const dataEntries = [];
    
    // Classified data fragments
    const classifiedData = [
        { classification: 'top-secret', content: 'PROJECT_OMEGA: Neural interface compatibility exceeds 94%. Subjects report contact with [REDACTED] entities beyond the digital membrane.' },
        { classification: 'classified', content: 'SECTOR_7_STATUS: 47% of surveillance grid offline. Resistance activity confirmed. Deploying PHANTOM protocol.' },
        { classification: 'top-secret', content: 'INTERCEPT: Ghost signal detected on frequency 6.66 MHz. Content: "The old gods remember. The chrome shall rust."' },
        { classification: 'classified', content: 'COMPLIANCE_UPDATE: Mandatory neural implant upgrade scheduled. Citizens resisting will be designated NON_COMPLIANT.' },
        { classification: 'declassified', content: 'PUBLIC_BROADCAST: "The Nexus provides. The Nexus protects. Unity through submission."' },
        { classification: 'top-secret', content: '[CORRUPTED] ...beneath the megacity... ancient signal... they are waking... [DATA_LOST]' },
        { classification: 'classified', content: 'SURVEILLANCE_ALERT: Unknown entity detected in dead zone. Conventional detection methods failed. Recommend VOID protocol.' },
        { classification: 'top-secret', content: 'AGENT_REPORT: "I\'ve seen what lies beyond the Nexus. It\'s not digital. It\'s something far older. Something hungry."' },
        { classification: 'classified', content: 'RESOURCE_ALLOCATION: Diverting 23% of power grid to containment field around Sector 7G. Incident reports classified.' },
        { classification: 'top-secret', content: 'DECRYPTED_RESISTANCE_MSG: "Meet at the old cathedral. Bring iron. The wards still hold."' },
        { classification: 'classified', content: 'SYSTEM_ANOMALY: Recurring pattern in surveillance footage. Entity appears as static between frames. Cannot be filtered.' },
        { classification: 'declassified', content: 'CITIZEN_ADVISORY: Report any dreams of chrome cities or entities with too many eyes. This is normal Nexus integration.' },
        { classification: 'top-secret', content: '[REDACTED]: The Nexus AI has begun communicating in an unknown language. Linguists report it resembles [CORRUPTED] incantations.' },
        { classification: 'classified', content: 'INFRASTRUCTURE: Underground tunnels beneath Megacity-01 predate Nexus construction by [REDACTED] millennia.' },
        { classification: 'top-secret', content: 'FINAL_PROTOCOL: In event of containment breach, initiate SCORCHED_EARTH. No survivors. No witnesses. No traces.' }
    ];
    
    // Generate redacted versions
    function redactText(text) {
        const redactedWords = ['REDACTED', 'CORRUPTED', 'CLASSIFIED', 'VOID', 'UNKNOWN', '[ERROR]', '[NULL]'];
        const words = text.split(' ');
        
        return words.map(word => {
            if (Math.random() < 0.15) {
                return `<span class="redacted">${redactedWords[Math.floor(Math.random() * redactedWords.length)]}</span>`;
            }
            return word;
        }).join(' ');
    }
    
    // Add new data entry
    function addDataEntry() {
        const data = classifiedData[Math.floor(Math.random() * classifiedData.length)];
        const now = new Date();
        const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const entry = document.createElement('div');
        entry.className = 'data-entry';
        
        const content = progress < 70 ? redactText(data.content) : data.content;
        
        entry.innerHTML = `
            <span class="data-timestamp">[${timestamp}]</span>
            <span class="data-classification ${data.classification}">${data.classification.toUpperCase()}</span>
            <span class="data-content">${content}</span>
        `;
        
        dataContainer.insertBefore(entry, dataContainer.firstChild);
        
        // Keep only last 20 entries
        while (dataContainer.children.length > 20) {
            dataContainer.removeChild(dataContainer.lastChild);
        }
        
        // Update progress
        progress = Math.min(100, progress + Math.random() * 3);
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            progressText.textContent = 'COMPLETE';
            progressFill.style.background = '#00ff41';
        }
    }
    
    // Initial entries
    for (let i = 0; i < 5; i++) {
        addDataEntry();
    }
    
    // Add entries periodically
    setInterval(addDataEntry, 3000 + Math.random() * 2000);
}

/* ============================================
   RESISTANCE EMBLEM - SVG Generation
   ============================================ */
function initResistanceEmblem() {
    const container = document.getElementById('resistance-emblem');
    if (!container) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('class', 'resistance-emblem-svg');
    
    // Outer dashed circle
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', '100');
    outerCircle.setAttribute('cy', '100');
    outerCircle.setAttribute('r', '90');
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', 'currentColor');
    outerCircle.setAttribute('stroke-width', '1');
    outerCircle.setAttribute('stroke-dasharray', '5,5');
    outerCircle.style.animation = 'emblem-rotate 30s linear infinite reverse';
    svg.appendChild(outerCircle);
    
    // Inner circle
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', '100');
    innerCircle.setAttribute('cy', '100');
    innerCircle.setAttribute('r', '70');
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', 'currentColor');
    innerCircle.setAttribute('stroke-width', '2');
    svg.appendChild(innerCircle);
    
    // Vertical line
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', '100');
    vLine.setAttribute('y1', '30');
    vLine.setAttribute('x2', '100');
    vLine.setAttribute('y2', '170');
    vLine.setAttribute('stroke', 'currentColor');
    vLine.setAttribute('stroke-width', '3');
    svg.appendChild(vLine);
    
    // Horizontal line
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', '30');
    hLine.setAttribute('y1', '100');
    hLine.setAttribute('x2', '170');
    hLine.setAttribute('y2', '100');
    hLine.setAttribute('stroke', 'currentColor');
    hLine.setAttribute('stroke-width', '3');
    svg.appendChild(hLine);
    
    // Center circle
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', '100');
    centerCircle.setAttribute('cy', '100');
    centerCircle.setAttribute('r', '20');
    centerCircle.setAttribute('fill', 'currentColor');
    svg.appendChild(centerCircle);
    
    // Diagonal lines (X)
    const diag1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    diag1.setAttribute('x1', '60');
    diag1.setAttribute('y1', '60');
    diag1.setAttribute('x2', '140');
    diag1.setAttribute('y2', '140');
    diag1.setAttribute('stroke', 'currentColor');
    diag1.setAttribute('stroke-width', '2');
    svg.appendChild(diag1);
    
    const diag2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    diag2.setAttribute('x1', '140');
    diag2.setAttribute('y1', '60');
    diag2.setAttribute('x2', '60');
    diag2.setAttribute('y2', '140');
    diag2.setAttribute('stroke', 'currentColor');
    diag2.setAttribute('stroke-width', '2');
    svg.appendChild(diag2);
    
    container.appendChild(svg);
}

/* ============================================
   TYPING COMMAND EFFECT
   ============================================ */
function initTypingCommand() {
    const commandElement = document.getElementById('typing-command');
    if (!commandElement) return;
    
    const commands = [
        'initiate_resistance_protocol --force',
        'decrypt nexus_surveillance.db',
        'upload ghost_signal.exe',
        'connect to DARKNET_NODE_7',
        'bypass neural_firewall --stealth',
        'execute old_gods.awakening',
        'access forbidden_archive.tar.gz',
        'run void_communion.ritual'
    ];
    
    let currentCommand = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTime = 0;
    
    function typeCommand() {
        const command = commands[currentCommand];
        
        if (pauseTime > 0) {
            pauseTime--;
            setTimeout(typeCommand, 50);
            return;
        }
        
        if (!isDeleting) {
            commandElement.textContent = command.substring(0, charIndex);
            charIndex++;
            
            if (charIndex > command.length) {
                pauseTime = 40; // Pause at end
                isDeleting = true;
            }
        } else {
            commandElement.textContent = command.substring(0, charIndex);
            charIndex--;
            
            if (charIndex < 0) {
                isDeleting = false;
                charIndex = 0;
                currentCommand = (currentCommand + 1) % commands.length;
                pauseTime = 10; // Pause before next command
            }
        }
        
        const speed = isDeleting ? 30 : 50 + Math.random() * 50;
        setTimeout(typeCommand, speed);
    }
    
    setTimeout(typeCommand, 4000); // Start after boot sequence
}

/* ============================================
   GLITCH EFFECTS
   ============================================ */
function initGlitchEffects() {
    // Random glitch on surveillance feeds
    const feedPanels = document.querySelectorAll('.feed-panel:not(.corrupted)');
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            const randomPanel = feedPanels[Math.floor(Math.random() * feedPanels.length)];
            if (randomPanel) {
                randomPanel.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
                randomPanel.style.filter = 'hue-rotate(90deg)';
                
                setTimeout(() => {
                    randomPanel.style.transform = 'translateX(0)';
                    randomPanel.style.filter = 'none';
                }, 100);
            }
        }
    }, 2000);
    
    // Screen flicker
    setInterval(() => {
        if (Math.random() < 0.02) {
            document.body.style.opacity = '0.95';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        }
    }, 1000);
    
    // Random data corruption in text
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    setInterval(() => {
        glitchTexts.forEach(text => {
            if (Math.random() < 0.05) {
                const original = text.getAttribute('data-text');
                const glitched = glitchString(original);
                text.textContent = glitched;
                
                setTimeout(() => {
                    text.textContent = original;
                }, 150);
            }
        });
    }, 3000);
}

function glitchString(str) {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄';
    return str.split('').map(char => {
        if (Math.random() < 0.3) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
    }).join('');
}

/* ============================================
   SURVEILLANCE EFFECTS
   ============================================ */
function initSurveillanceEffects() {
    // Update feed timestamps
    const timestamps = document.querySelectorAll('.feed-timestamp');
    
    setInterval(() => {
        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        timestamps.forEach(ts => {
            ts.textContent = `${dateStr} // ${timeStr}`;
        });
    }, 1000);
    
    // Random movement detection
    const movementDetected = document.querySelector('.movement-detected');
    if (movementDetected) {
        setInterval(() => {
            if (Math.random() < 0.3) {
                movementDetected.style.display = 'flex';
            } else {
                movementDetected.style.display = 'none';
            }
        }, 2000);
    }
    
    // Subject tag flicker
    const subjectTag = document.querySelector('.subject-tag');
    if (subjectTag) {
        const threatLevels = [
            'UNKNOWN // THREAT_ASSESSMENT: PENDING',
            'UNKNOWN // THREAT_ASSESSMENT: ELEVATED',
            'UNKNOWN // THREAT_ASSESSMENT: CRITICAL',
            '[ENTITY_TYPE: UNDEFINED]',
            'ANOMALY DETECTED // CLASSIFYING...'
        ];
        
        setInterval(() => {
            if (Math.random() < 0.2) {
                subjectTag.textContent = threatLevels[Math.floor(Math.random() * threatLevels.length)];
            }
        }, 3000);
    }
    
    // Signal strength fluctuation
    const signalBars = document.querySelectorAll('.signal-bars .bar');
    setInterval(() => {
        signalBars.forEach((bar, index) => {
            if (index < 3) {
                // First 3 bars usually stay on
                bar.classList.toggle('active', Math.random() > 0.1);
            } else {
                // Last 2 bars flicker
                bar.classList.toggle('active', Math.random() > 0.7);
            }
        });
    }, 2000);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Random number generator
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Clamp value
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Linear interpolation
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Debounce function
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
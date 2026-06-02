/* ========================================
   1940s FILM NOIR DETECTIVE CASE FILE SYSTEM
   JAVASCRIPT - Step 3
   ======================================== */

// ========================================
// DATA STORE
// ========================================

const caseData = {
    summary: "On the night of October 12th, 1947, Victor 'Viper' Morano was found dead in his private office at The Velvet Room, a notorious downtown nightclub. The victim was discovered by his longtime bartender, Frank O'Leary, at approximately 2:30 AM. Morano sustained a single gunshot wound to the chest at close range. The murder weapon—a .38 caliber revolver—was not found at the scene. A safe in the office had been cracked open, with approximately $10,000 in cash missing. The victim's ledger, which reportedly contained names of influential clients and illegal transactions, had a page torn out. This office has been tasked with uncovering the truth behind this calculated killing before more bodies pile up in the gutter.",
    
    witnessStatements: {
        ws1: `I didn't see nothing! Well... maybe I saw something. Mickey Russo was in the club that night, sitting in his usual corner booth. He looked nervous, keep checking his watch. Around midnight, I saw him slip into the back hallway where Victor's office was. They were arguing earlier—loud enough that I could hear through the walls. Something about "the books" and "too much heat." I didn't see him come out, but when I went to collect empty glasses at 2 AM, the back hall was empty. Then Frank found the body. That's all I know, officer. I swear.`,
        ws2: `I was behind the bar all night, like always. Around 1:45 AM, I saw Lena St. Clair come in—she didn't usually show up on Tuesdays. She went straight to Victor's office without saying a word to anyone. They argued for about ten minutes. Sounded heated. I heard her say "You'll regret this" before she stormed out. She didn't go to her usual table; she left the club entirely. Didn't see her come back. That's the last time I saw Victor alive. I didn't hear no gunshot—the music was too loud—but when I went to check on him at 2:30, he was slumped over his desk. The safe was open. That's when I called it in.`
    },
    
    suspects: [
        {
            id: 1,
            name: "Mickey 'The Knife' Russo",
            role: "Enforcer, East Coast Syndicate",
            details: "Known associate of victim. Previous convictions for assault and extortion. Seen arguing with Morano night of murder. Has access to .38 caliber firearms through syndicate connections.",
            tags: ["violent", "motivated", "alibi unknown"],
            color: "yellow",
            x: 120,
            y: 80
        },
        {
            id: 2,
            name: "Lena St. Clair",
            role: "Former Flame, Socialite",
            details: "Morano's ex-lover. Recent bitter breakup. Heavily in debt to Morano ($15,000 gambling marker). History of manipulation and threats. Purchased .38 caliber revolver three days before murder.",
            tags: ["emotional", "financial motive", "unreliable"],
            color: "blue",
            x: 280,
            y: 160
        },
        {
            id: 3,
            name: "Detective Ray Harker",
            role: "Rival Detective, Internal Affairs",
            details: "Recently suspended for corruption. Had been investigating Morano for six months. Possible frame-up or revenge killing? Access to service weapon—same .38 caliber. Disappeared night of murder.",
            tags: ["corrupt", "access to weapons", "opportunity"],
            color: "green",
            x: 440,
            y: 100
        }
    ],
    
    evidence: [
        {
            id: 1,
            title: "Crime Scene Photo",
            description: "Victim's office showing blood spatter pattern. Entry wound indicates close-range shot. Desk drawer forced open. No signs of forced entry to office.",
            type: "photo",
            tag: "E-01",
            color: "red"
        },
        {
            id: 2,
            title: ".38 Caliber Bullet Casing",
            description: "Fired casing found under desk. Ballistics match a .38 Special. Extractors marks consistent with a revolver, not a pistol. No fingerprints recovered.",
            type: "physical",
            tag: "E-02",
            color: "yellow"
        },
        {
            id: 3,
            title: "Open Safe",
            description: "Wall safe cracked using professional tools. $10,000 in cash missing. No sign of forced entry elsewhere suggests insider knowledge. Safe combination known only to victim and one other.",
            type: "photo",
            tag: "E-03",
            color: "blue"
        },
        {
            id: 4,
            title: "Partial Fingerprints",
            description: "Smudged prints on safe dial and desk surface. Partial ridge patterns recovered. Latent prints being processed through AFIS. Preliminary analysis suggests two individuals.",
            type: "photo",
            tag: "E-04",
            color: "green"
        },
        {
            id: 5,
            title: "Torn Ledger Page",
            description: "Victim's accounting ledger with page containing transactions from September 15-30 torn out. Edge indicates clean tear, not ripped in struggle. Contents unknown but believed to be incriminating.",
            type: "document",
            tag: "E-05",
            color: "red"
        }
    ],
    
    connections: [
        { from: "suspect-1", to: "evidence-2", color: "red" },
        { from: "suspect-2", to: "evidence-3", color: "red" },
        { from: "suspect-3", to: "evidence-4", color: "red" }
    ]
};

// ========================================
// DOM ELEMENTS
// ========================================

const elements = {
    // Navigation
    navTabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Typewriter elements
    summaryText: document.getElementById('summaryText'),
    statement1: document.getElementById('statement1'),
    statement2: document.getElementById('statement2'),
    
    // Corkboard
    corkboard: document.getElementById('corkboard'),
    addPinBtn: document.getElementById('addPinBtn'),
    connectBtn: document.getElementById('connectBtn'),
    clearBtn: document.getElementById('clearBtn'),
    toolInstruction: document.getElementById('toolInstruction'),
    
    // Modal
    modal: document.getElementById('detailModal'),
    modalBody: document.getElementById('modalBody'),
    modalClose: document.querySelector('.modal-close'),
    
    // Effects
    rainOverlay: document.getElementById('rainOverlay'),
    smokeContainer: document.getElementById('smokeContainer'),
    
    // Last updated
    lastUpdated: document.getElementById('lastUpdated')
};

// ========================================
// STATE MANAGEMENT
// ========================================

let state = {
    currentTab: 'overview',
    corkboard: {
        pins: [],
        connections: [],
        tool: 'select', // 'select', 'connect'
        connectingFrom: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        draggedPin: null
    }
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set last updated date
    updateLastUpdated();
    
    // Initialize tab navigation
    initializeNavigation();
    
    // Start typewriter animations when overview tab is active
    setTimeout(() => {
        if (state.currentTab === 'overview') {
            typewriterText(elements.summaryText, caseData.summary);
        }
    }, 500);
    
    // Initialize witness typewriter for visible statements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'witnesses' && mutation.target.classList.contains('active')) {
                if (!elements.statement1.innerHTML) {
                    typewriterText(elements.statement1, caseData.witnessStatements.ws1, 20);
                }
                if (!elements.statement2.innerHTML) {
                    typewriterText(elements.statement2, caseData.witnessStatements.ws2, 40);
                }
            }
        });
    });
    
    observer.observe(document.getElementById('witnesses'), { attributes: true, attributeFilter: ['class'] });
    
    // Initialize corkboard
    initializeCorkboard();
    
    // Initialize atmospheric effects
    initializeRain();
    initializeSmokeTrail();
    
    // Initialize modal
    initializeModal();
    
    // Add initial pins to corkboard
    addInitialPins();
    
    // Load saved connections
    loadConnections();
}

// ========================================
// NAVIGATION
// ========================================

function initializeNavigation() {
    elements.navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Update state
    state.currentTab = tabName;
    
    // Update tab buttons
    elements.navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    // Trigger typewriter for overview
    if (tabName === 'overview' && !elements.summaryText.innerHTML) {
        typewriterText(elements.summaryText, caseData.summary);
    }
    
    // Trigger witness typewriters
    if (tabName === 'witnesses') {
        if (!elements.statement1.innerHTML) {
            typewriterText(elements.statement1, caseData.witnessStatements.ws1, 20);
        }
        if (!elements.statement2.innerHTML) {
            typewriterText(elements.statement2, caseData.witnessStatements.ws2, 40);
        }
    }
    
    // Resize corkboard canvas when tab becomes visible
    if (tabName === 'corkboard') {
        setTimeout(() => {
            resizeCorkboardCanvas();
            drawConnections();
        }, 100);
    }
}

// ========================================
// TYPEWRITER EFFECT
// ========================================

function typewriterText(element, text, delay = 10) {
    element.innerHTML = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            element.innerHTML += char === '\n' ? '<br>' : char;
            index++;
            setTimeout(type, delay);
        }
    }
    
    setTimeout(type, 500);
}

// ========================================
// RAIN EFFECT
// ========================================

function initializeRain() {
    // Create dynamic rain with canvas for more realistic effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999';
    canvas.id = 'rainCanvas';
    canvas.opacity = '0.15';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const drops = [];
    const maxDrops = 200;
    
    for (let i = 0; i < maxDrops; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 3 + 2,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        
        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();
            
            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
        });
        
        requestAnimationFrame(drawRain);
    }
    
    drawRain();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// SMOKE TRAIL EFFECT
// ========================================

function initializeSmokeTrail() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) { // Only create particle occasionally
            createSmokeParticle(e.clientX, e.clientY);
        }
    });
}

function createSmokeParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'smoke-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Random size variation
    const size = Math.random() * 6 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random drift direction
    const driftX = (Math.random() - 0.5) * 30;
    particle.animate([
        { transform: `translate(0, 0) scale(1)`, opacity: 0.4 },
        { transform: `translate(${driftX}px, -80px) scale(2.5)`, opacity: 0 }
    ], {
        duration: 2500,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
    
    elements.smokeContainer.appendChild(particle);
    
    // Auto-remove after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 2500);
}

// ========================================
// CORKBOARD FUNCTIONALITY
// ========================================

let canvas, canvasCtx;
let connectionCanvas, connectionCtx;

function initializeCorkboard() {
    // Create canvas for drawing connections
    connectionCanvas = document.createElement('canvas');
    connectionCanvas.className = 'connections-canvas';
    connectionCanvas.style.position = 'absolute';
    connectionCanvas.style.top = '0';
    connectionCanvas.style.left = '0';
    connectionCanvas.style.width = '100%';
    connectionCanvas.style.height = '100%';
    connectionCanvas.style.pointerEvents = 'none';
    connectionCanvas.style.zIndex = '60';
    
    elements.corkboard.appendChild(connectionCanvas);
    connectionCtx = connectionCanvas.getContext('2d');
    
    // Tool button event listeners
    elements.addPinBtn.addEventListener('click', () => {
        state.corkboard.tool = 'add';
        updateToolUI();
        showToolInstruction('Click on the corkboard to place a new pin');
    });
    
    elements.connectBtn.addEventListener('click', () => {
        state.corkboard.tool = 'connect';
        updateToolUI();
        showToolInstruction('Click two pins to connect them with red thread');
        state.corkboard.connectingFrom = null;
    });
    
    elements.clearBtn.addEventListener('click', clearAllConnections);
    
    // Corkboard click handler
    elements.corkboard.addEventListener('click', handleCorkboardClick);
    
    // Drag handlers
    elements.corkboard.addEventListener('mousedown', handlePinMouseDown);
    document.addEventListener('mousemove', handlePinMouseMove);
    document.addEventListener('mouseup', handlePinMouseUp);
    
    // Resize handler
    window.addEventListener('resize', () => {
        resizeCorkboardCanvas();
        drawConnections();
    });
    
    resizeCorkboardCanvas();
}

function resizeCorkboardCanvas() {
    const rect = elements.corkboard.getBoundingClientRect();
    connectionCanvas.width = rect.width;
    connectionCanvas.height = rect.height;
}

function updateToolUI() {
    elements.addPinBtn.classList.toggle('active', state.corkboard.tool === 'add');
    elements.connectBtn.classList.toggle('active', state.corkboard.tool === 'connect');
}

function showToolInstruction(message) {
    elements.toolInstruction.textContent = message;
    setTimeout(() => {
        if (state.corkboard.tool === 'select') {
            elements.toolInstruction.textContent = 'Click on suspects/evidence to place pins';
        }
    }, 3000);
}

function addInitialPins() {
    // Add pins for suspects
    caseData.suspects.forEach(suspect => {
        addPinToBoard(`suspect-${suspect.id}`, suspect.x, suspect.y, suspect.color, suspect.name);
    });
    
    // Add pins for evidence
    caseData.evidence.forEach(evidence => {
        const x = 200 + (evidence.id * 100);
        const y = 300 + (evidence.id * 40);
        addPinToBoard(`evidence-${evidence.id}`, x, y, evidence.color, evidence.tag);
    });
    
    // Draw initial connections
    setTimeout(() => {
        drawConnections();
    }, 100);
}

function addPinToBoard(id, x, y, color, label) {
    const pin = document.createElement('div');
    pin.className = `cork-pin ${color}`;
    pin.dataset.id = id;
    pin.style.left = x + 'px';
    pin.style.top = y + 'px';
    
    // Add label
    const pinLabel = document.createElement('div');
    pinLabel.className = 'pin-label';
    pinLabel.textContent = label;
    pin.appendChild(pinLabel);
    
    elements.corkboard.appendChild(pin);
    
    // Store pin data
    state.corkboard.pins.push({
        id,
        element: pin,
        x,
        y,
        color
    });
    
    return pin;
}

function handleCorkboardClick(e) {
    if (state.corkboard.tool === 'add') {
        const rect = elements.corkboard.getBoundingClientRect();
        const x = e.clientX - rect.left - 12; // Center the pin
        const y = e.clientY - rect.top - 12;
        
        const newId = 'custom-' + Date.now();
        const label = 'NOTE';
        addPinToBoard(newId, x, y, 'red', label);
        
        // Switch back to select mode
        state.corkboard.tool = 'select';
        updateToolUI();
        showToolInstruction('Click on suspects/evidence to place pins');
    }
}

function handlePinMouseDown(e) {
    if (!e.target.classList.contains('cork-pin')) return;
    
    e.preventDefault();
    
    const pin = e.target;
    const pinData = state.corkboard.pins.find(p => p.id === pin.dataset.id);
    
    if (!pinData) return;
    
    if (state.corkboard.tool === 'connect') {
        handlePinConnection(pin);
        return;
    }
    
    // Start dragging
    state.corkboard.isDragging = true;
    state.corkboard.draggedPin = pinData;
    
    const rect = elements.corkboard.getBoundingClientRect();
    state.corkboard.dragOffset = {
        x: e.clientX - rect.left - pinData.x,
        y: e.clientY - rect.top - pinData.y
    };
    
    pin.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
}

function handlePinMouseMove(e) {
    if (!state.corkboard.isDragging || !state.corkboard.draggedPin) return;
    
    const rect = elements.corkboard.getBoundingClientRect();
    let x = e.clientX - rect.left - state.corkboard.dragOffset.x;
    let y = e.clientY - rect.top - state.corkboard.dragOffset.y;
    
    // Constrain to corkboard bounds
    x = Math.max(0, Math.min(x, rect.width - 24));
    y = Math.max(0, Math.min(y, rect.height - 24));
    
    // Update pin position
    state.corkboard.draggedPin.x = x;
    state.corkboard.draggedPin.y = y;
    state.corkboard.draggedPin.element.style.left = x + 'px';
    state.corkboard.draggedPin.element.style.top = y + 'px';
    
    // Redraw connections
    drawConnections();
}

function handlePinMouseUp() {
    if (state.corkboard.draggedPin) {
        state.corkboard.draggedPin.element.classList.remove('dragging');
    }
    
    state.corkboard.isDragging = false;
    state.corkboard.draggedPin = null;
    document.body.style.cursor = 'default';
}

function handlePinConnection(pin) {
    const pinId = pin.dataset.id;
    
    if (!state.corkboard.connectingFrom) {
        // Start connection
        state.corkboard.connectingFrom = pinId;
        pin.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
        showToolInstruction(`Selected ${pinId}. Click another pin to connect.`);
    } else {
        // Complete connection
        if (state.corkboard.connectingFrom !== pinId) {
            const connection = {
                from: state.corkboard.connectingFrom,
                to: pinId,
                color: 'red'
            };
            
            // Check if connection already exists
            const exists = state.corkboard.connections.some(
                c => (c.from === connection.from && c.to === connection.to) ||
                     (c.from === connection.to && c.to === connection.from)
            );
            
            if (!exists) {
                state.corkboard.connections.push(connection);
                drawConnections();
                saveConnections();
                showToolInstruction('Connection created!');
            } else {
                showToolInstruction('Connection already exists');
            }
        }
        
        // Reset
        document.querySelectorAll('.cork-pin').forEach(p => {
            p.style.boxShadow = '';
        });
        state.corkboard.connectingFrom = null;
    }
}

function drawConnections() {
    if (!connectionCtx) return;
    
    const rect = elements.corkboard.getBoundingClientRect();
    connectionCtx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);
    
    state.corkboard.connections.forEach(conn => {
        const fromPin = state.corkboard.pins.find(p => p.id === conn.from);
        const toPin = state.corkboard.pins.find(p => p.id === conn.to);
        
        if (!fromPin || !toPin) return;
        
        // Draw curved line
        connectionCtx.beginPath();
        connectionCtx.strokeStyle = conn.color === 'red' ? '#ff0000' : conn.color;
        connectionCtx.lineWidth = 2;
        connectionCtx.lineCap = 'round';
        
        // Add shadow/glow effect
        connectionCtx.shadowColor = 'rgba(255, 0, 0, 0.5)';
        connectionCtx.shadowBlur = 5;
        
        const fromX = fromPin.x + 12;
        const fromY = fromPin.y + 12;
        const toX = toPin.x + 12;
        const toY = toPin.y + 12;
        
        // Calculate control point for curve
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const offset = 30;
        const ctrlX = midX;
        const ctrlY = midY - offset;
        
        connectionCtx.moveTo(fromX, fromY);
        connectionCtx.quadraticCurveTo(ctrlX, ctrlY, toX, toY);
        connectionCtx.stroke();
        
        // Reset shadow
        connectionCtx.shadowBlur = 0;
    });
}

function clearAllConnections() {
    state.corkboard.connections = [];
    drawConnections();
    localStorage.removeItem('noirConnections');
    showToolInstruction('All connections cleared');
}

function saveConnections() {
    localStorage.setItem('noirConnections', JSON.stringify(state.corkboard.connections));
}

function loadConnections() {
    const saved = localStorage.getItem('noirConnections');
    if (saved) {
        try {
            state.corkboard.connections = JSON.parse(saved);
            drawConnections();
        } catch (e) {
            console.error('Failed to load connections:', e);
        }
    }
}

// ========================================
// MODAL FUNCTIONALITY
// ========================================

function initializeModal() {
    // Close modal handlers
    elements.modalClose.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            closeModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Add click handlers to evidence items
    document.querySelectorAll('.evidence-item').forEach(item => {
        item.addEventListener('click', () => {
            const evidenceId = item.dataset.evidence;
            const evidence = caseData.evidence.find(e => e.id === parseInt(evidenceId));
            if (evidence) {
                showEvidenceModal(evidence);
            }
        });
    });
    
    // Add click handlers to suspect cards
    document.querySelectorAll('.suspect-card').forEach(card => {
        card.addEventListener('click', () => {
            const suspectId = parseInt(card.dataset.suspect);
            const suspect = caseData.suspects.find(s => s.id === suspectId);
            if (suspect) {
                showSuspectModal(suspect);
            }
        });
    });
}

function showEvidenceModal(evidence) {
    const content = `
        <div class="modal-evidence">
            <div class="modal-header">
                <h2>${evidence.tag}: ${evidence.title}</h2>
                <div class="evidence-type-badge">${evidence.type.toUpperCase()}</div>
            </div>
            <div class="modal-image-container">
                <img src="${getEvidenceImage(evidence.id)}" alt="${evidence.title}" class="modal-image">
            </div>
            <div class="modal-description">
                <p>${evidence.description}</p>
            </div>
            <div class="modal-meta">
                <div class="meta-item">
                    <span class="meta-label">EVIDENCE ID:</span>
                    <span class="meta-value">${evidence.tag}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">CATEGORY:</span>
                    <span class="meta-value">${evidence.type.toUpperCase()}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">STATUS:</span>
                    <span class="meta-value status-pending">PENDING ANALYSIS</span>
                </div>
            </div>
        </div>
    `;
    
    elements.modalBody.innerHTML = content;
    elements.modal.classList.add('active');
}

function showSuspectModal(suspect) {
    const content = `
        <div class="modal-suspect">
            <div class="modal-header">
                <h2>${suspect.name}</h2>
                <div class="suspect-status-badge ${suspect.color}">PERSON OF INTEREST</div>
            </div>
            <div class="suspect-details-grid">
                <div class="suspect-photo-large">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='250' viewBox='0 0 200 250'%3E%3Crect fill='%23333' width='200' height='250'/%3E%3Ccircle cx='100' cy='90' r='40' fill='%23555'/%3E%3Crect x='60' y='140' width='80' height='80' fill='%23555'/%3E%3Ctext x='100' y='245' text-anchor='middle' fill='%23999' font-family='monospace' font-size='10'%3EMUGSHOT%3C/text%3E%3C/svg%3E" alt="${suspect.name}">
                    <div class="photo-pin ${suspect.color}" style="position: absolute; top: -10px; right: -10px;"></div>
                </div>
                <div class="suspect-info-large">
                    <div class="info-section">
                        <h3>ROLE</h3>
                        <p>${suspect.role}</p>
                    </div>
                    <div class="info-section">
                        <h3>DETAILS</h3>
                        <p>${suspect.details}</p>
                    </div>
                    <div class="info-section">
                        <h3>FLAGS</h3>
                        <div class="tags-large">
                            ${suspect.tags.map(tag => `<span class="tag-large">${tag.toUpperCase()}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    elements.modalBody.innerHTML = content;
    elements.modal.classList.add('active');
}

function getEvidenceImage(id) {
    // Return placeholder images (in production, these would be real photo paths)
    const images = {
        1: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23333' width='600' height='400'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%23999' font-family='monospace' font-size='24'%3ECRIME SCENE PHOTO%3C/text%3E%3Ctext x='300' y='230' text-anchor='middle' fill='%23999' font-family='monospace' font-size='18'%3EVictim's Office - Blood Spatter%3C/text%3E%3C/svg%3E",
        2: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23333' width='600' height='400'/%3E%3Ccircle cx='300' cy='200' r='50' stroke='%23f00' stroke-width='5' fill='none'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%23f00' font-family='monospace' font-size='20'%3E.38 CALIBER%3C/text%3E%3Ctext x='300' y='230' text-anchor='middle' fill='%23999' font-family='monospace' font-size='16'%3EBullet Casing%3C/text%3E%3C/svg%3E",
        3: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23333' width='600' height='400'/%3E%3Ctext x='300' y='190' text-anchor='middle' fill='%23ff0' font-family='monospace' font-size='28'%3E$10,000 MISSING%3C/text%3E%3Ctext x='300' y='220' text-anchor='middle' fill='%23999' font-family='monospace' font-size='18'%3EOpen Safe - Professional Crack%3C/text%3E%3Crect x='250' y='250' width='100' height='80' fill='none' stroke='%23555' stroke-width='3'/%3E%3C/svg%3E",
        4: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23333' width='600' height='400'/%3E%3Ctext x='300' y='190' text-anchor='middle' fill='%23ff0' font-family='monospace' font-size='20'%3EPARTIAL FINGERPRINTS%3C/text%3E%3Ctext x='300' y='220' text-anchor='middle' fill='%23999' font-family='monospace' font-size='16'%3ESmeared but recoverable%3C/text%3E%3Ccircle cx='280' cy='260' r='8' fill='%23ff0'/%3E%3Ccircle cx='320' cy='270' r='5' fill='%23ff0'/%3E%3Ccircle cx='300' cy='280' r='6' fill='%23ff0'/%3E%3C/svg%3E",
        5: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23333' width='600' height='400'/%3E%3Ctext x='300' y='190' text-anchor='middle' fill='%23999' font-family='monospace' font-size='24'%3EVICTIM'S LEDGER%3C/text%3E%3Ctext x='300' y='220' text-anchor='middle' fill='%23f00' font-family='monospace' font-size='18'%3EPage Torn Out - September 15-30%3C/text%3E%3Cpath d='M250 250 L350 250 L350 270 L250 270 Z' fill='none' stroke='%23f00' stroke-width='3'/%3E%3C/svg%3E"
    };
    
    return images[id] || images[1];
}

function closeModal() {
    elements.modal.classList.remove('active');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function updateLastUpdated() {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    elements.lastUpdated.textContent = formatted;
}

// ========================================
// ADDITIONAL INTERACTIVITY
// ========================================

// Add hover effects to cards
document.querySelectorAll('.card, .suspect-card, .evidence-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P to add pin (when on corkboard)
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (state.currentTab === 'corkboard') {
            state.corkboard.tool = state.corkboard.tool === 'add' ? 'select' : 'add';
            updateToolUI();
        }
    }
    
    // Ctrl/Cmd + C to connect pins
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        if (state.currentTab === 'corkboard') {
            state.corkboard.tool = state.corkboard.tool === 'connect' ? 'select' : 'connect';
            updateToolUI();
        }
    }
    
    // Escape to cancel connection
    if (e.key === 'Escape' && state.corkboard.connectingFrom) {
        document.querySelectorAll('.cork-pin').forEach(p => {
            p.style.boxShadow = '';
        });
        state.corkboard.connectingFrom = null;
        showToolInstruction('Connection cancelled');
    }
});

// Add dynamic shadow to header on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('.noir-header');
    
    if (currentScroll > 50) {
        header.style.boxShadow = '0 10px 40px rgba(0,0,0,0.8)';
    } else {
        header.style.boxShadow = '';
    }
    
    lastScroll = currentScroll;
});

// Easter egg: Konami code reveals hidden evidence
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        revealHiddenEvidence();
    }
});

function revealHiddenEvidence() {
    const hiddenNote = document.createElement('div');
    hiddenNote.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000;
        border: 2px solid #ff0000;
        padding: 30px;
        z-index: 10000;
        font-family: 'Courier Prime', monospace;
        color: #ff0000;
        max-width: 500px;
        box-shadow: 0 0 50px rgba(255,0,0,0.5);
    `;
    hiddenNote.innerHTML = `
        <h3 style="margin-bottom: 15px; text-transform: uppercase;">CLASSIFIED</h3>
        <p style="line-height: 1.8; margin-bottom: 15px;">
            Detective, you've found the hidden file. The victim wasn't just a nightclub owner—he was an informant for the federal government. 
            The missing ledger contains names of corrupt city officials and police officers. 
            The killer is someone you know. Trust no one. Keep investigating.
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: #ff0000;
            color: #000;
            border: none;
            padding: 8px 20px;
            font-family: 'Courier Prime', monospace;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
        ">ACKNOWLEDGE</button>
    `;
    document.body.appendChild(hiddenNote);
    
    // Auto-remove after 30 seconds if not clicked
    setTimeout(() => {
        if (hiddenNote.parentNode) {
            hiddenNote.remove();
        }
    }, 30000);
}

console.log(`
%c
╔══════════════════════════════════════════════╗
║     DETECTIVE CASE FILE SYSTEM v1.0         ║
║     "The Velvet Shadow" - Case #47          ║
║     initialized successfully.               ║
║     Shortcuts:                              ║
║     Ctrl+P - Add Pin (corkboard)            ║
║     Ctrl+C - Connect Pins                   ║
║     ESC - Cancel Connection                ║
║     Konami Code - Secret File               ║
╚══════════════════════════════════════════════╝
`, 'color: #ff0000; font-family: monospace; font-size: 12px;');
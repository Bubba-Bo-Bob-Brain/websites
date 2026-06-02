// Case data
const suspects = [
    {
        name: "VICTOR HARTLEY",
        details: "Former business partner, last seen at the warehouse district. Known for aggressive negotiations.",
        risk: "HIGH",
        color: "#c41e3a"
    },
    {
        name: "MARIA SANTOS",
        details: "Witness to the incident, claims she saw a man in dark clothing near the scene.",
        risk: "MEDIUM",
        color: "#2c3e8a"
    },
    {
        name: "JAMES CORBETT",
        details: "Security guard with questionable alibi. Has connections to organized crime.",
        risk: "CRITICAL",
        color: "#8b0000"
    },
    {
        name: "ELENA VORONOVA",
        details: "Russian immigrant with financial troubles. Recently spotted near crime scene.",
        risk: "MEDIUM",
        color: "#d4af37"
    }
];

const evidence = [
    { type: "case-file", label: "CASE FILE" },
    { type: "photo", label: "PHOTOGRAPH" },
    { type: "document", label: "DOCUMENT" },
    { type: "case-file", label: "CASE FILE" },
    { type: "photo", label: "PHOTOGRAPH" },
    { type: "document", label: "DOCUMENT" },
    { type: "photo", label: "PHOTOGRAPH" },
    { type: "case-file", label: "CASE FILE" }
];

const witnesses = [
    {
        name: "Inspector Margaret Doyle",
        statement: "The evidence suggests a calculated operation. Someone knew exactly what they were looking for.",
        status: "INTERVIEWED"
    },
    {
        name: "Detective Thomas Reed",
        statement: "Multiple witnesses reported seeing a figure matching the suspect's description near the scene.",
        status: "PENDING"
    },
    {
        name: "Sarah Jenkins",
        statement: "I heard arguing that night. The voices were distorted but I could tell they were angry.",
        status: "INTERVIEWED"
    }
];

// Typewriter text content
const caseNotes = [
    "THE CASE BEGINS WITH A MISSING PERSON...",
    "FOUND A LOCKET WITH INITIALS 'M.V.' INSIDE...",
    "SUSPECT JAMES CORBETT WAS SEEN LEAVING THE WAREHOUSE...",
    "EVIDENCE SUGGESTS AN INSIDE JOB...",
    "THE CONSIRACY RUNS DEEPER THAN WE IMAGINED...",
    "MORE INVESTIGATION NEEDED...",
    "STAY ALERT, DETECTIVE...",
    "THE TRUTH IS HIDING IN PLAIN SIGHT..."
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderSuspects();
    renderEvidence();
    renderWitnesses();
    renderPins();
    renderThreads();
    typewriterEffect();
    setupControls();
    createSmokeEffect();
});

// Render suspects
function renderSuspects() {
    const container = document.getElementById('suspectsGrid');
    container.innerHTML = suspects.map((suspect, index) => `
        <div class="suspect-card" data-suspect="${index}">
            <div class="suspect-name">${suspect.name}</div>
            <div class="suspect-details">${suspect.details}</div>
            <span class="suspect-risk" style="background: ${suspect.color}">${suspect.risk}</span>
        </div>
    `).join('');
}

// Render evidence gallery
function renderEvidence() {
    const container = document.getElementById('evidenceGallery');
    container.innerHTML = evidence.map((item, index) => `
        <div class="evidence-photo ${item.type}">
            <span style="font-size: 0.7rem; opacity: 0.6; transform: rotate(-45deg); position: absolute;">${item.label}</span>
        </div>
    `).join('');
}

// Render witnesses
function renderWitnesses() {
    const container = document.getElementById('witnessesList');
    container.innerHTML = witnesses.map((witness, index) => `
        <div class="witness-item">
            <div class="witness-name">${witness.name}</div>
            <div class="witness-statement">${witness.statement}</div>
            <span class="witness-status">${witness.status}</span>
        </div>
    `).join('');
}

// Render cork board pins
function renderPins() {
    const container = document.getElementById('pinsContainer');
    const pinData = [
        { x: 20, y: 20, suspect: 0, label: "MAIN SUSPECT" },
        { x: 35, y: 35, suspect: 1, label: "WITNESS" },
        { x: 50, y: 25, suspect: 2, label: "PRIMARY" },
        { x: 65, y: 45, suspect: 3, label: "FINANCIAL" },
        { x: 30, y: 55, suspect: 0, label: "ALIBI DISCREPANCY" },
        { x: 70, y: 20, suspect: 2, label: "EVIDENCE LINK" },
        { x: 15, y: 40, suspect: 1, label: "MOTIVE" },
        { x: 55, y: 60, suspect: 3, label: "PATTERN" }
    ];

    container.innerHTML = pinData.map((pin, index) => `
        <div class="pin" 
             style="left: ${pin.x}%; top: ${pin.y}%; background: ${suspects[pin.suspect].color}"
             data-pin="${index}"
             title="${pin.label} - ${suspects[pin.suspect].name}">
        </div>
    `).join('');

    // Add click events to pins
    document.querySelectorAll('.pin').forEach(pin => {
        pin.addEventListener('click', function() {
            const pinIndex = parseInt(this.getAttribute('data-pin'));
            const suspectIndex = pinData[pinIndex].suspect;
            
            // Toggle selection
            this.classList.toggle('selected');
            
            // Highlight connected evidence
            const evidencePhotos = document.querySelectorAll('.evidence-photo');
            evidencePhotos.forEach(photo => {
                photo.style.opacity = '0.3';
            });
            
            // Highlight related evidence (simplified logic)
            if (this.classList.contains('selected')) {
                evidencePhotos.forEach(photo => {
                    photo.style.opacity = '1';
                });
            }
        });
    });
}

// Render threads between pins
function renderThreads() {
    const container = document.getElementById('threadsContainer');
    const pins = document.querySelectorAll('.pin');
    
    // Create some connecting threads
    const threads = [
        { from: 0, to: 2, label: "KNOWN ASSOCIATE" },
        { from: 1, to: 3, label: "FINANCIAL TIE" },
        { from: 2, to: 5, label: "EVIDENCE CHAIN" },
        { from: 4, to: 6, label: "ALIBI" },
        { from: 1, to: 4, label: "STATEMENT" }
    ];

    container.innerHTML = threads.map(thread => {
        const fromPin = pins[thread.from];
        const toPin = pins[thread.to];
        
        if (!fromPin || !toPin) return '';
        
        const fromRect = fromPin.getBoundingClientRect();
        const toRect = toPin.getBoundingClientRect();
        const boardRect = document.querySelector('.cork-board').getBoundingClientRect();
        
        const fromX = fromRect.left - boardRect.left + fromRect.width / 2;
        const fromY = fromRect.top - boardRect.top + fromRect.height / 2;
        const toX = toRect.left - boardRect.left + toRect.width / 2;
        const toY = toRect.top - boardRect.top + toRect.height / 2;
        
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        return `
            <div class="thread-container" 
                 style="left: ${fromX}px; top: ${fromY}px; width: ${length}px; transform: rotate(${angle}deg)">
                <div class="thread" style="width: 100%">
                    <span style="position: absolute; top: -15px; font-size: 0.6rem; color: var(--accent-red); font-family: 'Cinzel', serif;">
                        ${thread.label}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// Typewriter effect
function typewriterEffect() {
    const container = document.getElementById('typewriterText');
    let i = 0;
    
    function type() {
        if (i < caseNotes.length) {
            container.textContent += caseNotes[i] + '\n';
            i++;
            setTimeout(type, 80 + Math.random() * 100);
        }
    }
    
    type();
}

// Control buttons setup
function setupControls() {
    const rainToggle = document.getElementById('toggleRain');
    const smokeToggle = document.getElementById('toggleSmoke');
    const resetBtn = document.getElementById('resetBoard');
    
    rainToggle.addEventListener('click', function() {
        const overlay = document.getElementById('rainOverlay');
        overlay.classList.toggle('active');
        this.textContent = overlay.classList.contains('active') ? '☔ RAIN ON' : '☔ RAIN';
    });
    
    smokeToggle.addEventListener('click', function() {
        const smokeContainer = document.querySelector('.smoke-container');
        smokeContainer.classList.toggle('active');
        this.textContent = smokeContainer.classList.contains('active') ? '💨 SMOKE ON' : '💨 SMOKE';
    });
    
    resetBtn.addEventListener('click', function() {
        // Reset pins
        document.querySelectorAll('.pin').forEach(pin => {
            pin.classList.remove('selected');
        });
        
        // Reset evidence opacity
        document.querySelectorAll('.evidence-photo').forEach(photo => {
            photo.style.opacity = '1';
        });
        
        // Reset threads
        document.querySelectorAll('.thread-container').forEach(thread => {
            thread.remove();
        });
        renderThreads();
    });
}

// Smoke effect creator
function createSmokeEffect() {
    const container = document.querySelector('.smoke-container');
    
    // Create initial smoke
    for (let i = 0; i < 5; i++) {
        createSmokeWisp(container);
    }
    
    // Create new smoke periodically
    setInterval(() => {
        if (container.classList.contains('active')) {
            createSmokeWisp(container);
        }
    }, 3000);
}

function createSmokeWisp(container) {
    const wisp = document.createElement('div');
    wisp.classList.add('smoke-wisp');
    
    const size = 30 + Math.random() * 50;
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    
    wisp.style.width = size + 'px';
    wisp.style.height = size + 'px';
    wisp.style.left = left + '%';
    wisp.style.bottom = '-50px';
    wisp.style.animationDuration = duration + 's';
    wisp.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(wisp);
    
    // Remove wisp after animation
    setTimeout(() => {
        wisk.remove();
    }, (duration + 5) * 1000);
}

// Add mouse trail effect for smoke
document.addEventListener('mousemove', function(e) {
    const smokeContainer = document.querySelector('.smoke-container');
    if (smokeContainer.classList.contains('active')) {
        // Create smoke at mouse position occasionally
        if (Math.random() < 0.3) {
            const wisp = document.createElement('div');
            wisp.classList.add('smoke-wisp');
            
            const size = 20 + Math.random() * 30;
            const duration = 5 + Math.random() * 5;
            
            wisp.style.width = size + 'px';
            wisp.style.height = size + 'px';
            wisp.style.left = (e.clientX + Math.random() * 100 - 50) + 'px';
            wisp.style.top = (e.clientY + Math.random() * 100 - 50) + 'px';
            wisp.style.animationDuration = duration + 's';
            
            smokeContainer.appendChild(wisp);
            
            setTimeout(() => {
                wisp.remove();
            }, duration * 1000);
        }
    }
});

// Add keyboard interaction
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
        document.getElementById('toggleRain').click();
    } else if (e.key === 's' || e.key === 'S') {
        document.getElementById('toggleSmoke').click();
    } else if (e.key === 'Escape') {
        document.getElementById('resetBoard').click();
    }
});
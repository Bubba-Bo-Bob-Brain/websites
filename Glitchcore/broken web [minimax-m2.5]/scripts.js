/* =====================================================
   DIGITAL DECAY - Interactive Art Piece
   JavaScript - The Engine of Decay
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initLayers();
    initCorruptedData();
    initLoadingSequence();
    initDraggableFragments();
    initStaticNoise();
    initGlitchEffects();
    initBSODSequence();
    initTextEffects();
    
    // Update timestamp for clean page
    updateCleanTimestamp();
});

/* ===================================================== LAYER NAVIGATION ===================================================== */

let currentLayer = 0;
const totalLayers = 7;

function initLayers() {
    const layerButtons = document.querySelectorAll('[data-goto]');
    
    layerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetLayer = parseInt(e.currentTarget.dataset.goto);
            navigateToLayer(targetLayer);
        });
    });
    
    // Result items navigation
    const resultItems = document.querySelectorAll('.result-item[data-goto]');
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetLayer = parseInt(item.dataset.goto);
            navigateToLayer(targetLayer);
        });
    });
    
    updateLayerIndicator();
}

function navigateToLayer(layerIndex) {
    if (layerIndex < 0 || layerIndex > totalLayers) return;
    
    const currentLayerEl = document.querySelector(`.layer-${currentLayer}`);
    const nextLayerEl = document.querySelector(`.layer-${layerIndex}`);
    
    if (currentLayerEl) {
        currentLayerEl.classList.remove('active');
    }
    
    // Special handling for BSOD layers
    if (layerIndex === 2) {
        document.querySelector('.layer-2').style.display = 'flex';
    } else if (layerIndex === 6) {
        document.querySelector('.layer-6').style.display = 'flex';
    }
    
    if (nextLayerEl) {
        nextLayerEl.classList.add('active');
    }
    
    currentLayer = layerIndex;
    updateLayerIndicator();
    
    // Trigger layer-specific animations
    if (layerIndex === 4) {
        startLoadingSequence();
    }
}

function updateLayerIndicator() {
    const layerValue = document.getElementById('currentLayer');
    if (layerValue) {
        layerValue.textContent = currentLayer;
    }
    
    // Hide nav hint on later layers
    const navHint = document.getElementById('navHint');
    if (navHint) {
        if (currentLayer >= 4) {
            navHint.classList.add('hidden');
        } else {
            navHint.classList.remove('hidden');
        }
    }
}

/* ===================================================== CORRUPTED DATABASE GENERATION ===================================================== */

const fakeNames = [
    'ShadowHunter', 'NetRunner', 'GhostProtocol', 'DarkC0der', 'NullPointer',
    'VoidWalker', 'PixelRaider', 'DataGhost', 'CyberPhantom', 'GlitchMaker',
    'BinaryGhost', 'HexDemon', 'StackOverflow', 'NullReference', 'SegmentationFault',
    'KernelPanic', 'BlueScreen', 'FatalException', 'MemoryLeak', 'BufferOverflow'
];

const fakeDomains = [
    'darknet.org', 'underground.net', 'secret.server', 'hidden.place', 'forbidden.zone',
    'anonymous.void', 'encrypted.chat', 'lost.files', 'erased.data', 'deleted.memory'
];

const fakeStatuses = ['ACTIVE', 'BANNED', 'SUSPENDED', 'CORRUPT', 'DELETED', '⚠️ ERROR'];

const corruptMessages = [
    'DATA CORRUPTED', 'ACCESS DENIED', 'FILE NOT FOUND', 'Ø', '?????????',
    '###HIDDEN###', 'ERASED', 'GONE', 'VOID', 'NULL'
];

function initCorruptedData() {
    const tableBody = document.getElementById('leakedData');
    if (!tableBody) return;
    
    for (let i = 1; i <= 15; i++) {
        const row = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.textContent = String(i).padStart(4, '0');
        
        const userCell = document.createElement('td');
        userCell.textContent = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        
        const emailCell = document.createElement('td');
        const isCorrupted = Math.random() > 0.6;
        if (isCorrupted) {
            emailCell.textContent = corruptMessages[Math.floor(Math.random() * corruptMessages.length)];
            emailCell.classList.add('corrupt-cell');
        } else {
            const domain = fakeDomains[Math.floor(Math.random() * fakeDomains.length)];
            emailCell.textContent = `user${i}@${domain}`;
        }
        
        const statusCell = document.createElement('td');
        const status = fakeStatuses[Math.floor(Math.random() * fakeStatuses.length)];
        statusCell.textContent = status;
        if (status.includes('ERROR') || status === 'CORRUPT' || status === 'DELETED') {
            statusCell.style.color = 'var(--error-red)';
        }
        
        row.appendChild(idCell);
        row.appendChild(userCell);
        row.appendChild(emailCell);
        row.appendChild(statusCell);
        
        tableBody.appendChild(row);
    }
}

/* ===================================================== LOADING SEQUENCE SIMULATION ===================================================== */

let loadingInterval = null;
let progress = 0;

function initLoadingSequence() {
    // Progress bar setup
    const progressFill = document.getElementById('progressFill');
    const progressStatus = document.getElementById('progressStatus');
    
    if (!progressFill || !progressStatus) return;
    
    window.startLoadingSequence = function() {
        if (loadingInterval) clearInterval(loadingInterval);
        
        progress = 0;
        const statuses = [
            'Initializing...',
            'Scanning corrupted sectors...',
            'Recovering fragmented data...',
            'Reconstructing memory blocks...',
            'Decrypting recovered files...',
            'Verifying data integrity...',
            'Almost there...',
            'Finalizing recovery...',
            'Complete!'
        ];
        
        loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                progressStatus.textContent = 'Recovery complete!';
                
                // Add terminal completion message
                addTerminalLine('Recovery complete. Press "Force Continue" to proceed.');
            } else {
                const statusIndex = Math.floor((progress / 100) * (statuses.length - 1));
                progressStatus.textContent = `${Math.floor(progress)}% - ${statuses[statusIndex]}`;
                
                // Random errors
                if (Math.random() > 0.8) {
                    const errorMsg = getRandomError();
                    addTerminalLine(errorMsg, 'error-line');
                }
            }
            
            progressFill.style.width = `${Math.min(progress, 100)}%`;
        }, 400);
    };
}

function getRandomError() {
    const errors = [
        'WARNING: Unrecoverable sector detected',
        'Error: Checksum mismatch in block 0x' + Math.floor(Math.random() * 99999).toString(16),
        'Attempting alternative recovery method...',
        'Data fragment corrupted - skipping...',
        'Retrying sector read...',
        'Warning: Memory leak detected',
        'Error code: 0x' + Math.floor(Math.random() * 99999999).toString(16).toUpperCase()
    ];
    return errors[Math.floor(Math.random() * errors.length)];
}

function addTerminalLine(text, className = 'terminal-line') {
    const terminalOutput = document.getElementById('terminalOutput');
    if (!terminalOutput) return;
    
    const line = document.createElement('p');
    line.className = className;
    line.textContent = text;
    terminalOutput.appendChild(line);
    
    // Auto-scroll to bottom
    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
}

function initLoadingSequence() {
    const progressFill = document.getElementById('progressFill');
    const progressStatus = document.getElementById('progressStatus');
    
    if (!progressFill || !progressStatus) return;
    
    window.startLoadingSequence = function() {
        if (loadingInterval) clearInterval(loadingInterval);
        
        progress = 0;
        const statuses = [
            'Initializing...',
            'Scanning corrupted sectors...',
            'Recovering fragmented data...',
            'Reconstructing memory blocks...',
            'Decrypting recovered files...',
            'Verifying data integrity...',
            'Almost there...',
            'Finalizing recovery...',
            'Complete!'
        ];
        
        loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                progressStatus.textContent = 'Recovery complete!';
                addTerminalLine('Recovery complete. Press "Force Continue" to proceed.');
            } else {
                const statusIndex = Math.floor((progress / 100) * (statuses.length - 1));
                progressStatus.textContent = `${Math.floor(progress)}% - ${statuses[statusIndex]}`;
                
                if (Math.random() > 0.8) {
                    const errorMsg = getRandomError();
                    addTerminalLine(errorMsg, 'error-line');
                }
            }
            
            progressFill.style.width = `${Math.min(progress, 100)}%`;
        }, 400);
    };
}

/* ===================================================== DRAGGABLE FRAGMENTS SYSTEM ===================================================== */

let placedFragments = 0;
const totalFragments = 3; // Only 3 regular fragments, one is locked
const unlockKey = 'curiosity';

function initDraggableFragments() {
    const fragments = document.querySelectorAll('.memory-fragment[draggable="true"]');
    const dropZone = document.getElementById('fragmentDrop');
    
    if (!fragments.length || !dropZone) return;
    
    fragments.forEach(fragment => {
        fragment.addEventListener('dragstart', handleDragStart);
        fragment.addEventListener('dragend', handleDragEnd);
    });
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.fragment);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('drag-over');
    
    const fragmentId = e.dataTransfer.getData('text/plain');
    const fragment = document.querySelector(`.memory-fragment[data-fragment="${fragmentId}"]`);
    
    if (fragment && !fragment.classList.contains('placed')) {
        fragment.classList.add('placed');
        placedFragments++;
        updateFragmentCount();
        
        // Check if all fragments placed
        if (placedFragments >= totalFragments) {
            setTimeout(() => {
                showUnlockMessage();
            }, 500);
        }
    }
}

function updateFragmentCount() {
    const countEl = document.getElementById('fragmentsPlaced');
    if (countEl) {
        countEl.textContent = placedFragments;
    }
}

function showUnlockMessage() {
    // Replace locked fragment with unlocked one
    const lockedFragment = document.querySelector('.fragment-locked');
    if (lockedFragment) {
        lockedFragment.classList.remove('fragment-locked');
        lockedFragment.querySelector('.fragment-icon').textContent = '🔓';
        lockedFragment.querySelector('.fragment-text').textContent = 'truth.key';
        lockedFragment.draggable = true;
        
        // Add drag events to unlocked fragment
        lockedFragment.addEventListener('dragstart', handleDragStart);
        lockedFragment.addEventListener('dragend', handleDragEnd);
        
        addTerminalLine('ENCRYPTED FILE DETECTED - Password accepted: CURIOSITY');
    }
}

/* ===================================================== STATIC NOISE & ATMOSPHERE ===================================================== */

function initStaticNoise() {
    const overlay = document.getElementById('staticOverlay');
    if (!overlay) return;
    
    // Vary the static noise opacity randomly
    setInterval(() => {
        const randomOpacity = 0.02 + Math.random() * 0.08;
        overlay.style.opacity = randomOpacity;
    }, 200);
}

/* ===================================================== GLITCH TEXT EFFECTS ===================================================== */

function initGlitchEffects() {
    // Shuffle text on result items
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
        const original = text.dataset.text;
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                let shuffled = original;
                for (let i = 0; i < 3; i++) {
                    const pos = Math.floor(Math.random() * original.length);
                    shuffled = shuffled.substring(0, pos) + chars[Math.floor(Math.random() * chars.length)] + shuffled.substring(pos + 1);
                }
                text.textContent = shuffled;
            } else {
                text.textContent = original;
            }
        }, 100);
    });
}

/* ===================================================== BSOD SEQUENCE ===================================================== */

function initBSODSequence() {
    const bsodContinueBtns = document.querySelectorAll('.bsod-continue');
    let bsodCount = 0;
    
    bsodContinueBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bsodCount++;
            const currentBSOD = document.querySelector(`.bsod-screen.bsod-${bsodCount}`);
            const nextBSOD = document.querySelector(`.bsod-screen.bsod-${bsodCount + 1}`);
            
            if (currentBSOD) {
                currentBSOD.style.display = 'none';
            }
            
            if (nextBSOD) {
                nextBSOD.style.display = 'block';
            }
        });
    });
}

/* ===================================================== TEXT & VISUAL EFFECTS ===================================================== */

function initTextEffects() {
    // Random drift text movement
    const driftTexts = document.querySelectorAll('.drift-text');
    
    driftTexts.forEach(text => {
        text.addEventListener('mouseover', () => {
            text.style.animationDuration = '2s';
        });
        
        text.addEventListener('mouseout', () => {
            text.style.animationDuration = '20s';
        });
    });
    
    // Shuffle title effect for layer 5
    const shuffleTitle = document.querySelector('.shuffle-title');
    if (shuffleTitle) {
        const phrases = [
            'RECOVERY COMPLETE',
            'R3C0V3RY C0MPL3T3',
            'REC0VERY C0MP13T3',
            'RECOVERED DATA',
            'R#C0VERY C$MPL3T3'
        ];
        
        let phraseIndex = 0;
        
        setInterval(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            shuffleTitle.textContent = phrases[phraseIndex];
        }, 2000);
    }
}

/* ===================================================== TIMESTAMP FOR CLEAN PAGE ===================================================== */

function updateCleanTimestamp() {
    const timestamp = document.getElementById('cleanTimestamp');
    if (!timestamp) return;
    
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    timestamp.textContent = formatted;
}

/* ===================================================== EASTER EGGS & HIDDEN FEATURES ===================================================== */

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join('').toLowerCase() === konamiSequence.join('').toLowerCase()) {
        // Easter egg: Jump to the hidden clean page
        navigateToLayer(6);
        triggerEasterEgg();
    }
});

function triggerEasterEgg() {
    document.body.style.transition = 'background 1s';
    document.body.style.background = '#001122';
    
    setTimeout(() => {
        document.body.style.transition = '';
    }, 1000);
}

// Random "found" messages in console
const consoleMessages = [
    'You found a glitch in the matrix...',
    'Someone tried to delete this. They failed.',
    'The archive remembers what was forgotten.',
    'Curiosity is the only key that works here.',
    'You are not the first to wander this digital decay...',
    '404: Sanity not found. But you kept going.',
    'The truth was buried deep. You dug it up.',
    'Welcome to the forgotten internet.'
];

console.log('%c🗄️ DIGITAL DECAY 🗄️', 'font-size: 24px; color: #00ffff;');
console.log(`%c${consoleMessages[Math.floor(Math.random() * consoleMessages.length)]}`, 'font-style: italic; color: #666;');
console.log('%cClick through the corruption. Find the truth.', 'color: #888;');

// Audio toggle (visual only for this version)
const audioToggle = document.getElementById('audioToggle');
let audioEnabled = false;

if (audioToggle) {
    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        const icon = audioToggle.querySelector('.audio-icon');
        icon.textContent = audioEnabled ? '🔊' : '🔇';
        
        if (audioEnabled) {
            console.log('Audio simulation enabled (no actual audio in this version)');
        }
    });
}

/* ===================================================== CLEANUP ON PAGE UNLOAD ===================================================== */

window.addEventListener('beforeunload', () => {
    if (loadingInterval) {
        clearInterval(loadingInterval);
    }
});

/* ===================================================== EXPORT FOR DEBUGGING ===================================================== */

window.DigitalDecay = {
    navigateToLayer,
    getCurrentLayer: () => currentLayer,
    getPlacedFragments: () => placedFragments
};
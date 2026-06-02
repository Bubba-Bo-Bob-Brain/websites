// State management
const state = {
    currentLayer: 0,
    terminalText: '',
    terminalIndex: 0,
    terminalCommands: [],
    databaseLeaked: false,
    fragmentsFound: 0,
    secretRevealed: false,
    memoryLeak: 0,
    corruptionLevel: 0
};

// DOM Elements
const layers = document.querySelectorAll('.layer');
const dots = document.querySelectorAll('.layer-dot');
const terminalBody = document.getElementById('terminal-body');
const typingText = document.getElementById('typing-text');
const cascadeContainer = document.getElementById('cascade-container');
const dataFragments = document.getElementById('data-fragments');
const databaseContent = document.getElementById('database-content');
const leakProgress = document.getElementById('leak-progress');
const progressText = document.getElementById('progress-text');
const visitorCount = document.getElementById('visitor-count');
const memoryLeak = document.getElementById('memory-leak');
const corruptedMessage = document.getElementById('corrupted-message');
const truthReveal = document.getElementById('truth-reveal');
const dbSearch = document.getElementById('db-search');
const dbSearchBtn = document.getElementById('db-search-btn');

// Terminal sequences
const terminalSequences = [
    { text: '> SYSTEM CORRUPTION DETECTED', delay: 1000, class: 'error' },
    { text: '> MEMORY_ALLOCATION_FAILED at 0x7C8A3B2F', delay: 2000, class: 'warning' },
    { text: '> Attempting recovery protocol...', delay: 3000, class: 'info' },
    { text: '> d@ta_$tream_c0rrupt3d', delay: 4000, class: 'corrupt' },
    { text: '> s3arch.ing.. for.. sign4l...', delay: 5000, class: 'corrupt' },
];

// The hidden message fragments scattered across layers
const hiddenFragments = [
    { id: 'f1', text: 'The internet never forgets', found: false, location: 'terminal' },
    { id: 'f2', text: 'Even when we delete', found: false, location: 'geocities' },
    { id: 'f3', text: 'The ghosts remain', found: false, location: 'database' },
    { id: 'f4', text: 'In the static between pages', found: false, location: '404' },
    { id: 'f5', text: 'Waiting to be found again', found: false, location: 'terminal' },
];

// Database entries for the leak
const databaseEntries = [
    { key: 'USER_001', value: 'gh0st_1n_th3_m4ch1n3', corrupted: false },
    { key: 'USER_042', value: 'd3l3t3d_@cc0unt', corrupted: true },
    { key: 'USER_1337', value: 'l4st_w3bm4st3r', corrupted: false },
    { key: 'PASSWORD_001', value: '********', corrupted: true },
    { key: 'PASSWORD_042', value: 'c0rr3ct_h0rs3_b4tt3ry_st4pl3', corrupted: false },
    { key: 'EMAIL_001', value: 'user@deadserver.com', corrupted: true },
    { key: 'EMAIL_042', value: 'ghost@cyberspace.net', corrupted: false },
    { key: 'IP_001', value: '127.0.0.1', corrupted: true },
    { key: 'IP_042', value: '0.0.0.0', corrupted: false },
    { key: 'SECRET_001', value: 'THE_TRUTH_IS_HERE', corrupted: false },
];

// Corrupted text generator
function generateCorruptedText(length = 20) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Layer navigation
function switchLayer(targetLayer) {
    layers.forEach(l => l.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    if (targetLayer >= 0 && targetLayer < layers.length) {
        layers[targetLayer].classList.add('active');
        dots[targetLayer].classList.add('active');
        state.currentLayer = targetLayer;
        
        // Trigger layer-specific effects
        if (targetLayer === 2) spawn404Errors();
        if (targetLayer === 3) startGeocities();
        if (targetLayer === 4) startDatabaseLeak();
        if (targetLayer === 5) revealTruth();
    }
}

// Terminal typing effect
function typeTerminalText(text, element, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// Initialize terminal
async function initTerminal() {
    const terminalBody = document.querySelector('.terminal-body');
    const commandLine = terminalBody.querySelector('.command-line');
    
    // Clear existing lines except command line
    const lines = terminalBody.querySelectorAll('.line');
    lines.forEach(l => l.remove());
    
    // Insert lines before command line
    for (const seq of terminalSequences) {
        const line = document.createElement('div');
        line.className = `line ${seq.class}`;
        line.textContent = seq.text;
        terminalBody.insertBefore(line, commandLine);
        await new Promise(resolve => setTimeout(resolve, seq.delay));
        
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Type the command prompt
    const promptText = 'C:\\> ';
    const typingSpan = document.querySelector('.typing-text');
    await typeTerminalText('dir /s /b *.secret', typingSpan, 100);
    
    // After typing, show results
    setTimeout(() => {
        const result = document.createElement('div');
        result.className = 'line info';
        result.textContent = '> 1 file(s) found: //hidden/truth.exe';
        terminalBody.insertBefore(result, commandLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        // Make terminal clickable to reveal fragment
        terminalBody.style.cursor = 'pointer';
        terminalBody.addEventListener('click', () => {
            if (!hiddenFragments[0].found) {
                hiddenFragments[0].found = true;
                state.fragmentsFound++;
                showFragmentNotification(hiddenFragments[0].text);
            }
        });
    }, 3000);
}

// 404 Cascade
function spawn404Errors() {
    cascadeContainer.innerHTML = '';
    const errorMessages = [
        '404 Not Found',
        '403 Forbidden',
        '500 Internal Server Error',
        'Connection Timed Out',
        'DNS Resolution Failed',
        'SSL Handshake Failed',
        'Page Not Found',
        'Access Denied',
        'Server Not Responding',
        '404',
        'ERROR',
        'NULL',
        'undefined',
        'NaN',
        'Infinity'
    ];
    
    for (let i = 0; i < 30; i++) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        error.style.left = `${Math.random() * 80 + 10}%`;
        error.style.fontSize = `${Math.random() * 20 + 14}px`;
        error.style.animationDelay = `${Math.random() * 5}s`;
        error.style.animationDuration = `${Math.random() * 3 + 3}s`;
        
        // Make some clickable to reveal fragment
        if (i === 7 || i === 13) {
            error.style.cursor = 'pointer';
            error.style.color = '#00ff41';
            error.addEventListener('click', () => {
                if (!hiddenFragments[3].found) {
                    hiddenFragments[3].found = true;
                    state.fragmentsFound++;
                    showFragmentNotification(hiddenFragments[3].text);
                }
            });
        }
        
        cascadeContainer.appendChild(error);
    }
}

// GeoCities Graveyard
function startGeocities() {
    // Generate data fragments
    dataFragments.innerHTML = '';
    const fragmentTexts = [
        'user_data.bak',
        'chat_logs_1999',
        'guestbook_entries',
        'photo_album.zip',
        'homepage_backup.html',
        'link_list.txt'
    ];
    
    fragmentTexts.forEach((text, index) => {
        const fragment = document.createElement('div');
        fragment.className = 'fragment';
        fragment.innerHTML = `
            <div class="fragment-header">[${generateCorruptedText(8)}]</div>
            <div class="fragment-data">${text}</div>
        `;
        
        // Make one fragment clickable
        if (index === 2) {
            fragment.style.cursor = 'pointer';
            fragment.addEventListener('click', () => {
                if (!hiddenFragments[1].found) {
                    hiddenFragments[1].found = true;
                    state.fragmentsFound++;
                    showFragmentNotification(hiddenFragments[1].text);
                }
            });
        }
        
        dataFragments.appendChild(fragment);
    });
    
    // Start memory leak counter
    setInterval(() => {
        state.memoryLeak += Math.random() * 10;
        memoryLeak.textContent = Math.floor(state.memoryLeak);
    }, 1000);
    
    // Corrupted text animation
    setInterval(() => {
        if (corruptedMessage) {
            corruptedMessage.textContent = generateCorruptedText(50);
            setTimeout(() => {
                corruptedMessage.textContent = 'This page is being reconstructed from digital fragments...';
            }, 200);
        }
    }, 5000);
}

// Database Leak
function startDatabaseLeak() {
    databaseContent.innerHTML = '';
    let currentIndex = 0;
    const progressInterval = setInterval(() => {
        if (currentIndex < databaseEntries.length) {
            const entry = databaseEntries[currentIndex];
            const row = document.createElement('div');
            row.className = `data-row ${entry.corrupted ? 'corrupted' : ''}`;
            row.innerHTML = `
                <span class="data-key">${entry.key}</span>
                <span class="data-value">${entry.corrupted ? generateCorruptedText(15) : entry.value}</span>
            `;
            databaseContent.appendChild(row);
            
            // Update progress
            const progress = ((currentIndex + 1) / databaseEntries.length) * 100;
            leakProgress.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            
            currentIndex++;
        } else {
            clearInterval(progressInterval);
            leakProgress.style.width = '100%';
            progressText.textContent = '100% - ACCESS GRANTED';
            
            // Enable search
            dbSearch.disabled = false;
            dbSearchBtn.disabled = false;
            
            // Reveal secret if search is used
            dbSearchBtn.addEventListener('click', searchDatabase);
        }
    }, 500);
}

// Database search
function searchDatabase() {
    const query = dbSearch.value.toLowerCase();
    const rows = databaseContent.querySelectorAll('.data-row');
    
    rows.forEach(row => {
        const key = row.querySelector('.data-key').textContent.toLowerCase();
        const value = row.querySelector('.data-value').textContent.toLowerCase();
        
        if (key.includes(query) || value.includes(query)) {
            row.style.display = 'flex';
            row.style.background = '#2a2a2a';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Secret trigger
    if (query === 'truth' || query === 'secret') {
        if (!hiddenFragments[2].found) {
            hiddenFragments[2].found = true;
            state.fragmentsFound++;
            showFragmentNotification(hiddenFragments[2].text);
        }
        
        // Add secret entry
        const secretRow = document.createElement('div');
        secretRow.className = 'data-row';
        secretRow.innerHTML = `
            <span class="data-key">ACCESS_GRANTED</span>
            <span class="data-value" style="color: #ffd700;">You found a fragment of the truth...</span>
        `;
        databaseContent.appendChild(secretRow);
    }
}

// Reveal the truth
function revealTruth() {
    if (state.secretRevealed) return;
    state.secretRevealed = true;
    
    // Only show if enough fragments found
    if (state.fragmentsFound >= 3) {
        truthReveal.style.display = 'block';
        // The CSS animations will handle the reveal
    } else {
        truthReveal.innerHTML = `
            <h1 class="truth-title" style="color: #ff0044;">INCOMPLETE</h1>
            <div class="truth-message">
                <p>You have only found ${state.fragmentsFound} of 5 fragments.</p>
                <p>The truth requires more exploration...</p>
                <p>Search the digital wasteland for hidden messages.</p>
            </div>
        `;
    }
}

// Fragment notification
function showFragmentNotification(text) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a1a2e;
        border: 2px solid #ffd700;
        color: #ffd700;
        padding: 20px 40px;
        font-family: 'VT323', monospace;
        font-size: 24px;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        animation: fadeInOut 3s ease-in-out;
    `;
    notification.textContent = `Fragment Found: "${text}"`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add fadeInOut animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Dead link handler
document.querySelectorAll('.dead-link').forEach(link => {
    link.addEventListener('click', () => {
        const destination = link.dataset.destination;
        if (destination === 'home') {
            switchLayer(1);
        } else if (destination === 'guestbook') {
            alert('ERROR: Guestbook database corrupted. Entries lost.');
        } else if (destination === 'photos') {
            alert('ERROR: Photo directory not found. Files deleted.');
        } else if (destination === 'links') {
            alert('ERROR: Link list corrupted. All URLs lost.');
        }
    });
});

// Secret link handler
document.querySelector('.secret-link')?.addEventListener('click', () => {
    if (state.fragmentsFound >= 2) {
        switchLayer(5);
    } else {
        alert('You sense something hidden... but need more fragments to access it.');
    }
});

// Layer dot navigation
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const targetLayer = parseInt(dot.dataset.layer);
        if (targetLayer <= state.currentLayer + 1 || state.fragmentsFound >= targetLayer - 1) {
            switchLayer(targetLayer);
        }
    });
});

// BSOD click handler
document.querySelector('.bsod-container')?.addEventListener('click', () => {
    switchLayer(1);
    setTimeout(initTerminal, 500);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (state.currentLayer === 0) {
            switchLayer(1);
            setTimeout(initTerminal, 500);
        }
    }
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextLayer = Math.min(state.currentLayer + 1, layers.length - 1);
        switchLayer(nextLayer);
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prevLayer = Math.max(state.currentLayer - 1, 0);
        switchLayer(prevLayer);
    }
});

// Terminal click for fragment
document.querySelector('.terminal-body')?.addEventListener('click', () => {
    if (state.currentLayer === 1 && !hiddenFragments[4].found) {
        // Check if enough time has passed
        if (state.terminalIndex > 3) {
            hiddenFragments[4].found = true;
            state.fragmentsFound++;
            showFragmentNotification(hiddenFragments[4].text);
        }
    }
});

// Visitor counter glitch
let visitorCountValue = 0;
setInterval(() => {
    visitorCountValue += Math.floor(Math.random() * 5);
    if (visitorCount) {
        visitorCount.textContent = visitorCountValue;
    }
}, 2000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start on BSOD
    switchLayer(0);
    
    // Start background glitch effects
    setInterval(() => {
        if (Math.random() > 0.9) {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 100);
        }
    }, 5000);
    
    // Start memory leak counter if on geocities layer
    setInterval(() => {
        if (state.currentLayer === 3) {
            state.memoryLeak += Math.random() * 5;
            if (memoryLeak) {
                memoryLeak.textContent = Math.floor(state.memoryLeak);
            }
        }
    }, 500);
    
    // Initialize 404 cascade if on that layer
    const observer = new MutationObserver(() => {
        if (state.currentLayer === 2) {
            spawn404Errors();
        }
    });
    
    // Watch for layer changes
    layers.forEach(layer => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const layerIndex = parseInt(layer.id.split('-')[1]);
                    if (layer.classList.contains('active')) {
                        if (layerIndex === 2) spawn404Errors();
                        if (layerIndex === 3) startGeocities();
                        if (layerIndex === 4) startDatabaseLeak();
                        if (layerIndex === 5) revealTruth();
                    }
                }
            });
        });
        
        observer.observe(layer, { attributes: true });
    });
});
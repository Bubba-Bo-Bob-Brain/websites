// ===== GLOBAL STATE =====
let currentLayer = 'layer-bsod';
let bsodCompleted = false;
let terminalHistory = [];
let mouseTrailEnabled = true;

// ===== DATABASE DATA =====
const databaseRecords = [
    { id: '00001', username: 'admin', email: 'admin@lostsector.net', last_login: '2001-03-14', status: 'ACTIVE' },
    { id: '00002', username: 'webmaster', email: 'webmaster@lostsector.net', last_login: '2000-11-22', status: 'ACTIVE' },
    { id: '00003', username: 'user4829', email: 'user4829@aol.com', last_login: '1999-08-15', status: 'BANNED' },
    { id: '00004', username: 'cyberpunk99', email: 'cyber@geocities.com', last_login: '2000-01-01', status: 'ACTIVE' },
    { id: '00005', username: 'darklord', email: 'darklord@hotmail.com', last_login: '1999-12-25', status: 'BANNED' },
    { id: '00006', username: 'angel_fire', email: 'angel@yahoo.com', last_login: '2000-06-18', status: 'UNKNOWN' },
    { id: '00007', username: 'xXSephirothXx', email: 'sephiroth@ff.net', last_login: '1999-07-14', status: 'ACTIVE' },
    { id: '00008', username: 'mystic_prophet', email: 'prophet@angelfire.com', last_login: '2001-02-28', status: 'UNKNOWN' },
    { id: '00009', username: 'null_pointer', email: 'null@segfault.org', last_login: '2000-09-09', status: 'BANNED' },
    { id: '00010', username: 'pixel_dreamer', email: 'pixel@dreamscape.net', last_login: '1999-11-11', status: 'ACTIVE' },
    { id: '00011', username: 'ghost_in_shell', email: 'ghost@cyberpunk.jp', last_login: '2000-04-01', status: 'ACTIVE' },
    { id: '00012', username: 'data_corrupt', email: 'corrupt@error.net', last_login: '2001-01-01', status: 'BANNED' },
    { id: '00013', username: 'neon_nights', email: 'neon@retrowave.com', last_login: '2000-12-31', status: 'ACTIVE' },
    { id: '00014', username: 'void_walker', email: 'void@darkness.org', last_login: '1999-10-31', status: 'UNKNOWN' },
    { id: '00015', username: 'system_failure', email: 'fail@crash.net', last_login: '2001-03-15', status: 'BANNED' },
];

// ===== ENCRYPTED MESSAGE =====
const encryptedMessage = "WKLV LV D KLGGRQ PHVVDJH IURP WKH SDVW BRX IRXQG WKH LQWDFW SDJH";
const decryptionKey = "intact";

// ===== DOM ELEMENTS =====
const layers = document.querySelectorAll('.layer');
const bsodTrigger = document.getElementById('bsod-trigger');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const databaseBody = document.getElementById('database-body');
const encryptedText = document.getElementById('encrypted-text');
const repairLog = document.getElementById('repair-log');
const mouseTrail = document.getElementById('mouse-trail');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initBSOD();
    initTerminal();
    initDatabase();
    initEncryptedText();
    initMouseTrail();
    initFloatingErrors();
    initGlitchEffects();
    initHashNavigation();
});

// ===== BSOD SEQUENCE =====
function initBSOD() {
    const percentDisplay = document.getElementById('bsod-percent');
    let percent = 0;
    
    const interval = setInterval(() => {
        percent += Math.random() * 15;
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            setTimeout(() => {
                bsodCompleted = true;
                showLayer('layer-404-1');
            }, 1000);
        }
        percentDisplay.textContent = Math.floor(percent);
    }, 200);
    
    bsodTrigger.addEventListener('click', () => {
        if (bsodCompleted) {
            showLayer('layer-404-1');
        }
    });
}

// ===== LAYER NAVIGATION =====
function showLayer(layerId) {
    layers.forEach(layer => {
        layer.classList.remove('active');
    });
    
    const targetLayer = document.getElementById(layerId);
    if (targetLayer) {
        targetLayer.classList.add('active');
        currentLayer = layerId;
        
        targetLayer.style.animation = 'none';
        targetLayer.offsetHeight;
        targetLayer.style.animation = 'layer-appear 0.5s ease-out';
    }
    
    window.location.hash = layerId;
}

// ===== HASH NAVIGATION =====
function initHashNavigation() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            showLayer(hash);
        }
    });
    
    if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        if (document.getElementById(hash)) {
            showLayer(hash);
        }
    }
}

// ===== TERMINAL FUNCTIONALITY =====
function initTerminal() {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalHistory.push(command);
            processCommand(command);
            terminalInput.value = '';
        }
    });
}

function processCommand(command) {
    const output = terminalOutput;
    
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line';
    inputLine.innerHTML = `<span class="prompt">user@lost-sector</span>:<span class="path">~</span>$ ${command}`;
    output.insertBefore(inputLine, output.lastElementChild);
    
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';
    
    let response = '';
    
    switch (command) {
        case 'help':
            response = 'Available commands: help, ls, cat, cd, pwd, whoami, matrix, secret, clear, exit';
            responseLine.classList.add('system');
            break;
            
        case 'ls':
            response = 'leaked_database_dump_1999.csv  recovered_artifact.png  ???.???  readme.txt';
            responseLine.classList.add('system');
            break;
            
        case 'cat':
            response = 'cat: invalid argument. Usage: cat [filename]';
            responseLine.classList.add('warning');
            break;
            
        case 'cat readme.txt':
            response = 'This sector was abandoned in 2001. If you\'re reading this, the recovery protocol worked. Look for the intact page. It\'s hidden somewhere in the corruption.';
            responseLine.classList.add('system');
            break;
            
        case 'cat leaked_database_dump_1999.csv':
            response = 'Accessing database... Click the database link above to view.';
            responseLine.classList.add('system');
            break;
            
        case 'pwd':
            response = '/home/user/lost_sector';
            responseLine.classList.add('system');
            break;
            
        case 'whoami':
            response = 'user (temporal anomaly detected)';
            responseLine.classList.add('warning');
            break;
            
        case 'cd':
            response = 'cd: permission denied';
            responseLine.classList.add('warning');
            break;
            
        case 'matrix':
            response = 'Initiating matrix sequence... Just kidding. Or am I? 01001000 01100101 01101100 01110000';
            responseLine.classList.add('system');
            break;
            
        case 'secret':
            response = 'You found a secret! Navigate to #layer-intact to access the hidden page.';
            responseLine.classList.add('warning');
            responseLine.innerHTML = '<span class="fragment-num">★</span> You found a secret! Navigate to <a href="#layer-intact" class="terminal-link">#layer-intact</a> to access the hidden page.';
            break;
            
        case 'clear':
            const lines = output.querySelectorAll('.terminal-line:not(:last-child)');
            lines.forEach(line => line.remove());
            return;
            
        case 'exit':
            response = 'There is no escape. Only deeper into the labyrinth.';
            responseLine.classList.add('warning');
            break;
            
        case 'admin':
            response = 'Admin access granted. Redirecting to secure sector...';
            responseLine.classList.add('system');
            setTimeout(() => {
                showLayer('layer-intact');
            }, 1500);
            break;
            
        case 'sudo':
            response = 'sudo: user is not in the sudoers file. This incident will be reported.';
            responseLine.classList.add('warning');
            break;
            
        case 'hack':
            response = 'Hacking the mainframe... Just kidding. Nice try though.';
            responseLine.classList.add('system');
            break;
            
        case 'hello':
        case 'hi':
            response = 'Hello, wanderer. What brings you to this forgotten sector?';
            responseLine.classList.add('system');
            break;
            
        case '':
            return;
            
        default:
            response = `Command not found: ${command}. Type 'help' for available commands.`;
            responseLine.classList.add('warning');
    }
    
    if (response && !responseLine.innerHTML) {
        responseLine.textContent = response;
    }
    
    output.insertBefore(responseLine, output.lastElementChild);
    output.scrollTop = output.scrollHeight;
}

// ===== DATABASE POPULATION =====
function initDatabase() {
    databaseBody.innerHTML = '';
    
    databaseRecords.forEach(record => {
        const row = document.createElement('tr');
        
        let statusClass = 'status-unknown';
        if (record.status === 'ACTIVE') statusClass = 'status-active';
        if (record.status === 'BANNED') statusClass = 'status-banned';
        
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.username}</td>
            <td>${record.email}</td>
            <td>${record.last_login}</td>
            <td class="${statusClass}">${record.status}</td>
        `;
        
        databaseBody.appendChild(row);
    });
    
    const hiddenMessage = document.getElementById('hidden-db-message');
    setTimeout(() => {
        hiddenMessage.classList.add('visible');
    }, 5000);
}

// ===== ENCRYPTED TEXT =====
function initEncryptedText() {
    encryptedText.textContent = encryptedMessage;
}

function attemptDecrypt() {
    const keyInput = document.getElementById('decrypt-key');
    const key = keyInput.value.trim().toLowerCase();
    
    if (key === decryptionKey) {
        encryptedText.textContent = 'DECRYPTION SUCCESSFUL! Redirecting to intact sector...';
        encryptedText.style.color = 'var(--accent-green)';
        encryptedText.style.textShadow = 'var(--glow-cyan)';
        
        setTimeout(() => {
            showLayer('layer-intact');
        }, 2000);
    } else {
        encryptedText.textContent = 'DECRYPTION FAILED. INVALID KEY.';
        encryptedText.style.color = 'var(--accent-red)';
        
        setTimeout(() => {
            encryptedText.textContent = encryptedMessage;
            encryptedText.style.color = '';
            encryptedText.style.textShadow = '';
        }, 2000);
    }
}

// ===== ARTIFACT FUNCTIONS =====
function attemptRepair() {
    const messages = [
        '> Attempting repair sequence...',
        '> Scanning for recoverable data...',
        '> ERROR: File header corrupted',
        '> WARNING: Checksum mismatch detected',
        '> Attempting alternative recovery method...',
        '> 12% of data recoverable',
        '> Repair failed. File too damaged.',
        '> Suggestion: Try manual reconstruction'
    ];
    
    repairLog.innerHTML = '';
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.textContent = msg;
            repairLog.appendChild(p);
            repairLog.scrollTop = repairLog.scrollHeight;
        }, index * 800);
    });
}

function enhanceImage() {
    const fragments = document.querySelectorAll('.image-fragment img');
    
    messages = [
        '> Enhancing image quality...',
        '> Applying noise reduction...',
        '> WARNING: Enhancement may reveal hidden data',
        '> Scanning for embedded messages...',
        '> Found: "THE TRUTH IS BREAK"',
        '> Enhancement complete. No significant improvement.'
    ];
    
    repairLog.innerHTML = '';
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.textContent = msg;
            repairLog.appendChild(p);
            repairLog.scrollTop = repairLog.scrollHeight;
        }, index * 700);
    });
    
    fragments.forEach((fragment, index) => {
        setTimeout(() => {
            fragment.style.filter = 'contrast(2) brightness(1.5)';
            setTimeout(() => {
                fragment.style.filter = '';
            }, 500);
        }, index * 200);
    });
}

function decryptMessage() {
    messages = [
        '> Initiating decryption protocol...',
        '> Analyzing encryption pattern...',
        '> Pattern identified: Caesar cipher (ROT3)',
        '> Decrypting...',
        '> Hidden message: "WUXWK LV LQ WKH GDWD"',
        '> Note: Some characters still corrupted'
    ];
    
    repairLog.innerHTML = '';
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.textContent = msg;
            repairLog.appendChild(p);
            repairLog.scrollTop = repairLog.scrollHeight;
        }, index * 600);
    });
}

// ===== MOUSE TRAIL =====
function initMouseTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!mouseTrailEnabled) return;
        
        mouseTrail.style.opacity = '0.5';
        mouseTrail.style.left = (mouseX - 10) + 'px';
        mouseTrail.style.top = (mouseY - 10) + 'px';
    });
    
    document.addEventListener('mouseleave', () => {
        mouseTrail.style.opacity = '0';
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        if (mouseTrailEnabled) {
            mouseTrail.style.left = (trailX - 10) + 'px';
            mouseTrail.style.top = (trailY - 10) + 'px';
        }
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// ===== FLOATING ERRORS =====
function initFloatingErrors() {
    const errors = document.querySelectorAll('.floating-error');
    
    errors.forEach((error, index) => {
        setInterval(() => {
            error.style.opacity = '0';
            error.style.transform = `translateY(0) rotate(0deg)`;
            
            setTimeout(() => {
                error.style.opacity = '0.6';
                error.style.transform = `translateY(-30px) rotate(${Math.random() * 10 - 5}deg)`;
            }, 100);
            
            setTimeout(() => {
                error.style.opacity = '0';
            }, 2000);
        }, 4000 + index * 1500);
    });
}

// ===== GLITCH EFFECTS =====
function initGlitchEffects() {
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                document.body.style.transform = 'none';
            }, 50);
        }
    }, 100);
    
    setInterval(() => {
        if (Math.random() > 0.98) {
            const glitchOverlay = document.createElement('div');
            glitchOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    ${Math.random() * 360}deg,
                    rgba(255, 0, 0, 0.1) 0%,
                    transparent 50%,
                    rgba(0, 255, 255, 0.1) 100%
                );
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(glitchOverlay);
            
            setTimeout(() => {
                glitchOverlay.remove();
            }, 100);
        }
    }, 2000);
}

// ===== SUBSCRIBE ERROR =====
function showSubscribeError() {
    const modal = document.createElement('div');
    modal.className = 'subscribe-error';
    modal.innerHTML = `
        <h3>⚠️ SUBSCRIPTION FAILED</h3>
        <p>The mailing list server has been offline since 2001.</p>
        <p>Your email could not be added.</p>
        <button onclick="this.parentElement.remove()">CLOSE</button>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.remove();
    }, 5000);
}

// ===== RANDOM TEXT SCRAMBLE =====
function scrambleText(element, finalText, duration = 2000) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const iterations = 20;
    const interval = duration / iterations;
    
    let iteration = 0;
    
    const timer = setInterval(() => {
        element.textContent = finalText
            .split('')
            .map((char, index) => {
                if (index < iteration) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iteration >= finalText.length) {
            clearInterval(timer);
        }
        
        iteration += 1 / iterations;
    }, interval);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        showLayer('layer-terminal');
    }
    
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showLayer('layer-hidden');
    }
});

// ===== VISIBILITY CHANGE =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'YOU CANNOT ESCAPE';
    } else {
        document.title = 'SYS_ERROR: LOST SECTOR DETECTED';
    }
});

// ===== CONSOLE EASTER EGG =====
console.log('%c███╗   ███╗██╗███████╗███████╗██╗███╗   ██╗ ██████╗ ', 'color: #ff00ff;');
console.log('%c████╗ ████║██║██╔════╝██╔════╝██║████╗  ██║██╔════╝ ', 'color: #ff00ff;');
console.log('%c██╔████╔██║██║███████╗█████╗  ██║██╔██╗ ██║██║  ███╗', 'color: #ff00ff;');
console.log('%c██║╚██╔╝██║██║╚════██║██╔══╝  ██║██║╚██╗██║██║   ██║', 'color: #ff00ff;');
console.log('%c██║ ╚═╝ ██║██║███████║███████╗██║██║ ╚████║╚██████╔╝', 'color: #00ffcc;');
console.log('%c╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ', 'color: #00ffcc;');
console.log('%c\nYou found the console. The secrets run deeper...', 'color: #888; font-style: italic;');
console.log('%cTry: document.querySelector(".hidden-link").click()', 'color: #ffcc00;');

// ===== TITLE SCRAMBLE ON LOAD =====
window.addEventListener('load', () => {
    const originalTitle = 'SYS_ERROR: LOST SECTOR DETECTED';
    scrambleText(document.querySelector('title'), originalTitle, 1500);
});
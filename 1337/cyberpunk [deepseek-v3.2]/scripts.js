// CYBERPUNK HACKING TERMINAL - SCRIPT MODULE
// Version: 4.2.1
// Author: Neon_Cypher

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    codeRain: document.getElementById('code-rain'),
    hexStream: document.getElementById('hex-stream'),
    liveClock: document.getElementById('live-clock'),
    terminalOutput: document.getElementById('terminal-output'),
    commandInput: document.getElementById('command-input'),
    encryptionOutput: document.getElementById('encryption-output'),
    encryptBtn: document.getElementById('encrypt-btn'),
    decryptBtn: document.getElementById('decrypt-btn'),
    sessionTimer: document.getElementById('session-timer'),
    binaryLine1: document.getElementById('binary-line-1'),
    binaryLine2: document.getElementById('binary-line-2'),
    cpuGraph: document.getElementById('cpu-graph')
};

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const CONFIG = {
    // Code Rain characters
    CODE_CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"#&_(),.;:?!\\|{}<>[]^~',
    
    // Hex stream characters
    HEX_CHARS: '0123456789ABCDEF',
    
    // Terminal commands and responses
    COMMANDS: {
        'help': 'Available commands: help, clear, whoami, system_status, scan_network, encrypt [text], decrypt [text], date, time, reboot',
        'clear': 'clear',
        'whoami': 'user: anonymous_h4x0r<br>access_level: 7<br>status: verified',
        'system_status': 'core_temp: 42°C<br>bandwidth: 847Mbps<br>threat_level: LOW<br>firewall: ACTIVE',
        'scan_network': 'scanning...<br>> TARGETS FOUND: 47<br>> ENCRYPTED NODES: 12<br>> VULNERABILITIES: 3',
        'date': new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        'time': () => new Date().toLocaleTimeString('en-US', { hour12: false }),
        'reboot': 'Initiating system reboot...<br>3... 2... 1...<br>SYSTEM REBOOTED'
    },
    
    // Encryption ciphers
    CIPHERS: {
        'rot13': (text) => text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)),
        'caesar': (text, shift = 3) => text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + shift) ? c : c - 26)),
        'binary': (text) => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
        'hex': (text) => text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase()).join(' ')
    },
    
    // Glitch effects configuration
    GLITCH_INTERVAL: 10000, // 10 seconds
    MIN_GLITCH_DELAY: 5000,
    MAX_GLITCH_DELAY: 15000
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    sessionStartTime: new Date(),
    terminalHistory: [],
    encryptionHistory: [],
    glitchTimeout: null,
    codeRainInterval: null,
    hexStreamInterval: null,
    cpuData: Array(60).fill(0),
    memoryData: Array(60).fill(0),
    networkData: Array(60).fill(0),
    dataIndex: 0
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('Initializing Cyberpunk Hacking Terminal v4.2.1...');
    
    // Initialize all components
    initCodeRain();
    initHexStream();
    initLiveClock();
    initSessionTimer();
    initTerminal();
    initEncryptionTools();
    initBinaryStream();
    initCPUChart();
    initGlitchEffects();
    initAudio();
    
    // Add initial log entry
    addLogEntry('SYSTEM INITIALIZED', 'SUCCESS');
    
    console.log('Terminal ready. Type "help" for available commands.');
}

// ============================================
// CODE RAIN BACKGROUND
// ============================================
function initCodeRain() {
    // Create code rain effect (Matrix-style falling characters)
    const columns = Math.floor(window.innerWidth / 20);
    let drops = Array(columns).fill(0);
    
    function drawCodeRain() {
        if (!elements.codeRain) return;
        
        // Add new characters
        for (let i = 0; i < drops.length; i++) {
            // Randomly change characters
            if (Math.random() > 0.975) {
                const char = CONFIG.CODE_CHARS[Math.floor(Math.random() * CONFIG.CODE_CHARS.length)];
                const span = document.createElement('span');
                span.textContent = char;
                span.style.position = 'absolute';
                span.style.left = `${i * 20}px`;
                span.style.top = `${drops[i] * 20}px`;
                span.style.color = `hsl(${120 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`;
                span.style.opacity = `${0.1 + Math.random() * 0.3}`;
                span.style.fontSize = `${14 + Math.random() * 6}px`;
                span.style.textShadow = '0 0 5px currentColor';
                
                elements.codeRain.appendChild(span);
                
                // Remove after animation
                setTimeout(() => {
                    if (span.parentNode) {
                        span.parentNode.removeChild(span);
                    }
                }, 2000);
            }
            
            drops[i]++;
            
            // Reset drop if it goes beyond screen
            if (drops[i] * 20 > window.innerHeight && Math.random() > 0.99) {
                drops[i] = 0;
            }
        }
    }
    
    // Clear existing content and start animation
    elements.codeRain.innerHTML = '';
    state.codeRainInterval = setInterval(drawCodeRain, 50);
}

// ============================================
// HEX DATA STREAM
// ============================================
function initHexStream() {
    function updateHexStream() {
        if (!elements.hexStream) return;
        
        // Generate random hex data
        let hexData = '';
        const lines = 4;
        const charsPerLine = 24;
        
        for (let line = 0; line < lines; line++) {
            for (let i = 0; i < charsPerLine; i++) {
                hexData += CONFIG.HEX_CHARS[Math.floor(Math.random() * CONFIG.HEX_CHARS.length)];
                if (i % 2 === 1 && i < charsPerLine - 1) {
                    hexData += ' ';
                }
            }
            hexData += '<br>';
        }
        
        // Add some real-looking hex values occasionally
        if (Math.random() > 0.7) {
            const realHexes = [
                '0xDEADBEEF', '0xCAFEBABE', '0xFACEB00C', '0xDECAFBAD',
                '0xFEEDFACE', '0xBADCODE1', '0xCOFFEEFF', '0xDEFACED0'
            ];
            hexData = hexData.replace(
                /[0-9A-F]{8}/,
                realHexes[Math.floor(Math.random() * realHexes.length)]
            );
        }
        
        elements.hexStream.innerHTML = hexData;
        
        // Occasionally trigger a "data burst"
        if (Math.random() > 0.95) {
            triggerDataBurst();
        }
    }
    
    function triggerDataBurst() {
        const originalColor = elements.hexStream.style.color;
        elements.hexStream.style.color = '#ff00ff';
        elements.hexStream.style.textShadow = '0 0 10px #ff00ff';
        
        setTimeout(() => {
            elements.hexStream.style.color = originalColor;
            elements.hexStream.style.textShadow = '';
        }, 300);
        
        playSound('glitch');
    }
    
    updateHexStream();
    state.hexStreamInterval = setInterval(updateHexStream, 100);
}

// ============================================
// LIVE CLOCK
// ============================================
function initLiveClock() {
    function updateClock() {
        if (!elements.liveClock) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        elements.liveClock.textContent = timeString;
        
        // Add occasional glitch effect
        if (Math.random() > 0.99) {
            const originalText = timeString;
            elements.liveClock.textContent = timeString.replace(/\d/g, () => 
                Math.floor(Math.random() * 10)
            );
            
            setTimeout(() => {
                elements.liveClock.textContent = originalText;
            }, 100);
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================
// SESSION TIMER
// ============================================
function initSessionTimer() {
    function updateSessionTimer() {
        if (!elements.sessionTimer) return;
        
        const now = new Date();
        const diff = Math.floor((now - state.sessionStartTime) / 1000);
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        elements.sessionTimer.textContent = 
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }
    
    updateSessionTimer();
    setInterval(updateSessionTimer, 1000);
}

// ============================================
// INTERACTIVE TERMINAL
// ============================================
function initTerminal() {
    if (!elements.commandInput || !elements.terminalOutput) return;
    
    // Handle terminal input
    elements.commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            
            if (command) {
                // Add command to history
                state.terminalHistory.push(command);
                
                // Process command
                processCommand(command);
                
                // Clear input
                this.value = '';
                
                // Play typing sound
                playSound('typing');
            }
        }
    });
    
    // Add focus effect
    elements.commandInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
    });
    
    elements.commandInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '';
    });
}

function processCommand(command) {
    // Add command to terminal output
    addTerminalLine(`root@neon-cypher:~$ ${command}`);
    
    // Check for special commands
    if (command === 'clear') {
        clearTerminal();
        return;
    }
    
    // Check for encrypt/decrypt commands
    if (command.startsWith('encrypt ') || command.startsWith('decrypt ')) {
        const parts = command.split(' ');
        const action = parts[0];
        const text = parts.slice(1).join(' ');
        
        if (text) {
            if (action === 'encrypt') {
                const encrypted = encryptText(text);
                addTerminalLine(encrypted);
                updateEncryptionOutput(`ENCRYPTED: ${encrypted}`);
            } else {
                const decrypted = decryptText(text);
                addTerminalLine(decrypted);
                updateEncryptionOutput(`DECRYPTED: ${decrypted}`);
            }
        } else {
            addTerminalLine('Error: No text provided');
        }
        return;
    }
    
    // Check for known commands
    if (CONFIG.COMMANDS[command]) {
        let response = CONFIG.COMMANDS[command];
        
        // If response is a function, call it
        if (typeof response === 'function') {
            response = response();
        }
        
        addTerminalLine(response);
    } else {
        addTerminalLine(`Command not found: ${command}. Type 'help' for available commands.`);
    }
}

function addTerminalLine(text, isCommand = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">root@neon-cypher:~$</span> <span class="command">${text}</span>`;
    } else {
        line.innerHTML = `<span class="output">${text}</span>`;
    }
    
    elements.terminalOutput.appendChild(line);
    
    // Scroll to bottom
    elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
    
    // Add to history
    state.terminalHistory.push(text);
}

function clearTerminal() {
    elements.terminalOutput.innerHTML = '';
}

// ============================================
// ENCRYPTION TOOLS
// ============================================
function initEncryptionTools() {
    if (!elements.encryptBtn || !elements.decryptBtn) return;
    
    // Sample texts for encryption
    const sampleTexts = [
        'ACCESS GRANTED',
        'SYSTEM BREACH DETECTED',
        'DATA STREAM ENCRYPTED',
        'FIREWALL ACTIVE',
        'NEURAL NETWORK ONLINE',
        'QUANTUM ENCRYPTION ACTIVE',
        'CYBERPUNK TERMINAL v4.2.1',
        'HACK THE PLANET'
    ];
    
    elements.encryptBtn.addEventListener('click', function() {
        const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        const encrypted = encryptText(text);
        updateEncryptionOutput(`ENCRYPTED: ${encrypted}`);
        addLogEntry(`ENCRYPTION: ${text} -> ${encrypted}`, 'INFO');
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        playSound('typing');
    });
    
    elements.decryptBtn.addEventListener('click', function() {
        const randomEncrypted = [
            'NFFRP TEBTUNAQ',
            '10001100 10000101 10010011',
            '0x444154412053545245414D',
            'KHOOR ZRUOG',
            '48 41 43 4B 20 54 48 45 20 50 4C 41 4E 45 54'
        ][Math.floor(Math.random() * 5)];
        
        const decrypted = decryptText(randomEncrypted);
        updateEncryptionOutput(`DECRYPTED: ${decrypted}`);
        addLogEntry(`DECRYPTION: ${randomEncrypted} -> ${decrypted}`, 'INFO');
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        playSound('typing');
    });
}

function encryptText(text) {
    const ciphers = Object.keys(CONFIG.CIPHERS);
    const cipherName = ciphers[Math.floor(Math.random() * ciphers.length)];
    const cipher = CONFIG.CIPHERS[cipherName];
    
    let result;
    if (cipherName === 'caesar') {
        const shift = Math.floor(Math.random() * 10) + 1;
        result = cipher(text, shift);
    } else {
        result = cipher(text);
    }
    
    // Store in history
    state.encryptionHistory.push({
        original: text,
        encrypted: result,
        cipher: cipherName,
        timestamp: new Date()
    });
    
    return result;
}

function decryptText(text) {
    // Try to detect cipher type
    if (/^[01\s]+$/.test(text)) {
        // Binary
        return text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    } else if (/^[0-9A-F\s]+$/.test(text) && text.length > 8) {
        // Hex
        return text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    } else if (/^[A-Z\s]+$/.test(text)) {
        // Try ROT13 or Caesar
        return CONFIG.CIPHERS.rot13(text);
    } else {
        return 'DECRYPTION FAILED: Unknown cipher';
    }
}

function updateEncryptionOutput(text) {
    if (!elements.encryptionOutput) return;
    
    // Add typing effect
    elements.encryptionOutput.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            elements.encryptionOutput.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        }
    }
    
    typeWriter();
}

// ============================================
// BINARY STREAM ANIMATION
// ============================================
function initBinaryStream() {
    function animateBinaryStream() {
        if (!elements.binaryLine1 || !elements.binaryLine2) return;
        
        // Create flowing binary effect
        const length1 = elements.binaryLine1.textContent.length;
        const length2 = elements.binaryLine2.textContent.length;
        
        // Move characters
        const moveText = (text) => {
            return text.substring(1) + text.charAt(0);
        };
        
        elements.binaryLine1.textContent = moveText(elements.binaryLine1.textContent);
        elements.binaryLine2.textContent = moveText(elements.binaryLine2.textContent);
        
        // Occasionally change random bits
        if (Math.random() > 0.9) {
            const texts = [elements.binaryLine1.textContent, elements.binaryLine2.textContent];
            const randomLine = Math.random() > 0.5 ? elements.binaryLine1 : elements.binaryLine2;
            const textArray = randomLine.textContent.split('');
            
            // Flip 3-5 random bits
            const flips = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < flips; i++) {
                const pos = Math.floor(Math.random() * textArray.length);
                textArray[pos] = textArray[pos] === '0' ? '1' : '0';
            }
            
            randomLine.textContent = textArray.join('');
        }
    }
    
    // Set initial binary text
    elements.binaryLine1.textContent = '011010000110000101100011011010110110010101110010001000000111010001100101011100100110110101101001011011100110000101101100';
    elements.binaryLine2.textContent = '0100001101111001011000100110010101110010011100000111010101101110011010110010000001101110011001010111010001110111011011110111001001101011';
    
    setInterval(animateBinaryStream, 150);
}

// ============================================
// CPU CHART
// ============================================
function initCPUChart() {
    if (!elements.cpuGraph) return;
    
    const ctx = elements.cpuGraph.getContext('2d');
    elements.cpuGraph.width = elements.cpuGraph.clientWidth;
    elements.cpuGraph.height = elements.cpuGraph.clientHeight;
    
    function drawChart() {
        // Update data
        state.cpuData[state.dataIndex] = 50 + Math.random() * 40;
        state.memoryData[state.dataIndex] = 40 + Math.random() * 35;
        state.networkData[state.dataIndex] = 30 + Math.random() * 45;
        
        state.dataIndex = (state.dataIndex + 1) % state.cpuData.length;
        
        // Clear canvas
        ctx.clearRect(0, 0, elements.cpuGraph.width, elements.cpuGraph.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let i = 0; i <= 5; i++) {
            const y = (elements.cpuGraph.height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(elements.cpuGraph.width, y);
            ctx.stroke();
        }
        
        // Draw CPU line
        drawDataLine(ctx, state.cpuData, '#00ff00', 2);
        
        // Draw Memory line
        drawDataLine(ctx, state.memoryData, '#ff00ff', 2);
        
        // Draw Network line
        drawDataLine(ctx, state.networkData, '#00ffff', 2);
        
        // Update stat bars
        updateStatBars();
    }
    
    function drawDataLine(context, data, color, lineWidth) {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        
        const sliceWidth = elements.cpuGraph.width / data.length;
        let x = 0;
        
        for (let i = 0; i < data.length; i++) {
            const v = data[i] / 100;
            const y = elements.cpuGraph.height * (1 - v);
            
            if (i === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        context.stroke();
        
        // Add glow effect
        context.shadowColor = color;
        context.shadowBlur = 10;
        context.stroke();
        context.shadowBlur = 0;
    }
    
    function updateStatBars() {
        const cpuValue = Math.round(state.cpuData[state.dataIndex]);
        const memoryValue = Math.round(state.memoryData[state.dataIndex]);
        const networkValue = Math.round(state.networkData[state.dataIndex]);
        
        // Update CPU stat bar
        const cpuFill = document.querySelector('.system-stats .stat:nth-child(1) .stat-fill');
        const cpuValueEl = document.querySelector('.system-stats .stat:nth-child(1) .stat-value');
        
        if (cpuFill && cpuValueEl) {
            cpuFill.style.width = `${cpuValue}%`;
            cpuValueEl.textContent = `${cpuValue}%`;
        }
        
        // Update Memory stat bar
        const memoryFill = document.querySelector('.system-stats .stat:nth-child(2) .stat-fill');
        const memoryValueEl = document.querySelector('.system-stats .stat:nth-child(2) .stat-value');
        
        if (memoryFill && memoryValueEl) {
            memoryFill.style.width = `${memoryValue}%`;
            memoryValueEl.textContent = `${memoryValue}%`;
        }
        
        // Update Network stat bar
        const networkFill = document.querySelector('.system-stats .stat:nth-child(3) .stat-fill');
        const networkValueEl = document.querySelector('.system-stats .stat:nth-child(3) .stat-value');
        
        if (networkFill && networkValueEl) {
            networkFill.style.width = `${networkValue}%`;
            networkValueEl.textContent = `${networkValue}%`;
        }
    }
    
    // Initial draw
    drawChart();
    setInterval(drawChart, 500);
}

// ============================================
// GLITCH EFFECTS
// ============================================
function initGlitchEffects() {
    function triggerGlitch() {
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (!glitchOverlay) return;
        
        // Random glitch intensity
        const intensity = 0.05 + Math.random() * 0.1;
        
        // Apply glitch effect
        glitchOverlay.style.opacity = intensity;
        glitchOverlay.style.transform = `translateX(${(Math.random() - 0.5) * 10}px)`;
        
        // Play glitch sound occasionally
        if (Math.random() > 0.7) {
            playSound('glitch');
        }
        
        // Add random elements to terminal
        if (Math.random() > 0.8) {
            addRandomGlitchToTerminal();
        }
        
        // Reset after short duration
        setTimeout(() => {
            glitchOverlay.style.opacity = 0;
            glitchOverlay.style.transform = 'translateX(0)';
        }, 100 + Math.random() * 200);
        
        // Schedule next glitch
        scheduleNextGlitch();
    }
    
    function addRandomGlitchToTerminal() {
        const glitches = [
            'ERROR: MEMORY CORRUPTION DETECTED',
            'WARNING: INTRUSION ATTEMPT BLOCKED',
            'SYSTEM: UNEXPECTED DATA PACKET RECEIVED',
            'SECURITY: FIREWALL UPDATED',
            'NETWORK: DATA STREAM INTERRUPTED',
            'CRYPTO: ENCRYPTION KEY ROTATED'
        ];
        
        const randomGlitch = glitches[Math.floor(Math.random() * glitches.length)];
        addTerminalLine(`[GLITCH] ${randomGlitch}`);
        
        // Add to logs
        addLogEntry(randomGlitch, 'WARNING');
    }
    
    function scheduleNextGlitch() {
        const delay = CONFIG.MIN_GLITCH_DELAY + 
                     Math.random() * (CONFIG.MAX_GLITCH_DELAY - CONFIG.MIN_GLITCH_DELAY);
        
        state.glitchTimeout = setTimeout(triggerGlitch, delay);
    }
    
    // Start the glitch cycle
    scheduleNextGlitch();
}

// ============================================
// AUDIO EFFECTS
// ============================================
function initAudio() {
    // Audio elements are loaded in HTML
    console.log('Audio system initialized');
}

function playSound(type) {
    try {
        if (type === 'typing') {
            const audio = document.getElementById('typing-sound');
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        } else if (type === 'glitch') {
            const audio = document.getElementById('glitch-sound');
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.2;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        }
    } catch (e) {
        // Silent fail if audio can't play
    }
}

// ============================================
// LOGGING SYSTEM
// ============================================
function addLogEntry(event, type = 'INFO') {
    const logsContainer = document.querySelector('.log-entries');
    if (!logsContainer) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    let typeColor = '#00ff00'; // INFO - green
    if (type === 'WARNING') typeColor = '#ffff00';
    if (type === 'ERROR') typeColor = '#ff0000';
    if (type === 'SUCCESS') typeColor = '#00ff00';
    
    logEntry.innerHTML = `
        <span class="log-time" style="color: ${typeColor}">[${timeString}]</span>
        <span class="log-event">${event}</span>
    `;
    
    logsContainer.appendChild(logEntry);
    
    // Limit to 10 entries
    const entries = logsContainer.querySelectorAll('.log-entry');
    if (entries.length > 10) {
        entries[0].remove();
    }
    
    // Scroll to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
function handleResize() {
    // Reinitialize code rain with new column count
    if (state.codeRainInterval) {
        clearInterval(state.codeRainInterval);
    }
    initCodeRain();
    
    // Resize CPU chart
    if (elements.cpuGraph) {
        elements.cpuGraph.width = elements.cpuGraph.clientWidth;
        elements.cpuGraph.height = elements.cpuGraph.clientHeight;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
window.addEventListener('resize', handleResize);

// Add click effects to cyber buttons
document.querySelectorAll('.cyber-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        playSound('typing');
    });
});

// Add hover effects to modules
document.querySelectorAll('.module').forEach(module => {
    module.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.7)';
        this.style.transform = 'translateY(-2px)';
    });
    
    module.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// STARTUP
// ============================================
// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.CyberpunkTerminal = {
    version: '4.2.1',
    state,
    config: CONFIG,
    commands: Object.keys(CONFIG.COMMANDS),
    encrypt: encryptText,
    decrypt: decryptText,
    addLogEntry,
    triggerGlitch: () => {
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.style.opacity = '0.15';
            setTimeout(() => {
                glitchOverlay.style.opacity = '0';
            }, 200);
        }
    }
};

console.log('Cyberpunk Hacking Terminal module loaded.');
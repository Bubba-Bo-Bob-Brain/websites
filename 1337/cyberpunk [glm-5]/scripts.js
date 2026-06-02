const CONFIG = {
    matrixChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    matrixFontSize: 14,
    matrixSpeed: 33,
    streamUpdateInterval: 100,
    metricUpdateInterval: 2000,
    nodeScanInterval: 300,
    logInterval: 5000,
    breachCountTarget: 247,
    breachCountDuration: 3000
};

const state = {
    breachCount: 0,
    uptime: 0,
    commandHistory: [],
    historyIndex: -1
};

const terminalCommands = {
    help: () => {
        return [
            { type: 'text', msg: 'Available commands:' },
            { type: 'text', msg: '  help     - Display this help message' },
            { type: 'text', msg: '  status   - Show system status' },
            { type: 'text', msg: '  scan     - Scan network nodes' },
            { type: 'text', msg: '  exploit  - Run exploit modules' },
            { type: 'text', msg: '  clear    - Clear terminal' },
            { type: 'text', msg: '  whoami   - Display current user' },
            { type: 'text', msg: '  exit     - Terminate connection' },
            { type: 'text', msg: '  matrix   - Toggle matrix rain' },
            { type: 'text', msg: '  breach   - Show breach statistics' }
        ];
    },
    status: () => {
        const cpuVal = Math.floor(Math.random() * 40 + 30);
        const memVal = Math.floor(Math.random() * 30 + 40);
        return [
            { type: 'ok', msg: 'System Status Report:' },
            { type: 'text', msg: `  CPU Usage: ${cpuVal}%` },
            { type: 'text', msg: `  Memory: ${memVal}%` },
            { type: 'text', msg: '  Active Connections: 7' },
            { type: 'text', msg: '  Encrypted Tunnels: 3' },
            { type: 'text', msg: '  Firewall Status: BYPASSED' },
            { type: 'warn', msg: '  Detection Risk: LOW' }
        ];
    },
    scan: () => {
        setTimeout(() => scanNetworkNodes(), 100);
        return [
            { type: 'ok', msg: 'Initiating network scan...' },
            { type: 'text', msg: '  Scanning 192.168.1.0/24 subnet' },
            { type: 'text', msg: '  Found 47 active nodes' },
            { type: 'ok', msg: 'Scan complete. Vulnerabilities detected: 12' }
        ];
    },
    exploit: () => {
        const modules = ['SQL Injection', 'Brute Force', 'Zero Day', 'Phishing Grid'];
        const selected = modules[Math.floor(Math.random() * modules.length)];
        triggerGlitch();
        return [
            { type: 'warn', msg: 'Loading exploit module...' },
            { type: 'text', msg: `  Selected: ${selected}` },
            { type: 'text', msg: '  Injecting payload...' },
            { type: 'ok', msg: 'Payload delivered successfully' },
            { type: 'text', msg: '  Backdoor established on target' }
        ];
    },
    clear: () => {
        clearTerminal();
        return [];
    },
    whoami: () => {
        return [
            { type: 'text', msg: 'User: root' },
            { type: 'text', msg: 'UID: 0' },
            { type: 'text', msg: 'GID: 0' },
            { type: 'text', msg: 'Groups: wheel,admin,developers' },
            { type: 'text', msg: 'Session: NEXUS-BREACH-7X9' }
        ];
    },
    exit: () => {
        return [
            { type: 'warn', msg: 'Terminating connection...' },
            { type: 'text', msg: '  Clearing traces...' },
            { type: 'text', msg: '  Wiping logs...' },
            { type: 'ok', msg: 'Connection terminated. Goodbye.' }
        ];
    },
    matrix: () => {
        const canvas = document.getElementById('matrix-rain');
        canvas.style.opacity = canvas.style.opacity === '0.3' ? '0.15' : '0.3';
        return [
            { type: 'ok', msg: 'Matrix rain toggled' }
        ];
    },
    breach: () => {
        return [
            { type: 'text', msg: 'Breach Statistics:' },
            { type: 'text', msg: `  Systems Compromised: ${state.breachCount}` },
            { type: 'text', msg: '  Data Extracted: 847.3 TB' },
            { type: 'text', msg: '  Active Backdoors: 23' },
            { type: 'text', msg: '  Zero-day Exploits: 7' },
            { type: 'warn', msg: '  Global Threat Level: ELEVATED' }
        ];
    }
};

function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const columns = Math.floor(canvas.width / CONFIG.matrixFontSize);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `${CONFIG.matrixFontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const char = CONFIG.matrixChars[Math.floor(Math.random() * CONFIG.matrixChars.length)];
            const x = i * CONFIG.matrixFontSize;
            const y = drops[i] * CONFIG.matrixFontSize;
            
            const gradient = ctx.createLinearGradient(x, y - 100, x, y);
            gradient.addColorStop(0, 'rgba(57, 255, 20, 0)');
            gradient.addColorStop(1, 'rgba(57, 255, 20, 1)');
            
            ctx.fillStyle = gradient;
            ctx.fillText(char, x, y);
            
            ctx.fillStyle = 'rgba(57, 255, 20, 0.5)';
            ctx.fillText(char, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, CONFIG.matrixSpeed);
}

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            if (command) {
                state.commandHistory.unshift(command);
                state.historyIndex = -1;
                processCommand(command);
            }
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.historyIndex < state.commandHistory.length - 1) {
                state.historyIndex++;
                input.value = state.commandHistory[state.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                input.value = state.commandHistory[state.historyIndex];
            } else {
                state.historyIndex = -1;
                input.value = '';
            }
        }
    });
    
    input.focus();
    document.addEventListener('click', () => input.focus());
}

function processCommand(cmd) {
    const output = document.getElementById('terminal-output');
    
    addTerminalLine(`./${cmd}`, 'command');
    
    const handler = terminalCommands[cmd];
    if (handler) {
        const results = handler();
        results.forEach((item, index) => {
            setTimeout(() => {
                addTerminalLine(item.msg, item.type);
            }, index * 100);
        });
    } else if (cmd !== 'clear') {
        addTerminalLine(`Command not found: ${cmd}`, 'error');
        addTerminalLine('Type "help" for available commands', 'text');
    }
    
    setTimeout(() => {
        addTerminalLine('', 'prompt');
    }, 500);
}

function addTerminalLine(text, type) {
    const output = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'prompt') {
        line.innerHTML = `<span class="prompt">root@nexus:~#</span> <span class="cursor-blink">_</span>`;
    } else if (type === 'command') {
        line.innerHTML = `<span class="prompt">root@nexus:~#</span> <span class="command">./${text}</span>`;
    } else {
        const msgClass = type === 'ok' ? 'system-msg' : type === 'warn' ? 'system-msg warn' : type === 'error' ? 'system-msg error' : 'system-msg';
        const prefix = type === 'ok' ? '[OK]' : type === 'warn' ? '[!!]' : type === 'error' ? '[XX]' : '[--]';
        line.innerHTML = `<span class="${msgClass}">${prefix}</span> ${text}`;
        line.classList.add('output-text');
    }
    
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    
    const existingCursor = output.querySelector('.cursor-blink');
    if (existingCursor && type !== 'prompt') {
        const cursorLine = existingCursor.closest('.terminal-line');
        if (cursorLine && cursorLine !== line) {
            cursorLine.remove();
        }
    }
}

function clearTerminal() {
    const output = document.getElementById('terminal-output');
    output.innerHTML = '';
    addTerminalLine('', 'prompt');
}

function initDataStream() {
    const stream = document.getElementById('data-stream');
    
    function generateHexLine() {
        let hex = '';
        for (let i = 0; i < 32; i++) {
            hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0') + ' ';
        }
        return hex.toUpperCase();
    }
    
    function addStreamLine() {
        const line = document.createElement('div');
        line.className = 'stream-line';
        line.textContent = generateHexLine();
        
        if (stream.children.length > 8) {
            stream.removeChild(stream.firstChild);
        }
        
        stream.appendChild(line);
    }
    
    setInterval(addStreamLine, CONFIG.streamUpdateInterval);
}

function initNetworkNodes() {
    const grid = document.getElementById('network-grid');
    
    for (let i = 0; i < 32; i++) {
        const node = document.createElement('div');
        node.className = 'network-node';
        grid.appendChild(node);
    }
}

function scanNetworkNodes() {
    const nodes = document.querySelectorAll('.network-node');
    
    nodes.forEach((node, index) => {
        setTimeout(() => {
            node.classList.add('scanning');
            
            if (Math.random() > 0.6) {
                setTimeout(() => {
                    node.classList.add('active');
                }, 250);
            }
            
            setTimeout(() => {
                node.classList.remove('scanning');
            }, 500);
        }, index * 50);
    });
}

function initMetrics() {
    function updateMetrics() {
        const cpuBar = document.getElementById('cpu-bar');
        const cpuVal = document.getElementById('cpu-val');
        const memBar = document.getElementById('mem-bar');
        const memVal = document.getElementById('mem-val');
        const netBar = document.getElementById('net-bar');
        const netVal = document.getElementById('net-val');
        
        const cpu = Math.floor(Math.random() * 40 + 25);
        const mem = Math.floor(Math.random() * 30 + 45);
        const net = (Math.random() * 50 + 10).toFixed(1);
        
        cpuBar.style.width = cpu + '%';
        cpuVal.textContent = cpu + '%';
        
        memBar.style.width = mem + '%';
        memVal.textContent = mem + '%';
        
        netBar.style.width = (net / 60 * 100) + '%';
        netVal.textContent = net + ' MB/s';
    }
    
    updateMetrics();
    setInterval(updateMetrics, CONFIG.metricUpdateInterval);
}

function initBreachCounter() {
    const counter = document.getElementById('breach-count');
    const target = CONFIG.breachCountTarget;
    const duration = CONFIG.breachCountDuration;
    const startTime = performance.now();
    
    function update() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        state.breachCount = Math.floor(easeOut * target);
        
        counter.textContent = state.breachCount.toString().padStart(3, '0');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    setTimeout(update, 500);
}

function initTimestamp() {
    const timestampEl = document.getElementById('timestamp');
    
    function updateTimestamp() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        timestampEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
}

function initUptime() {
    const uptimeEl = document.getElementById('uptime');
    const startTime = Date.now();
    
    function updateUptime() {
        state.uptime = Math.floor((Date.now() - startTime) / 1000);
        
        const hours = Math.floor(state.uptime / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((state.uptime % 3600) / 60).toString().padStart(2, '0');
        const seconds = (state.uptime % 60).toString().padStart(2, '0');
        
        uptimeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateUptime();
    setInterval(updateUptime, 1000);
}

function initLogToggle() {
    const toggle = document.getElementById('log-toggle');
    const content = document.getElementById('log-content');
    
    toggle.addEventListener('click', () => {
        content.classList.toggle('expanded');
        toggle.textContent = content.classList.contains('expanded') ? 'COLLAPSE' : 'EXPAND';
    });
}

function addLogEntry(type, message) {
    const content = document.getElementById('log-content');
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-type">[${type.toUpperCase()}]</span>
        <span class="log-msg">${message}</span>
    `;
    
    content.appendChild(entry);
    content.scrollTop = content.scrollHeight;
}

function initAutoLogs() {
    const messages = [
        { type: 'info', msg: 'Scanning port range 1-65535...' },
        { type: 'success', msg: 'Connection established to node 192.168.1.47' },
        { type: 'info', msg: 'Decrypting SSL traffic...' },
        { type: 'warn', msg: 'Anomaly detected in packet stream' },
        { type: 'success', msg: 'Firewall rule bypassed' },
        { type: 'info', msg: 'Extracting credentials from memory dump' },
        { type: 'error', msg: 'Connection timeout on node 192.168.1.89' },
        { type: 'success', msg: 'Payload injection successful' },
        { type: 'info', msg: 'Mapping network topology...' },
        { type: 'warn', msg: 'Intrusion detection system triggered' },
        { type: 'success', msg: 'Countermeasures deployed successfully' },
        { type: 'info', msg: 'Synchronizing with C2 server...' }
    ];
    
    let index = 0;
    
    function addNextLog() {
        const msg = messages[index % messages.length];
        addLogEntry(msg.type, msg.msg);
        index++;
    }
    
    setInterval(addNextLog, CONFIG.logInterval);
}

function triggerGlitch() {
    const overlay = document.querySelector('.glitch-overlay');
    overlay.classList.add('active');
    
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 100);
}

function initModuleCards() {
    const cards = document.querySelectorAll('.module-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const moduleName = card.querySelector('.module-title').textContent;
            triggerGlitch();
            
            addLogEntry('warn', `Module activated: ${moduleName}`);
            
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'module-pulse 0.5s ease';
        });
    });
}

function initCharAnimation() {
    const chars = document.querySelectorAll('.char-animate');
    
    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.05 + 1}s`;
    });
}

function init() {
    initMatrixRain();
    initTerminal();
    initDataStream();
    initNetworkNodes();
    initMetrics();
    initBreachCounter();
    initTimestamp();
    initUptime();
    initLogToggle();
    initAutoLogs();
    initModuleCards();
    initCharAnimation();
    
    setTimeout(() => {
        scanNetworkNodes();
    }, 2000);
    
    addLogEntry('success', 'NEXUS BREACH system initialized');
    addLogEntry('info', 'Awaiting command input...');
}

document.addEventListener('DOMContentLoaded', init);
// Matrix Rain Canvas
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}
resizeMatrixCanvas();
window.addEventListener('resize', resizeMatrixCanvas);

const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>!@#$%^&*';
const fontSize = 14;
let columns = Math.floor(matrixCanvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    matrixCtx.fillStyle = '#39ff14';
    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        matrixCtx.globalAlpha = Math.random() * 0.5 + 0.1;
        matrixCtx.fillText(char, x, y);

        if (y > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    matrixCtx.globalAlpha = 1;
    requestAnimationFrame(drawMatrix);
}
drawMatrix();

// Clock
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// Typing Effect
const typingLines = [
    '> Initializing breach sequence...',
    '> Scanning network: 192.168.1.0/24',
    '> Exploiting vulnerability CVE-2024-1337',
    '> Injecting payload into memory space',
    '> Establishing encrypted reverse shell',
    '> Extracting classified documents...',
    '> WARNING: Trace detected — rerouting through proxy',
    '> Breach complete. All systems compromised.',
];

let lineIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingTarget = document.getElementById('typing-target');

function typeEffect() {
    const currentLine = typingLines[lineIndex];

    if (!isDeleting) {
        typingTarget.textContent = currentLine.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentLine.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        setTimeout(typeEffect, 40);
    } else {
        typingTarget.textContent = currentLine.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            lineIndex = (lineIndex + 1) % typingLines.length;
            setTimeout(typeEffect, 500);
            return;
        }
        setTimeout(typeEffect, 20);
    }
}
setTimeout(typeEffect, 1000);

// Animated Stats Counter
function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            stat.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });
}
setTimeout(animateCounters, 500);

// Terminal Command Handler
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: () => {
        return [
            'Available commands:',
            '  help        — Show this help message',
            '  status      — System status report',
            '  scan        — Scan network for targets',
            '  exploit     — Run exploit module',
            '  clear       — Clear terminal',
            '  whoami      — Display current user',
            '  ls          — List directory contents',
            '  cat         — Read file contents',
            '  ping        — Ping target host',
            '  trace       — Trace network route',
            '  exit        — Disconnect session',
        ].join('\n');
    },
    status: () => {
        return [
            '╔══════════════════════════════════════╗',
            '║  SYSTEM STATUS: OPERATIONAL          ║',
            '║  CPU: 73%  MEM: 61%  NET: 847 Mb/s   ║',
            '║  Uptime: 847d 12h 03m                ║',
            '║  Threat Level: CRITICAL              ║',
            '╚══════════════════════════════════════╝',
        ].join('\n');
    },
    scan: () => {
        const targets = [
            'Scanning 192.168.1.1... [OPEN] Port 22',
            'Scanning 192.168.1.45... [OPEN] Port 80',
            'Scanning 192.168.1.100... [OPEN] Port 443',
            'Scanning 192.168.1.200... [FILTERED]',
            'Scanning 10.0.0.1... [OPEN] Port 3306',
            'Scan complete. 4 targets found.',
        ];
        return targets.join('\n');
    },
    exploit: () => {
        return [
            '> Loading exploit module: EternalBlue',
            '> Target: 192.168.1.45:445',
            '> Sending payload...',
            '> [████████████████████] 100%',
            '> Shell access granted.',
            '> root@target:~#',
        ].join('\n');
    },
    whoami: () => 'root@nexus — UID:0 — GID:0',
    ls: () => 'backdoors/  exploits/  payloads/  logs/  config.sys  rootkit.bin',
    cat: () => {
        const files = ['config.sys', 'readme.md', 'access.log'];
        const idx = Math.floor(Math.random() * files.length);
        if (files[idx] === 'config.sys') return 'PROXY=ghost.net:8080\nENCRYPTION=AES-256\nAUTO_ROUTE=true';
        if (files[idx] === 'readme.md') return '# NEXUS://BREACH\nAll activities monitored.';
        return '192.168.1.45 - 2024-12-01 03:12:47 - ACCESS GRANTED';
    },
    ping: () => {
        const ips = ['192.168.1.1', '10.0.0.1', '172.16.0.1'];
        const ip = ips[Math.floor(Math.random() * ips.length)];
        const ms = (Math.random() * 50 + 5).toFixed(1);
        return `PING ${ip}: 64 bytes, time=${ms}ms, ttl=64`;
    },
    trace: () => {
        return [
            'Tracing route to ghost.net',
            '1  192.168.1.1     0.5ms',
            '2  10.0.0.1        12.3ms',
            '3  172.16.0.1      24.7ms',
            '4  203.0.113.██    45.1ms',
            '5  45.██.12.██     67.8ms',
            '6  ghost.net       89.2ms',
            'Complete.',
        ].join('\n');
    },
    exit: () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                alert('Connection terminated. Trace complete.');
                document.body.style.opacity = '1';
            }, 1000);
        }, 100);
        return 'Disconnecting...';
    },
    clear: () => {
        terminalOutput.innerHTML = '<div class="terminal-spacer"></div>';
        return null;
    },
};

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        if (!input) return;

        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line';
        promptLine.innerHTML = `<span class="prompt">root@nexus:~$</span><span class="terminal-text">${input}</span>`;

        if (input === 'clear') {
            terminalOutput.innerHTML = '';
        } else {
            terminalOutput.appendChild(promptLine);

            const response = commands[input];
            if (response) {
                const responseLines = response.split('\n');
                responseLines.forEach((line, i) => {
                    const lineEl = document.createElement('div');
                    lineEl.className = 'terminal-line';
                    lineEl.innerHTML = `<span class="terminal-text">${line}</span>`;
                    setTimeout(() => terminalOutput.appendChild(lineEl), i * 50);
                });
            } else {
                const errorLine = document.createElement('div');
                errorLine.className = 'terminal-line';
                errorLine.innerHTML = `<span class="terminal-text" style="color: #ff003c;">Command not found: ${input}</span>`;
                terminalOutput.appendChild(errorLine);
            }
        }

        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});

// Network Traffic Chart
const trafficCanvas = document.getElementById('traffic-chart');
const trafficCtx = trafficCanvas.getContext('2d');

function resizeTrafficCanvas() {
    const rect = trafficCanvas.parentElement.getBoundingClientRect();
    trafficCanvas.width = rect.width - 32;
    trafficCanvas.height = 80;
}
resizeTrafficCanvas();
window.addEventListener('resize', resizeTrafficCanvas);

let trafficData = Array(60).fill(0).map(() => Math.random() * 40 + 10);
let trafficOffset = 0;

function drawTraffic() {
    trafficCtx.clearRect(0, 0, trafficCanvas.width, trafficCanvas.height);

    trafficData.shift();
    trafficData.push(Math.random() * 40 + 10 + Math.sin(trafficOffset * 0.1) * 15);

    trafficCtx.strokeStyle = '#39ff14';
    trafficCtx.lineWidth = 1.5;
    trafficCtx.shadowColor = '#39ff14';
    trafficCtx.shadowBlur = 4;

    trafficCtx.beginPath();
    const stepX = trafficCanvas.width / (trafficData.length - 1);
    trafficData.forEach((val, i) => {
        const x = i * stepX;
        const y = trafficCanvas.height - (val / 60 * trafficCanvas.height);
        if (i === 0) trafficCtx.moveTo(x, y);
        else trafficCtx.lineTo(x, y);
    });
    trafficCtx.stroke();

    trafficCtx.strokeStyle = 'rgba(57, 255, 20, 0.15)';
    trafficCtx.lineWidth = 3;
    trafficCtx.shadowBlur = 0;
    trafficCtx.beginPath();
    trafficData.forEach((val, i) => {
        const x = i * stepX;
        const y = trafficCanvas.height - (val / 60 * trafficCanvas.height);
        if (i === 0) trafficCtx.moveTo(x, y);
        else trafficCtx.lineTo(x, y);
    });
    trafficCtx.stroke();

    trafficOffset++;
    requestAnimationFrame(drawTraffic);
}
drawTraffic();

// Data Stream
const dataStream = document.getElementById('data-stream');
const hexChars = '0123456789ABCDEF';

function updateDataStream() {
    let stream = '';
    for (let i = 0; i < 8; i++) {
        stream += hexChars[Math.floor(Math.random() * 16)];
        if (i < 7) stream += ':';
    }
    stream += ' → ';
    stream += (Math.random() * 100).toFixed(1) + ' MB transferred';
    dataStream.textContent = stream;
}
setInterval(updateDataStream, 1500);

// Threat Grid
const threatGrid = document.getElementById('threat-grid');
const threatTypes = ['low', 'med', 'high', 'crit'];
const threatWeights = [0.4, 0.3, 0.2, 0.1];

function generateThreatGrid() {
    threatGrid.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const cell = document.createElement('div');
        cell.className = 'threat-cell';
        const rand = Math.random();
        let cumulative = 0;
        let type = 'low';
        for (let j = 0; j < threatTypes.length; j++) {
            cumulative += threatWeights[j];
            if (rand < cumulative) {
                type = threatTypes[j];
                break;
            }
        }
        cell.classList.add(`threat-${type}`);
        cell.title = `Threat Level: ${type.toUpperCase()}`;
        threatGrid.appendChild(cell);
    }
}
generateThreatGrid();
setInterval(generateThreatGrid, 5000);

// Activity Log
const activityLog = document.getElementById('activity-log');
const logMessages = [
    { type: 'info', msg: 'New connection from 45.██.12.██' },
    { type: 'success', msg: 'Firewall bypass successful on port 443' },
    { type: 'warning', msg: 'Intrusion detection triggered — stealth mode engaged' },
    { type: 'info', msg: 'DNS query resolved: ghost.net → 203.0.113.██' },
    { type: 'success', msg: 'Root access obtained on target 192.168.1.██' },
    { type: 'error', msg: 'Connection lost to proxy node — reconnecting...' },
    { type: 'info', msg: 'Packet injection: 847 bytes sent to 10.0.0.██' },
    { type: 'warning', msg: 'Anomalous traffic pattern detected on eth0' },
    { type: 'success', msg: 'Encrypted tunnel re-established via TOR' },
    { type: 'info', msg: 'MAC address spoofed: aa:bb:cc:dd:ee:ff' },
    { type: 'error', msg: 'Honeypot detected — aborting scan on 172.16.██.3' },
    { type: 'success', msg: 'Data exfiltration: 2.4 GB transferred' },
    { type: 'warning', msg: 'SSL certificate mismatch on 203.0.██.██' },
    { type: 'info', msg: 'Rotating proxy chain: 12 nodes active' },
];

function addLogEntry() {
    const entry = logMessages[Math.floor(Math.random() * logMessages.length)];
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${entry.type}`;
    logEntry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-message">${entry.msg}</span>
    `;

    activityLog.appendChild(logEntry);
    activityLog.scrollTop = activityLog.scrollHeight;

    if (activityLog.children.length > 50) {
        activityLog.removeChild(activityLog.firstChild);
    }
}

setInterval(addLogEntry, 3000);

// Initial log entries
for (let i = 0; i < 5; i++) {
    setTimeout(addLogEntry, i * 400);
}

// Scroll-triggered glitch on hero
const glitchEl = document.querySelector('.glitch');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (Math.abs(scrollY - lastScrollY) > 50) {
        glitchEl.style.animation = 'none';
        void glitchEl.offsetHeight;
        glitchEl.style.animation = '';
    }
    lastScrollY = scrollY;
});

// Cursor trail effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 2px;
            height: 2px;
            background: #39ff14;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            transition: opacity 0.5s, transform 0.5s;
        `;
        document.body.appendChild(trail);
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(3)';
        }, 50);
        setTimeout(() => trail.remove(), 600);
    }
});

// Random flicker on neon elements
const neonElements = document.querySelectorAll('.stat-value, .panel-title, .footer-text');
neonElements.forEach(el => {
    setInterval(() => {
        if (Math.random() > 0.92) {
            el.style.opacity = '0.7';
            setTimeout(() => el.style.opacity = '1', 80);
        }
    }, 2000);
});
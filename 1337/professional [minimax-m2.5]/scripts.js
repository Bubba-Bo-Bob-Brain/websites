/* =====================================================
CYBERGUARD SECURITY - JAVASCRIPT FUNCTIONALITY
===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMatrixRain();
    initClock();
    initThreatFeed();
    initAttackMap();
    initNetworkTopology();
    initScanner();
    initDecoder();
    initAuditLog();
    initNavigation();
});

/* =====================================================
MATRIX RAIN EFFECT
===================================================== */

function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|;:,.<>?/\\アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#39ff14';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillStyle = Math.random() > 0.9 ? '#00ffff' : '#39ff14';
            ctx.fillText(char, x, y);
            
            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
    
    window.addEventListener('resize', function() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}

/* =====================================================
CLOCK FUNCTIONALITY
===================================================== */

function initClock() {
    function updateTime() {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
        const displayTime = now.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        document.getElementById('header-timestamp').textContent = displayTime;
        document.getElementById('footer-time').textContent = timestamp;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

/* =====================================================
THREAT FEED
===================================================== */

const threats = [
    { type: 'CRITICAL', source: '192.168.1.105', desc: 'SQL Injection Attempt', time: 3000 },
    { type: 'HIGH', source: '10.0.0.45', desc: 'Brute Force Attack', time: 5000 },
    { type: 'MEDIUM', source: '172.16.0.88', desc: 'Port Scan Detected', time: 7000 },
    { type: 'LOW', source: '192.168.1.203', desc: 'Unusual Traffic Pattern', time: 9000 },
    { type: 'CRITICAL', source: '10.0.0.22', desc: 'Malware Signature Match', time: 12000 },
    { type: 'HIGH', source: 'external', desc: 'DDoS Attack Blocked', time: 15000 },
    { type: 'MEDIUM', source: '192.168.1.156', desc: 'Failed Login Attempt', time: 8000 },
    { type: 'HIGH', source: '10.0.0.67', desc: 'Suspicious DNS Query', time: 11000 }
];

let threatCount = 0;

function initThreatFeed() {
    const feed = document.getElementById('threat-feed');
    
    function addThreat(threat) {
        threatCount++;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        
        const item = document.createElement('div');
        item.className = 'threat-item';
        item.innerHTML = `
            <span class="threat-time">${timeStr}</span>
            <span class="threat-type ${threat.type.toLowerCase()}">${threat.type}</span>
            <span class="threat-source">${threat.source}</span>
        `;
        
        feed.insertBefore(item, feed.firstChild);
        
        if (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }
    
    threats.forEach((threat, index) => {
        setTimeout(() => addThreat(threat), index * 2000);
    });
    
    setInterval(() => {
        const randomThreat = threats[Math.floor(Math.random() * threats.length)];
        addThreat(randomThreat);
        updateAttackStats();
    }, 4000);
}

/* =====================================================
ATTACK MAP
===================================================== */

const attackStats = {
    total: 0,
    blocked: 0,
    active: 0
};

const attackLines = [];

const targetPoints = [
    { x: 0.2, y: 0.3 },
    { x: 0.8, y: 0.2 },
    { x: 0.5, y: 0.8 },
    { x: 0.1, y: 0.7 },
    { x: 0.9, y: 0.6 },
    { x: 0.3, y: 0.5 },
    { x: 0.7, y: 0.4 },
    { x: 0.4, y: 0.2 },
    { x: 0.6, y: 0.9 },
    { x: 0.15, y: 0.4 }
];

function initAttackMap() {
    const canvas = document.getElementById('attack-canvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    function drawWorldMap() {
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.1, canvas.height * 0.4);
        ctx.lineTo(canvas.width * 0.3, canvas.height * 0.2);
        ctx.lineTo(canvas.width * 0.5, canvas.height * 0.15);
        ctx.lineTo(canvas.width * 0.7, canvas.height * 0.25);
        ctx.lineTo(canvas.width * 0.9, canvas.height * 0.35);
        ctx.lineTo(canvas.width * 0.85, canvas.height * 0.5);
        ctx.lineTo(canvas.width * 0.75, canvas.height * 0.7);
        ctx.lineTo(canvas.width * 0.5, canvas.height * 0.8);
        ctx.lineTo(canvas.width * 0.25, canvas.height * 0.75);
        ctx.lineTo(canvas.width * 0.1, canvas.height * 0.4);
        ctx.stroke();
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            if (ctx.isPointInPath(x, y) || Math.random() > 0.7) {
                ctx.fillStyle = 'rgba(57, 255, 20, 0.3)';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    function createAttack() {
        const sourcePoint = targetPoints[Math.floor(Math.random() * targetPoints.length)];
        const targetPoint = targetPoints[Math.floor(Math.random() * targetPoints.length)];
        
        const attack = {
            startX: sourcePoint.x * canvas.width,
            startY: sourcePoint.y * canvas.height,
            endX: targetPoint.x * canvas.width,
            endY: targetPoint.y * canvas.height,
            progress: 0,
            speed: 0.02 + Math.random() * 0.02
        };
        
        attackLines.push(attack);
        attackStats.total++;
        document.getElementById('total-attacks').textContent = attackStats.total;
    }
    
    function drawAttacks() {
        ctx.fillStyle = 'rgba(5, 10, 5, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawWorldMap();
        
        for (let i = attackLines.length - 1; i >= 0; i--) {
            const attack = attackLines[i];
            attack.progress += attack.speed;
            
            const currentX = attack.startX + (attack.endX - attack.startX) * attack.progress;
            const currentY = attack.startY + (attack.endY - attack.startY) * attack.progress;
            
            if (attack.progress < 0.3) {
                ctx.strokeStyle = 'rgba(255, 49, 49, 0.8)';
                ctx.lineWidth = 2;
            } else if (attack.progress < 0.7) {
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
                ctx.lineWidth = 1.5;
            } else {
                ctx.strokeStyle = 'rgba(57, 255, 20, 0.6)';
                ctx.lineWidth = 1;
            }
            
            ctx.beginPath();
            ctx.moveTo(attack.startX, attack.startY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            
            ctx.fillStyle = '#ff3131';
            ctx.beginPath();
            ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#39ff14';
            ctx.beginPath();
            ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
            ctx.fill();
            
            if (attack.progress >= 1) {
                attackLines.splice(i, 1);
                attackStats.blocked++;
                document.getElementById('blocked-attacks').textContent = attackStats.blocked;
            }
        }
        
        attackStats.active = attackLines.length;
        document.getElementById('active-threats').textContent = attackStats.active;
    }
    
    setInterval(createAttack, 2000);
    
    function animate() {
        drawAttacks();
        requestAnimationFrame(animate);
    }
    
    animate();
}

function updateAttackStats() {
    document.getElementById('total-attacks').textContent = attackStats.total;
    document.getElementById('blocked-attacks').textContent = attackStats.blocked;
    document.getElementById('active-threats').textContent = attackStats.active;
}

/* =====================================================
NETWORK TOPOLOGY
===================================================== */

const networkNodes = [];
const networkConnections = [];

function initNetworkTopology() {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const nodeTypes = ['server', 'firewall', 'router', 'endpoint'];
    const nodeCount = 24;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = 100 + Math.random() * 100;
        
        const node = {
            x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
            y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
            type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
            id: `NODE-${String(i + 1).padStart(2, '0')}`,
            ip: `192.168.1.${10 + i}`,
            status: 'online',
            label: ''
        };
        
        if (i === 0) {
            node.type = 'firewall';
            node.label = 'FIREWALL';
        } else if (i === 1) {
            node.type = 'router';
            node.label = 'ROUTER';
        } else if (i === 2 || i === 3) {
            node.type = 'server';
            node.label = 'SERVER';
        }
        
        networkNodes.push(node);
    }
    
    for (let i = 1; i < networkNodes.length; i++) {
        const connections = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < connections; j++) {
            const target = Math.floor(Math.random() * i);
            networkConnections.push({ from: i, to: target });
        }
    }
    
    networkNodes[4].status = 'compromised';
    networkNodes[4].type = 'compromised';
    
    const tooltip = document.getElementById('node-tooltip');
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let hoveredNode = null;
        
        for (const node of networkNodes) {
            const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
            if (dist < 20) {
                hoveredNode = node;
                break;
            }
        }
        
        if (hoveredNode) {
            tooltip.style.display = 'block';
            tooltip.style.left = (hoveredNode.x + 25) + 'px';
            tooltip.style.top = (hoveredNode.y - 10) + 'px';
            tooltip.innerHTML = `
                <strong>${hoveredNode.label || hoveredNode.id}</strong><br>
                IP: ${hoveredNode.ip}<br>
                Status: <span style="color: ${hoveredNode.status === 'compromised' ? '#ff3131' : '#39ff14'}">${hoveredNode.status.toUpperCase()}</span>
            `;
        } else {
            tooltip.style.display = 'none';
        }
    });
    
    function draw() {
        ctx.fillStyle = 'rgba(5, 10, 5, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
        ctx.lineWidth = 1;
        
        for (const conn of networkConnections) {
            const from = networkNodes[conn.from];
            const to = networkNodes[conn.to];
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
        
        for (const node of networkNodes) {
            let color;
            switch (node.type) {
                case 'server': color = '#00ffff'; break;
                case 'firewall': color = '#39ff14'; break;
                case 'router': color = '#ff00ff'; break;
                case 'endpoint': color = '#7cfc00'; break;
                case 'compromised': color = '#ff3131'; break;
                default: color = '#39ff14';
            }
            
            ctx.fillStyle = color;
            ctx.beginPath();
            
            if (node.type === 'server' || node.type === 'firewall') {
                ctx.fillRect(node.x - 12, node.y - 12, 24, 24);
            } else if (node.type === 'router') {
                ctx.moveTo(node.x, node.y - 15);
                ctx.lineTo(node.x + 15, node.y);
                ctx.lineTo(node.x, node.y + 15);
                ctx.lineTo(node.x - 15, node.y);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
            
            if (node.status === 'compromised') {
                ctx.strokeStyle = '#ff3131';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            ctx.fillStyle = '#39ff14';
            ctx.font = '10px monospace';
            ctx.fillText(node.label || node.id, node.x + 15, node.y + 4);
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

/* =====================================================
VULNERABILITY SCANNER
===================================================== */

const vulnerabilities = [
    { cve: 'CVE-2024-0001', desc: 'Remote Code Execution', severity: 'critical' },
    { cve: 'CVE-2024-0002', desc: 'SQL Injection', severity: 'critical' },
    { cve: 'CVE-2024-0003', desc: 'Privilege Escalation', severity: 'high' },
    { cve: 'CVE-2024-0004', desc: 'Cross-Site Scripting', severity: 'high' },
    { cve: 'CVE-2024-0005', desc: 'Information Disclosure', severity: 'medium' },
    { cve: 'CVE-2024-0006', desc: 'Buffer Overflow', severity: 'high' },
    { cve: 'CVE-2024-0007', desc: 'CSRF Vulnerability', severity: 'medium' },
    { cve: 'CVE-2024-0008', desc: 'Weak Cipher Suites', severity: 'low' },
    { cve: 'CVE-2024-0009', desc: 'Outdated SSL/TLS', severity: 'medium' },
    { cve: 'CVE-2024-0010', desc: 'Missing Security Headers', severity: 'low' }
];

const ports = [
    { port: 21, service: 'FTP', status: 'open' },
    { port: 22, service: 'SSH', status: 'open' },
    { port: 23, service: 'Telnet', status: 'closed' },
    { port: 25, service: 'SMTP', status: 'open' },
    { port: 53, service: 'DNS', status: 'open' },
    { port: 80, service: 'HTTP', status: 'open' },
    { port: 110, service: 'POP3', status: 'closed' },
    { port: 143, service: 'IMAP', status: 'closed' },
    { port: 443, service: 'HTTPS', status: 'open' },
    { port: 3306, service: 'MySQL', status: 'open' },
    { port: 3389, service: 'RDP', status: 'open' },
    { port: 5432, service: 'PostgreSQL', status: 'closed' }
];

function initScanner() {
    const scanBtn = document.getElementById('start-scan');
    const targetInput = document.getElementById('target-ip');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const resultsContent = document.getElementById('results-content');
    const stages = document.querySelectorAll('.stage');
    
    let isScanning = false;
    
    scanBtn.addEventListener('click', function() {
        if (isScanning) return;
        
        isScanning = true;
        scanBtn.disabled = true;
        scanBtn.textContent = 'SCANNING...';
        
        const target = targetInput.value || '192.168.1.100';
        resultsContent.innerHTML = `<div class="result-item">Initiating scan on target: <strong>${target}</strong></div>`;
        
        let progress = 0;
        
        const scanInterval = setInterval(function() {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(scanInterval);
                finishScan(target);
            }
            
            progressBar.style.width = progress + '%';
            progressPercent.textContent = Math.floor(progress) + '%';
            
            const activeStage = Math.min(Math.floor(progress / 20), 4);
            stages.forEach((stage, index) => {
                stage.classList.toggle('active', index === activeStage);
            });
        }, 500);
    });
    
    function finishScan(target) {
        isScanning = false;
        scanBtn.disabled = false;
        scanBtn.textContent = 'INITIATE SCAN';
        
        stages.forEach(stage => stage.classList.remove('active'));
        stages[4].classList.add('active');
        
        let html = `<div class="result-item"><strong>Scan Complete for ${target}</strong></div>`;
        
        html += '<div class="result-item" style="border-left-color: #00ffff;"><strong>Open Ports:</strong></div>';
        
        const openPorts = ports.filter(p => p.status === 'open');
        openPorts.forEach(port => {
            html += `<div class="result-item">
                <span class="result-port">:${port.port}</span>
                <span class="result-service">${port.service}</span>
                <span class="result-status open">[OPEN]</span>
            </div>`;
        });
        
        html += '<div class="result-item" style="border-left-color: #ff3131;"><strong>Detected Vulnerabilities:</strong></div>';
        
        const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
        const highVulns = vulnerabilities.filter(v => v.severity === 'high');
        const mediumVulns = vulnerabilities.filter(v => v.severity === 'medium');
        const lowVulns = vulnerabilities.filter(v => v.severity === 'low');
        
        [...criticalVulns, ...highVulns, ...mediumVulns, ...lowVulns].slice(0, 5).forEach(vuln => {
            let color = vuln.severity === 'critical' ? '#ff3131' : vuln.severity === 'high' ? '#ff6b35' : vuln.severity === 'medium' ? '#ffd700' : '#39ff14';
            html += `<div class="result-item" style="border-left-color: ${color};">
                <span class="result-port">${vuln.cve}</span>
                <span class="result-service">${vuln.desc}</span>
                <span class="result-status open">[${vuln.severity.toUpperCase()}]</span>
            </div>`;
        });
        
        resultsContent.innerHTML = html;
        
        updateVulnerabilities(criticalVulns, highVulns, mediumVulns, lowVulns);
    }
    
    function updateVulnerabilities(critical, high, medium, low) {
        const lists = {
            critical: document.getElementById('critical-vulns'),
            high: document.getElementById('high-vulns'),
            medium: document.getElementById('medium-vulns'),
            low: document.getElementById('low-vulns')
        };
        
        Object.keys(lists).forEach(key => {
            lists[key].innerHTML = '';
        });
        
        const vulns = { critical, high, medium, low };
        
        Object.entries(vulns).forEach(([severity, list]) => {
            list.forEach(vuln => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="vuln-cve">${vuln.cve}</span><span class="vuln-desc">${vuln.desc}</span>`;
                lists[severity].appendChild(li);
            });
        });
    }
}

/* =====================================================
MESSAGE DECODER
===================================================== */

function initDecoder() {
    const cipherSelect = document.getElementById('cipher-select');
    const keyInput = document.getElementById('key-input');
    const decodeBtn = document.getElementById('decode-btn');
    const encryptedInput = document.getElementById('encrypted-message');
    const decryptedOutput = document.getElementById('decrypted-output');
    const decryptionInfo = document.getElementById('decryption-info');
    const challenges = document.querySelectorAll('.challenge');
    
    cipherSelect.addEventListener('change', function() {
        keyInput.style.display = this.value === 'aes' ? 'block' : 'none';
    });
    
    challenges.forEach(challenge => {
        challenge.addEventListener('click', function() {
            const cipher = this.dataset.cipher;
            const message = this.dataset.message;
            
            cipherSelect.value = cipher;
            encryptedInput.value = message;
            keyInput.style.display = cipher === 'aes' ? 'block' : 'none';
        });
    });
    
    decodeBtn.addEventListener('click', function() {
        const cipher = cipherSelect.value;
        const encrypted = encryptedInput.value.trim();
        const key = document.getElementById('decrypt-key').value;
        
        if (!encrypted) {
            decryptedOutput.innerHTML = '<span class="placeholder">Please enter an encrypted message</span>';
            return;
        }
        
        let decrypted = '';
        let info = '';
        
        try {
            switch (cipher) {
                case 'base64':
                    decrypted = atob(encrypted);
                    info = 'Decoded using Base64 algorithm';
                    break;
                case 'rot13':
                    decrypted = encrypted.replace(/[a-zA-Z]/g, function(c) {
                        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
                    });
                    info = 'Decoded using ROT13 cipher';
                    break;
                case 'hex':
                    decrypted = encrypted.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
                    info = 'Decoded from Hexadecimal';
                    break;
                case 'caesar':
                    const shift = parseInt(key) || 3;
                    decrypted = encrypted.replace(/[a-zA-Z]/g, function(c) {
                        const base = c <= 'Z' ? 65 : 97;
                        return String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
                    });
                    info = 'Decoded using Caesar Cipher (shift: ' + shift + ')';
                    break;
                case 'aes':
                    decrypted = '[AES Decryption requires CryptoJS library]';
                    info = 'Note: AES decryption requires external CryptoJS library';
                    break;
            }
            
            decryptedOutput.textContent = decrypted;
            decryptionInfo.textContent = info;
            decryptedOutput.style.borderColor = '#39ff14';
        } catch (e) {
            decryptedOutput.textContent = 'Error: Invalid encrypted input for selected method';
            decryptedOutput.style.borderColor = '#ff3131';
            decryptionInfo.textContent = 'Check the input format and try again';
        }
    });
}

/* =====================================================
AUDIT LOG
===================================================== */

const logEntries = [];
const logSources = ['FIREWALL', 'IDS', 'AUTH', 'WEB', 'DNS', 'VPN', 'API', 'DB'];
const logMessages = {
    critical: [
        'Unauthorized access attempt detected',
        'Malware payload blocked',
        'Data exfiltration attempt',
        'Privilege escalation blocked',
        'SQL injection detected'
    ],
    warning: [
        'Multiple failed login attempts',
        'Unusual outbound traffic',
        'Port scan detected',
        'Suspicious process execution',
        'Certificate expiration warning'
    ],
    info: [
        'User logged in successfully',
        'Firewall rule updated',
        'Scheduled security scan completed',
        'System update installed',
        'New device connected to network'
    ]
};

function initAuditLog() {
    generateInitialLogs();
    renderLogs();
    setupLogFilters();
    startLogGeneration();
}

function generateInitialLogs() {
    const levels = ['critical', 'warning', 'info'];
    
    for (let i = 0; i < 30; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        const source = logSources[Math.floor(Math.random() * logSources.length)];
        const messages = logMessages[level];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const timestamp = new Date(Date.now() - Math.random() * 3600000);
        
        addLogEntry(timestamp, level, source, message);
    }
}

function addLogEntry(timestamp, level, source, message) {
    logEntries.unshift({ timestamp, level, source, message });
    
    if (logEntries.length > 100) {
        logEntries.pop();
    }
}

function renderLogs(filter = 'all') {
    const logContainer = document.getElementById('audit-log');
    logContainer.innerHTML = '';
    
    const filtered = filter === 'all' ? logEntries : logEntries.filter(log => log.level === filter);
    
    filtered.forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + log.level;
        entry.innerHTML = `
            <span class="log-col timestamp">${log.timestamp.toISOString().replace('T', ' ').substring(0, 19)}</span>
            <span class="log-col level ${log.level}">${log.level.toUpperCase()}</span>
            <span class="log-col source">${log.source}</span>
            <span class="log-col message">${log.message}</span>
        `;
        logContainer.appendChild(entry);
    });
}

function setupLogFilters() {
    const filters = document.querySelectorAll('.log-filter');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            renderLogs(this.dataset.level);
        });
    });
}

function startLogGeneration() {
    setInterval(() => {
        const levels = ['critical', 'warning', 'info'];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const source = logSources[Math.floor(Math.random() * logSources.length)];
        const messages = logMessages[level];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        addLogEntry(new Date(), level, source, message);
        
        const activeFilter = document.querySelector('.log-filter.active').dataset.level;
        renderLogs(activeFilter);
    }, 3000);
}

/* =====================================================
NAVIGATION
===================================================== */

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}
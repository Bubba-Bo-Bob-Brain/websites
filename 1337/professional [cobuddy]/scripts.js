// Boot Sequence
const bootLines = [
    'INITIALIZING SHELL://SECBREACH v3.7.1...',
    'LOADING KERNEL MODULES.................... [OK]',
    'ESTABLISHING ENCRYPTED CHANNEL........... [OK]',
    'CONNECTING TO THREAT INTELLIGENCE FEED... [OK]',
    'SCANNING NETWORK TOPOLOGY................. [OK]',
    'LOADING VULNERABILITY DATABASE............ [OK]',
    'INITIALIZING CRYPTO ENGINE................. [OK]',
    'ALL SYSTEMS NOMINAL — ACCESS GRANTED',
    ''
];

const bootTextEl = document.querySelector('.boot-text');
const bootSequence = document.getElementById('boot-sequence');
let lineIndex = 0;

function bootNextLine() {
    if (lineIndex < bootLines.length) {
        const line = document.createElement('div');
        line.className = 'line';
        line.textContent = bootLines[lineIndex];
        bootTextEl.appendChild(line);
        lineIndex++;
        setTimeout(bootNextLine, 200 + Math.random() * 150);
    } else {
        setTimeout(() => {
            bootSequence.classList.add('hidden');
            setTimeout(() => bootSequence.remove(), 800);
        }, 500);
    }
}

bootNextLine();

// Clock
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}:${s} UTC`;
}
setInterval(updateClock, 1000);
updateClock();

// Tab Navigation
const tabs = document.querySelectorAll('.nav-tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// Threat Feed Data
const threatSources = [
    '192.168.1.105', '10.0.0.44', '172.16.0.88', '203.0.113.42',
    '198.51.100.17', '45.33.32.156', '91.189.92.130', '185.220.101.34',
    '103.21.244.8', '78.46.220.67', '194.26.29.102', '91.200.12.136'
];

const threatDescriptions = [
    'SQL injection attempt on /api/users endpoint',
    'Brute force SSH authentication from unknown host',
    'XSS payload detected in user input field',
    'Unauthorized access attempt on admin panel',
    'DDoS amplification via DNS reflection',
    'Malware C2 beacon detected on port 443',
    'Privilege escalation via kernel exploit',
    'Data exfiltration via DNS tunneling',
    'Buffer overflow in legacy service daemon',
    'Phishing campaign targeting internal staff',
    'Ransomware dropper intercepted in transit',
    'Zero-day exploit targeting Apache Struts',
    'LDAP injection on directory service',
    'Cookie theft via session fixation attack',
    'Network scanning activity from external host',
    'SMTP open relay abuse detected',
    'DNS cache poisoning attempt',
    'Man-in-the-middle on wireless network'
];

const threatLevels = ['critical', 'critical', 'high', 'high', 'high', 'medium', 'medium', 'low', 'low'];

function generateThreatEntry() {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const level = threatLevels[Math.floor(Math.random() * threatLevels.length)];
    const desc = threatDescriptions[Math.floor(Math.random() * threatDescriptions.length)];
    const src = threatSources[Math.floor(Math.random() * threatSources.length)];

    return `
        <div class="threat-entry">
            <span class="threat-time">[${time}]</span>
            <span class="threat-level ${level}">${level.toUpperCase()}</span>
            <span class="threat-desc">${desc}</span>
            <span class="threat-source">SRC: ${src}</span>
        </div>
    `;
}

const threatFeed = document.getElementById('threat-feed-scroll');

function addThreatEntry() {
    const entry = document.createElement('div');
    entry.innerHTML = generateThreatEntry();
    threatFeed.appendChild(entry.firstElementChild);

    if (threatFeed.children.length > 50) {
        threatFeed.removeChild(threatFeed.firstChild);
    }

    threatFeed.scrollTop = threatFeed.scrollHeight;
}

// Populate initial threats
for (let i = 0; i < 15; i++) {
    threatFeed.innerHTML += generateThreatEntry();
}

setInterval(addThreatEntry, 2500 + Math.random() * 1500);

// Attack Map
const mapGrid = document.getElementById('attack-map');

function createMap() {
    for (let i = 0; i < 288; i++) {
        const cell = document.createElement('div');
        cell.className = 'map-cell';
        mapGrid.appendChild(cell);
    }
}

createMap();

function triggerAttack() {
    const cells = mapGrid.querySelectorAll('.map-cell');
    const randomCell = cells[Math.floor(Math.random() * cells.length)];

    if (!randomCell.classList.contains('origin')) {
        randomCell.classList.add('attack');
        setTimeout(() => {
            if (Math.random() > 0.5) {
                randomCell.classList.remove('attack');
            }
        }, 3000 + Math.random() * 4000);
    }

    // Occasionally mark origin
    if (Math.random() > 0.85) {
        const originCell = cells[Math.floor(Math.random() * cells.length)];
        originCell.classList.add('origin');
    }
}

setInterval(triggerAttack, 800 + Math.random() * 1200);

// Vulnerability Scanner
let scanTriggered = false;

document.getElementById('scan-trigger').addEventListener('click', function () {
    if (scanTriggered) return;
    scanTriggered = true;
    this.textContent = '[SCANNING...]';
    this.style.borderColor = 'var(--accent-yellow)';
    this.style.color = 'var(--accent-yellow)';

    const targets = [7, 14, 23, 41];
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((el, i) => {
        const target = targets[i];
        let current = 0;
        const increment = Math.ceil(target / 30);
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 50);
    });

    // Populate vuln list
    const vulnList = document.getElementById('vuln-list');
    const vulns = [
        { name: 'CVE-2024-21762 — Confluence Data Transfer Exfil', severity: 'critical', meta: 'CVSS 9.8 — Remote Code Execution', cve: 'CVE-2024-21762' },
        { name: 'CVE-2024-3400 — Palo Alto PAN-OS Command Injection', severity: 'critical', meta: 'CVSS 10.0 — Authenticated RCE', cve: 'CVE-2024-3400' },
        { name: 'CVE-2024-1709 — Ivanti EPMM Path Traversal', severity: 'critical', meta: 'CVSS 9.1 — Information Disclosure', cve: 'CVE-2024-1709' },
        { name: 'CVE-2024-27198 — Apache OFBiz RCE', severity: 'high', meta: 'CVSS 9.8 — Unauthenticated RCE', cve: 'CVE-2024-27198' },
        { name: 'CVE-2024-20017 — JetBrains TeamCity RCE', severity: 'high', meta: 'CVSS 9.8 — Authenticated RCE', cve: 'CVE-2024-20017' },
        { name: 'CVE-2024-3094 — XZ Utils Backdoor', severity: 'critical', meta: 'CVSS 8.8 — Supply Chain Compromise', cve: 'CVE-2024-3094' },
        { name: 'CVE-2024-1708 — Ivanti Connect Secure Auth Bypass', severity: 'high', meta: 'CVSS 8.8 — Authentication Bypass', cve: 'CVE-2024-1708' },
        { name: 'CVE-2024-1058 — Wireshark DoS', severity: 'medium', meta: 'CVSS 6.5 — Denial of Service', cve: 'CVE-2024-1058' },
        { name: 'CVE-2024-0012 — JetBrains Codeception XSS', severity: 'medium', meta: 'CVSS 6.1 — Reflected XSS', cve: 'CVE-2024-0012' },
        { name: 'CVE-2024-0010 — JetBrains PhpStorm XSS', severity: 'medium', meta: 'CVSS 5.3 — Stored XSS', cve: 'CVE-2024-0010' },
        { name: 'CVE-2024-26832 — CrowdStrike Reversing bug', severity: 'critical', meta: 'CVSS 9.1 — Memory Corruption', cve: 'CVE-2024-26832' },
        { name: 'CVE-2023-44487 — HTTP/2 Rapid Reset DoS', severity: 'high', meta: 'CVSS 7.5 — Denial of Service', cve: 'CVE-2023-44487' },
        { name: 'CVE-2023-46805 — CrushFTP Auth Bypass', severity: 'high', meta: 'CVSS 9.8 — Unauthenticated Access', cve: 'CVE-2023-46805' },
        { name: 'CVE-2023-22515 — Atlassian Confluence RCE', severity: 'high', meta: 'CVSS 9.8 — RCE via Template Injection', cve: 'CVE-2023-22515' },
    ];

    vulnList.innerHTML = '';
    vulns.forEach((vuln, i) => {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'vuln-item';
            item.innerHTML = `
                <span class="vuln-severity ${vuln.severity}">${vuln.severity.toUpperCase()}</span>
                <div class="vuln-info">
                    <div class="vuln-name">${vuln.name}</div>
                    <div class="vuln-meta">${vuln.meta}</div>
                </div>
                <span class="vuln-cve">${vuln.cve}</span>
            `;
            vulnList.appendChild(item);
        }, i * 100);
    });

    setTimeout(() => {
        this.textContent = '[SCAN COMPLETE]';
        this.style.borderColor = 'var(--lime)';
        this.style.color = 'var(--lime)';
    }, vulns.length * 100 + 500);
});

// Network Topology SVG
const svg = document.getElementById('topology-svg');

const nodes = [
    { id: 'fw1', label: 'PERIMETER FW', x: 400, y: 30, type: 'critical' },
    { id: 'ids1', label: 'IDS/IPS', x: 250, y: 100, type: 'warning' },
    { id: 'ids2', label: 'IDS/IPS', x: 550, y: 100, type: 'warning' },
    { id: 'dc1', label: 'DC-PRIMARY', x: 200, y: 200, type: 'critical' },
    { id: 'dc2', label: 'DC-SECONDARY', x: 400, y: 200, type: 'warning' },
    { id: 'dmz1', label: 'WEB-SRV-01', x: 100, y: 300, type: 'safe' },
    { id: 'dmz2', label: 'APP-SRV-01', x: 300, y: 300, type: 'safe' },
    { id: 'db1', label: 'DB-MASTER', x: 500, y: 300, type: 'critical' },
    { id: 'db2', label: 'DB-REPLICA', x: 650, y: 200, type: 'info' },
    { id: 'waf1', label: 'WAF', x: 600, y: 300, type: 'info' },
    { id: 'vpn1', label: 'VPN GATEWAY', x: 50, y: 150, type: 'info' },
];

const edges = [
    ['fw1', 'ids1'], ['fw1', 'ids2'], ['ids1', 'dc1'], ['ids1', 'vpn1'],
    ['ids2', 'dc2'], ['ids2', 'db2'], ['dc1', 'dmz1'], ['dc1', 'dmz2'],
    ['dc2', 'db1'], ['dmz2', 'db1'], ['db1', 'waf1'], ['db2', 'waf1'],
    ['vpn1', 'dmz1'], ['ids2', 'waf1'],
];

function drawTopology() {
    // Clear existing
    svg.innerHTML = '';

    // Draw edges
    edges.forEach(([fromId, toId]) => {
        const from = nodes.find(n => n.id === fromId);
        const to = nodes.find(n => n.id === toId);
        if (from && to) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', 'rgba(57, 255, 20, 0.15)');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '4 4');
            svg.appendChild(line);
        }
    });

    // Draw nodes
    nodes.forEach(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', '14');
        circle.setAttribute('fill', 'rgba(0, 0, 0, 0.6)');
        circle.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue(`--${node.type === 'critical' ? 'critical' : node.type === 'warning' ? 'high' : node.type === 'safe' ? 'low' : 'lime'}`).trim());
        circle.setAttribute('stroke-width', '1.5');
        circle.setAttribute('filter', 'url(#glow)');
        g.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 30);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'var(--text-secondary)');
        text.setAttribute('font-family', 'var(--font-mono)');
        text.setAttribute('font-size', '8');
        text.setAttribute('letter-spacing', '1');
        text.textContent = node.label;
        g.appendChild(text);

        svg.appendChild(g);
    });

    // Glow filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussian = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussian.setAttribute('stdDeviation', '3');
    feGaussian.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);

    filter.appendChild(feGaussian);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.insertBefore(defs, svg.firstChild);
}

drawTopology();

// Encryption
const cipherSelect = document.getElementById('cipher-select');
const encryptedDisplay = document.getElementById('encrypted-display');
const decryptedDisplay = document.getElementById('decrypted-display');
const decryptBtn = document.getElementById('decrypt-btn');
const cryptoLog = document.getElementById('crypto-log');

const encryptedMessages = {
    rot13: 'GURER VF AB RFPNCR NAQ VESBIONY VOGRG',
    caesar: 'WKH SDUWB IOHDVW WR GHFLVH DW WKH FRQYHUVDGH',
    binary: '01001000 01100001 01100011 01101011 01100101 01100100 00100000 01000010 01111001 00100000 01010100 01101000 01100101 00100000 01000111 01101111 01110110 01100101 01110010 01101110 01101101 01100101 01101110 01110100',
    hex: '4861636b65642042792054686520476f7665726e6d656e74',
    morse: '.... .- -.-. -.- . / -... -.-- / - .... . / --. --- ...- . .-. -. -- . -.-.'
};

const decryptedMessages = {
    rot13: 'THERE IS NO ESCAPE AND RESISTANCE IS FUTILE',
    caesar: 'THE HACKER TRIED TO BREAK INTO THE DATABASE',
    binary: 'HACKED BY THE GOVERNMENT',
    hex: 'HACKED BY THE GOVERNMENT',
    morse: 'HACKED BY THE GOVERNMENT'
};

const cipherNames = {
    rot13: 'ROT13',
    caesar: 'CAESAR-7',
    binary: 'BINARY',
    hex: 'HEXADECIMAL',
    morse: 'MORSE CODE'
};

decryptBtn.addEventListener('click', () => {
    const cipher = cipherSelect.value;
    const encrypted = encryptedMessages[cipher];
    const decrypted = decryptedMessages[cipher];

    encryptedDisplay.textContent = encrypted;
    decryptedDisplay.classList.remove('hidden');
    decryptedDisplay.textContent = decrypted;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const logEntry1 = document.createElement('div');
    logEntry1.className = 'log-entry';
    logEntry1.textContent = `[${time}] Decryption initiated — ${cipherNames[cipher]}`;
    cryptoLog.appendChild(logEntry1);

    const logEntry2 = document.createElement('div');
    logEntry2.className = 'log-entry';
    logEntry2.textContent = `[${time}] Plaintext recovered: \"${decrypted}\"`;
    logEntry2.style.color = 'var(--lime)';
    cryptoLog.appendChild(logEntry2);

    cryptoLog.scrollTop = cryptoLog.scrollHeight;
});

// Audit Log
const auditContainer = document.getElementById('audit-log-container');
const logCounter = document.getElementById('log-counter');

const auditActions = [
    'SSH login from 10.0.0.55 — user: root',
    'Failed password attempt for admin@192.168.1.1',
    'Sudo elevation granted — user: analyst',
    'Firewall rule modified — port 443 opened',
    'Certificate rotation completed — *.secbreach.io',
    'Database backup initiated — full snapshot',
    'Intrusion alert triggered — src: 45.33.32.156',
    'File integrity check passed — /etc/',
    'VPN session established — user: field_ops_7',
    'Privilege escalation detected — uid 1000 → 0',
    'DNS query logged — suspicious domain resolved',
    'Honey pot interaction captured — botnet probe',
    'SIEM alert correlated — 3 events matched',
    'Penetration test authorized — scope: perimeter',
    'Malware sample quarantined — SHA256: a3f2...',
    'Network scan detected — internal subnet 10.10.0.0/16',
    'Account lockout — 5 failed attempts for db_admin',
    'Kernel module loaded — network monitor',
];

const auditLevels = ['access', 'alert', 'info', 'alert', 'info', 'info', 'alert', 'info', 'access', 'alert', 'info', 'info', 'alert', 'info', 'alert', 'alert', 'access', 'info'];

const auditSources = ['authd', 'fail2ban', 'sudo', 'iptables', 'certbot', 'pg_dump', 'snort', 'aide', 'openvpn', 'kernel', 'bind', 'cowrie', 'elk', 'metasploit', 'clamav', 'nmap', 'pam', 'syslog'];

let auditCount = 0;

function addAuditEntry() {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const action = auditActions[Math.floor(Math.random() * auditActions.length)];
    const level = auditLevels[Math.floor(Math.random() * auditLevels.length)];
    const source = auditSources[Math.floor(Math.random() * auditSources.length)];

    const entry = document.createElement('div');
    entry.className = 'audit-entry';
    entry.innerHTML = `
        <span class="audit-timestamp">[${time}]</span>
        <span class="audit-level ${level}">${level.toUpperCase()}</span>
        <span class="audit-action">${action}</span>
        <span class="audit-source">[${source}]</span>
    `;

    auditContainer.appendChild(entry);
    auditContainer.scrollTop = auditContainer.scrollHeight;

    auditCount++;
    logCounter.textContent = `${auditCount} ENTRIES`;

    if (auditContainer.children.length > 100) {
        auditContainer.removeChild(auditContainer.firstChild);
    }
}

// Populate initial audit entries
for (let i = 0; i < 20; i++) {
    addAuditEntry();
}

setInterval(addAuditEntry, 2000 + Math.random() * 2000);

// Sound Toggle (visual only — no actual audio)
const soundToggle = document.getElementById('sound-toggle');
let soundOn = false;

soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.textContent = soundOn ? '🔊' : '🔇';
    soundToggle.style.borderColor = soundOn ? 'var(--lime)' : 'var(--border-color)';
    soundToggle.style.boxShadow = soundOn ? '0 0 20px var(--lime-glow)' : '0 0 10px var(--lime-subtle)';
});

// Random glitch effect on banner
setInterval(() => {
    const glitchEl = document.querySelector('.glitch');
    if (glitchEl && Math.random() > 0.7) {
        glitchEl.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        setTimeout(() => {
            glitchEl.style.transform = 'translate(0, 0)';
        }, 50 + Math.random() * 100);
    }
}, 3000);

// Random flicker on terminal title
setInterval(() => {
    const title = document.querySelector('.terminal-title');
    if (title && Math.random() > 0.85) {
        title.style.opacity = '0.3';
        setTimeout(() => {
            title.style.opacity = '1';
        }, 50);
    }
}, 5000);
// ============================================
// NEXUS SECURITY - RETRO HACKER INTERFACE
// Interactive JavaScript Implementation
// ============================================

// DOM Elements
const commandInput = document.getElementById('command-input');
const executeBtn = document.getElementById('execute-btn');
const threatList = document.getElementById('threat-list');
const refreshThreatsBtn = document.getElementById('refresh-threats');
const threatUpdateTime = document.getElementById('threat-update-time');
const topologyCanvas = document.getElementById('topology-canvas');
const mapButtons = document.querySelectorAll('.map-btn');
const startScanBtn = document.getElementById('start-scan');
const scanProgress = document.getElementById('scan-progress');
const scanPercent = document.getElementById('scan-percent');
const severityCounts = {
    critical: document.getElementById('critical-count'),
    high: document.getElementById('high-count'),
    medium: document.getElementById('medium-count'),
    low: document.getElementById('low-count')
};
const encodedInput = document.getElementById('encoded-input');
const cipherSelect = document.getElementById('cipher-select');
const decodeBtn = document.getElementById('decode-btn');
const decodedOutput = document.getElementById('decoded-output');
const cipherType = document.getElementById('cipher-type');
const historyList = document.getElementById('history-list');
const logEntries = document.getElementById('log-entries');
const filterButtons = document.querySelectorAll('.filter-btn');
const liveTime = document.getElementById('live-time');
const quotePrevBtn = document.querySelector('.quote-prev');
const quoteNextBtn = document.querySelector('.quote-next');
const quoteDots = document.querySelectorAll('.dot');
const quotes = document.querySelectorAll('.quote');
const matrixCanvas = document.getElementById('matrix-canvas');

// Global Variables
let currentQuoteIndex = 0;
let scanInProgress = false;
let currentMapView = 'physical';
let threatHistory = [];
let decoderHistory = [];
let activeLogFilter = 'all';

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format current time in hacker style
function getHackerTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
}

// Update live time display
function updateLiveTime() {
    liveTime.textContent = getHackerTime();
}

// Initialize live time updates
setInterval(updateLiveTime, 1000);
updateLiveTime(); // Initial call

// Generate random hex string
function generateHex(length) {
    return Array.from({length}, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();
}

// Simulate typing effect
function typeEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    const typeChar = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    };
    
    typeChar();
}

// Add entry to threat feed
function addThreatEntry(threat) {
    const threatItem = document.createElement('div');
    threatItem.className = `threat-item ${threat.severity}`;
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    threatItem.innerHTML = `
        <div class="threat-header">
            <span class="threat-type">${threat.type}</span>
            <span class="threat-time">${timeStr}</span>
        </div>
        <div class="threat-desc">${threat.description}</div>
        <div class="threat-source">Source: ${threat.source}</div>
    `;
    
    threatList.prepend(threatItem);
    
    // Limit to 10 items
    while (threatList.children.length > 10) {
        threatList.removeChild(threatList.lastChild);
    }
    
    // Store in history
    threatHistory.unshift({
        ...threat,
        timestamp: now.toISOString()
    });
    
    // Update timestamp
    threatUpdateTime.textContent = 'Just now';
}

// Generate random threat
function generateRandomThreat() {
    const severities = ['critical', 'high', 'medium', 'low'];
    const types = [
        'DDOS ATTACK',
        'PORT SCAN',
        'MALWARE DETECTED',
        'UNAUTHORIZED ACCESS',
        'SQL INJECTION',
        'PHISHING ATTEMPT',
        'BRUTE FORCE',
        'ZERO-DAY EXPLOIT',
        'DATA EXFILTRATION',
        'RANSOMWARE'
    ];
    
    const descriptions = [
        'Multiple connection attempts from suspicious IP range',
        'Unusual traffic pattern detected on port 443',
        'Malicious payload identified in email attachment',
        'Failed login attempts from unknown location',
        'Database query with potential injection vectors',
        'Fake login page targeting company employees',
        'Rapid password attempts on admin account',
        'Exploit targeting previously unknown vulnerability',
        'Large data transfer to external server detected',
        'File encryption detected on workstation'
    ];
    
    const sources = [
        'IP: 192.168.1.' + Math.floor(Math.random() * 255),
        'ASN: AS' + Math.floor(Math.random() * 99999),
        'Country: ' + ['CN', 'RU', 'IR', 'KP', 'VN'][Math.floor(Math.random() * 5)],
        'TOR Exit Node: ' + generateHex(8),
        'Botnet: Mirai Variant #' + Math.floor(Math.random() * 10)
    ];
    
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    return { severity, type, description, source };
}

// Initialize threat feed
function initializeThreatFeed() {
    // Clear existing
    threatList.innerHTML = '';
    
    // Add initial threats
    for (let i = 0; i < 5; i++) {
        addThreatEntry(generateRandomThreat());
    }
    
    // Update timestamp
    const now = new Date();
    threatUpdateTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Refresh threat feed
function refreshThreatFeed() {
    // Add 1-3 new threats
    const newThreatCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < newThreatCount; i++) {
        setTimeout(() => {
            addThreatEntry(generateRandomThreat());
        }, i * 500);
    }
    
    // Rotate button
    refreshThreatsBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        refreshThreatsBtn.style.transform = 'rotate(0deg)';
    }, 500);
}

// ============================================
// NETWORK TOPOLOGY VISUALIZATION
// ============================================

// Create network nodes
function createNetworkTopology(view) {
    topologyCanvas.innerHTML = '';
    currentMapView = view;
    
    // Define nodes based on view
    const nodes = [];
    
    if (view === 'physical') {
        nodes.push(
            { id: 'firewall-1', type: 'firewall', x: 50, y: 50, label: 'FW-01' },
            { id: 'server-1', type: 'secure', x: 150, y: 100, label: 'SRV-01' },
            { id: 'server-2', type: 'warning', x: 250, y: 50, label: 'SRV-02' },
            { id: 'db-1', type: 'secure', x: 100, y: 200, label: 'DB-01' },
            { id: 'db-2', type: 'critical', x: 200, y: 150, label: 'DB-02' },
            { id: 'switch-1', type: 'secure', x: 150, y: 250, label: 'SW-01' },
            { id: 'workstation-1', type: 'secure', x: 50, y: 300, label: 'WS-01' },
            { id: 'workstation-2', type: 'warning', x: 250, y: 300, label: 'WS-02' }
        );
    } else if (view === 'logical') {
        nodes.push(
            { id: 'vlan-10', type: 'secure', x: 100, y: 80, label: 'VLAN-10' },
            { id: 'vlan-20', type: 'warning', x: 200, y: 80, label: 'VLAN-20' },
            { id: 'vlan-30', type: 'secure', x: 150, y: 180, label: 'VLAN-30' },
            { id: 'dmz', type: 'firewall', x: 150, y: 280, label: 'DMZ' },
            { id: 'internet', type: 'critical', x: 250, y: 180, label: 'INTERNET' },
            { id: 'vpn', type: 'secure', x: 50, y: 180, label: 'VPN' }
        );
    } else if (view === 'threat') {
        nodes.push(
            { id: 'entry-point', type: 'critical', x: 50, y: 50, label: 'ENTRY' },
            { id: 'lateral-1', type: 'critical', x: 150, y: 100, label: 'LAT-01' },
            { id: 'lateral-2', type: 'warning', x: 250, y: 50, label: 'LAT-02' },
            { id: 'target-1', type: 'critical', x: 100, y: 200, label: 'TGT-01' },
            { id: 'target-2', type: 'critical', x: 200, y: 150, label: 'TGT-02' },
            { id: 'exfil', type: 'critical', x: 150, y: 250, label: 'EXFIL' },
            { id: 'firewall-bypass', type: 'firewall', x: 250, y: 200, label: 'BYPASS' }
        );
    }
    
    // Create connections
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            // Randomly connect nodes (50% chance)
            if (Math.random() > 0.5) {
                connections.push({ from: nodes[i], to: nodes[j] });
            }
        }
    }
    
    // Draw connections
    connections.forEach(conn => {
        const connection = document.createElement('div');
        connection.className = 'network-connection';
        
        const dx = conn.to.x - conn.from.x;
        const dy = conn.to.y - conn.from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        connection.style.width = `${length}px`;
        connection.style.left = `${conn.from.x}px`;
        connection.style.top = `${conn.from.y}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        // Add pulse animation for threat view
        if (view === 'threat') {
            connection.style.animation = `pulse ${1 + Math.random() * 2}s infinite`;
        }
        
        topologyCanvas.appendChild(connection);
    });
    
    // Draw nodes
    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = `network-node ${node.type}`;
        nodeElement.style.left = `${node.x}px`;
        nodeElement.style.top = `${node.y}px`;
        nodeElement.textContent = node.label;
        nodeElement.dataset.id = node.id;
        
        // Add click event
        nodeElement.addEventListener('click', () => {
            alert(`Node: ${node.label}\nStatus: ${node.type.toUpperCase()}\nView: ${view.toUpperCase()}`);
        });
        
        // Add pulse for critical nodes
        if (node.type === 'critical') {
            nodeElement.style.animation = `pulse ${0.5 + Math.random()}s infinite`;
        }
        
        topologyCanvas.appendChild(nodeElement);
    });
}

// ============================================
// VULNERABILITY SCANNER
// ============================================

// Simulate vulnerability scan
function simulateVulnerabilityScan() {
    if (scanInProgress) return;
    
    scanInProgress = true;
    startScanBtn.disabled = true;
    startScanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SCANNING';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Update progress bar
            scanProgress.style.width = `${progress}%`;
            scanPercent.textContent = `${Math.round(progress)}%`;
            
            // Generate random results
            const critical = Math.floor(Math.random() * 5);
            const high = Math.floor(Math.random() * 8);
            const medium = Math.floor(Math.random() * 15);
            const low = Math.floor(Math.random() * 25);
            
            // Update counts with animation
            animateCount(severityCounts.critical, critical);
            animateCount(severityCounts.high, high);
            animateCount(severityCounts.medium, medium);
            animateCount(severityCounts.low, low);
            
            // Add new vulnerability items
            addNewVulnerabilities(critical, high, medium, low);
            
            // Reset button
            setTimeout(() => {
                scanInProgress = false;
                startScanBtn.disabled = false;
                startScanBtn.innerHTML = '<i class="fas fa-play"></i> START SCAN';
                
                // Reset progress bar after 3 seconds
                setTimeout(() => {
                    scanProgress.style.width = '0%';
                    scanPercent.textContent = '0%';
                }, 3000);
            }, 1000);
        } else {
            // Update progress bar
            scanProgress.style.width = `${progress}%`;
            scanPercent.textContent = `${Math.round(progress)}%`;
        }
    }, 100);
}

// Animate count update
function animateCount(element, target) {
    const current = parseInt(element.textContent);
    const increment = target > current ? 1 : -1;
    let count = current;
    
    const interval = setInterval(() => {
        count += increment;
        element.textContent = count;
        
        if (count === target) {
            clearInterval(interval);
            
            // Add visual feedback
            if (increment > 0) {
                element.parentElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.parentElement.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }, 50);
}

// Add new vulnerabilities to list
function addNewVulnerabilities(critical, high, medium, low) {
    const vulnList = document.querySelector('.vuln-list');
    const cves = [
        'CVE-2024-3289', 'CVE-2024-3290', 'CVE-2024-3291',
        'CVE-2024-3292', 'CVE-2024-3293', 'CVE-2024-3294',
        'CVE-2024-3295', 'CVE-2024-3296', 'CVE-2024-3297'
    ];
    
    const titles = [
        'Remote Code Execution in SSH',
        'Privilege Escalation Vulnerability',
        'Buffer Overflow in Network Service',
        'Cross-Site Scripting (XSS)',
        'SQL Injection Vulnerability',
        'Path Traversal Attack Vector',
        'Memory Corruption Issue',
        'Authentication Bypass',
        'Information Disclosure'
    ];
    
    // Clear existing items (keep first two as examples)
    while (vulnList.children.length > 2) {
        vulnList.removeChild(vulnList.lastChild);
    }
    
    // Add new critical vulnerabilities
    for (let i = 0; i < critical; i++) {
        const vulnItem = document.createElement('div');
        vulnItem.className = 'vuln-item critical';
        vulnItem.innerHTML = `
            <span class="vuln-id">${cves[Math.floor(Math.random() * cves.length)]}</span>
            <span class="vuln-title">${titles[Math.floor(Math.random() * titles.length)]}</span>
            <span class="vuln-status active">ACTIVE</span>
        `;
        vulnList.appendChild(vulnItem);
    }
    
    // Add new high vulnerabilities
    for (let i = 0; i < high; i++) {
        const vulnItem = document.createElement('div');
        vulnItem.className = 'vuln-item high';
        vulnItem.innerHTML = `
            <span class="vuln-id">${cves[Math.floor(Math.random() * cves.length)]}</span>
            <span class="vuln-title">${titles[Math.floor(Math.random() * titles.length)]}</span>
            <span class="vuln-status ${Math.random() > 0.5 ? 'active' : 'patched'}">${Math.random() > 0.5 ? 'ACTIVE' : 'PATCHED'}</span>
        `;
        vulnList.appendChild(vulnItem);
    }
}

// ============================================
// ENCRYPTED MESSAGE DECODER
// ============================================

// Decryption functions
const decoders = {
    base64: (text) => {
        try {
            return atob(text);
        } catch {
            return 'Invalid Base64 encoding';
        }
    },
    
    rot13: (text) => {
        return text.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode(
                (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
            );
        });
    },
    
    hex: (text) => {
        // Remove any non-hex characters
        const hex = text.replace(/[^0-9a-fA-F]/g, '');
        if (hex.length % 2 !== 0) return 'Invalid hex string (odd length)';
        
        let result = '';
        for (let i = 0; i < hex.length; i += 2) {
            result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return result;
    },
    
    binary: (text) => {
        // Remove any non-binary characters
        const binary = text.replace(/[^01]/g, '');
        if (binary.length % 8 !== 0) return 'Invalid binary string (not multiple of 8)';
        
        let result = '';
        for (let i = 0; i < binary.length; i += 8) {
            result += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
        }
        return result;
    },
    
    caesar: (text) => {
        const shift = 3; // Standard Caesar cipher shift
        return text.replace(/[a-zA-Z]/g, function(c) {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(
                (c.charCodeAt(0) - base + 26 - shift) % 26 + base
            );
        });
    }
};

// Decode message
function decodeMessage() {
    const cipher = cipherSelect.value;
    const input = encodedInput.value.trim();
    
    if (!input) {
        decodedOutput.textContent = 'Please enter an encrypted message.';
        return;
    }
    
    // Update cipher type display
    cipherType.textContent = cipher.toUpperCase();
    
    // Decode
    const decoder = decoders[cipher];
    const result = decoder(input);
    
    // Display result with typing effect
    typeEffect(decodedOutput, result);
    
    // Add to history
    addToDecoderHistory(input, result, cipher);
}

// Add to decoder history
function addToDecoderHistory(input, output, cipher) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    historyItem.innerHTML = `
        <span class="history-cipher">${cipher.toUpperCase()}</span>
        <span class="history-preview">${input.substring(0, 20)}${input.length > 20 ? '...' : ''}</span>
        <span class="history-time">${timeStr}</span>
    `;
    
    historyList.prepend(historyItem);
    
    // Limit history to 5 items
    while (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
    
    // Store in array
    decoderHistory.unshift({
        input,
        output,
        cipher,
        timestamp: now.toISOString()
    });
}

// ============================================
// SECURITY AUDIT LOG
// ============================================

// Generate random log entry
function generateLogEntry(type) {
    const types = {
        login: ['SUCCESSFUL LOGIN', 'FAILED LOGIN', 'MULTI-FACTOR AUTH'],
        access: ['FILE ACCESS', 'DATABASE QUERY', 'API CALL'],
        alert: ['INTRUSION DETECTED', 'ANOMALOUS BEHAVIOR', 'THRESHOLD EXCEEDED'],
        block: ['IP BLOCKED', 'PORT BLOCKED', 'MALICIOUS TRAFFIC BLOCKED']
    };
    
    const messages = {
        login: [
            'User admin logged in from 192.168.1.100',
            'Failed login attempt for user root from 10.0.0.5',
            'Multi-factor authentication required for user jsmith'
        ],
        access: [
            'File /var/log/auth.log accessed by process sshd',
            'SELECT query executed on users table',
            'REST API endpoint /api/v1/users called'
        ],
        alert: [
            'Possible brute force attack detected from IP range',
            'Unusual data transfer volume detected',
            'Multiple failed authentication attempts within 60 seconds'
        ],
        block: [
            'IP address 185.165.120.4 added to blocklist',
            'Port 445 blocked due to SMB exploit attempts',
            'Traffic from AS12345 blocked - known botnet'
        ]
    };
    
    const details = {
        login: ['Session ID: ' + generateHex(16), 'User Agent: Mozilla/5.0', 'Location: New York, US'],
        access: ['Process ID: ' + Math.floor(Math.random() * 10000), 'Duration: ' + (Math.random() * 1000).toFixed(2) + 'ms', 'Result: Success'],
        alert: ['Severity: HIGH', 'Confidence: 95%', 'Action: Alert sent to SOC'],
        block: ['Duration: 24h', 'Reason: Known malicious IP', 'Rule: FW-001']
    };
    
    if (type === 'all') {
        const allTypes = ['login', 'access', 'alert', 'block'];
        type = allTypes[Math.floor(Math.random() * allTypes.length)];
    }
    
    const typeArray = types[type];
    const messageArray = messages[type];
    const detailArray = details[type];
    
    return {
        type,
        entry: typeArray[Math.floor(Math.random() * typeArray.length)],
        message: messageArray[Math.floor(Math.random() * messageArray.length)],
        detail: detailArray[Math.floor(Math.random() * detailArray.length)],
        timestamp: getHackerTime()
    };
}

// Add log entry
function addLogEntry(log) {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${log.type}`;
    
    logEntry.innerHTML = `
        <div>
            <span class="log-timestamp">${log.timestamp}</span>
            <span class="log-type">${log.entry}</span>
        </div>
        <div class="log-message">${log.message}</div>
        <div class="log-details">${log.detail}</div>
    `;
    
    logEntries.prepend(logEntry);
    
    // Limit to 15 entries
    while (logEntries.children.length > 15) {
        logEntries.removeChild(logEntries.lastChild);
    }
    
    // Apply filter
    applyLogFilter();
}

// Initialize log
function initializeLog() {
    // Clear existing
    logEntries.innerHTML = '';
    
    // Add initial entries
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            addLogEntry(generateLogEntry('all'));
        }, i * 100);
    }
}

// Apply log filter
function applyLogFilter() {
    const entries = logEntries.querySelectorAll('.log-entry');
    
    entries.forEach(entry => {
        if (activeLogFilter === 'all' || entry.classList.contains(activeLogFilter)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
}

// ============================================
// HACKER QUOTES CAROUSEL
// ============================================

// Show quote at index
function showQuote(index) {
    // Validate index
    if (index < 0) index = quotes.length - 1;
    if (index >= quotes.length) index = 0;
    
    // Hide all quotes
    quotes.forEach(quote => {
        quote.classList.remove('active');
    });
    
    // Show selected quote
    quotes[index].classList.add('active');
    
    // Update dots
    quoteDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentQuoteIndex = index;
}

// Next quote
function nextQuote() {
    showQuote(currentQuoteIndex + 1);
}

// Previous quote
function prevQuote() {
    showQuote(currentQuoteIndex - 1);
}

// Auto-rotate quotes
setInterval(nextQuote, 10000);

// ============================================
// TERMINAL COMMAND INTERFACE
// ============================================

// Command definitions
const commands = {
    help: {
        description: 'Show available commands',
        execute: () => {
            const helpText = `
Available commands:
• help - Show this help message
• clear - Clear the terminal
• scan - Start vulnerability scan
• threats - Refresh threat feed
• decode [message] - Decode a message (e.g., decode "U0dWc2JHOGdWMjl5YkdRaA==")
• network [view] - Change network view (physical/logical/threat)
• date - Show current date and time
• whoami - Show current user
• banner - Show Nexus Security banner
            `.trim();
            
            return helpText;
        }
    },
    
    clear: {
        description: 'Clear terminal output',
        execute: () => {
            const terminalOutput = document.querySelector('.terminal-output');
            terminalOutput.innerHTML = '';
            return 'Terminal cleared.';
        }
    },
    
    scan: {
        description: 'Start vulnerability scan',
        execute: () => {
            simulateVulnerabilityScan();
            return 'Starting vulnerability scan...';
        }
    },
    
    threats: {
        description: 'Refresh threat feed',
        execute: () => {
            refreshThreatFeed();
            return 'Refreshing threat feed...';
        }
    },
    
    decode: {
        description: 'Decode a message',
        execute: (args) => {
            if (!args) {
                return 'Usage: decode [message] (e.g., decode "SGVsbG8gV29ybGQ=")';
            }
            
            encodedInput.value = args;
            decodeMessage();
            return `Decoding message using ${cipherSelect.value.toUpperCase()} cipher...`;
        }
    },
    
    network: {
        description: 'Change network view',
        execute: (args) => {
            const views = ['physical', 'logical', 'threat'];
            if (!args || !views.includes(args.toLowerCase())) {
                return `Usage: network [${views.join('|')}]`;
            }
            
            // Find and click the corresponding button
            mapButtons.forEach(btn => {
                if (btn.dataset.view === args.toLowerCase()) {
                    btn.click();
                }
            });
            
            return `Switching to ${args} network view...`;
        }
    },
    
    date: {
        description: 'Show current date and time',
        execute: () => {
            const now = new Date();
            return now.toString();
        }
    },
    
    whoami: {
        description: 'Show current user',
        execute: () => {
            return 'User: guest@nexus (Limited privileges)\nTo gain full access, contact system administrator.';
        }
    },
    
    banner: {
        description: 'Show Nexus Security banner',
        execute: () => {
            return `
╔══════════════════════════════════════════════════╗
║          NEXUS SECURITY COLLECTIVE               ║
║     "In security, paranoia is a virtue."         ║
║                                                  ║
║  > Penetration Testing & Red Teaming            ║
║  > Threat Intelligence & Analysis               ║
║  > Vulnerability Research & Disclosure          ║
║  > Security Training & Awareness                ║
║                                                  ║
║  Type 'help' for available commands.            ║
╚══════════════════════════════════════════════════╝
            `.trim();
        }
    }
};

// Execute command
function executeCommand(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    const terminalOutput = document.querySelector('.terminal-output');
    
    // Add command to output
    const commandLine = document.createElement('p');
    commandLine.innerHTML = `<span class="command-example">guest@nexus:~$</span> ${input}`;
    terminalOutput.appendChild(commandLine);
    
    // Execute command
    if (commands[cmd]) {
        try {
            const result = commands[cmd].execute(args);
            
            // Add result to output
            const resultLine = document.createElement('p');
            resultLine.textContent = result;
            terminalOutput.appendChild(resultLine);
        } catch (error) {
            const errorLine = document.createElement('p');
            errorLine.textContent = `Error: ${error.message}`;
            errorLine.style.color = 'var(--neon-red)';
            terminalOutput.appendChild(errorLine);
        }
    } else {
        const errorLine = document.createElement('p');
        errorLine.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
        errorLine.style.color = 'var(--neon-red)';
        terminalOutput.appendChild(errorLine);
    }
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    // Clear input
    commandInput.value = '';
}

// ============================================
// MATRIX RAIN BACKGROUND
// ============================================

// Create Matrix rain effect
function createMatrixRain() {
    if (!matrixCanvas) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = matrixCanvas.clientWidth;
    canvas.height = matrixCanvas.clientHeight;
    
    // Append to container
    matrixCanvas.appendChild(canvas);
    
    // Matrix characters
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const charArray = chars.split('');
    
    // Columns
    const columns = Math.floor(canvas.width / 15);
    const drops = Array(columns).fill(1);
    
    // Draw function
    function draw() {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color and font
        ctx.fillStyle = '#0F0';
        ctx.font = '15px "Courier New", monospace';
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Draw character
            ctx.fillText(char, i * 15, drops[i] * 15);
            
            // Randomly reset drop
            if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Move drop down
            drops[i]++;
        }
    }
    
    // Resize handler
    function resize() {
        canvas.width = matrixCanvas.clientWidth;
        canvas.height = matrixCanvas.clientHeight;
    }
    
    // Animation loop
    let animationId;
    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle resize
    window.addEventListener('resize', resize);
    
    // Store animation ID for cleanup
    return {
        canvas,
        stop: () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        }
    };
}

// ============================================
// EVENT LISTENERS
// ============================================

// Command input
executeBtn.addEventListener('click', () => {
    if (commandInput.value.trim()) {
        executeCommand(commandInput.value.trim());
    }
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (commandInput.value.trim()) {
            executeCommand(commandInput.value.trim());
        }
    }
});

// Navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const command = link.dataset.command;
        
        // Add to terminal
        const terminalOutput = document.querySelector('.terminal-output');
        const commandLine = document.createElement('p');
        commandLine.innerHTML = `<span class="command-example">root@nexus:~$</span> ${command}`;
        terminalOutput.appendChild(commandLine);
        
        // Scroll to section
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Threat feed
refreshThreatsBtn.addEventListener('click', refreshThreatFeed);

// Network map buttons
mapButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        mapButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update view
        createNetworkTopology(btn.dataset.view);
    });
});

// Vulnerability scanner
startScanBtn.addEventListener('click', simulateVulnerabilityScan);

// Message decoder
decodeBtn.addEventListener('click', decodeMessage);

cipherSelect.addEventListener('change', () => {
    cipherType.textContent = cipherSelect.value.toUpperCase();
    
    // Update sample message based on cipher
    const samples = {
        base64: 'U0dWc2JHOGdWMjl5YkdRaA==',
        rot13: 'Urnyb jbeyq',
        hex: '48656c6c6f20576f726c64',
        binary: '01001000 01100101 01101100 01101100 01101111',
        caesar: 'Khoor Zruog'
    };
    
    encodedInput.value = samples[cipherSelect.value] || '';
    encodedInput.placeholder = `Paste ${cipherSelect.value.toUpperCase()} encrypted message here...`;
});

// Log filters
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Apply filter
        activeLogFilter = btn.dataset.filter;
        applyLogFilter();
    });
});

// Quote navigation
quotePrevBtn.addEventListener('click', prevQuote);
quoteNextBtn.addEventListener('click', nextQuote);

quoteDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showQuote(index);
    });
});

// ============================================
// INITIALIZATION
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('NEXUS SECURITY INTERFACE INITIALIZED');
    
    // Initialize components
    initializeThreatFeed();
    createNetworkTopology('physical');
    initializeLog();
    showQuote(0);
    
    // Start Matrix rain
    const matrixRain = createMatrixRain();
    
    // Add periodic log entries
    setInterval(() => {
        addLogEntry(generateLogEntry('all'));
    }, 10000);
    
    // Add periodic threats
    setInterval(() => {
        // 30% chance to add a threat
        if (Math.random() < 0.3) {
            addThreatEntry(generateRandomThreat());
        }
    }, 15000);
    
    // Add sample command
    setTimeout(() => {
        commandInput.value = 'help';
    }, 1000);
    
    // Add welcome message to terminal
    setTimeout(() => {
        const terminalOutput = document.querySelector('.terminal-output');
        const welcomeLine = document.createElement('p');
        welcomeLine.innerHTML = '<span class="command-example">system@nexus:~$</span> Type commands to interact with the system.';
        terminalOutput.appendChild(welcomeLine);
    }, 2000);
    
    // Update threat feed timestamp periodically
    setInterval(() => {
        const now = new Date();
        const minutes = now.getMinutes();
        
        // Update every 5 minutes
        if (minutes % 5 === 0) {
            threatUpdateTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
    }, 60000);
    
    // Handle window resize for Matrix rain
    window.addEventListener('resize', () => {
        if (matrixRain) {
            matrixRain.canvas.width = matrixCanvas.clientWidth;
            matrixRain.canvas.height = matrixCanvas.clientHeight;
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (matrixRain) {
            matrixRain.stop();
        }
    });
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        decoders,
        generateRandomThreat,
        generateLogEntry
    };
}
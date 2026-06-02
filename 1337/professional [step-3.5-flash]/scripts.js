/* =====================================================
   NEXUS-7 SECURITY OPERATIONS CENTER - SCRIPTS
   Interactive Features & Animations
   ===================================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initTerminalTyping();
    initThreatFeed();
    initNetworkTopology();
    initDecryptModule();
    initAuditLog();
    initSystemStatus();
    initGlitchEffects();
    initNavigation();
    initCRTEffects();
});

/* =====================================================
   TERMINAL TYPING ANIMATION
   ===================================================== */
function initTerminalTyping() {
    const typingContainer = document.getElementById('typing-text');
    const cursor = document.querySelector('.cursor-blink');
    
    if (!typingContainer) return;
    
    const terminalText = `> Initializing NEXUS-7 security protocol...
> Loading threat intelligence database... [OK]
> Connecting to global security network... [OK]
> Scanning for vulnerabilities... [OK]
> Encrypting secure channels... [OK]
> 
> SYSTEM STATUS: ONLINE
> 
> Welcome to NEXUS-7 Security Operations Center.
> You are now connected to the most advanced
> cybersecurity monitoring system on Earth.
> 
> Our AI-powered threat detection has blocked
> 847,293 attacks in the last 24 hours.
> 
> Current threat level: ELEVATED
> Multiple DDoS campaigns detected across
> North America and Europe.
> 
> Use the navigation menu to access:
> - LIVE THREAT FEED: Real-time attack monitoring
> - VULNERABILITIES: CVE database with severity ratings
> - NETWORK TOPOLOGY: Visual network map
> - DECRYPT: Secure message decryption tool
> - AUDIT LOG: Security event monitoring
> 
> All systems are functioning within normal parameters.
> Stand by for incoming threat intelligence...
`;
    
    let charIndex = 0;
    let isTyping = true;
    
    function typeCharacter() {
        if (charIndex < terminalText.length) {
            const char = terminalText.charAt(charIndex);
            typingContainer.textContent += char;
            charIndex++;
            
            // Auto-scroll to bottom
            typingContainer.parentElement.scrollTop = typingContainer.parentElement.scrollHeight;
            
            // Random typing speed for realism
            const randomSpeed = Math.random() * 30 + 10;
            setTimeout(typeCharacter, randomSpeed);
        } else {
            isTyping = false;
            // Keep cursor blinking after typing is done
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeCharacter, 1000);
    
    // Add interactive effect - click to restart typing
    typingContainer.parentElement.addEventListener('click', function() {
        if (!isTyping) {
            typingContainer.textContent = '';
            charIndex = 0;
            isTyping = true;
            typeCharacter();
        }
    });
}

/* =====================================================
   LIVE THREAT FEED
   ===================================================== */
function initThreatFeed() {
    const threatEntries = document.getElementById('threat-entries');
    const threatLevelElement = document.getElementById('threat-level');
    const threatsBlockedElement = document.getElementById('threats-blocked');
    const activeAttacksElement = document.getElementById('active-attacks');
    
    if (!threatEntries) return;
    
    // Threat data pool
    const attackTypes = [
        'SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 
        'Malware', 'Phishing', 'RCE', 'LFI/RFI', 
        'SSRF', 'Zero-Day', 'APT', 'Ransomware'
    ];
    
    const sourceCountries = [
        'CN', 'RU', 'US', 'IR', 'KP', 'BR', 'IN', 'DE', 'FR', 'GB'
    ];
    
    const targetCountries = [
        'US', 'GB', 'DE', 'FR', 'JP', 'CA', 'AU', 'IN', 'BR', 'KR'
    ];
    
    const severities = ['critical', 'high', 'medium', 'low'];
    const severityWeights = [0.1, 0.25, 0.4, 0.25]; // Probability weights
    
    let threatsBlocked = 847293;
    let activeAttacks = 0;
    let threatEntriesCount = 0;
    
    // Generate random IP address
    function randomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    // Generate random timestamp
    function randomTimestamp() {
        const now = new Date();
        const seconds = Math.floor(Math.random() * 60);
        const minutes = Math.floor(Math.random() * 60);
        const hours = Math.floor(Math.random() * 24);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    // Create threat entry element
    function createThreatEntry() {
        const severity = weightedRandom(severities, severityWeights);
        const source = `${randomIP()} (${randomChoice(sourceCountries)})`;
        const target = `${randomIP()} (${randomChoice(targetCountries)})`;
        const attackType = randomChoice(attackTypes);
        const timestamp = randomTimestamp();
        
        const entry = document.createElement('div');
        entry.className = `threat-entry ${severity}`;
        entry.innerHTML = `
            <span class="threat-time">${timestamp}</span>
            <span class="threat-source">${source}</span>
            <span class="threat-target">${target}</span>
            <span class="threat-type">${attackType}</span>
            <span class="threat-severity ${severity}">${severity.toUpperCase()}</span>
        `;
        
        return entry;
    }
    
    // Add new threat entry
    function addThreatEntry() {
        const entry = createThreatEntry();
        threatEntries.insertBefore(entry, threatEntries.firstChild);
        threatEntriesCount++;
        
        // Limit entries to 50
        if (threatEntries.children.length > 50) {
            threatEntries.removeChild(threatEntries.lastChild);
        }
        
        // Update threat level based on recent critical attacks
        updateThreatLevel();
        
        // Update stats
        threatsBlocked += Math.floor(Math.random() * 3) + 1;
        activeAttacks = Math.max(0, activeAttacks + (Math.random() > 0.5 ? 1 : -1));
        
        if (threatsBlockedElement) {
            animateNumber(threatsBlockedElement, threatsBlocked);
        }
        if (activeAttacksElement) {
            animateNumber(activeAttacksElement, activeAttacks);
        }
    }
    
    // Update threat level indicator
    function updateThreatLevel() {
        const recentCritical = Array.from(threatEntries.children)
            .slice(0, 10)
            .filter(entry => entry.classList.contains('critical')).length;
        
        let level = 'LOW';
        let color = '#00ffff';
        
        if (recentCritical >= 3) {
            level = 'CRITICAL';
            color = '#ff3333';
        } else if (recentCritical >= 2) {
            level = 'ELEVATED';
            color = '#ff6600';
        } else if (recentCritical >= 1) {
            level = 'HIGH';
            color = '#ffaa00';
        }
        
        if (threatLevelElement) {
            threatLevelElement.textContent = level;
            threatLevelElement.style.color = color;
            threatLevelElement.style.textShadow = `0 0 10px ${color}`;
        }
    }
    
    // Start adding threats periodically
    setInterval(addThreatEntry, 2000 + Math.random() * 3000);
    
    // Initial batch
    for (let i = 0; i < 5; i++) {
        setTimeout(addThreatEntry, i * 500);
    }
}

/* =====================================================
   NETWORK TOPOLOGY
   ===================================================== */
function initNetworkTopology() {
    const svg = document.getElementById('network-svg');
    const nodeCountElement = document.getElementById('node-count');
    const connectionsElement = document.getElementById('connections');
    const trafficElement = document.getElementById('traffic');
    const latencyElement = document.getElementById('latency');
    
    if (!svg) return;
    
    // Network configuration
    const config = {
        nodeCount: 47,
        connectionCount: 83,
        nodeTypes: [
            { color: '#00ff41', size: 12, type: 'core' },
            { color: '#00ffff', size: 10, type: 'distribution' },
            { color: '#ff00ff', size: 8, type: 'access' },
            { color: '#ffaa00', size: 6, type: 'endpoint' }
        ]
    };
    
    // Generate nodes
    const nodes = [];
    const svgWidth = 1000;
    const svgHeight = 500;
    
    // Create core nodes (center)
    const coreCount = 5;
    for (let i = 0; i < coreCount; i++) {
        nodes.push({
            id: i,
            x: 400 + (i % 3) * 100,
            y: 200 + Math.floor(i / 3) * 100,
            type: 0,
            connections: []
        });
    }
    
    // Create distribution nodes
    const distributionCount = 12;
    for (let i = coreCount; i < coreCount + distributionCount; i++) {
        const angle = ((i - coreCount) / distributionCount) * Math.PI * 2;
        const radius = 150;
        nodes.push({
            id: i,
            x: 500 + Math.cos(angle) * radius,
            y: 250 + Math.sin(angle) * radius,
            type: 1,
            connections: []
        });
    }
    
    // Create access points
    const accessCount = 15;
    for (let i = coreCount + distributionCount; i < coreCount + distributionCount + accessCount; i++) {
        const angle = ((i - coreCount - distributionCount) / accessCount) * Math.PI * 2;
        const radius = 250;
        nodes.push({
            id: i,
            x: 500 + Math.cos(angle) * radius,
            y: 250 + Math.sin(angle) * radius,
            type: 2,
            connections: []
        });
    }
    
    // Create endpoints
    const endpointCount = config.nodeCount - nodes.length;
    for (let i = nodes.length; i < config.nodeCount; i++) {
        const angle = ((i - coreCount - distributionCount - accessCount) / endpointCount) * Math.PI * 2;
        const radius = 350;
        nodes.push({
            id: i,
            x: 500 + Math.cos(angle) * radius,
            y: 250 + Math.sin(angle) * radius,
            type: 3,
            connections: []
        });
    }
    
    // Create connections
    const connections = [];
    const connectionProbability = [0.8, 0.4, 0.2, 0.05]; // Connection probability by type
    
    nodes.forEach((node, i) => {
        // Connect to nearby nodes
        nodes.forEach((otherNode, j) => {
            if (i !== j && Math.random() < connectionProbability[otherNode.type]) {
                const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) + 
                    Math.pow(node.y - otherNode.y, 2)
                );
                
                if (distance < 200 && node.connections.length < 6) {
                    connections.push({ from: i, to: j });
                    node.connections.push(j);
                }
            }
        });
    });
    
    // Draw connections
    connections.forEach(conn => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', nodes[conn.from].x);
        line.setAttribute('y1', nodes[conn.from].y);
        line.setAttribute('x2', nodes[conn.to].x);
        line.setAttribute('y2', nodes[conn.to].y);
        line.setAttribute('stroke', '#00ff4140');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '2,2');
        line.classList.add('network-connection');
        svg.appendChild(line);
    });
    
    // Draw nodes
    nodes.forEach((node, i) => {
        const typeConfig = config.nodeTypes[node.type];
        
        // Node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', typeConfig.size);
        circle.setAttribute('fill', typeConfig.color);
        circle.setAttribute('stroke', 'rgba(0,0,0,0.5)');
        circle.setAttribute('stroke-width', '1');
        circle.classList.add('network-node', `node-${typeConfig.type}`);
        
        // Add glow effect
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', node.x);
        glow.setAttribute('cy', node.y);
        glow.setAttribute('r', typeConfig.size + 5);
        glow.setAttribute('fill', 'none');
        glow.setAttribute('stroke', typeConfig.color);
        glow.setAttribute('stroke-width', '2');
        glow.setAttribute('opacity', '0.3');
        glow.classList.add('node-glow');
        
        svg.appendChild(glow);
        svg.appendChild(circle);
        
        // Animate connections
        const connectionLine = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        connectionLine.setAttribute('cx', node.x);
        connectionLine.setAttribute('cy', node.y);
        connectionLine.setAttribute('r', '2');
        connectionLine.setAttribute('fill', typeConfig.color);
        connectionLine.classList.add('connection-pulse');
        svg.appendChild(connectionLine);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .node-glow {
            animation: node-pulse 2s infinite alternate;
        }
        .connection-pulse {
            animation: connection-flow 3s infinite linear;
        }
        @keyframes node-pulse {
            0% { opacity: 0.2; r: ${config.nodeTypes[0].size + 5}; }
            100% { opacity: 0.5; r: ${config.nodeTypes[0].size + 10}; }
        }
        @keyframes connection-flow {
            0% { opacity: 0; r: 1; }
            50% { opacity: 0.8; r: 3; }
            100% { opacity: 0; r: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Update stats periodically
    function updateNetworkStats() {
        if (nodeCountElement) {
            animateNumber(nodeCountElement, config.nodeCount);
        }
        if (connectionsElement) {
            animateNumber(connectionsElement, connections.length);
        }
        if (trafficElement) {
            const traffic = (Math.random() * 2 + 0.5).toFixed(1);
            trafficElement.textContent = `${traffic} TB/s`;
        }
        if (latencyElement) {
            const latency = Math.floor(Math.random() * 20) + 5;
            latencyElement.textContent = `${latency}ms`;
        }
    }
    
    setInterval(updateNetworkStats, 5000);
    updateNetworkStats();
}

/* =====================================================
   DECRYPT MODULE
   ===================================================== */
function initDecryptModule() {
    const decryptBtn = document.getElementById('decrypt-btn');
    const progressBar = document.getElementById('decrypt-progress');
    const progressText = document.querySelector('.progress-text');
    const plainTextElement = document.getElementById('plain-text');
    const algorithmSelect = document.getElementById('algorithm');
    const cipherTextElement = document.getElementById('cipher-text');
    
    if (!decryptBtn) return;
    
    const decryptedMessage = `// TOP SECRET TRANSMISSION //
// AUTH CODE: 7F-3A-9C-2D
// TIMESTAMP: ${new Date().toISOString()}
//
// MESSAGE:
//
// NEXUS-7 has detected a coordinated
// cyber-attack targeting critical
// infrastructure across three continents.
// 
// The attack vector appears to be a
// sophisticated APT using zero-day
// exploits in legacy systems.
//
// IMMEDIATE ACTION REQUIRED:
// 1. Isolate affected networks
// 2. Deploy emergency patches
// 3. Activate incident response protocol
// 4. Notify government agencies
//
// Threat actor identified: "PHANTOM SHADOW"
// Confidence level: 87%
// Expected impact: CATASTROPHIC
//
// This message will self-destruct in
// 5... 4... 3... 2... 1...
// TRANSMISSION ENDED
`;
    
    let isDecrypting = false;
    
    decryptBtn.addEventListener('click', function() {
        if (isDecrypting) return;
        
        isDecrypting = true;
        decryptBtn.disabled = true;
        
        const cipherText = cipherTextElement.value.trim();
        const algorithm = algorithmSelect.value;
        
        // Reset output
        plainTextElement.innerHTML = '<span class="locked">[DECRYPTING] Processing...</span>';
        
        // Simulate decryption process
        let progress = 0;
        const decryptionInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${Math.floor(progress)}%`;
            }
            
            // Add random characters during decryption
            if (progress < 100 && plainTextElement) {
                const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                let currentText = plainTextElement.textContent;
                if (currentText.includes('Processing')) {
                    currentText = '';
                }
                // Add some random characters
                for (let i = 0; i < 3; i++) {
                    currentText += randomChars[Math.floor(Math.random() * randomChars.length)];
                }
                plainTextElement.innerHTML = `<span class="decrypted">${currentText}</span>`;
            }
            
            if (progress >= 100) {
                clearInterval(decryptionInterval);
                
                // Show decrypted message
                setTimeout(() => {
                    if (plainTextElement) {
                        plainTextElement.innerHTML = `<pre class="decrypted">${decryptedMessage}</pre>`;
                    }
                    
                    // Reset button after delay
                    setTimeout(() => {
                        isDecrypting = false;
                        decryptBtn.disabled = false;
                        progressBar.style.width = '0%';
                        progressText.textContent = '0%';
                    }, 2000);
                }, 500);
            }
        }, 200);
    });
    
    // Add random glitch effect to cipher text
    setInterval(() => {
        if (!isDecrypting && cipherTextElement) {
            const lines = cipherTextElement.value.split('\n');
            const randomLine = Math.floor(Math.random() * lines.length);
            const originalLine = lines[randomLine];
            
            if (originalLine.trim()) {
                // Create glitched version
                const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                let glitched = '';
                for (let char of originalLine) {
                    if (Math.random() < 0.1 && char !== ' ') {
                        glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        glitched += char;
                    }
                }
                lines[randomLine] = glitched;
                cipherTextElement.value = lines.join('\n');
                
                // Restore after delay
                setTimeout(() => {
                    lines[randomLine] = originalLine;
                    cipherTextElement.value = lines.join('\n');
                }, 100);
            }
        }
    }, 3000);
}

/* =====================================================
   SECURITY AUDIT LOG
   ===================================================== */
function initAuditLog() {
    const auditTerminal = document.getElementById('audit-terminal');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const pauseBtn = document.getElementById('pause-log');
    const clearBtn = document.getElementById('clear-log');
    const exportBtn = document.getElementById('export-log');
    const entryCountElement = document.getElementById('entry-count');
    const lastUpdateElement = document.getElementById('last-update');
    
    if (!auditTerminal) return;
    
    let isPaused = false;
    let currentFilter = 'all';
    let entries = [];
    let entryId = 0;
    
    // Audit message templates
    const auditMessages = {
        critical: [
            'CRITICAL: Unauthorized access attempt from IP 10.0.${n}.${n} blocked by firewall',
            'CRITICAL: Database corruption detected in sector 0x${hex} - restoring from backup',
            'CRITICAL: Root privilege escalation attempt detected and terminated',
            'CRITICAL: Malware signature detected - quarantine initiated',
            'CRITICAL: DDoS attack mitigation activated - ${n} Gbps traffic filtered'
        ],
        warning: [
            'WARNING: Multiple failed login attempts from ${ip}',
            'WARNING: Unusual traffic pattern detected from subnet 192.168.${n}.0/24',
            'WARNING: SSL certificate for ${domain} expires in ${n} days',
            'WARNING: System resource usage above 85% threshold',
            'WARNING: Unusual data exfiltration pattern detected'
        ],
        info: [
            'INFO: System scan completed - ${n} vulnerabilities found',
            'INFO: Security patch ${version} successfully installed',
            'INFO: Backup completed - ${size} GB encrypted',
            'INFO: Network device ${device} connected',
            'INFO: User ${user} authenticated successfully'
        ]
    };
    
    // Generate random values
    function randomTemplate(template) {
        return template
            .replace(/\${n}/g, () => Math.floor(Math.random() * 255))
            .replace(/\${hex}/g, () => Math.random().toString(16).substring(2, 6).toUpperCase())
            .replace(/\${ip}/g, () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`)
            .replace(/\${domain}/g, () => ['nexus-7.net', 'secure.gov', 'defense.mil'][Math.floor(Math.random()*3)])
            .replace(/\${version}/g, () => `v${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*10)}`)
            .replace(/\${size}/g, () => (Math.random() * 10 + 1).toFixed(1))
            .replace(/\${device}/g, () => ['router-core-01', 'firewall-main', 'switch-dist-1'][Math.floor(Math.random()*3)])
            .replace(/\${user}/g, () => ['admin', 'security_ops', 'sysadmin', 'analyst'][Math.floor(Math.random()*4)]);
    }
    
    // Create audit entry
    function createAuditEntry() {
        const level = weightedRandom(['critical', 'warning', 'info'], [0.15, 0.35, 0.5]);
        const message = randomTemplate(randomChoice(auditMessages[level]));
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        return {
            id: entryId++,
            level,
            message,
            timestamp
        };
    }
    
    // Add entry to display
    function addEntry(entry) {
        entries.push(entry);
        
        // Filter based on current selection
        if (currentFilter !== 'all' && entry.level !== currentFilter) {
            return;
        }
        
        const entryElement = document.createElement('div');
        entryElement.className = `audit-entry ${entry.level}`;
        entryElement.dataset.id = entry.id;
        entryElement.innerHTML = `
            <span class="audit-timestamp">[${entry.timestamp}]</span>
            <span class="audit-message">${entry.message}</span>
        `;
        
        auditTerminal.appendChild(entryElement);
        
        // Auto-scroll to bottom
        auditTerminal.scrollTop = auditTerminal.scrollHeight;
        
        // Limit displayed entries
        while (auditTerminal.children.length > 100) {
            auditTerminal.removeChild(auditTerminal.firstChild);
        }
        
        // Update counts
        if (entryCountElement) {
            entryCountElement.textContent = entries.length;
        }
        if (lastUpdateElement) {
            lastUpdateElement.textContent = entry.timestamp.split(' ')[1];
        }
    }
    
    // Generate random entry periodically
    function generateAuditEntry() {
        if (!isPaused) {
            const entry = createAuditEntry();
            addEntry(entry);
        }
    }
    
    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            
            // Clear and re-add filtered entries
            auditTerminal.innerHTML = '';
            entries.forEach(entry => {
                if (currentFilter === 'all' || entry.level === currentFilter) {
                    addEntry(entry);
                }
            });
        });
    });
    
    // Control buttons
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            isPaused = !isPaused;
            this.textContent = isPaused ? '▶ RESUME' : '⏸ PAUSE';
            this.style.color = isPaused ? 'var(--color-amber)' : '';
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            entries = [];
            auditTerminal.innerHTML = '';
            if (entryCountElement) {
                entryCountElement.textContent = '0';
            }
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const logText = entries.map(e => 
                `[${e.timestamp}] ${e.message.toUpperCase()}`
            ).join('\n');
            
            const blob = new Blob([logText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nexus7_audit_${Date.now()}.log`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    
    // Start generating entries
    setInterval(generateAuditEntry, 3000 + Math.random() * 5000);
    
    // Initial entries
    for (let i = 0; i < 5; i++) {
        setTimeout(generateAuditEntry, i * 1000);
    }
}

/* =====================================================
   SYSTEM STATUS & UPTIME
   ===================================================== */
function initSystemStatus() {
    const uptimeElement = document.getElementById('uptime');
    const systemTimeElement = document.getElementById('system-time');
    
    if (!uptimeElement || !systemTimeElement) return;
    
    let uptimeSeconds = 0;
    
    function updateUptime() {
        uptimeSeconds++;
        
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        
        uptimeElement.textContent = 
            `${String(days).padStart(3, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    function updateSystemTime() {
        const now = new Date();
        const timeString = now.toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .substring(0, 19);
        systemTimeElement.textContent = timeString;
    }
    
    setInterval(updateUptime, 1000);
    setInterval(updateSystemTime, 1000);
    updateSystemTime();
}

/* =====================================================
   GLITCH EFFECTS
   ===================================================== */
function initGlitchEffects() {
    // Random glitch on elements with .glitch class
    const glitchElements = document.querySelectorAll('.glitch');
    
    setInterval(() => {
        glitchElements.forEach(element => {
            if (Math.random() < 0.1) { // 10% chance every interval
                element.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                element.style.textShadow = `
                    ${Math.random() * 4 - 2}px 0 var(--color-cyan),
                    ${Math.random() * -4 + 2}px 0 var(--color-magenta)
                `;
                
                setTimeout(() => {
                    element.style.transform = '';
                    element.style.textShadow = '';
                }, 100);
            }
        });
    }, 2000);
    
    // Random ASCII logo flicker
    const asciiLogo = document.querySelector('.ascii-logo');
    if (asciiLogo) {
        setInterval(() => {
            if (Math.random() < 0.15) {
                asciiLogo.style.opacity = '0.3';
                setTimeout(() => {
                    asciiLogo.style.opacity = '1';
                }, 50);
            }
        }, 3000);
    }
}

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect
                targetSection.style.boxShadow = 'inset 0 0 50px rgba(0, 255, 65, 0.2)';
                setTimeout(() => {
                    targetSection.style.boxShadow = '';
                }, 1000);
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* =====================================================
   CRT EFFECTS
   ===================================================== */
function initCRTEffects() {
    const cursor = document.querySelector('.terminal-cursor');
    
    if (!cursor) return;
    
    // Show custom cursor only on desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 10 + 'px';
            cursor.style.top = e.clientY + 10 + 'px';
        });
        
        // Add click effect
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });
    }
    
    // Random screen flicker
    setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance
            const crtOverlay = document.querySelector('.crt-overlay');
            if (crtOverlay) {
                crtOverlay.style.background = 'rgba(0, 255, 65, 0.02)';
                setTimeout(() => {
                    crtOverlay.style.background = '';
                }, 50);
            }
        }
    }, 100);
}

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function weightedRandom(choices, weights) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < choices.length; i++) {
        if (random < weights[i]) {
            return choices[i];
        }
        random -= weights[i];
    }
    
    return choices[0];
}

function animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const diff = targetValue - currentValue;
    const steps = 20;
    const stepValue = diff / steps;
    let step = 0;
    
    function animate() {
        step++;
        if (step <= steps) {
            const newValue = Math.floor(currentValue + stepValue * step);
            element.textContent = newValue.toLocaleString();
            requestAnimationFrame(animate);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
    
    animate();
}

/* =====================================================
   PERFORMANCE MONITORING (Optional)
   ===================================================== */
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Could display FPS in debug mode
        // console.log(`FPS: ${fps}`);
    }
    
    requestAnimationFrame(measureFPS);
}

// Uncomment to enable FPS monitoring:
// measureFPS();

/* =====================================================
   KEYBOARD SHORTCUTS
   ===================================================== */
document.addEventListener('keydown', function(e) {
    // Ctrl+K to focus search/navigation (if implemented)
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Could implement quick navigation
    }
    
    // Escape to close modals (if any)
    if (e.key === 'Escape') {
        // Close any open modals
    }
});

/* =====================================================
   CONSOLE EASTER EGG
   ===================================================== */
console.log(`
%c██╗  ██╗███████╗██╗   ██╗███████╗███████╗███████╗██╗███╗   ██╗
██║  ██║██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██║████╗  ██║
███████║█████╗  ██║   ██║███████╗█████╗  ███████╗██║██╔██╗ ██║
██╔══██║██╔══╝  ╚██╗ ██╔╝╚════██║██╔══╝  ╚════██║██║██║╚██╗██║
██║  ██║███████╗ ╚████╔╝ ███████║██║     ███████║██║██║ ╚████║
╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚══════╝╚═╝     ╚══════╝╚═╝╚═╝  ╚═══╝
                                                 NEXUS-7 SOC
`, 
'color: #00ff41; font-family: monospace; font-size: 12px; background: #000; padding: 10px;'
);

console.log('%cNEXUS-7 Security Operations Center - Initialized', 'color: #00ff41; font-weight: bold;');
console.log('%cAll systems operational. Threat level: ELEVATED', 'color: #ffaa00; font-weight: bold;');
console.log('%cRemember: This is a demonstration website for educational purposes only.', 'color: #888; font-style: italic;');
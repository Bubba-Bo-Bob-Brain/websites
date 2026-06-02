// ========================================
// CYBERSEC NEXUS - INTERACTIVE TERMINAL
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTerminalEffects();
    initNavigation();
    initThreatFeed();
    initVulnerabilityDatabase();
    initNetworkMap();
    initCryptographyLab();
    initAuditLog();
    initSystemStatus();
    initAnimations();
});

// ========================================
// TERMINAL EFFECTS & ANIMATIONS
// ========================================

function initTerminalEffects() {
    // Add scan line effect to body
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line-effect';
    document.body.appendChild(scanLine);

    // Random glitch effect
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.classList.add('glitch');
            setTimeout(() => {
                document.body.classList.remove('glitch');
            }, 50);
        }
    }, 1000);

    // Typing effect for nav footer
    const commands = [
        'sudo nmap -sV target_ip',
        'john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt',
        'wireshark -i eth0 -k',
        'aircrack-ng capture.cap -w wordlist.txt',
        'sqlmap -u "http://target.com?id=1" --dbs',
        'hydra -l user -P passwords.txt ssh://target',
        'nc -lvnp 4444',
        'msfconsole -q -x "use exploit/multi/handler"'
    ];

    let commandIndex = 0;
    let charIndex = 0;
    const typingElement = document.getElementById('nav-typing');
    
    function typeCommand() {
        if (charIndex < commands[commandIndex].length) {
            typingElement.textContent += commands[commandIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeCommand, 50 + Math.random() * 50);
        } else {
            setTimeout(() => {
                typingElement.textContent = '';
                charIndex = 0;
                commandIndex = (commandIndex + 1) % commands.length;
                typeCommand();
            }, 2000);
        }
    }
    
    typeCommand();

    // Add hover sound effect
    const navLinks = document.querySelectorAll('.nav-link, .control-btn, .algo-btn');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Visual feedback instead of sound
            link.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
}

// ========================================
// NAVIGATION SYSTEM
// ========================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.terminal-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    
                    // Trigger section-specific animations
                    if (targetSection === 'threat-feed') {
                        animateThreatFeed();
                    } else if (targetSection === 'network-map') {
                        animateNetworkNodes();
                    }
                }
            });
            
            // Update typing command
            const typingElement = document.getElementById('nav-typing');
            typingElement.textContent = `./nav --${targetSection}`;
        });
    });
}

// ========================================
// THREAT INTELLIGENCE FEED
// ========================================

function initThreatFeed() {
    const threatFeed = document.getElementById('threat-feed');
    const pauseBtn = document.getElementById('pause-feed');
    const clearBtn = document.getElementById('clear-feed');
    let feedInterval;
    let isPaused = false;
    
    // Sample threat data
    const threats = [
        {
            type: 'critical',
            description: 'DDoS attack detected from botnet 42.42.x.x',
            ip: '42.42.42.42',
            vector: 'UDP Flood'
        },
        {
            type: 'high',
            description: 'Brute force attempt on SSH port',
            ip: '192.168.1.105',
            vector: 'SSH-2.0'
        },
        {
            type: 'medium',
            description: 'Port scan detected from suspicious IP',
            ip: '10.10.10.10',
            vector: 'SYN Scan'
        },
        {
            type: 'low',
            description: 'Unusual outbound traffic to known C2 server',
            ip: '172.16.0.55',
            vector: 'HTTP Beacon'
        },
        {
            type: 'critical',
            description: 'Zero-day exploit attempt blocked',
            ip: '203.0.113.42',
            vector: 'CVE-2023-44487'
        },
        {
            type: 'high',
            description: 'SQL injection attempt detected',
            ip: '198.51.100.23',
            vector: 'SQLi'
        }
    ];
    
    function addThreatEntry() {
        if (isPaused) return;
        
        const threat = threats[Math.floor(Math.random() * threats.length)];
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const entry = document.createElement('div');
        entry.className = `threat-entry ${threat.type}`;
        entry.innerHTML = `
            <span class="threat-timestamp">[${timestamp}]</span>
            <span class="threat-description">${threat.description} [${threat.vector}]</span>
            <span class="threat-ip">${threat.ip}</span>
        `;
        
        // Add to top of feed
        threatFeed.insertBefore(entry, threatFeed.firstChild);
        
        // Update stats
        updateThreatStats();
        
        // Remove old entries if too many
        if (threatFeed.children.length > 50) {
            threatFeed.removeChild(threatFeed.lastChild);
        }
    }
    
    function updateThreatStats() {
        document.getElementById('attacks-per-minute').textContent = 
            Math.floor(Math.random() * 50) + 10;
        document.getElementById('blocked-attacks').textContent = 
            Math.floor(Math.random() * 1000) + 500;
        document.getElementById('unique-ips').textContent = 
            Math.floor(Math.random() * 200) + 100;
        
        // Randomly update threat level
        const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const levelElement = document.getElementById('threat-level');
        levelElement.textContent = levels[Math.floor(Math.random() * levels.length)];
        levelElement.className = levelElement.textContent.toLowerCase();
    }
    
    // Start threat feed
    feedInterval = setInterval(addThreatEntry, 2000);
    
    // Add initial entries
    for (let i = 0; i < 5; i++) {
        setTimeout(() => addThreatEntry(), i * 500);
    }
    
    // Pause/Resume functionality
    pauseBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        this.textContent = isPaused ? '▶ RESUME' : '|| PAUSE';
        this.style.color = isPaused ? '#ff6600' : '#00ff41';
        
        if (!isPaused) {
            feedInterval = setInterval(addThreatEntry, 2000);
        } else {
            clearInterval(feedInterval);
        }
    });
    
    // Clear feed
    clearBtn.addEventListener('click', function() {
        threatFeed.innerHTML = '';
        updateThreatStats();
    });
    
    function animateThreatFeed() {
        threatFeed.style.animation = 'none';
        threatFeed.offsetHeight; // Trigger reflow
        threatFeed.style.animation = 'fadeIn 0.5s ease';
    }
}

// ========================================
// VULNERABILITY DATABASE
// ========================================

function initVulnerabilityDatabase() {
    const vulnItems = document.querySelectorAll('.vuln-item');
    const vulnDetails = document.getElementById('vuln-details-content');
    const searchInput = document.getElementById('vuln-search');
    const closeBtn = document.querySelector('.close-details');
    
    // Vulnerability details data
    const vulnData = {
        'CVE-2023-44487': {
            title: 'HTTP/2 Rapid Reset Attack',
            description: 'A critical vulnerability in HTTP/2 protocol implementation that allows for distributed denial of service (DDoS) attacks by rapidly resetting streams.',
            impact: 'Service disruption, resource exhaustion, potential system crash',
            mitigation: 'Update to patched versions of web servers, implement rate limiting, use WAF rules',
            references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-44487', 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-44487']
        },
        'CVE-2023-4966': {
            title: 'Citrix Bleed - Session Hijacking',
            description: 'A critical session hijacking vulnerability in Citrix ADC and Gateway that allows attackers to bypass authentication and take over user sessions.',
            impact: 'Unauthorized access, data breach, privilege escalation',
            mitigation: 'Apply vendor patches immediately, terminate active sessions, implement MFA',
            references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-4966']
        },
        'CVE-2023-36884': {
            title: 'Office HTML RCE Vulnerability',
            description: 'A remote code execution vulnerability in Microsoft Office that allows attackers to execute arbitrary code through specially crafted documents.',
            impact: 'Complete system compromise, malware installation, data theft',
            mitigation: 'Apply security updates, enable Protected View, use attack surface reduction rules',
            references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-36884']
        }
    };
    
    vulnItems.forEach(item => {
        item.addEventListener('click', function() {
            const cve = this.getAttribute('data-cve');
            const data = vulnData[cve];
            
            if (data) {
                vulnDetails.innerHTML = `
                    <h4>${data.title}</h4>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Impact:</strong> ${data.impact}</p>
                    <p><strong>Mitigation:</strong> ${data.mitigation}</p>
                    <p><strong>References:</strong></p>
                    <ul>
                        ${data.references.map(ref => `<li><a href="${ref}" target="_blank">${ref}</a></li>`).join('')}
                    </ul>
                `;
                
                // Highlight selected item
                vulnItems.forEach(vi => vi.style.borderColor = '');
                this.style.borderColor = '#00ff41';
            }
        });
    });
    
    // Close details
    closeBtn.addEventListener('click', function() {
        vulnDetails.innerHTML = '<p class="placeholder">Select a vulnerability to view details...</p>';
        vulnItems.forEach(vi => vi.style.borderColor = '');
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        vulnItems.forEach(item => {
            const cve = item.getAttribute('data-cve').toLowerCase();
            const title = item.querySelector('.vuln-title').textContent.toLowerCase();
            
            if (cve.includes(searchTerm) || title.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ========================================
// NETWORK TOPOLOGY MAP
// ========================================

function initNetworkMap() {
    const mapGrid = document.querySelector('.map-grid');
    const scanBtn = document.getElementById('scan-network');
    const trafficBtn = document.getElementById('show-traffic');
    
    // Network node data
    const nodes = [
        { type: 'firewall', icon: '🛡️', label: 'FIREWALL', ip: '192.168.1.1', status: 'online' },
        { type: 'server', icon: '🖥️', label: 'WEB SERVER', ip: '192.168.1.10', status: 'online' },
        { type: 'server', icon: '📁', label: 'FILE SERVER', ip: '192.168.1.11', status: 'online' },
        { type: 'workstation', icon: '💻', label: 'WORKSTATION-01', ip: '192.168.1.100', status: 'online' },
        { type: 'workstation', icon: '💻', label: 'WORKSTATION-02', ip: '192.168.1.101', status: 'compromised' },
        { type: 'iot', icon: '📱', label: 'IOT-GATEWAY', ip: '192.168.1.50', status: 'online' },
        { type: 'server', icon: '🗄️', label: 'DATABASE', ip: '192.168.1.20', status: 'online' },
        { type: 'workstation', icon: '💻', label: 'ADMIN-WS', ip: '192.168.1.150', status: 'online' },
        { type: 'iot', icon: '📹', label: 'SECURITY-CAM', ip: '192.168.1.60', status: 'online' },
        { type: 'firewall', icon: '🔥', label: 'DMZ-FW', ip: '10.0.0.1', status: 'online' },
        { type: 'server', icon: '🌐', label: 'DMZ-WEB', ip: '10.0.0.10', status: 'online' },
        { type: 'server', icon: '📧', label: 'MAIL-SERVER', ip: '10.0.0.20', status: 'online' }
    ];
    
    // Generate network nodes
    function generateNodes() {
        mapGrid.innerHTML = '';
        
        nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.className = `network-node ${node.type}`;
            nodeElement.innerHTML = `
                <div class="node-icon">${node.icon}</div>
                <div class="node-label">${node.label}</div>
                <div class="node-ip">${node.ip}</div>
                <div class="node-status ${node.status === 'compromised' ? 'compromised' : ''}"></div>
            `;
            
            nodeElement.addEventListener('click', function() {
                showNodeDetails(node);
            });
            
            mapGrid.appendChild(nodeElement);
        });
    }
    
    function showNodeDetails(node) {
        const statusColor = node.status === 'compromised' ? '#ff003c' : '#00ff41';
        const statusText = node.status === 'compromised' ? 'COMPROMISED' : 'ONLINE';
        
        alert(`Node Details:\n\nType: ${node.type.toUpperCase()}\nIP: ${node.ip}\nStatus: ${statusText}\nLabel: ${node.label}`);
    }
    
    // Scan network animation
    scanBtn.addEventListener('click', function() {
        const nodes = document.querySelectorAll('.network-node');
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.animation = 'pulse 0.5s';
                setTimeout(() => {
                    node.style.animation = '';
                }, 500);
            }, index * 100);
        });
    });
    
    // Show traffic animation
    trafficBtn.addEventListener('click', function() {
        const nodes = document.querySelectorAll('.network-node');
        nodes.forEach(node => {
            const randomDelay = Math.random() * 2;
            node.style.transition = `all ${0.5 + Math.random()}s ease`;
            node.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
            
            setTimeout(() => {
                node.style.transform = '';
            }, 2000);
        });
    });
    
    function animateNetworkNodes() {
        generateNodes();
        
        // Randomly change node status
        setInterval(() => {
            const randomIndex = Math.floor(Math.random() * nodes.length);
            nodes[randomIndex].status = nodes[randomIndex].status === 'online' ? 'compromised' : 'online';
            
            const nodeElements = document.querySelectorAll('.network-node');
            if (nodeElements[randomIndex]) {
                const statusElement = nodeElements[randomIndex].querySelector('.node-status');
                statusElement.className = `node-status ${nodes[randomIndex].status === 'compromised' ? 'compromised' : ''}`;
            }
        }, 5000);
    }
    
    generateNodes();
}

// ========================================
// CRYPTOGRAPHY LAB
// ========================================

function initCryptographyLab() {
    // Decryption functionality
    const decryptBtn = document.getElementById('decrypt-btn');
    const progressBar = document.getElementById('decryption-progress');
    const decryptedOutput = document.getElementById('decrypted-output');
    const encryptedText = document.getElementById('encrypted-text');
    
    decryptBtn.addEventListener('click', function() {
        // Reset
        progressBar.style.width = '0%';
        decryptedOutput.classList.add('hidden');
        
        // Animate progress bar
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Show decrypted message
                setTimeout(() => {
                    decryptedOutput.classList.remove('hidden');
                    decryptBtn.textContent = 'DECRYPT AGAIN';
                }, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    });
    
    // Hash generator functionality
    const hashInput = document.getElementById('hash-input');
    const hashResult = document.getElementById('hash-result');
    const algoButtons = document.querySelectorAll('.algo-btn');
    const copyHashBtn = document.getElementById('copy-hash');
    let currentAlgo = 'md5';
    
    algoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            algoButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentAlgo = this.getAttribute('data-algo');
            generateHash();
        });
    });
    
    hashInput.addEventListener('input', generateHash);
    
    function generateHash() {
        const text = hashInput.value;
        if (!text) {
            hashResult.textContent = 'Awaiting input...';
            return;
        }
        
        // Simulate hash generation (in real implementation, use crypto-js)
        let hash = '';
        const chars = '0123456789abcdef';
        
        // Different lengths for different algorithms
        const lengths = {
            'md5': 32,
            'sha1': 40,
            'sha256': 64,
            'sha512': 128
        };
        
        const length = lengths[currentAlgo];
        
        for (let i = 0; i < length; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
            
            // Add spaces for readability
            if (i % 8 === 7 && i < length - 1) {
                hash += ' ';
            }
        }
        
        hashResult.textContent = `${currentAlgo.toUpperCase()}: ${hash}`;
    }
    
    // Copy hash to clipboard
    copyHashBtn.addEventListener('click', function() {
        const hashText = hashResult.textContent;
        if (hashText && hashText !== 'Awaiting input...') {
            navigator.clipboard.writeText(hashText).then(() => {
                const originalText = this.textContent;
                this.textContent = 'COPIED!';
                this.style.color = '#00ff41';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            });
        }
    });
    
    // Initial hash generation
    generateHash();
}

// ========================================
// AUDIT LOG SYSTEM
// ========================================

function initAuditLog() {
    const logEntries = document.getElementById('audit-log-entries');
    const logFilter = document.getElementById('log-filter');
    let logInterval;
    
    // Log entry templates
    const logTemplates = {
        auth: [
            'User admin authenticated successfully',
            'Failed login attempt from 192.168.1.105',
            'Password reset requested for user john',
            'Two-factor authentication enabled for user alice',
            'Session expired for user bob'
        ],
        access: [
            'Access granted to /var/www/html',
            'Permission denied for /etc/shadow',
            'File downloaded: /home/user/document.pdf',
            'Database query executed: SELECT * FROM users',
            'API endpoint accessed: /api/v1/data'
        ],
        system: [
            'System backup completed successfully',
            'Disk space warning: 85% used',
            'Service apache2 restarted',
            'Kernel update available',
            'Scheduled maintenance initiated'
        ],
        threat: [
            'Brute force attack detected from 10.10.10.10',
            'Malware signature detected in uploaded file',
            'Suspicious outbound connection blocked',
            'Port scan detected from external IP',
            'SQL injection attempt blocked by WAF'
        ]
    };
    
    function generateLogEntry() {
        const types = Object.keys(logTemplates);
        const type = types[Math.floor(Math.random() * types.length)];
        const messages = logTemplates[type];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.setAttribute('data-type', type);
        entry.innerHTML = `
            <span class="log-timestamp">[${timestamp}]</span>
            <span class="log-type">${type.toUpperCase()}</span>
            <span class="log-message">${message}</span>
        `;
        
        logEntries.insertBefore(entry, logEntries.firstChild);
        
        // Update stats
        updateLogStats();
        
        // Remove old entries
        if (logEntries.children.length > 100) {
            logEntries.removeChild(logEntries.lastChild);
        }
    }
    
    function updateLogStats() {
        const entries = logEntries.querySelectorAll('.log-entry');
        const total = entries.length;
        let critical = 0;
        let warnings = 0;
        
        entries.forEach(entry => {
            if (entry.classList.contains('threat')) critical++;
            if (entry.classList.contains('auth') && entry.textContent.includes('Failed')) warnings++;
        });
        
        document.getElementById('total-events').textContent = total;
        document.getElementById('critical-events').textContent = critical;
        document.getElementById('warning-events').textContent = warnings;
    }
    
    // Filter functionality
    logFilter.addEventListener('change', function() {
        const filterValue = this.value;
        const entries = logEntries.querySelectorAll('.log-entry');
        
        entries.forEach(entry => {
            if (filterValue === 'all') {
                entry.style.display = 'grid';
            } else {
                const entryType = entry.getAttribute('data-type');
                entry.style.display = entryType === filterValue ? 'grid' : 'none';
            }
        });
    });
    
    // Start log generation
    logInterval = setInterval(generateLogEntry, 3000);
    
    // Generate initial entries
    for (let i = 0; i < 10; i++) {
        setTimeout(() => generateLogEntry(), i * 200);
    }
}

// ========================================
// SYSTEM STATUS & TIMERS
// ========================================

function initSystemStatus() {
    // Update current time
    function updateTime() {
        const now = new Date();
        const timeString = now.toTimeString().substring(0, 8);
        const dateString = now.toISOString().substring(0, 10);
        
        document.getElementById('current-time').textContent = timeString;
        document.getElementById('current-date').textContent = dateString;
    }
    
    // Update system uptime
    let uptimeSeconds = 0;
    function updateUptime() {
        uptimeSeconds++;
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        
        document.getElementById('system-uptime').textContent = 
            `${days} days, ${hours} hours, ${minutes} minutes`;
    }
    
    // Update connection stats
    function updateConnectionStats() {
        document.getElementById('active-connections').textContent = 
            Math.floor(Math.random() * 100) + 50;
        document.getElementById('data-in').textContent = 
            (Math.random() * 100).toFixed(2) + ' MB';
        document.getElementById('data-out').textContent = 
            (Math.random() * 50).toFixed(2) + ' MB';
    }
    
    // Initialize timers
    setInterval(updateTime, 1000);
    setInterval(updateUptime, 1000);
    setInterval(updateConnectionStats, 5000);
    
    // Initial updates
    updateTime();
    updateConnectionStats();
}

// ========================================
// ANIMATIONS & VISUAL EFFECTS
// ========================================

function initAnimations() {
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        @keyframes scan-line {
            0% { top: -100%; }
            100% { top: 100%; }
        }
        
        .glitch {
            animation: glitch 0.1s ease;
        }
        
        .scan-line-effect {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.5), transparent);
            z-index: 9999;
            animation: scan-line 8s linear infinite;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for section animations
    const sections = document.querySelectorAll('.terminal-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.5s ease';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.network-node').forEach(node => {
            node.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Random IP generator
function generateRandomIP() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Random MAC address generator
function generateRandomMAC() {
    const hexDigits = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
        mac += hexDigits.charAt(Math.floor(Math.random() * 16));
        mac += hexDigits.charAt(Math.floor(Math.random() * 16));
        if (i < 5) mac += ':';
    }
    return mac;
}

// Format bytes to human readable
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('vuln-search').focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        document.getElementById('vuln-search').value = '';
        document.getElementById('vuln-search').dispatchEvent(new Event('input'));
    }
    
    // Number keys for navigation
    if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey) {
        const navLinks = document.querySelectorAll('.nav-link');
        const index = parseInt(e.key) - 1;
        if (navLinks[index]) {
            navLinks[index].click();
        }
    }
});

console.log('%c CYBERSEC NEXUS INITIALIZED ', 'background: #000; color: #00ff41; font-size: 20px; font-weight: bold;');
console.log('%c Terminal ready for operations ', 'color: #00d4ff; font-size: 14px;');
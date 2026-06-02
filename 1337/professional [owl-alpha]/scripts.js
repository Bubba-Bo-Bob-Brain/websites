// ============================================
// CYBER::SECURITY COMMAND CENTER - SCRIPTS
// Interactive Security Operations Terminal
// ============================================

(function() {
    'use strict';

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const Utils = {
        randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        
        randomFloat: (min, max) => Math.random() * (max - min) + min,
        
        randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
        
        formatTime: (date) => {
            return date.toTimeString().split(' ')[0];
        },
        
        formatDate: (date) => {
            return date.toLocaleDateString('en-US', { 
                month: '2-digit', 
                day: '2-digit', 
                year: 'numeric' 
            });
        },
        
        padZero: (num, size = 2) => {
            let s = num.toString();
            while (s.length < size) s = '0' + s;
            return s;
        },
        
        generateId: () => {
            return 'ID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        },
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // ============================================
    // DATA SOURCES
    // ============================================

    const DataSources = {
        countries: [
            'CN', 'RU', 'US', 'KP', 'IR', 'BR', 'IN', 'UA', 'RO', 'VN',
            'ID', 'BD', 'PK', 'NG', 'EG', 'TR', 'DE', 'GB', 'FR', 'JP'
        ],
        
        attackTypes: [
            'SQL Injection', 'XSS Attack', 'Brute Force', 'DDoS', 'Phishing',
            'Malware Dropper', 'Ransomware', 'Zero-Day Exploit', 'Man-in-Middle',
            'Credential Stuffing', 'Port Scan', 'Buffer Overflow'
        ],
        
        severityLevels: ['critical', 'high', 'medium', 'low', 'info'],
        
        sources: [
            'Firewall-01', 'IDS-Primary', 'WAF-Gateway', 'SIEM-Core',
            'EDR-Agent', 'NDR-Sensor', 'Honeypot-03', 'Proxy-Main'
        ],
        
        events: [
            'Unauthorized access attempt detected',
            'Suspicious file execution blocked',
            'Malicious IP address blacklisted',
            'Anomalous network traffic pattern',
            'Failed authentication attempt',
            'Privilege escalation attempt',
            'Data exfiltration attempt blocked',
            'Malware signature detected',
            'Port scan activity detected',
            'Brute force attack mitigated',
            'Phishing email quarantined',
            'Zero-day vulnerability alert',
            'Suspicious DNS query detected',
            'Lateral movement detected',
            'Command and control communication blocked'
        ],
        
        campaigns: [
            { name: 'Operation Dark Storm', status: 'active', targets: 234 },
            { name: 'Project Shadow Net', status: 'monitoring', targets: 89 },
            { name: 'Initiative Crimson', status: 'active', targets: 567 },
            { name: 'Operation Silent Dagger', status: 'critical', targets: 1203 }
        ],
        
        threatActors: [
            { handle: 'PHANTOM_CORP', group: 'APT29', level: 'extreme' },
            { handle: 'SHADOW_BROKER', group: 'Unknown', level: 'high' },
            { handle: 'DARK_VORTEX', group: 'Lazarus', level: 'extreme' },
            { handle: 'CIPHER_WRAITH', group: 'APT41', level: 'high' },
            { handle: 'GHOST_PROTOCOL', group: 'FIN7', level: 'moderate' },
            { handle: 'VOID_WALKER', group: 'MuddyWater', level: 'high' }
        ],
        
        iocTypes: ['IP', 'Domain', 'Hash', 'URL', 'Email'],
        
        vulnFeed: [
            { id: 'CVE-2024-0001', severity: 'critical', desc: 'Remote Code Execution' },
            { id: 'CVE-2024-0042', severity: 'high', desc: 'Privilege Escalation' },
            { id: 'CVE-2024-0103', severity: 'medium', desc: 'Information Disclosure' },
            { id: 'CVE-2024-0256', severity: 'critical', desc: 'SQL Injection' }
        ],
        
        darkWebItems: [
            'Credential dump detected (12,450 records)',
            'Database for sale - healthcare sector',
            'Ransomware-as-a-Service offering',
            'Exploit kit updated (0-day included)',
            'Access broker advertising network access'
        ],
        
        encryptedMessages: [
            'THREAT ACTOR COMPROMISED VPN CREDENTIALS - IMMEDIATE ACTION REQUIRED',
            'NEW CAMPAIGN TARGETING FINANCIAL SECTOR DETECTED IN WILD',
            'ZERO-DAY EXPLOIT BEING SOLD ON DARK WEB MARKETPLACE',
            'SUPPLY CHAIN ATTACK CONFIRMED - VERIFY ALL DEPENDENCIES',
            'INSIDER THREAT DETECTED - MONITOR USER ACTIVITY LOGS'
        ]
    };

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    const State = {
        currentSection: 'dashboard',
        stats: {
            activeThreats: 0,
            blockedAttacks: 0,
            vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
            integrity: 100
        },
        network: {
            nodesOnline: 0,
            totalNodes: 24,
            bandwidth: 0,
            latency: 0,
            packets: 0
        },
        auditLog: [],
        threatOrigins: new Set(),
        threatTargets: new Set(),
        uptime: 0,
        isDecrypting: false
    };

    // ============================================
    // DOM ELEMENTS CACHE
    // ============================================

    const DOM = {
        // Time displays
        systemTime: document.getElementById('system-time'),
        uptime: document.getElementById('uptime'),
        lastUpdate: document.getElementById('last-update'),
        
        // Navigation
        navLinks: document.querySelectorAll('.nav-link'),
        sections: document.querySelectorAll('.content-section'),
        
        // Dashboard
        activeThreats: document.getElementById('active-threats'),
        blockedAttacks: document.getElementById('blocked-attacks'),
        vulnCount: document.getElementById('vuln-count'),
        integrity: document.getElementById('integrity'),
        threatBar: document.getElementById('threat-bar'),
        integrityBar: document.getElementById('integrity-bar'),
        attackTrend: document.getElementById('attack-trend'),
        vulnCritical: document.getElementById('vuln-critical'),
        vulnHigh: document.getElementById('vuln-high'),
        vulnMedium: document.getElementById('vuln-medium'),
        vulnLow: document.getElementById('vuln-low'),
        activityFeed: document.getElementById('activity-feed'),
        alertMessage: document.getElementById('alert-message'),
        alertTimestamp: document.getElementById('alert-timestamp'),
        threatLevel: document.getElementById('threat-level'),
        
        // Threats
        threatOrigins: document.getElementById('threat-origins'),
        threatTargets: document.getElementById('threat-targets'),
        attackLog: document.getElementById('attack-log'),
        ddosCount: document.getElementById('ddos-count'),
        malwareCount: document.getElementById('malware-count'),
        intrusionCount: document.getElementById('intrusion-count'),
        exfilCount: document.getElementById('exfil-count'),
        ddosGraph: document.getElementById('ddos-graph'),
        malwareGraph: document.getElementById('malware-graph'),
        intrusionGraph: document.getElementById('intrusion-graph'),
        exfilGraph: document.getElementById('exfil-graph'),
        threatCanvas: document.getElementById('threat-canvas'),
        
        // Network
        nodesOnline: document.getElementById('nodes-online'),
        bandwidth: document.getElementById('bandwidth'),
        latency: document.getElementById('latency'),
        packets: document.getElementById('packets'),
        networkSvg: document.getElementById('network-svg'),
        
        // Audit
        auditLog: document.getElementById('audit-log'),
        auditSearch: document.getElementById('audit-search'),
        totalEvents: document.getElementById('total-events'),
        criticalCount: document.getElementById('critical-count'),
        warningCount: document.getElementById('warning-count'),
        resolvedCount: document.getElementById('resolved-count'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        
        // Intel
        encryptedMessage: document.getElementById('encrypted-message'),
        decryptBtn: document.getElementById('decrypt-btn'),
        decryptedMessage: document.getElementById('decrypted-message'),
        activeCampaigns: document.getElementById('active-campaigns'),
        iocDatabase: document.getElementById('ioc-database'),
        vulnFeed: document.getElementById('vuln-feed'),
        darkWeb: document.getElementById('dark-web'),
        actorsGrid: document.getElementById('actors-grid'),
        
        // Modal
        modalOverlay: document.getElementById('modal-overlay'),
        modalTitle: document.getElementById('modal-title'),
        modalBody: document.getElementById('modal-body'),
        modalClose: document.getElementById('modal-close'),
        
        // Commands
        cmdBtns: document.querySelectorAll('.cmd-btn')
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        updateSystemTime();
        initNavigation();
        initDashboard();
        initThreatMap();
        initNetworkTopology();
        initAuditLog();
        initIntelSection();
        initCommands();
        initModal();
        
        // Start intervals
        setInterval(updateSystemTime, 1000);
        setInterval(updateUptime, 1000);
        setInterval(updateStats, 3000);
        setInterval(addActivityFeedItem, 2500);
        setInterval(updateNetworkStats, 2000);
        setInterval(updateThreatLevel, 5000);
        
        // Initial updates
        updateAllStats();
        generateInitialFeed();
        renderThreatCategories();
        renderIntelCards();
        renderThreatActors();
        
        console.log('CYBER::SECURITY COMMAND CENTER initialized');
    }

    // ============================================
    // SYSTEM TIME & UPTIME
    // ============================================

    function updateSystemTime() {
        const now = new Date();
        DOM.systemTime.textContent = Utils.formatTime(now);
        DOM.lastUpdate.textContent = Utils.formatTime(now);
    }

    function updateUptime() {
        State.uptime++;
        const hours = Utils.padZero(Math.floor(State.uptime / 3600));
        const minutes = Utils.padZero(Math.floor((State.uptime % 3600) / 60));
        const seconds = Utils.padZero(State.uptime % 60);
        DOM.uptime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // ============================================
    // NAVIGATION
    // ============================================

    function initNavigation() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                switchSection(section);
            });
        });
    }

    function switchSection(sectionId) {
        State.currentSection = sectionId;
        
        DOM.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        
        DOM.sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });
        
        // Trigger section-specific updates
        if (sectionId === 'network') {
            animateNetworkConnections();
        }
    }

    // ============================================
    // DASHBOARD
    // ============================================

    function initDashboard() {
        // Initial threat message
        updateAlertBanner();
        setInterval(updateAlertBanner, 8000);
    }

    function updateAlertBanner() {
        const messages = [
            'Multiple brute force attempts detected from 185.220.101.x',
            'Suspicious outbound traffic to known C2 server',
            'New malware variant detected in email attachments',
            'Unauthorized privilege escalation attempt blocked',
            'DDoS mitigation activated - 50Gbps incoming'
        ];
        DOM.alertMessage.textContent = Utils.randomChoice(messages);
        DOM.alertTimestamp.textContent = `${Utils.formatDate(new Date())} ${Utils.formatTime(new Date())}`;
    }

    function updateStats() {
        // Simulate fluctuating stats
        State.stats.activeThreats = Utils.randomInt(12, 45);
        State.stats.blockedAttacks += Utils.randomInt(1, 5);
        State.stats.integrity = Utils.randomInt(95, 100);
        
        State.stats.vulnerabilities.critical = Utils.randomInt(2, 8);
        State.stats.vulnerabilities.high = Utils.randomInt(10, 25);
        State.stats.vulnerabilities.medium = Utils.randomInt(20, 50);
        State.stats.vulnerabilities.low = Utils.randomInt(40, 80);
        
        updateAllStats();
    }

    function updateAllStats() {
        DOM.activeThreats.textContent = State.stats.activeThreats;
        DOM.blockedAttacks.textContent = State.stats.blockedAttacks.toLocaleString();
        DOM.integrity.textContent = State.stats.integrity + '%';
        
        const totalVulns = Object.values(State.stats.vulnerabilities).reduce((a, b) => a + b, 0);
        DOM.vulnCount.textContent = totalVulns;
        
        DOM.vulnCritical.textContent = `C:${State.stats.vulnerabilities.critical}`;
        DOM.vulnHigh.textContent = `H:${State.stats.vulnerabilities.high}`;
        DOM.vulnMedium.textContent = `M:${State.stats.vulnerabilities.medium}`;
        DOM.vulnLow.textContent = `L:${State.stats.vulnerabilities.low}`;
        
        // Update bars
        DOM.threatBar.style.width = Math.min(State.stats.activeThreats * 2, 100) + '%';
        DOM.integrityBar.style.width = State.stats.integrity + '%';
        
        // Attack trend
        const trend = Utils.randomInt(-15, 35);
        DOM.attackTrend.textContent = (trend >= 0 ? '+' : '') + trend + '%';
    }

    function updateThreatLevel() {
        const levels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
        const levelClasses = ['threat-moderate', 'threat-moderate', 'threat-high', 'threat-critical'];
        const index = Utils.randomInt(0, 3);
        
        DOM.threatLevel.textContent = levels[index];
        DOM.threatLevel.className = 'status-value ' + levelClasses[index];
    }

    // ============================================
    // ACTIVITY FEED
    // ============================================

    function generateInitialFeed() {
        for (let i = 0; i < 10; i++) {
            addActivityFeedItem(true);
        }
    }

    function addActivityFeedItem(initial = false) {
        const type = Utils.randomChoice(['critical', 'warning', 'info']);
        const actions = {
            critical: [
                'Critical vulnerability exploited',
                'Data breach attempt detected',
                'Ransomware signature found',
                'Zero-day attack blocked'
            ],
            warning: [
                'Multiple failed login attempts',
                'Unusual traffic pattern detected',
                'Suspicious file download blocked',
                'Port scan activity detected'
            ],
            info: [
                'Security scan completed',
                'Signature database updated',
                'New device connected to network',
                'Backup completed successfully'
            ]
        };
        
        const message = Utils.randomChoice(actions[type]);
        const time = Utils.formatTime(new Date());
        
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <span class="feed-timestamp">[${time}]</span>
            <span class="feed-type ${type}">${type.toUpperCase()}</span>
            <span class="feed-message">${message}</span>
        `;
        
        DOM.activityFeed.insertBefore(feedItem, DOM.activityFeed.firstChild);
        
        // Keep only last 50 items
        while (DOM.activityFeed.children.length > 50) {
            DOM.activityFeed.removeChild(DOM.activityFeed.lastChild);
        }
        
        if (!initial) {
            feedItem.style.animation = 'slideIn 0.3s ease';
        }
    }

    // ============================================
    // COMMANDS
    // ============================================

    function initCommands() {
        DOM.cmdBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.dataset.cmd;
                executeCommand(cmd);
            });
        });
    }

    function executeCommand(cmd) {
        const responses = {
            scan: 'Initiating full system scan... Estimated time: 45 minutes',
            firewall: 'Firewall Status: ACTIVE | Rules: 1,247 | Blocked Today: 12,453',
            update: 'Updating threat signatures... Latest: 2024.01.15-001',
            isolate: 'Select node to isolate from network topology view'
        };
        
        addActivityFeedItem();
        const feedItems = DOM.activityFeed.children;
        if (feedItems.length > 0) {
            feedItems[0].querySelector('.feed-message').textContent = responses[cmd] || 'Command executed';
        }
    }

    // ============================================
    // THREAT MAP
    // ============================================

    function initThreatMap() {
        const canvas = DOM.threatCanvas;
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            drawThreatMap();
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Animate threat lines
        setInterval(drawThreatMap, 100);
    }

    let threatLines = [];
    let threatAnimationOffset = 0;

    function drawThreatMap() {
        const canvas = DOM.threatCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#1a3d1a';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Generate new threat lines
        if (Math.random() > 0.95 && threatLines.length < 8) {
            const origin = {
                x: Utils.randomInt(50, width - 50),
                y: Utils.randomInt(50, height - 50)
            };
            const target = {
                x: Utils.randomInt(50, width - 50),
                y: Utils.randomInt(50, height - 50)
            };
            threatLines.push({
                origin,
                target,
                progress: 0,
                speed: Utils.randomFloat(0.01, 0.03),
                color: Utils.randomChoice(['#39ff14', '#ff0040', '#ff6600', '#00ffff'])
            });
            
            State.threatOrigins.add(Utils.randomChoice(DataSources.countries));
            State.threatTargets.add(Utils.randomChoice(DataSources.countries));
            DOM.threatOrigins.textContent = State.threatOrigins.size;
            DOM.threatTargets.textContent = State.threatTargets.size;
        }
        
        // Draw and update threat lines
        threatLines = threatLines.filter(line => {
            line.progress += line.speed;
            
            // Draw origin point
            ctx.beginPath();
            ctx.arc(line.origin.x, line.origin.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = line.color;
            ctx.fill();
            
            // Draw target point
            ctx.beginPath();
            ctx.arc(line.target.x, line.target.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw animated line
            const currentX = line.origin.x + (line.target.x - line.origin.x) * Math.min(line.progress, 1);
            const currentY = line.origin.y + (line.target.y - line.origin.y) * Math.min(line.progress, 1);
            
            ctx.beginPath();
            ctx.moveTo(line.origin.x, line.origin.y);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = 2;
            ctx.shadowColor = line.color;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Draw traveling particle
            if (line.progress < 1) {
                ctx.beginPath();
                ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = line.color;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            return line.progress < 1.5;
        });
        
        threatAnimationOffset += 0.02;
    }

    function renderThreatCategories() {
        const categories = [
            { graph: DOM.ddosGraph, count: DOM.ddosCount, base: 234 },
            { graph: DOM.malwareGraph, count: DOM.malwareCount, base: 567 },
            { graph: DOM.intrusionGraph, count: DOM.intrusionCount, base: 1234 },
            { graph: DOM.exfilGraph, count: DOM.exfilCount, base: 89 }
        ];
        
        categories.forEach(cat => {
            cat.count.textContent = cat.base;
            renderGraph(cat.graph, 20);
        });
        
        // Animate counts
        setInterval(() => {
            categories.forEach(cat => {
                const change = Utils.randomInt(-10, 20);
                cat.base = Math.max(0, cat.base + change);
                cat.count.textContent = cat.base.toLocaleString();
            });
        }, 3000);
    }

    function renderGraph(container, bars) {
        container.innerHTML = '';
        for (let i = 0; i < bars; i++) {
            const bar = document.createElement('div');
            bar.className = 'graph-bar';
            bar.style.height = Utils.randomInt(20, 100) + '%';
            bar.style.animationDelay = (i * 0.05) + 's';
            container.appendChild(bar);
        }
        
        // Animate bars
        setInterval(() => {
            container.querySelectorAll('.graph-bar').forEach(bar => {
                bar.style.height = Utils.randomInt(20, 100) + '%';
            });
        }, 2000);
    }

    // Add attack log entries
    function addAttackLogEntry() {
        const attack = Utils.randomChoice(DataSources.attackTypes);
        const source = Utils.randomInt(1, 255) + '.' + Utils.randomInt(1, 255) + '.' + Utils.randomInt(1, 255) + '.' + Utils.randomInt(1, 255);
        const severity = Utils.randomChoice(['critical', 'high', 'medium', 'low']);
        const country = Utils.randomChoice(DataSources.countries);
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${severity}`;
        entry.innerHTML = `
            <div class="log-time">${Utils.formatTime(new Date())} | ${country}</div>
            <div class="log-attack">${attack}</div>
            <div class="log-source">SRC: ${source}</div>
        `;
        
        DOM.attackLog.insertBefore(entry, DOM.attackLog.firstChild);
        
        while (DOM.attackLog.children.length > 20) {
            DOM.attackLog.removeChild(DOM.attackLog.lastChild);
        }
    }

    // Start attack log updates
    setInterval(addAttackLogEntry, 2000);
    for (let i = 0; i < 5; i++) addAttackLogEntry();

    // ============================================
    // NETWORK TOPOLOGY
    // ============================================

    const networkNodes = [
        { id: 'firewall', x: 100, y: 200, type: 'firewall', label: 'FW-01', status: 'online' },
        { id: 'router', x: 200, y: 200, type: 'router', label: 'RTR-01', status: 'online' },
        { id: 'switch1', x: 320, y: 120, type: 'switch', label: 'SW-01', status: 'online' },
        { id: 'switch2', x: 320, y: 280, type: 'switch', label: 'SW-02', status: 'online' },
        { id: 'server1', x: 450, y: 80, type: 'server', label: 'SRV-WEB', status: 'online' },
        { id: 'server2', x: 450, y: 160, type: 'server', label: 'SRV-DB', status: 'online' },
        { id: 'server3', x: 450, y: 240, type: 'server', label: 'SRV-APP', status: 'warning' },
        { id: 'server4', x: 450, y: 320, type: 'server', label: 'SRV-FILE', status: 'online' },
        { id: 'workstation1', x: 600, y: 100, type: 'workstation', label: 'WS-01', status: 'online' },
        { id: 'workstation2', x: 600, y: 180, type: 'workstation', label: 'WS-02', status: 'online' },
        { id: 'workstation3', x: 600, y: 260, type: 'workstation', label: 'WS-03', status: 'offline' },
        { id: 'workstation4', x: 600, y: 340, type: 'workstation', label: 'WS-04', status: 'online' }
    ];

    const networkConnections = [
        { from: 'firewall', to: 'router' },
        { from: 'router', to: 'switch1' },
        { from: 'router', to: 'switch2' },
        { from: 'switch1', to: 'server1' },
        { from: 'switch1', to: 'server2' },
        { from: 'switch2', to: 'server3' },
        { from: 'switch2', to: 'server4' },
        { from: 'server1', to: 'workstation1' },
        { from: 'server2', to: 'workstation2' },
        { from: 'server3', to: 'workstation3' },
        { from: 'server4', to: 'workstation4' }
    ];

    function initNetworkTopology() {
        renderNetworkDiagram();
        updateNetworkStats();
    }

    function renderNetworkDiagram() {
        const svg = DOM.networkSvg;
        svg.innerHTML = '';
        
        // Define markers for arrows
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#39ff14" />
            </marker>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        `;
        svg.appendChild(defs);
        
        // Draw connections
        networkConnections.forEach(conn => {
            const fromNode = networkNodes.find(n => n.id === conn.from);
            const toNode = networkNodes.find(n => n.id === conn.to);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromNode.x);
            line.setAttribute('y1', fromNode.y);
            line.setAttribute('x2', toNode.x);
            line.setAttribute('y2', toNode.y);
            line.setAttribute('class', 'network-link');
            line.setAttribute('data-from', conn.from);
            line.setAttribute('data-to', conn.to);
            svg.appendChild(line);
        });
        
        // Draw nodes
        networkNodes.forEach(node => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'network-node');
            g.setAttribute('data-id', node.id);
            g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            
            let icon = '';
            let color = '#39ff14';
            
            if (node.status === 'warning') color = '#ffcc00';
            if (node.status === 'offline') color = '#ff0040';
            
            switch(node.type) {
                case 'firewall':
                    icon = `<rect x="-15" y="-12" width="30" height="24" fill="none" stroke="${color}" stroke-width="2"/>
                            <line x1="-10" y1="0" x2="10" y2="0" stroke="${color}" stroke-width="2"/>
                            <circle cx="0" cy="0" r="3" fill="${color}"/>`;
                    break;
                case 'router':
                    icon = `<circle cx="0" cy="0" r="12" fill="none" stroke="${color}" stroke-width="2"/>
                            <line x1="-8" y1="0" x2="8" y2="0" stroke="${color}" stroke-width="2"/>
                            <line x1="0" y1="-8" x2="0" y2="8" stroke="${color}" stroke-width="2"/>`;
                    break;
                case 'switch':
                    icon = `<rect x="-12" y="-10" width="24" height="20" fill="none" stroke="${color}" stroke-width="2"/>
                            <line x1="-8" y1="-4" x2="8" y2="-4" stroke="${color}" stroke-width="1"/>
                            <line x1="-8" y1="0" x2="8" y2="0" stroke="${color}" stroke-width="1"/>
                            <line x1="-8" y1="4" x2="8" y2="4" stroke="${color}" stroke-width="1"/>`;
                    break;
                case 'server':
                    icon = `<rect x="-10" y="-15" width="20" height="30" fill="none" stroke="${color}" stroke-width="2"/>
                            <line x1="-6" y1="-8" x2="6" y2="-8" stroke="${color}" stroke-width="1"/>
                            <line x1="-6" y1="-2" x2="6" y2="-2" stroke="${color}" stroke-width="1"/>
                            <line x1="-6" y1="4" x2="6" y2="4" stroke="${color}" stroke-width="1"/>
                            <circle cx="0" cy="10" r="2" fill="${color}"/>`;
                    break;
                case 'workstation':
                    icon = `<rect x="-8" y="-10" width="16" height="12" fill="none" stroke="${color}" stroke-width="2"/>
                            <rect x="-10" y="12" width="20" height="4" fill="none" stroke="${color}" stroke-width="1"/>`;
                    break;
            }
            
            g.innerHTML = `
                ${icon}
                <text x="0" y="30" text-anchor="middle" fill="${color}" font-family="'Share Tech Mono', monospace" font-size="10">${node.label}</text>
            `;
            
            g.addEventListener('click', () => showNodeDetails(node));
            
            svg.appendChild(g);
        });
    }

    function animateNetworkConnections() {
        const links = DOM.networkSvg.querySelectorAll('.network-link');
        links.forEach((link, i) => {
            setTimeout(() => {
                link.classList.add('active');
                setTimeout(() => link.classList.remove('active'), 500);
            }, i * 100);
        });
    }

    function showNodeDetails(node) {
        DOM.modalTitle.textContent = `NODE: ${node.label}`;
        DOM.modalBody.innerHTML = `
            <div class="info-row"><span class="info-label">ID:</span><span class="info-value">${node.id}</span></div>
            <div class="info-row"><span class="info-label">Type:</span><span class="info-value">${node.type.toUpperCase()}</span></div>
            <div class="info-row"><span class="info-label">Status:</span><span class="info-value" style="color: ${node.status === 'online' ? '#39ff14' : node.status === 'warning' ? '#ffcc00' : '#ff0040'}">${node.status.toUpperCase()}</span></div>
            <div class="info-row"><span class="info-label">IP Address:</span><span class="info-value">192.168.1.${Utils.randomInt(10, 250)}</span></div>
            <div class="info-row"><span class="info-label">MAC Address:</span><span class="info-value">${Array(6).fill(0).map(() => Utils.randomInt(0, 255).toString(16).padStart(2, '0')).join(':')}</span></div>
            <div class="info-row"><span class="info-label">Uptime:</span><span class="info-value">${Utils.randomInt(1, 365)} days</span></div>
        `;
        DOM.modalOverlay.classList.add('active');
    }

    function updateNetworkStats() {
        State.network.nodesOnline = Utils.randomInt(20, 24);
        State.network.bandwidth = Utils.randomInt(100, 950);
        State.network.latency = Utils.randomInt(5, 45);
        State.network.packets = Utils.randomInt(10000, 99999);
        
        DOM.nodesOnline.textContent = `${State.network.nodesOnline}/${State.network.totalNodes}`;
        DOM.bandwidth.textContent = State.network.bandwidth + ' Mbps';
        DOM.latency.textContent = State.network.latency + ' ms';
        DOM.packets.textContent = State.network.packets.toLocaleString();
    }

    // ============================================
    // AUDIT LOG
    // ============================================

    function initAuditLog() {
        // Generate initial log entries
        for (let i = 0; i < 15; i++) {
            addAuditLogEntry(true);
        }
        
        // Filter buttons
        DOM.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterAuditLog(btn.dataset.filter);
            });
        });
        
        // Search
        DOM.auditSearch.addEventListener('input', Utils.debounce(filterAuditLogBySearch, 300));
    }

    function addAuditLogEntry(initial = false) {
        const severity = Utils.randomChoice(DataSources.severityLevels);
        const source = Utils.randomChoice(DataSources.sources);
        const event = Utils.randomChoice(DataSources.events);
        const status = Utils.randomChoice(['resolved', 'investigating', 'pending']);
        const timestamp = new Date(Date.now() - Utils.randomInt(0, 86400000));
        
        const entry = {
            id: Utils.generateId(),
            timestamp: timestamp,
            severity,
            source,
            event,
            status
        };
        
        State.auditLog.unshift(entry);
        
        if (!initial) {
            renderAuditLog();
            updateAuditSummary();
        }
    }

    function renderAuditLog(filter = 'all', search = '') {
        DOM.auditLog.innerHTML = '';
        
        const filtered = State.auditLog.filter(entry => {
            if (filter !== 'all' && entry.severity !== filter) return false;
            if (search && !entry.event.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
        
        filtered.slice(0, 50).forEach(entry => {
            const row = document.createElement('div');
            row.className = 'log-entry-row';
            row.innerHTML = `
                <span class="col-timestamp">${Utils.formatDate(entry.timestamp)} ${Utils.formatTime(entry.timestamp)}</span>
                <span class="col-severity severity-${entry.severity}">${entry.severity.toUpperCase()}</span>
                <span class="col-source">${entry.source}</span>
                <span class="col-event">${entry.event}</span>
                <span class="col-status"><span class="status-${entry.status}">${entry.status.toUpperCase()}</span></span>
            `;
            DOM.auditLog.appendChild(row);
        });
        
        DOM.totalEvents.textContent = State.auditLog.length;
    }

    function filterAuditLog(filter) {
        renderAuditLog(filter, DOM.auditSearch.value);
    }

    function filterAuditLogBySearch() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderAuditLog(activeFilter, DOM.auditSearch.value);
    }

    function updateAuditSummary() {
        const critical = State.auditLog.filter(e => e.severity === 'critical').length;
        const warning = State.auditLog.filter(e => e.severity === 'warning' || e.severity === 'high').length;
        const resolved = State.auditLog.filter(e => e.status === 'resolved').length;
        
        DOM.criticalCount.textContent = critical;
        DOM.warningCount.textContent = warning;
        DOM.resolvedCount.textContent = resolved;
    }

    // Add new audit entries periodically
    setInterval(() => addAuditLogEntry(), 5000);

    // ============================================
    // INTEL SECTION
    // ============================================

    function initIntelSection() {
        // Decrypt button
        DOM.decryptBtn.addEventListener('click', decryptMessage);
    }

    function decryptMessage() {
        if (State.isDecrypting) return;
        State.isDecrypting = true;
        
        const originalText = DOM.encryptedMessage.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        const targetMessage = Utils.randomChoice(DataSources.encryptedMessages);
        
        let iterations = 0;
        const maxIterations = 30;
        
        const interval = setInterval(() => {
            DOM.encryptedMessage.textContent = originalText.split('').map((char, index) => {
                if (char === ' ' || char === ':') return char;
                if (index < iterations) return targetMessage[index] || char;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            
            iterations++;
            
            if (iterations > maxIterations) {
                clearInterval(interval);
                DOM.decryptedMessage.textContent = targetMessage;
                DOM.decryptedMessage.classList.add('visible');
                State.isDecrypting = false;
                
                // Reset after 10 seconds
                setTimeout(() => {
                    DOM.decryptedMessage.classList.remove('visible');
                    DOM.encryptedMessage.textContent = 'ENCRYPTED: ' + Utils.generateId();
                }, 10000);
            }
        }, 50);
    }

    function renderIntelCards() {
        // Active Campaigns
        DOM.activeCampaigns.innerHTML = DataSources.campaigns.map(c => `
            <div class="intel-item">
                <div class="intel-item-title">${c.name}</div>
                <div class="intel-item-detail">Targets: ${c.targets.toLocaleString()}</div>
                <span class="intel-item-tag tag-${c.status === 'active' ? 'active' : c.status === 'critical' ? 'critical' : 'monitoring'}">${c.status.toUpperCase()}</span>
            </div>
        `).join('');
        
        // IOC Database
        DOM.iocDatabase.innerHTML = Array(5).fill(0).map(() => {
            const type = Utils.randomChoice(DataSources.iocTypes);
            let value = '';
            switch(type) {
                case 'IP': value = `${Utils.randomInt(1,255)}.${Utils.randomInt(1,255)}.${Utils.randomInt(1,255)}.${Utils.randomInt(1,255)}`; break;
                case 'Domain': value = `${Utils.randomChoice(['evil','malicious','phish','hack'])}.${Utils.randomChoice(['com','net','org','xyz'])}`; break;
                case 'Hash': value = Array(32).fill(0).map(() => Math.random().toString(36)[2]).join(''); break;
                case 'URL': value = `https://${Utils.randomChoice(['bad','evil','mal'])}.com/${Utils.randomChoice(['steal','exploit','payload'])}`; break;
                case 'Email': value = `${Utils.randomChoice(['admin','support','security'])}@${Utils.randomChoice(['evil','phish'])}.com`; break;
            }
            return `
                <div class="intel-item">
                    <div class="intel-item-title">${type}: ${value}</div>
                    <div class="intel-item-detail">Added: ${Utils.formatTime(new Date())}</div>
                    <span class="intel-item-tag tag-critical">ACTIVE</span>
                </div>
            `;
        }).join('');
        
        // Vulnerability Feed
        DOM.vulnFeed.innerHTML = DataSources.vulnFeed.map(v => `
            <div class="intel-item">
                <div class="intel-item-title">${v.id}</div>
                <div class="intel-item-detail">${v.desc}</div>
                <span class="intel-item-tag tag-${v.severity === 'critical' ? 'critical' : v.severity === 'high' ? 'monitoring' : 'active'}">${v.severity.toUpperCase()}</span>
            </div>
        `).join('');
        
        // Dark Web Monitor
        DOM.darkWeb.innerHTML = DataSources.darkWebItems.map(item => `
            <div class="intel-item">
                <div class="intel-item-title">${item}</div>
                <div class="intel-item-detail">Detected: ${Utils.formatTime(new Date())}</div>
            </div>
        `).join('');
    }

    function renderThreatActors() {
        DOM.actorsGrid.innerHTML = DataSources.threatActors.map(actor => `
            <div class="actor-card">
                <div class="actor-handle">${actor.handle}</div>
                <div class="actor-group">${actor.group}</div>
                <span class="actor-threat-level threat-${actor.level}">${actor.level.toUpperCase()}</span>
                <div class="actor-last-seen">Last seen: ${Utils.randomInt(1, 24)} hours ago</div>
            </div>
        `).join('');
    }

    // ============================================
    // MODAL
    // ============================================

    function initModal() {
        DOM.modalClose.addEventListener('click', () => {
            DOM.modalOverlay.classList.remove('active');
        });
        
        DOM.modalOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) {
                DOM.modalOverlay.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                DOM.modalOverlay.classList.remove('active');
            }
        });
    }

    // ============================================
    // INITIALIZE ON DOM READY
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
/* ============================================
   CYPHERCORE // Security Intelligence Platform
   Interactive JavaScript Engine
   ============================================ */

// ============================================
// BOOT SEQUENCE
// ============================================
const bootSequence = async () => {
    const bootOverlay = document.getElementById('boot-overlay');
    const bootText = document.getElementById('boot-text');
    const progressBar = document.querySelector('.boot-progress-bar');
    const bootStatus = document.querySelector('.boot-status');

    const bootMessages = [
        { text: 'BIOS v3.21 - CYPHERCORE SYSTEMS INC.', delay: 50 },
        { text: 'Detecting hardware...', delay: 100 },
        { text: 'CPU: QUANTUM-X 96 CORE @ 5.2GHz [OK]', delay: 80 },
        { text: 'RAM: 256GB DDR6-ECC @ 6400MHz [OK]', delay: 80 },
        { text: 'Storage: 8TB NVMe RAID-0 ARRAY [OK]', delay: 80 },
        { text: 'Network: 10GbE FIBER INTERFACE [OK]', delay: 80 },
        { text: '', delay: 100 },
        { text: 'Loading CYPHERCORE Security Kernel...', delay: 150 },
        { text: '[████████████████████████████████] 100%', delay: 100 },
        { text: '', delay: 50 },
        { text: 'Initializing threat detection modules...', delay: 100 },
        { text: '  -> Neural Threat Engine v4.2.0 [LOADED]', delay: 60 },
        { text: '  -> Packet Analysis Matrix [LOADED]', delay: 60 },
        { text: '  -> Vulnerability Scanner [LOADED]', delay: 60 },
        { text: '  -> Encryption Subsystem [LOADED]', delay: 60 },
        { text: '  -> Audit Logger [LOADED]', delay: 60 },
        { text: '', delay: 50 },
        { text: 'Establishing secure connection...', delay: 100 },
        { text: 'TLS 1.3 handshake complete.', delay: 80 },
        { text: 'Session encrypted with AES-256-GCM.', delay: 80 },
        { text: '', delay: 50 },
        { text: 'CYPHERCORE READY. WELCOME, OPERATOR.', delay: 100 },
    ];

    let progress = 0;
    const progressIncrement = 100 / bootMessages.length;

    for (const message of bootMessages) {
        await typeText(bootText, message.text + '\n', message.delay / 2);
        progress += progressIncrement;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress > 30 && progress < 60) {
            bootStatus.textContent = 'LOADING MODULES...';
        } else if (progress >= 60 && progress < 90) {
            bootStatus.textContent = 'ESTABLISHING CONNECTION...';
        } else if (progress >= 90) {
            bootStatus.textContent = 'FINALIZING...';
        }
    }

    await sleep(500);
    bootOverlay.classList.add('hidden');
    await sleep(500);
    initializeMainSystems();
};

const typeText = async (element, text, speed = 30) => {
    for (const char of text) {
        element.textContent += char;
        await sleep(speed);
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// MATRIX RAIN
// ============================================
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        this.columns = [];
        this.fontSize = 14;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.initColumns();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initColumns();
    }

    initColumns() {
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        this.columns = Array(columnCount).fill(0).map(() => Math.random() * this.canvas.height / this.fontSize);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#39FF14';
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono', monospace`;

        for (let i = 0; i < this.columns.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.columns[i] * this.fontSize;
            
            this.ctx.fillStyle = Math.random() > 0.98 ? '#00FFFF' : '#39FF14';
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.columns[i] = 0;
            }
            this.columns[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SYSTEM CLOCK
// ============================================
const updateClock = () => {
    const clockElement = document.getElementById('system-clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
};

// ============================================
// TYPING ANIMATION FOR TAGLINE
// ============================================
const taglineTexts = [
    'Advanced Persistent Threat Detection',
    'Zero-Day Vulnerability Research',
    'Network Intrusion Analysis',
    'Malware Reverse Engineering',
    'Digital Forensics & Incident Response',
    'Red Team Operations',
];

let currentTaglineIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

const animateTagline = () => {
    const taglineElement = document.getElementById('tagline-text');
    const currentText = taglineTexts[currentTaglineIndex];
    
    if (!isDeleting) {
        taglineElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentText.length) {
            isDeleting = true;
            setTimeout(animateTagline, 2000);
            return;
        }
    } else {
        taglineElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentTaglineIndex = (currentTaglineIndex + 1) % taglineTexts.length;
        }
    }
    
    const speed = isDeleting ? 30 : 80;
    setTimeout(animateTagline, speed);
};

// ============================================
// COUNTER ANIMATION
// ============================================
const animateCounter = (element, target, duration = 2000, suffix = '') => {
    const start = 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    
    requestAnimationFrame(update);
};

// ============================================
// THREAT FEED
// ============================================
const threatTypes = [
    { type: 'RANSOMWARE', severity: 'critical', desc: 'Ransomware payload detected in network traffic' },
    { type: 'DDoS', severity: 'high', desc: 'Distributed denial of service attack in progress' },
    { type: 'SQL_INJECT', severity: 'high', desc: 'SQL injection attempt blocked on /api/users' },
    { type: 'XSS', severity: 'medium', desc: 'Cross-site scripting attempt filtered' },
    { type: 'BRUTE_FORCE', severity: 'medium', desc: 'Brute force login attempt detected' },
    { type: 'PORT_SCAN', severity: 'low', desc: 'Port scanning activity from external IP' },
    { type: 'MALWARE', severity: 'critical', desc: 'Malicious executable quarantined' },
    { type: 'PHISHING', severity: 'high', desc: 'Phishing email intercepted and blocked' },
    { type: 'DATA_EXFIL', severity: 'critical', desc: 'Unauthorized data exfiltration attempt' },
    { type: 'C2_BEACON', severity: 'critical', desc: 'Command & control beacon detected' },
    { type: 'PRIV_ESC', severity: 'high', desc: 'Privilege escalation attempt blocked' },
    { type: 'LATERAL', severity: 'high', desc: 'Lateral movement detected in subnet' },
];

const sources = [
    '192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12',
    'EXTERNAL', 'DMZ', 'VPN_GATEWAY', 'CLOUD_EDGE'
];

const generateThreatEntry = () => {
    const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const now = new Date();
    const time = now.toTimeString().substring(0, 8);
    
    return {
        time,
        severity: threat.severity,
        type: threat.type,
        desc: threat.desc,
        source
    };
};

const addThreatEntry = () => {
    const feed = document.getElementById('threat-feed');
    const entry = generateThreatEntry();
    
    const entryElement = document.createElement('div');
    entryElement.className = `threat-entry ${entry.severity}`;
    entryElement.innerHTML = `
        <span class="threat-time">${entry.time}</span>
        <span class="threat-severity ${entry.severity}">${entry.severity.toUpperCase()}</span>
        <span class="threat-desc">[${entry.type}] ${entry.desc}</span>
        <span class="threat-source">${entry.source}</span>
    `;
    
    feed.insertBefore(entryElement, feed.firstChild);
    
    // Keep only last 50 entries
    while (feed.children.length > 50) {
        feed.removeChild(feed.lastChild);
    }
    
    updateThreatCounts();
};

const updateThreatCounts = () => {
    const entries = document.querySelectorAll('.threat-entry');
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    
    entries.forEach(entry => {
        if (entry.classList.contains('critical')) counts.critical++;
        else if (entry.classList.contains('high')) counts.high++;
        else if (entry.classList.contains('medium')) counts.medium++;
        else if (entry.classList.contains('low')) counts.low++;
    });
    
    document.getElementById('total-threats').textContent = entries.length;
    document.getElementById('critical-count').textContent = counts.critical;
    document.getElementById('high-count').textContent = counts.high;
};

// ============================================
// NETWORK TOPOLOGY
// ============================================
class NetworkTopology {
    constructor(svgElement) {
        this.svg = svgElement;
        this.nodes = [];
        this.links = [];
        this.selectedNode = null;
        this.animationFrame = null;
        this.packets = [];
        
        this.init();
    }

    init() {
        this.createNodes();
        this.createLinks();
        this.render();
        this.startPacketAnimation();
    }

    createNodes() {
        // Core router
        this.nodes.push({
            id: 'core-1',
            type: 'core',
            x: 450,
            y: 250,
            label: 'CORE-RTR-01',
            status: 'online',
            ip: '10.0.0.1',
            traffic: '2.4 Gbps',
            uptime: '312d 14h'
        });

        // Firewalls
        this.nodes.push({
            id: 'fw-1',
            type: 'firewall',
            x: 200,
            y: 150,
            label: 'FW-PRIMARY',
            status: 'online',
            ip: '10.0.0.2',
            traffic: '1.8 Gbps',
            uptime: '180d 6h'
        });

        this.nodes.push({
            id: 'fw-2',
            type: 'firewall',
            x: 700,
            y: 150,
            label: 'FW-SECONDARY',
            status: 'online',
            ip: '10.0.0.3',
            traffic: '1.6 Gbps',
            uptime: '180d 6h'
        });

        // Servers
        const serverPositions = [
            { x: 100, y: 300 }, { x: 200, y: 350 }, { x: 300, y: 400 },
            { x: 600, y: 400 }, { x: 700, y: 350 }, { x: 800, y: 300 }
        ];

        serverPositions.forEach((pos, i) => {
            this.nodes.push({
                id: `srv-${i + 1}`,
                type: 'server',
                x: pos.x,
                y: pos.y,
                label: `SRV-${String(i + 1).padStart(2, '0')}`,
                status: i === 3 ? 'compromised' : 'online',
                ip: `10.1.${Math.floor(i / 3)}.${i + 10}`,
                traffic: `${(Math.random() * 500 + 100).toFixed(0)} Mbps`,
                uptime: `${Math.floor(Math.random() * 200 + 50)}d`
            });
        });

        // Endpoints
        const endpointPositions = [
            { x: 80, y: 180 }, { x: 150, y: 420 }, { x: 350, y: 150 },
            { x: 450, y: 450 }, { x: 550, y: 150 }, { x: 750, y: 420 }, { x: 820, y: 180 }
        ];

        endpointPositions.forEach((pos, i) => {
            this.nodes.push({
                id: `ep-${i + 1}`,
                type: 'endpoint',
                x: pos.x,
                y: pos.y,
                label: `EP-${String(i + 1).padStart(3, '0')}`,
                status: 'online',
                ip: `10.2.${Math.floor(i / 4)}.${i + 20}`,
                traffic: `${(Math.random() * 100 + 10).toFixed(0)} Mbps`,
                uptime: `${Math.floor(Math.random() * 30 + 1)}d`
            });
        });
    }

    createLinks() {
        // Connect firewalls to core
        this.links.push({ source: 'fw-1', target: 'core-1', active: true });
        this.links.push({ source: 'fw-2', target: 'core-1', active: true });

        // Connect servers to core
        this.nodes.filter(n => n.type === 'server').forEach(srv => {
            this.links.push({ source: 'core-1', target: srv.id, active: true });
        });

        // Connect endpoints to nearest server/firewall
        this.nodes.filter(n => n.type === 'endpoint').forEach((ep, i) => {
            const targets = ['fw-1', 'fw-2', 'srv-1', 'srv-6'];
            this.links.push({ 
                source: ep.id, 
                target: targets[i % targets.length], 
                active: true 
            });
        });

        // Add threat link
        this.links.push({ source: 'srv-4', target: 'core-1', active: true, threat: true });
    }

    getNodeColor(type, status) {
        if (status === 'compromised') return '#FF0040';
        
        switch(type) {
            case 'core': return '#39FF14';
            case 'server': return '#00FFFF';
            case 'endpoint': return '#FFB000';
            case 'firewall': return '#BF00FF';
            default: return '#39FF14';
        }
    }

    render() {
        let svgContent = `
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="glow-strong">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        `;

        // Render links
        this.links.forEach(link => {
            const sourceNode = this.nodes.find(n => n.id === link.source);
            const targetNode = this.nodes.find(n => n.id === link.target);
            
            if (sourceNode && targetNode) {
                const className = link.threat ? 'network-link threat' : 'network-link';
                svgContent += `
                    <line 
                        class="${className}"
                        x1="${sourceNode.x}" y1="${sourceNode.y}"
                        x2="${targetNode.x}" y2="${targetNode.y}"
                    />
                `;
            }
        });

        // Render nodes
        this.nodes.forEach(node => {
            const color = this.getNodeColor(node.type, node.status);
            const radius = node.type === 'core' ? 20 : node.type === 'server' ? 14 : node.type === 'firewall' ? 16 : 10;
            
            svgContent += `
                <g class="network-node" data-id="${node.id}" transform="translate(${node.x}, ${node.y})">
                    <circle 
                        class="node-circle"
                        r="${radius}"
                        fill="${color}20"
                        stroke="${color}"
                        stroke-width="2"
                        filter="url(#glow)"
                    />
                    ${node.status === 'compromised' ? `
                        <circle r="${radius + 5}" fill="none" stroke="${color}" stroke-width="1" opacity="0.5">
                            <animate attributeName="r" values="${radius + 3};${radius + 10};${radius + 3}" dur="1s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="1s" repeatCount="indefinite"/>
                        </circle>
                    ` : ''}
                    <text class="node-label" y="${radius + 15}" text-anchor="middle">${node.label}</text>
                </g>
            `;
        });

        // Packet container
        svgContent += '<g id="packets"></g>';

        this.svg.innerHTML = svgContent;

        // Add click handlers
        this.svg.querySelectorAll('.network-node').forEach(nodeEl => {
            nodeEl.addEventListener('click', () => {
                const nodeId = nodeEl.dataset.id;
                this.selectNode(nodeId);
            });
        });
    }

    selectNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        const infoPanel = document.getElementById('node-info');
        const statusClass = node.status === 'compromised' ? 'danger' : '';
        
        infoPanel.querySelector('.info-content').innerHTML = `
            <div class="info-row">
                <span class="info-label">HOSTNAME</span>
                <span class="info-value">${node.label}</span>
            </div>
            <div class="info-row">
                <span class="info-label">TYPE</span>
                <span class="info-value">${node.type.toUpperCase()}</span>
            </div>
            <div class="info-row">
                <span class="info-label">IP ADDRESS</span>
                <span class="info-value">${node.ip}</span>
            </div>
            <div class="info-row">
                <span class="info-label">STATUS</span>
                <span class="info-value ${statusClass}">${node.status.toUpperCase()}</span>
            </div>
            <div class="info-row">
                <span class="info-label">TRAFFIC</span>
                <span class="info-value">${node.traffic}</span>
            </div>
            <div class="info-row">
                <span class="info-label">UPTIME</span>
                <span class="info-value">${node.uptime}</span>
            </div>
        `;
    }

    startPacketAnimation() {
        const animate = () => {
            const packetsContainer = this.svg.querySelector('#packets');
            if (!packetsContainer) return;

            // Randomly create new packets
            if (Math.random() > 0.92) {
                const link = this.links[Math.floor(Math.random() * this.links.length)];
                const sourceNode = this.nodes.find(n => n.id === link.source);
                const targetNode = this.nodes.find(n => n.id === link.target);
                
                if (sourceNode && targetNode) {
                    this.packets.push({
                        x: sourceNode.x,
                        y: sourceNode.y,
                        targetX: targetNode.x,
                        targetY: targetNode.y,
                        progress: 0,
                        speed: 0.02 + Math.random() * 0.02,
                        isThreat: link.threat
                    });
                }
            }

            // Update packets
            this.packets = this.packets.filter(packet => {
                packet.progress += packet.speed;
                
                if (packet.progress >= 1) {
                    return false;
                }

                const currentX = packet.x + (packet.targetX - packet.x) * packet.progress;
                const currentY = packet.y + (packet.targetY - packet.y) * packet.progress;
                
                return true;
            });

            // Render packets
            let packetsHTML = '';
            this.packets.forEach(packet => {
                const currentX = packet.x + (packet.targetX - packet.x) * packet.progress;
                const currentY = packet.y + (packet.targetY - packet.y) * packet.progress;
                const color = packet.isThreat ? '#FF0040' : '#00FFFF';
                
                packetsHTML += `
                    <circle cx="${currentX}" cy="${currentY}" r="3" fill="${color}" filter="url(#glow)">
                        <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite"/>
                    </circle>
                `;
            });
            
            packetsContainer.innerHTML = packetsHTML;
            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    }
}

// ============================================
// VULNERABILITY METERS
// ============================================
const animateVulnMeters = () => {
    const meters = document.querySelectorAll('.meter-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const meter = entry.target;
                const width = meter.dataset.width;
                setTimeout(() => {
                    meter.style.width = width + '%';
                }, 200);
                observer.unobserve(meter);
            }
        });
    }, { threshold: 0.5 });

    meters.forEach(meter => observer.observe(meter));
};

// ============================================
// DECRYPT FUNCTIONALITY
// ============================================
const initDecrypt = () => {
    const decryptBtn = document.getElementById('reveal-btn');
    const progressContainer = document.getElementById('decrypt-progress');
    const decryptedOutput = document.getElementById('decrypted-output');
    const outputContent = document.getElementById('output-content');
    const outputTime = document.getElementById('output-time');
    const stages = document.querySelectorAll('.progress-stages .stage');
    const cipherBlocks = document.querySelectorAll('.cipher-block');

    const decryptedMessage = `
        <p class="output-message">
            <span class="highlight">PRIORITY ALPHA</span> // CLASSIFIED TRANSMISSION
        </p>
        <p class="output-message">
            <span class="warning">⚠ THREAT INTEL BRIEFING ⚠</span>
        </p>
        <p class="output-message">
            Agent, we've detected a coordinated APT campaign targeting
            financial infrastructure across multiple sectors.
        </p>
        <p class="output-message">
            Key indicators:
            • C2 servers: <span class="highlight">185.x.x.0/24</span>
            • Malware hash: <span class="highlight">a1b2c3d4e5f6...</span>
            • Initial vector: Spear-phishing with macro-enabled docs
        </p>
        <p class="output-message">
            <span class="warning">IMMEDIATE ACTION REQUIRED</span>
        </p>
        <p class="output-message">
            Deploy countermeasures per protocol DELTA-7.
            All teams on standby. Await further instructions.
        </p>
        <p class="output-message">
            END TRANSMISSION // <span class="highlight">PHANTOM-7X92-DELTA</span>
        </p>
    `;

    decryptBtn.addEventListener('click', async () => {
        if (decryptBtn.classList.contains('decrypting')) return;
        
        decryptBtn.classList.add('decrypting');
        decryptBtn.querySelector('.btn-icon').textContent = '◆';
        progressContainer.classList.add('active');
        decryptedOutput.classList.remove('visible');

        // Animate cipher blocks
        cipherBlocks.forEach((block, i) => {
            setTimeout(() => {
                block.style.background = 'rgba(57, 255, 20, 0.2)';
                block.style.borderColor = 'var(--neon-lime)';
            }, i * 100);
        });

        // Animate stages
        for (let i = 0; i < stages.length; i++) {
            await sleep(400);
            stages.forEach(s => s.classList.remove('active'));
            stages[i].classList.add('active');
            if (i > 0) stages[i - 1].classList.add('complete');
        }

        await sleep(500);
        stages[stages.length - 1].classList.add('complete');

        // Show decrypted output
        const now = new Date();
        outputTime.textContent = now.toISOString().replace('T', ' ').substring(0, 19);
        outputContent.innerHTML = decryptedMessage;
        decryptedOutput.classList.add('visible');

        // Reset button
        decryptBtn.classList.remove('decrypting');
        decryptBtn.querySelector('.btn-icon').textContent = '▶';
    });
};

// ============================================
// AUDIT LOG
// ============================================
const auditLogEntries = [
    { level: 'info', module: 'AUTH', msg: 'User <span class="highlight">admin</span> logged in from 192.168.1.100', source: 'sshd' },
    { level: 'info', module: 'NET', msg: 'Firewall rule updated: ALLOW 10.0.0.0/8 -> 172.16.0.0/12', source: 'iptables' },
    { level: 'warn', module: 'SCAN', msg: 'Suspicious port scan detected from <span class="warning">203.0.113.42</span>', source: 'ids' },
    { level: 'info', module: 'SYS', msg: 'Scheduled backup completed successfully (2.4GB)', source: 'backup' },
    { level: 'error', module: 'AUTH', msg: 'Failed login attempt for user <span class="error-text">root</span> from 198.51.100.23', source: 'sshd' },
    { level: 'info', module: 'NET', msg: 'VPN tunnel established: gw-01 <-> gw-02 (AES-256)', source: 'vpn' },
    { level: 'warn', module: 'MAL', msg: 'Quarantined file: <span class="warning">invoice_2024.exe</span> (Win.Trojan.Generic)', source: 'clamav' },
    { level: 'info', module: 'AUDIT', msg: 'Configuration change detected in /etc/nginx/nginx.conf', source: 'aide' },
    { level: 'debug', module: 'SYS', msg: 'Memory usage: 67% (171GB / 256GB)', source: 'monit' },
    { level: 'info', module: 'CERT', msg: 'SSL certificate renewed for *.cyphercore.io', source: 'certbot' },
    { level: 'error', module: 'NET', msg: 'Connection timeout to <span class="error-text">db-primary:5432</span>', source: 'app' },
    { level: 'info', module: 'SCAN', msg: 'Vulnerability scan completed: 0 critical, 2 medium, 5 low', source: 'nessus' },
    { level: 'warn', module: 'AUTH', msg: 'User <span class="warning">svc-account</span> password expires in 7 days', source: 'ldap' },
    { level: 'info', module: 'FW', msg: 'Blocked 847 packets from known malicious IP range', source: 'suricata' },
    { level: 'debug', module: 'SYS', msg: 'CPU load average: 2.34, 2.12, 1.98', source: 'monit' },
];

const generateTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
};

const addAuditLogEntry = () => {
    const logContainer = document.getElementById('audit-log');
    const entry = auditLogEntries[Math.floor(Math.random() * auditLogEntries.length)];
    
    const entryElement = document.createElement('div');
    entryElement.className = 'log-entry';
    entryElement.innerHTML = `
        <span class="log-timestamp">${generateTimestamp()}</span>
        <span class="log-level ${entry.level}">${entry.level.toUpperCase()}</span>
        <span class="log-module">${entry.module}</span>
        <span class="log-message">${entry.msg}</span>
        <span class="log-source">${entry.source}</span>
    `;
    
    logContainer.insertBefore(entryElement, logContainer.firstChild);
    
    // Keep only last 100 entries
    while (logContainer.children.length > 100) {
        logContainer.removeChild(logContainer.lastChild);
    }
    
    document.getElementById('log-count').textContent = `Showing ${logContainer.children.length} entries`;
};

// ============================================
// NAVIGATION
// ============================================
const initNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active nav on scroll
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
};

// ============================================
// FILTER CONTROLS
// ============================================
const initFilterControls = () => {
    // Threat feed filters
    document.querySelectorAll('.threat-section .control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.threat-section .control-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            document.querySelectorAll('.threat-entry').forEach(entry => {
                if (filter === 'all' || entry.classList.contains(filter)) {
                    entry.style.display = 'grid';
                } else {
                    entry.style.display = 'none';
                }
            });
        });
    });
};

// ============================================
// SESSION ID GENERATOR
// ============================================
const generateSessionId = () => {
    const chars = '0123456789ABCDEF';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById('session-id').textContent = id;
};

// ============================================
// INITIALIZE MAIN SYSTEMS
// ============================================
const initializeMainSystems = () => {
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // Initialize matrix rain
    const matrixCanvas = document.getElementById('matrix-rain');
    new MatrixRain(matrixCanvas);

    // Start tagline animation
    animateTagline();

    // Animate counters
    setTimeout(() => {
        animateCounter(document.getElementById('threats-blocked'), 147823);
        animateCounter(document.getElementById('active-scans'), 24);
        animateCounter(document.getElementById('vuln-found'), 3847);
    }, 500);

    // Initialize threat feed
    for (let i = 0; i < 10; i++) {
        addThreatEntry();
    }
    setInterval(addThreatEntry, 3000);

    // Initialize network topology
    const networkSvg = document.getElementById('network-svg');
    new NetworkTopology(networkSvg);

    // Initialize vulnerability meters
    animateVulnMeters();

    // Initialize decrypt functionality
    initDecrypt();

    // Initialize audit log
    for (let i = 0; i < 15; i++) {
        addAuditLogEntry();
    }
    setInterval(addAuditLogEntry, 4000);

    // Initialize navigation
    initNavigation();

    // Initialize filter controls
    initFilterControls();

    // Generate session ID
    generateSessionId();

    // Add fade-in animations to sections
    document.querySelectorAll('.section').forEach((section, i) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, i * 150);
    });
};

// ============================================
// START APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Start with boot sequence
    bootSequence();
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl+K to focus search (placeholder)
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        console.log('Search shortcut triggered');
    }
    
    // Escape to close overlays
    if (e.key === 'Escape') {
        const bootOverlay = document.getElementById('boot-overlay');
        if (!bootOverlay.classList.contains('hidden')) {
            bootOverlay.classList.add('hidden');
            initializeMainSystems();
        }
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(`
%c╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗██╗   ██╗██████╗ ██╗  ██╗███████╗██████╗ ██████╗    ║
║  ██╔════╝╚██╗ ██╔╝██╔══██╗██║  ██║██╔════╝██╔══██╗██╔══██╗   ║
║  ██║      ╚████╔╝ ██████╔╝███████║█████╗  ██████╔╝██████╔╝   ║
║  ██║       ╚██╔╝  ██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗██╔══██╗   ║
║  ╚██████╗   ██║   ██║     ██║  ██║███████╗██║  ██║██║  ██║   ║
║   ╚═════╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ║
║                                                               ║
║  Welcome to CYPHERCORE Security Intelligence Platform         ║
║  Authorized access only. All sessions are monitored.          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`, 'color: #39FF14; font-family: monospace;');

console.log('%c[SYSTEM] Console access detected. Session logged.', 'color: #FFB000; font-family: monospace;');
console.log('%c[TIP] Press ESC to skip boot sequence', 'color: #00FFFF; font-family: monospace;');
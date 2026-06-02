// ============================================
// VOIDSEC // CORE SYSTEM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initBootSequence().then(() => {
        initInterface();
        initNavigation();
        initDashboard();
        initThreatFeed();
        initThreatMap();
        initTopology();
        initAuditLog();
        initIntel();
        initContact();
        startGlobalLoops();
    });
});

// ============================================
// BOOT SEQUENCE
// ============================================

async function initBootSequence() {
    const bootSequence = document.getElementById('bootSequence');
    const bootLines = document.getElementById('bootLines');
    const bootProgress = document.getElementById('bootProgress');
    const bootStatus = document.getElementById('bootStatus');

    const lines = [
        { text: 'BIOS DATE 01/15/2024 14:32:07 VER 3.2.1', type: 'ok' },
        { text: 'CPU: QUANTUM_CORE_X9 @ 4.2GHz', type: 'ok' },
        { text: 'DETECTED 256GB ECC MEMORY... OK', type: 'ok' },
        { text: 'INITIALIZING HARDWARE RNG... OK', type: 'ok' },
        { text: 'WARNING: SECURE_BOOT DISABLED', type: 'warn' },
        { text: 'LOADING KERNEL MODULE: netfilter_v4... OK', type: 'ok' },
        { text: 'LOADING KERNEL MODULE: aesni_intel... OK', type: 'ok' },
        { text: 'MOUNTING ENCRYPTED VOLUME: /dev/mapper/voidsec... OK', type: 'ok' },
        { text: 'INITIALIZING TOR CIRCUIT... ESTABLISHED', type: 'ok' },
        { text: 'CONNECTING TO MESH NODE: 0x7A3F-9E2D... OK', type: 'ok' },
        { text: 'VERIFYING PEER SIGNATURES... 14/14 VALID', type: 'ok' },
        { text: 'WARNING: UNUSUAL_TRAFFIC_PATTERN DETECTED ON PORT 8443', type: 'warn' },
        { text: 'ACTIVATING INTRUSION_DETECTION... ARMED', type: 'ok' },
        { text: 'LOADING THREAT_SIGNATURES... 2,847,291 PATTERNS', type: 'ok' },
        { text: 'SPINNING UP HONEYPOT SERVICES... 16 INSTANCES', type: 'ok' },
        { text: 'ESTABLISHING SECURE CHANNELS... DONE', type: 'ok' },
        { text: 'MOUNTING INTELLIGENCE FEEDS... 47 SOURCES', type: 'ok' },
        { text: 'CALIBRATING NEURAL_CLASSIFIER... 99.7% ACCURACY', type: 'ok' },
        { text: 'WARNING: OUTDATED_CIPHER_SUITE IN LEGACY_CONFIG', type: 'warn' },
        { text: 'SYSTEM READY', type: 'ok' },
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const percent = ((i + 1) / lines.length) * 100;
        const delay = 80 + Math.random() * 120;

        await sleep(delay);

        const lineEl = document.createElement('div');
        lineEl.className = `line-${line.type}`;
        lineEl.textContent = `[${line.type.toUpperCase()}] ${line.text}`;
        bootLines.appendChild(lineEl);

        bootLines.scrollTop = bootLines.scrollHeight;
        bootProgress.style.width = `${percent}%`;
        bootStatus.textContent = `INITIALIZING... ${Math.floor(percent)}%`;
    }

    await sleep(400);
    bootStatus.textContent = 'ACCESS GRANTED';

    await sleep(600);
    bootSequence.classList.add('complete');
    document.getElementById('mainInterface').classList.add('visible');
}

// ============================================
// INTERFACE & GLOBAL STATE
// ============================================

function initInterface() {
    const uptimeEl = document.getElementById('uptime');
    let seconds = 0;

    setInterval(() => {
        seconds++;
        uptimeEl.textContent = formatUptime(seconds);
    }, 1000);

    updateNodeId();
    animateConnectionPing();
}

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function updateNodeId() {
    const el = document.getElementById('nodeId');
    setInterval(() => {
        if (Math.random() > 0.95) {
            el.textContent = `0x${randomHex(4)}-${randomHex(4)}`;
        }
    }, 2000);
}

function animateConnectionPing() {
    const el = document.querySelector('.conn-ping');
    setInterval(() => {
        const ping = Math.floor(8 + Math.random() * 20);
        el.textContent = `${ping}ms`;
    }, 3000);
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const glider = document.querySelector('.nav-glider');

    function updateGlider(item) {
        glider.style.left = `${item.offsetLeft}px`;
        glider.style.width = `${item.offsetWidth}px`;
    }

    updateGlider(navItems[0]);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.section;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            updateGlider(item);

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    window.addEventListener('resize', () => {
        const active = document.querySelector('.nav-item.active');
        if (active) updateGlider(active);
    });
}

// ============================================
// DASHBOARD
// ============================================

function initDashboard() {
    initPacketViz();
    initIncidents();
    initCryptoChallenge();
    animateStats();
}

function initPacketViz() {
    const container = document.getElementById('packetViz');
    const barCount = 40;

    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'packet-bar';
        container.appendChild(bar);
    }

    setInterval(() => {
        const bars = container.querySelectorAll('.packet-bar');
        bars.forEach(bar => {
            const height = Math.random() * 100;
            bar.style.height = `${height}%`;
            bar.style.opacity = 0.3 + (height / 200);
        });
    }, 150);
}

function animateStats() {
    const targets = {
        pps: { value: 0, target: 45231, el: document.getElementById('pps') },
        blockedIps: { value: 0, target: 1847, el: document.getElementById('blockedIps') },
        honeypots: { value: 0, target: 16, el: document.getElementById('honeypots') },
        signatures: { value: 0, target: 2847291, el: document.getElementById('signatures') }
    };

    Object.values(targets).forEach(stat => {
        const increment = stat.target / 120;
        const interval = setInterval(() => {
            stat.value += increment;
            if (stat.value >= stat.target) {
                stat.value = stat.target;
                clearInterval(interval);
            }
            stat.el.textContent = Math.floor(stat.value).toLocaleString();
        }, 50);
    });

    setInterval(() => {
        targets.pps.value += Math.floor(Math.random() * 2000) - 1000;
        targets.pps.value = Math.max(40000, Math.min(50000, targets.pps.value));
        targets.pps.el.textContent = Math.floor(targets.pps.value).toLocaleString();
    }, 2000);
}

function initIncidents() {
    const container = document.getElementById('incidentList');
    const incidents = [
        { time: '14:32:07', type: 'SQL_INJECTION_ATTEMPT', severity: 'high', target: 'web-frontend-03' },
        { time: '14:28:51', type: 'BRUTE_FORCE_SSH', severity: 'medium', target: 'bastion-01' },
        { time: '14:15:33', type: 'MALWARE_C2_BEACON', severity: 'critical', target: 'workstation-47' },
        { time: '14:09:12', type: 'XSS_PAYLOAD_BLOCKED', severity: 'medium', target: 'api-gateway' },
        { time: '13:58:44', type: 'DNS_TUNNELING_DETECTED', severity: 'high', target: 'dns-resolver-02' },
    ];

    function addIncident(inc) {
        const div = document.createElement('div');
        div.className = `incident-item ${inc.severity}`;
        div.innerHTML = `
            <span class="incident-time">${inc.time}</span>
            <span class="incident-type">${inc.type}</span>
            <span class="incident-severity">${inc.severity.toUpperCase()}</span>
        `;
        container.prepend(div);
        if (container.children.length > 8) {
            container.lastElementChild.remove();
        }
    }

    incidents.forEach(addIncident);

    const newIncidents = [
        { type: 'RANSOMWARE_LIKE_ACTIVITY', severity: 'critical' },
        { type: 'CREDENTIAL_STUFFING', severity: 'high' },
        { type: 'LFI_ATTEMPT', severity: 'medium' },
        { type: 'SUSPICIOUS_POWER_SHELL', severity: 'high' },
    ];

    let idx = 0;
    setInterval(() => {
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);
        const inc = {
            time,
            type: newIncidents[idx % newIncidents.length].type,
            severity: newIncidents[idx % newIncidents.length].severity,
            target: `node-${randomHex(4)}`
        };
        addIncident(inc);
        idx++;
    }, 8000);
}

function initCryptoChallenge() {
    const btn = document.getElementById('decryptBtn');
    const lock = document.getElementById('cryptoLock');
    const state = document.getElementById('cryptoState');
    const progress = document.getElementById('decryptProgress');
    const bar = document.getElementById('decryptBar');
    const content = document.getElementById('decryptedContent');
    const message = document.getElementById('encryptedMessage');

    const decryptedMessage = `> DECRYPTION SUCCESSFUL\n\n> ORIGIN: VOIDSEC_COLLECTIVE\n> CLASSIFICATION: MEMBERS_ONLY\n\nGreetings, operative.\n\nIf you're reading this, you've passed the first test. Our collective operates in the shadows, where light is a liability and silence is currency. We track what others miss. We see what others ignore.\n\nThe network is alive. It's breathing. And it's under constant siege.\n\nYour skills have been observed. The patterns in your traffic, the timing of your requests, the very rhythm of your keystrokes—they tell a story. One we find... interesting.\n\nSeek the dead drop. The coordinates are encoded in the audit logs, timestamp 14:32:07. Look for the anomaly in the entropy.\n\nTrust no one. Verify everything.\n\n— CIPHER`;

    btn.addEventListener('click', async () => {
        btn.disabled = true;
        progress.classList.add('active');

        const chars = 'ABCDEF0123456789-';
        const originalText = message.textContent;

        for (let i = 0; i <= 100; i++) {
            bar.style.width = `${i}%`;
            if (i < 80) {
                message.textContent = Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            } else {
                const reveal = Math.floor((i - 80) / 20 * decryptedMessage.length);
                message.textContent = decryptedMessage.slice(0, reveal) + originalText.slice(reveal);
            }
            await sleep(30 + Math.random() * 20);
        }

        lock.classList.add('unlocked');
        lock.textContent = '🔓';
        state.classList.add('unlocked');
        state.textContent = 'UNLOCKED';

        message.textContent = '';
        content.textContent = decryptedMessage;
        content.classList.add('revealed');
        progress.classList.remove('active');
    });
}

// ============================================
// THREAT MAP
// ============================================

function initThreatMap() {
    const canvas = document.getElementById('threatMap');
    const ctx = canvas.getContext('2d');
    let animationId;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    const targets = [];
    for (let i = 0; i < 20; i++) {
        targets.push({
            x: 0.1 + Math.random() * 0.8,
            y: 0.1 + Math.random() * 0.8,
            type: Math.random() > 0.7 ? 'honeypot' : 'server',
            name: `NODE-${randomHex(4)}`
        });
    }

    const attacks = [];

    function spawnAttack() {
        const fromX = Math.random() > 0.5 ? 0 : 1;
        const fromY = Math.random();
        const target = targets[Math.floor(Math.random() * targets.length)];
        const type = Math.random() > 0.6 ? 'active' : (Math.random() > 0.5 ? 'recon' : 'mitigated');

        attacks.push({
            fromX, fromY,
            toX: target.x, toY: target.y,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01,
            type,
            life: 1
        });
    }

    function draw() {
        ctx.fillStyle = '#0a140a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Targets
        targets.forEach(t => {
            const x = t.x * canvas.width;
            const y = t.y * canvas.height;

            ctx.fillStyle = t.type === 'honeypot' ? 'rgba(255, 0, 64, 0.3)' : 'rgba(0, 255, 159, 0.2)';
            ctx.beginPath();
            ctx.arc(x, y, t.type === 'honeypot' ? 8 : 5, 0, Math.PI * 2);
            ctx.fill();

            if (t.type === 'honeypot') {
                ctx.strokeStyle = 'rgba(255, 0, 64, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, y, 12 + Math.sin(Date.now() / 500) * 4, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        // Attacks
        for (let i = attacks.length - 1; i >= 0; i--) {
            const a = attacks[i];
            a.progress += a.speed;

            const x = a.fromX + (a.toX - a.fromX) * a.progress;
            const y = a.fromY + (a.toY - a.fromY) * a.progress;

            const px = x * canvas.width;
            const py = y * canvas.height;

            let color;
            switch (a.type) {
                case 'active': color = 'rgba(255, 0, 64,'; break;
                case 'recon': color = 'rgba(204, 255, 0,'; break;
                default: color = 'rgba(57, 255, 20,';
            }

            // Trail
            ctx.strokeStyle = `${color} ${a.life * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(a.fromX * canvas.width, a.fromY * canvas.height);
            ctx.lineTo(px, py);
            ctx.stroke();

            // Head
            ctx.fillStyle = `${color} ${a.life})`;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();

            if (a.progress >= 1) {
                a.life -= 0.05;
                if (a.life <= 0) {
                    attacks.splice(i, 1);
                }
            }
        }

        animationId = requestAnimationFrame(draw);
    }

    draw();
    setInterval(spawnAttack, 800);

    // Update stats
    setInterval(() => {
        document.getElementById('activeAttacks').textContent = Math.floor(5 + Math.random() * 15);
        document.getElementById('mitigatedAttacks').textContent = Math.floor(100 + Math.random() * 50);
    }, 2000);
}

// ============================================
// THREAT FEED
// ============================================

function initThreatFeed() {
    const container = document.getElementById('threatFeed');
    const filters = document.querySelectorAll('.feed-filter');
    let currentFilter = 'all';

    const severities = ['critical', 'high', 'medium', 'low'];
    const types = [
        'CVE-2024-XXXX EXPLOIT DETECTED',
        'RANSOMWARE_GANG INFRASTRUCTURE UPDATE',
        'APT29 CAMPAIGN TARGETING ENERGY SECTOR',
        '0-DAY VULNERABILITY IN WIDELY-USED LIBRARY',
        'BOTNET C2 MIGRATION DETECTED',
        'SUPPLY CHAIN COMPROMISE INDICATORS',
        'CRYPTO_MINING MALWARE SPREADING VIA SSH',
        'PHISHING KIT DETECTED ON HOSTING PROVIDER'
    ];

    function addThreat() {
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);

        const div = document.createElement('div');
        div.className = `threat-item ${severity}`;
        div.dataset.severity = severity;
        div.innerHTML = `
            <div class="threat-header">
                <span class="threat-id">THREAT-${randomHex(8)}</span>
                <span class="threat-time">${time}</span>
            </div>
            <div class="threat-desc">${type}</div>
            <div class="threat-meta">
                <span>SRC: ${randomIp()}</span>
                <span>TGT: SECTOR_${Math.floor(Math.random() * 9) + 1}</span>
                <span>CONF: ${Math.floor(60 + Math.random() * 39)}%</span>
            </div>
        `;

        container.prepend(div);
        if (container.children.length > 20) {
            container.lastElementChild.remove();
        }

        applyFilter();
    }

    function applyFilter() {
        const items = container.querySelectorAll('.threat-item');
        items.forEach(item => {
            if (currentFilter === 'all' || item.dataset.severity === currentFilter) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filters.forEach(f => {
        f.addEventListener('click', () => {
            filters.forEach(x => x.classList.remove('active'));
            f.classList.add('active');
            currentFilter = f.dataset.severity;
            applyFilter();
        });
    });

    // Initial population
    for (let i = 0; i < 10; i++) addThreat();

    setInterval(addThreat, 3500);
}

// ============================================
// NETWORK TOPOLOGY
// ============================================

function initTopology() {
    const canvas = document.getElementById('topologyCanvas');
    const ctx = canvas.getContext('2d');
    const detailsPanel = document.getElementById('nodeDetails');

    let nodes = [];
    let links = [];
    let selectedNode = null;
    let hoveredNode = null;
    let camera = { x: 0, y: 0, zoom: 1 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let cameraStart = { x: 0, y: 0 };

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    // Generate topology
    const types = ['gateway', 'server', 'workstation', 'honeypot'];
    const typeColors = {
        gateway: '#39ff14',
        server: '#00ff9f',
        workstation: '#ccff00',
        honeypot: '#ff0040'
    };

    // Central gateway
    nodes.push({
        id: 'GATEWAY-01',
        type: 'gateway',
        x: 0, y: 0,
        radius: 20,
        connections: 0
    });

    // Servers
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        nodes.push({
            id: `SRV-${String(i + 1).padStart(3, '0')}`,
            type: 'server',
            x: Math.cos(angle) * 180,
            y: Math.sin(angle) * 180,
            radius: 14,
            connections: 0
        });
    }

    // Workstations and honeypots
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 280 + Math.random() * 120;
        const type = Math.random() > 0.85 ? 'honeypot' : 'workstation';
        nodes.push({
            id: `${type === 'honeypot' ? 'HONEYPOT' : 'WS'}-${randomHex(4)}`,
            type,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            radius: type === 'honeypot' ? 10 : 8,
            connections: 0
        });
    }

    // Create links
    nodes.forEach((node, i) => {
        if (node.type === 'gateway') {
            nodes.filter(n => n.type === 'server').forEach(target => {
                links.push({ source: node, target });
                node.connections++;
                target.connections++;
            });
        } else if (node.type === 'server') {
            const nearby = nodes.filter(n => n.type !== 'gateway' && n !== node)
                .sort((a, b) => {
                    const da = Math.hypot(a.x - node.x, a.y - node.y);
                    const db = Math.hypot(b.x - node.x, b.y - node.y);
                    return da - db;
                })
                .slice(0, 2 + Math.floor(Math.random() * 3));
            nearby.forEach(target => {
                links.push({ source: node, target });
                node.connections++;
                target.connections++;
            });
        }
    });

    function worldToScreen(x, y) {
        return {
            x: (x - camera.x) * camera.zoom + canvas.width / 2,
            y: (y - camera.y) * camera.zoom + canvas.height / 2
        };
    }

    function screenToWorld(x, y) {
        return {
            x: (x - canvas.width / 2) / camera.zoom + camera.x,
            y: (y - canvas.height / 2) / camera.zoom + camera.y
        };
    }

    function draw() {
        ctx.fillStyle = '#0a140a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        const gridSize = 50 * camera.zoom;
        const offsetX = ((-camera.x * camera.zoom + canvas.width / 2) % gridSize + gridSize) % gridSize;
        const offsetY = ((-camera.y * camera.zoom + canvas.height / 2) % gridSize + gridSize) % gridSize;

        ctx.strokeStyle = 'rgba(57, 255, 20, 0.03)';
        ctx.lineWidth = 1;
        for (let x = offsetX; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = offsetY; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Links
        links.forEach(link => {
            const from = worldToScreen(link.source.x, link.source.y);
            const to = worldToScreen(link.target.x, link.target.y);

            const isActive = hoveredNode && (link.source === hoveredNode || link.target === hoveredNode);

            ctx.strokeStyle = isActive ? 'rgba(57, 255, 20, 0.4)' : 'rgba(57, 255, 20, 0.08)';
            ctx.lineWidth = isActive ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();

            // Packet animation
            if (isActive || Math.random() > 0.995) {
                const t = (Date.now() % 2000) / 2000;
                const px = from.x + (to.x - from.x) * t;
                const py = from.y + (to.y - from.y) * t;
                ctx.fillStyle = typeColors[link.source.type];
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Nodes
        nodes.forEach(node => {
            const pos = worldToScreen(node.x, node.y);
            const isHovered = node === hoveredNode;
            const isSelected = node === selectedNode;

            // Glow
            if (isHovered || isSelected) {
                ctx.fillStyle = `${typeColors[node.type]}20`;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, node.radius * camera.zoom * 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Node body
            ctx.fillStyle = typeColors[node.type];
            ctx.globalAlpha = node.type === 'honeypot' ? 0.7 + Math.sin(Date.now() / 300) * 0.3 : 1;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, node.radius * camera.zoom * (isHovered ? 1.3 : 1), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // Border
            if (isSelected) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, node.radius * camera.zoom * 1.5, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Label
            if (camera.zoom > 0.6 || isHovered) {
                ctx.fillStyle = isHovered ? '#fff' : 'rgba(57, 255, 20, 0.6)';
                ctx.font = `${isHovered ? 'bold ' : ''}${Math.max(10, 12 * camera.zoom)}px "Share Tech Mono"`;
                ctx.textAlign = 'center';
                ctx.fillText(node.id, pos.x, pos.y + node.radius * camera.zoom + 16);
            }
        });

        requestAnimationFrame(draw);
    }

    // Mouse events
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        const mouse = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

        if (isDragging) {
            camera.x = cameraStart.x - (e.clientX - rect.left - dragStart.x) / camera.zoom;
            camera.y = cameraStart.y - (e.clientY - rect.top - dragStart.y) / camera.zoom;
            return;
        }

        hoveredNode = null;
        for (const node of nodes) {
            const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
            if (dist < node.radius * 2 / camera.zoom) {
                hoveredNode = node;
                break;
            }
        }
        canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    });

    canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        isDragging = true;
        dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        cameraStart = { ...camera };
        canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    });

    canvas.addEventListener('click', e => {
        if (hoveredNode) {
            selectedNode = hoveredNode;
            showNodeDetails(selectedNode);
        }
    });

    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        camera.zoom = Math.max(0.3, Math.min(3, camera.zoom * zoomFactor));
    });

    function showNodeDetails(node) {
        const traffic = Math.floor(Math.random() * 10000);
        const packets = Math.floor(Math.random() * 500000);
        const alerts = node.type === 'honeypot' ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 5);

        detailsPanel.innerHTML = `
            <div class="node-detail-card">
                <div class="node-detail-header">
                    <div class="node-detail-icon" style="background: ${typeColors[node.type]}20; color: ${typeColors[node.type]}">
                        ${node.type === 'gateway' ? '◆' : node.type === 'server' ? '■' : node.type === 'honeypot' ? '⚠' : '●'}
                    </div>
                    <div>
                        <div class="node-detail-title">${node.id}</div>
                        <div class="node-detail-subtitle">${node.type.toUpperCase()}</div>
                    </div>
                </div>
                <div class="detail-row">
                    <span class="detail-label">STATUS</span>
                    <span class="detail-value">${node.type === 'honeypot' ? 'TRAP_ACTIVE' : 'ONLINE'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">UPTIME</span>
                    <span class="detail-value">${Math.floor(Math.random() * 30 + 1)}d ${Math.floor(Math.random() * 24)}h</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">TRAFFIC/s</span>
                    <span class="detail-value">${traffic.toLocaleString()} MB</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">PACKETS</span>
                    <span class="detail-value">${packets.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">CONNECTIONS</span>
                    <span class="detail-value">${node.connections}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">ALERTS</span>
                    <span class="detail-value ${alerts > 5 ? 'alarm' : ''}">${alerts}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">LAST_SEEN</span>
                    <span class="detail-value">${new Date().toTimeString().slice(0, 8)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">OS_FINGERPRINT</span>
                    <span class="detail-value">${['LINUX_5.15', 'BSD_14.0', 'CUSTOM_Hardened'][Math.floor(Math.random() * 3)]}</span>
                </div>
            </div>
        `;
    }

    draw();
}

// ============================================
// AUDIT LOG
// ============================================

function initAuditLog() {
    const container = document.getElementById('auditLog');
    const searchInput = document.getElementById('auditSearch');
    const logCount = document.getElementById('logCount');
    const autoScroll = document.getElementById('autoScroll');
    const checkboxes = {
        info: document.getElementById('showInfo'),
        warn: document.getElementById('showWarn'),
        alert: document.getElementById('showAlert'),
        crit: document.getElementById('showCrit')
    };

    const sources = ['firewall', 'ids', 'honeypot', 'scanner', 'agent', 'proxy', 'dns'];
    const messages = {
        info: [
            'Routine scan completed, no anomalies',
            'Signature database updated to v2847.3',
            'Backup completed successfully',
            'New peer node registered',
            'Certificate renewal scheduled'
        ],
        warn: [
            'Elevated failed auth attempts from 192.168.x.x',
            'Unusual DNS query pattern detected',
            'Large outbound data transfer flagged',
            'Deprecated TLS version in use',
            'Geolocation anomaly for user session'
        ],
        alert: [
            'Possible SQLi attempt blocked',
            'C2 beacon pattern matched',
            'Lateral movement detected',
            'Privilege escalation attempt logged',
            'Suspicious PowerShell execution'
        ],
        crit: [
            'RANSOMWARE DETECTION: File encryption in progress',
            'DATA_EXFILTRATION: Large transfer to unknown host',
            'ROOT_COMPROMISE: Unauthorized admin access',
            'BOTNET_ENROLLMENT: Host communicating with known C2',
            'SUPPLY_CHAIN_ALERT: Modified binary detected'
        ]
    };

    function addLogEntry() {
        const levels = Object.keys(messages);
        const level = levels[Math.floor(Math.random() * levels.length)];
        const msg = messages[level][Math.floor(Math.random() * messages[level].length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const now = new Date();

        const div = document.createElement('div');
        div.className = `log-entry ${level}`;
        div.innerHTML = `
            <span class="log-timestamp">${now.toISOString().slice(0, 19).replace('T', ' ')}</span>
            <span class="log-level ${level}">${level.toUpperCase()}</span>
            <span class="log-source">[${source}]</span>
            <span class="log-message">${msg}</span>
        `;

        container.appendChild(div);

        if (container.children.length > 200) {
            container.firstElementChild.remove();
        }

        applyFilters();

        if (autoScroll.classList.contains('active')) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function applyFilters() {
        const search = searchInput.value.toLowerCase();
        const activeLevels = Object.entries(checkboxes)
            .filter(([_, cb]) => cb.checked)
            .map(([level]) => level);

        const entries = container.querySelectorAll('.log-entry');
        let visible = 0;

        entries.forEach(entry => {
            const level = entry.classList[1];
            const text = entry.textContent.toLowerCase();
            const show = activeLevels.includes(level) && (!search || text.includes(search));

            entry.classList.toggle('hidden', !show);
            if (show) visible++;
        });

        logCount.textContent = visible;
    }

    searchInput.addEventListener('input', applyFilters);
    Object.values(checkboxes).forEach(cb => cb.addEventListener('change', applyFilters));

    autoScroll.addEventListener('click', () => {
        autoScroll.classList.toggle('active');
        autoScroll.textContent = autoScroll.classList.contains('active') ? 'ON' : 'OFF';
    });

    // Initial population
    for (let i = 0; i < 30; i++) addLogEntry();

    setInterval(addLogEntry, 1500);
}

// ============================================
// INTELLIGENCE
// ============================================

function initIntel() {
    const vulnList = document.getElementById('vulnList');
    const advisoryList = document.getElementById('advisoryList');

    const vulns = [
        { cve: 'CVE-2024-21762', score: 9.8, title: 'Fortinet SSL VPN Buffer Overflow', desc: 'A heap-based buffer overflow in Fortinet FortiOS may allow a remote unauthenticated attacker to execute arbitrary code.', vendor: 'Fortinet' },
        { cve: 'CVE-2024-21413', score: 9.6, title: 'Microsoft Outlook Remote Code Execution', desc: 'Improper input validation in Microsoft Outlook allows remote code execution via malicious email.', vendor: 'Microsoft' },
        { cve: 'CVE-2024-1086', score: 7.8, title: 'Linux Kernel Use-After-Free', desc: 'Use-after-free vulnerability in netfilter subsystem allows local privilege escalation.', vendor: 'Linux' },
        { cve: 'CVE-2024-3094', score: 10.0, title: 'XZ Utils Backdoor', desc: 'Malicious backdoor discovered in XZ compression library affecting SSH authentication.', vendor: 'XZ' }
    ];

    const advisories = [
        { id: 'ADV-2024-001', title: 'Critical Infrastructure Targeting Campaign', desc: 'Nation-state actors observed targeting energy sector with customized ICS malware.', date: '2024-03-15' },
        { id: 'ADV-2024-002', title: 'Ransomware Affiliate Program Restructuring', desc: 'Major RaaS operations shifting to pure data theft models, abandoning encryption.', date: '2024-03-12' },
        { id: 'ADV-2024-003', title: 'AI-Generated Phishing Surge', desc: 'Reported 400% increase in convincing voice and text deepfake social engineering.', date: '2024-03-08' },
        { id: 'ADV-2024-004', title: 'Supply Chain Compromise Indicators', desc: 'Novel package manager poisoning campaign affecting npm and PyPI ecosystems.', date: '2024-03-05' }
    ];

    function getScoreClass(score) {
        if (score >= 9) return 'critical';
        if (score >= 7) return 'high';
        return 'medium';
    }

    vulns.forEach(v => {
        const div = document.createElement('div');
        div.className = 'vuln-item';
        div.innerHTML = `
            <div class="vuln-header">
                <span class="vuln-cve">${v.cve}</span>
                <span class="vuln-score ${getScoreClass(v.score)}">${v.score}</span>
            </div>
            <div class="vuln-title">${v.title}</div>
            <div class="vuln-desc">${v.desc}</div>
            <div class="vuln-meta">
                <span>VENDOR: ${v.vendor}</span>
                <span>EXPLOIT: ${Math.random() > 0.5 ? 'PUBLIC' : 'POC_AVAILABLE'}</span>
            </div>
        `;
        vulnList.appendChild(div);
    });

    advisories.forEach(a => {
        const div = document.createElement('div');
        div.className = 'advisory-item';
        div.innerHTML = `
            <div class="advisory-header">
                <span class="advisory-id">${a.id}</span>
            </div>
            <div class="advisory-title">${a.title}</div>
            <div class="advisory-desc">${a.desc}</div>
            <div class="advisory-meta">
                <span>DATE: ${a.date}</span>
                <span>CLASS: TACTICAL_ALERT</span>
            </div>
        `;
        advisoryList.appendChild(div);
    });
}

// ============================================
// CONTACT
// ============================================

function initContact() {
    const copyBtn = document.getElementById('copyPgp');
    const form = document.getElementById('secureForm');
    const status = document.getElementById('transmissionStatus');

    copyBtn.addEventListener('click', () => {
        const key = document.getElementById('pgpKey').textContent;
        navigator.clipboard.writeText(key).then(() => {
            copyBtn.classList.add('copied');
            copyBtn.textContent = '[ COPIED ]';
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.textContent = '[ COPY_TO_CLIPBOARD ]';
            }, 2000);
        });
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        btn.classList.add('sending');

        const steps = [
            'GENERATING_EPHEMERAL_KEYPAIR...',
            'PERFORMING_X25519_KEY_EXCHANGE...',
            'DERIVING_SHARED_SECRET...',
            'ENCRYPTING_PAYLOAD_WITH_CHACHA20...',
            'APPENDING_POLY1305_TAG...',
            'ROUTING_THROUGH_MIX_NETWORK...',
            'PACKET_1_OF_3_SENT...',
            'PACKET_2_OF_3_SENT...',
            'PACKET_3_OF_3_SENT...',
            'TRANSMISSION_COMPLETE'
        ];

        for (const step of steps) {
            status.textContent = `> ${step}`;
            await sleep(400 + Math.random() * 600);
        }

        status.innerHTML = '> MESSAGE_TRANSMITTED_SECURELY<br>> AWAIT_RESPONSE_AT_DEAD_DROP';
        btn.classList.remove('sending');
        form.reset();

        setTimeout(() => {
            status.textContent = '';
        }, 10000);
    });
}

// ============================================
// GLOBAL LOOPS
// ============================================

function startGlobalLoops() {
    // Marquee
    const marqueeTexts = [
        'INITIALIZING_DEFENSE_GRID... SCANNING_PERIMETER... NO_INTRUSIONS_DETECTED',
        'HONEYPOT_07: CONNECTION_ESTABLISHED... ANALYZING_PAYLOAD... SIGNATURE_MATCHED',
        'THREAT_INTEL_FEED_UPDATED: 47 NEW IOCs DISCOVERED',
        'NEURAL_CLASSIFIER_RETRAINED: ACCURACY 99.73%',
        'TOR_CIRCUIT_ROTATED: NEW_EXIT_NODE 7F4A9E2D',
        'PEER_NODE_0x3B8F: HEARTBEAT_RECEIVED... LATENCY 23ms'
    ];

    const marqueeEl = document.getElementById('marqueeText');
    let marqueeIdx = 0;

    setInterval(() => {
        marqueeIdx = (marqueeIdx + 1) % marqueeTexts.length;
        marqueeEl.textContent = marqueeTexts[marqueeIdx];
    }, 10000);

    // Member count obfuscation
    const memberEl = document.getElementById('memberCount');
    setInterval(() => {
        memberEl.textContent = Array.from({ length: 4 }, () => Math.random() > 0.5 ? '█' : Math.floor(Math.random() * 10)).join('');
    }, 100);

    // Threat level animation
    setInterval(() => {
        const level = 6 + Math.random() * 3;
        document.getElementById('threatLevel').textContent = level.toFixed(1);
        const arc = document.getElementById('gaugeArc');
        if (arc) {
            const offset = 283 - (level / 10) * 283;
            arc.style.strokeDashoffset = offset;
        }
    }, 5000);
}

// ============================================
// UTILITIES
// ============================================

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function randomHex(len) {
    return Array.from({ length: len }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
}

function randomIp() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.x.x`;
}
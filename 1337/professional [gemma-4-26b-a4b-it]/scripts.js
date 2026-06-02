/**
 * VOID_PROTOCOL // CORE ENGINE
 * Handles real-time simulations, terminal interactions, and dynamic data injection.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & DATA ---
    const CONFIG = {
        LOG_INTERVAL: 2500,
        UPTIME_INTERVAL: 1000,
        THREAT_INTERVAL: 15000,
        IPS: ['192.168.1.104', '10.0.0.45', '172.16.254.1', '45.77.12.190', '103.22.45.11'],
        PROTOCOLS: ['TCP/IP', 'SSH', 'SSL/TLS', 'UDP', 'ICMP', 'FTP'],
        SERVICES: ['Kernel_Core', 'Auth_Service', 'DB_Root', 'Gateway_Node', 'Shadow_Proxy'],
        LOG_TEMPLATES: [
            { type: 'INFO', msg: 'Connection established with node {ip}' },
            { type: 'INFO', msg: 'Handshake complete via {proto}' },
            { type: 'WARN', msg: 'Unauthorized access attempt from {ip}' },
            { type: 'CRITICAL', msg: 'Buffer overflow detected in {service}!' },
            { type: 'INFO', msg: 'Packet sniffed: {proto} payload intercepted.' },
            { type: 'WARN', msg: 'Latency spike detected on {service}' },
            { type: 'CRITICAL', msg: 'BREACH DETECTED: {service} integrity compromised!' }
        ],
        THREAT_LEVELS: [
            { label: 'STABLE', class: 'status-online' },
            { label: 'ELEVATED', class: 'threat-high' },
            { label: 'CRITICAL', class: 'threat-high' }
        ]
    };

    // --- STATE ---
    let state = {
        startTime: Date.now(),
        currentThreatIdx: 0,
        isTerminalActive: true
    };

    // --- DOM ELEMENTS ---
    const elements = {
        threatLog: document.getElementById('threat-log'),
        uptime: document.getElementById('uptime'),
        threatLevel: document.getElementById('threat-level'),
        vulnMatrix: document.getElementById('vulnerability-matrix'),
        terminalInput: document.getElementById('terminal-input'),
        topologyMap: document.getElementById('topology-map'),
        sysStatus: document.getElementById('sys-status')
    };

    // --- CORE FUNCTIONS ---

    /**
     * Formats the uptime from milliseconds to HH:MM:SS:ms
     */
    function updateUptime() {
        const diff = Date.now() - state.startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        const ms = Math.floor((diff % 1000) / 10).toString().padStart(2, '0');
        elements.uptime.textContent = `${h}:${m}:${s}:${ms}`;
    }

    /**
     * Injects a new log entry into the terminal window
     */
    function injectLog() {
        const template = CONFIG.LOG_TEMPLATES[Math.floor(Math.random() * CONFIG.LOG_TEMPLATES.length)];
        let message = template.msg
            .replace('{ip}', CONFIG.IPS[Math.floor(Math.random() * CONFIG.IPS.length)])
            .replace('{proto}', CONFIG.PROTOCOLS[Math.floor(Math.random() * CONFIG.PROTOCOLS.length)])
            .replace('{service}', CONFIG.SERVICES[Math.floor(Math.random() * CONFIG.SERVICES.length)]);

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        // Color coding based on type
        let typeColor = 'var(--primary-cyan)';
        if (template.type === 'WARN') typeColor = 'var(--warning-amber)';
        if (template.type === 'CRITICAL') typeColor = 'var(--critical-red)';

        entry.innerHTML = `<span style="color: ${typeColor}">[${template.type}]</span> ${message}`;
        
        elements.threatLog.appendChild(entry);
        
        // Auto-scroll to bottom
        elements.threatLog.scrollTop = elements.threatLog.scrollHeight;

        // Memory management: remove old logs
        if (elements.threatLog.children.length > 50) {
            elements.threatLog.removeChild(elements.threatLog.firstChild);
        }
    }

    /**
     * Generates the vulnerability matrix items
     */
    function generateVulnerabilities() {
        const vulns = [
            { id: 'CVE-2024-01', title: 'Remote Code Execution', sev: 'critical', tag: 'CRITICAL' },
            { id: 'CVE-2024-09', title: 'SQL Injection Path', sev: 'high', tag: 'HIGH' },
            { id: 'CVE-2023-88', title: 'Cross-Site Scripting', sev: 'med', tag: 'MEDIUM' },
            { id: 'CVE-2024-12', title: 'Broken Auth Logic', sev: 'high', tag: 'HIGH' },
            { id: 'CVE-2024-04', title: 'Insecure Deserialization', sev: 'med', tag: 'MEDIUM' },
        ];

        elements.vulnMatrix.innerHTML = vulns.map(v => `
            <div class="vuln-card">
                <span class="severity-tag sev-${v.sev}">${v.tag}</span>
                <div style="font-size: 11px; color: var(--text-dim);">${v.id}</div>
                <div style="font-weight: bold; margin-top: 5px;">${v.title}</div>
            </div>
        `).join('');
    }

    /**
     * Cycles through threat levels
     */
    function cycleThreatLevel() {
        state.currentThreatIdx = (state.currentThreatIdx + 1) % CONFIG.THREAT_LEVELS.length;
        const level = CONFIG.THREAT_LEVELS[state.currentThreatIdx];
        
        elements.threatLevel.textContent = level.label;
        elements.threatLevel.className = `value ${level.class}`;

        // Visual feedback for change
        elements.threatLevel.style.animation = 'none';
        elements.threatLevel.offsetHeight; // trigger reflow
        elements.threatLevel.style.animation = 'blink 0.2s 3';
    }

    /**
     * Simulates network activity on the topology map
     */
    function simulateTopologyActivity() {
        const pulse = document.createElement('div');
        pulse.className = 'node-pulse';
        pulse.style.left = Math.random() * 80 + 10 + '%';
        pulse.style.top = Math.random() * 80 + 10 + '%';
        
        const node = document.createElement('div');
        node.className = 'node-placeholder';
        node.style.position = 'absolute';
        node.style.left = pulse.style.left;
        node.style.top = pulse.style.top;
        node.appendChild(pulse);
        
        elements.topologyMap.appendChild(node);

        // Cleanup
        setTimeout(() => {
            node.remove();
        }, 2000);
    }

    /**
     * Handles command line interaction
     */
    function handleCommand(cmd) {
        const cleanCmd = cmd.toLowerCase().trim();
        const response = document.createElement('div');
        response.className = 'log-entry';
        response.style.color = 'var(--text-dim)';

        let output = '';

        switch(cleanCmd) {
            case 'help':
                output = 'AVAILABLE_COMMANDS: [STATUS, CLEAR, WHOAMI, EXIT, SCAN]';
                break;
            case 'status':
                output = `SYSTEM: ACTIVE | UPTIME: ${elements.uptime.textContent} | THREAT: ${elements.threatLevel.textContent}`;
                break;
            case 'whoami':
                output = 'USER: GUEST_OPERATOR_01 | PERMS: READ_ONLY';
                break;
            case 'clear':
                elements.threatLog.innerHTML = '';
                output = 'LOGS_PURGED';
                break;
            case 'scan':
                output = 'INITIALIZING_NETWORK_SCAN... [OK]';
                injectLog(); // Trigger a log event as response
                break;
            case 'exit':
                output = 'TERMINATING_SESSION... BYE.';
                state.isTerminalActive = false;
                break;
            default:
                output = `COMMAND_NOT_FOUND: ${cleanCmd}`;
        }

        response.textContent = `> ${output}`;
        elements.threatLog.appendChild(response);
        elements.threatLog.scrollTop = elements.threatLog.scrollHeight;
    }

    // --- INITIALIZATION ---

    function init() {
        // Start intervals
        setInterval(updateUptime, CONFIG.UPTIME_INTERVAL);
        setInterval(injectLog, CONFIG.LOG_INTERVAL);
        setInterval(cycleThreatLevel, CONFIG.THREAT_INTERVAL);
        setInterval(simulateTopologyActivity, 3000);

        // Initial population
        generateVulnerabilities();
        injectLog();
        injectLog();

        // Event Listeners
        elements.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && state.isTerminalActive) {
                const val = elements.terminalInput.value;
                handleCommand(val);
                elements.terminalInput.value = '';
            }
        });

        // Focus input automatically
        document.addEventListener('click', () => {
            if(state.isTerminalActive) elements.terminalInput.focus();
        });

        console.log("%c VOID_PROTOCOL // KERNEL LOADED ", "background: #32ff7e; color: #000; font-weight: bold;");
    }

    init();
});
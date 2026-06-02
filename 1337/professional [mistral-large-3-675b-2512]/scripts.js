// ===== GLOBAL VARIABLES =====
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.querySelector('.command-input');
const threatFeed = document.getElementById('threat-feed');
const networkSvg = document.getElementById('network-svg');
const decryptBtn = document.getElementById('decrypt-btn');
const encryptedText = document.getElementById('encrypted-text');
const decryptedText = document.getElementById('decrypted-text');
const gaugeNeedle = document.getElementById('gauge-needle');
const gaugeValue = document.getElementById('gauge-value');
const connectionStatus = document.getElementById('connection-status');
const lastUpdate = document.getElementById('last-update');
const threatsCounter = document.getElementById('threats-counter');

// Sample data for threats and network
const threatData = [
    { timestamp: "23:47:12", source: "192.168.1.103", type: "BRUTE_FORCE", severity: "high" },
    { timestamp: "23:46:55", source: "203.0.113.45", type: "SQL_INJECTION", severity: "critical" },
    { timestamp: "23:45:30", source: "185.143.223.42", type: "PORT_SCAN", severity: "medium" },
    { timestamp: "23:44:10", source: "10.0.0.5", type: "XSS_ATTEMPT", severity: "low" },
    { timestamp: "23:43:05", source: "172.16.0.1", type: "MALWARE", severity: "critical" },
    { timestamp: "23:42:20", source: "198.51.100.23", type: "PHISHING", severity: "high" },
];

const networkNodes = [
    { id: "node1", x: 100, y: 200, connectedTo: ["node2", "node3"] },
    { id: "node2", x: 300, y: 100, connectedTo: ["node1", "node4"] },
    { id: "node3", x: 300, y: 300, connectedTo: ["node1", "node4"] },
    { id: "node4", x: 500, y: 200, connectedTo: ["node2", "node3", "node5"] },
    { id: "node5", x: 700, y: 200, connectedTo: ["node4"] },
];

// ===== TERMINAL INTRO ANIMATION =====
function animateTerminalIntro() {
    const lines = [
        "> INITIALIZING NEON TERMINAL...",
        "> LOADING SECURITY PROTOCOLS... [OK]",
        "> ESTABLISHING CONNECTION TO DARKNET... [OK]",
        "> SCANNING FOR VULNERABILITIES... 100%",
        "> ACCESS GRANTED. WELCOME, USER."
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < lines.length) {
            const p = document.createElement('p');
            p.className = 'terminal-line';
            p.textContent = lines[i];
            terminalOutput.appendChild(p);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
            enableTerminalInput();
        }
    }, 1000);
}

// ===== TERMINAL COMMAND INPUT =====
function enableTerminalInput() {
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            commandInput.value = '';

            const p = document.createElement('p');
            p.className = 'terminal-line';
            p.innerHTML = `<span class="prompt">$</span> ${command}`;
            terminalOutput.appendChild(p);

            // Simulate command output
            setTimeout(() => {
                const output = document.createElement('p');
                output.className = 'terminal-line';
                if (command.toLowerCase() === 'help') {
                    output.textContent = "Available commands: scan, threats, network, decrypt, clear";
                } else if (command.toLowerCase() === 'scan') {
                    output.textContent = "> SCANNING NETWORK... [5 DEVICES FOUND]";
                } else if (command.toLowerCase() === 'clear') {
                    terminalOutput.innerHTML = '';
                    return;
                } else {
                    output.textContent = `Command not found: ${command}`;
                }
                terminalOutput.appendChild(output);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, 500);
        }
    });
}

// ===== LIVE THREAT FEED =====
function populateThreatFeed() {
    threatFeed.innerHTML = '';
    threatData.forEach(threat => {
        const div = document.createElement('div');
        div.className = 'feed-line';
        div.innerHTML = `
            <span>${threat.timestamp}</span>
            <span>${threat.source}</span>
            <span>${threat.type}</span>
            <span class="severity-${threat.severity}">${threat.severity.toUpperCase()}</span>
        `;
        threatFeed.appendChild(div);
    });

    // Simulate new threats
    setInterval(() => {
        const newThreat = {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            source: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
            type: ["BRUTE_FORCE", "SQL_INJECTION", "PORT_SCAN", "XSS_ATTEMPT", "MALWARE"][Math.floor(Math.random() * 5)],
            severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)]
        };

        const div = document.createElement('div');
        div.className = 'feed-line';
        div.innerHTML = `
            <span>${newThreat.timestamp}</span>
            <span>${newThreat.source}</span>
            <span>${newThreat.type}</span>
            <span class="severity-${newThreat.severity}">${newThreat.severity.toUpperCase()}</span>
        `;

        threatFeed.insertBefore(div, threatFeed.firstChild);
        threatsCounter.textContent = parseInt(threatsCounter.textContent) + 1;
        lastUpdate.textContent = newThreat.timestamp;

        // Remove oldest threat if too many
        if (threatFeed.children.length > 10) {
            threatFeed.removeChild(threatFeed.lastChild);
        }
    }, 3000);
}

// ===== NETWORK TOPOLOGY =====
function drawNetworkTopology() {
    // Draw edges
    networkNodes.forEach(node => {
        node.connectedTo.forEach(connectedId => {
            const connectedNode = networkNodes.find(n => n.id === connectedId);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", node.x);
            line.setAttribute("y1", node.y);
            line.setAttribute("x2", connectedNode.x);
            line.setAttribute("y2", connectedNode.y);
            line.setAttribute("class", "network-edge");
            networkSvg.appendChild(line);
        });
    });

    // Draw nodes
    networkNodes.forEach(node => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 8);
        circle.setAttribute("class", "network-node");
        circle.setAttribute("id", node.id);
        networkSvg.appendChild(circle);

        // Pulsing animation
        setInterval(() => {
            circle.setAttribute("r", Math.random() > 0.5 ? 8 : 10);
        }, 1000 + Math.random() * 2000);
    });
}

// ===== ENCRYPTED MESSAGE =====
function setupDecryption() {
    decryptBtn.addEventListener('click', () => {
        const hexString = encryptedText.textContent.replace(/\s/g, '');
        let decrypted = '';

        // Convert hex to ASCII
        for (let i = 0; i < hexString.length; i += 2) {
            const hexByte = hexString.substr(i, 2);
            decrypted += String.fromCharCode(parseInt(hexByte, 16));
        }

        decryptedText.textContent = decrypted;
        decryptBtn.textContent = "RE-ENCRYPT";
        decryptBtn.onclick = reEncrypt;
    });
}

function reEncrypt() {
    decryptedText.textContent = '';
    decryptBtn.textContent = "DECRYPT";
    decryptBtn.onclick = setupDecryption;
}

// ===== VULNERABILITY GAUGE =====
function animateVulnerabilityGauge() {
    // Simulate random CVSS score between 4.0 and 9.5
    const randomScore = (4 + Math.random() * 5.5).toFixed(1);
    gaugeValue.textContent = randomScore;

    // Convert score to angle (0-180 degrees)
    const angle = (randomScore / 10) * 180 - 90;
    gaugeNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    // Update every 5 seconds
    setInterval(() => {
        const newScore = (4 + Math.random() * 5.5).toFixed(1);
        gaugeValue.textContent = newScore;
        const newAngle = (newScore / 10) * 180 - 90;
        gaugeNeedle.style.transform = `translateX(-50%) rotate(${newAngle}deg)`;
    }, 5000);
}

// ===== STATUS BAR UPDATES =====
function updateStatusBar() {
    setInterval(() => {
        const now = new Date();
        lastUpdate.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);

    // Simulate connection drops
    setInterval(() => {
        const isSecure = connectionStatus.textContent === "SECURE";
        connectionStatus.textContent = isSecure ? "UNSTABLE" : "SECURE";
        connectionStatus.style.color = isSecure ? "#ff3300" : "#00ff41";
    }, 15000);
}

// ===== INITIALIZE ALL FUNCTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    animateTerminalIntro();
    populateThreatFeed();
    drawNetworkTopology();
    setupDecryption();
    animateVulnerabilityGauge();
    updateStatusBar();
});
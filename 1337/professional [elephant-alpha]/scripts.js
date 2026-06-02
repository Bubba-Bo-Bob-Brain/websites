// scripts.js

// Threat feed data
const threatFeedData = [
    { time: "14:23:01", type: "INTRUSION", source: "192.168.1.100", target: "SERVER-01", severity: "high" },
    { time: "14:22:45", type: "PORT SCAN", source: "10.0.0.55", target: "FIREWALL", severity: "medium" },
    { time: "14:22:30", type: "MALWARE", source: "EMAIL.ATTACHMENT", target: "WORKSTATION-07", severity: "critical" },
    { time: "14:21:55", type: "BRUTE FORCE", source: "203.0.113.42", target: "SSH-SERVER", severity: "high" },
    { time: "14:21:30", type: "DATA EXFILTRATION", source: "INSIDER-003", target: "DATABASE", severity: "critical" }
];

// Audit log data
const auditLogData = [
    { time: "14:23:01", level: "info", message: "System initialization complete" },
    { time: "14:22:15", level: "warning", message: "Unusual network traffic detected" },
    { time: "14:21:45", level: "error", message: "Failed authentication attempt from 192.168.1.100" },
    { time: "14:20:30", level: "info", message: "Security protocols updated successfully" },
    { time: "14:19:55", level: "warning", message: "Memory usage exceeding threshold" },
    { time: "14:18:22", level: "info", message: "Backup process initiated" },
    { time: "14:17:10", level: "error", message: "Disk space low on partition /dev/sda1" },
    { time: "14:16:45", level: "info", message: "User authentication successful" }
];

// Initialize threat feed
function initThreatFeed() {
    const feedContainer = document.getElementById('threatFeed');
    feedContainer.innerHTML = '';
    
    threatFeedData.forEach((threat, index) => {
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.style.animationDelay = `${index * 0.1}s`;
        
        let severityClass = '';
        let severityIcon = '⚠';
        if (threat.severity === 'critical') severityClass = 'critical';
        else if (threat.severity === 'high') severityClass = 'high';
        else if (threat.severity === 'medium') severityClass = 'medium';
        
        feedItem.innerHTML = `
            <span class="time">[${threat.time}]</span>
            <span class="severity ${severityClass}">${severityIcon} ${threat.type}</span>
            <span>from ${threat.source} → ${threat.target}</span>
        `;
        
        feedContainer.appendChild(feedItem);
    });
}

// Initialize audit log
function initAuditLog() {
    const logContainer = document.getElementById('auditLog');
    logContainer.innerHTML = '';
    
    auditLogData.forEach((log, index) => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.style.animationDelay = `${index * 0.1}s`;
        
        let levelClass = '';
        if (log.level === 'error') levelClass = 'log-level-error';
        else if (log.level === 'warning') levelClass = 'log-level-warning';
        else levelClass = 'log-level-info';
        
        logEntry.innerHTML = `
            <span class="log-time">${log.time}</span>
            <span class="${levelClass}">[${log.level.toUpperCase()}]</span>
            ${log.message}
        `;
        
        logContainer.appendChild(logEntry);
    });
}

// Decrypt message function
function decryptMessage() {
    const encryptedMsg = document.getElementById('encryptedMsg');
    const decryptedMsg = document.getElementById('decryptedMsg');
    const hiddenMessages = document.getElementById('hiddenMessages');
    
    // Add decryption animation
    encryptedMsg.style.opacity = '0.5';
    encryptedMsg.style.textDecoration = 'line-through';
    
    setTimeout(() => {
        // Get random decrypted message
        const messages = hiddenMessages.children;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        decryptedMsg.textContent = randomMessage.textContent;
        decryptedMsg.style.animation = 'none';
        decryptedMsg.style.opacity = '0';
        setTimeout(() => {
            decryptedMsg.style.animation = 'decrypt-reveal 1s ease forwards';
            decryptedMsg.style.opacity = '1';
        }, 50);
        
        // Reset after delay
        setTimeout(() => {
            encryptedMsg.style.opacity = '1';
            encryptedMsg.style.textDecoration = 'none';
        }, 5000);
    }, 1500);
}

// Execute command function
function executeCommand() {
    const input = document.getElementById('commandInput');
    const command = input.value.trim().toLowerCase();
    const prompt = document.querySelector('.command-line .prompt');
    
    if (command) {
        // Add command to terminal
        const commandLine = document.querySelector('.command-line');
        const newCommand = document.createElement('div');
        newCommand.className = 'command-line';
        newCommand.innerHTML = `<span class="prompt">${prompt.textContent}</span><span>${command}</span><span class="cursor"></span>`;
        commandLine.parentNode.insertBefore(newCommand, commandLine.nextSibling);
        
        // Process command
        processCommand(command);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

// Process commands
function processCommand(command) {
    const commandLine = document.querySelector('.command-line');
    
    setTimeout(() => {
        const response = document.createElement('div');
        response.className = 'command-line';
        
        switch(command) {
            case 'status':
                response.innerHTML = '<span class="prompt">root@hackforce:~$</span><span>System operational. 3 threats detected.</span><span class="cursor"></span>';
                break;
            case 'scan':
                response.innerHTML = '<span class="prompt">root@hackforce:~$</span><span>Scanning network... Vulnerabilities found: 4</span><span class="cursor"></span>';
                break;
            case 'decrypt':
                decryptMessage();
                response.innerHTML = '<span class="prompt">root@hackforce:~$</span><span>Decryption initiated...</span><span class="cursor"></span>';
                break;
            case 'help':
                response.innerHTML = '<span class="prompt">root@hackforce:~$</span><span>Available commands: status, scan, decrypt, help, clear</span><span class="cursor"></span>';
                break;
            case 'clear':
                document.querySelectorAll('.command-line').forEach(el => {
                    if(el !== document.querySelector('.command-line')) el.remove();
                });
                response.remove();
                return;
            default:
                response.innerHTML = `<span class="prompt">root@hackforce:~$</span><span>Command not recognized: ${command}</span><span class="cursor"></span>`;
        }
        
        commandLine.parentNode.insertBefore(response, commandLine.nextSibling);
        scrollToBottom();
    }, 300);
}

// Scroll to bottom function
function scrollToBottom() {
    const terminalBody = document.querySelector('.terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Add keyboard support
document.addEventListener('DOMContentLoaded', function() {
    initThreatFeed();
    initAuditLog();
    
    const commandInput = document.getElementById('commandInput');
    
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            executeCommand();
        }
    });
    
    // Add some random threat updates
    setInterval(() => {
        const newThreats = [
            { time: new Date().toISOString().substr(11, 8), type: "PROBE", source: "203.0.113." + Math.floor(Math.random() * 255), target: "FIREWALL", severity: "low" },
            { time: new Date().toISOString().substr(11, 8), type: "ANOMALY", source: "NETWORK", target: "SERVER-02", severity: "medium" }
        ];
        
        const threat = newThreats[Math.floor(Math.random() * newThreats.length)];
        threatFeedData.unshift(threat);
        if (threatFeedData.length > 10) threatFeedData.pop();
        
        initThreatFeed();
    }, 15000);
});

// Add loading animation
window.addEventListener('load', function() {
    // Simulate boot sequence
    setTimeout(() => {
        document.querySelector('.terminal-title').style.color = 'var(--neon-lime)';
        document.querySelector('.terminal-title').style.textShadow = '0 0 10px var(--neon-lime)';
    }, 1000);
});
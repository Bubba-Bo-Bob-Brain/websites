// ===== DOM ELEMENTS =====
const heroTitle = document.querySelector('.typing-effect');
const blinkingCursor = document.querySelector('.blinking-cursor');
const feedContainer = document.querySelector('.feed-container');
const decryptBtn = document.getElementById('decryptBtn');
const encryptedText = document.getElementById('encryptedText');
const decryptedText = document.getElementById('decryptedText');
const meterFills = document.querySelectorAll('.meter-fill');
const asciiDiagram = document.querySelector('.ascii-diagram');
const logContainer = document.querySelector('.log-container');
const footerGlitch = document.getElementById('footerGlitch');

// ===== TYPING ANIMATION =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--primary)';
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            element.style.borderRight = 'none';
        }
    }, speed);
}

// Initialize typing effect for hero title
const heroText = "ACCESS GRANTED: WELCOME TO THE NEONSHIELD TERMINAL";
typeWriter(heroTitle, heroText, 30);

// ===== BLINKING CURSOR =====
setInterval(() => {
    blinkingCursor.style.opacity = blinkingCursor.style.opacity === '0' ? '1' : '0';
}, 500);

// ===== LIVE THREAT FEED =====
const threatMessages = [
    { time: "[2024-05-20 14:35:00]", severity: "critical", message: "Zero-day exploit in OpenSSL (CVE-2024-5678)" },
    { time: "[2024-05-20 14:34:22]", severity: "high", message: "DDoS attack detected from 192.168.1.101" },
    { time: "[2024-05-20 14:33:15]", severity: "medium", message: "Suspicious login attempt from Tor exit node" },
    { time: "[2024-05-20 14:32:40]", severity: "low", message: "Outdated software detected on workstation-03" },
    { time: "[2024-05-20 14:31:55]", severity: "critical", message: "Ransomware encryption in progress on /fileserver" },
    { time: "[2024-05-20 14:30:10]", severity: "high", message: "Port scan detected from 203.0.113.45" },
    { time: "[2024-05-20 14:29:30]", severity: "medium", message: "Phishing email reported by user@company.com" },
    { time: "[2024-05-20 14:28:05]", severity: "low", message: "New malware signature update available" }
];

// Function to add a new threat feed entry
function addThreatEntry() {
    const randomIndex = Math.floor(Math.random() * threatMessages.length);
    const { time, severity, message } = threatMessages[randomIndex];

    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.innerHTML = `
        <span class="timestamp">${time}</span>
        <span class="severity ${severity}">${severity.toUpperCase()}</span>
        <span class="message">${message}</span>
    `;

    feedContainer.prepend(feedItem);

    // Remove oldest entry if feed exceeds 8 items
    if (feedContainer.children.length > 8) {
        feedContainer.removeChild(feedContainer.lastChild);
    }
}

// Add initial feed entries
threatMessages.slice(0, 5).reverse().forEach(msg => {
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.innerHTML = `
        <span class="timestamp">${msg.time}</span>
        <span class="severity ${msg.severity}">${msg.severity.toUpperCase()}</span>
        <span class="message">${msg.message}</span>
    `;
    feedContainer.appendChild(feedItem);
});

// Simulate live updates every 3 seconds
setInterval(addThreatEntry, 3000);

// Auto-scroll feed container to top when new entry is added
feedContainer.addEventListener('DOMNodeInserted', () => {
    feedContainer.scrollTop = 0;
});

// ===== DECRYPT BUTTON =====
decryptBtn.addEventListener('click', () => {
    // Glitch effect on encrypted text
    encryptedText.style.animation = 'glitch 0.3s ease';
    setTimeout(() => {
        encryptedText.style.animation = 'none';
        encryptedText.classList.add('hidden');
        decryptedText.classList.remove('hidden');
        decryptBtn.textContent = '// MESSAGE DECRYPTED';
        decryptBtn.style.background = 'rgba(0, 255, 65, 0.2)';
        decryptBtn.style.borderColor = 'var(--primary-dark)';
    }, 300);
});

// ===== VULNERABILITY METER ANIMATION =====
function animateMeterFills() {
    meterFills.forEach(fill => {
        const severity = fill.getAttribute('data-severity');
        let width;

        switch (severity) {
            case 'critical': width = '30%'; break;
            case 'high': width = '25%'; break;
            case 'medium': width = '20%'; break;
            case 'low': width = '25%'; break;
            default: width = '0%';
        }

        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, 100);
    });
}

// Initialize meter animation
animateMeterFills();

// ===== NETWORK TOPOLOGY ANIMATION =====
function animateNetworkNodes() {
    const lines = asciiDiagram.textContent.split('\n');
    let updatedLines = lines.map(line => {
        // Randomly highlight nodes (WEB SERVER, DB SERVER, etc.)
        if (line.includes('SERVER') || line.includes('ROUTER') || line.includes('FIREWALL')) {
            if (Math.random() > 0.7) {
                return line.replace(/(SERVER|ROUTER|FIREWALL)/, '<span class="node-active">$1</span>');
            }
        }
        return line;
    });

    asciiDiagram.innerHTML = updatedLines.join('\n');
    setTimeout(animateNetworkNodes, 1500);
}

// Start network animation
animateNetworkNodes();

// Add CSS for active nodes dynamically
const style = document.createElement('style');
style.textContent = `
    .node-active {
        color: var(--warning) !important;
        text-shadow: 0 0 10px var(--warning) !important;
        animation: pulse 1s infinite;
    }
`;
document.head.appendChild(style);

// ===== AUDIT LOG UPDATES =====
const logEntries = [
    { time: "[2024-05-20 14:36:00]", action: "LOGIN ATTEMPT", user: "user: admin", status: "success" },
    { time: "[2024-05-20 14:35:45]", action: "FIREWALL RULE UPDATE", user: "user: root", status: "success" },
    { time: "[2024-05-20 14:35:30]", action: "INTRUSION DETECTED", user: "user: unknown", status: "failure" },
    { time: "[2024-05-20 14:35:15]", action: "BACKUP INITIATED", user: "user: system", status: "success" },
    { time: "[2024-05-20 14:35:00]", action: "MALWARE SCAN", user: "user: scanner", status: "warning" }
];

// Function to add a new log entry
function addLogEntry() {
    const randomIndex = Math.floor(Math.random() * logEntries.length);
    const { time, action, user, status } = logEntries[randomIndex];

    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-timestamp">${time}</span>
        <span class="log-action">${action}</span>
        <span class="log-user">${user}</span>
        <span class="log-status ${status}">${status.toUpperCase()}</span>
    `;

    logContainer.prepend(logEntry);

    // Remove oldest entry if log exceeds 8 items
    if (logContainer.children.length > 8) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// Add initial log entries
logEntries.slice(0, 5).reverse().forEach(entry => {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-timestamp">${entry.time}</span>
        <span class="log-action">${entry.action}</span>
        <span class="log-user">${entry.user}</span>
        <span class="log-status ${entry.status}">${entry.status.toUpperCase()}</span>
    `;
    logContainer.appendChild(logEntry);
});

// Simulate live log updates every 4 seconds
setInterval(addLogEntry, 4000);

// ===== RANDOM GLITCH EFFECTS =====
function randomGlitch() {
    const elements = document.querySelectorAll('.section-title, .logo, .hero-subtitle');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];

    randomElement.style.animation = 'glitch 0.2s ease';
    setTimeout(() => {
        randomElement.style.animation = 'none';
    }, 200);
}

// Trigger random glitch every 5-10 seconds
setInterval(randomGlitch, Math.random() * 5000 + 5000);

// ===== FOOTER GLITCH EFFECT =====
setInterval(() => {
    footerGlitch.style.animation = 'none';
    setTimeout(() => {
        footerGlitch.style.animation = 'glitch 0.5s ease';
    }, 10);
}, 3000);
// scripts.js

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initMatrixBackground();
    initAttackMap();
    initLogFeed();
    initTerminalCommands();
    initGlitchText();
    
    // Simulate real-time updates
    setInterval(updateThreatStats, 3000);
    setInterval(addLogEntry, 5000);
});

// Matrix background effect
function initMatrixBackground() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Create drops for each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    // Draw function
    function draw() {
        // Semi-transparent black overlay to create fading effect
        ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#39ff14';
        ctx.font = `${fontSize}px 'Share Tech Mono'`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset drop if it reaches the bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Animation loop
    setInterval(draw, 33);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Attack map visualization
function initAttackMap() {
    const mapContainer = document.getElementById('attackMap');
    mapContainer.innerHTML = '';
    
    // Create a simple world map representation
    const countries = [
        { name: 'US', x: 20, y: 35, attacks: 0 },
        { name: 'UK', x: 45, y: 30, attacks: 0 },
        { name: 'Germany', x: 50, y: 32, attacks: 0 },
        { name: 'China', x: 75, y: 40, attacks: 0 },
        { name: 'Russia', x: 65, y: 25, attacks: 0 },
        { name: 'Japan', x: 80, y: 45, attacks: 0 },
        { name: 'Brazil', x: 30, y: 70, attacks: 0 },
        { name: 'Australia', x: 85, y: 80, attacks: 0 }
    ];
    
    // Draw map background
    const mapBg = document.createElement('div');
    mapBg.className = 'map-background';
    mapBg.style.width = '100%';
    mapBg.style.height = '100%';
    mapBg.style.position = 'relative';
    mapBg.style.background = 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, rgba(10, 14, 23, 0.8) 70%)';
    mapContainer.appendChild(mapBg);
    
    // Draw country markers
    countries.forEach(country => {
        const marker = document.createElement('div');
        marker.className = 'country-marker';
        marker.style.position = 'absolute';
        marker.style.left = `${country.x}%`;
        marker.style.top = `${country.y}%`;
        marker.style.width = '8px';
        marker.style.height = '8px';
        marker.style.borderRadius = '50%';
        marker.style.backgroundColor = '#39ff14';
        marker.style.boxShadow = '0 0 10px #39ff14';
        marker.dataset.name = country.name;
        marker.dataset.attacks = country.attacks;
        mapBg.appendChild(marker);
    });
    
    // Animate attacks
    setInterval(() => {
        const markers = document.querySelectorAll('.country-marker');
        markers.forEach(marker => {
            if (Math.random() > 0.7) {
                // Flash effect
                marker.style.transform = 'scale(2)';
                marker.style.backgroundColor = '#ff003c';
                marker.style.boxShadow = '0 0 15px #ff003c';
                
                setTimeout(() => {
                    marker.style.transform = 'scale(1)';
                    marker.style.backgroundColor = '#39ff14';
                    marker.style.boxShadow = '0 0 10px #39ff14';
                }, 300);
                
                // Update attack count
                let attacks = parseInt(marker.dataset.attacks) + 1;
                marker.dataset.attacks = attacks;
            }
        });
    }, 2000);
}

// Real-time threat statistics
function updateThreatStats() {
    const attacksElement = document.getElementById('attacksDetected');
    const blockedElement = document.getElementById('threatsBlocked');
    
    // Get current values
    let currentAttacks = parseInt(attacksElement.textContent);
    let currentBlocked = parseInt(blockedElement.textContent);
    
    // Increment randomly
    const newAttacks = Math.floor(Math.random() * 5) + 1;
    const newBlocked = Math.floor(Math.random() * 3) + 1;
    
    // Animate counters
    animateValue(attacksElement, currentAttacks, currentAttacks + newAttacks, 1000);
    animateValue(blockedElement, currentBlocked, currentBlocked + newBlocked, 1000);
}

// Animated counter function
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        }
    }, 16);
}

// Security log feed
function initLogFeed() {
    const logFeed = document.getElementById('logFeed');
    logFeed.innerHTML = '';
    
    // Initial log entries
    const initialLogs = [
        { time: '10:23:45', level: 'info', message: 'System initialized - Security protocols active' },
        { time: '10:24:12', level: 'warning', message: 'Unusual traffic pattern detected from 192.168.1.105' },
        { time: '10:25:33', level: 'info', message: 'Firewall updated with latest threat definitions' },
        { time: '10:26:01', level: 'critical', message: 'Intrusion attempt blocked - Source IP: 203.45.67.89' },
        { time: '10:27:45', level: 'info', message: 'Vulnerability scan completed - 3 medium risks identified' }
    ];
    
    initialLogs.forEach(log => {
        addLogEntryToFeed(log.time, log.level, log.message);
    });
}

// Add a new log entry
function addLogEntry() {
    const levels = ['info', 'warning', 'critical'];
    const messages = [
        'User authentication successful - admin access granted',
        'Port scan detected from external source',
        'Malware signature updated in real-time database',
        'Suspicious file upload blocked - potential exploit',
        'DDoS protection activated - mitigating attack',
        'SSL certificate renewed automatically',
        'Database backup completed successfully',
        'Unauthorized access attempt from unknown device'
    ];
    
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const time = new Date().toLocaleTimeString();
    
    addLogEntryToFeed(time, randomLevel, randomMessage);
}

// Add log entry to feed
function addLogEntryToFeed(time, level, message) {
    const logFeed = document.getElementById('logFeed');
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    const timestamp = document.createElement('div');
    timestamp.className = 'log-timestamp';
    timestamp.textContent = `[${time}]`;
    
    const logMessage = document.createElement('div');
    logMessage.className = `log-message ${level}`;
    logMessage.textContent = message;
    
    logEntry.appendChild(timestamp);
    logEntry.appendChild(logMessage);
    
    logFeed.prepend(logEntry);
    
    // Remove oldest entry if too many
    if (logFeed.children.length > 20) {
        logFeed.removeChild(logFeed.lastChild);
    }
    
    // Scroll to top
    logFeed.scrollTop = 0;
}

// Terminal command handling
function initTerminalCommands() {
    const commandInput = document.getElementById('commandInput');
    
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            processCommand(this.value);
            this.value = '';
        }
    });
}

// Process terminal commands
function processCommand(command) {
    const logFeed = document.getElementById('logFeed');
    const time = new Date().toLocaleTimeString();
    
    // Create command echo
    const echoEntry = document.createElement('div');
    echoEntry.className = 'log-entry';
    
    const echoTimestamp = document.createElement('div');
    echoTimestamp.className = 'log-timestamp';
    echoTimestamp.textContent = `[${time}]`;
    
    const echoMessage = document.createElement('div');
    echoMessage.className = 'log-message info';
    echoMessage.textContent = `$ ${command}`;
    
    echoEntry.appendChild(echoTimestamp);
    echoEntry.appendChild(echoMessage);
    logFeed.prepend(echoEntry);
    
    // Process command
    let response = '';
    let level = 'info';
    
    switch(command.toLowerCase()) {
        case 'help':
            response = 'Available commands: help, status, stats, clear, whoami, version';
            break;
        case 'status':
            response = 'System status: OPERATIONAL | Threat level: MEDIUM | Last scan: 2 minutes ago';
            break;
        case 'stats':
            const attacks = document.getElementById('attacksDetected').textContent;
            const blocked = document.getElementById('threatsBlocked').textContent;
            response = `Attacks detected: ${attacks} | Threats blocked: ${blocked}`;
            break;
        case 'clear':
            document.getElementById('logFeed').innerHTML = '';
            return;
        case 'whoami':
            response = 'USER: security_admin | ACCESS_LEVEL: 5 | PERMISSIONS: ALL_SYSTEMS';
            break;
        case 'version':
            response = 'Hacker\'s Haven Security Console v2.3.7';
            break;
        default:
            response = `Command not recognized: ${command}. Type 'help' for available commands.`;
            level = 'warning';
    }
    
    // Add response
    const responseEntry = document.createElement('div');
    responseEntry.className = 'log-entry';
    
    const responseTimestamp = document.createElement('div');
    responseTimestamp.className = 'log-timestamp';
    responseTimestamp.textContent = `[${time}]`;
    
    const responseMessage = document.createElement('div');
    responseMessage.className = `log-message ${level}`;
    responseMessage.textContent = response;
    
    responseEntry.appendChild(responseTimestamp);
    responseEntry.appendChild(responseMessage);
    logFeed.prepend(responseEntry);
    
    // Remove oldest entry if too many
    if (logFeed.children.length > 20) {
        logFeed.removeChild(logFeed.lastChild);
    }
    
    // Scroll to top
    logFeed.scrollTop = 0;
}

// Glitch text effect for title
function initGlitchText() {
    const title = document.querySelector('.glitch');
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            title.classList.add('glitch-active');
            setTimeout(() => {
                title.classList.remove('glitch-active');
            }, 200);
        }
    }, 3000);
}

// Add active class for glitch effect
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .glitch-active::before {
            animation: glitch-anim 0.3s linear;
        }
        .glitch-active::after {
            animation: glitch-anim2 0.3s linear;
        }
    </style>
`);
// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initGlitchEffects();
    initSurveillanceFeeds();
    initThreatNotifications();
    initDataStream();
    initMapInteractivity();
    initNavHighlighting();
    
    // Set up periodic system updates
    setInterval(updateSystemStatus, 10000);
    setInterval(updateDataStream, 3000);
});

// Glitch effect for navigation links
function initGlitchEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('glitch-active');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('glitch-active');
        });
    });
}

// Surveillance feed interactions
function initSurveillanceFeeds() {
    const feedCards = document.querySelectorAll('.feed-card');
    
    feedCards.forEach(card => {
        // Add hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
        
        // Simulate feed status changes
        setInterval(() => {
            if (Math.random() > 0.7) {
                const statusElement = card.querySelector('.feed-status');
                const statuses = ['online', 'warning', 'offline'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                // Reset classes
                statusElement.className = 'feed-status';
                statusElement.classList.add(randomStatus);
                
                // Update text
                statusElement.textContent = randomStatus.toUpperCase();
            }
        }, 15000);
    });
}

// Threat notification system
function initThreatNotifications() {
    const notifications = document.querySelectorAll('.notification-item');
    
    // Add pulsing effect to critical threats
    setInterval(() => {
        notifications.forEach(notification => {
            if (notification.classList.contains('critical')) {
                notification.style.boxShadow = '0 0 10px rgba(255, 0, 60, 0.5)';
                setTimeout(() => {
                    notification.style.boxShadow = 'none';
                }, 500);
            }
        });
    }, 3000);
    
    // Simulate new threat alerts
    setInterval(createNewThreat, 20000);
}

// Create a new threat notification
function createNewThreat() {
    const threatList = document.querySelector('.notification-list');
    const threatTypes = [
        { level: 'critical', text: 'RESISTANCE CELL ACTIVITY DETECTED IN SECTOR 5-E' },
        { level: 'high', text: 'UNAUTHORIZED NETWORK ACCESS ATTEMPT' },
        { level: 'medium', text: 'SUSPICIOUS PACKAGE DELIVERY TO RESIDENTIAL BLOCK D' }
    ];
    
    const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    
    const newItem = document.createElement('li');
    newItem.className = `notification-item ${randomThreat.level}`;
    newItem.innerHTML = `
        <div class="notification-header">
            <span class="notification-type">${randomThreat.level.toUpperCase()}</span>
            <span class="notification-time">${getCurrentTime()}</span>
        </div>
        <div class="notification-content">
            ${randomThreat.text}
        </div>
    `;
    
    // Add to top of list
    threatList.insertBefore(newItem, threatList.firstChild);
    
    // Remove oldest item if more than 5
    if (threatList.children.length > 5) {
        threatList.removeChild(threatList.lastChild);
    }
    
    // Animate new item
    newItem.style.opacity = '0';
    newItem.style.transform = 'translateX(20px)';
    setTimeout(() => {
        newItem.style.transition = 'all 0.5s ease';
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateX(0)';
    }, 10);
}

// Get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} HRS`;
}

// Data stream simulation
function initDataStream() {
    const binaryColumns = document.querySelectorAll('.binary-column');
    
    // Initialize with random binary strings
    binaryColumns.forEach(column => {
        column.textContent = generateBinaryString(80);
    });
}

// Update data stream periodically
function updateDataStream() {
    const binaryColumns = document.querySelectorAll('.binary-column');
    
    binaryColumns.forEach(column => {
        // Shift content and add new line
        const lines = column.textContent.split('\n');
        lines.shift(); // Remove first line
        lines.push(generateBinaryString(80)); // Add new line
        column.textContent = lines.join('\n');
    });
    
    // Occasionally corrupt some data
    if (Math.random() > 0.8) {
        const redactedLines = document.querySelectorAll('.redacted-line');
        const randomLine = redactedLines[Math.floor(Math.random() * redactedLines.length)];
        randomLine.textContent = '[CORRUPTED] ' + generateRandomText(20);
        randomLine.style.color = '#ff0055';
        
        setTimeout(() => {
            randomLine.style.color = '';
        }, 2000);
    }
}

// Generate random binary string
function generateBinaryString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.round(Math.random());
    }
    return result;
}

// Generate random text for corruption
function generateRandomText(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Interactive map sectors
function initMapInteractivity() {
    const sectors = document.querySelectorAll('.map-sector');
    
    sectors.forEach(sector => {
        sector.addEventListener('click', function() {
            // Remove highlight from all sectors
            sectors.forEach(s => s.classList.remove('highlighted'));
            
            // Highlight clicked sector
            this.classList.add('highlighted');
            
            // Show sector details (in a real app, this would fetch data)
            const sectorName = this.textContent;
            console.log(`Sector details requested for: ${sectorName}`);
            
            // Visual feedback
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
}

// Navigation highlighting
function initNavHighlighting() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Simulate page loading
            document.body.style.opacity = '0.7';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 300);
        });
    });
}

// Periodic system status updates
function updateSystemStatus() {
    // Update compliance level
    const complianceElement = document.querySelector('.compliance-level');
    const currentLevel = parseFloat(complianceElement.textContent);
    const newLevel = Math.min(99.9, Math.max(90.0, currentLevel + (Math.random() * 2 - 1))).toFixed(1);
    complianceElement.textContent = newLevel + '%';
    
    // Update threat level based on compliance
    const threatElement = document.querySelector('.threat-level');
    if (newLevel > 98) {
        threatElement.textContent = 'MINIMAL';
        threatElement.style.color = '#00cc66';
    } else if (newLevel > 95) {
        threatElement.textContent = 'MODERATE';
        threatElement.style.color = '#aaff00';
    } else if (newLevel > 92) {
        threatElement.textContent = 'ELEVATED';
        threatElement.style.color = '#ffaa00';
    } else {
        threatElement.textContent = 'DANGEROUS';
        threatElement.style.color = '#ff003c';
    }
    
    // Update threat meter visually
    const meterFill = document.querySelector('.meter-fill');
    const threatPercentage = 100 - ((newLevel - 90) * 10);
    meterFill.style.width = `${threatPercentage}%`;
}

// Custom cursor effect for surveillance theme
document.addEventListener('DOMContentLoaded', function() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Track mouse movement
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
});

// Add custom cursor styles dynamically
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 1px solid #00ff41;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    }
    
    .custom-cursor::after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        background: #00ff41;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    a, button {
        cursor: none;
    }
    
    a:hover .custom-cursor,
    button:hover .custom-cursor {
        transform: translate(-50%, -50%) scale(1.5);
    }
`;
document.head.appendChild(cursorStyles);

// Add keyboard shortcuts for "hacking" experience
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+H to simulate hacking
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        
        // Flash screen red
        document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 200);
        
        // Show hacking message
        const hackMessage = document.createElement('div');
        hackMessage.textContent = '>>> SYSTEM BREACH DETECTED <<<';
        hackMessage.style.position = 'fixed';
        hackMessage.style.top = '50%';
        hackMessage.style.left = '50%';
        hackMessage.style.transform = 'translate(-50%, -50%)';
        hackMessage.style.color = '#ff0055';
        hackMessage.style.fontSize = '2rem';
        hackMessage.style.fontFamily = "'Orbitron', sans-serif";
        hackMessage.style.zIndex = '9999';
        hackMessage.style.textShadow = '0 0 10px #ff0055';
        document.body.appendChild(hackMessage);
        
        // Remove after delay
        setTimeout(() => {
            document.body.removeChild(hackMessage);
        }, 3000);
    }
});
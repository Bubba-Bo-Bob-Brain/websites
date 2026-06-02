// NEXUS_SECURE - Cybersecurity Command Center - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-rain');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        const fontSize = 14;
        let columns = [];
        
        function initMatrix() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const columnCount = Math.floor(canvas.width / fontSize);
            columns = [];
            for (let i = 0; i < columnCount; i++) {
                columns.push({
                    y: Math.random() * canvas.height,
                    speed: Math.random() * 0.5 + 0.5,
                    chars: Array(Math.floor(Math.random() * 15) + 5).fill(0).map(() => 
                        chars[Math.floor(Math.random() * chars.length)]
                    )
                });
            }
        }
        
        function animateMatrix() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#39ff14';
            ctx.font = fontSize + 'px monospace';
            
            columns.forEach((col, i) => {
                const x = i * fontSize;
                col.chars.forEach((char, j) => {
                    const y = col.y - j * fontSize;
                    if (y > 0 && y < canvas.height) {
                        ctx.fillStyle = j === 0 ? '#ffffff' : 'rgba(57, 255, 20, ' + (1 - j / col.chars.length) + ')';
                        ctx.fillText(char, x, y);
                    }
                });
                
                col.y += fontSize * col.speed;
                
                if (Math.random() > 0.98) {
                    col.chars[Math.floor(Math.random() * col.chars.length)] = chars[Math.floor(Math.random() * chars.length)];
                }
                
                if (col.y - col.chars.length * fontSize > canvas.height) {
                    col.y = 0;
                    col.speed = Math.random() * 0.5 + 0.5;
                    col.chars = Array(Math.floor(Math.random() * 15) + 5).fill(0).map(() => 
                        chars[Math.floor(Math.random() * chars.length)]
                    );
                }
            });
            
            requestAnimationFrame(animateMatrix);
        }
        
        initMatrix();
        animateMatrix();
        window.addEventListener('resize', initMatrix);
    }
    
    // Typing Effect
    const typedElement = document.getElementById('typed-intro');
    if (typedElement) {
        const text = 'INITIALIZING NEXUS_SECURE PROTOCOL...';
        let index = 0;
        function typeText() {
            if (index < text.length) {
                typedElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 40);
            }
        }
        typeText();
    }
    
    // Counter Animation
    function animateCounter(element, target, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    
    document.querySelectorAll('[data-count]').forEach(function(el) {
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target, 2000);
    });
    
    // Threat Feed
    const attackTypes = ['DDoS', 'MALWARE', 'PHISHING', 'INTRUSION', 'RANSOMWARE', 'BRUTE_FORCE'];
    const targets = ['WEB_SERVER_01', 'API_GATEWAY', 'DB_PRIMARY', 'AUTH_SERVICE', 'FILE_SERVER'];
    const locations = ['CN', 'RU', 'US', 'DE', 'BR'];
    let attackCount = 0;
    
    function addAttack() {
        const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const target = targets[Math.floor(Math.random() * targets.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        attackCount++;
        const counter = document.getElementById('attack-counter');
        if (counter) {
            counter.textContent = attackCount.toString().padStart(8, '0');
        }
        
        const list = document.getElementById('attacks-list');
        if (list) {
            const entry = document.createElement('div');
            entry.className = 'attack-entry';
            entry.innerHTML = '<span class="attack-time">' + time + '</span>' +
                '<span class="attack-type">[' + type + ']</span>' +
                '<span class="attack-target">' + target + ' <- ' + location + '</span>';
            list.insertBefore(entry, list.firstChild);
            while (list.children.length > 15) {
                list.removeChild(list.lastChild);
            }
        }
    }
    
    addAttack();
    setInterval(function() {
        addAttack();
    }, 3000 + Math.random() * 4000);
    
    // Audit Log
    const logEvents = [
        { severity: 'critical', source: 'FIREWALL', event: 'INTRUSION_DETECTED', details: 'Blocked SQL injection from 185.220.101.45' },
        { severity: 'alert', source: 'IDS', event: 'ANOMALY_DETECTED', details: 'Unusual traffic pattern detected' },
        { severity: 'info', source: 'AUTH_SERVICE', event: 'LOGIN_SUCCESS', details: 'User admin verified from trusted IP' },
        { severity: 'info', source: 'SYSTEM', event: 'BACKUP_COMPLETE', details: 'Incremental backup completed' },
        { severity: 'critical', source: 'WAF', event: 'ATTACK_BLOCKED', details: 'XSS payload detected and neutralized' },
        { severity: 'alert', source: 'MONITOR', event: 'HIGH_LOAD', details: 'CPU utilization exceeded 85%' },
        { severity: 'info', source: 'VPN', event: 'TUNNEL_ESTABLISHED', details: 'Secure tunnel created for remote user' },
        { severity: 'critical', source: 'MAIL_FILTER', event: 'PHISH_BLOCKED', details: 'Malicious email with payload detected' }
    ];
    
    let logEntries = [];
    for (let i = 0; i < 10; i++) {
        const template = logEvents[Math.floor(Math.random() * logEvents.length)];
        const now = new Date();
        logEntries.push({
            timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
            ...template,
            id: Date.now() + i
        });
    }
    
    function renderLogs(filter) {
        const container = document.getElementById('audit-log-entries');
        if (!container) return;
        const filtered = filter === 'all' ? logEntries : logEntries.filter(function(e) { return e.severity === filter; });
        container.innerHTML = filtered.slice(0, 20).map(function(entry) {
            return '<div class="log-entry ' + entry.severity + '">' +
                '<span class="log-timestamp">' + entry.timestamp + '</span>' +
                '<span class="log-severity">' + entry.severity.toUpperCase() + '</span>' +
                '<span class="log-source">[' + entry.source + ']</span>' +
                '<span class="log-event">' + entry.event + '</span>' +
                '<span class="log-details">' + entry.details + '</span>' +
                '</div>';
        }).join('');
    }
    
    renderLogs('all');
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderLogs(btn.dataset.filter);
        });
    });
    
    setInterval(function() {
        const template = logEvents[Math.floor(Math.random() * logEvents.length)];
        const now = new Date();
        logEntries.unshift({
            timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
            ...template,
            id: Date.now()
        });
        if (logEntries.length > 50) logEntries.pop();
        renderLogs(document.querySelector('.filter-btn.active') ? document.querySelector('.filter-btn.active').dataset.filter : 'all');
    }, 4000);
    
    // Terminal
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    let commandHistory = [];
    let historyIndex = -1;
    
    function printLine(text, type) {
        type = type || 'output';
        const line = document.createElement('div');
        line.className = 'terminal-line ' + type;
        line.innerHTML = '<span class="prompt">nexus@secure:~#</span> <span>' + text + '</span>';
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    const commands = {
        help: function() {
            printLine('Available commands:', 'system');
            printLine(' help - Display this help message', 'output');
            printLine(' scan - Run quick security scan', 'output');
            printLine(' status - Show system status', 'output');
            printLine(' threats - Display threat statistics', 'output');
            printLine(' whoami - Display current user', 'output');
            printLine(' date - Show current date/time', 'output');
            printLine(' sysinfo - Display system information', 'output');
            printLine(' clear - Clear terminal', 'output');
            printLine(' decrypt - Decrypt encrypted message', 'output');
        },
        scan: function() {
            printLine('Initiating security scan...', 'system');
            printLine('Scanning 247 ports on localhost...', 'output');
            setTimeout(function() { printLine('Port 22: OPEN (SSH)', 'output'); }, 500);
            setTimeout(function() { printLine('Port 80: OPEN (HTTP)', 'output'); }, 800);
            setTimeout(function() { printLine('Port 443: OPEN (HTTPS)', 'output'); }, 1100);
            setTimeout(function() { printLine('Scan complete. 3 open ports detected.', 'system'); }, 1500);
        },
        status: function() {
            printLine('=== SYSTEM STATUS ===', 'system');
            printLine('Uptime: 247 days 14 hours', 'output');
            printLine('Load: 0.45 0.32 0.28', 'output');
            printLine('Memory: 42% used', 'output');
            printLine('All services: OPERATIONAL', 'output');
        },
        threats: function() {
            printLine('=== THREAT STATISTICS ===', 'system');
            printLine('Total threats blocked: ' + attackCount.toLocaleString(), 'output');
            printLine('DDoS attempts: 48,291', 'output');
            printLine('Malware blocked: 37,156', 'output');
            printLine('Phishing blocked: 58,934', 'output');
        },
        whoami: function() {
            printLine('Current user: nexus_admin', 'output');
            printLine('User ID: 0x7F9A2B', 'output');
            printLine('Clearance: LEVEL_5', 'output');
        },
        date: function() {
            printLine(new Date().toString(), 'output');
        },
        sysinfo: function() {
            printLine('=== SYSTEM INFORMATION ===', 'system');
            printLine('OS: NexusOS 4.2.1-SECURE', 'output');
            printLine('Kernel: 6.1.0-nexus-security', 'output');
            printLine('Encryption: AES-256-GCM Active', 'output');
            printLine('Firewall: ipSec-Nexus v3.0', 'output');
        },
        clear: function() {
            terminalOutput.innerHTML = '';
        },
        decrypt: function() {
            var btn = document.getElementById('decrypt-btn');
            if (btn) btn.click();
        }
    };
    
    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                var cmd = terminalInput.value.trim();
                if (cmd) {
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                    printLine(cmd, 'command');
                    terminalInput.value = '';
                    var parts = cmd.toLowerCase().split(' ');
                    var command = parts[0];
                    if (commands[command]) {
                        commands[command](parts.slice(1));
                    } else {
                        printLine('Command not found: ' + command, 'error');
                    }
                }
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
                e.preventDefault();
            }
        });
    }
    
    // Encrypted Message Decryption
    var isDecrypted = false;
    var decryptBtn = document.getElementById('decrypt-btn');
    var decryptProgress = document.getElementById('decrypt-progress');
    var decryptedMessage = document.getElementById('decrypted-message');
    var decryptedText = document.getElementById('decrypted-text');
    
    if (decryptBtn) {
        decryptBtn.addEventListener('click', function() {
            if (isDecrypted) return;
            decryptBtn.style.display = 'none';
            decryptProgress.classList.add('active');
            
            setTimeout(function() {
                decryptProgress.classList.remove('active');
                var message = 'NEXUS_SECURE TRANSMISSION DECODED\n\n' +
                    'Successfully authenticated with the server.\n' +
                    'Your connection is now secure and encrypted.\n' +
                    'All data transmissions are protected by\n' +
                    'military-grade AES-256-GCM encryption.\n\n' +
                    'Stay secure. Stay vigilant.\n' +
                    '- NEXUS_SECURE SECURITY TEAM -';
                decryptedText.textContent = message;
                decryptedMessage.classList.add('active');
                isDecrypted = true;
                
                var keyHash = document.getElementById('key-hash');
                if (keyHash) keyHash.textContent = 'sha256:a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a';
                
                decryptBtn.textContent = 'MESSAGE DECRYPTED';
                decryptBtn.classList.add('decrypted');
                decryptBtn.style.display = 'flex';
            }, 2500);
        });
    }
    
    // System Time
    function updateTime() {
        var timeEl = document.getElementById('system-time');
        if (timeEl) {
            var now = new Date();
            timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
        requestAnimationFrame(updateTime);
    }
    updateTime();
    
    // Last Update Footer
    setInterval(function() {
        var lastUpdateEl = document.getElementById('last-update');
        if (lastUpdateEl) {
            var now = new Date();
            lastUpdateEl.textContent = now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
        }
    }, 60000);
    
    // Glitch Effect Enhancement
    document.querySelectorAll('.glitch-text').forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            el.style.animationDuration = '0.2s';
        });
        el.addEventListener('mouseleave', function() {
            el.style.animationDuration = '';
        });
    });
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Ctrl+T to focus terminal
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            if (terminalInput) terminalInput.focus();
        }
    });
});
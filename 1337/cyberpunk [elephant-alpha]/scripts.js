// scripts.js

// Code Rain Animation
class CodeRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        this.init();
    }

    init() {
        this.canvas.id = 'codeRainCanvas';
        document.querySelector('.code-rain').appendChild(this.canvas);
        this.resize();
        this.setupColumns();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.setupColumns();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupColumns() {
        this.columns = [];
        const columnCount = Math.floor(this.canvas.width / 20);
        
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * 20,
                y: Math.random() * this.canvas.height,
                speed: 2 + Math.random() * 5,
                length: 20 + Math.random() * 100,
                chars: Array.from({length: 20}, () => this.characters[Math.floor(Math.random() * this.characters.length)])
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '14px monospace';
        
        this.columns.forEach(col => {
            const gradient = this.ctx.createLinearGradient(0, col.y, 0, col.y + col.length * 20);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, '#39FF14');
            gradient.addColorStop(1, 'rgba(57, 255, 20, 0.5)');
            
            this.ctx.fillStyle = gradient;
            
            for (let i = 0; i < col.length; i++) {
                const char = col.chars[i];
                const x = col.x;
                const y = col.y + i * 20;
                
                if (y > this.canvas.height) {
                    col.chars[i] = this.characters[Math.floor(Math.random() * this.characters.length)];
                }
                
                this.ctx.fillText(char, x, y);
                col.chars[i] = this.characters[Math.floor(Math.random() * this.characters.length)];
            }
            
            col.y += col.speed;
            
            if (col.y > this.canvas.height) {
                col.y = -col.length * 20;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Terminal Interaction
class Terminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.inputText = document.getElementById('inputText');
        this.cursor = document.getElementById('cursor');
        this.prompt = document.querySelector('.prompt');
        this.packets = document.getElementById('packets');
        this.security = document.getElementById('security');
        this.timeDisplay = document.getElementById('time');
        this.breaches = document.getElementById('breaches');
        this.glowEffect = document.getElementById('glowEffect');
        this.glitchOverlay = document.getElementById('glitchOverlay');
        
        this.commandHistory = [];
        this.historyIndex = 0;
        this.packetCount = 0;
        this.breachCount = 0;
        this.startTime = Date.now();
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'scan': this.runScan.bind(this),
            'breach': this.breachSystem.bind(this),
            'status': this.showStatus.bind(this),
            'clear': this.clearTerminal.bind(this),
            'whoami': this.showWhoami.bind(this),
            'encrypt': this.encryptData.bind(this),
            'decrypt': this.decryptData.bind(this),
            'trace': this.traceRoute.bind(this)
        };
        
        this.init();
    }

    init() {
        this.addLine();
        this.inputText.focus();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        this.inputText.addEventListener('keydown', (e) => this.handleKey(e));
        this.inputText.addEventListener('input', () => this.scrollToBottom());
    }

    addLine(prompt = true) {
        const line = document.createElement('div');
        line.className = 'command-line';
        
        if (prompt) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = 'root@cyberpunk:~$';
            line.appendChild(promptSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = 'command-text';
        line.appendChild(textSpan);
        
        this.output.appendChild(line);
        this.scrollToBottom();
        
        return line;
    }

    scrollToBottom() {
        this.output.parentElement.scrollTop = this.output.parentElement.scrollHeight;
    }

    handleKey(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.handleTab(e);
        }
    }

    executeCommand() {
        const command = this.inputText.textContent.trim().toLowerCase();
        
        if (!command) {
            this.addLine();
            return;
        }
        
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        const outputLine = this.addLine(false);
        const textSpan = outputLine.querySelector('.command-text');
        const promptSpan = outputLine.querySelector('.prompt');
        
        if (promptSpan) {
            promptSpan.textContent = `root@cyberpunk:~$ ${command}`;
        } else {
            textSpan.textContent = `${command}`;
        }
        
        this.packetCount++;
        this.updateStats();
        
        if (this.commands[command]) {
            setTimeout(() => this.commands[command](), 300);
        } else {
            setTimeout(() => this.handleUnknownCommand(command), 300);
        }
        
        this.inputText.textContent = '';
        this.addLine();
    }

    handleUnknownCommand(command) {
        const outputLine = this.addLine(false);
        const textSpan = outputLine.querySelector('.command-text');
        textSpan.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
        textSpan.style.color = '#ff4444';
    }

    showHelp() {
        const helpText = `
AVAILABLE COMMANDS:
  help     - Display this help message
  scan     - Run security scan
  breach   - Simulate security breach
  status   - Show system status
  clear    - Clear terminal screen
  whoami   - Show current user
  encrypt  - Encrypt data stream
  decrypt  - Decrypt data stream
  trace    - Trace network route
        `;
        
        const outputLine = this.addLine(false);
        const textSpan = outputLine.querySelector('.command-text');
        textSpan.textContent = helpText;
        textSpan.style.color = '#39FF14';
    }

    runScan() {
        const messages = [
            'Scanning network ports...',
            'Checking firewall rules...',
            'Analyzing traffic patterns...',
            'Detecting vulnerabilities...',
            'Scan complete: No critical threats detected',
            'System integrity: SECURE'
        ];
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = msg;
                if (index === messages.length - 1) {
                    textSpan.style.color = '#39FF14';
                }
            }, index * 400);
        });
    }

    breachSystem() {
        this.breachCount++;
        this.updateStats();
        
        const breachMessages = [
            '⚠ SECURITY BREACH DETECTED ⚠',
            'Unauthorized access attempt logged',
            'Firewall rules bypassed',
            'Data exfiltration in progress...',
            'Emergency protocols activated',
            'Trace initiated...'
        ];
        
        breachMessages.forEach((msg, index) => {
            setTimeout(() => {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = msg;
                if (index === 0) {
                    textSpan.style.color = '#ff0000';
                    this.triggerGlitch();
                } else {
                    textSpan.style.color = '#FFD700';
                }
            }, index * 300);
        });
    }

    showStatus() {
        const statusMessages = [
            '=== SYSTEM STATUS ===',
            `Uptime: ${this.getUptime()}`,
            `Active Connections: ${Math.floor(Math.random() * 100) + 10}`,
            `Memory Usage: ${Math.floor(Math.random() * 50 + 50)}%`,
            `CPU Load: ${Math.floor(Math.random() * 100)}%`,
            `Security Level: ${100 - this.breachCount * 5}%`,
            'Status: OPERATIONAL'
        ];
        
        statusMessages.forEach((msg, index) => {
            setTimeout(() => {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = msg;
                if (index === statusMessages.length - 1) {
                    textSpan.style.color = '#39FF14';
                }
            }, index * 200);
        });
    }

    clearTerminal() {
        this.output.innerHTML = '';
        this.addLine();
    }

    showWhoami() {
        const users = ['SYSTEM_ADMIN', 'NET_OPERATOR', 'SECURITY_ANALYST', 'DATA_ARCHITECT'];
        const user = users[Math.floor(Math.random() * users.length)];
        
        const outputLine = this.addLine(false);
        const textSpan = outputLine.querySelector('.command-text');
        textSpan.textContent = `Authenticated user: ${user}`;
        textSpan.style.color = '#3498DB';
    }

    encryptData() {
        const messages = [
            'Initializing encryption protocol...',
            'Generating encryption keys...',
            'Encrypting data stream...',
            'AES-256 encryption applied',
            'Data secured: ENCRYPTED'
        ];
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = msg;
                if (index === messages.length - 1) {
                    textSpan.style.color = '#39FF14';
                }
            }, index * 300);
        });
    }

    decryptData() {
        const messages = [
            'Decryption key required...',
            'Attempting to decrypt...',
            'Decryption successful',
            'Data restored: DECRYPTED'
        ];
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = msg;
                if (index === messages.length - 1) {
                    textSpan.style.color = '#FFD700';
                }
            }, index * 300);
        });
    }

    traceRoute() {
        const hops = [
            'Tracing route to destination...',
            '1  192.168.1.1 (192.168.1.1)  1.234 ms',
            '2  10.0.0.1 (10.0.0.1)  2.456 ms',
            '3  172.16.0.1 (172.16.0.1)  3.789 ms',
            '4  203.0.113.1 (203.0.113.1)  5.123 ms',
            '5  Destination reached (198.51.100.1)  4.567 ms'
        ];
        
        hops.forEach((hop, index) => {
            setTimeout(() => {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = hop;
                if (index > 0) {
                    textSpan.style.color = '#3498DB';
                } else {
                    textSpan.style.color = '#FFD700';
                }
            }, index * 500);
        });
    }

    navigateHistory(direction) {
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) this.historyIndex = 0;
        if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            return;
        }
        
        if (this.historyIndex < this.commandHistory.length) {
            this.inputText.textContent = this.commandHistory[this.historyIndex];
        } else {
            this.inputText.textContent = '';
        }
    }

    handleTab(e) {
        e.preventDefault();
        // Simple tab completion simulation
        const currentText = this.inputText.textContent;
        if (currentText) {
            const suggestions = Object.keys(this.commands).filter(cmd => 
                cmd.startsWith(currentText)
            );
            
            if (suggestions.length === 1) {
                this.inputText.textContent = suggestions[0];
            } else if (suggestions.length > 1) {
                const outputLine = this.addLine(false);
                const textSpan = outputLine.querySelector('.command-text');
                textSpan.textContent = suggestions.join(', ');
            }
        }
    }

    triggerGlitch() {
        this.glitchOverlay.classList.add('active');
        setTimeout(() => {
            this.glitchOverlay.classList.remove('active');
        }, 300);
    }

    updateStats() {
        this.packets.textContent = this.packetCount;
        this.security.textContent = `${100 - this.breachCount * 5}%`;
        this.breaches.textContent = this.breachCount;
    }

    getUptime() {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Code Rain
    const codeRain = new CodeRain();
    
    // Initialize Terminal
    const terminal = new Terminal();
    
    // Add some random terminal messages periodically
    setInterval(() => {
        const randomMessages = [
            'Connection established',
            'Data packet received',
            'System checkpoint',
            'Memory allocation',
            'Process completed'
        ];
        
        const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const outputLine = terminal.addLine(false);
        const textSpan = outputLine.querySelector('.command-text');
        textSpan.textContent = message;
        textSpan.style.color = '#888888';
    }, 8000);
});
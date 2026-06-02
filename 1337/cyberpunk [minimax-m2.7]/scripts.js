/* =====================================================
   NETRUNNER v3.7 - CYBERPUNK HACKING INTERFACE
   JavaScript - Bringing the Interface to Life
   ===================================================== */

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

const Utils = {
    // Random number between min and max
    random: (min, max) => Math.random() * (max - min) + min,
    
    // Random integer between min and max
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Pick random item from array
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    // Clamp value between min and max
    clamp: (val, min, max) => Math.min(Math.max(val, min), max),
    
    // Convert hex to rgb
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Ease out cubic
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    
    // Ease in out quad
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
};

// =====================================================
// MATRIX CODE RAIN EFFECT
// =====================================================

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        this.columns = [];
        this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*(){}[]<>?/\\|~`';
        this.fontSize = 14;
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columnHeight = Math.ceil(this.canvas.height / this.fontSize);
        this.init();
    }
    
    init() {
        this.columns = [];
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * this.fontSize,
                y: Math.random() * this.canvas.height,
                speed: Utils.random(2, 8),
                chars: [],
                charIndex: 0
            });
        }
    }
    
    draw() {
        // Semi-transparent dark overlay for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.columns.forEach(column => {
            // Draw characters in column
            for (let i = 0; i < column.chars.length; i++) {
                const char = column.chars[i];
                const y = column.y - (i * this.fontSize);
                
                if (y < 0 || y > this.canvas.height) continue;
                
                // First char is brightest
                if (i === 0) {
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.shadowColor = '#00ff00';
                    this.ctx.shadowBlur = 10;
                } else if (i < 3) {
                    this.ctx.fillStyle = '#00ff00';
                    this.ctx.shadowBlur = 5;
                } else {
                    // Fade out older characters
                    const alpha = 1 - (i / column.chars.length);
                    this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.7})`;
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;
                this.ctx.fillText(char, column.x, y);
            }
            
            // Add new character
            if (Math.random() > 0.95 || column.charIndex < 10) {
                const newChar = this.chars[Utils.randomInt(0, this.chars.length - 1)];
                column.chars.unshift(newChar);
                column.charIndex++;
            }
            
            // Remove old characters
            if (column.chars.length > 20) {
                column.chars.pop();
            }
            
            // Move column down
            column.y += column.speed;
            
            // Reset if off screen
            if (column.y > this.canvas.height + (column.chars.length * this.fontSize)) {
                column.y = 0;
                column.chars = [];
                column.charIndex = 0;
                column.speed = Utils.random(2, 8);
            }
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    start() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// =====================================================
// SYSTEM TIME CLOCK
// =====================================================

class SystemClock {
    constructor(element) {
        this.element = element;
        this.update();
        setInterval(() => this.update(), 1000);
    }
    
    update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.element.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// =====================================================
// STAT COUNTER ANIMATION
// =====================================================

class StatCounter {
    constructor(element, target, duration = 2000, decimals = 0) {
        this.element = element;
        this.target = parseFloat(target);
        this.duration = duration;
        this.decimals = decimals;
        this.startTime = null;
        this.startValue = 0;
        this.observed = false;
        
        // Use Intersection Observer for lazy animation
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed) {
                    this.observed = true;
                    this.animate();
                }
            });
        }, { threshold: 0.5 });
        
        this.observer.observe(element);
    }
    
    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const easedProgress = Utils.easeOutCubic(progress);
        
        const currentValue = this.startValue + (this.target - this.startValue) * easedProgress;
        
        if (this.decimals > 0) {
            this.element.textContent = currentValue.toFixed(this.decimals);
        } else {
            this.element.textContent = Math.floor(currentValue).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
}

// =====================================================
// PROGRESS BAR ANIMATION
// =====================================================

class ProgressBar {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.dataset.progress) || 0;
        this.observed = false;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed) {
                    this.observed = true;
                    this.animate();
                }
            });
        }, { threshold: 0.5 });
        
        this.observer.observe(element);
    }
    
    animate() {
        const width = `${this.target}%`;
        this.element.style.width = width;
    }
}

// =====================================================
// NETWORK TOPOLOGY VISUALIZATION
// =====================================================

class NetworkTopology {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        this.nodes = [
            { x: 0.2, y: 0.3, label: 'US-EAST-1', active: true },
            { x: 0.5, y: 0.25, label: 'EU-WEST-2', active: false },
            { x: 0.75, y: 0.45, label: 'AP-SOUTH-1', active: false },
            { x: 0.35, y: 0.7, label: 'US-WEST-2', active: true },
            { x: 0.6, y: 0.65, label: 'SA-EAST-1', active: false }
        ];
        
        this.connections = [
            [0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [0, 4]
        ];
        
        this.particles = [];
        this.initParticles();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    initParticles() {
        this.connections.forEach(([from, to]) => {
            const nodeFrom = this.nodes[from];
            const nodeTo = this.nodes[to];
            
            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    from: nodeFrom,
                    to: nodeTo,
                    progress: Math.random(),
                    speed: Utils.random(0.002, 0.006),
                    size: Utils.random(1, 3)
                });
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        this.ctx.lineWidth = 1;
        
        this.connections.forEach(([from, to]) => {
            const nodeFrom = this.nodes[from];
            const nodeTo = this.nodes[to];
            
            this.ctx.beginPath();
            this.ctx.moveTo(
                nodeFrom.x * this.canvas.width,
                nodeFrom.y * this.canvas.height
            );
            this.ctx.lineTo(
                nodeTo.x * this.canvas.width,
                nodeTo.y * this.canvas.height
            );
            this.ctx.stroke();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            const x = particle.from.x + (particle.to.x - particle.from.x) * particle.progress;
            const y = particle.from.y + (particle.to.y - particle.from.y) * particle.progress;
            
            this.ctx.fillStyle = '#00ff00';
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(
                x * this.canvas.width,
                y * this.canvas.height,
                particle.size,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Update particle
            particle.progress += particle.speed;
            if (particle.progress > 1) {
                particle.progress = 0;
            }
        });
        
        this.ctx.shadowBlur = 0;
        
        // Draw nodes
        this.nodes.forEach(node => {
            const x = node.x * this.canvas.width;
            const y = node.y * this.canvas.height;
            
            // Outer glow
            if (node.active) {
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 15, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Node circle
            this.ctx.fillStyle = node.active ? '#00ff00' : '#004400';
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Inner dot
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// =====================================================
// TRAFFIC CHART
// =====================================================

class TrafficChart {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        this.incomingData = [];
        this.outgoingData = [];
        this.maxDataPoints = 30;
        this.maxValue = 100;
        
        // Initialize with random data
        for (let i = 0; i < this.maxDataPoints; i++) {
            this.incomingData.push(Utils.random(20, 80));
            this.outgoingData.push(Utils.random(10, 50));
        }
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
        
        // Add new data points periodically
        setInterval(() => this.addDataPoint(), 1000);
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    addDataPoint() {
        this.incomingData.push(Utils.random(20, 80));
        this.outgoingData.push(Utils.random(10, 50));
        
        if (this.incomingData.length > this.maxDataPoints) {
            this.incomingData.shift();
            this.outgoingData.shift();
        }
    }
    
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = { top: 10, right: 10, bottom: 20, left: 10 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding.left, y);
            this.ctx.lineTo(width - padding.right, y);
            this.ctx.stroke();
        }
        
        const pointSpacing = chartWidth / (this.maxDataPoints - 1);
        
        // Draw incoming line
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 5;
        this.ctx.beginPath();
        
        this.incomingData.forEach((value, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + chartHeight - (value / this.maxValue) * chartHeight;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();
        
        // Draw outgoing line
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.beginPath();
        
        this.outgoingData.forEach((value, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + chartHeight - (value / this.maxValue) * chartHeight;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
        
        // Draw data points
        this.incomingData.forEach((value, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + chartHeight - (value / this.maxValue) * chartHeight;
            
            this.ctx.fillStyle = '#00ffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.outgoingData.forEach((value, index) => {
            const x = padding.left + index * pointSpacing;
            const y = padding.top + chartHeight - (value / this.maxValue) * chartHeight;
            
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// =====================================================
// TERMINAL EMULATOR
// =====================================================

class Terminal {
    constructor(input, output, body) {
        this.input = input;
        this.output = output;
        this.body = body;
        this.history = [];
        this.historyIndex = -1;
        this.commandHistory = [];
        
        this.commands = {
            help: () => this.cmdHelp(),
            clear: () => this.cmdClear(),
            whoami: () => this.cmdWhoami(),
            ls: () => this.cmdLs(),
            pwd: () => this.cmdPwd(),
            date: () => this.cmdDate(),
            uptime: () => this.cmdUptime(),
            neofetch: () => this.cmdNeofetch(),
            matrix: () => this.cmdMatrix(),
            hack: () => this.cmdHack(),
            scan: (args) => this.cmdScan(args),
            connect: (args) => this.cmdConnect(args),
            status: () => this.cmdStatus(),
            nodes: () => this.cmdNodes(),
            exploit: (args) => this.cmdExploit(args),
            decrypt: (args) => this.cmdDecrypt(args),
            firewall: () => this.cmdFirewall(),
            ssh: (args) => this.cmdSsh(args),
            ping: (args) => this.cmdPing(args),
            nmap: (args) => this.cmdNmap(args),
            cat: (args) => this.cmdCat(args),
            echo: (args) => this.cmdEcho(args),
            history: () => this.cmdHistory(),
            about: () => this.cmdAbout(),
            sudo: (args) => this.cmdSudo(args),
            exit: () => this.cmdExit()
        };
        
        this.init();
    }
    
    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.focus();
        
        // Click anywhere in terminal to focus input
        this.body.addEventListener('click', () => this.input.focus());
    }
    
    handleKeydown(e) {
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
            this.autocomplete();
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            this.cmdClear();
        }
    }
    
    executeCommand() {
        const command = this.input.value.trim();
        if (!command) return;
        
        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Echo command
        this.addLine('command', `root@netrunner:~$ ${command}`);
        
        // Parse and execute
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (this.commands[cmd]) {
            const result = this.commands[cmd](args);
            if (result) {
                result.forEach(line => this.addLine(line.type || 'output', line.text));
            }
        } else {
            this.addLine('error', `Command not found: ${cmd}`);
            this.addLine('output', `Type 'help' for available commands`);
        }
        
        this.input.value = '';
        this.scrollToBottom();
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        this.historyIndex = Utils.clamp(this.historyIndex, 0, this.commandHistory.length);
        
        if (this.historyIndex === this.commandHistory.length) {
            this.input.value = '';
        } else {
            this.input.value = this.commandHistory[this.historyIndex];
        }
    }
    
    autocomplete() {
        const input = this.input.value.toLowerCase();
        if (!input) return;
        
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(input)
        );
        
        if (matches.length === 1) {
            this.input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.addLine('system', `Suggestions: ${matches.join(', ')}`);
            this.scrollToBottom();
        }
    }
    
    addLine(type, content) {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.innerHTML = `<span class="line-prefix">[SYS]</span><span class="line-content">${content}</span>`;
        this.output.appendChild(line);
    }
    
    scrollToBottom() {
        this.body.scrollTop = this.body.scrollHeight;
    }
    
    // Command implementations
    cmdHelp() {
        return [
            { text: '─────────────────────────────────────────' },
            { text: 'Available commands:', type: 'output' },
            { text: '─────────────────────────────────────────' },
            { text: '  help     - Show this help message' },
            { text: '  clear    - Clear the terminal' },
            { text: '  whoami   - Display current user' },
            { text: '  ls       - List directory contents' },
            { text: '  pwd      - Print working directory' },
            { text: '  date     - Show current date/time' },
            { text: '  uptime   - Show system uptime' },
            { text: '  status   - Display system status' },
            { text: '  nodes    - List active network nodes' },
            { text: '  neofetch - System information' },
            { text: '  scan     - Scan target IP (usage: scan <ip>)' },
            { text: '  connect  - Connect to server (usage: connect <ip>)' },
            { text: '  ping     - Ping host (usage: ping <host>)' },
            { text: '  nmap     - Port scan (usage: nmap <ip>)' },
            { text: '  exploit  - Deploy exploit (usage: exploit <cve>)' },
            { text: '  decrypt  - Decrypt data (usage: decrypt <hash>)' },
            { text: '  firewall - View firewall status' },
            { text: '  matrix   - Enter the Matrix' },
            { text: '  hack     - Initiate hack sequence' },
            { text: '  cat      - Read file (usage: cat )' },
            { text: '  echo     - Print text (usage: echo <text>)' },
            { text: '  history  - Show command history' },
            { text: '  about    - About NETRUNNER' },
            { text: '  exit     - Exit terminal' },
            { text: '─────────────────────────────────────────' }
        ];
    }
    
    cmdClear() {
        this.output.innerHTML = '';
        return null;
    }
    
    cmdWhoami() {
        return [
            { text: 'root@netrunner' },
            { text: 'UID: 0 | GID: 0 | Groups: wheel, sudo, shadow, sys' }
        ];
    }
    
    cmdLs() {
        return [
            { text: 'drwxr-xr-x  exploits/' },
            { text: 'drwxr-xr-x  payloads/' },
            { text: 'drwxr-xr-x  scripts/' },
            { text: 'drwxr-xr-x  data/' },
            { text: '-rw-r--r--  access_logs.txt' },
            { text: '-rw-r--r--  credentials.db' },
            { text: '-rw-------  ssh_keys/' },
            { text: '-rwxr-xr-x  run_breach.sh' }
        ];
    }
    
    cmdPwd() {
        return [{ text: '/opt/netrunner/core' }];
    }
    
    cmdDate() {
        const now = new Date();
        return [
            { text: now.toString() },
            { text: `UTC${now.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(now.getTimezoneOffset() / 60)}` }
        ];
    }
    
    cmdUptime() {
        const uptime = Math.floor(Math.random() * 1000) + 500;
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        return [
            { text: `System up for ${days} days, ${hours} hours, ${mins} minutes` },
            { text: `Load average: ${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 2).toFixed(2)}, ${(Math.random() * 2).toFixed(2)}` }
        ];
    }
    
    cmdStatus() {
        return [
            { text: '═══════════════════════════════════════════' },
            { text: '         SYSTEM STATUS REPORT' },
            { text: '═══════════════════════════════════════════' },
            { text: '  CPU:     ████████░░ 78%' },
            { text: '  MEM:     ██████░░░░ 62%' },
            { text: '  NET:     ██████████ 95% (PEAK)' },
            { text: '  DISK:    ████░░░░░░ 42%' },
            { text: '  TEMP:    42.7°C (NOMINAL)' },
            { text: '═══════════════════════════════════════════' },
            { text: '  Firewalls:    ACTIVE' },
            { text: '  IDS/IPS:      ACTIVE' },
            { text: '  Encryption:   ENABLED' },
            { text: '  VPN:          CONNECTED' },
            { text: '═══════════════════════════════════════════' }
        ];
    }
    
    cmdNodes() {
        return [
            { text: '─── ACTIVE NODES ───────────────────────────' },
            { text: '  #   NODE              STATUS    LATENCY' },
            { text: '  1   US-EAST-1         ONLINE    12ms' },
            { text: '  2   EU-WEST-2         ONLINE    89ms' },
            { text: '  3   AP-SOUTH-1        ONLINE    156ms' },
            { text: '  4   US-WEST-2         ONLINE    34ms' },
            { text: '  5   SA-EAST-1         ONLINE    201ms' },
            { text: '─── 5/5 NODES ACTIVE ──────────────────────' }
        ];
    }
    
    cmdNeofetch() {
        return [
            { text: '        ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄        root@netrunner' },
            { text: '     ▄█▀             ▀█▄      ─────────────────' },
            { text: '    █▀   ▄▄▄▄▄▄▄▄▄   ▀█      OS: NETRUNNER OS v3.7.4' },
            { text: '   █▀  ▄█▀▀▀▀▀▀▀▀▀█▄  ▀█     Host: Shadow-Net-9000' },
            { text: '   █   █          █   █     Kernel: 6.9.0-netrun' },
            { text: '   █   █  ▄▄▄▄▄▄  █   █     Uptime: 14 days, 7 hours' },
            { text: '   █   █ █◐◐◐◐◐◐█ █   █     Shell: netsh 3.7' },
            { text: '   █   █ ▀▀▀▀▀▀▀▀▀█ █   █     Resolution: 1920x1080@144Hz' },
            { text: '   █▄  ▀█▄▄▄▄▄▄▄▄█▀  ▄█     Terminal: xterm-net' },
            { text: '    █▄             ▄█       CPU: Quantum-Core i9 @ 7.2GHz' },
            { text: '     ▀█▄▄▄▄▄▄▄▄▄▄▄█▀         GPU: Neural-Link RTX 9090' },
            { text: '                          Memory: 256GB / 512GB' },
            { text: '' },
            { text: '  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀' },
            { text: '  ▓ NEON-LIME ▓ CYAN-PULSE ▓ MAGENTA-DREAM ▓' }
        ];
    }
    
    cmdMatrix() {
        this.output.innerHTML = '';
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let count = 0;
        const interval = setInterval(() => {
            let line = '';
            for (let i = 0; i < 50; i++) {
                line += chars[Math.floor(Math.random() * chars.length)];
            }
            this.addLine('output', line);
            this.scrollToBottom();
            count++;
            if (count > 50) clearInterval(interval);
        }, 50);
        return null;
    }
    
    cmdHack() {
        return [
            { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓' },
            { text: '  INITIATING BREACH SEQUENCE...', type: 'output' },
            { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓' },
            { text: '' },
            { text: '[>] Bypassing authentication... DONE' },
            { text: '[>] Injecting payload... DONE' },
            { text: '[>] Escalating privileges... DONE' },
            { text: '[>] Dumping credentials... DONE' },
            { text: '[>] Exfiltrating data... 2.4TB' },
            { text: '' },
            { text: '  ✓ BREACH SUCCESSFUL', type: 'output' },
            { text: '  Session ID: 0x7F3A9B2C' },
            { text: '  Duration: 4.2 seconds' }
        ];
    }
    
    cmdScan(args) {
        if (!args[0]) {
            return [{ text: 'Usage: scan <ip_address>', type: 'error' }];
        }
        const ip = args[0];
        return [
            { text: `Initiating scan on ${ip}...` },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
            { text: `Nmap scan report for ${ip}` },
            { text: 'Host is up (0.012s latency).' },
            { text: '' },
            { text: 'PORT     STATE    SERVICE' },
            { text: '22/tcp   open     ssh' },
            { text: '80/tcp   open     http' },
            { text: '443/tcp  open     https' },
            { text: '3306/tcp filtered mysql' },
            { text: '8080/tcp open     http-proxy' },
            { text: '' },
            { text: 'OS detection: Linux 5.4 (Ubuntu)' },
            { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' }
        ];
    }
    
    cmdConnect(args) {
        if (!args[0]) {
            return [{ text: 'Usage: connect <ip_address>', type: 'error' }];
        }
        const ip = args[0];
        const port = args[1] || 22;
        return [
            { text: `Connecting to ${ip}:${port}...` },
            { text: 'Establishing secure tunnel...' },
            { text: 'Encryption: AES-512-GCM' },
            { text: '' },
            { text: `✓ Connected to ${ip}`, type: 'output' },
            { text: 'Session encrypted and ready.' }
        ];
    }
    
    cmdSsh(args) {
        if (!args[0]) {
            return [{ text: 'Usage: ssh <user>@<host>', type: 'error' }];
        }
        return [
            { text: `Connecting via SSH to ${args[0]}...` },
            { text: 'Authenticating with SSH key...' },
            { text: '✓ SSH session established' }
        ];
    }
    
    cmdPing(args) {
        if (!args[0]) {
            return [{ text: 'Usage: ping <host>', type: 'error' }];
        }
        const host = args[0];
        const times = [];
        for (let i = 0; i < 4; i++) {
            times.push(`${Utils.randomInt(10, 200)}ms`);
        }
        return [
            { text: `PING ${host} (${Utils.randomInt(1, 255)}.${Utils.randomInt(1, 255)}.${Utils.randomInt(1, 255)}.${Utils.randomInt(1, 255)}): 56 data bytes` },
            { text: `64 bytes from ${host}: icmp_seq=0 ttl=64 time=${times[0]}` },
            { text: `64 bytes from ${host}: icmp_seq=1 ttl=64 time=${times[1]}` },
            { text: `64 bytes from ${host}: icmp_seq=2 ttl=64 time=${times[2]}` },
            { text: `64 bytes from ${host}: icmp_seq=3 ttl=64 time=${times[3]}` },
            { text: '' },
            { text: `--- ${host} ping statistics ---` },
            { text: `4 packets transmitted, 4 received, 0% packet loss` }
        ];
    }
    
    cmdNmap(args) {
        if (!args[0]) {
            return [{ text: 'Usage: nmap <ip_address>', type: 'error' }];
        }
        const ip = args[0];
        return [
            { text: `Starting Nmap 7.94 ( https://nmap.org )` },
            { text: `Nmap scan report for ${ip}` },
            { text: '' },
            { text: 'Host is up.' },
            { text: '' },
            { text: 'PORT      STATE    SERVICE        VERSION' },
            { text: '21/tcp    ftp       vsftpd 3.0.3' },
            { text: '22/tcp    ssh       OpenSSH 8.9' },
            { text: '25/tcp    smtp      Postfix smtpd' },
            { text: '80/tcp    http      Apache 2.4.52' },
            { text: '443/tcp   ssl       nginx 1.22' },
            { text: '3306/tcp  mysql     MySQL 8.0' },
            { text: '27017/tcp mongodb   MongoDB' },
            { text: '' },
            { text: 'OS detection: Ubuntu Linux 5.15' },
            { text: 'Service Info: OS: Linux' },
            { text: '' },
            { text: 'OS and Service detection performed.' }
        ];
    }
    
    cmdExploit(args) {
        if (!args[0]) {
            return [
                { text: 'Available exploits:', type: 'output' },
                { text: '  CVE-2024-7891  - Critical RCE' },
                { text: '  CVE-2024-5612  - High SQL Injection' },
                { text: '  CVE-2024-3456  - Medium XSS' },
                { text: '  CVE-2024-1234  - Low Info Disclosure' },
                { text: '' },
                { text: 'Usage: exploit <cve_id>', type: 'system' }
            ];
        }
        const cve = args[0].toUpperCase();
        return [
            { text: `Deploying ${cve}...` },
            { text: 'Compiling exploit module...' },
            { text: 'Injecting payload...' },
            { text: 'Executing shellcode...' },
            { text: '' },
            { text: `✓ ${cve} deployed successfully`, type: 'output' },
            { text: 'Reverse shell established: 127.0.0.1:4444' }
        ];
    }
    
    cmdDecrypt(args) {
        if (!args[0]) {
            return [{ text: 'Usage: decrypt <hash_or_file>', type: 'error' }];
        }
        return [
            { text: `Decrypting: ${args[0]}...` },
            { text: 'Using Rainbow Tables v7...' },
            { text: 'GPU acceleration: ENABLED' },
            { text: '' },
            { text: '✓ Decryption successful!', type: 'output' },
            { text: 'Result: super_secret_password_123' }
        ];
    }
    
    cmdFirewall() {
        return [
            { text: '═══ FIREWALL STATUS ═══' },
            { text: '' },
            { text: '  Inbound Rules:' },
            { text: '    ✓ SSH (22)     - ALLOWED (whitelist)' },
            { text: '    ✓ HTTPS (443)  - ALLOWED' },
            { text: '    ✗ Telnet (23)  - BLOCKED' },
            { text: '    ✗ FTP (21)     - BLOCKED' },
            { text: '' },
            { text: '  Outbound Rules:' },
            { text: '    ✓ All traffic - ALLOWED' },
            { text: '' },
            { text: '  Threat Detection: ACTIVE' },
            { text: '  Rate Limiting: ENABLED' },
            { text: '  Geo-blocking: RUSSIA, CHINA, NK' }
        ];
    }
    
    cmdCat(args) {
        if (!args[0]) {
            return [{ text: 'Usage: cat ', type: 'error' }];
        }
        const files = {
            'readme.txt': 'Welcome to NETRUNNER v3.7.4\n\nThis system is for authorized use only.\nAll connections are logged and monitored.',
            'credentials.db': 'admin:$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi\nroot:$2y$10$FGfF6x7kqV8xP3wOqR3mZeB4nJ8cL9vK2dF5sA7hG0tE1iU4oQ6rS8',
            'access_logs.txt': `[2024-12-15 03:14:22] LOGIN: 192.168.1.100 - SUCCESS\n[2024-12-15 03:14:45] ACCESS: /admin/panel\n[2024-12-15 03:15:01] QUERY: SELECT * FROM users`
        };
        const filename = args[0].toLowerCase();
        if (files[filename]) {
            return files[filename].split('\n').map(line => ({ text: line }));
        }
        return [{ text: `cat: ${args[0]}: No such file or directory`, type: 'error' }];
    }
    
    cmdEcho(args) {
        if (!args[0]) return [{ text: '' }];
        return [{ text: args.join(' ') }];
    }
    
    cmdHistory() {
        if (this.commandHistory.length === 0) {
            return [{ text: 'No commands in history' }];
        }
        return this.commandHistory.map((cmd, i) => ({ 
            text: `  ${i + 1}  ${cmd}` 
        }));
    }
    
    cmdAbout() {
        return [
            { text: '═══════════════════════════════════════════' },
            { text: '  NETRUNNER v3.7.4' },
            { text: '  "The future is now"' },
            { text: '═══════════════════════════════════════════' },
            { text: '' },
            { text: '  An elite hacking collective operating' },
            { text: '  in the shadows of the digital frontier.' },
            { text: '' },
            { text: '  Founded: 2019' },
            { text: '  Members: 247 active' },
            { text: '  Breaches: 2,847 successful' },
            { text: '' },
            { text: '  "Knowledge is power. Use it wisely."' },
            { text: '═══════════════════════════════════════════' }
        ];
    }
    
    cmdSudo(args) {
        if (!args[0]) {
            return [{ text: 'usage: sudo <command>', type: 'error' }];
        }
        return [
            { text: '[sudo] password for root: ' },
            { text: '✓ Authentication successful' },
            { text: `Executing: ${args.join(' ')}` },
            { text: 'Permission granted.' }
        ];
    }
    
    cmdExit() {
        return [
            { text: 'Closing session...' },
            { text: 'Clearing traces...' },
            { text: 'Terminating connection...' },
            { text: '' },
            { text: 'Goodbye, runner.', type: 'output' },
            { text: '' }
        ];
    }
}

// =====================================================
// GLITCH EFFECT MANAGER
// =====================================================

class GlitchManager {
    constructor() {
        this.overlay = document.getElementById('glitch-overlay');
        this.glitchElements = document.querySelectorAll('.glitch, .glitch-text');
        this.enabled = true;
        
        // Random glitch effect
        this.startRandomGlitch();
        
        // Scroll-based glitch
        this.setupScrollGlitch();
    }
    
    triggerGlitch() {
        if (!this.enabled) return;
        
        this.overlay.classList.add('active');
        
        this.glitchElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = '';
        });
        
        setTimeout(() => {
            this.overlay.classList.remove('active');
        }, 300);
    }
    
    startRandomGlitch() {
        setInterval(() => {
            if (Math.random() > 0.85) {
                this.triggerGlitch();
            }
        }, 3000);
    }
    
    setupScrollGlitch() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const scrollDelta = Math.abs(currentScroll - lastScroll);
            
            if (scrollDelta > 50 && Math.random() > 0.7) {
                this.triggerGlitch();
            }
            
            lastScroll = currentScroll;
        });
    }
}

// =====================================================
// TYPING EFFECT
// =====================================================

class TypingEffect {
    constructor(element) {
        this.element = element;
        this.text = element.dataset.text;
        this.speed = 30;
        this.init();
    }
    
    init() {
        // We'll just add the blinking cursor effect here
        // The actual typing happens via CSS
    }
}

// =====================================================
// CARD TILT EFFECT
// =====================================================

class CardTilt {
    constructor(card) {
        this.card = card;
        this.bounds = card.getBoundingClientRect();
        
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        
        card.addEventListener('mousemove', this.handleMouseMove);
        card.addEventListener('mouseleave', this.handleMouseLeave);
    }
    
    handleMouseMove(e) {
        const rect = this.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }
    
    handleMouseLeave() {
        this.card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// =====================================================
// SMOOTH SCROLL NAVIGATION
// =====================================================

class SmoothNav {
    constructor() {
        this.links = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state
                    this.links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            this.links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// =====================================================
// HEX GRID GENERATOR
// =====================================================

class HexGrid {
    constructor(container) {
        this.container = container;
        this.generate();
    }
    
    generate() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 300 300');
        
        const size = 20;
        const height = size * Math.sqrt(3);
        const width = size * 2;
        
        for (let row = -5; row <= 5; row++) {
            for (let col = -5; col <= 5; col++) {
                const x = col * width * 0.75 + 150;
                const y = row * height + (col % 2) * height / 2 + 150;
                
                const hex = this.createHexagon(x, y, size);
                svg.appendChild(hex);
            }
        }
        
        this.container.innerHTML = '';
        this.container.appendChild(svg);
    }
    
    createHexagon(cx, cy, size) {
        const points = [];
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = cx + size * Math.cos(angle);
            const y = cy + size * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points.join(' '));
        polygon.setAttribute('fill', 'none');
        polygon.setAttribute('stroke', '#00ff00');
        polygon.setAttribute('stroke-width', '0.5');
        polygon.setAttribute('opacity', '0.3');
        
        return polygon;
    }
}

// =====================================================
// MAIN INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix Code Rain
    const codeRainCanvas = document.getElementById('code-rain');
    if (codeRainCanvas) {
        const matrixRain = new MatrixRain(codeRainCanvas);
        matrixRain.start();
    }
    
    // Initialize System Clock
    const systemTime = document.getElementById('system-time');
    if (systemTime) {
        new SystemClock(systemTime);
    }
    
    // Initialize Stat Counters
    document.querySelectorAll('.stat-value').forEach(el => {
        const target = el.dataset.count;
        new StatCounter(el, target, 2000, target.includes('.') ? 1 : 0);
    });
    
    // Initialize Progress Bars
    document.querySelectorAll('.progress-fill').forEach(el => {
        new ProgressBar(el);
    });
    
    // Initialize Network Topology
    const networkCanvas = document.getElementById('network-canvas');
    if (networkCanvas) {
        new NetworkTopology(networkCanvas);
    }
    
    // Initialize Traffic Chart
    const trafficCanvas = document.getElementById('traffic-chart');
    if (trafficCanvas) {
        new TrafficChart(trafficCanvas);
    }
    
    // Initialize Terminal
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    
    if (terminalInput && terminalOutput && terminalBody) {
        new Terminal(terminalInput, terminalOutput, terminalBody);
    }
    
    // Initialize Glitch Manager
    new GlitchManager();
    
    // Initialize Card Tilt Effects
    document.querySelectorAll('[data-tilt]').forEach(card => {
        new CardTilt(card);
    });
    
    // Initialize Hex Grid
    const hexGrid = document.querySelector('.hex-grid');
    if (hexGrid) {
        new HexGrid(hexGrid);
    }
    
    // Initialize Smooth Navigation
    new SmoothNav();
    
    // Initialize Typing Effects
    document.querySelectorAll('.typing-effect').forEach(el => {
        new TypingEffect(el);
    });
    
    // Button click effects
    document.querySelectorAll('.btn, .btn-small').forEach(btn => {
        btn.addEventListener('click', () => {
            // Add ripple effect
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 100);
        });
    });
    
    // Network node hover effects
    document.querySelectorAll('.node').forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
        });
        node.addEventListener('mouseleave', () => {
            node.style.boxShadow = '';
        });
    });
    
    // Connection status pulse animation variation
    document.querySelectorAll('.conn-status').forEach((status, index) => {
        status.style.animationDelay = `${index * 0.2}s`;
    });
    
    console.log('%c NETRUNNER v3.7.4 ', 'background: #00ff00; color: #000; padding: 10px; font-family: monospace; font-weight: bold;');
    console.log('%c System initialized successfully ', 'color: #00ff00; font-family: monospace;');
});

// Prevent right-click context menu (for immersion)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus terminal
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.focus();
        }
    }
    
    // Ctrl/Cmd + G to trigger glitch
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        const overlay = document.getElementById('glitch-overlay');
        if (overlay) {
            overlay.classList.add('active');
            setTimeout(() => overlay.classList.remove('active'), 300);
        }
    }
});
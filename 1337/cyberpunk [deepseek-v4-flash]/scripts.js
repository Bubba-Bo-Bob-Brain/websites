// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-rain');
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.drops = [];
        
        this.init();
        this.animate();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const columns = Math.floor(this.canvas.width / this.fontSize);
        
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#39ff14';
        this.ctx.font = this.fontSize + 'px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillStyle = Math.random() > 0.98 ? '#00f3ff' : '#39ff14';
            this.ctx.fillText(char, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
        
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.init();
    }
}

// Terminal Emulator
class TerminalEmulator {
    constructor() {
        this.terminalBody = document.getElementById('terminal-body');
        this.terminalInput = document.getElementById('terminal-input');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.commands = {
            help: { desc: 'Show available commands', action: () => this.showHelp() },
            clear: { desc: 'Clear terminal', action: () => this.clearTerminal() },
            whoami: { desc: 'Display current user', action: () => this.whoami() },
            status: { desc: 'Show system status', action: () => this.showStatus() },
            scan: { desc: 'Scan network', action: () => this.scanNetwork() },
            encrypt: { desc: 'Encrypt data stream', action: () => this.encryptData() },
            matrix: { desc: 'Toggle matrix mode', action: () => this.toggleMatrix() },
            ping: { desc: 'Ping target system', action: () => this.pingTarget() },
            neofetch: { desc: 'Show system info', action: () => this.showNeofetch() },
            connect: { desc: 'Establish connection', action: () => this.connect() }
        };
        
        this.init();
    }

    init() {
        this.terminalInput.addEventListener('keydown', (e) => this.handleInput(e));
        this.addSystemMessage('WELCOME TO NEXUS TERMINAL v3.2.1');
        this.addSystemMessage('TYPE "help" FOR AVAILABLE COMMANDS');
        this.addSystemMessage('');
        
        // Focus input on click
        this.terminalBody.addEventListener('click', () => {
            this.terminalInput.focus();
        });
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.terminalInput.value.trim().toLowerCase();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
            }
            this.terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.terminalInput.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.terminalInput.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.terminalInput.value = '';
            }
        }
    }

    executeCommand(command) {
        const args = command.split(' ');
        const cmd = args[0];
        
        if (this.commands[cmd]) {
            this.commands[cmd].action(args.slice(1));
        } else if (cmd) {
            this.addErrorMessage(`COMMAND NOT FOUND: ${cmd}`);
        }
    }

    addMessage(content, type = 'system') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = `[${new Date().toLocaleTimeString()}]`;
        
        const contentSpan = document.createElement('span');
        contentSpan.className = 'content';
        contentSpan.textContent = content;
        
        line.appendChild(timestamp);
        line.appendChild(contentSpan);
        
        const inputLine = document.getElementById('terminal-input-line');
        this.terminalBody.insertBefore(line, inputLine);
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }

    addSystemMessage(content) {
        this.addMessage(content, 'system');
    }

    addSuccessMessage(content) {
        this.addMessage(content, 'success');
    }

    addErrorMessage(content) {
        this.addMessage(content, 'error');
    }

    showHelp() {
        this.addSystemMessage('');
        this.addSystemMessage('╔══════════════════════════════════╗');
        this.addSystemMessage('║       AVAILABLE COMMANDS         ║');
        this.addSystemMessage('╚══════════════════════════════════╝');
        this.addSystemMessage('');
        
        Object.entries(this.commands).forEach(([cmd, info]) => {
            const padding = ' '.repeat(Math.max(0, 15 - cmd.length));
            this.addSystemMessage(`  ${cmd}${padding}${info.desc}`);
        });
        
        this.addSystemMessage('');
    }

    clearTerminal() {
        const lines = this.terminalBody.querySelectorAll('.terminal-line');
        lines.forEach(line => line.remove());
    }

    whoami() {
        this.addSuccessMessage('USER: nexus_hacker');
        this.addSuccessMessage('GROUP: root');
        this.addSuccessMessage('ACCESS: FULL');
        this.addSuccessMessage('LOCATION: [REDACTED]');
    }

    showStatus() {
        const uptime = Math.floor(Math.random() * 720);
        const packets = Math.floor(Math.random() * 10000);
        const connections = Math.floor(Math.random() * 50);
        
        this.addSystemMessage('');
        this.addSystemMessage('╔══════════════════════════════════╗');
        this.addSystemMessage('║        SYSTEM STATUS            ║');
        this.addSystemMessage('╚══════════════════════════════════╝');
        this.addSystemMessage('');
        this.addSuccessMessage(`UPTIME: ${uptime} hours`);
        this.addSuccessMessage(`PACKETS PROCESSED: ${packets}`);
        this.addSuccessMessage(`ACTIVE CONNECTIONS: ${connections}`);
        this.addSuccessMessage(`ENCRYPTION: AES-256-GCM`);
        this.addSuccessMessage(`FIREWALL: ACTIVE`);
        this.addSuccessMessage(`INTRUSION DETECTION: MONITORING`);
        this.addSystemMessage('');
    }

    scanNetwork() {
        this.addSystemMessage('INITIATING NETWORK SCAN...');
        
        const targets = [
            '192.168.1.1', '192.168.1.5', '10.0.0.45',
            '10.0.0.78', '172.16.0.12', '172.16.0.34'
        ];
        
        let delay = 0;
        targets.forEach((target, index) => {
            setTimeout(() => {
                const open = Math.random() > 0.3;
                if (open) {
                    this.addSuccessMessage(`  ✓ ${target} - PORTS OPEN: 22, 80, 443, 8080`);
                } else {
                    this.addSystemMessage(`  ✗ ${target} - FIREWALL ACTIVE`);
                }
                
                if (index === targets.length - 1) {
                    this.addSystemMessage('');
                    this.addSuccessMessage('SCAN COMPLETE: 4 TARGETS VULNERABLE');
                }
            }, delay);
            delay += 500 + Math.random() * 500;
        });
    }

    encryptData() {
        const algorithms = ['AES-256', 'RSA-4096', 'Twofish', 'Serpent', 'ChaCha20'];
        const algorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
        
        this.addSystemMessage('ENCRYPTING DATA STREAM...');
        
        setTimeout(() => {
            this.addSuccessMessage(`ALGORITHM: ${algorithm}`);
            this.addSuccessMessage('KEY SIZE: 256 bits');
            this.addSuccessMessage('MODE: GCM');
            this.addSuccessMessage('STATUS: ENCRYPTED');
        }, 500);
    }

    toggleMatrix() {
        const matrix = document.getElementById('matrix-rain');
        matrix.style.opacity = matrix.style.opacity === '0' ? '0.15' : '0';
        this.addSuccessMessage('MATRIX MODE TOGGLED');
    }

    pingTarget() {
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        this.addSystemMessage(`PINGING ${ip}...`);
        
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const ms = Math.floor(Math.random() * 50 + 10);
                this.addSuccessMessage(`  REPLY FROM ${ip}: bytes=64 time=${ms}ms TTL=64`);
            }, (i + 1) * 400);
        }
        
        setTimeout(() => {
            this.addSystemMessage('');
            this.addSuccessMessage('PING STATISTICS: 4 PACKETS TRANSMITTED, 4 RECEIVED');
        }, 2000);
    }

    showNeofetch() {
        this.addSystemMessage('');
        this.addSystemMessage('╔══════════════════════════════════╗');
        this.addSystemMessage('║        SYSTEM INFORMATION       ║');
        this.addSystemMessage('╚══════════════════════════════════╝');
        this.addSystemMessage('');
        this.addSuccessMessage('OS: NEXUS-OS v3.2.1');
        this.addSuccessMessage('KERNEL: 6.1.0-nexus');
        this.addSuccessMessage('SHELL: nexus-shell 2.0');
        this.addSuccessMessage('CPU: Quantum Core x64');
        this.addSuccessMessage('GPU: Neural Processing Unit');
        this.addSuccessMessage('MEMORY: 64GB ECC RAM');
        this.addSuccessMessage('STORAGE: 2TB NVMe Encrypted');
        this.addSuccessMessage('NETWORK: Tor over VPN');
        this.addSystemMessage('');
    }

    connect() {
        const nodes = ['tor-exit-01', 'vpn-gateway-03', 'relay-node-07', 'bridge-node-12'];
        
        this.addSystemMessage('ESTABLISHING SECURE CONNECTION...');
        
        let delay = 0;
        nodes.forEach((node, index) => {
            setTimeout(() => {
                this.addSuccessMessage(`  ✓ CONNECTED TO ${node}`);
                
                if (index === nodes.length - 1) {
                    setTimeout(() => {
                        this.addSuccessMessage('');
                        this.addSuccessMessage('CONNECTION ESTABLISHED: 3 HOP TUNNEL ACTIVE');
                        this.addSuccessMessage('IP: [REDACTED]');
                        this.addSuccessMessage('LOCATION: [REDACTED]');
                    }, 300);
                }
            }, delay);
            delay += 600 + Math.random() * 400;
        });
    }
}

// Animated Counters
class AnimatedCounter {
    constructor(elementId, target, duration = 2000) {
        this.element = document.getElementById(elementId);
        this.target = target;
        this.duration = duration;
        this.current = 0;
        this.interval = null;
    }

    start() {
        const steps = 60;
        const increment = this.target / steps;
        const stepDuration = this.duration / steps;
        
        this.interval = setInterval(() => {
            this.current += increment;
            if (this.current >= this.target) {
                this.current = this.target;
                clearInterval(this.interval);
            }
            this.element.textContent = Math.floor(this.current).toLocaleString();
        }, stepDuration);
    }
}

// Data Stream Visualizations
class DataVisualization {
    constructor() {
        this.charts = [];
        this.initCharts();
    }

    initCharts() {
        const canvasIds = ['stat-chart-1', 'stat-chart-2', 'stat-chart-3'];
        
        canvasIds.forEach((id, index) => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const chart = {
                    canvas: canvas,
                    ctx: canvas.getContext('2d'),
                    data: this.generateData(20),
                    color: index === 0 ? '#39ff14' : index === 1 ? '#00f3ff' : '#ff00ff',
                    index: index
                };
                this.charts.push(chart);
                this.drawChart(chart);
            }
        });
    }

    generateData(count) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.random() * 60 + 10);
        }
        return data;
    }

    drawChart(chart) {
        const { ctx, canvas, data, color } = chart;
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw data line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        const stepX = width / (data.length - 1);
        
        data.forEach((value, index) => {
            const x = index * stepX;
            const y = height - (value / 80) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw fill
        ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        
        // Update data for animation
        chart.data.push(Math.random() * 60 + 10);
        chart.data.shift();
        
        setTimeout(() => this.drawChart(chart), 1000);
    }
}

// Glitch Effect Generator
class GlitchEffect {
    constructor() {
        this.overlay = document.getElementById('glitch-overlay');
        this.isGlitching = false;
        this.init();
    }

    init() {
        setInterval(() => this.triggerGlitch(), Math.random() * 10000 + 5000);
    }

    triggerGlitch() {
        if (this.isGlitching) return;
        this.isGlitching = true;
        
        this.overlay.style.display = 'block';
        this.overlay.style.background = `
            linear-gradient(0deg, 
                rgba(57, 255, 20, ${Math.random() * 0.1}) 0%, 
                transparent 10%, 
                transparent 90%, 
                rgba(255, 0, 255, ${Math.random() * 0.1}) 100%
            )
        `;
        this.overlay.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.style.transform = 'translate(0, 0)';
            this.isGlitching = false;
        }, 100 + Math.random() * 200);
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Start Matrix Rain
    const matrixRain = new MatrixRain();
    
    // Initialize Terminal
    const terminal = new TerminalEmulator();
    
    // Start Animated Counters
    const heroExploits = new AnimatedCounter('hero-exploits', 1337);
    const heroSystems = new AnimatedCounter('hero-systems', 42);
    const heroLines = new AnimatedCounter('hero-lines', 99999);
    
    const statPacket = new AnimatedCounter('stat-packet', 8542);
    const statUptime = new AnimatedCounter('stat-uptime', 720);
    const statNodes = new AnimatedCounter('stat-nodes', 128);
    
    // Start counters with Intersection Observer
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'hero') {
                    heroExploits.start();
                    heroSystems.start();
                    heroLines.start();
                } else if (entry.target.id === 'stats') {
                    statPacket.start();
                    statUptime.start();
                    statNodes.start();
                }
            }
        });
    }, observerOptions);
    
    const heroSection = document.getElementById('hero');
    const statsSection = document.getElementById('stats');
    
    if (heroSection) observer.observe(heroSection);
    if (statsSection) observer.observe(statsSection);
    
    // Initialize Data Visualizations
    const dataVis = new DataVisualization();
    
    // Initialize Glitch Effect
    const glitch = new GlitchEffect();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        matrixRain.resize();
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Global functions for button clicks
function openTerminal() {
    document.getElementById('terminal').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        document.getElementById('terminal-input').focus();
    }, 1000);
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Add error styles dynamically
const style = document.createElement('style');
style.textContent = `
    .terminal-line.error .content {
        color: #ff5555;
    }
    
    .terminal-line.error .timestamp {
        color: rgba(255, 85, 85, 0.5);
    }
    
    .glitch-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: overlay;
    }
`;
document.head.appendChild(style);
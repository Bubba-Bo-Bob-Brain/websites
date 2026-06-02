/* ============================================
   NEON PROTOCOL - CYBERPUNK JAVASCRIPT
   Retro-Futuristic Hacking Interface
   ============================================ */

// ============================================
// AUDIO SYSTEM - Retro Terminal Beeps
// ============================================
class CyberAudio {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    playKeypress() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.frequency.value = 800 + Math.random() * 200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playEnter() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.frequency.value = 600;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playBreach() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.5);
    }
}

const cyberAudio = new CyberAudio();

// ============================================
// MATRIX RAIN BACKGROUND
// ============================================
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono'`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TERMINAL EMULATOR
// ============================================
class Terminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.history = [];
        this.historyIndex = -1;
        
        this.commands = {
            help: () => this.print('AVAILABLE COMMANDS: help, clear, scan, breach, status, decrypt, connect, exit'),
            clear: () => this.clear(),
            scan: () => this.simulateScan(),
            breach: () => this.simulateBreach(),
            status: () => this.printSystemStatus(),
            decrypt: (args) => this.simulateDecrypt(args),
            connect: (args) => this.simulateConnect(args),
            exit: () => this.print('CONNECTION TERMINATED... JUST KIDDING. YOU CAN NEVER LEAVE.'),
            ls: () => this.print('drwxr-xr-x  exploits  payloads  logs  encrypted_data'),
            whoami: () => this.print('root@neon_protocol - SYSTEM ADMINISTRATOR'),
            date: () => this.print(new Date().toISOString())
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else {
                cyberAudio.playKeypress();
            }
        });

        this.input.focus();
        document.addEventListener('click', () => {
            if (document.getElementById('terminal-input')) {
                document.getElementById('terminal-input').focus();
            }
        });
    }

    print(text, type = 'system') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const now = new Date();
        timestamp.textContent = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        const content = document.createElement('span');
        content.className = type === 'error' ? 'error-msg' : 'system-msg';
        content.style.color = type === 'error' ? '#ff0040' : '#00ff41';
        content.textContent = text;
        
        line.appendChild(timestamp);
        line.appendChild(content);
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    printPrompt() {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="timestamp">[${new Date().toLocaleTimeString()}]</span> <span style="color:#00ff41">Command executed successfully</span>`;
        this.output.appendChild(line);
    }

    executeCommand() {
        const cmd = this.input.value.trim();
        if (!cmd) return;

        cyberAudio.playEnter();
        this.history.push(cmd);
        this.historyIndex = this.history.length;

        // Echo command
        const echoLine = document.createElement('div');
        echoLine.className = 'terminal-line';
        echoLine.innerHTML = `<span class="prompt">root@neon_protocol:~#</span> ${cmd}`;
        this.output.appendChild(echoLine);

        // Process command
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.print(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
        }

        this.input.value = '';
        this.output.scrollTop = this.output.scrollHeight;
    }

    navigateHistory(direction) {
        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex];
        } else if (direction === 1 && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex];
        } else if (direction === 1 && this.historyIndex === this.history.length - 1) {
            this.historyIndex++;
            this.input.value = '';
        }
    }

    clear() {
        this.output.innerHTML = '';
    }

    simulateScan() {
        this.print('INITIATING NETWORK SCAN...');
        setTimeout(() => this.print('Scanning ports 22, 80, 443, 8080...'), 500);
        setTimeout(() => this.print('Detected 4 open ports'), 1000);
        setTimeout(() => this.print('Vulnerability found: CVE-2077-0420 [CRITICAL]'), 1500);
        setTimeout(() => this.print('Scan complete. Recommend immediate breach.'), 2000);
    }

    simulateBreach() {
        this.print('INITIALIZING BREACH PROTOCOL...');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            this.print(`Breach progress: ${progress}%`);
            if (progress >= 100) {
                clearInterval(interval);
                this.print('BREACH SUCCESSFUL. ROOT ACCESS GRANTED.');
                cyberAudio.playBreach();
            }
        }, 300);
    }

    printSystemStatus() {
        this.print('SYSTEM STATUS: ONLINE');
        this.print(`CPU: ${Math.floor(Math.random() * 30 + 20)}%`);
        this.print(`MEMORY: ${Math.floor(Math.random() * 40 + 30)}%`);
        this.print(`NETWORK: ENCRYPTED`);
        this.print(`TRACE PROBABILITY: ${document.getElementById('trace-stat').textContent}`);
    }

    simulateDecrypt(args) {
        const target = args[0] || 'unknown_file';
        this.print(`Decrypting ${target}...`);
        setTimeout(() => {
            this.print(`Decryption key found: 0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`);
            this.print('File decrypted successfully.');
        }, 1000);
    }

    simulateConnect(args) {
        const host = args[0] || 'unknown_host';
        this.print(`Establishing connection to ${host}...`);
        setTimeout(() => {
            this.print(`Connected to ${host} via TOR node ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
        }, 800);
    }
}

// ============================================
// DATA STREAM VISUALIZATION
// ============================================
class DataStreamViz {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.nodes = [];
        this.packets = [];
        this.initNodes();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    initNodes() {
        for (let i = 0; i < 5; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw and update nodes
        this.ctx.fillStyle = '#00ff41';
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            this.ctx.fill();

            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        });

        // Random packets
        if (Math.random() < 0.05) {
            this.packets.push({
                x: 0,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 2
            });
        }

        this.ctx.fillStyle = '#39ff14';
        this.packets = this.packets.filter(packet => {
            packet.x += packet.speed;
            this.ctx.fillRect(packet.x, packet.y, 20, 2);
            return packet.x < this.canvas.width;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// BREACH PROTOCOL GAME
// ============================================
class BreachProtocol {
    constructor() {
        this.grid = document.getElementById('hex-grid');
        this.btn = document.getElementById('breach-btn');
        this.progress = document.getElementById('breach-progress');
        this.active = false;
        this.sequence = [];
        this.playerSequence = [];
        
        this.init();
    }

    init() {
        this.generateGrid();
        this.btn.addEventListener('click', () => this.startBreach());
    }

    generateGrid() {
        this.grid.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const hex = document.createElement('div');
            hex.className = 'hex';
            hex.dataset.index = i;
            hex.innerHTML = `<span style="font-size:0.7rem;z-index:1">${Math.floor(Math.random() * 16).toString(16).toUpperCase()}</span>`;
            hex.addEventListener('click', () => this.clickHex(i));
            this.grid.appendChild(hex);
        }
    }

    startBreach() {
        if (this.active) return;
        this.active = true;
        this.sequence = [];
        this.playerSequence = [];
        
        // Generate sequence
        for (let i = 0; i < 5; i++) {
            this.sequence.push(Math.floor(Math.random() * 12));
        }
        
        this.btn.disabled = true;
        this.btn.style.opacity = '0.5';
        this.playSequence();
    }

    playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= this.sequence.length) {
                clearInterval(interval);
                this.waitForInput();
                return;
            }
            this.activateHex(this.sequence[i]);
            i++;
        }, 800);
    }

    activateHex(index) {
        const hex = this.grid.children[index];
        hex.classList.add('active');
        cyberAudio.playKeypress();
        setTimeout(() => hex.classList.remove('active'), 400);
    }

    clickHex(index) {
        if (!this.active) return;
        
        this.activateHex(index);
        this.playerSequence.push(index);
        
        // Check correctness
        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            this.failBreach();
            return;
        }
        
        // Update progress
        const segments = this.progress.querySelectorAll('.segment');
        segments[this.playerSequence.length - 1].classList.add('active');
        
        if (this.playerSequence.length === this.sequence.length) {
            this.completeBreach();
        }
    }

    waitForInput() {
        this.progress.querySelector('.progress-text').textContent = 'AWAITING INPUT...';
    }

    failBreach() {
        this.active = false;
        this.progress.querySelector('.progress-text').textContent = 'BREACH FAILED';
        this.progress.querySelector('.progress-text').style.color = '#ff0040';
        cyberAudio.playEnter();
        
        setTimeout(() => {
            this.resetBreach();
        }, 2000);
    }

    completeBreach() {
        this.active = false;
        this.progress.querySelector('.progress-text').textContent = 'ACCESS GRANTED';
        this.progress.querySelector('.progress-text').style.color = '#00ff41';
        cyberAudio.playBreach();
        
        // Visual celebration
        for (let i = 0; i < 12; i++) {
            setTimeout(() => this.activateHex(i), i * 50);
        }
        
        setTimeout(() => {
            this.resetBreach();
        }, 3000);
    }

    resetBreach() {
        this.active = false;
        this.sequence = [];
        this.playerSequence = [];
        this.btn.disabled = false;
        this.btn.style.opacity = '1';
        this.progress.querySelector('.progress-text').textContent = 'STANDBY';
        this.progress.querySelector('.progress-text').style.color = '#888';
        this.progress.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));
        this.generateGrid();
    }
}

// ============================================
// GLITCH EFFECTS MANAGER
// ============================================
class GlitchManager {
    constructor() {
        this.elements = document.querySelectorAll('.glitch-wrapper');
        this.init();
    }

    init() {
        // Random glitch triggers
        setInterval(() => {
            const random = Math.floor(Math.random() * this.elements.length);
            this.triggerGlitch(this.elements[random]);
        }, 5000);

        // Hover glitch intensification
        this.elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.animation = 'glitch-bg 0.2s infinite';
            });
            el.addEventListener('mouseleave', () => {
                el.style.animation = '';
            });
        });
    }

    triggerGlitch(element) {
        element.style.transform = 'translate(2px, 2px)';
        setTimeout(() => {
            element.style.transform = 'translate(-2px, -2px)';
            setTimeout(() => {
                element.style.transform = '';
            }, 100);
        }, 100);
    }
}

// ============================================
// SYSTEM CLOCK & STATS
// ============================================
function updateSystemClock() {
    const clock = document.getElementById('system-clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
}

function updateUptime() {
    const uptime = document.getElementById('uptime');
    if (uptime && window.startTime) {
        const diff = Math.floor((Date.now() - window.startTime) / 1000);
        const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const seconds = String(diff % 60).padStart(2, '0');
        uptime.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

function fluctuateStats() {
    const trace = document.getElementById('trace-stat');
    if (trace && Math.random() > 0.7) {
        const current = parseInt(trace.textContent);
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = Math.max(0, Math.min(99, current + change));
        trace.textContent = newVal + '%';
        trace.style.color = newVal > 50 ? '#ff0040' : '#00ff41';
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Record start time
    window.startTime = Date.now();

    // Initialize Matrix Rain
    new MatrixRain('matrix-rain');

    // Initialize Terminal
    setTimeout(() => {
        new Terminal();
    }, 3500); // Wait for boot sequence

    // Initialize Data Stream
    new DataStreamViz('data-stream-canvas');

    // Initialize Breach Protocol
    new BreachProtocol();

    // Initialize Glitch Manager
    new GlitchManager();

    // Boot sequence removal
    setTimeout(() => {
        const boot = document.getElementById('boot-sequence');
        if (boot) {
            boot.classList.add('hidden');
            setTimeout(() => boot.remove(), 500);
        }
    }, 3000);

    // Start clocks
    setInterval(updateSystemClock, 1000);
    setInterval(updateUptime, 1000);
    setInterval(fluctuateStats, 2000);
    updateSystemClock();

    // Latency fluctuation
    setInterval(() => {
        const latency = document.getElementById('latency');
        if (latency) {
            latency.textContent = Math.floor(Math.random() * 20 + 5) + 'ms';
        }
    }, 3000);

    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.hologram-ring').forEach((ring, i) => {
            const speed = (i + 1) * 10;
            ring.style.transform = `translate(-50%, -50%) rotateX(60deg) rotateZ(${(x * speed)}deg)`;
        });
    });

    // Navigation smooth scroll with glitch effect
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                // Glitch transition
                document.body.style.transform = 'translate(2px, 2px)';
                setTimeout(() => {
                    document.body.style.transform = '';
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        });
    });

    // Arsenal card interactions
    document.querySelectorAll('.arsenal-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            cyberAudio.playKeypress();
            const fill = card.querySelector('.progress-fill');
            if (fill) {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => fill.style.width = width, 100);
            }
        });
    });

    // Console easter egg
    console.log('%cNEON PROTOCOL v2.0.77', 'color: #00ff41; font-size: 20px; font-family: monospace');
    console.log('%cSystem Status: COMPROMISED', 'color: #ff0040; font-size: 14px;');
    console.log('%c> Unauthorized access detected. Tracing location...', 'color: #00ff41;');
});

// Prevent context menu for extra immersion
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        console.log('Context menu blocked by security protocol ICE-9');
    }
});
/* ============================================
   GHOST_PROTOCOL // CYBERPUNK JAVASCRIPT
   ============================================ */

// ============================================
// MATRIX CODE RAIN
// ============================================
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / 14);
        this.drops = Array(this.columns).fill(1);
    }
    
    init() {
        this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|\\/*-+=~!@#$%^&';
        this.fontSize = 14;
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 12, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono', monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Randomize color between lime and cyan
            if (Math.random() > 0.95) {
                this.ctx.fillStyle = '#00ffff';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ffff';
            } else {
                this.ctx.fillStyle = '#39ff14';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#39ff14';
            }
            
            this.ctx.fillText(char, x, y);
            this.ctx.shadowBlur = 0;
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TERMINAL SYSTEM
// ============================================
class Terminal {
    constructor(outputEl, inputEl) {
        this.output = outputEl;
        this.input = inputEl;
        this.history = [];
        this.historyIndex = -1;
        this.commands = this.initCommands();
        
        this.setupListeners();
    }
    
    initCommands() {
        return {
            help: () => {
                return [
                    { prefix: '[HELP]', text: 'Available commands:', type: 'system' },
                    { prefix: '', text: '  help      - Display this help message', type: 'info' },
                    { prefix: '', text: '  clear     - Clear terminal output', type: 'info' },
                    { prefix: '', text: '  whoami    - Display current user info', type: 'info' },
                    { prefix: '', text: '  status    - Show system status', type: 'info' },
                    { prefix: '', text: '  scan      - Scan network nodes', type: 'info' },
                    { prefix: '', text: '  breach    - Attempt system breach', type: 'info' },
                    { prefix: '', text: '  decrypt   - Decrypt captured data', type: 'info' },
                    { prefix: '', text: '  trace     - Run trace protocol', type: 'info' },
                    { prefix: '', text: '  history   - Show command history', type: 'info' },
                    { prefix: '', text: '  date      - Display current timestamp', type: 'info' },
                    { prefix: '', text: '  matrix    - Toggle matrix rain intensity', type: 'info' },
                    { prefix: '', text: '  exit      - Close terminal session', type: 'info' }
                ];
            },
            
            clear: () => {
                this.output.innerHTML = '';
                return [];
            },
            
            whoami: () => {
                return [
                    { prefix: '[SYS]', text: 'USER: ghost_operator', type: 'lime' },
                    { prefix: '[SYS]', text: 'UID: 0x7F3A9E2C', type: 'cyan' },
                    { prefix: '[SYS]', text: 'CLEARANCE: LEVEL_OMEGA', type: 'magenta' },
                    { prefix: '[SYS]', text: 'SESSION: ' + this.generateHash(), type: 'dim' }
                ];
            },
            
            status: () => {
                const uptime = Math.floor(Math.random() * 9999) + 1000;
                const memory = (Math.random() * 50 + 20).toFixed(1);
                const cpu = (Math.random() * 30 + 5).toFixed(1);
                
                return [
                    { prefix: '[STATUS]', text: '╔════════════════════════════════════╗', type: 'lime' },
                    { prefix: '[STATUS]', text: '║     SYSTEM STATUS REPORT          ║', type: 'lime' },
                    { prefix: '[STATUS]', text: '╠════════════════════════════════════╣', type: 'lime' },
                    { prefix: '[STATUS]', text: `║ UPTIME:    ${uptime}s               ║`, type: 'cyan' },
                    { prefix: '[STATUS]', text: `║ MEMORY:    ${memory}%               ║`, type: 'cyan' },
                    { prefix: '[STATUS]', text: `║ CPU:       ${cpu}%                ║`, type: 'cyan' },
                    { prefix: '[STATUS]', text: `║ NODES:     ${Math.floor(Math.random() * 100 + 50)} active           ║`, type: 'cyan' },
                    { prefix: '[STATUS]', text: `║ THREATS:   0 detected             ║`, type: 'lime' },
                    { prefix: '[STATUS]', text: '╚════════════════════════════════════╝', type: 'lime' }
                ];
            },
            
            scan: () => {
                const nodes = this.generateNodes();
                return [
                    { prefix: '[SCAN]', text: 'Initiating network scan...', type: 'yellow' },
                    { prefix: '[SCAN]', text: '████████████████████████ 100%', type: 'lime' },
                    { prefix: '[SCAN]', text: '', type: '' },
                    ...nodes.map(n => ({ prefix: '[NODE]', text: n, type: 'cyan' })),
                    { prefix: '[SCAN]', text: `Scan complete. ${nodes.length} nodes found.`, type: 'lime' }
                ];
            },
            
            breach: () => {
                const success = Math.random() > 0.3;
                if (success) {
                    return [
                        { prefix: '[BREACH]', text: 'Target acquired: MEGACORP_MAINFRAME', type: 'yellow' },
                        { prefix: '[BREACH]', text: 'Exploiting CVE-2087-1337...', type: 'yellow' },
                        { prefix: '[BREACH]', text: 'Bypassing firewall...', type: 'cyan' },
                        { prefix: '[BREACH]', text: 'Injecting payload...', type: 'cyan' },
                        { prefix: '[BREACH]', text: '', type: '' },
                        { prefix: '[SUCCESS]', text: 'BREACH SUCCESSFUL', type: 'lime' },
                        { prefix: '[SUCCESS]', text: 'Root access granted. Ghost protocol active.', type: 'lime' }
                    ];
                } else {
                    return [
                        { prefix: '[BREACH]', text: 'Target acquired: SECURE_NODE_7', type: 'yellow' },
                        { prefix: '[BREACH]', text: 'Exploiting CVE-2087-4421...', type: 'yellow' },
                        { prefix: '[ALERT]', text: 'DETECTION TRIGGERED', type: 'red' },
                        { prefix: '[ALERT]', text: 'Countermeasures engaged. Aborting...', type: 'red' },
                        { prefix: '[BREACH]', text: 'Disconnecting...', type: 'dim' }
                    ];
                }
            },
            
            decrypt: () => {
                const hash = this.generateHash();
                return [
                    { prefix: '[CRYPT]', text: 'Loading encrypted payload...', type: 'magenta' },
                    { prefix: '[CRYPT]', text: `Hash: ${hash}`, type: 'dim' },
                    { prefix: '[CRYPT]', text: 'Applying quantum decryption...', type: 'magenta' },
                    { prefix: '[CRYPT]', text: '████████████████████████ 100%', type: 'lime' },
                    { prefix: '[CRYPT]', text: '', type: '' },
                    { prefix: '[DECRYPTED]', text: 'OPERATION_NIGHTFALL confirmed', type: 'lime' },
                    { prefix: '[DECRYPTED]', text: 'Coordinates: ███.████, ███.████', type: 'cyan' },
                    { prefix: '[DECRYPTED]', text: 'Date: 2087.12.21_00:00:00', type: 'cyan' }
                ];
            },
            
            trace: () => {
                return [
                    { prefix: '[TRACE]', text: 'Running trace protocol...', type: 'yellow' },
                    { prefix: '[TRACE]', text: 'Routing through proxy chain...', type: 'dim' },
                    { prefix: '[TRACE]', text: 'Node 1: TOR_RELAY_7X [OK]', type: 'cyan' },
                    { prefix: '[TRACE]', text: 'Node 2: VPN_EXIT_3A [OK]', type: 'cyan' },
                    { prefix: '[TRACE]', text: 'Node 3: SATELLITE_UPLINK [OK]', type: 'cyan' },
                    { prefix: '[TRACE]', text: 'Node 4: GHOST_RELAY [OK]', type: 'cyan' },
                    { prefix: '[TRACE]', text: '', type: '' },
                    { prefix: '[TRACE]', text: 'Trace result: ROUTE_OBFUSCATED', type: 'lime' },
                    { prefix: '[TRACE]', text: 'Your connection is secure.', type: 'lime' }
                ];
            },
            
            history: () => {
                if (this.history.length === 0) {
                    return [{ prefix: '[HIST]', text: 'No command history.', type: 'dim' }];
                }
                return [
                    { prefix: '[HIST]', text: 'Command history:', type: 'yellow' },
                    ...this.history.slice(-10).map((cmd, i) => ({
                        prefix: '',
                        text: `  ${i + 1}. ${cmd}`,
                        type: 'dim'
                    }))
                ];
            },
            
            date: () => {
                const now = new Date();
                const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                return [
                    { prefix: '[TIME]', text: `Current timestamp: ${formatted}`, type: 'cyan' },
                    { prefix: '[TIME]', text: `Epoch: ${Math.floor(now.getTime() / 1000)}`, type: 'dim' }
                ];
            },
            
            matrix: () => {
                if (window.matrixRain) {
                    const currentOpacity = parseFloat(window.matrixRain.canvas.style.opacity) || 0.12;
                    const newOpacity = currentOpacity >= 0.3 ? 0.05 : currentOpacity + 0.08;
                    window.matrixRain.canvas.style.opacity = newOpacity;
                    return [
                        { prefix: '[MATRIX]', text: `Rain intensity: ${Math.round(newOpacity * 100)}%`, type: 'lime' }
                    ];
                }
                return [{ prefix: '[ERROR]', text: 'Matrix system not available.', type: 'red' }];
            },
            
            exit: () => {
                return [
                    { prefix: '[SYSTEM]', text: 'Closing terminal session...', type: 'yellow' },
                    { prefix: '[SYSTEM]', text: 'Goodbye, ghost operator.', type: 'dim' },
                    { prefix: '[SYSTEM]', text: 'Connection terminated.', type: 'red' }
                ];
            }
        };
    }
    
    generateHash() {
        return '0x' + Array.from({ length: 8 }, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('').toUpperCase();
    }
    
    generateNodes() {
        const prefixes = ['CORP', 'GOV', 'MIL', 'NODE', 'RELAY', 'GATEWAY', 'PROXY'];
        const count = Math.floor(Math.random() * 5) + 3;
        const nodes = [];
        
        for (let i = 0; i < count; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
            const status = Math.random() > 0.2 ? 'ACTIVE' : 'SECURED';
            nodes.push(`${ip} // ${prefix}_${Math.floor(Math.random() * 99)} [${status}]`);
        }
        
        return nodes;
    }
    
    setupListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim().toLowerCase();
                this.input.value = '';
                
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.executeCommand(cmd);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.input.value = '';
                }
            }
        });
        
        // Focus input when clicking terminal
        document.querySelector('.terminal-container').addEventListener('click', () => {
            this.input.focus();
        });
    }
    
    executeCommand(cmd) {
        // Add user input line
        this.addLine(`<span class="text-lime">ghost</span>@<span class="text-cyan">mainframe</span>:<span class="text-magenta">~</span>$ ${cmd}`, 'user');
        
        // Process command
        const command = cmd.split(' ')[0];
        
        if (this.commands[command]) {
            const lines = this.commands[command]();
            lines.forEach((line, index) => {
                setTimeout(() => {
                    this.addLine(line.text, line.type, line.prefix);
                }, index * 50);
            });
        } else if (command) {
            this.addLine(`Command not found: ${command}. Type 'help' for available commands.`, 'error', '[ERROR]');
        }
    }
    
    addLine(text, type = '', prefix = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        let prefixClass = '';
        let textClass = '';
        
        switch (type) {
            case 'lime': textClass = 'text-lime'; break;
            case 'cyan': textClass = 'text-cyan'; break;
            case 'magenta': textClass = 'text-magenta'; break;
            case 'red': textClass = 'text-red'; break;
            case 'yellow': textClass = 'text-yellow'; break;
            case 'dim': textClass = 'text-dim'; break;
            case 'error': textClass = 'text-red'; break;
            case 'system': textClass = 'text-cyan'; break;
            case 'user': textClass = ''; break;
            default: textClass = 'text-primary';
        }
        
        const prefixHtml = prefix ? `<span class="line-prefix">${prefix}</span>` : '';
        
        line.innerHTML = `${prefixHtml}<span class="line-text ${textClass}">${text}</span>`;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// ============================================
// TYPING EFFECT
// ============================================
class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 80;
        this.deleteSpeed = options.deleteSpeed || 40;
        this.pauseTime = options.pauseTime || 2000;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.currentCharIndex--;
            this.element.textContent = currentText.substring(0, this.currentCharIndex);
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 300);
            } else {
                setTimeout(() => this.type(), this.deleteSpeed);
            }
        } else {
            this.currentCharIndex++;
            this.element.textContent = currentText.substring(0, this.currentCharIndex);
            
            if (this.currentCharIndex === currentText.length) {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.pauseTime);
            } else {
                setTimeout(() => this.type(), this.speed);
            }
        }
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
    constructor() {
        this.observed = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.counter').forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutQuart(progress);
            const current = target * eased;
            
            if (isDecimal) {
                element.textContent = current.toFixed(3) + suffix;
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}

// ============================================
// STAT BAR ANIMATION
// ============================================
class StatBarAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.stat-bar-fill');
                    if (fill) {
                        const width = fill.dataset.width;
                        setTimeout(() => {
                            fill.style.width = width + '%';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.stat-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// ============================================
// LIVE CHARTS
// ============================================
class LiveChart {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.data = [];
        this.maxPoints = options.maxPoints || 100;
        this.color = options.color || '#39ff14';
        this.secondaryColor = options.secondaryColor || '#00ffff';
        this.type = options.type || 'line';
        this.min = options.min || 0;
        this.max = options.max || 100;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Initialize with some data
        for (let i = 0; i < this.maxPoints; i++) {
            this.data.push(this.randomValue());
        }
        
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }
    
    randomValue() {
        return Math.random() * (this.max - this.min) + this.min;
    }
    
    addPoint(value) {
        this.data.push(value);
        if (this.data.length > this.maxPoints) {
            this.data.shift();
        }
    }
    
    animate() {
        // Add new data point
        this.addPoint(this.randomValue());
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw based on type
        if (this.type === 'line') {
            this.drawLine();
        } else if (this.type === 'waveform') {
            this.drawWaveform();
        }
        
        setTimeout(() => requestAnimationFrame(() => this.animate()), 50);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let i = 0; i <= 4; i++) {
            const y = (this.height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        
        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = (this.width / 10) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
    }
    
    drawLine() {
        const stepX = this.width / (this.maxPoints - 1);
        
        // Draw gradient fill
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        
        this.data.forEach((value, i) => {
            const x = i * stepX;
            const y = this.height - ((value - this.min) / (this.max - this.min)) * this.height;
            if (i === 0) {
                this.ctx.lineTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(57, 255, 20, 0.3)');
        gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw line
        this.ctx.beginPath();
        this.data.forEach((value, i) => {
            const x = i * stepX;
            const y = this.height - ((value - this.min) / (this.max - this.min)) * this.height;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.color;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        // Draw current value dot
        const lastX = (this.data.length - 1) * stepX;
        const lastY = this.height - ((this.data[this.data.length - 1] - this.min) / (this.max - this.min)) * this.height;
        
        this.ctx.beginPath();
        this.ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    drawWaveform() {
        const centerY = this.height / 2;
        const amplitude = this.height * 0.4;
        
        // Generate oscillating waveform
        this.ctx.beginPath();
        
        for (let i = 0; i < this.width; i++) {
            const dataIndex = Math.floor((i / this.width) * this.data.length);
            const value = this.data[dataIndex] || 50;
            const normalizedValue = (value - this.min) / (this.max - this.min);
            
            const frequency = 0.02 + (normalizedValue * 0.05);
            const currentAmplitude = amplitude * (0.3 + normalizedValue * 0.7);
            const phase = (Date.now() / 100) * 0.1;
            
            const y = centerY + Math.sin(i * frequency + phase) * currentAmplitude * Math.sin(i * 0.01 + Date.now() / 2000);
            
            if (i === 0) {
                this.ctx.moveTo(i, y);
            } else {
                this.ctx.lineTo(i, y);
            }
        }
        
        this.ctx.strokeStyle = this.secondaryColor;
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.secondaryColor;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        // Draw secondary wave
        this.ctx.beginPath();
        
        for (let i = 0; i < this.width; i++) {
            const dataIndex = Math.floor((i / this.width) * this.data.length);
            const value = this.data[dataIndex] || 50;
            const normalizedValue = (value - this.min) / (this.max - this.min);
            
            const frequency = 0.03 + (normalizedValue * 0.03);
            const currentAmplitude = amplitude * 0.5 * (0.5 + normalizedValue * 0.5);
            const phase = (Date.now() / 150) * 0.15;
            
            const y = centerY + Math.cos(i * frequency + phase) * currentAmplitude;
            
            if (i === 0) {
                this.ctx.moveTo(i, y);
            } else {
                this.ctx.lineTo(i, y);
            }
        }
        
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.5;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = this.color;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    }
}

// ============================================
// DATA STREAM GENERATOR
// ============================================
class DataStream {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.types = ['EXFIL', 'INFIL', 'CRYPT', 'SCAN', 'ALERT'];
        this.messages = this.initMessages();
        this.maxLines = 100;
        this.running = true;
        
        this.start();
    }
    
    initMessages() {
        return {
            EXFIL: [
                'Data packet extracted: 2.4TB from MEGACORP_DB',
                'Siphoning user credentials... [OK]',
                'Exfiltrating financial records...',
                'Chunk transfer complete: 847MB/s',
                'Database dump: CLIENT_DATA_2087 encrypted',
                'Binary payload exfiltrated via covert channel'
            ],
            INFIL: [
                'Firewall bypassed: SECTOR_7G',
                'Backdoor installed: /usr/lib/.ghost',
                'Rootkit deployed on target system',
                'SSH tunnel established: 256-bit encrypted',
                'Privilege escalation successful',
                'Zero-day exploit injected: CVE-2087-9999'
            ],
            CRYPT: [
                'Decrypting RSA-4096 key exchange...',
                'Hash collision found: 0x7F3A9E2C',
                'Quantum cipher key rotated',
                'SSL/TLS handshake intercepted',
                'Certificate forged: *.megacorp.net',
                'Encrypted payload decoded: AES-512'
            ],
            SCAN: [
                'Port scan: 192.168.XX.XX [12 open]',
                'Vulnerability detected: CVE-2087-1337',
                'Network topology mapped: 47 nodes',
                'OS fingerprint: Linux 8.2.1-custom',
                'Service detection: Apache/9.1',
                'WAF bypass technique identified'
            ],
            ALERT: [
                'WARNING: IDS anomaly detected',
                'ALERT: Counter-intrusion measures active',
                'NOTICE: Proxy rotation complete',
                'WARNING: Honeypot detected and avoided',
                'ALERT: Trace attempt blocked',
                'NOTICE: Anti-forensics engaged'
            ]
        };
    }
    
    generateTimestamp() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    }
    
    generateLine() {
        const type = this.types[Math.floor(Math.random() * this.types.length)];
        const messages = this.messages[type];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const timestamp = this.generateTimestamp();
        
        return {
            type,
            message,
            timestamp
        };
    }
    
    addLine() {
        const { type, message, timestamp } = this.generateLine();
        
        const line = document.createElement('div');
        line.className = 'stream-line';
        line.innerHTML = `
            <span class="stream-timestamp">[${timestamp}]</span>
            <span class="stream-type ${type}">${type}</span>
            <span class="stream-data">${message}</span>
        `;
        
        this.container.appendChild(line);
        
        // Remove old lines if exceeding max
        while (this.container.children.length > this.maxLines) {
            this.container.removeChild(this.container.firstChild);
        }
        
        // Auto-scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    start() {
        const addLineWithRandomDelay = () => {
            if (!this.running) return;
            
            this.addLine();
            const delay = Math.random() * 500 + 200; // 200-700ms
            setTimeout(addLineWithRandomDelay, delay);
        };
        
        addLineWithRandomDelay();
    }
    
    stop() {
        this.running = false;
    }
}

// ============================================
// DATA VISUALIZATION CANVAS
// ============================================
class DataVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.numParticles = 50;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.animate();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                color: Math.random() > 0.5 ? '#39ff14' : '#00ffff'
            });
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 12, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    const opacity = (1 - dist / 100) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(57, 255, 20, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
class NavigationEffect {
    constructor() {
        this.nav = document.getElementById('nav');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    onScroll() {
        // Add scrolled class
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        // Update active link
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// BANDWIDTH DISPLAY
// ============================================
class BandwidthDisplay {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        
        this.update();
    }
    
    update() {
        const bandwidth = (Math.random() * 500 + 500).toFixed(1);
        this.element.textContent = `${bandwidth} TB/s`;
        setTimeout(() => this.update(), 2000);
    }
}

// ============================================
// FOOTER TIMESTAMP
// ============================================
class FooterTimestamp {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        
        this.update();
    }
    
    update() {
        const now = new Date();
        const formatted = `SYS_TIME: ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        this.element.textContent = formatted;
        setTimeout(() => this.update(), 1000);
    }
}

// ============================================
// RANDOM GLITCH EFFECT
// ============================================
class GlitchEffect {
    constructor() {
        this.elements = document.querySelectorAll('.glitch-text');
        this.init();
    }
    
    init() {
        setInterval(() => {
            this.elements.forEach(el => {
                if (Math.random() > 0.95) {
                    el.style.animation = 'glitch-skew 0.3s ease';
                    setTimeout(() => {
                        el.style.animation = '';
                    }, 300);
                }
            });
        }, 100);
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Matrix Rain
    const matrixCanvas = document.getElementById('matrix-rain');
    if (matrixCanvas) {
        window.matrixRain = new MatrixRain(matrixCanvas);
        window.matrixRain.animate();
    }
    
    // Terminal
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    if (terminalOutput && terminalInput) {
        new Terminal(terminalOutput, terminalInput);
    }
    
    // Typing Effect
    const heroTyping = document.getElementById('hero-typing');
    if (heroTyping) {
        new TypingEffect(heroTyping, [
            'Specializing in network infiltration',
            'Zero-trace operations worldwide',
            'Your digital ghost in the machine',
            'Breaking barriers since 2084',
            'Encrypted. Undetected. Unstoppable.'
        ], {
            speed: 60,
            deleteSpeed: 30,
            pauseTime: 2500
        });
    }
    
    // Counter Animation
    new CounterAnimation();
    
    // Stat Bar Animation
    new StatBarAnimation();
    
    // Live Charts
    new LiveChart('traffic-chart', {
        maxPoints: 80,
        color: '#39ff14',
        type: 'line',
        min: 0,
        max: 100
    });
    
    new LiveChart('waveform-chart', {
        maxPoints: 100,
        color: '#39ff14',
        secondaryColor: '#00ffff',
        type: 'waveform',
        min: 0,
        max: 100
    });
    
    // Data Stream
    new DataStream('data-stream');
    
    // Data Visualization
    new DataVisualization('data-viz-canvas');
    
    // Navigation Effect
    new NavigationEffect();
    
    // Bandwidth Display
    new BandwidthDisplay('bandwidth-display');
    
    // Footer Timestamp
    new FooterTimestamp('footer-time');
    
    // Glitch Effect
    new GlitchEffect();
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('%c[GHOST_PROTOCOL]', 'color: #39ff14; font-size: 16px; font-weight: bold;');
    console.log('%cSystem initialized. Welcome, ghost operator.', 'color: #00ffff;');
});
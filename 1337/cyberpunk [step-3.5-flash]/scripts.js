// NEXUS Terminal - Cyberpunk Hacking Interface
// Main JavaScript controller

class NexusTerminal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.uptimeSeconds = 0;
        this.intrusionCount = 0;
        this.isProcessing = false;
        
        this.init();
    }
    
    init() {
        this.setupMatrixRain();
        this.setupTerminal();
        this.setupDataStreams();
        this.setupDashboard();
        this.setupUptime();
        this.setupGlitchEffects();
        this.startSimulation();
        
        // Initial terminal message
        this.typeOutput('NEXUS terminal online. Welcome, operator.', 'system');
        this.typeOutput('Type "help" to see available commands.', 'system');
    }
    
    // Matrix Rain Effect
    setupMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01010101XYZ{}[]<>=+/*-!@#$%^&*()_+|~?/';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#39ff14';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 50);
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Terminal Setup
    setupTerminal() {
        const input = document.getElementById('command-input');
        const terminalBody = document.getElementById('terminal-output');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    this.executeCommand(command);
                    input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.commandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    input.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    input.value = '';
                }
            }
        });
        
        // Focus terminal on click anywhere
        document.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-window')) {
                input.focus();
            }
        });
    }
    
    // Execute Terminal Commands
    executeCommand(command) {
        this.typeOutput(`$ ${command}`, 'command');
        
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'scan':
                this.performScan();
                break;
            case 'status':
                this.showStatus();
                break;
            case 'clear':
            case 'cls':
                this.clearTerminal();
                break;
            case 'hack':
                this.simulateHack(args);
                break;
            case 'firewall':
                this.toggleFirewall();
                break;
            case 'encrypt':
                this.showEncryption();
                break;
            case 'traffic':
                this.showTraffic();
                break;
            case 'uptime':
                this.showUptime();
                break;
            case 'matrix':
                this.toggleMatrix();
                break;
            case 'glitch':
                this.triggerGlitch();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'reboot':
                this.rebootSystem();
                break;
            default:
                this.typeOutput(`Command not found: ${cmd}. Type "help" for commands.`, 'error');
        }
    }
    
    typeOutput(text, className = '') {
        const terminalBody = document.getElementById('terminal-output');
        const p = document.createElement('p');
        p.className = className;
        p.textContent = text;
        terminalBody.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    showHelp() {
        const commands = [
            'AVAILABLE COMMANDS:',
            '  help     - Show this help message',
            '  scan     - Perform security scan',
            '  status   - Display system status',
            '  hack     - Simulate hacking attempt',
            '  firewall - Toggle firewall status',
            '  encrypt  - Show encryption info',
            '  traffic  - Display network traffic',
            '  uptime   - Show system uptime',
            '  matrix   - Toggle matrix rain effect',
            '  glitch   - Trigger glitch effect',
            '  about    - About NEXUS system',
            '  clear    - Clear terminal screen',
            '  reboot   - Reboot terminal'
        ];
        
        commands.forEach(cmd => {
            this.typeOutput(cmd, 'command-output');
        });
    }
    
    async performScan() {
        this.typeOutput('Initializing deep system scan...', 'system');
        
        const panels = ['panel-network', 'panel-system', 'panel-security'];
        panels.forEach((panel, index) => {
            setTimeout(() => {
                const element = document.getElementById(panel);
                element.style.boxShadow = '0 0 30px rgba(57, 255, 20, 0.5)';
                setTimeout(() => {
                    element.style.boxShadow = '';
                }, 500);
            }, index * 500);
        });
        
        await this.delay(1000);
        this.typeOutput('Scanning network ports...', 'system');
        await this.delay(800);
        this.typeOutput('Checking firewall integrity...', 'system');
        await this.delay(800);
        this.typeOutput('Analyzing system processes...', 'system');
        await this.delay(800);
        this.typeOutput('Verifying encryption protocols...', 'system');
        await this.delay(800);
        
        const threats = Math.floor(Math.random() * 5);
        if (threats > 0) {
            this.typeOutput(`⚠️  Detected ${threats} potential threat${threats > 1 ? 's' : ''}!`, 'warning');
            this.intrusionCount += threats;
            document.getElementById('intrusion-count').textContent = this.intrusionCount;
        } else {
            this.typeOutput('✅ No threats detected. System secure.', 'success');
        }
        
        this.typeOutput('Scan complete. All systems operational.', 'success');
    }
    
    showStatus() {
        const cpu = document.getElementById('cpu-usage');
        const mem = document.getElementById('mem-usage');
        const packets = document.getElementById('packet-count');
        const throughput = document.getElementById('throughput');
        
        this.typeOutput('=== SYSTEM STATUS ===', 'command-output');
        this.typeOutput(`CPU Usage: ${cpu.textContent}%`, cpu.textContent > 80 ? 'warning' : '');
        this.typeOutput(`Memory: ${mem.textContent}%`, mem.textContent > 80 ? 'warning' : '');
        this.typeOutput(`Network Packets: ${packets.textContent}`, '');
        this.typeOutput(`Throughput: ${throughput.textContent} MB/s`, '');
        this.typeOutput(`Intrusions Blocked: ${this.intrusionCount}`, this.intrusionCount > 0 ? 'warning' : 'success');
    }
    
    clearTerminal() {
        const terminalBody = document.getElementById('terminal-output');
        terminalBody.innerHTML = '';
        this.typeOutput('Terminal cleared.', 'system');
    }
    
    async simulateHack(args) {
        const target = args[0] || 'unknown';
        this.typeOutput(`Initiating hack protocol on ${target}...`, 'warning');
        
        const stages = [
            ' fingerprinting target system...',
            ' enumerating open ports...',
            ' bypassing firewall...',
            ' injecting exploit payload...',
            ' escalating privileges...',
            ' accessing data streams...'
        ];
        
        for (let i = 0; i < stages.length; i++) {
            await this.delay(600 + Math.random() * 400);
            this.typeOutput(`[${i + 1}/${stages.length}] ${stages[i]}`, 'system');
        }
        
        await this.delay(800);
        
        if (Math.random() > 0.3) {
            this.typeOutput(`✅ Successfully compromised ${target}!`, 'success');
            this.typeOutput(`Access granted. Level: ${Math.floor(Math.random() * 5) + 1}`, 'success');
        } else {
            this.typeOutput(`❌ Hack failed. Connection terminated.`, 'error');
            this.typeOutput('Target security protocols too strong.', 'error');
        }
    }
    
    toggleFirewall() {
        const indicator = document.querySelector('#panel-security .panel-indicator');
        const firewallValue = document.querySelector('.security-item .value.active');
        
        if (firewallValue && firewallValue.textContent === 'ACTIVE') {
            this.typeOutput('Firewall deactivated. System vulnerable!', 'error');
            indicator.classList.remove('success');
            indicator.classList.add('warning');
            firewallValue.textContent = 'INACTIVE';
            firewallValue.classList.remove('active');
            firewallValue.style.color = '#ff4444';
        } else {
            this.typeOutput('Firewall reactivated. System protected.', 'success');
            indicator.classList.remove('warning');
            indicator.classList.add('success');
            firewallValue.textContent = 'ACTIVE';
            firewallValue.classList.add('active');
            firewallValue.style.color = '';
        }
    }
    
    showEncryption() {
        const algorithms = ['AES-256', 'RSA-4096', 'ECC-521', 'ChaCha20'];
        const current = algorithms[Math.floor(Math.random() * algorithms.length)];
        this.typeOutput(`Current encryption: ${current}`, 'success');
        this.typeOutput('Encryption strength: MILITARY GRADE', 'success');
        this.typeOutput('Key rotation: Every 60 seconds', 'system');
    }
    
    showTraffic() {
        const packetCount = document.getElementById('packet-count');
        const throughput = document.getElementById('throughput');
        
        this.typeOutput('=== NETWORK TRAFFIC ===', 'command-output');
        this.typeOutput(`Total packets: ${packetCount.textContent}`, '');
        this.typeOutput(`Current throughput: ${throughput.textContent} MB/s`, '');
        this.typeOutput('Top protocols: TCP(67%), UDP(22%), ICMP(11%)', '');
        this.typeOutput('Active connections: 247', '');
    }
    
    showUptime() {
        const hours = Math.floor(this.uptimeSeconds / 3600);
        const minutes = Math.floor((this.uptimeSeconds % 3600) / 60);
        const seconds = this.uptimeSeconds % 60;
        
        const uptimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.typeOutput(`System uptime: ${uptimeStr}`, 'success');
        this.typeOutput(`Uptime since last reboot: ${uptimeStr}`, 'system');
    }
    
    toggleMatrix() {
        const canvas = document.getElementById('matrix-rain');
        if (canvas.style.opacity === '0') {
            canvas.style.opacity = '0.15';
            this.typeOutput('Matrix rain effect enabled.', 'system');
        } else {
            canvas.style.opacity = '0';
            this.typeOutput('Matrix rain effect disabled.', 'system');
        }
    }
    
    triggerGlitch() {
        this.typeOutput('Initiating glitch protocol...', 'warning');
        
        const body = document.body;
        body.classList.add('glitch-mode');
        
        setTimeout(() => {
            body.classList.remove('glitch-mode');
            this.typeOutput('Glitch sequence complete.', 'success');
        }, 2000);
    }
    
    showAbout() {
        this.typeOutput('=== NEXUS TERMINAL v2.077 ===', 'command-output');
        this.typeOutput('Advanced Cybersecurity Interface', '');
        this.typeOutput('© 2077 CYBERDYNE SYSTEMS', '');
        this.typeOutput('All systems nominal.', 'success');
        this.typeOutput('Designed for elite operators.', 'system');
    }
    
    async rebootSystem() {
        this.typeOutput('WARNING: System reboot initiated!', 'error');
        this.typeOutput('All connections will be terminated.', 'warning');
        
        await this.delay(1000);
        this.typeOutput('Saving session data...', 'system');
        await this.delay(800);
        this.typeOutput('Closing all processes...', 'system');
        await this.delay(800);
        this.typeOutput('Terminating connections...', 'system');
        await this.delay(800);
        this.typeOutput('System shutdown in 3...', 'warning');
        await this.delay(1000);
        this.typeOutput('2...', 'warning');
        await this.delay(1000);
        this.typeOutput('1...', 'warning');
        await this.delay(1000);
        
        location.reload();
    }
    
    // Dashboard Animations
    setupDashboard() {
        // Update stats periodically
        setInterval(() => {
            this.updateNetworkStats();
            this.updateSystemStats();
            this.updateSecurityStats();
        }, 2000);
        
        // Bar chart animation
        this.animateBarChart();
    }
    
    updateNetworkStats() {
        const packets = document.getElementById('packet-count');
        const throughput = document.getElementById('throughput');
        
        let currentPackets = parseInt(packets.textContent) || 0;
        currentPackets += Math.floor(Math.random() * 1000);
        packets.textContent = currentPackets.toLocaleString();
        
        const currentThroughput = parseFloat(throughput.textContent) || 0;
        const newThroughput = (currentThroughput + (Math.random() * 20 - 10)).toFixed(1);
        throughput.textContent = Math.max(0, parseFloat(newThroughput)).toFixed(1);
    }
    
    updateSystemStats() {
        const cpu = document.getElementById('cpu-usage');
        const mem = document.getElementById('mem-usage');
        
        const newCpu = Math.floor(Math.random() * 40) + 30;
        const newMem = Math.floor(Math.random() * 30) + 40;
        
        cpu.textContent = newCpu;
        mem.textContent = newMem;
        
        // Update bar chart
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            const newValue = Math.floor(Math.random() * 60) + 20;
            bar.style.setProperty('--value', `${newValue}%`);
        });
    }
    
    updateSecurityStats() {
        const lastScan = document.getElementById('last-scan');
        const currentValue = parseFloat(lastScan.textContent) || 0;
        const newValue = (currentValue + 0.1).toFixed(1);
        lastScan.textContent = `${newValue}s`;
        
        // Randomly block intrusions
        if (Math.random() > 0.95) {
            this.intrusionCount++;
            document.getElementById('intrusion-count').textContent = this.intrusionCount;
            this.typeOutput('⚠️  Intrusion attempt blocked!', 'warning');
        }
    }
    
    animateBarChart() {
        const bars = document.querySelectorAll('.bar');
        setInterval(() => {
            bars.forEach(bar => {
                const currentValue = parseInt(bar.style.getPropertyValue('--value')) || 50;
                const change = Math.floor(Math.random() * 20) - 10;
                let newValue = currentValue + change;
                newValue = Math.max(10, Math.min(100, newValue));
                bar.style.setProperty('--value', `${newValue}%`);
            });
        }, 3000);
    }
    
    // Data Stream Visualization
    setupDataStreams() {
        const networkCanvas = document.getElementById('data-stream-network');
        if (!networkCanvas) return;
        
        const ctx = networkCanvas.getContext('2d');
        const width = networkCanvas.offsetWidth;
        const height = networkCanvas.offsetHeight;
        
        networkCanvas.width = width;
        networkCanvas.height = height;
        
        const dataPoints = [];
        const maxPoints = 100;
        
        for (let i = 0; i < maxPoints; i++) {
            dataPoints.push(height / 2);
        }
        
        const draw = () => {
            // Shift data
            dataPoints.shift();
            
            // Add new point with some randomness
            const lastPoint = dataPoints[dataPoints.length - 1] || height / 2;
            const newPoint = lastPoint + (Math.random() * 40 - 20);
            const clampedPoint = Math.max(10, Math.min(height - 10, newPoint));
            dataPoints.push(clampedPoint);
            
            // Clear and draw
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw grid
            ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let i = 0; i < height; i += 20) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
                ctx.stroke();
            }
            
            // Draw data line
            ctx.strokeStyle = '#39ff14';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < dataPoints.length; i++) {
                const x = (i / maxPoints) * width;
                const y = height - dataPoints[i];
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            // Draw glow
            ctx.shadowColor = '#39ff14';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };
        
        setInterval(draw, 50);
    }
    
    // Uptime Counter
    setupUptime() {
        setInterval(() => {
            this.uptimeSeconds++;
            const hours = Math.floor(this.uptimeSeconds / 3600);
            const minutes = Math.floor((this.uptimeSeconds % 3600) / 60);
            const seconds = this.uptimeSeconds % 60;
            
            const uptimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('uptime').textContent = uptimeStr;
        }, 1000);
    }
    
    // Glitch Effects
    setupGlitchEffects() {
        // Random glitch on panels
        setInterval(() => {
            if (Math.random() > 0.98) {
                const panels = document.querySelectorAll('.panel');
                const randomPanel = panels[Math.floor(Math.random() * panels.length)];
                
                randomPanel.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                randomPanel.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                
                setTimeout(() => {
                    randomPanel.style.transform = '';
                    randomPanel.style.filter = '';
                }, 100);
            }
        }, 100);
        
        // Add glitch mode styles
        const style = document.createElement('style');
        style.textContent = `
            .glitch-mode * {
                animation: glitch-skew 0.3s infinite linear alternate-reverse !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Start overall simulation
    startSimulation() {
        // Random system messages
        const messages = [
            'Optimizing neural pathways...',
            'Calibrating quantum processors...',
            'Syncing with mainframe...',
            'Running diagnostics...',
            'Updating threat database...',
            'Balancing load distribution...',
            'Verifying checksums...',
            'Encrypting data streams...'
        ];
        
        setInterval(() => {
            if (Math.random() > 0.7 && !this.isProcessing) {
                const message = messages[Math.floor(Math.random() * messages.length)];
                this.typeOutput(`[${new Date().toLocaleTimeString()}] ${message}`, 'system');
            }
        }, 8000);
        
        // Random panel alerts
        setInterval(() => {
            if (Math.random() > 0.9) {
                const panels = ['panel-network', 'panel-system', 'panel-security'];
                const randomPanel = panels[Math.floor(Math.random() * panels.length)];
                const panel = document.getElementById(randomPanel);
                const indicator = panel.querySelector('.panel-indicator');
                
                indicator.classList.add('active');
                setTimeout(() => {
                    indicator.classList.remove('active');
                }, 2000);
            }
        }, 5000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nexusTerminal = new NexusTerminal();
    
    // Add some initial animation classes
    document.querySelectorAll('.panel').forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate stats counters
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Animate initial values
    setTimeout(() => {
        animateValue(document.getElementById('packet-count'), 0, 15420, 2000);
        animateValue(document.getElementById('throughput'), 0, 84, 2000);
        animateValue(document.getElementById('cpu-usage'), 0, 67, 2000);
        animateValue(document.getElementById('mem-usage'), 0, 45, 2000);
        animateValue(document.getElementById('intrusion-count'), 0, 12, 2000);
    }, 1000);
});

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Secret mode activated
            document.body.classList.toggle('secret-mode');
            if (window.nexusTerminal) {
                window.nexusTerminal.typeOutput('🎮 KONAMI CODE ACTIVATED!', 'success');
                window.nexusTerminal.typeOutput('Secret mode toggled.', 'system');
            }
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add secret mode styles
const secretStyle = document.createElement('style');
secretStyle.textContent = `
    .secret-mode body {
        background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
        background-size: 400% 400%;
        animation: rainbow 5s ease infinite;
    }
    
    @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(secretStyle);
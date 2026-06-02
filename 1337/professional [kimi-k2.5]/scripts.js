// PHANTOM_PROTOCOL - System Core Scripts
// Security Classification: LEVEL 5 CLEARANCE REQUIRED

'use strict';

// System State
const SystemState = {
    bootComplete: false,
    threatCount: 0,
    startTime: Date.now(),
    activeAttacks: new Set(),
    decryptionKey: 'PHANTOM',
    
    // Threat database
    threatTypes: [
        { type: 'SQL_INJECTION', severity: 'critical', src: '192.168.X.XX' },
        { type: 'DDOS_ATTACK', severity: 'critical', src: '10.0.X.XX' },
        { type: 'BRUTE_FORCE', severity: 'warning', src: '198.51.100.X' },
        { type: 'PORT_SCAN', severity: 'warning', src: '203.0.113.X' },
        { type: 'XSS_ATTEMPT', severity: 'warning', src: '192.0.2.X' },
        { type: 'PROBE_DETECTED', severity: 'info', src: '198.51.100.X' }
    ]
};

// Utility Functions
const utils = {
    // Random integer between min and max
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Random element from array
    randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
    
    // Format time as HH:MM:SS
    formatTime: (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },
    
    // Generate random IP
    randomIP: () => `192.168.${utils.random(0, 255)}.${utils.random(0, 255)}`,
    
    // Delay promise
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

// Boot Sequence Controller
class BootSequence {
    constructor() {
        this.screen = document.getElementById('boot-sequence');
        this.textContainer = document.querySelector('.boot-text');
        this.progressBar = document.querySelector('.boot-bar');
        this.lines = [
            'BIOS Date: 01/15/2024 14:32:18 UTC',
            'CPU: PHANTOM_CORE_X9 @ 4.20GHz',
            'Memory Test: 65536K OK',
            'Loading kernel modules...',
            'Mounting encrypted volumes...',
            'Initializing security protocols...',
            'Establishing secure connection...',
            'Bypassing proxy firewalls...',
            'Decrypting secure channels...',
            'Loading threat intelligence database...',
            'Calibrating intrusion detection systems...',
            'System ready. Welcome, Operative.'
        ];
    }
    
    async init() {
        await this.typeLines();
        await this.fillProgressBar();
        await utils.delay(500);
        await this.complete();
    }
    
    async typeLines() {
        for (let i = 0; i < this.lines.length; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            line.style.animationDelay = `${i * 0.1}s`;
            line.textContent = `> ${this.lines[i]}`;
            this.textContainer.appendChild(line);
            await utils.delay(150);
        }
        await utils.delay(300);
    }
    
    async fillProgressBar() {
        return new Promise(resolve => {
            let width = 0;
            const interval = setInterval(() => {
                width += utils.random(1, 5);
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                    resolve();
                }
                this.progressBar.style.width = `${width}%`;
            }, 50);
        });
    }
    
    async complete() {
        this.screen.classList.add('hidden');
        SystemState.bootComplete = true;
        document.body.dispatchEvent(new CustomEvent('system:bootcomplete'));
    }
}

// Uptime Counter
class UptimeCounter {
    constructor() {
        this.element = document.getElementById('uptime');
        this.startTime = Date.now();
        this.init();
    }
    
    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
    
    update() {
        const elapsed = Date.now() - this.startTime;
        this.element.textContent = utils.formatTime(elapsed);
    }
}

// Threat Feed System
class ThreatFeed {
    constructor() {
        this.container = document.getElementById('threat-feed-body');
        this.countElement = document.getElementById('threat-count');
        this.maxEntries = 20;
        this.init();
    }
    
    init() {
        // Generate initial threats
        for (let i = 0; i < 5; i++) {
            this.addThreat(true);
        }
        
        // Add new threat every 3-8 seconds
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.addThreat();
            }
        }, utils.random(3000, 8000));
        
        // Update attack map
        this.initAttackMap();
    }
    
    addThreat(initial = false) {
        const threat = utils.randomChoice(SystemState.threatTypes);
        const time = new Date().toISOString().split('T')[1].split('.')[0];
        const id = `THR-${utils.random(1000, 9999)}`;
        const status = utils.randomChoice(['BLOCKED', 'MITIGATED', 'CONTAINED']);
        
        const row = document.createElement('div');
        row.className = `feed-row ${threat.severity}`;
        row.innerHTML = `
            <span>${time}</span>
            <span><span class="severity-indicator ${threat.severity}">${threat.severity.toUpperCase()}</span></span>
            <span>${threat.src}</span>
            <span>${threat.type}</span>
            <span>${status}</span>
        `;
        
        this.container.insertBefore(row, this.container.firstChild);
        
        // Limit entries
        while (this.container.children.length > this.maxEntries) {
            this.container.removeChild(this.container.lastChild);
        }
        
        // Update count
        if (!initial) {
            SystemState.threatCount++;
            this.countElement.textContent = SystemState.threatCount;
            this.countElement.classList.add('blink');
            setTimeout(() => this.countElement.classList.remove('blink'), 1000);
        }
        
        // Trigger attack visualization
        this.visualizeAttack();
    }
    
    initAttackMap() {
        this.svg = document.getElementById('attack-svg');
        this.origins = document.querySelectorAll('.node.origin');
        this.targets = document.querySelectorAll('.node.target');
    }
    
    visualizeAttack() {
        if (!this.svg || this.origins.length === 0 || this.targets.length === 0) return;
        
        const origin = utils.randomChoice(Array.from(this.origins));
        const target = utils.randomChoice(Array.from(this.targets));
        
        const originRect = origin.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const svgRect = this.svg.getBoundingClientRect();
        
        const x1 = originRect.left - svgRect.left + originRect.width / 2;
        const y1 = originRect.top - svgRect.top + originRect.height / 2;
        const x2 = targetRect.left - svgRect.left + targetRect.width / 2;
        const y2 = targetRect.top - svgRect.top + targetRect.height / 2;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x1);
        line.setAttribute('y2', y1);
        line.setAttribute('class', 'attack-line');
        
        this.svg.appendChild(line);
        
        // Animate line
        let progress = 0;
        const animate = () => {
            progress += 0.05;
            if (progress >= 1) {
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                setTimeout(() => line.remove(), 500);
                return;
            }
            
            const currentX = x1 + (x2 - x1) * progress;
            const currentY = y1 + (y2 - y1) * progress;
            line.setAttribute('x2', currentX);
            line.setAttribute('y2', currentY);
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

// Typewriter Effect
class Typewriter {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }
    
    async start() {
        this.element.textContent = '';
        while (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            await utils.delay(this.speed);
        }
    }
}

// Counter Animation
class Counter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseFloat(target);
        this.duration = duration;
        this.start = 0;
        this.decimals = target.includes('.') ? target.split('.')[1].length : 0;
    }
    
    animate() {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = this.start + (this.target - this.start) * easeOutQuart;
            
            this.element.textContent = current.toFixed(this.decimals);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
}

// Network Topology Controller
class NetworkTopology {
    constructor() {
        this.buttons = document.querySelectorAll('.term-btn-control');
        this.nodes = document.querySelectorAll('.network-node');
        this.connections = document.querySelectorAll('.conn-line');
        this.init();
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.target.dataset.action));
        });
        
        // Pulse animation on nodes
        this.nodes.forEach(node => {
            node.addEventListener('mouseenter', () => this.highlightNode(node));
            node.addEventListener('mouseleave', () => this.unhighlightNode(node));
        });
    }
    
    handleAction(action) {
        switch(action) {
            case 'scan':
                this.scanNetwork();
                break;
            case 'ping':
                this.pingNodes();
                break;
            case 'trace':
                this.traceroute();
                break;
        }
    }
    
    scanNetwork() {
        this.connections.forEach((conn, i) => {
            setTimeout(() => {
                conn.style.stroke = 'var(--neon-primary)';
                conn.style.strokeWidth = '3';
                setTimeout(() => {
                    conn.style.stroke = '';
                    conn.style.strokeWidth = '';
                }, 300);
            }, i * 100);
        });
    }
    
    pingNodes() {
        this.nodes.forEach((node, i) => {
            setTimeout(() => {
                node.style.transform = 'scale(1.3)';
                node.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    node.style.transform = '';
                    node.style.filter = '';
                }, 200);
            }, i * 150);
        });
    }
    
    traceroute() {
        // Animate packet along connections
        const svg = document.querySelector('.network-svg');
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('r', '4');
        packet.setAttribute('fill', 'var(--neon-primary)');
        packet.setAttribute('filter', 'drop-shadow(0 0 5px var(--neon-primary))');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M200,100 L400,200 L600,100');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'none');
        
        svg.appendChild(path);
        svg.appendChild(packet);
        
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('repeatCount', '2');
        animate.setAttribute('path', 'M200,100 L400,200 L600,100');
        
        packet.appendChild(animate);
        
        setTimeout(() => {
            packet.remove();
            path.remove();
        }, 4000);
    }
    
    highlightNode(node) {
        // Highlight connected lines
        // This would require a more complex graph data structure for full implementation
    }
    
    unhighlightNode(node) {
        // Remove highlights
    }
}

// Audit Log Filter
class AuditFilter {
    constructor() {
        this.buttons = document.querySelectorAll('.filter-btn');
        this.entries = document.querySelectorAll('.audit-entry');
        this.init();
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filter(e.target.dataset.filter, e.target));
        });
    }
    
    filter(severity, clickedBtn) {
        // Update active button
        this.buttons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        // Filter entries
        this.entries.forEach(entry => {
            if (severity === 'all' || entry.dataset.severity === severity) {
                entry.style.display = '';
                entry.style.animation = 'slideIn 0.3s ease-out';
            } else {
                entry.style.display = 'none';
            }
        });
    }
}

// Encryption System
class EncryptionSystem {
    constructor() {
        this.input = document.getElementById('decrypt-key');
        this.button = document.getElementById('decrypt-btn');
        this.encryptedText = document.querySelector('.encrypted-text');
        this.decryptedText = document.querySelector('.decrypted-text');
        this.status = document.getElementById('encrypt-status');
        this.wheel = document.getElementById('cipher-wheel');
        this.init();
    }
    
    init() {
        this.button.addEventListener('click', () => this.attemptDecrypt());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.attemptDecrypt();
        });
        
        // Random cipher rotation
        setInterval(() => {
            if (!this.decrypted) {
                this.shuffleCipher();
            }
        }, 2000);
    }
    
    shuffleCipher() {
        const chars = this.wheel.querySelectorAll('.cipher-char');
        chars.forEach(char => {
            const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            char.textContent = randomChar;
            char.style.opacity = '0.5';
            setTimeout(() => {
                char.textContent = char.dataset.char;
                char.style.opacity = '1';
            }, 200);
        });
    }
    
    attemptDecrypt() {
        const input = this.input.value.toUpperCase().trim();
        
        if (input === SystemState.decryptionKey) {
            this.decrypt();
        } else {
            this.failDecrypt();
        }
    }
    
    decrypt() {
        this.status.textContent = 'DECRYPTION_SUCCESSFUL';
        this.status.style.color = 'var(--neon-primary)';
        this.status.classList.remove('blink');
        
        this.encryptedText.classList.add('hidden');
        this.decryptedText.classList.remove('hidden');
        
        this.wheel.style.animation = 'rotate 2s linear infinite, glow 1s ease-in-out infinite alternate';
        this.wheel.style.borderColor = 'var(--neon-primary)';
        this.wheel.style.boxShadow = '0 0 50px var(--neon-glow)';
        
        this.input.disabled = true;
        this.button.textContent = 'ACCESS_GRANTED';
        this.button.style.background = 'var(--neon-primary)';
        this.button.style.color = 'var(--bg-primary)';
        
        // Success sound effect could go here
    }
    
    failDecrypt() {
        this.status.textContent = 'INVALID_KEY: ACCESS_DENIED';
        this.status.style.color = 'var(--critical)';
        
        this.input.style.borderColor = 'var(--critical)';
        this.input.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            this.status.textContent = 'AWAITING_KEY...';
            this.status.style.color = 'var(--warning)';
            this.input.style.borderColor = '';
            this.input.style.animation = '';
        }, 1500);
    }
}

// Glitch Effect Manager
class GlitchManager {
    constructor() {
        this.elements = document.querySelectorAll('.glitch-text');
        this.init();
    }
    
    init() {
        // Random glitch triggers
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.triggerGlitch();
            }
        }, 5000);
    }
    
    triggerGlitch() {
        const element = utils.randomChoice(Array.from(this.elements));
        element.style.animation = 'glitch-1 0.3s';
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }
}

// Navigation Controller
class NavigationController {
    constructor() {
        this.links = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.terminal-section');
        this.init();
    }
    
    init() {
        // Smooth scroll
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state
                    this.links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Intersection Observer for scroll spy
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.links.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        
        this.sections.forEach(section => observer.observe(section));
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Start boot sequence
    const boot = new BootSequence();
    boot.init();
    
    // Initialize systems after boot
    document.body.addEventListener('system:bootcomplete', () => {
        // Core systems
        new UptimeCounter();
        new ThreatFeed();
        new NetworkTopology();
        new AuditFilter();
        new EncryptionSystem();
        new GlitchManager();
        new NavigationController();
        
        // Typewriter effect
        const heroText = document.getElementById('hero-type');
        if (heroText) {
            const tw = new Typewriter(
                heroText,
                'Elite cybersecurity division operating in the digital shadows. We are the unseen guardians of the network infrastructure. Protocols active. Defenses armed. Intruders will be traced, tracked, and terminated.',
                30
            );
            tw.start();
        }
        
        // Counter animations
        document.querySelectorAll('.stat-value[data-target]').forEach(counter => {
            const c = new Counter(counter, counter.dataset.target);
            setTimeout(() => c.animate(), 500);
        });
        
        // Update timestamp
        const ts = document.getElementById('hero-timestamp');
        if (ts) {
            ts.textContent = new Date().toISOString();
        }
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
    }
});

// Add shake animation for decryption fail
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    @keyframes glow {
        from { box-shadow: 0 0 30px var(--neon-glow); }
        to { box-shadow: 0 0 60px var(--neon-glow); }
    }
`;
document.head.appendChild(style);
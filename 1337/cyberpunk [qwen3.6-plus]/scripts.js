/* =========================================
   SYN//FR4CTURE — INTERACTIVE SCRIPTS
   ========================================= */

// --- LOADING SCREEN ---
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initMatrixRain();
    initTypewriter();
    initStatusBar();
    initGlitchEffect();
    initDataTicker();
    initNetworkCanvas();
    initTerminal();
    initProgressBars();
    initTransmitForm();
    initNavigation();
    initScrollReveal();
});

// --- LOADING SCREEN ---
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const mainWrapper = document.getElementById('main-wrapper');
    const logoChars = document.querySelectorAll('.logo-char');
    
    // Stagger logo character reveal
    logoChars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.1}s`;
    });
    
    // Loading messages
    const messages = [
        'INITIALIZING NEURAL LINK...',
        'ESTABLISHING SECURE TUNNEL...',
        'LOADING EXPLOIT DATABASE...',
        'BYPASSING FIREWALLS...',
        'DECRYPTING PAYLOADS...',
        'CONNECTING TO NODE NETWORK...',
        'SYSTEM READY.'
    ];
    
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = `${progress}%`;
        
        const messageIndex = Math.min(
            Math.floor(progress / 15),
            messages.length - 1
        );
        loadingText.textContent = messages[messageIndex];
        
        if (progress >= 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainWrapper.classList.add('visible');
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }, 200);
}

// --- MATRIX CODE RAIN ---
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(3, 4, 8, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            // Brighter head, dimmer trail
            const brightness = Math.random();
            if (brightness > 0.95) {
                ctx.fillStyle = '#39ff14';
            } else if (brightness > 0.8) {
                ctx.fillStyle = 'rgba(57, 255, 20, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(57, 255, 20, 0.15)';
            }
            
            ctx.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
}

// --- TYPEWRITER EFFECT ---
function initTypewriter() {
    const typewriter = document.getElementById('hero-typewriter');
    if (!typewriter) return;
    
    const text = typewriter.getAttribute('data-text');
    typewriter.textContent = '';
    typewriter.style.borderRight = '2px solid #00f0ff';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            typewriter.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50 + Math.random() * 50);
        } else {
            // Blink cursor after typing completes
            setTimeout(() => {
                typewriter.style.borderRight = '2px solid transparent';
                setTimeout(() => {
                    typewriter.style.borderRight = '2px solid #00f0ff';
                }, 400);
            }, 2000);
        }
    }
    
    setTimeout(type, 1500);
}

// --- STATUS BAR UPDATES ---
function initStatusBar() {
    const systemTime = document.getElementById('system-time');
    const memUsage = document.getElementById('mem-usage');
    const pingValue = document.getElementById('ping-value');
    const statNodes = document.getElementById('stat-nodes');
    const statBreaches = document.getElementById('stat-breaches');
    
    function updateTime() {
        const now = new Date();
        systemTime.textContent = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    setInterval(updateTime, 1000);
    updateTime();
    
    // Simulate memory and ping fluctuations
    setInterval(() => {
        const mem = (60 + Math.random() * 15).toFixed(1);
        memUsage.textContent = mem;
        
        const ping = Math.floor(8 + Math.random() * 15);
        pingValue.textContent = ping;
    }, 3000);
    
    // Simulate stat increases
    let nodes = 2847;
    let breaches = 14203;
    
    setInterval(() => {
        nodes += Math.floor(Math.random() * 3) - 1;
        breaches += Math.floor(Math.random() * 2);
        
        statNodes.textContent = nodes.toLocaleString();
        statBreaches.textContent = breaches.toLocaleString();
    }, 5000);
}

// --- GLITCH EFFECT ---
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    setInterval(() => {
        glitchElements.forEach(el => {
            if (Math.random() > 0.7) {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = '';
            }
        });
    }, 2000);
}

// --- DATA TICKER ---
function initDataTicker() {
    const ticker = document.getElementById('data-ticker-track');
    if (!ticker) return;
    
    const items = [
        { text: 'NODE_EU_WEST_42', value: '+2.4%', up: true },
        { text: 'BREACH_SUCCESS_RATE', value: '94.7%', up: true },
        { text: 'THREAT_LEVEL', value: 'ELEVATED', up: false },
        { text: 'ENCRYPTION_ROUNDS', value: '10,247', up: true },
        { text: 'PACKET_LOSS', value: '0.02%', up: false },
        { text: 'ACTIVE_EXPLOITS', value: '347', up: true },
        { text: 'NETWORK_LATENCY', value: '12ms', up: false },
        { text: 'FIREWALL_BYPASS', value: 'SUCCESS', up: true },
        { text: 'PAYLOAD_DELIVERY', value: '89.2%', up: true },
        { text: 'COUNTER_MEASURES', value: 'DETECTED: 3', up: false },
        { text: 'TOR_EXIT_NODES', value: '1,847', up: true },
        { text: 'ZERO_DAYS_ACTIVE', value: '12', up: true }
    ];
    
    // Duplicate for seamless loop
    const allItems = [...items, ...items];
    
    allItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'ticker-item';
        div.innerHTML = `
            <span class="ticker-dot"></span>
            <span>${item.text}</span>
            <span class="${item.up ? 'up' : 'down'}">${item.value}</span>
        `;
        ticker.appendChild(div);
    });
}

// --- NETWORK VISUALIZATION ---
function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Create nodes
    const nodes = [];
    const numNodes = 40;
    const nodeTypes = ['active', 'relay', 'target'];
    
    for (let i = 0; i < numNodes; i++) {
        const type = i < 20 ? 'active' : (i < 30 ? 'relay' : 'target');
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            type,
            radius: type === 'active' ? 4 : (type === 'relay' ? 3 : 5),
            pulse: Math.random() * Math.PI * 2
        });
    }
    
    // Create connections
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numConnections; j++) {
            const target = Math.floor(Math.random() * nodes.length);
            if (target !== i) {
                connections.push({ from: i, to: target, progress: Math.random() });
            }
        }
    }
    
    function getColor(type) {
        switch(type) {
            case 'active': return '#39ff14';
            case 'relay': return '#00f0ff';
            case 'target': return '#ff003c';
            default: return '#39ff14';
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 11, 16, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw connections
        connections.forEach(conn => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            
            conn.progress += 0.002;
            if (conn.progress > 1) conn.progress = 0;
            
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Traveling dot on connection
            const dotX = from.x + (to.x - from.x) * conn.progress;
            const dotY = from.y + (to.y - from.y) * conn.progress;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#39ff14';
            ctx.fill();
        });
        
        // Update and draw nodes
        nodes.forEach(node => {
            // Movement
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.02;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            // Draw glow
            const glowRadius = node.radius * (2 + Math.sin(node.pulse) * 0.5);
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowRadius * 2
            );
            gradient.addColorStop(0, getColor(node.type) + '80');
            gradient.addColorStop(1, getColor(node.type) + '00');
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = getColor(node.type);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// --- INTERACTIVE TERMINAL ---
function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    
    if (!terminalInput || !terminalOutput) return;
    
    const commandHistory = [];
    let historyIndex = -1;
    
    const commands = {
        help: () => [
            'AVAILABLE COMMANDS:',
            '  help          — Show this help message',
            '  whoami        — Display current user info',
            '  status        — Show system status',
            '  clear         — Clear terminal',
            '  scan [target] — Scan target network',
            '  ping [host]   — Ping remote host',
            '  date          — Show current date/time',
            '  ls            — List directory contents',
            '  cat [file]    — Display file contents',
            '  exploit [id]  — Deploy exploit',
            '  nodes         — Show connected nodes',
            '  encrypt [msg] — Encrypt message',
            '  decrypt [msg] — Decrypt message',
            '  fortune       — Hacker wisdom',
            '  matrix        — Toggle matrix intensity',
            ''
        ],
        whoami: () => [
            'User: root',
            'UID: 0 (root)',
            'GID: 0 (root)',
            'Shell: /bin/synfr4cture',
            'Home: /root/operations',
            'Clearance: LEVEL 4 — TOP SECRET',
            ''
        ],
        status: () => [
            '╔══════════════════════════════════════╗',
            '║        SYSTEM STATUS REPORT          ║',
            '╠══════════════════════════════════════╣',
            '║ Network:  ████████████████░░  87%    ║',
            '║ CPU:      ██████████░░░░░░░░  62%    ║',
            '║ Memory:   █████████████░░░░░  78%    ║',
            '║ Disk:     ███████░░░░░░░░░░░  35%    ║',
            '╠══════════════════════════════════════╣',
            '║ Active Exploits: 347                 ║',
            '║ Compromised Nodes: 2,847             ║',
            '║ Uplink Status: STABLE                ║',
            '║ Encryption: AES-256-GCM              ║',
            '╚══════════════════════════════════════╝',
            ''
        ],
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },
        date: () => {
            return [new Date().toString(), ''];
        },
        ls: () => [
            'drwx------  operations/',
            'drwx------  exploits/',
            'drwx------  payloads/',
            'drwx------  keys/',
            '-rw-r--r--  README.txt',
            '-rw-r--r--  ACCESS_LOG',
            '-rwx------  deploy.sh',
            '-rw-------  credentials.enc',
            ''
        ],
        fortune: () => {
            const fortunes = [
                '"In the network, no one can hear you scream." — Anon',
                '"The best defense is a good offense." — Ancient Proverb',
                '"Trust is a vulnerability." — Zero Trust Doctrine',
                '"Information wants to be free." — Stewart Brand',
                '"Hackers are breaking the systems for profit. Before, it was about intellectual curiosity and pursuit of knowledge." — Kevin Mitnick',
                '"There are only two types of companies: those that have been hacked and those that will be." — Robert Mueller',
                '"The only truly secure system is one that is powered off." — Gene Spafford'
            ];
            return [fortunes[Math.floor(Math.random() * fortunes.length)], ''];
        },
        nodes: () => [
            'CONNECTED NODES:',
            `  EU-WEST-42     ${Math.random() > 0.5 ? 'ACTIVE' : 'IDLE'}    12ms`,
            `  US-EAST-17     ACTIVE     8ms`,
            `  AP-SOUTH-03    ACTIVE     45ms`,
            `  RELAY-0042     STANDBY    23ms`,
            `  RELAY-0091     ACTIVE     19ms`,
            `  TARGET-CORP-X  MONITORED  67ms`,
            '',
            `Total: ${Math.floor(2800 + Math.random() * 100)} nodes`,
            ''
        ],
        matrix: () => {
            const canvas = document.getElementById('matrix-canvas');
            if (canvas) {
                canvas.style.opacity = canvas.style.opacity === '0.3' ? '0.15' : '0.3';
            }
            return ['Matrix intensity toggled.', ''];
        }
    };
    
    // Async commands
    const asyncCommands = {
        scan: (args) => {
            const target = args[0] || '192.168.1.0/24';
            return [
                `Scanning ${target}...`,
                'PORT     STATE  SERVICE',
                '22/tcp   open   ssh',
                '80/tcp   open   http',
                '443/tcp  open   https',
                '3306/tcp open   mysql',
                '8080/tcp open   http-proxy',
                '',
                'OS: Linux 5.15 (Ubuntu)',
                'Vulnerabilities: 3 HIGH, 7 MEDIUM',
                '',
                `Scan complete. ${Math.floor(Math.random() * 10 + 5)} hosts discovered.`,
                ''
            ];
        },
        ping: (args) => {
            const host = args[0] || '10.0.0.1';
            const lines = [`PING ${host} (${host}): 56 data bytes`];
            for (let i = 0; i < 4; i++) {
                const time = Math.floor(Math.random() * 20 + 5);
                lines.push(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${time}.${Math.floor(Math.random() * 9)} ms`);
            }
            lines.push('');
            lines.push(`--- ${host} ping statistics ---`);
            lines.push('4 packets transmitted, 4 received, 0% packet loss');
            lines.push('');
            return lines;
        },
        cat: (args) => {
            const file = args[0];
            if (!file) return ['Usage: cat [filename]', ''];
            
            const files = {
                'README.txt': [
                    'SYN//FR4CTURE NETWORK TERMINAL',
                    '================================',
                    '',
                    'Welcome to the underground network.',
                    'All transmissions are monitored.',
                    'Unauthorized access will be logged.',
                    '',
                    'For support, use the TRANSMIT channel.',
                    ''
                ],
                'ACCESS_LOG': [
                    '2024-12-01 03:42:17 [AUTH] Login from 10.0.42.7 — SUCCESS',
                    '2024-12-01 03:43:02 [SCAN] Target: 172.16.0.0/16 — COMPLETE',
                    '2024-12-01 03:45:33 [EXPLOIT] Deployed VOIDRUNNER on 192.168.1.42',
                    '2024-12-01 03:47:11 [ALERT] Counter-measure detected — ELEVATING',
                    '2024-12-01 03:50:00 [BREACH] Data exfiltration — 2.3GB transferred',
                    ''
                ]
            };
            
            return files[file] || [`cat: ${file}: No such file or directory`, ''];
        },
        exploit: (args) => {
            const id = args[0] || 'VOIDRUNNER';
            return [
                `[EXPLOIT] Deploying ${id}...`,
                `[EXPLOIT] Generating ROP chain...`,
                `[EXPLOIT] Bypassing DEP...`,
                `[EXPLOIT] Bypassing ASLR...`,
                `[EXPLOIT] Payload injected successfully.`,
                `[EXPLOIT] Shell obtained on target.`,
                '',
                'Session: 0x' + Math.random().toString(16).substr(2, 8),
                ''
            ];
        },
        encrypt: (args) => {
            const msg = args.join(' ') || 'Hello World';
            const encrypted = msg.split('').map(c => 
                String.fromCharCode(c.charCodeAt(0) + 3)
            ).join('');
            return [
                `Original: ${msg}`,
                `Encrypted: ${encrypted}`,
                'Algorithm: AES-256-GCM (simulated)',
                ''
            ];
        },
        decrypt: (args) => {
            const msg = args.join(' ') || 'Khoor#Zruog';
            const decrypted = msg.split('').map(c => 
                String.fromCharCode(c.charCodeAt(0) - 3)
            ).join('');
            return [
                `Encrypted: ${msg}`,
                `Decrypted: ${decrypted}`,
                'Algorithm: AES-256-GCM (simulated)',
                ''
            ];
        }
    };
    
    function processCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;
        
        commandHistory.unshift(trimmed);
        if (commandHistory.length > 50) commandHistory.pop();
        historyIndex = -1;
        
        // Add command to output
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="line-content"><span class="prompt-symbol">root@synfr4cture</span><span class="prompt-at">@</span><span class="prompt-path">~</span><span class="prompt-symbol">$</span> ${escapeHtml(trimmed)}</span>`;
        terminalOutput.appendChild(cmdLine);
        
        // Process command
        const parts = trimmed.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (commands[cmd]) {
            const output = commands[cmd](args);
            if (output) {
                output.forEach(line => {
                    addTerminalLine(line);
                });
            }
        } else if (asyncCommands[cmd]) {
            const output = asyncCommands[cmd](args);
            // Simulate processing delay
            const loadingLine = document.createElement('div');
            loadingLine.className = 'terminal-line system';
            loadingLine.innerHTML = `<span class="line-content">Processing...</span>`;
            terminalOutput.appendChild(loadingLine);
            scrollToBottom();
            
            setTimeout(() => {
                terminalOutput.removeChild(loadingLine);
                output.forEach(line => {
                    addTerminalLine(line);
                });
                scrollToBottom();
            }, 800 + Math.random() * 500);
            return;
        } else {
            addTerminalLine(`command not found: ${cmd}`, 'error');
            addTerminalLine(`Type 'help' for available commands.`, 'system');
        }
        
        scrollToBottom();
    }
    
    function addTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = `<span class="line-content">${escapeHtml(text) || '&nbsp;'}</span>`;
        terminalOutput.appendChild(line);
    }
    
    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(terminalInput.value);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                terminalInput.value = '';
            }
        }
    });
    
    // Focus terminal on click
    document.querySelector('.terminal-container')?.addEventListener('click', () => {
        terminalInput.focus();
    });
}

// --- PROGRESS BAR ANIMATIONS ---
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = `${width}%`;
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// --- TRANSMIT FORM ---
function initTransmitForm() {
    const form = document.getElementById('transmit-form');
    const message = document.getElementById('tx-message');
    const charCount = document.getElementById('char-count');
    
    if (!form || !message) return;
    
    message.addEventListener('input', () => {
        charCount.textContent = message.value.length;
        if (message.value.length > 1024) {
            charCount.style.color = '#ff003c';
        } else {
            charCount.style.color = '';
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const callsign = document.getElementById('tx-callsign').value;
        if (!callsign) {
            message.focus();
            return;
        }
        
        // Simulate transmission
        const btn = form.querySelector('.cyber-btn.primary');
        const originalText = btn.querySelector('.btn-text').textContent;
        btn.querySelector('.btn-text').textContent = 'ENCRYPTING...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'TRANSMITTING...';
            
            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = '✓ TRANSMITTED';
                btn.style.borderColor = '#39ff14';
                
                setTimeout(() => {
                    btn.querySelector('.btn-text').textContent = originalText;
                    btn.disabled = false;
                    btn.style.borderColor = '';
                    form.reset();
                    charCount.textContent = '0';
                }, 2000);
            }, 1500);
        }, 1000);
    });
}

// --- NAVIGATION ---
function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });
    
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 100;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// --- SCROLL REVEAL ---
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}
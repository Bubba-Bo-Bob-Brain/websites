/* =========================================
   THE MAINFRAME // CYBERPUNK HACKING SITE
   JavaScript v2.7.1
   ========================================= */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCodeRain();
    initSystemBar();
    initHeroTyping();
    initStatCounters();
    initTrafficGraph();
    initHexDump();
    initResourceBars();
    initConnectionsTable();
    initTerminal();
    initScrollAnimations();
    initNavHighlight();
});

// ==================== PRELOADER ====================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const mainWrapper = document.getElementById('main-wrapper');
    
    // Wait for the 3s load animation to complete, then fade out
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            mainWrapper.classList.add('visible');
            // Trigger initial animations after reveal
            triggerSectionAnimations();
        }, 500);
    }, 3200);
}

// ==================== CODE RAIN ====================
function initCodeRain() {
    const canvas = document.getElementById('codeRain');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);
    
    window.addEventListener('resize', () => {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    });
    
    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#39ff14';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            // Vary brightness for depth
            if (Math.random() > 0.98) {
                ctx.fillStyle = '#ffffff';
            } else if (Math.random() > 0.9) {
                ctx.fillStyle = '#00ffff';
            } else {
                ctx.fillStyle = 'rgba(57, 255, 20, 0.6)';
            }
            
            ctx.fillText(char, x, y);
            
            // Reset drop randomly or when off screen
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    
    draw();
}

// ==================== SYSTEM BAR ====================
function initSystemBar() {
    const sysTime = document.getElementById('sysTime');
    const uptimeCounter = document.getElementById('uptimeCounter');
    const latency = document.getElementById('latency');
    
    let uptime = 0;
    
    function update() {
        // Time
        const now = new Date();
        sysTime.textContent = now.toISOString().split('T')[1].split('.')[0];
        
        // Uptime
        uptime++;
        uptimeCounter.textContent = String(uptime).padStart(6, '0');
        
        // Latency fluctuation
        const baseLatency = 12;
        const fluctuation = Math.floor(Math.random() * 6) - 3;
        latency.textContent = Math.max(5, baseLatency + fluctuation);
    }
    
    setInterval(update, 1000);
    update();
}

// ==================== HERO TYPING ====================
function initHeroTyping() {
    const typedText = document.getElementById('typedText');
    const heroStatus = document.getElementById('heroStatus');
    const statusText = heroStatus.querySelector('.status-text');
    const statusDot = heroStatus.querySelector('.status-dot');
    
    const lines = [
        'Initializing secure connection...',
        'Bypassing corporate firewalls...',
        'Scanning network perimeter...',
        'Exploiting vulnerability CVE-2024-8901...',
        'Establishing encrypted tunnel...',
        'Access granted. Welcome, Operator.'
    ];
    
    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    
    function type() {
        if (lineIndex >= lines.length) {
            // All lines typed, change status
            statusText.textContent = 'CONNECTED';
            statusDot.style.background = '#39ff14';
            return;
        }
        
        const currentLine = lines[lineIndex];
        
        if (!isDeleting) {
            currentText = currentLine.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentLine.length) {
                // Line complete, pause then next
                isDeleting = true;
                setTimeout(type, 800);
                return;
            }
        } else {
            currentText = currentLine.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                lineIndex++;
                setTimeout(type, 300);
                return;
            }
        }
        
        typedText.textContent = currentText;
        const speed = isDeleting ? 30 : 60 + Math.random() * 40;
        setTimeout(type, speed);
    }
    
    // Start after preloader
    setTimeout(type, 3500);
}

// ==================== STAT COUNTERS ====================
function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString();
            return;
        }
        el.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
    }
    update();
}

// ==================== TRAFFIC GRAPH ====================
function initTrafficGraph() {
    const canvas = document.getElementById('trafficGraph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 180;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const points = 50;
    let inbound = Array(points).fill(0).map(() => Math.random() * 100);
    let outbound = Array(points).fill(0).map(() => Math.random() * 80);
    let suspicious = Array(points).fill(0).map(() => Math.random() * 30);
    
    function drawLine(data, color, lineWidth) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        const step = canvas.width / (points - 1);
        for (let i = 0; i < points; i++) {
            const x = i * step;
            const y = canvas.height - (data[i] / 100 * canvas.height * 0.9) - 10;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Fill under line
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        ctx.fill();
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Grid lines
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 5) * i + 10;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Shift data
        inbound.shift();
        inbound.push(Math.max(0, Math.min(100, inbound[inbound.length - 1] + (Math.random() - 0.5) * 20)));
        
        outbound.shift();
        outbound.push(Math.max(0, Math.min(80, outbound[outbound.length - 1] + (Math.random() - 0.5) * 15)));
        
        suspicious.shift();
        suspicious.push(Math.max(0, Math.min(30, suspicious[suspicious.length - 1] + (Math.random() - 0.5) * 10)));
        
        // Draw lines
        drawLine(inbound, 'rgb(57, 255, 20)', 2);
        drawLine(outbound, 'rgb(0, 255, 255)', 1.5);
        drawLine(suspicious, 'rgb(255, 0, 85)', 1);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==================== HEX DUMP ====================
function initHexDump() {
    const hexDump = document.getElementById('hexDump');
    if (!hexDump) return;
    
    function generateHexLine() {
        const offset = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(8, '0');
        let hexPart = '';
        let asciiPart = '';
        
        for (let i = 0; i < 16; i++) {
            const byte = Math.floor(Math.random() * 256);
            hexPart += byte.toString(16).toUpperCase().padStart(2, '0') + ' ';
            asciiPart += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
        }
        
        return `<div><span class="hex-addr">0x${offset}</span> <span class="hex-val">${hexPart}</span> <span class="hex-ascii">${asciiPart}</span></div>`;
    }
    
    // Initial dump
    for (let i = 0; i < 12; i++) {
        hexDump.innerHTML += generateHexLine();
    }
    
    // Update periodically
    setInterval(() => {
        const lines = hexDump.children;
        if (lines.length > 0) {
            hexDump.removeChild(lines[0]);
        }
        hexDump.innerHTML += generateHexLine();
    }, 800);
}

// ==================== RESOURCE BARS ====================
function initResourceBars() {
    const bars = [
        { value: 'cpu0', bar: 'cpu0Bar' },
        { value: 'cpu1', bar: 'cpu1Bar' },
        { value: 'cpu2', bar: 'cpu2Bar' },
        { value: 'cpu3', bar: 'cpu3Bar' },
        { value: 'mem', bar: 'memBar' },
        { value: 'netio', bar: 'netioBar' }
    ];
    
    setInterval(() => {
        bars.forEach(item => {
            const newVal = Math.floor(Math.random() * 80) + 20;
            document.getElementById(item.value).textContent = item.value === 'netio' 
                ? (newVal / 10).toFixed(1) + ' GB/s' 
                : newVal + '%';
            document.getElementById(item.bar).style.setProperty('--width', newVal + '%');
        });
    }, 2000);
}

// ==================== CONNECTIONS TABLE ====================
function initConnectionsTable() {
    const table = document.getElementById('connectionsTable');
    if (!table) return;
    
    const protos = ['TCP', 'UDP', 'TCP', 'TCP', 'UDP'];
    const states = ['ESTABLISHED', 'TIME_WAIT', 'CLOSE_WAIT', 'LISTEN', 'ESTABLISHED'];
    
    function randomIP() {
        return `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    }
    
    function randomPort() {
        return Math.floor(Math.random() * 65535);
    }
    
    function addRow() {
        const proto = protos[Math.floor(Math.random() * protos.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        const local = `${randomIP()}:${randomPort()}`;
        const remote = `${randomIP()}:${randomPort()}`;
        
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <span class="proto">${proto}</span>
            <span>${local}</span>
            <span>${remote}</span>
            <span class="state">${state}</span>
        `;
        
        table.prepend(row);
        
        if (table.children.length > 8) {
            table.removeChild(table.lastChild);
        }
    }
    
    // Initial rows
    for (let i = 0; i < 5; i++) addRow();
    setInterval(addRow, 3000);
}

// ==================== INTERACTIVE TERMINAL ====================
function initTerminal() {
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    
    if (!terminalInput || !terminalOutput) return;
    
    let commandHistory = [];
    let historyIndex = -1;
    
    const commands = {
        help: () => [
            { type: 'info', text: 'AVAILABLE COMMANDS:' },
            { type: 'output', text: '  help        - Show this help message' },
            { type: 'output', text: '  whoami      - Display current user' },
            { type: 'output', text: '  status      - System status report' },
            { type: 'output', text: '  scan        - Run network scan simulation' },
            { type: 'output', text: '  decrypt     - Attempt decryption simulation' },
            { type: 'output', text: '  trace       - Trace route to target' },
            { type: 'output', text: '  matrix      - Toggle matrix rain intensity' },
            { type: 'output', text: '  clear       - Clear terminal' },
            { type: 'output', text: '  exit        - Close session' }
        ],
        whoami: () => [
            { type: 'success', text: 'root@mainframe [CLEARANCE: OMEGA-7]' }
        ],
        status: () => [
            { type: 'info', text: 'SYSTEM STATUS REPORT' },
            { type: 'output', text: `  Uptime: ${document.getElementById('uptimeCounter').textContent}s` },
            { type: 'output', text: `  Latency: ${document.getElementById('latency').textContent}ms` },
            { type: 'output', text: '  Encryption: AES-256-GCM [ACTIVE]' },
            { type: 'output', text: '  Active Connections: ' + Math.floor(Math.random() * 20 + 40) },
            { type: 'output', text: '  Threat Level: MODERATE' },
            { type: 'success', text: '  All systems operational.' }
        ],
        scan: () => {
            const lines = [];
            lines.push({ type: 'info', text: 'Initiating port scan...' });
            lines.push({ type: 'output', text: 'Scanning target: 192.168.1.1/24' });
            for (let i = 0; i < 5; i++) {
                lines.push({ type: 'output', text: `  Port ${[22, 80, 443, 8080, 3306][i]}: ${Math.random() > 0.5 ? 'OPEN' : 'CLOSED'}` });
            }
            lines.push({ type: 'success', text: 'Scan complete. 5 hosts discovered.' });
            return lines;
        },
        decrypt: () => [
            { type: 'info', text: 'Initializing hash cracking module...' },
            { type: 'output', text: 'Loading rainbow tables...' },
            { type: 'output', text: 'Attempting dictionary attack...' },
            { type: 'output', text: 'Hash: a7b9c3d4e5f6... [MD5]' },
            { type: 'success', text: 'Match found: "password123"' },
            { type: 'output', text: 'Decryption successful.' }
        ],
        trace: () => [
            { type: 'info', text: 'Tracing route to 10.0.0.1...' },
            { type: 'output', text: '  1  192.168.1.1    2ms' },
            { type: 'output', text: '  2  10.0.0.5       8ms' },
            { type: 'output', text: '  3  10.0.0.12      14ms' },
            { type: 'output', text: '  4  10.0.0.1       12ms' },
            { type: 'success', text: 'Trace complete.' }
        ],
        matrix: () => {
            const canvas = document.getElementById('codeRain');
            canvas.style.opacity = canvas.style.opacity === '0.5' ? '0.25' : '0.5';
            return [{ type: 'info', text: `Matrix intensity: ${canvas.style.opacity === '0.5' ? 'HIGH' : 'STANDARD'}` }];
        },
        clear: () => 'CLEAR',
        exit: () => [
            { type: 'error', text: 'ACCESS DENIED. SESSION CANNOT BE TERMINATED.' },
            { type: 'output', text: 'You are in too deep, operator.' }
        ]
    };
    
    function addOutputLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    function processCommand(cmd) {
        const trimmed = cmd.trim().toLowerCase();
        
        // Echo command
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="prompt-user">root@mainframe</span><span class="prompt-sep">:</span><span class="prompt-path">~</span><span class="prompt-symbol"># </span>${cmd}`;
        terminalOutput.appendChild(echoLine);
        
        if (commands[trimmed]) {
            const result = commands[trimmed]();
            if (result === 'CLEAR') {
                terminalOutput.innerHTML = '';
            } else if (Array.isArray(result)) {
                result.forEach(r => addOutputLine(r.text, r.type));
            }
        } else if (trimmed !== '') {
            addOutputLine(`Command not found: ${trimmed}. Type 'help' for available commands.`, 'error');
        }
        
        // Auto scroll
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value;
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
            processCommand(cmd);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });
    
    // Focus terminal on click
    document.querySelector('.terminal-container')?.addEventListener('click', () => {
        terminalInput.focus();
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const sections = document.querySelectorAll('.modules-section, .streams-section, .terminal-section, .about-section');
    const cards = document.querySelectorAll('.module-card');
    const panels = document.querySelectorAll('.stream-panel');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    sections.forEach(s => observer.observe(s));
    cards.forEach((c, i) => {
        c.style.animationDelay = `${i * 0.1}s`;
        observer.observe(c);
    });
    panels.forEach((p, i) => {
        p.style.animationDelay = `${i * 0.15}s`;
        observer.observe(p);
    });
}

function triggerSectionAnimations() {
    // Add CSS class for initial animations if needed
    document.querySelectorAll('.module-card, .stream-panel').forEach(el => {
        el.classList.add('animate-in');
    });
}

// ==================== NAV HIGHLIGHT ====================
function initNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === entry.target.id);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.section;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
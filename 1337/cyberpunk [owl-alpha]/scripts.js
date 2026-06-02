const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const charArray = chars.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#39ff14';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: () => {
        return [
            'Available commands:',
            '  help      - Show this help message',
            '  status    - Check system status',
            '  whoami    - Display current user',
            '  ls        - List files in current directory',
            '  scan      - Scan network for vulnerabilities',
            '  connect   - Establish secure connection',
            '  decrypt   - Decrypt intercepted data',
            '  clear     - Clear terminal output',
            '  exit      - Terminate session'
        ];
    },
    status: () => {
        return [
            'SYSTEM STATUS:',
            '  CPU Usage: 73.2%',
            '  Memory: 16.4GB / 32GB',
            '  Network: CONNECTED (Encrypted)',
            '  Uptime: 847 days, 14 hours',
            '  Active Connections: 2847',
            '  Security Level: MAXIMUM'
        ];
    },
    whoami: () => {
        return ['root@nexus:uid=0(root) gid=0(root) groups=0(root)'];
    },
    ls: () => {
        return [
            'drwxr-xr-x  2 root root  4096 Dec 15 2077 archives',
            'drwxr-xr-x  2 root root  4096 Dec 15 2077 exploits',
            '-rw-r--r--  1 root root 847M  Dec 15 2077 neural_networks.dll',
            '-rw-r--r--  1 root root 2.1G  Dec 15 2077 quantum_break.exe',
            '-rw-r--r--  1 root root 156M  Dec 15 2077 ghost_protocol.bin',
            '-rw-r--r--  1 root root  12K  Dec 15 2077 readme.txt'
        ];
    },
    scan: () => {
        const targets = ['192.168.1.1', '10.0.0.1', '172.16.0.1'];
        const ports = ['22', '80', '443', '8080', '8443'];
        return [
            'Scanning network...',
            `Found ${Math.floor(Math.random() * 10) + 5} hosts`,
            'Port scan results:',
            ...targets.map(t => `  ${t}: ${ports.slice(0, Math.floor(Math.random() * 3) + 2).join(', ')}`),
            'Vulnerabilities detected: 0 (System secure)'
        ];
    },
    connect: () => {
        return [
            'Establishing secure connection...',
            'Handshake initiated...',
            'Encryption: AES-256-GCM',
            'Connection established successfully',
            'Tunnel active. All traffic encrypted.'
        ];
    },
    decrypt: () => {
        return [
            'Decrypting intercepted data...',
            'Analyzing encryption pattern...',
            'Brute force attack in progress...',
            '████░░░░░░░░░░░░░░░░ 25%',
            '████████░░░░░░░░░░░░ 50%',
            '████████████░░░░░░░░ 75%',
            '████████████████████ 100%',
            'Decryption complete.',
            'Output: "The truth is out there."'
        ];
    },
    clear: () => {
        const outputLines = terminalOutput.querySelectorAll('.output-line');
        outputLines.forEach(line => line.style.display = 'none');
        return [];
    },
    exit: () => {
        return [
            'Terminating session...',
            'Clearing memory buffers...',
            'Removing traces...',
            'Session terminated. Goodbye.'
        ];
    }
};

function addOutput(text) {
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = text;
    terminalOutput.insertBefore(line, terminalInput.parentElement);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        addOutput(`root@nexus:~# ${terminalInput.value}`);
        
        if (command) {
            if (commands[command]) {
                const output = commands[command]();
                output.forEach(line => addOutput(line));
            } else {
                addOutput(`bash: ${command}: command not found`);
                addOutput('Type "help" for available commands');
            }
        }
        
        terminalInput.value = '';
    }
});

terminalInput.focus();
document.addEventListener('click', (e) => {
    if (!e.target.closest('.terminal-window')) {
        terminalInput.focus();
    }
});

function playGlitch() {
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = 'glitch-1 0.3s infinite linear alternate-reverse';
    });
    
    setTimeout(() => {
        glitchElements.forEach(el => {
            el.style.animation = '';
        });
    }, 1000);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    });
}

const observerOptions = {
    threshold: 0.5
};

const networkSection = document.getElementById('network');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

if (networkSection) {
    counterObserver.observe(networkSection);
}

function drawConnectionLines() {
    const svg = document.querySelector('.connections-svg');
    const nodes = document.querySelectorAll('.node');
    
    if (!svg || nodes.length === 0) return;
    
    svg.innerHTML = '';
    
    const connections = [
        [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]
    ];
    
    connections.forEach(([from, to]) => {
        const fromNode = nodes[from];
        const toNode = nodes[to];
        
        if (!fromNode || !toNode) return;
        
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        
        const x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
        const x2 = toRect.left + toRect.width / 2 - svgRect.left;
        const y2 = toRect.top + toRect.height / 2 - svgRect.top;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#39ff14');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.3');
        line.classList.add('connection-line');
        
        svg.appendChild(line);
    });
}

window.addEventListener('load', drawConnectionLines);
window.addEventListener('resize', drawConnectionLines);

document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'DOWNLOADING...';
        this.style.opacity = '0.7';
        
        setTimeout(() => {
            this.textContent = 'COMPLETE';
            this.style.borderColor = '#27c93f';
            this.style.color = '#27c93f';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
                this.style.borderColor = '';
                this.style.color = '';
            }, 2000);
        }, 1500);
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function createDataStreams() {
    const streamContainer = document.querySelector('.data-stream');
    if (!streamContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const stream = document.createElement('div');
        stream.className = 'stream-column';
        stream.style.setProperty('--delay', `${Math.random() * 2}s`);
        stream.style.height = `${Math.random() * 200 + 100}px`;
        stream.style.opacity = Math.random() * 0.5 + 0.2;
        streamContainer.appendChild(stream);
    }
}

createDataStreams();

const style = document.createElement('style');
style.textContent = `
    @keyframes stream-flow {
        0%, 100% { 
            height: 50px; 
            opacity: 0.2; 
        }
        50% { 
            height: 350px; 
            opacity: 0.6; 
        }
    }
`;
document.head.appendChild(style);

let glitchInterval;
function randomGlitch() {
    const elements = document.querySelectorAll('h1, h2, .logo, .section-title');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    if (randomElement) {
        randomElement.style.animation = 'none';
        randomElement.offsetHeight;
        randomElement.style.animation = 'glitch-1 0.1s linear';
        
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 100);
    }
}

glitchInterval = setInterval(randomGlitch, 5000);

console.log('%c NEXUS UNDERGROUND ', 'background: #39ff14; color: #0a0a0a; font-size: 20px; font-weight: bold;');
console.log('%c Warning: Unauthorized access will be traced and prosecuted.', 'color: #39ff14; font-size: 12px;');
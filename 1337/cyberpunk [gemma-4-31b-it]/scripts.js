/**
 * NEON_VOID // CORE SYSTEMS SCRIPT
 * Implements: Matrix Rain, Terminal Logic, HUD Dynamics
 */

document.addEventListener('DOMContentLoaded', () => {
    initMatrixRain();
    initTerminal();
    initHUD();
});

// --- 1. MATRIX DATA-STREAM SYSTEM ---
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Use hexadecimal characters for a "memory dump" feel
    const chars = "0123456789ABCDEF";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        // Semi-transparent black to create trailing effect
        ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#32ff7e";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    setInterval(draw, 33);
}

// --- 2. INTERACTIVE TERMINAL SYSTEM ---
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const logStream = document.getElementById('log-stream');

    const COMMANDS = {
        'help': 'Available commands: <span class="highlight">status</span>, <span class="highlight">decrypt</span>, <span class="highlight">clear</span>, <span class="highlight">whoami</span>, <span class="highlight">network</span>',
        'status': 'System: OPTIMAL | Firewall: BYPASSED | Proxy: ACTIVE | Stealth: 98%',
        'whoami': 'Operative_X // Clearance Level: OMEGA // Location: Unknown',
        'network': 'Scanning local nodes... Found 4 active targets. [192.168.1.1], [10.0.0.42], [172.16.0.1], [UNKNOWN]',
        'decrypt': 'Initiating decryption sequence... <br>[||||||----] 60%... <br>[||||||||||] 100% <br><span class="success">ACCESS GRANTED: SECRET_FILE_01.txt</span>'
    };

    function addLog(msg) {
        const log = document.createElement('div');
        log.className = 'log-entry';
        log.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logStream.prepend(log);
    }

    function printToTerminal(text, type = 'info') {
        const p = document.createElement('p');
        p.innerHTML = text;
        if (type === 'error') p.style.color = 'var(--error)';
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.toLowerCase().trim();
            printToTerminal(`<span class="prompt">guest@neon_void:~$</span> ${cmd}`);
            
            if (cmd === '') {
                // Do nothing
            } else if (cmd === 'clear') {
                output.innerHTML = '';
            } else if (COMMANDS[cmd]) {
                printToTerminal(COMMANDS[cmd]);
                addLog(`Executed: ${cmd}`);
            } else {
                printToTerminal(`Command not found: ${cmd}. Type <span class="highlight">'help'</span> for assistance.`, 'error');
                addLog(`Invalid command: ${cmd}`);
            }

            input.value = '';
        }
    });

    // Initial log sequence
    const bootLogs = ["Auth sequence started", "Bypassing SSH...", "Handshake established", "Establishing Tunnel..."];
    bootLogs.forEach((msg, i) => {
        setTimeout(() => addLog(msg), i * 800);
    });
}

// --- 3. HUD & METRICS DYNAMICS ---
function initHUD() {
    // Update Clock
    const clock = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clock.innerText = now.toTimeString().split(' ')[0];
    }, 1000);

    // Randomize Metric Bars
    const fills = document.querySelectorAll('.metric-bar .fill');
    setInterval(() => {
        fills.forEach(fill => {
            const randomWidth = Math.floor(Math.random() * 60) + 20; // 20% to 80%
            fill.style.width = randomWidth + '%';
        });
    }, 3000);
}
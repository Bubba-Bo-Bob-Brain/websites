/**
 * NEURAL_BREACH // SYSTEM_CORE
 * VERSION: 1.0.4-STABLE
 */

document.addEventListener('DOMContentLoaded', () => {
    initMatrixRain();
    initTerminal();
    initHUD();
    initSidebar();
});

/* --- 1. MATRIX DATA RAIN ENGINE --- */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%$#@!<>[]{}/?|';
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
        // Subtle trail effect: instead of clearing, draw a translucent rectangle
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#32FF00'; // Lime
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // Occasional "glitch" in the rain: bright white characters
            if (Math.random() > 0.98) {
                ctx.fillStyle = '#FFFFFF';
            } else {
                ctx.fillStyle = '#32FF00';
            }

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

    setInterval(draw, 33); // ~30 FPS
}

/* --- 2. INTERACTIVE TERMINAL ENGINE --- */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    const commands = {
        'help': 'Available commands: [status, clear, hack, decrypt, exit]',
        'status': 'SYSTEM: OK | CONNECTION: ENCRYPTED | USER: GHOST_PROTOCOL',
        'clear': 'CLEAR',
        'hack': 'ATTEMPTING BREACH... [FAILED] - INTRUSION DETECTED',
        'decrypt': 'DECRYPTING DATA STREAM... [PROGRESS: 42%]',
        'exit': 'TERMINATING SESSION...'
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim().toLowerCase();
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal-line';
            promptLine.innerHTML = `<span class="prompt">root@mainframe:~#</span> ${input.value}`;
            body.appendChild(promptLine);

            if (val === 'clear') {
                body.innerHTML = '';
            } else if (commands[val]) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                // Add warning color for certain commands
                if (val === 'hack') responseLine.classList.add('text-warning');
                responseLine.textContent = `> ${commands[val]}`;
                body.appendChild(responseLine);
            } else if (val !== '') {
                const errorLine = document.createElement('div');
                errorLine.className = 'terminal-line text-warning';
                errorLine.textContent = `> COMMAND NOT FOUND: ${val}`;
                body.appendChild(errorLine);
            }

            input.value = '';
            body.scrollTop = body.scrollHeight; // Auto-scroll to bottom
        }
    });
}

/* --- 3. HUD & SYSTEM SIMULATION --- */
function initHUD() {
    const clockEl = document.getElementById('digital-clock');
    const latencyEl = document.getElementById('latency-val');

    // Digital Clock
    setInterval(() => {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${h}:${m}:${s}`;
    }, 1000);

    // Latency Jitter Simulation
    setInterval(() => {
        const jitter = Math.floor(Math.random() * 15) + 20;
        latencyEl.textContent = `${jitter}ms`;
        
        // Visual glitch on latency if it gets too high
        if (jitter > 30) {
            latencyEl.classList.add('text-warning');
        } else {
            latencyEl.classList.remove('text-warning');
        }
    }, 2000);
}

/* --- 4. SIDEBAR NAVIGATION --- */
function initSidebar() {
    const items = document.querySelectorAll('.tree-item');
    const display = document.getElementById('data-display');

    items.forEach(item => {
        item.addEventListener('click', () => {
            // UI update
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Simulate loading content
            display.style.opacity = '0';
            
            setTimeout(() => {
                const target = item.getAttribute('data-target');
                simulateContentSwitch(target);
                display.style.opacity = '1';
            }, 300);
        });
    });
}

function simulateContentSwitch(target) {
    // This is where you'd actually swap DOM elements. 
    // For this demo, we'll just log it and trigger a visual "glitch"
    console.log(`Loading module: ${target}`);
    
    // Trigger a temporary glitch effect on the main heading
    const glitchText = document.querySelector('.glitch-text');
    glitchText.style.animation = 'none';
    void glitchText.offsetWidth; // Trigger reflow
    glitchText.style.animation = null;
}
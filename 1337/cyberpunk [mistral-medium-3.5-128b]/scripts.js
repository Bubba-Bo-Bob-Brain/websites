// ===== Code Rain (Matrix Effect) =====
const canvas = document.getElementById('code-rain');
const ctx = canvas.getContext('2d');

// Set canvas to full viewport size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Characters for the code rain (Cyberpunk/Kanji mix)
const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,.<>?';
const charactersLength = characters.length;

// Raindrop settings
const drops = [];
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);

for (let i = 0; i < columns; i++) {
    drops[i] = {
        x: i * fontSize,
        y: Math.random() * -100,
        speed: Math.random() * 0.5 + 0.2,
        length: Math.random() * 10 + 5
    };
}

// Draw the rain
function drawRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0ff'; // Neon lime
    ctx.font = `${fontSize}px Share Tech Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const char = characters[Math.floor(Math.random() * charactersLength)];

        // Draw the drop
        ctx.fillText(char, drop.x, drop.y);

        // Draw the trail
        for (let j = 1; j < drop.length; j++) {
            const opacity = 1 - (j / drop.length);
            ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.7})`;
            ctx.fillText(
                characters[Math.floor(Math.random() * charactersLength)],
                drop.x,
                drop.y - (j * fontSize)
            );
        }

        // Reset fill style for next drop
        ctx.fillStyle = '#0ff';

        // Move the drop
        drop.y += drop.speed * fontSize;

        // Reset drop if it falls off the screen
        if (drop.y > canvas.height + drop.length * fontSize) {
            drop.y = Math.random() * -100;
            drop.speed = Math.random() * 0.5 + 0.2;
            drop.length = Math.random() * 10 + 5;
        }
    }
}

// Animate the rain
function animateRain() {
    drawRain();
    requestAnimationFrame(animateRain);
}
animateRain();

// ===== Terminal Interaction =====
const commandInput = document.getElementById('command-input');
const terminalOutput = document.querySelector('.terminal-output');

// Fake commands and responses
const commands = {
    help: [
        "Available commands:",
        "  help       - Show this help message",
        "  hack       - Initiate hacking sequence",
        "  scan       - Scan for vulnerabilities",
        "  clear      - Clear the terminal",
        "  data       - Show live data feed",
        "  exit       - Close terminal (not really)"
    ],
    hack: [
        "Initiating hacking sequence...",
        "[OK] Firewall bypassed.",
        "[OK] Encryption cracked.",
        "[WARNING] Intrusion detected! Deploying countermeasures...",
        "[OK] Data extracted. 47 files copied.",
        "Hack complete. Type 'data' to view results."
    ],
    scan: [
        "Scanning network...",
        "[OK] Found 3 open ports: 22, 80, 443",
        "[WARNING] Port 22 (SSH) is vulnerable.",
        "[OK] Scan complete."
    ],
    data: [
        ">> LIVE DATA FEED",
        "------------------",
        "0x4A8F: 10101010 11001100",
        "0x4A90: 01010101 10011001",
        "0x4A91: 11110000 00110011",
        "------------------",
        "Data stream active. Press 'q' to quit."
    ],
    clear: () => {
        terminalOutput.innerHTML = '';
        return [];
    },
    exit: [
        "Terminating connection...",
        "[OK] Session closed.",
        "Type 'help' to reopen."
    ],
    default: [
        `Command not found: ${commandInput.value}`,
        "Type 'help' for available commands."
    ]
};

// Add a new line to the terminal output
function addOutputLine(text, className = '') {
    const line = document.createElement('p');
    line.className = `output-line ${className}`;
    line.innerHTML = `<span class="prompt">root@neon-hack:~$</span> ${text}`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Handle command submission
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        commandInput.value = '';

        // Add the command to the output
        addOutputLine(command);

        // Process the command
        if (command in commands) {
            const responses = commands[command];
            if (typeof responses === 'function') {
                const customResponses = responses();
                customResponses.forEach(line => addOutputLine(line));
            } else {
                responses.forEach(line => addOutputLine(line));
            }
        } else {
            commands.default.forEach(line => addOutputLine(line, 'error'));
        }

        // Add a new empty prompt
        addOutputLine('_');
    }
});

// ===== Glitch Effect (Occasional Text Flicker) =====
function applyGlitchEffect() {
    const lines = document.querySelectorAll('.output-line');
    if (lines.length === 0) return;

    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    const originalText = randomLine.innerHTML;

    // Apply glitch effect
    randomLine.style.color = '#f0f';
    randomLine.style.textShadow = '0 0 5px #f0f';
    randomLine.innerHTML = originalText.replace(/./g, () =>
        Math.random() > 0.5 ? String.fromCharCode(Math.floor(Math.random() * 94) + 33) : ' '
    );

    // Revert after a short delay
    setTimeout(() => {
        randomLine.style.color = '';
        randomLine.style.textShadow = '';
        randomLine.innerHTML = originalText;
    }, 100);
}

// Apply glitch effect randomly
setInterval(applyGlitchEffect, 3000);

// ===== Data Stream Animation (Randomized) =====
const streamLines = document.querySelectorAll('.stream-line');

function updateDataStream() {
    streamLines.forEach((line, index) => {
        // Randomize animation delay for a dynamic effect
        line.style.animationDelay = `${Math.random() * 2}s`;
        line.style.animationDuration = `${1 + Math.random() * 2}s`;

        // Randomly change the color between neon lime and magenta
        const colors = ['#0ff', '#f0f', '#0a0'];
        line.style.background = `linear-gradient(90deg, transparent, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
    });
}

// Update data stream every 2 seconds
setInterval(updateDataStream, 2000);

// Initialize data stream
updateDataStream();

// ===== Blinking Cursor Enhancement =====
const inputCursor = document.createElement('span');
inputCursor.className = 'input-cursor';
inputCursor.textContent = '|';
inputCursor.style.color = '#0ff';
inputCursor.style.animation = 'blink 1s infinite';
commandInput.parentNode.appendChild(inputCursor);

// Update cursor position (for visual effect)
commandInput.addEventListener('input', () => {
    // Simple visual feedback (no actual cursor tracking)
    inputCursor.style.display = 'none';
    setTimeout(() => {
        inputCursor.style.display = 'inline';
    }, 100);
});
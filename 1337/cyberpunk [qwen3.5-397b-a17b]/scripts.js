document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. MATRIX RAIN BACKGROUND
       ========================================= */
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const cols = Math.floor(width / 20);
    const ypos = Array(cols).fill(0);

    // Resize handler
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // Recalculate columns based on new width
        const newCols = Math.floor(width / 20);
        // Adjust ypos array length
        if (newCols > ypos.length) {
            for (let i = ypos.length; i < newCols; i++) ypos[i] = 0;
        }
    });

    function matrix() {
        // Draw a semi-transparent black rectangle to create the fade trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#39ff14'; // Neon Lime
        ctx.font = '15pt monospace';

        ypos.forEach((y, ind) => {
            // Random character from Katakana + Latin
            const text = String.fromCharCode(Math.random() * 128);
            const x = ind * 20;
            
            ctx.fillText(text, x, y);

            // Reset to top randomly after passing screen height
            if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
            else ypos[ind] = y + 20;
        });
    }

    setInterval(matrix, 50);

    /* =========================================
       2. TERMINAL INTERACTION
       ========================================= */
    const inputField = document.getElementById('command-input');
    const outputDiv = document.getElementById('terminal-output');
    const promptText = 'root@neon-ghost:~$ ';

    // Command History
    let history = [];
    let historyIndex = -1;

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value.trim();
            if (command) {
                history.push(command);
                historyIndex = history.length;
                processCommand(command);
            }
            inputField.value = '';
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = history[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                inputField.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                inputField.value = '';
            }
            e.preventDefault();
        }
    });

    // Keep focus on input
    document.addEventListener('click', () => {
        inputField.focus();
    });

    function processCommand(cmd) {
        // Add user command to output
        addLog(`${promptText}${cmd}`, 'user');

        const lowerCmd = cmd.toLowerCase();
        let response = '';
        let delay = 600;

        // Command Parser
        if (lowerCmd === 'help') {
            response = `AVAILABLE COMMANDS:
  - help     : Show this list
  - clear    : Clear terminal
  - date     : System time
  - hack     : Initiate breach sequence
  - whoami   : User identity
  - reboot   : System restart simulation`;
        } else if (lowerCmd === 'clear') {
            outputDiv.innerHTML = '';
            return;
        } else if (lowerCmd === 'date') {
            response = new Date().toString();
        } else if (lowerCmd === 'whoami') {
            response = 'GUEST_USER [UNAUTHORIZED]';
        } else if (lowerCmd === 'reboot') {
            document.body.style.transition = 'all 0.5s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                location.reload();
            }, 600);
            return;
        } else if (lowerCmd === 'hack') {
            runHackSequence();
            return;
        } else {
            response = `Command not found: ${cmd}. Type 'help' for options.`;
        }

        // Simulate typing delay
        setTimeout(() => {
            addLog(response, 'system');
        }, delay);
    }

    function addLog(text, type = 'system') {
        const div = document.createElement('div');
        div.className = `log-entry ${type === 'user' ? '' : 'success'}`;
        // Simple text replacement for newlines
        div.textContent = text; 
        outputDiv.appendChild(div);
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    // Fake Hack Sequence
    function runHackSequence() {
        const steps = [
            "Connecting to host 192.168.0.1...",
            "Bypassing firewall layer 1...",
            "Injecting SQL payload...",
            "Root access requested...",
            "Downloading sensitive data...",
            "Covering tracks...",
            "ACCESS GRANTED."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= steps.length) {
                clearInterval(interval);
                return;
            }
            addLog(steps[i], i === steps.length - 1 ? 'success' : 'system');
            i++;
        }, 800);
    }

    /* =========================================
       3. DATA SIMULATION (Hex & Graphs)
       ========================================= */
    
    // Hex Dump Generator
    const hexDump = document.getElementById('hex-dump');
    const hexChars = "0123456789ABCDEF";
    
    function generateHex() {
        let hex = "";
        for(let i=0; i<300; i++) {
            hex += hexChars[Math.floor(Math.random() * 16)];
            if (i % 2 === 1 && i < 299) hex += " ";
            if (i % 16 === 15) hex += "\n";
        }
        hexDump.textContent = hex;
    }
    setInterval(generateHex, 2000);
    generateHex(); // Initial call

    // Bar Graph Animation
    const graphContainer = document.getElementById('traffic-graph');
    const barCount = 20;
    
    // Initialize bars
    for(let i=0; i<barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '10%';
        graphContainer.appendChild(bar);
    }

    const bars = document.querySelectorAll('.bar');
    setInterval(() => {
        bars.forEach(bar => {
            const h = Math.floor(Math.random() * 90) + 10;
            bar.style.height = `${h}%`;
            // Random color shift for intensity
            if(h > 80) bar.style.backgroundColor = '#ff003c'; // Red for high traffic
            else bar.style.backgroundColor = '#39ff14';
        });
    }, 300);

    // CPU Load Randomizer
    const cpuSpan = document.getElementById('cpu-load');
    setInterval(() => {
        cpuSpan.textContent = `${Math.floor(Math.random() * 30) + 10}%`;
    }, 1500);

    // Uptime Timer
    const uptimeSpan = document.getElementById('uptime');
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const date = new Date(0);
        date.setSeconds(seconds);
        uptimeSpan.textContent = date.toISOString().substr(11, 8);
    }, 1000);

    /* =========================================
       4. GLITCH TEXT EFFECT
       ========================================= */
    const glitchElements = document.querySelectorAll('.glitch-text, .random-ip, .cipher');
    
    glitchElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            const original = el.textContent;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
            let iterations = 0;
            
            const interval = setInterval(() => {
                el.textContent = el.textContent
                    .split('')
                    .map((letter, index) => {
                        if(index < iterations) {
                            return original[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if(iterations >= original.length) {
                    clearInterval(interval);
                    el.textContent = original; // Ensure it ends on original
                }
                
                iterations += 1/3; // Speed of decode
            }, 30);
        });
    });

    /* =========================================
       5. NAVIGATION LOGIC
       ========================================= */
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            // Add to current
            btn.classList.add('active');
            
            // Visual feedback in terminal
            const target = btn.getAttribute('data-target');
            addLog(`Switching view to: ${target.toUpperCase()}...`, 'system');
        });
    });
});
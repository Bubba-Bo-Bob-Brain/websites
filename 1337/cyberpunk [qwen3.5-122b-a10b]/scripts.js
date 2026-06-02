/**
 * NETRUNNER SYSTEM - CORE LOGIC
 * Handles Matrix Rain, Terminal Interaction, and System Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const matrixCanvas = document.getElementById('matrix-canvas');
    const ctx = matrixCanvas.getContext('2d');
    const outputDiv = document.getElementById('output');
    const inputField = document.getElementById('command-input');
    const clockElement = document.getElementById('clock');
    
    // --- Matrix Rain Effect ---
    const resizeCanvas = () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ 1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 14;
    let columns = matrixCanvas.width / fontSize;
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    const drawMatrix = () => {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = '#0F0'; // Toxic Lime
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Randomly vary color for depth (mostly green, some cyan)
            if (Math.random() > 0.98) {
                ctx.fillStyle = '#00f3ff'; // Cyan flash
            } else {
                ctx.fillStyle = '#00ff41'; // Standard green
            }

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    // Start Matrix Animation
    setInterval(drawMatrix, 33);

    // --- Terminal Logic ---
    
    // Auto-scroll to bottom
    const scrollToBottom = () => {
        outputDiv.scrollTop = outputDiv.scrollHeight;
    };

    // Add log entry
    const addLog = (text, type = 'info') => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        let colorClass = '';
        if (type === 'success') colorClass = 'success';
        if (type === 'error') colorClass = 'highlight';
        if (type === 'system') colorClass = ''; // Default

        entry.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="${colorClass}">${text}</span>
        `;
        
        outputDiv.appendChild(entry);
        scrollToBottom();
    };

    // Command Processor
    const processCommand = (cmd) => {
        const command = cmd.trim().toLowerCase();
        
        // Echo command to output
        const cmdEntry = document.createElement('div');
        cmdEntry.className = 'log-entry';
        cmdEntry.innerHTML = `<span class="timestamp">[INPUT]</span> root@netrunner:~$ ${cmd}`;
        outputDiv.appendChild(cmdEntry);

        // Simulate processing delay
        setTimeout(() => {
            switch (command) {
                case 'help':
                    addLog('AVAILABLE COMMANDS:', 'system');
                    addLog('  help     - Show this help menu');
                    addLog('  scan     - Perform system scan');
                    addLog('  whoami   - Display user info');
                    addLog('  clear    - Clear terminal screen');
                    addLog('  matrix   - Toggle matrix rain intensity');
                    addLog('  date     - Display current system time');
                    addLog('  exit     - Terminate session (Simulation)');
                    break;
                
                case 'scan':
                    addLog('Initializing scan sequence...', 'system');
                    setTimeout(() => addLog('Scanning ports...', 'system'), 500);
                    setTimeout(() => addLog('Port 22 (SSH): OPEN', 'success'), 1200);
                    setTimeout(() => addLog('Port 80 (HTTP): OPEN', 'success'), 1500);
                    setTimeout(() => addLog('Port 443 (HTTPS): OPEN', 'success'), 1800);
                    setTimeout(() => addLog('Scan complete. 3 vulnerabilities found.', 'highlight'), 2500);
                    break;

                case 'whoami':
                    addLog('User: root', 'success');
                    addLog('UID: 0 (Administrator)', 'success');
                    addLog('Shell: /bin/netrunner', 'success');
                    break;

                case 'clear':
                    outputDiv.innerHTML = '';
                    addLog('Terminal cleared.', 'system');
                    break;

                case 'matrix':
                    // Toggle opacity of canvas
                    if (matrixCanvas.style.opacity === '0') {
                        matrixCanvas.style.opacity = '0.3';
                        addLog('Matrix rain: ENABLED', 'success');
                    } else {
                        matrixCanvas.style.opacity = '0';
                        addLog('Matrix rain: DISABLED', 'highlight');
                    }
                    break;

                case 'date':
                    addLog(new Date().toString(), 'system');
                    break;

                case 'exit':
                    addLog('Terminating session...', 'error');
                    setTimeout(() => {
                        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;color:#0f0;font-family:monospace;font-size:2rem;">CONNECTION TERMINATED</div>';
                    }, 1000);
                    break;

                case '':
                    // Do nothing
                    break;

                default:
                    addLog(`Command not found: ${command}. Type 'help' for list.`, 'error');
            }
        }, 100); // Small delay for realism
    };

    // Event Listener for Input
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = inputField.value;
            inputField.value = '';
            processCommand(cmd);
        }
    });

    // Keep focus on input (unless user clicks elsewhere)
    document.addEventListener('click', (e) => {
        // Only refocus if they click on the terminal wrapper
        if (e.target.closest('.terminal-wrapper')) {
            inputField.focus();
        }
    });

    // --- System Metrics Simulation ---
    const updateMetrics = () => {
        const cpuBar = document.getElementById('cpu-bar');
        const ramBar = document.getElementById('ram-bar');
        const netBar = document.getElementById('net-bar');
        
        const cpuVal = document.getElementById('cpu-val');
        const ramVal = document.getElementById('ram-val');
        const netVal = document.getElementById('net-val');

        // Randomize values
        const cpu = Math.floor(Math.random() * 30) + 10; // 10-40%
        const ram = Math.floor(Math.random() * 20) + 30; // 30-50%
        const net = Math.floor(Math.random() * 40) + 50; // 50-90%

        cpuBar.style.width = `${cpu}%`;
        ramBar.style.width = `${ram}%`;
        netBar.style.width = `${net}%`;

        cpuVal.textContent = `${cpu}%`;
        ramVal.textContent = `${ram}%`;
        netVal.textContent = `${net}%`;

        // Color change based on load
        if (cpu > 80) cpuBar.style.backgroundColor = 'var(--color-alert)';
        else cpuBar.style.backgroundColor = 'var(--color-primary)';
    };

    setInterval(updateMetrics, 2000);

    // --- Clock ---
    const updateClock = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        clockElement.textContent = timeString;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // Initial greeting
    setTimeout(() => {
        addLog('System ready. Awaiting input...', 'system');
    }, 500);
});
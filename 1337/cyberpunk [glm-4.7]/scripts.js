document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. MATRIX RAIN EFFECT
       ========================================= */
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0);

    // Matrix characters (Katakana + Latin + Numbers)
    const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEF';

    function matrix() {
        // Draw semi-transparent black to create fade effect
        ctx.fillStyle = '#0001';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0f0'; // Fallback
        ctx.fillStyle = '#39ff14'; // Neon Lime
        ctx.font = '15pt monospace';

        ypos.forEach((y, index) => {
            const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            const x = index * 20;
            ctx.fillText(text, x, y);

            // Randomly reset to top
            if (y > 100 + Math.random() * 10000) ypos[index] = 0;
            else ypos[index] = y + 20;
        });
    }

    setInterval(matrix, 50);

    // Handle Resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });


    /* =========================================
       2. INTERACTIVE TERMINAL (CLI)
       ========================================= */
    const terminalOutput = document.getElementById('terminal-output');
    const commandInput = document.getElementById('command-input');
    const terminalPanel = document.querySelector('.terminal-panel');

    // Auto-focus input when clicking terminal
    terminalPanel.addEventListener('click', () => {
        commandInput.focus();
    });

    // Helper to add lines
    function addLog(text, type = 'standard') {
        const div = document.createElement('div');
        div.className = `log-line ${type}`;
        
        // Typewriter effect logic could go here, but for instant feedback we append HTML
        // Sanitizing input slightly to prevent HTML injection in this demo
        div.textContent = `> ${text}`;
        
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Command Processor
    const fileSystem = {
        'secret.txt': 'ENCRYPTED CONTENT: ARASAKA BLUEPRINTS V4',
        'readme.md': 'Welcome to NetRunner OS. Type "help" for commands.',
        'passwords.dat': 'Access Denied. Biometric scan required.'
    };

    const commands = {
        help: 'Available commands: help, clear, ls, cat [file], date, hack, status, scan',
        clear: () => {
            terminalOutput.innerHTML = '<div class="log-line">> Terminal cleared.</div><br>';
        },
        ls: () => {
            return Object.keys(fileSystem).join('  ');
        },
        cat: (arg) => {
            if (!arg) return 'Usage: cat [filename]';
            return fileSystem[arg] || `Error: File '${arg}' not found.`;
        },
        date: () => new Date().toString(),
        status: () => 'System Integrity: 98% // Firewall: Active // Trace: 0%',
        hack: () => {
            setTimeout(() => addLog('Initiating brute force attack...', 'system'), 500);
            setTimeout(() => addLog('Bypassing proxy server... [OK]', 'success'), 1500);
            setTimeout(() => addLog('Injecting SQL payload...', 'warning'), 2500);
            setTimeout(() => addLog('Root access granted.', 'success'), 3500);
            return 'Hack sequence started.';
        },
        scan: () => {
            const ports = [21, 22, 80, 443, 8080, 3306];
            const open = ports.sort(() => 0.5 - Math.random()).slice(0, 2);
            return `Scanning local network... Open ports found: ${open.join(', ')}`;
        }
    };

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawInput = commandInput.value.trim();
            const parts = rawInput.split(' ');
            const cmd = parts[0].toLowerCase();
            const arg = parts[1];

            if (rawInput) {
                addLog(rawInput); // Echo command
                
                if (commands[cmd]) {
                    if (typeof commands[cmd] === 'function') {
                        const response = commands[cmd](arg);
                        if (response) addLog(response);
                    } else {
                        addLog(commands[cmd]);
                    }
                } else {
                    addLog(`Command not found: ${cmd}`, 'error');
                }
            }
            
            commandInput.value = '';
        }
    });


    /* =========================================
       3. NETWORK DATA VISUALIZATION
       ========================================= */
    const netCanvas = document.getElementById('network-canvas');
    const netCtx = netCanvas.getContext('2d');
    
    let netWidth, netHeight;
    
    function resizeNetCanvas() {
        const rect = netCanvas.parentElement.getBoundingClientRect();
        netWidth = netCanvas.width = rect.width;
        netHeight = netCanvas.height = rect.height;
    }
    resizeNetCanvas();
    window.addEventListener('resize', resizeNetCanvas);

    const bars = 30;
    const barWidth = netWidth / bars;
    
    function drawVisualizer() {
        netCtx.clearRect(0, 0, netWidth, netHeight);
        
        // Grid lines
        netCtx.strokeStyle = '#222';
        netCtx.lineWidth = 1;
        netCtx.beginPath();
        for(let i=0; i<netWidth; i+=40) { netCtx.moveTo(i,0); netCtx.lineTo(i, netHeight); }
        netCtx.stroke();

        // Draw Bars
        for (let i = 0; i < bars; i++) {
            const h = Math.random() * (netHeight * 0.8);
            const x = i * (netWidth / bars);
            
            // Gradient for bars
            const grad = netCtx.createLinearGradient(0, netHeight, 0, netHeight - h);
            grad.addColorStop(0, '#39ff14');
            grad.addColorStop(1, '#00f3ff');
            
            netCtx.fillStyle = grad;
            netCtx.fillRect(x + 2, netHeight - h, (netWidth / bars) - 4, h);
        }
        
        requestAnimationFrame(drawVisualizer);
    }
    drawVisualizer();


    /* =========================================
       4. SYSTEM CLOCK & DATA UPDATES
       ========================================= */
    const clockEl = document.getElementById('clock');
    const upSpeedEl = document.getElementById('upload-speed');
    const downSpeedEl = document.getElementById('download-speed');
    const packetLossEl = document.getElementById('packet-loss');

    function updateClock() {
        const now = new Date();
        const timeString = now.toISOString().split('T')[1].replace('Z', '');
        const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
        clockEl.textContent = `${timeString}:${ms}`;
    }
    setInterval(updateClock, 30);

    function randomizeData() {
        const up = (Math.random() * 500 + 100).toFixed(1);
        const down = (Math.random() * 800 + 300).toFixed(1);
        const loss = (Math.random() * 2).toFixed(2);

        upSpeedEl.textContent = `${up} MB/s`;
        downSpeedEl.textContent = `${down} MB/s`;
        packetLossEl.textContent = `${loss}%`;

        // Random color spikes for packet loss
        if(loss > 1.5) packetLossEl.style.color = '#ff003c';
        else packetLossEl.style.color = '#39ff14';
    }
    setInterval(randomizeData, 800);


    /* =========================================
       5. BUTTON INTERACTIONS
       ========================================= */
    const btnDecrypt = document.getElementById('btn-decrypt');
    const btnPurge = document.getElementById('btn-purge');

    btnDecrypt.addEventListener('click', () => {
        btnDecrypt.textContent = 'DECRYPTING...';
        btnDecrypt.disabled = true;
        
        addLog('Manual decrypt initiated via UI...', 'system');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            addLog(`Decryption progress: ${progress}%`, 'standard');
            
            if (progress >= 100) {
                clearInterval(interval);
                addLog('DATA DECRYPTED SUCCESSFULLY.', 'success');
                addLog('Payload: "The future is not set."', 'success');
                btnDecrypt.textContent = 'DECRYPTED';
                btnDecrypt.style.borderColor = '#00f3ff';
                btnDecrypt.style.color = '#00f3ff';
                setTimeout(() => {
                    btnDecrypt.disabled = false;
                    btnDecrypt.textContent = 'DECRYPT DATA';
                    btnDecrypt.style.borderColor = '';
                    btnDecrypt.style.color = '';
                }, 3000);
            }
        }, 100);
    });

    btnPurge.addEventListener('click', () => {
        const logs = document.querySelectorAll('.log-entry');
        logs.forEach(log => {
            log.style.opacity = '0';
            log.style.transition = 'opacity 0.2s';
        });
        setTimeout(() => {
            // Remove them from DOM
            const logContent = document.querySelector('.log-content');
            logContent.innerHTML = '';
            addLog('Logs purged from local storage.', 'warning');
        }, 500);
    });

});
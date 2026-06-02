// CYBER::HACK // TERMINAL v2.077
// Interactive Scripts & Animations
(function() {
    // ============================================
    // CODE RAIN CANVAS BACKGROUND
    // ============================================
    const canvas = document.getElementById('code-rain');
    const ctx = canvas.getContext('2d');
    let width, height;
    let columns;
    let drops = [];
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / 20);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }

    function drawCodeRain() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00ff41';
        ctx.font = '15px Share Tech Mono';
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * 20;
            const y = drops[i] * 20;
            ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
            ctx.fillText(text, x, y);
            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.5;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setInterval(drawCodeRain, 50);

    // ============================================
    // SYSTEM STATUS ANIMATION
    // ============================================
    const cpuFill = document.getElementById('cpu-fill');
    const cpuVal = document.getElementById('cpu-val');
    const ramFill = document.getElementById('ram-fill');
    const ramVal = document.getElementById('ram-val');
    const netFill = document.getElementById('net-fill');
    const netVal = document.getElementById('net-val');
    const uptimeVal = document.getElementById('uptime-val');
    const startTime = Date.now();

    function updateSystemStatus() {
        // CPU
        const cpu = Math.floor(Math.random() * 30) + 10;
        cpuFill.style.width = cpu + '%';
        cpuVal.textContent = cpu + '%';
        // RAM
        const ramUsed = (Math.random() * 4 + 4).toFixed(1);
        ramFill.style.width = (ramUsed / 16 * 100) + '%';
        ramVal.textContent = ramUsed + '/16GB';
        // NET
        const net = (Math.random() * 2 + 0.5).toFixed(1);
        netFill.style.width = (net / 3 * 100) + '%';
        netVal.textContent = net + 'GB/s';
        // Uptime
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        uptimeVal.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateSystemStatus, 2000);
    updateSystemStatus();

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });

    // ============================================
    // COMMAND LINE INTERFACE
    // ============================================
    const commandInput = document.getElementById('command-input');
    const commandOutput = document.getElementById('command-output');
    const commands = {
        help: () => {
            return [
                { type: 'info', text: 'Available commands:' },
                { type: 'success', text: ' \'help\' - Show this help message' },
                { type: 'success', text: ' \'about\' - Display information about us' },
                { type: 'success', text: ' \'tools\' - List available hacking tools' },
                { type: 'success', text: ' \'exploits\' - Show known vulnerabilities' },
                { type: 'success', text: ' \'clear\' - Clear terminal output' },
                { type: 'success', text: ' \'hack\' - Initiate hack sequence' },
                { type: 'success', text: ' \'matrix\' - Enter the matrix' },
                { type: 'success', text: ' \'status\' - Show system status' },
                { type: 'success', text: ' \'whoami\' - Display current user' },
                { type: 'success', text: ' \'date\' - Show current date/time' },
                { type: 'success', text: ' \'scan\' - Scan network for targets' }
            ];
        },
        about: () => {
            return [
                { type: 'info', text: '> CYBER::HACK Collective' },
                { type: 'output', text: '> Founded 2077 - Night City' },
                { type: 'output', text: '> Global network of digital rebels' },
                { type: 'output', text: '> Mission: Expose corporate overreach, defend privacy' },
                { type: 'success', text: '> Status: ACTIVE' }
            ];
        },
        tools: () => {
            return [
                { type: 'info', text: '> Available Tools:' },
                { type: 'output', text: ' [01] NETRUNNER.EXE - Network exploitation framework' },
                { type: 'output', text: ' [02] GHOST_PROTOCOL - Anonymization suite' },
                { type: 'output', text: ' [03] CRACKER_V9 - Hash cracking utility' },
                { type: 'output', text: ' [04] SNIFF_MASTER - Packet analysis tool' },
                { type: 'output', text: ' [05] DATA_MINER - Data extraction tool' },
                { type: 'success', text: '> All tools ready for deployment' }
            ];
        },
        exploits: () => {
            return [
                { type: 'info', text: '> Known Exploits:' },
                { type: 'error', text: ' [CRITICAL] EXP-2077-01: CORP_FIREWALL_BYPASS' },
                { type: 'output', text: ' Bypasses corporate firewalls (98% success)' },
                { type: 'error', text: ' [HIGH] EXP-2077-02: NEURAL_LINK_INJECT' },
                { type: 'output', text: ' Injects payload into neural interfaces' },
                { type: 'output', text: ' [MEDIUM] EXP-2077-03: DRONE_HIJACK' },
                { type: 'output', text: ' Takes control of security drones' },
                { type: 'error', text: ' [CRITICAL] EXP-2077-04: DATA_VAULT_BREACH' },
                { type: 'output', text: ' Decrypts corporate data vaults' }
            ];
        },
        clear: () => {
            commandOutput.innerHTML = '';
            return [];
        },
        hack: () => {
            const hackSequence = [
                { type: 'info', text: '> Initializing hack sequence...' },
                { type: 'output', text: '> Scanning target ports...' },
                { type: 'success', text: '> Port 22: OPEN' },
                { type: 'success', text: '> Port 443: OPEN' },
                { type: 'output', text: '> Exploiting vulnerability CVE-2077-1337...' },
                { type: 'success', text: '> Buffer overflow successful' },
                { type: 'output', text: '> Uploading payload...' },
                { type: 'success', text: '> Payload deployed' },
                { type: 'output', text: '> Establishing backdoor...' },
                { type: 'success', text: '> Root access granted' },
                { type: 'success', text: '> HACK COMPLETE - SYSTEM COMPROMISED' }
            ];
            return hackSequence;
        },
        matrix: () => {
            const matrixLines = [
                { type: 'info', text: '> Entering the matrix...' },
                { type: 'output', text: '> Wake up, Neo...' },
                { type: 'output', text: '> The Matrix has you...' },
                { type: 'output', text: '> Follow the white rabbit.' },
                { type: 'success', text: '> Welcome to the real world.' }
            ];
            return matrixLines;
        },
        status: () => {
            return [
                { type: 'info', text: '> System Status Report:' },
                { type: 'output', text: `> CPU Usage: ${cpuVal.textContent}` },
                { type: 'output', text: `> RAM Usage: ${ramVal.textContent}` },
                { type: 'output', text: `> Network: ${netVal.textContent}` },
                { type: 'output', text: `> Uptime: ${uptimeVal.textContent}` },
                { type: 'success', text: '> All systems operational' }
            ];
        },
        whoami: () => {
            return [
                { type: 'info', text: '> Current User:' },
                { type: 'success', text: '> guest@cyberhack' },
                { type: 'output', text: '> Privilege Level: USER' },
                { type: 'output', text: '> Access: RESTRICTED' }
            ];
        },
        date: () => {
            const now = new Date();
            const dateStr = now.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
            return [
                { type: 'info', text: '> Current Date/Time:' },
                { type: 'success', text: `> ${dateStr}` }
            ];
        },
        scan: () => {
            const targets = [
                '192.168.1.105',
                '10.0.0.42',
                '172.16.0.88',
                '192.168.2.201',
                '10.0.1.15',
                '172.16.1.33'
            ];
            const results = [
                { type: 'info', text: '> Scanning network for targets...' }
            ];
            targets.forEach((ip, index) => {
                setTimeout(() => {
                    const status = Math.random() > 0.5 ? 'success' : 'error';
                    const statusText = status === 'success' ? 'VULNERABLE' : 'SECURE';
                    results.push({ type: status, text: `> [${(index + 1).toString().padStart(2, '0')}] ${ip} - ${statusText}` });
                    if (index === targets.length - 1) {
                        results.push({ type: 'success', text: '> Scan complete. 3 targets found.' });
                    }
                }, index * 300);
            });
            return results;
        }
    };

    function executeCommand(cmd) {
        const trimmedCmd = cmd.trim().toLowerCase();
        const args = trimmedCmd.split(' ');
        const command = args[0];
        if (commands[command]) {
            return commands[command]();
        } else if (trimmedCmd === '') {
            return [];
        } else {
            return [
                { type: 'error', text: `> Command not found: ${command}` },
                { type: 'info', text: '> Type \'help\' for available commands' }
            ];
        }
    }

    function displayOutput(lines) {
        lines.forEach((line, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.className = line.type === 'success' ? 'output-success' : line.type === 'error' ? 'output-error' : line.type === 'info' ? 'output-info' : 'output-line';
                p.textContent = line.text;
                commandOutput.appendChild(p);
                commandOutput.scrollTop = commandOutput.scrollHeight;
            }, index * 50);
        });
    }

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = commandInput.value;
            commandOutput.classList.add('active');
            const output = executeCommand(cmd);
            displayOutput(output);
            commandInput.value = '';
            if (output.length > 0) {
                commandOutput.scrollTop = commandOutput.scrollHeight;
            }
        }
    });

    // Focus command input on click anywhere in terminal
    document.querySelector('.terminal').addEventListener('click', (e) => {
        if (e.target !== commandInput && !e.target.closest('.contact-form')) {
            commandInput.focus();
        }
    });

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('message').value;
        commandOutput.classList.add('active');
        const output = [
            { type: 'info', text: '> Encrypting message...' },
            { type: 'output', text: '> Applying AES-256 encryption...' },
            { type: 'success', text: '> Encryption complete' },
            { type: 'output', text: '> Routing through secure nodes...' },
            { type: 'success', text: '> Message transmitted successfully' },
            { type: 'info', text: '> Reference ID: ' + Math.random().toString(36).substr(2, 9).toUpperCase() }
        ];
        displayOutput(output);
        contactForm.reset();
        commandOutput.scrollTop = commandOutput.scrollHeight;
    });

    // ============================================
    // RANDOM GLITCH EFFECTS
    // ============================================
    function triggerGlitch() {
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = 'glitch-skew 0.3s infinite linear alternate-reverse';
            setTimeout(() => {
                el.style.animation = 'glitch-skew 4s infinite linear alternate-reverse';
            }, 300);
        });
    }
    setInterval(triggerGlitch, 10000);

    // ============================================
    // TYPING EFFECT FOR WELCOME TEXT
    // ============================================
    function typeWriter(element, text, speed = 30) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Apply typing effect to terminal text on load
    window.addEventListener('load', () => {
        const terminalTexts = document.querySelectorAll('.terminal-text');
        terminalTexts.forEach((el, index) => {
            const originalText = el.innerHTML;
            setTimeout(() => {
                typeWriter(el, originalText.replace(/<[^>]*>/g, ''), 20);
            }, index * 500);
        });
    });

    // ============================================
    // DATA STREAM RANDOMIZATION
    // ============================================
    const dataBlocks = document.querySelectorAll('.data-block');
    function randomizeDataStream() {
        dataBlocks.forEach(block => {
            const randomDuration = (Math.random() * 2 + 1).toFixed(1);
            const randomDelay = (Math.random() * 2).toFixed(1);
            block.style.setProperty('--duration', randomDuration + 's');
            block.style.setProperty('--delay', randomDelay + 's');
        });
    }
    setInterval(randomizeDataStream, 3000);

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Ctrl+L to clear command output
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            commandOutput.innerHTML = '';
            commandOutput.classList.remove('active');
        }
        // Escape to blur input
        if (e.key === 'Escape') {
            commandInput.blur();
        }
        // Focus command input with /
        if (e.key === '/' && document.activeElement !== commandInput && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            commandInput.focus();
        }
    });

    // ============================================
    // AUDIO FEEDBACK (Optional - using Web Audio API)
    // ============================================
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    function playBeep(frequency = 800, duration = 50, type = 'square') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    // Play sound on command execution
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            playBeep(1200, 30);
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    console.log('%c CYBER::HACK TERMINAL v2.077 ', 'background: #00ff41; color: #0a0a0f; font-size: 20px; padding: 10px;');
    console.log('%c System initialized. All connections secure. ', 'color: #00ff41;');
    console.log('%c Type "help" in the command interface to get started. ', 'color: #00d4ff;');
})();
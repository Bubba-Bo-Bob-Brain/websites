// ============================================================
// NEURAL_BREACH v4.1.7 — MAIN SCRIPT FILE
// Cyberpunk Hacking Interface
// ============================================================

(function () {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        glitchChance: 0.003,
        glitchInterval: 150,
        typeSpeedMin: 30,
        typeSpeedMax: 80,
        codeRainChars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01234567890ABCDEF',
        codeRainFont: '14px "Share Tech Mono", monospace',
        codeRainOpacity: 0.15,
        matrixMode: false,
        streamSpeed: 1,
        streamColors: ['#00ff41', '#00f0ff', '#ff00ff', '#f0ff00'],
        currentStreamColor: 0,
    };

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function hexColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ==========================================
    // 1. CODE RAIN BACKGROUND
    // ==========================================
    const codeRainCanvas = document.getElementById('codeRain');
    const ctx = codeRainCanvas.getContext('2d');
    let codeRainColumns = [];
    let rainAnimationId;

    function initCodeRain() {
        codeRainCanvas.width = window.innerWidth;
        codeRainCanvas.height = window.innerHeight;
        const columnCount = Math.floor(codeRainCanvas.width / 16);
        codeRainColumns = [];
        for (let i = 0; i < columnCount; i++) {
            codeRainColumns.push({
                x: i * 16,
                y: rand(-50, 0),
                speed: randFloat(0.5, 2.5),
                chars: [],
                length: rand(8, 30),
            });
            for (let j = 0; j < codeRainColumns[i].length; j++) {
                codeRainColumns[i].chars.push(CONFIG.codeRainChars[rand(0, CONFIG.codeRainChars.length - 1)]);
            }
        }
    }

    function drawCodeRain() {
        ctx.clearRect(0, 0, codeRainCanvas.width, codeRainCanvas.height);
        ctx.font = codeRainFont;

        for (let col of codeRainColumns) {
            for (let i = 0; i < col.length; i++) {
                const charY = col.y + i * 16;
                if (charY < 0 || charY > codeRainCanvas.height) continue;

                const brightness = CONFIG.matrixMode
                    ? (i === col.length - 1 ? 1 : 0.4 + Math.random() * 0.2)
                    : (i === col.length - 1 ? 0.8 : 0.15 + Math.random() * 0.1);

                if (CONFIG.matrixMode) {
                    ctx.fillStyle = `rgba(0, 255, 65, ${brightness})`;
                } else {
                    const hue = i === col.length - 1 ? 150 : 150;
                    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${brightness * 0.3})`;
                }

                ctx.fillText(col.chars[i], col.x, charY);
            }

            col.y += col.speed * CONFIG.streamSpeed;
            if (col.y > codeRainCanvas.height) {
                col.y = rand(-50, -10);
                col.speed = randFloat(0.5, 2.5);
                col.length = rand(8, 30);
                col.chars = [];
                for (let j = 0; j < col.length; j++) {
                    col.chars.push(CONFIG.codeRainChars[rand(0, CONFIG.codeRainChars.length - 1)]);
                }
            }
        }

        rainAnimationId = requestAnimationFrame(drawCodeRain);
    }

    // ==========================================
    // 2. CUSTOM CURSOR
    // ==========================================
    const cyberCursor = document.getElementById('cyberCursor');
    let cursorX = 0, cursorY = 0;
    let cursorTargetX = 0, cursorTargetY = 0;
    let hovering = false;

    document.addEventListener('mousemove', (e) => {
        cursorTargetX = e.clientX;
        cursorTargetY = e.clientY;
    });

    function animateCursor() {
        cursorX += (cursorTargetX - cursorX) * 0.15;
        cursorY += (cursorTargetY - cursorY) * 0.15;
        cyberCursor.style.left = cursorX + 'px';
        cyberCursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }

    document.querySelectorAll('a, button, input, .help-item, .system-card, .shell-entry, .cyber-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cyberCursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cyberCursor.classList.remove('hovering');
        });
    });

    // ==========================================
    // 3. GLITCH EFFECT
    // ==========================================
    const glitchOverlay = document.getElementById('glitchOverlay');
    const glitchText = document.querySelector('.glitch-text');
    let glitchActive = false;

    function triggerGlitch() {
        if (glitchActive) return;
        glitchActive = true;
        glitchOverlay.classList.add('active');

        const duration = rand(100, 400);
        setTimeout(() => {
            glitchOverlay.classList.remove('active');
            setTimeout(() => { glitchActive = false; }, 50);
        }, duration);
    }

    // Random periodic glitch
    setInterval(() => {
        if (Math.random() < CONFIG.glitchChance) {
            triggerGlitch();
        }
    }, 200);

    // Glitch on navigation click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            triggerGlitch();
            setTimeout(triggerGlitch, 100);
        });
    });

    // Intense glitch on hover of glitch text
    const glitchWrapper = document.querySelector('.glitch-wrapper');
    glitchWrapper.addEventListener('mouseenter', () => {
        let count = 0;
        const interval = setInterval(() => {
            triggerGlitch();
            count++;
            if (count > 8) {
                clearInterval(interval);
            }
        }, 120);
    });

    // ==========================================
    // 4. NAVIGATION
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const sections = document.querySelectorAll('section');
    const navAnchors = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navAnchors.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active section on scroll
    function highlightNavOnScroll() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // 5. SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                revealObserver.unobserve(entry.target);

                // Animate progress bars in system cards
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    const width = progressBar.getAttribute('data-width');
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                    }, 300);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.system-card, .stat-item, .shell-entry, .help-item, .stream-stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // Animate stat counters when they come into view
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue) {
                    animateCounter(statValue, parseInt(statValue.getAttribute('data-count')), 1500);
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-item').forEach(item => statObserver.observe(item));

    function animateCounter(element, target, duration) {
        const startTime = performance.now();
        const startVal = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
            const currentVal = Math.floor(startVal + (target - startVal) * eased);

            if (Number.isInteger(target) && target > 100) {
                element.textContent = currentVal.toLocaleString();
            } else if (Number.isInteger(target) && target <= 100) {
                element.textContent = currentVal + '%';
            } else {
                element.textContent = currentVal.toFixed(2);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ==========================================
    // 6. HERO TERMINAL AUTO-TYPE
    // ==========================================
    const typedText = document.getElementById('typedText');
    const heroTerminalMessages = [
        'help --advanced',
        'bypass_ICE --level 7',
        'exfil --target=primary',
        'neural_sync --init',
        'status --verbose',
        'whoami',
    ];
    let heroMessageIndex = 0;
    let heroCharIndex = 0;
    let heroDeleting = false;

    function typeHeroText() {
        const currentMessage = heroTerminalMessages[heroMessageIndex];

        if (!heroDeleting) {
            typedText.textContent = currentMessage.substring(0, heroCharIndex);
            heroCharIndex++;

            if (heroCharIndex > currentMessage.length) {
                setTimeout(() => { heroDeleting = true; }, 1500);
            }
        } else {
            typedText.textContent = currentMessage.substring(0, heroCharIndex);
            heroCharIndex--;

            if (heroCharIndex < 0) {
                heroDeleting = false;
                heroMessageIndex = (heroMessageIndex + 1) % heroTerminalMessages.length;
            }
        }

        const speed = heroDeleting ? 25 : rand(CONFIG.typeSpeedMin, CONFIG.typeSpeedMax);
        setTimeout(typeHeroText, speed);
    }

    // ==========================================
    // 7. INTERACTIVE TERMINAL
    // ==========================================
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: () => {
            return [
                '<span class="output-line info">╔══════════════════════════════════════════════╗</span>',
                '<span class="output-line info">║  AVAILABLE COMMANDS                         ║</span>',
                '<span class="output-line info">╠══════════════════════════════════════════════╣</span>',
                '<span class="output-line info">║  scan &lt;target&gt;       — Vulnerability scan   ║</span>',
                '<span class="output-line info">║  status              — System diagnostics    ║</span>',
                '<span class="output-line info">║  shells              — List active shells    ║</span>',
                '<span class="output-line info">║  clear               — Clear terminal        ║</span>',
                '<span class="output-line info">║  decrypt &lt;hash&gt;     — Hash crack attempt    ║</span>',
                '<span class="output-line info">║  matrix              — Toggle matrix rain     ║</span>',
                '<span class="output-line info">║  uptime              — System uptime          ║</span>',
                '<span class="output-line info">║  ping &lt;host&gt;        — Network ping           ║</span>',
                '<span class="output-line info">║  whoami              — Identity check         ║</span>',
                '<span class="output-line info">║  netstat             — Network connections    ║</span>',
                '<span class="output-line info">║  version             — System version info    ║</span>',
                '<span class="output-line info">╚══════════════════════════════════════════════╝</span>',
            ].join('\n');
        },
        scan: (args) => {
            if (!args || args.length === 0) {
                return '<span class="output-line error">ERROR: Target not specified. Usage: scan &lt;target&gt;</span>';
            }
            const target = args.join(' ');
            const results = [
                `<span class="output-line">Scanning target: ${target}...</span>`,
                `<span class="output-line">Port 22 (SSH)     — OPEN — OpenSSH 8.2</span>`,
                `<span class="output-line">Port 80 (HTTP)    — OPEN — nginx 1.18.0</span>`,
                `<span class="output-line">Port 443 (HTTPS)  — OPEN — TLS 1.3</span>`,
                `<span class="output-line">Port 3306 (MySQL) — OPEN — MySQL 5.7.32</span>`,
                `<span class="output-line">Port 8080 (HTTP)  — OPEN — Apache Tomcat 9.0</span>`,
                `<span class="output-line success">Scan complete: 5 open ports found</span>`,
                `<span class="output-line warning">Vulnerabilities detected: 3</span>`,
                `<span class="output-line">  - CVE-2021-44228 (Log4Shell) — CRITICAL</span>`,
                `<span class="output-line">  - CVE-2021-40539 (mod_proxy) — HIGH</span>`,
                `<span class="output-line">  - CVE-2020-1938 (Ghostcat) — MEDIUM</span>`,
            ];
            return results.join('\n');
        },
        status: () => {
            const uptime = document.getElementById('footerUptime').textContent;
            return [
                `<span class="output-line">═══════════════════════════════════</span>`,
                `<span class="output-line success">SYSTEM STATUS: OPERATIONAL</span>`,
                `<span class="output-line">═══════════════════════════════════</span>`,
                `<span class="output-line">  Kernel:     cyberpunk-6.6.6</span>`,
                `<span class="output-line">  Platform:   NEO-ARCH x86_64</span>`,
                `<span class="output-line">  Uptime:     ${uptime}</span>`,
                `<span class="output-line">  Memory:     0x7FFF_FFFF KB</span>`,
                `<span class="output-line">  CPU Load:   ${rand(12, 45)}%</span>`,
                `<span class="output-line">  Processes:  ${rand(85, 240)}</span>`,
                `<span class="output-line">  Threads:    ${rand(200, 800)}</span>`,
                `<span class="output-line">  Network:    ACTIVE</span>`,
                `<span class="output-line">  Encryption: AES-256-GCM ● ACTIVE</span>`,
                `<span class="output-line">═══════════════════════════════════</span>`,
            ].join('\n');
        },
        shells: () => {
            return [
                `<span class="output-line">═══ ACTIVE SHELLS ═════════════════════</span>`,
                `<span class="output-line success">  [1] 192.168.47.12   — ROOT    — 48m</span>`,
                `<span class="output-line success">  [2] 10.0.0.83       — ADMIN   — 13m</span>`,
                `<span class="output-line warning">  [3] 172.16.254.9    — USER    — IDLE</span>`,
                `<span class="output-line success">  [4] 203.0.113.42    — ROOT    — 9m</span>`,
                `<span class="output-line">  [5] 198.51.100.77   — BRUTE.. — EST..</span>`,
                `<span class="output-line">══════════════════════════════════════</span>`,
                `<span class="output-line">Total: 5 shells | 3 root, 1 admin, 1 user</span>`,
            ].join('\n');
        },
        decrypt: (args) => {
            if (!args || args.length === 0) {
                return '<span class="output-line error">ERROR: Hash not specified. Usage: decrypt &lt;hash&gt;</span>';
            }
            const hash = args.join(' ');
            const results = [
                `<span class="output-line">Analyzing hash: ${hash}</span>`,
                `<span class="output-line">Hash type: SHA-256</span>`,
                `<span class="output-line">Loading dictionary... [OK]</span>`,
                `<span class="output-line">Running brute force attack...</span>`,
            ];
            return results.join('\n');
        },
        matrix: () => {
            CONFIG.matrixMode = !CONFIG.matrixMode;
            document.body.classList.toggle('matrix-active', CONFIG.matrixMode);
            const state = CONFIG.matrixMode ? 'ENABLED' : 'DISABLED';
            const color = CONFIG.matrixMode ? 'success' : 'warning';
            return `<span class="output-line ${color}">Matrix rain: ${state}</span>`;
        },
        uptime: () => {
            return `<span class="output-line info">System uptime: ${document.getElementById('footerUptime').textContent}</span>`;
        },
        whoami: () => {
            return [
                `<span class="output-line">═══════════════════════════</span>`,
                `<span class="output-line success">  IDENTITY: OPERATOR_NULL</span>`,
                `<span class="output-line">  CLEARANCE: LEVEL 7</span>`,
                `<span class="output-line">  STATUS: ACTIVE</span>`,
                `<span class="output-line">  AFFILIATION: NEURAL_BREACH</span>`,
                `<span class="output-line">  LOCATION: UNKNOWN</span>`,
                `<span class="output-line">  LAST_SEEN: <span class="live-clock" data-format="time"></span></span>`,
                `<span class="output-line">═══════════════════════════</span>`,
            ].join('\n');
        },
        netstat: () => {
            return [
                `<span class="output-line">Active connections:</span>`,
                `<span class="output-line">  Proto  Local Address    Foreign Address      State</span>`,
                `<span class="output-line">  TCP    10.0.0.1:443     192.168.47.12:8080   ESTABLISHED</span>`,
                `<span class="output-line">  TCP    10.0.0.1:22      203.0.113.42:55123   ESTABLISHED</span>`,
                `<span class="output-line">  TCP    10.0.0.1:8080    10.0.0.83:4444       LISTENING</span>`,
                `<span class="output-line">  TCP    10.0.0.1:3306    172.16.254.9:38921   TIME_WAIT</span>`,
                `<span class="output-line">  UDP    10.0.0.1:53      *:*                  LISTENING</span>`,
                `<span class="output-line info">  ${rand(4, 12)} connections found</span>`,
            ].join('\n');
        },
        version: () => {
            return [
                `<span class="output-line">════════════════════════════════</span>`,
                `<span class="output-line success">  NEURAL_BREACH v4.1.7</span>`,
                `<span class="output-line">  Build: 20241201.1742</span>`,
                `<span class="output-line">  Framework: CyberNet v3.2</span>`,
                `<span class="output-line">  Exploit DB: 4,821 entries</span>`,
                `<span class="output-line">  Status: FULLY OPERATIONAL</span>`,
                `<span class="output-line">════════════════════════════════</span>`,
            ].join('\n');
        },
        ping: (args) => {
            if (!args || args.length === 0) {
                return '<span class="output-line error">ERROR: Host not specified. Usage: ping &lt;host&gt;</span>';
            }
            const host = args.join(' ');
            const results = [];
            for (let i = 0; i < 4; i++) {
                const ms = rand(8, 150);
                results.push(`<span class="output-line">Reply from ${host}: bytes=32 time=${ms}ms TTL=${rand(30, 120)}</span>`);
            }
            return [
                `<span class="output-line">Pinging ${host} with 32 bytes of data:</span>`,
                ...results,
                `<span class="output-line">═══════════════════════════════════</span>`,
                `<span class="output-line">Ping statistics for ${host}:</span>`,
                `<span class="output-line">    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)</span>`,
            ].join('\n');
        },
    };

    function addTerminalOutput(text, className) {
        const lines = text.split('\n');
        lines.forEach(line => {
            const div = document.createElement('div');
            div.className = 'terminal-line';
            div.innerHTML = line;
            terminalBody.appendChild(div);
        });

        // Re-add input row
        const inputRow = document.querySelector('.terminal-input-row');
        terminalBody.appendChild(inputRow);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(cmd) {
        cmd = cmd.trim();
        if (!cmd) return;

        // Add command to history
        commandHistory.unshift(cmd);
        historyIndex = -1;

        // Display command
        addTerminalOutput(`<span class="prompt">root@breach:~$&nbsp;</span><span class="command">${escapeHtml(cmd)}</span>`);

        // Parse command
        const parts = cmd.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (command === 'clear') {
            terminalBody.innerHTML = '';
            return;
        }

        if (commands[command]) {
            setTimeout(() => {
                addTerminalOutput(commands[command](args));
            }, rand(100, 400));
        } else {
            setTimeout(() => {
                addTerminalOutput(`<span class="output-line error">ERROR: Command not found: '${escapeHtml(command)}'. Type 'help' for available commands.</span>`);
            }, 200);
        }

        // Random chance of triggering glitch on command execution
        if (Math.random() < 0.1) {
            setTimeout(triggerGlitch, 100);
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
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
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const val = terminalInput.value;
            const commandsList = Object.keys(commands);
            const match = commandsList.find(c => c.startsWith(val));
            if (match) {
                terminalInput.value = match + ' ';
            }
        }
    });

    // Keep focus on terminal input when terminal section is active
    terminalInput.addEventListener('focus', () => {
        terminalInput.parentElement.parentElement.classList.add('focused');
    });
    terminalInput.addEventListener('blur', () => {
        terminalInput.parentElement.parentElement.classList.remove('focused');
    });

    // ==========================================
    // 8. DATA STREAM CANVAS VISUALIZATION
    // ==========================================
    const dataStreamCanvas = document.getElementById('dataStreamCanvas');
    const dsCtx = dataStreamCanvas.getContext('2d');
    let dataStreamParticles = [];
    let dataStreamRunning = true;

    function initDataStream() {
        const rect = dataStreamCanvas.parentElement.getBoundingClientRect();
        dataStreamCanvas.width = rect.width;
        dataStreamCanvas.height = 250;
        dataStreamParticles = [];

        for (let i = 0; i < 80; i++) {
            dataStreamParticles.push(createDataParticle());
        }
    }

    function createDataParticle() {
        const color = CONFIG.streamColors[rand(0, CONFIG.streamColors.length - 1)];
        return {
            x: rand(0, dataStreamCanvas.width),
            y: rand(0, dataStreamCanvas.height),
            vx: randFloat(-1.5, 1.5),
            vy: randFloat(1, 3),
            size: rand(1, 3),
            color: color,
            alpha: randFloat(0.1, 0.8),
            life: rand(50, 200),
            maxLife: 200,
            type: rand(0, 2), // 0: dot, 1: line, 2: char
            char: CONFIG.codeRainChars[rand(0, CONFIG.codeRainChars.length - 1)],
        };
    }

    function drawDataStream() {
        if (!dataStreamRunning) {
            requestAnimationFrame(drawDataStream);
            return;
        }

        dsCtx.fillStyle = 'rgba(5, 5, 16, 0.15)';
        dsCtx.fillRect(0, 0, dataStreamCanvas.width, dataStreamCanvas.height);

        // Draw grid lines
        dsCtx.strokeStyle = 'rgba(0, 255, 65, 0.03)';
        dsCtx.lineWidth = 0.5;
        for (let x = 0; x < dataStreamCanvas.width; x += 40) {
            dsCtx.beginPath();
            dsCtx.moveTo(x, 0);
            dsCtx.lineTo(x, dataStreamCanvas.height);
            dsCtx.stroke();
        }
        for (let y = 0; y < dataStreamCanvas.height; y += 40) {
            dsCtx.beginPath();
            dsCtx.moveTo(0, y);
            dsCtx.lineTo(dataStreamCanvas.width, y);
            dsCtx.stroke();
        }

        // Update and draw particles
        dataStreamParticles.forEach((p, i) => {
            p.life--;
            if (p.life <= 0 || p.y > dataStreamCanvas.height + 10 || p.x < -10 || p.x > dataStreamCanvas.width + 10) {
                dataStreamParticles[i] = createDataParticle();
                return;
            }

            p.x += p.vx * CONFIG.streamSpeed;
            p.y += p.vy * CONFIG.streamSpeed;

            const lifeRatio = p.life / p.maxLife;
            const alpha = p.alpha * lifeRatio;

            dsCtx.globalAlpha = alpha;

            if (p.type === 2 && Math.random() > 0.95) {
                dsCtx.font = '10px "Share Tech Mono", monospace';
                dsCtx.fillStyle = p.color;
                dsCtx.fillText(p.char, p.x, p.y);
                p.char = CONFIG.codeRainChars[rand(0, CONFIG.codeRainChars.length - 1)];
            } else {
                dsCtx.fillStyle = p.color;
                dsCtx.beginPath();
                dsCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                dsCtx.fill();
            }
        });

        dsCtx.globalAlpha = 1;

        // Draw connections between nearby particles
        for (let i = 0; i < dataStreamParticles.length; i++) {
            for (let j = i + 1; j < dataStreamParticles.length; j++) {
                const dx = dataStreamParticles[i].x - dataStreamParticles[j].x;
                const dy = dataStreamParticles[i].y - dataStreamParticles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 60) {
                    dsCtx.strokeStyle = `rgba(0, 255, 65, ${0.03 * (1 - dist / 60)})`;
                    dsCtx.lineWidth = 0.5;
                    dsCtx.beginPath();
                    dsCtx.moveTo(dataStreamParticles[i].x, dataStreamParticles[i].y);
                    dsCtx.lineTo(dataStreamParticles[j].x, dataStreamParticles[j].y);
                    dsCtx.stroke();
                }
            }
        }

        requestAnimationFrame(drawDataStream);
    }

    // Stream control buttons
    const streamToggle = document.getElementById('streamToggle');
    const streamSpeedBtn = document.getElementById('streamSpeed');
    const streamColorBtn = document.getElementById('streamColor');

    streamToggle.addEventListener('click', () => {
        dataStreamRunning = !dataStreamRunning;
        streamToggle.querySelector('span').textContent = dataStreamRunning ? 'PAUSE_STREAM' : 'RESUME_STREAM';
        streamToggle.classList.toggle('active', dataStreamRunning);
    });

    const speeds = [1, 2, 4, 0.5];
    let speedIndex = 0;
    streamSpeedBtn.addEventListener('click', () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        CONFIG.streamSpeed = speeds[speedIndex];
        streamSpeedBtn.querySelector('span').textContent = `SPEED: ${CONFIG.streamSpeed}x`;
    });

    streamColorBtn.addEventListener('click', () => {
        CONFIG.currentStreamColor = (CONFIG.currentStreamColor + 1) % CONFIG.streamColors.length;
        const colorNames = ['LIME', 'CYAN', 'MAGENTA', 'YELLOW', 'RAINBOW'];
        streamColorBtn.querySelector('span').textContent = `MODE: ${colorNames[CONFIG.currentStreamColor]}`;

        if (CONFIG.currentStreamColor === 4) {
            // Rainbow mode - all colors
            CONFIG.streamColors = ['#00ff41', '#00f0ff', '#ff00ff', '#f0ff00', '#ff6600'];
        } else {
            const primary = CONFIG.streamColors[CONFIG.currentStreamColor];
            CONFIG.streamColors = [primary];
        }
    });

    // ==========================================
    // 9. LIVE UPDATING STATS
    // ==========================================
    function updateLiveStats() {
        // Update packet count in data stream section
        const packetsEl = document.getElementById('packetsCount');
        const bandwidthEl = document.getElementById('bandwidthVal');
        const latencyEl = document.getElementById('latencyVal');
        const nodesEl = document.getElementById('nodesCount');

        if (packetsEl) packetsEl.textContent = rand(1200, 9999).toLocaleString();
        if (bandwidthEl) bandwidthEl.textContent = randFloat(1.2, 9.8).toFixed(1);
        if (latencyEl) latencyEl.textContent = rand(1, 42);
        if (nodesEl) nodesEl.textContent = rand(2800, 3200).toLocaleString();
    }

    setInterval(updateLiveStats, 2000);
    updateLiveStats();

    // ==========================================
    // 10. LIVE CLOCKS
    // ==========================================
    function updateLiveClocks() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

        document.querySelectorAll('.live-clock[data-format="time"]').forEach(el => {
            el.textContent = timeStr;
        });
        document.querySelectorAll('.live-clock[data-format="date"]').forEach(el => {
            el.textContent = dateStr;
        });
    }

    setInterval(updateLiveClocks, 1000);
    updateLiveClocks();

    // ==========================================
    // 11. FOOTER UPTIME COUNTER
    // ==========================================
    const startTime = Date.now();

    function updateUptime() {
        const uptimeEl = document.getElementById('footerUptime');
        if (!uptimeEl) return;

        const elapsed = Date.now() - startTime;
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const hours = Math.floor((elapsed / 1000 / 60 / 60) % 24);

        uptimeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    setInterval(updateUptime, 1000);

    // ==========================================
    // 12. HEX SCROLL CONTENT
    // ==========================================
    const hexScroll = document.getElementById('hexScroll');
    if (hexScroll) {
        let hexContent = '';
        for (let i = 0; i < 200; i++) {
            const byte = rand(0, 255).toString(16).padStart(2, '0').toUpperCase();
            hexContent += byte + ' ';
        }
        hexScroll.textContent = hexContent.repeat(10);
    }

    // ==========================================
    // 13. WINDOW RESIZE HANDLER
    // ==========================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initCodeRain();
            initDataStream();
        }, 250);
    });

    // ==========================================
    // 14. KEYBOARD SHORTCUTS
    // ==========================================
    document.addEventListener('keydown', (e) => {
        // Ctrl+K to focus terminal
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            terminalInput.focus();
            triggerGlitch();
        }
        // Escape to blur terminal
        if (e.key === 'Escape') {
            terminalInput.blur();
        }
    });

    // ==========================================
    // 15. TOUCH SUPPORT FOR MOBILE CURSOR
    // ==========================================
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        cursorTargetX = touch.clientX;
        cursorTargetY = touch.clientY;
    });

    // Hide custom cursor on touch devices
    if ('ontouchstart' in window) {
        cyberCursor.style.display = 'none';
    }

    // ==========================================
    // 16. DYNAMIC MEMORY VALUE IN FOOTER
    // ==========================================
    setInterval(() => {
        const memEl = document.getElementById('footerMemory');
        if (memEl) {
            const val = rand(0x7FFF_F000, 0x7FFF_FFFF);
            memEl.textContent = '0x' + val.toString(16).toUpperCase().padStart(8, '0') + ' KB';
        }
    }, 3000);

    // ==========================================
    // 17. ADD LIVE CLOCK TO SYSTEM CARDS
    // ==========================================
    updateLiveClocks();

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        initCodeRain();
        drawCodeRain();
        animateCursor();
        typeHeroText();
        initDataStream();
        drawDataStream();

        // Trigger initial glitch after 2 seconds
        setTimeout(() => {
            triggerGlitch();
        }, 2000);

        // Add scroll listener
        window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
        highlightNavOnScroll();

        console.log('%c NEURAL_BREACH v4.1.7 ', 'background: #00ff41; color: #0a0a0f; font-size: 14px; padding: 8px; font-family: monospace; border: 2px solid #00ff41;');
        console.log('%c You are now inside the mesh. Type "help" for available commands.', 'color: #00ff41; font-family: monospace; font-size: 12px;');
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
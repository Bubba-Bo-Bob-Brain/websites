/* ============================================================
   SECTOR-7 // CYBERSECURITY OPERATIONS — JAVASCRIPT
   Interactive Features & Real-time Systems
   ============================================================ */

(function () {
    'use strict';

    // =========================================================
    // UTILITY FUNCTIONS
    // =========================================================

    /** Generate a random integer between min and max (inclusive) */
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /** Generate a random hex string of given length */
    function randHex(len) {
        let hex = '';
        for (let i = 0; i < len; i++) {
            hex += Math.floor(Math.random() * 16).toString(16);
        }
        return hex;
    }

    /** Pick a random element from an array */
    function randPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /** Generate a random IP address */
    function randIP() {
        return `${randInt(10, 223)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    }

    /** Generate a random MAC address */
    function randMAC() {
        const hex = '0123456789ABCDEF';
        let mac = '';
        for (let i = 0; i < 6; i++) {
            mac += hex[randInt(0, 15)] + hex[randInt(0, 15)];
            if (i < 5) mac += ':';
        }
        return mac;
    }

    /** Format a number with commas */
    function formatNum(n) {
        return n.toLocaleString();
    }

    /** Get current UTC time string */
    function getUTCTime() {
        const now = new Date();
        return now.toUTCString().split(' ').slice(4).join(' ');
    }

    // =========================================================
    // 1. MATRIX RAIN
    // =========================================================

    (function initMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:<>?/~ｱｲｳｴｵｶｷｸｹｺ';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = new Array(columns).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = randPick(chars);
                ctx.fillStyle = `rgba(0, ${randInt(180, 255)}, ${randInt(30, 65)}, ${randInt(3, 8) / 10})`;
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 50);
    })();

    // =========================================================
    // 2. REAL-TIME CLOCK & UPTIME
    // =========================================================

    const clockEl = document.getElementById('clock');
    const uptimeEl = document.getElementById('uptime');
    const sessionEl = document.getElementById('session-id');

    // Generate session ID
    sessionEl.textContent = randHex(16).toUpperCase();

    // Initial uptime base
    let uptimeSeconds = randInt(864000, 999999);

    function updateClock() {
        clockEl.textContent = getUTCTime();
        uptimeSeconds++;
        const totalSecs = uptimeSeconds;
        const days = Math.floor(totalSecs / 86400);
        const hrs = Math.floor((totalSecs % 86400) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        const pct = (99.99 + Math.sin(uptimeSeconds / 10000) * 0.008).toFixed(3);
        uptimeEl.textContent = `${pct}%`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // =========================================================
    // 3. TERMINAL TYPING EFFECT
    // =========================================================

    (function initTerminal() {
        const output = document.getElementById('terminal-output');
        const inputEl = document.getElementById('typed-command');

        const commands = [
            'nmap -sV -O 192.168.1.0/24',
            'sqlmap -u "http://target.com/api?id=1" --dbs',
            'metasploit > use exploit/multi/handler',
            'tcpdump -i eth0 -nn port 443',
            'python3 scanner.py --target=10.0.0.0/16',
            'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.0.0.1',
            'aircrack-ng -w wordlist.txt capture.cap',
            'cat /etc/shadow | john --format=crypt',
            'wireshark -i eth0 -k -Y "http.request"',
            'openssl s_client -connect target.com:443',
        ];

        const bootMessages = [
            '[  OK  ] Started Session 1 of User root.',
            '[  OK  ] Reached target Multi-User System.',
            '[  OK  ] Started SECTOR-7 Threat Monitor Service.',
            '[  OK  ] Started SECTOR-7 Intrusion Detection System.',
            '[  OK  ] Started SECTOR-7 Network Scanner Daemon.',
            'SECTOR-7 kernel 6.6.0-s7sec loaded successfully.',
            'Loading vulnerability database... 312,847 signatures loaded.',
        ];

        let lineIndex = 0;

        function addLine(text, className, delay) {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 'terminal__line';
                if (className) div.classList.add(className);
                div.textContent = text;
                output.appendChild(div);
                output.scrollTop = output.scrollHeight;
            }, delay);
        }

        bootMessages.forEach((msg, i) => {
            addLine(msg, 'neon-green', i * 400 + 500);
        });

        let cmdIdx = 0;
        let charIdx = 0;
        let isTyping = false;

        function typeCommand() {
            if (isTyping) return;
            isTyping = true;
            const cmd = commands[cmdIdx % commands.length];
            charIdx = 0;
            inputEl.textContent = '';

            const typeInterval = setInterval(() => {
                charIdx++;
                inputEl.textContent = cmd.substring(0, charIdx) + '█';
                if (charIdx >= cmd.length) {
                    clearInterval(typeInterval);
                    inputEl.textContent = cmd;

                    // Execute
                    addLine(`root@sector7:~$ ${cmd}`, '', 300);

                    setTimeout(() => {
                        const responses = {
                            default: [
                                'Scanning 256 hosts... 12 live hosts found.',
                                '3 vulnerabilities detected. See report.',
                                'Connection established. Channel encrypted.',
                                'Packet capture initiated. 2.4 MB/s throughput.',
                                'Brute-force attack in progress. Est. time: 4h 23m.',
                                'Database dump complete. Extracted 14,238 records.',
                                'Traffic analysis complete. 3 anomalous patterns detected.',
                            ],
                        };
                        const resp = randPick(responses.default);
                        addLine(resp, 'neon-cyan', 500);

                        setTimeout(() => {
                            addLine('', '', 200);
                            cmdIdx++;
                            isTyping = false;
                            setTimeout(typeCommand, randInt(2000, 5000));
                        }, 600);
                    }, 800);
                }
            }, 60);
        }

        setTimeout(typeCommand, bootMessages.length * 400 + 1500);
    })();

    // =========================================================
    // 4. THREAT STATS COUNTER ANIMATION
    // =========================================================

    (function initThreatStats() {
        const statEls = document.querySelectorAll('.threat-stat-card__value');
        let animated = false;

        function animateStats() {
            if (animated) return;
            animated = true;

            statEls.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const duration = 2000;
                const startTime = performance.now();

                function update(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);

                    el.textContent = formatNum(current);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            });
        }

        // Trigger when stats section is visible
        const statsSection = document.querySelector('.threat-stats');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    })();

    // =========================================================
    // 5. LIVE THREAT FEED
    // =========================================================

    (function initThreatFeed() {
        const feedBody = document.getElementById('threat-feed-body');
        const feedCountEl = document.getElementById('feed-count');

        const attackTypes = [
            { type: 'DDoS', severity: 'critical', label: 'Volumetric DDoS Attack' },
            { type: 'SQLi', severity: 'critical', label: 'SQL Injection Attempt' },
            { type: 'XSS', severity: 'high', label: 'Cross-Site Scripting Payload' },
            { type: 'RCE', severity: 'critical', label: 'Remote Code Execution Attempt' },
            { type: 'BRUTE', severity: 'medium', label: 'SSH Brute-Force Attack' },
            { type: 'PHISH', severity: 'medium', label: 'Phishing Campaign Detected' },
            { type: 'MALWARE', severity: 'high', label: 'Malware Signature Match' },
            { type: 'INJECT', severity: 'critical', label: 'Command Injection Detected' },
            { type: 'RECON', severity: 'low', label: 'Port Scanning Activity' },
            { type: 'LFI', severity: 'high', label: 'Local File Inclusion Attempt' },
            { type: 'RANSOM', severity: 'critical', label: 'Ransomware C2 Communication' },
            { type: 'CRYPTO', severity: 'low', label: 'Crypto Mining Activity Detected' },
            { type: 'CSRF', severity: 'medium', label: 'CSRF Token Forgery Attempt' },
            { type: 'UPLOAD', severity: 'high', label: 'Malicious File Upload Blocked' },
            { type: 'BYPASS', severity: 'high', label: 'WAF Bypass Attempt' },
        ];

        const severities = ['critical', 'high', 'medium', 'low', 'info'];
        let incidentCount = 0;

        function addFeedItem() {
            const attack = randPick(attackTypes);
            const ip = randIP();
            const port = randInt(1, 65535);
            const country = randPick(['CN', 'RU', 'KP', 'IR', 'US', 'BR', 'VN', 'NG', 'RO', 'ID']);
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });

            const item = document.createElement('div');
            item.className = 'feed-item';
            item.style.animationDelay = '0s';

            item.innerHTML = `
                <span class="feed-item__severity feed-item__severity--${attack.severity}">${attack.type}</span>
                <div class="feed-item__content">
                    <div class="feed-item__title">${attack.label}</div>
                    <div class="feed-item__meta">
                        Source: <span class="ip">${ip}</span> : <span class="port">${port}</span>
                        &nbsp;|&nbsp; Target: <span class="ip">192.168.${randInt(1, 254)}.${randInt(1, 254)}</span>
                        &nbsp;|&nbsp; Country: ${country}
                    </div>
                </div>
                <span class="feed-item__time">${time}</span>
            `;

            feedBody.prepend(item);

            // Keep max 50 items
            while (feedBody.children.length > 50) {
                feedBody.removeChild(feedBody.lastChild);
            }

            incidentCount++;
            feedCountEl.textContent = incidentCount;
        }

        // Initial items
        for (let i = 0; i < 8; i++) {
            addFeedItem();
        }

        // Add new items periodically
        setInterval(addFeedItem, randInt(2000, 5000));
    })();

    // =========================================================
    // 6. NETWORK TOPOLOGY CANVAS
    // =========================================================

    (function initTopology() {
        const canvas = document.getElementById('topology-canvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = 400;
        }
        resize();
        window.addEventListener('resize', () => {
            resize();
            initNodes();
        });

        const nodeTypes = ['core', 'firewall', 'proxy', 'endpoint', 'honeypot'];
        const nodeColors = {
            core: '#00ff41',
            firewall: '#ffe600',
            proxy: '#00d4ff',
            endpoint: '#8b949e',
            honeypot: '#ff0040',
        };

        let nodes = [];
        let connections = [];
        let time = 0;

        function initNodes() {
            nodes = [];
            connections = [];
            const w = canvas.width;
            const h = canvas.height;

            // Core (center)
            nodes.push({ x: w / 2, y: h / 2, type: 'core', label: 'CORE-01', pulse: 0 });

            // Firewall ring
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const r = Math.min(w, h) * 0.25;
                nodes.push({ x: w / 2 + Math.cos(angle) * r, y: h / 2 + Math.sin(angle) * r, type: 'firewall', label: `FW-${String(i + 1).padStart(2, '0')}`, pulse: 0 });
            }

            // Proxy layer
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
                const r = Math.min(w, h) * 0.4;
                nodes.push({ x: w / 2 + Math.cos(angle) * r, y: h / 2 + Math.sin(angle) * r, type: 'proxy', label: `PRX-${String(i + 1).padStart(2, '0')}`, pulse: 0 });
            }

            // Endpoints (outer ring)
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const r = Math.min(w, h) * 0.65;
                nodes.push({ x: w / 2 + Math.cos(angle) * r, y: h / 2 + Math.sin(angle) * r, type: 'endpoint', label: `EP-${String(i + 1).padStart(2, '0')}`, pulse: 0 });
            }

            // Honeypot (random near endpoints)
            for (let i = 0; i < 2; i++) {
                const angle = ((i + 0.5) / 6) * Math.PI * 2 - Math.PI / 2;
                const r = Math.min(w, h) * 0.65;
                nodes.push({ x: w / 2 + Math.cos(angle) * r + randInt(-30, 30), y: h / 2 + Math.sin(angle) * r + randInt(-30, 30), type: 'honeypot', label: `HNY-${String(i + 1).padStart(2, '0')}`, pulse: 0 });
            }

            // Build connections
            connections = [];
            const fwNodes = nodes.filter(n => n.type === 'firewall');
            const prxNodes = nodes.filter(n => n.type === 'proxy');
            const epNodes = nodes.filter(n => n.type === 'endpoint');
            const hnyNodes = nodes.filter(n => n.type === 'honeypot');
            const core = nodes.find(n => n.type === 'core');

            // Core to firewalls
            fwNodes.forEach(fw => connections.push({ from: core, to: fw, active: true }));

            // Firewalls to proxies
            fwNodes.forEach((fw, i) => {
                prxNodes.forEach(prx => {
                    if (Math.random() > 0.3) connections.push({ from: fw, to: prx, active: Math.random() > 0.2 });
                });
            });

            // Proxies to endpoints
            prxNodes.forEach((prx, i) => {
                const targets = epNodes.filter((_, j) => j % 2 === i % 2 || Math.random() > 0.5);
                targets.forEach(ep => connections.push({ from: prx, to: ep, active: Math.random() > 0.15 }));
            });

            // Honeypots connected to random proxies
            hnyNodes.forEach(hny => {
                const prx = randPick(prxNodes);
                connections.push({ from: prx, to: hny, active: false });
            });
        }

        function draw() {
            time += 0.016;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            connections.forEach(conn => {
                const alpha = conn.active ? randInt(4, 8) / 10 : randInt(1, 3) / 10;
                ctx.beginPath();
                ctx.moveTo(conn.from.x, conn.from.y);
                ctx.lineTo(conn.to.x, conn.to.y);
                ctx.strokeStyle = conn.active
                    ? `rgba(0, 255, 65, ${alpha})`
                    : `rgba(255, 0, 64, ${alpha})`;
                ctx.lineWidth = conn.active ? 1 : 0.5;
                if (!conn.active) ctx.setLineDash([4, 4]);
                else ctx.setLineDash([]);
                ctx.stroke();
                ctx.setLineDash([]);

                // Animated packet along connection
                if (conn.active && Math.random() > 0.97) {
                    const t = (time * 0.5 + conn.from.x) % 1;
                    const px = conn.from.x + (conn.to.x - conn.from.x) * t;
                    const py = conn.from.y + (conn.to.y - conn.from.y) * t;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
                    ctx.fill();
                }
            });

            // Draw nodes
            nodes.forEach(node => {
                const color = nodeColors[node.type];
                const baseRadius = node.type === 'core' ? 14 : node.type === 'honeypot' ? 10 : 11;
                const pulse = Math.sin(time * 3 + node.x) * 3;
                const radius = baseRadius + (node.type === 'core' ? pulse : 0);

                // Glow
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
                gradient.addColorStop(0, color + '40');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
                ctx.fill();

                // Node circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = node.type === 'honeypot' ? 'rgba(255, 0, 64, 0.3)' : color + '20';
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = node.type === 'core' ? 2 : 1;
                ctx.stroke();

                // Inner dot for core
                if (node.type === 'core') {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                }

                // Label
                ctx.font = '10px "JetBrains Mono", monospace';
                ctx.fillStyle = '#8b949e';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + radius + 14);
            });

            // Status text
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillStyle = '#5a6a78';
            ctx.textAlign = 'left';
            ctx.fillText(`NODES: ${nodes.length} | LINKS: ${connections.length} | ${new Date().toLocaleTimeString()}`, 10, 16);

            requestAnimationFrame(draw);
        }

        initNodes();
        draw();
    })();

    // =========================================================
    // 7. VULNERABILITY SCORE RING ANIMATION
    // =========================================================

    (function initVulnScore() {
        const circle = document.getElementById('score-circle');
        const scoreNum = document.getElementById('vuln-score-num');
        const circumference = 2 * Math.PI * 50; // r=50
        const targetScore = 73;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        function animateScore() {
            const duration = 2000;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentScore = Math.round(eased * targetScore);
                const offset = circumference - (currentScore / 100) * circumference;

                circle.style.strokeDashoffset = offset;
                scoreNum.textContent = currentScore;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateScore();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(document.querySelector('.vuln-overview'));
    })();

    // =========================================================
    // 8. ENCRYPTED MESSAGE DECRYPT / RESET
    // =========================================================

    (function initEncryption() {
        const encryptedMsg = document.getElementById('encrypted-message');
        const decryptedMsg = document.getElementById('decrypted-message');
        const btnDecrypt = document.getElementById('btn-decrypt');
        const btnReset = document.getElementById('btn-reset');
        const keyExchange = document.getElementById('key-exchange');
        const keyVisual = document.getElementById('key-visual');

        const plaintext = 'OPERATION NIGHTFALL — Coordinated zero-day exploit targeting CVE-2024-31427 across 14 nodes. Payload delivery confirmed at 03:47 UTC. Exfiltration masked as DNS-over-HTTPS traffic. Recommend immediate containment of subnet 10.47.2.x.';

        // Generate encrypted visual
        let cipherText = '';
        for (let i = 0; i < plaintext.length; i++) {
            if (plaintext[i] === ' ') {
                cipherText += ' ';
            } else if (plaintext[i] === '.') {
                cipherText += '.';
            } else if (plaintext[i] === ',') {
                cipherText += ',';
            } else if (plaintext[i] === '-') {
                cipherText += '-';
            } else {
                cipherText += randPick('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
            }
        }

        encryptedMsg.innerHTML = cipherText.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');

        let decrypted = false;

        btnDecrypt.addEventListener('click', () => {
            if (decrypted) return;
            decrypted = true;

            // Animate decryption character by character
            const spans = encryptedMsg.querySelectorAll('span');
            const plainChars = plaintext.split('');

            spans.forEach((span, i) => {
                if (plainChars[i]) {
                    setTimeout(() => {
                        span.textContent = plainChars[i];
                        span.style.color = '#00ff41';
                        span.style.textShadow = '0 0 6px rgba(0,255,65,0.6)';
                    }, i * 15);
                }
            });

            // Show decrypted message panel
            setTimeout(() => {
                decryptedMsg.style.display = 'block';
                decryptedMsg.innerHTML = `<span class="neon-green">// DECRYPTED — AES-256-GCM //</span>\n\n${plaintext}`;
            }, plainChars.length * 15 + 300);

            // Flash the key exchange steps
            const steps = keyExchange.querySelectorAll('.key-exchange__step');
            steps.forEach((step, i) => {
                setTimeout(() => {
                    step.style.color = '#00ff41';
                    step.style.textShadow = '0 0 4px rgba(0,255,65,0.4)';
                }, i * 200);
            });
        });

        btnReset.addEventListener('click', () => {
            decrypted = false;

            // Reset encrypted message
            encryptedMsg.innerHTML = cipherText.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
            decryptedMsg.style.display = 'none';
            decryptedMsg.innerHTML = '';

            const spans = encryptedMsg.querySelectorAll('span');
            spans.forEach(span => {
                span.style.color = '';
                span.style.textShadow = '';
            });

            // Reset key exchange steps
            const steps = keyExchange.querySelectorAll('.key-exchange__step');
            steps.forEach(step => {
                step.style.color = '';
                step.style.textShadow = '';
            });

            // Re-generate cipher
            cipherText = '';
            for (let i = 0; i < plaintext.length; i++) {
                if (plaintext[i] === ' ') {
                    cipherText += ' ';
                } else if (plaintext[i] === '.' || plaintext[i] === ',' || plaintext[i] === '-') {
                    cipherText += plaintext[i];
                } else {
                    cipherText += randPick('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
                }
            }
            encryptedMsg.innerHTML = cipherText.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
        });

        // Generate key visual hex string
        function generateKeyVisual() {
            let hex = '';
            for (let i = 0; i < 64; i++) {
                hex += randHex(2);
                if (i < 63) hex += ' ';
            }
            keyVisual.textContent = hex;
        }
        generateKeyVisual();
    })();

    // =========================================================
    // 9. AUDIT LOG WITH FILTERING
    // =========================================================

    (function initAuditLog() {
        const logContainer = document.getElementById('audit-log');
        const filterBtns = document.querySelectorAll('.audit-filter');
        const logCountEl = document.getElementById('log-count');

        const eventTypes = ['auth', 'intrusion', 'firewall', 'crypto'];

        const authMessages = [
            'Successful SSH login from <span class="ip">{ip}</span> port <span class="port">{port}</span>',
            'Failed password attempt for user <span class="highlight">admin</span> from <span class="ip">{ip}</span>',
            'Public key authentication accepted for <span class="highlight">root</span> from <span class="ip">{ip}</span>',
            'Session opened for user <span class="highlight">operator-7</span> from <span class="ip">{ip}</span>',
            'Sudo: <span class="highlight">operator-7</span> : TTY=pts/0 ; PWD=/etc ; USER=root ; COMMAND=/bin/ls',
            'User <span class="highlight">analyst-3</span> logged out from <span class="ip">{ip}</span>',
            'Two-factor authentication verified for <span class="highlight">director</span>',
            'API key rotated for service account <span class="highlight">scan-daemon</span>',
            'Certificate renewal completed for <span class="highlight">*.sector7.local</span>',
            'PAM authentication failure for <span class="highlight">guest</span> from <span class="ip">{ip}</span>',
        ];

        const intrusionMessages = [
            'IDS alert: potential SQL injection from <span class="ip">{ip}</span>',
            'Brute-force detected: <span class="highlight">47</span> attempts from <span class="ip">{ip}</span>',
            'Port scan detected from <span class="ip">{ip}</span> targeting <span class="port">{port}</span>',
            'Malware signature matched: <span class="highlight">Trojan.GenericKD</span>',
            'Unauthorized access attempt on <span class="highlight">/admin/config</span> from <span class="ip">{ip}</span>',
            'Ransomware behavior detected in process <span class="highlight">svchost-x64.exe</span>',
            'Data exfiltration attempt blocked: <span class="highlight">2.4 GB</span> to external IP',
            'Reverse shell connection attempt from <span class="ip">{ip}</span> port <span class="port">{port}</span>',
            'Privilege escalation attempt detected for user <span class="highlight">www-data</span>',
            'DNS tunneling detected: encoded data in TXT queries from <span class="ip">{ip}</span>',
            'C2 beacon detected connecting to <span class="ip">{ip}</span> every 60s',
            'Fileless malware execution detected in memory space',
        ];

        const firewallMessages = [
            'Rule applied: BLOCK all inbound from <span class="ip">{ip}</span>/32',
            'Rate limit triggered for <span class="ip">{ip}</span> on port <span class="port">{port}</span>',
            'GeoIP block activated for country code <span class="highlight">RU</span>',
            'WAF rule matched: XSS payload blocked from <span class="ip">{ip}</span>',
            'Connection throttled: <span class="ip">{ip}</span> exceeded 100 req/min',
            'TLS handshake failed from <span class="ip">{ip}</span>: invalid certificate',
            'DDoS mitigation activated: <span class="highlight">SYN flood</span> from <span class="ip">{ip}</span> subnet',
            'Firewall rule updated: ALLOW port <span class="port">{port}</span> for <span class="ip">{ip}</span>',
            'Deep packet inspection: blocked <span class="highlight">malicious payload</span>',
            'BGP route anomaly detected from ASN <span class="highlight">{asn}</span>',
        ];

        const cryptoMessages = [
            'TLS 1.3 session established with <span class="ip">{ip}</span>',
            'Certificate validated for <span class="highlight">api.sector7.local</span>',
            'Key exchange completed: <span class="highlight">ECDHE-P256</span>',
            'Encryption audit: <span class="highlight">3</span> weak ciphers detected',
            'HMAC verification failed for data from <span class="ip">{ip}</span>',
            'New signing key generated: <span class="highlight">RSA-4096</span>',
            'OCSP stapling successful for <span class="highlight">*.sector7.local</span>',
            'Hash collision warning: <span class="highlight">SHA-1</span> deprecated endpoint found',
            'Encrypted backup completed: <span class="highlight">AES-256-GCM</span>',
            'Blockchain verification: transaction <span class="highlight">{tx}</span> confirmed',
        ];

        const statuses = ['success', 'failure', 'pending'];
        const statusWeights = [60, 30, 10];

        function getWeightedStatus() {
            const r = Math.random() * 100;
            if (r < statusWeights[0]) return statuses[0];
            if (r < statusWeights[0] + statusWeights[1]) return statuses[1];
            return statuses[2];
        }

        function generateLogEntry(type) {
            const templates = {
                auth: authMessages,
                intrusion: intrusionMessages,
                firewall: firewallMessages,
                crypto: cryptoMessages,
            };

            const template = randPick(templates[type]);
            let message = template
                .replace(/\{ip\}/g, randIP())
                .replace(/\{port\}/g, randInt(1, 65535))
                .replace(/\{asn\}/g, `AS${randInt(1000, 65000)}`)
                .replace(/\{tx\}/g, randHex(16));

            return {
                type,
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                message,
                status: getWeightedStatus(),
            };
        }

        let currentFilter = 'all';
        let entryCount = 0;

        function renderEntry(entry) {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.style.animationDelay = '0s';

            div.innerHTML = `
                <div class="log-entry__timestamp">${entry.time}</div>
                <div class="log-entry__type log-entry__type--${entry.type}">${entry.type}</div>
                <div class="log-entry__message">${entry.message}</div>
                <div class="log-entry__status log-entry__status--${entry.status}">${entry.status}</div>
            `;

            logContainer.prepend(div);
            entryCount++;
            logCountEl.textContent = `${entryCount} entries`;

            // Keep max 100 entries visible
            while (logContainer.children.length > 100) {
                logContainer.removeChild(logContainer.lastChild);
            }
        }

        function addEntry() {
            const type = currentFilter === 'all' ? randPick(eventTypes) : currentFilter;
            renderEntry(generateLogEntry(type));
        }

        // Initial entries
        for (let i = 0; i < 20; i++) {
            renderEntry(generateLogEntry(randPick(eventTypes)));
        }

        // Live updates
        setInterval(addEntry, randInt(1500, 4000));

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');

                // Clear and regenerate
                logContainer.innerHTML = '';
                entryCount = 0;
                for (let i = 0; i < 20; i++) {
                    renderEntry(generateLogEntry(currentFilter === 'all' ? randPick(eventTypes) : currentFilter));
                }
            });
        });
    })();

    // =========================================================
    // 10. OPERATORS CARDS
    // =========================================================

    (function initOperators() {
        const grid = document.getElementById('operators-grid');

        const operators = [
            { name: 'Nyx Hex', handle: '@nyx_hex', role: 'Lead Penetration Tester', crest: 'NH', exploits: 1247, finds: 89 },
            { name: 'Cipher Void', handle: '@c3ph3r_v01d', role: 'Malware Analyst', crest: 'CV', exploits: 893, finds: 156 },
            { name: 'Null Pointer', handle: '@n11_ptr', role: 'Network Exploitation', crest: 'NP', exploits: 2105, finds: 203 },
            { name: 'Phantom Wire', handle: '@phntm_wr', role: 'Red Team Commander', crest: 'PW', exploits: 3421, finds: 312 },
            { name: 'Sable Fox', handle: '@sable_f0x', role: 'Social Engineering', crest: 'SF', exploits: 678, finds: 67 },
            { name: 'Glitch Matrix', handle: '@gl1tch_mx', role: 'Cryptography & Forensics', crest: 'GM', exploits: 1560, finds: 141 },
        ];

        operators.forEach(op => {
            const card = document.createElement('div');
            card.className = 'operator-card';

            card.innerHTML = `
                <div class="operator-card__avatar">${op.crest}</div>
                <div class="operator-card__name">${op.name}</div>
                <div class="operator-card__handle">${op.handle}</div>
                <div class="operator-card__role">${op.role}</div>
                <div class="operator-card__stats">
                    <div class="operator-card__stat">
                        <div class="operator-card__stat-value">${formatNum(op.exploits)}</div>
                        <div class="operator-card__stat-label">Exploits</div>
                    </div>
                    <div class="operator-card__stat">
                        <div class="operator-card__stat-value">${op.finds}</div>
                        <div class="operator-card__stat-label">Findings</div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });
    })();

    // =========================================================
    // 11. FOOTER HEX DUMP
    // =========================================================

    (function initFooterHex() {
        const footerHex = document.getElementById('footer-hex');
        let hex = '';
        for (let i = 0; i < 128; i++) {
            hex += randHex(2) + ' ';
            if ((i + 1) % 16 === 0 && i < 127) hex += '\n';
        }
        footerHex.textContent = hex;
    })();

    // =========================================================
    // 12. SCROLL-TRIGGERED ANIMATIONS
    // =========================================================

    (function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.threat-stat-card, .vuln-card, .encrypt-panel, .operator-card, .log-entry').forEach(el => {
            observer.observe(el);
        });
    })();

    // =========================================================
    // 13. NAVIGATION — ACTIVE STATE ON SCROLL
    // =========================================================

    (function initNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function highlightNav() {
            let current = '';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.style.color = '';
                link.style.textShadow = '';
                if (link.getAttribute('href') === `#${current}`) {
                    link.style.color = '#00ff41';
                    link.style.textShadow = '0 0 8px rgba(0,255,65,0.6)';
                }
            });
        }

        window.addEventListener('scroll', highlightNav);
    })();

    // =========================================================
    // 14. SYSTEM BAR — SIMULATED NODE COUNT FLUCTUATION
    // =========================================================

    (function initNodeCounter() {
        const nodeCountEl = document.querySelector('.node-count');
        let count = 2847;

        setInterval(() => {
            count += randInt(-5, 8);
            if (count < 2500) count = 2500;
            nodeCountEl.textContent = formatNum(count);
        }, 3000);
    })();

})();
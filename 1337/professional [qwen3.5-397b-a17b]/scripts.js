/* scripts.js */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const config = {
        bootSpeed: 30, // ms per character
        bootText: [
            "INITIALIZING KERNEL...",
            "LOADING MODULES: [SECURITY_NET]",
            "CONNECTING TO SECURE SERVER...",
            "BYPASSING FIREWALLS...",
            "ACCESS GRANTED.",
            "WELCOME, OPERATOR."
        ],
        terminalSpeed: 150,
        mapPoints: 15,
        cryptoSpeed: 50
    };

    // --- Elements ---
    const bootScreen = document.getElementById('boot-screen');
    const bootTextElement = document.getElementById('boot-text');
    const appContainer = document.getElementById('app-container');
    const terminalLogs = document.getElementById('terminal-logs');
    const clockElement = document.getElementById('clock');
    const uptimeElement = document.getElementById('uptime');
    const attackCountElement = document.getElementById('attack-count');
    const mapVisual = document.getElementById('map-visual');
    const cryptoStream = document.getElementById('crypto-stream');
    const glitchElements = document.querySelectorAll('.glitch-text');
    const hiddenTexts = document.querySelectorAll('.hidden-text');

    // --- State ---
    let uptimeSeconds = 0;
    let attackCount = 8492;

    // --- Utilities ---
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomHex = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
    const getCurrentTime = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

    // --- Boot Sequence ---
    async function runBootSequence() {
        let delay = 0;
        for (const line of config.bootText) {
            await typeText(line, delay);
            delay += 200;
        }
        setTimeout(() => {
            if (bootScreen) {
                bootScreen.style.opacity = '0';
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    if (appContainer) appContainer.style.opacity = '1';
                    
                    // Start loops after boot
                    startClocks();
                    startTerminalLoop();
                    startMapLoop();
                    startCryptoLoop();
                    startAttackCounter();
                }, 500);
            }
        }, 1000);
    }

    function typeText(text, startDelay) {
        return new Promise(resolve => {
            setTimeout(() => {
                let i = 0;
                const interval = setInterval(() => {
                    if (bootTextElement) {
                        bootTextElement.textContent += text.charAt(i);
                    }
                    i++;
                    if (i > text.length - 1) {
                        clearInterval(interval);
                        resolve();
                    }
                }, config.bootSpeed);
            }, startDelay);
        });
    }

    // --- Clocks & Counters ---
    function startClocks() {
        updateClocks();
        setInterval(updateClocks, 1000);
    }

    function updateClocks() {
        // Main Clock
        if (clockElement) clockElement.textContent = getCurrentTime();
        
        // Uptime
        if (uptimeElement) {
            uptimeSeconds++;
            const h = Math.floor(uptimeSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((uptimeSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (uptimeSeconds % 60).toString().padStart(2, '0');
            uptimeElement.textContent = `${h}:${m}:${s}`;
        }
    }

    function startAttackCounter() {
        setInterval(() => {
            attackCount += randomInt(1, 5);
            if (attackCountElement) {
                attackCountElement.textContent = attackCount.toLocaleString();
            }
        }, 2000);
    }

    // --- Terminal Logs ---
    const logMessages = [
        "Packet intercepted from 192.168.0.X",
        "Handshake failed: Timeout",
        "Root access attempt detected",
        "Encrypting data stream...",
        "Port 443 scanning...",
        "Firewall rule updated",
        "Node connection lost",
        "Re-routing traffic...",
        "Decryption key generated",
        "Suspicious activity logged"
    ];

    function startTerminalLoop() {
        addLogEntry("System initialized successfully.");
        setInterval(() => {
            if (Math.random() > 0.3) {
                addLogEntry(logMessages[randomInt(0, logMessages.length - 1)]);
            }
        }, config.terminalSpeed);
    }

    function addLogEntry(msg) {
        if (!terminalLogs) return;
        const p = document.createElement('p');
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        p.textContent = `[${time}] > ${msg}`;
        terminalLogs.appendChild(p);
        terminalLogs.scrollTop = terminalLogs.scrollHeight; // Auto scroll
        
        // Keep only last 10 lines
        if (terminalLogs.childElementCount > 10) {
            terminalLogs.removeChild(terminalLogs.firstChild);
        }
    }

    // --- Threat Map Visualization ---
    function startMapLoop() {
        setInterval(() => {
            createMapPoint();
        }, 800);
    }

    function createMapPoint() {
        if (!mapVisual) return;
        const point = document.createElement('div');
        point.classList.add('map-point');
        point.style.left = `${randomInt(10, 90)}%`;
        point.style.top = `${randomInt(10, 90)}%`;
        mapVisual.appendChild(point);
        
        // Remove after animation
        setTimeout(() => {
            point.remove();
        }, 2000);
    }

    // --- Crypto Stream Effect ---
    function startCryptoLoop() {
        setInterval(() => {
            if (!cryptoStream) return;
            let output = '';
            for (let i = 0; i < 300; i++) {
                output += randomHex() + ' ';
            }
            cryptoStream.textContent = output;
        }, config.cryptoSpeed);
    }

    // --- Text Effects ---
    // Glitch effect on hover for titles
    glitchElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            const original = el.getAttribute('data-text');
            if (!original) return;
            
            let iterations = 0;
            const interval = setInterval(() => {
                el.textContent = original
                    .split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return original[index];
                        }
                        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    })
                    .join("");
                
                if (iterations >= original.length) {
                    clearInterval(interval);
                }
                iterations += 1/3;
            }, 30);
        });
    });

    // Hidden text reveal
    hiddenTexts.forEach(el => {
        el.addEventListener('click', function() {
            this.classList.add('revealed');
            this.textContent = this.getAttribute('data-reveal');
        });
    });

    // Initialize boot sequence
    runBootSequence();
});
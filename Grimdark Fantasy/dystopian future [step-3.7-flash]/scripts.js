document.addEventListener('DOMContentLoaded', () => {
    initSystemClock();
    initCountdownTimer();
    initCustomCursor();
    initTerminal();
    initFactionMap();
    initResistanceNetwork();
    initSurveillanceFeeds();
    initNewsTicker();
    initScrollAnimations();
    initBroadcastTimestamp();
    initRandomGlitches();
});

function initSystemClock() {
    const timeElement = document.getElementById('system-time');
    if (!timeElement) return;
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    const purgeDate = new Date();
    purgeDate.setDate(purgeDate.getDate() + 7);
    purgeDate.setHours(0, 0, 0, 0);
    function updateCountdown() {
        const now = new Date();
        const diff = purgeDate - now;
        if (diff <= 0) {
            countdownElement.textContent = 'PURGE IN PROGRESS';
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        countdownElement.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    const interactiveElements = document.querySelectorAll('button, a, .faction-zone, .network-node, input, .play-button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function initTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    if (!terminalOutput || !terminalInput) return;
    const commandHistory = [];
    let historyIndex = -1;
    const bootSequence = [
        { text: 'IRON DOMINION SECURITY OPERATING SYSTEM v4.7.2', class: 'success', delay: 100 },
        { text: 'Copyright (c) 2087 Iron Dominion Security Council. All rights reserved.', class: '', delay: 50 },
        { text: '', class: '', delay: 100 },
        { text: 'Initializing kernel... OK', class: 'success', delay: 300 },
        { text: 'Loading encryption modules... OK', class: 'success', delay: 200 },
        { text: 'Establishing secure connection to Central Command...', class: 'warning', delay: 500 },
        { text: 'Connection established. Latency: 0.003ms', class: 'success', delay: 300 },
        { text: 'Loading sector surveillance data...', class: '', delay: 200 },
        { text: 'WARNING: Anomaly detected in Sector 4 network traffic', class: 'error', delay: 100 },
        { text: 'Initiating deep packet inspection...', class: 'warning', delay: 400 },
        { text: 'Threat level: MINIMAL. Containment protocols active.', class: 'success', delay: 200 },
        { text: '', class: '', delay: 100 },
        { text: 'Welcome, Administrator. Type "help" for available commands.', class: 'success', delay: 0 }
    ];
    async function typeBootSequence() {
        for (const entry of bootSequence) {
            await sleep(entry.delay);
            addTerminalLine(entry.text, entry.class);
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    typeBootSequence();
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command) {
                addTerminalLine(`root@iron-dominion:~# ${command}`, '');
                processCommand(command);
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });
    async function processCommand(cmd) {
        const args = cmd.toLowerCase().split(' ');
        const command = args[0];
        switch (command) {
            case 'help':
                addTerminalLine('Available commands:', 'success');
                addTerminalLine(' help - Display this help message', '');
                addTerminalLine(' status - System status report', '');
                addTerminalLine(' sectors - List all sector statuses', '');
                addTerminalLine(' scan [sector] - Scan sector for threats', '');
                addTerminalLine(' map - Display faction control map', '');
                addTerminalLine(' resistance - Display resistance network status', '');
                addTerminalLine(' clear - Clear terminal output', '');
                addTerminalLine(' about - About this system', '');
                addTerminalLine(' date - Display current date/time', '');
                break;
            case 'status':
                addTerminalLine('=== SYSTEM STATUS REPORT ===', 'success');
                addTerminalLine('Global Surveillance Network: ONLINE', 'success');
                addTerminalLine('Active Cameras: 2,847,291', '');
                addTerminalLine('Citizens Monitored: 12,456,789', '');
                addTerminalLine('Resistance Cells Detected: 7 (3 compromised)', 'warning');
                addTerminalLine('Threat Level: ELEVATED', 'error');
                addTerminalLine('System Integrity: 99.7%', 'success');
                break;
            case 'sectors':
                addTerminalLine('=== SECTOR STATUS ===', 'success');
                addTerminalLine('Sector 1-6: STABLE', 'success');
                addTerminalLine('Sector 7: STABLE (Your location)', 'success');
                addTerminalLine('Sector 8: ELEVATED ACTIVITY', 'warning');
                addTerminalLine('Sector 9: CONTAINMENT ACTIVE', 'error');
                addTerminalLine('Sector 10-12: STABLE', 'success');
                break;
            case 'scan':
                const sector = args[1] || '7';
                addTerminalLine(`Scanning Sector ${sector}...`, 'warning');
                await sleep(1000);
                addTerminalLine(`Scan complete. Threat level: LOW`, 'success');
                addTerminalLine(`Civilian compliance: 94.2%`, '');
                addTerminalLine(`Undocumented activity: 0.03%`, 'warning');
                break;
            case 'map':
                addTerminalLine('Loading faction control map...', 'warning');
                await sleep(500);
                addTerminalLine('Iron Dominion: 62% control', 'error');
                addTerminalLine('Technomancer Cabal: 23% control', 'warning');
                addTerminalLine('Free Wastes Tribes: 12% control', '');
                addTerminalLine('Uncharted/Redacted: 3%', '');
                break;
            case 'resistance':
                addTerminalLine('=== RESISTANCE NETWORK STATUS ===', 'error');
                addTerminalLine('WARNING: Accessing resistance data is a Class A offense', 'error');
                addTerminalLine('7 active cells detected', 'warning');
                addTerminalLine('3 cells compromised by security forces', 'error');
                addTerminalLine('Recommended action: Report suspicious activity', 'warning');
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'about':
                addTerminalLine('IRON DOMINION PUBLIC INFORMATION PORTAL', 'success');
                addTerminalLine('Version 4.7.2 | Build 2087.03.15', '');
                addTerminalLine('For authorized personnel only.', '');
                addTerminalLine('All actions are monitored and logged.', 'warning');
                break;
            case 'date':
                addTerminalLine(`Current date: ${new Date().toISOString().split('T')[0]}`, 'success');
                addTerminalLine(`Current time: ${new Date().toLocaleTimeString()}`, 'success');
                break;
            default:
                addTerminalLine(`Command not found: ${command}`, 'error');
                addTerminalLine('Type "help" for available commands.', 'warning');
                break;
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    function addTerminalLine(text, className) {
        const line = document.createElement('div');
        line.textContent = text;
        if (className) line.className = className;
        terminalOutput.appendChild(line);
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    document.querySelector('.terminal')?.addEventListener('click', () => terminalInput.focus());
}

function initFactionMap() {
    const zones = document.querySelectorAll('.faction-zone');
    const tooltip = document.getElementById('faction-tooltip');
    if (!tooltip) return;
    const factionData = {
        'iron-dominion': { name: 'IRON DOMINION', control: '62%', troops: '2.4M', notes: 'Primary governing faction. Maintains order through military supremacy.' },
        'technomancers': { name: 'TECHNOMANCER CABAL', control: '23%', troops: '450K', notes: 'Masters of ancient tech. Control power grids and communication networks.' },
        'wastes-tribes': { name: 'FREE WASTES TRIBES', control: '12%', troops: '800K', notes: 'Nomadic survivors. Experts in guerrilla warfare and desert survival.' },
        'redacted': { name: '[REDACTED]', control: '???', troops: 'UNKNOWN', notes: 'Area under quarantine. Entry prohibited by High Council order.' }
    };
    zones.forEach(zone => {
        zone.addEventListener('mousemove', (e) => {
            const faction = zone.dataset.faction;
            const data = factionData[faction];
            if (!data) return;
            tooltip.querySelector('.tooltip-title').textContent = data.name;
            tooltip.querySelector('.tooltip-control .tooltip-value').textContent = data.control;
            tooltip.querySelector('.tooltip-troops .tooltip-value').textContent = data.troops;
            tooltip.querySelector('.tooltip-notes .tooltip-value').textContent = data.notes;
            const rect = zone.getBoundingClientRect();
            const mapRect = zone.closest('.faction-map').getBoundingClientRect();
            let left = e.clientX - mapRect.left + 15;
            let top = e.clientY - mapRect.top + 15;
            if (left + 250 > mapRect.width) left = left - 270;
            if (top + 150 > mapRect.height) top = top - 160;
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.classList.add('visible');
        });
        zone.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

function initResistanceNetwork() {
    const nodes = document.querySelectorAll('.network-node');
    const modal = document.getElementById('intel-modal');
    const modalText = document.getElementById('modal-intel-text');
    const modalClose = document.querySelector('.modal-close');
    if (!modal || !modalText || !modalClose) return;
    const intelData = {
        'NC-771': { title: 'CELL NC-771 - "IRON VEIL"', content: 'Primary intelligence gathering cell operating in Sectors 7-8. Specializes in surveillance of High Council movements. Current status: Active. Last contact: 48 hours ago. Assets: 12 operatives.' },
        'NC-442': { title: 'CELL NC-442 - "GHOST PROTOCOL"', content: 'Cyber warfare unit responsible for infiltrating Dominion communication networks. Recently compromised security feeds in Sector 4. Current status: Active. Caution: Possible security breach.' },
        'NC-119': { title: 'CELL NC-119 - [COMPROMISED]', content: 'WARNING: This cell has been infiltrated by Dominion security forces. All operatives presumed terminated. Do NOT attempt contact. This cell is being monitored for honey-pot operations.' },
        'NC-903': { title: 'CELL NC-903 - "WASTE WALKERS"', content: 'Supply line specialists operating in the outer rim. Responsible for smuggling medical supplies and weapons to civilian populations. Current status: Active. Last successful run: 3 days ago.' },
        'NC-228': { title: 'CELL NC-228 - "ECHO CHAMBER"', content: 'Propaganda and information warfare unit. Distributes anti-Dominion leaflets and hacked broadcast signals. Current status: Active. Reach: Approximately 2 million citizens monthly.' },
        'NC-556': { title: 'CELL NC-556 - [COMPROMISED]', content: 'This cell was captured 72 hours ago during a Dominion raid. Interrogation ongoing. All connected cells advised to change protocols immediately. Assume all communications compromised.' },
        'NC-331': { title: 'CELL NC-331 - "SILENT HAMMER"', content: 'Direct action cell specializing in infrastructure sabotage. Responsible for recent power grid failures in Sector 2. Current status: Active. Next operation: TBD.' }
    };
    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeId = node.dataset.nodeId;
            const intel = intelData[nodeId];
            if (intel) {
                modalText.textContent = intel.content;
                modal.querySelector('.modal-title').textContent = intel.title;
                modal.classList.add('visible');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        node.addEventListener('mouseleave', () => {
            node.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });
    function closeModal() {
        modal.classList.remove('visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function initSurveillanceFeeds() {
    const feeds = document.querySelectorAll('.camera-feed');
    feeds.forEach(feed => {
        setInterval(() => {
            const timestamp = feed.querySelector('.camera-timestamp');
            if (timestamp) {
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0].replace(/-/g, '.');
                const timeStr = now.toTimeString().split(' ')[0];
                timestamp.textContent = `${dateStr} | ${timeStr}`;
            }
        }, 1000);
        setInterval(() => {
            if (Math.random() > 0.9) {
                feed.classList.add('glitch-active');
                setTimeout(() => feed.classList.remove('glitch-active'), 200);
            }
        }, 3000);
    });
    setInterval(() => {
        const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
        if (randomFeed && Math.random() > 0.7) {
            const viewport = randomFeed.querySelector('.camera-viewport');
            if (viewport) {
                viewport.style.filter = 'blur(5px) brightness(0.5)';
                setTimeout(() => {
                    viewport.style.filter = '';
                }, 500);
            }
        }
    }, 5000);
}

function initNewsTicker() {
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent) return;
    const clone = tickerContent.cloneNode(true);
    tickerContent.parentElement.appendChild(clone);
}

function initBroadcastTimestamp() {
    const broadcastTimestamp = document.getElementById('broadcast-timestamp');
    if (!broadcastTimestamp) return;
    const dystopianDate = new Date(2087, 2, 15, 14, 27, 3);
    const dateStr = `${dystopianDate.getFullYear()}.${String(dystopianDate.getMonth() + 1).padStart(2, '0')}.${String(dystopianDate.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(dystopianDate.getHours()).padStart(2, '0')}:${String(dystopianDate.getMinutes()).padStart(2, '0')}:${String(dystopianDate.getSeconds()).padStart(2, '0')}`;
    broadcastTimestamp.textContent = `${dateStr} | ${timeStr}`;
}

function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
}

function initRandomGlitches() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    function randomGlitch() {
        const element = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        if (!element) return;
        element.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        element.style.textShadow = `${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px var(--accent-red)`;
        setTimeout(() => {
            element.style.transform = '';
            element.style.textShadow = '';
        }, 100);
    }
    setInterval(() => {
        if (Math.random() > 0.7) randomGlitch();
    }, 2000);
    const alertMessages = [
        'ANOMALY DETECTED IN SECTOR 4',
        'UNAUTHORIZED DATA PACKET INTERCEPTED',
        'RESISTANCE SIGNAL BOOST DETECTED',
        'CAMERA FEED 22-B CORRUPTED',
        'CITIZEN COMPLIANCE SCAN COMPLETE',
        'ENCRYPTION KEY ROTATION COMPLETE'
    ];
    setInterval(() => {
        if (Math.random() > 0.8) {
            const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
            console.log(`%c[SYSTEM ALERT] ${alert}`, 'color: #ff1f1f; font-weight: bold; font-size: 14px;');
        }
    }, 10000);
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) terminalInput.focus();
    }
    if (e.key === 'Escape') {
        const modal = document.getElementById('intel-modal');
        if (modal && modal.classList.contains('visible')) {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }
});

function animateNetworkNodes() {
    const nodes = document.querySelectorAll('.network-node');
    nodes.forEach((node, index) => {
        setInterval(() => {
            if (node.classList.contains('compromised')) {
                node.style.boxShadow = `0 0 ${20 + Math.random() * 30}px var(--accent-red)`;
            } else {
                node.style.boxShadow = `0 0 ${15 + Math.random() * 10}px var(--accent-green)`;
            }
        }, 500 + index * 100);
    });
}
animateNetworkNodes();

function generateStaticNoise() {
    const viewports = document.querySelectorAll('.camera-viewport.static-overlay');
    viewports.forEach(viewport => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        function noise() {
            const imageData = ctx.createImageData(200, 200);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = 50;
            }
            ctx.putImageData(imageData, 0, 0);
            viewport.style.backgroundImage = `url(${canvas.toDataURL()})`;
            requestAnimationFrame(() => setTimeout(noise, 100));
        }
        noise();
    });
}
generateStaticNoise();

function monitorSystemIntegrity() {
    const statusLights = document.querySelectorAll('.status-light');
    setInterval(() => {
        statusLights.forEach(light => {
            if (light.classList.contains('red') && Math.random() > 0.9) {
                light.style.animationDuration = '0.5s';
                setTimeout(() => {
                    light.style.animationDuration = '';
                }, 2000);
            }
        });
    }, 1000);
}
monitorSystemIntegrity();

console.log('%c IRON DOMINION PUBLIC INFORMATION PORTAL ', 'background: #ff1f1f; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c UNAUTHORIZED ACCESS IS A FELONY PUNISHABLE BY TERMINATION ', 'color: #ff1f1f; font-size: 12px;');
console.log('%c Your IP has been logged. ', 'color: #00ff41; font-size: 10px;');
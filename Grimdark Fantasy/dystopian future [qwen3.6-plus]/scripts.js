/* ═══════════════════════════════════════════════════════════ */
/*  OMEGA TERMINAL // JAVASCRIPT                             */
/*  Functionality: Boot sequence, Navigation, Canvas Map,    */
/*  Real-time simulation, Emergency protocols.               */
/* ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── GLOBAL STATE ───
    const state = {
        bootComplete: false,
        currentSection: 'propaganda',
        sessionStartTime: Date.now(),
        emergencyTriggered: false,
        nextEmergencyTime: getRandomInt(60000, 120000) // Random time between 1-2 mins
    };

    // ─── DOM ELEMENTS ───
    const els = {
        bootScreen: document.getElementById('boot-sequence'),
        bootLines: document.querySelectorAll('.boot-line'),
        mainTerminal: document.getElementById('main-terminal'),
        navTabs: document.querySelectorAll('.nav-tab'),
        sections: document.querySelectorAll('.content-section'),
        systemClock: document.getElementById('system-clock'),
        sessionTime: document.getElementById('session-time'),
        pingValue: document.getElementById('ping-value'),
        emergencyOverlay: document.getElementById('emergency-broadcast'),
        emergencyText: document.getElementById('emergency-text'),
        traceCountdown: document.getElementById('trace-countdown'),
        cursor: document.getElementById('custom-cursor'),
        networkCanvas: document.getElementById('network-canvas'),
        feedTimes: document.querySelectorAll('.feed-timestamp')
    };

    // ─── 1. BOOT SEQUENCE ───
    function runBootSequence() {
        let lines = Array.from(els.bootLines);
        let maxDelay = 0;

        lines.forEach(line => {
            const delay = parseInt(line.getAttribute('data-delay')) || 0;
            if (delay > maxDelay) maxDelay = delay;

            setTimeout(() => {
                line.classList.add('visible');
            }, delay);
        });

        // Handle Boot Completion
        setTimeout(() => {
            completeBoot();
        }, maxDelay + 800);

        // Skip Functionality
        const skipHandler = () => {
            completeBoot();
            document.removeEventListener('keydown', skipHandler);
            document.removeEventListener('click', skipHandler);
        };

        document.addEventListener('keydown', skipHandler);
        document.addEventListener('click', skipHandler);
    }

    function completeBoot() {
        if (state.bootComplete) return;
        state.bootComplete = true;

        els.bootScreen.style.opacity = '0';
        els.bootScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            els.bootScreen.classList.add('hidden');
            els.mainTerminal.classList.remove('hidden');
            initTerminal();
        }, 500);
    }

    // ─── 2. TERMINAL INITIALIZATION ───
    function initTerminal() {
        startClocks();
        initNavigation();
        initCustomCursor();
        initResistanceNetwork();
        scheduleEmergency();
        
        // Random glitch effects on text
        setInterval(triggerRandomGlitch, 5000);
    }

    // ─── 3. NAVIGATION ───
    function initNavigation() {
        els.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetSection = tab.getAttribute('data-section');
                switchSection(targetSection);
            });
        });
    }

    function switchSection(sectionId) {
        if (state.currentSection === sectionId) return;
        
        // Update Tabs
        els.navTabs.forEach(t => {
            t.classList.remove('active');
            if (t.getAttribute('data-section') === sectionId) {
                t.classList.add('active');
            }
        });

        // Update Sections
        els.sections.forEach(s => {
            s.classList.remove('active');
            if (s.getAttribute('data-section') === sectionId) {
                s.classList.add('active');
            }
        });

        state.currentSection = sectionId;

        // Section specific logic
        if (sectionId === 'resistance') {
            resizeNetworkCanvas();
        }
    }

    // ─── 4. CLOCK & SIMULATION ───
    function startClocks() {
        // System Clock (Fictional Future Date)
        // Base: 2187.03.15 04:23:17
        let baseTime = new Date(2187, 2, 15, 4, 23, 17).getTime();
        
        // Update Loop
        setInterval(() => {
            // Advance time faster than real time (e.g., 10x speed)
            baseTime += 1000; 
            const date = new Date(baseTime);
            
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            
            els.systemClock.textContent = `${yyyy}.${mm}.${dd} // ${hh}:${min}:${ss}`;

            // Update Feed Timestamps
            els.feedTimes.forEach(t => t.textContent = `${hh}:${min}:${ss}`);

            // Session Timer
            const elapsed = Date.now() - state.sessionStartTime;
            const sessionDate = new Date(elapsed);
            els.sessionTime.textContent = 
                `${String(sessionDate.getUTCHours()).padStart(2,'0')}:` +
                `${String(sessionDate.getUTCMinutes()).padStart(2,'0')}:` +
                `${String(sessionDate.getUTCSeconds()).padStart(2,'0')}`;

            // Ping Fluctuation
            const ping = getRandomInt(18, 45);
            els.pingValue.textContent = `${ping}ms`;
            if (ping > 40) els.pingValue.style.color = 'var(--accent-warn)';
            else els.pingValue.style.color = 'var(--term-primary)';

        }, 1000); // Update every second real time (representing 10x game time)
    }

    // ─── 5. CUSTOM CURSOR ───
    function initCustomCursor() {
        document.addEventListener('mousemove', (e) => {
            els.cursor.style.left = e.clientX + 'px';
            els.cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('button, .nav-tab, .map-sector, .broadcast-card, .node-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => els.cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => els.cursor.classList.remove('hovering'));
        });
    }

    // ─── 6. RESISTANCE NETWORK CANVAS ───
    let networkCtx = null;
    let networkNodes = [];
    let networkPackets = [];
    let networkAnimId = null;

    function initResistanceNetwork() {
        networkCtx = els.networkCanvas.getContext('2d');
        resizeNetworkCanvas();
        window.addEventListener('resize', resizeNetworkCanvas);
    }

    function resizeNetworkCanvas() {
        const container = els.networkCanvas.parentElement;
        els.networkCanvas.width = container.clientWidth;
        els.networkCanvas.height = container.clientHeight;
        
        if (state.currentSection === 'resistance') {
            generateNetworkNodes();
            if (!networkAnimId) drawNetwork();
        }
    }

    function generateNetworkNodes() {
        const w = els.networkCanvas.width;
        const h = els.networkCanvas.height;
        
        // Define nodes based on percentage positions for responsiveness
        const nodeDefs = [
            { id: 'NODE-01', name: 'PHANTOM', x: 0.5, y: 0.2, status: 'active' },
            { id: 'NODE-03', name: 'ECHO', x: 0.2, y: 0.4, status: 'active' },
            { id: 'NODE-05', name: 'WRAITH', x: 0.3, y: 0.7, status: 'active' },
            { id: 'NODE-07', name: 'SPECTRE', x: 0.8, y: 0.3, status: 'active' },
            { id: 'NODE-09', name: 'RAVEN', x: 0.7, y: 0.6, status: 'warning' },
            { id: 'NODE-11', name: 'VIPER', x: 0.85, y: 0.8, status: 'offline' },
            { id: 'NODE-13', name: 'SHADOW', x: 0.4, y: 0.85, status: 'active' },
            { id: 'NODE-15', name: 'GHOST', x: 0.15, y: 0.75, status: 'active' }
        ];

        networkNodes = nodeDefs.map(n => ({
            ...n,
            px: n.x * w,
            py: n.y * h
        }));

        // Define connections
        const connections = [
            [0, 1], [0, 3], [1, 2], [1, 7], [2, 6], 
            [3, 4], [4, 5], [6, 7], [0, 4], [3, 6]
        ];

        networkNodes.connections = connections;
        
        // Initialize packets
        networkPackets = [];
        for(let i=0; i<15; i++) {
            spawnPacket();
        }
    }

    function spawnPacket() {
        if (networkNodes.length < 2 || !networkNodes.connections) return;
        
        const connIdx = getRandomInt(0, networkNodes.connections.length - 1);
        const [startNodeIdx, endNodeIdx] = networkNodes.connections[connIdx];
        const startNode = networkNodes[startNodeIdx];
        const endNode = networkNodes[endNodeIdx];

        networkPackets.push({
            startX: startNode.px,
            startY: startNode.py,
            endX: endNode.px,
            endY: endNode.py,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01
        });
    }

    function drawNetwork() {
        const ctx = networkCtx;
        const w = els.networkCanvas.width;
        const h = els.networkCanvas.height;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Grid Background
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        
        for(let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for(let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Connections
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.2)';
        ctx.lineWidth = 2;
        networkNodes.connections.forEach(([startIdx, endIdx]) => {
            const start = networkNodes[startIdx];
            const end = networkNodes[endIdx];
            
            ctx.beginPath();
            ctx.moveTo(start.px, start.py);
            ctx.lineTo(end.px, end.py);
            ctx.stroke();
        });

        // Packets (Data Flow)
        ctx.fillStyle = 'rgba(110, 231, 183, 0.8)';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(110, 231, 183, 0.8)';
        
        for (let i = networkPackets.length - 1; i >= 0; i--) {
            const p = networkPackets[i];
            p.progress += p.speed;
            
            if (p.progress >= 1) {
                networkPackets.splice(i, 1);
                spawnPacket();
                continue;
            }

            const x = p.startX + (p.endX - p.startX) * p.progress;
            const y = p.startY + (p.endY - p.startY) * p.progress;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Nodes
        networkNodes.forEach(node => {
            // Node Outer Ring
            ctx.beginPath();
            ctx.arc(node.px, node.py, 8, 0, Math.PI * 2);
            
            if (node.status === 'active') {
                ctx.strokeStyle = '#34d399';
                ctx.shadowColor = '#34d399';
            } else if (node.status === 'warning') {
                ctx.strokeStyle = '#f59e0b';
                ctx.shadowColor = '#f59e0b';
            } else {
                ctx.strokeStyle = '#6b7280';
                ctx.shadowColor = 'transparent';
            }
            
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Node Inner Dot
            ctx.beginPath();
            ctx.arc(node.px, node.py, 3, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();

            // Node Label
            ctx.fillStyle = '#9ca3af';
            ctx.font = '10px "Share Tech Mono"';
            ctx.fillText(node.name, node.px + 12, node.py + 4);
        });

        networkAnimId = requestAnimationFrame(drawNetwork);
    }

    // ─── 7. EMERGENCY BROADCAST ───
    function scheduleEmergency() {
        setTimeout(() => {
            triggerEmergency();
        }, state.nextEmergencyTime);
    }

    function triggerEmergency() {
        if (state.emergencyTriggered) return; // One time for impact
        state.emergencyTriggered = true;

        els.emergencyOverlay.classList.remove('hidden');
        
        let count = 30;
        els.traceCountdown.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            els.traceCountdown.textContent = count;
            if (count <= 0) {
                clearInterval(countdownInterval);
                // Simulate disconnect/crash or just fade out
                document.body.innerHTML = '<div style="background:black;color:red;display:flex;justify-content:center;align-items:center;height:100vh;font-family:monospace;font-size:2rem;">CONNECTION TERMINATED BY HOST</div>';
            }
        }, 1000);

        // Dismissal
        const dismissHandler = (e) => {
            // Prevent dismissal if key is pressed immediately
            if (e.type === 'keydown' && count > 20) return; 
            
            els.emergencyOverlay.classList.add('hidden');
            document.removeEventListener('keydown', dismissHandler);
            document.removeEventListener('click', dismissHandler);
            clearInterval(countdownInterval);
            
            // Schedule next emergency
            state.emergencyTriggered = false;
            state.nextEmergencyTime = getRandomInt(45000, 90000);
            scheduleEmergency();
        };

        document.addEventListener('keydown', dismissHandler);
        document.addEventListener('click', dismissHandler);
    }

    // ─── 8. GLITCH EFFECTS ───
    function triggerRandomGlitch() {
        if (!state.bootComplete) return;
        
        const textElements = document.querySelectorAll('.glitch-text');
        if (textElements.length === 0) return;

        const randomEl = textElements[Math.floor(Math.random() * textElements.length)];
        randomEl.style.animation = 'none';
        randomEl.offsetHeight; /* trigger reflow */
        randomEl.style.animation = null; 
    }

    // ─── 9. UTILITIES ───
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ─── START ───
    runBootSequence();
});
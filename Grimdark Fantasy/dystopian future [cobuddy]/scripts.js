document.addEventListener('DOMContentLoaded', () => {

    // ===== LIVE CLOCK =====
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const display = document.getElementById('timeDisplay');
        if (display) {
            display.textContent = `${hours}:${minutes}:${seconds}`;
        }
        const broadcastTime = document.getElementById('broadcastTime');
        if (broadcastTime) {
            broadcastTime.textContent = 'LIVE';
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ===== BROADCAST FREQUENCY CYCLE =====
    const freqDisplay = document.getElementById('broadcastFreq');
    const frequencies = [
        '■■■.■■ MHZ',
        '147.3 MHZ',
        '■■■.■■ MHZ',
        '89.1 MHZ',
        '■■■.■■ MHZ',
        '203.7 MHZ',
        '■■■.■■ MHZ',
        '55.0 MHZ'
    ];
    let freqIndex = 0;
    setInterval(() => {
        if (freqDisplay) {
            freqIndex = (freqIndex + 1) % frequencies.length;
            freqDisplay.textContent = frequencies[freqIndex];
        }
    }, 3000);

    // ===== DATA STREAM AUTO-APPEND =====
    const dataStream = document.getElementById('dataStream');
    const streamTemplates = [
        { time: '', data: 'SYS::HEARTBEAT… OK', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'NET::ROUTING_CHECK — ALL NODES', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'AUD::FEED_12A — SCANNING', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'ENC::KEY_ROTATE — SUCCESS', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'SYS::MEMORY_WIPE — SECTOR 7', status: 'warn', statusSymbol: '⚠' },
        { time: '', data: 'RES::NODE_ALPHA — RETRYING', status: 'fail', statusSymbol: '✗' },
        { time: '', data: 'NET::DARKNET_PROBE — BLOCKED', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'SYS::BUFFER_FLUSH — 2.1GB CLEARED', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'ENC::DECRYPT_FAIL [0x7F3A]', status: 'fail', statusSymbol: '✗' },
        { time: '', data: 'AUD::FEED_12C — MOTION DETECTED', status: 'warn', statusSymbol: '⚠' },
        { time: '', data: '[REDACTED — CLEARANCE 6+]', status: 'redacted', statusSymbol: '■' },
        { time: '', data: 'RES::CENSUS — 4.7M ACTIVE', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'SYS::CONVERGENCE_PHASE — 3/7', status: 'ok', statusSymbol: '✓' },
        { time: '', data: 'ERR::BUFFER_OVERFLOW [0xDEAD]', status: 'fail', statusSymbol: '✗' },
        { time: '', data: 'NET::NODE_BETA — SIGNAL FLUCTUATION', status: 'warn', statusSymbol: '⚠' },
    ];

    function appendStreamLine() {
        if (!dataStream) return;
        const now = new Date();
        const secs = String(now.getSeconds()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const hrs = String(now.getHours()).padStart(2, '0');
        const template = streamTemplates[Math.floor(Math.random() * streamTemplates.length)];
        const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${secs}`;

        const line = document.createElement('div');
        line.className = `stream-line ${template.status === 'fail' ? 'corrupted' : ''} ${template.status === 'redacted' ? 'redacted' : ''}`;
        line.innerHTML = `
            <span class="stream-time">${timeStr}</span>
            <span class="stream-data">${template.data}</span>
            <span class="stream-status ${template.status}">${template.statusSymbol}</span>
        `;

        dataStream.appendChild(line);
        dataStream.scrollTop = dataStream.scrollHeight;

        const maxLines = 30;
        while (dataStream.children.length > maxLines) {
            dataStream.removeChild(dataStream.firstChild);
        }
    }

    setInterval(appendStreamLine, 2500);

    // ===== PACKETS PER SECOND FLUCTUATION =====
    const packetsDisplay = document.getElementById('packetsPerSec');
    function updatePackets() {
        if (packetsDisplay) {
            const base = 1247;
            const variation = Math.floor(Math.random() * 200) - 100;
            packetsDisplay.textContent = (base + variation).toLocaleString();
        }
    }
    setInterval(updatePackets, 1500);

    // ===== CORRUPTION RATE FLUCTUATION =====
    const corruptionDisplay = document.getElementById('corruptionRate');
    function updateCorruption() {
        if (corruptionDisplay) {
            const rate = (2.5 + Math.random() * 2).toFixed(1);
            corruptionDisplay.textContent = `${rate}%`;
        }
    }
    setInterval(updateCorruption, 3000);

    // ===== CAM TIMESTAMPS =====
    const camTimes = document.querySelectorAll('.cam-time');
    function updateCamTimestamps() {
        camTimes.forEach(el => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            el.textContent = `${h}:${m}:${s}`;
        });
    }
    setInterval(updateCamTimestamps, 1000);

    // ===== RANDOM CAM ALERT TRIGGER =====
    const camFeeds = document.querySelectorAll('.cam-feed');
    function triggerCamAlert() {
        const randomCam = camFeeds[Math.floor(Math.random() * camFeeds.length)];
        randomCam.classList.add('cam-feed-alert');
        setTimeout(() => {
            randomCam.classList.remove('cam-feed-alert');
        }, 4000);
    }
    setInterval(triggerCamAlert, 8000);

    // ===== TRACE ID REGENERATION =====
    const traceIdDisplay = document.getElementById('traceId');
    function generateTraceId() {
        const chars = '0123456789ABCDEF';
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        id += '-';
        id += chars[Math.floor(Math.random() * chars.length)];
        id += '-';
        for (let i = 0; i < 4; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return id;
    }
    setInterval(() => {
        if (traceIdDisplay) {
            traceIdDisplay.textContent = generateTraceId();
        }
    }, 5000);

    // ===== GLITCH BURST ON MAIN TITLE =====
    const mainTitle = document.querySelector('.main-title');
    function triggerGlitchBurst() {
        if (!mainTitle) return;
        mainTitle.style.animation = 'none';
        void mainTitle.offsetHeight;
        mainTitle.style.animation = 'title-glow 3s ease-in-out infinite';
        mainTitle.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`;
        setTimeout(() => {
            mainTitle.style.transform = 'translate(0, 0)';
        }, 150);
    }
    setInterval(triggerGlitchBurst, 6000);

    // ===== REDACTED TEXT REVEAL/RE-HIDE =====
    const redactedTexts = document.querySelectorAll('.redacted-text, .redacted');
    function cycleRedacted() {
        redactedTexts.forEach(el => {
            if (Math.random() > 0.7) {
                const original = el.textContent;
                el.style.transition = 'opacity 0.3s';
                el.style.opacity = '0.2';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 200);
            }
        });
    }
    setInterval(cycleRedacted, 4000);

    // ===== INDICATOR STATUS CYCLING =====
    const indicators = document.querySelectorAll('.indicator');
    const statuses = ['active', 'active', 'active', 'flickering', 'active', 'inactive'];
    function cycleIndicators() {
        indicators.forEach(ind => {
            if (Math.random() > 0.85) {
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                ind.className = `indicator ${randomStatus}`;
            }
        });
    }
    setInterval(cycleIndicators, 5000);

    // ===== MAP CELL HOVER EFFECT ENHANCEMENT =====
    const mapCells = document.querySelectorAll('.map-cell');
    mapCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            cell.style.transform = 'scale(1.02)';
            cell.style.zIndex = '1';
        });
        cell.addEventListener('mouseleave', () => {
            cell.style.transform = 'scale(1)';
            cell.style.zIndex = '0';
        });
    });

    // ===== RESISTANCE NODE ACTIVITY BAR FLUCTUATION =====
    const activityFills = document.querySelectorAll('.activity-fill');
    function fluctuateActivity() {
        activityFills.forEach(fill => {
            const currentWidth = parseFloat(fill.style.width);
            const change = (Math.random() - 0.5) * 10;
            const newWidth = Math.max(5, Math.min(100, currentWidth + change));
            fill.style.width = `${newWidth}%`;
        });
    }
    setInterval(fluctuateActivity, 2000);

    // ===== UPTIME FLUCTUATION =====
    const uptimeDisplay = document.getElementById('uptime');
    let uptimeDays = 847;
    let uptimeHours = 14;
    function updateUptime() {
        if (uptimeDisplay) {
            uptimeHours++;
            if (uptimeHours >= 24) {
                uptimeHours = 0;
                uptimeDays++;
            }
            uptimeDisplay.textContent = `${uptimeDays}d ${uptimeHours}h`;
        }
    }
    setInterval(updateUptime, 10000);

    // ===== TICKER CONTENT ENHANCEMENT =====
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const items = [
            'CITIZEN COMPLIANCE MONITORING: ACTIVE',
            'SECTOR 7 QUARANTINE IN EFFECT',
            'RESISTANCE NETWORK NODES: ██ DETECTED',
            'FOUNDATION DAY CELEBRATION — ALL UNITS REPORT',
            'PROPAGANDA BROADCAST QUALITY: NOMINAL',
            'CONVERGENCE PROTOCOL PHASE 3 INITIATED',
            '[ENCRYPTED]',
            'CIVIL HARMONY INDEX: 94.2%',
            'DARKNET INTERCEPTIONS: 14 TODAY',
            'SECTOR 12 RECONNAISSANCE PENDING',
            'NODE_DELTA STATUS: COMPROMISED — TRAP CONFIRMED',
            'ALL CITIZENS MUST REPORT FOR SCHEDULED COMPLIANCE AUDIT'
        ];
        const doubledItems = items.concat(items);
        const fullText = doubledItems.map(item => `<span>${item}</span><span>•</span>`).join('');
        tickerContent.innerHTML = fullText;
    }

    // ===== SURVEILLANCE NOISE INTENSITY FLUCTUATION =====
    const camNoises = document.querySelectorAll('.cam-noise');
    function fluctuateNoise() {
        camNoises.forEach(noise => {
            const intensity = 0.02 + Math.random() * 0.04;
            noise.style.opacity = intensity;
        });
    }
    setInterval(fluctuateNoise, 1000);

    // ===== SPEAKER TRANSCRIPT GLITCH =====
    const glitchWord = document.querySelector('.glitch-word');
    if (glitchWord) {
        setInterval(() => {
            if (Math.random() > 0.8) {
                glitchWord.style.color = '#8b0000';
                glitchWord.style.textShadow = '2px 0 #fff, -2px 0 #8b0000';
                setTimeout(() => {
                    glitchWord.style.color = '';
                    glitchWord.style.textShadow = '';
                }, 200);
            }
        }, 3000);
    }

    // ===== DATA STREAM SCROLL INDICATOR =====
    const dataStreamContainer = document.querySelector('.data-stream-container');
    if (dataStreamContainer) {
        let scrollTimeout;
        dataStreamContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // smooth scroll to bottom
            }, 100);
        });
    }

    // ===== INITIAL SECTION REVEAL =====
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // ===== LOADING SCREEN EFFECT =====
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 1.5s ease-in';
    setTimeout(() => {
        body.style.opacity = '1';
    }, 100);

    // ===== RANDOM CONSOLE MESSAGES (dev easter egg) =====
    console.log('%c⚠ UNAUTHORIZED ACCESS DETECTED ⚠', 'color: #8b0000; font-size: 20px; font-weight: bold;');
    console.log('%cTRACE ID: ' + generateTraceId(), 'color: #c4943a; font-size: 12px;');
    console.log('%cThis broadcast is monitored. Your IP has been logged.', 'color: #7a7570; font-size: 10px;');
});